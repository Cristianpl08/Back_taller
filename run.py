#!/usr/bin/env python3
"""
Script de ejecución para el backend de Flask
Video Segments Player Backend
"""

import os
import sys
from index import app

if __name__ == '__main__':
    print("🔍 DEBUG: Verificando variables de entorno...")
    print(f"🔍 MONGODB_URI: {os.environ.get('MONGODB_URI', 'NO CONFIGURADA')}")
    print(f"🔍 JWT_SECRET_KEY: {os.environ.get('JWT_SECRET_KEY', 'NO CONFIGURADA')}")
    print(f"🔍 FLASK_ENV: {os.environ.get('FLASK_ENV', 'NO CONFIGURADA')}")
    print(f"🔍 PORT: {os.environ.get('PORT', 'NO CONFIGURADA')}")
    print("=" * 50)
    
    # Configurar variables de entorno por defecto si no existen
    if not os.environ.get('MONGODB_URI'):
        print("⚠️ ADVERTENCIA: MONGODB_URI no está configurada!")
        print("🔧 Configurando MongoDB local por defecto...")
        os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/video-segments-player'
    
    if not os.environ.get('PORT'):
        os.environ['PORT'] = '5000'
    
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'production'
    
    if not os.environ.get('JWT_SECRET_KEY'):
        print("⚠️ ADVERTENCIA: JWT_SECRET_KEY no está configurada!")
        os.environ['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
    
    # Obtener puerto
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Iniciando Video Segments Player Backend (Flask)")
    print(f"📡 Puerto: {port}")
    print(f"🌍 Ambiente: {os.environ.get('FLASK_ENV', 'production')}")
    print(f"🗄️ MongoDB: {os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/video-segments-player')}")
    print("=" * 50)
    
    # Verificar si estamos usando MongoDB local en producción
    if os.environ.get('FLASK_ENV') == 'production' and 'localhost' in os.environ.get('MONGODB_URI', ''):
        print("❌ ERROR: Estás usando MongoDB local en producción!")
        print("🔧 Configura MONGODB_URI en Railway con tu conexión de MongoDB Atlas")
        print("📝 Ejemplo: mongodb+srv://usuario:password@cluster.mongodb.net/database")
        print("\n🔍 Verifica en Railway:")
        print("1. Ve a tu proyecto → Variables")
        print("2. Asegúrate de que MONGODB_URI esté configurada")
        print("3. El valor debe ser tu conexión de MongoDB Atlas")
        sys.exit(1)
    
    try:
        # En producción, no usar debug mode
        debug_mode = os.environ.get('FLASK_ENV') == 'development'
        app.run(host='0.0.0.0', port=port, debug=debug_mode)
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        sys.exit(1) 