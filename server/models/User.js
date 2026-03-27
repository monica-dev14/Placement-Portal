const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, sparse: true }, 
  password: { type: String, required: false },
  role: { type: String, enum: ['student', 'staff'], default: 'student' },
  regNo: { type: String, required: true, unique: true },
  dept: { type: String, default: 'CSE' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);