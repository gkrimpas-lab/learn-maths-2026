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

// Δεδομένα για το διαδραστικό εργαστήριο με υποστήριξη i18n
const getLabNumbers = (locale) => {
  const isEl = locale === 'el';
  const dec = isEl ? ',' : '.';
  return [
    {
      id: 'sqrt2',
      label: '√2',
      value: 1.4142,
      display: <Radical>2</Radical>,
      approx: `≈ 1${dec}414`,
      minSet: isEl ? 'Άρρητος' : 'Irrational',
      sets: isEl ? ['Άρρητοι', 'ℝ'] : ['Irrationals', 'ℝ']
    },
    {
      id: 'frac',
      label: '-3/2',
      value: -1.5,
      display: <Frac num="－3" den="2" />,
      approx: `＝ －1${dec}5`,
      minSet: isEl ? 'ℚ (Ρητός)' : 'ℚ (Rational)',
      sets: ['ℚ', 'ℝ']
    },
    {
      id: 'pi',
      label: 'π',
      value: 3.1415,
      display: 'π',
      approx: `≈ 3${dec}1415`,
      minSet: isEl ? 'Άρρητος' : 'Irrational',
      sets: isEl ? ['Άρρητοι', 'ℝ'] : ['Irrationals', 'ℝ']
    },
    {
      id: 'sqrt5',
      label: '√5',
      value: 2.236,
      display: <Radical>5</Radical>,
      approx: `≈ 2${dec}236`,
      minSet: isEl ? 'Άρρητος' : 'Irrational',
      sets: isEl ? ['Άρρητοι', 'ℝ'] : ['Irrationals', 'ℝ']
    },
    {
      id: 'int_neg',
      label: '-3',
      value: -3,
      display: '－3',
      approx: '＝ －3',
      minSet: isEl ? 'ℤ (Ακέραιος)' : 'ℤ (Integer)',
      sets: ['ℤ', 'ℚ', 'ℝ']
    },
    {
      id: 'dec',
      label: isEl ? '2,75' : '2.75',
      value: 2.75,
      display: `2${dec}75`,
      approx: <span className="inline-flex items-center gap-1">＝ <Frac num="11" den="4" /></span>,
      minSet: isEl ? 'ℚ (Ρητός)' : 'ℚ (Rational)',
      sets: ['ℚ', 'ℝ']
    },
    {
      id: 'nat',
      label: '4',
      value: 4,
      display: '4',
      approx: '＝ 4',
      minSet: isEl ? 'ℕ (Φυσικός)' : 'ℕ (Natural)',
      sets: ['ℕ', 'ℤ', 'ℚ', 'ℝ']
    }
  ];
};

