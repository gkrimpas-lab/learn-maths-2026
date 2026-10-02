// pages/st-dimotikou/21-dinameis.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [
  { base: 2, exp: 3, label: '2³ (2 στον κύβο)' },
  { base: 3, exp: 2, label: '3² (3 στο τετράγωνο)' },
  { base: 5, exp: 2, label: '5² (5 στο τετράγωνο)' },
  { base: 2, exp: 4, label: '2⁴ (2 στην 4η)' },
  { base: 10, exp: 3, label: '10³ (10 στον κύβο)' },
  { base: 4, exp: 3, label: '4³ (4 στον κύβο)' }
];

const MAX_BASE = 50;
const MAX_EXP = 10;

const EXPONENTS_UNICODE = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  10: '¹⁰'
};

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

export default function DinameisPage() {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);

  const handleBaseChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setBase('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_BASE) {
      setBase(n);
    }
  };

  const handleExpChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setExponent('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_EXP) {
      setExponent(n);
    }
  };

  const b = typeof base === 'number' ? base : 0;
  const e = typeof exponent === 'number' ? exponent : 0;

  // Υπολογισμος αποτελεσματος
  const result = Math.pow(b, e);

  // Δημιουργια λιστας παραγοντων
  const factorsList = e > 0 ? Array(e).fill(b) : [];
  const multiplicationString =
    e === 0
      ? '1 (εξ ορισμού)'
      : e === 1
      ? `${b}`
      : factorsList.join(' · ');

  // Αναγνωση δυναμης στα ελληνικα
  const getPowerPronunciation = (baseVal, expVal) => {
    if (expVal === 0) return `${baseVal} στη μηδενική`;
    if (expVal === 1) return `${baseVal} στην πρώτη (ή απλά ${baseVal})`;
    if (expVal === 2) return `${baseVal} στο τετράγωνο (ή ${baseVal} στη δευτέρα)`;
    if (expVal === 3) return `${baseVal} στον κύβο (ή ${baseVal} στην τρίτη)`;
    return `${baseVal} στην ${expVal}η δύναμη`;
  };

  return (
    <Layout
      title="Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Ανακάλυψε τη δύναμη του σύντομου πολλαπλασιασμού! Μάθε τι είναι η Βάση, τι δείχνει ο Εκθέτης και πώς υπολογίζουμε το Τετράγωνο και τον Κύβο ενός αριθμού για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/21-dinameis-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 21 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Δυνάμεις Φυσικών Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακάλυψε τη δύναμη του σύντομου πολλαπλασιασμού! Μάθε τι είναι η <strong>Βάση</strong>, τι δείχνει ο <strong>Εκθέτης</strong> και πώς υπολογίζουμε το <strong>Τετράγωνο</strong> και τον <strong>Κύβο</strong> ενός αριθμού!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ανάλυση Γινομένου &amp; Γεωμετρική Ερμηνεία (Τετράγωνο - Κύβος)</span>
            </div>
            <Link
              href="/st-dimotikou/21-dinameis-ask"
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
              Βασικές Έννοιες &amp; Ιδιότητες των Δυνάμεων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για τον σύντομο πολλαπλασιασμό ίσων παραγόντων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ίσοι Παράγοντες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Δύναμη;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Δύναμη</strong> είναι η σύντομη γραφή ενός γινομένου όπου <strong>όλοι οι παράγοντες είναι ίσοι</strong> μεταξύ τους.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2 · 2 · 2 · 2 ＝ <strong className="text-sky-700">2⁴ ＝ 16</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Όπως η πρόσθεση ίσων αριθμών γίνεται πολλαπλασιασμός (2 ＋ 2 ＋ 2 ＝ 3 · 2), έτσι και το γινόμενο ίσων αριθμών γίνεται δύναμη (2 · 2 · 2 ＝ 2³)!
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΡΟΛΟΣ ΣΤΟΙΧΕΙΩΝ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">α στην ν</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Βάση &amp; Εκθέτης
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • <strong>Βάση (α):</strong> Ο αριθμός που πολλαπλασιάζεται.<br />
                  • <strong>Εκθέτης (ν):</strong> Δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>α<sup>ν</sup> ＝ α · α · ... · α&nbsp;&nbsp;<span className="text-slate-500 font-sans font-normal text-xs">(ν φορές)</span></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ <strong>Προσοχή SOS:</strong> Το 2³ ΔΕΝ σημαίνει 2 · 3 ＝ 6! Σημαίνει 2 · 2 · 2 ＝ <strong>8</strong>.
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΙΔΙΚΟΙ ΚΑΝΟΝΕΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">Εκθέτες 0 &amp; 1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ειδικές Περιπτώσεις SOS
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • <strong>α¹ ＝ α:</strong> Κάθε αριθμός στον εκθέτη 1 παραμένει ίδιος.<br />
                  • <strong>α⁰ ＝ 1:</strong> Κάθε αριθμός (εκτός του 0) στον εκθέτη 0 ισούται με 1.<br />
                  • <strong>10<sup>ν</sup>:</strong> Το 1 ακολουθούμενο από ν μηδενικά.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex flex-wrap justify-center gap-2 font-bold">
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-800">5¹ ＝ 5</span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-800">7⁰ ＝ 1</span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-cyan-700">10³ ＝ 1.000</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Ο εκθέτης 2 ονομάζεται <strong>τετράγωνο</strong> (εμβαδόν) και ο εκθέτης 3 <strong>κύβος</strong> (όγκος)!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Δυνάμεων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Όρισε τη βάση και τον εκθέτη και δες άμεσα την ανάλυση σε γινόμενο, τη γεωμετρική απεικόνιση και τον τελικό υπολογισμό!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* INPUTS */}
                <div className="space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    ΡΥΘΜΙΣΗ ΔΥΝΑΜΗΣ:
                  </span>

                  {/* ΒΑΣΗ */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 flex justify-between uppercase">
                      <span>Βάση (α):</span>
                      <span className="text-blue-600 font-mono font-bold">1 － {MAX_BASE}</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={base}
                      onChange={(e) => handleBaseChange(e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                      placeholder="π.χ. 2"
                    />
                  </div>

                  {/* ΕΚΘΕΤΗΣ */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 flex justify-between uppercase">
                      <span>Εκθέτης (ν):</span>
                      <span className="text-indigo-600 font-mono font-bold">0 － {MAX_EXP}</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={exponent}
                      onChange={(e) => handleExpChange(e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                      placeholder="π.χ. 3"
                    />
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBase(p.base);
                          setExponent(p.exp);
                        }}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
                          b === p.base && e === p.exp
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        {p.base}{EXPONENTS_UNICODE[p.exp] || `^${p.exp}`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 <strong>Προσοχή:</strong> Το 2³ ΔΕΝ είναι 2 · 3 ＝ 6, αλλά 2 · 2 · 2 ＝ <strong>8</strong>!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS */}
              <div className="w-full text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  ΑΝΑΛΥΣΗ ΤΗΣ ΔΥΝΑΜΗΣ:
                </span>
                <div className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 sm:px-8 py-2 rounded-2xl border border-indigo-100 inline-block tracking-wider shadow-sm">
                  {base !== '' ? base : 'α'}
                  <sup className="text-rose-600 text-lg sm:text-xl md:text-2xl">
                    {exponent !== '' ? (EXPONENTS_UNICODE[e] || exponent) : 'ν'}
                  </sup>
                  {' ＝ '}
                  <span className="text-amber-500">
                    {base !== '' && exponent !== '' ? formatNumber(result) : '—'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium italic pt-1">
                  📖 Διαβάζεται: «{getPowerPronunciation(b, e)}»
                </p>
              </div>

              {/* 2. ΑΝΑΛΥΣΗ ΣΕ ΓΙΝΟΜΕΝΟ & ΟΠΤΙΚΟΠΟΙΗΣΗ */}
              <div className="w-full space-y-4">
                
                {/* ΚΑΡΤΑ ΑΝΑΛΥΣΗΣ ΓΙΝΟΜΕΝΟΥ */}
                <div className="bg-slate-50 p-4 sm:p-5 md:p-6 rounded-3xl border border-slate-200 shadow-inner space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center sm:text-left">
                    🔍 1. ΑΝΑΛΥΣΗ ΣΕ ΓΙΝΟΜΕΝΟ ΙΣΩΝ ΠΑΡΑΓΟΝΤΩΝ:
                  </span>

                  <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm sm:text-base md:text-lg">
                    <span className="font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">
                      {b}{EXPONENTS_UNICODE[e] || `^${e}`}
                    </span>
                    <span className="text-slate-400 font-black">＝</span>
                    
                    {e === 0 ? (
                      <span className="text-slate-600 font-bold bg-white px-3 sm:px-4 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-center">
                        1 (Κάθε μη μηδενικός αριθμός με εκθέτη 0 ισούται με 1)
                      </span>
                    ) : e === 1 ? (
                      <span className="text-slate-800 font-bold bg-white px-4 py-1.5 rounded-xl border border-slate-200">
                        {b} (1 παράγοντας)
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        {factorsList.map((factor, idx) => (
                          <span key={idx} className="flex items-center gap-1.5">
                            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-black flex items-center justify-center text-xs sm:text-sm shadow-xs">
                              {factor}
                            </span>
                            {idx < factorsList.length - 1 && (
                              <span className="text-slate-400 font-black text-xs sm:text-sm">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-slate-400 font-black">＝</span>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-3 sm:px-4 py-1 rounded-xl border border-emerald-300">
                      {formatNumber(result)}
                    </span>
                  </div>

                  <p className="text-center text-xs text-slate-500 font-medium">
                    {e > 1 && `Πολλαπλασιάζουμε τη βάση (${b}) με τον εαυτό της ${e} φορές.`}
                  </p>
                </div>

                {/* ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΓΙΑ ΤΕΤΡΑΓΩΝΟ (e=2) ΚΑΙ ΚΥΒΟ (e=3) */}
                {(e === 2 || e === 3) && b <= 12 && b >= 1 && (
                  <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                    <span className="text-xs 2xl:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                      📐 ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ ({e === 2 ? 'ΤΕΤΡΑΓΩΝΟ' : 'ΚΥΒΟΣ'}):
                    </span>

                    {e === 2 ? (
                      <div className="flex flex-col items-center space-y-2 overflow-x-auto p-1">
                        <div
                          className="grid gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shadow-inner max-w-full"
                          style={{
                            gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))`,
                            width: 'fit-content'
                          }}
                        >
                          {Array.from({ length: b * b }).map((_, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 sm:w-6 sm:h-6 rounded-md bg-blue-500/80 border border-blue-400/40 shadow-xs"
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-slate-300 text-center">
                          Εμβαδόν Τετραγώνου με πλευρά {b}: <strong className="text-amber-300">{b} · {b} ＝ {formatNumber(result)}</strong> τετραγωνάκια
                        </span>
                      </div>
                    ) : (
                      <div className="text-center space-y-1.5 py-1">
                        <div className="text-3xl">🧊</div>
                        <p className="text-xs sm:text-sm font-mono text-slate-200">
                          Όγκος Κύβου με ακμή {b}: <strong className="text-amber-300">{b} · {b} · {b} ＝ {formatNumber(result)}</strong> κυβάκια
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* 3. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ:
                </span>
                <div className="text-base sm:text-xl md:text-2xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>
                    {b}
                    <sup className="text-rose-300">{EXPONENTS_UNICODE[e] || `^${e}`}</sup>
                  </span>
                  <span>＝</span>
                  <span className="text-blue-100 text-sm sm:text-lg md:text-xl font-medium">
                    ({multiplicationString})
                  </span>
                  <span>＝</span>
                  <span className="text-amber-300 text-xl sm:text-2xl md:text-3xl font-black bg-white/10 px-3 py-0.5 rounded-xl shadow-xs inline-block">
                    {formatNumber(result)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Δυνάμεις!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να υπολογίζεις δυνάμεις, τετράγωνα και κύβους; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/21-dinameis-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
