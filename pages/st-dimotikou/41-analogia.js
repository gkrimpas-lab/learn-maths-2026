// pages/st-dimotikou/41-analogia.js
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  MIN_VAL: 1,
  MAX_VAL: 30
};

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια γραμμή
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Βοηθητική συνάρτηση ΜΚΔ
function getGCD(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Λεξικό i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Αναλογίες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για την έννοια της αναλογίας, τη βασική ιδιότητα των χιαστί γινομένων, την εύρεση άγνωστου όρου και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 41 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Έννοια της Αναλογίας",
    heroDesc: "Ανακαλύπτουμε τι είναι η αναλογία, ποια είναι τα άκρα και ποια τα μέσα, πώς εφαρμόζουμε τη βασική ιδιότητα των ίσων σταυρωτών γινομένων (χιαστί) και πώς υπολογίζουμε άμεσα έναν άγνωστο όρο.",
    heroFeature: "Θεωρία & Δυναμικός Έλεγχος Σταυρωτών Γινομένων",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 4 Βήματα",
    theorySubtitle: "Η μαθηματική δομή της αναλογίας, η σχέση των όρων της και ο κανόνας επίλυσης προβλημάτων.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι Αναλογία;",
    step1Text: "Αναλογία ονομάζεται η ισότητα δύο λόγων. Όταν δύο λόγοι έχουν την ίδια ακριβώς τιμή, λέμε ότι σχηματίζουν αναλογία.",
    step1Notation: "Συμβολισμός & Μορφές:",
    step1Or: "ή",
    step1Pronounce: "Διαβάζεται: «Το α προς το β ισούται με το γ προς το δ».",
    step1Tip: "💡 Μια ισότητα δύο λόγων είναι αληθής αναλογία μόνο όταν οι δύο λόγοι δίνουν ακριβώς το ίδιο πηλίκο διαίρεσης!",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Ονοματολογία",
    step2Title: "Άκροι και Μέσοι Όροι",
    step2Text: "Στην αναλογία α : β ＝ γ : δ, οι τέσσερις αριθμοί έχουν συγκεκριμένες θέσεις και ονομασίες:",
    step2ExtremesLabel: "Άκροι όροι:",
    step2ExtremesVal: "α  και  δ",
    step2MeansLabel: "Μέσοι όροι:",
    step2MeansVal: "β  και  γ",
    step2FractionalNote: (
      <>
        Στην κλασματική μορφή <Fraction num="α" den="β" /> ＝ <Fraction num="γ" den="δ" /> τα άκρα είναι διαγώνια (<strong>α</strong>, <strong>δ</strong>) και τα μέσα διαγώνια (<strong>β</strong>, <strong>γ</strong>).
      </>
    ),
    step2Tip: "⚡ Τα άκρα βρίσκονται στις εξωτερικές θέσεις και τα μέσα στο εσωτερικό της αναλογίας.",
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Βασική Ιδιότητα",
    step3Title: "Σταυρωτά Γινόμενα (Χιαστί)",
    step3Text: "Σε κάθε αναλογία, το γινόμενο των άκρων όρων είναι ίσο με το γινόμενο των μέσων όρων:",
    step3Formula: "α · δ ＝ β · γ",
    step3ExampleIntro: (
      <>
        Παράδειγμα για <Fraction num="2" den="3" /> ＝ <Fraction num="6" den="9" />:
      </>
    ),
    step3ExtremesCalc: "• Γινόμενο άκρων: 2 · 9 ＝ 18",
    step3MeansCalc: "• Γινόμενο μέσων: 3 · 6 ＝ 18",
    step3Tip: "🎯 Αν τα σταυρωτά γινόμενα δεν είναι ίσα, τότε οι δύο λόγοι δεν σχηματίζουν αναλογία!",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Επίλυση",
    step4Title: "Εύρεση Άγνωστου Όρου",
    step4Text: (
      <>
        Αν σε μια αναλογία γνωρίζουμε τους τρεις όρους, βρίσκουμε άμεσα τον τέταρτο άγνωστο όρο (<strong>x</strong>):
      </>
    ),
    step4Rule: "x ＝ (γινόμενο γνωστών) : (απέναντι όρος)",
    step4Example: (
      <>
        Αν <Fraction num="2" den="5" /> ＝ <Fraction num="6" den="x" />, τότε:<br />
        <span className="font-mono font-bold">x ＝ (5 · 6) : 2 ＝ 30 : 2 ＝ 15</span>.
      </>
    ),
    step4Tip: "🚀 Αυτός ο κανόνας αποτελεί τη βάση για όλα τα προβλήματα ποσών και τιμών.",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Αναλυτής Αναλογίας & Σταυρωτά Γινόμενα",
    lab1Subtitle: "Ρυθμίστε τους τέσσερις όρους για να διερευνήσετε αν σχηματίζουν αναλογία και να δείτε σε πραγματικό χρόνο τα σταυρωτά γινόμενα (χιαστί).",
    termALabel: "ΟΡΟΣ α (ΑΚΡΟΣ)",
    termBLabel: "ΟΡΟΣ β (ΜΕΣΟΣ)",
    termCLabel: "ΟΡΟΣ γ (ΜΕΣΟΣ)",
    termDLabel: "ΟΡΟΣ δ (ΑΚΡΟΣ)",
    crossCheckHeader: "ΕΛΕΓΧΟΣ ΣΤΑΥΡΩΤΩΝ ΓΙΝΟΜΕΝΩΝ (ΧΙΑΣΤΙ)",
    crossCheckFormula: "α · δ  vs  β · γ",
    extremesProductLabel: "Γινόμενο Άκρων (α · δ)",
    meansProductLabel: "Γινόμενο Μέσων (β · γ)",
    ratio1Label: "1ος Λόγος:",
    ratio2Label: "2ος Λόγος:",
    irreducibleLabel: "Ανάγωγος:",
    verdictTrueHeader: "✓ ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ: ΕΙΝΑΙ ΑΝΑΛΟΓΙΑ",
    verdictFalseHeader: "✗ ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ: ΔΕΝ ΕΙΝΑΙ ΑΝΑΛΟΓΙΑ",
    verdictTrueText: (p1, p2, rDec) => (
      <>
        Τα σταυρωτά γινόμενα είναι ίσα (<span className="font-mono font-bold">{p1} ＝ {p2}</span>) και οι δύο λόγοι έχουν την ίδια ακριβώς τιμή (<span className="font-mono font-bold">{rDec}</span>). Άρα σχηματίζουν <strong>πραγματική αναλογία</strong>!
      </>
    ),
    verdictFalseText: (p1, p2, r1Dec, r2Dec) => (
      <>
        Τα σταυρωτά γινόμενα διαφέρουν (<span className="font-mono font-bold">{p1} ≠ {p2}</span>) και οι λόγοι έχουν διαφορετική τιμή (<span className="font-mono font-bold">{r1Dec} ≠ {r2Dec}</span>). Άρα <strong>δεν</strong> σχηματίζουν αναλογία.
      </>
    ),
    lab2Badge: "🎯 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Πραγματική Εφαρμογή: Υπολογισμός Άγνωστου Όρου (x)",
    lab2Subtitle: (p1, p2, p3) => `Παράδειγμα αγοράς: Αν γνωρίζουμε ότι τα ${p1} τετράδια κοστίζουν ${p2} €, υπολογίστε πόσο κοστίζουν τα ${p3} τετράδια.`,
    notebooksInitialLabel: "ΑΡΧΙΚΑ ΤΕΤΡΑΔΙΑ",
    costInitialLabel: "ΚΟΣΤΟΣ (€)",
    notebooksTargetLabel: "ΝΕΑ ΤΕΤΡΑΔΙΑ",
    mathSetupHeader: "Μαθηματικό Στήσιμο της Αναλογίας:",
    ratioRelCol: "Σχέση Αναλογίας",
    crossAppCol: "Εφαρμογή Χιαστί",
    calcXCol: "Υπολογισμός του x",
    interpretationPhrase: (p1, p2, p3, val) => (
      <>
        💬 <strong>Ερμηνεία:</strong> Πολλαπλασιάζουμε τους δύο διαγώνια γνωστούς όρους (<span className="font-mono font-bold">{p2} · {p3} ＝ {p2 * p3}</span>) και διαιρούμε με τον όρο που βρίσκεται απέναντι από το x (<span className="font-mono font-bold">{p1}</span>): <span className="font-mono font-bold">{p2 * p3} : {p1} ＝ {val} €</span>.
      </>
    ),
    ctaTitle: "Ώρα για Εξάσκηση στις Αναλογίες!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις ελέγχου αναλογιών, υπολογισμού άγνωστων όρων (x), σταυρωτών γινομένων και σύνθετων προβλημάτων καθημερινής ζωής.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Proportions - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on proportions, cross-multiplication property, finding the unknown term, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 41 • 6TH GRADE",
    heroTitle: "The Concept of Proportion",
    heroDesc: "Discover what a proportion is, which terms are extremes and means, how to apply the cross-multiplication property, and how to directly compute an unknown term.",
    heroFeature: "Theory & Dynamic Cross-Product Verification",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 4 Steps",
    theorySubtitle: "The mathematical structure of proportions, term relationships, and problem-solving rules.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is a Proportion?",
    step1Text: "A proportion is an equality between two ratios. When two ratios have the exact same value, they form a proportion.",
    step1Notation: "Notation & Forms:",
    step1Or: "or",
    step1Pronounce: "Read as: 'a is to b as c is to d'.",
    step1Tip: "💡 An equality of two ratios is a true proportion only when both ratios evaluate to the exact same quotient!",
    step2Badge: "STEP 2",
    step2Sub: "Terminology",
    step2Title: "Extremes and Means Terms",
    step2Text: "In the proportion a : b ＝ c : d, the four numbers have designated positions and names:",
    step2ExtremesLabel: "Extremes:",
    step2ExtremesVal: "a  and  d",
    step2MeansLabel: "Means:",
    step2MeansVal: "b  and  c",
    step2FractionalNote: (
      <>
        In fractional form <Fraction num="a" den="b" /> ＝ <Fraction num="c" den="d" /> the extremes are diagonal (<strong>a</strong>, <strong>d</strong>) and the means are diagonal (<strong>b</strong>, <strong>c</strong>).
      </>
    ),
    step2Tip: "⚡ The extremes sit on the outer ends and the means sit in the middle of the proportion.",
    step3Badge: "STEP 3",
    step3Sub: "Fundamental Property",
    step3Title: "Cross-Multiplication (Cross Products)",
    step3Text: "In every true proportion, the product of the extremes equals the product of the means:",
    step3Formula: "a · d ＝ b · c",
    step3ExampleIntro: (
      <>
        Example for <Fraction num="2" den="3" /> ＝ <Fraction num="6" den="9" />:
      </>
    ),
    step3ExtremesCalc: "• Product of extremes: 2 · 9 ＝ 18",
    step3MeansCalc: "• Product of means: 3 · 6 ＝ 18",
    step3Tip: "🎯 If cross-products are unequal, the two ratios do NOT form a proportion!",
    step4Badge: "STEP 4",
    step4Sub: "Solving",
    step4Title: "Finding the Unknown Term",
    step4Text: (
      <>
        When three terms of a proportion are known, the fourth unknown term (<strong>x</strong>) is calculated directly:
      </>
    ),
    step4Rule: "x ＝ (product of known diagonals) : (opposite term)",
    step4Example: (
      <>
        If <Fraction num="2" den="5" /> ＝ <Fraction num="6" den="x" />, then:<br />
        <span className="font-mono font-bold">x ＝ (5 · 6) : 2 ＝ 30 : 2 ＝ 15</span>.
      </>
    ),
    step4Tip: "🚀 This rule is the mathematical foundation for solving proportion and pricing problems.",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Proportion Analyzer & Cross-Product Checker",
    lab1Subtitle: "Adjust all four terms to investigate whether they form a proportion and observe cross-products in real time.",
    termALabel: "TERM a (EXTREME)",
    termBLabel: "TERM b (MEAN)",
    termCLabel: "TERM c (MEAN)",
    termDLabel: "TERM d (EXTREME)",
    crossCheckHeader: "CROSS-PRODUCT VERIFICATION",
    crossCheckFormula: "a · d  vs  b · c",
    extremesProductLabel: "Product of Extremes (a · d)",
    meansProductLabel: "Product of Means (b · c)",
    ratio1Label: "1st Ratio:",
    ratio2Label: "2nd Ratio:",
    irreducibleLabel: "Simplest:",
    verdictTrueHeader: "✓ CONCLUSION: TRUE PROPORTION",
    verdictFalseHeader: "✗ CONCLUSION: NOT A PROPORTION",
    verdictTrueText: (p1, p2, rDec) => (
      <>
        Cross-products are equal (<span className="font-mono font-bold">{p1} ＝ {p2}</span>) and both ratios evaluate to the exact same value (<span className="font-mono font-bold">{rDec}</span>). Thus they form a <strong>true proportion</strong>!
      </>
    ),
    verdictFalseText: (p1, p2, r1Dec, r2Dec) => (
      <>
        Cross-products differ (<span className="font-mono font-bold">{p1} ≠ {p2}</span>) and both ratios have different values (<span className="font-mono font-bold">{r1Dec} ≠ {r2Dec}</span>). Thus they do <strong>not</strong> form a proportion.
      </>
    ),
    lab2Badge: "🎯 INTERACTIVE LAB 2",
    lab2Title: "Real-Life Application: Computing the Unknown Term (x)",
    lab2Subtitle: (p1, p2, p3) => `Shopping example: If ${p1} notebooks cost ${p2} €, compute how much ${p3} notebooks will cost.`,
    notebooksInitialLabel: "INITIAL NOTEBOOKS",
    costInitialLabel: "COST (€)",
    notebooksTargetLabel: "NEW NOTEBOOKS",
    mathSetupHeader: "Setting up the Proportion Mathematically:",
    ratioRelCol: "Proportion Ratio",
    crossAppCol: "Cross-Multiplication",
    calcXCol: "Calculation of x",
    interpretationPhrase: (p1, p2, p3, val) => (
      <>
        💬 <strong>Interpretation:</strong> Multiply the two known diagonal terms (<span className="font-mono font-bold">{p2} · {p3} ＝ {p2 * p3}</span>) and divide by the term opposite to x (<span className="font-mono font-bold">{p1}</span>): <span className="font-mono font-bold">{p2 * p3} : {p1} ＝ {val} €</span>.
      </>
    ),
    ctaTitle: "Time to Practice Proportions!",
    ctaDesc: "Challenge yourself with interactive questions on testing proportions, finding unknown terms (x), cross-multiplication, and real-life proportion problems.",
    ctaBtn: "Start Exercises"
  }
};

