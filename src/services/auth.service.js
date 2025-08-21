import httpAdapter from '../adapters/http.adapter.js';

class AuthService {
    async login(credentials) {
        return await httpAdapter.post('/auth/login', credentials);
    }

    async register(userData) {
        return await httpAdapter.post('/auth/register', userData);
    }

    async logout() {
        return await httpAdapter.post('/auth/logout');
    }

    async refreshToken() {
        return await httpAdapter.post('/auth/refresh');
    }

    async forgotPassword(email) {
        return await httpAdapter.post('/auth/forgot-password', { email });
    }

    async resetPassword(token, newPassword) {
        return await httpAdapter.post('/auth/reset-password', {
            token,
            password: newPassword
        });
    }
}

export default new AuthService();