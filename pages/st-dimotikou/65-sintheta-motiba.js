// pages/st-dimotikou/65-sintheta-motiba.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια κλασματική γραμμή (καθαρό JSX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
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

// Λεξικό διεθνοποίησης (i18n)
const TRANSLATIONS = {
  el: {
    metaTitle: "Σύνθετα Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε για τα σύνθετα μοτίβα, τους διπλούς κανόνες, τις σχέσεις δύο μεγεθών σε πίνακες τιμών και πώς προβλέπουμε μελλοντικές τιμές για τη ΣΤ' Δημοτικού.",
    gradeBadge: "ΚΕΦΑΛΑΙΟ 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Σύνθετα Μοτίβα & Σχέσεις Μεγεθών",
    heroDesc: "Προχωράμε πέρα από τα απλά μοτίβα: ανακαλύπτουμε ακολουθίες με διπλούς κανόνες (πολλαπλασιασμό και πρόσθεση μαζί), εναλλασσόμενα βήματα, και μαθαίνουμε πώς να οργανώνουμε πίνακες δύο μεγεθών (όπως χρόνος και ανάπτυξη) για να ανακαλύπτουμε κρυμμένες μαθηματικές σχέσεις!",
    heroSubbadge: "Θεωρία, Διπλοί Κανόνες, Πίνακες Μεγεθών & Διαδραστική Μηχανή",
    heroBtn: "Δοκίμασε τις Ασκήσεις",
    btnExercises: "Ασκήσεις",
    backLinkText: "ΣΤ' Δημοτικού",

    stepsHeading: "Τα Σύνθετα Μοτίβα σε 4 Βήματα",
    stepsSubheading: "Από τον απλό συνδυασμό πράξεων μέχρι τους πίνακες παρατήρησης της πραγματικής ζωής.",

    step1Badge: "ΒΗΜΑ 1",
    step1Tag: "Έννοια",
    step1Title: "Τι είναι Σύνθετο Μοτίβο;",
    step1Desc: "Σε ένα απλό μοτίβο έχουμε ένα μόνο σταθερό βήμα (π.χ. πάντα ＋3). Στο σύνθετο μοτίβο ο κανόνας συνδυάζει δύο πράξεις ή το βήμα αλλάζει διαδοχικά:",
    step1ExTitle: "Παράδειγμα:",
    step1ExSeq: "1, 3, 7, 15, 31, ...",
    step1ExRule: "Κανόνας: «Πολλαπλασιάζω επί 2 και προσθέτω 1» (· 2 ＋ 1).",
    step1ExCalc: "1 · 2 ＋ 1 ＝ 3 ➔ 3 · 2 ＋ 1 ＝ 7 ➔ 7 · 2 ＋ 1 ＝ 15.",
    step1Tip: "Όταν η διαφορά των αριθμών δεν είναι σταθερή, αναζητούμε συνδυασμό πολλαπλασιασμού με πρόσθεση/αφαίρεση!",

    step2Badge: "ΒΗΜΑ 2",
    step2Tag: "Εναλλαγή",
    step2Title: "Εναλλασσόμενοι Κανόνες",
    step2Desc: "Σε ορισμένες ακολουθίες, οι πράξεις εναλλάσσονται κυκλικά από όρο σε όρο:",
    step2ExSeqTitle: "Ακολουθία:",
    step2ExSeq: "2, 6, 5, 15, 14, 42, 41, ...",
    step2ExRule: "Κανόνας: «· 3» και μετά «－ 1»!",
    step2ExCalc: "2 · 3 ＝ 6 ➔ 6 － 1 ＝ 5 ➔ 5 · 3 ＝ 15 ➔ 15 － 1 ＝ 14.",
    step2Tip: "Για να λύσουμε ένα τέτοιο μοτίβο, χωρίζουμε τους όρους σε ζεύγη και ελέγχουμε τη διαδοχή των πράξεων!",

    step3Badge: "ΒΗΜΑ 3",
    step3Tag: "Πίνακες Τιμών",
    step3Title: "Σχέση Δύο Μεγεθών",
    step3Desc: "Στην πραγματικότητα (π.χ. ανάπτυξη παιδιού, κόστος τηλεφώνου), οργανώνουμε τα δεδομένα σε πίνακα δύο γραμμών:",
    tableTimeLabel: "Χρόνος (έτη):",
    tableHeightLabel: "Ύψος (cm):",
    tableSubtext: "Παρατηρούμε το ετήσιο κέρδος (75 ➔ +12 ➔ +10) για να δούμε πώς εξελίσσεται το μέγεθος.",
    step3Tip: "Ο πίνακας μας βοηθά να εντοπίσουμε σχέσεις που δεν φαίνονται με μια απλή ματιά.",

    step4Badge: "ΒΗΜΑ 4",
    step4Tag: "Πρόβλεψη",
    step4Title: "Γενικός Τύπος & Προβλέψεις",
    step4Desc: "Όταν εκφράσουμε τη σχέση με τύπο της μορφής α · ν ＋ β, μπορούμε να κάνουμε υπολογισμούς για το μέλλον:",
    taxiTitle: "Κόστος Ταξί: 3 € πάγιο ＋ 2 € ανά χιλιόμετρο",
    taxiFormula: "Κόστος (ν χλμ) ＝ 2 · ν ＋ 3",
    taxiCalcTitle: "Για διαδρομή ν ＝ 15 χλμ:",
    taxiCalcDetail: "2 · 15 ＋ 3 ＝ 30 ＋ 3 ＝ 33 €!",
    step4Tip: "Τα σύνθετα μοτίβα είναι η γέφυρα ανάμεσα στην αριθμητική του Δημοτικού και την άλγεβρα του Γυμνασίου!",

    lab1Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Διαδραστική Μηχανή Σύνθετου Κανόνα (α · ν ＋ β)",
    lab1Desc: "Επίλεξε τον πολλαπλασιαστή (α) και την προσθήκη (β) για να δημιουργήσεις τον δικό σου σύνθετο κανόνα και υπολόγισε απευθείας τη θέση ν:",
    multLabel: "Πολλαπλασιαστής (α):",
    addLabel: "Σταθερή Προσθήκη (β):",
    posLabel: "Ζητούμενη Θέση (ν):",
    formulaPrefix: "Γενικός Τύπος:",
    calcValLabel: "Τιμή για ν ＝",
    firstTermsTitle: "ΟΙ ΠΡΩΤΟΙ ΟΡΟΙ ΤΟΥ ΣΥΝΘΕΤΟΥ ΜΟΤΙΒΟΥ",
    termPosPrefix: "Θέση ν ＝",
    calcExplTitle: "Υπολογισμός Θέσης",

    lab2Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΙΝΑΚΑΣ ΕΞΕΛΙΞΗΣ",
    lab2Title: "«Πόσο Μεγάλωσες!»: Συσχέτιση Ηλικίας & Ύψους",
    lab2Desc: "Παρακολούθησε πώς μεταβάλλεται το ύψος ενός παιδιού από έτος σε έτος και δες πώς διαβάζουμε σύνθετα μοτίβα μέσα από πραγματικούς πίνακες:",
    selectAgeLabel: "ΕΠΙΛΟΓΗ ΗΛΙΚΙΑΣ (ΕΤΗ):",
    yearsOld: "ετών",
    growthStatsTitle: "Στοιχεία στο",
    growthStatsSuffix: "ο Έτος:",
    initialHeightText: "Αρχικό ύψος στο 1ο έτος ζωής.",
    increaseText: "Αύξηση κατά ＋",
    increaseSuffix: " cm σε σχέση με το προηγούμενο έτος.",
    growthTableHeading: "ΠΙΝΑΚΑΣ ΤΙΜΩΝ (ΕΤΗ 1 ΕΩΣ 10)",
    ageHeader: "Ηλικία (έτη)",
    heightHeader: "Ύψος (cm)",
    gainHeader: "Ετήσια Αύξηση",
    conclusionTitle: "Συμπέρασμα:",
    conclusionText: "Το μοτίβο ανάπτυξης έχει γρήγορη αύξηση στα πρώτα έτη (+12cm, +10cm) και σταθεροποιείται γύρω στα +6cm/έτος.",

    problemsHeading: "Λυμένα Προβλήματα με Σύνθετα Μοτίβα",
    problemsSubheading: "Εφαρμογές διπλών κανόνων και πινάκων τιμών σε ρεαλιστικά σενάρια.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΣΥΝΔΡΟΜΗ ΜΕ ΠΑΓΙΟ",
    prob1Tag: "Κόστος Χρήσης",
    prob1Title: "Υπολογισμός Κόστους Συνδρομητικής Υπηρεσίας",
    prob1Desc: "Μια συνδρομητική πλατφόρμα ταινιών χρεώνει μηνιαίο πάγιο 6 € και επιπλέον 2 € για κάθε νέα ταινία που ενοικιάζει ο χρήστης. Πόσα χρήματα θα πληρώσει ένας συνδρομητής που νοίκιασε 8 ταινίες σε έναν μήνα;",
    prob1TableTitle: "ΔΕΔΟΜΕΝΑ ΧΡΕΩΣΗΣ",
    baseFee: "Πάγιο",
    costPerMovie: "Κόστος/ταινία",
    moviesCount: "Ταινίες (ν)",
    stepsTitle: "Βήματα Επίλυσης:",
    costMovies: "Κόστος ταινιών:",
    finalAmountFee: "Τελικό ποσό (μαζί με το πάγιο):",
    compoundFormulaTitle: "Σύνθετος τύπος:",
    compoundFormulaText: "Κόστος ＝ 2 · ν ＋ 6.",
    prob1Secret: "Το πάγιο μένει σταθερό, ενώ το κόστος των ταινιών πολλαπλασιάζεται με το πλήθος ν.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΥΞΑΝΟΜΕΝΟ ΒΗΜΑ",
    prob2Tag: "Πυραμίδα",
    prob2Title: "Μοτίβο με Μεταβαλλόμενη Προσθήκη (+2, +3, +4...)",
    prob2Desc: "Σε ένα παιχνίδι με τουβλάκια, το 1ο επίπεδο έχει 1 τουβλάκι, το 2ο επίπεδο έχει 3 (1＋2), το 3ο έχει 6 (3＋3), το 4ο έχει 10 (6＋4). Πόσα τουβλάκια θα έχει το 6ο επίπεδο;",
    prob2TableTitle: "ΕΞΕΛΙΞΗ ΒΗΜΑΤΟΣ ΠΡΟΣΘΕΣΗΣ",
    lvl1: "1ο",
    lvl2: "2ο (+2)",
    lvl3: "3ο (+3)",
    lvl4: "4ο (+4)",
    lvl5Title: "5ο επίπεδο:",
    lvl5Val: "10 ＋ 5 ＝ 15 τουβλάκια.",
    lvl6Title: "6ο επίπεδο:",
    lvl6Val: "15 ＋ 6 ＝ 21 τουβλάκια.",
    triangularRuleTitle: "Κανόνας τριγωνικών αριθμών:",
    triangularRuleText: "＝ (6 · 7) : 2 ＝ 21.",
    prob2Secret: "Εδώ το βήμα δεν είναι σταθερό αλλά αυξάνεται κατά 1 σε κάθε επίπεδο (+2, +3, +4, +5, +6...)!",

    ctaHeading: "Ώρα για Εξάσκηση στα Σύνθετα Μοτίβα!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με διπλούς κανόνες, πίνακες μεγεθών και σύνθετες ακολουθίες για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    metaTitle: "Compound Patterns - 6th Grade | LearnMaths.gr",
    metaDesc: "Learn about compound patterns, dual rules, relationships of two quantities in value tables, and predicting future values for 6th Grade.",
    gradeBadge: "CHAPTER 65 • 6TH GRADE",
    heroTitle: "Compound Patterns & Relationships of Quantities",
    heroDesc: "Stepping beyond basic patterns: discover sequences governed by dual rules (combining multiplication and addition), alternating steps, and master how to structure two-quantity tables (such as time and growth) to reveal hidden mathematical relationships!",
    heroSubbadge: "Theory, Dual Rules, Value Tables & Interactive Pattern Machine",
    heroBtn: "Try the Exercises",
    btnExercises: "Exercises",
    backLinkText: "6th Grade",

    stepsHeading: "Compound Patterns in 4 Steps",
    stepsSubheading: "From combining elementary operations to observing real-life value tables.",

    step1Badge: "STEP 1",
    step1Tag: "Concept",
    step1Title: "What is a Compound Pattern?",
    step1Desc: "In a simple pattern we have a single constant step (e.g., always ＋3). In a compound pattern, the rule combines two operations or the step itself changes successively:",
    step1ExTitle: "Example:",
    step1ExSeq: "1, 3, 7, 15, 31, ...",
    step1ExRule: "Rule: «Multiply by 2 and add 1» (· 2 ＋ 1).",
    step1ExCalc: "1 · 2 ＋ 1 ＝ 3 ➔ 3 · 2 ＋ 1 ＝ 7 ➔ 7 · 2 ＋ 1 ＝ 15.",
    step1Tip: "When differences between consecutive numbers are not constant, look for a combination of multiplication with addition/subtraction!",

    step2Badge: "STEP 2",
    step2Tag: "Alternation",
    step2Title: "Alternating Rules",
    step2Desc: "In certain sequences, operations alternate cyclically from term to term:",
    step2ExSeqTitle: "Sequence:",
    step2ExSeq: "2, 6, 5, 15, 14, 42, 41, ...",
    step2ExRule: "Rule: «· 3» followed by «－ 1»!",
    step2ExCalc: "2 · 3 ＝ 6 ➔ 6 － 1 ＝ 5 ➔ 5 · 3 ＝ 15 ➔ 15 － 1 ＝ 14.",
    step2Tip: "To crack this pattern, break the terms into consecutive pairs and track the alternating operations!",

    step3Badge: "STEP 3",
    step3Tag: "Value Tables",
    step3Title: "Relationship Between Two Quantities",
    step3Desc: "In real-world data (e.g., child growth, subscription plans), we organize data into a two-row table:",
    tableTimeLabel: "Time (years):",
    tableHeightLabel: "Height (cm):",
    tableSubtext: "We observe the annual gain (75 ➔ +12 ➔ +10) to trace how the quantity develops over time.",
    step3Tip: "Tables help us detect functional relationships that are invisible at first glance.",

    step4Badge: "STEP 4",
    step4Tag: "Prediction",
    step4Title: "General Formula & Predictions",
    step4Desc: "When expressing the relationship in the general algebraic form a · n ＋ b, we can make exact future predictions:",
    taxiTitle: "Taxi Fare: 3 € base fee ＋ 2 € per kilometer",
    taxiFormula: "Cost (n km) ＝ 2 · n ＋ 3",
    taxiCalcTitle: "For a journey of n ＝ 15 km:",
    taxiCalcDetail: "2 · 15 ＋ 3 ＝ 30 ＋ 3 ＝ 33 €!",
    step4Tip: "Compound patterns serve as the pedagogical bridge connecting primary arithmetic with middle-school algebra!",

    lab1Badge: "INTERACTIVE LAB 1",
    lab1Title: "Interactive Compound Rule Machine (a · n ＋ b)",
    lab1Desc: "Select the multiplier (a) and constant addition (b) to generate custom compound rules and compute terms at position n instantly:",
    multLabel: "Multiplier (a):",
    addLabel: "Constant Addition (b):",
    posLabel: "Target Position (n):",
    formulaPrefix: "General Formula:",
    calcValLabel: "Value for n ＝",
    firstTermsTitle: "FIRST TERMS OF THE COMPOUND PATTERN",
    termPosPrefix: "Position n ＝",
    calcExplTitle: "Calculating Position",

    lab2Badge: "INTERACTIVE LAB 2: PROGRESSION TABLE",
    lab2Title: "«How You Grew!»: Correlating Age & Height",
    lab2Desc: "Track how child height evolves year by year and see how compound patterns are analyzed through empirical tables:",
    selectAgeLabel: "SELECT AGE (YEARS):",
    yearsOld: "years old",
    growthStatsTitle: "Data at Year",
    growthStatsSuffix: ":",
    initialHeightText: "Initial baseline height at year 1.",
    increaseText: "Increase of ＋",
    increaseSuffix: " cm compared to previous year.",
    growthTableHeading: "VALUE TABLE (YEARS 1 TO 10)",
    ageHeader: "Age (years)",
    heightHeader: "Height (cm)",
    gainHeader: "Annual Gain",
    conclusionTitle: "Conclusion:",
    conclusionText: "Growth increases rapidly in early years (+12cm, +10cm) before stabilizing at approximately +6cm/year.",

    problemsHeading: "Worked Real-World Compound Pattern Problems",
    problemsSubheading: "Practical applications of dual rules and value tables in real scenarios.",

    prob1Badge: "PROBLEM 1: SUBSCRIPTION WITH BASE FEE",
    prob1Tag: "Usage Cost",
    prob1Title: "Calculating Streaming Platform Monthly Cost",
    prob1Desc: "A video streaming platform charges a 6 € monthly base fee plus 2 € for each newly rented movie. How much will a subscriber pay who rented 8 movies in a month?",
    prob1TableTitle: "BILLING DATA",
    baseFee: "Base Fee",
    costPerMovie: "Cost/movie",
    moviesCount: "Movies (n)",
    stepsTitle: "Solution Steps:",
    costMovies: "Cost of movies:",
    finalAmountFee: "Final amount (with base fee):",
    compoundFormulaTitle: "Compound formula:",
    compoundFormulaText: "Cost ＝ 2 · n ＋ 6.",
    prob1Secret: "The base fee remains constant, whereas movie cost multiplies by count n.",

    prob2Badge: "PROBLEM 2: GROWING STEP",
    prob2Tag: "Pyramid",
    prob2Title: "Pattern with Incremental Step (+2, +3, +4...)",
    prob2Desc: "In a block building game, level 1 has 1 block, level 2 has 3 (1＋2), level 3 has 6 (3＋3), and level 4 has 10 (6＋4). How many blocks will level 6 have?",
    prob2TableTitle: "STEP EVOLUTION",
    lvl1: "1st",
    lvl2: "2nd (+2)",
    lvl3: "3rd (+3)",
    lvl4: "4th (+4)",
    lvl5Title: "Level 5:",
    lvl5Val: "10 ＋ 5 ＝ 15 blocks.",
    lvl6Title: "Level 6:",
    lvl6Val: "15 ＋ 6 ＝ 21 blocks.",
    triangularRuleTitle: "Triangular number rule:",
    triangularRuleText: "＝ (6 · 7) : 2 ＝ 21.",
    prob2Secret: "Here the step is not constant; it increases by 1 at every tier (+2, +3, +4, +5, +6...)!",

    ctaHeading: "Ready to Practice Compound Patterns?",
    ctaDesc: "Test your skills across 10 interactive questions covering dual rules, value tables, and complex sequences for 6th Grade.",
    ctaBtn: "Start Exercises"
  }
};

