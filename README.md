# API Backend - Plataforma de Eventos

API REST desarrollada con Node.js, Express y MongoDB para gestionar usuarios, autenticación, eventos e inscripciones mediante tickets.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Passport
- bcrypt
- Nodemailer
- Gmail SMTP

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=TU_URI_REAL_DE_MONGODB_ATLAS
JWT_SECRET=TU_CLAVE_SECRETA
JWT_EXPIRES_IN=1h

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=TU_CORREO_GMAIL
MAIL_PASS=TU_CONTRASEÑA_DE_APLICACION
MAIL_FROM=TU_CORREO_GMAIL
```

No subir `.env` al repositorio. Las credenciales de Gmail deben mantenerse privadas.

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

## Arquitectura

```text
src/
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

La lógica de negocio se mantiene principalmente en los servicios, los controladores gestionan las solicitudes HTTP y los DAO el acceso a MongoDB.

## Autenticación

La autenticación utiliza JWT almacenado en una cookie `httpOnly` llamada `currentUser`.

Payload conceptual:

```json
{
  "id": "USER_ID",
  "email": "usuario@mail.com",
  "role": "user"
}
```

La contraseña no se incluye en el JWT.

## Roles

- `user`
- `organizer`
- `admin`

## Usuarios y sesiones

### Registrar usuario

```http
POST /api/sessions/register
```

Campos requeridos:

- `first_name`
- `last_name`
- `email`
- `password`

La contraseña se almacena utilizando bcrypt. El rol inicial es `user` y no puede ser manipulado desde el registro público.

### Login

```http
POST /api/sessions/login
```

### Usuario actual

```http
GET /api/sessions/current
```

Requiere autenticación.

### Logout

```http
POST /api/sessions/logout
```

## Eventos

### Listar eventos

```http
GET /api/events
```

### Obtener evento

```http
GET /api/events/:id
```

### Crear evento

```http
POST /api/events
```

Requiere autenticación y rol `organizer` o `admin`.

### Actualizar evento

```http
PUT /api/events/:id
```

### Cambiar estado

```http
PATCH /api/events/:id/status
```

Estados:

- `draft`
- `published`
- `cancelled`
- `finished`

## Tickets e inscripciones

### Crear inscripción

```http
POST /api/events/:eid/tickets
```

Requiere autenticación.

Body:

```json
{
  "quantity": 2
}
```

El sistema valida:

1. Existencia del evento.
2. Evento publicado.
3. Evento no cancelado ni finalizado.
4. Cantidad entera mayor que cero.
5. Ausencia de inscripción activa del usuario para el mismo evento.
6. Capacidad disponible suficiente.

### Regla de capacidad

Solo los tickets activos ocupan cupos. Los tickets `cancelled` no ocupan capacidad.

Ejemplo:

```text
Capacidad: 10
Tickets activos: 6
Disponibles: 4
```

Si la cantidad solicitada supera los cupos disponibles, la inscripción es rechazada.

### Estados de ticket

- `confirmed`
- `pending`
- `cancelled`

Los tickets cancelados no se eliminan físicamente.

### Mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

Devuelve únicamente los tickets del usuario autenticado e incluye información básica del evento:

- título
- fecha
- ubicación

### Tickets de un evento

```http
GET /api/events/:eid/tickets
```

Permisos:

- `admin`: cualquier evento.
- `organizer`: únicamente sus propios eventos.
- `user`: sin permiso.

### Cancelar ticket

```http
PATCH /api/tickets/:tid/cancel
```

Puede cancelar el propietario del ticket o un administrador.

Al cancelar:

- `status` pasa a `cancelled`;
- se registra `cancelledAt`;
- el ticket permanece almacenado;
- la cantidad deja de ocupar capacidad.

## Código de reserva

Cada ticket confirmado genera un código único, por ejemplo:

```text
RES-1790048513811-F2DZR3
```

## Confirmación por correo

Después de una inscripción confirmada, Nodemailer envía un correo mediante Gmail SMTP.

El correo incluye:

- evento;
- fecha;
- ubicación;
- cantidad;
- código de reserva.

Variables:

```env
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASS
MAIL_FROM
```

Las credenciales nunca se escriben directamente en el código.

## Flujo de inscripción

```text
Usuario autenticado
        │
        ▼
POST /api/events/:eid/tickets
        │
        ▼
Validaciones del evento y usuario
        │
        ▼
Control de capacidad
        │
        ▼
Creación del ticket
        │
        ▼
status: confirmed
        │
        ▼
Correo de confirmación
```

## Respuestas

Éxito:

```json
{
  "status": "success",
  "payload": {}
}
```

Error:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## Seguridad

No subir al repositorio:

- `.env`
- credenciales de MongoDB Atlas
- contraseñas de aplicación de Gmail
- secretos JWT
- `node_modules`

El repositorio debe contener `.env.example` con valores de ejemplo, nunca secretos reales.
