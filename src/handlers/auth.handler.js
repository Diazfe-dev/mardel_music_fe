import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";
import Observer from "../utils/observer.js";

class AuthHandler {
    constructor() {
        this.userObserver = new Observer();
    }

    async getUserProfile() {
        const response = await userService.getCurrentUser();

        if (response.success) {
            this.userObserver.notify(response.data);
            return response.data;
        } else {
            throw new Error(response.error.message);
        }
    }

    async logout() {
        try {
            const response = await authService.logout();
            if (response.success) {
                this.userObserver.notify(null);
                return response.data;
            }
        } catch (error) {
            this.userObserver.notify(null);
        }
    }

    subscribe(observer) {
        if (typeof observer !== 'function') {
            throw new Error('Observer must be a function');
        }
        this.userObserver.subscribe(observer);
    }
}

const authHandler = new AuthHandler();
export default authHandler;