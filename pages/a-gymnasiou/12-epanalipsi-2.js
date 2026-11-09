import React, { useState, useEffect } from 'react';
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
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 5: ΑΚΕΡΑΙΟΙ ΑΡΙΘΜΟΙ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH5 = [
  // 1. Εξίσωση με απόλυτη τιμή και άθροισμα λύσεων (Input)
  (locale) => {
    const k = randInt(4, 15);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • ABSOLUTE VALUE' : 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `If |x| ＝ ${k}, what is the sum of all possible values of x?`
          : `Αν |x| ＝ ${k}, ποιο είναι το άθροισμα όλων των δυνατών τιμών του x;`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? `The solutions are opposite numbers: x₁ ＝ ＋${k} and x₂ ＝ －${k}. Their sum is (＋${k}) ＋ (－${k}) ＝ 0.`
          : `Οι λύσεις της εξίσωσης είναι οι αντίθετοι αριθμοί x₁ ＝ ＋${k} και x₂ ＝ －${k}. Το άθροισμά τους είναι (＋${k}) ＋ (－${k}) ＝ 0.`,
    };
  },
  // 2. Πλήθος ακεραίων ανάμεσα σε δύο τιμές (Input)
  (locale) => {
    const a = randInt(5, 12);
    const b = randInt(4, 10);
    const count = a + b - 1;
    const lower = a - 1;
    const upper = b - 1;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • ORDERING INTEGERS' : 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `How many integers x satisfy the inequality: －${a} ＜ x ＜ ＋${b}?`
          : `Πόσοι ακέραιοι αριθμοί x ικανοποιούν τη διπλή ανισότητα: －${a} ＜ x ＜ ＋${b};`,
      correctAnswer: count.toString(),
      solution:
        locale === 'en'
          ? `The integers range from －${lower} to ＋${upper}. Total count: (${upper}) － (－${lower}) ＋ 1 ＝ ${count} integers.`
          : `Οι ακέραιοι είναι από το －${lower} έως το ＋${upper}. Πλήθος: (${upper}) － (－${lower}) ＋ 1 ＝ ${count} ακέραιοι.`,
    };
  },
  // 3. Διαφορά απολύτων τιμών (Input) - ΔΙΟΡΘΩΜΕΝΟ & ΑΠΟΛΥΤΑ ΣΑΦΕΣ
  (locale) => {
    const a = randInt(8, 16);
    const b = randInt(18, 30);
    const ans = a - b; // a < b => a - b < 0
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • ABSOLUTE VALUE' : 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Calculate: |－${a}| － |－${b}|`
          : `Υπολόγισε την τιμή: |－${a}| － |－${b}|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `|－${a}| ＝ ${a} and |－${b}| ＝ ${b}. Therefore: ${a} － ${b} ＝ ${ans}.`
          : `|－${a}| ＝ ${a} και |－${b}| ＝ ${b}. Επομένως: ${a} － ${b} ＝ ${ans}.`,
    };
  },
  // 4. Ελάχιστος ακέραιος μεγαλύτερος από αρνητικό (Input)
  (locale) => {
    const n = randInt(8, 25);
    const ans = -n + 1;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • ORDERING INTEGERS' : 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `What is the smallest integer strictly greater than －${n}?`
          : `Ποιος είναι ο μικρότερος ακέραιος αριθμός που είναι αυστηρά μεγαλύτερος από το －${n};`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `On the number line, the immediate integer to the right of －${n} is ${ans}.`
          : `Στον άξονα των αριθμών, ο αμέσως επόμενος (μεγαλύτερος) ακέραιος στα δεξιά του －${n} είναι ο ${ans}.`,
    };
  },
  // 5. Απόσταση στον άξονα (Input)
  (locale) => {
    const a = randInt(12, 35);
    const b = randInt(10, 25);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • DISTANCE ON NUMBER LINE' : 'ΚΕΦ. 5 • ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΑΞΟΝΑ',
      question:
        locale === 'en'
          ? `How many units apart on the number line are points A(－${a}) and B(＋${b})?`
          : `Πόσες μονάδες απέχουν στον άξονα τα σημεία Α(－${a}) και Β(＋${b});`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The distance is d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans} units.`
          : `Η απόσταση είναι d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans} μονάδες.`,
    };
  },
  // 6. Αντίθετος αντίθετου αριθμού (MCQ)
  (locale) => {
    const n = randInt(15, 60);
    const correct = `－${n}`;
    const candidates = [`＋${n}`, '0', `＋1`];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 5 • OPPOSITE NUMBERS' : 'ΚΕΦ. 5 • ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `What is the opposite of the opposite of －${n}?`
          : `Ποιος είναι ο αντίθετος του αντίθετου του αριθμού －${n};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `The opposite of －${n} is ＋${n}. The opposite of ＋${n} is －${n}: －[－(－${n})] ＝ －${n}.`
          : `Ο αντίθετος του －${n} είναι το ＋${n}. Ο αντίθετος του ＋${n} είναι πάλι ο －${n}: －[－(－${n})] ＝ －${n}.`,
    };
  },
  // 7. Σύγκριση απολύτων τιμών αρνητικών (MCQ)
  (locale) => {
    const a = randInt(5, 12);
    const b = a + randInt(3, 8);
    const correct = `|－${b}| ＞ |－${a}|`;
    const candidates = [
      `|－${b}| ＜ |－${a}|`,
      `|－${b}| ＝ |－${a}|`,
      `|－${b}| ＝ －|－${a}|`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 5 • ABSOLUTE VALUE & COMPARISON' : 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ & ΣΥΓΚΡΙΣΗ',
      question:
        locale === 'en'
          ? `If both numbers are negative with －${b} ＜ －${a}, which relation holds for their absolute values?`
          : `Αν και οι δύο αριθμοί είναι αρνητικοί με －${b} ＜ －${a}, ποια σχέση ισχύει για τις απόλυτες τιμές τους;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `The smaller negative number (－${b}) is further from 0, hence has a larger absolute value: |－${b}| ＞ |－${a}|.`
          : `Ο μικρότερος αρνητικός αριθμός (－${b}) απέχει μεγαλύτερη απόσταση από το 0, άρα έχει μεγαλύτερη απόλυτη τιμή: |－${b}| ＞ |－${a}|.`,
    };
  },
  // 8. Αδύνατη εξίσωση απολύτου (MCQ)
  (locale) => {
    const k = randInt(3, 15);
    const correct = locale === 'en' ? 'No solutions (impossible)' : 'Καμία λύση (αδύνατη)';
    const candidates =
      locale === 'en'
        ? ['One solution', 'Two solutions', 'Infinitely many solutions']
        : ['Μία λύση', 'Δύο λύσεις', 'Άπειρες λύσεις'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 5 • ABSOLUTE VALUE EQUATIONS' : 'ΚΕΦ. 5 • ΕΞΙΣΩΣΕΙΣ ΜΕ ΑΠΟΛΥΤΟ',
      question:
        locale === 'en'
          ? `How many integer solutions does the equation |x ＋ 3| ＝ －${k} have?`
          : `Πόσες ακέραιες λύσεις έχει η εξίσωση |x ＋ 3| ＝ －${k};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Absolute value represents distance and is non-negative (|A| ≥ 0). It can never equal a negative number.'
          : 'Η απόλυτη τιμή οποιασδήποτε παράστασης εκφράζει απόσταση και είναι πάντοτε μη αρνητική (|A| ≥ 0). Δεν μπορεί ποτέ να ισούται με αρνητικό αριθμό.',
    };
  },
  // 9. Άθροισμα όλων των ακεραίων σε συμμετρικό διάστημα (Input)
  (locale) => {
    const k = randInt(20, 80);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 5 • OPPOSITE NUMBERS' : 'ΚΕΦ. 5 • ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum of all integers from －${k} up to ＋${k}:`
          : `Υπολόγισε το άθροισμα όλων των ακεραίων από το －${k} έως και το ＋${k}:`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? `Each negative integer cancels out with its opposite positive counterpart: (－${k}) ＋ (＋${k}) ＝ 0, ..., (－1) ＋ (＋1) ＝ 0. With 0, the sum is 0.`
          : `Κάθε αρνητικός ακέραιος εξουδετερώνεται από τον αντίθετο θετικό του: (－${k}) ＋ (＋${k}) ＝ 0, ..., (－1) ＋ (＋1) ＝ 0. Με το 0 το συνολικό άθροισμα είναι 0.`,
    };
  },
  // 10. Μέγιστος αρνητικός ακέραιος (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 5 • ORDERING INTEGERS' : 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? 'What is the greatest negative integer?'
          : 'Ποιος είναι ο μεγαλύτερος αρνητικός ακέραιος αριθμός;',
      options: makeUniqueOptions('－1', ['0', '－10', locale === 'en' ? 'Does not exist' : 'Δεν υπάρχει']),
      correctAnswer: '－1',
      solution:
        locale === 'en'
          ? 'The integer －1 is closest to 0 on the number line (smallest absolute value among negatives), making it strictly greater than all other negative integers.'
          : 'Ο αριθμός －1 βρίσκεται πλησιέστερα στο 0 στον άξονα (έχει τη μικρότερη απόλυτη τιμή), επομένως είναι ο μεγαλύτερος από όλους τους αρνητικούς ακέραιους.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 6: ΠΡΟΣΘΕΣΗ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH6 = [
  // 1. Άθροισμα 4 όρων με αντίθετους (Input)
  (locale) => {
    const opp = randInt(15, 45);
    const a = randInt(10, 25);
    const b = a + randInt(4, 15);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • INTEGER ADDITION' : 'ΚΕΦ. 6 • ΠΡΟΣΘΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (＋${opp}) ＋ (－${b}) ＋ (－${opp}) ＋ (＋${a})`
          : `Υπολόγισε το άθροισμα: (＋${opp}) ＋ (－${b}) ＋ (－${opp}) ＋ (＋${a})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The terms ＋${opp} and －${opp} cancel to 0. Remaining: (－${b}) ＋ (＋${a}) ＝ ${ans}.`
          : `Οι όροι ＋${opp} και －${opp} είναι αντίθετοι και δίνουν άθροισμα 0. Απομένει: (－${b}) ＋ (＋${a}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },
  // 2. Εύρεση άγνωστου προσθετέου (Input)
  (locale) => {
    const a = randInt(12, 25);
    const diff = randInt(5, 15);
    const target = -(a + diff);
    const x = -diff;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • SOLVING FOR UNKNOWN' : 'ΚΕΦ. 6 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find integer x such that: (－${a}) ＋ x ＝ ${target}`
          : `Βρες τον ακέραιο x ώστε: (－${a}) ＋ x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (${target}) － (－${a}) ＝ ${target} ＋ ${a} ＝ ${x}.`
          : `x ＝ (${target}) － (－${a}) ＝ ${target} ＋ ${a} ＝ ${x}.`,
    };
  },
  // 3. Άθροισμα πολλών ομόσημων αρνητικών (Input)
  (locale) => {
    const a = randInt(12, 20);
    const b = randInt(15, 30);
    const c = randInt(8, 18);
    const ans = -(a + b + c);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • SAME SIGN NUMBERS' : 'ΚΕΦ. 6 • ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) ＋ (－${b}) ＋ (－${c})`
          : `Υπολόγισε: (－${a}) ＋ (－${b}) ＋ (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Keep the negative sign and add absolute values: －(${a} ＋ ${b} ＋ ${c}) ＝ ${ans}.`
          : `Προσθέτουμε τρεις αρνητικούς αριθμούς: κρατάμε το πρόσημο (－) και προσθέτουμε τις απόλυτες τιμές: －(${a} ＋ ${b} ＋ ${c}) ＝ ${ans}.`,
    };
  },
  // 4. Άθροισμα απολύτων τιμών και ετερόσημων (Input)
  (locale) => {
    const a = randInt(14, 25);
    const b = randInt(6, 12);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • ADDITION & ABSOLUTE VALUE' : 'ΚΕΦ. 6 • ΠΡΟΣΘΕΣΗ & ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Calculate: |－${a}| ＋ (－${b})`
          : `Υπολόγισε: |－${a}| ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `|－${a}| ＝ ${a}. Then: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`
          : `|－${a}| ＝ ${a}. Έπειτα: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },
  // 5. Πρόσημο αθροίσματος ετερόσημων (MCQ)
  (locale) => {
    const a = randInt(40, 70);
    const b = a + randInt(5, 20);
    const correct = locale === 'en' ? 'Negative (－)' : 'Αρνητικό (－)';
    const candidates =
      locale === 'en'
        ? ['Positive (＋)', 'Zero', 'Undefined']
        : ['Θετικό (＋)', 'Μηδέν', 'Δεν ορίζεται'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 6 • ADDITION THEORY' : 'ΚΕΦ. 6 • ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? `Without calculating, what is the sign of the sum (＋${a}) ＋ (－${b})?`
          : `Χωρίς να εκτελέσεις τον υπολογισμό, ποιο είναι το πρόσημο του αθροίσματος (＋${a}) ＋ (－${b});`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Since |－${b}| ＝ ${b} ＞ ${a} ＝ |＋${a}|, the sign of the number with larger absolute value prevails: negative (－).`
          : `Επειδή |－${b}| ＝ ${b} ＞ ${a} ＝ |＋${a}|, υπερισχύει το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή, δηλαδή το αρνητικό (－).`,
    };
  },
  // 6. Άθροισμα διαδοχικών ακεραίων (Input)
  (locale) => {
    const start = randInt(4, 8);
    const ans = (start + 1) + (start + 2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • SMART COMPUTATIONS' : 'ΚΕΦ. 6 • ΕΞΥΠΝΟΙ ΥΠΟΛΟΓΙΣΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum of all integers from －${start} through ＋${start + 2}:`
          : `Υπολόγισε το άθροισμα όλων των ακεραίων από το －${start} έως και το ＋${start + 2}:`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Terms from －${start} to ＋${start} cancel to 0. Remaining: (＋${start + 1}) ＋ (＋${start + 2}) ＝ ${ans}.`
          : `Οι όροι από －${start} έως ＋${start} είναι αντίθετοι και έχουν άθροισμα 0. Απομένει: (＋${start + 1}) ＋ (＋${start + 2}) ＝ ${ans}.`,
    };
  },
  // 7. Πότε το άθροισμα δύο ακεραίων είναι μικρότερο και από τους δύο (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'When both integers are negative'
        : 'Όταν και οι δύο αριθμοί είναι αρνητικοί';
    const candidates =
      locale === 'en'
        ? ['When one is positive and the other negative', 'When both integers are positive', 'Never']
        : ['Όταν ο ένας είναι θετικός και ο άλλος αρνητικός', 'Όταν και οι δύο αριθμοί είναι θετικοί', 'Ποτέ δεν μπορεί να συμβεί'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 6 • ADDITION THEORY' : 'ΚΕΦ. 6 • ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? 'When is the sum of two integers strictly less than both addends?'
          : 'Πότε το άθροισμα δύο ακεραίων αριθμών είναι μικρότερο και από τους δύο προσθετέους;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'When adding two negative numbers (e.g. (－3) ＋ (－5) ＝ －8), the sum is smaller than both (－8 ＜ －5 and －8 ＜ －3).'
          : 'Όταν προσθέτουμε δύο αρνητικούς αριθμούς (π.χ. (－3) ＋ (－5) ＝ －8), το άθροισμα είναι μικρότερο και από τους δύο προσθετέους (－8 ＜ －5 και －8 ＜ －3).',
    };
  },
  // 8. Άθροισμα με απλοποιημένη γραφή (Input)
  (locale) => {
    const a = randInt(25, 45);
    const b = randInt(12, 24);
    const c = randInt(15, 30);
    const ans = -a + b - c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • SIMPLIFIED NOTATION' : 'ΚΕΦ. 6 • ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question:
        locale === 'en'
          ? `Calculate: －${a} ＋ ${b} － ${c}`
          : `Υπολόγισε: －${a} ＋ ${b} － ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Group negatives: (－${a}) ＋ (－${c}) ＝ －${a + c}. Then: (－${a + c}) ＋ (＋${b}) ＝ ${ans}.`
          : `Ομαδοποιούμε τους αρνητικούς: (－${a}) ＋ (－${c}) ＝ －${a + c}. Στη συνέχεια: (－${a + c}) ＋ (＋${b}) ＝ ${ans}.`,
    };
  },
  // 9. Άθροισμα με ουδέτερο στοιχείο (Input)
  (locale) => {
    const n = randInt(35, 90);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • ADDITION PROPERTIES' : 'ΚΕΦ. 6 • ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate: 0 ＋ (－${n}) ＋ 0`
          : `Υπολόγισε: 0 ＋ (－${n}) ＋ 0`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `Zero is the additive identity element: 0 ＋ (－${n}) ＋ 0 ＝ －${n}.`
          : `Το 0 είναι το ουδέτερο στοιχείο της πρόσθεσης: 0 ＋ (－${n}) ＋ 0 ＝ －${n}.`,
    };
  },
  // 10. Συμπλήρωση ισότητας πρόσθεσης (Input)
  (locale) => {
    const a = randInt(8, 16);
    const b = randInt(18, 30);
    const ans = b + a;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 6 • SOLVING FOR UNKNOWN' : 'ΚΕΦ. 6 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find integer x such that: x ＋ (－${a}) ＝ ＋${b}`
          : `Βρες τον ακέραιο x ώστε: x ＋ (－${a}) ＝ ＋${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (＋${b}) － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans}.`
          : `x ＝ (＋${b}) － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 7: ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH7 = [
  // 1. Αρνητικός μείον αρνητικός (Input)
  (locale) => {
    const a = randInt(10, 25);
    const b = a + randInt(5, 18);
    const ans = -a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • INTEGER SUBTRACTION' : 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) － (－${b})`
          : `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Convert to addition of the opposite: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`
          : `Μετατρέπουμε σε πρόσθεση του αντιθέτου: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },
  // 2. Αρνητικός μείον θετικός (Input)
  (locale) => {
    const a = randInt(15, 30);
    const b = randInt(12, 28);
    const ans = -a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • INTEGER SUBTRACTION' : 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) － (＋${b})`
          : `Υπολόγισε τη διαφορά: (－${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`
          : `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },
  // 3. Θετικός μείον αρνητικός (Input)
  (locale) => {
    const a = randInt(14, 35);
    const b = randInt(15, 35);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • INTEGER SUBTRACTION' : 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (＋${a}) － (－${b})`
          : `Υπολόγισε: (＋${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${a}) ＋ (＋${b}) ＝ ${a} ＋ ${b} ＝ ${ans}.`
          : `(＋${a}) ＋ (＋${b}) ＝ ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },
  // 4. Αφαίρεση από το 0 (Input)
  (locale) => {
    const n = randInt(25, 75);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • SUBTRACT FROM ZERO' : 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΟ ΜΗΔΕΝ',
      question:
        locale === 'en'
          ? `Calculate: 0 － (－${n})`
          : `Υπολόγισε: 0 － (－${n})`,
      correctAnswer: n.toString(),
      solution:
        locale === 'en'
          ? `0 ＋ (＋${n}) ＝ ＋${n}.`
          : `0 ＋ (＋${n}) ＝ ＋${n}.`,
    };
  },
  // 5. Διαφορά δύο ίσων αρνητικών (Input)
  (locale) => {
    const n = randInt(40, 99);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • INTEGER SUBTRACTION' : 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${n}) － (－${n})`
          : `Υπολόγισε τη διαφορά: (－${n}) － (－${n})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? `The difference of any number from itself is 0: (－${n}) ＋ (＋${n}) ＝ 0.`
          : `Η διαφορά οποιουδήποτε αριθμού από τον εαυτό του ισούται με 0: (－${n}) ＋ (＋${n}) ＝ 0.`,
    };
  },
  // 6. Απαλοιφή παρενθέσεων με διπλά μείον (Input)
  (locale) => {
    const a = randInt(10, 20);
    const b = randInt(15, 30);
    const c = randInt(5, 15);
    const ans = a + b - c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • REMOVING PARENTHESES' : 'ΚΕΦ. 7 • ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate: ${a} － (－${b}) － (＋${c})`
          : `Υπολόγισε: ${a} － (－${b}) － (＋${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `－(－${b}) becomes ＋${b} and －(＋${c}) becomes －${c}: ${a} ＋ ${b} － ${c} ＝ ${ans}.`
          : `Το －(－${b}) γίνεται ＋${b} και το －(＋${c}) γίνεται －${c}: ${a} ＋ ${b} － ${c} ＝ ${ans}.`,
    };
  },
  // 7. Εύρεση άγνωστου αφαιρετέου: a - x = b (Input)
  (locale) => {
    const a = randInt(10, 25);
    const target = randInt(30, 50);
    const x = a - target;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • SOLVING FOR UNKNOWN' : 'ΚΕΦ. 7 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find integer x such that: ${a} － x ＝ ${target}`
          : `Βρες τον ακέραιο x ώστε: ${a} － x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ ${a} － ${target} ＝ ${x}.`
          : `x ＝ ${a} － ${target} ＝ ${x}.`,
    };
  },
  // 8. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'They are opposite numbers: (α － β) ＝ －(β － α)'
        : 'Είναι αντίθετοι αριθμοί: (α － β) ＝ －(β － α)';
    const candidates =
      locale === 'en'
        ? ['They are equal numbers', 'Their product is 0', 'They are always positive']
        : ['Είναι ίσοι αριθμοί', 'Το γινόμενό τους είναι 0', 'Είναι πάντα θετικοί'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 7 • SUBTRACTION THEORY' : 'ΚΕΦ. 7 • ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question:
        locale === 'en'
          ? 'What relation always holds between the differences (α － β) and (β － α)?'
          : 'Ποια σχέση ισχύει πάντοτε μεταξύ των διαφορών (α － β) και (β － α);',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Subtraction is not commutative. Swapping terms yields opposite values.'
          : 'Στην αφαίρεση δεν ισχύει η αντιμεταθετική ιδιότητα. Η εναλλαγή των όρων δίνει τον αντίθετο αριθμό.',
    };
  },
  // 9. Διαφορά απολύτων τιμών (Input)
  (locale) => {
    const a = randInt(15, 30);
    const b = randInt(35, 55);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • ABSOLUTE VALUE & SUBTRACTION' : 'ΚΕΦ. 7 • ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΦΑΙΡΕΣΗ',
      question:
        locale === 'en'
          ? `Calculate: |－${a}| － |－${b}|`
          : `Υπολόγισε: |－${a}| － |－${b}|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `|－${a}| ＝ ${a} and |－${b}| ＝ ${b}. Thus ${a} － ${b} ＝ ${ans}.`
          : `|－${a}| ＝ ${a} και |－${b}| ＝ ${b}. Άρα ${a} － ${b} ＝ ${ans}.`,
    };
  },
  // 10. Σύνθετη αφαίρεση με αγκύλες (Input)
  (locale) => {
    const a = randInt(10, 20);
    const b = randInt(5, 12);
    const c = randInt(14, 22);
    const inside = b - c;
    const ans = a - inside;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 7 • BRACKETS & SUBTRACTION' : 'ΚΕΦ. 7 • ΑΓΚΥΛΕΣ & ΑΦΑΙΡΕΣΗ',
      question:
        locale === 'en'
          ? `Calculate: ${a} － [ ${b} － ${c} ]`
          : `Υπολόγισε: ${a} － [ ${b} － ${c} ]`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Inside brackets: ${b} － ${c} ＝ ${inside}. Next: ${a} － (${inside}) ＝ ${a} ＋ ${Math.abs(inside)} ＝ ${ans}.`
          : `Μέσα στην αγκύλη: ${b} － ${c} ＝ ${inside}. Έπειτα: ${a} － (${inside}) ＝ ${a} ＋ ${Math.abs(inside)} ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 8: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH8 = [
  // 1. Γινόμενο 3 αρνητικών (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 4);
    const c = randInt(2, 5);
    const ans = -(a * b * c);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • MULTIPLICATION' : 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (－${b}) · (－${c})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (－${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `There are 3 negative factors (odd count), so the result is negative: －(${a} · ${b} · ${c}) ＝ ${ans}.`
          : `Έχουμε 3 αρνητικούς παράγοντες (περιττό πλήθος), άρα το πρόσημο είναι αρνητικό: －(${a} · ${b} · ${c}) ＝ ${ans}.`,
    };
  },
  // 2. Γινόμενο 4 αρνητικών (Input)
  (locale) => {
    const a = 2;
    const b = 3;
    const c = 2;
    const d = randInt(2, 4);
    const ans = a * b * c * d;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • MULTIPLICATION' : 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) · (－${b}) · (－${c}) · (－${d})`
          : `Υπολόγισε: (－${a}) · (－${b}) · (－${c}) · (－${d})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `There are 4 negative factors (even count), so the product is positive: ＋(${a} · ${b} · ${c} · ${d}) ＝ ＋${ans}.`
          : `Έχουμε 4 αρνητικούς παράγοντες (άρτιο πλήθος), άρα το αποτέλεσμα είναι θετικό: ＋(${a} · ${b} · ${c} · ${d}) ＝ ＋${ans}.`,
    };
  },
  // 3. Επιμεριστική ιδιότητα με κοινό παράγοντα (Input)
  (locale) => {
    const common = randInt(4, 9);
    const a = randInt(12, 25);
    const b = a - 10;
    const ans = common * 10;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • DISTRIBUTIVE PROPERTY' : 'ΚΕΦ. 8 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? `Calculate smartly: (－${common}) · (－${a}) ＋ (－${common}) · (＋${b})`
          : `Υπολόγισε έξυπνα: (－${common}) · (－${a}) ＋ (－${common}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Factor out (－${common}): (－${common}) · [ (－${a}) ＋ (＋${b}) ] ＝ (－${common}) · (－10) ＝ ＋${ans}.`
          : `Βγάζουμε κοινό παράγοντα το (－${common}): (－${common}) · [ (－${a}) ＋ (＋${b}) ] ＝ (－${common}) · (－10) ＝ ＋${ans}.`,
    };
  },
  // 4. Εύρεση άγνωστου παράγοντα με αρνητικά (Input)
  (locale) => {
    const a = randInt(4, 9);
    const mult = randInt(5, 12);
    const target = a * mult;
    const x = -mult;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • SOLVING FOR UNKNOWN' : 'ΚΕΦ. 8 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find integer x if: (－${a}) · x ＝ ＋${target}`
          : `Βρες τον ακέραιο x αν: (－${a}) · x ＝ ＋${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (＋${target}) : (－${a}) ＝ ${x}.`
          : `x ＝ (＋${target}) ： (－${a}) ＝ ${x}.`,
    };
  },
  // 5. Πολλαπλασιασμός με μηδέν ανάμεσα σε πολλούς όρους (Input)
  (locale) => {
    const a = randInt(12, 45);
    const b = randInt(5, 18);
    const c = randInt(8, 25);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • ZERO ELEMENT' : 'ΚΕΦ. 8 • ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) · (＋${b}) · 0 · (－${c})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (＋${b}) · 0 · (－${c})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'If any factor is 0, the entire product evaluates immediately to 0.'
          : 'Αν ένας τουλάχιστον παράγοντας σε ένα γινόμενο ισούται με 0, το γινόμενο μηδενίζεται άμεσα.',
    };
  },
  // 6. Πρόσημο γινομένου πολλών παραγόντων (MCQ)
  (locale) => {
    const negCount = randInt(15, 35) * 2 + 1;
    const posCount = randInt(10, 30);
    const correct = locale === 'en' ? 'Negative (－)' : 'Αρνητικό (－)';
    const candidates =
      locale === 'en'
        ? ['Positive (＋)', 'Zero', 'Cannot be determined']
        : ['Θετικό (＋)', 'Μηδέν', 'Δεν μπορούμε να γνωρίζουμε'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 8 • SIGN THEORY' : 'ΚΕΦ. 8 • ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question:
        locale === 'en'
          ? `In a product of ${negCount} negative and ${posCount} positive factors, what is the final sign?`
          : `Σε ένα γινόμενο ${negCount} αρνητικών και ${posCount} θετικών παραγόντων, ποιο είναι το τελικό πρόσημο;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `The sign depends only on the negative factors. Since ${negCount} is odd, the product is negative (－).`
          : `Το τελικό πρόσημο εξαρτάται μόνο από τους αρνητικούς παράγοντες. Επειδή το πλήθος τους (${negCount}) είναι περιττό, το γινόμενο είναι αρνητικό (－).`,
    };
  },
  // 7. Πολλαπλασιασμός με το -1 (Input)
  (locale) => {
    const n = randInt(35, 95);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • MULTIPLICATION BY -1' : 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question:
        locale === 'en'
          ? `Calculate: (－1) · (＋${n})`
          : `Υπολόγισε: (－1) · (＋${n})`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `Multiplying by －1 gives the opposite number: (－1) · (＋${n}) ＝ －${n}.`
          : `Ο πολλαπλασιασμός ενός αριθμού με το －1 δίνει πάντοτε τον αντίθετό του: (－1) · (＋${n}) ＝ －${n}.`,
    };
  },
  // 8. Άθροισμα γινομένων με αντίθετα πρόσημα (Input)
  (locale) => {
    const a = randInt(3, 6);
    const b = randInt(4, 8);
    const prod = a * b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • MULTIPLICATION PROPERTIES' : 'ΚΕΦ. 8 • ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) · (${b}) ＋ (${a}) · (${b})`
          : `Υπολόγισε: (－${a}) · (${b}) ＋ (${a}) · (${b})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? `－${prod} ＋ ${prod} ＝ 0.`
          : `－${prod} ＋ ${prod} ＝ 0.`,
    };
  },
  // 9. Διπλή εφαρμογή επιμεριστικής (Input)
  (locale) => {
    const a = 5;
    const b = 18;
    const c = 8;
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 8 • DISTRIBUTIVE PROPERTY' : 'ΚΕΦ. 8 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? `Calculate: (－5) · (－18) ＋ (－5) · (＋8)`
          : `Υπολόγισε: (－5) · (－18) ＋ (－5) · (＋8)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－5) · [ (－18) ＋ 8 ] ＝ (－5) · (－10) ＝ ＋50.`
          : `(－5) · [ (－18) ＋ 8 ] ＝ (－5) · (－10) ＝ ＋50.`,
    };
  },
  // 10. Ιδιότητα απορρόφησης (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'At least one of α or β equals 0'
        : 'Τουλάχιστον ένας από τους α ή β ισούται με 0';
    const candidates =
      locale === 'en'
        ? ['Both numbers are necessarily 0', 'Neither number is 0', 'The numbers are opposites']
        : ['Και οι δύο αριθμοί είναι υποχρεωτικά 0', 'Κανένας από τους δύο δεν είναι 0', 'Οι αριθμοί είναι αντίθετοι'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 8 • MULTIPLICATION THEORY' : 'ΚΕΦ. 8 • ΘΕΩΡΙΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question:
        locale === 'en'
          ? 'If the product of two integers α · β ＝ 0, what can be deduced with certainty?'
          : 'Αν το γινόμενο δύο ακεραίων α · β ＝ 0, ποιο είναι το βέβαιο συμπέρασμα;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'For the product to be zero, it is necessary that α ＝ 0 or β ＝ 0 (zero-product property).'
          : 'Για να είναι το γινόμενο δύο ακεραίων μηδέν, πρέπει απαραίτητα α ＝ 0 ή β ＝ 0 (ιδιότητα μηδενοδιαιρέτη).',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 9: ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH9 = [
  // 1. Δύναμη αρνητικού με άρτιο και περιττό εκθέτη σε άθροισμα (Input)
  (locale) => {
    const ans = 8;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • INTEGER POWERS' : 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? 'Calculate: (－2)<sup>4</sup> ＋ (－2)<sup>3</sup>'
          : 'Υπολόγισε: (－2)<sup>4</sup> ＋ (－2)<sup>3</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－2)<sup>4</sup> ＝ ＋16 and (－2)<sup>3</sup> ＝ －8. Thus 16 ＋ (－8) ＝ 8.'
          : '(－2)<sup>4</sup> ＝ ＋16 και (－2)<sup>3</sup> ＝ －8. Άρα 16 ＋ (－8) ＝ 8.',
    };
  },
  // 2. Η διαφορά (-α)² και -α² (Input)
  (locale) => {
    const a = randInt(3, 6);
    const pVal = a * a;
    const ans = pVal * 2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • PARENTHESES IN POWERS' : 'ΚΕΦ. 9 • ΠΑΡΕΝΘΕΣΕΙΣ ΣΤΙΣ ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: (－${a})<sup>2</sup> － (－${a}<sup>2</sup>)`
          : `Υπολόγισε τη διαφορά: (－${a})<sup>2</sup> － (－${a}<sup>2</sup>)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a})<sup>2</sup> ＝ ＋${pVal}, while －${a}<sup>2</sup> ＝ －${pVal}. Therefore: ${pVal} － (－${pVal}) ＝ ${pVal} ＋ ${pVal} ＝ ${ans}.`
          : `(－${a})<sup>2</sup> ＝ ＋${pVal}, ενώ －${a}<sup>2</sup> ＝ －${pVal}. Επομένως: ${pVal} － (－${pVal}) ＝ ${pVal} ＋ ${pVal} ＝ ${ans}.`,
    };
  },
  // 3. Δύναμη σε δύναμη με αρνητική βάση (MCQ)
  (locale) => {
    const base = randInt(2, 4);
    const correct = `(－${base})<sup>6</sup>`;
    const candidates = [
      `(－${base})<sup>5</sup>`,
      `－${base}<sup>6</sup>`,
      `(＋${base * base})<sup>3</sup>`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 9 • POWER PROPERTIES' : 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `Express as a single power: [ (－${base})<sup>2</sup> ]<sup>3</sup>`
          : `Πώς γράφεται ως μία δύναμη η παράσταση [ (－${base})<sup>2</sup> ]<sup>3</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Multiply exponents while preserving base: (α<sup>m</sup>)<sup>n</sup> ＝ α<sup>m·n</sup> ＝ (－${base})<sup>2 · 3</sup> ＝ (－${base})<sup>6</sup>.`
          : `Πολλαπλασιάζουμε τους εκθέτες διατηρώντας τη βάση: (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup> ＝ (－${base})<sup>2 · 3</sup> ＝ (－${base})<sup>6</sup>.`,
    };
  },
  // 4. Άθροισμα δυνάμεων του -1 με άρτιους και περιττούς (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • POWERS OF -1' : 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question:
        locale === 'en'
          ? 'Calculate: (－1)<sup>100</sup> － (－1)<sup>99</sup> ＋ (－1)<sup>0</sup>'
          : 'Υπολόγισε: (－1)<sup>100</sup> － (－1)<sup>99</sup> ＋ (－1)<sup>0</sup>',
      correctAnswer: '3',
      solution:
        locale === 'en'
          ? '(－1)<sup>100</sup> ＝ 1, (－1)<sup>99</sup> ＝ －1, (－1)<sup>0</sup> ＝ 1. Thus: 1 － (－1) ＋ 1 ＝ 1 ＋ 1 ＋ 1 ＝ 3.'
          : '(－1)<sup>100</sup> ＝ 1, (－1)<sup>99</sup> ＝ －1, (－1)<sup>0</sup> ＝ 1. Επομένως: 1 － (－1) ＋ 1 ＝ 1 ＋ 1 ＋ 1 ＝ 3.',
    };
  },
  // 5. Πηλίκο δυνάμεων με ίδια βάση (Input)
  (locale) => {
    const ans = -8;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • POWER PROPERTIES' : 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? 'Calculate the numerical value of: (－2)<sup>7</sup> : (－2)<sup>4</sup>'
          : 'Υπολόγισε την αριθμητική τιμή του πηλίκου: (－2)<sup>7</sup> ： (－2)<sup>4</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Subtract exponents: (－2)<sup>7 － 4</sup> ＝ (－2)<sup>3</sup> ＝ －8.'
          : 'Αφαιρούμε τους εκθέτες: (－2)<sup>7 － 4</sup> ＝ (－2)<sup>3</sup> ＝ －8.',
    };
  },
  // 6. Δύναμη γινομένου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • POWER PROPERTIES' : 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? 'Calculate: [ (－2) · (－5) ]<sup>2</sup>'
          : 'Υπολόγισε: [ (－2) · (－5) ]<sup>2</sup>',
      correctAnswer: '100',
      solution:
        locale === 'en'
          ? '(－2) · (－5) ＝ ＋10. Then: 10<sup>2</sup> ＝ 100.'
          : '(－2) · (－5) ＝ ＋10. Στη συνέχεια: 10<sup>2</sup> ＝ 100.',
    };
  },
  // 7. Τρίτη δύναμη αρνητικού αριθμού (Input)
  (locale) => {
    const ans = -27;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • ODD EXPONENT' : 'ΚΕΦ. 9 • ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? 'Calculate: (－3)<sup>3</sup>'
          : 'Υπολόγισε: (－3)<sup>3</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－3) · (－3) · (－3) ＝ 9 · (－3) ＝ －27.'
          : '(－3) · (－3) · (－3) ＝ 9 · (－3) ＝ －27.',
    };
  },
  // 8. Σύγκριση αρνητικών δυνάμεων (MCQ)
  (locale) => {
    const correct = '(－2)³ ＜ (－3)²';
    const candidates = [
      '(－2)³ ＞ (－3)²',
      '(－2)³ ＝ (－3)²',
      locale === 'en' ? 'Cannot be compared' : 'Δεν συγκρίνονται',
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 9 • POWER COMPARISON' : 'ΚΕΦ. 9 • ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? 'Which relation holds between (－2)<sup>3</sup> and (－3)<sup>2</sup>?'
          : 'Ποια σχέση ισχύει μεταξύ των (－2)<sup>3</sup> και (－3)<sup>2</sup>;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? '(－2)<sup>3</sup> ＝ －8 (negative) and (－3)<sup>2</sup> ＝ ＋9 (positive). Any negative number is less than any positive number.'
          : '(－2)<sup>3</sup> ＝ －8 (αρνητικό) και (－3)<sup>2</sup> ＝ ＋9 (θετικό). Κάθε αρνητικός είναι μικρότερος από κάθε θετικό.',
    };
  },
  // 9. Δύναμη με βάση το 0 (Input)
  (locale) => {
    const exp = randInt(5, 20);
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • POWERS OF 0' : 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΤΟΥ 0',
      question:
        locale === 'en'
          ? `Calculate: 0<sup>${exp}</sup>`
          : `Υπολόγισε: 0<sup>${exp}</sup>`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'Zero raised to any positive exponent equals 0.'
          : 'Το 0 υψωμένο σε οποιονδήποτε θετικό εκθέτη ισούται με 0.',
    };
  },
  // 10. Σύνθετη παράσταση με δυνάμεις (Input)
  (locale) => {
    const ans = 16;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 9 • OPERATIONS WITH POWERS' : 'ΚΕΦ. 9 • ΠΡΑΞΕΙΣ ΜΕ ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? 'Calculate: 5<sup>2</sup> － (－3)<sup>2</sup>'
          : 'Υπολόγισε: 5<sup>2</sup> － (－3)<sup>2</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '5<sup>2</sup> ＝ 25 and (－3)<sup>2</sup> ＝ ＋9. Thus: 25 － 9 ＝ 16.'
          : '5<sup>2</sup> ＝ 25 και (－3)<sup>2</sup> ＝ ＋9. Επομένως: 25 － 9 ＝ 16.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 10: ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ (10 ΑΣΚΗΣΕΙΣ - i18n)
// ========================================================
const POOL_CH10 = [
  // 1. Προτεραιότητα με αγκύλη και δύναμη (Input)
  (locale) => {
    const ans = -12;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • ORDER OF OPERATIONS' : 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: 4 · [ 15 － 2 · 3<sup>2</sup> ]'
          : 'Υπολόγισε: 4 · [ 15 － 2 · 3<sup>2</sup> ]',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '1) Power: 3<sup>2</sup> ＝ 9. 2) Multiplication: 2 · 9 ＝ 18. 3) Brackets: 15 － 18 ＝ －3. 4) Final: 4 · (－3) ＝ －12.'
          : '1) Δύναμη: 3<sup>2</sup> ＝ 9. 2) Πολλαπλασιασμός: 2 · 9 ＝ 18. 3) Αγκύλη: 15 － 18 ＝ －3. 4) Τελικό: 4 · (－3) ＝ －12.',
    };
  },
  // 2. Διαδοχική διαίρεση και πολλαπλασιασμός με αρνητικά (Input)
  (locale) => {
    const ans = 18;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • LEFT-TO-RIGHT ORDER' : 'ΚΕΦ. 10 • ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question:
        locale === 'en'
          ? 'Calculate: 36 : (－4) · (－2)'
          : 'Υπολόγισε: 36 ： (－4) · (－2)',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Evaluate left to right: 36 : (－4) ＝ －9, then (－9) · (－2) ＝ ＋18.'
          : 'Εκτελούμε από αριστερά προς τα δεξιά: 36 ： (－4) ＝ －9, και έπειτα (－9) · (－2) ＝ ＋18.',
    };
  },
  // 3. Δύο δυνάμεις και γινόμενο (Input)
  (locale) => {
    const ans = -40;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • ORDER OF OPERATIONS' : 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: (－2)<sup>3</sup> · 3 － (－4)<sup>2</sup>'
          : 'Υπολόγισε: (－2)<sup>3</sup> · 3 － (－4)<sup>2</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－2)<sup>3</sup> ＝ －8 and (－4)<sup>2</sup> ＝ 16. Then: (－8) · 3 ＝ －24. Finally: －24 － 16 ＝ －40.'
          : '(－2)<sup>3</sup> ＝ －8 και (－4)<sup>2</sup> ＝ 16. Έπειτα: (－8) · 3 ＝ －24. Τέλος: －24 － 16 ＝ －40.',
    };
  },
  // 4. Σύνθετη με εσωτερική παρένθεση: 50 - 2 * (3 + 4 * 2) (Input)
  (locale) => {
    const ans = 28;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • PARENTHESES' : 'ΚΕΦ. 10 • ΠΑΡΕΝΘΕΣΕΙΣ',
      question:
        locale === 'en'
          ? 'Calculate: 50 － 2 · (3 ＋ 4 · 2)'
          : 'Υπολόγισε: 50 － 2 · (3 ＋ 4 · 2)',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Inside parentheses: 4 · 2 ＝ 8, so 3 ＋ 8 ＝ 11. Next: 2 · 11 ＝ 22. Finally: 50 － 22 ＝ 28.'
          : 'Μέσα στην παρένθεση: 4 · 2 ＝ 8, άρα 3 ＋ 8 ＝ 11. Μετά: 2 · 11 ＝ 22. Τέλος: 50 － 22 ＝ 28.',
    };
  },
  // 5. Διαίρεση με άθροισμα σε παρένθεση (Input)
  (locale) => {
    const ans = 4;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • ORDER OF OPERATIONS' : 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: (18 － 34) : (－4)'
          : 'Υπολόγισε: (18 － 34) ： (－4)',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Parentheses first: 18 － 34 ＝ －16. Then division: (－16) : (－4) ＝ ＋4.'
          : 'Πρώτα η παρένθεση: 18 － 34 ＝ －16. Έπειτα η διαίρεση: (－16) ： (－4) ＝ ＋4.',
    };
  },
  // 6. Πολλαπλασιασμοί και προσθέσεις στη σειρά (Input)
  (locale) => {
    const ans = 5;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • ORDER OF OPERATIONS' : 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: (－3) · (－5) ＋ (－2) · 7 － (－4)'
          : 'Υπολόγισε: (－3) · (－5) ＋ (－2) · 7 － (－4)',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－3) · (－5) ＝ 15 and (－2) · 7 ＝ －14. Thus: 15 ＋ (－14) ＋ 4 ＝ 1 ＋ 4 ＝ 5.'
          : '(－3) · (－5) ＝ 15 και (－2) · 7 ＝ －14. Άρα: 15 ＋ (－14) ＋ 4 ＝ 1 ＋ 4 ＝ 5.',
    };
  },
  // 7. Προτεραιότητα με δύναμη έξω από παρένθεση (Input)
  (locale) => {
    const ans = 16;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • BRACKETS & POWERS' : 'ΚΕΦ. 10 • ΑΓΚΥΛΕΣ & ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? 'Calculate: [ (－2 ＋ 5) － 7 ]<sup>2</sup>'
          : 'Υπολόγισε: [ (－2 ＋ 5) － 7 ]<sup>2</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Inner parentheses: －2 ＋ 5 ＝ 3. Brackets: 3 － 7 ＝ －4. Power: (－4)<sup>2</sup> ＝ 16.'
          : 'Εσωτερική παρένθεση: －2 ＋ 5 ＝ 3. Αγκύλη: 3 － 7 ＝ －4. Δύναμη: (－4)<sup>2</sup> ＝ 16.',
    };
  },
  // 8. Συνηθισμένη παγίδα προτεραιότητας (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'CH. 10 • PRECEDENCE TRAPS' : 'ΚΕΦ. 10 • ΠΑΓΙΔΕΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question:
        locale === 'en'
          ? 'What is the value of: 10 － 3 · 2 ＋ 4?'
          : 'Ποιο είναι το αποτέλεσμα της παράστασης 10 － 3 · 2 ＋ 4;',
      options: makeUniqueOptions('8', ['18', '2', '14']),
      correctAnswer: '8',
      solution:
        locale === 'en'
          ? 'Multiplication first: 3 · 2 ＝ 6. Then from left to right: 10 － 6 ＝ 4 and 4 ＋ 4 ＝ 8.'
          : 'Προηγείται ο πολλαπλασιασμός: 3 · 2 ＝ 6. Έπειτα από αριστερά προς τα δεξιά: 10 － 6 ＝ 4 και 4 ＋ 4 ＝ 8.',
    };
  },
  // 9. Παράσταση με μηδενικό εκθέτη (Input)
  (locale) => {
    const ans = 2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • ORDER OF OPERATIONS' : 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: 7 ＋ 3 · (－5)<sup>0</sup> － 2 · 4'
          : 'Υπολόγισε: 7 ＋ 3 · (－5)<sup>0</sup> － 2 · 4',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－5)<sup>0</sup> ＝ 1. Multiplications: 3 · 1 ＝ 3 and 2 · 4 ＝ 8. Finally: 7 ＋ 3 － 8 ＝ 2.'
          : '(－5)<sup>0</sup> ＝ 1. Πολλαπλασιασμοί: 3 · 1 ＝ 3 και 2 · 4 ＝ 8. Τέλος: 7 ＋ 3 － 8 ＝ 2.',
    };
  },
  // 10. Σύνθετη με αρνητικά πρόσημα έξω από αγκύλη (Input)
  (locale) => {
    const ans = 10;
    return {
      type: 'input',
      topic: locale === 'en' ? 'CH. 10 • COMPOUND BRACKETS' : 'ΚΕΦ. 10 • ΣΥΝΘΕΤΕΣ ΑΓΚΥΛΕΣ',
      question:
        locale === 'en'
          ? 'Calculate: －[ －4 ＋ 2 · (－3) ]'
          : 'Υπολόγισε: －[ －4 ＋ 2 · (－3) ]',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? 'Inside brackets: 2 · (－3) ＝ －6, so －4 ＋ (－6) ＝ －10. With outside minus: －(－10) ＝ ＋10.'
          : 'Μέσα στην αγκύλη: 2 · (－3) ＝ －6, άρα －4 ＋ (－6) ＝ －10. Με το μείον απ\' έξω: －(－10) ＝ ＋10.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΣΥΝΔΥΑΣΤΙΚΩΝ ΠΡΟΒΛΗΜΑΤΩΝ (4 ΠΡΟΒΛΗΜΑΤΑ - i18n)
// ========================================================
const POOL_WORD_PROBLEMS = [
  // Πρόβλημα 1: Θερμοκρασιακές μεταβολές με ρυθμό και αρχική τιμή
  (locale) => {
    const t0 = randInt(2, 6);
    const dropRate = 2;
    const hoursDrop = randInt(3, 5);
    const rise = randInt(4, 8);
    const totalDrop = hoursDrop * dropRate;
    const ans = t0 - totalDrop + rise;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMBINED PROBLEM • TEMPERATURE' : 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `At a mountain meteorological station the afternoon temperature was ＋${t0} °C. Over the night it dropped steadily by 2 °C per hour for ${hoursDrop} consecutive hours, and in the morning rose by ${rise} °C. What was the final temperature in °C?`
          : `Σε έναν ορεινό μετεωρολογικό σταθμό η θερμοκρασία το απόγευμα ήταν ＋${t0} °C. Τη νύχτα έπεφτε σταθερά κατά 2 °C κάθε ώρα για ${hoursDrop} συνεχόμενες ώρες, ενώ το πρωί ανέβηκε κατά ${rise} °C. Ποια είναι η τελική θερμοκρασία σε °C;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${t0} － ${hoursDrop} · 2 ＋ ${rise} ＝ ${t0} － ${totalDrop} ＋ ${rise} ＝ ${ans} °C.`
          : `Σχηματίζουμε την παράσταση: ${t0} － ${hoursDrop} · 2 ＋ ${rise} ＝ ${t0} － ${totalDrop} ＋ ${rise} ＝ ${ans} °C.`,
    };
  },
  // Πρόβλημα 2: Τραπεζικός λογαριασμός με πάγια και καταθέσεις
  (locale) => {
    const debt = randInt(40, 90);
    const fee = 5;
    const months = randInt(3, 6);
    const deposit = randInt(120, 180);
    const totalFees = months * fee;
    const ans = -debt - totalFees + deposit;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMBINED PROBLEM • FINANCES' : 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A bank account had an initial balance of －${debt} €. For ${months} months maintenance fees of 5 € were deducted monthly. Finally a salary of ${deposit} € was deposited. What is the new account balance in €?`
          : `Ένας τραπεζικός λογαριασμός είχε αρχικό υπόλοιπο －${debt} €. Για ${months} μήνες αφαιρούνταν αυτόματα πάγια έξοδα συντήρησης 5 € κάθε μήνα. Στο τέλος κατατέθηκε μισθός ${deposit} €. Ποιο είναι το νέο υπόλοιπο του λογαριασμού σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: －${debt} － ${months} · 5 ＋ ${deposit} ＝ －${debt} － ${totalFees} ＋ ${deposit} ＝ ${ans} €. New balance.`
          : `Παράσταση: －${debt} － ${months} · 5 ＋ ${deposit} ＝ －${debt} － ${totalFees} ＋ ${deposit} ＝ ${ans} €.`,
    };
  },
  // Πρόβλημα 3: Βαθμολογία διαγωνισμού με συντελεστές, ποινές και μπόνους
  (locale) => {
    const correct = randInt(12, 16);
    const wrong = randInt(3, 6);
    const bonus = 10;
    const partCorrect = correct * 4;
    const partWrong = wrong * 3;
    const ans = partCorrect - partWrong + bonus;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMBINED PROBLEM • SCORE' : 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In an academic contest each correct answer earns ＋4 points, each incorrect answer costs －3 points, and a participation bonus of ＋10 points is granted. If a student had ${correct} correct answers and ${wrong} incorrect answers, what was his final score?`
          : `Σε έναν μαθητικό διαγωνισμό κάθε σωστή απάντηση βαθμολογείται με ＋4 πόντους, κάθε λάθος απάντηση τιμωρείται με －3 πόντους, ενώ δίνεται μπόνους συμμετοχής ＋10 πόντων. Αν ένας μαθητής είχε ${correct} σωστές απαντήσεις και ${wrong} λάθη, ποια είναι η τελική βαθμολογία του;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${correct} · 4 － ${wrong} · 3 ＋ 10 ＝ ${partCorrect} － ${partWrong} ＋ 10 ＝ ${ans} points.`
          : `Παράσταση: ${correct} · 4 － ${wrong} · 3 ＋ 10 ＝ ${partCorrect} － ${partWrong} ＋ 10 ＝ ${ans} πόντοι.`,
    };
  },
  // Πρόβλημα 4: Καταδύσεις και αναδύσεις υποβρυχίου με ρυθμούς
  (locale) => {
    const depth0 = randInt(50, 100);
    const descentSpeed = 15;
    const descentMins = 3;
    const ascent = randInt(40, 70);
    const totalDescent = descentSpeed * descentMins;
    const ans = -depth0 - totalDescent + ascent;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMBINED PROBLEM • DEPTH' : 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A research submarine was at elevation －${depth0} m. It dove at a rate of 15 m/min for 3 minutes and then ascended ${ascent} m toward the surface. What is its current elevation in meters? (type with － sign)`
          : `Ένα ερευνητικό υποβρύχιο βρισκόταν σε βάθος ${depth0} m (υψόμετρο －${depth0} m). Καταδύθηκε με ρυθμό 15 m ανά λεπτό για 3 λεπτά και στη συνέχεια ανέβηκε κατά ${ascent} m προς την επιφάνεια. Σε ποιο υψόμετρο βρίσκεται τώρα σε μέτρα (ως ακέραιος με πρόσημο); (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: －${depth0} － 3 · 15 ＋ ${ascent} ＝ －${depth0} － 45 ＋ ${ascent} ＝ ${ans} m.`
          : `Παράσταση: －${depth0} － 3 · 15 ＋ ${ascent} ＝ －${depth0} － 45 ＋ ${ascent} ＝ ${ans} m.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Επανάληψη 2 (Κεφάλαια 5 - 10) | Α' Γυμνασίου",
    metaDescription: "20 απαιτητικές επαναληπτικές ασκήσεις και συνδυαστικά προβλήματα στους ακέραιους, τις δυνάμεις και την προτεραιότητα πράξεων.",
    backText: "Α' Γυμνασίου",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΝΙΚΗ ΕΠΑΝΑΛΗΨΗ",
    title: "Επαναληπτικό Διαγώνισμα (Κεφάλαια 5 – 10)",
    heroDesc: "Δοκίμασε τις δυνάμεις σου σε 20 επιλεγμένες ασκήσεις (3 από κάθε κεφάλαιο και 2 συνδυαστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    combinedBadge: "ΣΥΝΔΥΑΣΤΙΚΟ",
    placeholder: "Απάντηση...",
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
    metaTitle: "Review 2 (Chapters 5 - 10) | 7th Grade Mathematics",
    metaDescription: "20 comprehensive review exercises and multi-concept word problems on integers, powers and order of operations.",
    backText: "7th Grade",
    badge: "GRADE 7 • GENERAL REVIEW",
    title: "Comprehensive Exam (Chapters 5 – 10)",
    heroDesc: "Test your skills on 20 selected problems (3 from each chapter plus 2 multi-concept word problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    combinedBadge: "MULTI-CONCEPT",
    placeholder: "Answer...",
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
  },
};

export default function Epanalipsi2Ask() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 20 ασκήσεων: 3 από κάθε κεφάλαιο 5-10 (18) + 2 συνδυαστικά προβλήματα = 20 συνολικά
  const generateQuestions = () => {
    const qCh5 = shuffleArray(POOL_CH5).slice(0, 3);
    const qCh6 = shuffleArray(POOL_CH6).slice(0, 3);
    const qCh7 = shuffleArray(POOL_CH7).slice(0, 3);
    const qCh8 = shuffleArray(POOL_CH8).slice(0, 3);
    const qCh9 = shuffleArray(POOL_CH9).slice(0, 3);
    const qCh10 = shuffleArray(POOL_CH10).slice(0, 3);
    const qProblems = shuffleArray(POOL_WORD_PROBLEMS).slice(0, 2);

    const fullList = [
      ...qCh5,
      ...qCh6,
      ...qCh7,
      ...qCh8,
      ...qCh9,
      ...qCh10,
      ...qProblems,
    ].map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));

    setQuestions(fullList);
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
    clean = clean.replace(/[^0-9,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

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
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

      userAns = userAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');
      correctAns = correctAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && String(userAnswers[k]).trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 20) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-40 overflow-x-hidden box-border space-y-6 sm:space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              let cleanUser = userAns.trim().replace(/\s+/g, '').replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+').replace(/^\+/, '');
              let cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 19;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden ${
                    isWordProblem ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm shrink-0 ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.combinedBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
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
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder={t.placeholder}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-sm sm:text-base font-bold rounded-xl border transition-all outline-none box-border ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
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
                                className="break-words [overflow-wrap:anywhere] flex-1"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="shrink-0 text-amber-300 font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border min-w-0 overflow-hidden ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-xs sm:text-sm md:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 min-w-0">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-xs sm:text-sm md:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block max-w-full break-words [overflow-wrap:anywhere]">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1 break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60 break-words [overflow-wrap:anywhere]"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswersBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercisesBtn)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (20 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-black text-amber-400 font-mono whitespace-nowrap">
                {isSubmitted ? `${score} / 20` : `${answeredCount} / 20`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6 hidden xs:block">
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  {toCleanUppercase(t.successRateLabel)}
                </div>
                <div
                  className={`text-sm sm:text-lg md:text-xl font-black font-mono ${
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

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-2.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5 touch-manipulation"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-3.5 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtnShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-3.5 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation"
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