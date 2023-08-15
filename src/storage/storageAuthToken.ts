import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN } from "@storage/storageConfig";

interface StorageAuthProps {
  token: string;
  refresh_token: string
}

export async function storageTokenSave({token=, refresh_token}: StorageAuthProps) {
  await AsyncStorage.setItem(AUTH_TOKEN, JSON.stringify({ token, refresh_token })); //não preciso converter para string pois já vem como string
}

export async function storageTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_TOKEN); //não preciso converter para string pois já vem como string

  const {token, refresh_token}: StorageAuthProps = response ? JSON.parse(response) : {}

  return {token, refresh_token};
}

export async function storageTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN); //não preciso converter para string pois já vem como string
}