export default function PragmatikoiTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const dec = isEl ? ',' : '.';

  const [selectedNumId, setSelectedNumId] = useState('sqrt2');

  const labNumbers = getLabNumbers(locale);
  const activeNum = labNumbers.find((n) => n.id === selectedNumId) || labNumbers[0];

  // Παράμετροι άξονα στο SVG (viewBox: 0 0 500 110)
  const originX = 230;
  const unitPx = 55;
  const pinX = Math.max(35, Math.min(465, originX + activeNum.value * unitPx));

  const formatDec = (val) => String(val).replace('.', dec);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    el: {
      metaTitle: "Πραγματικοί Αριθμοί | Θεωρία Γ' Γυμνασίου",
      metaDesc: "Αναλυτική θεωρία για τους πραγματικούς αριθμούς, τη διάταξη, τις σχέσεις συνόλων, την τοποθέτηση στον άξονα και διαδραστικό εργαστήριο.",
      backText: "Γ' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 3 • Γ' ΓΥΜΝΑΣΙΟΥ",
      heroTitle: "Πραγματικοί Αριθμοί",
      heroSubtitle: "Η ένωση όλων των αριθμών σε ένα ολοκληρωμένο σύνολο: από τους φυσικούς και τους ακεραίους, έως τα ρητά κλάσματα και τις άρρητες ρίζες. Μάθετε πώς διατάσσονται στην ευθεία των πραγματικών αριθμών χωρίς να μένει κανένα απολύτως κενό.",
      heroCta: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      step1Title: "Η Έννοια των Πραγματικών Αριθμών (ℝ)",
      step1Desc: "Πραγματικοί αριθμοί (ℝ) ονομάζονται όλοι οι αριθμοί που είναι είτε ρητοί είτε άρρητοι.",
      step1Union: "ℝ ＝ ℚ ∪ (Άρρητοι Αριθμοί)",
      step1Condition: "Κάθε πραγματικός αριθμός έχει δεκαδική μορφή (πεπερασμένη, περιοδική ή άπειρη μη περιοδική).",
      step1RationalsLabel: "Ρητοί (ℚ):",
      step1RationalsDesc: "Κλάσματα ακεραίων",
      step1IrrationalsLabel: "Άρρητοι:",
      step1IrrationalsDesc: "Μη περιοδικά άπειρα ψηφία",
      step2Title: "Ιεραρχία & Σχέσεις Συνόλων",
      step2Desc: "Τα αριθμητικά σύνολα συνδέονται μεταξύ τους με σχέσεις διαδοχικού εγκλεισμού (υποσύνολα):",
      step2ChainDesc: "Φυσικοί ⊆ Ακέραιοι ⊆ Ρητοί ⊆ Πραγματικοί",
      step2Naturals: "• Φυσικοί (ℕ): 0, 1, 2, 3, 4, ...",
      step2Integers: "• Ακέραιοι (ℤ): ..., －3, －2, －1, 0, 1, 2, 3, ...",
      step2Disjoint: "• Ρητοί (ℚ) και Άρρητοι είναι ξένα σύνολα (δεν έχουν κανένα κοινό στοιχείο: ℚ ∩ Άρρητοι ＝ ∅).",
      step3Title: "Διάταξη Πραγματικών Αριθμών",
      step3Desc: "Για οποιουσδήποτε δύο πραγματικούς αριθμούς α και β, ισχύει ακριβώς μία από τις τρεις σχέσεις: α ＜ β, α ＝ β ή α ＞ β.",
      step3CompTitle: "Σύγκριση Άρρητου με Ρητό:",
      step3CompDesc: "Χρησιμοποιούμε τη μέθοδο των τετραγώνων (για θετικούς αριθμούς) ή ρητές προσεγγίσεις:",
      step3CompExampleIntro: "Συγκρίνουμε τους αριθμούς",
      step3CompExampleSince: "Επειδή 7 ＞ 6,25, προκύπτει ότι:",
      step3NegTitle: "Σύγκριση Αρνητικών:",
      step3NegDesc: "Μεταξύ δύο αρνητικών αριθμών, μεγαλύτερος είναι εκείνος που έχει τη μικρότερη απόλυτη τιμή:",
      step4Title: "Ο Άξονας των Πραγματικών Αριθμών",
      step4Desc: "Υπάρχει μια αμφιμονοσήμαντη (1-προς-1) αντιστοιχία ανάμεσα στους πραγματικούς αριθμούς και τα σημεία μιας ευθείας:",
      step4CompletenessTitle: "Η Αρχή της Πληρότητας:",
      step4CompletenessPoint1: "• Κάθε πραγματικός αριθμός παριστάνεται από ένα μοναδικό σημείο της ευθείας.",
      step4CompletenessPoint2: "• Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό (την τετμημένη του).",
      step4GeomTitle: "Γεωμετρική Ερμηνεία Διάταξης:",
      step4GeomDesc: "Αν α ＜ β, τότε το σημείο Α(α) βρίσκεται αριστερότερα από το σημείο Β(β) στον προσανατολισμένο άξονα.",
      labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΑΞΟΝΑ",
      labTitle: "Διαδραστική Τοποθέτηση Πραγματικού Αριθμού στον Άξονα",
      labDesc: "Επιλέξτε έναν αριθμό για να δείτε την ακριβή του θέση στον άξονα και την ταξινόμησή του στα σύνολα.",
      labSelectNumber: "Επιλέξτε Αριθμό προς Τοποθέτηση:",
      labApprox: "Προσέγγιση:",
      labMinSet: "Ελάχιστο Σύνολο:",
      labBelongsTo: "Ανήκει στα Σύνολα:",
      labAxisHeader: "ΟΠΤΙΚΟΣ ΑΞΟΝΑΣ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ x'Ox",
      labAxisPosition: (label, val, isRight) => `Ο αριθμός ${label} βρίσκεται ${isRight ? 'δεξιά' : 'αριστερά'} από το μηδέν (O), με τετμημένη x ≈ ${val}.`,
      labConclusionTitle: "Συμπέρασμα Τοποθέτησης:",
      labConclusionDesc: (label) => `Κάθε πραγματικός αριθμός αντιστοιχεί σε ακριβώς ένα γεωμετρικό σημείο του άξονα. Όλοι οι αριθμοί αριστερά του ${label} είναι μικρότεροι από αυτόν, ενώ όλοι οι αριθμοί δεξιά είναι μεγαλύτεροι.`,
      problemsSectionTitle: "Λυμένα Προβλήματα Εφαρμογής",
      p1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΤΑΞΗ & ΣΥΓΚΡΙΣΗ",
      p1Title: "Σύγκριση πραγματικών αριθμών",
      p1Statement: "Να διαταχθούν από τον μικρότερο προς τον μεγαλύτερο (σε αύξουσα σειρά) οι πραγματικοί αριθμοί:",
      thNumber: "Αριθμός",
      thDecimalForm: "Δεκαδική Μορφή / Προσέγγιση",
      thOrderPosition: "Θέση στη Σειρά",
      p1Row1Form: "－2,0 (αρνητικός)",
      p1Row1Pos: "1ος (μικρότερος)",
      p1Row2Form: "0,0 (ουδέτερος)",
      p1Row2Pos: "2ος",
      p1Row3Form: "1,50",
      p1Row3Pos: "3ος",
      p1Row5Pos: "5ος (μεγαλύτερος)",
      p1FinalOrderLabel: "Τελική Αύξουσα Διάταξη:",
      p2Badge: "ΠΡΟΒΛΗΜΑ 2: ΤΑΞΙΝΟΜΗΣΗ ΣΕ ΣΥΝΟΛΑ",
      p2Title: "Αναγνώριση συνόλων ανήκειν",
      p2Statement: "Να προσδιοριστεί σε ποια από τα αριθμητικά σύνολα ℕ, ℤ, ℚ, ℝ ανήκει καθένας από τους παρακάτω αριθμούς:",
      thForm: "Μορφή",
      thBelongs: "Ανήκει στα Σύνολα",
      p2Row1Form: "Τέλειο τετράγωνο (＝ 4)",
      p2Row2Form: "Ακέραιο πηλίκο (＝ －3)",
      p2Row2Belongs: "ℤ, ℚ, ℝ (όχι ℕ)",
      p2Row3Form: "Περιοδικός (＝ 1/3)",
      p2Row4Form: "Μη τέλειο τετράγωνο",
      p2Row4Belongs: "Μόνο ℝ (Άρρητος)",
      conclusionLabel: "Βασικός Κανόνας:",
      p2Conclusion: "Αν ένας αριθμός ανήκει στο ℕ, ανήκει αυτόματα και στα ℤ, ℚ, ℝ. Αν είναι άρρητος, ανήκει αποκλειστικά στο ℝ.",
      warningTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΠΡΑΓΜΑΤΙΚΟΥΣ ΑΡΙΘΜΟΥΣ",
      warning1Title: "Αρνητικοί αριθμοί κάτω από ρίζα:",
      warning1TextPre: "Παραστάσεις όπως η ρίζα του －4 (",
      warning1TextMid: ") ή του －9 (",
      warning1TextEnd: ") ΔΕΝ είναι πραγματικοί αριθμοί. Στο σύνολο ℝ δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού.",
      warning2Title: "Ρητός και Άρρητος δεν συμπίπτουν ποτέ:",
      warning2Text: "Κανένας αριθμός δεν μπορεί να είναι ταυτόχρονα ρητός και άρρητος. Είναι δύο απολύτως ξένα σύνολα.",
      warning3Title: "Σύγκριση αρνητικών ριζών:",
      warning3TextPre: "Όπως －3 ＜ －2, έτσι και",
      warning3TextMid: "＜",
      warning3TextPost: "διότι",
      warning3TextEnd: "Με το μείον η φορά της ανισότητας αντιστρέφεται!",
      ctaTitle: "Εμπεδώστε τους Πραγματικούς Αριθμούς στην Πράξη!",
      ctaDesc: "Δοκιμάστε τις γνώσεις σας στις διαδραστικές ερωτήσεις και τα προβλήματα διάταξης με άμεση ανατροφοδότηση.",
      ctaButton: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
    },
    en: {
      metaTitle: "Real Numbers | Theory 9th Grade",
      metaDesc: "Detailed theory on real numbers, ordering, number set hierarchies, number line plotting, and interactive visualization lab.",
      backText: "9th Grade",
      btnExercises: "EXERCISES",
      chapterBadge: "CHAPTER 3 • 9TH GRADE",
      heroTitle: "Real Numbers",
      heroSubtitle: "The complete unification of numbers into a comprehensive set: from natural numbers and integers to rational fractions and irrational roots. Learn how they are ordered on the real line leaving no gaps whatsoever.",
      heroCta: "GO TO EXERCISES",
      step1Title: "The Concept of Real Numbers (ℝ)",
      step1Desc: "Real numbers (ℝ) are all numbers that are either rational or irrational.",
      step1Union: "ℝ ＝ ℚ ∪ (Irrational Numbers)",
      step1Condition: "Every real number has a decimal expansion (finite, repeating, or infinite non-repeating).",
      step1RationalsLabel: "Rationals (ℚ):",
      step1RationalsDesc: "Fractions of integers",
      step1IrrationalsLabel: "Irrationals:",
      step1IrrationalsDesc: "Non-repeating infinite digits",
      step2Title: "Hierarchy & Set Relationships",
      step2Desc: "Number sets are connected via successive subset inclusions:",
      step2ChainDesc: "Naturals ⊆ Integers ⊆ Rationals ⊆ Reals",
      step2Naturals: "• Naturals (ℕ): 0, 1, 2, 3, 4, ...",
      step2Integers: "• Integers (ℤ): ..., －3, －2, －1, 0, 1, 2, 3, ...",
      step2Disjoint: "• Rationals (ℚ) and Irrationals are disjoint sets (they share no elements: ℚ ∩ Irrationals ＝ ∅).",
      step3Title: "Ordering of Real Numbers",
      step3Desc: "For any two real numbers a and b, exactly one of three relations holds: a ＜ b, a ＝ b, or a ＞ b.",
      step3CompTitle: "Comparing Irrational with Rational:",
      step3CompDesc: "We use the method of squares (for positive numbers) or rational approximations:",
      step3CompExampleIntro: "For example, comparing the numbers",
      step3CompExampleSince: "Since 7 ＞ 6.25, it follows that:",
      step3NegTitle: "Comparing Negative Numbers:",
      step3NegDesc: "Between two negative numbers, the greater is the one with the smaller absolute value:",
      step4Title: "The Real Number Line",
      step4Desc: "There is a one-to-one (bijective) correspondence between real numbers and points on a line:",
      step4CompletenessTitle: "The Completeness Principle:",
      step4CompletenessPoint1: "• Every real number is represented by a unique point on the line.",
      step4CompletenessPoint2: "• Every point on the line corresponds to a unique real number (its coordinate).",
      step4GeomTitle: "Geometric Interpretation of Ordering:",
      step4GeomDesc: "If a ＜ b, then point A(a) lies strictly to the left of point B(b) on the oriented axis.",
      labBadge: "NUMBER LINE LAB",
      labTitle: "Interactive Real Number Placement on the Axis",
      labDesc: "Select a number to visualize its exact position on the real line and inspect its set classification.",
      labSelectNumber: "Select Number to Plot:",
      labApprox: "Approximation:",
      labMinSet: "Smallest Set:",
      labBelongsTo: "Belongs to Sets:",
      labAxisHeader: "VISUAL REAL NUMBER AXIS x'Ox",
      labAxisPosition: (label, val, isRight) => `The number ${label} is located to the ${isRight ? 'right' : 'left'} of zero (O), with coordinate x ≈ ${val}.`,
      labConclusionTitle: "Placement Conclusion:",
      labConclusionDesc: (label) => `Every real number corresponds to exactly one geometric point on the line. All numbers to the left of ${label} are strictly less than it, while all numbers to the right are greater.`,
      problemsSectionTitle: "Solved Practice Problems",
      p1Badge: "PROBLEM 1: ORDERING & COMPARISON",
      p1Title: "Comparison of real numbers",
      p1Statement: "Arrange the following real numbers in ascending order (from smallest to largest):",
      thNumber: "Number",
      thDecimalForm: "Decimal Form / Approximation",
      thOrderPosition: "Position in Order",
      p1Row1Form: "－2.0 (negative)",
      p1Row1Pos: "1st (smallest)",
      p1Row2Form: "0.0 (neutral)",
      p1Row2Pos: "2nd",
      p1Row3Form: "1.50",
      p1Row3Pos: "3rd",
      p1Row5Pos: "5th (largest)",
      p1FinalOrderLabel: "Final Ascending Order:",
      p2Badge: "PROBLEM 2: NUMBER SET CLASSIFICATION",
      p2Title: "Identifying number set membership",
      p2Statement: "Determine which of the number sets ℕ, ℤ, ℚ, ℝ each of the following numbers belongs to:",
      thForm: "Form",
      thBelongs: "Belongs to Sets",
      p2Row1Form: "Perfect square (＝ 4)",
      p2Row2Form: "Integer quotient (＝ －3)",
      p2Row2Belongs: "ℤ, ℚ, ℝ (not ℕ)",
      p2Row3Form: "Repeating decimal (＝ 1/3)",
      p2Row4Form: "Non-perfect square",
      p2Row4Belongs: "Only ℝ (Irrational)",
      conclusionLabel: "Fundamental Rule:",
      p2Conclusion: "If a number belongs to ℕ, it automatically belongs to ℤ, ℚ, ℝ. If it is irrational, it belongs strictly to ℝ.",
      warningTitle: "ATTENTION: COMMON PITFALLS WITH REAL NUMBERS",
      warning1Title: "Negative numbers under a square root:",
      warning1TextPre: "Expressions such as the square root of －4 (",
      warning1TextMid: ") or －9 (",
      warning1TextEnd: ") are NOT real numbers. Square roots of negative numbers are undefined in ℝ.",
      warning2Title: "Rationals and Irrationals never overlap:",
      warning2Text: "No number can be both rational and irrational at the same time. They are mutually disjoint sets.",
      warning3Title: "Comparison of negative roots:",
      warning3TextPre: "Just as －3 ＜ －2, similarly",
      warning3TextMid: "＜",
      warning3TextPost: "because",
      warning3TextEnd: "A negative sign reverses the direction of the inequality!",
      ctaTitle: "Master Real Numbers in Practice!",
      ctaDesc: "Test your skills with interactive questions and ordering problems with instant feedback.",
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
          href="/g-gymnasiou/03-pragmatikoi-ask"
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
                href="/g-gymnasiou/03-pragmatikoi-ask"
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
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-center">
                <div className="font-mono text-base sm:text-xl font-black text-indigo-900 break-words [overflow-wrap:anywhere]">
                  {cur.step1Union}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 font-medium break-words [overflow-wrap:anywhere]">
                  {cur.step1Condition}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1RationalsLabel}</strong> {cur.step1RationalsDesc} <Frac num={isEl ? 'μ' : 'm'} den={isEl ? 'ν' : 'n'} /></span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex flex-wrap items-center gap-1.5">
                    <span>0{dec}75</span>
                    <span>|</span>
                    <span>－3</span>
                    <span>|</span>
                    <Frac num="2" den="3" />
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <span><strong>{cur.step1IrrationalsLabel}</strong> {cur.step1IrrationalsDesc}</span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex flex-wrap items-center gap-2">
                    <Radical>2</Radical>
                    <span>|</span>
                    <Radical>5</Radical>
                    <span>|</span>
                    <span>π</span>
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
              
              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner">
                <div className="font-mono text-sm sm:text-lg font-black tracking-wide break-words [overflow-wrap:anywhere]">
                  ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-1 break-words [overflow-wrap:anywhere]">
                  {cur.step2ChainDesc}
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 break-words [overflow-wrap:anywhere]">
                  {cur.step2Naturals}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 break-words [overflow-wrap:anywhere]">
                  {cur.step2Integers}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 break-words [overflow-wrap:anywhere]">
                  {cur.step2Disjoint}
                </div>
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

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">
                    {cur.step3CompTitle}
                  </span>
                  <p className="text-slate-600 mb-2 leading-relaxed">
                    {cur.step3CompDesc}
                  </p>

                  {/* Προστατευμένο Container Μαθηματικής Έκφρασης (Χωρίς σπασίματα γραμμής) */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 leading-relaxed">
                      <span className="font-sans text-slate-600 text-xs">{cur.step3CompExampleIntro}</span>
                      <span className="inline-flex items-center whitespace-nowrap font-bold">
                        <Radical>7</Radical>
                      </span>
                      <span>{isEl ? 'και' : 'and'}</span>
                      <span className="font-bold whitespace-nowrap">2{dec}5:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-indigo-950 font-bold leading-relaxed">
                      <span className="inline-flex items-center whitespace-nowrap">
                        (<Radical>7</Radical>)<sup>2</sup> ＝ 7
                      </span>
                      <span className="text-slate-500 font-sans font-normal">{isEl ? 'και' : 'and'}</span>
                      <span className="inline-flex items-center whitespace-nowrap">
                        2{dec}5<sup>2</sup> ＝ 6{dec}25
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="font-sans text-slate-600 text-xs">{cur.step3CompExampleSince}</span>
                      <span className="inline-flex items-center whitespace-nowrap font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Radical>7</Radical> ＞ 2{dec}5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">{cur.step3NegTitle}</span>
                  <p className="text-slate-600 mb-1">{cur.step3NegDesc}</p>
                  <div className="font-mono text-xs mt-1 text-slate-700 font-bold">
                    －3 ＜ －1{dec}5 ＜ 0
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

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 text-xs sm:text-sm text-emerald-950 space-y-1.5">
                <div className="font-bold">{cur.step4CompletenessTitle}</div>
                <p className="break-words [overflow-wrap:anywhere]">
                  {cur.step4CompletenessPoint1} <br />
                  {cur.step4CompletenessPoint2}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                <strong>{cur.step4GeomTitle}</strong> <br />
                <span className="break-words [overflow-wrap:anywhere]">{cur.step4GeomDesc}</span>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - ΑΞΟΝΑΣ ΧΩΡΙΣ SCROLL ΣΕ ΚΙΝΗΤΑ */}
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
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  {cur.labSelectNumber}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {labNumbers.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedNumId(item.id)}
                      className={`p-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-1 min-h-[46px] ${
                        selectedNumId === item.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{item.display}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500">{cur.labApprox}</span>
                  <span className="font-mono font-bold text-indigo-900">{activeNum.approx}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500">{cur.labMinSet}</span>
                  <span className="font-bold text-emerald-700">{activeNum.minSet}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cur.labBelongsTo}</span>
                  <span className="font-mono font-bold text-indigo-900">{activeNum.sets.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG Axis - 100% Responsive ΧΩΡΙΣ SCROLL */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-inner w-full min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-3 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labAxisHeader)}
                </span>

                <div className="w-full py-2">
                  <svg viewBox="0 0 500 110" className="w-full h-auto overflow-visible select-none">
                    {/* Main Axis Line */}
                    <line x1="15" y1="65" x2="485" y2="65" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    
                    {/* Arrow Marker */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                      </marker>
                    </defs>

                    {/* Axis Ticks & Labels from -3 to +4 */}
                    {[-3, -2, -1, 0, 1, 2, 3, 4].map((tick) => {
                      const tx = originX + tick * unitPx;
                      const isZero = tick === 0;
                      return (
                        <g key={tick}>
                          <line x1={tx} y1="57" x2={tx} y2="73" stroke={isZero ? "#38bdf8" : "#64748b"} strokeWidth={isZero ? "2.5" : "1.5"} />
                          <text x={tx} y="90" textAnchor="middle" fill={isZero ? "#38bdf8" : "#94a3b8"} fontSize="12" fontFamily="monospace" fontWeight={isZero ? "bold" : "normal"}>
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    {/* Active Selected Number Pin */}
                    <g transform={`translate(${pinX}, 65)`} className="transition-all duration-300 ease-out">
                      {/* Pulse Circle */}
                      <circle cx="0" cy="0" r="6" fill="#10b981" />
                      <circle cx="0" cy="0" r="11" fill="#10b981" opacity="0.3" className="animate-ping" />
                      
                      {/* Vertical Pointer Line */}
                      <line x1="0" y1="0" x2="0" y2="-28" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                      
                      {/* Floating Badge */}
                      <rect x="-28" y="-48" width="56" height="22" rx="6" fill="#10b981" />
                      <text x="0" y="-33" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {activeNum.label}
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="text-[11px] sm:text-xs text-slate-400 mt-1 text-center break-words [overflow-wrap:anywhere]">
                  {cur.labAxisPosition(activeNum.label, formatDec(activeNum.value), activeNum.value >= 0)}
                </div>
              </div>

              {/* Interpretation note */}
              <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                <strong>{cur.labConclusionTitle}</strong> {cur.labConclusionDesc(activeNum.label)}
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
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-2 mt-1">
                    <span>－2,</span>
                    <span className="inline-flex items-center gap-0.5"><Radical>3</Radical>,</span>
                    <span>1{dec}5,</span>
                    <span className="inline-flex items-center gap-0.5"><Frac num="7" den="4" />,</span>
                    <span>0</span>
                  </span>
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thNumber}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thDecimalForm}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thOrderPosition}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">－2</td>
                        <td className="p-2 sm:p-2.5 font-mono">{cur.p1Row1Form}</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">{cur.p1Row1Pos}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">0</td>
                        <td className="p-2 sm:p-2.5 font-mono">{cur.p1Row2Form}</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">{cur.p1Row2Pos}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">1{dec}5</td>
                        <td className="p-2 sm:p-2.5 font-mono">{cur.p1Row3Form}</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">{cur.p1Row3Pos}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold"><Radical>3</Radical></td>
                        <td className="p-2 sm:p-2.5 font-mono">≈ 1{dec}732...</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">4{isEl ? 'ος' : 'th'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold"><Frac num="7" den="4" /></td>
                        <td className="p-2 sm:p-2.5 font-mono">＝ 1{dec}75</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">{cur.p1Row5Pos}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.p1FinalOrderLabel}</strong></div>
                  <div className="font-mono font-bold text-emerald-900 inline-flex flex-wrap items-center gap-1.5 mt-1">
                    <span>－2 ＜ 0 ＜ 1{dec}5 ＜</span>
                    <Radical>3</Radical>
                    <span>＜</span>
                    <Frac num="7" den="4" />
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
                  {cur.p2Statement}
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="w-full overflow-x-auto mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thNumber}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thForm}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thBelongs}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold"><Radical>16</Radical></td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p2Row1Form}</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">ℕ, ℤ, ℚ, ℝ</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold"><Frac num="－6" den="2" /></td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p2Row2Form}</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">{cur.p2Row2Belongs}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold">0{dec}333...</td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p2Row3Form}</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">ℚ, ℝ</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold"><Radical>7</Radical></td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p2Row4Form}</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">{cur.p2Row4Belongs}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{cur.conclusionLabel}</strong> {cur.p2Conclusion}</div>
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
                    <strong>{cur.warning1Title}</strong> {cur.warning1TextPre}<Radical>－4</Radical>{cur.warning1TextMid}<Radical>－9</Radical>{cur.warning1TextEnd}
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
                    <strong>{cur.warning3Title}</strong> {cur.warning3TextPre}{' '}
                    <span className="font-bold inline-flex items-center gap-1">
                      <span>－</span><Radical>5</Radical> {cur.warning3TextMid} <span>－</span><Radical>2</Radical>
                    </span>{' '}
                    ({cur.warning3TextPost}{' '}
                    <span className="inline-flex items-center gap-1 font-bold">
                      <Radical>5</Radical> ＞ <Radical>2</Radical>
                    </span>
                    ). {cur.warning3TextEnd}
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
            href="/g-gymnasiou/03-pragmatikoi-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(cur.ctaButton)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}