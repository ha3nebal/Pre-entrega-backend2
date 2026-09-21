# Pre-entrega Backend 2 — Roles y autorización

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de usuarios y eventos.

Esta etapa corresponde a la **Pre-entrega 5: Roles y autorización** del curso **Backend de Coderhouse**.

En esta entrega se incorpora un sistema de **autorización basada en roles**, utilizando los roles `user`, `organizer` y `admin`, junto con middleware reutilizable para proteger las rutas de acuerdo con los permisos correspondientes.

El sistema mantiene la autenticación implementada anteriormente mediante **Passport.js, JWT, cookies HTTP Only y bcrypt**, y agrega una capa de autorización independiente para controlar el acceso a los recursos.

---

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript ES Modules
- MongoDB Atlas
- Mongoose
- Passport.js
- passport-local
- passport-jwt
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv
- Nodemon
- Postman

---

## Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Cliente / Postman
       │
       ▼
    Routes
       │
       ▼
  Middlewares
       │
       ├── Auth
       └── Authorization
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

Archivos principales relacionados con autenticación y autorización:

```text
src/middlewares/auth.middleware.js
src/middlewares/authorize.middleware.js
src/config/passport.config.js
src/utils/jwt.js
src/utils/hash.js
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
│   │   ├── env.js
│   │   └── passport.config.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── sessions.controller.js
│   │   └── users.controller.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   ├── sessions.service.js
│   │   └── users.service.js
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
│   │   ├── sessions.router.js
│   │   └── users.router.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
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

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
cd Pre-entrega-backend2
npm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto utilizado por el servidor. |
| `NODE_ENV` | Entorno de ejecución. |
| `MONGO_URL` | URI de conexión a MongoDB Atlas. |
| `JWT_SECRET` | Clave utilizada para firmar y verificar JWT. |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT. |

El archivo `.env` no debe subirse al repositorio.

---

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Por defecto:

```text
http://localhost:8080
```

Health check:

```http
GET /api/health
```

Respuesta:

```json
{
    "status": "ok",
    "message": "Servidor activo"
}
```

---

# Autenticación

La autenticación utiliza **Passport.js, JWT, bcrypt y cookies HTTP Only**.

Estrategias implementadas:

```text
register
login
current
```

Passport se inicializa mediante:

```js
app.use(passport.initialize());
```

Las estrategias están centralizadas en:

```text
src/config/passport.config.js
```

La API utiliza autenticación stateless mediante JWT.

---

## Registro

```http
POST /api/sessions/register
```

Body:

```json
{
    "first_name": "Ana",
    "last_name": "González",
    "email": "ana@mail.com",
    "password": "Secreta123"
}
```

El registro realiza validaciones, normalización de datos, comprobación de email duplicado y hash mediante bcrypt.

El rol no se puede seleccionar libremente desde el registro público.

Roles disponibles:

```text
user
organizer
admin
```

Rol por defecto:

```text
user
```

---

## Login

```http
POST /api/sessions/login
```

Body:

```json
{
    "email": "ana@mail.com",
    "password": "Secreta123"
}
```

Respuesta:

```json
{
    "status": "success",
    "message": "Login correcto"
}
```

El JWT se almacena en la cookie:

```text
currentUser
```

Payload conceptual:

```json
{
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
}
```

El JWT no contiene `password`, `first_name` ni `last_name`.

---

## Current User

```http
GET /api/sessions/current
```

Requiere una cookie JWT válida.

Sin sesión:

```text
401 Unauthorized
```

Con sesión válida:

```text
200 OK
```

---

## Logout

```http
POST /api/sessions/logout
```

Elimina la cookie `currentUser`.

---

# Roles

El sistema utiliza tres roles:

| Rol | Descripción |
|---|---|
| `user` | Usuario estándar de la plataforma. |
| `organizer` | Usuario autorizado para gestionar sus propios eventos. |
| `admin` | Usuario con permisos administrativos y capacidad de gestionar cualquier evento. |

---

# Autorización basada en roles

La autorización se implementa mediante:

```text
src/middlewares/authorize.middleware.js
```

Ejemplo:

```js
authorize("organizer", "admin")
```

o:

```js
authorize("admin")
```

El middleware verifica:

```text
req.user.role
```

Si no existe una sesión válida:

```text
401 Unauthorized
```

Si existe sesión pero el rol no tiene permiso:

```text
403 Forbidden
```

---

# Diferencia entre 401 y 403

## 401 Unauthorized

El usuario no está autenticado.

Ejemplo:

```text
GET /api/sessions/current
```

sin cookie válida.

```json
{
    "status": "error",
    "message": "No autenticado"
}
```

---

## 403 Forbidden

El usuario está autenticado pero no posee el rol requerido.

Ejemplo:

```text
user
   ↓
