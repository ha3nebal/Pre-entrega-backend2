# API Backend - Plataforma de Eventos

API REST desarrollada con **Node.js, Express y MongoDB** para gestionar usuarios, autenticación, eventos, inscripciones mediante tickets, control de capacidad, permisos por roles y notificaciones por correo electrónico.

El proyecto corresponde a la **Entrega Final del Backend - Plataforma de Eventos**, integrando las funcionalidades desarrolladas durante las pre-entregas anteriores y aplicando una arquitectura organizada por capas.

---

## 1. Objetivo del proyecto

La API permite gestionar una plataforma de eventos en la que:

- Los usuarios pueden registrarse e iniciar sesión.
- La autenticación se realiza mediante JWT.
- Los usuarios poseen diferentes roles.
- Los organizadores pueden crear y administrar sus propios eventos.
- Los administradores poseen permisos de gestión global.
- Los usuarios pueden inscribirse a eventos mediante tickets.
- Se controla la capacidad disponible de cada evento.
- Se evitan inscripciones activas duplicadas.
- Los tickets pueden ser cancelados.
- Los cupos liberados por cancelaciones vuelven a estar disponibles.
- Se envían correos de confirmación mediante Nodemailer.
- Las respuestas utilizan DTOs para controlar la información expuesta por la API.
- Los eventos cuentan con filtros, paginación y ordenamiento.

---

# 2. Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB Atlas**
- **Mongoose**
- **Passport**
- **JWT**
- **bcrypt**
- **Nodemailer**
- **Gmail SMTP**
- **Postman**

---

# 3. Instalación

Clonar el repositorio y acceder al directorio del proyecto:

```bash
git clone https://github.com/ha3nebal/Pre-entrega-backend2.git
cd Pre-entrega-backend2
```

Instalar las dependencias:

```bash
npm install
```

---

# 4. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

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

Las credenciales reales deben mantenerse privadas.

El archivo `.env` no debe subirse al repositorio.

Para configurar el proyecto se puede utilizar como referencia:

```text
.env.example
```

---

# 5. Ejecución

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

Por defecto, la API queda disponible en:

```text
http://localhost:8080
```

---

# 6. Verificación del servidor

Endpoint:

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

Este endpoint permite comprobar que el servidor Express se encuentra operativo.

---

# 7. Arquitectura del proyecto

El proyecto utiliza una arquitectura organizada por capas para separar responsabilidades y facilitar el mantenimiento y escalabilidad de la aplicación.

```text
src/
├── config/
├── controllers/
├── dao/
├── dto/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
└── utils/
```

## Flujo de una solicitud

```text
Cliente
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
DAO
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB Atlas
```

Para las respuestas:

```text
Service
   │
   ▼
DTO
   │
   ▼
Controller
   │
   ▼
Response HTTP
```

## Responsabilidades

### Routes

Definen los endpoints disponibles de la API y conectan las solicitudes con los controllers correspondientes.

### Middlewares

Se encargan principalmente de:

- autenticación;
- autorización por roles;
- control de acceso;
- manejo de errores.

### Controllers

Gestionan las solicitudes HTTP y coordinan la respuesta.

Los controllers no contienen la lógica principal de negocio.

### Services

Contienen la lógica de negocio y las validaciones principales de la aplicación.

### Repositories

Funcionan como una capa intermedia entre los services y los DAO.

### DAO

Son responsables del acceso a MongoDB mediante Mongoose.

### Models

Definen los esquemas de datos utilizados por MongoDB/Mongoose.

### DTO

Los DTO permiten controlar la información que se expone en las respuestas de la API.

Entre ellos se encuentran:

```text
src/dto/user.dto.js
src/dto/event.dto.js
src/dto/ticket.dto.js
```

Su objetivo es evitar retornar directamente toda la información almacenada en los documentos y evitar exponer información sensible, como contraseñas.

---

# 8. Autenticación

La autenticación utiliza **JWT**, almacenado en una cookie `httpOnly` llamada:

