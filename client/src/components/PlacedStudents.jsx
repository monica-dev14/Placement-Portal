import React from 'react';
import { Trophy, Building2, User, Trash2, IndianRupee, Star } from 'lucide-react';

const PlacedStudents = ({ placedList, setPlacedList }) => {
  
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to remove this achiever?")) {
      const updatedList = placedList.filter((_, i) => i !== index);
      setPlacedList(updatedList);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 -top-10 flex justify-center opacity-5 select-none pointer-events-none">
          <h1 className="text-9xl font-black uppercase">Success</h1>
        </div>
        <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center justify-center gap-4">
          <Star className="text-yellow-400 fill-yellow-400" size={32} />
          Our Achievers
          <Star className="text-yellow-400 fill-yellow-400" size={32} />
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-blue-600"></span>
          <p className="text-blue-600 font-black uppercase text-xs tracking-[0.4em]">
            Celebrating SIT's Pride
          </p>
          <span className="h-px w-10 bg-blue-600"></span>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {placedList.length > 0 ? (
          placedList.map((student, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-[3rem] p-8 border-2 border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Floating Badge for Package */}
              {student.package && (
                <div className="absolute top-6 left-6 z-20 bg-slate-900 text-white px-4 py-1.5 rounded-2xl flex items-center gap-1 shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <IndianRupee size={12} className="text-green-400" />
                  <span className="font-black text-[11px] tracking-tighter">{student.package}</span>
                </div>
              )}

              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(index)}
                className="absolute top-6 right-6 p-2.5 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white z-20 shadow-lg"
              >
                <Trash2 size={18} />
              </button>

              {/* Profile Image Section */}
              <div className="relative z-10 mb-8">
                <div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl group-hover:border-blue-50 transition-colors duration-500">
                  {student.imageUrl ? (
                    <img 
                      src={student.imageUrl} 
                      alt={student.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User size={48} className="text-slate-300" />
                    </div>
                  )}
                </div>
                {/* Trophy Badge */}
                <div className="absolute -bottom-3 right-8 bg-green-500 text-white p-2.5 rounded-2xl shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-500">
                  <Trophy size={20} />
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center space-y-4 relative z-10">
                <div className="space-y-1">
                  <h3 className="font-black text-2xl text-slate-900 uppercase italic leading-none tracking-tighter group-hover:text-blue-600 transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Batch 2022-26</p>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-2xl text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Building2 size={14} className="group-hover:animate-bounce" />
                  <span className="font-black uppercase text-[11px] tracking-widest">{student.company}</span>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-all duration-1000" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <User size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase text-sm tracking-[0.3em]">No Achievers to display yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacedStudents;