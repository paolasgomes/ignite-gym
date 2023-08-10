import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { NativeBaseProvider } from "native-base";
import { Loading } from "@components/Loading";
import { THEME } from "./src/theme";
import { Routes } from "@routes/index";
import { AuthContext, AuthContextProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold }); //fontsLoaded verifica se a fonte está carregada ou não e useFonts utiliza as fontes que quer utilizar no projeto

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AuthContextProvider>{fontsLoaded ? <Routes /> : <Loading />}</AuthContextProvider>
    </NativeBaseProvider>
  );
}

//provendo para toda a aplicação o native base
