from flask import Blueprint
from controllers.auth_controller import login, register

# Crear blueprint para autenticación
auth_bp = Blueprint('auth', __name__)

# Rutas de autenticación
@auth_bp.route('/login', methods=['POST'])
def login_route():
    """Iniciar sesión de usuario"""
    return login()

@auth_bp.route('/register', methods=['POST'])
def register_route():
    """Registrar un nuevo usuario"""
    return register() 