export default function AnalogiaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Έλεγχος & Διερεύνηση Αναλογίας (α : β ＝ γ : δ)
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(6);
  const [d, setD] = useState(9);

  // Εργαστήριο 2: Εύρεση Άγνωστου Όρου Αναλογίας (x)
  const [p1, setP1] = useState(4);  // π.χ. τετράδια
  const [p2, setP2] = useState(6);  // κόστος σε €
  const [p3, setP3] = useState(10); // νέα τετράδια

  // Υπολογισμοί Εργαστηρίου 1
  const crossProduct1 = a * d;
  const crossProduct2 = b * c;
  const isProportion = crossProduct1 === crossProduct2;

  const ratio1Dec = (a / b).toFixed(2).replace('.', locale === 'el' ? ',' : '.');
  const ratio2Dec = (c / d).toFixed(2).replace('.', locale === 'el' ? ',' : '.');

  const gcd1 = useMemo(() => getGCD(a, b), [a, b]);
  const gcd2 = useMemo(() => getGCD(c, d), [c, d]);

  // Υπολογισμοί Εργαστηρίου 2 (x = (p2 · p3) : p1)
  const unknownValue = useMemo(() => {
    const raw = (p2 * p3) / p1;
    const formatted = Number.isInteger(raw) ? String(raw) : raw.toFixed(2);
    return locale === 'el' ? formatted.replace('.', ',') : formatted;
  }, [p1, p2, p3, locale]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/41-analogia-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/41-analogia-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">{t.step1Notation}</p>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
                    <span>{locale === 'en' ? 'a : b ＝ c : d' : 'α : β ＝ γ : δ'}</span>
                    <span className="text-slate-400 font-normal">{t.step1Or}</span>
                    <div className="inline-flex items-center gap-1">
                      <Fraction num={locale === 'en' ? 'a' : 'α'} den={locale === 'en' ? 'b' : 'β'} />
                      <span className="mx-1">＝</span>
                      <Fraction num={locale === 'en' ? 'c' : 'γ'} den={locale === 'en' ? 'd' : 'δ'} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {t.step1Pronounce}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900">{t.step2ExtremesLabel}</span>
                    <span className="font-mono font-black text-blue-700">{t.step2ExtremesVal}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-amber-900">{t.step2MeansLabel}</span>
                    <span className="font-mono font-black text-amber-700">{t.step2MeansVal}</span>
                  </div>
                  <div className="pt-2 text-center text-[11px] text-slate-600 border-t border-slate-200 leading-normal">
                    {t.step2FractionalNote}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="text-center font-bold text-slate-900 text-sm sm:text-base">
                    {locale === 'en' ? 'a · d ＝ b · c' : 'α · δ ＝ β · γ'}
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-slate-600 font-sans text-[11px] leading-relaxed">
                    {t.step3ExampleIntro}<br />
                    • <span className="font-mono font-bold text-indigo-800">{t.step3ExtremesCalc}</span><br />
                    • <span className="font-mono font-bold text-indigo-800">{t.step3MeansCalc}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-center font-bold">
                    {t.step4Rule}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 font-sans text-[11px] leading-relaxed">
                    {t.step4Example}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΛΕΓΧΟΣ ΑΝΑΛΟΓΙΑΣ & ΣΤΑΥΡΩΤΑ ΓΙΝΟΜΕΝΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.lab1Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Subtitle}
              </p>
            </div>
          </div>

          {/* Πλέγμα 4 Steppers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
            
            {/* Όρος α (Άκρος) */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.termALabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {a}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease term a"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setA((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={a <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  aria-label="Term a"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase term a"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setA((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={a >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος β (Μέσος) */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.termBLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {b}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease term b"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setB((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={b <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  aria-label="Term b"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase term b"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setB((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={b >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος γ (Μέσος) */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.termCLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {c}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease term c"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setC((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={c <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  aria-label="Term c"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase term c"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setC((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={c >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος δ (Άκρος) */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.termDLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {d}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease term d"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setD((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={d <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={d}
                  onChange={(e) => setD(Number(e.target.value))}
                  aria-label="Term d"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase term d"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setD((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={d >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Οπτική Σύγκριση Σταυρωτών Γινομένων */}
          <div className="bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-600">
              <span>{t.crossCheckHeader}</span>
              <span className="font-mono text-slate-500">
                {t.crossCheckFormula}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">{t.extremesProductLabel}</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-600">{a} · {d}</span>
                </div>
                <span className="font-mono font-black text-xl sm:text-2xl text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
                  {crossProduct1}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">{t.meansProductLabel}</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-600">{b} · {c}</span>
                </div>
                <span className="font-mono font-black text-xl sm:text-2xl text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
                  {crossProduct2}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 text-center text-xs sm:text-sm text-slate-600">
              <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <span>{t.ratio1Label}</span>
                <Fraction num={a} den={b} className="text-xs sm:text-sm font-bold text-slate-900" />
                <span>≈ <strong className="font-mono">{ratio1Dec}</strong> ({t.irreducibleLabel}</span>
                <Fraction num={a / gcd1} den={b / gcd1} className="text-xs font-bold text-blue-800" />
                <span>)</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <span>{t.ratio2Label}</span>
                <Fraction num={c} den={d} className="text-xs sm:text-sm font-bold text-slate-900" />
                <span>≈ <strong className="font-mono">{ratio2Dec}</strong> ({t.irreducibleLabel}</span>
                <Fraction num={c / gcd2} den={d / gcd2} className="text-xs font-bold text-amber-800" />
                <span>)</span>
              </div>
            </div>
          </div>

          {/* Τελική Κάρτα Αποτελέσματος Αναλογίας */}
          <div
            className={`p-5 sm:p-7 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-3 text-white transition-all ${
              isProportion
                ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900'
                : 'bg-gradient-to-r from-rose-900 via-red-900 to-slate-900'
            }`}
          >
            <span className="text-xs 2xl:text-sm uppercase font-black tracking-wider block text-sky-200">
              {isProportion ? t.verdictTrueHeader : t.verdictFalseHeader}
            </span>
            <div className="text-lg sm:text-2xl 2xl:text-3xl font-black font-mono flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <span>{a} : {b}</span>
                <span className={isProportion ? 'text-emerald-300' : 'text-rose-300'}>
                  {isProportion ? '＝' : '≠'}
                </span>
                <span>{c} : {d}</span>
              </div>
              <span className="text-white/40 text-base sm:text-xl">|</span>
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <Fraction num={a} den={b} className="text-base sm:text-2xl font-black" />
                <span className={isProportion ? 'text-emerald-300' : 'text-rose-300'}>
                  {isProportion ? '＝' : '≠'}
                </span>
                <Fraction num={c} den={d} className="text-base sm:text-2xl font-black" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              {isProportion
                ? t.verdictTrueText(crossProduct1, crossProduct2, ratio1Dec)
                : t.verdictFalseText(crossProduct1, crossProduct2, ratio1Dec, ratio2Dec)}
            </p>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΟΡΟΥ ΣΕ ΠΡΟΒΛΗΜΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>{t.lab2Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Subtitle(p1, p2, p3)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
            
            {/* Ποσότητα 1 */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.notebooksInitialLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {p1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease initial notebooks"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP1((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p1 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={p1}
                  onChange={(e) => setP1(Number(e.target.value))}
                  aria-label="Initial notebooks"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase initial notebooks"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP1((prev) => Math.min(20, prev + 1));
                  }}
                  disabled={p1 >= 20}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Κόστος 1 */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                  {t.costInitialLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {p2} €
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease cost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP2((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p2 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={p2}
                  onChange={(e) => setP2(Number(e.target.value))}
                  aria-label="Cost"
                  className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase cost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP2((prev) => Math.min(30, prev + 1));
                  }}
                  disabled={p2 >= 30}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ποσότητα 2 */}
            <div className="bg-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-indigo-900 tracking-wider">
                  {t.notebooksTargetLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                  {p3}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Decrease target notebooks"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP3((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p3 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={p3}
                  onChange={(e) => setP3(Number(e.target.value))}
                  aria-label="Target notebooks"
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Increase target notebooks"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP3((prev) => Math.min(30, prev + 1));
                  }}
                  disabled={p3 >= 30}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Μαθηματική Επίλυση Βήμα-Βήμα */}
          <div className="bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-800">
              {t.mathSetupHeader}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-[11px] sm:text-xs text-slate-500 block mb-1">{t.ratioRelCol}</span>
                <div className="inline-flex items-center text-base sm:text-lg font-bold text-slate-900">
                  <Fraction num={p1} den={p2} />
                  <span className="mx-1.5 sm:mx-2">＝</span>
                  <Fraction num={p3} den="x" />
                </div>
              </div>
              <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-[11px] sm:text-xs text-slate-500 block mb-1">{t.crossAppCol}</span>
                <span className="font-mono font-bold text-indigo-700 text-base sm:text-lg">
                  {p1} · x ＝ {p2} · {p3}
                </span>
              </div>
              <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-[11px] sm:text-xs text-slate-500 block mb-1">{t.calcXCol}</span>
                <span className="font-mono font-black text-emerald-600 text-base sm:text-lg">
                  x ＝ {unknownValue} €
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-600 pt-1 leading-relaxed">
              {t.interpretationPhrase(p1, p2, p3, unknownValue)}
            </p>
          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/41-analogia-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}