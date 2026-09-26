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

---

# Pre-entrega 7: Tickets, inscripciones y control de cupos

Esta entrega incorpora el flujo completo de inscripción de usuarios a eventos mediante la entidad `Ticket`.

El módulo permite:

- Inscribir usuarios autenticados a eventos publicados.
- Controlar la cantidad de cupos disponibles.
- Evitar inscripciones activas duplicadas de un mismo usuario.
- Consultar los tickets propios.
- Consultar los tickets de un evento según permisos.
- Cancelar una inscripción sin eliminar físicamente el ticket.
- Liberar automáticamente los cupos correspondientes a tickets cancelados.
- Enviar un correo de confirmación mediante Nodemailer.

## Modelo Ticket

El modelo se encuentra en:

```text
src/models/Ticket.js
```

El ticket utiliza referencias mediante `ObjectId` para relacionar al usuario con el evento.

| Campo | Tipo | Descripción |
|---|---|---|
| `user` | ObjectId | Referencia al usuario inscrito. |
| `event` | ObjectId | Referencia al evento. |
| `status` | String | Estado de la inscripción. |
| `quantity` | Number | Cantidad de cupos reservados. |
| `reservationCode` | String | Código único de reserva. |
| `createdAt` | Date | Fecha de creación, generada mediante `timestamps`. |
| `cancelledAt` | Date | Fecha de cancelación. |

Los estados permitidos son:

```text
confirmed
pending
cancelled
```

Los tickets utilizan referencias a `User` y `Event`; no se almacenan objetos completos de usuario o evento dentro del ticket.

## Endpoints de Tickets

### 1. Crear inscripción

```http
POST /api/events/:eid/tickets
```

**Acceso:** usuario autenticado.

Body:

```json
{
    "quantity": 2
}
```

Validaciones:

1. El evento debe existir.
2. El evento debe estar en estado `published`.
3. El evento no puede estar `cancelled`.
4. El evento no puede estar `finished`.
5. `quantity` debe ser un número entero mayor que cero.
6. Deben existir cupos suficientes.
7. El usuario no debe tener una inscripción activa para ese evento.

Los tickets con estado `cancelled` no ocupan cupos.

Una inscripción exitosa devuelve `201 Created` y genera un código de reserva. También se envía un correo de confirmación.

### 2. Consultar mis tickets

```http
GET /api/tickets/my-tickets
```

**Acceso:** usuario autenticado.

Devuelve únicamente los tickets pertenecientes al usuario autenticado.

El evento se obtiene mediante `populate` con:

```text
title
date
location
```

No se exponen datos sensibles de otros usuarios.

### 3. Consultar tickets de un evento

```http
GET /api/events/:eid/tickets
```

**Acceso:**

- `admin`: puede consultar tickets de cualquier evento.
- `organizer`: puede consultar únicamente los tickets de sus propios eventos.
- `user`: no tiene acceso.

La autorización del organizador se valida en la capa de service.

### 4. Cancelar ticket

```http
PATCH /api/tickets/:tid/cancel
```

**Acceso:**

- dueño del ticket;
- `admin`.

La cancelación es lógica. El ticket no se elimina físicamente.

Su estado cambia a:

```text
cancelled
```

y se registra:

```text
cancelledAt
```

Los tickets cancelados dejan de contabilizarse en el cálculo de cupos disponibles.

## Reglas de negocio

La lógica de validación de las inscripciones se encuentra en:

```text
src/services/tickets.service.js
```

Las validaciones se realizan en el service y no directamente en las rutas ni en los controllers.

El flujo utiliza la arquitectura:

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
MongoDB
```

### Control de cupos

Los cupos ocupados se calculan considerando únicamente tickets activos.

Los tickets con:

```text
status = cancelled
```

no se incluyen en el cálculo.

La capacidad se calcula conceptualmente como:

```text
capacidad del evento
        -
tickets activos
        =
cupos disponibles
```

La cantidad solicitada debe ser menor o igual a los cupos disponibles.

### Inscripción duplicada

Un usuario no puede mantener más de una inscripción activa para el mismo evento.

Si ya existe un ticket activo para ese usuario y evento, la API rechaza una nueva inscripción.

Un ticket previamente cancelado no bloquea una nueva inscripción.

## Cancelación y liberación de cupos

Cuando un usuario cancela su ticket:

```text
Ticket activo
     ↓
status = cancelled
     ↓
cancelledAt = fecha actual
     ↓