```text
currentUser
```

El flujo principal es:

```text
Registro
   ↓
Login
   ↓
JWT
   ↓
Cookie httpOnly
   ↓
Passport JWT
   ↓
Usuario autenticado
```

El payload conceptual del JWT es:

```json
{
    "id": "USER_ID",
    "email": "usuario@mail.com",
    "role": "user"
}
```

El JWT no contiene:

```text
password
first_name
last_name
```

---

# 9. Roles y autorización

El sistema contempla tres roles:

```text
user
organizer
admin
```

## user

Puede:

- registrarse;
- iniciar sesión;
- consultar eventos;
- inscribirse a eventos publicados;
- consultar sus propios tickets;
- cancelar sus propios tickets.

No puede:

- crear eventos;
- modificar eventos de otros;
- consultar tickets de eventos que no administra.

## organizer

Puede:

- crear eventos;
- modificar sus propios eventos;
- cambiar el estado de sus propios eventos;
- consultar tickets de sus propios eventos.

No puede modificar ni administrar eventos pertenecientes a otros organizadores.

## admin

Posee permisos administrativos globales.

Puede:

- modificar eventos de otros organizadores;
- consultar tickets de cualquier evento;
- realizar operaciones administrativas sobre los recursos.

---

# 10. Usuarios y sesiones

## Registrar usuario

```http
POST /api/sessions/register
```

Body:

```json
{
    "first_name": "Matias",
    "last_name": "Rojas",
    "email": "matias.rojas@test.com",
    "password": "Secreta123"
}
```

Campos requeridos:

- `first_name`
- `last_name`
- `email`
- `password`

La contraseña se almacena utilizando **bcrypt**.

El registro público asigna automáticamente:

```text
role = user
```

El rol no puede ser manipulado mediante el body público de registro.

---

## Login

```http
POST /api/sessions/login
```

Body:

```json
{
    "email": "usuario@mail.com",
    "password": "Secreta123"
}
```

Un login exitoso genera un JWT y lo almacena en la cookie:

```text
currentUser
```

La cookie utiliza la propiedad:

```text
HttpOnly
```

---

## Usuario actual

```http
GET /api/sessions/current
```

Requiere autenticación.

Ejemplo de respuesta:

```json
{
    "status": "success",
    "payload": {
        "id": "USER_ID",
        "email": "usuario@mail.com",
        "role": "user"
    }
}
```

---

## Logout

```http
POST /api/sessions/logout
```

Invalida la sesión eliminando la cookie de autenticación.

Posteriormente, una solicitud a:

```http
GET /api/sessions/current
```

debe responder:

```text
401 Unauthorized
```

---

# 11. Eventos

Los eventos contienen información como:

- título;
- descripción;
- categoría;
- fecha;
- ubicación;
- capacidad;
- precio;
- organizador;
- estado.

Los estados disponibles son:

```text
draft
published
cancelled
finished
```

---

## Listar eventos

```http
GET /api/events
```

Endpoint público.

---

## Obtener evento por ID

```http
GET /api/events/:id
```

Endpoint público.

---

## Crear evento

```http
POST /api/events
```

Requiere:

- autenticación;
- rol `organizer` o `admin`.

Ejemplo:

```json
{
    "title": "Evento Final Coderhouse",
    "description": "Evento de prueba para la entrega final",
    "category": "Tecnología",
    "date": "2027-12-15T20:00:00.000Z",
    "location": "Viña del Mar",
    "capacity": 50,
    "price": 15000
}
```

La API valida, entre otros aspectos:

- título obligatorio;
- descripción obligatoria;
- categoría obligatoria;
- fecha válida;
- fecha futura;
- ubicación obligatoria;
- capacidad mayor que cero;
- precio no negativo.

El organizador se obtiene desde el usuario autenticado y no desde el body de la solicitud.

---

## Modificar evento

```http
PUT /api/events/:id
```

Requiere autenticación y permisos.

