// pages/st-dimotikou/58-mesos-oros.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Ατονα ελληνικα κεφαλαια με εξαιρεση το ΣΤ'
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

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b border-current px-1.5 pb-0.5 text-center text-[0.9em] font-bold">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center text-[0.9em] font-bold">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος αναλογα με το locale)
function formatNum(val, locale = 'el', decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function MesosOrosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Μέσος Όρος (Μέση Τιμή) - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Μαθαίνουμε τι είναι ο μέσος όρος (μέση τιμή), πώς υπολογίζεται με άθροισμα και διαίρεση, πώς λύνουμε αντίστροφα προβλήματα και εξερευνούμε διαδραστικά την έννοια της εξισορρόπησης.",
        backText: "ΣΤ' Δημοτικού",
        actionBtn: "🎯 Ασκήσεις",
        chapterBadge: "ΚΕΦΑΛΑΙΟ 58 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
        headerTitle: "Ο Μέσος Όρος (Μέση Τιμή)",
        headerDesc: "Ανακαλύπτουμε την έννοια της μέσης τιμής: πώς μια ομάδα ανόμοιων αριθμών εξισορροπείται σε έναν μοναδικό αντιπροσωπευτικό αριθμό, πώς εκτελούμε τον υπολογισμό με άθροισμα και διαίρεση, και πώς λύνουμε απαιτητικά αντίστροφα προβλήματα.",
        headerSub: "Θεωρία, Οπτική Εξισορρόπηση & Αντίστροφοι Υπολογισμοί",
        tryExercises: "Δοκίμασε τις Ασκήσεις",
        roadmapTitle: "Η Έννοια του Μέσου Όρου σε 4 Βήματα",
        roadmapDesc: "Από την πρακτική κατανόηση της ισοκατανομής μέχρι τον μαθηματικό τύπο και την επίλυση προβλημάτων.",
        step1Badge: "ΒΗΜΑ 1",
        step1Tag: "Ορισμός",
        step1Title: "Τι είναι ο Μέσος Όρος;",
        step1Text: "Μέσος όρος (ή μέση τιμή) είναι ο αριθμός που δείχνει ποια θα ήταν η τιμή κάθε στοιχείου αν όλες οι ποσότητες μοιράζονταν εντελώς δίκαια και ισόποσα.",
        step1ExampleText: "Αν τρία παιδιά έχουν 4, 6 και 11 βόλους, όλοι μαζί έχουν 21 βόλους. Αν τους μοίραζαν εξίσου, ο καθένας θα έπαιρνε ακριβώς 7 βόλους.",
        step1Tip: "💡 Ο μέσος όρος βρίσκεται πάντοτε ανάμεσα στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων!",
        step2Badge: "ΒΗΜΑ 2",
        step2Tag: "Μαθηματικός Τύπος",
        step2Title: "Πώς Υπολογίζεται;",
        step2Text: "Για να βρούμε τον μέσο όρο εκτελούμε πάντα δύο διαδοχικές ενέργειες:",
        step2FormulaTitle: "Μέσος Όρος ＝",
        step2FormulaNum: "Άθροισμα όλων των τιμών",
        step2FormulaDen: "Πλήθος των τιμών",
        step2Step1: "Προσθέτουμε όλες τις τιμές μαζί.",
        step2Step2: "Διαιρούμε το άθροισμα με το πόσες είναι αυτές οι τιμές.",
        step2Tip: "🎯 Ο μέσος όρος μπορεί να είναι ακέραιος ή δεκαδικός αριθμός (π.χ. 8,5 βαθμοί ή 3,4 γκολ ανά αγώνα).",
        step3Badge: "ΒΗΜΑ 3",
        step3Tag: "Αντίστροφο Πρόβλημα",
        step3Title: "Αν Γνωρίζουμε τον Μέσο Όρο",
        step3Text: "Σε πολλά προβλήματα δίνεται ο μέσος όρος και ψάχνουμε το σύνολο ή μια τιμή που λείπει:",
        step3Formula: "Συνολικό Άθροισμα ＝ Μέσος Όρος · Πλήθος",
        step3Example: "Παράδειγμα: Αν 5 μαθητές έχουν μέσο όρο ηλικίας 12 έτη, τότε το άθροισμα των ηλικιών τους είναι 5 · 12 ＝ 60 έτη.",
        step3Tip: "⚡ Πολλαπλασιάζοντας τον μέσο όρο με το πλήθος, ανακτούμε άμεσα το συνολικό άθροισμα!",
        step4Badge: "ΒΗΜΑ 4",
        step4Tag: "Προσοχή στις Παγίδες",
        step4Title: "Το Μηδέν (0) Μετράει!",
        step4Text: "Μια συχνή παγίδα είναι η παράλειψη των μηδενικών τιμών κατά τη διαίρεση:",
        step4MistakeTitle: "Λάθος:",
        step4MistakeText: "Αν ένας παίκτης έβαλε 10, 0 και 20 πόντους, να διαιρέσουμε με το 2 επειδή το ένα ματς είχε 0 πόντους.",
        step4CorrectTitle: "Σωστό:",
        step4CorrectText: "Το ματς με 0 πόντους μετράει κανονικά στο πλήθος! Διαιρούμε με το 3: (10 ＋ 0 ＋ 20) : 3 ＝ 30 : 3 ＝ 10 πόντοι.",
        step4Tip: "🚀 Όλες οι καταγραφές συμμετέχουν στο πλήθος, ακόμα και όταν η τιμή τους ισούται με 0.",
        lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
        lab1Title: "Δυναμικός Αναλυτής & Οπτική Εξισορρόπηση Μέσου Όρου",
        lab1Desc: "Ρυθμίστε τις 4 τιμές και παρακολουθήστε πώς διαμορφώνεται το συνολικό άθροισμα και η οριζόντια στάθμη ισορροπίας (μέσος όρος).",
        valueLabel: "Τιμή",
        visualBalanceHeading: "ΟΠΤΙΚΗ ΣΤΑΘΜΗ ΙΣΟΡΡΟΠΙΑΣ (ΜΕΣΟΣ ΟΡΟΣ)",
        avgBadgePrefix: "Μέσος Όρος:",
        mathCalcHeading: "ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ",
        avgShort: "Μ.Ο.",
        unitsText: "μονάδες",
        levelExplain: (avg) => `Αν ισοπεδώναμε τις 4 στήλες, όλες θα είχαν ύψος ακριβώς ${avg} μονάδες.`,
        lab2Badge: "🎯 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΤΙΣΤΡΟΦΗ ΕΥΡΕΣΗ ΤΙΜΗΣ",
        lab2Title: "Πρόβλημα Στόχου: «Τι βαθμό χρειάζομαι στο 4ο τεστ;»",
        lab2Desc: (g1, g2, g3) => `Ένας μαθητής έγραψε σε 3 διαγωνίσματα βαθμούς ${g1}, ${g2} και ${g3}. Επιλέξτε τον επιθυμητό τελικό μέσο όρο για να δείτε τι βαθμό πρέπει να γράψει στο 4ο διαγώνισμα:`,
        targetAvgLabel: "ΕΠΙΘΥΜΗΤΟΣ ΤΕΛΙΚΟΣ ΜΕΣΟΣ ΟΡΟΣ:",
        prevGradesTitle: "Προηγούμενοι βαθμοί μαθητή (3 τεστ):",
        test1: "1ο",
        test2: "2ο",
        test3: "3ο",
        currentSumText: (g1, g2, g3, sum) => `Τρέχον άθροισμα: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${sum} μονάδες.`,
        reverseStepsHeading: "ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΑΝΤΙΣΤΡΟΦΟΥ ΠΡΟΒΛΗΜΑΤΟΣ",
        reverseStep1Title: "1. Πόσες μονάδες χρειάζονται συνολικά για 4 τεστ;",
        reverseStep2Title: "2. Πόσες μονάδες έχει συγκεντρώσει ήδη;",
        reverseStep3Title: "3. Απαιτούμενος βαθμός στο 4ο διαγώνισμα:",
        warnImpossible: (tAvg, req) => `⚠️ Ο στόχος μέσου όρου ${tAvg} είναι αδύνατος (απαιτεί βαθμό ${req} ＞ 20).`,
        warnAchieved: "🎉 Ο στόχος έχει ήδη επιτευχθεί, ακόμα και με 0 βαθμούς στο 4ο διαγώνισμα!",
        successTarget: (req, tAvg) => `✅ Αν γράψει ακριβώς ${req}, ο τελικός μέσος όρος θα είναι ακριβώς ${tAvg}.`,
        problemsHeading: "Λυμένα Προβλήματα Καθημερινής Ζωής",
        problemsDesc: "Δύο χαρακτηριστικά προβλήματα μέσου όρου με πίνακες και υπολογιστικές αναλύσεις.",
        prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΚΑΥΣΙΜΑ & ΔΙΑΔΡΟΜΕΣ",
        prob1Tag: "Κατανάλωση",
        prob1Title: "Μέση Κατανάλωση Αυτοκινήτου σε 4 Ταξίδια",
        prob1Desc: "Ένας οδηγός κατέγραψε τα λίτρα βενζίνης που κατανάλωσε σε 4 ισομήκεις διαδρομές: 1ο ταξίδι 6,8 l, 2ο ταξίδι 7,4 l, 3ο ταξίδι 6,2 l και 4ο ταξίδι 7,6 l. Ποια ήταν η μέση κατανάλωση (l);",
        prob1TableHeading: "ΠΙΝΑΚΑΣ ΚΑΤΑΓΡΑΦΗΣ ΚΑΤΑΝΑΛΩΣΗΣ (l)",
        prob1AnalysisHeading: "Ανάλυση Επίλυσης:",
        prob1Row1: "Συνολικά λίτρα: 6,8 ＋ 7,4 ＋ 6,2 ＋ 7,6 ＝ 28 l.",
        prob1Row2: "Πλήθος ταξιδιών: 4 ταξίδια.",
        prob1Row3: "Μέση κατανάλωση: 28 : 4 ＝ 7 l ανά ταξίδι.",
        prob1Tip: "💡 Παρότι σε κανένα ταξίδι δεν έκαψε ακριβώς 7 λίτρα, ο αριθμός 7 αντιπροσωπεύει ιδανικά τη συνολική του συμπεριφορά.",
        prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΜΕΤΕΩΡΟΛΟΓΙΑ",
        prob2Tag: "Εβδομαδιαία Τάση",
        prob2Title: "Μέση Εβδομαδιαία Θερμοκρασία",
        prob2Desc: "Σε μια πόλη καταγράφηκαν οι μεσημεριανές θερμοκρασίες μιας εβδομάδας (7 ημέρες). Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν 102°C. Αν η μέση εβδομαδιαία θερμοκρασία ήταν 17°C, ποια ήταν η θερμοκρασία την 7η ημέρα;",
        prob2EqHeading: "ΣΧΕΣΗ ΕΒΔΟΜΑΔΙΑΙΑΣ ΕΞΙΣΩΣΗΣ",
        prob2EqFormula: "(102 ＋ χ) : 7 ＝ 17°C",
        prob2StepsHeading: "Βήματα Επίλυσης:",
        prob2Step1: "Συνολικό άθροισμα 7 ημερών: 7 · 17 ＝ 119°C.",
        prob2Step2: "Θερμοκρασία 7ης ημέρας: 119 － 102 ＝ 17°C.",
        prob2Tip: "💡 Βρίσκοντας πρώτα το συνολικό άθροισμα των 7 ημερών, η άγνωστη ημέρα προκύπτει με μία απλή αφαίρεση.",
        ctaTitle: "Ώρα για Εξάσκηση στον Μέσο Όρο!",
        ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού μέσης τιμής, αντίστροφων προβλημάτων στόχου και επεξεργασίας πινάκων δεδομένων για τη ΣΤ' Δημοτικού.",
        ctaBtn: "🎯 Έναρξη Ασκήσεων",
      },
      en: {
        pageTitle: "Mean (Average Value) - 6th Grade | LearnMaths.gr",
        metaDescription: "Learn what the mean (average) is, how to calculate it using addition and division, how to solve reverse target problems, and explore visual leveling interactively.",
        backText: "6th Grade",
        actionBtn: "🎯 Exercises",
        chapterBadge: "CHAPTER 58 • 6TH GRADE",
        headerTitle: "The Mean (Average Value)",
        headerDesc: "Discover the concept of the mean: how a set of varying numbers is leveled into a single representative value, how we compute it through addition and division, and how we solve reverse target problems.",
        headerSub: "Theory, Visual Leveling & Reverse Calculations",
        tryExercises: "Try the Exercises",
        roadmapTitle: "The Concept of Mean in 4 Steps",
        roadmapDesc: "From practical fair-share distribution to the mathematical formula and problem solving.",
        step1Badge: "STEP 1",
        step1Tag: "Definition",
        step1Title: "What is the Mean (Average)?",
        step1Text: "The mean (or average value) is the number representing the value each item would have if all quantities were shared equally and fairly.",
        step1ExampleText: "If three children have 4, 6, and 11 marbles, together they have 21 marbles. If they shared them equally, each child would receive exactly 7 marbles.",
        step1Tip: "💡 The mean is always strictly located between the minimum and maximum values of the data set!",
        step2Badge: "STEP 2",
        step2Tag: "Mathematical Formula",
        step2Title: "How is it Calculated?",
        step2Text: "To find the mean, we always execute two sequential operations:",
        step2FormulaTitle: "Mean ＝",
        step2FormulaNum: "Sum of all values",
        step2FormulaDen: "Number of values",
        step2Step1: "Add all individual values together.",
        step2Step2: "Divide the sum by the count of those values.",
        step2Tip: "🎯 The mean can be an integer or a decimal number (e.g. 8.5 test score or 3.4 goals per match).",
        step3Badge: "STEP 3",
        step3Tag: "Reverse Problem",
        step3Title: "When the Mean is Known",
        step3Text: "In many real-world problems the average is provided and we seek the total or a missing observation:",
        step3Formula: "Total Sum ＝ Mean · Count",
        step3Example: "Example: If 5 students have an average age of 12 years, the sum of their ages is 5 · 12 ＝ 60 years.",
        step3Tip: "⚡ Multiplying the mean by the count immediately recovers the total sum!",
        step4Badge: "STEP 4",
        step4Tag: "Common Pitfalls",
        step4Title: "Zero (0) Counts!",
        step4Text: "A common pitfall is omitting zero observations during division:",
        step4MistakeTitle: "Incorrect:",
        step4MistakeText: "If a player scored 10, 0, and 20 points, dividing by 2 just because one game had 0 points.",
        step4CorrectTitle: "Correct:",
        step4CorrectText: "The 0-point game is a valid observation! We divide by 3: (10 ＋ 0 ＋ 20) : 3 ＝ 30 : 3 ＝ 10 points.",
        step4Tip: "🚀 All recorded observations participate in the count, even when their value is 0.",
        lab1Badge: "🔬 INTERACTIVE LAB 1",
        lab1Title: "Dynamic Analyzer & Visual Mean Leveling",
        lab1Desc: "Adjust the 4 values and watch how the total sum and horizontal balance level (mean) adapt dynamically.",
        valueLabel: "Value",
        visualBalanceHeading: "VISUAL BALANCE LEVEL (MEAN)",
        avgBadgePrefix: "Mean:",
        mathCalcHeading: "MATHEMATICAL CALCULATION",
        avgShort: "Mean",
        unitsText: "units",
        levelExplain: (avg) => `If we leveled out all 4 bars, each would have a height of exactly ${avg} units.`,
        lab2Badge: "🎯 INTERACTIVE LAB 2: REVERSE TARGET VALUE",
        lab2Title: "Target Problem: “What score do I need on test 4?”",
        lab2Desc: (g1, g2, g3) => `A student scored ${g1}, ${g2}, and ${g3} on 3 tests. Select the desired final average to see the score required on the 4th test:`,
        targetAvgLabel: "DESIRED FINAL AVERAGE:",
        prevGradesTitle: "Student's previous test scores (3 tests):",
        test1: "1st",
        test2: "2nd",
        test3: "3rd",
        currentSumText: (g1, g2, g3, sum) => `Current sum: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${sum} points.`,
        reverseStepsHeading: "REVERSE PROBLEM SOLUTION STEPS",
        reverseStep1Title: "1. Total points required for 4 tests?",
        reverseStep2Title: "2. Points accumulated so far?",
        reverseStep3Title: "3. Score required on the 4th test:",
        warnImpossible: (tAvg, req) => `⚠️ Target average ${tAvg} is impossible (requires score ${req} ＞ 20).`,
        warnAchieved: "🎉 Target already achieved, even with 0 points on the 4th test!",
        successTarget: (req, tAvg) => `✅ By scoring exactly ${req}, the final average will be exactly ${tAvg}.`,
        problemsHeading: "Worked Everyday Problems",
        problemsDesc: "Two characteristic average problems with tables and step-by-step arithmetic.",
        prob1Badge: "PROBLEM 1: FUEL CONSUMPTION",
        prob1Tag: "Consumption",
        prob1Title: "Average Fuel Consumption Across 4 Trips",
        prob1Desc: "A driver recorded liters of fuel used over 4 identical routes: 1st trip 6.8 l, 2nd trip 7.4 l, 3rd trip 6.2 l, and 4th trip 7.6 l. What was the average fuel consumption (l)?",
        prob1TableHeading: "FUEL CONSUMPTION RECORD TABLE (l)",
        prob1AnalysisHeading: "Solution Breakdown:",
        prob1Row1: "Total liters: 6.8 ＋ 7.4 ＋ 6.2 ＋ 7.6 ＝ 28 l.",
        prob1Row2: "Number of trips: 4 trips.",
        prob1Row3: "Average consumption: 28 : 4 ＝ 7 l per trip.",
        prob1Tip: "💡 Although no single trip used exactly 7 liters, the number 7 perfectly represents overall performance.",
        prob2Badge: "PROBLEM 2: METEOROLOGY",
        prob2Tag: "Weekly Trend",
        prob2Title: "Weekly Average Temperature",
        prob2Desc: "Midday temperatures were recorded over one week (7 days). The sum of temperatures for the first 6 days was 102°C. If the weekly average temperature was 17°C, what was the temperature on day 7?",
        prob2EqHeading: "WEEKLY EQUATION RELATION",
        prob2EqFormula: "(102 ＋ x) : 7 ＝ 17°C",
        prob2StepsHeading: "Solution Steps:",
        prob2Step1: "Total sum for 7 days: 7 · 17 ＝ 119°C.",
        prob2Step2: "Day 7 temperature: 119 － 102 ＝ 17°C.",
        prob2Tip: "💡 By finding the 7-day total sum first, the missing day is found by a simple subtraction.",
        ctaTitle: "Time to Practice the Mean!",
        ctaDesc: "Challenge yourself with 10 dynamic exercises on calculating the average, reverse target problems, and data tables for 6th Grade.",
        ctaBtn: "🎯 Start Exercises",
      }
    }[locale];
  }, [locale]);

  // Εργαστηριο 1: Διαδραστικη Εξισορροπηση 4 Τιμων
  const [val1, setVal1] = useState(14);
  const [val2, setVal2] = useState(18);
  const [val3, setVal3] = useState(12);
  const [val4, setVal4] = useState(16);

  const sum1 = val1 + val2 + val3 + val4;
  const count1 = 4;
  const avg1 = useMemo(() => {
    const raw = sum1 / count1;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [sum1, count1]);

  // Εργαστηριο 2: Αντιστροφο Προβλημα (Στοχος Μεσου Ορου Βαθμολογιας)
  const [grade1, setGrade1] = useState(16);
  const [grade2, setGrade2] = useState(18);
  const [grade3, setGrade3] = useState(15);
  const [targetAvg, setTargetAvg] = useState(17);

  // Απαιτουμενο αθροισμα 4 διαγωνισματων για να εχουμε targetAvg:
  const requiredSum = targetAvg * 4;
  const currentGradesSum = grade1 + grade2 + grade3;
  const requiredGrade4 = requiredSum - currentGradesSum;

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/58-mesos-oros-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionBtn}</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K χωρις οριζοντιο scroll */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerSub}</span>
            </div>
            <Link
              href="/st-dimotikou/58-mesos-oros-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.roadmapTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.roadmapDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
                  <p className="leading-normal">
                    {t.step1ExampleText}
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-sky-900">
                    (4 ＋ 6 ＋ 11) : 3 ＝ 21 : 3 ＝ 7
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950">
                  <div className="font-bold flex items-center justify-center gap-1 font-mono text-xs sm:text-sm">
                    <span>{t.step2FormulaTitle}</span>
                    <Fraction num={t.step2FormulaNum} den={t.step2FormulaDen} />
                  </div>
                  <ol className="list-decimal list-inside space-y-1 pt-1 font-sans text-[11px] sm:text-xs leading-normal">
                    <li><strong>{t.step2Step1}</strong></li>
                    <li><strong>{t.step2Step2}</strong></li>
                  </ol>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm space-y-2 text-amber-950 font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-amber-200 font-bold">
                    {t.step3Formula}
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left">
                    {t.step3Example}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-[11px] leading-normal">
                    <strong>{t.step4MistakeTitle}</strong> {t.step4MistakeText}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-normal">
                    <strong>{t.step4CorrectTitle}</strong> {t.step4CorrectText}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΗ ΕΞΙΣΟΡΡΟΠΗΣΗ ΚΑΙ ΜΕΣΟΣ ΟΡΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{toCleanUppercase(t.lab1Badge)}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τιμων (4 Steppers) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
              
              {/* Τιμη 1 */}
              <div className="bg-blue-50/70 p-3 sm:p-3.5 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> {t.valueLabel} 1 (Α)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val1}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease Value 1"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.max(0, prev - 1)); }}
                    disabled={val1 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val1}
                    onChange={(e) => setVal1(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase Value 1"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.min(25, prev + 1)); }}
                    disabled={val1 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 2 */}
              <div className="bg-emerald-50/70 p-3 sm:p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t.valueLabel} 2 (Β)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val2}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease Value 2"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.max(0, prev - 1)); }}
                    disabled={val2 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val2}
                    onChange={(e) => setVal2(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase Value 2"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.min(25, prev + 1)); }}
                    disabled={val2 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 3 */}
              <div className="bg-amber-50/70 p-3 sm:p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.valueLabel} 3 (Γ)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val3}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease Value 3"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.max(0, prev - 1)); }}
                    disabled={val3 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val3}
                    onChange={(e) => setVal3(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase Value 3"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.min(25, prev + 1)); }}
                    disabled={val3 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 4 */}
              <div className="bg-purple-50/70 p-3 sm:p-3.5 rounded-2xl border border-purple-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> {t.valueLabel} 4 (Δ)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-purple-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val4}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease Value 4"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.max(0, prev - 1)); }}
                    disabled={val4 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val4}
                    onChange={(e) => setVal4(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase Value 4"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.min(25, prev + 1)); }}
                    disabled={val4 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικη Προβολη Ραβδων & Σταθμης Μεσου Ορου (SVG) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {toCleanUppercase(t.visualBalanceHeading)}
              </span>

              <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 380 230" className="w-full h-auto max-h-[250px] overflow-visible">
                  {/* Οριζοντιες γραμμες πλεγματος */}
                  {[0, 5, 10, 15, 20, 25].map((tick) => {
                    const y = 185 - (tick / 25) * 155;
                    return (
                      <g key={`avg-tick-${tick}`}>
                        <line x1="38" y1={y} x2="360" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                        <text x="32" y={y + 4} fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="end">
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {/* Αξονες */}
                  <line x1="38" y1="185" x2="365" y2="185" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="38" y1="185" x2="38" y2="25" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

                  {/* 4 Στηλες Τιμων */}
                  {[
                    { label: `${t.valueLabel} 1`, val: val1, color: '#2563eb', x: 65 },
                    { label: `${t.valueLabel} 2`, val: val2, color: '#059669', x: 140 },
                    { label: `${t.valueLabel} 3`, val: val3, color: '#d97706', x: 215 },
                    { label: `${t.valueLabel} 4`, val: val4, color: '#9333ea', x: 290 }
                  ].map((col, idx) => {
                    const barH = (col.val / 25) * 155;
                    const barY = 185 - barH;
                    return (
                      <g key={`bar-col-${idx}`}>
                        <rect x={col.x} y={barY} width="40" height={Math.max(barH, 2)} fill={col.color} rx="6" />
                        <text x={col.x + 20} y={barY - 6} fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">
                          {col.val}
                        </text>
                        <text x={col.x + 20} y="202" fontSize="10.5" fontWeight="bold" fill="#475569" textAnchor="middle">
                          {col.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Διακεκομμενη Γραμμη Μεσου Ορου */}
                  {(() => {
                    const avgY = 185 - (avg1 / 25) * 155;
                    return (
                      <g>
                        <line x1="38" y1={avgY} x2="365" y2={avgY} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 4" />
                        <rect x="225" y={avgY - 20} width="135" height="18" fill="#fef2f2" rx="5" stroke="#fca5a5" strokeWidth="1" />
                        <text x="292" y={avgY - 7} fontSize="10.5" fontWeight="900" fill="#dc2626" textAnchor="middle">
                          {t.avgBadgePrefix} {formatNum(avg1, locale, 2)}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Μαθηματικο Πηλικο */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center w-full max-w-[460px] space-y-1">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                  {toCleanUppercase(t.mathCalcHeading)}
                </span>
                <div className="text-sm sm:text-base font-black font-mono text-slate-900">
                  {t.avgShort} ＝ ({val1} ＋ {val2} ＋ {val3} ＋ {val4}) : 4 ＝ {sum1} : 4 ＝{' '}
                  <span className="text-rose-600 underline decoration-rose-400 decoration-2">
                    {formatNum(avg1, locale, 2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  {t.levelExplain(formatNum(avg1, locale, 2))}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΤΙΣΤΡΟΦΟ ΠΡΟΒΛΗΜΑ - ΣΤΟΧΟΣ ΒΑΘΜΟΛΟΓΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>{toCleanUppercase(t.lab2Badge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc(grade1, grade2, grade3)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Ρυθμισεις Προβληματος */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Στοχος Μεσου Ορου */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                  <span>{t.targetAvgLabel}</span>
                  <span className="font-mono text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 font-black">
                    {targetAvg}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease target average"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTargetAvg((prev) => Math.max(14, prev - 1)); }}
                    disabled={targetAvg <= 14}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={targetAvg}
                    onChange={(e) => setTargetAvg(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase target average"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTargetAvg((prev) => Math.min(20, prev + 1)); }}
                    disabled={targetAvg >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Προϋπαρχοντες Βαθμοι */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">{t.prevGradesTitle}</span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{t.test1}: {grade1}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{t.test2}: {grade2}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">{t.test3}: {grade3}</div>
                </div>
                <div className="text-slate-600 pt-1 text-center font-sans">
                  {t.currentSumText(grade1, grade2, grade3, currentGradesSum)}
                </div>
              </div>

            </div>

            {/* Αναλυση & Απαιτουμενος 4ος Βαθμος */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {toCleanUppercase(t.reverseStepsHeading)}
              </span>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">{t.reverseStep1Title}</span>
                  <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    4 · {targetAvg} ＝ {requiredSum}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">{t.reverseStep2Title}</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {grade1} ＋ {grade2} ＋ {grade3} ＝ {currentGradesSum}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-amber-300 flex items-center justify-between bg-amber-50/40">
                  <span className="font-bold text-amber-950">{t.reverseStep3Title}</span>
                  <span className="font-mono font-black text-base sm:text-lg text-amber-700 bg-white px-3 py-1 rounded-xl border border-amber-300">
                    {requiredGrade4}
                  </span>
                </div>
              </div>

              {requiredGrade4 > 20 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium text-center">
                  {t.warnImpossible(targetAvg, requiredGrade4)}
                </div>
              ) : requiredGrade4 < 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                  {t.warnAchieved}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                  {t.successTarget(requiredGrade4, targetAvg)}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob1Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob1TableHeading)}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1ο</span> {formatNum(6.8, locale, 1)} l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2ο</span> {formatNum(7.4, locale, 1)} l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">3ο</span> {formatNum(6.2, locale, 1)} l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4ο</span> {formatNum(7.6, locale, 1)} l
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1AnalysisHeading}</span>
                  <div>• {t.prob1Row1}</div>
                  <div>• {t.prob1Row2}</div>
                  <div>• <strong>{t.prob1Row3}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob2Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Οπτικο Σχημα Εξισωσης */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob2EqHeading)}
                </span>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-slate-800">
                  {t.prob2EqFormula}
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeading}</span>
                  <div>• {t.prob2Step1}</div>
                  <div>• <strong>{t.prob2Step2}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                {t.prob2Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/58-mesos-oros-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}