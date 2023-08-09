import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";

export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return (
    <Box bg="gray.700" flex={1}>
      <NavigationContainer theme={theme}>
        {/* <AppRoutes /> */}
        <AuthRoutes />
      </NavigationContainer>
    </Box> //Para não aparecer fundo branco quando trocar tela por causa do delay
  );
}
