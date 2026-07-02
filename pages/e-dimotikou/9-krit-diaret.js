// pages/e-dimotikou/9-krit-diaret.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  CRITERIA_NUM_MIN: 1,
  CRITERIA_NUM_MAX: 2000 // Αυξήθηκε ελαφρώς το όριο για να έχει νόημα το κριτήριο του 4 (διψήφιο τέλος)
};

export default function KritDiaretPage() {
  const [criteriaNumber, setCriteriaNumber] = useState(124);

  // Helper για το άθροισμα των ψηφίων (χρήσιμο για το 3 και το 9)
  const getDigitsSum = (num) => 
    String(num).split('').reduce((sum, digit) => sum + parseInt(digit || '0', 10), 0);

  // Helper για τα δύο τελευταία ψηφία (χρήσιμο για το 4)
  const getLastTwoDigits = (num) => num % 100;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🔍 Κριτήρια Διαιρετότητας - LearnMaths.gr</title>
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
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        
        {/* ΠΙΝΑΚΑΣ ΘΕΩΡΙΑΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">📖 Η Θεωρία των Κριτηρίων</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Με τους κανόνες αυτούς καταλαβαίνουμε αμέσως αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον, χωρίς να κάνουμε τη διαίρεση:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-blue-600 text-sm block mb-1">🔢 Κριτήριο του 2</span>
              Ένας αριθμός διαιρείται με το 2 αν είναι **άρτιος**, δηλαδή αν το τελευταίο του ψηφίο είναι **0, 2, 4, 6, 8**.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-indigo-600 text-sm block mb-1">🔢 Κριτήριο του 3</span>
              Ένας αριθμός διαιρείται με το 3 αν το **άθροισμα των ψηφίων του** διαιρείται με το 3 (π.χ. 1 + 2 + 3 = 6).
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-purple-600 text-sm block mb-1">🔢 Κριτήριο του 4</span>
              Ένας αριθμός διαιρείται με το 4 αν τα **δύο τελευταία ψηφία του** σχηματίζουν αριθμό που διαιρείται με το 4 ή είναι **00**.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-teal-600 text-sm block mb-1">🔢 Κριτήριο του 5</span>
              Ένας αριθμός διαιρείται με το 5 αν το τελευταίο του ψηφίο είναι **0 ή 5**.
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-orange-600 text-sm block mb-1">🔢 Κριτήριο του 9</span>
              Ένας αριθμός διαιρείται με το 9 αν το **άθροισμα των ψηφίων του** διαιρείται με το 9 (π.χ. 1 + 8 = 9).
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <span className="font-bold text-amber-600 text-sm block mb-1">🔢 Κριτήριο του 10</span>
              Ένας αριθμός διαιρείται με το 10 αν το τελευταίο του ψηφίο είναι **0**.
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900">🔍 Δοκίμασε έναν Αριθμό</h2>
            <p className="text-gray-600 text-sm">Άλλαξε τον αριθμό με τα κουμπιά, το range ή πληκτρολόγησε έναν δικό σου!</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
              <span className="font-bold text-gray-700 text-sm">Αριθμός για έλεγχο:</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, criteriaNumber - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition shadow-sm">-</button>
                <input 
                  type="number" 
                  value={criteriaNumber} 
                  onChange={(e) => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, Math.min(LIMITS.CRITERIA_NUM_MAX, parseInt(e.target.value, 10) || 1)))} 
                  className="w-24 text-center text-xl font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-1 focus:outline-none"
                />
                <button onClick={() => setCriteriaNumber(Math.min(LIMITS.CRITERIA_NUM_MAX, criteriaNumber + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition shadow-sm">+</button>
              </div>
            </div>
            <div className="px-2 pt-2">
              <input 
                type="range" 
                min={LIMITS.CRITERIA_NUM_MIN} 
                max={LIMITS.CRITERIA_NUM_MAX} 
                value={criteriaNumber} 
                onChange={(e) => setCriteriaNumber(parseInt(e.target.value, 10))} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* ΠΛΕΓΜΑ LIVE ΕΛΕΓΧΩΝ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { div: 2, label: 'Διαιρείται με το 2;', rule: 'Είναι άρτιος.', text: `Λήγει σε ${criteriaNumber % 10}.` },
              { div: 3, label: 'Διαιρείται με το 3;', rule: 'Το άθροισμα των ψηφίων του διαιρείται με το 3.', text: `Άθροισμα: ${String(criteriaNumber).split('').join(' + ')} = ${getDigitsSum(criteriaNumber)}.` },
              { div: 4, label: 'Διαιρείται με το 4;', rule: 'Τα δύο τελευταία ψηφία διαιρούνται με το 4.', text: `Τελευταία δύο ψηφία: ${getLastTwoDigits(criteriaNumber) < 10 && criteriaNumber >= 10 ? '0' : ''}${getLastTwoDigits(criteriaNumber)} (Έλεγχος: ${getLastTwoDigits(criteriaNumber)} ÷ 4 = ${(getLastTwoDigits(criteriaNumber) / 4)}).` },
              { div: 5, label: 'Διαιρείται με το 5;', rule: 'Λήγει σε 0 ή 5.', text: `Λήγει σε ${criteriaNumber % 10}.` },
              { div: 9, label: 'Διαιρείται με το 9;', rule: 'Το άθροισμα των ψηφίων του διαιρείται με το 9.', text: `Άθροισμα: ${String(criteriaNumber).split('').join(' + ')} = ${getDigitsSum(criteriaNumber)}.` },
              { div: 10, label: 'Διαιρείται με το 10;', rule: 'Λήγει σε 0.', text: `Λήγει σε ${criteriaNumber % 10}.` }
            ].map((c) => {
              const ok = criteriaNumber % c.div === 0;
              return (
                <div key={c.div} className={`p-4 rounded-2xl border transition duration-300 flex flex-col justify-between ${ok ? 'bg-emerald-50/60 border-emerald-200 shadow-sm' : 'bg-rose-50/70 border-rose-200'}`}>
                  <div>
                    <div className="flex justify-between font-black text-sm text-slate-800">
                      <span>{c.label}</span>
                      <span>{ok ? '✅ Ναι' : '❌ Όχι'}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1"><strong>Κανόνας:</strong> {c.rule}</p>
                  </div>
                  <div className="mt-4 p-2 bg-white/90 rounded-lg border text-[11px] font-semibold text-slate-700">
                    🔍 {c.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
