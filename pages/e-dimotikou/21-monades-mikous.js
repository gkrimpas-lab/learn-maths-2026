// pages/e-dimotikou/21-monades-mikous.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const dictionary = {
  el: {
    pageTitle: "Μονάδες Μέτρησης Μήκους - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τις μονάδες μέτρησης μήκους (km, m, dm, cm, mm), τον κανόνα της σκάλας μετατροπών, πολλαπλασιασμό και διαίρεση με δυνάμεις του 10 και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    badge: "ΚΕΦΑΛΑΙΟ 21 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Μονάδες Μέτρησης Μήκους",
    mainDesc: "Εξερευνούμε το μέτρο (m) ως βασική μονάδα μήκους, τις υποδιαιρέσεις του (dm, cm, mm), το πολλαπλάσιο του χιλιομέτρου (km) και μαθαίνουμε τον κανόνα της σκάλας για άμεσες και αλάνθαστες μετατροπές.",
    statusTheory: "Θεωρία & Διαδραστικός Μετατροπέας Μονάδων",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η κλίμακα των μονάδων μέτρησης και οι μαθηματικοί κανόνες μετατροπής.",
    step1Tag: "ΒΗΜΑ 1",
    step1Category: "Βασική Μονάδα",
    step1Title: "Το Μέτρο & οι Υποδιαιρέσεις",
    step1Desc: "Η κύρια μονάδα μέτρησης μήκους είναι το μέτρο (m). Για μικρότερα αντικείμενα χρησιμοποιούμε τις υποδιαιρέσεις του:",
    step1Decimeters: "δεκατόμετρα",
    step1Centimeters: "εκατοστά",
    step1Millimeters: "χιλιοστά",
    step1Tip: "Κάθε διαδοχική υποδιαίρεση είναι 10 φορές μικρότερη από την προηγούμενη ( 1 dm ＝ 10 cm, 1 cm ＝ 10 mm ).",
    step2Tag: "ΒΗΜΑ 2",
    step2Category: "Πολλαπλάσιο",
    step2Title: "Το Χιλιόμετρο (km)",
    step2Desc: "Για τη μέτρηση μεγάλων αποστάσεων (π.χ. μεταξύ πόλεων, οδικά δίκτυα) χρησιμοποιούμε το χιλιόμετρο (km):",
    step2NotePart1: "Αντίστροφα, 1 μέτρο ισούται με το ένα χιλιοστό του χιλιομέτρου:",
    step2Warning: "Προσοχή: Το άλμα ανάμεσα σε m και km αξίζει 1.000 (όχι 10)!",
    step3Tag: "ΒΗΜΑ 3",
    step3Category: "Μετατροπές",
    step3Title: "Ο Κανόνας της Σκάλας",
    step3Desc: "Φανταζόμαστε τις μονάδες τοποθετημένες σε σκαλοπάτια (km → m → dm → cm → mm):",
    step3DownLabel: "Κατεβαίνω τη σκάλα (από μεγαλύτερη σε μικρότερη μονάδα):",
    step3DownAction: "Πολλαπλασιάζω ( · ) με το 10, 100, 1.000",
    step3UpLabel: "Ανεβαίνω τη σκάλα (από μικρότερη σε μεγαλύτερη μονάδα):",
    step3UpAction: "Διαιρώ ( : ) με το 10, 100, 1.000",
    step3Tip: "Κανόνας μνήμης: Μεγάλη σε μικρή μονάδα ➔ πολλαπλασιασμός. Μικρή σε μεγάλη ➔ διαίρεση.",
    step4Tag: "ΒΗΜΑ 4",
    step4Category: "Δεκαδικοί Αριθμοί",
    step4Title: "Μετακίνηση Υποδιαστολής",
    step4Desc: "Επειδή πολλαπλασιάζουμε ή διαιρούμε με το 10, 100, 1.000, μετακινούμε απλώς την υποδιαστολή:",
    step4Tip: "Στον πολλαπλασιασμό η υποδιαστολή πάει δεξιά. Στη διαίρεση πάει αριστερά!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Ζωντανός Μετατροπέας & Οπτική Σκάλα Μονάδων",
    labDesc: "Πληκτρολόγησε οποιονδήποτε αριθμό (μόνο ψηφία, έως 10 χαρακτήρες), επίλεξε τη μονάδα βάσης και δες ταυτόχρονα όλες τις ισοδύναμες τιμές και τη θέση στη γεωμετρική σκάλα.",
    inputSectionHeader: "ΕΙΣΑΓΩΓΗ ΤΙΜΗΣ & ΜΟΝΑΔΑΣ ΒΑΣΗΣ",
    amountLabel: "ΠΟΣΟΤΗΤΑ",
    digitsCount: "ψηφία",
    baseUnitLabel: "ΜΟΝΑΔΑ ΒΑΣΗΣ",
    placeholderAmount: "π.χ. 150",
    tableHeader: "ΙΣΟΔΥΝΑΜΑ ΜΗΚΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ:",
    ladderTitle: "ΟΠΤΙΚΗ ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ",
    selectedText: "Επιλογή",
    ladderDownText: "Κατεβαίνω: · 10",
    ladderUpText: "Ανεβαίνω: : 10",
    ladderCalloutPart1: "Κάθε σκαλοπάτι προς τα κάτω πολλαπλασιάζει",
    ladderCalloutPart2: "εκτός από το άλμα km → m",
    bottomBannerTitle: "Ώρα για Εξάσκηση στις Μονάδες Μήκους!",
    bottomBannerDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις μετατροπών, δεκαδικών υπολογισμών και προβλημάτων καθημερινής ζωής με αποστάσεις.",
    startExercisesBtn: "Έναρξη Ασκήσεων",
    unitsData: [
      { id: 0, name: 'χιλιοστό (mm)', short: 'mm', desc: 'Για πολύ μικρά μήκη (π.χ. το πάχος μιας πιστωτικής κάρτας).' },
      { id: 1, name: 'εκατοστό (cm)', short: 'cm', desc: 'Για καθημερινά αντικείμενα (π.χ. ένα μολύβι, χάρακας).' },
      { id: 2, name: 'δεκατόμετρο (dm)', short: 'dm', desc: 'Ισούται με 10 εκατοστά (π.χ. το άνοιγμα μιας παλάμης).' },
      { id: 3, name: 'μέτρο (m)', short: 'm', desc: 'Η θεμελιώδης βασική μονάδα μέτρησης μήκους.' },
      { id: 4, name: 'χιλιόμετρο (km)', short: 'km', desc: 'Για μεγάλες αποστάσεις (π.χ. διαδρομές μεταξύ πόλεων).' }
    ]
  },
  en: {
    pageTitle: "Units of Length - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn metric units of length (km, m, dm, cm, mm), the conversion ladder rule, multiplying and dividing by powers of 10, and explore the interactive laboratory.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    badge: "CHAPTER 21 • GRADE 5",
    mainTitle: "Units of Length Measurement",
    mainDesc: "We explore the meter (m) as the fundamental unit of length, its subdivisions (dm, cm, mm), the multiple kilometer (km), and master the ladder rule for quick, accurate conversions.",
    statusTheory: "Theory & Interactive Unit Converter",
    tryExercisesBtn: "Try the Exercises",
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The scale of measurement units and the mathematical conversion rules.",
    step1Tag: "STEP 1",
    step1Category: "Base Unit",
    step1Title: "The Meter & Subdivisions",
    step1Desc: "The primary base unit of length is the meter (m). For smaller objects, we use its submultiples:",
    step1Decimeters: "decimeters",
    step1Centimeters: "centimeters",
    step1Millimeters: "millimeters",
    step1Tip: "Each subsequent subdivision is 10 times smaller than the previous one ( 1 dm ＝ 10 cm, 1 cm ＝ 10 mm ).",
    step2Tag: "STEP 2",
    step2Category: "Multiple",
    step2Title: "The Kilometer (km)",
    step2Desc: "For measuring long distances (e.g. between cities, road networks), we use the kilometer (km):",
    step2NotePart1: "Conversely, 1 meter is equal to one thousandth of a kilometer:",
    step2Warning: "Notice: The jump between m and km is 1,000 (not 10)!",
    step3Tag: "STEP 3",
    step3Category: "Conversions",
    step3Title: "The Conversion Ladder Rule",
    step3Desc: "Imagine the units placed on stair steps (km → m → dm → cm → mm):",
    step3DownLabel: "Going down the ladder (from larger to smaller unit):",
    step3DownAction: "Multiply ( · ) by 10, 100, 1,000",
    step3UpLabel: "Going up the ladder (from smaller to larger unit):",
    step3UpAction: "Divide ( : ) by 10, 100, 1,000",
    step3Tip: "Memory rule: Larger to smaller unit ➔ multiplication. Smaller to larger ➔ division.",
    step4Tag: "STEP 4",
    step4Category: "Decimal Numbers",
    step4Title: "Shifting the Decimal Point",
    step4Desc: "Because we multiply or divide by 10, 100, 1,000, we simply shift the decimal point:",
    step4Tip: "When multiplying, the decimal point moves right. When dividing, it moves left!",
    labBadge: "INTERACTIVE LABORATORY",
    labTitle: "Live Converter & Visual Unit Ladder",
    labDesc: "Type any number (digits only, up to 10 characters), pick the base unit, and view all equivalent measurements and positions on the conversion ladder.",
    inputSectionHeader: "ENTER VALUE & BASE UNIT",
    amountLabel: "AMOUNT",
    digitsCount: "digits",
    baseUnitLabel: "BASE UNIT",
    placeholderAmount: "e.g. 150",
    tableHeader: "EQUIVALENT LENGTHS IN ALL UNITS:",
    ladderTitle: "VISUAL CONVERSION LADDER",
    selectedText: "Selected",
    ladderDownText: "Down: · 10",
    ladderUpText: "Up: : 10",
    ladderCalloutPart1: "Every step down multiplies by",
    ladderCalloutPart2: "except for the km → m step",
    bottomBannerTitle: "Time to Practice Length Units!",
    bottomBannerDesc: "Put your knowledge into practice with conversions, decimal calculations, and real-life distance problems.",
    startExercisesBtn: "Start Exercises",
    unitsData: [
      { id: 0, name: 'millimeter (mm)', short: 'mm', desc: 'For very small lengths (e.g. credit card thickness).' },
      { id: 1, name: 'centimeter (cm)', short: 'cm', desc: 'For everyday objects (e.g. pencil, ruler).' },
      { id: 2, name: 'decimeter (dm)', short: 'dm', desc: 'Equal to 10 centimeters (e.g. hand span).' },
      { id: 3, name: 'meter (m)', short: 'm', desc: 'The fundamental base unit of length.' },
      { id: 4, name: 'kilometer (km)', short: 'km', desc: 'For large distances (e.g. road trips between cities).' }
    ]
  }
};

