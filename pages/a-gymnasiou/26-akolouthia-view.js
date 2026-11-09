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
    pageTitle: "Αναπαράσταση Κανονικοτήτων | Α' Γυμνασίου",
    pageDesc: "Πολλαπλές αναπαραστάσεις ακολουθιών: πίνακες τιμών, συστήματα αξόνων, οπτικά μοτίβα και ο γενικός όρος α·ν.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 23 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Πολλαπλές Αναπαραστάσεις Κανονικοτήτων",
    mainSubtitle: "Μια μαθηματική ακολουθία μπορεί να πάρει πολλές μορφές! Ανακαλύπτουμε πώς να μεταφράζουμε ένα γεωμετρικό σχήμα σε Πίνακα Τιμών, έπειτα σε Γράφημα (Σύστημα Αξόνων) και τελικά σε Αλγεβρικό Τύπο.",

    // Ενότητα 1
    sec1Title: "Τα Τέσσερα «Πρόσωπα» μιας Ακολουθίας",
    sec1Intro: "Κάθε κανονικότητα (μοτίβο) κρύβει έναν μαθηματικό κανόνα. Για να την κατανοήσουμε και να την επικοινωνήσουμε, χρησιμοποιούμε 4 διαφορετικές «γλώσσες» (αναπαραστάσεις). Ας δούμε το παράδειγμα όπου κάθε μέρα που περνάει αποταμιεύουμε 5 €.",
    rep1Badge: "1. ΛΕΚΤΙΚΗ ΠΕΡΙΓΡΑΦΗ",
    rep1Title: "Με τα Λόγια Μας",
    rep1Desc: "Περιγράφουμε τον κανόνα σε φυσική γλώσσα:",
    rep1Quote: "«Το συνολικό ποσό που έχουμε αποταμιεύσει ισούται με 5 ευρώ πολλαπλασιασμένα με τον αριθμό των ημερών.»",
    rep2Badge: "2. ΠΙΝΑΚΑΣ ΤΙΜΩΝ",
    rep2Title: "Οργάνωση Δεδομένων",
    rep2Desc: "Φτιάχνουμε έναν πίνακα με 2 γραμμές ή 2 στήλες.",
    tableColDay: "Ημέρα (ν)",
    tableColAmount: "Ποσό (€)",
    rep3Badge: "3. ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ",
    rep3Title: "Οπτικοποίηση Δεδομένων",
    rep3Desc: "Παίρνουμε τις τιμές από τον πίνακα ως ζεύγη συντεταγμένων (x, y), π.χ. (1, 5) και (2, 10), και τα τοποθετούμε ως κουκκίδες στο επίπεδο. Έτσι βλέπουμε την πορεία της κανονικότητας.",
    rep4Badge: "4. ΑΛΓΕΒΡΙΚΟΣ ΤΥΠΟΣ",
    rep4Title: "Ο ν-οστός Όρος",
    rep4Desc: "Είναι η μαθηματική σχέση (ο τύπος) που ενώνει τη θέση (ν) με την τιμή.",

    // Ενότητα 2
    sec2Title: "Από την Εικόνα στον Πίνακα Τιμών",
    sec2Intro: "Όταν βλέπουμε σχήματα να επαναλαμβάνονται, μπορούμε να μετρήσουμε τα στοιχεία τους (π.χ. πλευρές, σπίρτα, τελείες) για κάθε βήμα ν. Αυτές τις μετρήσεις τις καταχωρούμε σε έναν Πίνακα Τιμών.",
    lab1Title: "🛠️ Εργαστήριο 1: Κατασκευή Ανεξάρτητων Τριγώνων",
    stepTrianglesLabel: "ΒΗΜΑ (ν) - ΠΛΗΘΟΣ ΤΡΙΓΩΝΩΝ",
    dynamicTableTitle: "ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ",
    tableColStep: "Βήμα (ν)",
    tableColLines: "Αριθμός Γραμμών",
    generalTermLabel: "Γενικός Όρος",
    visualRepTitle: "ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ",
    linesUnit: "ΓΡΑΜΜΕΣ",
    lab1Explanation: "Για κάθε τρίγωνο χρειαζόμαστε 3 γραμμές. Εφόσον είναι ξεχωριστά, ο τύπος είναι απλός πολλαπλασιασμός: 3 · ν.",

    // Ενότητα 3
    sec3Title: "Ο Γενικός Όρος α · ν & Το Σύστημα Αξόνων",
    sec3Intro: "Πολλές κανονικότητες στην καθημερινή ζωή εκφράζονται με τον απλό τύπο α · ν (με α ρητό αριθμό). Για παράδειγμα:",
    sec3Bullet1: "Αγοράζεις ψωμί προς 1,20 € το καθένα. Κόστος: 1,2 · ν.",
    sec3Bullet2: "Ένα χρέος αυξάνεται κατά 5 € τη μέρα. Υπόλοιπο: －5 · ν.",
    graphBoxTitle: "Αναπαράσταση σε Γράφημα",
    graphBoxDesc1: "1. Οριζόντιος Άξονας (x): βάζουμε τη θέση (ν ＝ 1, 2, 3...).",
    graphBoxDesc2: "2. Κατακόρυφος Άξονας (y): βάζουμε την τιμή (το αποτέλεσμα του α · ν).",
    pairsSampleLabel: "Ζεύγη: (1, 1 · α), (2, 2 · α), (3, 3 · α) ...",

    // Εργαστήριο 2
    lab2Title: "🛠️ Εργαστήριο 2: Δυναμικό Σύστημα Αξόνων για τον τύπο α · ν",
    coeffLabel: "ΣΥΝΤΕΛΕΣΤΗΣ (α)",
    coeffHint: "Δοκίμασε θετικές και αρνητικές τιμές (-5 έως ＋5).",
    pairsTableTitle: "ΠΙΝΑΚΑΣ ΖΕΥΓΩΝ (ν, y)",
    colTermN: "ν",
    colValY: "Τιμή (y)",
    colPair: "Ζεύγος",
    axesTitle: "ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ",
    formulaPrefix: "ΤΥΠΟΣ",
    axesConclusion: "Όταν η κανονικότητα έχει τη μορφή α · ν, τα σημεία στο σύστημα αξόνων βρίσκονται πάντοτε πάνω σε μια ευθεία γραμμή που ξεκινάει από την αρχή (0, 0)."
  },
  en: {
    pageTitle: "Representations of Sequences | 7th Grade Math",
    pageDesc: "Multiple representations of sequences: tables of values, coordinate systems, visual patterns, and the general term a · n.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 23 • THEORY & LAB",
    mainTitle: "Multiple Representations of Sequences",
    mainSubtitle: "A mathematical sequence can take multiple forms! Discover how to translate geometric figures into a Table of Values, then into a Coordinate Graph, and ultimately into an Algebraic Formula.",

    // Section 1
    sec1Title: "The Four \"Faces\" of a Sequence",
    sec1Intro: "Every mathematical pattern hides an underlying rule. To comprehend and communicate it, we use 4 distinct representations. Consider the example where each passing day we save €5.",
    rep1Badge: "1. VERBAL DESCRIPTION",
    rep1Title: "In Words",
    rep1Desc: "Describe the rule in plain language:",
    rep1Quote: "\"The total amount saved equals 5 euros multiplied by the number of days elapsed.\"",
    rep2Badge: "2. TABLE OF VALUES",
    rep2Title: "Organizing Data",
    rep2Desc: "Construct a structured table with 2 rows or columns.",
    tableColDay: "Day (n)",
    tableColAmount: "Amount (€)",
    rep3Badge: "3. COORDINATE SYSTEM",
    rep3Title: "Visualizing Data",
    rep3Desc: "Take the table entries as ordered pairs (x, y), e.g., (1, 5) and (2, 10), and plot them as coordinate points on the plane to visualize the pattern's progression.",
    rep4Badge: "4. ALGEBRAIC FORMULA",
    rep4Title: "The nth Term",
    rep4Desc: "The general algebraic formula linking position index (n) directly to its output value.",

    // Section 2
    sec2Title: "From Visual Figures to Tables of Values",
    sec2Intro: "When observing repeating patterns, we count their structural elements (edges, matchsticks, dots) for each step index n and enter these counts into a Table of Values.",
    lab1Title: "🛠️ Lab 1: Constructing Independent Triangles",
    stepTrianglesLabel: "STEP (n) - NUMBER OF TRIANGLES",
    dynamicTableTitle: "DYNAMIC TABLE OF VALUES",
    tableColStep: "Step (n)",
    tableColLines: "Number of Lines",
    generalTermLabel: "General Term",
    visualRepTitle: "VISUAL REPRESENTATION",
    linesUnit: "LINES",
    lab1Explanation: "Each independent triangle requires 3 lines. Since they do not share edges, the formula is direct multiplication: 3 · n.",

    // Section 3
    sec3Title: "The General Term a · n & Coordinate Systems",
    sec3Intro: "Many real-life patterns are modeled by the linear direct proportion formula a · n (where a is a rational number). For example:",
    sec3Bullet1: "Buying bread at €1.20 per loaf. Cost: 1.2 · n.",
    sec3Bullet2: "A debt increasing by €5 per day. Balance: －5 · n.",
    graphBoxTitle: "Plotting on a Graph",
    graphBoxDesc1: "1. Horizontal Axis (x): place the position index (n ＝ 1, 2, 3...).",
    graphBoxDesc2: "2. Vertical Axis (y): place the output value (the result of a · n).",
    pairsSampleLabel: "Pairs: (1, 1 · a), (2, 2 · a), (3, 3 · a) ...",

    // Lab 2
    lab2Title: "🛠️ Lab 2: Dynamic Coordinate Plane for Formula a · n",
    coeffLabel: "COEFFICIENT (a)",
    coeffHint: "Experiment with positive and negative coefficients (-5 to ＋5).",
    pairsTableTitle: "COORDINATE PAIRS TABLE (n, y)",
    colTermN: "n",
    colValY: "Value (y)",
    colPair: "Pair",
    axesTitle: "COORDINATE PLANE",
    formulaPrefix: "RULE",
    axesConclusion: "When a pattern follows the form a · n, all points on the coordinate plane lie precisely along a straight line that passes through the origin (0, 0)."
  }
};

