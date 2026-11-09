// pages/d-dimotikou/23-anagogi-monada.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
}

const PRESETS = {
  el: [
    {
      item: 'μολύβια',
      singleAcc: 'το 1 μολύβι',
      pluralAcc: 'τα',
      pluralNom: 'Τα',
      emoji: '✏️',
      initialQty: 4,
      initialCost: 8,
      targetQty: 7,
      unit: '€'
    },
    {
      item: 'σοκολάτες',
      singleAcc: 'τη 1 σοκολάτα',
      pluralAcc: 'τις',
      pluralNom: 'Οι',
      emoji: '🍫',
      initialQty: 3,
      initialCost: 6,
      targetQty: 8,
      unit: '€'
    },
    {
      item: 'μπάλες',
      singleAcc: 'τη 1 μπάλα',
      pluralAcc: 'τις',
      pluralNom: 'Οι',
      emoji: '⚽',
      initialQty: 5,
      initialCost: 25,
      targetQty: 3,
      unit: '€'
    },
    {
      item: 'βιβλία',
      singleAcc: 'το 1 βιβλίο',
      pluralAcc: 'τα',
      pluralNom: 'Τα',
      emoji: '📚',
      initialQty: 2,
      initialCost: 18,
      targetQty: 5,
      unit: '€'
    }
  ],
  en: [
    {
      item: 'pencils',
      singleAcc: '1 pencil',
      pluralAcc: '',
      pluralNom: '',
      emoji: '✏️',
      initialQty: 4,
      initialCost: 8,
      targetQty: 7,
      unit: '€'
    },
    {
      item: 'chocolates',
      singleAcc: '1 chocolate',
      pluralAcc: '',
      pluralNom: '',
      emoji: '🍫',
      initialQty: 3,
      initialCost: 6,
      targetQty: 8,
      unit: '€'
    },
    {
      item: 'balls',
      singleAcc: '1 ball',
      pluralAcc: '',
      pluralNom: '',
      emoji: '⚽',
      initialQty: 5,
      initialCost: 25,
      targetQty: 3,
      unit: '€'
    },
    {
      item: 'books',
      singleAcc: '1 book',
      pluralAcc: '',
      pluralNom: '',
      emoji: '📚',
      initialQty: 2,
      initialCost: 18,
      targetQty: 5,
      unit: '€'
    }
  ]
};

