import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";

import LogoSvg from "@assets/logo.svg"; //utilizando a biblioteca react-transformer-svg para utilizar svg
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg} //Entende que é flexível
          defaultSource={BackgroundImg} //entende que esse é o default da imagem e carrega mais rápido
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
          pb={16}
        />

        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontFamily="heading" fontSize="xl" mb={6}>
            Crie sua conta
          </Heading>

          <Input placeholder="Nome" />
          <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" />
          <Input placeholder="Senha" secureTextEntry />
          <Input placeholder="Confirme sua senha" secureTextEntry />

          <Button title="Criar e acessar" />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={24}
          onPress={() => navigation.navigate("signIn")}
        />
      </VStack>
    </ScrollView>
  );
}