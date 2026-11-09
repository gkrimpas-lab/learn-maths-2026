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
    pageTitle: "Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς να επιλύουμε προβλήματα με αντιστρόφως ανάλογα ποσά με τη μέθοδο της αναγωγής στη μονάδα και με οριζόντια γινόμενα στον πίνακα τιμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 47 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά",
    heroDesc: "Εξετάζουμε πώς αναγνωρίζουμε τα αντιστρόφως ανάλογα ποσά σε ένα πρόβλημα, αποφεύγουμε τη συχνή παγίδα του χιαστί και επιλύουμε κάθε άγνωστο όρο είτε με αναγωγή στη μονάδα είτε με οριζόντια γινόμενα στον πίνακα ποσών.",
    heroFeature: "Θεωρία & Δυναμική Σύγκριση Μεθόδων Επίλυσης",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Στρατηγική Επίλυσης σε 4 Βήματα",
    theorySubtitle: "Πώς εξασφαλίζουμε ότι δεν θα μπερδέψουμε τα αντιστρόφως ανάλογα ποσά με τα ανάλογα.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Αναγνώριση",
    step1Title: "Έλεγχος Αντιστροφής",
    step1Text: "Πριν κάνουμε πράξεις, ρωτάμε λογικά: «Αν διπλασιάσω το πρώτο ποσό, θα υποδιπλασιαστεί (θα γίνει μισό) το δεύτερο ποσό;»",
    step1ExamplesHeader: "Κλασικά παραδείγματα:",
    step1Ex1: "Περισσότεροι εργάτες → Λιγότερος χρόνος",
    step1Ex2: "Μεγαλύτερη ταχύτητα → Λιγότερες ώρες ταξιδιού",
    step1Ex3: "Περισσότερες βρύσες → Λιγότερα λεπτά γεμίσματος",
    step1Tip: "💡 Αν η αύξηση του ενός ποσού οδηγεί σε μείωση με τον ίδιο ακριβώς ρυθμό, το πρόβλημα λύνεται με αντιστρόφως ανάλογα ποσά!",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "1η Μέθοδος",
    step2Title: "Αναγωγή στη Μονάδα",
    step2Text: "Υπολογίζουμε πόσο χρόνο θα χρειαζόταν 1 μόνο εργάτης (ή 1 βρύση). Επειδή ο 1 εργάτης χρειάζεται περισσότερο χρόνο, πολλαπλασιάζουμε:",
    step2Step1: "1ο βήμα (Ο 1 εργάτης): Αρχικοί Εργάτες · Ημέρες",
    step2Step2: "2ο βήμα (Οι νέοι εργάτες): Συνολικός Χρόνος : Νέοι Εργάτες",
    step2Tip: "⚡ Προσοχή στη διαφορά: Στα ανάλογα ποσά για το 1 κάναμε διαίρεση, ενώ στα αντιστρόφως ανάλογα κάνουμε πολλαπλασιασμό!",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "2η Μέθοδος",
    step3Title: "Πίνακας & Οριζόντια Γινόμενα",
    step3Text: "Τοποθετούμε τα ποσά στον πίνακα. Επειδή το γινόμενο των αντίστοιχων τιμών είναι σταθερό, πολλαπλασιάζουμε οριζόντια και όχι διαγώνια:",
    step3FormulaMain: "x₁ · y₁ ＝ x₂ · y₂",
    step3FormulaDerived: "x₂ ＝ (x₁ · y₁) : y₂",
    step3Tip: "🎯 ΜΕΓΑΛΗ ΠΑΓΙΔΑ: Στα αντιστρόφως ανάλογα ποσά ΠΟΤΕ δεν κάνουμε χιαστί! Κάνουμε οριζόντιο πολλαπλασιασμό!",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Έλεγχος Λογικής",
    step4Title: "Έλεγχος Αποτελέσματος",
    step4Text: "Μόλις βρούμε το αποτέλεσμα, ελέγχουμε αν έχει λογικό νόημα:",
    step4Box: "Αν οι εργάτες αυξήθηκαν, οι ημέρες που υπολογίσαμε πρέπει υποχρεωτικά να είναι λιγότερες από τις αρχικές!",
    step4Note: "Αν βρούμε περισσότερες ημέρες για περισσότερους εργάτες, έχουμε κάνει λάθος και εφαρμόσαμε μέθοδο ανάλογων ποσών.",
    step4Tip: "🚀 Ο έλεγχος λογικής αποτρέπει το 100% των συνηθισμένων λαθών στις εξετάσεις!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Παράλληλη Επίλυση Προβλήματος Εργασίας",
    lab1Subtitle: (w1, d1, w2) => `Παράδειγμα: ${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το έργο ${w2} εργάτες;`,
    lab1InitialWorkersLabel: "ΑΡΧΙΚΟΙ ΕΡΓΑΤΕΣ",
    lab1InitialDaysLabel: "ΑΡΧΙΚΕΣ ΗΜΕΡΕΣ",
    lab1NewWorkersLabel: "ΝΕΟΙ ΕΡΓΑΤΕΣ",
    m1Header: "1η ΜΕΘΟΔΟΣ: ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ",
    m1Step1Title: "1ο Βήμα: Πόσες ημέρες θέλει ο 1 εργάτης;",
    m1Step1Calc: (w1, d1, total) => `${w1} · ${d1} ＝ ${total} μεροκάματα`,
    m1Step1Note: "Πολλαπλασιάζουμε γιατί ο ένας θα κάνει περισσότερο χρόνο!",
    m1Step2Title: (w2) => `2ο Βήμα: Πόσες ημέρες θέλουν οι ${w2} εργάτες;`,
    m1Step2Calc: (total, w2, res) => `${total} : ${w2} ＝ ${res} ημέρες`,
    m1ResultBadge: (res) => `Τελικό Αποτέλεσμα: ${res} ημέρες`,
    m2Header: "2η ΜΕΘΟΔΟΣ: ΠΙΝΑΚΑΣ & ΟΡΙΖΟΝΤΙΑ ΓΙΝΟΜΕΝΑ",
    m2ColWorkers: "Εργάτες (x)",
    m2ColDays: "Ημέρες (y)",
    m2FormulaProduct: (w1, d1, w2) => `Σταθερό γινόμενο: ${w1} · ${d1} ＝ ${w2} · x`,
    m2FormulaSolve: (w1, d1, w2, total, res) => `x ＝ (${w1} · ${d1}) : ${w2} ＝ ${total} : ${w2} ＝ ${res} ημέρες`,
    lab2Badge: "🚗 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Σύνθετο Πρόβλημα Ταχύτητας & Μετατροπή σε Λεπτά",
    lab2Subtitle: (s1, h, m, s2) => `Ένα όχημα με ταχύτητα ${s1} km/h καλύπτει μια διαδρομή σε ${h} ώρες και ${m} λεπτά. Πόσο χρόνο θα χρειαστεί αν τρέχει με ${s2} km/h;`,
    p2Step1Badge: "1ο ΒΗΜΑ: ΜΕΤΑΤΡΟΠΗ",
    p2Step1Title: "Όλα σε Λεπτά (min)",
    p2Step1Desc: "Επειδή ο χρόνος έχει ώρες και λεπτά, μετατρέπουμε τα πάντα σε ενιαία μονάδα:",
    p2Step1Calc: (h, m, tot) => `${h} h ${m} min ＝ (${h} · 60) ＋ ${m} ＝ ${tot} λεπτά`,
    p2Step1Footnote: "Έτσι αποφεύγουμε δύσκολους δεκαδικούς αριθμούς.",
    p2Step2Badge: "2ο ΒΗΜΑ: ΠΙΝΑΚΑΣ",
    p2Step2Title: "Οργάνωση Αντιστρόφων",
    p2Step2ColSpeed: "Ταχύτητα (km/h)",
    p2Step2ColTime: "Χρόνος (min)",
    p2Step2Footnote: "Μεγαλύτερη ταχύτητα σημαίνει υποχρεωτικά λιγότερος χρόνος!",
    p2Step3Badge: "3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ",
    p2Step3Title: "Οριζόντιος Υπολογισμός",
    p2Step3Calc1: (s1, tot, s2) => `x ＝ (${s1} · ${tot}) : ${s2}`,
    p2Step3Calc2: (s1, tot, s2, resMin) => `x ＝ ${s1 * tot} : ${s2} ＝ ${resMin} λεπτά`,
    p2Step3FinalHours: (resH) => `x ＝ ${resH} ώρες`,
    p2Step3Footnote: "Διαιρώντας τα λεπτά με το 60 βρίσκουμε τις ακριβείς ώρες.",
    ctaTitle: "Ώρα για Εξάσκηση στα Προβλήματα με Αντιστρόφως Ανάλογα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά ρεαλιστικά προβλήματα, εξασκήσου στην αναγωγή στη μονάδα και στα οριζόντια γινόμενα και έλεγξε τις επιδόσεις σου.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Solving Inversely Proportional Problems - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to solve inversely proportional word problems using unit rate and horizontal products in proportion tables for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 47 • 6TH GRADE",
    heroTitle: "Solving Inversely Proportional Word Problems",
    heroDesc: "Learn how to identify inversely proportional quantities in word problems, avoid the common cross-multiplication trap, and solve for any unknown using unit rate reduction or horizontal products in proportion tables.",
    heroFeature: "Theory & Dynamic Comparison of Solution Methods",
    heroCta: "Try the Exercises",
    theoryTitle: "4-Step Solution Strategy",
    theorySubtitle: "How to ensure you never confuse inversely proportional quantities with direct proportion.",
    step1Badge: "STEP 1",
    step1Sub: "Identification",
    step1Title: "Inverse Variation Check",
    step1Text: "Before computing, ask logically: 'If I double the first quantity, will the second quantity be halved?'",
    step1ExamplesHeader: "Classic examples:",
    step1Ex1: "More workers → Less completion time",
    step1Ex2: "Higher speed → Fewer travel hours",
    step1Ex3: "More water taps → Fewer filling minutes",
    step1Tip: "💡 If increasing one quantity causes the other to decrease at the exact same rate, solve it as inversely proportional!",
    step2Badge: "STEP 2",
    step2Sub: "Method 1",
    step2Title: "Unit Rate Reduction",
    step2Text: "Calculate how long it would take 1 single worker (or 1 tap). Because 1 worker requires more time, multiply:",
    step2Step1: "Step 1 (For 1 worker): Initial Workers · Days",
    step2Step2: "Step 2 (For target workers): Total Workload : Target Workers",
    step2Tip: "⚡ Note the difference: In directly proportional quantities we divide to find 1, but in inverse proportion we multiply!",
    step3Badge: "STEP 3",
    step3Sub: "Method 2",
    step3Title: "Table & Horizontal Products",
    step3Text: "Place values in a proportion table. Because the product of paired values is constant, multiply horizontally, NOT diagonally:",
    step3FormulaMain: "x₁ · y₁ ＝ x₂ · y₂",
    step3FormulaDerived: "x₂ ＝ (x₁ · y₁) : y₂",
    step3Tip: "🎯 COMMON TRAP: Never cross-multiply in inversely proportional problems! Always multiply horizontally!",
    step4Badge: "STEP 4",
    step4Sub: "Reasonableness Check",
    step4Title: "Sanity Check of Result",
    step4Text: "Once you obtain the answer, verify that it makes logical sense:",
    step4Box: "If the number of workers increased, the calculated days must be strictly fewer than the original days!",
    step4Note: "If more workers take more days, an error occurred because direct proportion was used incorrectly.",
    step4Tip: "🚀 Performing a sanity check eliminates virtually all careless exam errors!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Parallel Solution of a Labor Problem",
    lab1Subtitle: (w1, d1, w2) => `Example: ${w1} workers complete a project in ${d1} days. In how many days will ${w2} workers finish?`,
    lab1InitialWorkersLabel: "INITIAL WORKERS",
    lab1InitialDaysLabel: "INITIAL DAYS",
    lab1NewWorkersLabel: "TARGET WORKERS",
    m1Header: "METHOD 1: UNIT RATE REDUCTION",
    m1Step1Title: "Step 1: How many days would 1 worker take?",
    m1Step1Calc: (w1, d1, total) => `${w1} · ${d1} ＝ ${total} man-days`,
    m1Step1Note: "Multiply because 1 worker takes more time!",
    m1Step2Title: (w2) => `Step 2: How many days will ${w2} workers take?`,
    m1Step2Calc: (total, w2, res) => `${total} : ${w2} ＝ ${res} days`,
    m1ResultBadge: (res) => `Final Result: ${res} days`,
    m2Header: "METHOD 2: TABLE & HORIZONTAL PRODUCTS",
    m2ColWorkers: "Workers (x)",
    m2ColDays: "Days (y)",
    m2FormulaProduct: (w1, d1, w2) => `Constant product: ${w1} · ${d1} ＝ ${w2} · x`,
    m2FormulaSolve: (w1, d1, w2, total, res) => `x ＝ (${w1} · ${d1}) : ${w2} ＝ ${total} : ${w2} ＝ ${res} days`,
    lab2Badge: "🚗 INTERACTIVE LAB 2",
    lab2Title: "Multi-Step Speed Problem & Minute Conversion",
    lab2Subtitle: (s1, h, m, s2) => `A vehicle traveling at ${s1} km/h covers a route in ${h} hours and ${m} minutes. How long will it take at ${s2} km/h?`,
    p2Step1Badge: "STEP 1: CONVERSION",
    p2Step1Title: "Convert Everything to Minutes",
    p2Step1Desc: "Because time has mixed units (hours and minutes), convert to a single unified unit:",
    p2Step1Calc: (h, m, tot) => `${h} h ${m} min ＝ (${h} · 60) ＋ ${m} ＝ ${tot} minutes`,
    p2Step1Footnote: "This eliminates cumbersome fractions or repeating decimals.",
    p2Step2Badge: "STEP 2: TABLE",
    p2Step2Title: "Inverse Table Setup",
    p2Step2ColSpeed: "Speed (km/h)",
    p2Step2ColTime: "Time (min)",
    p2Step2Footnote: "Higher speed strictly requires less travel time!",
    p2Step3Badge: "STEP 3: SOLVING",
    p2Step3Title: "Horizontal Calculation",
    p2Step3Calc1: (s1, tot, s2) => `x ＝ (${s1} · ${tot}) : ${s2}`,
    p2Step3Calc2: (s1, tot, s2, resMin) => `x ＝ ${s1 * tot} : ${s2} ＝ ${resMin} minutes`,
    p2Step3FinalHours: (resH) => `x ＝ ${resH} hours`,
    p2Step3Footnote: "Dividing total minutes by 60 gives exact hours.",
    ctaTitle: "Time to Practice Inversely Proportional Problems!",
    ctaDesc: "Test your skills with 10 challenging real-world problems, master unit rate reduction and horizontal products, and check your score.",
    ctaBtn: "Start Exercises"
  }
};

export default function ProblemAntistrofosAnalogaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Εργάτες & Χρόνος Έργου
  const [workers1, setWorkers1] = useState(4);
  const [days1, setDays1] = useState(12);
  const [workers2, setWorkers2] = useState(6);

  // Υπολογισμοί για Εργαστήριο 1
  const totalWork = useMemo(() => {
    return workers1 * days1;
  }, [workers1, days1]);

  const targetDays = useMemo(() => {
    const raw = totalWork / workers2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [totalWork, workers2]);

  // Εργαστήριο 2: Ταχύτητα, Χρόνος & Μετατροπές Μονάδων
  const [speed1, setSpeed1] = useState(60);
  const [hoursInput, setHoursInput] = useState(2);
  const [minutesInput, setMinutesInput] = useState(30);
  const [speed2, setSpeed2] = useState(100);

  const totalMinutes1 = hoursInput * 60 + minutesInput;
  const targetMinutes = useMemo(() => {
    const raw = (speed1 * totalMinutes1) / speed2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [speed1, totalMinutes1, speed2]);

  const targetHoursClean = formatNum(targetMinutes / 60, 2, locale);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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
              href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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
                  <p className="text-slate-700 font-semibold">{t.step1ExamplesHeader}</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>{t.step1Ex1}</li>
                    <li>{t.step1Ex2}</li>
                    <li>{t.step1Ex3}</li>
                  </ul>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center font-mono">
                  <div className="text-slate-700">{t.step3FormulaMain}</div>
                  <div className="font-bold text-indigo-900 text-sm pt-0.5">
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

                <div className="space-y-1.5 text-[11px] sm:text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold">
                    {t.step4Box}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-0.5">
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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΑΡΑΛΛΗΛΗ ΣΥΓΚΡΙΣΗ ΤΩΝ 2 ΜΕΘΟΔΩΝ */}
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
                {t.lab1Subtitle(workers1, days1, workers2)}
              </p>
            </div>
          </div>

          {/* Χειριστήρια Μεταβλητών */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 2xl:gap-6">
            
            {/* Αρχικοί Εργάτες */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.lab1InitialWorkersLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {workers1}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers1((prev) => Math.max(1, prev - 1)); }}
                  disabled={workers1 <= 1}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease initial workers"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={workers1}
                  onChange={(e) => setWorkers1(Number(e.target.value))}
                  aria-label="Initial workers"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers1((prev) => Math.min(8, prev + 1)); }}
                  disabled={workers1 >= 8}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase initial workers"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αρχικές Ημέρες */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.lab1InitialDaysLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {days1}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDays1((prev) => Math.max(4, prev - 2)); }}
                  disabled={days1 <= 4}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease initial days"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={24}
                  step={2}
                  value={days1}
                  onChange={(e) => setDays1(Number(e.target.value))}
                  aria-label="Initial days"
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDays1((prev) => Math.min(24, prev + 2)); }}
                  disabled={days1 >= 24}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase initial days"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Νέοι Εργάτες */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                  {t.lab1NewWorkersLabel}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {workers2}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers2((prev) => Math.max(1, prev - 1)); }}
                  disabled={workers2 <= 1}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease new workers"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={workers2}
                  onChange={(e) => setWorkers2(Number(e.target.value))}
                  aria-label="New workers"
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers2((prev) => Math.min(16, prev + 1)); }}
                  disabled={workers2 >= 16}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase new workers"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Παράλληλη Επίλυση: 2 Μέθοδοι */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-1">
            
            {/* 1η Μέθοδος: Αναγωγή στη Μονάδα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m1Header}
                </span>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px] sm:text-xs">{t.m1Step1Title}</span>
                    <div>{t.m1Step1Calc(workers1, days1, <strong className="text-amber-900">{totalWork}</strong>)}</div>
                    <span className="text-[10.5px] text-slate-400 font-sans block">{t.m1Step1Note}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px] sm:text-xs">{t.m1Step2Title(workers2)}</span>
                    <div>{t.m1Step2Calc(totalWork, workers2, <strong className="text-emerald-700">{formatNum(targetDays, 1, locale)}</strong>)}</div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-center font-bold text-xs sm:text-sm text-amber-950">
                {t.m1ResultBadge(formatNum(targetDays, 1, locale))}
              </div>
            </div>

            {/* 2η Μέθοδος: Πίνακας & Οριζόντια Γινόμενα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m2Header}
                </span>
                <div className="bg-white rounded-xl border border-slate-200 p-2.5 font-mono text-xs text-center space-y-1">
                  <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                    <span>{t.m2ColWorkers}</span>
                    <span>{t.m2ColDays}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800 text-xs sm:text-sm">
                    <span>{workers1}</span>
                    <span>{days1}</span>
                    <span>{workers2}</span>
                    <span className="text-indigo-600 font-black">x</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-700 text-center space-y-1">
                  <div>{t.m2FormulaProduct(workers1, days1, workers2)}</div>
                  <div className="text-indigo-900 font-bold">
                    {t.m2FormulaSolve(workers1, days1, workers2, totalWork, <strong>{formatNum(targetDays, 1, locale)}</strong>)}
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center font-bold text-xs sm:text-sm text-indigo-950">
                {t.m1ResultBadge(formatNum(targetDays, 1, locale))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ ΧΡΟΝΟΥ */}
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
                {t.lab2Subtitle(speed1, hoursInput, minutesInput, speed2)}
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
                {t.p2Step1Calc(hoursInput, minutesInput, totalMinutes1)}
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
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>{t.p2Step2ColSpeed}</span>
                  <span>{t.p2Step2ColTime}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 font-bold text-slate-800">
                  <span>{speed1}</span>
                  <span>{totalMinutes1}</span>
                  <span>{speed2}</span>
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
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-center space-y-0.5 text-emerald-950 font-bold">
                <div>{t.p2Step3Calc1(speed1, totalMinutes1, speed2)}</div>
                <div>{t.p2Step3Calc2(speed1, totalMinutes1, speed2, formatNum(targetMinutes, 1, locale))}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  {t.p2Step3FinalHours(targetHoursClean)}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step3Footnote}
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
            href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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