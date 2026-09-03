# Pre-entrega Backend 2 — Autenticación con JWT y Cookies

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de eventos y usuarios.

Este proyecto corresponde a la **Pre-entrega 3** del curso **Backend de Coderhouse** y continúa el desarrollo realizado en las entregas anteriores.

En esta etapa se incorpora la autenticación de usuarios mediante:

- Registro seguro de usuarios.
- Hash de contraseñas con `bcrypt`.
- Login con validación de credenciales.
- Generación de JWT.
- Almacenamiento del JWT en una cookie HTTP Only.
- Middleware de autenticación.
- Ruta protegida `/current`.
- Logout mediante eliminación de la cookie.
- Persistencia en MongoDB Atlas.

---

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **JavaScript — ES Modules**
- **Mongoose**
- **MongoDB Atlas**
- **dotenv**
- **bcrypt**
- **jsonwebtoken**
- **cookie-parser**
- **Nodemon**
- **Postman** para pruebas de la API

---

## Arquitectura

El proyecto utiliza una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento y la escalabilidad.

```text
Cliente / Postman
       │
       ▼
     Routes
       │
       ▼
  Controllers
       │
       ▼
    Services
       │
       ▼
 Repositories
       │
       ▼
      DAO
       │
       ▼
    Models
       │
       ▼
 MongoDB Atlas
```

Las funciones reutilizables relacionadas con seguridad se encuentran en `utils/`:

```text
utils/
├── hash.js   → hash y comparación de contraseñas con bcrypt
└── jwt.js    → generación y verificación de JWT
```

El middleware de autenticación se encuentra en:

```text
src/middlewares/auth.middleware.js
```

---

## Estructura del proyecto

```text
Pre-entrega-backend2/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   │
│   ├── repositories/
│   │   ├── event.repository.js
│   │   └── user.repository.js
│   │
│   ├── dao/
│   │   ├── EventDAO.js
│   │   └── UserDAO.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   │
│   └── utils/
│       ├── constants.js
│       ├── hash.js
│       ├── jwt.js
│       ├── logger.js
│       └── response.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
```

Ingresar al directorio:

```bash
cd Pre-entrega-backend2
```

Instalar las dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

### Variables

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se ejecuta el servidor. |
| `NODE_ENV` | Entorno de ejecución (`development` o `production`). |
| `MONGO_URL` | URI de conexión a MongoDB Atlas. |
| `JWT_SECRET` | Clave secreta utilizada para firmar y verificar los JWT. |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT. |

También se incluye `.env.example` como referencia.

> **Importante:** `.env` contiene información sensible y no debe subirse al repositorio.

---

## Ejecución

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor se ejecuta por defecto en:

```text
http://localhost:8080
```

---

# Modelos

## User

El modelo `User` contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `first_name` | String | Nombre del usuario. |
| `last_name` | String | Apellido del usuario. |
| `email` | String | Email único y normalizado. |
| `password` | String | Contraseña almacenada como hash bcrypt. |
| `role` | String | Rol del usuario. |

Roles permitidos:

```text
user
organizer
admin
```

El rol tiene como valor por defecto:

```text
user
```

El registro público no permite establecer el rol desde el body.

---

## Event

El modelo `Event` contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | String | Título del evento. |
| `description` | String | Descripción del evento. |
| `date` | Date | Fecha del evento. |
| `location` | String | Ubicación del evento. |
| `capacity` | Number | Capacidad máxima. |
| `organizer` | String | Organizador del evento. |
| `status` | String | Estado del evento. |

Estados permitidos:

```text
ACTIVE
CANCELLED
FINISHED
```

---

# Rutas de la API

Base URL:

```text
http://localhost:8080
```

## Resumen de endpoints

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| `GET` | `/api/health` | Verifica el estado del servidor. | Pública |
| `GET` | `/api/events` | Obtiene todos los eventos. | Pública |
| `GET` | `/api/events/:id` | Obtiene un evento por ID. | Pública |
| `POST` | `/api/events` | Crea un evento. | Pública |
| `PUT` | `/api/events/:id` | Actualiza un evento. | Pública |
| `DELETE` | `/api/events/:id` | Elimina un evento. | Pública |
| `GET` | `/api/sessions` | Información del módulo de sesiones. | Pública |
| `POST` | `/api/sessions/register` | Registra un usuario. | Pública |
| `POST` | `/api/sessions/login` | Inicia sesión y genera JWT. | Pública |
| `GET` | `/api/sessions/current` | Obtiene el usuario autenticado. | 🔒 JWT |
| `POST` | `/api/sessions/logout` | Cierra la sesión y elimina la cookie. | Pública |

---

# Health Check

## GET `/api/health`

Verifica que el servidor se encuentre funcionando.

### Response — `200 OK`

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

# Eventos

## GET `/api/events`

