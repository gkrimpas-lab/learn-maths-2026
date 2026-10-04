// pages/st-dimotikou/35-gnostos-meion-agnostos.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστο όριο για τα sliders
const MAX_VAL = 50;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS = [
  { a: 10, b: 4, label: '10 － x ＝ 4 (x ＝ 6)' },
  { a: 20, b: 12, label: '20 － x ＝ 12 (x ＝ 8)' },
  { a: 35, b: 15, label: '35 － x ＝ 15 (x ＝ 20)' },
  { a: 18, b: 7, label: '18 － x ＝ 7 (x ＝ 11)' },
  { a: 50, b: 40, label: '50 － x ＝ 40 (x ＝ 10)' }
];

export default function GnostosMeionAgnostosPage() {
  // Παράμετροι της εξίσωσης: a - x = b (x = a - b)
  const [paramA, setParamA] = useState(10);
  const [paramB, setParamB] = useState(4);

  // Ασφαλείς αριθμητικές τιμές: 1 <= b < a <= MAX_VAL
  const activeA = Math.max(2, Math.min(MAX_VAL, Number(paramA) || 2));
  const activeB = Math.max(1, Math.min(activeA - 1, Number(paramB) || 1));

  // Σωστή μαθηματική λύση: x = a - b (Αφαιρετέος)
  const exactSolution = activeA - activeB;

  // Ποσοστά για το δυναμικό πλάτος των γραφικών μπαρών
  const percentB = (activeB / activeA) * 100;
  const percentX = (exactSolution / activeA) * 100;

  const handleAChange = (val) => {
    const nextA = Math.max(2, Math.min(MAX_VAL, Number(val) || 2));
    setParamA(nextA);
    setParamB(prevB => {
      const bNum = Number(prevB) || 1;
      return bNum >= nextA ? Math.max(1, nextA - 1) : bNum;
    });
  };

  const handleBChange = (val) => {
    const nextB = Number(val) || 1;
    if (nextB < activeA) {
      setParamB(Math.max(1, nextB));
    }
  };

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
  };

  return (
    <Layout
      title="Εξισώσεις: Άγνωστος Αφαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστική θεωρία με sliders και γραμμικές μπάρες σύγκρισης χώρου για την επίλυση εξισώσεων όπου ο άγνωστος είναι αφαιρετέος (α - x = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 35 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              35. Εξισώσεις: Ο Άγνωστος είναι Αφαιρετέος (α － x ＝ β)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς βρίσκουμε τον <strong>άγνωστο αφαιρετέο (x)</strong>: από το αρχικό ολικό μέγεθος α αφαιρούμε ένα κομμάτι x και μένει το β. Για να βρούμε πόσο ήταν το x, <strong>αφαιρούμε το γνωστό κομμάτι από το ολικό (x ＝ α － β)</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστικά Sliders &amp; Γραμμικές Μπάρες Σύγκρισης Χώρου</span>
            </div>
            <Link
              href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες: Ο Αφαιρετέος &amp; Επίλυση Εξισώσεων Αφαίρεσης
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς εντοπίζουμε το κομμάτι που αφαιρέθηκε όταν γνωρίζουμε το ολικό και το υπόλοιπο.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    Ο ΑΦΑΙΡΕΤΕΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κομμάτι που κόπηκε</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  1. Ποιος είναι ο Αφαιρετέος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στην εξίσωση α － x ＝ β, το x είναι ο <strong>αφαιρετέος</strong> (το κομμάτι που αφαιρείται ή κόβεται από το αρχικό μέγεθος α).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>10 － x ＝ 4 (x ＝ Κομμάτι)</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο αφαιρετέος x είναι πάντα μικρότερος από το συνολικό μέγεθος α!
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">x ＝ α － β</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  2. Ο Κανόνας Επίλυσης
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε το κομμάτι που αφαιρέθηκε (x), <strong>αφαιρούμε το κομμάτι που έμεινε (β) από το ολικό (α)</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>x ＝ 10 － 4 ＝ <strong className="text-indigo-700">6</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ <strong>Χρυσός Κανόνας:</strong> Όταν ο άγνωστος είναι στη μέση της αφαίρεσης (αφαιρετέος), λύνουμε πάντα με <strong>αφαίρεση</strong>!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΛΕΓΧΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Αντικατάσταση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  3. Επαλήθευση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ελέγχουμε αν το υπόλοιπο είναι σωστό: 10 － 6 ＝ 4! Τα δύο κομμάτια x ＋ β συμπληρώνουν ακριβώς το ολικό μήκος α.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>6 ＋ 4 ＝ 10 (Σωστό! ✔️)</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Αν μετά την αφαίρεση προκύψει το επιθυμητό αποτέλεσμα, η λύση είναι απόλυτα σωστή!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Σύγκριση Μήκους και Χώρου με Γραμμικές Μπάρες
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              Μετακίνησε τα sliders για το α και το β και δες πώς οι μπάρες αποκαλύπτουν αμέσως το μήκος του άγνωστου x!
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">

                {/* SLIDER A: ΟΛΙΚΟ ΜΗΚΟΣ (ΜΕΙΩΤΕΟΣ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="text-xs font-black text-blue-900 tracking-wider uppercase truncate">
                      🔵 ΟΛΙΚΟ ΜΕΓΕΘΟΣ (α)
                    </span>
                    <span className="font-mono font-black text-sm text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shrink-0 min-w-[72px] text-center whitespace-nowrap shadow-xs">
                      α ＝ {activeA}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5 w-full">
                    <button 
                      type="button" 
                      disabled={activeA <= activeB + 1}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAChange(activeA - 1); }}
                      className="w-9 h-9 bg-white hover:bg-slate-100 disabled:opacity-30 text-blue-700 font-black rounded-xl border border-blue-200 text-base shadow-xs flex items-center justify-center touch-manipulation active:scale-95 transition shrink-0"
                    >
                      －
                    </button>
                    <input
                      key={`range-param-a-${activeA}`}
                      id="range-param-a"
                      name="rangeParamA"
                      type="range"
                      min="2"
                      max={MAX_VAL}
                      value={activeA}
                      onChange={(e) => handleAChange(e.target.value)}
                      onInput={(e) => handleAChange(e.target.value)}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg block touch-manipulation pointer-events-auto"
                    />
                    <button 
                      type="button" 
                      disabled={activeA >= MAX_VAL}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAChange(activeA + 1); }}
                      className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white font-black rounded-xl text-base shadow-md flex items-center justify-center touch-manipulation active:scale-95 transition shrink-0"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* SLIDER B: ΚΟΜΜΑΤΙ ΠΟΥ ΕΜΕΙΝΕ (ΔΙΑΦΟΡΑ) */}
                <div className="bg-emerald-50/60 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="text-xs font-black text-emerald-900 tracking-wider uppercase truncate">
                      🟢 ΚΟΜΜΑΤΙ ΠΟΥ ΕΜΕΙΝΕ (β)
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200 shrink-0 min-w-[72px] text-center whitespace-nowrap shadow-xs">
                      β ＝ {activeB}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5 w-full">
                    <button 
                      type="button" 
                      disabled={activeB <= 1}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBChange(activeB - 1); }}
                      className="w-9 h-9 bg-white hover:bg-slate-100 disabled:opacity-30 text-emerald-700 font-black rounded-xl border border-emerald-200 text-base shadow-xs flex items-center justify-center touch-manipulation active:scale-95 transition shrink-0"
                    >
                      －
                    </button>
                    <input
                      key={`range-param-b-${activeB}`}
                      id="range-param-b"
                      name="rangeParamB"
                      type="range"
                      min="1"
                      max={activeA - 1}
                      value={activeB}
                      onChange={(e) => handleBChange(e.target.value)}
                      onInput={(e) => handleBChange(e.target.value)}
                      className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg block touch-manipulation pointer-events-auto"
                    />
                    <button 
                      type="button" 
                      disabled={activeB >= activeA - 1}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBChange(activeB + 1); }}
                      className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white font-black rounded-xl text-base shadow-md flex items-center justify-center touch-manipulation active:scale-95 transition shrink-0"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-1 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEquation(p.a, p.b); }}
                        className={`py-2 px-3 rounded-xl border font-mono font-black text-xs transition-all text-left flex justify-between items-center touch-manipulation active:scale-95 ${
                          activeA === p.a && activeB === p.b
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        <span>{p.label}</span>
                        <span className="text-[10px] opacity-75">Επιλογή ➔</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                  💡 <strong>Τι παρατηρούμε;</strong> Το ολικό μέγεθος α ({activeA}) χωρίζεται στο κομμάτι x ({exactSolution}) και στο κομμάτι β ({activeB}). Άρα: <strong>x ＝ {activeA} － {activeB} ＝ {exactSolution}</strong>!
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο αφαιρετέο x, κάνουμε πάντα <strong>αφαίρεση: x ＝ α － β</strong>!
              </div>
            </div>

            {/* RIGHT: COMPARATIVE SPACE BARS VISUALIZER (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[540px] space-y-6">

              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                  <span className="text-blue-600">{activeA}</span>
                  <span className="text-slate-400 mx-2">－</span>
                  <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-emerald-600">{activeB}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-700 bg-white px-3.5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                  x ＝ {activeA} － {activeB} ＝ <strong className="text-amber-600">{exactSolution}</strong>
                </div>
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΧΩΡΟΥ (2 ΠΑΡΑΛΛΗΛΕΣ ΜΠΑΡΕΣ) */}
              <div className="space-y-6 bg-slate-50/70 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-inner">

                {/* ΕΠΑΝΩ ΜΠΑΡΑ: 1ο ΜΕΛΟΣ (ΟΛΙΚΟ α = x + b) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black tracking-wider uppercase">
                    <span className="text-blue-900">1Ο ΜΕΛΟΣ: ΑΡΧΙΚΟ ΜΕΓΕΘΟΣ (α ＝ {activeA})</span>
                    <span className="text-slate-500 font-mono">100% του χώρου</span>
                  </div>

                  {/* Η μπάρα χωρισμένη σε x (άγνωστο) και b */}
                  <div className="w-full h-12 sm:h-14 bg-slate-200 rounded-2xl p-1 border-2 border-slate-300 shadow-inner flex gap-1 overflow-hidden">

                    {/* ΤΜΗΜΑ x (Αφαιρετέος) */}
                    <div 
                      style={{ width: `${percentX}%` }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl transition-all duration-300 flex items-center justify-center text-slate-950 font-mono font-black text-sm sm:text-base md:text-lg border-2 border-dashed border-amber-700 shadow-sm relative overflow-hidden"
                    >
                      <span className="z-10">x</span>
                      <div className="absolute inset-0 bg-white/10" />
                    </div>

                    {/* ΤΜΗΜΑ b (Κομμάτι που απομένει) */}
                    <div 
                      style={{ width: `${percentB}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center text-white font-mono font-black text-xs sm:text-sm md:text-base shadow-sm truncate px-1"
                    >
                      <span>β ＝ {activeB}</span>
                    </div>

                  </div>

                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 px-1 font-mono uppercase">
                    <span className="text-amber-700">▲ Αφαιρέθηκε το x</span>
                    <span className="text-emerald-700">▲ Απομένει (β ＝ {activeB})</span>
                  </div>
                </div>

                {/* ΚΑΤΩ ΜΠΑΡΑ: 2ο ΜΕΛΟΣ (ΔΙΑΦΟΡΑ b & ΥΠΟΛΟΓΙΣΜΟΣ x = a - b) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs font-black tracking-wider uppercase">
                    <span className="text-emerald-900">2Ο ΜΕΛΟΣ: ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ (β ＝ {activeB})</span>
                    <span className="text-slate-500 font-mono">{Math.round(percentB)}% του ολικού</span>
                  </div>

                  {/* Η μπάρα του b στοιχισμένη ακριβώς δεξιά κάτω από το τμήμα b */}
                  <div className="w-full h-12 sm:h-14 bg-slate-200/80 rounded-2xl p-1 border-2 border-slate-300 shadow-inner flex justify-end overflow-hidden">

                    {/* Κενό / Διαφορά που αντιστοιχεί στο x = a - b */}
                    <div 
                      style={{ width: `${percentX}%` }} 
                      className="h-full flex items-center justify-center text-xs sm:text-sm font-black text-amber-700 bg-amber-50/60 border-2 border-dashed border-amber-400 rounded-xl mr-1 font-mono shadow-inner truncate px-1"
                    >
                      <span>x ＝ {exactSolution}</span>
                    </div>

                    {/* Το γνωστό κομμάτι b */}
                    <div 
                      style={{ width: `${percentB}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center text-white font-mono font-black text-xs sm:text-sm md:text-base shadow-sm truncate px-1"
                    >
                      <span>β ＝ {activeB}</span>
                    </div>

                  </div>

                  <div className="text-center text-xs font-mono font-bold text-slate-600 pt-1">
                    🔍 Παρατηρούμε ότι: <strong className="text-blue-700">Ολικό ({activeA})</strong> － <strong className="text-emerald-700">Πράσινο ({activeB})</strong> ＝ <strong className="text-amber-600 font-black">x ＝ {exactSolution}</strong>!
                  </div>
                </div>

              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 ΣΥΜΠΕΡΑΣΜΑ: Στην εξίσωση <strong>{activeA} － x ＝ {activeB}</strong>, ο άγνωστος αφαιρετέος ισούται με <strong>x ＝ {activeA} － {activeB} ＝ {exactSolution}</strong>!
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο αφαιρετέο; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            σπαράσσεστε Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </section>

      </div>
    </Layout>
  );
}
