# Pre-entrega Backend 2

API REST para la gestión de **eventos y usuarios**, desarrollada como parte del curso **Backend de Coderhouse**.

El proyecto utiliza una **arquitectura por capas** para separar responsabilidades y facilitar el mantenimiento y la escalabilidad de la aplicación.

En esta segunda entrega se incorpora el **registro seguro de usuarios**, incluyendo validación de datos, normalización de email, hash de contraseñas con `bcrypt` y persistencia en **MongoDB Atlas**.

---

## Tecnologías

- **Node.js**
- **Express**
- **JavaScript / ES Modules**
- **Mongoose**
- **MongoDB Atlas**
- **dotenv**
- **bcrypt**
- **Postman**

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
```

### 2. Ingresar al proyecto

```bash
cd Pre-entrega-backend2
```

### 3. Instalar dependencias

```bash
npm install
```

---

## Configuración

El proyecto utiliza variables de entorno mediante `dotenv`.

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
```

### Variables disponibles

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución |
| `MONGO_URL` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave utilizada para futuras funcionalidades de autenticación |

También se incluye un archivo `.env.example` como referencia.

> **Importante:** el archivo `.env` contiene información sensible y no debe subirse a GitHub.

---

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

Por defecto, el servidor se ejecuta en:

```text
http://localhost:8080
```

El puerto se puede modificar mediante la variable `PORT`.

---

# Arquitectura del proyecto

La aplicación está organizada siguiendo una arquitectura por capas:

```text
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

### Responsabilidad de cada capa

| Capa | Responsabilidad |
|---|---|
| `routes/` | Define los endpoints disponibles |
| `controllers/` | Recibe las solicitudes HTTP y coordina las respuestas |
| `services/` | Contiene la lógica de negocio |
| `repositories/` | Abstrae el acceso a los datos |
| `dao/` | Ejecuta las operaciones de persistencia |
| `models/` | Define los esquemas y modelos de Mongoose |
| `middlewares/` | Procesa solicitudes antes o después de las rutas |
| `utils/` | Contiene funciones auxiliares reutilizables |
| `config/` | Contiene la configuración de la aplicación y la conexión a MongoDB |

---

# Estructura de carpetas

```text
Pre-entrega-backend2/
│
├── src/
│   │
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
│       ├── logger.js
│       ├── hash.js
│       └── response.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# API

## Health Check

### `GET /api/health`

Comprueba que el servidor se encuentre activo.

**Respuesta `200 OK`:**

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

# Events

## `GET /api/events`

Obtiene la lista de eventos.

**Respuesta:**

```json
{
  "status": "success",
  "payload": []
}
```

El módulo de eventos cuenta con una estructura preparada para trabajar mediante:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
Model
  ↓
