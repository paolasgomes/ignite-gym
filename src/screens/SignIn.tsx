import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import LogoSvg from "@assets/logo.svg"; //utilizando a biblioteca react-transformer-svg para utilizar svg
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";

interface FormData {
  email: string;
  password: string;
}

const sigInSchema = yup.object({
  email: yup.string().email("Digite um e-mail válido").required(),
  password: yup.string().min(6).required(),
});

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(sigInSchema),
  });

  async function handleSignIn({ email, password }: FormData) {
    try {
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível acessar. Tente novamente mais tarde.";

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
          source={BackgroundImg}
          defaultSource={BackgroundImg}
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
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
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
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title="Acessar"
            isLoading={isSubmitting}
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" fontFamily="body" mb={3}>
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => navigation.navigate("signUp")}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
