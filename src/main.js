import './style.css';
import Alpine from 'alpinejs';
import {createIcons, icons} from 'lucide';

window.Alpine = Alpine;
Alpine.data('dropdown', () => ({
    open: false, toggle() {
        this.open = !this.open
    }
}))

Alpine.start();

createIcons({icons});
window.refreshIcons = () => {
    createIcons({icons})
};