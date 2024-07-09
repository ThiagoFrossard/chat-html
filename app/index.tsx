import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [email, setEmail] = useState("")
  const [esqueceu, setEsqueceu] = useState(false)

  const router = useRouter();

  const acessarChat = () => {
    let xhr = new XMLHttpRequest(),
        method = "POST",
        url = `https://hibou.makerplanet.com/sinapse/login.rule?sys=SIP&email=${login}&senha=${senha}`;

      xhr.open(method, url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          const response = JSON.parse(xhr.response)
          if (response.mensagem != "false") {
            router.push({
              pathname: '/chat',
              params: response ,
            });
          } else {
            alert("Login ou senha incorretos");
          }
        } else {
          if (xhr.status > 399) {
            alert("Login ou senha incorretos");
          }
        }
      };
      xhr.send();
  }

  const redefinirSenha = () => {
    fetch(
      `https://hibou.makerplanet.com/sinapse/senha.rule?sys=SIP&email=${email}`
    )
      .then((resposta) => resposta.json())
      .then((json) => alert("Redefinir"))
      .catch(() => alert("Erro"))
  }

  return (
    <ScrollView>
      <View style={{ alignItems: "center", marginTop: -50 }}>
        <Image
          style={{ height: 400, width: 500, alignSelf: "center" }}
          source={require("../assets/images/LogoSinapse.png")}
        />
        <View style={{ borderRadius: 5, borderWidth: 1, width: '40%', borderColor: '#542B72', height: 50, display: esqueceu ? "flex" : "none" }}>
          <TextInput placeholder=" Email" placeholderTextColor={"#542B72"} style={{ flex: 1, padding: 5 }} onChangeText={(text) => setEmail(text)} value={email}/>
        </View>
        <View style={{ borderRadius: 5, borderWidth: 1, width: '40%', borderColor: '#542B72', height: 50, display: esqueceu ? "none" : "flex", marginTop: -100 }}>
          <TextInput placeholder=" Login" placeholderTextColor={"#542B72"} style={{ flex: 1, padding: 5 }} onChangeText={(text) => setLogin(text)} value={login}/>
        </View>
        <View style={{ borderRadius: 5, borderWidth: 1, marginTop: 30, width: '40%', borderColor: '#542B72', height: 50, display: esqueceu ? "none" : "flex" }}>
          <TextInput placeholder=" Senha" placeholderTextColor={"#542B72"} style={{ flex: 1, padding: 5 }} secureTextEntry={true} onChangeText={(text) => setSenha(text)} value={senha}/>
        </View>
        <TouchableOpacity
          style={{ marginTop: 50, backgroundColor: '#542B72', borderRadius: 10, display: esqueceu ? "none" : "flex" }}
          onPress={() => acessarChat()} // adicione esta linha
        >
          <Text style={{ color: 'white', padding: 10 }}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, backgroundColor: '#542B72', borderRadius: 10, display: esqueceu ? "flex" : "none" }}
          onPress={() => redefinirSenha()}
        >
          <Text style={{ color: 'white', padding: 10 }}>Redefinir</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ color: '#542B72', marginTop: 30 }} onPress={() => setEsqueceu(!esqueceu)}>{esqueceu ? "Voltar" : "Esqueceu sua senha?"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
