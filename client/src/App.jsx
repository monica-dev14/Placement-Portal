import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, GraduationCap, Trophy, BookOpen, 
  MessageCircle, Star, ChevronRight, Code, Layers, Shield, 
  Smartphone, PenTool, BarChart, Laptop, Terminal, Users, LogOut
} from 'lucide-react';

// --- COMPONENTS ---
import ChatAssistant from './components/ChatAssistant';
import Admin from "./components/Admin";
import StudentLogin from './components/StudentLogin';
import PlacedStudents from './components/PlacedStudents';

// --- API CONFIG ---
const API_BASE_URL = 'http://localhost:5000/api/companies';

// --- HOME PAGE COMPONENT ---
const Home = ({ companies, onShowDetails }) => (
  <div className="space-y-16 animate-in fade-in duration-1000">
    <div className="relative h-[500px] w-full overflow-hidden rounded-[3.5rem] shadow-2xl border-b-8 border-blue-600">
      <img 
        src="https://cache.careers360.mobi/media/presets/720X480/colleges/social-media/media-gallery/3207/2018/8/8/Sethu-Institute-of-Technology-Kariapatti1.jpg" 
        className="w-full h-full object-cover" 
        alt="SIT Campus" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent flex items-end p-12 text-white">
        <div>
          <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase italic">Sethu Institute of Technology</h1>
          <p className="text-2xl text-blue-200 italic font-medium">Empowering Engineers for a Global Future</p>
        </div>
      </div>
    </div>

    <section>
      <h2 className="text-3xl font-black text-slate-800 mb-10 flex items-center gap-3 italic uppercase tracking-tighter">
        <Trophy className="text-yellow-500" size={36} /> Placement Drive Updates
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {companies && companies.length > 0 ? (
          companies.map((c) => (
            <div key={c._id} className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-blue-600 shadow-xl hover:scale-105 transition-all">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{c.companyName}</h2>
              <p className="text-blue-600 font-black text-lg mb-4 italic">{c.role}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                  Package: {c.package}
                </span>
                <button 
                  onClick={() => onShowDetails(c)}
                  className="text-slate-400 font-bold hover:text-blue-600 flex items-center gap-1 text-xs uppercase tracking-widest transition-colors"
                >
                  Details <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-black text-xl italic uppercase tracking-[0.2em]">Upcoming Placement Drives... Stay Ready!</p>
          </div>
        )}
      </div>
    </section>
  </div>
);

// --- CAREER GUIDE COMPONENT ---
const CareerGuide = () => {
  const codingRoles = [
    { title: "Full Stack Developer", skills: "React, Node.js, MongoDB", icon: <Layers size={20}/>, color: "text-blue-400", border: "border-blue-500/30" },
    { title: "AI/ML Engineer", skills: "Python, TensorFlow, Data Models", icon: <Laptop size={20}/>, color: "text-purple-400", border: "border-purple-500/30" },
    { title: "DevOps Engineer", skills: "AWS, Docker, CI/CD Pipelines", icon: <Terminal size={20}/>, color: "text-green-400", border: "border-green-500/30" },
    { title: "Cyber Security", skills: "Network Security, Ethical Hacking", icon: <Shield size={20}/>, color: "text-red-400", border: "border-red-500/30" },
    { title: "Mobile App Dev", skills: "Flutter, React Native, Swift", icon: <Smartphone size={20}/>, color: "text-yellow-400", border: "border-yellow-500/30" }
  ];

  const nonCodingRoles = [
    { title: "UI/UX Designer", skills: "Figma, User Flows, Prototyping", icon: <PenTool size={20}/>, color: "text-pink-400", border: "border-pink-500/30" },
    { title: "Product Manager", skills: "Agile, Roadmapping, Strategy", icon: <Briefcase size={20}/>, color: "text-orange-400", border: "border-orange-500/30" },
    { title: "Business Analyst", skills: "SQL, Tableau, Requirements", icon: <BarChart size={20}/>, color: "text-cyan-400", border: "border-cyan-500/30" },
    { title: "QA Specialist", skills: "Manual Testing, Test Cases, SDLC", icon: <Star size={20}/>, color: "text-indigo-400", border: "border-indigo-500/30" },
    { title: "Technical Writer", skills: "API Docs, User Manuals, Wikis", icon: <BookOpen size={20}/>, color: "text-emerald-400", border: "border-emerald-500/30" }
  ];

  return (
    <div className="space-y-20 animate-in slide-in-from-bottom-10">
      <div className="bg-blue-950 text-white p-14 rounded-[3.5rem] shadow-2xl">
        <h2 className="text-5xl font-black mb-4 flex items-center gap-4 italic uppercase tracking-tighter">
          <BookOpen size={48} className="text-blue-400"/> Preparation Hub
        </h2>
        <p className="text-blue-200 text-xl font-medium italic">Your one-stop destination for placement success.</p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ResourceCard title="Aptitude Prep" icon={<Star/>} color="border-green-500" links={[{name: "IndiaBIX", url: "https://www.indiabix.com"}, {name: "GFG Aptitude", url: "https://www.geeksforgeeks.org/aptitude-questions-and-answers/"}]} />
        <ResourceCard title="Communication" icon={<MessageCircle/>} color="border-purple-500" links={[{name: "CareerVidz", url: "https://www.youtube.com/@CareerVidz"}, {name: "English Lucy", url: "https://www.youtube.com/@EnglishwithLucy"}]} />
        <ResourceCard title="DSA Practice" icon={<Code/>} color="border-orange-500" links={[{name: "LeetCode", url: "https://leetcode.com"}, {name: "GFG Practice", url: "https://www.geeksforgeeks.org"}]} />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <RoleCard title="Technical" roles={codingRoles} accentColor="bg-blue-500" icon={Code} />
        <RoleCard title="Functional" roles={nonCodingRoles} accentColor="bg-orange-500" icon={Users} />
      </div>
    </div>
  );
};

const ResourceCard = ({ title, icon, color, links }) => (
  <div className={`bg-white p-8 rounded-[3rem] border-b-8 ${color} shadow-xl hover:-translate-y-2 transition-all`}>
    <div className="p-4 rounded-2xl w-fit mb-6 text-slate-800 bg-slate-50">{icon}</div>
    <h3 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tighter">{title}</h3>
    <div className="space-y-3">
      {links.map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-colors">
          {link.name} <ChevronRight size={16}/>
        </a>
      ))}
    </div>
  </div>
);

