const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB');
  
  try {
    // Obtener la colección directamente
    const collection = db.collection('segments');
    
    // Obtener todos los documentos existentes
    const existingSegments = await collection.find({}).toArray();
    
    console.log(`📊 Encontrados ${existingSegments.length} segmentos para migrar`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const oldSegment of existingSegments) {
      try {
        // Crear nuevo documento con la estructura correcta
        const newSegment = {
          title: oldSegment.description ? oldSegment.description.substring(0, 100) : 'Segmento sin título',
          description: oldSegment.description || '',
          videoUrl: 'https://example.com/video.mp4', // URL por defecto
          startTime: oldSegment.start || 0,
          endTime: oldSegment.end || 0,
          duration: oldSegment.duration || 0,
          createdBy: new mongoose.Types.ObjectId(), // ID por defecto
          isPublic: true,
          tags: [],
          views: 0,
          likes: 0,
          // Campos adicionales del segmento original
          prosody: oldSegment.prosody || '',
          prosody2: oldSegment.prosody2 || '',
          createdAt: oldSegment._id ? new Date(parseInt(oldSegment._id.toString().substring(0, 8), 16) * 1000) : new Date(),
          updatedAt: new Date()
        };
        
        // Insertar el nuevo documento
        await collection.insertOne(newSegment);
        
        // Eliminar el documento antiguo
        await collection.deleteOne({ _id: oldSegment._id });
        
        migratedCount++;
        console.log(`✅ Migrado segmento ${migratedCount}/${existingSegments.length}`);
        
      } catch (error) {
        console.error(`❌ Error migrando segmento:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Migración completada:`);
    console.log(`✅ Segmentos migrados: ${migratedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}); 