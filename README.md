# Proyecto Eventos

## Descripción

API REST desarrollada para gestionar eventos.

Este proyecto corresponde a la Pre-entrega 1 del curso Backend de Coderhouse.

## Tecnologías

- Node.js
- Express
- JavaScript
- dotenv
- ES Modules

## Instalación

```bash
git clone <repositorio>

cd proyecto-eventos

npm install
```

## Variables de entorno

Crear un archivo .env con:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/eventos
JWT_SECRET=tu_clave
```

## Ejecutar

Modo producción

```bash
npm start
```

Modo desarrollo

```bash
npm run dev
```

## Estructura

```
src
│
├── app.js
├── server.js
├── config
├── routes
├── controllers
├── services
├── repositories
├── dao
├── models
├── middlewares
└── utils
```

## Rutas disponibles

GET /api/health

Respuesta:

```json
{
    "status":"ok",
    "message":"Servidor activo"
}
```

GET /api/events

Respuesta:

```json
{
    "status":"success",
    "payload":[]
}
```

GET /api/sessions

Respuesta:

```json
{
    "status":"success",
    "message":"Módulo de sesiones preparado."
}
```