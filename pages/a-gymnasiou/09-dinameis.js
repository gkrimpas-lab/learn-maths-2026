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
    metaTitle: "Δυνάμεις Ακεραίων Αριθμών | Α' Γυμνασίου",
    metaDescription: "Θεωρία, κανόνες προσήμου με άρτιο και περιττό εκθέτη, ιδιότητες δυνάμεων και διαδραστικό εργαστήριο για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Δυνάμεις Ακέραιων Αριθμών",
    heroDesc: "Εξερευνούμε τη δύναμη με θετική και αρνητική βάση, τον ρόλο του άρτιου και περιττού εκθέτη, τη σημασία των παρενθέσεων και τις θεμελιώδεις ιδιότητες των δυνάμεων.",
    sec1Title: "Έννοια Δύναμης & Κανόνες Προσήμου",
    powerDefP1: "Δύναμη με βάση έναν ακέραιο αριθμό α και εκθέτη έναν φυσικό αριθμό ν > 1 είναι το γινόμενο ν ίσων παραγόντων:",
    factorsNote: "παράγοντες",
    powerDefP2: "Το πρόσημο του αποτελέσματος εξαρτάται άμεσα από τη βάση και από το αν ο εκθέτης είναι άρτιος ή περιττός.",
    posBaseBadge: "ΘΕΤΙΚΗ ΒΑΣΗ (ΠΑΝΤΑ ΘΕΤΙΚΟ)",
    posBaseDesc: "Αν η βάση είναι θετική, η δύναμη είναι πάντοτε θετική, ανεξάρτητα από τον εκθέτη:",
    negBaseEvenBadge: "ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΑΡΤΙΟ ΕΚΘΕΤΗ → ΘΕΤΙΚΟ (＋)",
    negBaseEvenDesc: "Τα αρνητικά πρόσημα είναι άρτιο πλήθος και ανά ζεύγη δίνουν συν:",
    negBaseOddBadge: "ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΠΕΡΙΤΤΟ ΕΚΘΕΤΗ → ΑΡΝΗΤΙΚΟ (－)",
    negBaseOddDesc: "Τα αρνητικά πρόσημα είναι περιττό πλήθος και περισσεύει ένα πλην:",
    warningTitle: "ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΡΕΝΘΕΣΕΙΣ",
    warningHeader: "Η Διαφορά μεταξύ (－α)<sup>ν</sup> και －α<sup>ν</sup>",
    withParensDesc: "Η παρένθεση δείχνει ότι ο εκθέτης 2 επηρεάζει και το πρόσημο μείον: (－3) · (－3) ＝ ＋9.",
    withoutParensDesc: "Χωρίς παρένθεση, ο εκθέτης επηρεάζει μόνο το 3, ενώ το μείον παραμένει μπροστά: －(3 · 3) ＝ －9.",
    sec2Title: "Διαδραστικό Εργαστήριο: Υπολογισμός & Ανάλυση Δύναμης",
    baseControl: "ΒΑΣΗ (α)",
    exponentControl: "ΕΚΘΕΤΗΣ (ν)",
    expTypeLabel: "ΤΥΠΟΣ ΕΚΘΕΤΗ:",
    expZero: "Μηδενικός εκθέτης",
    expEven: "Άρτιος εκθέτης (ζυγός)",
    expOdd: "Περιττός εκθέτης (μονός)",
    calcWithParensBadge: "ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΠΑΡΕΝΘΕΣΗ",
    resPosBadge: "ΘΕΤΙΚΟ (＋)",
    resNegBadge: "ΑΡΝΗΤΙΚΟ (－)",
    resZeroBadge: "ΜΗΔΕΝ (0)",
    expansionLabel: "ΑΝΑΠΤΥΓΜΑ ΓΙΝΟΜΕΝΟΥ:",
    expZeroDef: "1 (εξ ορισμού για κάθε βάση διάφορη του 0)",
    counterExampleLabel: "Αντιπαράδειγμα χωρίς παρένθεση:",
    sec3Title: "Ιδιότητες των Δυνάμεων",
    prop1Badge: "ΙΔΙΟΤΗΤΑ 1",
    prop1Title: "Γινόμενο Δυνάμεων με την Ίδια Βάση",
    prop1Desc: "Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες:",
    prop2Badge: "ΙΔΙΟΤΗΤΑ 2",
    prop2Title: "Πηλίκο Δυνάμεων με την Ίδια Βάση",
    prop2Desc: "Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες (μ ≥ ν, α ≠ 0):",
    prop3Badge: "ΙΔΙΟΤΗΤΑ 3",
    prop3Title: "Δύναμη σε Δύναμη",
    prop3Desc: "Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:",
    prop4Badge: "ΙΔΙΟΤΗΤΑ 4",
    prop4Title: "Δύναμη Γινομένου",
    prop4Desc: "Υψώνουμε κάθε παράγοντα στον εκθέτη:",
    conventionExp1: "Εκθέτης 1",
    conventionForNonZero: "Για α ≠ 0",
    conventionEvenNeg: "Άρτιο πλήθος",
    conventionOddNeg: "Περιττό πλήθος",
  },
  en: {
    metaTitle: "Powers of Integers | 7th Grade Mathematics",
    metaDescription: "Theory, sign rules for even and odd exponents, power properties and interactive lab for 7th grade integers.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Powers of Integers",
    heroDesc: "Explore powers with positive and negative bases, the decisive role of even and odd exponents, the crucial importance of parentheses, and fundamental exponent properties.",
    sec1Title: "Concept of Power & Sign Rules",
    powerDefP1: "A power with an integer base a and a natural exponent n > 1 represents the product of n identical factors:",
    factorsNote: "factors",
    powerDefP2: "The sign of the resulting value depends directly on the base and whether the exponent is even or odd.",
    posBaseBadge: "POSITIVE BASE (ALWAYS POSITIVE)",
    posBaseDesc: "If the base is positive, the power is always positive, regardless of the exponent:",
    negBaseEvenBadge: "NEGATIVE BASE WITH EVEN EXPONENT → POSITIVE (＋)",
    negBaseEvenDesc: "Negative factors appear an even number of times and pair up to yield positive:",
    negBaseOddBadge: "NEGATIVE BASE WITH ODD EXPONENT → NEGATIVE (－)",
    negBaseOddDesc: "Negative factors appear an odd number of times, leaving an unpaired negative:",
    warningTitle: "CRITICAL ATTENTION TO PARENTHESES",
    warningHeader: "The Difference between (－a)<sup>n</sup> and －a<sup>n</sup>",
    withParensDesc: "Parentheses denote that exponent 2 applies to both the sign and the number: (－3) · (－3) ＝ ＋9.",
    withoutParensDesc: "Without parentheses, the exponent affects only the 3, while the negative sign remains outside: －(3 · 3) ＝ －9.",
    sec2Title: "Interactive Lab: Power Calculation & Analysis",
    baseControl: "BASE (a)",
    exponentControl: "EXPONENT (n)",
    expTypeLabel: "EXPONENT TYPE:",
    expZero: "Zero exponent",
    expEven: "Even exponent",
    expOdd: "Odd exponent",
    calcWithParensBadge: "CALCULATION WITH PARENTHESES",
    resPosBadge: "POSITIVE (＋)",
    resNegBadge: "NEGATIVE (－)",
    resZeroBadge: "ZERO (0)",
    expansionLabel: "PRODUCT EXPANSION:",
    expZeroDef: "1 (by definition for any non-zero base)",
    counterExampleLabel: "Counter-example without parentheses:",
    sec3Title: "Properties of Powers",
    prop1Badge: "PROPERTY 1",
    prop1Title: "Product of Powers with the Same Base",
    prop1Desc: "Keep the base and add the exponents:",
    prop2Badge: "PROPERTY 2",
    prop2Title: "Quotient of Powers with the Same Base",
    prop2Desc: "Keep the base and subtract the exponents (m ≥ n, a ≠ 0):",
    prop3Badge: "PROPERTY 3",
    prop3Title: "Power of a Power",
    prop3Desc: "Keep the base and multiply the exponents:",
    prop4Badge: "PROPERTY 4",
    prop4Title: "Power of a Product",
    prop4Desc: "Raise each factor to the exponent:",
    conventionExp1: "Exponent 1",
    conventionForNonZero: "For a ≠ 0",
    conventionEvenNeg: "Even count",
    conventionOddNeg: "Odd count",
  }
};

