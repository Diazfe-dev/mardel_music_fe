export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const validUnauthorizedRoutes = [
    '/pages/auth/login',
    '/pages/auth/register',
    '/pages/auth/forgot-password',
    '/pages/auth/reset-password'
]

export const dropDownMenuItems = [
    {
        text: 'Dashboard',
        href: '/pages/dashboard.html',
        requiredRoles: 'user|artist|admin'
    },
    {
        text: 'Mi perfil',
        href: '/pages/user/profile.html',
        requiredRoles: 'user|artist|admin'
    },
    {
        text: 'Perfil de artista',
        href: '/pages/artist/profile.html',
        requiredRoles: 'user|artist|admin'
    },
    {
        text: 'Mis eventos',
        href: '/pages/artist/events.html',
        requiredRoles: 'artist|admin'
    },
    {
        text: 'Configuracion',
        href: '/pages/settings.html',
        requiredRoles: 'user|artist|admin'
    },
    {
        text: 'Panel de administración',
        href: '/pages/admin/dashboard.html',
        requiredRoles: 'admin'
    }
]