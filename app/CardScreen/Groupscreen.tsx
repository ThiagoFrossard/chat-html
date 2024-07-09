import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from "react-native";

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

interface GroupData {
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
        imagem: string;
        members: Member[];
        nome: string;
        restringirMensagem: boolean;
    };
}

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

const Groupscreen: React.FC<GroupData> = ({ item }) => {
    const userData = useLocalSearchParams();
    const defaultImageUri = 'https://firebasestorage.googleapis.com/v0/b/sinapse-neurocare-53ffc.appspot.com/o/Perfil%2F0%2Fgroup.png?alt=media&token=8bafbddf-43f9-4087-a4a8-444911bba52f&_gl=1*45mql8*_ga*MTU3MDI1MDEwNS4xNjYwODQ2MDM2*_ga_CW55HF8NVT*MTY5NzU3MTU2OS4zODMuMS4xNjk3NTcyMjgyLjQ2LjAuMA..'

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
                            marginTop: 3,
                            marginBottom: 3,
                            borderRadius: 50,
                        }}
                        source={{ uri: item.imagem !== '' ? item.imagem : defaultImageUri }}
                    />

                    <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{item.nome.toUpperCase()}</Text>
                        <View style={{flexDirection: "row"}}>
                        <Text style={{ display: item.lastMessage.sender == "" ? "none" : "flex", fontSize: 12 }}>{item.lastMessage.senderName === userData.nome ? "Você: " : item.lastMessage.senderName.split(' ')[0] == "DR" ? item.lastMessage.senderName.split(' ')[0] + " " + item.lastMessage.senderName.split(' ')[1] + ": " : item.lastMessage.senderName.split(' ')[0] + ": "}</Text>
                        <Text style={{ fontSize: 12, color: '#888' }}>
                            {item.lastMessage.message === ""
                                ? (item.lastMessage
                                    ? (item.lastMessage.type === "Image" || item.lastMessage.type === "Camera" || item.lastMessage.type === "Video"
                                        ? "📷 Mídia"
                                        : (item.lastMessage.type === "Document"
                                            ? "📄 Documento"
                                            : "🎧 Audio"))
                                    : null)
                                : item.lastMessage.message.length > 15
                                    ? item.lastMessage.message.replace(/\n/g, ' ').substring(0, 15) + '...'
                                    : item.lastMessage.message.replace(/\n/g, ' ')
                            }
                        </Text>
                        </View>
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

export default Groupscreen;