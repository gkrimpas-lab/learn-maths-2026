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

// Helper για αυθεντική κλασματική γραφή σε HTML string με ασφαλές πρόσημο
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// Helper για οπτική αναπαράσταση Σύνθετου Κλάσματος σε HTML string
const htmlCompoundFrac = (num1, den1, num2, den2) => {
  return `<span class="inline-flex flex-col items-center justify-center leading-none text-center align-middle mx-1 font-mono"><span class="pb-1 px-1 border-b-2 border-amber-500">${htmlFrac(
    num1,
    den1
  )}</span><span class="pt-1 px-1">${htmlFrac(num2, den2)}</span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΔΙΑΙΡΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Απλή διαίρεση θετικών κλασμάτων (Input)
  () => {
    // (2/3) : (4/5) = (2/3) * (5/4) = 10/12 = 5/6
    const n1 = 2;
    const d1 = 3;
    const n2 = 4;
    const d2 = 5;
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ',
      question: `Υπολόγισε το πηλίκο σε ανάγωγο κλάσμα: (${htmlFrac(n1, d1)}) ： (${htmlFrac(n2, d2)})`,
      correctAnswer: '5/6',
      solution: `Πολλαπλασιάζουμε με τον αντίστροφο: (${htmlFrac(n1, d1)}) · (${htmlFrac(d2, n2)}) ＝ 10/12 ＝ ${htmlFrac(5, 6)} μετά από διαίρεση με το 2.`,
    };
  },

  // 2. Διαίρεση ομόσημων αρνητικών κλασμάτων (Input)
  () => {
    // (-3/4) : (-3/8) = (-3/4) * (-8/3) = +24/12 = 2
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΑ ΑΡΝΗΤΙΚΑ',
      question: `Υπολόγισε την τιμή του πηλίκου: (${htmlFrac(-3, 4)}) ： (${htmlFrac(-3, 8)})`,
      correctAnswer: '2',
      solution: `Το πηλίκο ομόσημων αρνητικών είναι θετικό: (${htmlFrac(3, 4)}) · (${htmlFrac(8, 3)}) ＝ 24/12 ＝ 2.`,
    };
  },

  // 3. Διαίρεση ετερόσημων κλασμάτων (Input)
  () => {
    // (5/6) : (-5/2) = (5/6) * (-2/5) = -10/30 = -1/3
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(5, 6)}) ： (${htmlFrac(-5, 2)})`,
      correctAnswer: '-1/3',
      solution: `Το πηλίκο ετερόσημων είναι αρνητικό: －(${htmlFrac(5, 6)}) · (${htmlFrac(2, 5)}) ＝ －10/30 ＝ ${htmlFrac(-1, 3)}.`,
    };
  },

  // 4. Σύνθετο κλάσμα σε απλό (Input)
  () => {
    // (1/2) / (3/4) = (1*4)/(2*3) = 4/6 = 2/3
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ',
      question: `Μετάτρεψε το σύνθετο κλάσμα σε απλό ανάγωγο: ${htmlCompoundFrac(1, 2, 3, 4)}`,
      correctAnswer: '2/3',
      solution: `Γινόμενο άκρων προς γινόμενο μέσων: (1 · 4) / (2 · 3) ＝ 4/6 ＝ ${htmlFrac(2, 3)}.`,
    };
  },

  // 5. Σύνθετο κλάσμα με αρνητικό όρο (Input)
  () => {
    // (-2/5) / (3/10) = (-2*10)/(5*3) = -20/15 = -4/3
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟ ΜΕ ΠΡΟΣΗΜΟ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: ${htmlCompoundFrac(-2, 5, 3, 10)}`,
      correctAnswer: '-4/3',
      solution: `Γινόμενο άκρων προς μέσων με αρνητικό πρόσημο: －(2 · 10) / (5 · 3) ＝ －20/15 ＝ ${htmlFrac(-4, 3)}.`,
    };
  },

  // 6. Διαίρεση με το 1 (Input)
  () => {
    const n = -7;
    const d = 9;
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 1',
      question: `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： 1`,
      correctAnswer: `${n}/${d}`,
      solution: `Κάθε αριθμός διαιρούμενος με το 1 ισούται με τον εαυτό του: ${htmlFrac(n, d)}.`,
    };
  },

  // 7. Διαίρεση με το -1 (Input)
  () => {
    const n = 4;
    const d = 5;
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ -1',
      question: `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (－1)`,
      correctAnswer: `-${n}/${d}`,
      solution: `Η διαίρεση με το －1 δίνει τον αντίθετο αριθμό: ${htmlFrac(-n, d)}.`,
    };
  },

  // 8. Διαίρεση του μηδενός (Input)
  () => {
    const d = randInt(5, 12);
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΤΟΥ 0',
      question: `Υπολόγισε το πηλίκο: 0 ： (${htmlFrac(3, d)})`,
      correctAnswer: '0',
      solution: `Το μηδέν διαιρούμενο με οποιονδήποτε μη μηδενικό αριθμό δίνει πάντοτε 0.`,
    };
  },

  // 9. Διαίρεση με το μηδέν (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΠΑΓΟΡΕΥΣΗ ΜΗΔΕΝΟΣ',
      question: `Ποιο είναι το αποτέλεσμα της πράξης: (${htmlFrac(5, 7)}) ： 0;`,
      options: makeUniqueOptions(
        'Είναι αδύνατη πράξη (δεν ορίζεται)',
        ['0', '1', `${htmlFrac(5, 7)}`]
      ),
      correctAnswer: 'Είναι αδύνατη πράξη (δεν ορίζεται)',
      solution: `Η διαίρεση με διαιρέτη το μηδέν είναι αδύνατη και δεν ορίζεται στα μαθηματικά.`,
    };
  },

  // 10. Διαίρεση ακεραίου με κλάσμα (Input)
  () => {
    // 6 : (2/3) = 6 * (3/2) = 18/2 = 9
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ',
      question: `Υπολόγισε την τιμή: 6 ： (${htmlFrac(2, 3)})`,
      correctAnswer: '9',
      solution: `6 · (${htmlFrac(3, 2)}) ＝ 18 / 2 ＝ 9.`,
    };
  },

  // 11. Διαίρεση κλάσματος με ακέραιο (Input)
  () => {
    // (4/5) : 2 = (4/5) * (1/2) = 4/10 = 2/5
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑ ΜΕ ΑΚΕΡΑΙΟ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(4, 5)}) ： 2`,
      correctAnswer: '2/5',
      solution: `(${htmlFrac(4, 5)}) · (${htmlFrac(1, 2)}) ＝ 4/10 ＝ ${htmlFrac(2, 5)}.`,
    };
  },

  // 12. Σύνθετο κλάσμα με ακέραιο στον αριθμητή (Input)
  () => {
    // 3 / (1/2) = 3 * 2 = 6
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟ ΜΕ ΑΚΕΡΑΙΟ',
      question: `Υπολόγισε την τιμή του σύνθετου κλάσματος με αριθμητή το 3 και παρονομαστή το ${htmlFrac(1, 2)}:`,
      correctAnswer: '6',
      solution: `3 ： (${htmlFrac(1, 2)}) ＝ 3 · 2 ＝ 6.`,
    };
  },

  // 13. Σύνθετο κλάσμα με ακέραιο στον παρονομαστή (Input)
  () => {
    // (1/3) / 4 = 1/12
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟ ΜΕ ΑΚΕΡΑΙΟ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα το σύνθετο κλάσμα με αριθμητή το ${htmlFrac(1, 3)} και παρονομαστή το 4:`,
      correctAnswer: '1/12',
      solution: `(${htmlFrac(1, 3)}) ： 4 ＝ (${htmlFrac(1, 3)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(1, 12)}.`,
    };
  },

  // 14. Διαίρεση ίσων αριθμών (Input)
  () => {
    const n = -5;
    const d = 8;
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΙΣΩΝ ΟΡΩΝ',
      question: `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (${htmlFrac(n, d)})`,
      correctAnswer: '1',
      solution: `Κάθε μη μηδενικός αριθμός διαιρούμενος με τον εαυτό του ισούται με 1.`,
    };
  },

  // 15. Διαίρεση αντίθετων αριθμών (Input)
  () => {
    const n = 3;
    const d = 7;
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΑΝΤΙΘΕΤΩΝ',
      question: `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (${htmlFrac(-n, d)})`,
      correctAnswer: '-1',
      solution: `Το πηλίκο δύο αντίθετων μη μηδενικών αριθμών ισούται πάντοτε με －1.`,
    };
  },

  // 16. Διαίρεση δεκαδικών αριθμών (Input)
  () => {
    // (-4.8) : 1.2 = -4
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ',
      question: `Υπολόγισε το πηλίκο: (－4,8) ： 1,2`,
      correctAnswer: '-4',
      solution: `Είναι ετερόσημοι, άρα το πηλίκο είναι αρνητικό: －(4,8 ： 1,2) ＝ －4.`,
    };
  },

  // 17. Κανόνας άκρων και μέσων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΣΥΝΘΕΤΩΝ',
      question: `Στο σύνθετο κλάσμα με αριθμητή α/β και παρονομαστή γ/δ, ποιοι είναι οι άκροι όροι;`,
      options: makeUniqueOptions(
        'Το α και το δ',
        ['Το β και το γ', 'Το α και το γ', 'Το β και το δ']
      ),
      correctAnswer: 'Το α και το δ',
      solution: `Άκροι όροι είναι ο αριθμητής του πάνω κλάσματος (α) και ο παρονομαστής του κάτω κλάσματος (δ).`,
    };
  },

  // 18. Διαίρεση με κλάσμα ανάποδα (Input)
  () => {
    // (7/9) : (7/3) = (7/9) * (3/7) = 3/9 = 1/3
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ ΣΤΗ ΔΙΑΙΡΕΣΗ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(7, 9)}) ： (${htmlFrac(7, 3)})`,
      correctAnswer: '1/3',
      solution: `(${htmlFrac(7, 9)}) · (${htmlFrac(3, 7)}) ＝ 3/9 ＝ ${htmlFrac(1, 3)}.`,
    };
  },

  // 19. Σύνθετο κλάσμα με ίσο αποτέλεσμα (Input)
  () => {
    // (2/3) / (2/3) = 1
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟ ΜΕ ΙΣΟΥΣ ΟΡΟΥΣ',
      question: `Υπολόγισε την τιμή: ${htmlCompoundFrac(2, 3, 2, 3)}`,
      correctAnswer: '1',
      solution: `Αριθμητής και παρονομαστής είναι ίσοι, άρα το αποτέλεσμα είναι 1.`,
    };
  },

  // 20. Διαίρεση δεκαδικού με το 0,1 (Input)
  () => {
    // 3.5 : 0.1 = 35
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 0,1',
      question: `Υπολόγισε το αποτέλεσμα: 3,5 ： 0,1`,
      correctAnswer: '35',
      solution: `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10: 3,5 · 10 ＝ 35.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΙΑΙΡΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Μοίρασμα χυμού σε ποτήρια
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Μια κανάτα περιέχει ${htmlFrac(3, 2)} του λίτρου χυμό (1,5 L). Πόσα ποτήρια χωρητικότητας ${htmlFrac(1, 4)} του λίτρου μπορούμε να γεμίσουμε;`,
      correctAnswer: '6',
      solution: `Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα κάθε ποτηριού: (${htmlFrac(3, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(3, 2)}) · 4 ＝ 12 / 2 ＝ 6 ποτήρια.`,
    };
  },

  // Πρόβλημα 2: Κοπή κορδέλας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Μια κορδέλα μήκους ${htmlFrac(15, 2)} μέτρων κόβεται σε κομμάτια μήκους ${htmlFrac(3, 4)} του μέτρου το καθένα. Πόσα κομμάτια θα προκύψουν;`,
      correctAnswer: '10',
      solution: `(${htmlFrac(15, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(15, 2)}) · (${htmlFrac(4, 3)}) ＝ 60 / 6 ＝ 10 κομμάτια.`,
    };
  },

  // Πρόβλημα 3: Υπολογισμός ταχύτητας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Ένας ποδηλάτης διένυσε 18 km σε ${htmlFrac(3, 4)} της ώρας. Ποια ήταν η μέση ταχύτητά του σε km/h;`,
      correctAnswer: '24',
      solution: `Ταχύτητα ＝ απόσταση ： χρόνος ＝ 18 ： (${htmlFrac(3, 4)}) ＝ 18 · (${htmlFrac(4, 3)}) ＝ 72 / 3 ＝ 24 km/h.`,
    };
  },

  // Πρόβλημα 4: Συσκευασία καφέ σε σακουλάκια
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Έχουμε ${htmlFrac(5, 2)} kg καφέ και θέλουμε να τα μοιράσουμε σε σακουλάκια του ${htmlFrac(1, 4)} του κιλού. Πόσα σακουλάκια θα γεμίσουν;`,
      correctAnswer: '10',
      solution: `(${htmlFrac(5, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(5, 2)}) · 4 ＝ 20 / 2 ＝ 10 σακουλάκια.`,
    };
  },

  // Πρόβλημα 5: Τιμή ανά κιλό
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Πληρώσαμε 6 € για ${htmlFrac(3, 4)} του κιλού τυρί. Πόσο κοστίζει το 1 κιλό τυρί σε ευρώ;`,
      correctAnswer: '8',
      solution: `6 ： (${htmlFrac(3, 4)}) ＝ 6 · (${htmlFrac(4, 3)}) ＝ 24 / 3 ＝ 8 €.`,
    };
  },

  // Πρόβλημα 6: Πλάτος ορθογωνίου από εμβαδόν
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο έχει εμβαδόν ${htmlFrac(4, 5)} τ.μ. και μήκος ${htmlFrac(2, 3)} του μέτρου. Ποιο είναι το πλάτος του σε μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '6/5',
      solution: `Πλάτος ＝ εμβαδόν ： μήκος ＝ (${htmlFrac(4, 5)}) ： (${htmlFrac(2, 3)}) ＝ (${htmlFrac(4, 5)}) · (${htmlFrac(3, 2)}) ＝ 12/10 ＝ ${htmlFrac(6, 5)} m.`,
    };
  },

  // Πρόβλημα 7: Χρόνος εκτέλεσης εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Ένα αυτόματο μηχάνημα χρειάζεται ${htmlFrac(1, 10)} της ώρας για να επεξεργαστεί 1 εξάρτημα. Πόσα εξαρτήματα θα ολοκληρώσει σε 3 ώρες;`,
      correctAnswer: '30',
      solution: `3 ： (${htmlFrac(1, 10)}) ＝ 3 · 10 ＝ 30 εξαρτήματα.`,
    };
  },

  // Πρόβλημα 8: Μοίρασμα πίτσας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Έχουν απομείνει τα ${htmlFrac(2, 3)} μιας πίτσας και πρέπει να μοιραστούν ισόποσα σε 4 παιδιά. Ποιο κλάσμα της αρχικής πίτσας θα πάρει κάθε παιδί (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/6',
      solution: `(${htmlFrac(2, 3)}) ： 4 ＝ (${htmlFrac(2, 3)}) · (${htmlFrac(1, 4)}) ＝ 2/12 ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // Πρόβλημα 9: Ρυθμός κατανάλωσης βενζίνης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Μια γεννήτρια καταναλώνει 0,4 λίτρα καυσίμου την ώρα. Πόσες ώρες μπορεί να λειτουργήσει συνεχόμενα με 6 λίτρα καυσίμου;`,
      correctAnswer: '15',
      solution: `6 ： 0,4 ＝ 60 ： 4 ＝ 15 ώρες.`,
    };
  },

  // Πρόβλημα 10: Δόσεις αποπληρωμής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα χρέος 450 € θα εξοφληθεί σε μηνιαίες δόσεις των 37,50 € η καθεμία. Σε πόσους μήνες θα εξοφληθεί;`,
      correctAnswer: '12',
      solution: `450 ： 37,5 ＝ 12 μήνες.`,
    };
  },

  // Πρόβλημα 11: Μήκος βήματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ',
      question: `Ένας μαθητής έκανε 40 ίδια βήματα και κάλυψε απόσταση 30 μέτρων. Ποιο είναι το μήκος του κάθε βήματος σε μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '3/4',
      solution: `30 ： 40 ＝ 30/40 ＝ ${htmlFrac(3, 4)} του μέτρου (0,75 m).`,
    };
  },

  // Πρόβλημα 12: Φόρτωση κιβωτίων σε φορτηγό
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα μικρό φορτηγό μπορεί να μεταφέρει 3 τόνους. Πόσα κιβώτια βάρους ${htmlFrac(3, 8)} του τόνου το καθένα μπορεί να φορτώσει;`,
      correctAnswer: '8',
      solution: `3 ： (${htmlFrac(3, 8)}) ＝ 3 · (${htmlFrac(8, 3)}) ＝ 8 κιβώτια.`,
    };
  },

  // Πρόβλημα 13: Δοσολογία φαρμάκου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΓΕΙΑ',
      question: `Ένα μπουκάλι σιρόπι περιέχει 120 ml. Αν κάθε κουταλάκι είναι 2,5 ml, πόσες δόσεις περιέχει συνολικά το μπουκάλι;`,
      correctAnswer: '48',
      solution: `120 ： 2,5 ＝ 48 δόσεις.`,
    };
  },

  // Πρόβλημα 14: Πάχος φύλλων βιβλίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα πακέτο 500 φύλλων χαρτιού έχει συνολικό πάχος 5 cm. Ποιο είναι το πάχος του 1 φύλλου σε cm (σε δεκαδική μορφή);`,
      correctAnswer: '0,01',
      solution: `5 ： 500 ＝ 0,01 cm.`,
    };
  },

  // Πρόβλημα 15: Μοίρασμα σύρματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Ένα σύρμα μήκους ${htmlFrac(7, 2)} μέτρων κόπηκε σε 7 ίσα κομμάτια. Ποιο είναι το μήκος κάθε κομματιού σε μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/2',
      solution: `(${htmlFrac(7, 2)}) ： 7 ＝ (${htmlFrac(7, 2)}) · (${htmlFrac(1, 7)}) ＝ ${htmlFrac(1, 2)} m.`,
    };
  },

  // Πρόβλημα 16: Ρυθμός πλήρωσης δεξαμενής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Μια βρύση γεμίζει ${htmlFrac(2, 5)} μιας δεξαμενής σε 4 ώρες. Ποιο κλάσμα της δεξαμενής γεμίζει σε 1 ώρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/10',
      solution: `(${htmlFrac(2, 5)}) ： 4 ＝ (${htmlFrac(2, 5)}) · (${htmlFrac(1, 4)}) ＝ 2/20 ＝ ${htmlFrac(1, 10)}.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος ανά άσκηση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένας μαθητής έλυσε 6 ασκήσεις σε ${htmlFrac(3, 2)} της ώρας (1,5 ώρα). Ποιο κλάσμα της ώρας αφιέρωσε κατά μέσο όρο σε κάθε άσκηση (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/4',
      solution: `(${htmlFrac(3, 2)}) ： 6 ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 6)}) ＝ 3/12 ＝ ${htmlFrac(1, 4)} της ώρας (15 λεπτά).`,
    };
  },

  // Πρόβλημα 18: Κατασκευή ραφιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΞΥΛΟΥΡΓΙΚΗ',
      question: `Ένα ξύλο μήκους ${htmlFrac(9, 2)} μέτρων κόβεται σε ράφια μήκους ${htmlFrac(3, 4)} του μέτρου. Πόσα ράφια θα φτιαχτούν;`,
      correctAnswer: '6',
      solution: `(${htmlFrac(9, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(9, 2)}) · (${htmlFrac(4, 3)}) ＝ 36 / 6 ＝ 6 ράφια.`,
    };
  },

  // Πρόβλημα 19: Κόστος ανά λίτρο ελαιολάδου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ένα δοχείο με 2,5 λίτρα λάδι κοστίζει 20 €. Πόσο κοστίζει το 1 λίτρο;`,
      correctAnswer: '8',
      solution: `20 ： 2,5 ＝ 8 €.`,
    };
  },

  // Πρόβλημα 20: Διάρκεια μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Μια συσκευή καταναλώνει 0,15 της μπαταρίας ανά ώρα συνεχούς χρήσης. Πόσες ώρες θα αντέξει μέχρι να εξαντληθεί πλήρως το 0,90 της μπαταρίας;`,
      correctAnswer: '6',
      solution: `0,90 ： 0,15 ＝ 6 ώρες.`,
    };
  },
];

export default function DiairesiRitonAsk() {
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
      title="Ασκήσεις: Διαίρεση Ρητών & Σύνθετα Κλάσματα | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στη διαίρεση ρητών αριθμών και τη μετατροπή σύνθετων κλασμάτων σε απλά για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/20-diairesi-riton"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 18 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Διαίρεση Ρητών & Σύνθετα Κλάσματα
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις/θεωρία διαίρεσης και σύνθετων κλασμάτων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. -4/3 ή 6"
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
