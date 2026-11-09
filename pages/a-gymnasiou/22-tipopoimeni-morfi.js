import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων από τόνους με διατήρηση του Α'
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

// Βοηθητική συνάρτηση μετατροπής αριθμού σε τυποποιημένη μορφή
function convertToScientific(inputStr, locale = 'el') {
  if (!inputStr || !inputStr.trim()) return null;
  const clean = inputStr.trim().replace(/\s+/g, '').replace(',', '.');
  const num = parseFloat(clean);
  if (isNaN(num) || num === 0) return null;

  const isNeg = num < 0;
  const absNum = Math.abs(num);

  // Επιστημονική αναπαράσταση μέσω toExponential
  const expStr = absNum.toExponential();
  const [mantissaStr, expPart] = expStr.split('e');
  const exp = parseInt(expPart, 10);
  let mantissa = parseFloat(mantissaStr);

  // Στρογγυλοποίηση για καθαρή εμφάνιση έως 4 δεκαδικά
  mantissa = Math.round(mantissa * 10000) / 10000;

  const dirLeft = locale === 'el' ? 'αριστερά' : 'left';
  const dirRight = locale === 'el' ? 'δεξιά' : 'right';
  const dirNone = locale === 'el' ? 'καμία' : 'none';

  const direction = exp > 0 ? dirLeft : exp < 0 ? dirRight : dirNone;
  const steps = Math.abs(exp);

  const formattedMantissaNum = mantissa.toString();
  const displayMantissa = locale === 'el' ? formattedMantissaNum.replace('.', ',') : formattedMantissaNum;

  return {
    isNegative: isNeg,
    mantissa,
    exponent: exp,
    direction,
    steps,
    formattedMantissa: (isNeg ? '－' : '') + displayMantissa,
  };
}

