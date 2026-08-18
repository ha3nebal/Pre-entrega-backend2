# Pre-entrega Backend 2


## Descripción


API REST desarrollada con Node.js y Express para la gestión de eventos y usuarios.


Este proyecto corresponde a la **Pre-entrega 2** del curso **Backend** de **Coderhouse**.


La aplicación utiliza una arquitectura por capas, separando rutas, controladores, servicios, repositorios, DAO y modelos. En esta entrega se incorpora el registro seguro de usuarios mediante validación, normalización de email, hash de contraseñas con bcrypt y persistencia en MongoDB Atlas.


---


## Tecnologías utilizadas


- Node.js
- Express
- JavaScript (ES Modules)
- dotenv
- Mongoose
- MongoDB Atlas
- bcrypt
- Postman para pruebas de la API


---


## Instalación


Clonar el repositorio:


```bash
git clone https://github.com/ha3nebal/Pre-entrega1-backend2.git

Ingresar al directorio del proyecto:

cd Pre-entrega1-backend2

Instalar las dependencias:

npm install
Variables de entorno

Crear un archivo .env en la raíz del proyecto.

El archivo debe contener:

PORT=8080
NODE_ENV=development
MONGO_URL=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta

La variable MONGO_URL debe contener la cadena de conexión proporcionada por MongoDB Atlas.

También se incluye un archivo .env.example como referencia.

Importante: el archivo .env contiene información sensible y no debe subirse al repositorio.

Ejecución del proyecto
Modo desarrollo
npm run dev
Modo producción
npm start

El servidor se ejecuta utilizando el puerto definido en la variable de entorno PORT.

Por defecto:

http://localhost:8080
Estructura del proyecto
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
    ├── logger.js
    ├── hash.js
    └── response.js
Arquitectura

El proyecto utiliza una arquitectura por capas para facilitar el mantenimiento, la reutilización del código y la escalabilidad.

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

Las funciones auxiliares reutilizables se encuentran en utils/, incluyendo el helper encargado del hash de contraseñas mediante bcrypt.

Rutas disponibles
GET /api/health

Verifica que el servidor se encuentre en funcionamiento.

Respuesta
{
  "status": "ok",
  "message": "Servidor activo"
}
GET /api/events

Obtiene la lista de eventos registrados.

Respuesta
{
  "status": "success",
  "payload": []
}
GET /api/sessions

Ruta base del módulo de sesiones.

Respuesta
{
  "status": "success",
  "message": "Módulo de sesiones preparado."
}
Registro de usuarios
POST /api/sessions/register

Registra un nuevo usuario en MongoDB Atlas.

El endpoint valida los datos recibidos, normaliza el email, verifica que no exista previamente, genera un hash seguro de la contraseña mediante bcrypt y guarda el usuario utilizando Mongoose.

Body
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
Campos requeridos
Campo	Descripción
first_name	Nombre del usuario
last_name	Apellido del usuario
email	Email válido
password	Contraseña de mínimo 8 caracteres

El campo role no se recibe desde el body público del registro.

Los usuarios registrados reciben automáticamente:

role: "user"

Los roles permitidos por el modelo son:

user
organizer
admin
Normalización del email

El email se normaliza antes de almacenarse:

Se eliminan espacios al inicio y al final.
Se convierte a minúsculas.

Por ejemplo:

Ana@Mail.com 

se almacena como:

ana@mail.com
Seguridad de la contraseña

La contraseña nunca se almacena en texto plano.

Antes de guardar el usuario en MongoDB Atlas, la contraseña es procesada mediante bcrypt.

Ejemplo del valor almacenado:

$2b$10$...

La contraseña tampoco se incluye en la respuesta del endpoint.

Respuesta exitosa

HTTP 201 Created

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

La respuesta no contiene el campo password.

Campos faltantes

HTTP 400 Bad Request

Ejemplo:

{
  "first_name": "Ana",
  "email": "ana@mail.com",
  "password": "Secreta123"
}

Respuesta:

{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
Email inválido

HTTP 400 Bad Request

Ejemplo:

{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana-mail",
  "password": "Secreta123"
}

Respuesta:

{
  "status": "error",
  "message": "El formato del email no es válido"
}
Email ya registrado

HTTP 409 Conflict

Si el email ya existe en la base de datos:

{
  "status": "error",
  "message": "El email ya está registrado"
}
Persistencia

La aplicación utiliza MongoDB Atlas como sistema de persistencia.

Mongoose se utiliza como ODM para definir los modelos y realizar las operaciones sobre MongoDB.

El modelo User contiene:

first_name
last_name
email
password
role

El modelo Event contiene:

title
description
date
location
capacity
Pruebas realizadas

Antes de entregar se deben comprobar los siguientes casos:

Registro exitoso de un usuario.
Registro con campos faltantes.
Registro con email inválido.
Registro con email previamente registrado.
Verificación de que la contraseña se almacena hasheada en MongoDB Atlas.
Verificación de que la contraseña no aparece en la respuesta del endpoint.
Verificación de que el email se almacena normalizado.
Verificación de que el rol se asigna automáticamente como user.

Las pruebas de los endpoints se realizan mediante Postman.

Estado del proyecto

Actualmente esta versión incluye:

Arquitectura REST por capas.
Configuración de Express.
Uso de módulos ES Modules.
Variables de entorno mediante dotenv.
Conexión con MongoDB Atlas mediante Mongoose.
Modelo User con roles y validaciones básicas.
Modelo Event.
DAO y Repository para usuarios y eventos.
CRUD de eventos.
Registro de usuarios.
Validación de datos del registro.
Normalización de email.
Hash de contraseñas mediante bcrypt.
Prevención de registros con emails duplicados.
Respuesta de registro sin contraseña.
Middleware de manejo de errores.
Estructura preparada para autenticación.

Las próximas entregas incorporarán nuevas funcionalidades de autenticación y autorización, incluyendo login, JWT, manejo de sesiones y protección de rutas.