const UNIT_FACTORS = {
  0: 0.001,
  1: 0.01,
  2: 0.1,
  3: 1,
  4: 1000
};

export default function MonadesMikousTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];

  const [selectedUnit, setSelectedUnit] = useState(3);
  const [inputValue, setInputValue] = useState(locale === 'en' ? '150' : '150');

  const units = t.unitsData.map((u) => ({
    ...u,
    factorToMeters: UNIT_FACTORS[u.id]
  }));

  const currentUnit = units.find((u) => u.id === selectedUnit) || units[3];

  const handleInputChange = (rawVal) => {
    let clean = '';
    if (locale === 'el') {
      clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = clean.split(',');
      if (parts.length > 2) {
        clean = parts[0] + ',' + parts.slice(1).join('');
      }
    } else {
      clean = rawVal.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }

    setInputValue(clean);
  };

  const convertValue = (targetUnitObj) => {
    if (!inputValue || inputValue === ',' || inputValue === '.') return '0';
    const normalizedStr = inputValue.replace(',', '.');
    const numValue = parseFloat(normalizedStr);
    if (isNaN(numValue) || numValue <= 0) return '0';

    const valueInMeters = numValue * currentUnit.factorToMeters;
    const finalValue = valueInMeters / targetUnitObj.factorToMeters;

    const locString = locale === 'el' ? 'el-GR' : 'en-US';

    if (finalValue % 1 === 0) {
      return finalValue.toLocaleString(locString);
    }

    return finalValue.toLocaleString(locString, { maximumFractionDigits: 6 });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/21-monades-mikous-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.mainDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.statusTheory}</span>
            </div>
            <Link
              href="/e-dimotikou/21-monades-mikous-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercisesBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsSectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ 10 dm</span>
                    <span className="text-slate-500">({t.step1Decimeters})</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ 100 cm</span>
                    <span className="text-slate-500">({t.step1Centimeters})</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ {locale === 'el' ? '1.000' : '1,000'} mm</span>
                    <span className="text-slate-500">({t.step1Millimeters})</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-emerald-950 shadow-inner">
                    1 km ＝ {locale === 'el' ? '1.000' : '1,000'} m
                  </div>
                  <div className="text-slate-600 text-xs font-sans text-left pt-1 flex flex-wrap items-center gap-1.5 leading-relaxed">
                    <span>{t.step2NotePart1}</span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold">
                      <span>1 m ＝</span>
                      <span className="inline-flex flex-col items-center justify-center align-middle text-[11px] leading-tight px-1 font-mono">
                        <span className="border-b border-slate-700 w-full text-center pb-0.5">1</span>
                        <span className="pt-0.5">{locale === 'el' ? '1.000' : '1,000'}</span>
                      </span>
                      <span>km ＝ {locale === 'el' ? '0,001' : '0.001'} km.</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ <strong>{t.step2Warning}</strong>
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • <strong>{t.step3DownLabel}</strong><br />
                    <span className="font-mono font-bold">{t.step3DownAction}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                    • <strong>{t.step3UpLabel}</strong><br />
                    <span className="font-mono font-bold">{t.step3UpAction}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 <strong>{t.step3Tip}</strong>
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>{locale === 'el' ? '3,5 m ＝ 3,5 · 100 ＝ 350 cm' : '3.5 m ＝ 3.5 · 100 ＝ 350 cm'}</div>
                  <div>{locale === 'el' ? '450 mm ＝ 450 : 1.000 ＝ 0,45 m' : '450 mm ＝ 450 : 1,000 ＝ 0.45 m'}</div>
                  <div>{locale === 'el' ? '2,8 km ＝ 2,8 · 1.000 ＝ 2.800 m' : '2.8 km ＝ 2.8 · 1,000 ＝ 2,800 m'}</div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΜΕΤΑΤΡΟΠΕΑΣ & ΣΚΑΛΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Πίνακας Ισοδύναμων Μηκών */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                  {toCleanUppercase(t.inputSectionHeader)}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="sm:col-span-7 space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="input-amount" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                        {t.amountLabel}
                      </label>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {inputValue.length}/10 {t.digitsCount}
                      </span>
                    </div>
                    <input
                      id="input-amount"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      maxLength={10}
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={t.placeholderAmount}
                      className="w-full bg-slate-50 border border-slate-300 font-mono font-black text-xl p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label htmlFor="select-unit" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      {t.baseUnitLabel}
                    </label>
                    <select
                      id="select-unit"
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-sm p-3 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.short} ({u.name.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Πίνακας Ισοδύναμων Μηκών */}
              <div className="space-y-2 py-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  {t.tableHeader}
                </span>
                {units.map((u) => {
                  const isCurrent = u.id === selectedUnit;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUnit(u.id)}
                      className={`p-3 px-4 rounded-2xl border flex justify-between items-center cursor-pointer transition select-none ${
                        isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-lg font-black ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.short}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">{u.name}</span>
                      </div>
                      <span className="font-mono font-black text-base sm:text-lg tabular-nums">
                        {convertValue(u)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-600 font-medium">
                💡 {currentUnit.desc}
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Οπτική Σκάλα Μετατροπών */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{t.ladderTitle}</span>
                <span className="font-mono text-blue-600 font-bold">{t.selectedText}: {currentUnit.short}</span>
              </div>

              {/* SVG Canvas Σκάλας */}
              <div className="w-full max-w-[460px] aspect-[460/280] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden my-auto">
                <svg
                  viewBox="0 0 460 280"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {[
                    { id: 4, short: 'km', x: 20, y: 55 },
                    { id: 3, short: 'm', x: 95, y: 100 },
                    { id: 2, short: 'dm', x: 170, y: 145 },
                    { id: 1, short: 'cm', x: 245, y: 190 },
                    { id: 0, short: 'mm', x: 320, y: 235 }
                  ].map((step, idx, arr) => {
                    const isSelected = step.id === selectedUnit;
                    const stepWidth = 72;

                    return (
                      <g key={step.id}>
                        {/* Οριζόντιο πάτημα σκάλας */}
                        <line
                          x1={step.x}
                          y1={step.y}
                          x2={step.x + stepWidth}
                          y2={step.y}
                          className="stroke-slate-400 stroke-[3.5]"
                        />

                        {/* Κάθετο σκαλοπάτι */}
                        {idx < arr.length - 1 && (
                          <line
                            x1={step.x + stepWidth}
                            y1={step.y}
                            x2={step.x + stepWidth}
                            y2={step.y + 45}
                            className="stroke-slate-400 stroke-[3.5]"
                          />
                        )}

                        {/* Επισημασμένο πλαίσιο σκαλοπατιού */}
                        {isSelected && (
                          <rect
                            x={step.x + 2}
                            y={step.y - 28}
                            width={stepWidth - 4}
                            height="26"
                            rx="7"
                            className="fill-blue-500/15 stroke-blue-600 stroke-[2]"
                          />
                        )}

                        {/* Κείμενο μονάδας */}
                        <text
                          x={step.x + stepWidth / 2}
                          y={step.y - 9}
                          textAnchor="middle"
                          className={`font-mono font-black ${
                            isSelected ? 'fill-blue-600 text-sm' : 'fill-slate-800 text-xs'
                          }`}
                        >
                          {step.short}
                        </text>

                        {/* Δείκτης επιλεγμένου */}
                        {isSelected && (
                          <circle
                            cx={step.x + stepWidth / 2}
                            cy={step.y - 36}
                            r="5"
                            className="fill-blue-600 animate-bounce"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Βέλος Κατηφόρας: Πολλαπλασιασμός ( · ) */}
                  <g transform="translate(305, 45)">
                    <path
                      d="M 0 0 L 26 26 M 26 26 L 18 26 M 26 26 L 26 18"
                      fill="none"
                      className="stroke-blue-600 stroke-[2.5] stroke-linecap-round"
                    />
                    <text x="32" y="16" className="fill-blue-700 font-mono text-[11px] font-black">
                      {t.ladderDownText}
                    </text>
                  </g>

                  {/* Βέλος Ανηφόρας: Διαίρεση ( : ) */}
                  <g transform="translate(25, 195)">
                    <path
                      d="M 26 26 L 0 0 M 0 0 L 8 0 M 0 0 L 0 8"
                      fill="none"
                      className="stroke-rose-600 stroke-[2.5] stroke-linecap-round"
                    />
                    <text x="34" y="20" className="fill-rose-700 font-mono text-[11px] font-black">
                      {t.ladderUpText}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 leading-relaxed">
                🪜 {t.ladderCalloutPart1}
                <br />
                <span className="whitespace-nowrap">( · 10 )</span>, {t.ladderCalloutPart2} <span className="whitespace-nowrap">( · {locale === 'el' ? '1.000' : '1,000'} )</span>!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.bottomBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomBannerDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/21-monades-mikous-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}