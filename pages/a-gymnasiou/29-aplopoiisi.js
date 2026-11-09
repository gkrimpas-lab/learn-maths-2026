import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα κεφαλαία (διατηρείται μόνο το Α')
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

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική μορφή
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
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

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Απλοποίηση Παραστάσεων & Πίνακες Τιμών | Α' Γυμνασίου",
    pageDescription: "Υπολογισμός αριθμητικής τιμής, πίνακες τιμών, απλοποίηση με επιμεριστική ιδιότητα, γεωμετρική ερμηνεία και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 26 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Απλοποίηση Αλγεβρικών Παραστάσεων & Πίνακες Τιμών",
    mainSubtitle: "Μαθαίνουμε πώς να απλοποιούμε σύνθετες αλγεβρικές παραστάσεις εφαρμόζοντας την επιμεριστική ιδιότητα, κατανοούμε τη γεωμετρική της σημασία μέσω εμβαδών και κατασκευάζουμε αναλυτικούς πίνακες τιμών.",

    // Section 1
    sec1Title: "Υπολογισμός Αριθμητικής Τιμής & Πίνακας Τιμών",
    sec1Intro: "Για να βρούμε την αριθμητική τιμή μιας αλγεβρικής παράστασης:",
    sec1Step1: "Αντικαθιστούμε κάθε μεταβλητή με τον δοσμένο αριθμό (προσοχή στα αρνητικά πρόσημα, τα βάζουμε πάντα σε παρένθεση).",
    sec1Step2: "Εκτελούμε τις αριθμητικές πράξεις ακολουθώντας την αυστηρή προτεραιότητα πράξεων (πρώτα παρενθέσεις, μετά δυνάμεις, μετά πολλαπλασιασμοί/διαιρέσεις και τέλος προσθέσεις/αφαιρέσεις).",
    sec1ExampleTitle: "Παράδειγμα για 2x² － 3x ＋ 1 και x ＝ －2:",
    whatIsTableTitle: "ΤΙ ΕΙΝΑΙ Ο ΠΙΝΑΚΑΣ ΤΙΜΩΝ;",
    whatIsTableP1: "Είναι ένας πίνακας στον οποίο τοποθετούμε διαδοχικές τιμές για τη μεταβλητή (συνήθως ακέραιες τιμές γύρω από το μηδέν) και υπολογίζουμε το αντίστοιχο αποτέλεσμα της παράστασης.",
    whatIsTableP2: "Μας επιτρέπει να παρατηρήσουμε πώς μεταβάλλεται η τιμή της παράστασης και να σχεδιάσουμε εύκολα το γράφημά της.",

    // Section 2
    sec2Title: "Γεωμετρική Ερμηνεία της Επιμεριστικής Ιδιότητας",
    sec2P1: "Η επιμεριστική ιδιότητα α · (β ＋ γ) ＝ α · β ＋ α · γ έχει μια πανέμορφη και ξεκάθαρη γεωμετρική ερμηνεία:",
    sec2P2: "Φαντάσου ένα μεγάλο ορθογώνιο με ύψος α και βάση β ＋ γ. Μπορούμε να υπολογίσουμε το συνολικό του εμβαδόν με δύο ισοδύναμους τρόπους:",
    sec2TotalAreaFormula: "Συνολικό Εμβαδόν ＝ α · (β ＋ γ)",
    sec2SplitAreaFormula: "＝ α · β (Μπλε) ＋ α · γ (Κεχριμπαρί)",
    sec2DistParenTitle: "Αφαίρεση Παρένθεσης με Επιμεριστική",
    sec2DistParenText: "Όταν πολλαπλασιάζουμε έναν αριθμό με μια παρένθεση, πολλαπλασιάζουμε τον εξωτερικό συντελεστή με κάθε όρο μέσα στην παρένθεση ξεχωριστά:",
    lab1Heading: "🛠️ Εργαστήριο 1: Διαδραστική Γεωμετρική Απόδειξη Επιμεριστικής Ιδιότητας",
    heightLabel: "ΥΨΟΣ (α)",
    base1Label: "ΒΑΣΗ 1 (β)",
    base2Label: "ΒΑΣΗ 2 (γ)",
    geoProofBadge: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΟΔΕΙΞΗ ΕΜΒΑΔΟΥ",
    areaUnit: "τ.μ.",
    twoWaysTitle: "Υπολογισμός με δύο ισοδύναμους τρόπους:",
    asSingleRect: "1. Ως ενιαίο ορθογώνιο:",
    asSumRect: "2. Ως άθροισμα επιμέρους εμβαδών:",

    // Section 3
    sec3Title: "Απλοποίηση Παράστασης & Αυτόματος Πίνακας Τιμών",
    sec3Intro: "Στην παρακάτω σύνθετη αλγεβρική παράσταση, εφαρμόζουμε πρώτα την επιμεριστική ιδιότητα για να απαλείψουμε την παρένθεση και στη συνέχεια κάνουμε αναγωγή ομοίων όρων:",
    outerCoeffA: "ΕΞΩΤΕΡΙΚΟΣ (α)",
    parenConstB: "ΣΤΑΘΕΡΟΣ ΠΑΡΕΝΘ. (β)",
    outerXCoeffC: "ΕΞΩΤΕΡΙΚΟΣ ΟΡΟΣ x (γ)",
    outerConstD: "ΕΞΩΤΕΡΙΚΟΣ ΣΤΑΘΕΡΟΣ (δ)",
    autoTableBadge: "ΑΥΤΟΜΑΤΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ",
    tableHeaderX: "x",
    tableHeaderVal: "Τιμή",
    flowBadge: "ΡΟΗ ΑΠΛΟΠΟΙΗΣΗΣ",
    distReductionBadge: "ΕΠΙΜΕΡΙΣΤΙΚΗ & ΑΝΑΓΩΓΗ",
    origExprLabel: "Αρχική Παράσταση:",
    step1Title: "Βήμα 1: Απαλοιφή παρένθεσης με επιμεριστική:",
    step2Title: "Βήμα 2: Ομαδοποίηση ομοίων όρων και σταθερών:",
    finalSimplifiedBadge: "ΤΕΛΙΚΗ ΑΠΛΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ:"
  },
  en: {
    pageTitle: "Simplifying Expressions & Tables of Values | Grade 7 Math",
    pageDescription: "Evaluating algebraic expressions, tables of values, distributive property, geometric interpretation and interactive labs.",
    backText: "Grade 7 Math",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 26 • THEORY & LAB",
    mainTitle: "Simplifying Algebraic Expressions & Tables of Values",
    mainSubtitle: "Learn how to simplify compound algebraic expressions using the distributive property, explore geometric representations through areas, and generate dynamic tables of values.",

    // Section 1
    sec1Title: "Evaluating Expressions & Tables of Values",
    sec1Intro: "To find the numerical value of an algebraic expression:",
    sec1Step1: "Substitute each variable with the given numerical value (always use parentheses around negative numbers).",
    sec1Step2: "Perform operations following the strict order of operations (parentheses first, then exponents, then multiplication/division, and finally addition/subtraction).",
    sec1ExampleTitle: "Example for 2x² － 3x ＋ 1 when x ＝ －2:",
    whatIsTableTitle: "WHAT IS A TABLE OF VALUES?",
    whatIsTableP1: "It is a table where we systematically test consecutive values for the variable (commonly integers centered around zero) and compute the resulting value of the expression.",
    whatIsTableP2: "It allows us to observe rate of change and provides coordinates for plotting graphs with ease.",

    // Section 2
    sec2Title: "Geometric Interpretation of the Distributive Property",
    sec2P1: "The distributive property a · (b ＋ c) ＝ a · b ＋ a · c has a clear and intuitive geometric interpretation:",
    sec2P2: "Consider a large rectangle with height a and total base b ＋ c. Its total area can be computed in two equivalent ways:",
    sec2TotalAreaFormula: "Total Area ＝ a · (b ＋ c)",
    sec2SplitAreaFormula: "＝ a · b (Blue) ＋ a · c (Amber)",
    sec2DistParenTitle: "Expanding Parentheses Using Distribution",
    sec2DistParenText: "When multiplying an external factor across parentheses, multiply the factor by each term inside the parentheses separately:",
    lab1Heading: "🛠️ Lab 1: Interactive Geometric Proof of Distributive Property",
    heightLabel: "HEIGHT (a)",
    base1Label: "BASE 1 (b)",
    base2Label: "BASE 2 (c)",
    geoProofBadge: "GEOMETRIC AREA PROOF",
    areaUnit: "sq. units",
    twoWaysTitle: "Calculation via two equivalent methods:",
    asSingleRect: "1. As a single rectangle:",
    asSumRect: "2. As the sum of sub-areas:",

    // Section 3
    sec3Title: "Expression Simplification & Dynamic Table of Values",
    sec3Intro: "In the compound algebraic expression below, we first apply the distributive property to eliminate the parentheses, followed by collecting like terms:",
    outerCoeffA: "OUTER FACTOR (a)",
    parenConstB: "PARENTHESIS CONSTANT (b)",
    outerXCoeffC: "OUTER x TERM (c)",
    outerConstD: "OUTER CONSTANT (d)",
    autoTableBadge: "DYNAMIC TABLE OF VALUES",
    tableHeaderX: "x",
    tableHeaderVal: "Value",
    flowBadge: "SIMPLIFICATION FLOW",
    distReductionBadge: "DISTRIBUTION & REDUCTION",
    origExprLabel: "Original Expression:",
    step1Title: "Step 1: Expand parentheses via distributive property:",
    step2Title: "Step 2: Group like terms and constants:",
    finalSimplifiedBadge: "FINAL SIMPLIFIED FORM:"
  }
};

