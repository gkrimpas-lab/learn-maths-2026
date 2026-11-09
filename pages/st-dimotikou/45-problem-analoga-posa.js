import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Βοηθητικό component εμφάνισης κατακόρυφου κλάσματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono text-center leading-none ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού βάσει locale (el-GR / en-US)
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  return num.toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

// Λεξικό i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Επίλυση Προβλημάτων με Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης οδηγός μεθόδων επίλυσης προβλημάτων με ανάλογα ποσά: αναγωγή στη μονάδα, αναλογία χιαστί, συντελεστής αναλογίας και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 45 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Επίλυση Προβλημάτων με Ανάλογα Ποσά",
    heroDesc: "Μαθαίνουμε να αναγνωρίζουμε τα ανάλογα ποσά σε καθημερινά προβλήματα και να επιλέγουμε την καταλληλότερη μέθοδο επίλυσης: με αναγωγή στη μονάδα, με αναλογία και σταυρωτά γινόμενα (χιαστί) ή με χρήση του συντελεστή αναλογίας.",
    heroFeature: "Θεωρία & Παράλληλη Σύγκριση των 3 Μεθόδων Επίλυσης",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Οι 3 Στρατηγικές Επίλυσης & τα Κρίσιμα Βήματα",
    theorySubtitle: "Πώς διαβάζουμε το πρόβλημα και πώς επιλέγουμε την ταχύτερη και ασφαλέστερη μέθοδο.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Προετοιμασία",
    step1Title: "Έλεγχος & Μετατροπές",
    step1Text: "Πριν ξεκινήσουμε τις πράξεις, ελέγχουμε αν τα δύο ποσά είναι πραγματικά ανάλογα και μετατρέπουμε τα ομοειδή μεγέθη στην ίδια μονάδα μέτρησης:",
    step1RuleHeader: "Κανόνας επιβεβαίωσης:",
    step1RuleText: "«Αν διπλασιάσω το πρώτο ποσό, διπλασιάζεται και το δεύτερο;» Αν ναι, τότε προχωράμε στην επίλυση.",
    step1Tip: "💡 Αν έχουμε κιλά (kg) και γραμμάρια (g), τα μετατρέπουμε όλα σε g ή όλα σε kg πριν στήσουμε τον υπολογισμό.",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "1η Μέθοδος",
    step2Title: "Αναγωγή στη Μονάδα",
    step2Text: "Βρίσκουμε πρώτα την τιμή που αντιστοιχεί στη 1 μονάδα του πρώτου ποσού και στη συνέχεια πολλαπλασιάζουμε με το ζητούμενο πλήθος:",
    step2Step1: "1ο βήμα: Τιμή του 1 ＝ Αρχικό Κόστος : Αρχική Ποσότητα",
    step2Step2: "2ο βήμα: Ζητούμενο ＝ Τιμή του 1 · Νέα Ποσότητα",
    step2Tip: "⚡ Είναι η πιο διαισθητική μέθοδος όταν η διαίρεση για τη μονάδα δίνει απλό ακέραιο ή δεκαδικό αριθμό.",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "2η Μέθοδος",
    step3Title: "Πίνακας & Χιαστί (Αναλογία)",
    step3Text: "Στήνουμε τα δεδομένα σε πίνακα ποσών και τιμών, θέτουμε τον άγνωστο ως x και εφαρμόζουμε σταυρωτά γινόμενα:",
    step3Formula: "x ＝ (β · γ) : α",
    step3Tip: "🎯 Είναι η πιο ασφαλής μέθοδος, ειδικά όταν η διαίρεση για το 1 δεν είναι τέλεια και προτιμάμε να απλοποιήσουμε.",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "3η Μέθοδος",
    step4Title: "Συντελεστής Αναλογίας (λ)",
    step4Text: "Υπολογίζουμε τον συντελεστή αναλογίας λ ＝ y : x και έπειτα πολλαπλασιάζουμε κάθε νέα τιμή του x με το λ:",
    step4Formula: "y ＝ λ · x",
    step4Note: "Εξαιρετικά χρήσιμη μέθοδος όταν έχουμε να συμπληρώσουμε πολλές διαφορετικές τιμές σε έναν πίνακα.",
    step4Tip: "🚀 Και οι τρεις μέθοδοι οδηγούν πάντοτε στο ίδιο ακριβώς μαθηματικό αποτέλεσμα!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμική Σύγκριση των 3 Μεθόδων Επίλυσης",
    lab1Subtitle: (init, cost, target) => `Παράδειγμα: ${init} τετράδια κοστίζουν ${cost} €. Πόσο κοστίζουν τα ${target} τετράδια; Δείτε πώς λύνεται το πρόβλημα με καθεμία από τις τρεις μεθόδους.`,
    initialItemsLabel: "ΑΡΧΙΚΑ ΤΕΤΡΑΔΙΑ",
    initialCostLabel: "ΑΡΧΙΚΟ ΚΟΣΤΟΣ (€)",
    targetItemsLabel: "ΖΗΤΟΥΜΕΝΑ ΤΕΤΡΑΔΙΑ",
    m1Header: "ΜΕΘΟΔΟΣ 1: ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ",
    m1Step1Label: "1ο Βήμα (Τιμή του 1):",
    m1Step2Label: (target) => `2ο Βήμα (Για τα ${target}):`,
    resultBadge: (cost) => `Αποτέλεσμα: ${cost} €`,
    m2Header: "ΜΕΘΟΔΟΣ 2: ΠΙΝΑΚΑΣ & ΧΙΑΣΤΙ",
    m2ColItems: "Τετράδια",
    m2ColCost: "Κόστος (€)",
    m3Header: "ΜΕΘΟΔΟΣ 3: ΣΥΝΤΕΛΕΣΤΗΣ (λ)",
    m3Step1Label: "Εύρεση λ (y : x):",
    m3Step2Label: "Τύπος (y ＝ λ · x):",
    lab2Badge: "🫒 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Σύνθετο Πρόβλημα: Παραγωγή Ελαιολάδου & Μετατροπή ml σε l",
    lab2Subtitle: (olives, liters, ml) => `Από ${olives} kg ελιές παράγονται ${liters} l λάδι. Πόσα kg ελιές απαιτούνται για να παραχθούν ${ml} ml λάδι;`,
    p2Step1Badge: "1ο ΒΗΜΑ: ΜΕΤΑΤΡΟΠΗ",
    p2Step1Title: "Ίδιες Μονάδες Όγκου",
    p2Step1Desc: "Το αρχικό λάδι δίνεται σε λίτρα (l) και το ζητούμενο σε χιλιοστόλιτρα (ml):",
    p2Step1Footnote: "Διαιρέσαμε με το 1.000 (1 l ＝ 1.000 ml).",
    p2Step2Badge: "2ο ΒΗΜΑ: ΠΙΝΑΚΑΣ ΠΟΣΩΝ",
    p2Step2Title: "Οργάνωση Δεδομένων",
    p2Step2ColOil: "Ελαιόλαδο (l)",
    p2Step2ColOlives: "Ελιές (kg)",
    p2Step2Footnote: "Όλα τα μεγέθη της 1ης στήλης είναι πλέον σε λίτρα (l).",
    p2Step3Badge: "3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ",
    p2Step3Title: "Υπολογισμός με Χιαστί",
    p2Step3Result: (res) => `Απαιτούνται ακριβώς ${res} kg ελιές.`,
    ctaTitle: "Ώρα για Εξάσκηση στα Προβλήματα με Ανάλογα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά ρεαλιστικά προβλήματα, εξασκήσου στην αναγωγή στη μονάδα και τη μέθοδο χιαστί και έλεγξε τις επιδόσεις σου.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Problem Solving with Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete guide on methods for solving problems with proportional quantities: unit rate, cross-multiplication, proportionality constant, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 45 • 6TH GRADE",
    heroTitle: "Problem Solving with Proportional Quantities",
    heroDesc: "Learn to recognize proportional quantities in real-world scenarios and choose the best solution method: unit rate reduction, cross-multiplication table, or the proportionality constant.",
    heroFeature: "Theory & Parallel Comparison of 3 Solution Methods",
    heroCta: "Try the Exercises",
    theoryTitle: "The 3 Solution Strategies & Critical Steps",
    theorySubtitle: "How to interpret problem statements and choose the fastest, most reliable method.",
    step1Badge: "STEP 1",
    step1Sub: "Preparation",
    step1Title: "Verification & Conversions",
    step1Text: "Before beginning calculations, verify that the two quantities are truly proportional and convert like measurements into the exact same unit:",
    step1RuleHeader: "Verification rule:",
    step1RuleText: "'If I double the first quantity, does the second quantity double as well?' If yes, proceed to solve.",
    step1Tip: "💡 If kilograms (kg) and grams (g) appear, convert everything to g or everything to kg before setting up the calculation.",
    step2Badge: "STEP 2",
    step2Sub: "Method 1",
    step2Title: "Unit Rate Reduction",
    step2Text: "First calculate the value corresponding to 1 single unit of the first quantity, then multiply by the target quantity:",
    step2Step1: "Step 1: Unit Rate ＝ Initial Cost : Initial Quantity",
    step2Step2: "Step 2: Target Total ＝ Unit Rate · New Quantity",
    step2Tip: "⚡ This is the most intuitive method when dividing for 1 gives a clean integer or terminating decimal.",
    step3Badge: "STEP 3",
    step3Sub: "Method 2",
    step3Title: "Table & Cross-Multiplication",
    step3Text: "Set up the data in a proportion table, assign x to the unknown, and cross-multiply:",
    step3Formula: "x ＝ (b · c) : a",
    step3Tip: "🎯 This is the safest method, especially when unit division yields awkward decimals and simplifying fractions is easier.",
    step4Badge: "STEP 4",
    step4Sub: "Method 3",
    step4Title: "Proportionality Constant (λ)",
    step4Text: "Calculate the constant of proportionality λ ＝ y : x, then multiply each target value of x by λ:",
    step4Formula: "y ＝ λ · x",
    step4Note: "Exceptionally useful when you need to calculate multiple values across a larger data table.",
    step4Tip: "🚀 All three methods always arrive at the exact same mathematical answer!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Comparison of the 3 Solution Methods",
    lab1Subtitle: (init, cost, target) => `Example: ${init} notebooks cost ${cost} €. How much do ${target} notebooks cost? See how the problem is solved using each of the three methods.`,
    initialItemsLabel: "INITIAL NOTEBOOKS",
    initialCostLabel: "INITIAL COST (€)",
    targetItemsLabel: "TARGET NOTEBOOKS",
    m1Header: "METHOD 1: UNIT RATE",
    m1Step1Label: "Step 1 (Unit Price):",
    m1Step2Label: (target) => `Step 2 (For ${target}):`,
    resultBadge: (cost) => `Result: ${cost} €`,
    m2Header: "METHOD 2: TABLE & CROSS MULTIPLICATION",
    m2ColItems: "Notebooks",
    m2ColCost: "Cost (€)",
    m3Header: "METHOD 3: CONSTANT (λ)",
    m3Step1Label: "Finding λ (y : x):",
    m3Step2Label: "Formula (y ＝ λ · x):",
    lab2Badge: "🫒 INTERACTIVE LAB 2",
    lab2Title: "Multi-Step Problem: Olive Oil Yield & Unit Conversion (ml to l)",
    lab2Subtitle: (olives, liters, ml) => `From ${olives} kg of olives, ${liters} l of oil are produced. How many kg of olives are needed to produce ${ml} ml of oil?`,
    p2Step1Badge: "STEP 1: CONVERSION",
    p2Step1Title: "Matching Volume Units",
    p2Step1Desc: "The initial oil is given in liters (l) and the target in milliliters (ml):",
    p2Step1Footnote: "Divided by 1,000 (1 l ＝ 1,000 ml).",
    p2Step2Badge: "STEP 2: PROPORTION TABLE",
    p2Step2Title: "Organizing the Data",
    p2Step2ColOil: "Olive oil (l)",
    p2Step2ColOlives: "Olives (kg)",
    p2Step2Footnote: "All volume quantities in column 1 are now expressed in liters (l).",
    p2Step3Badge: "STEP 3: SOLVING",
    p2Step3Title: "Cross-Multiplication",
    p2Step3Result: (res) => `Exactly ${res} kg of olives are needed.`,
    ctaTitle: "Time to Practice Proportional Word Problems!",
    ctaDesc: "Test your skills with 10 challenging real-world problems, practice unit rate and cross-multiplication, and review your performance.",
    ctaBtn: "Start Exercises"
  }
};

