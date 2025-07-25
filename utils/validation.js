/**
 * Utilidades de validación comunes
 */

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar formato de URL
 * @param {string} url - URL a validar
 * @returns {boolean} - True si es válido
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar formato de ID de MongoDB
 * @param {string} id - ID a validar
 * @returns {boolean} - True si es válido
 */
const isValidMongoId = (id) => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(id);
};

/**
 * Validar longitud de string
 * @param {string} str - String a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} - True si es válido
 */
const isValidLength = (str, min, max) => {
  if (typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
};

/**
 * Validar número en rango
 * @param {number} num - Número a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} - True si es válido
 */
const isValidNumberRange = (num, min, max) => {
  const number = Number(num);
  return !isNaN(number) && number >= min && number <= max;
};

/**
 * Validar tiempo de video (en segundos)
 * @param {number} time - Tiempo a validar
 * @returns {boolean} - True si es válido
 */
const isValidVideoTime = (time) => {
  return isValidNumberRange(time, 0, 86400); // Máximo 24 horas
};

/**
 * Validar array de tags
 * @param {Array} tags - Array de tags a validar
 * @param {number} maxTags - Número máximo de tags
 * @returns {boolean} - True si es válido
 */
const isValidTagsArray = (tags, maxTags = 10) => {
  if (!Array.isArray(tags)) return false;
  if (tags.length > maxTags) return false;
  
  return tags.every(tag => 
    typeof tag === 'string' && 
    tag.trim().length > 0 && 
    tag.trim().length <= 20
  );
};

/**
 * Sanitizar string (remover caracteres peligrosos)
 * @param {string} str - String a sanitizar
 * @returns {string} - String sanitizado
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
};

/**
 * Validar formato de fecha
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} - True si es válido
 */
const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validar formato de tiempo (HH:MM:SS)
 * @param {string} time - Tiempo a validar
 * @returns {boolean} - True si es válido
 */
const isValidTimeFormat = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Convertir segundos a formato HH:MM:SS
 * @param {number} seconds - Segundos a convertir
 * @returns {string} - Tiempo formateado
 */
const secondsToTimeFormat = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convertir formato HH:MM:SS a segundos
 * @param {string} timeFormat - Tiempo en formato HH:MM:SS
 * @returns {number} - Segundos
 */
const timeFormatToSeconds = (timeFormat) => {
  const [hours, minutes, seconds] = timeFormat.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Validar objeto de escena
 * @param {Object} scene - Objeto de escena a validar
 * @returns {Object} - Resultado de la validación
 */
const validateScene = (scene) => {
  const errors = [];

  if (!scene.title || !isValidLength(scene.title, 1, 100)) {
    errors.push('El título de la escena debe tener entre 1 y 100 caracteres');
  }

  if (typeof scene.startTime !== 'number' || !isValidVideoTime(scene.startTime)) {
    errors.push('El tiempo de inicio de la escena debe ser un número válido');
  }

  if (typeof scene.endTime !== 'number' || !isValidVideoTime(scene.endTime)) {
    errors.push('El tiempo de fin de la escena debe ser un número válido');
  }

  if (scene.startTime >= scene.endTime) {
    errors.push('El tiempo de fin debe ser mayor al tiempo de inicio');
  }

  if (scene.description && !isValidLength(scene.description, 0, 500)) {
    errors.push('La descripción de la escena no puede exceder 500 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validar array de escenas
 * @param {Array} scenes - Array de escenas a validar
 * @returns {Object} - Resultado de la validación
 */
const validateScenesArray = (scenes) => {
  if (!Array.isArray(scenes)) {
    return {
      isValid: false,
      errors: ['Las escenas deben ser un array']
    };
  }

  const errors = [];

  for (let i = 0; i < scenes.length; i++) {
    const sceneValidation = validateScene(scenes[i]);
    if (!sceneValidation.isValid) {
      errors.push(`Escena ${i + 1}: ${sceneValidation.errors.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isValidUrl,
  isValidMongoId,
  isValidLength,
  isValidNumberRange,
  isValidVideoTime,
  isValidTagsArray,
  sanitizeString,
  isValidDate,
  isValidTimeFormat,
  secondsToTimeFormat,
  timeFormatToSeconds,
  validateScene,
  validateScenesArray
}; 