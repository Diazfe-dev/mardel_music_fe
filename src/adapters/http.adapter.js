import axiosInstance from '../config/axios.config.js';

class HttpAdapter {
    async get(url, config = {}) {
        try {
            const {data: {data}, status, statusText} = await axiosInstance.get(url, config);
            return {
                success: true,
                data: data,
                status: status
            };
        } catch (error) {
            return this._handleError(error);
        }
    }

    async post(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.post(url, data, config);
            return {
                success: true,
                data: response.data.data,
                status: response.status
            };
        } catch (error) {
            return this._handleError(error);
        }
    }

    async put(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.put(url, data, config);
            return {
                success: true,
                data: response.data.data,
                status: response.status
            };
        } catch (error) {
            return this._handleError(error);
        }
    }

    async delete(url, config = {}) {
        try {
            const {data: {data}, status, statusText} = await axiosInstance.delete(url, config);
            console.log(data);
            return {
                success: true,
                data: data,
                status: status
            };
        } catch (error) {
            console.log(error);
            return this._handleError(error);
        }
    }

    _handleError(error) {
        return {
            success: false,
            error: {
                message: error.response?.data?.message || error.message,
                status: error.response?.status || 500,
                data: error.response?.data || null
            }
        };
    }
}

export default new HttpAdapter();