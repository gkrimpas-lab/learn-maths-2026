import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Γ')/g);
  return parts
    .map((part) => {
      if (part === "Γ'") return "Γ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum)
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.55em] h-[1.18em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction)
function Frac({ num, den, className = "" }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

// Ενιαίο SVG Component για Ρίζα Κλάσματος √(num / den)
function RadicalFrac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle shrink-0 ${className}`}>
      <svg
        viewBox="0 0 42 46"
        className="h-[2.3em] w-auto overflow-visible select-none font-mono"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 24 L5 24 L9 42 L16 3 L40 3" />
        <line x1="18" y1="23" x2="38" y2="23" strokeWidth="1.6" />
        <text
          x="28"
          y="18"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {num}
        </text>
        <text
          x="28"
          y="38"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {den}
        </text>
      </svg>
    </span>
  );
}

// Βοηθητική συνάρτηση απλοποίησης ρίζας: √n = a√b
function simplifySquareRoot(n) {
  if (n <= 0) return { factor: 0, remainder: 0 };
  let factor = 1;
  let remainder = n;
  for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
    if (remainder % (i * i) === 0) {
      factor *= i;
      remainder /= (i * i);
    }
  }
  return { factor, remainder };
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Ιδιότητες Τετραγωνικών Ριζών | Θεωρία Γ' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία για τις τετραγωνικές ρίζες, ιδιότητες γινομένου και πηλίκου, εξαγωγή παράγοντα και ρητοποίηση παρονομαστή με διαδραστικό εργαστήριο.",
    backNav: "Γ' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 6 • Γ' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Ιδιότητες των Τετραγωνικών Ριζών",
    heroDesc: "Ανακαλύψτε πώς οι τετραγωνικές ρίζες συνδυάζονται, πολλαπλασιάζονται και διαιρούνται. Μάθετε να απλοποιείτε ριζικές παραστάσεις εξάγοντας τέλεια τετράγωνα και εξοικειωθείτε με τη ρητοποίηση του παρονομαστή.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
    
    // Card 1
    card1Badge: "1",
    card1Title: "Ορισμός & Βασικές Συνέπειες",
    card1Desc: "Τετραγωνική ρίζα ενός μη αρνητικού αριθμού α (α ≥ 0) ονομάζεται ο μη αρνητικός αριθμός x (x ≥ 0) του οποίου το τετράγωνο ισούται με α:",
    card1Sub1: "Για α ≥ 0:",
    card1Sub2: "Για κάθε πραγματικό αριθμό α:",
    card1Eg: "Π.χ.",
    card1Not: "και ΟΧΙ －6 (η τιμή της ρίζας είναι πάντοτε ≥ 0).",

    // Card 2
    card2Badge: "2",
    card2Title: "Ιδιότητες Γινομένου & Πηλίκου",
    card2Desc: "Για μη αρνητικούς πραγματικούς αριθμούς α, β ισχύουν οι κανόνες συνένωσης και διαχωρισμού:",
    card2Prod: "Γινόμενο Ριζών (α, β ≥ 0):",
    card2Quot: "Πηλίκο Ριζών (α ≥ 0, β ＞ 0):",
    card2WarnTitle: "Προσοχή:",
    card2WarnDesc: "Η ρίζα δεν επιμερίζεται σε άθροισμα:",

    // Card 3
    card3Badge: "3",
    card3Title: "Εξαγωγή Παράγοντα από τη Ρίζα",
    card3Desc: "Αναλύουμε την υπόριζη ποσότητα σε γινόμενο όπου ένας παράγοντας είναι τέλειο τετράγωνο:",
    card3Cond: "(όπου α ≥ 0, β ≥ 0)",

    // Card 4
    card4Badge: "4",
    card4Title: "Ρητοποίηση Παρονομαστή",
    card4Desc: "Όταν ο παρονομαστής περιέχει άρρητη ρίζα, πολλαπλασιάζουμε αριθμητή και παρονομαστή με την κατάλληλη ρίζα ώστε να προκύψει ρητός (ακέραιος) παρονομαστής:",

    // Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΙΔΙΟΤΗΤΩΝ",
    labTitle: "Δυναμικός Υπολογιστής Γινομένου & Πηλίκου Ριζών",
    tabMult: "Γινόμενο (√α · √β)",
    tabDiv: "Πηλίκο (√α / √β)",
    labelRadA: "Υπόριζο α:",
    labelRadB: "Υπόριζο β:",
    labPresets: "ΔΟΚΙΜΑΣΤΕ ΚΛΑΣΙΚΑ ΖΕΥΓΗ:",
    labResultTitle: "ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ",
    labStepsTitle: "ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ & ΑΠΛΟΠΟΙΗΣΗΣ:",
    perfectSquareRational: "(τέλειο τετράγωνο, ρητός αριθμός)",
    cannotSimplify: "(δεν απλοποιείται περαιτέρω)",
    rationalizeDenominator: "Ρητοποίηση παρονομαστή:",

    // Problems
    solvedProblemsTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΣΤΑΣΕΙΣ & ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ",
    prob1Title: "Υπολογισμός διαγωνίου και εμβαδού με εξαγωγή παράγοντα",
    prob1DescPre: "Ένα ορθογώνιο παραλληλόγραμμο έχει διαστάσεις μήκους και πλάτους:",
    prob1DescQ1: "α) Να υπολογιστεί το εμβαδόν του Ε σε cm².",
    prob1DescQ2: "β) Να βρεθεί το μήκος της διαγωνίου του d σε απλοποιημένη ριζική μορφή.",
    prob1Col1: "Μέγεθος",
    prob1Col2: "Μαθηματικός Τύπος",
    prob1Col3: "Υπολογισμός",
    prob1Row1: "1. Εμβαδόν Ε",
    prob1Row2: "2. Διαγώνιος d²",
    prob1Row3: "3. Διαγώνιος d",
    prob1ResArea: "Εμβαδόν:",
    prob1ResAreaNote: "24 cm² (ακέραιος ρητός αριθμός).",
    prob1ResDiag: "Μήκος διαγωνίου:",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΛΓΕΒΡΙΚΗ ΑΠΛΟΠΟΙΗΣΗ & ΡΗΤΟΠΟΙΗΣΗ",
    prob2Title: "Υπολογισμός σύνθετης παράστασης με ρητοποίηση",
    prob2Desc: "Να υπολογιστεί η αριθμητική τιμή της παράστασης με ρητοποίηση και αναγωγή ομοίων ριζών:",
    prob2Col1: "Όρος",
    prob2Col2: "Διαδικασία Μετατροπής",
    prob2Col3: "Απλοποιημένη Μορφή",
    prob2Row1: "1ος Όρος (√72)",
    prob2Row2: "2ος Όρος (18 / √2)",
    prob2Row3: "3ος Όρος (√50)",
    prob2Reduction: "Αναγωγή Ομοίων Ριζών:",
    prob2Conclusion: "Συμπέρασμα:",
    prob2ConclusionNote: "Η αρχική σύνθετη παράσταση απλοποιείται στον άρρητο αριθμό 2 · √2.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΤΕΤΡΑΓΩΝΙΚΕΣ ΡΙΖΕΣ",
    alert1Title: "Η τετραγωνική ρίζα δεν επιμερίζεται σε άθροισμα:",
    alert1Desc: "ΔΕΝ ισούται με √α ＋ √β. Οι ιδιότητες ισχύουν αποκλειστικά για γινόμενο και πηλίκο.",
    alert2Title: "Πρόσημο ρίζας:",
    alert2Desc: "Από τον ορισμό, η έκφραση √α είναι πάντοτε μη αρνητικός αριθμός (√α ≥ 0). Επομένως √9 ＝ 3 και ΠΟΤΕ ±3.",
    alert3Title: "Εξαγωγή παράγοντα με αρνητικό συντελεστή:",
    alert3Desc: "Ισχύει √(α² · β) ＝ |α| · √β. Αν ο α είναι αρνητικός, βγαίνει έξω ως －α [π.χ. √((－3)² · 2) ＝ |－3| · √2 ＝ 3 · √2].",

    // Bottom Banner
    bottomTitle: "Εξασκηθείτε στις Ιδιότητες των Ριζών!",
    bottomDesc: "Δοκιμάστε τις δυνάμεις σας σε διαδραστικές ερωτήσεις και αυτούσια προβλήματα απλοποίησης και ρητοποίησης με άμεση ανατροφοδότηση.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Properties of Square Roots | Grade 9 Theory",
    pageDesc: "In-depth theory on square roots, product and quotient rules, factor extraction, and denominator rationalization with an interactive lab.",
    backNav: "Grade 9",
    heroBadge: "CHAPTER 6 • GRADE 9",
    heroTitle: "Properties of Square Roots",
    heroDesc: "Discover how square roots combine, multiply, and divide. Master simplifying radical expressions by extracting perfect squares and rationalizing denominators.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",
    
    // Card 1
    card1Badge: "1",
    card1Title: "Definition & Basic Consequences",
    card1Desc: "The square root of a non-negative number a (a ≥ 0) is defined as the non-negative number x (x ≥ 0) whose square equals a:",
    card1Sub1: "For a ≥ 0:",
    card1Sub2: "For any real number a:",
    card1Eg: "E.g.",
    card1Not: "and NOT －6 (the value of the root is always ≥ 0).",

    // Card 2
    card2Badge: "2",
    card2Title: "Product & Quotient Rules",
    card2Desc: "For non-negative real numbers a, b the following combination and separation rules apply:",
    card2Prod: "Product Rule (a, b ≥ 0):",
    card2Quot: "Quotient Rule (a ≥ 0, b ＞ 0):",
    card2WarnTitle: "Caution:",
    card2WarnDesc: "Square roots do not distribute across addition:",

    // Card 3
    card3Badge: "3",
    card3Title: "Extracting Factors from Radicals",
    card3Desc: "We decompose the radicand into factors where one factor is a perfect square:",
    card3Cond: "(where a ≥ 0, b ≥ 0)",

    // Card 4
    card4Badge: "4",
    card4Title: "Rationalizing the Denominator",
    card4Desc: "When the denominator contains an irrational square root, we multiply numerator and denominator by that root to obtain a rational integer denominator:",

    // Lab
    labBadge: "PROPERTIES LAB",
    labTitle: "Dynamic Root Product & Quotient Calculator",
    tabMult: "Product (√a · √b)",
    tabDiv: "Quotient (√a / √b)",
    labelRadA: "Radicand a:",
    labelRadB: "Radicand b:",
    labPresets: "TRY CLASSIC PAIRS:",
    labResultTitle: "EXPRESSION CALCULATION",
    labStepsTitle: "SOLUTION & SIMPLIFICATION STEPS:",
    perfectSquareRational: "(perfect square, rational number)",
    cannotSimplify: "(cannot be simplified further)",
    rationalizeDenominator: "Rationalizing denominator:",

    // Problems
    solvedProblemsTitle: "Solved Application Problems",
    prob1Badge: "PROBLEM 1: RECTANGLE DIMENSIONS & AREA",
    prob1Title: "Calculating diagonal and area via factor extraction",
    prob1DescPre: "A rectangle has dimensions of length and width:",
    prob1DescQ1: "a) Calculate its area A in cm².",
    prob1DescQ2: "b) Find the length of its diagonal d in simplified radical form.",
    prob1Col1: "Quantity",
    prob1Col2: "Formula",
    prob1Col3: "Calculation",
    prob1Row1: "1. Area A",
    prob1Row2: "2. Diagonal d²",
    prob1Row3: "3. Diagonal d",
    prob1ResArea: "Area:",
    prob1ResAreaNote: "24 cm² (rational integer).",
    prob1ResDiag: "Diagonal length:",

    prob2Badge: "PROBLEM 2: ALGEBRAIC SIMPLIFICATION & RATIONALIZATION",
    prob2Title: "Evaluating a complex expression via rationalization",
    prob2Desc: "Evaluate the numeric value of the expression using rationalization and combining like radicals:",
    prob2Col1: "Term",
    prob2Col2: "Transformation Process",
    prob2Col3: "Simplified Form",
    prob2Row1: "1st Term (√72)",
    prob2Row2: "2nd Term (18 / √2)",
    prob2Row3: "3rd Term (√50)",
    prob2Reduction: "Combining Like Radicals:",
    prob2Conclusion: "Conclusion:",
    prob2ConclusionNote: "The initial composite expression simplifies to the irrational number 2 · √2.",

    // Alerts
    alertTitle: "CAUTION: COMMON PITFALLS WITH SQUARE ROOTS",
    alert1Title: "Roots do not distribute over addition:",
    alert1Desc: "is NOT equal to √a ＋ √b. Rules apply exclusively to products and quotients.",
    alert2Title: "Sign of a root:",
    alert2Desc: "By definition, √a is always a non-negative number (√a ≥ 0). Therefore √9 ＝ 3 and NEVER ±3.",
    alert3Title: "Extracting a factor with a negative coefficient:",
    alert3Desc: "√(a² · b) ＝ |a| · √b applies. If a is negative, it comes out as －a [e.g. √((－3)² · 2) ＝ |－3| · √2 ＝ 3 · √2].",

    // Bottom Banner
    bottomTitle: "Practice Square Root Properties!",
    bottomDesc: "Test your skills with interactive questions and real-world simplification and rationalization problems with immediate feedback.",
    bottomBtn: "START EXERCISES"
  }
};

export default function IdiotitesRizonTheory() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [operation, setOperation] = useState('mult');
  const [valA, setValA] = useState(12);
  const [valB, setValB] = useState(3);

  let calcResult = null;
  let stepContent = null;

  if (operation === 'mult') {
    const prod = valA * valB;
    const { factor, remainder } = simplifySquareRoot(prod);
    if (remainder === 1) {
      calcResult = `${factor}`;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> ＝ {factor} {t.perfectSquareRational}.
        </span>
      );
    } else if (factor === 1) {
      calcResult = <Radical>{prod}</Radical>;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> {t.cannotSimplify}.
        </span>
      );
    } else {
      calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <Radical>{valA}</Radical> · <Radical>{valB}</Radical> ＝ <Radical>{valA} · {valB}</Radical> ＝ <Radical>{prod}</Radical> ＝ <Radical>{factor * factor} · {remainder}</Radical> ＝ {factor} · <Radical>{remainder}</Radical>.
        </span>
      );
    }
  } else {
    if (valA % valB === 0) {
      const q = valA / valB;
      const { factor, remainder } = simplifySquareRoot(q);
      if (remainder === 1) {
        calcResult = `${factor}`;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical> ＝ {factor}.
          </span>
        );
      } else if (factor === 1) {
        calcResult = <Radical>{q}</Radical>;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical>.
          </span>
        );
      } else {
        calcResult = <span className="inline-flex items-center gap-1">{factor} · <Radical>{remainder}</Radical></span>;
        stepContent = (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} /> ＝ <RadicalFrac num={valA} den={valB} /> ＝ <Radical>{q}</Radical> ＝ {factor} · <Radical>{remainder}</Radical>.
          </span>
        );
      }
    } else {
      const prod = valA * valB;
      const { factor, remainder } = simplifySquareRoot(prod);
      calcResult = (
        <Frac
          num={factor === 1 ? <Radical>{remainder}</Radical> : <span className="inline-flex items-center gap-0.5">{factor} · <Radical>{remainder}</Radical></span>}
          den={valB}
        />
      );
      stepContent = (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {t.rationalizeDenominator} <Frac num={<span><Radical>{valA}</Radical> · <Radical>{valB}</Radical></span>} den={<span><Radical>{valB}</Radical> · <Radical>{valB}</Radical></span>} /> ＝ <Frac num={<Radical>{prod}</Radical>} den={valB} />.
        </span>
      );
    }
  }

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/g-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/06-idiotites-rizon-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800 box-border">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl w-full min-w-0">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase(t.heroBadge)}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              {t.heroDesc}
            </p>
            <div>
              <Link
                href="/g-gymnasiou/06-idiotites-rizon-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(t.btnGoExercises)}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 w-full min-w-0">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card1Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {locale === 'el' ? (
                  <><strong>Τετραγωνική ρίζα</strong> ενός μη αρνητικού αριθμού α (α ≥ 0) ονομάζεται ο μη αρνητικός αριθμός x (x ≥ 0) του οποίου το τετράγωνο ισούται με α:</>
                ) : (
                  <><strong>Square root</strong> of a non-negative number a (a ≥ 0) is the non-negative number x (x ≥ 0) whose square equals a:</>
                )}
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-center">
                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-900 inline-flex flex-wrap items-center justify-center gap-2">
                  <span>{locale === 'el' ? 'Αν' : 'If'} <Radical>{locale === 'el' ? 'α' : 'a'}</Radical> ＝ x ({locale === 'el' ? 'με α ≥ 0, x ≥ 0' : 'with a ≥ 0, x ≥ 0'}) {locale === 'el' ? 'τότε' : 'then'} x<sup>2</sup> ＝ {locale === 'el' ? 'α' : 'a'}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-indigo-950">{t.card1Sub1}</span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex flex-wrap items-center gap-1">
                    (<Radical>{locale === 'el' ? 'α' : 'a'}</Radical>)<sup>2</sup> ＝ <Radical>{locale === 'el' ? 'α' : 'a'}<sup>2</sup></Radical> ＝ {locale === 'el' ? 'α' : 'a'}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center gap-1.5 text-amber-950">
                  <span className="font-semibold">{t.card1Sub2}</span>
                  <span className="font-mono font-bold text-amber-900 inline-flex items-center gap-1">
                    <Radical>{locale === 'el' ? 'α' : 'a'}<sup>2</sup></Radical> ＝ |{locale === 'el' ? 'α' : 'a'}|
                  </span>
                  <div className="text-[11px] text-amber-800 w-full mt-1 flex flex-wrap items-center gap-1">
                    <span>{t.card1Eg}</span>
                    <span className="font-mono font-bold"><Radical>(－6)<sup>2</sup></Radical> ＝ |－6| ＝ 6</span>
                    <span>{t.card1Not}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card2Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card2Desc}
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm font-mono text-slate-800">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-sans font-semibold text-slate-700">{t.card2Prod}</span>
                  <strong className="text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap">
                    <Radical>{locale === 'el' ? 'α' : 'a'}</Radical> · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical> ＝ <Radical>{locale === 'el' ? 'α · β' : 'a · b'}</Radical>
                  </strong>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1">
                  <span className="font-sans font-semibold text-slate-700">{t.card2Quot}</span>
                  <strong className="text-indigo-900 inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Frac num={<Radical>{locale === 'el' ? 'α' : 'a'}</Radical>} den={<Radical>{locale === 'el' ? 'β' : 'b'}</Radical>} /> ＝ <RadicalFrac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                  </strong>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 leading-relaxed">
                <strong>{t.card2WarnTitle}</strong> {t.card2WarnDesc} <br />
                <span className="font-mono font-bold mt-1 inline-flex flex-wrap items-center gap-1">
                  <Radical>64 ＋ 36</Radical> ＝ <Radical>100</Radical> ＝ 10 ≠ <Radical>64</Radical> ＋ <Radical>36</Radical> ＝ 8 ＋ 6 ＝ 14.
                </span>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card3Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card3Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card3Desc}
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner font-mono text-xs sm:text-sm md:text-base font-bold flex flex-wrap items-center justify-center gap-1">
                <span>
                  <Radical>{locale === 'el' ? 'α' : 'a'}<sup>2</sup> · {locale === 'el' ? 'β' : 'b'}</Radical> ＝ <Radical>{locale === 'el' ? 'α' : 'a'}<sup>2</sup></Radical> · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical> ＝ {locale === 'el' ? 'α' : 'a'} · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical>
                </span>
                <span className="text-xs text-indigo-200 ml-1 font-sans">{t.card3Cond}</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span><Radical>28</Radical> ＝ <Radical>4 · 7</Radical> ＝ <Radical>2<sup>2</sup> · 7</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">2 · <Radical>7</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span><Radical>45</Radical> ＝ <Radical>9 · 5</Radical> ＝ <Radical>3<sup>2</sup> · 5</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">3 · <Radical>5</Radical></strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 font-mono">
                  <span><Radical>98</Radical> ＝ <Radical>49 · 2</Radical> ＝ <Radical>7<sup>2</sup> · 2</Radical> ＝ </span>
                  <strong className="text-indigo-900 inline-flex items-center gap-0.5">7 · <Radical>2</Radical></strong>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card4Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card4Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card4Desc}
              </p>

              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 flex flex-wrap items-center justify-center gap-2 text-center">
                <Frac num="Α" den={<Radical>{locale === 'el' ? 'β' : 'b'}</Radical>} />
                <span>＝</span>
                <Frac num={<span>Α · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical></span>} den={<span><Radical>{locale === 'el' ? 'β' : 'b'}</Radical> · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical></span>} />
                <span>＝</span>
                <Frac num={<span>Α · <Radical>{locale === 'el' ? 'β' : 'b'}</Radical></span>} den={locale === 'el' ? 'β' : 'b'} />
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1.5 font-mono text-emerald-950">
                  <span>•</span>
                  <Frac num="1" den={<Radical>5</Radical>} />
                  <span>＝</span>
                  <Frac num={<Radical>5</Radical>} den={<span>(<Radical>5</Radical>)<sup>2</sup></span>} />
                  <span>＝</span>
                  <strong><Frac num={<Radical>5</Radical>} den="5" /></strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1.5 font-mono text-emerald-950">
                  <span>•</span>
                  <Frac num="15" den={<Radical>3</Radical>} />
                  <span>＝</span>
                  <Frac num={<span>15 · <Radical>3</Radical></span>} den="3" />
                  <span>＝</span>
                  <strong className="inline-flex items-center gap-0.5">5 · <Radical>3</Radical></strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase(t.labBadge)}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.labTitle}
              </h2>
            </div>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setOperation('mult')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  operation === 'mult' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabMult}
              </button>
              <button
                type="button"
                onClick={() => setOperation('div')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  operation === 'div' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabDiv}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="rangeValA" className="text-xs sm:text-sm font-bold text-slate-700">{t.labelRadA}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">
                    {valA}
                  </span>
                </div>
                <input
                  id="rangeValA"
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={valA}
                  onChange={(e) => setValA(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="rangeValB" className="text-xs sm:text-sm font-bold text-slate-700">{t.labelRadB}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">
                    {valB}
                  </span>
                </div>
                <input
                  id="rangeValB"
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={valB}
                  onChange={(e) => setValB(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase">{toCleanUppercase(t.labPresets)}</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button type="button" onClick={() => { setValA(8); setValB(18); setOperation('mult'); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>8</Radical> · <Radical>18</Radical>
                  </button>
                  <button type="button" onClick={() => { setValA(5); setValB(20); setOperation('mult'); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>5</Radical> · <Radical>20</Radical>
                  </button>
                  <button type="button" onClick={() => { setValA(72); setValB(2); setOperation('div'); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>72</Radical> / <Radical>2</Radical>
                  </button>
                  <button type="button" onClick={() => { setValA(75); setValB(3); setOperation('div'); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono hover:border-indigo-400 inline-flex items-center gap-1">
                    <Radical>75</Radical> / <Radical>3</Radical>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase(t.labResultTitle)}
                </span>
                <div className="text-lg sm:text-2xl lg:text-3xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1 break-words [overflow-wrap:anywhere]">
                  {operation === 'mult' ? (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Radical>{valA}</Radical> · <Radical>{valB}</Radical>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num={<Radical>{valA}</Radical>} den={<Radical>{valB}</Radical>} />
                    </span>
                  )}
                  <span className="text-indigo-400">＝</span>
                  <span className="text-emerald-400 inline-flex items-center break-all">
                    {calcResult}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2 min-w-0">
                <span className="text-xs font-bold text-slate-900 block uppercase">
                  {toCleanUppercase(t.labStepsTitle)}
                </span>
                <div className="leading-relaxed font-mono font-medium text-slate-800 break-words [overflow-wrap:anywhere]">
                  {stepContent}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ΠΡΩΤΟΤΥΠΑ ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full shrink-0" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.solvedProblemsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full min-w-0">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob1Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob1Title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 space-y-1">
                  <p>
                    {t.prob1DescPre}{' '}
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">L ＝ <Radical>48</Radical> cm</span>{' '}
                    {locale === 'el' ? 'και' : 'and'}{' '}
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">W ＝ <Radical>12</Radical> cm</span>.
                  </p>
                  <p>{t.prob1DescQ1}</p>
                  <p>{t.prob1DescQ2}</p>
                </div>

                {/* Mobile View: Stacked Cards (χωρίς καθόλου οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob1Row1}</span>
                      <span className="text-slate-500">{locale === 'el' ? 'Ε ＝ L · W' : 'A ＝ L · W'}</span>
                    </div>
                    <div className="text-slate-800 break-words leading-relaxed">
                      <Radical>48</Radical> · <Radical>12</Radical> ＝ <Radical>48 · 12</Radical> ＝ <Radical>576</Radical> ＝ <strong>24 cm<sup>2</sup></strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob1Row2}</span>
                      <span className="text-slate-500">d<sup>2</sup> ＝ L<sup>2</sup> ＋ W<sup>2</sup></span>
                    </div>
                    <div className="text-slate-800 break-words leading-relaxed">
                      (<Radical>48</Radical>)<sup>2</sup> ＋ (<Radical>12</Radical>)<sup>2</sup> ＝ 48 ＋ 12 ＝ <strong>60</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob1Row3}</span>
                      <span className="text-slate-500">d ＝ <Radical>60</Radical></span>
                    </div>
                    <div className="text-indigo-700 font-bold text-sm break-words">
                      <Radical>4 · 15</Radical> ＝ 2 · <Radical>15</Radical> cm
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (μόνο για sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1Col1}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1Col2}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1Col3}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob1Row1}</td>
                        <td className="p-2 sm:p-2.5">{locale === 'el' ? 'Ε ＝ L · W' : 'A ＝ L · W'}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <Radical>48</Radical> · <Radical>12</Radical> ＝ <Radical>48 · 12</Radical> ＝ <Radical>576</Radical> ＝ 24 cm<sup>2</sup>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob1Row2}</td>
                        <td className="p-2 sm:p-2.5">d<sup>2</sup> ＝ L<sup>2</sup> ＋ W<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            (<Radical>48</Radical>)<sup>2</sup> ＋ (<Radical>12</Radical>)<sup>2</sup> ＝ 48 ＋ 12 ＝ 60
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob1Row3}</td>
                        <td className="p-2 sm:p-2.5">d ＝ <Radical>60</Radical></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <Radical>4 · 15</Radical> ＝ 2 · <Radical>15</Radical> cm
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob1ResArea}</strong> {t.prob1ResAreaNote}</div>
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>{t.prob1ResDiag}</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap">d ＝ 2 · <Radical>15</Radical> cm</span>.
                  </div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob2Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {t.prob2Desc} <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 mt-1 break-words [overflow-wrap:anywhere] bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span>Κ ＝ <Radical>72</Radical> － <Frac num="18" den={<Radical>2</Radical>} /> ＋ <Radical>50</Radical></span>
                  </span>
                </p>

                {/* Mobile View: Stacked Cards (χωρίς καθόλου οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Row1}</span>
                      <span className="text-slate-500">{t.prob2Col3}</span>
                    </div>
                    <div className="text-slate-800 break-words leading-relaxed">
                      <Radical>36 · 2</Radical> ＝ <strong>6 · <Radical>2</Radical></strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Row2}</span>
                      <span className="text-slate-500">{t.prob2Col3}</span>
                    </div>
                    <div className="text-slate-800 break-words leading-relaxed flex flex-wrap items-center gap-1">
                      <Frac num={<span>18 · <Radical>2</Radical></span>} den="2" /> ＝ <strong>－9 · <Radical>2</Radical></strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Row3}</span>
                      <span className="text-slate-500">{t.prob2Col3}</span>
                    </div>
                    <div className="text-slate-800 break-words leading-relaxed">
                      <Radical>25 · 2</Radical> ＝ <strong>＋5 · <Radical>2</Radical></strong>
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (μόνο για sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2Col1}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2Col2}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2Col3}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Row1}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Radical>36 · 2</Radical> ＝ 6 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">6 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Row2}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Frac num={<span>18 · <Radical>2</Radical></span>} den="2" /> ＝ 9 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">－9 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Row3}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1"><Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical></span>
                        </td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center gap-1">＋5 · <Radical>2</Radical></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>{t.prob2Reduction}</strong> (6 － 9 ＋ 5) · <Radical>2</Radical> ＝ <strong className="text-emerald-900 font-mono">2 · <Radical>2</Radical></strong>.
                  </div>
                  <div><strong>{t.prob2Conclusion}</strong> {t.prob2ConclusionNote}</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0" aria-hidden="true">⚠️</span>
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase(t.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert1Title}</strong> <Radical>{locale === 'el' ? 'α ＋ β' : 'a ＋ b'}</Radical> {t.alert1Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert2Title}</strong> {t.alert2Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert3Title}</strong> {t.alert3Desc}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center min-w-0">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug break-words [overflow-wrap:anywhere]">
            {t.bottomTitle}
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            {t.bottomDesc}
          </p>
          <Link
            href="/g-gymnasiou/06-idiotites-rizon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}