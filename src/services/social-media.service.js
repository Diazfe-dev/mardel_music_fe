import httpAdapter from '../adapters/http.adapter.js';

class SocialMediaService {
   async getSocialMediaTypes(){
       return await httpAdapter.get('/social-media/all/types');
   }

   async getAllSocialMediaWithTypes(){
       return await httpAdapter.get('/social-media/all');
   }

   async getSocialMediaByType(type){
         return await httpAdapter.get(`/social-media/${type}`);
   }
}

export default new SocialMediaService();