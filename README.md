# Pre-entrega Backend 2 — API Backend Plataforma de Eventos

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de usuarios, eventos y tickets.

Este proyecto corresponde a la **Pre-entrega 8** del curso **Backend de Coderhouse**.

En esta etapa se consolida una arquitectura por capas incorporando:

- DAO
- Repository
- Services
- Controllers
- DTOs
- Models
- Routes
- Middlewares

También se mantiene el sistema de autenticación desarrollado durante las entregas anteriores mediante:

- Passport.js
- JWT
- bcrypt
- Cookies HTTP Only

El objetivo principal de esta etapa es separar responsabilidades, mejorar el mantenimiento del código y preparar la API para futuras ampliaciones **sin modificar las rutas principales de la API**.

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

El proyecto utiliza una arquitectura por capas:

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

Los DTOs participan en la transformación y filtrado de los datos que finalmente se entregan al cliente:

```text
Datos internos
      │
      ▼
     DTO
      │
      ▼
Respuesta HTTP
      │
      ▼
   Cliente
```

Esta separación permite evitar que información interna o sensible, como `password`, sea expuesta en las respuestas.

---

# Responsabilidad de cada capa

## Routes

Define los endpoints disponibles y conecta cada ruta con su controller correspondiente.

Las rutas no contienen lógica de negocio.

---

## Controllers

Los controllers coordinan la solicitud y respuesta HTTP.

Sus responsabilidades son:

- Recibir `req`.
- Obtener parámetros, body o usuario autenticado.
- Invocar el service correspondiente.
- Transformar la información de salida mediante DTOs cuando corresponde.
- Enviar la respuesta HTTP.
- Delegar los errores al middleware centralizado.

Los controllers no importan modelos de Mongoose.

---

## Services

Los services contienen la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- Validaciones.
- Reglas de negocio.
- Control de estados.
- Validación de disponibilidad.
- Control de duplicados.
- Validación de existencia de recursos.
- Control de permisos.
- Coordinación entre repositories.
- Reglas relacionadas con autenticación y credenciales.

Los services trabajan con repositories para acceder a los datos y no realizan consultas Mongoose directamente.

> **Nota de implementación:** el `sessions.service.js` también utiliza los DTOs de usuario para garantizar que los datos devueltos por los procesos de autenticación no incluyan información sensible. Los services no acceden directamente a los modelos ni a los DAOs.

---

## Repositories

Los repositories funcionan como una capa intermedia entre services y DAOs.

Sus responsabilidades son:

- Exponer métodos orientados al dominio.
- Delegar el acceso a datos al DAO correspondiente.
- Evitar que los services dependan directamente de Mongoose.

Ejemplos:

- `getUserByEmail()`
- `findEventById()`
- `findPublishedEvents()`
- `findTicketByUserAndEvent()`
- `countActiveTicketsByEvent()`
- `updateTicket()`

Los services utilizan repositories y no utilizan DAOs directamente.

---

## DAOs

Los **Data Access Objects** encapsulan el acceso directo a MongoDB mediante Mongoose.

Existe un DAO por entidad principal:

- `UserDAO`
- `EventDAO`
- `TicketDAO`

Los DAOs son la capa que importa directamente los modelos de Mongoose.

Ejemplo de flujo:

```text
Ticket Service
      ↓
Ticket Repository
      ↓
TicketDAO
      ↓
Ticket Model
      ↓
MongoDB
```

---

## Models

Los models definen los esquemas de datos utilizados por Mongoose.

Modelos principales:

- `User`
- `Event`
- `Ticket`

Los models no contienen lógica de negocio de la aplicación.

---

## DTOs

Los **Data Transfer Objects** controlan qué información se entrega al cliente.

DTOs implementados:

- `user.dto.js`
- `event.dto.js`
- `ticket.dto.js`

Uno de sus objetivos principales es evitar la exposición de información sensible.

Por ejemplo, aunque `User` posee:

```text
password
```

ese campo nunca se incluye en los DTOs enviados al cliente.

En los tickets, cuando se utiliza `populate`, el DTO también filtra la información del usuario relacionado.

---

# Estructura del proyecto

