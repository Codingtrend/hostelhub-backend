const Warden = require('../models/Warden');
const bcryptjs = require('bcryptjs');

// Register Warden
const registerWarden = async (req, res) => {
  console.log("Warden registration endpoint hit!");

  const { name, employeeId, email, password, hostelName } = req.body; // Added hostelName here

  if (!name || !employeeId || !email || !password) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    const existingWarden = await Warden.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingWarden) {
      return res.status(409).json({ message: 'Email or Employee ID already exists.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newWarden = new Warden({
      name,
      employeeId,
      email,
      password: hashedPassword,
      hostelName // Added hostelName to the new warden object
    });

    await newWarden.save();
    res.status(201).json({ message: 'Warden registered successfully 🎉' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login Warden
const loginWarden = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const warden = await Warden.findOne({ email });

    if (!warden)
      return res.status(404).json({ message: 'No account found with this email.' });

    const isMatch = await bcryptjs.compare(password, warden.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect password.' });

    res.status(200).json({ message: 'Login successful ✅', wardenId: warden._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = {
  registerWarden,
  loginWarden
};
