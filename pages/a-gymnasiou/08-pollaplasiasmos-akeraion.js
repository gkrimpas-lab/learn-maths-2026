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
    metaTitle: "Πολλαπλασιασμός Ακεραίων Αριθμών | Α' Γυμνασίου",
    metaDescription: "Θεωρία, κανόνας προσήμων, ιδιότητες και διαδραστικό εργαστήριο γινομένου πολλών παραγόντων για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Πολλαπλασιασμός Ακέραιων Αριθμών",
    heroDesc: "Μαθαίνουμε τον κανόνα των προσήμων για ομόσημους και ετερόσημους αριθμούς, τις βασικές ιδιότητες και πώς υπολογίζουμε το πρόσημο σε γινόμενα πολλών παραγόντων.",
    sec1Title: "Ο Κανόνας των Προσήμων (Γινόμενο Δύο Ακεραίων)",
    ruleIntro: "Για να πολλαπλασιάσουμε δύο ακέραιους αριθμούς, πολλαπλασιάζουμε τις απόλυτες τιμές τους και καθορίζουμε το πρόσημο σύμφωνα με τον παρακάτω κανόνα:",
    sameSignBadge: "ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ (＋)",
    sameSignDesc: "Το γινόμενο δύο ομόσημων αριθμών είναι πάντοτε θετικός αριθμός.",
    diffSignBadge: "ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ (－)",
    diffSignDesc: "Το γινόμενο δύο ετερόσημων αριθμών είναι πάντοτε αρνητικός αριθμός.",
    examplesBadge: "ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΠΑΡΑΔΕΙΓΜΑΤΑ",
    summaryRuleTitle: "Συνοπτικός Κανόνας:",
    summaryRuleDesc: "Ίδια πρόσημα δίνουν συν (＋), διαφορετικά πρόσημα δίνουν πλην (－).",
    lab2Title: "🛠️ Διαδραστικό Εργαστήριο: Γινόμενο Δύο Ακεραίων",
    factorAControl: "1ΟΣ ΠΑΡΑΓΟΝΤΑΣ (α)",
    factorBControl: "2ΟΣ ΠΑΡΑΓΟΝΤΑΣ (β)",
    signAnalysisBadge: "ΑΝΑΛΥΣΗ ΠΡΟΣΗΜΟΥ",
    ruleSameBadge: "ΟΜΟΣΗΜΟΙ (ΠΡΟΣΗΜΟ ＋)",
    ruleDiffBadge: "ΕΤΕΡΟΣΗΜΟΙ (ΠΡΟΣΗΜΟ －)",
    ruleZeroBadge: "ΜΗΔΕΝΙΚΟΣ ΠΑΡΑΓΟΝΤΑΣ",
    explSame: "Οι αριθμοί έχουν το ίδιο πρόσημο. Το γινόμενο είναι θετικό:",
    explDiff: "Οι αριθμοί έχουν διαφορετικά πρόσημα. Το γινόμενο είναι αρνητικό:",
    explZero: "Ένας τουλάχιστον παράγοντας είναι 0, επομένως το γινόμενο ισούται με 0.",
    sec2Title: "Ιδιότητες του Πολλαπλασιασμού",
    prop1Badge: "ΙΔΙΟΤΗΤΑ 1",
    prop1Title: "Αντιμεταθετική",
    prop1Desc: "Η σειρά των παραγόντων δεν αλλάζει το γινόμενο:",
    prop2Badge: "ΙΔΙΟΤΗΤΑ 2",
    prop2Title: "Προσεταιριστική",
    prop2Desc: "Μπορούμε να ομαδοποιήσουμε ελεύθερα τους παράγοντες:",
    prop3Badge: "ΙΔΙΟΤΗΤΑ 3",
    prop3Title: "Ουδέτερο & Μηδενικό Στοιχείο",
    prop3Desc: "Το 1 διατηρεί τον αριθμό, ενώ το 0 μηδενίζει το γινόμενο:",
    propDistBadge: "ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ",
    propDistTitle: "Επιμεριστική Ιδιότητα ως προς την Πρόσθεση και την Αφαίρεση",
    propDistDesc: "Ο πολλαπλασιασμός ενός αριθμού με άθροισμα ή διαφορά επιμερίζεται σε κάθε όρο:",
    sec3Title: "Γινόμενο Πολλών Παραγόντων (Γενικό Συμπέρασμα)",
    multiIntro: "Σε ένα γινόμενο πολλών παραγόντων, αν έστω και ένας παράγοντας είναι μηδέν, το γινόμενο είναι μηδέν. Αν όλοι οι παράγοντες είναι διάφοροι του μηδενός, το τελικό πρόσημο καθορίζεται αποκλειστικά από το πλήθος των αρνητικών παραγόντων:",
    evenNegTitle: "Άρτιο Πλήθος Αρνητικών → Πρόσημο Θετικό (＋)",
    evenNegDesc: "Αν οι αρνητικοί παράγοντες είναι 0, 2, 4, 6... (άρτιο πλήθος), τα μείον ανά δύο γίνονται συν και το αποτέλεσμα είναι θετικό.",
    oddNegTitle: "Περιττό Πλήθος Αρνητικών → Πρόσημο Αρνητικό (－)",
    oddNegDesc: "Αν οι αρνητικοί παράγοντες είναι 1, 3, 5, 7... (περιττό πλήθος), περισσεύει ένα μείον και το αποτέλεσμα είναι αρνητικό.",
    countExamplesBadge: "ΠΑΡΑΔΕΙΓΜΑΤΑ ΕΛΕΓΧΟΥ ΠΛΗΘΟΥΣ",
    ex1Note: "Έχει 2 αρνητικούς (άρτιο πλήθος) → Θετικό (＋).",
    ex2Note: "Έχει 3 αρνητικούς (περιττό πλήθος) → Αρνητικό (－).",
    ex3Note: "Περιέχει το 0 → Το γινόμενο μηδενίζεται άμεσα.",
    multiLabTitle: "🛠️ Διαδραστικό Εργαστήριο: Γινόμενο Πολλών Παραγόντων",
    removeFactorBtn: "ΑΦΑΙΡΕΣΗ ΟΡΟΥ",
    addFactorBtn: "＋ ΠΡΟΣΘΗΚΗ ΟΡΟΥ",
    multiLabPrompt: "Πάτησε στο κουμπί «ΑΛΛΑΓΗ ΠΡΟΣΗΜΟΥ» κάτω από κάθε αριθμό για να δεις πώς αλλάζει το συνολικό πρόσημο:",
    termWord: "ΟΣ ΟΡΟΣ",
    zeroBtnText: "ΜΗΔΕΝ (0)",
    minusBtnText: "ΠΛΗΝ (－)",
    plusBtnText: "ΣΥΝ (＋)",
    negCountTitle: "ΚΑΤΑΜΕΤΡΗΣΗ ΑΡΝΗΤΙΚΩΝ ΠΑΡΑΓΟΝΤΩΝ",
    hasZeroMsg: "Περιέχει μηδενικό παράγοντα (0)",
    negCountMsgPart1: "Πλήθος Αρνητικών:",
    negCountEvenMsg: "Άρτιο πλήθος → Θετικό",
    negCountOddMsg: "Περιττό πλήθος → Αρνητικό",
    resZeroBadge: "ΜΗΔΕΝ (0)",
    resPosBadge: "ΘΕΤΙΚΟ (＋)",
    resNegBadge: "ΑΡΝΗΤΙΚΟ (－)",
  },
  en: {
    metaTitle: "Multiplying Integers | 7th Grade Mathematics",
    metaDescription: "Theory, sign rule, properties and interactive multi-factor product lab for 7th grade integers.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Multiplication of Integers",
    heroDesc: "Learn the rule of signs for numbers with identical and different signs, fundamental properties, and how to determine the overall sign in multi-factor products.",
    sec1Title: "The Rule of Signs (Product of Two Integers)",
    ruleIntro: "To multiply two integers, we multiply their absolute values and determine the resulting sign according to the following rule:",
    sameSignBadge: "SAME SIGN NUMBERS (＋)",
    sameSignDesc: "The product of two numbers with identical signs is always a positive number.",
    diffSignBadge: "DIFFERENT SIGN NUMBERS (－)",
    diffSignDesc: "The product of two numbers with opposite signs is always a negative number.",
    examplesBadge: "CORE EXAMPLES",
    summaryRuleTitle: "Summary Rule:",
    summaryRuleDesc: "Matching signs yield plus (＋), different signs yield minus (－).",
    lab2Title: "🛠️ Interactive Lab: Product of Two Integers",
    factorAControl: "1ST FACTOR (a)",
    factorBControl: "2ND FACTOR (b)",
    signAnalysisBadge: "SIGN ANALYSIS",
    ruleSameBadge: "SAME SIGN (SIGN ＋)",
    ruleDiffBadge: "DIFFERENT SIGNS (SIGN －)",
    ruleZeroBadge: "ZERO FACTOR",
    explSame: "The numbers share the same sign. The product is positive:",
    explDiff: "The numbers have different signs. The product is negative:",
    explZero: "At least one factor is 0, so the product equals 0.",
    sec2Title: "Properties of Multiplication",
    prop1Badge: "PROPERTY 1",
    prop1Title: "Commutative",
    prop1Desc: "The order of factors does not change the product:",
    prop2Badge: "PROPERTY 2",
    prop2Title: "Associative",
    prop2Desc: "Factors can be grouped in any order without changing the product:",
    prop3Badge: "PROPERTY 3",
    prop3Title: "Identity & Zero Element",
    prop3Desc: "The number 1 preserves the value, while 0 renders the product zero:",
    propDistBadge: "FUNDAMENTAL PROPERTY",
    propDistTitle: "Distributive Property over Addition and Subtraction",
    propDistDesc: "Multiplying a number by a sum or difference distributes across every term:",
    sec3Title: "Product of Multiple Factors (General Theorem)",
    multiIntro: "In a product with multiple factors, if any factor is zero, the entire product is zero. If all factors are non-zero, the final sign is governed exclusively by the count of negative factors:",
    evenNegTitle: "Even Number of Negatives → Positive Sign (＋)",
    evenNegDesc: "If the count of negative factors is 0, 2, 4, 6... (even count), pairs of minuses become plus and the product is positive.",
    oddNegTitle: "Odd Number of Negatives → Negative Sign (－)",
    oddNegDesc: "If the count of negative factors is 1, 3, 5, 7... (odd count), an unpaired minus remains and the product is negative.",
    countExamplesBadge: "COUNT VERIFICATION EXAMPLES",
    ex1Note: "Contains 2 negative factors (even count) → Positive (＋).",
    ex2Note: "Contains 3 negative factors (odd count) → Negative (－).",
    ex3Note: "Contains 0 → The product evaluates immediately to 0.",
    multiLabTitle: "🛠️ Interactive Lab: Multi-Factor Product",
    removeFactorBtn: "REMOVE TERM",
    addFactorBtn: "＋ ADD TERM",
    multiLabPrompt: "Click the 'SIGN TOGGLE' button below each term to observe how the overall product sign updates:",
    termWord: "TH TERM",
    zeroBtnText: "ZERO (0)",
    minusBtnText: "MINUS (－)",
    plusBtnText: "PLUS (＋)",
    negCountTitle: "NEGATIVE FACTOR COUNT",
    hasZeroMsg: "Contains a zero factor (0)",
    negCountMsgPart1: "Negative Count:",
    negCountEvenMsg: "Even count → Positive",
    negCountOddMsg: "Odd count → Negative",
    resZeroBadge: "ZERO (0)",
    resPosBadge: "POSITIVE (＋)",
    resNegBadge: "NEGATIVE (－)",
  }
};

export default function PollaplasiasmosAkeraionTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // State για το διαδραστικό εργαστήριο γινομένου 2 ακεραίων
  const [factorA, setFactorA] = useState(-3);
  const [factorB, setFactorB] = useState(4);

  // State για το διαδραστικό εργαλείο γινομένου πολλών παραγόντων
  const [multiFactors, setMultiFactors] = useState([-2, 3, -1, -4]);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const product2 = useMemo(() => factorA * factorB, [factorA, factorB]);
  const absA = useMemo(() => Math.abs(factorA), [factorA]);
  const absB = useMemo(() => Math.abs(factorB), [factorB]);

  const ruleType = useMemo(() => {
    if (factorA === 0 || factorB === 0) return 'zero';
    if ((factorA > 0 && factorB > 0) || (factorA < 0 && factorB < 0)) return 'same';
    return 'diff';
  }, [factorA, factorB]);

  const multiProduct = useMemo(() => {
    return multiFactors.reduce((acc, curr) => acc * curr, 1);
  }, [multiFactors]);

  const negativeCount = useMemo(() => {
    return multiFactors.filter((x) => x < 0).length;
  }, [multiFactors]);

  const hasZero = useMemo(() => {
    return multiFactors.some((x) => x === 0);
  }, [multiFactors]);

  const toggleFactorSign = (idx) => {
    setMultiFactors((prev) => {
      const next = [...prev];
      next[idx] = -next[idx];
      return next;
    });
  };

  const stepFactorValue = (idx, delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMultiFactors((prev) => {
      const next = [...prev];
      const updated = Math.max(-9, Math.min(9, next[idx] + delta));
      next[idx] = updated;
      return next;
    });
  };

  const addFactor = () => {
    if (multiFactors.length < 6) {
      setMultiFactors((prev) => [...prev, -2]);
    }
  };

  const removeFactor = () => {
    if (multiFactors.length > 2) {
      setMultiFactors((prev) => prev.slice(0, -1));
    }
  };

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

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/08-pollaplasiasmos-akeraion-ask"
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

        {/* 1. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ */}
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
                {t.ruleIntro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <div className="text-[11px] sm:text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    {toCleanUppercase(t.sameSignBadge)}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-emerald-950 space-y-1">
                    <div className="break-words [overflow-wrap:anywhere]">(＋) · (＋) ＝ ＋</div>
                    <div className="break-words [overflow-wrap:anywhere]">(－) · (－) ＝ ＋</div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.sameSignDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                  <div className="text-[11px] sm:text-xs font-bold uppercase text-rose-800 tracking-wider">
                    {toCleanUppercase(t.diffSignBadge)}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-rose-950 space-y-1">
                    <div className="break-words [overflow-wrap:anywhere]">(＋) · (－) ＝ －</div>
                    <div className="break-words [overflow-wrap:anywhere]">(－) · (＋) ＝ －</div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.diffSignDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Πρακτικά Παραδείγματα */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.examplesBadge)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  (＋4) · (＋6) ＝ ＋24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  (－4) · (－6) ＝ ＋24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  (＋4) · (－6) ＝ －24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                  (－4) · (＋6) ＝ －24
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-sans break-words [overflow-wrap:anywhere]">
                <strong>{t.summaryRuleTitle}</strong> {t.summaryRuleDesc}
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 2 Αριθμών */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full min-w-0">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.factorAControl)}
                  </label>
                  <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorA, -1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Decrease factorA"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                      α ＝ {formatSigned(factorA)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorA, 1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Increase factorA"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.factorBControl)}
                  </label>
                  <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorB, -1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Decrease factorB"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                      β ＝ {formatSigned(factorB)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorB, 1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Increase factorB"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος 2 Αριθμών */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md w-full min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold">
                    {toCleanUppercase(t.signAnalysisBadge)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border break-words [overflow-wrap:anywhere] ${
                      ruleType === 'same'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : ruleType === 'diff'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                        : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                    }`}
                  >
                    {toCleanUppercase(
                      ruleType === 'same'
                        ? t.ruleSameBadge
                        : ruleType === 'diff'
                        ? t.ruleDiffBadge
                        : t.ruleZeroBadge
                    )}
                  </span>
                </div>

                <div className="text-xl sm:text-3xl md:text-4xl font-black font-mono inline-flex flex-wrap items-center max-w-full gap-1.5 break-words [overflow-wrap:anywhere]">
                  <span>{formatSignedParen(factorA)}</span>
                  <span>·</span>
                  <span>{formatSignedParen(factorB)}</span>
                  <span>＝</span>
                  <span className={product2 > 0 ? 'text-emerald-400' : product2 < 0 ? 'text-rose-400' : 'text-slate-300'}>
                    {formatSigned(product2)}
                  </span>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 font-sans break-words [overflow-wrap:anywhere]">
                  {ruleType === 'same' && (
                    <span>
                      {t.explSame} ＋({absA} · {absB}) ＝ ＋{absA * absB}.
                    </span>
                  )}
                  {ruleType === 'diff' && (
                    <span>
                      {t.explDiff} －({absA} · {absB}) ＝ －{absA * absB}.
                    </span>
                  )}
                  {ruleType === 'zero' && <span>{t.explZero}</span>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop1Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop1Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop1Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                α · β ＝ β · α
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop2Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop2Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop2Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs sm:text-sm break-words [overflow-wrap:anywhere]">
                (α · β) · γ ＝ α · (β · γ)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-600">{toCleanUppercase(t.prop3Badge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.prop3Title}</h3>
              <p className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">{t.prop3Desc}</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div className="break-words [overflow-wrap:anywhere]">α · 1 ＝ α</div>
                <div className="break-words [overflow-wrap:anywhere]">α · 0 ＝ 0</div>
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3 p-4 sm:p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <div className="text-[10px] sm:text-xs uppercase font-bold text-indigo-800">{toCleanUppercase(t.propDistBadge)}</div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-lg">
                {t.propDistTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 break-words [overflow-wrap:anywhere]">
                {t.propDistDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono font-bold text-slate-900 text-center text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-indigo-100 break-words [overflow-wrap:anywhere]">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 break-words [overflow-wrap:anywhere]">
                  α · (β － γ) ＝ α · β － α · γ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΠΑΡΑΓΟΝΤΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.multiIntro}
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 text-xs sm:text-sm md:text-base break-words [overflow-wrap:anywhere]">
                    {t.evenNegTitle}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.evenNegDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
                  <div className="font-bold text-rose-900 text-xs sm:text-sm md:text-base break-words [overflow-wrap:anywhere]">
                    {t.oddNegTitle}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.oddNegDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.countExamplesBadge)}
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold break-words [overflow-wrap:anywhere]">
                    (－2) · (＋3) · (－4) ＝ ＋24
                  </div>
                  <div className="text-[11px] sm:text-xs font-sans text-emerald-700 break-words [overflow-wrap:anywhere]">
                    {t.ex1Note}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold break-words [overflow-wrap:anywhere]">
                    (－2) · (－3) · (－4) ＝ －24
                  </div>
                  <div className="text-[11px] sm:text-xs font-sans text-rose-700 break-words [overflow-wrap:anywhere]">
                    {t.ex2Note}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold break-words [overflow-wrap:anywhere]">
                    (－5) · (＋8) · 0 · (－9) ＝ 0
                  </div>
                  <div className="text-[11px] sm:text-xs font-sans text-slate-600 break-words [overflow-wrap:anywhere]">
                    {t.ex3Note}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαλείο Πολλών Παραγόντων */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.multiLabTitle}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={removeFactor}
                  disabled={multiFactors.length <= 2}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 disabled:opacity-40 transition touch-manipulation"
                >
                  {toCleanUppercase(t.removeFactorBtn)}
                </button>
                <button
                  type="button"
                  onClick={addFactor}
                  disabled={multiFactors.length >= 6}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40 transition touch-manipulation"
                >
                  {toCleanUppercase(t.addFactorBtn)}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
              {t.multiLabPrompt}
            </p>

            {/* Κάρτες Παραγόντων Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {multiFactors.map((val, idx) => {
                const isNeg = val < 0;
                const isZero = val === 0;
                return (
                  <div
                    key={idx}
                    className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col items-center justify-between space-y-2.5 transition-all min-w-0 max-w-full overflow-hidden ${
                      isZero
                        ? 'bg-slate-100 border-slate-300'
                        : isNeg
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-sky-50/70 border-sky-200'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {idx + 1}{t.termWord}
                    </div>

                    {/* Stepper τιμής */}
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-8 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => stepFactorValue(idx, -1, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-100 active:scale-95 touch-manipulation"
                        aria-label={`Decrease factor ${idx + 1}`}
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-black text-xs sm:text-sm font-mono whitespace-nowrap px-1 overflow-hidden">
                        {formatSigned(val)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => stepFactorValue(idx, 1, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-100 active:scale-95 touch-manipulation"
                        aria-label={`Increase factor ${idx + 1}`}
                      >
                        ＋
                      </button>
                    </div>

                    {/* Toggle προσήμου */}
                    <button
                      type="button"
                      onClick={() => toggleFactorSign(idx)}
                      disabled={isZero}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation ${
                        isZero
                          ? 'bg-slate-300 text-slate-700'
                          : isNeg
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {toCleanUppercase(
                        isZero
                          ? t.zeroBtnText
                          : isNeg
                          ? t.minusBtnText
                          : t.plusBtnText
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Πίνακας Συνολικής Κατάστασης */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 min-w-0 max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[10px] sm:text-xs uppercase text-slate-400 font-bold tracking-wider">
                    {toCleanUppercase(t.negCountTitle)}
                  </div>
                  <div className="text-xs sm:text-base font-bold text-amber-300 break-words [overflow-wrap:anywhere]">
                    {hasZero
                      ? t.hasZeroMsg
                      : `${t.negCountMsgPart1} ${negativeCount} (${
                          negativeCount % 2 === 0
                            ? t.negCountEvenMsg
                            : t.negCountOddMsg
                        })`}
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border shrink-0 ${
                    hasZero
                      ? 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                      : multiProduct > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}
                >
                  {toCleanUppercase(
                    hasZero
                      ? t.resZeroBadge
                      : multiProduct > 0
                      ? t.resPosBadge
                      : t.resNegBadge
                  )}
                </div>
              </div>

              {/* Έκφραση και Αποτέλεσμα */}
              <div className="text-center space-y-2 min-w-0">
                <div className="font-mono text-xs sm:text-sm text-slate-300 inline-flex flex-wrap items-center justify-center max-w-full gap-1 break-words [overflow-wrap:anywhere]">
                  {multiFactors.map((x, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span>·</span>}
                      <span>{formatSignedParen(x)}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black font-mono break-words [overflow-wrap:anywhere]">
                  ＝{' '}
                  <span className={hasZero ? 'text-slate-300' : multiProduct > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {hasZero
                      ? '0'
                      : multiProduct > 0
                      ? `＋${formatLocaleNumber(multiProduct)}`
                      : `－${formatLocaleNumber(Math.abs(multiProduct))}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}