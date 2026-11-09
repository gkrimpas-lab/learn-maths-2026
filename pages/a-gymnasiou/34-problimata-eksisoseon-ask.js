import React, { useState, useEffect } from 'react';
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

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή
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

// Helper για δημιουργία HTML κλάσματος μέσα στα string των λύσεων
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-1 sm:px-1.5 border-b border-current w-full text-center break-all">${displayNum}</span><span class="pt-0.5 px-1 sm:px-1.5 w-full text-center break-all">${displayDen}</span></span></span>`;
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let count = 1;
  while (unique.size < 4) {
    unique.add(String(Number(correct) + count));
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Προβλήματα με Εξισώσεις αx + β = γ | Α' Γυμνασίου",
    pageDescription: "12 επιλεγμένα ρεαλιστικά προβλήματα καθημερινής ζωής και γεωμετρίας με εξισώσεις 1ου βαθμού για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 30 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Προβλήματα με Εξισώσεις α·x ＋ β ＝ γ",
    mainSubtitle: "Επίλυσε τα παρακάτω 12 ρεαλιστικά προβλήματα από την καθημερινή ζωή και τη γεωμετρία. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικά την αρχική εξίσωση και τη λύση κάθε προβλήματος.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "Γράψε την απάντηση...",
    correctBadge: "ΣΩΣΤΟ",
    wrongBadge: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkAnswersBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    newExercisesBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    finalScoreLabel: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progressLabel: "ΠΡΟΟΔΟΣ",
    successRateLabel: "ΕΠΙΤΥΧΙΑ",
    retryBtn: "ΕΠΑΝΑΛΗΨΗ",
    checkBtnShort: "ΕΛΕΓΧΟΣ",
  },
  en: {
    pageTitle: "Exercises: Word Problems with Equations ax + b = c | Grade 7 Math",
    pageDescription: "12 selected real-world and geometric application problems with linear equations for Grade 7 Math.",
    backText: "Grade 7 Math",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 30 • PRACTICE",
    mainTitle: "Word Problems with Equations a·x ＋ b ＝ c",
    mainSubtitle: "Solve the 12 real-world application problems below from daily life and geometry. Then click 'CHECK ANSWERS' to view your score along with initial equations and step-by-step solutions.",
    problemBadge: "PROBLEM",
    placeholderInput: "Type your answer...",
    correctBadge: "CORRECT",
    wrongBadge: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkAnswersBtn: "CHECK ANSWERS",
    newExercisesBtn: "NEW EXERCISES",
    finalScoreLabel: "FINAL SCORE",
    progressLabel: "PROGRESS",
    successRateLabel: "SUCCESS RATE",
    retryBtn: "RETRY",
    checkBtnShort: "CHECK",
  }
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ (ΚΑΘΕΜΙΑ ΜΕ ΠΑΡΑΛΛΑΓΕΣ & i18n el / en)
// ============================================================================

