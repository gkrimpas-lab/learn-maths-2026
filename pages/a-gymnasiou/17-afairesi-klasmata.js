import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων: άτονα παντού εκτός από το "Α'"
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Βοηθητικός υπολογισμός ΜΚΔ (Ευκλείδης)
const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// Βοηθητικός υπολογισμός ΕΚΠ
const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική γραφή με πρόσημο μπροστά (mobile-safe)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numericNeg =
    (typeof num === 'number' && num < 0) ||
    (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;

  const displayNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const displayDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {showMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-0.5 sm:px-1 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Συγκεντρωτικό Λεξικό Μεταφράσεων i18n
const translations = {
  el: {
    pageTitle: "Αφαίρεση Ρητών Αριθμών | Α' Γυμνασίου",
    pageDesc: "Έννοια της αφαίρεσης ρητών αριθμών (κλάσματα και δεκαδικοί), σύνδεση με τον αντίθετο αριθμό και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 15 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Αφαίρεση Ρητών Αριθμών",
    mainDesc: "Κατανοούμε πώς η αφαίρεση ρητών αριθμών ανάγεται στην πρόσθεση του αντιθέτου, μαθαίνουμε τους κανόνες απλοποίησης των προσήμων και εκτελούμε πράξεις με κλάσματα και δεκαδικούς.",

    // Ενότητα 1
    sec1Title: "Ορισμός της Αφαίρεσης: Πρόσθεση με τον Αντίθετο",
    sec1Lead: "Στους ρητούς αριθμούς, η αφαίρεση α － β ορίζεται πάντοτε ως η πρόσθεση του μειωτέου α με τον αντίθετο του αφαιρετέου β:",
    sec1Clarification: "Αυτό σημαίνει ότι μετατρέπουμε το σύμβολο της αφαίρεσης σε πρόσθεση και ταυτόχρονα αλλάζουμε το πρόσημο του δεύτερου αριθμού.",
    sec1RulesBadge: "ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΩΝ ΓΙΑ ΤΗΝ ΑΦΑΙΡΕΣΗ",

    // Ενότητα 2
    sec2Title: "Αφαίρεση Κλασμάτων (Ομώνυμα & Ετερώνυμα)",
    case1Badge: "1. ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ",
    case1Desc: "Διατηρούμε τον κοινό παρονομαστή και αφαιρούμε τους αριθμητές:",
    case2Badge: "2. ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ",
    case2Desc: "Βρίσκουμε το ΕΚΠ των παρονομαστών, πολλαπλασιάζουμε τους όρους κάθε κλάσματος για να γίνουν ομώνυμα και κατόπιν εκτελούμε την αφαίρεση.",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστική Αφαίρεση Κλασμάτων Βήμα-Βήμα",
    frac1Label: "1Ο ΚΛΑΣΜΑ (ΜΕΙΩΤΕΟΣ)",
    frac2Label: "2Ο ΚΛΑΣΜΑ (ΑΦΑΙΡΕΤΕΟΣ)",
    numA: "ΑΡΙΘΜΗΤΗΣ (α)",
    denB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
    numC: "ΑΡΙΘΜΗΤΗΣ (γ)",
    denD: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
    lab1AnalysisTitle: "ΑΝΑΛΥΣΗ ΑΦΑΙΡΕΣΗΣ",
    badgeLike: "ΟΜΩΝΥΜΑ",
    badgeUnlike: "ΕΤΕΡΩΝΥΜΑ • ΕΚΠ ＝",
    initialSubtraction: "Αρχική Αφαίρεση:",
    step1Opposite: "Βήμα 1: Μετατροπή σε πρόσθεση με τον αντίθετο του αφαιρετέου:",
    step2LikeFractions: "Βήμα 2: Μετατροπή σε ομώνυμα (κοινός παρονομαστής",
    step3CalculateNumerator: "Υπολογισμός ενιαίου αριθμητή:",
    finalReducedResult: "ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:",
    afterDivisionBy: "μετά από διαίρεση με το",

    // Ενότητα 3
    sec3Title: "Αφαίρεση Δεκαδικών Αριθμών",
    sec3Lead: "Όπως και στα κλάσματα, στην αφαίρεση δεκαδικών αριθμών προσθέτουμε στον μειωτέο τον αντίθετο του αφαιρετέου:",
    sec3Rule1: "1. Αλλαγή σε πρόσθεση: (＋3,5) － (＋1,2) ＝ (＋3,5) ＋ (－1,2) ＝ ＋2,3",
    sec3Rule2: "2. Αφαίρεση αρνητικού: (＋4,2) － (－1,8) ＝ (＋4,2) ＋ (＋1,8) ＝ ＋6,0",
    sec3Rule3: "3. Στοίχιση υποδιαστολών: Τοποθετούμε τις υποδιαστολές στην ίδια κατακόρυφη ευθεία.",
    sec3ExamplesTitle: "ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Αφαίρεσης Δεκαδικών",
    dec1Label: "1ΟΣ (ΜΕΙΩΤΕΟΣ)",
    dec2Label: "2ΟΣ (ΑΦΑΙΡΕΤΕΟΣ)",
    intStepLabel: "ΑΚΕΡΑΙΟ (±1)",
    decStepLabel: "ΔΕΚΑΔΙΚΟ (±0,1)",
    lab2ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΑΦΑΙΡΕΣΗΣ ΔΕΚΑΔΙΚΩΝ",
    badgeConvertToAddition: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΡΟΣΘΕΣΗ",
    lab2ExplanationLead: "Αντικαταστήσαμε την αφαίρεση του",
    lab2ExplanationMid: "με πρόσθεση του αντιθέτου του",
    lab2ExplanationTail: "και εφαρμόσαμε τους κανόνες προσήμων της πρόσθεσης.",
  },
  en: {
    pageTitle: "Subtraction of Rational Numbers | Grade 7",
    pageDesc: "Concept of subtracting rational numbers (fractions and decimals), connecting subtraction with adding the opposite, and interactive labs.",
    backText: "Grade 7",
    btnExercises: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 15 • THEORY & LAB",
    mainTitle: "Subtraction of Rational Numbers",
    mainDesc: "Understand how subtracting rational numbers reduces to adding the opposite, learn sign simplification rules, and perform operations with fractions and decimals.",

    // Section 1
    sec1Title: "Definition of Subtraction: Adding the Opposite",
    sec1Lead: "For rational numbers, subtraction a － b is always defined as adding the opposite of the subtrahend b to the minuend a:",
    sec1Clarification: "This means we convert the subtraction symbol into addition and simultaneously flip the sign of the second number.",
    sec1RulesBadge: "SIGN RULES FOR SUBTRACTION",

    // Section 2
    sec2Title: "Subtracting Fractions (Like & Unlike Denominators)",
    case1Badge: "1. LIKE FRACTIONS",
    case1Desc: "Keep the common denominator and subtract the numerators:",
    case2Badge: "2. UNLIKE FRACTIONS",
    case2Desc: "Find the LCM of denominators, multiply terms to make them like fractions, and then perform the subtraction.",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Step-by-Step Fraction Subtraction",
    frac1Label: "1ST FRACTION (MINUEND)",
    frac2Label: "2ND FRACTION (SUBTRAHEND)",
    numA: "NUMERATOR (a)",
    denB: "DENOMINATOR (b)",
    numC: "NUMERATOR (c)",
    denD: "DENOMINATOR (d)",
    lab1AnalysisTitle: "SUBTRACTION ANALYSIS",
    badgeLike: "LIKE FRACTIONS",
    badgeUnlike: "UNLIKE FRACTIONS • LCM ＝",
    initialSubtraction: "Initial Subtraction:",
    step1Opposite: "Step 1: Convert to addition with the opposite of the subtrahend:",
    step2LikeFractions: "Step 2: Convert to like fractions (common denominator",
    step3CalculateNumerator: "Calculate single numerator:",
    finalReducedResult: "FINAL IRREDUCIBLE RESULT:",
    afterDivisionBy: "after dividing by",

    // Section 3
    sec3Title: "Subtraction of Decimal Numbers",
    sec3Lead: "Just as with fractions, subtracting decimal numbers means adding the opposite of the subtrahend to the minuend:",
    sec3Rule1: "1. Change to addition: (＋3.5) － (＋1.2) ＝ (＋3.5) ＋ (－1.2) ＝ ＋2.3",
    sec3Rule2: "2. Subtracting a negative: (＋4.2) － (－1.8) ＝ (＋4.2) ＋ (＋1.8) ＝ ＋6.0",
    sec3Rule3: "3. Align decimal points: Keep decimal points aligned directly beneath each other.",
    sec3ExamplesTitle: "CALCULATION EXAMPLES",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Interactive Decimal Subtraction Calculator",
    dec1Label: "1ST (MINUEND)",
    dec2Label: "2ND (SUBTRAHEND)",
    intStepLabel: "INTEGER (±1)",
    decStepLabel: "DECIMAL (±0.1)",
    lab2ResultTitle: "DECIMAL SUBTRACTION RESULT",
    badgeConvertToAddition: "CONVERTED TO ADDITION",
    lab2ExplanationLead: "Replaced subtracting",
    lab2ExplanationMid: "with adding its opposite",
    lab2ExplanationTail: "and applied the addition sign rules.",
  }
};

export default function AfairesiKlasmataTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για Εργαστήριο 1: Αφαίρεση Κλασμάτων
  const [f1Num, setF1Num] = useState(3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(-5);
  const [f2Den, setF2Den] = useState(6);

  // State για Εργαστήριο 2: Αφαίρεση Δεκαδικών
  const [dec1, setDec1] = useState(2.4);
  const [dec2, setDec2] = useState(-3.7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Αφαίρεση Κλασμάτων)
  const oppF2Num = useMemo(() => -f2Num, [f2Num]);
  const isHomonymous = f1Den === f2Den;
  const commonDen = useMemo(() => lcm(f1Den, f2Den), [f1Den, f2Den]);
  const mult1 = useMemo(() => commonDen / f1Den, [commonDen, f1Den]);
  const mult2 = useMemo(() => commonDen / f2Den, [commonDen, f2Den]);

  const expandedNum1 = useMemo(() => f1Num * mult1, [f1Num, mult1]);
  const expandedOppNum2 = useMemo(() => oppF2Num * mult2, [oppF2Num, mult2]);

  const diffNumerator = useMemo(() => expandedNum1 + expandedOppNum2, [expandedNum1, expandedOppNum2]);
  const diffGcd = useMemo(() => gcd(diffNumerator, commonDen), [diffNumerator, commonDen]);

  const reducedNum = useMemo(() => diffNumerator / diffGcd, [diffNumerator, diffGcd]);
  const reducedDen = useMemo(() => commonDen / diffGcd, [commonDen, diffGcd]);
  const isZeroResult = diffNumerator === 0;

  // Υπολογισμοί Εργαστηρίου 2 (Αφαίρεση Δεκαδικών)
  const oppDec2 = useMemo(() => Number((-dec2).toFixed(1)), [dec2]);
  const decDiff = useMemo(() => Number((dec1 - dec2).toFixed(2)), [dec1, dec2]);

  const formatDec = (val, digits = 1) => {
    return val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/17-afairesi-klasmata-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-14 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words">
              {t.mainDesc}
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΑΦΑΙΡΕΣΗΣ & ΑΝΤΙΘΕΤΟΣ ΑΡΙΘΜΟΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words">
                {t.sec1Lead}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm">
                α － β ＝ α ＋ (－β)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 break-words">
                {t.sec1Clarification}
              </p>
            </div>

            {/* Απλοποίηση Προσήμων & Παρένθεση */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.sec1RulesBadge)}
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-1">
                  <span>－ (＋x) ＝ <strong>－x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">5 － (＋3) ＝ 5 － 3 ＝ 2</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-1">
                  <span>－ (－x) ＝ <strong>＋x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">5 － (－3) ＝ 5 ＋ 3 ＝ 8</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-1">
                  <span>＋ (－x) ＝ <strong>－x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">4 ＋ (－7) ＝ 4 － 7 ＝ －3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΦΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                {toCleanUppercase(t.case1Badge)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                {t.case1Desc}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <Frac num="α" den="γ" />
                <span>－</span>
                <Frac num="β" den="γ" />
                <span>＝</span>
                <Frac num="α － β" den="γ" />
              </div>
            </div>

            {/* Ετερώνυμα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                {toCleanUppercase(t.case2Badge)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                {t.case2Desc}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-sky-950 flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
                <Frac num="3" den="4" />
                <span>－</span>
                <Frac num="1" den="6" />
                <span>＝</span>
                <Frac num="9" den="12" />
                <span>－</span>
                <Frac num="2" den="12" />
                <span>＝</span>
                <Frac num="7" den="12" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.frac1Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numA)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Num > 0 ? `＋${f1Num}` : f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denB)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    {toCleanUppercase(t.frac2Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numC)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denD)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1AnalysisTitle)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {isHomonymous ? t.badgeLike : `${t.badgeUnlike} ${commonDen}`}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">{t.initialSubtraction}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-rose-400 font-bold">－</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Μετατροπή σε πρόσθεση αντιθέτου */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold break-words">
                    {t.step1Opposite}
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-indigo-200" /><span>)</span>
                    <span className="text-amber-400">＋</span>
                    <span>(</span><Frac num={oppF2Num} den={f2Den} className="text-sky-200" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 2: Ομώνυμα αν είναι ετερώνυμα */}
                {!isHomonymous && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                    <div className="text-slate-300 font-bold break-words">
                      {t.step2LikeFractions} {commonDen}):
                    </div>
                    <div className="font-mono text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
                      <span>＝</span>
                      <span>(</span><Frac num={expandedNum1} den={commonDen} className="text-indigo-200" /><span>)</span>
                      <span className="text-amber-400">＋</span>
                      <span>(</span><Frac num={expandedOppNum2} den={commonDen} className="text-sky-200" /><span>)</span>
                    </div>
                  </div>
                )}

                {/* Βήμα 3: Πράξη αριθμητών */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold break-words">
                    {isHomonymous ? 'Βήμα 2' : 'Βήμα 3'}: {t.step3CalculateNumerator}
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b border-white w-full text-center">
                          ({expandedNum1 > 0 ? `＋${expandedNum1}` : expandedNum1}) ＋ ({expandedOppNum2 > 0 ? `＋${expandedOppNum2}` : expandedOppNum2})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {commonDen}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={diffNumerator} den={commonDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    {toCleanUppercase(t.finalReducedResult)}
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2 flex-wrap">
                    {isZeroResult ? (
                      <span>0</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {diffGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            ({t.afterDivisionBy} {diffGcd})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ ΑΡΙΘΜΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p className="break-words">
                {t.sec3Lead}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="break-words"><strong>{t.sec3Rule1}</strong></div>
                <div className="break-words"><strong>{t.sec3Rule2}</strong></div>
                <div className="break-words"><strong>{t.sec3Rule3}</strong></div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                {toCleanUppercase(t.sec3ExamplesTitle)}
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                <div className="break-words">
                  (－{formatDec(4.5)}) － (＋{formatDec(2.1)}) ＝ (－{formatDec(4.5)}) ＋ (－{formatDec(2.1)}) ＝ <strong>－{formatDec(6.6)}</strong>
                </div>
                <div className="break-words">
                  (－{formatDec(2.8)}) － (－{formatDec(5.4)}) ＝ (－{formatDec(2.8)}) ＋ (＋{formatDec(5.4)}) ＝ <strong>＋{formatDec(2.6)}</strong>
                </div>
                <div className="break-words">
                  (＋{formatDec(1.3)}) － (＋{formatDec(7.9)}) ＝ (＋{formatDec(1.3)}) ＋ (－{formatDec(7.9)}) ＝ <strong>－{formatDec(6.6)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός (Μειωτέος) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.dec1Label)}
                    </label>
                    <span className="text-sm sm:text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός (Αφαιρετέος) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.dec2Label)}
                    </label>
                    <span className="text-sm sm:text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab2ResultTitle)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {toCleanUppercase(t.badgeConvertToAddition)}
                  </span>
                </div>

                {/* Αρχική και Μετασχηματισμένη Πράξη */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-center gap-2 text-lg sm:text-2xl font-black flex-wrap">
                    <span>({dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)})</span>
                    <span className="text-rose-400 font-sans">－</span>
                    <span>({dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)})</span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-lg sm:text-3xl font-black text-amber-300 flex-wrap max-w-full">
                    <span className="text-slate-400 font-sans">＝</span>
                    <span>({dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)})</span>
                    <span className="text-amber-400 font-sans">＋</span>
                    <span>({oppDec2 > 0 ? `＋${formatDec(oppDec2)}` : formatDec(oppDec2)})</span>
                    <span className="text-indigo-400 font-sans">＝</span>
                    <span className="text-emerald-400">
                      {decDiff > 0 ? `＋${formatDec(decDiff, 1)}` : formatDec(decDiff, 1)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words">
                  {t.lab2ExplanationLead} <strong>({dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)})</strong> {t.lab2ExplanationMid} <strong>({oppDec2 > 0 ? `＋${formatDec(oppDec2)}` : formatDec(oppDec2)})</strong> {t.lab2ExplanationTail}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}