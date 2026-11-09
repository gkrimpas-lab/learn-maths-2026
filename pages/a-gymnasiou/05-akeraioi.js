import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const translations = {
  el: {
    metaTitle: "Ακέραιοι Αριθμοί | Α' Γυμνασίου",
    metaDescription: "Θεωρία, απόλυτη τιμή, αντίθετοι αριθμοί και διαδραστικός άξονας για τους ακέραιους αριθμούς της Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Η Έννοια των Ακέραιων Αριθμών",
    heroDesc: "Γνωρίζουμε τους θετικούς και αρνητικούς αριθμούς, την τοποθέτησή τους στον προσανατολισμένο άξονα, την έννοια της απόλυτης τιμής και τους αντίθετους αριθμούς.",
    sec1Title: "Θετικοί, Αρνητικοί Αριθμοί & Το Σύνολο ℤ",
    sec1P1: "Στην καθημερινή ζωή συναντάμε μεγέθη με δύο αντίθετες κατευθύνσεις: θερμοκρασία (πάνω ή κάτω από το 0), υψόμετρο (πάνω ή κάτω από την επιφάνεια της θάλασσας), οικονομικές καταστάσεις (κέρδος ή ζημιά).",
    positiveNums: "Θετικοί αριθμοί:",
    positiveNumsDesc: "Βρίσκονται δεξιά από το 0 και γράφονται με πρόσημο ＋ (ή χωρίς πρόσημο): ＋1, ＋2, ＋3...",
    negativeNums: "Αρνητικοί αριθμοί:",
    negativeNumsDesc: "Βρίσκονται αριστερά από το 0 και γράφονται υποχρεωτικά με πρόσημο －: －1, －2, －3...",
    zeroNum: "Το μηδέν (0):",
    zeroNumDesc: "Δεν είναι ούτε θετικός ούτε αρνητικός αριθμός. Είναι το ουδέτερο σημείο αναφοράς.",
    realLifeExamplesTitle: "ΠΑΡΑΔΕΙΓΜΑΤΑ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ",
    tempTitle: "🌡️ Θερμοκρασία",
    tempBelow: "5 βαθμοί υπό το μηδέν:",
    tempAbove: "22 βαθμοί πάνω από το μηδέν:",
    altitudeTitle: "🏔️ Υψόμετρο",
    altPeak: "Κορυφή βουνού:",
    altSea: "Βυθός θάλασσας:",
    financeTitle: "💶 Οικονομικά",
    finDeposit: "Κατάθεση / Κέρδος:",
    finWithdrawal: "Ανάληψη / Χρέος:",
    sec2Title: "Απόλυτη Τιμή & Αντίθετοι Αριθμοί",
    distConceptBadge: "ΓΕΩΜΕΤΡΙΚΗ ΕΝΝΟΙΑ ΑΠΟΣΤΑΣΗΣ",
    absTitle: "Απόλυτη Τιμή Ακέραιου (|α|)",
    absDesc1: "Απόλυτη τιμή ενός αριθμού α ονομάζεται η απόσταση του σημείου που τον παριστάνει στον άξονα από την αρχή Ο(0).",
    absDist5: "απόσταση 5 μονάδες",
    absNote: "Η απόλυτη τιμή εκφράζει απόσταση, επομένως είναι πάντοτε θετικός αριθμός ή μηδέν (|α| ≥ 0).",
    symmConceptBadge: "ΣΥΜΜΕΤΡΙΑ ΩΣ ΠΡΟΣ ΤΟ ΜΗΔΕΝ",
    oppTitle: "Αντίθετοι Αριθμοί",
    oppDesc1: "Δύο αριθμοί που έχουν διαφορετικό πρόσημο αλλά την ίδια απόλυτη τιμή ονομάζονται αντίθετοι.",
    oppOf7: "Αντίθετος του ＋7 είναι ο －7",
    oppOfNeg12: "Αντίθετος του －12 είναι ο ＋12",
    oppOfZero: "Αντίθετος του 0 είναι το 0",
    oppNote: "Οι αντίθετοι αριθμοί βρίσκονται σε ίσες αποστάσεις εκατέρωθεν του μηδενός και το άθροισμά τους είναι πάντα μηδέν:",
    compRulesTitle: "Κανόνες Σύγκρισης Ακεραίων",
    compPosNegTitle: "Θετικός με Αρνητικό",
    compPosNegDesc: "Κάθε θετικός αριθμός είναι μεγαλύτερος από κάθε αρνητικό αριθμό:",
    compZeroTitle: "Σύγκριση με το 0",
    compZeroDesc: "Κάθε θετικός είναι ＞ 0, ενώ κάθε αρνητικός είναι ＜ 0:",
    compTwoNegTitle: "Δύο Αρνητικοί",
    compTwoNegDesc: "Μεγαλύτερος είναι αυτός που έχει τη μικρότερη απόλυτη τιμή (πιο κοντά στο 0):",
    sec3Title: "Διαδραστικό Εργαστήριο: Ολοκληρωμένος Άξονας Ακεραίων",
    pointAControl: "ΣΗΜΕΙΟ Α (ΑΚΕΡΑΙΟΣ α)",
    pointBControl: "ΣΗΜΕΙΟ Β (ΑΚΕΡΑΙΟΣ β)",
    relationsLabel: "ΣΧΕΣΕΙΣ:",
    comparisonLabel: "Σύγκριση:",
    distanceLabel: "Απόσταση (Α, Β) ＝",
    unitsLabel: "μονάδες",
    axisNote: "Κάθε σημείο στον άξονα αντιστοιχεί μονοσήμαντα σε έναν ακέραιο αριθμό (τετμημένη).",
    charPointA: "ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΣΗΜΕΙΟΥ Α:",
    charPointB: "ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΣΗΜΕΙΟΥ Β:",
    valLabel: "Τιμή:",
    absValLabel: "Απόλυτη Τιμή:",
    oppLabel: "Αντίθετος Αριθμός:"
  },
  en: {
    metaTitle: "Integers | 7th Grade Mathematics",
    metaDescription: "Theory, absolute value, opposite numbers and interactive number line for 7th grade integers.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "The Concept of Integers",
    heroDesc: "Explore positive and negative numbers, their placement on the directed number line, the concept of absolute value, and opposite numbers.",
    sec1Title: "Positive, Negative Numbers & The Set ℤ",
    sec1P1: "In daily life we encounter quantities with two opposite directions: temperature (above or below 0), elevation (above or below sea level), financial states (profit or loss).",
    positiveNums: "Positive numbers:",
    positiveNumsDesc: "Located to the right of 0 and written with a ＋ sign (or without a sign): ＋1, ＋2, ＋3...",
    negativeNums: "Negative numbers:",
    negativeNumsDesc: "Located to the left of 0 and strictly written with a － sign: －1, －2, －3...",
    zeroNum: "Zero (0):",
    zeroNumDesc: "Neither positive nor negative. It acts as the neutral reference origin.",
    realLifeExamplesTitle: "REAL-WORLD APPLICATIONS",
    tempTitle: "🌡️ Temperature",
    tempBelow: "5 degrees below zero:",
    tempAbove: "22 degrees above zero:",
    altitudeTitle: "🏔️ Elevation",
    altPeak: "Mountain summit:",
    altSea: "Ocean depth:",
    financeTitle: "💶 Finances",
    finDeposit: "Deposit / Profit:",
    finWithdrawal: "Withdrawal / Debt:",
    sec2Title: "Absolute Value & Opposite Numbers",
    distConceptBadge: "GEOMETRIC CONCEPT OF DISTANCE",
    absTitle: "Absolute Value of an Integer (|a|)",
    absDesc1: "The absolute value of a number a is defined as the distance between the point representing it on the number line and the origin O(0).",
    absDist5: "distance of 5 units",
    absNote: "Absolute value represents distance, hence it is always non-negative (|a| ≥ 0).",
    symmConceptBadge: "SYMMETRY ABOUT ZERO",
    oppTitle: "Opposite Numbers",
    oppDesc1: "Two numbers that have different signs but the exact same absolute value are called opposite numbers.",
    oppOf7: "Opposite of ＋7 is －7",
    oppOfNeg12: "Opposite of －12 is ＋12",
    oppOfZero: "Opposite of 0 is 0",
    oppNote: "Opposite numbers are equidistant from zero and their sum is always zero:",
    compRulesTitle: "Integer Comparison Rules",
    compPosNegTitle: "Positive vs Negative",
    compPosNegDesc: "Every positive number is strictly greater than every negative number:",
    compZeroTitle: "Comparison with 0",
    compZeroDesc: "Every positive is ＞ 0, while every negative is ＜ 0:",
    compTwoNegTitle: "Two Negative Numbers",
    compTwoNegDesc: "The greater number is the one with the smaller absolute value (closer to 0):",
    sec3Title: "Interactive Lab: The Complete Integer Line",
    pointAControl: "POINT A (INTEGER a)",
    pointBControl: "POINT B (INTEGER b)",
    relationsLabel: "RELATIONSHIPS:",
    comparisonLabel: "Comparison:",
    distanceLabel: "Distance (A, B) ＝",
    unitsLabel: "units",
    axisNote: "Every point on the axis corresponds uniquely to a real integer coordinate.",
    charPointA: "POINT A PROPERTIES:",
    charPointB: "POINT B PROPERTIES:",
    valLabel: "Value:",
    absValLabel: "Absolute Value:",
    oppLabel: "Opposite Number:"
  }
};