const translations = {
  el: {
    pageTitle: "Η Μέθοδος της Αναγωγής στη Μονάδα - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς να λύνουμε προβλήματα με τη μέθοδο της αναγωγής στη μονάδα σε 2 απλά βήματα: διαίρεση για το ένα και πολλαπλασιασμός για τα πολλά.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "🎯 Η Μέθοδος της Αναγωγής στη Μονάδα",
    heroDesc: "Μαθαίνουμε πώς να λύνουμε προβλήματα με 2 απλά βήματα: βρίσκουμε πρώτα πόσο κοστίζει το ένα και μετά υπολογίζουμε πόσο κοστίζουν τα πολλά!",
    promoCardTitle: "Έτοιμος για εξάσκηση;",
    promoCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις στην αναγωγή στη μονάδα για να σιγουρευτείς ότι κατανόησες τη μέθοδο!",
    promoCardBtn: "🎯 Μετάβαση στις Ασκήσεις",
    theoryTitle: "Τα 2 Βήματα της Αναγωγής στη Μονάδα",
    step1Badge: "1️⃣ ΒΗΜΑ 1ο • ΔΙΑΙΡΕΣΗ ( ： )",
    step1Title: "Βρίσκουμε το 1 (τη μονάδα)",
    step1Desc: "Διαιρούμε τη συνολική αξία με το πλήθος των πραγμάτων για να υπολογίσουμε πόσο κοστίζει το 1 πράγμα (η μονάδα).",
    step1Formula: "Τιμή για το 1 ＝ Συνολικό Κόστος ： Πλήθος",
    step2Badge: "2️⃣ ΒΗΜΑ 2ο • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ( · )",
    step2Title: "Βρίσκουμε τα πολλά που ζητάει το πρόβλημα",
    step2Desc: "Πολλαπλασιάζουμε την τιμή του ενός πράγματος με το νέο πλήθος που θέλουμε να αγοράσουμε ή να υπολογίσουμε.",
    step2Formula: "Νέο Κόστος ＝ Τιμή του 1 · Νέο Πλήθος",
    exampleHeader: "Παράδειγμα Επίλυσης:",
    exampleStatement: "«Αν τα 3 όμοια τετράδια κοστίζουν 6 €, πόσο κοστίζουν τα 5 ίδια τετράδια;»",
    exampleStep1Label: "Βήμα 1:",
    exampleStep1Text: "Βρίσκουμε το 1 τετράδιο → 6 ： 3 ＝ 2 €.",
    exampleStep2Label: "Βήμα 2:",
    exampleStep2Text: "Βρίσκουμε τα 5 τετράδια → 5 · 2 ＝ 10 €.",
    exampleAnswerLabel: "Απάντηση:",
    exampleAnswerText: "Τα 5 τετράδια κοστίζουν 10 €.",
    labTitle: "Διαδραστικό Εργαστήριο Αναγωγής στη Μονάδα",
    labDesc: "Επίλεξε ένα σενάριο καθημερινότητας ή άλλαξε τα νούμερα για να δεις αναλυτικά τα 2 βήματα της επίλυσης!",
    controlsTitle: "Στοιχεία Προβλήματος:",
    initialQtyLabel: "ΑΡΧΙΚΟ ΠΛΗΘΟΣ",
    initialCostLabel: "ΑΡΧΙΚΟ ΚΟΣΤΟΣ (€)",
    targetQtyLabel: "ΝΕΟ ΠΛΗΘΟΣ ΠΟΥ ΖΗΤΑΜΕ",
    decrease1Aria: "Μείωση κατά 1",
    increase1Aria: "Αύξηση κατά 1",
    statementPrefix: "Διατύπωση:",
    statementTemplate: (pluralAcc, initQty, item, initCost, targetQty) =>
      `«Αν ${pluralAcc ? pluralAcc + ' ' : ''}${initQty} ${item} κοστίζουν ${initCost} €, πόσο κοστίζουν ${pluralAcc ? pluralAcc + ' ' : ''}${targetQty} ${item};»`,
    step1BoxTitle: (singleAcc) => `1️⃣ ΒΗΜΑ 1: Βρίσκουμε ${singleAcc}`,
    step2BoxTitle: (pluralAcc, targetQty, item) => `2️⃣ ΒΗΜΑ 2: Βρίσκουμε ${pluralAcc ? pluralAcc + ' ' : ''}${targetQty} ${item}`,
    answerLabel: "Απάντηση:",
    answerTemplate: (pluralNom, targetQty, item, cost) =>
      `${pluralNom ? pluralNom + ' ' : ''}${targetQty} ${item} κοστίζουν ${cost} €!`,
    ctaTitle: "📝 Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να λύνεις προβλήματα με τη μέθοδο της αναγωγής στη μονάδα; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις ➔",
    footerPrompt: "Ολοκλήρωσες τη θεωρία;",
    footerBtn: "Μετάβαση στις Ασκήσεις 🎯"
  },
  en: {
    pageTitle: "The Unitary Method - Theory | LearnMaths.gr",
    pageDesc: "Learn how to solve real-world problems with the unitary method in 2 simple steps: divide for one unit and multiply for many.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "🎯 The Unitary Method",
    heroDesc: "Learn how to solve word problems in 2 easy steps: find the cost of one unit first, then calculate the total cost for many!",
    promoCardTitle: "Ready for practice?",
    promoCardDesc: "Try the interactive exercises on the unitary method to make sure you have mastered the strategy!",
    promoCardBtn: "🎯 Go to Exercises",
    theoryTitle: "The 2 Steps of the Unitary Method",
    step1Badge: "1️⃣ STEP 1 • DIVISION ( ： )",
    step1Title: "Find 1 (the single unit)",
    step1Desc: "Divide the total value by the initial quantity to find how much 1 unit costs.",
    step1Formula: "Unit Cost ＝ Total Cost ： Quantity",
    step2Badge: "2️⃣ STEP 2 • MULTIPLICATION ( · )",
    step2Title: "Find the required quantity",
    step2Desc: "Multiply the unit cost of one item by the new target quantity you want to find.",
    step2Formula: "New Total Cost ＝ Unit Cost · Target Quantity",
    exampleHeader: "Worked Example:",
    exampleStatement: "«If 3 identical notebooks cost 6 €, how much do 5 identical notebooks cost?»",
    exampleStep1Label: "Step 1:",
    exampleStep1Text: "Find 1 notebook → 6 ： 3 ＝ 2 €.",
    exampleStep2Label: "Step 2:",
    exampleStep2Text: "Find 5 notebooks → 5 · 2 ＝ 10 €.",
    exampleAnswerLabel: "Answer:",
    exampleAnswerText: "5 notebooks cost 10 €.",
    labTitle: "Interactive Unitary Method Lab",
    labDesc: "Select a real-world scenario or modify the values to inspect the two solution steps step by step!",
    controlsTitle: "Problem Parameters:",
    initialQtyLabel: "INITIAL QUANTITY",
    initialCostLabel: "INITIAL COST (€)",
    targetQtyLabel: "TARGET QUANTITY",
    decrease1Aria: "Decrease by 1",
    increase1Aria: "Increase by 1",
    statementPrefix: "Problem Formulation:",
    statementTemplate: (pluralAcc, initQty, item, initCost, targetQty) =>
      `«If ${initQty} ${item} cost ${initCost} €, how much do ${targetQty} ${item} cost?»`,
    step1BoxTitle: (singleAcc) => `1️⃣ STEP 1: Find ${singleAcc}`,
    step2BoxTitle: (pluralAcc, targetQty, item) => `2️⃣ STEP 2: Find ${targetQty} ${item}`,
    answerLabel: "Answer:",
    answerTemplate: (pluralNom, targetQty, item, cost) =>
      `${targetQty} ${item} cost ${cost} €!`,
    ctaTitle: "📝 Practice Time!",
    ctaDesc: "Understood how to solve problems using the unitary method? Test your knowledge with interactive exercises!",
    ctaBtn: "Start Exercises ➔",
    footerPrompt: "Finished reviewing the theory?",
    footerBtn: "Go to Exercises 🎯"
  }
};

