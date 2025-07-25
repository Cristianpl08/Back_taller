from flask import request, jsonify
from models.user import User
from config.database import get_db

def login():
    """Iniciar sesión de usuario"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        print('🔐 Intento de login iniciado')
        print('📝 Datos recibidos:', {'email': email, 'password': '***' if password else 'undefined'})

        # Validar datos requeridos
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }), 400

        # Obtener base de datos
        db = get_db()
        print(f'🗄️ Base de datos: {db.name}')
        print(f'📊 Colección users: {db.users.name}')
        
        # Buscar usuario por email
        print('🔍 Buscando usuario con email:', email)
        user = User.find_by_email(db, email)
        
        if not user:
            print('❌ Usuario no encontrado:', email)
            return jsonify({
                'success': False,
                'message': 'Credenciales inválidas'
            }), 401

        print('✅ Usuario encontrado:', {
            '_id': str(user._id),
            'username': user.username,
            'email': user.email,
            'passwordStored': '***' if user.password else 'undefined'
        })

        # Verificar contraseña sin encriptar
        print('🔐 Verificando contraseña...')
        print('📝 Contraseña recibida:', password)
        print('📝 Contraseña almacenada:', user.password)
        
        if user.password != password:
            print('❌ Contraseña incorrecta')
            print('🔍 Comparación:', {
                'received': password,
                'stored': user.password,
                'match': user.password == password
            })
            return jsonify({
                'success': False,
                'message': 'Credenciales inválidas'
            }), 401

        print('✅ Contraseña correcta - Login exitoso')

        # Respuesta exitosa
        response = {
            'success': True,
            'message': 'Login exitoso',
            'data': {
                'user': user.to_response_dict()
            }
        }

        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response)

    except Exception as error:
        print('💥 Error en login:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al iniciar sesión'
        }), 500

def register():
    """Registrar un nuevo usuario"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        print('📝 Intento de registro iniciado')
        print('📋 Datos recibidos:', {
            'username': username, 
            'email': email, 
            'password': '***' if password else 'undefined'
        })

        # Validar datos requeridos
        if not username or not email or not password:
            return jsonify({
                'success': False,
                'message': 'Username, email y contraseña son requeridos'
            }), 400

        # Obtener base de datos
        db = get_db()

        # Verificar si el usuario ya existe
        print('🔍 Verificando si username ya existe:', username)
        existing_user = User.find_by_username(db, username)
        if existing_user:
            print('❌ Usuario ya existe:', username)
            return jsonify({
                'success': False,
                'message': 'El username ya está registrado'
            }), 400

        # Verificar si el email ya existe
        print('🔍 Verificando si email ya existe:', email)
        existing_email = User.find_by_email(db, email)
        if existing_email:
            print('❌ Email ya existe:', email)
            return jsonify({
                'success': False,
                'message': 'El email ya está registrado'
            }), 400

        print('✅ Usuario y email disponibles, creando nuevo usuario')

        # Crear nuevo usuario
        user = User(username=username, email=email, password=password)

        print('💾 Guardando usuario en la base de datos...')
        user.save(db)
        print('✅ Usuario guardado exitosamente:', {
            '_id': str(user._id),
            'username': user.username,
            'email': user.email
        })

        # Respuesta exitosa
        response = {
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'data': {
                'user': user.to_response_dict()
            }
        }

        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response), 201

    except Exception as error:
        print('💥 Error en registro:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al registrar usuario'
        }), 500 