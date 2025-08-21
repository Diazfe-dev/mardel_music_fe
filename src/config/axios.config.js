import axios from 'axios';
import {BASE_API_URL} from '../constants/index.js'

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
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 500) {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 text-white shadow-lg opacity-80 border-1 bg-red-900 border-red-300`;
            notification.textContent = "Hubo un error, comunicate con un administrador";

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);

        } else {
            return Promise.reject(error);
        }

    }
);

export default axiosInstance;