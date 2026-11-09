import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Μέγιστος Κοινός Διαιρετής (GCD)
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

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

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow & υποστήριξη JSX)
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

// Component εμφάνισης περιοδικού δεκαδικού με οριζόντια γραμμή πάνω από την περίοδο
const PeriodicNumber = ({ intPart, nonPeriodic, period, locale = 'el' }) => {
  const decSep = locale === 'el' ? ',' : '.';
  return (
    <span className="inline-flex items-baseline font-mono font-bold flex-wrap break-all">
      <span>{intPart}</span>
      {(nonPeriodic !== '' || period !== '') && <span>{decSep}</span>}
      {nonPeriodic !== '' && <span>{nonPeriodic}</span>}
      {period !== '' && (
        <span className="border-t-2 border-amber-400 text-amber-300 pt-0.5 px-0.5 ml-0.5 inline-block leading-none">
          {period}
        </span>
      )}
    </span>
  );
};

// Αλγόριθμος εύρεσης περιόδου κλάσματος (Long Division with Remainders Map)
function fractionToDecimalAnalysis(numerator, denominator, locale = 'el') {
  let num = parseInt(numerator, 10);
  let den = parseInt(denominator, 10);

  if (isNaN(num) || isNaN(den)) {
    return { error: locale === 'el' ? 'Συμπλήρωσε έγκυρους ακεραίους αριθμούς.' : 'Please enter valid integers.' };
  }
  if (den === 0) {
    return { error: locale === 'el' ? 'Ο παρονομαστής δεν μπορεί να είναι 0.' : 'Denominator cannot be 0.' };
  }

  const isNeg = (num < 0 && den > 0) || (num > 0 && den < 0);
  num = Math.abs(num);
  den = Math.abs(den);

  const g = gcd(num, den);
  const simpNum = num / g;
  const simpDen = den / g;

  let tempDen = simpDen;
  while (tempDen % 2 === 0) tempDen /= 2;
  while (tempDen % 5 === 0) tempDen /= 5;

  const intPart = Math.floor(simpNum / simpDen);
  let remainder = simpNum % simpDen;
  const decSep = locale === 'el' ? ',' : '.';

  if (remainder === 0) {
    return {
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isTerminating: true,
      intPart: isNeg ? `－${intPart}` : `${intPart}`,
      nonPeriodic: '',
      period: '',
      fullString: `${isNeg ? '－' : ''}${intPart}`,
      typeDesc: locale === 'el' ? 'Ακέραιος Αριθμός' : 'Integer Number'
    };
  }

  const remainderMap = new Map();
  let decimalDigits = '';
  let startIndex = -1;

  while (remainder !== 0) {
    if (remainderMap.has(remainder)) {
      startIndex = remainderMap.get(remainder);
      break;
    }
    remainderMap.set(remainder, decimalDigits.length);

    remainder *= 10;
    const digit = Math.floor(remainder / simpDen);
    decimalDigits += digit.toString();
    remainder = remainder % simpDen;
  }

  const signStr = isNeg ? '－' : '';
  const fullInt = `${signStr}${intPart}`;

  if (startIndex === -1) {
    return {
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isTerminating: true,
      intPart: fullInt,
      nonPeriodic: decimalDigits,
      period: '',
      fullString: `${fullInt}${decSep}${decimalDigits}`,
      typeDesc: locale === 'el'
        ? 'Πεπερασμένος Δεκαδικός (ο παρονομαστής περιέχει μόνο πρώτους παράγοντες 2 ή 5)'
        : 'Terminating Decimal (denominator factors contain only 2 or 5)'
    };
  } else {
    const nonPeriodicPart = decimalDigits.slice(0, startIndex);
    const periodPart = decimalDigits.slice(startIndex);
    const isPure = nonPeriodicPart.length === 0;

    return {
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isTerminating: false,
      intPart: fullInt,
      nonPeriodic: nonPeriodicPart,
      period: periodPart,
      isPure,
      fullString: `${fullInt}${decSep}${nonPeriodicPart}(${periodPart})`,
      typeDesc: isPure
        ? (locale === 'el' ? 'Καθαρός (Απλός) Περιοδικός Δεκαδικός' : 'Pure Periodic Decimal')
        : (locale === 'el' ? 'Μικτός Περιοδικός Δεκαδικός' : 'Mixed Periodic Decimal')
    };
  }
}

