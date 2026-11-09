import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const PRESETS = [4, 6, 12, 15, 25, 50];
const MAX_LIMIT = 1000;

function getMultiples(num, count = 12) {
  if (!num || num < 1) return [];
  const multiples = [];
  for (let i = 0; i <= count; i++) {
    multiples.push({
      multiplier: i,
      result: num * i
    });
  }
  return multiples;
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Πολλαπλάσια ενός Φυσικού Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Ανακάλυψε τι είναι τα πολλαπλάσια ενός αριθμού, πώς τα υπολογίζουμε και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 18 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πολλαπλάσια ενός Φυσικού Αριθμού",
    heroDesc: "Ανακάλυψε τι είναι τα πολλαπλάσια ενός αριθμού, πώς τα υπολογίζουμε με τη βοήθεια του πολλαπλασιασμού και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών!",
    heroPills: "Πλέγμα 1-100 & Αναλυτικός Πίνακας Πολλαπλασιασμού",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Ιδιότητες Πολλαπλασίων",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για τα πολλαπλάσια ενός φυσικού αριθμού.",
    cards: [
      {
        badge: "ΟΡΙΣΜΟΣ",
        sub: "Πολλαπλασιασμός",
        title: "Τι είναι τα Πολλαπλάσια;",
        body: "Πολλαπλάσια ενός φυσικού αριθμού λέγονται οι αριθμοί που προκύπτουν όταν τον πολλαπλασιάσουμε με τους φυσικούς αριθμούς (0, 1, 2, 3, 4...).",
        example: "Π(5) ＝ { 0, 5, 10, 15, 20, 25... }",
        tip: "💡 Κάθε πολλαπλάσιο διαιρείται ακριβώς (χωρίς υπόλοιπο) από τον αριθμό."
      },
      {
        badge: "ΙΔΙΟΤΗΤΑ",
        sub: "Χωρίς Τέλος",
        title: "Άπειρο Πλήθος",
        body: "Κάθε φυσικός αριθμός (εκτός από το 0) έχει άπειρα πολλαπλάσια, επειδή οι φυσικοί αριθμοί με τους οποίους πολλαπλασιάζουμε δεν τελειώνουν ποτέ!",
        example: "6 · 1.000 ＝ 6.000 (και συνεχίζει... ∞)",
        tip: "⚡ Σε αντίθεση με τους διαιρέτες που είναι πεπερασμένοι, τα πολλαπλάσια είναι άπειρα."
      },
      {
        badge: "ΕΙΔΙΚΟΙ ΚΑΝΟΝΕΣ",
        sub: "0 & Εαυτός",
        title: "Βασικές Ιδιότητες SOS",
        body: "• Το 0 είναι πολλαπλάσιο κάθε φυσικού αριθμού (α · 0 ＝ 0).\n• Κάθε φυσικός αριθμός είναι πολλαπλάσιο του εαυτού του (α · 1 ＝ α).",
        example: "7 · 0 ＝ 0    🎯    7 · 1 ＝ 7",
        tip: "🎯 Το μικρότερο θετικό πολλαπλάσιο ενός αριθμού είναι πάντοτε ο ίδιος ο αριθμός."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Πολλαπλασίων",
    labDesc: "Πληκτρολόγησε έναν αριθμό και δες τα πολλαπλάσιά του στον αναλυτικό πίνακα πράξεων ή στο πλέγμα 1-100!",
    tabGrid: "🔟 Πλέγμα 1-100",
    tabList: "🧮 Πίνακας Πράξεων",
    inputHeader: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ (1 - 1.000):",
    presetHeader: "Ή επίλεξε έτοιμο αριθμό:",
    countHeader: "ΠΛΗΘΟΣ ΠΟΛΛΑΠΛΑΣΙΩΝ:",
    tipMultiplesRhythm: "💡 Τα πολλαπλάσια ενός αριθμού αυξάνονται ρυθμικά με το ίδιο βήμα!",
    analysisHeader: "ΠΟΛΛΑΠΛΑΣΙΑ ΤΟΥ ΑΡΙΘΜΟΥ:",
    gridTitle: "🔟 ΕΝΤΟΠΙΣΜΟΣ ΠΟΛΛΑΠΛΑΣΙΩΝ ΣΤΟ ΠΛΕΓΜΑ 1-100:",
    gridOver100Notice: (num) => `* Ο αριθμός ${num} είναι μεγαλύτερος του 100, επομένως τα θετικά του πολλαπλάσια βρίσκονται πέρα από το πλέγμα 1-100!`,
    listTitle: "🧮 ΑΝΑΛΥΤΙΚΟΣ ΠΙΝΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ:",
    emptyPrompt: "Πληκτρολόγησε έναν φυσικό αριθμό μεγαλύτερο ή ίσο του 1.",
    multiplesSetHeader: (num) => `ΣΥΝΟΛΟ ΠΟΛΛΑΠΛΑΣΙΩΝ Π(${num}):`,
    multiplesSetPrefix: (num) => `Π(${num}) ＝ {`,
    ctaTitle: "Ώρα για Εξάσκηση στα Πολλαπλάσια!",
    ctaDesc: "Κατάλαβες πώς σχηματίζονται τα πολλαπλάσια ενός αριθμού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Multiples of a Whole Number - Grade 6 | LearnMaths.gr",
    pageDescription: "Explore what multiples of a number are, how to compute them via multiplication, and view their infinite patterns on the 1-100 number grid for Grade 6.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 18 • GRADE 6",
    heroTitle: "Multiples of a Whole Number",
    heroDesc: "Discover what multiples of an integer are, how to determine them using multiplication, and observe their repeating patterns on the number grid!",
    heroPills: "1-100 Grid & Step-by-Step Multiplication Table",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Properties of Multiples",
    theorySubtitle: "Everything you need to master multiples of natural numbers.",
    cards: [
      {
        badge: "DEFINITION",
        sub: "Multiplication",
        title: "What are Multiples?",
        body: "Multiples of a whole number are the numbers obtained by multiplying it by natural numbers (0, 1, 2, 3, 4...).",
        example: "M(5) ＝ { 0, 5, 10, 15, 20, 25... }",
        tip: "💡 Every multiple divides evenly (without remainder) by the original number."
      },
      {
        badge: "PROPERTY",
        sub: "Infinite",
        title: "Infinite Set",
        body: "Every whole number (except 0) has infinitely many multiples because the integers we multiply with never end!",
        example: "6 · 1,000 ＝ 6,000 (and continues... ∞)",
        tip: "⚡ Unlike divisors which are finite, the multiples of a number are infinite."
      },
      {
        badge: "SPECIAL RULES",
        sub: "0 & Itself",
        title: "Key Properties SOS",
        body: "• 0 is a multiple of every natural number (a · 0 ＝ 0).\n• Every natural number is a multiple of itself (a · 1 ＝ a).",
        example: "7 · 0 ＝ 0    🎯    7 · 1 ＝ 7",
        tip: "🎯 The smallest positive multiple of any number is always the number itself."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Multiples Lab",
    labDesc: "Type a number and inspect its multiples on the multiplication table or highlighted in the 1-100 grid!",
    tabGrid: "🔟 1-100 Grid",
    tabList: "🧮 Multiplication Table",
    inputHeader: "ENTER NUMBER (1 - 1,000):",
    presetHeader: "Or select a preset number:",
    countHeader: "NUMBER OF MULTIPLES:",
    tipMultiplesRhythm: "💡 Multiples of a number increase rhythmically in constant steps!",
    analysisHeader: "MULTIPLES OF NUMBER:",
    gridTitle: "🔟 IDENTIFYING MULTIPLES IN 1-100 GRID:",
    gridOver100Notice: (num) => `* The number ${num} is greater than 100, so its positive multiples lie beyond the 1-100 grid!`,
    listTitle: "🧮 STEP-BY-STEP MULTIPLICATION TABLE:",
    emptyPrompt: "Enter a whole number greater than or equal to 1.",
    multiplesSetHeader: (num) => `MULTIPLES SET M(${num}):`,
    multiplesSetPrefix: (num) => `M(${num}) ＝ {`,
    ctaTitle: "Time to Practice Multiples!",
    ctaDesc: "Understood how multiples of a number are generated? Test your skills with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function PollaplasiaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [number, setNumber] = useState(6);
  const [count, setCount] = useState(12);
  const [activeView, setActiveView] = useState('grid');

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumber('');
      return;
    }
    const parsed = parseInt(clean, 10);
    if (parsed <= MAX_LIMIT) {
      setNumber(parsed);
    }
  };

  const multiplesList = getMultiples(number, count);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia-ask"
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
              href="/st-dimotikou/18-pollaplasia-ask"
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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
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

            {/* DISPLAY TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveView('grid')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeView === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabGrid}
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeView === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabList}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputHeader}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="6"
                  />
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetHeader}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MULTIPLES COUNT SELECTOR */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.countHeader}
                  </span>
                  <div className="flex gap-2">
                    {[10, 15, 20].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCount(c)}
                        className={`flex-1 py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm transition-all touch-manipulation active:scale-95 cursor-pointer ${
                          count === c
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.tipMultiplesRhythm}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6">
              
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  {t.analysisHeader}
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                  {number ? number.toLocaleString(isEn ? 'en-US' : 'el-GR') : '—'}
                </div>
              </div>

              <div className="w-full my-auto py-2 flex justify-center items-center">
                {number && number >= 1 ? (
                  activeView === 'grid' ? (
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-1">
                        {t.gridTitle}
                      </span>
                      
                      <div className="bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 w-full flex flex-col items-center shadow-inner max-w-lg">
                        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-full">
                          {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => {
                            const isMultiple = val % number === 0;
                            return (
                              <div
                                key={val}
                                className={`aspect-square flex items-center justify-center rounded-lg font-mono text-[10px] sm:text-xs md:text-sm font-bold transition-all ${
                                  isMultiple
                                    ? 'bg-blue-600 text-white font-black shadow-md scale-105 ring-2 ring-blue-300'
                                    : 'bg-white text-slate-400 border border-slate-200/60'
                                }`}
                              >
                                {val}
                              </div>
                            );
                          })}
                        </div>
                        {number > 100 && (
                          <p className="text-xs sm:text-sm text-amber-600 font-bold mt-3 text-center">
                            {t.gridOver100Notice(number.toLocaleString(isEn ? 'en-US' : 'el-GR'))}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-2">
                        {t.listTitle}
                      </span>
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm md:text-base w-full max-w-2xl shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {multiplesList.map((m) => (
                            <div
                              key={m.multiplier}
                              className="bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-slate-700 flex justify-between items-center px-3 sm:px-4"
                            >
                              <span className="text-slate-400">
                                {number} · {m.multiplier} ＝
                              </span>
                              <span className="font-black text-amber-300 text-base sm:text-lg">
                                {m.result.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full p-4">
                    {t.emptyPrompt}
                  </div>
                )}
              </div>

              {number && number >= 1 && (
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                  <span className="text-xs md:text-sm font-sans uppercase tracking-wider block text-blue-200">
                    {t.multiplesSetHeader(number.toLocaleString(isEn ? 'en-US' : 'el-GR'))}
                  </span>
                  <div className="text-sm sm:text-base md:text-lg tracking-wide pt-1 flex flex-wrap justify-center gap-1.5 sm:gap-2 items-center">
                    <span>{t.multiplesSetPrefix(number)}</span>
                    {multiplesList.slice(0, 8).map((m, idx) => (
                      <span key={m.multiplier} className="text-amber-300 font-black">
                        {m.result.toLocaleString(isEn ? 'en-US' : 'el-GR')}{idx < 7 ? ',' : ''}
                      </span>
                    ))}
                    <span className="text-blue-200">... {'}'}</span>
                  </div>
                </div>
              )}

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
            href="/st-dimotikou/18-pollaplasia-ask"
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