import api from './api';

const categoryService = {
  // Tüm kategorileri getir
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Tek kategori getir
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Kategori oluştur
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Kategori güncelle
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Kategori sil
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;