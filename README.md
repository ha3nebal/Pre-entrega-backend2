# Pre-entrega Backend 2 — API Backend Plataforma de Eventos

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de usuarios, eventos y tickets.

Este proyecto corresponde a la **Pre-entrega 8** del curso **Backend de Coderhouse**.

En esta etapa se implementa y consolida una arquitectura por capas utilizando:

- DAO
- Repository
- Services
- Controllers
- DTOs

Además, se mantiene el sistema de autenticación desarrollado durante las entregas anteriores mediante:

- Passport.js
- JWT
- bcrypt
- Cookies HTTP Only

El objetivo principal de esta etapa es mejorar la separación de responsabilidades, facilitar el mantenimiento del código y preparar la API para futuras ampliaciones.

---

# Tecnologías utilizadas

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

El proyecto utiliza una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento y escalabilidad de la API.

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
      DAOs
       │
       ▼
     Models
       │
       ▼
 MongoDB Atlas
```

Los DTOs participan principalmente en la transformación y filtrado de los datos antes de enviarlos al cliente.

```text
Service
   ↓
Controller
   ↓
  DTO
   ↓
Response HTTP
   ↓
Cliente
```

## Responsabilidad de cada capa

### Routes

Define los endpoints disponibles y conecta cada ruta con su controller correspondiente.

Las rutas no contienen lógica de negocio.

### Controllers

Se encargan de coordinar la solicitud y respuesta HTTP.

Sus responsabilidades principales son:

- Recibir `req`.
- Obtener parámetros, body o usuario autenticado.
- Invocar el service correspondiente.
- Transformar la información mediante DTOs.
- Enviar la respuesta.
- Delegar los errores al middleware correspondiente.

Los controllers no acceden directamente a los modelos de Mongoose.

### Services

Contienen la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- Validaciones.
- Reglas de negocio.
- Control de estados.
- Validación de disponibilidad.
- Control de duplicados.
- Validación de existencia de recursos.
- Control de permisos sobre recursos.

Los services trabajan con repositories y no acceden directamente a los modelos de Mongoose.

### Repositories

Funcionan como una capa intermedia entre los services y los DAOs.

Los repositories exponen métodos orientados al dominio y delegan el acceso a datos a los DAOs.

Los services utilizan repositories y no utilizan DAOs directamente.

### DAOs

Los Data Access Objects encapsulan el acceso directo a MongoDB mediante Mongoose.

Cada entidad principal posee su propio DAO:

- `UserDAO`
- `EventDAO`
- `TicketDAO`

Los DAOs son la única capa que importa directamente los modelos de Mongoose.

### Models

Definen los esquemas de datos utilizados por Mongoose.

Los principales modelos son:

- `User`
- `Event`
- `Ticket`

### DTOs

Los Data Transfer Objects se utilizan para controlar y transformar la información antes de enviarla al cliente.

Los DTOs permiten evitar la exposición de información sensible.

Por ejemplo, aunque el usuario tenga almacenado un campo `password` en la base de datos, el DTO de usuario no lo incluye en las respuestas HTTP.

DTOs implementados:

- `user.dto.js`
- `event.dto.js`
- `ticket.dto.js`

---

# Estructura del proyecto

```text
Pre-entrega-backend2/
│
├── src/
│   ├── app.js
│   ├── server.js
│
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── passport.config.js
│
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── sessions.controller.js
│   │   └── tickets.controller.js
│
│   ├── services/
│   │   ├── events.service.js
│   │   ├── sessions.service.js
│   │   └── tickets.service.js
│
│   ├── repositories/
│   │   ├── event.repository.js
│   │   ├── user.repository.js
│   │   └── ticket.repository.js
│
│   ├── dao/
│   │   ├── EventDAO.js
│   │   ├── UserDAO.js
│   │   └── TicketDAO.js
│
│   ├── models/
│   │   ├── Event.js
│   │   ├── User.js
│   │   └── Ticket.js
│
│   ├── dto/
│   │   ├── event.dto.js
│   │   ├── user.dto.js
│   │   └── ticket.dto.js
│
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── sessions.router.js
│   │   └── tickets.router.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│
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

