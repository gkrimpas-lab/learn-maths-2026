// pages/st-dimotikou/44-analoga-posa.js
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
export function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono text-center leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1.5 pb-0.5 text-center leading-none break-all text-xs sm:text-sm font-bold">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none break-all text-xs sm:text-sm font-bold">
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
    pageTitle: "Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για τα ανάλογα ποσά, τον συντελεστή αναλογίας, τον πίνακα τιμών, τη γραφική παράσταση και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 44 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ανάλογα Ποσά",
    heroDesc: "Ανακαλύπτουμε πότε δύο ποσά λέγονται ανάλογα, πώς ο σταθερός λόγος τους ορίζει τον συντελεστή αναλογίας, πώς διαβάζουμε τον πίνακα τιμών και γιατί η γραφική τους παράσταση είναι πάντοτε μια ευθεία γραμμή.",
    heroFeature: "Θεωρία & Δυναμικός Πίνακας Συντελεστή Αναλογίας",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 4 Βήματα",
    theorySubtitle: "Η μαθηματική σχέση των ανάλογων ποσών και τα κριτήρια αναγνώρισής τους.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Πότε δύο Ποσά είναι Ανάλογα;",
    step1Text: "Δύο ποσά ονομάζονται ανάλογα όταν, καθώς πολλαπλασιάζεται ή διαιρείται η τιμή του ενός με έναν αριθμό, πολλαπλασιάζεται ή διαιρείται και η τιμή του άλλου με τον ίδιο ακριβώς αριθμό.",
    step1ExamplesHeader: "Παραδείγματα στην πράξη:",
    step1Ex1: "Διπλάσια κιλά πορτοκαλιών → Διπλάσιο κόστος.",
    step1Ex2: "Τριπλάσιος χρόνος εργασίας → Τριπλάσια αμοιβή.",
    step1Ex3: "Μισή ποσότητα αλευριού → Μισά ψωμιά.",
    step1Tip: "💡 Αν το ένα ποσό αυξάνεται αλλά το άλλο δεν αυξάνεται με τον ίδιο ρυθμό, τότε τα ποσά δεν είναι ανάλογα!",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Σταθερός Λόγος",
    step2Title: "Συντελεστής Αναλογίας (λ)",
    step2Text: "Σε δύο ανάλογα ποσά, ο λόγος (το πηλίκο) των αντίστοιχων τιμών τους παραμένει πάντα σταθερός. Ο σταθερός αυτός αριθμός ονομάζεται συντελεστής αναλογίας (λ):",
    step2Or: "ή",
    step2VarsNote: "Όπου x το πρώτο ποσό, y το δεύτερο ποσό και λ ο σταθερός συντελεστής (π.χ. τιμή μονάδας).",
    step2Tip: "⚡ Ο συντελεστής αναλογίας φανερώνει πόσες φορές είναι μεγαλύτερο το ένα μέγεθος από το άλλο.",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Πίνακας Τιμών",
    step3Title: "Ο Πίνακας Ανάλογων Ποσών",
    step3Text: "Στον πίνακα τιμών δύο ανάλογων ποσών, κάθε τιμή της δεύτερης γραμμής προκύπτει πολλαπλασιάζοντας την αντίστοιχη τιμή της πρώτης με το λ:",
    step3ColX: "Ποσό x",
    step3ColY: "Ποσό y",
    step3QuotientsNote: "Πηλίκα: 3 : 1 ＝ 6 : 2 ＝ 9 : 3 ＝ 3 (σταθερό λ).",
    step3Tip: "🎯 Για να ελέγξουμε αν ένας πίνακας περιέχει ανάλογα ποσά, διαιρούμε τα ζεύγη τιμών. Αν τα πηλίκα είναι ίσα, είναι ανάλογα!",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Διάγραμμα",
    step4Title: "Γραφική Παράσταση",
    step4Text: "Όταν τοποθετήσουμε τα ζεύγη τιμών δύο ανάλογων ποσών σε σύστημα αξόνων, όλα τα σημεία βρίσκονται πάνω στην ίδια γραμμή:",
    step4GraphHighlight: "Η γραφική παράσταση ανάλογων ποσών είναι πάντοτε ΕΥΘΕΙΑ ΓΡΑΜΜΗ που περνά από το σημείο (0, 0).",
    step4CurveNote: "Αν η γραμμή είναι καμπύλη ή δεν ξεκινά από το μηδέν (0, 0), τότε τα ποσά δεν είναι ανάλογα.",
    step4Tip: "🚀 Το σημείο (0, 0) σημαίνει ότι όταν η μία ποσότητα είναι μηδέν, και η άλλη είναι υποχρεωτικά μηδέν.",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Πίνακας Τιμών & Συντελεστής Αναλογίας (λ)",
    lab1Subtitle: "Ρυθμίστε τον συντελεστή αναλογίας λ (π.χ. τιμή ανά κιλό) και δείτε πώς διαμορφώνεται αυτόματα ο πίνακας τιμών και τα σταθερά πηλίκα.",
    lab1LambdaLabel: "ΣΥΝΤΕΛΕΣΤΗΣ ΑΝΑΛΟΓΙΑΣ (λ)",
    lab1Interpretation: (l) => (
      <span>
        Ερμηνεία: Για κάθε 1 μονάδα του πρώτου ποσού, αντιστοιχούν {l} μονάδες του δεύτερου ποσού (τύπος: y ＝ {l} · x).
      </span>
    ),
    lab1QuantityLabel: "ΕΠΙΛΕΞΤΕ ΠΟΣΟΤΗΤΑ (x)",
    lab1CalcPrefix: "Υπολογισμός:",
    lab1TableHeader: "ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΜΕ ΣΤΑΘΕΡΑ ΠΗΛΙΚΑ (y : x ＝ λ)",
    lab1ColX: "Ποσό x (kg)",
    lab1ColY: "Ποσό y (€)",
    lab1ColRatio: "Λόγος (y : x)",
    lab1PropertyHeader: "ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ",
    lab1PropertyText: (l) => (
      <span>
        Όλα τα πηλίκα των αντίστοιχων τιμών είναι ίσα μεταξύ τους και ισούνται ακριβώς με τον συντελεστή αναλογίας: λ ＝ {l}.
      </span>
    ),
    lab2Badge: "📈 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Η Γραφική Παράσταση είναι Ευθεία Γραμμή",
    lab2Subtitle: "Σταθερή ταχύτητα σε σχέση με τον χρόνο: Παρατηρήστε πώς τα σημεία σχηματίζουν μια ευθεία γραμμή που ξεκινά πάντοτε από την αρχή των αξόνων (0, 0).",
    lab2SpeedLabel: "ΣΤΑΘΕΡΗ ΤΑΧΥΤΗΤΑ (λ σε km/h)",
    lab2TimeLabel: "ΧΡΟΝΟΣ (ΩΡΕΣ t)",
    lab2PointNote: (h, d) => (
      <span>
        Σημείο στο διάγραμμα: Σε {h} h, η απόσταση είναι {d} km → Συντεταγμένες: ({h}, {d}).
      </span>
    ),
    svgHeader: "ΓΡΑΦΗΜΑ ΣΥΣΤΗΜΑΤΟΣ ΑΞΟΝΩΝ",
    svgAxisX: "Χρόνος t (h)",
    svgAxisY: "Απόσταση d (km)",
    svgFootnote: "Η ευθεία περνά από το (0, 0) επειδή σε χρόνο 0 h διανύουμε ακριβώς 0 km.",
    ctaTitle: "Ώρα για Εξάσκηση στα Ανάλογα Ποσά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις εύρεσης συντελεστή αναλογίας, συμπλήρωσης πινάκων τιμών και ανάλυσης γραφικών παραστάσεων.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Directly Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on directly proportional quantities, proportionality constant, value tables, line graphs, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 44 • 6TH GRADE",
    heroTitle: "Directly Proportional Quantities",
    heroDesc: "Discover when two quantities are directly proportional, how their constant ratio defines the proportionality constant, how to interpret value tables, and why their graph is always a straight line.",
    heroFeature: "Theory & Dynamic Proportionality Constant Table",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 4 Steps",
    theorySubtitle: "The mathematical relationship of proportional quantities and criteria for recognizing them.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "When are Quantities Directly Proportional?",
    step1Text: "Two quantities are directly proportional when multiplying or dividing the value of one by a number causes the value of the other to be multiplied or divided by that exact same number.",
    step1ExamplesHeader: "Real-world examples:",
    step1Ex1: "Double the kilograms of oranges → Double the cost.",
    step1Ex2: "Triple the working hours → Triple the wages.",
    step1Ex3: "Half the quantity of flour → Half the loaves of bread.",
    step1Tip: "💡 If one quantity increases but the other does not increase at the same exact rate, the quantities are NOT directly proportional!",
    step2Badge: "STEP 2",
    step2Sub: "Constant Ratio",
    step2Title: "Proportionality Constant (λ)",
    step2Text: "In directly proportional quantities, the ratio (quotient) of corresponding values is always constant. This constant number is called the constant of proportionality (λ):",
    step2Or: "or",
    step2VarsNote: "Where x is the first quantity, y is the second quantity, and λ is the constant rate (e.g. unit price).",
    step2Tip: "⚡ The proportionality constant indicates how many times larger one quantity is than the other.",
    step3Badge: "STEP 3",
    step3Sub: "Value Table",
    step3Title: "The Proportion Table",
    step3Text: "In a proportion table of two quantities, every value in the second row is obtained by multiplying the corresponding value in the first row by λ:",
    step3ColX: "Quantity x",
    step3ColY: "Quantity y",
    step3QuotientsNote: "Quotients: 3 : 1 ＝ 6 : 2 ＝ 9 : 3 ＝ 3 (constant λ).",
    step3Tip: "🎯 To check if a table represents directly proportional quantities, divide paired values. If all quotients are equal, they are proportional!",
    step4Badge: "STEP 4",
    step4Sub: "Graph",
    step4Title: "Graphical Representation",
    step4Text: "When plotting the coordinate pairs of two directly proportional quantities on a Cartesian plane, all points align along the exact same line:",
    step4GraphHighlight: "The graph of directly proportional quantities is always a STRAIGHT LINE passing through the origin (0, 0).",
    step4CurveNote: "If the line is curved or does not originate at (0, 0), the quantities are not directly proportional.",
    step4Tip: "🚀 The origin point (0, 0) means that when one quantity is zero, the other must necessarily be zero.",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Value Table & Proportionality Constant (λ)",
    lab1Subtitle: "Adjust proportionality constant λ (e.g. price per kg) to see how the value table and constant quotients update automatically.",
    lab1LambdaLabel: "PROPORTIONALITY CONSTANT (λ)",
    lab1Interpretation: (l) => (
      <span>
        Interpretation: For every 1 unit of the first quantity, there correspond {l} units of the second (formula: y ＝ {l} · x).
      </span>
    ),
    lab1QuantityLabel: "CHOOSE QUANTITY (x)",
    lab1CalcPrefix: "Calculation:",
    lab1TableHeader: "VALUE TABLE WITH CONSTANT QUOTIENTS (y : x ＝ λ)",
    lab1ColX: "Quantity x (kg)",
    lab1ColY: "Quantity y (€)",
    lab1ColRatio: "Ratio (y : x)",
    lab1PropertyHeader: "FUNDAMENTAL PROPERTY",
    lab1PropertyText: (l) => (
      <span>
        All quotients of paired values are equal and match the proportionality constant exactly: λ ＝ {l}.
      </span>
    ),
    lab2Badge: "📈 INTERACTIVE LAB 2",
    lab2Title: "The Graph is a Straight Line",
    lab2Subtitle: "Constant speed relative to time: Observe how plotted points form a straight line that always passes through the origin (0, 0).",
    lab2SpeedLabel: "CONSTANT SPEED (λ in km/h)",
    lab2TimeLabel: "TIME (HOURS t)",
    lab2PointNote: (h, d) => (
      <span>
        Point on graph: At {h} h, distance is {d} km → Coordinates: ({h}, {d}).
      </span>
    ),
    svgHeader: "COORDINATE PLANE GRAPH",
    svgAxisX: "Time t (h)",
    svgAxisY: "Distance d (km)",
    svgFootnote: "The line passes through (0, 0) because in 0 hours the distance covered is exactly 0 km.",
    ctaTitle: "Time to Practice Proportional Quantities!",
    ctaDesc: "Challenge yourself with 10 interactive questions on finding the constant of proportionality, completing tables, and analyzing line graphs.",
    ctaBtn: "Start Exercises"
  }
};