Un organizador solamente puede modificar sus propios eventos.

Un administrador puede modificar eventos pertenecientes a otros organizadores.

Los eventos cancelados no pueden ser modificados.

---

## Cambiar estado del evento

```http
PATCH /api/events/:id/status
```

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

---

# 12. Filtros, paginación y ordenamiento

El endpoint:

```http
GET /api/events
```

permite utilizar parámetros de consulta.

## Filtros disponibles

```text
status
category
location
dateFrom
dateTo
```

## Paginación

```text
page
limit
```

## Ordenamiento

```text
sort
```

Para ordenar por fecha:

```text
sort=date
```

o en orden descendente:

```text
sort=-date
```

---

## Ejemplo de consulta paginada

```http
GET /api/events?status=published&page=2&limit=5
```

Respuesta:

```json
{
    "status": "success",
    "payload": {
        "data": [],
        "page": 2,
        "limit": 5,
        "total": 6,
        "totalPages": 2
    }
}
```

La respuesta paginada contiene:

- `data`: eventos correspondientes a la página;
- `page`: página solicitada;
- `limit`: cantidad máxima de resultados;
- `total`: cantidad total de eventos encontrados;
- `totalPages`: cantidad total de páginas.

---

# 13. Tickets e inscripciones

Los tickets representan las inscripciones de usuarios a eventos.

Endpoint:

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

---

## Validaciones de inscripción

Antes de crear un ticket se verifica:

1. Que el evento exista.
2. Que el evento esté publicado.
3. Que el evento no esté cancelado.
4. Que el evento no esté finalizado.
5. Que `quantity` sea un número entero mayor que cero.
6. Que existan suficientes cupos.
7. Que el usuario no tenga una inscripción activa para el mismo evento.

---

# 14. Control de capacidad

La capacidad se calcula considerando solamente los tickets activos.

Conceptualmente:

```text
Capacidad del evento
        -
Tickets activos
        =
Cupos disponibles
```

Los tickets con:

```text
status = cancelled
```

no ocupan capacidad.

Ejemplo:

```text
Capacidad:       50
Tickets activos:  2
Disponibles:     48
```

Si un usuario intenta reservar una cantidad superior a los cupos disponibles, la API responde con un error de validación.

---

# 15. Estados de los tickets

Los estados disponibles son:

```text
confirmed
pending
cancelled
```

Los tickets cancelados no se eliminan físicamente.

En su lugar:

```text
status = cancelled
```

y se registra:

```text
cancelledAt
```

Esto permite conservar el historial de la operación.

---

# 16. Mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

Devuelve únicamente los tickets pertenecientes al usuario autenticado.

La respuesta incluye información básica del evento:

- título;
- fecha;
- ubicación.

También se devuelve información del ticket como:

- estado;
- cantidad;
- código de reserva;
- fecha de creación.

---

# 17. Tickets de un evento

```http
GET /api/events/:eid/tickets
```

Permisos:

```text
admin
```

Puede consultar tickets de cualquier evento.

```text
organizer
```

Puede consultar únicamente los tickets de sus propios eventos.

```text
user
```

No tiene permisos para consultar los tickets de un evento.

---

# 18. Cancelación de tickets

```http
PATCH /api/tickets/:tid/cancel
```

Puede cancelar:

- el propietario del ticket;
- un administrador.

Al cancelar:

```text
status → cancelled
cancelledAt → fecha de cancelación
```

El ticket permanece almacenado y deja de ocupar capacidad.

Esto permite que posteriormente otro usuario pueda utilizar los cupos liberados.

---

# 19. Código de reserva

Cada ticket confirmado genera un código único de reserva.

Ejemplo:

```text
RES-1790048513811-F2DZR3
```

Este código permite identificar la reserva realizada.

---

# 20. Confirmación por correo

Después de una inscripción confirmada, el sistema utiliza **Nodemailer** para enviar un correo de confirmación mediante SMTP.

El correo contiene información como:

