import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο τιμών για το διαδραστικό εργαστήριο
const MAX_LIMIT = 500;

const PRESETS = [
  { a: 15, b: 40, label: "x ＋ 15 ＝ 40 (x ＝ 25)" },
  { a: 28, b: 70, label: "28 ＋ x ＝ 70 (x ＝ 42)" },
  { a: 120, b: 350, label: "x ＋ 120 ＝ 350 (x ＝ 230)" },
  { a: 45, b: 100, label: "45 ＋ x ＝ 100 (x ＝ 55)" }
];

export default function AgnostosKaiProsthesiPage() {
  // Παράμετροι της εξίσωσης: x + a = b
  const [paramA, setParamA] = useState(15);
  const [paramB, setParamB] = useState(40);

  // Δοκιμαστική τιμή του χρήστη για το x στη ζυγαριά
  const [guessX, setGuessX] = useState(20);

  // Ασφαλείς αριθμητικές τιμές
  const activeA = paramA === '' ? 0 : Number(paramA);
  const activeB = paramB === '' ? 0 : Number(paramB);
  const activeX = guessX === '' ? 0 : Number(guessX);

  // Σωστή μαθηματική λύση: x = b - a
  const exactSolution = Math.max(0, activeB - activeA);

  // Βάρη για τους δύο δίσκους της ζυγαριάς
  const leftWeight = activeX + activeA;
  const rightWeight = activeB;
  const isBalanced = leftWeight === rightWeight;
  const tiltAngle = Math.max(-12, Math.min(12, (rightWeight - leftWeight) * 0.8));

  // Έλεγχος εισαγωγής
  const handleInputChange = (setter, val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_LIMIT) return;
    setter(n);
  };

  const adjustValue = (setter, currentVal, amount, min = 0) => {
    const next = (Number(currentVal) || 0) + amount;
    if (next >= min && next <= MAX_LIMIT) {
      setter(next);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Εξισώσεις: Άγνωστος Προσθετέος - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία για την επίλυση εξισώσεων όπου ο άγνωστος είναι προσθετέος για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
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

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 33
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  33. Εξισώσεις: Ο Άγνωστος είναι Προσθετέος ($x + \alpha = \beta$)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο προσθετέο ($x$)</strong> σε μια εξίσωση πρόσθεσης κάνοντας την <strong>αντίστροφη πράξη (αφαίρεση)</strong>: αφαιρούμε τον γνωστό προσθετέο από το άθροισμα ($x = \beta - \alpha$)!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην επίλυση εξισώσεων πρόσθεσης!</p>
                <Link
                  href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Τι είναι η Εξίσωση;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong>Εξίσωση</strong> είναι μια μαθηματική ισότητα που περιέχει έναν <strong>άγνωστο αριθμό ($x$)</strong>. Λειτουργεί ακριβώς όπως μια <strong>ζυγαριά σε ισορροπία</strong>!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  x ＋ 15 ＝ 40
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Ο Κανόνας Επίλυσης</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Για να βρούμε τον άγνωστο προσθετέο, <strong>αφαιρούμε τον γνωστό προσθετέο από το άθροισμα</strong>:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  x ＝ 40 － 15 ＝ <strong className="text-indigo-700 font-black">25</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Επαλήθευση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Βάζουμε στη θέση του $x$ τον αριθμό που βρήκαμε και ελέγχουμε αν η ισότητα είναι σωστή:
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  25 ＋ 15 ＝ 40 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Η Ζυγαριά των Εξισώσεων
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε την εξίσωση, δοκίμασε τιμές για το $x$ ή πάτα «Αυτόματη Επίλυση» για να δεις τη ζυγαριά να ισορροπεί τέλεια!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ: x + a = b */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      ⚙️ Ρύθμιση Εξίσωσης: x ＋ α ＝ β
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      {/* ΓΝΩΣΤΟΣ ΠΡΟΣΘΕΤΕΟΣ (a) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Προσθετέος (α)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setParamA, paramA, -5, 0)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-200 rounded">-</button>
                          <input
                            type="text"
                            value={paramA}
                            onChange={(e) => handleInputChange(setParamA, e.target.value)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600 bg-transparent"
                          />
                          <button type="button" onClick={() => adjustValue(setParamA, paramA, 5, 0)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-200 rounded">+</button>
                        </div>
                      </div>

                      {/* ΑΘΡΟΙΣΜΑ (b) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Άθροισμα (β)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setParamB, paramB, -5, activeA)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-200 rounded">-</button>
                          <input
                            type="text"
                            value={paramB}
                            onChange={(e) => handleInputChange(setParamB, e.target.value)}
                            className="w-full text-center font-mono font-black text-base outline-none text-emerald-600 bg-transparent"
                          />
                          <button type="button" onClick={() => adjustValue(setParamB, paramB, 5, activeA)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-200 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ΡΥΘΜΙΣΗ ΔΟΚΙΜΑΣΤΙΚΟΥ X ΓΙΑ ΤΗ ΖΥΓΑΡΙΑ */}
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                        🔍 Δοκίμασε τιμή για το x:
                      </span>
                      <span className="text-xs font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                        x ＝ {activeX}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => adjustValue(setGuessX, guessX, -1, 0)} 
                        className="w-10 py-1.5 bg-white hover:bg-slate-100 text-amber-800 font-black rounded-xl border border-amber-200 text-base shadow-xs"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0"
                        max={Math.max(60, activeB + 10)}
                        value={activeX}
                        onChange={(e) => setGuessX(Number(e.target.value))}
                        className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                      <button 
                        type="button" 
                        onClick={() => adjustValue(setGuessX, guessX, 1, 0)} 
                        className="w-10 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-base shadow-md"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGuessX(exactSolution)}
                      className="w-full py-2 bg-white hover:bg-amber-100/50 text-amber-900 font-black text-xs rounded-xl border border-amber-300 transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>⚡</span> Βάλε τη Σωστή Λύση (x ＝ {exactSolution})
                    </button>
                  </div>

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Έτοιμες Εξισώσεις:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setParamA(p.a);
                            setParamB(p.b);
                            setGuessX(Math.max(0, p.b - p.a));
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο προσθετέο $x$, κάνουμε πάντα <strong>αφαίρεση: $x = \beta - \alpha$</strong>!
                </div>
              </div>

              {/* RIGHT: BALANCE SCALE & MATHEMATICAL SOLUTION (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΕΠΙΛΥΣΗΣ */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-around gap-4 text-center">
                    
                    {/* Αρχική Εξίσωση */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Αρχική Εξίσωση</span>
                      <div className="font-mono text-2xl font-black text-slate-800">
                        <span className="text-amber-600">x</span> ＋ <span className="text-blue-600">{activeA}</span> ＝ <span className="text-emerald-600">{activeB}</span>
                      </div>
                    </div>

                    <span className="text-2xl text-indigo-500 font-black">➔</span>

                    {/* Βήμα Επίλυσης */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Αντίστροφη Πράξη (Αφαίρεση)</span>
                      <div className="font-mono text-2xl font-black text-slate-800">
                        <span className="text-amber-600">x</span> ＝ <span className="text-emerald-600">{activeB}</span> － <span className="text-blue-600">{activeA}</span>
                      </div>
                    </div>

                    <span className="text-2xl text-indigo-500 font-black">➔</span>

                    {/* Τελική Λύση */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 shadow-sm space-y-1">
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Τελική Λύση</span>
                      <div className="font-mono text-2xl font-black text-emerald-700">
                        x ＝ {exactSolution}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. ΔΙΑΔΡΑΣΤΙΚΗ ΖΥΓΑΡΙΑ ΙΣΟΡΡΟΠΙΑΣ (BALANCE SCALE SVG) */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      ⚖️ Ζυγαριά Ισορροπίας (Αριστερό Μέλος vs Δεξί Μέλος):
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                      isBalanced 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {isBalanced ? '✔️ Ισορροπία (Ισότητα)' : '❌ Ανισορροπία'}
                    </span>
                  </div>

                  <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
                    <svg width="340" height="150" viewBox="0 0 340 150" className="overflow-visible transition-transform duration-500">
                      {/* Βάση Ζυγαριάς */}
                      <polygon points="170,110 145,145 195,145" className="fill-slate-700" />
                      <rect x="167" y="50" width="6" height="65" className="fill-slate-600" />
                      <circle cx="170" cy="50" r="6" className="fill-slate-900" />

                      {/* Κινούμενος Ζυγός (Beam) */}
                      <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: '170px 50px', transition: 'transform 0.5s ease-out' }}>
                        <rect x="30" y="47" width="280" height="6" rx="3" className="fill-slate-800" />

                        {/* Αριστερός Δίσκος (x + a) */}
                        <line x1="50" y1="50" x2="35" y2="95" stroke="#64748b" strokeWidth="2" />
                        <line x1="50" y1="50" x2="65" y2="95" stroke="#64748b" strokeWidth="2" />
                        <path d="M 20 95 Q 50 110 80 95 Z" className="fill-blue-600 shadow-md" />
                        
                        {/* Δεξιός Δίσκος (b) */}
                        <line x1="290" y1="50" x2="275" y2="95" stroke="#64748b" strokeWidth="2" />
                        <line x1="290" y1="50" x2="305" y2="95" stroke="#64748b" strokeWidth="2" />
                        <path d="M 260 95 Q 290 110 320 95 Z" className="fill-emerald-600 shadow-md" />
                      </g>
                    </svg>

                    {/* Ετικέτες Βαρών κάτω από τους δίσκους */}
                    <div className="flex justify-between w-full max-w-xs text-xs font-mono font-black mt-2">
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl shadow-xs text-center">
                        <div>Αριστερά: {activeX} ＋ {activeA}</div>
                        <div className="text-base text-blue-600">＝ {leftWeight}</div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl shadow-xs text-center">
                        <div>Δεξιά: {activeB}</div>
                        <div className="text-base text-emerald-600">＝ {rightWeight}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Συμπέρασμα: Στην εξίσωση <strong>x ＋ {activeA} ＝ {activeB}</strong>, ο άγνωστος ισούται με <strong>x ＝ {activeB} － {activeA} ＝ {exactSolution}</strong>.
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να λύνεις εξισώσεις όπου ο άγνωστος είναι προσθετέος; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/33-agnostos-kai-prosthesi-ask"
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
