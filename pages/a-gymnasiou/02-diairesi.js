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
    metaTitle: "Ευκλείδεια Διαίρεση & Διαιρετότητα | Α' Γυμνασίου",
    metaDescription: "Θεωρία, διαδραστικά εργαστήρια, κριτήρια διαιρετότητας και πρώτοι αριθμοί για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΑΣΚΗΣΕΙΣ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Ευκλείδεια Διαίρεση, Διαιρετότητα & Πρώτοι Αριθμοί",
    mainSubtitle: "Μαθαίνουμε τη θεμελιώδη ταυτότητα της διαίρεσης, τους κανόνες διαιρετότητας για αριθμούς έως και 10 ψηφία και τη διάκριση πρώτων και σύνθετων αριθμών.",
    
    // Ενότητα 1
    sec1Title: "Η Έννοια της Ευκλείδειας Διαίρεσης",
    sec1Intro: "Όταν έχουμε δύο φυσικούς αριθμούς Δ (Διαιρετέος) και δ (Διαιρέτης με δ ≠ 0), υπάρχουν δύο μοναδικοί φυσικοί αριθμοί π (πηλίκο) και υ (υπόλοιπο) τέτοιοι ώστε:",
    sec1Identity: "Δ ＝ δ · π ＋ υ",
    sec1ConstraintTitle: "⚠️ Απαράβατος Περιορισμός Υπολοίπου:",
    sec1ConstraintFormula: "0 ≤ υ ＜ δ",
    sec1ConstraintDesc: "Το υπόλοιπο είναι πάντοτε φυσικός αριθμός και αυστηρά μικρότερο από τον διαιρέτη.",
    sec1ExactTitle: "Τέλεια Διαίρεση (υ ＝ 0)",
    sec1ExactDesc: "Όταν το υπόλοιπο είναι 0, ισχύει Δ ＝ δ · π. Ο δ διαιρεί ακριβώς τον Δ.",
    sec1InexactTitle: "Ατελής Διαίρεση (υ ＞ 0)",
    sec1InexactDesc: "Όταν περισσεύει μη μηδενικό υπόλοιπο, τότε Δ ＝ δ · π ＋ υ με υ ＜ δ.",
    
    // Εργαστήριο 1
    lab1Title: "🛠️ Διαδραστικό Εργαστήριο: Οπτική Αναπαράσταση Διαίρεσης (Μοίρασμα σε Ανθρώπους)",
    dividendLabel: "Διαιρετέος (Δ) • Συνολικές Μπάλες",
    divisorLabel: "Διαιρέτης (δ) • Άνθρωποι",
    divisionIdentityLabel: "Ταυτότητα Ευκλείδειας Διαίρεσης:",
    exactTag: "ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (υ ＝ 0)",
    inexactTag: "ΑΤΕΛΗΣ (υ ＝ {remainder} ＜ {divisor})",
    sharingIntro: "Έχουμε {dividend} μπάλες και τις μοιράζουμε ισόποσα σε {divisor} ανθρώπους:",
    eachGets: "Καθένας παίρνει: {quotient} {ballUnit}",
    ballUnitSingular: "μπάλα",
    ballUnitPlural: "μπάλες",
    zeroBalls: "0 μπάλες",
    personNth: "ος",
    remainderTitle: "Περίσσεψαν (Υπόλοιπο):",
    remainderDesc: "Δεν φτάνουν για να πάρουν όλοι από άλλη μία.",
    sharedSummary: "Μοιράστηκαν {total} μπάλες ισότιμα",
    summaryRemainder: " και περίσσεψαν {remainder} (αφού {remainder} ＜ {divisor}).",
    summaryExact: " και δεν περίσσεψε καμία μπάλα (Τέλεια Διαίρεση!).",

    // Ενότητα 2
    sec2Title: "Διαιρετότητα & Κριτήρια Διαιρετότητας",
    sec2Intro: "Λέμε ότι ένας φυσικός αριθμός α διαιρείται από έναν φυσικό αριθμό β (β ≠ 0), όταν η διαίρεση α : β είναι τέλεια (υ ＝ 0).",
    divisorDef: "Ο β ονομάζεται διαιρέτης του α.",
    multipleDef: "Ο α ονομάζεται πολλαπλάσιο του β.",
    notationDef: "Συμβολισμός: α ＝ β · κ (όπου κ φυσικός αριθμός).",
    propertiesTitle: "Χρήσιμες Ιδιότητες Διαιρετότητας",
    prop1: "Το 1 είναι διαιρέτης κάθε φυσικού αριθμού (α ＝ α · 1).",
    prop2: "Κάθε φυσικός αριθμός α ≠ 0 είναι διαιρέτης του εαυτού του (α ＝ 1 · α).",
    prop3: "Το 0 είναι πολλαπλάσιο κάθε φυσικού αριθμού β ≠ 0 (0 ＝ 0 · β).",
    prop4: "Αν ένας αριθμός διαιρεί δύο άλλους, διαιρεί και το άθροισμα και τη διαφορά τους.",

    // Κανόνες Διαιρετότητας
    rulesHeading: "Κανόνες (Κριτήρια) Διαιρετότητας",
    ruleDiv2Title: "Διαίρεση με το 2",
    ruleDiv2Subtitle: "Λήγει σε άρτιο ψηφίο",
    ruleDiv2Desc: "Το τελευταίο ψηφίο είναι 0, 2, 4, 6 ή 8.",
    ruleDiv3Title: "Διαίρεση με το 3",
    ruleDiv3Subtitle: "Άθροισμα ψηφίων",
    ruleDiv3Desc: "Το άθροισμα των ψηφίων του διαιρείται με το 3.",
    ruleDiv4Title: "Διαίρεση με το 4",
    ruleDiv4Subtitle: "Δύο τελευταία ψηφία",
    ruleDiv4Desc: "Τα 2 τελευταία ψηφία σχηματίζουν αριθμό που διαιρείται με το 4 (ή λήγει σε 00).",
    ruleDiv5Title: "Διαίρεση με το 5",
    ruleDiv5Subtitle: "Λήγει σε 0 ή 5",
    ruleDiv5Desc: "Το τελευταίο του ψηφίο είναι αποκλειστικά 0 ή 5.",
    ruleDiv9Title: "Διαίρεση με το 9",
    ruleDiv9Subtitle: "Άθροισμα ψηφίων",
    ruleDiv9Desc: "Το άθροισμα των ψηφίων του διαιρείται με το 9.",
    ruleDiv10_25Title: "Διαίρεση με το 10 & 25",
    ruleDiv10_25Subtitle: "Τελικά ψηφία",
    ruleDiv10_25Desc: "Με το 10: λήγει σε 0. Με το 25: τα 2 τελευταία ψηφία είναι 00, 25, 50 ή 75.",

    // Εργαστήριο 2
    lab2Title: "🛠️ Διαδραστικός Έλεγχος Κριτηρίων Διαιρετότητας (έως 10 ψηφία)",
    typeNumberLabel: "Πληκτρολόγησε αριθμό (Μέγιστο 10 ψηφία)",
    placeholderNumber: "π.χ. 120",
    divisionBy: "Διαίρεση με το",
    yesTag: "✅ ΝΑΙ",
    noTag: "❌ ΟΧΙ",
    emptyInputNotice: "Πληκτρολόγησε έναν αριθμό στο παραπάνω πλαίσιο για να δεις τα κριτήρια διαιρετότητας.",

    // Ενότητα 3
    sec3Title: "Πρώτοι & Σύνθετοι Αριθμοί",
    primeDefTitle: "Πρώτος Αριθμός",
    primeDefDesc: "Ονομάζεται κάθε φυσικός αριθμός μεγαλύτερος του 1 που έχει ακριβώς δύο διαφορετικούς διαιρέτες: τη μονάδα (1) και τον εαυτό του.",
    primeExamples: "Παραδείγματα: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...",
    compositeDefTitle: "Σύνθετος Αριθμός",
    compositeDefDesc: "Ονομάζεται κάθε φυσικός αριθμός μεγαλύτερος του 1 που έχει περισσότερους από δύο διαιρέτες.",
    compositeExamples: "Παραδείγματα: 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20...",
    notesTitle: "Σημαντικές Παρατηρήσεις",
    note1: "Ο αριθμός 1 δεν είναι ούτε πρώτος ούτε σύνθετος, γιατί έχει μόνο έναν διαιρέτη (τον εαυτό του).",
    note2: "Ο αριθμός 0 δεν είναι ούτε πρώτος ούτε σύνθετος.",
    note3: "Ο αριθμός 2 είναι ο μικρότερος πρώτος αριθμός και ο μοναδικός άρτιος πρώτος. Όλοι οι άλλοι άρτιοι είναι σύνθετοι (διαιρούνται με το 2).",
    note4: "Κάθε σύνθετος φυσικός αριθμός μπορεί να αναλυθεί σε γινόμενο πρώτων παραγόντων κατά μοναδικό τρόπο.",

    // Εργαστήριο 3
    lab3Title: "🛠️ Διαδραστικό Εργαστήριο: Έλεγχος Πρώτου ή Σύνθετου Αριθμού",
    chooseNumLabel: "Επίλεξε αριθμό (2 έως 100)",
    classificationBadge: "ΧΑΡΑΚΤΗΡΙΣΜΟΣ",
    primeBadge: "ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ",
    compositeBadge: "ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ",
    numIsPrimeResult: "Ο αριθμός {num} είναι Πρώτος",
    numIsCompositeResult: "Ο αριθμός {num} είναι Σύνθετος",
  },
  en: {
    metaTitle: "Euclidean Division & Divisibility | 7th Grade",
    metaDescription: "Theory, interactive math labs, divisibility rules, and prime numbers for 7th Grade.",
    backText: "7th Grade",
    actionButton: "EXERCISES",
    badge: "7TH GRADE • THEORY & LAB",
    mainTitle: "Euclidean Division, Divisibility & Prime Numbers",
    mainSubtitle: "Master the fundamental identity of division, divisibility criteria for numbers up to 10 digits, and the distinction between prime and composite numbers.",
    
    // Section 1
    sec1Title: "The Concept of Euclidean Division",
    sec1Intro: "Given two natural numbers D (Dividend) and d (Divisor with d ≠ 0), there exist unique natural numbers q (quotient) and r (remainder) such that:",
    sec1Identity: "D ＝ d · q ＋ r",
    sec1ConstraintTitle: "⚠️ Mandatory Remainder Constraint:",
    sec1ConstraintFormula: "0 ≤ r ＜ d",
    sec1ConstraintDesc: "The remainder is always a natural number and strictly less than the divisor.",
    sec1ExactTitle: "Exact Division (r ＝ 0)",
    sec1ExactDesc: "When the remainder is 0, D ＝ d · q holds. d divides D exactly.",
    sec1InexactTitle: "Division with Remainder (r ＞ 0)",
    sec1InexactDesc: "When a non-zero remainder remains, then D ＝ d · q ＋ r with r ＜ d.",

    // Lab 1
    lab1Title: "🛠️ Interactive Lab: Visual Representation of Division (Sharing Among People)",
    dividendLabel: "Dividend (D) • Total Balls",
    divisorLabel: "Divisor (d) • People",
    divisionIdentityLabel: "Euclidean Division Identity:",
    exactTag: "EXACT DIVISION (r ＝ 0)",
    inexactTag: "WITH REMAINDER (r ＝ {remainder} ＜ {divisor})",
    sharingIntro: "We have {dividend} balls and share them equally among {divisor} people:",
    eachGets: "Each gets: {quotient} {ballUnit}",
    ballUnitSingular: "ball",
    ballUnitPlural: "balls",
    zeroBalls: "0 balls",
    personNth: "th",
    remainderTitle: "Leftover (Remainder):",
    remainderDesc: "Not enough to give one more to everyone.",
    sharedSummary: "Distributed {total} balls equally",
    summaryRemainder: " and {remainder} were left over (since {remainder} ＜ {divisor}).",
    summaryExact: " and no balls were left over (Exact Division!).",

    // Section 2
    sec2Title: "Divisibility & Divisibility Criteria",
    sec2Intro: "A natural number a is divisible by a natural number b (b ≠ 0) when the division a : b is exact (r ＝ 0).",
    divisorDef: "b is called a divisor of a.",
    multipleDef: "a is called a multiple of b.",
    notationDef: "Notation: a ＝ b · k (where k is a natural number).",
    propertiesTitle: "Useful Divisibility Properties",
    prop1: "1 is a divisor of every natural number (a ＝ a · 1).",
    prop2: "Every natural number a ≠ 0 divides itself (a ＝ 1 · a).",
    prop3: "0 is a multiple of every natural number b ≠ 0 (0 ＝ 0 · b).",
    prop4: "If a number divides two others, it also divides their sum and difference.",

    // Divisibility Rules
    rulesHeading: "Divisibility Rules (Criteria)",
    ruleDiv2Title: "Division by 2",
    ruleDiv2Subtitle: "Ends in an even digit",
    ruleDiv2Desc: "The last digit is 0, 2, 4, 6, or 8.",
    ruleDiv3Title: "Division by 3",
    ruleDiv3Subtitle: "Sum of digits",
    ruleDiv3Desc: "The sum of its digits is divisible by 3.",
    ruleDiv4Title: "Division by 4",
    ruleDiv4Subtitle: "Last two digits",
    ruleDiv4Desc: "The last 2 digits form a number divisible by 4 (or ends in 00).",
    ruleDiv5Title: "Division by 5",
    ruleDiv5Subtitle: "Ends in 0 or 5",
    ruleDiv5Desc: "Its last digit is strictly 0 or 5.",
    ruleDiv9Title: "Division by 9",
    ruleDiv9Subtitle: "Sum of digits",
    ruleDiv9Desc: "The sum of its digits is divisible by 9.",
    ruleDiv10_25Title: "Division by 10 & 25",
    ruleDiv10_25Subtitle: "Final digits",
    ruleDiv10_25Desc: "By 10: ends in 0. By 25: the last 2 digits are 00, 25, 50, or 75.",

    // Lab 2
    lab2Title: "🛠️ Interactive Divisibility Checker (up to 10 digits)",
    typeNumberLabel: "Enter number (Max 10 digits)",
    placeholderNumber: "e.g. 120",
    divisionBy: "Division by",
    yesTag: "✅ YES",
    noTag: "❌ NO",
    emptyInputNotice: "Type a number in the input box above to check divisibility criteria.",

    // Section 3
    sec3Title: "Prime & Composite Numbers",
    primeDefTitle: "Prime Number",
    primeDefDesc: "Any natural number greater than 1 that has exactly two distinct divisors: 1 and itself.",
    primeExamples: "Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...",
    compositeDefTitle: "Composite Number",
    compositeDefDesc: "Any natural number greater than 1 that has more than two divisors.",
    compositeExamples: "Examples: 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20...",
    notesTitle: "Important Remarks",
    note1: "1 is neither prime nor composite, as it has only one divisor (itself).",
    note2: "0 is neither prime nor composite.",
    note3: "2 is the smallest prime and the only even prime. All other even numbers are composite (divisible by 2).",
    note4: "Every composite natural number can be factored uniquely into a product of prime factors.",

    // Lab 3
    lab3Title: "🛠️ Interactive Lab: Prime or Composite Checker",
    chooseNumLabel: "Select number (2 to 100)",
    classificationBadge: "CLASSIFICATION",
    primeBadge: "PRIME NUMBER",
    compositeBadge: "COMPOSITE NUMBER",
    numIsPrimeResult: "The number {num} is Prime",
    numIsCompositeResult: "The number {num} is Composite",
  },
};

export default function DiairesiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  // State για το διαδραστικό εργαστήριο Ευκλείδειας Διαίρεσης
  const [dividend, setDividend] = useState(23); // Διαιρετέος (Δ)
  const [divisor, setDivisor] = useState(6);   // Διαιρέτης (δ)

  // State για τον διαδραστικό έλεγχο διαιρετότητας (string για έλεγχο έως 10 ψηφία)
  const [testNumberStr, setTestNumberStr] = useState('120');

  // State για το διαδραστικό εργαστήριο Πρώτων & Σύνθετων
  const [primeTestNum, setPrimeTestNum] = useState(17);

  // Υπολογισμοί Ευκλείδειας Διαίρεσης: Δ = δ · π + υ
  const quotient = useMemo(() => Math.floor(dividend / divisor), [dividend, divisor]);
  const remainder = useMemo(() => dividend % divisor, [dividend, divisor]);
  const isExact = remainder === 0;

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Χειρισμός εισαγωγής αριθμού κριτηρίων (μόνο ψηφία, έως 10 ψηφία)
  const handleTestNumberInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 10) {
      setTestNumberStr(val);
    }
  };

  // Αυξομείωση κατά 1 για τον έλεγχο διαιρετότητας
  const handleTestNumberStep = (delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const current = BigInt(testNumberStr === '' ? '0' : testNumberStr);
    const next = current + BigInt(delta);
    if (next < 0n) return;
    const nextStr = next.toString();
    if (nextStr.length <= 10) {
      setTestNumberStr(nextStr);
    }
  };

  // Κριτήρια διαιρετότητας (ανθεκτικά σε αριθμούς έως 10 ψηφία)
  const divisibilityRules = useMemo(() => {
    if (!testNumberStr || testNumberStr.trim() === '') {
      return [];
    }

    const s = testNumberStr;
    const len = s.length;
    const lastDigit = parseInt(s[len - 1], 10);
    const lastTwoDigits = len >= 2 ? parseInt(s.slice(-2), 10) : lastDigit;
    const sumDigits = s
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

    const isEl = locale === 'el';

    return [
      {
        divisor: 2,
        divisible: lastDigit % 2 === 0,
        reason: isEl
          ? `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit % 2 === 0 ? 'άρτιο' : 'περιττό'}).`
          : `The last digit is ${lastDigit} (${lastDigit % 2 === 0 ? 'even' : 'odd'}).`,
      },
      {
        divisor: 3,
        divisible: sumDigits % 3 === 0,
        reason: isEl
          ? `Το άθροισμα των ψηφίων είναι ${sumDigits} (${sumDigits % 3 === 0 ? 'διαιρείται με το 3' : 'δεν διαιρείται με το 3'}).`
          : `The sum of digits is ${sumDigits} (${sumDigits % 3 === 0 ? 'divisible by 3' : 'not divisible by 3'}).`,
      },
      {
        divisor: 4,
        divisible: lastTwoDigits % 4 === 0,
        reason: isEl
          ? `Τα δύο τελευταία ψηφία σχηματίζουν τον αριθμό ${lastTwoDigits} (${lastTwoDigits % 4 === 0 ? 'διαιρείται με το 4' : 'δεν διαιρείται με το 4'}).`
          : `The last two digits form the number ${lastTwoDigits} (${lastTwoDigits % 4 === 0 ? 'divisible by 4' : 'not divisible by 4'}).`,
      },
      {
        divisor: 5,
        divisible: lastDigit === 0 || lastDigit === 5,
        reason: isEl
          ? `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit === 0 || lastDigit === 5 ? 'λήγει σε 0 ή 5' : 'δεν λήγει σε 0 ή 5'}).`
          : `The last digit is ${lastDigit} (${lastDigit === 0 || lastDigit === 5 ? 'ends in 0 or 5' : 'does not end in 0 or 5'}).`,
      },
      {
        divisor: 9,
        divisible: sumDigits % 9 === 0,
        reason: isEl
          ? `Το άθροισμα των ψηφίων είναι ${sumDigits} (${sumDigits % 9 === 0 ? 'διαιρείται με το 9' : 'δεν διαιρείται με το 9'}).`
          : `The sum of digits is ${sumDigits} (${sumDigits % 9 === 0 ? 'divisible by 9' : 'not divisible by 9'}).`,
      },
      {
        divisor: 10,
        divisible: lastDigit === 0,
        reason: isEl
          ? `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit === 0 ? 'λήγει σε 0' : 'δεν λήγει σε 0'}).`
          : `The last digit is ${lastDigit} (${lastDigit === 0 ? 'ends in 0' : 'does not end in 0'}).`,
      },
      {
        divisor: 25,
        divisible: [0, 25, 50, 75].includes(lastTwoDigits),
        reason: isEl
          ? `Τα δύο τελευταία ψηφία είναι ${lastTwoDigits} (${[0, 25, 50, 75].includes(lastTwoDigits) ? 'λήγει σε 00, 25, 50 ή 75' : 'δεν λήγει σε 00, 25, 50 ή 75'}).`
          : `The last two digits are ${lastTwoDigits} (${[0, 25, 50, 75].includes(lastTwoDigits) ? 'ends in 00, 25, 50, or 75' : 'does not end in 00, 25, 50, or 75'}).`,
      },
    ];
  }, [testNumberStr, locale]);

  // Εύρεση διαιρετών για τον έλεγχο πρώτων/σύνθετων
  const primeAnalysis = useMemo(() => {
    const n = primeTestNum;
    const isEl = locale === 'el';

    if (n < 2) {
      return {
        isPrime: false,
        isNeither: true,
        divisors: n === 1 ? [1] : [0],
        text: n === 1
          ? (isEl ? 'Το 1 έχει μόνο 1 διαιρέτη τον εαυτό του.' : '1 has only 1 divisor: itself.')
          : (isEl ? 'Το 0 έχει άπειρους διαιρέτες.' : '0 has infinitely many divisors.'),
      };
    }
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    const isPrime = divs.length === 2;
    return {
      isPrime,
      isNeither: false,
      divisors: divs,
      text: isPrime
        ? (isEl
            ? `Έχει ακριβώς 2 διαιρέτες: το 1 και το ${n}.`
            : `Has exactly 2 divisors: 1 and ${n}.`)
        : (isEl
            ? `Έχει ${divs.length} διαιρέτες: ${divs.join(', ')}.`
            : `Has ${divs.length} divisors: ${divs.join(', ')}.`),
    };
  }, [primeTestNum, locale]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/02-diairesi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.actionButton)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16">
        
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΕΥΚΛΕΙΔΕΙΑ ΔΙΑΙΡΕΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>{t.sec1Intro}</p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-bold text-center text-lg sm:text-2xl font-mono">
                {locale === 'el' ? 'Δ ＝ δ · π ＋ υ' : 'D ＝ d · q ＋ r'}
              </div>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs sm:text-sm font-semibold">
                {t.sec1ConstraintTitle}{' '}
                <strong className="font-mono">
                  {locale === 'el' ? '0 ≤ υ ＜ δ' : '0 ≤ r ＜ d'}
                </strong>
                <div className="text-slate-600 font-normal mt-1">
                  {t.sec1ConstraintDesc}
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {locale === 'el' ? 'Τέλεια και Ατελής Διαίρεση' : 'Exact & Inexact Division'}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700 text-sm sm:text-base">
                    {t.sec1ExactTitle}
                  </div>
                  <p className="text-slate-600 mt-1">
                    {t.sec1ExactDesc}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-indigo-700 text-sm sm:text-base">
                    {t.sec1InexactTitle}
                  </div>
                  <p className="text-slate-600 mt-1">
                    {t.sec1InexactDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Ευκλείδειας Διαίρεσης */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.dividendLabel}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDividend, -1, 1, 50, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {locale === 'el' ? 'Δ' : 'D'} ＝ {dividend}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDividend, 1, 1, 50, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.divisorLabel}
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDivisor, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {locale === 'el' ? 'δ' : 'd'} ＝ {divisor}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDivisor, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
                  <div className="text-xs text-indigo-700 font-medium">
                    {t.divisionIdentityLabel}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-indigo-950 font-mono">
                    {dividend} ＝ {divisor} · {quotient} ＋ {remainder}
                  </div>
                  <div className="text-xs font-bold mt-1">
                    {isExact ? (
                      <span className="text-emerald-700">{t.exactTag}</span>
                    ) : (
                      <span className="text-indigo-800">
                        {t.inexactTag.replace('{remainder}', remainder).replace('{divisor}', divisor)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ΟΠΤΙΚΟΠΟΙΗΣΗ: ΜΟΙΡΑΣΜΑ ΣΕ ΑΝΘΡΩΠΟΥΣ */}
              <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <div className="text-xs sm:text-sm text-slate-300">
                    {t.sharingIntro
                      .replace('{dividend}', dividend)
                      .replace('{divisor}', divisor)}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                    {t.eachGets
                      .replace('{quotient}', quotient)
                      .replace(
                        '{ballUnit}',
                        quotient === 1 ? t.ballUnitSingular : t.ballUnitPlural
                      )}
                  </span>
                </div>

                {/* Πλέγμα Ανθρώπων / Δικαιούχων */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Array.from({ length: divisor }).map((_, personIdx) => (
                    <div
                      key={`person-${personIdx}`}
                      className="bg-slate-950/80 border border-indigo-800/40 rounded-xl p-3 flex flex-col items-center space-y-2 shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 font-mono">
                        <span className="text-base">👤</span>
                        <span>{personIdx + 1}{t.personNth}</span>
                      </div>

                      {/* Μπάλες που πήρε αυτός ο άνθρωπος */}
                      <div className="w-full min-h-[58px] bg-slate-900/90 rounded-lg p-2 flex flex-wrap gap-1.5 items-center justify-center border border-slate-800">
                        {quotient > 0 ? (
                          Array.from({ length: quotient }).map((_, bIdx) => (
                            <span
                              key={`p-${personIdx}-b-${bIdx}`}
                              className="w-5 h-5 rounded-full bg-sky-400 shadow-sm flex items-center justify-center text-[10px] text-slate-950 font-black"
                              title={`${t.ballUnitSingular} ${bIdx + 1}`}
                            >
                              •
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            {t.zeroBalls}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono font-semibold">
                        {quotient} {quotient === 1 ? t.ballUnitSingular : t.ballUnitPlural}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Περίσσευμα / Υπόλοιπο (αν υπάρχει) */}
                {remainder > 0 && (
                  <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-black font-mono">
                        {locale === 'el' ? 'υ' : 'r'}
                      </span>
                      <div className="text-xs sm:text-sm text-rose-200">
                        <strong>{t.remainderTitle}</strong> {t.remainderDesc}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap bg-slate-950/80 px-3 py-1.5 rounded-lg border border-rose-900/40">
                      {Array.from({ length: remainder }).map((_, rIdx) => (
                        <span
                          key={`rem-ball-${rIdx}`}
                          className="w-5 h-5 rounded-full bg-rose-500 border border-rose-300 shadow-sm flex items-center justify-center text-[10px] text-white font-black"
                          title={`Remainder ${rIdx + 1}`}
                        >
                          •
                        </span>
                      ))}
                      <span className="text-xs text-rose-300 font-mono font-bold ml-1">
                        (＝ {remainder})
                      </span>
                    </div>
                  </div>
                )}

                {/* Συμπέρασμα */}
                <div className="text-slate-300 text-xs sm:text-sm pt-2 text-center border-t border-slate-800">
                  {t.sharedSummary.replace('{total}', `${divisor * quotient}`)}
                  {remainder > 0
                    ? t.summaryRemainder
                        .replace(/{remainder}/g, remainder)
                        .replace('{divisor}', divisor)
                    : t.summaryExact}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΙΡΕΤΟΤΗΤΑ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ & ΚΡΙΤΗΡΙΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              {t.sec2Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>{t.sec2Intro}</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-sm sm:text-base">
                <div>{t.divisorDef}</div>
                <div>{t.multipleDef}</div>
                <div className="font-mono font-semibold text-slate-900">
                  {t.notationDef}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-700 space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-indigo-950 text-sm sm:text-base">
                {t.propertiesTitle}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>{t.prop1}</li>
                <li>{t.prop2}</li>
                <li>{t.prop3}</li>
                <li>{t.prop4}</li>
              </ul>
            </div>
          </div>

          {/* Πίνακας Κριτηρίων Διαιρετότητας */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-slate-900">
              {t.rulesHeading}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv2Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv2Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv2Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv3Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv3Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv3Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv4Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv4Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv4Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv5Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv5Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv5Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv9Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv9Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv9Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  {toCleanUppercase(t.ruleDiv10_25Title)}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.ruleDiv10_25Subtitle}
                </div>
                <p className="text-xs text-slate-600">{t.ruleDiv10_25Desc}</p>
              </div>
            </div>
          </div>

          {/* Διαδραστικός Έλεγχος Κριτηρίων για οποιονδήποτε αριθμό (έως 10 ψηφία) */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.lab2Title}
            </h3>

            <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="max-w-md space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-600 uppercase">
                    {t.typeNumberLabel}
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {testNumberStr.length}/10
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleTestNumberStep(-1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={testNumberStr}
                    onChange={handleTestNumberInput}
                    placeholder={t.placeholderNumber}
                    className="h-full w-full bg-white rounded-xl border border-slate-300 text-slate-900 font-black text-center text-lg sm:text-xl font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />

                  <button
                    type="button"
                    onClick={(e) => handleTestNumberStep(1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πίνακας αποτελεσμάτων */}
              {testNumberStr ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {divisibilityRules.map((rule) => (
                    <div
                      key={rule.divisor}
                      className={`p-4 rounded-xl border transition-all ${
                        rule.divisible
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm sm:text-base">
                        <span>{t.divisionBy} {rule.divisor}</span>
                        <span>{rule.divisible ? t.yesTag : t.noTag}</span>
                      </div>
                      <p className="text-xs mt-1.5 leading-relaxed opacity-90">
                        {rule.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 font-medium text-sm">
                  {t.emptyInputNotice}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. ΠΡΩΤΟΙ ΚΑΙ ΣΥΝΘΕΤΟΙ ΑΡΙΘΜΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              {t.sec3Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="font-bold text-indigo-950 text-base sm:text-lg">
                  {t.primeDefTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t.primeDefDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-900 pt-1">
                  {t.primeExamples}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-base sm:text-lg">
                  {t.compositeDefTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t.compositeDefDesc}
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 pt-1">
                  {t.compositeExamples}
                </div>
              </div>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                {t.notesTitle}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>{t.note1}</li>
                <li>{t.note2}</li>
                <li>{t.note3}</li>
                <li>{t.note4}</li>
              </ul>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Ελέγχου Πρώτου/Σύνθετου */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.lab3Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  {t.chooseNumLabel}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setPrimeTestNum, -1, 2, 100, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-black text-xl font-mono">
                    {primeTestNum}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setPrimeTestNum, 1, 2, 100, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div className="lg:col-span-2 p-6 rounded-2xl border bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                    {toCleanUppercase(t.classificationBadge)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      primeAnalysis.isPrime
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {primeAnalysis.isPrime
                      ? toCleanUppercase(t.primeBadge)
                      : toCleanUppercase(t.compositeBadge)}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black font-mono">
                  {primeAnalysis.isPrime
                    ? t.numIsPrimeResult.replace('{num}', primeTestNum)
                    : t.numIsCompositeResult.replace('{num}', primeTestNum)}
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 leading-relaxed font-mono">
                  {primeAnalysis.text}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}