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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΔΥΝΑΜΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Αρνητική βάση με άρτιο εκθέτη (Input)
  () => {
    const base = randInt(2, 5);
    const exp = 2;
    const ans = Math.pow(base, exp);
    return {
      type: 'input',
      topic: 'ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε την τιμή της δύναμης: (－${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Αρνητική βάση με άρτιο εκθέτη δίνει θετικό αποτέλεσμα: (－${base}) · (－${base}) ＝ ＋${ans}.`,
    };
  },

  // 2. Αρνητική βάση με περιττό εκθέτη (Input)
  () => {
    const base = randInt(2, 4);
    const exp = 3;
    const ans = -Math.pow(base, exp);
    return {
      type: 'input',
      topic: 'ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε την τιμή της δύναμης: (－${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Αρνητική βάση με περιττό εκθέτη δίνει αρνητικό αποτέλεσμα: (－${base}) · (－${base}) · (－${base}) ＝ ${ans}.`,
    };
  },

  // 3. Δύναμη χωρίς παρένθεση (Input)
  () => {
    const base = randInt(3, 7);
    const ans = -(base * base);
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question: `Υπολόγισε την τιμή: －${base}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `Χωρίς παρένθεση, ο εκθέτης επηρεάζει μόνο τον αριθμό ${base}, ενώ το πρόσημο μείον παραμένει: －(${base} · ${base}) ＝ ${ans}.`,
    };
  },

  // 4. Σύγκριση (－α)² και －α² (MCQ)
  () => {
    const a = randInt(3, 8);
    const correct = `(－${a})² ＞ －${a}²`;
    const candidates = [
      `(－${a})² ＜ －${a}²`,
      `(－${a})² ＝ －${a}²`,
    ];
    return {
      type: 'mcq',
      topic: 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question: `Ποια σχέση ισχύει μεταξύ των παραστάσεων (－${a})<sup>2</sup> και －${a}<sup>2</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `(－${a})<sup>2</sup> ＝ ＋${a * a} (θετικό), ενώ －${a}<sup>2</sup> ＝ －${a * a} (αρνητικό). Επομένως (－${a})<sup>2</sup> ＞ －${a}<sup>2</sup>.`,
    };
  },

  // 5. Δύναμη του －1 με μεγάλο άρτιο εκθέτη (MCQ)
  () => {
    const exp = randInt(50, 200) * 2;
    return {
      type: 'mcq',
      topic: 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question: `Ποια είναι η τιμή της δύναμης (－1)<sup>${exp}</sup>;`,
      options: makeUniqueOptions('1', ['－1', `${exp}`, `－${exp}`]),
      correctAnswer: '1',
      solution: `Ο αριθμός －1 υψωμένος σε άρτιο εκθέτη (${exp}) ισούται πάντοτε με ＋1 (ή 1).`,
    };
  },

  // 6. Δύναμη του －1 με μεγάλο περιττό εκθέτη (MCQ)
  () => {
    const exp = randInt(50, 200) * 2 + 1;
    return {
      type: 'mcq',
      topic: 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question: `Ποια είναι η τιμή της δύναμης (－1)<sup>${exp}</sup>;`,
      options: makeUniqueOptions('－1', ['1', `${exp}`, '0']),
      correctAnswer: '－1',
      solution: `Ο αριθμός －1 υψωμένος σε περιττό εκθέτη (${exp}) ισούται πάντοτε με －1.`,
    };
  },

  // 7. Δύναμη με εκθέτη 0 (Input)
  () => {
    const base = randInt(12, 95);
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε την τιμή της παράστασης: (－${base})<sup>0</sup>`,
      correctAnswer: '1',
      solution: `Κάθε μη μηδενικός αριθμός υψωμένος στο μηδέν ισούται εξ ορισμού με 1: α<sup>0</sup> ＝ 1.`,
    };
  },

  // 8. Δύναμη με εκθέτη 1 (Input)
  () => {
    const base = randInt(15, 60);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Υπολόγισε την τιμή: (－${base})<sup>1</sup>`,
      correctAnswer: `-${base}`,
      solution: `Κάθε αριθμός υψωμένος στον εκθέτη 1 παραμένει ο ίδιος: (－${base})<sup>1</sup> ＝ －${base}.`,
    };
  },

  // 9. Γινόμενο δυνάμεων με την ίδια βάση (MCQ)
  () => {
    const base = randInt(2, 5);
    const m = randInt(2, 4);
    const n = randInt(2, 4);
    const sumExp = m + n;
    const correct = `(－${base})<sup>${sumExp}</sup>`;
    const candidates = [
      `(－${base})<sup>${m * n}</sup>`,
      `(＋${base})<sup>${sumExp}</sup>`,
      `(－${base * base})<sup>${sumExp}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Πώς γράφεται ως μία δύναμη το γινόμενο: (－${base})<sup>${m}</sup> · (－${base})<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες: α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ＋ν</sup> ＝ (－${base})<sup>${sumExp}</sup>.`,
    };
  },

  // 10. Πηλίκο δυνάμεων με την ίδια βάση (MCQ)
  () => {
    const base = randInt(3, 6);
    const n = randInt(2, 3);
    const diff = randInt(2, 3);
    const m = n + diff;
    const correct = `(－${base})<sup>${diff}</sup>`;
    const candidates = [
      `(－${base})<sup>${m + n}</sup>`,
      `(－${base})<sup>${Math.floor(m / n)}</sup>`,
      `(＋${base})<sup>${diff}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Πώς γράφεται ως μία δύναμη το πηλίκο: (－${base})<sup>${m}</sup> ： (－${base})<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες: α<sup>μ</sup> ： α<sup>ν</sup> ＝ α<sup>μ－ν</sup> ＝ (－${base})<sup>${diff}</sup>.`,
    };
  },

  // 11. Δύναμη σε δύναμη (MCQ)
  () => {
    const base = randInt(2, 4);
    const m = 2;
    const n = 3;
    const multExp = m * n;
    const correct = `(－${base})<sup>${multExp}</sup>`;
    const candidates = [
      `(－${base})<sup>${m + n}</sup>`,
      `(＋${base})<sup>${multExp}</sup>`,
      `(－${base})<sup>${Math.pow(m, n)}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Πώς απλοποιείται η παράσταση [ (－${base})<sup>${m}</sup> ]<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Πολλαπλασιάζουμε τους εκθέτες: (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup> ＝ (－${base})<sup>${multExp}</sup>.`,
    };
  },

  // 12. Άθροισμα δυνάμεων (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    // (-a)^2 + (-b)^3 = a^2 - b^3
    const valA = a * a;
    const valB = -(b * b * b);
    const ans = valA + valB;
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ',
      question: `Υπολόγισε την τιμή: (－${a})<sup>2</sup> ＋ (－${b})<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－${a})<sup>2</sup> ＝ ＋${valA} και (－${b})<sup>3</sup> ＝ ${valB}. Άρα ${valA} ＋ (${valB}) ＝ ${ans}.`,
    };
  },

  // 13. Διαφορά δυνάμεων (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    // (-a)^2 - (-b)^2 = a^2 - b^2
    const ans = a * a - b * b;
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ',
      question: `Υπολόγισε: (－${a})<sup>2</sup> － (－${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－${a})<sup>2</sup> ＝ ${a * a} και (－${b})<sup>2</sup> ＝ ${b * b}. Επομένως ${a * a} － ${b * b} ＝ ${ans}.`,
    };
  },

  // 14. Δύναμη γινομένου (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Σύμφωνα με τις ιδιότητες των δυνάμεων, σε τι ισούται η παράσταση (α · β)<sup>ν</sup>;`,
      options: makeUniqueOptions(
        'α<sup>ν</sup> · β<sup>ν</sup>',
        ['α · β<sup>ν</sup>', 'α<sup>ν</sup> ＋ β<sup>ν</sup>', '(α ＋ β)<sup>ν</sup>']
      ),
      correctAnswer: 'α<sup>ν</sup> · β<sup>ν</sup>',
      solution: `Η δύναμη ενός γινομένου ισούται με το γινόμενο των δυνάμεων των παραγόντων του: (α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>.`,
    };
  },

  // 15. Δύναμη του 0 (MCQ)
  () => {
    const exp = randInt(3, 15);
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question: `Ποια είναι η τιμή της δύναμης 0<sup>${exp}</sup>;`,
      options: makeUniqueOptions('0', ['1', `${exp}`, 'Δεν ορίζεται']),
      correctAnswer: '0',
      solution: `Το μηδέν υψωμένο σε οποιονδήποτε θετικό ακέραιο εκθέτη ισούται πάντα με 0: 0<sup>ν</sup> ＝ 0.`,
    };
  },

  // 16. Παράσταση με πρόσημο έξω από παρένθεση: －(－α)³ (Input)
  () => {
    const a = randInt(2, 3);
    // - [ (-a)^3 ] = - [ - a^3 ] = + a^3
    const ans = Math.pow(a, 3);
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΑ ΠΡΟΣΗΜΑ',
      question: `Υπολόγισε την τιμή της παράστασης: －(－${a})<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－${a})<sup>3</sup> ＝ －${ans}. Επομένως με το μείον απ' έξω: －(－${ans}) ＝ ＋${ans}.`,
    };
  },

  // 17. Παράσταση με πρόσημο έξω: －(－α)² (Input)
  () => {
    const a = randInt(3, 6);
    // - [ (-a)^2 ] = - [ + a^2 ] = - a^2
    const ans = -(a * a);
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΑ ΠΡΟΣΗΜΑ',
      question: `Υπολόγισε την τιμή: －(－${a})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－${a})<sup>2</sup> ＝ ＋${a * a}. Με το μείον μπροστά: －(＋${a * a}) ＝ ${ans}.`,
    };
  },

  // 18. Άθροισμα δυνάμεων του －1 (Input)
  () => {
    // (-1)^2 + (-1)^3 + (-1)^4 = 1 - 1 + 1 = 1
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question: `Υπολόγισε: (－1)<sup>2</sup> ＋ (－1)<sup>3</sup> ＋ (－1)<sup>4</sup>`,
      correctAnswer: '1',
      solution: `(－1)<sup>2</sup> ＝ 1, (－1)<sup>3</sup> ＝ －1, (－1)<sup>4</sup> ＝ 1. Άρα 1 ＋ (－1) ＋ 1 ＝ 1.`,
    };
  },

  // 19. Τέταρτη δύναμη αρνητικού (Input)
  () => {
    const a = 2;
    const ans = 16;
    return {
      type: 'input',
      topic: 'ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε: (－2)<sup>4</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－2) · (－2) · (－2) · (－2) ＝ ＋16.`,
    };
  },

  // 20. Πέμπτη δύναμη αρνητικού (Input)
  () => {
    const a = 2;
    const ans = -32;
    return {
      type: 'input',
      topic: 'ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε: (－2)<sup>5</sup>`,
      correctAnswer: ans.toString(),
      solution: `(－2)<sup>5</sup> ＝ (－2) · (－2) · (－2) · (－2) · (－2) ＝ －32.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΥΝΑΜΕΩΝ ΜΕ ΑΡΤΙΑ ΕΛΛΗΝΙΚΗ ΣΥΝΤΑΞΗ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Πληθυσμός βακτηρίων (διπλασιασμός ανά ώρα)
  () => {
    const hours = randInt(3, 5);
    const ans = Math.pow(2, hours);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question: `Σε ένα πείραμα βιολογίας μια αποικία βακτηρίων διπλασιάζεται κάθε ώρα (συντελεστής 2). Αν αρχικά υπήρχε 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από ${hours} ώρες;`,
      correctAnswer: ans.toString(),
      solution: `Ο πληθυσμός εκφράζεται από τη δύναμη 2<sup>${hours}</sup> ＝ ${ans} βακτήρια.`,
    };
  },

  // Πρόβλημα 2: Εμβαδόν τετράγωνου οικοπέδου
  () => {
    const side = randInt(12, 25);
    const ans = side * side;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα τετράγωνο οικόπεδο έχει πλευρά μήκους ${side} m. Ποιο είναι το εμβαδόν του οικοπέδου σε m²;`,
      correctAnswer: ans.toString(),
      solution: `Το εμβαδόν τετραγώνου ισούται με το τετράγωνο της πλευράς του: Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 3: Όγκος κυβικής δεξαμενής
  () => {
    const edge = randInt(3, 6);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Μια αποθήκη έχει σχήμα κύβου με ακμή ${edge} m. Ποιος είναι ο όγκος της αποθήκης σε m³;`,
      correctAnswer: ans.toString(),
      solution: `Ο όγκος κύβου ισούται με την τρίτη δύναμη της ακμής του: V ＝ ${edge}<sup>3</sup> ＝ ${ans} m³.`,
    };
  },

  // Πρόβλημα 4: Τριπλασιασμός αρχείων σε δίκτυο υπολογιστών
  () => {
    const steps = randInt(2, 4);
    const ans = Math.pow(3, steps);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question: `Ένας ιός τριπλασιάζει τα αντίγραφά του σε ένα δίκτυο ανά λεπτό (συντελεστής 3). Αν αρχικά υπήρχε 1 αντίγραφο, πόσα αντίγραφα θα υπάρχουν μετά από ${steps} λεπτά;`,
      correctAnswer: ans.toString(),
      solution: `Υπολογίζουμε τη δύναμη: 3<sup>${steps}</sup> ＝ ${ans} αντίγραφα.`,
    };
  },

  // Πρόβλημα 5: Παιχνίδι ερωτήσεων με διπλασιασμό πόντων
  () => {
    const rounds = randInt(4, 6);
    const ans = Math.pow(2, rounds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα τηλεπαιχνίδι κάθε σωστή απάντηση διπλασιάζει τους πόντους του παίκτη. Αν ξεκίνησε με 1 πόντο και απάντησε σωστά σε ${rounds} διαδοχικές ερωτήσεις, πόσους πόντους συγκέντρωσε;`,
      correctAnswer: ans.toString(),
      solution: `Οι πόντοι είναι 2<sup>${rounds}</sup> ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 6: Δέντρο αποφάσεων (δυαδικό δέντρο)
  () => {
    const levels = randInt(3, 5);
    const ans = Math.pow(2, levels);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ',
      question: `Σε ένα τουρνουά σκακιού κάθε διακλάδωση χωρίζεται σε 2 νέες επιλογές. Πόσες δυνατές καταλήξεις υπάρχουν στο επίπεδο ${levels};`,
      correctAnswer: ans.toString(),
      solution: `Σε δυαδικό δέντρο ${levels} επιπέδων τα φύλλα είναι 2<sup>${levels}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 7: Χωρητικότητα μνήμης σε δυνάμεις του 2
  () => {
    const p = randInt(4, 7);
    const ans = Math.pow(2, p);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question: `Ένας μικροελεγκτής διαθέτει καταχωρητή με ${p} bits διευθυνσιοδότησης. Πόσες διαφορετικές θέσεις μνήμης μπορεί να προσπελάσει (υπολόγισε το 2<sup>${p}</sup>);`,
      correctAnswer: ans.toString(),
      solution: `Το πλήθος των διαφορετικών καταστάσεων είναι 2<sup>${p}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 8: Εμβαδόν πλατείας
  () => {
    const side = randInt(30, 60);
    const ans = side * side;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Μια τετράγωνη πλατεία έχει πλευρά ${side} m. Πόσα τετραγωνικά μέτρα (m²) πλακόστρωσης απαιτούνται για να καλυφθεί ολόκληρη;`,
      correctAnswer: ans.toString(),
      solution: `Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 9: Αλυσίδα μηνυμάτων (email chain)
  () => {
    const people = 4;
    const rounds = randInt(2, 3);
    const ans = Math.pow(people, rounds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question: `Ένα ενημερωτικό μήνυμα στέλνεται από 1 άτομο σε ${people} άτομα, και καθένα από αυτά το προωθεί σε άλλα ${people} νέα άτομα. Πόσα άτομα θα λάβουν το μήνυμα στον ${rounds}ο γύρο προώθησης;`,
      correctAnswer: ans.toString(),
      solution: `Στον ${rounds}ο γύρο τα άτομα είναι ${people}<sup>${rounds}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 10: Δίπλωμα χαρτιού στη μέση
  () => {
    const folds = randInt(4, 7);
    const ans = Math.pow(2, folds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question: `Διπλώνουμε ένα φύλλο χαρτί στη μέση ${folds} διαδοχικές φορές. Σε πόσα επάλληλα στρώματα (πάχη) χωρίζεται το χαρτί;`,
      correctAnswer: ans.toString(),
      solution: `Κάθε δίπλωμα διπλασιάζει τα στρώματα: 2<sup>${folds}</sup> ＝ ${ans} στρώματα.`,
    };
  },

  // Πρόβλημα 11: Όγκος κυβικού κιβωτίου αποθήκευσης
  () => {
    const edge = randInt(7, 10);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα κιβώτιο αποθήκευσης έχει σχήμα κύβου με ακμή ${edge} dm. Ποια είναι η χωρητικότητά του σε κυβικά δεκατόμετρα (dm³);`,
      correctAnswer: ans.toString(),
      solution: `V ＝ ${edge}<sup>3</sup> ＝ ${ans} dm³.`,
    };
  },

  // Πρόβλημα 12: Συνδυασμοί ψηφιακού κωδικού PIN
  () => {
    const digits = randInt(2, 3);
    const ans = Math.pow(10, digits);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ',
      question: `Ένα λουκέτο ασφαλείας έχει κωδικό με ${digits} περιστρεφόμενους τροχούς (κάθε τροχός έχει ψηφία 0-9, δηλαδή 10 επιλογές). Πόσοι διαφορετικοί συνδυασμοί μπορούν να σχηματιστούν (10<sup>${digits}</sup>);`,
      correctAnswer: ans.toString(),
      solution: `Οι δυνατοί συνδυασμοί είναι 10<sup>${digits}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 13: Τετραγωνισμός αριθμού μαθητών σε σχηματισμό παρέλασης
  () => {
    const rows = randInt(6, 12);
    const ans = rows * rows;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Σε μια σχολική γιορτή οι μαθητές παρατάσσονται σε τετράγωνο σχηματισμό με ${rows} σειρές και ${rows} στήλες. Πόσοι μαθητές συμμετέχουν συνολικά στον σχηματισμό;`,
      correctAnswer: ans.toString(),
      solution: `Συνολικοί μαθητές: ${rows} · ${rows} ＝ ${rows}<sup>2</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 14: Διάδοση φήμης (πενταπλασιασμός)
  () => {
    const rounds = 3;
    const ans = Math.pow(5, rounds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question: `Σε ένα σχολείο κάθε μαθητής μεταφέρει ένα νέο σε 5 συμμαθητές του σε κάθε διάλειμμα. Αν ξεκινήσει από 1 μαθητή, πόσοι νέοι μαθητές θα ενημερωθούν στο 3ο διάλειμμα;`,
      correctAnswer: ans.toString(),
      solution: `Υπολογίζουμε τη δύναμη: 5<sup>3</sup> ＝ 125 μαθητές.`,
    };
  },

  // Πρόβλημα 15: Εμβαδόν τετράγωνου ηλιακού συλλέκτη
  () => {
    const side = randInt(4, 9);
    const ans = side * side;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question: `Ένας τετράγωνος ηλιακός συλλέκτης έχει μήκος πλευράς ${side} m. Ποια είναι η επιφάνεια συλλογής ενέργειας σε m²;`,
      correctAnswer: ans.toString(),
      solution: `Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 16: Ρυθμός αναπαραγωγής κυττάρων
  () => {
    const cycles = randInt(5, 7);
    const ans = Math.pow(2, cycles);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ',
      question: `Ένα αρχικό κύτταρο διαιρείται σε 2 νέα κύτταρα σε κάθε κύκλο μίτωσης. Πόσα κύτταρα θα έχουν προκύψει μετά από ${cycles} διαδοχικούς κύκλους διαίρεσης;`,
      correctAnswer: ans.toString(),
      solution: `Πλήθος κυττάρων: 2<sup>${cycles}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 17: Όγκος κυβικής παγοκύβου
  () => {
    const edge = randInt(2, 4);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα παγάκι έχει σχήμα τέλειου κύβου με ακμή ${edge} cm. Ποιος είναι ο όγκος του σε cm³;`,
      correctAnswer: ans.toString(),
      solution: `V ＝ ${edge}<sup>3</sup> ＝ ${ans} cm³.`,
    };
  },

  // Πρόβλημα 18: Πιθανοί συνδυασμοί ρίψης νομίσματος
  () => {
    const tosses = randInt(3, 5);
    const ans = Math.pow(2, tosses);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΘΑΝΟΤΗΤΕΣ',
      question: `Ρίχνουμε ένα κέρμα ${tosses} συνεχόμενες φορές (σε κάθε ρίψη υπάρχουν 2 αποτελέσματα: κορώνα ή γράμματα). Πόσα διαφορετικά πιθανά αποτελέσματα ακολουθιών υπάρχουν;`,
      correctAnswer: ans.toString(),
      solution: `Συνολικά αποτελέσματα: 2<sup>${tosses}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 19: Κυβικό δοχείο λαδιού
  () => {
    const edge = 5;
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα κυβικό δοχείο έχει ακμή 5 dm. Πόσα λίτρα λαδιού χωράει αν γνωρίζουμε ότι 1 dm³ ισοδυναμεί με 1 l;`,
      correctAnswer: ans.toString(),
      solution: `V ＝ 5<sup>3</sup> ＝ 125 dm³ ＝ 125 l.`,
    };
  },

  // Πρόβλημα 20: Τετραγωνισμός επιφάνειας ψηφιδωτού
  () => {
    const side = randInt(11, 20);
    const ans = side * side;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΗ',
      question: `Ένας καλλιτέχνης δημιουργεί ένα τετράγωνο ψηφιδωτό τοποθετώντας ${side} ψηφίδες σε κάθε πλευρά. Πόσες ψηφίδες χρειάζεται συνολικά για να γεμίσει το τετράγωνο;`,
      correctAnswer: ans.toString(),
      solution: `Συνολικές ψηφίδες: ${side}<sup>2</sup> ＝ ${ans}.`,
    };
  },
];

export default function DinameisAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις πράξεων + 2 ρεαλιστικά προβλήματα = 12 συνολικά
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
      title="Ασκήσεις: Δυνάμεις Ακεραίων | Α' Γυμνασίου"
      description="Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στις δυνάμεις ακεραίων αριθμών και τις ιδιότητές τους."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/09-dinameis"
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
              Δυνάμεις Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
