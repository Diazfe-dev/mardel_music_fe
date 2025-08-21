import httpAdapter from '../adapters/http.adapter.js';

class UserService {
    async getCurrentUser() {
        return await httpAdapter.get('/user/me');
    }
}

export default new UserService();