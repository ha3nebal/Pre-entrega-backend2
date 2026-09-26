# Evidencias Pre-entrega 7
## API Backend - Plataforma de Eventos

**Repositorio:** Pre-entrega-backend2  
**Funcionalidad:** Gestión de tickets, inscripciones, capacidad, cancelaciones, permisos y notificaciones por correo.

---

## 1. Objetivo

Esta documentación presenta la implementación y las evidencias de la funcionalidad correspondiente a la Pre-entrega 7.

La funcionalidad permite:

- Registrar usuarios en eventos mediante tickets.
- Validar el estado y existencia del evento.
- Validar la capacidad disponible.
- Evitar inscripciones activas duplicadas.
- Consultar los tickets propios.
- Consultar los tickets de un evento según permisos.
- Cancelar tickets sin eliminarlos físicamente.
- Liberar capacidad cuando un ticket es cancelado.
- Permitir una nueva inscripción después de una cancelación.
- Enviar un correo de confirmación al completar una inscripción.

---

## 2. Modelo de Ticket

El modelo `Ticket` utiliza referencias mediante ObjectId para `user` y `event`, sin incrustar objetos completos.

Campos principales:

- `user`: referencia al modelo `User`.
- `event`: referencia al modelo `Event`.
- `status`: `confirmed`, `pending` o `cancelled`.
- `quantity`: cantidad de cupos reservados.
- `reservationCode`: código único de reserva.
- `cancelledAt`: fecha de cancelación.
- `createdAt` y `updatedAt`: generados mediante timestamps de Mongoose.

Los tickets cancelados permanecen registrados y no son eliminados físicamente.

---

## 3. Endpoints evaluados

### Registro a un evento

```http
POST /api/events/:eid/tickets
```

Requiere autenticación.

Body:

```json
{
  "quantity": 1
}
```

### Tickets del usuario autenticado

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

### Tickets de un evento

```http
GET /api/events/:eid/tickets
```

Permite el acceso al organizador propietario del evento y al administrador.

### Cancelación de ticket

```http
PATCH /api/tickets/:tid/cancel
```

Permite cancelar al propietario del ticket o a un administrador.

---

# 4. Casos de prueba realizados

## Caso 1 — Inscripción exitosa y correo de confirmación

### Objetivo

Comprobar que un usuario autenticado puede inscribirse correctamente en un evento publicado y que se genera el correo de confirmación.

### Resultado

**HTTP 201 Created**

La inscripción fue creada correctamente con:

- Estado: `confirmed`
- Cantidad: `1`
- Código de reserva: `RES-1790381036880-29R5Y3`
- `cancelledAt`: `null`

También se verificó la recepción del correo de confirmación en Gmail.

### Evidencias

![Caso 1 - Evento publicado](evidencias/P7-Caso1-01-evento-publicado.png)

![Caso 1 - Inscripción exitosa](evidencias/P7-Caso1-02-inscripcion-exitosa.png)

![Caso 1 - Correo de confirmación](evidencias/P7-Caso1-03-correo-confirmacion.png)

---

## Caso 2 — Inscripción sin sesión

### Objetivo

Comprobar que un usuario no autenticado no puede registrar un ticket.

### Resultado

**HTTP 401 Unauthorized**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Evidencia

![Caso 2 - Sin sesión 401](evidencias/P7-Caso2-01-sin-sesion-401.png)

---

## Caso 3 — Evento inexistente

### Objetivo

Intentar registrar un ticket utilizando un ID de evento inexistente.

### Resultado

**HTTP 404 Not Found**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "Evento no encontrado."
}
```

### Evidencia

![Caso 3 - Evento inexistente 404](evidencias/P7-Caso3-01-evento-inexistente-404.png)

---

## Caso 4 — Inscripción en evento cancelado

### Objetivo

Comprobar que no es posible realizar una inscripción en un evento cancelado.

### Resultado

**HTTP 400 Bad Request**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "No se puede realizar una inscripción en un evento cancelado o finalizado."
}
```

