const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// REGISTER & LOGIN (Combined for Student Ease)
router.post('/login', async (req, res) => {
  try {
    const { name, regNo, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ regNo });

    if (!user) {
      // First time user Register
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, regNo, password: hashedPassword, role: 'student' });
      await user.save();
      return res.status(201).json({ msg: 'Registered & Logged in!', user });
    }

    // 2. if already user login,check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Wrong Password!' });

    res.status(200).json({ msg: 'Welcome back!', user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;