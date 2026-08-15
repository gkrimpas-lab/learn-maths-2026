import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ProsthesiAfairesiPage() {
  const [numA, setNumA] = useState("34,75");
  const [numB, setNumB] = useState("18,5");
  const [activeProperty, setActiveProperty] = useState("antimetathetiki"); // 'antimetathetiki', 'prosetairistiki', 'antitheti'
  const [extraNum, setExtraNum] = useState("5"); // Για την προσεταιριστική ιδιότητα

  const presets = [
    { label: '💶 34,75 + 18,50 (Δεκαδικά)', a: '34,75', b: '18,5' },
    { label: '🔢 1.250 + 850 (Φυσικοί)', a: '1250', b: '850' },
    { label: '⚖️ 4,25 + 0,75 (Συμπλήρωμα)', a: '4,25', b: '0,75' },
    { label: '📏 120,4 + 35,85 (Μήκη)', a: '120,4', b: '35,85' }
  ];

  const sanitizeInput = (val) => {
    let formatted = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(',');
    if (parts.length > 2) {
      formatted = `${parts[0]},${parts.slice(1).join('')}`;
    }
    return formatted;
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const valA = parseVal(numA);
  const valB = parseVal(numB);
  const valExtra = parseVal(extraNum);

  const sumVal = (valA + valB).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');
  const diffVal = Math.abs(valA - valB).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');

  // Βοηθητικές συναρτήσεις αυξομείωσης (+ / -)
  const adjustValue = (currentStr, delta) => {
    const current = parseVal(currentStr);
    const updated = Math.max(0, current + delta);
    // Αν είναι ακέραιος εμφανίζεται χωρίς δεκαδικά, αλλιώς διατηρεί 1-2 δεκαδικά
    const isDec = currentStr.includes(',');
    const decimals = isDec ? Math.min(2, (currentStr.split(',')[1] || '').length || 1) : 0;
    return updated.toFixed(decimals).replace('.', ',');
  };

  // Ευθυγράμμιση ψηφίων για την κάθετη πράξη
  const formatVerticalNumber = (str) => {
    const clean = str.replace(/\./g, ',');
    const [intPart = "0", decPart = ""] = clean.split(',');
    return { intPart, decPart };
  };

  const aParts = formatVerticalNumber(numA);
  const bParts = formatVerticalNumber(numB);
  const maxDecLen = Math.max(aParts.decPart.length, bParts.decPart.length);
  const alignedDecA = aParts.decPart.padEnd(maxDecLen, '0');
  const alignedDecB = bParts.decPart.padEnd(maxDecLen, '0');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➕ Πρόσθεση, Ιδιότητες & Αφαίρεση - LearnMaths.gr</title>
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
                href="/st-dimotikou/05-prosthesi-ask"
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
                    Ενότητα 5
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  5. Πρόσθεση Φυσικών & Δεκαδικών • Ιδιότητες & Αφαίρεση
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε πώς προσθέτουμε με ασφάλεια φυσικούς και δεκαδικούς αριθμούς, αξιοποίησε την <strong>αντιμεταθετική</strong> και <strong>προσεταιριστική ιδιότητα</strong> για γρήγορους υπολογισμούς και δες πώς η <strong>αφαίρεση</strong> λειτουργεί ως η αντίστροφη πράξη!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/05-prosthesi-ask"
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
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Κάθετη Πρόσθεση Δεκαδικών</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τους προσθετέους τον έναν κάτω από τον άλλον, φροντίζοντας οι <strong>υποδιαστολές</strong> και τα ομώνυμα ψηφία (Μ κάτω από Μ, δ κάτω από δ) να είναι σε <strong>απόλυτη στοίχιση</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p>34,75 ＋ 18,50 ＝ <strong className="text-blue-700">53,25</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Ιδιότητες Πρόσθεσης</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  • <strong>Αντιμεταθετική:</strong> <code className="text-indigo-700 font-bold">α ＋ β ＝ β ＋ α</code><br/>
                  • <strong>Προσεταιριστική:</strong> <code className="text-indigo-700 font-bold">(α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)</code><br/>
                  • <strong>Ουδέτερο στοιχείο:</strong> Το 0 (<code className="text-indigo-700 font-bold">α ＋ 0 ＝ α</code>).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center">
                <p>2,5 ＋ 4,8 ＝ 4,8 ＋ 2,5 ＝ <strong className="text-indigo-700">7,3</strong></p>
              </div>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Αφαίρεση ως Αντίστροφη Πράξη</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η αφαίρεση «λύνει» την πρόσθεση και αποτελεί τη δοκιμή της: Αν <strong className="text-slate-900">α ＋ β ＝ γ</strong>, τότε <strong className="text-cyan-800">γ － β ＝ α</strong> και <strong className="text-cyan-800">γ － α ＝ β</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-cyan-100 text-xs 2xl:text-sm text-slate-700 space-y-1 font-mono text-center font-bold">
                <p>53,25 － 18,50 ＝ 34,75 (Δοκιμή)</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Πρόσθεσης & Ιδιοτήτων
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Άλλαξε τους προσθετέους είτε πληκτρολογώντας είτε πατώντας τα κουμπιά αυξομείωσης (+ / -) και δες το αποτέλεσμα να ανανεώνεται αυτόματα!
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

              {/* ROW 1: (1) INTERACTIVE INPUTS WITH BUTTONS & (2) DYNAMIC READOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* INPUTS A & B (7 COLS) */}
                <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    
                    {/* INPUT A */}
                    <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <label className="text-xs 2xl:text-sm font-black text-emerald-800 uppercase tracking-wider block">
                          1ος Προσθετέος (α):
                        </label>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          Ενεργό
                        </span>
                      </div>
                      
                      <input
                        type="text"
                        value={numA}
                        onChange={(e) => setNumA(sanitizeInput(e.target.value))}
                        className="text-2xl 2xl:text-3xl font-black text-center p-2.5 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                        placeholder="π.χ. 34,75"
                      />

                      {/* QUICK ADJUST BUTTONS (+ / -) */}
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => setNumA(adjustValue(numA, -1))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumA(adjustValue(numA, -0.1))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -0,1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumA(adjustValue(numA, +0.1))}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +0,1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumA(adjustValue(numA, +1))}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +1
                        </button>
                      </div>
                    </div>

                    {/* INPUT B */}
                    <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <label className="text-xs 2xl:text-sm font-black text-blue-800 uppercase tracking-wider block">
                          2ος Προσθετέος (β):
                        </label>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          Ενεργό
                        </span>
                      </div>

                      <input
                        type="text"
                        value={numB}
                        onChange={(e) => setNumB(sanitizeInput(e.target.value))}
                        className="text-2xl 2xl:text-3xl font-black text-center p-2.5 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                        placeholder="π.χ. 18,5"
                      />

                      {/* QUICK ADJUST BUTTONS (+ / -) */}
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => setNumB(adjustValue(numB, -1))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumB(adjustValue(numB, -0.1))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -0,1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumB(adjustValue(numB, +0.1))}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +0,1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNumB(adjustValue(numB, +1))}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +1
                        </button>
                      </div>
                    </div>

                  </div>

                  <p className="text-[11px] 2xl:text-xs text-slate-400 text-center font-medium">
                    💡 Πληκτρολόγησε φυσικούς ή δεκαδικούς αριθμούς ή χρησιμοποίησε τα πλήκτρα αυξομείωσης!
                  </p>
                </div>

                {/* DYNAMIC RESULT BADGE (5 COLS) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 2xl:p-6 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] 2xl:text-xs font-black text-amber-400 uppercase tracking-widest block">
                    ✨ Τελικό Άθροισμα (α ＋ β):
                  </span>
                  
                  <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black font-mono">
                    <span className="text-emerald-400">{numA || "0"}</span>
                    <span className="text-amber-400 font-sans">＋</span>
                    <span className="text-cyan-300">{numB || "0"}</span>
                    <span className="text-slate-400 font-sans">＝</span>
                    <span className="bg-amber-400 text-slate-900 px-3.5 py-1 rounded-xl shadow-md">
                      {sumVal}
                    </span>
                  </div>

                  <p className="text-xs text-blue-100 font-medium">
                    Διαφορά (α － β): <strong className="text-amber-300 font-mono text-sm">{diffVal}</strong>
                  </p>
                </div>

              </div>

              {/* ROW 2: (3) DYNAMIC VERTICAL ALIGNMENT & PROPERTIES VISUALIZER */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 2xl:p-8 rounded-2xl space-y-6">
                
                {/* TABS ΙΔΙΟΤΗΤΩΝ */}
                <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveProperty('antimetathetiki')}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                      activeProperty === 'antimetathetiki'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🔄 Αντιμεταθετική Ιδιότητα
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProperty('prosetairistiki')}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                      activeProperty === 'prosetairistiki'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🧩 Προσεταιριστική (με 3ο αριθμό)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProperty('antitheti')}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                      activeProperty === 'antitheti'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ➖ Αφαίρεση ως Δοκιμή
                  </button>
                </div>

                {/* VISUALIZER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* LEFT: VERTICAL ALIGNMENT BOX (5 COLS) */}
                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider block font-sans">
                      📐 Κάθετη Στοίχιση Υποδιαστολής:
                    </span>

                    <div className="font-mono text-xl md:text-2xl font-black text-slate-800 space-y-1 text-right inline-block">
                      <div className="flex justify-end items-center gap-1">
                        <span className="text-emerald-700">{aParts.intPart}</span>
                        {maxDecLen > 0 && <span className="text-amber-500 font-bold">,</span>}
                        {maxDecLen > 0 && <span className="text-emerald-700">{alignedDecA}</span>}
                      </div>

                      <div className="flex justify-end items-center gap-1 border-b-2 border-slate-800 pb-1">
                        <span className="text-slate-400 font-sans mr-2">＋</span>
                        <span className="text-blue-700">{bParts.intPart}</span>
                        {maxDecLen > 0 && <span className="text-amber-500 font-bold">,</span>}
                        {maxDecLen > 0 && <span className="text-blue-700">{alignedDecB}</span>}
                      </div>

                      <div className="text-amber-600 pt-1 font-black">
                        {sumVal}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 text-center font-medium">
                      🎯 Τα μηδενικά στο τέλος εξισώνουν τα δεκαδικά ψηφία!
                    </span>
                  </div>

                  {/* RIGHT: PROPERTY INTERACTIVE CARD (7 COLS) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-center min-h-[240px]">
                    {activeProperty === 'antimetathetiki' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔄</span>
                          <h4 className="font-black text-slate-900 text-base">Αντιμεταθετική Ιδιότητα σε Δράση</h4>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                          Η σειρά των προσθετέων δεν επηρεάζει το άθροισμα:
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm md:text-base font-bold text-center text-slate-800 space-y-2">
                          <div className="text-slate-500 text-xs font-sans">
                            α ＋ β ＝ β ＋ α
                          </div>
                          <div>
                            <span className="text-emerald-700">{numA || "0"}</span> ＋ <span className="text-blue-700">{numB || "0"}</span> ＝ <span className="text-blue-700">{numB || "0"}</span> ＋ <span className="text-emerald-700">{numA || "0"}</span> ＝ <strong className="text-amber-600 font-black">{sumVal}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeProperty === 'prosetairistiki' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🧩</span>
                            <h4 className="font-black text-slate-900 text-base">Προσεταιριστική Ιδιότητα</h4>
                          </div>
                          
                          {/* 3ος ΑΡΙΘΜΟΣ INPUT */}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span>3ος Αριθμός (γ):</span>
                            <input
                              type="text"
                              value={extraNum}
                              onChange={(e) => setExtraNum(sanitizeInput(e.target.value))}
                              className="w-14 text-center font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-1 outline-none"
                            />
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                          Ομαδοποιούμε όπως μας εξυπηρετεί: <code className="text-indigo-700 font-bold">(α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)</code>
                        </p>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-1.5">
                          <div>({numA || "0"} ＋ {numB || "0"}) ＋ {extraNum || "0"} ＝ {sumVal} ＋ {extraNum || "0"} ＝ <strong className="text-indigo-600 font-black">{(valA + valB + valExtra).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')}</strong></div>
                          <div>{numA || "0"} ＋ ({numB || "0"} ＋ {extraNum || "0"}) ＝ {numA || "0"} ＋ {(valB + valExtra).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')} ＝ <strong className="text-indigo-600 font-black">{(valA + valB + valExtra).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')}</strong></div>
                        </div>
                      </div>
                    )}

                    {activeProperty === 'antitheti' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">➖</span>
                          <h4 className="font-black text-slate-900 text-base">Αφαίρεση & Δοκιμή Πρόσθεσης</h4>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                          Αν από το άθροισμα αφαιρέσουμε έναν προσθετέο, βρίσκουμε τον άλλον:
                        </p>
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-2">
                          <div><span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-blue-700">{numB || "0"}</span> ＝ <strong className="text-emerald-700 font-black">{numA || "0"}</strong> (Σωστό ✅)</div>
                          <div><span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-emerald-700">{numA || "0"}</span> ＝ <strong className="text-blue-700 font-black">{numB || "0"}</strong> (Σωστό ✅)</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* ROW 3: (4) STEP-BY-STEP CALCULATION RULES */}
              <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5">
                    🧬 Χρυσός Κανόνας Πρόσθεσης & Αφαίρεσης Δεκαδικών
                  </span>
                  <span className="text-[10px] 2xl:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-blue-800 uppercase block">1. Στοίχιση Υποδιαστολών</span>
                    <p>Τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-emerald-800 uppercase block">2. Συμπλήρωση Μηδενικών</span>
                    <p>Προσθέτουμε μηδενικά στο τέλος ώστε όλοι οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-indigo-800 uppercase block">3. Κατέβασμα Υποδιαστολής</span>
                    <p>Εκτελούμε την πράξη κανονικά και κατεβάζουμε την υποδιαστολή στο αποτέλεσμα στην ίδια θέση.</p>
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
                Κατανόησες την πρόσθεση, τις ιδιότητες και την αφαίρεση; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/05-prosthesi-ask"
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
