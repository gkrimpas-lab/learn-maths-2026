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

// Καθαρισμός κεφαλαίων ελληνικών (χωρίς τόνους, με διατήρηση Β' όπου υπάρχει)
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

// Component Απλού Κλάσματος με ακριβή κεντρική ευθυγράμμιση στη γραμμή κειμένου
const Frac = ({ num, den, small = false, className = '' }) => {
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
    <span
      className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}
    >
      {isNegative && <span className="mr-0.5 text-sm sm:text-base font-bold select-none">－</span>}
      <span
        className={`inline-flex flex-col items-stretch justify-center text-center leading-none ${
          small ? 'text-[0.8em]' : 'text-[0.86em]'
        }`}
      >
        <span className="px-1 pb-[2px] whitespace-nowrap">{renderContent(num)}</span>
        <span className="w-full border-t border-current block" />
        <span className="px-1 pt-[2px] whitespace-nowrap">{renderContent(den)}</span>
      </span>
    </span>
  );
};

// Component Σύνθετου Κλάσματος με ευδιάκριτη κύρια γραμμή
const ComplexFrac = ({ num, den, className = '' }) => {
  return (
    <span
      className={`inline-flex flex-col items-stretch justify-center align-middle mx-1 font-mono text-center leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="px-1.5 pb-1 whitespace-nowrap">{num}</span>
      <span className="w-full border-t-[2.4px] border-current block" />
      <span className="px-1.5 pt-1 whitespace-nowrap">{den}</span>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας με vinculum
const Radical = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-stretch align-middle mx-0.5 font-mono font-semibold shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 14 24"
        className="w-[0.6em] self-stretch shrink-0 text-current overflow-visible"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        role="img"
        aria-label="Square root symbol"
      >
        <path d="M 1 13.5 L 4 13.5 L 7.5 22.8 L 13.6 0.8" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 pb-[1px] leading-none inline-flex items-center text-[0.95em]">
        {children}
      </span>
    </span>
  );
};

// Component Δύναμης (Base & Exponent) χωρίς Unicode εκθέτες
const Pow = ({ base, exp, parens = false, className = '' }) => {
  return (
    <span className={`inline-flex items-baseline font-mono leading-none mx-[1px] ${className}`}>
      {parens ? (
        <span className="inline-flex items-center">
          <span>(</span>
          {base}
          <span>)</span>
        </span>
      ) : (
        <span>{base}</span>
      )}
      <sup className="text-[0.72em] font-bold leading-none ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
};

// Component εμφάνισης περιοδικού δεκαδικού με καθαρή οριζόντια γραμμή πάνω από την περίοδο
const PeriodicNumber = ({ intPart, nonPeriodic = '', period = '', locale = 'el', variant = 'dark' }) => {
  const decSep = locale === 'el' ? ',' : '.';
  const periodStyle =
    variant === 'dark'
      ? 'border-t-2 border-amber-400 text-amber-300'
      : 'border-t-2 border-indigo-700 text-indigo-800';

  return (
    <span className="inline-flex items-baseline font-mono font-bold whitespace-nowrap">
      <span>{intPart}</span>
      {(nonPeriodic !== '' || period !== '') && <span>{decSep}</span>}
      {nonPeriodic !== '' && <span>{nonPeriodic}</span>}
      {period !== '' && (
        <span className={`${periodStyle} pt-[1px] px-[1px] ml-[1px] inline-block leading-none`}>
          {period}
        </span>
      )}
    </span>
  );
};

// Αλγόριθμος εύρεσης περιόδου κλάσματος (Long Division with Remainders Map)
function fractionToDecimalAnalysis(numerator, denominator, locale = 'el') {
  const rawNum = parseInt(numerator, 10);
  const rawDen = parseInt(denominator, 10);

  if (isNaN(rawNum) || isNaN(rawDen)) {
    return { error: locale === 'el' ? 'Συμπλήρωσε έγκυρους ακεραίους αριθμούς.' : 'Please enter valid integers.' };
  }
  if (rawDen === 0) {
    return { error: locale === 'el' ? 'Ο παρονομαστής δεν μπορεί να είναι 0.' : 'Denominator cannot be 0.' };
  }

  const isNeg = (rawNum < 0 && rawDen > 0) || (rawNum > 0 && rawDen < 0);
  const absNum = Math.abs(rawNum);
  const absDen = Math.abs(rawDen);

  const g = gcd(absNum, absDen);
  const simpNum = absNum / g;
  const simpDen = absDen / g;
  const isSimplified = g > 1;

  const intPart = Math.floor(simpNum / simpDen);
  let remainder = simpNum % simpDen;
  const decSep = locale === 'el' ? ',' : '.';
  const signStr = isNeg ? '－' : '';
  const fullInt = `${signStr}${intPart}`;

  if (remainder === 0) {
    return {
      isNeg,
      origNum: absNum,
      origDen: absDen,
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isSimplified,
      gcdVal: g,
      isTerminating: true,
      intPart: fullInt,
      nonPeriodic: '',
      period: '',
      fullString: fullInt,
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

  if (startIndex === -1) {
    return {
      isNeg,
      origNum: absNum,
      origDen: absDen,
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isSimplified,
      gcdVal: g,
      isTerminating: true,
      intPart: fullInt,
      nonPeriodic: decimalDigits,
      period: '',
      fullString: `${fullInt}${decSep}${decimalDigits}`,
      typeDesc: locale === 'el'
        ? 'Πεπερασμένος Δεκαδικός (ο παρονομαστής περιέχει μόνο πρώτους παράγοντες 2 ή 5)'
        : 'Terminating Decimal (denominator prime factors contain only 2 or 5)'
    };
  } else {
    const nonPeriodicPart = decimalDigits.slice(0, startIndex);
    const periodPart = decimalDigits.slice(startIndex);
    const isPure = nonPeriodicPart.length === 0;

    return {
      isNeg,
      origNum: absNum,
      origDen: absDen,
      simplifiedNum: simpNum,
      simplifiedDen: simpDen,
      isSimplified,
      gcdVal: g,
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

// Συγκεντρωτικό Λεξικό I18N (el / en)
const I18N = {
  el: {
    pageTitle: "Ρητοί, Άρρητοι & Περιοδικοί Δεκαδικοί | Β' Γυμνασίου",
    pageDesc: "Θεωρία, δεκαδικές αναπαραστάσεις, η έννοια της περιόδου, καθαροί και μικτοί περιοδικοί αριθμοί με διαδραστικά εργαστήρια για τη Β' Γυμνασίου.",
    schemaName: "Ρητοί και Άρρητοι Αριθμοί — Θεωρία & Διαδραστικά Εργαστήρια",
    educationalLevel: "Β' Γυμνασίου",
    backText: "Β' Γυμνασίου",
    actionBtn: "ΑΣΚΗΣΕΙΣ",
    badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 5",
    headerTitle: "ΡΗΤΟΙ ΚΑΙ ΑΡΡΗΤΟΙ ΑΡΙΘΜΟΙ",
    headerDesc: "Εξερευνούμε τη δεκαδική μορφή των αριθμών: πότε ένα κλάσμα δίνει πεπερασμένο δεκαδικό, τι είναι η περίοδος ενός περιοδικού αριθμού και ποιοι αριθμοί ονομάζονται άρρητοι.",

    // Ενότητα 1
    sec1Num: "1",
    sec1Title: "Η Δεκαδική Μορφή των Ρητών Αριθμών",
    rationalDef1: "Ρητός αριθμός (σύνολο ℚ) λέγεται κάθε αριθμός που μπορεί να γραφτεί στη μορφή",
    rationalDef2: "όπου μ, ν ακέραιοι και ν ≠ 0.",
    divisionOutcomes: "Όταν διαιρέσουμε τον αριθμητή με τον παρονομαστή ενός κλάσματος, προκύπτει πάντοτε μία από τις δύο παρακάτω μορφές:",
    terminatingTitle: "1. Πεπερασμένος Δεκαδικός Αριθμός:",
    terminatingDesc: "Η διαίρεση τελειώνει (υπόλοιπο 0). Συμβαίνει όταν ο παρονομαστής του ανάγωγου κλάσματος αναλύεται σε πρώτους παράγοντες που περιέχουν μόνο το 2, μόνο το 5 ή και τα δύο.",
    periodicTitle: "2. Άπειρος Περιοδικός Δεκαδικός Αριθμός:",
    periodicDesc: "Η διαίρεση δεν τελειώνει ποτέ, αλλά ένα ψηφίο ή μια ομάδα ψηφίων επαναλαμβάνεται επ' άπειρον. Συμβαίνει όταν ο παρονομαστής περιέχει κι άλλους πρώτους παράγοντες (π.χ. 3, 7, 11).",
    periodBoxTitle: "ΤΙ ΕΙΝΑΙ Η ΠΕΡΙΟΔΟΣ ΚΑΙ ΠΩΣ ΣΥΜΒΟΛΙΖΕΤΑΙ;",
    periodDef: "Περίοδος ενός περιοδικού δεκαδικού αριθμού ονομάζεται το ψηφίο ή η ομάδα των ψηφίων που επαναλαμβάνεται επ' άπειρον.",
    notationSubTitle: "ΣΥΜΒΟΛΙΣΜΟΣ ΜΕ ΟΡΙΖΟΝΤΙΑ ΓΡΑΜΜΗ",
    notationDesc: "Αντί να γράφουμε αποσιωπητικά (...), τοποθετούμε μια οριζόντια γραμμή πάνω από την περίοδο:",
    pureVsMixedTitle: "Καθαροί vs Μικτοί Περιοδικοί:",
    pureDefLabel: "Καθαρός (Απλός) Περιοδικός:",
    mixedDefLabel: "Μικτός Περιοδικός:",

    // Ενότητα 2 (Εργαστήριο 1)
    sec2Num: "2",
    sec2Title: "🛠️ Εργαστήριο 1: Μετατροπέας Κλάσματος σε Δεκαδικό & Ανιχνευτής Περιόδου",
    sec2Desc: "Γράψε έναν αριθμητή και έναν παρονομαστή ή διάλεξε ένα έτοιμο παράδειγμα για να δεις πρώτα το αρχικό κλάσμα, την απλοποίησή του και τη μετατροπή σε δεκαδικό:",
    examplesLabel: "ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    fractionLabel: "ΚΛΑΣΜΑ:",
    numPlaceholder: "Αριθμητής",
    denPlaceholder: "Παρονομαστής",
    decFormLabel: "ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ & ΑΠΛΟΠΟΙΗΣΗ",
    simplifiedNote: "Απλοποίηση με Μ.Κ.Δ. =",
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
    irrationalDefText: "Άρρητος αριθμός ονομάζεται κάθε αριθμός που δεν μπορεί να γραφτεί ως κλάσμα ακεραίων.",
    irrationalSubtext: "Η δεκαδική του αναπαράσταση έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο (δεν επαναλαμβάνεται σταθερή ομάδα ψηφίων).",
    irrationalExamplesTitle: "Κλασικά Παραδείγματα Άρρητων Αριθμών:",
    root2Diag: "(η διαγώνιος τετραγώνου πλευράς 1)",
    piRatio: "(ο λόγος μήκους κύκλου προς διάμετρο)",
    realsBoxTitle: "ΤΟ ΣΥΝΟΛΟ ΤΩΝ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ (ℝ)",
    realsIntro: "Όλοι οι ρητοί αριθμοί μαζί με όλους τους άρρητους αριθμούς αποτελούν το σύνολο των Πραγματικών Αριθμών (ℝ):",
    realsFormula: "ΠΡΑΓΜΑΤΙΚΟΙ (ℝ) ＝ ΡΗΤΟΙ (ℚ) ∪ ΑΡΡΗΤΟΙ",
    realsLineNote: "Κάθε σημείο της ευθείας των αριθμών αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό (άξονας πραγματικών αριθμών).",
    realsWarningPrefix: "Οι τετραγωνικές ρίζες όλων των φυσικών αριθμών που δεν είναι τέλεια τετράγωνα",
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
    ex1Heading: "Να μετατραπεί το κλάσμα σε δεκαδικό και να βρεθεί η περίοδος:",
    ex1Step1: "1. Εκτελούμε τη διαίρεση 5 : 6",
    ex1Step2: "2. Το ψηφίο 8 δεν επαναλαμβάνεται (μη περιοδικό μέρος).",
    ex1Step3: "3. Το ψηφίο 3 επαναλαμβάνεται επ' άπειρον (περίοδος).",
    ex1Result: "➔ Μικτός Περιοδικός Δεκαδικός:",
    ex2Tag: "ΠΑΡΑΔΕΙΓΜΑ 2: ΕΛΕΓΧΟΣ ΑΡΡΗΤΟΥ ΑΠΟ ΡΙΖΙΚΟ",
    ex2Heading: "Ποιοι από τους παρακάτω αριθμούς είναι άρρητοι;",
    ex2Result: "Μοναδικός άρρητος είναι το",
    ex3Tag: "ΠΑΡΑΔΕΙΓΜΑ 3: ΠΡΟΒΛΕΨΗ ΕΙΔΟΥΣ ΔΕΚΑΔΙΚΟΥ ΧΩΡΙΣ ΔΙΑΙΡΕΣΗ",
    ex3Heading: "Χωρίς διαίρεση, να βρεθεί αν είναι πεπερασμένος ή περιοδικός:",
    ex3Step1: "1. Το κλάσμα είναι ανάγωγο (Μ.Κ.Δ.(7, 40) ＝ 1).",
    ex3Step3: "3. Επειδή περιέχει ΜΟΝΟ πρώτους παράγοντες 2 και 5:",
    ex4Tag: "ΠΑΡΑΔΕΙΓΜΑ 4: ΔΙΑΚΡΙΣΗ ΚΑΘΑΡΟΥ ΚΑΙ ΜΙΚΤΟΥ ΠΕΡΙΟΔΙΚΟΥ",
    ex4Heading: "Να χαρακτηριστούν οι αριθμοί: α ＝ 2,444... και β ＝ 0,12555..."
  },
  en: {
    pageTitle: "Rational, Irrational & Periodic Decimals | Grade 8",
    pageDesc: "Theory, decimal representations, the concept of period, pure and mixed periodic numbers with interactive laboratories for Grade 8.",
    schemaName: "Rational and Irrational Numbers — Theory & Interactive Labs",
    educationalLevel: "Grade 8",
    backText: "Grade 8",
    actionBtn: "EXERCISES",
    badgeUnit: "GRADE 8 • UNIT 5",
    headerTitle: "RATIONAL AND IRRATIONAL NUMBERS",
    headerDesc: "Explore the decimal representation of numbers: when a fraction yields a terminating decimal, what periodic decimals are, and which numbers are irrational.",

    // Section 1
    sec1Num: "1",
    sec1Title: "Decimal Representation of Rational Numbers",
    rationalDef1: "A rational number (set ℚ) is any number that can be written in the form",
    rationalDef2: "where m, n are integers and n ≠ 0.",
    divisionOutcomes: "Dividing the numerator by the denominator of any fraction always yields one of the following two decimal forms:",
    terminatingTitle: "1. Terminating Decimal Number:",
    terminatingDesc: "Division terminates (remainder 0). Occurs when the simplified denominator factors into prime factors containing only 2, only 5, or both.",
    periodicTitle: "2. Infinite Periodic (Repeating) Decimal Number:",
    periodicDesc: "Division never terminates, but a single digit or block of digits repeats indefinitely. Occurs when the denominator contains other prime factors (e.g. 3, 7, 11).",
    periodBoxTitle: "WHAT IS THE PERIOD AND HOW IS IT NOTATED?",
    periodDef: "The period of a repeating decimal is the digit or group of digits that repeats endlessly.",
    notationSubTitle: "OVERLINE NOTATION (VINCULUM)",
    notationDesc: "Instead of writing ellipsis (...), we place an overline directly above the repeating period:",
    pureVsMixedTitle: "Pure vs Mixed Periodic Decimals:",
    pureDefLabel: "Pure Periodic Decimal:",
    mixedDefLabel: "Mixed Periodic Decimal:",

    // Section 2
    sec2Num: "2",
    sec2Title: "🛠️ Lab 1: Fraction to Decimal Converter & Period Detector",
    sec2Desc: "Type a numerator and denominator or select a preset to see the initial fraction, its simplification, and the automatic period detection:",
    examplesLabel: "PRESETS:",
    fractionLabel: "FRACTION:",
    numPlaceholder: "Numerator",
    denPlaceholder: "Denominator",
    decFormLabel: "DECIMAL FORM & SIMPLIFICATION",
    simplifiedNote: "Simplified by GCD =",
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
    irrationalDefText: "An irrational number is any number that cannot be expressed as a fraction of integers.",
    irrationalSubtext: "Its decimal representation has infinitely many digits with no repeating period.",
    irrationalExamplesTitle: "Classic Examples of Irrational Numbers:",
    root2Diag: "(the diagonal of a unit square)",
    piRatio: "(the ratio of circumference to diameter)",
    realsBoxTitle: "THE SET OF REAL NUMBERS (ℝ)",
    realsIntro: "All rational numbers combined with all irrational numbers constitute the set of Real Numbers (ℝ):",
    realsFormula: "REALS (ℝ) ＝ RATIONALS (ℚ) ∪ IRRATIONALS",
    realsLineNote: "Every point on the number line corresponds to a unique real number (real coordinate axis).",
    realsWarningPrefix: "Square roots of natural numbers that are NOT perfect squares",
    realsWarningSuffix: "are irrational numbers!",

    // Section 4
    sec4Num: "4",
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
    ex1Heading: "Convert the fraction into a decimal and determine its period:",
    ex1Step1: "1. Perform division 5 : 6",
    ex1Step2: "2. Digit 8 does not repeat (non-periodic part).",
    ex1Step3: "3. Digit 3 repeats endlessly (period).",
    ex1Result: "➔ Mixed Periodic Decimal:",
    ex2Tag: "EXAMPLE 2: TESTING IRRATIONALITY FROM RADICALS",
    ex2Heading: "Which of the following numbers are irrational?",
    ex2Result: "The only irrational number is",
    ex3Tag: "EXAMPLE 3: PREDICTING DECIMAL TYPE WITHOUT DIVISION",
    ex3Heading: "Without division, determine if it is terminating or repeating:",
    ex3Step1: "1. The fraction is in lowest terms (GCD(7, 40) ＝ 1).",
    ex3Step3: "3. Since it contains ONLY prime factors 2 and 5:",
    ex4Tag: "EXAMPLE 4: DISTINGUISHING PURE AND MIXED PERIODIC",
    ex4Heading: "Classify the numbers: a ＝ 2.444... and b ＝ 0.12555..."
  }
};

export default function RitoiArritoiTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const cur = I18N[locale];

  // State Εργαστηρίου 1 (Προεπιλογή 33 / 12 ώστε να φαίνεται αμέσως και η απλοποίηση)
  const [numInput, setNumInput] = useState('33');
  const [denInput, setDenInput] = useState('12');

  // State Εργαστηρίου 2
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);

  const decAnalysis = useMemo(() => {
    return fractionToDecimalAnalysis(numInput, denInput, locale);
  }, [numInput, denInput, locale]);

  // Δείγματα για το Εργαστήριο 2 (με <Frac />, <Radical />, <Pow /> και <PeriodicNumber />)
  const classificationSamples = useMemo(() => [
    {
      label: '3/4',
      renderDisplay: <Frac num="3" den="4" />,
      isRational: true,
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Γράφεται ως κλάσμα ακεραίων (' : 'Can be written as a fraction of integers ('}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="3" den="4" />
            <span>＝ {locale === 'el' ? '0,75' : '0.75'}</span>
          </span>
          <span>{locale === 'el' ? ', πεπερασμένος δεκαδικός).' : ', terminating decimal).'}</span>
        </span>
      )
    },
    {
      label: '√2',
      renderDisplay: <Radical>2</Radical>,
      isRational: false,
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Η ρίζα' : 'The root'}</span>
          <Radical>2</Radical>
          <span>
            {locale === 'el'
              ? 'δεν είναι ακέραιος (1,41421356...). Έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο.'
              : 'is not an integer (1.41421356...). It has infinitely many non-repeating digits.'}
          </span>
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
          <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <span>{locale === 'el' ? '0,333... ＝' : '0.333... ＝'}</span>
            <PeriodicNumber intPart="0" period="3" locale={locale} variant="dark" />
          </span>
          <span>).</span>
        </span>
      )
    },
    {
      label: 'π',
      renderDisplay: <span>π</span>,
      isRational: false,
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>
            {locale === 'el'
              ? 'Ο αριθμός π ＝ 3,14159265... έχει άπειρα ψηφία χωρίς περίοδο και δεν γράφεται ως κλάσμα ακεραίων.'
              : 'The number π ＝ 3.14159265... has infinite non-repeating decimal digits and cannot be expressed as a fraction of integers.'}
          </span>
        </span>
      )
    },
    {
      label: '√25',
      renderDisplay: <Radical>25</Radical>,
      isRational: true,
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Επειδή 25 ＝' : 'Since 25 ＝'}</span>
          <Pow base="5" exp="2" />
          <span>, {locale === 'el' ? 'ισχύει' : 'it holds:'}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Radical>25</Radical>
            <span>＝ 5 ＝</span>
            <Frac num="5" den="1" />
          </span>
          <span>({locale === 'el' ? 'ρητός, φυσικός αριθμός' : 'rational, natural number'}).</span>
        </span>
      )
    },
    {
      label: '-7',
      renderDisplay: <span>－7</span>,
      isRational: true,
      reason: (
        <span className="flex flex-wrap items-center gap-1">
          <span>{locale === 'el' ? 'Κάθε ακέραιος είναι και ρητός, καθώς' : 'Every integer is rational, as'}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>－7 ＝</span>
            <Frac num="-7" den="1" />
          </span>
          <span>.</span>
        </span>
      )
    },
    {
      label: locale === 'el' ? '0,121121112...' : '0.121121112...',
      renderDisplay: <span className="whitespace-nowrap">{locale === 'el' ? '0,121121112...' : '0.121121112...'}</span>,
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

  // Δυναμικό JSON-LD Schema
  const baseUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';
  const pageUrl = `${baseUrl}/b-gymnasiou/05-ritoi-arritoi`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: cur.schemaName,
    description: cur.pageDesc,
    url: pageUrl,
    inLanguage: locale,
    educationalLevel: cur.educationalLevel,
    typicalAgeRange: '13-14',
    isAccessibleForFree: true,
    provider: {
      '@id': 'https://learnmaths.gr/#organization'
    }
  };

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
          locale={locale}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{cur.actionBtn}</span>
        </Link>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-4 min-w-0">
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
          <div className="border-b border-slate-100 pb-4 min-w-0">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec1Num}
              </span>
              <span>{cur.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed min-w-0">
            <div className="space-y-4 min-w-0">
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.rationalDef1}{' '}
                <span className="inline-flex items-center align-middle whitespace-nowrap">
                  <Frac num={locale === 'el' ? 'μ' : 'm'} den={locale === 'el' ? 'ν' : 'n'} />
                  <span>,</span>
                </span>{' '}
                {cur.rationalDef2}
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
                  <div className="font-mono text-xs sm:text-sm font-bold text-indigo-800 pt-1 flex items-center flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="3" den="4" />
                      <span>＝ {locale === 'el' ? '0,75' : '0.75'}</span>
                    </span>
                    <span className="text-indigo-300">|</span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="7" den="10" />
                      <span>＝ {locale === 'el' ? '0,7' : '0.7'}</span>
                    </span>
                    <span className="text-indigo-300">|</span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="1" den="8" />
                      <span>＝ {locale === 'el' ? '0,125' : '0.125'}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1 min-w-0">
                  <strong className="text-amber-950 block break-words">{cur.periodicTitle}</strong>
                  <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.periodicDesc}
                  </p>
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-800 pt-1 flex items-center flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="1" den="3" />
                      <span>＝ {locale === 'el' ? '0,333...' : '0.333...'}</span>
                    </span>
                    <span className="text-amber-300">|</span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="1" den="6" />
                      <span>＝ {locale === 'el' ? '0,1666...' : '0.1666...'}</span>
                    </span>
                    <span className="text-amber-300">|</span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Frac num="2" den="11" />
                      <span>＝ {locale === 'el' ? '0,1818...' : '0.1818...'}</span>
                    </span>
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
                    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                      <span>{locale === 'el' ? '0,333...' : '0.333...'} ＝</span>
                      <PeriodicNumber intPart="0" period="3" locale={locale} variant="light" />
                    </span>
                    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                      <span>{locale === 'el' ? '1,2727...' : '1.2727...'} ＝</span>
                      <PeriodicNumber intPart="1" period="27" locale={locale} variant="light" />
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 min-w-0">
                  <strong className="text-slate-900 block break-words">{cur.pureVsMixedTitle}</strong>
                  <ul className="list-disc pl-4 space-y-2 text-slate-600">
                    <li className="break-words [overflow-wrap:anywhere]">
                      <strong>{cur.pureDefLabel}</strong>{' '}
                      {locale === 'el' ? (
                        <span className="inline-flex flex-wrap items-baseline gap-1">
                          <span>Η περίοδος αρχίζει αμέσως μετά την υποδιαστολή, π.χ.</span>
                          <PeriodicNumber intPart="0" period="6" locale="el" variant="light" />
                          <span>ή</span>
                          <span className="inline-flex items-baseline whitespace-nowrap">
                            <PeriodicNumber intPart="2" period="15" locale="el" variant="light" />
                            <span>.</span>
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex flex-wrap items-baseline gap-1">
                          <span>The period begins immediately after the decimal point, e.g.</span>
                          <PeriodicNumber intPart="0" period="6" locale="en" variant="light" />
                          <span>or</span>
                          <span className="inline-flex items-baseline whitespace-nowrap">
                            <PeriodicNumber intPart="2" period="15" locale="en" variant="light" />
                            <span>.</span>
                          </span>
                        </span>
                      )}
                    </li>
                    <li className="break-words [overflow-wrap:anywhere]">
                      <strong>{cur.mixedDefLabel}</strong>{' '}
                      {locale === 'el' ? (
                        <span className="inline-flex flex-wrap items-baseline gap-1">
                          <span>Υπάρχει μη περιοδικό μέρος πριν ξεκινήσει η περίοδος, π.χ.</span>
                          <PeriodicNumber intPart="0" nonPeriodic="1" period="6" locale="el" variant="light" />
                          <span>(το 1 είναι μη περιοδικό, το 6 είναι η περίοδος).</span>
                        </span>
                      ) : (
                        <span className="inline-flex flex-wrap items-baseline gap-1">
                          <span>There is a non-repeating part before the period begins, e.g.</span>
                          <PeriodicNumber intPart="0" nonPeriodic="1" period="6" locale="en" variant="light" />
                          <span>(1 is non-repeating, 6 is the period).</span>
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΙΧΝΕΥΤΗΣ ΠΕΡΙΟΔΟΥ & ΔΙΑΙΡΕΣΗ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4 min-w-0">
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

          {/* Προκαθορισμένα Κουμπιά με κανονικά κλάσματα <Frac /> */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1 break-words">
              {toCleanUppercase(cur.examplesLabel)}
            </span>
            {[
              { labelEl: '(Απλοποίηση)', labelEn: '(Simplification)', n: '33', d: '12' },
              { labelEl: '(Καθαρός)', labelEn: '(Pure)', n: '1', d: '3' },
              { labelEl: '(Μικτός)', labelEn: '(Mixed)', n: '1', d: '6' },
              { labelEl: '(6ψήφια περίοδος)', labelEn: '(6-digit period)', n: '1', d: '7' },
              { labelEl: '(Πεπερασμένος)', labelEn: '(Terminating)', n: '3', d: '8' },
              { labelEl: '(Καθαρός)', labelEn: '(Pure)', n: '4', d: '11' },
              { labelEl: '(Μικτός)', labelEn: '(Mixed)', n: '7', d: '12' }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setNumInput(item.n); setDenInput(item.d); }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Frac num={item.n} den={item.d} small={true} />
                <span>{locale === 'el' ? item.labelEl : item.labelEn}</span>
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
                aria-label={cur.numPlaceholder}
                className="w-24 h-12 px-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 font-mono text-center text-lg font-bold text-slate-900 outline-none box-border"
              />
              <span className="text-2xl font-bold text-slate-400">/</span>
              <input
                type="number"
                value={denInput}
                onChange={(e) => setDenInput(e.target.value)}
                placeholder={cur.denPlaceholder}
                aria-label={cur.denPlaceholder}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3 min-w-0">
                  <div className="min-w-0 space-y-1.5">
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block break-words">
                      {toCleanUppercase(cur.decFormLabel)}
                    </span>

                    <div className="text-xl sm:text-3xl md:text-4xl font-black font-mono flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-white">
                        {decAnalysis.isNeg && <span>－</span>}
                        <Frac num={decAnalysis.origNum} den={decAnalysis.origDen} />
                      </span>

                      {decAnalysis.isSimplified && (
                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-indigo-300">
                          <span className="text-slate-500">＝</span>
                          {decAnalysis.isNeg && <span>－</span>}
                          <Frac num={decAnalysis.simplifiedNum} den={decAnalysis.simplifiedDen} />
                        </span>
                      )}

                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-amber-300">
                        <span className="text-slate-500">＝</span>
                        <PeriodicNumber
                          intPart={decAnalysis.intPart}
                          nonPeriodic={decAnalysis.nonPeriodic}
                          period={decAnalysis.period}
                          locale={locale}
                          variant="dark"
                        />
                      </span>
                    </div>

                    {decAnalysis.isSimplified && (
                      <div className="text-xs font-mono text-indigo-300/90 pt-0.5 break-words">
                        ✂️ {cur.simplifiedNote} {decAnalysis.gcdVal}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
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
          <div className="border-b border-slate-100 pb-4 min-w-0">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec3Num}
              </span>
              <span>{cur.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed min-w-0">
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
                  <li className="flex items-center flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span className="font-bold text-indigo-700"><Radical>2</Radical></span>
                      <span>＝ {locale === 'el' ? '1,4142135623...' : '1.4142135623...'}</span>
                    </span>
                    <span className="font-sans">{cur.root2Diag}</span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span className="font-bold text-indigo-700"><Radical>3</Radical></span>
                      <span>＝ {locale === 'el' ? '1,7320508075...' : '1.7320508075...'}</span>
                    </span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span className="font-bold text-indigo-700"><Radical>5</Radical></span>
                      <span>＝ {locale === 'el' ? '2,2360679774...' : '2.2360679774...'}</span>
                    </span>
                  </li>
                  <li className="flex items-center flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span className="font-bold text-indigo-700">π</span>
                      <span>＝ {locale === 'el' ? '3,1415926535...' : '3.1415926535...'}</span>
                    </span>
                    <span className="font-sans">{cur.piRatio}</span>
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
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>6</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>8</Radical><span>,</span></span>
                    <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical><span>)</span></span>
                  </span>{' '}
                  <span>{cur.realsWarningSuffix}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΞΙΝΟΜΗΤΗΣ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4 min-w-0">
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
                  <div className="shrink-0">
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
          <div className="border-b border-slate-100 pb-4 min-w-0">
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
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex1Heading}</span>
                <Frac num="5" den="6" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex1Step1}</div>
                <div className="pl-3 text-slate-500">5 : 6 ＝ {locale === 'el' ? '0,8333...' : '0.8333...'}</div>
                <div className="break-words">{cur.ex1Step2}</div>
                <div className="break-words">{cur.ex1Step3}</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1.5">
                  <span>{cur.ex1Result}</span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Frac num="5" den="6" />
                    <span>＝</span>
                    <PeriodicNumber intPart="0" nonPeriodic="8" period="3" locale={locale} variant="light" />
                  </span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex2Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex2Heading}</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Radical>16</Radical><span>,</span>
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Radical>18</Radical><span>,</span>
                </span>
                <Radical>49</Radical>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Radical>16</Radical><span>＝ 4 ＝</span><Frac num="4" den="1" />
                  </span>
                  <span className="ml-1 text-slate-600 font-sans inline-flex flex-wrap items-baseline gap-1">
                    <span>{locale === 'el' ? '1. Το 16 είναι τέλειο τετράγωνο (' : '1. 16 is a perfect square ('}</span>
                    <span className="inline-flex items-baseline whitespace-nowrap">
                      <Pow base="4" exp="2" />
                      <span>＝ 16)</span>
                    </span>
                    <span>➔ {locale === 'el' ? 'ΡΗΤΟΣ' : 'RATIONAL'}</span>
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Radical>18</Radical><span>＝ {locale === 'el' ? '4,24264...' : '4.24264...'}</span>
                  </span>
                  <span className="ml-1 text-slate-600 font-sans">
                    {locale === 'el'
                      ? '2. Το 18 ΔΕΝ είναι τέλειο τετράγωνο ➔ ΑΡΡΗΤΟΣ'
                      : '2. 18 is NOT a perfect square ➔ IRRATIONAL'}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Radical>49</Radical><span>＝ 7 ＝</span><Frac num="7" den="1" />
                  </span>
                  <span className="ml-1 text-slate-600 font-sans inline-flex flex-wrap items-baseline gap-1">
                    <span>{locale === 'el' ? '3. Το 49 είναι τέλειο τετράγωνο (' : '3. 49 is a perfect square ('}</span>
                    <span className="inline-flex items-baseline whitespace-nowrap">
                      <Pow base="7" exp="2" />
                      <span>＝ 49)</span>
                    </span>
                    <span>➔ {locale === 'el' ? 'ΡΗΤΟΣ' : 'RATIONAL'}</span>
                  </span>
                </div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1 pt-1">
                  <span>{cur.ex2Result}</span>
                  <span className="inline-flex items-center whitespace-nowrap">
                    <Radical>18</Radical><span>.</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex3Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center flex-wrap gap-1 break-words">
                <span>{cur.ex3Heading}</span>
                <Frac num="7" den="40" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex3Step1}</div>
                <div className="break-words flex flex-wrap items-baseline gap-1">
                  <span>
                    {locale === 'el'
                      ? '2. Αναλύουμε τον παρονομαστή 40 σε πρώτους παράγοντες: 40 ＝'
                      : '2. Factorize denominator 40: 40 ＝'}
                  </span>
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
                    <Pow base="2" exp="3" />
                    <span>· 5</span>
                  </span>
                </div>
                <div className="break-words">{cur.ex3Step3}</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap gap-1.5">
                  <span>
                    {locale === 'el' ? '➔ Είναι ΠΕΠΕΡΑΣΜΕΝΟΣ δεκαδικός (' : '➔ It is a TERMINATING decimal ('}
                  </span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Frac num="7" den="40" />
                    <span>＝ {locale === 'el' ? '0,175' : '0.175'}).</span>
                  </span>
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
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words flex flex-wrap items-baseline gap-1">
                  <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                    <span>• α ＝</span>
                    <PeriodicNumber intPart="2" period="4" locale={locale} variant="light" />
                  </span>
                  <span>
                    {locale === 'el'
                      ? ': Η περίοδος (4) ξεκινά αμέσως μετά την υποδιαστολή ➔ Καθαρός Περιοδικός.'
                      : ': Period (4) starts immediately after decimal point ➔ Pure Periodic.'}
                  </span>
                </div>
                <div className="break-words flex flex-wrap items-baseline gap-1">
                  <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                    <span>• β ＝</span>
                    <PeriodicNumber intPart="0" nonPeriodic="12" period="5" locale={locale} variant="light" />
                  </span>
                  <span>
                    {locale === 'el'
                      ? ': Υπάρχει το μη περιοδικό μέρος (12) πριν την περίοδο (5) ➔ Μικτός Περιοδικός.'
                      : ': Non-periodic part (12) precedes period (5) ➔ Mixed Periodic.'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}