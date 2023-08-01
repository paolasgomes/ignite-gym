import { VStack, Image } from "native-base";

import LogoSvg from "@assets/logo.svg"; //utilizando a biblioteca react-transformer-svg para utilizar svg
import BackgroundImg from "@assets/background.png";

export function SignIn() {
  return (
    <VStack flex={1} bg="gray.700">
      <Image
        source={BackgroundImg}
        alt="Pessoas treinando"
        resizeMode="contain"
        position="absolute"
      />

      <LogoSvg />
    </VStack>
  );
}
