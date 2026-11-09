// pages/st-dimotikou/42-analogia-xiasti.js
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

// Βοηθητικό component εμφάνισης κλάσματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού βάσει locale
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  const dotStr = String(rounded);
  return locale === 'el' ? dotStr.replace('.', ',') : dotStr;
}

// Λεξικό i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Αναλογία Χιαστί & Πίνακες Ποσών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς οργανώνουμε τα δεδομένα σε πίνακα ποσών και τιμών, πώς εφαρμόζουμε την τεχνική του χιαστί πολλαπλασιασμού και πώς λύνουμε σύνθετα προβλήματα αναλογιών.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 42 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Τεχνική της Αναλογίας Χιαστί",
    heroDesc: "Οργανώνουμε τα δεδομένα κάθε προβλήματος σε πίνακα ποσών και τιμών, εφαρμόζουμε τη σταυρωτή διαγώνια μέθοδο (χιαστί) και επιλύουμε απαιτητικά προβλήματα με άγνωστο όρο χωρίς κόπο.",
    heroFeature: "Πίνακες Ποσών & Σταυρωτός Πολλαπλασιασμός",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Η Μέθοδος Επίλυσης σε 4 Βήματα",
    theorySubtitle: "Πώς μετατρέπουμε την εκφώνηση ενός προβλήματος σε μαθηματικό πίνακα και πώς βρίσκουμε το αποτέλεσμα.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Οργάνωση",
    step1Title: "Πίνακας Ποσών και Τιμών",
    step1Text: "Το πρώτο και σημαντικότερο βήμα είναι να τοποθετήσουμε τα μεγέθη σε έναν τακτοποιημένο πίνακα δύο στηλών ή δύο γραμμών:",
    step1ColA: "Ποσό Α (π.χ. kg)",
    step1ColB: "Ποσό Β (π.χ. €)",
    step1TableNote: "Προσέχουμε οι τιμές του ίδιου ποσού να είναι στην ίδια στήλη και στην ίδια μονάδα μέτρησης!",
    step1Tip: "💡 Ο πίνακας μας προστατεύει από λάθη τοποθέτησης και δείχνει καθαρά τη διαγώνια σχέση.",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Σταυρωτό Σχήμα",
    step2Title: "Το Σχήμα «Χ» (Χιαστί)",
    step2Text: "Συνδέουμε διαγώνια τους όρους του πίνακα σχηματίζοντας ένα νοητό «Χ». Οι δύο αριθμοί που συνδέονται μεταξύ τους είναι το γνωστό γινόμενο:",
    step2DiagonalsNote: (
      <>
        Διαγώνιοι: <strong className="text-blue-900">α με x</strong> και <strong className="text-amber-900">β με γ</strong>.<br />
        Άρα: <span className="font-mono font-bold text-slate-900">α · x ＝ β · γ</span>.
      </>
    ),
    step2Tip: "⚡ «Χιαστί» σημαίνει σταυρωτά: πολλαπλασιάζουμε διαγώνια τα απέναντι στοιχεία!",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Ο Χρυσός Κανόνας",
    step3Title: "Υπολογισμός με 1 Κίνηση",
    step3Text: "Για να βρούμε τον άγνωστο όρο x χωρίς να γράφουμε ολόκληρη την εξίσωση, εφαρμόζουμε τον κανόνα:",
    step3Formula: "x ＝ (β · γ) : α",
    step3RuleDesc: "Πολλαπλασιάζουμε τους δύο αριθμούς της πλήρους διαγωνίου και διαιρούμε με τον αριθμό που βρίσκεται διαγώνια απέναντι από το x.",
    step3Tip: "🎯 Αυτός ο τύπος λύνει άμεσα το 95% των πρακτικών προβλημάτων του Δημοτικού!",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Παγίδες & Μονάδες",
    step4Title: "Προσοχή στις Μονάδες!",
    step4Text: "Στα απαιτητικά προβλήματα οι μονάδες συχνά διαφέρουν. Πριν τοποθετήσουμε τους αριθμούς στον πίνακα:",
    step4TimeTip: (
      <>
        <strong>Χρόνος:</strong> Αν έχουμε ώρες και λεπτά, μετατρέπουμε τα πάντα σε <em>λεπτά</em> (π.χ. 1 h 30 min ＝ 90 min).
      </>
    ),
    step4MassTip: (
      <>
        <strong>Μάζα/Μήκος:</strong> Μετατρέπουμε τα kg σε g ή τα m σε cm (π.χ. 2,5 kg ＝ 2.500 g).
      </>
    ),
    step4Tip: "🚀 Δεν βάζουμε ποτέ διαφορετικές μονάδες μέτρησης στην ίδια στήλη του πίνακα!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Πίνακας Ποσών & Χιαστί Επίλυση",
    lab1Subtitle: "Μεταβάλλετε τις τιμές του προβλήματος και παρακολουθήστε πώς διαμορφώνεται ο πίνακας, τα σταυρωτά βέλη και η τελική τιμή του x.",
    valALabel: "ΑΡΧΙΚΗ ΠΟΣΟΤΗΤΑ (α)",
    valBLabel: "ΑΝΤΙΣΤΟΙΧΟ ΑΠΟΤΕΛΕΣΜΑ (β)",
    valCLabel: "ΝΕΑ ΠΟΣΟΤΗΤΑ (γ)",
    tableOrgHeader: "ΟΡΓΑΝΩΣΗ ΣΕ ΠΙΝΑΚΑ ΠΟΣΩΝ & ΤΙΜΩΝ",
    tableCol1: "ΠΟΣΟ 1",
    tableCol2: "ΠΟΣΟ 2",
    crossMultText: (a, b, c) => `Σταυρωτό γινόμενο: ${a} · x ＝ ${b} · ${c}`,
    calcXHeader: "ΥΠΟΛΟΓΙΣΜΟΣ ΤΟΥ ΑΓΝΩΣΤΟΥ X",
    calcFormulaDesc: (b, c, a) => `Πολλαπλασιάσαμε τη γνωστή διαγώνιο (${b} · ${c} ＝ ${b * c}) και διαιρέσαμε με το ${a}.`,
    lab2Badge: "🥤 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Σύνθετο Πρόβλημα: Δεκαδικοί & Μετατροπές Μονάδων",
    lab2Subtitle: (mKg, cEur, tG) => `Παράδειγμα: Αν τα ${mKg} kg τυριού κοστίζουν ${cEur} €, πόσο κοστίζουν τα ${tG} g από το ίδιο τυρί;`,
    step1ConvBadge: "ΒΗΜΑ 1: ΜΕΤΑΤΡΟΠΗ",
    step1ConvTitle: "Ίδιες Μονάδες Μέτρησης",
    step1ConvDesc: (
      <>
        Το ένα ποσό δίνεται σε <strong className="text-blue-900">kg</strong> και το άλλο σε <strong className="text-amber-900">g</strong>. Πρέπει να είναι ίδια:
      </>
    ),
    step1ConvCalc: (g, kg) => `${g} g ＝ ${kg} kg`,
    step1ConvFootnote: "Διαιρούμε τα γραμμάρια με το 1.000 για να γίνουν κιλά.",
    step2TableBadge: "ΒΗΜΑ 2: ΠΙΝΑΚΑΣ",
    step2TableTitle: "Τοποθέτηση σε Πίνακα",
    step2ColWeight: "Βάρος (kg)",
    step2ColCost: "Κόστος (€)",
    step2TableFootnote: "Και τα δύο βάρη είναι πλέον σε κιλά (kg).",
    step3CrossBadge: "ΒΗΜΑ 3: ΧΙΑΣΤΙ",
    step3CrossTitle: "Υπολογισμός Κόστους",
    step3CrossFootnote: "Βρήκαμε το τελικό κόστος με μία απλή πράξη.",
    ctaTitle: "Ώρα για Εξάσκηση στην Αναλογία Χιαστί!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με πίνακες ποσών και τιμών, σταυρωτό πολλαπλασιασμό και σύνθετα προβλήματα με δεκαδικούς αριθμούς.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Cross-Multiplication & Proportion Tables - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to organize data into proportion tables, apply the cross-multiplication method, and solve multi-step proportion problems for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 42 • 6TH GRADE",
    heroTitle: "The Cross-Multiplication Method",
    heroDesc: "We organize problem data into proportion tables, apply the cross-product method, and solve multi-step problems with an unknown term effortlessly.",
    heroFeature: "Proportion Tables & Cross-Multiplication",
    heroCta: "Try the Exercises",
    theoryTitle: "The Solution Method in 4 Steps",
    theorySubtitle: "How to translate word problem statements into a mathematical table and determine the result.",
    step1Badge: "STEP 1",
    step1Sub: "Organization",
    step1Title: "Table of Quantities and Values",
    step1Text: "The first and most critical step is placing the quantities into an orderly table with two columns or rows:",
    step1ColA: "Quantity A (e.g. kg)",
    step1ColB: "Quantity B (e.g. €)",
    step1TableNote: "Make sure values of the same quantity share the same column and unit of measurement!",
    step1Tip: "💡 The table protects us from placement errors and clearly reveals diagonal relationships.",
    step2Badge: "STEP 2",
    step2Sub: "Cross Pattern",
    step2Title: "The 'X' Pattern (Cross Products)",
    step2Text: "Connect terms diagonally across the table forming an 'X'. The two numbers linked along the complete diagonal form the known product:",
    step2DiagonalsNote: (
      <>
        Diagonals: <strong className="text-blue-900">a with x</strong> and <strong className="text-amber-900">b with c</strong>.<br />
        Therefore: <span className="font-mono font-bold text-slate-900">a · x ＝ b · c</span>.
      </>
    ),
    step2Tip: "⚡ Cross-multiplication means multiplying across diagonals: pair opposite elements!",
    step3Badge: "STEP 3",
    step3Sub: "The Golden Rule",
    step3Title: "One-Step Calculation",
    step3Text: "To compute the unknown term x directly without writing the full equation, apply the rule:",
    step3Formula: "x ＝ (b · c) : a",
    step3RuleDesc: "Multiply the two numbers along the complete diagonal and divide by the number opposite to x.",
    step3Tip: "🎯 This single formula solves 95% of practical primary school proportion word problems!",
    step4Badge: "STEP 4",
    step4Sub: "Pitfalls & Units",
    step4Title: "Watch Out for Units!",
    step4Text: "In multi-step problems, units often differ. Before entering values into the table:",
    step4TimeTip: (
      <>
        <strong>Time:</strong> If hours and minutes appear, convert everything to <em>minutes</em> (e.g. 1 h 30 min ＝ 90 min).
      </>
    ),
    step4MassTip: (
      <>
        <strong>Mass/Length:</strong> Convert kg to g or m to cm (e.g. 2.5 kg ＝ 2,500 g).
      </>
    ),
    step4Tip: "🚀 Never place mismatched units of measurement in the same column of the table!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Proportion Table & Cross-Multiplication",
    lab1Subtitle: "Modify problem values to watch the table layout, cross-arrows, and final value of x update in real time.",
    valALabel: "INITIAL QUANTITY (a)",
    valBLabel: "CORRESPONDING RESULT (b)",
    valCLabel: "NEW QUANTITY (c)",
    tableOrgHeader: "ORGANIZATION IN PROPORTION TABLE",
    tableCol1: "QUANTITY 1",
    tableCol2: "QUANTITY 2",
    crossMultText: (a, b, c) => `Cross product: ${a} · x ＝ ${b} · ${c}`,
    calcXHeader: "CALCULATION OF UNKNOWN X",
    calcFormulaDesc: (b, c, a) => `We multiplied the known diagonal (${b} · ${c} ＝ ${b * c}) and divided by ${a}.`,
    lab2Badge: "🥤 INTERACTIVE LAB 2",
    lab2Title: "Multi-Step Problem: Decimals & Unit Conversions",
    lab2Subtitle: (mKg, cEur, tG) => `Example: If ${mKg} kg of cheese costs ${cEur} €, what is the cost of ${tG} g of the same cheese?`,
    step1ConvBadge: "STEP 1: CONVERSION",
    step1ConvTitle: "Matching Units of Measure",
    step1ConvDesc: (
      <>
        One amount is given in <strong className="text-blue-900">kg</strong> and the other in <strong className="text-amber-900">g</strong>. They must match:
      </>
    ),
    step1ConvCalc: (g, kg) => `${g} g ＝ ${kg} kg`,
    step1ConvFootnote: "Divide grams by 1,000 to convert to kilograms.",
    step2TableBadge: "STEP 2: TABLE",
    step2TableTitle: "Entering Data into Table",
    step2ColWeight: "Weight (kg)",
    step2ColCost: "Cost (€)",
    step2TableFootnote: "Both weights are now expressed in kilograms (kg).",
    step3CrossBadge: "STEP 3: CROSS MULTIPLICATION",
    step3CrossTitle: "Calculating the Cost",
    step3CrossFootnote: "We find the final cost in one simple operation.",
    ctaTitle: "Time to Practice Cross-Multiplication!",
    ctaDesc: "Test your skills with 10 interactive questions on proportion tables, cross-multiplication, and multi-step decimal word problems.",
    ctaBtn: "Start Exercises"
  }
};

