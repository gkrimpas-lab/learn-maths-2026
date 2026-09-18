import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
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
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 5: ΑΚΕΡΑΙΟΙ ΑΡΙΘΜΟΙ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH5 = [
  // 1. Εξίσωση με απόλυτη τιμή και άθροισμα λύσεων (Input)
  () => {
    const k = randInt(4, 15);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Αν |x| ＝ ${k}, ποιο είναι το άθροισμα όλων των δυνατών τιμών του x;`,
      correctAnswer: '0',
      solution: `Οι λύσεις της εξίσωσης είναι οι αντίθετοι αριθμοί x₁ ＝ ＋${k} και x₂ ＝ －${k}. Το άθροισμά τους είναι (＋${k}) ＋ (－${k}) ＝ 0.`,
    };
  },
  // 2. Πλήθος ακεραίων ανάμεσα σε δύο τιμές (Input)
  () => {
    const a = randInt(5, 12);
    const b = randInt(4, 10);
    const count = a + b - 1;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Πόσοι ακέραιοι αριθμοί x ικανοποιούν τη διπλή ανισότητα: －${a} ＜ x ＜ ＋${b};`,
      correctAnswer: count.toString(),
      solution: `Οι ακέραιοι είναι από το －${a - 1} έως το ＋${b - 1}. Πλήθος: (${b - 1}) － (－${a - 1}) ＋ 1 ＝ ${b - 1} ＋ ${a - 1} ＋ 1 ＝ ${count} ακέραιοι.`,
    };
  },
  // 3. Σύνθετη απόλυτη τιμή μέσα σε απόλυτη τιμή (Input)
  () => {
    const a = randInt(8, 16);
    const b = randInt(18, 30);
    const inside = Math.abs(-a) - b; // a - b < 0
    const ans = Math.abs(inside);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή: | |－${a}| － ${b} |`,
      correctAnswer: ans.toString(),
      solution: `|－${a}| ＝ ${a}. Επομένως μέσα στην εξωτερική απόλυτη τιμή έχουμε: ${a} － ${b} ＝ ${inside}. Άρα |${inside}| ＝ ${ans}.`,
    };
  },
  // 4. Ελάχιστος ακέραιος μεγαλύτερος από αρνητικό (Input)
  () => {
    const n = randInt(8, 25);
    const ans = -n + 1;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποιος είναι ο μικρότερος ακέραιος αριθμός που είναι αυστηρά μεγαλύτερος από το －${n};`,
      correctAnswer: ans.toString(),
      solution: `Στον άξονα των αριθμών, ο αμέσως επόμενος (μεγαλύτερος) ακέραιος στα δεξιά του －${n} είναι ο ${ans}.`,
    };
  },
  // 5. Απόσταση στον άξονα (Input)
  () => {
    const a = randInt(12, 35);
    const b = randInt(10, 25);
    const ans = a + b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΑΞΟΝΑ',
      question: `Πόσες μονάδες απέχουν στον άξονα τα σημεία Α(－${a}) και Β(＋${b});`,
      correctAnswer: ans.toString(),
      solution: `Η απόσταση είναι d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans} μονάδες.`,
    };
  },
  // 6. Αντίθετος αντίθετου αριθμού (MCQ)
  () => {
    const n = randInt(15, 60);
    const correct = `－${n}`;
    const candidates = [`＋${n}`, '0', `＋1`];
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 5 • ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο αντίθετος του αντίθετου του αριθμού －${n};`,
      correctAnswer: correct,
      solution: `Ο αντίθετος του －${n} είναι το ＋${n}. Ο αντίθετος του ＋${n} είναι πάλι ο －${n}: －[－(－${n})] ＝ －${n}.`,
    };
  },
  // 7. Σύγκριση απολύτων τιμών αρνητικών (MCQ)
  () => {
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
      topic: 'ΚΕΦ. 5 • ΑΠΟΛΥΤΗ ΤΙΜΗ & ΣΥΓΚΡΙΣΗ',
      question: `Αν και οι δύο αριθμοί είναι αρνητικοί με －${b} ＜ －${a}, ποια σχέση ισχύει για τις απόλυτες τιμές τους;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Ο μικρότερος αρνητικός αριθμός (－${b}) απέχει μεγαλύτερη απόσταση από το 0, άρα έχει μεγαλύτερη απόλυτη τιμή: |－${b}| ＞ |－${a}|.`,
    };
  },
  // 8. Αδύνατη εξίσωση απολύτου (MCQ)
  () => {
    const k = randInt(3, 15);
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 5 • ΕΞΙΣΩΣΕΙΣ ΜΕ ΑΠΟΛΥΤΟ',
      question: `Πόσες ακέραιες λύσεις έχει η εξίσωση |x ＋ 3| ＝ －${k};`,
      options: makeUniqueOptions('Καμία λύση (αδύνατη)', ['Μία λύση', 'Δύο λύσεις', 'Άπειρες λύσεις']),
      correctAnswer: 'Καμία λύση (αδύνατη)',
      solution: `Η απόλυτη τιμή οποιασδήποτε παράστασης εκφράζει απόσταση και είναι πάντοτε μη αρνητική (|A| ≥ 0). Δεν μπορεί ποτέ να ισούται με αρνητικό αριθμό.`,
    };
  },
  // 9. Άθροισμα όλων των ακεραίων σε συμμετρικό διάστημα (Input)
  () => {
    const k = randInt(20, 80);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 5 • ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα όλων των ακεραίων από το －${k} έως και το ＋${k}:`,
      correctAnswer: '0',
      solution: `Κάθε αρνητικός ακέραιος εξουδετερώνεται από τον αντίθετο θετικό του: (－${k}) ＋ (＋${k}) ＝ 0, ..., (－1) ＋ (＋1) ＝ 0. Με το 0 το συνολικό άθροισμα είναι 0.`,
    };
  },
  // 10. Μέγιστος αρνητικός ακέραιος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 5 • ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποιος είναι ο μεγαλύτερος αρνητικός ακέραιος αριθμός;`,
      options: makeUniqueOptions('－1', ['0', '－10', 'Δεν υπάρχει']),
      correctAnswer: '－1',
      solution: `Ο αριθμός －1 βρίσκεται πλησιέστερα στο 0 στον άξονα (έχει τη μικρότερη απόλυτη τιμή), επομένως είναι ο μεγαλύτερος από όλους τους αρνητικούς ακέραιους.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 6: ΠΡΟΣΘΕΣΗ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH6 = [
  // 1. Άθροισμα 4 όρων με αντίθετους (Input)
  () => {
    const opp = randInt(15, 45);
    const a = randInt(10, 25);
    const b = a + randInt(4, 15);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΠΡΟΣΘΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε το άθροισμα: (＋${opp}) ＋ (－${b}) ＋ (－${opp}) ＋ (＋${a})`,
      correctAnswer: ans.toString(),
      solution: `Οι όροι ＋${opp} και －${opp} είναι αντίθετοι και δίνουν άθροισμα 0. Απομένει: (－${b}) ＋ (＋${a}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },
  // 2. Εύρεση άγνωστου προσθετέου: (-a) + x = -b (Input)
  () => {
    const a = randInt(12, 25);
    const diff = randInt(5, 15);
    const target = -(a + diff);
    const x = -diff;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: (－${a}) ＋ x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ (${target}) － (－${a}) ＝ ${target} ＋ ${a} ＝ ${x}.`,
    };
  },
  // 3. Άθροισμα πολλών ομόσημων αρνητικών (Input)
  () => {
    const a = randInt(12, 20);
    const b = randInt(15, 30);
    const c = randInt(8, 18);
    const ans = -(a + b + c);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε: (－${a}) ＋ (－${b}) ＋ (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Προσθέτουμε τρεις αρνητικούς αριθμούς: κρατάμε το πρόσημο (－) και προσθέτουμε τις απόλυτες τιμές: －(${a} ＋ ${b} ＋ ${c}) ＝ ${ans}.`,
    };
  },
  // 4. Άθροισμα απολύτων τιμών και ετερόσημων (Input)
  () => {
    const a = randInt(14, 25);
    const b = randInt(6, 12);
    const ans = Math.abs(-a) + (-b);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΠΡΟΣΘΕΣΗ & ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε: |－${a}| ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution: `|－${a}| ＝ ${a}. Έπειτα: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },
  // 5. Πρόσημο αθροίσματος ετερόσημων (MCQ)
  () => {
    const a = randInt(40, 70);
    const b = a + randInt(5, 20);
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 6 • ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question: `Χωρίς να εκτελέσεις τον υπολογισμό, ποιο είναι το πρόσημο του αθροίσματος (＋${a}) ＋ (－${b});`,
      options: makeUniqueOptions('Αρνητικό (－)', ['Θετικό (＋)', 'Μηδέν', 'Δεν ορίζεται']),
      correctAnswer: 'Αρνητικό (－)',
      solution: `Επειδή |－${b}| ＝ ${b} ＞ ${a} ＝ |＋${a}|, υπερισχύει το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή, δηλαδή το αρνητικό (－).`,
    };
  },
  // 6. Άθροισμα διαδοχικών ακεραίων (Input)
  () => {
    const start = randInt(4, 8);
    // Από -start έως start + 2: τα πάντα ακυρώνονται εκτός από (start+1) + (start+2)
    const ans = (start + 1) + (start + 2);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΕΞΥΠΝΟΙ ΥΠΟΛΟΓΙΣΜΟΙ',
      question: `Υπολόγισε το άθροισμα όλων των ακεραίων από το －${start} έως και το ＋${start + 2}:`,
      correctAnswer: ans.toString(),
      solution: `Οι όροι από －${start} έως ＋${start} είναι αντίθετοι και έχουν άθροισμα 0. Απομένει: (＋${start + 1}) ＋ (＋${start + 2}) ＝ ${ans}.`,
    };
  },
  // 7. Πότε το άθροισμα δύο ακεραίων είναι μικρότερο και από τους δύο (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 6 • ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question: `Πότε το άθροισμα δύο ακεραίων αριθμών είναι μικρότερο και από τους δύο προσθετέους;`,
      options: makeUniqueOptions(
        'Όταν και οι δύο αριθμοί είναι αρνητικοί',
        ['Όταν ο ένας είναι θετικός και ο άλλος αρνητικός', 'Όταν και οι δύο αριθμοί είναι θετικοί', 'Ποτέ δεν μπορεί να συμβεί']
      ),
      correctAnswer: 'Όταν και οι δύο αριθμοί είναι αρνητικοί',
      solution: `Όταν προσθέτουμε δύο αρνητικούς αριθμούς (π.χ. (－3) ＋ (－5) ＝ －8), το άθροισμα είναι μικρότερο και από τους δύο προσθετέους (－8 ＜ －5 και －8 ＜ －3).`,
    };
  },
  // 8. Άθροισμα με απλοποιημένη γραφή (Input)
  () => {
    const a = randInt(25, 45);
    const b = randInt(12, 24);
    const c = randInt(15, 30);
    const ans = -a + b - c;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question: `Υπολόγισε: －${a} ＋ ${b} － ${c}`,
      correctAnswer: ans.toString(),
      solution: `Ομαδοποιούμε τους αρνητικούς: (－${a}) ＋ (－${c}) ＝ －${a + c}. Στη συνέχεια: (－${a + c}) ＋ (＋${b}) ＝ ${ans}.`,
    };
  },
  // 9. Άθροισμα με ουδέτερο στοιχείο (Input)
  () => {
    const n = randInt(35, 90);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ',
      question: `Υπολόγισε: 0 ＋ (－${n}) ＋ 0`,
      correctAnswer: `-${n}`,
      solution: `Το 0 είναι το ουδέτερο στοιχείο της πρόσθεσης: 0 ＋ (－${n}) ＋ 0 ＝ －${n}.`,
    };
  },
  // 10. Συμπλήρωση ισότητας πρόσθεσης (Input)
  () => {
    const a = randInt(8, 16);
    const b = randInt(18, 30);
    const ans = b + a;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 6 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: x ＋ (－${a}) ＝ ＋${b}`,
      correctAnswer: ans.toString(),
      solution: `x ＝ (＋${b}) － (－${a}) ＝ ${b} ＋ ${a} ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 7: ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH7 = [
  // 1. Αρνητικός μείον αρνητικός (Input)
  () => {
    const a = randInt(10, 25);
    const b = a + randInt(5, 18);
    const ans = -a + b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Μετατρέπουμε σε πρόσθεση του αντιθέτου: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },
  // 2. Αρνητικός μείον θετικός (Input)
  () => {
    const a = randInt(15, 30);
    const b = randInt(12, 28);
    const ans = -a - b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },
  // 3. Θετικός μείον αρνητικός (Input)
  () => {
    const a = randInt(14, 35);
    const b = randInt(15, 35);
    const ans = a + b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε: (＋${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution: `(＋${a}) ＋ (＋${b}) ＝ ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },
  // 4. Αφαίρεση από το 0 (Input)
  () => {
    const n = randInt(25, 75);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΟ ΜΗΔΕΝ',
      question: `Υπολόγισε: 0 － (－${n})`,
      correctAnswer: n.toString(),
      solution: `0 ＋ (＋${n}) ＝ ＋${n}.`,
    };
  },
  // 5. Διαφορά δύο ίσων αρνητικών (Input)
  () => {
    const n = randInt(40, 99);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${n}) － (－${n})`,
      correctAnswer: '0',
      solution: `Η διαφορά οποιουδήποτε αριθμού από τον εαυτό του ισούται με 0: (－${n}) ＋ (＋${n}) ＝ 0.`,
    };
  },
  // 6. Απαλοιφή παρενθέσεων με διπλά μείον (Input)
  () => {
    const a = randInt(10, 20);
    const b = randInt(15, 30);
    const c = randInt(5, 15);
    const ans = a + b - c;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ',
      question: `Υπολόγισε: ${a} － (－${b}) － (＋${c})`,
      correctAnswer: ans.toString(),
      solution: `Το －(－${b}) γίνεται ＋${b} και το －(＋${c}) γίνεται －${c}: ${a} ＋ ${b} － ${c} ＝ ${ans}.`,
    };
  },
  // 7. Εύρεση άγνωστου αφαιρετέου: a - x = b (Input)
  () => {
    const a = randInt(10, 25);
    const target = randInt(30, 50);
    const x = a - target;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: ${a} － x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ ${a} － ${target} ＝ ${x}.`,
    };
  },
  // 8. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 7 • ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question: `Ποια σχέση ισχύει πάντοτε μεταξύ των διαφορών (α － β) και (β － α);`,
      options: makeUniqueOptions(
        'Είναι αντίθετοι αριθμοί: (α － β) ＝ －(β － α)',
        ['Είναι ίσοι αριθμοί', 'Το γινόμενό τους είναι 0', 'Είναι πάντα θετικοί']
      ),
      correctAnswer: 'Είναι αντίθετοι αριθμοί: (α － β) ＝ －(β － α)',
      solution: `Στην αφαίρεση δεν ισχύει η αντιμεταθετική ιδιότητα. Η εναλλαγή των όρων δίνει τον αντίθετο αριθμό.`,
    };
  },
  // 9. Διαφορά απολύτων τιμών (Input)
  () => {
    const a = randInt(15, 30);
    const b = randInt(35, 55);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΦΑΙΡΕΣΗ',
      question: `Υπολόγισε: |－${a}| － |－${b}|`,
      correctAnswer: ans.toString(),
      solution: `|－${a}| ＝ ${a} και |－${b}| ＝ ${b}. Άρα ${a} － ${b} ＝ ${ans}.`,
    };
  },
  // 10. Σύνθετη αφαίρεση με αγκύλες (Input)
  () => {
    const a = randInt(10, 20);
    const b = randInt(5, 12);
    const c = randInt(14, 22);
    const inside = b - c; // negative
    const ans = a - inside;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 7 • ΑΓΚΥΛΕΣ & ΑΦΑΙΡΕΣΗ',
      question: `Υπολόγισε: ${a} － [ ${b} － ${c} ]`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην αγκύλη: ${b} － ${c} ＝ ${inside}. Έπειτα: ${a} － (${inside}) ＝ ${a} ＋ ${Math.abs(inside)} ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 8: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH8 = [
  // 1. Γινόμενο 3 αρνητικών (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 4);
    const c = randInt(2, 5);
    const ans = -(a * b * c);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (－${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Έχουμε 3 αρνητικούς παράγοντες (περιττό πλήθος), άρα το πρόσημο είναι αρνητικό: －(${a} · ${b} · ${c}) ＝ ${ans}.`,
    };
  },
  // 2. Γινόμενο 4 αρνητικών (Input)
  () => {
    const a = 2;
    const b = 3;
    const c = 2;
    const d = randInt(2, 4);
    const ans = a * b * c * d;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε: (－${a}) · (－${b}) · (－${c}) · (－${d})`,
      correctAnswer: ans.toString(),
      solution: `Έχουμε 4 αρνητικούς παράγοντες (άρτιο πλήθος), άρα το αποτέλεσμα είναι θετικό: ＋(${a} · ${b} · ${c} · ${d}) ＝ ＋${ans}.`,
    };
  },
  // 3. Επιμεριστική ιδιότητα με κοινό παράγοντα (Input)
  () => {
    const common = randInt(4, 9);
    const a = randInt(12, 25);
    const b = a - 10; // ώστε a - b = 10
    const ans = common * 10;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question: `Υπολόγισε έξυπνα: (－${common}) · (－${a}) ＋ (－${common}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Βγάζουμε κοινό παράγοντα το (－${common}): (－${common}) · [ (－${a}) ＋ (＋${b}) ] ＝ (－${common}) · (－10) ＝ ＋${ans}.`,
    };
  },
  // 4. Εύρεση άγνωστου παράγοντα με αρνητικά (Input)
  () => {
    const a = randInt(4, 9);
    const mult = randInt(5, 12);
    const target = a * mult;
    const x = -mult;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x αν: (－${a}) · x ＝ ＋${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ (＋${target}) ： (－${a}) ＝ ${x}.`,
    };
  },
  // 5. Πολλαπλασιασμός με μηδέν ανάμεσα σε πολλούς όρους (Input)
  () => {
    const a = randInt(12, 45);
    const b = randInt(5, 18);
    const c = randInt(8, 25);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (＋${b}) · 0 · (－${c})`,
      correctAnswer: '0',
      solution: `Αν ένας τουλάχιστον παράγοντας σε ένα γινόμενο ισούται με 0, το γινόμενο μηδενίζεται άμεσα.`,
    };
  },
  // 6. Πρόσημο γινομένου πολλών παραγόντων (MCQ)
  () => {
    const negCount = randInt(15, 35) * 2 + 1; // περιττό
    const posCount = randInt(10, 30);
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 8 • ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question: `Σε ένα γινόμενο ${negCount} αρνητικών και ${posCount} θετικών παραγόντων, ποιο είναι το τελικό πρόσημο;`,
      options: makeUniqueOptions('Αρνητικό (－)', ['Θετικό (＋)', 'Μηδέν', 'Δεν μπορούμε να γνωρίζουμε']),
      correctAnswer: 'Αρνητικό (－)',
      solution: `Το τελικό πρόσημο εξαρτάται μόνο από τους αρνητικούς παράγοντες. Επειδή το πλήθος τους (${negCount}) είναι περιττό, το γινόμενο είναι αρνητικό (－).`,
    };
  },
  // 7. Πολλαπλασιασμός με το -1 (Input)
  () => {
    const n = randInt(35, 95);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question: `Υπολόγισε: (－1) · (＋${n})`,
      correctAnswer: `-${n}`,
      solution: `Ο πολλαπλασιασμός ενός αριθμού με το －1 δίνει πάντοτε τον αντίθετό του: (－1) · (＋${n}) ＝ －${n}.`,
    };
  },
  // 8. Άθροισμα γινομένων με αντίθετα πρόσημα (Input)
  () => {
    const a = randInt(3, 6);
    const b = randInt(4, 8);
    // (-a)*b + a*b = 0
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question: `Υπολόγισε: (－${a}) · (${b}) ＋ (${a}) · (${b})`,
      correctAnswer: '0',
      solution: `－${a * b} ＋ ${a * b} ＝ 0.`,
    };
  },
  // 9. Διπλή εφαρμογή επιμεριστικής (Input)
  () => {
    const a = 5;
    const b = 18;
    const c = 8;
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 8 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question: `Υπολόγισε: (－5) · (－18) ＋ (－5) · (＋8)`,
      correctAnswer: ans.toString(),
      solution: `(－5) · [ (－18) ＋ 8 ] ＝ (－5) · (－10) ＝ ＋50.`,
    };
  },
  // 10. Ιδιότητα απορρόφησης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 8 • ΘΕΩΡΙΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question: `Αν το γινόμενο δύο ακεραίων α · β ＝ 0, ποιο είναι το βέβαιο συμπέρασμα;`,
      options: makeUniqueOptions(
        'Τουλάχιστον ένας από τους α ή β ισούται με 0',
        ['Και οι δύο αριθμοί είναι υποχρεωτικά 0', 'Κανένας από τους δύο δεν είναι 0', 'Οι αριθμοί είναι αντίθετοι']
      ),
      correctAnswer: 'Τουλάχιστον ένας από τους α ή β ισούται με 0',
      solution: `Για να είναι το γινόμενο δύο ακεραίων μηδέν, πρέπει απαραίτητα α ＝ 0 ή β ＝ 0 (ιδιότητα μηδενοδιαιρέτη).`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 9: ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH9 = [
  // 1. Δύναμη αρνητικού με άρτιο και περιττό εκθέτη σε άθροισμα (Input)
  () => {
    const a = 2;
    // (-2)^4 + (-2)^3 = 16 - 8 = 8
    const ans = 8;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε: (－2)<sup>4</sup> ＋ (－2)<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－2)<sup>4</sup> ＝ ＋16 και (－2)<sup>3</sup> ＝ －8. Άρα 16 ＋ (－8) ＝ ${ans}.`,
    };
  },
  // 2. Η διαφορά (-α)² και -α² (Input)
  () => {
    const a = randInt(3, 6);
    const ans = a * a - (-(a * a)); // a^2 - (-a^2) = 2*a^2
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΠΑΡΕΝΘΕΣΕΙΣ ΣΤΙΣ ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε τη διαφορά: (－${a})<sup>2</sup> － (－${a}<sup>2</sup>)`,
      correctAnswer: ans.toString(),
      solution: `(－${a})<sup>2</sup> ＝ ＋${a * a}, ενώ －${a}<sup>2</sup> ＝ －${a * a}. Επομένως: ${a * a} － (－${a * a}) ＝ ${a * a} ＋ ${a * a} ＝ ${ans}.`,
    };
  },
  // 3. Δύναμη σε δύναμη με αρνητική βάση (MCQ)
  () => {
    const base = randInt(2, 4);
    const correct = `(－${base})<sup>6</sup>`;
    const candidates = [
      `(－${base})<sup>5</sup>`,
      `－${base}<sup>6</sup>`,
      `(＋${base * base})<sup>3</sup>`,
    ];
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Πώς γράφεται ως μία δύναμη η παράσταση [ (－${base})<sup>2</sup> ]<sup>3</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Πολλαπλασιάζουμε τους εκθέτες διατηρώντας τη βάση: (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup> ＝ (－${base})<sup>2 · 3</sup> ＝ (－${base})<sup>6</sup>.`,
    };
  },
  // 4. Άθροισμα δυνάμεων του -1 με άρτιους και περιττούς (Input)
  () => {
    // (-1)^100 - (-1)^99 + (-1)^0 = 1 - (-1) + 1 = 1 + 1 + 1 = 3
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question: `Υπολόγισε: (－1)<sup>100</sup> － (－1)<sup>99</sup> ＋ (－1)<sup>0</sup>`,
      correctAnswer: '3',
      solution: `(－1)<sup>100</sup> ＝ 1, (－1)<sup>99</sup> ＝ －1, (－1)<sup>0</sup> ＝ 1. Επομένως: 1 － (－1) ＋ 1 ＝ 1 ＋ 1 ＋ 1 ＝ 3.`,
    };
  },
  // 5. Πηλίκο δυνάμεων με ίδια βάση (Input)
  () => {
    const base = 2;
    // (-2)^7 : (-2)^4 = (-2)^3 = -8
    const ans = -8;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Υπολόγισε την αριθμητική τιμή του πηλίκου: (－2)<sup>7</sup> ： (－2)<sup>4</sup>`,
      correctAnswer: ans.toString(),
      solution: `Αφαιρούμε τους εκθέτες: (－2)<sup>7 － 4</sup> ＝ (－2)<sup>3</sup> ＝ －8.`,
    };
  },
  // 6. Δύναμη γινομένου (Input)
  () => {
    // [ (-2) * (-5) ]^2 = 10^2 = 100
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Υπολόγισε: [ (－2) · (－5) ]<sup>2</sup>`,
      correctAnswer: '100',
      solution: `(－2) · (－5) ＝ ＋10. Στη συνέχεια: 10<sup>2</sup> ＝ 100.`,
    };
  },
  // 7. Τρίτη δύναμη αρνητικού αριθμού (Input)
  () => {
    const a = 3;
    const ans = -27;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε: (－3)<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－3) · (－3) · (－3) ＝ 9 · (－3) ＝ －27.`,
    };
  },
  // 8. Σύγκριση αρνητικών δυνάμεων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 9 • ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των (－2)<sup>3</sup> και (－3)<sup>2</sup>;`,
      options: makeUniqueOptions(
        '(－2)³ ＜ (－3)²',
        ['(－2)³ ＞ (－3)²', '(－2)³ ＝ (－3)²', 'Δεν συγκρίνονται']
      ),
      correctAnswer: '(－2)³ ＜ (－3)²',
      solution: `(－2)<sup>3</sup> ＝ －8 (αρνητικό) και (－3)<sup>2</sup> ＝ ＋9 (θετικό). Κάθε αρνητικός είναι μικρότερος από κάθε θετικό.`,
    };
  },
  // 9. Δύναμη με βάση το 0 (Input)
  () => {
    const exp = randInt(5, 20);
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΔΥΝΑΜΕΙΣ ΤΟΥ 0',
      question: `Υπολόγισε: 0<sup>${exp}</sup>`,
      correctAnswer: '0',
      solution: `Το 0 υψωμένο σε οποιονδήποτε θετικό εκθέτη ισούται με 0.`,
    };
  },
  // 10. Σύνθετη παράσταση με δυνάμεις (Input)
  () => {
    // 5^2 - (-3)^2 = 25 - 9 = 16
    const ans = 16;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 9 • ΠΡΑΞΕΙΣ ΜΕ ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε: 5<sup>2</sup> － (－3)<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `5<sup>2</sup> ＝ 25 και (－3)<sup>2</sup> ＝ ＋9. Επομένως: 25 － 9 ＝ 16.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΚΕΦΑΛΑΙΟΥ 10: ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ (10 ΑΣΚΗΣΕΙΣ)
// ========================================================
const POOL_CH10 = [
  // 1. Προτεραιότητα με αγκύλη και δύναμη (Input)
  () => {
    // 4 * [ 15 - 2 * 3^2 ] = 4 * [ 15 - 18 ] = 4 * (-3) = -12
    const ans = -12;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: 4 · [ 15 － 2 · 3<sup>2</sup> ]`,
      correctAnswer: ans.toString(),
      solution: `1) Δύναμη: 3<sup>2</sup> ＝ 9. 2) Πολλαπλασιασμός: 2 · 9 ＝ 18. 3) Αγκύλη: 15 － 18 ＝ －3. 4) Τελικό: 4 · (－3) ＝ －12.`,
    };
  },
  // 2. Διαδοχική διαίρεση και πολλαπλασιασμός με αρνητικά (Input)
  () => {
    // 36 : (-4) * (-2) = (-9) * (-2) = 18
    const ans = 18;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question: `Υπολόγισε: 36 ： (－4) · (－2)`,
      correctAnswer: ans.toString(),
      solution: `Εκτελούμε από αριστερά προς τα δεξιά: 36 ： (－4) ＝ －9, και έπειτα (－9) · (－2) ＝ ＋18.`,
    };
  },
  // 3. Δύο δυνάμεις και γινόμενο (Input)
  () => {
    // (-2)^3 * 3 - (-4)^2 = (-8)*3 - 16 = -24 - 16 = -40
    const ans = -40;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: (－2)<sup>3</sup> · 3 － (－4)<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－2)<sup>3</sup> ＝ －8 και (－4)<sup>2</sup> ＝ 16. Έπειτα: (－8) · 3 ＝ －24. Τέλος: －24 － 16 ＝ －40.`,
    };
  },
  // 4. Σύνθετη με εσωτερική παρένθεση: 50 - 2 * (3 + 4 * 2) (Input)
  () => {
    // 50 - 2 * (3 + 8) = 50 - 2 * 11 = 50 - 22 = 28
    const ans = 28;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΑΡΕΝΘΕΣΕΙΣ',
      question: `Υπολόγισε: 50 － 2 · (3 ＋ 4 · 2)`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην παρένθεση: 4 · 2 ＝ 8, άρα 3 ＋ 8 ＝ 11. Μετά: 2 · 11 ＝ 22. Τέλος: 50 － 22 ＝ 28.`,
    };
  },
  // 5. Διαίρεση με άθροισμα σε παρένθεση (Input)
  () => {
    // (18 - 34) : (-4) = (-16) : (-4) = 4
    const ans = 4;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: (18 － 34) ： (－4)`,
      correctAnswer: ans.toString(),
      solution: `Πρώτα η παρένθεση: 18 － 34 ＝ －16. Έπειτα η διαίρεση: (－16) ： (－4) ＝ ＋4.`,
    };
  },
  // 6. Πολλαπλασιασμοί και προσθέσεις στη σειρά (Input)
  () => {
    // (-3)*(-5) + (-2)*7 - (-4) = 15 - 14 + 4 = 5
    const ans = 5;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: (－3) · (－5) ＋ (－2) · 7 － (－4)`,
      correctAnswer: ans.toString(),
      solution: `(－3) · (－5) ＝ 15 και (－2) · 7 ＝ －14. Άρα: 15 ＋ (－14) ＋ 4 ＝ 1 ＋ 4 ＝ 5.`,
    };
  },
  // 7. Προτεραιότητα με δύναμη έξω από παρένθεση (Input)
  () => {
    // [ ( -2 + 5 ) - 7 ]^2 = [ 3 - 7 ]^2 = (-4)^2 = 16
    const ans = 16;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΑΓΚΥΛΕΣ & ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε: [ (－2 ＋ 5) － 7 ]<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `Εσωτερική παρένθεση: －2 ＋ 5 ＝ 3. Αγκύλη: 3 － 7 ＝ －4. Δύναμη: (－4)<sup>2</sup> ＝ 16.`,
    };
  },
  // 8. Συνηθισμένη παγίδα προτεραιότητας (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΕΦ. 10 • ΠΑΓΙΔΕΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question: `Ποιο είναι το αποτέλεσμα της παράστασης 10 － 3 · 2 ＋ 4;`,
      options: makeUniqueOptions('8', ['18', '2', '14']),
      correctAnswer: '8',
      solution: `Προηγείται ο πολλαπλασιασμός: 3 · 2 ＝ 6. Έπειτα από αριστερά προς τα δεξιά: 10 － 6 ＝ 4 και 4 ＋ 4 ＝ 8.`,
    };
  },
  // 9. Παράσταση με μηδενικό εκθέτη (Input)
  () => {
    // 7 + 3 * (-5)^0 - 2 * 4 = 7 + 3 * 1 - 8 = 7 + 3 - 8 = 2
    const ans = 2;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: 7 ＋ 3 · (－5)<sup>0</sup> － 2 · 4`,
      correctAnswer: ans.toString(),
      solution: `(－5)<sup>0</sup> ＝ 1. Πολλαπλασιασμοί: 3 · 1 ＝ 3 και 2 · 4 ＝ 8. Τέλος: 7 ＋ 3 － 8 ＝ 2.`,
    };
  },
  // 10. Σύνθετη με αρνητικά πρόσημα έξω από αγκύλη (Input)
  () => {
    // - [ -4 + 2 * (-3) ] = - [ -4 - 6 ] = - [ -10 ] = 10
    const ans = 10;
    return {
      type: 'input',
      topic: 'ΚΕΦ. 10 • ΣΥΝΘΕΤΕΣ ΑΓΚΥΛΕΣ',
      question: `Υπολόγισε: －[ －4 ＋ 2 · (－3) ]`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην αγκύλη: 2 · (－3) ＝ －6, άρα －4 ＋ (－6) ＝ －10. Με το μείον απ' έξω: －(－10) ＝ ＋10.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ ΣΥΝΔΥΑΣΤΙΚΩΝ ΠΡΟΒΛΗΜΑΤΩΝ (4 ΠΡΟΒΛΗΜΑΤΑ)
// ========================================================
const POOL_WORD_PROBLEMS = [
  // Πρόβλημα 1: Θερμοκρασιακές μεταβολές με ρυθμό και αρχική τιμή
  () => {
    const t0 = randInt(2, 6);
    const dropRate = 2;
    const hoursDrop = randInt(3, 5);
    const rise = randInt(4, 8);
    const ans = t0 - dropRate * hoursDrop + rise;
    return {
      type: 'input',
      topic: 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Σε έναν ορεινό μετεωρολογικό σταθμό η θερμοκρασία το απόγευμα ήταν ＋${t0} °C. Τη νύχτα έπεφτε σταθερά κατά 2 °C κάθε ώρα για ${hoursDrop} συνεχόμενες ώρες, ενώ το πρωί ανέβηκε κατά ${rise} °C. Ποια είναι η τελική θερμοκρασία σε °C;`,
      correctAnswer: ans.toString(),
      solution: `Σχηματίζουμε την παράσταση: ${t0} － ${hoursDrop} · 2 ＋ ${rise} ＝ ${t0} － ${hoursDrop * 2} ＋ ${rise} ＝ ${ans} °C.`,
    };
  },
  // Πρόβλημα 2: Τραπεζικός λογαριασμός με πάγια και καταθέσεις
  () => {
    const debt = randInt(40, 90); // -debt
    const fee = 5;
    const months = randInt(3, 6);
    const deposit = randInt(120, 180);
    const ans = -debt - months * fee + deposit;
    return {
      type: 'input',
      topic: 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας τραπεζικός λογαριασμός είχε αρχικό υπόλοιπο －${debt} €. Για ${months} μήνες αφαιρούνταν αυτόματα πάγια έξοδα συντήρησης 5 € κάθε μήνα. Στο τέλος κατατέθηκε μισθός ${deposit} €. Ποιο είναι το νέο υπόλοιπο του λογαριασμού σε €;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: －${debt} － ${months} · 5 ＋ ${deposit} ＝ －${debt} － ${months * 5} ＋ ${deposit} ＝ ${ans} €.`,
    };
  },
  // Πρόβλημα 3: Βαθμολογία διαγωνισμού με συντελεστές, ποινές και μπόνους
  () => {
    const correct = randInt(12, 16);
    const wrong = randInt(3, 6);
    const bonus = 10;
    const ans = correct * 4 - wrong * 3 + bonus;
    return {
      type: 'input',
      topic: 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε έναν μαθητικό διαγωνισμό κάθε σωστή απάντηση βαθμολογείται με ＋4 πόντους, κάθε λάθος απάντηση τιμωρείται με －3 πόντους, ενώ δίνεται μπόνους συμμετοχής ＋10 πόντων. Αν ένας μαθητής είχε ${correct} σωστές απαντήσεις και ${wrong} λάθη, ποια είναι η τελική βαθμολογία του;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${correct} · 4 － ${wrong} · 3 ＋ 10 ＝ ${correct * 4} － ${wrong * 3} ＋ 10 ＝ ${ans} πόντοι.`,
    };
  },
  // Πρόβλημα 4: Καταδύσεις και αναδύσεις υποβρυχίου με ρυθμούς
  () => {
    const depth0 = randInt(50, 100);
    const descentSpeed = 15;
    const descentMins = 3;
    const ascent = randInt(40, 70);
    const ans = -depth0 - descentSpeed * descentMins + ascent;
    return {
      type: 'input',
      topic: 'ΣΥΝΔΥΑΣΤΙΚΟ ΠΡΟΒΛΗΜΑ • ΒΑΘΟΣ',
      question: `Ένα ερευνητικό υποβρύχιο βρισκόταν σε βάθος ${depth0} m (υψόμετρο －${depth0} m). Καταδύθηκε με ρυθμό 15 m ανά λεπτό για 3 λεπτά και στη συνέχεια ανέβηκε κατά ${ascent} m προς την επιφάνεια. Σε ποιο υψόμετρο βρίσκεται τώρα σε μέτρα (ως ακέραιος με πρόσημο);`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: －${depth0} － 3 · 15 ＋ ${ascent} ＝ －${depth0} － 45 ＋ ${ascent} ＝ ${ans} m.`,
    };
  },
];

export default function Epanalipsi2Ask() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 20 ασκήσεων: 3 από κάθε κεφάλαιο (18) + 2 συνδυαστικά προβλήματα = 20 συνολικά
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
      ...gen(),
    }));

    setQuestions(fullList);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

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
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

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
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 20) * 100);

  return (
    <Layout
      title="Επανάληψη 2 (Κεφάλαια 5 - 10) | Α' Γυμνασίου"
      description="20 απαιτητικές επαναληπτικές ασκήσεις και συνδυαστικά προβλήματα στους ακέραιους, τις δυνάμεις και την προτεραιότητα πράξεων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΝΙΚΗ ΕΠΑΝΑΛΗΨΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Επαναληπτικό Διαγώνισμα (Κεφάλαια 5 – 10)
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Δοκίμασε τις δυνάμεις σου σε 20 επιλεγμένες ασκήσεις (3 από κάθε κεφάλαιο και 2 συνδυαστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 19;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            ΣΥΝΔΥΑΣΤΙΚΟ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
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
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <span className="text-emerald-700 font-black ml-1" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60"
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
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (20 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 20` : `${answeredCount} / 20`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
