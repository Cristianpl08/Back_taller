#!/usr/bin/env python3
"""
Script de ejecución para el backend de Flask
Video Segments Player Backend
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Configurar variables de entorno por defecto si no existen
    if not os.environ.get('MONGODB_URI'):
        os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/video-segments-player'
    
    if not os.environ.get('PORT'):
        os.environ['PORT'] = '5000'
    
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    # Obtener puerto
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Iniciando Video Segments Player Backend (Flask)")
    print(f"📡 Puerto: {port}")
    print(f"🌍 Ambiente: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"🗄️ MongoDB: {os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/video-segments-player')}")
    print("=" * 50)
    
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        sys.exit(1) 