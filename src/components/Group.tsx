import { Pressable, Text, IPressableProps } from "native-base";

interface GroupProps extends IPressableProps {
  name: string;
  isActive: boolean;
}

export function Group({ name, isActive, ...rest }: GroupProps) {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg="gray.600"
      justifyContent="center"
      alignItems="center"
      rounded="md"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderWidth: 1,
        borderColor: "green.500",
      }}
      {...rest}
    >
      <Text
        color={isActive ? "green.600" : "gray.200"}
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="bold"
      >
        {name}
      </Text>
    </Pressable>
  );
}
