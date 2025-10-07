import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";
import Observer from "../utils/observer.js";

class EventHandler {
    constructor() {
        this.init()
    }

    async init() {
        console.log('EventHandler initialized');
    }

    
}

export default EventHandler;