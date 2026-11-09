import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const TRANSLATIONS = {
  el: {
    pageTitle: "Πρόσθεση Φυσικών και Δεκαδικών • Ιδιότητες και Αφαίρεση - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς προσθέτουμε φυσικούς και δεκαδικούς αριθμούς, τις ιδιότητες της πρόσθεσης και την αφαίρεση για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 5 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πρόσθεση Φυσικών & Δεκαδικών • Ιδιότητες & Αφαίρεση",
    heroDesc: "Μάθε πώς προσθέτουμε με ασφάλεια φυσικούς και δεκαδικούς αριθμούς, αξιοποίησε την αντιμεταθετική και προσεταιριστική ιδιότητα για γρήγορους υπολογισμούς και δες πώς η αφαίρεση λειτουργεί ως η αντίστροφη πράξη!",
    heroPills: "Κάθετη Στοίχιση Υποδιαστολής, Ιδιότητες & Δοκιμή Αφαίρεσης",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Κανόνες Πρόσθεσης & Αφαίρεσης σε 3 Βήματα",
    theorySubtitle: "Η σωστή στοίχιση, οι μαθηματικές ιδιότητες και η επαλήθευση των πράξεων.",
    steps: [
      {
        badge: "ΒΗΜΑ 1",
        sub: "Στοίχιση",
        title: "Κάθετη Πρόσθεση Δεκαδικών",
        body: "Γράφουμε τους προσθετέους τον έναν κάτω από τον άλλον, φροντίζοντας οι υποδιαστολές και τα αντίστοιχα ψηφία (Μ κάτω από Μ, δ κάτω από δ) να είναι σε απόλυτη στοίχιση.",
        example: "34,75 ＋ 18,50 ＝ 53,25",
        tip: "💡 Αν χρειάζεται, συμπληρώνουμε μηδενικά στο τέλος ώστε όλοι οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων."
      },
      {
        badge: "ΒΗΜΑ 2",
        sub: "Ιδιότητες",
        title: "Ιδιότητες Πρόσθεσης",
        body: "Χρησιμοποιούμε τις ιδιότητες για απλούστευση υπολογισμών:",
        properties: [
          "Αντιμεταθετική: α ＋ β ＝ β ＋ α",
          "Προσεταιριστική: (α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)",
          "Ουδέτερο στοιχείο: Το 0 (α ＋ 0 ＝ α)"
        ],
        example: "2,5 ＋ 4,8 ＝ 4,8 ＋ 2,5 ＝ 7,3",
        tip: "⚡ Αξιοποιούμε τις ιδιότητες για να ομαδοποιούμε αριθμούς που δίνουν «στρογγυλά» αθροίσματα."
      },
      {
        badge: "ΒΗΜΑ 3",
        sub: "Επαλήθευση",
        title: "Αφαίρεση ως Αντίστροφη Πράξη",
        body: "Η αφαίρεση «λύνει» την πρόσθεση και αποτελεί τη δοκιμή της: Αν α ＋ β ＝ γ, τότε γ － β ＝ α και γ － α ＝ β.",
        example: "53,25 － 18,50 ＝ 34,75 (Δοκιμή)",
        tip: "🎯 Αν αφαιρέσουμε έναν προσθετέο από το άθροισμα, πρέπει πάντα να βρίσκουμε τον άλλον."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Πρόσθεσης & Ιδιοτήτων",
    labDesc: "Άλλαξε τους αριθμούς είτε πληκτρολογώντας (έως 4 ακέραια και 3 δεκαδικά ψηφία) είτε πατώντας τα κουμπιά (＋ / －)!",
    presets: [
      { label: '💶 34,75 ＋ 18,50 ＋ 5,25 (Δεκαδικά)', a: '34,75', b: '18,5', c: '5,25' },
      { label: '🔢 1.250 ＋ 850 ＋ 400 (Φυσικοί)', a: '1250', b: '850', c: '400' },
      { label: '⚖️ 4,25 ＋ 0,75 ＋ 2,5 (Συμπληρώματα)', a: '4,25', b: '0,75', c: '2,5' },
      { label: '📏 120,4 ＋ 35,85 ＋ 4,15 (Μήκη)', a: '120,4', b: '35,85', c: '4,15' }
    ],
    limitBadge: "έως 9999,999",
    inputTip: "💡 Ακέραιο μέρος έως 4 ψηφία (0 - 9999), κλασματικό/δεκαδικό μέρος έως 3 ψηφία (δέκατα, εκατοστά, χιλιοστά).",
    sumBadge: "✨ ΑΘΡΟΙΣΜΑ 2 ΑΡΙΘΜΩΝ (α ＋ β):",
    totalThreeLabel: "Σύνολο 3 Αριθμών (α ＋ β ＋ γ):",
    diffLabel: "Διαφορά (α － β):",
    tabCommutative: "🔄 Αντιμεταθετική Ιδιότητα",
    tabAssociative: "🧩 Προσεταιριστική (με 3ο αριθμό)",
    tabInverse: "➖ Αφαίρεση ως Δοκιμή",
    verticalAlignTitle: "📐 ΚΑΘΕΤΗ ΣΤΟΙΧΙΣΗ (α ＋ β):",
    verticalAlignTip: "🎯 Τα μηδενικά στο τέλος εξισώνουν τα δεκαδικά ψηφία!",
    propCommTitle: "Αντιμεταθετική Ιδιότητα σε Δράση",
    propCommText: "Η σειρά των προσθετέων δεν επηρεάζει το άθροισμα:",
    propAssocTitle: "Προσεταιριστική Ιδιότητα",
    propAssocText: "Ομαδοποιούμε όπως μας εξυπηρετεί:",
    propInvTitle: "Αφαίρεση και Δοκιμή Πρόσθεσης",
    propInvText: "Αν από το άθροισμα αφαιρέσουμε έναν προσθετέο, βρίσκουμε τον άλλον:",
    correctTag: "(Σωστό ✅)",
    goldenRuleTitle: "🧬 ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΑΦΑΙΡΕΣΗΣ ΔΕΚΑΔΙΚΩΝ",
    goldenRuleBadge: "Πλήρης Εμφάνιση",
    rules: [
      { title: "1. Στοίχιση Υποδιαστολών", desc: "Τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη." },
      { title: "2. Συμπλήρωση Μηδενικών", desc: "Προσθέτουμε μηδενικά στο τέλος ώστε όλοι οι αριθμοί να έχουν το ίδιο πλήθος δεκαδικών ψηφίων." },
      { title: "3. Κατέβασμα Υποδιαστολής", desc: "Εκτελούμε την πράξη κανονικά και κατεβάζουμε την υποδιαστολή στο αποτέλεσμα στην ίδια θέση." }
    ],
    ctaTitle: "Ώρα για Εξάσκηση στην Πρόσθεση & Αφαίρεση!",
    ctaDesc: "Κατανόησες την πρόσθεση, τις ιδιότητες και την αφαίρεση; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Addition of Whole Numbers & Decimals • Properties and Subtraction - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how to add whole numbers and decimals, understand the properties of addition, and perform subtraction verification for Grade 6.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 5 • GRADE 6",
    heroTitle: "Addition of Whole Numbers & Decimals • Properties & Subtraction",
    heroDesc: "Master adding whole numbers and decimals with precision, leverage the commutative and associative properties for faster mental math, and verify results using subtraction as the inverse operation!",
    heroPills: "Vertical Decimal Alignment, Properties & Subtraction Check",
    heroCta: "Try the Exercises",
    theoryTitle: "Addition & Subtraction Rules in 3 Steps",
    theorySubtitle: "Proper column alignment, mathematical properties, and checking calculations.",
    steps: [
      {
        badge: "STEP 1",
        sub: "Alignment",
        title: "Vertical Column Addition",
        body: "Write addends one below the other, ensuring that decimal points and corresponding place values (Units below Units, Tenths below Tenths) are strictly aligned.",
        example: "34.75 ＋ 18.50 ＝ 53.25",
        tip: "💡 If needed, append trailing zeros so that all numbers have the same number of decimal places."
      },
      {
        badge: "STEP 2",
        sub: "Properties",
        title: "Properties of Addition",
        body: "Use fundamental properties to simplify calculations:",
        properties: [
          "Commutative: a ＋ b ＝ b ＋ a",
          "Associative: (a ＋ b) ＋ c ＝ a ＋ (b ＋ c)",
          "Identity Element: 0 (a ＋ 0 ＝ a)"
        ],
        example: "2.5 ＋ 4.8 ＝ 4.8 ＋ 2.5 ＝ 7.3",
        tip: "⚡ Group numbers strategically to form convenient round numbers."
      },
      {
        badge: "STEP 3",
        sub: "Verification",
        title: "Subtraction as the Inverse Operation",
        body: "Subtraction verifies addition: If a ＋ b ＝ c, then c － b ＝ a and c － a ＝ b.",
        example: "53.25 － 18.50 ＝ 34.75 (Check)",
        tip: "🎯 Subtracting one addend from the sum must always yield the other addend."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Addition & Properties Lab",
    labDesc: "Change numbers by typing (up to 4 whole digits and 3 decimals) or by tapping the (＋ / －) step buttons!",
    presets: [
      { label: '💶 34.75 ＋ 18.50 ＋ 5.25 (Decimals)', a: '34.75', b: '18.5', c: '5.25' },
      { label: '🔢 1,250 ＋ 850 ＋ 400 (Whole)', a: '1250', b: '850', c: '400' },
      { label: '⚖️ 4.25 ＋ 0.75 ＋ 2.5 (Complements)', a: '4.25', b: '0.75', c: '2.5' },
      { label: '📏 120.4 ＋ 35.85 ＋ 4.15 (Lengths)', a: '120.4', b: '35.85', c: '4.15' }
    ],
    limitBadge: "up to 9999.999",
    inputTip: "💡 Whole number part up to 4 digits (0 - 9999), decimal part up to 3 digits (tenths, hundredths, thousandths).",
    sumBadge: "✨ SUM OF 2 NUMBERS (a ＋ b):",
    totalThreeLabel: "Total of 3 Numbers (a ＋ b ＋ c):",
    diffLabel: "Difference (a － b):",
    tabCommutative: "🔄 Commutative Property",
    tabAssociative: "🧩 Associative Property",
    tabInverse: "➖ Subtraction Check",
    verticalAlignTitle: "📐 VERTICAL ALIGNMENT (a ＋ b):",
    verticalAlignTip: "🎯 Trailing zeros equalize decimal places!",
    propCommTitle: "Commutative Property in Action",
    propCommText: "Changing the order of addends does not alter the sum:",
    propAssocTitle: "Associative Property",
    propAssocText: "Group numbers in any convenient way:",
    propInvTitle: "Subtraction & Addition Verification",
    propInvText: "Subtracting one addend from the sum reveals the other:",
    correctTag: "(Correct ✅)",
    goldenRuleTitle: "🧬 GOLDEN RULES FOR ADDING & SUBTRACTING DECIMALS",
    goldenRuleBadge: "Complete View",
    rules: [
      { title: "1. Decimal Alignment", desc: "Align decimal points directly in the same vertical column." },
      { title: "2. Zero Padding", desc: "Append trailing zeros so all numbers have the same number of decimal places." },
      { title: "3. Bring Down the Decimal Point", desc: "Perform standard addition/subtraction and bring the decimal point straight down into the answer." }
    ],
    ctaTitle: "Time to Practice Addition & Subtraction!",
    ctaDesc: "Understood column alignment, properties, and verification? Test your knowledge with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function ProsthesiAfairesiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [numA, setNumA] = useState(isEn ? '34.75' : '34,75');
  const [numB, setNumB] = useState(isEn ? '18.5' : '18,5');
  const [extraNum, setExtraNum] = useState(isEn ? '5.25' : '5,25');
  const [activeProperty, setActiveProperty] = useState('antimetathetiki');

  const sanitizeInput = (val) => {
    const sep = isEn ? '.' : ',';
    let formatted = isEn
      ? val.replace(/,/g, '.').replace(/[^0-9.]/g, '')
      : val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = formatted.split(sep);

    let intPart = parts[0] || '';
    if (intPart.length > 4) {
      intPart = intPart.slice(0, 4);
    }

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

  const valA = parseVal(numA);
  const valB = parseVal(numB);
  const valExtra = parseVal(extraNum);

  const formatResult = (val) => {
    const str = val.toFixed(3).replace(/\.?0+$/, '');
    return isEn ? str : str.replace('.', ',');
  };

  const sumVal = formatResult(valA + valB);
  const totalSumVal = formatResult(valA + valB + valExtra);
  const diffVal = formatResult(Math.abs(valA - valB));

  const adjustValue = (currentStr, delta) => {
    const current = parseVal(currentStr);
    let updated = Math.max(0, current + delta);
    if (updated > 9999.999) updated = 9999.999;

    const sep = isEn ? '.' : ',';
    const isDec = currentStr.includes(sep);
    const decimals = isDec ? Math.min(3, (currentStr.split(sep)[1] || '').length || 1) : 0;
    return sanitizeInput(updated.toFixed(decimals));
  };

  const formatVerticalNumber = (str) => {
    const sep = isEn ? '.' : ',';
    const clean = isEn ? str.replace(',', '.') : str.replace('.', ',');
    const [intPart = '0', decPart = ''] = clean.split(sep);
    return { intPart, decPart };
  };

  const aParts = formatVerticalNumber(numA);
  const bParts = formatVerticalNumber(numB);
  const maxDecLen = Math.max(aParts.decPart.length, bParts.decPart.length);
  const alignedDecA = aParts.decPart.padEnd(maxDecLen, '0');
  const alignedDecB = bParts.decPart.padEnd(maxDecLen, '0');
  const sep = isEn ? '.' : ',';

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/05-prosthesi-ask"
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
              href="/st-dimotikou/05-prosthesi-ask"
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
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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
                  <p>{t.steps[0].example}</p>
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
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[1].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[1].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[1].title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1.5">
                  <p className="mb-1">{t.steps[1].body}</p>
                  {t.steps[1].properties.map((prop, idx) => (
                    <div key={idx} className="font-mono text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-indigo-800 font-bold">
                      {prop}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>{t.steps[1].example}</p>
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
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[2].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[2].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[2].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[2].body}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>{t.steps[2].example}</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                {t.steps[2].tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΙΔΙΟΤΗΤΩΝ */}
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

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2">
              {t.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNumA(preset.a);
                    setNumB(preset.b);
                    setExtraNum(preset.c);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUTS A, B, C & READOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* INPUTS A, B & C (8 COLS) */}
              <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
                  
                  {/* INPUT A */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-emerald-800 tracking-wider block uppercase">
                        1ος (α):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        {t.limitBadge}
                      </span>
                    </div>
                    
                    <input
                      type="text"
                      inputMode="decimal"
                      value={numA}
                      onChange={(e) => setNumA(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                      placeholder="34,75"
                    />

                    {/* BUTTONS A */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, +0.1))}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumA(adjustValue(numA, +1))}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* INPUT B */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-blue-800 tracking-wider block uppercase">
                        2ος (β):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {t.limitBadge}
                      </span>
                    </div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={numB}
                      onChange={(e) => setNumB(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-700 font-mono"
                      placeholder="18,5"
                    />

                    {/* BUTTONS B */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, +0.1))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setNumB(adjustValue(numB, +1))}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* INPUT C */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-indigo-800 tracking-wider block uppercase">
                        3ος (γ):
                      </label>
                      <span className="text-[10px] sm:text-xs font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
                        {t.limitBadge}
                      </span>
                    </div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={extraNum}
                      onChange={(e) => setExtraNum(sanitizeInput(e.target.value))}
                      className="text-lg sm:text-xl font-black text-center p-2 bg-indigo-50/50 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 outline-none transition-all w-full tracking-wider text-indigo-700 font-mono"
                      placeholder="5,25"
                    />

                    {/* BUTTONS C */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, -1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, -0.1))}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, +0.1))}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[11px] font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋0,1
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtraNum(adjustValue(extraNum, +1))}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95 cursor-pointer"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  {t.inputTip}
                </p>
              </div>

              {/* DYNAMIC RESULT BADGE (4 COLS) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 tracking-wider block uppercase">
                  {t.sumBadge}
                </span>
                
                <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl font-black font-mono flex-wrap">
                  <span className="text-emerald-400">{numA || '0'}</span>
                  <span className="text-amber-400 font-sans">＋</span>
                  <span className="text-cyan-300">{numB || '0'}</span>
                  <span className="text-slate-400 font-sans">＝</span>
                  <span className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-lg shadow-md">
                    {sumVal}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 w-full text-xs text-blue-100 space-y-1">
                  <div>{t.totalThreeLabel} <strong className="text-emerald-400 font-mono text-xs sm:text-sm">{totalSumVal}</strong></div>
                  <div>{t.diffLabel} <strong className="text-amber-300 font-mono text-xs sm:text-sm">{diffVal}</strong></div>
                </div>
              </div>

            </div>

            {/* ROW 2: DYNAMIC VERTICAL ALIGNMENT & PROPERTIES VISUALIZER */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 md:p-6 rounded-2xl space-y-6">
              
              {/* TABS ΙΔΙΟΤΗΤΩΝ */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveProperty('antimetathetiki')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 cursor-pointer ${
                    activeProperty === 'antimetathetiki'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.tabCommutative}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProperty('prosetairistiki')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 cursor-pointer ${
                    activeProperty === 'prosetairistiki'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.tabAssociative}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProperty('antitheti')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 cursor-pointer ${
                    activeProperty === 'antitheti'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.tabInverse}
                </button>
              </div>

              {/* VISUALIZER GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* LEFT: VERTICAL ALIGNMENT BOX (5 COLS) */}
                <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block font-sans">
                    {t.verticalAlignTitle}
                  </span>

                  <div className="font-mono text-xl md:text-2xl font-black text-slate-800 space-y-1 text-right inline-block">
                    <div className="flex justify-end items-center gap-1">
                      <span className="text-emerald-700">{aParts.intPart}</span>
                      {maxDecLen > 0 && <span className="text-amber-500 font-bold">{sep}</span>}
                      {maxDecLen > 0 && <span className="text-emerald-700">{alignedDecA}</span>}
                    </div>

                    <div className="flex justify-end items-center gap-1 border-b-2 border-slate-800 pb-1">
                      <span className="text-slate-400 font-sans mr-2">＋</span>
                      <span className="text-blue-700">{bParts.intPart}</span>
                      {maxDecLen > 0 && <span className="text-amber-500 font-bold">{sep}</span>}
                      {maxDecLen > 0 && <span className="text-blue-700">{alignedDecB}</span>}
                    </div>

                    <div className="text-amber-600 pt-1 font-black">
                      {sumVal}
                    </div>
                  </div>

                  <span className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                    {t.verticalAlignTip}
                  </span>
                </div>

                {/* RIGHT: PROPERTY INTERACTIVE CARD (7 COLS) */}
                <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-center min-h-[220px]">
                  {activeProperty === 'antimetathetiki' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔄</span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">{t.propCommTitle}</h4>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        {t.propCommText}
                      </p>
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm md:text-base font-bold text-center text-slate-800 space-y-2">
                        <div className="text-slate-500 text-xs font-sans">
                          α ＋ β ＝ β ＋ α
                        </div>
                        <div className="break-words">
                          <span className="text-emerald-700">{numA || '0'}</span> ＋ <span className="text-blue-700">{numB || '0'}</span> ＝ <span className="text-blue-700">{numB || '0'}</span> ＋ <span className="text-emerald-700">{numA || '0'}</span> ＝ <strong className="text-amber-600 font-black">{sumVal}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProperty === 'prosetairistiki' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧩</span>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base">{t.propAssocTitle}</h4>
                        </div>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          γ ＝ {extraNum || '0'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        {t.propAssocText} <code className="text-indigo-700 font-bold font-mono">(α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)</code>
                      </p>

                      <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-2">
                        <div className="break-words">
                          ({numA || '0'} ＋ {numB || '0'}) ＋ {extraNum || '0'} ＝ {sumVal} ＋ {extraNum || '0'} ＝ <strong className="text-indigo-600 font-black">{totalSumVal}</strong>
                        </div>
                        <div className="break-words">
                          {numA || '0'} ＋ ({numB || '0'} ＋ {extraNum || '0'}) ＝ {numA || '0'} ＋ {formatResult(valB + valExtra)} ＝ <strong className="text-indigo-600 font-black">{totalSumVal}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProperty === 'antitheti' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">➖</span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">{t.propInvTitle}</h4>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        {t.propInvText}
                      </p>
                      <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm font-bold text-center text-slate-800 space-y-2">
                        <div className="break-words">
                          <span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-blue-700">{numB || '0'}</span> ＝ <strong className="text-emerald-700 font-black">{numA || '0'}</strong> {t.correctTag}
                        </div>
                        <div className="break-words">
                          <span className="text-amber-600 font-black">{sumVal}</span> － <span className="text-emerald-700">{numA || '0'}</span> ＝ <strong className="text-blue-700 font-black">{numB || '0'}</strong> {t.correctTag}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* ROW 3: STEP-BY-STEP CALCULATION RULES */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  {t.goldenRuleTitle}
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  {t.goldenRuleBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
                {t.rules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-black text-blue-800 uppercase tracking-wider block">
                      {rule.title}
                    </span>
                    <p>{rule.desc}</p>
                  </div>
                ))}
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
            href="/st-dimotikou/05-prosthesi-ask"
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