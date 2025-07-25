const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Por favor ingresa un email válido')
    .normalizeEmail(),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'),
  handleValidationErrors
];

/**
 * Validaciones para login de usuario
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Por favor ingresa un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

/**
 * Validaciones para actualización de perfil de usuario
 */
const validateUpdateProfile = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Por favor ingresa un email válido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'),
  handleValidationErrors
];

/**
 * Validaciones para creación de segmento
 */
const validateCreateSegment = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres')
    .trim()
    .escape(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres')
    .trim()
    .escape(),
  body('videoUrl')
    .isURL()
    .withMessage('La URL del video debe ser válida')
    .trim(),
  body('startTime')
    .isFloat({ min: 0 })
    .withMessage('El tiempo de inicio debe ser un número mayor o igual a 0'),
  body('endTime')
    .isFloat({ min: 0 })
    .withMessage('El tiempo de fin debe ser un número mayor o igual a 0')
    .custom((value, { req }) => {
      if (value <= req.body.startTime) {
        throw new Error('El tiempo de fin debe ser mayor al tiempo de inicio');
      }
      return true;
    }),
  body('scenes')
    .optional()
    .isArray()
    .withMessage('Las escenas deben ser un array'),
  body('scenes.*.title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El título de la escena debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),
  body('scenes.*.startTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El tiempo de inicio de la escena debe ser un número mayor o igual a 0'),
  body('scenes.*.endTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El tiempo de fin de la escena debe ser un número mayor o igual a 0'),
  body('scenes.*.description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción de la escena no puede exceder 500 caracteres')
    .trim()
    .escape(),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('No se pueden tener más de 10 tags'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Cada tag debe tener entre 1 y 20 caracteres')
    .trim()
    .escape(),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano'),
  handleValidationErrors
];

/**
 * Validaciones para actualización de segmento
 */
const validateUpdateSegment = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres')
    .trim()
    .escape(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres')
    .trim()
    .escape(),
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('La URL del video debe ser válida')
    .trim(),
  body('startTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El tiempo de inicio debe ser un número mayor o igual a 0'),
  body('endTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El tiempo de fin debe ser un número mayor o igual a 0'),
  body('scenes')
    .optional()
    .isArray()
    .withMessage('Las escenas deben ser un array'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('No se pueden tener más de 10 tags'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano'),
  handleValidationErrors
];

/**
 * Validaciones para parámetros de ID
 */
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
  handleValidationErrors
];

/**
 * Validaciones para consultas de búsqueda
 */
const validateSearchQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),
  query('tags')
    .optional()
    .isString()
    .withMessage('Los tags deben ser una cadena de texto'),
  query('sort')
    .optional()
    .isIn(['title', 'createdAt', 'views', 'likes', 'duration'])
    .withMessage('Ordenamiento inválido'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Orden inválido'),
  handleValidationErrors
];

/**
 * Validaciones para paginación
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateCreateSegment,
  validateUpdateSegment,
  validateId,
  validateSearchQuery,
  validatePagination
}; 