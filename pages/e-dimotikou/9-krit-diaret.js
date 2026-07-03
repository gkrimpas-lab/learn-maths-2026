// pages/e-dimotikou/9-krit-diaret.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 1,
  NUM_MAX: 9999
};

export default function KritiriaPage() {
  // Ο αριθμός που εξετάζει ο μαθητής
  const [num, setNum] = useState(135);

  // Μετατροπή του αριθμού σε string για την ανάλυση των ψηφίων
  const numStr = num.toString();
  const lastDigit = parseInt(numStr[numStr.length - 1]);
  
  // Άθροισμα ψηφίων (χρειάζεται για το 3 και το 9)
  const digitsArray = numStr.split('').map(Number);
  const digitsSum = digitsArray.reduce((acc, curr) => acc + curr, 0);

  // Έλεγχοι κριτηρίων
  const divBy2 = num % 2 === 0;
  const divBy3 = num % 3 === 0;
  const divBy5 = num % 5 === 0;
  const divBy9 = num % 9 === 0;
  const divBy10 = num % 10 === 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔍 Κριτήρια Διαιρετότητας - LearnMaths.gr</title>
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
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🔍 Κριτήρια Διαιρετότητας</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Κριτήρια διαιρετότητας είναι κάποιοι <strong>σύντομοι κανόνες</strong> που μας βοηθούν να καταλάβουμε αμέσως αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον, εξετάζοντας μόνο το <strong>τελευταίο του ψηφίο</strong> ή το <strong>άθροισμα των ψηφίων του</strong>!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ ΜΕ ΜΕΓΑΛΑ ΧΕΙΡΙΣΤΗΡΙΑ */}
              <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-200 flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto gap-4">
                <div className="text-center md:text-left">
                  <span className="font-black text-blue-950 text-base block">Διάλεξε έναν Αριθμό:</span>
                  <span className="text-xs text-blue-600 font-semibold">Μπορείς να χρησιμοποιήσεις και τα βήματα των +100 / -100</span>
                </div>
                <div className="flex flex-wrap items-center justify-center bg-white p-2 px-4 rounded-2xl border border-blue-100 gap-2">
                  <button onClick={() => setNum(Math.max(LIMITS.NUM_MIN, num - 100))} className="bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition">-100</button>
                  <button onClick={() => setNum(Math.max(LIMITS.NUM_MIN, num - 1))} className="bg-blue-100 text-blue-700 w-9 h-9 rounded-full font-black text-lg hover:bg-blue-200 transition shadow-sm">-</button>
                  <span className="w-20 text-center font-black text-3xl text-blue-600 tracking-tight">{num}</span>
                  <button onClick={() => setNum(Math.min(LIMITS.NUM_MAX, num + 1))} className="bg-blue-600 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-blue-700 transition shadow-sm">+</button>
                  <button onClick={() => setNum(Math.min(LIMITS.NUM_MAX, num + 100))} className="bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition">+100</button>
                </div>
              </div>

              {/* ΑΝΑΛΥΣΗ ΨΗΦΙΩΝ */}
              <div className="bg-white p-5 rounded-2xl border shadow-sm max-w-xl mx-auto text-center space-y-2">
                <span className="text-xs uppercase font-black text-gray-400 tracking-wider block">Ακτινογραφία του αριθμού {num}</span>
                <div className="flex justify-center gap-6 text-sm font-bold text-slate-700 pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <div>📌 Τελευταίο Ψηφίο:</div>
                    <div className="text-xl font-black text-indigo-600 mt-1">{lastDigit}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <div>🧮 Άθροισμα Ψηφίων:</div>
                    <div className="text-xl font-black text-purple-600 mt-1">
                      {digitsArray.join(' + ')} = <span className="text-pink-600">{digitsSum}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ ΕΛΕΓΧΟΥ ΚΡΙΤΗΡΙΩΝ */}
              <div className="space-y-4 max-w-4xl mx-auto">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider text-center">Έλεγχος Διαιρετότητας:</h3>
                
                <div className="space-y-3">
                  {/* Κριτήριο για το 2 */}
                  <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 bg-white ${divBy2 ? 'border-l-8 border-l-emerald-500 shadow-sm' : 'border-l-8 border-l-rose-400'}`}>
                    <div>
                      <span className="font-black text-base text-slate-800">Διαιρείται με το <span className="text-blue-600">2</span>;</span>
                      <p className="text-xs text-gray-500 mt-0.5">Κανόνας: Πρέπει να λήγει σε ζυγό ψηφίο (0, 2, 4, 6, 8).</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">Λήγει σε {lastDigit}</span>
                      <span className={`p-1.5 px-4 rounded-xl font-black text-sm text-white ${divBy2 ? 'bg-emerald-500' : 'bg-rose-400'}`}>{divBy2 ? '✔ Ναι' : '✖ Όχι'}</span>
                    </div>
                  </div>

                  {/* Κριτήριο για το 3 */}
                  <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 bg-white ${divBy3 ? 'border-l-8 border-l-emerald-500 shadow-sm' : 'border-l-8 border-l-rose-400'}`}>
                    <div>
                      <span className="font-black text-base text-slate-800">Διαιρείται με το <span className="text-blue-600">3</span>;</span>
                      <p className="text-xs text-gray-500 mt-0.5">Κανόνας: Το άθροισμα των ψηφίων του πρέπει να είναι πολλαπλάσιο του 3.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">Άθροισμα = {digitsSum}</span>
                      <span className={`p-1.5 px-4 rounded-xl font-black text-sm text-white ${divBy3 ? 'bg-emerald-500' : 'bg-rose-400'}`}>{divBy3 ? '✔ Ναι' : '✖ Όχι'}</span>
                    </div>
                  </div>

                  {/* Κριτήριο για το 5 */}
                  <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 bg-white ${divBy5 ? 'border-l-8 border-l-emerald-500 shadow-sm' : 'border-l-8 border-l-rose-400'}`}>
                    <div>
                      <span className="font-black text-base text-slate-800">Διαιρείται με το <span className="text-blue-600">5</span>;</span>
                      <p className="text-xs text-gray-500 mt-0.5">Κανόνας: Πρέπει να λήγει σε 0 ή 5.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">Λήγει σε {lastDigit}</span>
                      <span className={`p-1.5 px-4 rounded-xl font-black text-sm text-white ${divBy5 ? 'bg-emerald-500' : 'bg-rose-400'}`}>{divBy5 ? '✔ Ναι' : '✖ Όχι'}</span>
                    </div>
                  </div>

                  {/* Κριτήριο για το 9 */}
                  <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 bg-white ${divBy9 ? 'border-l-8 border-l-emerald-500 shadow-sm' : 'border-l-8 border-l-rose-400'}`}>
                    <div>
                      <span className="font-black text-base text-slate-800">Διαιρείται με το <span className="text-blue-600">9</span>;</span>
                      <p className="text-xs text-gray-500 mt-0.5">Κανόνας: Το άθροισμα των ψηφίων του πρέπει να είναι πολλαπλάσιο του 9.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">Άθροισμα = {digitsSum}</span>
                      <span className={`p-1.5 px-4 rounded-xl font-black text-sm text-white ${divBy9 ? 'bg-emerald-500' : 'bg-rose-400'}`}>{divBy9 ? '✔ Ναι' : '✖ Όχι'}</span>
                    </div>
                  </div>

                  {/* Κριτήριο για το 10 */}
                  <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 bg-white ${divBy10 ? 'border-l-8 border-l-emerald-500 shadow-sm' : 'border-l-8 border-l-rose-400'}`}>
                    <div>
                      <span className="font-black text-base text-slate-800">Διαιρείται με το <span className="text-blue-600">10</span>;</span>
                      <p className="text-xs text-gray-500 mt-0.5">Κανόνας: Πρέπει να λήγει σε 0.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">Λήγει σε {lastDigit}</span>
                      <span className={`p-1.5 px-4 rounded-xl font-black text-sm text-white ${divBy10 ? 'bg-emerald-500' : 'bg-rose-400'}`}>{divBy10 ? '✔ Ναι' : '✖ Όχι'}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Κριτήρια Διαιρετότητας.</p>
      </footer>
    </div>
  );
}
