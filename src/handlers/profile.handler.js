import {showNotification} from '../utils/toaster.js';
import authService from '../services/auth.service.js';

class ProfileHandler {
    constructor() {
        this.currentUser = null;
        this.originalData = null;
        this.isLoading = false;
    }

    init(user) {
        this.currentUser = user;
        this.originalData = {...user};

        this.setupElements();
        this.loadUserData();
        this.setupEventListeners();
    }

    setupElements() {
        // Profile form
        this.profileForm = document.getElementById('profile-form');
        this.nameInput = document.getElementById('name-input');
        this.lastnameInput = document.getElementById('lastname-input');
        this.phoneInput = document.getElementById('phone-input');
        this.emailInput = document.getElementById('email-input');
        this.nationalitySelect = document.getElementById('nationality-select');
        this.roleInput = document.getElementById('role-input');
        this.cancelBtn = document.getElementById('cancel-btn');

        // Image form
        this.imageForm = document.getElementById('image-form');
        this.imgUrlInput = document.getElementById('img-url-input');
        this.profileImage = document.getElementById('profile-image');
        this.removeImageBtn = document.getElementById('remove-image-btn');
        this.profileUsername = document.getElementById('profile-username');

        // Password form
        this.passwordForm = document.getElementById('password-form');
        this.previousPasswordInput = document.getElementById('previous-password-input');
        this.newPasswordInput = document.getElementById('new-password-input');
        this.repeatNewPasswordInput = document.getElementById('repeat-new-password-input');
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Cargar datos en el formulario principal
        this.nameInput.value = this.currentUser.name || '';
        this.lastnameInput.value = this.currentUser.lastName || '';
        this.phoneInput.value = this.currentUser.phone || '';
        this.emailInput.value = this.currentUser.email || '';
        this.nationalitySelect.value = this.currentUser.nationality || 'argentina';

        this.roleInput.value = `${
            this.currentUser.role.name
                .substring(0, 1)
                .toUpperCase()
        }${this.currentUser.role.name
                .substring(1, this.currentUser.role.name.length)}` || 'Visitant';

        // Cargar username
        this.profileUsername.textContent = `${this.currentUser.name} ${this.currentUser.lastName}`;

        // Cargar imagen de perfil
        if (this.currentUser.profile_picture) {
            this.profileImage.src = this.currentUser.profile_picture;
        }
    }

