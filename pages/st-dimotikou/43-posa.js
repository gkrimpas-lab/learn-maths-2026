// pages/st-dimotikou/43-posa.js
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
    pageTitle: "Ποσά: Σταθερά και Μεταβλητά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για την έννοια των ποσών, τα σταθερά και μεταβλητά ποσά, τη συσχέτιση μεγεθών και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 43 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ποσά: Σταθερά και Μεταβλητά",
    heroDesc: "Μαθαίνουμε τι ονομάζεται ποσό στα Μαθηματικά, πώς ξεχωρίζουμε τα ποσά που παραμένουν αναλλοίωτα (σταθερά) από εκείνα που αλλάζουν τιμή (μεταβλητά) και πώς δύο ποσά εξαρτώνται το ένα από το άλλο.",
    heroFeature: "Θεωρία & Δυναμική Εξερεύνηση Μεταβολής Ποσών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 4 Βήματα",
    theorySubtitle: "Η θεμελιώδης διαφορά ανάμεσα σε αριθμούς, μεγέθη, σταθερές και μεταβλητές.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι ονομάζεται Ποσό;",
    step1Text: "Ποσό ονομάζεται οτιδήποτε μπορεί να μετρηθεί ή να υπολογιστεί και εκφράζεται με έναν αριθμό συνοδευόμενο από την αντίστοιχη μονάδα μέτρησης.",
    step1ExamplesHeader: "Παραδείγματα Ποσών:",
    step1Ex1: "Το μήκος ενός υφάσματος (5 m)",
    step1Ex2: "Το βάρος ενός κιβωτίου (12 kg)",
    step1Ex3: "Ο χρόνος ενός αγώνα (45 min)",
    step1Ex4: "Η τιμή ενός βιβλίου (15 €)",
    step1Tip: "💡 Ένας σκέτος αριθμός (π.χ. το 8) δεν είναι ποσό. Γίνεται ποσό μόνο όταν συνοδεύεται από μονάδα (π.χ. 8 kg ή 8 €)!",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Κατηγοριοποίηση",
    step2Title: "Σταθερά Ποσά",
    step2Text: "Σταθερό ποσό ονομάζεται εκείνο που διατηρεί πάντα την ίδια τιμή και δεν αλλάζει καθ' όλη τη διάρκεια ενός φαινομένου ή προβλήματος:",
    step2Ex1: "📌 Ο αριθμός των ημερών μιας εβδομάδας (7 ημέρες)",
    step2Ex2: "📌 Η τιμή του ενός εισιτηρίου λεωφορείου σε ένα δρομολόγιο (1,20 €)",
    step2Ex3: "📌 Ο αριθμός των γραμμαρίων σε ένα κιλό (1.000 g)",
    step2Tip: "⚡ Τα σταθερά ποσά αποτελούν τη βάση αναφοράς για να υπολογίσουμε τα μεταβαλλόμενα μεγέθη.",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Κατηγοριοποίηση",
    step3Title: "Μεταβλητά Ποσά",
    step3Text: "Μεταβλητό ποσό ονομάζεται εκείνο που παίρνει διαφορετικές τιμές σε διαφορετικές στιγμές ή περιπτώσεις:",
    step3Ex1: "🔄 Η θερμοκρασία του περιβάλλοντος κατά τη διάρκεια της ημέρας",
    step3Ex2: "🔄 Το ύψος ενός παιδιού καθώς μεγαλώνει",
    step3Ex3: "🔄 Το πλήθος των τετραδίων που επιλέγουμε να αγοράσουμε",
    step3Tip: "🎯 Στα προβλήματα, τα μεταβλητά ποσά συνήθως συμβολίζονται με γράμματα (x, y, α, β).",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Εξάρτηση",
    step4Title: "Συσχετισμένα Ποσά",
    step4Text: "Όταν δύο μεταβλητά ποσά συνδέονται έτσι ώστε η αλλαγή του ενός να προκαλεί αλλαγή στο άλλο, λέγονται συσχετισμένα ποσά:",
    step4Ex1: "Ποσότητα & Αξία: Όσα περισσότερα κιλά φρούτων αγοράζουμε, τόσο περισσότερα χρήματα πληρώνουμε.",
    step4Ex2: "Χρόνος & Απόσταση: Όσες περισσότερες ώρες περπατάμε, τόσο μεγαλύτερη απόσταση διανύουμε.",
    step4Tip: "🚀 Η μελέτη των συσχετισμένων ποσών οδηγεί άμεσα στις έννοιες των ανάλογων και αντιστρόφως ανάλογων ποσών!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Πραγματικό Σενάριο: Σταθερή Τιμή & Μεταβλητό Κόστος",
    lab1Subtitle: "Σε ένα βιβλιοπωλείο, η τιμή του ενός τετραδίου είναι σταθερή. Αλλάξτε το πλήθος των τετραδίων για να παρατηρήσετε πώς μεταβάλλεται το συνολικό κόστος.",
    lab1UnitPriceLabel: "ΣΤΑΘΕΡΟ ΠΟΣΟ: ΤΙΜΗ ΤΕΤΡΑΔΙΟΥ (€)",
    lab1ItemCountLabel: "ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ: ΠΛΗΘΟΣ ΤΕΤΡΑΔΙΩΝ",
    lab1AnalysisHeader: "ΑΝΑΛΥΣΗ ΤΩΝ ΠΟΣΩΝ ΣΤΟ ΠΡΟΒΛΗΜΑ",
    lab1Card1Title: "1. ΣΤΑΘΕΡΟ ΠΟΣΟ",
    lab1Card1Sub: "Τιμή ενός τετραδίου",
    lab1Card2Title: "2. ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ",
    lab1Card2Sub: "Πλήθος αγοράς",
    lab1Card2Unit: (c) => `${c} ${c === 1 ? 'τετράδιο' : 'τετράδια'}`,
    lab1Card3Title: "3. ΕΞΑΡΤΗΜΕΝΟ ΠΟΣΟ",
    lab1Card3Sub: "Συνολικό κόστος",
    lab1FormulaTitle: "Μαθηματική Σχέση Εξάρτησης:",
    lab1FormulaText: (u, c, tot) => `Συνολικό Κόστος ＝ ${u} · ${c} ＝ ${tot} €`,
    lab1FormulaFootnote: "Όταν το πλήθος των τετραδίων μεταβάλλεται, το συνολικό κόστος μεταβάλλεται ανάλογα, επειδή η τιμή μονάδας είναι σταθερή!",
    lab2Badge: "🚗 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Κίνηση με Σταθερή Ταχύτητα: Χρόνος και Απόσταση",
    lab2Subtitle: "Ένα αυτοκίνητο κινείται με σταθερή ταχύτητα. Παρατηρήστε πώς η διανυόμενη απόσταση εξαρτάται άμεσα από τον χρόνο κίνησης.",
    lab2SpeedLabel: "ΣΤΑΘΕΡΟ ΠΟΣΟ: ΤΑΧΥΤΗΤΑ (km/h)",
    lab2TimeLabel: "ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ: ΧΡΟΝΟΣ (ΩΡΕΣ)",
    lab2TimeUnit: (h) => `${h} ${h === 1 ? 'ώρα' : 'ώρες'}`,
    lab2TableHeader: "ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΓΙΑ ΤΗ ΔΙΑΔΡΟΜΗ",
    lab2ColTime: "Χρόνος (h)",
    lab2ColDist: "Διανυόμενη Απόσταση (km)",
    lab2VerdictTitle: "Τελικό Αποτέλεσμα Ταξιδιού:",
    lab2VerdictFootnote: (s, t, d) => `Υπολογισμός: ${s} km/h · ${t} h ＝ ${d} km.`,
    ctaTitle: "Ώρα για Εξάσκηση στα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις διάκρισης σταθερών και μεταβλητών ποσών, ανάλυσης σχέσεων εξάρτησης και ρεαλιστικών προβλημάτων.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Quantities: Constant and Variable - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on mathematical quantities, constants and variables, related quantities, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 43 • 6TH GRADE",
    heroTitle: "Quantities: Constant and Variable",
    heroDesc: "Learn what a quantity is in mathematics, how to distinguish unchanged quantities (constants) from changing ones (variables), and how two quantities depend on each other.",
    heroFeature: "Theory & Dynamic Exploration of Quantity Variation",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 4 Steps",
    theorySubtitle: "The fundamental difference between bare numbers, measurements, constants, and variables.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is a Quantity?",
    step1Text: "A quantity is anything that can be measured or calculated, expressed as a numerical value accompanied by a unit of measurement.",
    step1ExamplesHeader: "Examples of Quantities:",
    step1Ex1: "The length of a cloth (5 m)",
    step1Ex2: "The weight of a crate (12 kg)",
    step1Ex3: "The duration of a match (45 min)",
    step1Ex4: "The price of a book (15 €)",
    step1Tip: "💡 A bare number (e.g. 8) is not a quantity. It becomes a quantity only when paired with a unit (e.g. 8 kg or 8 €)!",
    step2Badge: "STEP 2",
    step2Sub: "Classification",
    step2Title: "Constant Quantities",
    step2Text: "A constant quantity is one that retains the exact same value and remains unchanged throughout an event or problem:",
    step2Ex1: "📌 The number of days in a week (7 days)",
    step2Ex2: "📌 The fare for a single bus ticket on a fixed route (1.20 €)",
    step2Ex3: "📌 The number of grams in a kilogram (1,000 g)",
    step2Tip: "⚡ Constant quantities provide the baseline benchmark used to calculate changing magnitudes.",
    step3Badge: "STEP 3",
    step3Sub: "Classification",
    step3Title: "Variable Quantities",
    step3Text: "A variable quantity is one that takes on different values at different times or under different circumstances:",
    step3Ex1: "🔄 The outdoor temperature throughout the day",
    step3Ex2: "🔄 A child's height as they grow",
    step3Ex3: "🔄 The number of notebooks we choose to purchase",
    step3Tip: "🎯 In math word problems, variable quantities are typically represented by letters (x, y, a, b).",
    step4Badge: "STEP 4",
    step4Sub: "Dependence",
    step4Title: "Related Quantities",
    step4Text: "When two variable quantities are linked so that a change in one causes a change in the other, they are called related (dependent) quantities:",
    step4Ex1: "Quantity & Price: The more kilograms of fruit we buy, the more money we pay.",
    step4Ex2: "Time & Distance: The more hours we walk, the greater the distance we cover.",
    step4Tip: "🚀 Studying related quantities directly leads to proportional and inversely proportional relationships!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Real-Life Scenario: Fixed Price & Variable Cost",
    lab1Subtitle: "In a bookstore, the price per notebook is constant. Adjust notebook count to see how total cost varies.",
    lab1UnitPriceLabel: "CONSTANT: NOTEBOOK PRICE (€)",
    lab1ItemCountLabel: "VARIABLE: NUMBER OF NOTEBOOKS",
    lab1AnalysisHeader: "QUANTITY ANALYSIS IN PROBLEM",
    lab1Card1Title: "1. CONSTANT QUANTITY",
    lab1Card1Sub: "Price per notebook",
    lab1Card2Title: "2. VARIABLE QUANTITY",
    lab1Card2Sub: "Quantity purchased",
    lab1Card2Unit: (c) => `${c} ${c === 1 ? 'notebook' : 'notebooks'}`,
    lab1Card3Title: "3. DEPENDENT QUANTITY",
    lab1Card3Sub: "Total cost",
    lab1FormulaTitle: "Mathematical Relationship of Dependence:",
    lab1FormulaText: (u, c, tot) => `Total Cost ＝ ${u} · ${c} ＝ ${tot} €`,
    lab1FormulaFootnote: "As notebook count varies, total cost changes proportionally because the unit price is fixed!",
    lab2Badge: "🚗 INTERACTIVE LAB 2",
    lab2Title: "Motion at Constant Speed: Time and Distance",
    lab2Subtitle: "A car moves at a constant speed. Observe how the distance covered directly depends on travel time.",
    lab2SpeedLabel: "CONSTANT: SPEED (km/h)",
    lab2TimeLabel: "VARIABLE: TIME (HOURS)",
    lab2TimeUnit: (h) => `${h} ${h === 1 ? 'hour' : 'hours'}`,
    lab2TableHeader: "VALUE TABLE FOR TRIP",
    lab2ColTime: "Time (h)",
    lab2ColDist: "Distance Covered (km)",
    lab2VerdictTitle: "Final Trip Result:",
    lab2VerdictFootnote: (s, t, d) => `Calculation: ${s} km/h · ${t} h ＝ ${d} km.`,
    ctaTitle: "Time to Practice Quantities!",
    ctaDesc: "Test your skills with 10 interactive questions on identifying constants vs. variables, analyzing dependencies, and solving realistic problems.",
    ctaBtn: "Start Exercises"
  }
};