MongoDB Atlas
```

---

# Sessions

## `GET /api/sessions`

Ruta base del módulo de sesiones.

**Respuesta:**

```json
{
  "status": "success",
  "message": "Módulo de sesiones preparado."
}
```

---

# Registro de usuarios

## `POST /api/sessions/register`

Registra un nuevo usuario.

El proceso realiza:

1. Validación de campos obligatorios.
2. Validación del formato del email.
3. Validación de la longitud mínima de la contraseña.
4. Normalización del email.
5. Comprobación de email duplicado.
6. Hash de la contraseña mediante `bcrypt`.
7. Persistencia del usuario en MongoDB Atlas.
8. Respuesta sin incluir la contraseña.

---

## Body

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Campos requeridos

| Campo | Descripción |
|---|---|
| `first_name` | Nombre del usuario |
| `last_name` | Apellido del usuario |
| `email` | Email válido |
| `password` | Contraseña de mínimo 8 caracteres |

El campo `role` **no debe enviarse desde el registro público**.

El sistema asigna automáticamente:

```text
role: "user"
```

Los roles definidos por el modelo son:

```text
user
organizer
admin
```

---

# Seguridad de contraseñas

Las contraseñas **no se almacenan en texto plano**.

Antes de persistir el usuario, la contraseña se procesa mediante `bcrypt`.

Ejemplo de un hash almacenado:

```text
$2b$10$...
```

La contraseña tampoco se devuelve en la respuesta HTTP.

El helper reutilizable encargado del hash se encuentra en:

```text
src/utils/hash.js
```

---

# Normalización del email

El email recibido es normalizado antes de almacenarse.

Se realizan dos operaciones:

- `trim`: elimina espacios al principio y al final.
- `lowercase`: convierte el email a minúsculas.

Por ejemplo:

```text
Ana@Mail.com 
```

se almacena como:

```text
ana@mail.com
```

---

# Respuesta exitosa

### HTTP `201 Created`

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

> La respuesta no contiene el campo `password`.

---

# Respuestas de error

## Campos faltantes

### HTTP `400 Bad Request`

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

---

## Email inválido

### HTTP `400 Bad Request`

```json
{
  "status": "error",
  "message": "El formato del email no es válido"
}
```

---

## Email ya registrado

### HTTP `409 Conflict`

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

---

# Modelo User

El modelo `User` contiene los siguientes campos:

| Campo | Descripción |
|---|---|
| `first_name` | Nombre |
| `last_name` | Apellido |
| `email` | Email del usuario |
| `password` | Contraseña almacenada como hash |
| `role` | Rol del usuario |

El campo `role` tiene como valor predeterminado:

```text
user
```

Los valores permitidos son:

```text
user
organizer
admin
```

El rol no puede ser manipulado mediante el registro público.

---

# Modelo Event

El modelo `Event` contiene:

| Campo | Descripción |
|---|---|
| `title` | Título del evento |
| `description` | Descripción |
| `date` | Fecha del evento |
| `location` | Ubicación |
| `capacity` | Capacidad del evento |

---

# Persistencia

La aplicación utiliza **MongoDB Atlas** como base de datos.

**Mongoose** funciona como ODM y permite definir los modelos y realizar las operaciones de persistencia.

El acceso a los datos se encuentra separado mediante:

```text
Repository
    ↓
DAO
    ↓
Mongoose Model
    ↓
MongoDB Atlas
```

---

# Flujo del registro

El registro de usuarios respeta la arquitectura definida para el proyecto:

```text
POST /api/sessions/register
              │
              ▼
      sessions.router.js
              │
              ▼
     sessions.controller.js
              │
              ▼
      sessions.service.js
              │
              ├──────► utils/hash.js
              │              │
              │              ▼
              │            bcrypt
              │
              ▼
      user.repository.js
              │
              ▼
          UserDAO.js
              │
              ▼
           User.js
              │
              ▼
        MongoDB Atlas
```

---

# Pruebas

Los endpoints pueden probarse utilizando **Postman**.

Antes de entregar se deben verificar los siguientes casos:

- [ ] Registro exitoso.
- [ ] Campos obligatorios faltantes.
- [ ] Email con formato inválido.
- [ ] Email ya registrado.
- [ ] Email normalizado correctamente.
- [ ] Contraseña almacenada como hash en MongoDB Atlas.
- [ ] Contraseña ausente en la respuesta.
- [ ] Rol asignado automáticamente como `user`.

---

# Estado del proyecto

Esta versión incluye:

- Arquitectura REST por capas.
- Configuración de Express.
- Uso de ES Modules.
- Variables de entorno mediante `dotenv`.
- Conexión con MongoDB Atlas mediante Mongoose.
- Modelos `User` y `Event`.
- DAO y Repository.
- CRUD de eventos.
- Registro de usuarios.
- Validación de datos.
- Normalización de email.
- Hash de contraseñas mediante bcrypt.
- Prevención de registros con emails duplicados.
- Respuesta de registro sin contraseña.
- Middleware de manejo de errores.
- Estructura preparada para futuras funcionalidades de autenticación y autorización.

---

# Próximas funcionalidades

En las siguientes entregas se incorporarán progresivamente funcionalidades como:

- Login de usuarios.
- Autenticación mediante JWT.
- Protección de rutas.
- Manejo de sesiones.
- Autorización según roles.
- Nuevas funcionalidades para la gestión de eventos.

---

## Autor

**Anibal**

Proyecto desarrollado para el curso **Backend - Coderhouse**.