    setupEventListeners() {
        // Profile form
        this.profileForm?.addEventListener('submit', this.handleProfileUpdate.bind(this));
        this.cancelBtn?.addEventListener('click', this.handleCancel.bind(this));

        // Image form
        this.imageForm?.addEventListener('submit', this.handleImageUpdate.bind(this));
        this.removeImageBtn?.addEventListener('click', this.handleRemoveImage.bind(this));

        // Password form
        this.passwordForm?.addEventListener('submit', this.handlePasswordChange.bind(this));

        // Preview imagen mientras escribes
        this.imgUrlInput?.addEventListener('input', this.handleImagePreview.bind(this));
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const formData = this.getProfileFormData();
        if (!this.validateProfileForm(formData)) return;

        this.setLoading(true, 'profile');

        try {
            const result = await authService.updateProfile(formData);

            if (result.success) {
                this.currentUser = {...this.currentUser, ...formData};
                this.originalData = {...this.currentUser};
                this.showSuccess('Perfil actualizado correctamente');
                this.profileUsername.textContent = `${formData.name} ${formData.lastName}`;
            } else {
                this.showError(result.error?.message || 'Error al actualizar perfil');
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.setLoading(false, 'profile');
        }
    }

    async handleImageUpdate(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const imageUrl = this.imgUrlInput.value.trim();
        if (!imageUrl) {
            this.showError('Por favor ingrese una URL válida');
            return;
        }

        if (!this.isValidUrl(imageUrl)) {
            this.showError('URL de imagen inválida');
            return;
        }

        this.setLoading(true, 'image');

        try {
            const result = await authService.updateProfileImage(imageUrl);

            if (result.success) {
                this.profileImage.src = imageUrl;
                this.currentUser.profile_picture = imageUrl;
                this.imgUrlInput.value = '';
                this.showSuccess('Imagen actualizada correctamente');
            } else {
                this.showError(result.error?.message || 'Error al actualizar imagen');
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.setLoading(false, 'image');
        }
    }

    async handleRemoveImage() {
        if (this.isLoading) return;

        this.setLoading(true, 'image');

        try {
            const result = await authService.removeProfileImage();

            if (result.success) {
                this.profileImage.src = 'https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg';
                this.currentUser.profile_picture = null;
                this.showSuccess('Imagen eliminada correctamente');
            } else {
                this.showError(result.error?.message || 'Error al eliminar imagen');
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.setLoading(false, 'image');
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const passwordData = this.getPasswordFormData();
        if (!this.validatePasswordForm(passwordData)) return;

        this.setLoading(true, 'password');

        try {
            const result = await authService.changePassword(passwordData);

            if (result.success) {
                this.clearPasswordForm();
                this.showSuccess('Contraseña cambiada correctamente');
            } else {
                this.showError(result.error?.message || 'Error al cambiar contraseña');
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.setLoading(false, 'password');
        }
    }

    handleCancel() {
        this.loadUserData(); // Restaurar datos originales
        this.clearErrors();
        this.showSuccess('Cambios cancelados');
    }

    handleImagePreview() {
        const url = this.imgUrlInput.value.trim();
        if (url && this.isValidUrl(url)) {
            // Preview temporal (no guardar hasta submit)
            this.profileImage.style.opacity = '0.7';
            this.profileImage.src = url;
            this.profileImage.onload = () => {
                this.profileImage.style.opacity = '1';
            };
            this.profileImage.onerror = () => {
                this.profileImage.style.opacity = '1';
                this.profileImage.src = this.currentUser.profile_picture || 'https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg';
            };
        }
    }

    getProfileFormData() {
        return {
            name: this.nameInput.value.trim(),
            lastName: this.lastnameInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            email: this.emailInput.value.trim(),
            nationality: this.nationalitySelect.value
        };
    }

    getPasswordFormData() {
        return {
            previousPassword: this.previousPasswordInput.value,
            newPassword: this.newPasswordInput.value,
            repeatNewPassword: this.repeatNewPasswordInput.value
        };
    }

    validateProfileForm({name, lastName, phone, email}) {
        this.clearErrors();
        let isValid = true;

        if (!name || name.length < 2) {
            this.showFieldError(this.nameInput, 'Nombre debe tener al menos 2 caracteres');
            isValid = false;
        }

        if (!lastName || lastName.length < 2) {
            this.showFieldError(this.lastnameInput, 'Apellido debe tener al menos 2 caracteres');
            isValid = false;
        }

        if (!phone || phone.length < 8) {
            this.showFieldError(this.phoneInput, 'Teléfono debe tener al menos 8 dígitos');
            isValid = false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showFieldError(this.emailInput, 'Email inválido');
            isValid = false;
        }

        return isValid;
    }

    validatePasswordForm({previousPassword, newPassword, repeatNewPassword}) {
        this.clearPasswordErrors();
        let isValid = true;

        if (!previousPassword) {
            this.showFieldError(this.previousPasswordInput, 'Contraseña anterior requerida');
            isValid = false;
        }

        if (!newPassword || newPassword.length < 8) {
            this.showFieldError(this.newPasswordInput, 'Nueva contraseña debe tener al menos 8 caracteres');
            isValid = false;
        } else if (!this.isValidPassword(newPassword)) {
            this.showFieldError(this.newPasswordInput, 'Debe contener mayúscula, minúscula y número');
            isValid = false;
        }

        if (newPassword !== repeatNewPassword) {
            this.showFieldError(this.repeatNewPasswordInput, 'Las contraseñas no coinciden');
            isValid = false;
        }

        return isValid;
    }

    setLoading(loading, type) {
        this.isLoading = loading;
        const buttons = document.querySelectorAll(`#${type}-form button[type="submit"]`);

        buttons.forEach(button => {
            button.disabled = loading;
            if (loading) {
                button.innerHTML = button.innerHTML.replace(/Guardar|Cambiar/, 'Guardando...');
            } else {
                button.innerHTML = button.innerHTML.replace('Guardando...',
                    type === 'image' ? 'Cambiar foto de perfil' :
                        type === 'password' ? 'Cambiar contraseña' : 'Guardar cambios'
                );
            }
        });
    }

    clearPasswordForm() {
        this.previousPasswordInput.value = '';
        this.newPasswordInput.value = '';
        this.repeatNewPasswordInput.value = '';
    }

    showSuccess(message) {
        showNotification(message, 'success');
    }

    showError(message) {
        showNotification(message, 'error');
    }

    showFieldError(field, message) {
        if (!field) return;

        field.classList.add('border-red-500');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-xs mt-1 field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearErrors() {
        document.querySelectorAll('#profile-form .field-error').forEach(error => error.remove());
        document.querySelectorAll('#profile-form input').forEach(input =>
            input.classList.remove('border-red-500')
        );
    }

    clearPasswordErrors() {
        document.querySelectorAll('#password-form .field-error').forEach(error => error.remove());
        document.querySelectorAll('#password-form input').forEach(input =>
            input.classList.remove('border-red-500')
        );
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        } catch {
            return false;
        }
    }
}

export default ProfileHandler;