# 🗂️ Estructura de Rutas - MardelMusic Frontend

## 📁 Nueva Organización de Páginas

El proyecto ha sido reestructurado con una organización basada en rutas para mejorar la escalabilidad y el mantenimiento:

```
mardel_music_fe/
├── index.html                  # Página principal
├── pages/                      # Todas las páginas organizadas
│   ├── auth/                   # Páginas de autenticación
│   │   ├── login.html          # /pages/auth/login.html
│   │   └── register.html       # /pages/auth/register.html
│   ├── user/                   # Páginas de usuario
│   │   └── profile.html        # /pages/user/profile.html  
│   ├── artist/                 # Páginas de artista
│   │   └── profile.html        # /pages/artist/profile.html
│   ├── dashboard.html          # /pages/dashboard.html
│   └── 404.html               # /pages/404.html
└── src/                       # Assets y lógica (sin cambios)
```

## 🔗 Rutas de Navegación

### Páginas Principales
- **Home**: `/index.html`
- **Dashboard**: `/pages/dashboard.html`
- **Error 404**: `/pages/404.html`

### Autenticación
- **Login**: `/pages/auth/login.html`  
- **Register**: `/pages/auth/register.html`

### Perfiles
- **Perfil de Usuario**: `/pages/user/profile.html`
- **Perfil de Artista**: `/pages/artist/profile.html`

## ⚙️ Configuración de Build (vite.config.js)

Las rutas están configuradas en el build con nombres semánticos:

```javascript
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
}
```

## 🔄 Redirecciones Actualizadas

### En JavaScript (Handlers)
- Login success → `/pages/dashboard.html`
- Register success → `/pages/dashboard.html`  
- Cancel profile → `/pages/dashboard.html`
- Profile created → `/pages/artist/profile.html`
- Auth guard → `/index.html`

### En HTML (Links)
- Las rutas de assets (`/src/`) siguen funcionando con rutas absolutas
- Los enlaces entre páginas usan rutas relativas correctas
- Navegación entre auth pages: `./login.html`, `./register.html`
- Vuelta a dashboard desde perfiles: `../dashboard.html`
- Vuelta a home: `../../index.html`

## 🎯 Beneficios de la Nueva Estructura

### 📋 Organización
- **Agrupación lógica**: Páginas relacionadas en carpetas temáticas
- **Escalabilidad**: Fácil agregar nuevas rutas y funcionalidades  
- **Mantenibilidad**: Estructura clara para el equipo de desarrollo

### 🔧 Desarrollo
- **Build optimizado**: Cada página se construye por separado
- **Assets compartidos**: CSS y JS centralizados en `/src/`
- **Rutas semánticas**: URLs que reflejan la funcionalidad

### 🚀 Producción
- **SEO friendly**: URLs descriptivas y organizadas
- **Caching**: Mejor estrategia de cache por tipo de contenido
- **Performance**: Bundling optimizado por página

## 🛠️ Para Desarrolladores

### Agregar Nueva Página
1. Crear el archivo HTML en la carpeta apropiada: `pages/categoria/nombre.html`
2. Actualizar `vite.config.js` con la nueva entrada en `input`
3. Ajustar rutas relativas para assets y navegación
4. Actualizar handlers con las redirecciones correctas

### Consideraciones de Rutas
- **Assets**: Usar siempre rutas absolutas `/src/` para JS/CSS
- **Navegación**: Usar rutas relativas `./` o `../` para HTML  
- **Redirecciones**: Usar rutas absolutas `/pages/` en JavaScript
- **Build**: Nombres descriptivos en `vite.config.js`
