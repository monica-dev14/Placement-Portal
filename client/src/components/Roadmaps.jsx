import React, { useState } from 'react';
import { Code, Database, Terminal, ShieldCheck, Cloud, CheckCircle2, Map } from 'lucide-react';

const Roadmaps = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const rolesData = [
    {
      id: 'fds',
      title: "Full Stack Developer",
      desc: "Build complete websites (Frontend + Backend).",
      icon: <Code className="text-orange-500" size={30} />,
      skills: ["HTML5 & CSS3 (Layouts)", "JavaScript (Logic & DOM)", "React.js (Frontend UI)", "Node.js & Express (Server)", "MongoDB (Database)"]
    },
    {
      id: 'backend',
      title: "Backend Engineer",
      desc: "Manage servers, APIs and database logic.",
      icon: <Database className="text-blue-500" size={30} />,
      skills: ["Python / Java", "SQL & NoSQL Databases", "RESTful APIs", "Authentication (JWT/OAuth)", "System Design Basics"]
    },
    {
      id: 'ds',
      title: "Data Scientist",
      desc: "Analyze data for business insights.",
      icon: <Terminal className="text-purple-500" size={30} />,
      skills: ["Python (Pandas, NumPy)", "Statistics & Probability", "SQL for Data", "Machine Learning basics", "Data Visualization"]
    },
    {
      id: 'cyber',
      title: "Cyber Security",
      desc: "Protect systems and networks from threats.",
      icon: <ShieldCheck className="text-red-500" size={30} />,
      skills: ["Networking Fundamentals", "Linux Administration", "Ethical Hacking", "Cryptography", "Security Auditing"]
    },
    {
      id: 'cloud',
      title: "Cloud Engineer",
      desc: "Manage apps on AWS/Azure/Google Cloud.",
      icon: <Cloud className="text-sky-500" size={30} />,
      skills: ["Cloud Providers (AWS/Azure)", "Docker & Kubernetes", "CI/CD Pipelines", "Linux Servers", "Infrastructure as Code"]
    }
  ];

  return (
    <div className="space-y-8 mt-10">
      <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
        <Map className="text-blue-600" /> Choose Your Career Path
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rolesData.map((role) => (
          <div 
            key={role.id}
            onClick={() => setSelectedRole(role.id === selectedRole ? null : role.id)}
            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
              selectedRole === role.id ? 'border-blue-600 bg-blue-50 shadow-xl' : 'border-gray-100 bg-white hover:border-blue-200'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gray-50 rounded-2xl">{role.icon}</div>
              <h4 className="text-xl font-bold text-gray-800">{role.title}</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">{role.desc}</p>
            </div>

            {selectedRole === role.id && (
              <div className="mt-6 space-y-3 animate-in zoom-in duration-300">
                {role.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-bold text-xs">{skill}</span>
                    <CheckCircle2 className="ml-auto text-green-400" size={14} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;