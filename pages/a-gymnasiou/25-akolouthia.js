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

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική μορφή (όταν απαιτείται)
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
    pageTitle: "Κανονικότητες & Ακολουθίες | Α' Γυμνασίου",
    pageDesc: "Η έννοια της κανονικότητας (ακολουθίας), ο ν-οστός όρος, οπτικά μοτίβα και διαδραστικά εργαστήρια προβλημάτων.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 22 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Κανονικότητες & Ακολουθίες (Ο ν-οστός όρος)",
    mainSubtitle: "Εξερευνούμε τα μοτίβα που κρύβονται γύρω μας! Μαθαίνουμε πώς να αναγνωρίζουμε τον κανόνα μιας ακολουθίας και πώς να υπολογίζουμε τον ν-οστό όρο, λύνοντας πρακτικά προβλήματα.",

    // Ενότητα 1
    sec1Title: "Τι Ονομάζουμε Κανονικότητα (Ακολουθία);",
    sec1Intro: "Μια κανονικότητα (ή αλλιώς ακολουθία) είναι μια σειρά από αριθμούς ή σχήματα που ακολουθούν έναν συγκεκριμένο, επαναλαμβανόμενο μαθηματικό κανόνα.",
    evenExampleTitle: "Παράδειγμα: Οι Άρτιοι Αριθμοί",
    evenExampleSeq: "2, 4, 6, 8, 10, ...",
    evenExampleDesc: "Ο κανόνας είναι προφανής: Κάθε αριθμός προκύπτει προσθέτοντας το 2 στον προηγούμενο. Αν σε ρωτήσουν «ποιος είναι ο επόμενος;», ξέρεις κατευθείαν ότι είναι το 12.",
    nthBoxBadge: "Ο ΜΑΓΙΚΟΣ ΑΡΙΘΜΟΣ «ν» (ν-οστος ορος)",
    nthBoxDesc: "Αντί να προσθέτουμε συνεχώς για να βρούμε (για παράδειγμα) τον 100ό αριθμό της σειράς, χρησιμοποιούμε έναν γενικό τύπο, τον ν-οστό όρο.",
    nthBullet1: "Το ν συμβολίζει τη θέση (1ος, 2ος, 3ος, ...).",
    nthBullet2: "Είναι πάντοτε ένας φυσικός αριθμός μεγαλύτερος του μηδενός (ν ≥ 1).",
    nthBullet3: "Για τους άρτιους αριθμούς, ο τύπος είναι 2 · ν. Αν ν ＝ 100, ο 100ός όρος είναι 2 · 100 ＝ 200.",

    // Ενότητα 2
    sec2Title: "Από το Σχήμα στον Μαθηματικό Τύπο",
    sec2Intro: "Πολλές κανονικότητες εμφανίζονται σε γεωμετρικά σχήματα. Σκέψου ότι φτιάχνουμε τετράγωνα στη σειρά χρησιμοποιώντας σπίρτα (ή γραμμές). Το πρώτο τετράγωνο χρειάζεται 4 σπίρτα. Κάθε επόμενο τετράγωνο κολλάει στο προηγούμενο, οπότε χρειάζεται μόνο 3 νέα σπίρτα.",
    lab1Title: "🛠️ Εργαστήριο 1: Χτίζοντας Τετράγωνα (Το Μοτίβο 3ν ＋ 1)",
    stepNumberLabel: "ΒΗΜΑ ΝΟ. (ν) - ΠΛΗΘΟΣ ΤΕΤΡΑΓΩΝΩΝ",
    lineCalculationTitle: "ΥΠΟΛΟΓΙΣΜΟΣ ΓΡΑΜΜΩΝ",
    lineCalculationDesc: "Το 1ο σπίρτο μπαίνει στην αρχή (αριστερά). Μετά, για κάθε τετράγωνο προσθέτουμε ένα σχήμα «C» με 3 σπίρτα.",
    visualTitle: "ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ",
    linesUnit: "ΓΡΑΜΜΕΣ",

    // Ενότητα 3
    sec3Title: "Η Κανονικότητα στην Πραγματική Ζωή",
    prob1Title: "Πρόβλημα: Τραπέζια σε Εστιατόριο",
    prob1Desc: "Σε ένα εστιατόριο, ένα ορθογώνιο τραπέζι χωράει 6 άτομα (από 2 στις μεγάλες πλευρές και από 1 στις μικρές). Αν ενώσουμε 2 τραπέζια στη σειρά, χάνουμε τις ενδιάμεσες θέσεις.",
    prob1Bullet1: "1 τραπέζι (ν ＝ 1): 6 θέσεις",
    prob1Bullet2: "2 τραπέζια (ν ＝ 2): 10 θέσεις",
    prob1Bullet3: "3 τραπέζια (ν ＝ 3): 14 θέσεις",
    prob1FormulaLabel: "Τύπος (ν-οστός όρος): 4 · ν ＋ 2",
    prob1Explanation: "Εξήγηση: Κάθε νέο τραπέζι προσθέτει 4 θέσεις (τις πάνω και τις κάτω). Οι 2 θέσεις στις άκρες (αριστερά και δεξιά) μένουν πάντα σταθερές.",

    prob2Title: "Πρόβλημα: Οικονομίες στον Κουμπαρά",
    prob2Desc: "Ο Γιάννης έχει ήδη 15 € στον κουμπαρά του. Αποφασίζει κάθε εβδομάδα να αποταμιεύει 5 €.",
    prob2Bullet1: "Μετά από 1 εβδομάδα (ν ＝ 1): 20 €",
    prob2Bullet2: "Μετά από 2 εβδομάδες (ν ＝ 2): 25 €",
    prob2Bullet3: "Μετά από 3 εβδομάδες (ν ＝ 3): 30 €",
    prob2FormulaLabel: "Τύπος (ν-οστός όρος): 5 · ν ＋ 15",
    prob2Explanation: "Εξήγηση: Το 15 είναι το αρχικό ποσό (σταθερό). Για κάθε εβδομάδα ν, προσθέτουμε 5 ευρώ (ο ρυθμός αύξησης).",

    // Ενότητα 4
    sec4Title: "Εργαστήριο 2: Η «Μηχανή» των Κανονικοτήτων",
    selectRuleLabel: "ΕΠΙΛΟΓΗ ΚΑΝΟΝΑ (ΤΥΠΟΣ)",
    selectNLabel: "ΒΗΜΑ (ν) - ΠΛΗΘΟΣ ΟΡΩΝ",
    maxTermsHint: "Μπορείτε να δείτε μέχρι τους πρώτους 20 όρους της ακολουθίας.",
    machineResultTitle: "ΑΠΟΤΕΛΕΣΜΑ ΜΗΧΑΝΗΣ",
    formulaPrefix: "ΤΥΠΟΣ",
    calcForLabel: "ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΑ ν ＝",
    termValueLabel: "Τιμή ＝",
    sequenceListTitle: "Η ΑΚΟΛΟΥΘΙΑ (ΟΙ ΠΡΩΤΟΙ",
    sequenceListTitlePost: "ΟΡΟΙ)",
    highlightHelp: "Ο φωτισμένος αριθμός είναι ο όρος στη θέση ν =",
    highlightHelpPost: ". Πέρασε το ποντίκι (ή πάτα) πάνω στα κουτάκια για να δεις τη θέση τους.",

    // Ονόματα κανόνων
    ruleEven: "Άρτιοι Αριθμοί",
    ruleOdd: "Περιττοί Αριθμοί",
    ruleTables: "Καθίσματα σε Τραπέζια",
    ruleSquares: "Τετράγωνοι Αριθμοί",
    ruleStep5: "Αύξηση κατά 5",
  },
  en: {
    pageTitle: "Patterns & Sequences | 7th Grade Math",
    pageDesc: "The concept of sequences, the nth term, visual patterns, and interactive mathematical modeling laboratories.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 22 • THEORY & LAB",
    mainTitle: "Patterns & Sequences (The nth term)",
    mainSubtitle: "Explore patterns hidden all around us! Learn how to identify the rule of a sequence and calculate any nth term to solve real-world problems.",

    // Section 1
    sec1Title: "What is a Mathematical Pattern (Sequence)?",
    sec1Intro: "A mathematical pattern (or sequence) is an ordered list of numbers or geometrical figures that follow a specific, repeating mathematical rule.",
    evenExampleTitle: "Example: Even Numbers",
    evenExampleSeq: "2, 4, 6, 8, 10, ...",
    evenExampleDesc: "The rule is evident: each number is obtained by adding 2 to the preceding one. If asked \"what comes next?\", you immediately know it is 12.",
    nthBoxBadge: "THE SPECIAL VARIABLE \"n\" (nth TERM)",
    nthBoxDesc: "Instead of adding repeatedly to determine (for instance) the 100th number, we use a general formula called the nth term.",
    nthBullet1: "Variable n denotes position (1st, 2nd, 3rd, ...).",
    nthBullet2: "It is strictly a positive natural integer (n ≥ 1).",
    nthBullet3: "For even numbers, the formula is 2 · n. If n ＝ 100, the 100th term is 2 · 100 ＝ 200.",

    // Section 2
    sec2Title: "From Shapes to Formulas",
    sec2Intro: "Many sequences originate in geometric designs. Imagine arranging squares in a single line using matchsticks. The first square requires 4 matchsticks. Every subsequent square attaches to the previous one, so it requires only 3 additional matchsticks.",
    lab1Title: "🛠️ Lab 1: Building Squares (The Pattern 3n ＋ 1)",
    stepNumberLabel: "STEP NO. (n) - NUMBER OF SQUARES",
    lineCalculationTitle: "LINE CALCULATION",
    lineCalculationDesc: "The 1st stick is placed on the far left. After that, each square adds a \"C\" shape consisting of 3 sticks.",
    visualTitle: "VISUAL REPRESENTATION",
    linesUnit: "LINES",

    // Section 3
    sec3Title: "Sequences in Everyday Life",
    prob1Title: "Problem: Restaurant Tables",
    prob1Desc: "In a restaurant, one rectangular table seats 6 guests (2 on each long side and 1 on each short end). When joining 2 tables in a line, the inner ends are lost.",
    prob1Bullet1: "1 table (n ＝ 1): 6 seats",
    prob1Bullet2: "2 tables (n ＝ 2): 10 seats",
    prob1Bullet3: "3 tables (n ＝ 3): 14 seats",
    prob1FormulaLabel: "Formula (nth term): 4 · n ＋ 2",
    prob1Explanation: "Explanation: Each additional table adds 4 seats (top and bottom). The 2 end seats remain fixed.",

    prob2Title: "Problem: Piggy Bank Savings",
    prob2Desc: "John already has €15 in his piggy bank. He decides to save €5 every week.",
    prob2Bullet1: "After 1 week (n ＝ 1): €20",
    prob2Bullet2: "After 2 weeks (n ＝ 2): €25",
    prob2Bullet3: "After 3 weeks (n ＝ 3): €30",
    prob2FormulaLabel: "Formula (nth term): 5 · n ＋ 15",
    prob2Explanation: "Explanation: 15 is the constant starting balance. For each week n, €5 is added (rate of change).",

    // Section 4
    sec4Title: "Lab 2: The Pattern \"Engine\"",
    selectRuleLabel: "SELECT RULE (FORMULA)",
    selectNLabel: "STEP (n) - NUMBER OF TERMS",
    maxTermsHint: "You can inspect up to the first 20 terms of the sequence.",
    machineResultTitle: "ENGINE RESULT",
    formulaPrefix: "RULE",
    calcForLabel: "CALCULATION FOR n ＝",
    termValueLabel: "Value ＝",
    sequenceListTitle: "THE SEQUENCE (FIRST",
    sequenceListTitlePost: "TERMS)",
    highlightHelp: "The highlighted number represents the term at position n =",
    highlightHelpPost: ". Hover or tap on any box to inspect its position index.",

    // Rule names
    ruleEven: "Even Numbers",
    ruleOdd: "Odd Numbers",
    ruleTables: "Seating at Tables",
    ruleSquares: "Square Numbers",
    ruleStep5: "Increment by 5",
  }
};

