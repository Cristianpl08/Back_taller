from flask import Blueprint
from controllers.project_controller import (
    get_projects, get_project, create_project, 
    update_project, delete_project
)
from config.jwt_config import token_required

# Crear blueprint para proyectos
projects_bp = Blueprint('projects', __name__)

# Rutas de proyectos
@projects_bp.route('/', methods=['GET'])
@token_required
def get_projects_route():
    """Obtener todos los proyectos"""
    return get_projects()

@projects_bp.route('/<project_id>', methods=['GET'])
@token_required
def get_project_route(project_id):
    """Obtener un proyecto por ID"""
    return get_project(project_id)

@projects_bp.route('/', methods=['POST'])
@token_required
def create_project_route():
    """Crear un nuevo proyecto"""
    return create_project()

@projects_bp.route('/<project_id>', methods=['PUT'])
@token_required
def update_project_route(project_id):
    """Actualizar un proyecto"""
    return update_project(project_id)

@projects_bp.route('/<project_id>', methods=['DELETE'])
@token_required
def delete_project_route(project_id):
    """Eliminar un proyecto"""
    return delete_project(project_id) 