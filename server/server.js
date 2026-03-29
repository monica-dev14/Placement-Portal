require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Groq = require("groq-sdk");
const { sendPlacementEmail } = require('./mailConfig');

const app = express();

// --- 1. CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "SIT_SECRET_2026_MONICA_SECURE_KEY";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://your-frontend-vercel-link.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"], // Authorization header-um add pannikonga, JWT-ku thevai padum
    credentials: true
}));

// --- 3. DATABASE MODELS ---

// Student Model with Department
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    email: { type: String, required: true }, 
    password: { type: String, required: true },
    department: { type: String, required: true } 
});
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// Admin Model
const adminSchema = new mongoose.Schema({
    username: { type: String, default: 'MonicaAdmin' },
    password: { type: String, required: true }
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// Company/Drive Model
const placementSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    package: { type: String, required: true }, 
    rounds: { type: [String], default: ["Aptitude", "Technical", "HR"] }, 
    date: { type: Date, default: Date.now }
});
const Company = mongoose.models.Company || mongoose.model('Company', placementSchema, 'companies');

// Chat History Model
const chatHistorySchema = new mongoose.Schema({
    messages: { type: Array, required: true },
    date: { type: Date, default: Date.now }
});
const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);

// --- 4. AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

app.get("/", (req, res) => {
    res.send("🚀 SIT Placement Portal Backend is Running Successfully!");
});
// --- 5. DB CONNECTION ---
const connectDB = async () => {
    try {
        // Render-la irukura MONGO_URI-ah edukkum
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ SIT MongoDB Connected: ${conn.connection.host}`);

        // Default Admin Creation
        const adminExists = await Admin.findOne({ username: 'MonicaAdmin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('SIT_ADMIN_2026', salt);
            await Admin.create({ 
                username: 'MonicaAdmin', 
                password: hashedPassword,
                role: 'SuperAdmin' // Add panna extra feature
            });
            console.log("👤 Default Admin 'MonicaAdmin' Created!");
        }
    } catch (err) {
        console.error('❌ SIT DB Connection Error:', err.message);
        process.exit(1); // Connection fail aana server-ah stop panna
    }
};

connectDB();
// --- 6. ROUTES ---

//  AI CHAT ROUTE
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are the SIT Placement Assistant for Sethu Institute of Technology. Help students with interview tips, resume building, and placement queries." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ error: "AI Assistant is currently offline" });
    }
});

//  GET CHAT HISTORY
app.get('/api/history', async (req, res) => {
    try {
        const history = await ChatHistory.find().sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// SAVE CHAT SESSION
app.post('/api/history/save', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || messages.length <= 1) return res.status(200).json({ msg: "Empty chat" });
        const newHistory = new ChatHistory({ messages });
        await newHistory.save();
        res.status(201).json({ msg: "Session saved!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save chat" });
    }
});

// DELETE ALL CHAT HISTORY
app.delete('/api/history', async (req, res) => {
    try {
        await ChatHistory.deleteMany({});
        res.status(200).json({ msg: "History cleared successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    try {
        const admin = await Admin.findOne({ username: 'MonicaAdmin' });
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Admin Password!" });
        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, msg: "Welcome, Monica!" });
    } catch (err) { res.status(500).json({ error: "Login error" }); }
});

//  STUDENT LOGIN & AUTO-REGISTRATION
app.post('/api/students/login', async (req, res) => {
    const { name, regNo, email, password, department } = req.body; 
    try {
        let student = await Student.findOne({ regNo });
        if (!student) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            student = new Student({ name, regNo, email, password: hashedPassword, department });
            await student.save();
            return res.status(201).json({ msg: "Account Created!", student });
        }
        res.json({ msg: "Login successful!", student });
    } catch (err) { res.status(500).json({ error: "Student Auth error" }); }
});

// GET ALL PLACEMENT DRIVES
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find().sort({ date: -1 });
        res.json(companies);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

//  PUBLISH NEW DRIVE & SEND EMAILS
app.post('/api/companies', auth, async (req, res) => {
    try {
        const { companyName, role, package, rounds } = req.body;
        const newCompany = new Company({ companyName, role, package, rounds });
        const savedCompany = await newCompany.save();
        
        // Notification Logic
        const students = await Student.find({}, 'email');
        const emailList = students.map(s => s.email);
        if (emailList.length > 0) {
            sendPlacementEmail(savedCompany, emailList).catch(err => console.log("📧 Mail Error:", err.message));
        }
        res.status(201).json(savedCompany);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE A SPECIFIC DRIVE
app.delete('/api/companies/:id', auth, async (req, res) => {
    try {
        const result = await Company.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ msg: "Drive not found" });
        res.json({ msg: "Drive deleted from SIT Portal!" });
    } catch (err) {
        res.status(500).json({ error: "Server Error during deletion" });
    }
});

app.listen(PORT, () => console.log(`🚀 SIT Server running on port ${PORT}`));