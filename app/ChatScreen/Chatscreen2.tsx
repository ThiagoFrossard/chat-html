import { useLocalSearchParams } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, off, onChildAdded, ref as refDb } from "firebase/database";
import { useEffect, useState } from 'react';
import { View } from "react-native";
import Groupscreen from "../MessageScreen/Groupscreen";
import Talkscreen from "../MessageScreen/Talkscreen";

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

const Chatscreen2: React.FC<Chatscreen2Props> = ({ state, type }) => {
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

    const filteredMessagesRef = refDb(database, `${type}/${state}`);

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

        if (newMessage.cod == userData.endereco) {
            console.log("ISDISIS")
        }
    };

    if (type === "talk") {
        return (
            <View style={{ width: '75%', height: '100%' }}>
                <Talkscreen state={state}/>
            </View>
        );
    } else {
        return (
            <View style={{ width: '75%', height: '100%' }}>
                <Groupscreen state={state}/>
            </View>
        );
    }
}

export default Chatscreen2;