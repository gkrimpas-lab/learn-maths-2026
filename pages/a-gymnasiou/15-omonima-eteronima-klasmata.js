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
    pageTitle: "Ομώνυμα και Ετερώνυμα Κλάσματα | Α' Γυμνασίου",
    pageDesc: "Έννοιες ομώνυμων και ετερώνυμων κλασμάτων, μετατροπή με ΕΚΠ, απόλυτη τιμή, σύγκριση και διάταξη ρητών κλασμάτων.",
    backText: "Α' Γυμνασίου",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 13 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Ομώνυμα & Ετερώνυμα Κλάσματα: Μετατροπές, Σύγκριση & Διάταξη",
    mainDesc: "Μαθαίνουμε να ξεχωρίζουμε τα ομώνυμα από τα ετερώνυμα κλάσματα, πώς να βρίσκουμε το ΕΚΠ των παρονομαστών για να τα κάνουμε ομώνυμα, καθώς και τους κανόνες σύγκρισης και διάταξης θετικών και αρνητικών ρητών.",

    // Ενότητα 1
    sec1Title: "Ορισμός Ομώνυμων & Ετερώνυμων Κλασμάτων",
    sec1LikeBadge: "ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ",
    sec1LikeTitle: "Ομώνυμα Κλάσματα",
    sec1LikeDesc: "Ονομάζονται δύο ή περισσότερα κλάσματα που έχουν τον ίδιο παρονομαστή. Χωρίζουν δηλαδή τη μονάδα στον ίδιο ακριβώς αριθμό ίσων μερών.",
    sec1UnlikeBadge: "ΔΙΑΦΟΡΕΤΙΚΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ",
    sec1UnlikeTitle: "Ετερώνυμα Κλάσματα",
    sec1UnlikeDesc: "Ονομάζονται τα κλάσματα που έχουν διαφορετικούς παρονομαστές. Επειδή εκφράζουν μέρη διαφορετικού μεγέθους, για να τα συγκρίνουμε ή να τα προσθέσουμε πρέπει πρώτα να τα κάνουμε ομώνυμα.",

    // Ενότητα 2
    sec2Title: "Πώς Μετατρέπουμε Ετερώνυμα Κλάσματα σε Ομώνυμα;",
    step1Badge: "ΒΗΜΑ 1",
    step1Title: "Εύρεση ΕΚΠ Παρονομαστών",
    step1Desc: "Βρίσκουμε το Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) των παρονομαστών. Αυτό θα αποτελέσει τον κοινό παρονομαστή των νέων ομώνυμων κλασμάτων.",
    step2Badge: "ΒΗΜΑ 2",
    step2Title: "«Καπελάκια» / Συντελεστές",
    step2Desc: "Διαιρούμε το ΕΚΠ με τον παρονομαστή κάθε κλάσματος: κ ＝ ΕΚΠ : β. Ο αριθμός κ είναι ο συντελεστής διαστολής για το κάθε κλάσμα.",
    step3Badge: "ΒΗΜΑ 3",
    step3Title: "Διαστολή Όρων",
    step3Desc: "Πολλαπλασιάζουμε αριθμητή και παρονομαστή κάθε κλάσματος με τον αντίστοιχο συντελεστή του κ. Έτσι προκύπτουν ισοδύναμα ομώνυμα κλάσματα.",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστικός Μετατροπέας Ετερώνυμων σε Ομώνυμα",
    frac1Label: "1Ο ΚΛΑΣΜΑ",
    frac2Label: "2Ο ΚΛΑΣΜΑ",
    numLabelA: "ΑΡΙΘΜΗΤΗΣ (α)",
    denLabelB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
    numLabelC: "ΑΡΙΘΜΗΤΗΣ (γ)",
    denLabelD: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
    lab1ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ ΣΕ ΟΜΩΝΥΜΑ",
    termLcm: "ΕΚΠ",
    expansionFactor: "συντελεστής διαστολής",
    lab1SummaryPrefix: "Τα ετερώνυμα κλάσματα έγιναν ομώνυμα με κοινό παρονομαστή το",

    // Ενότητα 3
    sec3Title: "Απόλυτη Τιμή, Σύγκριση & Διάταξη Ρητών Κλασμάτων",
    rule1Badge: "ΚΑΝΟΝΑΣ 1",
    rule1Title: "Απόλυτη Τιμή Κλάσματος",
    rule1Desc: "Η απόλυτη τιμή ενός ρητού κλάσματος είναι πάντοτε θετικός αριθμός ή μηδέν (απορρίπτουμε το αρνητικό πρόσημο):",
    rule2Badge: "ΚΑΝΟΝΑΣ 2",
    rule2Title: "Σύγκριση Ομώνυμων",
    rule2Desc: "Σε δύο ομώνυμα κλάσματα με θετικό παρονομαστή, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο αριθμητή (αν το κλάσμα είναι αρνητικό, θεωρούμε το πρόσημο μείον στον αριθμητή).",
    rule3Badge: "ΚΑΝΟΝΑΣ 3",
    rule3Title: "Σύγκριση Ετερώνυμων",
    rule3Desc: "Τα μετατρέπουμε πρώτα σε ομώνυμα μέσω του ΕΚΠ ή ελέγχουμε τα χιαστί γινόμενα των όρων τους.",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Συγκριτής & Διάταξη Ρητών",
    lab2ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΣΥΓΚΡΙΣΗΣ",
    badgeFirstGreater: "ΤΟ 1Ο ΕΙΝΑΙ ΜΕΓΑΛΥΤΕΡΟ",
    badgeSecondGreater: "ΤΟ 2Ο ΕΙΝΑΙ ΜΕΓΑΛΥΤΕΡΟ",
    badgeEqual: "ΕΙΝΑΙ ΙΣΑ",
    viaLikeFractions: "Μέσω Ομώνυμων",
    viaCrossProducts: "Μέσω Χιαστί Γινομένων:",
    absoluteValues: "Απόλυτες Τιμές:",
    andWord: "και",
  },
  en: {
    pageTitle: "Like and Unlike Fractions | Grade 7",
    pageDesc: "Concepts of like and unlike fractions, LCM conversion, absolute value, comparison, and ordering of rational fractions.",
    backText: "Grade 7",
    btnExercises: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 13 • THEORY & LAB",
    mainTitle: "Like & Unlike Fractions: Conversions, Comparison & Ordering",
    mainDesc: "Learn to distinguish like from unlike fractions, find the LCM of denominators to make them like fractions, and apply comparison and ordering rules for positive and negative rationals.",

    // Section 1
    sec1Title: "Definition of Like & Unlike Fractions",
    sec1LikeBadge: "SAME DENOMINATOR",
    sec1LikeTitle: "Like Fractions",
    sec1LikeDesc: "Fractions having identical denominators are called like fractions. They divide the whole into the exact same number of equal parts.",
    sec1UnlikeBadge: "DIFFERENT DENOMINATORS",
    sec1UnlikeTitle: "Unlike Fractions",
    sec1UnlikeDesc: "Fractions with different denominators are called unlike fractions. Because their parts differ in size, they must be converted to like fractions before comparing or adding them.",

    // Section 2
    sec2Title: "How to Convert Unlike Fractions to Like Fractions",
    step1Badge: "STEP 1",
    step1Title: "Find the Denominators' LCM",
    step1Desc: "Find the Least Common Multiple (LCM) of the denominators. This becomes the common denominator for the converted fractions.",
    step2Badge: "STEP 2",
    step2Title: "Find Expansion Factors",
    step2Desc: "Divide the LCM by each denominator: k ＝ LCM : b. The number k is the scale factor for each fraction.",
    step3Badge: "STEP 3",
    step3Title: "Expand Terms",
    step3Desc: "Multiply the numerator and denominator of each fraction by its corresponding scale factor k to produce equivalent like fractions.",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Converter from Unlike to Like Fractions",
    frac1Label: "1ST FRACTION",
    frac2Label: "2ND FRACTION",
    numLabelA: "NUMERATOR (a)",
    denLabelB: "DENOMINATOR (b)",
    numLabelC: "NUMERATOR (c)",
    denLabelD: "DENOMINATOR (d)",
    lab1ResultTitle: "CONVERSION RESULT TO LIKE FRACTIONS",
    termLcm: "LCM",
    expansionFactor: "expansion factor",
    lab1SummaryPrefix: "The unlike fractions were converted to like fractions with common denominator",

    // Section 3
    sec3Title: "Absolute Value, Comparison & Ordering of Rational Fractions",
    rule1Badge: "RULE 1",
    rule1Title: "Absolute Value of a Fraction",
    rule1Desc: "The absolute value of a rational fraction is always a non-negative number (we discard the negative sign):",
    rule2Badge: "RULE 2",
    rule2Title: "Comparing Like Fractions",
    rule2Desc: "Between two like fractions with positive denominators, the fraction with the larger numerator is strictly greater (If the fraction is negative, the minus sign is considered to be in the numerator).",
    rule3Badge: "RULE 3",
    rule3Title: "Comparing Unlike Fractions",
    rule3Desc: "Convert them to like fractions using their LCM or compare their cross-products directly.",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Interactive Comparator & Rational Ordering",
    lab2ResultTitle: "COMPARISON RESULT",
    badgeFirstGreater: "1ST IS GREATER",
    badgeSecondGreater: "2ND IS GREATER",
    badgeEqual: "THEY ARE EQUAL",
    viaLikeFractions: "Using Like Fractions",
    viaCrossProducts: "Using Cross-Products:",
    absoluteValues: "Absolute Values:",
    andWord: "and",
  }
};

