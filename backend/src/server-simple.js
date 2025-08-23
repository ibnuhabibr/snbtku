import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SNBTKU Backend API is running!', 
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mock API endpoints for frontend
app.get('/api/user/stats', (req, res) => {
  res.json({
    xp: 2500,
    coins: 1500,
    level: 5,
    totalQuestions: 150,
    correctAnswers: 120,
    studyTime: 3600,
    streak: 7,
    avatar_url: ''
  });
});

app.get('/api/tryouts', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'Tryout SNBT #1',
        description: 'Tryout lengkap dengan semua subtes',
        duration: 120,
        questions_count: 100
      },
      {
        id: 2,
        title: 'Tryout SNBT #2',
        description: 'Tryout fokus Penalaran Matematika',
        duration: 60,
        questions_count: 50
      }
    ]
  });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({
    success: true,
    data: [
      { rank: 1, username: 'Student1', score: 2500, xp: 5000 },
      { rank: 2, username: 'Student2', score: 2350, xp: 4800 },
      { rank: 3, username: 'Student3', score: 2200, xp: 4600 }
    ]
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        unique_id: 'user_001',
        email: email,
        name: 'User Demo',
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        xp: 2500,
        coins: 1500,
        level: 5,
        avatar_url: ''
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email dan password diperlukan'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        unique_id: 'user_001',
        email: email,
        name: name,
        role: 'student',
        createdAt: new Date().toISOString(),
        xp: 0,
        coins: 1000,
        level: 1,
        avatar_url: ''
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Nama, email, dan password diperlukan'
    });
  }
});

app.post('/api/auth/google', (req, res) => {
  const { email, name, firebaseUid } = req.body;
  
  if (email && firebaseUid) {
    res.json({
      success: true,
      user: {
        id: '1',
        unique_id: 'user_google_001',
        email: email,
        name: name || 'User Google',
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        xp: 1000,
        coins: 1200,
        level: 2,
        avatar_url: ''
      },
      token: 'mock-jwt-token-google-' + Date.now()
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email dan Firebase UID diperlukan'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && token.startsWith('mock-jwt-token')) {
    res.json({
      success: true,
      user: {
        id: '1',
        unique_id: 'user_001',
        email: 'demo@snbtku.com',
        name: 'User Demo',
        role: 'student',
        createdAt: '2025-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
        xp: 2500,
        coins: 1500,
        level: 5,
        avatar_url: ''
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ SNBTKU Backend running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

export default app;