export default function AnagogiMonadaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const presets = PRESETS[locale];

  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [initialQty, setInitialQty] = useState(presets[0].initialQty);
  const [initialCost, setInitialCost] = useState(presets[0].initialCost);
  const [targetQty, setTargetQty] = useState(presets[0].targetQty);

  const numInitialQty = typeof initialQty === 'number' ? initialQty : 0;
  const numInitialCost = typeof initialCost === 'number' ? initialCost : 0;
  const numTargetQty = typeof targetQty === 'number' ? targetQty : 0;

  const unitCost = numInitialQty > 0 ? numInitialCost / numInitialQty : 0;
  const finalCost = unitCost * numTargetQty;

  const handleSelectPreset = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPreset(index);
    setInitialQty(presets[index].initialQty);
    setInitialCost(presets[index].initialCost);
    setTargetQty(presets[index].targetQty);
  };

  const updateInitialQty = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setInitialQty((prev) => Math.max(1, Math.min(999, (Number(prev) || 1) + delta)));
  };

  const updateInitialCost = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setInitialCost((prev) => Math.max(1, Math.min(999, (Number(prev) || 1) + delta)));
  };

  const updateTargetQty = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setTargetQty((prev) => Math.max(1, Math.min(9999, (Number(prev) || 1) + delta)));
  };

  const currentItem = presets[selectedPreset] || presets[0];

  const formatDecimal = (val) => {
    if (val % 1 === 0) return formatNumber(val);
    return Number(val.toFixed(2)).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/23-anagogi-monada-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-amber-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoCardTitle}</h3>
              <p className="text-xs text-amber-100">
                {t.promoCardDesc}
              </p>
              <Link
                href="/d-dimotikou/23-anagogi-monada-ask"
                className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.promoCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΑ 2 ΧΡΥΣΑ ΒΗΜΑΤΑ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theoryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. ΒΗΜΑ 1: ΔΙΑΙΡΕΣΗ */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                {t.step1Badge}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                {t.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step1Desc}
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs font-mono font-bold text-blue-900 text-center shadow-sm">
                {t.step1Formula}
              </div>
            </div>

            {/* 2. ΒΗΜΑ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                {t.step2Badge}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                {t.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step2Desc}
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 text-center shadow-sm">
                {t.step2Formula}
              </div>
            </div>
          </div>

          {/* ΠΑΡΑΔΕΙΓΜΑ ΚΑΤΑΝΟΗΣΗΣ */}
          <div className="bg-amber-50/80 p-5 sm:p-6 rounded-2xl border border-amber-200/80 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
              <span>💡</span> {t.exampleHeader}
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
              {t.exampleStatement}
            </p>
            <ul className="text-xs sm:text-sm space-y-1.5 pl-2 font-medium text-slate-700">
              <li>
                • <strong>{t.exampleStep1Label}</strong> {t.exampleStep1Text}
              </li>
              <li>
                • <strong>{t.exampleStep2Label}</strong> {t.exampleStep2Text}
              </li>
              <li>
                • <strong>{t.exampleAnswerLabel}</strong> {t.exampleAnswerText}
              </li>
            </ul>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.labDesc}
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΠΡΟΕΠΙΛΟΓΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSelectPreset(e, idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                    selectedPreset === idx
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.emoji} {p.item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ & TOUCH CONTROLS */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>⚙️</span> {t.controlsTitle}
              </h3>

              <div className="space-y-3.5">
                {/* Αρχικό Πλήθος */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      {toCleanUppercase(`${t.initialQtyLabel} (${currentItem.item})`)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-base">
                      {formatNumber(numInitialQty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateInitialQty(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.decrease1Aria}
                      aria-label={t.decrease1Aria}
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      id="input-initial-qty"
                      name="input-initial-qty"
                      value={initialQty}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                        setInitialQty(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!initialQty || initialQty < 1) setInitialQty(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateInitialQty(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.increase1Aria}
                      aria-label={t.increase1Aria}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Αρχικό Κόστος */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      {toCleanUppercase(t.initialCostLabel)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {formatNumber(numInitialCost)} €
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateInitialCost(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.decrease1Aria}
                      aria-label={t.decrease1Aria}
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      id="input-initial-cost"
                      name="input-initial-cost"
                      value={initialCost}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                        setInitialCost(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!initialCost || initialCost < 1) setInitialCost(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateInitialCost(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.increase1Aria}
                      aria-label={t.increase1Aria}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Νέο Πλήθος που Ζητάμε */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      {toCleanUppercase(`${t.targetQtyLabel} (${currentItem.item})`)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                      {formatNumber(numTargetQty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateTargetQty(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.decrease1Aria}
                      aria-label={t.decrease1Aria}
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="off"
                      id="input-target-qty"
                      name="input-target-qty"
                      value={targetQty}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                        setTargetQty(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!targetQty || targetQty < 1) setTargetQty(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateTargetQty(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.increase1Aria}
                      aria-label={t.increase1Aria}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-700 font-semibold bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                📝 <strong>{t.statementPrefix}</strong> {t.statementTemplate(
                  currentItem.pluralAcc,
                  formatNumber(numInitialQty),
                  currentItem.item,
                  formatNumber(numInitialCost),
                  formatNumber(numTargetQty)
                )}
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΩΝ 2 ΒΗΜΑΤΩΝ ΛΥΣΗΣ */}
            <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              {/* ΒΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΝΑΔΑΣ */}
              <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-blue-500/30 space-y-2 shadow-inner">
                <span className="text-xs font-black text-blue-400 tracking-wider block">
                  {t.step1BoxTitle(currentItem.singleAcc)}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-mono">
                  <span className="text-slate-300">
                    {formatNumber(numInitialCost)} € ： {formatNumber(numInitialQty)} ＝
                  </span>
                  <span className="text-blue-400 font-black text-lg sm:text-xl bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-500/40">
                    {formatDecimal(unitCost)} €
                  </span>
                </div>
              </div>

              {/* ΒΗΜΑ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΛΙΚΗΣ ΠΟΣΟΤΗΤΑΣ */}
              <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-2 shadow-inner">
                <span className="text-xs font-black text-emerald-400 tracking-wider block">
                  {t.step2BoxTitle(currentItem.pluralAcc, formatNumber(numTargetQty), currentItem.item)}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-mono">
                  <span className="text-slate-300">
                    {formatNumber(numTargetQty)} · {formatDecimal(unitCost)} € ＝
                  </span>
                  <span className="text-emerald-400 font-black text-xl sm:text-2xl bg-emerald-950/80 px-3.5 py-1 rounded-xl border border-emerald-500/40">
                    {formatDecimal(finalCost)} €
                  </span>
                </div>
              </div>

              {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="bg-amber-400/10 p-4 rounded-2xl border border-amber-400/30 text-center">
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  🎉 <strong>{t.answerLabel}</strong>{' '}
                  <span className="text-white font-black text-base sm:text-lg">
                    {t.answerTemplate(currentItem.pluralNom, formatNumber(numTargetQty), currentItem.item, formatDecimal(finalCost))}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">{t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/23-anagogi-monada-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn}
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 sm:py-4">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-300 font-medium truncate">
            {t.footerPrompt}
          </div>
          <Link
            href="/d-dimotikou/23-anagogi-monada-ask"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            {t.footerBtn}
          </Link>
        </div>
      </footer>
    </Layout>
  );
}