export default function ProblemAnalogaPosaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Σύγκριση των 3 Μεθόδων Επίλυσης
  const [itemsInitial, setItemsInitial] = useState(4);
  const [costInitial, setCostInitial] = useState(6);
  const [itemsTarget, setItemsTarget] = useState(10);

  // Υπολογισμοί για Εργαστήριο 1
  const unitRate = useMemo(() => {
    return Number((costInitial / itemsInitial).toFixed(2));
  }, [costInitial, itemsInitial]);

  const targetCost = useMemo(() => {
    const raw = (costInitial * itemsTarget) / itemsInitial;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [costInitial, itemsTarget, itemsInitial]);

  // Εργαστήριο 2: Πρόβλημα με Μετατροπές Μονάδων
  const [litersInitial] = useState(3);
  const [olivesKgInitial] = useState(15);
  const [targetMlLiters] = useState(7500);

  const targetLitersClean = targetMlLiters / 1000;
  const targetOlivesKg = useMemo(() => {
    const raw = (olivesKgInitial * targetLitersClean) / litersInitial;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [olivesKgInitial, targetLitersClean, litersInitial]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/45-problem-analoga-posa-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-8 sm:space-y-10 2xl:space-y-14 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
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
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/45-problem-analoga-posa-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">{t.step1RuleHeader}</p>
                  <p className="text-slate-600 leading-relaxed">
                    {t.step1RuleText}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div>{t.step2Step1}</div>
                  <div className="text-amber-900 font-bold">{t.step2Step2}</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="flex items-center justify-center font-bold text-indigo-950">
                    <Fraction num={locale === 'en' ? 'a' : 'α'} den={locale === 'en' ? 'c' : 'γ'} />
                    <span className="mx-2">＝</span>
                    <Fraction num={locale === 'en' ? 'b' : 'β'} den="x" />
                  </div>
                  <div className="font-mono font-bold text-indigo-800 text-sm pt-0.5">
                    {locale === 'en' ? 'x ＝ (b · c) : a' : t.step3Formula}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold text-sm">
                    {t.step4Formula}
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans">
                    {t.step4Note}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΑΡΑΛΛΗΛΗ ΣΥΓΚΡΙΣΗ ΤΩΝ 3 ΜΕΘΟΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.lab1Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Subtitle(itemsInitial, costInitial, itemsTarget)}
              </p>
            </div>
          </div>

          {/* Χειριστήρια Μεταβλητών Προβλήματος */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 2xl:gap-6">
            
            {/* Αρχική Ποσότητα */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.initialItemsLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {itemsInitial}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsInitial((prev) => Math.max(2, prev - 1)); }}
                  disabled={itemsInitial <= 2}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease initial items"
                >
                  －
                </button>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={itemsInitial}
                  onChange={(e) => setItemsInitial(Number(e.target.value))}
                  aria-label="Initial items"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsInitial((prev) => Math.min(8, prev + 1)); }}
                  disabled={itemsInitial >= 8}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase initial items"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αρχικό Κόστος */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                  {t.initialCostLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {costInitial} €
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCostInitial((prev) => Math.max(4, prev - 2)); }}
                  disabled={costInitial <= 4}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease initial cost"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={24}
                  step={2}
                  value={costInitial}
                  onChange={(e) => setCostInitial(Number(e.target.value))}
                  aria-label="Initial cost"
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCostInitial((prev) => Math.min(24, prev + 2)); }}
                  disabled={costInitial >= 24}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase initial cost"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ζητούμενη Ποσότητα */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.targetItemsLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {itemsTarget}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsTarget((prev) => Math.max(3, prev - 1)); }}
                  disabled={itemsTarget <= 3}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease target items"
                >
                  －
                </button>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={itemsTarget}
                  onChange={(e) => setItemsTarget(Number(e.target.value))}
                  aria-label="Target items"
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsTarget((prev) => Math.min(20, prev + 1)); }}
                  disabled={itemsTarget >= 20}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase target items"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* 3 Κάρτες Μεθόδων Επίλυσης */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pt-1">
            
            {/* Μέθοδος 1: Αναγωγή στη Μονάδα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m1Header}
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">{t.m1Step1Label}</span>
                    <div>{costInitial} : {itemsInitial} ＝ <strong>{formatNum(unitRate, 2, locale)} €</strong></div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">{t.m1Step2Label(itemsTarget)}</span>
                    <div>{itemsTarget} · {formatNum(unitRate, 2, locale)} ＝ <strong>{formatNum(targetCost, 2, locale)} €</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center font-bold text-xs text-amber-900">
                {t.resultBadge(formatNum(targetCost, 2, locale))}
              </div>
            </div>

            {/* Μέθοδος 2: Πίνακας & Χιαστί */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m2Header}
                </span>
                <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs text-center space-y-1">
                  <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                    <span>{t.m2ColItems}</span>
                    <span>{t.m2ColCost}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800 text-xs sm:text-sm">
                    <span>{itemsInitial}</span>
                    <span>{costInitial}</span>
                    <span>{itemsTarget}</span>
                    <span className="text-indigo-600 font-black">x</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 text-center leading-relaxed">
                  x ＝ ({costInitial} · {itemsTarget}) : {itemsInitial}<br />
                  x ＝ {costInitial * itemsTarget} : {itemsInitial} ＝ <strong>{formatNum(targetCost, 2, locale)} €</strong>
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center font-bold text-xs text-indigo-900">
                {t.resultBadge(formatNum(targetCost, 2, locale))}
              </div>
            </div>

            {/* Μέθοδος 3: Συντελεστής Αναλογίας */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m3Header}
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">{t.m3Step1Label}</span>
                    <div>λ ＝ {costInitial} : {itemsInitial} ＝ <strong>{formatNum(unitRate, 2, locale)}</strong></div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">{t.m3Step2Label}</span>
                    <div>y ＝ {formatNum(unitRate, 2, locale)} · {itemsTarget} ＝ <strong>{formatNum(targetCost, 2, locale)} €</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center font-bold text-xs text-emerald-900">
                {t.resultBadge(formatNum(targetCost, 2, locale))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕ ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>{t.lab2Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Subtitle(olivesKgInitial, litersInitial, formatNum(targetMlLiters, 0, locale))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Βήμα 1: Μετατροπή */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.p2Step1Badge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.p2Step1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.p2Step1Desc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-center text-xs sm:text-sm">
                {formatNum(targetMlLiters, 0, locale)} ml ＝ {formatNum(targetLitersClean, 2, locale)} l
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step1Footnote}
              </p>
            </div>

            {/* Βήμα 2: Πίνακας */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.p2Step2Badge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.p2Step2Title}
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>{t.p2Step2ColOil}</span>
                  <span>{t.p2Step2ColOlives}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 font-bold text-slate-800">
                  <span>{litersInitial}</span>
                  <span>{olivesKgInitial}</span>
                  <span>{formatNum(targetLitersClean, 2, locale)}</span>
                  <span className="text-emerald-600 font-black">x</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step2Footnote}
              </p>
            </div>

            {/* Βήμα 3: Επίλυση */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.p2Step3Badge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.p2Step3Title}
              </h4>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-center space-y-1 text-emerald-950 font-bold">
                <div>x ＝ ({olivesKgInitial} · {formatNum(targetLitersClean, 2, locale)}) : {litersInitial}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  x ＝ {formatNum(targetOlivesKg, 2, locale)} kg
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step3Result(formatNum(targetOlivesKg, 2, locale))}
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/45-problem-analoga-posa-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}