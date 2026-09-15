# Pre-entrega Backend 2 — Autenticación con Passport.js

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de usuarios y eventos.

Este proyecto corresponde a la **Pre-entrega 4** del curso **Backend de Coderhouse**. En esta etapa se refactoriza el sistema de autenticación de la Pre-entrega 3 incorporando **Passport.js** para centralizar las estrategias de registro, login y usuario actual.

El comportamiento externo de la API se mantiene: **las rutas y respuestas principales no cambian**. El cambio corresponde principalmente a la organización interna de la autenticación.

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

# Arquitectura

El proyecto utiliza una arquitectura por capas para separar responsabilidades:

```text
Cliente / Postman
       │
       ▼
     Routes
       │
       ▼
 Passport Strategies
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

La configuración de las estrategias de Passport se encuentra centralizada en:

```text
src/config/passport.config.js
```

La generación y verificación de JWT continúa separada en:

```text
src/utils/jwt.js
```

El hash y comparación de contraseñas se mantienen en:

```text
src/utils/hash.js
```

Passport se inicializa en `app.js`, pero las estrategias no se definen dentro de este archivo.

---

# Estructura del proyecto

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

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
```

Ingresar al proyecto:

```bash
cd Pre-entrega-backend2
```

Instalar las dependencias:

```bash
npm install
```

Las dependencias utilizadas para Passport son:

```bash
npm install passport passport-local passport-jwt
```

---

# Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

## Variables

| Variable | Descripción |
|---|---|
| `PORT` | Puerto utilizado por el servidor. |
| `NODE_ENV` | Entorno de ejecución. |
| `MONGO_URL` | URI de conexión a MongoDB Atlas. |
| `JWT_SECRET` | Clave utilizada para firmar y verificar los JWT. |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT. |

El proyecto incluye:

```text
.env.example
```

como referencia.

### Seguridad

El archivo:

```text
.env
```

no debe subirse al repositorio.

Tampoco deben publicarse:

- Credenciales de MongoDB.
- Claves JWT.
- Contraseñas.
- Otros secretos de configuración.

---

# Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Por defecto, la API queda disponible en:

```text
http://localhost:8080
```

---

# Passport.js

La Pre-entrega 4 incorpora Passport.js para centralizar la autenticación.

Passport se inicializa en:

```text
src/app.js
```

mediante:

```js
app.use(passport.initialize());
```

Las estrategias están centralizadas en:

```text
src/config/passport.config.js
```

Actualmente se implementan tres estrategias:

```text
register
login
current
```

No se utiliza `passport.session()` porque la autenticación de la API es **stateless**, basada en JWT almacenado en una cookie HTTP Only.

---

# Estrategia `register`

La estrategia:

```text
register
```

se utiliza para:

```http
POST /api/sessions/register
```

La lógica de registro se encuentra dentro de la estrategia de Passport.

La estrategia realiza:

1. Validación de campos obligatorios.
2. Normalización de nombre y apellido.
3. Normalización del email.
4. Validación del formato del email.
5. Validación de la longitud mínima de la contraseña.
6. Comprobación de email duplicado.
7. Hash de contraseña mediante `bcrypt`.
8. Creación del usuario mediante el repository.
9. Utilización del rol por defecto definido en el modelo.
10. Exclusión de la contraseña del usuario que queda disponible para la respuesta.

La ruta delega la autenticación mediante:

```js
passport.authenticate("register", {
    session: false
})
```

El rol no se recibe directamente desde el registro. El modelo `User` define:

```text
user
organizer
admin
```

y utiliza:

```text
user
```

como rol por defecto.

---

# Estrategia `login`

La estrategia:

```text
login
```

se utiliza para:

```http
POST /api/sessions/login
```

La estrategia se encarga de:

1. Recibir email y contraseña.
2. Normalizar el email.
3. Buscar el usuario.
4. Comparar la contraseña mediante `bcrypt`.
5. Validar las credenciales.
6. Dejar el usuario autenticado disponible en `req.user`.

Las credenciales inválidas mantienen una respuesta genérica:

```text
Credenciales inválidas
```

con HTTP:

```text
401 Unauthorized
```

## Generación del JWT

La estrategia `login` **no genera el JWT**.

Después de una autenticación exitosa:

```text
Passport
   ↓
req.user
   ↓
Controller
   ↓
generateToken()
   ↓
cookie currentUser
```

El controller genera el JWT utilizando:

```text
src/utils/jwt.js
```

El payload contiene únicamente:

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
```

---

# Estrategia `current`

La estrategia:

```text
current
```

utiliza `passport-jwt`.

Se aplica a:

```http
GET /api/sessions/current
```

La estrategia obtiene el JWT desde la cookie:

```text
currentUser
```

El flujo es:

```text
Cookie currentUser
       ↓
