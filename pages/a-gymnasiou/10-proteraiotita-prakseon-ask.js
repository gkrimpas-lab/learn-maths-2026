import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός πριν την πρόσθεση: a + b * c (Input)
  () => {
    const a = randInt(4, 15);
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const ans = a + b * c;
    return {
      type: 'input',
      topic: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question: `Υπολόγισε την τιμή: ${a} ＋ ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Προηγείται ο πολλαπλασιασμός: ${b} · ${c} ＝ ${b * c}. Έπειτα προσθέτουμε: ${a} ＋ ${b * c} ＝ ${ans}.`,
    };
  },

  // 2. Πολλαπλασιασμός με αρνητικό: a - b * (-c) (Input)
  () => {
    const a = randInt(5, 15);
    const b = randInt(2, 5);
    const c = randInt(3, 6);
    const ans = a - b * (-c); // a + b*c
    return {
      type: 'input',
      topic: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question: `Υπολόγισε: ${a} － ${b} · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Προηγείται ο πολλαπλασιασμός: ${b} · (－${c}) ＝ －${b * c}. Στη συνέχεια: ${a} － (－${b * c}) ＝ ${a} ＋ ${b * c} ＝ ${ans}.`,
    };
  },

  // 3. Δύναμη πριν τον πολλαπλασιασμό: a + b * c^2 (Input)
  () => {
    const a = randInt(5, 12);
    const b = randInt(2, 4);
    const c = randInt(2, 3);
    const ans = a + b * Math.pow(c, 2);
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε: ${a} ＋ ${b} · ${c}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `Προηγείται η δύναμη: ${c}<sup>2</sup> ＝ ${c * c}. Μετά ο πολλαπλασιασμός: ${b} · ${c * c} ＝ ${b * c * c}. Τέλος: ${a} ＋ ${b * c * c} ＝ ${ans}.`,
    };
  },

  // 4. Αρνητική βάση σε δύναμη: a * (-b)^2 (Input)
  () => {
    const a = randInt(3, 7);
    const b = randInt(2, 4);
    const ans = a * Math.pow(b, 2);
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε: ${a} · (－${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－${b})<sup>2</sup> ＝ ＋${b * b} (άρτιος εκθέτης). Έπειτα: ${a} · ${b * b} ＝ ${ans}.`,
    };
  },

  // 5. Διαίρεση και πολλαπλασιασμός στη σειρά (MCQ)
  () => {
    const m = randInt(2, 4);
    const d = randInt(2, 4);
    const a = m * d * randInt(2, 4);
    const mult = randInt(2, 3);
    const ans = (a / d) * mult;
    const wrong = a / (d * mult);
    return {
      type: 'mcq',
      topic: 'ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question: `Ποιο είναι το αποτέλεσμα της παράστασης ${a} ： ${d} · ${mult};`,
      options: makeUniqueOptions(ans.toString(), [
        wrong.toString(),
        (ans + 2).toString(),
        (ans - 2).toString(),
      ]),
      correctAnswer: ans.toString(),
      solution: `Η διαίρεση και ο πολλαπλασιασμός έχουν την ίδια προτεραιότητα και εκτελούνται αυστηρά από αριστερά προς τα δεξιά: ${a} ： ${d} ＝ ${a / d}, και έπειτα ${a / d} · ${mult} ＝ ${ans}.`,
    };
  },

  // 6. Παρένθεση με πρόσθεση πριν τον πολλαπλασιασμό (Input)
  () => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const c = randInt(2, 6);
    const ans = (a + b) * c;
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question: `Υπολόγισε: (${a} ＋ ${b}) · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Η παρένθεση έχει απόλυτη προτεραιότητα: ${a} ＋ ${b} ＝ ${a + b}. Έπειτα: ${a + b} · ${c} ＝ ${ans}.`,
    };
  },

  // 7. Παρένθεση με αφαίρεση και δύναμη απ' έξω (Input)
  () => {
    const a = randInt(2, 5);
    const b = a + randInt(2, 4);
    const diff = a - b; // αρνητικό
    const ans = Math.pow(diff, 2);
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ & ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε: (${a} － ${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην παρένθεση: ${a} － ${b} ＝ ${diff}. Στη συνέχεια: (${diff})<sup>2</sup> ＝ ＋${ans}.`,
    };
  },

  // 8. Σύνθετη με αγκύλες και παρενθέσεις (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 4);
    const c = randInt(1, 3);
    const insideParen = b - c;
    const insideBracket = 10 - insideParen;
    const ans = a * insideBracket;
    return {
      type: 'input',
      topic: 'ΑΓΚΥΛΕΣ & ΠΑΡΕΝΘΕΣΕΙΣ',
      question: `Υπολόγισε: ${a} · [ 10 － (${b} － ${c}) ]`,
      correctAnswer: ans.toString(),
      solution: `1) Εσωτερική παρένθεση: ${b} － ${c} ＝ ${insideParen}. 2) Αγκύλη: 10 － ${insideParen} ＝ ${insideBracket}. 3) Πολλαπλασιασμός: ${a} · ${insideBracket} ＝ ${ans}.`,
    };
  },

  // 9. Δύναμη του 0 στην προτεραιότητα (Input)
  () => {
    const a = randInt(10, 25);
    const b = randInt(3, 8);
    const ans = a + b * 1;
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε: ${a} ＋ ${b} · (－7)<sup>0</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－7)<sup>0</sup> ＝ 1. Έπειτα: ${b} · 1 ＝ ${b}. Τέλος: ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 10. Δύο γινόμενα που αφαιρούνται (Input)
  () => {
    const a = randInt(3, 6);
    const b = randInt(4, 7);
    const c = randInt(2, 5);
    const d = randInt(2, 4);
    const ans = a * b - c * d;
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ',
      question: `Υπολόγισε: ${a} · ${b} － ${c} · ${d}`,
      correctAnswer: ans.toString(),
      solution: `Εκτελούμε πρώτα τους δύο πολλαπλασιασμούς: ${a} · ${b} ＝ ${a * b} και ${c} · ${d} ＝ ${c * d}. Στο τέλος αφαιρούμε: ${a * b} － ${c * d} ＝ ${ans}.`,
    };
  },

  // 11. Πρώτο βήμα στην ιεραρχία (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question: `Ποια πράξη εκτελείται πάντοτε πρώτη σε μια αριθμητική παράσταση;`,
      options: makeUniqueOptions(
        'Οι πράξεις μέσα στις παρενθέσεις',
        ['Οι πολλαπλασιασμοί', 'Οι δυνάμεις', 'Οι προσθέσεις']
      ),
      correctAnswer: 'Οι πράξεις μέσα στις παρενθέσεις',
      solution: `Οι παρενθέσεις (και οι αγκύλες) υπερισχύουν όλων των πράξεων και εκτελούνται πάντα πρώτες, από τις εσωτερικές προς τις εξωτερικές.`,
    };
  },

  // 12. Προτεραιότητα δύναμης έναντι πολλαπλασιασμού (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question: `Στην παράσταση 4 · 3<sup>2</sup>, ποιος είναι ο σωστός τρόπος υπολογισμού;`,
      options: makeUniqueOptions(
        'Υπολογίζουμε πρώτα το 3² ＝ 9 και μετά 4 · 9 ＝ 36',
        [
          'Πολλαπλασιάζουμε πρώτα 4 · 3 ＝ 12 και μετά 12² ＝ 144',
          'Εκτελούμε ταυτόχρονα τις πράξεις',
          'Το αποτέλεσμα είναι 24',
        ]
      ),
      correctAnswer: 'Υπολογίζουμε πρώτα το 3² ＝ 9 και μετά 4 · 9 ＝ 36',
      solution: `Η δύναμη προηγείται του πολλαπλασιασμού: 3² ＝ 9 και στη συνέχεια 4 · 9 ＝ 36.`,
    };
  },

  // 13. Πρόσθεση και αφαίρεση στη σειρά (Input)
  () => {
    const a = randInt(15, 30);
    const b = randInt(5, 12);
    const c = randInt(4, 10);
    const ans = a - b + c;
    return {
      type: 'input',
      topic: 'ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question: `Υπολόγισε: ${a} － ${b} ＋ ${c}`,
      correctAnswer: ans.toString(),
      solution: `Πρόσθεση και αφαίρεση έχουν την ίδια προτεραιότητα και γίνονται από αριστερά προς τα δεξιά: ${a} － ${b} ＝ ${a - b}, και ${a - b} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 14. Παράσταση με αρνητικό εκτός δύναμης: -a^2 + b (Input)
  () => {
    const a = randInt(3, 6);
    const b = randInt(10, 25);
    const ans = -(a * a) + b;
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question: `Υπολόγισε: －${a}<sup>2</sup> ＋ ${b}`,
      correctAnswer: ans.toString(),
      solution: `Χωρίς παρένθεση: －${a}<sup>2</sup> ＝ －${a * a}. Έπειτα: －${a * a} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 15. Παράσταση με κλάσμα/διαίρεση και παρενθέσεις (Input)
  () => {
    const sum = randInt(2, 5) * 4;
    const a = randInt(3, sum - 2);
    const b = sum - a;
    const ans = sum / 4;
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ & ΔΙΑΙΡΕΣΗ',
      question: `Υπολόγισε: (${a} ＋ ${b}) ： 4`,
      correctAnswer: ans.toString(),
      solution: `Πρώτα η παρένθεση: ${a} ＋ ${b} ＝ ${sum}. Μετά η διαίρεση: ${sum} ： 4 ＝ ${ans}.`,
    };
  },

  // 16. Τριπλή πράξη με δυνάμεις (Input)
  () => {
    // 2^3 + 3^2 - 4^1 = 8 + 9 - 4 = 13
    const ans = 8 + 9 - 4;
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε: 2<sup>3</sup> ＋ 3<sup>2</sup> － 4<sup>1</sup>`,
      correctAnswer: ans.toString(),
      solution: `2<sup>3</sup> ＝ 8, 3<sup>2</sup> ＝ 9, 4<sup>1</sup> ＝ 4. Τελικά: 8 ＋ 9 － 4 ＝ ${ans}.`,
    };
  },

  // 17. Πολλαπλασιασμός με μηδέν στην παράσταση (Input)
  () => {
    const a = randInt(12, 35);
    const b = randInt(4, 9);
    const c = randInt(5, 12);
    const ans = a;
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε: ${a} ＋ ${b} · 0 · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Ο πολλαπλασιασμός περιέχει το 0, άρα ${b} · 0 · (－${c}) ＝ 0. Επομένως ${a} ＋ 0 ＝ ${ans}.`,
    };
  },

  // 18. Σύνθετη με αρνητικά: (-3) * (-4) - 2 * (-5) (Input)
  () => {
    const p1 = (-3) * (-4); // +12
    const p2 = 2 * (-5); // -10
    const ans = p1 - p2; // 12 - (-10) = 22
    return {
      type: 'input',
      topic: 'ΠΡΟΣΗΜΑ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: `Υπολόγισε: (－3) · (－4) － 2 · (－5)`,
      correctAnswer: ans.toString(),
      solution: `(－3) · (－4) ＝ ＋12 και 2 · (－5) ＝ －10. Άρα 12 － (－10) ＝ 12 ＋ 10 ＝ ${ans}.`,
    };
  },

  // 19. Προτεραιότητα μέσα σε αγκύλη με δύναμη (Input)
  () => {
    // [ 20 - 2 * 3^2 ] = [ 20 - 2 * 9 ] = [ 20 - 18 ] = 2
    const ans = 2;
    return {
      type: 'input',
      topic: 'ΑΓΚΥΛΕΣ & ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε την τιμή μέσα στην αγκύλη: [ 20 － 2 · 3<sup>2</sup> ]`,
      correctAnswer: ans.toString(),
      solution: `3<sup>2</sup> ＝ 9, μετά 2 · 9 ＝ 18. Τελικά: 20 － 18 ＝ ${ans}.`,
    };
  },

  // 20. Επιμεριστική έναντι προτεραιότητας (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question: `Στην παράσταση 5 · (6 ＋ 4), ποιος υπολογισμός δίνει άμεσα το σωστό αποτέλεσμα;`,
      options: makeUniqueOptions(
        'Εκτελούμε πρώτα την παρένθεση 6 ＋ 4 ＝ 10 και μετά 5 · 10 ＝ 50',
        [
          'Πολλαπλασιάζουμε μόνο το 5 · 6 ＝ 30 και προσθέτουμε 4 (αποτέλεσμα 34)',
          'Προσθέτουμε πρώτα 5 ＋ 6 ＝ 11 και μετά πολλαπλασιάζουμε με το 4 (αποτέλεσμα 44)',
          'Το αποτέλεσμα είναι 24',
        ]
      ),
      correctAnswer: 'Εκτελούμε πρώτα την παρένθεση 6 ＋ 4 ＝ 10 και μετά 5 · 10 ＝ 50',
      solution: `Σύμφωνα με την προτεραιότητα, λύνουμε πρώτα την πράξη μέσα στην παρένθεση (6 ＋ 4 ＝ 10) και έπειτα πολλαπλασιάζουμε με το 5: 5 · 10 ＝ 50.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΣΥΝΘΕΤΩΝ ΑΡΙΘΜΗΤΙΚΩΝ ΠΑΡΑΣΤΑΣΕΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αγορές στο σούπερ μάρκετ με έκπτωση
  () => {
    const qtyA = randInt(2, 4);
    const priceA = randInt(3, 6);
    const qtyB = randInt(2, 5);
    const priceB = randInt(2, 4);
    const discount = randInt(2, 5);
    const ans = qtyA * priceA + qtyB * priceB - discount;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Η Ελένη αγόρασε ${qtyA} κουτιά γάλα προς ${priceA} € το καθένα και ${qtyB} πακέτα μπισκότα προς ${priceB} € το καθένα. Στο ταμείο χρησιμοποίησε εκπτωτικό κουπόνι αξίας ${discount} €. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: ans.toString(),
      solution: `Σχηματίζουμε την αριθμητική παράσταση: ${qtyA} · ${priceA} ＋ ${qtyB} · ${priceB} － ${discount} ＝ ${qtyA * priceA} ＋ ${qtyB * priceB} － ${discount} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 2: Εισιτήρια κινηματογράφου για ενήλικες και παιδιά
  () => {
    const adults = randInt(2, 3);
    const adultPrice = 8;
    const kids = randInt(2, 4);
    const kidPrice = 5;
    const comboPopcorn = randInt(6, 10);
    const ans = adults * adultPrice + kids * kidPrice + comboPopcorn;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια παρέα αγόρασε ${adults} εισιτήρια ενηλίκων προς 8 € το καθένα, ${kids} παιδικά εισιτήρια προς 5 € το καθένα και ένα οικογενειακό πακέτο ποπ κορν αξίας ${comboPopcorn} €. Ποιο ήταν το συνολικό κόστος της εξόδου σε €;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${adults} · 8 ＋ ${kids} · 5 ＋ ${comboPopcorn} ＝ ${adults * 8} ＋ ${kids * 5} ＋ ${comboPopcorn} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 3: Βαθμολογία διαγωνισμού με σωστές και λάθος απαντήσεις
  () => {
    const correctAnswers = randInt(12, 18);
    const pointsPerCorrect = 4;
    const wrongAnswers = randInt(2, 5);
    const penaltyPerWrong = 2;
    const ans = correctAnswers * pointsPerCorrect - wrongAnswers * penaltyPerWrong;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε έναν μαθηματικό διαγωνισμό κάθε σωστή απάντηση δίνει 4 βαθμούς, ενώ κάθε λάθος απάντηση αφαιρεί 2 βαθμούς. Ένας μαθητής είχε ${correctAnswers} σωστές απαντήσεις και ${wrongAnswers} λάθη. Ποια ήταν η τελική του βαθμολογία;`,
      correctAnswer: ans.toString(),
      solution: `Αριθμητική παράσταση: ${correctAnswers} · 4 － ${wrongAnswers} · 2 ＝ ${correctAnswers * 4} － ${wrongAnswers * 2} ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 4: Ρέστα από χαρτονόμισμα
  () => {
    const bill = 50;
    const notebooks = randInt(3, 5);
    const notebookPrice = randInt(2, 4);
    const pens = randInt(2, 4);
    const penPrice = 2;
    const spent = notebooks * notebookPrice + pens * penPrice;
    const ans = bill - spent;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ο Νίκος πλήρωσε με χαρτονόμισμα των 50 € για να αγοράσει ${notebooks} τετράδια προς ${notebookPrice} € το καθένα και ${pens} στυλό προς 2 € το καθένα. Πόσα ευρώ πήρε ρέστα;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση με παρένθεση: 50 － (${notebooks} · ${notebookPrice} ＋ ${pens} · 2) ＝ 50 － (${notebooks * notebookPrice} ＋ ${pens * 2}) ＝ 50 － ${spent} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Διανομή κιβωτίων με χυμούς
  () => {
    const boxes = randInt(4, 7);
    const packsPerBox = 6;
    const bottlesPerPack = 4;
    const broken = randInt(3, 8);
    const ans = boxes * packsPerBox * bottlesPerPack - broken;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ',
      question: `Ένα παντοπωλείο παρέλαβε ${boxes} κιβώτια με χυμούς. Κάθε κιβώτιο περιέχει 6 συσκευασίες και κάθε συσκευασία 4 μπουκάλια. Κατά τη μεταφορά έσπασαν ${broken} μπουκάλια. Πόσα ακέραια μπουκάλια έμειναν για πώληση;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${boxes} · 6 · 4 － ${broken} ＝ ${boxes * 24} － ${broken} ＝ ${ans} μπουκάλια.`,
    };
  },

  // Πρόβλημα 6: Ομαδικό ταμείο και μοίρασμα εξόδων
  () => {
    const friends = 4;
    const pizzas = 3;
    const pizzaPrice = 9;
    const drinks = 4;
    const drinkPrice = 2;
    const total = pizzas * pizzaPrice + drinks * drinkPrice;
    const ans = total / friends;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΜΕΡΙΣΜΟΣ',
      question: `Τέσσερις φίλοι παρήγγειλαν ${pizzas} πίτσες προς 9 € τη μία και ${drinks} αναψυκτικά προς 2 € το ένα. Αν μοιράστηκαν το συνολικό ποσό εξίσου, πόσα ευρώ πλήρωσε ο καθένας;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση με παρένθεση και διαίρεση: (${pizzas} · 9 ＋ ${drinks} · 2) ： 4 ＝ (${pizzas * 9} ＋ ${drinks * 2}) ： 4 ＝ ${total} ： 4 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 7: Εισφορές και έξοδα σχολικής εκδρομής
  () => {
    const students = randInt(18, 24);
    const feePerStudent = 10;
    const busCost = 140;
    const ticketsCost = randInt(25, 40);
    const ans = students * feePerStudent - busCost - ticketsCost;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Για μια σχολική εκδρομή ${students} μαθητές πλήρωσαν από 10 € ο καθένας. Από το συνολικό ποσό πληρώθηκαν 140 € για το λεωφορείο και ${ticketsCost} € για ξεναγό. Πόσα ευρώ περίσσεψαν στο ταμείο της τάξης;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${students} · 10 － 140 － ${ticketsCost} ＝ ${students * 10} － 140 － ${ticketsCost} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 8: Αμοιβή εργασίας με υπερωρίες
  () => {
    const baseHours = 40;
    const baseRate = 10;
    const overtimeHours = randInt(5, 12);
    const overtimeRate = 15;
    const tax = randInt(30, 60);
    const ans = baseHours * baseRate + overtimeHours * overtimeRate - tax;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Ένας τεχνικός εργάστηκε 40 ώρες κανονικού ωραρίου προς 10 € την ώρα και ${overtimeHours} ώρες υπερωρίας προς 15 € την ώρα. Από τις αποδοχές του κρατήθηκαν ${tax} € για εισφορές. Ποιο ήταν το καθαρό ποσό που έλαβε σε €;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: 40 · 10 ＋ ${overtimeHours} · 15 － ${tax} ＝ 400 ＋ ${overtimeHours * 15} － ${tax} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 9: Φύτευση δέντρων σε σειρές με απώλειες
  () => {
    const rows = randInt(5, 8);
    const treesPerRow = randInt(12, 16);
    const extraTrees = randInt(10, 20);
    const dryTrees = randInt(4, 9);
    const ans = rows * treesPerRow + extraTrees - dryTrees;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ',
      question: `Σε μια δενδροφύτευση φυτεύτηκαν ${rows} σειρές με ${treesPerRow} πεύκα σε κάθε σειρά, καθώς και ${extraTrees} κυπαρίσσια στην είσοδο. Αν από το σύνολο ξεράθηκαν ${dryTrees} δέντρα, πόσα δέντρα επιβίωσαν τελικά;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${rows} · ${treesPerRow} ＋ ${extraTrees} － ${dryTrees} ＝ ${rows * treesPerRow} ＋ ${extraTrees} － ${dryTrees} ＝ ${ans} δέντρα.`,
    };
  },

  // Πρόβλημα 10: Αγορά εξοπλισμού γυμναστηρίου με δόσεις
  () => {
    const initialPayment = 120;
    const months = 6;
    const installment = randInt(25, 45);
    const discount = 20;
    const ans = initialPayment + months * installment - discount;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Για την αγορά ενός διαδρόμου γυμναστικής δόθηκε προκαταβολή 120 € και συμφωνήθηκαν 6 μηνιαίες δόσεις των ${installment} €. Λόγω ειδικής προσφοράς έγινε έκπτωση 20 € στο συνολικό ποσό. Πόσο κόστισε τελικά ο διάδρομος σε €;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: 120 ＋ 6 · ${installment} － 20 ＝ 120 ＋ ${6 * installment} － 20 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 11: Συσκευασία δώρων με κορδέλες
  () => {
    const bigBoxes = randInt(3, 5);
    const ribbonPerBig = 4; // μέτρα
    const smallBoxes = randInt(4, 7);
    const ribbonPerSmall = 2; // μέτρα
    const initialRibbon = 50; // μέτρα
    const used = bigBoxes * ribbonPerBig + smallBoxes * ribbonPerSmall;
    const ans = initialRibbon - used;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα κατάστημα είχε μια κουλούρα κορδέλας μήκους 50 m. Χρησιμοποίησε κορδέλα για να τυλίξει ${bigBoxes} μεγάλα κουτιά (4 m το καθένα) και ${smallBoxes} μικρά κουτιά (2 m το καθένα). Πόσα μέτρα κορδέλας έμειναν στην κουλούρα;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση με παρένθεση: 50 － (${bigBoxes} · 4 ＋ ${smallBoxes} · 2) ＝ 50 － (${bigBoxes * 4} ＋ ${smallBoxes * 2}) ＝ 50 － ${used} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 12: Αγορά βιβλίων για σχολική βιβλιοθήκη
  () => {
    const novels = randInt(4, 7);
    const novelPrice = 12;
    const scienceBooks = randInt(3, 5);
    const sciencePrice = 15;
    const grant = 150;
    const spent = novels * novelPrice + scienceBooks * sciencePrice;
    const ans = grant - spent;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΟΘΗΚΗ',
      question: `Ο σύλλογος γονέων διέθεσε 150 € για τη σχολική βιβλιοθήκη. Αγοράστηκαν ${novels} λογοτεχνικά βιβλία προς 12 € το ένα και ${scienceBooks} επιστημονικά βιβλία προς 15 € το ένα. Πόσα ευρώ περίσσεψαν από τη δωρεά;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: 150 － (${novels} · 12 ＋ ${scienceBooks} · 15) ＝ 150 － (${novels * 12} ＋ ${scienceBooks * 15}) ＝ 150 － ${spent} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 13: Παραγωγή αρτοποιείου σε λαμαρίνες
  () => {
    const trays = randInt(4, 6);
    const itemsPerTray = 24;
    const morningSales = randInt(45, 65);
    const afternoonSales = randInt(25, 35);
    const ans = trays * itemsPerTray - morningSales - afternoonSales;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ',
      question: `Ένας φούρνος έψησε το πρωί ${trays} λαμαρίνες με τυρόπιτες, όπου κάθε λαμαρίνα περιείχε 24 τυρόπιτες. Το πρωί πουλήθηκαν ${morningSales} τυρόπιτες και το απόγευμα άλλες ${afternoonSales}. Πόσες τυρόπιτες περίσσεψαν στο τέλος της ημέρας;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${trays} · 24 － ${morningSales} － ${afternoonSales} ＝ ${trays * 24} － ${morningSales} － ${afternoonSales} ＝ ${ans} τυρόπιτες.`,
    };
  },

  // Πρόβλημα 14: Έξοδα εκτύπωσης σχολικής εφημερίδας
  () => {
    const copies = randInt(150, 250);
    const costPerCopy = 2;
    const designFee = 80;
    const adIncome = randInt(120, 200);
    const ans = copies * costPerCopy + designFee - adIncome;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΔΟΣΕΙΣ',
      question: `Η συντακτική ομάδα ενός σχολείου τύπωσε ${copies} τεύχη σχολικής εφημερίδας με κόστος εκτύπωσης 2 € ανά τεύχος και έξοδα σελιδοποίησης 80 €. Από χορηγίες συγκεντρώθηκαν ${adIncome} €. Ποιο ήταν το τελικό κόστος που έπρεπε να καλυφθεί από το ταμείο;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${copies} · 2 ＋ 80 － ${adIncome} ＝ ${copies * 2} ＋ 80 － ${adIncome} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 15: Συγκομιδή ελιών σε σακιά
  () => {
    const trees = randInt(8, 14);
    const kgPerTree = 25;
    const bonusFromGround = randInt(30, 60);
    const sackCapacity = 50;
    const totalKg = trees * kgPerTree + bonusFromGround;
    const sacks = Math.floor(totalKg / sackCapacity);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question: `Ένας παραγωγός μάζεψε από ${trees} ελαιόδεντρα 25 kg ελιές από το καθένα και επιπλέον ${bonusFromGround} kg που είχαν πέσει στο έδαφος. Αν γεμίζει σακιά χωρητικότητας 50 kg το καθένα, πόσα πλήρη σακιά των 50 kg γέμισε συνολικά;`,
      correctAnswer: sacks.toString(),
      solution: `Συνολικά κιλά: ${trees} · 25 ＋ ${bonusFromGround} ＝ ${trees * 25} ＋ ${bonusFromGround} ＝ ${totalKg} kg. Πλήρη σακιά: ${totalKg} ： 50 ＝ ${sacks} σακιά (με υπόλοιπο ${totalKg % sackCapacity} kg).`,
    };
  },

  // Πρόβλημα 16: Βαθμολογία σε τηλεοπτικό κουίζ 3 γύρων
  () => {
    const round1 = randInt(3, 6) * 10;
    const round2Correct = randInt(4, 7);
    const pointsR2 = 15;
    const penaltyR3 = randInt(2, 4) * 20;
    const ans = round1 + round2Correct * pointsR2 - penaltyR3;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Στον 1ο γύρο ενός κουίζ ένας παίκτης συγκέντρωσε ${round1} βαθμούς. Στον 2ο γύρο απάντησε σωστά σε ${round2Correct} ερωτήσεις των 15 βαθμών η καθεμία. Στον 3ο γύρο υπέπεσε σε ποινή ${penaltyR3} βαθμών. Ποιο ήταν το τελικό σκορ του;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${round1} ＋ ${round2Correct} · 15 － ${penaltyR3} ＝ ${round1} ＋ ${round2Correct * 15} － ${penaltyR3} ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου σε ταξίδι
  () => {
    const fullTank = 60; // λίτρα
    const hoursHighway = randInt(3, 5);
    const litersPerHour = 6;
    const cityDrivingLiters = randInt(8, 14);
    const consumed = hoursHighway * litersPerHour + cityDrivingLiters;
    const ans = fullTank - consumed;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Ένα αυτοκίνητο ξεκίνησε με γεμάτο ρεζερβουάρ 60 l. Ταξίδεψε στην εθνική οδό για ${hoursHighway} ώρες καταναλώνοντας 6 l ανά ώρα και κατόπιν κατανάλωσε άλλα ${cityDrivingLiters} l μέσα στην πόλη. Πόσα λίτρα καυσίμου έμειναν στο ρεζερβουάρ;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: 60 － (${hoursHighway} · 6 ＋ ${cityDrivingLiters}) ＝ 60 － (${hoursHighway * 6} ＋ ${cityDrivingLiters}) ＝ 60 － ${consumed} ＝ ${ans} l.`,
    };
  },

  // Πρόβλημα 18: Αγορά αθλητικών ειδών με ειδική έκπτωση ανά τεμάχιο
  () => {
    const shirts = randInt(4, 7);
    const shirtPrice = 18;
    const discountPerShirt = 3;
    const socks = 2;
    const socksPrice = 5;
    const ans = shirts * (shirtPrice - discountPerShirt) + socks * socksPrice;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια ομάδα αγόρασε ${shirts} φανέλες αρχικής αξίας 18 € με έκπτωση 3 € σε κάθε φανέλα, καθώς και 2 ζευγάρια κάλτσες προς 5 € το καθένα. Ποιο ήταν το συνολικό ποσό πληρωμής σε €;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${shirts} · (18 － 3) ＋ 2 · 5 ＝ ${shirts} · 15 ＋ 10 ＝ ${shirts * 15} ＋ 10 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φωτογραφιών
  () => {
    const sets = randInt(3, 5);
    const photosPerSet = 10;
    const pricePerPhoto = 2; // ευρώ (ή 0.20, εδώ σε ακέραια για ευκολία)
    const albumPrice = 15;
    const discount = 5;
    const ans = sets * photosPerSet * pricePerPhoto + albumPrice - discount;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΩΤΟΓΡΑΦΙΕΣ',
      question: `Ένας φωτογράφος τύπωσε ${sets} πακέτα φωτογραφιών με 10 φωτογραφίες το καθένα προς 2 € τη φωτογραφία. Αγόρασε επίσης ένα άλμπουμ αξίας 15 € και του έγινε συνολική έκπτωση 5 €. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${sets} · 10 · 2 ＋ 15 － 5 ＝ ${sets * 20} ＋ 15 － 5 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 20: Ομαδικό πακέτο πεζοπορίας
  () => {
    const participants = randInt(6, 10);
    const ticket = 25;
    const equipmentRent = 5;
    const groupDiscount = 30;
    const ans = participants * (ticket + equipmentRent) - groupDiscount;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΔΡΟΜΕΣ',
      question: `Μια ορειβατική ομάδα ${participants} ατόμων συμμετείχε σε οργανωμένη ανάβαση. Το εισιτήριο ήταν 25 € ανά άτομο και η ενοικίαση εξοπλισμού 5 € ανά άτομο. Λόγω ομαδικής κράτησης αφαιρέθηκαν 30 € από το συνολικό κόστος. Πόσα ευρώ πλήρωσε συνολικά η ομάδα;`,
      correctAnswer: ans.toString(),
      solution: `Παράσταση: ${participants} · (25 ＋ 5) － 30 ＝ ${participants} · 30 － 30 ＝ ${participants * 30} － 30 ＝ ${ans} €.`,
    };
  },
];

export default function ProteraiotitaPrakseonAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις πράξεων/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
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

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Προτεραιότητα Πράξεων | Α' Γυμνασίου"
      description="Εξάσκηση σε 12 δυναμικές αριθμητικές παραστάσεις και σύνθετα προβλήματα προτεραιότητας πράξεων για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/10-proteraiotita-prakseon"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προτεραιότητα των Πράξεων
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 αριθμητικές παραστάσεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
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
                            ΠΡΟΒΛΗΜΑ
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

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
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