## Clonar el repositorio

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
```

## Ingresar al proyecto

```bash
cd Pre-entrega-backend2
```

## Instalar dependencias

```bash
npm install
```

Las dependencias principales relacionadas con autenticación son:

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

como referencia para la configuración.

## Seguridad

El archivo `.env` no debe subirse al repositorio.

Tampoco deben publicarse:

- Credenciales de MongoDB.
- Claves JWT.
- Contraseñas.
- Tokens.
- Otros secretos de configuración.

---

# Ejecución

## Modo desarrollo

```bash
npm run dev
```

## Modo producción

```bash
npm start
```

Por defecto, la API queda disponible en:

```text
http://localhost:8080
```

---

# Autenticación

La autenticación utiliza Passport.js, JWT y cookies HTTP Only.

Passport se inicializa en:

```text
src/app.js
```

mediante:

```js
app.use(passport.initialize());
```

Las estrategias se encuentran centralizadas en:

```text
src/config/passport.config.js
```

Actualmente se implementan tres estrategias:

```text
register
login
current
```

No se utiliza `passport.session()` porque la API utiliza autenticación stateless mediante JWT.

---

# Estrategia register

La estrategia `register` se utiliza para:

```http
POST /api/sessions/register
```

El flujo de registro es:

```text
Request
   ↓
Passport register
   ↓
Sessions Service
   ↓
Validaciones
   ↓
Normalización
   ↓
Comprobación de email
   ↓
bcrypt
   ↓
User Repository
   ↓
User DAO
   ↓
User Model
   ↓
MongoDB Atlas
```

La lógica de registro contempla:

1. Validación de campos obligatorios.
2. Normalización de nombre y apellido.
3. Normalización del email.
4. Validación del formato del email.
5. Validación de longitud mínima de contraseña.
6. Comprobación de email duplicado.
7. Hash de contraseña mediante `bcrypt`.
8. Creación del usuario mediante el repository.
9. Uso del rol por defecto.
10. Transformación del usuario mediante DTO antes de responder.

Los campos obligatorios son:

```text
first_name
last_name
email
password
```

El rol no puede ser manipulado desde el registro público.

El modelo utiliza como roles disponibles:

```text
user
organizer
admin
```

El rol por defecto es:

```text
user
```

---

# Estrategia login

La estrategia `login` se utiliza para:

```http
POST /api/sessions/login
```

El flujo es:

```text
Request
   ↓
Passport login
   ↓
Passport Strategy
   ↓
Sessions Service
   ↓
Buscar usuario
   ↓
bcrypt.compare()
   ↓
Generar JWT
   ↓
Controller
   ↓
Cookie currentUser
```

El service:

1. Recibe email y contraseña.
2. Normaliza el email.
3. Busca el usuario mediante el repository.
4. Compara la contraseña con `bcrypt`.
5. Genera el JWT.
6. Devuelve el token y un usuario seguro mediante DTO.

Las credenciales inválidas generan:

```text
401 Unauthorized
```

con un mensaje genérico:

```text
Credenciales inválidas
```

---

# JWT

El JWT es generado mediante:

```text
src/utils/jwt.js
```

El payload contiene únicamente información necesaria para identificar la sesión:

```json
{
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
}
```

El JWT no contiene:

```text
password
first_name
last_name
```

El token es almacenado en la cookie:

```text
currentUser
```

La cookie se configura como:

```text
httpOnly: true
sameSite: "lax"
```

En producción también utiliza:

```text
secure: true
```

---

# Estrategia current

La estrategia `current` utiliza `passport-jwt`.

Se aplica a:

```http
GET /api/sessions/current
```

El JWT se obtiene desde la cookie:

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
Validar payload
       ↓
req.user
       ↓
Controller
       ↓
Authenticated User DTO
       ↓
Response
```

Si no existe una sesión válida:

```text
401 Unauthorized
```

Cuando el token es válido, la respuesta contiene:

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

La respuesta no contiene la contraseña.

---

# Logout

