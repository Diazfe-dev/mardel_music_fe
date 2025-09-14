import profileService from '../services/profile.service.js';
import genresService from '../services/genres.service.js';
import socialMediaService from "../services/social-media.service.js";

import { showNotification } from "../utils/toaster.js";
import { createDialog } from "../utils/modal.js";
import MultipleSelect from '../components/MultipleSelect.js';

class ArtistProfileCreateHandler {
    constructor() {
        this.socialMediaData = [];
    }

    async init(user) {
        this.user = user;
        this.setupImageUpload();
        await this.loadSocialMediaTypes();
        this.createSocialMediaSections();
        this.setupSocialMediaInputEvents();
        this.setupCallToActionButtons();
        await this.setupMultipleSelect();
    }

    async loadGenres() {
        const genresResponse = await genresService.getAllGenres();
        return genresResponse.data.genres;
    }

    async searchGenres(searchTerm){
        const searchResponse = await genresService.getGenresByQuery(searchTerm);
        return searchResponse.data.genres;
    }

    async setupMultipleSelect() {
        const genresList = await this.loadGenres();
        const genres = genresList.map(g => g.name);
        this.genreMultipleSelect = new MultipleSelect('genre-selector-container', genres, 'Añadir géneros');
    }

    async loadSocialMediaTypes() {
        try {
            const typesResponse = await socialMediaService.getSocialMediaTypes();
            const types = typesResponse.data.socialMedias;

            const socialMediaResponse = await socialMediaService.getAllSocialMediaWithTypes();
            const allSocialMedia = socialMediaResponse.data.socialMedias;

            this.socialMediaData = types.map(type => {
                return {
                    ...type,
                    social_medias: allSocialMedia
                        .filter(sm => sm.type.id === type.id)
                }
            });
        } catch (error) {
            console.error('❌ Error loading social media types:', error);
            this.showErrorMessage('Error al cargar los tipos de redes sociales');
        }
    }

    createSocialMediaSections() {
        const container = document.getElementById('social-media-container');
        if (!container || !this.socialMediaData.length) {
            console.warn('⚠️ Container not found or no social media data');
            return;
        }

        container.innerHTML = '';

        this.socialMediaData.forEach(type => {
            if (type.social_medias && type.social_medias.length > 0) {
                const section = this.createSocialMediaTypeSection(type);
                container.appendChild(section);
            }
        });
    }

    createSocialMediaTypeSection(type) {
        const section = document.createElement('div');
        section.className = 'social-media-type-section mb-4 rounded-lg overflow-hidden';
        section.setAttribute('data-type-id', type.id);

        const typeIcon = this.getSocialMediaTypeIcon(type.name);
        const typeColor = this.getSocialMediaTypeColor(type.name);

        section.innerHTML = `
            <!-- Acordeón Header -->
            <div class="accordion-header flex items-center justify-between p-4 cursor-pointer bg-darker hover:bg-gray-800 transition-colors" 
                 data-accordion-target="accordion-${type.id}">
                <div class="flex items-center">
      
                    <h3 class="text-lg font-bold text-light opacity-80 drop-shadow-[#242424] drop-shadow-xl">
                        ${type.description || type.name}
                    </h3>
                    <span class="ml-2 text-sm text-gray-400">
                        (${type.social_medias.length} plataforma${type.social_medias.length !== 1 ? 's' : ''})
                    </span>
                    <!-- Indicador de modificaciones -->
                    <span class="modification-indicator ml-2 text-red-500 font-bold hidden" title="Hay cambios sin guardar">
                        *
                    </span>
                </div>
                <div class="flex items-center">
                    <!-- Contador de campos completados -->
                    <span class="completed-counter text-xs text-gray-500 mr-3">
                        <span class="completed">0</span>/<span class="total">${type.social_medias.length}</span>
                    </span>
                    <!-- Icono de expandir/colapsar -->
                    <svg class="accordion-icon w-5 h-5 text-gray-400 transform transition-transform" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Acordeón Content -->
            <div id="accordion-${type.id}" class="accordion-content profile-gradient">
                <div class="p-4 bg-transparent">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${type.social_medias.map(socialMedia => this.createSocialMediaInput(socialMedia, type)).join('')}
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    createSocialMediaInput(socialMedia, type) {
        const inputId = `social-media-${socialMedia.id}`;
        const platformIcon = this.getSocialMediaIcon(socialMedia.name);
        return `
        <div class="social-media-input-group" data-social-media-id="${socialMedia.id}">
            <label for="${inputId}" class="flex items-center text-light mb-2">
                <span class="text-sm font-medium">${socialMedia.name}</span>
                ${socialMedia.description ? `<span class="ml-1 text-gray-400 text-xs">- ${socialMedia.description}</span>` : ''}
                <!-- Indicador individual de modificación -->
                <span class="input-modified-indicator ml-1 text-red-500 text-xs hidden">●</span>
            </label>
            <div class="relative">
                <input
                    type="url"
                    id="${inputId}"
                    name="social_media[${socialMedia.id}]"
                    class="w-full bg-darker text-light p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="https://${this.getPlaceholderDomain(socialMedia.name)}/tu-perfil"
                    data-social-media-id="${socialMedia.id}"
                    data-platform-name="${socialMedia.name}"
                    data-original-value=""
                />
                <button
                    type="button"
                    class="absolute inset-y-0 right-0 items-center pr-3 text-gray-400 hover:text-gray-300 clear-input-btn hidden transition-colors"
                    data-target="${inputId}"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    }

