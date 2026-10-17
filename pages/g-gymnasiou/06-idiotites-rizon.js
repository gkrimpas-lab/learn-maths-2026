import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const map = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'Ϊ': 'Ι', 'Ϋ': 'Υ',
    'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω',
    'ϊ': 'Ι', 'ϋ': 'Υ', 'ΐ': 'Ι', 'ΰ': 'Υ'
  };
  return str.split('').map(char => map[char] || char.toUpperCase()).join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 shrink-0 leading-none ${className}`}>
      <span className="border-b-[1.5px] border-current px-0.5 pb-0.5 text-center text-[0.88em] w-full block">
        {num}
      </span>
      <span className="px-0.5 pt-0.5 text-center text-[0.88em] w-full block">
        {den}
      </span>
    </span>
  );
}

// Βοηθητική απλοποίησης ρίζας: √n = a√b
function simplifySquareRoot(n) {
  if (n <= 0) return { factor: 0, remainder: 0 };
  let factor = 1;
  let remainder = n;
  for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
    if (remainder % (i * i) === 0) {
      factor *= i;
      remainder /= (i * i);
    }
  }
  return { factor, remainder };
}

export default function IdiotitesRizonTheory() {
  // State για το διαδραστικό εργαστήριο
  const [operation, setOperation] = useState('mult'); // 'mult' ή 'div'
  const [valA, setValA] = useState(12);
  const [valB, setValB] = useState(3);

  // Υπολογισμοί εργαστηρίου
  let calcResult = null;
  let stepText = '';

  if (operation === 'mult') {
    const prod = valA * valB;
    const { factor, remainder } = simplifySquareRoot(prod);
    if (remainder === 1) {
      calcResult = `${factor}`;
      stepText = `√${valA} · √${valB} ＝ √(${valA} · ${valB}) ＝ √${prod} ＝ ${factor} (τέλειο τετράγωνο, ρητός αριθμός).`;
    } else if (factor === 1) {
      calcResult = <Radical>{prod}</Radical>;
      stepText = `√${valA} · √${valB} ＝ √(${valA} · ${valB}) ＝ √${prod} (δεν απλοποιείται περαιτέρω).`;
    } else {
      calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
      stepText = `√${valA} · √${valB} ＝ √(${valA} · ${valB}) ＝ √${prod} ＝ √(${factor * factor} · ${remainder}) ＝ ${factor} · √${remainder}.`;
    }
  } else {
    // Διαίρεση √a / √b
    if (valA % valB === 0) {
      const q = valA / valB;
      const { factor, remainder } = simplifySquareRoot(q);
      if (remainder === 1) {
        calcResult = `${factor}`;
        stepText = `√${valA} / √${valB} ＝ √(${valA} / ${valB}) ＝ √${q} ＝ ${factor}.`;
      } else if (factor === 1) {
        calcResult = <Radical>{q}</Radical>;
        stepText = `√${valA} / √${valB} ＝ √(${valA} / ${valB}) ＝ √${q}.`;
      } else {
        calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
        stepText = `√${valA} / √${valB} ＝ √(${valA} / ${valB}) ＝ √${q} ＝ ${factor} · √${remainder}.`;
      }
    } else {
      // Ρητοποίηση: (√a · √b) / b
      const prod = valA * valB;
      const { factor, remainder } = simplifySquareRoot(prod);
      calcResult = (
        <Frac
          num={factor === 1 ? <Radical>{remainder}</Radical> : <span className="inline-flex items-center gap-0.5">{factor} · <Radical>{remainder}</Radical></span>}
          den={valB}
        />
      );
      stepText = `Ρητοποίηση παρονομαστή: (√${valA} · √${valB}) / (√${valB} · √${valB}) ＝ √${prod} / ${valB}.`;
    }
  }

  return (
    <Layout
      title="Ιδιότητες Τετραγωνικών Ριζών | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τις τετραγωνικές ρίζες, ιδιότητες γινομένου και πηλίκου, εξαγωγή παράγοντα και ρητοποίηση παρονομαστή με διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/06-idiotites-rizon-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 6 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Ιδιότητες των Τετραγωνικών Ριζών
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Ανακαλύψτε πώς οι τετραγωνικές ρίζες συνδυάζονται, πολλαπλασιάζονται και διαιρούνται. Μάθετε να απλοποιείτε ριζικές παραστάσεις εξάγοντας τέλεια τετράγωνα και εξοικειωθείτε με τη ρητοποίηση του παρονομαστή.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/06-idiotites-rizon-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ορισμός & Βασικές Συνέπειες
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Τετραγωνική ρίζα</strong> ενός μη αρνητικού αριθμού α (α ≥ 0) ονομάζεται ο μη αρνητικός αριθμός x (x ≥ 0) του οποίου το τετράγωνο ισούται με α:
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-center">
                <div className="font-mono text-sm sm:text-base font-black text-indigo-900 inline-flex flex-wrap items-center justify-center gap-2">
                  <span>Αν <Radical>α</Radical> ＝ x (με α ≥ 0, x ≥ 0) τότε x² ＝ α</span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-1.5">
                  <span>• Για α ≥ 0:</span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex items-center gap-1">
                    (<Radical>α</Radical>)² ＝ <Radical>α²</Radical> ＝ α
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center gap-1.5 text-amber-950">
                  <span>• Για <strong>κάθε</strong> πραγματικό αριθμό α:</span>
                  <span className="font-mono font-bold text-amber-900 inline-flex items-center gap-1">
                    <Radical>α²</Radical> ＝ |α|
                  </span>
                  <div className="text-[11px] text-amber-800 w-full mt-1">
                    Π.χ. <Radical>(－5)²</Radical> ＝ |－5| ＝ 5 και <strong>ΟΧΙ</strong> －5 (αφού η ρίζα είναι πάντοτε ≥ 0).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ιδιότητες Γινομένου & Πηλίκου
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για μη αρνητικούς πραγματικούς αριθμούς α, β ισχύουν οι κανόνες συνένωσης και διαχωρισμού:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm font-mono text-slate-800">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-sans font-semibold">Γινόμενο Ριζών (α, β ≥ 0):</span>
                  <strong className="text-indigo-900 inline-flex items-center gap-1">
                    <Radical>α</Radical> · <Radical>β</Radical> ＝ <Radical>α · β</Radical>
                  </strong>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-sans font-semibold">Πηλίκο Ριζών (α ≥ 0, β ＞ 0):</span>
                  <strong className="text-indigo-900 inline-flex items-center gap-1">
                    <Frac num={<Radical>α</Radical>} den={<Radical>β</Radical>} /> ＝ <Radical><Frac num="α" den="β" /></Radical>
                  </strong>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 leading-relaxed">
                <strong>Προσοχή (Αντιπαράδειγμα):</strong> <br />
                Στην πρόσθεση <strong>ΔΕΝ</strong> ισχύει: <Radical>16 ＋ 9</Radical> ＝ <Radical>25</Radical> ＝ 5, ενώ <Radical>16</Radical> ＋ <Radical>9</Radical> ＝ 4 ＋ 3 ＝ 7 ≠ 5. <br />
                Άρα γενικά: <strong><Radical>α ＋ β</Radical> ≠ <Radical>α</Radical> ＋ <Radical>β</Radical></strong>.
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Εξαγωγή Παράγοντα από τη Ρίζα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Αναλύουμε την υπόριζη ποσότητα σε γινόμενο όπου ένας παράγοντας είναι τέλειο τετράγωνο:
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner font-mono text-sm sm:text-base font-bold">
                <Radical>α² · β</Radical> ＝ <Radical>α²</Radical> · <Radical>β</Radical> ＝ α · <Radical>β</Radical> &nbsp; (όπου α ≥ 0, β ≥ 0)
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>12</Radical> ＝ <Radical>4 · 3</Radical> ＝ <Radical>2² · 3</Radical> ＝ </span>
                  <strong className="text-indigo-900">2 · <Radical>3</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>50</Radical> ＝ <Radical>25 · 2</Radical> ＝ <Radical>5² · 2</Radical> ＝ </span>
                  <strong className="text-indigo-900">5 · <Radical>2</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>72</Radical> ＝ <Radical>36 · 2</Radical> ＝ </span>
                  <strong className="text-indigo-900">6 · <Radical>2</Radical></strong>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ρητοποίηση Παρονομαστή
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Στα κλάσματα μας διευκολύνει να μην έχουμε άρρητους στον παρονομαστή. Πολλαπλασιάζουμε αριθμητή και παρονομαστή με την κατάλληλη ρίζα:
              </p>

              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 flex flex-wrap items-center justify-center gap-2 text-center">
                <Frac num="Α" den={<Radical>β</Radical>} />
                <span>＝</span>
                <Frac num={<span>Α · <Radical>β</Radical></span>} den={<span><Radical>β</Radical> · <Radical>β</Radical></span>} />
                <span>＝</span>
                <Frac num={<span>Α · <Radical>β</Radical></span>} den="β" />
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1.5 font-mono text-emerald-950">
                  <span>•</span>
                  <Frac num="1" den={<Radical>3</Radical>} />
                  <span>＝</span>
                  <Frac num={<Radical>3</Radical>} den="(<Radical>3</Radical>)²" />
                  <span>＝</span>
                  <strong><Frac num={<Radical>3</Radical>} den="3" /></strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1.5 font-mono text-emerald-950">
                  <span>•</span>
                  <Frac num="6" den={<Radical>2</Radical>} />
                  <span>＝</span>
                  <Frac num={<span>6 · <Radical>2</Radical></span>} den="2" />
                  <span>＝</span>
                  <strong>3 · <Radical>2</Radical></strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - 100% RESPONSIVE XΩΡΙΣ SCROLL */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΙΔΙΟΤΗΤΩΝ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής Γινομένου & Πηλίκου Ριζών
              </h2>
            </div>
            {/* Επιλογέας πράξης */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                onClick={() => setOperation('mult')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  operation === 'mult' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Γινόμενο (<Radical>α</Radical> · <Radical>β</Radical>)
              </button>
              <button
                onClick={() => setOperation('div')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  operation === 'div' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Πηλίκο (<Radical>α</Radical> / <Radical>β</Radical>)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Sliders επιλογής τιμών */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Υπόριζο α:</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">
                    {valA}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={valA}
                  onChange={(e) => setValA(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Υπόριζο β:</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">
                    {valB}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={valB}
                  onChange={(e) => setValB(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Γρήγορα κουμπιά δοκιμών */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase">Δοκιμαστε κλασικα ζευγη:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button onClick={() => { setValA(3); setValB(12); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400">√3 · √12</button>
                  <button onClick={() => { setValA(2); setValB(32); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400">√2 · √32</button>
                  <button onClick={() => { setValA(48); setValB(3); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400">√48 / √3</button>
                  <button onClick={() => { setValA(18); setValB(2); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400">√18 / √2</button>
                </div>
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ")}
                </span>
                <div className="text-xl sm:text-3xl lg:text-4xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1">
                  {operation === 'mult' ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Radical>{valA}</Radical> · <Radical>{valB}</Radical>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} />
                    </span>
                  )}
                  <span className="text-indigo-400">＝</span>
                  <span className="text-emerald-400 inline-flex items-center break-all">
                    {calcResult}
                  </span>
                </div>
              </div>

              {/* Επεξήγηση βήματος */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 block uppercase">
                  {toCleanUppercase("ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ & ΑΠΛΟΠΟΙΗΣΗΣ")}:
                </span>
                <p className="leading-relaxed font-mono font-medium text-slate-800">
                  {stepText}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΑΠΟ ΤΟ ΝΕΟ ΣΧΟΛΙΚΟ ΒΙΒΛΙΟ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 (Άσκηση 28 σελ. 37 σχολικού) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΓΕΩΜΕΤΡΙΑ & ΡΙΖΕΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Υπολογισμός ύψους ορθογωνίου τριγώνου με ρίζες
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Σε ορθογώνιο τρίγωνο ΑΒΓ (ορθή η γωνία Α), οι κάθετες πλευρές είναι <strong>ΑΒ ＝ 4 · <Radical>2</Radical> cm</strong> και <strong>ΑΓ ＝ 3 · <Radical>2</Radical> cm</strong>. <br />
                  Να υπολογιστεί η υποτείνουσα ΒΓ και το ύψος ΑΔ προς την υποτείνουσα σε μορφή <Frac num={<span>α · <Radical>2</Radical></span>} den="β" />.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Μέγεθος</th>
                        <th className="p-2 sm:p-2.5 border-b">Μαθηματικός Τύπος</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Υποτείνουσα ΒΓ</td>
                        <td className="p-2 sm:p-2.5">ΒΓ² ＝ ΑΒ² ＋ ΑΓ²</td>
                        <td className="p-2 sm:p-2.5">(4√2)² ＋ (3√2)² ＝ 32 ＋ 18 ＝ 50 ⇒ ΒΓ ＝ √50 ＝ 5√2 cm</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Εμβαδόν (Ε)</td>
                        <td className="p-2 sm:p-2.5">Ε ＝ (ΑΒ · ΑΓ) / 2</td>
                        <td className="p-2 sm:p-2.5">(4√2 · 3√2) / 2 ＝ 24 / 2 ＝ 12 cm²</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Ύψος ΑΔ</td>
                        <td className="p-2 sm:p-2.5">ΑΔ ＝ (2 · Ε) / ΒΓ</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">24 / (5√2) ＝ (24√2) / 10 ＝ 12√2 / 5 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Τελικό Ύψος ΑΔ:</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1"><Frac num={<span>12 · <Radical>2</Radical></span>} den="5" /> cm</span>.
                  </div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 (Άσκηση 17γ σελ. 37 σχολικού) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΡΗΤΟΠΟΙΗΣΗ & ΑΦΑΙΡΕΣΗ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Απλοποίηση διαφοράς κλασμάτων με ρίζες
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να υπολογιστεί η διαφορά των κλασμάτων με ρητοποίηση παρονομαστών: <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 mt-1">
                    Α ＝ <Frac num={<span>2 · <Radical>5</Radical></span>} den={<Radical>2</Radical>} /> － <Frac num={<span>3 · <Radical>2</Radical></span>} den={<Radical>5</Radical>} />
                  </span>
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Όρος</th>
                        <th className="p-2 sm:p-2.5 border-b">Ρητοποίηση</th>
                        <th className="p-2 sm:p-2.5 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1ο Κλάσμα</td>
                        <td className="p-2 sm:p-2.5">(2√5 · √2) / (√2 · √2)</td>
                        <td className="p-2 sm:p-2.5">(2√10) / 2 ＝ √10</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2ο Κλάσμα</td>
                        <td className="p-2 sm:p-2.5">(3√2 · √5) / (√5 · √5)</td>
                        <td className="p-2 sm:p-2.5">(3√10) / 5</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">Διαφορά</td>
                        <td className="p-2 sm:p-2.5">√10 － (3√10) / 5</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">(5√10 － 3√10) / 5 ＝ 2√10 / 5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Τελική Τιμή:</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1"><Frac num={<span>2 · <Radical>10</Radical></span>} den="5" /></span>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΤΕΤΡΑΓΩΝΙΚΕΣ ΡΙΖΕΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Η τετραγωνική ρίζα δεν επιμερίζεται σε άθροισμα:</strong> <Radical>α ＋ β</Radical> <strong>ΔΕΝ</strong> ισούται με <Radical>α</Radical> ＋ <Radical>β</Radical>. Οι ιδιότητες ισχύουν <em>αποκλειστικά για γινόμενο και πηλίκο</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Πρόσημο ρίζας:</strong> Από τον ορισμό, η έκφραση <Radical>α</Radical> είναι πάντοτε <strong>μη αρνητικός αριθμός</strong> (<Radical>α</Radical> ≥ 0). Επομένως <Radical>9</Radical> ＝ 3 και <strong>ΠΟΤΕ</strong> ±3.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Εξαγωγή παράγοντα με αρνητικό συντελεστή:</strong> Ισχύει <Radical>α² · β</Radical> ＝ |α| · <Radical>β</Radical>. Αν ο α είναι αρνητικός, βγαίνει έξω ως －α (π.χ. <Radical>(－3)² · 2</Radical> ＝ |－3| · <Radical>2</Radical> ＝ 3 · <Radical>2</Radical>).</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εξασκηθείτε στις Ιδιότητες των Ριζών!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις δυνάμεις σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα απλοποίησης και ρητοποίησης με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/06-idiotites-rizon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
