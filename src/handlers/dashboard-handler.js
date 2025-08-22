import {createDialog} from '../utils/modal.js';

class DashboardHandler {
    constructor() {}

    checkIfUserHasProfileCreated = (user) => {
        if (!user.profile && !user.role != "viewer") {
            this.createProfileDialog(user);
        }
    }

    createProfileDialog = (user) => {
        const span = document.createElement("span")
        span.textContent = "Por favor, completa tu perfil para continuar.";
        span.className = "text-lg font-bold text-gray-700";

        const bodyElement = document.createElement('div');
        bodyElement.className = "flex flex-col items-center";
        bodyElement.appendChild(span);

        const createProfileBtn = document.createElement('button');
        createProfileBtn.textContent = "Crear perfil";
        createProfileBtn.className = "btn primary";
        createProfileBtn.addEventListener('click', () => {
            window.location.href = '/profile.html';
        });

        const continueBtn = document.createElement('button');
        continueBtn.textContent = "Continuar sin perfil";
        continueBtn.className = "btn secondary";
        continueBtn.addEventListener('click', () => {
            document.getElementById('profile-modal').close()
        });

        const modal = createDialog(
            'profile-modal',
            `Bienvenido, ${user.name} ${user.lastName}`,
            bodyElement,
            [createProfileBtn, continueBtn]
        );

        document.body.appendChild(modal);
        modal.showModal();
    }

    setupDashboard = (user) => {
        const profileBtn = document.getElementById('profile-img');
        const profileDropdown = document.getElementById('profile-dropdown');

        if (!user.profile_picture) {
            const profileImg = document.createElement('span');
            profileImg.className = "text-lg font-bold text-black text-center";
            profileImg.textContent = user.name.substring(0, 1).toUpperCase() + user.lastName.substring(0, 1).toUpperCase();
            profileBtn.appendChild(profileImg)
        } else {
            const profileImg = document.createElement('img');
            profileImg.src = user.profile_picture;
            profileImg.className = "w-full h-full object-cover rounded-full";
            profileBtn.appendChild(profileImg);
        }

        profileBtn.addEventListener('click', () => {
            profileDropdown.classList.toggle('hidden')
        });
    }

}

export default DashboardHandler;