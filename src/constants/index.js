export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const validUnauthorizedRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
]

export const dropDownMenuItems = [
    {
        text: 'Mi perfil',
        href: './user-profile',
        requiredRoles: 'visitant|artist|admin'
    },
    {
        text: 'Perfil de artista',
        href: './artist-profile',
        requiredRoles: 'visitant|artist|admin'
    },
    {
        text: 'Mis eventos',
        href: './my-events',
        requiredRoles: 'artist|admin'
    },
    {
        text: 'Panel de administración',
        href: './admin-dashboard',
        requiredRoles: 'admin'
    }
]