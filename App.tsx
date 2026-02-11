
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StrengthTraining from './components/StrengthTraining';
import BalanceTrainer from './components/BalanceTrainer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0b0c0f] text-[#e7e9ee] flex flex-col">
        <header className="py-6 px-4 text-center border-b border-[#1d2230]">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight text-white hover:text-[#3d7cff] transition-colors">
              Gymnastics Feedback Trainer
            </h1>
          </Link>
          <p className="text-[#a7afc0] mt-2 text-sm uppercase tracking-widest">Master Your Stability</p>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/strength" element={<StrengthTraining />} />
            <Route path="/balance/:type" element={<BalanceTrainer />} />
          </Routes>
        </main>

        <footer className="py-4 text-center text-[#a7afc0] text-xs border-t border-[#1d2230]">
          &copy; {new Date().getFullYear()} Gym Balance Pro Prototype
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
