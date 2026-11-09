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
    pageTitle: "Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για τα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο, τον πίνακα τιμών, τη γραφική παράσταση (υπερβολή) και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 46 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Αντιστρόφως Ανάλογα Ποσά",
    heroDesc: "Μαθαίνουμε πότε δύο ποσά μεταβάλλονται αντίστροφα, γιατί το γινόμενο των αντίστοιχων τιμών τους παραμένει σταθερό (x · y ＝ σταθερό), πώς διαβάζουμε τον πίνακα τιμών και γιατί η γραφική τους παράσταση είναι καμπύλη γραμμή (υπερβολή).",
    heroFeature: "Θεωρία & Δυναμικός Έλεγχος Σταθερού Γινομένου",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 4 Βήματα",
    theorySubtitle: "Η μαθηματική ουσία των αντιστρόφως ανάλογων ποσών και η σύγκριση με τα ανάλογα.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι Αντιστρόφως Ανάλογα;",
    step1Text: "Δύο ποσά ονομάζονται αντιστρόφως ανάλογα όταν, καθώς πολλαπλασιάζεται η τιμή του ενός με έναν αριθμό, η αντίστοιχη τιμή του άλλου διαιρείται με τον ίδιο ακριβώς αριθμό (και αντίστροφα).",
    step1ExamplesHeader: "Παραδείγματα στην καθημερινότητα:",
    step1Ex1: "Διπλάσιοι εργάτες → Μισός χρόνος για το έργο.",
    step1Ex2: "Τριπλάσια ταχύτητα → Στο ένα τρίτο ο χρόνος ταξιδιού.",
    step1Ex3: "Περισσότερες βρύσες → Λιγότερα λεπτά για να γεμίσει η πισίνα.",
    step1Tip: "💡 Προσοχή: Δεν αρκεί απλώς το ένα ποσό να ανεβαίνει και το άλλο να πέφτει. Πρέπει η μεταβολή να γίνεται με τον ίδιο ακριβώς ρυθμό!",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Βασική Ιδιότητα",
    step2Title: "Σταθερό Γινόμενο (α)",
    step2Text: "Σε δύο αντιστρόφως ανάλογα ποσά, το γινόμενο των αντίστοιχων τιμών τους παραμένει πάντοτε σταθερό:",
    step2FormulaMain: "x · y ＝ α  (σταθερό)",
    step2VarsNote: "Όπου x η τιμή του πρώτου ποσού, y η τιμή του δεύτερου ποσού και α το σταθερό γινόμενο.",
    step2FormulaDerived: "y ＝ α : x",
    step2Tip: "⚡ Μεγάλη διαφορά: Στα ανάλογα ποσά είναι σταθερό το πηλίκο (y : x ＝ λ), ενώ στα αντιστρόφως ανάλογα είναι σταθερό το γινόμενο (x · y ＝ α)!",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Πίνακας Τιμών",
    step3Title: "Έλεγχος Πίνακα Τιμών",
    step3Text: "Για να ελέγξουμε αν ένας πίνακας περιέχει αντιστρόφως ανάλογα ποσά, πολλαπλασιάζουμε τα ζεύγη των αντίστοιχων τιμών:",
    step3ColX: "Εργάτες (x)",
    step3ColY: "Ημέρες (y)",
    step3ProductsNote: "Γινόμενα: 1 · 24 ＝ 2 · 12 ＝ 4 · 6 ＝ 24 (σταθερό α)",
    step3Tip: "🎯 Αν ένα μόνο ζευγάρι δώσει διαφορετικό γινόμενο, τότε τα ποσά ΔΕΝ είναι αντιστρόφως ανάλογα!",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Διάγραμμα",
    step4Title: "Γραφική Παράσταση (Υπερβολή)",
    step4Text: "Σε σύστημα αξόνων, τα σημεία των αντιστρόφως ανάλογων ποσών δεν σχηματίζουν ευθεία γραμμή:",
    step4Highlight: "Η γραφική παράσταση είναι ΚΑΜΠΥΛΗ ΓΡΑΜΜΗ (ΥΠΕΡΒΟΛΗ).",
    step4CurveNote: "Η καμπύλη κατεβαίνει συνεχώς πλησιάζοντας τους άξονες, αλλά δεν περνά ποτέ από το (0, 0) και δεν ακουμπά ποτέ τους άξονες.",
    step4Tip: "🚀 Το μηδέν αποκλείεται, επειδή κανένας αριθμός διαιρούμενος με το 0 δεν έχει νόημα στα Μαθηματικά!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Πίνακας: Εργάτες & Ημέρες (Σταθερό Έργο ＝ 48 Μεροκάματα)",
    lab1Subtitle: "Ένα έργο απαιτεί συνολικά 48 μεροκάματα. Αλλάξτε το πλήθος των εργατών και παρατηρήστε πώς μειώνονται οι ημέρες διατηρώντας το γινόμενο σταθερό.",
    lab1WorkersLabel: "ΑΡΙΘΜΟΣ ΕΡΓΑΤΩΝ (x)",
    lab1WorkerUnitSingle: "εργάτης",
    lab1WorkerUnitPlural: "εργάτες",
    lab1Calculation: (w, d) => `Υπολογισμός ημερών: y ＝ 48 : ${w} ＝ ${d} ημέρες.`,
    lab1ConstantHeader: "ΣΤΑΘΕΡΟ ΓΙΝΟΜΕΝΟ (α)",
    lab1ConstantDesc: "Ο συνολικός όγκος εργασίας είναι 48 ανθρωποημέρες και δεν αλλάζει ποτέ.",
    lab1TableHeader: "ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΜΕ ΣΤΑΘΕΡΑ ΓΙΝΟΜΕΝΑ (x · y ＝ 48)",
    lab1ColX: "Εργάτες (x)",
    lab1ColY: "Ημέρες (y)",
    lab1ColProd: "Γινόμενο",
    lab1ConclusionHeader: "ΒΑΣΙΚΟ ΣΥΜΠΕΡΑΣΜΑ",
    lab1ConclusionText: "Όταν οι εργάτες διπλασιάζονται (π.χ. από 2 σε 4), οι ημέρες υποδιπλασιάζονται (από 24 σε 12). Το γινόμενο παραμένει αμετάβλητο: 48.",
    lab2Badge: "📉 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Η Γραφική Παράσταση είναι Υπερβολή (Καμπύλη)",
    lab2Subtitle: "Ταξίδι σταθερής απόστασης 240 km: Αλλάξτε την ταχύτητα και δείτε πώς η καμπύλη γραμμή αποτυπώνει τη μείωση του χρόνου ταξιδιού.",
    lab2SpeedLabel: "ΤΑΧΥΤΗΤΑ (km/h)",
    lab2TimeLabel: "ΧΡΟΝΟΣ ΤΑΞΙΔΙΟΥ (ΩΡΕΣ t)",
    lab2HourSingle: "ώρα",
    lab2HourPlural: "ώρες",
    lab2FormulaNote: (spd) => `Σταθερή απόσταση: 240 km → Τύπος: t ＝ 240 : ${spd}.`,
    lab2PointNote: (spd, time) => `Σημείο καμπύλης: Συντεταγμένες: (${spd} km/h, ${time} h). Όσο μεγαλώνει η ταχύτητα, τόσο πλησιάζει ο χρόνος το 0 χωρίς να φτάνει ποτέ εκεί.`,
    svgHeader: "ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ: ΚΑΜΠΥΛΗ ΥΠΕΡΒΟΛΗ",
    svgAxisX: "Ταχύτητα v (km/h)",
    svgAxisY: "Χρόνος t (h)",
    svgFootnote: "Η καμπύλη ΔΕΝ περνά ποτέ από το (0, 0) και δεν ακουμπά τους άξονες!",
    ctaTitle: "Ώρα για Εξάσκηση στα Αντιστρόφως Ανάλογα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ελέγχου σταθερού γινομένου, συμπλήρωσης πινάκων τιμών και σύνθετων προβλημάτων χρόνου και εργασίας.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Inversely Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on inversely proportional quantities, constant product, value tables, hyperbola curves, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 46 • 6TH GRADE",
    heroTitle: "Inversely Proportional Quantities",
    heroDesc: "Discover when two quantities vary inversely, why the product of their paired values remains constant (x · y ＝ constant), how to read proportion tables, and why their graph is a hyperbola curve.",
    heroFeature: "Theory & Dynamic Constant Product Verification",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 4 Steps",
    theorySubtitle: "The mathematical foundation of inversely proportional quantities compared to direct proportion.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What are Inversely Proportional Quantities?",
    step1Text: "Two quantities are inversely proportional when multiplying the value of one by a number causes the corresponding value of the other to be divided by that exact same number (and vice versa).",
    step1ExamplesHeader: "Real-world examples:",
    step1Ex1: "Double the workers → Half the completion time.",
    step1Ex2: "Triple the speed → One third of the travel time.",
    step1Ex3: "More water taps → Fewer minutes to fill the pool.",
    step1Tip: "💡 Caution: It is not enough that one quantity goes up while the other goes down. The change must occur at the exact same factor!",
    step2Badge: "STEP 2",
    step2Sub: "Key Property",
    step2Title: "Constant Product (k)",
    step2Text: "In inversely proportional quantities, the product of corresponding paired values is always constant:",
    step2FormulaMain: "x · y ＝ k  (constant)",
    step2VarsNote: "Where x is the first quantity, y is the second quantity, and k is the constant product.",
    step2FormulaDerived: "y ＝ k : x",
    step2Tip: "⚡ Big difference: In directly proportional quantities the quotient is constant (y : x ＝ λ), whereas in inversely proportional quantities the product is constant (x · y ＝ k)!",
    step3Badge: "STEP 3",
    step3Sub: "Value Table",
    step3Title: "Testing a Value Table",
    step3Text: "To check if a table represents inversely proportional quantities, multiply each pair of corresponding values:",
    step3ColX: "Workers (x)",
    step3ColY: "Days (y)",
    step3ProductsNote: "Products: 1 · 24 ＝ 2 · 12 ＝ 4 · 6 ＝ 24 (constant k)",
    step3Tip: "🎯 If even one pair produces a different product, the quantities are NOT inversely proportional!",
    step4Badge: "STEP 4",
    step4Sub: "Graph",
    step4Title: "Graphical Representation (Hyperbola)",
    step4Text: "On a Cartesian plane, the points of inversely proportional quantities do not form a straight line:",
    step4Highlight: "The graph is a CURVED LINE (HYPERBOLA).",
    step4CurveNote: "The curve slopes downward approaching the axes, but NEVER passes through (0, 0) and never touches either axis.",
    step4Tip: "🚀 Zero is impossible because division by 0 is undefined in mathematics!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Table: Workers & Days (Constant Workload ＝ 48 Man-Days)",
    lab1Subtitle: "A project requires 48 man-days in total. Adjust worker count and observe how required days decrease while the product remains constant.",
    lab1WorkersLabel: "WORKER COUNT (x)",
    lab1WorkerUnitSingle: "worker",
    lab1WorkerUnitPlural: "workers",
    lab1Calculation: (w, d) => `Days calculation: y ＝ 48 : ${w} ＝ ${d} days.`,
    lab1ConstantHeader: "CONSTANT PRODUCT (k)",
    lab1ConstantDesc: "The total volume of work is 48 man-days and never changes.",
    lab1TableHeader: "VALUE TABLE WITH CONSTANT PRODUCTS (x · y ＝ 48)",
    lab1ColX: "Workers (x)",
    lab1ColY: "Days (y)",
    lab1ColProd: "Product",
    lab1ConclusionHeader: "KEY CONCLUSION",
    lab1ConclusionText: "When workers double (e.g. 2 to 4), days are halved (24 to 12). The product remains invariant: 48.",
    lab2Badge: "📉 INTERACTIVE LAB 2",
    lab2Title: "The Graph is a Hyperbola (Curve)",
    lab2Subtitle: "Constant 240 km trip: Adjust travel speed and observe how the hyperbola curve models decreasing travel time.",
    lab2SpeedLabel: "SPEED (km/h)",
    lab2TimeLabel: "TRAVEL TIME (HOURS t)",
    lab2HourSingle: "hour",
    lab2HourPlural: "hours",
    lab2FormulaNote: (spd) => `Constant distance: 240 km → Formula: t ＝ 240 : ${spd}.`,
    lab2PointNote: (spd, time) => `Plotted point: Coordinates: (${spd} km/h, ${time} h). As speed increases, time approaches 0 without ever reaching it.`,
    svgHeader: "GRAPHICAL PLOT: HYPERBOLA CURVE",
    svgAxisX: "Speed v (km/h)",
    svgAxisY: "Time t (h)",
    svgFootnote: "The curve NEVER passes through (0, 0) and never touches either axis!",
    ctaTitle: "Time to Practice Inversely Proportional Quantities!",
    ctaDesc: "Challenge yourself with 10 interactive questions on constant products, value tables, and real-world inverse proportion scenarios.",
    ctaBtn: "Start Exercises"
  }
};

