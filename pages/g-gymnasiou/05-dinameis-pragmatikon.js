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

export default function DinameisPragmatikonTheory() {
  // State για το διαδραστικό εργαστήριο υπολογισμού δύναμης a^n
  const [baseType, setBaseType] = useState('integer'); // 'integer', 'negative', 'frac', 'radical'
  const [exponent, setExponent] = useState(2); // -3 έως 4

  // Ρύθμιση δεδομένων βάσης
  let baseLabel = '2';
  let baseVal = 2;
  let baseDisplay = '2';

  if (baseType === 'negative') {
    baseLabel = '(－2)';
    baseVal = -2;
    baseDisplay = '(－2)';
  } else if (baseType === 'frac') {
    baseLabel = '(1/2)';
    baseVal = 0.5;
    baseDisplay = <span className="inline-flex items-center">(<Frac num="1" den="2" />)</span>;
  } else if (baseType === 'radical') {
    baseLabel = '(√3)';
    baseVal = Math.sqrt(3);
    baseDisplay = <span className="inline-flex items-center">(<Radical>3</Radical>)</span>;
  }

  // Υπολογισμός αποτελέσματος
  let resultDisplay = '';
  let ruleNote = '';

  if (exponent === 0) {
    resultDisplay = '1';
    ruleNote = 'Κάθε πραγματικός αριθμός α ≠ 0 υψωμένος στο μηδέν ισούται με 1: α⁰ ＝ 1.';
  } else if (baseType === 'radical') {
    if (exponent === 2) {
      resultDisplay = '3';
      ruleNote = 'Η τετραγωνική ρίζα υψωμένη στο τετράγωνο εξουδετερώνεται: (√3)² ＝ 3.';
    } else if (exponent === 4) {
      resultDisplay = '9';
      ruleNote = '((√3)²)² ＝ 3² ＝ 9.';
    } else if (exponent === -2) {
      resultDisplay = <Frac num="1" den="3" />;
      ruleNote = '(√3)⁻² ＝ 1 / (√3)² ＝ 1/3.';
    } else {
      const calc = Math.pow(baseVal, exponent);
      resultDisplay = `≈ ${calc.toFixed(3)}`;
      ruleNote = `Υπολογισμός ρίζας με εκθέτη ${exponent}.`;
    }
  } else if (baseType === 'frac') {
    if (exponent > 0) {
      const p = Math.pow(2, exponent);
      resultDisplay = <Frac num="1" den={p} />;
      ruleNote = `(1/2)ⁿ ＝ 1ⁿ / 2ⁿ ＝ 1 / ${p}.`;
    } else {
      const posExp = Math.abs(exponent);
      const p = Math.pow(2, posExp);
      resultDisplay = `${p}`;
      ruleNote = `(1/2)⁻ⁿ ＝ (2/1)ⁿ ＝ 2ⁿ ＝ ${p}. (Αντιστροφή κλάσματος).`;
    }
  } else if (baseType === 'negative') {
    const isEven = exponent % 2 === 0;
    if (exponent > 0) {
      const p = Math.pow(2, exponent);
      resultDisplay = isEven ? `${p}` : `－${p}`;
      ruleNote = isEven 
        ? 'Άρτιος εκθέτης: Το αποτέλεσμα είναι πάντοτε θετικό (＋).'
        : 'Περιττός εκθέτης: Το αποτέλεσμα διατηρεί το αρνητικό πρόσημο (－).';
    } else {
      const posExp = Math.abs(exponent);
      const p = Math.pow(2, posExp);
      resultDisplay = isEven ? <Frac num="1" den={p} /> : <Frac num="－1" den={p} />;
      ruleNote = `(－2)⁻ⁿ ＝ 1 / (－2)ⁿ. Το πρόσημο εξαρτάται από το αν ο εκθέτης είναι άρτιος ή περιττός.`;
    }
  } else {
    // Θετικός ακέραιος 2
    if (exponent > 0) {
      resultDisplay = `${Math.pow(2, exponent)}`;
      ruleNote = `2ⁿ ＝ ${Array(exponent).fill(2).join(' · ')} ＝ ${Math.pow(2, exponent)}.`;
    } else {
      const p = Math.pow(2, Math.abs(exponent));
      resultDisplay = <Frac num="1" den={p} />;
      ruleNote = `2⁻ⁿ ＝ 1 / 2ⁿ ＝ 1 / ${p}.`;
    }
  }

  return (
    <Layout
      title="Δυνάμεις Πραγματικών Αριθμών | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τις δυνάμεις με βάση πραγματικό και εκθέτη ακέραιο, ιδιότητες δυνάμεων, τυποποιημένη μορφή και διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
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
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 5 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Δυνάμεις Πραγματικών Αριθμών
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Ανακαλύψτε τη δύναμη των εκθετών: από τους φυσικούς έως τους αρνητικούς ακέραιους, με βάση οποιονδήποτε πραγματικό αριθμό. Μάθετε τις πανίσχυρες ιδιότητες απλοποίησης και την τυποποιημένη μορφή που χρησιμοποιεί η σύγχρονη επιστήμη.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
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
                  Ορισμός Δύναμης στο ℝ με Ακέραιο Εκθέτη
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για κάθε πραγματικό αριθμό <strong>α</strong> και ακέραιο εκθέτη <strong>n</strong>:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Θετικός εκθέτης (n ＞ 1):</strong> αⁿ ＝ α · α · ... · α (n φορές)
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Μηδενικός εκθέτης (α ≠ 0):</strong> α⁰ ＝ 1 (το 0⁰ δεν ορίζεται)
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5">
                  <span><strong>Αρνητικός εκθέτης (α ≠ 0):</strong></span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex items-center gap-1">
                    α⁻ⁿ ＝ <Frac num="1" den="αⁿ" />
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950">
                <span className="font-bold block mb-1">Κλάσμα σε Αρνητικό Εκθέτη:</span>
                Αντιστρέφουμε τους όρους του κλάσματος και αλλάζουμε το πρόσημο του εκθέτη: <br />
                <span className="font-mono font-bold mt-1 inline-flex items-center gap-1.5">
                  (<Frac num="α" den="β" />)⁻ⁿ ＝ (<Frac num="β" den="α" />)ⁿ
                </span>
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
                  Ιδιότητες των Δυνάμεων
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Οι ιδιότητες ισχύουν για οποιεσδήποτε πραγματικές βάσεις και ακέραιους εκθέτες:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm font-mono text-slate-800">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Γινόμενο ίδιας βάσης:</span>
                  <strong className="text-indigo-900">αᵐ · αⁿ ＝ αᵐ⁺ⁿ</strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Πηλίκο ίδιας βάσης:</span>
                  <strong className="text-indigo-900"><Frac num="αᵐ" den="αⁿ" /> ＝ αᵐ⁻ⁿ</strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Δύναμη γινομένου:</span>
                  <strong className="text-indigo-900">(α · β)ⁿ ＝ αⁿ · βⁿ</strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Δύναμη δύναμης:</span>
                  <strong className="text-indigo-900">(αᵐ)ⁿ ＝ αᵐ˙ⁿ</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950">
                <strong>Δύναμη Ρίζας:</strong> Για α ≥ 0 ισχύει (<Radical>α</Radical>)² ＝ α. <br />
                Γενικότερα: (<Radical>α</Radical>)²ⁿ ＝ ((<Radical>α</Radical>)²)ⁿ ＝ αⁿ.
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
                  Κανόνες Προσήμων σε Δυνάμεις
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Το πρόσημο μιας δύναμης με αρνητική βάση καθορίζεται αποκλειστικά από τον εκθέτη:
              </p>

              <div className="space-y-2 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                  <strong>Άρτιος Εκθέτης (2, 4, 6, ...):</strong> <br />
                  Κάθε αρνητικός αριθμός υψωμένος σε άρτιο εκθέτη δίνει <strong>θετικό αποτέλεσμα</strong>:
                  <div className="font-mono font-bold mt-1 text-emerald-900">
                    (－3)² ＝ ＋9 &nbsp;|&nbsp; (－1)¹⁰⁰ ＝ 1
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
                  <strong>Περιττός Εκθέτης (1, 3, 5, ...):</strong> <br />
                  Κάθε αρνητικός αριθμός υψωμένος σε περιττό εκθέτη δίνει <strong>αρνητικό αποτέλεσμα</strong>:
                  <div className="font-mono font-bold mt-1 text-rose-900">
                    (－2)³ ＝ －8 &nbsp;|&nbsp; (－1)⁹⁹ ＝ －1
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <strong>Προσοχή στις Παρενθέσεις:</strong> Υπάρχει τεράστια διαφορά ανάμεσα στο <strong>(－3)² ＝ 9</strong> και στο <strong>－3² ＝ －9</strong>! Στο δεύτερο, ο εκθέτης επηρεάζει μόνο το 3.
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
                  Τυποποιημένη (Επιστημονική) Μορφή
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για να γράφουμε εύκολα εξαιρετικά μεγάλους ή μικρούς αριθμούς, χρησιμοποιούμε τη μορφή:
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner">
                <div className="font-mono text-base sm:text-xl font-black tracking-wide">
                  α · 10ᵏ
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-1">
                  όπου <strong>1 ≤ |α| ＜ 10</strong> και <strong>k ∈ ℤ</strong> (ακέραιος)
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Πολύ μεγάλοι αριθμοί (k ＞ 0):</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-900 font-bold">
                    300.000.000 ＝ 3 · 10⁸ (ταχύτητα φωτός σε m/s)
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Πολύ μικροί αριθμοί (k ＜ 0):</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-900 font-bold">
                    0,0000045 ＝ 4,5 · 10⁻⁶
                  </div>
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
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΔΥΝΑΜΕΩΝ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Εξερεύνηση της Δύναμης αⁿ
              </h2>
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              Επιλέξτε τη βάση και ρυθμίστε τον ακέραιο εκθέτη για να δείτε ζωντανά την εφαρμογή των κανόνων.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  Επιλέξτε Βάση (α):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setBaseType('integer')}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                      baseType === 'integer'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Θετικός: 2
                  </button>

                  <button
                    onClick={() => setBaseType('negative')}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                      baseType === 'negative'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Αρνητικός: (－2)
                  </button>

                  <button
                    onClick={() => setBaseType('frac')}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                      baseType === 'frac'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Κλάσμα: <Frac num="1" den="2" className="ml-1" />
                  </button>

                  <button
                    onClick={() => setBaseType('radical')}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                      baseType === 'radical'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Ρίζα: <Radical className="ml-1">3</Radical>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Εκθέτης (n):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">
                    {exponent}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="4"
                  step="1"
                  value={exponent}
                  onChange={(e) => setExponent(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>－3</span>
                  <span>0</span>
                  <span>＋4</span>
                </div>
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΗΣ")}
                </span>
                <div className="text-xl sm:text-3xl lg:text-4xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1">
                  <span className="inline-flex items-center">
                    {baseDisplay}<sup className="text-xs sm:text-base text-amber-300 ml-0.5">{exponent}</sup>
                  </span>
                  <span className="text-indigo-400">＝</span>
                  <span className="text-emerald-400 inline-flex items-center">
                    {resultDisplay}
                  </span>
                </div>
              </div>

              {/* Επεξήγηση κανόνα */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 block uppercase">
                  {toCleanUppercase("ΕΦΑΡΜΟΖΟΜΕΝΟΣ ΚΑΝΟΝΑΣ")}:
                </span>
                <p className="leading-relaxed font-medium text-slate-800">
                  {ruleNote}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Υπολογισμός παράστασης με ιδιότητες δυνάμεων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να υπολογιστεί η αριθμητική τιμή της παράστασης: <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 mt-1">
                    Α ＝ <Frac num="2⁵ · 2⁻² · (2³)²" den="2⁷" />
                  </span>
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Βήμα</th>
                        <th className="p-2 sm:p-2.5 border-b">Ιδιότητα</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Δύναμη δύναμης</td>
                        <td className="p-2 sm:p-2.5 font-sans">(αᵐ)ⁿ ＝ αᵐ˙ⁿ</td>
                        <td className="p-2 sm:p-2.5">(2³)² ＝ 2⁶</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Αριθμητής</td>
                        <td className="p-2 sm:p-2.5 font-sans">αᵐ · αⁿ ＝ αᵐ⁺ⁿ</td>
                        <td className="p-2 sm:p-2.5">2⁵ · 2⁻² · 2⁶ ＝ 2⁵⁻²⁺⁶ ＝ 2⁹</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Πηλίκο</td>
                        <td className="p-2 sm:p-2.5 font-sans">αᵐ / αⁿ ＝ αᵐ⁻ⁿ</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2⁹ / 2⁷ ＝ 2⁹⁻⁷ ＝ 2² ＝ 4</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Τελική Τιμή:</strong> <span className="font-mono font-bold text-emerald-900">Α ＝ 4</span>.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΕΠΙΣΤΗΜΟΝΙΚΗ ΕΦΑΡΜΟΓΗ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Υπολογισμός απόστασης με τυποποιημένη μορφή
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Η ταχύτητα του φωτός είναι <strong>v ＝ 3 · 10⁸ m/s</strong>. Το φως του Ήλιου χρειάζεται περίπου <strong>t ＝ 5 · 10² δευτερόλεπτα</strong> (περίπου 8,3 λεπτά) για να φτάσει στη Γη. <br />
                  Να υπολογιστεί η απόσταση Ήλιου - Γης (s ＝ v · t) σε μέτρα σε τυποποιημένη μορφή.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Μέγεθος</th>
                        <th className="p-2 sm:p-2.5 border-b">Μαθηματικός Τύπος</th>
                        <th className="p-2 sm:p-2.5 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Γινόμενο μεγεθών</td>
                        <td className="p-2 sm:p-2.5">s ＝ (3 · 10⁸) · (5 · 10²)</td>
                        <td className="p-2 sm:p-2.5">(3 · 5) · (10⁸ · 10²)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Υπολογισμός</td>
                        <td className="p-2 sm:p-2.5">15 · 10⁸⁺²</td>
                        <td className="p-2 sm:p-2.5">15 · 10¹⁰ m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Τυποποιημένη</td>
                        <td className="p-2 sm:p-2.5">(1,5 · 10¹) · 10¹⁰</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">1,5 · 10¹¹ m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Τελική Απόσταση:</strong> <span className="font-mono font-bold text-emerald-900">1,5 · 10¹¹ m</span> (δηλαδή 150.000.000 km).</div>
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
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΔΥΝΑΜΕΙΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Αρνητικός εκθέτης δεν σημαίνει αρνητικό αποτέλεσμα:</strong> Το 2⁻³ ισούται με <Frac num="1" den="2³" /> ＝ <Frac num="1" den="8" /> (θετικός αριθμός) και <strong>ΟΧΙ</strong> με －8 ή －6. Ο αρνητικός εκθέτης δείχνει <em>αντιστροφή</em> και όχι πρόσημο!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Πρόσημο με και χωρίς παρένθεση:</strong> (－4)² ＝ (－4) · (－4) ＝ ＋16, ενώ －4² ＝ －(4 · 4) ＝ －16.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Πρόσθεση δυνάμεων:</strong> Στην έκφραση 2³ ＋ 2⁴ <strong>ΔΕΝ</strong> προσθέτουμε τους εκθέτες! Οι εκθέτες προστίθενται <em>μόνο στον πολλαπλασιασμό</em> (2³ · 2⁴ ＝ 2⁷).</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εξασκηθείτε στις Δυνάμεις των Πραγματικών!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις δυνάμεις σας σε 12 δυναμικές διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
