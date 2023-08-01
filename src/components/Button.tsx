import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface ButtonProps extends IButtonProps {
  title?: string;
  variant?: "solid" | "outline";
}

export function Button({ title, variant = "solid", ...rest }: ButtonProps) {
  const isButtonOutline = variant === "outline";

  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={isButtonOutline ? 1 : 0}
      borderColor={isButtonOutline ? "green.500" : "transparent"}
      rounded="sm"
      _pressed={{
        bg: isButtonOutline ? "gray.500" : "green.500",
      }}
      {...rest}
    >
      <Text color={isButtonOutline ? "green.500" : "white"} fontFamily="heading" fontSize="sm">
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
