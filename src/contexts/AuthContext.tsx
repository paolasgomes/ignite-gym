import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import {
  storageTokenGet,
  storageTokenRemove,
  storageTokenSave,
} from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export interface AuthContextDataProps {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  updateUserProfile: (updateUser: UserDTO) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps); //posso usr esse tipo através do tipo genérico e o objeto começa com essa tipagem

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function updateUserAndToken(user: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`; //pega o token para enviar no cabeçalho de todas as requisições, o token

    setUser(user); //e salva o user no estado que está sendo compartilhado
  }

  async function storageSaveUserAndToken(user: UserDTO, token: string, refresh_token: string) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(user); //seta o usuário no storage
      await storageTokenSave({ token, refresh_token }); //seta o token
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password }); //Consulto se existe um usuário com essas credenciais

      if (data.user && data.token && data.refresh_token) {
        storageSaveUserAndToken(data.user, data.token, data.refresh_token);
        updateUserAndToken(data.user, data.token);
      } //se tiver um usuário com essas credenciais e com um token, eu envio para a função
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();
      const { token } = await storageTokenGet();

      if (userLogged && token) {
        updateUserAndToken(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadUserData();
  }, []); //toda vez que recarrega a aplicação passa por aqui e verifica se tem algo no storage

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoadingUserStorageData, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
