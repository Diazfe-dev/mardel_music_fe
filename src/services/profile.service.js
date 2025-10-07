import httpAdapter from '../adapters/http.adapter.js';

class ProfileService {
    async createArtistProfile(profileData) {
        return await httpAdapter.post('/artist/profile',
            profileData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    }

    async getArtistProfile() {
        return await httpAdapter.get('/artist/profile');
    }

    async updateArtistProfile(profileData) {
        return await httpAdapter.put('/artist/profile',
            profileData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    }
}
export default new ProfileService();