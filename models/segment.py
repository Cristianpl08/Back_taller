from datetime import datetime
from bson import ObjectId

class Segment:
    def __init__(self, start_time, end_time, project_id, prosody=None, prosody2=None, 
                 description=None, descriptions_prosody=None, views=0, likes=0, 
                 _id=None, created_at=None, updated_at=None):
        self._id = _id
        self.start_time = start_time
        self.end_time = end_time
        self.duration = end_time - start_time
        self.views = views
        self.likes = likes
        self.prosody = prosody
        self.prosody2 = prosody2
        self.description = description
        self.descriptions_prosody = descriptions_prosody or []
        self.project_id = project_id
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def to_dict(self):
        """Convertir a diccionario para MongoDB"""
        data = {
            'start_time': self.start_time,
            'end_time': self.end_time,
            'duration': self.duration,
            'views': self.views,
            'likes': self.likes,
            'prosody': self.prosody,
            'prosody2': self.prosody2,
            'description': self.description,
            'descriptions_prosody': self.descriptions_prosody,
            'project_id': ObjectId(self.project_id) if isinstance(self.project_id, str) else self.project_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        if self._id:
            data['_id'] = self._id
        return data
    
    @classmethod
    def from_dict(cls, data):
        """Crear instancia desde diccionario de MongoDB"""
        return cls(
            _id=data.get('_id'),
            start_time=data.get('start_time'),
            end_time=data.get('end_time'),
            project_id=data.get('project_id'),
            prosody=data.get('prosody'),
            prosody2=data.get('prosody2'),
            description=data.get('description'),
            descriptions_prosody=data.get('descriptions_prosody', []),
            views=data.get('views', 0),
            likes=data.get('likes', 0),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )
    
    @classmethod
    def find_by_id(cls, db, segment_id):
        """Buscar segmento por ID"""
        try:
            segment_data = db.segments.find_one({'_id': ObjectId(segment_id)})
            if segment_data:
                return cls.from_dict(segment_data)
        except:
            pass
        return None
    
    @classmethod
    def find_by_project(cls, db, project_id):
        """Buscar segmentos por proyecto"""
        try:
            segments_data = db.segments.find({'project_id': ObjectId(project_id)})
            return [cls.from_dict(data) for data in segments_data]
        except:
            return []
    
    @classmethod
    def find_all(cls, db):
        """Obtener todos los segmentos"""
        segments_data = db.segments.find()
        return [cls.from_dict(data) for data in segments_data]
    
    def save(self, db):
        """Guardar segmento en la base de datos"""
        # Recalcular duración
        self.duration = self.end_time - self.start_time
        
        if self._id:
            # Actualizar
            self.updated_at = datetime.now()
            result = db.segments.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Crear nuevo
            self.created_at = datetime.now()
            self.updated_at = datetime.now()
            result = db.segments.insert_one(self.to_dict())
            self._id = result.inserted_id
            return True
    
    def delete(self, db):
        """Eliminar segmento de la base de datos"""
        if self._id:
            result = db.segments.delete_one({'_id': self._id})
            return result.deleted_count > 0
        return False
    
    def increment_views(self, db):
        """Incrementar contador de vistas"""
        if self._id:
            result = db.segments.update_one(
                {'_id': self._id},
                {'$inc': {'views': 1}}
            )
            if result.modified_count > 0:
                self.views += 1
            return result.modified_count > 0
        return False
    
    def increment_likes(self, db):
        """Incrementar contador de likes"""
        if self._id:
            result = db.segments.update_one(
                {'_id': self._id},
                {'$inc': {'likes': 1}}
            )
            if result.modified_count > 0:
                self.likes += 1
            return result.modified_count > 0
        return False
    
    def to_response_dict(self):
        """Convertir a diccionario para respuesta"""
        return {
            '_id': str(self._id),
            'start_time': self.start_time,
            'end_time': self.end_time,
            'duration': self.duration,
            'views': self.views,
            'likes': self.likes,
            'prosody': self.prosody,
            'prosody2': self.prosody2,
            'description': self.description,
            'descriptions_prosody': self.descriptions_prosody,
            'project_id': str(self.project_id),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 