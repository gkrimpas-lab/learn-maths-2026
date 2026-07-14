import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος αριθμός για εισαγωγή (όριο το 1000)
const MAX_ALLOWED_NUMBER = 1000;

const PRESETS_2 = [
  { n1: 12, n2: 18, label: "Ε.Κ.Π.(12, 18)" },
  { n1: 24, n2: 36, label: "Ε.Κ.Π.(24, 36)" }
];
const PRESETS_3 = [
  { n1: 8, n2: 12, n3: 15, label: "Ε.Κ.Π.(8, 12, 15)" },
  { n1: 10, n2: 15, n3: 20, label: "Ε.Κ.Π.(10, 15, 20)" }
];

// Συνάρτηση που επιστρέφει τους πρώτους παράγοντες ενός αριθμού και τα βήματα της κάθετης ανάλυσης
function factorize(num) {
  if (!num || num < 2) return { steps: [], factors: {}, expr: "1" };
  
  let temp = num;
  const steps = [];
  const factors = {};
  let d = 2;

  while (temp > 1) {
    if (temp % d === 0) {
      steps.push({ current: temp, divisor: d });
      factors[d] = (factors[d] || 0) + 1;
      temp = temp / d;
    } else {
      d++;
    }
    if (d > 1000) break; // Ασφάλεια
  }
  steps.push({ current: 1, divisor: null });

  // Δημιουργία string έκφρασης (π.χ. 2² · 3)
  const parts = Object.keys(factors).map(f => {
    const exp = factors[f];
    return exp > 1 ? `${f}<sup>${exp}</sup>` : `${f}`;
  });
  const expr = parts.join(" · ");

  return { steps, factors, expr };
}

