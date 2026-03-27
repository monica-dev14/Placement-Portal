const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ADMIN LOGIN
router.post('/login', async (req, res) => {
  const { password } = req.body;
  try {
    const admin = await Admin.findOne({ username: 'MonicaAdmin' });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Compare Hash Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Generate Token (Valid for 1 day)
    const token = jwt.sign({ id: admin._id }, 'SIT_SECRET_KEY', { expiresIn: '1d' });
    res.json({ token, message: "Welcome Monica!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;