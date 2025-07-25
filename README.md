# Video Segments Player - Backend API

Backend completo para la aplicación de reproductor de segmentos de video, desarrollado con Node.js, Express, MongoDB y JWT.

## 🚀 Características

- **Autenticación JWT** con bcrypt para contraseñas
- **CRUD completo** para segmentos de video
- **Gestión de usuarios** con perfiles y estadísticas
- **Sistema de escenas** dentro de los segmentos
- **Búsqueda y filtros** avanzados
- **Paginación** para listas grandes
- **Validación robusta** de datos de entrada
- **Manejo de errores** centralizado
- **CORS configurado** para frontend React
- **Logs y monitoreo** para debugging

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **MongoDB** (versión 4.4 o superior)
- **npm** o **yarn**

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd video-segments-player-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/video-segments-player

# JWT
JWT_SECRET=tu-clave-secreta-super-segura-aqui-cambiala-en-produccion
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173

# Logs
LOG_LEVEL=info
```

### 4. Iniciar MongoDB

Asegúrate de que MongoDB esté corriendo en tu sistema:

```bash
# En macOS con Homebrew
brew services start mongodb-community

# En Ubuntu/Debian
sudo systemctl start mongod

# En Windows
net start MongoDB
```

### 5. Ejecutar migración de datos

```bash
npm run migrate
```

Esto creará:
- Usuario administrador: `admin@example.com` / `Admin123!`
- Usuario de prueba: `test@example.com` / `Test123!`
- 5 segmentos de ejemplo con escenas

### 6. Iniciar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📚 Documentación de la API

### Base URL
```
http://localhost:5000/api
```

### Autenticación

Todas las rutas protegidas requieren el header de autorización:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "password": "Contraseña123!"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "Contraseña123!"
}
```

#### Verificar Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

### Endpoints de Usuarios

#### Obtener Perfil
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "email": "nuevo@email.com"
}
```

#### Cambiar Contraseña
```http
PUT /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "ContraseñaActual123!",
  "newPassword": "NuevaContraseña123!"
}
```

### Endpoints de Segmentos

#### Obtener Todos los Segmentos
```http
GET /segments?page=1&limit=10&search=react&tags=javascript,react&sort=createdAt&order=desc
```

#### Obtener Segmento por ID
```http
GET /segments/:id
```

#### Crear Segmento
```http
POST /segments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mi Segmento",
  "description": "Descripción del segmento",
  "videoUrl": "https://ejemplo.com/video.mp4",
  "startTime": 0,
  "endTime": 120,
  "scenes": [
    {
      "title": "Escena 1",
      "startTime": 0,
      "endTime": 30,
      "description": "Descripción de la escena"
    }
  ],
  "tags": ["javascript", "react"],
  "isPublic": true
}
```

#### Actualizar Segmento
```http
PUT /segments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título Actualizado",
  "description": "Nueva descripción"
}
```

#### Eliminar Segmento
```http
DELETE /segments/:id
Authorization: Bearer <token>
```

#### Mis Segmentos
```http
GET /segments/my-segments?page=1&limit=10
Authorization: Bearer <token>
```

#### Buscar Segmentos
```http
GET /segments/search?q=react&page=1&limit=10
```

#### Segmentos Populares
```http
GET /segments/popular?limit=10
```

#### Segmentos Recientes
```http
GET /segments/recent?limit=10
```

#### Dar Like
```http
POST /segments/:id/like
Authorization: Bearer <token>
```

#### Quitar Like
```http
POST /segments/:id/unlike
Authorization: Bearer <token>
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test

# Migración de datos
npm run migrate
```

## 📊 Estructura de Datos

### Usuario
```javascript
{
  _id: ObjectId,
  email: String (único),
  name: String,
  password: String (hasheada),
  role: String (enum: 'user', 'admin'),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Segmento
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  videoUrl: String,
  startTime: Number,
  endTime: Number,
  duration: Number,
  scenes: [{
    _id: ObjectId,
    title: String,
    startTime: Number,
    endTime: Number,
    description: String
  }],
  createdBy: ObjectId (ref: User),
  isPublic: Boolean,
  tags: [String],
  views: Number,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Seguridad

- **Contraseñas hasheadas** con bcrypt (12 salt rounds)
- **JWT tokens** con expiración configurable
- **Validación de datos** con express-validator
- **CORS configurado** para el frontend
- **Helmet** para headers de seguridad
- **Sanitización** de datos de entrada

## 🚨 Manejo de Errores

La API devuelve respuestas consistentes:

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["Error específico 1", "Error específico 2"]
}
```

### Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## 🔍 Búsqueda y Filtros

### Parámetros de Consulta

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10, max: 100)
- `search` - Búsqueda por texto en título y descripción
- `tags` - Filtro por tags (separados por coma)
- `sort` - Campo de ordenamiento (title, createdAt, views, likes, duration)
- `order` - Orden (asc, desc)

### Ejemplos

```bash
# Búsqueda con filtros
GET /segments?search=react&tags=javascript,frontend&sort=views&order=desc

# Paginación
GET /segments?page=2&limit=20

# Segmentos de un usuario específico
GET /segments?userId=507f1f77bcf86cd799439011
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📈 Monitoreo y Logs

- **Morgan** para logs de HTTP
- **Logs estructurados** para debugging
- **Manejo de errores** centralizado
- **Métricas básicas** de rendimiento

## 🚀 Deployment

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Consideraciones de Producción

1. **Cambiar JWT_SECRET** por una clave segura
2. **Configurar MongoDB** en la nube (Atlas, etc.)
3. **Configurar CORS** para el dominio de producción
4. **Habilitar compresión** y optimizaciones
5. **Configurar logs** para monitoreo
6. **Implementar rate limiting**
7. **Configurar SSL/TLS**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔄 Changelog

### v1.0.0
- Implementación inicial del backend
- Sistema de autenticación JWT
- CRUD completo para segmentos
- Sistema de escenas
- Búsqueda y filtros
- Paginación
- Validación robusta
- Documentación completa 