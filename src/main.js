import './style.css';
import {createIcons, icons} from 'lucide';
createIcons({icons});
window.refreshIcons = () => {
    createIcons({icons});
};