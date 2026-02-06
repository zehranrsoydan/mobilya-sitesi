const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ===============================================
// MIDDLEWARE
// ===============================================

// CORS - Production için güncellendi
const corsOptions = {
  origin: function (origin, callback) {
    // Production'da allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000']; // Fallback for development
    
    // Development modunda veya allowed origins'de varsa izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy tarafından engellenmiş!'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - uploads klasörü
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ===============================================
// ROUTES
// ===============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mobilya E-Ticaret API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      upload: '/api/upload'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Sunucu hatası!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===============================================
// MONGODB CONNECTION
// ===============================================
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/mobilya';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı!');
  console.log(`📦 Database: ${mongoose.connection.name}`);
})
.catch((error) => {
  console.error('❌ MongoDB bağlantı hatası:', error);
  process.exit(1);
});

// ===============================================
// SERVER START
// ===============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server çalışıyor!
  📍 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 URL: http://localhost:${PORT}
  📝 API Docs: http://localhost:${PORT}/
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal alındı. Server kapatılıyor...');
  mongoose.connection.close(() => {
    console.log('MongoDB bağlantısı kapatıldı.');
    process.exit(0);
  });
});