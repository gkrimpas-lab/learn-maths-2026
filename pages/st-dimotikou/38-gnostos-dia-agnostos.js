import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο για τον μέγιστο διαιρετέο a
const MAX_TOTAL_A = 36;

const PRESETS = [
  { a: 12, b: 4, label: "12 : x ＝ 4 (x ＝ 3)" },
  { a: 20, b: 5, label: "20 : x ＝ 5 (x ＝ 4)" },
  { a: 18, b: 6, label: "18 : x ＝ 6 (x ＝ 3)" },
  { a: 15, b: 3, label: "15 : x ＝ 3 (x ＝ 5)" },
  { a: 24, b: 4, label: "24 : x ＝ 4 (x ＝ 6)" }
];

// Χρώματα ανά ομάδα / διαμέρισμα
const PORTION_COLORS = [
  { fill: "url(#ballGold)", stroke: "#b45309", tag: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)" },
  { fill: "url(#ballGreen)", stroke: "#047857", tag: "#10b981", bg: "rgba(16, 185, 129, 0.2)" },
  { fill: "url(#ballBlue)", stroke: "#1d4ed8", tag: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)" },
  { fill: "url(#ballPurple)", stroke: "#6b21a8", tag: "#a855f7", bg: "rgba(168, 85, 247, 0.2)" },
  { fill: "url(#ballPink)", stroke: "#be185d", tag: "#ec4899", bg: "rgba(236, 72, 153, 0.2)" },
  { fill: "url(#ballCyan)", stroke: "#0e7490", tag: "#06b6d4", bg: "rgba(6, 182, 212, 0.2)" }
];