export default function XiastiTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Πίνακας Ποσών & Τιμών με σχηματισμό «Χ»
  const [valA, setValA] = useState(3);
  const [valB, setValB] = useState(75);
  const [valC, setValC] = useState(8);

  // Υπολογισμός αγνώστου x: (valB · valC) : valA
  const calculatedX = useMemo(() => {
    const raw = (valB * valC) / valA;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [valA, valB, valC]);

  // Εργαστήριο 2: Πρόβλημα με Δεκαδικούς & Μετατροπές Μονάδων
  const [massKg] = useState(2.5);
  const [costEur] = useState(4.5);
  const [targetMassG] = useState(1500);

  const targetMassKg = targetMassG / 1000;
  const calculatedCost = useMemo(() => {
    const res = (costEur * targetMassKg) / massKg;
    return Number.isInteger(res) ? res : Number(res.toFixed(2));
  }, [massKg, costEur, targetMassKg]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/42-analogia-xiasti-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
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
              href="/st-dimotikou/42-analogia-xiasti-ask"
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
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-blue-100/70 p-2 rounded-xl text-blue-950 font-bold text-[11px] sm:text-xs break-words">
                      {t.step1ColA}
                    </div>
                    <div className="bg-emerald-100/70 p-2 rounded-xl text-emerald-950 font-bold text-[11px] sm:text-xs break-words">
                      {t.step1ColB}
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{locale === 'en' ? 'a' : 'α'}</div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{locale === 'en' ? 'b' : 'β'}</div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{locale === 'en' ? 'c' : 'γ'}</div>
                    <div className="bg-amber-100 p-2 rounded-xl border border-amber-300 font-bold text-amber-900">x</div>
                  </div>
                  <p className="text-slate-500 text-[11px] text-center pt-1 leading-normal">
                    {t.step1TableNote}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-indigo-900">
                    <Fraction num={locale === 'en' ? 'a' : 'α'} den={locale === 'en' ? 'c' : 'γ'} />
                    <span>＝</span>
                    <Fraction num={locale === 'en' ? 'b' : 'β'} den="x" />
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-slate-700 font-sans text-[11px] text-center leading-normal">
                    {t.step2DiagonalsNote}
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

                <div className="bg-indigo-50/80 p-3 sm:p-4 rounded-2xl border border-indigo-200 space-y-1.5 text-xs sm:text-sm">
                  <div className="font-mono font-black text-center text-indigo-950 text-sm sm:text-base">
                    {locale === 'en' ? 'x ＝ (b · c) : a' : t.step3Formula}
                  </div>
                  <div className="text-slate-700 text-[11px] leading-relaxed text-center pt-0.5 font-sans">
                    {t.step3RuleDesc}
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
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px]">
                    {t.step4TimeTip}
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-[11px]">
                    {t.step4MassTip}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΙΝΑΚΑ ΚΑΙ ΧΙΑΣΤΙ */}
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
            
            {/* Χειριστήρια Τιμών */}
            <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
              
              {/* Τιμή Α */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.valALabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {valA}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA((prev) => Math.max(1, prev - 1)); }}
                    disabled={valA <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease a"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={valA}
                    onChange={(e) => setValA(Number(e.target.value))}
                    aria-label="Parameter a"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA((prev) => Math.min(15, prev + 1)); }}
                    disabled={valA >= 15}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Increase a"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμή Β */}
              <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                    {t.valBLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {valB}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB((prev) => Math.max(10, prev - 5)); }}
                    disabled={valB <= 10}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease b"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    step={5}
                    value={valB}
                    onChange={(e) => setValB(Number(e.target.value))}
                    aria-label="Parameter b"
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB((prev) => Math.min(150, prev + 5)); }}
                    disabled={valB >= 150}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Increase b"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμή C */}
              <div className="bg-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-indigo-900 tracking-wider">
                    {t.valCLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {valC}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValC((prev) => Math.max(1, prev - 1)); }}
                    disabled={valC <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease c"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={valC}
                    onChange={(e) => setValC(Number(e.target.value))}
                    aria-label="Parameter c"
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValC((prev) => Math.min(20, prev + 1)); }}
                    disabled={valC >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                    aria-label="Increase c"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικός Πίνακας με διαγώνια σχέση */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.tableOrgHeader}
              </div>

              {/* Πίνακας 2x2 Responsive Χωρίς Scroll */}
              <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-md p-3 sm:p-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-center border-b pb-1.5 border-slate-200 font-bold text-xs sm:text-sm text-slate-600">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 break-words">{t.tableCol1}</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900 break-words">{t.tableCol2}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-center font-mono font-black text-lg sm:text-2xl text-slate-800 py-1">
                  {/* Γραμμή 1 */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-blue-800">
                    {valA}
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-emerald-800">
                    {valB}
                  </div>

                  {/* Γραμμή 2 */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-indigo-800">
                    {valC}
                  </div>
                  <div className="bg-amber-100 p-2.5 rounded-xl border-2 border-amber-400 text-amber-950 animate-pulse">
                    x
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-indigo-900 pt-0.5">
                  {t.crossMultText(valA, valB, valC)}
                </div>
              </div>

              {/* Ανάλυση τύπου */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 text-center space-y-1.5">
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase font-bold block">
                  {t.calcXHeader}
                </span>
                <div className="text-base sm:text-xl font-black font-mono text-slate-900">
                  x ＝ ({valB} · {valC}) : {valA} ＝ {valB * valC} : {valA} ＝{' '}
                  <span className="text-emerald-600 underline decoration-emerald-400 decoration-4">
                    {formatNum(calculatedX, 2, locale)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  {t.calcFormulaDesc(valB, valC, valA)}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕ ΔΕΚΑΔΙΚΟΥΣ & ΜΕΤΑΤΡΟΠΕΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>{t.lab2Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Subtitle(formatNum(massKg, 2, locale), formatNum(costEur, 2, locale), targetMassG)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Κάρτα 1: Μετατροπή */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.step1ConvBadge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.step1ConvTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step1ConvDesc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-800 text-xs sm:text-sm text-center">
                {t.step1ConvCalc(targetMassG, formatNum(targetMassKg, 2, locale))}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {t.step1ConvFootnote}
              </p>
            </div>

            {/* Κάρτα 2: Στήσιμο Πίνακα */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.step2TableBadge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.step2TableTitle}
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-1 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>{t.step2ColWeight}</span>
                  <span>{t.step2ColCost}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1.5 font-bold text-slate-800">
                  <span>{formatNum(massKg, 2, locale)}</span>
                  <span>{formatNum(costEur, 2, locale)}</span>
                  <span>{formatNum(targetMassKg, 2, locale)}</span>
                  <span className="text-amber-600 font-black">x</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center leading-normal">
                {t.step2TableFootnote}
              </p>
            </div>

            {/* Κάρτα 3: Υπολογισμός Χιαστί */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                {t.step3CrossBadge}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.step3CrossTitle}
              </h4>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-emerald-800 text-xs sm:text-sm text-center space-y-0.5">
                <div>x ＝ ({formatNum(costEur, 2, locale)} · {formatNum(targetMassKg, 2, locale)}) : {formatNum(massKg, 2, locale)}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  x ＝ {formatNum(calculatedCost, 2, locale)} €
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center leading-normal">
                {t.step3CrossFootnote}
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
            href="/st-dimotikou/42-analogia-xiasti-ask"
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