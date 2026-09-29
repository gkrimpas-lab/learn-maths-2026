// pages/st-dimotikou/05-prosthesi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ProsthesiAfairesiPage() {
  const [numA, setNumA] = useState('34,75');
  const [numB, setNumB] = useState('18,5');
  const [extraNum, setExtraNum] = useState('5,25');
  const [activeProperty, setActiveProperty] = useState('antimetathetiki');

  const presets = [
    { label: '💶 34,75 ＋ 18,50 ＋ 5,25 (Δεκαδικά)', a: '34,75', b: '18,5', c: '5,25' },
    { label: '🔢 1.250 ＋ 850 ＋ 400 (Φυσικοί)', a: '1250', b: '850', c: '400' },
    { label: '⚖️ 4,25 ＋ 0,75 ＋ 2,5 (Συμπληρώματα)', a: '4,25', b: '0,75', c: '2,5' },
    { label: '📏 120,4 ＋ 35,85 ＋ 4,15 (Μήκη)', a: '120,4', b: '35,85', c: '4,15' }
  ];

  // Έλεγχος & περιορισμός: Ακέραιο μέρος <= 4 ψηφία, Δεκαδικό μέρος <= 3 ψηφία
  const sanitizeInput = (val) => {
    let formatted = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(',');

    let intPart = parts[0] || '';
    if (intPart.length > 4) {
      intPart = intPart.slice(0, 4);
    }

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

  const valA = parseVal(numA);
  const valB = parseVal(numB);
  const valExtra = parseVal(extraNum);

  const sumVal = (valA + valB).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');
  const totalSumVal = (valA + valB + valExtra).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');
  const diffVal = Math.abs(valA - valB).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');

  // Αυξομείωση με διατήρηση των ορίων (έως 9999 στο ακέραιο, max 3 δεκαδικά)
  const adjustValue = (currentStr, delta) => {
    const current = parseVal(currentStr);
    let updated = Math.max(0, current + delta);
    if (updated > 9999.999) updated = 9999.999;

    const isDec = currentStr.includes(',');
    const decimals = isDec ? Math.min(3, (currentStr.split(',')[1] || '').length || 1) : 0;
    return sanitizeInput(updated.toFixed(decimals).replace('.', ','));
  };

  // Ευθυγράμμιση ψηφίων για την κάθετη πράξη
  const formatVerticalNumber = (str) => {
    const clean = str.replace(/\./g, ',');
    const [intPart = '0', decPart = ''] = clean.split(',');
    return { intPart, decPart };
  };

  const aParts = formatVerticalNumber(numA);
  const bParts = formatVerticalNumber(numB);
  const maxDecLen = Math.max(aParts.decPart.length, bParts.decPart.length);
  const alignedDecA = aParts.decPart.padEnd(maxDecLen, '0');
  const alignedDecB = bParts.decPart.padEnd(maxDecLen, '0');

  return (
    <Layout
      title="Πρόσθεση Φυσικών και Δεκαδικών • Ιδιότητες και Αφαίρεση - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς προσθέτουμε φυσικούς και δεκαδικούς αριθμούς, τις ιδιότητες της πρόσθεσης και την αφαίρεση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/05-prosthesi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 5 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πρόσθεση Φυσικών &amp; Δεκαδικών • Ιδιότητες &amp; Αφαίρεση
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς προσθέτουμε με ασφάλεια φυσικούς και δεκαδικούς αριθμούς, αξιοποίησε την <strong>αντιμεταθετική</strong> και <strong>προσεταιριστική ιδιότητα</strong> για γρήγορους υπολογισμούς και δες πώς η <strong>αφαίρεση</strong> λειτουργεί ως η αντίστροφη πράξη!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κάθετη Στοίχιση Υποδιαστολής, Ιδιότητες &amp; Δοκιμή Αφαίρεσης</span>
            </div>
            <Link
              href="/st-dimotikou/05-prosthesi-ask"
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
              Κανόνες Πρόσθεσης &amp; Αφαίρεσης σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η σωστή στοίχιση, οι μαθηματικές ιδιότητες και η επαλήθευση των πράξεων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Στοίχιση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κάθετη Πρόσθεση Δεκαδικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τους προσθετέους τον έναν κάτω από τον άλλον, φροντίζοντας οι <strong>υποδιαστολές</strong> και τα αντίστοιχα ψηφία (Μ κάτω από Μ, δ κάτω από δ) να είναι σε <strong>απόλυτη στοίχιση</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>34,75 ＋ 18,50 ＝ <strong className="text-blue-700">53,25</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν χρειάζεται, συμπληρώνουμε μηδενικά στο τέλος ώστε όλοι οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ιδιότητες Πρόσθεσης
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1">
                  <p>• <strong>Αντιμεταθετική:</strong> <code className="text-indigo-700 font-bold font-mono">α ＋ β ＝ β ＋ α</code></p>
                  <p>• <strong>Προσεταιριστική:</strong> <code className="text-indigo-700 font-bold font-mono">(α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)</code></p>
                  <p>• <strong>Ουδέτερο στοιχείο:</strong> Το 0 (<code className="text-indigo-700 font-bold font-mono">α ＋ 0 ＝ α</code>)</p>
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>2,5 ＋ 4,8 ＝ 4,8 ＋ 2,5 ＝ <strong className="text-indigo-700">7,3</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Αξιοποιούμε τις ιδιότητες για να ομαδοποιούμε αριθμούς που δίνουν «στρογγυλά» αθροίσματα.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Επαλήθευση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αφαίρεση ως Αντίστροφη Πράξη
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η αφαίρεση «λύνει» την πρόσθεση και αποτελεί τη δοκιμή της: Αν <strong className="text-slate-900 font-mono">α ＋ β ＝ γ</strong>, τότε <strong className="text-cyan-800 font-mono">γ － β ＝ α</strong> και <strong className="text-cyan-800 font-mono">γ － α ＝ β</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>53,25 － 18,50 ＝ 34,75 (Δοκιμή)</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Αν αφαιρέσουμε έναν προσθετέο από το άθροισμα, πρέπει πάντα να βρίσκουμε τον άλλον.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΙΔΙΟΤΗΤΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Πρόσθεσης &amp; Ιδιοτήτων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Άλλαξε τους αριθμούς είτε πληκτρολογώντας (έως 4 ακέραια και 3 δεκαδικά ψηφία) είτε πατώντας τα κουμπιά (＋ / －)!
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
                    setExtraNum(preset.c);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUTS A, B, C & READOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* INPUTS A, B & C (8 COLS) */}
              <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
                  
                  {/* INPUT A */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-emerald-800 tracking-wider block uppercase">
                        1ος (α):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        έως 9999,999
                      </span>
                    </div>
                    
                    <input
                      type="text"
                      inputMode="decimal"
                      value={numA}
                      onChange={(e) => setNumA(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                      placeholder="34,75"
                    />

                    {/* BUTTONS A */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, +0.1))}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, +1))}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* INPUT B */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-blue-800 tracking-wider block uppercase">
                        2ος (β):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                        έως 9999,999
                      </span>
                    </div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={numB}
                      onChange={(e) => setNumB(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                      placeholder="18,5"
                    />

                    {/* BUTTONS B */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, +0.1))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, +1))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* INPUT C */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-indigo-800 tracking-wider block uppercase">
                        3ος (γ):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
                        έως 9999,999
                      </span>
                    </div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={extraNum}
                      onChange={(e) => setExtraNum(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-indigo-50/50 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 outline-none transition-all w-full tracking-wider text-indigo-700 font-mono"
                      placeholder="5,25"
                    />

                    {/* BUTTONS C */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, +0.1))}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, +1))}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  💡 Ακέραιο μέρος έως 4 ψηφία (0 - 9999), κλασματικό/δεκαδικό μέρος έως 3 ψηφία (δέκατα, εκατοστά, χιλιοστά).
                </p>
              </div>

              {/* DYNAMIC RESULT BADGE (4 COLS) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 tracking-wider block uppercase">
                  ✨ Αθροισμα 2 Αριθμων (α ＋ β):
                </span>
                
                <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl font-black font-mono flex-wrap">
                  <span className="text-emerald-400">{numA || '0'}</span>
                  <span className="text-amber-400 font-sans">＋</span>
                  <span className="text-cyan-300">{numB || '0'}</span>
                  <span className="text-slate-400 font-sans">＝</span>
                  <span className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-lg shadow-md">
                    {sumVal}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 w-full text-xs text-blue-100 space-y-1">
                  <div>Σύνολο 3 Αριθμών (α ＋ β ＋ γ): <strong className="text-emerald-400 font-mono text-xs sm:text-sm">{totalSumVal}</strong></div>
                  <div>Διαφορά (α － β): <strong className="text-amber-300 font-mono text-xs sm:text-sm">{diffVal}</strong></div>
                </div>
              </div>

            </div>

            {/* ROW 2: DYNAMIC VERTICAL ALIGNMENT & PROPERTIES VISUALIZER */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 md:p-6 rounded-2xl space-y-6">
              
              {/* TABS ΙΔΙΟΤΗΤΩΝ */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveProperty('antimetathetiki')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
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
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
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
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                    activeProperty === 'antitheti'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ➖ Αφαίρεση ως Δοκιμή
                </button>
              </div>

              {/* VISUALIZER GRID - FLUID ΧΩΡΙΣ SCROLL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* LEFT: VERTICAL ALIGNMENT BOX (5 COLS) */}
                <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block font-sans">
                    📐 Κάθετη Στοίχιση (α ＋ β):
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

                  <span className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                    🎯 Τα μηδενικά στο τέλος εξισώνουν τα δεκαδικά ψηφία!
                  </span>
                </div>

                {/* RIGHT: PROPERTY INTERACTIVE CARD (7 COLS) */}
                <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-center min-h-[220px]">
                  {activeProperty === 'antimetathetiki' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔄</span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">Αντιμεταθετική Ιδιότητα σε Δράση</h4>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        Η σειρά των προσθετέων δεν επηρεάζει το άθροισμα:
                      </p>
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm md:text-base font-bold text-center text-slate-800 space-y-2">
                        <div className="text-slate-500 text-xs font-sans">
                          α ＋ β ＝ β ＋ α
                        </div>
                        <div className="break-words">
                          <span className="text-emerald-700">{numA || '0'}</span> ＋ <span className="text-blue-700">{numB || '0'}</span> ＝ <span className="text-blue-700">{numB || '0'}</span> ＋ <span className="text-emerald-700">{numA || '0'}</span> ＝ <strong className="text-amber-600 font-black">{sumVal}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProperty === 'prosetairistiki' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧩</span>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base">Προσεταιριστική Ιδιότητα</h4>
                        </div>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          γ ＝ {extraNum || '0'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        Ομαδοποιούμε όπως μας εξυπηρετεί: <code className="text-indigo-700 font-bold font-mono">(α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)</code>
                      </p>

                      <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-2">
                        <div className="break-words">
                          ({numA || '0'} ＋ {numB || '0'}) ＋ {extraNum || '0'} ＝ {sumVal} ＋ {extraNum || '0'} ＝ <strong className="text-indigo-600 font-black">{totalSumVal}</strong>
                        </div>
                        <div className="break-words">
                          {numA || '0'} ＋ ({numB || '0'} ＋ {extraNum || '0'}) ＝ {numA || '0'} ＋ {(valB + valExtra).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')} ＝ <strong className="text-indigo-600 font-black">{totalSumVal}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProperty === 'antitheti' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">➖</span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">Αφαίρεση και Δοκιμή Πρόσθεσης</h4>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        Αν από το άθροισμα αφαιρέσουμε έναν προσθετέο, βρίσκουμε τον άλλον:
                      </p>
                      <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-2">
                        <div className="break-words"><span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-blue-700">{numB || '0'}</span> ＝ <strong className="text-emerald-700 font-black">{numA || '0'}</strong> (Σωστό ✅)</div>
                        <div className="break-words"><span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-emerald-700">{numA || '0'}</span> ＝ <strong className="text-blue-700 font-black">{numB || '0'}</strong> (Σωστό ✅)</div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* ROW 3: STEP-BY-STEP CALCULATION RULES */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  🧬 Χρυσός Κανόνας Πρόσθεσης και Αφαίρεσης Δεκαδικών
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Πλήρης Εμφάνιση
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-blue-800 uppercase tracking-wider block">1. Στοίχιση Υποδιαστολών</span>
                  <p>Τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-emerald-800 uppercase tracking-wider block">2. Συμπλήρωση Μηδενικών</span>
                  <p>Προσθέτουμε μηδενικά στο τέλος ώστε όλοι οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block">3. Κατέβασμα Υποδιαστολής</span>
                  <p>Εκτελούμε την πράξη κανονικά και κατεβάζουμε την υποδιαστολή στο αποτέλεσμα στην ίδια θέση.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Πρόσθεση &amp; Αφαίρεση!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες την πρόσθεση, τις ιδιότητες και την αφαίρεση; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/05-prosthesi-ask"
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