- evento;
- fecha;
- ubicación;
- cantidad reservada;
- código de reserva.

La configuración se realiza mediante variables de entorno:

```env
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASS
MAIL_FROM
```

Las credenciales no se almacenan directamente en el código fuente.

---

# 21. Respuestas de la API

## Respuesta exitosa

```json
{
    "status": "success",
    "payload": {}
}
```

## Respuesta de error

```json
{
    "status": "error",
    "message": "Descripción del error"
}
```

---

# 22. Códigos HTTP utilizados

| Código | Descripción |
|---|---|
| `200 OK` | Operación procesada correctamente |
| `201 Created` | Recurso creado correctamente |
| `400 Bad Request` | Error de validación o solicitud inválida |
| `401 Unauthorized` | Usuario no autenticado |
| `403 Forbidden` | Usuario autenticado pero sin permisos |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Conflicto con un recurso existente |
| `500 Internal Server Error` | Error interno del servidor |

---

# 23. Manejo centralizado de errores

Los errores son gestionados mediante middleware centralizado.

Las capas de servicio pueden generar errores con su correspondiente código HTTP y el middleware se encarga de construir la respuesta final.

Esto evita repetir la misma lógica de manejo de errores en cada controller.

---

# 24. Seguridad

El proyecto considera las siguientes medidas:

- Contraseñas almacenadas mediante bcrypt.
- JWT para autenticación.
- JWT almacenado en cookie `httpOnly`.
- Control de acceso mediante roles.
- DTOs para controlar información expuesta.
- Validación de datos recibidos.
- Separación de responsabilidades mediante arquitectura por capas.
- Variables sensibles almacenadas mediante `.env`.

No deben subirse al repositorio:

```text
.env
node_modules/
```

Tampoco deben publicarse:

- credenciales de MongoDB Atlas;
- secreto JWT;
- contraseña SMTP;
- credenciales de Gmail;
- otros secretos de configuración.

El repositorio debe contener:

```text
.env.example
```

con valores de ejemplo y nunca credenciales reales.

---

# 25. Evidencias de la entrega final

Las pruebas funcionales de la integración final fueron realizadas mediante **Postman**.

Las capturas se encuentran organizadas en:

```text
docs/evidencias/entrega-final/
```

La documentación detallada de las pruebas se encuentra en:

```text
docs/evidencias/entrega-final/PRE-ENTREGA-FINAL-EVIDENCIAS.md
```

El directorio contiene las evidencias correspondientes a:

```text
01-health-check.png
02-register-user.png
03-login-jwt-cookie1.png
03-login-jwt-cookie2.png
04-current-user.png
05-logout-session-invalidated.png
06-user-create-event-403.png
07-login-organizer.png
08-organizer-create-event.png
09-publish-event.png
10-my-tickets.png
11-capacity-validation.png
12-cancel-ticket.png
13-ticket-after-cancellation.png
14-organizer-forbidden-event.png
15-admin-modify-event.png
16-no-password-response.png
17-events-pagination.png
```

El caso de login utiliza dos capturas:

```text
03-login-jwt-cookie1.png
03-login-jwt-cookie2.png
```

porque documentan la misma prueba desde dos vistas complementarias.

---

# 26. Casos de prueba de la entrega final

Las evidencias permiten comprobar los principales criterios funcionales de la API.

| Caso | Funcionalidad | Resultado esperado |
|---|---|---|
| 1 | Health Check | `200 OK` |
| 2 | Registro de usuario | `201 Created` |
| 3 | Login y JWT en cookie | `200 OK` |
| 4 | Consulta de usuario actual | `200 OK` |
| 5 | Logout e invalidación de sesión | `401 Unauthorized` posterior |
| 6 | Usuario intenta crear evento | `403 Forbidden` |
| 7 | Login de organizador | `200 OK` |
| 8 | Organizador crea evento | `201 Created` |
| 9 | Publicación de evento | `200 OK` |
| 10 | Consulta de tickets propios | `200 OK` |
| 11 | Validación de capacidad | `400 Bad Request` |
| 12 | Cancelación de ticket | `200 OK` |
| 13 | Nueva inscripción después de cancelar | `201 Created` |
| 14 | Organizador modifica evento ajeno | `403 Forbidden` |
| 15 | Administrador modifica evento ajeno | `200 OK` |
| 16 | Respuesta sin contraseña | Información sensible no expuesta |
| 17 | Paginación y filtros de eventos | `200 OK` con estructura paginada |

