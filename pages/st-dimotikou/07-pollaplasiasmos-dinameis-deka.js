// pages/st-dimotikou/07-pollaplasiasmos-dinameis-deka.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function DinameisDekaPage() {
  const [activeTab, setActiveTab] = useState('megaloi'); // 'megaloi' (10, 100, 1000) ή 'mikroi' (0,1, 0,01, 0,001)
  const [inputNum, setInputNum] = useState('34,56');
  const [multiplier, setMultiplier] = useState(10); // 10, 100, 1000 ή 0.1, 0.01, 0.001

  const presets = [
    { label: '💶 34,56 € (Τιμή)', val: '34,56' },
    { label: '📏 2,4 μ. (Μήκος)', val: '2,4' },
    { label: '⚖️ 0,75 κιλά (Βάρος)', val: '0,75' },
    { label: '🔢 125 (Φυσικός)', val: '125' }
  ];

  const sanitizeInput = (val) => {
    let formatted = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(',');
    let intPart = (parts[0] || '').slice(0, 4);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 3);
      return `${intPart},${decPart}`;
    }
    return intPart;
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const valNum = parseVal(inputNum);
  const rawResult = valNum * multiplier;

  // Μορφοποίηση αποτελέσματος χωρίς floating point ατέλειες
  const formatResult = () => {
    if (valNum === 0) return '0';
    if (activeTab === 'megaloi') {
      const decimals = Math.max(0, (inputNum.split(',')[1] || '').length - (multiplier === 10 ? 1 : multiplier === 100 ? 2 : 3));
      return rawResult.toFixed(decimals).replace('.', ',');
    } else {
      const addedDec = multiplier === 0.1 ? 1 : multiplier === 0.01 ? 2 : 3;
      const currentDec = (inputNum.split(',')[1] || '').length;
      return rawResult.toFixed(currentDec + addedDec).replace('.', ',');
    }
  };

  const formattedResult = formatResult();

  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      if (multiplier === 10) return { steps: 1, direction: 'δεξιά', zeros: '1 μηδενικό' };
      if (multiplier === 100) return { steps: 2, direction: 'δεξιά', zeros: '2 μηδενικά' };
      return { steps: 3, direction: 'δεξιά', zeros: '3 μηδενικά' };
    } else {
      if (multiplier === 0.1) return { steps: 1, direction: 'αριστερά', zeros: '1 δεκαδικό' };
      if (multiplier === 0.01) return { steps: 2, direction: 'αριστερά', zeros: '2 δεκαδικά' };
      return { steps: 3, direction: 'αριστερά', zeros: '3 δεκαδικά' };
    }
  };

  const shift = getShiftInfo();

  return (
    <Layout
      title="Πολλαπλασιασμός με Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς πολλαπλασιάζουμε φυσικούς και δεκαδικούς με 10, 100, 1000 και 0,1, 0,01, 0,001 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 7 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πολλαπλασιασμός με 10, 100, 1.000 ... και 0,1, 0,01, 0,001 ...
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τον «χρυσό κανόνα» μετατόπισης της <strong>υποδιαστολής</strong>! Υπολόγισε γινόμενα στο δευτερόλεπτο χωρίς κάθετη πράξη, απλά μετακινώντας την υποδιαστολή δεξιά ή αριστερά.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κανόνες Μετατόπισης Υποδιαστολής &amp; Διαδραστικός Υπολογιστής</span>
            </div>
            <Link
              href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Κανόνες Νοερών Πολλαπλασιασμών σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς αλλάζει η θέση της υποδιαστολής ανάλογα με τη δύναμη του 10.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μεγαλώνει</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Με 10, 100, 1.000...
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μεγαλώνει</strong>. Μετακινούμε την υποδιαστολή <strong>δεξιά</strong> τόσες θέσεις όσα είναι τα μηδενικά (1, 2, 3). Αν λείπουν ψηφία, συμπληρώνουμε μηδενικά στο τέλος.
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>3,45 · 10 ＝ <strong className="text-blue-700">34,5</strong></p>
                  <p>3,45 · 1.000 ＝ <strong className="text-blue-700">3.450</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε μηδενικό μετακινεί την υποδιαστολή μία θέση προς τα δεξιά.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μικραίνει</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Με 0,1, 0,01, 0,001...
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μικραίνει</strong> (λειτουργεί όπως η διαίρεση). Μετακινούμε την υποδιαστολή <strong>αριστερά</strong> τόσες θέσεις όσα τα δεκαδικά ψηφία (1, 2, 3).
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>48 · 0,1 ＝ <strong className="text-indigo-700">4,8</strong></p>
                  <p>48 · 0,01 ＝ <strong className="text-indigo-700">0,48</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Ο πολλαπλασιασμός με 0,1 ισοδυναμεί με διαίρεση διά 10, με 0,01 διά 100 κ.ο.κ.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Συμπλήρωση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συμπλήρωση Μηδενικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν τελειώνουν τα διαθέσιμα ψηφία κατά τη μετακίνηση, βάζουμε <strong>μηδενικά (0)</strong> για να κρατήσουν τις απαραίτητες θέσεις.
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>5 · 0,01 ＝ 0,05 • 0,2 · 100 ＝ 20</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Τα μηδενικά εξασφαλίζουν ότι κάθε ψηφίο καταλήγει στη σωστή τάξη αξίας.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕΤΑΤΟΠΙΣΗΣ ΥΠΟΔΙΑΣΤΟΛΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Μετατόπισης Υποδιαστολής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε έναν αριθμό, διάλεξε δύναμη του 10 και παρατήρησε το βήμα της υποδιαστολής!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('megaloi');
                  setMultiplier(10);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚀 · 10, 100, 1.000 (Δεξιά)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mikroi');
                  setMultiplier(0.1);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'mikroi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📉 · 0,1, 0,01, 0,001 (Αριστερά)
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: CONTROLS & COMPUTATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* CONTROLS (7 COLS) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="space-y-2">
                  <label className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό (π.χ. 34,56):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputNum}
                    onChange={(e) => setInputNum(sanitizeInput(e.target.value))}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none w-full text-blue-600 font-mono"
                    placeholder="π.χ. 34,56"
                  />
                </div>

                {/* PRESETS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputNum(p.val)}
                      className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* MULTIPLIER BUTTONS */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Επίλεξε Πολλαπλασιαστή:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTab === 'megaloi' ? (
                      [10, 100, 1000].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMultiplier(m)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 ${
                            multiplier === m
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          · {m.toLocaleString('el-GR')}
                        </button>
                      ))
                    ) : (
                      [0.1, 0.01, 0.001].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMultiplier(m)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 ${
                            multiplier === m
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          · {formatNum(m)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* DYNAMIC RESULT CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  ✨ Τελικό Γινόμενο:
                </span>

                <div className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-black font-mono">
                  <span className="text-white">{inputNum || '0'}</span>
                  <span className="text-amber-400 font-sans">·</span>
                  <span className="text-cyan-300">{formatNum(multiplier)}</span>
                  <span className="text-slate-400 font-sans">＝</span>
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-xl shadow-md">
                    {formattedResult}
                  </span>
                </div>

                <div className="bg-white/10 px-3.5 py-2 rounded-xl text-xs text-blue-100 border border-white/15">
                  📍 Μετακίνηση <strong>{shift.steps} {shift.steps === 1 ? 'θέση' : 'θέσεις'}</strong> προς τα <strong>{shift.direction}</strong>
                </div>
              </div>

            </div>

            {/* ROW 2: VISUAL GUIDE OF DECIMAL POINT SHIFTING - 100% FLUID ΧΩΡΙΣ SCROLL */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-between space-y-4 sm:space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                  🧭 Οπτικός Οδηγός Μετατόπισης Υποδιαστολής
                </span>
                <p className="text-xs sm:text-sm text-slate-500">
                  Παρατήρησε τα βέλη που δείχνουν το άλμα της υποδιαστολής ανάμεσα στα ψηφία!
                </p>
              </div>

              {/* VISUAL SHIFT BOX */}
              <div className="w-full max-w-xl bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center gap-3 sm:gap-6 font-mono text-xl sm:text-2xl md:text-3xl font-black flex-wrap">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-slate-400 mb-1">Αρχικός</span>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200">
                      {inputNum || '0'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-amber-600 mb-1">
                      {shift.steps} {shift.steps === 1 ? 'άλμα' : 'άλματα'} {shift.direction}
                    </span>
                    <span className="text-xl sm:text-2xl text-amber-500">
                      {shift.direction === 'δεξιά' ? '➔' : '⬅️'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-emerald-600 mb-1">Νέος Αριθμός</span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-300 shadow-sm">
                      {formattedResult}
                    </span>
                  </div>
                </div>

                {/* SVG Shift Diagram - Fluid Width */}
                <div className="w-full bg-slate-50 p-2 sm:p-4 rounded-xl border border-slate-200 flex justify-center overflow-hidden">
                  <svg viewBox="0 0 340 70" className="w-full max-w-[340px] aspect-[340/70] select-none shrink-0 overflow-visible">
                    <defs>
                      <marker
                        id="shift-arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                      </marker>
                    </defs>

                    {/* Base Axis Line */}
                    <line x1="20" y1="52" x2="320" y2="52" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                    
                    {/* Jump Points (Dots) */}
                    <circle cx="90" cy="52" r="4.5" fill="#f59e0b" />
                    <circle cx="250" cy="52" r="4.5" fill="#f59e0b" />

                    {/* Jump Arc with Auto-Aligned Arrowhead */}
                    <path
                      d={
                        shift.direction === 'δεξιά'
                          ? 'M 90 50 Q 170 10 244 48'
                          : 'M 250 50 Q 170 10 96 48'
                      }
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      markerEnd="url(#shift-arrow)"
                    />

                    {/* Label */}
                    <text x="170" y="20" fontSize="12" fontWeight="900" textAnchor="middle" fill="#d97706">
                      {shift.steps} · (θέση {shift.direction})
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3.5 sm:p-4 rounded-xl text-xs md:text-sm text-blue-900 font-medium text-center max-w-2xl w-full">
                💡 <strong>Τι συνέβη:</strong> Πολλαπλασιάζοντας με το <strong className="text-blue-700 font-mono">{formatNum(multiplier)}</strong>, η υποδιαστολή μετακινήθηκε <strong>{shift.steps} {shift.steps === 1 ? 'θέση' : 'θέσεις'} προς τα {shift.direction}</strong>.
                {activeTab === 'megaloi'
                  ? ' Αν τελειώσουν τα δεκαδικά ψηφία, συμπληρώνουμε μηδενικά στο τέλος!'
                  : ' Αν τελειώσουν τα ακέραια ψηφία, βάζουμε 0, στην αρχή!'}
              </div>
            </div>

            {/* ROW 3: STEP-BY-STEP SUMMARY */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  🧬 Συνοπτικός Κανόνας Νοερών Υπολογισμών
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Πλήρης Εμφάνιση
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-blue-800 uppercase tracking-wider block">1. Πολλαπλασιασμός με 10, 100, 1.000...</span>
                  <ul className="space-y-1">
                    <li>• · 10 ➔ 1 θέση δεξιά (<code className="font-bold font-mono">4,5 · 10 ＝ 45</code>)</li>
                    <li>• · 100 ➔ 2 θέσεις δεξιά (<code className="font-bold font-mono">4,5 · 100 ＝ 450</code>)</li>
                    <li>• · 1.000 ➔ 3 θέσεις δεξιά (<code className="font-bold font-mono">4,5 · 1.000 ＝ 4.500</code>)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block">2. Πολλαπλασιασμός με 0,1, 0,01, 0,001...</span>
                  <ul className="space-y-1">
                    <li>• · 0,1 ➔ 1 θέση αριστερά (<code className="font-bold font-mono">25 · 0,1 ＝ 2,5</code>)</li>
                    <li>• · 0,01 ➔ 2 θέσεις αριστερά (<code className="font-bold font-mono">25 · 0,01 ＝ 0,25</code>)</li>
                    <li>• · 0,001 ➔ 3 θέσεις αριστερά (<code className="font-bold font-mono">25 · 0,001 ＝ 0,025</code>)</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Δυνάμεις του 10!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες πώς μετακινείται η υποδιαστολή με τις δυνάμεις του 10; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
