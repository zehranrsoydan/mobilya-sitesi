import api from './api';

const productService = {
  // Tüm ürünleri getir
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Tek ürün getir
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Ürün oluştur
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Ürün güncelle
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Ürün sil
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default productService;