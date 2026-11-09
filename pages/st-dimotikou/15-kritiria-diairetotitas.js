import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Μέγιστος επιτρεπόμενος αριθμός
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [24, 135, 450, 1236, 7525, 10450];

const TRANSLATIONS = {
  el: {
    pageTitle: "Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε τα κριτήρια διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25 για να γνωρίζεις άμεσα αν ένας αριθμός διαιρείται ακριβώς για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 15 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25)",
    heroDesc: "Μάθε τα έξυπνα μαθηματικά κόλπα για να γνωρίζεις αμέσως αν ένας αριθμός διαιρείται ακριβώς, χωρίς να κάνεις την πράξη της διαίρεσης!",
    heroPills: "Έλεγχος Τελευταίων Ψηφίων & Αθροίσματος Ψηφίων",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Οι 3 Κατηγορίες Κριτηρίων Διαιρετότητας",
    theorySubtitle: "Ομαδοποίηση των κανόνων με βάση το τι εξετάζουμε σε κάθε αριθμό.",
    cards: [
      {
        badge: "ΟΜΑΔΑ 1",
        sub: "Τελευταίο Ψηφίο",
        title: "Διαιρετότητα με 2, 5 και 10",
        body: "Εξετάζουμε μόνο το τελευταίο ψηφίο (μονάδες):\n• με το 2: λήγει σε 0, 2, 4, 6, 8 (άρτιος).\n• με το 5: λήγει σε 0 ή 5.\n• με το 10: λήγει σε 0.",
        example: "350 διαιρείται με το 2, 5 και 10!",
        tip: "💡 Αν ένας αριθμός λήγει σε 0, πληροί αυτόματα και τα 3 αυτά κριτήρια."
      },
      {
        badge: "ΟΜΑΔΑ 2",
        sub: "Άθροισμα",
        title: "Διαιρετότητα με 3 και 9",
        body: "Προσθέτουμε όλα τα ψηφία του αριθμού μεταξύ τους:\n• με το 3: το άθροισμα ψηφίων διαιρείται με το 3.\n• με το 9: το άθροισμα ψηφίων διαιρείται με το 9.",
        example: "738 ➔ 7＋3＋8 ＝ 18 (με το 3 και 9)",
        tip: "⚡ Κάθε αριθμός που διαιρείται με το 9 διαιρείται οπωσδήποτε και με το 3!"
      },
      {
        badge: "ΟΜΑΔΑ 3",
        sub: "2 Τελευταία Ψηφία",
        title: "Διαιρετότητα με 4 και 25",
        body: "Εξετάζουμε τα δύο τελευταία ψηφία μαζί (δεκάδες και μονάδες):\n• με το 4: τα 2 τελευταία ψηφία διαιρούνται με το 4 (ή είναι 00).\n• με το 25: τελειώνει σε 00, 25, 50 ή 75.",
        example: "1.275 (με το 25) • 324 (με το 4)",
        tip: "🎯 Τα προηγούμενα ψηφία (εκατοντάδες, χιλιάδες κ.λπ.) δεν επηρεάζουν τη διαίρεση με το 4 ή το 25."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικός Έλεγχος Κριτηρίων Διαιρετότητας",
    labDesc: "Πληκτρολόγησε οποιονδήποτε αριθμό (έως 10 ψηφία) και δες αυτόματα την ανάλυση για όλα τα κριτήρια!",
    inputHeader: "Πληκτρολόγησε Αριθμό:",
    presetHeader: "Ή διάλεξε έτοιμο παράδειγμα:",
    tipMulti: "💡 Ένας αριθμός μπορεί να διαιρείται ταυτόχρονα με πολλούς διαφορετικούς αριθμούς!",
    liveCheckTitle: "ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΓΙΑ ΤΟΝ ΑΡΙΘΜΟ:",
    emptyPrompt: "Πληκτρολόγησε έναν αριθμό στα αριστερά για να ξεκινήσει ο αυτόματος έλεγχος.",
    footerNote: "🔍 Αν ένας αριθμός τελειώνει σε 0, διαιρείται σίγουρα με το 2, το 5 και το 10!",
    ctaTitle: "Ώρα για Εξάσκηση στα Κριτήρια Διαιρετότητας!",
    ctaDesc: "Έμαθες όλα τα κριτήρια διαιρετότητας; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων",
    criteriaData: {
      c2: {
        title: 'Διαιρείται με το 2;',
        rule: 'Πρέπει το τελευταίο ψηφίο να είναι ζυγό (0, 2, 4, 6, 8).',
        lastDigitLabel: 'Τελευταίο ψηφίο:',
        success: ' (Είναι ζυγό! ✅)',
        fail: ' (Δεν είναι ζυγό! ❌)'
      },
      c3: {
        title: 'Διαιρείται με το 3;',
        rule: 'Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 3.',
        sumLabel: 'Άθροισμα:',
        success: (sum) => ` (Το ${sum} διαιρείται με το 3! ✅)`,
        fail: (sum) => ` (Το ${sum} δεν διαιρείται με το 3! ❌)`
      },
      c4: {
        title: 'Διαιρείται με το 4;',
        rule: 'Πρέπει τα δύο τελευταία ψηφία να διαιρούνται με το 4 (ή να είναι 00).',
        lastTwoLabel: 'Δύο τελευταία ψηφία:',
        success: (val) => ` (Το ${val} διαιρείται με το 4! ✅)`,
        fail: (val) => ` (Το ${val} δεν διαιρείται με το 4! ❌)`
      },
      c5: {
        title: 'Διαιρείται με το 5;',
        rule: 'Πρέπει το τελευταίο ψηφίο να είναι 0 ή 5.',
        lastDigitLabel: 'Τελευταίο ψηφίο:',
        success: ' (Είναι 0 ή 5! ✅)',
        fail: ' (Δεν είναι 0 ή 5! ❌)'
      },
      c9: {
        title: 'Διαιρείται με το 9;',
        rule: 'Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 9.',
        sumLabel: 'Άθροισμα:',
        success: (sum) => ` (Το ${sum} διαιρείται με το 9! ✅)`,
        fail: (sum) => ` (Το ${sum} δεν διαιρείται με το 9! ❌)`
      },
      c10: {
        title: 'Διαιρείται με το 10;',
        rule: 'Πρέπει το τελευταίο ψηφίο να είναι 0.',
        lastDigitLabel: 'Τελευταίο ψηφίο:',
        success: ' (Είναι 0! ✅)',
        fail: ' (Δεν είναι 0! ❌)'
      },
      c25: {
        title: 'Διαιρείται με το 25;',
        rule: 'Πρέπει τα δύο τελευταία ψηφία να είναι 00, 25, 50 ή 75.',
        lastTwoLabel: 'Δύο τελευταία ψηφία:',
        success: ' (Είναι στις επιλογές 00, 25, 50, 75! ✅)',
        fail: ' (Δεν είναι 00, 25, 50, 75! ❌)'
      }
    }
  },
  en: {
    pageTitle: "Divisibility Rules (2, 3, 4, 5, 9, 10, 25) - Grade 6 | LearnMaths.gr",
    pageDescription: "Master divisibility rules for 2, 3, 4, 5, 9, 10, and 25 to instantly know whether a number divides evenly for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 15 • GRADE 6",
    heroTitle: "Divisibility Rules (2, 3, 4, 5, 9, 10, 25)",
    heroDesc: "Learn smart mathematical shortcuts to determine instantly whether a number divides exactly, without carrying out the full division algorithm!",
    heroPills: "Checking Last Digits & Sum of Digits",
    heroCta: "Try the Exercises",
    theoryTitle: "The 3 Categories of Divisibility Rules",
    theorySubtitle: "Grouping rules based on what part of the number we inspect.",
    cards: [
      {
        badge: "GROUP 1",
        sub: "Last Digit",
        title: "Divisibility by 2, 5, and 10",
        body: "Inspect only the units digit:\n• by 2: ends in 0, 2, 4, 6, 8 (even number).\n• by 5: ends in 0 or 5.\n• by 10: ends in 0.",
        example: "350 is divisible by 2, 5, and 10!",
        tip: "💡 If a number ends in 0, it automatically satisfies all 3 of these rules."
      },
      {
        badge: "GROUP 2",
        sub: "Digit Sum",
        title: "Divisibility by 3 and 9",
        body: "Add all the digits of the number together:\n• by 3: the sum of digits is divisible by 3.\n• by 9: the sum of digits is divisible by 9.",
        example: "738 ➔ 7＋3＋8 ＝ 18 (divisible by 3 and 9)",
        tip: "⚡ Any number divisible by 9 is definitely divisible by 3 as well!"
      },
      {
        badge: "GROUP 3",
        sub: "Last 2 Digits",
        title: "Divisibility by 4 and 25",
        body: "Inspect the last two digits formed together:\n• by 4: the last two digits form a multiple of 4 (or 00).\n• by 25: ends in 00, 25, 50, or 75.",
        example: "1,275 (by 25) • 324 (by 4)",
        tip: "🎯 Preceding digits (hundreds, thousands, etc.) have no impact on divisibility by 4 or 25."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Divisibility Rules Checker",
    labDesc: "Type any number (up to 10 digits) and inspect live feedback across all divisibility criteria!",
    inputHeader: "Enter Number:",
    presetHeader: "Or select a preset example:",
    tipMulti: "💡 A single number can be simultaneously divisible by multiple different integers!",
    liveCheckTitle: "DIVISIBILITY CHECK FOR NUMBER:",
    emptyPrompt: "Enter a number on the left to start the automated divisibility inspection.",
    footerNote: "🔍 If a number ends in 0, it is guaranteed to divide by 2, 5, and 10!",
    ctaTitle: "Time to Practice Divisibility Rules!",
    ctaDesc: "Mastered all divisibility shortcuts? Put your skills to the test with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises",
    criteriaData: {
      c2: {
        title: 'Divisible by 2?',
        rule: 'The last digit must be even (0, 2, 4, 6, 8).',
        lastDigitLabel: 'Last digit:',
        success: ' (It is even! ✅)',
        fail: ' (It is not even! ❌)'
      },
      c3: {
        title: 'Divisible by 3?',
        rule: 'The sum of its digits must be divisible by 3.',
        sumLabel: 'Sum:',
        success: (sum) => ` (${sum} is divisible by 3! ✅)`,
        fail: (sum) => ` (${sum} is not divisible by 3! ❌)`
      },
      c4: {
        title: 'Divisible by 4?',
        rule: 'The last two digits must form a multiple of 4 (or be 00).',
        lastTwoLabel: 'Last two digits:',
        success: (val) => ` (${val} is divisible by 4! ✅)`,
        fail: (val) => ` (${val} is not divisible by 4! ❌)`
      },
      c5: {
        title: 'Divisible by 5?',
        rule: 'The last digit must be 0 or 5.',
        lastDigitLabel: 'Last digit:',
        success: ' (It is 0 or 5! ✅)',
        fail: ' (It is not 0 or 5! ❌)'
      },
      c9: {
        title: 'Divisible by 9?',
        rule: 'The sum of its digits must be divisible by 9.',
        sumLabel: 'Sum:',
        success: (sum) => ` (${sum} is divisible by 9! ✅)`,
        fail: (sum) => ` (${sum} is not divisible by 9! ❌)`
      },
      c10: {
        title: 'Divisible by 10?',
        rule: 'The last digit must be 0.',
        lastDigitLabel: 'Last digit:',
        success: ' (It is 0! ✅)',
        fail: ' (It is not 0! ❌)'
      },
      c25: {
        title: 'Divisible by 25?',
        rule: 'The last two digits must be 00, 25, 50, or 75.',
        lastTwoLabel: 'Last two digits:',
        success: ' (Matches 00, 25, 50, or 75! ✅)',
        fail: ' (Does not match 00, 25, 50, or 75! ❌)'
      }
    }
  }
};

export default function KritiriaDiairetotitasPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [numberStr, setNumberStr] = useState('7525');

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setNumberStr('');
    } else {
      const sliced = clean.slice(0, 10);
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setNumberStr(MAX_ALLOWED_NUMBER.toString());
      } else {
        setNumberStr(sliced);
      }
    }
  };
  
  const currentBigInt = numberStr ? BigInt(numberStr) : 0n;
  const digits = numberStr.split('').map(Number);
  const lastDigit = digits.length > 0 ? digits[digits.length - 1] : null;
  const lastTwoDigitsStr = digits.length > 1 ? numberStr.slice(-2) : numberStr;
  const lastTwoDigits = parseInt(lastTwoDigitsStr, 10) || 0;
  const sumOfDigits = digits.reduce((a, b) => a + b, 0);

  const criteria = [
    {
      check: 2,
      title: t.criteriaData.c2.title,
      rule: t.criteriaData.c2.rule,
      isTrue: currentBigInt > 0n && currentBigInt % 2n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          {t.criteriaData.c2.lastDigitLabel} {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 2n === 0n ? t.criteriaData.c2.success : t.criteriaData.c2.fail}
        </div>
      )
    },
    {
      check: 3,
      title: t.criteriaData.c3.title,
      rule: t.criteriaData.c3.rule,
      isTrue: digits.length > 0 && sumOfDigits % 3 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800">
          {t.criteriaData.c3.sumLabel} {digits.join(' ＋ ')} ＝ <span className="text-amber-400 font-black text-sm">{sumOfDigits}</span>
          {digits.length > 0 && sumOfDigits % 3 === 0 ? t.criteriaData.c3.success(sumOfDigits) : t.criteriaData.c3.fail(sumOfDigits)}
        </div>
      )
    },
    {
      check: 4,
      title: t.criteriaData.c4.title,
      rule: t.criteriaData.c4.rule,
      isTrue: digits.length > 0 && lastTwoDigits % 4 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          {t.criteriaData.c4.lastTwoLabel} {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-amber-400 font-black underline text-sm">{numberStr}</span>}
          {digits.length > 0 && lastTwoDigits % 4 === 0 ? t.criteriaData.c4.success(lastTwoDigits) : t.criteriaData.c4.fail(lastTwoDigits)}
        </div>
      )
    },
    {
      check: 5,
      title: t.criteriaData.c5.title,
      rule: t.criteriaData.c5.rule,
      isTrue: currentBigInt > 0n && currentBigInt % 5n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          {t.criteriaData.c5.lastDigitLabel} {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 5n === 0n ? t.criteriaData.c5.success : t.criteriaData.c5.fail}
        </div>
      )
    },
    {
      check: 9,
      title: t.criteriaData.c9.title,
      rule: t.criteriaData.c9.rule,
      isTrue: digits.length > 0 && sumOfDigits % 9 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800">
          {t.criteriaData.c9.sumLabel} {digits.join(' ＋ ')} ＝ <span className="text-amber-400 font-black text-sm">{sumOfDigits}</span>
          {digits.length > 0 && sumOfDigits % 9 === 0 ? t.criteriaData.c9.success(sumOfDigits) : t.criteriaData.c9.fail(sumOfDigits)}
        </div>
      )
    },
    {
      check: 10,
      title: t.criteriaData.c10.title,
      rule: t.criteriaData.c10.rule,
      isTrue: currentBigInt > 0n && currentBigInt % 10n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          {t.criteriaData.c10.lastDigitLabel} {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 10n === 0n ? t.criteriaData.c10.success : t.criteriaData.c10.fail}
        </div>
      )
    },
    {
      check: 25,
      title: t.criteriaData.c25.title,
      rule: t.criteriaData.c25.rule,
      isTrue: digits.length > 0 && lastTwoDigits % 25 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          {t.criteriaData.c25.lastTwoLabel} {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-amber-400 font-black underline text-sm">{numberStr}</span>}
          {digits.length > 0 && lastTwoDigits % 25 === 0 ? t.criteriaData.c25.success : t.criteriaData.c25.fail}
        </div>
      )
    }
  ];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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
              href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΛΕΓΧΟΥ ΚΡΙΤΗΡΙΩΝ */}
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
            
            {/* LEFT: INPUT & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputHeader}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-widest break-all"
                    placeholder="7525"
                  />
                </div>

                {/* PRESETS BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetHeader}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all touch-manipulation active:scale-95 cursor-pointer ${
                          numberStr === preset.toString()
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.tipMulti}
              </div>
            </div>

            {/* RIGHT: LIVE CRITERIA CHECKS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              <div className="w-full text-center mb-2">
                <span className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider block">
                  {t.liveCheckTitle}
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all shadow-sm">
                  {numberStr || '—'}
                </div>
              </div>

              {/* CRITERIA CARDS LIST */}
              <div className="w-full space-y-3 sm:space-y-3.5 my-auto">
                {numberStr ? (
                  criteria.map((c) => (
                    <div
                      key={c.check}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 transition-all hover:border-slate-300 shadow-sm"
                    >
                      <div className="space-y-1 md:max-w-[45%] w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-lg text-white shrink-0 ${
                              c.isTrue ? 'bg-emerald-600' : 'bg-rose-500'
                            }`}
                          >
                            {c.isTrue ? (isEn ? '✓ Yes' : '✓ Ναι') : (isEn ? '✕ No' : '✕ Όχι')}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-800">{c.title}</h4>
                        </div>
                        <p className="text-slate-600 text-[11px] sm:text-xs leading-tight font-medium">{c.rule}</p>
                      </div>

                      <div className="flex-1 md:max-w-[52%] w-full">
                        {c.visual()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    {t.emptyPrompt}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                <span>{t.footerNote}</span>
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
            href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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