El logout utiliza:

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
    "payload": null
}
```

HTTP:

```text
200 OK
```

---

# Rutas de sesiones

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

# Usuarios

## Modelo User

El modelo `User` contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `first_name` | String | Nombre del usuario. |
| `last_name` | String | Apellido del usuario. |
| `email` | String | Email único. |
| `password` | String | Contraseña almacenada como hash. |
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

La API mantiene el módulo de eventos desarrollado durante las entregas anteriores.

Base:

```text
/api/events
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/events` | Obtiene todos los eventos. |
| GET | `/api/events/:id` | Obtiene un evento por ID. |
| POST | `/api/events` | Crea un evento. |
| PUT | `/api/events/:id` | Actualiza un evento. |
| DELETE | `/api/events/:id` | Elimina un evento. |

## Modelo Event

El modelo contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | String | Título del evento. |
| `description` | String | Descripción del evento. |
| `date` | Date | Fecha del evento. |
| `location` | String | Ubicación. |
| `capacity` | Number | Capacidad máxima. |
| `organizer` | String | Organizador del evento. |
| `status` | String | Estado del evento. |

Estados disponibles:

```text
ACTIVE
CANCELLED
FINISHED
```

La capacidad debe ser mayor que cero.

---

# Tickets

La API incorpora un módulo de tickets para gestionar la inscripción de usuarios a eventos.

Base:

```text
/api/tickets
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/tickets` | Inscribe al usuario autenticado en un evento. |
| GET | `/api/tickets/my` | Obtiene los tickets del usuario autenticado. |
| GET | `/api/tickets/:id` | Obtiene un ticket por ID. |
| DELETE | `/api/tickets/:id` | Cancela un ticket. |

Las rutas protegidas requieren una sesión autenticada mediante JWT.

---

# Modelo Ticket

El modelo `Ticket` contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `user` | ObjectId | Usuario asociado al ticket. |
| `event` | ObjectId | Evento asociado al ticket. |
| `status` | String | Estado del ticket. |

Estados disponibles:

```text
ACTIVE
CANCELLED
```

Los campos `user` y `event` utilizan referencias de Mongoose.

---

# Lógica de negocio de Tickets

La lógica de tickets se encuentra en:

```text
src/services/tickets.service.js
```

El service controla las reglas de negocio.

## Inscripción

Antes de crear un ticket se verifica:

1. Que el usuario exista.
2. Que el evento exista.
3. Que el evento se encuentre activo.
4. Que el usuario no tenga un ticket activo para el evento.
5. Que existan cupos disponibles.

Si existe un ticket previamente cancelado, se puede reactivar en lugar de crear un ticket duplicado.

## Cancelación

Para cancelar un ticket se verifica:

1. Que el ticket exista.
2. Que el usuario autenticado sea propietario del ticket.
3. Que el ticket no se encuentre ya cancelado.

Si el usuario no es propietario:

```text
403 Forbidden
```

Si el ticket ya está cancelado:

```text
409 Conflict
```

---

# Tickets y Populate

Los tickets pueden devolver información relacionada del usuario y del evento mediante `populate`.

El DAO utiliza referencias de Mongoose para obtener:

```text
Ticket
 ├── User
 └── Event
```

La respuesta final pasa por:

```text
ticket.dto.js
```

El DTO controla la información que se expone.

La información sensible del usuario, especialmente:

```text
password
```

no se incluye en la respuesta.

---

# DTOs implementados

## User DTO

Archivo:

```text
src/dto/user.dto.js
```

Se utiliza para transformar usuarios antes de enviarlos al cliente.

El usuario autenticado se representa mediante:

```json
{
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
}
```

No incluye:

```text
password
```

## Event DTO

Archivo:

```text
src/dto/event.dto.js
```

Transforma los eventos antes de enviarlos al cliente.

## Ticket DTO

Archivo:

```text
src/dto/ticket.dto.js
```

Transforma los tickets y controla la información de los documentos relacionados.

En caso de utilizar `populate`, el usuario relacionado también es filtrado para evitar exponer su contraseña.

---

# DAO y Repository

Cada entidad principal tiene su propio DAO y Repository.

## User

```text
UserService
     ↓
