const mongoose = require('mongoose');
require('mongoose-paginate-v2');

// Schema para las escenas dentro de un segmento
const sceneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la escena es requerido'],
    trim: true,
    maxlength: [100, 'El título de la escena no puede exceder 100 caracteres']
  },
  startTime: {
    type: Number,
    required: [true, 'El tiempo de inicio de la escena es requerido'],
    min: [0, 'El tiempo de inicio debe ser mayor o igual a 0']
  },
  endTime: {
    type: Number,
    required: [true, 'El tiempo de fin de la escena es requerido'],
    min: [0, 'El tiempo de fin debe ser mayor o igual a 0']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción de la escena no puede exceder 500 caracteres']
  }
}, {
  _id: true,
  timestamps: false
});

// Validación personalizada para verificar que endTime > startTime en escenas
sceneSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    return next(new Error('El tiempo de fin debe ser mayor al tiempo de inicio'));
  }
  next();
});

const segmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del segmento es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  videoUrl: {
    type: String,
    required: [true, 'La URL del video es requerida'],
    trim: true,
    validate: {
      validator: function(v) {
        // Validación básica de URL
        const urlPattern = /^https?:\/\/.+/;
        return urlPattern.test(v);
      },
      message: 'La URL del video debe ser válida'
    }
  },
  startTime: {
    type: Number,
    required: [true, 'El tiempo de inicio es requerido'],
    min: [0, 'El tiempo de inicio debe ser mayor o igual a 0']
  },
  endTime: {
    type: Number,
    required: [true, 'El tiempo de fin es requerido'],
    min: [0, 'El tiempo de fin debe ser mayor o igual a 0']
  },
  duration: {
    type: Number,
    default: function() {
      return this.endTime - this.startTime;
    }
  },
  scenes: {
    type: [sceneSchema],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador del segmento es requerido']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10; // Máximo 10 tags
      },
      message: 'No se pueden tener más de 10 tags'
    }
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Las vistas no pueden ser negativas']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Los likes no pueden ser negativos']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
segmentSchema.index({ title: 'text', description: 'text' });
segmentSchema.index({ createdBy: 1 });
segmentSchema.index({ createdAt: -1 });
segmentSchema.index({ isPublic: 1 });
segmentSchema.index({ tags: 1 });

// Virtual para calcular la duración
segmentSchema.virtual('durationInSeconds').get(function() {
  return this.endTime - this.startTime;
});

// Virtual para formatear la duración
segmentSchema.virtual('formattedDuration').get(function() {
  const duration = this.endTime - this.startTime;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Método para incrementar vistas
segmentSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para incrementar likes
segmentSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Método para decrementar likes
segmentSchema.methods.decrementLikes = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Método para agregar escena
segmentSchema.methods.addScene = function(sceneData) {
  this.scenes.push(sceneData);
  return this.save();
};

// Método para remover escena
segmentSchema.methods.removeScene = function(sceneId) {
  this.scenes = this.scenes.filter(scene => scene._id.toString() !== sceneId.toString());
  return this.save();
};

// Método estático para buscar segmentos públicos
segmentSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).populate('createdBy', 'name email');
};

// Método estático para buscar por usuario
segmentSchema.statics.findByUser = function(userId) {
  return this.find({ createdBy: userId }).populate('createdBy', 'name email');
};

// Método estático para buscar por tags
segmentSchema.statics.findByTags = function(tags) {
  return this.find({ 
    tags: { $in: tags },
    isPublic: true 
  }).populate('createdBy', 'name email');
};

// Middleware pre-save para validar tiempos
segmentSchema.pre('save', function(next) {
  // Validar que endTime > startTime
  if (this.endTime <= this.startTime) {
    return next(new Error('El tiempo de fin debe ser mayor al tiempo de inicio'));
  }

  // Validar que las escenas estén dentro del rango del segmento
  for (let scene of this.scenes) {
    if (scene.startTime < this.startTime || scene.endTime > this.endTime) {
      return next(new Error('Las escenas deben estar dentro del rango del segmento'));
    }
  }

  // Calcular duración
  this.duration = this.endTime - this.startTime;
  
  next();
});

// Middleware pre-remove para limpiar referencias
segmentSchema.pre('remove', function(next) {
  // Aquí podrías agregar lógica para limpiar referencias en otras colecciones
  next();
});

// Agregar plugin de paginación
segmentSchema.plugin(require('mongoose-paginate-v2'));

module.exports = mongoose.model('Segment', segmentSchema); 