No se cuenta como cupo ocupado
```

El documento permanece almacenado en MongoDB.

Esto permite mantener el historial de la inscripción y liberar los cupos correspondientes.

## Notificaciones por email

El envío de correos utiliza Nodemailer.

La configuración se encuentra en:

```text
src/services/email.service.js
```

Las variables de configuración son:

```env
MAIL_HOST=TU_SERVIDOR_SMTP
MAIL_PORT=587
MAIL_USER=TU_CORREO
MAIL_PASS=TU_CLAVE_O_CONTRASENA_SMTP
MAIL_FROM=TU_CORREO
```

Estas variables también se encuentran documentadas en:

```text
.env.example
```

Las credenciales reales no deben escribirse directamente en el código ni subirse al repositorio.

Al completar correctamente una inscripción se envía un correo de confirmación que incluye:

- nombre del evento;
- fecha;
- ubicación;
- cantidad de cupos reservados;
- código de reserva.

## Ejecución y verificación

### 1. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo:

```text
.env
```

a partir de:

```text
.env.example
```

Configurar las variables necesarias para MongoDB, JWT y SMTP.

El archivo `.env` no debe subirse al repositorio.

### 3. Ejecutar el servidor

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

### 4. Verificar el servidor

```http
GET /api/health
```

Respuesta esperada:

```text
200 OK
```

```json
{
    "status": "ok",
    "message": "Servidor activo"
}
```

### 5. Verificación de la Pre-entrega 7

Los casos de prueba correspondientes a los criterios de aceptación de Tickets, inscripciones y control de cupos fueron ejecutados mediante Postman y quedaron documentados en:

```text
docs/PRE-ENTREGA-7-EVIDENCIAS.md
```

Las capturas de pantalla se encuentran organizadas en:

```text
docs/evidencias/
```

### Resultados de las pruebas

| Caso | Prueba | Resultado |
|---|---|---|
| 1 | Inscripción exitosa y recepción del email | 201 Created |
| 2 | Inscripción sin sesión | 401 Unauthorized |
| 3 | Inscripción a evento inexistente | 404 Not Found |
| 4 | Inscripción a evento cancelado | 400 Bad Request |
| 5 | Inscripción sin cupos suficientes | 400 Bad Request |
| 6 | Inscripción duplicada activa | 400 Bad Request |
| 7 | Cancelación propia, liberación de cupo y reinscripción | 200 OK / 201 Created |
| 8 | Cancelación de ticket ajeno como `user` | 403 Forbidden |
| 9 | Consulta de tickets como usuario común | 403 Forbidden |
| 10 | Consulta de tickets de otro organizador | 403 Forbidden |

### Evidencias

El directorio `docs/evidencias/` contiene las 13 capturas utilizadas para documentar las pruebas:

```text
docs/evidencias/
├── P7-Caso1-01-evento-publicado.png
├── P7-Caso1-02-inscripcion-exitosa.png
├── P7-Caso1-03-correo-confirmacion.png
├── P7-Caso2-01-sin-sesion-401.png
├── P7-Caso3-01-evento-inexistente-404.png
├── P7-Caso4-01-evento-cancelado-400.png
├── P7-Caso5-01-capacidad-insuficiente-400.png
├── P7-Caso6-01-inscripcion-duplicada-400.png
├── P7-Caso7-01-cancelacion-ticket.png
├── P7-Caso7-02-reinscripcion-tras-cancelacion.png
├── P7-Caso8-01-cancelar-ticket-ajeno-403.png
├── P7-Caso9-01-user-consulta-tickets-403.png
└── P7-Caso10-01-organizador-otro-evento-403.png
```

### Comprobaciones realizadas

Durante las pruebas se verificó que:

- una inscripción válida crea un ticket confirmado;
- el correo de confirmación se recibe correctamente;
- las solicitudes sin autenticación son rechazadas;
- los eventos inexistentes generan `404`;
- los eventos cancelados o finalizados no aceptan nuevas inscripciones;
- la cantidad solicitada se valida contra la capacidad disponible;
- una inscripción activa duplicada es rechazada;
- los tickets cancelados permanecen almacenados y registran `cancelledAt`;
- los tickets cancelados dejan de ocupar capacidad;
- después de cancelar un ticket es posible volver a utilizar los cupos liberados;
- un usuario no puede cancelar tickets de otro usuario;
- un usuario común no puede consultar los tickets de un evento;
- un organizador no puede consultar los tickets de un evento perteneciente a otro organizador.

La documentación detallada de cada caso, junto con sus capturas, se encuentra en:

```text
docs/PRE-ENTREGA-7-EVIDENCIAS.md
```

## Seguridad y archivos sensibles

No subir al repositorio:

```text
.env
node_modules/
```

Tampoco deben publicarse:

- credenciales de MongoDB;
- secreto JWT;
- contraseña SMTP;
- otras credenciales o secretos.

El repositorio debe contener como mínimo:

```text
.env.example
.gitignore
package.json
package-lock.json
README.md
src/
```

y la documentación de evidencias:

```text
docs/PRE-ENTREGA-7-EVIDENCIAS.md
```

---
