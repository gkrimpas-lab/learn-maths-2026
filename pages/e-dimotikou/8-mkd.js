// pages/e-dimotikou/8-mkd.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  MKD_VAL_MIN: 4,
  MKD_VAL_MAX: 60
};

export default function MkdPage() {
  const [mkdCount, setMkdCount] = useState(2);
  const [mkdValues, setMkdValues] = useState([12, 18, 24, 36]);

  // Math Helpers
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  const updateMkdValue = (index, increment) => {
    const newValues = [...mkdValues];
    newValues[index] = increment 
      ? Math.min(LIMITS.MKD_VAL_MAX, newValues[index] + 1) 
      : Math.max(LIMITS.MKD_VAL_MIN, newValues[index] - 1);
    setMkdValues(newValues);
  };

  const getDivisors = (num) => {
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const finalMkd = (() => {
    let currentGcd = mkdValues[0];
    for (let i = 1; i < mkdCount; i++) {
      currentGcd = gcd(currentGcd, mkdValues[i]);
    }
    return currentGcd;
  })();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) - LearnMaths.gr</title>
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
          <h2 className="text-2xl font-black text-gray-900">🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Μέγιστος Κοινός Διαιρέτης δύο ή περισσότερων φυσικών αριθμών λέγεται ο μεγαλύτερος από τους κοινούς διαιρέτες τους.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
              <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                {[2, 3, 4].map((n) => (
                  <button 
                    key={n} 
                    onClick={() => setMkdCount(n)} 
                    className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${mkdCount === n ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                  >
                    {n} Αριθμούς
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center gap-6">
              {Array.from({ length: mkdCount }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border min-w-[110px]">
                  <span className="text-[10px] font-bold text-gray-400">Αριθμός {idx + 1}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateMkdValue(idx, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300 transition">-</button>
                    <span className="font-black text-indigo-600 text-lg w-5 text-center">{mkdValues[idx]}</span>
                    <button onClick={() => updateMkdValue(idx, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300 transition">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm overflow-x-auto">
              <div className="space-y-3 min-w-[700px]">
                {Array.from({ length: mkdCount }).map((_, arrIdx) => {
                  const currentNum = mkdValues[arrIdx]; 
                  const divisorsList = getDivisors(currentNum);
                  return (
                    <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl">
                      <div className="w-14 font-black text-slate-700 text-xs border-r pr-2">Δ_{currentNum}:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {divisorsList.map((divValue) => {
                          const isCommon = mkdValues.slice(0, mkdCount).every(v => v % divValue === 0); 
                          const isMkd = divValue === finalMkd;
                          return (
                            <div 
                              key={divValue} 
                              className={`p-1.5 px-3 text-[11px] rounded-md font-bold border text-center min-w-[36px] ${
                                isMkd 
                                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200 relative scale-105' 
                                  : isCommon 
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                                    : 'bg-white border-gray-200 text-gray-600'
                              }`}
                            >
                              {isMkd && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px]">👑</span>}
                              {divValue}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl text-center shadow-md max-w-sm mx-auto">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-90 block">🏆 Μέγιστος Κοινός Διαιρέτης</span>
              <div className="text-xl font-black mt-1">
                ΜΚΔ({mkdValues.slice(0, mkdCount).join(', ')}) = <span className="bg-white text-emerald-600 px-3 py-0.5 rounded-lg text-2xl shadow-inner inline-block ml-1">{finalMkd}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
