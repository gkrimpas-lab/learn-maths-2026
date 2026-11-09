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

export default function PrakseisPragmatikonTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  // State για το διαδραστικό εργαστήριο: Υπολογισμός k * (a*√2 + b)
  const [factorK, setFactorK] = useState(2);
  const [coefA, setCoefA] = useState(3);
  const [termB, setTermB] = useState(-4);

  // Επιμεριστική ιδιότητα: k*(a√2 + b) = (k*a)√2 + (k*b)
  const resA = factorK * coefA;
  const resB = factorK * termB;

  // Βοηθητική μορφοποίηση όρου ρίζας
  const formatRadTerm = (c, r = 2) => {
    if (c === 0) return null;
    if (c === 1) return <Radical>{r}</Radical>;
    if (c === -1) {
      return (
        <span className="inline-flex items-center whitespace-nowrap">
          <span>－</span>
          <Radical>{r}</Radical>
        </span>
      );
    }
    if (c < 0) {
      return (
        <span className="inline-flex items-center whitespace-nowrap">
          <span>－{Math.abs(c)} · </span>
          <Radical>{r}</Radical>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center whitespace-nowrap">
        <span>{c} · </span>
        <Radical>{r}</Radical>
      </span>
    );
  };

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    el: {
      metaTitle: "Πράξεις Πραγματικών Αριθμών | Θεωρία Γ' Γυμνασίου",
      metaDesc: "Αναλυτική θεωρία για τις πράξεις των πραγματικών αριθμών, τις ιδιότητες (επιμεριστική, αντιμεταθετική), τους κανόνες προσήμων και διαδραστικό εργαστήριο.",
      backText: "Γ' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 4 • Γ' ΓΥΜΝΑΣΙΟΥ",
      heroTitle: "Πράξεις & Ιδιότητες Πραγματικών Αριθμών",
      heroSubtitle: "Οι τέσσερις θεμελιώδεις πράξεις επεκτείνονται σε ολόκληρο το σύνολο των πραγματικών αριθμών. Κατακτήστε την επιμεριστική ιδιότητα, τον χειρισμό ριζών και κλασμάτων και τους ακριβείς κανόνες απαλοιφής παρενθέσεων.",
      heroCta: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      step1Title: "Πρόσθεση & Αφαίρεση στο ℝ",
      step1Desc: "Η πρόσθεση και η αφαίρεση ισχύουν για όλους τους πραγματικούς αριθμούς (ρητούς και άρρητους) με τις ίδιες βασικές ιδιότητες:",
      step1Commutative: "Αντιμεταθετική:",
      step1Neutral: "Ουδέτερο Στοιχείο:",
      step1Opposite: "Αντίθετος Αριθμός:",
      step1RootsTitle: "Πράξεις με Ρίζες:",
      step1RootsDesc: "Προσθέτουμε ή αφαιρούμε μόνο όμοιες ρίζες:",
      step2Title: "Πολλαπλασιασμός & Διαίρεση στο ℝ",
      step2Desc: "Στον πολλαπλασιασμό των πραγματικών αριθμών ισχύουν θεμελιώδεις κανόνες και ιδιότητες:",
      step2Neutral: "Ουδέτερο Στοιχείο:",
      step2Reciprocal: "Αντίστροφος (α ≠ 0):",
      step2ZeroProd: "Ιδιότητα Μηδενισμού:",
      step2ZeroProdRule: "α · β ＝ 0 ⇔ α ＝ 0 ή β ＝ 0",
      step2DivTitle: "Διαίρεση & Κλάσματα:",
      step2DivDesc: "Η διαίρεση με αριθμό β ≠ 0 ισοδυναμεί με πολλαπλασιασμό επί τον αντίστροφό του:",
      step3Title: "Η Επιμεριστική Ιδιότητα",
      step3Desc: "Η επιμεριστική ιδιότητα συνδέει τον πολλαπλασιασμό με την πρόσθεση και την αφαίρεση:",
      step3ExpansionTitle: "Ανάπτυγμα (από αριστερά προς δεξιά):",
      step3FactoringTitle: "Κοινός Παράγοντας (από δεξιά προς αριστερά):",
      step4Title: "Κανόνες Προσήμων & Παρενθέσεις",
      step4Desc: "Οι απαράβατοι κανόνες για πρόσημα σε γινόμενα, πηλίκα και παρενθέσεις:",
      step4ProdQuotTitle: "Γινόμενο & Πηλίκο:",
      step4ParenthesesTitle: "Απαλοιφή Παρενθέσεων:",
      step4PlusRule: "Τα πρόσημα διατηρούνται.",
      step4MinusRule: "Τα πρόσημα όλων των όρων αντιστρέφονται!",
      labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΠΡΑΞΕΩΝ",
      labTitle: "Εφαρμογή Επιμεριστικής Ιδιότητας: k · (a · √2 ＋ b)",
      labDesc: "Ρυθμίστε τους συντελεστές και δείτε βήμα-προς-βήμα την ανάπτυξη και τους κανόνες προσήμων.",
      labFactorK: "Εξωτερικός Πολλαπλασιαστής (k):",
      labCoefA: "Συντελεστής ρίζας (a):",
      labTermB: "Σταθερός όρος (b):",
      labInitialForm: "ΑΡΧΙΚΗ ΜΟΡΦΗ ΠΑΡΑΣΤΑΣΗΣ",
      labStepsHeader: "ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΜΕΡΙΣΜΟΥ",
      labTerm1Title: "1ο Γινόμενο (Ριζικός όρος):",
      labTerm2Title: "2ο Γινόμενο (Σταθερός όρος):",
      labFinalResult: "ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ",
      problemsSectionTitle: "Λυμένα Προβλήματα Εφαρμογής",
      p1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ",
      p1Title: "Αναγωγή ομοίων ριζών και απαλοιφή",
      p1Statement: "Να υπολογιστεί η αριθμητική τιμή της παράστασης:",
      thStep: "Βήμα",
      thOperation: "Πράξη",
      thExpression: "Έκφραση",
      p1Step1Name: "1. Επιμεριστική",
      p1Step1Op: "Πολλαπλασιασμός όρων",
      p1Step2Name: "2. Ομαδοποίηση",
      p1Step2Op: "Ρίζες και αριθμοί",
      p1Step3Name: "3. Τελικό",
      p1Step3Op: "Αναγωγή",
      p1FinalValue: "Τελική Τιμή:",
      p1IrrationalLabel: "(άρρητος)",
      p2Badge: "ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΠΕΡΙΜΕΤΡΟΣ",
      p2Title: "Περίμετρος ορθογωνίου με πλευρές άρρητους",
      p2StatementPre: "Ένα ορθογώνιο οικόπεδο έχει μήκος",
      p2StatementMid: "μέτρα και πλάτος",
      p2StatementPost: "μέτρα.",
      p2StatementQuestion: "Να υπολογιστεί η περίμετρος Π του οικοπέδου σε απλοποιημένη μορφή.",
      thQuantity: "Μέγεθος",
      thFormula: "Τύπος",
      thCalculation: "Υπολογισμός",
      p2SemiPerimeter: "Ημιπερίμετρος (L ＋ W)",
      p2Perimeter: "Περίμετρος Π",
      p2Distributive: "Επιμεριστική",
      p2ResultLabel: "Περίμετρος:",
      warningTitle: "ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΠΡΑΞΕΙΣ",
      warning1Title: "Δεν προσθέτουμε διαφορετικές ρίζες:",
      warning1TextPre: "Η έκφραση",
      warning1TextMid: "ΔΕΝ ισούται με",
      warning1TextPost: "Παραμένει ως έχει, ακριβώς όπως το x ＋ y.",
      warning2Title: "Διαίρεση με το μηδέν:",
      warning2Text: "Το κλάσμα",
      warning2TextEnd: "δεν ορίζεται ποτέ, για κανέναν πραγματικό αριθμό α.",
      warning3Title: "Απαλοιφή παρένθεσης με μείον:",
      warning3Text: "Στην έκφραση 5 － (x － 2), το μείον αλλάζει και το πρόσημο του 2: 5 － x ＋ 2 ＝ 7 － x.",
      ctaTitle: "Εξασκηθείτε στις Πράξεις των Πραγματικών!",
      ctaDesc: "Δοκιμάστε τις δυνάμεις σας στις διαδραστικές ερωτήσεις και τα προβλήματα πράξεων με άμεση ανατροφοδότηση.",
      ctaButton: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
    },
    en: {
      metaTitle: "Operations on Real Numbers | Theory 9th Grade",
      metaDesc: "Detailed theory on operations with real numbers, distributive and commutative properties, sign rules, and interactive operations lab.",
      backText: "9th Grade",
      btnExercises: "EXERCISES",
      chapterBadge: "CHAPTER 4 • 9TH GRADE",
      heroTitle: "Operations & Properties of Real Numbers",
      heroSubtitle: "The four fundamental operations extend to the entire set of real numbers. Master the distributive property, handling roots and fractions, and exact parenthesis removal rules.",
      heroCta: "GO TO EXERCISES",
      step1Title: "Addition & Subtraction in ℝ",
      step1Desc: "Addition and subtraction apply to all real numbers (rational and irrational) under the same fundamental properties:",
      step1Commutative: "Commutative:",
      step1Neutral: "Identity Element:",
      step1Opposite: "Additive Inverse:",
      step1RootsTitle: "Operations with Radicals:",
      step1RootsDesc: "We only add or subtract like radicals:",
      step2Title: "Multiplication & Division in ℝ",
      step2Desc: "Multiplication of real numbers obeys fundamental laws and properties:",
      step2Neutral: "Identity Element:",
      step2Reciprocal: "Reciprocal (a ≠ 0):",
      step2ZeroProd: "Zero-Product Property:",
      step2ZeroProdRule: "a · b ＝ 0 ⇔ a ＝ 0 or b ＝ 0",
      step2DivTitle: "Division & Fractions:",
      step2DivDesc: "Division by a number b ≠ 0 is equivalent to multiplication by its reciprocal:",
      step3Title: "The Distributive Property",
      step3Desc: "The distributive property connects multiplication with addition and subtraction:",
      step3ExpansionTitle: "Expansion (left to right):",
      step3FactoringTitle: "Common Factor (right to left):",
      step4Title: "Sign Rules & Parentheses",
      step4Desc: "The strict rules for signs across products, quotients, and parentheses:",
      step4ProdQuotTitle: "Product & Quotient:",
      step4ParenthesesTitle: "Parenthesis Removal:",
      step4PlusRule: "Signs remain unchanged.",
      step4MinusRule: "Signs of all terms are inverted!",
      labBadge: "OPERATIONS LAB",
      labTitle: "Distributive Property Application: k · (a · √2 ＋ b)",
      labDesc: "Adjust the coefficients to inspect the step-by-step expansion and sign rules in real time.",
      labFactorK: "Outer Multiplier (k):",
      labCoefA: "Root Coefficient (a):",
      labTermB: "Constant Term (b):",
      labInitialForm: "INITIAL EXPRESSION FORM",
      labStepsHeader: "DETAILED EXPANSION STEPS",
      labTerm1Title: "1st Product (Radical term):",
      labTerm2Title: "2nd Product (Constant term):",
      labFinalResult: "FINAL RESULT",
      problemsSectionTitle: "Solved Practice Problems",
      p1Badge: "PROBLEM 1: SIMPLIFYING EXPRESSIONS",
      p1Title: "Combining like radicals and elimination",
      p1Statement: "Calculate the numerical value of the expression:",
      thStep: "Step",
      thOperation: "Operation",
      thExpression: "Expression",
      p1Step1Name: "1. Distributive",
      p1Step1Op: "Term multiplication",
      p1Step2Name: "2. Grouping",
      p1Step2Op: "Radicals and constants",
      p1Step3Name: "3. Final",
      p1Step3Op: "Reduction",
      p1FinalValue: "Final Value:",
      p1IrrationalLabel: "(irrational)",
      p2Badge: "PROBLEM 2: GEOMETRIC PERIMETER",
      p2Title: "Perimeter of rectangle with irrational sides",
      p2StatementPre: "A rectangular plot of land has length",
      p2StatementMid: "meters and width",
      p2StatementPost: "meters.",
      p2StatementQuestion: "Calculate the perimeter P of the plot in simplified form.",
      thQuantity: "Quantity",
      thFormula: "Formula",
      thCalculation: "Calculation",
      p2SemiPerimeter: "Semi-perimeter (L ＋ W)",
      p2Perimeter: "Perimeter P",
      p2Distributive: "Distributive",
      p2ResultLabel: "Perimeter:",
      warningTitle: "ATTENTION: COMMON PITFALLS IN OPERATIONS",
      warning1Title: "Do not add unlike radicals:",
      warning1TextPre: "The expression",
      warning1TextMid: "does NOT equal",
      warning1TextPost: "It remains as is, exactly like x ＋ y.",
      warning2Title: "Division by zero:",
      warning2Text: "The fraction",
      warning2TextEnd: "is never defined, for any real number a.",
      warning3Title: "Removing parentheses preceded by a minus:",
      warning3Text: "In the expression 5 － (x － 2), the minus changes the sign of 2 as well: 5 － x ＋ 2 ＝ 7 － x.",
      ctaTitle: "Master Real Number Operations in Practice!",
      ctaDesc: "Test your skills with interactive questions and applied problems with instant feedback.",
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
          href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
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
                href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
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
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step1Commutative}</strong>
                  <span className="font-bold text-indigo-900 whitespace-nowrap">α ＋ β ＝ β ＋ α</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step1Neutral}</strong>
                  <span className="font-bold text-indigo-900 whitespace-nowrap">α ＋ 0 ＝ α</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step1Opposite}</strong>
                  <span className="font-bold text-indigo-900 whitespace-nowrap">α ＋ (－α) ＝ 0</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950">
                <span className="font-bold block mb-1">{cur.step1RootsTitle}</span>
                <p className="mb-2 text-slate-600">{cur.step1RootsDesc}</p>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100 font-mono font-bold text-indigo-900 flex flex-wrap items-center justify-center gap-1.5 text-center">
                  <span className="whitespace-nowrap">3 · <Radical>2</Radical> ＋ 5 · <Radical>2</Radical></span>
                  <span>＝</span>
                  <span className="whitespace-nowrap">(3 ＋ 5) · <Radical>2</Radical></span>
                  <span>＝</span>
                  <span className="text-emerald-700 whitespace-nowrap">8 · <Radical>2</Radical></span>
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
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-700 font-mono">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step2Neutral}</strong>
                  <span className="font-bold text-indigo-900 whitespace-nowrap">α · 1 ＝ α</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step2Reciprocal}</strong>
                  <span className="font-bold text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap">
                    α · <Frac num="1" den="α" /> ＝ 1
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-1 break-words [overflow-wrap:anywhere]">
                  <strong className="font-sans text-slate-900">{cur.step2ZeroProd}</strong>
                  <span className="font-bold text-indigo-900 break-words">{cur.step2ZeroProdRule}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950">
                <strong className="block mb-1">{cur.step2DivTitle}</strong>
                <p className="mb-2 text-slate-700">{cur.step2DivDesc}</p>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono font-bold text-emerald-900 flex flex-wrap items-center justify-center gap-2">
                  <span className="whitespace-nowrap">α : β</span>
                  <span>＝</span>
                  <span className="inline-flex items-center whitespace-nowrap">α · <Frac num="1" den="β" /></span>
                  <span>＝</span>
                  <Frac num="α" den="β" />
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

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-3 text-center shadow-inner space-y-1">
                <div className="font-mono text-xs sm:text-base font-black tracking-wide break-words [overflow-wrap:anywhere]">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="font-mono text-xs sm:text-base font-black tracking-wide text-indigo-200 break-words [overflow-wrap:anywhere]">
                  α · (β － γ) ＝ α · β － α · γ
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block mb-1 text-slate-900">{cur.step3ExpansionTitle}</strong>
                  <div className="font-mono text-xs text-indigo-900 font-bold bg-white p-2 rounded border border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="whitespace-nowrap">2 · (x ＋ 5)</span>
                    <span>＝</span>
                    <span className="whitespace-nowrap">2 · x ＋ 2 · 5</span>
                    <span>＝</span>
                    <span className="text-emerald-700 whitespace-nowrap">2 · x ＋ 10</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block mb-1 text-slate-900">{cur.step3FactoringTitle}</strong>
                  <div className="font-mono text-xs text-indigo-900 font-bold bg-white p-2 rounded border border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="whitespace-nowrap">4 · <Radical>3</Radical> ＋ 6 · <Radical>3</Radical></span>
                    <span>＝</span>
                    <span className="whitespace-nowrap">(4 ＋ 6) · <Radical>3</Radical></span>
                    <span>＝</span>
                    <span className="text-emerald-700 whitespace-nowrap">10 · <Radical>3</Radical></span>
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

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-2">{cur.step4ProdQuotTitle}</span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] sm:text-xs text-slate-800 text-center">
                    <div className="p-1.5 bg-white rounded border border-slate-200 font-bold text-emerald-700">(＋) · (＋) ＝ ＋</div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 font-bold text-emerald-700">(－) · (－) ＝ ＋</div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 font-bold text-rose-700">(＋) · (－) ＝ －</div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 font-bold text-rose-700">(－) · (＋) ＝ －</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1.5">{cur.step4ParenthesesTitle}</span>
                  <ul className="space-y-1.5 text-slate-700 text-xs">
                    <li className="p-1.5 bg-white rounded border border-slate-200 flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                      <span className="font-mono font-bold text-indigo-950 whitespace-nowrap">＋(α － β) ＝ α － β:</span>
                      <span>{cur.step4PlusRule}</span>
                    </li>
                    <li className="p-1.5 bg-white rounded border border-slate-200 flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                      <span className="font-mono font-bold text-indigo-950 whitespace-nowrap">－(α － β) ＝ －α ＋ β:</span>
                      <span>{cur.step4MinusRule}</span>
                    </li>
                  </ul>
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
            <div className="text-xs text-slate-500 max-w-xs break-words [overflow-wrap:anywhere]">
              {cur.labDesc}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">{cur.labFactorK}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{factorK}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={factorK}
                  onChange={(e) => setFactorK(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">{cur.labCoefA}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{coefA}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefA}
                  onChange={(e) => setCoefA(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">{cur.labTermB}</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{termB}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={termB}
                  onChange={(e) => setTermB(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labInitialForm)}
                </span>
                <div className="text-base sm:text-xl lg:text-2xl font-mono font-black flex flex-wrap items-center justify-center gap-1.5 py-1 max-w-full">
                  <span className="whitespace-nowrap">{factorK} · (</span>
                  {coefA !== 0 && (
                    <span className="inline-flex items-center whitespace-nowrap">
                      {formatRadTerm(coefA, 2)}
                    </span>
                  )}
                  {termB !== 0 && (
                    <span className="whitespace-nowrap">
                      {coefA !== 0 ? (termB > 0 ? ` ＋ ${termB}` : ` － ${Math.abs(termB)}`) : termB}
                    </span>
                  )}
                  {coefA === 0 && termB === 0 && <span>0</span>}
                  <span>)</span>
                </div>
              </div>

              {/* Βήμα Επιμερισμού */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full space-y-3 min-w-0">
                <span className="text-xs font-bold text-slate-700 block uppercase break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(cur.labStepsHeader)}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 min-w-0">
                    <span className="text-slate-500 block text-[10px] mb-1">{cur.labTerm1Title}</span>
                    <div className="font-bold text-indigo-900 flex flex-wrap items-center gap-1">
                      <span className="whitespace-nowrap">{factorK} · ({coefA} · <Radical>2</Radical>)</span>
                      <span>＝</span>
                      <span className="whitespace-nowrap">{resA !== 0 ? formatRadTerm(resA, 2) : '0'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 min-w-0">
                    <span className="text-slate-500 block text-[10px] mb-1">{cur.labTerm2Title}</span>
                    <div className="font-bold text-indigo-900 flex flex-wrap items-center gap-1">
                      <span className="whitespace-nowrap">{factorK} · ({termB >= 0 ? `＋${termB}` : `－${Math.abs(termB)}`})</span>
                      <span>＝</span>
                      <span className="whitespace-nowrap">{resB >= 0 ? `＋${resB}` : `－${Math.abs(resB)}`}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <span className="font-bold text-emerald-900 uppercase text-xs break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(cur.labFinalResult)}:
                  </span>
                  <div className="font-mono font-black text-emerald-950 text-base sm:text-lg flex flex-wrap items-center gap-1.5">
                    {resA !== 0 ? (
                      <>
                        <span className="inline-flex items-center whitespace-nowrap">{formatRadTerm(resA, 2)}</span>
                        {resB > 0 && <span className="whitespace-nowrap">＋ {resB}</span>}
                        {resB < 0 && <span className="whitespace-nowrap">－ {Math.abs(resB)}</span>}
                      </>
                    ) : (
                      <span>{resB}</span>
                    )}
                    {resA === 0 && resB === 0 && <span>0</span>}
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
                    <span>Α ＝ 3 · (2 · <Radical>3</Radical> － 1) － 4 · (<Radical>3</Radical> ＋ 2) ＋ 11</span>
                  </span>
                </p>

                {/* Mobile View: Stacked Cards (χωρίς καθόλου οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2 mb-4 font-mono text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step1Name}</span>
                      <span>{cur.p1Step1Op}</span>
                    </div>
                    <div className="font-bold text-slate-800 break-words">
                      6 · <Radical>3</Radical> － 3 － 4 · <Radical>3</Radical> － 8 ＋ 11
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step2Name}</span>
                      <span>{cur.p1Step2Op}</span>
                    </div>
                    <div className="font-bold text-slate-800 break-words">
                      (6 － 4) · <Radical>3</Radical> ＋ (－3 － 8 ＋ 11)
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-slate-500 font-sans text-[11px]">
                      <span className="font-bold text-indigo-900">{cur.p1Step3Name}</span>
                      <span>{cur.p1Step3Op}</span>
                    </div>
                    <div className="font-bold text-emerald-700 break-words">
                      2 · <Radical>3</Radical> ＋ 0 ＝ 2 · <Radical>3</Radical>
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (μόνο για sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thStep}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thOperation}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thExpression}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step1Name}</td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p1Step1Op}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <span className="whitespace-nowrap">6 · <Radical>3</Radical></span>
                            <span>－ 3 －</span>
                            <span className="whitespace-nowrap">4 · <Radical>3</Radical></span>
                            <span>－ 8 ＋ 11</span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step2Name}</td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p1Step2Op}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <span className="whitespace-nowrap">(6 － 4) · <Radical>3</Radical></span>
                            <span>＋</span>
                            <span className="whitespace-nowrap">(－3 － 8 ＋ 11)</span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p1Step3Name}</td>
                        <td className="p-2 sm:p-2.5 font-sans">{cur.p1Step3Op}</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <span className="whitespace-nowrap">2 · <Radical>3</Radical> ＋ 0</span>
                            <span>＝</span>
                            <span className="text-emerald-700 whitespace-nowrap">2 · <Radical>3</Radical></span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong>{cur.p1FinalValue}</strong>{' '}
                    <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap">
                      Α ＝ 2 · <Radical>3</Radical>
                    </span>{' '}
                    <span>{cur.p1IrrationalLabel}.</span>
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
                  {cur.p2StatementPre}{' '}
                  <span className="font-mono font-bold text-slate-900 inline-flex items-center whitespace-nowrap">
                    L ＝ 4 · <Radical>2</Radical> ＋ 3
                  </span>{' '}
                  {cur.p2StatementMid}{' '}
                  <span className="font-mono font-bold text-slate-900 inline-flex items-center whitespace-nowrap">
                    W ＝ <Radical>2</Radical> ＋ 1
                  </span>{' '}
                  {cur.p2StatementPost} <br />
                  {cur.p2StatementQuestion}
                </p>

                {/* Mobile View: Stacked Cards (χωρίς καθόλου οριζόντιο scroll) */}
                <div className="block sm:hidden space-y-2.5 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold">{cur.p2SemiPerimeter}</span>
                      <span className="font-mono text-slate-500">L ＋ W</span>
                    </div>
                    <div className="font-mono text-slate-800 break-words leading-relaxed">
                      (4 · <Radical>2</Radical> ＋ 3) ＋ (<Radical>2</Radical> ＋ 1) ＝ <strong>5 · <Radical>2</Radical> ＋ 4</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold">{cur.p2Perimeter}</span>
                      <span className="font-mono text-slate-500">2 · (L ＋ W)</span>
                    </div>
                    <div className="font-mono text-slate-800 break-words leading-relaxed">
                      2 · (5 · <Radical>2</Radical> ＋ 4)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 font-semibold text-[11px]">
                      <span className="text-indigo-900 font-bold">{cur.p2Distributive}</span>
                      <span className="font-mono text-slate-500">2 · (5 · <Radical>2</Radical>) ＋ 2 · 4</span>
                    </div>
                    <div className="font-mono font-bold text-indigo-700 text-sm break-words">
                      10 · <Radical>2</Radical> ＋ 8 m
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας (μόνο για sm: και πάνω) */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thQuantity}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thFormula}</th>
                        <th className="p-2 sm:p-2.5 border-b">{cur.thCalculation}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2SemiPerimeter}</td>
                        <td className="p-2 sm:p-2.5">L ＋ W</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <span className="whitespace-nowrap">(4 · <Radical>2</Radical> ＋ 3) ＋ (<Radical>2</Radical> ＋ 1)</span>
                            <span>＝</span>
                            <span className="whitespace-nowrap">5 · <Radical>2</Radical> ＋ 4</span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2Perimeter}</td>
                        <td className="p-2 sm:p-2.5">2 · (L ＋ W)</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center whitespace-nowrap">
                            2 · (5 · <Radical>2</Radical> ＋ 4)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">{cur.p2Distributive}</td>
                        <td className="p-2 sm:p-2.5">
                          <span className="inline-flex items-center whitespace-nowrap">
                            2 · (5 · <Radical>2</Radical>) ＋ 2 · 4
                          </span>
                        </td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">
                          <span className="inline-flex items-center gap-1 text-emerald-700 whitespace-nowrap">
                            10 · <Radical>2</Radical> ＋ 8 m
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>{cur.p2ResultLabel}</strong>{' '}
                    <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap">
                      Π ＝ 10 · <Radical>2</Radical> ＋ 8 m
                    </span>.
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
                    <strong>{cur.warning1Title}</strong> {cur.warning1TextPre}{' '}
                    <span className="inline-flex items-center whitespace-nowrap font-bold">
                      <Radical>2</Radical> ＋ <Radical>3</Radical>
                    </span>{' '}
                    {cur.warning1TextMid}{' '}
                    <span className="inline-flex items-center whitespace-nowrap font-bold">
                      <Radical>5</Radical>
                    </span>. {cur.warning1TextPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{cur.warning2Title}</strong> {cur.warning2Text}{' '}
                    <Frac num="α" den="0" /> {cur.warning2TextEnd}
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
            href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(cur.ctaButton)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}