export default function EkpProtoiPage() {
  const [activeTab, setActiveTab] = useState(2); // 2 ή 3 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(15);

  const handleInputChange = (setter, currentVal, val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setter('');
      return;
    }
    
    const n = Number(clean);
    // ΑΛΛΑΓΗ ΕΔΩ: Αν η νέα τιμή ξεπερνάει το 1000, αγνοούμε την αλλαγή 
    // και κρατάμε την προηγούμενη (τρέχουσα) τιμή.
    if (n > MAX_ALLOWED_NUMBER) {
      return; 
    }
    
    setter(n);
  };

  const f1 = factorize(num1);
  const f2 = factorize(num2);
  const f3 = activeTab === 3 ? factorize(num3) : { steps: [], factors: {}, expr: "1" };

  // Εύρεση ΕΚΠ μέσω των μέγιστων εκθετών των πρώτων παραγόντων
  const allPrimeBases = Array.from(new Set([
    ...Object.keys(f1.factors).map(Number),
    ...Object.keys(f2.factors).map(Number),
    ...Object.keys(f3.factors).map(Number)
  ])).sort((a, b) => a - b);

  const maxFactors = {};
  let ekp = 1;
  let calculationExplanation = [];

  allPrimeBases.forEach(base => {
    const e1 = f1.factors[base] || 0;
    const e2 = f2.factors[base] || 0;
    const e3 = activeTab === 3 ? (f3.factors[base] || 0) : 0;
    
    const maxExp = Math.max(e1, e2, e3);
    if (maxExp > 0) {
      maxFactors[base] = maxExp;
      ekp *= Math.pow(base, maxExp);
      
      calculationExplanation.push(
        maxExp > 1 ? `${base}<sup>${maxExp}</sup>` : `${base}`
      );
    }
  });

  const activeNumbers = activeTab === 2 ? [num1 || 1, num2 || 1] : [num1 || 1, num2 || 1, num3 || 1];

  // Δυναμική παραγωγή πολλαπλασίων (όπως ζητήθηκε: ελάχιστο 20, μέγιστο 3 * ΕΚΠ + 1)
  const getDynamicMultiples = (num) => {
    if (!num || num < 1) return [];
    const arr = [];
    const targetLimit = (ekp * 3) + 1;
    let i = 1;
    while (true) {
      const multiple = num * i;
      if (multiple > targetLimit && i > 20) break;
      arr.push(multiple);
      i++;
      if (i > 1000) break;
    }
    return arr;
  };

  const mult1 = getDynamicMultiples(num1);
  const mult2 = getDynamicMultiples(num2);
  const mult3 = getDynamicMultiples(num3);

  let numbersList = [];
  if (activeTab === 2) {
    numbersList = [
      { val: num1, mult: mult1, color: 'text-blue-600', fact: f1, label: '1ος Αριθμός' },
      { val: num2, mult: mult2, color: 'text-indigo-600', fact: f2, label: '2ος Αριθμός' }
    ];
  } else {
    numbersList = [
      { val: num1, mult: mult1, color: 'text-blue-600', fact: f1, label: '1ος Αριθμός' },
      { val: num2, mult: mult2, color: 'text-indigo-600', fact: f2, label: '2ος Αριθμός' },
      { val: num3, mult: mult3, color: 'text-purple-600', fact: f3, label: '3ος Αριθμός' }
    ];
  }

  const commonMultiples = [ekp, ekp * 2, ekp * 3];
  const gridNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const currentNumbersString = activeNumbers.join(", ");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔬 Ε.Κ.Π. με Πρώτους Παράγοντες - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΜΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Ε.Κ.Π. με Ανάλυση σε Γινόμενο Πρώτων Παραγόντων
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Όταν οι αριθμοί είναι μεγάλοι, η γραφή των πολλαπλασίων είναι κουραστική. Τότε χρησιμοποιούμε την <strong>Ανάλυση σε Πρώτους Παράγοντες</strong>!
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    <strong>Ο Κανόνας:</strong> Αναλύουμε κάθε αριθμό σε γινόμενο πρώτων παραγόντων. Το Ε.Κ.Π. των αριθμών είναι το γινόμενο των <strong>κοινών και μη κοινών πρώτων παραγόντων τους με τον μεγαλύτερο εκθέτη</strong>.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-md space-y-2 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">⚡ Παράδειγμα:</span>
                <p className="text-xs md:text-sm text-indigo-50 font-mono leading-relaxed">
                  12 = 2<sup>2</sup> · 3 <br />
                  18 = 2 · 3<sup>2</sup>
                </p>
                <p className="text-xs font-bold text-amber-200 pt-2 border-t border-white/10 leading-relaxed">
                  💡 Από τα 2 παίρνουμε το 2<sup>2</sup>. Από τα 3 παίρνουμε το 3<sup>2</sup>.<br />
                  Άρα Ε.Κ.Π.(12, 18) = 2<sup>2</sup> · 3<sup>2</sup> = 4 · 9 = 36!
                </p>
              </div>
            </div>
          </div>

          {/* TABS SELECTOR */}
          <div className="flex justify-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
            {[2, 3].map((tab) => (
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
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUTS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δώσε τους Αριθμούς!</h3>
                  <p className="text-gray-500 text-xs">Βάλε αριθμούς έως το {MAX_ALLOWED_NUMBER}.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500">1ος Αριθμός:</span>
                    <input
                      type="text"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, num1, e.target.value)}
                      className="w-24 text-lg font-mono font-black text-center p-1.5 bg-white border-2 border-blue-200 rounded-lg text-blue-600 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500">2ος Αριθμός:</span>
                    <input
                      type="text"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, num2, e.target.value)}
                      className="w-24 text-lg font-mono font-black text-center p-1.5 bg-white border-2 border-indigo-200 rounded-lg text-indigo-600 outline-none focus:border-indigo-500"
                    />
                  </div>
                  {activeTab === 3 && (
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-500">3ος Αριθμός:</span>
                      <input
                        type="text"
                        value={num3}
                        onChange={(e) => handleInputChange(setNum3, num3, e.target.value)}
                        className="w-24 text-lg font-mono font-black text-center p-1.5 bg-white border-2 border-purple-200 rounded-lg text-purple-600 outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Γρήγορα Παραδείγματα */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Παραδειγματα σχολικου βιβλιου:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeTab === 2 ? PRESETS_2.map((p, idx) => (
                      <button key={idx} onClick={() => { setNum1(p.n1); setNum2(p.n2); }} className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">{p.label}</button>
                    )) : PRESETS_3.map((p, idx) => (
                      <button key={idx} onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); }} className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">{p.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΚΑΘΕΤΗ ΑΝΑΛΥΣΗ & ΕΞΑΓΩΓΗ ΕΚΠ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[600px] space-y-6">
              
              {/* ΟΠΤΙΚΗ ΚΑΘΕΤΗ ΑΝΑΛΥΣΗ ΣΕ ΣΤΗΛΕΣ */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="flex flex-col items-center space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-[160px]">
                    <span className={`text-xs font-black uppercase ${numObj.color}`}>{numObj.label}</span>
                    
                    {/* Η Κλασική Κάθετη Γραμμή */}
                    <div className="font-mono text-base md:text-lg">
                      {numObj.fact.steps.map((step, sIdx) => (
                        <div key={sIdx} className="grid grid-cols-2 gap-x-2 text-right relative">
                          <div className="pr-2 text-slate-800">{step.current}</div>
                          {step.divisor && (
                            <div className="pl-2 text-red-600 font-bold border-l-2 border-slate-400">
                              {step.divisor}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Τελική Μορφή Γινομένου */}
                    <div className="text-center pt-2 border-t border-slate-100 w-full">
                      <span className="text-[10px] text-slate-400 block font-bold">Γινόμενο:</span>
                      <span className="font-mono font-black text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: `${numObj.val} = ${numObj.fact.expr}` }}></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ΔΥΝΑΜΙΚΗ ΟΡΙΖΟΝΤΙΑ ΛΙΣΤΑ ΕΠΑΛΗΘΕΥΣΗΣ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
              <div className="w-full space-y-2.5">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">🔬 Οριζοντια Επαληθευση (Λιστα Πολλαπλασιων):</span>
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex flex-col space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">Πολλαπλάσια του {numObj.val}:</div>
                    <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto pr-1">
                      {numObj.mult.map(m => {
                        const isEkp = m === ekp;
                        const isCommonMultiple = activeNumbers.every(num => m % num === 0);
                        return (
                          <span 
                            key={m} 
                            className={`font-mono font-black px-2 py-0.5 text-[11px] rounded border ${
                              isEkp 
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105' 
                                : isCommonMultiple 
                                  ? 'bg-amber-100 border-amber-300 text-amber-800' 
                                  : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            {m} {isEkp && '🏆'} {isCommonMultiple && !isEkp && '⭐'}
                          </span>
                        );
                      })}
                      <span className="text-slate-400 font-mono text-xs self-center">...</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΠΙΝΑΚΑΣ ΕΚΑΤΟΝΤΑΔΑΣ */}
              <div className="w-full bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">💻 Πινακας Εκατονταδας (1-100)</span>
                </div>
                {ekp > 100 ? (
                  <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                    ℹ️ Το Ε.Κ.Π. ({ekp}) ξεπερνάει το 100, αλλά επιβεβαιώνεται από την ανάλυση παραπάνω!
                  </div>
                ) : (
                  <div className="grid grid-cols-10 gap-1 max-w-xs mx-auto w-full font-mono text-[9px] md:text-xs select-none p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {gridNumbers.map((num) => {
                      const isMultipleOfAll = activeNumbers.every(nVal => num % nVal === 0);
                      const isEkp = num === ekp;
                      let tileStyle = "bg-slate-800 text-slate-600 border border-slate-900/50";
                      
                      if (isEkp) {
                        tileStyle = "bg-amber-400 text-slate-950 border border-amber-300 scale-110 z-10 font-black";
                      } else if (isMultipleOfAll) {
                        tileStyle = "bg-amber-100/50 text-amber-800 border border-amber-300/40 font-bold";
                      } else {
                        if (numbersList.some(nObj => num % nObj.val === 0)) {
                          tileStyle = "bg-slate-700 text-slate-200 border border-slate-600 font-bold";
                        }
                      }
                      return (
                        <div key={num} className={`aspect-square rounded-md flex items-center justify-center transition-all ${tileStyle}`}>
                          {num}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ΤΕΛΙΚΟ Ε.Κ.Π. ΜΕ ΕΞΗΓΗΣΗ ΠΑΡΑΓΟΝΤΩΝ */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg font-mono flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-xs font-sans uppercase tracking-wider text-indigo-200 block">Εξαγωγη βασει Κανονα (Μεγιστοι Εκθετες):</span>
                  <div className="text-sm md:text-base font-black flex items-center gap-1.5 flex-wrap">
                    Ε.Κ.Π. = 
                    <span className="bg-white/20 px-2 py-0.5 rounded" dangerouslySetInnerHTML={{ __html: calculationExplanation.join(" · ") }}></span>
                    = {ekp}
                  </div>
                </div>

                <div className="text-center md:text-right border-t border-white/20 md:border-t-0 pt-3 md:pt-0">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-amber-300 block mb-0.5">🏆 Αποτέλεσμα:</span>
                  <span className="text-base md:text-lg font-black bg-amber-400 text-slate-900 px-3 py-1 rounded-xl shadow-md inline-block">
                    Ε.Κ.Π.({currentNumbersString}) = {ekp}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Ανάλυση σε Πρώτους Παράγοντες - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
