const bcrypt = require('bcryptjs');

/**
 * Hash de contraseña con salt
 * @param {string} password - Contraseña en texto plano
 * @param {number} saltRounds - Número de rondas de salt (default: 12)
 * @returns {Promise<string>} - Contraseña hasheada
 */
const hashPassword = async (password, saltRounds = 12) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear contraseña');
  }
};

/**
 * Comparar contraseña con hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña hasheada
 * @returns {Promise<boolean>} - True si coinciden
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

/**
 * Generar salt
 * @param {number} saltRounds - Número de rondas de salt (default: 12)
 * @returns {Promise<string>} - Salt generado
 */
const generateSalt = async (saltRounds = 12) => {
  try {
    return await bcrypt.genSalt(saltRounds);
  } catch (error) {
    throw new Error('Error al generar salt');
  }
};

/**
 * Verificar si una contraseña cumple con los requisitos de seguridad
 * @param {string} password - Contraseña a verificar
 * @returns {Object} - Resultado de la validación
 */
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
  }

  if (!hasUpperCase) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!hasLowerCase) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!hasNumbers) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!hasSpecialChar) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: calculatePasswordScore(password, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar)
  };
};

/**
 * Calcular puntuación de seguridad de la contraseña
 * @param {string} password - Contraseña
 * @param {boolean} hasUpperCase - Tiene mayúsculas
 * @param {boolean} hasLowerCase - Tiene minúsculas
 * @param {boolean} hasNumbers - Tiene números
 * @param {boolean} hasSpecialChar - Tiene caracteres especiales
 * @returns {number} - Puntuación de 0 a 100
 */
const calculatePasswordScore = (password, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar) => {
  let score = 0;

  // Longitud
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;

  // Complejidad
  if (hasUpperCase) score += 15;
  if (hasLowerCase) score += 15;
  if (hasNumbers) score += 15;
  if (hasSpecialChar) score += 15;

  // Variedad de caracteres
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;

  return Math.min(score, 100);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateSalt,
  validatePasswordStrength,
  calculatePasswordScore
}; 