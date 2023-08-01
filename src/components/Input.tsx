import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.700"
      borderWidth={0}
      px={4}
      h={14}
      fontSize="md"
      color="white"
      fontFamily="body"
      placeholderTextColor="gray.300"
      mb={4}
      _focus={{
        bg: "gray.700",
        borderWidth: 1,
        borderColor: "green.500",
      }}
      {...rest}
    />
  );
}
