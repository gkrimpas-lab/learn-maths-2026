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

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική γραφή με ασφάλεια overflow
// Υποστηρίζει αριθμούς, strings αλλά και JSX elements (π.χ. <span>α<sup>ν</sup></span>)
function Frac({ num, den, isNeg = false, className = '' }) {
  const isStringOrNumber = (val) => typeof val === 'string' || typeof val === 'number';

  const hasMinus =
    isNeg ||
    (isStringOrNumber(num) && String(num).startsWith('-')) ||
    (isStringOrNumber(den) && String(den).startsWith('-'));

  const renderContent = (val) => {
    if (isStringOrNumber(val)) {
      return String(val).replace(/^-/, '');
    }
    return val;
  };

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-0.5 sm:px-1 border-b border-current w-full text-center break-all">
          {renderContent(num)}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {renderContent(den)}
        </span>
      </span>
    </span>
  );
}

export default function DinamiRitonTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για Εργαστήριο 1: Υπολογιστής Δύναμης Κλάσματος
  const [baseNum, setBaseNum] = useState(-2);
  const [baseDen, setBaseDen] = useState(3);
  const [exponent, setExponent] = useState(3);

  // State για Εργαστήριο 2: Δοκιμαστήριο Ιδιοτήτων
  const [activeProperty, setActiveProperty] = useState('prod-same-base');
  const [propBase, setPropBase] = useState(2);
  const [expM, setExpM] = useState(3);
  const [expN, setExpN] = useState(2);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const isBaseNegative = baseNum < 0;
  const isEvenExp = exponent % 2 === 0;
  const isResultNegative = isBaseNegative && !isEvenExp;

  const powNum = useMemo(() => Math.pow(Math.abs(baseNum), exponent), [baseNum, exponent]);
  const powDen = useMemo(() => Math.pow(baseDen, exponent), [baseDen, exponent]);

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Δυνάμεις Ρητών με Θετικό Εκθέτη | Α' Γυμνασίου",
      pageDesc: "Έννοια της δύναμης ρητών αριθμών με φυσικό εκθέτη, κανόνας προσήμων (άρτιος/περιττός εκθέτης), ιδιότητες δυνάμεων και διαδραστικά εργαστήρια.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 17 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      mainTitle: "Δυνάμεις Ρητών Αριθμών με Θετικό Φυσικό Εκθέτη",
      mainSubtitle: "Μαθαίνουμε την έννοια της δύναμης με βάση ρητό αριθμό και εκθέτη φυσικό μεγαλύτερο από το μηδέν, τη θεμελιώδη σημασία των παρενθέσεων και των προσήμων, καθώς και όλες τις ιδιότητες των δυνάμεων.",

      // Ενότητα 1
      sec1Title: "Ορισμός της Δύναμης",
      sec1DefP1: "Αν",
      sec1DefBase: "α",
      sec1DefP2: "είναι ένας ρητός αριθμός και",
      sec1DefExp: "ν",
      sec1DefP3: "ένας φυσικός αριθμός μεγαλύτερος από το μηδέν (ν ≥ 1), τότε ονομάζουμε",
      sec1DefBold: "δύναμη με βάση α και εκθέτη ν",
      sec1DefP4: "το γινόμενο",
      sec1DefP5: "παραγόντων ίσων με το α:",
      factorsLabel: "παράγοντες",
      bullet1Base: "α:",
      bullet1BaseDesc: "η βάση της δύναμης (οποιοσδήποτε ρητός αριθμός).",
      bullet2Exp: "ν:",
      bullet2ExpDesc: "ο εκθέτης (δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της).",
      bullet3Convention: "Ειδική σύμβαση:",
      bullet3ConventionDesc: "Για κάθε ρητό α ισχύει α¹ ＝ α.",
      boxCardTitle: "ΔΥΝΑΜΗ ΚΛΑΣΜΑΤΟΣ ΚΑΙ ΔΕΚΑΔΙΚΟΥ",
      fracPowTitle: "Δύναμη Κλάσματος:",
      fracPowDesc: "Υψώνουμε ξεχωριστά τον αριθμητή και τον παρονομαστή στον εκθέτη:",
      decPowTitle: "Δύναμη Δεκαδικού Αριθμού:",
      decPowDesc: "Πολλαπλασιάζουμε κανονικά. Το αποτέλεσμα έχει τόσα δεκαδικά ψηφία όσα προκύπτουν από το γινόμενο: (δεκαδικά ψηφία βάσης) · εκθέτης.",
      decExampleText: "0,3² ＝ 0,3 · 0,3 ＝ 0,09  (1 · 2 ＝ 2 δεκαδικά ψηφία)",

      // Ενότητα 2
      sec2Title: "Το Πρόσημο της Δύναμης & Η Μεγάλη Παγίδα των Παρενθέσεων",
      case1Badge: "ΠΕΡΙΠΤΩΣΗ 1",
      case1Title: "Βάση Θετικός Αριθμός (α ＞ 0)",
      case1Desc: "Η δύναμη θετικού αριθμού είναι πάντοτε θετικός αριθμός, ανεξάρτητα από το αν ο εκθέτης είναι άρτιος ή περιττός:",
      case2Badge: "ΠΕΡΙΠΤΩΣΗ 2",
      case2Title: "Βάση Αρνητικός Αριθμός (α ＜ 0)",
      case2Desc: "Το πρόσημο καθορίζεται αποκλειστικά από το αν ο εκθέτης είναι άρτιος ή περιττός:",
      evenLabel: "άρτιος",
      oddLabel: "περιττός",
      warningTitle: "ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ: Η ΣΗΜΑΣΙΑ ΤΩΝ ΠΑΡΕΝΘΕΣΕΩΝ!",
      warningDesc: "Όταν το μείον βρίσκεται μέσα στην παρένθεση, ο εκθέτης εφαρμόζεται και στο πρόσημο. Όταν δεν υπάρχει παρένθεση, ο εκθέτης επηρεάζει μόνο τον αριθμό και το μείον παραμένει μπροστά:",

      // Εργαστήριο 1
      lab1Title: "🛠️ Εργαστήριο 1: Διαδραστικός Υπολογιστής Δύναμης Κλάσματος & Προσήμων",
      labelNumA: "ΑΡΙΘΜΗΤΗΣ (α)",
      labelDenB: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
      labelExpV: "ΕΚΘΕΤΗΣ (ν)",
      lab1ResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΔΥΝΑΜΗΣ",
      badgeNegEven: "ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΑΡΤΙΟ ΕΚΘΕΤΗ ➔ (＋)",
      badgeNegOdd: "ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΠΕΡΙΤΤΟ ΕΚΘΕΤΗ ➔ (－)",
      badgePos: "ΘΕΤΙΚΗ ΒΑΣΗ ➔ (＋)",
      productAnalysisTitle: "Ανάλυση σε γινόμενο:",

      // Ενότητα 3
      sec3Title: "Οι Ιδιότητες των Δυνάμεων",
      prop1Badge: "ΙΔΙΟΤΗΤΑ 1",
      prop1Title: "Γινόμενο Ίδιας Βάσης",
      prop1Desc: "Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες:",
      prop2Badge: "ΙΔΙΟΤΗΤΑ 2",
      prop2Title: "Πηλίκο Ίδιας Βάσης (μ ＞ ν)",
      prop2Desc: "Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες:",
      prop3Badge: "ΙΔΙΟΤΗΤΑ 3",
      prop3Title: "Δύναμη σε Δύναμη",
      prop3Desc: "Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:",
      prop4Badge: "ΙΔΙΟΤΗΤΑ 4",
      prop4Title: "Δύναμη Γινομένου",
      prop4Desc: "Υψώνουμε κάθε παράγοντα ξεχωριστά στον ίδιο εκθέτη:",
      prop5Badge: "ΙΔΙΟΤΗΤΑ 5",
      prop5Title: "Δύναμη Πηλίκου ή Κλάσματος (β ≠ 0)",
      prop5Desc: "Υψώνουμε αριθμητή και παρονομαστή στον κοινό εκθέτη:",

      // Εργαστήριο 2
      lab2Title: "🛠️ Εργαστήριο 2: Δοκιμαστήριο Εφαρμογής Ιδιοτήτων Δυνάμεων",
      tabProd: "ΓΙΝΟΜΕΝΟ ΙΔΙΑΣ ΒΑΣΗΣ (αᵐ · αⁿ)",
      tabQuot: "ΠΗΛΙΚΟ ΙΔΙΑΣ ΒΑΣΗΣ (αᵐ ： αⁿ)",
      tabPow: "ΔΥΝΑΜΗ ΣΕ ΔΥΝΑΜΗ ((αᵐ)ⁿ)",
      labelBaseA: "ΒΑΣΗ (α)",
      labelExpM: "ΕΚΘΕΤΗΣ (μ)",
      labelExpN: "ΕΚΘΕΤΗΣ (ν)",
      lab2AppRule: "ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ ΙΔΙΟΤΗΤΑΣ",
      explProd1: "Κοινή βάση το",
      explProd2: ": Προσθέσαμε τους εκθέτες (",
      explQuot1: "Κοινή βάση το",
      explQuot2: ": Αφαιρέσαμε τους εκθέτες (",
      explPow1: "Δύναμη σε δύναμη: Πολλαπλασιάσαμε τους εκθέτες ("
    },
    en: {
      pageTitle: "Powers of Rational Numbers with Positive Exponent | 7th Grade",
      pageDesc: "Concept of rational number powers with positive natural exponents, sign rules (even/odd exponent), power properties, and interactive labs.",
      backText: "7th Grade",
      btnExercises: "EXERCISES",
      badgeHeader: "7TH GRADE • CHAPTER 17 • THEORY & LAB",
      mainTitle: "Powers of Rational Numbers with Positive Natural Exponent",
      mainSubtitle: "Learn the concept of powers with a rational base and positive natural exponent, the fundamental importance of parentheses and signs, and all power properties.",

      // Section 1
      sec1Title: "Definition of Power",
      sec1DefP1: "If",
      sec1DefBase: "a",
      sec1DefP2: "is a rational number and",
      sec1DefExp: "n",
      sec1DefP3: "is a positive integer (n ≥ 1), we define the",
      sec1DefBold: "power with base a and exponent n",
      sec1DefP4: "as the product of",
      sec1DefP5: "factors equal to a:",
      factorsLabel: "factors",
      bullet1Base: "a:",
      bullet1BaseDesc: "the base of the power (any rational number).",
      bullet2Exp: "n:",
      bullet2ExpDesc: "the exponent (indicates how many times the base is multiplied by itself).",
      bullet3Convention: "Special convention:",
      bullet3ConventionDesc: "For any rational number a, a¹ ＝ a.",
      boxCardTitle: "POWER OF A FRACTION AND DECIMAL",
      fracPowTitle: "Power of a Fraction:",
      fracPowDesc: "Raise the numerator and denominator separately to the exponent:",
      decPowTitle: "Power of a Decimal Number:",
      decPowDesc: "Multiply normally. The result has as many decimal places as given by: (decimal places of base) · exponent.",
      decExampleText: "0.3² ＝ 0.3 · 0.3 ＝ 0.09  (1 · 2 ＝ 2 decimal digits)",

      // Section 2
      sec2Title: "Sign of a Power & The Parentheses Trap",
      case1Badge: "CASE 1",
      case1Title: "Positive Base (a ＞ 0)",
      case1Desc: "A power of a positive number is always positive, regardless of whether the exponent is even or odd:",
      case2Badge: "CASE 2",
      case2Title: "Negative Base (a ＜ 0)",
      case2Desc: "The sign is determined solely by whether the exponent is even or odd:",
      evenLabel: "even",
      oddLabel: "odd",
      warningTitle: "CAUTION: THE IMPORTANCE OF PARENTHESES!",
      warningDesc: "When the minus sign is inside parentheses, the exponent applies to the sign as well. Without parentheses, the exponent affects only the number, leaving the negative sign unchanged:",

      // Lab 1
      lab1Title: "🛠️ Lab 1: Interactive Fraction Power & Sign Calculator",
      labelNumA: "NUMERATOR (a)",
      labelDenB: "DENOMINATOR (b)",
      labelExpV: "EXPONENT (n)",
      lab1ResultTitle: "POWER RESULT",
      badgeNegEven: "NEGATIVE BASE WITH EVEN EXPONENT ➔ (＋)",
      badgeNegOdd: "NEGATIVE BASE WITH ODD EXPONENT ➔ (－)",
      badgePos: "POSITIVE BASE ➔ (＋)",
      productAnalysisTitle: "Product expansion:",

      // Section 3
      sec3Title: "Properties of Powers",
      prop1Badge: "PROPERTY 1",
      prop1Title: "Product of Same Base",
      prop1Desc: "Keep the same base and add the exponents:",
      prop2Badge: "PROPERTY 2",
      prop2Title: "Quotient of Same Base (m ＞ n)",
      prop2Desc: "Keep the same base and subtract the exponents:",
      prop3Badge: "PROPERTY 3",
      prop3Title: "Power of a Power",
      prop3Desc: "Keep the base and multiply the exponents:",
      prop4Badge: "PROPERTY 4",
      prop4Title: "Power of a Product",
      prop4Desc: "Raise each factor separately to the common exponent:",
      prop5Badge: "PROPERTY 5",
      prop5Title: "Power of a Quotient or Fraction (b ≠ 0)",
      prop5Desc: "Raise the numerator and denominator to the common exponent:",

      // Lab 2
      lab2Title: "🛠️ Lab 2: Power Properties Interactive Tester",
      tabProd: "PRODUCT OF SAME BASE (aᵐ · aⁿ)",
      tabQuot: "QUOTIENT OF SAME BASE (aᵐ ： αⁿ)",
      tabPow: "POWER OF A POWER ((aᵐ)ⁿ)",
      labelBaseA: "BASE (a)",
      labelExpM: "EXPONENT (m)",
      labelExpN: "EXPONENT (n)",
      lab2AppRule: "PROPERTY RULE APPLICATION",
      explProd1: "Common base",
      explProd2: ": We added exponents (",
      explQuot1: "Common base",
      explQuot2: ": We subtracted exponents (",
      explPow1: "Power of a power: We multiplied exponents ("
    }
  }[locale];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/19-dinami-riton-ekth-thetikos-ask"
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

        {/* 1. ΟΡΙΣΜΟΣ ΤΗΣ ΔΥΝΑΜΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span className="break-words">
                {toCleanUppercase(t.sec1Title)} ({locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup>)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                {t.sec1DefP1} <strong>{t.sec1DefBase}</strong> {t.sec1DefP2} <strong>{t.sec1DefExp}</strong> {t.sec1DefP3} (<strong>{locale === 'el' ? 'ν ≥ 1' : 'n ≥ 1'}</strong>), {t.sec1DefP4} <strong>{t.sec1DefBold}</strong> {t.sec1DefP5} <strong>{locale === 'el' ? 'ν' : 'n'} {t.factorsLabel}</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-2xl font-mono shadow-sm flex items-center justify-center flex-wrap gap-1">
                <span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup> ＝ {locale === 'el' ? 'α · α · α · ... · α' : 'a · a · a · ... · a'}</span>
                <span className="text-xs sm:text-sm font-sans font-normal text-indigo-800">
                  ({locale === 'el' ? 'ν' : 'n'} {t.factorsLabel})
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>{locale === 'el' ? 'α:' : 'a:'}</strong> {t.bullet1BaseDesc}</li>
                <li><strong>{locale === 'el' ? 'ν:' : 'n:'}</strong> {t.bullet2ExpDesc}</li>
                <li><strong>{t.bullet3Convention}</strong> {locale === 'el' ? 'Για κάθε ρητό α ισχύει α¹ ＝ α.' : 'For any rational number a, a¹ ＝ a.'}</li>
              </ul>
            </div>

            {/* Δύναμη Κλάσματος και Δεκαδικού */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.boxCardTitle)}
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950">{t.fracPowTitle}</div>
                  <p className="text-slate-600">
                    {t.fracPowDesc}
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center pt-1 flex-wrap">
                    <span>(</span>
                    <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                    <span>)<sup>{locale === 'el' ? 'ν' : 'n'}</sup> ＝ </span>
                    <Frac
                      num={<span>{locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>}
                      den={<span>{locale === 'el' ? 'β' : 'b'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup></span>}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-sky-950">{t.decPowTitle}</div>
                  <p className="text-slate-600">
                    {t.decPowDesc}
                  </p>
                  <div className="font-mono text-sky-900 font-bold pt-1 break-words">
                    {locale === 'el' ? (
                      <span>0,3<sup>2</sup> ＝ 0,3 · 0,3 ＝ 0,09 &nbsp; (1 · 2 ＝ 2 δεκαδικά ψηφία)</span>
                    ) : (
                      <span>0.3<sup>2</sup> ＝ 0.3 · 0.3 ＝ 0.09 &nbsp; (1 · 2 ＝ 2 decimal digits)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΙΣ ΔΥΝΑΜΕΙΣ */}
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
            {/* Θετική Βάση */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                  {toCleanUppercase(t.case1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{t.case1Title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.case1Desc}
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center font-bold text-emerald-700 text-base">
                  (＋{locale === 'el' ? 'α' : 'a'})<sup>{locale === 'el' ? 'ν' : 'n'}</sup> ＝ ＋({locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup>)
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div>(＋2)<sup>3</sup> ＝ ＋8</div>
                <div>(＋5)<sup>2</sup> ＝ ＋25</div>
              </div>
            </div>

            {/* Αρνητική Βάση */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                  {toCleanUppercase(t.case2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{t.case2Title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.case2Desc}
                </p>
                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-sky-100 flex items-center justify-between flex-wrap gap-2">
                    <span>(－{locale === 'el' ? 'α' : 'a'})<sup>{t.evenLabel}</sup> ＝ <strong>＋</strong></span>
                    <span className="text-emerald-700 font-bold">(－2)<sup>4</sup> ＝ ＋16</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-sky-100 flex items-center justify-between flex-wrap gap-2">
                    <span>(－{locale === 'el' ? 'α' : 'a'})<sup>{t.oddLabel}</sup> ＝ <strong>－</strong></span>
                    <span className="text-rose-700 font-bold">(－2)<sup>3</sup> ＝ －8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Προσοχή στην παρένθεση */}
          <div className="p-5 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-sm sm:text-base">
              <span>⚠️</span>
              <span className="break-words">{toCleanUppercase(t.warningTitle)}</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              {t.warningDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-emerald-800 break-words">
                (－3)<sup>2</sup> ＝ (－3) · (－3) ＝ ＋9
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-rose-700 break-words">
                －3<sup>2</sup> ＝ －(3 · 3) ＝ －9
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΥΠΟΛΟΓΙΣΤΗΣ ΔΥΝΑΜΗΣ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Αριθμητής Βάσης */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    {toCleanUppercase(t.labelNumA)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {baseNum > 0 ? `＋${baseNum}` : baseNum}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Παρονομαστής Βάσης */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    {toCleanUppercase(t.labelDenB)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {baseDen}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Εκθέτης ν */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-700 uppercase block">
                    {toCleanUppercase(t.labelExpV)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Ανάλυση & Αποτέλεσμα (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1ResultTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    isResultNegative
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {toCleanUppercase(
                      isBaseNegative
                        ? isEvenExp
                          ? t.badgeNegEven
                          : t.badgeNegOdd
                        : t.badgePos
                    )}
                  </span>
                </div>

                {/* Μαθηματική Παράσταση */}
                <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-black py-2 flex-wrap">
                  <div className="inline-flex items-center">
                    <span>(</span>
                    <Frac num={baseNum} den={baseDen} className="text-white text-xl sm:text-3xl" />
                    <span>)<sup>{exponent}</sup></span>
                  </div>
                  <span className="text-indigo-300">＝</span>
                  <div className="inline-flex items-center text-emerald-400">
                    {baseDen === 1 ? (
                      <span>{isResultNegative ? `－${powNum}` : `＋${powNum}`}</span>
                    ) : (
                      <Frac num={powNum} den={powDen} isNeg={isResultNegative} className="text-emerald-400 text-xl sm:text-3xl" />
                    )}
                  </div>
                </div>

                {/* Ανάλυση Παραγόντων */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed space-y-1">
                  <div>
                    <strong>{t.productAnalysisTitle}</strong> ({exponent} {t.factorsLabel})
                  </div>
                  <div className="font-mono text-indigo-200 flex items-center flex-wrap gap-1 text-xs pt-1">
                    {Array.from({ length: exponent }).map((_, i) => (
                      <span key={i} className="inline-flex items-center">
                        (<Frac num={baseNum} den={baseDen} />)
                        {i < exponent - 1 && <span className="mx-1 text-amber-300 font-bold">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΟΙ ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span className="break-words">{toCleanUppercase(t.sec3Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1. Γινόμενο ίδιας βάσης */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.prop1Title}</h3>
                <p className="text-slate-600">{t.prop1Desc}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  {locale === 'el' ? (
                    <span>α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ ＋ ν</sup></span>
                  ) : (
                    <span>a<sup>m</sup> · a<sup>n</sup> ＝ a<sup>m ＋ n</sup></span>
                  )}
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                2<sup>3</sup> · 2<sup>4</sup> ＝ 2<sup>7</sup> ＝ 128
              </div>
            </div>

            {/* 2. Πηλίκο ίδιας βάσης */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.prop2Title}</h3>
                <p className="text-slate-600">{t.prop2Desc}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  {locale === 'el' ? (
                    <span>α<sup>μ</sup> ： α<sup>ν</sup> ＝ α<sup>μ － ν</sup></span>
                  ) : (
                    <span>a<sup>m</sup> ： a<sup>n</sup> ＝ a<sup>m － n</sup></span>
                  )}
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                3<sup>5</sup> ： 3<sup>2</sup> ＝ 3<sup>3</sup> ＝ 27
              </div>
            </div>

            {/* 3. Δύναμη σε δύναμη */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.prop3Title}</h3>
                <p className="text-slate-600">{t.prop3Desc}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  {locale === 'el' ? (
                    <span>(α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ · ν</sup></span>
                  ) : (
                    <span>(a<sup>m</sup>)<sup>n</sup> ＝ a<sup>m · n</sup></span>
                  )}
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                (2<sup>2</sup>)<sup>3</sup> ＝ 2<sup>6</sup> ＝ 64
              </div>
            </div>

            {/* 4. Δύναμη γινομένου */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop4Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.prop4Title}</h3>
                <p className="text-slate-600">{t.prop4Desc}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  {locale === 'el' ? (
                    <span>(α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup></span>
                  ) : (
                    <span>(a · b)<sup>n</sup> ＝ a<sup>n</sup> · b<sup>n</sup></span>
                  )}
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                (2 · 5)<sup>2</sup> ＝ 2<sup>2</sup> · 5<sup>2</sup> ＝ 4 · 25 ＝ 100
              </div>
            </div>

            {/* 5. Δύναμη πηλίκου / κλάσματος */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  {toCleanUppercase(t.prop5Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.prop5Title}</h3>
                <p className="text-slate-600">{t.prop5Desc}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm flex items-center justify-center gap-2 flex-wrap">
                  {locale === 'el' ? (
                    <>
                      <span>(α ： β)<sup>ν</sup> ＝ α<sup>ν</sup> ： β<sup>ν</sup> &nbsp; ⟺ &nbsp;</span>
                      <span className="inline-flex items-center">
                        (<Frac num="α" den="β" />)<sup>ν</sup> ＝{' '}
                        <Frac num={<span>α<sup>ν</sup></span>} den={<span>β<sup>ν</sup></span>} />
                      </span>
                    </>
                  ) : (
                    <>
                      <span>(a ： b)<sup>n</sup> ＝ a<sup>n</sup> ： b<sup>n</sup> &nbsp; ⟺ &nbsp;</span>
                      <span className="inline-flex items-center">
                        (<Frac num="a" den="b" />)<sup>n</sup> ＝{' '}
                        <Frac num={<span>a<sup>n</sup></span>} den={<span>b<sup>n</sup></span>} />
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100 flex items-center justify-center gap-1.5 flex-wrap">
                <span>(<Frac num="2" den="3" />)<sup>3</sup></span>
                <span>＝</span>
                <Frac num={<span>2<sup>3</sup></span>} den={<span>3<sup>3</sup></span>} />
                <span>＝</span>
                <Frac num="8" den="27" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΟΚΙΜΑΣΤΗΡΙΟ ΙΔΙΟΤΗΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            {/* Tabs Επιλογής Ιδιότητας */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'prod-same-base', label: t.tabProd },
                { id: 'quot-same-base', label: t.tabQuot },
                { id: 'pow-to-pow', label: t.tabPow },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveProperty(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm break-words ${
                    activeProperty === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {toCleanUppercase(tab.label)}
                </button>
              ))}
            </div>

            {/* Χειριστήρια & Προβολή */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    {toCleanUppercase(t.labelBaseA)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropBase, -1, 2, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {propBase}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropBase, 1, 2, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">
                    {toCleanUppercase(t.labelExpM)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpM, -1, activeProperty === 'quot-same-base' ? expN + 1 : 1, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {expM}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpM, 1, activeProperty === 'quot-same-base' ? expN + 1 : 1, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-sky-700 uppercase block mb-1">
                    {toCleanUppercase(t.labelExpN)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpN, -1, 1, activeProperty === 'quot-same-base' ? expM - 1 : 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                      {expN}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpN, 1, 1, activeProperty === 'quot-same-base' ? expM - 1 : 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.lab2AppRule)}
                </div>

                {activeProperty === 'prod-same-base' && (
                  <div className="space-y-2">
                    <div className="text-xl sm:text-3xl font-black text-amber-300 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>{propBase}<sup>{expM}</sup> · {propBase}<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} ＋ {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM + expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM + expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 break-words">
                      {t.explProd1} {propBase}{t.explProd2}{expM} ＋ {expN} ＝ {expM + expN}).
                    </p>
                  </div>
                )}

                {activeProperty === 'quot-same-base' && (
                  <div className="space-y-2">
                    <div className="text-xl sm:text-3xl font-black text-amber-300 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>{propBase}<sup>{expM}</sup> ： {propBase}<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} － {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM - expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM - expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 break-words">
                      {t.explQuot1} {propBase}{t.explQuot2}{expM} － {expN} ＝ {expM - expN}).
                    </p>
                  </div>
                )}

                {activeProperty === 'pow-to-pow' && (
                  <div className="space-y-2">
                    <div className="text-xl sm:text-3xl font-black text-amber-300 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>({propBase}<sup>{expM}</sup>)<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} · {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM * expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM * expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 break-words">
                      {t.explPow1}{expM} · {expN} ＝ {expM * expN}).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}