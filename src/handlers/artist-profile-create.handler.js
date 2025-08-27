import profileService from '../services/profile.service.js';
import socialMediaService from "../services/social-media.service.js";

class ArtistProfileCreateHandler {
    constructor() {
        this.user = null;
        this.socialMediaTypes = [];
        this.socialMediaInputs = [];

        this.form = null;
        this.artistNameInput = null;
        this.bioInput = null;
        this.avatarUrlInput = null;
        this.profileImage = null;
        this.imagePlaceholder = null;
        this.removeImageBtn = null;
        this.socialMediaContainer = null;
        this.addSocialBtn = null;
        this.cancelBtn = null;
    }

    async init(user) {
        this.user = user;
        this.setupDOM();
        await this.loadSocialMediaTypes();
        this.setupEventListeners();
        this.setupImagePreview();
    }

    setupDOM() {
        this.form = document.getElementById('artist-profile-form');
        this.artistNameInput = document.getElementById('artist-name-input');
        this.bioInput = document.getElementById('bio-input');
        this.avatarUrlInput = document.getElementById('avatar-url-input');
        this.profileImage = document.getElementById('profile-image');
        this.imagePlaceholder = document.getElementById('image-placeholder');
        this.removeImageBtn = document.getElementById('remove-image-btn');
        this.socialMediaContainer = document.getElementById('social-media-container');
        this.addSocialBtn = document.getElementById('add-social-btn');
        this.cancelBtn = document.getElementById('cancel-btn');

        if (!this.form) {
            console.warn('Artist profile create form elements not found');
            return;
        }
    }

    async loadSocialMediaTypes() {
        try {
            const response = await socialMediaService.getSocialMediaTypes();
            this.socialMediaTypes = response.data.socialMedias
        } catch (error) {
            console.error('Error fetching social media types:', error);
        }
    }

    setupEventListeners() {
        this.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

        this.cancelBtn?.addEventListener('click', () => this.handleCancel());

        this.addSocialBtn?.addEventListener('click', () => this.addSocialMediaInput());
        this.avatarUrlInput?.addEventListener('input', () => this.updateImagePreview());
        this.removeImageBtn?.addEventListener('click', () => this.removeImage());
    }

    setupImagePreview() {
        this.updateImagePreview();
    }

    updateImagePreview() {
        const url = this.avatarUrlInput?.value?.trim();

        if (url && this.isValidImageUrl(url)) {
            this.profileImage.src = url;
            this.profileImage.classList.remove('hidden');
            this.imagePlaceholder.classList.add('hidden');
            this.removeImageBtn.classList.remove('hidden');
        } else {
            this.profileImage.classList.add('hidden');
            this.imagePlaceholder.classList.remove('hidden');
            this.removeImageBtn.classList.add('hidden');
        }
    }

    removeImage() {
        this.avatarUrlInput.value = '';
        this.updateImagePreview();
    }

    isValidImageUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
        } catch {
            return false;
        }
    }

    addSocialMediaInput() {
        const inputId = `social-input-${Date.now()}`;
        const socialInput = {
            id: inputId,
            socialMediaId: '',
            url: ''
        };

        this.socialMediaInputs.push(socialInput);
        this.renderSocialMediaInputs();
    }

    removeSocialMediaInput(inputId) {
        this.socialMediaInputs = this.socialMediaInputs.filter(input => input.id !== inputId);
        this.renderSocialMediaInputs();
    }

    renderSocialMediaInputs() {
        if (this.socialMediaInputs.length === 0) {
            this.socialMediaContainer.innerHTML = '<p class="text-sm text-gray-500">No has agregado redes sociales aún</p>';
            return;
        }

        const html = this.socialMediaInputs.map(input => `
            <div class="flex flex-col sm:flex-row gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                <div class="flex-1">
                    <select data-input-id="${input.id}" data-field="social-media" 
                            class="w-full p-2 text-sm border border-gray-300 rounded bg-light text-soft-dark">
                        <option value="">Seleccionar red social</option>
                        ${this.socialMediaTypes.map(type =>
            `<option value="${type.id}" ${input.socialMediaId == type.id ? 'selected' : ''}>${type.name}</option>`
        ).join('')}
                    </select>
                </div>
                <div class="flex-2">
                    <input data-input-id="${input.id}" data-field="url"
                           type="url" 
                           value="${input.url}"
                           placeholder="URL de tu perfil"
                           class="w-full p-2 text-sm border border-gray-300 rounded bg-light text-soft-dark"/>
                </div>
                <button type="button" 
                        data-input-id="${input.id}"
                        class="remove-social-btn flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');

        this.socialMediaContainer.innerHTML = html;
        this.setupSocialMediaEventListeners();
        window.refreshIcons?.();
    }

    setupSocialMediaEventListeners() {
        this.socialMediaContainer.querySelectorAll('select[data-field="social-media"]').forEach(select => {
            select.addEventListener('change', (e) => {
                const inputId = e.target.dataset.inputId;
                const input = this.socialMediaInputs.find(i => i.id === inputId);
                if (input) input.socialMediaId = e.target.value;
            });
        });

        this.socialMediaContainer.querySelectorAll('input[data-field="url"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const inputId = e.target.dataset.inputId;
                const socialInput = this.socialMediaInputs.find(i => i.id === inputId);
                if (socialInput) socialInput.url = e.target.value;
            });
        });

        this.socialMediaContainer.querySelectorAll('.remove-social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const inputId = e.target.closest('button').dataset.inputId;
                this.removeSocialMediaInput(inputId);
            });
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            this.setLoadingState(true);

            const response = await profileService.CreateArtistProfile(formData);

            if (response.ok) {
                const result = await response.json();
                this.showSuccessMessage('¡Perfil de artista creado exitosamente!');

                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 2000);
            } else {
                const error = await response.json();
                this.showErrorMessage(error.message || 'Error al crear el perfil');
            }
        } catch (error) {
            console.error('Error creating artist profile:', error);
            this.showErrorMessage('Error al crear el perfil. Inténtalo de nuevo.');
        } finally {
            this.setLoadingState(false);
        }
    }

    getFormData() {
        const validSocialMedias = this.socialMediaInputs
            .filter(input => input.socialMediaId && input.url.trim())
            .map(input => ({
                social_media_id: parseInt(input.socialMediaId),
                uri: input.url.trim()
            }));

        return {
            artist_name: this.artistNameInput?.value?.trim(),
            bio: this.bioInput?.value?.trim() || null,
            avatar_url: this.avatarUrlInput?.value?.trim() || null,
            social_medias: validSocialMedias
        };
    }

    validateForm(formData) {
        if (!formData.artist_name) {
            this.showErrorMessage('El nombre artístico es obligatorio');
            this.artistNameInput?.focus();
            return false;
        }

        if (formData.artist_name.length < 2) {
            this.showErrorMessage('El nombre artístico debe tener al menos 2 caracteres');
            this.artistNameInput?.focus();
            return false;
        }

        if (formData.avatar_url && !this.isValidImageUrl(formData.avatar_url)) {
            this.showErrorMessage('La URL de la imagen no es válida');
            this.avatarUrlInput?.focus();
            return false;
        }

        return true;
    }

    setLoadingState(loading) {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Creando...' : 'Crear perfil';
        }
    }

    handleCancel() {
        if (confirm('¿Estás seguro? Se perderán todos los datos ingresados.')) {
            window.location.href = './dashboard.html';
        }
    }

    showSuccessMessage(message) {
        // Usar tu sistema de notificaciones existente
        console.log('Success:', message);
        // Aquí puedes integrar con tu NotificationHandler
    }

    showErrorMessage(message) {
        // Usar tu sistema de notificaciones existente
        console.error('Error:', message);
        // Aquí puedes integrar con tu NotificationHandler
    }
}

export default ArtistProfileCreateHandler;