// Θέση 1: Προβλήματα Μεταφορών (Ταξί / Ενοικιάσεις)
const POOL_1_TRANSPORT = [
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(3, 6);
    const x = randInt(6, 18);
    const total = a * x + b;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Ένα ταξί έχει σημαία ${b} € και χρεώνει ${a} € για κάθε χιλιόμετρο. Αν ένας πελάτης πλήρωσε ${total} €, πόσα χιλιόμετρα διένυσε;`
        : `A taxi charges a ${b} € base fare plus ${a} € per kilometer. If a customer paid ${total} €, how many kilometers did they travel?`,
      correctAnswer: String(x),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${a} · x ＋ ${b} ＝ ${total} (όπου x τα χιλιόμετρα)
            </div>
            <div>1. Μεταφορά όρου: ${a} · x ＝ ${total} － ${b} ➔ ${a} · x ＝ ${total - b}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${a} σε μορφή κλάσματος: x ＝ ${fracHtml(total - b, a)} ＝ ${x} km.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${a} · x ＋ ${b} ＝ ${total} (where x is kilometers)
            </div>
            <div>1. Transpose constant: ${a} · x ＝ ${total} － ${b} ➔ ${a} · x ＝ ${total - b}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${a} in fractional form: x ＝ ${fracHtml(total - b, a)} ＝ ${x} km.
            </div>
          </div>
        `,
    };
  },
  (locale) => {
    const hourly = randInt(4, 8);
    const deposit = randInt(10, 20);
    const hours = randInt(2, 7);
    const total = hourly * hours + deposit;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ' : 'PROBLEMS: RENTALS',
      question: locale === 'el'
        ? `Η ενοικίαση ποδηλάτου κοστίζει ${deposit} € πάγια ασφάλεια συν ${hourly} € για κάθε ώρα. Αν ο λογαριασμός ήταν ${total} €, πόσες ώρες χρησιμοποιήθηκε το ποδήλατο;`
        : `Bicycle rental costs a ${deposit} € fixed insurance fee plus ${hourly} € per hour. If the total bill was ${total} €, how many hours was the bicycle rented?`,
      correctAnswer: String(hours),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${hourly} · x ＋ ${deposit} ＝ ${total} (όπου x οι ώρες)
            </div>
            <div>1. Μεταφορά όρου: ${hourly} · x ＝ ${total} － ${deposit} ➔ ${hourly} · x ＝ ${total - deposit}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${hourly} σε μορφή κλάσματος: x ＝ ${fracHtml(total - deposit, hourly)} ＝ ${hours} ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${hourly} · x ＋ ${deposit} ＝ ${total} (where x is hours)
            </div>
            <div>1. Transpose constant: ${hourly} · x ＝ ${total} － ${deposit} ➔ ${hourly} · x ＝ ${total - deposit}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${hourly} in fractional form: x ＝ ${fracHtml(total - deposit, hourly)} ＝ ${hours} hours.
            </div>
          </div>
        `,
    };
  },
  (locale) => {
    const kmRate = 3;
    const base = randInt(5, 8);
    const km = randInt(10, 25);
    const cost = kmRate * km + base;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Ένα φορτηγάκι μεταφορών χρεώνει ${base} € πάγια κράτηση συν ${kmRate} € ανά χιλιόμετρο. Πόσα χιλιόμετρα έγινε η μεταφορά αν το κόστος ήταν ${cost} €;`
        : `A moving van service charges a ${base} € flat booking fee plus ${kmRate} € per kilometer. How many kilometers was the transport if the total charge was ${cost} €?`,
      correctAnswer: String(km),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${kmRate} · x ＋ ${base} ＝ ${cost} (όπου x τα χιλιόμετρα)
            </div>
            <div>1. Μεταφορά όρου: ${kmRate} · x ＝ ${cost} － ${base} ➔ ${kmRate} · x ＝ ${cost - base}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${kmRate} σε μορφή κλάσματος: x ＝ ${fracHtml(cost - base, kmRate)} ＝ ${km} km.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${kmRate} · x ＋ ${base} ＝ ${cost} (where x is kilometers)
            </div>
            <div>1. Transpose constant: ${kmRate} · x ＝ ${cost} － ${base} ➔ ${kmRate} · x ＝ ${cost - base}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${kmRate} in fractional form: x ＝ ${fracHtml(cost - base, kmRate)} ＝ ${km} km.
            </div>
          </div>
        `,
    };
  },
  (locale) => {
    const rate = randInt(2, 5);
    const h = randInt(3, 8);
    const total = rate * h + 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ' : 'PROBLEMS: RENTALS',
      question: locale === 'el'
        ? `Για ένα ηλεκτρικό σκούτερ πληρώνεις 5 € για το ξεκλείδωμα και ${rate} € για κάθε ώρα βόλτας. Αν πλήρωσες ${total} €, πόσες ώρες έκανες βόλτα;`
        : `For an e-scooter, you pay 5 € unlock fee and ${rate} € for each riding hour. If you spent ${total} €, for how many hours did you ride?`,
      correctAnswer: String(h),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${rate} · x ＋ 5 ＝ ${total} (όπου x οι ώρες)
            </div>
            <div>1. Μεταφορά όρου: ${rate} · x ＝ ${total} － 5 ➔ ${rate} · x ＝ ${total - 5}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${rate} σε μορφή κλάσματος: x ＝ ${fracHtml(total - 5, rate)} ＝ ${h} ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${rate} · x ＋ 5 ＝ ${total} (where x is hours)
            </div>
            <div>1. Transpose constant: ${rate} · x ＝ ${total} － 5 ➔ ${rate} · x ＝ ${total - 5}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${rate} in fractional form: x ＝ ${fracHtml(total - 5, rate)} ＝ ${h} hours.
            </div>
          </div>
        `,
    };
  },
  (locale) => {
    const perDay = randInt(20, 35);
    const insurance = randInt(15, 30);
    const days = randInt(3, 9);
    const sum = perDay * days + insurance;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ' : 'PROBLEMS: RENTALS',
      question: locale === 'el'
        ? `Η ενοικίαση ενός αυτοκινήτου χρεώνει ${insurance} € εφάπαξ ασφάλιση και ${perDay} € ανά ημέρα. Πόσες ημέρες νοικιάστηκε το αυτοκίνητο αν το συνολικό ποσό ήταν ${sum} €;`
        : `Car rental requires ${insurance} € fixed insurance plus ${perDay} € per day. For how many days was the car rented if the total was ${sum} €?`,
      correctAnswer: String(days),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${perDay} · x ＋ ${insurance} ＝ ${sum} (όπου x οι ημέρες)
            </div>
            <div>1. Μεταφορά όρου: ${perDay} · x ＝ ${sum} － ${insurance} ➔ ${perDay} · x ＝ ${sum - insurance}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${perDay} σε μορφή κλάσματος: x ＝ ${fracHtml(sum - insurance, perDay)} ＝ ${days} ημέρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${perDay} · x ＋ ${insurance} ＝ ${sum} (where x is days)
            </div>
            <div>1. Transpose constant: ${perDay} · x ＝ ${sum} － ${insurance} ➔ ${perDay} · x ＝ ${sum - insurance}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${perDay} in fractional form: x ＝ ${fracHtml(sum - insurance, perDay)} ＝ ${days} days.
            </div>
          </div>
        `,
    };
  },
];

// Θέση 2: Προβλήματα Ηλικιών
const POOL_2_AGES = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const diff = 20 + i * 2;
    const sonAge = randInt(7, 14);
    const sum = 2 * sonAge + diff;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ' : 'PROBLEMS: AGES',
      question: locale === 'el'
        ? `Ένας πατέρας είναι κατά ${diff} χρόνια μεγαλύτερος από τον γιο του. Αν το άθροισμα των ηλικιών τους είναι ${sum} έτη, πόσων ετών είναι ο γιος;`
        : `A father is ${diff} years older than his son. If the sum of their ages is ${sum} years, how old is the son?`,
      correctAnswer: String(sonAge),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: x ＋ (x ＋ ${diff}) ＝ ${sum} (όπου x η ηλικία του γιου)
            </div>
            <div>1. Αναγωγή ομοίων όρων: 2 · x ＋ ${diff} ＝ ${sum} ➔ 2 · x ＝ ${sum - diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(sum - diff, 2)} ＝ ${sonAge} ετών.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: x ＋ (x ＋ ${diff}) ＝ ${sum} (where x is son's age)
            </div>
            <div>1. Collect like terms: 2 · x ＋ ${diff} ＝ ${sum} ➔ 2 · x ＝ ${sum - diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 2 in fractional form: x ＝ ${fracHtml(sum - diff, 2)} ＝ ${sonAge} years old.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 3: Προβλήματα Περιμέτρου Ορθογωνίου (Μήκος = x + διαφορά)
const POOL_3_RECT_PERIMETER = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const diff = 4 + i;
    const width = randInt(6, 18);
    const perimeter = 4 * width + 2 * diff;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα ορθογώνιο οικόπεδο έχει μήκος κατά ${diff} μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του οικοπέδου είναι ${perimeter} μέτρα, ποιο είναι το πλάτος του σε μέτρα;`
        : `A rectangular plot has a length ${diff} meters greater than its width. If the perimeter is ${perimeter} meters, what is its width in meters?`,
      correctAnswer: String(width),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · x ＋ 2 · (x ＋ ${diff}) ＝ ${perimeter} (όπου x το πλάτος)
            </div>
            <div>1. Επιμεριστική και αναγωγή: 4 · x ＋ ${2 * diff} ＝ ${perimeter} ➔ 4 · x ＝ ${perimeter - 2 * diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(perimeter - 2 * diff, 4)} ＝ ${width} m.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · x ＋ 2 · (x ＋ ${diff}) ＝ ${perimeter} (where x is width)
            </div>
            <div>1. Distribute and collect: 4 · x ＋ ${2 * diff} ＝ ${perimeter} ➔ 4 · x ＝ ${perimeter - 2 * diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(perimeter - 2 * diff, 4)} ＝ ${width} m.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 4: Προβλήματα Αγορών & Ρέστα
const POOL_4_SHOPPING = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const count = 3 + (i % 4);
    const itemCost = randInt(4, 9);
    const extraItem = randInt(2, 6);
    const bill = count * itemCost + extraItem;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? `Ο Πέτρος αγόρασε ${count} όμοια τετράδια και έναν μαρκαδόρο που κόστιζε ${extraItem} €. Πλήρωσε συνολικά ${bill} €. Πόσο κόστισε το κάθε τετράδιο σε ευρώ;`
        : `Petros bought ${count} identical notebooks and a marker costing ${extraItem} €. He paid a total of ${bill} €. How much did each notebook cost in euros?`,
      correctAnswer: String(itemCost),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${count} · x ＋ ${extraItem} ＝ ${bill} (όπου x η τιμή ανά τετράδιο)
            </div>
            <div>1. Μεταφορά όρου: ${count} · x ＝ ${bill} － ${extraItem} ➔ ${count} · x ＝ ${bill - extraItem}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${count} σε μορφή κλάσματος: x ＝ ${fracHtml(bill - extraItem, count)} ＝ ${itemCost} €.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${count} · x ＋ ${extraItem} ＝ ${bill} (where x is notebook price)
            </div>
            <div>1. Transpose constant: ${count} · x ＝ ${bill} － ${extraItem} ➔ ${count} · x ＝ ${bill - extraItem}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${count} in fractional form: x ＝ ${fracHtml(bill - extraItem, count)} ＝ ${itemCost} €.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 5: Προβλήματα Διαδοχικών Αριθμών
const POOL_5_CONSECUTIVE = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const startNum = 11 + i * 3;
    const sum = 3 * startNum + 3;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? `Το άθροισμα τριών διαδοχικών ακεραίων αριθμών είναι ${sum}. Ποιος είναι ο μικρότερος από τους τρεις αριθμούς;`
        : `The sum of three consecutive integers is ${sum}. What is the smallest of the three integers?`,
      correctAnswer: String(startNum),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ ${sum} (όπου x ο μικρότερος)
            </div>
            <div>1. Αναγωγή ομοίων όρων: 3 · x ＋ 3 ＝ ${sum} ➔ 3 · x ＝ ${sum - 3}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(sum - 3, 3)} ＝ ${startNum}.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ ${sum} (where x is smallest)
            </div>
            <div>1. Collect like terms: 3 · x ＋ 3 ＝ ${sum} ➔ 3 · x ＝ ${sum - 3}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 3 in fractional form: x ＝ ${fracHtml(sum - 3, 3)} ＝ ${startNum}.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 6: Προβλήματα Αποταμίευσης
