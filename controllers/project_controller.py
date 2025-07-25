from flask import request, jsonify
from models.project import Project
from config.database import get_db

def get_projects():
    """Obtener todos los proyectos"""
    try:
        print('🎬 Obteniendo todos los proyectos')
        
        # Obtener base de datos
        db = get_db()
        
        # Obtener todos los proyectos
        projects = Project.find_all(db)
        
        print(f'✅ Proyectos encontrados: {len(projects)}')
        
        # Convertir a formato de respuesta
        projects_data = [project.to_response_dict() for project in projects]
        
        response = {
            'success': True,
            'message': 'Proyectos obtenidos exitosamente',
            'data': {
                'projects': projects_data,
                'count': len(projects_data)
            }
        }
        
        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response)
        
    except Exception as error:
        print('💥 Error al obtener proyectos:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al obtener proyectos'
        }), 500

def get_project(project_id):
    """Obtener un proyecto por ID"""
    try:
        print(f'🎬 Obteniendo proyecto con ID: {project_id}')
        
        # Obtener base de datos
        db = get_db()
        
        # Buscar proyecto
        project = Project.find_by_id(db, project_id)
        
        if not project:
            print(f'❌ Proyecto no encontrado: {project_id}')
            return jsonify({
                'success': False,
                'message': 'Proyecto no encontrado'
            }), 404
        
        print(f'✅ Proyecto encontrado: {project_id}')
        
        response = {
            'success': True,
            'message': 'Proyecto obtenido exitosamente',
            'data': {
                'project': project.to_response_dict()
            }
        }
        
        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response)
        
    except Exception as error:
        print('💥 Error al obtener proyecto:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al obtener proyecto'
        }), 500

def create_project():
    """Crear un nuevo proyecto"""
    try:
        data = request.get_json()
        video = data.get('video')
        
        print('🎬 Creando nuevo proyecto')
        print('📋 Datos recibidos:', {'video': video})

        # Validar datos requeridos
        if not video:
            return jsonify({
                'success': False,
                'message': 'La URL del video es requerida'
            }), 400

        # Obtener base de datos
        db = get_db()

        # Crear nuevo proyecto
        project = Project(video=video)
        
        print('💾 Guardando proyecto en la base de datos...')
        project.save(db)
        print('✅ Proyecto guardado exitosamente:', {
            '_id': str(project._id),
            'video': project.video
        })

        # Respuesta exitosa
        response = {
            'success': True,
            'message': 'Proyecto creado exitosamente',
            'data': {
                'project': project.to_response_dict()
            }
        }

        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response), 201

    except Exception as error:
        print('💥 Error al crear proyecto:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al crear proyecto'
        }), 500

def update_project(project_id):
    """Actualizar un proyecto"""
    try:
        data = request.get_json()
        video = data.get('video')
        
        print(f'🎬 Actualizando proyecto con ID: {project_id}')
        print('📋 Datos recibidos:', {'video': video})

        # Validar datos requeridos
        if not video:
            return jsonify({
                'success': False,
                'message': 'La URL del video es requerida'
            }), 400

        # Obtener base de datos
        db = get_db()

        # Buscar proyecto
        project = Project.find_by_id(db, project_id)
        
        if not project:
            print(f'❌ Proyecto no encontrado: {project_id}')
            return jsonify({
                'success': False,
                'message': 'Proyecto no encontrado'
            }), 404

        # Actualizar proyecto
        project.video = video
        
        print('💾 Guardando cambios en la base de datos...')
        project.save(db)
        print('✅ Proyecto actualizado exitosamente:', {
            '_id': str(project._id),
            'video': project.video
        })

        # Respuesta exitosa
        response = {
            'success': True,
            'message': 'Proyecto actualizado exitosamente',
            'data': {
                'project': project.to_response_dict()
            }
        }

        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response)

    except Exception as error:
        print('💥 Error al actualizar proyecto:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al actualizar proyecto'
        }), 500

def delete_project(project_id):
    """Eliminar un proyecto"""
    try:
        print(f'🎬 Eliminando proyecto con ID: {project_id}')
        
        # Obtener base de datos
        db = get_db()

        # Buscar proyecto
        project = Project.find_by_id(db, project_id)
        
        if not project:
            print(f'❌ Proyecto no encontrado: {project_id}')
            return jsonify({
                'success': False,
                'message': 'Proyecto no encontrado'
            }), 404

        # Eliminar proyecto
        print('🗑️ Eliminando proyecto de la base de datos...')
        project.delete(db)
        print('✅ Proyecto eliminado exitosamente:', project_id)

        # Respuesta exitosa
        response = {
            'success': True,
            'message': 'Proyecto eliminado exitosamente',
            'data': {
                'project_id': project_id
            }
        }

        print('📤 Enviando respuesta exitosa:', response)
        return jsonify(response)

    except Exception as error:
        print('💥 Error al eliminar proyecto:', str(error))
        return jsonify({
            'success': False,
            'message': 'Error al eliminar proyecto'
        }), 500 