export default function AplopoiisiTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // State για Εργαστήριο 1: Γεωμετρική Ερμηνεία Επιμεριστικής α · (β + γ)
  const [geoA, setGeoA] = useState(4); // Ύψος
  const [geoB, setGeoB] = useState(5); // 1ο μήκος
  const [geoC, setGeoC] = useState(3); // 2ο μήκος

  // State για Εργαστήριο 2: Απλοποίηση α·(x + β) + γ·x + δ & Πίνακας Τιμών
  const [distA, setDistA] = useState(3);
  const [distB, setDistB] = useState(2);
  const [distC, setDistC] = useState(-4);
  const [distD, setDistD] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Γεωμετρική Ερμηνεία)
  const area1 = useMemo(() => geoA * geoB, [geoA, geoB]);
  const area2 = useMemo(() => geoA * geoC, [geoA, geoC]);
  const totalGeoArea = useMemo(() => area1 + area2, [area1, area2]);
  const totalBase = useMemo(() => geoB + geoC, [geoB, geoC]);

  // Υπολογισμοί Εργαστηρίου 2 (Απλοποίηση Παράστασης)
  const expandedConstFromParen = useMemo(() => distA * distB, [distA, distB]);
  const finalXCoeff = useMemo(() => distA + distC, [distA, distC]);
  const finalConstant = useMemo(() => expandedConstFromParen + distD, [expandedConstFromParen, distD]);

  // Παραγωγή Πίνακα Τιμών για x = -2 έως 3
  const tableValues = useMemo(() => {
    const list = [];
    for (let x = -2; x <= 3; x++) {
      list.push({
        x,
        val: finalXCoeff * x + finalConstant,
      });
    }
    return list;
  }, [finalXCoeff, finalConstant]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/29-aplopoiisi-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.sec1Intro}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="break-words [overflow-wrap:anywhere]">{t.sec1Step1}</li>
                <li className="break-words [overflow-wrap:anywhere]">{t.sec1Step2}</li>
              </ol>
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1.5 break-words [overflow-wrap:anywhere]">
                <div className="font-sans font-semibold text-indigo-900">
                  {t.sec1ExampleTitle}
                </div>
                <div className="text-slate-800 inline-flex flex-wrap items-center gap-1 leading-relaxed">
                  <span>2 · (－2)<sup>2</sup> － 3 · (－2) ＋ 1</span>
                  <span>＝ 2 · 4 ＋ 6 ＋ 1</span>
                  <span>＝ 8 ＋ 6 ＋ 1</span>
                  <span>＝ <strong>15</strong></span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.whatIsTableTitle)}
              </div>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.whatIsTableP1}
              </p>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.whatIsTableP2}
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ ΕΠΙΜΕΡΙΣΤΙΚΗΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {locale === 'el' ? (
                  <>Η επιμεριστική ιδιότητα <strong className="font-mono">α · (β ＋ γ) ＝ α · β ＋ α · γ</strong> έχει μια πανέμορφη και ξεκάθαρη <strong>γεωμετρική ερμηνεία</strong>:</>
                ) : (
                  <>The distributive property <strong className="font-mono">a · (b ＋ c) ＝ a · b ＋ a · c</strong> has a clear and intuitive <strong>geometric interpretation</strong>:</>
                )}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.sec2P2}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 font-mono text-center font-bold text-indigo-950 text-xs sm:text-sm md:text-base space-y-1 break-words [overflow-wrap:anywhere]">
                <div>{t.sec2TotalAreaFormula}</div>
                <div className="text-indigo-600">{t.sec2SplitAreaFormula}</div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                {t.sec2DistParenTitle}
              </div>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.sec2DistParenText}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 space-y-1.5 break-words [overflow-wrap:anywhere]">
                <div className="inline-flex flex-wrap items-center gap-1">
                  <span>3 · (x ＋ 4)</span>
                  <span>＝ 3 · x ＋ 3 · 4</span>
                  <span>＝ <strong>3x ＋ 12</strong></span>
                </div>
                <div className="inline-flex flex-wrap items-center gap-1">
                  <span>－2 · (x － 5)</span>
                  <span>＝ (－2) · x － (－2) · 5</span>
                  <span>＝ <strong>－2x ＋ 10</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΩΜΕΤΡΙΚΗ ΟΠΤΙΚΟΠΟΙΗΣΗ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab1Heading}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    {toCleanUppercase(t.heightLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoA, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {formatNumber(geoA)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoA, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-700 uppercase block">
                    {toCleanUppercase(t.base1Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoB, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                      {formatNumber(geoB)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoB, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block">
                    {toCleanUppercase(t.base2Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoC, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {formatNumber(geoC)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoC, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Οπτική Προβολή SVG & Ισότητα (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.geoProofBadge)}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    {locale === 'el' ? 'Ε' : 'A'} ＝ {formatNumber(totalGeoArea)} {t.areaUnit}
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Εμβαδών */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 sm:p-4 flex justify-center items-center">
                  <svg viewBox="0 0 320 140" className="w-full max-w-[280px] sm:max-w-[320px] h-auto">
                    {/* 1ο Ορθογώνιο (α * β) */}
                    <rect x="35" y="25" width="135" height="90" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="102" y="65" fill="#bae6fd" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {locale === 'el' ? 'α · β' : 'a · b'}
                    </text>
                    <text x="102" y="82" fill="#7dd3fc" fontSize="11" textAnchor="middle">
                      {geoA} · {geoB} ＝ {formatNumber(area1)}
                    </text>
                    <text x="102" y="16" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {locale === 'el' ? 'β' : 'b'} ＝ {formatNumber(geoB)}
                    </text>

                    {/* 2ο Ορθογώνιο (α * γ) */}
                    <rect x="170" y="25" width="105" height="90" fill="#291e0a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="222" y="65" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {locale === 'el' ? 'α · γ' : 'a · c'}
                    </text>
                    <text x="222" y="82" fill="#fcd34d" fontSize="11" textAnchor="middle">
                      {geoA} · {geoC} ＝ {formatNumber(area2)}
                    </text>
                    <text x="222" y="16" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {locale === 'el' ? 'γ' : 'c'} ＝ {formatNumber(geoC)}
                    </text>

                    {/* Ετικέτα Ύψους α */}
                    <text x="26" y="75" fill="#a5b4fc" fontSize="12" fontWeight="bold" textAnchor="end">
                      {locale === 'el' ? 'α' : 'a'} ＝ {formatNumber(geoA)}
                    </text>
                  </svg>
                </div>

                <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-2 text-slate-200">
                  <div className="font-bold text-amber-300">
                    {t.twoWaysTitle}
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1 font-mono text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                    <span className="font-sans text-slate-300">{t.asSingleRect}</span>
                    <span>{geoA} · ({geoB} ＋ {geoC})</span>
                    <span>＝ {geoA} · {totalBase}</span>
                    <span>＝ <strong>{formatNumber(totalGeoArea)}</strong></span>
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1 font-mono text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                    <span className="font-sans text-slate-300">{t.asSumRect}</span>
                    <span>({geoA} · {geoB}) ＋ ({geoA} · {geoC})</span>
                    <span>＝ {formatNumber(area1)} ＋ {formatNumber(area2)}</span>
                    <span>＝ <strong>{formatNumber(totalGeoArea)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΛΟΠΟΙΗΣΗ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec3Intro}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers Παραμέτρων (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">
                  {toCleanUppercase(t.outerCoeffA)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistA, -1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {distA > 0 ? `＋${distA}` : distA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistA, 1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">
                  {toCleanUppercase(t.parenConstB)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistB, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {distB > 0 ? `＋${distB}` : distB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistB, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-800 uppercase block">
                  {toCleanUppercase(t.outerXCoeffC)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistC, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-sky-950">
                    {distC > 0 ? `＋${distC}` : distC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistC, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-800 uppercase block">
                  {toCleanUppercase(t.outerConstD)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistD, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-amber-950">
                    {distD > 0 ? `＋${distD}` : distD}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistD, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πίνακας Τιμών (Responsive) */}
              <div className="col-span-1 sm:col-span-2 pt-3 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {toCleanUppercase(t.autoTableBadge)}
                </div>
                <div className="w-full border border-slate-300 rounded-lg overflow-x-auto bg-white shadow-sm">
                  <div className="flex bg-slate-200 font-bold text-slate-700 text-xs min-w-[200px]">
                    <div className="w-1/2 p-1.5 border-r border-slate-300 text-center font-mono">
                      {t.tableHeaderX}
                    </div>
                    <div className="w-1/2 p-1.5 text-center font-mono">
                      {t.tableHeaderVal}
                    </div>
                  </div>
                  {tableValues.map((row) => (
                    <div key={row.x} className="flex border-t border-slate-200 text-xs font-mono min-w-[200px]">
                      <div className="w-1/2 p-1 border-r border-slate-200 text-center text-slate-600">
                        {formatNumber(row.x)}
                      </div>
                      <div className="w-1/2 p-1 text-center font-bold text-indigo-700">
                        {formatNumber(row.val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Αναλυτικά Βήματα Απλοποίησης (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.flowBadge)}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                  {toCleanUppercase(t.distReductionBadge)}
                </span>
              </div>

              {/* 1. Αρχική Παράσταση */}
              <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans uppercase">
                  {t.origExprLabel}
                </div>
                <div className="text-amber-300 font-bold text-xs sm:text-sm md:text-base inline-flex flex-wrap items-center gap-1 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span>{distA} · (x {distB >= 0 ? `＋ ${distB}` : `－ ${Math.abs(distB)}`})</span>
                  <span>{distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`}</span>
                  <span>{distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}</span>
                </div>
              </div>

              {/* 2. Ανάπτυξη Επιμεριστικής */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5">
                <div className="text-slate-300 font-bold">
                  {t.step1Title}
                </div>
                <div className="font-mono text-indigo-200 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span>＝ ({distA}·x) ＋ ({distA}·{distB < 0 ? `(${distB})` : distB})</span>
                  <span>{distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`}</span>
                  <span>{distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}</span>
                </div>
                <div className="font-mono text-slate-300 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span>＝ {distA}x</span>
                  <span>{expandedConstFromParen >= 0 ? `＋ ${expandedConstFromParen}` : `－ ${Math.abs(expandedConstFromParen)}`}</span>
                  <span>{distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`}</span>
                  <span>{distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}</span>
                </div>
              </div>

              {/* 3. Ομαδοποίηση */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5">
                <div className="text-slate-300 font-bold">
                  {t.step2Title}
                </div>
                <div className="font-mono text-indigo-200 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span>＝ ({distA} ＋ {distC < 0 ? `(${distC})` : distC})·x</span>
                  <span>＋ ({expandedConstFromParen} ＋ {distD < 0 ? `(${distD})` : distD})</span>
                </div>
              </div>

              {/* 4. Τελική Ανηγμένη Μορφή */}
              <div className="p-3.5 sm:p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                <span className="text-xs sm:text-sm font-bold">
                  {toCleanUppercase(t.finalSimplifiedBadge)}
                </span>
                <span className="text-base sm:text-2xl lg:text-3xl font-black font-mono text-emerald-400 break-words [overflow-wrap:anywhere]">
                  ＝ {finalXCoeff}x {finalConstant >= 0 ? `＋ ${finalConstant}` : `－ ${Math.abs(finalConstant)}`}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}