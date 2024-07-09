import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from "react-native";

type TalkData = {
    item: {
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
    }
};

const timestampParaHoraMinuto = (timestamp: string | number | Date) => {
    const dataHoraAtual = new Date();
    const dataHoraTimestamp = new Date(timestamp);

    if (dataHoraTimestamp.toDateString() === dataHoraAtual.toDateString()) {
        // Mesmo dia que a hora atual
        let hora = dataHoraTimestamp.getHours();
        let minuto = dataHoraTimestamp.getMinutes();
        hora = ('0' + hora).slice(-2);
        minuto = ('0' + minuto).slice(-2);
        return hora + ':' + minuto;
    } else if (dataHoraTimestamp.toDateString() === new Date(dataHoraAtual.getTime() - 86400000).toDateString()) {
        // Dia anterior ao dia atual
        return 'Ontem';
    } else {
        // Mais antigo que ontem
        let dia = dataHoraTimestamp.getDate();
        let mes = dataHoraTimestamp.getMonth() + 1;
        let ano = dataHoraTimestamp.getFullYear();

        if (dia < 10) {
            dia = '0' + dia;
        }
        if (mes < 10) {
            mes = '0' + mes;
        }

        return dia + '/' + mes + '/' + ano;
    }
};

const Talkscreen: React.FC<TalkData> = ({ item }) => {
    const userData = useLocalSearchParams();

    const defaultImageUri = 'https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fuser.png?alt=media&token=61debdaa-d9b3-4480-8b5f-51eb647f489d&_gl=1*396mkb*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcxNjY0LjM1LjAuMA..'

    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderRadius: 10,
                borderColor: '#f2f2f2',
                margin: 5,
                backgroundColor: 'white',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    borderRadius: 12,
                    backgroundColor: 'white',
                }}
            >
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image
                        style={{
                            height: 40,
                            width: 40,
                            marginVertical: 3,
                            borderRadius: 50,
                        }}
                        source={{
                            uri: item.user1.nome === userData.nome
                                ? (item.user2.imagem !== "" ? item.user2.imagem : defaultImageUri)
                                : (item.user1.imagem !== "" ? item.user1.imagem : defaultImageUri)
                        }}
                    />
                    <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{item.user1.nome == userData.nome ? item.user2.nome : item.user1.nome}</Text>
                        <Text style={{ fontSize: 12, color: '#888' }}>
                            {item.lastMessage.message === ""
                                ? (item.lastMessage
                                    ? (item.lastMessage.type === "Image" || item.lastMessage.type === "Camera" || item.lastMessage.type === "Video"
                                        ? "📷 Mídia"
                                        : (item.lastMessage.type === "Document"
                                            ? "📄 Documento"
                                            : "🎧 Audio"))
                                    : null)
                                : (item.lastMessage.message.length > 20
                                    ? item.lastMessage.message.substring(0, 20) + '...'
                                    : item.lastMessage.message.replace(/\n/g, ' '))
                            }
                        </Text>
                    </View>
                </View>
                <View style={{ justifyContent: "flex-end" }}>
                    <Text style={{ fontSize: 12, color: '#888' }}>{timestampParaHoraMinuto(item.lastMessage.timestamp)}</Text>
                    {item.lastMessage.type != "Apagado" && (
                        <View>
                            <MaterialIcons name="circle" size={16} color="#e74c3c" style={{ display: item.lastMessage.sender != userData.endereco && !(item.lastMessage.statusLido.includes(userData.endereco)) ? "flex" : "none", alignSelf: "center", marginTop: 5 }} />
                        </View>
                    )}
                </View>
            </View>

        </View>
    )
}

export default Talkscreen;