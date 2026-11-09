import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση καθαρισμού τόνων για κεφαλαία (διατηρεί μόνο το Α')
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

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center text-center">
        <span className="border-b border-current px-1 pb-0.5 break-all w-full text-center">
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 break-all w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Μεταβλητή, Αλγεβρικές Παραστάσεις & Όμοιοι Όροι | Α' Γυμνασίου",
    pageDesc: "Έννοια της μεταβλητής, όροι αλγεβρικής παράστασης, συντελεστής, σταθερός όρος, όμοιοι όροι, αναγωγή και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 24 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Μεταβλητές, Αλγεβρικές Παραστάσεις & Όμοιοι Όροι",
    mainSubtitle: "Εισαγωγή στην Άλγεβρα: Μαθαίνουμε τη σημασία των μεταβλητών, αναγνωρίζουμε τους όρους, τους συντελεστές και τους σταθερούς όρους, και απλοποιούμε παραστάσεις κάνοντας αναγωγή ομοίων όρων.",

    // Ενότητα 1
    sec1Title: "Μεταβλητή & Αλγεβρική Παράσταση",
    whatIsVarTitle: "Τι είναι Μεταβλητή;",
    whatIsVarDesc: "Μεταβλητή είναι ένα γράμμα (συνήθως x, y, ν, α) που παριστάνει έναν άγνωστο αριθμό ή μια ποσότητα που μπορεί να πάρει διαφορετικές τιμές.",
    whatIsExprTitle: "Τι είναι Αλγεβρική Παράσταση;",
    whatIsExprDesc: "Μια μαθηματική έκφραση που περιέχει αριθμούς, μεταβλητές και πράξεις μεταξύ τους ονομάζεται αλγεβρική παράσταση.",
    examplesLabel: "Παραδείγματα:",
    verbalTranslationBadge: "ΜΕΤΑΦΡΑΣΗ ΛΕΚΤΙΚΩΝ ΕΚΦΡΑΣΕΩΝ",
    verbPhrase1: "«Το τριπλάσιο ενός αριθμού x»",
    verbPhrase2: "«Ένας αριθμός x αυξημένος κατά 8»",
    verbPhrase3: "«Το διπλάσιο του x ελαττωμένο κατά 5»",

    // Ενότητα 2
    sec2Title: "Όροι, Συντελεστές & Σταθερός Όρος",
    comp1Badge: "ΣΥΣΤΑΤΙΚΟ 1",
    comp1Title: "Όροι Παράστασης",
    comp1Desc: "Όροι είναι τα επιμέρους τμήματα μιας παράστασης που συνδέονται μεταξύ τους με τα σύμβολα ＋ ή －.",
    comp1Example: "Στην 5x － 3y ＋ 7 οι όροι είναι: 5x, －3y και ＋7.",
    comp2Badge: "ΣΥΣΤΑΤΙΚΟ 2",
    comp2Title: "Συντελεστής",
    comp2Desc: "Είναι ο αριθμός που πολλαπλασιάζει τη μεταβλητή. Μαζί με το πρόσημό του αποτελεί τον αριθμητικό παράγοντα.",
    comp2Ex1: "Στο 4x συντελεστής είναι το 4.",
    comp2Ex2: "Στο －x συντελεστής είναι το －1.",
    comp2Ex3: "Στο x συντελεστής είναι το 1.",
    comp3Badge: "ΣΥΣΤΑΤΙΚΟ 3",
    comp3Title: "Σταθερός Όρος",
    comp3Desc: "Είναι ο όρος που αποτελείται μόνο από αριθμό και δεν περιέχει καμία μεταβλητή.",
    comp3Ex1: "Στο 3x ＋ 9 σταθερός όρος είναι το ＋9.",
    comp3Ex2: "Στο 6x － 4 σταθερός όρος είναι το －4.",
    comp3Ex3: "Στο 8x σταθερός όρος είναι το 0.",

    // Ενότητα 3
    sec3Title: "Όμοιοι Όροι & Αναγωγή Ομοίων Όρων",
    likeTermsTitle: "Τι είναι οι Όμοιοι Όροι;",
    likeTermsDesc: "Όμοιοι ονομάζονται οι όροι που έχουν το ίδιο ακριβώς κύριο μέρος (την ίδια μεταβλητή υψωμένη στην ίδια δύναμη). Μπορεί να διαφέρουν μόνο στον συντελεστή τους.",
    likeEx1: "Οι όροι 5x, －2x και x είναι όμοιοι.",
    likeEx2: "Οι όροι 3x και 3y δεν είναι όμοιοι (διαφορετική μεταβλητή).",
    likeEx3: "Οι όροι 4x και 4x² δεν είναι όμοιοι (διαφορετικός εκθέτης).",
    reductionTitle: "Πώς κάνουμε Αναγωγή Ομοίων Όρων;",
    reductionDesc: "Αναγωγή ομοίων όρων λέγεται η διαδικασία πρόσθεσης ή αφαίρεσης των συντελεστών τους, διατηρώντας το κοινό κύριο μέρος (βάσει της επιμεριστικής ιδιότητας):",
    reductionEx: "Παράδειγμα: 7x － 3x ＋ 2x ＝ (7 － 3 ＋ 2) · x ＝ 6x",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστική Αναγωγή Ομοίων Όρων & Υπολογισμός Τιμής",
    term1Label: "1ΟΣ ΟΡΟΣ x",
    term2Label: "2ΟΣ ΟΡΟΣ x",
    const1Label: "1ΟΣ ΣΤΑΘΕΡΟΣ",
    const2Label: "2ΟΣ ΣΤΑΘΕΡΟΣ",
    varXLabel: "ΤΙΜΗ ΜΕΤΑΒΛΗΤΗΣ (x)",
    simplificationSteps: "ΒΗΜΑΤΑ ΑΠΛΟΠΟΙΗΣΗΣ",
    reductionBadge: "ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ",
    initialExprLabel: "Αρχική Παράσταση:",
    groupStepLabel: "1. Ομαδοποίηση ομοίων όρων και σταθερών:",
    finalReducedLabel: "2. Τελική ανηγμένη μορφή:",
    evalForXLabel: "ΤΙΜΗ ΓΙΑ x ＝",

    // Ενότητα 4
    sec4Title: "Γεωμετρικά Προβλήματα με Αλγεβρικές Παραστάσεις",
    sec4Intro: "Στη γεωμετρία, οι διαστάσεις των σχημάτων εκφράζονται συχνά με τη βοήθεια μιας μεταβλητής x. Για να βρούμε την περίμετρο, προσθέτουμε όλα τα μήκη των πλευρών και κάνουμε αναγωγή ομοίων όρων.",
    lab2Title: "🛠️ Εργαστήριο 2: Περίμετρος Ορθογωνίου (Αναγωγή Πλευρών)",
    varXCmLabel: "ΜΕΤΑΒΛΗΤΗ x (cm)",
    rectLengthLabel: "Μήκος",
    rectWidthLabel: "Πλάτος",
    perimeterDevelopment: "ΑΝΑΠΤΥΞΗ ΠΕΡΙΜΕΤΡΟΥ",
    perimeterFormulaBadge: "Π ＝ 2 · (Μήκος) ＋ 2 · (Πλάτος)",
    sumAllSidesLabel: "Άθροισμα Όλων των Πλευρών:",
    perimeterForXLabel: "Για x ＝"
  },
  en: {
    pageTitle: "Variables, Algebraic Expressions & Like Terms | 7th Grade Math",
    pageDesc: "Concept of variable, terms of an algebraic expression, coefficients, constants, like terms, combining like terms, and interactive labs.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 24 • THEORY & LAB",
    mainTitle: "Variables, Algebraic Expressions & Like Terms",
    mainSubtitle: "Introduction to Algebra: Learn the role of variables, identify terms, coefficients, and constants, and simplify expressions by combining like terms.",

    // Section 1
    sec1Title: "Variables & Algebraic Expressions",
    whatIsVarTitle: "What is a Variable?",
    whatIsVarDesc: "A variable is a letter (typically x, y, n, a) representing an unknown number or a quantity that can take different numerical values.",
    whatIsExprTitle: "What is an Algebraic Expression?",
    whatIsExprDesc: "A mathematical statement containing numbers, variables, and arithmetic operations between them is called an algebraic expression.",
    examplesLabel: "Examples:",
    verbalTranslationBadge: "VERBAL EXPRESSION TRANSLATION",
    verbPhrase1: "\"Three times a number x\"",
    verbPhrase2: "\"A number x increased by 8\"",
    verbPhrase3: "\"Twice a number x decreased by 5\"",

    // Section 2
    sec2Title: "Terms, Coefficients & Constant Terms",
    comp1Badge: "COMPONENT 1",
    comp1Title: "Terms of Expression",
    comp1Desc: "Terms are the separate parts of an expression joined together by ＋ or － signs.",
    comp1Example: "In 5x － 3y ＋ 7 the terms are: 5x, －3y, and ＋7.",
    comp2Badge: "COMPONENT 2",
    comp2Title: "Coefficient",
    comp2Desc: "The numerical factor that multiplies the variable, including its positive or negative sign.",
    comp2Ex1: "In 4x the coefficient is 4.",
    comp2Ex2: "In －x the coefficient is －1.",
    comp2Ex3: "In x the coefficient is 1.",
    comp3Badge: "COMPONENT 3",
    comp3Title: "Constant Term",
    comp3Desc: "A term consisting solely of a fixed number without any variable attached.",
    comp3Ex1: "In 3x ＋ 9 the constant term is ＋9.",
    comp3Ex2: "In 6x － 4 the constant term is －4.",
    comp3Ex3: "In 8x the constant term is 0.",

    // Section 3
    sec3Title: "Like Terms & Combining Like Terms",
    likeTermsTitle: "What are Like Terms?",
    likeTermsDesc: "Like terms are terms that share the exact same variable part raised to the exact same power. They can differ only in their numerical coefficients.",
    likeEx1: "Terms 5x, －2x, and x are like terms.",
    likeEx2: "Terms 3x and 3y are not like terms (different variables).",
    likeEx3: "Terms 4x and 4x² are not like terms (different exponents).",
    reductionTitle: "How to Combine Like Terms?",
    reductionDesc: "Combining like terms is the process of adding or subtracting their coefficients while keeping the shared variable factor (by the distributive property):",
    reductionEx: "Example: 7x － 3x ＋ 2x ＝ (7 － 3 ＋ 2) · x ＝ 6x",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Combining Like Terms & Evaluation",
    term1Label: "1ST x TERM",
    term2Label: "2ND x TERM",
    const1Label: "1ST CONSTANT",
    const2Label: "2ND CONSTANT",
    varXLabel: "VARIABLE VALUE (x)",
    simplificationSteps: "SIMPLIFICATION STEPS",
    reductionBadge: "COMBINING TERMS",
    initialExprLabel: "Initial Expression:",
    groupStepLabel: "1. Grouping like terms and constants:",
    finalReducedLabel: "2. Final simplified form:",
    evalForXLabel: "VALUE FOR x ＝",

    // Section 4
    sec4Title: "Geometric Problems with Algebraic Expressions",
    sec4Intro: "In geometry, dimensions of figures are often expressed in terms of a variable x. To determine the perimeter, we add all side lengths and combine like terms.",
    lab2Title: "🛠️ Lab 2: Perimeter of a Rectangle (Combining Sides)",
    varXCmLabel: "VARIABLE x (cm)",
    rectLengthLabel: "Length",
    rectWidthLabel: "Width",
    perimeterDevelopment: "PERIMETER EXPANSION",
    perimeterFormulaBadge: "P ＝ 2 · (Length) ＋ 2 · (Width)",
    sumAllSidesLabel: "Sum of All Sides:",
    perimeterForXLabel: "For x ＝"
  }
};

