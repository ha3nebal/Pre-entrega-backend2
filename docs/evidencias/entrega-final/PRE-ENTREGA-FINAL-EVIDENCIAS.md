# PRE-ENTREGA FINAL — Evidencias

## Objetivo

Documentar las pruebas funcionales realizadas sobre la API integrada de la plataforma de eventos, incluyendo autenticación, autorización, eventos, tickets, capacidad, cancelaciones, DTOs y paginación.

## Resumen

| Caso | Prueba | Resultado |
|---|---|---|
| 1 | Health Check | APROBADO |
| 2 | Registro de usuario | APROBADO |
| 3 | Login + cookie JWT | APROBADO |
| 4 | Sesión actual | APROBADO |
| 5 | Logout + 401 posterior | APROBADO |
| 6 | User intenta crear evento | APROBADO — 403 |
| 7 | Login de organizer | APROBADO |
| 8 | Organizer crea evento | APROBADO |
| 9 | Organizer publica evento | APROBADO |
| 10 | Consulta de tickets propios | APROBADO |
| 11 | Capacidad insuficiente | APROBADO — 400 |
| 12 | Cancelación de ticket | APROBADO |
| 13 | Reinscripción después de cancelar | APROBADO |
| 14 | Organizer modifica evento ajeno | APROBADO — 403 |
| 15 | Admin modifica evento ajeno | APROBADO |
| 16 | Password no expuesta | APROBADO |
| 17 | Paginación + filtro | APROBADO |

## Detalle

### Caso 1 — Health Check
`GET /api/health`
Comprueba que el servidor está activo. Resultado: HTTP 200 y `Servidor activo`.
**Evidencia:** `01-health-check.png`

### Caso 2 — Registro
`POST /api/sessions/register`
Comprueba creación de usuario y respuesta sin password.
**Evidencia:** `02-register-user.png`

### Caso 3 — Login + JWT
`POST /api/sessions/login`
Comprueba autenticación y cookie `currentUser` configurada como `HttpOnly`.
**Evidencias:** `03-login-jwt-cookie1.png`, `03-login-jwt-cookie2.png`

### Caso 4 — Sesión actual
`GET /api/sessions/current`
Comprueba recuperación de `id`, `email` y `role` mediante la sesión.
**Evidencia:** `04-current-user.png`

### Caso 5 — Logout
`POST /api/sessions/logout` y posterior `GET /api/sessions/current`
Después del logout se obtiene `401 No autenticado`.
**Evidencia:** `05-logout-session-invalidated.png`

### Caso 6 — Autorización de usuario
`POST /api/events` con usuario `user`.
Resultado: HTTP 403 por falta de permisos.
**Evidencia:** `06-user-create-event-403.png`

### Caso 7 — Login organizer
`POST /api/sessions/login` con usuario `organizer`.
Resultado: login correcto.
**Evidencia:** `07-login-organizer.png`

### Caso 8 — Crear evento
`POST /api/events` con organizer.
El backend asigna automáticamente el organizer autenticado.
**Evidencia:** `08-organizer-create-event.png`

### Caso 9 — Publicar evento
`PATCH /api/events/:id/status` con `status=published`.
Resultado: evento publicado correctamente.
**Evidencia:** `09-publish-event.png`

### Caso 10 — Mis tickets
`GET /api/tickets/my-tickets`
Comprueba tickets del usuario, incluyendo `quantity` y `reservationCode`.
**Evidencia:** `10-my-tickets.png`

### Caso 11 — Capacidad
`POST /api/events/:eid/tickets` intentando reservar 49 cuando había 48 disponibles.
Resultado: HTTP 400 y mensaje de cupos insuficientes.
**Evidencia:** `11-capacity-validation.png`

### Caso 12 — Cancelar ticket
`PATCH /api/tickets/:tid/cancel`
El ticket pasa a `cancelled`.
**Evidencia:** `12-cancel-ticket.png`

### Caso 13 — Reinscripción
Después de cancelar, el mismo usuario puede inscribirse nuevamente y recibe un nuevo código de reserva.
**Evidencia:** `13-ticket-after-cancellation.png`

### Caso 14 — Organizer ajeno
`PUT /api/events/:id` con un organizer que no es propietario.
Resultado: HTTP 403.
**Evidencia:** `14-organizer-forbidden-event.png`

### Caso 15 — Admin
`PUT /api/events/:id` con `admin` sobre evento de otro organizer.
Resultado: actualización exitosa.
**Evidencia:** `15-admin-modify-event.png`

### Caso 16 — Password
`GET /api/sessions/current`
La respuesta contiene `id`, `email` y `role`, pero no `password`.
**Evidencia:** `16-no-password-response.png`

### Caso 17 — Paginación
`GET /api/events?status=published&page=2&limit=5`
La respuesta conserva `data`, `page`, `limit`, `total` y `totalPages`.
**Evidencia:** `17-events-pagination.png`

## Correcciones detectadas durante la validación

Se corrigió `src/dto/ticket.dto.js` para exponer `quantity` y `reservationCode`.

Se corrigió `src/dto/event.dto.js` para conservar la estructura paginada:

```text
data
page
limit
total
totalPages
```

Commit:

```text
f7f4a73 fix: correct event and ticket DTO responses
```

Rama:

```text
entrega-final
```