export default function AkolouthiaViewTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const numLocale = locale === 'el' ? 'el-GR' : 'en-US';
  const variableSymbol = locale === 'el' ? 'ν' : 'n';

  // State για Εργαστήριο 1: Οπτικό Μοτίβο Τριγώνων (3 * ν)
  const [visualStep, setVisualStep] = useState(3);

  // State για Εργαστήριο 2: Δυναμικό Σύστημα Αξόνων (α * ν)
  const [alphaCoeff, setAlphaCoeff] = useState(4); // Ο συντελεστής α

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      next = Math.round(next * 10) / 10;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Δεδομένα για το γράφημα του Εργαστηρίου 2
  const graphData = useMemo(() => {
    const data = [];
    for (let v = 1; v <= 5; v++) {
      data.push({ v, val: Number((alphaCoeff * v).toFixed(2)) });
    }
    return data;
  }, [alphaCoeff]);

  // Χαρτογράφηση συντεταγμένων SVG για το Σύστημα Αξόνων (Εργαστήριο 2)
  const mapX = (v) => 40 + v * 90;
  const mapY = (val) => 190 - val * (170 / 30);

  const formatDec = (val) => val.toLocaleString(numLocale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/26-akolouthia-view-ask"
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

        {/* 1. ΟΙ 4 ΤΡΟΠΟΙ ΑΝΑΠΑΡΑΣΤΑΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec1Intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1. Λεκτική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rep1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.rep1Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.rep1Desc}
                </p>
              </div>
              <div className="text-[11px] text-slate-500 italic p-3 bg-white rounded-xl border border-slate-200 break-words [overflow-wrap:anywhere]">
                {t.rep1Quote}
              </div>
            </div>

            {/* 2. Πίνακας Τιμών */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rep2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.rep2Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.rep2Desc}
                </p>
              </div>
              <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white">
                <div className="flex bg-slate-200 font-bold text-slate-800 text-[11px]">
                  <div className="flex-1 p-2 border-r border-slate-300 text-center">{t.tableColDay}</div>
                  <div className="flex-1 p-2 text-center">{t.tableColAmount}</div>
                </div>
                <div className="flex border-t border-slate-200 bg-white">
                  <div className="flex-1 p-1.5 border-r border-slate-200 text-center font-mono">1</div>
                  <div className="flex-1 p-1.5 text-center font-mono font-bold text-indigo-700">5</div>
                </div>
                <div className="flex border-t border-slate-200 bg-white">
                  <div className="flex-1 p-1.5 border-r border-slate-200 text-center font-mono">2</div>
                  <div className="flex-1 p-1.5 text-center font-mono font-bold text-indigo-700">10</div>
                </div>
              </div>
            </div>

            {/* 3. Γραφική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rep3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base break-words">
                  {t.rep3Title}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.rep3Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-emerald-800 font-bold text-xs">
                (1, 5), (2, 10), (3, 15)...
              </div>
            </div>

            {/* 4. Γενικός Όρος */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.rep4Badge)}
                </span>
                <h3 className="font-bold text-amber-950 text-base break-words">
                  {t.rep4Title}
                </h3>
                <p className="text-slate-700 break-words [overflow-wrap:anywhere]">
                  {t.rep4Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-center font-mono font-black text-amber-900 text-xl shadow-sm">
                5 · {variableSymbol}
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

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec2Intro}
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 break-words">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers & Πίνακας (5 cols) */}
              <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase break-words">
                    {toCleanUppercase(t.stepTrianglesLabel)}
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVisualStep, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Decrease step"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-xl font-mono px-2 truncate">
                      {variableSymbol} ＝ {visualStep}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVisualStep, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Increase step"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Δυναμικός Πίνακας Τιμών */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-bold break-words">
                    {toCleanUppercase(t.dynamicTableTitle)}
                  </div>
                  <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex bg-indigo-100 font-bold text-indigo-900 text-xs sm:text-sm">
                      <div className="w-1/2 p-2.5 border-r border-indigo-200 text-center">{t.tableColStep}</div>
                      <div className="w-1/2 p-2.5 text-center">{t.tableColLines}</div>
                    </div>
                    {Array.from({ length: Math.min(visualStep, 5) }).map((_, i) => (
                      <div key={i} className={`flex border-t border-slate-200 ${i + 1 === visualStep ? 'bg-amber-50' : 'bg-white'}`}>
                        <div className={`w-1/2 p-2 border-r border-slate-200 text-center font-mono ${i + 1 === visualStep ? 'font-bold text-amber-700' : 'text-slate-600'}`}>
                          {i + 1}
                        </div>
                        <div className={`w-1/2 p-2 text-center font-mono ${i + 1 === visualStep ? 'font-bold text-amber-700' : 'text-slate-600'}`}>
                          {(3 * (i + 1)).toLocaleString(numLocale)}
                        </div>
                      </div>
                    ))}
                    {visualStep > 5 && (
                      <div className="flex border-t border-slate-200 bg-amber-50">
                        <div className="w-1/2 p-2 border-r border-slate-200 text-center font-mono font-bold text-amber-700">
                          {visualStep}
                        </div>
                        <div className="w-1/2 p-2 text-center font-mono font-bold text-amber-700">
                          {(3 * visualStep).toLocaleString(numLocale)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-sm font-bold text-slate-800 pt-2 font-mono">
                    {t.generalTermLabel}: 3 · {variableSymbol}
                  </div>
                </div>
              </div>

              {/* Οπτικοποίηση SVG Responsive */}
              <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 self-start w-full text-left break-words">
                  {toCleanUppercase(t.visualRepTitle)} ({(3 * visualStep).toLocaleString(numLocale)} {toCleanUppercase(t.linesUnit)})
                </div>
                <div className="w-full max-w-full overflow-hidden flex justify-center">
                  <svg
                    viewBox={`0 0 ${visualStep * 40 + 20} 60`}
                    className="w-full h-auto max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Ανεξάρτητα Τρίγωνα */}
                    {Array.from({ length: visualStep }).map((_, i) => {
                      const startX = 10 + i * 40;
                      return (
                        <g key={`tri-${i}`}>
                          <polygon
                            points={`${startX + 15},10 ${startX + 30},45 ${startX},45`}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          <text x={startX + 9} y="35" fill="#f59e0b" fontSize="10" fontWeight="bold">3</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2 break-words [overflow-wrap:anywhere]">
                  {t.lab1Explanation}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Η ΜΟΡΦΗ α * ν ΚΑΙ ΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.sec3Intro}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                <li>{t.sec3Bullet1}</li>
                <li>{t.sec3Bullet2}</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <h3 className="font-bold text-indigo-950 text-base break-words">
                {t.graphBoxTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm space-y-1 break-words [overflow-wrap:anywhere]">
                <span>{t.graphBoxDesc1}</span>
                <br />
                <span>{t.graphBoxDesc2}</span>
              </p>
              <div className="p-2 bg-white rounded-lg border border-indigo-100 font-mono text-center text-xs font-bold text-indigo-700 break-words">
                {t.pairsSampleLabel}
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΥΝΑΜΙΚΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια & Πίνακας (5 cols) */}
              <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase break-words">
                    {toCleanUppercase(t.coeffLabel)}
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setAlphaCoeff, -0.5, -5, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Decrease coefficient"
                    >
                      －
                    </button>
                    <div className="h-full flex flex-col items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 px-2 truncate">
                      <span className="text-indigo-950 font-black text-lg sm:text-xl font-mono">
                        α ＝ {formatDec(alphaCoeff)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setAlphaCoeff, 0.5, -5, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                      aria-label="Increase coefficient"
                    >
                      ＋
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center break-words">
                    {t.coeffHint}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-bold break-words">
                    {toCleanUppercase(t.pairsTableTitle)}
                  </div>
                  <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm">
                      <div className="w-1/3 p-2 border-r border-slate-300 text-center">{t.colTermN}</div>
                      <div className="w-1/3 p-2 border-r border-slate-300 text-center">{t.colValY}</div>
                      <div className="w-1/3 p-2 text-center">{t.colPair}</div>
                    </div>
                    {graphData.map((d, i) => (
                      <div key={i} className="flex border-t border-slate-200 bg-white">
                        <div className="w-1/3 p-1.5 border-r border-slate-200 text-center font-mono text-slate-600 text-xs sm:text-sm">
                          {d.v}
                        </div>
                        <div className="w-1/3 p-1.5 border-r border-slate-200 text-center font-mono text-slate-800 font-bold text-xs sm:text-sm">
                          {formatDec(d.val)}
                        </div>
                        <div className="w-1/3 p-1.5 text-center font-mono text-indigo-700 font-bold text-xs sm:text-sm">
                          ({d.v}, {formatDec(d.val)})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Σύστημα Αξόνων SVG Responsive (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col space-y-4 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 break-words">
                    {toCleanUppercase(t.axesTitle)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono text-xs font-bold shrink-0">
                    {toCleanUppercase(t.formulaPrefix)}: y ＝ {formatDec(alphaCoeff)} · {variableSymbol}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2">
                  <svg
                    viewBox="0 0 600 400"
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Οριζόντιες γραμμές πλέγματος (Y axis) */}
                    {[-30, -20, -10, 10, 20, 30].map((yVal) => (
                      <g key={`grid-y-${yVal}`}>
                        <line x1="40" y1={mapY(yVal)} x2="580" y2={mapY(yVal)} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="35" y={mapY(yVal) + 4} fill="#64748b" fontSize="12" textAnchor="end">{yVal}</text>
                      </g>
                    ))}

                    {/* Κάθετες γραμμές πλέγματος (X axis) */}
                    {[1, 2, 3, 4, 5, 6].map((xVal) => (
                      <g key={`grid-x-${xVal}`}>
                        <line x1={mapX(xVal)} y1="20" x2={mapX(xVal)} y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={mapX(xVal)} y={mapY(0) + 20} fill="#64748b" fontSize="12" textAnchor="middle">{xVal}</text>
                      </g>
                    ))}

                    {/* Κεντρικοί Άξονες */}
                    {/* X-axis (y=0) */}
                    <line x1="30" y1={mapY(0)} x2="590" y2={mapY(0)} stroke="#94a3b8" strokeWidth="2" />
                    <text x="590" y={mapY(0) - 10} fill="#94a3b8" fontSize="14" fontWeight="bold">{variableSymbol}</text>
                    
                    {/* Y-axis (x=0) */}
                    <line x1={mapX(0)} y1="10" x2={mapX(0)} y2="370" stroke="#94a3b8" strokeWidth="2" />
                    <text x={mapX(0) + 10} y="20" fill="#94a3b8" fontSize="14" fontWeight="bold">y</text>
                    <text x={mapX(0) - 10} y={mapY(0) + 15} fill="#94a3b8" fontSize="12" textAnchor="end">0</text>

                    {/* Σχεδιασμός Γραμμής που ενώνει τα σημεία */}
                    <polyline
                      points={`
                        ${mapX(0)},${mapY(0)} 
                        ${mapX(1)},${mapY(alphaCoeff * 1)} 
                        ${mapX(2)},${mapY(alphaCoeff * 2)} 
                        ${mapX(3)},${mapY(alphaCoeff * 3)} 
                        ${mapX(4)},${mapY(alphaCoeff * 4)} 
                        ${mapX(5)},${mapY(alphaCoeff * 5)} 
                        ${mapX(6)},${mapY(alphaCoeff * 6)}
                      `}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      opacity="0.6"
                    />

                    {/* Σχεδιασμός Σημείων (Κουκκίδες) */}
                    {graphData.map((d, i) => (
                      <g key={`pt-${i}`}>
                        <circle cx={mapX(d.v)} cy={mapY(d.val)} r="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                        <text 
                          x={mapX(d.v) + 10} 
                          y={mapY(d.val) - 10} 
                          fill="#bae6fd" 
                          fontSize="12" 
                          fontWeight="bold"
                        >
                          {formatDec(d.val)}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="text-[11px] text-slate-400 text-center leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.axesConclusion}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}