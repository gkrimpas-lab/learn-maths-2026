// pages/st-dimotikou/34-agnostos-kai-afairesi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Οριο τιμων για το διαδραστικο οπτικο εργαστηριο
const MAX_TOTAL_BALLS = 16;

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
  { a: 3, b: 5, label: 'x － 3 ＝ 5 (x ＝ 8)' },
  { a: 4, b: 6, label: 'x － 4 ＝ 6 (x ＝ 10)' },
  { a: 5, b: 7, label: 'x － 5 ＝ 7 (x ＝ 12)' },
  { a: 2, b: 8, label: 'x － 2 ＝ 8 (x ＝ 10)' },
  { a: 6, b: 8, label: 'x － 6 ＝ 8 (x ＝ 14)' }
];

export default function AgnostosKaiAfairesiPage() {
  // Παραμετροι της εξισωσης: x - a = b (x = b + a)
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(5);

  // Βημα διαδραστικης επιλυσης: 1 (Κενες θεσεις μεσα στο x), 2 (Προσθηκη και στα δυο μελη), 3 (Πληρες x = b + a)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλεις αριθμητικες τιμες
  const rawA = Math.max(1, Number(paramA) || 1);
  const rawB = Math.max(1, Number(paramB) || 1);
  
  const activeA = Math.min(6, rawA);
  const activeB = Math.min(MAX_TOTAL_BALLS - activeA, rawB);

  // Σωστη μαθηματικη λυση: x = b + a (Μειωτεος)
  const exactSolution = activeB + activeA;

  // Αλλαγη παραμετρων με αυτοματη επαναφορα στο Βημα 1
  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustValue = (type, amount) => {
    setCurrentStep(1);
    if (type === 'a') {
      setParamA(prevA => {
        const nextA = Math.max(1, Math.min(6, (Number(prevA) || 1) + amount));
        return nextA + activeB <= MAX_TOTAL_BALLS ? nextA : prevA;
      });
    } else {
      setParamB(prevB => {
        const nextB = Math.max(1, Math.min(MAX_TOTAL_BALLS - activeA, (Number(prevB) || 1) + amount));
        return nextB;
      });
    }
  };

  // Σταθερη γεωμετρια σφαιρων
  const BALL_RADIUS = 9.5;
  const BALL_SPACING = BALL_RADIUS * 2 + 5; // 24px
  const BASE_Y = 248;

  // 1. Υπολογισμος θεσεων σφαιρων / κενων θεσεων ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ x (Αριστερος Δισκος)
  const insideBoxSlots = [];
  for (let i = 0; i < activeA; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    insideBoxSlots.push({
      x: 130 + col * BALL_SPACING,
      y: 226 - row * BALL_SPACING
    });
  }

  // 2. Θεσεις σφαιρων δεξιου δισκου
  const currentRightCount = currentStep === 1 ? activeB : exactSolution;
  const COLS_RIGHT = 6;
  const rightBalls = [];
  for (let i = 0; i < currentRightCount; i++) {
    const row = Math.floor(i / COLS_RIGHT);
    const totalRows = Math.ceil(currentRightCount / COLS_RIGHT);
    const itemsInThisRow = row === totalRows - 1 && currentRightCount % COLS_RIGHT !== 0 
      ? currentRightCount % COLS_RIGHT 
      : COLS_RIGHT;
    
    const colIndexInRow = i % COLS_RIGHT;
    const rowWidth = (itemsInThisRow - 1) * BALL_SPACING;
    const startX = 610 - rowWidth / 2;

    rightBalls.push({
      id: i,
      x: startX + colIndexInRow * BALL_SPACING,
      y: BASE_Y - BALL_RADIUS - 2 - row * BALL_SPACING,
      isAdded: i >= activeB
    });
  }

  return (
    <Layout
      title="Εξισώσεις: Άγνωστος Μειωτέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστική θεωρία με όμορφη ζυγαριά, μεγάλο κουτί x με εσωτερικά ελλείμματα και βήματα πρόσθεσης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 34 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              34. Εξισώσεις: Ο Άγνωστος είναι Μειωτέος (x － α ＝ β)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς βρίσκουμε τον <strong>άγνωστο μειωτέο (x)</strong>: όπως συμπληρώνουμε <strong>τις α μπάλες που λείπουν μέσα από το κουτί x</strong> και προσθέτουμε τις ίδιες α μπάλες και στον δεξιό δίσκο για ισορροπία, έτσι κάνουμε <strong>πρόσθεση: x ＝ β ＋ α</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστική Ζυγαριά σε Ισορροπία &amp; Οπτική Προσθήκη Βαρών</span>
            </div>
            <Link
              href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
              Βασικές Έννοιες: Ο Μειωτέος &amp; Επίλυση Εξισώσεων Αφαίρεσης
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς διατηρείται η ισορροπία όταν συμπληρώνουμε το έλλειμμα στον άγνωστο μειωτέο x.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    Ο ΜΕΙΩΤΕΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αρχικό Ποσό</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  1. Ποιος είναι ο Μειωτέος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στην αφαίρεση x － α ＝ β, το x είναι ο <strong>μειωτέος</strong> (η αρχική μεγάλη ποσότητα από την οποία αφαιρούμε).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>x － 3 ＝ 5 (x ＝ Αρχικό Ποσό)</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο μειωτέος είναι πάντοτε μεγαλύτερος από (ή ίσος με) τη διαφορά και τον αφαιρετέο!
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">x ＝ β ＋ α</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  2. Ο Κανόνας Επίλυσης
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε τον άγνωστο μειωτέο, <strong>προσθέτουμε τη διαφορά και τον αφαιρετέο</strong> (αντίστροφη πράξη):
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>x ＝ 5 ＋ 3 ＝ <strong className="text-indigo-700">8</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ <strong>Χρυσός Κανόνας:</strong> Όταν ο άγνωστος είναι πρώτος στην αφαίρεση (μειωτέος), λύνουμε πάντα με <strong>πρόσθεση</strong>!
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
                  Αντικαθιστούμε το x με τον αριθμό που βρήκαμε και ελέγχουμε αν η αφαίρεση είναι σωστή:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>8 － 3 ＝ 5 (Σωστό! ✔️)</p>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Συμπλήρωση του Κουτιού x &amp; Επίλυση με Πρόσθεση
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
                Δες τις κενές θέσεις μέσα στο κουτί x και ακολούθησε τα βήματα για να προστεθούν οι μπάλες και στα δύο μέλη!
              </p>
            </div>

            {/* STEP CONTROLS BUTTONS */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(1); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1️⃣ {toCleanUppercase(`Λείπουν ${activeA} Μπάλες`)}
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(2); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 2
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2️⃣ {toCleanUppercase(`Προσθήκη ＋${activeA}`)}
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(3); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 3
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3️⃣ {toCleanUppercase(`Πλήρες x ＝ ${exactSolution}`)}
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ */}
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <span className="text-xs font-black text-slate-800 tracking-wider block uppercase">
                    ⚙️ ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ: x － α ＝ β
                  </span>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
                    {/* ΑΦΑΙΡΕΤΕΟΣ (a) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        ΜΠΑΛΕΣ ΠΟΥ ΛΕΙΠΟΥΝ (α)
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeA <= 1}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', -1); }} 
                          className="w-9 h-9 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-rose-600">{activeA}</span>
                        <button 
                          type="button" 
                          disabled={activeA >= 6 || activeA + activeB >= MAX_TOTAL_BALLS}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', 1); }} 
                          className="w-9 h-9 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* ΔΙΑΦΟΡΑ (b) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        ΜΠΑΛΕΣ ΔΕΞΙΑ (β)
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeB <= 1}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', -1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                        <button 
                          type="button" 
                          disabled={activeA + activeB >= MAX_TOTAL_BALLS}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', 1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
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
                        <span className="text-[10px] opacity-75">Δοκιμή ➔</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ ΑΝΑΛΟΓΑ ΜΕ ΤΟ ΕΝΕΡΓΟ ΒΗΜΑ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs space-y-2">
                  <span className="font-black text-slate-900 uppercase block text-[11px]">
                    📖 ΤΙ ΣΥΜΒΑΙΝΕΙ ΣΤΟ ΒΗΜΑ {currentStep}:
                  </span>
                  {currentStep === 1 && (
                    <p>
                      Στον αριστερό δίσκο έχουμε το <strong>κουτί x μέσα από το οποίο λείπουν {activeA} μπάλες</strong> (φαίνονται ως διακεκομμένες κενές θέσεις). Στον δεξιό δίσκο έχουμε <strong>{activeB} μπάλες</strong>: <strong>x － {activeA} ＝ {activeB}</strong>.
                    </p>
                  )}
                  {currentStep === 2 && (
                    <p className="text-amber-800">
                      Προσθέτουμε <strong>{activeA} λαμπερές πορτοκαλί μπάλες</strong> για να «κουμπώσουν» μέσα στο κουτί x, και <strong>προσθέτουμε ακριβώς {activeA} μπάλες</strong> και στον δεξιό δίσκο για να διατηρηθεί η ισορροπία!
                    </p>
                  )}
                  {currentStep === 3 && (
                    <p className="text-emerald-800 font-bold">
                      Το κουτί x είναι πλέον <strong>πλήρες (λαμπερό πράσινο)</strong>! Στον δεξιό δίσκο βρίσκονται {activeB} ＋ {activeA} ＝ <strong>{exactSolution} μπάλες</strong>: <strong>x ＝ {activeB} ＋ {activeA} ＝ {exactSolution}</strong>.
                    </p>
                  )}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο μειωτέο x, κάνουμε πάντα <strong>πρόσθεση: x ＝ β ＋ α</strong>!
              </div>
            </div>

            {/* RIGHT: PREMIUM 3D SCALE & IN-BOX BALLS VISUALIZER (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                  <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                  <span className="text-slate-400 mx-2">－</span>
                  <span className="text-rose-600">{activeA}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-emerald-600">{activeB}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-700 bg-white px-3.5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                  {currentStep === 1 && 'Βήμα 1: Αρχική Ισότητα (x － α ＝ β)'}
                  {currentStep === 2 && `Βήμα 2: Προσθήκη ＋${activeA} και στα δύο μέλη`}
                  {currentStep === 3 && `Βήμα 3: x ＝ ${activeB} ＋ ${activeA} ＝ ${exactSolution}`}
                </div>
              </div>

              {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΣΤΟ SVG */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    ⚖️ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ: ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ (x － {activeA}) VS ΔΕΞΙΟΣ ΔΙΣΚΟΣ ({activeB})
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✔ Τέλεια Ισορροπία
                  </span>
                </div>

                {/* SVG CONTAINER */}
                <div className="p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
                  <svg width="100%" height="340" viewBox="0 0 760 360" className="overflow-visible select-none max-w-full">
                    <defs>
                      <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
                      </filter>
                      <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
                      </filter>

                      <linearGradient id="metalBeam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="40%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="metalPillar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>

                      <linearGradient id="leftDishGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="rightDishGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>

                      <radialGradient id="ballGreen" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="40%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </radialGradient>

                      <radialGradient id="ballGold" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </radialGradient>
                    </defs>
                    
                    {/* 1. ΒΑΣΗ & ΚΟΛΟΝΑ ΖΥΓΑΡΙΑΣ */}
                    <polygon points="380,270 315,345 445,345" fill="url(#metalBeam)" filter="url(#shadow3d)" />
                    <rect x="373" y="65" width="14" height="215" fill="url(#metalPillar)" rx="3" />
                    <circle cx="380" cy="65" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" filter="url(#shadow3d)" />

                    {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΖΥΓΟΣ (BEAM) */}
                    <rect x="90" y="58" width="580" height="14" rx="7" fill="url(#metalBeam)" filter="url(#shadow3d)" />
                    <circle cx="150" cy="65" r="5" fill="#e2e8f0" />
                    <circle cx="610" cy="65" r="5" fill="#e2e8f0" />

                    {/* 3. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                    <line x1="150" y1="65" x2="50" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <line x1="150" y1="65" x2="250" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <path d="M 30 250 Q 150 292 270 250 Z" fill="url(#leftDishGrad)" filter="url(#shadow3d)" />
                    <rect x="30" y="248" width="240" height="6" fill="#1e40af" rx="3" />

                    {/* 4. ΔΕΞΙΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                    <line x1="610" y1="65" x2="510" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <line x1="610" y1="65" x2="710" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <path d="M 490 250 Q 610 292 730 250 Z" fill="url(#rightDishGrad)" filter="url(#shadow3d)" />
                    <rect x="490" y="248" width="240" height="6" fill="#065f46" rx="3" />

                    {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΜΕΓΑΛΟ «ΓΥΑΛΙΝΟ» ΚΟΥΤΙ x */}
                    <g transform="translate(95, 164)" filter="url(#shadow3d)">
                      <rect 
                        width="110" 
                        height="84" 
                        rx="16" 
                        fill={currentStep === 3 ? "rgba(16, 185, 129, 0.18)" : "rgba(245, 158, 11, 0.12)"} 
                        stroke={currentStep === 3 ? "#059669" : "#d97706"} 
                        strokeWidth="3" 
                        strokeDasharray={currentStep === 1 ? "6 4" : "none"}
                      />
                      <rect x="8" y="8" width="28" height="28" rx="8" fill={currentStep === 3 ? "#10b981" : "#f59e0b"} filter="url(#shadow3d)" />
                      <text x="22" y="28" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                      <text x="66" y="26" fill={currentStep === 3 ? "#065f46" : "#92400e"} fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        {currentStep === 3 ? "ΠΛΗΡΕΣ x" : "ΚΟΥΤΙ x"}
                      </text>
                    </g>

                    {/* 6. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ / ΕΛΛΕΙΜΜΑΤΑ ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ x */}
                    {insideBoxSlots.map((pos, i) => {
                      if (currentStep === 1) {
                        return (
                          <g key={`inbox-slot-${i}`} className="transition-all duration-500">
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={BALL_RADIUS}
                              fill="rgba(244, 63, 94, 0.1)"
                              stroke="#f43f5e"
                              strokeWidth="2"
                              strokeDasharray="3 3"
                            />
                            <circle cx={pos.x - 3} cy={pos.y - 3} r="2.5" fill="#ffffff" opacity="0.6" />
                            <text x={pos.x} y={pos.y + 3.5} fill="#e11d48" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">－1</text>
                          </g>
                        );
                      } else {
                        return (
                          <g key={`inbox-filled-${i}`} className="transition-all duration-500" filter={currentStep === 2 ? "url(#glowGold)" : "url(#shadow3d)"}>
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={BALL_RADIUS}
                              fill={currentStep === 2 ? "url(#ballGold)" : "url(#ballGreen)"}
                              stroke={currentStep === 2 ? "#b45309" : "#047857"}
                              strokeWidth="1.5"
                              className={currentStep === 2 ? "animate-pulse" : ""}
                            />
                            <ellipse cx={pos.x - 3} cy={pos.y - 3} rx="3" ry="2" fill="#ffffff" opacity="0.65" />
                            <text x={pos.x} y={pos.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                              {currentStep === 2 ? "＋1" : "1"}
                            </text>
                          </g>
                        );
                      }
                    })}

                    {/* 7. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ 3D ΜΠΑΛΕΣ b ΚΑΙ ΟΙ ΠΡΟΣΤΙΘΕΜΕΝΕΣ ΜΠΑΛΕΣ a */}
                    {rightBalls.map((ball) => {
                      const isAddedBall = ball.isAdded;
                      return (
                        <g key={`rball-${ball.id}`} className="transition-all duration-500" filter={isAddedBall && currentStep === 2 ? "url(#glowGold)" : "url(#shadow3d)"}>
                          <circle
                            cx={ball.x}
                            cy={ball.y}
                            r={BALL_RADIUS}
                            fill={isAddedBall ? (currentStep === 2 ? "url(#ballGold)" : "url(#ballGreen)") : "url(#ballGreen)"}
                            stroke={isAddedBall ? (currentStep === 2 ? "#b45309" : "#047857") : "#047857"}
                            strokeWidth="1.5"
                            className={isAddedBall && currentStep === 2 ? "animate-pulse" : ""}
                          />
                          <ellipse cx={ball.x - 3} cy={ball.y - 3} rx="3" ry="2" fill="#ffffff" opacity="0.65" />
                          <text x={ball.x} y={ball.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                            {isAddedBall ? "＋1" : "1"}
                          </text>
                        </g>
                      );
                    })}

                    {/* Ετικέτες κάτω από τους δίσκους */}
                    <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 1 && `x (λείπουν ${activeA} μπάλες από μέσα)`}
                      {currentStep === 2 && `x － ${activeA} ＋ ${activeA}`}
                      {currentStep === 3 && 'Ολόκληρο το Κουτί x'}
                    </text>

                    <text x="610" y="325" fill="#064e3b" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 1 && `Αρχικά: ${activeB} μπάλες`}
                      {currentStep === 2 && `Προσθήκη: ${activeB} ＋ ${activeA} μπάλες`}
                      {currentStep === 3 && `Σύνολο: ${exactSolution} μπάλες`}
                    </text>
                  </svg>
                </div>

                {/* ACTION BAR ΓΙΑ ΜΕΤΑΒΑΣΗ ΣΤΑ ΒΗΜΑΤΑ */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev - 1); }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-black rounded-xl border border-slate-200 transition touch-manipulation active:scale-95"
                  >
                    ⬅️ Προηγούμενο
                  </button>

                  <div className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 sm:px-5 py-2 rounded-xl border border-indigo-200 shadow-xs">
                    Βήμα {currentStep} από 3
                  </div>

                  <button
                    type="button"
                    disabled={currentStep === 3}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev + 1); }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95 touch-manipulation"
                  >
                    Επόμενο ➡️
                  </button>
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 ΣΥΜΠΕΡΑΣΜΑ: Συμπληρώνοντας τις {activeA} μπάλες που έλειπαν από το κουτί x και προσθέτοντας {activeA} μπάλες και στον δεξιό δίσκο, βρίσκουμε: <strong>x ＝ {activeB} ＋ {activeA} ＝ {exactSolution}</strong>!
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Άγνωστο Μειωτέο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο μειωτέο; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
