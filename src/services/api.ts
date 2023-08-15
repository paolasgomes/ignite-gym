import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";
import { storageTokenGet, storageTokenSave } from "@storage/storageAuthToken";

const api = axios.create({
  baseURL: "http://localhost:3333",
}) as APIInstanceProps;

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let failedQueued: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refresh_token } = await storageTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueued.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = { Authorization: `Bearer ${token}` };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", { refresh_token });

              await storageTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
              }

              originalRequestConfig.headers = { Authorization: `Bearer ${data.token}` };
              api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

              failedQueued.forEach((request) => {
                request.onSuccess(data.token);
              });

              resolve(api(originalRequestConfig));
            } catch (error: any) {
              failedQueued.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueued = [];
            }
          });
        }

        signOut();
      } //aqui está verificando se o erro é 401 = não autorizado, se for, ele faz validação se é relacionado ao token, se não for, desloga o usuário

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    } //a condição significa que ele está verificando se é um erro tratado no backend, se for, está instanciando um novo erro
    //se não for, for um erro gerérico, está apenas rejeitando a promessa e devolvendo pro cliente,
    //é importante que retorne a response, pois caso contrário irá parar a requisição
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
