// pages/e-dimotikou/5-pollaplasia.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  BASE_MIN: 2,
  BASE_MAX: 20,
  COUNT_SHOW: 12 // Πόσα πολλαπλάσια θα δείχνουμε στην οθόνη
};

export default function PollaplasiaPage() {
  // Ο αριθμός βάσης για τον οποίο ψάχνουμε τα πολλαπλάσια (π.χ. το 4)
  const [baseNum, setBaseNum] = useState(4);

  // Δημιουργία πίνακα με τους πολλαπλασιαστές από το 0 έως το 11 (12 στοιχεία)
  const multipliers = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Πολλαπλάσια Αριθμού - LearnMaths.gr</title>
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
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🔢 Πολλαπλάσια ενός Αριθμού</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Πολλαπλάσια ενός φυσικού αριθμού ονομάζονται οι αριθμοί που προκύπτουν όταν <strong>πολλαπλασιάσουμε</strong> αυτόν τον αριθμό με όλους τους φυσικούς αριθμούς ($0, 1, 2, 3, 4...$). Τα πολλαπλάσια ενός αριθμού είναι <strong>άπειρα</strong>!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* 1. ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ ΒΑΣΗΣ */}
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between max-w-xl mx-auto gap-4">
                <span className="font-bold text-blue-900 text-sm xl:text-base">Διάλεξε έναν Αριθμό:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setBaseNum(Math.max(LIMITS.BASE_MIN, baseNum - 1))} className="bg-blue-600 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-blue-700 transition shadow-sm">-</button>
                  <span className="w-12 text-center font-black text-2xl text-blue-600">{baseNum}</span>
                  <button onClick={() => setBaseNum(Math.min(LIMITS.BASE_MAX, baseNum + 1))} className="bg-blue-600 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-blue-700 transition shadow-sm">+</button>
                </div>
              </div>

              {/* 2. ΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider text-center">Η Γεννήτρια των Πολλαπλασίων του {baseNum}:</h3>
                
                {/* Grid που ανοίγει σε περισσότερες στήλες στις μεγάλες οθόνες */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {multipliers.map((m) => {
                    const result = baseNum * m;
                    return (
                      <div 
                        key={m} 
                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-blue-400 hover:shadow-md transition duration-200 group"
                      >
                        <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                          {baseNum} × {m}
                        </span>
                        <div className="w-full h-[1px] bg-gray-100"></div>
                        <span className="text-2xl font-black text-slate-800 group-hover:scale-110 transition-transform">
                          {result}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Η ΣΕΙΡΑ ΤΩΝ ΠΟΛΛΑΠΛΑΣΙΩΝ (ΟΠΩΣ ΓΡΑΦΕΤΑΙ ΣΤΟ ΤΕΤΡΑΔΙΟ) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-3">
                <span className="text-xs uppercase font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full tracking-wider">
                  Μαθηματική Συμβολή
                </span>
                <p className="text-sm font-semibold text-gray-600">
                  Γράφουμε τα πολλαπλάσια του <span className="font-bold text-slate-800">{baseNum}</span> βάζοντας ένα κεφαλαίο <span className="text-blue-600 font-bold">Π</span> και τον αριθμό σε παρένθεση:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-base md:text-lg lg:text-xl shadow-inner break-all flex flex-wrap items-center gap-1">
                  <span className="text-white font-bold">Π({baseNum}) = </span>
                  <span>{"{"}</span>
                  {multipliers.map((m, index) => (
                    <span key={m} className="transition-all duration-300 hover:text-white cursor-default">
                      {baseNum * m}{index < multipliers.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  <span className="text-slate-500 animate-pulse">, ... {"}"}</span>
                </div>
              </div>

              {/* ΕΚΠΑΙΔΕΥΤΙΚΟ TIP */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm max-w-xl mx-auto font-medium">
                💡 <strong>Χρήσιμο μυστικό:</strong> Το <span className="font-bold text-amber-700">0</span> είναι πολλαπλάσιο κάθε αριθμού! Επίσης, ο <span className="font-bold text-amber-700">πρώτος αριθμός μετά το μηδέν</span> στη σειρά είναι πάντα ο ίδιος ο αριθμός βάσης!
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Δημιουργία Πολλαπλασίων.</p>
      </footer>
    </div>
  );
}
