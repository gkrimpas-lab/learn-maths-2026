// pages/e-dimotikou/7-diairetes.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  BASE_MIN: 2,
  BASE_MAX: 50
};

export default function DiairetesPage() {
  // Ο αριθμός για τον οποίο ψάχνουμε τους διαιρέτες
  const [baseNum, setBaseNum] = useState(12);

  // Δημιουργία πίνακα με όλους τους αριθμούς από το 1 έως τον ίδιο τον αριθμό
  const potentialDivisors = Array.from({ length: baseNum }, (_, i) => i + 1);

  // Φιλτράρισμα για να βρούμε μόνο τους πραγματικούς διαιρέτες (υπόλοιπο 0)
  const realDivisors = potentialDivisors.filter(d => baseNum % d === 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🛡️ Διαιρέτες Αριθμού - LearnMaths.gr</title>
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
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🛡️ Διαιρέτες ενός Αριθμού</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Διαιρέτες ενός φυσικού αριθμού ονομάζονται όλοι οι μικρότεροι ή ίσοι αριθμοί του που τον <strong>διαιρούν ακριβώς</strong> (δηλαδή η διαίρεση αφήνει <strong>υπόλοιπο 0</strong>). Αντίθετα με τα πολλαπλάσια, οι διαιρέτες ενός αριθμού είναι <strong>περιορισμένοι (συγκεκριμένο πλήθος)</strong>!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* 1. ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ ΜΕ CARD */}
              <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between max-w-xl mx-auto gap-4">
                <span className="font-bold text-blue-900 text-sm xl:text-base">Διάλεξε έναν Αριθμό για έλεγχο:</span>
                <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-blue-100 gap-3">
                  <button onClick={() => setBaseNum(Math.max(LIMITS.BASE_MIN, baseNum - 1))} className="bg-blue-100 text-blue-700 w-9 h-9 rounded-full font-black text-lg hover:bg-blue-200 transition shadow-sm">-</button>
                  <span className="w-12 text-center font-black text-2xl text-blue-600">{baseNum}</span>
                  <button onClick={() => setBaseNum(Math.min(LIMITS.BASE_MAX, baseNum + 1))} className="bg-blue-600 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-blue-700 transition shadow-sm">+</button>
                </div>
              </div>

              {/* 2. ΟΛΟΙ ΟΙ ΠΙΘΑΝΟΙ ΕΛΕΓΧΟΙ ΔΙΑΙΡΕΣΗΣ ΜΕ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider text-center">Δοκιμάζουμε όλες τις διαιρέσεις από το 1 έως το {baseNum}:</h3>
                
                {/* Grid που απλώνεται τέλεια στην 2K οθόνη */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {potentialDivisors.map((d) => {
                    const isDivisor = baseNum % d === 0;
                    return (
                      <div 
                        key={d} 
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 transition duration-200 min-h-[96px] ${
                          isDivisor 
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md scale-105 font-bold animate-fade-in' 
                            : 'bg-white text-gray-400 border-gray-100 opacity-50'
                        }`}
                      >
                        {/* Εμφάνιση αποτελέσματος αν είναι Διαιρέτης, όπως ακριβώς στην εικόνα_5 */}
                        <span className="text-xs xl:text-sm opacity-95 tracking-wide">
                          {baseNum} ÷ {d} {isDivisor && <span className="text-yellow-300 font-black text-sm xl:text-base"> = {baseNum / d}</span>}
                        </span>
                        
                        <div className={`w-full h-[1px] ${isDivisor ? 'bg-emerald-400/50' : 'bg-gray-100'}`}></div>
                        
                        <span className="text-base font-black flex items-center gap-1">
                          {isDivisor ? '✔ Ναι' : '✖ Όχι'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Η ΤΕΛΙΚΗ ΜΑΘΗΜΑΤΙΚΗ ΣΥΛΛΟΓΗ ΔΙΑΙΡΕΤΩΝ */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-3">
                <span className="text-xs uppercase font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full tracking-wider">
                  Οι Διαιρέτες του {baseNum}
                </span>
                <p className="text-sm font-semibold text-gray-600">
                  Γράφουμε τους διαιρέτες του <span className="font-bold text-slate-800">{baseNum}</span> βάζοντας ένα κεφαλαίο <span className="text-emerald-600 font-bold">Δ</span> και τον αριθμό σε παρένθεση:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-base md:text-lg lg:text-xl shadow-inner flex flex-wrap items-center gap-1">
                  <span className="text-white font-bold">Δ({baseNum}) = </span>
                  <span>{"{"}</span>
                  {realDivisors.map((d, index) => (
                    <span key={d} className="font-bold text-white bg-emerald-600/20 px-2 py-0.5 rounded border border-emerald-500/30 mx-0.5">
                      {d}{index < realDivisors.length - 1 ? "," : ""}
                    </span>
                  ))}
                  <span>{"}"}</span>
                </div>
              </div>

              {/* ΕΚΠΑΙΔΕΥΤΙΚΟ TIP */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm max-w-xl mx-auto font-medium">
                💡 <strong>Το ήξερες;</strong> Ο αριθμός <span className="font-bold text-amber-700">1</span> είναι διαιρέτης κάθε αριθμού! Επίσης, ο <span className="font-bold text-amber-700">μεγαλύτερος διαιρέτης</span> ενός αριθμού είναι πάντα ο ίδιος του ο εαυτός!
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαιρέτες Φυσικών Αριθμών.</p>
      </footer>
    </div>
  );
}
