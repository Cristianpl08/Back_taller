const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateUpdateProfile } = require('../middleware/validation');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de perfil
router.get('/profile', userController.getProfile);
router.put('/profile', validateUpdateProfile, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

// Rutas adicionales
router.put('/change-password', userController.changePassword);
router.get('/stats', userController.getUserStats);
router.put('/deactivate', userController.deactivateAccount);
router.put('/reactivate', userController.reactivateAccount);

module.exports = router; 