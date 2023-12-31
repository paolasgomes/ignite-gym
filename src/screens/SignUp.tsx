import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import LogoSvg from "@assets/logo.svg"; //utilizando a biblioteca react-transformer-svg para utilizar svg
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import { api } from "@services/api";
import { Alert } from "react-native";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signUpSchema = yup.object({
  name: yup.string().required("Informe seu nome"),
  email: yup.string().required("Informe seu e-mail").email("E-mail inválido"),
  password: yup
    .string()
    .required("Informe sua senha")
    .min(6, "Sua senha deve ter pelo menos 6 digítos"),
  confirmPassword: yup
    .string()
    .required("Confirme a senha.")
    .oneOf([yup.ref("password")], "A confirmação da senha não confere"),
});

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
    reValidateMode: "onSubmit",
  });

  async function handleSignUp({ name, password, email }: FormDataProps) {
    try {
      await api.post("/users", { name, password, email });
      await signIn(email, password); //Cria conta e já redireciona para dentro do app
    } catch (error) {
      const isAppError = error instanceof AppError; //pegando a instância criada do erro tratado

      const title = isAppError
        ? error.message
        : "Não foi possível criar a conta. Tente novamente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

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

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors?.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors?.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors?.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme sua senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors?.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isSubmitting}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={12}
          onPress={() => navigation.navigate("signIn")}
        />
      </VStack>
    </ScrollView>
  );
}
//Posso Enviar os dados do formulário pelo confirmar senha ou pelo botão
