const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const wardenRoutes = require('./routes/wardenRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Serve views folder inside public (optional, for direct access)
app.use('/views', express.static(path.join(__dirname, '../public/views')));

// Routes

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Dashboard route - serves studentDashboard.html from views folder
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/studentDashboard.html'));
});

// Example simple login route (POST /api/students/login)
app.post('/api/students/login', (req, res) => {
  const { email, password } = req.body;

  // TODO: Replace with real DB check
  if (email === 'student@example.com' && password === 'password123') {
    // On successful login, send success response with user info
    res.json({ success: true, studentName: 'John Doe', studentId: '12345' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/wardens', wardenRoutes);
app.use('/api/admins', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
