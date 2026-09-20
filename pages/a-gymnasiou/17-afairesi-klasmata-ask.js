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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΑΦΑΙΡΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Αφαίρεση ομώνυμων θετικών κλασμάτων (Input)
  () => {
    const den = randInt(5, 9);
    const n1 = randInt(4, 7);
    const n2 = randInt(1, 3);
    const diffN = n1 - n2;
    const g = gcd(diffN, den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε τη διαφορά σε ανάγωγο κλάσμα: (${htmlFrac(n1, den)}) － (${htmlFrac(n2, den)})`,
      correctAnswer: ansStr,
      solution: `Διατηρούμε τον κοινό παρονομαστή και αφαιρούμε τους αριθμητές: (${n1} － ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} μετά από διαίρεση με το ${g}` : ''}.`,
    };
  },

  // 2. Αφαίρεση αρνητικού από θετικό (διπλό μείον) (Input)
  () => {
    const den = randInt(4, 8);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const diffN = n1 + n2;
    const g = gcd(diffN, den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΡΝΗΤΙΚΟΥ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(n1, den)}) － (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: `Η αφαίρεση αρνητικού μετατρέπεται σε πρόσθεση: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 3. Αφαίρεση αρνητικού από αρνητικό (Input)
  () => {
    const den = randInt(5, 10);
    // (-5/den) - (-2/den) = -5/den + 2/den = -3/den
    const n1 = 5;
    const n2 = 2;
    const diffN = -3;
    const g = gcd(Math.abs(diffN), den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΑ ΟΜΩΝΥΜΑ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: `(${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)}) ＝ (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ (－${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 4. Αφαίρεση απλών ετερώνυμων κλασμάτων (Input)
  () => {
    // 3/4 - 1/2 = 3/4 - 2/4 = 1/4
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(3, 4)}) － (${htmlFrac(1, 2)})`,
      correctAnswer: '1/4',
      solution: `ΕΚΠ(4, 2) ＝ 4. Μετατρέπουμε σε ομώνυμα με πολλαπλασιασμό των όρων: ${htmlFrac(3, 4)} － ${htmlFrac(2, 4)} ＝ ${htmlFrac(1, 4)}.`,
    };
  },

  // 5. Αφαίρεση ετερώνυμων με ΕΚΠ 6 (Input)
  () => {
    // 5/6 - 2/3 = 5/6 - 4/6 = 1/6
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε τη διαφορά σε ανάγωγη μορφή: (${htmlFrac(5, 6)}) － (${htmlFrac(2, 3)})`,
      correctAnswer: '1/6',
      solution: `ΕΚΠ(6, 3) ＝ 6. ${htmlFrac(5, 6)} － ${htmlFrac(4, 6)} ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // 6. Αφαίρεση ίσων κλασμάτων (Input)
  () => {
    const a = randInt(3, 8);
    const b = randInt(9, 15);
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΙΣΩΝ ΟΡΩΝ',
      question: `Ποιο είναι το αποτέλεσμα: (${htmlFrac(a, b)}) － (${htmlFrac(a, b)});`,
      correctAnswer: '0',
      solution: `Η διαφορά δύο ίσων αριθμών ισούται πάντοτε με 0.`,
    };
  },

  // 7. Αφαίρεση δεκαδικών (θετικός μείον θετικός) (Input)
  () => {
    const a = 5.8;
    const b = 2.3;
    const diff = '3,5';
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ',
      question: `Υπολόγισε το αποτέλεσμα: (＋5,8) － (＋2,3)`,
      correctAnswer: diff,
      solution: `5,8 － 2,3 ＝ 3,5.`,
    };
  },

  // 8. Αφαίρεση αρνητικού δεκαδικού (Input)
  () => {
    const a = 3.2;
    const b = 1.5;
    // 3.2 - (-1.5) = 3.2 + 1.5 = 4.7
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΜΕΙΟΝ ΑΡΝΗΤΙΚΟ',
      question: `Υπολόγισε το αποτέλεσμα: (＋3,2) － (－1,5)`,
      correctAnswer: '4,7',
      solution: `3,2 － (－1,5) ＝ 3,2 ＋ 1,5 ＝ 4,7.`,
    };
  },

  // 9. Αφαίρεση θετικού δεκαδικού από αρνητικό (Input)
  () => {
    const a = 4.1;
    const b = 2.6;
    // -4.1 - (+2.6) = -4.1 - 2.6 = -6.7
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΜΕΙΟΝ ΘΕΤΙΚΟ',
      question: `Υπολόγισε το αποτέλεσμα: (－4,1) － (＋2,6)`,
      correctAnswer: '-6,7',
      solution: `(－4,1) ＋ (－2,6) ＝ －(4,1 ＋ 2,6) ＝ －6,7.`,
    };
  },

  // 10. Θεωρητικός ορισμός της αφαίρεσης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΡΙΣΜΟΣ ΑΦΑΙΡΕΣΗΣ',
      question: `Πώς ορίζεται η αφαίρεση α － β στους ρητούς αριθμούς;`,
      options: makeUniqueOptions(
        'Ως πρόσθεση του μειωτέου με τον αντίθετο του αφαιρετέου: α ＋ (－β)',
        [
          'Ως πολλαπλασιασμός με τον αντίστροφο: α · (1/β)',
          'Ως διαίρεση των δύο αριθμών: α ： β',
          'Ως διαφορά των απολύτων τιμών τους',
        ]
      ),
      correctAnswer: 'Ως πρόσθεση του μειωτέου με τον αντίθετο του αφαιρετέου: α ＋ (－β)',
      solution: `Στους ρητούς αριθμούς η αφαίρεση είναι πρόσθεση με τον αντίθετο: α － β ＝ α ＋ (－β).`,
    };
  },

  // 11. Αφαίρεση κλάσματος από το 1 (Input)
  () => {
    // 1 - 2/5 = 5/5 - 2/5 = 3/5
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΗ ΜΟΝΑΔΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: 1 － (${htmlFrac(2, 5)})`,
      correctAnswer: '3/5',
      solution: `1 ＝ ${htmlFrac(5, 5)}. Άρα: ${htmlFrac(5, 5)} － ${htmlFrac(2, 5)} ＝ ${htmlFrac(3, 5)}.`,
    };
  },

  // 12. Αφαίρεση με αποτέλεσμα αρνητικό κλάσμα (Input)
  () => {
    // 1/3 - 4/3 = -3/3 = -1
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΜΕ ΑΡΝΗΤΙΚΟ ΑΠΟΤΕΛΕΣΜΑ',
      question: `Υπολόγισε το αποτέλεσμα: (${htmlFrac(1, 3)}) － (${htmlFrac(4, 3)})`,
      correctAnswer: '-1',
      solution: `(1 － 4) / 3 ＝ －3 / 3 ＝ －1.`,
    };
  },

  // 13. Αφαίρεση του μηδενός (Input)
  () => {
    const a = -4;
    const b = 7;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΜΗΔΕΝΟΣ',
      question: `Ποιο είναι το αποτέλεσμα: (${htmlFrac(a, b)}) － 0;`,
      correctAnswer: `${a}/${b}`,
      solution: `Αν αφαιρέσουμε το μηδέν από οποιονδήποτε αριθμό, ο αριθμός παραμένει αμετάβλητος: ${htmlFrac(a, b)}.`,
    };
  },

  // 14. Αφαίρεση από το μηδέν (Input)
  () => {
    // 0 - (3/5) = -3/5
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΟ ΜΗΔΕΝ',
      question: `Υπολόγισε το αποτέλεσμα: 0 － (${htmlFrac(3, 5)})`,
      correctAnswer: '-3/5',
      solution: `0 － (${htmlFrac(3, 5)}) ＝ 0 ＋ (${htmlFrac(-3, 5)}) ＝ ${htmlFrac(-3, 5)}.`,
    };
  },

  // 15. Κανόνας προσήμων παρένθεσης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΑΣ ΠΑΡΕΝΘΕΣΗΣ',
      question: `Σε ποιο από τα παρακάτω ισούται η παράσταση: －(－α);`,
      options: makeUniqueOptions('＋α', ['－α', '0', '1']),
      correctAnswer: '＋α',
      solution: `Ο αντίθετος του αντίθετου αριθμού ισούται με τον αρχικό αριθμό: －(－α) ＝ ＋α.`,
    };
  },

  // 16. Αφαίρεση ετερώνυμων με ΕΚΠ 12 (Input)
  () => {
    // 5/12 - 1/4 = 5/12 - 3/12 = 2/12 = 1/6
    return {
      type: 'input',
      topic: 'ΕΤΕΡΩΝΥΜΑ & ΑΝΑΓΩΓΟ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(5, 12)}) － (${htmlFrac(1, 4)})`,
      correctAnswer: '1/6',
      solution: `ΕΚΠ(12, 4) ＝ 12. ${htmlFrac(5, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(2, 12)} ＝ ${htmlFrac(1, 6)} μετά από διαίρεση με το 2.`,
    };
  },

  // 17. Αφαίρεση αρνητικών δεκαδικών με θετικό αποτέλεσμα (Input)
  () => {
    // -2.1 - (-5.4) = -2.1 + 5.4 = 3.3
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΙ ΔΕΚΑΔΙΚΟΙ',
      question: `Υπολόγισε το αποτέλεσμα: (－2,1) － (－5,4)`,
      correctAnswer: '3,3',
      solution: `(－2,1) ＋ 5,4 ＝ 5,4 － 2,1 ＝ 3,3.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question: `Ισχύει η αντιμεταθετική ιδιότητα στην αφαίρεση των ρητών αριθμών (δηλαδή α － β ＝ β － α);`,
      options: makeUniqueOptions(
        'Όχι, ισχύει γενικά α － β ＝ －(β － α)',
        [
          'Ναι, ισχύει πάντοτε',
          'Ισχύει μόνο όταν οι αριθμοί είναι θετικοί',
          'Ισχύει μόνο για ομώνυμα κλάσματα',
        ]
      ),
      correctAnswer: 'Όχι, ισχύει γενικά α － β ＝ －(β － α)',
      solution: `Η αφαίρεση ΔΕΝ έχει αντιμεταθετική ιδιότητα. Τα αποτελέσματα α － β και β － α είναι αντίθετοι αριθμοί.`,
    };
  },

  // 19. Αφαίρεση δεκαδικού από ακέραιο (Input)
  () => {
    // 3 - 1.4 = 1.6
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΜΕΙΟΝ ΔΕΚΑΔΙΚΟ',
      question: `Υπολόγισε το αποτέλεσμα: 3 － 1,4`,
      correctAnswer: '1,6',
      solution: `3,0 － 1,4 ＝ 1,6.`,
    };
  },

  // 20. Αφαίρεση ετερώνυμων με αρνητικό μειωτέο (Input)
  () => {
    // -1/2 - 1/4 = -2/4 - 1/4 = -3/4
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΑ ΕΤΕΡΩΝΥΜΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(-1, 2)}) － (${htmlFrac(1, 4)})`,
      correctAnswer: '-3/4',
      solution: `ΕΚΠ(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΑΦΑΙΡΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Διαφορά θερμοκρασίας ημέρας και νύχτας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Το μεσημέρι η θερμοκρασία ήταν ＋6,4 °C και το βράδυ έπεσε στους －1,8 °C. Πόσους βαθμούς Κελσίου ήταν η πτώση (δηλαδή η διαφορά 6,4 － (－1,8));`,
      correctAnswer: '8,2',
      solution: `6,4 － (－1,8) ＝ 6,4 ＋ 1,8 ＝ 8,2 °C.`,
    };
  },

  // Πρόβλημα 2: Υπόλοιπο πίτσας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ',
      question: `Από μια ολόκληρη πίτσα (1) καταναλώθηκαν τα ${htmlFrac(5, 8)}. Ποιο κλάσμα της πίτσας απομένει (σε ανάγωγο κλάσμα);`,
      correctAnswer: '3/8',
      solution: `1 － ${htmlFrac(5, 8)} ＝ ${htmlFrac(8, 8)} － ${htmlFrac(5, 8)} ＝ ${htmlFrac(3, 8)}.`,
    };
  },

  // Πρόβλημα 3: Διαφορά υψομέτρου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΑ',
      question: `Μια κορυφή βουνού βρίσκεται σε υψόμετρο ＋850,5 μέτρα και ένα υπόγειο σπήλαιο σε υψόμετρο －42,3 μέτρα. Ποια είναι η υψομετρική διαφορά τους σε μέτρα;`,
      correctAnswer: '892,8',
      solution: `850,5 － (－42,3) ＝ 850,5 ＋ 42,3 ＝ 892,8 m.`,
    };
  },

  // Πρόβλημα 4: Κατανάλωση υφάσματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα τόπι ύφασμα είχε μήκος ${htmlFrac(7, 4)} του μέτρου και κόπηκε κομμάτι ${htmlFrac(2, 3)} του μέτρου. Πόσα μέτρα ύφασμα απέμειναν (σε ανάγωγο κλάσμα);`,
      correctAnswer: '13/12',
      solution: `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(21, 12)} － ${htmlFrac(8, 12)} ＝ ${htmlFrac(13, 12)} m.`,
    };
  },

  // Πρόβλημα 5: Τραπεζική ανάληψη
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας λογαριασμός είχε 85,60 € και έγινε ανάληψη 100,00 €. Ποιο είναι το νέο αρνητικό υπόλοιπο του λογαριασμού (85,6 － 100);`,
      correctAnswer: '-14,4',
      solution: `85,6 － 100 ＝ －14,4 €.`,
    };
  },

  // Πρόβλημα 6: Διαφορά χρόνου σε αγώνα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ο νικητής ενός αγώνα τερμάτισε σε 14,25 δευτερόλεπτα και ο δεύτερος σε 14,80 δευτερόλεπτα. Ποια ήταν η διαφορά χρόνου τους σε δευτερόλεπτα (14,80 － 14,25);`,
      correctAnswer: '0,55',
      solution: `14,80 － 14,25 ＝ 0,55 δευτερόλεπτα.`,
    };
  },

  // Πρόβλημα 7: Υπόλοιπο δεξαμενής πετρελαίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Μια δεξαμενή ήταν γεμάτη κατά τα ${htmlFrac(5, 6)} και καταναλώθηκαν τα ${htmlFrac(1, 4)} του πετρελαίου. Ποιο κλάσμα της δεξαμενής απομένει (σε ανάγωγο κλάσμα);`,
      correctAnswer: '7/12',
      solution: `ΕΚΠ(6, 4) ＝ 12. ${htmlFrac(10, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(7, 12)}.`,
    };
  },

  // Πρόβλημα 8: Διαφορά βάρους
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Ένα δέμα ζυγίζει 4,2 kg και ένα άλλο 2,75 kg. Πόσο βαρύτερο είναι το πρώτο δέμα σε kg;`,
      correctAnswer: '1,45',
      solution: `4,20 － 2,75 ＝ 1,45 kg.`,
    };
  },

  // Πρόβλημα 9: Υπολειπόμενη διαδρομή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ',
      question: `Ένας πεζοπόρος πρέπει να διανύσει ${htmlFrac(9, 10)} του χιλιομέτρου και έχει ήδη περπατήσει ${htmlFrac(2, 5)} του χιλιομέτρου. Πόσο του απομένει (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/2',
      solution: `${htmlFrac(9, 10)} － ${htmlFrac(4, 10)} ＝ ${htmlFrac(5, 10)} ＝ ${htmlFrac(1, 2)} km.`,
    };
  },

  // Πρόβλημα 10: Πτώση μετοχής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question: `Η αρχική τιμή μιας μετοχής ήταν 12,80 € και στο κλείσιμο έπεσε στα 11,15 €. Πόση ήταν η απώλεια σε ευρώ;`,
      correctAnswer: '1,65',
      solution: `12,80 － 11,15 ＝ 1,65 €.`,
    };
  },

  // Πρόβλημα 11: Υπόλοιπο χρόνου μελέτης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Το πρόγραμμα μελέτης προβλέπει ${htmlFrac(3, 4)} της ώρας διάβασμα. Αν ο μαθητής έχει διαβάσει ${htmlFrac(1, 3)} της ώρας, πόση ώρα απομένει (σε ανάγωγο κλάσμα);`,
      correctAnswer: '5/12',
      solution: `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(9, 12)} － ${htmlFrac(4, 12)} ＝ ${htmlFrac(5, 12)} της ώρας.`,
    };
  },

  // Πρόβλημα 12: Μεταβολή στάθμης ποταμού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Η στάθμη του ποταμού ήταν στο ＋1,4 m πάνω από το κανονικό και μετά από ξηρασία έπεσε στο －0,8 m. Πόσα μέτρα συνολικά υποχώρησε η στάθμη (1,4 － (－0,8));`,
      correctAnswer: '2,2',
      solution: `1,4 － (－0,8) ＝ 1,4 ＋ 0,8 ＝ 2,2 m.`,
    };
  },

  // Πρόβλημα 13: Υπόλοιπο υλικού κατασκευής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Από ένα ξύλο μήκους ${htmlFrac(5, 2)} μέτρων κόπηκε κομμάτι μήκους ${htmlFrac(4, 3)} μέτρων. Πόσα μέτρα ξύλου απέμειναν (σε ανάγωγο κλάσμα);`,
      correctAnswer: '7/6',
      solution: `ΕΚΠ(2, 3) ＝ 6. ${htmlFrac(15, 6)} － ${htmlFrac(8, 6)} ＝ ${htmlFrac(7, 6)} m.`,
    };
  },

  // Πρόβλημα 14: Έκπτωση και πληρωμή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα ρούχο αξίας 45,50 € πουλήθηκε με έκπτωση 12,80 €. Ποια ήταν η τελική τιμή πώλησης;`,
      correctAnswer: '32,7',
      solution: `45,50 － 12,80 ＝ 32,70 € (γράφεται 32,7).`,
    };
  },

  // Πρόβλημα 15: Υπόλοιπο χυμού σε κανάτα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Σε μια κανάτα υπήρχαν ${htmlFrac(7, 8)} του λίτρου χυμός και σερβιρίστηκαν ${htmlFrac(1, 2)} του λίτρου. Πόσο περίσσεψε (σε ανάγωγο κλάσμα);`,
      correctAnswer: '3/8',
      solution: `${htmlFrac(7, 8)} － ${htmlFrac(4, 8)} ＝ ${htmlFrac(3, 8)} L.`,
    };
  },

  // Πρόβλημα 16: Διαφορά βαθμολογίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΙ',
      question: `Στο 1ο τεστ ένας μαθητής συγκέντρωσε 18,5 μονάδες και στο 2ο τεστ 15,75 μονάδες. Πόσο μειώθηκε η βαθμολογία του;`,
      correctAnswer: '2,75',
      solution: `18,50 － 15,75 ＝ 2,75 μονάδες.`,
    };
  },

  // Πρόβλημα 17: Υπόλοιπο χωρητικότητας δίσκου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Ο αποθηκευτικός χώρος ήταν κατειλημμένος κατά τα ${htmlFrac(9, 10)}. Αν διαγραφούν αρχεία που πιάνουν τα ${htmlFrac(1, 5)}, ποιο κλάσμα του χώρου παραμένει κατειλημμένο (σε ανάγωγο κλάσμα);`,
      correctAnswer: '7/10',
      solution: `${htmlFrac(9, 10)} － ${htmlFrac(2, 10)} ＝ ${htmlFrac(7, 10)}.`,
    };
  },

  // Πρόβλημα 18: Βάθος υποβρυχίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένα υποβρύχιο βρισκόταν σε βάθος 120,4 m (－120,4) και κατέβηκε άλλα 25,2 m. Ποιο είναι το νέο βάθος (－120,4 － 25,2);`,
      correctAnswer: '-145,6',
      solution: `－120,4 － 25,2 ＝ －145,6 m.`,
    };
  },

  // Πρόβλημα 19: Υπόλοιπο μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΠΑΤΑΡΙΑ',
      question: `Η μπαταρία του tablet ήταν στο 0,85 (85%) και μετά από παιχνίδι καταναλώθηκε το 0,32 (32%). Ποιο δεκαδικό ποσοστό μπαταρίας απομένει;`,
      correctAnswer: '0,53',
      solution: `0,85 － 0,32 ＝ 0,53.`,
    };
  },

  // Πρόβλημα 20: Διαφορά επίδοσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ένας άλτης έκανε άλμα ${htmlFrac(13, 2)} μέτρα (6,5 m) στην πρώτη προσπάθεια και ${htmlFrac(23, 4)} μέτρα (5,75 m) στη δεύτερη. Πόσο μεγαλύτερο ήταν το πρώτο άλμα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '3/4',
      solution: `ΕΚΠ(2, 4) ＝ 4. ${htmlFrac(26, 4)} － ${htmlFrac(23, 4)} ＝ ${htmlFrac(3, 4)} m.`,
    };
  },
];

export default function AfairesiKlasmataAsk() {
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
      title="Ασκήσεις: Αφαίρεση Ρητών Αριθμών | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην αφαίρεση ομόσημων και ετερόσημων ρητών αριθμών (κλάσματα και δεκαδικοί)."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/17-afairesi-klasmata"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 15 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αφαίρεση Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία αφαίρεσης + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 1/4 ή -2,5"
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
