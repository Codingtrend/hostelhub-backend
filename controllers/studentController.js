const Student = require('../models/Student');
const bcrypt = require('bcrypt');

// Register Student
const registerStudent = async (req, res) => {
  try {
    let { name, rollNumber, email, password, roomAllocated, hostelName } = req.body;

    if (!name || !rollNumber || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    email = email.toLowerCase();

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingStudent) {
      return res.status(409).json({ success: false, message: 'Email or Roll Number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      roomAllocated,
      hostelName
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully 🎉',
      studentId: newStudent._id,
      role: newStudent.role
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// Login Student
const loginStudent = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    email = email.toLowerCase();

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ success: false, message: 'No student found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful ✅',
      studentId: student._id,
      role: student.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

module.exports = { registerStudent, loginStudent };
