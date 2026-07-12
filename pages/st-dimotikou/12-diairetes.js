import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [12, 18, 24, 30];

export default function DiairetesPage() {
  const [number, setNumber] = useState(12);

  const handleInputChange = (val) => {
    // Επιτρέπουμε μόνο θετικούς ακέραιους αριθμούς έως το 100 για να μην «κρασάρει» το UI με το γράφημα
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setNumber('');
    } else if (parsed > 100) {
      setNumber(100);
    } else {
      setNumber(parsed);
    }
  };

  // Συνάρτηση εύρεσης των διαιρετών
  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        divisors.push(i);
      }
    }
    return divisors;
  };

  const divisors = getDivisors(number);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Οι Διαιρέτες ενός Αριθμού - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Τι είναι οι Διαιρέτες;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    <strong>Διαιρέτες</strong> ενός φυσικού αριθμού ονομάζονται όλοι οι άλλοι φυσικοί αριθμοί που τον <strong>διαιρούν ακριβώς</strong> (δηλαδή η διαίρεση αφήνει <span className="text-emerald-600 font-bold">υπόλοιπο 0</span>).
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    💡 <em>Θυμήσου:</em> Κάθε αριθμός έχει οπωσδήποτε διαιρέτη τον <strong>εαυτό του</strong> και τη μονάδα (<strong>1</strong>).
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-3">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">🌟 Παράδειγμα: Οι Διαιρέτες του 6</span>
                <p className="text-xs md:text-sm text-indigo-50 leading-relaxed font-normal">
                  Αν δοκιμάσουμε να διαιρέσουμε το 6 με όλους τους μικρότερούς του αριθμούς, βλέπουμε ότι:
                </p>
                <div className="space-y-1.5 font-mono text-xs md:text-sm pt-1">
                  <div>• 6 ÷ <strong className="text-amber-200">1</strong> = 6 <span className="text-emerald-300">(τέλεια!)</span></div>
                  <div>• 6 ÷ <strong className="text-amber-200">2</strong> = 3 <span className="text-emerald-300">(τέλεια!)</span></div>
                  <div>• 6 ÷ <strong className="text-amber-200">3</strong> = 2 <span className="text-emerald-300">(τέλεια!)</span></div>
                  <div>• 6 ÷ 4 = 1 και υπόλοιπο 2 ❌</div>
                  <div>• 6 ÷ <strong className="text-amber-200">6</strong> = 1 <span className="text-emerald-300">(τέλεια!)</span></div>
                </div>
                <p className="text-xs font-bold text-amber-200 pt-1">Άρα οι διαιρέτες του 6 είναι οι: 1, 2, 3, 6.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUT & PRESETS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Διάλεξε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Γράψε έναν αριθμό από το 1 έως το 100 για να δεις τους διαιρέτες του.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-2xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 12"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Η επιλεξε ενα ετοιμο:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setNumber(preset)}
                        className={`text-center px-4 py-2.5 rounded-xl border font-mono font-bold text-sm transition-all ${number === preset ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        Αριθμός {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΖΩΝΤΑΝΗ ΑΝΑΛΥΣΗ & ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Διαιρετες του αριθμου {number || "—"}:</span>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {divisors.length > 0 ? (
                    divisors.map((div) => (
                      <span key={div} className="text-lg md:text-xl font-mono font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                        {div}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">Βάλε έναν έγκυρο αριθμό...</span>
                  )}
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (VISUALIZATION) */}
              <div className="w-full space-y-6 my-auto">
                {number && divisors.length > 0 ? (
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">💻 Γραφικη Αναπαρασταση (Πως χωριζεται το {number}):</span>
                    
                    <div className="max-h-[280px] overflow-y-auto space-y-4 pr-2">
                      {divisors.map((div) => {
                        const groups = number / div;
                        return (
                          <div key={div} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                            <div className="text-xs font-bold text-slate-600 flex justify-between">
                              <span>Διαιρέτης: <span className="text-blue-600 font-black">{div}</span></span>
                              <span className="font-mono text-slate-400">{number} ÷ {div} = {groups} ομάδες</span>
                            </div>
                            
                            {/* Σχεδίαση των ομάδων/κουτιών */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Array.from({ length: groups }).map((_, gIdx) => (
                                <div key={gIdx} className="flex gap-0.5 bg-blue-100 p-1 rounded border border-blue-200">
                                  {Array.from({ length: div }).map((_, bIdx) => (
                                    <div key={bIdx} className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-600 rounded-sm" title={`Ομάδα ${gIdx+1}, τετράγωνο ${bIdx+1}`}></div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-slate-400 font-medium">
                    Επιλέξτε έναν αριθμό για να δείτε το γράφημα των διαιρετών.
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Παρατήρησε ότι το πλήθος των τετραγώνων σε κάθε γραμμή είναι πάντα ακριβώς {number}!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Οι Διαιρέτες ενός Αριθμού - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