Obtiene todos los eventos almacenados en MongoDB Atlas.

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": []
}
```

Si existen eventos, `payload` contiene los documentos recuperados desde MongoDB.

---

## GET `/api/events/:id`

Obtiene un evento específico mediante su ID.

Ejemplo:

```text
GET http://localhost:8080/api/events/665f2a...
```

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a...",
    "title": "Evento de ejemplo",
    "description": "Descripción del evento",
    "date": "2026-09-10T18:00:00.000Z",
    "location": "Viña del Mar",
    "capacity": 100,
    "organizer": "Administrador",
    "status": "ACTIVE"
  }
}
```

---

## POST `/api/events`

Crea un nuevo evento.

### Request

```json
{
  "title": "Evento de ejemplo",
  "description": "Descripción del evento",
  "date": "2026-09-10T18:00:00.000Z",
  "location": "Viña del Mar",
  "capacity": 100
}
```

### Response — `201 Created`

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a...",
    "title": "Evento de ejemplo",
    "description": "Descripción del evento",
    "date": "2026-09-10T18:00:00.000Z",
    "location": "Viña del Mar",
    "capacity": 100,
    "organizer": "Administrador",
    "status": "ACTIVE"
  }
}
```

---

## PUT `/api/events/:id`

Actualiza un evento existente.

Ejemplo:

```text
PUT http://localhost:8080/api/events/665f2a...
```

### Request

```json
{
  "title": "Evento actualizado",
  "capacity": 150
}
```

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a...",
    "title": "Evento actualizado",
    "capacity": 150
  }
}
```

---

## DELETE `/api/events/:id`

Elimina un evento existente.

Ejemplo:

```text
DELETE http://localhost:8080/api/events/665f2a...
```

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a..."
  }
}
```

---

# Sesiones y autenticación

## GET `/api/sessions`

Ruta base del módulo de sesiones.

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": {
    "status": "success",
    "message": "Módulo de sesiones preparado."
  }
}
```

---

# Registro de usuarios

## POST `/api/sessions/register`

Registra un nuevo usuario.

El proceso realiza:

1. Validación de campos obligatorios.
2. Normalización de nombre, apellido y email.
3. Validación del formato del email.
4. Validación de longitud mínima de contraseña.
5. Verificación de email duplicado.
6. Hash de la contraseña mediante bcrypt.
7. Persistencia en MongoDB Atlas.
8. Respuesta sin incluir `password`.

### Request

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Campos obligatorios

- `first_name`
- `last_name`
- `email`
- `password`

El campo `role` **no debe enviarse para controlar el rol del usuario**.

El modelo asigna automáticamente:

```text
role: "user"
```

### Response — `201 Created`

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no contiene `password`.

### Email inválido — `400 Bad Request`

```json
{
  "status": "error",
  "message": "El formato del email no es válido"
}
```

### Campos faltantes — `400 Bad Request`

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Email duplicado — `409 Conflict`

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

---

# Login

## POST `/api/sessions/login`

Autentica un usuario utilizando email y contraseña.

El proceso realiza:

1. Valida la presencia de `email` y `password`.
2. Normaliza el email.
3. Busca el usuario mediante Repository y DAO.
4. Compara la contraseña con bcrypt.
5. Genera un JWT si las credenciales son correctas.
6. Guarda el JWT en la cookie `currentUser`.

### Request

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

### Response — `200 OK`

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además, la respuesta establece la cookie:

```text
currentUser
```

### Configuración de la cookie

La cookie utiliza:

```text
httpOnly: true
sameSite: "lax"
maxAge: 3600000
secure: true solamente en producción
```

El JWT tiene una expiración configurable mediante:

```env
JWT_EXPIRES_IN=1h
```

### Credenciales inválidas — `401 Unauthorized`

Si el email no existe o la contraseña no coincide, se responde siempre con el mismo mensaje:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

Esto evita revelar información sobre la existencia de usuarios.

---

# JWT

El JWT se genera en:

```text
src/utils/jwt.js
```

El payload contiene únicamente la información mínima requerida:

```json
{
  "id": "665f2a...",
  "email": "ana@mail.com",
  "role": "user"
}
```

No contiene:

```text
password
first_name
last_name
```

La firma utiliza `JWT_SECRET` desde las variables de entorno.

La expiración utiliza:

```env
JWT_EXPIRES_IN=1h
```

---

# Ruta protegida

## GET `/api/sessions/current`

Devuelve la información del usuario autenticado.

La ruta está protegida mediante:

```text
src/middlewares/auth.middleware.js
```

El middleware:

1. Lee la cookie `currentUser`.
2. Verifica el JWT.
3. Valida su firma y expiración.
4. Guarda el payload en `req.user`.
5. Permite continuar al controller.

### Request

```text
GET http://localhost:8080/api/sessions/current
```

No es necesario enviar el JWT manualmente en un header. La autenticación se realiza mediante la cookie.

### Response — `200 OK`

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Sin cookie o token inválido — `401 Unauthorized`

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

La contraseña nunca forma parte de esta respuesta.

---

