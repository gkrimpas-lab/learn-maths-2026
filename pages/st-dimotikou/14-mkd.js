// pages/st-dimotikou/14-mkd.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS_2 = [
  { n1: 12, n2: 18, label: 'Μ.Κ.Δ.(12, 18)' },
  { n1: 20, n2: 30, label: 'Μ.Κ.Δ.(20, 30)' },
  { n1: 24, n2: 36, label: 'Μ.Κ.Δ.(24, 36)' }
];
const PRESETS_3 = [
  { n1: 12, n2: 18, n3: 24, label: 'Μ.Κ.Δ.(12, 18, 24)' },
  { n1: 15, n2: 30, n3: 45, label: 'Μ.Κ.Δ.(15, 30, 45)' },
  { n1: 16, n2: 24, n3: 32, label: 'Μ.Κ.Δ.(16, 24, 32)' }
];
const PRESETS_4 = [
  { n1: 12, n2: 16, n3: 20, n4: 24, label: 'Μ.Κ.Δ.(12, 16, 20, 24)' },
  { n1: 20, n2: 40, n3: 60, n4: 80, label: 'Μ.Κ.Δ.(20, 40, 60, 80)' }
];

export default function MkdPage() {
  const [activeTab, setActiveTab] = useState(2); // 2, 3 ή 4 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(24);
  const [num4, setNum4] = useState(36);

  const handleInputChange = (setter, val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setter('');
    } else if (parsed > 100) {
      setter(100);
    } else {
      setter(parsed);
    }
  };

  // Εύρεση διαιρετών
  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const divisors1 = getDivisors(num1);
  const divisors2 = getDivisors(num2);
  const divisors3 = getDivisors(num3);
  const divisors4 = getDivisors(num4);

  // Υπολογισμός Κοινών Διαιρετών και ΜΚΔ ανάλογα με το Tab
  let commonDivisors = [];
  let numbersList = [];

  if (activeTab === 2) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' }
    ];
  } else if (activeTab === 3) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d) && divisors3.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' }
    ];
  } else if (activeTab === 4) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d) && divisors3.includes(d) && divisors4.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' },
      { val: num4, div: divisors4, color: 'text-pink-600', bg: 'bg-pink-600/80', label: '4ος Αριθμός' }
    ];
  }

  const mkd = commonDivisors.length > 0 ? Math.max(...commonDivisors) : 1;
  const currentNumbersString = numbersList.map((n) => n.val || '?').join(', ');

  return (
    <Layout
      title="Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς να βρίσκεις τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/14-mkd-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 14 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς να βρίσκεις τους <strong>κοινούς διαιρέτες</strong> δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> για τέλειο ισόποσο μοίρασμα χωρίς υπόλοιπο!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κοινοί Διαιρέτες &amp; Διαδραστική Οπτική Κατάτμηση</span>
            </div>
            <Link
              href="/st-dimotikou/14-mkd-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Στρατηγική Εύρεσης
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Κατανόησε τη σημασία του Μ.Κ.Δ. και πώς χρησιμοποιείται στην επίλυση προβλημάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μέγιστος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Μ.Κ.Δ.;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Μέγιστος Κοινός Διαιρέτης</strong> δύο ή περισσότερων φυσικών αριθμών ονομάζεται ο <strong>μεγαλύτερος</strong> από όλους τους κοινούς τους διαιρέτες.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Μ.Κ.Δ.(12, 18) ＝ <strong className="text-blue-700">6</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο Μ.Κ.Δ. εκφράζει το μέγιστο μέγεθος ομάδας για τέλειο μοίρασμα χωρίς να περισσεύει τίποτα.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">3 Βήματα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς τον βρίσκουμε;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  1. Γράφουμε όλους τους διαιρέτες κάθε αριθμού.<br />
                  2. Εντοπίζουμε τους <strong>κοινούς διαιρέτες</strong>.<br />
                  3. Επιλέγουμε τον <strong>μεγαλύτερο</strong> από αυτούς.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Κοινοί(12, 18) ＝ {'{'} 1, 2, 3, <strong className="text-indigo-700">6</strong> {'}'}</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Όλοι οι κοινοί διαιρέτες είναι πάντοτε και διαιρέτες του Μ.Κ.Δ.!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">Μ.Κ.Δ. ＝ 1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πρώτοι μεταξύ τους
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν δύο αριθμοί δεν έχουν κανέναν άλλο κοινό διαιρέτη εκτός από το <strong>1</strong>, τότε ονομάζονται <strong>πρώτοι μεταξύ τους</strong> (Μ.Κ.Δ. ＝ 1).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Μ.Κ.Δ.(8, 15) ＝ <strong className="text-cyan-700">1</strong></p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Δύο διαδοχικοί φυσικοί αριθμοί (π.χ. 8 και 9) είναι πάντοτε πρώτοι μεταξύ τους.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΥΠΟΛΟΓΙΣΜΟΥ Μ.Κ.Δ. */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Υπολογισμού Μ.Κ.Δ.
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Διάλεξε πόσους αριθμούς θέλεις να συγκρίνεις (2, 3 ή 4) και δες αυτόματα όλους τους κοινούς διαιρέτες και τον Μ.Κ.Δ.!
              </p>
            </div>

            {/* TABS SELECTOR (2, 3, 4 NUMBERS) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              {[2, 3, 4].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} ΑΡΙΘΜΟΙ
                </button>
              ))}
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε τους Αριθμούς (1 - 100):
                  </span>
                  <p className="text-xs 2xl:text-sm text-slate-500">Συμπλήρωσε τους αριθμούς στα αντίστοιχα πεδία.</p>
                </div>

                {/* DYNAMIC INPUTS GRID */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">1ος Αριθμός</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-300 rounded-xl text-blue-600 outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">2ος Αριθμός</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-300 rounded-xl text-indigo-600 outline-none focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                  {activeTab >= 3 && (
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">3ος Αριθμός</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num3}
                        onChange={(e) => handleInputChange(setNum3, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-purple-300 rounded-xl text-purple-600 outline-none focus:border-purple-500 shadow-sm"
                      />
                    </div>
                  )}
                  {activeTab === 4 && (
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">4ος Αριθμός</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num4}
                        onChange={(e) => handleInputChange(setNum4, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-pink-300 rounded-xl text-pink-600 outline-none focus:border-pink-500 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* PRESETS LIST */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Ή επίλεξε έτοιμο παράδειγμα:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {activeTab === 2 && PRESETS_2.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95"
                      >
                        {p.label}
                      </button>
                    ))}
                    {activeTab === 3 && PRESETS_3.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95"
                      >
                        {p.label}
                      </button>
                    ))}
                    {activeTab === 4 && PRESETS_4.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); setNum4(p.n4); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Οι κοινοί διαιρέτες επισημαίνονται με κίτρινο πλαίσιο και ο <strong>Μ.Κ.Δ.</strong> με χρυσό τρόπαιο 🏆!
              </div>
            </div>

            {/* RIGHT: LIVE DIVISORS & SEGMENT VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[420px] sm:min-h-[460px] space-y-6">
              
              {/* DIVISORS LISTS FOR EACH NUMBER */}
              <div className="w-full space-y-3">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                    <div className="text-xs sm:text-sm font-bold text-slate-700 flex justify-between items-center flex-wrap gap-1">
                      <span>
                        🔍 Διαιρέτες του <strong className={`${numObj.color} text-sm sm:text-base font-black`}>{numObj.val || '—'}</strong> ({numObj.label}):
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-mono">
                        {numObj.div.length} διαιρέτες
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {numObj.div.map((d) => {
                        const isCommon = commonDivisors.includes(d);
                        const isMkd = d === mkd;
                        return (
                          <span
                            key={d}
                            className={`font-mono font-black px-2.5 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border transition-all ${
                              isMkd
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105 ring-2 ring-amber-300'
                                : isCommon
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {d} {isMkd && '🏆'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* VISUAL SEGMENT BARS */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                  📊 ΟΠΤΙΚΗ ΚΑΤΑΤΜΗΣΗ: ΠΩΣ Ο Μ.Κ.Δ. ({mkd}) ΜΕΤΡΑΕΙ ΑΚΡΙΒΩΣ ΤΟΥΣ ΑΡΙΘΜΟΥΣ
                </span>

                <div className="space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
                  {numbersList.map((numObj, idx) => {
                    if (!numObj.val || mkd <= 0) return null;
                    const segments = numObj.val / mkd;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="text-slate-300 flex justify-between text-[11px] sm:text-xs flex-wrap gap-1">
                          <span>{numObj.label} ({numObj.val}):</span>
                          <span className={`${numObj.color} font-bold brightness-125`}>
                            {segments} κομμάτια των {mkd}
                          </span>
                        </div>
                        <div className="flex w-full bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-700">
                          {Array.from({ length: segments }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-full border-r border-slate-900 ${numObj.bg} flex items-center justify-center font-black text-white text-[10px]`}
                              style={{ width: `${100 / segments}%` }}
                            >
                              {mkd}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FINAL RESULT BADGE */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-xs md:text-sm font-sans uppercase tracking-wider">ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ:</span>
                <span className="text-lg sm:text-xl md:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                  Μ.Κ.Δ.({currentNumbersString}) ＝ {mkd}
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Μ.Κ.Δ.!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες πώς υπολογίζεται ο Μέγιστος Κοινός Διαιρέτης; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/14-mkd-ask"
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
