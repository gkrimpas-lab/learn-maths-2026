import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ ΚΑΙ ΤΥΠΟΓΡΑΦΙΑΣ --- //

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

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Πρόσθεση και Αφαίρεση: Αντίστροφες Πράξεις - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πώς συνδέονται η πρόσθεση με την αφαίρεση, τους όρους των πράξεων και πώς κάνουμε δοκιμή με διαδραστικό εργαστήριο.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/3-prosthesi-afairesi-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πρόσθεση και Αφαίρεση: Αντίστροφες Πράξεις",
    heroDesc: "Μαθαίνουμε πώς συνδέονται η πρόσθεση με την αφαίρεση και πώς χρησιμοποιούμε τη μία πράξη για να ελέγξουμε την άλλη!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στις αντίστροφες πράξεις για να σιγουρευτείς ότι τα έμαθες όλα!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Αναλυτική Θεωρία και Ορισμοί",
    cardInvTitle: "Τι σημαίνει «Αντίστροφες Πράξεις»;",
    cardInvDesc: "Η πρόσθεση και η αφαίρεση είναι αντίστροφες πράξεις επειδή η μία ακυρώνει το αποτέλεσμα της άλλης:",
    cardInvExamplePrefix: "Αν ξεκινήσουμε από έναν αριθμό, προσθέσουμε",
    cardInvExampleMid: "και έπειτα αφαιρέσουμε",
    cardInvExampleSuffix: "επιστρέφουμε στον αρχικό μας αριθμό!",
    cardTermsTitle: "Οι Όροι των Πράξεων",
    termAddend: "Προσθετέος",
    termSum: "Άθροισμα",
    termMinuend: "Μειωτέος",
    termSubtrahend: "Αφαιρετέος",
    termDiff: "Διαφορά",
    checkTitle: "Πώς κάνουμε Δοκιμή στις Πράξεις;",
    checkAddTitle: "1. Δοκιμή Πρόσθεσης (με Αφαίρεση)",
    checkAddDesc: "Για να ελέγξουμε αν μια πρόσθεση είναι σωστή, αφαιρούμε έναν προσθετέο από το άθροισμα:",
    checkAddOther: "Άλλος Προσθετέος",
    checkSubTitle: "2. Δοκιμή Αφαίρεσης (με Πρόσθεση)",
    checkSubDesc: "Για να ελέγξουμε αν μια αφαίρεση είναι σωστή, προσθέτουμε τη διαφορά στον αφαιρετέο:",
    // Section 2
    sec2Title: "Διαδραστικό Εργαστήριο Αντίστροφων Πράξεων",
    sec2Desc: "Άλλαξε τους αριθμούς και παρατήρησε πώς η πρόσθεση μετατρέπεται άμεσα στις δύο αντίστροφες αφαιρέσεις!",
    randomBtn: "Τυχαίοι Αριθμοί",
    sliderALabel: "1ος ΑΡΙΘΜΟΣ (α)",
    sliderBLabel: "2ος ΑΡΙΘΜΟΣ (β)",
    btnDecreaseA: "Μείωση 1ου αριθμού",
    btnIncreaseA: "Αύξηση 1ου αριθμού",
    btnDecreaseB: "Μείωση 2ου αριθμού",
    btnIncreaseB: "Αύξηση 2ου αριθμού",
    // SVG Labels
    svgWhole: "ΤΟ ΟΛΟΝ (ΑΘΡΟΙΣΜΑ)",
    svgPartA: "ΜΕΡΟΣ (α)",
    svgPartB: "ΜΕΡΟΣ (β)",
    svgNote: "Όλον ＝ Μέρος (α) ＋ Μέρος (β) ➔ Μέρος (α) ＝ Όλον － Μέρος (β)",
    // Cards
    card1Badge: "1. ΑΡΧΙΚΗ ΠΡΟΣΘΕΣΗ",
    card1Desc: "Προσθέσαμε τους δύο αριθμούς",
    card2Badge: "2. ΑΝΤΙΣΤΡΟΦΗ (1)",
    card2Desc: "Αφαιρέσαμε τον 2ο αριθμό και βρήκαμε τον 1ο!",
    card3Badge: "3. ΑΝΤΙΣΤΡΟΦΗ (2)",
    card3Desc: "Αφαιρέσαμε τον 1ο αριθμό και βρήκαμε τον 2ο!",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Κατάλαβες πώς η πρόσθεση και η αφαίρεση είναι αντίστροφες πράξεις; Κάνε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔",
  },
  en: {
    metaTitle: "Addition and Subtraction: Inverse Operations - Theory | LearnMaths.gr",
    metaDesc: "Learn how addition and subtraction are related, operation terms, and how to verify calculations using an interactive lab.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/3-prosthesi-afairesi-ask",
    badge: "4TH GRADE",
    heroTitle: "Addition and Subtraction: Inverse Operations",
    heroDesc: "Learn how addition and subtraction connect and how we use one operation to check the other!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the inverse operations exercises to ensure you've mastered every concept!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "Detailed Theory and Definitions",
    cardInvTitle: "What are \"Inverse Operations\"?",
    cardInvDesc: "Addition and subtraction are inverse operations because one undoes the effect of the other:",
    cardInvExamplePrefix: "If we start from any number, add",
    cardInvExampleMid: "and then subtract",
    cardInvExampleSuffix: "we return to our initial number!",
    cardTermsTitle: "Terms of the Operations",
    termAddend: "Addend",
    termSum: "Sum",
    termMinuend: "Minuend",
    termSubtrahend: "Subtrahend",
    termDiff: "Difference",
    checkTitle: "How to Check Our Calculations?",
    checkAddTitle: "1. Checking Addition (via Subtraction)",
    checkAddDesc: "To check whether an addition is correct, subtract one addend from the sum:",
    checkAddOther: "Other Addend",
    checkSubTitle: "2. Checking Subtraction (via Addition)",
    checkSubDesc: "To check whether a subtraction is correct, add the difference to the subtrahend:",
    // Section 2
    sec2Title: "Interactive Inverse Operations Lab",
    sec2Desc: "Change the numbers and observe how addition converts directly into the two inverse subtractions!",
    randomBtn: "Random Numbers",
    sliderALabel: "1ST NUMBER (a)",
    sliderBLabel: "2ND NUMBER (b)",
    btnDecreaseA: "Decrease 1st number",
    btnIncreaseA: "Increase 1st number",
    btnDecreaseB: "Decrease 2nd number",
    btnIncreaseB: "Increase 2nd number",
    // SVG Labels
    svgWhole: "THE WHOLE (SUM)",
    svgPartA: "PART (a)",
    svgPartB: "PART (b)",
    svgNote: "Whole ＝ Part (a) ＋ Part (b) ➔ Part (a) ＝ Whole － Part (b)",
    // Cards
    card1Badge: "1. INITIAL ADDITION",
    card1Desc: "We added the two numbers together",
    card2Badge: "2. INVERSE (1)",
    card2Desc: "We subtracted the 2nd number and found the 1st!",
    card3Badge: "3. INVERSE (2)",
    card3Desc: "We subtracted the 1st number and found the 2nd!",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Understood how addition and subtraction are inverse operations? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔",
  },
};

