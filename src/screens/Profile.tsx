import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { FileInfo } from "expo-file-system";

const PHOTO_SIZE = 33;
const BACKGROUND_INPUT = "gray.600";

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "data:image/png;base64,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"
  );

  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as FileInfo;

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa foto é muito grande. Escolha uma com até 5MB",
            placement: "top",
            bg: "red.500",
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  } //precisa ser assincrona pra esperar que o usuário escolha a foto

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto size={PHOTO_SIZE} source={{ uri: userPhoto }} alt="Imagem do usuário" />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bg={BACKGROUND_INPUT} placeholder="Nome" />

          <Input bg={BACKGROUND_INPUT} placeholder="E-mail" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

          <Input bg={BACKGROUND_INPUT} placeholder="Senha antiga" secureTextEntry />

          <Input bg={BACKGROUND_INPUT} placeholder="Nova senha" secureTextEntry />

          <Input bg={BACKGROUND_INPUT} placeholder="Confirme a nova senha" secureTextEntry />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
