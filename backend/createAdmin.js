const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// User Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  role: String,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Admin oluştur
async function createAdmin() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    // Admin var mı kontrol et
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcısı zaten mevcut!');
      process.exit(0);
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Admin kullanıcısı oluştur
    const admin = new User({
      username: 'admin',
      email: 'admin@mobilya.com',
      password: hashedPassword,
      fullName: 'Admin',
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin kullanıcısı oluşturuldu!');
    console.log('📧 Email: admin@mobilya.com');
    console.log('👤 Kullanıcı adı: admin');
    console.log('🔑 Şifre: admin123');
    console.log('');
    console.log('⚠️  ÖNEMLİ: Production\'da bu şifreyi değiştirin!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

createAdmin();