export default function SinthetaMotibaTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Μηχανή Σύνθετου Κανόνα (a · n + b)
  const [multA, setMultA] = useState(3);
  const [addB, setAddB] = useState(2);
  const [calcN, setCalcN] = useState(5);

  // Αριθμητική μορφοποίηση ανάλογα με τη γλώσσα
  const formatNumberLocale = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '0';
    const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
    return Number(val).toLocaleString(numLocale);
  };

  const complexSequence = useMemo(() => {
    const list = [];
    for (let i = 1; i <= Math.max(calcN, 7); i++) {
      list.push({ n: i, val: multA * i + addB });
    }
    return list;
  }, [multA, addB, calcN]);

  const targetVal = multA * calcN + addB;

  // Εργαστήριο 2: Πίνακας Σύνδεσης Δύο Μεγεθών («Πόσο Μεγάλωσες!»)
  const [selectedAge, setSelectedAge] = useState(6);

  const growthTable = useMemo(() => {
    const yearlyGains = [0, 75, 12, 10, 8, 6, 6, 6, 5, 5, 5];
    let runningHeight = 0;
    const table = [];
    for (let age = 1; age <= 10; age++) {
      if (age === 1) {
        runningHeight = 75;
      } else {
        runningHeight += yearlyGains[age];
      }
      table.push({ age, gain: yearlyGains[age], height: runningHeight });
    }
    return table;
  }, []);

  const currentGrowth = growthTable.find(g => g.age === selectedAge) || growthTable[0];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/65-sintheta-motiba-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.btnExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.gradeBadge}</span>
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
              <span>{t.heroSubbadge}</span>
            </div>
            <Link
              href="/st-dimotikou/65-sintheta-motiba-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    <strong>{t.step1ExTitle}</strong> {t.step1ExSeq}
                  </div>
                  <div className="text-blue-900 font-bold">
                    {t.step1ExRule}
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans">
                    {t.step1ExCalc}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    <strong>{t.step2ExSeqTitle}</strong> {t.step2ExSeq}
                  </div>
                  <div className="text-amber-900 font-bold">
                    {t.step2ExRule}
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans">
                    {t.step2ExCalc}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                    <span className="font-bold text-slate-500">{t.tableTimeLabel}</span>
                    <span className="bg-white p-1 rounded border">1</span>
                    <span className="bg-white p-1 rounded border">2</span>
                    <span className="bg-white p-1 rounded border">3</span>
                    <span className="font-bold text-slate-500">{t.tableHeightLabel}</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">75</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">87</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">97</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    {t.tableSubtext}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono text-center">
                  <div className="text-emerald-900 font-bold">
                    {t.taxiTitle}
                  </div>
                  <div className="text-blue-700 font-black text-sm">
                    {t.taxiFormula}
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-1">
                    {t.taxiCalcTitle}<br />
                    {t.taxiCalcDetail}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΗΧΑΝΗ ΣΥΝΘΕΤΟΥ ΚΑΝΟΝΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab1Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Ρύθμιση Πολλαπλασιαστή α */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-blue-900">
                  <span>{t.multLabel}</span>
                  <span className="font-mono text-base font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {multA}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={multA}
                  onChange={(e) => setMultA(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Ρύθμιση Σταθερού Όρου β */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-amber-900">
                  <span>{t.addLabel}</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    ＋ {addB}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={addB}
                  onChange={(e) => setAddB(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Επιλογή Θέσης ν */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{t.posLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ν ＝ {calcN}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={calcN}
                  onChange={(e) => setCalcN(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Τελικός Τύπος */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 font-mono">
                <span className="text-[11px] font-sans text-emerald-800 block font-bold">
                  {t.formulaPrefix} {multA} · ν {addB > 0 ? `＋ ${addB}` : ''}
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">
                  {t.calcValLabel} {calcN}: {formatNumberLocale(targetVal)}
                </div>
              </div>

            </div>

            {/* Πίνακας Παραγόμενων Όρων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {t.firstTermsTitle}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {complexSequence.slice(0, 8).map((item) => {
                  const isCurrent = item.n === calcN;
                  return (
                    <div
                      key={`comp-${item.n}`}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] block font-sans uppercase font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {t.termPosPrefix} {item.n}
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black block mt-0.5">
                        {item.val}
                      </span>
                      <span className={`text-[10px] block font-mono mt-0.5 ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                        ({multA} · {item.n} ＋ {addB})
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-700 space-y-1 text-center">
                💡 <strong>{t.calcExplTitle} {calcN}:</strong> ({multA} · {calcN}) ＋ {addB} ＝ {multA * calcN} ＋ {addB} ＝ <strong>{targetVal}</strong>!
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΟΣΟ ΜΕΓΑΛΩΣΕΣ (ΠΙΝΑΚΑΣ ΔΥΟ ΜΕΓΕΘΩΝ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📈 {t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Slider Ηλικίας & Στοιχεία (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{t.selectAgeLabel}</span>
                  <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200">
                    {selectedAge} {t.yearsOld}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2 text-center">
                <span className="text-xs text-emerald-900 block font-bold">
                  {t.growthStatsTitle} {selectedAge}{t.growthStatsSuffix}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                  {currentGrowth.height} cm
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  {selectedAge === 1 
                    ? t.initialHeightText 
                    : `${t.increaseText}${currentGrowth.gain}${t.increaseSuffix}`}
                </p>
              </div>
            </div>

            {/* Οπτικός Πίνακας Μεγεθών (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {t.growthTableHeading}
              </span>

              <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-xs text-center font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2 text-left font-sans">{t.ageHeader}</th>
                      {growthTable.map(g => (
                        <th key={`th-${g.age}`} className={`p-2 ${g.age === selectedAge ? 'bg-emerald-100 text-emerald-900 font-black' : ''}`}>
                          {g.age}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 text-left font-sans font-bold text-slate-700">{t.heightHeader}</td>
                      {growthTable.map(g => (
                        <td key={`td-h-${g.age}`} className={`p-2 font-bold ${g.age === selectedAge ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-800'}`}>
                          {g.height}
                        </td>
                      ))}
                    </tr>
                    <tr className="text-slate-500 text-[11px]">
                      <td className="p-2 text-left font-sans font-bold">{t.gainHeader}</td>
                      {growthTable.map(g => (
                        <td key={`td-g-${g.age}`} className={`p-2 ${g.age === selectedAge ? 'bg-emerald-50 text-emerald-600 font-bold' : ''}`}>
                          {g.age === 1 ? '-' : `+${g.gain}`}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600 text-center pt-1 font-sans">
                💡 <strong>{t.conclusionTitle}</strong> {t.conclusionText}
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  {t.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob1TableTitle}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.baseFee}</span> 6 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.costPerMovie}</span> 2 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.moviesCount}</span> 8
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.costMovies}</strong> 8 · 2 € ＝ <strong>16 €</strong>.</div>
                  <div><strong>{t.finalAmountFee}</strong> 16 ＋ 6 ＝ <strong className="text-blue-700">22 €</strong>.</div>
                  <div><strong>{t.compoundFormulaTitle}</strong> {t.compoundFormulaText}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 {t.prob1Secret}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  {t.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob2TableTitle}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.lvl1}</span> 1
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.lvl2}</span> 3
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.lvl3}</span> 6
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.lvl4}</span> 10
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.lvl5Title}</strong> {t.lvl5Val}</div>
                  <div><strong>{t.lvl6Title}</strong> {t.lvl6Val}</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <strong>{t.triangularRuleTitle}</strong>
                    <Fraction num={locale === 'en' ? 'n · (n ＋ 1)' : 'ν · (ν ＋ 1)'} den="2" />
                    <span>{t.triangularRuleText}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ {t.prob2Secret}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaHeading}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/65-sintheta-motiba-ask"
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