const POOL_6_SAVINGS = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const weekly = randInt(10, 25);
    const initial = randInt(20, 50);
    const weeks = randInt(4, 9);
    const goal = weekly * weeks + initial;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? `Η Ελένη έχει ήδη ${initial} € και αποταμιεύει ${weekly} € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συγκεντρώσει ${goal} €;`
        : `Eleni already has ${initial} € and saves ${weekly} € each week. In how many weeks will she have gathered ${goal} €?`,
      correctAnswer: String(weeks),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${weekly} · x ＋ ${initial} ＝ ${goal} (όπου x οι εβδομάδες)
            </div>
            <div>1. Μεταφορά όρου: ${weekly} · x ＝ ${goal} － ${initial} ➔ ${weekly} · x ＝ ${goal - initial}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${weekly} σε μορφή κλάσματος: x ＝ ${fracHtml(goal - initial, weekly)} ＝ ${weeks} εβδομάδες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${weekly} · x ＋ ${initial} ＝ ${goal} (where x is weeks)
            </div>
            <div>1. Transpose constant: ${weekly} · x ＝ ${goal} － ${initial} ➔ ${weekly} · x ＝ ${goal - initial}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${weekly} in fractional form: x ＝ ${fracHtml(goal - initial, weekly)} ＝ ${weeks} weeks.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 7: Προβλήματα Ισοσκελούς Τριγώνου
