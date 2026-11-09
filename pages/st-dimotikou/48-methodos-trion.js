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
    pageTitle: "Η Απλή Μέθοδος των Τριών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για την απλή μέθοδο των τριών, τα βήματα κατάταξης, τη διάκριση ανάλογων και αντιστρόφως ανάλογων ποσών και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 48 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Απλή Μέθοδος των Τριών",
    heroDesc: "Ανακαλύπτουμε την ιστορική μέθοδο των Μαθηματικών όπου από τρεις γνωστές τιμές δύο ποσών υπολογίζουμε την τέταρτη άγνωστη τιμή, μαθαίνοντας να κατατάσσουμε τα δεδομένα και να επιλέγουμε σωστά μεταξύ χιαστί και οριζόντιου πολλαπλασιασμού.",
    heroFeature: "Θεωρία & Δυναμική Κατάταξη Ποσών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Ο Αλγόριθμος της Μεθόδου των Τριών σε 4 Βήματα",
    theorySubtitle: "Ο απόλυτος πρακτικός κανόνας για να μην κάνουμε ποτέ λάθος σε πρόβλημα ποσών.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι η Μέθοδος των Τριών;",
    step1Text: "Ονομάζεται Απλή Μέθοδος των Τριών επειδή σε ένα πρόβλημα δύο ποσών γνωρίζουμε τρεις όρους και αναζητούμε τον τέταρτο άγνωστο όρο (x).",
    step1GoalHeader: "Σκοπός της μεθόδου:",
    step1GoalText: "Να οργανώσει τις γνωστές πληροφορίες έτσι ώστε να υπολογίσουμε άμεσα τον άγνωστο με μία μόνο αριθμητική παράσταση.",
    step1Tip: "💡 Λέγεται «απλή» γιατί συγκρίνει δύο μόνο ποσά. Αν υπήρχαν τρία ή περισσότερα ποσά, θα λεγόταν «σύνθετη».",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Κατάταξη",
    step2Title: "Κατάταξη σε Ομώνυμες Στήλες",
    step2Text: "Γράφουμε τα δεδομένα σε δύο στήλες, τοποθετώντας τα ομοειδή ποσά το ένα κάτω από το άλλο και στην ίδια μονάδα μέτρησης:",
    step2ColA: "Ποσό Α (π.χ. kg)",
    step2ColB: "Ποσό Β (π.χ. €)",
    step2Tip: "⚡ Απαράβατος κανόνας: Δεν βάζουμε ποτέ κιλά κάτω από ευρώ ή ώρες κάτω από χιλιόμετρα!",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Διάκριση Ποσών",
    step3Title: "Έλεγχος: Ανάλογα ή Αντίστροφα;",
    step3Text: "Εξετάζουμε τη σχέση των δύο ποσών θέτοντας το λογικό ερώτημα:",
    step3AnalogaBox: "Αν είναι ΑΝΑΛΟΓΑ: Όταν το πρώτο διπλασιάζεται, διπλασιάζεται και το δεύτερο (π.χ. βάρος και τιμή).",
    step3AntistrofaBox: "Αν είναι ΑΝΤΙΣΤΡΟΦΩΣ: Όταν το πρώτο διπλασιάζεται, το δεύτερο γίνεται μισό (π.χ. εργάτες και ημέρες).",
    step3Tip: "🎯 Από αυτό το βήμα εξαρτάται αν θα εκτελέσουμε χιαστί ή οριζόντιο υπολογισμό.",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Εκτέλεση",
    step4Title: "Επίλυση με τον Σωστό Τύπο",
    step4Text: "Εφαρμόζουμε τον κατάλληλο τύπο υπολογισμού:",
    step4AnalogaTitle: "Ανάλογα (Χιαστί):",
    step4AnalogaFormula: "x ＝ (β₁ · α₂) : α₁",
    step4AntistrofaTitle: "Αντιστρόφως (Οριζόντια):",
    step4AntistrofaFormula: "x ＝ (α₁ · β₁) : α₂",
    step4Tip: "🚀 Ελέγχουμε πάντα αν το αποτέλεσμα έχει λογική (π.χ. περισσότεροι εργάτες → λιγότερες ημέρες).",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Εξομοιωτής της Μεθόδου των Τριών",
    lab1Subtitle: "Επιλέξτε το είδος των ποσών (Ανάλογα ή Αντιστρόφως Ανάλογα) και δείτε πώς προσαρμόζεται η κατάταξη, η κατεύθυνση των πράξεων και ο τελικός τύπος.",
    lab1ModeAnaloga: "Ανάλογα (Χιαστί)",
    lab1ModeAntistrofa: "Αντιστρόφως (Οριζόντια)",
    lab1Term1Label: "1ΟΣ ΟΡΟΣ (α₁)",
    lab1Term2Label: "2ΟΣ ΟΡΟΣ (β₁)",
    lab1Term3Label: "3ΟΣ ΟΡΟΣ (α₂)",
    lab1TableHeader: "ΠΙΝΑΚΑΣ ΚΑΤΑΤΑΞΗΣ ΤΗΣ ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ",
    lab1Col1: "ΠΟΣΟ 1",
    lab1Col2: "ΠΟΣΟ 2",
    lab1AnalogaNote: (b1, a2, a1) => `🔄 Ανάλογα Ποσά → Εφαρμόζουμε σταυρωτά γινόμενα (χιαστί: (${b1} · ${a2}) : ${a1}).`,
    lab1AntistrofaNote: (a1, b1, a2) => `↔️ Αντιστρόφως Ανάλογα → Εφαρμόζουμε οριζόντια γινόμενα ((${a1} · ${b1}) : ${a2}).`,
    lab1MathHeader: "ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ",
    lab1FormulaLabel: "Τύπος Επίλυσης:",
    lab1Conclusion: (a1, b1, a2, x) => `Από τους τρεις γνωστούς όρους (${a1}, ${b1}, ${a2}) υπολογίσαμε με ακρίβεια τον τέταρτο όρο (x ＝ ${x}).`,
    lab2Badge: "📦 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Πλήρης Εφαρμογή: Αγορά Ζωοτροφών σε Σακιά",
    lab2Subtitle: (kg, cost, target) => `Παράδειγμα: Ένας κτηνοτρόφος αγοράζει ${kg} kg ζωοτροφής προς ${cost} €. Πόσα € θα πληρώσει για να αγοράσει ${target} kg από την ίδια ζωοτροφή;`,
    p2Step1Badge: "1ο ΒΗΜΑ: ΚΑΤΑΤΑΞΗ",
    p2Step1Title: "Τοποθέτηση σε Στήλες",
    p2Step1ColWeight: "Βάρος (kg)",
    p2Step1ColCost: "Κόστος (€)",
    p2Step1Footnote: "Τα κιλά κάτω από τα κιλά και τα ευρώ κάτω από τα ευρώ.",
    p2Step2Badge: "2ο ΒΗΜΑ: ΕΛΕΓΧΟΣ",
    p2Step2Title: "Ανάλογα ή Αντίστροφα;",
    p2Step2Desc: "Ρωτάμε: «Αν αγοράσω περισσότερα κιλά, θα πληρώσω περισσότερα χρήματα;»",
    p2Step2Result: "✓ Ναι! Τα ποσά είναι ΑΝΑΛΟΓΑ.",
    p2Step2Footnote: "Συνεπώς εφαρμόζουμε χιαστί πολλαπλασιασμό.",
    p2Step3Badge: "3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ",
    p2Step3Title: "Υπολογισμός του x",
    p2Step3Calc1: (cost, target, kg) => `x ＝ (${cost} · ${target}) : ${kg}`,
    p2Step3Calc2: (cost, target, kg) => `x ＝ ${cost * target} : ${kg}`,
    p2Step3Final: (res) => `x ＝ ${res} €`,
    p2Step3Footnote: (target, res) => `Για ${target} kg ζωοτροφής θα πληρώσει ${res} €.`,
    ctaTitle: "Ώρα για Εξάσκηση στη Μέθοδο των Τριών!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά προβλήματα ανάλογων και αντιστρόφως ανάλογων ποσών, εφάρμοσε σωστή κατάταξη και έλεγξε τις επιδόσεις σου.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "The Rule of Three - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on the simple rule of three, data alignment tables, distinguishing direct and inverse proportions, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 48 • 6TH GRADE",
    heroTitle: "The Simple Rule of Three",
    heroDesc: "Discover the classic mathematical method where three known terms are used to find the fourth unknown term, mastering structured data alignment and choosing correctly between cross-multiplication and horizontal multiplication.",
    heroFeature: "Theory & Dynamic Proportion Alignment",
    heroCta: "Try the Exercises",
    theoryTitle: "The Rule of Three Algorithm in 4 Steps",
    theorySubtitle: "The complete step-by-step guideline to avoid errors in proportion problems.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is the Rule of Three?",
    step1Text: "It is called the Simple Rule of Three because in a two-quantity problem we know three terms and solve for the fourth unknown term (x).",
    step1GoalHeader: "Method objective:",
    step1GoalText: "To systematically organize given information so that the unknown term can be computed directly in a single mathematical expression.",
    step1Tip: "💡 It is termed 'simple' because it relates exactly two quantities. With three or more quantities, it is called 'compound'.",
    step2Badge: "STEP 2",
    step2Sub: "Alignment",
    step2Title: "Aligning in Like Columns",
    step2Text: "Arrange the data in two parallel columns, placing like quantities vertically under one another using the exact same units:",
    step2ColA: "Quantity A (e.g. kg)",
    step2ColB: "Quantity B (e.g. €)",
    step2Tip: "⚡ Inviolable rule: Never place kilograms under euros or hours under kilometers!",
    step3Badge: "STEP 3",
    step3Sub: "Quantity Classification",
    step3Title: "Check: Direct or Inverse?",
    step3Text: "Examine the relationship between the two quantities by asking the fundamental question:",
    step3AnalogaBox: "If DIRECT: When the first quantity doubles, the second doubles as well (e.g. weight and price).",
    step3AntistrofaBox: "If INVERSE: When the first quantity doubles, the second is halved (e.g. workers and days).",
    step3Tip: "🎯 This crucial decision dictates whether to cross-multiply or multiply horizontally.",
    step4Badge: "STEP 4",
    step4Sub: "Execution",
    step4Title: "Solving with the Proper Formula",
    step4Text: "Apply the corresponding mathematical calculation formula:",
    step4AnalogaTitle: "Direct Proportion (Cross-Multiplication):",
    step4AnalogaFormula: "x ＝ (b₁ · a₂) : a₁",
    step4AntistrofaTitle: "Inverse Proportion (Horizontal):",
    step4AntistrofaFormula: "x ＝ (a₁ · b₁) : a₂",
    step4Tip: "🚀 Always perform a sanity check (e.g. more workers → strictly fewer days).",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Rule of Three Simulator",
    lab1Subtitle: "Select proportion type (Direct or Inverse) and observe how the table arrangement, calculation paths, and final formula adapt dynamically.",
    lab1ModeAnaloga: "Direct (Cross-Multiplication)",
    lab1ModeAntistrofa: "Inverse (Horizontal)",
    lab1Term1Label: "1ST TERM (a₁)",
    lab1Term2Label: "2ND TERM (b₁)",
    lab1Term3Label: "3RD TERM (a₂)",
    lab1TableHeader: "RULE OF THREE ALIGNMENT TABLE",
    lab1Col1: "QUANTITY 1",
    lab1Col2: "QUANTITY 2",
    lab1AnalogaNote: (b1, a2, a1) => `🔄 Direct Proportion → Cross-multiply: ((${b1} · ${a2}) : ${a1}).`,
    lab1AntistrofaNote: (a1, b1, a2) => `↔️ Inverse Proportion → Multiply horizontally: ((${a1} · ${b1}) : ${a2}).`,
    lab1MathHeader: "MATHEMATICAL SOLUTION",
    lab1FormulaLabel: "Solution Formula:",
    lab1Conclusion: (a1, b1, a2, x) => `From three known terms (${a1}, ${b1}, ${a2}) we accurately determined the fourth unknown term (x ＝ ${x}).`,
    lab2Badge: "📦 INTERACTIVE LAB 2",
    lab2Title: "Full Walkthrough: Feed Bag Purchase",
    lab2Subtitle: (kg, cost, target) => `Example: A farmer buys ${kg} kg of animal feed for ${cost} €. How much will he pay for ${target} kg of the same feed?`,
    p2Step1Badge: "STEP 1: ALIGNMENT",
    p2Step1Title: "Column Placement",
    p2Step1ColWeight: "Weight (kg)",
    p2Step1ColCost: "Cost (€)",
    p2Step1Footnote: "Kilograms placed under kilograms and euros placed under euros.",
    p2Step2Badge: "STEP 2: CHECK",
    p2Step2Title: "Direct or Inverse?",
    p2Step2Desc: "Ask: 'If I buy more kilograms, will I pay more money?'",
    p2Step2Result: "✓ Yes! Quantities are DIRECTLY PROPORTIONAL.",
    p2Step2Footnote: "Therefore, apply cross-multiplication.",
    p2Step3Badge: "STEP 3: SOLVE",
    p2Step3Title: "Calculating x",
    p2Step3Calc1: (cost, target, kg) => `x ＝ (${cost} · ${target}) : ${kg}`,
    p2Step3Calc2: (cost, target, kg) => `x ＝ ${cost * target} : ${kg}`,
    p2Step3Final: (res) => `x ＝ ${res} €`,
    p2Step3Footnote: (target, res) => `For ${target} kg of feed he will pay ${res} €.`,
    ctaTitle: "Time to Practice the Rule of Three!",
    ctaDesc: "Challenge yourself with 10 interactive word problems on direct and inverse proportions, align data correctly, and check your score.",
    ctaBtn: "Start Exercises"
  }
};

