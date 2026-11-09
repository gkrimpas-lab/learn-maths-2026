// pages/d-dimotikou/12-diairesi-deka-ekato-xilia.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Διαίρεση και Πολλαπλασιασμός με 10, 100, 1.000 - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τον κανόνα μετακίνησης της υποδιαστολής στον πολλαπλασιασμό (δεξιά) και στη διαίρεση (αριστερά) με 10, 100, 1.000 με διαδραστικό εργαστήριο.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "⚡ Διαίρεση και Πολλαπλασιασμός με 10, 100, 1.000",
    heroDesc: "Μαθαίνουμε τον χρυσό κανόνα της μετακίνησης της υποδιαστολής: αριστερά στη διαίρεση και δεξιά στον πολλαπλασιασμό!",
    readyPracticeTitle: "Έτοιμος για εξάσκηση;",
    readyPracticeDesc: "Δοκίμασε τις ασκήσεις στους νοερούς υπολογισμούς με 10, 100 και 1.000 για να σιγουρευτείς ότι τα έμαθες!",
    goToExercises: "🎯 Μετάβαση στις Ασκήσεις",
    ruleSectionTitle: "Ο Χρυσός Κανόνας της Υποδιαστολής",
    divisionCardTitle: "Διαίρεση ( : 10,  : 100,  : 1.000 )",
    divisionCardDesc: "Στη διαίρεση ο αριθμός μικραίνει, επομένως μετακινούμε την υποδιαστολή προς τα ΑΡΙΣΤΕΡΑ τόσες θέσεις όσα είναι τα μηδενικά:",
    div10Rule: "• : 10 ➔ 1 θέση αριστερά (π.χ. 45 : 10 ＝ 4,5)",
    div100Rule: "• : 100 ➔ 2 θέσεις αριστερά (π.χ. 45 : 100 ＝ 0,45)",
    div1000Rule: "• : 1.000 ➔ 3 θέσεις αριστερά (π.χ. 45 : 1.000 ＝ 0,045)",
    multiplicationCardTitle: "Πολλαπλασιασμός ( · 10,  · 100,  · 1.000 )",
    multiplicationCardDesc: "Στον πολλαπλασιασμό ο αριθμός μεγαλώνει, επομένως μετακινούμε την υποδιαστολή προς τα ΔΕΞΙΑ τόσες θέσεις όσα είναι τα μηδενικά:",
    mul10Rule: "• · 10 ➔ 1 θέση δεξιά (π.χ. 3,5 · 10 ＝ 35)",
    mul100Rule: "• · 100 ➔ 2 θέσεις δεξιά (π.χ. 3,5 · 100 ＝ 350)",
    mul1000Rule: "• · 1.000 ➔ 3 θέσεις δεξιά (π.χ. 3,5 · 1.000 ＝ 3.500)",
    integerTipTitle: "💡 Τι κανουμε οταν ο αριθμος ειναι ακεραιος;",
    integerTipDesc: "Στους ακέραιους αριθμούς (π.χ. 450), θεωρούμε ότι η υποδιαστολή βρίσκεται πάντοτε «κρυμμένη» στο τέλος τους (450,). Όταν διαιρούμε με το 10, το 100 ή το 1.000, η υποδιαστολή εμφανίζεται και μετακινείται προς τα αριστερά, ενώ αν λείπουν ψηφία συμπληρώνουμε με μηδενικά!",
    labSectionTitle: "Διαδραστικό Εργαστήριο Υποδιαστολής",
    labSectionDesc: "Πληκτρολόγησε έναν αριθμό (έως 10 ψηφία), επίλεξε πράξη και συντελεστή και δες ζωντανά τη μετακίνηση!",
    randomOperationBtn: "Τυχαία Πράξη",
    numberInputLabel: "ΑΡΙΘΜΟΣ",
    operationLabel: "ΠΡΑΞΗ",
    factorLabel: "ΜΕ ΠΟΣΟ;",
    decreaseAria: "Μείωση αριθμού",
    decreaseTitle: "Μείωση κατά 1",
    increaseAria: "Αύξηση αριθμού",
    increaseTitle: "Αύξηση κατά 1",
    inputPlaceholder: "π.χ. 450",
    divisionBtnText: ": (Διαίρεση)",
    multiplicationBtnText: "· (Πολλαπλ.)",
    operationDisplayTitle: "Η ΠΡΑΞΗ ΣΟΥ:",
    leftDirection: "αριστερά",
    rightDirection: "δεξιά",
    shiftPosOne: "θέση",
    shiftPosMany: "θέσεις",
    shiftExplanation: (positions, posWord, dir) =>
      `Η υποδιαστολή μετακινήθηκε ${positions} ${posWord} προς τα ${dir}!`,
    bottomBannerTitle: "Ώρα για Εξάσκηση!",
    bottomBannerDesc: "Έμαθες τη μετακίνηση της υποδιαστολής; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomBannerBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Division and Multiplication by 10, 100, 1,000 - Theory | LearnMaths.gr",
    metaDesc: "Learn the decimal point shift rule for multiplication (right) and division (left) by 10, 100, 1,000 with an interactive playground.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "⚡ Division and Multiplication by 10, 100, 1,000",
    heroDesc: "Master the golden rule of moving the decimal point: left for division and right for multiplication!",
    readyPracticeTitle: "Ready for practice?",
    readyPracticeDesc: "Try the mental math exercises with 10, 100, and 1,000 to test your understanding!",
    goToExercises: "🎯 Go to Exercises",
    ruleSectionTitle: "The Golden Rule of the Decimal Point",
    divisionCardTitle: "Division ( : 10,  : 100,  : 1,000 )",
    divisionCardDesc: "In division the number becomes smaller, so we move the decimal point to the LEFT as many places as there are zeros:",
    div10Rule: "• : 10 ➔ 1 place left (e.g. 45 : 10 ＝ 4.5)",
    div100Rule: "• : 100 ➔ 2 places left (e.g. 45 : 100 ＝ 0.45)",
    div1000Rule: "• : 1,000 ➔ 3 places left (e.g. 45 : 1,000 ＝ 0.045)",
    multiplicationCardTitle: "Multiplication ( · 10,  · 100,  · 1,000 )",
    multiplicationCardDesc: "In multiplication the number becomes larger, so we move the decimal point to the RIGHT as many places as there are zeros:",
    mul10Rule: "• · 10 ➔ 1 place right (e.g. 3.5 · 10 ＝ 35)",
    mul100Rule: "• · 100 ➔ 2 places right (e.g. 3.5 · 100 ＝ 350)",
    mul1000Rule: "• · 1,000 ➔ 3 places right (e.g. 3.5 · 1,000 ＝ 3,500)",
    integerTipTitle: "💡 What do we do when the number is an integer?",
    integerTipDesc: "In whole numbers (e.g. 450), the decimal point is understood to sit right at the end (450.). When dividing by 10, 100, or 1,000, the decimal point becomes visible and shifts left, filling in empty positions with zeros if needed!",
    labSectionTitle: "Interactive Decimal Shift Playground",
    labSectionDesc: "Enter a number (up to 10 digits), select an operation and factor, and watch the decimal point shift in real time!",
    randomOperationBtn: "Random Operation",
    numberInputLabel: "NUMBER",
    operationLabel: "OPERATION",
    factorLabel: "BY HOW MUCH?",
    decreaseAria: "Decrease number",
    decreaseTitle: "Decrease by 1",
    increaseAria: "Increase number",
    increaseTitle: "Increase by 1",
    inputPlaceholder: "e.g. 450",
    divisionBtnText: ": (Division)",
    multiplicationBtnText: "· (Multipl.)",
    operationDisplayTitle: "YOUR OPERATION:",
    leftDirection: "left",
    rightDirection: "right",
    shiftPosOne: "place",
    shiftPosMany: "places",
    shiftExplanation: (positions, posWord, dir) =>
      `The decimal point moved ${positions} ${posWord} to the ${dir}!`,
    bottomBannerTitle: "Time for Practice!",
    bottomBannerDesc: "Did you master moving the decimal point? Try the interactive exercises!",
    bottomBannerBtn: "Start Exercises ➔"
  }
};

