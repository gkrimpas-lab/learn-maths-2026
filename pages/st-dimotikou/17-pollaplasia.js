import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [2, 3, 5, 7, 10];

export default function PollaplasiaPage() {
  const [selectedNum, setSelectedNum] = useState(5);
  const [customNumStr, setCustomNumStr] = useState("");

  const handleCustomInputChange = (val) => {
    // Μόνο αριθμοί
    const clean = val.replace(/[^0-9]/g, '');
    setCustomNumStr(clean);
    
    if (clean !== '' && Number(clean) > 0) {
      setSelectedNum(Number(clean));
    }
  };

  const handlePresetClick = (num) => {
    setSelectedNum(num);
    setCustomNumStr("");
  };

  // Δημιουργία πίνακα 1 έως 100 για τη γραφική αναπαράσταση
  const gridNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  // Παραγωγή των πρώτων 10 πολλαπλασίων για το επεξηγηματικό πλαίσιο
  const firstTenMultiples = [];
  for (let i = 0; i <= 10; i++) {
    firstTenMultiples.push(selectedNum * i);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Πολλαπλάσια ενός Αριθμού - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΜΕ ΑΠΛΑ ΛΟΓΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Τι είναι τα Πολλαπλάσια;
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    • <strong>Πολλαπλάσια</strong> ενός φυσικού αριθμού είναι οι αριθμοί που προκύπτουν όταν <strong>πολλαπλασιάσουμε</strong> αυτόν τον αριθμό με όλους τους άλλους φυσικούς αριθμούς (0, 1, 2, 3, 4...).
                  </p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    • Στην πραγματικότητα, τα πολλαπλάσια ενός αριθμού είναι οι απαντήσεις που βρίσκουμε στην <strong>προπαίδειά</strong> του!
                  </p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    • Συμβολίζουμε τα πολλαπλάσια του αριθμού π.χ. 4, ως: <strong>Π(4)</strong>.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-3 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">💡 SOS - Τι πρέπει να θυμάσαι:</span>
                <ul className="space-y-1.5 text-xs md:text-sm text-blue-50 list-disc pl-4 font-medium">
                  <li>Το <strong>0</strong> είναι πολλαπλάσιο <strong>όλων</strong> των αριθμών (αφού κάθε αριθμός × 0 = 0).</li>
                  <li>Κάθε αριθμός είναι πολλαπλάσιο του <strong>εαυτού του</strong> (αφού αριθμός × 1 = ο εαυτός του).</li>
                  <li>Τα πολλαπλάσια ενός αριθμού είναι <strong>άπειρα</strong>! Δεν τελειώνουν ποτέ.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ ΚΑΙ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between lg:h-fit">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Διάλεξε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Δες πώς απλώνονται τα πολλαπλάσιά του πάνω στον πίνακα.</p>
                </div>

                {/* Γρήγορα Κουμπιά */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Βασικοί Αριθμοί:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePresetClick(num)}
                        className={`px-4 py-2 rounded-xl border font-black text-sm transition-all ${selectedNum === num && customNumStr === "" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        το {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Ή γράψε έναν δικό σου:</span>
                  <input
                    type="text"
                    value={customNumStr}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-blue-100 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="π.χ. 12"
                  />
                </div>
              </div>

              {/* Παρουσίαση Προπαίδειας / Λίστας */}
              {selectedNum > 0 && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2 mt-4 lg:mt-0">
                  <span className="text-xs font-black text-blue-700 uppercase tracking-wider block">
                    📈 Τα πρώτα πολλαπλάσια του {selectedNum}:
                  </span>
                  <div className="text-xs font-mono text-slate-600 leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                    {firstTenMultiples.map((m, idx) => (
                      <div key={idx} className="py-0.5 border-b border-blue-100/50 last:border-0 flex justify-between">
                        <span className="text-slate-400">{selectedNum} × {idx} =</span>
                        <span className="font-black text-slate-800">{m}</span>
                      </div>
                    ))}
                    <div className="text-center text-[10px] text-blue-500 font-bold pt-1">...και συνεχίζεται στο άπειρο!</div>
                  </div>
                </div>
              )}
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΕΚΑΤΟΝΤΑΔΑ) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Οπτικό Μοτίβο Πολλαπλασίων:</span>
                <div className="text-xl md:text-2xl font-black text-indigo-600 mt-1">
                  Π({selectedNum}) = {'{'} 0, {selectedNum}, {selectedNum * 2}, {selectedNum * 3}, {selectedNum * 4}... {'}'}
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ 1-100 */}
              <div className="w-full flex-1 bg-slate-900 text-white p-4 md:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    📊 Πίνακας Αριθμών 1 έως 100
                  </span>
                  <p className="text-[10px] text-slate-400">Όλα τα χρωματισμένα κουτάκια είναι πολλαπλάσια του {selectedNum}!</p>
                </div>

                {/* Το Grid των Αριθμών */}
                <div className="grid grid-cols-10 gap-1.5 md:gap-2 max-w-md mx-auto w-full font-mono text-xs md:text-sm select-none">
                  {gridNumbers.map((num) => {
                    const isMultiple = num % selectedNum === 0;
                    return (
                      <div
                        key={num}
                        className={`aspect-square rounded-lg flex items-center justify-center font-black transition-all duration-300 ${
                          isMultiple
                            ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-500/20 scale-105'
                            : 'bg-slate-800 text-slate-500 border border-slate-800/50'
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>

                {/* Επεξηγηματικό Tip */}
                <div className="text-center text-[11px] font-medium text-slate-400 border-t border-slate-800 pt-3">
                  <span>💡 Συμβουλή: Παρατήρησε πώς τα πολλαπλάσια δημιουργούν όμορφες γραμμές ή μοτίβα ανάλογα με τον αριθμό που διαλέγεις!</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Πολλαπλάσια Αριθμών - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
