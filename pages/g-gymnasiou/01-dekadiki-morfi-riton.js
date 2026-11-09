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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive & Overflow Safe
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive & No-Horizontal-Scroll Safe
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

// Γραμμή περιόδου πάνω από τα ψηφία (Vinculum)
function Overline({ children }) {
  return (
    <span className="relative inline-block border-t-2 border-current px-0.5 leading-none">
      {children}
    </span>
  );
}

// Προσομοίωση διαίρεσης κλάσματος num/den για εύρεση δεκαδικής μορφής και περιόδου
function getDecimalExpansion(num, den) {
  if (!den || den === 0) return { integerPart: 0, nonPeriodic: '', period: '', isTerminating: true };

  const integerPart = Math.floor(num / den);
  let rem = num % den;
  if (rem === 0) {
    return { integerPart, nonPeriodic: '0', period: '', isTerminating: true };
  }

  const seenRemainders = new Map();
  let digits = '';
  let index = 0;

  while (rem !== 0 && !seenRemainders.has(rem) && index < 20) {
    seenRemainders.set(rem, index);
    rem *= 10;
    const digit = Math.floor(rem / den);
    digits += digit.toString();
    rem = rem % den;
    index++;
  }

  if (rem === 0) {
    return { integerPart, nonPeriodic: digits, period: '', isTerminating: true };
  }

  const periodStartIndex = seenRemainders.get(rem);
  const nonPeriodic = digits.slice(0, periodStartIndex);
  const period = digits.slice(periodStartIndex);

  return { integerPart, nonPeriodic, period, isTerminating: false };
}

export default function DekadikiMorfiRitonTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για το Interactive Lab
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(3);

  const expansion = getDecimalExpansion(num, den);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    el: {
      metaTitle: "Δεκαδική Μορφή Ρητών Αριθμών | Θεωρία Γ' Γυμνασίου",
      metaDesc: "Αναλυτική θεωρία για τους ρητούς αριθμούς, πεπερασμένους και περιοδικούς δεκαδικούς, περίοδο και μετατροπές με διαδραστικό εργαστήριο.",
      backText: "Γ' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 1 • Γ' ΓΥΜΝΑΣΙΟΥ",
      heroTitle: "Δεκαδική Μορφή Ρητών Αριθμών",
      heroSubtitle: "Πώς κάθε κλάσμα μεταμορφώνεται σε δεκαδικό αριθμό; Ανακαλύψτε το μυστικό των πεπερασμένων και των περιοδικών δεκαδικών, μάθετε να εντοπίζετε την περίοδο και κατακτήστε τις τεχνικές μετατροπής σε γεννήτρια μορφή.",
      heroCta: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      step1Title: "Τι είναι Ρητός Αριθμός;",
      step1Desc: "Ρητός ονομάζεται κάθε αριθμός που μπορεί να γραφεί ως κλάσμα της μορφής:",
      step1Condition: "όπου μ ακέραιος αριθμός και ν φυσικός αριθμός με ν ≠ 0.",
      step1IntegersLabel: "Ακέραιοι ως Ρητοί:",
      step1IntegersDesc: "Με παρονομαστή το 1:",
      step1DecimalsLabel: "Δεκαδικοί ως Ρητοί:",
      step1DecimalsDesc: "Με πεπερασμένα ψηφία:",
      step2Title: "Περιοδικοί Δεκαδικοί & Περίοδος",
      step2Desc: "Όταν διαιρέσουμε τον αριθμητή με τον παρονομαστή ενός ανάγωγου κλάσματος, προκύπτει είτε τερματιζόμενος είτε περιοδικός δεκαδικός.",
      simplePeriodicTitle: "Απλός Περιοδικός:",
      simplePeriodicDesc: "Η περίοδος ξεκινά αμέσως μετά την υποδιαστολή.",
      simplePeriodicNote: "(Περίοδος 3)",
      mixedPeriodicTitle: "Μικτός Περιοδικός:",
      mixedPeriodicDesc: "Μεσολαβεί μη περιοδικό μέρος πριν την περίοδο.",
      mixedPeriodicNote: "(Μη περ. 8, περίοδος 3)",
      notationTitle: "Συμβολισμός:",
      notationDesc: "Τοποθετούμε οριζόντια γραμμή πάνω από τα ψηφία που επαναλαμβάνονται (π.χ. 2,1",
      notationDescSuffix: "＝ 2,1454545...).",
      step3Title: "Το Μυστικό του Παρονομαστή",
      step3Desc: "Αναλύοντας τον παρονομαστή ενός ανάγωγου κλάσματος σε πρώτους παράγοντες:",
      step3FiniteTitle: "✓ Πεπερασμένος Δεκαδικός:",
      step3FiniteDesc: "Αν περιέχει μόνο τους παράγοντες 2 ή/και 5.",
      step3FiniteEnd: "(τελειώνει).",
      step3PeriodicTitle: "⚡ Περιοδικός Δεκαδικός:",
      step3PeriodicDesc: "Αν περιέχει οποιονδήποτε άλλον πρώτο παράγοντα (όπως 3, 7, 11...).",
      step3PeriodicEnd: "(υπάρχει το 3).",
      eg: "Π.χ.",
      step4Title: "Μετατροπή Περιοδικού σε Κλάσμα",
      step4Desc: "Κάθε περιοδικός δεκαδικός αριθμός προέρχεται από ένα μοναδικό κλάσμα (γεννήτρια μορφή):",
      step4SimpleTitle: "Για Απλό Περιοδικό (π.χ. 0,",
      step4SimpleDesc: "Αριθμητής η περίοδος και παρονομαστής τόσα 9άρια όσα τα ψηφία της:",
      step4MixedTitle: "Αλγεβρική Μέθοδος (για Μικτό):",
      step4MixedDesc: "Θέτουμε x, πολλαπλασιάζουμε με 10 ή 100 για να ευθυγραμμίσουμε την περίοδο και αφαιρούμε τις εξισώσεις.",
      labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΑΡΙΘΜΩΝ",
      labTitle: "Διαδραστική Μετατροπή Κλάσματος σε Δεκαδικό",
      labDesc: "Ρυθμίστε τον αριθμητή και τον παρονομαστή για να εξερευνήσετε αν ο αριθμός είναι πεπερασμένος ή περιοδικός.",
      labNumerator: "Αριθμητής (μ):",
      labDenominator: "Παρονομαστής (ν):",
      labPresets: "ΔΟΚΙΜΑΣΤΕ ΚΛΑΣΙΚΑ ΚΛΑΣΜΑΤΑ:",
      labCardBadge: "ΚΛΑΣΜΑ & ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ",
      badgeType: "Είδος Δεκαδικού",
      badgePeriod: "Περίοδος",
      badgePeriodLength: "Μήκος Περιόδου",
      typeTerminating: "Πεπερασμένος",
      typeMixed: "Μικτός Περιοδικός",
      typeSimple: "Απλός Περιοδικός",
      none: "Δεν υπάρχει",
      digitsCount: (n) => `${n} ${n === 1 ? 'ψηφίο' : 'ψηφία'}`,
      divExplanationTitle: "Ερμηνεία Διαίρεσης:",
      divExplanationDivide: "Διαιρώντας το κλάσμα",
      divTerminatingText: (val) => `το υπόλοιπο μηδενίζεται, οπότε ο αριθμός έχει πεπερασμένο πλήθος δεκαδικών ψηφίων (${val}).`,
      divPeriodicText: (period) => `τα υπόλοιπα επαναλαμβάνονται κυκλικά, δημιουργώντας την άπειρη περίοδο ${period}.`,
      problemsSectionTitle: "Λυμένα Προβλήματα Εφαρμογής",
      p1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΛΓΕΒΡΙΚΗ ΕΥΡΕΣΗ ΓΕΝΝΗΤΡΙΑΣ",
      p1Title: "Μετατροπή του 0,4",
      p1TitleEnd: "σε κλάσμα",
      p1Statement: "Να μετατραπεί ο μικτός περιοδικός δεκαδικός αριθμός x ＝ 0,4666... ＝ 0,4",
      p1StatementEnd: "στο ισοδύναμο ανάγωγο κλάσμα του.",
      thStep: "Βήμα",
      thEquation: "Εξίσωση",
      thPurpose: "Σκοπός",
      p1Step1: "1. Ορισμός x",
      p1Step1Purpose: "Αρχική εξίσωση (1)",
      p1Step2: "2. Επί 10",
      p1Step2Purpose: "Μετατόπιση μη περ.",
      p1Step3: "3. Επί 100",
      p1Step3Purpose: "Μετατόπιση 1 περιόδου",
      p1Step4: "4. Αφαίρεση",
      p1Step4Purpose: "Εξαφάνιση περιόδου",
      solveLabel: "Επίλυση:",
      reductionLabel: "Αναγωγή:",
      reductionText: "Διαιρούμε με 6: 42 : 6 ＝ 7 και 90 : 6 ＝ 15.",
      irreducibleLabel: "Ανάγωγο Κλάσμα:",
      p2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΑΘΗΜΕΡΙΝΗ ΕΦΑΡΜΟΓΗ & ΜΟΙΡΑΣΙΑ",
      p2Title: "Διανομή ποσού και στρογγυλοποίηση",
      p2StatementPart1: "Τρία αδέλφια μοιράζονται εξίσου ένα ποσό 100 €.",
      p2StatementPartA: "α) Ακριβές κλάσμα και περιοδικός δεκαδικός του μεριδίου.",
      p2StatementPartB: "β) Πραγματική πληρωμή ανά άτομο (σε λεπτά του ευρώ).",
      thQuantity: "Μέγεθος",
      thExpression: "Έκφραση",
      thResult: "Αποτέλεσμα",
      p2Row1Label: "Κλασματικό μερίδιο",
      p2Row2Label: "Δεκαδική ακριβής μορφή",
      p2Row3Label: "Πραγματική πληρωμή",
      p2Row3Expr: "Στρογγυλοποίηση (0,01)",
      conclusionLabel: "Συμπέρασμα:",
      p2Conclusion: "Κάθε αδελφός λαμβάνει 33,33 €.",
      remainderLabel: "Υπόλοιπο:",
      p2Remainder: "3 · 33,33 ＝ 99,99 €, απομένει 0,01 € που δεν υποδιαιρείται παραπάνω.",
      warningTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΡΗΤΟΥΣ ΑΡΙΘΜΟΥΣ",
      warning1Title: "Άπειρα δεκαδικά ψηφία ΧΩΡΙΣ περίοδο:",
      warning1Text: "Αριθμοί όπως ο π ＝ 3,14159... ή η ρίζα",
      warning1TextMid: "＝ 1,41421... έχουν άπειρα ψηφία αλλά ΔΕΝ έχουν περίοδο.",
      warning1TextEnd: "Αυτοί οι αριθμοί λέγονται άρρητοι και ΔΕΝ είναι ρητοί!",
      warning2Title: "Απλοποίηση πριν τον έλεγχο του παρονομαστή:",
      warning2Text: "Πρέπει πρώτα το κλάσμα να είναι ανάγωγο! Στο",
      warning2TextMid: "ο παρονομαστής 30 περιέχει το 3, αλλά απλοποιείται σε",
      warning2TextEnd: "＝ 0,3 (πεπερασμένος δεκαδικός).",
      warning3Title: "Λάθος θέση της γραμμής περιόδου:",
      warning3Text: "Στο 1,2353535... η περίοδος είναι το 35 και γράφεται 1,2",
      warning3TextEnd: "και ΟΧΙ",
      warning3TextFinal: "ούτε 1,",
      warning4Title: "Διαφορά 0,999... και 1:",
      warning4Text: "Ο περιοδικός δεκαδικός αριθμός 0,",
      warning4TextMid: "ισούται ακριβώς με το 1 (αφού",
      warning4TextEnd: "＝ 1).",
      ctaTitle: "Εμπεδώστε τη Δεκαδική Μορφή στην Πράξη!",
      ctaDesc: "Δοκιμάστε τις ικανότητές σας σε διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση και πλήρεις λύσεις.",
      ctaButton: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ",
    },
    en: {
      metaTitle: "Decimal Form of Rational Numbers | Theory 9th Grade",
      metaDesc: "Detailed theory on rational numbers, terminating and repeating decimals, period detection, and fractional conversion with an interactive lab.",
      backText: "9th Grade",
      btnExercises: "EXERCISES",
      chapterBadge: "CHAPTER 1 • 9TH GRADE",
      heroTitle: "Decimal Form of Rational Numbers",
      heroSubtitle: "How does each fraction transform into a decimal? Discover the secret of terminating and repeating decimals, learn how to identify the period, and master conversions into generating fraction form.",
      heroCta: "GO TO EXERCISES",
      step1Title: "What is a Rational Number?",
      step1Desc: "A rational number is any number that can be expressed as a fraction of the form:",
      step1Condition: "where m is an integer and n is a natural number with n ≠ 0.",
      step1IntegersLabel: "Integers as Rationals:",
      step1IntegersDesc: "With a denominator of 1:",
      step1DecimalsLabel: "Decimals as Rationals:",
      step1DecimalsDesc: "With terminating digits:",
      step2Title: "Repeating Decimals & Period",
      step2Desc: "When dividing the numerator by the denominator of an irreducible fraction, the result is either a terminating or a repeating decimal.",
      simplePeriodicTitle: "Pure Repeating:",
      simplePeriodicDesc: "The period starts immediately after the decimal point.",
      simplePeriodicNote: "(Period 3)",
      mixedPeriodicTitle: "Mixed Repeating:",
      mixedPeriodicDesc: "A non-repeating part precedes the repeating period.",
      mixedPeriodicNote: "(Non-rep. 8, period 3)",
      notationTitle: "Notation:",
      notationDesc: "We place a horizontal line (vinculum) over the repeating digits (e.g., 2.1",
      notationDescSuffix: "＝ 2.1454545...).",
      step3Title: "The Secret of the Denominator",
      step3Desc: "Factoring the denominator of an irreducible fraction into prime factors:",
      step3FiniteTitle: "✓ Terminating Decimal:",
      step3FiniteDesc: "If it contains only prime factors 2 and/or 5.",
      step3FiniteEnd: "(terminates).",
      step3PeriodicTitle: "⚡ Repeating Decimal:",
      step3PeriodicDesc: "If it contains any other prime factor (such as 3, 7, 11...).",
      step3PeriodicEnd: "(contains 3).",
      eg: "E.g.",
      step4Title: "Converting Repeating Decimals to Fractions",
      step4Desc: "Every repeating decimal originates from a unique fraction (generating form):",
      step4SimpleTitle: "For Pure Repeating (e.g. 0.",
      step4SimpleDesc: "Numerator is the period, and denominator has as many 9s as the digits of the period:",
      step4MixedTitle: "Algebraic Method (for Mixed):",
      step4MixedDesc: "Set x, multiply by 10 or 100 to align the period, and subtract the equations.",
      labBadge: "NUMBERS LAB",
      labTitle: "Interactive Fraction to Decimal Converter",
      labDesc: "Adjust the numerator and denominator to explore whether the decimal terminates or repeats.",
      labNumerator: "Numerator (m):",
      labDenominator: "Denominator (n):",
      labPresets: "TRY CLASSIC FRACTIONS:",
      labCardBadge: "FRACTION & DECIMAL FORM",
      badgeType: "Decimal Type",
      badgePeriod: "Period",
      badgePeriodLength: "Period Length",
      typeTerminating: "Terminating",
      typeMixed: "Mixed Repeating",
      typeSimple: "Pure Repeating",
      none: "None",
      digitsCount: (n) => `${n} ${n === 1 ? 'digit' : 'digits'}`,
      divExplanationTitle: "Division Insight:",
      divExplanationDivide: "Dividing the fraction",
      divTerminatingText: (val) => `the remainder becomes zero, meaning the decimal terminates (${val}).`,
      divPeriodicText: (period) => `the remainders cycle indefinitely, producing the repeating period ${period}.`,
      problemsSectionTitle: "Solved Practice Problems",
      p1Badge: "PROBLEM 1: ALGEBRAIC GENERATING FRACTION",
      p1Title: "Converting 0.4",
      p1TitleEnd: "to fraction",
      p1Statement: "Convert the mixed repeating decimal number x ＝ 0.4666... ＝ 0.4",
      p1StatementEnd: "into its equivalent irreducible fraction.",
      thStep: "Step",
      thEquation: "Equation",
      thPurpose: "Purpose",
      p1Step1: "1. Define x",
      p1Step1Purpose: "Initial equation (1)",
      p1Step2: "2. Times 10",
      p1Step2Purpose: "Shift non-repeating part",
      p1Step3: "3. Times 100",
      p1Step3Purpose: "Shift 1 full period",
      p1Step4: "4. Subtract",
      p1Step4Purpose: "Eliminate period",
      solveLabel: "Solve:",
      reductionLabel: "Simplify:",
      reductionText: "Divide by 6: 42 : 6 ＝ 7 and 90 : 6 ＝ 15.",
      irreducibleLabel: "Irreducible Fraction:",
      p2Badge: "PROBLEM 2: REAL-WORLD APPLICATION & DIVISION",
      p2Title: "Amount distribution and rounding",
      p2StatementPart1: "Three siblings equally split an amount of 100 €.",
      p2StatementPartA: "a) Exact fractional share and repeating decimal.",
      p2StatementPartB: "b) Actual amount paid per person (in euro cents).",
      thQuantity: "Quantity",
      thExpression: "Expression",
      thResult: "Result",
      p2Row1Label: "Fractional share",
      p2Row2Label: "Exact decimal form",
      p2Row3Label: "Actual payment",
      p2Row3Expr: "Rounded to 0.01",
      conclusionLabel: "Conclusion:",
      p2Conclusion: "Each sibling receives 33.33 €.",
      remainderLabel: "Remainder:",
      p2Remainder: "3 · 33.33 ＝ 99.99 €, leaving 0.01 € which cannot be subdivided further.",
      warningTitle: "ATTENTION: COMMON PITFALLS WITH RATIONAL NUMBERS",
      warning1Title: "Infinite decimals WITHOUT a period:",
      warning1Text: "Numbers like π ＝ 3.14159... or square root",
      warning1TextMid: "＝ 1.41421... have infinite decimal digits but NO period.",
      warning1TextEnd: "These numbers are called irrational and are NOT rational!",
      warning2Title: "Simplify before inspecting the denominator:",
      warning2Text: "The fraction must be irreducible first! In",
      warning2TextMid: "the denominator 30 contains 3, but simplifies to",
      warning2TextEnd: "＝ 0.3 (a terminating decimal).",
      warning3Title: "Incorrect position of the vinculum bar:",
      warning3Text: "In 1.2353535... the period is 35 and is written as 1.2",
      warning3TextEnd: "and NOT",
      warning3TextFinal: "nor 1.",
      warning4Title: "Difference between 0.999... and 1:",
      warning4Text: "The repeating decimal 0.",
      warning4TextMid: "is strictly equal to 1 (since",
      warning4TextEnd: "＝ 1).",
      ctaTitle: "Master Decimal Forms in Practice!",
      ctaDesc: "Test your skills with interactive questions and real-world problems with instant feedback and full solutions.",
      ctaButton: "START EXERCISES",
    }
  };

  const cur = t[locale] || t.el;
  const decimalSeparator = locale === 'el' ? ',' : '.';
  const formattedQuotient = (num / den).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
    maximumFractionDigits: 6
  });

  return (
    <Layout
      title={cur.metaTitle}
      description={cur.metaDesc}
      backUrl="/g-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(cur.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800 box-border">
        
        {/* HERO BANNER - RESPONSIVE 320px έως 8K */}
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
                href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(cur.heroCta)}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* MODULAR CARDS ΘΕΩΡΙΑΣ (4 ΒΗΜΑΤΑ) */}
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
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-center">
                <div className="font-mono text-xl sm:text-2xl font-black text-indigo-700 inline-block">
                  <Frac num={locale === 'el' ? 'μ' : 'm'} den={locale === 'el' ? 'ν' : 'n'} className="text-xl sm:text-2xl" />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium break-words [overflow-wrap:anywhere]">
                  {cur.step1Condition}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1IntegersLabel}</strong> {cur.step1IntegersDesc}</span>
                  <span className="font-mono font-bold text-indigo-800 inline-flex flex-wrap items-center gap-1">
                    5 ＝ <Frac num="5" den="1" />, －4 ＝ <Frac num="－4" den="1" />
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1DecimalsLabel}</strong> {cur.step1DecimalsDesc}</span>
                  <span className="font-mono font-bold text-indigo-800 inline-flex flex-wrap items-center gap-1">
                    0{decimalSeparator}75 ＝ <Frac num="75" den="100" /> ＝ <Frac num="3" den="4" />
                  </span>
                </div>
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
              
              <div className="space-y-2.5 mb-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
                  <span className="font-bold text-indigo-900 block mb-1">{cur.simplePeriodicTitle}</span>
                  <p className="mb-1 text-slate-600">{cur.simplePeriodicDesc}</p>
                  <div className="font-mono font-bold text-slate-800 mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Frac num="1" den="3" /> ＝ 0{decimalSeparator}333... ＝ 0{decimalSeparator}<Overline>3</Overline>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">{cur.simplePeriodicNote}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
                  <span className="font-bold text-indigo-900 block mb-1">{cur.mixedPeriodicTitle}</span>
                  <p className="mb-1 text-slate-600">{cur.mixedPeriodicDesc}</p>
                  <div className="font-mono font-bold text-slate-800 mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Frac num="5" den="6" /> ＝ 0{decimalSeparator}8333... ＝ 0{decimalSeparator}8<Overline>3</Overline>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">{cur.mixedPeriodicNote}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 break-words [overflow-wrap:anywhere]">
                <strong>{cur.notationTitle}</strong> {cur.notationDesc}<Overline>45</Overline> {cur.notationDescSuffix}
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

              <div className="space-y-2.5 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl text-emerald-950">
                  <div className="font-bold mb-1">{cur.step3FiniteTitle}</div>
                  <div>{cur.step3FiniteDesc}</div>
                  <div className="font-mono text-xs mt-1.5 text-slate-700 flex flex-wrap items-center gap-1.5">
                    <span>{cur.eg}</span>
                    <Frac num="7" den="20" />
                    <span>＝</span>
                    <Frac num="7" den={<>2<sup>2</sup> · 5</>} />
                    <span>＝</span>
                    <strong>0{decimalSeparator}35</strong>
                    <span className="font-sans text-[11px] text-slate-500">{cur.step3FiniteEnd}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl text-amber-950">
                  <div className="font-bold mb-1">{cur.step3PeriodicTitle}</div>
                  <div>{cur.step3PeriodicDesc}</div>
                  <div className="font-mono text-xs mt-1.5 text-slate-700 flex flex-wrap items-center gap-1.5">
                    <span>{cur.eg}</span>
                    <Frac num="4" den="15" />
                    <span>＝</span>
                    <Frac num="4" den="3 · 5" />
                    <span>＝</span>
                    <strong>0{decimalSeparator}2<Overline>6</Overline></strong>
                    <span className="font-sans text-[11px] text-slate-500">{cur.step3PeriodicEnd}</span>
                  </div>
                </div>
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

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>{cur.step4SimpleTitle}<Overline>7</Overline>):</strong>
                  <div className="mt-1">
                    {cur.step4SimpleDesc}
                    <div className="font-mono font-bold text-indigo-700 mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1">0{decimalSeparator}<Overline>7</Overline> ＝ <Frac num="7" den="9" /></span>
                      <span className="text-slate-300">|</span>
                      <span className="inline-flex items-center gap-1">0{decimalSeparator}<Overline>23</Overline> ＝ <Frac num="23" den="99" /></span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>{cur.step4MixedTitle}</strong>
                  <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.step4MixedDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - ULTRA RESPONSIVE MOBILE */}
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
            <div className="text-xs text-slate-500 max-w-xs break-words [overflow-wrap:anywhere]">
              {cur.labDesc}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">{cur.labNumerator}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{num}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={num}
                  onChange={(e) => setNum(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">{cur.labDenominator}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{den}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={den}
                  onChange={(e) => setDen(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Προεπιλογές για γρήγορη δοκιμή - Mobile Friendly Grid */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labPresets)}
                </span>
                <div className="grid grid-cols-3 xs:grid-cols-5 gap-1.5 text-xs">
                  <button type="button" onClick={() => { setNum(1); setDen(3); }} className="py-1 px-1.5 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono flex items-center justify-center"><Frac num="1" den="3" /></button>
                  <button type="button" onClick={() => { setNum(5); setDen(6); }} className="py-1 px-1.5 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono flex items-center justify-center"><Frac num="5" den="6" /></button>
                  <button type="button" onClick={() => { setNum(3); setDen(8); }} className="py-1 px-1.5 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono flex items-center justify-center"><Frac num="3" den="8" /></button>
                  <button type="button" onClick={() => { setNum(4); setDen(7); }} className="py-1 px-1.5 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono flex items-center justify-center"><Frac num="4" den="7" /></button>
                  <button type="button" onClick={() => { setNum(7); setDen(11); }} className="py-1 px-1.5 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono flex items-center justify-center"><Frac num="7" den="11" /></button>
                </div>
              </div>
            </div>

            {/* Dynamic Output - Responsive Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* Κεντρική κάρτα δεκαδικής αναπαράστασης */}
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full overflow-hidden min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labCardBadge)}
                </span>
                <div className="text-xl sm:text-3xl lg:text-4xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1 max-w-full">
                  <span className="inline-flex items-center gap-1.5 shrink-0">
                    <Frac num={num} den={den} className="text-xl sm:text-3xl" />
                    <span>＝</span>
                  </span>
                  <span className="text-emerald-400 break-all">
                    {expansion.integerPart}{decimalSeparator}
                    {expansion.isTerminating ? (
                      expansion.nonPeriodic
                    ) : (
                      <>
                        <span>{expansion.nonPeriodic}</span>
                        <Overline>{expansion.period}</Overline>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-2.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">{cur.badgeType}</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900 break-words [overflow-wrap:anywhere]">
                    {expansion.isTerminating ? cur.typeTerminating : expansion.nonPeriodic ? cur.typeMixed : cur.typeSimple}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">{cur.badgePeriod}</span>
                  <span className="text-xs sm:text-sm font-mono font-black text-indigo-900 break-all">
                    {expansion.isTerminating ? cur.none : expansion.period}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">{cur.badgePeriodLength}</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900">
                    {expansion.isTerminating ? cur.digitsCount(0) : cur.digitsCount(expansion.period.length)}
                  </span>
                </div>
              </div>

              {/* Ανάλυση διεργασίας */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                <strong>{cur.divExplanationTitle}</strong> {cur.divExplanationDivide} <Frac num={num} den={den} />,{' '}
                {expansion.isTerminating ? (
                  cur.divTerminatingText(formattedQuotient)
                ) : (
                  cur.divPeriodicText(expansion.period)
                )}
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ - OVERFLOW SAFE TABLES */}
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
                  {cur.p1Title}<Overline>6</Overline> {cur.p1TitleEnd}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                  {cur.p1Statement}<Overline>6</Overline> {cur.p1StatementEnd}
                </p>

                {/* Πίνακας με ασφαλές container scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thStep}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thEquation}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thPurpose}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step1}</td>
                        <td className="p-2 sm:p-2.5">x ＝ 0{decimalSeparator}4666...</td>
                        <td className="p-2 sm:p-2.5 font-sans text-slate-600">{cur.p1Step1Purpose}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step2}</td>
                        <td className="p-2 sm:p-2.5">10 · x ＝ 4{decimalSeparator}666...</td>
                        <td className="p-2 sm:p-2.5 font-sans text-slate-600">{cur.p1Step2Purpose}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step3}</td>
                        <td className="p-2 sm:p-2.5">100 · x ＝ 46{decimalSeparator}666...</td>
                        <td className="p-2 sm:p-2.5 font-sans text-slate-600">{cur.p1Step3Purpose}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step4}</td>
                        <td className="p-2 sm:p-2.5 text-indigo-700 font-bold">90 · x ＝ 42</td>
                        <td className="p-2 sm:p-2.5 font-sans text-slate-600">{cur.p1Step4Purpose}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong>{cur.solveLabel}</strong> x ＝ <Frac num="42" den="90" />.
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong>{cur.reductionLabel}</strong> {cur.reductionText}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong>{cur.irreducibleLabel}</strong>
                    <span className="font-mono font-bold text-emerald-900">
                      <Frac num="7" den="15" />
                    </span>.
                  </div>
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
                  {cur.p2StatementPart1} <br />
                  {cur.p2StatementPartA} <br />
                  {cur.p2StatementPartB}
                </p>

                {/* Πίνακας με ασφαλές container scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thQuantity}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thExpression}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">{cur.p2Row1Label}</td>
                        <td className="p-2 sm:p-2.5 font-mono"><Frac num="100" den="3" /></td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1"><Frac num="100" den="3" /> €</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">{cur.p2Row2Label}</td>
                        <td className="p-2 sm:p-2.5 font-mono"><Frac num="100" den="3" /></td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">33{decimalSeparator}<Overline>3</Overline> €</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">{cur.p2Row3Label}</td>
                        <td className="p-2 sm:p-2.5 font-mono">{cur.p2Row3Expr}</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">33{decimalSeparator}33 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.conclusionLabel}</strong> {cur.p2Conclusion}</div>
                  <div><strong>{cur.remainderLabel}</strong> {cur.p2Remainder}</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX - MOBILE PADDING ADJUSTED ΜΕ ΚΑΝΟΝΙΚΟ ΣΥΜΒΟΛΟ ΡΙΖΑΣ */}
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
                    <strong>{cur.warning1Title}</strong> {cur.warning1Text} <em>π ＝ 3{decimalSeparator}14159...</em> {cur.warning1TextMid} <em><Radical>2</Radical> ＝ 1{decimalSeparator}41421...</em>. {cur.warning1TextEnd}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning2Title}</strong> {cur.warning2Text} <Frac num="9" den="30" />, {cur.warning2TextMid} <Frac num="3" den="10" /> {cur.warning2TextEnd}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning3Title}</strong> {cur.warning3Text}<Overline>35</Overline> {cur.warning3TextEnd} <Overline>1{decimalSeparator}235</Overline> {cur.warning3TextFinal}<Overline>235</Overline>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning4Title}</strong> {cur.warning4Text}<Overline>9</Overline> {cur.warning4TextMid} <Frac num="9" den="9" /> {cur.warning4TextEnd}
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
            href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(cur.ctaButton)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}