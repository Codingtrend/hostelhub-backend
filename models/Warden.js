const mongoose = require('mongoose');

const WardenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hostelName: { type: String } // Added this line for hostel name
});

module.exports = mongoose.model('Warden', WardenSchema);
