# MarioDex – Monorepo

Monorepo con el frontend Angular y el backend Laravel de la aplicación **MarioDex**, listo para despliegue en [Render](https://render.com).

```
monorepoMario/
├── frontend/   ← Angular 16 (Static Site en Render)
├── backend/    ← Laravel 12 + PostgreSQL (Web Service en Render)
└── README.md
```

---

## Requisitos previos

- Cuenta en [Render](https://render.com) (plan gratuito es suficiente)
- Repositorio conectado a GitHub (este repo)

---

## 1. Crear la base de datos PostgreSQL en Render

1. En el dashboard de Render → **New → PostgreSQL**
2. Ponle un nombre, p. ej. `mariodex-db`
3. Elige la región más cercana
4. Clic en **Create Database**
5. Guarda las credenciales que te da Render:
   - **Host** → `DB_HOST`
   - **Port** → `DB_PORT` (5432)
   - **Database** → `DB_DATABASE`
   - **Username** → `DB_USERNAME`
   - **Password** → `DB_PASSWORD`

---

## 2. Desplegar el Backend Laravel (Web Service)

### Crear el servicio

1. Render → **New → Web Service**
2. Conecta este repositorio GitHub
3. Configuración:
   | Campo | Valor |
   |-------|-------|
   | **Name** | `mariodex-backend` |
   | **Root Directory** | `backend` |
   | **Environment** | `Docker` |
   | **Region** | (la misma que la DB) |
   | **Branch** | `main` |

4. Render detectará el `Dockerfile` automáticamente.

### Variables de entorno del backend

Añade estas variables en **Environment → Environment Variables**:

| Variable | Valor |
|----------|-------|
| `APP_NAME` | `MarioDex` |
| `APP_ENV` | `production` |
| `APP_KEY` | *(ver instrucciones abajo)* |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://mariodex-backend.onrender.com` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | *(host de tu PostgreSQL en Render)* |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | *(nombre de tu DB en Render)* |
| `DB_USERNAME` | *(usuario de tu DB en Render)* |
| `DB_PASSWORD` | *(contraseña de tu DB en Render)* |
| `FRONTEND_URL` | `https://mariodex-frontend.onrender.com` |
| `LOG_CHANNEL` | `stderr` |
| `SESSION_DRIVER` | `cookie` |
| `CACHE_STORE` | `file` |
| `QUEUE_CONNECTION` | `sync` |

> **Generar APP_KEY**: ejecuta en tu máquina local (dentro de `backend/`):
> ```bash
> php artisan key:generate --show
> ```
> Copia el resultado (algo como `base64:xxx...`) y pégalo como valor de `APP_KEY`.

### Migraciones y caché (Start Command)

El Dockerfile usa Supervisor para arrancar PHP-FPM + Nginx. Para ejecutar las migraciones al desplegar, añade un **Pre-Deploy Command** (en la sección "Advanced"):

```bash
php artisan migrate --force && php artisan config:cache && php artisan route:cache
```

O bien, puedes añadirlo como un script de inicio en el `Dockerfile` si prefieres.

---

## 3. Desplegar el Frontend Angular (Static Site)

### Preparar la URL del backend

Antes de desplegar, actualiza `frontend/src/environments/environment.prod.ts` con la URL real del backend:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://mariodex-backend.onrender.com/api'
};
```

Haz commit y push de ese cambio.

### Crear el Static Site

1. Render → **New → Static Site**
2. Conecta este repositorio GitHub
3. Configuración:
   | Campo | Valor |
   |-------|-------|
   | **Name** | `mariodex-frontend` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm ci && npm run build` |
   | **Publish Directory** | `dist/nombre-app/browser` |
   | **Branch** | `main` |

4. Clic en **Create Static Site**

> El archivo `src/_redirects` se copia automáticamente al directorio de salida durante el build, lo que garantiza que las rutas SPA de Angular funcionen correctamente en Render.

---

## 4. Verificar la integración

Una vez desplegados ambos servicios:

1. Abre la URL del frontend: `https://mariodex-frontend.onrender.com`
2. Deberías ver la lista de personajes (si hay datos en la DB)
3. Prueba crear un personaje nuevo → debe aparecer en la lista
4. Prueba eliminar un personaje → debe desaparecer de la lista
5. Comprueba los logs del backend en Render si hay errores

### Comprobación rápida de la API

```bash
# Listar personajes
curl https://mariodex-backend.onrender.com/api/personajes

# Crear un personaje
curl -X POST https://mariodex-backend.onrender.com/api/personajes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mario","tipo":"Héroe","poder":100,"mundo":"Mushroom Kingdom"}'
```

---

## 5. Desarrollo local

### Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales locales (MySQL o PostgreSQL)
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=4000
```

### Frontend

```bash
cd frontend
npm install
npm start
# Abre http://localhost:4200
```

---

## Estructura de archivos clave

```
backend/
├── Dockerfile                    ← Build para Render (Nginx + PHP-FPM)
├── docker/
│   ├── nginx.conf                ← Configuración Nginx (puerto 10000)
│   └── supervisord.conf          ← Gestiona PHP-FPM + Nginx
├── config/cors.php               ← CORS configurado para el frontend
├── .env.example                  ← Variables de entorno (plantilla)
└── ...

frontend/
├── src/
│   ├── environments/
│   │   ├── environment.ts        ← Config desarrollo (localhost)
│   │   └── environment.prod.ts   ← Config producción (URL Render)
│   ├── _redirects                ← Soporte SPA para Render Static Site
│   └── app/core/services/
│       └── personaje.service.ts  ← Usa environment.apiUrl
└── angular.json                  ← fileReplacements + asset _redirects
```
