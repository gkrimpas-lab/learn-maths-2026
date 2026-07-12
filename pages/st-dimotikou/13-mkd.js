import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS_2 = [
  { n1: 12, n2: 18, label: "Μ.Κ.Δ.(12, 18)" },
  { n1: 20, n2: 30, label: "Μ.Κ.Δ.(20, 30)" }
];
const PRESETS_3 = [
  { n1: 12, n2: 18, n3: 24, label: "Μ.Κ.Δ.(12, 18, 24)" },
  { n1: 15, n2: 30, n3: 45, label: "Μ.Κ.Δ.(15, 30, 45)" }
];
const PRESETS_4 = [
  { n1: 12, n2: 16, n3: 20, n4: 24, label: "Μ.Κ.Δ.(12, 16, 20, 24)" },
  { n1: 20, n2: 40, n3: 60, n4: 80, label: "Μ.Κ.Δ.(20, 40, 60, 80)" }
];

export default function MkdPage() {
  const [activeTab, setActiveTab] = useState(2); // 2, 3, ή 4 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(24);
  const [num4, setNum4] = useState(36);

  const handleInputChange = (setter, val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setter('');
    } else if (parsed > 100) {
      setter(100);
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
  const divisors3 = getDivisors(num3);
  const divisors4 = getDivisors(num4);

  // Υπολογισμός Κοινών Διαιρετών και ΜΚΔ ανάλογα με το Tab
  let commonDivisors = [];
  let numbersList = [];

  if (activeTab === 2) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' }
    ];
  } else if (activeTab === 3) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d) && divisors3.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' }
    ];
  } else if (activeTab === 4) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d) && divisors3.includes(d) && divisors4.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' },
      { val: num4, div: divisors4, color: 'text-pink-600', bg: 'bg-pink-600/80', label: '4ος Αριθμός' }
    ];
  }

  const mkd = commonDivisors.length > 0 ? Math.max(...commonDivisors) : 1;
  const currentNumbersString = numbersList.map(n => n.val || "?").join(", ");

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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Τι είναι ο Μέγιστος Κοινός Διαιρέτης;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Όταν έχουμε δύο ή περισσότερους αριθμούς, βρίσκουμε τους διαιρέτες τους. Οι διαιρέτες που είναι ίδιοι για όλους τους αριθμούς, λέγονται <strong>κοινοί διαιρέτες</strong>.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Ο μεγαλύτερος από αυτούς τους κοινούς διαιρέτες ονομάζεται <strong>Μέγιστος Κοινός Διαιρέτης</strong> και τον γράφουμε σύντομα <strong>Μ.Κ.Δ.</strong>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-2">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">⚡ Πώς τον βρίσκουμε;</span>
                <p className="text-xs md:text-sm text-indigo-50 font-normal">
                  Βρίσκουμε τους διαιρέτες όλων των αριθμών, κυκλώνουμε όσους είναι ολοίδιοι σε όλες τις λίστες, και κρατάμε τον μεγαλύτερο! 
                </p>
                <p className="text-xs font-bold text-amber-200 pt-2 border-t border-white/10 leading-relaxed">
                  💡 Αν οι αριθμοί δεν έχουν κανέναν άλλο κοινό διαιρέτη, τότε ο Μ.Κ.Δ. τους είναι αναγκαστικά το <strong>1</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* CARDS / TABS SELECTOR */}
          <div className="flex justify-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
            {[2, 3, 4].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                {tab} Αριθμοί
              </button>
            ))}
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUTS & PRESETS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δώσε τους Αριθμούς σου!</h3>
                  <p className="text-gray-500 text-xs">Βάλε αριθμούς από το 1 έως το 100 για να βρεις τον Μ.Κ.Δ.</p>
                </div>

                {/* Δυναμικά Inputs με βάση το Tab */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">1ος Αριθμός</span>
                    <input
                      type="text"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, e.target.value)}
                      className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-blue-200 rounded-xl text-blue-600 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">2ος Αριθμός</span>
                    <input
                      type="text"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, e.target.value)}
                      className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-indigo-200 rounded-xl text-indigo-600 outline-none focus:border-indigo-500"
                    />
                  </div>
                  {activeTab >= 3 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">3ος Αριθμός</span>
                      <input
                        type="text"
                        value={num3}
                        onChange={(e) => handleInputChange(setNum3, e.target.value)}
                        className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-purple-200 rounded-xl text-purple-600 outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                  {activeTab === 4 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">4ος Αριθμός</span>
                      <input
                        type="text"
                        value={num4}
                        onChange={(e) => handleInputChange(setNum4, e.target.value)}
                        className="w-full text-xl font-mono font-black text-center p-2.5 bg-slate-50 border-2 border-pink-200 rounded-xl text-pink-600 outline-none focus:border-pink-500"
                      />
                    </div>
                  )}
                </div>

                {/* Δυναμικά Presets */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Γρήγορα Παραδείγματα:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeTab === 2 && PRESETS_2.map((p, idx) => (
                      <button key={idx} onClick={() => { setNum1(p.n1); setNum2(p.n2); }} className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">{p.label}</button>
                    ))}
                    {activeTab === 3 && PRESETS_3.map((p, idx) => (
                      <button key={idx} onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); }} className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">{p.label}</button>
                    ))}
                    {activeTab === 4 && PRESETS_4.map((p, idx) => (
                      <button key={idx} onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); setNum4(p.n4); }} className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">{p.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΑΝΑΛΥΣΗ ΔΙAΙΡΕΤΩΝ & ΜΚΔ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[460px] space-y-6">
              
              {/* ΔΥΝΑΜΙΚΗ ΛΙΣΤΑ ΔΙΑΙΡΕΤΩΝ */}
              <div className="w-full space-y-3">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      🔍 Διαιρέτες του <span className={`${numObj.color} font-black`}>{numObj.val || "—"}</span> ({numObj.label}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {numObj.div.map(d => {
                        const isCommon = commonDivisors.includes(d);
                        const isMkd = d === mkd;
                        return (
                          <span key={d} className={`font-mono font-black px-2.5 py-1 text-xs rounded-lg border transition-all ${isMkd ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105' : isCommon ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                            {d} {isMkd && '🏆'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΚΔ */}
              <div className="w-full bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                  💻 Γραφική Αναπαράσταση: Πώς μετράει ο Μ.Κ.Δ. ({mkd}) τους αριθμούς
                </span>
                
                <div className="space-y-4 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
                  {numbersList.map((numObj, idx) => {
                    if (!numObj.val || mkd <= 0) return null;
                    const segments = numObj.val / mkd;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="text-slate-400 flex justify-between text-[11px]">
                          <span>{numObj.label} ({numObj.val}):</span>
                          <span className={`${numObj.color} font-bold brightness-125`}>{segments} κομμάτια των {mkd}</span>
                        </div>
                        <div className="flex w-full bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-700">
                          {Array.from({ length: segments }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-full border-r border-slate-900 ${numObj.bg} flex items-center justify-center font-black text-white text-[10px]`}
                              style={{ width: `${100 / segments}%` }}
                            >
                              {mkd}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ ΜΚΔ */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-sans uppercase tracking-wider">Μέγιστος Κοινός Διαιρέτης:</span>
                <span className="text-xl md:text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">
                  Μ.Κ.Δ.({currentNumbersString}) = {mkd}
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
