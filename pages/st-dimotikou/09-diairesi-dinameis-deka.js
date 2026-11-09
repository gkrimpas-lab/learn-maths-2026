import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function formatNum(val, locale = 'el', decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return locale === 'en' ? String(rounded) : String(rounded).replace('.', ',');
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Διαίρεση με 10, 100, 1000 ... και 0,1, 0,01, 0,001 ... - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς διαιρούμε φυσικούς και δεκαδικούς με 10, 100, 1000 και 0,1, 0,01, 0,001 για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 9 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Διαίρεση με 10, 100, 1.000 ... και 0,1, 0,01, 0,001 ...",
    heroDesc: "Μάθε πώς να υπολογίζεις πηλίκα στο μυαλό χωρίς κάθετη πράξη, μετακινώντας την υποδιαστολή αριστερά ή δεξιά ανάλογα με τη δύναμη του 10!",
    heroPills: "Κανόνες Μετατόπισης Υποδιαστολής & Διαδραστικός Υπολογιστής",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Κανόνες Νοερών Διαιρέσεων σε 3 Βήματα",
    theorySubtitle: "Πώς μετακινείται η υποδιαστολή ανάλογα με τον τύπο του διαιρέτη.",
    steps: [
      {
        badge: "ΒΗΜΑ 1",
        sub: "Μικραίνει",
        title: "Με 10, 100, 1.000 ...",
        body: "Ο αριθμός μικραίνει. Μετακινούμε την υποδιαστολή αριστερά τόσες θέσεις όσα είναι τα μηδενικά (1, 2, 3). Αν τελειώσουν τα ψηφία, βάζουμε «0,» στην αρχή.",
        example1: "432,5 : 10 ＝ 43,25",
        example2: "432,5 : 100 ＝ 4,325",
        tip: "💡 Κάθε μηδενικό στον διαιρέτη μετακινεί την υποδιαστολή μία θέση αριστερά."
      },
      {
        badge: "ΒΗΜΑ 2",
        sub: "Μεγαλώνει",
        title: "Με 0,1, 0,01, 0,001 ...",
        body: "Ο αριθμός μεγαλώνει! (λειτουργεί όπως ο πολλαπλασιασμός). Μετακινούμε την υποδιαστολή δεξιά τόσες θέσεις όσα τα δεκαδικά ψηφία (1, 2, 3).",
        example1: "4,325 : 0,1 ＝ 43,25",
        example2: "4,325 : 0,01 ＝ 432,5",
        tip: "⚡ Η διαίρεση με δεκαδικό μικρότερο του 1 δίνει πάντα πηλίκο μεγαλύτερο από τον διαιρετέο!"
      },
      {
        badge: "ΒΗΜΑ 3",
        sub: "Ισοδυναμία",
        title: "Ισοδυναμία Πράξεων",
        body: "Η διαίρεση με δεκαδικό κλάσμα ισοδυναμεί με πολλαπλασιασμό:",
        eq1: "Διαίρεση με 10 ＝ Πολλαπλασιασμός με 0,1",
        eq2: "Διαίρεση με 0,1 ＝ Πολλαπλασιασμός με 10",
        example1: "50 : 10 ＝ 50 · 0,1 ＝ 5",
        tip: "🎯 Γνωρίζοντας τις ισοδυναμίες, μετατρέπουμε δύσκολες διαιρέσεις σε απλούς πολλαπλασιασμούς."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Μετατόπισης Υποδιαστολής",
    labDesc: "Πληκτρολόγησε έναν αριθμό, διάλεξε διαιρέτη και παρατήρησε το άλμα της υποδιαστολής!",
    tabMegaloi: "📉 : 10, 100, 1.000 (Αριστερά)",
    tabMikroi: "🚀 : 0,1, 0,01, 0,001 (Δεξιά)",
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ (ΔΙΑΙΡΕΤΕΟ):",
    placeholderInput: "π.χ. 543,2",
    divisorLabel: "ΕΠΙΛΕΞΕ ΔΙΑΙΡΕΤΗ:",
    presets: [
      { label: '📏 543,2 μ. (Μήκος)', val: '543,2' },
      { label: '💶 125,5 € (Ποσό)', val: '125,5' },
      { label: '⚖️ 48,6 κιλά (Βάρος)', val: '48,6' },
      { label: '🔢 7 (Μονάδα)', val: '7' }
    ],
    resultBadge: "✨ ΤΕΛΙΚΟ ΠΗΛΙΚΟ:",
    shiftBoxLabel: "📍 Μετακίνηση",
    shiftPosSingle: "θέση",
    shiftPosPlural: "θέσεις",
    shiftTo: "προς τα",
    guideTitle: "🧭 ΟΠΤΙΚΟΣ ΟΔΗΓΟΣ ΜΕΤΑΤΟΠΙΣΗΣ ΥΠΟΔΙΑΣΤΟΛΗΣ",
    guideDesc: "Παρατήρησε τα βέλη που δείχνουν το άλμα της υποδιαστολής ανάμεσα στα ψηφία!",
    initLabel: "Αρχικός",
    jumpSingle: "άλμα",
    jumpPlural: "άλματα",
    newLabel: "Νέος Αριθμός",
    svgTextPos: "θέση",
    whatHappened: "💡 Τι συνέβη:",
    explanationMegaloi: " Αν τελειώσουν τα ακέραια ψηφία, βάζουμε 0, στην αρχή!",
    explanationMikroi: " Αν τελειώσουν τα δεκαδικά ψηφία, συμπληρώνουμε μηδενικά στο τέλος!",
    summaryTitle: "🧬 ΣΥΝΟΠΤΙΚΟΣ ΚΑΝΟΝΑΣ ΝΟΕΡΩΝ ΥΠΟΛΟΓΙΣΜΩΝ",
    summaryBadge: "Πλήρης Εμφάνιση",
    rule1Title: "1. Διαίρεση με 10, 100, 1.000 ...",
    rule2Title: "2. Διαίρεση με 0,1, 0,01, 0,001 ...",
    rule1_1: ": 10 ➔ 1 θέση αριστερά (45 : 10 ＝ 4,5)",
    rule1_2: ": 100 ➔ 2 θέσεις αριστερά (45 : 100 ＝ 0,45)",
    rule1_3: ": 1.000 ➔ 3 θέσεις αριστερά (45 : 1.000 ＝ 0,045)",
    rule2_1: ": 0,1 ➔ 1 θέση δεξιά (2,5 : 0,1 ＝ 25)",
    rule2_2: ": 0,01 ➔ 2 θέσεις δεξιά (2,5 : 0,01 ＝ 250)",
    rule2_3: ": 0,001 ➔ 3 θέσεις δεξιά (2,5 : 0,001 ＝ 2.500)",
    ctaTitle: "Ώρα για Εξάσκηση στη Διαίρεση με Δυνάμεις του 10!",
    ctaDesc: "Κατανόησες πώς μετακινείται η υποδιαστολή στη διαίρεση με δυνάμεις του 10; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Division by 10, 100, 1,000 ... and 0.1, 0.01, 0.001 ... - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how to divide whole numbers and decimals by 10, 100, 1,000 and 0.1, 0.01, 0.001 for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 9 • GRADE 6",
    heroTitle: "Division by 10, 100, 1,000 ... and 0.1, 0.01, 0.001 ...",
    heroDesc: "Master mental quotients without long division algorithms simply by shifting the decimal point left or right depending on the power of 10!",
    heroPills: "Decimal Shift Rules & Interactive Calculator",
    heroCta: "Try the Exercises",
    theoryTitle: "Mental Division Rules in 3 Steps",
    theorySubtitle: "How the decimal point moves according to the divisor type.",
    steps: [
      {
        badge: "STEP 1",
        sub: "Decreases",
        title: "By 10, 100, 1,000 ...",
        body: "The number decreases. Shift the decimal point left by as many places as there are zeros (1, 2, 3). If you run out of digits, prepend '0.' at the beginning.",
        example1: "432.5 : 10 ＝ 43.25",
        example2: "432.5 : 100 ＝ 4.325",
        tip: "💡 Each zero in the divisor shifts the decimal point one position to the left."
      },
      {
        badge: "STEP 2",
        sub: "Increases",
        title: "By 0.1, 0.01, 0.001 ...",
        body: "The number increases! (acts just like multiplication). Shift the decimal point right by as many places as there are decimal digits (1, 2, 3).",
        example1: "4.325 : 0.1 ＝ 43.25",
        example2: "4.325 : 0.01 ＝ 432.5",
        tip: "⚡ Dividing by a decimal smaller than 1 always produces a quotient larger than the dividend!"
      },
      {
        badge: "STEP 3",
        sub: "Equivalence",
        title: "Operation Equivalence",
        body: "Dividing by decimal powers corresponds directly to multiplication:",
        eq1: "Dividing by 10 ＝ Multiplying by 0.1",
        eq2: "Dividing by 0.1 ＝ Multiplying by 10",
        example1: "50 : 10 ＝ 50 · 0.1 ＝ 5",
        tip: "🎯 Recognizing operation equivalences turns cumbersome divisions into rapid multiplications."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Decimal Shift Lab",
    labDesc: "Enter a number, pick a divisor, and watch the decimal point jump across places!",
    tabMegaloi: "📉 : 10, 100, 1,000 (Left)",
    tabMikroi: "🚀 : 0.1, 0.01, 0.001 (Right)",
    inputLabel: "ENTER NUMBER (DIVIDEND):",
    placeholderInput: "e.g. 543.2",
    divisorLabel: "SELECT DIVISOR:",
    presets: [
      { label: '📏 543.2 m (Length)', val: '543.2' },
      { label: '💶 125.5 € (Amount)', val: '125.5' },
      { label: '⚖️ 48.6 kg (Weight)', val: '48.6' },
      { label: '🔢 7 (Unit)', val: '7' }
    ],
    resultBadge: "✨ FINAL QUOTIENT:",
    shiftBoxLabel: "📍 Shift",
    shiftPosSingle: "place",
    shiftPosPlural: "places",
    shiftTo: "to the",
    guideTitle: "🧭 VISUAL DECIMAL SHIFT GUIDE",
    guideDesc: "Watch the curved arrow demonstrate the decimal point jumping between digits!",
    initLabel: "Initial",
    jumpSingle: "jump",
    jumpPlural: "jumps",
    newLabel: "New Number",
    svgTextPos: "step",
    whatHappened: "💡 What happened:",
    explanationMegaloi: " If you run out of whole digits, prepend 0. at the beginning!",
    explanationMikroi: " If you run out of decimal digits, append trailing zeros!",
    summaryTitle: "🧬 SUMMARY OF MENTAL CALCULATION RULES",
    summaryBadge: "Complete View",
    rule1Title: "1. Dividing by 10, 100, 1,000 ...",
    rule2Title: "2. Dividing by 0.1, 0.01, 0.001 ...",
    rule1_1: ": 10 ➔ 1 place left (45 : 10 ＝ 4.5)",
    rule1_2: ": 100 ➔ 2 places left (45 : 100 ＝ 0.45)",
    rule1_3: ": 1,000 ➔ 3 places left (45 : 1,000 ＝ 0.045)",
    rule2_1: ": 0.1 ➔ 1 place right (2.5 : 0.1 ＝ 25)",
    rule2_2: ": 0.01 ➔ 2 places right (2.5 : 0.01 ＝ 250)",
    rule2_3: ": 0.001 ➔ 3 places right (2.5 : 0.001 ＝ 2,500)",
    ctaTitle: "Time to Practice Division by Powers of 10!",
    ctaDesc: "Mastered shifting the decimal point for division? Test your understanding with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function DiairesiDinameisDekaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [activeTab, setActiveTab] = useState('megaloi'); // 'megaloi' ή 'mikroi'
  const [inputNum, setInputNum] = useState(isEn ? '543.2' : '543,2');
  const [divisor, setDivisor] = useState(10);

  const sanitizeInput = (val) => {
    const sep = isEn ? '.' : ',';
    let formatted = isEn
      ? val.replace(/,/g, '.').replace(/[^0-9.]/g, '')
      : val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(sep);
    let intPart = (parts[0] || '').slice(0, 4);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 3);
      return `${intPart}${sep}${decPart}`;
    }
    return intPart;
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const valNum = parseVal(inputNum);
  const rawResult = divisor > 0 ? valNum / divisor : 0;

  const formatResult = () => {
    if (valNum === 0) return '0';
    const sep = isEn ? '.' : ',';
    const cleanStr = isEn ? inputNum.replace(',', '.') : inputNum.replace('.', ',');
    const decParts = cleanStr.split(sep)[1] || '';

    if (activeTab === 'megaloi') {
      const addedDec = divisor === 10 ? 1 : divisor === 100 ? 2 : 3;
      const decimals = decParts.length + addedDec;
      const str = rawResult.toFixed(decimals);
      return isEn ? str : str.replace('.', ',');
    } else {
      const removedDec = divisor === 0.1 ? 1 : divisor === 0.01 ? 2 : 3;
      const remainingDec = Math.max(0, decParts.length - removedDec);
      const str = rawResult.toFixed(remainingDec);
      return isEn ? str : str.replace('.', ',');
    }
  };

  const formattedResult = formatResult();

  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      const steps = divisor === 10 ? 1 : divisor === 100 ? 2 : 3;
      return {
        steps,
        direction: isEn ? 'left' : 'αριστερά',
        effect: isEn ? 'decreases' : 'μικραίνει',
        label: `${steps} ${steps === 1 ? t.jumpSingle : t.jumpPlural} ${isEn ? 'left' : 'αριστερά'}`
      };
    } else {
      const steps = divisor === 0.1 ? 1 : divisor === 0.01 ? 2 : 3;
      return {
        steps,
        direction: isEn ? 'right' : 'δεξιά',
        effect: isEn ? 'increases' : 'μεγαλώνει',
        label: `${steps} ${steps === 1 ? t.jumpSingle : t.jumpPlural} ${isEn ? 'right' : 'δεξιά'}`
      };
    }
  };

  const shift = getShiftInfo();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
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
              href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
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
            {/* Step 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.steps[0].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[0].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[0].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[0].body}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>{t.steps[0].example1}</p>
                  <p>{t.steps[0].example2}</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.steps[0].tip}
              </div>
            </article>

            {/* Step 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.steps[1].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[1].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[1].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[1].body}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>{t.steps[1].example1}</p>
                  <p>{t.steps[1].example2}</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.steps[1].tip}
              </div>
            </article>

            {/* Step 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.steps[2].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[2].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[2].title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1">
                  <p>{t.steps[2].body}</p>
                  <p className="font-mono text-xs font-bold text-cyan-800">· {t.steps[2].eq1}</p>
                  <p className="font-mono text-xs font-bold text-cyan-800">· {t.steps[2].eq2}</p>
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>{t.steps[2].example1}</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                {t.steps[2].tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕΤΑΤΟΠΙΣΗΣ ΥΠΟΔΙΑΣΤΟΛΗΣ */}
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

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('megaloi');
                  setDivisor(10);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabMegaloi}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mikroi');
                  setDivisor(0.1);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeTab === 'mikroi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabMikroi}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: CONTROLS & COMPUTATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* CONTROLS (7 COLS) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="space-y-2">
                  <label className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputLabel}
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputNum}
                    onChange={(e) => setInputNum(sanitizeInput(e.target.value))}
                    className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none w-full text-blue-600 font-mono"
                    placeholder={t.placeholderInput}
                  />
                </div>

                {/* PRESETS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputNum(p.val)}
                      className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* DIVISOR BUTTONS */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.divisorLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTab === 'megaloi' ? (
                      [10, 100, 1000].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDivisor(d)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 cursor-pointer ${
                            divisor === d
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          : {d.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                        </button>
                      ))
                    ) : (
                      [0.1, 0.01, 0.001].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDivisor(d)}
                          className={`py-2.5 rounded-xl font-black text-sm md:text-base border shadow-sm transition-all font-mono touch-manipulation active:scale-95 cursor-pointer ${
                            divisor === d
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          : {formatNum(d, locale)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* DYNAMIC RESULT CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  {t.resultBadge}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-black font-mono">
                  <span className="text-white">{inputNum || '0'}</span>
                  <span className="text-amber-400 font-sans">:</span>
                  <span className="text-cyan-300">{formatNum(divisor, locale)}</span>
                  <span className="text-slate-400 font-sans">＝</span>
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-xl shadow-md">
                    {formattedResult}
                  </span>
                </div>

                <div className="bg-white/10 px-3.5 py-2 rounded-xl text-xs text-blue-100 border border-white/15">
                  {t.shiftBoxLabel} <strong>{shift.steps} {shift.steps === 1 ? t.shiftPosSingle : t.shiftPosPlural}</strong> {t.shiftTo} <strong>{shift.direction}</strong>
                </div>
              </div>

            </div>

            {/* ROW 2: VISUAL GUIDE OF DECIMAL POINT SHIFTING */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-between space-y-4 sm:space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                  {t.guideTitle}
                </span>
                <p className="text-xs sm:text-sm text-slate-500">
                  {t.guideDesc}
                </p>
              </div>

              {/* VISUAL SHIFT BOX */}
              <div className="w-full max-w-xl bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center gap-3 sm:gap-6 font-mono text-xl sm:text-2xl md:text-3xl font-black flex-wrap">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-slate-400 mb-1">{t.initLabel}</span>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200">
                      {inputNum || '0'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-amber-600 mb-1">
                      {shift.label}
                    </span>
                    <span className="text-xl sm:text-2xl text-amber-500">
                      {shift.direction === (isEn ? 'left' : 'αριστερά') ? '⬅️' : '➔'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-emerald-600 mb-1">{t.newLabel}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-300 shadow-sm">
                      {formattedResult}
                    </span>
                  </div>
                </div>

                {/* SVG Shift Diagram */}
                <div className="w-full bg-slate-50 p-2 sm:p-4 rounded-xl border border-slate-200 flex justify-center overflow-hidden">
                  <svg viewBox="0 0 340 70" className="w-full max-w-[340px] aspect-[340/70] select-none shrink-0 overflow-visible">
                    <defs>
                      <marker
                        id="diairesi-shift-arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                      </marker>
                    </defs>

                    {/* Base Axis Line */}
                    <line x1="20" y1="52" x2="320" y2="52" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
                    
                    {/* Jump Points (Dots) */}
                    <circle cx="90" cy="52" r="4.5" fill="#f59e0b" />
                    <circle cx="250" cy="52" r="4.5" fill="#f59e0b" />

                    {/* Jump Arc */}
                    <path
                      d={
                        shift.direction === (isEn ? 'left' : 'αριστερά')
                          ? 'M 250 50 Q 170 10 96 48'
                          : 'M 90 50 Q 170 10 244 48'
                      }
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      markerEnd="url(#diairesi-shift-arrow)"
                    />

                    {/* Label */}
                    <text x="170" y="20" fontSize="12" fontWeight="900" textAnchor="middle" fill="#d97706">
                      {shift.steps} · ({t.svgTextPos} {shift.direction})
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3.5 sm:p-4 rounded-xl text-xs md:text-sm text-blue-900 font-medium text-center max-w-2xl w-full">
                <strong>{t.whatHappened}</strong> {isEn ? 'Dividing by' : 'Διαιρώντας με το'}{' '}
                <strong className="text-blue-700 font-mono">{formatNum(divisor, locale)}</strong>,{' '}
                {isEn ? `the number ${shift.effect}.` : `ο αριθμός ${shift.effect}.`}{' '}
                {isEn
                  ? `The decimal point shifted ${shift.steps} ${shift.steps === 1 ? 'place' : 'places'} to the ${shift.direction}.`
                  : `Η υποδιαστολή μετακινήθηκε ${shift.steps} ${shift.steps === 1 ? 'θέση' : 'θέσεις'} προς τα ${shift.direction}.`}
                {activeTab === 'megaloi' ? t.explanationMegaloi : t.explanationMikroi}
              </div>
            </div>

            {/* ROW 3: STEP-BY-STEP SUMMARY */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  {t.summaryTitle}
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  {t.summaryBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-blue-800 uppercase tracking-wider block">
                    {t.rule1Title}
                  </span>
                  <ul className="space-y-1">
                    <li>· {t.rule1_1}</li>
                    <li>· {t.rule1_2}</li>
                    <li>· {t.rule1_3}</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-black text-indigo-800 uppercase tracking-wider block">
                    {t.rule2Title}
                  </span>
                  <ul className="space-y-1">
                    <li>· {t.rule2_1}</li>
                    <li>· {t.rule2_2}</li>
                    <li>· {t.rule2_3}</li>
                  </ul>
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
            href="/st-dimotikou/09-diairesi-dinameis-deka-ask"
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