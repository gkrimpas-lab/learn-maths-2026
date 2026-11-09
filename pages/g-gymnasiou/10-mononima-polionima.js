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
    pageTitle: "Μονώνυμα και Πολυώνυμα | Θεωρία Γ' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία για αριθμητικές και αλγεβρικές παραστάσεις, μονώνυμα, πολυώνυμα, βαθμό, διώνυμα και τριώνυμα με διαδραστικό εργαστήριο.",
    backNav: "Γ' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 07 • Γ' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Μονώνυμα και Πολυώνυμα",
    heroDesc: "Από τις αριθμητικές παραστάσεις στο αλγεβρικό λεξιλόγιο: ανακαλύψτε πώς οι αριθμοί ενώνονται με μεταβλητές για να σχηματίσουν μονώνυμα, διώνυμα και πολυώνυμα, πώς υπολογίζεται ο βαθμός τους και πώς βρίσκουμε την αριθμητική τους τιμή.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1
    card1Badge: "1",
    card1Title: "Παραστάσεις και Η Έννοια του Μονωνύμου",
    numExprTitle: "Αριθμητική παράσταση:",
    numExprDescPre: "Μία έκφραση που περιέχει πράξεις αποκλειστικά μεταξύ αριθμών (π.χ.",
    numExprDescPost: ").",
    algExprTitle: "Αλγεβρική παράσταση:",
    algExprDescPre: "Μία έκφραση που περιέχει πράξεις μεταξύ αριθμών και μεταβλητών (γραμμάτων) (π.χ.",
    algExprDescPost: ").",
    numValTitle: "Αριθμητική τιμή:",
    numValDesc: "Ο αριθμός που προκύπτει αν αντικαταστήσουμε τις μεταβλητές με συγκεκριμένους αριθμούς και εκτελέσουμε τις πράξεις.",
    monomialDef: "Μονώνυμο ονομάζεται η ακέραια αλγεβρική παράσταση στην οποία μεταξύ των μεταβλητών σημειώνεται μόνο η πράξη του πολλαπλασιασμού και οι εκθέτες τους είναι φυσικοί αριθμοί (0, 1, 2, ...).",
    anatomyTitle: "ΑΝΑΤΟΜΙΑ ΜΟΝΩΝΥΜΟΥ",
    coefTitle: "Συντελεστής:",
    coefDesc: "Ο αριθμητικός παράγοντας (εδώ: －5).",
    mainPartTitle: "Κύριο μέρος:",
    mainPartDescPre: "Το γινόμενο των μεταβλητών με τις δυνάμεις τους (εδώ:",
    mainPartDescPost: ").",
    areMonomials: "ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ",
    notMonomials: "ΔΕΝ ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ",

    // Card 2
    card2Badge: "2",
    card2Title: "Βαθμός Μονωνύμου και Σχέσεις",
    card2Intro: "Ο βαθμός καθορίζεται αποκλειστικά από τους εκθέτες των μεταβλητών του κύριου μέρους:",
    degVarTitle: "Βαθμός ως προς μία μεταβλητή:",
    degVarDesc: "Ο εκθέτης της συγκεκριμένης μεταβλητής.",
    degVarEgPre: "Στο",
    degVarEgPost: "είναι 3ου βαθμού ως προς x και 2ου ως προς y.",
    degTotalTitle: "Βαθμός ως προς όλες τις μεταβλητές:",
    degTotalDesc: "Το άθροισμα όλων των εκθετών των μεταβλητών του.",
    degTotalEgPre: "Στο",
    degTotalEgPost: "είναι 3 ＋ 2 ＝ 5ου βαθμού.",
    likeMon: "Όμοια Μονώνυμα:",
    likeMonDescPre: "Έχουν ακριβώς το ίδιο κύριο μέρος (π.χ.",
    likeMonDescMid: "και",
    likeMonDescPost: ").",
    oppMon: "Αντίθετα Μονώνυμα:",
    oppMonDescPre: "Είναι όμοια με αντίθετους συντελεστές (π.χ.",
    oppMonDescMid: "και",
    oppMonDescPost: ").",
    constMon: "Σταθερό Μονώνυμο:",
    constMonDescPre: "Κάθε μη μηδενικός αριθμός είναι μονώνυμο μηδενικού (0ού) βαθμού (π.χ.",
    constMonDescPost: ").",
    zeroMon: "Μηδενικό Μονώνυμο:",
    zeroMonDesc: "Ο αριθμός 0 δεν έχει βαθμό (δεν ορίζεται βαθμός).",

    // Card 3
    card3Badge: "3",
    card3Title: "Πολυώνυμα, Διώνυμα και Τριώνυμα",
    polyDef: "Πολυώνυμο ονομάζεται κάθε αλγεβρική παράσταση που είναι άθροισμα μονωνύμων που δεν είναι όμοια μεταξύ τους. Κάθε μονώνυμο λέγεται όρος του πολυωνύμου.",
    binomial: "Διώνυμο",
    binomialDesc: "Πολυώνυμο με ακριβώς 2 μη όμοιους όρους.",
    trinomial: "Τριώνυμο",
    trinomialDesc: "Πολυώνυμο με ακριβώς 3 μη όμοιους όρους.",
    reductionTitle: "Αναγωγή ομοίων όρων:",
    reductionDesc: "Προσθέτουμε ή αφαιρούμε τους συντελεστές των όμοιων μονωνύμων διατηρώντας το κύριο μέρος, φτάνοντας στην ανηγμένη μορφή του πολυωνύμου.",

    // Card 4
    card4Badge: "4",
    card4Title: "Βαθμός Πολυωνύμου και Κανονική Μορφή",
    card4Intro: "Για να προσδιορίσουμε τον βαθμό ενός πολυωνύμου, πρώτα εκτελούμε όλες τις αναγωγές ομοίων όρων.",
    polyDegreeRuleTitle: "Κανόνας Βαθμού:",
    polyDegreeRuleDesc: "Ο βαθμός του ανηγμένου πολυωνύμου ισούται με τον μεγαλύτερο από τους βαθμούς των όρων του.",
    stdFormTitle: "Κανονική (Φθίνουσα) Μορφή:",
    stdFormDesc: "Γράφουμε τους όρους από τον μεγαλύτερο εκθέτη προς τον μικρότερο:",
    constTermTitle: "Σταθερός Όρος:",
    constTermDesc: "Ο όρος μηδενικού βαθμού που δεν περιέχει μεταβλητή (στο παράδειγμα: το －9).",

    // Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ",
    labTitle: "Εξερεύνηση Πολυωνύμου P(x) ＝ a · x² ＋ b · x ＋ c",
    labDesc: "Ρυθμίστε τους συντελεστές και δείτε αυτόματα την ταξινόμηση, τον βαθμό και την αριθμητική τιμή.",
    sliderLabelA: "Συντελεστής δευτεροβάθμιου (a):",
    sliderLabelB: "Συντελεστής πρωτοβάθμιου (b):",
    sliderLabelC: "Σταθερός όρος (c):",
    sliderLabelX: "Τιμή μεταβλητής (x):",
    polyFormTitle: "ΜΟΡΦΗ ΠΟΛΥΩΝΥΜΟΥ",
    typeBadgeLabel: "Τύπος",
    degBadgeLabel: "Βαθμός",
    valBadgeLabel: "Τιμή P",
    termBreakdownTitle: "ΑΝΑΛΥΣΗ ΟΡΩΝ ΓΙΑ",
    constantLabel: "σταθερός",
    polyZero: "ΜΗΔΕΝΙΚΟ ΠΟΛΥΩΝΥΜΟ",
    polyMono: "ΜΟΝΩΝΥΜΟ",
    polyBino: "ΔΙΩΝΥΜΟ",
    polyTrino: "ΤΡΙΩΝΥΜΟ",
    degNone: "ΧΩΡΙΣ ΒΑΘΜΟ (0)",
    degSecond: "2ος ΒΑΘΜΟΣ",
    degFirst: "1ος ΒΑΘΜΟΣ",
    degZero: "0ος ΒΑΘΜΟΣ (ΣΤΑΘΕΡΟ)",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΝΑΓΩΓΗ ΚΑΙ ΒΑΘΜΟΣ",
    prob1Title: "Απλοποίηση και εύρεση βαθμού πολυωνύμου",
    prob1DescPre: "Δίνεται το πολυώνυμο:",
    prob1DescPost: "Να γραφεί στην ανηγμένη του μορφή, να διαταχθεί κατά τις φθίνουσες δυνάμεις του x και να βρεθεί ο βαθμός και ο σταθερός του όρος.",
    prob1ColPower: "Δύναμη",
    prob1ColTerms: "Όμοιοι Όροι",
    prob1ColResult: "Αποτέλεσμα",
    prob1ResReduced: "Ανηγμένη Μορφή:",
    prob1ResDeg: "Βαθμός: 3ος βαθμός.",
    prob1ResConst: "Σταθερός Όρος: －8.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΕΦΑΡΜΟΓΗ",
    prob2Title: "Εμβαδόν και Περίμετρος Ορθογωνίου ως Πολυώνυμα",
    prob2DescPre: "Ένα ορθογώνιο οικόπεδο έχει μήκος",
    prob2DescMid: "και πλάτος",
    prob2DescPost: "(όπου x σε μέτρα, x ＞ 0).",
    prob2DescQ1: "α) Να εκφραστεί η περίμετρος Π(x) ως πολυώνυμο.",
    prob2DescQ2: "β) Να εκφραστεί το εμβαδόν E(x) ως πολυώνυμο και να βρεθεί ο βαθμός του.",
    prob2ColMeasure: "Μέγεθος",
    prob2ColFormula: "Τύπος",
    prob2ColCalculation: "Υπολογισμός Πολυωνύμου",
    prob2RowPerimeter: "Περίμετρος Π(x)",
    prob2RowArea: "Εμβαδόν E(x)",
    prob2ResPerimeter: "Περίμετρος Π(x): 6 · x ＋ 10 (Διώνυμο 1ου βαθμού).",
    prob2ResArea: "Εμβαδόν E(x): 2 · x² ＋ 5 · x (Διώνυμο 2ου βαθμού).",

    // Alert
    alertTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΕΞΕΤΑΣΕΙΣ",
    alert1Title: "Αρνητικοί εκθέτες και ρίζες:",
    alert1DescPre: "Παραστάσεις όπως",
    alert1DescMid: "ή",
    alert1DescPost: "ΔΕΝ είναι μονώνυμα. Στα μονώνυμα οι εκθέτες των μεταβλητών είναι αποκλειστικά φυσικοί αριθμοί.",
    alert2Title: "Μεταβλητή στον παρονομαστή:",
    alert2DescPre: "Η παράσταση",
    alert2DescMid: "δεν είναι μονώνυμο διότι περιέχει διαίρεση με μεταβλητή. Αντίθετα, η παράσταση",
    alert2DescPost: "είναι κανονικό μονώνυμο με συντελεστή",
    alert3Title: "Μηδενικό Μονώνυμο:",
    alert3Desc: "Ο αριθμός 0 είναι το μηδενικό μονώνυμο και δεν έχει βαθμό (δεν ορίζεται βαθμός).",
    alert4Title: "Βαθμός χωρίς αναγωγή:",
    alert4DescPre: "Μην υπολογίζετε τον βαθμό πριν κάνετε αναγωγή ομοίων όρων! Στο",
    alert4DescPost: "ο όρος x³ εξαφανίζεται (2 － 2 ＝ 0), άρα το πολυώνυμο είναι 1ου βαθμού και όχι 3ου.",

    // Bottom
    bottomTitle: "Εμπεδώστε τη Θεωρία στην Πράξη!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας σε 12 δυναμικές διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Monomials and Polynomials | Grade 9 Theory",
    pageDesc: "In-depth theory on numerical and algebraic expressions, monomials, polynomials, degree, binomials, and trinomials with an interactive lab.",
    backNav: "Grade 9",
    heroBadge: "CHAPTER 07 • GRADE 9",
    heroTitle: "Monomials and Polynomials",
    heroDesc: "From arithmetic expressions to algebraic terms: explore how numbers combine with variables to form monomials, binomials, and polynomials, how their degree is determined, and how to evaluate their numeric value.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Expressions & Concept of Monomial",
    numExprTitle: "Numerical expression:",
    numExprDescPre: "An expression involving operations solely between numbers (e.g.",
    numExprDescPost: ").",
    algExprTitle: "Algebraic expression:",
    algExprDescPre: "An expression containing operations between numbers and variables (letters) (e.g.",
    algExprDescPost: ").",
    numValTitle: "Numerical value:",
    numValDesc: "The resulting number when substituting variables with specific numerical values and performing the operations.",
    monomialDef: "A monomial is an integer algebraic expression in which the only operation between variables is multiplication, and all variable exponents are natural numbers (0, 1, 2, ...).",
    anatomyTitle: "ANATOMY OF A MONOMIAL",
    coefTitle: "Coefficient:",
    coefDesc: "The numerical factor (here: －5).",
    mainPartTitle: "Literal part:",
    mainPartDescPre: "The product of variables raised to their powers (here:",
    mainPartDescPost: ").",
    areMonomials: "ARE MONOMIALS",
    notMonomials: "NOT MONOMIALS",

    // Card 2
    card2Badge: "2",
    card2Title: "Monomial Degree and Relationships",
    card2Intro: "The degree is determined exclusively by the variable exponents of the literal part:",
    degVarTitle: "Degree with respect to one variable:",
    degVarDesc: "The exponent of that specific variable.",
    degVarEgPre: "In",
    degVarEgPost: "it is of degree 3 in x and degree 2 in y.",
    degTotalTitle: "Degree with respect to all variables:",
    degTotalDesc: "The sum of all variable exponents of its literal part.",
    degTotalEgPre: "In",
    degTotalEgPost: "it is 3 ＋ 2 ＝ degree 5.",
    likeMon: "Like Monomials:",
    likeMonDescPre: "Monomials having the exact same literal part (e.g.",
    likeMonDescMid: "and",
    likeMonDescPost: ").",
    oppMon: "Opposite Monomials:",
    oppMonDescPre: "Like monomials with opposite coefficients (e.g.",
    oppMonDescMid: "and",
    oppMonDescPost: ").",
    constMon: "Constant Monomial:",
    constMonDescPre: "Any non-zero number is a monomial of degree zero (0) (e.g.",
    constMonDescPost: ").",
    zeroMon: "Zero Monomial:",
    zeroMonDesc: "The number 0 has no degree (degree is undefined).",

    // Card 3
    card3Badge: "3",
    card3Title: "Polynomials, Binomials, and Trinomials",
    polyDef: "A polynomial is any algebraic expression that is the sum of non-like monomials. Each monomial is called a term of the polynomial.",
    binomial: "Binomial",
    binomialDesc: "A polynomial with exactly 2 non-like terms.",
    trinomial: "Trinomial",
    trinomialDesc: "A polynomial with exactly 3 non-like terms.",
    reductionTitle: "Combining like terms:",
    reductionDesc: "We add or subtract the coefficients of like monomials keeping the literal part, reaching the reduced standard form of the polynomial.",

    // Card 4
    card4Badge: "4",
    card4Title: "Polynomial Degree and Standard Form",
    card4Intro: "To determine the degree of a polynomial, we first combine all like terms.",
    polyDegreeRuleTitle: "Degree Rule:",
    polyDegreeRuleDesc: "The degree of a simplified polynomial equals the highest degree among all its terms.",
    stdFormTitle: "Standard (Descending) Form:",
    stdFormDesc: "We write the terms arranged in descending powers of the variable:",
    constTermTitle: "Constant Term:",
    constTermDesc: "The term of degree zero that contains no variable (in the example: －9).",

    // Lab
    labBadge: "ALGEBRA LAB",
    labTitle: "Polynomial Explorer P(x) ＝ a · x² ＋ b · x ＋ c",
    labDesc: "Adjust coefficients to dynamically view classification, degree, and numerical evaluation.",
    sliderLabelA: "Quadratic coefficient (a):",
    sliderLabelB: "Linear coefficient (b):",
    sliderLabelC: "Constant term (c):",
    sliderLabelX: "Variable value (x):",
    polyFormTitle: "POLYNOMIAL FORM",
    typeBadgeLabel: "Type",
    degBadgeLabel: "Degree",
    valBadgeLabel: "Value P",
    termBreakdownTitle: "TERMS BREAKDOWN FOR",
    constantLabel: "constant",
    polyZero: "ZERO POLYNOMIAL",
    polyMono: "MONOMIAL",
    polyBino: "BINOMIAL",
    polyTrino: "TRINOMIAL",
    degNone: "NO DEGREE (0)",
    degSecond: "DEGREE 2",
    degFirst: "DEGREE 1",
    degZero: "DEGREE 0 (CONSTANT)",

    // Solved Problems
    solvedTitle: "Solved Application Problems",
    prob1Badge: "PROBLEM 1: COMBINING TERMS & DEGREE",
    prob1Title: "Simplifying and finding polynomial degree",
    prob1DescPre: "Given the polynomial:",
    prob1DescPost: "Write it in reduced standard form arranged in descending powers of x, and find its degree and constant term.",
    prob1ColPower: "Power",
    prob1ColTerms: "Like Terms",
    prob1ColResult: "Result",
    prob1ResReduced: "Reduced Form:",
    prob1ResDeg: "Degree: 3rd degree.",
    prob1ResConst: "Constant Term: －8.",

    prob2Badge: "PROBLEM 2: GEOMETRIC APPLICATION",
    prob2Title: "Rectangle Area & Perimeter as Polynomials",
    prob2DescPre: "A rectangular plot has length",
    prob2DescMid: "and width",
    prob2DescPost: "(where x is in meters, x ＞ 0).",
    prob2DescQ1: "a) Express the perimeter P(x) as a polynomial.",
    prob2DescQ2: "β) Express the area A(x) as a polynomial and determine its degree.",
    prob2ColMeasure: "Quantity",
    prob2ColFormula: "Formula",
    prob2ColCalculation: "Polynomial Calculation",
    prob2RowPerimeter: "Perimeter P(x)",
    prob2RowArea: "Area A(x)",
    prob2ResPerimeter: "Perimeter P(x): 6 · x ＋ 10 (1st degree binomial).",
    prob2ResArea: "Area A(x): 2 · x² ＋ 5 · x (2nd degree binomial).",

    // Alert
    alertTitle: "CAUTION: COMMON PITFALLS IN EXAMS",
    alert1Title: "Negative exponents and radicals:",
    alert1DescPre: "Expressions such as",
    alert1DescMid: "or",
    alert1DescPost: "are NOT monomials. In monomials, variable exponents must be non-negative integers (natural numbers).",
    alert2Title: "Variable in denominator:",
    alert2DescPre: "The expression",
    alert2DescMid: "is not a monomial because it divides by a variable. In contrast, the expression",
    alert2DescPost: "is a standard monomial with coefficient",
    alert3Title: "Zero Monomial:",
    alert3Desc: "The number 0 is the zero monomial and has no degree (its degree is undefined).",
    alert4Title: "Degree without combining terms:",
    alert4DescPre: "Never determine degree before combining like terms! In",
    alert4DescPost: "the x³ term cancels out (2 － 2 ＝ 0), making the polynomial 1st degree, not 3rd.",

    // Bottom
    bottomTitle: "Practice Theory in Action!",
    bottomDesc: "Test your skills with 12 dynamic interactive questions and problems with instant feedback.",
    bottomBtn: "START EXERCISES"
  }
};

