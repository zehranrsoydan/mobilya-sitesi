const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const auth = require('../middleware/auth');

// Tek resim yükleme
router.post('/single', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Resim yüklendi', 
      imageUrl 
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Çoklu resim yükleme
router.post('/multiple', auth, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      message: 'Resimler yüklendi', 
      imageUrls 
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;