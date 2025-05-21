const Student = require('../models/Student');
const bcrypt = require('bcrypt');

const registerStudent = async (req, res) => {
  let { name, rollNumber, email, password, roomAllocated, hostelName } = req.body;

  if (!name || !rollNumber || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  email = email.toLowerCase(); // Normalize email

  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingStudent) {
      return res.status(409).json({ message: 'Email or Roll Number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Original password:", password);
    console.log("Hashed password:", hashedPassword);

    const newStudent = new Student({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      roomAllocated,
      hostelName,
      // No need to explicitly set role here if default is set in schema
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully 🎉' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Error registering student' });
  }
};

const loginStudent = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  email = email.toLowerCase(); // Normalize email

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'No student found with this email.' });
    }

    console.log("Entered password:", password);
    console.log("Stored hashed password:", student.password);

    const isMatch = await bcrypt.compare(password, student.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // Include role in the response for frontend to handle redirection if needed
    res.status(200).json({ 
      message: 'Login successful ✅', 
      studentId: student._id,
      role: student.role  // <-- added role here
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Login failed. Try again.' });
  }
};

module.exports = { registerStudent, loginStudent };