```text
Pre-entrega-backend2/
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
│
└── src/
    │
    ├── app.js
    ├── server.js
    │
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── passport.config.js
    │
    ├── controllers/
    │   ├── events.controller.js
    │   ├── sessions.controller.js
    │   └── tickets.controller.js
    │
    ├── dao/
    │   ├── EventDAO.js
    │   ├── TicketDAO.js
    │   └── UserDAO.js
    │
    ├── dto/
    │   ├── event.dto.js
    │   ├── ticket.dto.js
    │   └── user.dto.js
    │
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── notFound.middleware.js
    │
    ├── models/
    │   ├── Event.js
    │   ├── Ticket.js
    │   └── User.js
    │
    ├── repositories/
    │   ├── event.repository.js
    │   ├── ticket.repository.js
    │   └── user.repository.js
    │
    ├── routes/
    │   ├── events.router.js
    │   ├── sessions.router.js
    │   └── tickets.router.js
    │
    ├── services/
    │   ├── events.service.js
    │   ├── sessions.service.js
    │   └── tickets.service.js
    │
    └── utils/
        ├── constants.js
        ├── hash.js
        ├── jwt.js
        ├── logger.js
        └── response.js
```

---

# Configuración del proyecto

## 1. Instalar dependencias

Desde la carpeta del proyecto:

```bash
npm install
```

## 2. Configurar variables de entorno

Crear un archivo:

```text
.env
```

Basándose en:

```text
.env.example
```

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

**El archivo `.env` no debe subirse a GitHub.**

---

# Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción/local:

```bash
npm start
```

Servidor:

```text
http://localhost:8080
```

Health check:

```http
GET /api/health
```

Respuesta esperada:

```json
{
    "status": "ok",
    "message": "Servidor activo"
}
```

---

# Autenticación

La autenticación utiliza:

```text
Passport
   ↓
JWT
   ↓
Cookie HTTP Only
   ↓
currentUser
```

La cookie utilizada por la aplicación es:

```text
currentUser
```

El JWT contiene únicamente información necesaria para identificar la sesión:

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

La contraseña se almacena en MongoDB utilizando un hash generado mediante `bcrypt`.

---

# Endpoints

## Sessions

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/sessions/` | Información del módulo de sesiones |
| POST | `/api/sessions/register` | Registra un usuario |
| POST | `/api/sessions/login` | Valida credenciales y crea cookie JWT |
| GET | `/api/sessions/current` | Obtiene el usuario autenticado |
| POST | `/api/sessions/logout` | Elimina la cookie de autenticación |

### Registro

```http
POST /api/sessions/register
```

Body:

```json
{
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "password": "Secreta123"
}
```

Validaciones:

- Campos obligatorios.
- Email válido.
- Email normalizado mediante `trim()` y `toLowerCase()`.
- Contraseña con mínimo de 8 caracteres.
- Email duplicado genera `409 Conflict`.
- El `role` no se recibe desde el registro público.
- El rol por defecto es `user`.

La respuesta no contiene `password`.

### Login

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

El login:

1. Normaliza el email.
2. Busca el usuario mediante el repository.
3. Compara la contraseña mediante `bcrypt`.
4. Genera un JWT.
5. Guarda el JWT en la cookie HTTP Only `currentUser`.
6. Devuelve información segura del usuario mediante DTO.

Respuesta conceptual:

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

### Current

```http
GET /api/sessions/current
```

Requiere la cookie:

```text
currentUser
```

Con una sesión válida:

```text
200 OK
```

Sin sesión:

```text
401 Unauthorized
```

La respuesta no contiene `password`.

### Logout

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

# Events

Principales endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/events` | Obtiene eventos |
| GET | `/api/events/:id` | Obtiene un evento |
| POST | `/api/events` | Crea un evento |
| PUT | `/api/events/:id` | Actualiza un evento |
| DELETE | `/api/events/:id` | Elimina un evento |

La lógica de negocio relacionada con eventos se encuentra en:

```text
src/services/events.service.js
```

El acceso a datos se realiza mediante:

```text
EventService
    ↓
EventRepository
    ↓
EventDAO
    ↓
Event Model
```

---

# Tickets

Principales endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/tickets` | Inscribe al usuario en un evento |
| GET | `/api/tickets/my` | Obtiene los tickets del usuario autenticado |
| GET | `/api/tickets/:id` | Obtiene un ticket |
| DELETE | `/api/tickets/:id` | Cancela un ticket |

Los endpoints de tickets requieren autenticación.

---

# Reglas de negocio de Tickets

Al crear una inscripción, el service verifica:

1. Que el usuario exista.
2. Que el evento exista.
3. Que el evento se encuentre `ACTIVE`.
4. Que el usuario no tenga ya un ticket activo para ese evento.
5. Que exista capacidad disponible.
6. Si existe un ticket previamente cancelado, puede reactivarse.

Estados de ticket:

```text
ACTIVE
CANCELLED
```

Al cancelar un ticket se verifica además que el usuario autenticado sea propietario del ticket.

Si intenta cancelar el ticket de otro usuario:

```text
403 Forbidden
```

---

# Populate y protección de información sensible

Los tickets pueden incluir información relacionada mediante `populate`:

```text
Ticket
 ├── User
 └── Event
