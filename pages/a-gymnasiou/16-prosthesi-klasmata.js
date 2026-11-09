import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων: άτονα παντού εκτός από το "Α'"
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Βοηθητικός υπολογισμός ΜΚΔ (Ευκλείδης)
const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// Βοηθητικός υπολογισμός ΕΚΠ
const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική γραφή με πρόσημο μπροστά (mobile-safe)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numericNeg =
    (typeof num === 'number' && num < 0) ||
    (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;

  const displayNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const displayDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {showMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-0.5 sm:px-1 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Συγκεντρωτικό Λεξικό Μεταφράσεων i18n
const translations = {
  el: {
    pageTitle: "Πρόσθεση Ρητών Αριθμών | Α' Γυμνασίου",
    pageDesc: "Πρόσθεση ρητών αριθμών (κλάσματα και δεκαδικοί), κανόνες ομόσημων/ετερόσημων, ιδιότητες πρόσθεσης και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 14 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Πρόσθεση Ρητών Αριθμών & Ιδιότητες",
    mainDesc: "Μαθαίνουμε πώς προσθέτουμε ρητούς αριθμούς σε κλασματική και δεκαδική μορφή (ομόσημους και ετερόσημους), καθώς και τις βασικές ιδιότητες της πρόσθεσης που απλοποιούν τους υπολογισμούς μας.",

    // Ενότητα 1
    sec1Title: "Οι Κανόνες Προσήμων (Ομόσημοι & Ετερόσημοι Ρητοί)",
    sec1SameSignBadge: "ΙΔΙΟ ΠΡΟΣΗΜΟ",
    sec1SameSignTitle: "Πρόσθεση Ομόσημων Ρητών",
    sec1SameSignLead: "Όταν προσθέτουμε δύο αριθμούς με το ίδιο πρόσημο:",
    sec1SameSignRule1: "Προσθέτουμε τις απόλυτες τιμές τους.",
    sec1SameSignRule2: "Βάζουμε στο αποτέλεσμα το κοινό τους πρόσημο.",
    sec1DiffSignBadge: "ΔΙΑΦΟΡΕΤΙΚΟ ΠΡΟΣΗΜΟ",
    sec1DiffSignTitle: "Πρόσθεση Ετερόσημων Ρητών",
    sec1DiffSignLead: "Όταν προσθέτουμε δύο αριθμούς με διαφορετικό πρόσημο:",
    sec1DiffSignRule1: "Αφαιρούμε τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη.",
    sec1DiffSignRule2: "Βάζουμε το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή.",

    // Ενότητα 2
    sec2Title: "Ιδιότητες της Πρόσθεσης των Ρητών Αριθμών",
    prop1Badge: "ΙΔΙΟΤΗΤΑ 1",
    prop1Title: "Αντιμεταθετική",
    prop1Desc: "Μπορούμε να αλλάξουμε τη σειρά των προσθετέων χωρίς να αλλάξει το άθροισμα:",
    prop2Badge: "ΙΔΙΟΤΗΤΑ 2",
    prop2Title: "Προσεταιριστική",
    prop2Desc: "Μπορούμε να ομαδοποιούμε τους προσθετέους με παρενθέσεις με όποιον τρόπο θέλουμε:",
    prop3Badge: "ΙΔΙΟΤΗΤΑ 3",
    prop3Title: "Ουδέτερο Στοιχείο (0)",
    prop3Desc: "Αν σε έναν ρητό προσθέσουμε το μηδέν, η τιμή του ρητού δεν αλλάζει:",
    prop4Badge: "ΙΔΙΟΤΗΤΑ 4",
    prop4Title: "Αντίθετοι Ρητοί",
    prop4Desc: "Το άθροισμα δύο αντίθετων ρητών αριθμών ισούται πάντοτε με το μηδέν:",

    // Ενότητα 3
    sec3Title: "Πρόσθεση Κλασμάτων (Ομώνυμα & Ετερώνυμα)",
    case1Badge: "ΠΕΡΙΠΤΩΣΗ 1: ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ",
    case1Desc: "Όταν τα κλάσματα έχουν τον ίδιο παρονομαστή, διατηρούμε τον κοινό παρονομαστή και προσθέτουμε τους αριθμητές (προσέχοντας τα πρόσημά τους):",
    case2Badge: "ΠΕΡΙΠΤΩΣΗ 2: ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ",
    case2Lead: "Όταν έχουν διαφορετικούς παρονομαστές, ακολουθούμε τα εξής βήματα:",
    case2Step1: "Βρίσκουμε το ΕΚΠ των παρονομαστών.",
    case2Step2: "Με πολλαπλασιασμό των όρων κάνουμε τα κλάσματα ομώνυμα.",
    case2Step3: "Προσθέτουμε τους νέους αριθμητές και, αν χρειάζεται, απλοποιούμε με διαίρεση σε ανάγωγο κλάσμα.",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστική Πρόσθεση Κλασμάτων με Αναλυτικά Βήματα",
    frac1Label: "1Ο ΚΛΑΣΜΑ",
    frac2Label: "2Ο ΚΛΑΣΜΑ",
    numA: "ΑΡΙΘΜΗΤΗΣ (α)",
    denB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
    numC: "ΑΡΙΘΜΗΤΗΣ (γ)",
    denD: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
    lab1AnalysisTitle: "ΑΝΑΛΥΣΗ ΠΡΟΣΘΕΣΗΣ",
    badgeLike: "ΟΜΩΝΥΜΑ",
    badgeUnlike: "ΕΤΕΡΩΝΥΜΑ • ΕΚΠ ＝",
    initialExpression: "Αρχική Πράξη:",
    step1Unlike: "Βήμα 1: Μετατροπή σε ομώνυμα με πολλαπλασιασμό των όρων (ΕΚΠ ＝",
    stepAddNumerators: "Βήμα 2: Πρόσθεση αριθμητών",
    sameSigns: "ομόσημοι",
    diffSigns: "ετερόσημοι",
    finalReducedResult: "ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:",
    afterDivisionBy: "μετά από διαίρεση με το",

    // Ενότητα 4
    sec4Title: "Πρόσθεση Δεκαδικών Αριθμών",
    sec4Lead: "Για να προσθέσουμε ρητούς αριθμούς σε δεκαδική μορφή:",
    sec4Rule1: "1. Κανόνας προσήμων: Ελέγχουμε αν είναι ομόσημοι (προσθέτουμε τις απόλυτες τιμές και κρατάμε το κοινό πρόσημο) ή ετερόσημοι (αφαιρούμε τις απόλυτες τιμές και βάζουμε το πρόσημο του μεγαλύτερου κατά απόλυτη τιμή).",
    sec4Rule2: "2. Στοίχιση υποδιαστολών: Στον κατακόρυφο υπολογισμό, οι υποδιαστολές τοποθετούνται ακριβώς η μία κάτω από την άλλη.",
    sec4ExamplesTitle: "ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ",
    sec4ExLike: "ομόσημοι",
    sec4ExUnlike: "ετερόσημοι",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Πρόσθεσης Δεκαδικών",
    dec1Label: "1ΟΣ ΔΕΚΑΔΙΚΟΣ",
    dec2Label: "2ΟΣ ΔΕΚΑΔΙΚΟΣ",
    intStepLabel: "ΑΚΕΡΑΙΟ (±1)",
    decStepLabel: "ΔΕΚΑΔΙΚΟ (±0,1)",
    lab2ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΠΡΟΣΘΕΣΗΣ ΔΕΚΑΔΙΚΩΝ",
    badgeSameSigns: "ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ",
    badgeDiffSigns: "ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ",
    decExplanationSame: "Οι αριθμοί είναι ομόσημοι: Προσθέσαμε τις απόλυτες τιμές και κρατήσαμε το κοινό τους πρόσημο.",
    decExplanationDiff: "Οι αριθμοί είναι ετερόσημοι: Αφαιρέσαμε τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη και επικράτησε το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή.",
  },
  en: {
    pageTitle: "Addition of Rational Numbers | Grade 7",
    pageDesc: "Addition of rational numbers (fractions and decimals), rules for like/unlike signs, properties of addition, and interactive labs.",
    backText: "Grade 7",
    btnExercises: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 14 • THEORY & LAB",
    mainTitle: "Addition of Rational Numbers & Properties",
    mainDesc: "Learn how to add rational numbers in fractional and decimal form (with like and unlike signs), along with key addition properties that simplify calculations.",

    // Section 1
    sec1Title: "Sign Rules (Like & Unlike Signed Rationals)",
    sec1SameSignBadge: "SAME SIGN",
    sec1SameSignTitle: "Adding Rationals with the Same Sign",
    sec1SameSignLead: "When adding two numbers with the same sign:",
    sec1SameSignRule1: "Add their absolute values.",
    sec1SameSignRule2: "Assign their common sign to the result.",
    sec1DiffSignBadge: "DIFFERENT SIGNS",
    sec1DiffSignTitle: "Adding Rationals with Different Signs",
    sec1DiffSignLead: "When adding two numbers with different signs:",
    sec1DiffSignRule1: "Subtract the smaller absolute value from the larger.",
    sec1DiffSignRule2: "Assign the sign of the number with the larger absolute value.",

    // Section 2
    sec2Title: "Properties of Addition for Rational Numbers",
    prop1Badge: "PROPERTY 1",
    prop1Title: "Commutative",
    prop1Desc: "The order of addends can be changed without altering the sum:",
    prop2Badge: "PROPERTY 2",
    prop2Title: "Associative",
    prop2Desc: "Addends can be grouped with parentheses in any order:",
    prop3Badge: "PROPERTY 3",
    prop3Title: "Additive Identity (0)",
    prop3Desc: "Adding zero to any rational number leaves its value unchanged:",
    prop4Badge: "PROPERTY 4",
    prop4Title: "Additive Inverses (Opposites)",
    prop4Desc: "The sum of any two opposite rational numbers is always zero:",

    // Section 3
    sec3Title: "Adding Fractions (Like & Unlike Denominators)",
    case1Badge: "CASE 1: LIKE FRACTIONS",
    case1Desc: "When fractions have the same denominator, keep the common denominator and add the numerators (paying attention to their signs):",
    case2Badge: "CASE 2: UNLIKE FRACTIONS",
    case2Lead: "When denominators differ, follow these steps:",
    case2Step1: "Find the LCM of the denominators.",
    case2Step2: "Multiply terms to convert them into like fractions.",
    case2Step3: "Add the new numerators and simplify by division into an irreducible fraction if needed.",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Fraction Addition with Step-by-Step Breakdown",
    frac1Label: "1ST FRACTION",
    frac2Label: "2ND FRACTION",
    numA: "NUMERATOR (a)",
    denB: "DENOMINATOR (b)",
    numC: "NUMERATOR (c)",
    denD: "DENOMINATOR (d)",
    lab1AnalysisTitle: "ADDITION ANALYSIS",
    badgeLike: "LIKE FRACTIONS",
    badgeUnlike: "UNLIKE FRACTIONS • LCM ＝",
    initialExpression: "Initial Operation:",
    step1Unlike: "Step 1: Convert to like fractions by multiplying terms (LCM ＝",
    stepAddNumerators: "Step 2: Add numerators",
    sameSigns: "same signs",
    diffSigns: "different signs",
    finalReducedResult: "FINAL IRREDUCIBLE RESULT:",
    afterDivisionBy: "after dividing by",

    // Section 4
    sec4Title: "Addition of Decimal Numbers",
    sec4Lead: "To add rational numbers in decimal form:",
    sec4Rule1: "1. Sign rule: Check if numbers have the same sign (add absolute values and keep common sign) or different signs (subtract absolute values and take the sign of the greater magnitude).",
    sec4Rule2: "2. Align decimal points: In vertical addition, decimal points must be aligned directly under each other.",
    sec4ExamplesTitle: "CALCULATION EXAMPLES",
    sec4ExLike: "same sign",
    sec4ExUnlike: "different signs",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Interactive Decimal Addition Calculator",
    dec1Label: "1ST DECIMAL",
    dec2Label: "2ND DECIMAL",
    intStepLabel: "INTEGER (±1)",
    decStepLabel: "DECIMAL (±0.1)",
    lab2ResultTitle: "DECIMAL ADDITION RESULT",
    badgeSameSigns: "SAME SIGNS",
    badgeDiffSigns: "DIFFERENT SIGNS",
    decExplanationSame: "The numbers have the same sign: Added their absolute values and preserved their common sign.",
    decExplanationDiff: "The numbers have different signs: Subtracted the smaller absolute value from the larger and kept the sign of the number with greater absolute value.",
  }
};

export default function ProsthesiKlasmataTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για Εργαστήριο 1: Πρόσθεση Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(5);
  const [f2Den, setF2Den] = useState(6);

  // State για Εργαστήριο 2: Πρόσθεση Δεκαδικών
  const [dec1, setDec1] = useState(-2.4);
  const [dec2, setDec2] = useState(5.7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Πρόσθεση Κλασμάτων)
  const isHomonymous = f1Den === f2Den;
  const commonDen = useMemo(() => lcm(f1Den, f2Den), [f1Den, f2Den]);
  const mult1 = useMemo(() => commonDen / f1Den, [commonDen, f1Den]);
  const mult2 = useMemo(() => commonDen / f2Den, [commonDen, f2Den]);

  const expandedNum1 = useMemo(() => f1Num * mult1, [f1Num, mult1]);
  const expandedNum2 = useMemo(() => f2Num * mult2, [f2Num, mult2]);

  const sumNumerator = useMemo(() => expandedNum1 + expandedNum2, [expandedNum1, expandedNum2]);
  const sumGcd = useMemo(() => gcd(sumNumerator, commonDen), [sumNumerator, commonDen]);

  const reducedNum = useMemo(() => sumNumerator / sumGcd, [sumNumerator, sumGcd]);
  const reducedDen = useMemo(() => commonDen / sumGcd, [commonDen, sumGcd]);

  const areOmmosite = (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0);
  const isOpposite = f1Num * f2Den + f2Num * f1Den === 0;

  // Υπολογισμοί Εργαστηρίου 2 (Πρόσθεση Δεκαδικών)
  const decSum = useMemo(() => parseFloat((dec1 + dec2).toFixed(2)), [dec1, dec2]);
  const decOmmosite = (dec1 > 0 && dec2 > 0) || (dec1 < 0 && dec2 < 0);

  const formatDec = (val, digits = 1) => {
    return val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/16-prosthesi-klasmata-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-14 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words">
              {t.mainDesc}
            </p>
          </div>
        </section>

        {/* 1. ΟΙ ΚΑΝΟΝΕΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΗΝ ΠΡΟΣΘΕΣΗ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομόσημοι Ρητοί */}
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                    {toCleanUppercase(t.sec1SameSignBadge)}
                  </span>
                  <span className="text-xl">➕➕ / ➖➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg break-words">{t.sec1SameSignTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {t.sec1SameSignLead}
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li className="break-words"><strong>{t.sec1SameSignRule1}</strong></li>
                  <li className="break-words"><strong>{t.sec1SameSignRule2}</strong></li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-indigo-100 flex-wrap gap-1">
                  <span>(＋{formatDec(0.4)}) ＋ (＋{formatDec(0.3)})</span>
                  <span className="font-bold text-emerald-700">＝ ＋{formatDec(0.7)}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-indigo-100 flex-wrap gap-1">
                  <span className="flex items-center gap-1">
                    (－<Frac num="1" den="5" />) ＋ (－<Frac num="2" den="5" />)
                  </span>
                  <span className="font-bold text-rose-700 flex items-center">
                    ＝ －<Frac num="3" den="5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Ετερόσημοι Ρητοί */}
            <div className="p-5 sm:p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                    {toCleanUppercase(t.sec1DiffSignBadge)}
                  </span>
                  <span className="text-xl">➕➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg break-words">{t.sec1DiffSignTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {t.sec1DiffSignLead}
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li className="break-words"><strong>{t.sec1DiffSignRule1}</strong></li>
                  <li className="break-words"><strong>{t.sec1DiffSignRule2}</strong></li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-sky-100 font-mono text-xs sm:text-sm text-sky-950">
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-sky-100 flex-wrap gap-1">
                  <span>(＋{formatDec(1.5)}) ＋ (－{formatDec(2.8)})</span>
                  <span className="font-bold text-rose-700">＝ －{formatDec(1.3)}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-sky-100 flex-wrap gap-1">
                  <span className="flex items-center gap-1">
                    (＋<Frac num="5" den="7" />) ＋ (－<Frac num="2" den="7" />)
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center">
                    ＝ ＋<Frac num="3" den="7" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΙΔΙΟΤΗΤΕΣ ΤΗΣ ΠΡΟΣΘΕΣΗΣ ΤΩΝ ΡΗΤΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1. Αντιμεταθετική */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.prop1Title}</h3>
                <p className="text-slate-600 leading-relaxed break-words">
                  {t.prop1Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  α ＋ β ＝ β ＋ α
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-[11px] text-center border border-indigo-100 break-words">
                (－2) ＋ 5 ＝ 5 ＋ (－2) ＝ 3
              </div>
            </div>

            {/* 2. Προσεταιριστική */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.prop2Title}</h3>
                <p className="text-slate-600 leading-relaxed break-words">
                  {t.prop2Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  (α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-[11px] text-center border border-indigo-100 break-words">
                [(-1)＋2]＋4 ＝ (-1)＋[2＋4] ＝ 5
              </div>
            </div>

            {/* 3. Ουδέτερο Στοιχείο το 0 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.prop3Title}</h3>
                <p className="text-slate-600 leading-relaxed break-words">
                  {t.prop3Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  α ＋ 0 ＝ 0 ＋ α ＝ α
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-[11px] text-center border border-indigo-100 flex items-center justify-center flex-wrap gap-1">
                <Frac num="-3" den="4" /> ＋ 0 ＝ <Frac num="-3" den="4" />
              </div>
            </div>

            {/* 4. Αντίθετοι Αριθμοί */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop4Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">{t.prop4Title}</h3>
                <p className="text-slate-600 leading-relaxed break-words">
                  {t.prop4Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  α ＋ (－α) ＝ 0
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-[11px] text-center border border-indigo-100 flex items-center justify-center flex-wrap gap-1">
                (<Frac num="5" den="8" />) ＋ (<Frac num="5" den="8" isNeg={true} />) ＝ 0
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΠΡΟΣΘΕΣΗ ΚΛΑΣΜΑΤΩΝ: ΟΜΩΝΥΜΑ ΚΑΙ ΕΤΕΡΩΝΥΜΑ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα Κλάσματα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                {toCleanUppercase(t.case1Badge)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                {t.case1Desc}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <Frac num="α" den="γ" />
                <span>＋</span>
                <Frac num="β" den="γ" />
                <span>＝</span>
                <Frac num="α ＋ β" den="γ" />
              </div>
            </div>

            {/* Ετερώνυμα Κλάσματα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                {toCleanUppercase(t.case2Badge)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                {t.case2Lead}
              </p>
              <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                <li className="break-words">{t.case2Step1}</li>
                <li className="break-words">{t.case2Step2}</li>
                <li className="break-words">{t.case2Step3}</li>
              </ol>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΠΡΟΣΘΕΣΗ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">
                    {toCleanUppercase(t.frac1Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numA)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Num > 0 ? `＋${f1Num}` : f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denB)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    {toCleanUppercase(t.frac2Label)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.numC)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.denD)}
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα & Τελικό Αποτέλεσμα */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1AnalysisTitle)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {isHomonymous ? t.badgeLike : `${t.badgeUnlike} ${commonDen}`}
                  </span>
                </div>

                {/* Αρχική Παράσταση */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">{t.initialExpression}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-amber-400">＋</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Ενδιάμεση Μορφή με Ομώνυμα */}
                {!isHomonymous && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                    <div className="text-slate-300 font-bold break-words">
                      {t.step1Unlike} {commonDen}):
                    </div>
                    <div className="font-mono text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
                      <span>＝</span>
                      <span>(</span>
                      <Frac num={expandedNum1} den={commonDen} className="text-indigo-200" />
                      <span>)</span>
                      <span className="text-amber-400">＋</span>
                      <span>(</span>
                      <Frac num={expandedNum2} den={commonDen} className="text-sky-200" />
                      <span>)</span>
                    </div>
                  </div>
                )}

                {/* Πρόσθεση Αριθμητών */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold break-words">
                    {isHomonymous ? 'Βήμα 1' : ''} {t.stepAddNumerators} ({areOmmosite ? t.sameSigns : t.diffSigns}):
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b border-white w-full text-center">
                          ({expandedNum1 > 0 ? `＋${expandedNum1}` : expandedNum1}) ＋ ({expandedNum2 > 0 ? `＋${expandedNum2}` : expandedNum2})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {commonDen}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={sumNumerator} den={commonDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    {toCleanUppercase(t.finalReducedResult)}
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2 flex-wrap">
                    {isOpposite ? (
                      <span>0</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {sumGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            ({t.afterDivisionBy} {sumGcd})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ ΑΡΙΘΜΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p className="break-words">
                {t.sec4Lead}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="break-words"><strong>{t.sec4Rule1}</strong></div>
                <div className="break-words"><strong>{t.sec4Rule2}</strong></div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                {toCleanUppercase(t.sec4ExamplesTitle)}
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                <div className="break-words">
                  (－{formatDec(3.4)}) ＋ (－{formatDec(1.8)}) ＝ －({formatDec(3.4)} ＋ {formatDec(1.8)}) ＝ <strong>－{formatDec(5.2)}</strong> ({t.sec4ExLike})
                </div>
                <div className="break-words">
                  (＋{formatDec(4.5)}) ＋ (－{formatDec(2.1)}) ＝ ＋({formatDec(4.5)} － {formatDec(2.1)}) ＝ <strong>＋{formatDec(2.4)}</strong> ({t.sec4ExUnlike})
                </div>
                <div className="break-words">
                  (－{formatDec(6.3)}) ＋ (＋{formatDec(2.8)}) ＝ －({formatDec(6.3)} － {formatDec(2.8)}) ＝ <strong>－{formatDec(3.5)}</strong> ({t.sec4ExUnlike})
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.dec1Label)}
                    </label>
                    <span className="text-sm sm:text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {toCleanUppercase(t.dec2Label)}
                    </label>
                    <span className="text-sm sm:text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.intStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {toCleanUppercase(t.decStepLabel)}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800 touch-manipulation"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab2ResultTitle)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {toCleanUppercase(decOmmosite ? t.badgeSameSigns : t.badgeDiffSigns)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-3xl lg:text-4xl font-black py-2 flex-wrap max-w-full">
                  <span>({dec1 > 0 ? `＋${formatDec(dec1)}` : formatDec(dec1)})</span>
                  <span className="text-amber-400 font-sans">＋</span>
                  <span>({dec2 > 0 ? `＋${formatDec(dec2)}` : formatDec(dec2)})</span>
                  <span className="text-indigo-400 font-sans">＝</span>
                  <span className="text-emerald-400">
                    {decSum > 0 ? `＋${formatDec(decSum, 2)}` : formatDec(decSum, 2)}
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words">
                  {decOmmosite ? t.decExplanationSame : t.decExplanationDiff}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}