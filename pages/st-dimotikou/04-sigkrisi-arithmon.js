// pages/st-dimotikou/04-sigkrisi-arithmon.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SigkrisiArithmonPage() {
  const [numA, setNumA] = useState('14,75');
  const [numB, setNumB] = useState('14,8');

  const presets = [
    { label: '⚖️ 14,75 vs 14,8 (Δεκαδικά)', a: '14,75', b: '14,8' },
    { label: '📏 3,450 vs 3,45 (Ισοδύναμα)', a: '3,450', b: '3,45' },
    { label: '🔢 12.450 vs 9.890 (Φυσικοί)', a: '12450', b: '9890' },
    { label: '💶 0,09 € vs 0,1 € (Λεπτά)', a: '0,09', b: '0,1' }
  ];

  // Καθαρισμός και μετατροπή σε αριθμητικές τιμές
  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const sanitizeInput = (val) => {
    let formatted = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(',');
    if (parts.length > 2) {
      formatted = `${parts[0]},${parts.slice(1).join('')}`;
    }
    return formatted;
  };

  const valA = parseVal(numA);
  const valB = parseVal(numB);

  // Σύμβολο και αποτέλεσμα σύγκρισης
  let symbol = '＝';
  let resultText = 'Οι αριθμοί είναι ίσοι';
  let resultColor = 'text-amber-700 bg-amber-50 border-amber-300';
  let tiltDeg = 0;

  if (valA > valB) {
    symbol = '＞';
    resultText = 'Ο πρώτος αριθμός είναι μεγαλύτερος';
    resultColor = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    tiltDeg = -8;
  } else if (valA < valB) {
    symbol = '＜';
    resultText = 'Ο δεύτερος αριθμός είναι μεγαλύτερος';
    resultColor = 'text-blue-800 bg-blue-50 border-blue-300';
    tiltDeg = 8;
  }

  // Ανάλυση ψηφίο προς ψηφίο για την εξήγηση
  const getStepExplanation = () => {
    const cleanA = numA.replace('.', ',');
    const cleanB = numB.replace('.', ',');

    const [intA = '0', decA = ''] = cleanA.split(',');
    const [intB = '0', decB = ''] = cleanB.split(',');

    const intValA = parseInt(intA || '0', 10);
    const intValB = parseInt(intB || '0', 10);

    if (intValA !== intValB) {
      const compSym = intValA > intValB ? '＞' : '＜';
      return `Συγκρίνουμε πρώτα το ακέραιο μέρος: ${intValA} ${compSym} ${intValB}. Επομένως, ${numA} ${compSym} ${numB}.`;
    }

    const maxDecLen = Math.max(decA.length, decB.length);
    const normDecA = decA.padEnd(maxDecLen, '0');
    const normDecB = decB.padEnd(maxDecLen, '0');

    if (normDecA === normDecB) {
      return `Το ακέραιο μέρος είναι ίδιο (${intValA}) και τα δεκαδικά μέρη εξισώνονται με μηδενικά (${normDecA} ＝ ${normDecB}). Άρα οι αριθμοί είναι ίσοι!`;
    }

    for (let i = 0; i < maxDecLen; i++) {
      const d1 = parseInt(normDecA[i], 10);
      const d2 = parseInt(normDecB[i], 10);
      const posName = i === 0 ? 'στα δέκατα' : i === 1 ? 'στα εκατοστά' : 'στα χιλιοστά';

      if (d1 !== d2) {
        const compSym = d1 > d2 ? '＞' : '＜';
        return `Τα ακέραια μέρη είναι ίσα (${intValA}). Συγκρίνουμε ${posName}: ${d1} ${compSym} ${d2} (${intValA},${normDecA} έναντι ${intValB},${normDecB}). Άρα ${numA} ${compSym} ${numB}.`;
      }
    }

    return 'Οι δύο αριθμοί έχουν ακριβώς την ίδια αξία.';
  };

  return (
    <Layout
      title="Σύγκριση και Διάταξη Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς συγκρίνουμε φυσικούς και δεκαδικούς αριθμούς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/04-sigkrisi-arithmon-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 4 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Σύγκριση &amp; Διάταξη Φυσικών και Δεκαδικών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τους κανόνες σύγκρισης για <strong>φυσικούς</strong> και <strong>δεκαδικούς αριθμούς</strong>! Ανακάλυψε πώς συγκρίνουμε ψηφίο-προς-ψηφίο από τα αριστερά προς τα δεξιά και πώς η προσθήκη μηδενικών βοηθάει στην ακριβή σύγκριση.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κανόνες Διάταξης &amp; Διαδραστική Ζυγαριά Σύγκρισης</span>
            </div>
            <Link
              href="/st-dimotikou/04-sigkrisi-arithmon-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Κανόνες Σύγκρισης σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς συγκρίνουμε φυσικούς, πώς δεκαδικούς και πώς αποφεύγουμε τις συνηθισμένες παγίδες.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Φυσικοί Αριθμοί</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύγκριση Φυσικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν δύο φυσικοί αριθμοί έχουν <strong>διαφορετικό πλήθος ψηφίων</strong>, μεγαλύτερος είναι εκείνος με τα περισσότερα ψηφία. Αν έχουν τα ίδια, συγκρίνουμε από αριστερά προς τα δεξιά.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center">
                  <p><strong className="text-blue-700">12.300</strong> ＞ <strong className="text-slate-800">9.800</strong> (5 ψηφία έναντι 4)</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Στους φυσικούς αριθμούς, περισσότερα ψηφία σημαίνουν πάντα μεγαλύτερη αξία.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Δεκαδικοί Αριθμοί</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύγκριση Δεκαδικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Συγκρίνουμε πρώτα τα <strong>ακέραια μέρη</strong>. Αν είναι ίσα, συγκρίνουμε διαδοχικά τα <strong>δέκατα</strong>, μετά τα <strong>εκατοστά</strong> και τέλος τα <strong>χιλιοστά</strong>.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center">
                  <p><strong className="text-indigo-700">14,8</strong> ＞ <strong className="text-slate-800">14,75</strong> (8 δέκατα ＞ 7 δέκατα)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Στους δεκαδικούς, τα περισσότερα ψηφία ΔΕΝ σημαίνουν απαραίτητα μεγαλύτερο αριθμό!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Χρυσός Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Κόλπο των Μηδενικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να μη μπερδευόμαστε, συμπληρώνουμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους ώστε οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>14,80 ＞ 14,75 (80 εκατοστά ＞ 75 εκατοστά)</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Εξισώνοντας τα δεκαδικά ψηφία, η σύγκριση γίνεται άμεση και αλάνθαστη.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΣΥΓΚΡΙΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Σύγκρισης Αριθμών
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε δύο αριθμούς (φυσικούς ή δεκαδικούς) ή επίλεξε ένα έτοιμο παράδειγμα για να δεις τη ζυγαριά σε δράση!
              </p>
            </div>

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNumA(preset.a);
                    setNumB(preset.b);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUTS & DYNAMIC READOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* INPUTS A & B (7 COLS) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-xs 2xl:text-sm font-black text-emerald-800 tracking-wider block uppercase">
                      1ος Αριθμος (Α):
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={numA}
                      onChange={(e) => setNumA(sanitizeInput(e.target.value))}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                      placeholder="π.χ. 14,75"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs 2xl:text-sm font-black text-blue-800 tracking-wider block uppercase">
                      2ος Αριθμος (Β):
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={numB}
                      onChange={(e) => setNumB(sanitizeInput(e.target.value))}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-300 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                      placeholder="π.χ. 14,8"
                    />
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  💡 Ακόμα κι αν πατήσεις τελεία ( . ), μετατρέπεται αυτόματα στο ελληνικό κόμμα ( , ).
                </p>
              </div>

              {/* DYNAMIC RESULT BADGE (5 COLS) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  ✨ Σχεση Διαταξης:
                </span>
                
                <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-black font-mono flex-wrap">
                  <span className="text-emerald-400">{numA || '0'}</span>
                  <span className="bg-amber-400 text-slate-900 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-md">
                    {symbol}
                  </span>
                  <span className="text-cyan-300">{numB || '0'}</span>
                </div>

                <span className={`text-xs md:text-sm font-bold px-3 py-1.5 rounded-xl border ${resultColor}`}>
                  {resultText}
                </span>
              </div>

            </div>

            {/* ROW 2: DYNAMIC SVG BALANCE SCALE - 100% FLUID ΧΩΡΙΣ SCROLL */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-between space-y-4 sm:space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                  ⚖️ Διαδραστική Ζυγαριά Αξίας
                </span>
                <p className="text-xs sm:text-sm text-slate-500">
                  Η ζυγαριά γέρνει αυτόματα προς την πλευρά με τη μεγαλύτερη αριθμητική αξία!
                </p>
              </div>

              {/* SVG BALANCE SCALE */}
              <div className="w-full max-w-[420px] aspect-[16/9] bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 220" className="w-full h-full select-none overflow-visible">
                  {/* Stand & Base */}
                  <path d="M185 200 L215 200 L205 70 L195 70 Z" fill="#475569" />
                  <rect x="140" y="195" width="120" height="15" rx="6" fill="#334155" />
                  <circle cx="200" cy="65" r="8" fill="#0f172a" />

                  {/* Tilting Beam & Pans Group */}
                  <g
                    style={{
                      transform: `rotate(${tiltDeg}deg)`,
                      transformOrigin: '200px 65px',
                      transition: 'transform 0.5s ease-out'
                    }}
                  >
                    {/* Central Beam */}
                    <line x1="60" y1="65" x2="340" y2="65" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

                    {/* Left Hangers & Pan (A) */}
                    <line x1="80" y1="65" x2="50" y2="135" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="80" y1="65" x2="110" y2="135" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M40 135 Q80 155 120 135 Z" fill="#059669" />
                    <rect x="45" y="110" width="70" height="25" rx="6" fill="#10b981" />
                    <text x="80" y="127" fontSize="12" fontWeight="900" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                      {numA || '0'}
                    </text>

                    {/* Right Hangers & Pan (B) */}
                    <line x1="320" y1="65" x2="290" y2="135" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="320" y1="65" x2="350" y2="135" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M280 135 Q320 155 360 135 Z" fill="#2563eb" />
                    <rect x="285" y="110" width="70" height="25" rx="6" fill="#3b82f6" />
                    <text x="320" y="127" fontSize="12" fontWeight="900" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                      {numB || '0'}
                    </text>
                  </g>
                </svg>
              </div>

              <div className="bg-white border border-slate-200 px-4 sm:px-6 py-3 rounded-2xl shadow-sm text-center max-w-2xl w-full">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  🔍 Βημα-Βημα Μαθηματικη Εξηγηση:
                </span>
                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-snug">
                  {getStepExplanation()}
                </p>
              </div>
            </div>

            {/* ROW 3: ΟΔΗΓΟΣ ΣΥΓΚΡΙΣΗΣ */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  🧬 Οδηγός Σύγκρισης Ψηφίο-προς-Ψηφίο
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Πλήρης Εμφάνιση
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-blue-800 uppercase tracking-wider block">
                    1. Βηματα για Δεκαδικους:
                  </span>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                    <li>• <strong>Βήμα 1:</strong> Συγκρίνουμε τα ακέραια μέρη (<strong className="text-slate-800">15</strong>,2 ＞ <strong className="text-slate-800">14</strong>,9).</li>
                    <li>• <strong>Βήμα 2:</strong> Αν είναι ίσα, συγκρίνουμε τα δέκατα (7,<strong className="text-slate-800">8</strong> ＞ 7,<strong className="text-slate-800">6</strong>).</li>
                    <li>• <strong>Βήμα 3:</strong> Εξισώνουμε τα ψηφία με μηδενικά (0,4 ＝ 0,40).</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-emerald-800 uppercase tracking-wider block">
                    2. Συνηθισμενη Παγιδα:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Πολλά παιδιά νομίζουν ότι το <strong className="text-rose-600 font-mono">0,75</strong> είναι μεγαλύτερο από το <strong className="text-emerald-700 font-mono">0,8</strong> επειδή το 75 φαίνεται μεγαλύτερο από το 8. Όμως:
                  </p>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-mono font-bold text-center text-slate-800">
                    0,80 (80 εκατοστά) ＞ 0,75 (75 εκατοστά)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Σύγκριση Αριθμών!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τους κανόνες σύγκρισης φυσικών και δεκαδικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/04-sigkrisi-arithmon-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