```

El usuario relacionado se obtiene solamente con los campos necesarios:

```text
first_name
last_name
email
role
```

El campo:

```text
password
```

no se incluye.

Además, `ticket.dto.js` vuelve a filtrar la información antes de enviarla al cliente.

Esto evita que una respuesta con relaciones pobladas exponga accidentalmente la contraseña almacenada como hash.

---

# Manejo centralizado de errores

La API utiliza:

```text
src/middlewares/error.middleware.js
```

Los principales códigos utilizados son:

| Código | Significado | Ejemplo |
|---|---|---|
| 400 | Bad Request | Datos inválidos / ID inválido |
| 401 | Unauthorized | No existe una sesión válida |
| 403 | Forbidden | Usuario sin permiso sobre el recurso |
| 404 | Not Found | Recurso inexistente |
| 409 | Conflict | Duplicado, evento lleno o estado incompatible |
| 500 | Internal Server Error | Error interno no controlado |

Ejemplo:

```json
{
    "status": "error",
    "message": "El evento no existe."
}
```

Los errores de Mongoose también son normalizados por el middleware.

Por ejemplo:

```text
CastError → 400
ValidationError → 400
Duplicate key → 409
```

El middleware `notFound` se registra antes del `errorHandler`, evitando que una ruta válida sea interceptada incorrectamente.

---

# Seguridad

Medidas implementadas:

- Passwords almacenadas mediante `bcrypt`.
- JWT firmado mediante `JWT_SECRET`.
- JWT almacenado en cookie `httpOnly`.
- No se devuelve `password` en las respuestas.
- El `role` no puede ser manipulado mediante el registro público.
- Validación de sesión mediante Passport JWT.
- Control de permisos para cancelar tickets.
- Validación de duplicados.
- Variables sensibles almacenadas en `.env`.
- `.env` excluido mediante `.gitignore`.

---

# Casos de prueba

Durante la validación de la API se comprobó el siguiente flujo:

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

También se verificaron:

- Registro exitoso.
- Login exitoso.
- Cookie JWT.
- `/api/sessions/current`.
- Exclusión de `password`.
- Inscripción a eventos.
- Consulta de tickets.
- Cancelación de tickets.
- Reactivación de un ticket cancelado.
- Control de duplicados.
- Control de capacidad.
- Código `401`.
- Código `403`.
- Código `404`.
- Código `409`.
- Identificador inválido con código `400`.

---

# Ejemplos de errores probados

## Sin sesión

Endpoint protegido sin cookie:

```text
401 Unauthorized
```

Respuesta:

```json
{
    "status": "error",
    "message": "No autenticado. Debes iniciar sesión."
}
```

## Sin permisos

Usuario autenticado intentando cancelar un ticket perteneciente a otro usuario:

```text
403 Forbidden
```

## Recurso inexistente

Solicitar un evento válido en formato de ID, pero que no existe:

```text
404 Not Found
```

## Identificador inválido

Solicitar:

```http
GET /api/events/abc123
```

Resultado:

```text
400 Bad Request
```

## Ticket duplicado

Intentar inscribirse nuevamente en un evento donde el usuario ya posee un ticket activo:

```text
409 Conflict
```

---

# Prueba del JWT

Después de un login exitoso, la cookie:

```text
currentUser
```

contiene el JWT.

Payload conceptual:

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

---

# Postman

Las pruebas pueden realizarse utilizando Postman.

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

Para actualizar la documentación:

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

- Routes
- Controllers
- Services
- Repositories
- DAOs
- Models
- DTOs
- Middlewares

La API mantiene las funcionalidades desarrolladas durante las entregas anteriores y agrega una separación más clara entre:

```text
Acceso a datos
      ↓
     DAO
      ↓
 Repository
      ↓
Lógica de negocio
      ↓
   Service
      ↓
Controller
      ↓
    DTO
      ↓
Respuesta HTTP
```

El proyecto queda preparado para continuar con nuevas funcionalidades manteniendo una separación clara de responsabilidades.