UserRepository
     ↓
UserDAO
     ↓
User Model
```

## Event

```text
EventService
     ↓
EventRepository
     ↓
EventDAO
     ↓
Event Model
```

## Ticket

```text
TicketService
     ↓
TicketRepository
     ↓
TicketDAO
     ↓
Ticket Model
```

Los repositories no importan directamente modelos de Mongoose.

Los services no importan directamente DAOs ni modelos.

Los DAOs son los responsables del acceso directo a los modelos.

---

# Manejo de errores

La API utiliza un middleware centralizado para manejar errores:

```text
src/middlewares/error.middleware.js
```

Los códigos utilizados son:

| Código | Situación |
|---|---|
| `400` | Datos inválidos o identificador con formato incorrecto. |
| `401` | Usuario no autenticado o credenciales inválidas. |
| `403` | Usuario autenticado sin permisos sobre el recurso. |
| `404` | Recurso inexistente. |
| `409` | Conflicto o regla de negocio incumplida. |
| `500` | Error interno inesperado. |

Formato general:

```json
{
    "status": "error",
    "message": "Descripción del error"
}
```

Los errores de Mongoose relacionados con `CastError` se transforman en:

```text
400 Bad Request
```

Los errores de validación de Mongoose se transforman en:

```text
400 Bad Request
```

Los errores de duplicidad de MongoDB se transforman en:

```text
409 Conflict
```

---

# Seguridad

El sistema implementa las siguientes medidas:

- Contraseñas protegidas mediante `bcrypt`.
- JWT firmado mediante una clave secreta.
- JWT almacenado en cookie HTTP Only.
- Validación del JWT mediante Passport.
- Mensaje genérico para credenciales inválidas.
- El JWT no contiene la contraseña.
- Las respuestas no contienen la contraseña.
- Los DTOs filtran información sensible.
- El rol `user` se asigna por defecto.
- El rol no puede ser manipulado desde el registro público.
- `.env` excluido del repositorio.
- `.env.example` sin credenciales reales.

---

# Flujo de autenticación

## Registro

```text
POST /api/sessions/register
          │
          ▼
passport.authenticate("register")
          │
          ▼
   Passport Strategy
          │
          ▼
  Sessions Service
          │
          ├── Validación
          ├── Normalización
          ├── Email único
          ├── bcrypt.hash()
          └── Crear usuario
          │
          ▼
    User Repository
          │
          ▼
       User DAO
          │
          ▼
      User Model
          │
          ▼
     MongoDB Atlas
          │
          ▼
     User DTO
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
   Passport Strategy
          │
          ▼
  Sessions Service
          │
          ├── Buscar usuario
          ├── bcrypt.compare()
          └── generateToken()
          │
          ▼
       Controller
          │
          ├── Cookie currentUser
          └── Authenticated User DTO
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
    Leer cookie
          │
          ▼
    Verificar JWT
          │
          ▼
       req.user
          │
          ▼
       Controller
          │
          ▼
  Authenticated User DTO
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

# Flujo completo de Tickets

```text
Usuario autenticado
       │
       ▼
Crear evento
       │
       ▼
POST /api/tickets
       │
       ▼
Tickets Service
       │
       ├── Verificar usuario
       ├── Verificar evento
       ├── Verificar estado
       ├── Verificar duplicados
       └── Verificar capacidad
       │
       ▼
Ticket Repository
       │
       ▼
Ticket DAO
       │
       ▼
Ticket Model
       │
       ▼
MongoDB Atlas
```

---

# Casos de prueba

Durante la validación de la API se comprobaron los siguientes flujos.

## 1. Registro

```http
POST /api/sessions/register
```

Resultado esperado:

```text
201 Created
```

La respuesta no contiene `password`.

## 2. Login

```http
POST /api/sessions/login
```

Resultado esperado:

```text
200 OK
```

Se genera la cookie:

```text
currentUser
```

## 3. Usuario actual

```http
GET /api/sessions/current
```

Con una sesión válida:

```text
200 OK
```

Sin sesión:

```text
401 Unauthorized
```

