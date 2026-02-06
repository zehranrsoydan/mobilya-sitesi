import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import './HomePage.css';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ]);
      setCategories(categoriesData);
      setFeaturedProducts(productsData.slice(0, 6)); // İlk 6 ürün
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="logo">🪑 Mobilya Mağazası</h1>
          <nav className="nav">
            <Link to="/">Ana Sayfa</Link>
            <Link to="/products">Ürünler</Link>
            <Link to="/admin/login">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Eviniz İçin En Kaliteli Mobilyalar</h2>
          <p>Modern ve şık tasarımlarla evinizi güzelleştirin</p>
          <Link to="/products" className="btn-primary">Ürünleri İncele</Link>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="categories-section">
        <div className="container">
          <h2>Kategoriler</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                key={category._id} 
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                {category.image && (
                  <img 
                    src={`http://localhost:5000${category.image}`} 
                    alt={category.name}
                  />
                )}
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="products-section">
        <div className="container">
          <h2>Öne Çıkan Ürünler</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`}
                className="product-card"
              >
                {product.images && product.images[0] && (
                  <img 
                    src={`http://localhost:5000${product.images[0]}`} 
                    alt={product.name}
                  />
                )}
                <h3>{product.name}</h3>
                <p className="price">{product.price} ₺</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-secondary">Tüm Ürünler</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Mobilya Mağazası. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;