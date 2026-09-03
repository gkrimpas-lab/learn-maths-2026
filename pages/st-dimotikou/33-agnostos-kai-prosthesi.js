import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Όριο τιμών για το διαδραστικό οπτικό εργαστήριο
const MAX_BALLS = 16;

const PRESETS = [
  { a: 3, b: 8, label: "x ＋ 3 ＝ 8 (x ＝ 5)" },
  { a: 4, b: 10, label: "x ＋ 4 ＝ 10 (x ＝ 6)" },
  { a: 5, b: 12, label: "x ＋ 5 ＝ 12 (x ＝ 7)" },
  { a: 2, b: 9, label: "x ＋ 2 ＝ 9 (x ＝ 7)" },
  { a: 6, b: 14, label: "x ＋ 6 ＝ 14 (x ＝ 8)" }
];

export default function AgnostosKaiProsthesiPage() {
  // Παράμετροι της εξίσωσης: x + a = b
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(8);

  // Βήμα διαδραστικής επίλυσης: 1 (Αρχική), 2 (Επισήμανση), 3 (Αφαίρεση & Αποτέλεσμα)
  const [currentStep, setCurrentStep] = useState(1);

  // Ασφαλείς αριθμητικές τιμές: 0 <= a <= b <= MAX_BALLS
  const activeB = Math.min(MAX_BALLS, Math.max(0, Number(paramB) || 0));
  const activeA = Math.min(activeB, Math.max(0, Number(paramA) || 0));

  // Σωστή μαθηματική λύση: x = b - a
  const exactSolution = activeB - activeA;

  // Αλλαγή παραμέτρων με αυτόματη επαναφορά στο Βήμα 1
  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustValue = (type, amount) => {
    setCurrentStep(1);
    if (type === 'a') {
      setParamA(prevA => {
        const nextA = (Number(prevA) || 0) + amount;
        return Math.max(0, Math.min(activeB, nextA));
      });
    } else {
      setParamB(prevB => {
        const nextB = (Number(prevB) || 0) + amount;
        return Math.max(activeA, Math.min(MAX_BALLS, nextB));
      });
    }
  };

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 11;
  const BALL_SPACING = BALL_RADIUS * 2 + 4; // 26px
  const BASE_Y = 248;

  // 1. Θέσεις σφαιρών αριστερού δίσκου (Ξεκινούν με καθαρό κενό από το κουτί x)
  const leftBallsPos = [];
  for (let i = 0; i < activeA; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    leftBallsPos.push({
      x: 150 + col * BALL_SPACING,
      y: BASE_Y - BALL_RADIUS - 2 - row * BALL_SPACING
    });
  }

  // 2. Θέσεις σφαιρών δεξιού δίσκου (Συμμετρικό κεντράρισμα με βάση το x = 610)
  const COLS_RIGHT = 5;
  const rightBalls = [];
  for (let i = 0; i < activeB; i++) {
    const row = Math.floor(i / COLS_RIGHT);
    const totalRows = Math.ceil(activeB / COLS_RIGHT);
    const itemsInThisRow = row === totalRows - 1 && activeB % COLS_RIGHT !== 0 
      ? activeB % COLS_RIGHT 
      : COLS_RIGHT;
    
    const colIndexInRow = i % COLS_RIGHT;
    const rowWidth = (itemsInThisRow - 1) * BALL_SPACING;
    const startX = 610 - rowWidth / 2;

    rightBalls.push({
      id: i,
      x: startX + colIndexInRow * BALL_SPACING,
      y: BASE_Y - BALL_RADIUS - 2 - row * BALL_SPACING,
      isRemoved: i >= exactSolution
    });
  }

  const actionButton = (
    <Link
      href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
      className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
    >
      <span>🎯</span>
      <span>Ασκήσεις</span>
    </Link>
  );

  return (
    <Layout
      title="⚖️ 33. Εξισώσεις: Άγνωστος Προσθετέος - LearnMaths.gr"
      description="Διαδραστική θεωρία με μεγάλη ζυγαριά, κουτί x και βάρη για την επίλυση εξισώσεων πρόσθεσης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      showAds={true}
    >
      <div className="py-6 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενότητα 33
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                33. Εξισώσεις: Ο Άγνωστος είναι Προσθετέος (x + a = b)
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς βρίσκουμε τον <strong>άγνωστο προσθετέο (x)</strong>: αφαιρούμε <strong>τα ίδια βάρη</strong> και από τα δύο μέρη μιας ζυγαριάς για να μείνει το κουτί x μόνο του, έτσι κάνουμε <strong>αφαίρεση: x = b - a</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις στην επίλυση εξισώσεων πρόσθεσης!</p>
              <Link
                href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">1. Η Ζυγαριά σε Ισορροπία</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Μια εξίσωση είναι σαν μια <strong>ζυγαριά που ισορροπεί</strong>. Το σύμβολο του ίσον (＝) σημαίνει ότι το αριστερό και το δεξί μέλος έχουν <strong>ακριβώς το ίδιο βάρος</strong>.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                x ＋ 3 ＝ 8 (Ισορροπία)
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">2. Αφαίρεση ίδιων βαρών</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Αν <strong>βγάλουμε τον ίδιο αριθμό από τους δύο δίσκους</strong>, η ζυγαριά εξακολουθεί να ισορροπεί! Έτσι μένει το x μόνο του:
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                x ＝ 8 － 3 ＝ <strong className="text-indigo-700 font-black">5</strong>
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
                Ελέγχουμε αν το βάρος του κουτιού είναι σωστό, αντικαθιστώντας το x με τον αριθμό που βρήκαμε:
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                5 ＋ 3 ＝ 8 (Σωστό! ✔️)
              </span>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο: Η Ζυγαριά με το Κουτί x και τα Βάρη
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Ακολούθησε τα 3 βήματα για να δεις πώς αφαιρούνται τα ίδια βάρη απευθείας επάνω στη ζυγαριά!
              </p>
            </div>

            {/* STEP CONTROLS BUTTONS */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(1); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1️⃣ Αρχική Ζυγαριά
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(2); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  currentStep === 2
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2️⃣ Επισήμανση {activeA} Βαρών
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(3); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  currentStep === 3
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3️⃣ Αφαίρεση ➔ x ＝ {exactSolution}
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
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 tracking-wider block">
                      ⚙️ Ρύθμιση Εξίσωσης: x ＋ α ＝ β
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">0 ≤ α ≤ β</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
                    {/* ΓΝΩΣΤΟΣ ΠΡΟΣΘΕΤΕΟΣ (a) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">Μπάλες αριστερά (α)</span>
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 h-10">
                        <button 
                          type="button" 
                          disabled={activeA <= 0}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', -1); }} 
                          className="w-7 sm:w-8 h-full font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded-lg active:scale-95 transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-blue-600">{activeA}</span>
                        <button 
                          type="button" 
                          disabled={activeA >= activeB}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', 1); }} 
                          className="w-7 sm:w-8 h-full font-black text-blue-600 hover:bg-slate-200 disabled:opacity-30 rounded-lg active:scale-95 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ΣΥΝΟΛΙΚΕΣ ΜΠΑΛΕΣ ΔΕΞΙΑ (b) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">Μπάλες δεξιά (β)</span>
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 h-10">
                        <button 
                          type="button" 
                          disabled={activeB <= activeA}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', -1); }} 
                          className="w-7 sm:w-8 h-full font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded-lg active:scale-95 transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                        <button 
                          type="button" 
                          disabled={activeB >= MAX_BALLS}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', 1); }} 
                          className="w-7 sm:w-8 h-full font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-30 rounded-lg active:scale-95 transition flex items-center justify-center"
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
                    Ετοιμα Παραδειγματα:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEquation(p.a, p.b); }}
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
                      Στον αριστερό δίσκο έχουμε το <strong>άγνωστο κουτί x</strong> και <strong>{activeA} μπάλες</strong>. Στον δεξιό δίσκο έχουμε <strong>{activeB} μπάλες</strong>. Η ζυγαριά ισορροπεί: <strong>x ＋ {activeA} ＝ {activeB}</strong>.
                    </p>
                  )}
                  {currentStep === 2 && (
                    <p className="text-amber-800">
                      Επισημαίνουμε με κόκκινο χρώμα <strong>{activeA} μπάλες</strong> από τον αριστερό δίσκο και <strong>ακριβώς {activeA} μπάλες</strong> από τον δεξιό δίσκο, έτοιμες προς αφαίρεση!
                    </p>
                  )}
                  {currentStep === 3 && (
                    <p className="text-emerald-800 font-bold">
                      Αφαιρέσαμε {activeA} μπάλες και από τους δύο δίσκους! Στα αριστερά έμεινε μόνο το <strong>κουτί x</strong> και στα δεξιά έμειναν οι υπόλοιπες <strong>{exactSolution} μπάλες</strong>: <strong>x ＝ {activeB} － {activeA} ＝ {exactSolution}</strong>.
                    </p>
                  )}
                </div>

              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο προσθετέο x, κάνουμε πάντα <strong>αφαίρεση: x = b - a</strong>!
              </div>
            </div>

            {/* RIGHT: BIG SCALE & SVG BOX + BALLS VISUALIZER (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                  <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                  <span className="text-slate-400 mx-2">＋</span>
                  <span className="text-blue-600">{activeA}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-emerald-600">{activeB}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-700 bg-white px-3.5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                  {currentStep === 1 && "Βήμα 1: Αρχική Ισότητα"}
                  {currentStep === 2 && `Βήμα 2: Αφαίρεση ${activeA} και από τα δύο μέλη`}
                  {currentStep === 3 && `Βήμα 3: x ＝ ${activeB} － ${activeA} ＝ ${exactSolution}`}
                </div>
              </div>

              {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΟΛΑ ΣΤΟ SVG */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs font-black text-slate-500 tracking-wider block">
                    ⚖️ Οπτική Ζυγαριά: Αριστερός Δίσκος (x ＋ {activeA}) vs Δεξιός Δίσκος ({activeB})
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✔️ Τέλεια Ισορροπία
                  </span>
                </div>

                {/* SVG CONTAINER */}
                <div className="p-2 sm:p-4 bg-slate-50/90 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
                  <svg width="100%" height="340" viewBox="0 0 760 360" className="overflow-visible select-none max-w-full">
                    
                    {/* 1. ΒΑΣΗ & ΚΟΛΟΝΑ ΖΥΓΑΡΙΑΣ */}
                    <polygon points="380,270 320,345 440,345" fill="#1e293b" />
                    <rect x="374" y="65" width="12" height="215" fill="#334155" />
                    <circle cx="380" cy="65" r="12" fill="#0f172a" />

                    {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΖΥΓΟΣ (BEAM) */}
                    <rect x="90" y="59" width="580" height="12" rx="6" fill="#1e293b" />

                    {/* 3. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ (ΠΛΑΤΟΣ 240px) */}
                    <line x1="150" y1="65" x2="50" y2="250" stroke="#64748b" strokeWidth="3" />
                    <line x1="150" y1="65" x2="250" y2="250" stroke="#64748b" strokeWidth="3" />
                    <path d="M 30 250 Q 150 290 270 250 Z" fill="#2563eb" />
                    <rect x="30" y="248" width="240" height="5" fill="#1d4ed8" rx="2" />

                    {/* 4. ΔΕΞΙΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ (ΠΛΑΤΟΣ 240px) */}
                    <line x1="610" y1="65" x2="510" y2="250" stroke="#64748b" strokeWidth="3" />
                    <line x1="610" y1="65" x2="710" y2="250" stroke="#64748b" strokeWidth="3" />
                    <path d="M 490 250 Q 610 290 730 250 Z" fill="#059669" />
                    <rect x="490" y="248" width="240" height="5" fill="#047857" rx="2" />

                    {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΤΟ ΚΟΥΤΙ x (ΣΤΑ ΑΡΙΣΤΕΡΑ ΤΟΥ ΔΙΣΚΟΥ ΣΤΟ x = 60) */}
                    <g transform="translate(60, 192)">
                      <rect width="56" height="56" rx="14" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
                      <text x="28" y="34" fill="#451a03" fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                      <text x="28" y="47" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">ΚΟΥΤΙ</text>
                    </g>

                    {/* 6. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ a (ΞΕΚΙΝΟΥΝ ΑΠΟ ΤΟ x = 150 ΜΕ ΚΑΘΑΡΟ ΚΕΝΟ) */}
                    {currentStep < 3 && leftBallsPos.map((pos, i) => (
                      <g key={`lball-${i}`} className="transition-all duration-500">
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={BALL_RADIUS}
                          fill={currentStep === 2 ? "#ef4444" : "#3b82f6"}
                          stroke={currentStep === 2 ? "#b91c1c" : "#1d4ed8"}
                          strokeWidth="2"
                        />
                        <text x={pos.x} y={pos.y + 4} fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">1</text>
                      </g>
                    ))}

                    {/* 7. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ b (ΣΤΑΘΕΡΑ ΚΕΝΤΡΑΡΙΣΜΕΝΕΣ) */}
                    {rightBalls.map((ball) => {
                      if (currentStep === 3 && ball.isRemoved) return null;

                      const isHighlighted = currentStep === 2 && ball.isRemoved;

                      return (
                        <g key={`rball-${ball.id}`} className="transition-all duration-500">
                          <circle
                            cx={ball.x}
                            cy={ball.y}
                            r={BALL_RADIUS}
                            fill={isHighlighted ? "#ef4444" : "#10b981"}
                            stroke={isHighlighted ? "#b91c1c" : "#047857"}
                            strokeWidth="2"
                          />
                          <text x={ball.x} y={ball.y + 4} fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">1</text>
                        </g>
                      );
                    })}

                    {/* Ετικέτες κάτω από τους δίσκους */}
                    <text x="150" y="325" fill="#1e3a8a" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 3 ? "Μόνο το Κουτί x" : `x ＋ ${activeA} μπάλες`}
                    </text>

                    <text x="610" y="325" fill="#064e3b" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 3 ? `Απέμειναν ${exactSolution} μπάλες` : `Σύνολο: ${activeB} μπάλες`}
                    </text>
                  </svg>
                </div>

                {/* ACTION BAR ΓΙΑ ΜΕΤΑΒΑΣΗ ΣΤΑ ΒΗΜΑΤΑ */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev - 1); }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-black rounded-xl border border-slate-200 transition"
                  >
                    ⬅️ Προηγούμενο
                  </button>

                  <div className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 sm:px-5 py-2 rounded-xl border border-indigo-200">
                    Βήμα {currentStep} από 3
                  </div>

                  <button
                    type="button"
                    disabled={currentStep === 3}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev + 1); }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95"
                  >
                    Επόμενο ➡️
                  </button>
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 Συμπέρασμα: Αφαιρώντας {activeA} μπάλες και από τους δύο δίσκους, βρίσκουμε ότι το <strong>κουτί x περιέχει ακριβώς {exactSolution} μπάλες (x = {activeB} - {activeA} = {exactSolution})</strong>!
              </div>

            </div>

          </div>
        </div>

        {/* 5. BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς λύνουμε μια εξίσωση πρόσθεσης με τη βοήθεια της ζυγαριάς; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
