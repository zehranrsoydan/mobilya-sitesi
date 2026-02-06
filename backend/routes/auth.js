const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Girişi
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin'i bul
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }

    // Token oluştur
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Token Doğrulama
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin bulunamadı' });
    }

    res.json({ admin });
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
});

module.exports = router;