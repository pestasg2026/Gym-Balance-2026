
import React from 'react';
import { Link } from 'react-router-dom';

const EXERCISES = [
  {
    title: "Dynamic Skip (10 counts)",
    detail: "Standard rope skipping. Focus on light feet and consistent rhythm. This builds the elastic strength needed for vault and floor landings.",
    cue: "Focus: Quick feet & Elasticity"
  },
  {
    title: "Superman / Prone Extension (5 counts)",
    detail: "Lie flat on your stomach. Simultaneously lift opposite arm and leg (or both together for 'arch'). Hold the contraction to strengthen your lower back and glutes.",
    cue: "Focus: Arch shape & Posterior chain"
  },
  {
    title: "Stork Stand / Single Leg Balance (10s)",
    detail: "Stand on one leg, lifting the other to a 'passé' position or straight out. Keep your hips level and core tight to simulate beam stability.",
    cue: "Focus: Center of Gravity & Ankle control"
  },
  {
    title: "Standard Forearm Plank (10 counts)",
    detail: "The foundation of all gymnastics body shapes. Keep a 'hollow' body position with shoulders pushed away from the floor and hips tucked.",
    cue: "Focus: Hollow body & Core compression"
  },
  {
    title: "Elevated Apparatus Plank (10 counts)",
    detail: "Place your hands on a raised surface (bench, step, or block). This shifts weight to the shoulders, preparing you for handstand stability.",
    cue: "Focus: Shoulder Girdle & Inclined Stability"
  }
];

const StrengthTraining: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-16 text-center space-y-4">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Strength Lab</h2>
        <div className="w-24 h-1 bg-[#9254ff] mx-auto rounded-full"></div>
        <p className="text-[#a7afc0] max-w-xl mx-auto text-lg font-medium">
          The foundation of stability is built here. Master these technical movements to improve your performance in the Balance Trainer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {EXERCISES.map((ex, i) => (
          <div key={i} className="group bg-[#111319] border border-[#1d2230] rounded-[2rem] p-8 lg:p-12 transition-all duration-500 hover:border-[#9254ff]/40 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#9254ff]/5 blur-[60px] rounded-full group-hover:bg-[#9254ff]/10 transition-colors"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              {/* Counter */}
              <div className="flex-shrink-0 bg-[#1d2230] group-hover:bg-[#9254ff] text-white w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl transition-all duration-500">
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="mb-4">
                  <h3 className="text-3xl font-black text-white italic uppercase mb-2 group-hover:text-[#9254ff] transition-colors leading-tight">
                    {ex.title}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-[#9254ff]/20 border border-[#9254ff]/30 rounded-full">
                    <span className="text-[#9254ff] text-xs font-black uppercase tracking-widest">{ex.cue}</span>
                  </div>
                </div>
                
                <p className="text-[#a7afc0] text-lg leading-relaxed mb-6 font-medium">
                  {ex.detail}
                </p>

                <div className="flex items-center gap-3 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
                  <svg className="w-4 h-4 text-[#2cbb5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Drill
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-[#1a1c23] to-[#0b0c0f] border border-[#1d2230] rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9254ff]/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3d7cff]/5 blur-[100px] rounded-full"></div>
        
        <h4 className="text-white text-3xl font-black italic uppercase mb-4 relative z-10">Circuit Finished?</h4>
        <p className="text-[#a7afc0] text-lg mb-10 max-w-xl mx-auto font-medium relative z-10">
          Your foundational strength has increased. Head back to the trainer to test your stability on the mats.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-[#9254ff] text-white px-14 py-5 rounded-[1.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(146,84,255,0.3)] relative z-10"
        >
          RESUME BALANCE TRAINING
        </Link>
      </div>
    </div>
  );
};

export default StrengthTraining;
