import api from './api';

const authService = {
  // Admin girişi
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Çıkış yap
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  // Token doğrula
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  // Giriş durumu kontrol
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Admin bilgisini al
  getAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
};

export default authService;
