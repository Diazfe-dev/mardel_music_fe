import userService from '../services/user.service.js';
import authHandler from "./auth.handler.js";

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
        this.setupImageUpload();
    }

    async setupElements() {
        this.user_avatar_container = document.getElementById('user-avatar-container');
        this.user_avatar_img = document.getElementById('user-avatar-image');
        this.user_avatar_input = document.getElementById('user-avatar-uplaod-input');
        this.user_name = document.getElementById('user-name');
        this.upload_input = document.getElementById('upload-profile-image-input');
    }

    setupImageUpload() {
        if (!this.user_avatar_input || !this.upload_input) return;

        this.user_avatar_input.addEventListener('click', () => {
            this.upload_input.click();
        });
        this.upload_input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.previewImage(file);
                this.postProfileImage(file);
            }
        });
    }

    async renderProfile() {
        if (this.user_name) this.user_name.textContent = this.formatedUserName;

        if (this.user_avatar_img) {
            if (this.currentUser.profile_picture) {
                const placeholder = document.getElementById('avatar-placeholder');
                if (placeholder) placeholder.style.display = 'none';

                this.user_avatar_img.src = this.currentUser.profile_picture;
                this.user_avatar_img.style.display = 'block';
            } else {
                console.log("entro aca en el else")
                this.showPlaceholder();
            }
        }
    }

    showPlaceholder() {
        if (this.user_avatar_img) {
            this.user_avatar_img.style.display = 'none';

            const initials = this.formatedUserName.split(' ')
                .map(word => word.charAt(0))
                .join('');

            let placeholder = document.getElementById('avatar-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.id = 'avatar-placeholder';
                placeholder.className = 'w-full h-full rounded-full bg-gradient-to-br bg-darker shadow-inner flex items-center justify-center text-white text-6xl font-bold';
                placeholder.textContent = initials;
                this.user_avatar_container.querySelector('.group').appendChild(placeholder);
            } else {
                placeholder.textContent = initials;
                placeholder.style.display = 'flex';
            }
        }
    }

    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.user_avatar_img) {
                this.user_avatar_img.src = e.target.result;
                this.user_avatar_img.style.display = 'block';

                const placeholder = document.getElementById('avatar-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            }
        };
        reader.readAsDataURL(file);
    }

    async postProfileImage(file) {
        try {
            const formData = new FormData();
            formData.append('profile_image', file);
            const response = await userService.updateProfileImage(formData);
            if (response.success) {
                this.showSuccessMessage('Se actualizo la foto de perfil!');
                await authHandler.getUserProfile();
            } else {
                this.showErrorMessage('Error al actualizar la imagen');
            }
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    showSuccessMessage = (message) => {
        showNotification(message, 'success');
    }

    showErrorMessage = (message) => {
        showNotification(message, 'error');
    }
}

export default ProfileHandler;