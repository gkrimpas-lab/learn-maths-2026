import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο τιμών για το διαδραστικό οπτικό εργαστήριο
const MAX_TOTAL_BALLS = 16;

const PRESETS = [
  { a: 10, b: 4, label: "10 － x ＝ 4 (x ＝ 6)" },
  { a: 12, b: 5, label: "12 － x ＝ 5 (x ＝ 7)" },
  { a: 15, b: 6, label: "15 － x ＝ 6 (x ＝ 9)" },
  { a: 8, b: 3, label: "8 － x ＝ 3 (x ＝ 5)" },
  { a: 14, b: 8, label: "14 － x ＝ 8 (x ＝ 6)" }
];

export default function GnostosMeionAgnostosPage() {
  // Παράμετροι της εξίσωσης: a - x = b (x = a - b)
  const [paramA, setParamA] = useState(10);
  const [paramB, setParamB] = useState(4);

  // Βήμα διαδραστικής επίλυσης: 1 (Αρχική), 2 (Διαχωρισμός γνωστών), 3 (Αποκάλυψη x)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλείς αριθμητικές τιμές: 1 <= b < a <= MAX_TOTAL_BALLS
  const rawA = Math.max(2, Math.min(MAX_TOTAL_BALLS, Number(paramA) || 2));
  const rawB = Math.max(1, Math.min(rawA - 1, Number(paramB) || 1));

  const activeA = rawA;
  const activeB = rawB;

  // Σωστή μαθηματική λύση: x = a - b (Αφαιρετέος / Μπάλες που διώξαμε)
  const exactSolution = activeA - activeB;

  // Αλλαγή παραμέτρων με αυτόματη επαναφορά στο Βήμα 1
  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustValue = (type, amount) => {
    setCurrentStep(1);
    if (type === 'a') {
      const nextA = Math.max(activeB + 1, Math.min(MAX_TOTAL_BALLS, activeA + amount));
      setParamA(nextA);
    } else {
      const nextB = Math.max(1, Math.min(activeA - 1, activeB + amount));
      setParamB(nextB);
    }
  };

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 13;
  const BALL_SPACING = 36;

  // 1. Θέσεις για τις μπάλες του x (Μπάλες που αφαιρέθηκαν / κρύφτηκαν στο κουτί)
  const xBalls = [];
  const colsX = Math.min(4, Math.max(2, Math.ceil(exactSolution / 2)));
  for (let i = 0; i < exactSolution; i++) {
    const row = Math.floor(i / colsX);
    const col = i % colsX;
    xBalls.push({
      id: `x-${i}`,
      // Κεντράρισμα μέσα στο αριστερό κουτί (κέντρο x = 190, y = 185)
      x: 190 - ((colsX - 1) * BALL_SPACING) / 2 + col * BALL_SPACING,
      y: 165 + row * BALL_SPACING
    });
  }

  // 2. Θέσεις για τις μπάλες του b (Μπάλες που μένουν / ορατές)
  const bBalls = [];
  const colsB = Math.min(4, Math.max(2, Math.ceil(activeB / 2)));
  for (let i = 0; i < activeB; i++) {
    const row = Math.floor(i / colsB);
    const col = i % colsB;
    bBalls.push({
      id: `b-${i}`,
      // Κεντράρισμα στο δεξί πλαίσιο (κέντρο x = 540, y = 185)
      x: 540 - ((colsB - 1) * BALL_SPACING) / 2 + col * BALL_SPACING,
      y: 165 + row * BALL_SPACING
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Εξισώσεις: Άγνωστος Αφαιρετέος (α - x = β) - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία με παραστατική αφαίρεση μπαλών και αποκάλυψη του άγνωστου αφαιρετέου (α - x = β) για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
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
                    Ενότητα 35
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  35. Εξισώσεις: Ο Άγνωστος είναι Αφαιρετέος ($\alpha - x = \beta$)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο αφαιρετέο ($x$)</strong>: είχαμε αρχικά $\alpha$ μπάλες, διώξαμε $x$ και μας έμειναν $\beta$. Για να βρούμε πόσες φύγανε, <strong>αφαιρούμε όσες έμειναν από το αρχικό σύνολο ($x = \alpha - \beta$)</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην επίλυση εξισώσεων με άγνωστο αφαιρετέο!</p>
                <Link
                  href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
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
                <h3 className="text-lg font-black text-slate-900">1. Ποιος είναι ο Αφαιρετέος;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στην εξίσωση $\alpha - x = \beta$, το $x$ είναι ο <strong>αφαιρετέος</strong> (η ποσότητα που έφυγε ή αφαιρέθηκε από το αρχικό σύνολο $\alpha$).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  10 － x ＝ 4 (x ＝ όσα φύγανε)
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
                  Για να βρούμε πόσα αφαιρέθηκαν, <strong>αφαιρούμε όσα έμειναν ($\beta$) από το αρχικό σύνολο ($\alpha$)</strong>:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  x ＝ 10 － 4 ＝ <strong className="text-indigo-700 font-black">6</strong>
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
                  Βάζουμε στη θέση του $x$ τον αριθμό που βρήκαμε και ελέγχουμε αν η πράξη είναι σωστή:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  10 － 6 ＝ 4 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Πόσες μπάλες κρύφτηκαν / αφαιρέθηκαν;
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε το αρχικό σύνολο ($\alpha$) και τις μπάλες που έμειναν ($\beta$), και δες το κουτί $x$ να αποκαλύπτει τη λύση!
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
                  1️⃣ Αρχικά: {activeA} － x ＝ {activeB}
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
                  2️⃣ Αφαίρεση των {activeB} που έμειναν
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
                  3️⃣ Αποκάλυψη: x ＝ {exactSolution}
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
                      ⚙️ Ρύθμιση Εξίσωσης: α － x ＝ β
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      {/* ΑΡΧΙΚΟ ΣΥΝΟΛΟ (a) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αρχικές Μπάλες (α)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            disabled={activeA <= activeB + 1}
                            onClick={() => adjustValue('a', -1)} 
                            className="px-2 py-1 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-mono font-black text-base text-blue-600">{activeA}</span>
                          <button 
                            type="button" 
                            disabled={activeA >= MAX_TOTAL_BALLS}
                            onClick={() => adjustValue('a', 1)} 
                            className="px-2 py-1 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΜΠΑΛΕΣ ΠΟΥ ΕΜΕΙΝΑΝ (b) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Έμειναν (β)</span>
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
                            disabled={activeB >= activeA - 1}
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
                        Είχαμε <strong>{activeA} μπάλες αρχικά</strong>. Κάποιες από αυτές ($x$) <strong>αφαιρέθηκαν/κλειδώθηκαν μέσα στο Κουτί $x$</strong> και μας έμειναν φανερές <strong>{activeB} μπάλες</strong>: <strong>{activeA} － x ＝ {activeB}</strong>.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-amber-800">
                        Για να βρούμε πόσες μπάλες είναι κρυμμένες στο $x$, <strong>απομονώνουμε τις {activeB} μπάλες που έμειναν</strong> από το αρχικό σύνολο των {activeA} μπαλών.
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-emerald-800 font-bold">
                        Το Κουτί $x$ ανοίγει! Μέσα του βρίσκονται ακριβώς {activeA} － {activeB} ＝ <strong>{exactSolution} μπάλες</strong> (όσες αφαιρέθηκαν): <strong>x ＝ {activeA} － {activeB} ＝ {exactSolution}</strong>.
                      </p>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο αφαιρετέο $x$, κάνουμε πάντα <strong>αφαίρεση: $x = \alpha - \beta$</strong>!
                </div>
              </div>

              {/* RIGHT: NEW INTUITIVE PARTITION VISUALIZER (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-800">
                    <span className="text-blue-600">{activeA}</span>
                    <span className="text-slate-400 mx-2">－</span>
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                    <span className="text-slate-400 mx-2">＝</span>
                    <span className="text-emerald-600">{activeB}</span>
                  </div>

                  <div className="font-mono text-base md:text-lg font-black text-indigo-700 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                    {currentStep === 1 && `Βήμα 1: Αρχικά ${activeA} μπάλες (διώχνουμε x)`}
                    {currentStep === 2 && `Βήμα 2: Αφαιρούμε τις ${activeB} που έμειναν`}
                    {currentStep === 3 && `Βήμα 3: x ＝ ${activeA} － ${activeB} ＝ ${exactSolution}`}
                  </div>
                </div>

                {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΓΡΑΦΗΜΑ ΔΙΑΧΩΡΙΣΜΟΥ & ΑΠΟΚΑΛΥΨΗΣ */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      📦 Οπτική Αναπαράσταση: Αρχικό Σύνολο ({activeA}) ➔ Κουτί x ({exactSolution}) ＋ Έμειναν ({activeB})
                    </span>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                      Σύνολο: {activeA} Μπάλες
                    </span>
                  </div>

                  {/* SVG CONTAINER */}
                  <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
                    <svg width="100%" height="330" viewBox="0 0 740 330" className="overflow-visible select-none">
                      <defs>
                        {/* Σκίαση Drop Shadow */}
                        <filter id="shadowBox" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.15" />
                        </filter>
                        <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.6" />
                        </filter>

                        {/* 3D Radial Gradients για τις Μπάλες */}
                        <radialGradient id="ballBlue" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="40%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </radialGradient>
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

                      {/* ΜΕΓΑΛΟ ΕΞΩΤΕΡΙΚΟ ΠΛΑΙΣΙΟ: ΟΛΕΣ ΟΙ ΑΡΧΙΚΕΣ ΜΠΑΛΕΣ (a) */}
                      <rect 
                        x="30" 
                        y="40" 
                        width="680" 
                        height="260" 
                        rx="24" 
                        fill="#ffffff" 
                        stroke="#94a3b8" 
                        strokeWidth="2.5" 
                        strokeDasharray={currentStep === 1 ? "none" : "6 6"}
                        filter="url(#shadowBox)" 
                      />

                      {/* ΤΙΤΛΟΣ ΑΡΧΙΚΟΥ ΣΥΝΟΛΟΥ ΣΤΟ ΕΠΑΝΩ ΜΕΡΟΣ */}
                      <rect x="250" y="26" width="240" height="30" rx="15" fill="#2563eb" />
                      <text x="370" y="46" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        ΑΡΧΙΚΟ ΣΥΝΟΛΟ: {activeA} ΜΠΑΛΕΣ
                      </text>

                      {/* ΑΡΙΣΤΕΡΗ ΖΩΝΗ: ΤΟ ΚΟΥΤΙ x (ΜΠΑΛΕΣ ΠΟΥ ΑΦΑΙΡΕΘΗΚΑΝ / ΔΙΩΧΘΗΚΑΝ) */}
                      <g filter="url(#shadowBox)">
                        <rect 
                          x="55" 
                          y="85" 
                          width="270" 
                          height="190" 
                          rx="20" 
                          fill={
                            currentStep === 3 
                              ? "rgba(245, 158, 11, 0.15)" 
                              : currentStep === 2 
                              ? "rgba(245, 158, 11, 0.08)" 
                              : "#f8fafc"
                          } 
                          stroke={currentStep === 3 ? "#f59e0b" : "#cbd5e1"} 
                          strokeWidth="3" 
                          strokeDasharray={currentStep < 3 ? "6 4" : "none"}
                        />

                        {/* Ετικέτα Κουτιού x */}
                        <rect x="75" y="100" width="34" height="34" rx="10" fill="#f59e0b" filter={currentStep === 3 ? "url(#glowGold)" : "none"} />
                        <text x="92" y="123" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                        <text x="120" y="122" fill="#92400e" fontSize="13" fontWeight="900">
                          {currentStep === 3 ? `ΑΦΑΙΡΕΘΗΚΑΝ: x ＝ ${exactSolution}` : "ΑΦΑΙΡΕΘΗΚΑΝ (x);"}
                        </text>
                      </g>

                      {/* ΔΕΞΙΑ ΖΩΝΗ: ΟΙ ΜΠΑΛΕΣ ΠΟΥ ΕΜΕΙΝΑΝ (b) */}
                      <g filter="url(#shadowBox)">
                        <rect 
                          x="405" 
                          y="85" 
                          width="270" 
                          height="190" 
                          rx="20" 
                          fill="rgba(16, 185, 129, 0.08)" 
                          stroke="#10b981" 
                          strokeWidth="3" 
                        />

                        {/* Ετικέτα Ζώνης b */}
                        <rect x="425" y="100" width="34" height="34" rx="10" fill="#10b981" />
                        <text x="442" y="123" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">{activeB}</text>
                        <text x="470" y="122" fill="#065f46" fontSize="13" fontWeight="900">
                          ΕΜΕΙΝΑΝ: {activeB} ΜΠΑΛΕΣ
                        </text>
                      </g>

                      {/* ΣΗΜΕΙΟ ΠΡΑΞΗΣ ΑΝΑΜΕΣΑ ΣΤΑ ΔΥΟ ΠΛΑΙΣΙΑ */}
                      <circle cx="365" cy="180" r="18" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                      <text x="365" y="186" fill="#64748b" fontSize="18" fontWeight="900" textAnchor="middle">＋</text>

                      {/* 1. ΜΠΑΛΕΣ ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ x */}
                      {currentStep < 3 ? (
                        // Βήμα 1 & 2: Το περιεχόμενο του x είναι κλειδωμένο / μυστηριώδες
                        <g>
                          <circle cx="190" cy="190" r="32" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
                          <text x="190" y="198" fill="#b45309" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="monospace">?</text>
                          <text x="190" y="240" fill="#92400e" fontSize="11" fontWeight="bold" textAnchor="middle">
                            {currentStep === 1 ? "Πόσες μπάλες λείπουν;" : "x ＝ 10 － 4"}
                          </text>
                        </g>
                      ) : (
                        // Βήμα 3: Αποκαλύπτονται όλες οι x μπάλες (κάθε μπάλα έχει το 1 της μονάδας)
                        xBalls.map((pos) => (
                          <g key={pos.id} className="transition-all duration-500" filter="url(#glowGold)">
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={BALL_RADIUS}
                              fill="url(#ballGold)"
                              stroke="#b45309"
                              strokeWidth="1.5"
                            />
                            {/* Specular Highlight */}
                            <ellipse cx={pos.x - 4} cy={pos.y - 4} rx="3.5" ry="2.5" fill="#ffffff" opacity="0.65" />
                            <text x={pos.x} y={pos.y + 4.5} fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                              1
                            </text>
                          </g>
                        ))
                      )}

                      {/* 2. ΜΠΑΛΕΣ ΠΟΥ ΕΜΕΙΝΑΝ (b) - ΠΑΝΤΑ ΟΡΑΤΕΣ */}
                      {bBalls.map((pos) => (
                        <g key={pos.id} className="transition-all duration-500">
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={BALL_RADIUS}
                            fill="url(#ballGreen)"
                            stroke="#047857"
                            strokeWidth="1.5"
                          />
                          {/* Specular Highlight */}
                          <ellipse cx={pos.x - 4} cy={pos.y - 4} rx="3.5" ry="2.5" fill="#ffffff" opacity="0.65" />
                          <text x={pos.x} y={pos.y + 4.5} fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                            1
                          </text>
                        </g>
                      ))}

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
                  💡 Συμπέρασμα: Στην εξίσωση <strong>{activeA} － x ＝ {activeB}</strong>, ο άγνωστος αφαιρετέος ισούται με <strong>x ＝ {activeA} － {activeB} ＝ {exactSolution}</strong> (οι {exactSolution} μπάλες που έλειπαν από το αρχικό σύνολο)!
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο αφαιρετέο; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/35-gnostos-meion-agnostos-ask"
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
