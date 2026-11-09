import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const CONFIG = {
  initialValues: {
    DX: 1,
    X: 4,
    E: 3,
    D: 2,
    M: 5,
  },
};

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

/**
 * Μετατροπή αριθμών από 0 έως 20.000 σε ελληνικές λέξεις
 */
function numberToGreekWords(num) {
  if (num === 0) return 'μηδέν';
  if (num === 20000) return 'είκοσι χιλιάδες';

  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τριακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];

  const thousandWords = [
    '', 'χίλια', 'δύο χιλιάδες', 'τρεις χιλιάδες', 'τέσσερις χιλιάδες',
    'πέντε χιλιάδες', 'έξι χιλιάδες', 'επτά χιλιάδες', 'οκτώ χιλιάδες', 'εννέα χιλιάδες',
    'δέκα χιλιάδες', 'έντεκα χιλιάδες', 'δώδεκα χιλιάδες', 'δεκατρείς χιλιάδες',
    'δεκατέσσερις χιλιάδες', 'δεκαπέντε χιλιάδες', 'δεκαέξι χιλιάδες', 'δεκαεπτά χιλιάδες',
    'δεκαοκτώ χιλιάδες', 'δεκαεννέα χιλιάδες', 'είκοσι χιλιάδες',
  ];

  const th = Math.floor(num / 1000);
  const rem = num % 1000;

  let res = '';
  if (th > 0) {
    res += thousandWords[th] + ' ';
  }

  if (rem > 0) {
    const e = Math.floor(rem / 100);
    const d = Math.floor((rem % 100) / 10);
    const m = rem % 10;

    if (e > 0) {
      if (e === 1 && (d > 0 || m > 0)) res += 'εκατόν ';
      else res += hundreds[e] + ' ';
    }

    if (d === 1) {
      if (m === 0) res += 'δέκα';
      else if (m === 1) res += 'έντεκα';
      else if (m === 2) res += 'δώδεκα';
      else if (m === 3) res += 'δεκατρία';
      else if (m === 4) res += 'δεκατέσσερα';
      else res += 'δέκα ' + units[m];
    } else {
      if (d > 1) res += tens[d] + ' ';
      if (m > 0) res += units[m];
    }
  }

  return res.trim().replace(/\s+/g, ' ');
}

/**
 * Μετατροπή αριθμών από 0 έως 20.000 σε αγγλικές λέξεις
 */
