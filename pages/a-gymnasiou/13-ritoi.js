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

// Βοηθητικός υπολογισμός ΜΚΔ / GCD (Ευκλείδης)
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

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή (mobile-safe & responsive)
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
    pageTitle: "Ρητοί Αριθμοί | Α' Γυμνασίου",
    pageDesc: "Έννοια ρητών αριθμών, μετατροπή δεκαδικών σε κλάσματα, κλασμάτων σε δεκαδικούς και τοποθέτηση στην αριθμογραμμή.",
    backText: "Α' Γυμνασίου",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 11 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Η Έννοια των Ρητών Αριθμών",
    mainDesc: "Γνωρίζουμε το σύνολο ℚ των ρητών αριθμών, τη σχέση τους με τα κλάσματα και τους δεκαδικούς, τις μετατροπές μεταξύ τους και την ακριβή τοποθέτησή τους στον άξονα των πραγματικών αριθμών.",
    
    // Ενότητα 1
    sec1Title: "Ορισμός Ρητού Αριθμού & Το Σύνολο ℚ",
    sec1DefLead: "Ρητός ονομάζεται κάθε αριθμός που μπορεί να γραφεί στη μορφή κλάσματος",
    sec1DefTail: ", όπου ο αριθμητής α είναι ακέραιος αριθμός (α ∈ ℤ) και ο παρονομαστής β είναι ακέραιος διάφορος του μηδενός (β ∈ ℤ*).",
    sec1SetNotationAnd: "και",
    sec1Bullet1: "Όλοι οι ακέραιοι είναι και ρητοί:",
    sec1Bullet2: "Όλοι οι δεκαδικοί είναι ρητοί:",
    sec1Bullet3: "Θέση προσήμου: Το πλην τοποθετείται συνήθως μπροστά από την κλασματική γραμμή:",
    sec1BoxTitle: "ΚΑΤΗΓΟΡΙΕΣ ΡΗΤΩΝ ΑΡΙΘΜΩΝ",
    sec1Pos: "Θετικοί Ρητοί",
    sec1Neg: "Αρνητικοί Ρητοί",
    sec1Ints: "Ακέραιοι Αριθμοί",
    sec1Periodic: "Περιοδικοί Δεκαδικοί",

    // Ενότητα 2
    sec2Title: "Μετατροπή Κλάσματος σε Δεκαδική Μορφή",
    sec2Lead: "Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό αριθμό, διαιρούμε τον αριθμητή α με τον παρονομαστή β (α : β).",
    sec2ResultsTitle: "ΔΥΟ ΠΙΘΑΝΑ ΑΠΟΤΕΛΕΣΜΑΤΑ",
    sec2Res1: "1. Πεπερασμένος Δεκαδικός:",
    sec2Res1Sub: "(υπόλοιπο 0)",
    sec2Res2: "2. Περιοδικός Δεκαδικός:",
    sec2Res2Sub: "(επαναλαμβανόμενα ψηφία)",
    sec2SecretBadge: "ΧΡΗΣΙΜΟ ΜΥΣΤΙΚΟ",
    sec2SecretTitle: "Πότε ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό;",
    sec2SecretDesc: "Αν απλοποιήσουμε το κλάσμα ώστε να είναι ανάγωγο, δίνει πεπερασμένο δεκαδικό μόνο αν ο παρονομαστής περιέχει ως πρώτους παράγοντες μόνο το 2 ή/και το 5.",
    sec2Terminating: "Πεπερασμένος",
    sec2PeriodicWord: "Περιοδικός",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστική Μετατροπή Κλάσματος σε Δεκαδικό",
    lab1NumLabel: "Αριθμητής (α)",
    lab1DenLabel: "Παρονομαστής (β ≠ 0)",
    lab1ResultTitle: "ΚΛΑΣΜΑΤΙΚΗ ΚΑΙ ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ",
    badgeInteger: "ΑΚΕΡΑΙΟΣ",
    badgeTerminating: "ΠΕΠΕΡΑΣΜΕΝΟΣ",
    badgePeriodic: "ΠΕΡΙΟΔΙΚΟΣ",
    lab1ExpLead: "Εκτελέσαμε τη διαίρεση",
    lab1ExpNeg: "Το αρνητικό πρόσημο τοποθετείται μπροστά από την κλασματική γραμμή.",
    lab1ExpSimp: "Το κλάσμα απλοποιήθηκε με τον Μ.Κ.Δ.",
    lab1ExpSimpEnd: "σε ανάγωγο.",

    // Ενότητα 3
    sec3Title: "Μετατροπή Δεκαδικού σε Κλασματική Μορφή",
    sec3Lead: "Για να μετατρέψουμε έναν πεπερασμένο δεκαδικό αριθμό σε κλάσμα:",
    sec3Step1: "1. Αριθμητής: Γράφουμε όλον τον αριθμό χωρίς την υποδιαστολή.",
    sec3Step2: "2. Παρονομαστής: Γράφουμε το 1 ακολουθούμενο από τόσα μηδενικά όσα είναι τα δεκαδικά ψηφία (10, 100, 1.000...).",
    sec3Step3: "3. Πρόσημο: Το πρόσημο μείον τοποθετείται μπροστά από την κλασματική γραμμή.",
    sec3Step4: "4. Απλοποίηση: Διαιρούμε αριθμητή και παρονομαστή με τον Μ.Κ.Δ. τους για ανάγωγο κλάσμα.",
    sec3ExTitle: "ΠΑΡΑΔΕΙΓΜΑ ΑΝΑΛΥΣΗΣ",
    sec3ExDec: "Δεκαδικός:",
    sec3ExDigits: "δεκαδικά ψηφία",
    sec3ExFrac: "Δεκαδικό κλάσμα:",
    sec3ExSimp: "Απλοποίηση με το 5:",
    sec3ExIrred: "(ανάγωγο)",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Πληκτρολόγηση Δεκαδικού & Μετατροπή σε Ανάγωγο Κλάσμα",
    lab2InputLabel: "Πληκτρολόγησε Δεκαδικό Αριθμό",
    lab2ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ & ΑΠΛΟΠΟΙΗΣΗΣ",
    lab2DecCount: "Ο αριθμός έχει",
    lab2DecCountTail: "δεκαδικά ψηφία, άρα γράφτηκε με παρονομαστή το",
    lab2NegMsg: "Το πλην τοποθετείται μπροστά από την κλασματική γραμμή.",
    lab2SimpMsg: "Απλοποιήθηκε δια του Μ.Κ.Δ.",
    lab2SimpMsgTail: "και έγινε ανάγωγο κλάσμα.",
    lab2AlreadyIrred: "Το κλάσμα ήταν ήδη ανάγωγο.",
    lab2Invalid: "⚠️ Παρακαλώ πληκτρολόγησε έναν έγκυρο δεκαδικό αριθμό (π.χ. -0,75 ή 3,2).",

    // Ενότητα 4
    sec4Title: "Τοποθέτηση Ρητών Αριθμών στην Αριθμογραμμή",
    sec4Lead: "Για να παραστήσουμε έναν ρητό αριθμό πάνω στην αριθμογραμμή:",
    sec4Step1: "1. Επιλογή κατεύθυνσης: Αν ο ρητός είναι θετικός κινούμαστε δεξιά από το 0, ενώ αν είναι αρνητικός κινούμαστε αριστερά από το 0.",
    sec4Step2: "2. Διαίρεση μονάδων (Παρονομαστής β): Χωρίζουμε κάθε ακέραια μονάδα σε β ίσα μέρη (υποδιαστήματα).",
    sec4Step3: "3. Μέτρηση βημάτων (Αριθμητής α): Ξεκινώντας από το 0, μετράμε |α| τέτοια υποδιαστήματα προς τη σωστή κατεύθυνση.",
    sec4ExBadge: "ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ ΠΑΡΑΔΕΙΓΜΑ",
    sec4ExTitle: "Πού βρίσκεται ο αριθμός",
    sec4ExDesc: "Επειδή το κλάσμα είναι αρνητικό, πάμε αριστερά από το 0. Χωρίζουμε κάθε μονάδα σε 3 ίσα μέρη. Μετράμε 5 υποδιαστήματα αριστερά.",
    sec4ExLoc: "βρίσκεται ανάμεσα στο －1 και το －2",

    // Εργαστήριο 3
    lab3Title: "🛠️ Εργαστήριο 3: Διαδραστικός Αυτοπροσαρμοζόμενος Άξονας Ρητών",
    lab3Point: "ΣΗΜΕΙΟ:",
    lab3DecValAndInterval: "ΔΕΚΑΔΙΚΗ ΤΙΜΗ & ΔΙΑΣΤΗΜΑ",
    lab3ScaleExp1: "Ο άξονας προσαρμόστηκε αυτόματα στο διάστημα",
    lab3ScaleExp2: "Κάθε μονάδα χωρίζεται σε",
    lab3ScaleExp3: "ίσα μέρη και το σημείο",
    lab3ScaleExp4: "απέχει",
    lab3ScaleExp5: "υποδιαιρέσεις",
    lab3Left: "αριστερά",
    lab3Right: "δεξιά",
    lab3FromZero: "από το 0.",
  },
  en: {
    pageTitle: "Rational Numbers | Grade 7",
    pageDesc: "Concept of rational numbers, decimal to fraction conversions, fraction to decimal conversions, and number line plotting.",
    backText: "Grade 7",
    btnExercises: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 11 • THEORY & LAB",
    mainTitle: "The Concept of Rational Numbers",
    mainDesc: "Learn about the set ℚ of rational numbers, their relation to fractions and decimals, reciprocal conversions, and exact representation on the real number line.",
    
    // Section 1
    sec1Title: "Definition of Rational Number & The Set ℚ",
    sec1DefLead: "A rational number is any number that can be expressed as a fraction",
    sec1DefTail: ", where the numerator a is an integer (a ∈ ℤ) and the denominator b is a non-zero integer (b ∈ ℤ*).",
    sec1SetNotationAnd: "and",
    sec1Bullet1: "All integers are rational numbers:",
    sec1Bullet2: "All terminating decimals are rational numbers:",
    sec1Bullet3: "Sign placement: The minus sign is conventionally placed before the fraction bar:",
    sec1BoxTitle: "CATEGORIES OF RATIONAL NUMBERS",
    sec1Pos: "Positive Rationals",
    sec1Neg: "Negative Rationals",
    sec1Ints: "Integers",
    sec1Periodic: "Repeating Decimals",

    // Section 2
    sec2Title: "Converting Fractions to Decimal Form",
    sec2Lead: "To convert a fraction to a decimal number, divide the numerator a by the denominator b (a : b).",
    sec2ResultsTitle: "TWO POSSIBLE OUTCOMES",
    sec2Res1: "1. Terminating Decimal:",
    sec2Res1Sub: "(remainder 0)",
    sec2Res2: "2. Repeating / Periodic Decimal:",
    sec2Res2Sub: "(repeating digits)",
    sec2SecretBadge: "USEFUL INSIGHT",
    sec2SecretTitle: "When does an irreducible fraction yield a terminating decimal?",
    sec2SecretDesc: "If simplified to its irreducible form, a fraction yields a terminating decimal if and only if its denominator's prime factorization contains only 2 and/or 5.",
    sec2Terminating: "Terminating",
    sec2PeriodicWord: "Periodic",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Fraction to Decimal Converter",
    lab1NumLabel: "Numerator (a)",
    lab1DenLabel: "Denominator (b ≠ 0)",
    lab1ResultTitle: "FRACTIONAL AND DECIMAL FORM",
    badgeInteger: "INTEGER",
    badgeTerminating: "TERMINATING",
    badgePeriodic: "PERIODIC",
    lab1ExpLead: "Computed the division",
    lab1ExpNeg: "The minus sign is placed in front of the fraction bar.",
    lab1ExpSimp: "The fraction was simplified with GCD",
    lab1ExpSimpEnd: "to its irreducible form.",

    // Section 3
    sec3Title: "Converting Decimals to Fraction Form",
    sec3Lead: "To convert a terminating decimal number into a fraction:",
    sec3Step1: "1. Numerator: Write the entire number without the decimal point.",
    sec3Step2: "2. Denominator: Write 1 followed by as many zeros as there are decimal places (10, 100, 1,000...).",
    sec3Step3: "3. Sign: Place the negative sign in front of the fraction bar.",
    sec3Step4: "4. Simplification: Divide both numerator and denominator by their GCD to get an irreducible fraction.",
    sec3ExTitle: "WORKED EXAMPLE",
    sec3ExDec: "Decimal:",
    sec3ExDigits: "decimal digits",
    sec3ExFrac: "Decimal fraction:",
    sec3ExSimp: "Simplify by 5:",
    sec3ExIrred: "(irreducible)",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Enter Decimal & Convert to Irreducible Fraction",
    lab2InputLabel: "Type a Decimal Number",
    lab2ResultTitle: "CONVERSION & SIMPLIFICATION RESULT",
    lab2DecCount: "The number has",
    lab2DecCountTail: "decimal digits, so it is written with denominator",
    lab2NegMsg: "The minus sign is placed in front of the fraction bar.",
    lab2SimpMsg: "Simplified by GCD",
    lab2SimpMsgTail: "into an irreducible fraction.",
    lab2AlreadyIrred: "The fraction was already irreducible.",
    lab2Invalid: "⚠️ Please enter a valid decimal number (e.g. -0.75 or 3.2).",

    // Section 4
    sec4Title: "Plotting Rational Numbers on the Number Line",
    sec4Lead: "To represent a rational number on the number line:",
    sec4Step1: "1. Direction: If positive move to the right of 0; if negative move to the left of 0.",
    sec4Step2: "2. Unit division (Denominator b): Divide each unit interval into b equal parts.",
    sec4Step3: "3. Step counting (Numerator a): Starting from 0, count |a| subdivisions in the chosen direction.",
    sec4ExBadge: "TYPICAL EXAMPLE",
    sec4ExTitle: "Where is the number",
    sec4ExDesc: "Since the fraction is negative, move left from 0. Divide each unit interval into 3 equal parts. Count 5 sub-steps left.",
    sec4ExLoc: "lies between －1 and －2",

    // Lab 3
    lab3Title: "🛠️ Lab 3: Interactive Auto-Scaling Number Line",
    lab3Point: "POINT:",
    lab3DecValAndInterval: "DECIMAL VALUE & INTERVAL",
    lab3ScaleExp1: "The number line automatically scaled to the interval",
    lab3ScaleExp2: "Each unit is divided into",
    lab3ScaleExp3: "equal parts, and point",
    lab3ScaleExp4: "is located",
    lab3ScaleExp5: "subdivisions",
    lab3Left: "left",
    lab3Right: "right",
    lab3FromZero: "from 0.",
  }
};

