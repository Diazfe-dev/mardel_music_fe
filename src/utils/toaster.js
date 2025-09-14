export function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 z-[9999] border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-notification flex flex-row items-center
    ${type === 'success' ? 'bg-green-900 border-green-300' : 'bg-red-900 border-red-300'}`;

    const iconContainer = document.createElement('div');
    iconContainer.className = 'w-5 h-5 mr-1';

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide',
        type === 'success' ? 'check-circle' : 'alert-circle');
    icon.className = "w-5 h-5"
    iconContainer.appendChild(icon);

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;

    notification.appendChild(iconContainer);
    notification.appendChild(messageSpan);

    document.body.appendChild(notification);

    if (window.refreshIcons) {
        window.refreshIcons();
    }

    setTimeout(() => {
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 1500);
}