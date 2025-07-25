const Segment = require('../models/Segment');

/**
 * Obtener todos los segmentos con paginación y filtros
 * GET /api/segments
 */
const getAllSegments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      sort = 'createdAt',
      order = 'desc',
      userId
    } = req.query;

    // Construir filtros
    const filters = { isPublic: true };
    
    if (search) {
      filters.$text = { $search: search };
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filters.tags = { $in: tagArray };
    }
    
    if (userId) {
      filters.createdBy = userId;
    }

    // Construir opciones de consulta
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: order === 'desc' ? -1 : 1 },
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    };

    // Realizar consulta con paginación
    const segments = await Segment.paginate(filters, options);

    res.json({
      success: true,
      message: 'Segmentos obtenidos exitosamente',
      data: {
        segments: segments.docs,
        pagination: {
          page: segments.page,
          limit: segments.limit,
          totalDocs: segments.totalDocs,
          totalPages: segments.totalPages,
          hasNextPage: segments.hasNextPage,
          hasPrevPage: segments.hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener segmentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener segmentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener segmento por ID
 * GET /api/segments/:id
 */
const getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segmento no encontrado'
      });
    }

    // Verificar si el usuario puede ver el segmento
    if (!segment.isPublic && (!req.user || segment.createdBy._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    // Incrementar vistas si el usuario no es el creador
    if (req.user && segment.createdBy._id.toString() !== req.user._id.toString()) {
      await segment.incrementViews();
    }

    res.json({
      success: true,
      message: 'Segmento obtenido exitosamente',
      data: {
        segment
      }
    });

  } catch (error) {
    console.error('Error al obtener segmento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener segmento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Crear nuevo segmento
 * POST /api/segments
 */
const createSegment = async (req, res) => {
  try {
    const segmentData = {
      ...req.body,
      createdBy: req.user._id
    };

    const segment = new Segment(segmentData);
    await segment.save();

    // Poblar información del creador
    await segment.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Segmento creado exitosamente',
      data: {
        segment
      }
    });

  } catch (error) {
    console.error('Error al crear segmento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear segmento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Actualizar segmento
 * PUT /api/segments/:id
 */
const updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segmento no encontrado'
      });
    }

    // Verificar permisos
    if (segment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este segmento'
      });
    }

    // Actualizar segmento
    const updatedSegment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Segmento actualizado exitosamente',
      data: {
        segment: updatedSegment
      }
    });

  } catch (error) {
    console.error('Error al actualizar segmento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar segmento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Eliminar segmento
 * DELETE /api/segments/:id
 */
const deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segmento no encontrado'
      });
    }

    // Verificar permisos
    if (segment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este segmento'
      });
    }

    await Segment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Segmento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar segmento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar segmento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener segmentos del usuario actual
 * GET /api/segments/my-segments
 */
const getMySegments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: order === 'desc' ? -1 : 1 },
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    };

    const segments = await Segment.paginate(
      { createdBy: req.user._id },
      options
    );

    res.json({
      success: true,
      message: 'Mis segmentos obtenidos exitosamente',
      data: {
        segments: segments.docs,
        pagination: {
          page: segments.page,
          limit: segments.limit,
          totalDocs: segments.totalDocs,
          totalPages: segments.totalPages,
          hasNextPage: segments.hasNextPage,
          hasPrevPage: segments.hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener mis segmentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mis segmentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Dar like a un segmento
 * POST /api/segments/:id/like
 */
const likeSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segmento no encontrado'
      });
    }

    await segment.incrementLikes();

    res.json({
      success: true,
      message: 'Like agregado exitosamente',
      data: {
        likes: segment.likes
      }
    });

  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al dar like',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Quitar like de un segmento
 * POST /api/segments/:id/unlike
 */
const unlikeSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segmento no encontrado'
      });
    }

    await segment.decrementLikes();

    res.json({
      success: true,
      message: 'Like removido exitosamente',
      data: {
        likes: segment.likes
      }
    });

  } catch (error) {
    console.error('Error al quitar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al quitar like',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Buscar segmentos por texto
 * GET /api/segments/search
 */
const searchSegments = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { score: { $meta: 'textScore' } },
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    };

    const segments = await Segment.paginate(
      { 
        $text: { $search: q },
        isPublic: true 
      },
      options
    );

    res.json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: {
        segments: segments.docs,
        pagination: {
          page: segments.page,
          limit: segments.limit,
          totalDocs: segments.totalDocs,
          totalPages: segments.totalPages,
          hasNextPage: segments.hasNextPage,
          hasPrevPage: segments.hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener segmentos populares
 * GET /api/segments/popular
 */
const getPopularSegments = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const segments = await Segment.find({ isPublic: true })
      .sort({ views: -1, likes: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Segmentos populares obtenidos exitosamente',
      data: {
        segments
      }
    });

  } catch (error) {
    console.error('Error al obtener segmentos populares:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener segmentos populares',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener segmentos recientes
 * GET /api/segments/recent
 */
const getRecentSegments = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const segments = await Segment.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Segmentos recientes obtenidos exitosamente',
      data: {
        segments
      }
    });

  } catch (error) {
    console.error('Error al obtener segmentos recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener segmentos recientes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  getMySegments,
  likeSegment,
  unlikeSegment,
  searchSegments,
  getPopularSegments,
  getRecentSegments
}; 