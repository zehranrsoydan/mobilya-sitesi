import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import uploadService from '../../services/uploadService';
import './CategoriesManager.css';

function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Kategori çekme hatası:', error);
      alert('Kategoriler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingCategory?.image || '';

      // Yeni resim seçildiyse yükle
      if (formData.image) {
        imageUrl = await uploadService.uploadSingle(formData.image);
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        image: imageUrl
      };

      if (editingCategory) {
        // Güncelleme
        await categoryService.update(editingCategory._id, categoryData);
        alert('Kategori başarıyla güncellendi!');
      } else {
        // Yeni ekleme
        await categoryService.create(categoryData);
        alert('Kategori başarıyla eklendi!');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Kategori kaydetme hatası:', error);
      alert('Hata: ' + (error.response?.data?.message || 'Kategori kaydedilemedi!'));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null
    });
    setImagePreview(category.image ? `http://localhost:5000${category.image}` : '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await categoryService.delete(id);
      alert('Kategori başarıyla silindi!');
      fetchCategories();
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      alert('Hata: ' + (error.response?.data?.message || 'Kategori silinemedi!'));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: null });
    setImagePreview('');
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="categories-manager">
      <div className="header-section">
        <h1>📁 Kategori Yönetimi</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ Yeni Kategori Ekle
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category._id} className="category-item">
            {category.image && (
              <img 
                src={`http://localhost:5000${category.image}`} 
                alt={category.name}
              />
            )}
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <div className="actions">
              <button onClick={() => handleEdit(category)} className="btn-edit">
                ✏️ Düzenle
              </button>
              <button onClick={() => handleDelete(category._id)} className="btn-delete">
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="no-data">
          <p>Henüz kategori eklenmemiş.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            İlk Kategoriyi Ekle
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Kategori Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Örn: Koltuklar"
                />
              </div>

              <div className="form-group">
                <label>Açıklama *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Kategori açıklaması..."
                />
              </div>

              <div className="form-group">
                <label>Kategori Resmi</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  İptal
                </button>
                <button type="submit" disabled={uploading} className="btn-submit">
                  {uploading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManager;