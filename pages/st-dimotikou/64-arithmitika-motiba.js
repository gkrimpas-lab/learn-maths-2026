// pages/st-dimotikou/64-arithmitika-motiba.js
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
    metaTitle: "Αριθμητικά Μοτίβα & Ακολουθίες - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Θεωρία για τα αριθμητικά μοτίβα, τις ακολουθίες, τους όρους (1ος, 2ος, ν-οστός), τους κανόνες σχηματισμού και την εύρεση γενικού τύπου για τη ΣΤ' Δημοτικού.",
    gradeBadge: "ΚΕΦΑΛΑΙΟ 64 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Αριθμητικά Μοτίβα & Ακολουθίες",
    heroDesc: "Εξερευνούμε τη γλώσσα των αριθμών: μαθαίνουμε τι είναι ακολουθία και όρος ακολουθίας, πώς εντοπίζουμε τον κανόνα σχηματισμού (με πρόσθεση, αφαίρεση ή πολλαπλασιασμό) και πώς χρησιμοποιούμε τη μεταβλητή ν για να υπολογίζουμε απευθείας οποιονδήποτε μελλοντικό όρο!",
    heroSubbadge: "Θεωρία, Κανόνες Βήματος, Γενικός Τύπος & Διαδραστική Γεννήτρια Όρων",
    heroBtn: "Δοκίμασε τις Ασκήσεις",
    btnExercises: "Ασκήσεις",
    backLinkText: "ΣΤ' Δημοτικού",

    stepsHeading: "Τα Αριθμητικά Μοτίβα σε 4 Βήματα",
    stepsSubheading: "Από την αναγνώριση του κανόνα μέχρι την άλγεβρα του ν-οστού όρου.",

    step1Badge: "ΒΗΜΑ 1",
    step1Tag: "Βασικός Ορισμός",
    step1Title: "Ακολουθία & Όροι",
    step1Desc: "Ακολουθία αριθμών ονομάζεται μια σειρά από αριθμούς τοποθετημένους με συγκεκριμένη διάταξη. Κάθε αριθμός της ακολουθίας ονομάζεται όρος:",
    term1: "1ος όρος (αρχικός): Ο πρώτος αριθμός της σειράς.",
    termOther: "2ος, 3ος, ... ν-οστός όρος: Οι επόμενοι αριθμοί ανάλογα με τη θέση τους.",
    seqExampleText: "(1ος: 4, 2ος: 7, 3ος: 10 κ.ο.κ.)",
    step1Tip: "Ο αριθμός της θέσης συμβολίζεται συνήθως με το γράμμα ν (ή n).",

    step2Badge: "ΒΗΜΑ 2",
    step2Tag: "Σταθερό Βήμα",
    step2Title: "Μοτίβα με Πρόσθεση ή Αφαίρεση",
    step2Desc: "Είναι τα πιο συνηθισμένα μοτίβα όπου σε κάθε βήμα προσθέτουμε ή αφαιρούμε έναν σταθερό αριθμό (βήμα):",
    step2Rule1Title: "Αύξουσα (προσθήκη +3):",
    step2Rule1Ex: "2, 5, 8, 11, 14 ➔ Κανόνας: ＋ 3",
    step2Rule2Title: "Φθίνουσα (αφαίρεση -4):",
    step2Rule2Ex: "50, 46, 42, 38, 34 ➔ Κανόνας: － 4",
    step2Tip: "Για να βρούμε το σταθερό βήμα, αφαιρούμε δύο διαδοχικούς όρους: βήμα ＝ (2ος όρος) － (1ος όρος).",

    step3Badge: "ΒΗΜΑ 3",
    step3Tag: "Πολλαπλασιασμός",
    step3Title: "Πολλαπλασιαστικά & Σύνθετα Μοτίβα",
    step3Desc: "Σε ορισμένα μοτίβα οι αριθμοί αυξάνονται πολύ γρήγορα με πολλαπλασιασμό ή συνδυασμό πράξεων:",
    step3Rule1Title: "Διπλασιασμός (· 2):",
    step3Rule1Ex: "3, 6, 12, 24, 48 ➔ Κανόνας: · 2",
    step3Rule2Title: "Σύνθετος Κανόνας (· 2 ＋ 1):",
    step3Rule2Ex: "1, 3, 7, 15, 31 ➔ Διπλασιάζουμε και προσθέτουμε 1!",
    step3Tip: "Στον διπλασιασμό η διαφορά ανάμεσα στους όρους δεν είναι σταθερή, αλλά διπλασιάζεται σε κάθε βήμα!",

    step4Badge: "ΒΗΜΑ 4",
    step4Tag: "Άλγεβρα",
    step4Title: "Ο Γενικός Κανόνας (Τύπος του ν)",
    step4Desc: "Αντί να γράφουμε δεκάδες αριθμούς, εκφράζουμε τη σχέση της θέσης (ν) με την τιμή του όρου:",
    seqTitle: "Ακολουθία: 3, 7, 11, 15, 19, ...",
    formulaTitle: "Κανόνας: 4 · ν － 1",
    calcText1: "Για τον 100ό όρο (ν ＝ 100):",
    calcText2: "4 · 100 － 1 ＝ 400 － 1 ＝ 399!",
    step4Tip: "Ο τύπος του ν μας γλιτώνει χρόνο και μας επιτρέπει να βρίσκουμε αμέσως οποιονδήποτε μελλοντικό όρο!",

    lab1Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Διαδραστική Γεννήτρια Όρων Ακολουθίας",
    lab1Desc: "Ρύθμισε τον αρχικό όρο, το βήμα και διάλεξε ποιον όρο (θέση ν) θέλεις να υπολογίσεις:",
    ruleStepLabel: "ΚΑΝΟΝΑΣ ΒΗΜΑΤΟΣ:",
    addStepBtn: "➕ Πρόσθεση (+ σταθερό)",
    multStepBtn: "✖️ Πολλαπλασιασμός (· 2, · 3)",
    firstTermLabel: "1ος Όρος (α₁):",
    stepAddLabel: "Βήμα (+):",
    stepMultLabel: "Βήμα (·):",
    targetTermLabel: "ΖΗΤΟΥΜΕΝΟΣ ΟΡΟΣ (ΘΕΣΗ ν):",
    termResultLabel: "Τιμή του",
    termResultSuffix: "Όρου (α",
    termsAnalysisTitle: "ΟΙ ΠΡΩΤΟΙ ΟΡΟΙ ΤΗΣ ΑΚΟΛΟΥΘΙΑΣ",
    termBadgeSuffix: "ος Όρος",
    mathInterpretationTitle: "Μαθηματική Ερμηνεία:",
    interpAdd1: "Για να φτάσουμε στον",
    interpAdd2: "ο όρο, ξεκινάμε από το",
    interpAdd3: "και προσθέτουμε",
    interpAdd4: "φορές το βήμα",
    interpMult1: "ο όρο, πολλαπλασιάζουμε",
    interpMult2: "φορές επί",

    lab2Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΓΝΩΡΙΣΗ ΚΑΝΟΝΑ",
    lab2Title: "«Ντετέκτιβ Μοτίβων»: Βρες τον Κρυμμένο Κανόνα",
    lab2Desc: "Επίλεξε ένα από τα 4 κλασικά μοτίβα και δες πώς οι μαθηματικοί ανακαλύπτουν τον κανόνα και τη γενική έκφραση:",
    verbalRuleLabel: "Λεκτικός Κανόνας:",
    generalFormulaLabel: "Γενικός Τύπος (του ν):",

    problemsHeading: "Λυμένα Προβλήματα με Αριθμητικά Μοτίβα",
    problemsSubheading: "Πώς εφαρμόζουμε τους κανόνες των ακολουθιών σε πρακτικά προβλήματα.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΠΟΤΑΜΙΕΥΣΗ",
    prob1Tag: "Σταθερό Βήμα",
    prob1Title: "Υπολογισμός Κουμπαρά την 25η Εβδομάδα",
    prob1Desc: "Ο Νίκος ξεκίνησε να αποταμιεύει έχοντας στον κουμπαρά του 15 €. Κάθε εβδομάδα βάζει σταθερά 4 €. Πόσα χρήματα θα έχει συγκεντρώσει στο τέλος της 25ης εβδομάδας;",
    prob1TableTitle: "ΔΕΔΟΜΕΝΑ ΑΚΟΛΟΥΘΙΑΣ",
    initialAmount: "Αρχικό Ποσό",
    weeklyStep: "Εβδομαδιαίο Βήμα",
    weeksLabel: "Εβδομάδες (ν)",
    stepsTitle: "Βήματα Επίλυσης:",
    prob1Step1: "Χρήματα που προστέθηκαν σε 25 εβδομάδες:",
    prob1Step2: "Συνολικό ποσό:",
    prob1Step3: "Αρχικό ＋ Προσθήκες",
    prob1Step4: "Μαθηματικός τύπος:",
    prob1Secret: "Αντί να προσθέτουμε 25 φορές το 4, χρησιμοποιούμε τον πολλαπλασιασμό: 25 · 4 ＝ 100!",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΑΘΙΣΜΑΤΑ ΘΕΑΤΡΟΥ",
    prob2Tag: "Κερκίδα",
    prob2Title: "Πόσα Καθίσματα έχει η 12η Σειρά;",
    prob2Desc: "Σε ένα υπαίθριο αμφιθέατρο, η 1η σειρά έχει 18 καθίσματα. Κάθε επόμενη σειρά έχει 3 περισσότερα καθίσματα από την προηγούμενη (2η σειρά: 21, 3η σειρά: 24, κ.ο.κ.). Πόσα καθίσματα έχει η 12η σειρά;",
    prob2TableTitle: "ΣΤΟΙΧΕΙΑ ΣΕΙΡΩΝ",
    row1Label: "1η σειρά (α₁)",
    rowStepLabel: "Αύξηση ανά σειρά",
    targetRowLabel: "Ζητούμενη σειρά",
    prob2Step1: "Από την 1η έως τη 12η σειρά μεσολαβούν",
    prob2Step1Sub: "αυξήσεις (12 － 1 ＝ 11).",
    prob2Step2: "Συνολική αύξηση:",
    prob2Step3: "Καθίσματα 12ης σειράς:",
    prob2Step4: "Τύπος:",
    prob2Secret: "Προσοχή: Για τον ν-οστό όρο προσθέτουμε το βήμα ν － 1 φορές (και όχι ν φορές), επειδή ο 1ος όρος περιέχει ήδη την αρχική τιμή!",

    ctaHeading: "Ώρα για Εξάσκηση στα Αριθμητικά Μοτίβα!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με εύρεση επόμενων όρων, υπολογισμό του ν-οστού όρου και προβλήματα ακολουθιών για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων",

    presets: [
      {
        id: 'p1',
        title: 'Αριθμητική (+5)',
        terms: [3, 8, 13, 18, 23, 28],
        rule: 'Προσθέτουμε 5 στον προηγούμενο όρο',
        formula: '5 · ν － 2',
        badge: 'Σταθερό Βήμα'
      },
      {
        id: 'p2',
        title: 'Διπλασιασμός (· 2)',
        terms: [2, 4, 8, 16, 32, 64],
        rule: 'Πολλαπλασιάζουμε επί 2 τον προηγούμενο όρο',
        formula: '2ⁿ',
        badge: 'Γεωμετρική'
      },
      {
        id: 'p3',
        title: 'Περιττοί Αριθμοί (+2)',
        terms: [1, 3, 5, 7, 9, 11],
        rule: 'Ξεκινάμε από το 1 και προσθέτουμε 2',
        formula: '2 · ν － 1',
        badge: 'Κλασικό Μοτίβο'
      },
      {
        id: 'p4',
        title: 'Ακολουθία Fibonacci',
        terms: [1, 1, 2, 3, 5, 8],
        rule: 'Κάθε όρος είναι το άθροισμα των δύο προηγούμενων',
        formula: 'α(ν) ＝ α(ν-1) ＋ α(ν-2)',
        badge: 'Φυσικό Μοτίβο'
      }
    ]
  },
  en: {
    metaTitle: "Arithmetic Patterns & Sequences - 6th Grade | LearnMaths.gr",
    metaDesc: "Theory on arithmetic patterns, sequences, terms (1st, 2nd, nth term), formation rules, and finding the general formula for 6th Grade.",
    gradeBadge: "CHAPTER 64 • 6TH GRADE",
    heroTitle: "Arithmetic Patterns & Sequences",
    heroDesc: "Explore the language of numbers: learn what sequences and terms are, how to identify formation rules (using addition, subtraction, or multiplication), and how to use the variable n to directly compute any future term!",
    heroSubbadge: "Theory, Step Rules, General Formula & Interactive Term Generator",
    heroBtn: "Try the Exercises",
    btnExercises: "Exercises",
    backLinkText: "6th Grade",

    stepsHeading: "Arithmetic Patterns in 4 Steps",
    stepsSubheading: "From rule recognition to the algebra of the nth term.",

    step1Badge: "STEP 1",
    step1Tag: "Fundamental Definition",
    step1Title: "Sequence & Terms",
    step1Desc: "A number sequence is an ordered list of numbers arranged according to a specific rule. Each number in the sequence is called a term:",
    term1: "1st term (initial): The first number in the sequence.",
    termOther: "2nd, 3rd, ... nth term: Subsequent numbers according to their position.",
    seqExampleText: "(1st: 4, 2nd: 7, 3rd: 10, etc.)",
    step1Tip: "The position number is commonly denoted by the variable n.",

    step2Badge: "STEP 2",
    step2Tag: "Constant Step",
    step2Title: "Patterns with Addition or Subtraction",
    step2Desc: "These are the most common patterns where a constant number (step) is added or subtracted at each step:",
    step2Rule1Title: "Increasing (adding +3):",
    step2Rule1Ex: "2, 5, 8, 11, 14 ➔ Rule: ＋ 3",
    step2Rule2Title: "Decreasing (subtracting -4):",
    step2Rule2Ex: "50, 46, 42, 38, 34 ➔ Rule: － 4",
    step2Tip: "To find the constant step, subtract two consecutive terms: step ＝ (2nd term) － (1st term).",

    step3Badge: "STEP 3",
    step3Tag: "Multiplication",
    step3Title: "Multiplicative & Complex Patterns",
    step3Desc: "In certain patterns, numbers grow rapidly through multiplication or combined operations:",
    step3Rule1Title: "Doubling (· 2):",
    step3Rule1Ex: "3, 6, 12, 24, 48 ➔ Rule: · 2",
    step3Rule2Title: "Complex Rule (· 2 ＋ 1):",
    step3Rule2Ex: "1, 3, 7, 15, 31 ➔ Double and add 1!",
    step3Tip: "In doubling patterns, the difference between terms is not constant; it doubles at each step!",

    step4Badge: "STEP 4",
    step4Tag: "Algebra",
    step4Title: "The General Rule (Formula for n)",
    step4Desc: "Instead of writing dozens of numbers, we express the relationship between position (n) and term value:",
    seqTitle: "Sequence: 3, 7, 11, 15, 19, ...",
    formulaTitle: "Rule: 4 · n － 1",
    calcText1: "For the 100th term (n ＝ 100):",
    calcText2: "4 · 100 － 1 ＝ 400 － 1 ＝ 399!",
    step4Tip: "The formula for n saves time and lets us immediately compute any future term!",

    lab1Badge: "INTERACTIVE LAB 1",
    lab1Title: "Interactive Sequence Term Generator",
    lab1Desc: "Adjust the initial term, step size, and choose which term (position n) you want to compute:",
    ruleStepLabel: "STEP RULE:",
    addStepBtn: "➕ Addition (+ constant)",
    multStepBtn: "✖️ Multiplication (· 2, · 3)",
    firstTermLabel: "1st Term (α₁):",
    stepAddLabel: "Step (+):",
    stepMultLabel: "Step (·):",
    targetTermLabel: "TARGET TERM (POSITION n):",
    termResultLabel: "Value of",
    termResultSuffix: "Term (α",
    termsAnalysisTitle: "FIRST TERMS OF THE SEQUENCE",
    termBadgeSuffix: "th Term",
    mathInterpretationTitle: "Mathematical Interpretation:",
    interpAdd1: "To reach the",
    interpAdd2: "th term, we start from",
    interpAdd3: "and add",
    interpAdd4: "times the step",
    interpMult1: "th term, we multiply",
    interpMult2: "times by",

    lab2Badge: "INTERACTIVE LAB 2: RULE RECOGNITION",
    lab2Title: "«Pattern Detective»: Find the Hidden Rule",
    lab2Desc: "Select one of 4 classic patterns and see how mathematicians discover the rule and general expression:",
    verbalRuleLabel: "Verbal Rule:",
    generalFormulaLabel: "General Formula (for n):",

    problemsHeading: "Worked Real-World Sequence Problems",
    problemsSubheading: "How we apply sequence rules to practical problems.",

    prob1Badge: "PROBLEM 1: SAVINGS",
    prob1Tag: "Constant Step",
    prob1Title: "Calculating Piggy Bank Balance in Week 25",
    prob1Desc: "Nikos started saving with 15 € in his piggy bank. Each week he steadily adds 4 €. How much money will he have accumulated by the end of week 25?",
    prob1TableTitle: "SEQUENCE DATA",
    initialAmount: "Initial Amount",
    weeklyStep: "Weekly Step",
    weeksLabel: "Weeks (n)",
    stepsTitle: "Solution Steps:",
    prob1Step1: "Money added over 25 weeks:",
    prob1Step2: "Total amount:",
    prob1Step3: "Initial ＋ Additions",
    prob1Step4: "Mathematical formula:",
    prob1Secret: "Instead of adding 4 twenty-five times, we use multiplication: 25 · 4 ＝ 100!",

    prob2Badge: "PROBLEM 2: THEATER SEATING",
    prob2Tag: "Grandstand",
    prob2Title: "How Many Seats Does Row 12 Have?",
    prob2Desc: "In an outdoor amphitheater, row 1 has 18 seats. Each subsequent row has 3 more seats than the previous one (row 2: 21, row 3: 24, etc.). How many seats does row 12 have?",
    prob2TableTitle: "ROW DATA",
    row1Label: "Row 1 (α₁)",
    rowStepLabel: "Increase per row",
    targetRowLabel: "Target row",
    prob2Step1: "Between row 1 and row 12 there are",
    prob2Step1Sub: "increments (12 － 1 ＝ 11).",
    prob2Step2: "Total increase:",
    prob2Step3: "Seats in row 12:",
    prob2Step4: "Formula:",
    prob2Secret: "Caution: For the nth term we add the step n － 1 times (not n times), because the 1st term already contains the initial value!",

    ctaHeading: "Ready to Practice Arithmetic Patterns?",
    ctaDesc: "Test your skills across 10 interactive questions covering next term detection, nth term calculation, and sequence word problems for 6th Grade.",
    ctaBtn: "Start Exercises",

    presets: [
      {
        id: 'p1',
        title: 'Arithmetic (+5)',
        terms: [3, 8, 13, 18, 23, 28],
        rule: 'Add 5 to the previous term',
        formula: '5 · n － 2',
        badge: 'Constant Step'
      },
      {
        id: 'p2',
        title: 'Doubling (· 2)',
        terms: [2, 4, 8, 16, 32, 64],
        rule: 'Multiply the previous term by 2',
        formula: '2ⁿ',
        badge: 'Geometric'
      },
      {
        id: 'p3',
        title: 'Odd Numbers (+2)',
        terms: [1, 3, 5, 7, 9, 11],
        rule: 'Start at 1 and add 2',
        formula: '2 · n － 1',
        badge: 'Classic Pattern'
      },
      {
        id: 'p4',
        title: 'Fibonacci Sequence',
        terms: [1, 1, 2, 3, 5, 8],
        rule: 'Each term is the sum of the two preceding terms',
        formula: 'α(n) ＝ α(n-1) ＋ α(n-2)',
        badge: 'Natural Pattern'
      }
    ]
  }
};

export default function ArithmitikaMotibaTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Δυναμική Ακολουθία
  const [startVal, setStartVal] = useState(3);
  const [stepVal, setStepVal] = useState(4);
  const [currentN, setCurrentN] = useState(6);
  const [seqMode, setSeqMode] = useState('add'); // 'add' | 'mult'

  // Μορφοποίηση αριθμού ανάλογα με τη γλώσσα
  const formatNumberLocale = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '0';
    const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
    return Number(val).toLocaleString(numLocale);
  };

  // Υπολογισμός των πρώτων όρων
  const sequenceTerms = useMemo(() => {
    const terms = [];
    let cur = startVal;
    for (let i = 1; i <= Math.max(currentN, 8); i++) {
      if (i === 1) {
        terms.push({ n: 1, val: startVal });
      } else {
        if (seqMode === 'add') {
          cur += stepVal;
        } else {
          cur *= stepVal;
        }
        terms.push({ n: i, val: cur });
      }
    }
    return terms;
  }, [startVal, stepVal, currentN, seqMode]);

  // Υπολογισμός του n-οστού όρου
  const targetTermVal = useMemo(() => {
    if (seqMode === 'add') {
      return startVal + (currentN - 1) * stepVal;
    }
    return startVal * Math.pow(stepVal, currentN - 1);
  }, [startVal, stepVal, currentN, seqMode]);

  // Εργαστήριο 2: Επιλογή προκαθορισμένου μοτίβου (Pattern Detective)
  const [selectedPresetId, setSelectedPresetId] = useState('p1');

  const activePreset = useMemo(() => {
    return t.presets.find(p => p.id === selectedPresetId) || t.presets[0];
  }, [selectedPresetId, t.presets]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/64-arithmitika-motiba-ask"
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
              href="/st-dimotikou/64-arithmitika-motiba-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div><strong>{t.term1}</strong></div>
                  <div><strong>{t.termOther}</strong></div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-bold text-blue-900 mt-2">
                    4, 7, 10, 13, 16, 19, ...
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans text-center">
                    {t.seqExampleText}
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>{t.step2Rule1Title}</strong><br />
                    {t.step2Rule1Ex}
                  </div>
                  <div>
                    • <strong>{t.step2Rule2Title}</strong><br />
                    {t.step2Rule2Ex}
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>{t.step3Rule1Title}</strong><br />
                    {t.step3Rule1Ex}
                  </div>
                  <div>
                    • <strong>{t.step3Rule2Title}</strong><br />
                    {t.step3Rule2Ex}
                  </div>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono text-center">
                  <div className="text-emerald-900 font-bold">{t.seqTitle}</div>
                  <div className="text-blue-700 font-black text-sm">{t.formulaTitle}</div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-1">
                    {t.calcText1}<br />
                    {t.calcText2}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΗ ΑΚΟΛΟΥΘΙΑ */}
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

            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Επιλογή Τρόπου Αύξησης */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {t.ruleStepLabel}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSeqMode('add'); setStepVal(4); }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      seqMode === 'add'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.addStepBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSeqMode('mult'); setStepVal(2); }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      seqMode === 'mult'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.multStepBtn}
                  </button>
                </div>
              </div>

              {/* Ρύθμιση Αρχικού Όρου & Βήματος */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-blue-900 block uppercase">{t.firstTermLabel}</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStartVal(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      －
                    </button>
                    <span className="font-mono text-lg font-black text-blue-700">{startVal}</span>
                    <button
                      type="button"
                      onClick={() => setStartVal(prev => Math.min(10, prev + 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-amber-900 block uppercase">
                    {seqMode === 'add' ? t.stepAddLabel : t.stepMultLabel}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStepVal(prev => Math.max(seqMode === 'mult' ? 2 : 1, prev - 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      －
                    </button>
                    <span className="font-mono text-lg font-black text-amber-700">{stepVal}</span>
                    <button
                      type="button"
                      onClick={() => setStepVal(prev => Math.min(seqMode === 'mult' ? 3 : 10, prev + 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Επιλογή Θέσης ν */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    {t.targetTermLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm">
                    ν ＝ {currentN}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={seqMode === 'mult' ? 10 : 25}
                  step={1}
                  value={currentN}
                  onChange={(e) => setCurrentN(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 font-mono">
                <span className="text-xs font-sans text-emerald-800 block font-bold">
                  {t.termResultLabel} {currentN}{t.termResultSuffix}{currentN}):
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formatNumberLocale(targetTermVal)}
                </div>
              </div>

            </div>

            {/* Οπτική Απεικόνιση των Πρώτων Όρων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {t.termsAnalysisTitle}
              </span>

              {/* Πλέγμα όρων */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sequenceTerms.slice(0, 8).map((term) => {
                  const isCurrent = term.n === currentN;
                  return (
                    <div
                      key={`term-${term.n}`}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] block font-sans uppercase font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {term.n}{t.termBadgeSuffix}
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black block mt-0.5">
                        {formatNumberLocale(term.val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Ανάλυση υπολογισμού */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div>
                  💡 <strong>{t.mathInterpretationTitle}</strong>{' '}
                  {seqMode === 'add' ? (
                    <>
                      {t.interpAdd1} {currentN}{t.interpAdd2} {startVal} {t.interpAdd3} {currentN - 1} {t.interpAdd4} {stepVal}:<br />
                      <span className="font-mono font-bold text-blue-700">
                        {startVal} ＋ ({currentN - 1} · {stepVal}) ＝ {startVal} ＋ {(currentN - 1) * stepVal} ＝ {targetTermVal}
                      </span>
                    </>
                  ) : (
                    <>
                      {t.interpAdd1} {currentN}{t.interpMult1} {currentN - 1} {t.interpMult2} {stepVal}:<br />
                      <span className="font-mono font-bold text-indigo-700">
                        {startVal} · {stepVal}<sup className="text-xs">{currentN - 1}</sup> ＝ {formatNumberLocale(targetTermVal)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: PATTERN DETECTIVE */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>🔍 {t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Επιλογές Μοτίβων */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {t.presets.map((p) => {
                const isSelected = p.id === selectedPresetId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`p-3 rounded-2xl border text-left transition touch-manipulation ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                      {p.badge}
                    </span>
                    <span className="font-black text-xs sm:text-sm block mt-0.5">
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Παρουσίαση Ακολουθίας & Κανόνα */}
            <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
                {activePreset.terms.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="bg-white border border-slate-300 text-slate-900 font-black text-lg sm:text-2xl px-4 py-2 rounded-2xl shadow-xs">
                      {item}
                    </span>
                    {idx < activePreset.terms.length - 1 && (
                      <span className="text-slate-400 font-bold text-lg">,</span>
                    )}
                  </div>
                ))}
                <span className="text-slate-400 font-bold text-xl">...</span>
              </div>

              {/* Ανάλυση Κανόνα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-center">
                  <span className="text-xs text-slate-500 font-sans block font-semibold">{t.verbalRuleLabel}</span>
                  <p className="text-sm sm:text-base font-black text-slate-800">{activePreset.rule}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-center">
                  <span className="text-xs text-slate-500 font-sans block font-semibold">{t.generalFormulaLabel}</span>
                  <p className="text-sm sm:text-base font-mono font-black text-indigo-700">{activePreset.formula}</p>
                </div>
              </div>
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
              <h4 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.initialAmount}</span> 15 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.weeklyStep}</span> ＋ 4 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.weeksLabel}</span> 25
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.prob1Step1}</strong> 25 · 4 € ＝ <strong>100 €</strong>.</div>
                  <div><strong>{t.prob1Step2}</strong> {t.prob1Step3} ＝ 15 ＋ 100 ＝ <strong className="text-blue-700">115 €</strong>.</div>
                  <div><strong>{t.prob1Step4}</strong> 15 ＋ (4 · ν).</div>
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
              <h4 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob2TableTitle}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.row1Label}</span> 18 καθίσματα
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.rowStepLabel}</span> ＋ 3
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.targetRowLabel}</span> 12η
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div>{t.prob2Step1} <strong>11 {t.prob2Step1Sub}</strong></div>
                  <div><strong>{t.prob2Step2}</strong> 11 · 3 ＝ <strong>33 καθίσματα</strong>.</div>
                  <div><strong>{t.prob2Step3}</strong> 18 ＋ 33 ＝ <strong className="text-amber-700">51 καθίσματα</strong>.</div>
                  <div><strong>{t.prob2Step4}</strong> 18 ＋ 3 · (ν － 1).</div>
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
            href="/st-dimotikou/64-arithmitika-motiba-ask"
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