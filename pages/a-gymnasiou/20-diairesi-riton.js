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

// Ειδικό component για οπτική αναπαράσταση Σύνθετου Κλάσματος
function CompoundFrac({ num1, den1, num2, den2, isNeg = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 sm:gap-1.5 align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}>
      {isNeg && <span className="font-bold text-xl sm:text-2xl">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        {/* Αριθμητής (Κλάσμα 1) */}
        <span className="pb-1 px-1 sm:px-2 border-b-2 sm:border-b-4 border-amber-400 w-full flex justify-center">
          <Frac num={num1} den={den1} />
        </span>
        {/* Παρονομαστής (Κλάσμα 2) */}
        <span className="pt-1 px-1 sm:px-2 w-full flex justify-center">
          <Frac num={num2} den={den2} />
        </span>
      </span>
    </span>
  );
}

export default function DiairesiRitonTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για Εργαστήριο 1: Διαίρεση Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(2);
  const [f2Den, setF2Den] = useState(5);

  // State για Εργαστήριο 2: Σύνθετο Κλάσμα (επιτρέπονται αρνητικά στους αριθμητές)
  const [cNum1, setCNum1] = useState(3);
  const [cDen1, setCDen1] = useState(4);
  const [cNum2, setCNum2] = useState(-5);
  const [cDen2, setCDen2] = useState(6);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      if (min === 1 && next < 1) next = 1;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1 (Διαίρεση)
  const recipNum = f2Den;
  const recipDen = f2Num;

  const rawProdNum = useMemo(() => f1Num * recipNum, [f1Num, recipNum]);
  const rawProdDen = useMemo(() => f1Den * recipDen, [f1Den, recipDen]);

  const areOmmosite = useMemo(() => (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0), [f1Num, f2Num]);
  const isFinalNegative = rawProdNum * rawProdDen < 0;

  const commonGcd = useMemo(() => gcd(rawProdNum, rawProdDen), [rawProdNum, rawProdDen]);
  const reducedNum = useMemo(() => Math.abs(rawProdNum) / commonGcd, [rawProdNum, commonGcd]);
  const reducedDen = useMemo(() => Math.abs(rawProdDen) / commonGcd, [rawProdDen, commonGcd]);

  // Υπολογισμοί Εργαστηρίου 2 (Σύνθετο Κλάσμα με πρόσημα)
  const akroiProd = useMemo(() => cNum1 * cDen2, [cNum1, cDen2]);
  const mesoiProd = useMemo(() => cDen1 * cNum2, [cDen1, cNum2]);

  const isCompoundNegative = (akroiProd * mesoiProd) < 0;
  const absAkroi = Math.abs(akroiProd);
  const absMesoi = Math.abs(mesoiProd);
  const compoundGcd = useMemo(() => gcd(absAkroi, absMesoi), [absAkroi, absMesoi]);

  const redCompoundNum = useMemo(() => absAkroi / compoundGcd, [absAkroi, compoundGcd]);
  const redCompoundDen = useMemo(() => absMesoi / compoundGcd, [absMesoi, compoundGcd]);

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Διαίρεση Ρητών & Σύνθετα Κλάσματα | Α' Γυμνασίου",
      pageDesc: "Έννοια της διαίρεσης ρητών αριθμών, σύνδεση με τον αντίστροφο αριθμό, κανόνας προσήμων και μετατροπή σύνθετου κλάσματος σε απλό.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 18 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      mainTitle: "Διαίρεση Ρητών Αριθμών & Σύνθετα Κλάσματα",
      mainSubtitle: "Μαθαίνουμε πώς η διαίρεση ρητών μετατρέπεται σε πολλαπλασιασμό με τον αντίστροφο αριθμό, πώς εφαρμόζονται οι κανόνες προσήμων και πώς μετατρέπουμε οποιοδήποτε σύνθετο κλάσμα σε απλό.",

      // Ενότητα 1
      sec1Title: "Ορισμός της Διαίρεσης & Κανόνας Προσήμων",
      sec1DefP1: "Η διαίρεση ενός ρητού αριθμού α με έναν μη μηδενικό ρητό β (β ≠ 0) ορίζεται ως ο πολλαπλασιασμός του διαιρετέου α με τον αντίστροφο του διαιρέτη β:",
      sec1DefConstraint: "(β ≠ 0)",
      zeroWarningTitle: "Απαγόρευση Μηδενός:",
      zeroWarningDesc: "Η διαίρεση με το μηδέν (0) είναι αδύνατη και δεν ορίζεται ποτέ στα μαθηματικά!",
      ruleSignsTitle: "Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΗ ΔΙΑΙΡΕΣΗ",
      ruleSignsDesc: "Ισχύει ακριβώς ο ίδιος κανόνας προσήμων όπως και στον πολλαπλασιασμό:",
      sameSignsLabel: "Ομόσημοι ➔ Θετικό (＋)",
      diffSignsLabel: "Ετερόσημοι ➔ Αρνητικό (－)",

      // Ενότητα 2
      sec2Title: "Πώς Διαιρούμε Κλάσματα",
      step1Title: "ΒΗΜΑ 1",
      step1H4: "Αντιστροφή Διαιρέτη",
      step1Desc: "Διατηρούμε το 1ο κλάσμα (διαιρετέο) ακριβώς όπως είναι και αντιστρέφουμε τους όρους του 2ου κλάσματος (διαιρέτη).",
      step2Title: "ΒΗΜΑ 2",
      step2H4: "Μετατροπή σε Πολλαπλασιασμό",
      step2Desc: "Αντικαθιστούμε το σύμβολο της διαίρεσης (：) με το σύμβολο του πολλαπλασιασμού (·).",
      step3Title: "ΒΗΜΑ 3",
      step3H4: "Υπολογισμός & Απλοποίηση",
      step3Desc: "Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή και, αν χρειάζεται, απλοποιούμε με διαίρεση σε ανάγωγο κλάσμα.",

      // Εργαστήριο 1
      lab1Title: "🛠️ Εργαστήριο 1: Διαδραστική Διαίρεση Κλασμάτων Βήμα-Βήμα",
      f1Header: "1ΟΣ ΟΡΟΣ (ΔΙΑΙΡΕΤΕΟΣ)",
      f2Header: "2ΟΣ ΟΡΟΣ (ΔΙΑΙΡΕΤΗΣ)",
      f1NumLabel: "ΑΡΙΘΜΗΤΗΣ (α)",
      f1DenLabel: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
      f2NumLabel: "ΑΡΙΘΜΗΤΗΣ (γ ≠ 0)",
      f2DenLabel: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
      analysisTitle: "ΑΝΑΛΥΣΗ ΔΙΑΙΡΕΣΗΣ",
      badgeOmmosite: "ΟΜΟΣΗΜΟΙ ➔ ΠΗΛΙΚΟ (＋)",
      badgeEterosite: "ΕΤΕΡΟΣΗΜΟΙ ➔ ΠΗΛΙΚΟ (－)",
      initDivLabel: "Αρχική Διαίρεση:",
      lab1Step1Desc: "Βήμα 1: Πολλαπλασιασμός με τον αντίστροφο του διαιρέτη:",
      lab1Step2Desc: "Βήμα 2: Γινόμενο αριθμητών και παρονομαστών:",
      finalQuotientLabel: "ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΠΗΛΙΚΟ:",
      afterDivLabel: "μετά από διαίρεση με το",

      // Ενότητα 3
      sec3Title: "Σύνθετα Κλάσματα: Ορισμός & Μετατροπή σε Απλό",
      compoundDefP1: "Σύνθετο ονομάζεται το κλάσμα που έχει ως αριθμητή ή παρονομαστή (ή και τα δύο) ένα άλλο κλάσμα.",
      compoundDefP2: "Η κύρια (μεγάλη) γραμμή κλάσματος δεν είναι τίποτε άλλο παρά το σύμβολο της διαίρεσης:",
      akroiMesoiTitle: "Ο ΚΑΝΟΝΑΣ ΤΩΝ ΑΚΡΩΝ ΚΑΙ ΜΕΣΩΝ ΟΡΩΝ",
      akroiMesoiDesc: "Για να μετατρέψουμε ένα σύνθετο κλάσμα απευθείας σε απλό, σχηματίζουμε ένα νέο κλάσμα όπου:",
      akroiDesc: "Αριθμητής: είναι το γινόμενο των άκρων όρων (α · δ).",
      mesoiDesc: "Παρονομαστής: είναι το γινόμενο των μέσων όρων (β · γ).",
      akroiWord: "άκρων όρων",
      mesoiWord: "μέσων όρων",

      // Εργαστήριο 2
      lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Μετατροπέας Σύνθετου Κλάσματος σε Απλό & Έλεγχος Προσήμων",
      topFracHeader: "ΠΑΝΩ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)",
      bottomFracHeader: "ΚΑΤΩ ΚΛΑΣΜΑ (ΠΑΡΟΝΟΜΑΣΤΗΣ)",
      akrosA: "ΑΚΡΟΣ ΟΡΟΣ (α)",
      mesosB: "ΜΕΣΟΣ ΟΡΟΣ (β)",
      mesosC: "ΜΕΣΟΣ ΟΡΟΣ (γ ≠ 0)",
      akrosD: "ΑΚΡΟΣ ΟΡΟΣ (δ)",
      toSimpleFracTitle: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΠΛΟ ΚΛΑΣΜΑ",
      badgeCompoundPos: "ΟΜΟΣΗΜΟΙ ΟΡΟΙ ➔ (＋)",
      badgeCompoundNeg: "ΕΤΕΡΟΣΗΜΟΙ ΟΡΟΙ ➔ (－)",
      prodAkroiLabel: "Γινόμενο Άκρων",
      prodMesoiLabel: "Γινόμενο Μέσων",
      gcdSimplifyText: "Απλοποιήσαμε αριθμητή και παρονομαστή με διαίρεση διά του Μ.Κ.Δ."
    },
    en: {
      pageTitle: "Division of Rational Numbers & Complex Fractions | 7th Grade",
      pageDesc: "Concept of rational number division, connection with reciprocals, sign rules and converting complex fractions into simple fractions.",
      backText: "7th Grade",
      btnExercises: "EXERCISES",
      badgeHeader: "7TH GRADE • CHAPTER 18 • THEORY & LAB",
      mainTitle: "Division of Rational Numbers & Complex Fractions",
      mainSubtitle: "Learn how dividing rational numbers turns into multiplying by the reciprocal, how sign rules apply, and how to convert any complex fraction into a simple one.",

      // Section 1
      sec1Title: "Definition of Division & Sign Rules",
      sec1DefP1: "Division of a rational number a by a non-zero rational b (b ≠ 0) is defined as multiplying the dividend a by the reciprocal of the divisor b:",
      sec1DefConstraint: "(b ≠ 0)",
      zeroWarningTitle: "Zero Prohibition:",
      zeroWarningDesc: "Division by zero (0) is undefined and impossible in mathematics!",
      ruleSignsTitle: "SIGN RULES IN DIVISION",
      ruleSignsDesc: "The exact same sign rules apply as in multiplication:",
      sameSignsLabel: "Same signs ➔ Positive (＋)",
      diffSignsLabel: "Different signs ➔ Negative (－)",

      // Section 2
      sec2Title: "How to Divide Fractions",
      step1Title: "STEP 1",
      step1H4: "Reciprocal of Divisor",
      step1Desc: "Keep the 1st fraction (dividend) as it is and invert the 2nd fraction (divisor).",
      step2Title: "STEP 2",
      step2H4: "Convert to Multiplication",
      step2Desc: "Replace the division symbol (：) with the multiplication symbol (·).",
      step3Title: "STEP 3",
      step3H4: "Calculate & Simplify",
      step3Desc: "Multiply numerator by numerator and denominator by denominator and simplify to an irreducible fraction if needed.",

      // Lab 1
      lab1Title: "🛠️ Lab 1: Step-by-Step Interactive Fraction Division",
      f1Header: "1ST TERM (DIVIDEND)",
      f2Header: "2ND TERM (DIVISOR)",
      f1NumLabel: "NUMERATOR (a)",
      f1DenLabel: "DENOMINATOR (b)",
      f2NumLabel: "NUMERATOR (c ≠ 0)",
      f2DenLabel: "DENOMINATOR (d)",
      analysisTitle: "DIVISION BREAKDOWN",
      badgeOmmosite: "SAME SIGNS ➔ QUOTIENT (＋)",
      badgeEterosite: "DIFFERENT SIGNS ➔ QUOTIENT (－)",
      initDivLabel: "Initial Division:",
      lab1Step1Desc: "Step 1: Multiply by the reciprocal of the divisor:",
      lab1Step2Desc: "Step 2: Multiply numerators and denominators:",
      finalQuotientLabel: "FINAL IRREDUCIBLE QUOTIENT:",
      afterDivLabel: "after division by",

      // Section 3
      sec3Title: "Complex Fractions: Definition & Conversion",
      compoundDefP1: "A complex fraction is a fraction whose numerator or denominator (or both) contains another fraction.",
      compoundDefP2: "The main fraction line simply represents the division operation:",
      akroiMesoiTitle: "THE EXTREMES AND MEANS RULE",
      akroiMesoiDesc: "To convert a complex fraction directly into a simple fraction, form a new fraction where:",
      akroiDesc: "Numerator: the product of the extremes (a · d).",
      mesoiDesc: "Denominator: the product of the means (b · c).",
      akroiWord: "extremes",
      mesoiWord: "means",

      // Lab 2
      lab2Title: "🛠️ Lab 2: Interactive Complex Fraction Converter & Sign Checker",
      topFracHeader: "TOP FRACTION (NUMERATOR)",
      bottomFracHeader: "BOTTOM FRACTION (DENOMINATOR)",
      akrosA: "EXTREME (a)",
      mesosB: "MEAN (b)",
      mesosC: "MEAN (c ≠ 0)",
      akrosD: "EXTREME (d)",
      toSimpleFracTitle: "CONVERSION TO SIMPLE FRACTION",
      badgeCompoundPos: "SAME SIGNS ➔ (＋)",
      badgeCompoundNeg: "DIFFERENT SIGNS ➔ (－)",
      prodAkroiLabel: "Product of Extremes",
      prodMesoiLabel: "Product of Means",
      gcdSimplifyText: "Simplified numerator and denominator by dividing by GCD"
    }
  }[locale];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/20-diairesi-riton-ask"
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

        {/* 1. ΟΡΙΣΜΟΣ ΔΙΑΙΡΕΣΗΣ & ΚΑΝΟΝΑΣ ΠΡΟΣΗΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span className="break-words">{toCleanUppercase(t.sec1Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                {t.sec1DefP1}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-2xl font-mono shadow-sm flex items-center justify-center gap-2 flex-wrap">
                <span>{locale === 'el' ? 'α ： β ＝ α ·' : 'a ： b ＝ a ·'}</span>
                <Frac num="1" den={locale === 'el' ? 'β' : 'b'} />
                <span className="text-xs text-slate-500 font-sans font-normal">{t.sec1DefConstraint}</span>
              </div>
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs sm:text-sm text-rose-950">
                <strong>{t.zeroWarningTitle}</strong> {t.zeroWarningDesc}
              </div>
            </div>

            {/* Κανόνας Προσήμων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.ruleSignsTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.ruleSignsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-emerald-700 font-bold font-sans">{t.sameSignsLabel}</div>
                  <div>(＋) ： (＋) ＝ <strong>＋</strong></div>
                  <div>(－) ： (－) ＝ <strong>＋</strong></div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-rose-700 font-bold font-sans">{t.diffSignsLabel}</div>
                  <div>(＋) ： (－) ＝ <strong>－</strong></div>
                  <div>(－) ： (＋) ＝ <strong>－</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span className="break-words">{toCleanUppercase(t.sec2Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">{toCleanUppercase(t.step1Title)}</div>
              <h4 className="font-bold text-slate-900 text-base">{t.step1H4}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">{toCleanUppercase(t.step2Title)}</div>
              <h4 className="font-bold text-slate-900 text-base">{t.step2H4}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">{toCleanUppercase(t.step3Title)}</div>
              <h4 className="font-bold text-slate-900 text-base">{t.step3H4}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>

          {/* Μαθηματικός Κανόνας */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center font-mono font-bold text-indigo-950 text-base sm:text-xl flex items-center justify-center gap-2 sm:gap-3 flex-wrap shadow-sm">
            <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
            <span className="text-rose-600 font-bold">：</span>
            <Frac num={locale === 'el' ? 'γ' : 'c'} den={locale === 'el' ? 'δ' : 'd'} />
            <span className="text-indigo-400">＝</span>
            <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
            <span className="text-emerald-600 font-bold">·</span>
            <Frac num={locale === 'el' ? 'δ' : 'd'} den={locale === 'el' ? 'γ' : 'c'} />
            <span className="text-indigo-400">＝</span>
            <Frac 
              num={`${locale === 'el' ? 'α' : 'a'} · ${locale === 'el' ? 'δ' : 'd'}`} 
              den={`${locale === 'el' ? 'β' : 'b'} · ${locale === 'el' ? 'γ' : 'c'}`} 
            />
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα (Διαιρετέος) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.f1Header)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.f1NumLabel)}
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
                      {toCleanUppercase(t.f1DenLabel)}
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

                {/* 2ο Κλάσμα (Διαιρέτης) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    {toCleanUppercase(t.f2Header)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.f2NumLabel)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = f2Num - 1;
                          if (next === 0) next = -1;
                          handleStep(setF2Num, next - f2Num, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = f2Num + 1;
                          if (next === 0) next = 1;
                          handleStep(setF2Num, next - f2Num, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.f2DenLabel)}
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
                    areOmmosite
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {toCleanUppercase(areOmmosite ? t.badgeOmmosite : t.badgeEterosite)}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-sm sm:text-lg">
                  <span className="text-xs text-slate-300 font-sans">{t.initDivLabel}</span>
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-rose-400 font-bold">：</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Αντιστροφή σε πολλαπλασιασμό */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    {t.lab1Step1Desc}
                  </div>
                  <div className="font-mono text-sm sm:text-base inline-flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center">
                      (
                      <Frac num={f1Num} den={f1Den} className="text-indigo-200" />
                      )
                    </span>
                    <span className="text-emerald-400 font-bold">·</span>
                    <span className="inline-flex items-center">
                      (
                      <Frac num={recipNum} den={recipDen} className="text-sky-200" />
                      )
                    </span>
                  </div>
                </div>

                {/* Βήμα 2: Γινόμενο όρων */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    {t.lab1Step2Desc}
                  </div>
                  <div className="font-mono text-sm sm:text-base inline-flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <Frac num={rawProdNum} den={rawProdDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    {toCleanUppercase(t.finalQuotientLabel)}
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 inline-flex items-center gap-2 flex-wrap">
                    {f1Num === 0 ? (
                      <span>0</span>
                    ) : reducedDen === 1 ? (
                      <span>{isFinalNegative ? `－${reducedNum}` : `＋${reducedNum}`}</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} isNeg={isFinalNegative} className="text-emerald-400 text-xl sm:text-3xl" />
                        {commonGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            ({t.afterDivLabel} {commonGcd})
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

        {/* 3. ΣΥΝΘΕΤΑ ΚΛΑΣΜΑΤΑ ΚΑΙ ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΠΛΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span className="break-words">{toCleanUppercase(t.sec3Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                {t.compoundDefP1}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.compoundDefP2}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center font-mono font-bold text-indigo-950 text-base sm:text-lg flex items-center justify-center gap-3 flex-wrap">
                <CompoundFrac 
                  num1={locale === 'el' ? 'α' : 'a'} 
                  den1={locale === 'el' ? 'β' : 'b'} 
                  num2={locale === 'el' ? 'γ' : 'c'} 
                  den2={locale === 'el' ? 'δ' : 'd'} 
                />
                <span>＝</span>
                <span className="inline-flex items-center flex-wrap">
                  (<Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />) ： (<Frac num={locale === 'el' ? 'γ' : 'c'} den={locale === 'el' ? 'δ' : 'd'} />)
                </span>
              </div>
            </div>

            {/* Ο Κανόνας Άκρων - Μέσων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.akroiMesoiTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.akroiMesoiDesc}
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{locale === 'el' ? 'Αριθμητής:' : 'Numerator:'}</strong> {locale === 'el' ? 'είναι το γινόμενο των' : 'is the product of the'} <span className="text-amber-700 font-bold">{t.akroiWord}</span> ({locale === 'el' ? 'α · δ' : 'a · d'}).
                </li>
                <li>
                  <strong>{locale === 'el' ? 'Παρονομαστής:' : 'Denominator:'}</strong> {locale === 'el' ? 'είναι το γινόμενο των' : 'is the product of the'} <span className="text-sky-700 font-bold">{t.mesoiWord}</span> ({locale === 'el' ? 'β · γ' : 'b · c'}).
                </li>
              </ul>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-950 text-base sm:text-lg flex items-center justify-center gap-2 flex-wrap">
                <CompoundFrac 
                  num1={locale === 'el' ? 'α' : 'a'} 
                  den1={locale === 'el' ? 'β' : 'b'} 
                  num2={locale === 'el' ? 'γ' : 'c'} 
                  den2={locale === 'el' ? 'δ' : 'd'} 
                />
                <span>＝</span>
                <Frac 
                  num={`${locale === 'el' ? 'α' : 'a'} · ${locale === 'el' ? 'δ' : 'd'}`} 
                  den={`${locale === 'el' ? 'β' : 'b'} · ${locale === 'el' ? 'γ' : 'c'}`} 
                />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΣΥΝΘΕΤΟΥ ΣΕ ΑΠΛΟ & ΕΛΕΓΧΟΣ ΠΡΟΣΗΜΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers των 4 όρων (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Πάνω Κλάσμα (Αριθμητής) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    {toCleanUppercase(t.topFracHeader)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-700 block mb-0.5">
                      {toCleanUppercase(t.akrosA)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = cNum1 - 1;
                          if (next === 0) next = -1;
                          handleStep(setCNum1, next - cNum1, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                        {cNum1 > 0 ? `＋${cNum1}` : cNum1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = cNum1 + 1;
                          if (next === 0) next = 1;
                          handleStep(setCNum1, next - cNum1, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-sky-700 block mb-0.5">
                      {toCleanUppercase(t.mesosB)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen1, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                        {cDen1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen1, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κάτω Κλάσμα (Παρονομαστής) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-800 uppercase">
                    {toCleanUppercase(t.bottomFracHeader)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-sky-700 block mb-0.5">
                      {toCleanUppercase(t.mesosC)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = cNum2 - 1;
                          if (next === 0) next = -1;
                          handleStep(setCNum2, next - cNum2, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                        {cNum2 > 0 ? `＋${cNum2}` : cNum2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = cNum2 + 1;
                          if (next === 0) next = 1;
                          handleStep(setCNum2, next - cNum2, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-amber-700 block mb-0.5">
                      {toCleanUppercase(t.akrosD)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen2, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                        {cDen2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen2, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Οπτικοποίησης & Μετατροπής (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.toSimpleFracTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    isCompoundNegative
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {toCleanUppercase(isCompoundNegative ? t.badgeCompoundNeg : t.badgeCompoundPos)}
                  </span>
                </div>

                {/* Μεγάλη Εμφάνιση Σύνθετου & Απλού */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-black py-2 flex-wrap">
                  <CompoundFrac num1={cNum1} den1={cDen1} num2={cNum2} den2={cDen2} />
                  <span className="text-slate-400">＝</span>
                  <div className="inline-flex items-center">
                    <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                      <span className="pb-0.5 px-1 border-b border-white text-amber-300 text-sm sm:text-lg">
                        ({cNum1 > 0 ? `＋${cNum1}` : cNum1}) · {cDen2}
                      </span>
                      <span className="pt-0.5 px-1 text-sky-300 text-sm sm:text-lg">
                        {cDen1} · ({cNum2 > 0 ? `＋${cNum2}` : cNum2})
                      </span>
                    </span>
                  </div>
                  <span className="text-slate-400">＝</span>
                  <Frac num={akroiProd} den={mesoiProd} className="text-white text-lg sm:text-2xl" />
                  <span className="text-slate-400">＝</span>
                  <div className="inline-flex items-center text-emerald-400">
                    {redCompoundDen === 1 ? (
                      <span>{isCompoundNegative ? `－${redCompoundNum}` : `＋${redCompoundNum}`}</span>
                    ) : (
                      <Frac
                        num={redCompoundNum}
                        den={redCompoundDen}
                        isNeg={isCompoundNegative}
                        className="text-emerald-400 text-xl sm:text-3xl"
                      />
                    )}
                  </div>
                </div>

                {/* Ανάλυση Όρων */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="flex justify-between items-center text-amber-300 flex-wrap gap-1">
                    <span>{t.prodAkroiLabel} [({cNum1}) · {cDen2}]:</span>
                    <strong>{akroiProd > 0 ? `＋${akroiProd}` : akroiProd}</strong>
                  </div>
                  <div className="flex justify-between items-center text-sky-300 flex-wrap gap-1">
                    <span>{t.prodMesoiLabel} [{cDen1} · ({cNum2})]:</span>
                    <strong>{mesoiProd > 0 ? `＋${mesoiProd}` : mesoiProd}</strong>
                  </div>
                  {compoundGcd > 1 && (
                    <div className="pt-1 border-t border-white/10 text-xs text-emerald-300 break-words">
                      {t.gcdSimplifyText}({absAkroi}, {absMesoi}) ＝ {compoundGcd}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}