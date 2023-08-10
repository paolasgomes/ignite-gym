import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN } from "@storage/storageConfig";

export async function storageTokenSave(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN, token); //não preciso converter para string pois já vem como string
}

export async function storageTokenGet() {
  const token = await AsyncStorage.getItem(AUTH_TOKEN); //não preciso converter para string pois já vem como string

  return token;
}

export async function storageTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN); //não preciso converter para string pois já vem como string
}