export default function PosaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Σταθερή Τιμή Μονάδας & Μεταβλητή Ποσότητα/Κόστος
  const [unitPrice, setUnitPrice] = useState(2.5);
  const [itemCount, setItemCount] = useState(4);

  // Υπολογισμός συνολικού κόστους
  const totalCost = useMemo(() => {
    return Number((unitPrice * itemCount).toFixed(2));
  }, [unitPrice, itemCount]);

  // Εργαστήριο 2: Κίνηση με Σταθερή Ταχύτητα (Χρόνος vs Απόσταση)
  const [speedKmH, setSpeedKmH] = useState(80);
  const [timeHours, setTimeHours] = useState(3);

  // Υπολογισμός διανυόμενης απόστασης
  const distanceKm = useMemo(() => {
    return speedKmH * timeHours;
  }, [speedKmH, timeHours]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/43-posa-ask"
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
              href="/st-dimotikou/43-posa-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">{t.step1ExamplesHeader}</p>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>{locale === 'en' ? 'The length of a cloth (' : 'Το μήκος ενός υφάσματος ('}<span className="font-bold text-blue-900">5 m</span>)</li>
                    <li>{locale === 'en' ? 'The weight of a crate (' : 'Το βάρος ενός κιβωτίου ('}<span className="font-bold text-blue-900">12 kg</span>)</li>
                    <li>{locale === 'en' ? 'The duration of a match (' : 'Ο χρόνος ενός αγώνα ('}<span className="font-bold text-blue-900">45 min</span>)</li>
                    <li>{locale === 'en' ? 'The price of a book (' : 'Η τιμή ενός βιβλίου ('}<span className="font-bold text-blue-900">15 €</span>)</li>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step2Ex1}
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step2Ex2}
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step2Ex3}
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step3Ex1}
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step3Ex2}
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    {t.step3Ex3}
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

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    {t.step4Ex1}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    {t.step4Ex2}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΓΟΡΑ ΤΕΤΡΑΔΙΩΝ */}
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
            
            {/* Χειριστήρια (Steppers) */}
            <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
              
              {/* Σταθερό Ποσό: Τιμή Μονάδας */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                    {t.lab1UnitPriceLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {formatNum(unitPrice, 2, locale)} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUnitPrice((prev) => Math.max(1, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={unitPrice <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease unit price"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    aria-label="Unit price"
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUnitPrice((prev) => Math.min(6, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={unitPrice >= 6}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Increase unit price"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Μεταβλητό Ποσό 1: Πλήθος Τετραδίων */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.lab1ItemCountLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {itemCount}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemCount((prev) => Math.max(1, prev - 1)); }}
                    disabled={itemCount <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease items"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    aria-label="Items count"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemCount((prev) => Math.min(12, prev + 1)); }}
                    disabled={itemCount >= 12}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Increase items"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πίνακας Ανάλυσης Συσχέτισης */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-3xl border border-slate-200 space-y-4 sm:space-y-6">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab1AnalysisHeader}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                {/* 1. Σταθερό */}
                <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-amber-800 uppercase block">{t.lab1Card1Title}</span>
                  <span className="text-[11px] sm:text-xs text-slate-500">{t.lab1Card1Sub}</span>
                  <div className="font-mono font-black text-lg sm:text-xl text-amber-900 pt-1">
                    {formatNum(unitPrice, 2, locale)} €
                  </div>
                </div>

                {/* 2. Μεταβλητό 1 */}
                <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-xs font-bold text-blue-800 uppercase block">{t.lab1Card2Title}</span>
                  <span className="text-[11px] sm:text-xs text-slate-500">{t.lab1Card2Sub}</span>
                  <div className="font-mono font-black text-lg sm:text-xl text-blue-900 pt-1">
                    {t.lab1Card2Unit(itemCount)}
                  </div>
                </div>

                {/* 3. Μεταβλητό 2 (Εξαρτημένο) */}
                <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">{t.lab1Card3Title}</span>
                  <span className="text-[11px] sm:text-xs text-slate-500">{t.lab1Card3Sub}</span>
                  <div className="font-mono font-black text-lg sm:text-xl text-emerald-700 pt-1">
                    {formatNum(totalCost, 2, locale)} €
                  </div>
                </div>
              </div>

              {/* Μαθηματική σχέση */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center space-y-1 text-xs sm:text-sm">
                <span className="text-slate-500 font-semibold block">
                  {t.lab1FormulaTitle}
                </span>
                <div className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                  {t.lab1FormulaText(formatNum(unitPrice, 2, locale), itemCount, formatNum(totalCost, 2, locale))}
                </div>
                <p className="text-slate-500 text-[11px] pt-1">
                  {t.lab1FormulaFootnote}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΚΙΝΗΣΗ ΜΕ ΣΤΑΘΕΡΗ ΤΑΧΥΤΗΤΑ */}
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
            
            {/* Χειριστήρια Κίνησης */}
            <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
              
              {/* Σταθερή Ταχύτητα */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                    {t.lab2SpeedLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {speedKmH} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedKmH((prev) => Math.max(40, prev - 10)); }}
                    disabled={speedKmH <= 40}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease speed"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={40}
                    max={120}
                    step={10}
                    value={speedKmH}
                    onChange={(e) => setSpeedKmH(Number(e.target.value))}
                    aria-label="Speed"
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedKmH((prev) => Math.min(120, prev + 10)); }}
                    disabled={speedKmH >= 120}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Increase speed"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Μεταβλητός Χρόνος */}
              <div className="bg-sky-50/70 p-3.5 sm:p-4 rounded-2xl border border-sky-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-sky-900 tracking-wider">
                    {t.lab2TimeLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200">
                    {t.lab2TimeUnit(timeHours)}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTimeHours((prev) => Math.max(1, prev - 1)); }}
                    disabled={timeHours <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Decrease time"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={timeHours}
                    onChange={(e) => setTimeHours(Number(e.target.value))}
                    aria-label="Travel time"
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTimeHours((prev) => Math.min(8, prev + 1)); }}
                    disabled={timeHours >= 8}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                    aria-label="Increase time"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικοποίηση & Πίνακας Τιμών */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-3xl border border-slate-200 space-y-4 sm:space-y-6">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.lab2TableHeader}
              </div>

              {/* Πίνακας Συσχετισμένων Ποσών */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold border-b pb-2 text-slate-600">
                  <span className="bg-sky-50 py-1 rounded-lg text-sky-900">{t.lab2ColTime}</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900">{t.lab2ColDist}</span>
                </div>
                <div className="divide-y divide-slate-100 text-center font-mono text-xs sm:text-sm">
                  {[1, 2, timeHours].filter((v, i, a) => a.indexOf(v) === i).sort((x, y) => x - y).map((h) => (
                    <div key={`row-${h}`} className={`grid grid-cols-2 py-2 ${h === timeHours ? 'bg-amber-50 font-black text-amber-900 rounded-lg' : 'text-slate-700'}`}>
                      <span>{h} h</span>
                      <span>{speedKmH * h} km</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Συμπέρασμα */}
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-emerald-100 text-center space-y-1 text-xs sm:text-sm">
                <span className="text-emerald-900 font-bold block">
                  {t.lab2VerdictTitle}
                </span>
                <div className="font-mono font-black text-lg sm:text-xl text-emerald-600">
                  {distanceKm} km
                </div>
                <p className="text-slate-500 text-[11px]">
                  {t.lab2VerdictFootnote(speedKmH, timeHours, distanceKm)}
                </p>
              </div>

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
            href="/st-dimotikou/43-posa-ask"
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