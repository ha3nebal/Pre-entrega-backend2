# Pre-entrega1-backend2

## Descripción

API REST desarrollada con Node.js y Express para la gestión de eventos.

Este proyecto corresponde a la **Pre-entrega 1** del curso **Backend** de **Coderhouse**. La aplicación está organizada mediante una arquitectura por capas, preparada para incorporar autenticación, persistencia con MongoDB y nuevas funcionalidades en las siguientes entregas.

---

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript (ES Modules)
- dotenv
- Mongoose

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ha3nebal/Pre-entrega1-backend2.git
```

Ingresar al directorio del proyecto:

```bash
cd Pre-entrega1-backend2
```

Instalar las dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/eventos
JWT_SECRET=tu_clave_secreta
```

También se incluye un archivo `.env.example` como referencia.

---

## Ejecución del proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

---

## Estructura del proyecto

```
src
│
├── app.js
├── server.js
│
├── config
│   ├── db.js
│   └── env.js
│
├── controllers
│   ├── events.controller.js
│   └── sessions.controller.js
│
├── services
│   ├── events.service.js
│   └── sessions.service.js
│
├── repositories
│   ├── event.repository.js
│   └── user.repository.js
│
├── dao
│   ├── EventDAO.js
│   └── UserDAO.js
│
├── models
│   ├── Event.js
│   └── User.js
│
├── routes
│   ├── events.router.js
│   └── sessions.router.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
│
└── utils
    ├── constants.js
    └── logger.js
```

---

## Arquitectura

El proyecto utiliza una arquitectura por capas para facilitar el mantenimiento y la escalabilidad.

```
Routes
   │
Controllers
   │
Services
   │
Repositories
   │
DAO
   │
MongoDB (Mongoose)
```

---

## Rutas disponibles

### GET /api/health

Verifica que el servidor se encuentre en funcionamiento.

**Respuesta**

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

### GET /api/events

Obtiene la lista de eventos registrados.

**Respuesta**

```json
{
  "status": "success",
  "payload": []
}
```

---

### GET /api/sessions

Ruta base del módulo de sesiones.

**Respuesta**

```json
{
  "status": "success",
  "message": "Módulo de sesiones preparado."
}
```

---

## Estado del proyecto

Actualmente esta versión incluye:

- Arquitectura por capas.
- Configuración de Express.
- Variables de entorno mediante dotenv.
- Modelos base con Mongoose.
- Preparación para persistencia con MongoDB.
- Estructura inicial para autenticación y manejo de sesiones.

Las próximas entregas incorporarán autenticación con JWT, Passport, persistencia completa en MongoDB y nuevas funcionalidades para la gestión de eventos.