# API Backend - Plataforma de Eventos

API REST desarrollada con Node.js, Express y MongoDB para la gestión de una plataforma de eventos.

El proyecto utiliza una arquitectura por capas, separando rutas, controladores, servicios, repositorios y DAO, e incorpora autenticación mediante JWT, autorización por roles y reglas de negocio para la entidad `Event`.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport
- JWT
- bcrypt
- cookie-parser
- dotenv
- Postman
- Nodemon

## Arquitectura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
└── utils/
```

### Separación de responsabilidades

- **Routes:** definen endpoints y middlewares.
- **Controllers:** reciben solicitudes y construyen respuestas.
- **Services:** contienen lógica de negocio y validaciones.
- **Repositories:** abstraen el acceso a los DAO.
- **DAO:** ejecutan operaciones sobre MongoDB mediante Mongoose.
- **Models:** definen los esquemas de MongoDB.
- **Middlewares:** autenticación, autorización y manejo de errores.
- **Utils:** funciones reutilizables.

# Autenticación y autorización

La API utiliza JWT almacenado en una cookie `httpOnly` llamada:

```text
currentUser
```

El payload del JWT contiene:

```json
{
  "id": "665f2a...",
  "email": "usuario@mail.com",
  "role": "user"
}
```

La contraseña nunca se incluye en el JWT.

## Roles

- `user`
- `organizer`
- `admin`

| Acción | user | organizer | admin |
|---|:---:|:---:|:---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar evento propio | ❌ | ✅ | ✅ |
| Modificar evento de otro organizer | ❌ | ❌ | ✅ |
| Cancelar evento propio | ❌ | ✅ | ✅ |
| Consultar usuarios | ❌ | ❌ | ✅ |

La autorización se realiza mediante middleware y la propiedad del evento se verifica mediante el `organizer` asociado.

# Pre-entrega 6 - Entidad Events y lógica de negocio

La Pre-entrega 6 incorpora la entidad `Event`, CRUD principal, reglas de negocio, control de propiedad, estados, filtros, paginación y ordenamiento.

## Modelo Event

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | String | Obligatorio |
| `description` | String | Obligatorio |
| `category` | String | Obligatorio |
| `date` | Date | Obligatorio y futura al crear |
| `location` | String | Obligatorio |
| `capacity` | Number | Mayor que 0 |
| `price` | Number | Mayor o igual a 0 |
| `status` | String | `draft`, `published`, `cancelled`, `finished` |
| `organizer` | ObjectId | Referencia a `User` |

`organizer` es una referencia de MongoDB:

```js
organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
```

El usuario no se encuentra embebido dentro del evento.

# Endpoints de Events

Base URL:

```text
http://localhost:8080/api/events
```

## Crear evento

```http
POST /api/events
```

Requiere autenticación y roles `organizer` o `admin`.

Ejemplo:

```json
{
  "title": "Workshop Backend",
  "description": "Evento de desarrollo backend",
  "category": "workshop",
  "date": "2026-12-20T19:00:00.000Z",
  "location": "Viña del Mar",
  "capacity": 50,
  "price": 15000
}
```

El `organizer` se asigna automáticamente desde el usuario autenticado. El cliente no puede establecer manualmente `organizer` ni `status`.

Los nuevos eventos comienzan con:

```text
status: draft
```

Respuesta exitosa:

```text
201 Created
```

## Listar eventos

```http
GET /api/events
```

Es público y utiliza paginación.

Respuesta:

```json
{
  "status": "success",
  "payload": {
    "data": [],
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Filtros

Por estado:

```text
GET /api/events?status=published
```

Por categoría:

```text
GET /api/events?category=workshop
```

Por ubicación:

```text
GET /api/events?location=Viña%20del%20Mar
```

Por fecha inicial:

```text
GET /api/events?dateFrom=2026-10-01
```

Por fecha final:

```text
GET /api/events?dateTo=2026-12-31
```

Por rango:

```text
GET /api/events?dateFrom=2026-10-01&dateTo=2026-12-31
```

### Paginación

```text
GET /api/events?page=2&limit=5
```

Respuesta:

```json
{
  "status": "success",
  "payload": {
    "data": [],
    "page": 2,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}
```

### Ordenamiento

Ascendente por fecha:

```text
GET /api/events?sort=date
```

Descendente:

```text
GET /api/events?sort=-date
```

### Filtros combinados

Ejemplo P6:

```text
GET /api/events?status=published&category=workshop&page=1&limit=5
```

También se pueden combinar con rango de fechas y ordenamiento:

```text
GET /api/events?status=published&category=workshop&dateFrom=2026-10-01&dateTo=2026-12-31&page=1&limit=5&sort=date
```

## Obtener evento por ID

```http
GET /api/events/:id
```

Es público.

Si no existe:

```text
404 Not Found
```

```json
{
  "status": "error",
  "message": "Evento no encontrado."
}
```

## Modificar evento

```http
PUT /api/events/:id
```

Requiere autenticación.

Un `organizer` puede modificar únicamente sus propios eventos. Un `admin` puede modificar eventos de otros organizers.

Ejemplo:

```json
{
  "title": "Workshop Backend actualizado",
  "description": "Descripción actualizada",
  "category": "workshop",
  "date": "2026-12-20T19:00:00.000Z",
  "location": "Viña del Mar",
  "capacity": 60,
  "price": 18000
}
```

No se pueden modificar mediante `PUT`:

```text
organizer
status
```

Los eventos cancelados no pueden modificarse.

## Cambiar estado

```http
PATCH /api/events/:id/status
```

Requiere autenticación y roles `organizer` o `admin`.

Body:

```json
{
  "status": "published"
}
```

Estados válidos:

```text
draft
published
cancelled
finished
```

### Cancelar evento

La cancelación se realiza mediante:

```http
PATCH /api/events/:id/status
```

```json
{
  "status": "cancelled"
}
```

La cancelación es lógica: el evento no se elimina físicamente de MongoDB.

No existe:

```text
DELETE /api/events/:id
```

# Reglas de negocio

La lógica de negocio se encuentra principalmente en:

```text
src/services/events.service.js
```

### Creación

- `title`, `description`, `category`, `date` y `location` son obligatorios.
- `capacity` debe ser mayor que 0.
- `price` debe ser mayor o igual a 0.
- La fecha debe ser futura.
- El `organizer` se obtiene del usuario autenticado.
- El estado inicial es `draft`.

### Actualización

- Un organizer solo puede modificar eventos propios.
- Un admin puede modificar eventos de otros organizers.
- Un evento cancelado no puede modificarse.
- `capacity` debe ser mayor que 0.
- `price` no puede ser negativo.
- Una nueva fecha debe ser válida y futura.
- `organizer` no puede cambiarse desde el body.
- `status` no se modifica mediante `PUT`.

### Estados

Los estados permitidos son:

```text
draft
published
cancelled
finished
```

Un evento cancelado no puede volver a cambiar de estado.

No se permite publicar un evento finalizado o cancelado.

# Códigos HTTP principales

| Código | Significado |
|---:|---|
| `200` | Operación exitosa |
| `201` | Recurso creado |
| `400` | Error de validación o solicitud |
| `401` | No autenticado |
| `403` | Sin permisos |
| `404` | Evento no encontrado |
| `500` | Error interno |

# Validaciones comprobadas

## Capacidad inválida

```json
{
  "capacity": 0
}
```

Respuesta:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "La capacidad debe ser mayor que cero."
}
```

## Precio negativo

```json
{
  "price": -1000
}
```

Respuesta:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "El precio no puede ser negativo."
}
```

## Fecha pasada

Respuesta:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "La fecha del evento debe ser futura."
}
```

## Organizer modificando evento ajeno

Respuesta:

```text
403 Forbidden
```

```json
{
  "status": "error",
  "message": "No tenés permisos para modificar este evento."
}
```

# Sessions

## Registro

```http
POST /api/sessions/register
```

Ejemplo:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

El rol por defecto es `user` y no puede manipularse desde el registro público.

Las contraseñas se almacenan utilizando `bcrypt`.

## Login

```http
POST /api/sessions/login
```

Ejemplo:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Después de un login exitoso se genera un JWT y se almacena en la cookie:

```text
currentUser
```

La cookie es `httpOnly`.

## Usuario actual

```http
GET /api/sessions/current
```

Requiere autenticación.

## Logout

```http
POST /api/sessions/logout
```

# Users

## Obtener usuarios

```http
GET /api/users
```

Requiere rol `admin`.

Las contraseñas no se exponen en la respuesta.

# Health Check

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Servidor activo"
}
```

# Variables de entorno

Crear `.env` en la raíz:

```env
PORT=8080
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>/<database>
JWT_SECRET=<secret>
```

No subir `.env` a GitHub.

El archivo `.env.example` sirve como referencia para las variables necesarias.

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
```

Entrar al proyecto:

```bash
cd Pre-entrega-backend2
```

Instalar dependencias:

```bash
npm install
```

Configurar `.env`.

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

# Pruebas realizadas para P6

Se comprobaron los siguientes escenarios:

- Usuario normal intentando crear evento → `403`.
- Organizer creando evento → `201`.
- Fecha pasada → `400`.
- Capacidad igual a `0` → `400`.
- Precio negativo → `400`.
- Organizer modificando su propio evento → `200`.
- Organizer modificando evento de otro organizer → `403`.
- Admin modificando evento de otro organizer → `200`.
- Cambio de estado `draft → published` → `200`.
- Cancelación de evento → `200`.
- Evento cancelado intentando cambiar de estado → `400`.
- Evento inexistente → `404`.
- Listado con filtros y paginación → `200`.
- Eliminación física de eventos → no disponible.

# Autor

Proyecto desarrollado como parte del curso Backend de Coderhouse.

**Anibal Allendes**
