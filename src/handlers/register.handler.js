import authService from '../services/auth.service.js';

class RegisterHandler {
    constructor() {
        this.form = null;
        this.nameInput = null;
        this.lastNameInput = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.submitButton = null;
        this.showFormBtn = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.form = document.getElementById('credentials-form');
        this.nameInput = document.getElementById('name');
        this.lastNameInput = document.getElementById('lastName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.showFormBtn = document.getElementById('show-credentials-form');

        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const userData = this.getFormData();

        if (!this.validateForm(userData)) {
            return;
        }

        this.setLoading(true);

        try {
            const result = await authService.register(userData);
            if (result.success) {
                this.showSuccess('Registro exitoso. Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                this.showError(result.error.message);
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.setLoading(false);
        }
    }

    getFormData() {
        return {
            name: this.nameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value
        };
    }

    validateForm({ name, lastName, email, password }) {
        this.clearErrors();

        let isValid = true;

        if (!name) {
            this.showFieldError(this.nameInput, 'El nombre es requerido');
            isValid = false;
        } else if (name.length < 2) {
            this.showFieldError(this.nameInput, 'Mínimo 2 caracteres');
            isValid = false;
        }

        if (!lastName) {
            this.showFieldError(this.lastNameInput, 'El apellido es requerido');
            isValid = false;
        } else if (lastName.length < 2) {
            this.showFieldError(this.lastNameInput, 'Mínimo 2 caracteres');
            isValid = false;
        }

        if (!email) {
            this.showFieldError(this.emailInput, 'El email es requerido');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError(this.emailInput, 'Email inválido');
            isValid = false;
        }

        if (!password) {
            this.showFieldError(this.passwordInput, 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 8) {
            this.showFieldError(this.passwordInput, 'Mínimo 8 caracteres');
            isValid = false;
        } else if (!this.isValidPassword(password)) {
            this.showFieldError(this.passwordInput, 'Debe contener mayúscula, minúscula y número');
            isValid = false;
        }

        return isValid;
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.submitButton.disabled = loading;
        this.submitButton.innerHTML = loading
            ? '<span class="text-sm font-semibold">Creando cuenta...</span>'
            : '<span class="text-sm font-semibold">Crear cuenta</span>';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 text-white shadow-lg opacity-80 border-1
        ${type === 'success' ? 'bg-green-900 border-green-300' : 'bg-red-900 border-red-300'}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-xs mt-1 field-error';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());

        this.nameInput.classList.remove('border-red-500');
        this.lastNameInput.classList.remove('border-red-500');
        this.emailInput.classList.remove('border-red-500');
        this.passwordInput.classList.remove('border-red-500');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        return passwordRegex.test(password);
    }
}

export default RegisterHandler;