export default function DinameisTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [base, setBase] = useState(-2);
  const [exponent, setExponent] = useState(4);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const powerWithParens = useMemo(() => {
    if (exponent === 0) return 1;
    return Math.pow(base, exponent);
  }, [base, exponent]);

  const powerWithoutParens = useMemo(() => {
    if (base >= 0) return Math.pow(base, exponent);
    return -Math.pow(Math.abs(base), exponent);
  }, [base, exponent]);

  const formatSigned = (val) => {
    if (val > 0) return `＋${val}`;
    if (val < 0) return `－${Math.abs(val)}`;
    return '0';
  };

  const formatSignedParen = (val) => {
    if (val > 0) return `(＋${val})`;
    if (val < 0) return `(－${Math.abs(val)})`;
    return '0';
  };

  const formatLocaleNumber = (val) => {
    const loc = locale === 'en' ? 'en-US' : 'el-GR';
    return val.toLocaleString(loc);
  };

  const expansionStr = useMemo(() => {
    if (exponent === 0) return t.expZeroDef;
    const single = formatSignedParen(base);
    if (exponent === 1) return single;
    return Array(exponent).fill(single).join(' · ');
  }, [base, exponent, t]);

  const isEvenExp = exponent % 2 === 0;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/09-dinameis-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ ΤΗΣ ΔΥΝΑΜΗΣ & ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΟΥ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.powerDefP1}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-lg md:text-xl font-mono shadow-sm break-words [overflow-wrap:anywhere]">
                α<sup>ν</sup> ＝ α · α · α · ... · α <span className="text-[11px] sm:text-xs font-normal text-indigo-700 block mt-1">({locale === 'en' ? 'n' : 'ν'} {t.factorsNote})</span>
              </div>
              <p className="text-slate-600 text-[11px] sm:text-xs md:text-sm break-words [overflow-wrap:anywhere]">
                {t.powerDefP2}
              </p>
            </div>

            {/* Κανόνες Προσήμου */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="text-[11px] sm:text-xs font-bold uppercase text-emerald-800 tracking-wider">
                  {toCleanUppercase(t.posBaseBadge)}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                  {t.posBaseDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-950 break-words [overflow-wrap:anywhere]">
                  (＋3)<sup>2</sup> ＝ ＋9 | (＋2)<sup>3</sup> ＝ ＋8
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                <div className="text-[11px] sm:text-xs font-bold uppercase text-indigo-800 tracking-wider">
                  {toCleanUppercase(t.negBaseEvenBadge)}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                  {t.negBaseEvenDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-950 break-words [overflow-wrap:anywhere]">
                  (－2)<sup>4</sup> ＝ (－2) · (－2) · (－2) · (－2) ＝ <strong>＋16</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5">
                <div className="text-[11px] sm:text-xs font-bold uppercase text-rose-800 tracking-wider">
                  {toCleanUppercase(t.negBaseOddBadge)}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                  {t.negBaseOddDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-rose-950 break-words [overflow-wrap:anywhere]">
                  (－2)<sup>3</sup> ＝ (－2) · (－2) · (－2) ＝ <strong>－8</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Προσοχή στις Παρενθέσεις */}
          <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="text-[11px] sm:text-xs font-bold uppercase text-amber-800 tracking-wider">
              {toCleanUppercase(t.warningTitle)}
            </div>
            <h3
              className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: t.warningHeader }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-indigo-900 font-mono text-sm">(－3)<sup>2</sup> ＝ ＋9</div>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.withParensDesc}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-rose-900 font-mono text-sm">－3<sup>2</sup> ＝ －9</div>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.withoutParensDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΥΝΑΜΗΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Steppers Ελέγχου Βάσης και Εκθέτη */}
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.baseControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBase, -1, -5, 5, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease base"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                    α ＝ {formatSigned(base)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBase, 1, -5, 5, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.exponentControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setExponent, -1, 0, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease exponent"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                    {locale === 'en' ? 'n' : 'ν'} ＝ {exponent}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setExponent, 1, 0, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase exponent"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500 font-bold uppercase text-[10px]">{toCleanUppercase(t.expTypeLabel)}</div>
                <div className="font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                  {exponent === 0 ? t.expZero : isEvenExp ? t.expEven : t.expOdd}
                </div>
              </div>
            </div>

            {/* Κάρτα Αποτελέσματος Δύναμης */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md w-full min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  {toCleanUppercase(t.calcWithParensBadge)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border shrink-0 ${
                    powerWithParens > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : powerWithParens < 0
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                  }`}
                >
                  {toCleanUppercase(
                    powerWithParens > 0
                      ? t.resPosBadge
                      : powerWithParens < 0
                      ? t.resNegBadge
                      : t.resZeroBadge
                  )}
                </span>
              </div>

              <div className="text-2xl sm:text-4xl font-black font-mono inline-flex flex-wrap items-center max-w-full gap-1.5 break-words [overflow-wrap:anywhere]">
                <span>{formatSignedParen(base)}<sup>{exponent}</sup></span>
                <span>＝</span>
                <span className={powerWithParens > 0 ? 'text-emerald-400' : powerWithParens < 0 ? 'text-rose-400' : 'text-slate-300'}>
                  {powerWithParens > 0
                    ? `＋${formatLocaleNumber(powerWithParens)}`
                    : formatLocaleNumber(powerWithParens)}
                </span>
              </div>

              {/* Ανάπτυγμα */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1 min-w-0">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-200 font-bold">
                  {toCleanUppercase(t.expansionLabel)}
                </div>
                <div className="font-mono text-xs sm:text-sm text-amber-300 break-words [overflow-wrap:anywhere]">
                  {expansionStr}
                </div>
              </div>

              {/* Σύγκριση με τη γραφή χωρίς παρένθεση (για αρνητική βάση) */}
              {base < 0 && exponent > 0 && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="break-words [overflow-wrap:anywhere]">{t.counterExampleLabel}</span>
                  <span className="font-mono font-bold text-amber-400 break-words [overflow-wrap:anywhere]">
                    －{Math.abs(base)}<sup>{exponent}</sup> ＝ {formatLocaleNumber(powerWithoutParens)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-slate-700 text-xs sm:text-sm">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop1Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop1Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop1Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                α<sup>{locale === 'en' ? 'm' : 'μ'}</sup> · α<sup>{locale === 'en' ? 'n' : 'ν'}</sup> ＝ α<sup>{locale === 'en' ? 'm ＋ n' : 'μ ＋ ν'}</sup>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-mono text-center break-words [overflow-wrap:anywhere]">
                (－2)<sup>2</sup> · (－2)<sup>3</sup> ＝ (－2)<sup>5</sup> ＝ －32
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop2Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop2Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop2Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                α<sup>{locale === 'en' ? 'm' : 'μ'}</sup> ： α<sup>{locale === 'en' ? 'n' : 'ν'}</sup> ＝ α<sup>{locale === 'en' ? 'm － n' : 'μ － ν'}</sup>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-mono text-center break-words [overflow-wrap:anywhere]">
                (＋3)<sup>5</sup> ： (＋3)<sup>2</sup> ＝ (＋3)<sup>3</sup> ＝ ＋27
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop3Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop3Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop3Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                (α<sup>{locale === 'en' ? 'm' : 'μ'}</sup>)<sup>{locale === 'en' ? 'n' : 'ν'}</sup> ＝ α<sup>{locale === 'en' ? 'm · n' : 'μ · ν'}</sup>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-mono text-center break-words [overflow-wrap:anywhere]">
                [ (－2)<sup>2</sup> ]<sup>3</sup> ＝ (－2)<sup>6</sup> ＝ ＋64
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop4Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop4Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop4Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                (α · β)<sup>{locale === 'en' ? 'n' : 'ν'}</sup> ＝ α<sup>{locale === 'en' ? 'n' : 'ν'}</sup> · β<sup>{locale === 'en' ? 'n' : 'ν'}</sup>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-mono text-center break-words [overflow-wrap:anywhere]">
                [ (－2) · (＋5) ]<sup>2</sup> ＝ (－2)<sup>2</sup> · (＋5)<sup>2</sup> ＝ 4 · 25 ＝ 100
              </div>
            </div>
          </div>

          {/* Ειδικές Συμβάσεις */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900 break-words [overflow-wrap:anywhere]">α<sup>1</sup> ＝ α</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-0.5">{t.conventionExp1}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900 break-words [overflow-wrap:anywhere]">α<sup>0</sup> ＝ 1</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-0.5">{t.conventionForNonZero}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900 break-words [overflow-wrap:anywhere]">
                (－1)<sup>{locale === 'en' ? 'even' : 'άρτιος'}</sup> ＝ ＋1
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-0.5">{t.conventionEvenNeg}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900 break-words [overflow-wrap:anywhere]">
                (－1)<sup>{locale === 'en' ? 'odd' : 'περιττός'}</sup> ＝ －1
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-0.5">{t.conventionOddNeg}</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}