export default function MononimaPolionimaTheory() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [coefA, setCoefA] = useState(2);
  const [coefB, setCoefB] = useState(-3);
  const [coefC, setCoefC] = useState(5);
  const [valX, setValX] = useState(2);

  const nonZeroTerms = [coefA !== 0, coefB !== 0, coefC !== 0].filter(Boolean).length;
  
  let polyType = t.polyZero;
  if (nonZeroTerms === 1) polyType = t.polyMono;
  else if (nonZeroTerms === 2) polyType = t.polyBino;
  else if (nonZeroTerms === 3) polyType = t.polyTrino;

  let polyDegree = t.degNone;
  if (coefA !== 0) polyDegree = t.degSecond;
  else if (coefB !== 0) polyDegree = t.degFirst;
  else if (coefC !== 0) polyDegree = t.degZero;

  const termAVal = coefA * Math.pow(valX, 2);
  const termBVal = coefB * valX;
  const termCVal = coefC;
  const totalVal = termAVal + termBVal + termCVal;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/g-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/10-mononima-polionima-ask"
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
                href="/g-gymnasiou/10-mononima-polionima-ask"
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

              <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-slate-900">{t.numExprTitle}</strong> {t.numExprDescPre}{' '}
                  <span className="font-mono font-bold text-indigo-900 whitespace-nowrap">3 · 4<sup>2</sup> － 5</span>
                  {t.numExprDescPost}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-slate-900">{t.algExprTitle}</strong> {t.algExprDescPre}{' '}
                  <span className="font-mono font-bold text-indigo-900 whitespace-nowrap">2 · x<sup>2</sup> ＋ 3 · x － 7</span>
                  {t.numExprDescPost}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-slate-900">{t.numValTitle}</strong> {t.numValDesc}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.monomialDef}
              </p>
              
              <div className="bg-indigo-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100 mb-3">
                <h3 className="font-bold text-indigo-900 mb-1.5 text-xs sm:text-sm uppercase tracking-wider">
                  {toCleanUppercase(t.anatomyTitle)}: －5 · x<sup>2</sup> · y<sup>3</sup>
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>{t.coefTitle}</strong> {t.coefDesc}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>
                      <strong>{t.mainPartTitle}</strong> {t.mainPartDescPre}{' '}
                      <span className="font-mono font-bold text-indigo-950 whitespace-nowrap">x<sup>2</sup> · y<sup>3</sup></span>
                      {t.mainPartDescPost}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-800 block mb-1">✓ {toCleanUppercase(t.areMonomials)}:</span>
                  <span className="text-slate-700 font-mono inline-flex flex-wrap items-center gap-1.5">
                    <span>7,</span>
                    <span>－3 · x,</span>
                    <span className="inline-flex items-center gap-0.5"><Frac num="1" den="2" /> · x<sup>2</sup> · y,</span>
                    <span>x<sup>3</sup></span>
                  </span>
                </div>
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-bold text-rose-800 block mb-1">✗ {toCleanUppercase(t.notMonomials)}:</span>
                  <span className="text-slate-700 font-mono inline-flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center"><Frac num="3" den="x" />,</span>
                    <span>x ＋ y,</span>
                    <span>4 · x<sup>－2</sup>,</span>
                    <span className="inline-flex items-center gap-0.5">
                      <span>4 ·</span>
                      <Radical>x</Radical>
                    </span>
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
                  {t.card2Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  {t.card2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card2Intro}
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-slate-900">{t.degVarTitle}</span> {t.degVarDesc}
                  <div className="text-indigo-900 mt-1 font-mono font-bold">
                    {t.degVarEgPre} 4 · x<sup>3</sup> · y<sup>2</sup> {t.degVarEgPost}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-slate-900">{t.degTotalTitle}</span> {t.degTotalDesc}
                  <div className="text-indigo-900 mt-1 font-mono font-bold">
                    {t.degTotalEgPre} 4 · x<sup>3</sup> · y<sup>2</sup> {t.degTotalEgPost}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div>
                  <strong>{t.likeMon}</strong> {t.likeMonDescPre}{' '}
                  <span className="font-mono font-bold text-blue-950 whitespace-nowrap">3 · x<sup>2</sup> · y</span>{' '}
                  {t.likeMonDescMid}{' '}
                  <span className="font-mono font-bold text-blue-950 whitespace-nowrap">－7 · x<sup>2</sup> · y</span>
                  {t.likeMonDescPost}
                </div>
                <div>
                  <strong>{t.oppMon}</strong> {t.oppMonDescPre}{' '}
                  <span className="font-mono font-bold text-blue-950 whitespace-nowrap">5 · x<sup>3</sup></span>{' '}
                  {t.oppMonDescMid}{' '}
                  <span className="font-mono font-bold text-blue-950 whitespace-nowrap">－5 · x<sup>3</sup></span>
                  {t.oppMonDescPost}
                </div>
                <div>
                  <strong>{t.constMon}</strong> {t.constMonDescPre}{' '}
                  <span className="font-mono font-bold text-blue-950 whitespace-nowrap">8 ＝ 8 · x<sup>0</sup></span>
                  {t.constMonDescPost}
                </div>
                <div><strong>{t.zeroMon}</strong> {t.zeroMonDesc}</div>
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
                {t.polyDef}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <div className="font-bold text-indigo-900 mb-1">{t.binomial}</div>
                  <p className="text-xs text-slate-600">{t.binomialDesc}</p>
                  <div className="font-mono font-bold text-indigo-700 mt-1 text-xs">2 · x ＋ 5</div>
                </div>
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <div className="font-bold text-indigo-900 mb-1">{t.trinomial}</div>
                  <p className="text-xs text-slate-600">{t.trinomialDesc}</p>
                  <div className="font-mono font-bold text-indigo-700 mt-1 text-xs">3 · x<sup>2</sup> － 4 · x ＋ 7</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>{t.reductionTitle}</strong> {t.reductionDesc}
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
                {t.card4Intro}
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs sm:text-sm text-amber-950">
                <strong>{t.polyDegreeRuleTitle}</strong> {t.polyDegreeRuleDesc}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>{t.stdFormTitle}</strong> {t.stdFormDesc}
                  <div className="font-mono font-bold text-indigo-700 mt-1 break-words">
                    P(x) ＝ 5 · x<sup>3</sup> － 2 · x<sup>2</sup> ＋ 7 · x － 9
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>{t.constTermTitle}</strong> {t.constTermDesc}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - CUSTOM SLIDERS */}
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
            <div className="text-xs text-slate-500 max-w-xs">
              {t.labDesc}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <CustomSlider
                label={t.sliderLabelA}
                min={-5}
                max={5}
                value={coefA}
                onChange={setCoefA}
                color="#4f46e5"
              />

              <CustomSlider
                label={t.sliderLabelB}
                min={-5}
                max={5}
                value={coefB}
                onChange={setCoefB}
                color="#4f46e5"
              />

              <CustomSlider
                label={t.sliderLabelC}
                min={-5}
                max={5}
                value={coefC}
                onChange={setCoefC}
                color="#4f46e5"
              />

              <div className="pt-2 border-t border-slate-200">
                <CustomSlider
                  label={t.sliderLabelX}
                  min={-3}
                  max={3}
                  value={valX}
                  onChange={setValX}
                  color="#059669"
                />
              </div>
            </div>

            {/* Dynamic Visualization */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* Formula Card */}
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase(t.polyFormTitle)}
                </span>
                <div className="text-base sm:text-xl lg:text-2xl font-mono font-black tracking-wide break-words py-1">
                  P(x) ＝ {coefA !== 0 ? <span>{coefA} · x<sup>2</sup></span> : ''} 
                  {coefB > 0 ? (coefA !== 0 ? ` ＋ ${coefB} · x` : `${coefB} · x`) : coefB < 0 ? ` － ${Math.abs(coefB)} · x` : ''} 
                  {coefC > 0 ? (coefA !== 0 || coefB !== 0 ? ` ＋ ${coefC}` : `${coefC}`) : coefC < 0 ? ` － ${Math.abs(coefC)}` : (coefA === 0 && coefB === 0 ? '0' : '')}
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">{t.typeBadgeLabel}</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900 break-words">{polyType}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">{t.degBadgeLabel}</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900 break-words">{polyDegree}</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl min-w-0">
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold block mb-0.5">{t.valBadgeLabel}({valX})</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-800 break-words">{totalVal}</span>
                </div>
              </div>

              {/* Term Breakdown Cards (Responsive Stacked on Mobile) */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 w-full min-w-0">
                <span className="text-xs font-bold text-slate-600 block mb-2 uppercase break-words">
                  {toCleanUppercase(`${t.termBreakdownTitle} x ＝ ${valX}`)}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-center">
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <span className="text-indigo-900 font-bold block mb-0.5">a · x<sup>2</sup></span>
                    <span className="text-indigo-700 break-words">{coefA} · ({valX})<sup>2</sup> ＝ {termAVal}</span>
                  </div>
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <span className="text-indigo-900 font-bold block mb-0.5">b · x</span>
                    <span className="text-indigo-700 break-words">{coefB} · ({valX}) ＝ {termBVal}</span>
                  </div>
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <span className="text-indigo-900 font-bold block mb-0.5">c ({t.constantLabel})</span>
                    <span className="text-indigo-700 break-words">{termCVal}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
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
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob1DescPre} <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 my-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    A(x) ＝ 4 · x<sup>3</sup> － 2 · x<sup>2</sup> ＋ 5 · x － x<sup>3</sup> ＋ 6 · x<sup>2</sup> － 8
                  </span> <br />
                  {t.prob1DescPost}
                </p>

                {/* Mobile View: Stacked Cards (μηδενικό οριζόντιο scroll)[cite: 2] */}
                <div className="block sm:hidden space-y-2 mb-4 font-mono text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>3</sup></span>
                      <span>4 · x<sup>3</sup> － 1 · x<sup>3</sup></span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      3 · x<sup>3</sup>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>2</sup></span>
                      <span>－2 · x<sup>2</sup> ＋ 6 · x<sup>2</sup></span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      4 · x<sup>2</sup>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>1</sup></span>
                      <span>5 · x</span>
                    </div>
                    <div className="font-bold text-indigo-700 break-words">
                      5 · x
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">x<sup>0</sup></span>
                      <span>－8</span>
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
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColPower}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColTerms}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob1ColResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>3</sup></td>
                        <td className="p-2 sm:p-2.5">4 · x<sup>3</sup> － 1 · x<sup>3</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">3 · x<sup>3</sup></td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5">－2 · x<sup>2</sup> ＋ 6 · x<sup>2</sup></td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">4 · x<sup>2</sup></td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>1</sup></td>
                        <td className="p-2 sm:p-2.5">5 · x</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">5 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x<sup>0</sup></td>
                        <td className="p-2 sm:p-2.5">－8</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob1ResReduced}</strong> <span className="font-mono font-bold text-emerald-900 break-words">A(x) ＝ 3 · x<sup>3</sup> ＋ 4 · x<sup>2</sup> ＋ 5 · x － 8</span></div>
                  <div><strong>{t.prob1ResDeg}</strong></div>
                  <div><strong>{t.prob1ResConst}</strong></div>
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
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">L ＝ 2 · x ＋ 5</span>{' '}
                    {t.prob2DescMid}{' '}
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">W ＝ x</span>{' '}
                    {t.prob2DescPost}
                  </p>
                  <p>{t.prob2DescQ1}</p>
                  <p>{t.prob2DescQ2}</p>
                </div>

                {/* Mobile View: Stacked Cards (μηδενικό οριζόντιο scroll)[cite: 2] */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2RowPerimeter}</span>
                      <span className="text-slate-500">2 · (L ＋ W)</span>
                    </div>
                    <div className="text-indigo-700 font-bold text-sm break-words">
                      6 · x ＋ 10
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold font-sans">{t.prob2RowArea}</span>
                      <span className="text-slate-500">L · W</span>
                    </div>
                    <div className="text-indigo-700 font-bold text-sm break-words">
                      2 · x<sup>2</sup> ＋ 5 · x
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColMeasure}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColFormula}</th>
                        <th className="p-2 sm:p-2.5 border-b">{t.prob2ColCalculation}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2RowPerimeter}</td>
                        <td className="p-2 sm:p-2.5">2 · (L ＋ W)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">6 · x ＋ 10</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{t.prob2RowArea}</td>
                        <td className="p-2 sm:p-2.5">L · W</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 · x<sup>2</sup> ＋ 5 · x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob2ResPerimeter}</strong></div>
                  <div><strong>{t.prob2ResArea}</strong></div>
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
                    <span className="font-mono font-bold whitespace-nowrap">3 · x<sup>－1</sup></span>{' '}
                    {t.alert1DescMid}{' '}
                    <span className="font-mono font-bold inline-flex items-center gap-0.5 whitespace-nowrap">
                      <span>2 ·</span><Radical>x</Radical>
                    </span>{' '}
                    {t.alert1DescPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert2Title}</strong> {t.alert2DescPre}{' '}
                    <span className="font-mono font-bold inline-flex items-center"><Frac num="4" den="x" /></span>{' '}
                    {t.alert2DescMid}{' '}
                    <span className="font-mono font-bold inline-flex items-center gap-1">
                      <Frac num="x" den="4" /> (＝ <Frac num="1" den="4" /> · x)
                    </span>{' '}
                    {t.alert2DescPost}{' '}
                    <span className="font-mono font-bold inline-flex items-center"><Frac num="1" den="4" /></span>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>{t.alert3Title}</strong> {t.alert3Desc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert4Title}</strong> {t.alert4DescPre}{' '}
                    <span className="font-mono font-bold text-amber-950 whitespace-nowrap">
                      P(x) ＝ 2 · x<sup>3</sup> － 2 · x<sup>3</sup> ＋ x ＋ 1
                    </span>, {t.alert4DescPost}
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
            href="/g-gymnasiou/10-mononima-polionima-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}