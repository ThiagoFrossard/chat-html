import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref as refStorage } from "firebase/storage";
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

type Message = {
    fileImage: string;
    idMessage: string;
    idTalk: string;
    media: string;
    mediaName: string;
    message: string;
    read: number[]
    response: boolean;
    responseMessage: Message
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
    item: Message;
    grupo: any;
}

const Groupscreen2: React.FC<Chatscreen2Props> = React.memo(({ item, grupo }) => {

    const [imagem, setImagem] = useState("")
    const [modalResponder, setModalResponder] = useState(false)

    const [apagar, setApagar] = useState(true)

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
    const storage = getStorage(app)

    const pegarImagem = async () => {
        const folderRef = refStorage(storage, `Perfil/${item.sender}/`);
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

    const userData = useLocalSearchParams();

    const video = useRef(null);

    const usuarioMsg = () => {
        const member = grupo.find((member: any) => member.member.cod == item.sender);
        return member ? member.cor : "black"; // Substitua "desiredColor" e "defaultColor" pelas cores desejadas.
    };

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [soundDuration, setSoundDuration] = useState<number>(0);
    const [soundPosition, setSoundPosition] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playbackRate, setPlaybackRate] = useState<number>(1.0);

    useEffect(() => {
        const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
            if (status.isLoaded) {
                setSoundDuration(status.durationMillis ?? 0);
                setSoundPosition(status.positionMillis ?? 0);
                setIsPlaying(status.isPlaying);
                if (!status.isPlaying && status.positionMillis === status.durationMillis) {
                    // A reprodução do áudio chegou ao final, então atualize a posição do slider para 0
                    setSoundPosition(0);
                }
            }
        };

        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }

        return () => {
            if (sound) {
                sound.setOnPlaybackStatusUpdate(null);
            }
        };
    }, [sound]);

    const _onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setSoundDuration(status.durationMillis ?? 0);
            setSoundPosition(status.positionMillis ?? 0);
            setIsPlaying(status.isPlaying);
        }
    };

    const loadAudio = async (): Promise<Audio.Sound | null> => {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: item.media }, {}, _onPlaybackStatusUpdate);
            setSound(sound);
            return sound;
        } catch (error) {
            console.error('Erro ao carregar o áudio:', error);
            return null;
        }
    };

    const playRecording = async () => {
        try {
            const loadedSound = sound || await loadAudio();
            if (loadedSound) {
                await loadedSound.playAsync();
                await loadedSound.setRateAsync(playbackRate, true);
            }
        } catch (error) {
            console.error('Erro ao reproduzir o áudio:', error);
        }
    };

    const pauseRecording = async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
            }
        } catch (error) {
            console.error('Erro ao pausar a reprodução do áudio:', error);
        }
    };

    const onSliderValueChange = (value: number) => {
        if (sound && isFinite(value)) {
            sound.setPositionAsync(value);
        }
    };

    const alteraVelocidade = () => {
        if (playbackRate === 1.0) {
            setPlaybackRate(1.5);
        } else if (playbackRate === 1.5) {
            setPlaybackRate(2.0);
        } else {
            setPlaybackRate(1.0);
        }
    };

    const handleLinkPress = (url: string) => {
        let fullURL = url;

        // Verifica se o URL não começa com "http://" ou "https://"
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            // Adiciona "http://" ao URL para garantir que seja reconhecido como um link válido
            fullURL = `http://${url}`;
        }

        Linking.openURL(fullURL);
    };

    const extractLinks = (text: string) => {
        const linkRegex = /(?:^|\s)((?:https?:\/\/)?[\w\d.-]+(?:\.[\w\d]{2,})+(?::\d+)?(?:[\w\-\._~,\/\?#\[\]@!\$&'\(\)\*\+\;\=]*)?)(?:\s|$)/gi;
        return text.match(linkRegex) || [];
    };

    const renderTextWithLinks = (text: string) => {
        const links = extractLinks(text);

        if (links.length == 0) {
            return (
                <Text style={{ color: item.sender == userData.endereco ? 'white' : 'black', fontStyle: item.type == 'Apagado' ? 'italic' : 'normal', fontSize: item.type == 'Apagado' ? 11 : 14 }}>
                    {text}
                </Text>
            );
        }

        const segments = text.split(/(?:^|\s)((?:https?:\/\/)?[\w\d.-]+(?:\.[\w\d]{2,})+(?::\d+)?(?:[\w\-\._~,\/\?#\[\]@!\$&'\(\)\*\+\;\=]*)?)(?:\s|$)/gi).map((segment, index) => {

            if (extractLinks(segment).length > 0) {
                return (
                    <Text key={index} style={{ color: 'orange' }} onPress={() => handleLinkPress(segment)}>
                        {" " + segment + " "}
                    </Text>
                );
            }
            return (
                <Text key={index} style={{ color: item.sender == userData.endereco ? 'white' : 'black', fontStyle: item.type == 'Apagado' ? 'italic' : 'normal', fontSize: item.type == 'Apagado' ? 11 : 14 }}>
                    {segment}
                </Text>
            );
        });

        return (
            <Text>
                {segments}
            </Text>
        );
    };

    if (item.sender == "") {
        if (item.senderName == "Exame") {
            return (
                <View style={{ padding: 15 }}>
                    {/* {isNewDay && (
                        <View style={{ alignItems: 'center', padding: 15 }}>
                            <View style={{ backgroundColor: "rgba(252, 247, 247, 1)", padding: 4, borderRadius: 5 }}>
                                <Text style={{ color: "grey" }}>{timestampParaHoraMinuto2(item.timestamp)}</Text>
                            </View>
                        </View>
                    )} */}
                    <View
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            borderBottomColor: '#ccc',
                            alignSelf: "center",
                            backgroundColor: "#f4f4d7",
                            maxWidth: '90%'
                        }}
                    >
                        <Text style={{ color: 'black', fontSize: 13, alignSelf: "center" }}>{item.message}</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ padding: 2 }}>
                    {/* {isNewDay && (
                        <View style={{ alignItems: 'center', padding: 15 }}>
                            <View style={{ backgroundColor: "rgba(252, 247, 247, 1)", padding: 4, borderRadius: 5 }}>
                                <Text style={{ color: "grey" }}>{timestampParaHoraMinuto2(item.timestamp)}</Text>
                            </View>
                        </View>
                    )} */}

                    <View
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            borderBottomColor: '#ccc',
                            alignSelf: "center",
                            backgroundColor: item.senderName == "Removido" ? "#ceebfd" : "#ccffe6",
                            maxWidth: '90%'
                        }}
                    >
                        <Text style={{ color: 'black', fontSize: 9, alignSelf: "center" }}>{item.message}</Text>
                    </View>
                </View>
            );
        }
    } else {

        return (
            <TouchableOpacity onLongPress={() => setModalResponder(!modalResponder)} style={{backgroundColor: modalResponder ? "#e7daf1" : "#f2f2f2"}}>
                <View style={{
                    backgroundColor: 'white',
                    marginBottom: 5,
                    padding: 10,
                    borderRadius: 5,
                    elevation: 2,
                    width: 170,
                    alignSelf: item.sender == userData.endereco ? 'flex-end' : 'flex-start',
                    justifyContent: item.sender == userData.endereco ? 'flex-end' : 'flex-start',
                    display: modalResponder && item.type != "Apagado" ? "flex" : "none"
                }}>
                    <TouchableOpacity onPress={() => setModalResponder(false)} style={{ alignSelf: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: "#888" }}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("RESPONSE")}>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="arrow-undo-outline" size={15} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>Responder</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("ENCAMINHA")}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Ionicons name="arrow-redo-outline" size={15} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>Encaminhar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("COPIA")}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <MaterialIcons name="content-copy" size={15} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>Copiar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("APAGA")}>
                        <View style={{ flexDirection: 'row', marginTop: 10, display: (item.sender == userData.endereco) && apagar ? "flex" : "none" }}>
                            <Feather name="delete" size={15} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>Apagar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("EDITA")}>
                        <View style={{ flexDirection: 'row', marginTop: 10, display: (item.sender == userData.endereco) && apagar ? "flex" : "none" }}>
                            <Feather name="edit" size={15} color="black" />
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>Editar</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: item.sender == userData.endereco ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    <Image style={{ height: 25, width: 25, borderRadius: 50, display: item.sender != userData.endereco ? "flex" : "none" }} source={{ uri: imagem != "" ? imagem : "https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fuser.png?alt=media&token=61debdaa-d9b3-4480-8b5f-51eb647f489d&_gl=1*396mkb*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcxNjY0LjM1LjAuMA.." }}></Image>

                    <View
                        style={{
                            maxWidth: '80%',
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: item.sender == userData.endereco ? '#3A74A1' : '#ccc',
                            marginLeft: item.sender != userData.endereco ? 10 : 0
                        }}
                    >
                        <Text
                            style={{
                                color: usuarioMsg(),
                                marginBottom: 5,
                                display: item.sender == userData.endereco ? 'none' : 'flex'
                            }}
                        >
                            {item.senderName}
                        </Text>

                        {item.response && item.responseMessage && (
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: item.responseMessage.sender == userData.endereco ? 'rgba(50, 104, 146, 1)' : 'rgba(252, 247, 247, 1)',
                                    borderRadius: 5,
                                    backgroundColor: item.responseMessage.sender == userData.endereco ? 'rgba(50, 104, 146, 1)' : 'rgba(252, 247, 247, 1)'
                                }}
                            >
                                <View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 3 }}>
                                        <View style={{ marginRight: 10 }}>
                                            <Text style={{ marginBottom: 5, color: item.responseMessage.sender == userData.endereco ? 'rgba(149, 255, 138, 1)' : 'rgba(92, 92, 92, 1)', fontSize: 12 }}>
                                                {item.responseMessage.senderName == userData.nome ? "VOCÊ" : item.responseMessage.senderName}
                                            </Text>
                                            <View>
                                                <Text style={{ color: item.responseMessage.sender == userData.endereco ? '#ccc' : 'gray' }}>
                                                    {item.responseMessage.message != "" ?
                                                        (item.responseMessage.message.length > 35 ?
                                                            item.responseMessage.message.substring(0, 35) + '...' :
                                                            item.responseMessage.message.replace(/\n/g, ' '))
                                                        : (item.responseMessage.type == "Document" ? "📄 Documento" : (item.responseMessage.type == "Audio" ? "🎧 Audio" : "📷 Mídia"))}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ display: item.responseMessage.type == "Image" || item.responseMessage.type == "Camera" ? "flex" : "none" }}>
                                            <Image
                                                style={{
                                                    alignSelf: "center",
                                                    width: 40,
                                                    maxWidth: "100%",
                                                    height: 40,
                                                    resizeMode: 'cover', // Ajusta a exibição da imagem para evitar distorções
                                                }}
                                                source={{ uri: item.responseMessage.media }}
                                            />
                                        </View>
                                        <View style={{ display: item.responseMessage.type == "Video" ? "flex" : "none" }}>
                                            <Video
                                                ref={video}
                                                style={{ height: 40, width: 40, alignSelf: "center" }}
                                                source={{
                                                    uri: item.responseMessage.media,
                                                }}
                                                videoStyle={{ height: 40, width: 40 }}
                                                useNativeControls
                                                resizeMode={ResizeMode.COVER}
                                            />
                                        </View>

                                        <View style={{ display: item.responseMessage.type == "Document" ? "flex" : "none" }}>
                                            <View style={{ alignSelf: "center" }}>
                                                {
                                                    (item.responseMessage.fileImage != "" && item.responseMessage.fileImage != undefined) && (
                                                        <Image
                                                            style={{ height: 40, width: 40 }}
                                                            source={{ uri: item.responseMessage.fileImage }}
                                                        />
                                                    )
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}


                        <View style={{ display: item.type == "Image" || item.type == "Camera" ? "flex" : "none" }}>
                            <Image
                                style={{
                                    alignSelf: "center",
                                    width: 300,
                                    maxWidth: "100%",
                                    height: 250,
                                    resizeMode: 'cover', // Ajusta a exibição da imagem para evitar distorções
                                }}
                                source={{ uri: item.media }}
                            />
                        </View>
                        <View style={{ display: item.type == "Video" ? "flex" : "none" }}>
                            <Video
                                ref={video}
                                style={{ height: 250, width: 300, alignSelf: "center" }}
                                source={{
                                    uri: item.media,
                                }}
                                videoStyle={{ height: 250, width: 300 }}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                            />
                        </View>
                        <View style={{ flexDirection: "row", display: item.type == "Audio" ? "flex" : "none" }}>
                            <TouchableOpacity onPress={isPlaying ? pauseRecording : playRecording}>
                                <FontAwesome name={isPlaying ? "pause" : "play"} size={20} color={item.sender == userData.endereco ? "#e6e6e6" : "#542B72"} />
                            </TouchableOpacity>
                            <Slider
                                minimumTrackTintColor={item.sender == userData.endereco ? "#e6e6e6" : "#542B72"}
                                style={{ width: 200, marginLeft: 5 }}
                                minimumValue={0}
                                maximumValue={soundDuration}
                                value={soundPosition}
                                onValueChange={onSliderValueChange}
                            />
                            <TouchableOpacity onPress={alteraVelocidade} style={{ marginLeft: 5 }}>
                                <Text style={{ color: "white", padding: 2, backgroundColor: "grey", borderRadius: 5, fontSize: 11 }}>{playbackRate.toFixed(1)}x</Text>
                            </TouchableOpacity>
                        </View>
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
                        <Text style={{ color: item.sender == userData.endereco ? 'white' : 'black' }}>{renderTextWithLinks(item.message)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
})

export default Groupscreen2;