import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const uploadService = {
  // Tek resim yükle
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/upload/single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.imageUrl;
  },

  // Çoklu resim yükle
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.imageUrls;
  }
};

export default uploadService;