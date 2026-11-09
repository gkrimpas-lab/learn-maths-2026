// pages/st-dimotikou/21-dinameis.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [
  { base: 2, exp: 3 },
  { base: 3, exp: 2 },
  { base: 5, exp: 2 },
  { base: 2, exp: 4 },
  { base: 10, exp: 3 },
  { base: 4, exp: 3 }
];

const MAX_BASE = 50;
const MAX_EXP = 10;

const EXPONENTS_UNICODE = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  10: '¹⁰'
};

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

// Μορφοποίηση αριθμών με βάση το εκάστοτε locale
function formatNumber(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc);
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Ανακάλυψε τη δύναμη του σύντομου πολλαπλασιασμού! Μάθε τι είναι η Βάση, τι δείχνει ο Εκθέτης και πώς υπολογίζουμε το Τετράγωνο και τον Κύβο ενός αριθμού για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 21 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Δυνάμεις Φυσικών Αριθμών",
    heroDesc: "Ανακάλυψε τη δύναμη του σύντομου πολλαπλασιασμού! Μάθε τι είναι η Βάση, τι δείχνει ο Εκθέτης και πώς υπολογίζουμε το Τετράγωνο και τον Κύβο ενός αριθμού!",
    heroFeature: "Ανάλυση Γινομένου & Γεωμετρική Ερμηνεία (Τετράγωνο - Κύβος)",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Ιδιότητες των Δυνάμεων",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για τον σύντομο πολλαπλασιασμό ίσων παραγόντων.",
    card1Badge: "ΟΡΙΣΜΟΣ",
    card1Sub: "Ίσοι Παράγοντες",
    card1Title: "Τι είναι η Δύναμη;",
    card1Text: "Δύναμη είναι η σύντομη γραφή ενός γινομένου όπου όλοι οι παράγοντες είναι ίσοι μεταξύ τους.",
    card1Tip: "💡 Όπως η πρόσθεση ίσων αριθμών γίνεται πολλαπλασιασμός (2 ＋ 2 ＋ 2 ＝ 3 · 2), έτσι και το γινόμενο ίσων αριθμών γίνεται δύναμη (2 · 2 · 2 ＝ 2³)!",
    card2Badge: "ΡΟΛΟΣ ΣΤΟΙΧΕΙΩΝ",
    card2Sub: "α στη ν",
    card2Title: "Βάση & Εκθέτης",
    card2Base: "Βάση (α): Ο αριθμός που πολλαπλασιάζεται.",
    card2Exp: "Εκθέτης (ν): Δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.",
    card2Times: "ν φορές",
    card2Tip: "⚡ Προσοχή SOS: Το 2³ ΔΕΝ σημαίνει 2 · 3 ＝ 6! Σημαίνει 2 · 2 · 2 ＝ 8.",
    card3Badge: "ΕΙΔΙΚΟΙ ΚΑΝΟΝΕΣ",
    card3Sub: "Εκθέτες 0 & 1",
    card3Title: "Ειδικές Περιπτώσεις SOS",
    card3Rule1: "α¹ ＝ α: Κάθε αριθμός στον εκθέτη 1 παραμένει ίδιος.",
    card3Rule2: "α⁰ ＝ 1: Κάθε αριθμός (εκτός του 0) στον εκθέτη 0 ισούται με 1.",
    card3Rule3: "10ⁿ: Το 1 ακολουθούμενο από ν μηδενικά.",
    card3Tip: "🎯 Ο εκθέτης 2 ονομάζεται τετράγωνο (εμβαδόν) και ο εκθέτης 3 κύβος (όγκος)!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Δυνάμεων",
    labSubtitle: "Όρισε τη βάση και τον εκθέτη και δες άμεσα την ανάλυση σε γινόμενο, τη γεωμετρική απεικόνιση και τον τελικό υπολογισμό!",
    settingsTitle: "ΡΥΘΜΙΣΗ ΔΥΝΑΜΗΣ:",
    baseLabel: "Βάση (α):",
    expLabel: "Εκθέτης (ν):",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    labWarning: "💡 Προσοχή: Το 2³ ΔΕΝ είναι 2 · 3 ＝ 6, αλλά 2 · 2 · 2 ＝ 8!",
    analysisTitle: "ΑΝΑΛΥΣΗ ΤΗΣ ΔΥΝΑΜΗΣ:",
    reads: "Διαβάζεται:",
    breakdownTitle: "🔍 1. ΑΝΑΛΥΣΗ ΣΕ ΓΙΝΟΜΕΝΟ ΙΣΩΝ ΠΑΡΑΓΟΝΤΩΝ:",
    zeroExpNote: "1 (Κάθε μη μηδενικός αριθμός με εκθέτη 0 ισούται με 1)",
    oneFactorNote: "(1 παράγοντας)",
    multiplyNote: (b, e) => `Πολλαπλασιάζουμε τη βάση (${b}) με τον εαυτό της ${e} φορές.`,
    geoTitle: (type) => `📐 ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ (${type}):`,
    typeSquare: "ΤΕΤΡΑΓΩΝΟ",
    typeCube: "ΚΥΒΟΣ",
    geoSquareDesc: (b, res) => `Εμβαδόν Τετραγώνου με πλευρά ${b}: ${b} · ${b} ＝ ${res} τετραγωνάκια`,
    geoCubeDesc: (b, res) => `Όγκος Κύβου με ακμή ${b}: ${b} · ${b} · ${b} ＝ ${res} κυβάκια`,
    finalTitle: "ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ:",
    byDefinition: "1 (εξ ορισμού)",
    ctaTitle: "Ώρα για Εξάσκηση στις Δυνάμεις!",
    ctaDesc: "Έμαθες να υπολογίζεις δυνάμεις, τετράγωνα και κύβους; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων",
    pronounce: {
      zero: (b) => `${b} στη μηδενική`,
      one: (b) => `${b} στην πρώτη (ή απλά ${b})`,
      square: (b) => `${b} στο τετράγωνο (ή ${b} στη δευτέρα)`,
      cube: (b) => `${b} στον κύβο (ή ${b} στην τρίτη)`,
      other: (b, e) => `${b} στην ${e}η δύναμη`
    }
  },
  en: {
    pageTitle: "Powers of Natural Numbers - 6th Grade | LearnMaths.gr",
    pageDesc: "Discover the power of repeated multiplication! Learn about Base, Exponent, and how to calculate Squares and Cubes of numbers.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 21 • 6TH GRADE",
    heroTitle: "Powers of Natural Numbers",
    heroDesc: "Discover the power of repeated multiplication! Learn what the Base represents, what the Exponent indicates, and how to calculate the Square and Cube of a number!",
    heroFeature: "Product Breakdown & Geometric Interpretation (Square - Cube)",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Properties of Powers",
    theorySubtitle: "Everything you need to know about the concise multiplication of equal factors.",
    card1Badge: "DEFINITION",
    card1Sub: "Equal Factors",
    card1Title: "What is a Power?",
    card1Text: "A power is the shorthand notation for multiplying equal factors repeatedly.",
    card1Tip: "💡 Just as repeated addition becomes multiplication (2 ＋ 2 ＋ 2 ＝ 3 · 2), repeated multiplication becomes a power (2 · 2 · 2 ＝ 2³)! ",
    card2Badge: "COMPONENTS",
    card2Sub: "a to the n",
    card2Title: "Base & Exponent",
    card2Base: "Base (a): The factor being repeatedly multiplied.",
    card2Exp: "Exponent (n): Shows how many times the base is multiplied by itself.",
    card2Times: "n times",
    card2Tip: "⚡ Watch Out SOS: 2³ DOES NOT mean 2 · 3 ＝ 6! It means 2 · 2 · 2 ＝ 8.",
    card3Badge: "SPECIAL RULES",
    card3Sub: "Exponents 0 & 1",
    card3Title: "Special Rules SOS",
    card3Rule1: "a¹ ＝ a: Any number raised to the power of 1 equals itself.",
    card3Rule2: "a⁰ ＝ 1: Any non-zero number raised to the power of 0 equals 1.",
    card3Rule3: "10ⁿ: The digit 1 followed by n zeros.",
    card3Tip: "🎯 Exponent 2 is called square (area) and exponent 3 is called cube (volume)!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Powers Lab",
    labSubtitle: "Set the base and exponent to instantly visualize the repeated multiplication, geometric model, and final calculation!",
    settingsTitle: "POWER SETTINGS:",
    baseLabel: "Base (a):",
    expLabel: "Exponent (n):",
    presetsTitle: "PRESET EXAMPLES:",
    labWarning: "💡 Attention: 2³ is NOT 2 · 3 ＝ 6, but 2 · 2 · 2 ＝ 8!",
    analysisTitle: "POWER ANALYSIS:",
    reads: "Pronounced:",
    breakdownTitle: "🔍 1. EXPANSION INTO EQUAL FACTORS:",
    zeroExpNote: "1 (Any non-zero number with exponent 0 equals 1)",
    oneFactorNote: "(1 factor)",
    multiplyNote: (b, e) => `Multiply base (${b}) by itself ${e} times.`,
    geoTitle: (type) => `📐 GEOMETRIC MODEL (${type}):`,
    typeSquare: "SQUARE",
    typeCube: "CUBE",
    geoSquareDesc: (b, res) => `Area of Square with side length ${b}: ${b} · ${b} ＝ ${res} units²`,
    geoCubeDesc: (b, res) => `Volume of Cube with edge length ${b}: ${b} · ${b} · ${b} ＝ ${res} units³`,
    finalTitle: "FINAL RESULT:",
    byDefinition: "1 (by definition)",
    ctaTitle: "Time to Practice Powers!",
    ctaDesc: "Mastered powers, squares, and cubes? Test your skills with 10 challenging interactive exercises to solidify your knowledge!",
    ctaBtn: "Start Exercises",
    pronounce: {
      zero: (b) => `${b} to the power of zero`,
      one: (b) => `${b} to the first power (or just ${b})`,
      square: (b) => `${b} squared`,
      cube: (b) => `${b} cubed`,
      other: (b, e) => `${b} to the power of ${e}`
    }
  }
};

