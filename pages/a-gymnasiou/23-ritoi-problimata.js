import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση καθαρισμού τόνων για κεφαλαία (διατηρεί μόνο το Α')
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

// Επαναχρησιμοποιήσιμο component για αυστηρά κατακόρυφη κλασματική μορφή (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center text-center">
        <span className="border-b border-current px-1 pb-0.5 break-all w-full text-center">
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 break-all w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Επίλυση Προβλημάτων με Ρητούς | Α' Γυμνασίου",
    pageDesc: "Μεθοδολογία και στρατηγικές επίλυσης προβλημάτων με ρητούς αριθμούς, κλασματικά μέρη, οικονομικά ισοζύγια και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 21 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Επίλυση Προβλημάτων με Ρητούς Αριθμούς",
    mainSubtitle: "Μαθαίνουμε τα τέσσερα στάδια ορθής επίλυσης μαθηματικών προβλημάτων, πώς μετατρέπουμε τα λεκτικά δεδομένα σε αριθμητικές εκφράσεις και πώς διαχειριζόμαστε κλασματικά μερίδια και πρόσημα στην καθημερινή ζωή.",
    
    // Ενότητα 1: Τα 4 Στάδια
    sec1Title: "Τα 4 Βήματα Στρατηγικής Επίλυσης",
    step1Tag: "ΒΗΜΑ 1",
    step1Title: "Κατανόηση",
    step1Desc: "Διαβάζουμε προσεκτικά την εκφώνηση. Ξεχωρίζουμε ποια είναι τα γνωστά δεδομένα και ποια τα άγνωστα ζητούμενα.",
    step1Prompt: "«Τι ακριβώς μου ζητάει να βρω;»",

    step2Tag: "ΒΗΜΑ 2",
    step2Title: "Σχεδιασμός",
    step2Desc: "Μεταφράζουμε τις λέξεις σε μαθηματική παράσταση. Επιλέγουμε τις κατάλληλες πράξεις (πρόσθεση, αφαίρεση, πολλαπλασιασμό μεριδίου ή διαίρεση).",
    step2Prompt: "«Ποια μαθηματική σχέση συνδέει τα δεδομένα;»",

    step3Tag: "ΒΗΜΑ 3",
    step3Title: "Εκτέλεση Πράξεων",
    step3Desc: "Εκτελούμε προσεκτικά τους υπολογισμούς τηρώντας την προτεραιότητα πράξεων, τους κανόνες προσήμων και την απλοποίηση των κλασμάτων με διαίρεση.",
    step3Prompt: "Προσοχή στα πρόσημα και τα ομώνυμα κλάσματα.",

    step4Tag: "ΒΗΜΑ 4",
    step4Title: "Έλεγχος & Απάντηση",
    step4Desc: "Ελέγχουμε αν η απάντηση είναι λογική για τα δεδομένα του πραγματικού κόσμου και διατυπώνουμε ολοκληρωμένη πρόταση με μονάδες μέτρησης (€, kg, m κ.λπ.).",
    step4Prompt: "Επαλήθευση του αποτελέσματος.",

    // Ενότητα 2: Κλασματικό Μέρος
    sec2Title: "Προβλήματα με Κλασματικά Μερίδια & Υπόλοιπα",
    fracPartTitle: "Υπολογισμός του Κλάσματος ενός Ποσού",
    fracPartDescPre: "Όταν θέλουμε να βρούμε τα",
    fracPartDescPost: "ενός ποσού Χ, πολλαπλασιάζουμε το ποσό με το κλάσμα:",
    fracPartPartFormulaLabel: "Μέρος",
    fracPartRemainderPre: "Το υπόλοιπο που απομένει είναι:",
    fracPartRemainderPost: "του αρχικού ποσού.",
    fracInverseTitle: "Αντίστροφο Πρόβλημα: Εύρεση της Αρχικής Ποσότητας",
    fracInverseDescPre: "Όταν γνωρίζουμε ότι τα",
    fracInverseDescPost: "μιας ποσότητας ισούνται με Υ και ψάχνουμε το αρχικό σύνολο, διαιρούμε την ποσότητα με το κλάσμα:",
    fracInverseInitialLabel: "Αρχική Ποσότητα",

    // Εργαστήριο 1
    lab1Title: "🛠️ Εργαστήριο 1: Διαδραστικός Προσομοιωτής Μεριδίου & Υπολοίπου",
    initialBudgetLabel: "ΑΡΧΙΚΟ ΠΟΣΟ (Χ)",
    numeratorLabel: "ΑΡΙΘΜΗΤΗΣ (α)",
    denominatorLabel: "ΠΑΡΟΝΟΜΑΣΤΗΣ (β)",
    budgetDistribution: "ΚΑΤΑΝΟΜΗ ΠΟΣΟΥ",
    fractionBadge: "ΚΛΑΣΜΑ",
    spentShare: "Μέρος που ξοδεύτηκε",
    remainingShare: "Υπόλοιπο",
    step1CalculationLabel: "1. Υπολογισμός Εξόδου",
    step2CalculationLabel: "2. Υπολογισμός Υπολοίπου",

    // Ενότητα 3: Πρόσημα & Μεγέθη
    sec3Title: "Προβλήματα με Θετικά & Αρνητικά Μεγέθη",
    financeTag: "ΟΙΚΟΝΟΜΙΚΑ",
    financeTitle: "Έσοδα vs Έξοδα",
    financeDesc: "Τα έσοδα, οι καταθέσεις και τα κέρδη είναι θετικοί ρητοί (＋). Τα έξοδα, οι χρεώσεις και οι ζημιές είναι αρνητικοί ρητοί (－).",
    physicsTag: "ΦΥΣΙΚΗ & ΚΑΙΡΟΣ",
    physicsTitle: "Μεταβολές Θερμοκρασίας",
    physicsDesc: "Η άνοδος της θερμοκρασίας δηλώνεται με ＋, ενώ η πτώση (ψύχος) με －. Η τελική θερμοκρασία είναι το αλγεβρικό άθροισμα των μεταβολών.",
    geoTag: "ΓΕΩΓΡΑΦΙΑ",
    geoTitle: "Υψόμετρα & Βάθη",
    geoDesc: "Σημείο αναφοράς (0) είναι η επιφάνεια της θάλασσας. Τα βουνά έχουν θετικό υψόμετρο και τα υποθαλάσσια βάθη αρνητικό.",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Οικονομικού Ισοζυγίου",
    initialBalanceLabel: "ΑΡΧΙΚΟ ΥΠΟΛΟΙΠΟ",
    newIncomeLabel: "ΝΕΟ ΕΣΟΔΟ (＋)",
    expense1Label: "ΕΞΟΔΟ 1 (－)",
    expense2Label: "ΕΞΟΔΟ 2 (－)",
    sumCardTitle: "ΑΛΓΕΒΡΙΚΟ ΑΘΡΟΙΣΜΑ ΠΟΣΩΝ",
    surplusBadge: "ΠΛΕΟΝΑΣΜΑ (ΘΕΤΙΚΟ)",
    deficitBadge: "ΕΛΛΕΙΜΜΑ / ΧΡΕΟΣ (ΑΡΝΗΤΙΚΟ)",
    finalBalanceLabel: "ΤΕΛΙΚΟ ΥΠΟΛΟΙΠΟ"
  },
  en: {
    pageTitle: "Problem Solving with Rational Numbers | 7th Grade Math",
    pageDesc: "Methodology and strategies for solving problems with rational numbers, fractional parts, financial balances, and interactive simulations.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 21 • THEORY & LAB",
    mainTitle: "Problem Solving with Rational Numbers",
    mainSubtitle: "Learn the four stages of effective problem solving, how to translate real-world scenarios into numerical expressions, and how to manage fractions and signs in everyday life.",
    
    // Section 1
    sec1Title: "The 4 Problem-Solving Steps",
    step1Tag: "STEP 1",
    step1Title: "Understand",
    step1Desc: "Carefully read the problem statement. Identify what information is given and what you need to determine.",
    step1Prompt: "\"What exactly am I asked to find?\"",

    step2Tag: "STEP 2",
    step2Title: "Plan",
    step2Desc: "Translate words into a mathematical expression. Choose appropriate operations (addition, subtraction, fractional multiplication, or division).",
    step2Prompt: "\"Which mathematical relation connects the given data?\"",

    step3Tag: "STEP 3",
    step3Title: "Execute",
    step3Desc: "Carry out calculations systematically, adhering to the order of operations, sign rules, and fraction simplification.",
    step3Prompt: "Pay close attention to signs and common denominators.",

    step4Tag: "STEP 4",
    step4Title: "Check & Conclude",
    step4Desc: "Check whether your result makes sense in the real-world context and write a complete sentence stating the answer with units (€, kg, m, etc.).",
    step4Prompt: "Verification of the solution.",

    // Section 2
    sec2Title: "Problems with Fractional Shares & Remainders",
    fracPartTitle: "Finding the Fraction of an Amount",
    fracPartDescPre: "To find",
    fracPartDescPost: "of an amount X, multiply the amount by the fraction:",
    fracPartPartFormulaLabel: "Part",
    fracPartRemainderPre: "The remaining share is:",
    fracPartRemainderPost: "of the initial amount.",
    fracInverseTitle: "Reverse Problem: Finding the Initial Total",
    fracInverseDescPre: "When you know that",
    fracInverseDescPost: "of a quantity equals Y and need the whole original amount, divide the quantity by the fraction:",
    fracInverseInitialLabel: "Total Amount",

    // Lab 1
    lab1Title: "🛠️ Lab 1: Interactive Share & Remainder Simulator",
    initialBudgetLabel: "INITIAL AMOUNT (X)",
    numeratorLabel: "NUMERATOR (a)",
    denominatorLabel: "DENOMINATOR (b)",
    budgetDistribution: "AMOUNT BREAKDOWN",
    fractionBadge: "FRACTION",
    spentShare: "Spent share",
    remainingShare: "Remaining",
    step1CalculationLabel: "1. Calculating Expense",
    step2CalculationLabel: "2. Calculating Remainder",

    // Section 3
    sec3Title: "Problems with Positive & Negative Quantities",
    financeTag: "FINANCE",
    financeTitle: "Income vs. Expenses",
    financeDesc: "Income, deposits, and gains are positive rational numbers (＋). Expenses, charges, and losses are negative rational numbers (－).",
    physicsTag: "PHYSICS & WEATHER",
    physicsTitle: "Temperature Changes",
    physicsDesc: "A rise in temperature is represented with ＋, while a drop (cooling) with －. The final temperature is the algebraic sum of all changes.",
    geoTag: "GEOGRAPHY",
    geoTitle: "Elevation & Depth",
    geoDesc: "Sea level is the reference point (0). Mountains have positive elevations and undersea depths have negative values.",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Interactive Financial Balance Simulator",
    initialBalanceLabel: "INITIAL BALANCE",
    newIncomeLabel: "NEW INCOME (＋)",
    expense1Label: "EXPENSE 1 (－)",
    expense2Label: "EXPENSE 2 (－)",
    sumCardTitle: "ALGEBRAIC SUM OF AMOUNTS",
    surplusBadge: "SURPLUS (POSITIVE)",
    deficitBadge: "DEFICIT / DEBT (NEGATIVE)",
    finalBalanceLabel: "FINAL BALANCE"
  }
};

