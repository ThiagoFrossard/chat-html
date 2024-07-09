import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { initializeApp } from "firebase/app";
import { equalTo, getDatabase, off, onChildAdded, orderByChild, query, ref as refDb } from "firebase/database";
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

type Message = {
    fileImage: string;
    idMessage: string;
    idTalk: string;
    media: string;
    mediaName: string;
    message: string;
    read: number[]
    response: boolean;
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
    type: string
}

const Messagescreen: React.FC<Chatscreen2Props> = ({ state, type }) => {
    const [opcoes, setOpcoes] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

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

    return (

        <View style={{ width: '75%', height: '100%' }}>
            {/* Cabeçalho da Conversa */}
            <View style={{ height: 50, borderBottomWidth: 1, borderColor: '#f2f2f2', paddingHorizontal: 10, justifyContent: 'center' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                style={{ height: 30, width: 30, borderRadius: 50 }}
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fgroup.png?alt=media&token=8bafbddf-43f9-4087-a4a8-444911bba52f&_gl=1*45mql8*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcyMjgyLjQ2LjAuMA',
                                }}
                            />
                            <Text style={{ fontSize: 22, marginLeft: 7 }}>Nome</Text>
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
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: item.sender == userData.endereco ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                            <View
                                style={{
                                    maxWidth: '80%',
                                    padding: 10,
                                    borderRadius: 10,
                                    backgroundColor: item.sender == userData.endereco ? '#3A74A1' : '#ccc',
                                }}
                            >
                                <View style={{ display: item.type == "Image" || item.type == "Camera" ? "flex" : "none" }}>
                                    <Image
                                        style={{
                                            alignSelf: "center",
                                            width: 300,
                                            maxWidth: "100%",
                                            height: 200,
                                            resizeMode: 'cover', // Ajusta a exibição da imagem para evitar distorções
                                        }}
                                        source={{ uri: item.media }}
                                    />
                                </View>
                                {/* <View style={{ display: item.type == "Video" ? "flex" : "none" }}>
                                    <Video
                                        ref={video}
                                        style={{ height: 200, width: 300, maxWidth: "100%", alignSelf: "center" }}
                                        source={{
                                            uri: item.media,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.COVER}
                                        onPlaybackStatusUpdate={status => setStatusVideo(() => status)}
                                    />
                                    <View>
                                        <TouchableOpacity
                                            title={statusVideo.isPlaying ? 'Pause' : 'Play'}
                                            onPress={() =>
                                                statusVideo.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                                            }
                                        />
                                    </View>
                                </View> */}
                                {/* <View style={{ flexDirection: "row", display: item.type == "Audio" ? "flex" : "none" }}>
                                    <TouchableOpacity onPress={isPlaying ? pauseRecording : playRecording}>
                                        <FontAwesome name={isPlaying ? "pause" : "play"} size={30} color={isCurrentUser ? "#e6e6e6" : "#542B72"} />
                                    </TouchableOpacity>
                                    <Slider
                                        minimumTrackTintColor={isCurrentUser ? "#e6e6e6" : "#542B72"}
                                        style={{ width: 200, height: 30, marginTop: Platform.OS == 'ios' ? -5 : 0 }}
                                        minimumValue={0}
                                        maximumValue={soundDuration}
                                        value={soundPosition}
                                        onValueChange={onSliderValueChange}
                                    />
                                    <TouchableOpacity onPress={alteraVelocidade}>
                                        <Text style={{ color: "white", padding: 5, backgroundColor: "grey", borderRadius: 5, fontSize: 12 }}>{playbackRate.toFixed(1)}x</Text>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={{ display: item.type == "Document" ? "flex" : "none" }}>
                                    <View style={{ alignSelf: "center" }}>
                                        {
                                            (item.fileImage != "" && item.fileImage != undefined) && (
                                                <Image
                                                    style={{ height: 100, width: 300 }}
                                                    source={{ uri: item.fileImage }}
                                                />
                                            )
                                        }
                                    </View>

                                    <View style={{ flexDirection: "row" }}>
                                        <FontAwesome name="file-pdf-o" size={30} color={item.sender == userData.endereco ? "white" : "black"} style={{ marginTop: 5 }} />
                                        <Text style={{ marginLeft: 5, fontSize: 16, width: "80%", color: item.sender == userData.endereco ? "white" : "black" }}>
                                            {item.mediaName}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ color: item.sender == userData.endereco ? 'white' : 'black' }}>{item.message}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
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
                />
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#542B72', borderRadius: 40, marginLeft: 10 }}>
                    <Feather name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Messagescreen;