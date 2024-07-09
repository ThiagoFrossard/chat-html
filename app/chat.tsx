import { useState } from 'react';
import { View } from "react-native";
import Chatscreen from './ChatScreen/Chatscreen';
import Chatscreen2 from './ChatScreen/Chatscreen2';

export default function Chat() {
    const [chatscreen2State, setChatscreen2State] = useState<string>('');
    const [chatscreen2Type, setChatscreen2SType] = useState<string>('');

    const handleStateChange = (newState: string, newType: string) => {
        setChatscreen2State(newState);
        setChatscreen2SType(newType)
    };

    return (
        <View style={{ flexDirection: 'row', height: '100%' }}>
            {/* Lista de Conversas */}
            <Chatscreen onButtonClick={handleStateChange} />

            {/* Conversa Atual */}
            <Chatscreen2 state={chatscreen2State} type={chatscreen2Type}/>
        </View>
    );
}