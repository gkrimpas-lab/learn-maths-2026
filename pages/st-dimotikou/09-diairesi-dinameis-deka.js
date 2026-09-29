// pages/st-dimotikou/09-diairesi-dinameis-deka.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function DiairesiDinameisDekaPage() {
  const [activeTab, setActiveTab] = useState('megaloi'); // 'megaloi' (10, 100, 1000) ή 'mikroi' (0,1, 0,01, 0,001)
  const [inputNum, setInputNum] = useState('543,2');
  const [divisor, setDivisor] = useState(10); // 10, 100, 1000 ή 0.1, 0.01, 0.001

  const presets = [
    { label: '📏 543,2 μ. (Μήκος)', val: '543,2' },
    { label: '💶 125,5 € (Ποσό)', val: '125,5' },
    { label: '⚖️ 48,6 κιλά (Βάρος)', val: '48,6' },
    { label: '🔢 7 (Μονάδα)', val: '7' }
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
  const rawResult = divisor > 0 ? valNum / divisor : 0;

  // Μορφοποίηση αποτελέσματος χωρίς floating point ατέλειες
  const formatResult = () => {
    if (valNum === 0) return '0';
    if (activeTab === 'megaloi') {
      const currentDec = (inputNum.split(',')[1] || '').length;
      const addedDec = divisor === 10 ? 1 : divisor === 100 ? 2 : 3;
      return rawResult.toFixed(currentDec + addedDec).replace('.', ',');
    } else {
      const removedDec = divisor === 0.1 ? 1 : divisor === 0.01 ? 2 : 3;
      const currentDec = (inputNum.split(',')[1] || '').length;
      const remainingDec = Math.max(0, currentDec - removedDec);
      return rawResult.toFixed(remainingDec).replace('.', ',');
    }
  };

  const formattedResult = formatResult();

  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      if (divisor === 10) return { steps: 1, direction: 'αριστερά', effect: 'μικραίνει' };
      if (divisor === 100) return { steps: 2, direction: 'αριστερά', effect: 'μικραίνει' };
      return { steps: 3, direction: 'αριστερά', effect: 'μικραίνει' };
    } else {
      if (divisor === 0.1) return { steps: 1, direction: 'δεξιά', effect: 'μεγαλώνει' };
      if (divisor === 0.01) return { steps: 2, direction: 'δεξιά', effect: 'μεγαλώνει' };
      return { steps: 3, direction: 'δεξιά', effect: 'μεγαλώνει' };
    }
  };

  const shift = getShiftInfo();

  return (
    <Layout
      title="Διαίρεση με 10, 100, 1000 ... και 0,1, 0,01, 0,001 ... - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς διαιρούμε φυσικούς και δεκαδικούς με 10, 100, 1000 και 0,1, 0,01, 0,001 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 9 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Διαίρεση με 10, 100, 1.000 ... και 0,1, 0,01, 0,001 ...
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς να υπολογίζεις πηλίκα στο μυαλό χωρίς κάθετη πράξη, μετακινώντας την <strong>υποδιαστολή</strong> αριστερά ή δεξιά ανάλογα με τη δύναμη του 10!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κανόνες Μετατόπισης Υποδιαστολής &amp; Διαδραστικός Υπολογιστής</span>
            </div>
            <Link
              href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
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
              Κανόνες Νοερών Διαιρέσεων σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς μετακινείται η υποδιαστολή ανάλογα με τον τύπο του διαιρέτη.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μικραίνει</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Με 10, 100, 1.000 ...
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μικραίνει</strong>. Μετακινούμε την υποδιαστολή <strong>αριστερά</strong> τόσες θέσεις όσα είναι τα μηδενικά (1, 2, 3). Αν τελειώσουν τα ψηφία, βάζουμε «0,» στην αρχή.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>432,5 : 10 ＝ <strong className="text-blue-700">43,25</strong></p>
                  <p>432,5 : 100 ＝ <strong className="text-blue-700">4,325</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε μηδενικό στον διαιρέτη μετακινεί την υποδιαστολή μία θέση αριστερά.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μεγαλώνει</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Με 0,1, 0,01, 0,001 ...
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μεγαλώνει!</strong> (λειτουργεί όπως ο πολλαπλασιασμός). Μετακινούμε την υποδιαστολή <strong>δεξιά</strong> τόσες θέσεις όσα τα δεκαδικά ψηφία (1, 2, 3).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>4,325 : 0,1 ＝ <strong className="text-indigo-700">43,25</strong></p>
                  <p>4,325 : 0,01 ＝ <strong className="text-indigo-700">432,5</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Η διαίρεση με δεκαδικό μικρότερο του 1 δίνει πάντα πηλίκο μεγαλύτερο από τον διαιρετέο!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ισοδυναμία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ισοδυναμία Πράξεων
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1">
                  <p>• Διαίρεση με 10 ＝ Πολλαπλασιασμός με 0,1</p>
                  <p>• Διαίρεση με 0,1 ＝ Πολλαπλασιασμός με 10</p>
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>50 : 10 ＝ 50 · 0,1 ＝ 5</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Γνωρίζοντας τις ισοδυναμίες, μετατρέπουμε δύσκολες διαιρέσεις σε απλούς πολλαπλασιασμούς.
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
                Πληκτρολόγησε έναν αριθμό, διάλεξε διαιρέτη και παρατήρησε το άλμα της υποδιαστολής!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('megaloi');
                  setDivisor(10);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📉 : 10, 100, 1.000 (Αριστερά)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mikroi');
                  setDivisor(0.1);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'mikroi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚀 : 0,1, 0,01, 0,001 (Δεξιά)
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
                    Πληκτρολόγησε Αριθμό (Διαιρετέο):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputNum}
                    onChange={(e) => setInputNum(sanitizeInput(e.target.value))}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none w-full text-blue-600 font-mono"
                    placeholder="π.χ. 543,2"
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

                {/* DIVISOR BUTTONS */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Επίλεξε Διαιρέτη:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTab === 'megaloi' ? (
                      [10, 100, 1000].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDivisor(d)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 ${
                            divisor === d
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          : {d.toLocaleString('el-GR')}
                        </button>
                      ))
                    ) : (
                      [0.1, 0.01, 0.001].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDivisor(d)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 ${
                            divisor === d
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          : {formatNum(d)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* DYNAMIC RESULT CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  ✨ Τελικό Πηλίκο:
                </span>

                <div className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-black font-mono">
                  <span className="text-white">{inputNum || '0'}</span>
                  <span className="text-amber-400 font-sans">:</span>
                  <span className="text-cyan-300">{formatNum(divisor)}</span>
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
                      {shift.direction === 'αριστερά' ? '⬅️' : '➔'}
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
                        id="diairesi-shift-arrow"
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

                    {/* Jump Arc */}
                    <path
                      d={
                        shift.direction === 'αριστερά'
                          ? 'M 250 50 Q 170 10 96 48'
                          : 'M 90 50 Q 170 10 244 48'
                      }
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      markerEnd="url(#diairesi-shift-arrow)"
                    />

                    {/* Label */}
                    <text x="170" y="20" fontSize="12" fontWeight="900" textAnchor="middle" fill="#d97706">
                      {shift.steps} · (θέση {shift.direction})
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3.5 sm:p-4 rounded-xl text-xs md:text-sm text-blue-900 font-medium text-center max-w-2xl w-full">
                💡 <strong>Τι συνέβη:</strong> Διαιρώντας με το <strong className="text-blue-700 font-mono">{formatNum(divisor)}</strong>, ο αριθμός <strong>{shift.effect}</strong>. Η υποδιαστολή μετακινήθηκε <strong>{shift.steps} {shift.steps === 1 ? 'θέση' : 'θέσεις'} προς τα {shift.direction}</strong>.
                {activeTab === 'megaloi'
                  ? ' Αν τελειώσουν τα ακέραια ψηφία, βάζουμε 0, στην αρχή!'
                  : ' Αν τελειώσουν τα δεκαδικά ψηφία, συμπληρώνουμε μηδενικά στο τέλος!'}
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
                  <span className="font-black text-blue-800 uppercase tracking-wider block">1. Διαίρεση με 10, 100, 1.000 ...</span>
                  <ul className="space-y-1">
                    <li>• : 10 ➔ 1 θέση αριστερά (<code className="font-bold font-mono">45 : 10 ＝ 4,5</code>)</li>
                    <li>• : 100 ➔ 2 θέσεις αριστερά (<code className="font-bold font-mono">45 : 100 ＝ 0,45</code>)</li>
                    <li>• : 1.000 ➔ 3 θέσεις αριστερά (<code className="font-bold font-mono">45 : 1.000 ＝ 0,045</code>)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block">2. Διαίρεση με 0,1, 0,01, 0,001 ...</span>
                  <ul className="space-y-1">
                    <li>• : 0,1 ➔ 1 θέση δεξιά (<code className="font-bold font-mono">2,5 : 0,1 ＝ 25</code>)</li>
                    <li>• : 0,01 ➔ 2 θέσεις δεξιά (<code className="font-bold font-mono">2,5 : 0,01 ＝ 250</code>)</li>
                    <li>• : 0,001 ➔ 3 θέσεις δεξιά (<code className="font-bold font-mono">2,5 : 0,001 ＝ 2.500</code>)</li>
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
              Ώρα για Εξάσκηση στη Διαίρεση με Δυνάμεις του 10!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες πώς μετακινείται η υποδιαστολή στη διαίρεση με δυνάμεις του 10; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
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
