import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Προκαθορισμένα υποδειγματικά παραδείγματα με βήματα
const PRESET_EXAMPLES = [
  {
    id: 1,
    title: 'ΠΑΡΑΔΕΙΓΜΑ 1: ΔΥΝΑΜΗ, ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΠΡΟΣΘΕΣΗ',
    expression: '5 ＋ 3 · (－2)<sup>2</sup> － 4 · (＋3)',
    steps: [
      {
        action: '1. Υπολογίζουμε πρώτα τη δύναμη: (－2)² ＝ ＋4',
        result: '5 ＋ 3 · 4 － 4 · 3',
        highlight: '(－2)²',
      },
      {
        action: '2. Εκτελούμε τους πολλαπλασιασμούς από αριστερά προς τα δεξιά: 3 · 4 ＝ 12 και 4 · 3 ＝ 12',
        result: '5 ＋ 12 － 12',
        highlight: '3 · 4 και 4 · 3',
      },
      {
        action: '3. Εκτελούμε προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά: 5 ＋ 12 ＝ 17 και 17 － 12 ＝ 5',
        result: '5',
        highlight: '5 ＋ 12 － 12',
      },
    ],
  },
  {
    id: 2,
    title: 'ΠΑΡΑΔΕΙΓΜΑ 2: ΠΑΡΕΝΘΕΣΕΙΣ & ΑΓΚΥΛΕΣ',
    expression: '2 · [ 15 － (4 ＋ 3 · 2) ] ＋ (－5)',
    steps: [
      {
        action: '1. Μέσα στην εσωτερική παρένθεση προηγείται ο πολλαπλασιασμός: 3 · 2 ＝ 6',
        result: '2 · [ 15 － (4 ＋ 6) ] ＋ (－5)',
        highlight: '3 · 2',
      },
      {
        action: '2. Ολοκληρώνουμε την εσωτερική παρένθεση: 4 ＋ 6 ＝ 10',
        result: '2 · [ 15 － 10 ] ＋ (－5)',
        highlight: '4 ＋ 6',
      },
      {
        action: '3. Εκτελούμε την πράξη μέσα στην αγκύλη: 15 － 10 ＝ 5',
        result: '2 · 5 ＋ (－5)',
        highlight: '15 － 10',
      },
      {
        action: '4. Εκτελούμε τον πολλαπλασιασμό: 2 · 5 ＝ 10',
        result: '10 ＋ (－5)',
        highlight: '2 · 5',
      },
      {
        action: '5. Τελική πρόσθεση ετερόσημων: 10 ＋ (－5) ＝ ＋5',
        result: '5',
        highlight: '10 ＋ (－5)',
      },
    ],
  },
  {
    id: 3,
    title: 'ΠΑΡΑΔΕΙΓΜΑ 3: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΑΙ ΔΙΑΙΡΕΣΗ ΣΤΗ ΣΕΙΡΑ',
    expression: '24 ： 6 · 2 － (－3)<sup>3</sup>',
    steps: [
      {
        action: '1. Υπολογίζουμε τη δύναμη: (－3)³ ＝ －27',
        result: '24 ： 6 · 2 － (－27)',
        highlight: '(－3)³',
      },
      {
        action: '2. Στο 24 ： 6 · 2 η διαίρεση και ο πολλαπλασιασμός έχουν ίδια προτεραιότητα, άρα πάμε από αριστερά προς τα δεξιά: 24 ： 6 ＝ 4',
        result: '4 · 2 － (－27)',
        highlight: '24 ： 6',
      },
      {
        action: '3. Εκτελούμε τον πολλαπλασιασμό: 4 · 2 ＝ 8',
        result: '8 － (－27)',
        highlight: '4 · 2',
      },
      {
        action: '4. Μετατρέπουμε την αφαίρεση σε πρόσθεση του αντιθέτου: 8 ＋ 27 ＝ 35',
        result: '35',
        highlight: '8 ＋ 27',
      },
    ],
  },
];