export default function DinameisPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);

  const handleBaseChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setBase('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_BASE) {
      setBase(n);
    }
  };

  const handleExpChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setExponent('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_EXP) {
      setExponent(n);
    }
  };

  const b = typeof base === 'number' ? base : 0;
  const e = typeof exponent === 'number' ? exponent : 0;

  // Υπολογισμός αποτελέσματος
  const result = Math.pow(b, e);

  // Δημιουργία λίστας παραγόντων
  const factorsList = e > 0 ? Array(e).fill(b) : [];
  const multiplicationString =
    e === 0
      ? t.byDefinition
      : e === 1
      ? `${b}`
      : factorsList.join(' · ');

  // Ανάγνωση δύναμης
  const getPowerPronunciation = (baseVal, expVal) => {
    if (expVal === 0) return t.pronounce.zero(baseVal);
    if (expVal === 1) return t.pronounce.one(baseVal);
    if (expVal === 2) return t.pronounce.square(baseVal);
    if (expVal === 3) return t.pronounce.cube(baseVal);
    return t.pronounce.other(baseVal, expVal);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/21-dinameis-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
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
              href="/st-dimotikou/21-dinameis-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.card1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card1Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2 · 2 · 2 · 2 ＝ <strong className="text-sky-700">2⁴ ＝ 16</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.card1Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">{t.card2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card2Title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1">
                  <p>• <strong>{t.card2Base}</strong></p>
                  <p>• <strong>{t.card2Exp}</strong></p>
                </div>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>α<sup>ν</sup> ＝ α · α · ... · α&nbsp;&nbsp;<span className="text-slate-500 font-sans font-normal text-xs">({t.card2Times})</span></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.card2Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">{t.card3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card3Title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1">
                  <p>• <strong>{t.card3Rule1}</strong></p>
                  <p>• <strong>{t.card3Rule2}</strong></p>
                  <p>• <strong>{t.card3Rule3}</strong></p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex flex-wrap justify-center gap-2 font-bold">
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-800">5¹ ＝ 5</span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-800">7⁰ ＝ 1</span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-cyan-700">10³ ＝ {formatNumber(1000, locale)}</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labSubtitle}
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* INPUTS */}
                <div className="space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.settingsTitle}
                  </span>

                  {/* ΒΑΣΗ */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 flex justify-between uppercase">
                      <span>{t.baseLabel}</span>
                      <span className="text-blue-600 font-mono font-bold">1 － {MAX_BASE}</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={base}
                      onChange={(e) => handleBaseChange(e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                      placeholder="π.χ. 2"
                    />
                  </div>

                  {/* ΕΚΘΕΤΗΣ */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 flex justify-between uppercase">
                      <span>{t.expLabel}</span>
                      <span className="text-indigo-600 font-mono font-bold">0 － {MAX_EXP}</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={exponent}
                      onChange={(e) => handleExpChange(e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                      placeholder="π.χ. 3"
                    />
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBase(p.base);
                          setExponent(p.exp);
                        }}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
                          b === p.base && e === p.exp
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        {p.base}{EXPONENTS_UNICODE[p.exp] || `^${p.exp}`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.labWarning}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS */}
              <div className="w-full text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  {t.analysisTitle}
                </span>
                <div className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 sm:px-8 py-2 rounded-2xl border border-indigo-100 inline-block tracking-wider shadow-sm">
                  {base !== '' ? base : 'α'}
                  <sup className="text-rose-600 text-lg sm:text-xl md:text-2xl">
                    {exponent !== '' ? (EXPONENTS_UNICODE[e] || exponent) : 'ν'}
                  </sup>
                  {' ＝ '}
                  <span className="text-amber-500">
                    {base !== '' && exponent !== '' ? formatNumber(result, locale) : '—'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium italic pt-1">
                  📖 {t.reads} «{getPowerPronunciation(b, e)}»
                </p>
              </div>

              {/* 2. ΑΝΑΛΥΣΗ ΣΕ ΓΙΝΟΜΕΝΟ & ΟΠΤΙΚΟΠΟΙΗΣΗ */}
              <div className="w-full space-y-4">
                
                {/* ΚΑΡΤΑ ΑΝΑΛΥΣΗΣ ΓΙΝΟΜΕΝΟΥ */}
                <div className="bg-slate-50 p-4 sm:p-5 md:p-6 rounded-3xl border border-slate-200 shadow-inner space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center sm:text-left">
                    {t.breakdownTitle}
                  </span>

                  <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm sm:text-base md:text-lg">
                    <span className="font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">
                      {b}{EXPONENTS_UNICODE[e] || `^${e}`}
                    </span>
                    <span className="text-slate-400 font-black">＝</span>
                    
                    {e === 0 ? (
                      <span className="text-slate-600 font-bold bg-white px-3 sm:px-4 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-center">
                        {t.zeroExpNote}
                      </span>
                    ) : e === 1 ? (
                      <span className="text-slate-800 font-bold bg-white px-4 py-1.5 rounded-xl border border-slate-200">
                        {b} {t.oneFactorNote}
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        {factorsList.map((factor, idx) => (
                          <span key={idx} className="flex items-center gap-1.5">
                            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-black flex items-center justify-center text-xs sm:text-sm shadow-xs">
                              {factor}
                            </span>
                            {idx < factorsList.length - 1 && (
                              <span className="text-slate-400 font-black text-xs sm:text-sm">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-slate-400 font-black">＝</span>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-3 sm:px-4 py-1 rounded-xl border border-emerald-300">
                      {formatNumber(result, locale)}
                    </span>
                  </div>

                  <p className="text-center text-xs text-slate-500 font-medium">
                    {e > 1 && t.multiplyNote(b, e)}
                  </p>
                </div>

                {/* ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΓΙΑ ΤΕΤΡΑΓΩΝΟ (e=2) ΚΑΙ ΚΥΒΟΣ (e=3) */}
                {(e === 2 || e === 3) && b <= 12 && b >= 1 && (
                  <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                    <span className="text-xs 2xl:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                      {t.geoTitle(e === 2 ? t.typeSquare : t.typeCube)}
                    </span>

                    {e === 2 ? (
                      <div className="flex flex-col items-center space-y-2 overflow-x-auto p-1">
                        <div
                          className="grid gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shadow-inner max-w-full"
                          style={{
                            gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))`,
                            width: 'fit-content'
                          }}
                        >
                          {Array.from({ length: b * b }).map((_, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 sm:w-6 sm:h-6 rounded-md bg-blue-500/80 border border-blue-400/40 shadow-xs"
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-slate-300 text-center">
                          {t.geoSquareDesc(b, formatNumber(result, locale))}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center space-y-1.5 py-1">
                        <div className="text-3xl">🧊</div>
                        <p className="text-xs sm:text-sm font-mono text-slate-200">
                          {t.geoCubeDesc(b, formatNumber(result, locale))}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* 3. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  {t.finalTitle}
                </span>
                <div className="text-base sm:text-xl md:text-2xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>
                    {b}
                    <sup className="text-rose-300">{EXPONENTS_UNICODE[e] || `^${e}`}</sup>
                  </span>
                  <span>＝</span>
                  <span className="text-blue-100 text-sm sm:text-lg md:text-xl font-medium">
                    ({multiplicationString})
                  </span>
                  <span>＝</span>
                  <span className="text-amber-300 text-xl sm:text-2xl md:text-3xl font-black bg-white/10 px-3 py-0.5 rounded-xl shadow-xs inline-block">
                    {formatNumber(result, locale)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/21-dinameis-ask"
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