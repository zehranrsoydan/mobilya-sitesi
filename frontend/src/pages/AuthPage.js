import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // GİRİŞ YAP
        const response = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password
        });

        // Token ve kullanıcı bilgilerini kaydet
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Role göre yönlendir
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // Normal kullanıcı için ana sayfaya
          navigate('/');
        }

      } else {
        // KAYIT OL
        const response = await api.post('/auth/register', formData);
        
        setSuccess(response.data.message);
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: ''
        });

        // 2 saniye sonra giriş formuna geç
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: ''
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          {/* Logo/Header */}
          <div className="auth-header">
            <h1>🛋️ Mobilya Mağazası</h1>
            <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Hesabınıza giriş yapın' 
                : 'Yeni bir hesap oluşturun'}
            </p>
          </div>

          {/* Mesajlar */}
          {error && (
            <div className="message error-message">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* Kayıt Formu */}
            {!isLogin && (
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Zehra Nur Soydan"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Email (sadece kayıt) */}
            {!isLogin && (
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Kullanıcı Adı */}
            <div className="form-group">
              <label>Kullanıcı Adı {isLogin && '/ Email'}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={isLogin ? "kullaniciadi veya email" : "kullaniciadi"}
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Şifre */}
            <div className="form-group">
              <label>Şifre</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              {!isLogin && (
                <small className="form-hint">En az 6 karakter</small>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading 
                ? '⏳ İşleniyor...' 
                : isLogin ? '🚀 Giriş Yap' : '📝 Kayıt Ol'}
            </button>
          </form>

          {/* Toggle */}
          <div className="auth-footer">
            <p>
              {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}
              {' '}
              <button 
                onClick={toggleMode} 
                className="toggle-btn"
                disabled={loading}
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>

          {/* Admin Bilgisi */}
          {isLogin && (
            <div className="admin-info">
              <p>
                <small>
                  💡 Admin girişi için admin kullanıcı adı ve şifrenizi kullanın
                </small>
              </p>
            </div>
          )}

          {/* Ana Sayfaya Dön */}
          <div className="back-home">
            <a href="/">← Ana Sayfaya Dön</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;