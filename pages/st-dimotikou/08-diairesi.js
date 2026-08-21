import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  MIN_DIVISOR: 1,
  MAX_DIVIDEND: 9999, // Έως 4 ψηφία για απόλυτη σχολική στοίχιση
  MAX_DIVISOR_INPUT: 99,
  MAX_VISUAL_BOXES: 120
};

export default function DiairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti' ή 'moirasma'
  
  // Κατάσταση για την πράξη
  const [dividendInput, setDividendInput] = useState("1569");
  const [divisorInput, setDivisorInput] = useState("8");

  const D = Math.floor(parseFloat(dividendInput)) || 0;
  const d = Math.floor(parseFloat(divisorInput)) || LIMITS.MIN_DIVISOR;

  // Βασικοί υπολογισμοί
  const q = d > 0 ? Math.floor(D / d) : 0;
  const r = d > 0 ? D % d : 0;
  const isPerfect = r === 0 && D > 0;

  const presets = [
    { label: '🍕 1569 : 8 (Ατελής)', D: '1569', d: '8' },
    { label: '🎯 1248 : 4 (Τέλεια)', D: '1248', d: '4' },
    { label: '📦 3450 : 25 (Τέλεια)', D: '3450', d: '25' },
    { label: '💡 48 : 5 (Οπτική)', D: '48', d: '5' }
  ];

  // Αυξομείωση τιμών
  const adjustValue = (currentStr, delta, isDivisor = false) => {
    const current = parseInt(currentStr, 10) || 0;
    const maxVal = isDivisor ? LIMITS.MAX_DIVISOR_INPUT : LIMITS.MAX_DIVIDEND;
    const minVal = isDivisor ? 1 : 0;
    const updated = Math.max(minVal, Math.min(maxVal, current + delta));
    return updated.toString();
  };

  // Ασφαλής έλεγχος των inputs
  const handleInputChange = (val, setter, isDivisor = false) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (cleanVal.length <= (isDivisor ? 2 : 4)) {
      if (isDivisor && parseInt(cleanVal, 10) === 0) return;
      setter(cleanVal);
    }
  };

  // Παραγωγή των αναλυτικών σχολικών βημάτων
  const generateSchoolSteps = () => {
    if (D === 0 || d === 0) return [];
    
    const steps = [];
    const divStr = D.toString();
    let currentVal = 0;
    
    for (let i = 0; i < divStr.length; i++) {
      const nextDigit = parseInt(divStr[i], 10);
      currentVal = currentVal * 10 + nextDigit;
      
      if (currentVal >= d || i === divStr.length - 1) {
        const times = Math.floor(currentVal / d);
        const product = times * d;
        const remainder = currentVal - product;
        
        if (times > 0 || steps.length > 0 || i === divStr.length - 1) {
          steps.push({
            workNum: currentVal,
            product: product,
            remainder: remainder,
            digitIndex: i
          });
        }
        
        currentVal = remainder;
      }
    }
    return steps;
  };

  const schoolSteps = generateSchoolSteps();
  const divDigits = D.toString().split('');
  const maxDigits = divDigits.length;

  const getPaddedDigits = (num, endIndex) => {
    const numStr = num.toString();
    const digits = new Array(maxDigits).fill('');
    
    let numIdx = numStr.length - 1;
    for (let i = endIndex; i >= 0 && numIdx >= 0; i--) {
      digits[i] = numStr[numIdx];
      numIdx--;
    }
    return digits;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Τέλεια & Ατελής Διαίρεση - LearnMaths.gr</title>
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
                href="/st-dimotikou/08-diairesi-ask"
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
                    Ενότητα 8
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  8. Τέλεια και Ατελής Διαίρεση Φυσικών Αριθμών
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς μοιράζουμε έναν αριθμό σε ίσα μέρη, πότε η διαίρεση είναι <strong>τέλεια</strong> (υ = 0) και πότε <strong>ατελής</strong> (υ &gt; 0), καθώς και τη θεμελιώδη μαθηματική ταυτότητα: Δ = δ × π + υ!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/08-diairesi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Τέλεια Διαίρεση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Είναι η διαίρεση στην οποία ο Διαιρετέος χωρίζεται ακριβώς και το υπόλοιπο είναι <strong>μηδέν (υ = 0)</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center">
                <p>12 : 3 = <strong className="text-emerald-700">4</strong> (υπόλοιπο 0)</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Ατελής Διαίρεση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Είναι η διαίρεση στην οποία περισσεύει υπόλοιπο <strong>διάφορο του μηδενός (υ &gt; 0)</strong>. Το υπόλοιπο είναι πάντα μικρότερο από τον διαιρέτη (υ &lt; δ).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 text-xs text-slate-700 font-mono text-center">
                <p>14 : 3 = <strong className="text-amber-600">4</strong> (υπόλοιπο 2)</p>
              </div>
            </div>

            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Μαθηματική Επαλήθευση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Η θεμελιώδης ταυτότητα της διαίρεσης: <code className="text-blue-700 font-bold font-mono">Δ = δ × π + υ</code>.<br/>
                  Ο Διαιρετέος ισούται με τον Διαιρέτη επί το Πηλίκο συν το Υπόλοιπο.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <p>1569 = 8 × 196 + 1</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Διαίρεσης
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τον Διαιρετέο και τον Διαιρέτη με τα κουμπιά αυξομείωσης (+ / -) ή πληκτρολόγησε τους αριθμούς!
                </p>
              </div>

              {/* PRESETS */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDividendInput(preset.D);
                      setDivisorInput(preset.d);
                    }}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="space-y-6">

              {/* ROW 1: INPUT CONTROLS & STATUS BADGE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* INPUTS D & d (7 COLS) */}
                <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    
                    {/* INPUT Δ (ΔΙAIPETEOΣ) */}
                    <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-blue-800 uppercase tracking-wider block">
                          Διαιρετεος (Δ):
                        </label>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                          έως 9999
                        </span>
                      </div>
                      
                      <input
                        type="text"
                        value={dividendInput}
                        onChange={(e) => handleInputChange(e.target.value, setDividendInput)}
                        className="text-xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                        placeholder="1569"
                      />

                      {/* BUTTONS Δ */}
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => setDividendInput(adjustValue(dividendInput, -10))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => setDividendInput(adjustValue(dividendInput, -1))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => setDividendInput(adjustValue(dividendInput, +1))}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => setDividendInput(adjustValue(dividendInput, +10))}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* INPUT δ (ΔΙAIPETHΣ) */}
                    <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                          Διαιρετης (δ):
                        </label>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                          έως 99
                        </span>
                      </div>

                      <input
                        type="text"
                        value={divisorInput}
                        onChange={(e) => handleInputChange(e.target.value, setDivisorInput, true)}
                        className="text-xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                        placeholder="8"
                      />

                      {/* BUTTONS δ */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setDivisorInput(adjustValue(divisorInput, -1, true))}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-1 rounded-lg transition"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => setDivisorInput(adjustValue(divisorInput, +1, true))}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-1 rounded-lg transition"
                        >
                          +1
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* STATUS BADGE */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col gap-1.5 font-sans">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ειδος Διαιρεσης:</span>
                    <div className={`text-sm md:text-base font-black px-4 py-1.5 rounded-full inline-block mx-auto ${
                      isPerfect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {isPerfect ? "🎯 TΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (υ = 0)" : "🔍 ΑΤΕΛΗΣ ΔΙΑΙΡΕΣΗ (υ > 0)"}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC RESULT CARD (5 COLS) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                    ✨ Μαθηματικη Ταυτοτητα Επαληθευσης:
                  </span>

                  <div className="text-xl md:text-2xl font-black font-mono bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
                    <span className="text-blue-400">{D.toLocaleString('el-GR')}</span>
                    <span className="text-slate-400 font-sans mx-1.5">＝</span>
                    <span className="text-emerald-400">{d}</span>
                    <span className="text-amber-400 font-sans mx-1">×</span>
                    <span className="text-purple-300">{q.toLocaleString('el-GR')}</span>
                    <span className="text-amber-400 font-sans mx-1">＋</span>
                    <span className="text-rose-400">{r}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-left w-full pt-1">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <span className="text-slate-400 font-sans block text-[10px]">Πηλίκο (π):</span>
                      <strong className="text-purple-300 text-sm">{q.toLocaleString('el-GR')}</strong>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <span className="text-slate-400 font-sans block text-[10px]">Υπόλοιπο (υ):</span>
                      <strong className="text-rose-300 text-sm">{r}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* ROW 2: TABS & VISUALIZATION */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 rounded-2xl space-y-6">
                
                {/* TABS EΝΑΛΛΑΓΗΣ VIEW */}
                <div className="flex justify-center gap-2 border-b border-slate-200 pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('katheti')}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                      activeTab === 'katheti'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📊 Κάθετη Πράξη με Βήματα
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('moirasma')}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                      activeTab === 'moirasma'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🍕 Οπτικό Μοίρασμα σε Ομάδες
                  </button>
                </div>

                {/* TAB CONTENT */}
                <div className="flex flex-col items-center justify-center">
                  {activeTab === 'katheti' ? (
                    <div className="w-full max-w-[380px] bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-4 border-slate-700 font-mono text-xl md:text-2xl font-black relative min-h-[320px] flex py-8 select-none justify-center">
                      <div className="flex w-full items-start justify-center">
                        
                        {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙAIPETEOΣ & ΑΦΑΙΡΕΣΕΙΣ */}
                        <div className="flex flex-col items-end pr-4 text-right">
                          <div className="flex justify-end text-blue-400 font-bold mb-3 h-8 items-center">
                            <div className="w-6"></div>
                            <div className="flex justify-end">
                              {divDigits.map((char, i) => (
                                <span key={i} className="w-5 text-center">{char}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 w-full">
                            {schoolSteps.map((step, idx) => {
                              const productDigits = getPaddedDigits(step.product, step.digitIndex);
                              const remainderDigits = getPaddedDigits(step.remainder, step.digitIndex);

                              return (
                                <div key={idx} className="flex flex-col items-end w-full">
                                  <div className="flex items-center justify-end w-full h-7">
                                    <span className="w-6 text-left text-rose-400 font-bold text-base md:text-lg select-none">-</span>
                                    <div className="flex justify-end text-rose-300 font-medium">
                                      {productDigits.map((char, i) => (
                                        <span key={i} className="w-5 text-center">{char}</span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="w-full flex justify-end h-[2px] my-1">
                                    <div className="w-6"></div>
                                    <div className="flex justify-end">
                                      {productDigits.map((char, i) => (
                                        <div key={i} className={`w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`}></div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-end w-full h-7 items-center">
                                    <div className="w-6"></div>
                                    <div className="flex justify-end text-slate-200 font-black">
                                      {idx === schoolSteps.length - 1 ? (
                                        remainderDigits.map((char, i) => (
                                          <span key={i} className="w-5 text-center">{char}</span>
                                        ))
                                      ) : (
                                        getPaddedDigits(schoolSteps[idx + 1].workNum, schoolSteps[idx + 1].digitIndex).map((char, i) => (
                                          <span key={i} className="w-5 text-center">{char}</span>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* ΜΕΣΑΙΟ ΜΕΡΟΣ: ΚΑΘΕΤΗ ΓΡΑΜΜΗ */}
                        <div className="w-[3px] bg-slate-600 self-stretch min-h-[220px]"></div>

                        {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                        <div className="text-left pl-5 flex flex-col h-full justify-start">
                          <div className="text-emerald-400 font-bold border-b-4 border-slate-600 pb-2 tracking-wider flex w-full">
                            {divisorInput.split('').map((char, i) => (
                              <span key={i} className="w-5 text-center">{char}</span>
                            ))}
                          </div>
                          
                          <div className="text-purple-300 pt-3 font-black tracking-wider flex w-full">
                            {q.toString().split('').map((char, i) => (
                              <span key={i} className="w-5 text-center">{char}</span>
                            ))}
                          </div>
                          
                          <div className="mt-auto pt-10 text-[10px] font-sans font-black uppercase text-rose-400 tracking-wider">
                            🏁 Υπολοιπο: {r}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="my-auto flex flex-col items-center gap-4 w-full px-2 text-center">
                      {D <= LIMITS.MAX_VISUAL_BOXES && D > 0 && d > 0 ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Μοιρασμα {D} στοιχειων σε {d} ισες ομαδες:
                          </span>
                          
                          <div className="flex flex-wrap gap-2.5 justify-center max-h-[280px] overflow-y-auto p-3 border rounded-2xl bg-white w-full max-w-xl shadow-inner">
                            {[...Array(Math.min(d, 30))].map((_, groupIdx) => (
                              <div key={groupIdx} className="bg-slate-50 border-2 border-emerald-300 p-2.5 rounded-2xl flex flex-wrap gap-1 items-center justify-center min-w-[60px] min-h-[60px] shadow-sm">
                                {[...Array(q)].map((_, boxIdx) => (
                                  <div key={boxIdx} className="w-3.5 h-3.5 bg-blue-500 rounded-sm shadow-xs" />
                                ))}
                              </div>
                            ))}
                          </div>

                          {r > 0 && (
                            <div className="flex flex-col items-center gap-1.5 mt-1">
                              <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">📦 Περισσεψαν (Υπολοιπο = {r}):</span>
                              <div className="flex gap-1.5 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                                {[...Array(r)].map((_, i) => (
                                  <div key={i} className="w-3.5 h-3.5 bg-rose-500 rounded-sm shadow-xs" />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-xs mx-auto text-slate-600 text-sm font-medium space-y-2 shadow-sm">
                          <p className="font-bold">📊 Οπτική Απεικόνιση</p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Βάλε έναν Διαιρετέο μικρότερο από {LIMITS.MAX_VISUAL_BOXES} για να δεις τα κουτάκια να μοιράζονται αυτόματα στις ομάδες.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατανόησες την τέλεια και την ατελή διαίρεση; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/08-diairesi-ask"
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
