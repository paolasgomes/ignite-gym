//São referentes às telas em que o usuário tem acesso sem estar logado (login, signup..)
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { SignIn } from "@screens/SignIn";
import { SignUp } from "@screens/SignUp";

type AuthProps = {
  signIn: undefined; //undefined pois não tenho parametro de rota
  signUp: undefined; //undefined pois não tenho parametro de rota
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthProps>;

const { Navigator, Screen } = createNativeStackNavigator<AuthProps>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
}