Extraer JWT
       ↓
Verificar firma
       ↓
Validar token
       ↓
req.user
       ↓
Controller
```

Si no existe un token válido, se responde:

```text
401 Unauthorized
```

Cuando el token es válido, `req.user` contiene:

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
```

---

# Logout

El logout no utiliza Passport.

Ruta:

```http
POST /api/sessions/logout
```

Su responsabilidad es eliminar la cookie:

```text
currentUser
```

Respuesta:

```json
{
    "status": "success",
    "message": "Sesión cerrada"
}
```

HTTP:

```text
200 OK
```

---

# Rutas de autenticación

Todas las rutas utilizan como base:

```text
/api/sessions
```

| Método | Endpoint | Estrategia | Descripción |
|---|---|---|---|
| GET | `/api/sessions/` | — | Información del módulo de sesiones. |
| POST | `/api/sessions/register` | `register` | Registra un usuario. |
| POST | `/api/sessions/login` | `login` | Valida credenciales y crea cookie JWT. |
| GET | `/api/sessions/current` | `current` | Obtiene el usuario autenticado. |
| POST | `/api/sessions/logout` | — | Elimina la cookie de autenticación. |

---

# Registro

### Request

```http
POST http://localhost:8080/api/sessions/register
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

### Registro exitoso

HTTP:

```text
201 Created
```

La respuesta mantiene el contrato de la entrega anterior y no expone la contraseña.

---

# Login

### Request

```http
POST http://localhost:8080/api/sessions/login
```

Body:

```json
{
    "email": "ana@mail.com",
    "password": "Secreta123"
}
```

### Respuesta exitosa

HTTP:

```text
200 OK
```

```json
{
    "status": "success",
    "message": "Login correcto"
}
```

Además, el servidor establece la cookie:

```text
currentUser
```

con:

```text
httpOnly: true
sameSite: "lax"
```

En producción también se utiliza:

```text
secure: true
```

---

# Current User

### Request

```http
GET http://localhost:8080/api/sessions/current
```

Debe existir una cookie válida:

```text
currentUser
```

### Respuesta exitosa

HTTP:

```text
200 OK
```

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

La respuesta no contiene:

```text
password
```

---

# Logout

### Request

```http
POST http://localhost:8080/api/sessions/logout
```

### Respuesta

HTTP:

```text
200 OK
```

```json
{
    "status": "success",
    "message": "Sesión cerrada"
}
```

Después del logout, la cookie `currentUser` deja de permitir el acceso a `/current`.

---

# Respuestas de error

## Credenciales inválidas

HTTP:

```text
401 Unauthorized
```

```json
{
    "status": "error",
    "message": "Credenciales inválidas"
}
```

Este mensaje se mantiene genérico para no revelar si el email existe o no.

---

## Sin autenticación

HTTP:

```text
401 Unauthorized
```

```json
{
    "status": "error",
    "message": "No autenticado"
}
```

---

## Email duplicado

HTTP:

```text
409 Conflict
```

```json
{
    "status": "error",
    "message": "El email ya está registrado"
}
```

---

# Seguridad

El sistema implementa:

- Contraseñas protegidas mediante `bcrypt`.
- JWT firmado con una clave secreta.
- JWT almacenado en cookie HTTP Only.
- Validación del JWT mediante Passport.
- Mensaje genérico para credenciales inválidas.
- No se incluye `password` en el JWT.
- No se incluye `password` en las respuestas.
- Rol controlado mediante el modelo de usuario.
- `.env` excluido del repositorio.
- `.env.example` sin credenciales reales.

---

# Flujo completo de autenticación

## Registro

```text
POST /api/sessions/register
            │
            ▼
passport.authenticate("register")
            │
            ▼
Strategy: register
            │
            ├── Validación
            ├── Normalización
            ├── Email único
            ├── bcrypt.hash()
            └── Crear usuario
            │
            ▼
         req.user
            │
            ▼
        Controller
            │
            ▼
         HTTP 201
```

## Login

```text
POST /api/sessions/login
            │
            ▼
passport.authenticate("login")
            │
            ▼
Strategy: login
            │
            ├── Buscar usuario
            └── bcrypt.compare()
            │
            ▼
         req.user
            │
            ▼
        Controller
            │
            ├── generateToken()
            └── res.cookie()
            │
            ▼
         HTTP 200
```

## Current

```text
GET /api/sessions/current
            │
            ▼
passport.authenticate("current")
            │
            ▼
Strategy: current
            │
            ├── Leer cookie
            ├── Extraer JWT
            └── Verificar JWT
            │
            ▼
         req.user
            │
            ▼
        Controller
            │
            ▼
         HTTP 200
