// pages/st-dimotikou/08-diairesi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  MIN_DIVISOR: 1,
  MAX_DIVIDEND: 9999, // Έως 4 ψηφία για απόλυτη σχολική στοίχιση
  MAX_DIVISOR_INPUT: 99,
  MAX_VISUAL_BOXES: 120
};

export default function DiairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti' ή 'moirasma'
  
  // Κατάσταση για την πράξη
  const [dividendInput, setDividendInput] = useState('1569');
  const [divisorInput, setDivisorInput] = useState('8');

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
    <Layout
      title="Τέλεια και Ατελής Διαίρεση Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς μοιράζουμε σε ίσα μέρη, την τέλεια και ατελή διαίρεση και τη μαθηματική ταυτότητα Δ = δ · π + υ για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/08-diairesi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 8 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τέλεια &amp; Ατελής Διαίρεση Φυσικών Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς μοιράζουμε έναν αριθμό σε ίσα μέρη, πότε η διαίρεση είναι <strong>τέλεια</strong> (υ ＝ 0) και πότε <strong>ατελής</strong> (υ ＞ 0), καθώς και τη θεμελιώδη μαθηματική ταυτότητα: <strong className="text-amber-300 font-mono">Δ ＝ δ · π ＋ υ</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κάθετη Πράξη με Βήματα, Οπτικό Μοίρασμα &amp; Ταυτότητα Διαίρεσης</span>
            </div>
            <Link
              href="/st-dimotikou/08-diairesi-ask"
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
              Βασικές Έννοιες της Διαίρεσης σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η τέλεια διαίρεση, η ατελής διαίρεση και η μαθηματική επαλήθευση.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Χωρίς Υπόλοιπο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τέλεια Διαίρεση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι η διαίρεση στην οποία ο Διαιρετέος χωρίζεται ακριβώς και το υπόλοιπο είναι <strong>μηδέν (υ ＝ 0)</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>12 : 3 ＝ <strong className="text-emerald-700">4</strong> (υπόλοιπο 0)</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                💡 Στην τέλεια διαίρεση ισχύει: <strong>Δ ＝ δ · π</strong>.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Με Υπόλοιπο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ατελής Διαίρεση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι η διαίρεση στην οποία περισσεύει υπόλοιπο <strong>διάφορο του μηδενός (υ ＞ 0)</strong>. Το υπόλοιπο είναι πάντα μικρότερο από τον διαιρέτη (<strong className="font-mono">υ ＜ δ</strong>).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>14 : 3 ＝ <strong className="text-amber-600">4</strong> (υπόλοιπο 2)</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν το υπόλοιπο είναι μεγαλύτερο ή ίσο με τον διαιρέτη, η διαίρεση δεν έχει τελειώσει!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Επαλήθευση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μαθηματική Ταυτότητα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η θεμελιώδης ταυτότητα της διαίρεσης: <code className="text-blue-700 font-bold font-mono">Δ ＝ δ · π ＋ υ</code>.<br />
                  Ο Διαιρετέος ισούται με τον Διαιρέτη επί το Πηλίκο συν το Υπόλοιπο.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>1569 ＝ 8 · 196 ＋ 1</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                🎯 Χρησιμοποιούμε πάντοτε την ταυτότητα για να ελέγξουμε αν το αποτέλεσμα είναι σωστό.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΙΑΙΡΕΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Διαίρεσης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Άλλαξε τον Διαιρετέο και τον Διαιρέτη με τα κουμπιά αυξομείωσης (＋ / －) ή πληκτρολόγησε τους αριθμούς!
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
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="space-y-6">

            {/* ROW 1: INPUT CONTROLS & STATUS BADGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* INPUTS D & d (7 COLS) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* INPUT Δ (ΔΙΑΙΡΕΤΕΟΣ) */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-blue-800 tracking-wider block">
                        Διαιρετέος (Δ):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                        έως 9999
                      </span>
                    </div>
                    
                    <input
                      type="text"
                      inputMode="numeric"
                      value={dividendInput}
                      onChange={(e) => handleInputChange(e.target.value, setDividendInput)}
                      className="text-xl sm:text-2xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                      placeholder="1569"
                    />

                    {/* BUTTONS Δ */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setDividendInput(adjustValue(dividendInput, -10))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －10
                      </button>
                      <button
                        type="button"
                        onClick={() => setDividendInput(adjustValue(dividendInput, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setDividendInput(adjustValue(dividendInput, +1))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋1
                      </button>
                      <button
                        type="button"
                        onClick={() => setDividendInput(adjustValue(dividendInput, +10))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋10
                      </button>
                    </div>
                  </div>

                  {/* INPUT δ (ΔΙΑΙΡΕΤΗΣ) */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-emerald-800 tracking-wider block">
                        Διαιρέτης (δ):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        έως 99
                      </span>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={divisorInput}
                      onChange={(e) => handleInputChange(e.target.value, setDivisorInput, true)}
                      className="text-xl sm:text-2xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                      placeholder="8"
                    />

                    {/* BUTTONS δ */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDivisorInput(adjustValue(divisorInput, -1, true))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setDivisorInput(adjustValue(divisorInput, +1, true))}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                </div>

                {/* STATUS BADGE */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col gap-1 font-sans">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Ειδος Διαιρεσης:</span>
                  <div className={`text-xs sm:text-sm md:text-base font-black px-4 py-1.5 rounded-full inline-block mx-auto ${
                    isPerfect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isPerfect ? '🎯 ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (υ ＝ 0)' : '🔍 ΑΤΕΛΗΣ ΔΙΑΙΡΕΣΗ (υ ＞ 0)'}
                  </div>
                </div>
              </div>

              {/* DYNAMIC RESULT CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  ✨ Μαθηματικη Ταυτοτητα Επαληθευσης:
                </span>

                <div className="text-lg sm:text-xl md:text-2xl font-black font-mono bg-white/10 px-3.5 py-2 rounded-2xl border border-white/20 flex flex-wrap items-center justify-center">
                  <span className="text-blue-400">{D.toLocaleString('el-GR')}</span>
                  <span className="text-slate-400 font-sans mx-1.5">＝</span>
                  <span className="text-emerald-400">{d}</span>
                  <span className="text-amber-400 font-sans mx-1">·</span>
                  <span className="text-purple-300">{q.toLocaleString('el-GR')}</span>
                  <span className="text-amber-400 font-sans mx-1">＋</span>
                  <span className="text-rose-400">{r}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-left w-full pt-1">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <span className="text-slate-400 font-sans block text-[10px]">Πηλίκο (π):</span>
                    <strong className="text-purple-300 text-xs sm:text-sm">{q.toLocaleString('el-GR')}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <span className="text-slate-400 font-sans block text-[10px]">Υπόλοιπο (υ):</span>
                    <strong className="text-rose-300 text-xs sm:text-sm">{r}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: TABS & VISUALIZATION */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 md:p-6 rounded-2xl space-y-6">
              
              {/* TABS EΝΑΛΛΑΓΗΣ VIEW */}
              <div className="flex justify-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('katheti')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
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
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                    activeTab === 'moirasma'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🍕 Οπτικό Μοίρασμα σε Ομάδες
                </button>
              </div>

              {/* TAB CONTENT - 100% FLUID ΧΩΡΙΣ SCROLL */}
              <div className="flex flex-col items-center justify-center">
                {activeTab === 'katheti' ? (
                  <div className="w-full max-w-[340px] sm:max-w-[380px] bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-xl border-4 border-slate-700 font-mono text-base sm:text-xl md:text-2xl font-black relative min-h-[300px] flex py-6 sm:py-8 select-none justify-center">
                    <div className="flex w-full items-start justify-center">
                      
                      {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΕΟΣ & ΑΦΑΙΡΕΣΕΙΣ */}
                      <div className="flex flex-col items-end pr-2.5 sm:pr-4 text-right">
                        <div className="flex justify-end text-blue-400 font-bold mb-3 h-8 items-center">
                          <div className="w-4 sm:w-6"></div>
                          <div className="flex justify-end">
                            {divDigits.map((char, i) => (
                              <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
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
                                  <span className="w-4 sm:w-6 text-left text-rose-400 font-bold text-sm sm:text-base select-none">－</span>
                                  <div className="flex justify-end text-rose-300 font-medium">
                                    {productDigits.map((char, i) => (
                                      <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="w-full flex justify-end h-[2px] my-1">
                                  <div className="w-4 sm:w-6"></div>
                                  <div className="flex justify-end">
                                    {productDigits.map((char, i) => (
                                      <div key={i} className={`w-4 sm:w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`}></div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end w-full h-7 items-center">
                                  <div className="w-4 sm:w-6"></div>
                                  <div className="flex justify-end text-slate-200 font-black">
                                    {idx === schoolSteps.length - 1 ? (
                                      remainderDigits.map((char, i) => (
                                        <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
                                      ))
                                    ) : (
                                      getPaddedDigits(schoolSteps[idx + 1].workNum, schoolSteps[idx + 1].digitIndex).map((char, i) => (
                                        <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
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
                      <div className="w-[3px] bg-slate-600 self-stretch min-h-[200px] sm:min-h-[220px]"></div>

                      {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                      <div className="text-left pl-2.5 sm:pl-5 flex flex-col h-full justify-start">
                        <div className="text-emerald-400 font-bold border-b-4 border-slate-600 pb-2 tracking-wider flex w-full">
                          {divisorInput.split('').map((char, i) => (
                            <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
                          ))}
                        </div>
                        
                        <div className="text-purple-300 pt-3 font-black tracking-wider flex w-full">
                          {q.toString().split('').map((char, i) => (
                            <span key={i} className="w-4 sm:w-5 text-center">{char}</span>
                          ))}
                        </div>
                        
                        <div className="mt-auto pt-8 sm:pt-10 text-[10px] font-sans font-black uppercase text-rose-400 tracking-wider whitespace-nowrap">
                          🏁 Υπόλοιπο: {r}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center gap-4 w-full px-2 text-center">
                    {D <= LIMITS.MAX_VISUAL_BOXES && D > 0 && d > 0 ? (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <span className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
                          Μοίρασμα {D} στοιχείων σε {d} ίσες ομάδες:
                        </span>
                        
                        <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center max-h-[260px] sm:max-h-[280px] overflow-y-auto p-3 border rounded-2xl bg-white w-full max-w-xl shadow-inner">
                          {[...Array(Math.min(d, 30))].map((_, groupIdx) => (
                            <div key={groupIdx} className="bg-slate-50 border-2 border-emerald-300 p-2 sm:p-2.5 rounded-2xl flex flex-wrap gap-1 items-center justify-center min-w-[50px] sm:min-w-[60px] min-h-[50px] sm:min-h-[60px] shadow-xs">
                              {[...Array(q)].map((_, boxIdx) => (
                                <div key={boxIdx} className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-blue-500 rounded-xs shadow-xs" />
                              ))}
                            </div>
                          ))}
                        </div>

                        {r > 0 && (
                          <div className="flex flex-col items-center gap-1.5 mt-1">
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">📦 Περίσσεψαν (Υπόλοιπο ＝ {r}):</span>
                            <div className="flex gap-1.5 bg-rose-50 border border-rose-200 p-2 sm:p-2.5 rounded-xl">
                              {[...Array(r)].map((_, i) => (
                                <div key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-rose-500 rounded-xs shadow-xs" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-xs mx-auto text-slate-600 text-sm font-medium space-y-2 shadow-sm">
                        <p className="font-bold">📊 Οπτική Απεικόνιση</p>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          Βάλε έναν Διαιρετέο μικρότερο από {LIMITS.MAX_VISUAL_BOXES} για να δεις τα κουτάκια να μοιράζονται αυτόματα στις ομάδες.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Διαίρεση!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες την τέλεια και την ατελή διαίρεση; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/08-diairesi-ask"
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
