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
function formatNum(val, decimals = 1, locale = 'el') {
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
    pageTitle: "Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πότε δύο ποσά είναι αντιστρόφως ανάλογα, ποια είναι η ιδιότητα του σταθερού γινομένου και πώς λύνουμε προβλήματα με διαδραστικά εργαστήρια.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 49 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Αντιστρόφως Ανάλογα Ποσά",
    heroDesc: "Ανακαλύπτουμε τα ποσά που συμπεριφέρονται αντίστροφα: Όταν το ένα πολλαπλασιάζεται με έναν αριθμό, το άλλο διαιρείται με τον ίδιο αριθμό. Το μυστικό τους κλειδί είναι το σταθερό γινόμενο (x · y ＝ σταθερό).",
    heroFeature: "Θεωρία, Λυμένα Προβλήματα & Διαδραστικοί Εξομοιωτές",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Αρχές των Αντιστρόφως Αναλόγων Ποσών",
    theorySubtitle: "Πώς τα αναγνωρίζουμε και πώς ξεχωρίζουν από τα ανάλογα ποσά.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Πότε είναι Αντιστρόφως Ανάλογα;",
    step1Text: "Δύο ποσά λέγονται αντιστρόφως ανάλογα όταν, καθώς οι τιμές του ενός πολλαπλασιάζονται με έναν αριθμό, οι αντίστοιχες τιμές του άλλου διαιρούνται με τον ίδιο αριθμό:",
    step1Ex1: "Διπλάσιοι εργάτες → Μισός χρόνος",
    step1Ex2: "Τριπλάσια ταχύτητα → Υποτριπλάσιος χρόνος",
    step1Tip: "💡 Το ένα ποσό αυξάνεται και το άλλο μειώνεται στον ίδιο ακριβώς ρυθμό.",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Η Βασική Ιδιότητα",
    step2Title: "Το Σταθερό Γινόμενο",
    step2Text: "Στα αντιστρόφως ανάλογα ποσά, το γινόμενο των αντίστοιχων τιμών τους παραμένει ΠΑΝΤΟΤΕ ΣΤΑΘΕΡΟ:",
    step2Formula: "x · y ＝ Σταθερό Γινόμενο",
    step2Tip: "⚡ Αν πολλαπλασιάσουμε οποιοδήποτε ζευγάρι αντίστοιχων τιμών, βρίσκουμε πάντα το ίδιο αποτέλεσμα!",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Επίλυση με Εξίσωση",
    step3Title: "Όχι Χιαστί Πολλαπλασιασμός!",
    step3Text: "Στα αντιστρόφως ανάλογα ποσά ΔΕΝ κάνουμε χιαστί γινόμενα. Εξισώνουμε τα οριζόντια γινόμενα:",
    step3FormulaMain: "x₁ · y₁ ＝ x₂ · y₂",
    step3FormulaDerived: "x ＝ (x₁ · y₁) : x₂",
    step3Tip: "🎯 Πολλαπλασιάζουμε το γνωστό ζευγάρι και διαιρούμε με τον τρίτο αριθμό.",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Αναγωγή στη Μονάδα",
    step4Title: "Αναγωγή στη Μονάδα",
    step4Text: "Βρίσκουμε πρώτα τι θα έκανε η 1 μονάδα (π.χ. ο 1 εργάτης) πολλαπλασιάζοντας:",
    step4CalcSample: "4 εργάτες → 6 ημέρες (4 · 6 ＝ 24)",
    step4CalcExplain: "Ο 1 εργάτης θα χρειαζόταν 24 ημέρες. Οι 8 εργάτες θα χρειαστούν: 24 : 8 ＝ 3 ημέρες.",
    step4Tip: "🚀 Απλή λογική χωρίς αποστήθιση τύπων.",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Εξομοιωτής Εργατών & Ημερών (Έργο 24 Εργατοημερών)",
    lab1Subtitle: "Αλλάξτε τον αριθμό των εργατών και παρατηρήστε πώς μειώνονται οι ημέρες ώστε το γινόμενο να μένει πάντα ίσο με 24.",
    lab1WorkersLabel: "ΑΡΙΘΜΟΣ ΕΡΓΑΤΩΝ:",
    lab1WorkerUnitSingle: "εργάτης",
    lab1WorkerUnitPlural: "εργάτες",
    lab1ConstantNote: (w, d) => `Σταθερό έργο: ${w} · ${d} ＝ 24 εργατοημέρες.`,
    lab1TableHeader: "ΠΙΝΑΚΑΣ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ",
    lab1ColWorkers: "Εργάτες (x)",
    lab1ColDays: "Ημέρες (y)",
    lab1ProductNote: (w, d) => `Γινόμενο: ${w} · ${d} ＝ 24 (Σταθερό)`,
    lab1StatWorkers: "ΕΡΓΑΤΕΣ",
    lab1StatDays: "ΗΜΕΡΕΣ ΠΟΥ ΑΠΑΙΤΟΥΝΤΑΙ",
    lab2Badge: "⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΧΥΤΗΤΑ & ΧΡΟΝΟΣ",
    lab2Title: "Ταξίδι Απόστασης 120 km",
    lab2Subtitle: "Όσο αυξάνεται η μέση ταχύτητα του οχήματος, τόσο λιγότερος χρόνος απαιτείται για να καλυφθεί η ίδια απόσταση (120 km):",
    lab2SpeedLabel: "ΤΑΧΥΤΗΤΑ ΟΧΗΜΑΤΟΣ (km/h):",
    lab2TravelTimeHeader: "ΧΡΟΝΟΣ ΤΑΞΙΔΙΟΥ",
    lab2HourSingle: "ώρα",
    lab2HourPlural: "ώρες",
    lab2ProductNote: (s, t) => `Γινόμενο: ${s} km/h · ${t} h ＝ 120 km (Σταθερή Απόσταση)`,
    examplesTitle: "Λυμένα Προβλήματα με Αντιστρόφως Ανάλογα Ποσά",
    examplesSubtitle: "Δύο ολοκληρωμένα παραδείγματα καθημερινής ζωής με αναλυτική παρουσίαση της μεθοδολογίας.",
    ex1Badge: "ΠΡΟΒΛΗΜΑ 1: ΕΡΓΑΤΕΣ ΚΑΙ ΧΡΟΝΟΣ",
    ex1Tag: "Κατασκευή",
    ex1Title: "Ελαιοχρωματισμός Κτιρίου",
    ex1Prompt: "Ένα συνεργείο 6 ελαιοχρωματιστών βάφει ένα σχολείο σε 8 ημέρες. Πόσες ημέρες θα χρειάζονταν 12 ελαιοχρωματιστές με τον ίδιο ρυθμό εργασίας;",
    ex1Step1Header: "1ο Βήμα: Έλεγχος των ποσών",
    ex1Step1Text: "Διπλάσιοι εργάτες → Μισές ημέρες. Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο).",
    ex1Step2Header: "2ο Βήμα: Υπολογισμός με σταθερό γινόμενο",
    ex1Step2Calc: "6 · 8 ＝ 12 · x → 48 ＝ 12 · x → x ＝ 48 : 12 ＝ 4 ημέρες",
    ex1Result: "✓ Οι 12 εργάτες θα χρειαστούν ακριβώς 4 ημέρες.",
    ex2Badge: "ΠΡΟΒΛΗΜΑ 2: ΒΡΥΣΕΣ ΚΑΙ ΧΡΟΝΟΣ",
    ex2Tag: "Δεξαμενή",
    ex2Title: "Γέμισμα Δεξαμενής με Βρύσες",
    ex2Prompt: "3 ίδιες βρύσες γεμίζουν μια δεξαμενή σε 6 ώρες. Αν ανοίξουμε 9 ίδιες βρύσες, σε πόσες ώρες θα γεμίσει η δεξαμενή;",
    ex2Step1Header: "1ο Βήμα: Σταθερό γινόμενο βρυσών και ωρών",
    ex2Step1Calc: "3 · 6 ＝ 18 (σταθερό γινόμενο)",
    ex2Step2Header: "2ο Βήμα: Υπολογισμός για 9 βρύσες",
    ex2Step2Calc: "x ＝ 18 : 9 ＝ 2 ώρες",
    ex2Result: "✓ Οι 9 βρύσες (τριπλάσιες) γεμίζουν τη δεξαμενή στον ένα τρίτο του χρόνου (2 ώρες).",
    ctaTitle: "Ώρα για Εξάσκηση στα Αντιστρόφως Ανάλογα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με σταθερά γινόμενα, εργάτες, βρύσες, ταχύτητες και αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Inversely Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn when two quantities are inversely proportional, the constant product property, and how to solve problems with interactive labs.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 49 • 6TH GRADE",
    heroTitle: "Inversely Proportional Quantities",
    heroDesc: "Discover quantities that vary inversely: When one is multiplied by a number, the other is divided by the exact same number. Their secret key is the constant product (x · y ＝ constant).",
    heroFeature: "Theory, Solved Problems & Interactive Simulators",
    heroCta: "Try the Exercises",
    theoryTitle: "Fundamental Principles of Inversely Proportional Quantities",
    theorySubtitle: "How to identify them and distinguish them from directly proportional quantities.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "When are Quantities Inversely Proportional?",
    step1Text: "Two quantities are called inversely proportional when multiplying the values of one by a number causes the corresponding values of the other to be divided by that exact same number:",
    step1Ex1: "Double the workers → Half the time",
    step1Ex2: "Triple the speed → One third the time",
    step1Tip: "💡 One quantity increases while the other decreases at the exact same rate.",
    step2Badge: "STEP 2",
    step2Sub: "Key Property",
    step2Title: "The Constant Product",
    step2Text: "In inversely proportional quantities, the product of corresponding paired values is ALWAYS CONSTANT:",
    step2Formula: "x · y ＝ Constant Product",
    step2Tip: "⚡ Multiplying any pair of corresponding values always gives the exact same result!",
    step3Badge: "STEP 3",
    step3Sub: "Equation Solving",
    step3Title: "Never Cross-Multiply!",
    step3Text: "In inversely proportional quantities we NEVER cross-multiply. We equate horizontal products:",
    step3FormulaMain: "x₁ · y₁ ＝ x₂ · y₂",
    step3FormulaDerived: "x ＝ (x₁ · y₁) : x₂",
    step3Tip: "🎯 Multiply the known pair and divide by the third number.",
    step4Badge: "STEP 4",
    step4Sub: "Unit Rate",
    step4Title: "Unit Rate Reduction",
    step4Text: "First calculate what 1 single unit would do (e.g. 1 worker) by multiplying:",
    step4CalcSample: "4 workers → 6 days (4 · 6 ＝ 24)",
    step4CalcExplain: "1 worker would need 24 days. 8 workers will need: 24 : 8 ＝ 3 days.",
    step4Tip: "🚀 Simple logic without memorizing confusing formulas.",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Workers & Days Simulator (24 Man-Day Workload)",
    lab1Subtitle: "Change the number of workers and observe how required days decrease so the product always equals 24.",
    lab1WorkersLabel: "WORKER COUNT:",
    lab1WorkerUnitSingle: "worker",
    lab1WorkerUnitPlural: "workers",
    lab1ConstantNote: (w, d) => `Constant workload: ${w} · ${d} ＝ 24 man-days.`,
    lab1TableHeader: "INVERSE PROPORTION TABLE",
    lab1ColWorkers: "Workers (x)",
    lab1ColDays: "Days (y)",
    lab1ProductNote: (w, d) => `Product: ${w} · ${d} ＝ 24 (Constant)`,
    lab1StatWorkers: "WORKERS",
    lab1StatDays: "REQUIRED DAYS",
    lab2Badge: "⚡ INTERACTIVE LAB 2: SPEED & TIME",
    lab2Title: "120 km Distance Trip",
    lab2Subtitle: "As vehicle speed increases, less travel time is required to cover the same distance (120 km):",
    lab2SpeedLabel: "VEHICLE SPEED (km/h):",
    lab2TravelTimeHeader: "TRAVEL TIME",
    lab2HourSingle: "hour",
    lab2HourPlural: "hours",
    lab2ProductNote: (s, t) => `Product: ${s} km/h · ${t} h ＝ 120 km (Constant Distance)`,
    examplesTitle: "Solved Word Problems with Inversely Proportional Quantities",
    examplesSubtitle: "Two complete real-world examples with step-by-step methodology breakdowns.",
    ex1Badge: "PROBLEM 1: WORKERS AND TIME",
    ex1Tag: "Construction",
    ex1Title: "Painting a School Building",
    ex1Prompt: "A crew of 6 painters paints a school in 8 days. How many days would 12 painters need working at the same rate?",
    ex1Step1Header: "Step 1: Check the quantities",
    ex1Step1Text: "Double the workers → Half the days. The quantities are inversely proportional (constant product).",
    ex1Step2Header: "Step 2: Calculate using constant product",
    ex1Step2Calc: "6 · 8 ＝ 12 · x → 48 ＝ 12 · x → x ＝ 48 : 12 ＝ 4 days",
    ex1Result: "✓ 12 workers will need exactly 4 days.",
    ex2Badge: "PROBLEM 2: WATER TAPS AND TIME",
    ex2Tag: "Reservoir",
    ex2Title: "Filling a Water Tank",
    ex2Prompt: "3 identical water taps fill a reservoir in 6 hours. If we open 9 identical taps, in how many hours will the reservoir be filled?",
    ex2Step1Header: "Step 1: Constant product of taps and hours",
    ex2Step1Calc: "3 · 6 ＝ 18 (constant product)",
    ex2Step2Header: "Step 2: Calculate for 9 taps",
    ex2Step2Calc: "x ＝ 18 : 9 ＝ 2 hours",
    ex2Result: "✓ 9 taps (triple) fill the tank in one third of the time (2 hours).",
    ctaTitle: "Time to Practice Inversely Proportional Quantities!",
    ctaDesc: "Challenge yourself with 10 interactive questions on constant products, workers, taps, speeds, and unit rate reduction for 6th Grade.",
    ctaBtn: "Start Exercises"
  }
};

export default function AntistrofosAnalogaPosaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Εξομοιωτής Εργατών & Ημερών (Σταθερό Έργο = 24)
  const totalWorkUnits = 24;
  const [workers, setWorkers] = useState(4);

  const daysNeeded = useMemo(() => {
    return Number((totalWorkUnits / workers).toFixed(1));
  }, [workers, totalWorkUnits]);

  // Εργαστήριο 2: Ταχύτητα & Χρόνος Ταξιδιού (Απόσταση 120 km)
  const [speed, setSpeed] = useState(60);
  const travelTime = useMemo(() => {
    return Number((120 / speed).toFixed(1));
  }, [speed]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
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
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
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

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div>{t.step1Ex1}</div>
                  <div>{t.step1Ex2}</div>
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

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-bold text-amber-950">
                    {t.step2Formula}
                  </div>
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

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="text-slate-800 font-bold">
                    {t.step3FormulaMain}
                  </div>
                  <div className="text-indigo-700 font-black">
                    {t.step3FormulaDerived}
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

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    {t.step4CalcSample}
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    {t.step4CalcExplain}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΕΡΓΑΤΩΝ ΚΑΙ ΗΜΕΡΩΝ */}
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
                {t.lab1Subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήριο Slider Εργατών */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    {t.lab1WorkersLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {workers} {workers === 1 ? t.lab1WorkerUnitSingle : t.lab1WorkerUnitPlural}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.max(1, prev - 1)); }}
                    disabled={workers <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease workers"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={workers}
                    onChange={(e) => setWorkers(Number(e.target.value))}
                    aria-label="Workers"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.min(12, prev + 1)); }}
                    disabled={workers >= 12}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase workers"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((w) => (
                  <button
                    key={`w-btn-${w}`}
                    type="button"
                    onClick={() => setWorkers(w)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {w} {w === 1 ? t.lab1WorkerUnitSingle : t.lab1WorkerUnitPlural}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed text-center">
                {t.lab1ConstantNote(workers, <strong key="days-val">{formatNum(daysNeeded, 1, locale)}</strong>)}
              </div>
            </div>

            {/* Πίνακας & Αποτέλεσμα */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab1TableHeader}
              </div>

              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-4 space-y-2.5 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">{t.lab1ColWorkers}</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900 truncate">{t.lab1ColDays}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">{workers}</div>
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-800 border border-emerald-300">
                    {formatNum(daysNeeded, 1, locale)}
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  {t.lab1ProductNote(workers, formatNum(daysNeeded, 1, locale))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {t.lab1StatWorkers}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-blue-700">
                    {workers}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    {t.lab1StatDays}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(daysNeeded, 1, locale)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΧΥΤΗΤΑ & ΧΡΟΝΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t.lab2SpeedLabel}</span>
                  <span className="font-mono text-sm sm:text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-black">
                    {speed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={120}
                  step={10}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  aria-label="Speed"
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[40, 60, 80, 120].map((s) => (
                  <button
                    key={`sp-${s}`}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {s} km/h
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 sm:p-6 rounded-3xl border border-emerald-200 text-center space-y-2">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                {t.lab2TravelTimeHeader}
              </span>
              <div className="font-mono font-black text-2xl sm:text-4xl text-emerald-700">
                {formatNum(travelTime, 1, locale)} {travelTime === 1 ? t.lab2HourSingle : t.lab2HourPlural}
              </div>
              <p className="text-xs text-slate-600 font-mono">
                {t.lab2ProductNote(speed, formatNum(travelTime, 1, locale))}
              </p>
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.examplesTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.examplesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παράδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.ex1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.ex1Tag}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.ex1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.ex1Prompt}
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.ex1Step1Header}</span>
                  <div className="font-sans text-xs">{t.ex1Step1Text}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.ex1Step2Header}</span>
                  <div>{t.ex1Step2Calc}</div>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                {t.ex1Result}
              </div>
            </article>

            {/* Παράδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.ex2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.ex2Tag}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.ex2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.ex2Prompt}
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.ex2Step1Header}</span>
                  <div>{t.ex2Step1Calc}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.ex2Step2Header}</span>
                  <div>{t.ex2Step2Calc}</div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                {t.ex2Result}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
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