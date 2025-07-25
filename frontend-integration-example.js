/**
 * Ejemplo de integración del frontend con el backend
 * Este archivo muestra cómo actualizar el authService.js del frontend
 * para usar las APIs del nuevo backend
 */

// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Clase para manejar las llamadas a la API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Configurar headers para las peticiones
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
  }

  // Actualizar token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Limpiar token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

// Instancia global del servicio API
const apiService = new ApiService();

/**
 * Servicio de Autenticación actualizado
 * Reemplaza el authService.js existente
 */
class AuthService {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await apiService.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        apiService.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Error en el registro');
    }
  }

  // Login de usuario
  async login(credentials) {
    try {
      const response = await apiService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success) {
        apiService.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Error en el login');
    }
  }

  // Verificar token
  async verifyToken() {
    try {
      const response = await apiService.request('/auth/verify');
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Logout
  logout() {
    apiService.clearToken();
    localStorage.removeItem('user');
  }

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!apiService.token;
  }
}

/**
 * Servicio de Segmentos
 * Nuevo servicio para manejar segmentos
 */
class SegmentService {
  // Obtener todos los segmentos
  async getAllSegments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/segments${queryString ? `?${queryString}` : ''}`;
    
    return await apiService.request(endpoint);
  }

  // Obtener segmento por ID
  async getSegmentById(id) {
    return await apiService.request(`/segments/${id}`);
  }

  // Crear nuevo segmento
  async createSegment(segmentData) {
    return await apiService.request('/segments', {
      method: 'POST',
      body: JSON.stringify(segmentData),
    });
  }

  // Actualizar segmento
  async updateSegment(id, segmentData) {
    return await apiService.request(`/segments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(segmentData),
    });
  }

  // Eliminar segmento
  async deleteSegment(id) {
    return await apiService.request(`/segments/${id}`, {
      method: 'DELETE',
    });
  }

  // Obtener mis segmentos
  async getMySegments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/segments/my-segments${queryString ? `?${queryString}` : ''}`;
    
    return await apiService.request(endpoint);
  }

  // Buscar segmentos
  async searchSegments(query, params = {}) {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/segments/search?${queryString}`;
    
    return await apiService.request(endpoint);
  }

  // Obtener segmentos populares
  async getPopularSegments(limit = 10) {
    return await apiService.request(`/segments/popular?limit=${limit}`);
  }

  // Obtener segmentos recientes
  async getRecentSegments(limit = 10) {
    return await apiService.request(`/segments/recent?limit=${limit}`);
  }

  // Dar like a un segmento
  async likeSegment(id) {
    return await apiService.request(`/segments/${id}/like`, {
      method: 'POST',
    });
  }

  // Quitar like de un segmento
  async unlikeSegment(id) {
    return await apiService.request(`/segments/${id}/unlike`, {
      method: 'POST',
    });
  }
}

/**
 * Servicio de Usuarios
 * Nuevo servicio para manejar perfiles de usuario
 */
class UserService {
  // Obtener perfil del usuario
  async getProfile() {
    return await apiService.request('/users/profile');
  }

  // Actualizar perfil
  async updateProfile(userData) {
    return await apiService.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    return await apiService.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Obtener estadísticas del usuario
  async getUserStats() {
    return await apiService.request('/users/stats');
  }

  // Eliminar cuenta
  async deleteAccount() {
    return await apiService.request('/users/profile', {
      method: 'DELETE',
    });
  }
}

// Instancias de los servicios
const authService = new AuthService();
const segmentService = new SegmentService();
const userService = new UserService();

// Exportar servicios para uso en el frontend
export {
  authService,
  segmentService,
  userService,
  apiService
};

/**
 * Ejemplos de uso en componentes React
 */

// Ejemplo de uso en un componente de login
/*
import { authService } from './services/api';

const LoginComponent = () => {
  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        // Redirigir al dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      // Mostrar error al usuario
      setError(error.message);
    }
  };
};
*/

// Ejemplo de uso en un componente de segmentos
/*
import { segmentService } from './services/api';

const SegmentsComponent = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await segmentService.getAllSegments({
          page: 1,
          limit: 10,
          sort: 'createdAt',
          order: 'desc'
        });
        
        if (response.success) {
          setSegments(response.data.segments);
        }
      } catch (error) {
        console.error('Error fetching segments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  const handleCreateSegment = async (segmentData) => {
    try {
      const response = await segmentService.createSegment(segmentData);
      if (response.success) {
        // Actualizar lista de segmentos
        fetchSegments();
      }
    } catch (error) {
      console.error('Error creating segment:', error);
    }
  };
};
*/

// Ejemplo de interceptor para manejar tokens expirados
/*
// Agregar al inicio de la aplicación
const setupAuthInterceptor = () => {
  // Verificar token al cargar la app
  const token = localStorage.getItem('token');
  if (token) {
    authService.verifyToken().catch(() => {
      // Token inválido, limpiar datos
      authService.logout();
    });
  }
};

// Llamar en el componente principal
useEffect(() => {
  setupAuthInterceptor();
}, []);
*/ 