    getSocialMediaTypeIcon(typeName) {
        const icons = {
            'music': '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>',
            'video': '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
            'social': '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
        };
        return icons[typeName] || icons['social'];
    }

    getSocialMediaTypeColor(typeName) {
        const colors = {
            'music': 'bg-purple-500',
            'video': 'bg-red-500',
            'social': 'bg-blue-500'
        };
        return colors[typeName] || colors['social'];
    }

    getSocialMediaIcon(platformName) {
        const platform = platformName.toLowerCase();
        const icons = {
            'spotify': '🎵',
            'youtube': '📺',
            'youtube music': '🎵',
            'instagram': '📷',
            'facebook': '👥',
            'twitter / x': '🐦',
            'tiktok': '🎬',
            'soundcloud': '☁️',
            'apple music': '🍎',
            'deezer': '🎵',
            'tidal': '🌊',
            'amazon music': '📦',
            'bandcamp': '🎪',
            'pandora': '📻'
        };
        return icons[platform] || '🔗';
    }

    setupSocialMediaInputEvents() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-social-media-id]')) {
                this.handleSocialMediaInput(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.clear-input-btn')) {
                const targetId = e.target.closest('.clear-input-btn').dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    input.value = '';
                    this.toggleClearButton(input, false);
                }
            }

            // Manejar clic del acordeón
            if (e.target.closest('.accordion-header')) {
                const header = e.target.closest('.accordion-header');
                this.toggleAccordion(header);
            }
        });
    }

    getPlaceholderDomain(platformName) {
        const platform = platformName.toLowerCase();
        const domains = {
            'spotify': 'open.spotify.com',
            'youtube': 'youtube.com',
            'youtube music': 'music.youtube.com',
            'instagram': 'instagram.com',
            'facebook': 'facebook.com',
            'twitter / x': 'x.com',
            'tiktok': 'tiktok.com',
            'soundcloud': 'soundcloud.com',
            'apple music': 'music.apple.com',
            'deezer': 'deezer.com',
            'tidal': 'tidal.com',
            'amazon music': 'music.amazon.com',
            'bandcamp': 'bandcamp.com',
            'pandora': 'pandora.com'
        };
        return domains[platform] || platformName.toLowerCase().replace(/\s/g, '').replace(/\/.*/, '') + '.com';
    }

    handleSocialMediaInput(input) {
        const hasValue = input.value.trim().length > 0;
        this.toggleClearButton(input, hasValue);

        if (hasValue && !this.isValidUrl(input.value)) {
            input.classList.remove('border-gray-600', 'focus:border-blue-500');
            input.classList.add('border-red-500', 'focus:border-red-400');
        } else {
            input.classList.remove('border-red-500', 'focus:border-red-400');
            input.classList.add('border-gray-600', 'focus:border-blue-500');
        }
    }

    toggleClearButton(input, show) {
        const clearBtn = input.parentElement.querySelector('.clear-input-btn');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !show);
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    toggleAccordion(header) {
        const targetId = header.dataset.accordionTarget;
        const content = document.getElementById(targetId);
        const icon = header.querySelector('.accordion-icon');

        if (!content || !icon) return;

        const isOpen = content.classList.contains('open');

        if (isOpen) {
            content.classList.remove('open');
            icon.classList.remove('rotate-180');
        } else {
            content.classList.add('open');
            icon.classList.add('rotate-180');
        }
    }

    getSocialMediaValues() {
        const socialMediaValues = {};
        const inputs = document.querySelectorAll('[data-social-media-id]');

        inputs.forEach(input => {
            const socialMediaId = input.dataset.socialMediaId;
            const url = input.value?.trim();

            if (url) {
                socialMediaValues[socialMediaId] = {
                    social_media_id: parseInt(socialMediaId),
                    url: url,
                    platform_name: input.dataset.platformName
                };
            }
        });

        return socialMediaValues;
    }

    setupImageUpload() {
        this.imageInput = document.getElementById('image-input');
        this.profileImage = document.getElementById('profile-image');
        this.imagePlaceholder = document.getElementById('image-placeholder');
        this.selectImageBtn = document.getElementById('select-image-btn');
        this.removeImageBtn = document.getElementById('remove-image-btn');

        if (!this.imageInput || !this.selectImageBtn) return;

        this.selectImageBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.previewImage(file);
            }
        });

        this.removeImageBtn?.addEventListener('click', () => {
            this.removeImage();
        });
    }

    previewImage(file) {
        // Guardar el archivo seleccionado
        this.selectedImage = file;

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
        // Limpiar la imagen seleccionada
        this.selectedImage = null;

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

    setupCallToActionButtons() {
        const cancelButton = document.getElementById('cancel-btn');
        const submitButton = document.getElementById('submit-btn');

        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.handleCancel());
        }

        if (submitButton) {
            submitButton.addEventListener('click', () => this.handleSubmit());
        }
    }

    handleCancel() {
        this.createCancelModal();
    }

    createCancelModal() {
        const bodyElement = document.createElement('div');
        bodyElement.className = "mb-4 text-gray-700";
        bodyElement.innerHTML = `
            <p>Si cancelas, se perderán todos los cambios realizados hasta ahora.</p>
            <p class="mt-2">¿Estás seguro que deseas cancelar la creación del perfil?</p>
        `;

        const confirmButton = document.createElement('button');
        confirmButton.className = "btn primary";
        confirmButton.textContent = "Sí, cancelar";

        const cancelButton = document.createElement('button');
        cancelButton.className = "btn secondary";
        cancelButton.textContent = "No, volver";

        const cancelModal = createDialog({
            modalId: 'cancel-modal',
            title: 'Deseas cancelar la creación del perfil?',
            bodyElement: bodyElement,
            buttons: [cancelButton, confirmButton]
        })


        document.body.appendChild(cancelModal);
        cancelModal.showModal();

        confirmButton.onclick = () => {
            window.location.href = '/pages/dashboard.html';
        };

        cancelButton.onclick = () => {
            cancelModal.close();
        };
    }

    handleSubmit() {
        this.showPreviewModal();
    }

    getFormData() {
        const formData = {
            artistName: document.getElementById('artist-name')?.value?.trim() || '',
            bio: document.getElementById('artist-bio')?.value?.trim() || '',
            location: document.getElementById('artist-location')?.value?.trim() || '',
            genres: this.genreMultipleSelect.getSelectedOptions().join(', ') || '',
            image: this.selectedImage || null,
            socialMedia: this.getSocialMediaValues(),
        };

        return formData;
    }

    validateFormData(data) {
        const errors = [];

        if (!data.artistName) {
            errors.push('El nombre del artista es requerido');
        }

        if (!data.bio) {
            errors.push('La biografía es requerida');
        }

        Object.values(data.socialMedia).forEach(social => {
            if (social.url && !this.isValidUrl(social.url)) {
                errors.push(`URL inválida para ${social.platform_name}`);
            }
        });

        return errors;
    }

    showPreviewModal() {
        const formData = this.getFormData();
        const errors = this.validateFormData(formData);

        if (errors.length > 0) {
            this.showErrorMessage(errors.join('\n'));
            return;
        }

        this.createPreviewModal(formData);
    }

    createPreviewModal(formData) {
        const socialMediaList = Object.values(formData.socialMedia);
        const hasImage = formData.image;
        const genres = formData.selectedGenres;
        const imageUrl = hasImage ? URL.createObjectURL(formData.image) : '/public/placeholder-image.jpeg';
        const modalStyle = "backdrop:bg-black backdrop:opacity-70 bg-transparent border-none outline-none fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto max-w-4xl p-0 rounded-lg shadow-2xl";
        const contentStyle = "bg-darker text-light rounded-lg max-w-[90vw] shadow-2xl";
        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            <div class="w-full">
                <div><h2 class="text-2xl font-bold mb-4 text-light">Revisa la información antes de enviarla a revisión</h2></div>
                
                <div class="flex flex-row items-center justify-center">
                ${hasImage ? `<img src="${imageUrl}" alt="Imagen de perfil" class="w-32 h-32 object-cover rounded-full mb-4 mx-auto shadow-lg">`
                : `<div class="w-32 h-32 flex items-center justify-center bg-gray-600 rounded-full mb-4 mx-auto shadow-lg">
                    <span class="text-4xl font-bold text-white">${formData.artistName.substring(0, 1).toUpperCase()}</span>
                    </div>`
            }

                <div class="ml-6 flex-1">
                    <h3 class="text-xl font-bold mb-2">${formData.artistName}</h3>
                    <p class="mb-2"><strong>Biografía:</strong> ${formData.bio}</p>
                    ${formData.location ? `<p class="mb-2"><strong>Ubicación:</strong> ${formData.location}</p>` : ''}
                    ${formData.genres ? `<p class="mb-2"><strong>Géneros:</strong> ${formData.genres}</p>` : ''}
                </div>
                </div>
            </div>
        `;

        const cancelButton = document.createElement("button");
        cancelButton.innerHTML = `Cancelar`;
        cancelButton.className = 'btn danger';
        cancelButton.onclick = () => {
            window.location.href = '/pages/dashboard.html';
        };

        const editButton = document.createElement("button");
        editButton.innerHTML = `Editar`;
        editButton.className = "btn tertiary mr-2";
        editButton.onclick = () => {
            if (hasImage) URL.revokeObjectURL(imageUrl);
            previewModal.close();
        }

        const confirmButton = document.createElement("button");
        confirmButton.innerHTML = `Confirmar`;
        confirmButton.className = "btn primary";
        confirmButton.onclick = () => {
            if (hasImage) URL.revokeObjectURL(imageUrl);
            previewModal.close();
            this.createProfile(formData);
        };

        const previewModal = createDialog({
            modalId: 'preview-modal',
            title: 'Vista Previa de tu perfil de Artista',
            containerStyle: modalStyle,
            contentStyle: contentStyle,
            bodyElement: modalContent,
            buttons: [cancelButton, editButton, confirmButton]
        });

        previewModal.showModal();
    }

    async createProfile(formData) {
        try {
            this.setSubmitLoading(true);
            const submitData = new FormData();

            submitData.append('name', formData.artistName);
            submitData.append('bio', formData.bio);

            if (formData.location) submitData.append('location', formData.location);
            if (formData.genres) submitData.append('genres', formData.genres);
            if (formData.website) submitData.append('website', formData.website);
            if (formData.image) submitData.append('profile_image', formData.image);

            const socialMediaArray = Object.values(formData.socialMedia);

            if (socialMediaArray.length > 0) { submitData.append('social_media', JSON.stringify(socialMediaArray)); }

            const response = await profileService.createArtistProfile(submitData);

            if (response.success) { this.showSuccessMessage('¡Perfil de artista creado exitosamente!'); }
            else { throw new Error(response.message || 'Error al crear el perfil'); }

        } catch (error) {
            this.showErrorMessage(error.message || 'Error al crear el perfil. Intenta nuevamente.');
        } finally {
            this.setSubmitLoading(false);
        }
    }

    setSubmitLoading(isLoading) {
        const submitButton = document.getElementById('submit-btn');
        if (!submitButton) return;

        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Perfil...
            `;
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Crear Perfil';
        }
    }

    showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    showErrorMessage(message) {
        showNotification(message, 'error');
    }
}

export default ArtistProfileCreateHandler;