export default function TipopoimeniMorfiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για Εργαστήριο 1: Διαδραστικός Μετατροπέας
  const [userInput, setUserInput] = useState('150000000');

  // State για Εργαστήριο 2: Σύγκριση Μεγεθών
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(3);

  const realWorldExamples = {
    el: [
      {
        category: 'ΜΙΚΡΟΚΟΣΜΟΣ',
        name: 'Ακτίνα Πρωτονίου',
        value: '0,00000000000000084 m',
        scientificNum: '8,4',
        scientificExp: '-16',
        unit: 'm',
        description: 'Η διάσταση ενός από τα βασικά υποατομικά σωματίδια στον πυρήνα των ατόμων.',
      },
      {
        category: 'ΜΙΚΡΟΚΟΣΜΟΣ',
        name: 'Μέγεθος Βακτηρίου',
        value: '0,000002 m',
        scientificNum: '2',
        scientificExp: '-6',
        unit: 'm',
        description: 'Το μέσο μήκος ενός κοινού μονοκύτταρου μικροοργανισμού.',
      },
      {
        category: 'ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ',
        name: 'Πάχος Φύλλου Χαρτιού',
        value: '0,0001 m',
        scientificNum: '1',
        scientificExp: '-4',
        unit: 'm',
        description: 'Το τυπικό πάχος μιας κόλλας Α4 εκτύπωσης (0,1 mm).',
      },
      {
        category: 'ΓΗ & ΚΟΣΜΟΣ',
        name: 'Ταχύτητα Φωτός στο Κενό',
        value: '300.000.000 m/s',
        scientificNum: '3',
        scientificExp: '8',
        unit: 'm/s',
        description: 'Η απόλυτη μέγιστη ταχύτητα διάδοσης πληροφορίας στο Σύμπαν.',
      },
      {
        category: 'ΑΣΤΡΟΝΟΜΙΑ',
        name: 'Απόσταση Γης - Ήλιου',
        value: '149.600.000 km',
        scientificNum: '1,496',
        scientificExp: '8',
        unit: 'km',
        description: 'Γνωστή και ως μία Αστρονομική Μονάδα (1 AU).',
      },
      {
        category: 'ΑΣΤΡΟΝΟΜΙΑ',
        name: 'Μάζα της Γης',
        value: '5.972.000.000.000.000.000.000.000 kg',
        scientificNum: '5,972',
        scientificExp: '24',
        unit: 'kg',
        description: 'Η συνολική εκτιμώμενη μάζα του πλανήτη μας.',
      },
    ],
    en: [
      {
        category: 'MICROCOSM',
        name: 'Proton Radius',
        value: '0.00000000000000084 m',
        scientificNum: '8.4',
        scientificExp: '-16',
        unit: 'm',
        description: 'The dimension of a fundamental subatomic particle in atomic nuclei.',
      },
      {
        category: 'MICROCOSM',
        name: 'Bacterium Size',
        value: '0.000002 m',
        scientificNum: '2',
        scientificExp: '-6',
        unit: 'm',
        description: 'The average length of a common single-celled microorganism.',
      },
      {
        category: 'EVERYDAY LIFE',
        name: 'Paper Sheet Thickness',
        value: '0.0001 m',
        scientificNum: '1',
        scientificExp: '-4',
        unit: 'm',
        description: 'Typical thickness of a standard A4 printer sheet (0.1 mm).',
      },
      {
        category: 'EARTH & COSMOS',
        name: 'Speed of Light in Vacuum',
        value: '300,000,000 m/s',
        scientificNum: '3',
        scientificExp: '8',
        unit: 'm/s',
        description: 'The absolute maximum speed of information transfer in the Universe.',
      },
      {
        category: 'ASTRONOMY',
        name: 'Earth - Sun Distance',
        value: '149,600,000 km',
        scientificNum: '1.496',
        scientificExp: '8',
        unit: 'km',
        description: 'Commonly known as one Astronomical Unit (1 AU).',
      },
      {
        category: 'ASTRONOMY',
        name: 'Earth Mass',
        value: '5,972,000,000,000,000,000,000,000 kg',
        scientificNum: '5.972',
        scientificExp: '24',
        unit: 'kg',
        description: 'The total estimated mass of planet Earth.',
      },
    ]
  }[locale];

  const presets = {
    el: [
      { label: '384.000 km (Απόσταση Γης - Σελήνης)', val: '384000' },
      { label: '8.000.000.000 (Πληθυσμός Γης)', val: '8000000000' },
      { label: '0,00005 m (Πάχος Τρίχας)', val: '0,00005' },
      { label: '0,000000001 m (Νανόμετρο)', val: '0,000000001' },
      { label: '－45.000.000 (Αρνητικός Αριθμός)', val: '-45000000' },
    ],
    en: [
      { label: '384,000 km (Earth - Moon Distance)', val: '384000' },
      { label: '8,000,000,000 (World Population)', val: '8000000000' },
      { label: '0.00005 m (Hair Thickness)', val: '0.00005' },
      { label: '0.000000001 m (Nanometer)', val: '0.000000001' },
      { label: '－45,000,000 (Negative Number)', val: '-45000000' },
    ]
  }[locale];

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Τυποποιημένη Μορφή Αριθμών | Α' Γυμνασίου",
      pageDesc: "Έννοια της τυποποιημένης μορφής (επιστημονική σημειογραφία) για πολύ μεγάλους και πολύ μικρούς αριθμούς, δυνάμεις του 10 και διαδραστικά εργαστήρια.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 20 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      mainTitle: "Τυποποιημένη Μορφή Μικρών & Μεγάλων Αριθμών",
      mainSubtitle: "Μαθαίνουμε πώς να γράφουμε και να διαβάζουμε εύκολα εξαιρετικά μεγάλους ή απειροελάχιστους αριθμούς της επιστήμης, χρησιμοποιώντας τις δυνάμεις του 10 και την επιστημονική σημειογραφία.",

      // Ενότητα 1
      sec1Title: "Τι Είναι η Τυποποιημένη Μορφή;",
      sec1IntroP1: "Στις φυσικές επιστήμες, στην αστρονομία και στη μικροβιολογία συναντάμε συχνά αριθμούς με πάρα πολλά μηδενικά, όπως το 300.000.000 ή το 0,0000005.",
      sec1IntroP2: "Για να αποφεύγουμε τη γραφή πολλών ψηφίων, γράφουμε κάθε ρητό αριθμό σε τυποποιημένη μορφή (ή επιστημονική σημειογραφία):",
      sec1FormulaWhere: "όπου",
      sec1FormulaAnd: "και",
      sec1Bul1: "α (συντελεστής): δεκαδικός αριθμός με ένα μόνο μη μηδενικό ψηφίο αριστερά από την υποδιαστολή (1 έως 9).",
      sec1Bul2: "10ᵏ: δύναμη του 10 με εκθέτη ακέραιο (θετικό, μηδέν ή αρνητικό).",
      powers10Title: "ΟΙ ΔΥΝΑΜΕΙΣ ΤΟΥ 10 ΩΣ ΕΡΓΑΛΕΙΟ",
      largeNumbersTitle: "Μεγάλοι Αριθμοί (k ＞ 0)",
      smallNumbersTitle: "Μικροί Αριθμοί (k ＜ 0)",
      thousandLabel: "(χίλια)",
      millionLabel: "(εκατομμύριο)",
      tenthLabel: "(δέκατο)",
      hundredthLabel: "(εκατοστό)",
      thousandthLabel: "(χιλιοστό)",
      millionthLabel: "(εκατομμυριοστό)",

      // Ενότητα 2
      sec2Title: "Πώς Μετατρέπουμε Μεγάλους & Μικρούς Αριθμούς",
      caseABadge: "ΠΕΡΙΠΤΩΣΗ Α: ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ (≥ 10)",
      caseATitle: "Μετακίνηση Υποδιαστολής ΑΡΙΣΤΕΡΑ",
      caseAStep1: "Μετακινούμε την υποδιαστολή προς τα αριστερά μέχρι να μείνει μόνο 1 μη μηδενικό ψηφίο αριστερά της.",
      caseAStep2: "Μετράμε πόσες θέσεις k μετακινηθήκαμε.",
      caseAStep3: "Πολλαπλασιάζουμε με το 10ᵏ (θετικός εκθέτης).",
      caseAPos5: "5 θέσεις αριστερά",
      caseAPos9: "9 θέσεις αριστερά",

      caseBBadge: "ΠΕΡΙΠΤΩΣΗ Β: ΜΙΚΡΟΙ ΑΡΙΘΜΟΙ (0 ＜ x ＜ 1)",
      caseBTitle: "Μετακίνηση Υποδιαστολής ΔΕΞΙΑ",
      caseBStep1: "Μετακινούμε την υποδιαστολή προς τα δεξιά μέχρι να περάσει το πρώτο μη μηδενικό ψηφίο.",
      caseBStep2: "Μετράμε πόσες θέσεις k μετακινηθήκαμε.",
      caseBStep3: "Πολλαπλασιάζουμε με το 10⁻ᵏ (αρνητικός εκθέτης).",
      caseBPos3: "3 θέσεις δεξιά",
      caseBPos5: "5 θέσεις δεξιά",

      // Εργαστήριο 1
      lab1Title: "🛠️ Εργαστήριο 1: Αυτόματος Μετατροπέας Αριθμών σε Τυποποιημένη Μορφή",
      inputPrompt: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΕΝΑΝ ΑΡΙΘΜΟ (ΜΕΓΑΛΟ Η ΜΙΚΡΟ ΔΕΚΑΔΙΚΟ):",
      inputPlaceholder: "π.χ. 150000000 ή 0,000045",
      presetHeader: "ΕΠΙΛΕΞΤΕ ΕΝΑ ΕΤΟΙΜΟ ΠΑΡΑΔΕΙΓΜΑ:",
      resultHeader: "ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ",
      howItWorksTitle: "🔍 Πώς προέκυψε η μετατροπή:",
      mantissaDesc1: "Συντελεστής α: Μετακινήσαμε την υποδιαστολή ώστε να μείνει ένας αριθμός ανάμεσα στο 1 και το 10, δηλαδή το",
      expDesc1: "Εκθέτης k: Μετακινήσαμε την υποδιαστολή κατά",
      expDesc2: "θέσεις προς τα",
      expDesc3: ", άρα ο εκθέτης της δύναμης του 10 είναι το",
      invalidNumberPrompt: "Πληκτρολόγησε έναν έγκυρο μη μηδενικό αριθμό παραπάνω για να εμφανιστεί η ανάλυση.",

      // Εργαστήριο 2
      lab2Title: "🛠️ Εργαστήριο 2: Πραγματικά Μεγέθη στο Σύμπαν",
      lab2Intro: "Επέλεξε ένα επιστημονικό μέγεθος για να συγκρίνεις την αναλυτική δεκαδική γραφή με την αντίστοιχη τυποποιημένη μορφή:",
      standardizedBadge: "ΤΥΠΟΠΟΙΗΜΕΝΗ:",
      fullValueLabel: "Αναλυτική τιμή με όλα τα ψηφία:"
    },
    en: {
      pageTitle: "Standard Form of Numbers | 7th Grade",
      pageDesc: "Concept of standard form (scientific notation) for very large and very small numbers, powers of 10, and interactive labs.",
      backText: "7th Grade",
      btnExercises: "EXERCISES",
      badgeHeader: "7TH GRADE • CHAPTER 20 • THEORY & LAB",
      mainTitle: "Standard Form of Small & Large Numbers",
      mainSubtitle: "Learn how to easily write and read astronomical or microscopic numbers using powers of 10 and scientific notation.",

      // Section 1
      sec1Title: "What is Standard Form?",
      sec1IntroP1: "In science, astronomy, and microbiology we often encounter numbers with numerous zeros, such as 300,000,000 or 0.0000005.",
      sec1IntroP2: "To avoid writing many trailing or leading digits, we write numbers in standard form (or scientific notation):",
      sec1FormulaWhere: "where",
      sec1FormulaAnd: "and",
      sec1Bul1: "a (coefficient): a decimal number with exactly one non-zero digit to the left of the decimal point (1 to 9).",
      sec1Bul2: "10ᵏ: power of 10 with an integer exponent (positive, zero, or negative).",
      powers10Title: "POWERS OF 10 AS A TOOL",
      largeNumbersTitle: "Large Numbers (k ＞ 0)",
      smallNumbersTitle: "Small Numbers (k ＜ 0)",
      thousandLabel: "(thousand)",
      millionLabel: "(million)",
      tenthLabel: "(tenth)",
      hundredthLabel: "(hundredth)",
      thousandthLabel: "(thousandth)",
      millionthLabel: "(millionth)",

      // Section 2
      sec2Title: "How to Convert Large & Small Numbers",
      caseABadge: "CASE A: LARGE NUMBERS (≥ 10)",
      caseATitle: "Move Decimal Point LEFT",
      caseAStep1: "Move the decimal point to the left until only 1 non-zero digit remains to its left.",
      caseAStep2: "Count how many places k were moved.",
      caseAStep3: "Multiply by 10ᵏ (positive exponent).",
      caseAPos5: "5 places left",
      caseAPos9: "9 places left",

      caseBBadge: "CASE B: SMALL NUMBERS (0 ＜ x ＜ 1)",
      caseBTitle: "Move Decimal Point RIGHT",
      caseBStep1: "Move the decimal point to the right until it passes the first non-zero digit.",
      caseBStep2: "Count how many places k were moved.",
      caseBStep3: "Multiply by 10⁻ᵏ (negative exponent).",
      caseBPos3: "3 places right",
      caseBPos5: "5 places right",

      // Lab 1
      lab1Title: "🛠️ Lab 1: Interactive Standard Form Converter",
      inputPrompt: "TYPE A NUMBER (LARGE OR SMALL DECIMAL):",
      inputPlaceholder: "e.g. 150000000 or 0.000045",
      presetHeader: "CHOOSE A READY EXAMPLE:",
      resultHeader: "CONVERSION RESULT",
      howItWorksTitle: "🔍 How the conversion was computed:",
      mantissaDesc1: "Coefficient a: We shifted the decimal point to leave a number between 1 and 10, namely",
      expDesc1: "Exponent k: We shifted the decimal point by",
      expDesc2: "places to the",
      expDesc3: ", so the power of 10 exponent is",
      invalidNumberPrompt: "Type a valid non-zero number above to display the analysis.",

      // Lab 2
      lab2Title: "🛠️ Lab 2: Real-World Universe Scales",
      lab2Intro: "Select a scientific measurement to compare its full decimal form with the corresponding standard form:",
      standardizedBadge: "STANDARD:",
      fullValueLabel: "Full decimal value with all digits:"
    }
  }[locale];

  const parsedResult = useMemo(() => convertToScientific(userInput, locale), [userInput, locale]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/22-tipopoimeni-morfi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {toCleanUppercase(t.mainTitle)}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span className="break-words">{toCleanUppercase(t.sec1Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>{t.sec1IntroP1}</p>
              <p>{t.sec1IntroP2}</p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-2xl font-mono shadow-sm flex items-center justify-center gap-2 flex-wrap">
                <span>{locale === 'el' ? 'α · 10' : 'a · 10'}<sup>k</sup></span>
                <span className="text-xs sm:text-sm font-sans font-normal text-indigo-800">
                  {t.sec1FormulaWhere} 1 ≤ |{locale === 'el' ? 'α' : 'a'}| ＜ 10 {t.sec1FormulaAnd} k ∈ ℤ
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                <li><strong>{locale === 'el' ? 'α:' : 'a:'}</strong> {t.sec1Bul1}</li>
                <li><strong>10<sup>k</sup>:</strong> {t.sec1Bul2}</li>
              </ul>
            </div>

            {/* Πίνακας Δυνάμεων του 10 */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.powers10Title)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                {/* Θετικές Δυνάμεις */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-emerald-700 font-bold font-sans">{t.largeNumbersTitle}</div>
                  <div>10<sup>1</sup> ＝ 10</div>
                  <div>10<sup>2</sup> ＝ 100</div>
                  <div>10<sup>3</sup> ＝ {locale === 'el' ? '1.000' : '1,000'} <span className="font-sans text-xs text-slate-500">{t.thousandLabel}</span></div>
                  <div>10<sup>6</sup> ＝ {locale === 'el' ? '1.000.000' : '1,000,000'} <span className="font-sans text-xs text-slate-500">{t.millionLabel}</span></div>
                </div>

                {/* Αρνητικές Δυνάμεις */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-sky-700 font-bold font-sans">{t.smallNumbersTitle}</div>
                  <div>10<sup>-1</sup> ＝ {locale === 'el' ? '0,1' : '0.1'} <span className="font-sans text-xs text-slate-500">{t.tenthLabel}</span></div>
                  <div>10<sup>-2</sup> ＝ {locale === 'el' ? '0,01' : '0.01'} <span className="font-sans text-xs text-slate-500">{t.hundredthLabel}</span></div>
                  <div>10<sup>-3</sup> ＝ {locale === 'el' ? '0,001' : '0.001'} <span className="font-sans text-xs text-slate-500">{t.thousandthLabel}</span></div>
                  <div>10<sup>-6</sup> ＝ {locale === 'el' ? '0,000001' : '0.000001'} <span className="font-sans text-xs text-slate-500">{t.millionthLabel}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΚΑΝΟΝΕΣ ΜΕΤΑΤΡΟΠΗΣ (ΜΕΓΑΛΟΙ & ΜΙΚΡΟΙ ΑΡΙΘΜΟΙ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span className="break-words">{toCleanUppercase(t.sec2Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* 1. Μεγάλοι Αριθμοί */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                  {toCleanUppercase(t.caseABadge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{t.caseATitle}</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>{t.caseAStep1}</li>
                  <li>{t.caseAStep2}</li>
                  <li>{t.caseAStep3}</li>
                </ol>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center text-indigo-950 flex-wrap gap-1">
                  <span>{locale === 'el' ? '540.000 ＝ 5,4 · 10' : '540,000 ＝ 5.4 · 10'}<sup>5</sup></span>
                  <span className="text-slate-400 font-sans text-xs">({t.caseAPos5})</span>
                </div>
                <div className="flex justify-between items-center text-indigo-950 flex-wrap gap-1">
                  <span>{locale === 'el' ? '3.200.000.000 ＝ 3,2 · 10' : '3,200,000,000 ＝ 3.2 · 10'}<sup>9</sup></span>
                  <span className="text-slate-400 font-sans text-xs">({t.caseAPos9})</span>
                </div>
              </div>
            </div>

            {/* 2. Μικροί Αριθμοί */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                  {toCleanUppercase(t.caseBBadge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{t.caseBTitle}</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>{t.caseBStep1}</li>
                  <li>{t.caseBStep2}</li>
                  <li>{t.caseBStep3}</li>
                </ol>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-sky-100 space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center text-sky-950 flex-wrap gap-1">
                  <span>{locale === 'el' ? '0,007 ＝ 7 · 10' : '0.007 ＝ 7 · 10'}<sup>-3</sup></span>
                  <span className="text-slate-400 font-sans text-xs">({t.caseBPos3})</span>
                </div>
                <div className="flex justify-between items-center text-sky-950 flex-wrap gap-1">
                  <span>{locale === 'el' ? '0,000042 ＝ 4,2 · 10' : '0.000042 ＝ 4.2 · 10'}<sup>-5</sup></span>
                  <span className="text-slate-400 font-sans text-xs">({t.caseBPos5})</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΣΕ ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span className="break-words">{toCleanUppercase(t.lab1Title)}</span>
            </h2>
          </div>

          <div className="space-y-6">
            {/* Input & Presets */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {toCleanUppercase(t.inputPrompt)}
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full h-13 px-4 sm:px-5 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-slate-900 font-mono text-base sm:text-xl font-bold outline-none transition-all shadow-inner"
                />
              </div>

              {/* Έτοιμα Παραδείγματα */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.presetHeader)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserInput(p.val)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-800 transition active:scale-95 shadow-sm break-words"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Κάρτα Αποτελέσματος Μετατροπής */}
            {parsedResult ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-5 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.resultHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    1 ≤ |{parsedResult.mantissa.toString().replace('.', locale === 'el' ? ',' : '.')}| ＜ 10
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-black py-2 flex-wrap text-center">
                  <span className="text-slate-300 break-words">{userInput}</span>
                  <span className="text-amber-400 font-sans">＝</span>
                  <span className="text-emerald-400 break-words">
                    {parsedResult.formattedMantissa} · 10<sup>{parsedResult.exponent}</sup>
                  </span>
                </div>

                {/* Ανάλυση Βημάτων */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  <div className="font-bold text-indigo-200">
                    {t.howItWorksTitle}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong>{locale === 'el' ? 'Συντελεστής α:' : 'Coefficient a:'}</strong> {t.mantissaDesc1} <strong>{parsedResult.formattedMantissa}</strong>.
                    </li>
                    <li>
                      <strong>{locale === 'el' ? 'Εκθέτης k:' : 'Exponent k:'}</strong> {t.expDesc1} <strong>{parsedResult.steps}</strong> {t.expDesc2} <strong>{parsedResult.direction}</strong>{t.expDesc3} <strong>{parsedResult.exponent}</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold text-center">
                {t.invalidNumberPrompt}
              </div>
            )}
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΟ ΤΟ ΣΥΜΠΑΝ ΣΤΟΝ ΜΙΚΡΟΚΟΣΜΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span className="break-words">{toCleanUppercase(t.lab2Title)}</span>
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-slate-600">
              {t.lab2Intro}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {realWorldExamples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedScaleIndex(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between gap-2 touch-manipulation active:scale-95 min-w-0 ${
                    selectedScaleIndex === idx
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75 break-words">
                    {ex.category}
                  </span>
                  <span className="font-bold text-xs sm:text-sm leading-tight block break-words">
                    {ex.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Κάρτα Επιλεγμένου Μεγέθους */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-md min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider break-words">
                  {realWorldExamples[selectedScaleIndex].category} • {realWorldExamples[selectedScaleIndex].name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                  {toCleanUppercase(t.standardizedBadge)} {realWorldExamples[selectedScaleIndex].scientificNum} · 10<sup>{realWorldExamples[selectedScaleIndex].scientificExp}</sup> {realWorldExamples[selectedScaleIndex].unit}
                </span>
              </div>

              <div className="space-y-3 min-w-0">
                <div className="text-xs text-slate-400 font-sans">
                  {t.fullValueLabel}
                </div>
                <div className="text-base sm:text-2xl font-mono font-black text-amber-300 break-all">
                  {realWorldExamples[selectedScaleIndex].value}
                </div>

                <div className="text-xs sm:text-sm text-slate-200 pt-2 border-t border-slate-800 leading-relaxed break-words">
                  {realWorldExamples[selectedScaleIndex].description}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}