const express = require('express');
const router = express.Router();

const segmentController = require('../controllers/segmentController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { 
  validateCreateSegment, 
  validateUpdateSegment, 
  validateId, 
  validateSearchQuery,
  validatePagination 
} = require('../middleware/validation');

// Rutas públicas (con autenticación opcional)
router.get('/', validatePagination, optionalAuth, segmentController.getAllSegments);
router.get('/popular', segmentController.getPopularSegments);
router.get('/recent', segmentController.getRecentSegments);
router.get('/search', validateSearchQuery, segmentController.searchSegments);
router.get('/:id', validateId, optionalAuth, segmentController.getSegmentById);

// Rutas protegidas
router.use(authenticateToken);

// CRUD de segmentos
router.post('/', validateCreateSegment, segmentController.createSegment);
router.put('/:id', validateId, validateUpdateSegment, segmentController.updateSegment);
router.delete('/:id', validateId, segmentController.deleteSegment);

// Rutas adicionales
router.get('/my-segments', validatePagination, segmentController.getMySegments);
router.post('/:id/like', validateId, segmentController.likeSegment);
router.post('/:id/unlike', validateId, segmentController.unlikeSegment);

module.exports = router; 