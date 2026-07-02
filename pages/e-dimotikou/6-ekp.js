// pages/e-dimotikou/6-ekp.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  EKP_VAL_MIN: 2,
  EKP_VAL_MAX: 12
};

export default function EkpPage() {
  const [ekpCount, setEkpCount] = useState(2);
  const [ekpValues, setEkpValues] = useState([3, 4, 6, 8]);

  // Math Helpers
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const updateEkpValue = (index, increment) => {
    const newValues = [...ekpValues];
    newValues[index] = increment 
      ? Math.min(LIMITS.EKP_VAL_MAX, newValues[index] + 1) 
      : Math.max(LIMITS.EKP_VAL_MIN, newValues[index] - 1);
    setEkpValues(newValues);
  };

  const finalEkp = (() => {
    let currentLcm = ekpValues[0];
    for (let i = 1; i < ekpCount; i++) {
      currentLcm = lcm(currentLcm, ekpValues[i]);
    }
    return currentLcm;
  })();

  const getDynamicCountForNumber = (num) => Math.floor((finalEkp * 3) / num) + 1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ελάχιστο Κοινό Πολλαπλάσιο δύο ή περισσότερων φυσικών αριθμών λέγεται το μικρότερο από τα κοινά τους πολλαπλάσια, εκτός από το μηδέν.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
              <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                {[2, 3, 4].map((n) => (
                  <button 
                    key={n} 
                    onClick={() => setEkpCount(n)} 
                    className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${ekpCount === n ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                  >
                    {n} Αριθμούς
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center gap-6">
              {Array.from({ length: ekpCount }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border min-w-[110px]">
                  <span className="text-[10px] font-bold text-gray-400">Αριθμός {idx + 1}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateEkpValue(idx, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300 transition">-</button>
                    <span className="font-black text-cyan-600 text-lg w-4 text-center">{ekpValues[idx]}</span>
                    <button onClick={() => updateEkpValue(idx, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300 transition">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm overflow-x-auto">
              <div className="space-y-3 min-w-[700px]">
                {Array.from({ length: ekpCount }).map((_, arrIdx) => {
                  const currentNum = ekpValues[arrIdx]; 
                  const dynamicCount = getDynamicCountForNumber(currentNum);
                  return (
                    <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl">
                      <div className="w-14 font-black text-slate-700 text-xs border-r pr-2">Π_{currentNum}:</div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: dynamicCount }).map((_, mIdx) => {
                          const val = currentNum * mIdx; 
                          const isCommon = val > 0 && (val % finalEkp === 0); 
                          const isLcm = val === finalEkp;
                          return (
                            <div 
                              key={mIdx} 
                              className={`p-1.5 text-[11px] rounded-md font-bold border text-center min-w-[36px] ${
                                isLcm 
                                  ? 'bg-amber-400 text-white border-amber-600 ring-2 ring-amber-200 relative scale-105' 
                                  : isCommon 
                                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                    : 'bg-white border-gray-200 text-gray-600'
                              }`}
                            >
                              {isLcm && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px]">👑</span>}
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white p-4 rounded-2xl text-center shadow-md max-w-sm mx-auto">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-90 block">🎯 Ελάχιστο Κοινό Πολλαπλάσιο</span>
              <div className="text-xl font-black mt-1">
                ΕΚΠ({ekpValues.slice(0, ekpCount).join(', ')}) = <span className="bg-white text-amber-600 px-3 py-0.5 rounded-lg text-2xl shadow-inner inline-block ml-1">{finalEkp}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