const POOL_7_TRIANGLE = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const base = 10 + i * 2;
    const leg = randInt(12, 22);
    const perimeter = 2 * leg + base;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα ισοσκελές τρίγωνο έχει βάση ${base} cm και περίμετρο ${perimeter} cm. Πόσα εκατοστά είναι το μήκος καθεμιάς από τις δύο ίσες πλευρές του;`
        : `An isosceles triangle has a base of ${base} cm and a perimeter of ${perimeter} cm. What is the length of each of its two equal sides in cm?`,
      correctAnswer: String(leg),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · x ＋ ${base} ＝ ${perimeter} (όπου x η ίση πλευρά)
            </div>
            <div>1. Μεταφορά όρου: 2 · x ＝ ${perimeter} － ${base} ➔ 2 · x ＝ ${perimeter - base}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(perimeter - base, 2)} ＝ ${leg} cm.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · x ＋ ${base} ＝ ${perimeter} (where x is equal side)
            </div>
            <div>1. Transpose constant: 2 · x ＝ ${perimeter} － ${base} ➔ 2 · x ＝ ${perimeter - base}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 2 in fractional form: x ＝ ${fracHtml(perimeter - base, 2)} ＝ ${leg} cm.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 8: Προβλήματα Επαγγελματικής Αμοιβής (Πάγιο + Ωρομίσθιο)
const POOL_8_TECHNICIAN = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const callout = 20 + i * 2;
    const hourly = randInt(12, 18);
    const hours = randInt(3, 7);
    const pay = hourly * hours + callout;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ' : 'PROBLEMS: SERVICES',
      question: locale === 'el'
        ? `Ένας ηλεκτρολόγος χρεώνει ${callout} € για την επίσκεψη και ${hourly} € για κάθε ώρα εργασίας. Αν η συνολική αμοιβή του ήταν ${pay} €, πόσες ώρες εργάστηκε;`
        : `An electrician charges ${callout} € call-out fee and ${hourly} € for each hour of work. If the total bill was ${pay} €, how many hours did he work?`,
      correctAnswer: String(hours),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${hourly} · x ＋ ${callout} ＝ ${pay} (όπου x οι ώρες εργασίας)
            </div>
            <div>1. Μεταφορά όρου: ${hourly} · x ＝ ${pay} － ${callout} ➔ ${hourly} · x ＝ ${pay - callout}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${hourly} σε μορφή κλάσματος: x ＝ ${fracHtml(pay - callout, hourly)} ＝ ${hours} ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${hourly} · x ＋ ${callout} ＝ ${pay} (where x is hours worked)
            </div>
            <div>1. Transpose constant: ${hourly} · x ＝ ${pay} － ${callout} ➔ ${hourly} · x ＝ ${pay - callout}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${hourly} in fractional form: x ＝ ${fracHtml(pay - callout, hourly)} ＝ ${hours} hours.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 9: Προβλήματα Κατανάλωσης (Δεξαμενή / Μείωση)
const POOL_9_CONSUMPTION = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const burnRate = 4 + (i % 3);
    const hours = randInt(5, 12);
    const remaining = randInt(20, 50);
    const initial = remaining + burnRate * hours;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΝΑΛΩΣΗ' : 'PROBLEMS: CONSUMPTION',
      question: locale === 'el'
        ? `Μια δεξαμενή περιείχε αρχικά ${initial} λίτρα καυσίμου και ο καυστήρας καταναλώνει ${burnRate} λίτρα ανά ώρα. Μετά από πόσες ώρες θα απομένουν ${remaining} λίτρα;`
        : `A fuel tank initially contained ${initial} liters, and the burner consumes ${burnRate} liters per hour. After how many hours will ${remaining} liters remain?`,
      correctAnswer: String(hours),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${initial} － ${burnRate} · x ＝ ${remaining} (όπου x οι ώρες)
            </div>
            <div>1. Μεταφορά όρων: －${burnRate} · x ＝ ${remaining} － ${initial} ➔ －${burnRate} · x ＝ －${initial - remaining}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το －${burnRate} σε μορφή κλάσματος: x ＝ ${fracHtml(initial - remaining, burnRate)} ＝ ${hours} ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${initial} － ${burnRate} · x ＝ ${remaining} (where x is hours)
            </div>
            <div>1. Transpose terms: －${burnRate} · x ＝ ${remaining} － ${initial} ➔ －${burnRate} · x ＝ －${initial - remaining}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by －${burnRate} in fractional form: x ＝ ${fracHtml(initial - remaining, burnRate)} ＝ ${hours} hours.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 10: Προβλήματα Συσκευασίας / Καταμερισμού
const POOL_10_PACKAGING = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const capacity = 5 + (i % 4);
    const boxCount = randInt(8, 16);
    const leftOver = randInt(3, 8);
    const totalItems = capacity * boxCount + leftOver;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Μαζεύτηκαν ${totalItems} κιλά κεράσια. Κρατήθηκαν ${leftOver} κιλά και τα υπόλοιπα συσκευάστηκαν σε τελάρα των ${capacity} κιλών. Πόσα τελάρα γέμισαν;`
        : `A harvest yielded ${totalItems} kg of cherries. ${leftOver} kg were set aside and the rest was packed into crates of ${capacity} kg each. How many crates were filled?`,
      correctAnswer: String(boxCount),
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${capacity} · x ＋ ${leftOver} ＝ ${totalItems} (όπου x τα τελάρα)
            </div>
            <div>1. Μεταφορά όρου: ${capacity} · x ＝ ${totalItems} － ${leftOver} ➔ ${capacity} · x ＝ ${totalItems - leftOver}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${capacity} σε μορφή κλάσματος: x ＝ ${fracHtml(totalItems - leftOver, capacity)} ＝ ${boxCount} τελάρα.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${capacity} · x ＋ ${leftOver} ＝ ${totalItems} (where x is crates)
            </div>
            <div>1. Transpose constant: ${capacity} · x ＝ ${totalItems} － ${leftOver} ➔ ${capacity} · x ＝ ${totalItems - leftOver}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${capacity} in fractional form: x ＝ ${fracHtml(totalItems - leftOver, capacity)} ＝ ${boxCount} crates.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 11: Προβλήματα Πολλαπλάσιων Ποσοτήτων (MCQ)
