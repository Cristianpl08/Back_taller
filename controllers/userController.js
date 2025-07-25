const User = require('../models/User');

/**
 * Obtener perfil del usuario actual
 * GET /api/users/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Actualizar perfil del usuario
 * PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    // Solo actualizar campos que se proporcionen
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    // Si se está actualizando el email, verificar que no exista
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: updatedUser.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Eliminar cuenta del usuario
 * DELETE /api/users/profile
 */
const deleteProfile = async (req, res) => {
  try {
    // Eliminar usuario
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cuenta',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cambiar contraseña
 * PUT /api/users/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Obtener usuario con contraseña para verificación
    const user = await User.findById(req.user._id).select('+password');

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener estadísticas del usuario
 * GET /api/users/stats
 */
const getUserStats = async (req, res) => {
  try {
    // Aquí podrías agregar lógica para obtener estadísticas del usuario
    // como número de segmentos creados, vistas totales, etc.
    
    const stats = {
      segmentsCreated: 0,
      totalViews: 0,
      totalLikes: 0,
      memberSince: req.user.createdAt
    };

    res.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Desactivar cuenta (soft delete)
 * PUT /api/users/deactivate
 */
const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({
      success: true,
      message: 'Cuenta desactivada exitosamente'
    });

  } catch (error) {
    console.error('Error al desactivar cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar cuenta',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Reactivar cuenta
 * PUT /api/users/reactivate
 */
const reactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: true });

    res.json({
      success: true,
      message: 'Cuenta reactivada exitosamente'
    });

  } catch (error) {
    console.error('Error al reactivar cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reactivar cuenta',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  getUserStats,
  deactivateAccount,
  reactivateAccount
}; 