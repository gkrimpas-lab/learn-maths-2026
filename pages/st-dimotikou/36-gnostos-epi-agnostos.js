  import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο για το μέγιστο γινόμενο
const MAX_PRODUCT = 36;

const PRESETS = [
  { a: 3, b: 12, label: "3 · x ＝ 12 (x ＝ 4)" },
  { a: 4, b: 20, label: "4 · x ＝ 20 (x ＝ 5)" },
  { a: 2, b: 14, label: "2 · x ＝ 14 (x ＝ 7)" },
  { a: 5, b: 15, label: "5 · x ＝ 15 (x ＝ 3)" },
  { a: 6, b: 24, label: "6 · x ＝ 24 (x ＝ 4)" }
];

// Χρώματα ομάδων για την ισοκατανομή των μπαλών
const GROUP_COLORS = [
  { fill: "url(#ballGold)", stroke: "#b45309", tag: "#f59e0b" },
  { fill: "url(#ballGreen)", stroke: "#047857", tag: "#10b981" },
  { fill: "url(#ballBlue)", stroke: "#1d4ed8", tag: "#3b82f6" },
  { fill: "url(#ballPurple)", stroke: "#6b21a8", tag: "#a855f7" },
  { fill: "url(#ballPink)", stroke: "#be185d", tag: "#ec4899" },
  { fill: "url(#ballCyan)", stroke: "#0e7490", tag: "#06b6d4" }
];

