import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

const translations = {
  el: {
    metaTitle: "Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις | Α' Γυμνασίου",
    metaDescription: "Θεωρία και διαδραστικά εργαστήρια για τους φυσικούς αριθμούς, τις ιδιότητες του πολλαπλασιασμού και τις δυνάμεις για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    actionButton: "Ασκήσεις",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις",
    mainSubtitle: "Εξερευνούμε τη δομή του συνόλου των φυσικών αριθμών, τις θεμελιώδεις ιδιότητες του πολλαπλασιασμού και τη σύντομη γραφή των διαδοχικών γινομένων μέσω των δυνάμεων.",
    sec1Title: "Η Έννοια των Φυσικών Αριθμών",
    sec1Intro: "Φυσικοί αριθμοί ονομάζονται οι αριθμοί που χρησιμοποιούμε για να απαριθμήσουμε ή να διατάξουμε αντικείμενα:",
    sec1Bullet1: "Ο μικρότερος φυσικός αριθμός είναι το 0.",
    sec1Bullet2: "Δεν υπάρχει μεγαλύτερος φυσικός αριθμός, το σύνολο ℕ είναι άπειρο.",
    sec1Bullet3: "Κάθε φυσικός αριθμός έχει έναν ακριβώς επόμενο (διαδοχικό) φυσικό αριθμό.",
    axisTitle: "ΑΠΕΙΚΟΝΙΣΗ ΣΤΟΝ ΑΞΟΝΑ ΤΩΝ ΑΡΙΘΜΩΝ",
    axisCaption: "Κάθε φυσικός αριθμός αντιστοιχίζεται σε ένα συγκεκριμένο σημείο της ημιευθείας με αρχή το 0.",
    sec2Title: "Πολλαπλασιασμός & Ιδιότητες",
    sec2Intro: "Ο πολλαπλασιασμός είναι η συντομογραφία μιας πρόσθεσης ίσων προσθετέων:",
    sec2Times: "φορές",
    prop1Badge: "ΙΔΙΟΤΗΤΑ 1",
    prop1Title: "Αντιμεταθετική",
    prop1Desc: "Η σειρά των παραγόντων δεν αλλάζει το γινόμενο:",
    prop2Badge: "ΙΔΙΟΤΗΤΑ 2",
    prop2Title: "Προσεταιριστική",
    prop2Desc: "Μπορούμε να ομαδοποιήσουμε τους παράγοντες ελεύθερα:",
    prop3Badge: "ΙΔΙΟΤΗΤΑ 3",
    prop3Title: "Ουδέτερο & Μηδενικό Στοιχείο",
    prop3Desc: "Το 1 δεν αλλάζει τον αριθμό, ενώ το 0 μηδενίζει το γινόμενο:",
    distPropBadge: "ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ",
    distPropTitle: "Επιμεριστική Ιδιότητα ως προς την Πρόσθεση και την Αφαίρεση",
    distPropDesc: "Ο πολλαπλασιασμός ενός αριθμού με ένα άθροισμα (ή διαφορά) επιμερίζεται σε κάθε προσθετέο χωριστά:",
    distPropCondition: "(για β ≥ γ)",
    multLabTitle: "🛠️ Διαδραστικό Εργαστήριο: Γεωμετρική Αναπαράσταση Γινομένου",
    factorA: "Πρώτος Παράγοντας (Γραμμές α)",
    factorB: "Δεύτερος Παράγοντας (Στήλες β)",
    areaCalcTitle: "Υπολογισμός Εμβαδού / Πλήθους:",
    gridTotalText: "τετραγωνικά στοιχεία",
    gridRowsText: "σειρές από",
    gridSquaresText: "τετράγωνα",
    sec3Title: "Δυνάμεις Φυσικών Αριθμών",
    sec3Intro: "Δύναμη με βάση έναν φυσικό αριθμό α και εκθέτη έναν φυσικό αριθμό ν (με ν > 1) είναι το γινόμενο ν παραγόντων ίσων με το α:",
    sec3FactorsCount: "παράγοντες",
    baseDefTitle: "α (Βάση):",
    baseDefDesc: "Ο επαναλαμβανόμενος παράγοντας.",
    expDefTitle: "ν (Εκθέτης):",
    expDefDesc: "Δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.",
    specialCasesTitle: "Ειδικές Συμβάσεις & Δυνάμεις του 10",
    exp1Note: "Εκθέτης 1",
    forNonZeroA: "Για κάθε α ≠ 0",
    forNonZeroN: "Για ν ≠ 0",
    forEveryN: "Για κάθε ν",
    powersOf10Title: "Δυνάμεις του 10:",
    powersOf10Desc: "Το 10<sup>ν</sup> γράφεται ως το 1 ακολουθούμενο από ν μηδενικά.",
    exampleLabel: "Παράδειγμα:",
    powersOf10ExampleText: "10<sup>4</sup> ＝ 10.000 (τέσσερα μηδενικά).",
    powerLabTitle: "🛠️ Διαδραστικό Εργαστήριο: Υπολογισμός & Ανάλυση Δύναμης",
    baseLabel: "Βάση (α)",
    exponentLabel: "Εκθέτης (ν)",
    powerResultBadge: "ΓΡΑΦΗ ΚΑΙ ΑΠΟΤΕΛΕΣΜΑ",
    expansionLabel: "Ανάπτυγμα Γινομένου:",
    zeroExpNote: "1 (εξ ορισμού για βάση διάφορη του 0)",
  },
  en: {
    metaTitle: "Natural Numbers, Multiplication & Powers | 7th Grade",
    metaDescription: "Theory and interactive math labs on natural numbers, multiplication properties, and powers for 7th Grade.",
    backText: "7th Grade",
    actionButton: "Exercises",
    badge: "7TH GRADE • THEORY & LAB",
    mainTitle: "Natural Numbers, Multiplication & Powers",
    mainSubtitle: "Exploring the set of natural numbers, the fundamental properties of multiplication, and compact product notation via powers.",
    sec1Title: "The Concept of Natural Numbers",
    sec1Intro: "Natural numbers are the numbers we use for counting and ordering objects:",
    sec1Bullet1: "The smallest natural number is 0.",
    sec1Bullet2: "There is no greatest natural number; the set ℕ is infinite.",
    sec1Bullet3: "Every natural number has exactly one immediate successor (consecutive number).",
    axisTitle: "REPRESENTATION ON THE NUMBER LINE",
    axisCaption: "Each natural number corresponds to a specific point on the ray starting at 0.",
    sec2Title: "Multiplication & Properties",
    sec2Intro: "Multiplication is the concise form of repeated addition of equal terms:",
    sec2Times: "times",
    prop1Badge: "PROPERTY 1",
    prop1Title: "Commutative",
    prop1Desc: "The order of factors does not change the product:",
    prop2Badge: "PROPERTY 2",
    prop2Title: "Associative",
    prop2Desc: "Factors can be grouped in any order:",
    prop3Badge: "PROPERTY 3",
    prop3Title: "Identity & Zero Element",
    prop3Desc: "Multiplying by 1 leaves the number unchanged, while 0 yields 0:",
    distPropBadge: "FUNDAMENTAL PROPERTY",
    distPropTitle: "Distributive Property over Addition and Subtraction",
    distPropDesc: "Multiplying a number by a sum (or difference) distributes to each term separately:",
    distPropCondition: "(for b ≥ c)",
    multLabTitle: "🛠️ Interactive Lab: Geometric Product Representation",
    factorA: "First Factor (Rows a)",
    factorB: "Second Factor (Columns b)",
    areaCalcTitle: "Area / Count Calculation:",
    gridTotalText: "square units",
    gridRowsText: "rows of",
    gridSquaresText: "squares",
    sec3Title: "Powers of Natural Numbers",
    sec3Intro: "A power with a natural number base a and natural exponent n (with n > 1) is the product of n factors equal to a:",
    sec3FactorsCount: "factors",
    baseDefTitle: "a (Base):",
    baseDefDesc: "The repeated factor.",
    expDefTitle: "n (Exponent):",
    expDefDesc: "Indicates how many times the base is multiplied by itself.",
    specialCasesTitle: "Special Conventions & Powers of 10",
    exp1Note: "Exponent 1",
    forNonZeroA: "For any a ≠ 0",
    forNonZeroN: "For n ≠ 0",
    forEveryN: "For every n",
    powersOf10Title: "Powers of 10:",
    powersOf10Desc: "10<sup>n</sup> is written as 1 followed by n zeros.",
    exampleLabel: "Example:",
    powersOf10ExampleText: "10<sup>4</sup> ＝ 10,000 (four zeros).",
    powerLabTitle: "🛠️ Interactive Lab: Power Calculation & Expansion",
    baseLabel: "Base (a)",
    exponentLabel: "Exponent (n)",
    powerResultBadge: "NOTATION AND RESULT",
    expansionLabel: "Product Expansion:",
    zeroExpNote: "1 (by definition for base other than 0)",
  },
};

