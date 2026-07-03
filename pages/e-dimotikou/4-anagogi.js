// pages/e-dimotikou/4-anagogi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 2,
  NUM_MAX: 10,
  DEN_MIN: 3,
  DEN_MAX: 12,
  VALUE_MIN: 10,
  VALUE_MAX: 500
};

export default function AnagogiPage() {
  // Το κλάσμα του ποσού που γνωρίζουμε (π.χ. τα 3/4)
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  
  // Η γνωστή αξία αυτών των μερών (π.λ. 60€)
  const [knownValue, setKnownValue] = useState(60);

  // 1ο Βήμα: Υπολογισμός της κλασματικής μονάδας (το 1/den) -> Διαίρεση με τον αριθμητή
  const unitValue = (knownValue / num).toFixed(1);

  // 2ο Βήμα: Υπολογισμός του όλου (τα den/den) -> Πολλαπλασιασμός με τον παρονομαστή
  const totalValue = (parseFloat(unitValue) * den).toFixed(1);

  // Σχεδίαση μπάρας/κλάσματος (Κλασματική μονάδα)
  const renderFractionBar = () => {
    const blocks = [];
    for (let i = 0; i < den; i++) {
      // Χρωματίζουμε με μπλε τα μέρη που γνωρίζουμε, με πορτοκαλί την κλασματική μονάδα (το 1ο μέρος)
      const isKnown = i < num;
      blocks.push(
        <div 
          key={i} 
          className={`flex-1 h-14 border-r-2 border-white last:border-0 flex flex-col items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 ${
            i === 0 
              ? 'bg-amber-500 text-white animate-pulse' 
              : isKnown 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
          }`}
        >
          <div>1/{den}</div>
          <div className="text-[10px] sm:text-xs opacity-90 mt-0.5">{unitValue.replace('.0', '')}€</div>
        </div>
      );
    }
    return blocks;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔍 Αναγωγή στην Κλασματική Μονάδα - LearnMaths.gr</title>
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
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🔍 Αναγωγή στην Κλασματική Μονάδα</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Όταν ξέρουμε την τιμή για πολλά μέρη ενός ποσού και θέλουμε να βρούμε την τελική συνολική τιμή, η πιο εύκολη μέθοδος είναι να βρούμε πρώτα <strong>πόσο κοστίζει το ένα μέρος</strong> (δηλαδή η <strong>κλασματική μονάδα</strong>).
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* 1. ΣΥΝΤΑΞΗ ΠΡΟΒΛΗΜΑΤΟΣ ΑΠΟ ΤΟΝ ΧΡΗΣΤΗ */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase text-center tracking-wider">Φτιάξε το Πρόβλημα:</h3>
                
                <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-gray-700 text-sm sm:text-base text-center">
                  <span>Αν τα</span>
                  
                  {/* Επιλογή Κλάσματος */}
                  <div className="flex flex-col items-center bg-slate-50 border p-2 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setNum(Math.max(LIMITS.NUM_MIN, num - 1))} className="bg-slate-200 text-gray-700 w-6 h-6 rounded-full font-black text-xs hover:bg-slate-300">-</button>
                      <span className="w-4 text-center font-black text-blue-600">{num}</span>
                      <button onClick={() => setNum(Math.min(den - 1, num + 1))} className="bg-slate-200 text-gray-700 w-6 h-6 rounded-full font-black text-xs hover:bg-slate-300">+</button>
                    </div>
                    <div className="w-16 h-[2px] bg-gray-400 my-1"></div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { const newDen = Math.max(LIMITS.DEN_MIN, den - 1); setDen(newDen); if(num >= newDen) setNum(newDen - 1); }} className="bg-slate-200 text-gray-700 w-6 h-6 rounded-full font-black text-xs hover:bg-slate-300">-</button>
                      <span className="w-4 text-center font-black text-indigo-600">{den}</span>
                      <button onClick={() => setDen(Math.min(LIMITS.DEN_MAX, den + 1))} className="bg-slate-200 text-gray-700 w-6 h-6 rounded-full font-black text-xs hover:bg-slate-300">+</button>
                    </div>
                  </div>

                  <span>ενός ποσού κοστίζουν</span>

                  {/* Ρύθμιση Αξίας */}
                  <div className="flex items-center gap-2 bg-slate-50 border p-3 rounded-xl">
                    <button onClick={() => setKnownValue(Math.max(LIMITS.VALUE_MIN, knownValue - 10))} className="bg-slate-200 text-gray-700 w-7 h-7 rounded-full font-black hover:bg-slate-300 shadow-sm">-10</button>
                    <span className="w-14 text-center font-black text-xl text-emerald-600">{knownValue}€</span>
                    <button onClick={() => setKnownValue(Math.min(LIMITS.VALUE_MAX, knownValue + 10))} className="bg-slate-200 text-gray-700 w-7 h-7 rounded-full font-black hover:bg-slate-300 shadow-sm">+</button>
                  </div>

                  <span>, πόσο κοστίζει όλο το ποσό;</span>
                </div>
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΜΠΑΡΑΣ ΜΕΡΙΔΙΩΝ */}
              <div className="space-y-2 max-w-4xl mx-auto">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Οπτικοποίηση Ποσού σε Μερίδια:</div>
                <div className="w-full rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md flex bg-gray-100">
                  {renderFractionBar()}
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 px-1 pt-1">
                  <span className="text-amber-600 flex items-center gap-1">🔸 Πορτοκαλί = 1 Κλασματική Μονάδα</span>
                  <span className="text-blue-600">🔹 Μπλε = Τα γνωστά μέρη ({num}/{den})</span>
                </div>
              </div>

              {/* 3. ΜΑΘΗΜΑΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                
                {/* ΒΗΜΑ A: Η Κλασματική Μονάδα */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full tracking-wider">Βήμα 1ο: Πάμε στο Ένα μέρος</span>
                    <h4 className="font-bold text-slate-700 text-sm mt-3">Βρίσκουμε την αξία της κλασματικής μονάδας <span className="text-amber-600 font-black">1/{den}</span>, διαιρώντας την τιμή με τον αριθμητή:</h4>
                  </div>
                  
                  <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 flex items-center justify-center gap-3 font-black text-xl text-slate-700">
                    <span>{knownValue}€</span>
                    <span className="text-slate-400">÷</span>
                    <span className="text-blue-600 text-2xl">{num}</span>
                    <span className="text-slate-400">=</span>
                    <span className="bg-amber-500 text-white p-1 px-3 rounded-lg shadow-sm text-2xl">
                      {unitValue.replace('.0', '')}€
                    </span>
                  </div>
                </div>

                {/* ΒΗΜΑ B: Το Όλο */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full tracking-wider">Βήμα 2ο: Πάμε στα Συνολικά μέρη</span>
                    <h4 className="font-bold text-slate-700 text-sm mt-3">Βρίσκουμε την αξία για ολόκληρο το ποσό <span className="text-indigo-600 font-black">{den}/{den}</span>, πολλαπλασιάζοντας με τον παρονομαστή:</h4>
                  </div>

                  <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-200 flex items-center justify-center gap-3 font-black text-xl text-slate-700">
                    <span>{unitValue.replace('.0', '')}€</span>
                    <span className="text-slate-400">×</span>
                    <span className="text-indigo-600 text-2xl">{den}</span>
                    <span className="text-slate-400">=</span>
                    <span className="bg-indigo-600 text-white p-1 px-3 rounded-lg shadow-sm text-2xl">
                      {totalValue.replace('.0', '')}€
                    </span>
                  </div>
                </div>

              </div>

              {/* ΤΕΛΙΚΟ ΕΝΤΥΠΩΣΙΑΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-xl text-center font-black text-base xl:text-lg shadow-md max-w-2xl mx-auto">
                🎯 Συμπέρασμα: Ολόκληρο το ποσό ({den}/{den}) αξίζει <span className="text-amber-300 font-black text-2xl ml-1">{totalValue.replace('.0', '')}€</span>!
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Μέθοδος Αναγωγής στη Μονάδα.</p>
      </footer>
    </div>
  );
}
