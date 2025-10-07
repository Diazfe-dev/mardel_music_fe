class NotificationHandler {
    constructor() {
        this.notifications = [
            {
                id: 1,
                title: "Nuevo álbum disponible",
                message: "Arctic Monkeys lanzó 'The Car'",
                read: false,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                type: 'album'
            },
            {
                id: 2,
                title: "Concierto cerca",
                message: "Bad Bunny en Buenos Aires - 25 Nov",
                read: false,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                type: 'event'
            },
            {
                id: 3,
                title: "Lista actualizada",
                message: "Se agregaron 5 canciones a 'Favoritos'",
                read: true,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                type: 'playlist'
            }
        ];

        this.notificationBtn = null;
        this.notificationDropdown = null;
        this.notificationBadge = null;
    }


    init() {
        this.notificationBtn = document.getElementById('notification-bell');
        this.notificationDropdown = document.getElementById('notification-dropdown');
        this.notificationBadge = document.getElementById('notification-badge');

        if (!this.notificationBtn || !this.notificationDropdown || !this.notificationBadge) {
            console.warn('Notification elements not found');
            return;
        }

        this.setupNotifications();
        this.setupEventListeners();
    }

    setupNotifications() {
        const unreadCount = this.getUnreadCount();

        if (unreadCount > 0) {
            this.showBadge(unreadCount);
            this.renderNotifications();
        } else {
            this.hideBadge();
            this.disableButton();
        }
    }

    setupEventListeners() {
        this.notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!this.notificationBtn.contains(e.target) && !this.notificationDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        const isHidden = this.notificationDropdown.classList.contains('hidden');

        if (isHidden) {
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    openDropdown() {
        this.notificationDropdown.classList.remove('hidden');
        const profileDropdown = document.getElementById('artist-dropdown');
        if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
            profileDropdown.classList.add('hidden');
        }
    }

    closeDropdown() {
        this.notificationDropdown.classList.add('hidden');
    }

    renderNotifications() {
        this.notificationDropdown.innerHTML = '';

        if (this.notifications.length === 0) {
            this.renderEmptyState();
            return;
        }

        const sortedNotifications = [...this.notifications]
            .sort((a, b) => b.timestamp - a.timestamp);

        sortedNotifications.forEach(notification => {
            this.renderNotification(notification);
        });

        if (this.getUnreadCount() > 0) {
            this.renderMarkAllReadButton();
        }
    }

    renderNotification(notification) {
        const li = document.createElement('li');
        li.className = `p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-all ${
            !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        }`;

        li.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                        <p class="text-sm font-medium text-gray-900">
                            ${notification.title}
                        </p>
                        ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                        ${notification.message}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                        ${this.formatTimestamp(notification.timestamp)}
                    </p>
                </div>
            </div>
        `;

        li.addEventListener('click', () => {
            this.handleNotificationClick(notification);
        });

        this.notificationDropdown.appendChild(li);
    }

    renderEmptyState() {
        const li = document.createElement('li');
        li.className = 'p-6 text-center text-gray-500';
        li.innerHTML = `
            <div class="flex flex-col items-center gap-2">
                <i data-lucide="bell-off" class="w-8 h-8 text-gray-400"></i>
                <span class="text-sm">No tienes notificaciones</span>
            </div>
        `;
        this.notificationDropdown.appendChild(li);
    }

    renderMarkAllReadButton() {
        const li = document.createElement('li');
        li.className = 'p-3 border-t border-gray-200 bg-gray-50';
        li.innerHTML = `
            <button class="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-1">
                Marcar todas como leídas
            </button>
        `;

        li.addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAllAsRead();
        });

        this.notificationDropdown.appendChild(li);
    }

    handleNotificationClick(notification) {
        // Marcar como leída
        notification.read = true;

        // Re-renderizar
        this.renderNotifications();
        this.updateBadge();

        // Lógica específica según el tipo
        switch (notification.type) {
            case 'album':
                // Redirigir a la página del álbum
                console.log('Redirect to album');
                break;
            case 'event':
                // Redirigir a eventos
                console.log('Redirect to events');
                break;
            case 'playlist':
                // Redirigir a playlists
                console.log('Redirect to playlists');
                break;
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });

        this.hideBadge();
        this.renderNotifications();
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    showBadge(count) {
        this.notificationBadge.textContent = count > 99 ? '99+' : count;
        this.notificationBadge.classList.remove('hidden');
        this.notificationBtn.style.opacity = '1';
        this.notificationBtn.style.cursor = 'pointer';
    }

    hideBadge() {
        this.notificationBadge.classList.add('hidden');
    }

    updateBadge() {
        const unreadCount = this.getUnreadCount();
        if (unreadCount > 0) {
            this.showBadge(unreadCount);
        } else {
            this.hideBadge();
        }
    }

    disableButton() {
        this.notificationBtn.style.opacity = '0.3';
        this.notificationBtn.style.cursor = 'default';
    }

    getNotificationIcon(type) {
        const iconMap = {
            album: '<i data-lucide="disc" class="w-4 h-4"></i>',
            event: '<i data-lucide="calendar" class="w-4 h-4"></i>',
            playlist: '<i data-lucide="list-music" class="w-4 h-4"></i>',
            default: '<i data-lucide="bell" class="w-4 h-4"></i>'
        };
        return iconMap[type] || iconMap.default;
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Hace un momento';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} días`;

        return timestamp.toLocaleDateString('es-ES');
    }

    // Métodos públicos para agregar/remover notificaciones
    addNotification(notification) {
        notification.id = Date.now();
        notification.timestamp = new Date();
        notification.read = false;

        this.notifications.unshift(notification);
        this.renderNotifications();
        this.updateBadge();
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.renderNotifications();
        this.updateBadge();
    }
}

export default NotificationHandler;