function numberToEnglishWords(num) {
  if (num === 0) return 'zero';
  if (num === 20000) return 'twenty thousand';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const convertBelowThousand = (n) => {
    let s = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;

    if (h > 0) {
      s += ones[h] + ' hundred';
      if (rem > 0) s += ' and ';
    }

    if (rem > 0) {
      if (rem < 10) {
        s += ones[rem];
      } else if (rem < 20) {
        s += teens[rem - 10];
      } else {
        const t = Math.floor(rem / 10);
        const u = rem % 10;
        s += tens[t];
        if (u > 0) s += '-' + ones[u];
      }
    }
    return s.trim();
  };

  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let result = '';
  if (thousands > 0) {
    result += convertBelowThousand(thousands) + ' thousand';
    if (remainder > 0) {
      result += remainder < 100 ? ' and ' : ' ';
    }
  }

  if (remainder > 0) {
    result += convertBelowThousand(remainder);
  }

  return result.trim().replace(/\s+/g, ' ');
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Αριθμοί έως το 20.000 - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε να διαβάζουμε, να γράφουμε και να αναλύουμε αριθμούς από το 0 έως το 20.000 με διαδραστικό άβακα αξίας θέσης.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/1-arithmoi-eos-20-xiliades-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Αριθμοί έως το 20.000",
    heroDesc: "Μαθαίνουμε να διαβάζουμε, να γράφουμε και να αναλύουμε αριθμούς από το",
    heroDescLimit: "0 έως το 20.000",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις της ενότητας για να σιγουρευτείς ότι τα έμαθες όλα!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    theoryTitle: "Αναλυτική Θεωρία και Κανόνες",
    card1Title: "Πώς σχηματίζουμε τους αριθμούς;",
    card1Rule1: "10 Μονάδες (Μ) ＝ 1 Δεκάδα (Δ)",
    card1Rule2: "10 Δεκάδες (Δ) ＝ 1 Εκατοντάδα (Ε)",
    card1Rule3: "10 Εκατοντάδες (Ε) ＝ 1 Μονάδα Χιλιάδα (Χ) ＝ 1.000",
    card1Rule4: "10 Χιλιάδες (Χ) ＝ 1 Δεκάδα Χιλιάδα (ΔΧ) ＝ 10.000",
    card2Title: "Γραφή και Ανάγνωση",
    card2Rule1: "Χωρίζουμε τις χιλιάδες από τις εκατοντάδες βάζοντας τελεία (π.χ. 14.325).",
    card2Rule2: "Όταν διαβάζουμε, ξεκινάμε από τις Χιλιάδες και μετά τις Μονάδες.",
    card2Rule3: "Προσοχή: Λέμε «εκατόν πέντε» (105) όταν ακολουθούν άλλοι αριθμοί, αλλά «εκατό» (100) όταν είναι μόνο του.",
    tableTitle: "Πίνακας Αξίας Θέσης Ψηφίου",
    classThousands: "ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ",
    classUnits: "ΚΛΑΣΗ ΜΟΝΑΔΩΝ",
    colDX: "Δεκάδες Χιλιάδες",
    colX: "Μονάδες Χιλιάδες",
    colE: "Εκατοντάδες",
    colD: "Δεκάδες",
    colM: "Μονάδες",
    shortDX: "ΔΧ",
    shortX: "Χ",
    shortE: "Ε",
    shortD: "Δ",
    shortM: "Μ",
    sampleAnalysisLabel: "Παράδειγμα Ανάλυσης (14.325)",
    sampleAnalysisText: "δηλαδή: 10.000 ＋ 4.000 ＋ 300 ＋ 20 ＋ 5",
    // Section 2
    abacusTitle: "Διαδραστικός Άβακας Αξίας Θέσης",
    abacusDesc: "Πληκτρολόγησε έναν αριθμό ή επίλεξε τις τιμές των στηλών για να δεις τον σχηματισμό του!",
    abacusLimit: "Όριο:",
    abacusYourNumber: "Ο ΑΡΙΘΜΟΣ ΣΟΥ",
    abacusInputLabel: "Αριθμός:",
    abacusPlaceholder: "π.χ. 14325",
    abacusExpandedLabel: "ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ ΤΟΥ ΑΡΙΘΜΟΥ:",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Ολοκλήρωσες τη θεωρία; Κάνε τις διαδραστικές ασκήσεις για να δοκιμάσεις τις γνώσεις σου!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔",
  },
  en: {
    metaTitle: "Numbers up to 20,000 - Theory | LearnMaths.gr",
    metaDesc: "Learn how to read, write, and decompose numbers from 0 to 20,000 with an interactive place value abacus.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/1-arithmoi-eos-20-xiliades-ask",
    badge: "4TH GRADE",
    heroTitle: "Numbers up to 20,000",
    heroDesc: "Learn to read, write, and decompose numbers from",
    heroDescLimit: "0 to 20,000",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try this unit's practice exercises to make sure you've mastered everything!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    theoryTitle: "Detailed Theory and Rules",
    card1Title: "How are numbers formed?",
    card1Rule1: "10 Units (U) ＝ 1 Ten (T)",
    card1Rule2: "10 Tens (T) ＝ 1 Hundred (H)",
    card1Rule3: "10 Hundreds (H) ＝ 1 Thousand (Th) ＝ 1,000",
    card1Rule4: "10 Thousands (Th) ＝ 1 Ten Thousand (TTh) ＝ 10,000",
    card2Title: "Writing and Reading",
    card2Rule1: "We separate thousands with a comma or point (e.g. 14,325).",
    card2Rule2: "When reading, we start from Thousands and then read Units.",
    card2Rule3: "Tip: Read numbers compoundly by class, combining tens and ones smoothly.",
    tableTitle: "Place Value Chart",
    classThousands: "THOUSANDS CLASS",
    classUnits: "UNITS CLASS",
    colDX: "Ten Thousands",
    colX: "Thousands",
    colE: "Hundreds",
    colD: "Tens",
    colM: "Units",
    shortDX: "TTh",
    shortX: "Th",
    shortE: "H",
    shortD: "T",
    shortM: "U",
    sampleAnalysisLabel: "Decomposition Example (14,325)",
    sampleAnalysisText: "meaning: 10,000 ＋ 4,000 ＋ 300 ＋ 20 ＋ 5",
    // Section 2
    abacusTitle: "Interactive Place Value Abacus",
    abacusDesc: "Type a number or select column digits below to visualize how it is formed!",
    abacusLimit: "Limit:",
    abacusYourNumber: "YOUR NUMBER",
    abacusInputLabel: "Number:",
    abacusPlaceholder: "e.g. 14325",
    abacusExpandedLabel: "EXPANDED NOTATION OF THE NUMBER:",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Finished the theory? Try the interactive practice exercises to test your skills!",
    bottomPromoBtn: "Start Exercises ➔",
  },
};