export default function AntistrofosAnalogaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Εργάτες & Ημέρες (Σταθερό Γινόμενο α = 48)
  const totalWorkDays = 48;
  const [workers, setWorkers] = useState(4);

  const daysNeeded = useMemo(() => {
    const raw = totalWorkDays / workers;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [workers, totalWorkDays]);

  // Τιμές πίνακα για x = 1, 2, 3, 4, 6, 8, 12 εργάτες
  const tableValues = useMemo(() => {
    return [1, 2, 3, 4, 6, 8, 12].map((w) => ({
      w,
      d: Number((totalWorkDays / w).toFixed(1)),
      product: totalWorkDays
    }));
  }, [totalWorkDays]);

  // Εργαστήριο 2: Ταχύτητα vs Χρόνος για Σταθερή Απόσταση 240 km
  const fixedDistance = 240;
  const [speedVal, setSpeedVal] = useState(60);

  const tripTime = useMemo(() => {
    const raw = fixedDistance / speedVal;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [speedVal, fixedDistance]);

  // Υπολογισμός σημείων υπερβολής για το SVG
  const curvePoints = useMemo(() => {
    const pts = [];
    for (let v = 30; v <= 120; v += 2) {
      const timeVal = fixedDistance / v;
      const px = 50 + (v / 120) * 300;
      const py = 350 - (timeVal / 8) * 280;
      pts.push(`${px},${py}`);
    }
    return pts.join(' ');
  }, [fixedDistance]);

  const activeDotX = 50 + (speedVal / 120) * 300;
  const activeDotY = 350 - ((fixedDistance / speedVal) / 8) * 280;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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
              href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="font-mono font-black text-lg sm:text-xl text-amber-950">
                    {t.step2FormulaMain}
                  </div>
                  <p className="text-slate-600 text-[11px] pt-0.5">
                    {t.step2VarsNote}
                  </p>
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800">
                    {t.step2FormulaDerived}
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

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1.5">
                  <div className="grid grid-cols-4 gap-1 text-center border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span>{t.step3ColX}</span>
                    <span>1</span>
                    <span>2</span>
                    <span>4</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-bold text-indigo-900">
                    <span>{t.step3ColY}</span>
                    <span>24</span>
                    <span>12</span>
                    <span>6</span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 text-center pt-0.5 font-sans font-bold">
                    {t.step3ProductsNote}
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

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold text-center text-xs">
                    {t.step4Highlight}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {t.step4CurveNote}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΡΓΑΤΕΣ ΚΑΙ ΧΡΟΝΟΣ */}
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
            
            {/* Χειριστήριο Εργατών */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-blue-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.lab1WorkersLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-800 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
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
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  {t.lab1Calculation(workers, <span className="font-mono font-bold">{formatNum(daysNeeded, 1, locale)}</span>)}
                </p>
              </div>

              {/* Κάρτα Σταθερού Γινομένου */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 text-center space-y-1">
                <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase block">
                  {t.lab1ConstantHeader}
                </span>
                <div className="font-mono font-black text-xl sm:text-2xl text-amber-800">
                  {workers} · {formatNum(daysNeeded, 1, locale)} ＝ 48
                </div>
                <p className="text-xs text-slate-600 pt-0.5">
                  {t.lab1ConstantDesc}
                </p>
              </div>

            </div>

            {/* Πίνακας Τιμών με Σταθερό Γινόμενο */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab1TableHeader}
              </div>

              <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm text-center text-xs font-mono">
                <div className="grid grid-cols-5 sm:grid-cols-8 bg-slate-100 border-b border-slate-200 text-slate-700 font-bold p-2">
                  <span className="text-left font-sans truncate">{t.lab1ColX}</span>
                  {tableValues.slice(0, 4).map((item) => (
                    <span key={`head-w-sm-${item.w}`} className={`sm:hidden ${item.w === workers ? 'bg-blue-100 text-blue-950 font-black rounded' : ''}`}>
                      {item.w}
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`head-w-${item.w}`} className={`hidden sm:inline ${item.w === workers ? 'bg-blue-100 text-blue-950 font-black rounded' : ''}`}>
                      {item.w}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 border-b border-slate-100 text-indigo-900 font-bold p-2">
                  <span className="text-left font-sans text-slate-600 truncate">{t.lab1ColY}</span>
                  {tableValues.slice(0, 4).map((item) => (
                    <span key={`body-d-sm-${item.w}`} className={`sm:hidden ${item.w === workers ? 'bg-blue-50 text-blue-900 rounded font-black' : ''}`}>
                      {formatNum(item.d, 1, locale)}
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`body-d-${item.w}`} className={`hidden sm:inline ${item.w === workers ? 'bg-blue-50 text-blue-900 rounded font-black' : ''}`}>
                      {formatNum(item.d, 1, locale)}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 bg-amber-50/50 text-amber-950 font-bold p-2">
                  <span className="text-left font-sans text-slate-600 truncate">{t.lab1ColProd}</span>
                  {tableValues.slice(0, 4).map((item) => (
                    <span key={`body-p-sm-${item.w}`} className="sm:hidden text-amber-800 font-black">
                      48
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`body-p-${item.w}`} className="hidden sm:inline text-amber-800 font-black">
                      48
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-emerald-100 text-center space-y-0.5">
                <span className="text-[11px] font-bold text-emerald-900 uppercase block">
                  {t.lab1ConclusionHeader}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {t.lab1ConclusionText}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ (ΥΠΕΡΒΟΛΗ) */}
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
                {t.lab2Subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Ρυθμίσεις Ταχύτητας */}
            <div className="lg:col-span-5 space-y-3.5">
              
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-700 tracking-wider">
                    {t.lab2SpeedLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {speedVal} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedVal((prev) => Math.max(30, prev - 10)); }}
                    disabled={speedVal <= 30}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease speed"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={30}
                    max={120}
                    step={10}
                    value={speedVal}
                    onChange={(e) => setSpeedVal(Number(e.target.value))}
                    aria-label="Speed"
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedVal((prev) => Math.min(120, prev + 10)); }}
                    disabled={speedVal >= 120}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase speed"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 sm:p-4 rounded-2xl border border-blue-200 space-y-1 text-center">
                <span className="text-[11px] sm:text-xs font-bold text-blue-900 uppercase block">
                  {t.lab2TimeLabel}
                </span>
                <div className="font-mono font-black text-xl sm:text-2xl text-blue-800">
                  {formatNum(tripTime, 1, locale)} {tripTime === 1 ? t.lab2HourSingle : t.lab2HourPlural}
                </div>
                <p className="text-xs text-slate-500 pt-0.5">
                  {t.lab2FormulaNote(speedVal)}
                </p>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 leading-relaxed">
                📌 {t.lab2PointNote(speedVal, formatNum(tripTime, 1, locale))}
              </div>

            </div>

            {/* SVG Διάγραμμα Υπερβολής */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                {t.svgHeader}
              </span>

              <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 relative shadow-inner">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" role="img" aria-label="Hyperbola curve of inversely proportional quantities">
                  {/* Πλέγμα */}
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={`grid-x-${i}`}
                      x1={50 + i * 75}
                      y1={70}
                      x2={50 + i * 75}
                      y2={350}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={`grid-y-${i}`}
                      x1={50}
                      y1={350 - i * 70}
                      x2={350}
                      y2={350 - i * 70}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Άξονες */}
                  <line x1="50" y1="350" x2="375" y2="350" stroke="#334155" strokeWidth="2.5" />
                  <line x1="50" y1="350" x2="50" y2="35" stroke="#334155" strokeWidth="2.5" />

                  {/* Βέλη αξόνων */}
                  <polygon points="375,346 383,350 375,354" fill="#334155" />
                  <polygon points="46,35 50,27 54,35" fill="#334155" />

                  {/* Ετικέτες αξόνων */}
                  <text x="375" y="375" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">{t.svgAxisX}</text>
                  <text x="25" y="25" fontSize="11" fontWeight="bold" fill="#64748b">{t.svgAxisY}</text>

                  {/* Αριθμοί άξονα X */}
                  {[30, 60, 90, 120].map((spd, idx) => (
                    <text key={`tx-${spd}`} x={50 + (idx + 1) * 75} y="368" fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">
                      {spd}
                    </text>
                  ))}

                  {/* Αριθμοί άξονα Y */}
                  {[2, 4, 6, 8].map((hrs, idx) => (
                    <text key={`ty-${hrs}`} x="42" y={355 - (idx + 1) * 70} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="end">
                      {hrs}
                    </text>
                  ))}

                  {/* Σημείο (0,0) */}
                  <circle cx="50" cy="350" r="4" fill="#0f172a" />
                  <text x="38" y="365" fontSize="11" fontWeight="bold" fill="#0f172a">0</text>

                  {/* Καμπύλη Υπερβολής: t ＝ 240 : v */}
                  <polyline
                    points={curvePoints}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Γραμμές οδηγοί ενεργού σημείου */}
                  <line x1={activeDotX} y1={350} x2={activeDotX} y2={activeDotY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="50" y1={activeDotY} x2={activeDotX} y2={activeDotY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle
                    cx={activeDotX}
                    cy={activeDotY}
                    r="7"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <span className="text-[11px] sm:text-xs text-rose-700 font-bold mt-2.5 text-center">
                {t.svgFootnote}
              </span>
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
            href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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