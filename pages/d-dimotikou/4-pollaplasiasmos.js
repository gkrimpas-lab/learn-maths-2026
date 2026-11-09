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
    metaTitle: "Πολλαπλασιασμός με Διψήφιο Αριθμό - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τον κάθετο πολλαπλασιασμό με διψήφιο αριθμό, τα μερικά γινόμενα και τον ρόλο του μηδενικού βήμα προς βήμα.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/4-pollaplasiasmos-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πολλαπλασιασμός με Διψήφιο Αριθμό",
    heroDesc: "Μαθαίνουμε να πολλαπλασιάζουμε κάθετα δύο διψήφιους αριθμούς εύκολα, βήμα προς βήμα, χρησιμοποιώντας τα μερικά γινόμενα!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στον κάθετο πολλαπλασιασμό για να σιγουρευτείς ότι τον κατέκτησες!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Πώς κάνουμε Κάθετο Πολλαπλασιασμό;",
    step1Title: "Μονάδες",
    step1Desc: "Πολλαπλασιάζουμε τον πάνω αριθμό με τις Μονάδες του κάτω αριθμού και γράφουμε το 1ο μερικό γινόμενο.",
    step2Title: "Το «0» της Δεκάδας",
    step2Desc: "Στην επόμενη γραμμή τοποθετούμε ένα μηδενικό (0) στη θέση των μονάδων, γιατί περνάμε στον πολλαπλασιασμό των Δεκάδων!",
    step3Title: "Δεκάδες",
    step3Desc: "Πολλαπλασιάζουμε τον πάνω αριθμό με το ψηφίο των Δεκάδων του κάτω αριθμού και συμπληρώνουμε τη γραμμή.",
    step4Title: "Πρόσθεση",
    step4Desc: "Προσθέτουμε κάθετα τα δύο μερικά γινόμενα για να υπολογίσουμε το τελικό γινόμενο.",
    termsTitle: "Ορολογία Πολλαπλασιασμού:",
    multiplicandLabel: "Πολλαπλασιαστέος",
    multiplierLabel: "Πολλαπλασιαστής",
    productLabel: "Γινόμενο",
    termsFootnote: "* Οι αριθμοί που πολλαπλασιάζονται ονομάζονται επίσης «παράγοντες του γινομένου».",
    // Section 2
    sec2Title: "Διαδραστικός Κάθετος Πολλαπλασιαστής",
    sec2Desc: "Άλλαξε τους παράγοντες με τα χειριστήρια και δες την κάθετη επίλυση να αναλύεται σε πραγματικό χρόνο!",
    randomBtn: "Τυχαίοι Αριθμοί",
    sliderALabel: "1ος ΑΡΙΘΜΟΣ (ΠΑΝΩ)",
    sliderBLabel: "2ος ΑΡΙΘΜΟΣ (ΚΑΤΩ)",
    btnDecreaseA: "Μείωση 1ου αριθμού",
    btnIncreaseA: "Αύξηση 1ου αριθμού",
    btnDecreaseB: "Μείωση 2ου αριθμού",
    btnIncreaseB: "Αύξηση 2ου αριθμού",
    explTitle: "Πώς προέκυψε το αποτέλεσμα;",
    explStep1Badge: "ΒΗΜΑ 1: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΙΣ ΜΟΝΑΔΕΣ ({units})",
    explStep1Desc: "Υπολογίζουμε το 1ο μερικό γινόμενο πολλαπλασιάζοντας τον πάνω αριθμό με τις μονάδες του κάτω.",
    explStep2Badge: "ΒΗΜΑ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΙΣ ΔΕΚΑΔΕΣ ({tens}0)",
    explStep2Desc: "Βάζουμε το 0 στις μονάδες και πολλαπλασιάζουμε με τις δεκάδες, σχηματίζοντας το 2ο μερικό γινόμενο.",
    explStep3Badge: "ΒΗΜΑ 3: ΤΕΛΙΚΟ ΑΘΡΟΙΣΜΑ ΜΕΡΙΚΩΝ ΓΙΝΟΜΕΝΩΝ",
    explStep3Desc: "Προσθέτουμε τα δύο μερικά γινόμενα για να βρούμε το τελικό αποτέλεσμα.",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Έμαθες πώς γίνεται ο κάθετος πολλαπλασιασμός με διψήφιο; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Multiplication by Two-Digit Number - Theory | LearnMaths.gr",
    metaDesc: "Learn vertical long multiplication by two-digit numbers, partial products, and the role of the placeholder zero step by step.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/4-pollaplasiasmos-ask",
    badge: "4TH GRADE",
    heroTitle: "Multiplication by Two-Digit Number",
    heroDesc: "Learn how to vertically multiply two two-digit numbers easily, step by step, using partial products!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the vertical long multiplication exercises to ensure you've mastered every step!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "How to Perform Long Multiplication?",
    step1Title: "Units (Ones)",
    step1Desc: "Multiply the top number by the ones digit of the bottom number and write the 1st partial product.",
    step2Title: "The Tens \"0\"",
    step2Desc: "On the next row, place a zero (0) in the ones position, since we are now multiplying by the tens digit!",
    step3Title: "Tens",
    step3Desc: "Multiply the top number by the tens digit of the bottom number and complete the second row.",
    step4Title: "Addition",
    step4Desc: "Add the two partial products vertically to calculate the final product.",
    termsTitle: "Multiplication Terminology:",
    multiplicandLabel: "Multiplicand",
    multiplierLabel: "Multiplier",
    productLabel: "Product",
    termsFootnote: "* The numbers being multiplied together are also called \"factors of the product\".",
    // Section 2
    sec2Title: "Interactive Long Multiplication Visualizer",
    sec2Desc: "Adjust factors with live sliders and watch the column layout break down each partial product in real time!",
    randomBtn: "Random Numbers",
    sliderALabel: "1ST NUMBER (TOP)",
    sliderBLabel: "2ND NUMBER (BOTTOM)",
    btnDecreaseA: "Decrease 1st number",
    btnIncreaseA: "Increase 1st number",
    btnDecreaseB: "Decrease 2nd number",
    btnIncreaseB: "Increase 2nd number",
    explTitle: "How is the product calculated?",
    explStep1Badge: "STEP 1: MULTIPLYING BY ONES ({units})",
    explStep1Desc: "We calculate the 1st partial product by multiplying the top number by the ones digit of the bottom number.",
    explStep2Badge: "STEP 2: MULTIPLYING BY TENS ({tens}0)",
    explStep2Desc: "We place a placeholder 0 in the ones place and multiply by tens, forming the 2nd partial product.",
    explStep3Badge: "STEP 3: ADDING PARTIAL PRODUCTS",
    explStep3Desc: "We add the two partial products vertically to find the final total product.",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Mastered vertical multiplication by two-digit numbers? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔"
  }
};

