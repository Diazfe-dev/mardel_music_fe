import authService from '../services/auth.service.js';
import {showNotification} from '../utils/toaster.js';

class RegisterHandler {
    constructor() {
        this.form = null;
        this.nameInput = null;
        this.lastNameInput = null;
        this.phoneInput = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.repeatPasswordInput = null;
        this.submitButton = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.form = document.getElementById('credentials-form');
        if (this.form) {
            // Seleccionar inputs por posición ya que no tienen IDs
            const inputs = this.form.querySelectorAll('input');
            this.nameInput = inputs[0]; // Primer input (Nombre)
            this.lastNameInput = inputs[1]; // Segundo input (Apellido)
            this.phoneInput = inputs[2]; // Tercer input (Teléfono)
            this.emailInput = inputs[3]; // Cuarto input (Email)
            this.passwordInput = inputs[4]; // Quinto input (Contraseña)
            this.repeatPasswordInput = inputs[5]; // Sexto input (Repetir contraseña)

            this.submitButton = this.form.querySelector('button[type="submit"]');
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
            name: this.nameInput?.value.trim(),
            lastName: this.lastNameInput?.value.trim(),
            phone: this.phoneInput?.value.trim(),
            email: this.emailInput?.value.trim(),
            password: this.passwordInput?.value,
            repeatPassword: this.repeatPasswordInput?.value
        };
    }

    validateForm({ name, lastName, phone, email, password, repeatPassword }) {
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

        if (!phone) {
            this.showFieldError(this.phoneInput, 'El teléfono es requerido');
            isValid = false;
        } else if (phone.length < 8) {
            this.showFieldError(this.phoneInput, 'Mínimo 8 dígitos');
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

        if (!repeatPassword) {
            this.showFieldError(this.repeatPasswordInput, 'Confirmar contraseña es requerido');
            isValid = false;
        } else if (password !== repeatPassword) {
            this.showFieldError(this.repeatPasswordInput, 'Las contraseñas no coinciden');
            isValid = false;
        }

        return isValid;
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (this.submitButton) {
            this.submitButton.disabled = loading;
            this.submitButton.innerHTML = loading
                ? '<span class="font-semibold">Creando cuenta...</span>'
                : '<span class="font-semibold">Registrarme</span>';
        }
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
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());

        [this.nameInput, this.lastNameInput, this.phoneInput, this.emailInput, this.passwordInput, this.repeatPasswordInput]
            .forEach(input => input?.classList.remove('border-red-500'));
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