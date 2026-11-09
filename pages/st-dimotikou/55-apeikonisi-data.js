// pages/st-dimotikou/55-apeikonisi-data.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κανονικού κλάσματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού ανά locale
function formatNum(val, locale = 'el', decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(targetLocale);
  }
  return Number(num.toFixed(decimals)).toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// Άτονα ελληνικά κεφαλαία με διατήρηση του ΣΤ'
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

// Συγκεντρωτικό λεξικό μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    metaTitle: "Απεικόνιση Δεδομένων: Ραβδόγραμμα & Εικονόγραμμα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πώς οργανώνουμε και απεικονίζουμε δεδομένα με ραβδογράμματα και εικονογράμματα, πώς επιλέγουμε κλίμακα και διαβάζουμε υπομνήματα με διαδραστικά εργαστήρια.",
    backText: "ΣΤ' Δημοτικού",
    actionBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 55 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Απεικόνιση Δεδομένων: Ραβδόγραμμα & Εικονόγραμμα",
    headerDesc: "Μαθαίνουμε πώς μετατρέπουμε πίνακες συχνοτήτων και μετρήσεων σε ευανάγνωστα γραφήματα. Ανακαλύπτουμε πώς σχεδιάζουμε σωστά ράβδους με κλίμακα αξόνων και πώς αξιοποιούμε σύμβολα με υπόμνημα στα εικονογράμματα.",
    headerFeature: "Θεωρία, Οπτικά Παραδείγματα & Διαδραστική Σχεδίαση Γραφημάτων",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Βασικές Αρχές Στατιστικής Απεικόνισης σε 4 Βήματα",
    stepsDesc: "Από τη συλλογή πληροφοριών στον πίνακα συχνοτήτων και από εκεί στην οπτική παρουσίαση.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Πίνακας",
    step1Title: "Οργάνωση Δεδομένων",
    step1Text: "Πριν σχεδιάσουμε οποιοδήποτε γράφημα, καταγράφουμε τις παρατηρήσεις μας σε πίνακα συχνοτήτων:",
    step1ColCat: "Κατηγορία",
    step1ColFreq: "Συχνότητα (ν)",
    step1SampleCat1: "Μπάσκετ",
    step1SampleVal1: "8 μαθητές",
    step1SampleCat2: "Ποδόσφαιρο",
    step1SampleVal2: "12 μαθητές",
    step1Tip: "💡 Συχνότητα ονομάζεται ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια τιμή ή κατηγορία.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Ραβδόγραμμα",
    step2Title: "Κανόνες Ραβδογράμματος",
    step2Text: "Στο ραβδόγραμμα χρησιμοποιούμε ορθογώνιες στήλες (ράβδους) με συγκεκριμένους κανόνες:",
    step2Rule1: "• Ίσο πλάτος: Όλες οι ράβδοι έχουν αυστηρά το ίδιο πλάτος.",
    step2Rule2: "• Ίσες αποστάσεις: Τα κενά ανάμεσα στις ράβδους είναι ίσα.",
    step2Rule3: "• Ύψος: Το ύψος κάθε ράβδου είναι ανάλογο της συχνότητας.",
    step2Tip: "⚡ Η κλίμακα στον κατακόρυφο άξονα πρέπει να έχει σταθερά διαστήματα (π.χ. ανά 2, 5 ή 10).",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Εικονόγραμμα",
    step3Title: "Το Υπόμνημα του Εικονογράμματος",
    step3Text: "Στο εικονόγραμμα αντικαθιστούμε τους αριθμούς με εικόνες ή σύμβολα:",
    step3LegendSample: "Υπόμνημα: 📖 ＝ 5 βιβλία",
    step3ExampleText: "Αν μια τάξη διάβασε 20 βιβλία, σχεδιάζουμε 4 σύμβολα (20 : 5 ＝ 4). Αν διάβασε 25, σχεδιάζουμε 5 σύμβολα.",
    step3Tip: "🎯 Χωρίς υπόμνημα, κανείς δεν μπορεί να καταλάβει πόσες μονάδες αντιπροσωπεύει κάθε εικόνα!",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Ανάγνωση",
    step4Title: "Ερμηνεία Γραφημάτων",
    step4Text: "Τα γραφήματα μας επιτρέπουν να βγάζουμε άμεσα συμπεράσματα με μια ματιά:",
    step4Point1: "• Επικρατούσα κατηγορία: Η ψηλότερη ράβδος.",
    step4Point2: "• Σύνολο: Το άθροισμα όλων των ράβδων.",
    step4Point3: "• Διαφορές: Αφαίρεση υψών μεταξύ δύο κατηγοριών.",
    step4Tip: "🚀 Ένα γράφημα αξίζει όσο χίλιοι αριθμοί γιατί κάνει τη σύγκριση ορατή σε όλους.",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Εξομοιωτής: Ραβδόγραμμα & Εικονόγραμμα",
    lab1Desc: "Ρυθμίστε τις προτιμήσεις των μαθητών σε 4 αθλήματα ανά 1 μαθητή και κάντε εναλλαγή ανάμεσα σε Ραβδόγραμμα και Εικονόγραμμα.",
    btnBarView: "📊 Ραβδόγραμμα",
    btnPictoView: "🖼️ Εικονόγραμμα",
    sportFootball: "Ποδόσφαιρο",
    sportBasketball: "Μπάσκετ",
    sportVolleyball: "Βόλεϊ",
    sportSwimming: "Κολύμβηση",
    studentsSuffix: "μαθητές",
    totalSurveyed: "Σύνολο μαθητών που ρωτήθηκαν:",
    barChartTitle: "ΡΑΒΔΟΓΡΑΜΜΑ ΠΡΟΤΙΜΗΣΕΩΝ ΑΘΛΗΜΑΤΩΝ",
    pictoChartTitle: "ΕΙΚΟΝΟΓΡΑΜΜΑ (1 ΣΥΜΒΟΛΟ ＝ 2 ΜΑΘΗΤΕΣ)",
    pictoLegendNote: "📌 Υπόμνημα: Κάθε σύμβολο αντιστοιχεί σε 2 μαθητές.",
    halfSymbolText: "½",
    zeroValueText: "0",
    chartObservation: "Η επικρατούσα προτίμηση ξεχωρίζει άμεσα από το ύψος ή το πλήθος των εικόνων!",

    lab2Badge: "⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟΠΟΙΗΣΗ ΥΠΟΜΝΗΜΑΤΟΣ",
    lab2Title: "Πώς Αλλάζει το Εικονόγραμμα με την Κλίμακα του Υπομνήματος;",
    lab2Desc: "Επιλέξτε πόσα βιβλία δανείστηκαν και αλλάξτε την κλίμακα για να δείτε πώς σχεδιάζονται τα σύμβολα σε πραγματικό χρόνο:",
    booksLabel: "ΑΡΙΘΜΟΣ ΒΙΒΛΙΩΝ:",
    booksSuffix: "βιβλία",
    chooseLegendScale: "ΕΠΙΛΕΞΤΕ ΑΞΙΑ ΥΠΟΜΝΗΜΑΤΟΣ (1 ΣΥΜΒΟΛΟ ΙΣΟΥΤΑΙ ΜΕ):",
    pictoRenderTitle: "ΟΠΤΙΚΗ ΑΠΟΔΟΣΗ ΣΤΟ ΕΙΚΟΝΟΓΡΑΜΜΑ",
    noSymbolsNeeded: "Δεν απαιτούνται σύμβολα",
    symbolsCountLabel: "Σύμβολα",
    calcLabel: "Υπολογισμός",

    examplesTitle: "Λυμένα Παραδείγματα Προβλημάτων με Σχήματα",
    examplesDesc: "Δύο ολοκληρωμένα προβλήματα σχεδίασης και ερμηνείας ραβδογραμμάτων και εικονογραμμάτων.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΡΑΒΔΟΓΡΑΜΜΑ",
    prob1Category: "Σχολείο",
    prob1Title: "Δανεισμοί Βιβλίων Σχολικής Βιβλιοθήκης",
    prob1Text: "Σε ένα ραβδόγραμμα καταγράφηκαν οι δανεισμοί βιβλίων ανά τάξη: Γ' τάξη 15 βιβλία, Δ' τάξη 20 βιβλία, Ε' τάξη 25 βιβλία και ΣΤ' τάξη 30 βιβλία.",
    prob1ChartCaption: "ΣΧΗΜΑ: ΡΑΒΔΟΓΡΑΜΜΑ ΔΑΝΕΙΣΜΩΝ ΑΝΑ ΤΑΞΗ",
    prob1QAndA: "Ερωτήματα & Απαντήσεις:",
    prob1TotalText: "Σύνολο δανεισμών: 15 ＋ 20 ＋ 25 ＋ 30 ＝ 90 βιβλία",
    prob1DiffText: "Διαφορά ΣΤ' από Γ': 30 － 15 ＝ 15 βιβλία",
    prob1Tip: "💡 Στο σχήμα φαίνεται καθαρά: η ράβδος της ΣΤ' τάξης έχει ακριβώς διπλάσιο ύψος από τη ράβδο της Γ' τάξης (30 έναντι 15).",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΙΚΟΝΟΓΡΑΜΜΑ",
    prob2Category: "Ανακύκλωση",
    prob2Title: "Συλλογή Μπαταριών για Ανακύκλωση",
    prob2Text: "Οι μαθητές συγκέντρωσαν: Δευτέρα 40 μπαταρίες, Τρίτη 60 μπαταρίες, Τετάρτη 50 μπαταρίες (Υπόμνημα: 🔋 ＝ 10 μπαταρίες).",
    prob2ChartCaption: "ΣΧΗΜΑ: ΕΙΚΟΝΟΓΡΑΜΜΑ",
    prob2Legend: "🔋 ＝ 10 μπαταρίες",
    prob2Day1: "Δευτέρα:",
    prob2Day1Val: "40 μπαταρίες (4 σύμβολα)",
    prob2Day2: "Τρίτη:",
    prob2Day2Val: "60 μπαταρίες (6 σύμβολα)",
    prob2Day3: "Τετάρτη:",
    prob2Day3Val: "50 μπαταρίες (5 σύμβολα)",
    prob2SymbolsCalc: "Υπολογισμός συμβόλων:",
    prob2Calc1: "Δευτέρα: 40 : 10 ＝ 4 σύμβολα",
    prob2Calc2: "Τρίτη: 60 : 10 ＝ 6 σύμβολα",
    prob2Calc3: "Τετάρτη: 50 : 10 ＝ 5 σύμβολα",
    prob2Tip: "💡 Συνολικά: 4 ＋ 6 ＋ 5 ＝ 15 σύμβολα, που αντιπροσωπεύουν 15 · 10 ＝ 150 μπαταρίες.",

    bottomTitle: "Ώρα για Εξάσκηση στα Ραβδογράμματα & Εικονογράμματα!",
    bottomDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ανάγνωσης γραφημάτων, υπολογισμού συχνοτήτων και επίλυσης προβλημάτων στατιστικής για τη ΣΤ' Δημοτικού.",
    startExercises: "🎯 Έναρξη Ασκήσεων",
  },
  en: {
    metaTitle: "Data Representation: Bar Chart & Pictogram - Grade 6 | LearnMaths.gr",
    metaDesc: "Learn how to organize and represent data with bar charts and pictograms, choose scales, and read legends through interactive labs.",
    backText: "Grade 6",
    actionBtn: "🎯 Practice",
    badgeChapter: "CHAPTER 55 • GRADE 6",
    headerTitle: "Data Representation: Bar Chart & Pictogram",
    headerDesc: "Learn how to turn frequency and tally tables into clear graphs. Discover how to properly draw bars with axis scales and use symbols with legends in pictograms.",
    headerFeature: "Theory, Visual Examples & Interactive Graph Plotting",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Principles of Statistical Representation in 4 Steps",
    stepsDesc: "From data collection to frequency tables and clear visual charts.",

    step1Badge: "STEP 1",
    step1Type: "Table",
    step1Title: "Data Organization",
    step1Text: "Before drawing any chart, we record observations in a frequency table:",
    step1ColCat: "Category",
    step1ColFreq: "Frequency (f)",
    step1SampleCat1: "Basketball",
    step1SampleVal1: "8 students",
    step1SampleCat2: "Football (Soccer)",
    step1SampleVal2: "12 students",
    step1Tip: "💡 Frequency is the number showing how many times a specific value or category occurs.",

    step2Badge: "STEP 2",
    step2Type: "Bar Chart",
    step2Title: "Bar Chart Rules",
    step2Text: "In a bar chart we use rectangular columns (bars) following strict formatting rules:",
    step2Rule1: "• Equal width: All bars must strictly share the exact same width.",
    step2Rule2: "• Equal spacing: The gaps between consecutive bars must be equal.",
    step2Rule3: "• Height: The height of each bar is proportional to its frequency.",
    step2Tip: "⚡ The vertical scale must have consistent intervals (e.g. counting by 2s, 5s, or 10s).",

    step3Badge: "STEP 3",
    step3Type: "Pictogram",
    step3Title: "The Pictogram Legend / Key",
    step3Text: "In a pictogram, numbers are represented by pictures or symbols:",
    step3LegendSample: "Legend: 📖 ＝ 5 books",
    step3ExampleText: "If a class read 20 books, we draw 4 symbols (20 : 5 ＝ 4). If they read 25, we draw 5 symbols.",
    step3Tip: "🎯 Without a legend, nobody can tell how many units each symbol represents!",

    step4Badge: "STEP 4",
    step4Type: "Interpretation",
    step4Title: "Interpreting Charts",
    step4Text: "Charts allow us to draw immediate conclusions at a glance:",
    step4Point1: "• Modal category: The tallest bar.",
    step4Point2: "• Total count: The sum of all bar values.",
    step4Point3: "• Differences: Subtracting bar heights between two categories.",
    step4Tip: "🚀 A picture is worth a thousand numbers because it makes comparisons visible to everyone.",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Simulator: Bar Chart & Pictogram",
    lab1Desc: "Adjust student sport preferences by 1-unit steps and toggle between Bar Chart and Pictogram views.",
    btnBarView: "📊 Bar Chart",
    btnPictoView: "🖼️ Pictogram",
    sportFootball: "Football",
    sportBasketball: "Basketball",
    sportVolleyball: "Volleyball",
    sportSwimming: "Swimming",
    studentsSuffix: "students",
    totalSurveyed: "Total students surveyed:",
    barChartTitle: "SPORT PREFERENCE BAR CHART",
    pictoChartTitle: "PICTOGRAM (1 SYMBOL ＝ 2 STUDENTS)",
    pictoLegendNote: "📌 Legend: Each symbol represents 2 students.",
    halfSymbolText: "½",
    zeroValueText: "0",
    chartObservation: "The most popular choice is immediately evident from bar height or icon count!",

    lab2Badge: "⚡ INTERACTIVE LAB 2: LEGEND SCALE VISUALIZATION",
    lab2Title: "How Does the Pictogram Change with Scale?",
    lab2Desc: "Select the number of borrowed books and change the scale to see symbols rendered in real time:",
    booksLabel: "NUMBER OF BOOKS:",
    booksSuffix: "books",
    chooseLegendScale: "CHOOSE LEGEND VALUE (1 SYMBOL EQUALS):",
    pictoRenderTitle: "PICTOGRAM VISUAL RENDERING",
    noSymbolsNeeded: "No symbols required",
    symbolsCountLabel: "Symbols",
    calcLabel: "Calculation",

    examplesTitle: "Solved Problem Examples with Diagrams",
    examplesDesc: "Two complete worked problems illustrating bar charts and pictograms.",

    prob1Badge: "PROBLEM 1: BAR CHART",
    prob1Category: "School",
    prob1Title: "School Library Book Borrowings",
    prob1Text: "A bar chart recorded book borrowings by grade: Grade 3 had 15 books, Grade 4 had 20 books, Grade 5 had 25 books, and Grade 6 had 30 books.",
    prob1ChartCaption: "DIAGRAM: BOOK BORROWINGS BY GRADE BAR CHART",
    prob1QAndA: "Questions & Answers:",
    prob1TotalText: "Total borrowings: 15 ＋ 20 ＋ 25 ＋ 30 ＝ 90 books",
    prob1DiffText: "Difference between Grade 6 and Grade 3: 30 － 15 ＝ 15 books",
    prob1Tip: "💡 The chart clearly shows: Grade 6 bar is exactly twice as tall as Grade 3 (30 vs 15).",

    prob2Badge: "PROBLEM 2: PICTOGRAM",
    prob2Category: "Recycling",
    prob2Title: "Battery Collection for Recycling",
    prob2Text: "Students collected: Monday 40 batteries, Tuesday 60 batteries, Wednesday 50 batteries (Legend: 🔋 ＝ 10 batteries).",
    prob2ChartCaption: "DIAGRAM: PICTOGRAM",
    prob2Legend: "🔋 ＝ 10 batteries",
    prob2Day1: "Monday:",
    prob2Day1Val: "40 batteries (4 symbols)",
    prob2Day2: "Tuesday:",
    prob2Day2Val: "60 batteries (6 symbols)",
    prob2Day3: "Wednesday:",
    prob2Day3Val: "50 batteries (5 symbols)",
    prob2SymbolsCalc: "Symbol calculation:",
    prob2Calc1: "Monday: 40 : 10 ＝ 4 symbols",
    prob2Calc2: "Tuesday: 60 : 10 ＝ 6 symbols",
    prob2Calc3: "Wednesday: 50 : 10 ＝ 5 symbols",
    prob2Tip: "💡 In total: 4 ＋ 6 ＋ 5 ＝ 15 symbols, representing 15 · 10 ＝ 150 batteries.",

    bottomTitle: "Ready to Practice Bar Charts & Pictograms?",
    bottomDesc: "Test your skills with 10 challenging exercises on reading charts, computing frequencies, and solving statistics problems for Grade 6.",
    startExercises: "🎯 Start Exercises",
  },
};

