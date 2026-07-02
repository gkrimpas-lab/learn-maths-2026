// pages/e-dimotikou/11-pososta.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  PERCENT_MIN: 0,
  PERCENT_MAX: 100,
  AMOUNT_MIN: 10,
  AMOUNT_MAX: 1000
};

export default function PosostaPage() {
  // Μέρος 1ο: Έννοια και Πλέγμα Κατανόησης
  const [percentVal, setPercentVal] = useState(25);

  // Μέρος 2ο: Ανεξάρτητος Υπολογισμός Ποσού
  const [calcPercent, setCalcPercent] = useState(35);
  const [totalAmount, setTotalAmount] = useState(280);

  // Υπολογισμός τελικής αξίας ποσοστού
  const calculatedPercentageResult = ((totalAmount * calcPercent) / 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🏷️ Ποσοστά - LearnMaths.gr</title>
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
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">🏷️ Ποσοστά</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Μελέτησε την έννοια του ποσοστού στο Πρώτο Μέρος και χρησιμοποίησε το Δεύτερο Μέρος για να υπολογίσεις την αξία του ποσοστού πάνω σε οποιοδήποτε ποσό ανεξάρτητα!</p>
        </div>

        {/* ΜΕΡΟΣ 1ο: ΕΝΝΟΙΑ & ΠΛΕΓΜΑ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-base font-bold text-slate-800 text-center">🎨 Μέρος 1ο: Η Έννοια του Ποσοστού (Πλέγμα 100)</h3>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
            <span className="font-bold text-gray-700 text-sm">Άλλαξε το Ποσοστό (%):</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPercentVal(Math.max(LIMITS.PERCENT_MIN, percentVal - 5))} className="bg-cyan-500 text-white p-1 px-2.5 rounded font-bold text-xs shadow-sm hover:bg-cyan-600 transition">-5</button>
              <input type="range" min={LIMITS.PERCENT_MIN} max={LIMITS.PERCENT_MAX} value={percentVal} onChange={(e) => setPercentVal(parseInt(e.target.value, 10))} className="w-28 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
              <button onClick={() => setPercentVal(Math.min(LIMITS.PERCENT_MAX, percentVal + 5))} className="bg-cyan-500 text-white p-1 px-2.5 rounded font-bold text-xs shadow-sm hover:bg-cyan-600 transition">+5</button>
              <span className="w-16 text-center text-xl font-black text-cyan-600 ml-1">{percentVal}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-2">
            <div className="grid grid-cols-10 gap-1 p-2 bg-white rounded-xl shadow-md border w-full max-w-[240px] mx-auto">
              {Array.from({ length: 100 }).map((_, index) => (
                <div key={index} className={`aspect-square rounded-[2px] transition-all duration-150 ${index < percentVal ? 'bg-gradient-to-br from-cyan-400 to-blue-500 scale-95' : 'bg-slate-100'}`}/>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border"><span className="text-[10px] font-bold text-gray-400 block">ΣΥΜΒΟΛΟ</span><span className="text-xl font-black text-slate-800">{percentVal}%</span></div>
              <div className="bg-slate-50 p-2.5 rounded-lg border"><span className="text-[10px] font-bold text-gray-400 block">ΚΛΑΣΜΑ</span><div className="flex flex-col items-center font-black text-sm text-slate-800"><div>{percentVal}</div><div className="w-6 h-[1.5px] bg-slate-700 my-0.5"></div><div>100</div></div></div>
              <div className="bg-slate-50 p-2.5 rounded-lg border"><span className="text-[10px] font-bold text-gray-400 block">ΔΕΚΑΔΙΚΟΣ</span><span className="text-xl font-black text-slate-800">{(percentVal / 100).toFixed(2).replace('.', ',')}</span></div>
            </div>
          </div>
        </div>

        {/* ΜΕΡΟΣ 2ο: ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΥ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-base font-bold text-slate-800 text-center">🧮 Μέρος 2ο: Υπολογισμός Ποσοστού πάνω σε ένα Ποσό (Αυτόνομο)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Ρύθμιση Ποσού */}
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center gap-2">
              <span className="font-bold text-gray-700 text-xs uppercase opacity-75">1. Ρύθμισε το Ποσό</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setTotalAmount(Math.max(LIMITS.AMOUNT_MIN, totalAmount - 20))} className="bg-slate-200 px-2 py-1 rounded font-black text-xs shadow-sm hover:bg-slate-300 transition">-20</button>
                <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Math.max(LIMITS.AMOUNT_MIN, Math.min(LIMITS.AMOUNT_MAX, parseInt(e.target.value, 10) || LIMITS.AMOUNT_MIN)))} className="w-20 text-center text-xl font-black text-indigo-600 bg-indigo-50/50 border rounded-lg p-0.5 focus:outline-none"/>
                <button onClick={() => setTotalAmount(Math.min(LIMITS.AMOUNT_MAX, totalAmount + 20))} className="bg-slate-200 px-2 py-1 rounded font-black text-xs shadow-sm hover:bg-slate-300 transition">+20</button>
              </div>
            </div>

            {/* Ρύθμιση Ποσοστού */}
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center gap-2">
              <span className="font-bold text-gray-700 text-xs uppercase opacity-75">2. Ρύθμισε το Ποσοστό</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCalcPercent(Math.max(LIMITS.PERCENT_MIN, calcPercent - 5))} className="bg-cyan-500 text-white p-1 px-2 rounded font-bold text-xs shadow-sm hover:bg-cyan-600 transition">-5</button>
                <input type="range" min={LIMITS.PERCENT_MIN} max={LIMITS.PERCENT_MAX} value={calcPercent} onChange={(e) => setCalcPercent(parseInt(e.target.value, 10))} className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                <button onClick={() => setCalcPercent(Math.min(LIMITS.PERCENT_MAX, calcPercent + 5))} className="bg-cyan-500 text-white p-1 px-2 rounded font-bold text-xs shadow-sm hover:bg-cyan-600 transition">+5</button>
                <span className="w-14 text-center text-lg font-black text-cyan-600 ml-1">{calcPercent}%</span>
              </div>
            </div>
          </div>

          {/* Γραφική Ράβδος Διπλής Κλίμακας */}
          <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-2 max-w-3xl mx-auto">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
              <span>Κλίμακα %: 0%</span>
              <span style={{ marginLeft: `${calcPercent}%`, transform: 'translateX(-50%)' }} className="text-cyan-600 font-black text-xs transition-all duration-300">{calcPercent}%</span>
              <span className="ml-auto">100%</span>
            </div>
            <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden border relative flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-md transition-all duration-300" style={{ width: `${calcPercent}%` }}/>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
              <span>Ποσό: 0</span>
              <span style={{ marginLeft: `${calcPercent}%`, transform: 'translateX(-50%)' }} className="text-indigo-600 font-black text-xs transition-all duration-300">{calculatedPercentageResult.replace('.0', '')}</span>
              <span className="ml-auto">{totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
            <div className="bg-slate-50 p-2 rounded-xl border text-xs font-semibold text-gray-600 shadow-sm">
              Κλάσμα: <span className="font-black text-cyan-600">{calcPercent}/100</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border text-xs font-semibold text-gray-600 shadow-sm">
              Δεκαδικός: <span className="font-black text-cyan-600">{(calcPercent / 100).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* ΜΑΘΗΜΑΤΙΚΟ ΚΟΥΤΙ ΠΡΑΞΗΣ */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="text-center text-xs font-bold text-slate-500 uppercase">Η Μαθηματική Επίλυση:</div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-black text-xl text-slate-700 text-center">
              <span className="text-indigo-600">{totalAmount}</span>
              <span className="text-gray-400">×</span>
              <div className="flex flex-col items-center font-bold text-lg text-cyan-600 px-1 bg-slate-50 border rounded-lg p-1">
                <div>{calcPercent}</div><div className="w-8 h-[2px] bg-cyan-500 my-0.5"></div><div>100</div>
              </div>
              <span className="text-gray-400">=</span>
              <div className="flex flex-col items-center font-bold text-lg text-slate-600 px-1">
                <div>{totalAmount} × {calcPercent}</div><div className="w-24 h-[2px] bg-slate-400 my-0.5"></div><div>100</div>
              </div>
              <span className="text-gray-400">=</span>
              <div className="flex flex-col items-center font-bold text-lg text-slate-600 px-1">
                <div>{totalAmount * calcPercent}</div><div className="w-16 h-[2px] bg-slate-400 my-0.5"></div><div>100</div>
              </div>
              <span className="text-emerald-500 text-2xl font-black">=</span>
              <span className="bg-emerald-600 text-white p-1 px-4 rounded-xl text-2xl shadow-md border border-emerald-500">
                {calculatedPercentageResult.replace('.0', '')}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl text-center font-bold text-sm shadow-md max-w-xl mx-auto">
            🎯 Το <span className="text-amber-300 font-black">{calcPercent}%</span> του ποσού <span className="text-amber-300 font-black">{totalAmount}</span> είναι ίσο με: <span className="text-emerald-300 font-black text-lg">{calculatedPercentageResult.replace('.0', '')}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
