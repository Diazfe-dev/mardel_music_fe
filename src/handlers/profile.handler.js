import userService from '../services/user.service.js';
import {showNotification} from "../utils/toaster.js";

class ProfileHandler {

    constructor() {
        this.currentUser = null;
    }

    async init(user) {
        this.currentUser = user;
        this.formatedUserName = `${this.currentUser.name.split(' ')[0]} ${this.currentUser.lastName.split(' ')[0]}`;

        await this.setupElements();
        await this.renderProfile();
    }

    async setupElements() {
        this.user_avatar_container = document.getElementById('user-avatar-container');
        this.user_avatar_img = document.getElementById('user-avatar-image');
        this.user_avatar_input = document.getElementById('user-avatar-uplaod-input');
        this.user_name = document.getElementById('user-name');

    }

    async renderProfile() {}

    async handleInputChange (){ }

    async postProfileImage(file) {
        try {
            const formData = new FormData();
            formData.append('profile_image', file);
            const response = await userService.updateProfileImage(formData);

            if (response.ok) {
                this.showSuccessMessage('Se actualizo la foto de perfil!');
            }
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => { };
        reader.readAsDataURL(file);
    }

    showSuccessMessage = (message) => {
        showNotification(message, 'success');
    }

    showErrorMessage = (message) => {
        showNotification(message, 'error');
    }
}

export default ProfileHandler;