export default function PollaplasiasmosTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [numA, setNumA] = useState(43);
  const [numB, setNumB] = useState(25);

  const unitsB = numB % 10;
  const tensB = Math.floor(numB / 10);

  const partial1 = numA * unitsB;
  const partial2 = numA * (tensB * 10);
  const total = numA * numB;

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNumA(getRandomInt(12, 98));
    setNumB(getRandomInt(12, 45));
  };

  const updateValA = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumA((prev) => Math.max(11, Math.min(99, prev + delta)));
  };

  const updateValB = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumB((prev) => Math.max(11, Math.min(99, prev + delta)));
  };

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
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                · {t.heroTitle}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-emerald-100">
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

          {/* ΒΗΜΑΤΑ ΣΕ 4 ΚΑΡΤΕΣ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 space-y-2">
              <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-sm shadow-sm">
                1
              </span>
              <h3 className="font-extrabold text-emerald-950 text-base">{t.step1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 space-y-2">
              <span className="w-8 h-8 bg-amber-500 text-white rounded-xl font-black flex items-center justify-center text-sm shadow-sm">
                2
              </span>
              <h3 className="font-extrabold text-amber-950 text-base">{t.step2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-2">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center text-sm shadow-sm">
                3
              </span>
              <h3 className="font-extrabold text-indigo-950 text-base">{t.step3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 space-y-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-xl font-black flex items-center justify-center text-sm shadow-sm">
                4
              </span>
              <h3 className="font-extrabold text-purple-950 text-base">{t.step4Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
          </div>

          {/* ΟΡΟΛΟΓΙΑ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              🏷️ {t.termsTitle}
            </h3>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 leading-relaxed break-words px-3.5 py-3 bg-white rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 w-full shadow-sm">
              <span className="text-emerald-700 font-black">
                {formatNumberLocale(43, currentLocale)} ({t.multiplicandLabel})
              </span>
              <span>·</span>
              <span className="text-indigo-700 font-black">
                {formatNumberLocale(25, currentLocale)} ({t.multiplierLabel})
              </span>
              <span>＝</span>
              <span className="text-purple-700 font-black text-sm sm:text-base">
                {formatNumberLocale(1075, currentLocale)} ({t.productLabel})
              </span>
            </div>
            <p className="text-xs text-slate-500 italic text-center sm:text-left">
              {t.termsFootnote}
            </p>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-2 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomBtn}
            </button>
          </div>

          {/* TOUCH SLIDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Slider 1ου Αριθμού */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black text-slate-500">{t.sliderALabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                  {formatNumberLocale(numA, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValA(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-1"
                  aria-label={t.btnDecreaseA}
                >
                  －
                </button>

                <input
                  type="range"
                  min="11"
                  max="99"
                  value={numA}
                  onChange={(e) => setNumA(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValA(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+1"
                  aria-label={t.btnIncreaseA}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Slider 2ου Αριθμού */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black text-slate-500">{t.sliderBLabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumberLocale(numB, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValB(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-1"
                  aria-label={t.btnDecreaseB}
                >
                  －
                </button>

                <input
                  type="range"
                  min="11"
                  max="99"
                  value={numB}
                  onChange={(e) => setNumB(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValB(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+1"
                  aria-label={t.btnIncreaseB}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* DISPLAY ΚΑΘΕΤΗΣ ΜΟΡΦΗΣ (RESPONSIVE SVG) & ΕΞΗΓΗΣΗΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* ΚΑΘΕΤΗ ΔΙΑΤΑΞΗ ΣΕ RESPONSIVE SVG */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-center">
              <svg
                viewBox="0 0 360 250"
                className="w-full h-auto max-w-[320px] select-none font-mono"
              >
                {/* 1ος Αριθμός (Πάνω) */}
                <text x="240" y="45" fill="#34d399" fontSize="28" fontWeight="800" textAnchor="end">
                  {formatNumberLocale(numA, currentLocale)}
                </text>

                {/* Σύμβολο Πολλαπλασιασμού & 2ος Αριθμός */}
                <text x="130" y="85" fill="#94a3b8" fontSize="22" fontWeight="700">
                  ·
                </text>
                <text x="240" y="85" fill="#818cf8" fontSize="28" fontWeight="800" textAnchor="end">
                  {formatNumberLocale(numB, currentLocale)}
                </text>

                {/* 1η Οριζόντια Γραμμή */}
                <line x1="80" y1="98" x2="250" y2="98" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

                {/* 1ο Μερικό Γινόμενο (Μονάδες) */}
                <text x="240" y="132" fill="#fbbf24" fontSize="24" fontWeight="800" textAnchor="end">
                  {formatNumberLocale(partial1, currentLocale)}
                </text>
                <text x="260" y="130" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                  ({numA} · {unitsB})
                </text>

                {/* 2ο Μερικό Γινόμενο (Δεκάδες με το 0) */}
                <text x="65" y="170" fill="#2dd4bf" fontSize="20" fontWeight="700">
                  ＋
                </text>
                <text x="240" y="170" fill="#2dd4bf" fontSize="24" fontWeight="800" textAnchor="end">
                  {formatNumberLocale(partial2, currentLocale)}
                </text>
                <text x="260" y="168" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                  ({numA} · {tensB}0)
                </text>

                {/* 2η Οριζόντια Γραμμή Αθροίσματος */}
                <line x1="55" y1="184" x2="250" y2="184" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

                {/* Τελικό Γινόμενο */}
                <text x="240" y="224" fill="#c084fc" fontSize="30" fontWeight="900" textAnchor="end">
                  {formatNumberLocale(total, currentLocale)}
                </text>
              </svg>
            </div>

            {/* ΑΝΑΛΥΤΙΚΗ ΕΞΗΓΗΣΗ ΒΗΜΑ-ΒΗΜΑ */}
            <div className="space-y-3.5">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <span>💡</span> {t.explTitle}
              </h3>

              <div className="p-3.5 sm:p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-1.5">
                <span className="text-xs font-black text-amber-900 uppercase">
                  {t.explStep1Badge.replace('{units}', unitsB)}
                </span>
                <div className="inline-flex flex-wrap items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-900 w-full">
                  <span>{numA} · {unitsB}</span>
                  <span>＝</span>
                  <span className="text-amber-700 font-black">{formatNumberLocale(partial1, currentLocale)}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {t.explStep1Desc}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-teal-50/80 rounded-2xl border border-teal-200/90 space-y-1.5">
                <span className="text-xs font-black text-teal-900 uppercase">
                  {t.explStep2Badge.replace('{tens}', tensB)}
                </span>
                <div className="inline-flex flex-wrap items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-900 w-full">
                  <span>{numA} · {tensB * 10}</span>
                  <span>＝</span>
                  <span className="text-teal-700 font-black">{formatNumberLocale(partial2, currentLocale)}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {t.explStep2Desc}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-purple-50/80 rounded-2xl border border-purple-200/90 space-y-1.5">
                <span className="text-xs font-black text-purple-900 uppercase">
                  {t.explStep3Badge}
                </span>
                <div className="inline-flex flex-wrap items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-900 w-full">
                  <span>{formatNumberLocale(partial1, currentLocale)} ＋ {formatNumberLocale(partial2, currentLocale)}</span>
                  <span>＝</span>
                  <span className="text-purple-700 font-black text-sm sm:text-base">{formatNumberLocale(total, currentLocale)}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {t.explStep3Desc}
                </p>
              </div>
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