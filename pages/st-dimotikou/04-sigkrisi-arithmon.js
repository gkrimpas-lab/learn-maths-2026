import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function SigkrisiArithmonPage() {
  const [numA, setNumA] = useState("14,75");
  const [numB, setNumB] = useState("14,8");

  const presets = [
    { label: '⚖️ 14,75 vs 14,8 (Δεκαδικά)', a: '14,75', b: '14,8' },
    { label: '📏 3,450 vs 3,45 (Ισοδύναμα)', a: '3,450', b: '3,45' },
    { label: '🔢 12450 vs 9890 (Φυσικοί)', a: '12450', b: '9890' },
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
  let symbol = "＝";
  let resultText = "Οι αριθμοί είναι ίσοι";
  let resultColor = "text-amber-500 bg-amber-50 border-amber-200";
  let tiltDeg = 0;

  if (valA > valB) {
    symbol = "＞";
    resultText = "Ο πρώτος αριθμός είναι μεγαλύτερος";
    resultColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    tiltDeg = -8;
  } else if (valA < valB) {
    symbol = "＜";
    resultText = "Ο δεύτερος αριθμός είναι μεγαλύτερος";
    resultColor = "text-blue-700 bg-blue-50 border-blue-200";
    tiltDeg = 8;
  }

  // Ανάλυση ψηφίο προς ψηφίο για την εξήγηση
  const getStepExplanation = () => {
    const cleanA = numA.replace('.', ',');
    const cleanB = numB.replace('.', ',');

    const [intA = "0", decA = ""] = cleanA.split(',');
    const [intB = "0", decB = ""] = cleanB.split(',');

    const intValA = parseInt(intA || "0", 10);
    const intValB = parseInt(intB || "0", 10);

    if (intValA !== intValB) {
      return `Συγκρίνουμε πρώτα το ακέραιο μέρος: ${intValA} ${intValA > intValB ? '>' : '<'} ${intValB}. Επομένως, ${numA} ${intValA > intValB ? '>' : '<'} ${numB}.`;
    }

    const maxDecLen = Math.max(decA.length, decB.length);
    const normDecA = decA.padEnd(maxDecLen, '0');
    const normDecB = decB.padEnd(maxDecLen, '0');

    if (normDecA === normDecB) {
      return `Το ακέραιο μέρος είναι ίδιο (${intValA}) και τα δεκαδικά μέρη εξισώνονται με μηδενικά (${normDecA} = ${normDecB}). Άρα οι αριθμοί είναι ίσοι!`;
    }

    for (let i = 0; i < maxDecLen; i++) {
      const d1 = parseInt(normDecA[i], 10);
      const d2 = parseInt(normDecB[i], 10);
      const posName = i === 0 ? "στα δέκατα" : i === 1 ? "στα εκατοστά" : "στα χιλιοστά";

      if (d1 !== d2) {
        return `Τα ακέραια μέρη είναι ίσα (${intValA}). Συγκρίνουμε ${posName}: ${d1} ${d1 > d2 ? '>' : '<'} ${d2} (${intValA},${normDecA} vs ${intValB},${normDecB}). Άρα ${numA} ${d1 > d2 ? '>' : '<'} ${numB}.`;
      }
    }

    return "Οι δύο αριθμοί έχουν ακριβώς την ίδια αξία.";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Σύγκριση & Διάταξη Αριθμών - LearnMaths.gr</title>
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
                href="/st-dimotikou/04-sigkrisi-arithmon-ask"
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
                    Ενότητα 4
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  4. Σύγκριση & Διάταξη Φυσικών και Δεκαδικών
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε τους κανόνες σύγκρισης για <strong>φυσικούς</strong> και <strong>δεκαδικούς αριθμούς</strong>! Ανακάλυψε πώς συγκρίνουμε ψηφίο-προς-ψηφίο από τα αριστερά προς τα δεξιά και πώς η προσθήκη μηδενικών βοηθάει στην ακριβή σύγκριση.
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/04-sigkrisi-arithmon-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            
            {/* CARD 1 */}
            <div className="bg-blue-50/80 border border-blue-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Σύγκριση Φυσικών</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν δύο φυσικοί αριθμοί έχουν <strong>διαφορετικό πλήθος ψηφίων</strong>, μεγαλύτερος είναι εκείνος με τα περισσότερα ψηφία. Αν έχουν τα ίδια, συγκρίνουμε από αριστερά προς τα δεξιά.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p><strong className="text-blue-700">12300</strong> ＞ <strong className="text-slate-800">9800</strong> (5 ψηφία vs 4)</p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Σύγκριση Δεκαδικών</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Συγκρίνουμε πρώτα τα <strong>ακέραια μέρη</strong>. Αν είναι ίσα, συγκρίνουμε διαδοχικά τα <strong>δέκατα</strong>, μετά τα <strong>εκατοστά</strong> και τέλος τα <strong>χιλιοστά</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p><strong className="text-indigo-700">14,8</strong> ＞ <strong className="text-slate-800">14,75</strong> (8 δέκατα ＞ 7 δέκατα)</p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-cyan-50/80 border border-cyan-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Το Κόλπο των Μηδενικών</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να μη μπερδευόμαστε, συμπληρώνουμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους ώστε οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-cyan-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center font-bold">
                <p>14,80 ＞ 14,75 (80 εκατοστά ＞ 75 εκατοστά)</p>
              </div>
            </div>

          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Σύγκρισης
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
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
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs 2xl:text-sm font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN VERTICAL STACK STRUCTURE */}
            <div className="space-y-6">

              {/* ROW 1: (1) INPUTS & (2) DYNAMIC READOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* INPUTS A & B (7 COLS) */}
                <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="text-xs 2xl:text-sm font-black text-emerald-800 uppercase tracking-wider block">
                        1ος Αριθμός (Α):
                      </label>
                      <input
                        type="text"
                        value={numA}
                        onChange={(e) => setNumA(sanitizeInput(e.target.value))}
                        className="text-2xl 2xl:text-3xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                        placeholder="π.χ. 14,75"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs 2xl:text-sm font-black text-blue-800 uppercase tracking-wider block">
                        2ος Αριθμός (Β):
                      </label>
                      <input
                        type="text"
                        value={numB}
                        onChange={(e) => setNumB(sanitizeInput(e.target.value))}
                        className="text-2xl 2xl:text-3xl font-black text-center p-3 bg-white border-2 border-blue-300 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                        placeholder="π.χ. 14,8"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] 2xl:text-xs text-slate-400 text-center font-medium">
                    💡 Ακόμα κι αν πατήσεις τελεία ( . ), μετατρέπεται αυτόματα στο ελληνικό κόμμα ( , ).
                  </p>
                </div>

                {/* DYNAMIC RESULT BADGE (5 COLS) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 2xl:p-6 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] 2xl:text-xs font-black text-amber-400 uppercase tracking-widest block">
                    ✨ Σχέση Διάταξης:
                  </span>
                  
                  <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-black font-mono">
                    <span className="text-emerald-400">{numA || "0"}</span>
                    <span className="bg-amber-400 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                      {symbol}
                    </span>
                    <span className="text-cyan-300">{numB || "0"}</span>
                  </div>

                  <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-xl border ${resultColor}`}>
                    {resultText}
                  </span>
                </div>

              </div>

              {/* ROW 2: (3) DYNAMIC INTERACTIVE SVG BALANCE SCALE */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 2xl:p-8 rounded-2xl flex flex-col items-center justify-between space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    ⚖️ Διαδραστική Ζυγαριά Αξίας (SVG Visual Scale)
                  </span>
                  <p className="text-xs text-slate-500">
                    Η ζυγαριά γέρνει αυτόματα προς την πλευρά με τη μεγαλύτερη αριθμητική αξία!
                  </p>
                </div>

                {/* SVG BALANCE SCALE */}
                <div className="w-full max-w-lg bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 400 220" className="w-full h-48 md:h-56">
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
                        {numA || "0"}
                      </text>

                      {/* Right Hangers & Pan (B) */}
                      <line x1="320" y1="65" x2="290" y2="135" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="320" y1="65" x2="350" y2="135" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M280 135 Q320 155 360 135 Z" fill="#2563eb" />
                      <rect x="285" y="110" width="70" height="25" rx="6" fill="#3b82f6" />
                      <text x="320" y="127" fontSize="12" fontWeight="900" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                        {numB || "0"}
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-center max-w-2xl">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                    🔍 Βήμα-Βήμα Μαθηματική Εξήγηση:
                  </span>
                  <p className="text-sm md:text-base font-bold text-slate-800 leading-snug">
                    {getStepExplanation()}
                  </p>
                </div>
              </div>

              {/* ROW 3: (4) STEP-BY-STEP RULES COMPARISON CARDS */}
              <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5">
                    🧬 Οδηγός Σύγκρισης Ψηφίο-προς-Ψηφίο
                  </span>
                  <span className="text-[10px] 2xl:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-black text-xs text-blue-800 uppercase block">
                      1. Βήματα για Δεκαδικούς:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• <strong>Βήμα 1:</strong> Συγκρίνουμε τα ακέραια μέρη (<strong className="text-slate-800">15</strong>,2 ＞ <strong className="text-slate-800">14</strong>,9).</li>
                      <li>• <strong>Βήμα 2:</strong> Αν είναι ίσα, συγκρίνουμε τα δέκατα (7,<strong className="text-slate-800">8</strong> ＞ 7,<strong className="text-slate-800">6</strong>).</li>
                      <li>• <strong>Βήμα 3:</strong> Εξισώνουμε τα ψηφία με μηδενικά (0,4 = 0,40).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-black text-xs text-emerald-800 uppercase block">
                      2. Συνηθισμένη Παγίδα:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Πολλά παιδιά νομίζουν ότι το <strong className="text-rose-600">0,75</strong> είναι μεγαλύτερο από το <strong className="text-emerald-700">0,8</strong> επειδή το 75 μοιάζει μεγαλύτερο από το 8. Όμως:
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-mono font-bold text-center text-slate-800">
                      0,80 (80 εκατοστά) ＞ 0,75 (75 εκατοστά)
                    </div>
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
                Κατανόησες τους κανόνες σύγκρισης φυσικών και δεκαδικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/04-sigkrisi-arithmon-ask"
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