export default function ProteraiotitaPrakseonTheoria() {
  // Επιλεγμένο προκαθορισμένο παράδειγμα
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Steppers για δυναμική παραμετροποίηση: a + b · c²
  const [dynA, setDynA] = useState(4);
  const [dynB, setDynB] = useState(3);
  const [dynC, setDynC] = useState(-2);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί δυναμικής παράστασης: a + b · c²
  const dynPower = useMemo(() => Math.pow(dynC, 2), [dynC]);
  const dynMult = useMemo(() => dynB * dynPower, [dynB, dynPower]);
  const dynTotal = useMemo(() => dynA + dynMult, [dynA, dynMult]);

  const activeExample = PRESET_EXAMPLES[selectedPreset];

  return (
    <Layout
      title="Προτεραιότητα των Πράξεων | Α' Γυμνασίου"
      description="Θεωρία, ιεραρχία πράξεων, παρενθέσεις, δυνάμεις και διαδραστική επίλυση σύνθετων αριθμητικών παραστάσεων βήμα-βήμα."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/10-proteraiotita-prakseon-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προτεραιότητα των Πράξεων
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τη σωστή σειρά με την οποία εκτελούνται οι πράξεις σε μια αριθμητική παράσταση: από τις παρενθέσεις και τις δυνάμεις μέχρι τους πολλαπλασιασμούς και τις προσθέσεις.
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΩΝ ΠΡΑΞΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Οι Κανόνες Προτεραιότητας
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΒΗΜΑ 1</span>
                <span className="text-lg">🧩</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Παρενθέσεις</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Εκτελούμε πρώτα τις πράξεις μέσα στις <strong>παρενθέσεις ( )</strong>, μετά στις <strong>αγκύλες [ ]</strong> και τέλος στα <strong>άγκιστρα {'{ }'}</strong> (από μέσα προς τα έξω).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΒΗΜΑ 2</span>
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Δυνάμεις</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Υπολογίζουμε όλες τις <strong>δυνάμεις (α<sup>ν</sup>)</strong> πριν από οποιονδήποτε πολλαπλασιασμό ή διαίρεση.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-purple-700 tracking-wider">ΒΗΜΑ 3</span>
                <span className="text-lg">✖️</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Πολλαπλασιασμοί & Διαιρέσεις</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Εκτελούνται με τη σειρά που εμφανίζονται, <strong>από αριστερά προς τα δεξιά</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-emerald-700 tracking-wider">ΒΗΜΑ 4</span>
                <span className="text-lg">➕</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Προσθέσεις & Αφαιρέσεις</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Εκτελούνται τελευταίες, επίσης με τη σειρά που εμφανίζονται <strong>από αριστερά προς τα δεξιά</strong>.
              </p>
            </div>
          </div>

          {/* Συνήθη Λάθη & Παγίδες */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="text-xs font-bold uppercase text-amber-800 tracking-wider">
              ΠΡΟΣΟΧΗ ΣΤΙΣ ΣΥΝΗΘΕΙΣ ΠΑΓΙΔΕΣ
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-rose-700">❌ ΛΑΘΟΣ: 2 ＋ 3 · 4 ＝ 5 · 4 ＝ 20</div>
                <div className="font-bold text-emerald-700">✅ ΣΩΣΤΟ: 2 ＋ 3 · 4 ＝ 2 ＋ 12 ＝ 14</div>
                <p className="text-slate-600 mt-1">
                  Ο πολλαπλασιασμός προηγείται πάντοτε της πρόσθεσης!
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-rose-700">❌ ΛΑΘΟΣ: 12 ： 3 · 2 ＝ 12 ： 6 ＝ 2</div>
                <div className="font-bold text-emerald-700">✅ ΣΩΣΤΟ: 12 ： 3 · 2 ＝ 4 · 2 ＝ 8</div>
                <p className="text-slate-600 mt-1">
                  Διαίρεση και πολλαπλασιασμός έχουν την ίδια προτεραιότητα. Εκτελούνται αυστηρά από αριστερά προς τα δεξιά!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΑΛΥΣΗ ΒΗΜΑ-ΒΗΜΑ ΣΕ ΠΡΟΚΑΘΟΡΙΣΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Βήμα-Βήμα Επίλυση Παράστασης
            </h2>
          </div>

          {/* Επιλογή Παραδείγματος */}
          <div className="flex flex-wrap gap-2">
            {PRESET_EXAMPLES.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  setSelectedPreset(idx);
                  setCurrentStep(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  selectedPreset === idx
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ΠΑΡΑΔΕΙΓΜΑ {idx + 1}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-6">
            {/* Αρχική Παράσταση */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                ΑΡΧΙΚΗ ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ
              </div>
              <div
                className="text-xl sm:text-3xl font-black font-mono text-amber-400"
                dangerouslySetInnerHTML={{ __html: activeExample.expression }}
              />
            </div>

            {/* Διαδραστικά Βήματα */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs uppercase text-slate-400 font-bold tracking-wider">
                ΣΤΑΔΙΑ ΕΚΤΕΛΕΣΗΣ (ΒΗΜΑ {currentStep + 1} ΑΠΟ {activeExample.steps.length})
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
                <div className="text-sm sm:text-base font-bold text-sky-300">
                  {activeExample.steps[currentStep].action}
                </div>
                <div className="text-base sm:text-xl font-mono text-emerald-400 font-black">
                  ＝ {activeExample.steps[currentStep].result}
                </div>
              </div>

              {/* Πλοήγηση βημάτων */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-bold transition"
                >
                  ⬅️ ΠΡΟΗΓΟΥΜΕΝΟ ΒΗΜΑ
                </button>

                <button
                  type="button"
                  disabled={currentStep === activeExample.steps.length - 1}
                  onClick={() => setCurrentStep((prev) => Math.min(activeExample.steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-bold transition"
                >
                  ΕΠΟΜΕΝΟ ΒΗΜΑ ➡️
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΔΥΝΑΜΙΚΗ ΠΑΡΑΣΤΑΣΗ ΜΕ STEPPERS */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικός Υπολογιστής: α ＋ β · γ²
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            Άλλαξε τις τιμές των α, β και γ και παρακολούθησε ζωντανά πώς προηγείται η δύναμη γ², μετά ο πολλαπλασιασμός β · γ² και τέλος η πρόσθεση α:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Steppers */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Αριθμός α
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynA, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono">
                    α ＝ {dynA > 0 ? `＋${dynA}` : dynA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynA, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Συντελεστής β
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynB, -1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono">
                    β ＝ {dynB > 0 ? `＋${dynB}` : dynB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynB, 1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Βάση δύναμης γ
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynC, -1, -4, 4, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-purple-900 font-black text-lg font-mono">
                    γ ＝ {dynC > 0 ? `＋${dynC}` : dynC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDynC, 1, -4, 4, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Ανάλυση Βημάτων */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="text-xs uppercase text-indigo-300 font-bold font-sans">
                ΣΕΙΡΑ ΕΚΤΕΛΕΣΗΣ ΠΡΑΞΕΩΝ
              </div>

              <div className="space-y-2 text-sm sm:text-base">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="text-slate-400 font-sans block text-xs">Αρχική Παράσταση:</span>
                  <span className="font-bold text-amber-300">
                    {dynA} ＋ ({dynB}) · ({dynC})<sup>2</sup>
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="text-slate-400 font-sans block text-xs">Βήμα 1 (Δύναμη ({dynC})² ＝ {dynPower}):</span>
                  <span>
                    ＝ {dynA} ＋ ({dynB}) · {dynPower}
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="text-slate-400 font-sans block text-xs">Βήμα 2 (Πολλαπλασιασμός {dynB} · {dynPower} ＝ {dynMult}):</span>
                  <span>
                    ＝ {dynA} ＋ ({dynMult})
                  </span>
                </div>

                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                  <span className="text-emerald-300 font-sans block text-xs">Βήμα 3 (Τελική Πρόσθεση):</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">
                    ＝ {dynTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
