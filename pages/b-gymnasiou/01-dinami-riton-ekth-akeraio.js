import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ & ΟΡΙΑ ΕΡΓΑΣΤΗΡΙΩΝ (10πλάσια εύρη)
// ==========================================
export const LAB_LIMITS = {
  // Εργαστήριο 1: Υπολογιστής Δύναμης
  lab1: {
    baseNum: { min: -50, max: 50, step: 1, default: -2 },
    baseDen: { min: 1, max: 50, step: 1, default: 3 },
    exponent: { min: -40, max: 40, step: 1, default: -2 },
  },
  // Εργαστήριο 2: Σκάλα των Δυνάμεων
  lab2: {
    scaleBase: { min: 2, max: 50, step: 1, default: 2 },
    scaleExpRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    defaultExp: 2,
  },
  // Εργαστήριο 3: Επαληθευτής Ιδιοτήτων
  lab3: {
    baseA: { min: 2, max: 60, step: 1, default: 2 },
    expM: { min: -40, max: 40, step: 1, default: 3 },
    expN: { min: -40, max: 40, step: 1, default: -2 },
  }
};

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

// Αυστηρός μαθηματικός helper για κατακόρυφα κλάσματα (μηδενικό overflow & ασφαλής υποστήριξη JSX/strings)
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
        <span className="border-b border-current px-1 pb-0.5 break-all">{renderContent(num)}</span>
        <span className="pt-0.5 px-1 break-all">{renderContent(den)}</span>
      </span>
    </span>
  );
};

// Ασφαλής αριθμητική μορφοποίηση με βάση τη γλώσσα
const formatSafeNumber = (num, locale = 'el') => {
  if (Math.abs(num) > 1e12) {
    return num.toExponential(4);
  }
  return num.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
};

