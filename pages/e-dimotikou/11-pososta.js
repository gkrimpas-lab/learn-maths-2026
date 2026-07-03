// pages/e-dimotikou/11-pososta.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PosostaPage() {
  // Μέρος 1ο: State για την έννοια του ποσοστού
  const [pct1, setPct1] = useState(25);

  // Μέρος 2ο: State για τον υπολογισμό πάνω σε ποσό
  const [amount, setAmount] = useState(280);
  const [pct2, setPct2] = useState(35);

  // Υπολογισμοί Μέρους 2
  const calculatedValue = Math.round((amount * pct2) / 100);
  const mathStep1 = amount * pct2;

  // Δημιουργία των 100 κουτιών για το πλέγμα
  const gridBoxes = Array.from({ length: 100 }, (_, i) => i < pct1);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏷️ Ποσοστά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* ΤΙΤΛΟΣ & ΕΙΣΑΓΩΓΗ */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
              🏷️ Ποσοστά
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Μελέτησε την έννοια του ποσοστού στο Πρώτο Μέρος και χρησιμοποίησε το Δεύτερο Μέρος για να υπολογίσεις την αξία του ποσοστού πάνω σε οποιοδήποτε ποσό ανεξάρτητα!
            </p>
          </div>

          {/* ΜΕΡΟΣ 1ο: Η ΕΝΝΟΙΑ ΤΟΥ ΠΟΣΟΣΤΟΥ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black text-gray-800 text-center flex items-center justify-center gap-2">
              🎨 Μέρος 1ο: Η Έννοια του Ποσοστού (Πλέγμα 100)
            </h3>

            {/* Ρυθμιστικό Ποσοστού 1 */}
            <div className="flex items-center justify-center gap-4 bg-slate-50 border p-4 rounded-2xl max-w-xl mx-auto shadow-inner">
              <span className="font-bold text-slate-700 text-sm">Άλλαξε το Ποσοστό (%):</span>
              <button onClick={() => setPct1(Math.max(0, pct1 - 5))} className="bg-cyan-500 text-white font-black w-8 h-8 rounded-lg text-xs hover:bg-cyan-600 transition shadow-sm">-5</button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={pct1} 
                onChange={(e) => setPct1(parseInt(e.target.value))}
                className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <button onClick={() => setPct1(Math.min(100, pct1 + 5))} className="bg-cyan-500 text-white font-black w-8 h-8 rounded-lg text-xs hover:bg-cyan-600 transition shadow-sm">+5</button>
              <span className="w-14 text-right font-black text-xl text-cyan-600">{pct1}%</span>
            </div>

            {/* Πλέγμα και Κάρτες Αναπαράστασης */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-4">
              
              {/* Πλέγμα 100 κουτιών */}
              <div className="grid grid-cols-10 gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm w-full max-w-[280px]">
                {gridBoxes.map((isFilled, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-sm transition-all duration-200 ${isFilled ? 'bg-cyan-500 shadow-sm' : 'bg-gray-100'}`}
                  ></div>
                ))}
              </div>

              {/* Τρεις Κάρτες (Σύμβολο, Κλάσμα, Δεκαδικός) */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-4 w-full max-w-md md:max-w-[200px]">
                <div className="bg-white p-4 rounded-xl border text-center shadow-sm flex flex-col justify-center items-center h-24">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">ΣΥΜΒΟΛΟ</span>
                  <span className="text-xl font-black text-slate-800 mt-1">{pct1}%</span>
                </div>
                <div className="bg-white p-4 rounded-xl border text-center shadow-sm flex flex-col justify-center items-center h-24">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">ΚΛΑΣΜΑ</span>
                  <div className="flex flex-col items-center font-black text-base text-slate-800 mt-1">
                    <div>{pct1}</div>
                    <div className="w-8 h-[1.5px] bg-slate-400 my-0.5"></div>
                    <div>100</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border text-center shadow-sm flex flex-col justify-center items-center h-24">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">ΔΕΚΑΔΙΚΟΣ</span>
                  <span className="text-xl font-black text-slate-800 mt-1">{(pct1 / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

            </div>
          </div>

          {/* ΜΕΡΟΣ 2ο: ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΠΑΝΩ ΣΕ ΠΟΣΟ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <h3 className="text-lg font-black text-gray-800 text-center flex items-center justify-center gap-2">
              🧮 Μέρος 2ο: Υπολογισμός Ποσοστού πάνω σε ένα Ποσό (Αυτόνομο)
            </h3>

            {/* Δύο Χειριστήρια δίπλα-δίπλα */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* 1. Ρύθμιση Ποσού */}
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2 text-center shadow-sm">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wide">1. ΡΥΘΜΙΣΕ ΤΟ ΠΟΣΟ</span>
                <div className="flex items-center bg-white p-2 px-4 rounded-xl border gap-4 shadow-inner">
                  <button onClick={() => setAmount(Math.max(10, amount - 20))} className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-slate-200 transition shadow-sm">-20</button>
                  <span className="w-16 text-center font-black text-2xl text-blue-600">{amount}</span>
                  <button onClick={() => setAmount(Math.min(1000, amount + 20))} className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-slate-200 transition shadow-sm">+20</button>
                </div>
              </div>

              {/* 2. Ρύθμιση Ποσοστού */}
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2 text-center shadow-sm">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wide">2. ΡΥΘΜΙΣΕ ΤΟ ΠΟΣΟΣΤΟ</span>
                <div className="flex items-center bg-white p-2 px-4 rounded-xl border gap-3 shadow-inner w-full max-w-xs">
                  <button onClick={() => setPct2(Math.max(0, pct2 - 5))} className="bg-cyan-500 text-white font-black w-7 h-7 rounded-md text-xs hover:bg-cyan-600 transition shadow-sm">-5</button>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={pct2} 
                    onChange={(e) => setPct2(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <button onClick={() => setPct2(Math.min(100, pct2 + 5))} className="bg-cyan-500 text-white font-black w-7 h-7 rounded-md text-xs hover:bg-cyan-600 transition shadow-sm">+5</button>
                  <span className="w-12 text-right font-black text-lg text-cyan-600">{pct2}%</span>
                </div>
              </div>

            </div>

            {/* Οπτική Κλίμακα / Μπάρα Προόδου */}
            <div className="max-w-4xl mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>Κλίμακα %: 0%</span>
                <span className="text-cyan-600 font-black">{pct2}%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden relative shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${pct2}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-0.5">
                <span>Ποσό: 0</span>
                <span className="text-blue-600 font-black text-xs">{calculatedValue}</span>
                <span>{amount}</span>
              </div>
            </div>

            {/* Μικρά κουμπιά Κλάσματος / Δεκαδικού */}
            <div className="flex justify-center gap-4 text-xs font-bold text-gray-500">
              <span className="bg-slate-100 border p-1.5 px-4 rounded-full shadow-sm">Κλάσμα: <span className="text-cyan-600 font-black">{pct2}/100</span></span>
              <span className="bg-slate-100 border p-1.5 px-4 rounded-full shadow-sm">Δεκαδικός: <span className="text-cyan-600 font-black">{(pct2 / 100).toFixed(2).replace('.', ',')}</span></span>
            </div>

            {/* ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ (Ακριβώς το λευκό box) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-4">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Η ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ:</span>
              
              <div className="flex flex-wrap items-center justify-center gap-3 font-black text-xl text-slate-700">
                <span className="text-blue-600 text-2xl">{amount}</span>
                <span className="text-slate-400">×</span>
                <div className="flex flex-col items-center text-cyan-600 text-lg">
                  <div>{pct2}</div>
                  <div className="w-10 h-[2px] bg-cyan-400 my-0.5"></div>
                  <div>100</div>
                </div>
                <span className="text-slate-400">=</span>
                <div className="flex flex-col items-center text-slate-700 text-base">
                  <div>{amount} × {pct2}</div>
                  <div className="w-24 h-[2px] bg-slate-400 my-0.5"></div>
                  <div>100</div>
                </div>
                <span className="text-slate-400">=</span>
                <div className="flex flex-col items-center text-slate-700 text-base">
                  <div>{mathStep1}</div>
                  <div className="w-16 h-[2px] bg-slate-400 my-0.5"></div>
                  <div>100</div>
                </div>
                <span className="text-slate-400">=</span>
                <span className="bg-emerald-600 text-white p-2 px-4 rounded-xl shadow text-2xl animate-pulse">
                  {calculatedValue}
                </span>
              </div>
            </div>

            {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
            <div className="bg-blue-600 text-white p-4 rounded-2xl text-center font-black text-sm md:text-base shadow-md max-w-xl mx-auto">
              🎯 Το <span className="text-amber-300">{pct2}%</span> του ποσού <span className="text-amber-300">{amount}</span> είναι ίσο με: <span className="text-yellow-200 text-xl ml-0.5">{calculatedValue}</span>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικά Ποσοστά.</p>
      </footer>
    </div>
  );
}
