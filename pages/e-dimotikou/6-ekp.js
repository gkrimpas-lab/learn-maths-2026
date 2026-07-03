// pages/e-dimotikou/6-ekp.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 2,
  NUM_MAX: 30,
  COUNT_SHOW: 40
};

export default function EkpPage() {
  // Πλήθος αριθμών προς εξέταση (2, 3 ή 4)
  const [numCount, setNumCount] = useState(2);

  // Οι τιμές για έως και 4 αριθμούς
  const [n1, setN1] = useState(4);
  const [n2, setN2] = useState(6);
  const [n3, setN3] = useState(3);
  const [n4, setN4] = useState(8);

  // Συναρτήσεις υπολογισμού ΜΚΔ και ΕΚΠ (Μέσα στο component για να μην υπάρχει θέμα με το SSR)
  const findGCD = (a, b) => {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };
  
  const findLCMOfTwo = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return (a * b) / findGCD(a, b);
  };

  // Υπολογισμός του τελικού ΕΚΠ δυναμικά βάσει του πλήθους των αριθμών
  let ekpResult = findLCMOfTwo(n1, n2);
  if (numCount >= 3) ekpResult = findLCMOfTwo(ekpResult, n3);
  if (numCount === 4) ekpResult = findLCMOfTwo(ekpResult, n4);

  // Παραγωγή λιστών (πολλαπλάσια από το 1 έως το 12)
  const list1 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n1 * (i + 1));
  const list2 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n2 * (i + 1));
  const list3 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n3 * (i + 1));
  const list4 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n4 * (i + 1));

  // Συνάρτηση ελέγχου αν ένας αριθμός είναι κοινό πολλαπλάσιο όλων των επιλεγμένων
  const isCommonMultiple = (val) => {
    if (numCount === 2) return val % n1 === 0 && val % n2 === 0;
    if (numCount === 3) return val % n1 === 0 && val % n2 === 0 && val % n3 === 0;
    return val % n1 === 0 && val % n2 === 0 && val % n3 === 0 && val % n4 === 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - LearnMaths.gr</title>
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) δύο ή περισσότερων αριθμών είναι το <strong>μικρότερο κοινό πολλαπλάσιό τους</strong> (εκτός από το 0).
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΑΡΙΘΜΩΝ */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <span className="text-xs uppercase font-black text-gray-400 tracking-wider">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
                <div className="inline-flex p-1.5 bg-slate-200 rounded-2xl shadow-inner gap-1">
                  {[2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setNumCount(count)}
                      className={`px-5 py-2 rounded-xl font-black text-sm transition shadow-sm ${numCount === count ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-300'}`}
                    >
                      {count} Αριθμούς
                    </button>
                  ))}
                </div>
              </div>

              {/* ΔΥΝΑΜΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΑΡΙΘΜΩΝ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {/* Αριθμός 1 */}
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 flex flex-col items-center space-y-2 shadow-sm text-center">
                  <span className="font-black text-blue-700 text-xs uppercase tracking-wide">1ος Αριθμός</span>
                  <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-blue-100 gap-3">
                    <button onClick={() => setN1(Math.max(LIMITS.NUM_MIN, n1 - 1))} className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full font-black hover:bg-blue-200 transition shadow-sm">-</button>
                    <span className="w-6 text-center font-black text-xl text-blue-600">{n1}</span>
                    <button onClick={() => setN1(Math.min(LIMITS.NUM_MAX, n1 + 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-black hover:bg-blue-700 transition shadow-sm">+</button>
                  </div>
                </div>

                {/* Αριθμός 2 */}
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 flex flex-col items-center space-y-2 shadow-sm text-center">
                  <span className="font-black text-indigo-700 text-xs uppercase tracking-wide">2ος Αριθμός</span>
                  <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-indigo-100 gap-3">
                    <button onClick={() => setN2(Math.max(LIMITS.NUM_MIN, n2 - 1))} className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full font-black hover:bg-indigo-200 transition shadow-sm">-</button>
                    <span className="w-6 text-center font-black text-xl text-indigo-600">{n2}</span>
                    <button onClick={() => setN2(Math.min(LIMITS.NUM_MAX, n2 + 1))} className="bg-indigo-600 text-white w-8 h-8 rounded-full font-black hover:bg-indigo-700 transition shadow-sm">+</button>
                  </div>
                </div>

                {/* Αριθμός 3 (Δυναμικός) */}
                {numCount >= 3 ? (
                  <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 flex flex-col items-center space-y-2 shadow-sm text-center animate-fade-in">
                    <span className="font-black text-purple-700 text-xs uppercase tracking-wide">3ος Αριθμός</span>
                    <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-purple-100 gap-3">
                      <button onClick={() => setN3(Math.max(LIMITS.NUM_MIN, n3 - 1))} className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full font-black hover:bg-purple-200 transition shadow-sm">-</button>
                      <span className="w-6 text-center font-black text-xl text-purple-600">{n3}</span>
                      <button onClick={() => setN3(Math.min(LIMITS.NUM_MAX, n3 + 1))} className="bg-purple-600 text-white w-8 h-8 rounded-full font-black hover:bg-purple-700 transition shadow-sm">+</button>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex bg-gray-50/40 p-4 rounded-2xl border border-dashed border-gray-200 flex-col items-center justify-center opacity-40 text-center">
                    <span className="text-xs font-bold text-gray-400">Διαθέσιμο</span>
                  </div>
                )}

                {/* Αριθμός 4 (Δυναμικός) */}
                {numCount === 4 ? (
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-col items-center space-y-2 shadow-sm text-center animate-fade-in">
                    <span className="font-black text-emerald-700 text-xs uppercase tracking-wide">4ος Αριθμός</span>
                    <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-emerald-100 gap-3">
                      <button onClick={() => setN4(Math.max(LIMITS.NUM_MIN, n4 - 1))} className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full font-black hover:bg-emerald-200 transition shadow-sm">-</button>
                      <span className="w-6 text-center font-black text-xl text-emerald-600">{n4}</span>
                      <button onClick={() => setN4(Math.min(LIMITS.NUM_MAX, n4 + 1))} className="bg-emerald-600 text-white w-8 h-8 rounded-full font-black hover:bg-emerald-700 transition shadow-sm">+</button>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex bg-gray-50/40 p-4 rounded-2xl border border-dashed border-gray-200 flex-col items-center justify-center opacity-40 text-center">
                    <span className="text-xs font-bold text-gray-400">Διαθέσιμο</span>
                  </div>
                )}
              </div>

              {/* ΠΑΡΑΘΕΣΗ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
              <div className="space-y-4 max-w-5xl mx-auto">
                {/* Λίστα 1 */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Πολλαπλάσια του {n1}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                    {list1.map((v) => (
                      <span key={v} className={`p-1.5 px-2.5 rounded-lg border ${v === ekpResult ? 'bg-amber-500 text-white border-amber-400 font-black scale-105 shadow' : isCommonMultiple(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                    ))}
                    <span className="text-gray-400 font-mono self-center">...</span>
                  </div>
                </div>

                {/* Λίστα 2 */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Πολλαπλάσια του {n2}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                    {list2.map((v) => (
                      <span key={v} className={`p-1.5 px-2.5 rounded-lg border ${v === ekpResult ? 'bg-amber-500 text-white border-amber-400 font-black scale-105 shadow' : isCommonMultiple(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                    ))}
                    <span className="text-gray-400 font-mono self-center">...</span>
                  </div>
                </div>

                {/* Λίστα 3 (Δυναμική) */}
                {numCount >= 3 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1 animate-fade-in">
                    <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Πολλαπλάσια του {n3}</span>
                    <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                      {list3.map((v) => (
                        <span key={v} className={`p-1.5 px-2.5 rounded-lg border ${v === ekpResult ? 'bg-amber-500 text-white border-amber-400 font-black scale-105 shadow' : isCommonMultiple(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                      ))}
                      <span className="text-gray-400 font-mono self-center">...</span>
                    </div>
                  </div>
                )}

                {/* Λίστα 4 (Δυναμική) */}
                {numCount === 4 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1 animate-fade-in">
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Πολλαπλάσια του {n4}</span>
                    <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                      {list4.map((v) => (
                        <span key={v} className={`p-1.5 px-2.5 rounded-lg border ${v === ekpResult ? 'bg-amber-500 text-white border-amber-400 font-black scale-105 shadow' : isCommonMultiple(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                      ))}
                      <span className="text-gray-400 font-mono self-center">...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl text-center shadow-lg max-w-xl mx-auto space-y-2">
                <span className="text-xs uppercase font-black text-blue-200 tracking-wider block">Το Ελάχιστο Κοινό Πολλαπλάσιο</span>
                <div className="text-xl sm:text-2xl font-black">
                  ΕΚΠ = <span className="text-amber-300 text-3xl sm:text-4xl ml-1 inline-block animate-pulse">{ekpResult}</span>
                </div>
                <p className="text-xs text-blue-100 opacity-90">
                  Το {ekpResult} είναι ο μικρότερος αριθμός που διαιρείται ακριβώς με όλους τους επιλεγμένους αριθμούς!
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Δυναμικός Υπολογισμός ΕΚΠ.</p>
      </footer>
    </div>
  );
}
