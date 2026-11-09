// pages/d-dimotikou/21-pollaplasiasmos-3-psifia.js
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

const translations = {
  el: {
    pageTitle: "Πολλαπλασιασμός 3ψήφιων Αριθμών - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε τον κάθετο πολλαπλασιασμό τριψήφιων αριθμών, τον υπολογισμό των μερικών γινομένων και την πρόσθεσή τους με διαδραστικό εργαστήριο.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "✖️ Πολλαπλασιασμός 3ψήφιων Αριθμών",
    heroDesc: "Μαθαίνουμε να εκτελούμε τον κάθετο πολλαπλασιασμό τριψήφιου αριθμού υπολογίζοντας διαδοχικά τα τρία μερικά γινόμενα!",
    promoCardTitle: "Έτοιμος για εξάσκηση;",
    promoCardDesc: "Δοκίμασε τις ασκήσεις στον πολλαπλασιασμό τριψήφιων για να σιγουρευτείς ότι κατέκτησες τον αλγόριθμο!",
    promoCardBtn: "🎯 Μετάβαση στις Ασκήσεις",
    theoryTitle: "Πώς Εκτελούμε τον Κάθετο Πολλαπλασιασμό 3ψηφίων",
    step1Badge: "ΒΗΜΑ 1ο",
    step1Title: "1ο Μερικό Γινόμενο (Μονάδες)",
    step1Desc: "Πολλαπλασιάζουμε τον πάνω αριθμό με τις Μονάδες του κάτω αριθμού. Το αποτέλεσμα γράφεται κανονικά στην 1η γραμμή.",
    step2Badge: "ΒΗΜΑ 2ο",
    step2Title: "2ο Μερικό Γινόμενο (Δεκάδες)",
    step2Desc: "Σημειώνουμε ένα μηδενικό (0) στη θέση των μονάδων (ή αφήνουμε 1 κενό) και πολλαπλασιάζουμε με τις Δεκάδες.",
    step3Badge: "ΒΗΜΑ 3ο",
    step3Title: "3ο Μερικό Γινόμενο (Εκατοντάδες)",
    step3Desc: "Σημειώνουμε δύο μηδενικά (00) (ή αφήνουμε 2 κενά) και πολλαπλασιάζουμε με τις Εκατοντάδες. Στο τέλος, προσθέτουμε τα τρία μερικά γινόμενα!",
    interactiveTitle: "Διαδραστική Αναπαράσταση Κάθετου Πολλαπλασιασμού",
    interactiveDesc: "Άλλαξε τους αριθμούς για να παρατηρήσεις πώς υπολογίζονται βήμα-βήμα τα μερικά γινόμενα και το τελικό αποτέλεσμα!",
    controlsTitle: "⚙️ Επίλεξε Αριθμούς Πολλαπλασιασμού:",
    labelNumA: "1ος ΑΡΙΘΜΟΣ (100-999)",
    labelNumB: "2ος ΑΡΙΘΜΟΣ (10-999)",
    decrease1Aria: "Μείωση κατά 1",
    increase1Aria: "Αύξηση κατά 1",
    partialProductsTitle: "💡 Αναλυτικά Μερικά Γινόμενα:",
    partial1Label: "1ο Μερικό (Μονάδες):",
    partial2Label: "2ο Μερικό (Δεκάδες):",
    partial3Label: "3ο Μερικό (Εκατοντάδες):",
    ctaTitle: "📝 Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να εκτελείς τον πολλαπλασιασμό τριψήφιων αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις ➔",
    footerPrompt: "Ολοκλήρωσες τη θεωρία;",
    footerBtn: "Μετάβαση στις Ασκήσεις 🎯"
  },
  en: {
    pageTitle: "Multiplication of 3-Digit Numbers - Theory | LearnMaths.gr",
    pageDesc: "Learn column multiplication of three-digit numbers, calculate partial products, and add them up in an interactive math lab.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "✖️ Multiplication of 3-Digit Numbers",
    heroDesc: "Learn how to perform column multiplication of 3-digit numbers by calculating the three partial products step by step!",
    promoCardTitle: "Ready for practice?",
    promoCardDesc: "Try the 3-digit multiplication exercises to ensure you've mastered the standard algorithm!",
    promoCardBtn: "🎯 Go to Exercises",
    theoryTitle: "How to Perform 3-Digit Column Multiplication",
    step1Badge: "STEP 1",
    step1Title: "1st Partial Product (Units)",
    step1Desc: "Multiply the top number by the Units digit of the bottom number. Write the result on the first row.",
    step2Badge: "STEP 2",
    step2Title: "2nd Partial Product (Tens)",
    step2Desc: "Write a zero (0) in the units place (or shift one space left) and multiply by the Tens digit.",
    step3Badge: "STEP 3",
    step3Title: "3rd Partial Product (Hundreds)",
    step3Desc: "Write two zeros (00) (or shift two spaces left) and multiply by the Hundreds digit. Finally, add all three partial products!",
    interactiveTitle: "Interactive Column Multiplication Visualizer",
    interactiveDesc: "Change the numbers to observe step by step how partial products are calculated and summed up!",
    controlsTitle: "⚙️ Choose Numbers to Multiply:",
    labelNumA: "1st NUMBER (100-999)",
    labelNumB: "2nd NUMBER (10-999)",
    decrease1Aria: "Decrease by 1",
    increase1Aria: "Increase by 1",
    partialProductsTitle: "💡 Partial Products Breakdown:",
    partial1Label: "1st Partial (Units):",
    partial2Label: "2nd Partial (Tens):",
    partial3Label: "3rd Partial (Hundreds):",
    ctaTitle: "📝 Practice Time!",
    ctaDesc: "Mastered 3-digit column multiplication? Test your skills with interactive exercises!",
    ctaBtn: "Start Exercises ➔",
    footerPrompt: "Finished reviewing the theory?",
    footerBtn: "Go to Exercises 🎯"
  }
};

