import profileService from '../services/profile.service.js';
import socialMediaService from "../services/social-media.service.js";
import {showNotification} from "../utils/toaster.js";
import {createDialog} from "../utils/modal.js";

class ArtistProfileCreateHandler {
    constructor() {
    }

    init(user) {
        this.setupImageUpload();
    }

    setupImageUpload() {
        this.imageInput = document.getElementById('image-input');
        this.profileImage = document.getElementById('profile-image');
        this.imagePlaceholder = document.getElementById('image-placeholder');
        this.selectImageBtn = document.getElementById('select-image-btn');
        this.removeImageBtn = document.getElementById('remove-image-btn');

        if (!this.imageInput || !this.selectImageBtn) return;

        // Abrir selector de archivos al hacer click
        this.selectImageBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        // Manejar selección de archivo
        this.imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.previewImage(file);
            }
        });

        // Remover imagen
        this.removeImageBtn?.addEventListener('click', () => {
            this.removeImage();
        });
    }

    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.profileImage && this.imagePlaceholder && this.removeImageBtn) {
                this.profileImage.src = e.target.result;
                this.profileImage.classList.remove('hidden');
                this.imagePlaceholder.classList.add('hidden');
                this.removeImageBtn.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        if (this.imageInput) {
            this.imageInput.value = '';
        }
        if (this.profileImage && this.imagePlaceholder && this.removeImageBtn) {
            this.profileImage.src = '';
            this.profileImage.classList.add('hidden');
            this.imagePlaceholder.classList.remove('hidden');
            this.removeImageBtn.classList.add('hidden');
        }
    }

    getSelectedFile() {
        return this.imageInput?.files[0] || null;
    }


    handleCancel() {
    }

    showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    showErrorMessage(message) {
        showNotification(message, 'error');
    }
}

export default ArtistProfileCreateHandler;