---

# 27. Evidencia de arquitectura y funcionamiento

Las pruebas realizadas permiten comprobar la integración entre:

```text
Autenticación
     │
     ▼
Autorización
     │
     ▼
Eventos
     │
     ▼
Tickets
     │
     ▼
Control de capacidad
     │
     ▼
Cancelaciones
     │
     ▼
Notificaciones
```

La integración se realiza manteniendo la separación de responsabilidades definida por la arquitectura:

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
MongoDB
```

y utilizando DTOs para las respuestas:

```text
User → UserDTO
Event → EventDTO
Ticket → TicketDTO
```

---

# 28. Documentación de Pre-entrega 7

La documentación específica de la Pre-entrega 7 se conserva separadamente.

Documento:

```text
docs/PRE-ENTREGA-7-EVIDENCIAS.md
```

Evidencias:

```text
docs/evidencias/
```

Esta documentación contiene las pruebas relacionadas específicamente con:

- inscripción a eventos;
- capacidad;
- tickets;
- cancelaciones;
- permisos;
- notificaciones por correo.

La documentación de P7 se mantiene como antecedente de las funcionalidades posteriormente integradas en la entrega final.

---

# 29. Estructura de documentación

La carpeta `docs/` queda organizada de la siguiente manera:

```text
docs/
│
├── PRE-ENTREGA-7-EVIDENCIAS.md
│
├── evidencias/
│   │
│   ├── README.md
│   │
│   ├── P7-Caso1-...
│   ├── P7-Caso2-...
│   ├── P7-Caso3-...
│   └── ...
│
│   └── entrega-final/
│       │
│       ├── 01-health-check.png
│       ├── 02-register-user.png
│       ├── 03-login-jwt-cookie1.png
│       ├── 03-login-jwt-cookie2.png
│       ├── 04-current-user.png
│       ├── 05-logout-session-invalidated.png
│       ├── 06-user-create-event-403.png
│       ├── 07-login-organizer.png
│       ├── 08-organizer-create-event.png
│       ├── 09-publish-event.png
│       ├── 10-my-tickets.png
│       ├── 11-capacity-validation.png
│       ├── 12-cancel-ticket.png
│       ├── 13-ticket-after-cancellation.png
│       ├── 14-organizer-forbidden-event.png
│       ├── 15-admin-modify-event.png
│       ├── 16-no-password-response.png
│       ├── 17-events-pagination.png
│       ├── PRE-ENTREGA-FINAL-EVIDENCIAS.md
│       └── README.md
```

---

# 30. Resultado final

La entrega final integra las funcionalidades desarrolladas durante las diferentes etapas del proyecto en una API REST funcional para una plataforma de eventos.

La solución incorpora:

- autenticación mediante JWT;
- registro seguro con bcrypt;
- autorización mediante roles;
- gestión de usuarios;
- gestión de eventos;
- filtros y paginación;
- tickets e inscripciones;
- control de capacidad;
- cancelación y liberación de cupos;
- códigos de reserva;
- notificaciones por correo;
- DTOs;
- Repository y DAO;
- middleware de autenticación y autorización;
- manejo centralizado de errores;
- conexión con MongoDB Atlas;
- documentación y evidencias de pruebas mediante Postman.

El proyecto queda estructurado para facilitar su mantenimiento, extensión e incorporación de nuevas funcionalidades.

---

# 31. Licencia

Proyecto desarrollado con fines académicos para el curso de Backend de Coderhouse.