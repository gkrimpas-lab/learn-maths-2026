// pages/e-dimotikou/9-krit-diaret.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 1,
  NUM_MAX: 1000
};

export default function KritiriaPage() {
  const [num, setNum] = useState(124);

  // Ανάλυση ψηφίων
  const numStr = num.toString();
  const lastDigit = parseInt(numStr[numStr.length - 1]);
  const lastTwoDigits = numStr.length > 1 ? parseInt(numStr.slice(-2)) : num;
  
  const digitsArray = numStr.split('').map(Number);
  const digitsSum = digitsArray.reduce((acc, curr) => acc + curr, 0);

  // Έλεγχοι κριτηρίων
  const divBy2 = num % 2 === 0;
  const divBy3 = num % 3 === 0;
  const divBy4 = num % 4 === 0;
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: Η ΘΕΩΡΙΑ ΤΩΝ ΚΡΙΤΗΡΙΩΝ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Η Θεωρία των Κριτηρίων
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Με τους κανόνες αυτούς καταλαβαίνουμε αμέσως αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον, χωρίς να κάνουμε τη διαίρεση:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-blue-600">🔢 Κριτήριο του 2</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 2 αν είναι **άρτιος**, δηλαδή αν το τελευταίο του ψηφίο είναι **0, 2, 4, 6, 8**.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-blue-600">🔢 Κριτήριο του 3</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 3 αν το **άθροισμα των ψηφίων του** διαιρείται με το 3 (π.χ. 1 + 2 + 3 = 6).</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-purple-600">🔢 Κριτήριο του 4</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 4 αν τα **δύο τελευταία ψηφία του** σχηματίζουν αριθμό που διαιρείται με το 4 ή είναι **00**.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-emerald-600">🔢 Κριτήριο του 5</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 5 αν το τελευταίο του ψηφίο είναι **0 ή 5**.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-orange-600">🔢 Κριτήριο του 9</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 9 αν το **άθροισμα των ψηφίων του** διαιρείται με το 9 (π.χ. 1 + 8 = 9).</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs md:text-sm">
                <span className="font-bold text-orange-600">🔢 Κριτήριο του 10</span>
                <p className="text-gray-600 mt-1">Ένας αριθμός διαιρείται με το 10 αν το τελευταίο του ψηφίο είναι **0**.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΟΚΙΜΑΣΕ ΕΝΑΝ ΑΡΙΘΜΟ */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                🔍 Δοκίμασε έναν Αριθμό
              </h2>
              <p className="text-gray-500 text-sm">
                Άλλαξε τον αριθμό με τα κουμπιά, το range ή πληκτρολόγησε έναν δικό σου!
              </p>
            </div>

            {/* ΧΕΙΡΙΣΤΗΡΙΟ ΕΠΙΛΟΓΗΣ (Όπως στην εικόνα_5) */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-center gap-4 bg-slate-50 border p-4 rounded-2xl max-w-xl mx-auto">
                <span className="font-bold text-slate-700 text-sm sm:text-base w-36 text-right">Αριθμός για έλεγχο:</span>
                <button onClick={() => setNum(Math.max(LIMITS.NUM_MIN, num - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">-</button>
                <input 
                  type="number" 
                  value={num} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) setNum(Math.max(LIMITS.NUM_MIN, Math.min(LIMITS.NUM_MAX, val)));
                  }}
                  className="w-24 text-center font-black text-xl text-amber-600 bg-amber-50/50 border border-amber-200 p-1 rounded-xl focus:outline-none"
                />
                <button onClick={() => setNum(Math.min(LIMITS.NUM_MAX, num + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">+</button>
              </div>

              {/* SLIDER (RANGE) */}
              <div className="max-w-xl mx-auto px-4">
                <input 
                  type="range" 
                  min={LIMITS.NUM_MIN} 
                  max={LIMITS.NUM_MAX} 
                  value={num} 
                  onChange={(e) => setNum(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* GRID ΑΠΟΤΕΛΕΣΜΑΤΩΝ (3 Στήλες στα μεγάλα monitor) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Διαιρείται με το 2 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy2 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 2;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy2 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy2 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Είναι άρτιος.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Λήγει σε {lastDigit}.
                </div>
              </div>

              {/* Διαιρείται με το 3 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy3 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 3;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy3 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy3 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Το άθροισμα των ψηφίων του διαιρείται με το 3.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Άθροισμα: {digitsArray.join(' + ')} = {digitsSum}.
                </div>
              </div>

              {/* Διαιρείται με το 4 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy4 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 4;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy4 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy4 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Τα δύο τελευταία ψηφία διαιρούνται με το 4.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Τελευταία δύο ψηφία: {lastTwoDigits} {divBy4 ? `(Έλεγχος: ${lastTwoDigits} ÷ 4 = ${lastTwoDigits / 4})` : '(Δεν διαιρείται ακριβώς)'}.
                </div>
              </div>

              {/* Διαιρείται με το 5 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy5 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 5;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy5 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy5 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Λήγει σε 0 ή 5.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Λήγει σε {lastDigit}.
                </div>
              </div>

              {/* Διαιρείται με το 9 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy9 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 9;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy9 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy9 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Το άθροισμα των ψηφίων του διαιρείται με το 9.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Άθροισμα: {digitsArray.join(' + ')} = {digitsSum}.
                </div>
              </div>

              {/* Διαιρείται με το 10 */}
              <div className={`p-5 rounded-2xl border bg-white flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${divBy10 ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm md:text-base text-slate-800">Διαιρείται με το 10;</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs text-white flex items-center gap-1 ${divBy10 ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                      {divBy10 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Κανόνας: Λήγει σε 0.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                  🔍 Λήγει σε {lastDigit}.
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