export default function RitoiProblimataTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const numLocale = locale === 'el' ? 'el-GR' : 'en-US';

  // State για Εργαστήριο 1: Κλασματικό Μέρος & Υπόλοιπο
  const [totalBudget, setTotalBudget] = useState(120);
  const [f1Num, setF1Num] = useState(2);
  const [f1Den, setF1Den] = useState(5);

  // State για Εργαστήριο 2: Ισοζύγιο με Θετικά και Αρνητικά Μεγέθη
  const [initialAmount, setInitialAmount] = useState(50);
  const [income, setIncome] = useState(80);
  const [expense1, setExpense1] = useState(45);
  const [expense2, setExpense2] = useState(110);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const spentAmount = useMemo(() => {
    return Number(((totalBudget * f1Num) / f1Den).toFixed(2));
  }, [totalBudget, f1Num, f1Den]);

  const remainingAmount = useMemo(() => {
    return Number((totalBudget - spentAmount).toFixed(2));
  }, [totalBudget, spentAmount]);

  const remainingFractionNum = f1Den - f1Num;
  const spentPercent = Math.round((f1Num / f1Den) * 100);
  const remPercent = 100 - spentPercent;

  // Υπολογισμοί Εργαστηρίου 2 (Οικονομικό Ισοζύγιο)
  const balance = useMemo(() => {
    return initialAmount + income - expense1 - expense2;
  }, [initialAmount, income, expense1, expense2]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/23-ritoi-problimata-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΤΑ 4 ΣΤΑΔΙΑ ΕΠΙΛΥΣΗΣ ΠΡΟΒΛΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Βήμα 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step1Tag)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.step1Desc}
                </p>
              </div>
              <div className="text-[11px] text-slate-500 italic break-words">
                {t.step1Prompt}
              </div>
            </div>

            {/* Βήμα 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step2Tag)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.step2Desc}
                </p>
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold break-words">
                {t.step2Prompt}
              </div>
            </div>

            {/* Βήμα 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step3Tag)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.step3Desc}
                </p>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold break-words">
                {t.step3Prompt}
              </div>
            </div>

            {/* Βήμα 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step4Tag)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.step4Desc}
                </p>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold break-words">
                {t.step4Prompt}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΟΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">
                {t.fracPartTitle}
              </h3>
              <p className="break-words [overflow-wrap:anywhere]">
                {t.fracPartDescPre}{' '}
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />{' '}
                {t.fracPartDescPost}
              </p>
              
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-base sm:text-lg font-mono shadow-sm flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                <span>{t.fracPartPartFormulaLabel}</span>
                <span>＝</span>
                <span>X</span>
                <span>·</span>
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>＝</span>
                <Frac num={locale === 'el' ? 'X · α' : 'X · a'} den={locale === 'el' ? 'β' : 'b'} />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-1 leading-relaxed">
                <span>{t.fracPartRemainderPre}</span>
                <span className="font-mono">1</span>
                <span>－</span>
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>＝</span>
                <Frac num={locale === 'el' ? 'β － α' : 'b － a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>{t.fracPartRemainderPost}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 text-base break-words">
                {t.fracInverseTitle}
              </div>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.fracInverseDescPre}{' '}
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />{' '}
                {t.fracInverseDescPost}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-950 flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                <span>{t.fracInverseInitialLabel}</span>
                <span>＝</span>
                <span>Y</span>
                <span>:</span>
                <Frac num={locale === 'el' ? 'α' : 'a'} den={locale === 'el' ? 'β' : 'b'} />
                <span>＝</span>
                <span>Y</span>
                <span>·</span>
                <Frac num={locale === 'el' ? 'β' : 'b'} den={locale === 'el' ? 'α' : 'a'} />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟ ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΙΔΙΟ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Αρχικό Ποσό */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block break-words">
                    {toCleanUppercase(t.initialBudgetLabel)}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTotalBudget, -10, 10, 500, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease initial amount"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-base font-mono text-indigo-950 px-2 truncate">
                      {totalBudget.toLocaleString(numLocale)} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTotalBudget, 10, 10, 500, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase initial amount"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Αριθμητής Μεριδίου */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block break-words">
                    {toCleanUppercase(t.numeratorLabel)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Num, -1, 1, f1Den - 1, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease numerator"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {f1Num}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Num, 1, 1, f1Den - 1, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase numerator"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Παρονομαστής Μεριδίου */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block break-words">
                    {toCleanUppercase(t.denominatorLabel)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Den, -1, f1Num + 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease denominator"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {f1Den}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Den, 1, f1Num + 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase denominator"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Οπτική Ανάλυση & Μπάρα Κατανομής (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-5 shadow-md min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold break-words">
                    {toCleanUppercase(t.budgetDistribution)} ({totalBudget.toLocaleString(numLocale)} €)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 inline-flex items-center gap-1.5 shrink-0">
                    <span>{toCleanUppercase(t.fractionBadge)}:</span>
                    <Frac num={f1Num} den={f1Den} className="text-indigo-200" />
                  </span>
                </div>

                {/* Οπτική Μπάρα */}
                <div className="space-y-2">
                  <div className="w-full h-8 bg-slate-800 rounded-xl overflow-hidden flex border border-slate-700 p-0.5">
                    <div
                      style={{ width: `${spentPercent}%` }}
                      className="h-full bg-amber-500 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-950 transition-all duration-300 overflow-hidden px-1"
                    >
                      {spentPercent >= 15 ? `${spentPercent}%` : ''}
                    </div>
                    <div
                      style={{ width: `${remPercent}%` }}
                      className="h-full bg-emerald-500 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-950 transition-all duration-300 ml-0.5 overflow-hidden px-1"
                    >
                      {remPercent >= 15 ? `${remPercent}%` : ''}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-1 text-xs font-mono pt-1">
                    <span className="text-amber-400 font-bold inline-flex items-center flex-wrap gap-1">
                      <span>{t.spentShare}:</span>
                      <span>{spentAmount.toLocaleString(numLocale)} €</span>
                      <span>(<Frac num={f1Num} den={f1Den} />)</span>
                    </span>
                    <span className="text-emerald-400 font-bold inline-flex items-center flex-wrap gap-1">
                      <span>{t.remainingShare}:</span>
                      <span>{remainingAmount.toLocaleString(numLocale)} €</span>
                      <span>(<Frac num={remainingFractionNum} den={f1Den} />)</span>
                    </span>
                  </div>
                </div>

                {/* Ανάλυση Πράξεων */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong className="text-white">{t.step1CalculationLabel}:</strong>
                    <span>{totalBudget.toLocaleString(numLocale)}</span>
                    <span>·</span>
                    <Frac num={f1Num} den={f1Den} />
                    <span>＝</span>
                    <Frac num={`${totalBudget.toLocaleString(numLocale)} · ${f1Num}`} den={f1Den} />
                    <span>＝</span>
                    <strong className="text-amber-300">{spentAmount.toLocaleString(numLocale)} €</strong>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <strong className="text-white">{t.step2CalculationLabel}:</strong>
                    <span>{totalBudget.toLocaleString(numLocale)}</span>
                    <span>－</span>
                    <span>{spentAmount.toLocaleString(numLocale)}</span>
                    <span>＝</span>
                    <strong className="text-emerald-300">{remainingAmount.toLocaleString(numLocale)} €</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΠΡΟΣΗΜΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                {toCleanUppercase(t.financeTag)}
              </span>
              <h4 className="font-bold text-slate-900 text-base break-words">
                {t.financeTitle}
              </h4>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.financeDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider block">
                {toCleanUppercase(t.physicsTag)}
              </span>
              <h4 className="font-bold text-slate-900 text-base break-words">
                {t.physicsTitle}
              </h4>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.physicsDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">
                {toCleanUppercase(t.geoTag)}
              </span>
              <h4 className="font-bold text-slate-900 text-base break-words">
                {t.geoTitle}
              </h4>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.geoDesc}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟ ΟΙΚΟΝΟΜΙΚΟ ΙΣΟΖΥΓΙΟ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 break-words">
                    {toCleanUppercase(t.initialBalanceLabel)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setInitialAmount, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease initial balance"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-900 px-1 truncate">
                      ＋{initialAmount.toLocaleString(numLocale)} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setInitialAmount, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase initial balance"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1 break-words">
                    {toCleanUppercase(t.newIncomeLabel)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setIncome, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease income"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200 font-bold text-sm font-mono text-emerald-950 px-1 truncate">
                      ＋{income.toLocaleString(numLocale)} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setIncome, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase income"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1 break-words">
                    {toCleanUppercase(t.expense1Label)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense1, -5, 0, 150, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease expense 1"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-rose-50 rounded-lg border border-rose-200 font-bold text-sm font-mono text-rose-950 px-1 truncate">
                      －{expense1.toLocaleString(numLocale)} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense1, 5, 0, 150, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase expense 1"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1 break-words">
                    {toCleanUppercase(t.expense2Label)}
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense2, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Decrease expense 2"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-rose-50 rounded-lg border border-rose-200 font-bold text-sm font-mono text-rose-950 px-1 truncate">
                      －{expense2.toLocaleString(numLocale)} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense2, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition-all text-slate-800"
                      aria-label="Increase expense 2"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans break-words">
                    {toCleanUppercase(t.sumCardTitle)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans shrink-0 ${
                    balance >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {toCleanUppercase(balance >= 0 ? t.surplusBadge : t.deficitBadge)}
                  </span>
                </div>

                <div className="text-base sm:text-xl lg:text-2xl font-bold py-1 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center w-full max-w-full">
                  <span>(＋{initialAmount.toLocaleString(numLocale)})</span>
                  <span className="text-emerald-400">＋</span>
                  <span>(＋{income.toLocaleString(numLocale)})</span>
                  <span className="text-rose-400">＋</span>
                  <span>(－{expense1.toLocaleString(numLocale)})</span>
                  <span className="text-rose-400">＋</span>
                  <span>(－{expense2.toLocaleString(numLocale)})</span>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-slate-300 font-sans font-bold">
                    {toCleanUppercase(t.finalBalanceLabel)}:
                  </span>
                  <span className={`text-2xl sm:text-4xl font-black ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {balance >= 0
                      ? `＋${balance.toLocaleString(numLocale)} €`
                      : `${balance.toLocaleString(numLocale)} €`}
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