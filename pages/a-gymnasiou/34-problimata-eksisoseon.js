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

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
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
        <span className="pb-0.5 px-1 sm:px-1.5 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 sm:px-1.5 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

const gcd = (a, b) => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// ============================================================================
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n
// ============================================================================
const TRANSLATIONS = {
  el: {
    pageTitle: "Προβλήματα με Εξισώσεις αx + β = γ | Α' Γυμνασίου",
    pageDescription: "Επίλυση προβλημάτων καθημερινής ζωής με εξισώσεις, μεθοδολογία τεσσάρων σταδίων, κλασματική επίλυση και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 30 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Επίλυση Προβλημάτων με Εξισώσεις",
    mainSubtitle: "Μαθαίνουμε πώς να μετατρέπουμε καταστάσεις της καθημερινής ζωής (αγορές, χρεώσεις υπηρεσιών, ηλικίες, γεωμετρικά σχήματα) σε εξισώσεις της μορφής α·x ＋ β ＝ γ και να βρίσκουμε τις απαντήσεις με μεθοδικότητα.",

    // Section 1
    sec1Title: "Τα 4 Στάδια για την Επίλυση κάθε Προβλήματος",
    stage1Badge: "ΣΤΑΔΙΟ 1",
    stage1Title: "Επιλογή Αγνώστου",
    stage1Desc: "Διαβάζουμε προσεκτικά την εκφώνηση, ξεχωρίζουμε τα δεδομένα και ορίζουμε με ένα γράμμα (συνήθως x) την ποσότητα που αναζητούμε, προσδιορίζοντας τη μονάδα μέτρησης (π.χ. €, km, έτη).",
    stage1Example: "«Έστω x τα χιλιόμετρα»",

    stage2Badge: "ΣΤΑΔΙΟ 2",
    stage2Title: "Κατασκευή Εξίσωσης",
    stage2Desc: "Μεταφράζουμε τις λεκτικές σχέσεις του προβλήματος σε μαθηματική γλώσσα, συνδέοντας τα δεδομένα με τον άγνωστο x σε μια ισότητα δύο μελών.",
    stage2Formula: "α · x ＋ β ＝ γ",

    stage3Badge: "ΣΤΑΔΙΟ 3",
    stage3Title: "Επίλυση Εξίσωσης",
    stage3Desc: "Χωρίζουμε γνωστούς από αγνώστους, κάνουμε αναγωγή ομοίων όρων και διαιρούμε με τον συντελεστή του x, εκφράζοντας το αποτέλεσμα σε μορφή κλάσματος.",

    stage4Badge: "ΣΤΑΔΙΟ 4",
    stage4Title: "Έλεγχος & Απάντηση",
    stage4Desc: "Ελέγχουμε αν η λύση που βρήκαμε είναι λογική για τις συνθήκες του προβλήματος (π.χ. ένα μήκος δεν μπορεί να είναι αρνητικό, ο αριθμός ανθρώπων πρέπει να είναι φυσικός) και διατυπώνουμε την τελική απάντηση.",
    stage4Example: "«Διανύθηκαν 12 km»",

    // Section 2: Lab 1
    sec2Title: "🛠️ Εργαστήριο 1: Διαδραστικό Πρόβλημα Μεταφοράς (Κόστος Διαδρομής)",
    taxiProblemPrompt: (base, perKm, total) =>
      `Ένα ταξί έχει πάγια χρέωση εκκίνησης (σημαία) ${base} € και χρεώνει επιπλέον ${perKm} € για κάθε χιλιόμετρο διαδρομής. Αν ο επιβάτης πλήρωσε συνολικά ${total} €, πόσα χιλιόμετρα διένυσε;`,
    chargePerKmLabel: "ΧΡΕΩΣΗ/KM (α)",
    baseFareLabel: "ΣΗΜΑΙΑ (β)",
    totalCostLabel: "ΣΥΝΟΛΟ (γ)",
    flowTitle: "ΡΟΗ ΕΠΙΛΥΣΗΣ ΜΕ ΕΞΙΣΩΣΗ",
    resultBadge: (val) => `ΑΠΟΤΕΛΕΣΜΑ: ${val} KM`,
    taxiStage12Title: "Στάδιο 1 & 2: Ορισμός Αγνώστου & Εξίσωση",
    taxiStage12Desc: "Έστω x τα χιλιόμετρα της διαδρομής.",
    taxiStage3Title: "Στάδιο 3: Επίλυση της Εξίσωσης",
    taxiStage4Title: "Στάδιο 4: Επαλήθευση & Τελική Απάντηση",
    taxiVerificationCheck: (a, km, b, total) =>
      `Έλεγχος: ${a} · ${km} ＋ ${b} ＝ ${a * km} ＋ ${b} ＝ ${total} €.`,
    taxiFinalAnswer: (km) =>
      `Απάντηση: Ο επιβάτης διένυσε ακριβώς ${km} χιλιόμετρα.`,

    // Section 3: Lab 2
    sec3Title: "🛠️ Εργαστήριο 2: Γεωμετρικό Πρόβλημα (Διαστάσεις Οικοπέδου)",
    rectProblemPrompt: (diff, p) =>
      `Ένα ορθογώνιο οικόπεδο έχει μήκος κατά ${diff} μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του οικοπέδου είναι ${p} μέτρα, ποιες είναι οι διαστάσεις του;`,
    rectDiffLabel: "ΔΙΑΦΟΡΑ ΜΗΚΟΥΣ ΑΠΟ ΠΛΑΤΟΣ (m)",
    perimeterLabel: "ΣΥΝΟΛΙΚΗ ΠΕΡΙΜΕΤΡΟΣ (m)",
    rectWidthSummary: "Πλάτος: x",
    rectLengthSummary: (d) => `Μήκος: x ＋ ${d}`,
    rectPerimeterSummary: (d, constB) => `Περίμετρος: 2 · x ＋ 2 · (x ＋ ${d}) ＝ 4x ＋ ${constB}`,
    geoModelingBadge: "ΓΕΩΜΕΤΡΙΚΗ ΜΟΝΤΕΛΟΠΟΙΗΣΗ",
    rectLengthLabel: (d, val) => `Μήκος: x ＋ ${d}${val ? ` (${val} m)` : ''}`,
    rectWidthLabel: (val) => `x${val ? ` (${val} m)` : ''}`,
    rectWidthUnit: "m (Πλάτος)",
    rectLengthResult: (w, d, l) => `Μήκος: ${w} ＋ ${d} ＝ ${l} m.`,
    rectInvalidWarning: "⚠️ Η περίμετρος είναι πολύ μικρή για τη συγκεκριμένη διαφορά μήκους.",

    // Section 4
    sec4Title: "Χαρακτηριστικές Κατηγορίες Προβλημάτων",
    cat1Badge: "ΚΑΤΗΓΟΡΙΑ 1",
    cat1Title: "Διαδοχικοί Αριθμοί",
    cat1Desc: "Όταν δύο ή τρεις αριθμοί είναι διαδοχικοί ακέραιοι, τους συμβολίζουμε ως x, x ＋ 1, x ＋ 2.",
    cat1Example: "x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44 ➔ x ＝ 22",

    cat2Badge: "ΚΑΤΗΓΟΡΙΑ 2",
    cat2Title: "Ηλικίες",
    cat2Desc: "Η διαφορά ηλικίας δύο ανθρώπων παραμένει πάντα σταθερή με το πέρασμα των χρόνων.",
    cat2Example: "x ＋ (x ＋ 26) ＝ 40 ➔ 2x ＝ 14 ➔ x ＝ 7 ετών",

    cat3Badge: "ΚΑΤΗΓΟΡΙΑ 3",
    cat3Title: "Καταμερισμός Ποσού",
    cat3Desc: "Ένα ποσό μοιράζεται σε μέρη όπου το ένα εξαρτάται από το άλλο (π.χ. το διπλάσιο συν ένα σταθερό ποσό).",
    cat3Example: "x ＋ 2x ＋ 10 ＝ 100 ➔ 3x ＝ 90 ➔ x ＝ 30 €"
  },
  en: {
    pageTitle: "Word Problems with Equations ax + b = c | Grade 7 Math",
    pageDescription: "Solving real-world problems with linear equations, 4-stage methodology, fractional solving, and interactive laboratories.",
    backText: "Grade 7 Math",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 30 • THEORY & LAB",
    mainTitle: "Solving Word Problems with Equations",
    mainSubtitle: "Learn how to convert everyday situations (purchases, service fees, ages, geometric figures) into linear equations of the form a·x ＋ b ＝ c and solve them methodically.",

    // Section 1
    sec1Title: "The 4 Stages of Problem Solving",
    stage1Badge: "STAGE 1",
    stage1Title: "Identify the Variable",
    stage1Desc: "Carefully read the problem statement, identify the given quantities, and designate the unknown quantity with a letter (typically x), specifying units (e.g. €, km, years).",
    stage1Example: '"Let x be the distance in km"',

    stage2Badge: "STAGE 2",
    stage2Title: "Formulate the Equation",
    stage2Desc: "Translate the verbal conditions into algebraic expressions, relating given values to the unknown variable x in an equality of two sides.",
    stage2Formula: "a · x ＋ b ＝ c",

    stage3Badge: "STAGE 3",
    stage3Title: "Solve the Equation",
    stage3Desc: "Separate variables from constants, collect like terms, and divide by the coefficient of x, writing the solution in fractional form.",

    stage4Badge: "STAGE 4",
    stage4Title: "Verify & State Answer",
    stage4Desc: "Check whether the calculated root is reasonable in the problem context (e.g. length cannot be negative, counts of people must be positive integers) and formulate the final answer.",
    stage4Example: '"Distance traveled was 12 km"',

    // Section 2: Lab 1
    sec2Title: "🛠️ Lab 1: Interactive Transportation Cost Problem (Taxi Ride)",
    taxiProblemPrompt: (base, perKm, total) =>
      `A taxi charges a flat pickup fee of ${base} € plus ${perKm} € per kilometer traveled. If a passenger paid a total of ${total} €, how many kilometers did they travel?`,
    chargePerKmLabel: "RATE/KM (a)",
    baseFareLabel: "BASE FARE (b)",
    totalCostLabel: "TOTAL (c)",
    flowTitle: "EQUATION SOLVING FLOW",
    resultBadge: (val) => `RESULT: ${val} KM`,
    taxiStage12Title: "Stages 1 & 2: Define Variable & Equation",
    taxiStage12Desc: "Let x be the trip distance in kilometers.",
    taxiStage3Title: "Stage 3: Solve the Equation",
    taxiStage4Title: "Stage 4: Verification & Final Answer",
    taxiVerificationCheck: (a, km, b, total) =>
      `Check: ${a} · ${km} ＋ ${b} ＝ ${a * km} ＋ ${b} ＝ ${total} €.`,
    taxiFinalAnswer: (km) =>
      `Answer: The passenger traveled exactly ${km} kilometers.`,

    // Section 3: Lab 2
    sec3Title: "🛠️ Lab 2: Geometric Problem (Plot Dimensions)",
    rectProblemPrompt: (diff, p) =>
      `A rectangular plot of land has a length ${diff} meters greater than its width. If the perimeter is ${p} meters, what are its dimensions?`,
    rectDiffLabel: "LENGTH MINUS WIDTH (m)",
    perimeterLabel: "TOTAL PERIMETER (m)",
    rectWidthSummary: "Width: x",
    rectLengthSummary: (d) => `Length: x ＋ ${d}`,
    rectPerimeterSummary: (d, constB) => `Perimeter: 2 · x ＋ 2 · (x ＋ ${d}) ＝ 4x ＋ ${constB}`,
    geoModelingBadge: "GEOMETRIC MODELING",
    rectLengthLabel: (d, val) => `Length: x ＋ ${d}${val ? ` (${val} m)` : ''}`,
    rectWidthLabel: (val) => `x${val ? ` (${val} m)` : ''}`,
    rectWidthUnit: "m (Width)",
    rectLengthResult: (w, d, l) => `Length: ${w} ＋ ${d} ＝ ${l} m.`,
    rectInvalidWarning: "⚠️ The perimeter is too small for this specified length difference.",

    // Section 4
    sec4Title: "Common Categories of Word Problems",
    cat1Badge: "CATEGORY 1",
    cat1Title: "Consecutive Integers",
    cat1Desc: "When two or three numbers are consecutive integers, express them as x, x ＋ 1, x ＋ 2.",
    cat1Example: "x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44 ➔ x ＝ 22",

    cat2Badge: "CATEGORY 2",
    cat2Title: "Age Problems",
    cat2Desc: "The difference in ages between two people remains constant over time.",
    cat2Example: "x ＋ (x ＋ 26) ＝ 40 ➔ 2x ＝ 14 ➔ x ＝ 7 years old",

    cat3Badge: "CATEGORY 3",
    cat3Title: "Allocating Amounts",
    cat3Desc: "A total amount is distributed into parts where one part depends on another (e.g. double plus a constant).",
    cat3Example: "x ＋ 2x ＋ 10 ＝ 100 ➔ 3x ＝ 90 ➔ x ＝ 30 €"
  }
};