export default function Diairesi101001000TheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [numInput, setNumInput] = useState('450');
  const [operation, setModeOperation] = useState('div'); // 'div' (:) ή 'mul' (·)
  const [factor, setFactor] = useState(10); // 10, 100, 1000

  // Χειρισμός εισαγωγής με περιορισμό έως 10 ψηφία
  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (isEn) {
      const sanitized = raw.replace(/[^0-9.]/g, '');
      const digitsOnly = sanitized.replace(/[^0-9]/g, '');
      if (digitsOnly.length <= 10) {
        setNumInput(sanitized);
      }
    } else {
      const sanitized = raw.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const digitsOnly = sanitized.replace(/[^0-9]/g, '');
      if (digitsOnly.length <= 10) {
        setNumInput(sanitized);
      }
    }
  };

  const numericVal = isEn
    ? parseFloat(numInput.replace(/,/g, '')) || 0
    : parseFloat(numInput.replace(/\./g, '').replace(',', '.')) || 0;

  // Υπολογισμός αποτελέσματος
  let result = 0;
  if (operation === 'div') {
    result = numericVal / factor;
  } else {
    result = numericVal * factor;
  }

  // Αριθμός θέσεων μετακίνησης υποδιαστολής
  const shiftPositions = factor === 10 ? 1 : factor === 100 ? 2 : 3;
  const direction = operation === 'div' ? t.leftDirection : t.rightDirection;
  const posWord = shiftPositions === 1 ? t.shiftPosOne : t.shiftPosMany;
  const arrowEmoji = operation === 'div' ? '⬅️' : '➡️';

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isDecimal = Math.random() > 0.5;
    let randVal;
    if (isDecimal) {
      randVal = (Math.random() * 450 + 1).toFixed(getRandomInt(1, 2));
    } else {
      randVal = (getRandomInt(1, 95) * (Math.random() > 0.5 ? 100 : 10)).toString();
    }
    const factors = [10, 100, 1000];
    setNumInput(isEn ? randVal : randVal.replace('.', ','));
    setFactor(factors[getRandomInt(0, 2)]);
    setModeOperation(Math.random() > 0.5 ? 'div' : 'mul');
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = isEn
      ? parseFloat(numInput.replace(/,/g, '')) || 0
      : parseFloat(numInput.replace(/\./g, '').replace(',', '.')) || 0;
    const nextVal = Math.max(0.1, current + delta);
    const formatted = Number(nextVal.toFixed(2)).toString();
    setNumInput(isEn ? formatted : formatted.replace('.', ','));
  };

  // Μορφοποίηση εμφάνισης αποτελέσματος
  const formattedResult = Number(result.toFixed(4))
    .toLocaleString(isEn ? 'en-US' : 'el-GR', {
      maximumFractionDigits: 4
    });

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyPracticeTitle}</h3>
              <p className="text-xs text-blue-100">
                {t.readyPracticeDesc}
              </p>
              <Link
                href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.goToExercises}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.ruleSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. ΔΙΑΙΡΕΣΗ (: 10, : 100, : 1000) */}
            <div className="bg-rose-50/70 p-5 sm:p-6 rounded-2xl border border-rose-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-rose-900 flex items-center gap-2">
                <span>⬅️</span> {t.divisionCardTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.divisionCardDesc}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold text-slate-800">
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  {t.div10Rule}
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  {t.div100Rule}
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  {t.div1000Rule}
                </li>
              </ul>
            </div>

            {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (· 10, · 100, · 1000) */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>➡️</span> {t.multiplicationCardTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.multiplicationCardDesc}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold text-slate-800">
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  {t.mul10Rule}
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  {t.mul100Rule}
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  {t.mul1000Rule}
                </li>
              </ul>
            </div>
          </div>

          {/* ΣΥΝΤΟΜΟ TIP ΓΙΑ ΑΚΕΡΑΙΟΥΣ */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
            <span className="font-black uppercase text-amber-900 block">
              {toCleanUppercase(t.integerTipTitle)}
            </span>
            <p className="leading-relaxed">
              {t.integerTipDesc}
            </p>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labSectionTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.labSectionDesc}
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomOperationBtn}
            </button>
          </div>

          {/* INPUTS / ΕΠΙΛΟΓΕΣ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* 1. Αριθμός */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.numberInputLabel)}
                </span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {numInput}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => handleDelta(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.decreaseTitle}
                  aria-label={t.decreaseAria}
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  id="calc-num-input"
                  name="calc-num-input"
                  value={numInput}
                  onChange={handleInputChange}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder={t.inputPlaceholder}
                />

                <button
                  onClick={(e) => handleDelta(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.increaseTitle}
                  aria-label={t.increaseAria}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* 2. Πράξη */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.operationLabel)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 h-11 items-center">
                <button
                  type="button"
                  onClick={() => setModeOperation('div')}
                  className={`h-11 rounded-xl font-mono font-black text-xs sm:text-sm transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                    operation === 'div'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.divisionBtnText}
                </button>
                <button
                  type="button"
                  onClick={() => setModeOperation('mul')}
                  className={`h-11 rounded-xl font-mono font-black text-xs sm:text-sm transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                    operation === 'mul'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.multiplicationBtnText}
                </button>
              </div>
            </div>

            {/* 3. Παράγοντας (10, 100, 1.000) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.factorLabel)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 h-11 items-center">
                {[10, 100, 1000].map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFactor(f)}
                    className={`h-11 rounded-xl font-mono font-black text-xs sm:text-sm transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                      factor === f
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatNumberByLocale(f, isEn)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΟΣ & ΕΠΕΞΗΓΗΣΗ */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-center space-y-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              {toCleanUppercase(t.operationDisplayTitle)}
            </span>

            <div className="font-mono font-black text-2xl sm:text-4xl lg:text-5xl text-amber-400 py-1 break-words">
              <span>{numInput}</span>
              <span className="text-slate-400 mx-2">{operation === 'div' ? ' : ' : ' · '}</span>
              <span>{formatNumberByLocale(factor, isEn)}</span>
              <span className="text-slate-400 mx-2"> ＝ </span>
              <span className="text-emerald-400">{formattedResult}</span>
            </div>

            {/* Επεξήγηση Μετακίνησης */}
            <div className="inline-flex items-center gap-2 bg-slate-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 shadow-inner">
              <span className="text-lg">{arrowEmoji}</span>
              <span>
                {isEn ? (
                  <>
                    The decimal point moved <strong className="text-indigo-400 font-black">{shiftPositions} {posWord}</strong> to the <strong className="text-amber-300 font-black">{direction}</strong>!
                  </>
                ) : (
                  <>
                    Η υποδιαστολή μετακινήθηκε <strong className="text-indigo-400 font-black">{shiftPositions} {posWord}</strong> προς τα <strong className="text-amber-300 font-black">{direction}</strong>!
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomBannerTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomBannerDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomBannerBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}