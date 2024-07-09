import { FontAwesome6 } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { initializeApp } from "firebase/app";
import { equalTo, getDatabase, off, onChildAdded, orderByChild, push, query, ref as refDb, serverTimestamp, set, update } from "firebase/database";
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import Groupscreen2 from "./GroupScreen2";

type Message = {
    fileImage: string;
    idMessage: string;
    idTalk: string;
    media: string;
    mediaName: string;
    message: string;
    read: number[]
    response: boolean;
    responseMessage: Message;
    sender: string;
    senderName: string;
    status: string;
    statusEnviado: number[]
    statusLido: number[]
    statusRecebido: number[]
    timestamp: number;
    type: string
};

interface Chatscreen2Props {
    state: string;
}

const Groupscreen: React.FC<Chatscreen2Props> = ({ state }) => {
    const [opcoes, setOpcoes] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [nomeGrupo, setNomeGrupo] = useState("");
    const [imagemGrupo, setImagemGrupo] = useState("");
    const [grupo, setGrupo] = useState([])
    const [oGrupo, setOGrupo] = useState([])
    const [mensagem, setMensagem] = useState("")

    const userData = useLocalSearchParams();

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

    const filteredMessagesRef = query(
        refDb(database, 'messages'),
        orderByChild('idTalk'),
        equalTo(state),
    );

    useEffect(() => {
        const fetchDataAndSetTalk = async () => {

            onChildAdded(filteredMessagesRef, onChildAddedCallback);
        }

        setMessages([])
        fetchDataAndSetTalk();

        // Importante: Não se esqueça de remover o listener quando o componente é desmontado
        return () => {
            off(filteredMessagesRef);
        };
    }, [state]);

    const onChildAddedCallback = (snapshot: { val: () => any; }) => {

        const newMessage = snapshot.val();

        setMessages((prevMessages) => [newMessage, ...prevMessages]);

    };

    const filteredMessagesRef2 = refDb(database, `group`);

    useEffect(() => {
        const fetchDataAndSetTalk = async () => {

            onChildAdded(filteredMessagesRef2, onChildAddedCallback2);
        }

        fetchDataAndSetTalk();

        // Importante: Não se esqueça de remover o listener quando o componente é desmontado
        return () => {
            off(filteredMessagesRef);
        };
    }, [state]);

    const onChildAddedCallback2 = (snapshot: any) => {

        const newMessage = snapshot.val();

        if (snapshot.key == state) {
            setNomeGrupo(newMessage.nome)
            setImagemGrupo(newMessage.imagem)
            setGrupo(newMessage.members)
            setOGrupo(newMessage)
        }
    };

    const sendMessageGroup = async () => {

        const meuCod = userData.endereco

        try {
            const itemRef = refDb(database, 'messages');
            const newItemRef = push(itemRef);

            const id = uuidv4();
            const message = mensagem
            setMensagem("")
            const codArray = grupo

            await set(newItemRef, {
                idMessage: id,
                idTalk: state,
                media: "",
                mediaName: "",
                message: message,
                type: "",
                sender: meuCod,
                status: "enviado",
                response: false,
                responseMessage: [],
                statusEnviado: codArray,
                statusRecebido: [0],
                statusLido: [0],
                senderName: userData.nome,
                read: codArray,
                timestamp: serverTimestamp(),
            });
            updateMessageStatus(codArray, message, id)

        } catch (error) {
            console.log('Erro ao gravar mensagem no Firebase:', error);
        }
    };

    const updateMessageStatus = async (codArray, message, id) => {

        const newThing = {
            id: oGrupo.id,
            imagem: imagemGrupo,
            nome: nomeGrupo,
            lastMessage: {
                idMessage: id,
                idTalk: state,
                media: "",
                mediaName: "",
                message: message,
                type: "",
                sender: userData.endereco,
                status: "enviado",
                response: false,
                responseMessage: [],
                statusEnviado: codArray,
                statusRecebido: [0],
                statusLido: [0],
                senderName: userData.nome,
                read: codArray,
                timestamp: serverTimestamp(),
            },
            restringirMensagem: oGrupo.restringirMensagem != undefined ? oGrupo.restringirMensagem : false,
            members: grupo,
            tipo: "group",
        };

        // Verificar se há alterações antes de executar a atualização
        if (state && state != "") {
            const updates2 = {};
            updates2['group/' + state + '/'] = newThing;
            update(refDb(database), updates2);
        }
    };

    const renderItem = useMemo(() => (item) => {
        return (
            <Groupscreen2
                item={item}
                grupo={grupo}
            />
        );
    }, [state]);

    return (

        <View style={{ height: '100%', display: state != "" ? "flex" : "none" }}>
            {/* Cabeçalho da Conversa */}
            <View style={{ height: 50, borderBottomWidth: 1, borderColor: '#f2f2f2', paddingHorizontal: 10, justifyContent: 'center' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                style={{ height: 30, width: 30, borderRadius: 50 }}
                                source={{
                                    uri: imagemGrupo != "" ? imagemGrupo : 'https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fgroup.png?alt=media&token=8bafbddf-43f9-4087-a4a8-444911bba52f&_gl=1*45mql8*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcyMjgyLjQ2LjAuMA',
                                }}
                            />
                            <Text style={{ fontSize: 22, marginLeft: 7 }}>{nomeGrupo.toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <TextInput
                            style={{
                                height: 40,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginBottom: 10,
                                width: 700
                            }}
                            placeholder="Pesquisar"
                            placeholderTextColor="#ccc"
                        />
                    </View>
                </View>
            </View>

            {/* Corpo da Conversa */}
            <FlatList
                style={{ flex: 1, padding: 10 }}
                data={messages}
                keyExtractor={(item) => item.idMessage}
                renderItem={({ item }) => renderItem(item)}
                inverted
            />

            {/* Campo de Entrada de Mensagem */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#f2f2f2' }}>
                <View style={{
                    position: 'absolute',
                    top: -110, // Altura para posicionar acima do botão
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 5,
                    elevation: 2,
                    width: 170,
                    display: opcoes ? "flex" : "none"
                }}>
                    <TouchableOpacity style={{ marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Feather name="image" size={25} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>Galeria</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Feather name="file-tray" size={25} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>Arquivo</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#542B72', borderRadius: 50, marginRight: 10 }} onPress={() => setOpcoes(!opcoes)}>
                    <FontAwesome6 name="paperclip" size={20} color="white"></FontAwesome6>
                </TouchableOpacity>
                <TextInput
                    style={{
                        flex: 1,
                        minHeight: 40,
                        maxHeight: 200,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    multiline
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor="#ccc"
                    onChangeText={(text) => setMensagem(text)}
                    value={mensagem}
                />
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#542B72', borderRadius: 40, marginLeft: 10 }} onPress={() => {
                    if (mensagem != "") {
                        sendMessageGroup()
                    }
                }}>
                    <Feather name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Groupscreen;