const RoleCard = ({ roles, title, accentColor, icon: HeaderIcon }) => (
  <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl border-t-8 border-slate-800 relative overflow-hidden group">
    <div className={`absolute -top-24 -right-24 w-64 h-64 opacity-10 blur-[80px] rounded-full ${accentColor}`}></div>
    <h3 className={`text-2xl font-black mb-8 uppercase tracking-widest flex items-center gap-3 italic ${accentColor.replace('bg-', 'text-')}`}>
      <HeaderIcon size={30}/> {title}
    </h3>
    <div className="space-y-4 relative z-10">
      {roles.map((role, i) => (
        <div 
          key={i} 
          onClick={() => alert(`Ask our SIT AI Chatbox for ${role.title} roadmap! 🤖`)}
          className={`p-5 bg-slate-900/50 backdrop-blur-sm rounded-3xl border ${role.border} hover:bg-slate-900 transition-all cursor-pointer group/item active:scale-95`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-slate-800 rounded-xl ${role.color} group-hover/item:scale-110 transition-transform`}>
              {role.icon}
            </div>
            <div>
              <h4 className="text-white font-black italic tracking-tight">{role.title}</h4>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">{role.skills}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(!!localStorage.getItem('studentName'));
  const [placedList, setPlacedList] = useState([
    { name: "Monica C", regNo: "2022SIT001", company: "ZOHO", package: "8.5 LPA", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Monica" }
  ]);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Backend Offline");
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleShowDetails = (drive) => {
    setSelectedDrive(drive);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentName');
    setIsStudentLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 flex flex-col text-slate-900">
        
        {!isStudentLoggedIn ? (
          <Routes>
            <Route path="*" element={<StudentLogin onLogin={setIsStudentLoggedIn} />} />
          </Routes>
        ) : (
          <>
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-10 py-6 flex justify-between items-center border-b border-slate-100 shadow-sm">
              <Link to="/" className="text-2xl font-black text-blue-950 flex items-center gap-3 italic tracking-tighter uppercase no-underline">
                <div className="bg-blue-600 p-2 rounded-2xl text-white shadow-lg shadow-blue-200"><GraduationCap size={24}/></div> SIT Portal
              </Link>
              <div className="flex gap-8 font-black text-slate-400 items-center text-xs uppercase tracking-[0.2em]">
                <Link to="/" className="hover:text-blue-600 transition-colors no-underline">Home</Link>
                <Link to="/achievers" className="hover:text-blue-600 transition-colors no-underline">Achievers</Link>
                <Link to="/career-guide" className="hover:text-blue-600 transition-colors no-underline">Career Guide</Link>
                <Link to="/admin" className="bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-600 transition-all font-black no-underline">Admin</Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <LogOut size={16}/> Logout
                </button>
              </div>
            </nav>

            {/* Main Routes */}
            <main className="p-10 max-w-7xl mx-auto flex-grow w-full">
              <Routes>
                <Route path="/" element={<Home companies={companies} onShowDetails={handleShowDetails} />} />
                <Route path="/career-guide" element={<CareerGuide />} />
                <Route path="/admin" element={<Admin companies={companies} setCompanies={setCompanies} placedList={placedList} setPlacedList={setPlacedList} />} />
                <Route path="/achievers" element={<PlacedStudents placedList={placedList} setPlacedList={setPlacedList} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            {/* Modal */}
            {showModal && selectedDrive && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6" onClick={() => setShowModal(false)}>
                <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-8">
                    {selectedDrive.companyName} <br/>
                    <span className="text-blue-600 text-sm tracking-widest font-black italic">Selection Process</span>
                  </h2>
                  <div className="space-y-4">
                    {selectedDrive.rounds?.map((round, index) => (
                      <div key={index} className="flex gap-5 items-center p-5 bg-slate-50 rounded-[2rem] border group hover:bg-blue-50">
                        <div className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black group-hover:bg-blue-600">{index + 1}</div>
                        <div>
                          <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{round.trim()}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Mandatory Round</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-full mt-10 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">
                    Understood!
                  </button>
                </div>
              </div>
            )}
            <ChatAssistant />
          </>
        )}

        <footer className="text-center py-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100 mt-20">
          © 2026 Sethu Institute of Technology | Placement Cell
        </footer>
      </div>
    </Router>
  );
}