POST /api/events
```

Respuesta:

```json
{
    "status": "error",
    "message": "No tenés permisos para realizar esta acción"
}
```

---

# Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | Sí | Sí | Sí |
| Crear eventos | No | Sí | Sí |
| Modificar sus propios eventos | No | Sí | Sí |
| Eliminar sus propios eventos | No | Sí | Sí |
| Modificar eventos de otros usuarios | No | No | Sí |
| Eliminar eventos de otros usuarios | No | No | Sí |
| Consultar todos los usuarios | No | No | Sí |

---

# Eventos

Base:

```text
/api/events
```

| Método | Endpoint | Autenticación | Roles | Descripción |
|---|---|---|---|---|
| GET | `/api/events` | No | Todos | Obtener eventos. |
| GET | `/api/events/:id` | No | Todos | Obtener un evento. |
| POST | `/api/events` | Sí | organizer, admin | Crear evento. |
| PUT | `/api/events/:id` | Sí | organizer, admin | Modificar evento. |
| DELETE | `/api/events/:id` | Sí | organizer, admin | Eliminar evento. |

---

# Creación de eventos

```http
POST http://localhost:8080/api/events
```

Body:

```json
{
    "title": "Evento de prueba",
    "description": "Descripción del evento",
    "date": "2026-10-15",
    "location": "Viña del Mar",
    "capacity": 50
}
```

La ruta requiere:

```text
auth
authorize("organizer", "admin")
```

El cliente no debe enviar `organizer`.

El backend utiliza:

```text
req.user.id
```

para establecer automáticamente el propietario.

---

# Ownership de eventos

Cada evento tiene un propietario mediante el campo:

```text
organizer
```

Cuando un `organizer` modifica o elimina un evento, el Service verifica que el evento pertenezca al usuario autenticado.

Si no es propietario:

```text
403 Forbidden
```

Un `admin` puede modificar o eliminar eventos independientemente de su propietario.

El campo `organizer` tampoco puede modificarse enviándolo en el body de una actualización.

---

# Ruta administrativa de usuarios

```http
GET /api/users
```

Esta ruta requiere:

```text
auth
authorize("admin")
```

Flujo:

```text
GET /api/users
      │
      ▼
    auth
      │
      ├── Sin sesión → 401
      │
      ▼
authorize("admin")
      │
      ├── user → 403
      ├── organizer → 403
      └── admin → continúa
                     │
                     ▼
               Users Controller
```

Arquitectura:

```text
users.router.js
      ↓
users.controller.js
      ↓
users.service.js
      ↓
user.repository.js
      ↓
UserDAO.js
      ↓
