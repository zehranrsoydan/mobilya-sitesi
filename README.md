# 🪑 Mobilya E-Ticaret Sitesi

Modern ve kullanıcı dostu mobilya e-ticaret platformu.

## 🚀 Özellikler

### Kullanıcı Tarafı
- ✅ Modern ve responsive tasarım
- ✅ Kategori bazlı ürün listeleme
- ✅ Gelişmiş filtreleme (kategori, fiyat aralığı, arama)
- ✅ Detaylı ürün sayfaları
- ✅ Çoklu ürün görselleri
- ✅ WhatsApp ile direkt sipariş

### Admin Paneli
- ✅ Güvenli giriş sistemi (JWT)
- ✅ Dashboard ile istatistikler
- ✅ Kategori yönetimi (Ekle/Düzenle/Sil)
- ✅ Ürün yönetimi (Ekle/Düzenle/Sil)
- ✅ Çoklu resim yükleme
- ✅ Stok takibi

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (Dosya yükleme)
- bcryptjs (Şifreleme)

### Frontend
- React.js
- React Router
- Axios
- CSS3

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB

### Backend Kurulumu
```bash
cd backend
npm install
npm start
```

Backend http://localhost:5000 adresinde çalışacaktır.

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 🔑 Admin Giriş Bilgileri

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

## 📁 Proje Yapısı
```
mobilya-sitesi/
├── backend/
│   ├── models/          # MongoDB modelleri
│   ├── routes/          # API route'ları
│   ├── middleware/      # Middleware'ler
│   ├── uploads/         # Yüklenen resimler
│   └── server.js        # Ana server dosyası
├── frontend/
│   ├── src/
│   │   ├── components/  # React componentleri
│   │   ├── pages/       # Sayfa componentleri
│   │   ├── services/    # API servisleri
│   │   └── App.js       # Ana uygulama
│   └── public/
└── README.md
```

## 🌟 Kullanım

### Kategori Ekleme
1. Admin paneline giriş yapın
2. "Kategoriler" menüsüne tıklayın
3. "Yeni Kategori Ekle" butonuna tıklayın
4. Kategori bilgilerini girin ve kaydedin

### Ürün Ekleme
1. Admin paneline giriş yapın
2. "Ürünler" menüsüne tıklayın
3. "Yeni Ürün Ekle" butonuna tıklayın
4. Ürün bilgilerini girin ve resimleri yükleyin
5. Kaydedin

### Kullanıcı Tarafında Alışveriş
1. Ana sayfadan kategorilere göz atın
2. "Ürünleri İncele" ile tüm ürünleri görün
3. Filtreleri kullanarak istediğiniz ürünü bulun
4. Ürün detayına tıklayın
5. "WhatsApp'tan Sipariş Ver" ile sipariş verin

## 📞 İletişim

WhatsApp: +90 5XX XXX XX XX (ProductsPage.js ve ProductDetailPage.js dosyalarında güncelleyin)

## 📄 Lisans

Bu proje eğitim amaçlıdır.

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! ⭐
```

**Ctrl + S** ile kaydedin.

---

## ADIM 21: .gitignore Dosyası Oluşturalım

Proje ana klasöründe (`mobilya-sitesi`) yeni dosya: **.gitignore**
```
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Build
frontend/build/
dist/

# Environment variables
.env
.env.local
.env.production

# Uploads (eğer Git'e eklemek istemiyorsanız)
backend/uploads/*
!backend/uploads/.gitkeep

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/

# Misc
.cache/