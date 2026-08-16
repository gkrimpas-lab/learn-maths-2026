import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DinameisDekaPage() {
  const [activeTab, setActiveTab] = useState('megaloi'); // 'megaloi' (10, 100, 1000) ή 'mikroi' (0,1, 0,01, 0,001)
  const [inputNum, setInputNum] = useState("34,56");
  const [multiplier, setMultiplier] = useState(10); // 10, 100, 1000 ή 0.1, 0.01, 0.001

  const presets = [
    { label: '💶 34,56 € (Τιμή)', val: '34,56' },
    { label: '📏 2,4 μ. (Μήκος)', val: '2,4' },
    { label: '⚖️ 0,75 κιλά (Βάρος)', val: '0,75' },
    { label: '🔢 125 (Φυσικός)', val: '125' }
  ];

  const sanitizeInput = (val) => {
    let formatted = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(',');
    let intPart = (parts[0] || '').slice(0, 4);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 3);
      return `${intPart},${decPart}`;
    }
    return intPart;
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const valNum = parseVal(inputNum);
  const rawResult = valNum * multiplier;

  // Μορφοποίηση αποτελέσματος χωρίς floating point ατέλειες
  const formatResult = () => {
    if (valNum === 0) return "0";
    if (activeTab === 'megaloi') {
      const decimals = Math.max(0, (inputNum.split(',')[1] || '').length - (multiplier === 10 ? 1 : multiplier === 100 ? 2 : 3));
      return rawResult.toFixed(decimals).replace('.', ',');
    } else {
      const addedDec = multiplier === 0.1 ? 1 : multiplier === 0.01 ? 2 : 3;
      const currentDec = (inputNum.split(',')[1] || '').length;
      return rawResult.toFixed(currentDec + addedDec).replace('.', ',');
    }
  };

  const formattedResult = formatResult();

  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      if (multiplier === 10) return { steps: 1, direction: 'δεξιά', zeros: '1 μηδενικό' };
      if (multiplier === 100) return { steps: 2, direction: 'δεξιά', zeros: '2 μηδενικά' };
      return { steps: 3, direction: 'δεξιά', zeros: '3 μηδενικά' };
    } else {
      if (multiplier === 0.1) return { steps: 1, direction: 'αριστερά', zeros: '1 δεκαδικό' };
      if (multiplier === 0.01) return { steps: 2, direction: 'αριστερά', zeros: '2 δεκαδικά' };
      return { steps: 3, direction: 'αριστερά', zeros: '3 δεκαδικά' };
    }
  };

  const shift = getShiftInfo();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Πολλαπλασιασμός με Δυνάμεις του 10 - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} 2xl:max-w-7xl py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl 2xl:text-3xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} 2xl:max-w-7xl py-8 md:py-12 space-y-10 2xl:space-y-14`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 2xl:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 7
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  7. Πολλαπλασιασμός με 10, 100, 1000... και 0,1, 0,01, 0,001...
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε τον «χρυσό κανόνα» μετατόπισης της <strong>υποδιαστολής</strong>! Υπολόγισε γινόμενα στο δευτερόλεπτο χωρίς κάθετη πράξη, απλά μετακινώντας την υποδιαστολή δεξιά ή αριστερά.
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            <div className="bg-blue-50/80 border border-blue-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Με 10, 100, 1000...</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μεγαλώνει</strong>. Μετακινούμε την υποδιαστολή <strong>δεξιά</strong> τόσες θέσεις όσα είναι τα μηδενικά ($1, 2, 3$). Αν λείπουν ψηφία, συμπληρώνουμε μηδενικά στο τέλος.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p>3,45 × 10 ＝ <strong className="text-blue-700">34,5</strong></p>
                <p>3,45 × 1000 ＝ <strong className="text-blue-700">3450</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Με 0,1, 0,01, 0,001...</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ο αριθμός <strong>μικραίνει</strong> (λειτουργεί όπως η διαίρεση). Μετακινούμε την υποδιαστολή <strong>αριστερά</strong> τόσες θέσεις όσα τα δεκαδικά ψηφία ($1, 2, 3$).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p>48 × 0,1 ＝ <strong className="text-indigo-700">4,8</strong></p>
                <p>48 × 0,01 ＝ <strong className="text-indigo-700">0,48</strong></p>
              </div>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Συμπλήρωση Μηδενικών</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν τελειώνουν τα διαθέσιμα ψηφία κατά τη μετακίνηση, βάζουμε <strong>μηδενικά (0)</strong> για να κρατήσουν τις απαραίτητες θέσεις.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center font-bold">
                <p>5 × 0,01 ＝ 0,05 • 0,2 × 100 ＝ 20</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Μετατόπισης Υποδιαστολής
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Πληκτρολόγησε έναν αριθμό, διάλεξε δύναμη του 10 και παρατήρησε το βήμα της υποδιαστολής!
                </p>
              </div>

              {/* TABS ΕΝΑΛΛΑΓΗΣ */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('megaloi');
                    setMultiplier(10);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🚀 × 10, 100, 1000 (Δεξιά)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('mikroi');
                    setMultiplier(0.1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    activeTab === 'mikroi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📉 × 0,1, 0,01, 0,001 (Αριστερά)
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE STACK */}
            <div className="space-y-6">

              {/* ROW 1: CONTROLS & COMPUTATION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* CONTROLS (7 COLS) */}
                <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                  <div className="space-y-2">
                    <label className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                      Πληκτρολόγησε Αριθμό (π.χ. 34,56):
                    </label>
                    <input
                      type="text"
                      value={inputNum}
                      onChange={(e) => setInputNum(sanitizeInput(e.target.value))}
                      className="text-2xl 2xl:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none w-full text-blue-600 font-mono"
                      placeholder="π.χ. 34,56"
                    />
                  </div>

                  {/* PRESETS */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputNum(p.val)}
                        className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] 2xl:text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition shadow-sm"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* MULTIPLIER BUTTONS */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Επίλεξε Πολλαπλασιαστή:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {activeTab === 'megaloi' ? (
                        [10, 100, 1000].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMultiplier(m)}
                            className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono ${
                              multiplier === m
                                ? 'bg-blue-600 text-white border-blue-600 scale-105'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            × {m}
                          </button>
                        ))
                      ) : (
                        [0.1, 0.01, 0.001].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMultiplier(m)}
                            className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono ${
                              multiplier === m
                                ? 'bg-indigo-600 text-white border-indigo-600 scale-105'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            × {m.toString().replace('.', ',')}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC RESULT CARD (5 COLS) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 2xl:p-6 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] 2xl:text-xs font-black text-amber-400 uppercase tracking-widest block">
                    ✨ Τελικό Γινόμενο:
                  </span>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl 2xl:text-3xl font-black font-mono">
                    <span className="text-white">{inputNum || "0"}</span>
                    <span className="text-amber-400 font-sans">×</span>
                    <span className="text-cyan-300">{multiplier.toString().replace('.', ',')}</span>
                    <span className="text-slate-400 font-sans">＝</span>
                    <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-xl shadow-md">
                      {formattedResult}
                    </span>
                  </div>

                  <div className="bg-white/10 px-3.5 py-2 rounded-xl text-xs text-blue-100 border border-white/15">
                    📍 Μετακίνηση <strong>{shift.steps} {shift.steps === 1 ? 'θέση' : 'θέσεις'}</strong> προς τα <strong>{shift.direction}</strong>
                  </div>
                </div>

              </div>

              {/* ROW 2: VISUAL GUIDE OF DECIMAL POINT SHIFTING */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 2xl:p-8 rounded-2xl flex flex-col items-center justify-between space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    🧭 Οπτικός Οδηγός Μετατόπισης Υποδιαστολής (SVG Steps)
                  </span>
                  <p className="text-xs text-slate-500">
                    Παρατήρησε τα βέλη που δείχνουν το άλμα της υποδιαστολής ανάμεσα στα ψηφία!
                  </p>
                </div>

                {/* VISUAL SHIFT BOX */}
                <div className="w-full max-w-xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center gap-6 font-mono text-2xl md:text-3xl font-black">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-sans font-bold text-slate-400 mb-1">Αρχικός</span>
                      <span className="bg-slate-100 text-slate-800 px-4 py-2 rounded-xl border border-slate-200">
                        {inputNum || "0"}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs font-sans font-bold text-amber-600 mb-1">
                        {shift.steps} {shift.steps === 1 ? 'άλμα' : 'άλματα'} {shift.direction}
                      </span>
                      <span className="text-2xl text-amber-500">
                        {shift.direction === 'δεξιά' ? '➔' : '⬅️'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs font-sans font-bold text-emerald-600 mb-1">Νέος Αριθμός</span>
                      <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-300 shadow-sm">
                        {formattedResult}
                      </span>
                    </div>
                  </div>

                  {/* SVG Shift Diagram */}
                  <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-center">
                    <svg viewBox="0 0 320 60" className="w-full max-w-sm h-14">
                      {/* Base Line */}
                      <line x1="20" y1="45" x2="300" y2="45" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                      
                      {/* Jump Arc */}
                      <path
                        d={
                          shift.direction === 'δεξιά'
                            ? "M 100 45 Q 160 10 220 45"
                            : "M 220 45 Q 160 10 100 45"
                        }
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                      />
                      <polygon
                        points={
                          shift.direction === 'δεξιά'
                            ? "220,45 210,38 213,46"
                            : "100,45 110,38 107,46"
                        }
                        fill="#f59e0b"
                      />
                      <text x="160" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#d97706">
                        {shift.steps} × (θέση {shift.direction})
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs md:text-sm text-blue-900 font-medium text-center max-w-2xl">
                  💡 <strong>Τι συνέβη:</strong> Πολλαπλασιάζοντας με το <strong className="text-blue-700 font-mono">{multiplier.toString().replace('.', ',')}</strong>, η υποδιαστολή μετακινήθηκε <strong>{shift.steps} {shift.steps === 1 ? 'θέση' : 'θέσεις'} προς τα {shift.direction}</strong>.
                  {activeTab === 'megaloi'
                    ? " Αν τελειώσουν τα δεκαδικά ψηφία, συμπληρώνουμε μηδενικά στο τέλος!"
                    : " Αν τελειώσουν τα ακέραια ψηφία, βάζουμε 0, στην αρχή!"}
                </div>
              </div>

              {/* ROW 3: STEP-BY-STEP SUMMARY */}
              <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5">
                    🧬 Συνοπτικός Κανόνας Νοερών Υπολογισμών
                  </span>
                  <span className="text-[10px] 2xl:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-blue-800 uppercase block">1. Πολλαπλασιασμός με 10, 100, 1000...</span>
                    <ul className="space-y-1">
                      <li>• × 10 ➔ 1 θέση δεξιά (<code className="font-bold">4,5 × 10 = 45</code>)</li>
                      <li>• × 100 ➔ 2 θέσεις δεξιά (<code className="font-bold">4,5 × 100 = 450</code>)</li>
                      <li>• × 1000 ➔ 3 θέσεις δεξιά (<code className="font-bold">4,5 × 1000 = 4500</code>)</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-indigo-800 uppercase block">2. Πολλαπλασιασμός με 0,1, 0,01, 0,001...</span>
                    <ul className="space-y-1">
                      <li>• × 0,1 ➔ 1 θέση αριστερά (<code className="font-bold">25 × 0,1 = 2,5</code>)</li>
                      <li>• × 0,01 ➔ 2 θέσεις αριστερά (<code className="font-bold">25 × 0,01 = 0,25</code>)</li>
                      <li>• × 0,001 ➔ 3 θέσεις αριστερά (<code className="font-bold">25 × 0,001 = 0,025</code>)</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Κατανόησες πώς μετακινείται η υποδιαστολή με τις δυνάμεις του 10; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base 2xl:text-lg whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER (OUTSIDE MAIN) */}
      <footer className="bg-gray-800 text-gray-400 py-6 2xl:py-8 text-center text-sm 2xl:text-base w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
