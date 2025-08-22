import userService from '../services/user.service.js';
import authService from "../services/auth.service.js";

class ProfileHandler {
    constructor() {
        this.user = null;
        this.isLoading = false;
        this.userPromise = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.__initializeUser();
            });
        } else {
            this.__initializeUser();
        }
    }

    async __initializeUser() {
        try {
            await this.__getUserProfile();
        } catch (error) {
            this.__showError('Error al inicializar el perfil de usuario');
        }
    }

    async __getUserProfile() {
        if (this.isLoading) {
            return this.userPromise;
        }

        this.isLoading = true;

        this.userPromise = (async () => {
            try {
                const result = await userService.getCurrentUser();
                if (result.success) {
                    this.user = result.data;
                    return this.user;
                } else {
                    this.__showError(result.error.message);
                    return null;
                }
            } catch (error) {
                this.__showError('Error de conexión. Intente nuevamente.');
                return null;
            } finally {
                this.isLoading = false;
            }
        })();

        return this.userPromise;
    }

    async getUser() {
        if (this.isLoading && this.userPromise) return await this.userPromise;
        return await this.__getUserProfile();
    }

    async refreshUser() {
        this.user = null;
        this.isLoading = false;
        this.userPromise = null;
        return await this.__getUserProfile();
    }





    async logout() {

        try {
            const result = await authService.logout();
            if (result.success) {
                this.__showSuccess(result.message);
                this.clearUser();
                window.location.href = '/login';
            } else {
                this.__showError(result.error.message);
                return null;
            }
        } catch (error) {
            this.__showError('Error de conexión. Intente nuevamente.');
            return null;
        }
    }

    __showError(message) {
        this.__showNotification(message, 'error');
    }

    __showSuccess(message) {
        this.__showNotification(message, 'success');
    }

    __showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 text-white shadow-lg opacity-80 border-1 flex items-center gap-2
        ${type === 'success' ? 'bg-green-900 border-green-300' : 'bg-red-900 border-red-300'}`;

        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'alert-circle');

        notification.appendChild(icon);
        notification.appendChild(document.createTextNode(message));

        document.body.appendChild(notification);

        if (window.refreshIcons) {
            window.refreshIcons();
        }

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

export default ProfileHandler;