const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Segment = require('../models/Segment');

// Datos de ejemplo para migración
const sampleSegments = [
  {
    title: "Introducción al Desarrollo Web",
    description: "Un segmento introductorio sobre los fundamentos del desarrollo web moderno",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    startTime: 0,
    endTime: 120,
    scenes: [
      {
        title: "Bienvenida",
        startTime: 0,
        endTime: 30,
        description: "Introducción al curso"
      },
      {
        title: "¿Qué es el desarrollo web?",
        startTime: 30,
        endTime: 90,
        description: "Conceptos básicos del desarrollo web"
      },
      {
        title: "Herramientas necesarias",
        startTime: 90,
        endTime: 120,
        description: "Herramientas y software requerido"
      }
    ],
    tags: ["desarrollo", "web", "introducción", "programación"],
    isPublic: true
  },
  {
    title: "React Fundamentals",
    description: "Aprende los conceptos fundamentales de React.js",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    startTime: 0,
    endTime: 180,
    scenes: [
      {
        title: "¿Qué es React?",
        startTime: 0,
        endTime: 45,
        description: "Introducción a React.js"
      },
      {
        title: "Componentes",
        startTime: 45,
        endTime: 120,
        description: "Creación y uso de componentes"
      },
      {
        title: "Props y State",
        startTime: 120,
        endTime: 180,
        description: "Manejo de props y estado"
      }
    ],
    tags: ["react", "javascript", "frontend", "componentes"],
    isPublic: true
  },
  {
    title: "Node.js Backend Development",
    description: "Desarrollo de APIs con Node.js y Express",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    startTime: 0,
    endTime: 240,
    scenes: [
      {
        title: "Configuración del proyecto",
        startTime: 0,
        endTime: 60,
        description: "Inicialización y configuración"
      },
      {
        title: "Creación de rutas",
        startTime: 60,
        endTime: 150,
        description: "Definición de endpoints"
      },
      {
        title: "Conexión a base de datos",
        startTime: 150,
        endTime: 240,
        description: "Integración con MongoDB"
      }
    ],
    tags: ["nodejs", "express", "backend", "api", "mongodb"],
    isPublic: true
  },
  {
    title: "CSS Grid y Flexbox",
    description: "Técnicas modernas de layout con CSS",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    startTime: 0,
    endTime: 150,
    scenes: [
      {
        title: "Flexbox básico",
        startTime: 0,
        endTime: 50,
        description: "Conceptos básicos de Flexbox"
      },
      {
        title: "Grid Layout",
        startTime: 50,
        endTime: 120,
        description: "CSS Grid para layouts complejos"
      },
      {
        title: "Combinando ambas técnicas",
        startTime: 120,
        endTime: 150,
        description: "Uso combinado de Flexbox y Grid"
      }
    ],
    tags: ["css", "flexbox", "grid", "layout", "diseño"],
    isPublic: true
  },
  {
    title: "JavaScript ES6+ Features",
    description: "Características modernas de JavaScript",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    startTime: 0,
    endTime: 200,
    scenes: [
      {
        title: "Arrow Functions",
        startTime: 0,
        endTime: 40,
        description: "Sintaxis de funciones flecha"
      },
      {
        title: "Destructuring",
        startTime: 40,
        endTime: 100,
        description: "Desestructuración de objetos y arrays"
      },
      {
        title: "Async/Await",
        startTime: 100,
        endTime: 160,
        description: "Manejo asíncrono moderno"
      },
      {
        title: "Modules",
        startTime: 160,
        endTime: 200,
        description: "Sistema de módulos ES6"
      }
    ],
    tags: ["javascript", "es6", "modern", "async", "modules"],
    isPublic: true
  }
];

/**
 * Conectar a la base de datos
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/video-segments-player');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Crear usuario administrador por defecto
 */
const createDefaultAdmin = async () => {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('👤 Usuario administrador ya existe');
      return existingAdmin;
    }

    const adminUser = new User({
      email: 'admin@example.com',
      name: 'Administrador',
      password: 'Admin123!',
      role: 'admin'
    });

    await adminUser.save();
    console.log('👤 Usuario administrador creado');
    return adminUser;
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    throw error;
  }
};

/**
 * Crear usuario de prueba
 */
const createTestUser = async () => {
  try {
    // Verificar si ya existe un usuario de prueba
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('👤 Usuario de prueba ya existe');
      return existingUser;
    }

    const testUser = new User({
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      password: 'Test123!',
      role: 'user'
    });

    await testUser.save();
    console.log('👤 Usuario de prueba creado');
    return testUser;
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
    throw error;
  }
};

/**
 * Migrar segmentos de ejemplo
 */
const migrateSegments = async (adminUser, testUser) => {
  try {
    // Verificar si ya existen segmentos
    const existingSegments = await Segment.countDocuments();
    if (existingSegments > 0) {
      console.log(`📹 Ya existen ${existingSegments} segmentos en la base de datos`);
      return;
    }

    console.log('📹 Iniciando migración de segmentos...');

    // Crear segmentos alternando entre admin y usuario de prueba
    const users = [adminUser, testUser];
    let userIndex = 0;

    for (const segmentData of sampleSegments) {
      const segment = new Segment({
        ...segmentData,
        createdBy: users[userIndex % users.length]._id
      });

      await segment.save();
      console.log(`✅ Segmento creado: ${segment.title}`);
      userIndex++;
    }

    console.log(`🎉 Migración completada. ${sampleSegments.length} segmentos creados`);
  } catch (error) {
    console.error('❌ Error en migración de segmentos:', error);
    throw error;
  }
};

/**
 * Función principal de migración
 */
const runMigration = async () => {
  try {
    console.log('🚀 Iniciando migración de datos...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Crear usuarios por defecto
    const adminUser = await createDefaultAdmin();
    const testUser = await createTestUser();
    
    // Migrar segmentos
    await migrateSegments(adminUser, testUser);
    
    console.log('✅ Migración completada exitosamente');
    console.log('\n📋 Resumen:');
    console.log('- Usuario administrador: admin@example.com / Admin123!');
    console.log('- Usuario de prueba: test@example.com / Test123!');
    console.log(`- Segmentos creados: ${sampleSegments.length}`);
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('📊 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar migración si el script se ejecuta directamente
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 