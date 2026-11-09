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

export default function DekadikiMorfiArritonTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const dec = isEl ? ',' : '.';

  const [radicand, setRadicand] = useState(2);
  const [precision, setPrecision] = useState(2); // 0 = μονάδα, 1 = δέκατο, 2 = εκατοστό, 3 = χιλιοστό

  const exactRoot = Math.sqrt(radicand);
  const factor = Math.pow(10, precision);
  const lowerApproxNum = Math.floor(exactRoot * factor) / factor;
  const upperApproxNum = Math.ceil(exactRoot * factor) / factor;

  const lowerSqNum = (lowerApproxNum * lowerApproxNum).toFixed(precision * 2 || 1);
  const upperSqNum = (upperApproxNum * upperApproxNum).toFixed(precision * 2 || 1);

  const formatDec = (val) => String(val).replace('.', dec);

  const lowerApprox = formatDec(lowerApproxNum);
  const upperApprox = formatDec(upperApproxNum);
  const lowerSq = formatDec(lowerSqNum);
  const upperSq = formatDec(upperSqNum);
  const exactRootFormatted = formatDec(exactRoot.toFixed(6));
  const errorBound = formatDec(1 / factor);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    el: {
      metaTitle: "Δεκαδική Μορφή Άρρητων Αριθμών | Θεωρία Γ' Γυμνασίου",
      metaDesc: "Αναλυτική θεωρία για τους άρρητους αριθμούς, τη δεκαδική τους μορφή χωρίς περίοδο, τις ρητές προσεγγίσεις και το διαδραστικό εργαστήριο εγκλωβισμού.",
      backText: "Γ' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 2 • Γ' ΓΥΜΝΑΣΙΟΥ",
      heroTitle: "Δεκαδική Μορφή Άρρητων Αριθμών",
      heroSubtitle: "Πέρα από τα κλάσματα και τους περιοδικούς δεκαδικούς, υπάρχει ένας απέραντος κόσμος αριθμών που δεν φυλακίζονται σε καμία περίοδο. Ανακαλύψτε τους άρρητους αριθμούς, τη γεωμετρική τους γέννηση και τον τρόπο που τους προσεγγίζουμε με ρητούς.",
      heroCta: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      step1Title: "Τι είναι Άρρητος Αριθμός;",
      step1Desc: "Άρρητος ονομάζεται κάθε αριθμός που δεν μπορεί να γραφεί ως κλάσμα της μορφής",
      step1Condition: "(όπου μ ακέραιος και ν φυσικός διάφορος του μηδενός).",
      step1TraitTitle: "ΤΟ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ ΓΝΩΡΙΣΜΑ",
      step1TraitDesc: "Η δεκαδική μορφή ενός άρρητου αριθμού έχει άπειρα δεκαδικά ψηφία τα οποία ποτέ δεν επαναλαμβάνονται περιοδικά.",
      step1Root2: "Η τετραγωνική ρίζα του 2:",
      step1Pi: "Ο αριθμός π:",
      step1Root3: "Η τετραγωνική ρίζα του 3:",
      step2Title: "Γεωμετρική Γέννηση & Τοποθέτηση στον Άξονα",
      step2Desc: "Οι άρρητοι αριθμοί προκύπτουν άμεσα από βασικές γεωμετρικές κατασκευές μέσω του Πυθαγορείου Θεωρήματος.",
      step2SquareTitle: "Το Τετράγωνο με πλευρά 1:",
      step2SquareDesc: "Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 1 μονάδα, η υποτείνουσα d ικανοποιεί:",
      step2CompassTitle: "Μεταφορά στον Άξονα με Διαβήτη:",
      step2CompassDesc: "Με κέντρο το 0 και άνοιγμα ίσο με την υποτείνουσα d, γράφουμε τόξο που τέμνει τον άξονα σε ένα μοναδικό σημείο. Αυτό αποδεικνύει ότι ο άρρητος",
      step2CompassEnd: "είναι ένα απολύτως πραγματικό σημείο της ευθείας.",
      step3Title: "Ρητή Προσέγγιση & Εγκλωβισμός",
      step3Desc: "Στους πρακτικούς υπολογισμούς αντικαθιστούμε τους άρρητους με ρητές προσεγγίσεις (δεκαδικούς πεπερασμένων ψηφίων ή κλάσματα).",
      step3BoxTitle: "Προσέγγιση με έλλειψη και υπέρβαση:",
      step3BoxDesc: "Κάθε άρρητος εγκλωβίζεται ανάμεσα σε δύο ρητούς που απέχουν όσο επιθυμούμε:",
      step3UnitLabel: "Μονάδα:",
      step3TenthLabel: "Δέκατο:",
      step3HundredthLabel: "Εκατοστό:",
      step4Title: "Πραγματικοί Αριθμοί (ℝ)",
      step4Desc: "Το σύνολο των Πραγματικών Αριθμών (ℝ) αποτελείται από την ένωση των Ρητών και των Άρρητων αριθμών.",
      step4CoverageTitle: "Πλήρης Κάλυψη του Άξονα:",
      step4CoverageDesc: "Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό και αντίστροφα, χωρίς να μένει κανένα «κενό».",
      step4ClassificationTitle: "Συνοπτική Ταξινόμηση:",
      step4NatIntRat: "Φυσικοί (ℕ) ⊆ Ακέραιοι (ℤ) ⊆ Ρητοί (ℚ)",
      step4Irrationals: "Άρρητοι: ℝ ∖ ℚ (όλοι οι μη ρητοί)",
      step4Reals: "Πραγματικοί: ℝ ＝ ℚ ∪ (Άρρητοι)",
      labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΕΓΚΛΩΒΙΣΜΟΥ",
      labTitle: "Ρητή Προσέγγιση & Εγκλωβισμός Τετραγωνικής Ρίζας",
      labDesc: "Δείτε πώς στενεύει το εύρος εγκλωβισμού όσο αυξάνεται η ακρίβεια των δεκαδικών ψηφίων.",
      labSelectRadicand: "Επιλέξτε Υπόριζη Ποσότητα (N):",
      labPrecisionLevel: "Βαθμίδα Ακρίβειας Προσέγγισης:",
      precisions: [
        { label: "Μονάδα (1)", p: 0 },
        { label: "Δέκατο (0,1)", p: 1 },
        { label: "Εκατοστό (0,01)", p: 2 },
        { label: "Χιλιοστό (0,001)", p: 3 }
      ],
      labCalcValue: "Υπολογιστική Τιμή:",
      labCardBadge: "ΑΝΙΣΟΤΗΤΑ ΕΓΚΛΩΒΙΣΜΟΥ",
      labDeficit: "Έλλειψη:",
      labSurplus: "Υπέρβαση:",
      labVerificationTitle: "ΕΠΑΛΗΘΕΥΣΗ ΜΕΣΩ ΤΕΤΡΑΓΩΝΩΝ",
      labSqDeficit: "Τετράγωνο Ελλιπούς",
      labTargetN: "Στόχος (N)",
      labSqSurplus: "Τετράγωνο Υπερβολικού",
      labConclusionLabel: "Συμπέρασμα:",
      labConclusionPre: "Επειδή",
      labConclusionMid: ", ο άρρητος",
      labConclusionPost: "βρίσκεται πράγματι στο διάστημα",
      labConclusionError: "με σφάλμα μικρότερο από",
      problemsSectionTitle: "Λυμένα Προβλήματα Εφαρμογής",
      p1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΔΟΧΙΚΟΣ ΕΓΚΛΩΒΙΣΜΟΣ",
      p1Title: "Εγκλωβισμός του",
      p1TitleEnd: "με ακρίβεια δεκάτου",
      p1Statement: "Να εγκλωβιστεί ο άρρητος αριθμός",
      p1StatementEnd: "ανάμεσα σε δύο διαδοχικούς ακεραίους και στη συνέχεια ανάμεσα σε δύο διαδοχικά δέκατα.",
      thPrecision: "Ακρίβεια",
      thCalculation: "Υπολογισμός",
      thBounding: "Εγκλωβισμός",
      p1Row1Prec: "Μονάδα",
      p1Row2Prec: "Δέκατο",
      p1DeficitResult: "Προσέγγιση με έλλειψη (0,1):",
      p1SurplusResult: "Προσέγγιση με υπέρβαση (0,1):",
      p2Badge: "ΠΡΟΒΛΗΜΑ 2: ΠΡΑΚΤΙΚΗ ΧΡΗΣΗ ΤΟΥ π",
      p2Title: "Περίμετρος κυκλικού στίβου με ρητή προσέγγιση",
      p2StatementPart1: "Ένας κυκλικός στίβος έχει ακτίνα ρ ＝ 14 m.",
      p2StatementPartA: "α) Ακριβές μήκος L ως προς π.",
      p2StatementPartB: "β) Ρητή προσέγγιση με π ≈",
      p2StatementPartBEnd: "και π ≈ 3,14.",
      thApproach: "Προσέγγιση",
      thCalculationCol: "Υπολογισμός",
      thResult: "Αποτέλεσμα",
      p2ExactLabel: "Ακριβής (άρρητη)",
      p2FractionalLabel: "Κλασματική",
      p2DecimalLabel: "Δεκαδική (3,14)",
      conclusionLabel: "Συμπέρασμα:",
      p2Conclusion: "Στην καθημερινή πράξη και τεχνολογία χρησιμοποιούμε ρητές προσεγγίσεις όπως το 3,14 ή το",
      warningTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΑΡΡΗΤΟΥΣ ΑΡΙΘΜΟΥΣ",
      warning1Title: "Ο αριθμός π ΔΕΝ ισούται με 3,14 ούτε με",
      warning1Text: "Ο αριθμός π είναι αυστηρά άρρητος. Το 3,14 και το",
      warning1TextEnd: "είναι ρητές προσεγγίσεις του και όχι η ακριβής τιμή του!",
      warning2Title: "Δεν είναι όλες οι ρίζες άρρητοι:",
      warning2TextPre: "Οι ρίζες των τέλειων τετραγώνων είναι ρητοί (ακέραιοι ή δεκαδικοί) αριθμοί (π.χ.",
      warning2TextMid: "＝ 2,",
      warning2TextMid2: "＝ 3,",
      warning2TextMid3: "＝ 0,5). Άρρητες είναι μόνο οι ρίζες μη τέλειων τετραγώνων.",
      warning3Title: "Άπειρα ψηφία δεν σημαίνει πάντα άρρητος:",
      warning3TextPre: "Ο αριθμός 0,333... έχει άπειρα ψηφία αλλά είναι ρητός διότι έχει περίοδο (ισούται με",
      warning3TextPost: "). Άρρητος είναι μόνο αυτός που έχει άπειρα ψηφία χωρίς περίοδο.",
      warning4Title: "Πράξεις με άρρητους:",
      warning4TextPre: "Το άθροισμα ενός ρητού και ενός άρρητου (π.χ. 3 ＋",
      warning4TextPost: ") είναι πάντοτε άρρητος αριθμός.",
      ctaTitle: "Εμπεδώστε τους Άρρητους Αριθμούς στην Πράξη!",
      ctaDesc: "Δοκιμάστε τις δυνάμεις σας στις διαδραστικές ερωτήσεις και τα προβλήματα εγκλωβισμού με άμεση ανατροφοδότηση.",
      ctaButton: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
    },
    en: {
      metaTitle: "Decimal Form of Irrational Numbers | Theory 9th Grade",
      metaDesc: "Detailed theory on irrational numbers, their non-repeating decimal form, rational approximations, and an interactive bounding lab.",
      backText: "9th Grade",
      btnExercises: "EXERCISES",
      chapterBadge: "CHAPTER 2 • 9TH GRADE",
      heroTitle: "Decimal Form of Irrational Numbers",
      heroSubtitle: "Beyond fractions and repeating decimals lies a vast realm of numbers never bound by any repeating period. Discover irrational numbers, their geometric emergence, and how we approximate them using rationals.",
      heroCta: "GO TO EXERCISES",
      step1Title: "What is an Irrational Number?",
      step1Desc: "An irrational number is any number that cannot be written as a fraction of the form",
      step1Condition: "(where m is an integer and n is a non-zero natural number).",
      step1TraitTitle: "DISTINGUISHING CHARACTERISTIC",
      step1TraitDesc: "The decimal representation of an irrational number contains infinite decimal digits that never repeat periodically.",
      step1Root2: "The square root of 2:",
      step1Pi: "The number π:",
      step1Root3: "The square root of 3:",
      step2Title: "Geometric Emergence & Placement on the Number Line",
      step2Desc: "Irrational numbers arise directly from fundamental geometric constructions via the Pythagorean Theorem.",
      step2SquareTitle: "Square with Side Length 1:",
      step2SquareDesc: "In a right-angled triangle with perpendicular legs of 1 unit, the hypotenuse d satisfies:",
      step2CompassTitle: "Transfer to the Number Line using a Compass:",
      step2CompassDesc: "With center at 0 and radius equal to the hypotenuse d, we draw an arc intersecting the number line at a unique point. This proves that the irrational",
      step2CompassEnd: "is a completely genuine point on the real line.",
      step3Title: "Rational Approximation & Bounding",
      step3Desc: "In practical calculations, we replace irrationals with rational approximations (finite decimals or fractions).",
      step3BoxTitle: "Under- and over-approximation (bounding):",
      step3BoxDesc: "Every irrational can be enclosed between two rationals as close to each other as desired:",
      step3UnitLabel: "Unit:",
      step3TenthLabel: "Tenth:",
      step3HundredthLabel: "Hundredth:",
      step4Title: "Real Numbers (ℝ)",
      step4Desc: "The set of Real Numbers (ℝ) consists of the union of Rational and Irrational numbers.",
      step4CoverageTitle: "Complete Coverage of the Number Line:",
      step4CoverageDesc: "Every point on the line corresponds to a unique real number and vice versa, leaving no gaps whatsoever.",
      step4ClassificationTitle: "Summary Classification:",
      step4NatIntRat: "Naturals (ℕ) ⊆ Integers (ℤ) ⊆ Rationals (ℚ)",
      step4Irrationals: "Irrationals: ℝ ∖ ℚ (all non-rationals)",
      step4Reals: "Reals: ℝ ＝ ℚ ∪ (Irrationals)",
      labBadge: "BOUNDING LAB",
      labTitle: "Rational Approximation & Square Root Bounding",
      labDesc: "Observe how the bounding interval narrows as decimal precision increases.",
      labSelectRadicand: "Select Radicand (N):",
      labPrecisionLevel: "Approximation Precision Level:",
      precisions: [
        { label: "Unit (1)", p: 0 },
        { label: "Tenth (0.1)", p: 1 },
        { label: "Hundredth (0.01)", p: 2 },
        { label: "Thousandth (0.001)", p: 3 }
      ],
      labCalcValue: "Calculated Value:",
      labCardBadge: "BOUNDING INEQUALITY",
      labDeficit: "Under:",
      labSurplus: "Over:",
      labVerificationTitle: "VERIFICATION VIA SQUARES",
      labSqDeficit: "Under-approx. Squared",
      labTargetN: "Target (N)",
      labSqSurplus: "Over-approx. Squared",
      labConclusionLabel: "Conclusion:",
      labConclusionPre: "Since",
      labConclusionMid: ", the irrational",
      labConclusionPost: "indeed lies within the interval",
      labConclusionError: "with error strictly less than",
      problemsSectionTitle: "Solved Practice Problems",
      p1Badge: "PROBLEM 1: SUCCESSIVE BOUNDING",
      p1Title: "Bounding of",
      p1TitleEnd: "to the nearest tenth",
      p1Statement: "Bound the irrational number",
      p1StatementEnd: "between two consecutive integers and subsequently between two consecutive tenths.",
      thPrecision: "Precision",
      thCalculation: "Calculation",
      thBounding: "Bounding",
      p1Row1Prec: "Unit",
      p1Row2Prec: "Tenth",
      p1DeficitResult: "Under-approximation (0.1):",
      p1SurplusResult: "Over-approximation (0.1):",
      p2Badge: "PROBLEM 2: PRACTICAL USE OF π",
      p2Title: "Circumference of a circular track using rational approximation",
      p2StatementPart1: "A circular running track has a radius of ρ ＝ 14 m.",
      p2StatementPartA: "a) Exact circumference L in terms of π.",
      p2StatementPartB: "b) Rational approximation with π ≈",
      p2StatementPartBEnd: "and π ≈ 3.14.",
      thApproach: "Approach",
      thCalculationCol: "Calculation",
      thResult: "Result",
      p2ExactLabel: "Exact (irrational)",
      p2FractionalLabel: "Fractional",
      p2DecimalLabel: "Decimal (3.14)",
      conclusionLabel: "Conclusion:",
      p2Conclusion: "In practical engineering, we routinely employ rational approximations such as 3.14 or",
      warningTitle: "ATTENTION: COMMON PITFALLS WITH IRRATIONAL NUMBERS",
      warning1Title: "The number π does NOT equal 3.14 nor",
      warning1Text: "The number π is strictly irrational. Both 3.14 and",
      warning1TextEnd: "are rational approximations, never its exact value!",
      warning2Title: "Not all roots are irrational:",
      warning2TextPre: "Square roots of perfect squares are rational (integer or terminating decimal) numbers (e.g.",
      warning2TextMid: "＝ 2,",
      warning2TextMid2: "＝ 3,",
      warning2TextMid3: "＝ 0.5). Only roots of non-perfect squares are irrational.",
      warning3Title: "Infinite digits do not automatically imply irrationality:",
      warning3TextPre: "The number 0.333... has infinitely many digits but is rational because it repeats periodically (equals",
      warning3TextPost: "). Only a number with infinite non-repeating digits is irrational.",
      warning4Title: "Operations with irrationals:",
      warning4TextPre: "The sum of a rational and an irrational number (e.g. 3 ＋",
      warning4TextPost: ") is always an irrational number.",
      ctaTitle: "Master Irrational Numbers in Practice!",
      ctaDesc: "Test your skills with interactive questions and applied bounding problems with instant feedback.",
      ctaButton: "START EXERCISES"
    }
  };

  const cur = t[locale] || t.el;

  return (
    <Layout
      title={cur.metaTitle}
      description={cur.metaDesc}
      backUrl="/g-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
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
                href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(cur.heroCta)}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ - RESPONSIVE 1/2 COLS */}
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
                <strong>{isEl ? 'Άρρητος' : 'Irrational'}</strong> {cur.step1Desc}{' '}
                <Frac num={isEl ? 'μ' : 'm'} den={isEl ? 'ν' : 'n'} /> {cur.step1Condition}
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3">
                <h3 className="font-bold text-indigo-900 mb-1.5 text-xs sm:text-sm uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.step1TraitTitle)}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere]">
                  {cur.step1TraitDesc}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1Root2}</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all inline-flex items-center gap-1">
                    <Radical>2</Radical> ＝ 1{dec}41421356...
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1Pi}</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all">π ＝ 3{dec}14159265...</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1Root3}</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all inline-flex items-center gap-1">
                    <Radical>3</Radical> ＝ 1{dec}73205080...
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
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-indigo-900">{cur.step2SquareTitle}</div>
                <p className="break-words [overflow-wrap:anywhere]">
                  {cur.step2SquareDesc}
                </p>
                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-center text-indigo-700 text-xs sm:text-sm inline-flex flex-wrap items-center justify-center w-full gap-1.5">
                  <span>d<sup>2</sup> ＝ 1<sup>2</sup> ＋ 1<sup>2</sup> ＝ 2 &nbsp;⇒&nbsp; d ＝</span>
                  <Radical>2</Radical>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed break-words [overflow-wrap:anywhere]">
                <strong>{cur.step2CompassTitle}</strong> {cur.step2CompassDesc} <Radical>2</Radical> {cur.step2CompassEnd}
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
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">{cur.step3BoxTitle}</span>
                  <p className="text-slate-600 mb-2">{cur.step3BoxDesc}</p>
                  <div className="font-mono text-[11px] sm:text-xs space-y-1.5 text-slate-700">
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
                      <span>{cur.step3UnitLabel} 1 ＜</span>
                      <Radical>2</Radical>
                      <span>＜ 2 (1<sup>2</sup> ＝ 1 ＜ 2 ＜ 4 ＝ 2<sup>2</sup>)</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
                      <span>{cur.step3TenthLabel} 1{dec}4 ＜</span>
                      <Radical>2</Radical>
                      <span>＜ 1{dec}5 (1{dec}4<sup>2</sup> ＝ 1{dec}96 ＜ 2 ＜ 2{dec}25 ＝ 1{dec}5<sup>2</sup>)</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
                      <span>{cur.step3HundredthLabel} 1{dec}41 ＜</span>
                      <Radical>2</Radical>
                      <span>＜ 1{dec}42 (1{dec}41<sup>2</sup> ＝ 1{dec}9881 ＜ 2 ＜ 2{dec}0164 ＝ 1{dec}42<sup>2</sup>)</span>
                    </div>
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

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div className="font-bold text-indigo-900">{cur.step4CoverageTitle}</div>
                <p className="break-words [overflow-wrap:anywhere]">
                  {cur.step4CoverageDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                <strong>{cur.step4ClassificationTitle}</strong>
                <ul className="mt-1.5 space-y-1 font-mono text-[11px] sm:text-xs">
                  <li>{cur.step4NatIntRat}</li>
                  <li>{cur.step4Irrationals}</li>
                  <li>{cur.step4Reals}</li>
                </ul>
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
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  {cur.labSelectRadicand}
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[2, 3, 5, 7, 8, 10, 11, 13].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRadicand(val)}
                      className={`py-2 px-1 rounded-xl font-mono font-bold text-xs sm:text-sm border transition-all ${
                        radicand === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Radical>{val}</Radical>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  {cur.labPrecisionLevel}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {cur.precisions.map((item) => (
                    <button
                      type="button"
                      key={item.p}
                      onClick={() => setPrecision(item.p)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        precision === item.p
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 break-words [overflow-wrap:anywhere]">
                <strong>{cur.labCalcValue}</strong> <br />
                <span className="font-mono text-xs sm:text-sm font-bold break-all inline-flex items-center gap-1 mt-0.5">
                  <Radical>{radicand}</Radical> ＝ {exactRootFormatted}...
                </span>
              </div>
            </div>

            {/* Dynamic Output - Responsive Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* Ανισότητα Εγκλωβισμού */}
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full overflow-hidden min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labCardBadge)}
                </span>
                <div className="text-base sm:text-2xl lg:text-3xl font-mono font-black flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 py-1 max-w-full">
                  <span className="text-amber-300">{lowerApprox}</span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-white inline-flex items-center shrink-0"><Radical>{radicand}</Radical></span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-emerald-300">{upperApprox}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-2 font-mono flex flex-wrap justify-center gap-2">
                  <span>{cur.labDeficit} {lowerApprox}</span>
                  <span>|</span>
                  <span>{cur.labSurplus} {upperApprox}</span>
                </div>
              </div>

              {/* Έλεγχος Τετραγώνων */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full min-w-0">
                <span className="text-xs font-bold text-slate-700 block mb-2.5 uppercase break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labVerificationTitle)}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 min-w-0">
                    <span className="text-slate-500 block text-[10px] sm:text-xs mb-0.5">{cur.labSqDeficit}</span>
                    <span className="font-bold text-amber-700 text-xs sm:text-sm break-all">{lowerApprox}<sup>2</sup> ＝ {lowerSq}</span>
                  </div>

                  <div className="p-2.5 bg-indigo-100/60 rounded-xl border border-indigo-200 min-w-0">
                    <span className="text-indigo-800 font-bold block text-[10px] sm:text-xs mb-0.5">{cur.labTargetN}</span>
                    <span className="font-black text-indigo-950 text-sm sm:text-base">{radicand}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 min-w-0">
                    <span className="text-slate-500 block text-[10px] sm:text-xs mb-0.5">{cur.labSqSurplus}</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-sm break-all">{upperApprox}<sup>2</sup> ＝ {upperSq}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <strong>{cur.labConclusionLabel}</strong> {cur.labConclusionPre} <strong>{lowerSq} ＜ {radicand} ＜ {upperSq}</strong>{cur.labConclusionMid}{' '}
                  <span className="inline-flex items-center"><Radical>{radicand}</Radical></span>{' '}
                  {cur.labConclusionPost} <strong>[{lowerApprox}, {upperApprox}]</strong> {cur.labConclusionError} {errorBound}.
                </div>
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
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                  <span>{cur.p1Title}</span>
                  <Radical>5</Radical>
                  <span>{cur.p1TitleEnd}</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                  {cur.p1Statement} <strong><Radical>5</Radical></strong> {cur.p1StatementEnd}
                </p>

                {/* Πίνακας με ασφαλές container scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thPrecision}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thCalculation}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thBounding}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Row1Prec}</td>
                        <td className="p-2 sm:p-2.5">2<sup>2</sup> ＝ 4 ＜ 5 ＜ 9 ＝ 3<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1">2 ＜ <Radical>5</Radical> ＜ 3</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Row2Prec}</td>
                        <td className="p-2 sm:p-2.5">2{dec}2<sup>2</sup> ＝ 4{dec}84 ＜ 5 ＜ 5{dec}29 ＝ 2{dec}3<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1">2{dec}2 ＜ <Radical>5</Radical> ＜ 2{dec}3</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.p1DeficitResult}</strong> 2{dec}2.</div>
                  <div><strong>{cur.p1SurplusResult}</strong> 2{dec}3.</div>
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
                  {cur.p2StatementPartB} <Frac num="22" den="7" /> {cur.p2StatementPartBEnd}
                </p>

                {/* Πίνακας με ασφαλές container scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thApproach}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thCalculationCol}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">{cur.p2ExactLabel}</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · π · 14</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">28 · π m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">
                          <span className="inline-flex items-center gap-1">{cur.p2FractionalLabel} (<Frac num="22" den="7" />)</span>
                        </td>
                        <td className="p-2 sm:p-2.5 font-mono">
                          <span className="inline-flex items-center gap-1">2 · <Frac num="22" den="7" /> · 14</span>
                        </td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">88 m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">{cur.p2DecimalLabel}</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · 3{dec}14 · 14</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">87{dec}92 m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div>
                    <strong>{cur.conclusionLabel}</strong> {cur.p2Conclusion} <Frac num="22" den="7" />.
                  </div>
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
                    <strong>{cur.warning1Title} <Frac num="22" den="7" />:</strong> {cur.warning1Text} <Frac num="22" den="7" /> {cur.warning1TextEnd}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning2Title}</strong> {cur.warning2TextPre} <Radical>4</Radical> {cur.warning2TextMid} <Radical>9</Radical> {cur.warning2TextMid2} <Radical>0{dec}25</Radical> {cur.warning2TextMid3}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning3Title}</strong> {cur.warning3TextPre} <Frac num="1" den="3" />{cur.warning3TextPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning4Title}</strong> {cur.warning4TextPre} <Radical>2</Radical>{cur.warning4TextPost}
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
            href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(cur.ctaButton)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}