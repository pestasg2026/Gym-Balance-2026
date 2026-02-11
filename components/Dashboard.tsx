
import React from 'react';
import { Link } from 'react-router-dom';
import { BALANCE_ACTIVITIES } from '../constants';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">Select Your Discipline</h2>
        <p className="text-[#a7afc0] max-w-xl mx-auto text-lg">Harness real-time pose estimation to master your gymnastics foundational skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {BALANCE_ACTIVITIES.map((activity) => (
          <Link
            key={activity.id}
            to={`/balance/${activity.id}`}
            className="group relative bg-[#111319] border border-[#1d2230] rounded-3xl p-8 transition-all duration-500 hover:bg-[#161821] hover:border-[#3d7cff] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-4 right-4 text-xs font-black text-[#1d2230] group-hover:text-[#3d7cff] transition-colors">LEVEL 1</div>
            <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 inline-block">{activity.icon}</div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-3 group-hover:text-[#3d7cff] transition-colors">{activity.title}</h3>
            <p className="text-[#a7afc0] text-sm leading-relaxed mb-6 font-medium">{activity.description}</p>
            <div className="flex items-center text-[#3d7cff] font-bold text-sm tracking-widest uppercase">
              Begin Training
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}

        <Link
          to="/strength"
          className="group relative bg-gradient-to-br from-[#111319] to-[#0a0a0a] border border-[#1d2230] rounded-3xl p-8 transition-all duration-500 hover:border-[#9254ff] shadow-xl"
        >
          <div className="text-5xl mb-6 group-hover:animate-pulse">🏋️</div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-3 group-hover:text-[#9254ff] transition-colors">Strength Lab</h3>
          <p className="text-[#a7afc0] text-sm leading-relaxed mb-6 font-medium">Build the essential muscle groups required for elite balance holds.</p>
          <div className="flex items-center text-[#9254ff] font-bold text-sm tracking-widest uppercase">
            View Protocol
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