```

## Logout

```text
POST /api/sessions/logout
            │
            ▼
        Controller
            │
            ▼
   Eliminar currentUser
            │
            ▼
         HTTP 200
```

---

# Modelo User

El modelo `User` contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `first_name` | String | Nombre del usuario. |
| `last_name` | String | Apellido del usuario. |
| `email` | String | Email único. |
| `password` | String | Contraseña almacenada como hash bcrypt. |
| `role` | String | Rol del usuario. |

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

# Eventos

El proyecto mantiene el módulo de eventos desarrollado en las entregas anteriores.

Base:

```text
/api/events
```

La gestión de eventos utiliza la arquitectura:

```text
Routes
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

La incorporación de Passport está enfocada en el sistema de autenticación y no modifica el contrato existente del módulo de eventos.

---

# Preparación para providers externos

La configuración de Passport está centralizada en:

```text
src/config/passport.config.js
```

Actualmente se encuentran implementadas:

```text
register
login
current
```

La estructura permite incorporar posteriormente estrategias de autenticación mediante proveedores externos, por ejemplo:

```text
Google
GitHub
```

sin tener que modificar la inicialización de Passport en:

```text
src/app.js
```

De esta manera, el proyecto queda preparado para futuras ampliaciones de autenticación y autorización.

---

# Casos de prueba

Antes de entregar la Pre-entrega 4 se deben comprobar los siguientes casos.

## 1. Flujo completo

```text
Registro exitoso
      ↓
Login exitoso
      ↓
/current → 200
      ↓
Logout
      ↓
/current → 401
```

## 2. Email duplicado

Intentar registrar un usuario utilizando un email que ya existe.

Resultado esperado:

```text
409 Conflict
```

```json
{
    "status": "error",
    "message": "El email ya está registrado"
}
```

## 3. Login con credenciales inválidas

Probar con:

- Email inexistente.
- Contraseña incorrecta.

Resultado esperado:

```text
401 Unauthorized
```

```json
{
    "status": "error",
    "message": "Credenciales inválidas"
}
```

## 4. `/current` sin cookie

Realizar:

```http
GET /api/sessions/current
```

sin la cookie `currentUser`.

Resultado esperado:

```text
401 Unauthorized
```

## 5. `/current` con token manipulado

Modificar el JWT almacenado en `currentUser` y realizar nuevamente:

```http
GET /api/sessions/current
```

Resultado esperado:

```text
401 Unauthorized
```

---

# Prueba del JWT

Después de realizar un login exitoso, la cookie:

```text
currentUser
```

contiene el JWT.

El payload debe ser conceptualmente:

```json
{
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
}
```

No debe contener:

```text
password
first_name
last_name
```

La contraseña permanece almacenada únicamente como hash en MongoDB.

---

# Git

Los cambios de la Pre-entrega 4 se organizan mediante commits separados por responsabilidad.

Ejemplos utilizados durante la implementación:

```bash
git add package.json package-lock.json
git commit -m "chore: add Passport authentication dependencies"
```

```bash
git add src/config/passport.config.js
git commit -m "feat: add Passport register strategy"
```

```bash
git add src/app.js
git commit -m "refactor: initialize Passport in app"
```

```bash
git add src/routes/sessions.router.js
git commit -m "refactor: integrate Passport into register route"
```

```bash
git add src/controllers/sessions.controller.js
git commit -m "refactor: update register controller for Passport"
```

Para los cambios posteriores de login y current pueden utilizarse commits específicos que describan esas responsabilidades.

Antes de subir los cambios:

```bash
git status
```

Verificar que no aparezca:

```text
.env
node_modules/
```

Finalmente:

```bash
git push
```

---

# Repositorio

Repositorio público:

```text
https://github.com/ha3nebal/Pre-entrega-backend2
```

---

# Estado de la Pre-entrega 4

La Pre-entrega 4 incorpora **Passport.js como capa centralizada de autenticación**, manteniendo el contrato externo de la Pre-entrega 3.

Se mantienen:

- Node.js.
- Express.
- MongoDB Atlas.
- Mongoose.
- bcrypt.
- JWT.
- Cookies HTTP Only.
- Arquitectura por capas.
- Rutas existentes.
- Respuestas principales de la API.

Se incorporan:

- Passport.js.
- Estrategia `register`.
- Estrategia `login`.
- Estrategia `current`.
- Inicialización de Passport en `app.js`.
- Configuración centralizada en `src/config/passport.config.js`.
- Preparación para futuros providers externos como Google y GitHub.

El JWT continúa siendo generado por el **controller después de una autenticación exitosa**, y Passport se encarga de centralizar las estrategias de autenticación.