export default function MethodosTrionTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Υπολογιστής Μεθόδου των Τριών
  const [problemMode, setProblemMode] = useState('analoga');
  const [valA1, setValA1] = useState(3);
  const [valB1, setValB1] = useState(12);
  const [valA2, setValA2] = useState(6);

  // Υπολογισμός αγνώστου x ανάλογα με το mode
  const calculatedX = useMemo(() => {
    if (problemMode === 'analoga') {
      const raw = (valB1 * valA2) / valA1;
      return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
    } else {
      const raw = (valA1 * valB1) / valA2;
      return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
    }
  }, [problemMode, valA1, valB1, valA2]);

  // Εργαστήριο 2: Πρακτική Επίλυση με Βήματα
  const [bagKg] = useState(25);
  const [bagCost] = useState(40);
  const [targetKg] = useState(75);

  const calculatedBagCost = useMemo(() => {
    const raw = (bagCost * targetKg) / bagKg;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [bagCost, targetKg, bagKg]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/48-methodos-trion-ask"
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
              href="/st-dimotikou/48-methodos-trion-ask"
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
                  <p className="text-slate-700 font-semibold">{t.step1GoalHeader}</p>
                  <p className="text-slate-600 leading-relaxed">
                    {t.step1GoalText}
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
                  <div className="grid grid-cols-2 gap-2 text-center border-b border-slate-200 pb-1 font-bold text-slate-600">
                    <span>{t.step2ColA}</span>
                    <span>{t.step2ColB}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1 font-bold text-slate-800">
                    <span>α₁</span>
                    <span>β₁</span>
                    <span>α₂</span>
                    <span className="text-amber-600">x</span>
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

                <div className="space-y-1.5 text-[11px] sm:text-xs">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    {t.step3AnalogaBox}
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    {t.step3AntistrofaBox}
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

                <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-center font-bold">
                    {t.step4AnalogaTitle}<br />
                    {t.step4AnalogaFormula}
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-center font-bold">
                    {t.step4AntistrofaTitle}<br />
                    {t.step4AntistrofaFormula}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΥΠΟΛΟΓΙΣΤΗΣ ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ */}
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

            {/* Διακόπτης Είδους Ποσών */}
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto gap-1">
              <button
                type="button"
                onClick={() => setProblemMode('analoga')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  problemMode === 'analoga'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.lab1ModeAnaloga}
              </button>
              <button
                type="button"
                onClick={() => setProblemMode('antistrofa')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  problemMode === 'antistrofa'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.lab1ModeAntistrofa}
              </button>
            </div>
          </div>

          {/* Πλέγμα Χειριστηρίων 3 Γνωστών Τιμών */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 2xl:gap-6">
            
            {/* Τιμή α1 */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.lab1Term1Label}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {valA1}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA1((prev) => Math.max(1, prev - 1)); }}
                  disabled={valA1 <= 1}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease term a1"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={valA1}
                  onChange={(e) => setValA1(Number(e.target.value))}
                  aria-label="Term a1"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA1((prev) => Math.min(12, prev + 1)); }}
                  disabled={valA1 >= 12}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase term a1"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Τιμή β1 */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                  {t.lab1Term2Label}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {valB1}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.max(4, prev - 2)); }}
                  disabled={valB1 <= 4}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease term b1"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={2}
                  value={valB1}
                  onChange={(e) => setValB1(Number(e.target.value))}
                  aria-label="Term b1"
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.min(40, prev + 2)); }}
                  disabled={valB1 >= 40}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase term b1"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Τιμή α2 */}
            <div className="bg-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-indigo-900 tracking-wider">
                  {t.lab1Term3Label}
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                  {valA2}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA2((prev) => Math.max(1, prev - 1)); }}
                  disabled={valA2 <= 1}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Decrease term a2"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={16}
                  step={1}
                  value={valA2}
                  onChange={(e) => setValA2(Number(e.target.value))}
                  aria-label="Term a2"
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA2((prev) => Math.min(16, prev + 1)); }}
                  disabled={valA2 >= 16}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  aria-label="Increase term a2"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Πίνακας Κατάταξης & Μαθηματικός Υπολογισμός */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Πίνακας Κατάταξης */}
            <div className="lg:col-span-6 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab1TableHeader}
              </div>

              <div className="bg-white rounded-2xl border-2 border-slate-300 p-3 sm:p-4 shadow-sm max-w-sm mx-auto font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">{t.lab1Col1}</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900 truncate">{t.lab1Col2}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">{valA1}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{valB1}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{valA2}</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    x
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] sm:text-xs font-semibold text-slate-600">
                {problemMode === 'analoga' ? (
                  <span className="text-blue-700 font-bold">
                    {t.lab1AnalogaNote(valB1, valA2, valA1)}
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">
                    {t.lab1AntistrofaNote(valA1, valB1, valA2)}
                  </span>
                )}
              </div>
            </div>

            {/* Κάρτα Τελικής Επίλυσης */}
            <div className="lg:col-span-6 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab1MathHeader}
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-center space-y-2.5 font-mono">
                <span className="text-xs text-slate-500 font-sans block font-semibold">
                  {t.lab1FormulaLabel}
                </span>
                
                {problemMode === 'analoga' ? (
                  <div className="space-y-1">
                    <div className="text-sm sm:text-lg text-blue-900 font-bold">
                      x ＝ ({valB1} · {valA2}) : {valA1}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-600">
                      x ＝ {valB1 * valA2} : {valA1} ＝ {formatNum(calculatedX, 1, locale)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm sm:text-lg text-amber-900 font-bold">
                      x ＝ ({valA1} · {valB1}) : {valA2}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-600">
                      x ＝ {valA1 * valB1} : {valA2} ＝ {formatNum(calculatedX, 1, locale)}
                    </div>
                  </div>
                )}

                <p className="text-[11px] sm:text-xs text-slate-500 font-sans pt-1">
                  {t.lab1Conclusion(valA1, valB1, valA2, formatNum(calculatedX, 1, locale))}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΒΗΜΑ-ΠΡΟΣ-ΒΗΜΑ ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ */}
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
                {t.lab2Subtitle(bagKg, bagCost, targetKg)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Βήμα 1: Κατάταξη */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.p2Step1Badge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.p2Step1Title}
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>{t.p2Step1ColWeight}</span>
                  <span>{t.p2Step1ColCost}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 font-bold text-slate-800">
                  <span>{bagKg}</span>
                  <span>{bagCost}</span>
                  <span>{targetKg}</span>
                  <span className="text-amber-600 font-black">x</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step1Footnote}
              </p>
            </div>

            {/* Βήμα 2: Έλεγχος Είδους */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.p2Step2Badge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.p2Step2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.p2Step2Desc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-bold text-emerald-900 text-center text-xs sm:text-sm">
                {t.p2Step2Result}
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
                <div>{t.p2Step3Calc1(bagCost, targetKg, bagKg)}</div>
                <div>{t.p2Step3Calc2(bagCost, targetKg, bagKg)}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  {t.p2Step3Final(formatNum(calculatedBagCost, 1, locale))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {t.p2Step3Footnote(targetKg, formatNum(calculatedBagCost, 1, locale))}
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
            href="/st-dimotikou/48-methodos-trion-ask"
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