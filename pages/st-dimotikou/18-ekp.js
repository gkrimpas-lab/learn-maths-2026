import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος αριθμός για εισαγωγή (έως 10 ψηφία)
const MAX_ALLOWED_NUMBER = 9999999999;

const PRESETS_2 = [
  { n1: 3, n2: 4, label: "Ε.Κ.Π.(3, 4)" },
  { n1: 6, n2: 8, label: "Ε.Κ.Π.(6, 8)" }
];
const PRESETS_3 = [
  { n1: 2, n2: 3, n3: 5, label: "Ε.Κ.Π.(2, 3, 5)" },
  { n1: 4, n2: 6, n3: 8, label: "Ε.Κ.Π.(4, 6, 8)" }
];
const PRESETS_4 = [
  { n1: 2, n2: 3, n3: 4, n4: 6, label: "Ε.Κ.Π.(2, 3, 4, 6)" },
  { n1: 3, n2: 5, n3: 6, n4: 10, label: "Ε.Κ.Π.(3, 5, 6, 10)" }
];

export default function EkpPage() {
  const [activeTab, setActiveTab] = useState(2); // 2, 3, ή 4 αριθμοί
  
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [num3, setNum3] = useState(6);
  const [num4, setNum4] = useState(8);

  const handleInputChange = (setter, val) => {
    const clean = val.replace(/[^0-9]/g, '');
    const sliced = clean.slice(0, 10); // Όριο 10 ψηφία
    
    if (sliced === '') {
      setter('');
    } else {
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setter(MAX_ALLOWED_NUMBER.toString());
      } else {
        setter(Number(sliced));
      }
    }
  };

  // Εύρεση των πρώτων 15 πολλαπλασίων ενός αριθμού (εκτός του 0 για εύρεση ΕΚΠ)
  const getMultiples = (num, count = 15) => {
    if (!num || num < 1) return [];
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(num * i);
    }
    return arr;
  };

  const mult1 = getMultiples(num1);
  const mult2 = getMultiples(num2);
  const mult3 = getMultiples(num3);
  const mult4 = getMultiples(num4);

  // Υπολογισμός ΕΚΠ με βάση το Tab χρησιμοποιώντας τον αλγόριθμο ΜΚΔ (LCM(a,b) = a*b / GCD(a,b))
  const gcd = (a, b) => {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return (a * b) / gcd(a, b);
  };

  let ekp = 1;
  let numbersList = [];

  if (activeTab === 2) {
    ekp = lcm(num1 || 1, num2 || 1);
    numbersList = [
      { val: num1, mult: mult1, color: 'text-blue-600', gridBg: 'bg-blue-600', label: '1ος Αριθμός' },
      { val: num2, mult: mult2, color: 'text-indigo-600', gridBg: 'bg-indigo-600', label: '2ος Αριθμός' }
    ];
  } else if (activeTab === 3) {
    ekp = lcm(lcm(num1 || 1, num2 || 1), num3 || 1);
    numbersList = [
      { val: num1, mult: mult1, color: 'text-blue-600', gridBg: 'bg-blue-600', label: '1ος Αριθμός' },
      { val: num2, mult: mult2, color: 'text-indigo-600', gridBg: 'bg-indigo-600', label: '2ος Αριθμός' },
      { val: num3, mult: mult3, color: 'text-purple-600', gridBg: 'bg-purple-600', label: '3ος Αριθμός' }
    ];
  } else if (activeTab === 4) {
    ekp = lcm(lcm(lcm(num1 || 1, num2 || 1), num3 || 1), num4 || 1);
    numbersList = [
      { val: num1, mult: mult1, color: 'text-blue-600', gridBg: 'bg-blue-600', label: '1ος Αριθμός' },
      { val: num2, mult: mult2, color: 'text-indigo-600', gridBg: 'bg-indigo-600', label: '2ος Αριθμός' },
      { val: num3, mult: mult3, color: 'text-purple-600', gridBg: 'bg-purple-600', label: '3ος Αριθμός' },
      { val: num4, mult: mult4, color: 'text-pink-600', gridBg: 'bg-pink-600', label: '4ος Αριθμός' }
    ];
  }

  // Δημιουργία πίνακα 1-100 για τη γραφική αναπαράσταση
  const gridNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const currentNumbersString = numbersList.map(n => n.val || "?").join(", ");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) - LearnMaths.gr</title>
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
                    <span>📖</span> Τι είναι το Ελάχιστο Κοινό Πολλαπλάσιο;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Όταν γράφουμε τα πολλαπλάσια δύο ή περισσότερων αριθμών, θα παρατηρήσουμε ότι κάποια πολλαπλάσια είναι ολοίδια. Αυτά ονομάζονται <strong>κοινά πολλαπλάσια</strong>.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Το μικρότερο από αυτά τα κοινά πολλαπλάσια (αν εξαιρέσουμε το 0) ονομάζεται <strong>Ελάχιστο Κοινό Πολλαπλάσιο</strong> και το γράφουμε σύντομα <strong>Ε.Κ.Π.</strong>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-2 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">⚡ Πώς το βρίσκουμε;</span>
                <p className="text-xs md:text-sm text-indigo-50 font-normal leading-relaxed">
                  Βρίσκουμε τα πολλαπλάσια των αριθμών (προπαίδεια), κυκλώνουμε όσα είναι κοινά σε όλες τις λίστες, και κρατάμε το **μικρότερο** από αυτά (εκτός του 0)!
                </p>
                <p className="text-xs font-bold text-amber-200 pt-2 border-t border-white/10 leading-relaxed">
                  💡 Το Ε.Κ.Π. μας βοηθάει πάρα πολύ για να μετατρέψουμε ετερώνυμα κλάσματα σε ομώνυμα!
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
                  <p className="text-gray-500 text-xs">Βάλε αριθμούς (έως 10 ψηφία) για να βρεις το Ε.Κ.Π.</p>
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

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΑΝΑΛΥΣΗ ΠΟΛΛΑΠΛΑΣΙΩΝ & ΕΚΠ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[600px] space-y-6">
              
              {/* ΔΥΝΑΜΙΚΗ ΛΙΣΤΑ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
              <div className="w-full space-y-3">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      🔍 Πολλαπλάσια του <span className={`${numObj.color} font-black`}>{numObj.val || "—"}</span> ({numObj.label}):
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {numObj.mult.map(m => {
                        const isMkd = m === ekp;
                        return (
                          <span key={m} className={`font-mono font-black px-2.5 py-1 text-xs rounded-lg border transition-all ${isMkd ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105' : 'bg-white border-slate-200 text-slate-500'}`}>
                            {m} {isMkd && '🏆'}
                          </span>
                        );
                      })}
                      <span className="text-slate-400 font-mono text-xs self-center">...</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΠΙΝΑΚΑΣ ΕΚΑΤΟΝΤΑΔΑΣ ΜΕ ΧΡΩΜΑΤΙΚΟ ΕΛΕΓΧΟ */}
              <div className="w-full bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    💻 Γραφική Αναπαράσταση: Πίνακας Εκατοντάδας (1-100)
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Παρατήρησε ποια νούμερα χρωματίζονται. Το **Ε.Κ.Π.** είναι το **πρώτο χρυσό κουτάκι** όπου συναντιούνται όλοι οι αριθμοί!
                  </p>
                </div>
                
                {ekp > 100 ? (
                  <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                    ℹ️ Το Ε.Κ.Π. ({ekp}) ξεπερνάει το 100, οπότε δεν εμφανίζεται στον πίνακα, αλλά μπορείς να δεις τη λίστα παραπάνω!
                  </div>
                ) : (
                  <div className="grid grid-cols-10 gap-1 md:gap-1.5 max-w-sm mx-auto w-full font-mono text-[9px] md:text-xs select-none p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {gridNumbers.map((num) => {
                      const isMultipleOfAll = numbersList.every(nObj => num % nObj.val === 0);
                      const isEkp = num === ekp;
                      
                      // Υπολογισμός χρωμάτων αν είναι πολλαπλάσιο κάποιου
                      let tileStyle = "bg-slate-800 text-slate-600 border border-slate-900/50";
                      if (isEkp) {
                        tileStyle = "bg-amber-400 text-slate-950 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)] scale-110 z-10 font-black";
                      } else if (isMultipleOfAll) {
                        tileStyle = "bg-amber-100 text-amber-900 border border-amber-300 font-bold";
                      } else {
                        // Αν είναι πολλαπλάσιο τουλάχιστον ενός αριθμού
                        const activeMultiples = numbersList.filter(nObj => num % nObj.val === 0);
                        if (activeMultiples.length > 0) {
                          tileStyle = "bg-slate-700 text-slate-200 border border-slate-600 font-bold";
                        }
                      }

                      return (
                        <div
                          key={num}
                          className={`aspect-square rounded-md flex items-center justify-center transition-all duration-300 ${tileStyle}`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ ΕΚΠ */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                <span className="text-xl font-sans">🏆</span>
                <span className="text-sm font-sans uppercase tracking-wider">Ελάχιστο Κοινό Πολλαπλάσιο:</span>
                <span className="text-xl md:text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">
                  Ε.Κ.Π.({currentNumbersString}) = {ekp}
                </span>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Ελάχιστο Κοινό Πολλαπλάσιο - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
