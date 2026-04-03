import React, { useState } from 'react';
import { User, GraduationCap, ArrowRight, Lock, Mail, BookOpen } from 'lucide-react';
import axios from 'axios';

const StudentLogin = ({ onLogin }) => {
   const [studentData, setStudentData] = useState({ 
    name: '', 
    regNo: '', 
    email: '', 
    password: '',
    department: '' // Added department state
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, regNo, email, password, department } = studentData;

    // Validation check for all 5 fields
    if (name && regNo && email && password && department) {
      try {
        const res = await axios.post('https://placement-portal-green-five.vercel.app/api/students/login', studentData);
        
        localStorage.setItem('studentName', name);
        localStorage.setItem('studentRegNo', regNo);
        localStorage.setItem('studentEmail', email);
        localStorage.setItem('studentDept', department); // Save department too
        
        onLogin(true); 
      } catch (err) {
        alert(err.response?.data?.msg || "Database connection failed!");
      }
    } else {
      alert("Please fill in all details (including Department)!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-b-8 border-blue-600 w-full max-w-md text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter text-center">Student Portal</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-center">Sethu Institute of Technology</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <User className="absolute left-5 top-5 text-slate-400" size={20}/>
            <input type="text" placeholder="Full Name" className="w-full p-5 pl-14 rounded-2xl bg-slate-50 border outline-none focus:border-blue-600 font-bold"
              onChange={(e) => setStudentData({...studentData, name: e.target.value})} />
          </div>

          {/* Reg Number Field */}
          <div className="relative">
            <GraduationCap className="absolute left-5 top-5 text-slate-400" size={20}/>
            <input type="text" placeholder="Register Number" className="w-full p-5 pl-14 rounded-2xl bg-slate-50 border outline-none focus:border-blue-600 font-bold"
              onChange={(e) => setStudentData({...studentData, regNo: e.target.value})} />
          </div>

          {/* Department Field (New Addition) */}
          <div className="relative">
            <BookOpen className="absolute left-5 top-5 text-slate-400" size={20}/>
            <select 
              className="w-full p-5 pl-14 rounded-2xl bg-slate-50 border outline-none focus:border-blue-600 font-bold appearance-none text-slate-600"
              onChange={(e) => setStudentData({...studentData, department: e.target.value})}
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="AIDS">AI & Data Science</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
            </select>
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-slate-400" size={20}/>
            <input type="email" placeholder=" Email ID" className="w-full p-5 pl-14 rounded-2xl bg-slate-50 border outline-none focus:border-blue-600 font-bold"
              onChange={(e) => setStudentData({...studentData, email: e.target.value})} />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-5 top-5 text-slate-400" size={20}/>
            <input type="password" placeholder="Enter Password" className="w-full p-5 pl-14 rounded-2xl bg-slate-50 border outline-none focus:border-blue-600 font-bold"
              onChange={(e) => setStudentData({...studentData, password: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-lg uppercase tracking-widest mt-4">
            Enter Portal <ArrowRight size={20}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;