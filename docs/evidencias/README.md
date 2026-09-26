# Evidencias Pre-entrega 7

Este directorio contiene las capturas de pantalla utilizadas como evidencia de las pruebas funcionales de la Pre-entrega 7 — inscripción a eventos, tickets, capacidad, cancelaciones y permisos.

## Caso 1 — Inscripción exitosa y correo de confirmación

### 1.1 Evento publicado
![Caso 1 - Evento publicado](P7-Caso1-01-evento-publicado.png)

### 1.2 Inscripción exitosa
![Caso 1 - Inscripción exitosa](P7-Caso1-02-inscripcion-exitosa.png)

### 1.3 Correo de confirmación recibido
![Caso 1 - Correo de confirmación](P7-Caso1-03-correo-confirmacion.png)

---

## Caso 2 — Registro sin sesión

**Resultado esperado:** HTTP 401 Unauthorized.

![Caso 2 - Sin sesión 401](P7-Caso2-01-sin-sesion-401.png)

---

## Caso 3 — Evento inexistente

**Resultado esperado:** HTTP 404 Not Found.

![Caso 3 - Evento inexistente 404](P7-Caso3-01-evento-inexistente-404.png)

---

## Caso 4 — Inscripción en evento cancelado

**Resultado esperado:** HTTP 400 Bad Request.

![Caso 4 - Evento cancelado 400](P7-Caso4-01-evento-cancelado-400.png)

---

## Caso 5 — Capacidad insuficiente

**Resultado esperado:** HTTP 400 Bad Request.

![Caso 5 - Capacidad insuficiente 400](P7-Caso5-01-capacidad-insuficiente-400.png)

---

## Caso 6 — Inscripción duplicada

**Resultado esperado:** HTTP 400 Bad Request.

![Caso 6 - Inscripción duplicada 400](P7-Caso6-01-inscripcion-duplicada-400.png)

---

## Caso 7 — Cancelación y reinscripción

### 7.1 Cancelación del ticket

La cancelación mantiene el ticket registrado con estado `cancelled` y registra `cancelledAt`.

![Caso 7 - Cancelación del ticket](P7-Caso7-01-cancelacion-ticket.png)

### 7.2 Reinscripción después de cancelar

La nueva inscripción genera un ticket confirmado, demostrando que el cupo liberado puede volver a utilizarse.

![Caso 7 - Reinscripción](P7-Caso7-02-reinscripcion-tras-cancelacion.png)

---

## Caso 8 — Usuario intenta cancelar ticket ajeno

**Resultado esperado:** HTTP 403 Forbidden.

![Caso 8 - Cancelar ticket ajeno 403](P7-Caso8-01-cancelar-ticket-ajeno-403.png)

---

## Caso 9 — Usuario consulta tickets de un evento

**Resultado esperado:** HTTP 403 Forbidden para un usuario que no posee permisos de organizador/admin.

![Caso 9 - Consulta de tickets 403](P7-Caso9-01-user-consulta-tickets-403.png)

---

## Caso 10 — Organizador consulta tickets de otro organizador

**Resultado esperado:** HTTP 403 Forbidden.

![Caso 10 - Otro organizador 403](P7-Caso10-01-organizador-otro-evento-403.png)

---

## Resumen de evidencias

| Caso | Prueba | Resultado |
|---|---|---|
| 1 | Inscripción exitosa y correo | 201 Created |
| 2 | Sin sesión | 401 Unauthorized |
| 3 | Evento inexistente | 404 Not Found |
| 4 | Evento cancelado | 400 Bad Request |
| 5 | Capacidad insuficiente | 400 Bad Request |
| 6 | Inscripción duplicada | 400 Bad Request |
| 7 | Cancelación y reinscripción | 200 OK / 201 Created |
| 8 | Cancelar ticket ajeno | 403 Forbidden |
| 9 | Usuario consulta tickets | 403 Forbidden |
| 10 | Organizador consulta otro evento | 403 Forbidden |
