import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [
  { n1: 12, n2: 18, label: "Μ.Κ.Δ.(12, 18)" },
  { n1: 20, n2: 30, label: "Μ.Κ.Δ.(20, 30)" },
  { n1: 16, n2: 24, label: "Μ.Κ.Δ.(16, 24)" },
  { n1: 15, n2: 25, label: "Μ.Κ.Δ.(15, 25)" }
];

export default function MkdPage() {
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);

  const handleInputChange = (setter, val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setter('');
    } else if (parsed > 100) {
      setter(100); // Όριο το 100 για ομαλή οπτικοποίηση
    } else {
      setter(parsed);
    }
  };

  // Εύρεση διαιρετών
  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const divisors1 = getDivisors(num1);
  const divisors2 = getDivisors(num2);

  // Εύρεση κοινών διαιρετών
  const commonDivisors = divisors1.filter(d => divisors2.includes(d));
  
  // Εύρεση ΜΚΔ
  const mkd = commonDivisors.length > 0 ? Math.max(...commonDivisors) : 1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - LearnMaths.gr</title>
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
                    <span>📖</span> Τι είναι ο Μέγιστος Κοινός Διαιρέτης;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Όταν έχουμε δύο ή περισσότερους αριθμούς, βρίσκουμε τους διαιρέτες τους. Οι διαιρέτες που είναι ίδιοι και για τους δύο, λέγονται <strong>κοινοί διαιρέτες</strong>.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Ο μεγαλύτερος από αυτούς τους κοινούς διαιρέτες ονομάζεται <strong>Μέγιστος Κοινός Διαιρέτης</strong> και τον γράφουμε σύντομα <strong>Μ.Κ.Δ.</strong>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-2">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">⚡ Πώς τον βρίσκουμε;</span>
                <p className="text-xs md:text-sm text-indigo-50 font-normal">
                  Έστω ότι ψάχνουμε τον Μ.Κ.Δ. των αριθμών 8 και 12:
                </p>
                <div className="space-y-1 font-mono text-xs md:text-sm pt-1">
                  <div>• Διαιρέτες του 8: <strong className="text-amber-200">1</strong>, <strong className="text-amber-200">2</strong>, <strong className="text-amber-200">4</strong>, 8</div>
                  <div>• Διαιρέτες του 12: <strong className="text-amber-200">1</strong>, <strong className="text-amber-200">2</strong>, 3, <strong className="text-amber-200">4</strong>, 6, 12</div>
                  <div>• Κοινοί Διαιρέτες: 1, 2, 4</div>
                </div>
                <p className="text-xs font-bold text-amber-200 pt-2 border-t border-white/10">
                  Ο μεγαλύτερος κοινός είναι το 4. Άρα: Μ.Κ.Δ.(8, 12) = 4!
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUTS & PRESETS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δώσε δύο Αριθμούς!</h3>
                  <p className="text-gray-500 text-xs">Βάλε αριθμούς από το 1 έως το 100 για να βρεις τον Μ.Κ.Δ. τους.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">1ος Αριθμός</span>
                    <input
                      type="text"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, e.target.value)}
                      className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-blue-200 rounded-xl text-blue-600 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">2ος Αριθμός</span>
                    <input
                      type="text"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, e.target.value)}
                      className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-indigo-200 rounded-xl text-indigo-600 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Γρήγορα Παραδείγματα:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setNum1(preset.n1); setNum2(preset.n2); }}
                        className={`text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs transition-all ${num1 === preset.n1 && num2 === preset.n2 ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΑΝΑΛΥΣΗ ΔΙAΙΡΕΤΩΝ & ΜΚΔ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[460px] space-y-6">
              
              {/* ΛΙΣΤΑ ΔΙΑΙΡΕΤΩΝ */}
              <div className="w-full space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="text-sm font-bold text-slate-700">
                    🔍 Διαιρέτες του <span className="text-blue-600 font-black">{num1 || "—"}</span>:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {divisors1.map(d => {
                      const isCommon = divisors2.includes(d);
                      const isMkd = d === mkd;
                      return (
                        <span key={d} className={`font-mono font-black px-3 py-1.5 text-sm rounded-lg border transition-all ${isMkd ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105' : isCommon ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                          {d} {isMkd && '🏆'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="text-sm font-bold text-slate-700">
                    🔍 Διαιρέτες του <span className="text-indigo-600 font-black">{num2 || "—"}</span>:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {divisors2.map(d => {
                      const isCommon = divisors1.includes(d);
                      const isMkd = d === mkd;
                      return (
                        <span key={d} className={`font-mono font-black px-3 py-1.5 text-sm rounded-lg border transition-all ${isMkd ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105' : isCommon ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                          {d} {isMkd && '🏆'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΚΔ (VISUALIZATION) */}
              {num1 && num2 && (
                <div className="w-full bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">💻 Γραφική Αναπαράσταση: Πώς μετράει ο Μ.Κ.Δ. ({mkd}) τους αριθμούς</span>
                  
                  <div className="space-y-3 font-mono text-xs">
                    {/* Μπάρα 1 */}
                    <div className="space-y-1">
                      <div className="text-slate-400 flex justify-between">
                        <span>Αριθμός {num1}:</span>
                        <span className="text-blue-400 font-bold">{num1 / mkd} κομμάτια των {mkd}</span>
                      </div>
                      <div className="flex w-full bg-slate-800 h-7 rounded-lg overflow-hidden border border-slate-700">
                        {Array.from({ length: num1 / mkd }).map((_, i) => (
                          <div 
                            key={i} 
                            className="h-full border-r border-slate-900 bg-blue-600/80 flex items-center justify-center font-black text-white text-xs"
                            style={{ width: `${100 / (num1 / mkd)}%` }}
                          >
                            {mkd}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Μπάρα 2 */}
                    <div className="space-y-1">
                      <div className="text-slate-400 flex justify-between">
                        <span>Αριθμός {num2}:</span>
                        <span className="text-indigo-400 font-bold">{num2 / mkd} κομμάτια των {mkd}</span>
                      </div>
                      <div className="flex w-full bg-slate-800 h-7 rounded-lg overflow-hidden border border-slate-700">
                        {Array.from({ length: num2 / mkd }).map((_, i) => (
                          <div 
                            key={i} 
                            className="h-full border-r border-slate-900 bg-indigo-600/80 flex items-center justify-center font-black text-white text-xs"
                            style={{ width: `${100 / (num2 / mkd)}%` }}
                          >
                            {mkd}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ ΜΚΔ */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-sans uppercase tracking-wider">Μέγιστος Κοινός Διαιρέτης:</span>
                <span className="text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">
                  Μ.Κ.Δ.({num1 || "?"}, {num2 || "?"}) = {mkd}
                </span>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Μέγιστος Κοινός Διαιρέτης - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
