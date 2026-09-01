import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
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
  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
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

    const countFits = valB > 0 ? Math.floor(valA / valB) : 0;
    const hasRemainder = valB > 0 && valA % valB > 0.0001;

    return (
      <div className="w-full bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-6 shadow-inner">
        <div className="text-center text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          💡 <strong>Τι σημαίνει η διαίρεση;</strong> Σημαίνει να μετρήσουμε <strong>πόσες φορές χωράει ο διαιρέτης (Κλάσμα 2)</strong> μέσα στον <strong>διαιρετέο (Κλάσμα 1)</strong>!
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          {/* Μπάρα 1: Διαιρετέος */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-blue-700 uppercase tracking-wider">
              <span>📏 Κλασμα 1 (Διαιρετεος)</span>
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
              <span>📐 Κλασμα 2 (Διαιρετης - Μοναδα Μετρησης)</span>
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
                Πως χωραει ο διαιρετης μεσα στον διαιρετεο:
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
            Ακριβες Πηλικο (Ποσες φορες χωραει):
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

  // Επεξηγηματικό παιδαγωγικό μήνυμα βήμα-βήμα (ΣΤΑΘΕΡΟΠΟΙΗΜΕΝΟ ΥΨΟΣ)
  const getStepByStepExplanation = () => {
    let typeHeader = activeDenA === activeDenB 
      ? `🔵 Ομωνυμα Κλασματα (Ιδιος Παρονομαστης: ${activeDenA})`
      : `🟣 Ετερωνυμα Κλασματα (${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3 flex flex-col justify-between h-full">
        <div className="space-y-2.5">
          <span className={`font-black uppercase block text-[11px] ${activeDenA === activeDenB ? 'text-blue-800' : 'text-indigo-800'}`}>
            {typeHeader}
          </span>
          <div className="text-slate-600 space-y-1 text-xs md:text-sm">
            <p>1. Κρατάμε το 1ο κλάσμα (διαιρετέο) όπως είναι: <strong className="text-blue-700">{activeNumA}/{activeDenA}</strong></p>
            <p>2. Αντιστρέφουμε τους όρους του 2ου κλάσματος (διαιρέτη):</p>
            <p className="font-mono text-orange-700 pl-2">
              ➡️ Το <strong>{mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}</strong> γίνεται <strong className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{inverseNum}/{inverseDen}</strong>
            </p>
            <p>3. Μετατρέπουμε τη διαίρεση σε πολλαπλασιασμό:</p>
          </div>
          
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
            {activeNumA}/{activeDenA} : {mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB} ＝ {activeNumA}/{activeDenA} × {inverseNum}/{inverseDen} ＝ <strong className="text-emerald-700">{resultNum}/{resultDen}</strong>
          </div>
        </div>

        {/* Δεσμευμένος χώρος για τη γραμμή απλοποίησης */}
        <div className="min-h-[28px] flex items-center pt-1 border-t border-slate-100">
          {isSimplified ? (
            <p className="text-emerald-700 text-xs font-bold">
              ✨ Απλοποιώντας με το {gcd}, το τελικό ανάγωγο κλάσμα γίνεται: <strong>{simplifiedNum}/{simplifiedDen}</strong>
            </p>
          ) : (
            <p className="text-slate-400 text-xs italic">
              Το κλάσμα είναι ήδη στην ανάγωγη μορφή του.
            </p>
          )}
        </div>
      </div>
    );
  };

  const actionButton = (
    <Link
      href="/st-dimotikou/30-diairesi-klasmaton-ask"
      className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
    >
      <span>🎯</span>
      <span>Ασκήσεις</span>
    </Link>
  );

  return (
    <Layout
      title="➗ 30. Διαίρεση Κλασμάτων και Διαίρεση με Ακέραιο - LearnMaths.gr"
      description="Μάθε πώς διαιρούμε κλάσμα με κλάσμα και κλάσμα με ακέραιο, αντιστρέφοντας το 2ο κλάσμα και κάνοντας πολλαπλασιασμό για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      showAds={true}
    >
      <div className="py-6 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 30
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                30. Διαίρεση Κλασμάτων και Διαίρεση με Ακέραιο
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε τον <strong>Χρυσό Κανόνα</strong> της διαίρεσης κλασμάτων: <strong>αντιστρέφουμε τους όρους του δεύτερου κλάσματος</strong> και εκτελούμε πολλαπλασιασμό!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
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

        {/* THEORY CARDS (3 COLS) */}
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
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Διαίρεσης Κλασμάτων
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
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
                <div className="bg-blue-50/50 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    🔵 Κλασμα 1 (Διαιρετεος)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="div-num-a"
                          name="divNumA"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numA}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="div-den-a"
                          name="divDenA"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={denA}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΔΙΑΙΡΕΤΗΣ) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-orange-50/50 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 Κλασμα 2 (Διαιρετης)
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <input
                            id="div-num-b"
                            name="divNumB"
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            value={numB}
                            onChange={(e) => handleNumBChange(e.target.value)}
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <input
                            id="div-den-b"
                            name="divDenB"
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            value={denB}
                            onChange={(e) => handleDenBChange(e.target.value)}
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/50 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      🔢 Ακεραιος Διαιρετης
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Τιμή</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="div-whole-b"
                          name="divWholeB"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numB}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Ετοιμα Παραδειγματα:
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

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ ΜΕ ΣΤΑΘΕΡΟΠΟΙΗΜΕΝΟ ΥΨΟΣ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs min-h-[220px]">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 <strong>Θυμήσου:</strong> Στη διαίρεση κλασμάτων <strong>αντιστρέφουμε πάντα το 2ο κλάσμα</strong> και κάνουμε πολλαπλασιασμό!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & DYNAMIC BARS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
                {activeNumB === 0 ? (
                  <div className="text-rose-600 font-bold font-mono text-base">⚠️ Αδύνατη Πράξη (Διαίρεση με το 0)</div>
                ) : (
                  <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-3xl select-none flex-wrap justify-center">
                    
                    {/* Κλάσμα Α */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο : */}
                    <div className="text-slate-400 font-light text-2xl">：</div>

                    {/* Κλάσμα Β */}
                    {mode === 'fraction-fraction' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-orange-600">{activeNumB}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-orange-600">{activeDenB}</span>
                      </div>
                    ) : (
                      <span className="text-orange-600 text-2xl sm:text-3xl md:text-4xl">{activeNumB}</span>
                    )}

                    {/* Βέλος μετατροπής */}
                    <div className="text-indigo-600 font-bold px-1">➔</div>

                    {/* Κλάσμα Α σταθερό */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο x */}
                    <div className="text-indigo-600 font-bold">×</div>

                    {/* Αντίστροφο Κλάσμα Β */}
                    <div className="flex flex-col items-center bg-orange-50 px-2 sm:px-2.5 py-1 rounded-xl border-2 border-dashed border-orange-300">
                      <span className="text-orange-700 font-bold">{inverseNum}</span>
                      <div className="w-8 sm:w-10 h-0.5 bg-orange-800 my-1 rounded-full" />
                      <span className="text-orange-700 font-bold">{inverseDen}</span>
                    </div>

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Αποτέλεσμα */}
                    <div className="flex flex-col items-center bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200">
                      <span className="text-emerald-700">{resultNum}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-emerald-700">{resultDen}</span>
                    </div>

                    {/* Ανάγωγο Αποτέλεσμα */}
                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">＝</div>
                        <div className="flex flex-col items-center bg-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300">
                          <span className="text-emerald-800">{simplifiedNum}</span>
                          <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
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
                  📏 Γραφικη Αναπαρασταση Μεγεθων και Καταμετρηση Μεριδιων
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
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 Τελικό Αποτέλεσμα: ({activeNumA}/{activeDenA}) : ({mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}) ＝ {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`} (Όταν διαιρούμε με κλάσμα &lt; 1, το πηλίκο μεγαλώνει γιατί το μικρό κομμάτι χωράει πολλές φορές!)
              </div>

            </div>

          </div>
        </div>

        {/* 5. BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
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

      </div>
    </Layout>
  );
}
