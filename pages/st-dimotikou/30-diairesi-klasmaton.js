import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΚΕΝΤΡΙΚΗ ΜΕΤΑΒΛΗΤΗ ΡΥΘΜΙΣΗΣ ΜΕΓΙΣΤΩΝ ΤΙΜΩΝ
const MAX_LIMIT = 100;

const PRESETS_FF = [
  { nA: 3, dA: 4, nB: 1, dB: 4, label: "3/4 : 1/4 ➔ 3 (Χωράει 3 φορές)" },
  { nA: 1, dA: 2, nB: 1, dB: 6, label: "1/2 : 1/6 ➔ 3" },
  { nA: 2, dA: 3, nB: 3, dB: 4, label: "2/3 : 3/4 ➔ 8/9" },
  { nA: 4, dA: 5, nB: 2, dB: 5, label: "4/5 : 2/5 ➔ 2" }
];

const PRESETS_FN = [
  { nA: 3, dA: 4, nB: 2, label: "3/4 : 2 ➔ 3/8 (Μοιρασιά)" },
  { nA: 4, dA: 5, nB: 2, label: "4/5 : 2 ➔ 2/5" },
  { nA: 1, dA: 2, nB: 3, label: "1/2 : 3 ➔ 1/6" },
  { nA: 5, dA: 6, nB: 5, label: "5/6 : 5 ➔ 1/6" }
];

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
const findGCD = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

