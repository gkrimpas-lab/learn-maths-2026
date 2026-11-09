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
    pageTitle: "Αριθμητικές & Αλγεβρικές Παραστάσεις σε Προβλήματα | Α' Γυμνασίου",
    pageDesc: "Η έννοια της αριθμητικής και της αλγεβρικής παράστασης, μαθηματική μοντελοποίηση προβλημάτων και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 25 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Αριθμητικές & Αλγεβρικές Παραστάσεις σε Προβλήματα",
    mainSubtitle: "Μαθαίνουμε πώς να διακρίνουμε τις αριθμητικές από τις αλγεβρικές παραστάσεις και πώς να μεταφράζουμε προβλήματα της καθημερινής ζωής στη γλώσσα των Μαθηματικών.",

    // Ενότητα 1
    sec1Title: "Αριθμητική vs Αλγεβρική Παράσταση",
    form1Badge: "ΜΟΡΦΗ 1: ΜΟΝΟ ΑΡΙΘΜΟΙ",
    form1Title: "Αριθμητική Παράσταση",
    form1Desc: "Είναι μια μαθηματική έκφραση που περιέχει αποκλειστικά αριθμούς και πράξεις μεταξύ τους. Έχει μία συγκεκριμένη και σταθερή αριθμητική τιμή.",
    form1Ex1: "3 · 4 ＋ 5 ＝ 12 ＋ 5 ＝ 17",
    form1Ex2: "(18 － 6) : 2 ＝ 12 : 2 ＝ 6",
    form1Footnote: "Χρησιμοποιείται όταν όλα τα δεδομένα του προβλήματος είναι ήδη γνωστά.",

    form2Badge: "ΜΟΡΦΗ 2: ΜΕ ΜΕΤΑΒΛΗΤΗ",
    form2Title: "Αλγεβρική Παράσταση",
    form2Desc: "Είναι μια μαθηματική έκφραση που περιέχει αριθμούς, πράξεις και τουλάχιστον μία μεταβλητή (γράμμα). Η τιμή της μεταβάλλεται ανάλογα με την τιμή που δίνουμε στη μεταβλητή.",
    form2Ex1: "3 · x ＋ 5 (εξαρτάται από το x)",
    form2Ex2: "2 · α ＋ 4 · β (εξαρτάται από τα α και β)",
    form2Footnote: "Χρησιμοποιείται όταν ένα μέγεθος είναι άγνωστο ή μεταβάλλεται.",

    // Ενότητα 2
    sec2Title: "Μοντελοποίηση Προβλήματος: Έξοδος στον Κινηματογράφο",
    probCinemaIntro: "Σε έναν κινηματογράφο, κάθε εισιτήριο κοστίζει {ticket} € και κάθε ποπ κορν κοστίζει {popcorn} €. Αν κάθε άτομο πάρει 1 εισιτήριο και 1 ποπ κορν:",
    probCinemaBullet1: "Αν γνωρίζουμε το πλήθος των ατόμων (π.χ. {count} άτομα), γράφουμε αριθμητική παράσταση.",
    probCinemaBullet2: "Αν το πλήθος είναι άγνωστο (x άτομα), γράφουμε αλγεβρική παράσταση.",
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστικός Μετατροπέας Παράστασης",
    exprTypeLabel: "ΤΥΠΟΣ ΠΑΡΑΣΤΑΣΗΣ",
    btnNumericMode: "ΑΡΙΘΜΗΤΙΚΗ (ΣΤΑΘΕΡΟ)",
    btnAlgebraicMode: "ΑΛΓΕΒΡΙΚΗ (ΜΕ x)",
    personCountLabel: "ΠΛΗΘΟΣ ΑΤΟΜΩΝ",
    personsUnit: "άτομα",
    ticketLabel: "ΕΙΣΙΤΗΡΙΟ (€)",
    popcornLabel: "ΠΟΠ ΚΟΡΝ (€)",
    modelingCardTitle: "ΜΑΘΗΜΑΤΙΚΗ ΜΟΝΤΕΛΟΠΟΙΗΣΗ",
    badgeAlgebraic: "ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ",
    badgeNumeric: "ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ",
    calcForKnownPeople: "Υπολογισμός συνολικού κόστους για {count} άτομα:",
    calcForKnownExplanation: "Επειδή γνωρίζουμε τον αριθμό των ατόμων ({count}), σχηματίσαμε μια αριθμητική παράσταση που δίνει συγκεκριμένο αποτέλεσμα ({total} €).",
    calcForUnknownPeople: "Γενικός τύπος κόστους για άγνωστο πλήθος x ατόμων:",
    calcForUnknownExplanation: "Επειδή το πλήθος των ατόμων είναι μεταβλητό (x), σχηματίσαμε μια αλγεβρική παράσταση με συντελεστή {cost}.",

    // Ενότητα 3
    sec3Title: "Γεωμετρικά Προβλήματα με Μεταβλητές (Εμβαδόν & Περίμετρος)",
    sec3Intro: "Σε πολλά προβλήματα γεωμετρίας οι διαστάσεις ενός οικοπέδου ή ενός σχήματος δεν είναι όλες σταθερές αλλά εξαρτώνται από μια μεταβλητή x.",
    lab2Title: "🛠️ Εργαστήριο 2: Εμβαδόν Σύνθετου Οικοπέδου",
    varXMetersLabel: "ΜΕΤΑΒΛΗΤΗ x (ΜΕΤΡΑ)",
    sectionDimensionsTitle: "Διαστάσεις Τμημάτων:",
    dimRectLabel: "Ορθογώνιο: Μήκος ＝ x ＋ 4 ＝ {length} m, Πλάτος ＝ 6 m",
    dimSquareLabel: "Τετράγωνο: Πλευρά ＝ x ＝ {x} m",
    totalPlotAreaTitle: "ΣΥΝΟΛΙΚΟ ΕΜΒΑΔΟΝ ΟΙΚΟΠΕΔΟΥ",
    areaFormulaBadge: "Ε ＝ Ε₁ ＋ Ε₂",
    rectE1Label: "Ε₁ (Ορθογώνιο)",
    squareE2Label: "Ε₂ (Τετράγωνο)",
    step1AlgebraicArea: "1. Αλγεβρική Παράσταση Εμβαδού:",
    step2NumericArea: "2. Αριθμητική Τιμή για x ＝ {x} m:",
    sqMetersUnit: "τ.μ."
  },
  en: {
    pageTitle: "Numerical & Algebraic Expressions in Problems | 7th Grade Math",
    pageDesc: "The concept of numerical and algebraic expressions, mathematical modeling of real-world problems, and interactive laboratories.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 25 • THEORY & LAB",
    mainTitle: "Numerical & Algebraic Expressions in Problems",
    mainSubtitle: "Learn how to distinguish between numerical and algebraic expressions and how to translate everyday scenarios into the universal language of Mathematics.",

    // Section 1
    sec1Title: "Numerical vs. Algebraic Expressions",
    form1Badge: "FORM 1: NUMBERS ONLY",
    form1Title: "Numerical Expression",
    form1Desc: "A mathematical statement containing strictly numbers and arithmetic operations between them. It evaluates to a unique, constant numerical value.",
    form1Ex1: "3 · 4 ＋ 5 ＝ 12 ＋ 5 ＝ 17",
    form1Ex2: "(18 － 6) : 2 ＝ 12 : 2 ＝ 6",
    form1Footnote: "Used when all problem quantities are definitively known in advance.",

    form2Badge: "FORM 2: WITH VARIABLE",
    form2Title: "Algebraic Expression",
    form2Desc: "A mathematical statement containing numbers, operations, and at least one variable (letter). Its value changes depending on the numerical value assigned to the variable.",
    form2Ex1: "3 · x ＋ 5 (depends on x)",
    form2Ex2: "2 · a ＋ 4 · b (depends on a and b)",
    form2Footnote: "Used when a quantity is unknown or continuously changing.",

    // Section 2
    sec2Title: "Problem Modeling: A Trip to the Cinema",
    probCinemaIntro: "At a movie theater, each ticket costs €{ticket} and each popcorn costs €{popcorn}. If each guest buys 1 ticket and 1 popcorn:",
    probCinemaBullet1: "If the exact headcount is known (e.g. {count} people), we write a numerical expression.",
    probCinemaBullet2: "If the headcount is unknown (x people), we write an algebraic expression.",
    lab1Title: "🛠️ Lab 1: Interactive Expression Converter",
    exprTypeLabel: "EXPRESSION TYPE",
    btnNumericMode: "NUMERICAL (FIXED)",
    btnAlgebraicMode: "ALGEBRAIC (WITH x)",
    personCountLabel: "NUMBER OF PEOPLE",
    personsUnit: "people",
    ticketLabel: "TICKET (€)",
    popcornLabel: "POPCORN (€)",
    modelingCardTitle: "MATHEMATICAL MODELING",
    badgeAlgebraic: "ALGEBRAIC EXPRESSION",
    badgeNumeric: "NUMERICAL EXPRESSION",
    calcForKnownPeople: "Calculation of total cost for {count} people:",
    calcForKnownExplanation: "Because the number of guests is known ({count}), we constructed a numerical expression giving an exact outcome (€{total}).",
    calcForUnknownPeople: "General cost formula for an unknown number x of guests:",
    calcForUnknownExplanation: "Because the headcount is a variable (x), we constructed an algebraic expression with coefficient {cost}.",

    // Section 3
    sec3Title: "Geometric Problems with Variables (Area & Perimeter)",
    sec3Intro: "In many geometric problems, the dimensions of a land plot or shape are not all constant but depend directly on a variable x.",
    lab2Title: "🛠️ Lab 2: Area of a Composite Plot",
    varXMetersLabel: "VARIABLE x (METERS)",
    sectionDimensionsTitle: "Component Dimensions:",
    dimRectLabel: "Rectangle: Length ＝ x ＋ 4 ＝ {length} m, Width ＝ 6 m",
    dimSquareLabel: "Square: Side ＝ x ＝ {x} m",
    totalPlotAreaTitle: "TOTAL PLOT AREA",
    areaFormulaBadge: "A ＝ A₁ ＋ A₂",
    rectE1Label: "A₁ (Rectangle)",
    squareE2Label: "A₂ (Square)",
    step1AlgebraicArea: "1. Algebraic Expression for Area:",
    step2NumericArea: "2. Numerical Value for x ＝ {x} m:",
    sqMetersUnit: "sq.m."
  }
};

