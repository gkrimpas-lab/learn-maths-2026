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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
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

export default function DinameisPragmatikonTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const dec = isEl ? ',' : '.';

  const [mode, setMode] = useState('custom'); // 'presets' ή 'custom'
  const [customBaseInput, setCustomBaseInput] = useState(isEl ? '2,5' : '2.5');
  const [baseType, setBaseType] = useState('integer'); // 'integer', 'negative', 'frac', 'radical'
  const [exponent, setExponent] = useState(3); // από -5 έως 10

  // Λεξικό i18n
  const t = {
    el: {
      metaTitle: "Δυνάμεις Πραγματικών Αριθμών | Θεωρία Γ' Γυμνασίου",
      metaDesc: "Αναλυτική θεωρία για τις δυνάμεις με βάση πραγματικό και εκθέτη ακέραιο, ιδιότητες δυνάμεων, τυποποιημένη μορφή και διαδραστικό εργαστήριο.",
      backText: "Γ' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 5 • Γ' ΓΥΜΝΑΣΙΟΥ",
      heroTitle: "Δυνάμεις Πραγματικών Αριθμών",
      heroSubtitle: "Ανακαλύψτε τη δύναμη των εκθετών: από τους φυσικούς έως τους αρνητικούς ακέραιους, με βάση οποιονδήποτε πραγματικό αριθμό. Μάθετε τις πανίσχυρες ιδιότητες απλοποίησης και την τυποποιημένη μορφή που χρησιμοποιεί η σύγχρονη επιστήμη.",
      heroCta: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      step1Title: "Ορισμός Δύναμης στο ℝ με Ακέραιο Εκθέτη",
      step1Desc: "Για κάθε πραγματικό αριθμό α και ακέραιο εκθέτη ν:",
      step1PosExp: "Θετικός εκθέτης (ν ＞ 1):",
      step1PosExpVal: "α · α · ... · α (ν φορές)",
      step1ZeroExp: "Μηδενικός εκθέτης (α ≠ 0):",
      step1ZeroExpVal: "α⁰ ＝ 1 (το 0⁰ δεν ορίζεται)",
      step1NegExp: "Αρνητικός εκθέτης (α ≠ 0):",
      step1FracNegTitle: "Κλάσμα σε Αρνητικό Εκθέτη:",
      step1FracNegDesc: "Αντιστρέφουμε τους όρους του κλάσματος και αλλάζουμε το πρόσημο του εκθέτη:",
      step2Title: "Ιδιότητες των Δυνάμεων",
      step2Desc: "Οι ιδιότητες ισχύουν για οποιεσδήποτε πραγματικές βάσεις και ακέραιους εκθέτες:",
      step2PropProduct: "Γινόμενο ίδιας βάσης:",
      step2PropQuotient: "Πηλίκο ίδιας βάσης:",
      step2PropProdPower: "Δύναμη γινομένου:",
      step2PropPowerOfPower: "Δύναμη δύναμης:",
      step2RadicalPowerTitle: "Δύναμη Ρίζας:",
      step2RadicalPowerDescPre: "Για α ≥ 0 ισχύει",
      step2RadicalPowerDescPost: "Γενικότερα:",
      step3Title: "Κανόνες Προσήμων σε Δυνάμεις",
      step3Desc: "Το πρόσημο μιας δύναμης με αρνητική βάση καθορίζεται αποκλειστικά από τον εκθέτη:",
      step3EvenTitle: "Άρτιος Εκθέτης (2, 4, 6, ...):",
      step3EvenDesc: "Κάθε αρνητικός αριθμός υψωμένος σε άρτιο εκθέτη δίνει θετικό αποτέλεσμα:",
      step3OddTitle: "Περιττός Εκθέτης (1, 3, 5, ...):",
      step3OddDesc: "Κάθε αρνητικός αριθμός υψωμένος σε περιττό εκθέτη δίνει αρνητικό αποτέλεσμα:",
      step3WarningTitle: "Προσοχή στις Παρενθέσεις:",
      step3WarningText: "Υπάρχει τεράστια διαφορά ανάμεσα στο (－3)² ＝ 9 και στο －3² ＝ －9! Στο δεύτερο, ο εκθέτης επηρεάζει μόνο το 3.",
      step4Title: "Τυποποιημένη (Επιστημονική) Μορφή",
      step4Desc: "Για να γράφουμε εύκολα εξαιρετικά μεγάλους ή μικρούς αριθμούς, χρησιμοποιούμε τη μορφή:",
      step4FormCondition: "όπου 1 ≤ |α| ＜ 10 και k ∈ ℤ (ακέραιος)",
      step4BigNumbersTitle: "Πολύ μεγάλοι αριθμοί (k ＞ 0):",
      step4BigNumbersVal: "300.000.000 ＝ 3 · 10⁸ (ταχύτητα φωτός σε m/s)",
      step4SmallNumbersTitle: "Πολύ μικροί αριθμοί (k ＜ 0):",
      step4SmallNumbersVal: "0,0000045 ＝ 4,5 · 10⁻⁶",
      labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΔΥΝΑΜΕΩΝ",
      labTitle: "Δυναμικός Υπολογιστής Δύναμης αⁿ",
      modeCustom: "Δική σας Βάση (±999,999)",
      modePresets: "Κλασικές Βάσεις",
      labBaseInputLabel: "Εισαγωγή Βάσης (α):",
      labBaseInputHelp: "έως 3 ακέραια, 3 δεκαδικά",
      labPresetLabel: "Επιλέξτε Κλασική Βάση:",
      presetPositive: "Θετικός: 2",
      presetNegative: "Αρνητικός: (－2)",
      presetFrac: "Κλάσμα:",
      presetRadical: "Ρίζα:",
      labExponentLabel: "Εκθέτης (ν):",
      labCardBadge: "ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΗΣ",
      scientificFormTitle: "Τυποποιημένη μορφή:",
      labRuleTitle: "ΕΦΑΡΜΟΖΟΜΕΝΟΣ ΚΑΝΟΝΑΣ",
      ruleInvalid: "Παρακαλούμε εισάγετε έναν πραγματικό αριθμό (π.χ. -12,345 ή 2,5).",
      ruleUndefinedZero: "Η δύναμη 0⁰ καθώς και η διαίρεση με το μηδέν (0⁻ⁿ) δεν ορίζονται στα μαθηματικά.",
      ruleZeroExp: "Κάθε πραγματικός αριθμός α ≠ 0 υψωμένος στο μηδέν ισούται με 1 (α⁰ ＝ 1).",
      ruleOverflow: "Υπερχείλιση (Πολύ μεγάλος αριθμός)",
      ruleInvalidBaseText: "Μη έγκυρος αριθμός",
      ruleUndefinedText: "Δεν ορίζεται",
      p1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ",
      p1Title: "Υπολογισμός παράστασης με ιδιότητες δυνάμεων",
      p1Statement: "Να υπολογιστεί η αριθμητική τιμή της παράστασης:",
      thStep: "Βήμα",
      thProperty: "Ιδιότητα",
      thCalculation: "Υπολογισμός",
      p1Step1: "1. Δύναμη δύναμης",
      p1Step2: "2. Αριθμητής",
      p1Step3: "3. Πηλίκο",
      p1FinalValue: "Τελική Τιμή:",
      p2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΠΙΣΤΗΜΟΝΙΚΗ ΕΦΑΡΜΟΓΗ",
      p2Title: "Υπολογισμός απόστασης με τυποποιημένη μορφή",
      p2Statement: "Η ταχύτητα του φωτός είναι v ＝ 3 · 10⁸ m/s. Το φως του Ήλιου χρειάζεται περίπου t ＝ 5 · 10² δευτερόλεπτα (περίπου 8,3 λεπτά) για να φτάσει στη Γη. Να υπολογιστεί η απόσταση Ήλιου - Γης (s ＝ v · t) σε μέτρα σε τυποποιημένη μορφή.",
      thQuantity: "Μέγεθος",
      thFormula: "Μαθηματικός Τύπος",
      thResult: "Αποτέλεσμα",
      p2Row1: "1. Γινόμενο μεγεθών",
      p2Row2: "2. Υπολογισμός",
      p2Row3: "3. Τυποποιημένη",
      p2FinalValLabel: "Τελική Απόσταση:",
      p2FinalValDetail: "1,5 · 10¹¹ m (δηλαδή 150.000.000 km).",
      warningTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΔΥΝΑΜΕΙΣ",
      warning1Title: "Αρνητικός εκθέτης δεν σημαίνει αρνητικό αποτέλεσμα:",
      warning1TextPre: "Το 2⁻³ ισούται με",
      warning1TextMid: "＝",
      warning1TextPost: "(θετικός αριθμός) και ΟΧΙ με －8 ή －6. Ο αρνητικός εκθέτης δείχνει αντιστροφή και όχι πρόσημο!",
      warning2Title: "Πρόσημο με και χωρίς παρένθεση:",
      warning2Text: "(－4)² ＝ (－4) · (－4) ＝ ＋16, ενώ －4² ＝ －(4 · 4) ＝ －16.",
      warning3Title: "Πρόσθεση δυνάμεων:",
      warning3Text: "Στην έκφραση 2³ ＋ 2⁴ ΔΕΝ προσθέτουμε τους εκθέτες! Οι εκθέτες προστίθενται μόνο στον πολλαπλασιασμό (2³ · 2⁴ ＝ 2⁷).",
      ctaTitle: "Εξασκηθείτε στις Δυνάμεις των Πραγματικών!",
      ctaDesc: "Δοκιμάστε τις δυνάμεις σας σε 12 δυναμικές διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.",
      ctaButton: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
    },
    en: {
      metaTitle: "Powers of Real Numbers | Theory 9th Grade",
      metaDesc: "Comprehensive theory on powers with real base and integer exponents, power properties, scientific notation, and interactive laboratory.",
      backText: "9th Grade",
      btnExercises: "EXERCISES",
      chapterBadge: "CHAPTER 5 • 9TH GRADE",
      heroTitle: "Powers of Real Numbers",
      heroSubtitle: "Discover the power of exponents: from natural numbers to negative integers with any real base. Master the simplifying properties and scientific notation widely used across modern sciences.",
      heroCta: "GO TO EXERCISES",
      step1Title: "Definition of Power in ℝ with Integer Exponent",
      step1Desc: "For any real number a and integer exponent n:",
      step1PosExp: "Positive exponent (n ＞ 1):",
      step1PosExpVal: "a · a · ... · a (n times)",
      step1ZeroExp: "Zero exponent (a ≠ 0):",
      step1ZeroExpVal: "a⁰ ＝ 1 (0⁰ is undefined)",
      step1NegExp: "Negative exponent (a ≠ 0):",
      step1FracNegTitle: "Fraction with Negative Exponent:",
      step1FracNegDesc: "Invert the numerator and denominator and change the sign of the exponent:",
      step2Title: "Properties of Powers",
      step2Desc: "Properties hold for all real bases and integer exponents:",
      step2PropProduct: "Product of same base:",
      step2PropQuotient: "Quotient of same base:",
      step2PropProdPower: "Power of a product:",
      step2PropPowerOfPower: "Power of a power:",
      step2RadicalPowerTitle: "Power of a Radical:",
      step2RadicalPowerDescPre: "For a ≥ 0, it holds that",
      step2RadicalPowerDescPost: "More generally:",
      step3Title: "Sign Rules for Powers",
      step3Desc: "The sign of a power with a negative base is determined exclusively by the exponent:",
      step3EvenTitle: "Even Exponent (2, 4, 6, ...):",
      step3EvenDesc: "Any negative number raised to an even exponent yields a positive result:",
      step3OddTitle: "Odd Exponent (1, 3, 5, ...):",
      step3OddDesc: "Any negative number raised to an odd exponent retains a negative result:",
      step3WarningTitle: "Watch out for Parentheses:",
      step3WarningText: "There is a vast difference between (－3)² ＝ 9 and －3² ＝ －9! In the second case, the exponent only affects 3.",
      step4Title: "Scientific Notation (Standard Form)",
      step4Desc: "To easily express extremely large or tiny numbers, we utilize the standard format:",
      step4FormCondition: "where 1 ≤ |a| ＜ 10 and k ∈ ℤ (integer)",
      step4BigNumbersTitle: "Very large numbers (k ＞ 0):",
      step4BigNumbersVal: "300,000,000 ＝ 3 · 10⁸ (speed of light in m/s)",
      step4SmallNumbersTitle: "Very small numbers (k ＜ 0):",
      step4SmallNumbersVal: "0.0000045 ＝ 4.5 · 10⁻⁶",
      labBadge: "POWERS LAB",
      labTitle: "Dynamic Power Calculator aⁿ",
      modeCustom: "Custom Base (±999.999)",
      modePresets: "Standard Presets",
      labBaseInputLabel: "Enter Base (a):",
      labBaseInputHelp: "up to 3 integer, 3 decimal digits",
      labPresetLabel: "Select Standard Base:",
      presetPositive: "Positive: 2",
      presetNegative: "Negative: (－2)",
      presetFrac: "Fraction:",
      presetRadical: "Radical:",
      labExponentLabel: "Exponent (n):",
      labCardBadge: "POWER CALCULATION",
      scientificFormTitle: "Scientific notation:",
      labRuleTitle: "APPLIED RULE",
      ruleInvalid: "Please enter a valid real number (e.g. -12.345 or 2.5).",
      ruleUndefinedZero: "The power 0⁰ and division by zero (0⁻ⁿ) are undefined in mathematics.",
      ruleZeroExp: "Any non-zero real number raised to the power of zero equals 1 (a⁰ ＝ 1).",
      ruleOverflow: "Overflow (Extremely large number)",
      ruleInvalidBaseText: "Invalid Number",
      ruleUndefinedText: "Undefined",
      p1Badge: "PROBLEM 1: SIMPLIFYING EXPRESSIONS",
      p1Title: "Evaluating expression using power properties",
      p1Statement: "Calculate the numerical value of the expression:",
      thStep: "Step",
      thProperty: "Property",
      thCalculation: "Calculation",
      p1Step1: "1. Power of a power",
      p1Step2: "2. Numerator",
      p1Step3: "3. Quotient",
      p1FinalValue: "Final Value:",
      p2Badge: "PROBLEM 2: SCIENTIFIC APPLICATION",
      p2Title: "Distance calculation with scientific notation",
      p2Statement: "The speed of light is v ＝ 3 · 10⁸ m/s. Sunlight takes approximately t ＝ 5 · 10² seconds (about 8.3 minutes) to reach Earth. Calculate the Earth-Sun distance (s ＝ v · t) in meters in scientific notation.",
      thQuantity: "Quantity",
      thFormula: "Formula",
      thResult: "Result",
      p2Row1: "1. Product of quantities",
      p2Row2: "2. Calculation",
      p2Row3: "3. Scientific form",
      p2FinalValLabel: "Final Distance:",
      p2FinalValDetail: "1.5 · 10¹¹ m (equivalent to 150,000,000 km).",
      warningTitle: "ATTENTION: COMMON PITFALLS WITH POWERS",
      warning1Title: "A negative exponent does NOT mean a negative result:",
      warning1TextPre: "2⁻³ equals",
      warning1TextMid: "＝",
      warning1TextPost: "(a positive number) and NOT －8 or －6. A negative exponent indicates reciprocation, not sign!",
      warning2Title: "Sign with and without parentheses:",
      warning2Text: "(－4)² ＝ (－4) · (－4) ＝ ＋16, whereas －4² ＝ －(4 · 4) ＝ －16.",
      warning3Title: "Adding powers:",
      warning3Text: "In the expression 2³ ＋ 2⁴ do NOT add the exponents! Exponents are only added during multiplication (2³ · 2⁴ ＝ 2⁷).",
      ctaTitle: "Master Real Number Powers in Practice!",
      ctaDesc: "Test your skills with 12 dynamic interactive questions and applied problems with instant feedback.",
      ctaButton: "START EXERCISES"
    }
  };

  const cur = t[locale] || t.el;

  // Υπολογισμός παραμέτρων βάσης
  let parsedBase = 0;
  let isValidBase = true;
  let baseJSX = null;
  let baseText = '';

  if (mode === 'custom') {
    const sanitized = customBaseInput.replace(',', '.').trim();
    parsedBase = parseFloat(sanitized);
    if (isNaN(parsedBase)) {
      isValidBase = false;
      parsedBase = 0;
    }
    baseText = parsedBase < 0 ? `(${customBaseInput})` : customBaseInput;
    baseJSX = <span>{baseText}</span>;
  } else {
    if (baseType === 'negative') {
      parsedBase = -2;
      baseText = '(－2)';
      baseJSX = <span>(－2)</span>;
    } else if (baseType === 'frac') {
      parsedBase = 0.5;
      baseText = '(1/2)';
      baseJSX = <span className="inline-flex items-center">(<Frac num="1" den="2" />)</span>;
    } else if (baseType === 'radical') {
      parsedBase = Math.sqrt(3);
      baseText = '(√3)';
      baseJSX = <span className="inline-flex items-center">(<Radical>3</Radical>)</span>;
    } else {
      parsedBase = 2;
      baseText = '2';
      baseJSX = <span>2</span>;
    }
  }

  // Ασφαλής υπολογισμός δύναμης
  let resultOutput = null;
  let scientificForm = '';
  let ruleNote = '';

  if (!isValidBase) {
    resultOutput = cur.ruleInvalidBaseText;
    ruleNote = cur.ruleInvalid;
  } else if (parsedBase === 0 && exponent <= 0) {
    resultOutput = cur.ruleUndefinedText;
    ruleNote = cur.ruleUndefinedZero;
  } else if (exponent === 0) {
    resultOutput = '1';
    ruleNote = cur.ruleZeroExp;
  } else {
    const rawVal = Math.pow(parsedBase, exponent);

    if (!isFinite(rawVal)) {
      resultOutput = cur.ruleOverflow;
    } else {
      if (mode === 'presets' && baseType === 'radical') {
        if (exponent === 2) {
          resultOutput = '3';
          ruleNote = isEl
            ? 'Η τετραγωνική ρίζα υψωμένη στο τετράγωνο εξουδετερώνεται: (√3)² ＝ 3.'
            : 'Squaring a radical neutralizes the root: (√3)² ＝ 3.';
        } else if (exponent === 4) {
          resultOutput = '9';
          ruleNote = '((√3)²)² ＝ 3² ＝ 9.';
        } else if (exponent === -2) {
          resultOutput = <Frac num="1" den="3" />;
          ruleNote = '(√3)⁻² ＝ 1 / (√3)² ＝ 1/3.';
        } else {
          resultOutput = rawVal.toLocaleString(isEl ? 'el-GR' : 'en-US', { maximumFractionDigits: 6 });
          ruleNote = isEl
            ? `Υπολογισμός δύναμης με βάση √3 και εκθέτη ${exponent}.`
            : `Power evaluation with base √3 and exponent ${exponent}.`;
        }
      } else if (mode === 'presets' && baseType === 'frac') {
        if (exponent > 0) {
          const p = Math.pow(2, exponent);
          resultOutput = <Frac num="1" den={p} />;
          ruleNote = `(1/2)ⁿ ＝ 1ⁿ / 2ⁿ ＝ 1 / ${p}.`;
        } else {
          const p = Math.pow(2, Math.abs(exponent));
          resultOutput = `${p}`;
          ruleNote = isEl
            ? `(1/2)⁻ⁿ ＝ (2/1)ⁿ ＝ 2ⁿ ＝ ${p}. (Αντιστροφή κλάσματος).`
            : `(1/2)⁻ⁿ ＝ (2/1)ⁿ ＝ 2ⁿ ＝ ${p}. (Reciprocal of fraction).`;
        }
      } else if (mode === 'presets' && baseType === 'negative') {
        const isEven = Math.abs(exponent) % 2 === 0;
        const p = Math.pow(2, Math.abs(exponent));
        if (exponent > 0) {
          resultOutput = isEven ? `${p}` : `－${p}`;
          ruleNote = isEven
            ? (isEl
                ? `Αρνητική βάση με άρτιο εκθέτη (${exponent}): Το αποτέλεσμα είναι πάντοτε θετικό (＋).`
                : `Negative base with even exponent (${exponent}): Result is always positive (＋).`)
            : (isEl
                ? `Αρνητική βάση με περιττό εκθέτη (${exponent}): Το αποτέλεσμα παραμένει αρνητικό (－).`
                : `Negative base with odd exponent (${exponent}): Result remains negative (－).`);
        } else {
          resultOutput = isEven ? <Frac num="1" den={p} /> : <Frac num="－1" den={p} />;
          ruleNote = isEl
            ? `(－2)⁻ⁿ ＝ 1 / (－2)ⁿ. Το πρόσημο εξαρτάται από το αν ο εκθέτης είναι άρτιος ή περιττός.`
            : `(－2)⁻ⁿ ＝ 1 / (－2)ⁿ. Sign depends on whether the exponent is even or odd.`;
        }
      } else if (mode === 'presets' && baseType === 'integer') {
        if (exponent > 0) {
          resultOutput = `${Math.pow(2, exponent)}`;
          const count = Math.min(exponent, 5);
          const dots = exponent > 5 ? ' · ...' : '';
          ruleNote = `2ⁿ ＝ ${Array(count).fill(2).join(' · ')}${dots} ＝ ${Math.pow(2, exponent)}.`;
        } else {
          const p = Math.pow(2, Math.abs(exponent));
          resultOutput = <Frac num="1" den={p} />;
          ruleNote = `2⁻ⁿ ＝ 1 / 2ⁿ ＝ 1 / ${p}.`;
        }
      } else {
        // Custom Mode
        if (Math.abs(rawVal) >= 1e7 || (Math.abs(rawVal) < 1e-4 && rawVal !== 0)) {
          scientificForm = rawVal.toExponential(4).replace('e+', ' · 10⁺').replace('e-', ' · 10⁻');
          if (!isEl) scientificForm = scientificForm.replace(',', '.');
        }
        resultOutput = rawVal.toLocaleString(isEl ? 'el-GR' : 'en-US', { maximumFractionDigits: 6 });

        if (parsedBase < 0) {
          const isEven = Math.abs(exponent) % 2 === 0;
          ruleNote = isEven
            ? (isEl
                ? `Αρνητική βάση με άρτιο εκθέτη (${exponent}): Το αποτέλεσμα είναι πάντα θετικό (＋).`
                : `Negative base with even exponent (${exponent}): Result is always positive (＋).`)
            : (isEl
                ? `Αρνητική βάση με περιττό εκθέτη (${exponent}): Το αποτέλεσμα παραμένει αρνητικό (－).`
                : `Negative base with odd exponent (${exponent}): Result remains negative (－).`);
        } else if (exponent < 0) {
          ruleNote = isEl
            ? `Αρνητικός εκθέτης (${exponent}): Αντιστρέφει τη βάση (α⁻ⁿ ＝ 1 / αⁿ).`
            : `Negative exponent (${exponent}): Inverts the base (a⁻ⁿ ＝ 1 / aⁿ).`;
        } else {
          ruleNote = isEl
            ? `Υπολογισμός της βάσης ${baseText} υψωμένης στον εκθέτη ${exponent}.`
            : `Evaluating base ${baseText} raised to exponent ${exponent}.`;
        }
      }
    }
  }

  const handleCustomInputChange = (val) => {
    let clean = val.replace(/[^0-9.,-]/g, '');
    
    if (clean.indexOf('-') > 0) {
      clean = clean.replace(/-/g, '');
    }
    const hasMinus = clean.startsWith('-');
    if (hasMinus) clean = '-' + clean.substring(1).replace(/-/g, '');

    const parts = clean.split(/[,.]/);
    if (parts.length > 2) {
      clean = parts[0] + (isEl ? ',' : '.') + parts.slice(1).join('');
    }

    let intPart = parts[0].replace('-', '');
    if (intPart.length > 3) intPart = intPart.substring(0, 3);
    const signPrefix = hasMinus ? '-' : '';

    if (parts.length === 2) {
      let decPart = parts[1];
      if (decPart.length > 3) decPart = decPart.substring(0, 3);
      setCustomBaseInput(`${signPrefix}${intPart}${isEl ? ',' : '.'}${decPart}`);
    } else {
      setCustomBaseInput(`${signPrefix}${intPart}`);
    }
  };

  return (
    <Layout
      title={cur.metaTitle}
      description={cur.metaDesc}
      backUrl="/g-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(cur.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800 box-border">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl w-full min-w-0">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.chapterBadge)}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight break-words [overflow-wrap:anywhere]">
              {cur.heroTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl break-words [overflow-wrap:anywhere]">
              {cur.heroSubtitle}
            </p>
            <div>
              <Link
                href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(cur.heroCta)}</span>
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
                  1
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.step1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {cur.step1Desc}
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-700 font-mono">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step1PosExp}</strong> α<sup>ν</sup> ＝ {cur.step1PosExpVal}
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step1ZeroExp}</strong> {cur.step1ZeroExpVal}
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                  <span className="font-sans text-slate-900 font-bold">{cur.step1NegExp}</span>
                  <span className="font-bold text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap">
                    α<sup>－ν</sup> ＝ <Frac num="1" den={<>α<sup>ν</sup></>} />
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950">
                <span className="font-bold block mb-1">{cur.step1FracNegTitle}</span>
                <span className="break-words [overflow-wrap:anywhere]">{cur.step1FracNegDesc}</span> <br />
                <span className="font-mono font-bold mt-1 inline-flex flex-wrap items-center gap-1.5">
                  (<Frac num="α" den="β" />)<sup>－ν</sup> ＝ (<Frac num="β" den="α" />)<sup>ν</sup>
                </span>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.step2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {cur.step2Desc}
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm font-mono text-slate-800">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span className="font-sans text-slate-700">{cur.step2PropProduct}</span>
                  <strong className="text-indigo-900 whitespace-nowrap">α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ＋ν</sup></strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span className="font-sans text-slate-700">{cur.step2PropQuotient}</span>
                  <strong className="text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap">
                    <Frac num={<>α<sup>μ</sup></>} den={<>α<sup>ν</sup></>} /> ＝ α<sup>μ－ν</sup>
                  </strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span className="font-sans text-slate-700">{cur.step2PropProdPower}</span>
                  <strong className="text-indigo-900 whitespace-nowrap">(α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup></strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span className="font-sans text-slate-700">{cur.step2PropPowerOfPower}</span>
                  <strong className="text-indigo-900 whitespace-nowrap">(α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup></strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 font-mono">
                <strong className="font-sans">{cur.step2RadicalPowerTitle}</strong>{' '}
                <span className="font-sans">{cur.step2RadicalPowerDescPre}</span>{' '}
                <span className="font-bold whitespace-nowrap">(<Radical>α</Radical>)<sup>2</sup> ＝ α</span>. <br />
                <span className="font-sans">{cur.step2RadicalPowerDescPost}</span>{' '}
                <span className="font-bold whitespace-nowrap">(<Radical>α</Radical>)<sup>2ν</sup> ＝ ((<Radical>α</Radical>)<sup>2</sup>)<sup>ν</sup> ＝ α<sup>ν</sup></span>.
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.step3Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {cur.step3Desc}
              </p>

              <div className="space-y-2 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                  <strong>{cur.step3EvenTitle}</strong> <br />
                  <span className="break-words [overflow-wrap:anywhere]">{cur.step3EvenDesc}</span>
                  <div className="font-mono font-bold mt-1 text-emerald-900 flex flex-wrap items-center gap-2">
                    <span className="whitespace-nowrap">(－3)<sup>2</sup> ＝ ＋9</span>
                    <span>|</span>
                    <span className="whitespace-nowrap">(－1)<sup>100</sup> ＝ 1</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
                  <strong>{cur.step3OddTitle}</strong> <br />
                  <span className="break-words [overflow-wrap:anywhere]">{cur.step3OddDesc}</span>
                  <div className="font-mono font-bold mt-1 text-rose-900 flex flex-wrap items-center gap-2">
                    <span className="whitespace-nowrap">(－2)<sup>3</sup> ＝ －8</span>
                    <span>|</span>
                    <span className="whitespace-nowrap">(－1)<sup>99</sup> ＝ －1</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 break-words [overflow-wrap:anywhere]">
                <strong>{cur.step3WarningTitle}</strong> {cur.step3WarningText}
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.step4Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {cur.step4Desc}
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner">
                <div className="font-mono text-base sm:text-xl font-black tracking-wide">
                  α · 10<sup>k</sup>
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-1 break-words [overflow-wrap:anywhere]">
                  {cur.step4FormCondition}
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900">{cur.step4BigNumbersTitle}</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-900 font-bold break-words [overflow-wrap:anywhere]">
                    300.000.000 ＝ 3 · 10<sup>8</sup> {isEl ? '(ταχύτητα φωτός σε m/s)' : '(speed of light in m/s)'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900">{cur.step4SmallNumbersTitle}</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-900 font-bold break-words [overflow-wrap:anywhere]">
                    0{dec}0000045 ＝ 4{dec}5 · 10<sup>－6</sup>
                  </div>
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
                🔬 {toCleanUppercase(cur.labBadge)}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {cur.labTitle}
              </h2>
            </div>
            {/* Mode Selector */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'custom' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cur.modeCustom}
              </button>
              <button
                type="button"
                onClick={() => setMode('presets')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'presets' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cur.modePresets}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              
              {mode === 'custom' ? (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs sm:text-sm font-bold text-slate-700">
                      {cur.labBaseInputLabel}
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">{cur.labBaseInputHelp}</span>
                  </div>
                  <input
                    type="text"
                    value={customBaseInput}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    placeholder={isEl ? "π.χ. -12,345 ή 2,5" : "e.g. -12.345 or 2.5"}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['-2', isEl ? '0,5' : '0.5', isEl ? '1,2' : '1.2', '10', isEl ? '-0,4' : '-0.4'].map((pre) => (
                      <button
                        type="button"
                        key={pre}
                        onClick={() => setCustomBaseInput(pre)}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-600 hover:border-indigo-400"
                      >
                        {pre}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                    {cur.labPresetLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBaseType('integer')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                        baseType === 'integer'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cur.presetPositive}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBaseType('negative')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                        baseType === 'negative'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cur.presetNegative}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBaseType('frac')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                        baseType === 'frac'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cur.presetFrac} <Frac num="1" den="2" className="ml-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setBaseType('radical')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-h-[44px] ${
                        baseType === 'radical'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cur.presetRadical} <Radical className="ml-1">3</Radical>
                    </button>
                  </div>
                </div>
              )}

              {/* Slider Εκθέτη από -5 έως 10 */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">
                    {cur.labExponentLabel}
                  </label>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs sm:text-sm shadow-sm">
                    {exponent > 0 ? `＋${exponent}` : exponent}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="1"
                  value={exponent}
                  onChange={(e) => setExponent(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>－5</span>
                  <span>0</span>
                  <span>＋5</span>
                  <span>＋10</span>
                </div>
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labCardBadge)}
                </span>
                <div className="text-xl sm:text-3xl lg:text-4xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1 max-w-full">
                  <span className="inline-flex items-center">
                    {baseJSX}
                    <sup className="text-xs sm:text-base text-amber-300 ml-0.5">{exponent}</sup>
                  </span>
                  <span className="text-indigo-400">＝</span>
                  <span className="text-emerald-400 inline-flex items-center break-all">
                    {resultOutput}
                  </span>
                </div>

                {scientificForm && (
                  <div className="mt-3 pt-3 border-t border-indigo-800 text-xs sm:text-sm font-mono text-indigo-200">
                    <span className="text-slate-400 block text-[10px] uppercase">{cur.scientificFormTitle}</span>
                    <span className="font-bold text-amber-300 text-sm sm:text-base">{scientificForm}</span>
                  </div>
                )}
              </div>

              {/* Επεξήγηση κανόνα */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2 min-w-0">
                <span className="text-xs font-bold text-slate-900 block uppercase break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labRuleTitle)}:
                </span>
                <p className="leading-relaxed font-medium text-slate-800 break-words [overflow-wrap:anywhere]">
                  {ruleNote}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full shrink-0" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {cur.problemsSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full min-w-0">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(cur.p1Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.p1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                  {cur.p1Statement} <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1.5 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span>Α ＝</span>
                    <Frac num={<>2<sup>5</sup> · 2<sup>－2</sup> · (2<sup>3</sup>)<sup>2</sup></>} den={<>2<sup>7</sup></>} />
                  </span>
                </p>

                {/* Mobile View: Stacked Cards (χωρίς οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2 mb-4 font-mono text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step1}</span>
                      <span>(α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup></span>
                    </div>
                    <div className="font-bold text-slate-800 break-words">
                      (2<sup>3</sup>)<sup>2</sup> ＝ 2<sup>6</sup>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step2}</span>
                      <span>α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ＋ν</sup></span>
                    </div>
                    <div className="font-bold text-slate-800 break-words">
                      2<sup>5</sup> · 2<sup>－2</sup> · 2<sup>6</sup> ＝ 2<sup>5－2＋6</sup> ＝ 2<sup>9</sup>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step3}</span>
                      <span className="inline-flex items-center"><Frac num={<>α<sup>μ</sup></>} den={<>α<sup>ν</sup></>} /> ＝ α<sup>μ－ν</sup></span>
                    </div>
                    <div className="font-bold text-indigo-700 flex flex-wrap items-center gap-1 pt-1">
                      <Frac num={<>2<sup>9</sup></>} den={<>2<sup>7</sup></>} />
                      <span>＝ 2<sup>9－7</sup> ＝ 2<sup>2</sup> ＝ <strong>4</strong></span>
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thStep}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thProperty}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thCalculation}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step1}</td>
                        <td className="p-2 sm:p-2.5 font-sans">(α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup></td>
                        <td className="p-2 sm:p-2.5">(2<sup>3</sup>)<sup>2</sup> ＝ 2<sup>6</sup></td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step2}</td>
                        <td className="p-2 sm:p-2.5 font-sans">α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ＋ν</sup></td>
                        <td className="p-2 sm:p-2.5">2<sup>5</sup> · 2<sup>－2</sup> · 2<sup>6</sup> ＝ 2<sup>5－2＋6</sup> ＝ 2<sup>9</sup></td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step3}</td>
                        <td className="p-2 sm:p-2.5 font-sans">
                          <span className="inline-flex items-center gap-0.5">
                            <Frac num={<>α<sup>μ</sup></>} den={<>α<sup>ν</sup></>} /> ＝ α<sup>μ－ν</sup>
                          </span>
                        </td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1">
                            <Frac num={<>2<sup>9</sup></>} den={<>2<sup>7</sup></>} />
                            <span>＝ 2<sup>9－7</sup> ＝ 2<sup>2</sup> ＝ 4</span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.p1FinalValue}</strong> <span className="font-mono font-bold text-emerald-900">Α ＝ 4</span>.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(cur.p2Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug break-words [overflow-wrap:anywhere]">
                  {cur.p2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                  {cur.p2Statement}
                </p>

                {/* Mobile View: Stacked Cards (χωρίς οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="text-indigo-900 font-bold font-sans text-[11px]">{cur.p2Row1}</div>
                    <div className="text-slate-700">s ＝ (3 · 10<sup>8</sup>) · (5 · 10<sup>2</sup>)</div>
                    <div className="font-bold text-slate-900">(3 · 5) · (10<sup>8</sup> · 10<sup>2</sup>)</div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="text-indigo-900 font-bold font-sans text-[11px]">{cur.p2Row2}</div>
                    <div className="text-slate-700">15 · 10<sup>8＋2</sup></div>
                    <div className="font-bold text-slate-900">15 · 10<sup>10</sup> m</div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="text-indigo-900 font-bold font-sans text-[11px]">{cur.p2Row3}</div>
                    <div className="text-slate-700">(1{dec}5 · 10<sup>1</sup>) · 10<sup>10</sup></div>
                    <div className="font-bold text-indigo-700 text-sm">1{dec}5 · 10<sup>11</sup> m</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thQuantity}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thFormula}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2Row1}</td>
                        <td className="p-2 sm:p-2.5">s ＝ (3 · 10<sup>8</sup>) · (5 · 10<sup>2</sup>)</td>
                        <td className="p-2 sm:p-2.5">(3 · 5) · (10<sup>8</sup> · 10<sup>2</sup>)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2Row2}</td>
                        <td className="p-2 sm:p-2.5">15 · 10<sup>8＋2</sup></td>
                        <td className="p-2 sm:p-2.5">15 · 10<sup>10</sup> m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2Row3}</td>
                        <td className="p-2 sm:p-2.5">(1{dec}5 · 10<sup>1</sup>) · 10<sup>10</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">1{dec}5 · 10<sup>11</sup> m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.p2FinalValLabel}</strong> <span className="font-mono font-bold text-emerald-900">{cur.p2FinalValDetail}</span></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm w-full min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0" aria-hidden="true">⚠️</span>
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight break-words [overflow-wrap:anywhere]">
                {toCleanUppercase(cur.warningTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning1Title}</strong> {cur.warning1TextPre}{' '}
                    <span className="font-mono font-bold inline-flex items-center gap-1">
                      <Frac num="1" den={<>2<sup>3</sup></>} /> {cur.warning1TextMid} <Frac num="1" den="8" />
                    </span>{' '}
                    {cur.warning1TextPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning2Title}</strong> {cur.warning2Text}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning3Title}</strong> {cur.warning3Text}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center w-full min-w-0">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug break-words [overflow-wrap:anywhere]">
            {cur.ctaTitle}
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6 break-words [overflow-wrap:anywhere]">
            {cur.ctaDesc}
          </p>
          <Link
            href="/g-gymnasiou/05-dinameis-pragmatikon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(cur.ctaButton)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}