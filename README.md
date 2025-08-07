# SNBTKU - Platform Pembelajaran SNBT

🚀 Platform pembelajaran modern untuk persiapan Seleksi Nasional Berdasarkan Tes (SNBT) dengan fitur gamifikasi dan analitik pembelajaran yang canggih.

## ✨ Fitur Utama

- 📚 **Materi Pembelajaran Lengkap** - Konten pembelajaran terstruktur untuk semua mata pelajaran SNBT
- 🎯 **Try Out Interaktif** - Simulasi ujian dengan sistem penilaian otomatis
- 📊 **Dashboard Analytics** - Analisis performa dan progress pembelajaran
- 🏆 **Sistem Gamifikasi** - XP, level, streak, dan leaderboard untuk motivasi belajar
- 👥 **Komunitas** - Grup WhatsApp dan channel untuk diskusi dan update
- 📱 **Responsive Design** - Optimized untuk desktop dan mobile
- 🔐 **Authentication** - Sistem login aman dengan Firebase Auth
- ⚡ **Performance Optimized** - Fast loading dengan code splitting dan lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Database**: Supabase
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript ESLint

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Firebase project
- Supabase project

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd ignitus-snbt-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file dengan konfigurasi Firebase dan Supabase Anda:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utilities and configurations
├── services/           # API services
├── models/             # TypeScript interfaces/types
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with linting and type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview production build
- `npm run clean` - Clean build directory

## 🚀 Deployment

### Production Build

```bash
npm run build:prod
```

### Environment Variables untuk Production

Pastikan semua environment variables sudah diset dengan benar:

- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_SUPABASE_*` - Supabase configuration
- `VITE_WHATSAPP_*` - WhatsApp community links

### Deployment Platforms

- **Vercel**: Connect repository dan deploy otomatis
- **Netlify**: Drag & drop `dist` folder atau connect repository
- **Firebase Hosting**: `firebase deploy`

## 🔐 Security

- ✅ Environment variables untuk sensitive data
- ✅ Firebase Auth untuk authentication
- ✅ TypeScript strict mode enabled
- ✅ ESLint security rules
- ✅ Production build optimizations

## 📊 Performance Optimizations

- ⚡ Code splitting dengan manual chunks
- 🗜️ Terser minification
- 📦 Bundle size optimization
- 🚀 Lazy loading untuk routes
- 💾 Optimized dependencies

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Development Guidelines

- Gunakan TypeScript untuk type safety
- Follow ESLint rules
- Gunakan Prettier untuk code formatting
- Write meaningful commit messages
- Test fitur sebelum commit

## 🐛 Troubleshooting

### Common Issues

1. **Build errors**: Run `npm run type-check` untuk cek TypeScript errors
2. **Environment variables**: Pastikan semua required env vars sudah diset
3. **Firebase errors**: Cek konfigurasi Firebase di console
4. **Supabase errors**: Cek connection dan API keys

## 📞 Support

- 📧 Email: support@snbtku.com
- 💬 WhatsApp: [Join Community](https://chat.whatsapp.com/your-group-link)
- 📱 Channel: [SNBTKU Updates](https://whatsapp.com/channel/your-channel-link)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**SNBTKU** - Membantu siswa Indonesia meraih impian kuliah melalui persiapan SNBT yang optimal! 🎓✨