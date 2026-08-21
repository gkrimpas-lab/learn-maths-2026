import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος αριθμός για εισαγωγή
const MAX_ALLOWED_NUMBER = 1000;

const PRESETS_2 = [
  { n1: 12, n2: 18, label: "Ε.Κ.Π.(12, 18)" },
  { n1: 24, n2: 36, label: "Ε.Κ.Π.(24, 36)" },
  { n1: 20, n2: 50, label: "Ε.Κ.Π.(20, 50)" },
  { n1: 45, n2: 60, label: "Ε.Κ.Π.(45, 60)" }
];

const PRESETS_3 = [
  { n1: 8, n2: 12, n3: 15, label: "Ε.Κ.Π.(8, 12, 15)" },
  { n1: 10, n2: 15, n3: 20, label: "Ε.Κ.Π.(10, 15, 20)" },
  { n1: 12, n2: 18, n3: 24, label: "Ε.Κ.Π.(12, 18, 24)" },
  { n1: 6, n2: 20, n3: 45, label: "Ε.Κ.Π.(6, 20, 45)" }
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
    if (d > 1000) break;
  }
  steps.push({ current: 1, divisor: null });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

  const parts = Object.keys(factors).map(f => {
    const exp = factors[f];
    return exp > 1 ? `${f}${exponentsUnicode[exp] || `^${exp}`}` : `${f}`;
  });
  const expr = parts.join(" × ");

  return { steps, factors, expr };
}