### Evidencia

![Caso 4 - Evento cancelado 400](evidencias/P7-Caso4-01-evento-cancelado-400.png)

---

## Caso 5 — Capacidad insuficiente

### Objetivo

Comprobar que la API impide una inscripción cuando la cantidad solicitada supera los cupos disponibles.

### Resultado

**HTTP 400 Bad Request**

La API informó:

```text
No hay cupos suficientes. Cupos disponibles: 1.
```

La prueba se realizó solicitando una cantidad de `2` cuando solamente había `1` cupo disponible.

### Evidencia

![Caso 5 - Capacidad insuficiente 400](evidencias/P7-Caso5-01-capacidad-insuficiente-400.png)

---

## Caso 6 — Inscripción duplicada

### Objetivo

Comprobar que un usuario no puede mantener más de una inscripción activa para el mismo evento.

### Resultado

**HTTP 400 Bad Request**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "El usuario ya tiene una inscripción activa para este evento."
}
```

### Evidencia

![Caso 6 - Inscripción duplicada 400](evidencias/P7-Caso6-01-inscripcion-duplicada-400.png)

---

## Caso 7 — Cancelación, liberación de capacidad y reinscripción

### Objetivo

Comprobar que:

1. Un ticket puede cancelarse.
2. El ticket no se elimina físicamente.
3. Se registra `cancelledAt`.
4. La cantidad reservada deja de ocupar capacidad.
5. El usuario puede volver a inscribirse posteriormente.

### 7.1 Cancelación

Se canceló un ticket de cantidad `2`.

Resultado:

**HTTP 200 OK**

El ticket permaneció almacenado con:

```json
{
  "status": "cancelled",
  "quantity": 2,
  "cancelledAt": "2026-09-26T01:06:39.179Z"
}
```

### Evidencia

![Caso 7 - Cancelación del ticket](evidencias/P7-Caso7-01-cancelacion-ticket.png)

### 7.2 Reinscripción

Después de la cancelación se realizó una nueva inscripción por `2` cupos.

Resultado:

**HTTP 201 Created**

La nueva inscripción quedó con estado:

```text
confirmed
```

Esto demuestra que los tickets cancelados no se contabilizan como capacidad ocupada.

### Evidencia

![Caso 7 - Reinscripción después de cancelar](evidencias/P7-Caso7-02-reinscripcion-tras-cancelacion.png)

---

## Caso 8 — Usuario intenta cancelar ticket ajeno

### Objetivo

Comprobar que un usuario común no puede cancelar un ticket perteneciente a otro usuario.

### Resultado

**HTTP 403 Forbidden**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "No tenés permisos para cancelar este ticket."
}
```

El ticket ajeno permaneció sin modificaciones.

### Evidencia

![Caso 8 - Cancelar ticket ajeno 403](evidencias/P7-Caso8-01-cancelar-ticket-ajeno-403.png)

---

## Caso 9 — Usuario consulta tickets de un evento sin permisos

### Objetivo

Comprobar que un usuario común no puede consultar los tickets de un evento.

### Resultado