export default function ProsthesiAfairesiTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [numA, setNumA] = useState(12450);
  const [numB, setNumB] = useState(3200);

  const sum = numA + numB;

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const a = getRandomInt(1000, 14000);
    const b = getRandomInt(500, 5000);
    setNumA(a);
    setNumB(b);
  };

  const updateValA = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumA((prev) => Math.max(1000, Math.min(15000, prev + delta)));
  };

  const updateValB = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumB((prev) => Math.max(100, Math.min(5000, prev + delta)));
  };

  // Υπολογισμός ποσοστιαίου πλάτους για το δυναμικό SVG Part-Part-Whole
  const pctA = Math.max(15, Math.min(85, Math.round((numA / sum) * 100)));
  const widthA = Math.round((460 * pctA) / 100);
  const widthB = 460 - widthA;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl={t.backUrl}
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href={t.exercisesUrl}
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
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                ➕➖ {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-blue-100">
                {t.promoReadyDesc}
              </p>
              <Link
                href={t.exercisesUrl}
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.promoReadyBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Αντίστροφες Πράξεις */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔄</span> {t.cardInvTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.cardInvDesc}
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium w-full">
                <span>
                  {t.cardInvExamplePrefix}{' '}
                  <strong className="text-blue-600 font-bold">5</strong>{' '}
                  {t.cardInvExampleMid}{' '}
                  <strong className="text-rose-600 font-bold">5</strong>,{' '}
                  {t.cardInvExampleSuffix}
                </span>
              </div>
            </div>

            {/* Ορολογία */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>🏷️</span> {t.cardTermsTitle}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-emerald-200 w-full text-slate-900 font-bold">
                  <span className="text-blue-600">{t.termAddend}</span>
                  <span>＋</span>
                  <span className="text-blue-600">{t.termAddend}</span>
                  <span>＝</span>
                  <span className="text-emerald-700 font-black">{t.termSum}</span>
                </div>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-emerald-200 w-full text-slate-900 font-bold">
                  <span className="text-purple-600">{t.termMinuend}</span>
                  <span>－</span>
                  <span className="text-rose-600">{t.termSubtrahend}</span>
                  <span>＝</span>
                  <span className="text-amber-700 font-black">{t.termDiff}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΔΟΚΙΜΗ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΑΦΑΙΡΕΣΗΣ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              ✅ {t.checkTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-blue-700 border-b pb-1">
                  {t.checkAddTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.checkAddDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>{t.termSum}</span>
                  <span>－</span>
                  <span>{t.termAddend}</span>
                  <span>＝</span>
                  <span className="text-blue-700 font-black">{t.checkAddOther}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-purple-700 border-b pb-1">
                  {t.checkSubTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.checkSubDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>{t.termDiff}</span>
                  <span>＋</span>
                  <span>{t.termSubtrahend}</span>
                  <span>＝</span>
                  <span className="text-purple-700 font-black">{t.termMinuend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.sec2Title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.sec2Desc}
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-2 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomBtn}
            </button>
          </div>

          {/* TOUCH SLIDERS ΧΕΙΡΙΣΜΟΥ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Slider Αριθμού α */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black text-slate-500">{t.sliderALabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                  {formatNumberLocale(numA, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValA(e, -100)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-100"
                  aria-label={t.btnDecreaseA}
                >
                  －
                </button>

                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="50"
                  value={numA}
                  onChange={(e) => setNumA(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValA(e, 100)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+100"
                  aria-label={t.btnIncreaseA}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Slider Αριθμού β */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black text-slate-500">{t.sliderBLabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumberLocale(numB, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValB(e, -50)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-50"
                  aria-label={t.btnDecreaseB}
                >
                  －
                </button>

                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={numB}
                  onChange={(e) => setNumB(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValB(e, 50)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+50"
                  aria-label={t.btnIncreaseB}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* RESPONSIVE SVG: ΟΠΤΙΚΟΠΟΙΗΣΗ «ΜΕΡΟΣ - ΜΕΡΟΣ - ΟΛΟΝ» */}
          <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
            <svg
              viewBox="0 0 500 135"
              className="w-full h-auto max-w-xl mx-auto block select-none font-sans"
            >
              {/* Επάνω Μπάρα: Το Όλον (Άθροισμα) */}
              <rect x="20" y="15" width="460" height="42" rx="10" fill="#10b981" />
              <text
                x="250"
                y="35"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                {t.svgWhole}
              </text>
              <text
                x="250"
                y="50"
                fill="#ffffff"
                fontSize="14"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumberLocale(sum, currentLocale)}
              </text>

              {/* Κάτω Μπάρες: Μέρος α + Μέρος β */}
              {/* Μέρος α */}
              <rect x="20" y="70" width={widthA} height="42" rx="10" fill="#3b82f6" />
              <text
                x={20 + widthA / 2}
                y="90"
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                {t.svgPartA}
              </text>
              <text
                x={20 + widthA / 2}
                y="105"
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumberLocale(numA, currentLocale)}
              </text>

              {/* Μέρος β */}
              <rect x={20 + widthA + 2} y="70" width={Math.max(10, widthB - 2)} height="42" rx="10" fill="#6366f1" />
              <text
                x={20 + widthA + widthB / 2}
                y="90"
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                {t.svgPartB}
              </text>
              <text
                x={20 + widthA + widthB / 2}
                y="105"
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumberLocale(numB, currentLocale)}
              </text>

              {/* Υποσημείωση */}
              <text
                x="250"
                y="128"
                fill="#94a3b8"
                fontSize="9.5"
                fontWeight="600"
                textAnchor="middle"
              >
                {t.svgNote}
              </text>
            </svg>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΝΤΙΣΤΡΟΦΩΝ ΠΡΑΞΕΩΝ ΣΕ ΚΑΡΤΕΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Κάρτα 1: Πρόσθεση */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-2xl border border-blue-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {t.card1Badge}
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-blue-600">{formatNumberLocale(numA, currentLocale)}</span>
                {' ＋ '}
                <span className="text-indigo-600">{formatNumberLocale(numB, currentLocale)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 border-t pt-2 border-blue-200/80">
                ＝ {formatNumberLocale(sum, currentLocale)}
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.card1Desc}</p>
            </div>

            {/* Κάρτα 2: 1η Αντίστροφη Αφαίρεση */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 sm:p-6 rounded-2xl border border-purple-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-purple-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {t.card2Badge}
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-emerald-600">{formatNumberLocale(sum, currentLocale)}</span>
                {' － '}
                <span className="text-indigo-600">{formatNumberLocale(numB, currentLocale)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-blue-600 border-t pt-2 border-purple-200/80">
                ＝ {formatNumberLocale(numA, currentLocale)}
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.card2Desc}</p>
            </div>

            {/* Κάρτα 3: 2η Αντίστροφη Αφαίρεση */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6 rounded-2xl border border-emerald-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {t.card3Badge}
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-emerald-600">{formatNumberLocale(sum, currentLocale)}</span>
                {' － '}
                <span className="text-blue-600">{formatNumberLocale(numA, currentLocale)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-600 border-t pt-2 border-emerald-200/80">
                ＝ {formatNumberLocale(numB, currentLocale)}
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.card3Desc}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomPromoTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomPromoDesc}
            </p>
          </div>
          <Link
            href={t.exercisesUrl}
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomPromoBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}