export default function ProblimataEksisoseonTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // State για Εργαστήριο 1: Πρόβλημα Μεταφορών (Ταξί)
  // Εξίσωση: a * x + b = c (όπου a = κόστος ανά km, b = πάγια σημαία, c = συνολικό κόστος)
  const [taxiPerKm, setTaxiPerKm] = useState(2); // a (€/km)
  const [taxiBase, setTaxiBase] = useState(4); // b (€ πάγιο)
  const [taxiTotal, setTaxiTotal] = useState(28); // c (€ σύνολο)

  // State για Εργαστήριο 2: Γεωμετρικό Πρόβλημα Περιμέτρου Ορθογωνίου
  // Μήκος = x + diff, Πλάτος = x. Περίμετρος = 2x + 2(x + diff) = 4x + 2*diff = P
  const [rectDiff, setRectDiff] = useState(6); // πόσο μεγαλύτερο είναι το μήκος
  const [rectPerimeter, setRectPerimeter] = useState(52); // συνολική περίμετρος

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ταξί)
  const taxiDistNumerator = useMemo(() => taxiTotal - taxiBase, [taxiTotal, taxiBase]);
  const taxiGcd = useMemo(() => gcd(taxiDistNumerator, taxiPerKm), [taxiDistNumerator, taxiPerKm]);
  const taxiSimpNum = useMemo(() => Math.abs(taxiDistNumerator) / taxiGcd, [taxiDistNumerator, taxiGcd]);
  const taxiSimpDen = useMemo(() => Math.abs(taxiPerKm) / taxiGcd, [taxiPerKm, taxiGcd]);
  const isTaxiInteger = taxiSimpDen === 1;
  const taxiFinalKm = useMemo(() => {
    if (taxiPerKm === 0) return 0;
    return Number((taxiDistNumerator / taxiPerKm).toFixed(2));
  }, [taxiDistNumerator, taxiPerKm]);

  // Υπολογισμοί Εργαστηρίου 2 (Ορθογώνιο)
  const rectConstB = useMemo(() => 2 * rectDiff, [rectDiff]);
  const rectNumerator = useMemo(() => rectPerimeter - rectConstB, [rectPerimeter, rectConstB]);
  const rectWidthX = useMemo(() => {
    return Number((rectNumerator / 4).toFixed(2));
  }, [rectNumerator]);
  const rectLengthVal = useMemo(() => {
    return Number((rectWidthX + rectDiff).toFixed(2));
  }, [rectWidthX, rectDiff]);
  const isRectValid = rectWidthX > 0;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/34-problimata-eksisoseon-ask"
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

        {/* 1. ΤΑ 4 ΣΤΑΔΙΑ ΕΠΙΛΥΣΗΣ ΠΡΟΒΛΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Στάδιο 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.stage1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.stage1Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.stage1Desc}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-indigo-100 text-indigo-950 font-bold text-center font-mono text-xs break-words [overflow-wrap:anywhere]">
                {t.stage1Example}
              </div>
            </div>

            {/* Στάδιο 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.stage2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.stage2Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.stage2Desc}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-sky-100 text-sky-950 font-bold text-center font-mono text-xs break-words [overflow-wrap:anywhere]">
                {t.stage2Formula}
              </div>
            </div>

            {/* Στάδιο 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.stage3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.stage3Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.stage3Desc}
                </p>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-amber-100 text-amber-950 font-bold text-center font-mono text-xs inline-flex flex-wrap items-center justify-center break-words [overflow-wrap:anywhere]">
                <span>x ＝ </span>
                <Frac num={locale === 'el' ? 'γ － β' : 'c － b'} den={locale === 'el' ? 'α' : 'a'} />
              </div>
            </div>

            {/* Στάδιο 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.stage4Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.stage4Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.stage4Desc}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-100 text-emerald-950 font-bold text-center font-mono text-xs break-words [overflow-wrap:anywhere]">
                {t.stage4Example}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΠΡΟΒΛΗΜΑ ΚΟΣΤΟΥΣ ΜΕΤΑΦΟΡΑΣ (ΤΑΞΙ) */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="space-y-2 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            <p>
              <strong>{locale === 'el' ? 'Εκφώνηση:' : 'Problem statement:'}</strong>{' '}
              {t.taxiProblemPrompt(formatNumber(taxiBase), formatNumber(taxiPerKm), formatNumber(taxiTotal))}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.chargePerKmLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiPerKm, -1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {formatNumber(taxiPerKm)} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiPerKm, 1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.baseFareLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiBase, -1, 1, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {formatNumber(taxiBase)} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiBase, 1, 1, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.totalCostLabel)}
                </label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiTotal, -2, 10, 60, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {formatNumber(taxiTotal)} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiTotal, 2, 10, 60, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Αναλυτική Επίλυση Βήμα-Βήμα (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.flowTitle)}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                  {toCleanUppercase(t.resultBadge(formatNumber(taxiFinalKm)))}
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px] break-words [overflow-wrap:anywhere]">
                    {t.taxiStage12Title}
                  </div>
                  <div className="text-slate-200 break-words [overflow-wrap:anywhere]">
                    {t.taxiStage12Desc}
                  </div>
                  <div className="text-amber-300 font-mono font-bold text-sm sm:text-base pt-0.5 inline-flex flex-wrap items-center gap-1">
                    <span>{taxiPerKm} · x ＋ {taxiBase} ＝ {taxiTotal}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <div className="text-slate-400 font-bold uppercase text-[10px] break-words [overflow-wrap:anywhere]">
                    {t.taxiStage3Title}
                  </div>
                  <div className="text-slate-200 font-mono inline-flex flex-wrap items-center gap-1">
                    <span>{taxiPerKm} · x ＝ {taxiTotal} － {taxiBase}</span>
                    <span>➔</span>
                    <span>{taxiPerKm} · x ＝ {taxiDistNumerator}</span>
                  </div>
                  <div className="font-mono text-emerald-400 text-sm sm:text-base font-bold inline-flex items-center flex-wrap gap-1 pt-1">
                    <span>x ＝ </span>
                    <Frac num={taxiDistNumerator} den={taxiPerKm} />
                    {!isTaxiInteger && (
                      <>
                        <span>＝ </span>
                        <Frac num={taxiSimpNum} den={taxiSimpDen} />
                      </>
                    )}
                    <span>＝ {formatNumber(taxiFinalKm)} km</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-emerald-300 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px] break-words [overflow-wrap:anywhere]">
                    {t.taxiStage4Title}
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.taxiVerificationCheck(taxiPerKm, formatNumber(taxiFinalKm), taxiBase, taxiTotal)}
                  </div>
                  <div className="font-bold text-white break-words [overflow-wrap:anywhere]">
                    {t.taxiFinalAnswer(formatNumber(taxiFinalKm))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 2: ΓΕΩΜΕΤΡΙΚΟ ΠΡΟΒΛΗΜΑ ΠΕΡΙΜΕΤΡΟΥ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="space-y-2 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            <p>
              <strong>{locale === 'el' ? 'Εκφώνηση:' : 'Problem statement:'}</strong>{' '}
              {t.rectProblemPrompt(formatNumber(rectDiff), formatNumber(rectPerimeter))}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.rectDiffLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectDiff, -1, 1, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    ＋{formatNumber(rectDiff)} m
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectDiff, 1, 1, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.perimeterLabel)}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectPerimeter, -4, 24, 120, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-xl border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {locale === 'el' ? 'Π' : 'P'} ＝ {formatNumber(rectPerimeter)} m
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectPerimeter, 4, 24, 120, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 break-words [overflow-wrap:anywhere]">
                <div>{t.rectWidthSummary}</div>
                <div>{t.rectLengthSummary(rectDiff)}</div>
                <div>{t.rectPerimeterSummary(rectDiff, rectConstB)}</div>
              </div>
            </div>

            {/* Οπτική Προβολή SVG & Λύση (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.geoModelingBadge)}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                  {locale === 'el' ? 'Π' : 'P'} ＝ {formatNumber(rectPerimeter)} M
                </span>
              </div>

              {/* Responsive SVG Σχήμα */}
              <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 sm:p-4 flex justify-center items-center">
                <svg viewBox="0 0 340 160" className="w-full max-w-[280px] sm:max-w-[320px] h-auto">
                  <rect x="35" y="30" width="270" height="95" rx="6" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Ετικέτες Διαστάσεων */}
                  <text x="170" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {t.rectLengthLabel(rectDiff, isRectValid ? formatNumber(rectLengthVal) : null)}
                  </text>
                  <text x="170" y="145" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {t.rectLengthLabel(rectDiff, null)}
                  </text>
                  <text x="25" y="82" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="end">
                    {t.rectWidthLabel(isRectValid ? formatNumber(rectWidthX) : null)}
                  </text>
                  <text x="315" y="82" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="start">
                    x
                  </text>
                </svg>
              </div>

              {/* Βήματα Επίλυσης */}
              <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200 break-words [overflow-wrap:anywhere]">
                <div className="font-mono text-amber-300 font-bold text-sm sm:text-base inline-flex flex-wrap items-center gap-1">
                  <span>{locale === 'el' ? 'Εξίσωση:' : 'Equation:'} 4 · x ＋ {rectConstB} ＝ {rectPerimeter}</span>
                </div>
                <div className="font-mono text-indigo-200 inline-flex flex-wrap items-center gap-1">
                  <span>4 · x ＝ {rectPerimeter} － {rectConstB}</span>
                  <span>➔</span>
                  <span>4 · x ＝ {rectNumerator}</span>
                </div>
                {isRectValid ? (
                  <div className="pt-1 text-emerald-300 space-y-1.5">
                    <div className="inline-flex items-center flex-wrap font-mono font-bold text-sm sm:text-base gap-1">
                      <span>x ＝ </span>
                      <Frac num={rectNumerator} den={4} />
                      <span> ＝ {formatNumber(rectWidthX)} {t.rectWidthUnit}</span>
                    </div>
                    <div className="break-words [overflow-wrap:anywhere]">
                      {t.rectLengthResult(formatNumber(rectWidthX), formatNumber(rectDiff), formatNumber(rectLengthVal))}
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-400 font-bold pt-1 break-words [overflow-wrap:anywhere]">
                    {t.rectInvalidWarning}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΣΥΝΗΘΗ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Κατηγορία 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                {toCleanUppercase(t.cat1Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.cat1Title}
              </h3>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.cat1Desc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-words [overflow-wrap:anywhere]">
                {t.cat1Example}
              </div>
            </div>

            {/* Κατηγορία 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                {toCleanUppercase(t.cat2Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.cat2Title}
              </h3>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.cat2Desc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-words [overflow-wrap:anywhere]">
                {t.cat2Example}
              </div>
            </div>

            {/* Κατηγορία 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                {toCleanUppercase(t.cat3Badge)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.cat3Title}
              </h3>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.cat3Desc}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-words [overflow-wrap:anywhere]">
                {t.cat3Example}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}