#!/usr/bin/env python3
"""
Script de inicio alternativo para Railway
Carga variables de entorno desde .env si existe
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env si existe
load_dotenv()

# Verificar variables críticas
print("🔍 Verificando configuración para Railway...")
print("=" * 50)

mongodb_uri = os.environ.get('MONGODB_URI')
jwt_secret = os.environ.get('JWT_SECRET_KEY')
flask_env = os.environ.get('FLASK_ENV', 'production')
port = os.environ.get('PORT', '5000')

print(f"🗄️ MongoDB URI: {'✅ Configurada' if mongodb_uri else '❌ NO CONFIGURADA'}")
print(f"🔐 JWT Secret: {'✅ Configurada' if jwt_secret else '❌ NO CONFIGURADA'}")
print(f"🌍 Environment: {flask_env}")
print(f"📡 Port: {port}")

if not mongodb_uri:
    print("\n❌ ERROR: MONGODB_URI no está configurada!")
    print("🔧 Configura en Railway:")
    print("MONGODB_URI=mongodb+srv://test:Camilo97@testad.htu4tut.mongodb.net/testad?retryWrites=true&w=majority&appName=testad")
    exit(1)

if not jwt_secret:
    print("\n❌ ERROR: JWT_SECRET_KEY no está configurada!")
    print("🔧 Configura en Railway:")
    print("JWT_SECRET_KEY=tu-clave-secreta-super-segura-aqui-2024")
    exit(1)

print("\n✅ Configuración correcta! Iniciando aplicación...")
print("=" * 50)

# Importar y ejecutar la aplicación
from index import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(port), debug=False) 