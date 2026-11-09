import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const PRESETS_2 = [
  { n1: 12, n2: 18, labelEl: 'Μ.Κ.Δ.(12, 18)', labelEn: 'GCD(12, 18)' },
  { n1: 20, n2: 30, labelEl: 'Μ.Κ.Δ.(20, 30)', labelEn: 'GCD(20, 30)' },
  { n1: 24, n2: 36, labelEl: 'Μ.Κ.Δ.(24, 36)', labelEn: 'GCD(24, 36)' }
];
const PRESETS_3 = [
  { n1: 12, n2: 18, n3: 24, labelEl: 'Μ.Κ.Δ.(12, 18, 24)', labelEn: 'GCD(12, 18, 24)' },
  { n1: 15, n2: 30, n3: 45, labelEl: 'Μ.Κ.Δ.(15, 30, 45)', labelEn: 'GCD(15, 30, 45)' },
  { n1: 16, n2: 24, n3: 32, labelEl: 'Μ.Κ.Δ.(16, 24, 32)', labelEn: 'GCD(16, 24, 32)' }
];
const PRESETS_4 = [
  { n1: 12, n2: 16, n3: 20, n4: 24, labelEl: 'Μ.Κ.Δ.(12, 16, 20, 24)', labelEn: 'GCD(12, 16, 20, 24)' },
  { n1: 20, n2: 40, n3: 60, n4: 80, labelEl: 'Μ.Κ.Δ.(20, 40, 60, 80)', labelEn: 'GCD(20, 40, 60, 80)' }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς να βρίσκεις τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 14 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)",
    heroDesc: "Μάθε πώς να βρίσκεις τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον Μέγιστο Κοινό Διαιρέτη για τέλειο ισόποσο μοίρασμα χωρίς υπόλοιπο!",
    heroPills: "Κοινοί Διαιρέτες & Διαδραστική Οπτική Κατάτμηση",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Στρατηγική Εύρεσης",
    theorySubtitle: "Κατανόησε τη σημασία του Μ.Κ.Δ. και πώς χρησιμοποιείται στην επίλυση προβλημάτων.",
    cards: [
      {
        badge: "ΟΡΙΣΜΟΣ",
        sub: "Μέγιστος",
        title: "Τι είναι ο Μ.Κ.Δ.;",
        body: "Μέγιστος Κοινός Διαιρέτης δύο ή περισσότερων φυσικών αριθμών ονομάζεται ο μεγαλύτερος από όλους τους κοινούς τους διαιρέτες.",
        example: "Μ.Κ.Δ.(12, 18) ＝ 6",
        tip: "💡 Ο Μ.Κ.Δ. εκφράζει το μέγιστο μέγεθος ομάδας για τέλειο μοίρασμα χωρίς να περισσεύει τίποτα."
      },
      {
        badge: "ΜΕΘΟΔΟΣ",
        sub: "3 Βήματα",
        title: "Πώς τον βρίσκουμε;",
        body: "1. Γράφουμε όλους τους διαιρέτες κάθε αριθμού.\n2. Εντοπίζουμε τους κοινούς διαιρέτες.\n3. Επιλέγουμε τον μεγαλύτερο από αυτούς.",
        example: "Κοινοί(12, 18) ＝ { 1, 2, 3, 6 }",
        tip: "⚡ Όλοι οι κοινοί διαιρέτες είναι πάντοτε και διαιρέτες του Μ.Κ.Δ.!"
      },
      {
        badge: "ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ",
        sub: "Μ.Κ.Δ. ＝ 1",
        title: "Πρώτοι μεταξύ τους",
        body: "Αν δύο αριθμοί δεν έχουν κανέναν άλλο κοινό διαιρέτη εκτός από το 1, τότε ονομάζονται πρώτοι μεταξύ τους (Μ.Κ.Δ. ＝ 1).",
        example: "Μ.Κ.Δ.(8, 15) ＝ 1",
        tip: "🎯 Δύο διαδοχικοί φυσικοί αριθμοί (π.χ. 8 και 9) είναι πάντοτε πρώτοι μεταξύ τους."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Υπολογισμού Μ.Κ.Δ.",
    labDesc: "Διάλεξε πόσους αριθμούς θέλεις να συγκρίνεις (2, 3 ή 4) και δες αυτόματα όλους τους κοινούς διαιρέτες και τον Μ.Κ.Δ.!",
    tabNumbers: (n) => `${n} ΑΡΙΘΜΟΙ`,
    inputHeader: "Πληκτρολόγησε τους Αριθμούς (1 - 100):",
    inputSub: "Συμπλήρωσε τους αριθμούς στα αντίστοιχα πεδία.",
    numLabels: ['1ος Αριθμός', '2ος Αριθμός', '3ος Αριθμός', '4ος Αριθμός'],
    presetLabel: "Ή επίλεξε έτοιμο παράδειγμα:",
    tipCommon: "💡 Οι κοινοί διαιρέτες επισημαίνονται με κίτρινο πλαίσιο και ο Μ.Κ.Δ. με χρυσό τρόπαιο 🏆!",
    divisorsOf: "Διαιρέτες του",
    divisorsCount: (count) => `${count} διαιρέτες`,
    visualPartitionTitle: (mkdVal) => `📊 ΟΠΤΙΚΗ ΚΑΤΑΤΜΗΣΗ: ΠΩΣ Ο Μ.Κ.Δ. (${mkdVal}) ΜΕΤΡΑΕΙ ΑΚΡΙΒΩΣ ΤΟΥΣ ΑΡΙΘΜΟΥΣ`,
    piecesOf: (segments, mkdVal) => `${segments} κομμάτια των ${mkdVal}`,
    finalResultTitle: "ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ:",
    finalResultFormula: (nums, val) => `Μ.Κ.Δ.(${nums}) ＝ ${val}`,
    ctaTitle: "Ώρα για Εξάσκηση στον Μ.Κ.Δ.!",
    ctaDesc: "Έμαθες πώς υπολογίζεται ο Μέγιστος Κοινός Διαιρέτης; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Greatest Common Divisor (GCD) - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how to find common divisors of two or more numbers and identify the Greatest Common Divisor (GCD) for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 14 • GRADE 6",
    heroTitle: "Greatest Common Divisor (GCD)",
    heroDesc: "Learn how to find the common divisors of two or more whole numbers and identify the Greatest Common Divisor for perfect equal partitioning without remainders!",
    heroPills: "Common Divisors & Interactive Visual Bar Partitioning",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Finding Strategy",
    theorySubtitle: "Understand the mathematical significance of the GCD and its real-world problem-solving utility.",
    cards: [
      {
        badge: "DEFINITION",
        sub: "Greatest",
        title: "What is the GCD?",
        body: "The Greatest Common Divisor of two or more whole numbers is the largest integer that divides all of them exactly.",
        example: "GCD(12, 18) ＝ 6",
        tip: "💡 The GCD represents the largest possible group size for equal partitioning without leftover items."
      },
      {
        badge: "METHOD",
        sub: "3 Steps",
        title: "How to Find It?",
        body: "1. List all divisors of each number.\n2. Identify the common divisors.\n3. Choose the largest common divisor.",
        example: "Common(12, 18) ＝ { 1, 2, 3, 6 }",
        tip: "⚡ Every common divisor is always a divisor of the GCD itself!"
      },
      {
        badge: "SPECIAL CASE",
        sub: "GCD ＝ 1",
        title: "Relatively Prime (Coprime)",
        body: "If two numbers share no common divisor other than 1, they are called relatively prime or coprime (GCD ＝ 1).",
        example: "GCD(8, 15) ＝ 1",
        tip: "🎯 Any two consecutive natural numbers (e.g., 8 and 9) are always relatively prime."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive GCD Calculator Lab",
    labDesc: "Choose how many numbers you want to compare (2, 3, or 4) to automatically see all common divisors and the GCD!",
    tabNumbers: (n) => `${n} NUMBERS`,
    inputHeader: "Enter Numbers (1 - 100):",
    inputSub: "Fill in the numbers in the corresponding fields.",
    numLabels: ['1st Number', '2nd Number', '3rd Number', '4th Number'],
    presetLabel: "Or select a preset example:",
    tipCommon: "💡 Common divisors are highlighted in yellow and the GCD is crowned with a trophy 🏆!",
    divisorsOf: "Divisors of",
    divisorsCount: (count) => `${count} divisors`,
    visualPartitionTitle: (mkdVal) => `📊 VISUAL PARTITIONING: HOW THE GCD (${mkdVal}) MEASURES EACH NUMBER`,
    piecesOf: (segments, mkdVal) => `${segments} pieces of ${mkdVal}`,
    finalResultTitle: "GREATEST COMMON DIVISOR:",
    finalResultFormula: (nums, val) => `GCD(${nums}) ＝ ${val}`,
    ctaTitle: "Time to Practice GCD!",
    ctaDesc: "Mastered finding the Greatest Common Divisor? Challenge yourself with 10 interactive questions to test your skills!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function MkdPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [activeTab, setActiveTab] = useState(2); // 2, 3 ή 4 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(24);
  const [num4, setNum4] = useState(36);

  const handleInputChange = (setter, val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setter('');
    } else if (parsed > 100) {
      setter(100);
    } else {
      setter(parsed);
    }
  };

  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const divisors1 = getDivisors(num1);
  const divisors2 = getDivisors(num2);
  const divisors3 = getDivisors(num3);
  const divisors4 = getDivisors(num4);

  let commonDivisors = [];
  let numbersList = [];

  if (activeTab === 2) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: t.numLabels[0] },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: t.numLabels[1] }
    ];
  } else if (activeTab === 3) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d) && divisors3.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: t.numLabels[0] },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: t.numLabels[1] },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: t.numLabels[2] }
    ];
  } else if (activeTab === 4) {
    commonDivisors = divisors1.filter((d) => divisors2.includes(d) && divisors3.includes(d) && divisors4.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: t.numLabels[0] },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: t.numLabels[1] },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: t.numLabels[2] },
      { val: num4, div: divisors4, color: 'text-pink-600', bg: 'bg-pink-600/80', label: t.numLabels[3] }
    ];
  }

  const mkd = commonDivisors.length > 0 ? Math.max(...commonDivisors) : 1;
  const currentNumbersString = numbersList.map((n) => n.val || '?').join(', ');

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/14-mkd-ask"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
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
              <span>{t.heroPills}</span>
            </div>
            <Link
              href="/st-dimotikou/14-mkd-ask"
              locale={locale}
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
            {t.cards.map((card, idx) => (
              <article key={idx} className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                      {card.badge}
                    </span>
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{card.sub}</span>
                  </div>
                  <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed whitespace-pre-line">
                    {card.body}
                  </p>

                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold text-slate-800">
                    <p>{card.example}</p>
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                  {card.tip}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΥΠΟΛΟΓΙΣΜΟΥ Μ.Κ.Δ. */}
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
                {t.labDesc}
              </p>
            </div>

            {/* TABS SELECTOR (2, 3, 4 NUMBERS) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              {[2, 3, 4].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabNumbers(tab)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputHeader}
                  </span>
                  <p className="text-xs 2xl:text-sm text-slate-500">{t.inputSub}</p>
                </div>

                {/* DYNAMIC INPUTS GRID */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">{t.numLabels[0]}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-300 rounded-xl text-blue-600 outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">{t.numLabels[1]}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-300 rounded-xl text-indigo-600 outline-none focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                  {activeTab >= 3 && (
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">{t.numLabels[2]}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num3}
                        onChange={(e) => handleInputChange(setNum3, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-purple-300 rounded-xl text-purple-600 outline-none focus:border-purple-500 shadow-sm"
                      />
                    </div>
                  )}
                  {activeTab === 4 && (
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">{t.numLabels[3]}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num4}
                        onChange={(e) => handleInputChange(setNum4, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-pink-300 rounded-xl text-pink-600 outline-none focus:border-pink-500 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* PRESETS LIST */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetLabel}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {activeTab === 2 && PRESETS_2.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                      >
                        {isEn ? p.labelEn : p.labelEl}
                      </button>
                    ))}
                    {activeTab === 3 && PRESETS_3.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                      >
                        {isEn ? p.labelEn : p.labelEl}
                      </button>
                    ))}
                    {activeTab === 4 && PRESETS_4.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); setNum4(p.n4); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                      >
                        {isEn ? p.labelEn : p.labelEl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.tipCommon}
              </div>
            </div>

            {/* RIGHT: LIVE DIVISORS & SEGMENT VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[420px] sm:min-h-[460px] space-y-6">
              
              {/* DIVISORS LISTS FOR EACH NUMBER */}
              <div className="w-full space-y-3">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                    <div className="text-xs sm:text-sm font-bold text-slate-700 flex justify-between items-center flex-wrap gap-1">
                      <span>
                        🔍 {t.divisorsOf} <strong className={`${numObj.color} text-sm sm:text-base font-black`}>{numObj.val || '—'}</strong> ({numObj.label}):
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-mono">
                        {t.divisorsCount(numObj.div.length)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {numObj.div.map((d) => {
                        const isCommon = commonDivisors.includes(d);
                        const isMkd = d === mkd;
                        return (
                          <span
                            key={d}
                            className={`font-mono font-black px-2.5 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border transition-all ${
                              isMkd
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105 ring-2 ring-amber-300'
                                : isCommon
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {d} {isMkd && '🏆'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* VISUAL SEGMENT BARS */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                  {t.visualPartitionTitle(mkd)}
                </span>

                <div className="space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
                  {numbersList.map((numObj, idx) => {
                    if (!numObj.val || mkd <= 0) return null;
                    const segments = numObj.val / mkd;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="text-slate-300 flex justify-between text-[11px] sm:text-xs flex-wrap gap-1">
                          <span>{numObj.label} ({numObj.val}):</span>
                          <span className={`${numObj.color} font-bold brightness-125`}>
                            {t.piecesOf(segments, mkd)}
                          </span>
                        </div>
                        <div className="flex w-full bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-700">
                          {Array.from({ length: segments }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-full border-r border-slate-900 ${numObj.bg} flex items-center justify-center font-black text-white text-[10px]`}
                              style={{ width: `${100 / segments}%` }}
                            >
                              {mkd}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FINAL RESULT BADGE */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-xs md:text-sm font-sans uppercase tracking-wider">{t.finalResultTitle}</span>
                <span className="text-lg sm:text-xl md:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                  {t.finalResultFormula(currentNumbersString, mkd)}
                </span>
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
            href="/st-dimotikou/14-mkd-ask"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}