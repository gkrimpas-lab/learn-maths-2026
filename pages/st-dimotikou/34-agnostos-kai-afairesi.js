import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο τιμών για το διαδραστικό οπτικό εργαστήριο
const MAX_TOTAL_BALLS = 16;

const PRESETS = [
  { a: 3, b: 5, label: "x － 3 ＝ 5 (x ＝ 8)" },
  { a: 4, b: 6, label: "x － 4 ＝ 6 (x ＝ 10)" },
  { a: 5, b: 7, label: "x － 5 ＝ 7 (x ＝ 12)" },
  { a: 2, b: 8, label: "x － 2 ＝ 8 (x ＝ 10)" },
  { a: 6, b: 8, label: "x － 6 ＝ 8 (x ＝ 14)" }
];

export default function AgnostosKaiAfairesiPage() {
  // Παράμετροι της εξίσωσης: x - a = b (x = b + a)
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(5);

  // Βήμα διαδραστικής επίλυσης: 1 (Αρχική με κενές θέσεις), 2 (Προσθήκη και στα δύο μέλη), 3 (Πλήρες x = b + a)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλείς αριθμητικές τιμές ώστε a + b <= MAX_TOTAL_BALLS
  const rawA = Math.max(1, Number(paramA) || 1);
  const rawB = Math.max(1, Number(paramB) || 1);
  
  const activeA = Math.min(6, rawA);
  const activeB = Math.min(MAX_TOTAL_BALLS - activeA, rawB);

  // Σωστή μαθηματική λύση: x = b + a (Μειωτέος)
  const exactSolution = activeB + activeA;

  // Αλλαγή παραμέτρων με αυτόματη επαναφορά στο Βήμα 1
  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustValue = (type, amount) => {
    setCurrentStep(1);
    if (type === 'a') {
      const nextA = Math.max(1, Math.min(6, activeA + amount));
      if (nextA + activeB <= MAX_TOTAL_BALLS) {
        setParamA(nextA);
      }
    } else {
      const nextB = Math.max(1, Math.min(MAX_TOTAL_BALLS - activeA, activeB + amount));
      setParamB(nextB);
    }
  };

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 11;
  const BALL_SPACING = BALL_RADIUS * 2 + 4; // 26px
  const BASE_Y = 248;

  // 1. Υπολογισμός θέσεων των "κενών θέσεων / ελλειμμάτων" (slots) δίπλα στο κουτί x
  const missingSlotsPos = [];
  for (let i = 0; i < activeA; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    missingSlotsPos.push({
      x: 146 + col * BALL_SPACING,
      y: BASE_Y - BALL_RADIUS - 2 - row * BALL_SPACING
    });
  }

  // 2. Θέσεις σφαιρών δεξιού δίσκου (Συμμετρικό κεντράρισμα με βάση το x = 610)
  const currentRightCount = currentStep === 1 ? activeB : exactSolution;
  const COLS_RIGHT = 5;
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Εξισώσεις: Άγνωστος Μειωτέος - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία με ζυγαριά, κουτί x με ελλείμματα και βήματα πρόσθεσης για την επίλυση εξισώσεων όπου ο άγνωστος είναι μειωτέος (x - α = β) για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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

          {/* HERO BANNER */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 34
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  34. Εξισώσεις: Ο Άγνωστος είναι Μειωτέος ($x - \alpha = \beta$)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο μειωτέο ($x$)</strong>: όπως συμπληρώνουμε <strong>τις $\alpha$ μπάλες που λείπουν από το κουτί $x$</strong> και προσθέτουμε τις ίδιες $\alpha$ μπάλες και στον δεξιό δίσκο για ισορροπία, έτσι κάνουμε <strong>πρόσθεση: $x = \beta + \alpha$</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην επίλυση εξισώσεων με άγνωστο μειωτέο!</p>
                <Link
                  href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">1. Ποιος είναι ο Μειωτέος;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στην αφαίρεση $x - \alpha = \beta$, το $x$ είναι ο <strong>μειωτέος</strong> (η αρχική μεγάλη ποσότητα από την οποία αφαιρούμε).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  x － 3 ＝ 5 (x ＝ Αρχικό Ποσό)
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2. Ο Κανόνας Επίλυσης</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Για να βρούμε τον άγνωστο μειωτέο, <strong>προσθέτουμε τη διαφορά και τον αφαιρετέο</strong> (αντίστροφη πράξη):
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  x ＝ 5 ＋ 3 ＝ <strong className="text-indigo-700 font-black">8</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Επαλήθευση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Αντικαθιστούμε το $x$ με τον αριθμό που βρήκαμε και ελέγχουμε αν η αφαίρεση είναι σωστή:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  8 － 3 ＝ 5 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Συμπλήρωση του Κουτιού $x$
                </h2>
                <p className="text-gray-500 text-sm">
                  Δες το κουτί $x$ με τις κενές θέσεις (έλλειμμα) και ακολούθησε τα βήματα για να προστεθούν οι μπάλες και στα δύο μέλη!
                </p>
              </div>

              {/* STEP CONTROLS BUTTONS */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    currentStep === 1
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1️⃣ Λείπουν {activeA} Μπάλες
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    currentStep === 2
                      ? 'bg-amber-500 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2️⃣ Προσθήκη ＋{activeA} στα 2 Μέλη
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    currentStep === 3
                      ? 'bg-emerald-600 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3️⃣ Πλήρες x ＝ {exactSolution}
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      ⚙️ Ρύθμιση Εξίσωσης: x － α ＝ β
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      {/* ΑΦΑΙΡΕΤΕΟΣ (a) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αφαιρετέος (α)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={activeA <= 1}
                            onClick={() => adjustValue('a', -1)} 
                            className="px-2 py-1 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-rose-600">{activeA}</span>
                          <button 
                            type="button" 
                            disabled={activeA >= 6 || activeA + activeB >= MAX_TOTAL_BALLS}
                            onClick={() => adjustValue('a', 1)} 
                            className="px-2 py-1 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΔΙΑΦΟΡΑ (b) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Διαφορά (β)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={activeB <= 1}
                            onClick={() => adjustValue('b', -1)} 
                            className="px-2 py-1 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                          <button 
                            type="button" 
                            disabled={activeA + activeB >= MAX_TOTAL_BALLS}
                            onClick={() => adjustValue('b', 1)} 
                            className="px-2 py-1 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Έτοιμα Παραδείγματα:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEquation(p.a, p.b)}
                          className={`py-2 px-3 rounded-xl border font-mono font-black text-xs transition-all text-left flex justify-between items-center ${
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
                      📖 Τι συμβαίνει στο Βήμα {currentStep}:
                    </span>
                    {currentStep === 1 && (
                      <p>
                        Στον αριστερό δίσκο έχουμε το <strong>κουτί $x$ με {activeA} κενές θέσεις (διακεκομμένες)</strong> αφού του έχουν αφαιρεθεί $\alpha$ μπάλες. Στον δεξιό δίσκο έχουμε <strong>{activeB} μπάλες</strong>: <strong>x － {activeA} ＝ {activeB}</strong>.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-amber-800">
                        Προσθέτουμε <strong>{activeA} πορτοκαλί μπάλες</strong> για να «κουμπώσουν» στις κενές θέσεις του κουτιού $x$, και <strong>προσθέτουμε ακριβώς {activeA} μπάλες</strong> και στον δεξιό δίσκο για να διατηρηθεί η ισορροπία!
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-emerald-800 font-bold">
                        Το κουτί $x$ είναι πλέον <strong>πλήρες (συμπαγές πράσινο)</strong>! Στον δεξιό δίσκο βρίσκονται {activeB} ＋ {activeA} ＝ <strong>{exactSolution} μπάλες</strong>: <strong>x ＝ {activeB} ＋ {activeA} ＝ {exactSolution}</strong>.
                      </p>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο μειωτέο $x$, κάνουμε πάντα <strong>πρόσθεση: $x = \beta + \alpha$</strong>!
                </div>
              </div>

              {/* RIGHT: BIG SCALE & SVG BOX WITH SLOTS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-800">
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                    <span className="text-slate-400 mx-2">－</span>
                    <span className="text-rose-600">{activeA}</span>
                    <span className="text-slate-400 mx-2">＝</span>
                    <span className="text-emerald-600">{activeB}</span>
                  </div>

                  <div className="font-mono text-base md:text-lg font-black text-indigo-700 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                    {currentStep === 1 && "Βήμα 1: Αρχική Ισότητα (x － α ＝ β)"}
                    {currentStep === 2 && `Βήμα 2: Προσθήκη ＋${activeA} και στα δύο μέλη`}
                    {currentStep === 3 && `Βήμα 3: x ＝ ${activeB} ＋ ${activeA} ＝ ${exactSolution}`}
                  </div>
                </div>

                {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΟΛΑ ΣΤΟ SVG ΜΕ SLOTS ΕΛΛΕΙΜΜΑΤΟΣ */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      ⚖️ Οπτική Ζυγαριά: Αριστερός Δίσκος (x － {activeA}) vs Δεξιός Δίσκος ({activeB})
                    </span>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✔️ Τέλεια Ισορροπία
                    </span>
                  </div>

                  {/* SVG CONTAINER */}
                  <div className="p-4 bg-slate-50/90 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
                    <svg width="100%" height="340" viewBox="0 0 760 360" className="overflow-visible select-none">
                      
                      {/* 1. ΒΑΣΗ & ΚΟΛΟΝΑ ΖΥΓΑΡΙΑΣ */}
                      <polygon points="380,270 320,345 440,345" fill="#1e293b" />
                      <rect x="374" y="65" width="12" height="215" fill="#334155" />
                      <circle cx="380" cy="65" r="12" fill="#0f172a" />

                      {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΖΥΓΟΣ (BEAM) */}
                      <rect x="90" y="59" width="580" height="12" rx="6" fill="#1e293b" />

                      {/* 3. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                      <line x1="150" y1="65" x2="50" y2="250" stroke="#64748b" strokeWidth="3" />
                      <line x1="150" y1="65" x2="250" y2="250" stroke="#64748b" strokeWidth="3" />
                      <path d="M 30 250 Q 150 290 270 250 Z" fill="#2563eb" />
                      <rect x="30" y="248" width="240" height="5" fill="#1d4ed8" rx="2" />

                      {/* 4. ΔΕΞΙΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                      <line x1="610" y1="65" x2="510" y2="250" stroke="#64748b" strokeWidth="3" />
                      <line x1="610" y1="65" x2="710" y2="250" stroke="#64748b" strokeWidth="3" />
                      <path d="M 490 250 Q 610 290 730 250 Z" fill="#059669" />
                      <rect x="490" y="248" width="240" height="5" fill="#047857" rx="2" />

                      {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΤΟ ΚΟΥΤΙ x (ΣΤΟ x = 60) */}
                      <g transform="translate(60, 192)">
                        <rect 
                          width="56" 
                          height="56" 
                          rx="14" 
                          fill={currentStep === 3 ? "#10b981" : "#f59e0b"} 
                          stroke={currentStep === 3 ? "#047857" : "#b45309"} 
                          strokeWidth="3" 
                        />
                        <text x="28" y="34" fill={currentStep === 3 ? "#ffffff" : "#451a03"} fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                        <text x="28" y="47" fill={currentStep === 3 ? "#ecfdf5" : "#78350f"} fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                          {currentStep === 3 ? "ΠΛΗΡΕΣ" : "ΕΛΛΙΠΕΣ"}
                        </text>
                      </g>

                      {/* 6. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΟΙ ΚΕΝΕΣ ΘΕΣΕΙΣ (SLOTS) Ή ΟΙ ΠΡΟΣΤΙΘΕΜΕΝΕΣ ΜΠΑΛΕΣ */}
                      {missingSlotsPos.map((pos, i) => {
                        if (currentStep === 1) {
                          // Βήμα 1: Διακεκομμένες κενές θέσεις (φαίνεται ότι λείπουν μπάλες)
                          return (
                            <g key={`slot-${i}`} className="transition-all duration-500">
                              <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={BALL_RADIUS}
                                fill="rgba(239, 68, 68, 0.08)"
                                stroke="#f43f5e"
                                strokeWidth="2"
                                strokeDasharray="3 3"
                              />
                              <text x={pos.x} y={pos.y + 4} fill="#f43f5e" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">－1</text>
                            </g>
                          );
                        } else {
                          // Βήματα 2 & 3: Οι μπάλες προστέθηκαν και συμπλήρωσαν το κουτί x
                          return (
                            <g key={`slot-filled-${i}`} className="transition-all duration-500">
                              <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={BALL_RADIUS}
                                fill={currentStep === 2 ? "#f59e0b" : "#10b981"}
                                stroke={currentStep === 2 ? "#b45309" : "#047857"}
                                strokeWidth="2"
                                className={currentStep === 2 ? "animate-pulse" : ""}
                              />
                              <text x={pos.x} y={pos.y + 4} fill="#ffffff" fontSize="9.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                                {currentStep === 2 ? "＋1" : "1"}
                              </text>
                            </g>
                          );
                        }
                      })}

                      {/* 7. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ b ΚΑΙ ΟΙ ΠΡΟΣΤΙΘΕΜΕΝΕΣ ΜΠΑΛΕΣ a */}
                      {rightBalls.map((ball) => {
                        const isAddedBall = ball.isAdded;
                        return (
                          <g key={`rball-${ball.id}`} className="transition-all duration-500">
                            <circle
                              cx={ball.x}
                              cy={ball.y}
                              r={BALL_RADIUS}
                              fill={isAddedBall ? (currentStep === 2 ? "#f59e0b" : "#10b981") : "#10b981"}
                              stroke={isAddedBall ? (currentStep === 2 ? "#b45309" : "#047857") : "#047857"}
                              strokeWidth="2"
                              className={isAddedBall && currentStep === 2 ? "animate-pulse" : ""}
                            />
                            <text x={ball.x} y={ball.y + 4} fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                              {isAddedBall && currentStep === 2 ? "＋1" : "1"}
                            </text>
                          </g>
                        );
                      })}

                      {/* Ετικέτες κάτω από τους δίσκους */}
                      <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                        {currentStep === 1 && `x (λείπουν ${activeA} μπάλες)`}
                        {currentStep === 2 && `x － ${activeA} ＋ ${activeA}`}
                        {currentStep === 3 && `Ολόκληρο το Κουτί x`}
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
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-black rounded-xl border border-slate-200 transition"
                    >
                      ⬅️ Προηγούμενο Βήμα
                    </button>

                    <div className="text-xs font-black text-indigo-900 bg-indigo-50 px-5 py-2 rounded-xl border border-indigo-200">
                      Βήμα {currentStep} από 3
                    </div>

                    <button
                      type="button"
                      disabled={currentStep === 3}
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95"
                    >
                      Επόμενο Βήμα ➡️
                    </button>
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Συμπέρασμα: Συμπληρώνοντας τις {activeA} μπάλες που έλειπαν από το κουτί $x$ και προσθέτοντας {activeA} μπάλες και στον δεξιό δίσκο, βρίσκουμε: <strong>x ＝ {activeB} ＋ {activeA} ＝ {exactSolution}</strong>!
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο μειωτέο; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