# Logout

## POST `/api/sessions/logout`

Cierra la sesión eliminando la cookie `currentUser`.

### Request

```text
POST http://localhost:8080/api/sessions/logout
```

No requiere Body.

### Response — `200 OK`

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, una petición a:

```text
GET /api/sessions/current
```

debe responder:

```http
401 Unauthorized
```

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

# Flujo de autenticación

```text
┌──────────────┐
│   REGISTER   │
└──────┬───────┘
       │
       ▼
 MongoDB Atlas
       │
       │
       ▼
┌──────────────┐
│    LOGIN     │
└──────┬───────┘
       │
       ▼
 bcrypt.compare()
       │
       ▼
 generateToken()
       │
       ▼
 Cookie currentUser
       │
       ▼
┌──────────────┐
│   /current   │
└──────┬───────┘
       │
       ▼
auth.middleware
       │
       ▼
verifyToken()
       │
       ▼
req.user
       │
       ▼
{id, email, role}
       │
       ▼
┌──────────────┐
│    LOGOUT    │
└──────┬───────┘
       │
       ▼
clearCookie()
       │
       ▼
/current → 401
```

---

# Seguridad

El proyecto aplica las siguientes medidas:

- Contraseñas almacenadas únicamente mediante hash `bcrypt`.
- Nunca se devuelve `password` en las respuestas.
- El `password` no forma parte del JWT.
- El JWT contiene solamente `id`, `email` y `role`.
- `JWT_SECRET` se obtiene desde variables de entorno.
- La cookie de autenticación utiliza `httpOnly`.
- La cookie utiliza `sameSite: "lax"`.
- `secure` se activa solamente en producción.
- Los errores de login utilizan un mensaje genérico.
- `.env` y credenciales privadas no deben subirse al repositorio.

---

# Pruebas realizadas

La funcionalidad de autenticación fue comprobada mediante Postman.

## Casos de prueba

### 1. Registro exitoso

```text
POST /api/sessions/register
```

Resultado esperado:

```text
201 Created
```

### 2. Campos faltantes

```text
POST /api/sessions/register
```

Resultado esperado:

```text
400 Bad Request
```

### 3. Email inválido

```text
POST /api/sessions/register
```

Resultado esperado:

```text
400 Bad Request
```

### 4. Email duplicado

```text
POST /api/sessions/register
```

Resultado esperado:

```text
409 Conflict
```

### 5. Login exitoso

```text
POST /api/sessions/login
```

Resultado esperado:

```text
200 OK
```

y cookie:

```text
currentUser
```

### 6. Login con email inexistente

Resultado esperado:

```text
401 Unauthorized
Credenciales inválidas
```

### 7. Login con contraseña incorrecta

Resultado esperado:

```text
401 Unauthorized
Credenciales inválidas
```

### 8. `/current` con cookie válida

Resultado esperado:

```text
200 OK
```

con:

```text
id
email
role
```

### 9. `/current` sin cookie

Resultado esperado:

```text
401 Unauthorized
No autenticado
```

### 10. `/current` con token manipulado

Resultado esperado:

```text
401 Unauthorized
No autenticado
```

### 11. Logout

Resultado esperado:

```text
200 OK
Sesión cerrada
```

### 12. `/current` después del logout

Resultado esperado:

```text
401 Unauthorized
No autenticado
```

---

# Secuencia completa de autenticación

La secuencia principal probada es:

```text
Registro
   ↓
Login
   ↓
Cookie currentUser
   ↓
/current → 200
   ↓
Logout
   ↓
Cookie eliminada
   ↓
/current → 401
```

---

# Git y control de versiones

El desarrollo se realiza mediante commits progresivos, describiendo los cambios realizados en cada etapa.

Ejemplos:

```bash
git add .
git commit -m "feat: implement JWT authentication flow"
```

```bash
git add .
git commit -m "feat: implement session logout"
```

Los commits permiten mantener un historial del desarrollo incremental del proyecto.

---

# Estado actual del proyecto

Esta entrega incluye:

- Arquitectura REST por capas.
- Express configurado.
- ES Modules.
- Variables de entorno mediante dotenv.
- Conexión a MongoDB Atlas mediante Mongoose.
- Modelo `User`.
- Modelo `Event`.
- DAO y Repository para usuarios y eventos.
- CRUD de eventos.
- Registro de usuarios.
- Validación de datos.
- Normalización de email.
- Hash de contraseñas mediante bcrypt.
- Prevención de emails duplicados.
- Login de usuarios.
- Comparación segura de contraseñas.
- Generación de JWT.
- Cookie `currentUser` HTTP Only.
- Middleware de autenticación.
- Ruta protegida `/api/sessions/current`.
- Logout.
- Manejo de errores.
- `.env.example`.
- Documentación de endpoints.
- Pruebas mediante Postman.

---

## Repositorio

Repositorio público del proyecto:

```text
https://github.com/ha3nebal/Pre-entrega-backend2