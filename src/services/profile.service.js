import httpAdapter from '../adapters/http.adapter.js';

class ProfileService {
    async CreateArtistProfile(profileData) {
        return await httpAdapter.post('/artist/profile', profileData);
    }
}
export default new ProfileService();