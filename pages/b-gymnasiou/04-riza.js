import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων ελληνικών με διατήρηση μόνο του Β'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow & υποστήριξη JSX/strings)
const Frac = ({ num, den, className = "" }) => {
  const isStringOrNumber = (val) => typeof val === 'string' || typeof val === 'number';

  const isNumNeg = isStringOrNumber(num) && String(num).trim().startsWith('-');
  const isDenNeg = isStringOrNumber(den) && String(den).trim().startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const renderContent = (val) => {
    if (isStringOrNumber(val)) {
      return String(val).trim().replace(/^-/, '');
    }
    return val;
  };

  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}>
      {isNegative && <span className="mr-0.5 text-sm sm:text-base font-bold select-none">－</span>}
      <span className="inline-flex flex-col text-center leading-none text-[0.85em] sm:text-[0.9em]">
        <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{renderContent(num)}</span>
        <span className="pt-0.5 px-0.5 sm:px-1 break-all">{renderContent(den)}</span>
      </span>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 relative font-mono font-semibold shrink-0 ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-3.5 sm:pl-4 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Πρώτα 20 τέλεια τετράγωνα για αναφορά
const PERFECT_SQUARES = Array.from({ length: 20 }, (_, i) => ({
  n: i + 1,
  sq: (i + 1) * (i + 1)
}));