export default function OmonimaEteronimaTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για Εργαστήριο 1: Μετατροπή Ετερώνυμων σε Ομώνυμα
  const [lab1Num1, setLab1Num1] = useState(2);
  const [lab1Den1, setLab1Den1] = useState(3);
  const [lab1Num2, setLab1Num2] = useState(3);
  const [lab1Den2, setLab1Den2] = useState(4);

  // State για Εργαστήριο 2: Σύγκριση & Διάταξη
  const [cmpNum1, setCmpNum1] = useState(-3);
  const [cmpDen1, setCmpDen1] = useState(5);
  const [cmpNum2, setCmpNum2] = useState(-2);
  const [cmpDen2, setCmpDen2] = useState(3);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ετερώνυμα -> Ομώνυμα)
  const commonLcm = useMemo(() => lcm(lab1Den1, lab1Den2), [lab1Den1, lab1Den2]);
  const mult1 = useMemo(() => commonLcm / lab1Den1, [commonLcm, lab1Den1]);
  const mult2 = useMemo(() => commonLcm / lab1Den2, [commonLcm, lab1Den2]);
  const newNum1 = useMemo(() => lab1Num1 * mult1, [lab1Num1, mult1]);
  const newNum2 = useMemo(() => lab1Num2 * mult2, [lab1Num2, mult2]);

  // Υπολογισμοί Εργαστηρίου 2 (Σύγκριση & Διάταξη)
  const cmpVal1 = useMemo(() => cmpNum1 / cmpDen1, [cmpNum1, cmpDen1]);
  const cmpVal2 = useMemo(() => cmpNum2 / cmpDen2, [cmpNum2, cmpDen2]);

  const cmpLcm = useMemo(() => lcm(cmpDen1, cmpDen2), [cmpDen1, cmpDen2]);
  const cmpMult1 = useMemo(() => cmpLcm / cmpDen1, [cmpLcm, cmpDen1]);
  const cmpMult2 = useMemo(() => cmpLcm / cmpDen2, [cmpLcm, cmpDen2]);
  const cmpHomNum1 = useMemo(() => cmpNum1 * cmpMult1, [cmpNum1, cmpMult1]);
  const cmpHomNum2 = useMemo(() => cmpNum2 * cmpMult2, [cmpNum2, cmpMult2]);

  const cross1 = useMemo(() => cmpNum1 * cmpDen2, [cmpNum1, cmpDen2]);
  const cross2 = useMemo(() => cmpDen1 * cmpNum2, [cmpDen1, cmpNum2]);

  const comparisonSymbol = useMemo(() => {
    if (cmpVal1 > cmpVal2) return '＞';
    if (cmpVal1 < cmpVal2) return '＜';
    return '＝';
  }, [cmpVal1, cmpVal2]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/15-omonima-eteronima-klasmata-ask"
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

        {/* 1. ΟΜΩΝΥΜΑ ΚΑΙ ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα */}
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                    {toCleanUppercase(t.sec1LikeBadge)}
                  </span>
                  <span className="text-xl">⚖️</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg break-words">{t.sec1LikeTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {t.sec1LikeDesc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center text-indigo-950 font-bold flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <Frac num="3" den="7" />
                <span>,</span>
                <Frac num="5" den="7" />
                <span>,</span>
                <Frac num="-2" den="7" />
              </div>
            </div>

            {/* Ετερώνυμα */}
            <div className="p-5 sm:p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                    {toCleanUppercase(t.sec1UnlikeBadge)}
                  </span>
                  <span className="text-xl">🔀</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg break-words">{t.sec1UnlikeTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {t.sec1UnlikeDesc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-sky-950 font-bold flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <Frac num="2" den="3" />
                <span>,</span>
                <Frac num="3" den="5" />
                <span>,</span>
                <Frac num="-1" den="4" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΜΕΤΑΤΡΟΠΗ ΕΤΕΡΩΝΥΜΩΝ ΣΕ ΟΜΩΝΥΜΑ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">
                {toCleanUppercase(t.step1Badge)}
              </div>
              <h4 className="font-bold text-slate-900 text-base break-words">{t.step1Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">
                {toCleanUppercase(t.step2Badge)}
              </div>
              <h4 className="font-bold text-slate-900 text-base break-words">{t.step2Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">
                {toCleanUppercase(t.step3Badge)}
              </div>
              <h4 className="font-bold text-slate-900 text-base break-words">{t.step3Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {t.step3Desc}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Ελέγχου */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* Κλάσμα 1 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.frac1Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numLabelA)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num1, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {lab1Num1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num1, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denLabelB)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den1, -1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {lab1Den1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den1, 1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κλάσμα 2 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    {toCleanUppercase(t.frac2Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numLabelC)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num2, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {lab1Num2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num2, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denLabelD)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den2, -1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {lab1Den2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den2, 1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα & Αποτέλεσμα */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1ResultTitle)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {t.termLcm}({lab1Den1}, {lab1Den2}) ＝ {commonLcm}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* 1ο Κλάσμα */}
                  <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl flex-wrap">
                      <Frac num={lab1Num1} den={lab1Den1} className="text-white" />
                      <span className="text-indigo-300 text-xs sm:text-sm font-sans">
                        ({t.expansionFactor} · {mult1})
                      </span>
                      <span className="text-indigo-300">＝</span>
                      <Frac num={newNum1} den={commonLcm} className="text-emerald-400 text-base sm:text-2xl" />
                    </div>
                    <span className="text-xs text-slate-300 font-sans font-normal">
                      {commonLcm} : {lab1Den1} ＝ {mult1}
                    </span>
                  </div>

                  {/* 2ο Κλάσμα */}
                  <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl flex-wrap">
                      <Frac num={lab1Num2} den={lab1Den2} className="text-white" />
                      <span className="text-indigo-300 text-xs sm:text-sm font-sans">
                        ({t.expansionFactor} · {mult2})
                      </span>
                      <span className="text-indigo-300">＝</span>
                      <Frac num={newNum2} den={commonLcm} className="text-sky-300 text-base sm:text-2xl" />
                    </div>
                    <span className="text-xs text-slate-300 font-sans font-normal">
                      {commonLcm} : {lab1Den2} ＝ {mult2}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-400/20 text-xs font-sans text-emerald-200 leading-relaxed break-words">
                  {t.lab1SummaryPrefix} <strong>{commonLcm}</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΑΠΟΛΥΤΗ ΤΙΜΗ & ΣΥΓΚΡΙΣΗ ΚΛΑΣΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Απόλυτη Τιμή */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider block">
                  {toCleanUppercase(t.rule1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.rule1Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {t.rule1Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center text-xs sm:text-sm font-bold text-indigo-950 flex items-center justify-center gap-1.5 flex-wrap">
                <span>|</span>
                <Frac num="-3" den="4" />
                <span>| ＝ </span>
                <Frac num="3" den="4" />
              </div>
            </div>

            {/* Σύγκριση Ομώνυμων */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider block">
                  {toCleanUppercase(t.rule2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.rule2Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {t.rule2Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-xs sm:text-sm font-bold text-sky-950 flex items-center justify-center gap-1.5 flex-wrap">
                <Frac num="5" den="7" /> <span>＞</span> <Frac num="3" den="7" />
                <span className="mx-1 text-slate-400">|</span>
                －<Frac num="2" den="7" /> <span>＞</span> －<Frac num="5" den="7" />
              </div>
            </div>

            {/* Σύγκριση Ετερώνυμων */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-purple-700 tracking-wider block">
                  {toCleanUppercase(t.rule3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.rule3Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {t.rule3Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-purple-100 font-mono text-center text-xs sm:text-sm font-bold text-purple-950 flex items-center justify-center gap-1 flex-wrap">
                <span>α · δ ＞ β · γ ⟺ </span>
                <Frac num="α" den="β" />
                <span>＞</span>
                <Frac num="γ" den="δ" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Εισαγωγής */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.frac1Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numLabelA)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum1, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {cmpNum1 > 0 ? `＋${cmpNum1}` : cmpNum1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum1, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denLabelB)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen1, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {cmpDen1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen1, 1, 1, 20, e)}
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
                      {toCleanUppercase(t.numLabelC)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum2, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {cmpNum2 > 0 ? `＋${cmpNum2}` : cmpNum2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum2, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denLabelD)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen2, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {cmpDen2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen2, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Σύγκρισης & Χιαστί */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab2ResultTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    comparisonSymbol === '＞'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : comparisonSymbol === '＜'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {toCleanUppercase(
                      comparisonSymbol === '＞'
                        ? t.badgeFirstGreater
                        : comparisonSymbol === '＜'
                        ? t.badgeSecondGreater
                        : t.badgeEqual
                    )}
                  </span>
                </div>

                {/* Μεγάλη Εμφάνιση Σύγκρισης */}
                <div className="flex items-center justify-center gap-2 sm:gap-5 text-xl sm:text-3xl lg:text-4xl font-black py-2 flex-wrap max-w-full">
                  <Frac num={cmpNum1} den={cmpDen1} className="text-white" />
                  <span className="text-amber-400 font-sans text-2xl sm:text-4xl">
                    {comparisonSymbol}
                  </span>
                  <Frac num={cmpNum2} den={cmpDen2} className="text-white" />
                </div>

                {/* Ανάλυση με Ομώνυμα & Χιαστί */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans">
                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono">
                    <span className="text-slate-300">
                      {t.viaLikeFractions} ({t.termLcm} ＝ {cmpLcm}):
                    </span>
                    <span className="flex items-center flex-wrap">
                      <Frac num={cmpHomNum1} den={cmpLcm} className="text-emerald-300" />
                      <span className="mx-1 text-amber-300">{comparisonSymbol}</span>
                      <Frac num={cmpHomNum2} den={cmpLcm} className="text-sky-300" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono pt-1.5 border-t border-white/10">
                    <span className="text-slate-300">{t.viaCrossProducts}</span>
                    <span className="flex items-center flex-wrap">
                      {cmpNum1} · {cmpDen2} ＝ <strong>{cross1}</strong>
                      <span className="mx-1.5 text-amber-300">{comparisonSymbol}</span>
                      {cmpNum2} · {cmpDen1} ＝ <strong>{cross2}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono pt-1.5 border-t border-white/10 text-xs">
                    <span className="text-slate-300">{t.absoluteValues}</span>
                    <span className="flex items-center flex-wrap gap-1">
                      <span>|</span>
                      <Frac num={cmpNum1} den={cmpDen1} />
                      <span>| ＝ </span>
                      <Frac num={Math.abs(cmpNum1)} den={cmpDen1} />
                      <span className="mx-1 text-slate-400">{t.andWord}</span>
                      <span>|</span>
                      <Frac num={cmpNum2} den={cmpDen2} />
                      <span>| ＝ </span>
                      <Frac num={Math.abs(cmpNum2)} den={cmpDen2} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}