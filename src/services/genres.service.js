import httpAdapter from '../adapters/http.adapter.js';

class GenresService {
    async getAllGenres() {
        return await httpAdapter.get('/genres/all');
    }

    async getGenresByQuery(searchTerm) {
        return await httpAdapter.get(`/genres/search?q=${encodeURIComponent(searchTerm)}`);
    }
}

export default new GenresService();