User
```

Las contraseñas se eliminan antes de enviar la respuesta.

---

# Rutas protegidas

## Current

```text
GET /api/sessions/current
```

Requiere:

```text
auth
```

## Crear evento

```text
POST /api/events
```

Requiere:

```text
auth
authorize("organizer", "admin")
```

## Modificar evento

```text
PUT /api/events/:id
```

Requiere:

```text
auth
authorize("organizer", "admin")
```

Además se aplica ownership:

```text
organizer → solamente sus propios eventos
admin → cualquier evento
```

## Eliminar evento

```text
DELETE /api/events/:id
```

Requiere:

```text
auth
authorize("organizer", "admin")
```

## Consultar usuarios

```text
GET /api/users
```

Requiere:

```text
auth
authorize("admin")
```

---

# Seguridad

El sistema implementa:

- Contraseñas protegidas mediante bcrypt.
- JWT firmado con una clave secreta.
- JWT almacenado en cookie HTTP Only.
- Middleware reutilizable de autenticación.
- Middleware reutilizable de autorización.
- Separación entre autenticación y autorización.
- Mensaje genérico para credenciales inválidas.
- No se incluye `password` en el JWT.
- No se incluye `password` en las respuestas.
- Rol `user` por defecto en registros públicos.
- Protección de rutas según rol.
- Control de ownership de eventos.
- Protección del campo `organizer`.
- `.env` excluido del repositorio.
- `.env.example` sin credenciales reales.

---

# Casos de prueba — Pre-entrega 5

Las pruebas fueron realizadas utilizando Postman.

| Prueba | Resultado |
|---|---|
| Sin sesión → `GET /api/users` | `401 Unauthorized` |
| `user` → `GET /api/users` | `403 Forbidden` |
| `admin` → `GET /api/users` | `200 OK` |
| `user` → `POST /api/events` | `403 Forbidden` |
| `organizer` → `POST /api/events` | `201 Created` |
| Organizer modifica evento ajeno | `403 Forbidden` |
| Admin modifica evento ajeno | `200 OK` |
| Passwords en `/api/users` | No se exponen |
| Organizer intenta cambiar `organizer` | Campo protegido |

---

# Flujo de autorización

```text
Request
   │
   ▼
Route
   │
   ▼
auth
   │
   ├── Sin JWT → 401
   │
   ▼
req.user
   │
   ▼
authorize(...)
   │
   ├── Rol no permitido → 403
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Ownership
   │
   ├── No propietario → 403
   │
   ▼
Repository
   │
   ▼
DAO
   │
   ▼
MongoDB Atlas
```

---

# Modelo User

| Campo | Tipo | Descripción |
|---|---|---|
| `first_name` | String | Nombre del usuario. |
| `last_name` | String | Apellido del usuario. |
| `email` | String | Email único. |
| `password` | String | Contraseña almacenada como hash bcrypt. |
| `role` | String | Rol del usuario. |

Roles:

```text
user
organizer
admin
```

Rol por defecto:

```text
user
```

---

# Modelo Event

El modelo `Event` contiene información del evento y su propietario.

El campo:

```text
organizer
```

utiliza una referencia hacia el modelo `User`.

Esto permite relacionar cada evento con el usuario que lo creó.

---

# Git

Para revisar el estado:

```bash
git status
```

Para revisar los commits:

```bash
git log --oneline
```

Antes de subir cambios verificar que no aparezcan:

```text
.env
node_modules/
```

Commit principal de la implementación de P5:

```text
cf1b2b1 feat: implement role-based authorization
```

---

# Repositorio

```text
https://github.com/ha3nebal/Pre-entrega-backend2
```

---

# Estado de la Pre-entrega 5

La Pre-entrega 5 incorpora un sistema de **roles y autorización** sobre la API.

Se mantienen:

- Node.js.
- Express.
- MongoDB Atlas.
- Mongoose.
- Passport.js.
- bcrypt.
- JWT.
- Cookies HTTP Only.
- Arquitectura por capas.
- Autenticación mediante Passport.
- Estrategias `register`, `login` y `current`.

Se incorporan:

- Middleware de autenticación reutilizable.
- Middleware de autorización reutilizable.
- Roles `user`, `organizer` y `admin`.
- Protección de rutas según roles.
- Diferenciación entre `401 Unauthorized` y `403 Forbidden`.
- Control de ownership de eventos.
- Protección del campo `organizer`.
- Ruta administrativa `GET /api/users`.
- Exclusión de contraseñas de las respuestas de usuarios.
- Documentación de roles y matriz de permisos.
- Pruebas funcionales de autenticación, autorización y ownership.

La implementación mantiene la separación de responsabilidades:

```text
Routes
  ↓
Middlewares
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
DAO
  ↓
Models
  ↓
MongoDB Atlas
```