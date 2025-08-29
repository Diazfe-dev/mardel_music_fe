import tailwindcss from '@tailwindcss/vite';

import {defineConfig} from 'vite';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                login: 'login.html',
                register: 'register.html',
                dashboard: 'dashboard.html',
                userProfile: 'user-artist.html',
                artistProfile: 'artist-artist.html',
            },
            external: [/\.(jpg|jpeg|png|gif|webp)$/]
        }
    },
    plugins: [tailwindcss()],
    publicDir: true
})