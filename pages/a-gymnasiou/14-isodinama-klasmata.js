import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων: άτονα παντού εκτός από το "Α'"
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

// Βοηθητικός υπολογισμός ΜΚΔ / GCD (Ευκλείδης)
const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή (mobile-safe & responsive)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numericNeg =
    (typeof num === 'number' && num < 0) ||
    (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;

  const displayNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const displayDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {showMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-0.5 sm:px-1 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Συγκεντρωτικό Λεξικό Μεταφράσεων i18n
const translations = {
  el: {
    pageTitle: "Ισοδύναμα Κλάσματα | Α' Γυμνασίου",
    pageDesc: "Έννοια ισοδύναμων κλασμάτων, διαστολή, απλοποίηση σε ανάγωγο κλάσμα και κριτήριο χιαστί γινομένων.",
    backText: "Α' Γυμνασίου",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Ισοδύναμα Κλάσματα",
    mainDesc: "Μαθαίνουμε πότε δύο κλάσματα είναι ισοδύναμα, πώς δημιουργούμε ίσα κλάσματα με διαστολή ή απλοποίηση και πώς τα ελέγχουμε ταχύτατα με τα χιαστί γινόμενα.",

    // Ενότητα 1
    sec1Title: "Τι Είναι Ισοδύναμα Κλάσματα;",
    sec1Lead: "Ισοδύναμα (ή ίσα) ονομάζονται τα κλάσματα που εκφράζουν το ίδιο μέρος μιας ποσότητας ή αντιστοιχούν στον ίδιο ρητό αριθμό.",
    sec1Clarification: "Αν και έχουν διαφορετικούς αριθμητές και παρονομαστές, η τιμή τους παραμένει απολύτως ίδια.",
    sec1BoxTitle: "Η ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ ΤΩΝ ΚΛΑΣΜΑΤΩΝ",
    sec1ExpansionTitle: "1. Διαστολή (Πολλαπλασιασμός)",
    sec1ExpansionDesc: "Πολλαπλασιάζουμε αριθμητή και παρονομαστή με τον ίδιο μη μηδενικό αριθμό:",
    sec1SimplificationTitle: "2. Απλοποίηση ή Συστολή (Διαίρεση)",
    sec1SimplificationDesc: "Διαιρούμε αριθμητή και παρονομαστή με κοινό τους διαιρέτη:",
    irreducibleBadge: "Ανάγωγο Κλάσμα:",
    irreducibleDesc: "Ένα κλάσμα λέγεται ανάγωγο όταν ο αριθμητής και ο παρονομαστής του δεν έχουν κανέναν κοινό διαιρέτη εκτός από το 1 (δηλαδή είναι πρώτοι μεταξύ τους, Μ.Κ.Δ. ＝ 1) και συνεπώς δεν μπορεί να απλοποιηθεί περαιτέρω.",

    // Ενότητα 2
    sec2Title: "Διαδραστικό Εργαστήριο: Δημιουργία & Οπτικοποίηση Ισοδύναμου Κλάσματος",
    lab1NumLabel: "Αριθμητής (α)",
    lab1DenLabel: "Παρονομαστής (β)",
    lab1MultLabel: "Συντελεστής Διαστολής (κ)",
    lab1EqTitle: "ΙΣΟΤΗΤΑ ΚΛΑΣΜΑΤΩΝ",
    lab1BadgeReduced: "ΑΡΧΙΚΟ ΑΝΑΓΩΓΟ",
    lab1BadgeNotReduced: "ΑΡΧΙΚΟ ΜΗ ΑΝΑΓΩΓΟ",
    lab1CompTitle: "Σύγκριση ανά Ακέραια Μονάδα",
    lab1TotalUnits: "συνολικές μονάδες",
    lab1UnitPrefix: "η Ακέραια Μονάδα",
    lab1OriginalBar: "Αρχικό (ανά",
    lab1ScaledBar: "Ισοδύναμο (ανά",
    lab1VisualNote: "Παρατηρούμε ότι σε κάθε ακέραια μονάδα οι δύο ράβδοι καλύπτουν ακριβώς το ίδιο μήκος, άρα τα κλάσματα είναι ισοδύναμα!",

    // Ενότητα 3
    sec3Title: "Το Κριτήριο των Χιαστί Γινομένων",
    sec3Lead: "Ο πιο γρήγορος τρόπος για να ελέγξουμε αν δύο κλάσματα είναι ισοδύναμα είναι ο κανόνας των χιαστί γινομένων:",
    sec3Bullet1: "Αν τα χιαστί γινόμενα είναι ίσα, τα κλάσματα είναι ισοδύναμα.",
    sec3Bullet2: "Αν τα χιαστί γινόμενα είναι άνισα, τα κλάσματα δεν είναι ισοδύναμα.",
    sec3ExTitle: "ΠΑΡΑΔΕΙΓΜΑ ΕΛΕΓΧΟΥ",
    sec3ExLead: "Ελέγχουμε τα κλάσματα",
    sec3ExAnd: "και",
    sec3ExProd1: "1ο γινόμενο: 3 · 15 ＝ 45",
    sec3ExProd2: "2ο γινόμενο: 5 · 9 ＝ 45",
    sec3ExConclusion: "Τα γινόμενα είναι ίσα (45 ＝ 45), άρα τα κλάσματα είναι ισοδύναμα!",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Δοκιμαστήριο Χιαστί Γινομένων σε Πραγματικό Χρόνο",
    lab2Fraction1: "1ο ΚΛΑΣΜΑ (α/β)",
    lab2Fraction2: "2ο ΚΛΑΣΜΑ (γ/δ)",
    lab2NumA: "ΑΡΙΘΜΗΤΗΣ (α)",
    lab2DenB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
    lab2NumC: "ΑΡΙΘΜΗΤΗΣ (γ)",
    lab2DenD: "ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)",
    lab2CardTitle: "ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ",
    lab2BadgeEquiv: "ΙΣΟΔΥΝΑΜΑ ( ＝ )",
    lab2BadgeNotEquiv: "ΜΗ ΙΣΟΔΥΝΑΜΑ ( ≠ )",
    lab2Cross1Label: "1ο Χιαστί (α · δ):",
    lab2Cross2Label: "2ο Χιαστί (β · γ):",
    lab2EquivResultLead: "Επειδή τα γινόμενα είναι ίσα",
    lab2EquivResultTail: "τα δύο κλάσματα είναι ισοδύναμα.",
    lab2NotEquivResultLead: "Επειδή",
    lab2NotEquivResultTail: "τα κλάσματα δεν είναι ισοδύναμα.",
  },
  en: {
    pageTitle: "Equivalent Fractions | Grade 7",
    pageDesc: "Concept of equivalent fractions, expansion, simplification to irreducible fraction, and cross-multiplication criterion.",
    backText: "Grade 7",
    btnExercises: "EXERCISES",
    chapterBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Equivalent Fractions",
    mainDesc: "Learn when two fractions are equivalent, how to construct equal fractions through expansion or simplification, and how to verify them quickly using cross-products.",

    // Section 1
    sec1Title: "What Are Equivalent Fractions?",
    sec1Lead: "Fractions that express the same part of a whole or correspond to the same rational number are called equivalent (or equal).",
    sec1Clarification: "Even though their numerators and denominators differ, their numerical value remains identical.",
    sec1BoxTitle: "FUNDAMENTAL PROPERTY OF FRACTIONS",
    sec1ExpansionTitle: "1. Expansion (Multiplication)",
    sec1ExpansionDesc: "Multiply both numerator and denominator by the same non-zero number:",
    sec1SimplificationTitle: "2. Simplification (Division)",
    sec1SimplificationDesc: "Divide both numerator and denominator by a common divisor:",
    irreducibleBadge: "Irreducible Fraction:",
    irreducibleDesc: "A fraction is irreducible when its numerator and denominator share no common factors other than 1 (coprime, GCD ＝ 1), meaning it cannot be simplified any further.",

    // Section 2
    sec2Title: "Interactive Lab: Building & Visualizing Equivalent Fractions",
    lab1NumLabel: "Numerator (a)",
    lab1DenLabel: "Denominator (b)",
    lab1MultLabel: "Expansion Factor (k)",
    lab1EqTitle: "FRACTION EQUALITY",
    lab1BadgeReduced: "INITIAL IRREDUCIBLE",
    lab1BadgeNotReduced: "INITIAL REDUCIBLE",
    lab1CompTitle: "Comparison per Whole Unit",
    lab1TotalUnits: "total units",
    lab1UnitPrefix: "Unit Interval",
    lab1OriginalBar: "Original (divided by",
    lab1ScaledBar: "Equivalent (divided by",
    lab1VisualNote: "Across every unit interval, both fraction bars span the exact same length, proving the fractions are equivalent!",

    // Section 3
    sec3Title: "The Cross-Multiplication Criterion",
    sec3Lead: "The fastest method to verify whether two fractions are equivalent is using cross-products:",
    sec3Bullet1: "If the cross-products are equal, the fractions are equivalent.",
    sec3Bullet2: "If the cross-products are unequal, the fractions are not equivalent.",
    sec3ExTitle: "WORKED EXAMPLE",
    sec3ExLead: "Checking the fractions",
    sec3ExAnd: "and",
    sec3ExProd1: "1st product: 3 · 15 ＝ 45",
    sec3ExProd2: "2nd product: 5 · 9 ＝ 45",
    sec3ExConclusion: "The products are equal (45 ＝ 45), hence the fractions are equivalent!",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Real-Time Cross-Product Tester",
    lab2Fraction1: "1st FRACTION (a/b)",
    lab2Fraction2: "2nd FRACTION (c/d)",
    lab2NumA: "NUMERATOR (a)",
    lab2DenB: "DENOMINATOR (b)",
    lab2NumC: "NUMERATOR (c)",
    lab2DenD: "DENOMINATOR (d)",
    lab2CardTitle: "EQUIVALENCE TEST",
    lab2BadgeEquiv: "EQUIVALENT ( ＝ )",
    lab2BadgeNotEquiv: "NOT EQUIVALENT ( ≠ )",
    lab2Cross1Label: "1st Cross-Product (a · d):",
    lab2Cross2Label: "2nd Cross-Product (b · c):",
    lab2EquivResultLead: "Since the products are equal",
    lab2EquivResultTail: "the two fractions are equivalent.",
    lab2NotEquivResultLead: "Since",
    lab2NotEquivResultTail: "the fractions are not equivalent.",
  }
};

export default function IsodinamaKlasmataTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για Εργαστήριο 1: Διαστολή / Συστολή
  const [baseNum, setBaseNum] = useState(2);
  const [baseDen, setBaseDen] = useState(3);
  const [multiplier, setMultiplier] = useState(2);

  // State για Εργαστήριο 2: Χιαστί Γινόμενα
  const [f1Num, setF1Num] = useState(3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(6);
  const [f2Den, setF2Den] = useState(8);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const scaledNum = useMemo(() => baseNum * multiplier, [baseNum, multiplier]);
  const scaledDen = useMemo(() => baseDen * multiplier, [baseDen, multiplier]);
  const baseGcd = useMemo(() => gcd(baseNum, baseDen), [baseNum, baseDen]);
  const isReduced = baseGcd === 1;

  // Υπολογισμοί Εργαστηρίου 2 (Χιαστί)
  const crossProd1 = useMemo(() => f1Num * f2Den, [f1Num, f2Den]);
  const crossProd2 = useMemo(() => f1Den * f2Num, [f1Den, f2Num]);
  const areEquivalent = useMemo(() => crossProd1 === crossProd2, [crossProd1, crossProd2]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/14-isodinama-klasmata-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-14 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words">
              {t.mainDesc}
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ & ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words">
                {t.sec1Lead}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-xl font-mono shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-full overflow-hidden">
                <Frac num="1" den="2" />
                <span>＝</span>
                <Frac num="2" den="4" />
                <span>＝</span>
                <Frac num="3" den="6" />
                <span>＝</span>
                <Frac num="4" den="8" />
                <span>＝ {locale === 'el' ? '0,5' : '0.5'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 break-words">
                {t.sec1Clarification}
              </p>
            </div>

            {/* Διαστολή & Συστολή */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.sec1BoxTitle)}
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950 break-words">{t.sec1ExpansionTitle}</div>
                  <p className="text-slate-600 break-words">
                    {t.sec1ExpansionDesc}
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center flex-wrap gap-1">
                    <Frac num="α" den="β" />
                    <span>＝</span>
                    <Frac num="α · κ" den="β · κ" />
                    <span>(κ ≠ 0)</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950 break-words">{t.sec1SimplificationTitle}</div>
                  <p className="text-slate-600 break-words">
                    {t.sec1SimplificationDesc}
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center flex-wrap gap-1">
                    <Frac num="α" den="β" />
                    <span>＝</span>
                    <Frac num="α : κ" den="β : κ" />
                    <span>(κ ≠ 0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1 break-words">
            <strong>{t.irreducibleBadge}</strong> {t.irreducibleDesc}
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου */}
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {toCleanUppercase(t.lab1NumLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseNum, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono">
                    α ＝ {baseNum}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseNum, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {toCleanUppercase(t.lab1DenLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseDen, -1, 1, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono">
                    β ＝ {baseDen}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseDen, 1, 1, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">
                  {toCleanUppercase(t.lab1MultLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setMultiplier, -1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-lg font-mono">
                    · {multiplier}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setMultiplier, 1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Οπτική Αναπαράσταση & Αποτέλεσμα */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-5 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  {toCleanUppercase(t.lab1EqTitle)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {toCleanUppercase(isReduced ? t.lab1BadgeReduced : t.lab1BadgeNotReduced)}
                </span>
              </div>

              {/* Μαθηματική Εξίσωση */}
              <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-black font-mono flex-wrap max-w-full">
                <Frac num={baseNum} den={baseDen} className="text-white" />
                <span className="text-indigo-300">＝</span>
                <Frac
                  num={`${baseNum} · ${multiplier}`}
                  den={`${baseDen} · ${multiplier}`}
                  className="text-slate-200"
                />
                <span className="text-indigo-300">＝</span>
                <Frac num={scaledNum} den={scaledDen} className="text-emerald-400" />
              </div>

              {/* Οπτικές Ράβδοι Σύγκρισης */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold border-b border-slate-700/60 pb-2 flex-wrap gap-2">
                  <span>
                    {t.lab1CompTitle}{' '}
                    {baseNum > baseDen && `(${Math.ceil(baseNum / baseDen)} ${t.lab1TotalUnits})`}:
                  </span>
                  <span className="font-mono text-emerald-400">
                    {((baseNum / baseDen) * 100).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}%
                  </span>
                </div>

                <div className="space-y-3.5">
                  {Array.from({ length: Math.ceil(baseNum / baseDen) }).map((_, barIdx) => (
                    <div
                      key={barIdx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="text-[10px] font-bold text-indigo-300 tracking-wider">
                        {barIdx + 1}{t.lab1UnitPrefix} [{barIdx}, {barIdx + 1}]
                      </div>

                      {/* 1. Μπάρα Αρχικού Κλάσματος */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>{t.lab1OriginalBar} {baseDen}):</span>
                          <span>
                            {Math.max(0, Math.min(baseDen, baseNum - barIdx * baseDen))} / {baseDen}
                          </span>
                        </div>
                        <div className="w-full h-7 bg-slate-800 rounded-lg overflow-hidden flex border border-slate-700 shadow-inner">
                          {Array.from({ length: baseDen }).map((_, partIdx) => {
                            const globalIdx = barIdx * baseDen + partIdx;
                            const isFilled = globalIdx < baseNum;
                            return (
                              <div
                                key={partIdx}
                                className={`h-full border-r border-slate-900/60 transition-all ${
                                  isFilled ? 'bg-indigo-500' : 'bg-slate-800'
                                }`}
                                style={{ width: `${100 / baseDen}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Μπάρα Ισοδύναμου Κλάσματος */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                          <span>{t.lab1ScaledBar} {scaledDen}):</span>
                          <span>
                            {Math.max(0, Math.min(scaledDen, scaledNum - barIdx * scaledDen))} / {scaledDen}
                          </span>
                        </div>
                        <div className="w-full h-7 bg-slate-800 rounded-lg overflow-hidden flex border border-slate-700 shadow-inner">
                          {Array.from({ length: scaledDen }).map((_, partIdx) => {
                            const globalIdx = barIdx * scaledDen + partIdx;
                            const isFilled = globalIdx < scaledNum;
                            return (
                              <div
                                key={partIdx}
                                className={`h-full border-r border-slate-900/40 transition-all ${
                                  isFilled ? 'bg-emerald-500' : 'bg-slate-800'
                                }`}
                                style={{ width: `${100 / scaledDen}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-indigo-100 leading-relaxed break-words">
                {t.lab1VisualNote}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΚΡΙΤΗΡΙΟ ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words">
                {t.sec3Lead}
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-xl font-mono shadow-sm flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-full overflow-hidden">
                <Frac num="α" den="β" />
                <span>＝</span>
                <Frac num="γ" den="δ" />
                <span className="text-indigo-600 font-bold">⟺</span>
                <span>α · δ ＝ β · γ</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="break-words">{t.sec3Bullet1}</li>
                <li className="break-words">{t.sec3Bullet2}</li>
              </ul>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 font-sans">
                {toCleanUppercase(t.sec3ExTitle)}
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center flex-wrap gap-1">
                  <span>{t.sec3ExLead}</span>
                  <Frac num="3" den="5" />
                  <span>{t.sec3ExAnd}</span>
                  <Frac num="9" den="15" />:
                </div>
                <div>{t.sec3ExProd1}</div>
                <div>{t.sec3ExProd2}</div>
                <div className="text-emerald-700 font-sans font-bold pt-1 break-words">
                  {t.sec3ExConclusion}
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2 */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Steppers για τα 2 κλάσματα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* Κλάσμα 1 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 tracking-wider">
                    {toCleanUppercase(t.lab2Fraction1)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.lab2NumA)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.lab2DenB)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 25, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 25, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κλάσμα 2 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 tracking-wider">
                    {toCleanUppercase(t.lab2Fraction2)}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.lab2NumC)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, 1, 30, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, 1, 30, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      {toCleanUppercase(t.lab2DenD)}
                    </label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 35, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 35, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Χιαστί */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab2CardTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    areEquivalent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {toCleanUppercase(areEquivalent ? t.lab2BadgeEquiv : t.lab2BadgeNotEquiv)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-3xl font-black flex-wrap max-w-full">
                  <Frac num={f1Num} den={f1Den} className="text-white" />
                  <span className={areEquivalent ? 'text-emerald-400' : 'text-rose-400'}>
                    {areEquivalent ? '＝' : '≠'}
                  </span>
                  <Frac num={f2Num} den={f2Den} className="text-white" />
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300 flex-wrap gap-1">
                    <span>{t.lab2Cross1Label} {f1Num} · {f2Den} ＝</span>
                    <strong className="text-amber-300">{crossProd1}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 flex-wrap gap-1">
                    <span>{t.lab2Cross2Label} {f1Den} · {f2Num} ＝</span>
                    <strong className="text-sky-300">{crossProd2}</strong>
                  </div>
                  <div className="pt-1.5 border-t border-white/10 text-xs font-sans leading-relaxed break-words">
                    {areEquivalent ? (
                      <span className="text-emerald-300">
                        {t.lab2EquivResultLead} ({crossProd1} ＝ {crossProd2}), {t.lab2EquivResultTail}
                      </span>
                    ) : (
                      <span className="text-rose-300">
                        {t.lab2NotEquivResultLead} {crossProd1} ≠ {crossProd2}, {t.lab2NotEquivResultTail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}