const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentController');

// Register Route
router.post('/register', registerStudent);

// Login Route
router.post('/login', loginStudent);

module.exports = router;
