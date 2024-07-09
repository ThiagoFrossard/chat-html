import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, onChildAdded, onChildChanged, ref as refDb } from "firebase/database";
import { getDownloadURL, getStorage, listAll, ref as refStorage } from "firebase/storage";
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import Cardscreen from '../CardScreen/Cardscreen';

type TalkData = {
    id: string;
    lastMessage: {
        fileImage: string,
        idMessage: string,
        idTalk: string,
        media: string,
        mediaName: string,
        message: string,
        read: Number[],
        response: boolean,
        sender: string,
        senderName: string,
        status: string,
        statusEnviado: Number[],
        statusLido: Number[],
        statusRecebido: Number[],
        timestamp: number,
        type: string
    };
    tipo: string;
    user1: {
        cargo: string,
        cod: string,
        imagem: string,
        nome: string,
        platform: string,
        status: string,
        token: string
    };
    user2: {
        cargo: string,
        cod: string,
        imagem: string,
        nome: string,
        platform: string,
        status: string,
        token: string
    };
};

type Member = {
    cor: string;
    member: {
        cod: string;
        imagem: string;
        nome: string;
        status: string;
        token: string;
    };
    timestampFinish: string;
    timestampStart: string;
};

type GroupData = {
    id: string;
    lastMessage: {
        fileImage: string,
        idMessage: string,
        idTalk: string,
        media: string,
        mediaName: string,
        message: string,
        read: Number[],
        response: boolean,
        sender: string,
        senderName: string,
        status: string,
        statusEnviado: Number[],
        statusLido: Number[],
        statusRecebido: Number[],
        timestamp: number,
        type: string
    };
    imagem: string;
    members: Member[];
    tipo: string;
    nome: string;
    restringirMensagem: boolean;
};

type Chat = TalkData | GroupData

interface ChatscreenProps {
    onButtonClick: (newState: string, newType: string) => void;
}