export default function RizaTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --- Συγκεντρωτικό Λεξικό i18n (el / en) ---
  const t = {
    el: {
      pageTitle: "Τετραγωνικοί Αριθμοί & Τετραγωνική Ρίζα | Β' Γυμνασίου",
      pageDesc: "Θεωρία, τέλεια τετράγωνα, ορισμός και ιδιότητες της τετραγωνικής ρίζας με διαδραστικά εργαστήρια γεωμετρικής κατανόησης.",
      backText: "Β' Γυμνασίου",
      actionBtn: "ΑΣΚΗΣΕΙΣ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 4",
      headerTitle: "ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ & ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ",
      headerDesc: "Ανακαλύπτουμε τα τέλεια τετράγωνα μέσα από τη γεωμετρία και ορίζουμε την τετραγωνική ρίζα θετικού αριθμού ως την αντίστροφη διαδικασία του τετραγώνου.",

      // Ενότητα 1
      sec1Num: "1",
      sec1Title: "Τετράγωνο Αριθμού & Τέλεια Τετράγωνα",
      squareDef1: "Τετράγωνο",
      squareDef2: "ενός αριθμού α ονομάζεται το γινόμενο του αριθμού με τον εαυτό του, δηλαδή:",
      perfectSquareDef: "Τέλειο τετράγωνο ή τετραγωνικός αριθμός ονομάζεται κάθε φυσικός αριθμός που είναι τετράγωνο κάποιου άλλου φυσικού αριθμού.",
      squaresTableTitle: "ΤΑ ΠΡΩΤΑ 20 ΤΕΛΕΙΑ ΤΕΤΡΑΓΩΝΑ",
      squaresTableHint: "💡 Η εξοικείωση με τα τετράγωνα των αριθμών από το 1 έως το 20 βοηθά στην άμεση αναγνώριση των τετραγωνικών ριζών.",

      // Ενότητα 2 (Εργαστήριο 1)
      sec2Num: "2",
      sec2Title: "🛠️ Εργαστήριο 1: Η Γεωμετρική Ερμηνεία του Τετραγώνου (Πλευρά έως 20)",
      sec2Desc: "Ένα τέλειο τετράγωνο αναπαριστά το πλήθος των τετραγωνιδίων ή το εμβαδόν ενός τετραγώνου με πλευρά α. Σύρε τον επιλογέα για να ρυθμίσεις την πλευρά από 1 έως 20:",
      sideLabel: "ΠΛΕΥΡΑ ΤΕΤΡΑΓΩΝΟΥ (α):",
      areaTitle: "ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ (ΤΕΤΡΑΓΩΝΟΥ)",
      inverseTitle: "ΑΝΤΙΣΤΡΟΦΗ ΔΙΑΔΙΚΑΣΙΑ (ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ)",
      inverseQuestionPrefix: "«Ποιος θετικός αριθμός αν υψωθεί στο τετράγωνο δίνει",
      inverseQuestionSuffix: "Ο",
      gridSubtext: "τετραγωνίδια",

      // Ενότητα 3
      sec3Num: "3",
      sec3Title: "Τετραγωνική Ρίζα Θετικού Αριθμού",
      rootDefTitle: "Ορισμός Τετραγωνικής Ρίζας:",
      rootDefText: "Τετραγωνική ρίζα ενός θετικού αριθμού α (συμβολίζεται με √α) ονομάζεται ο θετικός αριθμός ο οποίος, όταν υψωθεί στο τετράγωνο, δίνει τον αριθμό α.",
      ifText: "Αν x ≥ 0 και x² ＝ α, τότε",
      propertiesTitle: "Βασικές Ιδιότητες:",
      prop1: "√0 ＝ 0  και  √1 ＝ 1",
      prop2Prefix: "(√α)² ＝ α για κάθε α ≥ 0 (π.χ. (√7)² ＝ 7)",
      prop3Prefix: "√(α²) ＝ α για κάθε α ≥ 0 (π.χ. √(5²) ＝ 5)",
      propFrac: "Ρίζα κλάσματος: √(α/β) ＝ √α / √β (π.χ. √(4/9) ＝ 2/3)",

      // Παγίδες
      trapsHeading: "ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΓΙΔΕΣ ΤΩΝ ΡΙΖΩΝ!",
      trap1Title: "1. ΡΙΖΑ ΑΡΝΗΤΙΚΟΥ ΑΡΙΘΜΟΥ",
      trap1Text: "Η έκφραση √(-9) ή √(-16) ΔΕΝ ΕΧΕΙ ΝΟΗΜΑ στους πραγματικούς αριθμούς, διότι κανενός αριθμού το τετράγωνο δεν είναι αρνητικό!",
      trap2Title: "2. ΤΟ ΑΠΟΤΕΛΕΣΜΑ ΕΙΝΑΙ ΠΑΝΤΑ ΜΗ ΑΡΝΗΤΙΚΟ",
      trap2Text: "Αν και τόσο το 4² όσο και το (-4)² ισούνται με 16, εξ ορισμού ισχύει:",
      trap2Warning: "(ΠΟΤΕ -4)",
      trap3Title: "3. ΠΡΟΣΟΧΗ ΣΤΗΝ ΠΡΟΣΘΕΣΗ & ΑΦΑΙΡΕΣΗ ΚΑΤΩ ΑΠΟ ΤΗ ΡΙΖΑ",
      trap3Text: "Η ρίζα δεν σπάει στην πρόσθεση και την αφαίρεση:",
      trap3Warning: "(ΟΧΙ √9 ＋ √16 ＝ 3 ＋ 4 ＝ 7)",

      // Ενότητα 4 (Εργαστήριο 2)
      sec4Num: "4",
      sec4Title: "🛠️ Εργαστήριο 2: Έλεγχος Τέλειου Τετραγώνου & Εγκλωβισμός Ρίζας",
      sec4Desc: "Πληκτρολόγησε έναν οποιονδήποτε αριθμό για να ελέγξεις αν είναι τέλειο τετράγωνο ή, αν δεν είναι, να δεις ανάμεσα σε ποια δύο διαδοχικά τέλεια τετράγωνα εγκλωβίζεται η ρίζα του:",
      tryLabel: "ΔΟΚΙΜΑΣΕ:",
      inputLabel: "ΑΡΙΘΜΟΣ ΠΡΟΣ ΕΛΕΓΧΟ:",
      inputPlaceholder: "π.χ. 49, 225 ή 400",
      clearBtn: "ΚΑΘΑΡΙΣΜΟΣ",
      rootCalcTitle: "ΥΠΟΛΟΓΙΣΜΟΣ ΡΙΖΑΣ",
      badgePerfect: "ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ",
      badgeNonPerfect: "ΜΗ ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ (ΑΡΡΗΤΟΣ)",
      isPerfectMsg: "✓ Ο αριθμός είναι τέλειο τετράγωνο!",
      appliesText: "Ισχύει:",
      soText: ", άρα",
      boundingTitle: "🔍 Εγκλωβισμός της ρίζας",
      notPerfectExplain: "δεν είναι τέλειο τετράγωνο. Βρίσκεται όμως ανάμεσα στα διαδοχικά τέλεια τετράγωνα:",

      // Σφάλματα
      errEmpty: "Πληκτρολόγησε έναν μη αρνητικό αριθμό.",
      errInvalid: "Μη έγκυρος αριθμός.",
      errNegative: "Η τετραγωνική ρίζα αρνητικού αριθμού ΔΕΝ ορίζεται στους πραγματικούς αριθμούς!",

      // Ενότητα 5 (Παραδείγματα)
      sec5Num: "5",
      sec5Title: "Αναλυτικά Λυμένα Παραδείγματα",
      ex1Tag: "ΠΑΡΑΔΕΙΓΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ ΜΕ ΡΙΖΕΣ",
      ex1Step1: "1. Υπολογίζουμε τις ρίζες:",
      ex1Step2: "2. Πολλαπλασιασμοί:",
      ex1Step3: "3. Προσθέσεις / Αφαιρέσεις:",
      ex2Tag: "ΠΑΡΑΔΕΙΓΜΑ 2: ΡΙΖΑ ΜΕ ΠΡΑΞΕΙΣ ΚΑΤΩ ΑΠΟ ΤΟ ΡΙΖΙΚΟ",
      ex2Step1: "1. Εκτελούμε πρώτα τις πράξεις μέσα στα ριζικά:",
      ex2Step2: "2. Υπολογίζουμε τις ρίζες:",
      ex3Tag: "ΠΑΡΑΔΕΙΓΜΑ 3: ΡΙΖΑ ΚΛΑΣΜΑΤΟΣ",
      ex3Step1: "1. Σπάμε τη ρίζα:",
      ex3Step2: "2. Πρόσθεση ομωνύμων κλασμάτων:",
      ex4Tag: "ΠΑΡΑΔΕΙΓΜΑ 4: ΕΓΚΛΩΒΙΣΜΟΣ ΑΡΡΗΤΗΣ ΡΙΖΑΣ",
      ex4Question: "Ανάμεσα σε ποιους διαδοχικούς ακέραιους βρίσκεται το",
      ex4Step1: "1. Βρίσκουμε τα τέλεια τετράγωνα εκατέρωθεν του 50:",
      ex4Step2: "2. Άρα:"
    },
    en: {
      pageTitle: "Square Numbers & Square Root | Grade 8",
      pageDesc: "Theory, perfect squares, definition and properties of square root with interactive geometric laboratories for Grade 8.",
      backText: "Grade 8",
      actionBtn: "EXERCISES",
      badgeUnit: "GRADE 8 • UNIT 4",
      headerTitle: "SQUARE NUMBERS & SQUARE ROOT",
      headerDesc: "Discover perfect squares through geometry and define the square root of a positive number as the inverse operation of squaring.",

      // Section 1
      sec1Num: "1",
      sec1Title: "Square of a Number & Perfect Squares",
      squareDef1: "Square",
      squareDef2: "of a number a is defined as the product of the number by itself:",
      perfectSquareDef: "A perfect square or square number is any natural number that is the square of another natural number.",
      squaresTableTitle: "THE FIRST 20 PERFECT SQUARES",
      squaresTableHint: "💡 Familiarity with the squares of numbers from 1 to 20 enables instantaneous recognition of square roots.",

      // Section 2
      sec2Num: "2",
      sec2Title: "🛠️ Lab 1: Geometric Interpretation of a Square (Side up to 20)",
      sec2Desc: "A perfect square represents the number of unit squares or the area of a square with side length a. Adjust the slider from 1 to 20:",
      sideLabel: "SQUARE SIDE LENGTH (a):",
      areaTitle: "AREA CALCULATION (SQUARE)",
      inverseTitle: "INVERSE OPERATION (SQUARE ROOT)",
      inverseQuestionPrefix: "“Which positive number squared gives",
      inverseQuestionSuffix: "It is",
      gridSubtext: "unit squares",

      // Section 3
      sec3Num: "3",
      sec3Title: "Square Root of a Positive Number",
      rootDefTitle: "Definition of Square Root:",
      rootDefText: "The square root of a positive number a (denoted as √a) is the unique positive number which, when squared, equals a.",
      ifText: "If x ≥ 0 and x² ＝ a, then",
      propertiesTitle: "Key Properties:",
      prop1: "√0 ＝ 0  and  √1 ＝ 1",
      prop2Prefix: "(√a)² ＝ a for every a ≥ 0 (e.g. (√7)² ＝ 7)",
      prop3Prefix: "√(a²) ＝ a for every a ≥ 0 (e.g. √(5²) ＝ 5)",
      propFrac: "Square root of a fraction: √(a/b) ＝ √a / √b (e.g. √(4/9) ＝ 2/3)",

      // Traps
      trapsHeading: "CRITICAL PITFALLS TO AVOID WITH ROOTS!",
      trap1Title: "1. SQUARE ROOT OF A NEGATIVE NUMBER",
      trap1Text: "The expression √(-9) or √(-16) HAS NO MEANING in real numbers, because no real number squares to a negative value!",
      trap2Title: "2. THE RESULT IS ALWAYS NON-NEGATIVE",
      trap2Text: "Although both 4² and (-4)² equal 16, by definition:",
      trap2Warning: "(NEVER -4)",
      trap3Title: "3. ADDITION & SUBTRACTION UNDER RADICAL",
      trap3Text: "The radical does NOT distribute across addition or subtraction:",
      trap3Warning: "(NOT √9 ＋ √16 ＝ 3 ＋ 4 ＝ 7)",

      // Section 4
      sec4Num: "4",
      sec4Title: "🛠️ Lab 2: Perfect Square Verifier & Root Bounding",
      sec4Desc: "Type any number to check if it is a perfect square, or if not, determine between which two consecutive integers its root is bounded:",
      tryLabel: "TRY:",
      inputLabel: "NUMBER TO TEST:",
      inputPlaceholder: "e.g. 49, 225 or 400",
      clearBtn: "CLEAR",
      rootCalcTitle: "ROOT CALCULATION",
      badgePerfect: "PERFECT SQUARE",
      badgeNonPerfect: "NOT A PERFECT SQUARE (IRRATIONAL)",
      isPerfectMsg: "✓ The number is a perfect square!",
      appliesText: "It holds:",
      soText: ", therefore",
      boundingTitle: "🔍 Root Bounding",
      notPerfectExplain: "is not a perfect square. It lies between consecutive perfect squares:",

      // Errors
      errEmpty: "Please enter a non-negative number.",
      errInvalid: "Invalid number.",
      errNegative: "The square root of a negative number is NOT defined in real numbers!",

      // Section 5
      sec5Num: "5",
      sec5Title: "Detailed Solved Examples",
      ex1Tag: "EXAMPLE 1: EVALUATING EXPRESSIONS WITH ROOTS",
      ex1Step1: "1. Evaluate square roots:",
      ex1Step2: "2. Multiplication:",
      ex1Step3: "3. Addition / Subtraction:",
      ex2Tag: "EXAMPLE 2: OPERATIONS UNDER THE RADICAL",
      ex2Step1: "1. Evaluate operations under radicals first:",
      ex2Step2: "2. Evaluate roots:",
      ex3Tag: "EXAMPLE 3: FRACTION SQUARE ROOT",
      ex3Step1: "1. Split the root:",
      ex3Step2: "2. Add like fractions:",
      ex4Tag: "EXAMPLE 4: BOUNDING AN IRRATIONAL ROOT",
      ex4Question: "Between which consecutive integers does",
      ex4Step1: "1. Find perfect squares on both sides of 50:",
      ex4Step2: "2. Therefore:"
    }
  };

  const cur = t[locale] || t.el;

  // State Εργαστηρίου 1: Γεωμετρικό Τετράγωνο (μέχρι 20)
  const [geoSide, setGeoSide] = useState(6);

  // State Εργαστηρίου 2: Αναλυτής Τετραγωνικής Ρίζας
  const [customInput, setCustomInput] = useState('49');

  // Ανάλυση εισαγωγής για το Εργαστήριο 2
  const rootAnalysis = useMemo(() => {
    const clean = customInput.trim().replace(',', '.');
    if (!clean) return { error: cur.errEmpty };

    const val = parseFloat(clean);
    if (isNaN(val)) return { error: cur.errInvalid };
    if (val < 0) return { error: cur.errNegative };

    const sqrtVal = Math.sqrt(val);
    const isPerfect = Number.isInteger(sqrtVal);

    const lowerInt = Math.floor(sqrtVal);
    const upperInt = lowerInt + 1;
    const lowerSq = lowerInt * lowerInt;
    const upperSq = upperInt * upperInt;

    return {
      val,
      sqrtVal: Number(sqrtVal.toFixed(4)),
      isPerfect,
      intRoot: isPerfect ? sqrtVal : null,
      bounding: !isPerfect ? { lowerInt, upperInt, lowerSq, upperSq } : null
    };
  }, [customInput, cur]);

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/04-riza-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{cur.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase break-words">
              {toCleanUppercase(cur.badgeUnit)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.headerTitle)}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {cur.headerDesc}
            </p>
          </div>
        </section>

        {/* 1. ΤΕΛΕΙΑ ΤΕΤΡΑΓΩΝΑ (ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ) */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec1Num}
              </span>
              <span>{cur.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4 min-w-0">
              <p className="break-words [overflow-wrap:anywhere]">
                <strong>{cur.squareDef1}</strong> {cur.squareDef2}
              </p>
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl font-mono text-center text-lg sm:text-xl font-bold text-indigo-950 flex items-center justify-center gap-1.5">
                <span>{locale === 'el' ? 'α' : 'a'}²</span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α · α' : 'a · a'}</span>
              </div>
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.perfectSquareDef}
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-sm sm:text-base text-slate-600 font-mono">
                <li>0² ＝ 0</li>
                <li>1² ＝ 1</li>
                <li>2² ＝ 4</li>
                <li>3² ＝ 9</li>
                <li>4² ＝ 16</li>
                <li>5² ＝ 25 ...</li>
              </ul>
            </div>

            {/* Πίνακας Τέλειων Τετραγώνων (1 έως 20) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.squaresTableTitle)}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 font-mono text-center min-w-0">
                {PERFECT_SQUARES.map((item) => (
                  <div key={item.n} className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs min-w-0">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-sans">{item.n}²</div>
                    <div className="text-sm sm:text-base font-black text-indigo-700 break-all">{item.sq}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic break-words [overflow-wrap:anywhere]">
                {cur.squaresTableHint}
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΩΜΕΤΡΙΚΗ ΟΠΤΙΚΟΠΟΙΗΣΗ (ΕΩΣ 20) */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec2Num}
              </span>
              <span>{cur.sec2Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec2Desc}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 text-white rounded-3xl p-5 sm:p-10 shadow-inner min-w-0">
            
            {/* Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 space-y-6 min-w-0">
              <div className="space-y-3 min-w-0">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold gap-2">
                  <span className="text-slate-400 uppercase tracking-wider break-words">
                    {toCleanUppercase(cur.sideLabel)}
                  </span>
                  <span className="font-mono text-xl sm:text-2xl text-amber-300 font-black shrink-0">{geoSide}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={geoSide}
                  onChange={(e) => setGeoSide(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>

                {/* Γρήγορα κουμπιά επιλογής */}
                <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
                  {[1, 4, 8, 10, 12, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGeoSide(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all touch-manipulation ${
                        geoSide === num
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {locale === 'el' ? 'α' : 'a'}＝{num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτες Αποτελέσματος */}
              <div className="space-y-3 min-w-0">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 min-w-0">
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block break-words">
                    {toCleanUppercase(cur.areaTitle)}
                  </span>
                  <div className="font-mono text-lg sm:text-2xl font-black text-white flex items-center flex-wrap gap-1 break-all">
                    <span>{locale === 'el' ? 'Ε' : 'A'} ＝ {geoSide}² ＝ {geoSide * geoSide}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 min-w-0">
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block break-words">
                    {toCleanUppercase(cur.inverseTitle)}
                  </span>
                  <div className="font-mono text-lg sm:text-2xl font-black text-amber-300 flex items-center flex-wrap gap-1 break-all">
                    <Sqrt>{geoSide * geoSide}</Sqrt>
                    <span>＝</span>
                    <span>{geoSide}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans pt-1 break-words [overflow-wrap:anywhere]">
                    {cur.inverseQuestionPrefix} {geoSide * geoSide}; {cur.inverseQuestionSuffix} {geoSide}!»
                  </p>
                </div>
              </div>
            </div>

            {/* Οπτική Αναπαράσταση Grid */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4 min-w-0">
              <div
                className="grid p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 max-w-full box-border"
                style={{
                  gridTemplateColumns: `repeat(${geoSide}, minmax(0, 1fr))`,
                  gap: geoSide > 12 ? '2px' : '4px',
                  width: `${Math.min(geoSide * 18 + 60, 320)}px`,
                  height: `${Math.min(geoSide * 18 + 60, 320)}px`,
                }}
              >
                {Array.from({ length: geoSide * geoSide }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xs sm:rounded-sm bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-xs ${
                      geoSide > 14 ? 'border-none' : 'border border-indigo-400/30'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 text-xs font-mono text-slate-400 text-center break-words">
                {locale === 'el' ? 'Πλέγμα' : 'Grid'} {geoSide} · {geoSide} ＝ {geoSide * geoSide} {cur.gridSubtext}
              </div>
            </div>

          </div>
        </section>

        {/* 3. Η ΕΝΝΟΙΑ ΤΗΣ ΤΕΤΡΑΓΩΝΙΚΗΣ ΡΙΖΑΣ & ΙΔΙΟΤΗΤΕΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec3Num}
              </span>
              <span>{cur.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4 min-w-0">
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 min-w-0">
                <strong className="text-purple-950 block text-base sm:text-lg break-words">{cur.rootDefTitle}</strong>
                <p className="text-slate-700 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {cur.rootDefText}
                </p>
                <div className="font-mono text-center font-bold text-purple-950 text-base sm:text-lg pt-1 flex items-center justify-center flex-wrap gap-1">
                  <span>{cur.ifText}</span>
                  <Sqrt>{locale === 'el' ? 'α' : 'a'}</Sqrt>
                  <span>＝ x</span>
                </div>
              </div>

              <div className="space-y-2 text-sm sm:text-base min-w-0">
                <strong className="text-slate-900 block break-words">{cur.propertiesTitle}</strong>
                <ul className="space-y-2 list-disc pl-5 text-slate-600">
                  <li className="flex items-center flex-wrap gap-1">
                    <Sqrt>0</Sqrt> ＝ 0 &nbsp;{locale === 'el' ? 'και' : 'and'}&nbsp; <Sqrt>1</Sqrt> ＝ 1
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span>(</span><Sqrt>{locale === 'el' ? 'α' : 'a'}</Sqrt><span>)² ＝ {locale === 'el' ? 'α' : 'a'} ({locale === 'el' ? 'π.χ.' : 'e.g.'} (</span><Sqrt>7</Sqrt><span>)² ＝ 7)</span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <Sqrt>{locale === 'el' ? 'α' : 'a'}²</Sqrt> ＝ {locale === 'el' ? 'α' : 'a'} ({locale === 'el' ? 'π.χ.' : 'e.g.'} <Sqrt>5²</Sqrt> ＝ 5)
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span>{locale === 'el' ? 'Ρίζα κλάσματος:' : 'Fraction root:'} </span>
                    <Sqrt><Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} /></Sqrt>
                    <span>＝</span>
                    <Frac num={<Sqrt>{locale === 'el' ? 'α' : 'a'}</Sqrt>} den={<Sqrt>{locale === 'el' ? 'β' : 'b'}</Sqrt>} />
                    <span> ({locale === 'el' ? 'π.χ.' : 'e.g.'} </span>
                    <Sqrt><Frac num="4" den="9" /></Sqrt>
                    <span>＝</span>
                    <Frac num="2" den="3" />
                    <span>)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Παγίδες & Προσοχή */}
            <div className="bg-rose-50/50 p-4 sm:p-5 rounded-2xl border border-rose-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 break-words">
                {toCleanUppercase(cur.trapsHeading)}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm min-w-0">
                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1 min-w-0">
                  <strong className="text-rose-700 block uppercase break-words">{toCleanUppercase(cur.trap1Title)}</strong>
                  <p className="text-slate-600 flex items-center flex-wrap gap-1 break-words [overflow-wrap:anywhere]">
                    <span>{locale === 'el' ? 'Η έκφραση ' : 'The expression '}</span>
                    <Sqrt>－9</Sqrt>
                    <span> {locale === 'el' ? 'ή' : 'or'} </span>
                    <Sqrt>－16</Sqrt>
                    <span> {locale === 'el' ? 'ΔΕΝ ΕΧΕΙ ΝΟΗΜΑ στους πραγματικούς αριθμούς!' : 'HAS NO MEANING in real numbers!'}</span>
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1 min-w-0">
                  <strong className="text-rose-700 block uppercase break-words">{toCleanUppercase(cur.trap2Title)}</strong>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.trap2Text}
                  </p>
                  <div className="font-mono font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center flex-wrap gap-1">
                    <Sqrt>16</Sqrt> ＝ ＋4 <span className="text-rose-600 font-sans font-bold ml-1">{cur.trap2Warning}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1 min-w-0">
                  <strong className="text-rose-700 block uppercase break-words">{toCleanUppercase(cur.trap3Title)}</strong>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.trap3Text}
                  </p>
                  <div className="font-mono font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center flex-wrap gap-1">
                    <Sqrt>9 ＋ 16</Sqrt> ＝ <Sqrt>25</Sqrt> ＝ 5 
                    <span className="text-rose-600 font-sans font-bold ml-1">{cur.trap3Warning}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΛΥΤΗΣ & ΕΛΕΓΚΤΗΣ ΡΙΖΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec4Num}
              </span>
              <span>{cur.sec4Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec4Desc}
          </p>

          {/* Προκαθορισμένα κουμπιά */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1 break-words">
              {toCleanUppercase(cur.tryLabel)}
            </span>
            {['49', '81', '20', '100', '144', '225', '400', '50', '-16'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setCustomInput(sample)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono break-words"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Πεδίο Εισαγωγής */}
          <div className="space-y-2 min-w-0">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider break-words">
              {toCleanUppercase(cur.inputLabel)}
            </label>
            <div className="relative">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={cur.inputPlaceholder}
                className="w-full h-14 px-4 sm:px-5 pr-28 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none box-border"
              />
              {customInput && (
                <button
                  type="button"
                  onClick={() => setCustomInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all touch-manipulation"
                >
                  {toCleanUppercase(cur.clearBtn)}
                </button>
              )}
            </div>
          </div>

          {/* Οθόνη Αποτελέσματος */}
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-8 text-white space-y-6 shadow-inner min-w-0">
            {rootAnalysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2 break-words">
                <span>⚠️</span>
                <span>{rootAnalysis.error}</span>
              </div>
            ) : (
              <div className="space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1 break-words">
                      {toCleanUppercase(cur.rootCalcTitle)}
                    </span>
                    <div className="text-xl sm:text-4xl font-black font-mono text-amber-300 flex items-center flex-wrap gap-1 break-all">
                      <Sqrt>{rootAnalysis.val}</Sqrt>
                      <span>＝</span>
                      <span>{rootAnalysis.sqrtVal}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider break-words ${
                        rootAnalysis.isPerfect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {toCleanUppercase(rootAnalysis.isPerfect ? cur.badgePerfect : cur.badgeNonPerfect)}
                    </span>
                  </div>
                </div>

                {rootAnalysis.isPerfect ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-sm sm:text-base font-mono min-w-0">
                    <div className="text-emerald-300 font-sans font-bold break-words">
                      {cur.isPerfectMsg}
                    </div>
                    <div className="text-slate-300 flex items-center flex-wrap gap-1">
                      <span>{cur.appliesText}</span>
                      <span className="text-white font-bold">{rootAnalysis.intRoot}² ＝ {rootAnalysis.val}</span>
                      <span>{cur.soText}</span>
                      <span className="text-amber-300 font-bold inline-flex items-center gap-1">
                        <Sqrt>{rootAnalysis.val}</Sqrt> ＝ {rootAnalysis.intRoot}
                      </span>.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 min-w-0">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm sm:text-base min-w-0">
                      <div className="text-amber-300 font-sans font-bold flex items-center flex-wrap gap-1 break-words">
                        <span>{cur.boundingTitle} </span>
                        <Sqrt>{rootAnalysis.val}</Sqrt>:
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm font-sans break-words [overflow-wrap:anywhere]">
                        {rootAnalysis.val} {cur.notPerfectExplain}
                      </p>
                      <div className="font-mono text-base sm:text-lg font-bold text-white bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-center break-words">
                        {rootAnalysis.bounding.lowerSq} ＜ {rootAnalysis.val} ＜ {rootAnalysis.bounding.upperSq}
                      </div>
                      <div className="font-mono text-base sm:text-lg font-bold text-indigo-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center min-w-0">
                        <div className="flex items-center justify-center flex-wrap gap-1">
                          <Sqrt>{rootAnalysis.bounding.lowerSq}</Sqrt>
                          <span>＜</span>
                          <Sqrt>{rootAnalysis.val}</Sqrt>
                          <span>＜</span>
                          <Sqrt>{rootAnalysis.bounding.upperSq}</Sqrt>
                        </div>
                        <div className="text-amber-400 font-black mt-2 flex items-center justify-center flex-wrap gap-1">
                          <span>{rootAnalysis.bounding.lowerInt}</span>
                          <span>＜</span>
                          <Sqrt>{rootAnalysis.val}</Sqrt>
                          <span>＜</span>
                          <span>{rootAnalysis.bounding.upperInt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. ΑΝΑΛΥΤΙΚΑ ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec5Num}
              </span>
              <span>{cur.sec5Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            
            {/* Παράδειγμα 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex1Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>Α ＝ 3 · </span>
                <Sqrt>64</Sqrt>
                <span> － 2 · </span>
                <Sqrt>25</Sqrt>
                <span> ＋ </span>
                <Sqrt>100</Sqrt>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex1Step1} </span>
                  <Sqrt>64</Sqrt><span>＝ 8, </span>
                  <Sqrt>25</Sqrt><span>＝ 5, </span>
                  <Sqrt>100</Sqrt><span>＝ 10</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 3 · 8 － 2 · 5 ＋ 10</div>
                <div className="break-words">{cur.ex1Step2} 3 · 8 ＝ 24, 2 · 5 ＝ 10</div>
                <div className="pl-3 text-slate-500">➔ 24 － 10 ＋ 10</div>
                <div className="break-words">{cur.ex1Step3}</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 14 ＋ 10 ＝ 24</div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex2Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>Β ＝ </span>
                <Sqrt>3 · 12</Sqrt>
                <span> ＋ </span>
                <Sqrt>10² － 8²</Sqrt>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex2Step1}</div>
                <div className="pl-3 text-slate-500 break-words">3 · 12 ＝ 36  {locale === 'el' ? 'και' : 'and'}  10² － 8² ＝ 100 － 64 ＝ 36</div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap gap-1">
                  <span>➔ </span>
                  <Sqrt>36</Sqrt>
                  <span> ＋ </span>
                  <Sqrt>36</Sqrt>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex2Step2} </span>
                  <Sqrt>36</Sqrt>
                  <span> ＝ 6</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 6 ＋ 6</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 12</div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex3Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>Γ ＝ </span>
                <Sqrt><Frac num="49" den="81" /></Sqrt>
                <span> ＋ </span>
                <Frac num="2" den="9" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex3Step1} </span>
                  <Sqrt><Frac num="49" den="81" /></Sqrt>
                  <span> ＝ </span>
                  <Frac num={<Sqrt>49</Sqrt>} den={<Sqrt>81</Sqrt>} />
                  <span> ＝ </span>
                  <Frac num="7" den="9" />
                </div>
                <div className="flex items-center flex-wrap pl-3 text-slate-500 gap-1">
                  <span>➔ </span>
                  <Frac num="7" den="9" />
                  <span> ＋ </span>
                  <Frac num="2" den="9" />
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex3Step2} (7 ＋ 2) : 9 ＝ </span>
                  <Frac num="9" den="9" />
                  <span className="font-bold text-indigo-700 ml-1">＝ 1</span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex4Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex4Question} </span>
                <Sqrt>50</Sqrt>;
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex4Step1}</div>
                <div className="pl-3 text-slate-500 break-words">49 (7² ＝ 49) {locale === 'el' ? 'και' : 'and'} 64 (8² ＝ 64)</div>
                <div>{cur.ex4Step2} 49 ＜ 50 ＜ 64</div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap gap-1">
                  <span>➔ </span>
                  <Sqrt>49</Sqrt>
                  <span> ＜ </span>
                  <Sqrt>50</Sqrt>
                  <span> ＜ </span>
                  <Sqrt>64</Sqrt>
                </div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1">
                  <span>➔ 7 ＜ </span>
                  <Sqrt>50</Sqrt>
                  <span> ＜ 8</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}