const POOL_11_MULTIPLES_MCQ = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const mult = 3 + (i % 3);
    const diff = randInt(5, 12);
    const x = randInt(7, 15);
    const target = mult * x - diff;
    const correct = String(x);
    const options = makeUniqueOptions(correct, [
      String(x + 2),
      String(x - 2),
      String(x + 5),
    ]);
    const multWordEl = mult === 3 ? 'τριπλάσιο' : mult === 4 ? 'τετραπλάσιο' : 'πενταπλάσιο';
    const multWordEn = mult === 3 ? 'triple' : mult === 4 ? 'four times' : 'five times';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? `Αν από το ${multWordEl} ενός αριθμού αφαιρέσουμε το ${diff}, βρίσκουμε ${target}. Ποιος είναι ο αριθμός;`
        : `If ${diff} is subtracted from ${multWordEn} a number, the result is ${target}. What is the number?`,
      options,
      correctAnswer: correct,
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: ${mult} · x － ${diff} ＝ ${target} (όπου x ο αριθμός)
            </div>
            <div>1. Μεταφορά όρου: ${mult} · x ＝ ${target} ＋ ${diff} ➔ ${mult} · x ＝ ${target + diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το ${mult} σε μορφή κλάσματος: x ＝ ${fracHtml(target + diff, mult)} ＝ ${x}.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: ${mult} · x － ${diff} ＝ ${target} (where x is the number)
            </div>
            <div>1. Transpose constant: ${mult} · x ＝ ${target} ＋ ${diff} ➔ ${mult} · x ＝ ${target + diff}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by ${mult} in fractional form: x ＝ ${fracHtml(target + diff, mult)} ＝ ${x}.
            </div>
          </div>
        `,
    };
  };
});

// Θέση 12: Προβλήματα Επιμερισμού Χρημάτων (MCQ)
const POOL_12_MONEY_SPLIT_MCQ = Array.from({ length: 10 }, (_, i) => {
  return (locale) => {
    const extra = 10 + i * 2;
    const shareB = randInt(25, 45);
    const shareA = shareB + extra;
    const total = shareA + shareB;
    const correct = String(shareB);
    const options = makeUniqueOptions(correct, [
      String(shareB + 10),
      String(shareB - 5),
      String(shareA),
    ]);
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: DISTRIBUTION',
      question: locale === 'el'
        ? `Δύο αδέλφια μοιράστηκαν ${total} €. Ο μεγαλύτερος πήρε ${extra} € περισσότερα από τον μικρότερο. Πόσα ευρώ πήρε ο μικρότερος αδελφός;`
        : `Two siblings split ${total} €. The older sibling took ${extra} € more than the younger. How many euros did the younger sibling receive?`,
      options,
      correctAnswer: correct,
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: x ＋ (x ＋ ${extra}) ＝ ${total} (όπου x το μερίδιο του μικρότερου)
            </div>
            <div>1. Αναγωγή ομοίων όρων: 2 · x ＋ ${extra} ＝ ${total} ➔ 2 · x ＝ ${total - extra}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(total - extra, 2)} ＝ ${shareB} €.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: x ＋ (x ＋ ${extra}) ＝ ${total} (where x is younger sibling's share)
            </div>
            <div>1. Collect like terms: 2 · x ＋ ${extra} ＝ ${total} ➔ 2 · x ＝ ${total - extra}.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 2 in fractional form: x ＝ ${fracHtml(total - extra, 2)} ＝ ${shareB} €.
            </div>
          </div>
        `,
    };
  };
});

