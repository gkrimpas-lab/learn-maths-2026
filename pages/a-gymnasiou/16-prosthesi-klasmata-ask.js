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

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
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

// Helper για αυθεντική κλασματική γραφή σε HTML string με πρόσημο μπροστά από τη γραμμή
const htmlFrac = (num, den, isNeg = false) => {
  const numericNeg = (typeof num === 'number' && num < 0) || (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;
  const absNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const absDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    showMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΠΡΟΣΘΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πρόσθεση ομόσημων θετικών ομώνυμων κλασμάτων (Input)
  () => {
    const den = randInt(5, 9);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const sumN = n1 + n2;
    const g = gcd(sumN, den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΑ ΟΜΩΝΥΜΑ (+)',
      question: `Υπολόγισε το άθροισμα στην πιο απλή (ανάγωγη) μορφή: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)})`,
      correctAnswer: ansStr,
      solution: `Προσθέτουμε τους αριθμητές διατηρώντας τον κοινό παρονομαστή: (${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} μετά από διαίρεση με το ${g}` : ''}.`,
    };
  },

  // 2. Πρόσθεση ομόσημων αρνητικών ομώνυμων κλασμάτων (Input)
  () => {
    const den = randInt(6, 11);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const sumN = -(n1 + n2);
    const g = gcd(Math.abs(sumN), den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΑ ΟΜΩΝΥΜΑ (-)',
      question: `Υπολόγισε το άθροισμα σε ανάγωγη μορφή: (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: `Προσθέτουμε τις απόλυτες τιμές και κρατάμε το αρνητικό πρόσημο: [－(${n1} ＋ ${n2})] / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 3. Πρόσθεση ετερόσημων ομώνυμων κλασμάτων (Input)
  () => {
    const den = randInt(5, 10);
    const pos = randInt(4, 7);
    const neg = randInt(1, 3);
    const sumN = pos - neg;
    const g = gcd(sumN, den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΑ ΟΜΩΝΥΜΑ',
      question: `Υπολόγισε το αποτέλεσμα σε ανάγωγη μορφή: (${htmlFrac(pos, den)}) ＋ (${htmlFrac(-neg, den)})`,
      correctAnswer: ansStr,
      solution: `Αφαιρούμε τις απόλυτες τιμές των αριθμητών: (${pos} － ${neg}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 4. Πρόσθεση ετερώνυμων κλασμάτων (Input)
  () => {
    const d1 = 2;
    const d2 = 3;
    const n1 = 1;
    const n2 = 1;
    // 1/2 + 1/3 = 3/6 + 2/6 = 5/6
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε το άθροισμα σε ανάγωγη μορφή: (${htmlFrac(n1, d1)}) ＋ (${htmlFrac(n2, d2)})`,
      correctAnswer: '5/6',
      solution: `ΕΚΠ(2, 3) ＝ 6. Μετατρέπουμε σε ομώνυμα με πολλαπλασιασμό των όρων: ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`,
    };
  },

  // 5. Πρόσθεση ετερώνυμων με αρνητικό όρο (Input)
  () => {
    const d1 = 4;
    const d2 = 6;
    // ΕΚΠ = 12. 3/4 + (-1/6) = 9/12 - 2/12 = 7/12
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ ΜΕ ΠΡΟΣΗΜΟ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(3, d1)}) ＋ (${htmlFrac(-1, d2)})`,
      correctAnswer: '7/12',
      solution: `ΕΚΠ(4, 6) ＝ 12. Μετατρέπουμε σε ομώνυμα: ${htmlFrac(9, 12)} ＋ (${htmlFrac(-2, 12)}) ＝ ${htmlFrac(7, 12)}.`,
    };
  },

  // 6. Άθροισμα αντίθετων ρητών (Input)
  () => {
    const n = randInt(2, 8);
    const d = randInt(9, 15);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΡΗΤΟΙ',
      question: `Ποιο είναι το αποτέλεσμα της πρόσθεσης: (${htmlFrac(n, d)}) ＋ (${htmlFrac(-n, d)});`,
      correctAnswer: '0',
      solution: `Το άθροισμα δύο αντίθετων ρητών αριθμών ισούται πάντοτε με 0.`,
    };
  },

  // 7. Πρόσθεση ομόσημων αρνητικών δεκαδικών (Input)
  () => {
    const a = (randInt(11, 28) / 10).toFixed(1);
    const b = (randInt(11, 35) / 10).toFixed(1);
    const sum = (-(parseFloat(a) + parseFloat(b))).toFixed(1).replace('.', ',');
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ (-)',
      question: `Υπολόγισε το άθροισμα: (－${a.replace('.', ',')}) ＋ (－${b.replace('.', ',')})`,
      correctAnswer: sum,
      solution: `Είναι ομόσημοι αρνητικοί: Προσθέτουμε τις απόλυτες τιμές (${a.replace('.', ',')} ＋ ${b.replace('.', ',')}) και βάζουμε πρόσημο μείον: ${sum}.`,
    };
  },

  // 8. Πρόσθεση ετερόσημων δεκαδικών (Input)
  () => {
    const a = 4.5;
    const b = -1.8;
    const sum = '2,7';
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ',
      question: `Υπολόγισε το αποτέλεσμα: (＋4,5) ＋ (－1,8)`,
      correctAnswer: sum,
      solution: `Είναι ετερόσημοι: Αφαιρούμε τις απόλυτες τιμές (4,5 － 1,8 ＝ 2,7) και κρατάμε το πρόσημο του μεγαλύτερου κατά απόλυτη τιμή (＋): ＋2,7 (ή 2,7).`,
    };
  },

  // 9. Πρόσθεση ετερόσημων δεκαδικών με αρνητικό αποτέλεσμα (Input)
  () => {
    const a = 2.3;
    const b = -6.5;
    const sum = '-4,2';
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ (-)',
      question: `Υπολόγισε το αποτέλεσμα: (＋2,3) ＋ (－6,5)`,
      correctAnswer: sum,
      solution: `Αφαιρούμε τις απόλυτες τιμές: 6,5 － 2,3 ＝ 4,2. Επειδή |-6,5| ＞ |+2,3|, το πρόσημο είναι μείον: ${sum}.`,
    };
  },

  // 10. Ιδιότητα ουδέτερου στοιχείου (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ',
      question: `Ποιο είναι το ουδέτερο στοιχείο της πρόσθεσης στους ρητούς αριθμούς;`,
      options: makeUniqueOptions('Το 0', ['Το 1', 'Το －1', 'Δεν υπάρχει']),
      correctAnswer: 'Το 0',
      solution: `Το μηδέν (0) είναι το ουδέτερο στοιχείο της πρόσθεσης, αφού α ＋ 0 ＝ 0 ＋ α ＝ α για κάθε ρητό α.`,
    };
  },

  // 11. Πρόσθεση ακέραιου με κλάσμα (Input)
  () => {
    // 1 + 1/3 = 3/3 + 1/3 = 4/3
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: 1 ＋ (${htmlFrac(1, 3)})`,
      correctAnswer: '4/3',
      solution: `Γράφουμε τον ακέραιο 1 ως ${htmlFrac(3, 3)}: ${htmlFrac(3, 3)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(4, 3)}.`,
    };
  },

  // 12. Πρόσθεση αρνητικού ακέραιου με κλάσμα (Input)
  () => {
    // -1 + 1/4 = -4/4 + 1/4 = -3/4
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ (-)',
      question: `Υπολόγισε το αποτέλεσμα σε ανάγωγο κλάσμα: (－1) ＋ (${htmlFrac(1, 4)})`,
      correctAnswer: '-3/4',
      solution: `Γράφουμε το －1 ως ${htmlFrac(-4, 4)}: ${htmlFrac(-4, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(-3, 4)}.`,
    };
  },

  // 13. Πρόσθεση τριών ομώνυμων κλασμάτων (Input)
  () => {
    const den = 7;
    // 1/7 + 2/7 + 3/7 = 6/7
    return {
      type: 'input',
      topic: 'ΤΡΙΑ ΟΜΩΝΥΜΑ',
      question: `Υπολόγισε το άθροισμα: (${htmlFrac(1, den)}) ＋ (${htmlFrac(2, den)}) ＋ (${htmlFrac(3, den)})`,
      correctAnswer: '6/7',
      solution: `Διατηρούμε τον παρονομαστή 7 και προσθέτουμε τους αριθμητές: (1 ＋ 2 ＋ 3) / 7 ＝ ${htmlFrac(6, 7)}.`,
    };
  },

  // 14. Πρόσθεση δεκαδικού με κλάσμα (Input)
  () => {
    // 0.5 + 1/4 = 0.5 + 0.25 = 0.75 (ή 3/4)
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΚΑΙ ΚΛΑΣΜΑ',
      question: `Υπολόγισε σε δεκαδική μορφή: 0,5 ＋ (${htmlFrac(1, 4)})`,
      correctAnswer: '0,75',
      solution: `Το κλάσμα ${htmlFrac(1, 4)} ισούται με 0,25. Άρα: 0,5 ＋ 0,25 ＝ 0,75.`,
    };
  },

  // 15. Κανόνας προσήμων ετερόσημων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question: `Ποιο πρόσημο έχει το άθροισμα δύο ετερόσημων ρητών αριθμών;`,
      options: makeUniqueOptions(
        'Το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή',
        [
          'Πάντα θετικό',
          'Πάντα αρνητικό',
          'Εξαρτάται μόνο από τον παρονομαστή',
        ]
      ),
      correctAnswer: 'Το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή',
      solution: `Στην πρόσθεση ετερόσημων αφαιρούμε τις απόλυτες τιμές και επικρατεί το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή.`,
    };
  },

  // 16. Πρόσθεση ετερώνυμων με απλοποίηση (Input)
  () => {
    // 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ & ΑΝΑΓΩΓΟ',
      question: `Υπολόγισε το αποτέλεσμα σε ανάγωγη μορφή: (${htmlFrac(1, 6)}) ＋ (${htmlFrac(1, 3)})`,
      correctAnswer: '1/2',
      solution: `ΕΚΠ(6, 3) ＝ 6. ${htmlFrac(1, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(1, 2)} μετά από διαίρεση με το 3.`,
    };
  },

  // 17. Πρόσθεση δεκαδικών με αντίθετα πρόσημα και ίση απόλυτη τιμή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΔΕΚΑΔΙΚΟΙ',
      question: `Υπολόγισε το αποτέλεσμα: (＋3,8) ＋ (－3,8)`,
      correctAnswer: '0',
      solution: `Είναι αντίθετοι αριθμοί, επομένως το άθροισμά τους είναι 0.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ',
      question: `Ποια ιδιότητα εκφράζει η ισότητα: α ＋ β ＝ β ＋ α;`,
      options: makeUniqueOptions(
        'Αντιμεταθετική ιδιότητα',
        ['Προσεταιριστική ιδιότητα', 'Επιμεριστική ιδιότητα', 'Ιδιότητα του αντιστρόφου']
      ),
      correctAnswer: 'Αντιμεταθετική ιδιότητα',
      solution: `Η δυνατότητα να αλλάζουμε τη σειρά των προσθετέων χωρίς να αλλάζει το αποτέλεσμα ονομάζεται αντιμεταθετική ιδιότητα.`,
    };
  },

  // 19. Πρόσθεση αρνητικών ετερώνυμων (Input)
  () => {
    // -1/2 + (-1/4) = -2/4 + (-1/4) = -3/4
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΑ ΕΤΕΡΩΝΥΜΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(-1, 2)}) ＋ (${htmlFrac(-1, 4)})`,
      correctAnswer: '-3/4',
      solution: `ΕΚΠ(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`,
    };
  },

  // 20. Πρόσθεση με μηδέν (Input)
  () => {
    const a = -7;
    const b = 9;
    return {
      type: 'input',
      topic: 'ΠΡΟΣΘΕΣΗ ΜΕ ΤΟ 0',
      question: `Υπολόγισε το αποτέλεσμα: (${htmlFrac(a, b)}) ＋ 0`,
      correctAnswer: `${a}/${b}`,
      solution: `Η πρόσθεση του μηδενός δεν μεταβάλλει τον αριθμό: ${htmlFrac(a, b)}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΡΟΣΘΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Οικονομικό ισοζύγιο καταστήματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κατάστημα την πρώτη εβδομάδα κατέγραψε ζημία 1,8 χιλιάδες ευρώ (δηλαδή －1,8) και τη δεύτερη εβδομάδα κατέγραψε κέρδος 4,5 χιλιάδες ευρώ (δηλαδή ＋4,5). Ποιο είναι το συνολικό οικονομικό αποτέλεσμα των δύο εβδομάδων σε χιλιάδες ευρώ;`,
      correctAnswer: '2,7',
      solution: `Προσθέτουμε τα ποσά: (－1,8) ＋ (＋4,5) ＝ ＋2,7 χιλιάδες ευρώ κέρδος.`,
    };
  },

  // Πρόβλημα 2: Μεταβολή θερμοκρασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Το πρωί η θερμοκρασία σε μια ορεινή πόλη ήταν －3,5 °C. Μέχρι το μεσημέρι η θερμοκρασία ανέβηκε κατά ＋5,2 °C. Ποια είναι η νέα θερμοκρασία το μεσημέρι;`,
      correctAnswer: '1,7',
      solution: `Προσθέτουμε τη μεταβολή στην αρχική θερμοκρασία: (－3,5) ＋ (＋5,2) ＝ ＋1,7 °C.`,
    };
  },

  // Πρόβλημα 3: Συνδυασμός υλικών σε συνταγή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Για ένα κέικ χρησιμοποιήθηκαν ${htmlFrac(1, 2)} του κιλού αλεύρι και ${htmlFrac(1, 4)} του κιλού ζάχαρη. Πόσα κιλά ζυγίζουν συνολικά τα δύο αυτά υλικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '3/4',
      solution: `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(2, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 4)} kg.`,
    };
  },

  // Πρόβλημα 4: Τραπεζικός λογαριασμός
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΡΑΠΕΖΕΣ',
      question: `Ένας τραπεζικός λογαριασμός είχε υπόλοιπο ＋120,5 € και έγινε χρέωση －45,3 € για συνδρομή. Ποιο είναι το νέο υπόλοιπο του λογαριασμού;`,
      correctAnswer: '75,2',
      solution: `(＋120,5) ＋ (－45,3) ＝ ＋75,2 €.`,
    };
  },

  // Πρόβλημα 5: Χρόνος προπόνησης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένας αθλητής έκανε ζέσταμα για ${htmlFrac(1, 3)} της ώρας και κύρια προπόνηση για ${htmlFrac(1, 2)} της ώρας. Ποιο κλάσμα της ώρας διήρκεσε συνολικά η άσκησή του (σε ανάγωγο κλάσμα);`,
      correctAnswer: '5/6',
      solution: `${htmlFrac(1, 3)} ＋ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 6)} ＋ ${htmlFrac(3, 6)} ＝ ${htmlFrac(5, 6)} της ώρας.`,
    };
  },

  // Πρόβλημα 6: Στάθμη νερού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Η στάθμη μιας δεξαμενής υποχώρησε κατά 0,8 μέτρα (－0,8) και μετά από βροχή ανέβηκε κατά 1,5 μέτρα (＋1,5). Ποια είναι η συνολική μεταβολή της στάθμης;`,
      correctAnswer: '0,7',
      solution: `(－0,8) ＋ (＋1,5) ＝ ＋0,7 μέτρα.`,
    };
  },

  // Πρόβλημα 7: Διαδρομή με ενδιάμεση στάση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ',
      question: `Ο Πέτρος περπάτησε ${htmlFrac(2, 5)} του χιλιομέτρου μέχρι το κατάστημα και άλλα ${htmlFrac(3, 10)} του χιλιομέτρου μέχρι το πάρκο. Πόσα χιλιόμετρα διένυσε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '7/10',
      solution: `${htmlFrac(2, 5)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(4, 10)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(7, 10)} km.`,
    };
  },

  // Πρόβλημα 8: Υψόμετρο υποβρυχίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΑ',
      question: `Ένα υποβρύχιο βρισκόταν σε βάθος 45,6 μέτρων (δηλαδή υψόμετρο －45,6 m) και αναδύθηκε κατά 20,4 μέτρα (＋20,4 m). Ποιο είναι το νέο του βάθος/υψόμετρο;`,
      correctAnswer: '-25,2',
      solution: `(－45,6) ＋ (＋20,4) ＝ －25,2 m.`,
    };
  },

  // Πρόβλημα 9: Μοίρασμα εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Η ομάδα Α ολοκλήρωσε τα ${htmlFrac(3, 8)} μιας εργασίας και η ομάδα Β τα ${htmlFrac(1, 4)}. Ποιο κλάσμα της εργασίας ολοκληρώθηκε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '5/8',
      solution: `${htmlFrac(3, 8)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 8)} ＋ ${htmlFrac(2, 8)} ＝ ${htmlFrac(5, 8)}.`,
    };
  },

  // Πρόβλημα 10: Βαθμοί ποινής σε παιχνίδι
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΙΧΝΙΔΙΑ',
      question: `Ένας παίκτης στον 1ο γύρο έχασε 2,5 πόντους (－2,5) και στον 2ο γύρο έχασε άλλους 4,2 πόντους (－4,2). Ποιο είναι το συνολικό σκορ των ποινών του;`,
      correctAnswer: '-6,7',
      solution: `(－2,5) ＋ (－4,2) ＝ －6,7 πόντοι.`,
    };
  },

  // Πρόβλημα 11: Κατανάλωση υγρών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Η Νίκη ήπιε ${htmlFrac(3, 5)} του λίτρου νερό το πρωί και ${htmlFrac(1, 2)} του λίτρου το απόγευμα. Πόσα λίτρα νερό κατανάλωσε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '11/10',
      solution: `ΕΚΠ(5, 2) ＝ 10. ${htmlFrac(6, 10)} ＋ ${htmlFrac(5, 10)} ＝ ${htmlFrac(11, 10)} L.`,
    };
  },

  // Πρόβλημα 12: Μεταβολή βάρους
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Ένας αθλητής τον πρώτο μήνα έχασε 1,6 kg (－1,6) και τον δεύτερο μήνα πήρε 0,9 kg (＋0,9). Ποια είναι η συνολική μεταβολή του βάρους του σε kg;`,
      correctAnswer: '-0,7',
      solution: `(－1,6) ＋ (＋0,9) ＝ －0,7 kg.`,
    };
  },

  // Πρόβλημα 13: Ύφασμα για ρούχα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΡΑΠΤΙΚΗ',
      question: `Μια μοδίστρα χρησιμοποίησε ${htmlFrac(3, 4)} του μέτρου για ένα γιλέκο και ${htmlFrac(2, 3)} του μέτρου για ένα παντελόνι. Πόσα μέτρα ύφασμα χρησιμοποίησε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '17/12',
      solution: `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(9, 12)} ＋ ${htmlFrac(8, 12)} ＝ ${htmlFrac(17, 12)} m.`,
    };
  },

  // Πρόβλημα 14: Έξοδα και έσοδα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας φοιτητής είχε έξοδα 62,4 € (δηλαδή －62,4) και εισέπραξε επίδομα 80,0 € (δηλαδή ＋80,0). Ποιο είναι το τελικό οικονομικό υπόλοιπο;`,
      correctAnswer: '17,6',
      solution: `(－62,4) ＋ (＋80,0) ＝ ＋17,6 €.`,
    };
  },

  // Πρόβλημα 15: Συγκομιδή καρπών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question: `Από ένα περιβόλι μαζεύτηκαν τα ${htmlFrac(2, 7)} της παραγωγής τη Δευτέρα και τα ${htmlFrac(3, 7)} την Τρίτη. Ποιο μέρος της παραγωγής μαζεύτηκε συνολικά;`,
      correctAnswer: '5/7',
      solution: `${htmlFrac(2, 7)} ＋ ${htmlFrac(3, 7)} ＝ ${htmlFrac(5, 7)}.`,
    };
  },

  // Πρόβλημα 16: Ανελκυστήρας κτιρίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΡΟΦΟΙ',
      question: `Ο ανελκυστήρας ενός πάρκινγκ ξεκίνησε από το 2ο υπόγειο (－2) και ανέβηκε 5 ορόφους (＋5). Σε ποιον όροφο έφτασε;`,
      correctAnswer: '3',
      solution: `(－2) ＋ (＋5) ＝ ＋3ος όροφος.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος μελέτης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Η Ελένη διάβασε ${htmlFrac(3, 10)} της ώρας ιστορία και ${htmlFrac(2, 5)} της ώρας μαθηματικά. Πόση ώρα μελέτησε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '7/10',
      solution: `${htmlFrac(3, 10)} ＋ ${htmlFrac(4, 10)} ＝ ${htmlFrac(7, 10)} της ώρας.`,
    };
  },

  // Πρόβλημα 18: Πτώση και άνοδος μετοχής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question: `Η τιμή μιας μετοχής υποχώρησε κατά 0,45 € (－0,45) το πρωί και ενισχύθηκε κατά 0,60 € (＋0,60) το απόγευμα. Ποια ήταν η συνολική μεταβολή της ημέρας;`,
      correctAnswer: '0,15',
      solution: `(－0,45) ＋ (＋0,60) ＝ ＋0,15 €.`,
    };
  },

  // Πρόβλημα 19: Μήκος ξύλινων δοκών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Ενώνουμε δύο σανίδες μήκους ${htmlFrac(5, 6)} του μέτρου και ${htmlFrac(1, 4)} του μέτρου. Ποιο είναι το συνολικό μήκος σε ανάγωγο κλάσμα;`,
      correctAnswer: '13/12',
      solution: `ΕΚΠ(6, 4) ＝ 12. ${htmlFrac(10, 12)} ＋ ${htmlFrac(3, 12)} ＝ ${htmlFrac(13, 12)} m.`,
    };
  },

  // Πρόβλημα 20: Ρεύμα ποταμού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Μια βάρκα κινείται αντίθετα στο ρεύμα με ταχύτητα ＋4,8 km/h ενώ το αντίθετο ρεύμα την επιβραδύνει με －1,5 km/h. Ποια είναι η πραγματική ταχύτητα της βάρκας;`,
      correctAnswer: '3,3',
      solution: `(＋4,8) ＋ (－1,5) ＝ ＋3,3 km/h.`,
    };
  },
];

export default function ProsthesiKlasmataAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις υπολογισμών/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο (για κλάσματα) και μείον
    clean = clean.replace(/[^0-9,/,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    const slashCount = (clean.match(/\//g) || []).length;
    if (slashCount > 1) return;
    if (clean.length > 12) return;

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
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '');

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
      title="Ασκήσεις: Πρόσθεση Ρητών Αριθμών | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην πρόσθεση ομόσημων και ετερόσημων ρητών αριθμών (κλάσματα και δεκαδικοί)."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/16-prosthesi-klasmata"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 14 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πρόσθεση Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία πρόσθεσης + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
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
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder="π.χ. -3/4 ή 2,5"
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
