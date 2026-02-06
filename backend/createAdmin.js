const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

// MongoDB'ye bağlan
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.log('Hata:', err));

// Admin oluştur
const createAdmin = async () => {
  try {
    // Önce var mı kontrol et
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('❌ Admin zaten mevcut!');
      process.exit();
    }

    // Şifreyi hashle (güvenli hale getir)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Yeni admin oluştur
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@mobilya.com'
    });

    await admin.save();
    console.log('✅ Admin başarıyla oluşturuldu!');
    console.log('Kullanıcı adı: admin');
    console.log('Şifre: admin123');
    console.log('⚠️  Şifreyi daha sonra değiştirmeyi unutmayın!');
    
    process.exit();
  } catch (error) {
    console.log('Hata:', error);
    process.exit();
  }
};

createAdmin();