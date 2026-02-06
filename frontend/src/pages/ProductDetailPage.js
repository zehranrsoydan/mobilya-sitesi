import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Ürün çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum. Fiyat: ${product.price} ₺`;
    const phone = '905388733737'; // Buraya WhatsApp numaranızı yazın
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="error">Ürün bulunamadı.</div>;
  }

  return (
    <div className="product-detail-page">
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
        <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / 
          <Link to="/products"> Ürünler</Link> / 
          <span> {product.name}</span>
        </div>

        <div className="product-detail">
          {/* Resim Galerisi */}
          <div className="product-images">
            <div className="main-image">
              {product.images && product.images[selectedImage] && (
                <img 
                  src={`http://localhost:5000${product.images[selectedImage]}`} 
                  alt={product.name}
                />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${img}`}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="category">
              Kategori: <Link to={`/products?category=${product.category._id}`}>
                {product.category.name}
              </Link>
            </p>
            <p className="price">{product.price} ₺</p>

            <div className="description">
              <h3>Açıklama</h3>
              <p>{product.description}</p>
            </div>

            {/* Özellikler */}
            <div className="specifications">
              <h3>Özellikler</h3>
              <table>
                <tbody>
                  {product.dimensions && (
                    <>
                      {product.dimensions.width && (
                        <tr>
                          <td>Genişlik</td>
                          <td>{product.dimensions.width} cm</td>
                        </tr>
                      )}
                      {product.dimensions.height && (
                        <tr>
                          <td>Yükseklik</td>
                          <td>{product.dimensions.height} cm</td>
                        </tr>
                      )}
                      {product.dimensions.depth && (
                        <tr>
                          <td>Derinlik</td>
                          <td>{product.dimensions.depth} cm</td>
                        </tr>
                      )}
                    </>
                  )}
                  {product.material && (
                    <tr>
                      <td>Malzeme</td>
                      <td>{product.material}</td>
                    </tr>
                  )}
                  {product.color && (
                    <tr>
                      <td>Renk</td>
                      <td>{product.color}</td>
                    </tr>
                  )}
                  {product.stock !== undefined && (
                    <tr>
                      <td>Stok Durumu</td>
                      <td>{product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Tükendi'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button className="whatsapp-btn" onClick={handleWhatsApp}>
              💬 WhatsApp'tan Sipariş Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;