export default function RitoiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για Εργαστήριο 1: Κλάσμα -> Δεκαδικός
  const [numA, setNumA] = useState(-3);
  const [denB, setDenB] = useState(4);

  // State για Εργαστήριο 2: Δεκαδικός -> Κλάσμα
  const [decInput, setDecInput] = useState(locale === 'el' ? '-0,75' : '-0.75');

  // State για Εργαστήριο 3: Δυναμικός Άξονας
  const [axisNum, setAxisNum] = useState(-7);
  const [axisDen, setAxisDen] = useState(4);

  // Steppers γενικής χρήσης με πρόληψη propagation
  const handleStep = (setter, delta, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + delta)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Κλάσμα -> Δεκαδικός)
  const fracAnalysis = useMemo(() => {
    const g = gcd(numA, denB);
    const simpNum = numA / g;
    const simpDen = denB / g;
    const val = numA / denB;

    const isInt = Number.isInteger(val);

    let tempDen = Math.abs(simpDen);
    while (tempDen % 2 === 0) tempDen /= 2;
    while (tempDen % 5 === 0) tempDen /= 5;
    const isTerminating = tempDen === 1;

    let displayDec = '';
    if (isInt) {
      displayDec = val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    } else if (isTerminating) {
      displayDec = val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
        maximumFractionDigits: 6,
      });
    } else {
      const fixedStr = val.toFixed(4);
      displayDec = (locale === 'el' ? fixedStr.replace('.', ',') : fixedStr) + '...';
    }

    return {
      val,
      simpNum,
      simpDen,
      gcdVal: g,
      isInt,
      isTerminating,
      displayDec,
    };
  }, [numA, denB, locale]);

  // Handler εισαγωγής για Εργαστήριο 2 (Δεκαδικός -> Κλάσμα)
  const handleDecChange = (e) => {
    let clean = e.target.value.replace(/[^0-9,.-]/g, '');
    if (clean.length > 10) clean = clean.slice(0, 10);
    setDecInput(clean);
  };

  // Υπολογισμοί Εργαστηρίου 2 (Δεκαδικός -> Κλάσμα)
  const decAnalysis = useMemo(() => {
    const clean = decInput.trim().replace(',', '.');
    const parsed = parseFloat(clean);

    if (isNaN(parsed) || !isFinite(parsed)) {
      return { isValid: false };
    }

    const isNeg = parsed < 0;
    const absVal = Math.abs(parsed);
    const parts = absVal.toString().split('.');
    const decimals = parts[1] ? parts[1].length : 0;

    const denominator = Math.pow(10, decimals);
    const numerator = Math.round(absVal * denominator);
    const signedNumerator = isNeg ? -numerator : numerator;

    const g = gcd(signedNumerator, denominator);
    const redNum = signedNumerator / g;
    const redDen = denominator / g;

    return {
      isValid: true,
      rawNum: signedNumerator,
      rawDen: denominator,
      redNum,
      redDen,
      gcdVal: g,
      decimals,
    };
  }, [decInput]);

  // Υπολογισμοί Εργαστηρίου 3 (Δυναμικός Άξονας με Auto-Scale)
  const axisVal = useMemo(() => axisNum / axisDen, [axisNum, axisDen]);
  const axisFloor = useMemo(() => Math.floor(axisVal), [axisVal]);
  const axisCeil = useMemo(() => Math.ceil(axisVal), [axisVal]);

  const axisRange = useMemo(() => {
    const absVal = Math.abs(axisVal);
    const bound = Math.max(3, Math.ceil(absVal) + 1);
    
    let step = 1;
    if (bound > 8) step = 2;
    if (bound > 16) step = 5;

    const ticks = [];
    for (let i = -bound; i <= bound; i += step) {
      ticks.push(i);
    }
    if (!ticks.includes(0)) ticks.push(0);
    ticks.sort((a, b) => a - b);

    return {
      bound,
      step,
      ticks,
    };
  }, [axisVal]);

  const scaleX = (val) => {
    const usableWidth = 330;
    return (val / axisRange.bound) * usableWidth;
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
          href="/a-gymnasiou/13-ritoi-ask"
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

        {/* 1. ΟΡΙΣΜΟΣ ΡΗΤΟΥ ΑΡΙΘΜΟΥ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words">
                <strong>{locale === 'el' ? 'Ρητός' : 'Rational'}</strong> {t.sec1DefLead}{' '}
                <Frac num="α" den="β" className="text-indigo-950 font-bold" />
                {t.sec1DefTail}
              </p>
              
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-xl font-mono shadow-sm flex flex-wrap items-center justify-center gap-2 max-w-full overflow-hidden">
                <span>ℚ ＝ {'{'}</span>
                <Frac num="α" den="β" />
                <span>| α ∈ ℤ {t.sec1SetNotationAnd} β ∈ ℤ* {'}'}</span>
              </div>

              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="break-words">
                  <strong>{t.sec1Bullet1}</strong>{' '}
                  <span className="inline-flex flex-wrap items-center gap-1">
                    5 ＝ <Frac num="5" den="1" />, －4 ＝ <Frac num="-4" den="1" />, 0 ＝ <Frac num="0" den="1" />.
                  </span>
                </li>
                <li className="break-words">
                  <strong>{t.sec1Bullet2}</strong>{' '}
                  <span className="inline-flex flex-wrap items-center gap-1">
                    {locale === 'el' ? '0,75' : '0.75'} ＝ <Frac num="75" den="100" /> ＝ <Frac num="3" den="4" />.
                  </span>
                </li>
                <li className="break-words">
                  <strong>{t.sec1Bullet3}</strong>{' '}
                  <Frac num="α" den="β" isNeg={true} />.
                </li>
              </ul>
            </div>

            {/* Σχηματική Επισκόπηση */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.sec1BoxTitle)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-indigo-900 font-sans font-bold text-xs">{t.sec1Pos}</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="3" den="4" />, ＋{locale === 'el' ? '2,5' : '2.5'}, ＋7
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-rose-900 font-sans font-bold text-xs">{t.sec1Neg}</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="-5" den="2" />, －{locale === 'el' ? '1,4' : '1.4'}, －9
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-slate-900 font-sans font-bold text-xs">{t.sec1Ints}</div>
                  <div>... －2, －1, 0, 1, 2 ...</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-sky-900 font-sans font-bold text-xs">{t.sec1Periodic}</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="1" den="3" /> ＝ {locale === 'el' ? '0,333...' : '0.333...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΔΕΚΑΔΙΚΟ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p className="break-words">
                {t.sec2Lead}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                  {toCleanUppercase(t.sec2ResultsTitle)}
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div><strong>{t.sec2Res1}</strong> {t.sec2Res1Sub}</div>
                    <div className="font-mono text-indigo-900 flex items-center flex-wrap gap-1">
                      <Frac num="3" den="4" /> ＝ 3 : 4 ＝ {locale === 'el' ? '0,75' : '0.75'}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div><strong>{t.sec2Res2}</strong> {t.sec2Res2Sub}</div>
                    <div className="font-mono text-indigo-900 flex items-center flex-wrap gap-1">
                      <Frac num="1" den="3" /> ＝ 1 : 3 ＝ {locale === 'el' ? '0,333...' : '0.333...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Κανόνας Παρονομαστή */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                  {toCleanUppercase(t.sec2SecretBadge)}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
                  {t.sec2SecretTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed break-words">
                  {t.sec2SecretDesc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                <div className="flex items-center flex-wrap gap-1">
                  • <Frac num="7" den="20" /> → 20 ＝ 2<sup>2</sup> · 5 → {t.sec2Terminating} ({locale === 'el' ? '0,35' : '0.35'})
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  • <Frac num="5" den="6" /> → 6 ＝ 2 · 3 → {t.sec2PeriodicWord} ({locale === 'el' ? '0,8333...' : '0.8333...'})
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {toCleanUppercase(t.lab1NumLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setNumA, -1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono">
                      α ＝ {numA > 0 ? `＋${numA}` : numA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setNumA, 1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {toCleanUppercase(t.lab1DenLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDenB, -1, 1, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono">
                      β ＝ {denB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDenB, 1, 1, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1ResultTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    fracAnalysis.isInt
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                      : fracAnalysis.isTerminating
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {toCleanUppercase(
                      fracAnalysis.isInt 
                        ? t.badgeInteger 
                        : fracAnalysis.isTerminating 
                        ? t.badgeTerminating 
                        : t.badgePeriodic
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-black flex-wrap max-w-full">
                  <Frac num={numA} den={denB} className="text-white" />

                  {fracAnalysis.gcdVal > 1 && (
                    <>
                      <span className="text-indigo-300">＝</span>
                      <Frac num={fracAnalysis.simpNum} den={fracAnalysis.simpDen} className="text-slate-300 text-lg sm:text-2xl" />
                    </>
                  )}

                  <span className="text-indigo-300">＝</span>
                  <span className="text-emerald-400 break-all">{fracAnalysis.displayDec}</span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 font-sans leading-relaxed break-words">
                  {t.lab1ExpLead} {Math.abs(numA)} : {denB}.
                  {numA < 0 && ` ${t.lab1ExpNeg}`}
                  {fracAnalysis.gcdVal > 1 && ` ${t.lab1ExpSimp} (${fracAnalysis.gcdVal}) ${t.lab1ExpSimpEnd}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΜΕΤΑΤΡΟΠΗ ΔΕΚΑΔΙΚΟΥ ΣΕ ΚΛΑΣΜΑ */}
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
            <div className="space-y-3">
              <p className="break-words">
                {t.sec3Lead}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="break-words"><strong>{t.sec3Step1}</strong></div>
                <div className="break-words"><strong>{t.sec3Step2}</strong></div>
                <div className="break-words"><strong>{t.sec3Step3}</strong></div>
                <div className="break-words"><strong>{t.sec3Step4}</strong></div>
              </div>
            </div>

            {/* Παράδειγμα Ανάλυσης */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 font-sans">
                {toCleanUppercase(t.sec3ExTitle)}
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="break-words">
                  {t.sec3ExDec} <strong>－{locale === 'el' ? '0,85' : '0.85'}</strong> (2 {t.sec3ExDigits})
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  {t.sec3ExFrac} －<Frac num="85" den="100" />
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  {t.sec3ExSimp} －<Frac num="17" den="20" /> {t.sec3ExIrred}
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Input */}
              <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  {toCleanUppercase(t.lab2InputLabel)}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={decInput}
                  onChange={handleDecChange}
                  placeholder={locale === 'el' ? "π.χ. -0,75 ή 2,4" : "e.g. -0.75 or 2.4"}
                  className="w-full h-11 px-4 text-base sm:text-lg font-mono font-black text-center bg-white border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['-1,5', '-0,25', '0,4', '0,125', '2,8', '-0,6'].map((preset) => {
                    const localizedPreset = locale === 'el' ? preset : preset.replace(',', '.');
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDecInput(localizedPreset)}
                        className="py-1 px-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-indigo-50 transition text-center truncate"
                      >
                        {localizedPreset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ανάλυση σε Κλάσμα */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 font-mono shadow-md">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.lab2ResultTitle)}
                </div>

                {decAnalysis.isValid ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-black flex-wrap max-w-full">
                      <span className="break-all">{decInput}</span>
                      <span className="text-indigo-400">＝</span>

                      <Frac num={decAnalysis.rawNum} den={decAnalysis.rawDen} className="text-slate-300 text-lg sm:text-2xl" />

                      {decAnalysis.gcdVal > 1 && (
                        <>
                          <span className="text-indigo-400">＝</span>
                          <Frac num={decAnalysis.redNum} den={decAnalysis.redDen} className="text-emerald-400 text-xl sm:text-3xl lg:text-4xl" />
                        </>
                      )}
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words">
                      {t.lab2DecCount} {decAnalysis.decimals} {t.lab2DecCountTail} {decAnalysis.rawDen.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US')}.
                      {decAnalysis.rawNum < 0 && ` ${t.lab2NegMsg}`}
                      {decAnalysis.gcdVal > 1
                        ? ` ${t.lab2SimpMsg} (${decAnalysis.gcdVal}) ${t.lab2SimpMsgTail}`
                        : ` ${t.lab2AlreadyIrred}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-400 text-xs sm:text-sm font-sans break-words">
                    {t.lab2Invalid}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΤΟΠΟΘΕΤΗΣΗ ΡΗΤΩΝ ΣΤΗΝ ΑΡΙΘΜΟΓΡΑΜΜΗ & ΕΡΓΑΣΤΗΡΙΟ 3 */}
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                <div className="break-words"><strong>{t.sec4Step1}</strong></div>
                <div className="break-words"><strong>{t.sec4Step2}</strong></div>
                <div className="break-words"><strong>{t.sec4Step3}</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                  {toCleanUppercase(t.sec4ExBadge)}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center flex-wrap gap-1 break-words">
                  <span>{t.sec4ExTitle}</span>
                  －<Frac num="5" den="3" />
                  <span>;</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed break-words">
                  {t.sec4ExDesc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 flex items-center flex-wrap gap-1">
                －<Frac num="5" den="3" /> ＝ －1 <Frac num="2" den="3" /> ≈ {locale === 'el' ? '－1,67' : '－1.67'} ({t.sec4ExLoc})
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab3Title}
            </h3>

            {/* Χειριστήρια Steppers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {toCleanUppercase(t.lab1NumLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setAxisNum, -1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-base touch-manipulation"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-black font-mono text-indigo-950 text-sm sm:text-base">
                    α ＝ {axisNum > 0 ? `＋${axisNum}` : axisNum}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setAxisNum, 1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-base touch-manipulation"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {toCleanUppercase(t.sec4Step2.includes('b') ? 'Denominator (b)' : 'Παρονομαστής (β)')}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setAxisDen, -1, 1, 12, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-base touch-manipulation"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-black font-mono text-sky-950 text-sm sm:text-base">
                    β ＝ {axisDen}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setAxisDen, 1, 1, 12, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-base touch-manipulation"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πληροφορίες Θέσης */}
              <div className="sm:col-span-2 p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase font-bold text-slate-500">{toCleanUppercase(t.lab3Point)}</span>
                  <div className="text-sm sm:text-base font-black font-mono text-indigo-950 flex items-center">
                    <span>{locale === 'el' ? 'Μ' : 'M'}(</span>
                    <Frac num={axisNum} den={axisDen} />
                    <span>)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{toCleanUppercase(t.lab3DecValAndInterval)}</div>
                  <div className="font-bold text-slate-800 font-mono text-xs sm:text-sm">
                    ≈ {axisVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ∈ [{axisFloor}, {axisFloor === axisCeil ? axisFloor : axisCeil}]
                  </div>
                </div>
              </div>
            </div>

            {/* Οπτική Αριθμογραμμή SVG */}
            <div className="p-3 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md max-w-full overflow-hidden">
              <div className="w-full overflow-hidden">
                <svg
                  viewBox="-360 -55 720 110"
                  className="w-full h-auto select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Κύρια γραμμή άξονα */}
                  <line x1="-350" y1="0" x2="350" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                  {/* Βελάκια άκρων */}
                  <polygon points="355,0 345,-5 345,5" fill="#94a3b8" />
                  <polygon points="-355,0 -345,-5 -345,5" fill="#94a3b8" />

                  {/* Υποδιαιρέσεις ανά ακέραια μονάδα */}
                  {axisRange.ticks.map((u) => {
                    const x = scaleX(u);
                    const isZero = u === 0;
                    return (
                      <g key={u}>
                        <line
                          x1={x}
                          y1={isZero ? '-15' : '-11'}
                          x2={x}
                          y2={isZero ? '15' : '11'}
                          stroke={isZero ? '#38bdf8' : '#e2e8f0'}
                          strokeWidth={isZero ? '3' : '1.8'}
                        />
                        <text
                          x={x}
                          y="27"
                          fill={isZero ? '#38bdf8' : '#cbd5e1'}
                          fontSize={axisRange.bound > 12 ? '11' : '12'}
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {u}
                        </text>

                        {/* Μικρές ενδιάμεσες υποδιαιρέσεις */}
                        {axisDen > 1 && axisRange.bound <= 10 && u < axisRange.bound && Array.from({ length: axisDen - 1 }).map((_, stepIdx) => {
                          const subVal = u + (stepIdx + 1) / axisDen;
                          const subX = scaleX(subVal);
                          return (
                            <line
                              key={stepIdx}
                              x1={subX}
                              y1="-5"
                              x2={subX}
                              y2="5"
                              stroke="#64748b"
                              strokeWidth="1"
                            />
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* Σημείο Μ/M */}
                  <g transform={`translate(${scaleX(axisVal)}, 0)`}>
                    <line x1="0" y1="-32" x2="0" y2="0" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <rect x="-18" y="-48" width="36" height="18" rx="5" fill="#f59e0b" />
                    <text x="0" y="-35" fill="#0f172a" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {locale === 'el' ? 'Μ' : 'M'}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Επεξήγηση συμπεριφοράς */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 flex items-center justify-between flex-wrap gap-2 font-sans leading-relaxed break-words">
                <span>
                  {t.lab3ScaleExp1} <strong>[-{axisRange.bound}, ＋{axisRange.bound}]</strong>. {t.lab3ScaleExp2} <strong>{axisDen} {t.lab3ScaleExp3}</strong> <strong>{locale === 'el' ? 'Μ' : 'M'}</strong> {t.lab3ScaleExp4} <strong>{Math.abs(axisNum)} {t.lab3ScaleExp5}</strong> {axisNum < 0 ? t.lab3Left : t.lab3Right} {t.lab3FromZero}
                </span>
                <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm flex items-center shrink-0">
                  {locale === 'el' ? 'Μ' : 'M'}(<Frac num={axisNum} den={axisDen} />)
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}