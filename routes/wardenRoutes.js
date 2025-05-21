const express = require('express');
const router = express.Router();
const Warden = require('../models/Warden');
const bcrypt = require('bcrypt');

// POST: Register a warden
router.post('/register', async (req, res) => {
  const { name, employeeId, email, password } = req.body;

  if (!name || !employeeId || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  try {
    const existingWarden = await Warden.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingWarden) {
      return res.status(409).json({ message: 'Email or Employee ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWarden = new Warden({
      name,
      employeeId,
      email,
      password: hashedPassword
    });

    await newWarden.save();
    res.status(201).json({ message: 'Warden registered successfully 🎉' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering warden' });
  }
});

// POST: Warden Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const warden = await Warden.findOne({ email });

    if (!warden) {
      return res.status(404).json({ message: 'No warden found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, warden.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful ✅', wardenId: warden._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed. Try again.' });
  }
});

module.exports = router;