export default function MetablitiTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const numLocale = locale === 'el' ? 'el-GR' : 'en-US';

  // State για Εργαστήριο 1: Αναγωγή Ομοίων Όρων: a·x + b·x + c + d
  const [termA, setTermA] = useState(4);   // Συντελεστής 1ου όρου με x
  const [termB, setTermB] = useState(-2);  // Συντελεστής 2ου όρου με x
  const [constC, setConstC] = useState(5); // 1ος σταθερός όρος
  const [constD, setConstD] = useState(-1);// 2ος σταθερός όρος
  const [evalX, setEvalX] = useState(3);   // Τιμή του x για υπολογισμό

  // State για Εργαστήριο 2: Περίμετρος Ορθογωνίου (Μήκος: 2x+3, Πλάτος: x+1)
  const [geoX, setGeoX] = useState(4);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1 (Αναγωγή Ομοίων Όρων)
  const totalXCoeff = useMemo(() => termA + termB, [termA, termB]);
  const totalConst = useMemo(() => constC + constD, [constC, constD]);
  const finalValue = useMemo(() => totalXCoeff * evalX + totalConst, [totalXCoeff, evalX, totalConst]);

  // Υπολογισμοί Εργαστηρίου 2 (Περίμετρος)
  const rectLength = useMemo(() => 2 * geoX + 3, [geoX]);
  const rectWidth = useMemo(() => geoX + 1, [geoX]);
  const rectPerimeter = useMemo(() => 2 * rectLength + 2 * rectWidth, [rectLength, rectWidth]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/27-metabliti-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΜΕΤΑΒΛΗΤΗ & ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-950 text-base break-words">
                  {t.whatIsVarTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.whatIsVarDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.whatIsExprTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.whatIsExprDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-900 pt-1 break-words [overflow-wrap:anywhere]">
                  <span>{t.examplesLabel} 3x ＋ 5, &nbsp; 4α － 2β, &nbsp; x<sup>2</sup> ＋ 3x － 7</span>
                </div>
              </div>
            </div>

            {/* Πρακτική Μετάφραση */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider break-words">
                {toCleanUppercase(t.verbalTranslationBadge)}
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-sans text-slate-700 break-words">{t.verbPhrase1}</span>
                  <span className="font-bold text-indigo-700 shrink-0">3 · x</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-sans text-slate-700 break-words">{t.verbPhrase2}</span>
                  <span className="font-bold text-indigo-700 shrink-0">x ＋ 8</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-sans text-slate-700 break-words">{t.verbPhrase3}</span>
                  <span className="font-bold text-indigo-700 shrink-0">2 · x － 5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΝΑΤΟΜΙΑ: ΟΡΟΙ, ΣΥΝΤΕΛΕΣΤΕΣ & ΣΤΑΘΕΡΟΙ ΟΡΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Όροι */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.comp1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.comp1Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.comp1Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-center text-xs text-indigo-950 break-words">
                {t.comp1Example}
              </div>
            </div>

            {/* Συντελεστής */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.comp2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.comp2Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.comp2Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 font-mono text-xs text-sky-950 space-y-0.5 break-words">
                <div>{t.comp2Ex1}</div>
                <div>{t.comp2Ex2}</div>
                <div>{t.comp2Ex3}</div>
              </div>
            </div>

            {/* Σταθερός Όρος */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.comp3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.comp3Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.comp3Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-xs text-amber-950 space-y-0.5 break-words">
                <div>{t.comp3Ex1}</div>
                <div>{t.comp3Ex2}</div>
                <div>{t.comp3Ex3}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΟΜΟΙΟΙ ΟΡΟΙ & ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">
                {t.likeTermsTitle}
              </h3>
              <p className="break-words [overflow-wrap:anywhere]">
                {t.likeTermsDesc}
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-xs sm:text-sm break-words">
                <div>{t.likeEx1}</div>
                <div>{t.likeEx2}</div>
                <div>{t.likeEx3}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">
                {t.reductionTitle}
              </h3>
              <p className="break-words [overflow-wrap:anywhere]">
                {t.reductionDesc}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-center font-mono text-sm sm:text-base">
                α · x ＋ β · x ＝ (α ＋ β) · x
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-slate-800 break-words">
                {t.reductionEx}
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers των όρων (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-800 uppercase block break-words">
                    {toCleanUppercase(t.term1Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermA, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Decrease term A"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950 px-1 truncate">
                      {termA > 0 ? `＋${termA}x` : `${termA}x`}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermA, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Increase term A"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-800 uppercase block break-words">
                    {toCleanUppercase(t.term2Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermB, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Decrease term B"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950 px-1 truncate">
                      {termB > 0 ? `＋${termB}x` : `${termB}x`}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermB, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Increase term B"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block break-words">
                    {toCleanUppercase(t.const1Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstC, -1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Decrease constant C"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950 px-1 truncate">
                      {constC > 0 ? `＋${constC}` : constC}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstC, 1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Increase constant C"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block break-words">
                    {toCleanUppercase(t.const2Label)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstD, -1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Decrease constant D"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950 px-1 truncate">
                      {constD > 0 ? `＋${constD}` : constD}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstD, 1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Increase constant D"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Επιλογή τιμής x */}
                <div className="col-span-2 pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words">
                    {toCleanUppercase(t.varXLabel)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setEvalX, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Decrease x value"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-xs font-mono text-indigo-950 px-1 truncate">
                      x ＝ {evalX}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setEvalX, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                      aria-label="Increase x value"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans break-words">
                    {toCleanUppercase(t.simplificationSteps)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans shrink-0">
                    {toCleanUppercase(t.reductionBadge)}
                  </span>
                </div>

                {/* Αρχική Παράσταση */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-sm sm:text-base">
                  <div className="text-[10px] text-slate-400 font-sans uppercase break-words">
                    {t.initialExprLabel}
                  </div>
                  <div className="text-amber-300 font-bold pt-0.5 inline-flex flex-wrap items-center gap-1">
                    <span>({termA}x)</span>
                    <span>＋</span>
                    <span>({termB}x)</span>
                    <span>＋</span>
                    <span>({constC})</span>
                    <span>＋</span>
                    <span>({constD})</span>
                  </div>
                </div>

                {/* Ομαδοποίηση */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                  <div className="text-slate-300 font-bold break-words">
                    {t.groupStepLabel}
                  </div>
                  <div className="font-mono text-indigo-200 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1">
                    <span>＝</span>
                    <span>({termA} ＋ {termB < 0 ? `(${termB})` : termB})·x</span>
                    <span>＋</span>
                    <span>({constC} ＋ {constD < 0 ? `(${constD})` : constD})</span>
                  </div>
                </div>

                {/* Τελική Απλοποιημένη Μορφή */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                  <div className="text-slate-300 font-bold break-words">
                    {t.finalReducedLabel}
                  </div>
                  <div className="font-mono text-emerald-400 font-black text-lg sm:text-xl inline-flex flex-wrap items-center gap-1">
                    <span>＝ {totalXCoeff}x {totalConst >= 0 ? `＋ ${totalConst}` : `－ ${Math.abs(totalConst)}`}</span>
                  </div>
                </div>

                {/* Υπολογισμός για x */}
                <div className="p-3.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                  <span className="text-xs font-bold break-words">
                    {toCleanUppercase(t.evalForXLabel)} {evalX}:
                  </span>
                  <span className="text-base sm:text-xl lg:text-2xl font-black font-mono text-emerald-400 inline-flex flex-wrap items-center gap-1">
                    <span>＝ {totalXCoeff}·({evalX}) ＋ ({totalConst}) ＝</span>
                    <span className="underline decoration-2">{finalValue.toLocaleString(numLocale)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΓΕΩΜΕΤΡΙΚΑ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.sec4Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec4Intro}
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Stepper x (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-indigo-900 uppercase break-words">
                  {toCleanUppercase(t.varXCmLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setGeoX, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    aria-label="Decrease geo X"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950 px-2 truncate">
                    x ＝ {geoX} cm
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setGeoX, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    aria-label="Increase geo X"
                  >
                    ＋
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1.5 font-mono">
                  <div className="break-words">
                    {t.rectLengthLabel}: 2x ＋ 3 ＝ 2·{geoX} ＋ 3 ＝ <strong>{rectLength.toLocaleString(numLocale)} cm</strong>
                  </div>
                  <div className="break-words">
                    {t.rectWidthLabel}: x ＋ 1 ＝ {geoX} ＋ 1 ＝ <strong>{rectWidth.toLocaleString(numLocale)} cm</strong>
                  </div>
                </div>
              </div>

              {/* Οπτική Προβολή & Υπολογισμός (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans break-words">
                    {toCleanUppercase(t.perimeterDevelopment)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-sans shrink-0">
                    {t.perimeterFormulaBadge}
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Ορθογωνίου */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                  <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto" preserveAspectRatio="xMidYMid meet">
                    <rect x="30" y="30" width="260" height="100" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
                    {/* Ετικέτες Πλευρών */}
                    <text x="160" y="22" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                      2x ＋ 3 ({rectLength.toLocaleString(numLocale)} cm)
                    </text>
                    <text x="160" y="148" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                      2x ＋ 3 ({rectLength.toLocaleString(numLocale)} cm)
                    </text>
                    <text x="18" y="85" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="end">
                      x ＋ 1
                    </text>
                    <text x="302" y="85" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="start">
                      x ＋ 1
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                  <div className="break-words">
                    <strong>{t.sumAllSidesLabel}</strong>
                  </div>
                  <div className="font-mono text-indigo-200 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1">
                    <span>Π ＝ (2x ＋ 3) ＋ (2x ＋ 3) ＋ (x ＋ 1) ＋ (x ＋ 1)</span>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm sm:text-base inline-flex flex-wrap items-center gap-1">
                    <span>Π ＝ (2 ＋ 2 ＋ 1 ＋ 1)·x ＋ (3 ＋ 3 ＋ 1 ＋ 1) ＝ 6x ＋ 8</span>
                  </div>
                  <div className="pt-1 text-amber-300 font-mono text-sm sm:text-base font-bold inline-flex flex-wrap items-center gap-1">
                    <span>{t.perimeterForXLabel} {geoX}: Π ＝ 6 · {geoX} ＋ 8 ＝</span>
                    <strong>{rectPerimeter.toLocaleString(numLocale)} cm</strong>
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