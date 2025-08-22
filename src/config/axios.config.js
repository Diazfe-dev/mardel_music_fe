import axios from 'axios';
import {BASE_API_URL} from '../constants/index.js'
import {showNotification} from "../utils/toaster.js";
import AuthGuard from "../utils/auth.guard.js";

const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                showNotification("Hubo un error, comunicate con un administrador", "error");
            } else if (error.response.status === 401) {
                showNotification("No autorizado, por favor inicia sesión nuevamente", "error");
                AuthGuard(null);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;