const Chatscreen: React.FC<ChatscreenProps> = ({ onButtonClick }) => {
    const [chats, setChats] = useState<Chat[]>([]);

    const firebaseConfig = {
        apiKey: "AIzaSyAOet6ztiBd15SJ7GhZS6WH1tBd8q9-cOo",
        authDomain: "sinapse-neurocare-53ffc.firebaseapp.com",
        projectId: "sinapse-neurocare-53ffc",
        storageBucket: "sinapse-neurocare-53ffc.appspot.com",
        messagingSenderId: "247071047127",
        appId: "1:247071047127:web:ed6487ff5f8088a8b55f92",
        measurementId: "G-0PLBNLT4HE",
        databaseURL: "https://sinapse-neurocare-53ffc-default-rtdb.firebaseio.com/"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const storage = getStorage(app)
    const userData = useLocalSearchParams();

    const [imagem, setImagem] = useState("")

    const pegarImagem = async () => {
        const folderRef = refStorage(storage, `Perfil/${userData.endereco}/`);
        const folderSnapshot = await listAll(folderRef);
        const files = folderSnapshot.items;

        if (files.length != 0) {
            const newestImageRef = files[0];
            const url = await getDownloadURL(newestImageRef);

            setImagem(url)

        }
    }

    useEffect(() => {
        pegarImagem();
    }, []);

    const messagesRef = refDb(database, 'talk');

    useEffect(() => {

        const addItemIfNotExists = (prevChats: any[], data: { id: any; lastMessage?: { fileImage: string; idMessage: string; idTalk: string; media: string; mediaName: string; message: string; read: Number[]; response: boolean; sender: string; senderName: string; status: string; statusEnviado: Number[]; statusLido: Number[]; statusRecebido: Number[]; timestamp: number; type: string; }; tipo?: string; user1?: { cargo: string; cod: string; imagem: string; nome: string; platform: string; status: string; token: string; }; user2?: { cargo: string; cod: string; imagem: string; nome: string; platform: string; status: string; token: string; }; }) => {
            const indexToUpdate = prevChats.findIndex(item => item.id === data.id);
            if (indexToUpdate !== -1) {
                return prevChats;
            } else {
                // O item não existe no array, adicione-o no início
                const updatedGroup = [data, ...prevChats];
                return updatedGroup;
            }
        };

        const handleChildAdded = (snapshot: any) => {
            const data: TalkData = snapshot.val();
            if (data.user2.cod == userData.endereco || data.user1.cod == userData.endereco) {
                setChats(prevChats => addItemIfNotExists(prevChats, data));
            }
        };

        const handleChildChanged = (snapshot: any) => {
            const data: TalkData = snapshot.val();
            if (data.user2.cod == userData.endereco || data.user1.cod == userData.endereco) {
                setChats(prevChats => updateOrReplaceItem(prevChats, data));
            }
        };

        const updateOrReplaceItem = (prevChats, data) => {
            const indexToUpdate = prevChats.findIndex(item => item.id === data.id);

            if (indexToUpdate !== -1) {
                const itemToUpdate = prevChats[indexToUpdate];

                if (itemToUpdate.lastMessage.idMessage != data.lastMessage.idMessage) {
                    // Remove o item antigo e adiciona o novo no início do array
                    const updatedGroup = [data, ...prevChats.slice(0, indexToUpdate), ...prevChats.slice(indexToUpdate + 1)];
                    return updatedGroup;
                } else {
                    // Atualiza apenas o status na mesma posição do array
                    const updatedItem = {
                        ...data
                    };
                    const updatedGroup = [...prevChats.slice(0, indexToUpdate), updatedItem, ...prevChats.slice(indexToUpdate + 1)];
                    return updatedGroup;
                }
            }

            return prevChats;
        }

        const unsubscribe = onChildAdded(messagesRef, handleChildAdded);
        const unsubscribe2 = onChildChanged(messagesRef, handleChildChanged);

        return () => {
            unsubscribe();
            unsubscribe2();
        };
    }, [userData]);

    const messagesRef2 = refDb(database, 'group');

    useEffect(() => {

        const addItemIfNotExists = (prevChats: any[], data: { id: any; lastMessage?: { fileImage: string; idMessage: string; idTalk: string; media: string; mediaName: string; message: string; read: Number[]; response: boolean; sender: string; senderName: string; status: string; statusEnviado: Number[]; statusLido: Number[]; statusRecebido: Number[]; timestamp: number; type: string; }; tipo?: string; user1?: { cargo: string; cod: string; imagem: string; nome: string; platform: string; status: string; token: string; }; user2?: { cargo: string; cod: string; imagem: string; nome: string; platform: string; status: string; token: string; }; }) => {
            const indexToUpdate = prevChats.findIndex(item => item.id === data.id);
            if (indexToUpdate !== -1) {
                return prevChats;
            } else {
                // O item não existe no array, adicione-o no início
                const updatedGroup = [data, ...prevChats];
                return updatedGroup;
            }
        };

        const updateOrReplaceItem = (prevChats, data) => {
            const indexToUpdate = prevChats.findIndex(item => item.id === data.id);

            if (indexToUpdate !== -1) {
                const itemToUpdate = prevChats[indexToUpdate];

                if (itemToUpdate.lastMessage.idMessage != data.lastMessage.idMessage) {
                    // Remove o item antigo e adiciona o novo no início do array
                    const updatedGroup = [data, ...prevChats.slice(0, indexToUpdate), ...prevChats.slice(indexToUpdate + 1)];
                    return updatedGroup;
                } else {
                    // Atualiza apenas o status na mesma posição do array
                    const updatedItem = {
                        ...data
                    };
                    const updatedGroup = [...prevChats.slice(0, indexToUpdate), updatedItem, ...prevChats.slice(indexToUpdate + 1)];
                    return updatedGroup;
                }
            }

            return prevChats;
        }

        const handleChildAdded = (snapshot: any) => {
            const data: GroupData = snapshot.val();
            if (data.members.some(member => member.member.cod == userData.endereco)) {
                setChats(prevChats => addItemIfNotExists(prevChats, data));
            }
        };

        const handleChildChanged = (snapshot: any) => {
            const data: GroupData = snapshot.val();
            if (data.members.some(member => member.member.cod == userData.endereco)) {
                setChats(prevChats => updateOrReplaceItem(prevChats, data));
            }
        };

        const unsubscribe = onChildAdded(messagesRef2, handleChildAdded);
        const unsubscribe2 = onChildChanged(messagesRef2, handleChildChanged);

        return () => {
            unsubscribe();
            unsubscribe2();
        };
    }, [userData]);

    return (
        <ScrollView style={{ width: '25%', borderRightWidth: 1, borderColor: '#f2f2f2' }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Image
                        style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 10, marginTop: 10 }}
                        source={{
                            uri: imagem ? imagem : 'https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fuser.png?alt=media&token=61debdaa-d9b3-4480-8b5f-51eb647f489d&_gl=1*396mkb*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcxNjY0LjM1LjAuMA..',
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                        <Entypo name="chat" size={25} color="black" style={{ marginTop: 15, marginRight: 10 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <TextInput
                style={{
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    marginBottom: 10
                }}
                placeholder="Pesquisar"
                placeholderTextColor="#ccc"
            />
            <FlatList
                data={chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp) as (TalkData | GroupData)[]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Cardscreen item={item} onButtonClick={onButtonClick} />}
            />

        </ScrollView>
    );
};

export default Chatscreen;