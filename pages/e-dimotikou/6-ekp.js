// pages/e-dimotikou/6-ekp.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 2,
  NUM_MAX: 15,
  COUNT_SHOW: 10 // Πόσα πολλαπλάσια θα παράγουμε για τον έλεγχο (εκτός του 0)
};

export default function EkpPage() {
  // Οι δύο αριθμοί για τους οποίους ψάχνουμε το ΕΚΠ
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(6);

  // Συναρτησούλα για την εύρεση του ΜΚΔ (βοηθάει στον εύκολο υπολογισμό του ΕΚΠ μαθηματικά)
  const findGCD = (a, b) => {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Μαθηματικός υπολογισμός του ΕΚΠ: (a * b) / ΜΚΔ(a,b)
  const realGCD = findGCD(num1, num2);
  const ekpResult = (num1 * num2) / realGCD;

  // Παραγωγή λίστας πολλαπλασίων από το 1 έως το 10 (παραλείπουμε το 0 για την εύρεση του ΕΚΠ)
  const list1 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => num1 * (i + 1));
  const list2 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => num2 * (i + 1));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - Fluid */}
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
                Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) δύο ή περισσότερων φυσικών αριθμών ονομάζεται το <strong>μικρότερο από τα κοινά πολλαπλάσιά τους</strong>, φυσικά <strong>εκτός από το μηδέν</strong>!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* 1. ΕΠΙΛΟΓΗ ΔΥΟ ΑΡΙΘΜΩΝ */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap justify-center items-center gap-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-600 text-sm">1ος Αριθμός:</span>
                  <button onClick={() => setNum1(Math.max(LIMITS.NUM_MIN, num1 - 1))} className="bg-blue-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-blue-600 transition shadow-sm">-</button>
                  <span className="w-8 text-center font-black text-xl text-blue-600">{num1}</span>
                  <button onClick={() => setNum1(Math.min(LIMITS.NUM_MAX, num1 + 1))} className="bg-blue-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-blue-600 transition shadow-sm">+</button>
                </div>
                
                <div className="w-[1px] h-8 bg-gray-200 hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-600 text-sm">2ος Αριθμός:</span>
                  <button onClick={() => setNum2(Math.max(LIMITS.NUM_MIN, num2 - 1))} className="bg-indigo-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-indigo-600 transition shadow-sm">-</button>
                  <span className="w-8 text-center font-black text-xl text-indigo-600">{num2}</span>
                  <button onClick={() => setNum2(Math.min(LIMITS.NUM_MAX, num2 + 1))} className="bg-indigo-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-indigo-600 transition shadow-sm">+</button>
                </div>
              </div>

              {/* 2. ΠΑΡΑΘΕΣΗ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
              <div className="space-y-4 max-w-4xl mx-auto">
                
                {/* Λίστα 1 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Πολλαπλάσια του {num1}</span>
                  <div className="flex flex-wrap gap-2 pt-2 text-sm sm:text-base font-bold">
                    {list1.map((val) => {
                      const isEKP = val === ekpResult;
                      const isCommon = val % num2 === 0;
                      return (
                        <span 
                          key={val} 
                          className={`p-2 px-3 rounded-xl border transition-all duration-300 ${
                            isEKP 
                              ? 'bg-amber-500 text-white border-amber-400 font-black scale-110 shadow-sm ring-2 ring-amber-300' 
                              : isCommon 
                                ? 'bg-cyan-500 text-white border-cyan-400' 
                                : 'bg-slate-50 text-slate-700 border-slate-100'
                          }`}
                        >
                          {val}
                        </span>
                      );
                    })}
                    <span className="text-gray-400 p-2 font-mono">...</span>
                  </div>
                </div>

                {/* Λίστα 2 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">Πολλαπλάσια του {num2}</span>
                  <div className="flex flex-wrap gap-2 pt-2 text-sm sm:text-base font-bold">
                    {list2.map((val) => {
                      const isEKP = val === ekpResult;
                      const isCommon = val % num1 === 0;
                      return (
                        <span 
                          key={val} 
                          className={`p-2 px-3 rounded-xl border transition-all duration-300 ${
                            isEKP 
                              ? 'bg-amber-500 text-white border-amber-400 font-black scale-110 shadow-sm ring-2 ring-amber-300' 
                              : isCommon 
                                ? 'bg-cyan-500 text-white border-cyan-400' 
                                : 'bg-slate-50 text-slate-700 border-slate-100'
                          }`}
                        >
                          {val}
                        </span>
                      );
                    })}
                    <span className="text-gray-400 p-2 font-mono">...</span>
                  </div>
                </div>

                {/* Επεξήγηση Χρωμάτων */}
                <div className="flex flex-wrap gap-4 justify-center text-[11px] font-bold text-gray-500 pt-1">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span> Κοινά Πολλαπλάσια</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Το Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</span>
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΕΝΤΥΠΩΣΙΑΚΟ ΚΟΥΤΙ ΑΠΟΤΕΛΕΣΜΑΤΟΣ */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl text-center shadow-lg max-w-xl mx-auto space-y-2">
                <span className="text-xs uppercase font-black text-blue-200 tracking-wider block">Το Αποτέλεσμα</span>
                <div className="text-xl sm:text-2xl font-black">
                  ΕΚΠ({num1}, {num2}) = <span className="text-amber-300 text-3xl sm:text-4xl ml-1 animate-bounce inline-block">{ekpResult}</span>
                </div>
                <p className="text-xs text-blue-100 font-medium opacity-90 pt-1">
                  Το {ekpResult} είναι ο μικρότερος αριθμός που μπορεί να διαιρεθεί ακριβώς και με το {num1} και με το {num2}!
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Εύρεση ΕΚΠ με Παράθεση Όρων.</p>
      </footer>
    </div>
  );
}