export default function EkpProtoiPage() {
  const [numCount, setNumCount] = useState(2); // 2 ή 3 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(15);

  const handleInputChange = (setter, val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setter('');
      return;
    }
    
    const n = Number(clean);
    if (n <= MAX_ALLOWED_NUMBER) {
      setter(n);
    }
  };

  const f1 = factorize(num1);
  const f2 = factorize(num2);
  const f3 = numCount === 3 ? factorize(num3) : { steps: [], factors: {}, expr: "1" };

  const allPrimeBases = Array.from(new Set([
    ...Object.keys(f1.factors).map(Number),
    ...Object.keys(f2.factors).map(Number),
    ...(numCount === 3 ? Object.keys(f3.factors).map(Number) : [])
  ])).sort((a, b) => a - b);

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

  let ekp = 1;
  const calculationFormulaParts = [];
  const ruleBreakdown = [];

  allPrimeBases.forEach(base => {
    const e1 = f1.factors[base] || 0;
    const e2 = f2.factors[base] || 0;
    const e3 = numCount === 3 ? (f3.factors[base] || 0) : 0;
    
    const maxExp = Math.max(e1, e2, e3);
    if (maxExp > 0) {
      ekp *= Math.pow(base, maxExp);
      
      const expStr = maxExp > 1 ? `${base}${exponentsUnicode[maxExp] || `^${maxExp}`}` : `${base}`;
      calculationFormulaParts.push(expStr);

      const appearances = [];
      if (e1 > 0) appearances.push(`στο ${num1}: ${base}${exponentsUnicode[e1] || ''}`);
      if (e2 > 0) appearances.push(`στο ${num2}: ${base}${exponentsUnicode[e2] || ''}`);
      if (numCount === 3 && e3 > 0) appearances.push(`στο ${num3}: ${base}${exponentsUnicode[e3] || ''}`);

      ruleBreakdown.push({
        base,
        maxExp,
        expStr,
        appearances: appearances.join(', ')
      });
    }
  });

  const activeNumbers = numCount === 2 ? [num1 || 1, num2 || 1] : [num1 || 1, num2 || 1, num3 || 1];

  const numbersList = [
    { val: num1, color: 'text-blue-600', fact: f1, label: '1ος Αριθμός', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    { val: num2, color: 'text-indigo-600', fact: f2, label: '2ος Αριθμός', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  ];

  if (numCount === 3) {
    numbersList.push({ val: num3, color: 'text-purple-600', fact: f3, label: '3ος Αριθμός', badge: 'bg-purple-100 text-purple-800 border-purple-200' });
  }

  const currentNumbersString = activeNumbers.join(", ");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔬 Ε.Κ.Π. με Πρώτους Παράγοντες - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/20-ekp-protoi-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 20
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  20. Ε.Κ.Π. με Ανάλυση σε Γινόμενο Πρώτων Παραγόντων
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Υπολόγισε ταχύτατα το Ελάχιστο Κοινό Πολλαπλάσιο μεγάλων αριθμών εφαρμόζοντας τον χρυσό κανόνα: <strong>Κοινοί και μη κοινοί πρώτοι παράγοντες με τον μεγαλύτερο εκθέτη</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
                <Link
                  href="/st-dimotikou/20-ekp-protoi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ΚΑΡΤΑ 1: ΔΙΑΧΩΡΙΣΜΕΝΕΣ ΙΣΟΤΗΤΕΣ ΣΕ BADGES */}
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Βήμα 1: Παραγοντοποίηση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Αναλύουμε κάθε αριθμό χωριστά σε <strong>γινόμενο πρώτων παραγόντων</strong> και γράφουμε τις επαναλήψεις με <strong>εκθέτες (δυνάμεις)</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex flex-wrap items-center justify-center gap-2">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                  12 ＝ <strong className="text-blue-700 font-black">2² × 3</strong>
                </span>
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                  18 ＝ <strong className="text-blue-700 font-black">2 × 3²</strong>
                </span>
              </div>
            </div>

            {/* ΚΑΡΤΑ 2: ΔΙΑΧΩΡΙΣΜΕΝΕΣ ΕΠΙΛΟΓΕΣ ΣΕ BADGES */}
            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Βήμα 2: Ο Χρυσός Κανόνας</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Επιλέγουμε όλους τους <strong>κοινούς ΚΑΙ μη κοινούς</strong> πρώτους παράγοντες, παίρνοντας για τον καθένα τον <strong>μεγαλύτερο εκθέτη</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center flex flex-wrap items-center justify-center gap-2 font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  Από 2: <strong className="text-indigo-700 font-black">2²</strong>
                </span>
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  Από 3: <strong className="text-indigo-700 font-black">3²</strong>
                </span>
              </div>
            </div>

            {/* ΚΑΡΤΑ 3: ΥΠΟΛΟΓΙΣΜΟΣ */}
            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Βήμα 3: Υπολογισμός Ε.Κ.Π.</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Πολλαπλασιάζουμε τις δυνάμεις που επιλέξαμε για να βρούμε το τελικό αποτέλεσμα.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900 inline-block">
                  Ε.Κ.Π. ＝ 2² × 3² ＝ 4 × 9 ＝ <strong className="text-emerald-700 font-black">36</strong>
                </span>
              </div>
            </div>

          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Ε.Κ.Π. με Πρώτους Παράγοντες
                </h2>
                <p className="text-gray-500 text-sm">
                  Διάλεξε 2 ή 3 αριθμούς και παρακολούθησε βήμα προς βήμα την κατακόρυφη ανάλυση και την επιλογή των μέγιστων εκθετών!
                </p>
              </div>

              {/* NUMBER COUNT TOGGLE */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setNumCount(2)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    numCount === 2
                      ? 'bg-blue-600 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2 Αριθμοί
                </button>
                <button
                  type="button"
                  onClick={() => setNumCount(3)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    numCount === 3
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3 Αριθμοί
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: INPUTS & PRESETS (3 COLS) */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Τιμες Αριθμων (2 - {MAX_ALLOWED_NUMBER}):
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          1ος Αριθμος:
                        </label>
                        <input
                          type="text"
                          value={num1}
                          onChange={(e) => handleInputChange(setNum1, e.target.value)}
                          className="w-full text-lg font-mono font-black text-center p-2 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                          placeholder="π.χ. 12"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          2ος Αριθμος:
                        </label>
                        <input
                          type="text"
                          value={num2}
                          onChange={(e) => handleInputChange(setNum2, e.target.value)}
                          className="w-full text-lg font-mono font-black text-center p-2 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                          placeholder="π.χ. 18"
                        />
                      </div>

                      {numCount === 3 && (
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            3ος Αριθμος:
                          </label>
                          <input
                            type="text"
                            value={num3}
                            onChange={(e) => handleInputChange(setNum3, e.target.value)}
                            className="w-full text-lg font-mono font-black text-center p-2 bg-white border-2 border-purple-200 rounded-xl shadow-xs text-purple-600 outline-none focus:border-purple-500 tracking-wider"
                            placeholder="π.χ. 15"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PRESET EXAMPLES (2 COLS x 2 ROWS) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Ετοιμα Παραδειγματα:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {numCount === 2 ? PRESETS_2.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNum1(p.n1);
                            setNum2(p.n2);
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          ({p.n1}, {p.n2})
                        </button>
                      )) : PRESETS_3.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNum1(p.n1);
                            setNum2(p.n2);
                            setNum3(p.n3);
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          ({p.n1}, {p.n2}, {p.n3})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 Επιλέγουμε <strong>όλους</strong> τους πρώτους παράγοντες που εμφανίζονται, κρατώντας τον <strong>μεγαλύτερο εκθέτη</strong>!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION (9 COLS) */}
              <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* HEADER STATUS */}
                <div className="w-full text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Υπολογισμος Ε.Κ.Π. με Πρωτους Παραγοντες:
                  </span>
                  <div className="text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                    Ε.Κ.Π.({currentNumbersString}) ＝ <span className="text-amber-500">{ekp.toLocaleString('el-GR')}</span>
                  </div>
                </div>

                {/* 1. ΚΑΤΑΚΟΡΥΦΕΣ ΑΝΑΛΥΣΕΙΣ ΣΕ ΣΤΗΛΕΣ */}
                <div className="w-full space-y-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                    📋 1. Κατακορυφη Παραγοντοποιηση καθε Αριθμου:
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-inner">
                    {numbersList.map((numObj, index) => (
                      <div key={index} className="flex flex-col items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${numObj.badge}`}>
                          {numObj.label} ({numObj.val})
                        </span>

                        {/* ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΔΙΑΙΡΕΣΗΣ */}
                        <div className="font-mono text-sm sm:text-base w-full max-w-[120px] my-auto">
                          {numObj.fact.steps.map((step, sIdx) => (
                            <div key={sIdx} className="grid grid-cols-2 text-right border-b border-slate-100 last:border-0 py-0.5">
                              <span className="pr-2 font-black text-slate-800">
                                {step.current}
                              </span>
                              <span className="pl-2 font-black text-rose-600 border-l-2 border-slate-300 text-left">
                                {step.divisor || '—'}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* ΜΟΡΦΗ ΔΥΝΑΜΕΩΝ */}
                        <div className="text-center pt-2 border-t border-slate-100 w-full">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Μορφη Δυναμεων:</span>
                          <span className="font-mono font-black text-sm text-slate-800">
                            {numObj.val} ＝ <span className="text-blue-600">{numObj.fact.expr}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. ΕΠΕΞΗΓΗΣΗ ΕΠΙΛΟΓΗΣ ΜΕΓΙΣΤΩΝ ΕΚΘΕΤΩΝ */}
                <div className="w-full bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                    🔍 2. Εφαρμογη Κανονα (Κοινοι και Μη Κοινοι με Μεγιστο Εκθετη):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {ruleBreakdown.map((item, idx) => (
                      <div key={idx} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-1 text-center font-mono">
                        <span className="text-xs text-slate-300 block">
                          Για τη βάση <strong className="text-cyan-400 font-black">{item.base}</strong>:
                        </span>
                        <div className="text-sm font-black text-amber-300">
                          Επιλέγουμε ➔ {item.expStr}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          ({item.appearances})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ / ΓΙΝΟΜΕΝΟ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-5 rounded-2xl text-center shadow-lg font-mono space-y-1.5">
                  <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                    Τελικος Υπολογισμος Ε.Κ.Π.:
                  </span>
                  <div className="text-lg md:text-xl font-black tracking-wide">
                    Ε.Κ.Π.({currentNumbersString}) ＝{' '}
                    <span className="text-amber-300">{calculationFormulaParts.join(' × ')}</span>
                    {' ＝ '}
                    <span className="text-amber-400 text-xl md:text-2xl font-black bg-white/10 px-3 py-1 rounded-xl shadow-xs inline-block">
                      {ekp.toLocaleString('el-GR')}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να βρίσκεις το Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/20-ekp-protoi-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
