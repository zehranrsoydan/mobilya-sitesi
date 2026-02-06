import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import CategoriesManager from '../components/Admin/CategoriesManager';
import ProductsManager from '../components/Admin/ProductsManager';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const admin = authService.getAdmin();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      
      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        activeProducts: products.filter(p => p.isActive).length
      });
    } catch (error) {
      console.error('İstatistik çekme hatası:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <h2>🛋️ Admin Panel</h2>
          <p>Hoş geldin, <strong>{admin?.username}</strong></p>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/categories">📁 Kategoriler</Link>
          <Link to="/admin/products">🛋️ Ürünler</Link>
          <Link to="/" className="visit-site">🌐 Siteyi Ziyaret Et</Link>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Çıkış Yap
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="dashboard" element={<DashboardHome stats={stats} />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="products" element={<ProductsManager />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardHome({ stats }) {
  return (
    <div className="dashboard-home">
      <h1>Dashboard</h1>
      <p className="welcome-text">Mobilya sitesi yönetim paneline hoş geldiniz!</p>
      
      <div className="dashboard-cards">
        <div className="card card-purple">
          <div className="card-icon">📦</div>
          <h3>Toplam Ürün</h3>
          <p className="number">{stats.totalProducts}</p>
        </div>
        <div className="card card-blue">
          <div className="card-icon">📁</div>
          <h3>Kategoriler</h3>
          <p className="number">{stats.totalCategories}</p>
        </div>
        <div className="card card-green">
          <div className="card-icon">✅</div>
          <h3>Aktif Ürünler</h3>
          <p className="number">{stats.activeProducts}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div className="action-buttons">
          <Link to="/admin/products" className="action-btn">
            ➕ Yeni Ürün Ekle
          </Link>
          <Link to="/admin/categories" className="action-btn">
            📁 Kategori Ekle
          </Link>
          <Link to="/products" className="action-btn">
            🌐 Siteyi Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;