export default function GnostosEpiAgnostosPage() {
  // Παράμετροι της εξίσωσης: a * x = b (x = b / a)
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(12);

  // Βήμα διαδραστικής επίλυσης: 1 (Αρχική), 2 (Ομαδοποίηση / Διαίρεση), 3 (Λύση 1 κουτί x)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλείς αριθμητικές τιμές
  const activeA = Math.max(2, Math.min(6, Number(paramA) || 2));
  // Εξασφάλιση ότι το b είναι πολλαπλάσιο του a
  const rawB = Number(paramB) || activeA * 4;
  const quotient = Math.max(1, Math.min(Math.floor(MAX_PRODUCT / activeA), Math.round(rawB / activeA)));
  const activeB = activeA * quotient;

  // Σωστή μαθηματική λύση: x = b / a
  const exactSolution = quotient;

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustA = (amount) => {
    setCurrentStep(1);
    const nextA = Math.max(2, Math.min(6, activeA + amount));
    setParamA(nextA);
    setParamB(nextA * exactSolution);
  };

  const adjustXTarget = (amount) => {
    setCurrentStep(1);
    const nextX = Math.max(1, Math.min(Math.floor(MAX_TOTAL_BALLS_PER_GROUP(activeA)), exactSolution + amount));
    setParamB(activeA * nextX);
  };

  function MAX_TOTAL_BALLS_PER_GROUP(a) {
    return Math.floor(MAX_PRODUCT / a);
  }

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 9;
  const BALL_SPACING = 22;
  const BASE_Y = 248;

  // 1. Θέσεις Κουτιών x στον Αριστερό Δίσκο
  const BOX_WIDTH = 38;
  const BOX_HEIGHT = 44;
  const boxesToShow = currentStep === 3 ? 1 : activeA;
  const leftBoxes = [];
  const startBoxX = 150 - ((boxesToShow - 1) * (BOX_WIDTH + 8)) / 2;
  for (let i = 0; i < boxesToShow; i++) {
    leftBoxes.push({
      id: `box-${i}`,
      x: startBoxX + i * (BOX_WIDTH + 8) - BOX_WIDTH / 2,
      y: BASE_Y - BOX_HEIGHT - 2
    });
  }

  // 2. Θέσεις Σφαιρών στον Δεξιό Δίσκο (Ομαδοποιημένες σε `activeA` ίσες στήλες)
  const rightBalls = [];
  const startGroupX = 610 - ((activeA - 1) * 32) / 2;
  for (let g = 0; g < activeA; g++) {
    const groupX = startGroupX + g * 32;
    for (let r = 0; r < exactSolution; r++) {
      rightBalls.push({
        id: `rball-${g}-${r}`,
        group: g,
        x: groupX,
        y: BASE_Y - BALL_RADIUS - 2 - r * BALL_SPACING,
        // Στο βήμα 3 μένει μόνο η 1η ομάδα (1 μερίδα)
        isKeptInStep3: g === 0
      });
    }
  }

  // 3. Θέσεις σφαιρών ΜΕΣΑ στο ανοιχτό κουτί x (Βήμα 3)
  const insideSingleBoxBalls = [];
  const colsInside = Math.min(3, exactSolution);
  for (let i = 0; i < exactSolution; i++) {
    const row = Math.floor(i / colsInside);
    const col = i % colsInside;
    insideSingleBoxBalls.push({
      id: `inside-${i}`,
      x: 150 - ((colsInside - 1) * 16) / 2 + col * 16,
      y: BASE_Y - 14 - row * 16
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Εξισώσεις: Άγνωστος Παράγοντας Γινομένου (α · x = β) - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία με ζυγαριά, ομαδοποίηση και διαίρεση για την επίλυση εξισώσεων όπου ο άγνωστος είναι παράγοντας γινομένου (α · x = β) για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/36-gnostos-epi-agnostos-ask"
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
                    Ενότητα 36
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  36. Εξισώσεις: Ο Άγνωστος είναι Παράγοντας Γινομένου ($\alpha \cdot x = \beta$)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο παράγοντα ($x$)</strong>: αν $\alpha$ όμοια κουτιά $x$ ζυγίζουν συνολικά $\beta$, για να βρούμε τι περιέχει το <strong>ένα κουτί $x$</strong>, κάνουμε <strong>διαίρεση: $x = \beta : \alpha$</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην επίλυση εξισώσεων πολλαπλασιασμού!</p>
                <Link
                  href="/st-dimotikou/36-gnostos-epi-agnostos-ask"
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
                <h3 className="text-lg font-black text-slate-900">1. Παράγοντας Γινομένου</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στην εξίσωση $\alpha \cdot x = \beta$ (ή $\alpha x = \beta$), το $\alpha$ και το $x$ είναι οι <strong>παράγοντες</strong> και το $\beta$ είναι το <strong>γινόμενο</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  3 · x ＝ 12 (3 όμοια x ζυγίζουν 12)
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
                  Για να βρούμε τον άγνωστο παράγοντα, <strong>διαιρούμε το γινόμενο με τον γνωστό παράγοντα</strong> (αντίστροφη πράξη):
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  x ＝ 12 : 3 ＝ <strong className="text-indigo-700 font-black">4</strong>
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
                  Ελέγχουμε αν το αποτέλεσμα επιβεβαιώνει την αρχική ισότητα: $3 \cdot 4 = 12$! Η πράξη είναι σωστή.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  3 · 4 ＝ 12 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND (3D ΖΥΓΑΡΙΑ ΜΕ ΟΜΑΔΟΠΟΙΗΣΗ & ΔΙΑΙΡΕΣΗ) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Η Ζυγαριά του Πολλαπλασιασμού
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε τον συντελεστή $\alpha$ και το γινόμενο $\beta$ και δες πώς οι μπάλες μοιράζονται ισόποσα στα $\alpha$ κουτιά!
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
                  1️⃣ {activeA} Κουτιά x ＝ {activeB}
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
                  2️⃣ Χωρισμός σε {activeA} Ίσες Ομάδες
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
                  3️⃣ 1 Κουτί x ＝ {exactSolution}
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      ⚙️ Ρύθμιση Εξίσωσης: α · x ＝ β
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      {/* ΠΛΗΘΟΣ ΚΟΥΤΙΩΝ (a) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Κουτιά x (α)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={activeA <= 2}
                            onClick={() => adjustA(-1)} 
                            className="px-2 py-1 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-blue-600">{activeA}</span>
                          <button 
                            type="button" 
                            disabled={activeA >= 6}
                            onClick={() => adjustA(1)} 
                            className="px-2 py-1 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΠΕΡΙΕΧΟΜΕΝΟ ΑΝΑ ΚΟΥΤΙ (x) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Μπάλες ανά κουτί (x)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={exactSolution <= 1}
                            onClick={() => adjustXTarget(-1)} 
                            className="px-2 py-1 font-black text-amber-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-amber-600">{exactSolution}</span>
                          <button 
                            type="button" 
                            disabled={exactSolution >= MAX_TOTAL_BALLS_PER_GROUP(activeA)}
                            onClick={() => adjustXTarget(1)} 
                            className="px-2 py-1 font-black text-amber-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center font-mono text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      Συνολικό Γινόμενο (β): <strong>{activeA} · {exactSolution} ＝ {activeB}</strong>
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
                        Στον αριστερό δίσκο έχουμε <strong>{activeA} όμοια κουτιά $x$</strong>. Στον δεξιό δίσκο έχουμε συνολικά <strong>{activeB} μπάλες</strong>. Η ζυγαριά ισορροπεί: <strong>{activeA} · x ＝ {activeB}</strong>.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-amber-800">
                        Χωρίζουμε τις {activeB} μπάλες του δεξιού δίσκου σε <strong>{activeA} ίσες ομάδες</strong> (όσα είναι και τα κουτιά). Κάθε ομάδα αντιστοιχεί ακριβώς σε 1 κουτί $x$!
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-emerald-800 font-bold">
                        Κρατάμε μόνο <strong>1 κουτί $x$</strong> και <strong>1 ομάδα μπαλών</strong> (διαίρεση με το {activeA}). Το κουτί $x$ περιέχει ακριβώς: <strong>x ＝ {activeB} : {activeA} ＝ {exactSolution} μπάλες</strong>!
                      </p>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο παράγοντα $x$, κάνουμε πάντα <strong>διαίρεση: $x = \beta : \alpha$</strong>!
                </div>
              </div>

              {/* RIGHT: BIG 3D SCALE & GROUPING VISUALIZER (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-800">
                    <span className="text-blue-600">{activeA}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                    <span className="text-slate-400 mx-2">＝</span>
                    <span className="text-emerald-600">{activeB}</span>
                  </div>

                  <div className="font-mono text-base md:text-lg font-black text-indigo-700 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                    {currentStep === 1 && `Βήμα 1: ${activeA} · x ＝ ${activeB}`}
                    {currentStep === 2 && `Βήμα 2: ${activeB} μπάλες σε ${activeA} ίσες ομάδες`}
                    {currentStep === 3 && `Βήμα 3: x ＝ ${activeB} : ${activeA} ＝ ${exactSolution}`}
                  </div>
                </div>

                {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ 3D ΣΤΟ SVG */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      ⚖️ Οπτική Ζυγαριά: Αριστερός Δίσκος ({boxesToShow} · x) vs Δεξιός Δίσκος ({currentStep === 3 ? exactSolution : activeB})
                    </span>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✔️ Τέλεια Ισορροπία
                    </span>
                  </div>

                  {/* SVG CONTAINER */}
                  <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
                    <svg width="100%" height="340" viewBox="0 0 760 360" className="overflow-visible select-none">
                      <defs>
                        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
                        </filter>
                        <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.6" />
                        </filter>

                        {/* Μεταλλική διαβάθμιση δοκού & κολόνας */}
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

                        {/* Διαβαθμίσεις Δίσκων */}
                        <linearGradient id="leftDishGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="rightDishGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>

                        {/* 3D Gradients Σφαιρών ανά ομάδα */}
                        <radialGradient id="ballGold" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </radialGradient>
                        <radialGradient id="ballGreen" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#6ee7b7" />
                          <stop offset="40%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </radialGradient>
                        <radialGradient id="ballBlue" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="40%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </radialGradient>
                        <radialGradient id="ballPurple" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#e9d5ff" />
                          <stop offset="40%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#6b21a8" />
                        </radialGradient>
                        <radialGradient id="ballPink" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#fbcfe8" />
                          <stop offset="40%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#be185d" />
                        </radialGradient>
                        <radialGradient id="ballCyan" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#a5f3fc" />
                          <stop offset="40%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#0e7490" />
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

                      {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΤΑ ΚΟΥΤΙΑ x */}
                      {currentStep < 3 ? (
                        // Βήματα 1 & 2: Εμφάνιση των a κουτιών x
                        leftBoxes.map((box, i) => (
                          <g key={box.id} transform={`translate(${box.x}, ${box.y})`} filter="url(#shadow3d)">
                            <rect 
                              width={BOX_WIDTH} 
                              height={BOX_HEIGHT} 
                              rx="10" 
                              fill={GROUP_COLORS[i % GROUP_COLORS.length].tag}
                              stroke="#78350f" 
                              strokeWidth="2" 
                            />
                            <text x={BOX_WIDTH / 2} y="27" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                            <text x={BOX_WIDTH / 2} y="38" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">#{i + 1}</text>
                          </g>
                        ))
                      ) : (
                        // Βήμα 3: Ένα μεγάλο ανοιχτό κουτί x με τις μπάλες μέσα του
                        <g filter="url(#shadow3d)">
                          <rect 
                            x="100" 
                            y="180" 
                            width="100" 
                            height="68" 
                            rx="14" 
                            fill="rgba(245, 158, 11, 0.15)" 
                            stroke="#d97706" 
                            strokeWidth="3" 
                            filter="url(#glowGold)"
                          />
                          <rect x="108" y="188" width="22" height="22" rx="6" fill="#f59e0b" />
                          <text x="119" y="204" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                          <text x="156" y="202" fill="#92400e" fontSize="11" fontWeight="900">1 ΚΟΥΤΙ x</text>

                          {/* Μπάλες μέσα στο 1 κουτί x */}
                          {insideSingleBoxBalls.map((pos) => (
                            <g key={pos.id} filter="url(#glowGold)">
                              <circle cx={pos.x} cy={pos.y} r="7" fill="url(#ballGold)" stroke="#b45309" strokeWidth="1" />
                              <ellipse cx={pos.x - 2} cy={pos.y - 2} rx="2" ry="1.5" fill="#ffffff" opacity="0.6" />
                              <text x={pos.x} y={pos.y + 3} fill="#ffffff" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">1</text>
                            </g>
                          ))}
                        </g>
                      )}

                      {/* 6. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ (ΟΜΑΔΟΠΟΙΗΜΕΝΕΣ Ή 1 ΜΕΡΙΔΑ ΣΤΟ ΒΗΜΑ 3) */}
                      {rightBalls.map((ball) => {
                        if (currentStep === 3 && !ball.isKeptInStep3) return null;

                        const colTheme = currentStep === 1 
                          ? { fill: "url(#ballGreen)", stroke: "#047857" } 
                          : GROUP_COLORS[ball.group % GROUP_COLORS.length];

                        return (
                          <g key={ball.id} className="transition-all duration-500" filter="url(#shadow3d)">
                            <circle
                              cx={ball.x}
                              cy={ball.y}
                              r={BALL_RADIUS}
                              fill={colTheme.fill}
                              stroke={colTheme.stroke}
                              strokeWidth="1.5"
                            />
                            {/* Specular 3D Highlight */}
                            <ellipse cx={ball.x - 3} cy={ball.y - 3} rx="3" ry="2" fill="#ffffff" opacity="0.65" />
                            <text x={ball.x} y={ball.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                              1
                            </text>
                          </g>
                        );
                      })}

                      {/* Ετικέτες κάτω από τους δίσκους */}
                      <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                        {currentStep === 3 ? "1 Μόνο Κουτί x" : `${activeA} Όμοια Κουτιά x`}
                      </text>

                      <text x="610" y="325" fill="#064e3b" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                        {currentStep === 1 && `Σύνολο: ${activeB} μπάλες`}
                        {currentStep === 2 && `${activeA} ίσες ομάδες των ${exactSolution} μπαλών`}
                        {currentStep === 3 && `1 Ομάδα: ${exactSolution} μπάλες`}
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

                    <div className="text-xs font-black text-indigo-900 bg-indigo-50 px-5 py-2 rounded-xl border border-indigo-200 shadow-xs">
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
                  💡 Συμπέρασμα: Στην εξίσωση <strong>{activeA} · x ＝ {activeB}</strong>, ο άγνωστος παράγοντας ισούται με <strong>x ＝ {activeB} : {activeA} ＝ {exactSolution}</strong> (όσες μπάλες περιέχει το ένα κουτί)!
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο παράγοντα γινομένου; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/36-gnostos-epi-agnostos-ask"
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
