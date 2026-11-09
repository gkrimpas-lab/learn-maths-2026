import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const MAX_ALLOWED_NUMBER = 1000;

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function formatNumber(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

const PRESETS_2 = [
  { n1: 12, n2: 18, labelEl: 'Ε.Κ.Π.(12, 18)', labelEn: 'LCM(12, 18)' },
  { n1: 24, n2: 36, labelEl: 'Ε.Κ.Π.(24, 36)', labelEn: 'LCM(24, 36)' },
  { n1: 20, n2: 50, labelEl: 'Ε.Κ.Π.(20, 50)', labelEn: 'LCM(20, 50)' },
  { n1: 45, n2: 60, labelEl: 'Ε.Κ.Π.(45, 60)', labelEn: 'LCM(45, 60)' }
];

const PRESETS_3 = [
  { n1: 8, n2: 12, n3: 15, labelEl: 'Ε.Κ.Π.(8, 12, 15)', labelEn: 'LCM(8, 12, 15)' },
  { n1: 10, n2: 15, n3: 20, labelEl: 'Ε.Κ.Π.(10, 15, 20)', labelEn: 'LCM(10, 15, 20)' },
  { n1: 12, n2: 18, n3: 24, labelEl: 'Ε.Κ.Π.(12, 18, 24)', labelEn: 'LCM(12, 18, 24)' },
  { n1: 6, n2: 20, n3: 45, labelEl: 'Ε.Κ.Π.(6, 20, 45)', labelEn: 'LCM(6, 20, 45)' }
];

const EXPONENTS_UNICODE = {
  1: '',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹'
};

function factorize(num) {
  const parsed = Number(num);
  if (!parsed || isNaN(parsed) || parsed < 2) {
    return {
      steps: [{ current: parsed || 1, divisor: null }],
      factors: {},
      expr: `${parsed || 1}`
    };
  }

  let temp = parsed;
  const steps = [];
  const factors = {};
  let d = 2;

  while (temp > 1) {
    if (temp % d === 0) {
      steps.push({ current: temp, divisor: d });
      factors[d] = (factors[d] || 0) + 1;
      temp = Math.floor(temp / d);
    } else {
      d++;
      if (d * d > temp) {
        if (temp > 1) {
          steps.push({ current: temp, divisor: temp });
          factors[temp] = (factors[temp] || 0) + 1;
          temp = 1;
        }
        break;
      }
    }
    if (d > 1000) break;
  }
  steps.push({ current: 1, divisor: null });

  const parts = Object.keys(factors)
    .map(Number)
    .sort((a, b) => a - b)
    .map((f) => {
      const exp = factors[f];
      return exp > 1 ? `${f}${EXPONENTS_UNICODE[exp] || `^${exp}`}` : `${f}`;
    });

  const expr = parts.length > 0 ? parts.join(' · ') : `${parsed}`;

  return { steps, factors, expr };
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Ε.Κ.Π. με Ανάλυση σε Πρώτους Παράγοντες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Υπολόγισε ταχύτατα το Ελάχιστο Κοινό Πολλαπλάσιο μεγάλων αριθμών εφαρμόζοντας τον κανόνα των κοινών και μη κοινών πρώτων παραγόντων με τον μεγαλύτερο εκθέτη για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 20 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ε.Κ.Π. με Ανάλυση σε Πρώτους Παράγοντες",
    heroDesc: "Υπολόγισε ταχύτατα το Ελάχιστο Κοινό Πολλαπλάσιο μεγάλων αριθμών εφαρμόζοντας τον χρυσό κανόνα: Κοινοί και μη κοινοί πρώτοι παράγοντες με τον μεγαλύτερο εκθέτη!",
    heroPills: "Κατακόρυφη Ανάλυση & Αυτόματη Επιλογή Μέγιστων Εκθετών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Κανόνας Υπολογισμού Ε.Κ.Π.",
    theorySubtitle: "Η μέθοδος των πρώτων παραγόντων σε τρία απλά και ξεκάθαρα βήματα.",
    cards: [
      {
        badge: "ΒΗΜΑ 1",
        sub: "Κατακόρυφη Γραμμή",
        title: "Παραγοντοποίηση",
        body: "Αναλύουμε κάθε αριθμό χωριστά σε γινόμενο πρώτων παραγόντων και γράφουμε τις επαναλήψεις με εκθέτες (δυνάμεις).",
        example: "12 ＝ 2² · 3\n18 ＝ 2 · 3²",
        tip: "💡 Διαιρούμε διαδοχικά μόνο με πρώτους αριθμούς: 2, 3, 5, 7, 11..."
      },
      {
        badge: "ΒΗΜΑ 2",
        sub: "Ο Χρυσός Κανόνας",
        title: "Επιλογή Παραγόντων",
        body: "Επιλέγουμε όλους τους κοινούς ΚΑΙ μη κοινούς πρώτους παράγοντες, παίρνοντας για τον καθένα τον μεγαλύτερο εκθέτη.",
        example: "Από το 2: επιλέγουμε 2² (όχι το 2¹)\nΑπό το 3: επιλέγουμε 3² (όχι το 3¹)",
        tip: "⚡ Στο Ε.Κ.Π. δεν αφήνουμε κανέναν παράγοντα έξω και διαλέγουμε πάντα τη μεγαλύτερη δύναμη!"
      },
      {
        badge: "ΒΗΜΑ 3",
        sub: "Γινόμενο Δυνάμεων",
        title: "Υπολογισμός Ε.Κ.Π.",
        body: "Σχηματίζουμε το γινόμενο των δυνάμεων που επιλέξαμε και εκτελούμε τους πολλαπλασιασμούς για το τελικό αποτέλεσμα.",
        example: "Ε.Κ.Π.(12, 18) ＝ 2² · 3² ＝ 4 · 9 ＝ 36",
        tip: "🎯 Το αποτέλεσμα είναι το μικρότερο κοινό πολλαπλάσιο που διαιρείται ακριβώς από όλους τους αριθμούς."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Ε.Κ.Π. με Πρώτους Παράγοντες",
    labDesc: "Διάλεξε 2 ή 3 αριθμούς και παρακολούθησε βήμα προς βήμα την κατακόρυφη ανάλυση και την επιλογή των μέγιστων εκθετών!",
    tabNumbers: (c) => `${c} ΑΡΙΘΜΟΙ`,
    inputHeader: (max) => `ΤΙΜΕΣ ΑΡΙΘΜΩΝ (2 － ${max}):`,
    numLabels: ['1ΟΣ ΑΡΙΘΜΟΣ', '2ΟΣ ΑΡΙΘΜΟΣ', '3ΟΣ ΑΡΙΘΜΟΣ'],
    presetHeader: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    tipRule: "💡 Επιλέγουμε όλους τους πρώτους παράγοντες (κοινούς και μη κοινούς), κρατώντας τον μεγαλύτερο εκθέτη!",
    statusHeader: "ΥΠΟΛΟΓΙΣΜΟΣ Ε.Κ.Π. ΜΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ:",
    step1Title: "📋 1. ΚΑΤΑΚΟΡΥΦΗ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΚΑΘΕ ΑΡΙΘΜΟΥ:",
    powerFormLabel: "ΜΟΡΦΗ ΔΥΝΑΜΕΩΝ:",
    step2Title: "🔍 2. ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ (ΚΟΙΝΟΙ ΚΑΙ ΜΗ ΚΟΙΝΟΙ ΜΕ ΜΕΓΙΣΤΟ ΕΚΘΕΤΗ):",
    forBaseLabel: (b) => `Για τη βάση ${b}:`,
    weChooseLabel: (exp) => `Επιλέγουμε ➔ ${exp}`,
    inNumber: (num, exp) => `στο ${num}: ${exp}`,
    step3Title: "ΤΕΛΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ Ε.Κ.Π.:",
    abbr: "Ε.Κ.Π.",
    ctaTitle: "Ώρα για Εξάσκηση στο Ε.Κ.Π.!",
    ctaDesc: "Κατάλαβες πώς βρίσκουμε το Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "LCM by Prime Factorization - Grade 6 | LearnMaths.gr",
    pageDescription: "Calculate the Least Common Multiple using prime factor decomposition: take all common and non-common prime factors with the highest exponent for Grade 6.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 20 • GRADE 6",
    heroTitle: "LCM by Prime Factorization",
    heroDesc: "Rapidly determine the Least Common Multiple of large numbers using the golden rule: Common and non-common prime factors raised to their greatest power!",
    heroPills: "Vertical Prime Factorization & Automatic Maximum Exponent Selection",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Finding Rule for LCM",
    theorySubtitle: "The prime factorization method broken down into three straightforward steps.",
    cards: [
      {
        badge: "STEP 1",
        sub: "Vertical Ladder",
        title: "Prime Factorization",
        body: "Decompose each number individually into a product of prime factors and express repeated factors using exponential notation (powers).",
        example: "12 ＝ 2² · 3\n18 ＝ 2 · 3²",
        tip: "💡 Divide successively using only prime numbers: 2, 3, 5, 7, 11..."
      },
      {
        badge: "STEP 2",
        sub: "The Golden Rule",
        title: "Selecting Factors",
        body: "Select all common AND non-common prime factors, taking each factor raised to its greatest exponent.",
        example: "For base 2: select 2² (not 2¹)\nFor base 3: select 3² (not 3¹)",
        tip: "⚡ For LCM, no factor is left out and we always choose the highest power!"
      },
      {
        badge: "STEP 3",
        sub: "Product of Powers",
        title: "Computing the LCM",
        body: "Multiply together all the selected powers to compute the final Least Common Multiple.",
        example: "LCM(12, 18) ＝ 2² · 3² ＝ 4 · 9 ＝ 36",
        tip: "🎯 The resulting value is the smallest positive integer divisible by all numbers."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive LCM Prime Factorization Lab",
    labDesc: "Choose 2 or 3 numbers and observe vertical factor ladders and maximum exponent selection step by step!",
    tabNumbers: (c) => `${c} NUMBERS`,
    inputHeader: (max) => `ENTER NUMBERS (2 － ${max}):`,
    numLabels: ['1ST NUMBER', '2ND NUMBER', '3RD NUMBER'],
    presetHeader: "PRESET EXAMPLES:",
    tipRule: "💡 Select all prime factors (common and non-common), retaining each with its highest exponent!",
    statusHeader: "LCM PRIME FACTORIZATION CALCULATION:",
    step1Title: "📋 1. VERTICAL FACTOR LADDER FOR EACH NUMBER:",
    powerFormLabel: "POWER NOTATION:",
    step2Title: "🔍 2. APPLYING RULE (COMMON & NON-COMMON WITH HIGHEST EXPONENT):",
    forBaseLabel: (b) => `For prime base ${b}:`,
    weChooseLabel: (exp) => `Select ➔ ${exp}`,
    inNumber: (num, exp) => `in ${num}: ${exp}`,
    step3Title: "FINAL LCM CALCULATION:",
    abbr: "LCM",
    ctaTitle: "Time to Practice LCM!",
    ctaDesc: "Understood finding the LCM via prime factorization? Put your skills to the test with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function EkpProtoiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [numCount, setNumCount] = useState(2);

  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(15);

  const handleInputChange = (setter, val) => {
    const clean = val.replace(/[^0-9]/g, '');

    if (clean === '') {
      setter('');
      return;
    }

    const n = Number(clean);
    if (n <= MAX_ALLOWED_NUMBER) {
      setter(n);
    }
  };

  const safeNum1 = num1 === '' ? 1 : Number(num1);
  const safeNum2 = num2 === '' ? 1 : Number(num2);
  const safeNum3 = num3 === '' ? 1 : Number(num3);

  const f1 = factorize(safeNum1);
  const f2 = factorize(safeNum2);
  const f3 =
    numCount === 3
      ? factorize(safeNum3)
      : { steps: [{ current: 1, divisor: null }], factors: {}, expr: '1' };

  const allPrimeBases = Array.from(
    new Set([
      ...Object.keys(f1.factors).map(Number),
      ...Object.keys(f2.factors).map(Number),
      ...(numCount === 3 ? Object.keys(f3.factors).map(Number) : [])
    ])
  ).sort((a, b) => a - b);

  let ekp = 1;
  const calculationFormulaParts = [];
  const ruleBreakdown = [];

  allPrimeBases.forEach((base) => {
    const e1 = f1.factors[base] || 0;
    const e2 = f2.factors[base] || 0;
    const e3 = numCount === 3 ? f3.factors[base] || 0 : 0;

    const maxExp = Math.max(e1, e2, e3);
    if (maxExp > 0) {
      ekp *= Math.pow(base, maxExp);

      const expStr =
        maxExp > 1
          ? `${base}${EXPONENTS_UNICODE[maxExp] || `^${maxExp}`}`
          : `${base}`;
      calculationFormulaParts.push(expStr);

      const appearances = [];
      if (e1 > 0) appearances.push(t.inNumber(safeNum1, `${base}${EXPONENTS_UNICODE[e1] || ''}`));
      if (e2 > 0) appearances.push(t.inNumber(safeNum2, `${base}${EXPONENTS_UNICODE[e2] || ''}`));
      if (numCount === 3 && e3 > 0) appearances.push(t.inNumber(safeNum3, `${base}${EXPONENTS_UNICODE[e3] || ''}`));

      ruleBreakdown.push({
        base,
        maxExp,
        expStr,
        appearances: appearances.join(', ')
      });
    }
  });

  const activeNumbers =
    numCount === 2 ? [safeNum1, safeNum2] : [safeNum1, safeNum2, safeNum3];

  const numbersList = [
    {
      val: num1,
      safeVal: safeNum1,
      color: 'text-blue-600',
      fact: f1,
      label: t.numLabels[0],
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      val: num2,
      safeVal: safeNum2,
      color: 'text-indigo-600',
      fact: f2,
      label: t.numLabels[1],
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  if (numCount === 3) {
    numbersList.push({
      val: num3,
      safeVal: safeNum3,
      color: 'text-purple-600',
      fact: f3,
      label: t.numLabels[2],
      badge: 'bg-purple-100 text-purple-800 border-purple-200'
    });
  }

  const currentNumbersString = activeNumbers.join(', ');

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/20-ekp-protoi-ask"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroPills}</span>
            </div>
            <Link
              href="/st-dimotikou/20-ekp-protoi-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {t.cards.map((card, idx) => (
              <article key={idx} className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                      {card.badge}
                    </span>
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{card.sub}</span>
                  </div>
                  <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                    {card.body}
                  </p>

                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold space-y-1 text-slate-800 whitespace-pre-line">
                    <p>{card.example}</p>
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                  {card.tip}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labDesc}
              </p>
            </div>

            {/* NUMBER COUNT TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setNumCount(2)}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  numCount === 2
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabNumbers(2)}
              </button>
              <button
                type="button"
                onClick={() => setNumCount(3)}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  numCount === 3
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabNumbers(3)}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputHeader(formatNumber(MAX_ALLOWED_NUMBER, locale))}
                  </span>
                  
                  <div className="space-y-2.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        {t.numLabels[0]}:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num1}
                        onChange={(e) => handleInputChange(setNum1, e.target.value)}
                        className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                        placeholder="12"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        {t.numLabels[1]}:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num2}
                        onChange={(e) => handleInputChange(setNum2, e.target.value)}
                        className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                        placeholder="18"
                      />
                    </div>

                    {numCount === 3 && (
                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          {t.numLabels[2]}:
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={num3}
                          onChange={(e) => handleInputChange(setNum3, e.target.value)}
                          className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-purple-200 rounded-xl shadow-xs text-purple-600 outline-none focus:border-purple-500 tracking-wider"
                          placeholder="15"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetHeader}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {numCount === 2
                      ? PRESETS_2.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.n1);
                              setNum2(p.n2);
                            }}
                            className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs cursor-pointer"
                          >
                            ({p.n1}, {p.n2})
                          </button>
                        ))
                      : PRESETS_3.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.n1);
                              setNum2(p.n2);
                              setNum3(p.n3);
                            }}
                            className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs cursor-pointer"
                          >
                            ({p.n1}, {p.n2}, {p.n3})
                          </button>
                        ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.tipRule}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  {t.statusHeader}
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                  {t.abbr}({currentNumbersString}) ＝ <span className="text-amber-500">{formatNumber(ekp, locale)}</span>
                </div>
              </div>

              {/* 1. ΚΑΤΑΚΟΡΥΦΕΣ ΑΝΑΛΥΣΕΙΣ */}
              <div className="w-full space-y-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  {t.step1Title}
                </span>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 justify-center bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 shadow-inner">
                  {numbersList.map((numObj, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <span className={`text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-md border text-center ${numObj.badge}`}>
                        {numObj.label} ({numObj.safeVal})
                      </span>

                      {/* ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΔΙΑΙΡΕΣΗΣ */}
                      <div className="font-mono text-xs sm:text-sm md:text-base w-full max-w-[120px] my-auto">
                        {numObj.fact.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="grid grid-cols-2 text-right border-b border-slate-100 last:border-0 py-0.5"
                          >
                            <span className="pr-2 font-black text-slate-800">
                              {step.current}
                            </span>
                            <span className="pl-2 font-black text-rose-600 border-l-2 border-slate-300 text-left">
                              {step.divisor || '—'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ΜΟΡΦΗ ΔΥΝΑΜΕΩΝ */}
                      <div className="text-center pt-2 border-t border-slate-100 w-full">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold uppercase">
                          {t.powerFormLabel}
                        </span>
                        <span className="font-mono font-black text-xs sm:text-sm text-slate-800">
                          {numObj.safeVal} ＝ <span className="text-blue-600">{numObj.fact.expr}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. ΕΠΕΞΗΓΗΣΗ ΕΠΙΛΟΓΗΣ ΜΕΓΙΣΤΩΝ ΕΚΘΕΤΩΝ */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <span className="text-xs 2xl:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                  {t.step2Title}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {ruleBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/90 p-2.5 sm:p-3 rounded-xl border border-slate-700 space-y-1 text-center font-mono"
                    >
                      <span className="text-xs text-slate-300 block">
                        {t.forBaseLabel(<strong className="text-cyan-400 font-black">{item.base}</strong>)}
                      </span>
                      <div className="text-xs sm:text-sm font-black text-amber-300">
                        {t.weChooseLabel(item.expStr)}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        ({item.appearances})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1.5">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  {t.step3Title}
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>{t.abbr}({currentNumbersString}) ＝</span>
                  <span className="text-amber-300">
                    {calculationFormulaParts.length > 0 ? calculationFormulaParts.join(' · ') : '1'}
                  </span>
                  <span> ＝ </span>
                  <span className="text-amber-400 text-lg sm:text-xl md:text-2xl font-black bg-white/10 px-3 py-1 rounded-xl shadow-xs inline-block">
                    {formatNumber(ekp, locale)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/20-ekp-protoi-ask"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}