export default function ApeikonisiDataTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστική Απεικόνιση (Ραβδόγραμμα vs Εικονόγραμμα)
  const [viewType, setViewType] = useState('bar');
  const [catA, setCatA] = useState(12); // Ποδόσφαιρο
  const [catB, setCatB] = useState(8);  // Μπάσκετ
  const [catC, setCatC] = useState(6);  // Βόλεϊ
  const [catD, setCatD] = useState(10); // Κολύμβηση

  const categories = useMemo(() => [
    { name: t.sportFootball, value: catA, color: '#3b82f6', icon: '⚽' },
    { name: t.sportBasketball, value: catB, color: '#f59e0b', icon: '🏀' },
    { name: t.sportVolleyball, value: catC, color: '#ec4899', icon: '🏐' },
    { name: t.sportSwimming, value: catD, color: '#06b6d4', icon: '🏊' }
  ], [catA, catB, catC, catD, t]);

  const totalVotes = catA + catB + catC + catD;

  // Εργαστήριο 2: Επιλογή Κλίμακας Υπομνήματος & Οπτική Αναπαράσταση
  const [booksCount, setBooksCount] = useState(30);
  const [symbolScale, setSymbolScale] = useState(5);

  const fullSymbols = Math.floor(booksCount / symbolScale);
  const remainder = booksCount % symbolScale;
  const hasHalfSymbol = remainder >= symbolScale / 2;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/55-apeikonisi-data-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsDesc}
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-center">
                    <span>{t.step1ColCat}</span>
                    <span>{t.step1ColFreq}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-center font-bold text-slate-800">
                    <span>{t.step1SampleCat1}</span>
                    <span className="text-blue-700">{t.step1SampleVal1}</span>
                    <span>{t.step1SampleCat2}</span>
                    <span className="text-blue-700">{t.step1SampleVal2}</span>
                  </div>
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    {t.step2Rule1}
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    {t.step2Rule2}
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    {t.step2Rule3}
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-bold text-indigo-950 font-mono">
                    {t.step3LegendSample}
                  </div>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">
                    {t.step3ExampleText}
                  </p>
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    {t.step4Point1}
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    {t.step4Point2}
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    {t.step4Point3}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ ΚΑΙ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ */}
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
                {t.lab1Desc}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  viewType === 'bar'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.btnBarView}
              </button>
              <button
                type="button"
                onClick={() => setViewType('pictogram')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  viewType === 'pictogram'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.btnPictoView}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήρια Slider */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Άθλημα 1 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>⚽</span> {t.sportFootball}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catA} {t.studentsSuffix}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatA((prev) => Math.max(0, prev - 1)); }}
                    disabled={catA <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catA}
                    onChange={(e) => setCatA(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatA((prev) => Math.min(20, prev + 1)); }}
                    disabled={catA >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Άθλημα 2 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏀</span> {t.sportBasketball}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catB} {t.studentsSuffix}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatB((prev) => Math.max(0, prev - 1)); }}
                    disabled={catB <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catB}
                    onChange={(e) => setCatB(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatB((prev) => Math.min(20, prev + 1)); }}
                    disabled={catB >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Άθλημα 3 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏐</span> {t.sportVolleyball}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catC} {t.studentsSuffix}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatC((prev) => Math.max(0, prev - 1)); }}
                    disabled={catC <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catC}
                    onChange={(e) => setCatC(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatC((prev) => Math.min(20, prev + 1)); }}
                    disabled={catC >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Άθλημα 4 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏊</span> {t.sportSwimming}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-cyan-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catD} {t.studentsSuffix}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatD((prev) => Math.max(0, prev - 1)); }}
                    disabled={catD <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catD}
                    onChange={(e) => setCatD(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatD((prev) => Math.min(20, prev + 1)); }}
                    disabled={catD >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-950">
                {t.totalSurveyed} <strong className="font-mono text-sm sm:text-base">{totalVotes}</strong>
              </div>
            </div>

            {/* Γράφημα */}
            <div className="lg:col-span-7 bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full min-h-[340px]">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
                {viewType === 'bar' ? t.barChartTitle : t.pictoChartTitle}
              </span>

              {viewType === 'bar' ? (
                <div className="w-full max-w-[420px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm relative flex items-center justify-center">
                  <svg viewBox="0 0 380 250" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 5, 10, 15, 20].map((v) => {
                      const y = 205 - (v / 20) * 165;
                      return (
                        <g key={`grid-val-${v}`}>
                          <line x1="42" y1={y} x2="365" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="35" y={y + 4} fontSize="10" fill="#64748b" textAnchor="end" fontWeight="bold">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="42" y1="205" x2="370" y2="205" stroke="#334155" strokeWidth="2" />
                    <line x1="42" y1="205" x2="42" y2="25" stroke="#334155" strokeWidth="2" />

                    {categories.map((cat, i) => {
                      const barWidth = 42;
                      const gap = 38;
                      const x = 65 + i * (barWidth + gap);
                      const barHeight = (cat.value / 20) * 165;
                      const y = 205 - barHeight;

                      return (
                        <g key={`bar-${cat.name}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, 0)}
                            fill={cat.color}
                            rx="5"
                            className="transition-all duration-300"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={Math.max(y - 5, 22)}
                            fontSize="11"
                            fontWeight="bold"
                            fill="#0f172a"
                            textAnchor="middle"
                          >
                            {cat.value}
                          </text>
                          <text
                            x={x + barWidth / 2}
                            y="225"
                            fontSize="11"
                            fontWeight="bold"
                            fill="#475569"
                            textAnchor="middle"
                          >
                            {cat.icon}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm space-y-3">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 text-center">
                    {t.pictoLegendNote}
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {categories.map((cat) => {
                      const fullSyms = Math.floor(cat.value / 2);
                      const hasHalf = cat.value % 2 !== 0;

                      return (
                        <div key={`picto-${cat.name}`} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-1.5">
                          <span className="font-sans font-bold text-slate-700 w-24 sm:w-28 shrink-0 break-words">
                            {cat.name}:
                          </span>
                          <div className="flex flex-wrap items-center gap-1 grow">
                            {Array.from({ length: fullSyms }).map((_, idx) => (
                              <span key={`sym-${idx}`} className="text-base sm:text-lg select-none">
                                {cat.icon}
                              </span>
                            ))}
                            {hasHalf && (
                              <span className="text-[10.5px] font-bold bg-amber-200 px-1 py-0.2 rounded text-amber-950 font-sans">
                                {t.halfSymbolText}
                              </span>
                            )}
                            {cat.value === 0 && (
                              <span className="text-[11px] text-slate-400 font-sans">{t.zeroValueText}</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 w-8 text-right shrink-0">
                            {cat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5 text-center">
                {t.chartObservation}
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΠΙΛΟΓΗ ΚΛΙΜΑΚΑΣ ΚΑΙ ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΣΥΜΒΟΛΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-5 space-y-3.5">
              
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t.booksLabel}</span>
                  <span className="font-mono text-sm sm:text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-black">
                    {booksCount} {t.booksSuffix}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBooksCount((prev) => Math.max(5, prev - 5)); }}
                    disabled={booksCount <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={booksCount}
                    onChange={(e) => setBooksCount(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBooksCount((prev) => Math.min(60, prev + 5)); }}
                    disabled={booksCount >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  {t.chooseLegendScale}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map((s) => (
                    <button
                      key={`sc-${s}`}
                      type="button"
                      onClick={() => setSymbolScale(s)}
                      className={`p-2 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col items-center justify-center gap-0.5 ${
                        symbolScale === s
                          ? 'bg-emerald-600 text-white shadow-sm scale-102'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm sm:text-base">📖</span>
                      <span className="text-[11px] sm:text-xs">＝ {s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-emerald-50/50 p-4 sm:p-6 rounded-3xl border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    {t.pictoRenderTitle}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-mono">
                    📖 ＝ {symbolScale}
                  </span>
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-2xl border border-emerald-100 min-h-[75px] flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: fullSymbols }).map((_, idx) => (
                    <span key={`dyn-sym-${idx}`} className="text-2xl sm:text-3xl select-none">
                      📖
                    </span>
                  ))}
                  {hasHalfSymbol && (
                    <span className="inline-flex items-center justify-center bg-amber-100 border border-amber-300 text-amber-950 font-bold px-1.5 py-0.5 rounded-lg text-xs">
                      ½ 📖
                    </span>
                  )}
                  {fullSymbols === 0 && !hasHalfSymbol && (
                    <span className="text-xs text-slate-400">{t.noSymbolsNeeded}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-500 font-sans block text-[10.5px]">{t.symbolsCountLabel}</span>
                  <strong className="text-emerald-800 text-sm sm:text-base font-black">{fullSymbols}</strong>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-500 font-sans block text-[10.5px]">{t.calcLabel}</span>
                  <strong className="text-slate-800 text-[11px] sm:text-xs">
                    {booksCount} : {symbolScale} ＝ {formatNum(booksCount / symbolScale, locale)}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.examplesTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.examplesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παράδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Category}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Text}
              </p>

              {/* ΣΧΗΜΑ 1: SVG Ραβδόγραμμα Responsive */}
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob1ChartCaption}
                </span>
                <div className="w-full max-w-[340px] mx-auto aspect-[4/3] bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                  <svg viewBox="0 0 340 220" className="w-full h-auto overflow-visible">
                    {[0, 10, 20, 30].map((val) => {
                      const y = 180 - (val / 30) * 140;
                      return (
                        <g key={`p1-grid-${val}`}>
                          <line x1="38" y1={y} x2="320" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="32" y={y + 3.5} fontSize="9.5" fill="#64748b" textAnchor="end" fontWeight="bold">
                            {val}
                          </text>
                        </g>
                      );
                    })}
                    <line x1="38" y1="180" x2="325" y2="180" stroke="#334155" strokeWidth="2" />
                    <line x1="38" y1="180" x2="38" y2="20" stroke="#334155" strokeWidth="2" />

                    {[
                      { label: "Γ'", val: 15, col: '#38bdf8' },
                      { label: "Δ'", val: 20, col: '#3b82f6' },
                      { label: "Ε'", val: 25, col: '#2563eb' },
                      { label: "ΣΤ'", val: 30, col: '#1d4ed8' }
                    ].map((item, idx) => {
                      const bw = 32;
                      const bx = 60 + idx * 65;
                      const bh = (item.val / 30) * 140;
                      const by = 180 - bh;

                      return (
                        <g key={`p1-bar-${item.label}`}>
                          <rect x={bx} y={by} width={bw} height={bh} fill={item.col} rx="4" />
                          <text x={bx + bw / 2} y={by - 3} fontSize="10.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                            {item.val}
                          </text>
                          <text x={bx + bw / 2} y="196" fontSize="10" fontWeight="bold" fill="#475569" textAnchor="middle">
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.prob1QAndA}</span>
                  <div>{t.prob1TotalText}</div>
                  <div>{t.prob1DiffText}</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* Παράδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Category}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Text}
              </p>

              {/* ΣΧΗΜΑ 2: Εικονόγραμμα */}
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 px-1">
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.prob2ChartCaption}
                  </span>
                  <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-mono">
                    {t.prob2Legend}
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 space-y-2 text-xs font-mono">
                  {/* Ημέρα 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">{t.prob2Day1}</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      {t.prob2Day1Val}
                    </span>
                  </div>

                  {/* Ημέρα 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">{t.prob2Day2}</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      {t.prob2Day2Val}
                    </span>
                  </div>

                  {/* Ημέρα 3 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">{t.prob2Day3}</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      {t.prob2Day3Val}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.prob2SymbolsCalc}</span>
                  <div>{t.prob2Calc1}</div>
                  <div>{t.prob2Calc2}</div>
                  <div>{t.prob2Calc3}</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                {t.prob2Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.bottomTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/55-apeikonisi-data-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.startExercises}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}