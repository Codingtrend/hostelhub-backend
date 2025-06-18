require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // ✅ Added for OpenRouter
const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const wardenRoutes = require('./routes/wardenRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/views', express.static(path.join(__dirname, '../public/views')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/studentDashboard.html'));
});

app.post('/api/students/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'student@example.com' && password === 'password123') {
    res.json({ success: true, studentName: 'John Doe', studentId: '12345' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ ChatGPT Bot Route using OpenRouter
app.post('/api/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message cannot be empty" });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistral/mistral-7b-instruct", // or: "openai/gpt-3.5-turbo"
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Something went wrong with the AI response." });
  }
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/wardens', wardenRoutes);
app.use('/api/admins', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("📦 MONGO_URI:", process.env.MONGO_URI);
  console.log(`Server running on http://localhost:${PORT}`);
});
