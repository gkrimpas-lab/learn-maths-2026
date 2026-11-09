import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων από τόνους με διατήρηση του Α'
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

// Μέγιστος Κοινός Διαιρέτης
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

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική γραφή με ασφάλεια overflow
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full ${className}`}>
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

export default function PollaplasiasmosKlasmataTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για Εργαστήριο 1: Πολλαπλασιασμός Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(2);
  const [f2Den, setF2Den] = useState(5);

  // State για Εργαστήριο 2: Πολλαπλασιασμός Δεκαδικών
  const [dec1, setDec1] = useState(-1.5);
  const [dec2, setDec2] = useState(2.4);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Κλάσματα)
  const rawNum = useMemo(() => f1Num * f2Num, [f1Num, f2Num]);
  const rawDen = useMemo(() => f1Den * f2Den, [f1Den, f2Den]);
  const commonGcd = useMemo(() => gcd(rawNum, rawDen), [rawNum, rawDen]);
  const reducedNum = useMemo(() => rawNum / commonGcd, [rawNum, commonGcd]);
  const reducedDen = useMemo(() => rawDen / commonGcd, [rawDen, commonGcd]);

  const areOmmosite = useMemo(() => (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0), [f1Num, f2Num]);
  const areReciprocal = useMemo(() => reducedNum === 1 && reducedDen === 1, [reducedNum, reducedDen]);

  // Υπολογισμοί Εργαστηρίου 2 (Δεκαδικοί)
  const decProd = useMemo(() => Number((dec1 * dec2).toFixed(2)), [dec1, dec2]);
  const decOmmosite = useMemo(() => (dec1 > 0 && dec2 > 0) || (dec1 < 0 && dec2 < 0), [dec1, dec2]);

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Πολλαπλασιασμός Ρητών Αριθμών | Α' Γυμνασίου",
      pageDesc: "Έννοια πολλαπλασιασμού ρητών αριθμών (κλάσματα και δεκαδικοί), κανόνας προσήμων, επιμεριστική ιδιότητα, αντίστροφοι ρητοί και διαδραστικά εργαστήρια.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 16 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      mainTitle: "Πολλαπλασιασμός Ρητών Αριθμών",
      mainSubtitle: "Μαθαίνουμε τον κανόνα των προσήμων, πώς πολλαπλασιάζουμε κλάσματα και δεκαδικούς, τι είναι οι αντίστροφοι ρητοί αριθμοί και πώς εφαρμόζουμε την επιμεριστική ιδιότητα.",

      // Sec 1
      sec1Title: "Ο Κανόνας των Προσήμων στον Πολλαπλασιασμό",
      sameSignTitle: "ΟΜΟΣΗΜΟΙ ΡΗΤΟΙ",
      sameSignH3: "Γινόμενο Ομόσημων (Θετικό ＋)",
      sameSignP: "Το γινόμενο δύο ρητών αριθμών με το ίδιο πρόσημο είναι πάντοτε θετικός αριθμός:",
      diffSignTitle: "ΕΤΕΡΟΣΗΜΟΙ ΡΗΤΟΙ",
      diffSignH3: "Γινόμενο Ετερόσημων (Αρνητικό －)",
      diffSignP: "Το γινόμενο δύο ρητών αριθμών με διαφορετικό πρόσημο είναι πάντοτε αρνητικός αριθμός:",

      // Sec 2
      sec2Title: "Πολλαπλασιασμός Κλασμάτων & Αντίστροφοι Ρητοί",
      ruleFracTitle: "ΚΑΝΟΝΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΚΛΑΣΜΑΤΩΝ",
      ruleFracP: "Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή:",
      tipLabel: "Συμβουλή:",
      tipDesc: "Πριν εκτελέσουμε τους πολλαπλασιασμούς, απλοποιούμε με διαίρεση κοινών παραγόντων μεταξύ αριθμητών και παρονομαστών για να προκύπτει άμεσα ανάγωγο κλάσμα.",
      reciprocalTitle: "ΑΝΤΙΣΤΡΟΦΟΙ ΡΗΤΟΙ ΑΡΙΘΜΟΙ",
      reciprocalP: "Δύο μη μηδενικοί ρητοί αριθμοί ονομάζονται αντίστροφοι όταν το γινόμενό τους είναι ίσο με το 1:",
      reciprocal1: "Ο αντίστροφος του",
      reciprocal2: "είναι ο",
      reciprocalSameSign: "(διατηρεί πάντοτε το ίδιο πρόσημο).",
      reciprocalInt: "Ο αντίστροφος του 4 είναι ο",
      reciprocalZero: "Το 0 δεν έχει αντίστροφο αριθμό.",

      // Lab 1
      lab1Title: "🛠️ Εργαστήριο 1: Διαδραστικός Πολλαπλασιασμός Κλασμάτων & Έλεγχος Αντιστρόφων",
      factor1: "1ΟΣ ΠΑΡΑΓΟΝΤΑΣ",
      factor2: "2ΟΣ ΠΑΡΑΓΟΝΤΑΣ",
      numeratorA: "ΑΡΙΘΜΗΤΗΣ (α)",
      denominatorB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
      numeratorC: "ΑΡΙΘΜΗΤΗΣ (γ)",
      denominatorD: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
      analysisTitle: "ΑΝΑΛΥΣΗ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ",
      tagReciprocal: "ΑΝΤΙΣΤΡΟΦΟΙ ΡΗΤΟΙ (＝ 1)",
      tagSameSign: "ΟΜΟΣΗΜΟΙ (＋)",
      tagDiffSign: "ΕΤΕΡΟΣΗΜΟΙ (－)",
      initialProduct: "Αρχικό Γινόμενο:",
      step1Title: "Βήμα 1: Πολλαπλασιασμός αριθμητών και παρονομαστών:",
      finalResult: "ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:",
      afterDivision: "μετά από διαίρεση με το",

      // Sec 3
      sec3Title: "Ιδιότητες Πολλαπλασιασμού & Επιμεριστική Ιδιότητα",
      basicProps: "ΒΑΣΙΚΕΣ ΙΔΙΟΤΗΤΕΣ",
      propCommAssoc: "Αντιμεταθετική & Προσεταιριστική",
      propCommAssocDesc: "Μπορούμε να αλλάζουμε τη σειρά των παραγόντων ή να τους ομαδοποιούμε:",
      specialElements: "ΕΙΔΙΚΑ ΣΤΟΙΧΕΙΑ",
      propNeutralZero: "Ουδέτερο (1) & Μηδενικό (0)",
      propNeutralZeroDesc: "Το 1 δεν αλλάζει το αποτέλεσμα, ενώ το 0 μηδενίζει το γινόμενο:",
      fundProperty: "ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ",
      propDistributive: "Επιμεριστική Ιδιότητα",
      propDistributiveDesc: "Ο πολλαπλασιασμός επιμερίζεται ως προς την πρόσθεση και την αφαίρεση:",

      // Sec 4
      sec4Title: "Πολλαπλασιασμός Δεκαδικών Αριθμών",
      decRulesIntro: "Για να πολλαπλασιάσουμε ρητούς αριθμούς σε δεκαδική μορφή:",
      decStep1Title: "1. Πρόσημο:",
      decStep1Desc: "Εφαρμόζουμε τον κανόνα των προσήμων (ομόσημοι ＝ θετικό, ετερόσημοι ＝ αρνητικό).",
      decStep2Title: "2. Πολλαπλασιασμός:",
      decStep2Desc: "Πολλαπλασιάζουμε τους αριθμούς αγνοώντας την υποδιαστολή.",
      decStep3Title: "3. Θέση Υποδιαστολής:",
      decStep3Desc: "Στο αποτέλεσμα τοποθετούμε υποδιαστολή χωρίζοντας τόσα δεκαδικά ψηφία όσα έχουν συνολικά και οι δύο παράγοντες.",
      decExamplesTitle: "ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ",

      // Lab 2
      lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Πολλαπλασιασμού Δεκαδικών",
      intStepLabel: "ΑΚΕΡΑΙΟ (±1)",
      decStepLabel: "ΔΕΚΑΔΙΚΟ (±0,1)",
      decResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΔΕΚΑΔΙΚΩΝ",
      decExpl1: "Οι παράγοντες είναι",
      decExplOmmosite: "ομόσημοι",
      decExplEterosite: "ετερόσημοι",
      decExpl2: ", επομένως το πρόσημο είναι",
      decExplPositive: "θετικό (＋)",
      decExplNegative: "αρνητικό (－)",
      decExpl3: ". Πολλαπλασιάσαμε",
      decExpl4: "και χωρίσαμε 2 δεκαδικά ψηφία (1 ＋ 1 ＝ 2 δεκαδικά)."
    },
    en: {
      pageTitle: "Multiplication of Rational Numbers | 7th Grade",
      pageDesc: "Concepts of rational number multiplication (fractions and decimals), sign rules, distributive property, reciprocal numbers and interactive labs.",
      backText: "7th Grade",
      btnExercises: "EXERCISES",
      badgeHeader: "7TH GRADE • CHAPTER 16 • THEORY & LAB",
      mainTitle: "Multiplication of Rational Numbers",
      mainSubtitle: "Learn the sign rules, how to multiply fractions and decimals, what reciprocal rational numbers are, and how to apply the distributive property.",

      // Sec 1
      sec1Title: "Sign Rules in Multiplication",
      sameSignTitle: "SAME SIGNS",
      sameSignH3: "Product of Same Signs (Positive ＋)",
      sameSignP: "The product of two rational numbers with the same sign is always positive:",
      diffSignTitle: "DIFFERENT SIGNS",
      diffSignH3: "Product of Different Signs (Negative －)",
      diffSignP: "The product of two rational numbers with different signs is always negative:",

      // Sec 2
      sec2Title: "Fraction Multiplication & Reciprocal Numbers",
      ruleFracTitle: "FRACTION MULTIPLICATION RULE",
      ruleFracP: "Multiply numerator by numerator and denominator by denominator:",
      tipLabel: "Tip:",
      tipDesc: "Before multiplying, simplify by dividing common factors between numerators and denominators to reach an irreducible fraction directly.",
      reciprocalTitle: "RECIPROCAL RATIONAL NUMBERS",
      reciprocalP: "Two non-zero rational numbers are called reciprocals when their product equals 1:",
      reciprocal1: "The reciprocal of",
      reciprocal2: "is",
      reciprocalSameSign: "(it always keeps the same sign).",
      reciprocalInt: "The reciprocal of 4 is",
      reciprocalZero: "0 has no reciprocal number.",

      // Lab 1
      lab1Title: "🛠️ Lab 1: Interactive Fraction Multiplication & Reciprocal Checker",
      factor1: "1ST FACTOR",
      factor2: "2ND FACTOR",
      numeratorA: "NUMERATOR (a)",
      denominatorB: "DENOMINATOR (b)",
      numeratorC: "NUMERATOR (c)",
      denominatorD: "DENOMINATOR (d)",
      analysisTitle: "MULTIPLICATION BREAKDOWN",
      tagReciprocal: "RECIPROCALS (＝ 1)",
      tagSameSign: "SAME SIGNS (＋)",
      tagDiffSign: "DIFFERENT SIGNS (－)",
      initialProduct: "Initial Product:",
      step1Title: "Step 1: Multiply numerators and denominators:",
      finalResult: "FINAL IRREDUCIBLE RESULT:",
      afterDivision: "after division by",

      // Sec 3
      sec3Title: "Properties of Multiplication & Distributive Property",
      basicProps: "BASIC PROPERTIES",
      propCommAssoc: "Commutative & Associative",
      propCommAssocDesc: "We can change the order of factors or group them:",
      specialElements: "SPECIAL ELEMENTS",
      propNeutralZero: "Identity (1) & Zero Property (0)",
      propNeutralZeroDesc: "1 leaves the number unchanged, while 0 yields zero product:",
      fundProperty: "FUNDAMENTAL PROPERTY",
      propDistributive: "Distributive Property",
      propDistributiveDesc: "Multiplication distributes over addition and subtraction:",

      // Sec 4
      sec4Title: "Multiplication of Decimal Numbers",
      decRulesIntro: "To multiply rational numbers in decimal form:",
      decStep1Title: "1. Sign:",
      decStep1Desc: "Apply the sign rule (same signs ＝ positive, different signs ＝ negative).",
      decStep2Title: "2. Multiply:",
      decStep2Desc: "Multiply numbers ignoring the decimal point.",
      decStep3Title: "3. Decimal Places:",
      decStep3Desc: "Place the decimal point so the result has as many decimal digits as the sum of decimal places in both factors.",
      decExamplesTitle: "CALCULATION EXAMPLES",

      // Lab 2
      lab2Title: "🛠️ Lab 2: Interactive Decimal Multiplication Calculator",
      intStepLabel: "INTEGER (±1)",
      decStepLabel: "DECIMAL (±0.1)",
      decResultTitle: "DECIMAL MULTIPLICATION RESULT",
      decExpl1: "The factors have",
      decExplOmmosite: "the same sign",
      decExplEterosite: "different signs",
      decExpl2: ", therefore the sign is",
      decExplPositive: "positive (＋)",
      decExplNegative: "negative (－)",
      decExpl3: ". We multiplied",
      decExpl4: "and separated 2 decimal digits (1 ＋ 1 ＝ 2 decimal places)."
    }
  }[locale];

  // Βοηθητική μορφοποίηση δεκαδικών ανά γλώσσα
  const formatDec = (val, digits = 1) => {
    return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  };

  const formatDecProd = (val) => {
    return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
          href="/a-gymnasiou/18-pollaplasiasmos-klasmata-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {toCleanUppercase(t.mainTitle)}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΟΝ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span className="break-words">{toCleanUppercase(t.sec1Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομόσημοι */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                    {toCleanUppercase(t.sameSignTitle)}
                  </span>
                  <span className="text-xl">➕</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t.sameSignH3}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.sameSignP}
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>(＋) · (＋) ＝ <strong>＋</strong></li>
                  <li>(－) · (－) ＝ <strong>＋</strong></li>
                </ul>
              </div>

              {/* Ομόσημοι Παραδείγματα */}
              <div className="space-y-2 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100 flex-wrap gap-2">
                  <span>(＋3) · (＋4)</span>
                  <span className="font-bold text-emerald-700">＝ ＋12</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100 flex-wrap gap-2">
                  <span className="inline-flex items-center flex-wrap">
                    (<Frac num={2} den={3} isNeg={true} />) · (<Frac num={4} den={5} isNeg={true} />)
                  </span>
                  <span className="font-bold text-emerald-700 inline-flex items-center">
                    ＝ ＋<Frac num={8} den={15} />
                  </span>
                </div>
              </div>
            </div>

            {/* Ετερόσημοι */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                    {toCleanUppercase(t.diffSignTitle)}
                  </span>
                  <span className="text-xl">➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t.diffSignH3}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.diffSignP}
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>(＋) · (－) ＝ <strong>－</strong></li>
                  <li>(－) · (＋) ＝ <strong>－</strong></li>
                </ul>
              </div>

              {/* Ετερόσημοι Παραδείγματα */}
              <div className="space-y-2 pt-2 border-t border-sky-100 font-mono text-xs sm:text-sm text-sky-950">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-sky-100 flex-wrap gap-2">
                  <span>(＋2{locale === 'el' ? ',' : '.'}5) · (－3)</span>
                  <span className="font-bold text-rose-700">＝ －7{locale === 'el' ? ',' : '.'}5</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-sky-100 flex-wrap gap-2">
                  <span className="inline-flex items-center flex-wrap">
                    (＋<Frac num={3} den={7} />) · (<Frac num={5} den={4} isNeg={true} />)
                  </span>
                  <span className="font-bold text-rose-700 inline-flex items-center">
                    ＝ <Frac num={15} den={28} isNeg={true} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ & ΑΝΤΙΣΤΡΟΦΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span className="break-words">{toCleanUppercase(t.sec2Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Κανόνας Κλασμάτων */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                {toCleanUppercase(t.ruleFracTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.ruleFracP}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>·</span>
                <Frac num={locale === 'el' ? 'γ' : 'c'} den={locale === 'el' ? 'δ' : 'd'} />
                <span>＝</span>
                <Frac 
                  num={`${locale === 'el' ? 'α' : 'a'} · ${locale === 'el' ? 'γ' : 'c'}`} 
                  den={`${locale === 'el' ? 'β' : 'b'} · ${locale === 'el' ? 'δ' : 'd'}`} 
                />
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong>{t.tipLabel}</strong> {t.tipDesc}
              </div>
            </div>

            {/* Αντίστροφοι Ρητοί */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                {toCleanUppercase(t.reciprocalTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.reciprocalP}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-sky-950 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>·</span>
                <Frac num={locale === 'el' ? 'β' : 'b'} den={locale === 'el' ? 'α' : 'a'} />
                <span>＝ 1</span>
              </div>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                <li>{t.reciprocal1} <Frac num="3" den="5" /> {t.reciprocal2} <Frac num="5" den="3" />.</li>
                <li>{t.reciprocal1} <Frac num="-2" den="7" /> {t.reciprocal2} <Frac num="-7" den="2" /> {t.reciprocalSameSign}</li>
                <li>{t.reciprocalInt} <Frac num="1" den="4" />.</li>
                <li>{t.reciprocalZero}</li>
              </ul>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.factor1)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numeratorA)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Num > 0 ? `＋${f1Num}` : f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denominatorB)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    {toCleanUppercase(t.factor2)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numeratorC)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denominatorD)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.analysisTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    areReciprocal
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : areOmmosite
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {toCleanUppercase(areReciprocal ? t.tagReciprocal : areOmmosite ? t.tagSameSign : t.tagDiffSign)}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-sm sm:text-lg">
                  <span className="text-xs text-slate-300 font-sans">{t.initialProduct}</span>
                  <div className="inline-flex items-center gap-1 flex-wrap">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-amber-400 font-bold">·</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Ενιαίο Κλάσμα */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    {t.step1Title}
                  </div>
                  <div className="font-mono text-sm sm:text-base inline-flex items-center gap-1.5 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono shrink-0">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b border-white w-full text-center">
                          ({f1Num > 0 ? `＋${f1Num}` : f1Num}) · ({f2Num > 0 ? `＋${f2Num}` : f2Num})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {f1Den} · {f2Den}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={rawNum} den={rawDen} className="text-indigo-200" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    {toCleanUppercase(t.finalResult)}
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 inline-flex items-center gap-2 flex-wrap">
                    {rawNum === 0 ? (
                      <span>0</span>
                    ) : reducedDen === 1 ? (
                      <span>{reducedNum > 0 ? `＋${reducedNum}` : reducedNum}</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {commonGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            ({t.afterDivision} {commonGcd})
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

        {/* 3. ΙΔΙΟΤΗΤΕΣ & ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span className="break-words">{toCleanUppercase(t.sec3Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Αντιμεταθετική & Προσεταιριστική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                {toCleanUppercase(t.basicProps)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.propCommAssoc}</h3>
              <p className="text-slate-600">
                {t.propCommAssocDesc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>{locale === 'el' ? 'α · β ＝ β · α' : 'a · b ＝ b · a'}</div>
                <div>{locale === 'el' ? '(α · β) · γ ＝ α · (β · γ)' : '(a · b) · c ＝ a · (b · c)'}</div>
              </div>
            </div>

            {/* Ουδέτερο & Μηδενικό Στοιχείο */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                {toCleanUppercase(t.specialElements)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.propNeutralZero}</h3>
              <p className="text-slate-600">
                {t.propNeutralZeroDesc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>{locale === 'el' ? 'α · 1 ＝ α' : 'a · 1 ＝ a'}</div>
                <div>{locale === 'el' ? 'α · 0 ＝ 0' : 'a · 0 ＝ 0'}</div>
              </div>
            </div>

            {/* Επιμεριστική Ιδιότητα */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5 md:col-span-2 lg:col-span-1">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">
                {toCleanUppercase(t.fundProperty)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.propDistributive}</h3>
              <p className="text-slate-600">
                {t.propDistributiveDesc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>{locale === 'el' ? 'α · (β ＋ γ) ＝ α · β ＋ α · γ' : 'a · (b ＋ c) ＝ a · b ＋ a · c'}</div>
                <div>{locale === 'el' ? 'α · (β － γ) ＝ α · β － α · γ' : 'a · (b － c) ＝ a · b － a · c'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΕΚΑΔΙΚΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span className="break-words">{toCleanUppercase(t.sec4Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>{t.decRulesIntro}</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <strong>{t.decStep1Title}</strong> {t.decStep1Desc}
                </div>
                <div>
                  <strong>{t.decStep2Title}</strong> {t.decStep2Desc}
                </div>
                <div>
                  <strong>{t.decStep3Title}</strong> {t.decStep3Desc}
                </div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                {toCleanUppercase(t.decExamplesTitle)}
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                <div className="break-words">
                  (＋1{locale === 'el' ? ',' : '.'}2) · (＋0{locale === 'el' ? ',' : '.'}4) ＝ ＋(12 · 4 : 100) ＝ <strong>＋0{locale === 'el' ? ',' : '.'}48</strong>
                </div>
                <div className="break-words">
                  (－2{locale === 'el' ? ',' : '.'}5) · (＋0{locale === 'el' ? ',' : '.'}3) ＝ －(25 · 3 : 100) ＝ <strong>－0{locale === 'el' ? ',' : '.'}75</strong>
                </div>
                <div className="break-words">
                  (－1{locale === 'el' ? ',' : '.'}5) · (－0{locale === 'el' ? ',' : '.'}6) ＝ ＋(15 · 6 : 100) ＝ <strong>＋0{locale === 'el' ? ',' : '.'}90 ＝ ＋0{locale === 'el' ? ',' : '.'}9</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers: Ακέραιο (±1) και Δεκαδικό (±0.1) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.factor1)}
                    </label>
                    <span className="text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-10, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(10, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-10, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        －0{locale === 'el' ? ',' : '.'}1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(10, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        ＋0{locale === 'el' ? ',' : '.'}1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.factor2)}
                    </label>
                    <span className="text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-10, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(10, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-10, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        －0{locale === 'el' ? ',' : '.'}1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(10, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 transition-all"
                      >
                        ＋0{locale === 'el' ? ',' : '.'}1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.decResultTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    decOmmosite
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {toCleanUppercase(decOmmosite ? t.tagSameSign : t.tagDiffSign)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-3xl lg:text-4xl font-black py-2 flex-wrap">
                  <span>({dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)})</span>
                  <span className="text-amber-400 font-sans">·</span>
                  <span>({dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)})</span>
                  <span className="text-indigo-400 font-sans">＝</span>
                  <span className="text-emerald-400">
                    {decProd > 0 ? `＋${formatDecProd(decProd)}` : formatDecProd(decProd)}
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words">
                  {t.decExpl1} <strong>{decOmmosite ? t.decExplOmmosite : t.decExplEterosite}</strong>{t.decExpl2} <strong>{decOmmosite ? t.decExplPositive : t.decExplNegative}</strong>{t.decExpl3} {Math.round(Math.abs(dec1) * 10)} · {Math.round(Math.abs(dec2) * 10)} ＝ {Math.round(Math.abs(dec1) * 10) * Math.round(Math.abs(dec2) * 10)} {t.decExpl4}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}