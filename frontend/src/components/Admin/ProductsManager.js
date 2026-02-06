import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import uploadService from '../../services/uploadService';
import './ProductsManager.css';

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    material: '',
    color: '',
    dimensions: {
      width: '',
      height: '',
      depth: ''
    },
    images: [],
    isActive: true
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      alert('Veriler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrls = editingProduct?.images || [];

      // Yeni resimler seçildiyse yükle
      if (selectedImages.length > 0) {
        imageUrls = await uploadService.uploadMultiple(selectedImages);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        material: formData.material,
        color: formData.color,
        dimensions: {
          width: parseFloat(formData.dimensions.width) || 0,
          height: parseFloat(formData.dimensions.height) || 0,
          depth: parseFloat(formData.dimensions.depth) || 0
        },
        images: imageUrls,
        isActive: formData.isActive
      };

      if (editingProduct) {
        await productService.update(editingProduct._id, productData);
        alert('Ürün başarıyla güncellendi!');
      } else {
        await productService.create(productData);
        alert('Ürün başarıyla eklendi!');
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      alert('Hata: ' + (error.response?.data?.message || 'Ürün kaydedilemedi!'));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || '',
      stock: product.stock,
      material: product.material || '',
      color: product.color || '',
      dimensions: {
        width: product.dimensions?.width || '',
        height: product.dimensions?.height || '',
        depth: product.dimensions?.depth || ''
      },
      images: product.images || [],
      isActive: product.isActive
    });
    
    const previews = product.images?.map(img => `http://localhost:5000${img}`) || [];
    setImagePreviews(previews);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await productService.delete(id);
      alert('Ürün başarıyla silindi!');
      fetchData();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      alert('Hata: ' + (error.response?.data?.message || 'Ürün silinemedi!'));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      material: '',
      color: '',
      dimensions: { width: '', height: '', depth: '' },
      images: [],
      isActive: true
    });
    setSelectedImages([]);
    setImagePreviews([]);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="products-manager">
      <div className="header-section">
        <h1>🛋️ Ürün Yönetimi</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ Yeni Ürün Ekle
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Resim</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  {product.images?.[0] && (
                    <img 
                      src={`http://localhost:5000${product.images[0]}`} 
                      alt={product.name}
                      className="product-thumb"
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name || '-'}</td>
                <td>{product.price} ₺</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(product)} className="btn-edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="no-data">
            <p>Henüz ürün eklenmemiş.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              İlk Ürünü Ekle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Ürün Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Örn: Modern Koltuk Takımı"
                  />
                </div>

                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Açıklama *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Ürün açıklaması..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stok *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Malzeme</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Örn: Ahşap, Metal"
                  />
                </div>

                <div className="form-group">
                  <label>Renk</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Örn: Beyaz, Siyah"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genişlik (cm)</label>
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, width: e.target.value }
                    })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Yükseklik (cm)</label>
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, height: e.target.value }
                    })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Derinlik (cm)</label>
                  <input
                    type="number"
                    value={formData.dimensions.depth}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, depth: e.target.value }
                    })}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  {' '}Ürün Aktif
                </label>
              </div>

              <div className="form-group">
                <label>Ürün Resimleri</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {imagePreviews.length > 0 && (
                  <div className="images-preview">
                    {imagePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                    ))}
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

export default ProductsManager;