export default function RitoiArritoiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --- Συγκεντρωτικό Λεξικό i18n (el / en) ---
  const t = {
    el: {
      pageTitle: "Ρητοί, Άρρητοι & Περιοδικοί Δεκαδικοί | Β' Γυμνασίου",
      pageDesc: "Θεωρία, δεκαδικές αναπαραστάσεις, η έννοια της περιόδου, καθαροί και μικτοί περιοδικοί αριθμοί με διαδραστικά εργαστήρια.",
      backText: "Β' Γυμνασίου",
      actionBtn: "ΑΣΚΗΣΕΙΣ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 5",
      headerTitle: "ΡΗΤΟΙ ΚΑΙ ΑΡΡΗΤΟΙ ΑΡΙΘΜΟΙ",
      headerDesc: "Εξερευνούμε τη δεκαδική μορφή των αριθμών: πότε ένα κλάσμα δίνει πεπερασμένο δεκαδικό, τι είναι η περίοδος ενός περιοδικού αριθμού και ποιοι αριθμοί ονομάζονται άρρητοι.",

      // Ενότητα 1
      sec1Num: "1",
      sec1Title: "Η Δεκαδική Μορφή των Ρητών Αριθμών",
      rationalDef1: "Ρητός αριθμός (σύνολο ℚ) ονομάζεται κάθε αριθμός που μπορεί να παρασταθεί ως κλάσμα",
      rationalDef2: "όπου α ακέραιος και β φυσικός διάφορος του μηδενός (β ≠ 0).",
      divisionOutcomes: "Όταν διαιρέσουμε τον αριθμητή με τον παρονομαστή ενός κλάσματος, προκύπτει πάντοτε μία από τις δύο παρακάτω μορφές:",
      terminatingTitle: "1. Πεπερασμένος Δεκαδικός Αριθμός:",
      terminatingDesc: "Η διαίρεση τελειώνει (υπόλοιπο 0). Συμβαίνει όταν ο παρονομαστής του ανάγωγου κλάσματος αναλύεται σε πρώτους παράγοντες που περιέχουν μόνο το 2, μόνο το 5 ή και τα δύο.",
      terminatingExamples: "π.χ. 3/4 ＝ 0,75 | 7/10 ＝ 0,7 | 1/8 ＝ 0,125",
      periodicTitle: "2. Άπειρος Περιοδικός Δεκαδικός Αριθμός:",
      periodicDesc: "Η διαίρεση δεν τελειώνει ποτέ, αλλά ένα ψηφίο ή μια ομάδα ψηφίων επαναλαμβάνεται επ' άπειρον. Συμβαίνει όταν ο παρονομαστής περιέχει κι άλλους πρώτους παράγοντες (π.χ. 3, 7, 11).",
      periodicExamples: "π.χ. 1/3 ＝ 0,333... | 1/6 ＝ 0,1666... | 2/11 ＝ 0,1818...",
      periodBoxTitle: "ΤΙ ΕΙΝΑΙ Η ΠΕΡΙΟΔΟΣ ΚΑΙ ΠΩΣ ΣΥΜΒΟΛΙΖΕΤΑΙ;",
      periodDef: "Περίοδος ενός περιοδικού δεκαδικού αριθμού ονομάζεται το ψηφίο ή η ομάδα των ψηφίων που επαναλαμβάνεται επ' άπειρον.",
      notationSubTitle: "ΣΥΜΒΟΛΙΣΜΟΣ ΜΕ ΟΡΙΖΟΝΤΙΑ ΓΡΑΜΜΗ",
      notationDesc: "Αντί να γράφουμε αποσιωπητικά (...), τοποθετούμε μια οριζόντια γραμμή πάνω από την περίοδο:",
      pureVsMixedTitle: "Καθαροί vs Μικτοί Περιοδικοί:",
      pureDefLabel: "Καθαρός (Απλός) Περιοδικός:",
      pureDefText: "Η περίοδος αρχίζει αμέσως μετά την υποδιαστολή, π.χ. 0,6̄ ή 2,15̄.",
      mixedDefLabel: "Μικτός Περιοδικός:",
      mixedDefText: "Υπάρχει μη περιοδικό μέρος πριν ξεκινήσει η περίοδος, π.χ. 0,16̄ (το 1 είναι μη περιοδικό, το 6 είναι η περίοδος).",

      // Ενότητα 2 (Εργαστήριο 1)
      sec2Num: "2",
      sec2Title: "🛠️ Εργαστήριο 1: Μετατροπέας Κλάσματος σε Δεκαδικό & Ανιχνευτής Περιόδου",
      sec2Desc: "Γράψε έναν αριθμητή και έναν παρονομαστή ή διάλεξε ένα έτοιμο παράδειγμα για να δεις τη μετατροπή του κλάσματος σε δεκαδικό και την αυτόματη ανίχνευση της περιόδου:",
      examplesLabel: "ΠΑΡΑΔΕΙΓΜΑΤΑ:",
      fractionLabel: "ΚΛΑΣΜΑ:",
      numPlaceholder: "Αριθμητής",
      denPlaceholder: "Παρονομαστής",
      decFormLabel: "ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ",
      badgeTerminating: "ΠΕΠΕΡΑΣΜΕΝΟΣ",
      badgePeriodic: "ΑΠΕΙΡΟΣ ΠΕΡΙΟΔΙΚΟΣ",
      intPartLabel: "ΑΚΕΡΑΙΟ ΜΕΡΟΣ:",
      nonPeriodLabel: "ΜΗ ΠΕΡΙΟΔΙΚΟ ΜΕΡΟΣ:",
      periodLabel: "ΠΕΡΙΟΔΟΣ:",
      noneText: "(κανένα)",
      noPeriodText: "(δεν υπάρχει)",
      typeLabel: "Τύπος:",

      // Ενότητα 3
      sec3Num: "3",
      sec3Title: "Άρρητοι Αριθμοί & Το Σύνολο των Πραγματικών Αριθμών",
      irrationalDefTitle: "Ορισμός Άρρητου Αριθμού:",
      irrationalDefText: "Άρρητος αριθμός ονομάζεται κάθε αριθμός που δεν μπορεί να παρασταθεί ως κλάσμα ακεραίων.",
      irrationalSubtext: "Η δεκαδική του αναπαράσταση έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο (δεν επαναλαμβάνεται σταθερή ομάδα ψηφίων).",
      irrationalExamplesTitle: "Κλασικά Παραδείγματα Άρρητων Αριθμών:",
      root2Diag: "(η διαγώνιος τετραγώνου πλευράς 1)",
      piRatio: "(ο λόγος μήκους κύκλου προς διάμετρο)",
      realsBoxTitle: "ΤΟ ΣΥΝΟΛΟ ΤΩΝ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ (ℝ)",
      realsIntro: "Όλοι οι ρητοί αριθμοί μαζί με όλους τους άρρητους αριθμούς αποτελούν το σύνολο των Πραγματικών Αριθμών (ℝ):",
      realsFormula: "ΠΡΑΓΜΑΤΙΚΟΙ (ℝ) ＝ ΡΗΤΟΙ (ℚ) ∪ ΑΡΡΗΤΟΙ",
      realsLineNote: "Κάθε σημείο της ευθείας των αριθμών αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό (άξονας πραγματικών αριθμών).",
      realsWarningPrefix: "Σημαντικό: Οι τετραγωνικές ρίζες όλων των φυσικών αριθμών που δεν είναι τέλεια τετράγωνα",
      realsWarningSuffix: "είναι άρρητοι αριθμοί!",

      // Ενότητα 4 (Εργαστήριο 2)
      sec4Num: "4",
      sec4Title: "🛠️ Εργαστήριο 2: Ταξινομητής Αριθμών (Ρητός ή Άρρητος;)",
      sec4Desc: "Επίλεξε έναν αριθμό για να εξετάσεις αν ανήκει στους Ρητούς (ℚ) ή στους Άρρητους και δες την αναλυτική αιτιολόγηση:",
      selectedNumLabel: "ΕΠΙΛΕΓΜΕΝΟΣ ΑΡΙΘΜΟΣ",
      rationalBadge: "✓ ΡΗΤΟΣ ΑΡΙΘΜΟΣ (ℚ)",
      irrationalBadge: "✗ ΑΡΡΗΤΟΣ ΑΡΙΘΜΟΣ",
      reasonLabel: "Αιτιολόγηση:",

      // Ενότητα 5 (Παραδείγματα)
      sec5Num: "5",
      sec5Title: "Αναλυτικά Λυμένα Παραδείγματα",
      ex1Tag: "ΠΑΡΑΔΕΙΓΜΑ 1: ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΕΡΙΟΔΙΚΟ ΔΕΚΑΔΙΚΟ",
      ex1Heading: "Να μετατραπεί το κλάσμα σε δεκαδικό και να βρεθεί η περίοδος.",
      ex1Step1: "1. Εκτελούμε τη διαίρεση 5 : 6",
      ex1Step2: "2. Το ψηφίο 8 δεν επαναλαμβάνεται (μη περιοδικό μέρος).",
      ex1Step3: "3. Το ψηφίο 3 επαναλαμβάνεται επ' άπειρον (περίοδος).",
      ex1Result: "➔ Μικτός Περιοδικός Δεκαδικός:",
      ex2Tag: "ΠΑΡΑΔΕΙΓΜΑ 2: ΕΛΕΓΧΟΣ ΑΡΡΗΤΟΥ ΑΠΟ ΡΙΖΙΚΟ",
      ex2Heading: "Ποιοι από τους παρακάτω αριθμούς είναι άρρητοι;",
      ex2Step1: "1. Το 16 είναι τέλειο τετράγωνο (4² ＝ 16) ➔ ΡΗΤΟΣ",
      ex2Step2: "2. Το 18 ΔΕΝ είναι τέλειο τετράγωνο (4,24264...) ➔ ΑΡΡΗΤΟΣ",
      ex2Step3: "3. Το 49 είναι τέλειο τετράγωνο (7² ＝ 49) ➔ ΡΗΤΟΣ",
      ex2Result: "Μοναδικός άρρητος είναι το",
      ex3Tag: "ΠΑΡΑΔΕΙΓΜΑ 3: ΠΡΟΒΛΕΨΗ ΕΙΔΟΥΣ ΔΕΚΑΔΙΚΟΥ ΧΩΡΙΣ ΔΙΑΙΡΕΣΗ",
      ex3Heading: "Χωρίς διαίρεση, να βρεθεί αν είναι πεπερασμένος ή περιοδικός.",
      ex3Step1: "1. Το κλάσμα είναι ανάγωγο (Μ.Κ.Δ.(7, 40) ＝ 1).",
      ex3Step2: "2. Αναλύουμε τον παρονομαστή 40 σε πρώτους παράγοντες: 40 ＝ 2³ · 5",
      ex3Step3: "3. Επειδή περιέχει ΜΟΝΟ πρώτους παράγοντες 2 και 5:",
      ex3Result: "➔ Είναι ΠΕΠΕΡΑΣΜΕΝΟΣ δεκαδικός (7/40 ＝ 0,175).",
      ex4Tag: "ΠΑΡΑΔΕΙΓΜΑ 4: ΔΙΑΚΡΙΣΗ ΚΑΘΑΡΟΥ ΚΑΙ ΜΙΚΤΟΥ ΠΕΡΙΟΔΙΚΟΥ",
      ex4Heading: "Να χαρακτηριστούν οι αριθμοί: α ＝ 2,444... και β ＝ 0,12555...",
      ex4Step1: "• α ＝ 2,4̄: Η περίοδος (4) ξεκινά αμέσως μετά την υποδιαστολή ➔ Καθαρός Περιοδικός.",
      ex4Step2: "• β ＝ 0,125̄: Υπάρχει το μη περιοδικό μέρος (12) πριν την περίοδο (5) ➔ Μικτός Περιοδικός."
    },
    en: {
      pageTitle: "Rational, Irrational & Periodic Decimals | Grade 8",
      pageDesc: "Theory, decimal representations, the concept of period, pure and mixed periodic numbers with interactive laboratories for Grade 8.",
      backText: "Grade 8",
      actionBtn: "EXERCISES",
      badgeUnit: "GRADE 8 • UNIT 5",
      headerTitle: "RATIONAL AND IRRATIONAL NUMBERS",
      headerDesc: "Explore the decimal representation of numbers: when a fraction yields a terminating decimal, what periodic decimals are, and which numbers are irrational.",

      // Section 1
      sec1Num: "1",
      sec1Title: "Decimal Representation of Rational Numbers",
      rationalDef1: "A rational number (set ℚ) is any number that can be expressed as a fraction",
      rationalDef2: "where a is an integer and b is a non-zero natural number (b ≠ 0).",
      divisionOutcomes: "Dividing the numerator by the denominator of any fraction always yields one of the following two decimal forms:",
      terminatingTitle: "1. Terminating Decimal Number:",
      terminatingDesc: "Division terminates (remainder 0). Occurs when the simplified denominator factors into prime factors containing only 2, only 5, or both.",
      terminatingExamples: "e.g. 3/4 ＝ 0.75 | 7/10 ＝ 0.7 | 1/8 ＝ 0.125",
      periodicTitle: "2. Infinite Periodic (Repeating) Decimal Number:",
      periodicDesc: "Division never terminates, but a single digit or block of digits repeats indefinitely. Occurs when the denominator contains other prime factors (e.g. 3, 7, 11).",
      periodicExamples: "e.g. 1/3 ＝ 0.333... | 1/6 ＝ 0.1666... | 2/11 ＝ 0.1818...",
      periodBoxTitle: "WHAT IS THE PERIOD AND HOW IS IT NOTATED?",
      periodDef: "The period of a repeating decimal is the digit or group of digits that repeats endlessly.",
      notationSubTitle: "OVERLINE NOTATION (VINCULUM)",
      notationDesc: "Instead of writing ellipsis (...), we place an overline directly above the repeating period:",
      pureVsMixedTitle: "Pure vs Mixed Periodic Decimals:",
      pureDefLabel: "Pure Periodic Decimal:",
      pureDefText: "The period begins immediately after the decimal point, e.g. 0.6̄ or 2.15̄.",
      mixedDefLabel: "Mixed Periodic Decimal:",
      mixedDefText: "There is a non-repeating part before the period begins, e.g. 0.16̄ (1 is non-repeating, 6 is the period).",

      // Section 2
      sec2Num: "2",
      sec2Title: "🛠️ Lab 1: Fraction to Decimal Converter & Period Detector",
      sec2Desc: "Type a numerator and denominator or select a preset to see the decimal conversion and automatic period detection:",
      examplesLabel: "PRESETS:",
      fractionLabel: "FRACTION:",
      numPlaceholder: "Numerator",
      denPlaceholder: "Denominator",
      decFormLabel: "DECIMAL FORM",
      badgeTerminating: "TERMINATING",
      badgePeriodic: "INFINITE PERIODIC",
      intPartLabel: "INTEGER PART:",
      nonPeriodLabel: "NON-PERIODIC PART:",
      periodLabel: "PERIOD:",
      noneText: "(none)",
      noPeriodText: "(none)",
      typeLabel: "Type:",

      // Section 3
      sec3Num: "3",
      sec3Title: "Irrational Numbers & The Set of Real Numbers",
      irrationalDefTitle: "Definition of Irrational Number:",
      irrationalDefText: "An irrational number is any number that cannot be expressed as a ratio of two integers.",
      irrationalSubtext: "Its decimal representation has infinitely many digits with no repeating period.",
      irrationalExamplesTitle: "Classic Examples of Irrational Numbers:",
      root2Diag: "(the diagonal of a unit square)",
      piRatio: "(the ratio of circumference to diameter)",
      realsBoxTitle: "THE SET OF REAL NUMBERS (ℝ)",
      realsIntro: "All rational numbers combined with all irrational numbers constitute the set of Real Numbers (ℝ):",
      realsFormula: "REALS (ℝ) ＝ RATIONALS (ℚ) ∪ IRRATIONALS",
      realsLineNote: "Every point on the number line corresponds to a unique real number (real coordinate axis).",
      realsWarningPrefix: "Important: Square roots of natural numbers that are NOT perfect squares",
      realsWarningSuffix: "are irrational numbers!"

      // Section 4
      ,sec4Num: "4",
      sec4Title: "🛠️ Lab 2: Number Classifier (Rational or Irrational?)",
      sec4Desc: "Select a number to determine whether it belongs to the Rationals (ℚ) or Irrationals, with complete mathematical reasoning:",
      selectedNumLabel: "SELECTED NUMBER",
      rationalBadge: "✓ RATIONAL NUMBER (ℚ)",
      irrationalBadge: "✗ IRRATIONAL NUMBER",
      reasonLabel: "Reasoning:",

      // Section 5
      sec5Num: "5",
      sec5Title: "Detailed Solved Examples",
      ex1Tag: "EXAMPLE 1: CONVERTING FRACTION TO PERIODIC DECIMAL",
      ex1Heading: "Convert the fraction into a decimal and determine its period.",
      ex1Step1: "1. Perform division 5 : 6",
      ex1Step2: "2. Digit 8 does not repeat (non-periodic part).",
      ex1Step3: "3. Digit 3 repeats endlessly (period).",
      ex1Result: "➔ Mixed Periodic Decimal:",
      ex2Tag: "EXAMPLE 2: TESTING IRRATIONALITY FROM RADICALS",
      ex2Heading: "Which of the following numbers are irrational?",
      ex2Step1: "1. 16 is a perfect square (4² ＝ 16) ➔ RATIONAL",
      ex2Step2: "2. 18 is NOT a perfect square (4.24264...) ➔ IRRATIONAL",
      ex2Step3: "3. 49 is a perfect square (7² ＝ 49) ➔ RATIONAL",
      ex2Result: "The only irrational number is",
      ex3Tag: "EXAMPLE 3: PREDICTING DECIMAL TYPE WITHOUT DIVISION",
      ex3Heading: "Without division, determine if it is terminating or repeating.",
      ex3Step1: "1. The fraction is in lowest terms (GCD(7, 40) ＝ 1).",
      ex3Step2: "2. Factorize denominator 40: 40 ＝ 2³ · 5",
      ex3Step3: "3. Since it contains ONLY prime factors 2 and 5:",
      ex3Result: "➔ It is a TERMINATING decimal (7/40 ＝ 0.175).",
      ex4Tag: "EXAMPLE 4: DISTINGUISHING PURE AND MIXED PERIODIC",
      ex4Heading: "Classify the numbers: a ＝ 2.444... and b ＝ 0.12555...",
      ex4Step1: "• a ＝ 2.4̄: Period (4) starts immediately after decimal point ➔ Pure Periodic.",
      ex4Step2: "• b ＝ 0.125̄: Non-periodic part (12) precedes period (5) ➔ Mixed Periodic."
    }
  };

  const cur = t[locale] || t.el;

  // State Εργαστηρίου 1
  const [numInput, setNumInput] = useState('1');
  const [denInput, setDenInput] = useState('6');

  // State Εργαστηρίου 2: Επιλεγμένος αριθμός προς ταξινόμηση
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);

  const decAnalysis = useMemo(() => {
    return fractionToDecimalAnalysis(numInput, denInput, locale);
  }, [numInput, denInput, locale]);

  // Δείγματα για το Εργαστήριο 2
  const classificationSamples = useMemo(() => [
    { 
      label: '3/4', 
      renderDisplay: <Frac num="3" den="4" />, 
      isRational: true, 
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Γράφεται ως κλάσμα ακεραίων (' : 'Can be written as a fraction of integers ('}</span>
          <Frac num="3" den="4" />
          <span>＝ {locale === 'el' ? '0,75, πεπερασμένος δεκαδικός).' : '0.75, terminating decimal).'}</span>
        </span>
      )
    },
    { 
      label: '√2', 
      renderDisplay: <Sqrt>2</Sqrt>, 
      isRational: false, 
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Η ρίζα' : 'The root'}</span>
          <Sqrt>2</Sqrt>
          <span>{locale === 'el' ? 'δεν είναι ακέραιος (1,41421356...). Έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο.' : 'is not an integer (1.41421356...). It has infinitely many non-repeating digits.'}</span>
        </span>
      )
    },
    { 
      label: '1/3', 
      renderDisplay: <Frac num="1" den="3" />, 
      isRational: true, 
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Κλάσμα ακεραίων με άπειρα ψηφία, αλλά με περίοδο το 3 (' : 'Fraction of integers with repeating period 3 ('}</span>
          <span>{locale === 'el' ? '0,333... ＝ 0,' : '0.333... ＝ 0.'}<span className="border-t-2 border-indigo-400 pt-0.5">3</span>).</span>
        </span>
      )
    },
    { 
      label: 'π (pi)', 
      renderDisplay: <span>π</span>, 
      isRational: false, 
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Ο αριθμός π ＝ 3,14159265... έχει άπειρα ψηφία χωρίς περίοδο και δεν γράφεται ως κλάσμα ακεραίων.' : 'The number π ＝ 3.14159265... has infinite non-repeating decimal digits and cannot be expressed as a fraction of integers.'}</span>
        </span>
      )
    },
    { 
      label: '√25', 
      renderDisplay: <Sqrt>25</Sqrt>, 
      isRational: true, 
      reason: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Επειδή 25 ＝ 5' : 'Since 25 ＝ 5'}<sup>2</sup></span>
          <span>, {locale === 'el' ? 'ισχύει' : 'it holds:'}</span>
          <Sqrt>25</Sqrt>
          <span>＝ 5 ＝ <Frac num="5" den="1" /></span>
          <span className="font-sans">({locale === 'el' ? 'ρητός, φυσικός αριθμός' : 'rational, natural number'}).</span>
        </span>
      )
    },
    { 
      label: '-7', 
      renderDisplay: <span>－7</span>, 
      isRational: true, 
      reason: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Κάθε ακέραιος είναι και ρητός, καθώς' : 'Every integer is rational, as'}</span>
          <span>－7 ＝ <Frac num="-7" den="1" />.</span>
        </span>
      )
    },
    { 
      label: '0,121121112...', 
      renderDisplay: <span>{locale === 'el' ? '0,121121112...' : '0.121121112...'}</span>, 
      isRational: false, 
      reason: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el'
            ? 'Έχει άπειρα ψηφία με κανόνα (τα 1 αυξάνονται), αλλά ΔΕΝ επαναλαμβάνεται σταθερή ομάδα ψηφίων (δεν έχει περίοδο).'
            : 'Has infinite digits following a pattern, but NO repeating periodic block exists.'}
        </span>
      )
    }
  ], [locale]);

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/05-ritoi-arritoi-ask"
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

        {/* 1. ΡΗΤΟΙ ΑΡΙΘΜΟΙ & ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ */}
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
                {cur.rationalDef1} <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />, {cur.rationalDef2}
              </p>
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.divisionOutcomes}
              </p>

              <div className="space-y-3 min-w-0">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1 min-w-0">
                  <strong className="text-indigo-950 block break-words">{cur.terminatingTitle}</strong>
                  <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.terminatingDesc}
                  </p>
                  <div className="font-mono text-xs sm:text-sm font-bold text-indigo-800 pt-1 flex items-center flex-wrap gap-1">
                    <Frac num="3" den="4" /> ＝ {locale === 'el' ? '0,75' : '0.75'} &nbsp;|&nbsp; 
                    <Frac num="7" den="10" /> ＝ {locale === 'el' ? '0,7' : '0.7'} &nbsp;|&nbsp; 
                    <Frac num="1" den="8" /> ＝ {locale === 'el' ? '0,125' : '0.125'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1 min-w-0">
                  <strong className="text-amber-950 block break-words">{cur.periodicTitle}</strong>
                  <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.periodicDesc}
                  </p>
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-800 pt-1 flex items-center flex-wrap gap-1">
                    <Frac num="1" den="3" /> ＝ {locale === 'el' ? '0,333...' : '0.333...'} &nbsp;|&nbsp; 
                    <Frac num="1" den="6" /> ＝ {locale === 'el' ? '0,1666...' : '0.1666...'} &nbsp;|&nbsp; 
                    <Frac num="2" den="11" /> ＝ {locale === 'el' ? '0,1818...' : '0.1818...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Περίοδος & Συμβολισμός */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.periodBoxTitle)}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm min-w-0">
                <p className="break-words [overflow-wrap:anywhere]">
                  {cur.periodDef}
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block break-words">
                    {toCleanUppercase(cur.notationSubTitle)}
                  </span>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.notationDesc}
                  </p>
                  <div className="font-mono text-sm sm:text-base font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-center">
                    <span>{locale === 'el' ? '0,333...' : '0.333...'} ＝ {locale === 'el' ? '0,' : '0.'}<span className="border-t-2 border-indigo-600 pt-0.5">3</span></span>
                    <span>{locale === 'el' ? '1,2727...' : '1.2727...'} ＝ {locale === 'el' ? '1,' : '1.'}<span className="border-t-2 border-indigo-600 pt-0.5">27</span></span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 min-w-0">
                  <strong className="text-slate-900 block break-words">{cur.pureVsMixedTitle}</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li className="break-words [overflow-wrap:anywhere]">
                      <strong>{cur.pureDefLabel}</strong> {cur.pureDefText}
                    </li>
                    <li className="break-words [overflow-wrap:anywhere]">
                      <strong>{cur.mixedDefLabel}</strong> {cur.mixedDefText}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΙΧΝΕΥΤΗΣ ΠΕΡΙΟΔΟΥ & ΔΙΑΙΡΕΣΗ */}
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

          {/* Προκαθορισμένα Κουμπιά */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1 break-words">
              {toCleanUppercase(cur.examplesLabel)}
            </span>
            {[
              { labelEl: '1/3 (Καθαρός)', labelEn: '1/3 (Pure)', n: '1', d: '3' },
              { labelEl: '1/6 (Μικτός)', labelEn: '1/6 (Mixed)', n: '1', d: '6' },
              { labelEl: '1/7 (6ψήφια περίοδος)', labelEn: '1/7 (6-digit period)', n: '1', d: '7' },
              { labelEl: '3/8 (Πεπερασμένος)', labelEn: '3/8 (Terminating)', n: '3', d: '8' },
              { labelEl: '4/11 (Καθαρός)', labelEn: '4/11 (Pure)', n: '4', d: '11' },
              { labelEl: '7/12 (Μικτός)', labelEn: '7/12 (Mixed)', n: '7', d: '12' }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setNumInput(item.n); setDenInput(item.d); }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono break-words"
              >
                {locale === 'el' ? item.labelEl : item.labelEn}
              </button>
            ))}
          </div>

          {/* Εισαγωγή Κλάσματος */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 max-w-lg min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 shrink-0">
              {toCleanUppercase(cur.fractionLabel)}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder={cur.numPlaceholder}
                className="w-24 h-12 px-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 font-mono text-center text-lg font-bold text-slate-900 outline-none box-border"
              />
              <span className="text-2xl font-bold text-slate-400">/</span>
              <input
                type="number"
                value={denInput}
                onChange={(e) => setDenInput(e.target.value)}
                placeholder={cur.denPlaceholder}
                className="w-24 h-12 px-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 font-mono text-center text-lg font-bold text-slate-900 outline-none box-border"
              />
            </div>
          </div>

          {/* Οθόνη Ανάλυσης */}
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-8 text-white space-y-6 shadow-inner min-w-0">
            {decAnalysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2 break-words">
                <span>⚠️</span>
                <span>{decAnalysis.error}</span>
              </div>
            ) : (
              <div className="space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1 break-words">
                      {toCleanUppercase(cur.decFormLabel)}
                    </span>
                    <div className="text-xl sm:text-3xl md:text-4xl font-black font-mono text-amber-300 flex items-center flex-wrap gap-1.5 break-all">
                      <Frac num={decAnalysis.simplifiedNum} den={decAnalysis.simplifiedDen} />
                      <span>＝</span>
                      <PeriodicNumber
                        intPart={decAnalysis.intPart}
                        nonPeriodic={decAnalysis.nonPeriodic}
                        period={decAnalysis.period}
                        locale={locale}
                      />
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider break-words ${
                        decAnalysis.isTerminating
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {toCleanUppercase(decAnalysis.isTerminating ? cur.badgeTerminating : cur.badgePeriodic)}
                    </span>
                  </div>
                </div>

                {/* Ανάλυση Στοιχείων */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm min-w-0">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 min-w-0">
                    <span className="text-xs text-slate-400 font-sans block uppercase break-words">
                      {toCleanUppercase(cur.intPartLabel)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white break-all">{decAnalysis.intPart}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 min-w-0">
                    <span className="text-xs text-slate-400 font-sans block uppercase break-words">
                      {toCleanUppercase(cur.nonPeriodLabel)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-indigo-300 break-all">
                      {decAnalysis.nonPeriodic ? decAnalysis.nonPeriodic : cur.noneText}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 min-w-0">
                    <span className="text-xs text-slate-400 font-sans block uppercase break-words">
                      {toCleanUppercase(cur.periodLabel)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-amber-300 break-all">
                      {decAnalysis.period ? decAnalysis.period : cur.noPeriodText}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 font-sans break-words [overflow-wrap:anywhere]">
                  💡 <strong>{cur.typeLabel}</strong> {decAnalysis.typeDesc}.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. ΑΡΡΗΤΟΙ ΑΡΙΘΜΟΙ & ΠΡΑΓΜΑΤΙΚΟΙ ΑΡΙΘΜΟΙ */}
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
                <strong className="text-purple-950 block text-base sm:text-lg break-words">{cur.irrationalDefTitle}</strong>
                <p className="text-slate-700 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {cur.irrationalDefText}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-sans break-words [overflow-wrap:anywhere]">
                  {cur.irrationalSubtext}
                </p>
              </div>

              <div className="space-y-2 text-sm sm:text-base min-w-0">
                <strong className="text-slate-900 block break-words">{cur.irrationalExamplesTitle}</strong>
                <ul className="space-y-2 list-disc pl-5 text-slate-600 font-mono text-xs sm:text-sm">
                  <li className="flex items-center flex-wrap gap-1">
                    <span className="font-bold text-indigo-700"><Sqrt>2</Sqrt></span>
                    <span>＝ {locale === 'el' ? '1,4142135623...' : '1.4142135623...'} {cur.root2Diag}</span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span className="font-bold text-indigo-700"><Sqrt>3</Sqrt></span>
                    <span>＝ {locale === 'el' ? '1,7320508075...' : '1.7320508075...'}</span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span className="font-bold text-indigo-700"><Sqrt>5</Sqrt></span>
                    <span>＝ {locale === 'el' ? '2,2360679774...' : '2.2360679774...'}</span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span className="font-bold text-indigo-700">π</span>
                    <span>＝ {locale === 'el' ? '3,1415926535...' : '3.1415926535...'} {cur.piRatio}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Το Δέντρο των Πραγματικών Αριθμών */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.realsBoxTitle)}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm min-w-0">
                <p className="break-words [overflow-wrap:anywhere]">
                  {cur.realsIntro}
                </p>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center font-mono font-bold text-slate-900 text-sm sm:text-base space-y-2 min-w-0">
                  <div className="text-indigo-700 break-words">{cur.realsFormula}</div>
                  <div className="text-xs text-slate-500 font-sans font-normal pt-1 break-words [overflow-wrap:anywhere]">
                    {cur.realsLineNote}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span className="mr-1">⚠️</span>
                  <strong>{locale === 'el' ? 'Σημαντικό:' : 'Important:'}</strong>{' '}
                  <span>{cur.realsWarningPrefix}</span>{' '}
                  <span className="inline-flex items-center flex-wrap gap-1 font-mono font-bold text-amber-950 align-middle">
                    <span>({locale === 'el' ? 'π.χ.' : 'e.g.'}</span>
                    <Sqrt>2</Sqrt><span>,</span>
                    <Sqrt>3</Sqrt><span>,</span>
                    <Sqrt>5</Sqrt><span>,</span>
                    <Sqrt>6</Sqrt><span>,</span>
                    <Sqrt>7</Sqrt><span>,</span>
                    <Sqrt>8</Sqrt><span>,</span>
                    <Sqrt>10</Sqrt><span>)</span>
                  </span>{' '}
                  <span>{cur.realsWarningSuffix}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΞΙΝΟΜΗΤΗΣ ΑΡΙΘΜΩΝ */}
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

          {/* Κουμπιά Επιλογής Αριθμών */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 min-w-0">
            {classificationSamples.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSampleIdx(idx)}
                className={`p-3 rounded-2xl border text-sm font-mono font-bold transition-all touch-manipulation flex items-center justify-center min-w-0 break-words ${
                  selectedSampleIdx === idx
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.renderDisplay}
              </button>
            ))}
          </div>

          {/* Κάρτα Αποτελέσματος Ταξινόμησης */}
          {(() => {
            const current = classificationSamples[selectedSampleIdx];
            return (
              <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white space-y-4 shadow-inner min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1 break-words">
                      {toCleanUppercase(cur.selectedNumLabel)}
                    </span>
                    <div className="text-xl sm:text-3xl font-black font-mono text-amber-300 flex items-center flex-wrap gap-1">
                      {current.renderDisplay}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider break-words ${
                        current.isRational
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {toCleanUppercase(current.isRational ? cur.rationalBadge : cur.irrationalBadge)}
                    </span>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans break-words [overflow-wrap:anywhere]">
                  <strong>{cur.reasonLabel}</strong> {current.reason}
                </div>
              </div>
            );
          })()}
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
                <span>{cur.ex1Heading}</span>
                <Frac num="5" den="6" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex1Step1}</div>
                <div className="pl-3 text-slate-500">5 : 6 ＝ {locale === 'el' ? '0,8333...' : '0.8333...'}</div>
                <div className="break-words">{cur.ex1Step2}</div>
                <div className="break-words">{cur.ex1Step3}</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1">
                  <span>{cur.ex1Result}</span>
                  <Frac num="5" den="6" />
                  <span>＝ {locale === 'el' ? '0,8' : '0.8'}<span className="border-t-2 border-indigo-700 pt-0.5">3</span></span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex2Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex2Heading}</span>
                <Sqrt>16</Sqrt><span>,</span>
                <Sqrt>18</Sqrt><span>,</span>
                <Sqrt>49</Sqrt>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <Sqrt>16</Sqrt><span>＝ 4 ＝ </span><Frac num="4" den="1" />
                  <span className="ml-1 text-slate-600 font-sans">{cur.ex2Step1}</span>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <Sqrt>18</Sqrt><span>＝ {locale === 'el' ? '4,24264...' : '4.24264...'}</span>
                  <span className="ml-1 text-slate-600 font-sans">{cur.ex2Step2}</span>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <Sqrt>49</Sqrt><span>＝ 7 ＝ </span><Frac num="7" den="1" />
                  <span className="ml-1 text-slate-600 font-sans">{cur.ex2Step3}</span>
                </div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1 pt-1">
                  <span>{cur.ex2Result}</span>
                  <Sqrt>18</Sqrt>.
                </div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex3Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex3Heading}</span>
                <Frac num="7" den="40" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex3Step1}</div>
                <div className="break-words">{cur.ex3Step2}</div>
                <div className="break-words">{cur.ex3Step3}</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1">
                  <span>{cur.ex3Result}</span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex4Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono break-words [overflow-wrap:anywhere]">
                {cur.ex4Heading}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex4Step1}</div>
                <div className="break-words">{cur.ex4Step2}</div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}