export default function AnalogaPosaTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  // Εργαστήριο 1: Συντελεστής Αναλογίας λ (π.χ. τιμή ανά κιλό)
  const [lambda, setLambda] = useState(3.5);
  const [selectedKg, setSelectedKg] = useState(4);

  // Υπολογισμός κόστους για επιλεγμένο x
  const currentCost = useMemo(() => {
    return Number((lambda * selectedKg).toFixed(2));
  }, [lambda, selectedKg]);

  // Τιμές πίνακα αναλογίας για x = 1, 2, 3, 4, 5
  const tableValues = useMemo(() => {
    return [1, 2, 3, 4, 5].map((x) => ({
      x,
      y: Number((lambda * x).toFixed(2)),
      ratio: formatNum(Number((lambda * x).toFixed(2)) / x, 2, locale)
    }));
  }, [lambda, locale]);

  // Εργαστήριο 2: Ταχύτητα σε σχέση με χρόνο & γραφική παράσταση (ευθεία)
  const [speed, setSpeed] = useState(60);
  const [activeHour, setActiveHour] = useState(3);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/44-analoga-posa-ask"
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
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="break-words [overflow-wrap:anywhere]">{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/44-analoga-posa-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight break-words [overflow-wrap:anywhere]">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1 break-words [overflow-wrap:anywhere]">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
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

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="flex items-center justify-center text-sm sm:text-base font-bold text-amber-900 flex-wrap gap-1">
                    <Fraction num="y" den="x" />
                    <span className="mx-1">＝</span>
                    <span className="font-mono font-black text-lg sm:text-xl text-amber-800">λ</span>
                    <span className="mx-1">{t.step2Or}</span>
                    <span className="font-mono font-black text-lg sm:text-xl text-amber-800">y ＝ λ · x</span>
                  </div>
                  <p className="text-slate-500 text-[11px] pt-0.5 break-words [overflow-wrap:anywhere]">
                    {t.step2VarsNote}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1.5">
                  <div className="grid grid-cols-4 gap-1 text-center border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span className="truncate">{t.step3ColX}</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-bold text-indigo-900">
                    <span className="truncate">{t.step3ColY}</span>
                    <span>3</span>
                    <span>6</span>
                    <span>9</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 text-center pt-0.5 font-sans break-words [overflow-wrap:anywhere]">
                    {t.step3QuotientsNote}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step4Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-center text-xs break-words [overflow-wrap:anywhere]">
                    {t.step4GraphHighlight}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed break-words [overflow-wrap:anywhere]">
                    {t.step4CurveNote}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΣΥΝΤΕΛΕΣΤΗΣ ΑΝΑΛΟΓΙΑΣ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.lab1Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5 break-words [overflow-wrap:anywhere]">
                {t.lab1Subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήριο Συντελεστή λ */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                    {t.lab1LambdaLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-amber-800 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    λ ＝ {formatNum(lambda, 1, locale)}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLambda((prev) => Math.max(1, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={lambda <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease lambda"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={0.5}
                    value={lambda}
                    onChange={(e) => setLambda(Number(e.target.value))}
                    aria-label="Constant lambda"
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLambda((prev) => Math.min(8, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={lambda >= 8}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase lambda"
                  >
                    ＋
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5 break-words [overflow-wrap:anywhere]">
                  {t.lab1Interpretation(formatNum(lambda, 1, locale))}
                </p>
              </div>

              {/* Δοκιμή συγκεκριμένης τιμής */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.lab1QuantityLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-800 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                    x ＝ {selectedKg}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedKg((prev) => Math.max(1, prev - 1)); }}
                    disabled={selectedKg <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease x"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={selectedKg}
                    onChange={(e) => setSelectedKg(Number(e.target.value))}
                    aria-label="Quantity x"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedKg((prev) => Math.min(10, prev + 1)); }}
                    disabled={selectedKg >= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase x"
                  >
                    ＋
                  </button>
                </div>
                {/* Διόρθωση [object Object] bug: Εμφάνιση απευθείας ως JSX elements */}
                <div className="pt-1 text-center font-bold text-slate-800 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 flex-wrap w-full">
                  <span>{t.lab1CalcPrefix}</span>
                  <span>y ＝ {formatNum(lambda, 1, locale)} · {selectedKg} ＝</span>
                  <span className="font-mono text-emerald-700 text-sm sm:text-base font-black">
                    {formatNum(currentCost, 2, locale)}
                  </span>
                </div>
              </div>

            </div>

            {/* Πίνακας Τιμών & Πηλίκων */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4 w-full min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center break-words [overflow-wrap:anywhere]">
                {t.lab1TableHeader}
              </div>

              <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm text-center text-xs font-mono">
                <div className="grid grid-cols-4 sm:grid-cols-6 bg-slate-100 border-b border-slate-200 text-slate-700 font-bold p-2 min-w-[280px]">
                  <span className="text-left font-sans truncate">{t.lab1ColX}</span>
                  {tableValues.slice(0, 3).map((item) => (
                    <span key={`head-x-sm-${item.x}`} className="sm:hidden">
                      {item.x}
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`head-x-${item.x}`} className="hidden sm:inline">
                      {item.x}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 border-b border-slate-100 text-indigo-900 font-bold p-2 min-w-[280px]">
                  <span className="text-left font-sans text-slate-600 truncate">{t.lab1ColY}</span>
                  {tableValues.slice(0, 3).map((item) => (
                    <span key={`body-y-sm-${item.x}`} className="sm:hidden text-indigo-700 font-black">
                      {formatNum(item.y, 1, locale)}
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`body-y-${item.x}`} className="hidden sm:inline text-indigo-700 font-black">
                      {formatNum(item.y, 1, locale)}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 bg-amber-50/50 text-amber-950 font-bold p-2 min-w-[280px]">
                  <span className="text-left font-sans text-slate-600 truncate">{t.lab1ColRatio}</span>
                  {tableValues.slice(0, 3).map((item) => (
                    <span key={`body-ratio-sm-${item.x}`} className="sm:hidden text-amber-800">
                      {item.ratio}
                    </span>
                  ))}
                  {tableValues.map((item) => (
                    <span key={`body-ratio-${item.x}`} className="hidden sm:inline text-amber-800">
                      {item.ratio}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-emerald-100 text-center space-y-0.5">
                <span className="text-[11px] font-bold text-emerald-900 uppercase block">
                  {t.lab1PropertyHeader}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.lab1PropertyText(formatNum(lambda, 1, locale))}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>{t.lab2Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5 break-words [overflow-wrap:anywhere]">
                {t.lab2Subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Ρυθμίσεις Ταχύτητας & Ώρας */}
            <div className="lg:col-span-5 space-y-3.5">
              
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-700 tracking-wider">
                    {t.lab2SpeedLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {speed} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeed((prev) => Math.max(40, prev - 10)); }}
                    disabled={speed <= 40}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease speed"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={10}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    aria-label="Speed"
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeed((prev) => Math.min(100, prev + 10)); }}
                    disabled={speed >= 100}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase speed"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-700 tracking-wider">
                    {t.lab2TimeLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {activeHour} h
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHour((prev) => Math.max(1, prev - 1)); }}
                    disabled={activeHour <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Decrease hour"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={activeHour}
                    onChange={(e) => setActiveHour(Number(e.target.value))}
                    aria-label="Hours"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHour((prev) => Math.min(4, prev + 1)); }}
                    disabled={activeHour >= 4}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                    aria-label="Increase hour"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 break-words [overflow-wrap:anywhere]">
                {t.lab2PointNote(activeHour, speed * activeHour)}
              </div>

            </div>

            {/* SVG Διάγραμμα Αξόνων */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center break-words [overflow-wrap:anywhere]">
                {t.svgHeader}
              </span>

              <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 relative shadow-inner">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" role="img" aria-label="Line graph of proportional quantities">
                  {/* Πλέγμα */}
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={`grid-x-${i}`}
                      x1={50 + i * 75}
                      y1={50}
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
                  <line x1="50" y1="350" x2="370" y2="350" stroke="#334155" strokeWidth="2.5" />
                  <line x1="50" y1="350" x2="50" y2="30" stroke="#334155" strokeWidth="2.5" />

                  {/* Βέλη αξόνων */}
                  <polygon points="370,346 378,350 370,354" fill="#334155" />
                  <polygon points="46,30 50,22 54,30" fill="#334155" />

                  {/* Ετικέτες αξόνων */}
                  <text x="365" y="375" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">{t.svgAxisX}</text>
                  <text x="25" y="25" fontSize="11" fontWeight="bold" fill="#64748b">{t.svgAxisY}</text>

                  {/* Αριθμοί άξονα X */}
                  {[1, 2, 3, 4].map((h) => (
                    <text key={`tx-${h}`} x={50 + h * 75} y="368" fontSize="12" fontWeight="bold" fill="#475569" textAnchor="middle">
                      {h}
                    </text>
                  ))}

                  {/* Αριθμοί άξονα Y */}
                  {[1, 2, 3, 4].map((step) => (
                    <text key={`ty-${step}`} x="42" y={355 - step * 70} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="end">
                      {step * 100}
                    </text>
                  ))}

                  {/* Ευθεία Γραμμή Αναλογίας */}
                  <line
                    x1="50"
                    y1="350"
                    x2={50 + 4 * 75}
                    y2={350 - ((speed * 4) / 400) * 280}
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Σημείο (0,0) */}
                  <circle cx="50" cy="350" r="5" fill="#0f172a" />
                  <text x="40" y="365" fontSize="11" fontWeight="bold" fill="#0f172a">0</text>

                  {/* Ενεργό σημείο */}
                  <circle
                    cx={50 + activeHour * 75}
                    cy={350 - ((speed * activeHour) / 400) * 280}
                    r="7"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5 text-center break-words [overflow-wrap:anywhere]">
                {t.svgFootnote}
              </span>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight break-words [overflow-wrap:anywhere]">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg break-words [overflow-wrap:anywhere]">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/44-analoga-posa-ask"
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