La respuesta no contiene:

```text
password
```

## 4. Crear evento

```http
POST /api/events
```

Resultado esperado:

```text
201 Created
```

## 5. Inscripción

```http
POST /api/tickets
```

Resultado esperado:

```text
201 Created
```

## 6. Consultar mis tickets

```http
GET /api/tickets/my
```

El ticket puede incluir información poblada del:

```text
User
Event
```

La información del usuario no incluye:

```text
password
```

## 7. Cancelar ticket

```http
DELETE /api/tickets/:id
```

Resultado esperado:

```text
200 OK
```

con estado:

```text
CANCELLED
```

## 8. Ticket duplicado

Intentar inscribirse nuevamente en un evento donde el usuario ya posee un ticket activo.

Resultado:

```text
409 Conflict
```

## 9. Cancelación sin permisos

Un usuario autenticado intenta cancelar el ticket perteneciente a otro usuario.

Resultado:

```text
403 Forbidden
```

## 10. Recurso inexistente

Solicitar un evento que no existe.

Resultado:

```text
404 Not Found
```

## 11. Identificador inválido

Solicitar un recurso utilizando un identificador con formato inválido.

Resultado:

```text
400 Bad Request
```

---

# Prueba de integración completa

El flujo principal de integración es:

```text
Register
   ↓
Login
   ↓
Crear evento
   ↓
Inscribirse
   ↓
Consultar mis tickets
   ↓
Cancelar ticket
```

Este flujo fue probado utilizando Postman.

También se verificó:

- Registro exitoso.
- Login exitoso.
- Cookie JWT.
- `/current`.
- Exclusión de password.
- Inscripción a eventos.
- Consulta de tickets.
- Cancelación de tickets.
- Control de duplicados.
- Código `401`.
- Código `403`.
- Código `404`.
- Código `409`.

---

# Prueba del JWT

Después de realizar un login exitoso, la cookie:

```text
currentUser
```

contiene el JWT.

El payload debe contener conceptualmente:

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

La contraseña permanece almacenada en MongoDB como hash generado mediante `bcrypt`.

---

# Postman

Las pruebas de la API pueden realizarse utilizando Postman.

Servidor local:

```text
http://localhost:8080
```

Principales recursos:

```text
/api/sessions
/api/events
/api/tickets
```

Para endpoints protegidos se requiere una sesión válida mediante la cookie:

```text
currentUser
```

---

# Git

Los cambios del proyecto se organizan mediante commits separados por responsabilidad.

Ejemplos:

```bash
git add package.json package-lock.json
git commit -m "chore: add authentication dependencies"
```

```bash
git add src/dao src/repositories
git commit -m "refactor: implement DAO and repository layers"
```

```bash
git add src/dto
git commit -m "feat: add response DTOs"
```

```bash
git add src/services src/controllers
git commit -m "refactor: separate business logic from controllers"
```

```bash
git add src/models src/dao src/repositories src/services src/controllers src/routes
git commit -m "feat: add ticket management"
```

```bash
git add src/middlewares/error.middleware.js
git commit -m "fix: improve centralized error handling"
```

```bash
git add README.md
git commit -m "docs: update P8 architecture documentation"
```

Antes de realizar un push:

```bash
git status
```

Verificar que no aparezcan:

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

# Estado del proyecto — Pre-entrega 8

La Pre-entrega 8 consolida una arquitectura por capas utilizando:

- Routes.
- Controllers.
- Services.
- Repositories.
- DAOs.
- Models.
- DTOs.

También mantiene:

- Node.js.
- Express.
- MongoDB Atlas.
- Mongoose.
- Passport.js.
- bcrypt.
- JWT.
- Cookies HTTP Only.
- Manejo centralizado de errores.
- Gestión de usuarios.
- Gestión de eventos.
- Gestión de tickets.
- Validaciones.
- Control de permisos.
- Control de duplicados.
- Control de capacidad de eventos.
- Protección de información sensible.

La API mantiene las funcionalidades desarrolladas durante las entregas anteriores y agrega una separación más clara entre acceso a datos, lógica de negocio y presentación de respuestas.