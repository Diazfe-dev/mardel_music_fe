import tailwindcss from '@tailwindcss/vite';

import {defineConfig} from 'vite';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // Página principal
                main: 'index.html',
                
                // Páginas de autenticación
                'auth-login': 'pages/auth/login.html',
                'auth-register': 'pages/auth/register.html',
                
                // Dashboard
                dashboard: 'pages/dashboard.html',
                
                // Perfiles de usuario
                'user-profile': 'pages/user/profile.html',
                'artist-profile': 'pages/artist/profile.html',
                
                // Páginas de error
                '404': 'pages/404.html'
            },
            external: [/\.(jpg|jpeg|png|gif|webp)$/]
        }
    },
    plugins: [tailwindcss()],
    publicDir: true
})