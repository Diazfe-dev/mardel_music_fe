import authHandler from "./auth.handler.js";
import {dropDownMenuItems} from "../constants/index.js";

class LayoutHandler {
    constructor() {
    }

    setupLayout = (user) => {
        this.setupProfileAvatar(user);
        this.setupDropdownMenu(user);
    }

    setupProfileAvatar = (user) =>{
        const profileBtn = document.getElementById('profile-img');
        const profileDropdown = document.getElementById('profile-dropdown');
        if (!user.profile_picture) {
            const profileImg = document.createElement('span');
            profileImg.className = "text-lg font-bold text-white text-center";
            profileImg.textContent = user.name.substring(0, 1).toUpperCase() + user.lastName.substring(0, 1).toUpperCase();
            profileBtn.appendChild(profileImg);
        } else {
            const profileImg = document.createElement('img');
            profileImg.src = user.profile_picture;
            profileImg.className = "w-full h-full object-cover rounded-full";
            profileBtn.appendChild(profileImg);
        }

        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            const notificationDropdown = document.getElementById('notification-dropdown');
            if (notificationDropdown && !notificationDropdown.classList.contains('hidden')) {
                notificationDropdown.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }

    setupDropdownMenu = (user) => {
        const profileDropdown = document.getElementById('profile-dropdown');
        dropDownMenuItems.forEach((item) => {
            const requiredRoles = item.requiredRoles.split('|');
            const userHasRole = requiredRoles.some(role => user.role.name.includes(role));
            if (!userHasRole) return;

            const li = document.createElement('li');
            const span = document.createElement('span');
            span.className = "text-sm font-medium";
            span.textContent = item.text;
            li.className = "py-4 px-2 hover:bg-[#242424] text-sm font-bold text-white transition-all cursor-pointer";
            li.appendChild(span);
            li.addEventListener('click', (e) => {
                profileDropdown.classList.add('hidden');
                window.location.href = item.href;
            });

            profileDropdown.appendChild(li);
        })

        const li = document.createElement('li');
        li.id = "logout-btn";
        li.className = "py-4 px-2 hover:bg-[#242424] text-sm font-bold text-white transition-all cursor-pointer";
        const span = document.createElement('span');
        span.className = "text-sm font-medium";
        span.textContent = "Cerrar sesión";

        li.addEventListener('click', async () => {
            await authHandler.logout();
        });
        li.appendChild(span);
        profileDropdown.appendChild(li);
    }
}

export default LayoutHandler;