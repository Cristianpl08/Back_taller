# 🚀 Despliegue en Vercel - Video Segments Player API

## 📋 Requisitos Previos

1. **Cuenta de Vercel**: Regístrate en [vercel.com](https://vercel.com)
2. **Vercel CLI** (opcional): `npm i -g vercel`
3. **Git**: Tu proyecto debe estar en un repositorio Git

## 🔧 Configuración

### 1. Variables de Entorno en Vercel

Configura las siguientes variables de entorno en tu proyecto de Vercel:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_database

# JWT Secret Key
JWT_SECRET_KEY=tu_clave_secreta_super_segura

# CORS (URL de tu frontend)
FRONTEND_URL=https://tu-frontend.vercel.app

# Logs
LOG_LEVEL=info
```

### 2. Configurar Variables de Entorno

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable de entorno

## 🚀 Despliegue

### Opción 1: Despliegue Automático (Recomendado)

1. Conecta tu repositorio Git a Vercel
2. Vercel detectará automáticamente la configuración
3. Cada push a `main` desplegará automáticamente

### Opción 2: Despliegue Manual con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

## 📁 Estructura del Proyecto

```
Back_taller/
├── api/
│   └── index.py          # Punto de entrada para Vercel
├── config/               # Configuraciones
├── controllers/          # Controladores
├── models/              # Modelos
├── routes/              # Rutas
├── middleware/          # Middleware
├── utils/               # Utilidades
├── requirements.txt     # Dependencias Python
├── vercel.json         # Configuración de Vercel
├── .vercelignore       # Archivos a ignorar
└── index.py            # Versión local (desarrollo)
```

## 🔍 Verificación

Después del despliegue, verifica que tu API funcione:

```bash
# URL base de tu API
https://tu-proyecto.vercel.app/

# Endpoints disponibles
https://tu-proyecto.vercel.app/api/auth
https://tu-proyecto.vercel.app/api/projects
https://tu-proyecto.vercel.app/api/segments
```

## 🛠️ Desarrollo Local

Para desarrollo local, sigue usando:

```bash
# Usando el archivo principal
python index.py

# O usando el script de ejecución
python run.py
```

## ⚠️ Consideraciones Importantes

### 1. Base de Datos
- Asegúrate de que tu MongoDB esté accesible desde Vercel
- Usa MongoDB Atlas para mejor compatibilidad
- Configura las IPs permitidas en MongoDB Atlas

### 2. CORS
- Actualiza `FRONTEND_URL` con la URL de tu frontend desplegado
- Para desarrollo, puedes usar `http://localhost:5173`

### 3. Variables de Entorno
- **NUNCA** subas archivos `.env` al repositorio
- Usa las variables de entorno de Vercel para producción
- Mantén diferentes configuraciones para desarrollo y producción

### 4. Logs
- Los logs aparecerán en el dashboard de Vercel
- Usa `LOG_LEVEL=debug` para más información durante desarrollo

## 🔧 Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `requirements.txt`
- Asegúrate de que `vercel-python-wsgi` esté incluido

### Error: "Database connection failed"
- Verifica que `MONGODB_URI` esté configurado correctamente
- Asegúrate de que MongoDB Atlas permita conexiones desde Vercel

### Error: "CORS error"
- Verifica que `FRONTEND_URL` esté configurado correctamente
- Asegúrate de que el frontend esté desplegado y accesible

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en el dashboard de Vercel
2. Verifica la configuración de variables de entorno
3. Asegúrate de que MongoDB esté funcionando correctamente 