export default function AkeraioiTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [numA, setNumA] = useState(-4);
  const [numB, setNumB] = useState(6);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);
  const oppositeA = useMemo(() => (numA === 0 ? 0 : -numA), [numA]);
  const oppositeB = useMemo(() => (numB === 0 ? 0 : -numB), [numB]);
  const distanceAB = useMemo(() => Math.abs(numA - numB), [numA, numB]);

  const comparisonSymbol = useMemo(() => {
    if (numA < numB) return '＜';
    if (numA > numB) return '＞';
    return '＝';
  }, [numA, numB]);

  const formatSigned = (val) => {
    if (val > 0) return `＋${val}`;
    if (val < 0) return `－${Math.abs(val)}`;
    return '0';
  };

  const getSvgX = (val) => 350 + val * 28;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/05-akeraioi-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* 1. ΕΙΣΑΓΩΓΗ ΣΤΟΥΣ ΑΚΕΡΑΙΟΥΣ ΑΡΙΘΜΟΥΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.sec1P1}
              </p>
              <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-semibold text-center text-xs sm:text-sm md:text-base font-mono break-words [overflow-wrap:anywhere]">
                ℤ ＝ {'{'} ... , －3, －2, －1, 0, ＋1, ＋2, ＋3, ... {'}'}
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.positiveNums}</strong> {t.positiveNumsDesc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.negativeNums}</strong> {t.negativeNumsDesc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.zeroNum}</strong> {t.zeroNumDesc}
                </li>
              </ul>
            </div>

            {/* Πρακτικές Εφαρμογές */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.realLifeExamplesTitle)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-900">{t.tempTitle}</div>
                  <div className="text-slate-600 break-words [overflow-wrap:anywhere]">{t.tempBelow} <strong>－5 °C</strong></div>
                  <div className="text-slate-600 break-words [overflow-wrap:anywhere]">{t.tempAbove} <strong>＋22 °C</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-900">{t.altitudeTitle}</div>
                  <div className="text-slate-600 break-words [overflow-wrap:anywhere]">{t.altPeak} <strong>＋1.200 m</strong></div>
                  <div className="text-slate-600 break-words [overflow-wrap:anywhere]">{t.altSea} <strong>－350 m</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-indigo-900">{t.financeTitle}</div>
                  <div className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.finDeposit} <strong>＋150 €</strong> | {t.finWithdrawal} <strong>－80 €</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            {/* Απόλυτη Τιμή */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {toCleanUppercase(t.distConceptBadge)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg md:text-xl">
                  {t.absTitle}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.absDesc1}
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1.5">
                  <div className="break-words [overflow-wrap:anywhere]">|＋5| ＝ 5 ({t.absDist5})</div>
                  <div className="break-words [overflow-wrap:anywhere]">|－5| ＝ 5 ({t.absDist5})</div>
                  <div className="break-words [overflow-wrap:anywhere]">|0| ＝ 0</div>
                </div>
                <p className="text-slate-500 text-[11px] sm:text-xs break-words [overflow-wrap:anywhere]">
                  {t.absNote}
                </p>
              </div>
            </div>

            {/* Αντίθετοι Αριθμοί */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {toCleanUppercase(t.symmConceptBadge)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg md:text-xl">
                  {t.oppTitle}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.oppDesc1}
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1.5">
                  <div className="break-words [overflow-wrap:anywhere]">{t.oppOf7}</div>
                  <div className="break-words [overflow-wrap:anywhere]">{t.oppOfNeg12}</div>
                  <div className="break-words [overflow-wrap:anywhere]">{t.oppOfZero}</div>
                </div>
                <p className="text-slate-500 text-[11px] sm:text-xs break-words [overflow-wrap:anywhere]">
                  {t.oppNote} <strong>α ＋ (－α) ＝ 0</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Κανόνες Σύγκρισης & Διάταξης */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-indigo-950 text-sm sm:text-base">
              {t.compRulesTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">{t.compPosNegTitle}</div>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.compPosNegDesc} <strong>＋3 ＞ －8</strong>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">{t.compZeroTitle}</div>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.compZeroDesc} <strong>－4 ＜ 0 ＜ ＋2</strong>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">{t.compTwoNegTitle}</div>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.compTwoNegDesc} <strong>－2 ＞ －7</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΡΙΘΜΗΤΙΚΟΣ ΑΞΟΝΑΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου για Σημείο A και Σημείο B */}
            <div className="space-y-4 sm:space-y-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.pointAControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease Point A"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                    α ＝ {formatSigned(numA)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase Point A"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.pointBControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease Point B"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-amber-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                    β ＝ {formatSigned(numB)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase Point B"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σύγκριση και Απόσταση */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                <div className="text-slate-500 font-sans font-bold text-[11px] sm:text-xs">
                  {toCleanUppercase(t.relationsLabel)}
                </div>
                <div className="text-slate-900 font-bold break-words [overflow-wrap:anywhere]">
                  {t.comparisonLabel} {formatSigned(numA)} {comparisonSymbol} {formatSigned(numB)}
                </div>
                <div className="text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.distanceLabel} {distanceAB} {t.unitsLabel}
                </div>
              </div>
            </div>

            {/* Οπτική Απεικόνιση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4 w-full min-w-0">
              <div className="bg-slate-900 p-3 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center w-full min-w-0 overflow-x-hidden">
                <div className="w-full max-w-[700px]">
                  <svg
                    viewBox="0 0 700 130"
                    className="w-full h-auto max-w-full block"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Κύριος Άξονας x'Ox */}
                    <line x1="30" y1="65" x2="670" y2="65" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="685,65 665,58 665,72" fill="#475569" />
                    <text x="675" y="52" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>
                    <text x="15" y="69" fill="#94a3b8" fontSize="13" fontWeight="bold">x'</text>

                    {/* Υποδιαιρέσεις από -10 έως +10 */}
                    {Array.from({ length: 21 }, (_, i) => i - 10).map((val) => {
                      const x = getSvgX(val);
                      const isZero = val === 0;
                      return (
                        <g key={val}>
                          <line
                            x1={x}
                            y1={isZero ? 48 : 57}
                            x2={x}
                            y2={isZero ? 82 : 73}
                            stroke={isZero ? '#f8fafc' : '#64748b'}
                            strokeWidth={isZero ? '3' : '1.5'}
                          />
                          <text
                            x={x}
                            y={98}
                            textAnchor="middle"
                            fontSize={isZero ? '14' : '11'}
                            fontWeight={isZero ? '900' : '600'}
                            fill={isZero ? '#f8fafc' : '#94a3b8'}
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Σημείο Ο(0) */}
                    <text x="350" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#38bdf8">
                      O
                    </text>

                    {/* Σημείο A */}
                    <g>
                      <circle cx={getSvgX(numA)} cy="65" r="7" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={getSvgX(numA)}
                        y="28"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#818cf8"
                      >
                        A({numA})
                      </text>
                    </g>

                    {/* Σημείο B */}
                    <g>
                      <circle cx={getSvgX(numB)} cy="65" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={getSvgX(numB)}
                        y="28"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#fbbf24"
                      >
                        B({numB})
                      </text>
                    </g>
                  </svg>
                </div>
                <div className="text-slate-400 text-[11px] sm:text-xs mt-2 text-center break-words [overflow-wrap:anywhere]">
                  {t.axisNote}
                </div>
              </div>

              {/* Κάρτες Ιδιοτήτων A & B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1.5 font-mono">
                  <div className="text-indigo-900 font-sans font-bold text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.charPointA)}
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.valLabel} <strong>{formatSigned(numA)}</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.absValLabel} |{numA}| ＝ <strong>{absA}</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.oppLabel} <strong>{formatSigned(oppositeA)}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 font-mono">
                  <div className="text-amber-900 font-sans font-bold text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.charPointB)}
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.valLabel} <strong>{formatSigned(numB)}</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.absValLabel} |{numB}| ＝ <strong>{absB}</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.oppLabel} <strong>{formatSigned(oppositeB)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}