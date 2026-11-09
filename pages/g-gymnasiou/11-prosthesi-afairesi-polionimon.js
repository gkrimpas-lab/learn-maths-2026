import React, { useState, useRef, useCallback } from 'react';
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

// 100% Αξιόπιστο Custom Interactive Slider
function CustomSlider({ label, min, max, value, onChange, color = "#4f46e5" }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const updateFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = clickX / rect.width;
    const rawVal = min + ratio * (max - min);
    const steppedVal = Math.round(rawVal);
    onChange(Math.max(min, Math.min(max, steppedVal)));
  }, [min, max, onChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.clientX);

    const onMouseMove = (moveEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches[0]) updateFromPosition(e.touches[0].clientX);

    const onTouchMove = (moveEvent) => {
      if (moveEvent.touches[0]) updateFromPosition(moveEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="space-y-2 select-none">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
        <span className="break-words">{label}</span>
        <span
          className="font-mono font-bold px-2 py-0.5 rounded border text-xs sm:text-sm bg-white shadow-xs shrink-0 ml-2"
          style={{ color }}
        >
          {value > 0 ? `＋${value}` : value}
        </span>
      </div>

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-6 flex items-center cursor-pointer group"
      >
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all duration-75"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>

        <div
          className={`absolute w-5 h-5 bg-white border-2 rounded-full shadow-md transition-transform duration-75 -translate-x-1/2 flex items-center justify-center ${
            isDragging ? 'scale-125 ring-2 ring-indigo-300' : 'group-hover:scale-110'
          }`}
          style={{
            left: `${percentage}%`,
            borderColor: color
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
        <span>{min}</span>
        <span>0</span>
        <span>＋{max}</span>
      </div>
    </div>
  );
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Πρόσθεση και Αφαίρεση Πολυωνύμων | Θεωρία Γ' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία για την πρόσθεση και αφαίρεση πολυωνύμων, οριζόντια και κάθετη μέθοδος, αντίθετα πολυώνυμα, απαλοιφή παρενθέσεων και διαδραστικό εργαστήριο.",
    backNav: "Γ' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 08 • Γ' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Πρόσθεση και Αφαίρεση Πολυωνύμων",
    heroDesc: "Πώς συνδυάζουμε πολυώνυμα για να δημιουργήσουμε νέα; Κατακτήστε την οριζόντια και την κάθετη μέθοδο πρόσθεσης και αφαίρεσης, τη διαχείριση των αντιθέτων πολυωνύμων και τους ακριβείς κανόνες απαλοιφής παρενθέσεων.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1
    card1Badge: "1",
    card1Title: "Πρόσθεση και Αφαίρεση Πολυωνύμων",
    card1Desc: "Το άθροισμα και η διαφορά δύο πολυωνύμων P(x) και Q(x) είναι ένα νέο πολυώνυμο, το οποίο προκύπτει αν γράψουμε διαδοχικά τους όρους τους και εκτελέσουμε αναγωγή των όμοιων όρων.",
    card1AddTitle: "Πρόσθεση Πολυωνύμων:",
    card1AddDesc: "Συνδέουμε τα πολυώνυμα με πρόσημο « ＋ ». Διαγράφουμε τις παρενθέσεις διατηρώντας όλα τα πρόσημα των όρων αναλλοίωτα:",
    card1SubTitle: "Αφαίρεση Πολυωνύμων:",
    card1SubDesc: "Η αφαίρεση P(x) － Q(x) ισοδυναμεί με την πρόσθεση του P(x) με το αντίθετο πολυώνυμο του Q(x):",

    // Card 2
    card2Badge: "2",
    card2Title: "Αντίθετο Πολυώνυμο και Κανόνας Προσήμων",
    card2Desc: "Δύο πολυώνυμα ονομάζονται αντίθετα όταν έχουν άθροισμα ίσο με το μηδενικό πολυώνυμο (0).",
    card2OppRulePre: "Το αντίθετο του πολυωνύμου",
    card2OppRuleMid: "συμβολίζεται ως",
    card2OppRulePost: "και σχηματίζεται αλλάζοντας τα πρόσημα όλων ανεξαιρέτως των όρων του:",
    card2SubRuleTitle: "Ο Κανόνας της Αφαίρεσης:",
    card2SubRuleDesc: "Όταν αφαιρούμε ένα πολυώνυμο, διαγράφουμε το πλην και την παρένθεση και αντιστρέφουμε τα πρόσημα όλων των όρων μέσα σε αυτήν:",

    // Card 3
    card3Badge: "3",
    card3Title: "Οριζόντια και Κάθετη Μέθοδος",
    card3Desc: "Μπορούμε να εκτελέσουμε την πρόσθεση ή αφαίρεση πολυωνύμων με δύο ισοδύναμους τρόπους:",
    card3HorizTitle: "1. Οριζόντια Διάταξη (Κλασική):",
    card3HorizDesc: "Γράφουμε τα πολυώνυμα σε παρενθέσεις στη σειρά, απαλείφουμε τις παρενθέσεις και κάνουμε αναγωγή ομοίων όρων.",
    card3VertTitle: "2. Κάθετη Διάταξη (Σε Στήλες):",
    card3VertDesc: "Τοποθετούμε τα πολυώνυμα σε κανονική μορφή το ένα κάτω από το άλλο, στοιχίζοντας τους όμοιους όρους στην ίδια κατακόρυφη στήλη:",

    // Card 4
    card4Badge: "4",
    card4Title: "Βαθμός Αθροίσματος και Διαφοράς",
    card4Desc: "Ο βαθμός του πολυωνύμου που προκύπτει από πρόσθεση ή αφαίρεση υπακούει σε έναν αυστηρό κανόνα:",
    card4DiffDegTitle: "Διαφορετικοί Βαθμοί:",
    card4DiffDegDesc: "Ο βαθμός του αποτελέσματος ισούται πάντοτε με τον μεγαλύτερο βαθμό.",
    card4DiffDegEg: "Π.χ. (3ου βαθμού) ± (2ου βαθμού) ＝ 3ου βαθμού.",
    card4SameDegTitle: "Ίδιοι Βαθμοί (Πιθανή Ελάττωση):",
    card4SameDegDesc: "Αν οι μεγιστοβάθμιοι όροι είναι αντίθετοι, αλληλοεξουδετερώνονται και ο βαθμός μικραίνει:",

    // Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ",
    labTitle: "Εργαστήριο Πράξεων: P(x)",
    labAddBtn: "ΠΡΟΣΘΕΣΗ (＋)",
    labSubBtn: "ΑΦΑΙΡΕΣΗ (－)",
    labPCoefs: "ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ P(x)",
    labQCoefs: "ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ Q(x)",
    labSliderTermX2: "Όρος x²",
    labSliderTermX: "Όρος x",
    labSliderTermConst: "Σταθερός",
    labReductionHeader: "ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ ΑΝΑ ΒΑΘΜΟ",
    labColTermsX2: "Όροι x²",
    labColTermsX: "Όροι x",
    labColTermsConst: "Σταθεροί",
    labFinalPolyHeader: "ΤΕΛΙΚΟ ΑΝΗΓΜΕΝΟ ΠΟΛΥΩΝΥΜΟ",
    degConstant: "0ός βαθμός (σταθερό)",
    degSecond: "2ος βαθμός",
    degFirst: "1ος βαθμός",
    degZeroPoly: "Χωρίς βαθμό (Μηδενικό)",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΦΑΙΡΕΣΗ ΜΕ ΠΑΡΕΝΘΕΣΕΙΣ",
    prob1Title: "Εκτέλεση αφαίρεσης και εύρεση βαθμού",
    prob1DescPre: "Δίνονται τα πολυώνυμα:",
    prob1DescMid: "και",
    prob1DescPost: "Να υπολογιστεί η διαφορά A(x) － B(x).",
    prob1ColTerms: "Όροι",
    prob1ColSub: "Αφαίρεση (A － B)",
    prob1ColResult: "Αποτέλεσμα",
    prob1CancelledNote: "(διαγράφεται)",
    prob1ResReduced: "Ανηγμένη Μορφή:",
    prob1ResDeg: "Βαθμός Διαφοράς: 3ος βαθμός.",
    prob1ResNote: "Παρατήρηση: Οι όροι δευτέρου βαθμού ήταν ίσοι και εξουδετερώθηκαν πλήρως!",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΠΕΡΙΜΕΤΡΟΣ",
    prob2Title: "Περίμετρος τριγώνου και εύρεση άγνωστης πλευράς",
    prob2DescPre: "Ένα τρίγωνο έχει συνολική περίμετρο",
    prob2DescMid: "Οι δύο πλευρές του έχουν μήκη:",
    prob2DescPost: "Να εκφραστεί το μήκος της τρίτης πλευράς γ ως πολυώνυμο του x.",
    prob2ColStep: "Στάδιο",
    prob2ColExpr: "Αλγεβρική Έκφραση",
    prob2ColCalc: "Υπολογισμός",
    prob2Step1: "1. Άθροισμα α ＋ β",
    prob2Step2: "2. Τρίτη πλευρά γ",
    prob2Step3: "3. Απαλοιφή και Αναγωγή",
    prob2ResSide: "Μήκος πλευράς γ:",
    prob2ResCheck: "Έλεγχος: α ＋ β ＋ γ ＝ (2 · x ＋ 5) ＋ (3 · x ＋ 4) ＋ (2 · x ＋ 3) ＝ 7 · x ＋ 12 (επαληθεύεται!).",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΤΟ ΚΛΑΣΙΚΟ ΛΑΘΟΣ ΣΤΗΝ ΑΦΑΙΡΕΣΗ",
    alert1Title: "Αλλαγή προσήμου σε ΟΛΟΥΣ τους όρους:",
    alert1DescPre: "Όταν έχουμε",
    alert1DescMid: "το πλην επηρεάζει και το 3 · x και το －5! Το σωστό είναι",
    alert1DescPost: "Πολλοί μαθητές αλλάζουν μόνο το πρώτο πρόσημο και γράφουν λανθασμένα",
    alert2Title: "Πρόσθεση εκθετών στην πρόσθεση:",
    alert2DescPre: "Στην πρόσθεση",
    alert2DescMid: "το αποτέλεσμα είναι",
    alert2DescPost: "και ΟΧΙ x⁴. Οι εκθέτες προστίθενται μόνο στον πολλαπλασιασμό!",
    alert3Title: "Μη όμοιοι όροι:",
    alert3DescPre: "Δεν εκτελούμε πράξεις μεταξύ όρων διαφορετικού βαθμού (π.χ. το",
    alert3DescPost: "δεν γίνεται 3 · x). Παραμένουν ως έχουν.",
    alert4Title: "Ρίζες και μεταβλητές:",
    alert4DescPre: "Μονώνυμα όπως",
    alert4DescPost: "δεν είναι πολυωνυμικοί όροι και δεν αναγάγονται με πολυώνυμα.",

    // Bottom
    bottomTitle: "Εμπεδώστε την Πρόσθεση και την Αφαίρεση στην Πράξη!",
    bottomDesc: "Δοκιμάστε τις ικανότητές σας σε διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση και πλήρη βήματα επίλυσης.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Addition and Subtraction of Polynomials | Grade 9 Theory",
    pageDesc: "Comprehensive theory on adding and subtracting polynomials, horizontal and vertical column methods, opposite polynomials, parenthesis removal, and interactive lab.",
    backNav: "Grade 9",
    heroBadge: "CHAPTER 08 • GRADE 9",
    heroTitle: "Addition and Subtraction of Polynomials",
    heroDesc: "How do we combine polynomials to construct new ones? Master both horizontal and vertical column methods, working with opposite polynomials, and exact parenthesis removal rules.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Addition and Subtraction of Polynomials",
    card1Desc: "The sum and difference of two polynomials P(x) and Q(x) is a new polynomial formed by sequentially writing their terms and combining like terms.",
    card1AddTitle: "Polynomial Addition:",
    card1AddDesc: "We join the polynomials with a ' ＋ ' sign. We remove the parentheses preserving all term signs unchanged:",
    card1SubTitle: "Polynomial Subtraction:",
    card1SubDesc: "The subtraction P(x) － Q(x) is equivalent to adding P(x) to the opposite polynomial of Q(x):",

    // Card 2
    card2Badge: "2",
    card2Title: "Opposite Polynomial and Sign Rules",
    card2Desc: "Two polynomials are called opposite if their sum equals the zero polynomial (0).",
    card2OppRulePre: "The opposite of polynomial",
    card2OppRuleMid: "is denoted by",
    card2OppRulePost: "and is formed by inverting the signs of each and every one of its terms:",
    card2SubRuleTitle: "The Subtraction Rule:",
    card2SubRuleDesc: "When subtracting a polynomial, we eliminate the minus sign and the parentheses, inverting the signs of all terms enclosed:",

    // Card 3
    card3Badge: "3",
    card3Title: "Horizontal and Vertical Methods",
    card3Desc: "We can perform polynomial addition or subtraction using two equivalent approaches:",
    card3HorizTitle: "1. Horizontal Arrangement (Standard):",
    card3HorizDesc: "We write the polynomials sequentially in parentheses, remove the brackets, and combine like terms.",
    card3VertTitle: "2. Vertical Column Arrangement:",
    card3VertDesc: "We arrange the polynomials in standard form one beneath the other, aligning like terms in the same vertical column:",

    // Card 4
    card4Badge: "4",
    card4Title: "Degree of Sum and Difference",
    card4Desc: "The degree of the resulting polynomial from addition or subtraction satisfies a strict theorem:",
    card4DiffDegTitle: "Distinct Degrees:",
    card4DiffDegDesc: "The degree of the result always equals the maximum of the two degrees.",
    card4DiffDegEg: "E.g. (3rd degree) ± (2nd degree) ＝ 3rd degree.",
    card4SameDegTitle: "Equal Degrees (Possible Degree Reduction):",
    card4SameDegDesc: "If the highest-degree terms are opposite, they cancel out and the resulting degree decreases:",

    // Lab
    labBadge: "ALGEBRA LAB",
    labTitle: "Operations Lab: P(x)",
    labAddBtn: "ADDITION (＋)",
    labSubBtn: "SUBTRACTION (－)",
    labPCoefs: "COEFFICIENTS OF POLYNOMIAL P(x)",
    labQCoefs: "COEFFICIENTS OF POLYNOMIAL Q(x)",
    labSliderTermX2: "Term x²",
    labSliderTermX: "Term x",
    labSliderTermConst: "Constant",
    labReductionHeader: "COMBINING LIKE TERMS BY DEGREE",
    labColTermsX2: "x² Terms",
    labColTermsX: "x Terms",
    labColTermsConst: "Constants",
    labFinalPolyHeader: "FINAL REDUCED POLYNOMIAL",
    degConstant: "Degree 0 (constant)",
    degSecond: "Degree 2",
    degFirst: "Degree 1",
    degZeroPoly: "No degree (Zero Polynomial)",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: SUBTRACTION WITH PARENTHESES",
    prob1Title: "Performing subtraction and finding degree",
    prob1DescPre: "Given the polynomials:",
    prob1DescMid: "and",
    prob1DescPost: "Calculate the difference A(x) － B(x).",
    prob1ColTerms: "Terms",
    prob1ColSub: "Subtraction (A － B)",
    prob1ColResult: "Result",
    prob1ResReduced: "Reduced Form:",
    prob1ResDeg: "Degree of Difference: 3rd degree.",
    prob1ResNote: "Remark: The second-degree terms were identical and completely canceled out!",

    prob2Badge: "PROBLEM 2: GEOMETRIC PERIMETER",
    prob2Title: "Perimeter of triangle and finding unknown side",
    prob2DescPre: "A triangle has total perimeter",
    prob2DescMid: "Two of its sides have lengths:",
    prob2DescPost: "Express the length of the third side c as a polynomial in x.",
    prob2ColStep: "Stage",
    prob2ColExpr: "Algebraic Expression",
    prob2ColCalc: "Calculation",
    prob2Step1: "1. Sum a ＋ b",
    prob2Step2: "2. Third side c",
    prob2Step3: "3. Removal and Combining",
    prob2ResSide: "Length of side c:",
    prob2ResCheck: "Verification: a ＋ b ＋ c ＝ (2 · x ＋ 5) ＋ (3 · x ＋ 4) ＋ (2 · x ＋ 3) ＝ 7 · x ＋ 12 (verified!).",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS IN SUBTRACTION",
    alert1Title: "Inverting signs across ALL terms:",
    alert1DescPre: "When encountering",
    alert1DescMid: "the minus affects both 3 · x and －5! The correct expression is",
    alert1DescPost: "Many students only invert the first sign, erroneously writing",
    alert2Title: "Adding exponents during addition:",
    alert2DescPre: "In the addition",
    alert2DescMid: "the result is",
    alert2DescPost: "and NOT x⁴. Exponents are only added during multiplication!",
    alert3Title: "Non-like terms:",
    alert3DescPre: "We never combine terms of different degrees (e.g.",
    alert3DescPost: "does not become 3 · x). They remain separate.",
    alert4Title: "Radicals and variables:",
    alert4DescPre: "Monomials such as",
    alert4DescPost: "are not polynomial terms and cannot be combined with polynomials.",

    // Bottom
    bottomTitle: "Master Addition & Subtraction in Practice!",
    bottomDesc: "Test your skills with interactive questions and applied problems with instant feedback and step-by-step guidance.",
    bottomBtn: "START EXERCISES"
  }
};

export default function ProsthesiAfairesiPolionimonTheory() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [op, setOp] = useState('add'); // 'add' ή 'sub'
  
  // State συντελεστών P(x)
  const [a1, setA1] = useState(3);
  const [b1, setB1] = useState(-2);
  const [c1, setC1] = useState(5);

  // State συντελεστών Q(x)
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(4);
  const [c2, setC2] = useState(-3);

  // Υπολογισμοί πράξης
  const signFactor = op === 'add' ? 1 : -1;
  const resA = a1 + signFactor * a2;
  const resB = b1 + signFactor * b2;
  const resC = c1 + signFactor * c2;

  let resDegree = t.degConstant;
  if (resA !== 0) resDegree = t.degSecond;
  else if (resB !== 0) resDegree = t.degFirst;
  else if (resC === 0) resDegree = t.degZeroPoly;

  const formatSignedTerm = (val, variable = '') => {
    if (val === 0) return '';
    const sign = val > 0 ? '＋' : '－';
    const abs = Math.abs(val);
    const coefStr = variable ? (abs === 1 ? '' : `${abs} · `) : `${abs}`;
    return `${sign} ${coefStr}${variable}`;
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/g-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
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
                href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
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
                {t.card1Desc}
              </p>
              
              <div className="space-y-2.5 mb-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-1">{t.card1AddTitle}</span>
                  {t.card1AddDesc}
                  <div className="font-mono text-xs font-bold text-indigo-800 mt-1.5 p-2 bg-white rounded border border-slate-200 break-words">
                    P(x) ＋ Q(x) ＝ (2 · x<sup>2</sup> ＋ 3 · x) ＋ (x<sup>2</sup> － 5 · x ＋ 4) ＝ 3 · x<sup>2</sup> － 2 · x ＋ 4
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-1">{t.card1SubTitle}</span>
                  {t.card1SubDesc}
                  <div className="font-mono text-xs font-bold text-indigo-800 mt-1.5 p-2 bg-white rounded border border-slate-200 break-words">
                    P(x) － Q(x) ＝ P(x) ＋ [－Q(x)]
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
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-xs sm:text-sm">
                <p className="text-slate-700 leading-relaxed">
                  {t.card2OppRulePre} <strong>Q(x)</strong> {t.card2OppRuleMid} <strong>－Q(x)</strong> {t.card2OppRulePost}
                </p>
                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-indigo-900 break-words">
                  {locale === 'el' ? 'Αν' : 'If'} Q(x) ＝ 2 · x<sup>2</sup> － 4 · x ＋ 7, <br />
                  {locale === 'el' ? 'τότε' : 'then'} <strong>－Q(x) ＝ －2 · x<sup>2</sup> ＋ 4 · x － 7</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
                <strong>{t.card2SubRuleTitle}</strong> <br />
                {t.card2SubRuleDesc}
                <div className="font-mono text-xs font-bold text-amber-900 mt-1 break-words">
                  － (3 · x<sup>2</sup> － 2 · x ＋ 5) ＝ －3 · x<sup>2</sup> ＋ 2 · x － 5
                </div>
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

              <div className="space-y-2.5 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 mb-1">{t.card3HorizTitle}</div>
                  <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                    {t.card3HorizDesc}
                  </p>
                  <div className="font-mono text-xs text-slate-800 bg-white p-2 rounded border border-slate-200 break-words">
                    (4 · x<sup>2</sup> ＋ 3) － (x<sup>2</sup> － 2) ＝ 4 · x<sup>2</sup> ＋ 3 － x<sup>2</sup> ＋ 2 ＝ 3 · x<sup>2</sup> ＋ 5
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 mb-1">{t.card3VertTitle}</div>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t.card3VertDesc}
                  </p>
                  
                  {/* Σωστή, απόλυτα στοιχισμένη κάθετη διάταξη σε πίνακα χωρίς παρενθέσεις */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex justify-center overflow-x-auto">
                    <table className="font-mono text-xs sm:text-sm text-indigo-950 border-collapse select-none">
                      <tbody>
                        <tr>
                          <td className="w-6 py-1 text-center font-bold"></td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">4 · x<sup>2</sup></td>
                          <td className="w-6 py-1 text-center font-bold">＋</td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">5 · x</td>
                          <td className="w-6 py-1 text-center font-bold">－</td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">2</td>
                        </tr>
                        <tr className="border-b-2 border-indigo-900">
                          <td className="w-6 py-1 text-center font-bold text-indigo-700">＋</td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">x<sup>2</sup></td>
                          <td className="w-6 py-1 text-center font-bold">－</td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">3 · x</td>
                          <td className="w-6 py-1 text-center font-bold">＋</td>
                          <td className="px-2 py-1 text-right whitespace-nowrap">6</td>
                        </tr>
                        <tr className="font-bold text-indigo-700">
                          <td className="w-6 py-1.5 text-center"></td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">5 · x<sup>2</sup></td>
                          <td className="w-6 py-1.5 text-center">＋</td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">2 · x</td>
                          <td className="w-6 py-1.5 text-center">＋</td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">4</td>
                        </tr>
                      </tbody>
                    </table>
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
                  {t.card4Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card4Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card4Desc}
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner font-mono text-xs sm:text-sm font-bold break-words">
                {locale === 'el' ? 'Βαθμός' : 'Degree'} [ P(x) ± Q(x) ] ≤ max {`{`} {locale === 'el' ? 'Βαθμός' : 'Deg'} P(x), {locale === 'el' ? 'Βαθμός' : 'Deg'} Q(x) {`}`}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong>{t.card4DiffDegTitle}</strong> {t.card4DiffDegDesc} <br />
                  <span className="font-mono text-indigo-900 font-bold">{t.card4DiffDegEg}</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
                  <strong>{t.card4SameDegTitle}</strong> {t.card4SameDegDesc} <br />
                  <span className="font-mono font-bold text-amber-900 break-words">
                    (2 · x<sup>2</sup> ＋ x) ＋ (－2 · x<sup>2</sup> ＋ 5) ＝ x ＋ 5 &nbsp;({locale === 'el' ? '1ου βαθμού!' : '1st degree!'})
                  </span>
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
                {t.labTitle} {op === 'add' ? '＋' : '－'} Q(x)
              </h2>
            </div>
            {/* Operation Toggle Buttons */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setOp('add')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  op === 'add' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase(t.labAddBtn)}
              </button>
              <button
                type="button"
                onClick={() => setOp('sub')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  op === 'sub' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase(t.labSubBtn)}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              
              {/* Πολυώνυμο P(x) */}
              <div>
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2.5">
                  {toCleanUppercase(t.labPCoefs)}
                </h3>
                <div className="space-y-3.5">
                  <CustomSlider
                    label={`${t.labSliderTermX2} (a₁):`}
                    min={-4}
                    max={4}
                    value={a1}
                    onChange={setA1}
                    color="#4f46e5"
                  />
                  <CustomSlider
                    label={`${t.labSliderTermX} (b₁):`}
                    min={-4}
                    max={4}
                    value={b1}
                    onChange={setB1}
                    color="#4f46e5"
                  />
                  <CustomSlider
                    label={`${t.labSliderTermConst} c₁:`}
                    min={-5}
                    max={5}
                    value={c1}
                    onChange={setC1}
                    color="#4f46e5"
                  />
                </div>
              </div>

              {/* Πολυώνυμο Q(x) */}
              <div className="pt-3 border-t border-slate-200">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2.5">
                  {toCleanUppercase(t.labQCoefs)}
                </h3>
                <div className="space-y-3.5">
                  <CustomSlider
                    label={`${t.labSliderTermX2} (a₂):`}
                    min={-4}
                    max={4}
                    value={a2}
                    onChange={setA2}
                    color="#2563eb"
                  />
                  <CustomSlider
                    label={`${t.labSliderTermX} (b₂):`}
                    min={-4}
                    max={4}
                    value={b2}
                    onChange={setB2}
                    color="#2563eb"
                  />
                  <CustomSlider
                    label={`${t.labSliderTermConst} c₂:`}
                    min={-5}
                    max={5}
                    value={c2}
                    onChange={setC2}
                    color="#2563eb"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner space-y-2 w-full min-w-0">
                <div className="text-xs text-indigo-300 font-mono break-words">
                  P(x) ＝ {a1} · x<sup>2</sup> {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)}
                </div>
                <div className="text-xs text-indigo-300 font-mono break-words">
                  Q(x) ＝ {a2} · x<sup>2</sup> {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)}
                </div>
                <div className="pt-2 border-t border-indigo-800 text-xs sm:text-sm lg:text-base font-black font-mono text-emerald-400 break-words leading-relaxed">
                  {op === 'add' ? 'P(x) ＋ Q(x)' : 'P(x) － Q(x)'} ＝ ( {a1} · x<sup>2</sup> {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)} ) {op === 'add' ? '＋' : '－'} ( {a2} · x<sup>2</sup> {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)} )
                </div>
              </div>

              {/* Graphic Grouping & Reduction */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5 w-full min-w-0">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {toCleanUppercase(t.labReductionHeader)}:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-mono">
                  {/* x^2 */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">{t.labColTermsX2}</span>
                    <span className="text-slate-800 break-words">
                      ({a1} {op === 'add' ? '＋' : '－'} {a2 >= 0 ? a2 : `(${a2})`}) · x<sup>2</sup>
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resA} · x<sup>2</sup>
                    </div>
                  </div>

                  {/* x */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">{t.labColTermsX}</span>
                    <span className="text-slate-800 break-words">
                      ({b1} {op === 'add' ? '＋' : '－'} {b2 >= 0 ? b2 : `(${b2})`}) · x
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resB} · x
                    </div>
                  </div>

                  {/* Constant */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">{t.labColTermsConst}</span>
                    <span className="text-slate-800 break-words">
                      {c1} {op === 'add' ? '＋' : '－'} {c2 >= 0 ? c2 : `(${c2})`}
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resC}
                    </div>
                  </div>
                </div>

                {/* Final Result Display */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                      {toCleanUppercase(t.labFinalPolyHeader)}:
                    </span>
                    <div className="text-sm sm:text-base lg:text-lg font-mono font-black text-emerald-950 break-words">
                      {resA !== 0 ? <span>{resA} · x<sup>2</sup> </span> : ''}
                      {resB !== 0 ? (resA !== 0 ? formatSignedTerm(resB, 'x') : <span>{resB} · x </span>) : ''}
                      {resC !== 0 ? (resA !== 0 || resB !== 0 ? ` ${formatSignedTerm(resC)}` : `${resC}`) : (resA === 0 && resB === 0 ? '0' : '')}
                    </div>
                  </div>
                  <div className="shrink-0 px-2.5 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 font-mono">
                    {resDegree}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full shrink-0" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.solvedTitle}
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
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob1DescPre} <br />
                  <span className="font-mono font-bold text-slate-800 block my-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    A(x) ＝ 5 · x<sup>3</sup> － 3 · x<sup>2</sup> ＋ 4 · x － 7
                  </span>
                  {t.prob1DescMid} <br />
                  <span className="font-mono font-bold text-slate-800 block my-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    B(x) ＝ 2 · x<sup>3</sup> － 3 · x<sup>2</sup> － 6 · x ＋ 1
                  </span>. <br />
                  {t.prob1DescPost}
                </div>

                {/* Mobile View: Stacked Cards (χωρίς οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2 mb-4 font-mono text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>3</sup></span>
                      <span>5 · x<sup>3</sup> － 2 · x<sup>3</sup></span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      3 · x<sup>3</sup>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>2</sup></span>
                      <span>－3 · x<sup>2</sup> － (－3 · x<sup>2</sup>)</span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      0 · x<sup>2</sup> {t.prob1CancelledNote}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>1</sup></span>
                      <span>4 · x － (－6 · x)</span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      10 · x
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>0</sup></span>
                      <span>－7 － (＋1)</span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      －8
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColTerms}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColSub}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>3</sup></td>
                        <td className="p-2 sm:p-2.5">5 · x<sup>3</sup> － 2 · x<sup>3</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">3 · x<sup>3</sup></td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5">－3 · x<sup>2</sup> － (－3 · x<sup>2</sup>) ＝ －3 · x<sup>2</sup> ＋ 3 · x<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">0 · x<sup>2</sup> {t.prob1CancelledNote}</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>1</sup></td>
                        <td className="p-2 sm:p-2.5">4 · x － (－6 · x) ＝ 4 · x ＋ 6 · x</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">10 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>0</sup></td>
                        <td className="p-2 sm:p-2.5">－7 － (＋1) ＝ －7 － 1</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob1ResReduced}</strong> <span className="font-mono font-bold text-emerald-900 break-words">A(x) － B(x) ＝ 3 · x<sup>3</sup> ＋ 10 · x － 8</span></div>
                  <div><strong>{t.prob1ResDeg}</strong></div>
                  <div><strong>{t.prob1ResNote}</strong></div>
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
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 space-y-1 break-words">
                  <p>
                    {t.prob2DescPre}{' '}
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">Π(x) ＝ 7 · x ＋ 12</span>. {t.prob2DescMid} <br />
                    <span className="font-mono font-bold text-slate-800 whitespace-nowrap">α ＝ 2 · x ＋ 5</span>{' '}
                    {locale === 'el' ? 'και' : 'and'}{' '}
                    <span className="font-mono font-bold text-slate-800 whitespace-nowrap">β ＝ 3 · x ＋ 4</span>.
                  </p>
                  <p>{t.prob2DescPost}</p>
                </div>

                {/* Mobile View: Stacked Cards (χωρίς οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Step1}</span>
                      <span className="text-slate-500">(2 · x ＋ 5) ＋ (3 · x ＋ 4)</span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      5 · x ＋ 9
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Step2}</span>
                      <span className="text-slate-500">Π(x) － (α ＋ β)</span>
                    </div>
                    <div className="text-slate-800 break-words">
                      (7 · x ＋ 12) － (5 · x ＋ 9)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2Step3}</span>
                      <span className="text-slate-500">7 · x ＋ 12 － 5 · x － 9</span>
                    </div>
                    <div className="font-bold text-indigo-700 text-sm break-words">
                      2 · x ＋ 3
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColStep}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColExpr}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Step1}</td>
                        <td className="p-2 sm:p-2.5">(2 · x ＋ 5) ＋ (3 · x ＋ 4)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">5 · x ＋ 9</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Step2}</td>
                        <td className="p-2 sm:p-2.5">Π(x) － (α ＋ β)</td>
                        <td className="p-2 sm:p-2.5">(7 · x ＋ 12) － (5 · x ＋ 9)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2Step3}</td>
                        <td className="p-2 sm:p-2.5">7 · x ＋ 12 － 5 · x － 9</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 · x ＋ 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob2ResSide}</strong> <span className="font-mono font-bold text-emerald-900">γ ＝ 2 · x ＋ 3</span>.</div>
                  <div><strong>{t.prob2ResCheck}</strong></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase(t.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert1Title}</strong> {t.alert1DescPre}{' '}
                    <em>－ (3 · x － 5)</em>, {t.alert1DescMid}{' '}
                    <strong>－3 · x ＋ 5</strong>. {t.alert1DescPost}{' '}
                    <em>－3 · x － 5</em>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert2Title}</strong> {t.alert2DescPre}{' '}
                    <em>x<sup>2</sup> ＋ x<sup>2</sup></em> {t.alert2DescMid}{' '}
                    <strong>2 · x<sup>2</sup></strong> {t.alert2DescPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert3Title}</strong> {t.alert3DescPre}{' '}
                    <em>5 · x<sup>2</sup> － 2 · x</em> {t.alert3DescPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert4Title}</strong> {t.alert4DescPre}{' '}
                    <span className="inline-flex items-center gap-0.5">
                      3 · <Radical>x</Radical>
                    </span>{' '}
                    {t.alert4DescPost}
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
            href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}