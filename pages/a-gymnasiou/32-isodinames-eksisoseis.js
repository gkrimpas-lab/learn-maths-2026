import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα ελληνικά κεφαλαία (διατηρείται μόνο το Α')
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

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική μορφή (Mobile safe, no overflow)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
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

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Ισοδύναμες Εξισώσεις & Επίλυση | Α' Γυμνασίου",
    pageDescription: "Ισοδύναμες εξισώσεις, κανόνες πρόσθεσης, αφαίρεσης, πολλαπλασιασμού και διαίρεσης, μεταφορά όρων και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 28 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Ισοδύναμες Εξισώσεις & Κανόνες Επίλυσης",
    mainSubtitle: "Μαθαίνουμε πότε δύο εξισώσεις είναι ισοδύναμες, πώς εφαρμόζουμε τις ιδιότητες της ισότητας και πώς χρησιμοποιούμε τον κανόνα της μεταφοράς όρων για να βρίσκουμε τη λύση.",

    // Section 1
    sec1Title: "Η Έννοια των Ισοδύναμων Εξισώσεων",
    sec1P1: "Δύο εξισώσεις με τον ίδιο άγνωστο ονομάζονται ισοδύναμες όταν έχουν ακριβώς τις ίδιες λύσεις (ή ρίζες).",
    sec1EgTitle: "Για παράδειγμα, οι εξισώσεις:",
    sec1EgEquivNote: "είναι όλες ισοδύναμες μεταξύ τους, γιατί έχουν μοναδική κοινή λύση τον αριθμό x ＝ 3.",
    sec1GoalTitle: "Ο ΣΤΟΧΟΣ ΤΗΣ ΕΠΙΛΥΣΗΣ",
    sec1GoalP1: "Όταν λύνουμε μια εξίσωση, δεν μαντεύουμε! Ξεκινάμε από μια αρχική σύνθετη εξίσωση και, εφαρμόζοντας κανόνες, παράγουμε διαδοχικά απλούστερες ισοδύναμες εξισώσεις, μέχρι να φτάσουμε στην τελική απλή μορφή:",
    sec1TargetFormat: "x ＝ (αριθμός)",

    // Section 2
    sec2Title: "Οι Ιδιότητες της Ισότητας (Κανόνες Μετασχηματισμού)",
    rule1Badge: "ΚΑΝΟΝΑΣ 1",
    rule1Title: "Πρόσθεση ή Αφαίρεση του ίδιου Αριθμού",
    rule1P1: "Αν προσθέσουμε ή αφαιρέσουμε τον ίδιο αριθμό και από τα δύο μέλη μιας εξίσωσης, προκύπτει μια ισοδύναμη εξίσωση:",
    rule1Condition: "Αν α ＝ β, τότε:",
    rule1FormulaAdd: "α ＋ γ ＝ β ＋ γ",
    rule1And: "και",
    rule1FormulaSub: "α － γ ＝ β － γ",
    rule1Tip: "💡 Πρακτικός Κανόνας Μεταφοράς Όρων: Μπορούμε να μεταφέρουμε έναν όρο από το ένα μέλος στο άλλο, αλλάζοντας το πρόσημό του!",

    rule2Badge: "ΚΑΝΟΝΑΣ 2",
    rule2Title: "Πολλαπλασιασμός & Διαίρεση με Μη Μηδενικό Αριθμό",
    rule2P1: "Αν πολλαπλασιάσουμε ή διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με τον ίδιο αριθμό (διάφορο του μηδενός), προκύπτει μια ισοδύναμη εξίσωση:",
    rule2Condition: "Αν α ＝ β και γ ≠ 0, τότε:",
    rule2Mult: "α · γ ＝ β · γ",
    rule2DivLabel: "και",
    rule2Tip: "💡 Απομόνωση του x: Στο τέλος διαιρούμε και τα δύο μέλη με τον συντελεστή του αγνώστου (σε μορφή κλάσματος) για να μείνει μόνο του το x!",

    // Section 3 (Lab 1)
    lab1Heading: "🛠️ Εργαστήριο 1: Διαδραστική Μεταφορά Όρων",
    coeffALabel: "ΣΥΝΤΕΛΕΣΤΗΣ (α)",
    constBLabel: "ΣΤΑΘΕΡΟΣ (β)",
    targetCLabel: "2Ο ΜΕΛΟΣ (γ)",
    chainTitle: "ΑΛΥΣΙΔΑ ΙΣΟΔΥΝΑΜΙΩΝ",
    methodBadge: "ΜΕΤΑΦΟΡΑ & ΔΙΑΙΡΕΣΗ",
    initEqLabel: "Αρχική Εξίσωση:",
    step1Desc: "Βήμα 1: Μεταφορά του σταθερού όρου στο 2ο μέλος (αλλάζει πρόσημο):",
    step2Desc: (coeff) => `Βήμα 2: Διαίρεση και των δύο μελών με τον συντελεστή του x (${coeff}):`,
    finalRootLabel: "ΤΕΛΙΚΗ ΙΣΟΔΥΝΑΜΗ ΕΞΙΣΩΣΗ (ΡΙΖΑ):",

    // Section 4 (Lab 2)
    lab2Heading: "🛠️ Εργαστήριο 2: Πλήρης Επίλυση & Επαλήθευση",
    verifyTitle: "ΕΠΑΛΗΘΕΥΣΗ ΣΤΟ 1Ο ΜΕΛΟΣ",
    rootBadge: (val) => `ΡΙΖΑ: x ＝ ${val}`,
    substituteTitle: (val) => `Αντικαθιστούμε το x ＝ ${val} στην αρχική εξίσωση:`,
    lhsLabel: "1ο Μέλος",
    verifySuccessSummary: (val) => `Το 1ο μέλος ισούται με το 2ο μέλος (${val} ＝ ${val}), άρα η λύση είναι 100% σωστή!`
  },
  en: {
    pageTitle: "Equivalent Equations & Solving Rules | Grade 7 Math",
    pageDescription: "Equivalent equations, addition, subtraction, multiplication and division rules, transposing terms and interactive laboratories.",
    backText: "Grade 7 Math",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 28 • THEORY & LAB",
    mainTitle: "Equivalent Equations & Solving Rules",
    mainSubtitle: "Learn when two equations are equivalent, apply algebraic properties of equality, and master the term transposition rule to find exact solutions.",

    // Section 1
    sec1Title: "The Concept of Equivalent Equations",
    sec1P1: "Two equations with the same variable are called equivalent when they have exactly the same solutions (or roots).",
    sec1EgTitle: "For instance, the equations:",
    sec1EgEquivNote: "are all equivalent to each other, because they share the exact same unique solution x ＝ 3.",
    sec1GoalTitle: "THE OBJECTIVE OF EQUATION SOLVING",
    sec1GoalP1: "When solving an equation, we do not guess! We begin with an initial equation and systematically apply properties to produce simpler equivalent equations until reaching the isolated form:",
    sec1TargetFormat: "x ＝ (number)",

    // Section 2
    sec2Title: "Properties of Equality (Transformation Rules)",
    rule1Badge: "RULE 1",
    rule1Title: "Adding or Subtracting the Same Quantity",
    rule1P1: "If we add or subtract the same number from both sides of an equation, an equivalent equation is obtained:",
    rule1Condition: "If a ＝ b, then:",
    rule1FormulaAdd: "a ＋ c ＝ b ＋ c",
    rule1And: "and",
    rule1FormulaSub: "a － c ＝ b － c",
    rule1Tip: "💡 Practical Transposition Rule: We can move any term to the opposite side by reversing its sign!",

    rule2Badge: "RULE 2",
    rule2Title: "Multiplying & Dividing by a Non-Zero Quantity",
    rule2P1: "If we multiply or divide both sides of an equation by the same non-zero number, an equivalent equation is obtained:",
    rule2Condition: "If a ＝ b and c ≠ 0, then:",
    rule2Mult: "a · c ＝ b · c",
    rule2DivLabel: "and",
    rule2Tip: "💡 Isolating x: In the final step, divide both sides by the coefficient of x (written as a fraction) to isolate x completely!",

    // Section 3 (Lab 1)
    lab1Heading: "🛠️ Lab 1: Interactive Term Transposition",
    coeffALabel: "COEFFICIENT (a)",
    constBLabel: "CONSTANT (b)",
    targetCLabel: "2ND SIDE (c)",
    chainTitle: "EQUIVALENCE CHAIN",
    methodBadge: "TRANSPOSITION & DIVISION",
    initEqLabel: "Initial Equation:",
    step1Desc: "Step 1: Transpose constant term to right-hand side (reversing sign):",
    step2Desc: (coeff) => `Step 2: Divide both sides by the coefficient of x (${coeff}):`,
    finalRootLabel: "FINAL EQUIVALENT EQUATION (ROOT):",

    // Section 4 (Lab 2)
    lab2Heading: "🛠️ Lab 2: Full Solution & Verification",
    verifyTitle: "VERIFICATION IN LHS",
    rootBadge: (val) => `ROOT: x ＝ ${val}`,
    substituteTitle: (val) => `Substitute x ＝ ${val} into the initial equation:`,
    lhsLabel: "LHS",
    verifySuccessSummary: (val) => `The LHS matches the RHS (${val} ＝ ${val}), proving the solution is 100% correct!`
  }
};

export default function IsodinamesEksisoseisTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // State για Εργαστήριο 1: Διαδραστική Μεταφορά Όρων & Ισοδύναμες Μορφές
  // Αρχική εξίσωση: a*x + b = c
  const [initA, setInitA] = useState(3);
  const [initB, setInitB] = useState(5);
  const [initC, setInitC] = useState(17);

  // State για Εργαστήριο 2: Επίλυση Βήμα-Βήμα με τις Ιδιότητες Ισότητας
  const [stepA, setStepA] = useState(2);
  const [stepB, setStepB] = useState(6);
  const [stepC, setStepC] = useState(14);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1:
  // a*x + b = c  <=>  a*x = c - b  <=>  x = (c - b) / a
  const diffRight = useMemo(() => initC - initB, [initC, initB]);
  const rootValue = useMemo(() => {
    if (initA === 0) return null;
    return Number((diffRight / initA).toFixed(2));
  }, [diffRight, initA]);

  // Υπολογισμοί Εργαστηρίου 2:
  const stepDiff = useMemo(() => stepC - stepB, [stepC, stepB]);
  const stepRoot = useMemo(() => {
    if (stepA === 0) return null;
    return Number((stepDiff / stepA).toFixed(2));
  }, [stepDiff, stepA]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/32-isodinames-eksisoseis-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ ΙΣΟΔΥΝΑΜΕΣ ΕΞΙΣΩΣΕΙΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {locale === 'el' ? (
                  <>Δύο εξισώσεις με τον ίδιο άγνωστο ονομάζονται <strong>ισοδύναμες</strong> όταν έχουν <strong>ακριβώς τις ίδιες λύσεις (ή ρίζες)</strong>.</>
                ) : (
                  <>Two equations with the same variable are called <strong>equivalent</strong> when they have <strong>exactly the same solutions (or roots)</strong>.</>
                )}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-xs sm:text-sm space-y-2 break-words [overflow-wrap:anywhere]">
                <div>{t.sec1EgTitle}</div>
                <div className="font-mono text-sm sm:text-base text-indigo-900">2 · x ＋ 4 ＝ 10</div>
                <div className="font-mono text-sm sm:text-base text-indigo-900">2 · x ＝ 6</div>
                <div className="font-mono text-sm sm:text-base text-indigo-900">x ＝ 3</div>
                <div className="text-slate-600 pt-1 font-sans leading-relaxed">
                  {locale === 'el' ? (
                    <>είναι όλες <strong>ισοδύναμες</strong> μεταξύ τους, γιατί έχουν μοναδική κοινή λύση τον αριθμό <strong className="font-mono text-indigo-900">x ＝ 3</strong>.</>
                  ) : (
                    <>are all <strong>equivalent</strong> to each other, because they share the exact same unique solution <strong className="font-mono text-indigo-900">x ＝ 3</strong>.</>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.sec1GoalTitle)}
              </div>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {locale === 'el' ? (
                  <>Όταν λύνουμε μια εξίσωση, δεν μαντεύουμε! Ξεκινάμε από μια αρχική σύνθετη εξίσωση και, εφαρμόζοντας κανόνες, παράγουμε διαδοχικά απλούστερες <strong>ισοδύναμες εξισώσεις</strong>, μέχρι να φτάσουμε στην τελική απλή μορφή:</>
                ) : (
                  <>When solving an equation, we do not guess! We start from an initial compound equation and systematically apply rules to generate simpler <strong>equivalent equations</strong> until reaching the final form:</>
                )}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-700 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.sec1TargetFormat}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΙ ΒΑΣΙΚΟΙ ΚΑΝΟΝΕΣ & ΙΔΙΟΤΗΤΕΣ ΙΣΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Ιδιότητα Πρόσθεσης / Αφαίρεσης */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rule1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                  {t.rule1Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.rule1P1}
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-200 font-mono text-center font-bold text-indigo-900 text-xs sm:text-sm space-y-1.5 break-words [overflow-wrap:anywhere]">
                  <div>{t.rule1Condition}</div>
                  <div className="inline-flex flex-wrap items-center justify-center gap-2">
                    <span>{t.rule1FormulaAdd}</span>
                    <span className="font-sans text-xs text-slate-500">{t.rule1And}</span>
                    <span>{t.rule1FormulaSub}</span>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-indigo-100 font-sans text-xs text-indigo-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.rule1Tip}
              </div>
            </div>

            {/* Ιδιότητα Πολλαπλασιασμού / Διαίρεσης (Μορφή Κλάσματος) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rule2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                  {t.rule2Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.rule2P1}
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-900 text-xs sm:text-sm space-y-2 break-words [overflow-wrap:anywhere]">
                  <div>{t.rule2Condition}</div>
                  <div className="inline-flex flex-wrap items-center justify-center gap-2">
                    <span>{t.rule2Mult}</span>
                    <span className="font-sans text-xs text-slate-500">{t.rule2DivLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'γ' : 'c'} />
                      <span>＝</span>
                      <Frac num={locale === 'el' ? 'β' : 'b'} den={locale === 'el' ? 'γ' : 'c'} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-100 font-sans text-xs text-amber-950 font-medium break-words [overflow-wrap:anywhere]">
                {t.rule2Tip}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΦΟΡΑ ΟΡΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.lab1Heading}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.coeffALabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitA, -1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {formatNumber(initA)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitA, 1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.constBLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitB, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {initB > 0 ? `＋${formatNumber(initB)}` : formatNumber(initB)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitB, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.targetCLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitC, -1, 0, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {formatNumber(initC)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitC, 1, 0, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Ανάλυση Βημάτων (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.chainTitle)}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                  {toCleanUppercase(t.methodBadge)}
                </span>
              </div>

              {/* Βήμα 1: Αρχική */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-400 font-bold">{t.initEqLabel}</div>
                <div className="font-mono text-sm sm:text-base font-bold text-amber-300 inline-flex flex-wrap items-center gap-1">
                  <span>{initA}x {initB >= 0 ? `＋ ${initB}` : `－ ${Math.abs(initB)}`} ＝ {initC}</span>
                </div>
              </div>

              {/* Βήμα 2: Μεταφορά */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5">
                <div className="text-slate-300 font-bold break-words [overflow-wrap:anywhere]">
                  {t.step1Desc}
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-indigo-200 inline-flex flex-wrap items-center gap-1">
                  <span>{initA}x ＝ {initC} {initB >= 0 ? `－ ${initB}` : `＋ ${Math.abs(initB)}`}</span>
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-slate-300 inline-flex flex-wrap items-center gap-1">
                  <span>{initA}x ＝ {diffRight}</span>
                </div>
              </div>

              {/* Βήμα 3: Διαίρεση σε μορφή κλάσματος */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5">
                <div className="text-slate-300 font-bold break-words [overflow-wrap:anywhere]">
                  {t.step2Desc(initA)}
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-indigo-200 inline-flex flex-wrap items-center gap-1">
                  <span>x ＝ </span>
                  <Frac num={diffRight} den={initA} />
                </div>
              </div>

              {/* Τελική Λύση */}
              <div className="p-3.5 sm:p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                <span className="text-xs sm:text-sm font-bold">
                  {toCleanUppercase(t.finalRootLabel)}
                </span>
                <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-emerald-400 break-words [overflow-wrap:anywhere]">
                  x ＝ {formatNumber(rootValue)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΕΡΓΑΣΤΗΡΙΟ 2: ΒΗΜΑ-ΒΗΜΑ ΕΠΙΛΥΣΗ ΜΕ ΕΠΑΛΗΘΕΥΣΗ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.lab2Heading}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.coeffALabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepA, -1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {formatNumber(stepA)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepA, 1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.constBLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepB, -1, -20, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {stepB > 0 ? `＋${formatNumber(stepB)}` : formatNumber(stepB)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepB, 1, -20, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.targetCLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepC, -1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {formatNumber(stepC)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepC, 1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Πίνακας Επαλήθευσης (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.verifyTitle)}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                  {toCleanUppercase(t.rootBadge(formatNumber(stepRoot)))}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-2 text-slate-200 break-words [overflow-wrap:anywhere]">
                <div className="font-bold text-amber-300">
                  {t.substituteTitle(formatNumber(stepRoot))}
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-indigo-200 inline-flex flex-wrap items-center gap-1">
                  <span>{t.lhsLabel} ＝ {stepA} · ({formatNumber(stepRoot)}) {stepB >= 0 ? `＋ ${stepB}` : `－ ${Math.abs(stepB)}`}</span>
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-emerald-400 font-bold inline-flex flex-wrap items-center gap-1">
                  <span>＝ {formatNumber(Number((stepA * stepRoot).toFixed(2)))} {stepB >= 0 ? `＋ ${stepB}` : `－ ${Math.abs(stepB)}`} ＝ {formatNumber(stepC)}</span>
                </div>
                <div className="text-slate-300 pt-1.5 border-t border-white/10 text-xs leading-relaxed">
                  {t.verifySuccessSummary(formatNumber(stepC))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}