import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστο όριο για τα sliders
const MAX_VAL = 50;

const PRESETS = [
  { a: 10, b: 4, label: "10 － x ＝ 4 (x ＝ 6)" },
  { a: 20, b: 12, label: "20 － x ＝ 12 (x ＝ 8)" },
  { a: 35, b: 15, label: "35 － x ＝ 15 (x ＝ 20)" },
  { a: 18, b: 7, label: "18 － x ＝ 7 (x ＝ 11)" },
  { a: 50, b: 40, label: "50 － x ＝ 40 (x ＝ 10)" }
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
    const nextA = Number(val);
    setParamA(nextA);
    if (activeB >= nextA) {
      setParamB(Math.max(1, nextA - 1));
    }
  };

  const handleBChange = (val) => {
    const nextB = Number(val);
    if (nextB < activeA) {
      setParamB(nextB);
    }
  };

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Εξισώσεις: Άγνωστος Αφαιρετέος (α - x = β) - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία με sliders και γραμμικές μπάρες σύγκρισης χώρου για την επίλυση εξισώσεων όπου ο άγνωστος είναι αφαιρετέος (α - x = β) για τη ΣΤ' Δημοτικού." />
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
                    🎓 ΣΤ' Δημοτικου
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενοτητα 35
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  35. Εξισώσεις: Ο Άγνωστος είναι Αφαιρετέος (α - x = β)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς βρίσκουμε τον <strong>άγνωστο αφαιρετέο (x)</strong>: από το αρχικό ολικό μέγεθος α αφαιρούμε ένα κομμάτι x και μένει το β. Για να βρούμε πόσο ήταν το x, <strong>αφαιρούμε το γνωστό κομμάτι από το ολικό (x = α - β)</strong>!
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
                  Στην εξίσωση α - x = β, το x είναι ο <strong>αφαιρετέος</strong> (το κομμάτι που αφαιρείται ή κόβεται από το αρχικό μέγεθος α).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  10 － x ＝ 4 (x ＝ το κομμάτι που κόπηκε)
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
                  Για να βρούμε το κομμάτι που αφαιρέθηκε (x), <strong>αφαιρούμε το κομμάτι που έμεινε (β) από το ολικό (α)</strong>:
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
                  Ελέγχουμε αν το υπόλοιπο είναι σωστό: 10 - 6 = 4! Τα δύο κομμάτια x + β συμπληρώνουν ακριβώς το ολικό μήκος α.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  6 ＋ 4 ＝ 10 (Σωστό! ✔️)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND ΜΕ SLIDERS & ΜΠΑΡΕΣ ΧΩΡΟΥ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Σύγκριση Μήκους και Χώρου
                </h2>
                <p className="text-gray-500 text-sm">
                  Μετακίνησε τα sliders για το α και το β και δες πώς οι μπάρες αποκαλύπτουν αμέσως το μήκος του άγνωστου x!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: SLIDERS & CONTROLS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-5">
                  
                  {/* SLIDER A: ΟΛΙΚΟ ΜΗΚΟΣ (ΜΕΙΩΤΕΟΣ) */}
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-blue-900 tracking-wider">
                        🔵 Ολικό Μέγεθος (α)
                      </span>
                      <span className="font-mono font-black text-sm text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                        α ＝ {activeA}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        disabled={activeA <= activeB + 1}
                        onClick={() => handleAChange(activeA - 1)}
                        className="w-8 py-1 bg-white hover:bg-slate-100 disabled:opacity-30 text-blue-700 font-black rounded-lg border border-blue-200 text-sm shadow-xs"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="2"
                        max={MAX_VAL}
                        value={activeA}
                        onChange={(e) => handleAChange(e.target.value)}
                        className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                      <button 
                        type="button" 
                        disabled={activeA >= MAX_VAL}
                        onClick={() => handleAChange(activeA + 1)}
                        className="w-8 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white font-black rounded-lg text-sm shadow-md"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SLIDER B: ΚΟΜΜΑΤΙ ΠΟΥ ΕΜΕΙΝΕ (ΔΙΑΦΟΡΑ) */}
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-emerald-900 tracking-wider">
                        🟢 Κομμάτι που έμεινε (β)
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        β ＝ {activeB}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        disabled={activeB <= 1}
                        onClick={() => handleBChange(activeB - 1)}
                        className="w-8 py-1 bg-white hover:bg-slate-100 disabled:opacity-30 text-emerald-700 font-black rounded-lg border border-emerald-200 text-sm shadow-xs"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="1"
                        max={activeA - 1}
                        value={activeB}
                        onChange={(e) => handleBChange(e.target.value)}
                        className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                      <button 
                        type="button" 
                        disabled={activeB >= activeA - 1}
                        onClick={() => handleBChange(activeB + 1)}
                        className="w-8 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white font-black rounded-lg text-sm shadow-md"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-1 border-t border-slate-200">
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

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Κανόνας:</strong> Για να βρούμε τον άγνωστο αφαιρετέο x, κάνουμε πάντα <strong>αφαίρεση: x = α - β</strong>!
                </div>
              </div>

              {/* RIGHT: COMPARATIVE SPACE BARS VISUALIZER (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[540px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                  <div className="font-mono text-2xl md:text-3xl font-black text-slate-800">
                    <span className="text-blue-600">{activeA}</span>
                    <span className="text-slate-400 mx-2">－</span>
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                    <span className="text-slate-400 mx-2">＝</span>
                    <span className="text-emerald-600">{activeB}</span>
                  </div>

                  <div className="font-mono text-base md:text-lg font-black text-indigo-700 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                    x ＝ {activeA} － {activeB} ＝ <strong className="text-amber-600">{exactSolution}</strong>
                  </div>
                </div>

                {/* 2. ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΧΩΡΟΥ (2 ΠΑΡΑΛΛΗΛΕΣ ΜΠΑΡΕΣ) */}
                <div className="space-y-6 bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-inner">
                  
                  {/* ΕΠΑΝΩ ΜΠΑΡΑ: 1ο ΜΕΛΟΣ (ΟΛΙΚΟ α = x + b) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black tracking-wider">
                      <span className="text-blue-900">1ο Μέλος: Αρχικό Μέγεθος (α ＝ {activeA})</span>
                      <span className="text-slate-500 font-mono">100% του χωρου</span>
                    </div>

                    {/* Η μπάρα χωρισμένη σε x (άγνωστο) και b */}
                    <div className="w-full h-14 bg-slate-200 rounded-2xl p-1 border-2 border-slate-300 shadow-inner flex gap-1">
                      
                      {/* ΤΜΗΜΑ x (Αφαιρετέος / Κομμάτι που αφαιρείται - ΔΕΝ γράφει την απάντηση, μόνο x) */}
                      <div 
                        style={{ width: `${percentX}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl transition-all duration-300 flex items-center justify-center text-slate-950 font-mono font-black text-base md:text-lg border-2 border-dashed border-amber-700 shadow-sm relative overflow-hidden"
                      >
                        <span className="z-10">x</span>
                        <div className="absolute inset-0 bg-white/10" />
                      </div>

                      {/* ΤΜΗΜΑ b (Κομμάτι που απομένει) */}
                      <div 
                        style={{ width: `${percentB}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center text-white font-mono font-black text-sm md:text-base shadow-sm"
                      >
                        <span>β ＝ {activeB}</span>
                      </div>

                    </div>

                    <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1 font-mono">
                      <span className="text-amber-700">▲ Αφαιρέθηκε το x</span>
                      <span className="text-emerald-700">▲ Απομένει (β ＝ {activeB})</span>
                    </div>
                  </div>

                  {/* ΚΑΤΩ ΜΠΑΡΑ: 2ο ΜΕΛΟΣ (ΔΙΑΦΟΡΑ b & ΥΠΟΛΟΓΙΣΜΟΣ x = a - b) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs font-black tracking-wider">
                      <span className="text-emerald-900">2ο Μέλος: Τελικό Αποτέλεσμα (β ＝ {activeB})</span>
                      <span className="text-slate-500 font-mono">{Math.round(percentB)}% του ολικου</span>
                    </div>

                    {/* Η μπάρα του b στοιχισμένη ακριβώς δεξιά κάτω από το τμήμα b */}
                    <div className="w-full h-14 bg-slate-200/80 rounded-2xl p-1 border-2 border-slate-300 shadow-inner flex justify-end">
                      
                      {/* Κενό / Διαφορά που αντιστοιχεί στο x = a - b */}
                      <div 
                        style={{ width: `${percentX}%` }} 
                        className="h-full flex items-center justify-center text-xs md:text-sm font-black text-amber-700 bg-amber-50/60 border-2 border-dashed border-amber-400 rounded-xl mr-1 font-mono shadow-inner"
                      >
                        <span>x ＝ {exactSolution}</span>
                      </div>

                      {/* Το γνωστό κομμάτι b */}
                      <div 
                        style={{ width: `${percentB}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center text-white font-mono font-black text-sm md:text-base shadow-sm"
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
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Συμπέρασμα: Στην εξίσωση <strong>{activeA} － x ＝ {activeB}</strong>, ο άγνωστος αφαιρετέος ισούται με <strong>x ＝ {activeA} － {activeB} ＝ {exactSolution}</strong>!
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
