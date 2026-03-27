const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB..."); 
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, 
    });
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;