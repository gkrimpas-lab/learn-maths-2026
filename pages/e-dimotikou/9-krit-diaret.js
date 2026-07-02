// pages/e-dimotikou/9-krit-diaret.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  CRITERIA_NUM_MIN: 1,
  CRITERIA_NUM_MAX: 1000
};

export default function KritDiaretPage() {
  const [criteriaNumber, setCriteriaNumber] = useState(123);

  // Helper για το άθροισμα των ψηφίων (χρήσιμο για το κριτήριο του 3)
  const getDigitsSum = (num) => 
    String(num).split('').reduce((sum, digit) => sum + parseInt(digit || '0', 10), 0);

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
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">🔍 Κριτήρια Διαιρετότητας</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Κριτήρια διαιρετότητας είναι σύντομοι κανόνες με τους οποίους μπορούμε να καταλάβουμε αμέσως αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον, χωρίς να χρειαστεί να κάνουμε τη διαίρεση.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
              <span className="font-bold text-gray-700 text-sm">Διάλεξε ή γράψε αριθμό:</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, criteriaNumber - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition shadow-sm">-</button>
                <input 
                  type="number" 
                  value={criteriaNumber} 
                  onChange={(e) => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, Math.min(LIMITS.CRITERIA_NUM_MAX, parseInt(e.target.value, 10) || 1)))} 
                  className="w-20 text-center text-xl font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-1 focus:outline-none"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { div: 2, label: 'Διαιρείται με το 2;', rule: 'Είναι άρτιος (λήγει σε 0, 2, 4, 6, 8).', text: `Λήγει σε ${criteriaNumber % 10}.` },
              { div: 5, label: 'Διαιρείται με το 5;', rule: 'Λήγει σε 0 ή 5.', text: `Λήγει σε ${criteriaNumber % 10}.` },
              { div: 10, label: 'Διαιρείται με το 10;', rule: 'Λήγει σε 0.', text: `Λήγει σε ${criteriaNumber % 10}.` },
              { div: 3, label: 'Διαιρείται με το 3;', rule: 'Το άθροισμα των ψηφίων του διαιρείται με το 3.', text: `Άθροισμα: ${String(criteriaNumber).split('').join(' + ')} = ${getDigitsSum(criteriaNumber)}.` }
            ].map((c) => {
              const ok = criteriaNumber % c.div === 0;
              return (
                <div key={c.div} className={`p-4 rounded-2xl border transition duration-300 ${ok ? 'bg-emerald-50/60 border-emerald-200 shadow-sm' : 'bg-rose-50/70 border-rose-200'}`}>
                  <div className="flex justify-between font-black text-sm text-slate-800">
                    <span>{c.label}</span>
                    <span>{ok ? '✅ Ναι' : '❌ Όχι'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1"><strong>Κανόνας:</strong> {c.rule}</p>
                  <div className="mt-3 p-2 bg-white/90 rounded-lg border text-[11px] font-semibold text-slate-700">🔍 {c.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
