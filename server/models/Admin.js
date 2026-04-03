const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    default: 'MonicaAdmin' 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { collection: 'admins' }); 
module.exports = mongoose.model('Admin', AdminSchema);