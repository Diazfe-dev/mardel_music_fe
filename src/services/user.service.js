import httpAdapter from '../adapters/http.adapter.js';

class UserService {
    async getCurrentUser() {
        return await httpAdapter.get('/user/me');
    }

    async updateProfileImage(formData) {
        return await httpAdapter.put('/user/profile-image',
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" }
            });
    }
}

export default new UserService();