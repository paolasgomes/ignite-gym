import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(error);
    }
  }
);

//a condição significa que ele está verificando se é um erro tratado no backend, se for, está instanciando um novo erro
//se não for, for um erro gerérico, está apenas rejeitando a promessa,
//é importante que retorne a response, pois caso contrário irá parar a requisição

export { api };
