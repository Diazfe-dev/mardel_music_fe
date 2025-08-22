import authService from '../services/auth.service.js';
import {showNotification} from '../utils/toaster.js';
class LoginHandler {
    constructor() {
        this.form = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.submitButton = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.form = document.querySelector('form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitButton = this.form.querySelector('button[type="submit"]');

        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.isLoading) return;

        const credentials = this.getFormData();
        if (!this.validateForm(credentials)) {
            return;
        }
        this.setLoading(true);

        try {
            const result = await authService.login(credentials);

            if (result.success) {
                this.showSuccess('Inicio de sesión exitoso');
                setTimeout(() => { window.location.href = '/dashboard.html' }, 1500);
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
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value
        };
    }

    validateForm({email, password}) {
        this.clearErrors();

        let isValid = true;

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
        } else if (password.length < 6) {
            this.showFieldError(this.passwordInput, 'Mínimo 6 caracteres');
            isValid = false;
        }

        return isValid;
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.submitButton.disabled = loading;
        this.submitButton.innerHTML = loading
            ? '<span class="text-sm font-semibold">Iniciando...</span>'
            : '<span class="text-sm font-semibold">Iniciar sesión</span>';
    }

    showSuccess(message) {
        showNotification(message, 'success');
    }

    showError(message) {
        showNotification(message, 'error');
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
        this.emailInput.classList.remove('border-red-500');
        this.passwordInput.classList.remove('border-red-500');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export default LoginHandler;