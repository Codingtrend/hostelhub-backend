const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// POST: Register an admin
router.post('/register', async (req, res) => {
  const { name, adminId, email, password } = req.body;

  if (!name || !adminId || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  try {
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { adminId }]
    });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Email or Admin ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      adminId,
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully 🎉' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering admin' });
  }
});

// POST: Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'No admin found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful ✅', adminId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed. Try again.' });
  }
});

module.exports = router;