// Συγκέντρωση των 12 δεξαμενών
const POOLS = [
  POOL_1_TRANSPORT,
  POOL_2_AGES,
  POOL_3_RECT_PERIMETER,
  POOL_4_SHOPPING,
  POOL_5_CONSECUTIVE,
  POOL_6_SAVINGS,
  POOL_7_TRIANGLE,
  POOL_8_TECHNICIAN,
  POOL_9_CONSUMPTION,
  POOL_10_PACKAGING,
  POOL_11_MULTIPLES_MCQ,
  POOL_12_MONEY_SPLIT_MCQ,
];

export default function ProblimataEksisoseonAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuestions = () => {
    const selected = POOLS.map((pool, idx) => {
      const randomGen = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: idx + 1,
        ...randomGen(locale),
      };
    });

    setQuestions(selected);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [locale]);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      const parsedUser = parseFloat(userAns);
      const parsedCorrect = parseFloat(correctAns);

      if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && userAns === String(parsedUser) && correctAns === String(parsedCorrect)) {
        if (Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          totalCorrect += 1;
        }
      } else if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && String(userAnswers[k]).trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/34-problimata-eksisoseon"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-6 sm:space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const parsedUser = parseFloat(cleanUser);
              const parsedCorrect = parseFloat(cleanCorrect);
              let isCorrect = false;

              if (isSubmitted) {
                if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && cleanUser === String(parsedUser) && cleanCorrect === String(parsedCorrect)) {
                  isCorrect = Math.abs(parsedUser - parsedCorrect) <= 0.05;
                } else {
                  isCorrect = cleanUser === cleanCorrect;
                }
              }

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden border-amber-200/80 bg-amber-50/10 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm bg-amber-100 text-amber-900 shrink-0">
                          {q.id}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                          {toCleanUppercase(t.problemBadge)}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-sm sm:text-base md:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-sm sm:text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="shrink-0 font-bold ml-1">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Αναλυτική Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border break-words [overflow-wrap:anywhere] ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-xs sm:text-sm">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-xs sm:text-sm">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 font-mono break-words [overflow-wrap:anywhere]">
                              <span>{t.correctAnswerLabel}&nbsp;&nbsp;</span>
                              <span
                                className="text-emerald-700 font-black break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-loose font-normal pt-2 border-t border-slate-200/60 break-words [overflow-wrap:anywhere]"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπιά Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswersBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercisesBtn)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6">
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRateLabel)}
                </div>
                <div
                  className={`text-sm sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-2.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-3 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtnShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-3 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.retryBtn)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}