export default function Pollaplasiasmos3PsifiaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [numA, setNumA] = useState(245);
  const [numB, setNumB] = useState(135);

  const valA = typeof numA === 'number' ? numA : 0;
  const valB = typeof numB === 'number' ? numB : 0;

  const unitsB = valB % 10;
  const tensB = Math.floor((valB % 100) / 10);
  const hundredsB = Math.floor(valB / 100);

  const p1 = valA * unitsB;
  const p2 = valA * tensB * 10;
  const p3 = valA * hundredsB * 100;
  const total = valA * valB;

  const updateNumA = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumA((prev) => Math.max(100, Math.min(999, (Number(prev) || 100) + delta)));
  };

  const updateNumB = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumB((prev) => Math.max(10, Math.min(999, (Number(prev) || 10) + delta)));
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
          href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoCardTitle}</h3>
              <p className="text-xs text-emerald-100">
                {t.promoCardDesc}
              </p>
              <Link
                href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.promoCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΑ 3 ΒΗΜΑΤΑ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theoryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ΒΗΜΑ 1 */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3 shadow-sm">
              <div className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step1Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-amber-900">
                {t.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* ΒΗΜΑ 2 */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3 shadow-sm">
              <div className="bg-teal-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step2Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-teal-900">
                {t.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* ΒΗΜΑ 3 */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step3Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-purple-900">
                {t.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - ΚΑΘΕΤΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> {t.interactiveTitle}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {t.interactiveDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΑΡΙΘΜΩΝ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                {t.controlsTitle}
              </h3>

              {/* 1ος Αριθμός (numA) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">
                    {toCleanUppercase(t.labelNumA)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                    {formatNumber(valA)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateNumA(e, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
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
                    id="calc-num-a"
                    name="calc-num-a"
                    value={numA}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setNumA(digits === '' ? '' : Number(digits));
                    }}
                    onBlur={() => {
                      if (!numA || numA < 100) setNumA(100);
                    }}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="245"
                  />

                  <button
                    onClick={(e) => updateNumA(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title={t.increase1Aria}
                    aria-label={t.increase1Aria}
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορη αυξομείωση δεκάδων */}
                <div className="flex justify-center gap-2 pt-0.5">
                  <button
                    onClick={(e) => updateNumA(e, -10)}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    －10
                  </button>
                  <button
                    onClick={(e) => updateNumA(e, 10)}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    ＋10
                  </button>
                </div>
              </div>

              {/* 2ος Αριθμός (numB) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">
                    {toCleanUppercase(t.labelNumB)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-base">
                    {formatNumber(valB)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateNumB(e, -1)}
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
                    id="calc-num-b"
                    name="calc-num-b"
                    value={numB}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setNumB(digits === '' ? '' : Number(digits));
                    }}
                    onBlur={() => {
                      if (numB === '' || numB < 10) setNumB(10);
                    }}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="135"
                  />

                  <button
                    onClick={(e) => updateNumB(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title={t.increase1Aria}
                    aria-label={t.increase1Aria}
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορη αυξομείωση δεκάδων */}
                <div className="flex justify-center gap-2 pt-0.5">
                  <button
                    onClick={(e) => updateNumB(e, -10)}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    －10
                  </button>
                  <button
                    onClick={(e) => updateNumB(e, 10)}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    ＋10
                  </button>
                </div>
              </div>

              {/* ΕΠΕΞΗΓΗΣΗ ΜΕΡΙΚΩΝ ΓΙΝΟΜΕΝΩΝ */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/70 text-amber-950 text-xs space-y-1.5 shadow-sm">
                <p className="font-black text-amber-900">{t.partialProductsTitle}</p>
                <p>
                  {t.partial1Label}{' '}
                  {formatNumber(valA)} · {unitsB} ＝ <strong className="font-mono">{formatNumber(p1)}</strong>
                </p>
                <p>
                  {t.partial2Label}{' '}
                  {formatNumber(valA)} · {tensB * 10} ＝ <strong className="font-mono">{formatNumber(p2)}</strong>
                </p>
                <p>
                  {t.partial3Label}{' '}
                  {formatNumber(valA)} · {hundredsB * 100} ＝ <strong className="font-mono">{formatNumber(p3)}</strong>
                </p>
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΚΑΘΕΤΗΣ ΠΡΑΞΗΣ (SVG) */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] aspect-[5/5] relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 280 270">
                  {/* 1ος Αριθμός */}
                  <text x="240" y="45" fill="#f8fafc" fontSize="26" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {formatNumber(valA)}
                  </text>

                  {/* Σύμβολο Πολλαπλασιασμού · */}
                  <text x="40" y="85" fill="#fbbf24" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="start">
                    ·
                  </text>

                  {/* 2ος Αριθμός */}
                  <text x="240" y="85" fill="#fbbf24" fontSize="26" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {formatNumber(valB)}
                  </text>

                  {/* 1η Γραμμή πράξης */}
                  <line x1="35" y1="102" x2="245" y2="102" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

                  {/* 1ο Μερικό Γινόμενο (Πράσινο) */}
                  <text x="240" y="132" fill="#34d399" fontSize="20" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {formatNumber(p1)}
                  </text>

                  {/* 2ο Μερικό Γινόμενο (Τιρκουάζ) */}
                  <text x="240" y="162" fill="#2dd4bf" fontSize="20" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {p2 > 0 ? formatNumber(p2) : '0'}
                  </text>

                  {/* 3ο Μερικό Γινόμενο (Μοβ) */}
                  <text x="240" y="192" fill="#c084fc" fontSize="20" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {p3 > 0 ? formatNumber(p3) : '0'}
                  </text>

                  {/* 2η Γραμμή αθροίσματος */}
                  <line x1="35" y1="208" x2="245" y2="208" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Τελικό Αποτέλεσμα (Χρυσό) */}
                  <text x="240" y="242" fill="#fde047" fontSize="26" fontWeight="900" fontFamily="monospace" textAnchor="end">
                    {formatNumber(total)}
                  </text>
                </svg>
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
            href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
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
            href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            {t.footerBtn}
          </Link>
        </div>
      </footer>
    </Layout>
  );
}