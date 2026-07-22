// pages/d-dimotikou/5-baros.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const WEIGHT_LIMITS = {
  min: 0,
  max: 2500,
  step: 1
};

export default function BarosPage() {
  const [weightInG, setWeightInG] = useState(1500);

  const adjustWeight = (amount) => {
    setWeightInG((prev) => Math.max(WEIGHT_LIMITS.min, Math.min(WEIGHT_LIMITS.max, prev + amount)));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Μέτρηση Βάρους - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-orange-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">⚖️ Μετρώ το Βάρος</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Βασική μονάδα μέτρησης του βάρους (μάζας) είναι το <strong>κιλό ή χιλιόγραμμο (kg)</strong>. Για μικρότερα αντικείμενα χρησιμοποιούμε το <strong>γραμμάριο (g)</strong>, ενώ για πολύ βαριά τον <strong>τόνο (t)</strong>!
                </p>
                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 text-sm xl:text-base text-orange-900 space-y-2 shadow-inner">
                  <p>⚖️ <strong>1 κιλό (kg) = 1.000 γραμμάρια (g)</strong></p>
                  <p>🚚 <strong>1 τόνος (t) = 1.000 κιλά (kg)</strong></p>
                </div>
              </div>

              {/* ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΟΣ */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-8 rounded-2xl shadow-md text-center py-10 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-orange-200">Βάρος σε Γραμμάρια</span>
                <div className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-white">
                  {weightInG} <span className="text-2xl xl:text-3xl font-bold text-orange-200">g</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-lg xl:text-xl font-mono font-bold text-orange-50">
                  = <span className="text-amber-300 font-extrabold">{(weightInG / 1000).toFixed(3)}</span> kg
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΗ ΖΥΓΑΡΙΑ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-black text-center text-gray-800 xl:text-2xl">
                🎚️ Ζύγισε τα αντικείμενα στη ψηφιακή ζυγαριά!
              </h3>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto space-y-8">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΑ & SLIDER */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>0 g</span>
                    <span className="text-orange-600 font-extrabold text-base">{weightInG} g</span>
                    <span>2.500 g (2,5 kg)</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjustWeight(-1)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl text-xs font-black shadow-sm transition active:scale-95"
                    >
                      -1g
                    </button>
                    <input
                      type="range"
                      min={WEIGHT_LIMITS.min}
                      max={WEIGHT_LIMITS.max}
                      step={WEIGHT_LIMITS.step}
                      value={weightInG}
                      onChange={(e) => setWeightInG(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-200 accent-orange-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => adjustWeight(1)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl text-xs font-black shadow-sm transition active:scale-95"
                    >
                      +1g
                    </button>
                  </div>
                </div>

                {/* ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-inner">
                  <div className="w-56 bg-slate-300 h-10 rounded-t-2xl border-b-4 border-slate-400 relative flex items-center justify-center pt-2 shadow-sm">
                    {/* Δυναμικό Εικονίδιο Αντικειμένου */}
                    <div className="absolute -top-12 text-5xl transition-all duration-200 drop-shadow-md select-none">
                      {weightInG === 0 && '🪶'}
                      {weightInG > 0 && weightInG <= 500 && '🍓'}
                      {weightInG > 500 && weightInG <= 1000 && '📦'}
                      {weightInG > 1000 && weightInG <= 2000 && '🍍'}
                      {weightInG > 2000 && '🍉'}
                    </div>
                  </div>

                  {/* Ψηφιακή Οθόνη */}
                  <div className="w-48 bg-slate-900 text-emerald-400 font-mono font-black text-3xl text-center py-4 rounded-b-2xl border-4 border-slate-700 shadow-2xl tracking-wider">
                    {weightInG} <span className="text-sm text-emerald-500 font-sans">g</span>
                  </div>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-3 block">
                    📟 Ψηφιακή Ζυγαριά
                  </span>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