export default function DiairesiKlasmatonPage() {
  // Mode: 'fraction-fraction' (κλάσμα με κλάσμα) ή 'fraction-number' (κλάσμα με ακέραιο)
  const [mode, setMode] = useState('fraction-fraction');

  // Κατάσταση για Κλάσμα Α (Διαιρετέος)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κατάσταση για Κλάσμα Β (Διαιρέτης) - Ή Ακέραιο Β
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(4);

  // Έλεγχος εισαγωγής κειμένου
  const handleInputChange = (setter, val, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_LIMIT) return;
    if (isDenominator && n === 0) return;
    setter(n);
  };

  // Αυξομείωση με κουμπιά
  const adjustValue = (setter, currentVal, amount, isDenominator = false) => {
    const next = (Number(currentVal) || 0) + amount;
    const min = isDenominator ? 1 : 0;
    if (next >= min && next <= MAX_LIMIT) {
      setter(next);
    }
  };

  // Ενεργές τιμές για τους υπολογισμούς
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = mode === 'fraction-fraction' ? (denB === '' || denB === 0 ? 1 : Number(denB)) : 1;

  // Υπολογισμός Αντίστροφου Κλάσματος Διαιρέτη
  const inverseNum = activeDenB;
  const inverseDen = activeNumB;

  // Υπολογισμός Διαίρεσης
  const resultNum = activeNumA * inverseNum;
  const resultDen = activeDenA * inverseDen;

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  const decimalResult = activeNumB > 0 ? (activeNumA / activeDenA) / (activeNumB / activeDenB) : 0;

  // Αναβαθμισμένη Γραφική Απεικόνιση Μέτρησης & Μπαρών
  const renderBarVisual = () => {
    const valA = activeNumA / activeDenA;
    const valB = activeNumB / activeDenB;
    const maxVal = Math.max(valA, valB, 1);

    const widthA = maxVal > 0 ? (valA / maxVal) * 100 : 0;
    const widthB = maxVal > 0 ? (valB / maxVal) * 100 : 0;

    // Υπολογισμός πόσες φορές χωράει το Β μέσα στο Α (ακέραια τμήματα για τα visual markers)
    const countFits = valB > 0 ? Math.floor(valA / valB) : 0;
    const hasRemainder = valB > 0 && valA % valB > 0.0001;

    return (
      <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6 shadow-inner">
        <div className="text-center text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          💡 <strong>Τι σημαίνει η διαίρεση;</strong> Σημαίνει να μετρήσουμε <strong>πόσες φορές χωράει ο διαιρέτης (Κλάσμα 2)</strong> μέσα στον <strong>διαιρετέο (Κλάσμα 1)</strong>!
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          {/* Μπάρα 1: Διαιρετέος */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-blue-700 uppercase tracking-wider">
              <span>📏 1ο Κλάσμα (Διαιρετέος)</span>
              <span className="font-mono">{activeNumA}/{activeDenA} ≈ {Number(valA.toFixed(3))}</span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthA))}%` }}
              >
                <span>{activeNumA}/{activeDenA}</span>
                {widthA > 20 && <span className="text-[10px] opacity-80 font-normal">Μέγεθος προς διαίρεση</span>}
              </div>
            </div>
          </div>

          {/* Μπάρα 2: Διαιρέτης & Αναπαράσταση Μετρήσεων */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-orange-700 uppercase tracking-wider">
              <span>📐 2ο Κλάσμα (Διαιρέτης - Μονάδα Μέτρησης)</span>
              <span className="font-mono">
                {mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB} ≈ {Number(valB.toFixed(3))}
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthB))}%` }}
              >
                <span>{mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}</span>
                {widthB > 20 && <span className="text-[10px] opacity-80 font-normal">Μέγεθος μερίδας</span>}
              </div>
            </div>
          </div>

          {/* Οπτική Καταμέτρηση Μεριδίων (Visual Segments) */}
          {valB > 0 && valA >= valB && countFits <= 12 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider text-center">
                Πώς χωράει ο διαιρέτης μέσα στον διαιρετέο:
              </span>
              <div className="flex gap-1 justify-center flex-wrap">
                {Array.from({ length: countFits }).map((_, idx) => (
                  <div key={idx} className="bg-amber-100 border-2 border-amber-400 text-amber-900 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs">
                    {idx + 1}η φορά ({mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB})
                  </div>
                ))}
                {hasRemainder && (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-400 text-slate-600 font-mono font-bold text-xs px-2 py-1 rounded-xl">
                    + υπόλοιπο μέρος
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Αποτέλεσμα Σύγκρισης / Πηλίκο */}
        <div className="text-center font-mono text-slate-800 bg-white border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto shadow-sm space-y-1">
          <div className="text-slate-400 font-sans text-[11px] font-bold uppercase tracking-wider">
            Ακριβές Πηλίκο (Πόσες φορές χωράει):
          </div>
          <div className="text-emerald-600 text-xl md:text-2xl font-black">
            {Number.isInteger(decimalResult) ? decimalResult : Number(decimalResult.toFixed(4))} φορές!
          </div>
          <div className="text-slate-500 text-xs font-mono font-bold">
            (Κλασματικά: {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`})
          </div>
        </div>
      </div>
    );
  };

  // Επεξηγηματικό παιδαγωγικό μήνυμα βήμα-βήμα
  const getStepByStepExplanation = () => {
    let typeHeader = activeDenA === activeDenB 
      ? `🔵 Ομώνυμα Κλάσματα (Ίδιος Παρονομαστής: ${activeDenA})`
      : `🟣 Ετερώνυμα Κλάσματα (${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3">
        <span className={`font-black uppercase block text-[11px] ${activeDenA === activeDenB ? 'text-blue-800' : 'text-indigo-800'}`}>
          {typeHeader}
        </span>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          <p>1. Κρατάμε το 1ο κλάσμα (διαιρετέο) όπως είναι: <strong className="text-blue-700">{activeNumA}/{activeDenA}</strong></p>
          <p>2. Αντιστρέφουμε τους όρους του 2ου κλάσματος (διαιρέτη):</p>
          <p className="font-mono text-orange-700 pl-2">
            ➡️ Το <strong>{activeNumB}/{activeDenB}</strong> γίνεται <strong className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{inverseNum}/{inverseDen}</strong>
          </p>
          <p>3. Μετατρέπουμε τη διαίρεση σε πολλαπλασιασμό:</p>
        </div>
        
        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
          {activeNumA}/{activeDenA} : {activeNumB}/{activeDenB} ＝ {activeNumA}/{activeDenA} × {inverseNum}/{inverseDen} ＝ <strong className="text-emerald-700">{resultNum}/{resultDen}</strong>
        </div>

        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
            ✨ Απλοποιώντας με το {gcd}, το τελικό ανάγωγο κλάσμα γίνεται: <strong>{simplifiedNum}/{simplifiedDen}</strong>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Διαίρεση Κλασμάτων - LearnMaths.gr</title>
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
                href="/st-dimotikou/30-diairesi-klasmaton-ask"
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
                    Ενότητα 30
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  30. Διαίρεση Κλασμάτων & Διαίρεση με Ακέραιο
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε τον <strong>Χρυσό Κανόνα</strong> της διαίρεσης κλασμάτων: <strong>αντιστρέφουμε τους όρους του δεύτερου κλάσματος</strong> και εκτελούμε πολλαπλασιασμό!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις διαίρεσης κλασμάτων!</p>
                <Link
                  href="/st-dimotikou/30-diairesi-klasmaton-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">1. Ο Χρυσός Κανόνας</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Αφήνουμε το 1ο κλάσμα όπως είναι, <strong>αντιστρέφουμε το 2ο κλάσμα</strong> και κάνουμε <strong>πολλαπλασιασμό</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  (α/β) : (γ/δ) ＝ (α/β) × (δ/γ)
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2. Διαίρεση με Ακέραιο</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Γράφουμε τον ακέραιο ως κλάσμα με <strong>παρονομαστή το 1</strong> (γ ＝ γ/1), αντιστρέφουμε σε 1/γ και πολλαπλασιάζουμε.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  (α/β) : γ ＝ (α/β) × (1/γ)
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Σύνθετο Κλάσμα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στη μορφή σύνθετου κλάσματος: γινόμενο <strong>άκρων όρων</strong> στον αριθμητή, γινόμενο <strong>μέσων όρων</strong> στον παρονομαστή.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  (α/β) / (γ/δ) ＝ (α × δ) / (β × γ)
                </span>
              </div>
            </div>
          </div>

          {/* MODE SELECTOR TABS */}
          <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
            <button
              type="button"
              onClick={() => { setMode('fraction-fraction'); setNumA(3); setDenA(4); setNumB(1); setDenB(4); }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ➗ Κλάσμα με Κλάσμα
            </button>
            <button
              type="button"
              onClick={() => { setMode('fraction-number'); setNumA(3); setDenA(4); setNumB(2); }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                mode === 'fraction-number' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔢 Κλάσμα με Ακέραιο
            </button>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Διαίρεσης Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε τον διαιρετέο και τον διαιρέτη και δες την αντιστροφή, τη μαθηματική πράξη και την οπτική καταμέτρηση μερίδων!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΔΙΑΙΡΕΤΕΟΣ) */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 1ο Κλάσμα (Διαιρετέος)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setNumA, numA, -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numA}
                            onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValue(setNumA, numA, 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setDenA, denA, -1, true)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denA}
                            onChange={(e) => handleInputChange(setDenA, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValue(setDenA, denA, 1, true)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΔΙΑΙΡΕΤΗΣ) */}
                  {mode === 'fraction-fraction' ? (
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                      <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                        🟠 2ο Κλάσμα (Διαιρέτης)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                            <button type="button" onClick={() => adjustValue(setNumB, numB, -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                            <input
                              type="text"
                              value={numB}
                              onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                              className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                            />
                            <button type="button" onClick={() => adjustValue(setNumB, numB, 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                            <button type="button" onClick={() => adjustValue(setDenB, denB, -1, true)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                            <input
                              type="text"
                              value={denB}
                              onChange={(e) => handleInputChange(setDenB, e.target.value, true)}
                              className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                            />
                            <button type="button" onClick={() => adjustValue(setDenB, denB, 1, true)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200 space-y-3">
                      <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                        🔢 Ακέραιος Διαιρέτης
                      </span>
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Τιμή</span>
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                          <button type="button" onClick={() => adjustValue(setNumB, numB, -1)} className="px-2.5 py-1 font-black text-indigo-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numB}
                            onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-lg outline-none text-indigo-600"
                          />
                          <button type="button" onClick={() => adjustValue(setNumB, numB, 1)} className="px-2.5 py-1 font-black text-indigo-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Έτοιμα Παραδείγματα:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(mode === 'fraction-fraction' ? PRESETS_FF : PRESETS_FN).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (mode === 'fraction-fraction') {
                              setNumA(p.nA);
                              setDenA(p.dA);
                              setNumB(p.nB);
                              setDenB(p.dB);
                            } else {
                              setNumA(p.nA);
                              setDenA(p.dA);
                              setNumB(p.nB);
                            }
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                    {getStepByStepExplanation()}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Θυμήσου:</strong> Στη διαίρεση κλασμάτων <strong>αντιστρέφουμε πάντα το 2ο κλάσμα</strong> και κάνουμε πολλαπλασιασμό!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION & DYNAMIC BARS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  {activeNumB === 0 ? (
                    <div className="text-rose-600 font-bold font-mono text-base">⚠️ Αδύνατη Πράξη (Διαίρεση με το 0)</div>
                  ) : (
                    <div className="flex items-center gap-3 sm:gap-4 font-mono font-black text-xl md:text-3xl select-none flex-wrap justify-center">
                      
                      {/* Κλάσμα Α */}
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNumA}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDenA}</span>
                      </div>

                      {/* Σύμβολο : */}
                      <div className="text-slate-400 font-light text-2xl">：</div>

                      {/* Κλάσμα Β */}
                      <div className="flex flex-col items-center">
                        <span className="text-orange-600">{activeNumB}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-orange-600">{activeDenB}</span>
                      </div>

                      {/* Βέλος μετατροπής */}
                      <div className="text-indigo-600 font-bold px-1">➔</div>

                      {/* Κλάσμα Α σταθερό */}
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNumA}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDenA}</span>
                      </div>

                      {/* Σύμβολο x */}
                      <div className="text-indigo-600 font-bold">×</div>

                      {/* Αντίστροφο Κλάσμα Β */}
                      <div className="flex flex-col items-center bg-orange-50 px-2.5 py-1 rounded-xl border-2 border-dashed border-orange-300">
                        <span className="text-orange-700 font-bold">{inverseNum}</span>
                        <div className="w-10 h-0.5 bg-orange-800 my-1 rounded-full" />
                        <span className="text-orange-700 font-bold">{inverseDen}</span>
                      </div>

                      <div className="text-slate-500 font-bold">＝</div>

                      {/* Αποτέλεσμα */}
                      <div className="flex flex-col items-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <span className="text-emerald-700">{resultNum}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-700">{resultDen}</span>
                      </div>

                      {/* Ανάγωγο Αποτέλεσμα */}
                      {isSimplified && (
                        <>
                          <div className="text-emerald-600 font-bold">＝</div>
                          <div className="flex flex-col items-center bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                            <span className="text-emerald-800">{simplifiedNum}</span>
                            <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                            <span className="text-emerald-800">{simplifiedDen}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. ΑΝΑΒΑΘΜΙΣΜΕΝΗ ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΜΕ ΜΠΑΡΕΣ & ΜΕΤΡΗΣΕΙΣ */}
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                    📏 Γραφική Αναπαράσταση Μεγεθών & Καταμέτρηση Μεριδίων
                  </span>
                  {activeNumB > 0 ? (
                    renderBarVisual()
                  ) : (
                    <div className="text-center text-xs text-slate-400 italic py-6">
                      Επίλεξε έναν διαιρέτη μεγαλύτερο του 0 για να εμφανιστεί η οπτικοποίηση.
                    </div>
                  )}
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Τελικό Αποτέλεσμα: ({activeNumA}/{activeDenA}) : ({activeNumB}/{activeDenB}) ＝ {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`} (Όταν διαιρούμε με κλάσμα &lt; 1, το πηλίκο μεγαλώνει γιατί το μικρό κομμάτι χωράει πολλές φορές!)
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τον κανόνα της διαίρεσης κλασμάτων και ακεραίων; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/30-diairesi-klasmaton-ask"
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
