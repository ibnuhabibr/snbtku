# 🚀 Deployment Guide - SNBTKU

Panduan lengkap untuk deploy aplikasi SNBTKU ke production dengan berbagai platform hosting.

## 📋 Pre-deployment Checklist

### ✅ Environment Variables
Pastikan semua environment variables sudah diset:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Links
VITE_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/your-group-invite-link
VITE_WHATSAPP_CHANNEL_LINK=https://whatsapp.com/channel/your-channel-link

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### ✅ Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Test production build
npm run build:prod
```

### ✅ Security Check
- [ ] No hardcoded API keys in source code
- [ ] All sensitive data moved to environment variables
- [ ] Firebase security rules configured
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced

## 🌐 Deployment Platforms

### 1. Vercel (Recommended)

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Via GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Netlify

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build:prod
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Firebase Hosting

#### Setup Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init hosting

# Build and deploy
npm run build:prod
firebase deploy
```

#### Firebase Configuration (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      },
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### 4. GitHub Pages

#### Using GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build:prod
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 Post-deployment Configuration

### 1. Domain Setup
- Configure custom domain
- Setup SSL certificate
- Configure DNS records

### 2. Firebase Configuration
```bash
# Add authorized domains in Firebase Console
# Authentication > Settings > Authorized domains
# Add: yourdomain.com
```

### 3. Supabase Configuration
```sql
-- Update CORS settings in Supabase Dashboard
-- Settings > API > CORS Origins
-- Add: https://yourdomain.com
```

### 4. Analytics Setup
- Configure Google Analytics
- Setup conversion tracking
- Configure custom events

## 📊 Monitoring & Performance

### 1. Performance Monitoring
- Setup Lighthouse CI
- Monitor Core Web Vitals
- Track bundle size

### 2. Error Monitoring
- Integrate Sentry (optional)
- Setup error alerts
- Monitor user feedback

### 3. Analytics
- Google Analytics 4
- User behavior tracking
- Conversion tracking

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:prod
      - name: Deploy to Staging
        run: |
          # Deploy to staging environment
          echo "Deploy to staging"

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:prod
      - name: Deploy to Production
        run: |
          # Deploy to production environment
          echo "Deploy to production"
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Check platform-specific env var setup
   - Verify no typos in variable names

3. **Routing Issues (404 on refresh)**
   - Configure SPA fallback rules
   - Check redirect configurations
   - Ensure `index.html` fallback is set

4. **Firebase Auth Domain Issues**
   - Add domain to Firebase authorized domains
   - Check CORS settings
   - Verify auth configuration

### Performance Issues

1. **Large Bundle Size**
   ```bash
   # Analyze bundle
   npm run build:analyze
   
   # Check for unused dependencies
   npx depcheck
   ```

2. **Slow Loading**
   - Enable gzip compression
   - Configure CDN
   - Optimize images
   - Use lazy loading

## 📞 Support

Jika mengalami masalah deployment:
- 📧 Email: support@snbtku.com
- 💬 WhatsApp: [Join Community](https://chat.whatsapp.com/your-group-link)
- 📚 Documentation: [docs.snbtku.com](https://docs.snbtku.com)

---

**Happy Deploying! 🚀**