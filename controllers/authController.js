const User = require('../models/User');
const { generateToken } = require('../config/auth');

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      name,
      password
    });

    await user.save();

    // Generar token JWT
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Iniciar sesión de usuario
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email (incluyendo password para comparación)
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token JWT
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Verificar token y obtener información del usuario
 * GET /api/auth/verify
 */
const verifyToken = async (req, res) => {
  try {
    // El middleware de autenticación ya verificó el token
    // y agregó el usuario al req.user
    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: req.user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error en verificación de token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Renovar token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    // Generar nuevo token con la información del usuario actual
    const token = generateToken({
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role
    });

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token
      }
    });

  } catch (error) {
    console.error('Error al renovar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al renovar token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cerrar sesión (manejo en frontend)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // En una implementación más avanzada, podrías agregar el token a una blacklist
    // Por ahora, el logout se maneja en el frontend eliminando el token
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Solicitar restablecimiento de contraseña
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email existe, se enviará un enlace de restablecimiento'
      });
    }

    // Aquí implementarías la lógica para enviar email
    // Por ahora, solo simulamos el envío
    
    res.json({
      success: true,
      message: 'Si el email existe, se enviará un enlace de restablecimiento'
    });

  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Restablecer contraseña
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Aquí implementarías la lógica para verificar el token de reset
    // y actualizar la contraseña
    
    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword
}; 