export default function GnostosDiaAgnostosPage() {
  // Παράμετροι της εξίσωσης: a : x = b (x = a / b)
  const [paramA, setParamA] = useState(12);
  const [paramB, setParamB] = useState(4);

  // Βήμα διαδραστικής επίλυσης: 1 (Αρχική), 2 (Ομαδοποίηση σε πακέτα των β), 3 (Λύση x = α : β)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλείς αριθμητικές τιμές (το b είναι παράγοντας του a και το x = a/b είναι μεταξύ 2 και 6)
  const rawA = Math.max(4, Math.min(MAX_TOTAL_A, Number(paramA) || 12));
  const rawB = Math.max(1, Math.min(8, Number(paramB) || 4));

  // Εξασφάλιση ότι x = a / b είναι ακέραιος μεταξύ 2 και 6
  let activeX = Math.max(2, Math.min(6, Math.round(rawA / rawB)));
  let activeB = rawB;
  let activeA = activeX * activeB;

  // Σωστή μαθηματική λύση: x = a / b (Διαιρέτης / Πλήθος ομάδων)
  const exactSolution = activeX;

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustB = (amount) => {
    setCurrentStep(1);
    const nextB = Math.max(1, Math.min(8, activeB + amount));
    setParamB(nextB);
    setParamA(exactSolution * nextB);
  };

  const adjustX = (amount) => {
    setCurrentStep(1);
    const nextX = Math.max(2, Math.min(6, exactSolution + amount));
    setParamA(nextX * activeB);
  };

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 7.5;
  const BALL_SPACING_Y = 16;
  const BASE_Y = 248;

  // 1. Γεωμετρία Κουτιού (Αριστερός Δίσκος)
  const TOTAL_BOX_WIDTH = exactSolution * 32 + 12;
  const TOTAL_BOX_HEIGHT = Math.max(68, activeB * BALL_SPACING_Y + 18);
  const boxStartX = 150 - TOTAL_BOX_WIDTH / 2;
  const boxStartY = BASE_Y - TOTAL_BOX_HEIGHT - 2;

  // 2. Δεξιός Δίσκος: b μπάλες (το μέγεθος του ενός μεριδίου)
  const MAX_STACK_HEIGHT = 7;
  const rightBalls = [];
  const subColsRight = activeB > MAX_STACK_HEIGHT ? 2 : 1;
  const subColSpacing = 15;
  const startSubColX = 610 - ((subColsRight - 1) * subColSpacing) / 2;

  for (let r = 0; r < activeB; r++) {
    const colIdx = Math.floor(r / MAX_STACK_HEIGHT);
    const rowIdx = r % MAX_STACK_HEIGHT;

    rightBalls.push({
      id: `rball-${r}`,
      x: startSubColX + colIdx * subColSpacing,
      y: BASE_Y - BALL_RADIUS - 2 - rowIdx * BALL_SPACING_Y
    });
  }

  // 3. Θέσεις σφαιρών ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ (Αριστερός Δίσκος)
  const insidePortionBalls = [];
  for (let g = 0; g < exactSolution; g++) {
    const pCenterX = boxStartX + 6 + g * 32 + 14;
    for (let r = 0; r < activeB; r++) {
      insidePortionBalls.push({
        id: `inside-p-${g}-${r}`,
        group: g,
        x: pCenterX,
        y: boxStartY + TOTAL_BOX_HEIGHT - 6 - BALL_RADIUS - r * BALL_SPACING_Y
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Εξισώσεις: Άγνωστος Διαιρέτης (α : x = β) - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία με 3D ζυγαριά, ομαδοποίηση και διαίρεση για την επίλυση εξισώσεων όπου ο άγνωστος είναι διαιρέτης (α : x = β) για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/38-gnostos-dia-agnostos-ask"
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
                    🎓 ΣΤ' Δημοτικου
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενοτητα 38
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  38. Εξισώσεις: Ο Άγνωστος είναι Διαιρέτης (α : x ＝ β)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο διαιρέτη (x)</strong>: Αν μοιράσουμε το αρχικό σύνολο α σε x ίσα μέρη και κάθε μέρος περιέχει β μπάλες, για να βρούμε σε πόσα μέρη μοιράστηκε, κάνουμε <strong>διαίρεση: x ＝ α : β</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην επίλυση εξισώσεων όπου ο άγνωστος είναι διαιρέτης!</p>
                <Link
                  href="/st-dimotikou/38-gnostos-dia-agnostos-ask"
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
                <h3 className="text-lg font-black text-slate-900">1. Ποιος είναι ο Διαιρέτης;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στη διαίρεση α : x ＝ β, το x είναι ο <strong>διαιρέτης</strong> (το πλήθος των ίσων μεριδίων στα οποία μοιράζεται το ολικό ποσό α).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  12 : x ＝ 4 (Μοιράζουμε σε x μερίδια)
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
                  Για να βρούμε τον άγνωστο διαιρέτη, <strong>διαιρούμε τον διαιρετέο (α) με το πηλίκο (β)</strong>:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  x ＝ 12 : 4 ＝ <strong className="text-indigo-700 font-black">3</strong>
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
                  Αν μοιράσουμε τις 12 μπάλες σε 3 ίσα μέρη, κάθε μέρος παίρνει ακριβώς 4 μπάλες: 12 : 3 ＝ 4!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  12 : 3 ＝ 4 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND (3D ΖΥΓΑΡΙΑ ΜΕ ΟΜΑΔΟΠΟΙΗΣΗ & ΔΙΑΙΡΕΣΗ) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Σε πόσα κομμάτια x μοιράστηκε το {activeA};
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε το ολικό ποσό α και το μέγεθος κάθε μεριδίου β και δες πώς η διαίρεση α : β αποκαλύπτει τον άγνωστο διαιρέτη x!
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
                  1️⃣ {activeA} : x ＝ {activeB}
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
                  2️⃣ Ομαδοποίηση σε πακέτα των {activeB}
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
                  3️⃣ Λύση: x ＝ {exactSolution} Κομμάτια
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
                    <span className="text-xs font-black text-slate-800 tracking-wider block">
                      ⚙️ Ρύθμιση Εξίσωσης: α : x ＝ β
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      {/* ΜΕΓΕΘΟΣ ΜΕΡΙΔΙΟΥ (b) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Μπάλες ανά μέρος (β)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={activeB <= 1}
                            onClick={() => adjustB(-1)} 
                            className="px-2 py-1 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                          <button 
                            type="button" 
                            disabled={activeB >= 8}
                            onClick={() => adjustB(1)} 
                            className="px-2 py-1 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΠΛΗΘΟΣ ΜΕΡΙΔΙΩΝ (x) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Πλήθος μερών (x)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={exactSolution <= 2}
                            onClick={() => adjustX(-1)} 
                            className="px-2 py-1 font-black text-amber-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-amber-600">{exactSolution}</span>
                          <button 
                            type="button" 
                            disabled={exactSolution >= 6}
                            onClick={() => adjustX(1)} 
                            className="px-2 py-1 font-black text-amber-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center font-mono text-xs font-bold text-indigo-800 bg-indigo-50 p-2 rounded-xl border border-indigo-200">
                      Εξίσωση: <strong>{activeA} : x ＝ {activeB}</strong>
                    </div>
                  </div>

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Ετοιμα Παραδειγματα:
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
                      📖 Τι συμβαινει στο Βημα {currentStep}:
                    </span>
                    {currentStep === 1 && (
                      <p>
                        Στον αριστερό δίσκο έχουμε <strong>{activeA} μπάλες συνολικά</strong> που μοιράζονται σε x ίσα κομμάτια. Στον δεξιό δίσκο βλέπουμε ότι κάθε κομμάτι περιέχει <strong>{activeB} μπάλες</strong>: <strong>{activeA} : x ＝ {activeB}</strong>.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-amber-800">
                        Ομαδοποιούμε τις {activeA} μπάλες σε <strong>πακέτα των {activeB} μπαλών</strong> (κάθε πακέτο με δικό του χρώμα). Ψάχνουμε πόσα τέτοια πακέτα σχηματίζονται!
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-emerald-800 font-bold">
                        Δημιουργήθηκαν ακριβώς {activeA} : {activeB} ＝ <strong>{exactSolution} ίσα κομμάτια</strong>! Άρα ο άγνωστος διαιρέτης είναι: <strong>x ＝ {activeA} : {activeB} ＝ {exactSolution}</strong>.
                      </p>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο διαιρέτη x, κάνουμε πάντα <strong>διαίρεση: x ＝ α : β</strong>!
                </div>
              </div>

              {/* RIGHT: BIG 3D SCALE & SECTIONED BOX VISUALIZER (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-800">
                    <span className="text-blue-600">{activeA}</span>
                    <span className="text-slate-400 mx-2">:</span>
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                    <span className="text-slate-400 mx-2">＝</span>
                    <span className="text-emerald-600">{activeB}</span>
                  </div>

                  <div className="font-mono text-base md:text-lg font-black text-indigo-700 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                    {currentStep === 1 && `Βήμα 1: ${activeA} μπάλες σε x κομμάτια ＝ ${activeB} ανά κομμάτι`}
                    {currentStep === 2 && `Βήμα 2: Ομαδοποίηση των ${activeA} μπαλών ανά ${activeB}`}
                    {currentStep === 3 && `Βήμα 3: x ＝ ${activeA} : ${activeB} ＝ ${exactSolution}`}
                  </div>
                </div>

                {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ 3D ΣΤΟ SVG */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      ⚖️ Οπτική Ζυγαριά: Αριστερός Δίσκος ({activeA} : x) vs Δεξιός Δίσκος ({activeB} Μπάλες ανά Μερίδιο)
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

                      {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΤΟ ΚΟΥΤΙ ΜΕ ΤΙΣ a ΜΠΑΛΕΣ */}
                      <g filter="url(#shadow3d)">
                        {/* ΕΠΙΚΕΦΑΛΙΔΑ ΕΞΩ ΑΠΟ ΤΟ ΚΟΥΤΙ */}
                        <rect 
                          x={150 - Math.max(85, TOTAL_BOX_WIDTH / 2)} 
                          y={boxStartY - 24} 
                          width={Math.max(170, TOTAL_BOX_WIDTH)} 
                          height="20" 
                          rx="8" 
                          fill={currentStep === 3 ? "#10b981" : "#3b82f6"} 
                        />
                        <text x="150" y={boxStartY - 10} fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                          {currentStep === 3 ? `x ＝ ${exactSolution} ΚΟΜΜΑΤΙΑ (${activeA} : ${activeB})` : `ΣΥΝΟΛΟ: ${activeA} ΜΠΑΛΕΣ ΣΕ x ΜΕΡΗ`}
                        </text>

                        {/* Εξωτερικό περίβλημα όλου του κουτιού */}
                        <rect 
                          x={boxStartX} 
                          y={boxStartY} 
                          width={TOTAL_BOX_WIDTH} 
                          height={TOTAL_BOX_HEIGHT} 
                          rx="12" 
                          fill="#f8fafc" 
                          stroke={currentStep === 3 ? "#059669" : "#3b82f6"} 
                          strokeWidth="2.5" 
                        />

                        {/* Τα διαμερίσματα/κομμάτια */}
                        {Array.from({ length: exactSolution }).map((_, i) => {
                          const pX = boxStartX + 6 + i * 32;
                          const pY = boxStartY + 5;
                          const isHighlightedPortion = currentStep >= 2;

                          return (
                            <g key={`portion-box-${i}`}>
                              <rect
                                x={pX}
                                y={pY}
                                width="28"
                                height={TOTAL_BOX_HEIGHT - 10}
                                rx="7"
                                fill={isHighlightedPortion ? PORTION_COLORS[i % PORTION_COLORS.length].bg : "rgba(59, 130, 246, 0.08)"}
                                stroke={isHighlightedPortion ? PORTION_COLORS[i % PORTION_COLORS.length].tag : "#93c5fd"}
                                strokeWidth={isHighlightedPortion ? "2" : "1"}
                                strokeDasharray={currentStep === 1 ? "4 2" : "none"}
                              />
                            </g>
                          );
                        })}

                        {/* Οι μπάλες ΜΕΣΑ στο κουτί (Στο Βήμα 1 είναι όλες μπλε, στα Βήματα 2 & 3 είναι ομαδοποιημένες ανά χρώμα) */}
                        {insidePortionBalls.map((pos) => {
                          const colTheme = currentStep === 1 
                            ? { fill: "url(#ballBlue)", stroke: "#1d4ed8" } 
                            : PORTION_COLORS[pos.group % PORTION_COLORS.length];

                          return (
                            <g key={pos.id} filter="url(#glowGold)">
                              <circle cx={pos.x} cy={pos.y} r={BALL_RADIUS} fill={colTheme.fill} stroke={colTheme.stroke} strokeWidth="1" />
                              <ellipse cx={pos.x - 2} cy={pos.y - 2} rx="2" ry="1.4" fill="#ffffff" opacity="0.6" />
                              <text x={pos.x} y={pos.y + 2.5} fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="monospace">1</text>
                            </g>
                          );
                        })}
                      </g>

                      {/* 6. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ b ΜΠΑΛΕΣ (ΤΟ 1 ΜΕΡΙΔΙΟ) */}
                      {rightBalls.map((ball) => (
                        <g key={ball.id} className="transition-all duration-500" filter="url(#shadow3d)">
                          <circle
                            cx={ball.x}
                            cy={ball.y}
                            r={BALL_RADIUS}
                            fill="url(#ballGreen)"
                            stroke="#047857"
                            strokeWidth="1.5"
                          />
                          <ellipse cx={ball.x - 2.5} cy={ball.y - 2.5} rx="2.5" ry="1.8" fill="#ffffff" opacity="0.65" />
                          <text x={ball.x} y={ball.y + 3} fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                            1
                          </text>
                        </g>
                      ))}

                      {/* Ετικέτες κάτω από τους δίσκους */}
                      <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                        {currentStep === 3 ? `x ＝ ${exactSolution} ίσα μέρη των ${activeB}` : `Αρχικό Σύνολο: ${activeA} μπάλες`}
                      </text>

                      <text x="610" y="325" fill="#064e3b" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                        1 Μερίδιο: {activeB} μπάλες
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
                  💡 Συμπέρασμα: Στην εξίσωση <strong>{activeA} : x ＝ {activeB}</strong>, ο άγνωστος διαιρέτης ισούται με <strong>x ＝ {activeA} : {activeB} ＝ {exactSolution}</strong> (σε {exactSolution} ίσα μέρη μοιράστηκε το αρχικό ποσό)!
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο διαιρέτη; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/38-gnostos-dia-agnostos-ask"
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