export default function FysikoiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για το διαδραστικό εργαστήριο Πολλαπλασιασμού
  const [multA, setMultA] = useState(4);
  const [multB, setMultB] = useState(6);

  // State για το διαδραστικό εργαστήριο Δυνάμεων
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(4);

  // Υπολογισμοί
  const product = useMemo(() => multA * multB, [multA, multB]);
  const powerResult = useMemo(() => Math.pow(base, exponent), [base, exponent]);

  // Παραγωγή ανάλυσης γινομένου για τη δύναμη (π.χ. 3 · 3 · 3 · 3)
  const powerExpansion = useMemo(() => {
    if (exponent === 0) return t.zeroExpNote;
    if (exponent === 1) return `${base}`;
    return Array(exponent).fill(base).join(' · ');
  }, [base, exponent, t.zeroExpNote]);

  // Stepper handlers με αποτροπή propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const formattedPowerResult = powerResult.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/01-fysikoi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>{t.actionButton}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16">
        
        {/* Banner Header - Εναρμονισμένο Indigo με άτονα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ ΤΩΝ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>{locale === 'el' ? 'Φυσικοί αριθμοί' : 'Natural numbers'}</strong> {locale === 'el' ? 'ονομάζονται οι αριθμοί που χρησιμοποιούμε για να απαριθμήσουμε ή να διατάξουμε αντικείμενα:' : 'are the numbers used for counting and ordering objects:'}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-semibold text-center text-base sm:text-xl font-mono">
                ℕ ＝ {'{'} 0, 1, 2, 3, 4, 5, 6, 7, ... {'}'}
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>{t.sec1Bullet1}</li>
                <li>{t.sec1Bullet2}</li>
                <li>{t.sec1Bullet3}</li>
              </ul>
            </div>

            <div className="flex flex-col justify-center bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
                {toCleanUppercase(t.axisTitle)}
              </h3>
              {/* Responsive SVG Axis - no horizontal scroll */}
              <div className="w-full">
                <svg
                  viewBox="0 0 600 90"
                  className="w-full h-auto"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Κύριος Άξονας */}
                  <line x1="20" y1="45" x2="570" y2="45" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="585,45 565,37 565,53" fill="#334155" />

                  {/* Υποδιαιρέσεις & Ετικέτες */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const x = 40 + num * 62;
                    return (
                      <g key={num}>
                        <line x1={x} y1="35" x2={x} y2="55" stroke="#475569" strokeWidth="2.5" />
                        <circle cx={x} cy="45" r="4" fill="#4f46e5" />
                        <text
                          x={x}
                          y="78"
                          textAnchor="middle"
                          fontSize="16"
                          fontWeight="700"
                          fill="#1e293b"
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}
                  <text x="560" y="32" fontSize="14" fontWeight="600" fill="#64748b">
                    +∞
                  </text>
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
                {t.axisCaption}
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΙΔΙΟΤΗΤΕΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              {t.sec2Title}
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t.sec2Intro}{' '}
            <span className="font-bold text-slate-900 font-mono">
              α · β ＝ β ＋ β ＋ ... ＋ β
            </span>{' '}
            <span className="text-slate-600 font-normal">({locale === 'el' ? 'α φορές' : 'a times'})</span>.
          </p>

          {/* Πίνακας Ιδιοτήτων */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">
                {toCleanUppercase(t.prop1Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t.prop1Title}</h3>
              <p className="text-sm sm:text-base text-slate-600">{t.prop1Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center">
                α · β ＝ β · α
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">
                {toCleanUppercase(t.prop2Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t.prop2Title}</h3>
              <p className="text-sm sm:text-base text-slate-600">{t.prop2Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center">
                (α · β) · γ ＝ α · (β · γ)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">
                {toCleanUppercase(t.prop3Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t.prop3Title}</h3>
              <p className="text-sm sm:text-base text-slate-600">{t.prop3Desc}</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center space-y-1">
                <div>α · 1 ＝ α</div>
                <div>α · 0 ＝ 0</div>
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700">
                {toCleanUppercase(t.distPropBadge)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">{t.distPropTitle}</h3>
              <p className="text-sm sm:text-base text-slate-700">{t.distPropDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono font-bold text-slate-900 text-center">
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  α · (β － γ) ＝ α · β － α · γ{' '}
                  <span className="text-xs text-slate-500 font-sans font-normal">{t.distPropCondition}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Πολλαπλασιασμού */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.multLabTitle}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Χειριστήρια Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.factorA}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultA, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      α ＝ {multA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultA, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.factorB}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultB, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      β ＝ {multB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultB, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center space-y-1">
                  <div className="text-xs text-blue-700 font-medium">{t.areaCalcTitle}</div>
                  <div className="text-xl sm:text-2xl font-black text-blue-950 font-mono">
                    {multA} · {multB} ＝ {product}
                  </div>
                </div>
              </div>

              {/* Οπτική Απεικόνιση Πλέγματος (SVG Responsive) */}
              <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center overflow-hidden">
                <div className="w-full max-w-[500px]">
                  <svg
                    viewBox={`0 0 ${multB * 36 + 20} ${multA * 36 + 20}`}
                    className="w-full h-auto max-h-[300px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {Array.from({ length: multA }).map((_, row) =>
                      Array.from({ length: multB }).map((_, col) => (
                        <rect
                          key={`${row}-${col}`}
                          x={10 + col * 36}
                          y={10 + row * 36}
                          width="30"
                          height="30"
                          rx="6"
                          className="fill-sky-400 stroke-sky-200/30 transition-all duration-300"
                          strokeWidth="2"
                        />
                      ))
                    )}
                  </svg>
                </div>
                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center">
                  {locale === 'el' ? (
                    <>
                      Σύνολο: <strong className="text-white font-mono">{product}</strong> {t.gridTotalText} ({multA} {t.gridRowsText} {multB} {t.gridSquaresText}).
                    </>
                  ) : (
                    <>
                      Total: <strong className="text-white font-mono">{product}</strong> {t.gridTotalText} ({multA} {t.gridRowsText} {multB} {t.gridSquaresText}).
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΥΝΑΜΕΙΣ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              {t.sec3Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>{t.sec3Intro}</p>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-950 font-bold text-center text-lg sm:text-2xl font-mono">
                α<sup>ν</sup> ＝ α · α · α · ... · α{' '}
                <span className="text-xs sm:text-sm block font-normal font-sans text-purple-700 mt-1">
                  ({locale === 'el' ? 'ν παράγοντες' : 'n factors'})
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li><strong>{t.baseDefTitle}</strong> {t.baseDefDesc}</li>
                <li><strong>{t.expDefTitle}</strong> {t.expDefDesc}</li>
              </ul>
            </div>

            {/* Ειδικές Περιπτώσεις & Δυνάμεις του 10 */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {t.specialCasesTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">α<sup>1</sup> ＝ α</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">{t.exp1Note}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">α<sup>0</sup> ＝ 1</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">{t.forNonZeroA}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">0<sup>ν</sup> ＝ 0</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">{t.forNonZeroN}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">1<sup>ν</sup> ＝ 1</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">{t.forEveryN}</div>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                <strong>{t.powersOf10Title}</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: t.powersOf10Desc }} />
                <br />
                <em>{t.exampleLabel}</em>{' '}
                <span dangerouslySetInnerHTML={{ __html: t.powersOf10ExampleText }} />
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Δυνάμεων */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.powerLabTitle}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Χειριστήρια Βάσης και Εκθέτη */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.baseLabel}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBase, -1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      α ＝ {base}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBase, 1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.exponentLabel}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, 0, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      ν ＝ {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, 0, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Αποτελέσματος */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-md">
                <div className="text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                    {toCleanUppercase(t.powerResultBadge)}
                  </div>
                  <div className="text-3xl sm:text-5xl font-black font-mono">
                    {base}<sup className="text-amber-400">{exponent}</sup> ＝ {formattedPowerResult}
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 space-y-1">
                  <div className="text-xs text-indigo-200">{t.expansionLabel}</div>
                  <div className="font-mono text-sm sm:text-base text-amber-300 break-words">
                    {powerExpansion}
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