export default function ParastaseisTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const numLocale = locale === 'el' ? 'el-GR' : 'en-US';

  // State για Εργαστήριο 1: Πρόβλημα Κινηματογράφου (Εισιτήριο + Popcorn)
  const [ticketPrice, setTicketPrice] = useState(7);
  const [popcornPrice, setPopcornPrice] = useState(3.5);
  const [isVariableMode, setIsVariableMode] = useState(false); // false: Αριθμητική (σταθερό πλήθος), true: Αλγεβρική (με x)
  const [personCount, setPersonCount] = useState(4); // όταν είναι σε αριθμητική λειτουργία

  // State για Εργαστήριο 2: Γεωμετρικό Πρόβλημα (Οικόπεδο με μεταβλητή x)
  // Οικόπεδο: Ορθογώνιο (πλάτος 6 m, μήκος x + 4 m) και προσαρτημένο τετράγωνο (πλευράς x m)
  const [geoX, setGeoX] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      next = Math.round(next * 10) / 10;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1
  const costPerPerson = useMemo(() => ticketPrice + popcornPrice, [ticketPrice, popcornPrice]);
  const totalNumericCost = useMemo(() => personCount * costPerPerson, [personCount, costPerPerson]);

  // Υπολογισμοί Εργαστηρίου 2 (Οικόπεδο)
  const rectLength = useMemo(() => geoX + 4, [geoX]);
  const rectArea = useMemo(() => 6 * rectLength, [rectLength]);
  const squareArea = useMemo(() => geoX * geoX, [geoX]);
  const totalArea = useMemo(() => rectArea + squareArea, [rectArea, squareArea]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/28-parastaseis-ask"
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

        {/* 1. Η ΔΙΑΦΟΡΑ ΑΡΙΘΜΗΤΙΚΗΣ ΚΑΙ ΑΛΓΕΒΡΙΚΗΣ ΠΑΡΑΣΤΑΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Αριθμητική Παράσταση */}
            <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider break-words">
                  {toCleanUppercase(t.form1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg break-words">
                  {t.form1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.form1Desc}
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                  <div>{t.form1Ex1}</div>
                  <div>{t.form1Ex2}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 italic pt-2 break-words">
                {t.form1Footnote}
              </div>
            </div>

            {/* Αλγεβρική Παράσταση */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-amber-800 tracking-wider break-words">
                  {toCleanUppercase(t.form2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg break-words">
                  {t.form2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.form2Desc}
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm text-amber-950 space-y-1">
                  <div>{t.form2Ex1}</div>
                  <div>{t.form2Ex2}</div>
                </div>
              </div>
              <div className="text-[11px] text-amber-900 font-semibold pt-2 break-words">
                {t.form2Footnote}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΑΠΟ ΤΟ ΠΡΟΒΛΗΜΑ ΣΤΗΝ ΠΑΡΑΣΤΑΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p className="break-words [overflow-wrap:anywhere]">
              <strong>{locale === 'el' ? 'Πρόβλημα:' : 'Problem:'}</strong>{' '}
              {t.probCinemaIntro
                .replace('{ticket}', ticketPrice.toLocaleString(numLocale))
                .replace('{popcorn}', popcornPrice.toLocaleString(numLocale))}
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
              <li>{t.probCinemaBullet1.replace('{count}', personCount.toLocaleString(numLocale))}</li>
              <li>{t.probCinemaBullet2}</li>
            </ul>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Επιλογή Τύπου Παράστασης */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block break-words">
                    {toCleanUppercase(t.exprTypeLabel)}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVariableMode(false)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border break-words ${
                        !isVariableMode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {toCleanUppercase(t.btnNumericMode)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVariableMode(true)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border break-words ${
                        isVariableMode
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {toCleanUppercase(t.btnAlgebraicMode)}
                    </button>
                  </div>
                </div>

                {/* Πλήθος ατόμων (μόνο αν είναι αριθμητική) */}
                {!isVariableMode && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-indigo-900 uppercase block break-words">
                      {toCleanUppercase(t.personCountLabel)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPersonCount, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                        aria-label="Decrease person count"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950 px-1 truncate">
                        {personCount.toLocaleString(numLocale)} {t.personsUnit}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPersonCount, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                        aria-label="Increase person count"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                )}

                {/* Τιμές Εισιτηρίου & Popcorn */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block break-words">{toCleanUppercase(t.ticketLabel)}</label>
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setTicketPrice, -1, 4, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                        aria-label="Decrease ticket price"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono px-1 truncate">
                        {ticketPrice.toLocaleString(numLocale)} €
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setTicketPrice, 1, 4, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                        aria-label="Increase ticket price"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block break-words">{toCleanUppercase(t.popcornLabel)}</label>
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPopcornPrice, -0.5, 1, 8, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                        aria-label="Decrease popcorn price"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono px-1 truncate">
                        {popcornPrice.toLocaleString(numLocale)} €
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPopcornPrice, 0.5, 1, 8, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                        aria-label="Increase popcorn price"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Μοντελοποίησης (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans break-words">
                    {toCleanUppercase(t.modelingCardTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans shrink-0 ${
                    isVariableMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
                  }`}>
                    {toCleanUppercase(isVariableMode ? t.badgeAlgebraic : t.badgeNumeric)}
                  </span>
                </div>

                {!isVariableMode ? (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 font-sans break-words">
                      {t.calcForKnownPeople.replace('{count}', personCount.toLocaleString(numLocale))}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-300 inline-flex flex-wrap items-center gap-1">
                      <span>{personCount.toLocaleString(numLocale)} · ({ticketPrice.toLocaleString(numLocale)} ＋ {popcornPrice.toLocaleString(numLocale)})</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-emerald-400 inline-flex flex-wrap items-center gap-1">
                      <span>＝ {personCount.toLocaleString(numLocale)} · {costPerPerson.toLocaleString(numLocale)} ＝ {totalNumericCost.toLocaleString(numLocale)} €</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 border-t border-slate-800 break-words [overflow-wrap:anywhere]">
                      {t.calcForKnownExplanation
                        .replace('{count}', personCount.toLocaleString(numLocale))
                        .replace('{total}', totalNumericCost.toLocaleString(numLocale))}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 font-sans break-words">
                      {t.calcForUnknownPeople}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-300 inline-flex flex-wrap items-center gap-1">
                      <span>x · ({ticketPrice.toLocaleString(numLocale)} ＋ {popcornPrice.toLocaleString(numLocale)})</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-emerald-400 inline-flex flex-wrap items-center gap-1">
                      <span>＝ {costPerPerson.toLocaleString(numLocale)} · x</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 border-t border-slate-800 break-words [overflow-wrap:anywhere]">
                      {t.calcForUnknownExplanation.replace('{cost}', costPerPerson.toLocaleString(numLocale))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΓΕΩΜΕΤΡΙΚΑ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec3Intro}
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΓΕΩΜΕΤΡΙΚΟ ΟΙΚΟΠΕΔΟ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Stepper x (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-indigo-900 uppercase mb-1 break-words">
                    {toCleanUppercase(t.varXMetersLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoX, -1, 2, 12, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease x in meters"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950 px-1 truncate">
                      x ＝ {geoX.toLocaleString(numLocale)} m
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoX, 1, 2, 12, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase x in meters"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1.5 font-mono">
                  <div className="font-bold text-slate-900 font-sans break-words">{t.sectionDimensionsTitle}</div>
                  <div className="break-words">
                    {t.dimRectLabel.replace('{length}', rectLength.toLocaleString(numLocale))}
                  </div>
                  <div className="break-words">
                    {t.dimSquareLabel.replace('{x}', geoX.toLocaleString(numLocale))}
                  </div>
                </div>
              </div>

              {/* Οπτική Προβολή & Υπολογισμός (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans break-words">
                    {toCleanUppercase(t.totalPlotAreaTitle)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-sans shrink-0">
                    {t.areaFormulaBadge}
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Οικοπέδου */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                  <svg viewBox="0 0 340 180" className="w-full max-w-[320px] h-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Ορθογώνιο Ε1 */}
                    <rect x="20" y="30" width="180" height="110" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                    <text x="110" y="85" fill="#a5b4fc" fontSize="13" fontWeight="bold" textAnchor="middle">
                      {t.rectE1Label}
                    </text>
                    <text x="110" y="103" fill="#818cf8" fontSize="11" textAnchor="middle">6 · (x ＋ 4)</text>
                    <text x="110" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      x ＋ 4 ({rectLength.toLocaleString(numLocale)} m)
                    </text>
                    <text x="10" y="90" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="end">6 m</text>

                    {/* Τετράγωνο Ε2 */}
                    <rect x="200" y="60" width="80" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="240" y="105" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {t.squareE2Label}
                    </text>
                    <text x="240" y="120" fill="#fcd34d" fontSize="10" textAnchor="middle">x²</text>
                    <text x="240" y="52" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
                      x ({geoX.toLocaleString(numLocale)} m)
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                  <div className="break-words">
                    <strong>{t.step1AlgebraicArea}</strong>
                  </div>
                  <div className="font-mono text-indigo-200 text-xs sm:text-sm inline-flex flex-wrap items-center gap-1">
                    <span>{locale === 'el' ? 'Ε' : 'A'} ＝ 6 · (x ＋ 4) ＋ x<sup>2</sup> ＝ x<sup>2</sup> ＋ 6x ＋ 24</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/10 break-words">
                    <strong>{t.step2NumericArea.replace('{x}', geoX.toLocaleString(numLocale))}</strong>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm sm:text-base inline-flex flex-wrap items-center gap-1">
                    <span>{locale === 'el' ? 'Ε' : 'A'} ＝ {geoX}<sup>2</sup> ＋ 6 · {geoX} ＋ 24 ＝ {squareArea.toLocaleString(numLocale)} ＋ {rectArea.toLocaleString(numLocale)} ＝ {totalArea.toLocaleString(numLocale)} {t.sqMetersUnit}</span>
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