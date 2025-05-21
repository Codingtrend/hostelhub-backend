const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roomAllocated: { type: String },
  hostelName: { type: String }, // Added this line for hostel name
  role: {
    type: String,
    enum: ['student', 'warden', 'admin'],
    default: 'student'  // default role is student
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
