import { TouchableOpacity, View } from "react-native";
import Groupscreen from "./Groupscreen";
import Talkscreen from "./Talkscreen";

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

interface CardscreenProps {
    item: TalkData | GroupData;
    onButtonClick: (newState: string, newType: string) => void;
}

const Cardscreen: React.FC<CardscreenProps> = ({ item, onButtonClick }) => {
    if (item.tipo === "talk") {
        return (
            <View>
                <TouchableOpacity onPress={() => onButtonClick(item.lastMessage.idTalk, item.tipo)}>
                    <Talkscreen item={item as TalkData} />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View>
                <TouchableOpacity onPress={() => onButtonClick(item.lastMessage.idTalk, item.tipo)}>
                    <Groupscreen item={item as GroupData} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default Cardscreen;