**HTTP 403 Forbidden**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "No tenés permisos para consultar los tickets de este evento."
}
```

### Evidencia

![Caso 9 - Consulta de tickets 403](evidencias/P7-Caso9-01-user-consulta-tickets-403.png)

---

## Caso 10 — Organizador consulta tickets de otro organizador

### Objetivo

Comprobar que un organizador solamente puede consultar los tickets de sus propios eventos y no los de otro organizador.

Para esta prueba se creó específicamente el evento:

```text
P7 Caso 10 Autorizacion
```

ID:

```text
6ab723f8b1ab7cd9aa299f4f
```

El evento pertenece a `organizer.prueba`.

Posteriormente se autenticó a `organizer2.prueba` y se intentó consultar:

```http
GET /api/events/6ab723f8b1ab7cd9aa299f4f/tickets
```

### Resultado

**HTTP 403 Forbidden**

Respuesta obtenida:

```json
{
  "status": "error",
  "message": "No tenés permisos para consultar los tickets de este evento."
}
```

### Evidencia

![Caso 10 - Organizador consulta otro evento 403](evidencias/P7-Caso10-01-organizador-otro-evento-403.png)

---

# 5. Resumen de resultados

| Caso | Prueba | Resultado HTTP | Estado |
|---|---|---:|---|
| 1 | Inscripción exitosa + correo | 201 Created | Completado |
| 2 | Inscripción sin sesión | 401 Unauthorized | Completado |
| 3 | Evento inexistente | 404 Not Found | Completado |
| 4 | Evento cancelado | 400 Bad Request | Completado |
| 5 | Capacidad insuficiente | 400 Bad Request | Completado |
| 6 | Inscripción duplicada | 400 Bad Request | Completado |
| 7 | Cancelación + liberación + reinscripción | 200 / 201 | Completado |
| 8 | Cancelar ticket ajeno | 403 Forbidden | Completado |
| 9 | Usuario consulta tickets | 403 Forbidden | Completado |
| 10 | Organizador consulta otro evento | 403 Forbidden | Completado |

---

# 6. Reglas de negocio verificadas

### Capacidad

La capacidad ocupada se calcula considerando únicamente tickets que no estén cancelados.

Por lo tanto:

```text
capacidad disponible =
capacidad del evento - cantidad de tickets activos
```

Los tickets con estado `cancelled` no ocupan capacidad.

### Inscripción duplicada

Un usuario no puede mantener dos inscripciones activas para el mismo evento.

Una inscripción cancelada deja de considerarse activa y permite una nueva inscripción.

### Cancelación

La cancelación:

- Cambia el estado a `cancelled`.
- Registra `cancelledAt`.
- No elimina físicamente el ticket.
- Libera automáticamente la capacidad asociada.

### Permisos

- Un usuario autenticado puede consultar sus propios tickets.
- El propietario del evento puede consultar sus tickets.
- Un administrador puede consultar tickets.
- Un usuario común no puede consultar tickets de eventos.
- Un organizador no puede consultar tickets de eventos pertenecientes a otro organizador.
- Solo el propietario del ticket o un administrador puede cancelarlo.

---

# 7. Notificación por correo

La inscripción exitosa genera un correo de confirmación mediante Nodemailer.

El correo probado contiene:

- Nombre del evento.
- Fecha.
- Ubicación.
- Cantidad de cupos.
- Código de reserva.

La configuración SMTP utiliza variables de entorno y no credenciales escritas directamente en el código fuente.

Variables utilizadas:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Las credenciales reales se mantienen fuera del repositorio.

---

# 8. Evidencias disponibles

Las capturas correspondientes a las pruebas se encuentran en:

```text
docs/evidencias/
```

Archivos:

```text
P7-Caso1-01-evento-publicado.png
P7-Caso1-02-inscripcion-exitosa.png
P7-Caso1-03-correo-confirmacion.png
P7-Caso2-01-sin-sesion-401.png
P7-Caso3-01-evento-inexistente-404.png
P7-Caso4-01-evento-cancelado-400.png
P7-Caso5-01-capacidad-insuficiente-400.png
P7-Caso6-01-inscripcion-duplicada-400.png
P7-Caso7-01-cancelacion-ticket.png
P7-Caso7-02-reinscripcion-tras-cancelacion.png
P7-Caso8-01-cancelar-ticket-ajeno-403.png
P7-Caso9-01-user-consulta-tickets-403.png
P7-Caso10-01-organizador-otro-evento-403.png
```

---

# 9. Conclusión

Los 10 casos funcionales definidos para la Pre-entrega 7 fueron ejecutados mediante Postman y se obtuvieron las respuestas HTTP esperadas para cada escenario.

Las evidencias visuales se encuentran organizadas dentro de `docs/evidencias/` y permiten revisar individualmente las operaciones exitosas y las validaciones de seguridad, capacidad, duplicidad, cancelación y autorización.