export default function ArithmoiEos20XiliadesPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [disks, setDisks] = useState(CONFIG.initialValues);

  const totalNumber =
    disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M;

  const applyNumber = (n) => {
    const str = n.toString().padStart(5, '0');
    setDisks({
      DX: parseInt(str[0], 10),
      X: parseInt(str[1], 10),
      E: parseInt(str[2], 10),
      D: parseInt(str[3], 10),
      M: parseInt(str[4], 10),
    });
  };

  const handleDirectInputChange = (e) => {
    const cleanDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);

    if (cleanDigits === '') {
      applyNumber(0);
      return;
    }

    const nextVal = parseInt(cleanDigits, 10);
    if (nextVal > 20000) {
      return;
    }

    applyNumber(nextVal);
  };

  const columnsList = [
    { key: 'DX', label: t.colDX, short: t.shortDX, color: 'bg-purple-500', textColor: 'text-purple-800', lightBg: 'bg-purple-100' },
    { key: 'X', label: t.colX, short: t.shortX, color: 'bg-indigo-500', textColor: 'text-indigo-800', lightBg: 'bg-indigo-100' },
    { key: 'E', label: t.colE, short: t.shortE, color: 'bg-teal-500', textColor: 'text-teal-800', lightBg: 'bg-teal-100' },
    { key: 'D', label: t.colD, short: t.shortD, color: 'bg-amber-500', textColor: 'text-amber-800', lightBg: 'bg-amber-100' },
    { key: 'M', label: t.colM, short: t.shortM, color: 'bg-emerald-500', textColor: 'text-emerald-800', lightBg: 'bg-emerald-100' },
  ];

  const wordRepresentation =
    currentLocale === 'en'
      ? numberToEnglishWords(totalNumber)
      : numberToGreekWords(totalNumber);

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
                🔢 {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}{' '}
                <strong className="text-white">{t.heroDescLimit}</strong>!
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
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
              <span>📖</span> {t.theoryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Κάρτα 1: Πώς σχηματίζονται */}
            <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>🏛️</span> {t.card1Title}
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>{t.card1Rule1}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>{t.card1Rule2}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>{t.card1Rule3}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>{t.card1Rule4}</strong></span>
                </li>
              </ul>
            </div>

            {/* Κάρτα 2: Πώς τους γράφουμε & διαβάζουμε */}
            <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>✍️</span> {t.card2Title}
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{t.card2Rule1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{t.card2Rule2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{t.card2Rule3}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ - RESPONSIVE SVG */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/90 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 text-center sm:text-left">
              📊 {t.tableTitle}
            </h3>

            <div className="bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
              <svg
                viewBox="0 0 500 130"
                className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
              >
                {/* Header: Κλάσεις */}
                <rect x="10" y="8" width="190" height="26" rx="6" fill="#4f46e5" />
                <text x="105" y="25" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  {t.classThousands}
                </text>

                <rect x="206" y="8" width="284" height="26" rx="6" fill="#0d9488" />
                <text x="348" y="25" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  {t.classUnits}
                </text>

                {/* Subheader: Στήλες (ΔΧ, Χ, Ε, Δ, Μ) */}
                {[
                  { x: 10, w: 92, label: t.colDX, short: t.shortDX, bg: '#f1f5f9' },
                  { x: 108, w: 92, label: t.colX, short: t.shortX, bg: '#f1f5f9' },
                  { x: 206, w: 90, label: t.colE, short: t.shortE, bg: '#f1f5f9' },
                  { x: 302, w: 90, label: t.colD, short: t.shortD, bg: '#f1f5f9' },
                  { x: 398, w: 92, label: t.colM, short: t.shortM, bg: '#f1f5f9' },
                ].map((col) => (
                  <g key={col.short}>
                    <rect x={col.x} y="40" width={col.w} height="32" rx="6" fill={col.bg} stroke="#cbd5e1" strokeWidth="1" />
                    <text x={col.x + col.w / 2} y="54" fill="#334155" fontSize="8.5" fontWeight="700" textAnchor="middle">
                      {col.label}
                    </text>
                    <text x={col.x + col.w / 2} y="66" fill="#0f172a" fontSize="10.5" fontWeight="900" textAnchor="middle">
                      ({col.short})
                    </text>
                  </g>
                ))}

                {/* Ψηφία του Παραδείγματος: 1 4 . 3 2 5 */}
                {[
                  { x: 10, w: 92, val: '1', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
                  { x: 108, w: 92, val: '4', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                  { x: 206, w: 90, val: '3', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
                  { x: 302, w: 90, val: '2', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                  { x: 398, w: 92, val: '5', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                ].map((col) => (
                  <g key={col.x}>
                    <rect x={col.x} y="78" width={col.w} height="44" rx="8" fill={col.bg} stroke={col.border} strokeWidth="1.5" />
                    <text
                      x={col.x + col.w / 2}
                      y="108"
                      fill={col.color}
                      fontSize="22"
                      fontWeight="900"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {col.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* ΑΝΑΛΥΣΗ ΠΑΡΑΔΕΙΓΜΑΤΟΣ */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm space-y-2">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-wide">
                {t.sampleAnalysisLabel}
              </span>
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-slate-900 w-full text-xs sm:text-sm">
                <span>{formatNumberLocale(14325, currentLocale)}</span>
                <span>＝</span>
                <span>(1 · {formatNumberLocale(10000, currentLocale)})</span>
                <span>＋</span>
                <span>(4 · {formatNumberLocale(1000, currentLocale)})</span>
                <span>＋</span>
                <span>(3 · {formatNumberLocale(100, currentLocale)})</span>
                <span>＋</span>
                <span>(2 · {formatNumberLocale(10, currentLocale)})</span>
                <span>＋</span>
                <span>(5 · {formatNumberLocale(1, currentLocale)})</span>
              </div>
              <p className="text-xs text-slate-600 text-center sm:text-left">
                {currentLocale === 'en' ? (
                  <>
                    meaning:{' '}
                    <strong>
                      {formatNumberLocale(10000, currentLocale)} ＋ {formatNumberLocale(4000, currentLocale)} ＋ {formatNumberLocale(3000, currentLocale) === '3,000' ? '300' : '300'} ＋ {formatNumberLocale(20, currentLocale)} ＋ 5
                    </strong>
                  </>
                ) : (
                  <>
                    δηλαδή: <strong>10.000 ＋ 4.000 ＋ 300 ＋ 20 ＋ 5</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ - SECTION 2 */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.abacusTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.abacusDesc}
              </p>
            </div>

            <div className="bg-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
              {t.abacusLimit} <span className="text-indigo-600 font-black">{formatNumberLocale(20000, currentLocale)}</span>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ & ΟΝΟΜΑΣΙΑΣ */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-5 sm:p-7 rounded-2xl shadow-md text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-300">
              {t.abacusYourNumber}
            </span>
            <div className="text-4xl sm:text-6xl font-mono font-black tracking-tight text-amber-400">
              {formatNumberLocale(totalNumber, currentLocale)}
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm font-semibold text-slate-100 max-w-xl mx-auto">
              🗣️ <span className="text-amber-300 font-extrabold capitalize">{wordRepresentation}</span>
            </div>
          </div>

          {/* RESPONSIVE SVG ΑΒΑΚΑΣ (0 0 500 235) */}
          <div className="p-2 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
            <svg
              viewBox="0 0 500 235"
              className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
            >
              {/* Header: Κλάσεις Αριθμών */}
              <rect x="20" y="10" width="182" height="24" rx="6" fill="#e0e7ff" />
              <text x="111" y="26" fill="#3730a3" fontSize="10.5" fontWeight="800" textAnchor="middle">
                {t.classThousands}
              </text>

              <rect x="212" y="10" width="268" height="24" rx="6" fill="#ccfbf1" />
              <text x="346" y="26" fill="#115e59" fontSize="10.5" fontWeight="800" textAnchor="middle">
                {t.classUnits}
              </text>

              {/* Badges Στηλών */}
              {[
                { x: 65, label: t.shortDX, bg: '#f3e8ff', text: '#6b21a8' },
                { x: 157, label: t.shortX, bg: '#e0e7ff', text: '#3730a3' },
                { x: 257, label: t.shortE, bg: '#ccfbf1', text: '#115e59' },
                { x: 347, label: t.shortD, bg: '#fef3c7', text: '#92400e' },
                { x: 437, label: t.shortM, bg: '#dcfce7', text: '#166534' },
              ].map((col) => (
                <g key={col.x}>
                  <rect x={col.x - 26} y="40" width="52" height="20" rx="5" fill={col.bg} />
                  <text x={col.x} y="54" fill={col.text} fontSize="11" fontWeight="800" textAnchor="middle">
                    {col.label}
                  </text>
                </g>
              ))}

              {/* Βάση Άβακα & Ράβδοι */}
              <rect x="20" y="200" width="460" height="8" rx="4" fill="#cbd5e1" />
              {[65, 157, 257, 347, 437].map((xPos) => (
                <line
                  key={xPos}
                  x1={xPos}
                  y1="68"
                  x2={xPos}
                  y2="200"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                />
              ))}

              {/* Χάντρες */}
              {[
                { colKey: 'DX', cx: 65, fill: '#a855f7' },
                { colKey: 'X', cx: 157, fill: '#6366f1' },
                { colKey: 'E', cx: 257, fill: '#14b8a6' },
                { colKey: 'D', cx: 347, fill: '#f59e0b' },
                { colKey: 'M', cx: 437, fill: '#22c55e' },
              ].map(({ colKey, cx, fill }) => {
                const count = disks[colKey];
                return (
                  <g key={colKey}>
                    {Array.from({ length: count }).map((_, idx) => {
                      const cy = 187 - idx * 13;
                      return (
                        <rect
                          key={idx}
                          x={cx - 24}
                          y={cy}
                          width="48"
                          height="11"
                          rx="5.5"
                          fill={fill}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Αριθμητική Τιμή */}
              {[
                { cx: 65, val: disks.DX, color: '#7e22ce' },
                { cx: 157, val: disks.X, color: '#4338ca' },
                { cx: 257, val: disks.E, color: '#0f766e' },
                { cx: 347, val: disks.D, color: '#b45309' },
                { cx: 437, val: disks.M, color: '#15803d' },
              ].map(({ cx, val, color }, i) => (
                <text
                  key={i}
                  x={cx}
                  y="224"
                  fill={color}
                  fontSize="14"
                  fontWeight="900"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {val}
                </text>
              ))}
            </svg>
          </div>

          {/* DROPDOWN PICKERS ΑΝΑ ΣΤΗΛΗ */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {columnsList.map((col) => {
              const maxDigit = col.key === 'DX' ? 2 : 9;
              return (
                <div
                  key={col.key}
                  className="flex flex-col items-center bg-slate-50 p-1.5 sm:p-2.5 rounded-2xl border border-slate-200"
                >
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 text-center truncate w-full">
                    {col.short}
                  </span>

                  <div className="relative w-full">
                    <select
                      value={disks[col.key]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...disks, [col.key]: val };
                        const nextTotal =
                          updated.DX * 10000 +
                          updated.X * 1000 +
                          updated.E * 100 +
                          updated.D * 10 +
                          updated.M;

                        if (nextTotal > 20000) return;
                        setDisks(updated);
                      }}
                      className="w-full bg-white border border-slate-300 font-mono font-black text-slate-800 text-xs sm:text-sm py-1.5 px-1 rounded-xl text-center appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                    >
                      {Array.from({ length: maxDigit + 1 }).map((_, n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NUMERIC INPUT & PRESETS */}
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0">✍️ {t.abacusInputLabel}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  id="direct-number-input"
                  name="direct-number-input"
                  placeholder={t.abacusPlaceholder}
                  value={totalNumber === 0 ? '' : totalNumber}
                  onChange={handleDirectInputChange}
                  className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              {/* Γρήγορα Παραδείγματα (Quick Presets) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[2500, 10450, 14325, 20000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyNumber(preset);
                    }}
                    className="text-[11px] font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-lg transition shrink-0 active:scale-95 shadow-sm"
                  >
                    {formatNumberLocale(preset, currentLocale)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ ΤΟΥ ΑΡΙΘΜΟΥ */}
          <div className="bg-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              {t.abacusExpandedLabel}
            </span>
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 font-mono text-xs sm:text-sm md:text-base font-bold text-slate-800 w-full">
              <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg border border-purple-200">
                {formatNumberLocale(disks.DX * 10000, currentLocale)}
              </span>
              <span>＋</span>
              <span className="bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200">
                {formatNumberLocale(disks.X * 1000, currentLocale)}
              </span>
              <span>＋</span>
              <span className="bg-teal-100 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200">
                {formatNumberLocale(disks.E * 100, currentLocale)}
              </span>
              <span>＋</span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                {formatNumberLocale(disks.D * 10, currentLocale)}
              </span>
              <span>＋</span>
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                {formatNumberLocale(disks.M, currentLocale)}
              </span>
              <span>＝</span>
              <span className="bg-slate-900 text-amber-400 px-3 py-1 rounded-lg font-black">
                {formatNumberLocale(totalNumber, currentLocale)}
              </span>
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