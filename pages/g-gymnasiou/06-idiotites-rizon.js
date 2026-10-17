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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) για απλούς αριθμούς/μεταβλητές
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction)
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

// Ενιαίο SVG Component για Ρίζα Κλάσματος √(num / den)
function RadicalFrac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle ${className}`}>
      <svg
        viewBox="0 0 42 46"
        className="h-[2.3em] w-auto overflow-visible select-none font-mono"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 24 L5 24 L9 42 L16 3 L40 3" />
        <line x1="18" y1="23" x2="38" y2="23" strokeWidth="1.6" />
        <text
          x="28"
          y="18"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="15"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {num}
        </text>
        <text
          x="28"
          y="37"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="15"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {den}
        </text>
      </svg>
    </span>
  );
}

// Βοηθητική συνάρτηση απλοποίησης ρίζας: √n = a√b
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
  const [operation, setOperation] = useState('mult');
  const [valA, setValA] = useState(12);
  const [valB, setValB] = useState(3);

  let calcResult = null;
  let stepContent = null;

  if (operation === 'mult') {
    const prod = valA * valB;
    const { factor, remainder } = simplifySquareRoot(prod);
    if (remainder === 1) {
      calcResult = `${factor}`;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> ＝ {factor} (τέλειο τετράγωνο, ρητός αριθμός).
        </span>
      );
    } else if (factor === 1) {
      calcResult = <Radical>{prod}</Radical>;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> (δεν απλοποιείται περαιτέρω).
        </span>
      );
    } else {
      calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> ＝ <Radical>{factor * factor} · {remainder}</Radical> ＝ {factor} · <Radical>{remainder}</Radical>.
        </span>
      );
    }
  } else {
    if (valA % valB === 0) {
      const q = valA / valB;
      const { factor, remainder } = simplifySquareRoot(q);
      if (remainder === 1) {
        calcResult = `${factor}`;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical> ＝ {factor}.
          </span>
        );
      } else if (factor === 1) {
        calcResult = <Radical>{q}</Radical>;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical>.
          </span>
        );
      } else {
        calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical> ＝ {factor} · <Radical>{remainder}</Radical>.
          </span>
        );
      }
    } else {
      const prod = valA * valB;
      const { factor, remainder } = simplifySquareRoot(prod);
      calcResult = (
        <Frac
          num={factor === 1 ? <Radical>{remainder}</Radical> : <span className="inline-flex items-center gap-0.5">{factor} · <Radical>{remainder}</Radical></span>}
          den={valB}
        />
      );
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ρητοποίηση παρονομαστή: <Frac num={<span><Radical>{valA}</Radical> · <Radical>{valB}</Radical></span>} den={<span><Radical>{valB}</Radical> · <Radical>{valB}</Radical></span>} /> ＝ <Frac num={<Radical>{prod}</Radical>} den={valB} />.
        </span>
      );
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
                  <div className="text-[11px] text-amber-800 w-full mt-1 flex flex-wrap items-center gap-1">
                    <span>Π.χ.</span>
                    <span className="font-mono font-bold"><Radical>(－6)²</Radical> ＝ |－6| ＝ 6</span>
                    <span>και <strong>ΟΧΙ</strong> －6 (η τιμή της ρίζας είναι πάντα ≥ 0).</span>
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
                  <strong className="text-indigo-900 inline-flex items-center gap-1.5">
                    <Frac num={<Radical>α</Radical>} den={<Radical>β</Radical>} /> ＝ <RadicalFrac num="α" den="β" />
                  </strong>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 leading-relaxed">
                <strong>Προσοχή:</strong> Η ρίζα δεν επιμερίζεται σε άθροισμα: <br />
                <span className="font-mono font-bold mt-1 inline-flex flex-wrap items-center gap-1">
                  <Radical>64 ＋ 36</Radical> ＝ <Radical>100</Radical> ＝ 10 ≠ <Radical>64</Radical> ＋ <Radical>36</Radical> ＝ 8 ＋ 6 ＝ 14.
                </span>
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

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner font-mono text-sm sm:text-base font-bold flex flex-wrap items-center justify-center gap-1">
                <span><Radical>α² · β</Radical> ＝ <Radical>α²</Radical> · <Radical>β</Radical> ＝ α · <Radical>β</Radical></span>
                <span className="text-xs text-indigo-200 ml-1">(όπου α ≥ 0, β ≥ 0)</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>28</Radical> ＝ <Radical>4 · 7</Radical> ＝ <Radical>2² · 7</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">2 · <Radical>7</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>45</Radical> ＝ <Radical>9 · 5</Radical> ＝ <Radical>3² · 5</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">3 · <Radical>5</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span>• <Radical>98</Radical> ＝ <Radical>49 · 2</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">7 · <Radical>2</Radical></strong>
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
                Όταν ο παρονομαστής περιέχει άρρητη ρίζα, πολλαπλασιάζουμε αριθμητή και παρονομαστή με την ίδια ρίζα ώστε να προκύψει ακέραιος παρονομαστής:
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
                  <Frac num="1" den={<Radical>5</Radical>} />
                  <span>＝</span>
                  <Frac num={<Radical>5</Radical>} den="(<Radical>5</Radical>)²" />
                  <span>＝</span>
                  <strong><Frac num={<Radical>5</Radical>} den="5" /></strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1.5 font-mono text-emerald-950">
                  <span>•</span>
                  <Frac num="15" den={<Radical>3</Radical>} />
                  <span>＝</span>
                  <Frac num={<span>15 · <Radical>3</Radical></span>} den="3" />
                  <span>＝</span>
                  <strong className="inline-flex items-center gap-0.5">5 · <Radical>3</Radical></strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
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

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase">Δοκιμαστε κλασικα ζευγη:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button onClick={() => { setValA(8); setValB(18); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>8</Radical> · <Radical>18</Radical>
                  </button>
                  <button onClick={() => { setValA(5); setValB(20); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>5</Radical> · <Radical>20</Radical>
                  </button>
                  <button onClick={() => { setValA(72); setValB(2); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>72</Radical> / <Radical>2</Radical>
                  </button>
                  <button onClick={() => { setValA(75); setValB(3); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>75</Radical> / <Radical>3</Radical>
                  </button>
                </div>
              </div>
            </div>

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

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 block uppercase">
                  {toCleanUppercase("ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ & ΑΠΛΟΠΟΙΗΣΗΣ")}:
                </span>
                <div className="leading-relaxed font-mono font-medium text-slate-800">
                  {stepContent}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ΠΡΩΤΟΤΥΠΑ ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΔΙΑΣΤΑΣΕΙΣ & ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Υπολογισμός διαγωνίου και εμβαδού με εξαγωγή παράγοντα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Ένα ορθογώνιο παραλληλόγραμμο έχει διαστάσεις <strong>L ＝ <Radical>48</Radical> cm</strong> και <strong>W ＝ <Radical>12</Radical> cm</strong>. <br />
                  α) Να υπολογιστεί το εμβαδόν του Ε σε cm². <br />
                  β) Να βρεθεί το μήκος της διαγωνίου του d σε απλοποιημένη ριζική μορφή.
                </p>

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
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Εμβαδόν Ε</td>
                        <td className="p-2 sm:p-2.5">Ε ＝ L · W</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Radical>48</Radical> · <Radical>12</Radical> ＝ <Radical>48 · 12</Radical> ＝ <Radical>576</Radical> ＝ 24 cm²</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Διαγώνιος d²</td>
                        <td className="p-2 sm:p-2.5">d² ＝ L² ＋ W²</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">(<Radical>48</Radical>)² ＋ (<Radical>12</Radical>)² ＝ 48 ＋ 12 ＝ 60</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Διαγώνιος d</td>
                        <td className="p-2 sm:p-2.5">d ＝ <Radical>60</Radical></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1"><Radical>4 · 15</Radical> ＝ 2 · <Radical>15</Radical> cm</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Εμβαδόν:</strong> 24 cm² (ακέραιος ρητός αριθμός).</div>
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Μήκος διαγωνίου:</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1">d ＝ 2 · <Radical>15</Radical> cm</span>.
                  </div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΑΛΓΕΒΡΙΚΗ ΑΠΛΟΠΟΙΗΣΗ & ΡΗΤΟΠΟΙΗΣΗ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Υπολογισμός σύνθετης παράστασης με ρητοποίηση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να υπολογιστεί η αριθμητική τιμή της παράστασης με ρητοποίηση και αναγωγή ομοίων ριζών: <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 mt-1">
                    Κ ＝ <Radical>72</Radical> － <Frac num="18" den={<Radical>2</Radical>} /> ＋ <Radical>50</Radical>
                  </span>
                </p>

                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Όρος</th>
                        <th className="p-2 sm:p-2.5 border-b">Διαδικασία Μετατροπής</th>
                        <th className="p-2 sm:p-2.5 border-b">Απλοποιημένη Μορφή</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1ος Όρος (<Radical>72</Radical>)</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Radical>36 · 2</Radical> ＝ 6 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">6 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2ος Όρος (18 / <Radical>2</Radical>)</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Frac num={<span>18 · <Radical>2</Radical></span>} den="2" /> ＝ 9 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">－9 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3ος Όρος (<Radical>50</Radical>)</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">＋5 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Αναγωγή Ομοίων Ριζών:</strong> (6 － 9 ＋ 5) · <Radical>2</Radical> ＝ <strong>2 · <Radical>2</Radical></strong>.
                  </div>
                  <div><strong>Συμπέρασμα:</strong> Η αρχική σύνθετη παράσταση απλοποιείται στον άρρητο αριθμό 2 · <Radical>2</Radical>.</div>
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
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <strong>Εξαγωγή παράγοντα με αρνητικό συντελεστή:</strong> Ισχύει <Radical>α² · β</Radical> ＝ |α| · <Radical>β</Radical>. Αν ο α είναι αρνητικός, βγαίνει έξω ως －α (π.χ. <Radical>(－3)² · 2</Radical> ＝ |－3| · <Radical>2</Radical> ＝ 3 · <Radical>2</Radical>).
                  </span>
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
