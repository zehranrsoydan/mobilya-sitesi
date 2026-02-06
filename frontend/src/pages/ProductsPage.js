import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import './ProductsPage.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Kategori çekme hatası:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters);
      setProducts(data);
    } catch (error) {
      console.error('Ürün çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // URL'i güncelle
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const handleWhatsApp = (product) => {
    const message = `Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`;
    const phone = '905388733737'; // Buraya WhatsApp numaranızı yazın
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="products-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">🪑 Mobilya Mağazası</Link>
          <nav className="nav">
            <Link to="/">Ana Sayfa</Link>
            <Link to="/products">Ürünler</Link>
            <Link to="/admin/login">Admin</Link>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="products-container">
          {/* Filtreler */}
          <aside className="filters">
            <h3>Filtreler</h3>
            
            {/* Arama */}
            <div className="filter-group">
              <label>Arama</label>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Kategori */}
            <div className="filter-group">
              <label>Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Tümü</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fiyat Aralığı */}
            <div className="filter-group">
              <label>Min Fiyat</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Fiyat</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <button 
              className="clear-filters"
              onClick={() => {
                setFilters({ category: '', search: '', minPrice: '', maxPrice: '' });
                setSearchParams({});
              }}
            >
              Filtreleri Temizle
            </button>
          </aside>

          {/* Ürünler */}
          <main className="products-main">
            <h1>Ürünlerimiz</h1>
            <p className="results-count">{products.length} ürün bulundu</p>

            {loading ? (
              <div className="loading">Yükleniyor...</div>
            ) : products.length === 0 ? (
              <div className="no-products">Ürün bulunamadı.</div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <Link to={`/products/${product._id}`}>
                      {product.images && product.images[0] && (
                        <img 
                          src={`http://localhost:5000${product.images[0]}`} 
                          alt={product.name}
                        />
                      )}
                      <h3>{product.name}</h3>
                      <p className="category-name">
                        {product.category?.name}
                      </p>
                      <p className="price">{product.price} ₺</p>
                    </Link>
                    <button 
                      className="whatsapp-btn"
                      onClick={() => handleWhatsApp(product)}
                    >
                      💬 WhatsApp'tan Sipariş Ver
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;