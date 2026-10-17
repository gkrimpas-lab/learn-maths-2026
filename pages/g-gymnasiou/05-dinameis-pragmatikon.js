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
  // State για το διαδραστικό εργαστήριο
  const [mode, setMode] = useState('custom'); // 'presets' ή 'custom'
  const [customBaseInput, setCustomBaseInput] = useState('2,5');
  const [baseType, setBaseType] = useState('integer'); // για presets
  const [exponent, setExponent] = useState(3); // από -5 έως 10

  // Καθαρισμός και υπολογισμός βάσης για το custom input
  let parsedBase = 0;
  let isValidBase = true;
  let customDisplayStr = customBaseInput;

  if (mode === 'custom') {
    const sanitized = customBaseInput.replace(',', '.').trim();
    parsedBase = parseFloat(sanitized);
    if (isNaN(parsedBase)) {
      isValidBase = false;
      parsedBase = 0;
    }
  } else {
    if (baseType === 'negative') {
      parsedBase = -2;
      customDisplayStr = '(－2)';
    } else if (baseType === 'frac') {
      parsedBase = 0.5;
      customDisplayStr = '(1/2)';
    } else if (baseType === 'radical') {
      parsedBase = Math.sqrt(3);
      customDisplayStr = '(√3)';
    } else {
      parsedBase = 2;
      customDisplayStr = '2';
    }
  }

  // Ασφαλής υπολογισμός δύναμης
  let resultOutput = '';
  let scientificForm = '';
  let ruleNote = '';

  if (!isValidBase) {
    resultOutput = 'Μη έγκυρος αριθμός';
    ruleNote = 'Παρακαλούμε εισάγετε έναν πραγματικό αριθμό (π.χ. -12,345 ή 2,5).';
  } else if (parsedBase === 0 && exponent <= 0) {
    resultOutput = 'Δεν ορίζεται';
    ruleNote = 'Η δύναμη 0⁰ καθώς και η διαίρεση με το μηδέν (0⁻ⁿ) δεν ορίζονται στα μαθηματικά.';
  } else if (exponent === 0) {
    resultOutput = '1';
    ruleNote = 'Κάθε πραγματικός αριθμός α ≠ 0 υψωμένος στο μηδέν ισούται με 1 (α⁰ ＝ 1).';
  } else {
    const rawVal = Math.pow(parsedBase, exponent);
    
    // Έλεγχος υπερχείλισης
    if (!isFinite(rawVal)) {
      resultOutput = 'Πολύ μεγάλος αριθμός (Υπερχείλιση)';
    } else {
      // Μορφοποίηση δεκαδικού
      if (Math.abs(rawVal) >= 1e7 || (Math.abs(rawVal) < 1e-4 && rawVal !== 0)) {
        scientificForm = rawVal.toExponential(4).replace('e+', ' · 10⁺').replace('e-', ' · 10⁻');
        resultOutput = rawVal.toLocaleString('el-GR', { maximumFractionDigits: 6 });
      } else {
        resultOutput = rawVal.toLocaleString('el-GR', { maximumFractionDigits: 6 });
      }

      // Κανόνες επεξήγησης
      if (parsedBase < 0) {
        const isEven = Math.abs(exponent) % 2 === 0;
        ruleNote = isEven 
          ? `Αρνητική βάση με άρτιο εκθέτη (${exponent}): Το αποτέλεσμα είναι πάντα θετικό (＋).`
          : `Αρνητική βάση με περιττό εκθέτη (${exponent}): Το αποτέλεσμα παραμένει αρνητικό (－).`;
      } else if (exponent < 0) {
        ruleNote = `Αρνητικός εκθέτης (${exponent}): Αντιστρέφει τη βάση (α⁻ⁿ ＝ 1 / αⁿ).`;
      } else {
        ruleNote = `Κανονικός πολλαπλασιασμός της βάσης ${customDisplayStr} με τον εαυτό της ${exponent} φορές.`;
      }
    }
  }

  // Sanitizer για input: Επιτρέπει προαιρετικό πρόσημο '-', έως 3 ακέραια και έως 3 δεκαδικά
  const handleCustomInputChange = (val) => {
    // Επιτρέπει μόνο αριθμούς, κόμμα, τελεία και μείον στην αρχή
    let clean = val.replace(/[^0-9.,-]/g, '');
    
    // Μόνο ένα μείον στην αρχή
    if (clean.indexOf('-') > 0) {
      clean = clean.replace(/-/g, '');
    }
    const hasMinus = clean.startsWith('-');
    if (hasMinus) clean = '-' + clean.substring(1).replace(/-/g, '');

    // Μόνο μία υποδιαστολή
    const parts = clean.split(/[,.]/);
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }

    // Περιορισμός: έως 3 ψηφία ακέραιο μέρος, έως 3 ψηφία δεκαδικό μέρος
    let intPart = parts[0].replace('-', '');
    if (intPart.length > 3) intPart = intPart.substring(0, 3);
    const signPrefix = hasMinus ? '-' : '';

    if (parts.length === 2) {
      let decPart = parts[1];
      if (decPart.length > 3) decPart = decPart.substring(0, 3);
      setCustomBaseInput(`${signPrefix}${intPart},${decPart}`);
    } else {
      setCustomBaseInput(`${signPrefix}${intPart}`);
    }
  };

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

        {/* INTERACTIVE LAB - ΑΝΑΒΑΘΜΙΣΜΕΝΟ ΜΕ ΕΚΘΕΤΗ ΕΩΣ 10 ΚΑΙ CUSTOM INPUT 3+3 ΨΗΦΙΩΝ */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΔΥΝΑΜΕΩΝ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής Δύναμης αⁿ
              </h2>
            </div>
            {/* Mode Selector */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                onClick={() => setMode('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'custom' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Δική σας Βάση (±999,999)
              </button>
              <button
                onClick={() => setMode('presets')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'presets' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Κλασικές Βάσεις
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              
              {mode === 'custom' ? (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs sm:text-sm font-bold text-slate-700">
                      Εισαγωγή Βάσης (α):
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">έως 3 ακέραια, 3 δεκαδικά</span>
                  </div>
                  <input
                    type="text"
                    value={customBaseInput}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    placeholder="π.χ. -12,345 ή 2,5"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['-2', '0,5', '1,2', '10', '-0,4'].map(pre => (
                      <button
                        key={pre}
                        onClick={() => setCustomBaseInput(pre)}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-600 hover:border-indigo-400"
                      >
                        {pre}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                    Επιλέξτε Κλασική Βάση:
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
              )}

              {/* Slider Εκθέτη από -5 έως 10 */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">
                    Εκθέτης (n):
                  </label>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs sm:text-sm shadow-sm">
                    {exponent > 0 ? `＋${exponent}` : exponent}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="1"
                  value={exponent}
                  onChange={(e) => setExponent(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>－5</span>
                  <span>0</span>
                  <span>＋5</span>
                  <span>＋10</span>
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
                    {mode === 'custom' ? (
                      parsedBase < 0 ? `(${customBaseInput})` : customBaseInput
                    ) : (
                      baseDisplay
                    )}
                    <sup className="text-xs sm:text-base text-amber-300 ml-0.5">{exponent}</sup>
                  </span>
                  <span className="text-indigo-400">＝</span>
                  <span className="text-emerald-400 inline-flex items-center break-all">
                    {resultOutput}
                  </span>
                </div>

                {scientificForm && (
                  <div className="mt-3 pt-3 border-t border-indigo-800 text-xs sm:text-sm font-mono text-indigo-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Τυποποιημένη μορφή:</span>
                    <span className="font-bold text-amber-300 text-sm sm:text-base">{scientificForm}</span>
                  </div>
                )}
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