export default function AkolouthiaTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const numLocale = locale === 'el' ? 'el-GR' : 'en-US';
  const variableSymbol = locale === 'el' ? 'ν' : 'n';

  // State για Εργαστήριο 1: Οπτικό Μοτίβο Τετραγώνων
  const [patternStep, setPatternStep] = useState(3);

  // State για Εργαστήριο 2: Μηχανή Κανονικοτήτων
  const [selectedRule, setSelectedRule] = useState('3v+2');
  const [nthTermIndex, setNthTermIndex] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Ορισμοί Κανόνων για το Εργαστήριο 2 με i18n
  const rules = useMemo(() => [
    {
      id: '2v',
      name: t.ruleEven,
      formula: `2 · ${variableSymbol}`,
      calc: (v) => 2 * v
    },
    {
      id: '2v-1',
      name: t.ruleOdd,
      formula: `2 · ${variableSymbol} － 1`,
      calc: (v) => 2 * v - 1
    },
    {
      id: '3v+2',
      name: t.ruleTables,
      formula: `3 · ${variableSymbol} ＋ 2`,
      calc: (v) => 3 * v + 2
    },
    {
      id: 'v2',
      name: t.ruleSquares,
      formula: `${variableSymbol}²`,
      calc: (v) => v * v
    },
    {
      id: '5v-2',
      name: t.ruleStep5,
      formula: `5 · ${variableSymbol} － 2`,
      calc: (v) => 5 * v - 2
    },
  ], [t, variableSymbol]);

  const activeRule = useMemo(
    () => rules.find((r) => r.id === selectedRule) || rules[2],
    [rules, selectedRule]
  );

  // Παραγωγή Ακολουθίας για το Εργαστήριο 2
  const sequenceData = useMemo(() => {
    const seq = [];
    for (let i = 1; i <= nthTermIndex; i++) {
      seq.push(activeRule.calc(i));
    }
    return seq;
  }, [activeRule, nthTermIndex]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/25-akolouthia-ask"
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

        {/* 1. ΤΙ ΕΙΝΑΙ Η ΚΑΝΟΝΙΚΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.sec1Intro}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-indigo-900 text-base break-words">
                  {t.evenExampleTitle}
                </div>
                <div className="font-mono text-lg font-bold text-indigo-700 break-words">
                  {t.evenExampleSeq}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.evenExampleDesc}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 h-full">
                <div className="text-xs font-bold uppercase text-indigo-800 tracking-wider break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.nthBoxBadge)}
                </div>
                <p className="text-slate-700 break-words [overflow-wrap:anywhere]">
                  {t.nthBoxDesc}
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 pt-2 break-words [overflow-wrap:anywhere]">
                  <li>{t.nthBullet1}</li>
                  <li>{t.nthBullet2}</li>
                  <li>{t.nthBullet3}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΠΤΙΚΑ ΜΟΤΙΒΑ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p className="break-words [overflow-wrap:anywhere]">
              {t.sec2Intro}
            </p>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers & Πληροφορίες */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase break-words">
                    {toCleanUppercase(t.stepNumberLabel)}
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPatternStep, -1, 1, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Decrease pattern step"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-xl font-mono px-2 truncate">
                      {variableSymbol} ＝ {patternStep}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPatternStep, 1, 1, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Increase pattern step"
                    >
                      ＋
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold break-words">
                      {toCleanUppercase(t.lineCalculationTitle)}
                    </div>
                    <div className="text-lg font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1">
                      <span>3 · {patternStep} ＋ 1 ＝</span>
                      <span className="text-amber-600 text-2xl font-black">
                        {3 * patternStep + 1}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {t.lineCalculationDesc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Οπτικοποίηση SVG Responsive */}
              <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 self-start w-full text-left break-words">
                  {toCleanUppercase(t.visualTitle)} ({3 * patternStep + 1} {toCleanUppercase(t.linesUnit)})
                </div>
                <div className="w-full max-w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${patternStep * 40 + 20} 60`}
                    className="w-full h-auto max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Αρχική Κατακόρυφη Γραμμή (Το σταθερό "1") */}
                    <line x1="10" y1="10" x2="10" y2="50" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <text x="5" y="35" fill="#f59e0b" fontSize="8" fontWeight="bold" transform="rotate(-90 5,35)">+1</text>

                    {/* Τα "C" (3 γραμμές) για κάθε βήμα */}
                    {Array.from({ length: patternStep }).map((_, i) => {
                      const startX = 10 + i * 40;
                      const nextX = startX + 40;
                      return (
                        <g key={`sq-${i}`}>
                          {/* Πάνω γραμμή */}
                          <line x1={startX} y1="10" x2={nextX} y2="10" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                          {/* Κάτω γραμμή */}
                          <line x1={startX} y1="50" x2={nextX} y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                          {/* Δεξιά γραμμή */}
                          <line x1={nextX} y1="10" x2={nextX} y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

                          {/* Ετικέτα +3 */}
                          <text x={startX + 14} y="34" fill="#38bdf8" fontSize="12" fontWeight="bold">+3</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <h3 className="font-bold text-amber-950 text-lg break-words">
                {t.prob1Title}
              </h3>
              <p className="text-slate-700 break-words [overflow-wrap:anywhere]">
                {t.prob1Desc}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                <li>{t.prob1Bullet1}</li>
                <li>{t.prob1Bullet2}</li>
                <li>{t.prob1Bullet3}</li>
              </ul>
              <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-800 break-words">
                {t.prob1FormulaLabel}
              </div>
              <p className="text-xs text-slate-600 pt-2 break-words [overflow-wrap:anywhere]">
                {t.prob1Explanation}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <h3 className="font-bold text-emerald-950 text-lg break-words">
                {t.prob2Title}
              </h3>
              <p className="text-slate-700 break-words [overflow-wrap:anywhere]">
                {t.prob2Desc}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                <li>{t.prob2Bullet1}</li>
                <li>{t.prob2Bullet2}</li>
                <li>{t.prob2Bullet3}</li>
              </ul>
              <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 font-mono text-center font-bold text-emerald-800 break-words">
                {t.prob2FormulaLabel}
              </div>
              <p className="text-xs text-slate-600 pt-2 break-words [overflow-wrap:anywhere]">
                {t.prob2Explanation}
              </p>
            </div>
          </div>
        </section>

        {/* 4. ΕΡΓΑΣΤΗΡΙΟ 2: Η ΜΗΧΑΝΗ ΤΩΝ ΚΑΝΟΝΙΚΟΤΗΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Επιλογές - Steppers (5 cols) */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Επιλογή Κανόνα */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider break-words">
                  {toCleanUppercase(t.selectRuleLabel)}
                </label>
                <div className="flex flex-col gap-2">
                  {rules.map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => setSelectedRule(rule.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border flex items-center justify-between gap-2 break-words ${
                        selectedRule === rule.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="break-words">{rule.name}</span>
                      <span className={`font-mono text-xs shrink-0 ${selectedRule === rule.id ? 'text-indigo-200' : 'text-slate-500 font-semibold'}`}>
                        {rule.formula}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Επιλογή Βήματος ν */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider break-words">
                  {toCleanUppercase(t.selectNLabel)}
                </label>
                <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNthTermIndex, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease term index"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-950 font-black text-xl font-mono px-2 truncate">
                    {variableSymbol} ＝ {nthTermIndex}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNthTermIndex, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase term index"
                  >
                    ＋
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 break-words">
                  {t.maxTermsHint}
                </p>
              </div>
            </div>

            {/* Αποτέλεσμα & Προβολή Σειράς (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl shadow-md text-white space-y-6 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold font-sans break-words">
                  {toCleanUppercase(t.machineResultTitle)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono inline-flex items-center gap-1 shrink-0">
                  <span>{toCleanUppercase(t.formulaPrefix)}:</span>
                  <span>{activeRule.formula}</span>
                </span>
              </div>

              {/* Υπολογισμός του ν-οστού όρου */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 uppercase font-bold break-words">
                  {toCleanUppercase(t.calcForLabel)} {nthTermIndex}
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono text-emerald-400 inline-flex flex-wrap items-center gap-2">
                  <span className="text-slate-300 text-xl sm:text-3xl font-sans">{t.termValueLabel}</span>
                  <span>{activeRule.calc(nthTermIndex).toLocaleString(numLocale)}</span>
                </div>
              </div>

              {/* Λίστα Όλων των Όρων */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold break-words">
                  {toCleanUppercase(t.sequenceListTitle)} {nthTermIndex} {toCleanUppercase(t.sequenceListTitlePost)}
                </div>
                <div className="flex flex-wrap gap-2 max-w-full">
                  {sequenceData.map((val, idx) => (
                    <div
                      key={idx}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-mono text-sm sm:text-base font-bold text-center border transition-all ${
                        idx + 1 === nthTermIndex
                          ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                      title={`${variableSymbol} = ${idx + 1}`}
                    >
                      {val.toLocaleString(numLocale)}
                    </div>
                  ))}
                  {nthTermIndex < 20 && (
                    <div className="min-w-[40px] px-3 py-2 rounded-lg font-mono text-base font-bold text-center border bg-slate-900 border-slate-800 text-slate-600 flex items-center justify-center">
                      ...
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed break-words [overflow-wrap:anywhere]">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1 align-middle"></span>
                  <span>{t.highlightHelp} {nthTermIndex}{t.highlightHelpPost}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}