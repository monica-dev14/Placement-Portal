import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, PlusCircle, Trash2, ShieldCheck, Lock, 
  ArrowRight, Calendar, Trophy, UserPlus, Image as ImageIcon, Loader2 
} from 'lucide-react';

const Admin = ({ setCompanies, companies, placedList, setPlacedList }) => {
   const [newDrive, setNewDrive] = useState({ 
    companyName: '', role: '', package: '', date: '', rounds: '' 
  });
  const [newStudent, setNewStudent] = useState({
    name: '', regNo: '', company: '', package: '', imageUrl: ''
  });
  
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- CONFIG ---
  const CLOUD_NAME = "dvsbitp7z"; 
  const UPLOAD_PRESET = "ml_default"; 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthorized(true);
  }, []);

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
        formData
      );
      setNewStudent((prev) => ({ ...prev, imageUrl: res.data.secure_url }));
      alert("Photo Uploaded Successfully! ✅");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed! Check Cloud Name and Preset.");
    } finally {
      setUploading(false);
    }
  };

  // --- AUTH LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setIsAuthorized(true);
        alert("Welcome Back, Monica C! 🎓");
      }
    } catch (err) {
      alert("Invalid Password! Try SIT_ADMIN_2026");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthorized(false);
  };

  // --- DRIVE ACTIONS (UPDATED FOR DYNAMIC REFRESH) ---
  const addDrive = async () => {
    if (!newDrive.companyName || !newDrive.role || !newDrive.date) return alert("Fill all drive details!");
    try {
      const token = localStorage.getItem('token');
      const driveData = {
        ...newDrive,
        rounds: typeof newDrive.rounds === 'string' 
          ? newDrive.rounds.split(',').map(r => r.trim()).filter(r => r !== "")
          : newDrive.rounds
      };
      
      const res = await axios.post('http://localhost:5000/api/companies', driveData, {
        headers: { 'x-auth-token': token }
      });

      
      if (res.status === 201 || res.status === 200) {
        setCompanies([res.data, ...companies]); 
        setNewDrive({ companyName: '', role: '', package: '', date: '', rounds: '' });
      }
    } catch (err) { 
      console.error("Add Error:", err.response?.data);
      alert("Error adding drive. Monica, check if server is running!"); 
    }
  };

  const deleteDrive = async (id) => {
    if (window.confirm("Monica, are you sure you want to delete this drive?")) {
        try {
             const token = localStorage.getItem('token'); 

            if (!token) {
                alert("Login expired! Monica, please login again.");
                return;
            }

            await axios.delete(`http://localhost:5000/api/companies/${id}`, {
                headers: { 
                    'x-auth-token': token 
                }
            });

            // UI-la dynamic-ah remove pannum
            setCompanies(prev => prev.filter(c => c._id !== id));
            alert("✅ Drive deleted successfully!");
        } catch (err) {
            console.error("Delete Error:", err.response?.data || err.message);
            alert("Drive delete aagala. Permission denied!");
        }
    }
};

  // ACHIEVER ACTION 
  const addStudent = () => {
    if (!newStudent.name || !newStudent.company || !newStudent.imageUrl) {
      return alert("Please fill Student Name, Company and Upload a Photo first! 📸");
    }
    setPlacedList([newStudent, ...placedList]);
    setNewStudent({ name: '', regNo: '', company: '', package: '', imageUrl: '' });
    alert("Student Successfully Added to Achievers! 🎉");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl border-t-8 border-blue-600 w-full max-w-md text-center">
          <Lock className="text-blue-500 mx-auto mb-6" size={40} />
          <h2 className="text-3xl font-black text-white mb-8 uppercase italic">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="••••••••" className="w-full p-6 rounded-3xl bg-slate-900 border-none outline-none text-center font-black text-2xl text-white focus:ring-2 ring-blue-600" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase hover:bg-blue-500 transition-all">Unlock <ArrowRight className="inline ml-2" /></button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="bg-blue-950 text-white p-10 rounded-[3rem] shadow-2xl flex justify-between items-center border-b-8 border-blue-600">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase italic"><LayoutDashboard size={40} className="text-blue-400" /> Control Center</h2>
          <p className="text-blue-300 font-bold mt-2 uppercase text-xs tracking-[0.3em]">Welcome, Monica C</p>
        </div>
        <button onClick={handleLogout} className="bg-white/10 px-8 py-3 rounded-2xl text-xs font-black uppercase hover:bg-red-500 transition-all border border-white/20">Sign Out</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* DRIVE FORM */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border shadow-sm space-y-6">
          <h3 className="text-xl font-black flex items-center gap-3 text-blue-900 uppercase border-b pb-4 italic"><PlusCircle size={24}/> New Drive</h3>
          <div className="space-y-4">
            <input placeholder="Company" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newDrive.companyName} onChange={(e) => setNewDrive({...newDrive, companyName: e.target.value})} />
            <input placeholder="Role" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newDrive.role} onChange={(e) => setNewDrive({...newDrive, role: e.target.value})} />
            <input placeholder="LPA" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newDrive.package} onChange={(e) => setNewDrive({...newDrive, package: e.target.value})} />
            <input placeholder="Rounds (e.g. Aptitude, TR, HR)" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newDrive.rounds} onChange={(e) => setNewDrive({...newDrive, rounds: e.target.value})} />
            <input type="date" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold text-slate-500" value={newDrive.date} onChange={(e) => setNewDrive({...newDrive, date: e.target.value})} />
            <button onClick={addDrive} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase tracking-widest">Publish</button>
          </div>
        </div>

        {/* ACHIEVERS FORM */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border shadow-sm space-y-6">
          <h3 className="text-xl font-black flex items-center gap-3 text-green-600 uppercase border-b pb-4 italic"><Trophy size={24}/> Add Achiever</h3>
          <div className="space-y-4 text-center">
            <input placeholder="Student Name" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
            <input placeholder="Company" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newStudent.company} onChange={(e) => setNewStudent({...newStudent, company: e.target.value})} />
            <input placeholder="Package (e.g. 12 LPA)" className="w-full p-4 rounded-2xl bg-gray-50 border font-bold" value={newStudent.package} onChange={(e) => setNewStudent({...newStudent, package: e.target.value})} />
            
            <div className="relative border-2 border-dashed border-blue-200 p-8 rounded-[2rem] bg-blue-50/50">
              {uploading ? (
                <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
              ) : newStudent.imageUrl ? (
                <div className="relative inline-block">
                    <img src={newStudent.imageUrl} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" alt="Preview" />
                    <button type="button" onClick={() => setNewStudent({...newStudent, imageUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md">
                      <Trash2 size={14}/>
                    </button>
                    <span className="absolute -bottom-2 -left-2 bg-green-500 text-white p-1 rounded-full"><ShieldCheck size={16}/></span>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon className="mx-auto text-blue-400 mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Select Photo</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <button type="button" onClick={addStudent} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-slate-900 transition-all uppercase flex items-center justify-center gap-2">
              <UserPlus size={20}/> Save Student
            </button>
          </div>
        </div>

        {/* FEED LIST */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border shadow-sm">
          <h3 className="text-xl font-black text-gray-800 uppercase mb-8 italic text-center underline decoration-blue-500">Live Feed</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {companies && companies.map((c) => (
              <div key={c._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border hover:border-blue-200 transition-all">
                <div>
                  <p className="font-black text-blue-950 text-sm leading-tight">{c.companyName}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase">{c.role} • {c.package} LPA</p>
                </div>
                <button onClick={() => deleteDrive(c._id)} className="p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;