export default function DinamiRitonEkthAkeraio() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --- Λεξικό i18n (el / en) ---
  const t = {
    el: {
      pageTitle: "Δυνάμεις Ρητών Αριθμών με Εκθέτη Ακέραιο | Β' Γυμνασίου",
      pageDesc: "Θεωρία, ιδιότητες και διαδραστικά εργαστήρια για τις δυνάμεις ρητών αριθμών με εκθέτη ακέραιο για τη Β' Γυμνασίου.",
      backText: "Β' Γυμνασίου",
      actionBtn: "ΑΣΚΗΣΕΙΣ",
      badge: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 1",
      mainTitle: "ΔΥΝΑΜΕΙΣ ΡΗΤΩΝ ΑΡΙΘΜΩΝ ΜΕ ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ",
      mainSubtitle: "Επεκτείνουμε την έννοια της δύναμης από τους φυσικούς αριθμούς στους αρνητικούς ακέραιους εκθέτες, ερμηνεύουμε τη σημασία της αντίστροφης βάσης και εφαρμόζουμε τις θεμελιώδεις ιδιότητες των δυνάμεων.",
      
      // Ενότητα 1
      sec1Num: "1",
      sec1Title: "Επανάληψη: Ρητοί Αριθμοί και Δυνάμεις με Φυσικό Εκθέτη",
      rationalDef1: "Ρητός αριθμός",
      rationalDef2: "ονομάζεται κάθε αριθμός που μπορεί να παρασταθεί ως κλάσμα",
      rationalDef3: "όπου ο",
      rationalDef4: "είναι ακέραιος και ο",
      rationalDef5: "φυσικός διάφορος του μηδενός (β ≠ 0).",
      powerDef1: "Όταν ο εκθέτης",
      powerDef2: "είναι φυσικός αριθμός (ν ＞ 1), η δύναμη",
      powerDef3: "εκφράζει το γινόμενο ν ίσων παραγόντων:",
      factorsCount: "(ν παράγοντες)",
      signsTitle: "ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΩΝ & ΠΑΡΕΝΘΕΣΕΙΣ",
      evenExp: "ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ",
      evenExpDesc: "Αποτέλεσμα πάντα θετικό",
      oddExp: "ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ",
      oddExpDesc: "Διατηρεί το αρνητικό πρόσημο",
      cautionNote: "Προσοχή στη γραφή:",
      cautionDetail: "Στο (-3)² ＝ 9 ο εκθέτης επηρεάζει και το πρόσημο, ενώ στο -3² ＝ -9 η δύναμη αφορά μόνο το 3.",

      // Ενότητα 2
      sec2Num: "2",
      sec2Title: "Δύναμη με Αρνητικό Ακέραιο και Μηδενικό Εκθέτη",
      sec2Intro: "Για να επεκτείνουμε τον ορισμό της δύναμης σε όλους τους ακεραίους χωρίς να χαθούν οι ιδιότητες των πράξεων, ορίζουμε για κάθε ρητό αριθμό α ≠ 0 και θετικό ακέραιο ν:",
      zeroExpTitle: "ΜΗΔΕΝΙΚΟΣ ΕΚΘΕΤΗΣ",
      zeroExpDesc: "Κάθε μη μηδενικός αριθμός στη μηδενική ισούται με 1.",
      negExpTitle: "ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ",
      negExpDesc: "Ο αρνητικός εκθέτης σημαίνει αντίστροφος του αⁿ.",
      fracNegExpTitle: "ΚΛΑΣΜΑ ΜΕ ΑΡΝΗΤΙΚΟ ΕΚΘΕΤΗ",
      fracNegExpDesc: "Αντιστρέφουμε τους όρους του κλάσματος και αλλάζουμε το πρόσημο του εκθέτη.",

      // Εργαστήριο 1
      lab1Heading: "🛠️ Διαδραστικό Εργαστήριο 1: Υπολογισμός Δύναμης & Ανάλυση Βήμα-Βήμα",
      lab1Range: "Εύρος: α ∈ [-50, 50], ν ∈ [-40, 40]",
      baseNumLabel: "ΑΡΙΘΜΗΤΗΣ ΒΑΣΗΣ (α)",
      baseDenLabel: "ΠΑΡΟΝΟΜΑΣΤΗΣ ΒΑΣΗΣ (β)",
      expLabel: "ΕΚΘΕΤΗΣ (ΑΚΕΡΑΙΟΣ ν)",
      mathExprTitle: "ΜΑΘΗΜΑΤΙΚΗ ΕΚΦΡΑΣΗ",
      stepsTitle: "ΑΝΑΛΥΣΗ ΒΗΜΑΤΩΝ:",
      stepZeroExp: "Οποιοσδήποτε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1.",
      stepNegExp1: "Αρνητικός εκθέτης",
      stepNegExp2: "Αντιστρέφουμε τη βάση σε",
      stepNegExp3: "και κάνουμε τον εκθέτη θετικό",
      stepNegExp4: "Υψώνουμε αριθμητή και παρονομαστή:",
      stepPosExp1: "Θετικός εκθέτης",
      stepPosExp2: "Υπολογίζουμε απευθείας τη δύναμη.",
      stepPosExp3: "Έκφραση:",

      // Ενότητα 3
      sec3Num: "3",
      sec3Title: "🛠️ Διαδραστικό Εργαστήριο 2: Η Σκάλα των Δυνάμεων & η Συνέχεια των Πράξεων",
      sec3Intro: "Παρατήρησε πώς κάθε φορά που μειώνουμε τον εκθέτη κατά 1, διαιρούμε το προηγούμενο αποτέλεσμα με τη βάση. Έτσι γίνεται απολύτως φυσική η εμφάνιση των κλασμάτων στους αρνητικούς εκθέτες!",
      scaleBaseLabel: "ΕΠΙΛΟΓΗ ΒΑΣΗΣ (α)",
      scaleBaseMax: "Έως 50",
      stepLeftNote1: "Κάθε βήμα προς τα αριστερά είναι μία διαίρεση με το",
      expCardLabel: "ΕΚΘ.",

      // Ενότητα 4
      sec4Num: "4",
      sec4Title: "Ιδιότητες των Δυνάμεων με Ακέραιο Εκθέτη",
      sec4Intro: "Όλες οι γνωστές ιδιότητες των δυνάμεων εφαρμόζονται αναλλοίωτες για οποιουσδήποτε ακέραιους εκθέτες μ, ν (με α, β ≠ 0):",
      propTag: "ΙΔΙΟΤΗΤΑ",
      prop1Title: "Γινόμενο Ίδιας Βάσης",
      prop1Desc: "Διατηρούμε τη βάση και προσθέτουμε τους εκθέτες:",
      prop2Title: "Πηλίκο Ίδιας Βάσης",
      prop2Desc: "Διατηρούμε τη βάση και αφαιρούμε τους εκθέτες:",
      prop3Title: "Δύναμη σε Δύναμη",
      prop3Desc: "Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:",
      prop4Title: "Δύναμη Γινομένου",
      prop4Desc: "Υψώνουμε κάθε παράγοντα στον εκθέτη:",
      prop5Title: "Δύναμη Πηλίκου / Κλάσματος",
      prop5Desc: "Ο εκθέτης εφαρμόζεται ξεχωριστά σε αριθμητή και παρονομαστή:",

      // Εργαστήριο 3
      lab3Heading: "🛠️ Διαδραστικό Εργαστήριο 3: Επαλήθευση Ιδιοτήτων σε Πραγματικό Χρόνο",
      lab3Range: "Εύρος: α ∈ [2, 60], μ, ν ∈ [-40, 40]",
      tabMul: "ΓΙΝΟΜΕΝΟ (αᵐ · αⁿ)",
      tabDiv: "ΠΗΛΙΚΟ (αᵐ : αⁿ)",
      tabPow: "ΔΥΝΑΜΗ ((αᵐ)ⁿ)",
      baseALabel: "ΒΑΣΗ (α)",
      expMLabel: "ΕΚΘΕΤΗΣ (μ)",
      expNLabel: "ΕΚΘΕΤΗΣ (ν)",
      lab3ResultTitle: "ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ & ΑΠΟΤΕΛΕΣΜΑ",
      mulRuleExpl: "Πολλαπλασιασμός δυνάμεων με την ίδια βάση (προσθαφαίρεση εκθετών):",
      divRuleExpl: "Διαίρεση δυνάμεων με την ίδια βάση (αφαίρεση εκθετών):",
      powRuleExpl: "Ύψωση δύναμης σε άλλη δύναμη (πολλαπλασιασμός εκθετών):"
    },
    en: {
      pageTitle: "Powers of Rational Numbers with Integer Exponent | Grade 8",
      pageDesc: "Theory, properties, and interactive laboratories for powers of rational numbers with integer exponents for 8th Grade.",
      backText: "Grade 8",
      actionBtn: "EXERCISES",
      badge: "GRADE 8 • UNIT 1",
      mainTitle: "POWERS OF RATIONAL NUMBERS WITH INTEGER EXPONENTS",
      mainSubtitle: "We extend the concept of powers from natural numbers to negative integer exponents, interpret reciprocal bases, and apply fundamental power properties.",
      
      // Section 1
      sec1Num: "1",
      sec1Title: "Review: Rational Numbers and Powers with Natural Exponents",
      rationalDef1: "A rational number",
      rationalDef2: "is defined as any number that can be expressed as a fraction",
      rationalDef3: "where",
      rationalDef4: "is an integer and",
      rationalDef5: "is a non-zero natural number (b ≠ 0).",
      powerDef1: "When the exponent",
      powerDef2: "is a natural number (n ＞ 1), the power",
      powerDef3: "represents the product of n equal factors:",
      factorsCount: "(n factors)",
      signsTitle: "SIGN RULES & PARENTHESES",
      evenExp: "EVEN EXPONENT",
      evenExpDesc: "Result is always positive",
      oddExp: "ODD EXPONENT",
      oddExpDesc: "Maintains the negative sign",
      cautionNote: "Notation caution:",
      cautionDetail: "In (-3)² ＝ 9 the exponent applies to the sign, whereas in -3² ＝ -9 the exponent applies only to 3.",

      // Section 2
      sec2Num: "2",
      sec2Title: "Powers with Negative Integer and Zero Exponents",
      sec2Intro: "To extend the definition of powers across all integers while preserving arithmetic laws, we define for every rational number a ≠ 0 and positive integer n:",
      zeroExpTitle: "ZERO EXPONENT",
      zeroExpDesc: "Any non-zero number raised to the zero power equals 1.",
      negExpTitle: "NEGATIVE EXPONENT",
      negExpDesc: "A negative exponent denotes the reciprocal of aⁿ.",
      fracNegExpTitle: "FRACTION WITH NEGATIVE EXPONENT",
      fracNegExpDesc: "Invert the numerator and denominator and change the exponent's sign to positive.",

      // Lab 1
      lab1Heading: "🛠️ Interactive Lab 1: Power Computation & Step-by-Step Analysis",
      lab1Range: "Range: a ∈ [-50, 50], n ∈ [-40, 40]",
      baseNumLabel: "BASE NUMERATOR (a)",
      baseDenLabel: "BASE DENOMINATOR (b)",
      expLabel: "EXPONENT (INTEGER n)",
      mathExprTitle: "MATHEMATICAL EXPRESSION",
      stepsTitle: "STEP-BY-STEP BREAKDOWN:",
      stepZeroExp: "Any non-zero number raised to the zero power equals 1.",
      stepNegExp1: "Negative exponent",
      stepNegExp2: "Invert the base to",
      stepNegExp3: "and make the exponent positive",
      stepNegExp4: "Raise both numerator and denominator:",
      stepPosExp1: "Positive exponent",
      stepPosExp2: "Compute power directly.",
      stepPosExp3: "Expression:",

      // Section 3
      sec3Num: "3",
      sec3Title: "🛠️ Interactive Lab 2: The Power Scale & Arithmetic Continuity",
      sec3Intro: "Observe how reducing the exponent by 1 divides the previous result by the base. This makes reciprocal fractions for negative powers completely intuitive!",
      scaleBaseLabel: "SELECT BASE (a)",
      scaleBaseMax: "Up to 50",
      stepLeftNote1: "Each step to the left is a division by",
      expCardLabel: "EXP.",

      // Section 4
      sec4Num: "4",
      sec4Title: "Properties of Powers with Integer Exponents",
      sec4Intro: "All standard power properties hold unconditionally for any integer exponents m, n (with a, b ≠ 0):",
      propTag: "PROPERTY",
      prop1Title: "Product of Same Base",
      prop1Desc: "Keep the base and add the exponents:",
      prop2Title: "Quotient of Same Base",
      prop2Desc: "Keep the base and subtract the exponents:",
      prop3Title: "Power of a Power",
      prop3Desc: "Keep the base and multiply the exponents:",
      prop4Title: "Power of a Product",
      prop4Desc: "Raise each factor to the exponent:",
      prop5Title: "Power of a Quotient / Fraction",
      prop5Desc: "Apply the exponent separately to numerator and denominator:",

      // Lab 3
      lab3Heading: "🛠️ Interactive Lab 3: Real-Time Property Verifier",
      lab3Range: "Range: a ∈ [2, 60], m, n ∈ [-40, 40]",
      tabMul: "PRODUCT (aᵐ · aⁿ)",
      tabDiv: "QUOTIENT (aᵐ : aⁿ)",
      tabPow: "POWER ((aᵐ)ⁿ)",
      baseALabel: "BASE (a)",
      expMLabel: "EXPONENT (m)",
      expNLabel: "EXPONENT (n)",
      lab3ResultTitle: "RULE APPLICATION & RESULT",
      mulRuleExpl: "Multiplying powers with the same base (add exponents):",
      divRuleExpl: "Dividing powers with the same base (subtract exponents):",
      powRuleExpl: "Raising a power to another power (multiply exponents):"
    }
  };

  const cur = t[locale] || t.el;

  // --- State Εργαστηρίου 1: Υπολογισμός Δύναμης Ρητού με Ακέραιο Εκθέτη ---
  const [baseNum, setBaseNum] = useState(LAB_LIMITS.lab1.baseNum.default);
  const [baseDen, setBaseDen] = useState(LAB_LIMITS.lab1.baseDen.default);
  const [exponent, setExponent] = useState(LAB_LIMITS.lab1.exponent.default);

  // --- State Εργαστηρίου 2: Η Σκάλα των Δυνάμεων ---
  const [scaleBase, setScaleBase] = useState(LAB_LIMITS.lab2.scaleBase.default);
  const [scaleExp, setScaleExp] = useState(LAB_LIMITS.lab2.defaultExp);

  // --- State Εργαστηρίου 3: Επαληθευτής Ιδιοτήτων Δυνάμεων ---
  const [propA, setPropA] = useState(LAB_LIMITS.lab3.baseA.default);
  const [propM, setPropM] = useState(LAB_LIMITS.lab3.expM.default);
  const [propN, setPropN] = useState(LAB_LIMITS.lab3.expN.default);
  const [activeTab, setActiveTab] = useState('mul');

  // Generic Stepper handler με touch-manipulation και αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const isFraction = baseDen !== 1;
  const absExp = Math.abs(exponent);
  const isExpNeg = exponent < 0;

  const invertedNum = isExpNeg ? baseDen : baseNum;
  const invertedDen = isExpNeg ? baseNum : baseDen;

  const resultNum = useMemo(() => Math.pow(invertedNum, absExp), [invertedNum, absExp]);
  const resultDen = useMemo(() => Math.pow(invertedDen, absExp), [invertedDen, absExp]);

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/01-dinami-riton-ekth-akeraio-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{cur.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        
        {/* Banner Header - Indigo Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase break-words">
              {toCleanUppercase(cur.badge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.mainTitle)}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {cur.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΕΠΑΝΑΛΗΨΗ ΑΠΟ ΤΗΝ Α' ΓΥΜΝΑΣΙΟΥ */}
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
                <strong>{cur.rationalDef1}</strong> {cur.rationalDef2} <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />, {cur.rationalDef3} <span className="font-mono text-indigo-600 font-bold">{locale === 'el' ? 'α' : 'a'}</span> {cur.rationalDef4} <span className="font-mono text-indigo-600 font-bold">{locale === 'el' ? 'β' : 'b'}</span> {cur.rationalDef5}
              </p>
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.powerDef1} <span className="font-mono text-indigo-600 font-bold">{locale === 'el' ? 'ν' : 'n'}</span> {cur.powerDef2} <span className="font-mono font-bold text-slate-900">{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span> {cur.powerDef3}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-bold text-center text-sm sm:text-xl font-mono flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α · α · α · ... · α' : 'a · a · a · ... · a'}</span>
                <span className="text-xs sm:text-sm font-normal text-indigo-700 font-sans block w-full sm:w-auto mt-1 sm:mt-0">
                  {cur.factorsCount}
                </span>
              </div>
            </div>

            {/* Πρόσημα & Παρενθέσεις */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.signsTitle)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 block uppercase break-words">{toCleanUppercase(cur.evenExp)}</span>
                  <div className="font-mono text-slate-800">(-2)<sup>4</sup> ＝ ＋16</div>
                  <div className="text-slate-500 break-words">{cur.evenExpDesc}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 block uppercase break-words">{toCleanUppercase(cur.oddExp)}</span>
                  <div className="font-mono text-slate-800">(-2)<sup>3</sup> ＝ －8</div>
                  <div className="text-slate-500 break-words">{cur.oddExpDesc}</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 break-words [overflow-wrap:anywhere]">
                <strong>{cur.cautionNote}</strong> {cur.cautionDetail}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΥΝΑΜΗ ΜΕ ΑΡΝΗΤΙΚΟ ΚΑΙ ΜΗΔΕΝΙΚΟ ΕΚΘΕΤΗ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec2Num}
              </span>
              <span>{cur.sec2Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec2Intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 break-words">
                {toCleanUppercase(cur.zeroExpTitle)}
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-lg sm:text-xl text-slate-900 break-all">
                {locale === 'el' ? 'α' : 'a'}<sup>0</sup> ＝ 1
              </div>
              <p className="text-xs text-slate-500 font-sans break-words [overflow-wrap:anywhere]">
                {cur.zeroExpDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 break-words">
                {toCleanUppercase(cur.negExpTitle)}
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-lg sm:text-xl text-slate-900 flex items-center justify-center flex-wrap gap-1">
                <span>{locale === 'el' ? 'α' : 'a'}<sup>－{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <Frac num="1" den={<>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></>} />
              </div>
              <p className="text-xs text-slate-500 font-sans break-words [overflow-wrap:anywhere]">
                {cur.negExpDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 break-words">
                {toCleanUppercase(cur.fracNegExpTitle)}
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-lg sm:text-xl text-slate-900 flex items-center justify-center flex-wrap gap-1">
                <span>(<Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />)<sup>－{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>(<Frac num={locale === 'el' ? 'β' : 'b'} den={locale === 'el' ? 'α' : 'a'} />)<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
              </div>
              <p className="text-xs text-slate-500 font-sans break-words [overflow-wrap:anywhere]">
                {cur.fracNegExpDesc}
              </p>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 1: Υπολογιστής & Ανάλυση Δύναμης */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                {cur.lab1Heading}
              </h3>
              <span className="text-xs font-mono text-slate-500 break-words">
                {cur.lab1Range}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-w-0">
              {/* Χειριστήρια Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 min-w-0">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.baseNumLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, -1, LAB_LIMITS.lab1.baseNum.min, LAB_LIMITS.lab1.baseNum.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {baseNum}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, 1, LAB_LIMITS.lab1.baseNum.min, LAB_LIMITS.lab1.baseNum.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.baseDenLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, -1, LAB_LIMITS.lab1.baseDen.min, LAB_LIMITS.lab1.baseDen.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {baseDen}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, 1, LAB_LIMITS.lab1.baseDen.min, LAB_LIMITS.lab1.baseDen.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.expLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, LAB_LIMITS.lab1.exponent.min, LAB_LIMITS.lab1.exponent.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, LAB_LIMITS.lab1.exponent.min, LAB_LIMITS.lab1.exponent.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Αποτελέσματος & Ανάλυσης */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-4 sm:p-6 rounded-2xl text-white space-y-4 shadow-md min-w-0">
                <div className="text-center space-y-2 min-w-0">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold break-words">
                    {toCleanUppercase(cur.mathExprTitle)}
                  </div>
                  <div className="text-xl sm:text-3xl md:text-4xl font-black font-mono flex items-center justify-center flex-wrap gap-2 break-all">
                    <span>
                      ({isFraction ? <Frac num={baseNum} den={baseDen} /> : baseNum})<sup className="text-amber-400">{exponent}</sup>
                    </span>
                    <span>＝</span>
                    <span className="text-emerald-400">
                      {exponent === 0 ? '1' : (
                        resultDen === 1 ? formatSafeNumber(resultNum, locale) : (
                          <Frac 
                            num={formatSafeNumber(resultNum, locale)} 
                            den={formatSafeNumber(resultDen, locale)} 
                          />
                        )
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 space-y-2 text-xs sm:text-sm font-mono text-slate-200 min-w-0">
                  <div className="text-xs text-indigo-200 uppercase font-sans font-bold break-words">
                    {toCleanUppercase(cur.stepsTitle)}
                  </div>
                  {exponent === 0 ? (
                    <div className="break-words font-sans">{cur.stepZeroExp}</div>
                  ) : isExpNeg ? (
                    <div className="space-y-2 break-words font-sans">
                      <div className="flex flex-wrap items-center gap-1">
                        <span>1. {cur.stepNegExp1} ({exponent}):</span>
                        <span>{cur.stepNegExp2} (<Frac num={baseDen} den={baseNum} />)</span>
                        <span>{cur.stepNegExp3} (＋{absExp}).</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 font-mono">
                        <span>2. {cur.stepNegExp4}</span>
                        <Frac 
                          num={<>({baseDen}){absExp > 1 ? <sup>{absExp}</sup> : ''}</>} 
                          den={<>({baseNum}){absExp > 1 ? <sup>{absExp}</sup> : ''}</>} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 break-words font-sans">
                      <div>1. {cur.stepPosExp1} (＋{exponent}): {cur.stepPosExp2}</div>
                      <div className="flex flex-wrap items-center gap-1 font-mono">
                        <span>2. {cur.stepPosExp3}</span>
                        {isFraction ? (
                          <Frac 
                            num={<>({baseNum}){absExp > 1 ? <sup>{absExp}</sup> : ''}</>} 
                            den={<>({baseDen}){absExp > 1 ? <sup>{absExp}</sup> : ''}</>} 
                          />
                        ) : (
                          <span>({baseNum})<sup>{absExp}</sup></span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Η ΣΚΑΛΑ ΤΩΝ ΔΥΝΑΜΕΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec3Num}
              </span>
              <span>{cur.sec3Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec3Intro}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center min-w-0">
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 break-words">
                  {toCleanUppercase(cur.scaleBaseLabel)}
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {cur.scaleBaseMax}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => handleStep(setScaleBase, -1, LAB_LIMITS.lab2.scaleBase.min, LAB_LIMITS.lab2.scaleBase.max, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                >
                  －
                </button>
                <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                  {locale === 'el' ? 'α' : 'a'} ＝ {scaleBase}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleStep(setScaleBase, 1, LAB_LIMITS.lab2.scaleBase.min, LAB_LIMITS.lab2.scaleBase.max, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                >
                  ＋
                </button>
              </div>
              <div className="text-xs text-slate-500 break-words">
                {cur.stepLeftNote1} <strong>{scaleBase}</strong>.
              </div>
            </div>

            {/* Cards Σκάλας (με ασφαλές flex-wrap / grid για zero horizontal scroll) */}
            <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 sm:gap-2 font-mono min-w-0">
              {LAB_LIMITS.lab2.scaleExpRange.map((exp) => {
                const isSelected = exp === scaleExp;
                const val = Math.pow(scaleBase, Math.abs(exp));
                return (
                  <div
                    key={exp}
                    onClick={() => setScaleExp(exp)}
                    className={`cursor-pointer p-1.5 sm:p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 touch-manipulation min-w-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-sans uppercase font-bold tracking-wider opacity-80 break-words text-center">
                      {toCleanUppercase(cur.expCardLabel)} {exp}
                    </span>
                    <span className="text-xs sm:text-sm font-bold">
                      {scaleBase}<sup>{exp}</sup>
                    </span>
                    <span className={`text-[10px] sm:text-xs font-bold truncate max-w-full text-center ${isSelected ? 'text-amber-300' : 'text-indigo-600'}`}>
                      {exp > 0 && `${formatSafeNumber(val, locale)}`}
                      {exp === 0 && '1'}
                      {exp < 0 && <Frac num="1" den={formatSafeNumber(val, locale)} />}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. ΟΛΕΣ ΟΙ ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec4Num}
              </span>
              <span>{cur.sec4Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec4Intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.propTag)} 1
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.prop1Title}</h3>
              <p className="text-sm text-slate-600 break-words">{cur.prop1Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ' : 'm'}</sup> · {locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ ＋ ν' : 'm ＋ n'}</sup></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.propTag)} 2
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.prop2Title}</h3>
              <p className="text-sm text-slate-600 break-words">{cur.prop2Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ' : 'm'}</sup> : {locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ － ν' : 'm － n'}</sup></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.propTag)} 3
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.prop3Title}</h3>
              <p className="text-sm text-slate-600 break-words">{cur.prop3Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                <span>({locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ' : 'm'}</sup>)<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'μ · ν' : 'm · n'}</sup></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.propTag)} 4
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.prop4Title}</h3>
              <p className="text-sm text-slate-600 break-words">{cur.prop4Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                <span>({locale === 'el' ? 'α · β' : 'a · b'})<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup> · {locale === 'el' ? 'β' : 'b'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 md:col-span-2 xl:col-span-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.propTag)} 5
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.prop5Title}</h3>
              <p className="text-sm text-slate-600 break-words">{cur.prop5Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                <span>(<Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />)<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>
                <span>＝</span>
                <Frac 
                  num={<>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></>} 
                  den={<>{locale === 'el' ? 'β' : 'b'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></>} 
                />
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 3: Επαλήθευση Ιδιοτήτων */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                {cur.lab3Heading}
              </h3>
              <span className="text-xs font-mono text-slate-500 break-words">
                {cur.lab3Range}
              </span>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
              {[
                { id: 'mul', label: cur.tabMul },
                { id: 'div', label: cur.tabDiv },
                { id: 'pow', label: cur.tabPow }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all touch-manipulation text-center break-words ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {toCleanUppercase(tab.label)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-w-0">
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 min-w-0">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.baseALabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropA, -1, LAB_LIMITS.lab3.baseA.min, LAB_LIMITS.lab3.baseA.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropA, 1, LAB_LIMITS.lab3.baseA.min, LAB_LIMITS.lab3.baseA.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.expMLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropM, -1, LAB_LIMITS.lab3.expM.min, LAB_LIMITS.lab3.expM.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propM}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropM, 1, LAB_LIMITS.lab3.expM.min, LAB_LIMITS.lab3.expM.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 break-words">
                    {toCleanUppercase(cur.expNLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropN, -1, LAB_LIMITS.lab3.expN.min, LAB_LIMITS.lab3.expN.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propN}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropN, 1, LAB_LIMITS.lab3.expN.min, LAB_LIMITS.lab3.expN.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm select-none"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Επαλήθευσης */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-4 sm:p-6 rounded-2xl text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-sans break-words">
                  {toCleanUppercase(cur.lab3ResultTitle)}
                </div>

                {activeTab === 'mul' && (
                  <div className="space-y-3 min-w-0">
                    <div className="text-xs sm:text-sm text-indigo-200 font-sans break-words">
                      {cur.mulRuleExpl}
                    </div>
                    <div className="text-base sm:text-2xl md:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-1.5 sm:gap-2 break-all">
                      <span>{propA}<sup>{propM}</sup> · {propA}<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} ＋ ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM + propN}</sup></span>
                    </div>
                  </div>
                )}

                {activeTab === 'div' && (
                  <div className="space-y-3 min-w-0">
                    <div className="text-xs sm:text-sm text-indigo-200 font-sans break-words">
                      {cur.divRuleExpl}
                    </div>
                    <div className="text-base sm:text-2xl md:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-1.5 sm:gap-2 break-all">
                      <span>{propA}<sup>{propM}</sup> : {propA}<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} － ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM - propN}</sup></span>
                    </div>
                  </div>
                )}

                {activeTab === 'pow' && (
                  <div className="space-y-3 min-w-0">
                    <div className="text-xs sm:text-sm text-indigo-200 font-sans break-words">
                      {cur.powRuleExpl}
                    </div>
                    <div className="text-base sm:text-2xl md:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-1.5 sm:gap-2 break-all">
                      <span>({propA}<sup>{propM}</sup>)<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} · ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM * propN}</sup></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}