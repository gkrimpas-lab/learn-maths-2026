import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const PRESETS = [12, 18, 24, 30, 36, 48];

const TRANSLATIONS = {
  el: {
    pageTitle: "Οι Διαιρέτες ενός Φυσικού Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Ανακάλυψε ποιους αριθμούς ονομάζουμε διαιρέτες, πώς τους βρίσκουμε σχηματίζοντας ζεύγη γινομένων και πώς χωρίζουν έναν αριθμό σε απόλυτα ισόποσες ομάδες για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 13 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Οι Διαιρέτες ενός Φυσικού Αριθμού",
    heroDesc: "Ανακάλυψε ποιους αριθμούς ονομάζουμε διαιρέτες, πώς τους βρίσκουμε σχηματίζοντας ζεύγη γινομένων και πώς χωρίζουν έναν αριθμό σε απόλυτα ισόποσες ομάδες!",
    heroPills: "Ζεύγη Γινομένων & Διαδραστικό Εργαστήριο Ομάδων",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Ιδιότητες Διαιρετών",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για τους διαιρέτες ενός φυσικού αριθμού.",
    cards: [
      {
        badge: "ΟΡΙΣΜΟΣ",
        sub: "Τέλεια Διαίρεση",
        title: "Τι είναι οι Διαιρέτες;",
        body: "Διαιρέτες ενός φυσικού αριθμού είναι όλοι οι αριθμοί που τον διαιρούν ακριβώς, αφήνοντας υπόλοιπο μηδέν (υ ＝ 0).",
        example: "12 : 3 ＝ 4 (υπόλοιπο 0)",
        tip: "💡 Αν η διαίρεση αφήνει υπόλοιπο μεγαλύτερο του 0, ο αριθμός δεν είναι διαιρέτης."
      },
      {
        badge: "ΙΔΙΟΤΗΤΑ",
        sub: "Άκρα Συνόλου",
        title: "Το 1 και ο Εαυτός του",
        body: "Κάθε φυσικός αριθμός (μεγαλύτερος του 1) έχει πάντοτε τουλάχιστον δύο διαιρέτες: τον αριθμό 1 (μικρότερος διαιρέτης) και τον εαυτό του (μεγαλύτερος διαιρέτης).",
        example: "Δ(18) ＝ { 1, 2, 3, 6, 9, 18 }",
        tip: "⚡ Το 1 διαιρεί όλους τους αριθμούς. Κανένας αριθμός δεν έχει διαιρέτη μεγαλύτερο από τον εαυτό του."
      },
      {
        badge: "ΜΕΘΟΔΟΣ",
        sub: "Ζεύγη",
        title: "Ζεύγη Πολλαπλασιασμού",
        body: "Βρίσκουμε εύκολα όλους τους διαιρέτες γράφοντας τον αριθμό ως γινόμενο δύο παραγόντων: α · β ＝ Αριθμός.",
        example: "24 ＝ 1·24 ＝ 2·12 ＝ 3·8 ＝ 4·6",
        tip: "🎯 Ψάχνοντας τα ζεύγη από το 1 και συνεχίζοντας με 2, 3, 4..., δεν ξεχνάμε ποτέ κανέναν διαιρέτη."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Διαιρετών",
    labDesc: "Πληκτρολόγησε έναν αριθμό από το 1 έως το 100 ή επίλεξε παράδειγμα για να δεις όλους τους διαιρέτες και την οπτική κατανομή τους!",
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ (1 - 100):",
    presetLabel: "Ή ΕΠΙΛΕΞΕ ΕΤΟΙΜΟ ΑΡΙΘΜΟ:",
    factorPairsTitle: "🔗 ΖΕΥΓΗ ΓΙΝΟΜΕΝΩΝ:",
    finiteDivisorsTip: "💡 Ένας αριθμός έχει πεπερασμένο πλήθος διαιρετών!",
    divisorsSetTitle: (num) => `ΣΥΝΟΛΟ ΔΙΑΙΡΕΤΩΝ Δ(${num || '—'}):`,
    typeValidPrompt: "Πληκτρολόγησε έναν έγκυρο αριθμό...",
    divisorsCountLabel: "Πλήθος διαιρετών:",
    visualDistributionTitle: (num) => `📊 ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΠΩΣ ΜΟΙΡΑΖΕΤΑΙ ΤΟ ${num} ΣΕ ΙΣΕΣ ΟΜΑΔΕΣ`,
    divisorWord: "Διαιρέτης:",
    groupWordSingle: "ομάδα",
    groupWordPlural: "ομάδες",
    groupTooltip: (g, b) => `Ομάδα ${g}, στοιχείο ${b}`,
    emptyStateText: "Επίλεξε έναν αριθμό για να εμφανιστεί η γραφική ανάλυση.",
    finalNoticeText: (num) => `🔍 Παρατήρησε ότι σε κάθε γραμμή το σύνολο των τετραγώνων είναι ακριβώς ${num}!`,
    ctaTitle: "Ώρα για Εξάσκηση στους Διαιρέτες!",
    ctaDesc: "Έμαθες πώς βρίσκουμε όλους τους διαιρέτες ενός αριθμού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Divisors of a Whole Number - Grade 6 | LearnMaths.gr",
    pageDescription: "Discover what divisors are, how to find them using factor pairs, and how they partition numbers into exact equal groups for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 13 • GRADE 6",
    heroTitle: "The Divisors of a Whole Number",
    heroDesc: "Discover what numbers are called divisors, how to identify them by forming factor pairs, and how they partition numbers into perfectly equal groups!",
    heroPills: "Factor Pairs & Interactive Grouping Lab",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Properties of Divisors",
    theorySubtitle: "Everything you need to master divisors of natural numbers.",
    cards: [
      {
        badge: "DEFINITION",
        sub: "Exact Division",
        title: "What are Divisors?",
        body: "Divisors of a whole number are all integers that divide it exactly, leaving zero remainder (r ＝ 0).",
        example: "12 : 3 ＝ 4 (remainder 0)",
        tip: "💡 If the division leaves a remainder greater than 0, the number is not a divisor."
      },
      {
        badge: "PROPERTY",
        sub: "Set Extremes",
        title: "1 and the Number Itself",
        body: "Every whole number greater than 1 always has at least two divisors: 1 (the smallest divisor) and itself (the greatest divisor).",
        example: "D(18) ＝ { 1, 2, 3, 6, 9, 18 }",
        tip: "⚡ 1 divides every number. No number has a divisor greater than itself."
      },
      {
        badge: "METHOD",
        sub: "Pairs",
        title: "Factor Pairs",
        body: "Easily find all divisors by expressing the number as a product of two factors: a · b ＝ Number.",
        example: "24 ＝ 1·24 ＝ 2·12 ＝ 3·8 ＝ 4·6",
        tip: "🎯 Systematically testing pairs starting from 1, then 2, 3, 4..., ensures no divisor is missed."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Divisors Lab",
    labDesc: "Enter any number from 1 to 100 or select a preset to see all divisors and their visual grouping!",
    inputLabel: "ENTER NUMBER (1 - 100):",
    presetLabel: "OR SELECT A PRESET NUMBER:",
    factorPairsTitle: "🔗 FACTOR PAIRS:",
    finiteDivisorsTip: "💡 A whole number has a finite number of divisors!",
    divisorsSetTitle: (num) => `DIVISORS SET D(${num || '—'}):`,
    typeValidPrompt: "Enter a valid number...",
    divisorsCountLabel: "Total divisors:",
    visualDistributionTitle: (num) => `📊 VISUAL MODEL: PARTITIONING ${num} INTO EQUAL GROUPS`,
    divisorWord: "Divisor:",
    groupWordSingle: "group",
    groupWordPlural: "groups",
    groupTooltip: (g, b) => `Group ${g}, item ${b}`,
    emptyStateText: "Select a number to display graphical analysis.",
    finalNoticeText: (num) => `🔍 Notice that in each row the total number of squares is exactly ${num}!`,
    ctaTitle: "Time to Practice Divisors!",
    ctaDesc: "Understood how to find all divisors of a number? Challenge yourself with 10 interactive questions to test your skills!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function DiairetesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [number, setNumber] = useState(12);

  const handleInputChange = (val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setNumber('');
    } else if (parsed > 100) {
      setNumber(100);
    } else {
      setNumber(parsed);
    }
  };

  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        divs.push(i);
      }
    }
    return divs;
  };

  const divisors = getDivisors(number);

  const getDivisorPairs = (num, divs) => {
    if (!num || divs.length === 0) return [];
    const pairs = [];
    const seen = new Set();
    divs.forEach((d) => {
      const pair = num / d;
      if (!seen.has(d) && !seen.has(pair)) {
        pairs.push([d, pair]);
        seen.add(d);
        seen.add(pair);
      }
    });
    return pairs;
  };

  const divisorPairs = getDivisorPairs(number, divisors);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/13-diairetes-ask"
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
              href="/st-dimotikou/13-diairetes-ask"
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
                  <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΙΑΙΡΕΤΩΝ */}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputLabel}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="12"
                  />
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all touch-manipulation active:scale-95 cursor-pointer ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FACTOR PAIRS BOX */}
                {divisorPairs.length > 0 && (
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider block">
                      {t.factorPairsTitle}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-700">
                      {divisorPairs.map(([a, b], idx) => (
                        <div key={idx} className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                          {a} · {b} ＝ {number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.finiteDivisorsTip}
              </div>
            </div>

            {/* RIGHT: DIVISORS PILLS & GROUP VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px] space-y-6">
              
              {/* DIVISORS SET HEADER */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  {t.divisorsSetTitle(number)}
                </span>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {divisors.length > 0 ? (
                    divisors.map((div) => (
                      <span
                        key={div}
                        className="text-sm sm:text-base md:text-lg font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-emerald-300 shadow-sm"
                      >
                        {div}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-400">{t.typeValidPrompt}</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-slate-400 font-medium block mt-2">
                  {t.divisorsCountLabel} <strong className="text-slate-700">{divisors.length}</strong>
                </span>
              </div>

              {/* GROUP VISUALIZATION */}
              <div className="w-full space-y-4 my-auto">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block text-center">
                  {t.visualDistributionTitle(number)}
                </span>

                {number && divisors.length > 0 ? (
                  <div className="max-h-[260px] sm:max-h-[280px] overflow-y-auto space-y-3 pr-1 sm:pr-2">
                    {divisors.map((div) => {
                      const groups = number / div;
                      return (
                        <div key={div} className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                          <div className="text-xs sm:text-sm font-bold text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                            <span>
                              {t.divisorWord} <strong className="text-blue-700 font-mono text-xs sm:text-sm">{div}</strong>
                            </span>
                            <span className="font-mono text-slate-600">
                              {number} : {div} ＝ <strong className="text-emerald-700">{groups}</strong> {groups === 1 ? t.groupWordSingle : t.groupWordPlural}
                            </span>
                          </div>

                          {/* DRAW BOXES */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {Array.from({ length: groups }).map((_, gIdx) => (
                              <div key={gIdx} className="flex gap-0.5 bg-blue-100/70 p-1 rounded-lg border border-blue-200">
                                {Array.from({ length: div }).map((_, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="w-2.5 h-2.5 bg-blue-600 rounded-sm shadow-xs"
                                    title={t.groupTooltip(gIdx + 1, bIdx + 1)}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    {t.emptyStateText}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                <span>{t.finalNoticeText(number)}</span>
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
            href="/st-dimotikou/13-diairetes-ask"
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