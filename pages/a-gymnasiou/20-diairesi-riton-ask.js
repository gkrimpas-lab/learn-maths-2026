import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων από τόνους με διατήρηση του Α'
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

// Helper για ασφαλή κατακόρυφη κλασματική γραφή σε HTML string
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${absNum}</span><span class="px-0.5 sm:px-1 pt-0.5 break-all">${absDen}</span></span></span>`;
};

// Helper για ασφαλή οπτική αναπαράσταση Σύνθετου Κλάσματος σε HTML string
const htmlCompoundFrac = (num1, den1, num2, den2, isNeg = false) => {
  return `<span class="inline-flex items-center gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full">${
    isNeg ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-1 px-1 border-b-2 border-amber-500 flex justify-center">${htmlFrac(
    num1,
    den1
  )}</span><span class="pt-1 px-1 flex justify-center">${htmlFrac(num2, den2)}</span></span></span>`;
};

// Μετατροπή απλού string (π.χ. "5/6" ή "-4/3") σε κατακόρυφο κλάσμα για το feedback
const renderCorrectAnswerVisual = (ans) => {
  if (typeof ans === 'string' && ans.includes('/')) {
    const isNeg = ans.startsWith('-');
    const clean = ans.replace(/^-/, '');
    const [num, den] = clean.split('/');
    if (num && den) {
      return htmlFrac(num, den, isNeg);
    }
  }
  return ans;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΔΙΑΙΡΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Απλή διαίρεση θετικών κλασμάτων (Input)
  (locale) => {
    const n1 = 2;
    const d1 = 3;
    const n2 = 4;
    const d2 = 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ' : 'FRACTION DIVISION',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο σε ανάγωγο κλάσμα: (${htmlFrac(n1, d1)}) ： (${htmlFrac(n2, d2)}) (μορφή α/β):`
        : `Calculate the quotient as an irreducible fraction: (${htmlFrac(n1, d1)}) ： (${htmlFrac(n2, d2)}) (form a/b):`,
      correctAnswer: '5/6',
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε με τον αντίστροφο: (${htmlFrac(n1, d1)}) · (${htmlFrac(d2, n2)}) ＝ ${htmlFrac(10, 12)} ＝ ${htmlFrac(5, 6)} μετά από απλοποίηση με το 2.`
        : `Multiply by the reciprocal: (${htmlFrac(n1, d1)}) · (${htmlFrac(d2, n2)}) ＝ ${htmlFrac(10, 12)} ＝ ${htmlFrac(5, 6)} after simplifying by 2.`,
    };
  },

  // 2. Διαίρεση ομόσημων αρνητικών κλασμάτων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΑ ΑΡΝΗΤΙΚΑ' : 'SAME SIGN NEGATIVES',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή του πηλίκου: (${htmlFrac(-3, 4)}) ： (${htmlFrac(-3, 8)})`
        : `Calculate the value of the quotient: (${htmlFrac(-3, 4)}) ： (${htmlFrac(-3, 8)})`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Το πηλίκο ομόσημων αρνητικών είναι θετικό: (${htmlFrac(3, 4)}) · (${htmlFrac(8, 3)}) ＝ ${htmlFrac(24, 12)} ＝ 2.`
        : `The quotient of same-sign negative numbers is positive: (${htmlFrac(3, 4)}) · (${htmlFrac(8, 3)}) ＝ ${htmlFrac(24, 12)} ＝ 2.`,
    };
  },

  // 3. Διαίρεση ετερόσημων κλασμάτων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΑ ΚΛΑΣΜΑΤΑ' : 'DIFFERENT SIGN FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(5, 6)}) ： (${htmlFrac(-5, 2)}) (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(5, 6)}) ： (${htmlFrac(-5, 2)}) (form a/b):`,
      correctAnswer: '-1/3',
      solution: locale === 'el'
        ? `Το πηλίκο ετερόσημων είναι αρνητικό: －(${htmlFrac(5, 6)}) · (${htmlFrac(2, 5)}) ＝ ${htmlFrac(-10, 30)} ＝ ${htmlFrac(-1, 3)}.`
        : `The quotient of different signs is negative: －(${htmlFrac(5, 6)}) · (${htmlFrac(2, 5)}) ＝ ${htmlFrac(-10, 30)} ＝ ${htmlFrac(-1, 3)}.`,
    };
  },

  // 4. Σύνθετο κλάσμα σε απλό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ' : 'COMPLEX FRACTION',
      question: locale === 'el'
        ? `Μετάτρεψε το σύνθετο κλάσμα σε απλό ανάγωγο: ${htmlCompoundFrac(1, 2, 3, 4)} (μορφή α/β):`
        : `Convert the complex fraction to an irreducible simple fraction: ${htmlCompoundFrac(1, 2, 3, 4)} (form a/b):`,
      correctAnswer: '2/3',
      solution: locale === 'el'
        ? `Γινόμενο άκρων προς γινόμενο μέσων: ${htmlFrac('1 · 4', '2 · 3')} ＝ ${htmlFrac(4, 6)} ＝ ${htmlFrac(2, 3)}.`
        : `Product of extremes over product of means: ${htmlFrac('1 · 4', '2 · 3')} ＝ ${htmlFrac(4, 6)} ＝ ${htmlFrac(2, 3)}.`,
    };
  },

  // 5. Σύνθετο κλάσμα με αρνητικό όρο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟ ΜΕ ΠΡΟΣΗΜΟ' : 'COMPLEX WITH SIGN',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: ${htmlCompoundFrac(-2, 5, 3, 10)} (μορφή α/β):`
        : `Calculate as an irreducible fraction: ${htmlCompoundFrac(-2, 5, 3, 10)} (form a/b):`,
      correctAnswer: '-4/3',
      solution: locale === 'el'
        ? `Γινόμενο άκρων προς μέσων με αρνητικό πρόσημο: －${htmlFrac('2 · 10', '5 · 3')} ＝ ${htmlFrac(-20, 15)} ＝ ${htmlFrac(-4, 3)}.`
        : `Product of extremes over means with negative sign: －${htmlFrac('2 · 10', '5 · 3')} ＝ ${htmlFrac(-20, 15)} ＝ ${htmlFrac(-4, 3)}.`,
    };
  },

  // 6. Διαίρεση με το 1 (Input)
  (locale) => {
    const n = -7;
    const d = 9;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 1' : 'DIVISION BY 1',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： 1 (μορφή α/β):`
        : `Calculate the quotient: (${htmlFrac(n, d)}) ： 1 (form a/b):`,
      correctAnswer: `${n}/${d}`,
      solution: locale === 'el'
        ? `Κάθε αριθμός διαιρούμενος με το 1 ισούται με τον εαυτό του: ${htmlFrac(n, d)}.`
        : `Any number divided by 1 is equal to itself: ${htmlFrac(n, d)}.`,
    };
  },

  // 7. Διαίρεση με το -1 (Input)
  (locale) => {
    const n = 4;
    const d = 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ -1' : 'DIVISION BY -1',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (－1) (μορφή α/β):`
        : `Calculate the quotient: (${htmlFrac(n, d)}) ： (－1) (form a/b):`,
      correctAnswer: `-${n}/${d}`,
      solution: locale === 'el'
        ? `Η διαίρεση με το －1 δίνει τον αντίθετο αριθμό: ${htmlFrac(-n, d)}.`
        : `Division by －1 gives the opposite number: ${htmlFrac(-n, d)}.`,
    };
  },

  // 8. Διαίρεση του μηδενός (Input)
  (locale) => {
    const d = randInt(5, 12);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΤΟΥ 0' : 'DIVISION OF 0',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: 0 ： (${htmlFrac(3, d)})`
        : `Calculate the quotient: 0 ： (${htmlFrac(3, d)})`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Το μηδέν διαιρούμενο με οποιονδήποτε μη μηδενικό αριθμό δίνει πάντοτε 0.`
        : `Zero divided by any non-zero number always equals 0.`,
    };
  },

  // 9. Διαίρεση με το μηδέν (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Είναι αδύνατη πράξη (δεν ορίζεται)'
      : 'It is impossible (undefined)';
    const wrongs = locale === 'el'
      ? ['0', '1', `${htmlFrac(5, 7)}`]
      : ['0', '1', `${htmlFrac(5, 7)}`];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΠΑΓΟΡΕΥΣΗ ΜΗΔΕΝΟΣ' : 'ZERO PROHIBITION',
      question: locale === 'el'
        ? `Ποιο είναι το αποτέλεσμα της πράξης: (${htmlFrac(5, 7)}) ： 0;`
        : `What is the result of: (${htmlFrac(5, 7)}) ： 0?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η διαίρεση με διαιρέτη το μηδέν είναι αδύνατη και δεν ορίζεται στα μαθηματικά.`
        : `Division by zero is impossible and undefined in mathematics.`,
    };
  },

  // 10. Διαίρεση ακεραίου με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ' : 'INTEGER BY FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 6 ： (${htmlFrac(2, 3)})`
        : `Calculate the value: 6 ： (${htmlFrac(2, 3)})`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `6 · (${htmlFrac(3, 2)}) ＝ ${htmlFrac(18, 2)} ＝ 9.`
        : `6 · (${htmlFrac(3, 2)}) ＝ ${htmlFrac(18, 2)} ＝ 9.`,
    };
  },

  // 11. Διαίρεση κλάσματος με ακέραιο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑ ΜΕ ΑΚΕΡΑΙΟ' : 'FRACTION BY INTEGER',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(4, 5)}) ： 2 (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(4, 5)}) ： 2 (form a/b):`,
      correctAnswer: '2/5',
      solution: locale === 'el'
        ? `(${htmlFrac(4, 5)}) · (${htmlFrac(1, 2)}) ＝ ${htmlFrac(4, 10)} ＝ ${htmlFrac(2, 5)}.`
        : `(${htmlFrac(4, 5)}) · (${htmlFrac(1, 2)}) ＝ ${htmlFrac(4, 10)} ＝ ${htmlFrac(2, 5)}.`,
    };
  },

  // 12. Σύνθετο κλάσμα με ακέραιο στον αριθμητή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟ ΜΕ ΑΚΕΡΑΙΟ' : 'COMPLEX WITH INTEGER',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή του σύνθετου κλάσματος με αριθμητή το 3 και παρονομαστή το ${htmlFrac(1, 2)}:`
        : `Calculate the value of the complex fraction with numerator 3 and denominator ${htmlFrac(1, 2)}:`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `3 ： (${htmlFrac(1, 2)}) ＝ 3 · 2 ＝ 6.`
        : `3 ： (${htmlFrac(1, 2)}) ＝ 3 · 2 ＝ 6.`,
    };
  },

  // 13. Σύνθετο κλάσμα με ακέραιο στον παρονομαστή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟ ΜΕ ΑΚΕΡΑΙΟ' : 'COMPLEX WITH INTEGER',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα το σύνθετο κλάσμα με αριθμητή το ${htmlFrac(1, 3)} και παρονομαστή το 4 (μορφή α/β):`
        : `Calculate as an irreducible fraction the complex fraction with numerator ${htmlFrac(1, 3)} and denominator 4 (form a/b):`,
      correctAnswer: '1/12',
      solution: locale === 'el'
        ? `(${htmlFrac(1, 3)}) ： 4 ＝ (${htmlFrac(1, 3)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(1, 12)}.`
        : `(${htmlFrac(1, 3)}) ： 4 ＝ (${htmlFrac(1, 3)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(1, 12)}.`,
    };
  },

  // 14. Διαίρεση ίσων αριθμών (Input)
  (locale) => {
    const n = -5;
    const d = 8;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΙΣΩΝ ΟΡΩΝ' : 'DIVISION OF EQUAL TERMS',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (${htmlFrac(n, d)})`
        : `Calculate the quotient: (${htmlFrac(n, d)}) ： (${htmlFrac(n, d)})`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Κάθε μη μηδενικός αριθμός διαιρούμενος με τον εαυτό του ισούται με 1.`
        : `Any non-zero number divided by itself equals 1.`,
    };
  },

  // 15. Διαίρεση αντίθετων αριθμών (Input)
  (locale) => {
    const n = 3;
    const d = 7;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΑΝΤΙΘΕΤΩΝ' : 'DIVISION OF OPPOSITES',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: (${htmlFrac(n, d)}) ： (${htmlFrac(-n, d)})`
        : `Calculate the quotient: (${htmlFrac(n, d)}) ： (${htmlFrac(-n, d)})`,
      correctAnswer: '-1',
      solution: locale === 'el'
        ? `Το πηλίκο δύο αντίθετων μη μηδενικών αριθμών ισούται πάντοτε με －1.`
        : `The quotient of two opposite non-zero numbers is always －1.`,
    };
  },

  // 16. Διαίρεση δεκαδικών αριθμών (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ' : 'DECIMAL DIVISION',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο: (－4,8) ： 1,2`
        : `Calculate the quotient: (－4.8) ： 1.2`,
      correctAnswer: '-4',
      solution: locale === 'el'
        ? `Είναι ετερόσημοι, άρα το πηλίκο είναι αρνητικό: －(4,8 ： 1,2) ＝ －4.`
        : `They have different signs, so the quotient is negative: －(4.8 ： 1.2) ＝ －4.`,
    };
  },

  // 17. Κανόνας άκρων και μέσων (MCQ)
  (locale) => {
    const correct = locale === 'el' ? 'Το α και το δ' : 'a and d';
    const wrongs = locale === 'el'
      ? ['Το β και το γ', 'Το α και το γ', 'Το β και το δ']
      : ['b and c', 'a and c', 'b and d'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ ΣΥΝΘΕΤΩΝ' : 'COMPLEX FRACTION THEORY',
      question: locale === 'el'
        ? `Στο σύνθετο κλάσμα με αριθμητή ${htmlFrac('α', 'β')} και παρονομαστή ${htmlFrac('γ', 'δ')}, ποιοι είναι οι άκροι όροι;`
        : `In a complex fraction with numerator ${htmlFrac('a', 'b')} and denominator ${htmlFrac('c', 'd')}, which are the extreme terms?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Άκροι όροι είναι ο αριθμητής του πάνω κλάσματος (α) και ο παρονομαστής του κάτω κλάσματος (δ).`
        : `The extreme terms are the numerator of the top fraction (a) and the denominator of the bottom fraction (d).`,
    };
  },

  // 18. Διαίρεση με κλάσμα ανάποδα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ ΣΤΗ ΔΙΑΙΡΕΣΗ' : 'SIMPLIFICATION IN DIVISION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(7, 9)}) ： (${htmlFrac(7, 3)}) (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(7, 9)}) ： (${htmlFrac(7, 3)}) (form a/b):`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `(${htmlFrac(7, 9)}) · (${htmlFrac(3, 7)}) ＝ ${htmlFrac(3, 9)} ＝ ${htmlFrac(1, 3)}.`
        : `(${htmlFrac(7, 9)}) · (${htmlFrac(3, 7)}) ＝ ${htmlFrac(3, 9)} ＝ ${htmlFrac(1, 3)}.`,
    };
  },

  // 19. Σύνθετο κλάσμα με ίσο αποτέλεσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟ ΜΕ ΙΣΟΥΣ ΟΡΟΥΣ' : 'COMPLEX WITH EQUAL TERMS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: ${htmlCompoundFrac(2, 3, 2, 3)}`
        : `Calculate the value: ${htmlCompoundFrac(2, 3, 2, 3)}`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Αριθμητής και παρονομαστής είναι ίσοι, άρα το αποτέλεσμα είναι 1.`
        : `Numerator and denominator are equal, so the result is 1.`,
    };
  },

  // 20. Διαίρεση δεκαδικού με το 0,1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 0,1' : 'DIVISION BY 0.1',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: 3,5 ： 0,1`
        : `Calculate the result: 3.5 ： 0.1`,
      correctAnswer: '35',
      solution: locale === 'el'
        ? `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10: 3,5 · 10 ＝ 35.`
        : `Division by 0.1 is equivalent to multiplying by 10: 3.5 · 10 ＝ 35.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΙΑΙΡΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Μοίρασμα χυμού σε ποτήρια
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Μια κανάτα περιέχει ${htmlFrac(3, 2)} του λίτρου χυμό (1,5 L). Πόσα ποτήρια χωρητικότητας ${htmlFrac(1, 4)} του λίτρου μπορούμε να γεμίσουμε;`
        : `A pitcher contains ${htmlFrac(3, 2)} liters of juice (1.5 L). How many glasses with a capacity of ${htmlFrac(1, 4)} liters can we fill?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα κάθε ποτηριού: (${htmlFrac(3, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(3, 2)}) · 4 ＝ ${htmlFrac(12, 2)} ＝ 6 ποτήρια.`
        : `Divide total quantity by each glass capacity: (${htmlFrac(3, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(3, 2)}) · 4 ＝ ${htmlFrac(12, 2)} ＝ 6 glasses.`,
    };
  },

  // Πρόβλημα 2: Κοπή κορδέλας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Μια κορδέλα μήκους ${htmlFrac(15, 2)} μέτρων κόβεται σε κομμάτια μήκους ${htmlFrac(3, 4)} του μέτρου το καθένα. Πόσα κομμάτια θα προκύψουν;`
        : `A ribbon of length ${htmlFrac(15, 2)} meters is cut into pieces of length ${htmlFrac(3, 4)} meters each. How many pieces will there be?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `(${htmlFrac(15, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(15, 2)}) · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(60, 6)} ＝ 10 κομμάτια.`
        : `(${htmlFrac(15, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(15, 2)}) · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(60, 6)} ＝ 10 pieces.`,
    };
  },

  // Πρόβλημα 3: Υπολογισμός ταχύτητας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Ένας ποδηλάτης διένυσε 18 km σε ${htmlFrac(3, 4)} της ώρας. Ποια ήταν η μέση ταχύτητά του σε km/h;`
        : `A cyclist traveled 18 km in ${htmlFrac(3, 4)} of an hour. What was their average speed in km/h?`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `Ταχύτητα ＝ απόσταση ： χρόνος ＝ 18 ： (${htmlFrac(3, 4)}) ＝ 18 · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(72, 3)} ＝ 24 km/h.`
        : `Speed ＝ distance ： time ＝ 18 ： (${htmlFrac(3, 4)}) ＝ 18 · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(72, 3)} ＝ 24 km/h.`,
    };
  },

  // Πρόβλημα 4: Συσκευασία καφέ σε σακουλάκια
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Έχουμε ${htmlFrac(5, 2)} kg καφέ και θέλουμε να τα μοιράσουμε σε σακουλάκια του ${htmlFrac(1, 4)} του κιλού. Πόσα σακουλάκια θα γεμίσουν;`
        : `We have ${htmlFrac(5, 2)} kg of coffee and want to pack it into bags of ${htmlFrac(1, 4)} kg each. How many bags will be filled?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `(${htmlFrac(5, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(5, 2)}) · 4 ＝ ${htmlFrac(20, 2)} ＝ 10 σακουλάκια.`
        : `(${htmlFrac(5, 2)}) ： (${htmlFrac(1, 4)}) ＝ (${htmlFrac(5, 2)}) · 4 ＝ ${htmlFrac(20, 2)} ＝ 10 bags.`,
    };
  },

  // Πρόβλημα 5: Τιμή ανά κιλό
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: ECONOMICS',
      question: locale === 'el'
        ? `Πληρώσαμε 6 € για ${htmlFrac(3, 4)} του κιλού τυρί. Πόσο κοστίζει το 1 κιλό τυρί σε ευρώ;`
        : `We paid 6 € for ${htmlFrac(3, 4)} kg of cheese. How much does 1 kg of cheese cost in euros?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `6 ： (${htmlFrac(3, 4)}) ＝ 6 · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(24, 3)} ＝ 8 €.`
        : `6 ： (${htmlFrac(3, 4)}) ＝ 6 · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(24, 3)} ＝ 8 €.`,
    };
  },

  // Πρόβλημα 6: Πλάτος ορθογωνίου από εμβαδόν
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα ορθογώνιο έχει εμβαδόν ${htmlFrac(4, 5)} τ.μ. και μήκος ${htmlFrac(2, 3)} του μέτρου. Ποιο είναι το πλάτος του σε μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A rectangle has an area of ${htmlFrac(4, 5)} m² and a length of ${htmlFrac(2, 3)} meters. What is its width in meters (irreducible fraction a/b)?`,
      correctAnswer: '6/5',
      solution: locale === 'el'
        ? `Πλάτος ＝ εμβαδόν ： μήκος ＝ (${htmlFrac(4, 5)}) ： (${htmlFrac(2, 3)}) ＝ (${htmlFrac(4, 5)}) · (${htmlFrac(3, 2)}) ＝ ${htmlFrac(12, 10)} ＝ ${htmlFrac(6, 5)} m.`
        : `Width ＝ area ： length ＝ (${htmlFrac(4, 5)}) ： (${htmlFrac(2, 3)}) ＝ (${htmlFrac(4, 5)}) · (${htmlFrac(3, 2)}) ＝ ${htmlFrac(12, 10)} ＝ ${htmlFrac(6, 5)} m.`,
    };
  },

  // Πρόβλημα 7: Χρόνος εκτέλεσης εργασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: WORK',
      question: locale === 'el'
        ? `Ένα αυτόματο μηχάνημα χρειάζεται ${htmlFrac(1, 10)} της ώρας για να επεξεργαστεί 1 εξάρτημα. Πόσα εξαρτήματα θα ολοκληρώσει σε 3 ώρες;`
        : `An automated machine needs ${htmlFrac(1, 10)} of an hour to process 1 part. How many parts will it complete in 3 hours?`,
      correctAnswer: '30',
      solution: locale === 'el'
        ? `3 ： (${htmlFrac(1, 10)}) ＝ 3 · 10 ＝ 30 εξαρτήματα.`
        : `3 ： (${htmlFrac(1, 10)}) ＝ 3 · 10 ＝ 30 parts.`,
    };
  },

  // Πρόβλημα 8: Μοίρασμα πίτσας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: SHARING',
      question: locale === 'el'
        ? `Έχουν απομείνει τα ${htmlFrac(2, 3)} μιας πίτσας και πρέπει να μοιραστούν ισόποσα σε 4 παιδιά. Ποιο κλάσμα της αρχικής πίτσας θα πάρει κάθε παιδί (σε ανάγωγο κλάσμα α/β);`
        : `There is ${htmlFrac(2, 3)} of a pizza left and it must be shared equally among 4 children. What fraction of the original pizza will each child get (irreducible fraction a/b)?`,
      correctAnswer: '1/6',
      solution: locale === 'el'
        ? `(${htmlFrac(2, 3)}) ： 4 ＝ (${htmlFrac(2, 3)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(2, 12)} ＝ ${htmlFrac(1, 6)}.`
        : `(${htmlFrac(2, 3)}) ： 4 ＝ (${htmlFrac(2, 3)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(2, 12)} ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // Πρόβλημα 9: Ρυθμός κατανάλωσης βενζίνης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Μια γεννήτρια καταναλώνει 0,4 λίτρα καυσίμου την ώρα. Πόσες ώρες μπορεί να λειτουργήσει συνεχόμενα με 6 λίτρα καυσίμου;`
        : `A generator consumes 0.4 liters of fuel per hour. How many hours can it run continuously with 6 liters of fuel?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `6 ： 0,4 ＝ 60 ： 4 ＝ 15 ώρες.`
        : `6 ： 0.4 ＝ 60 ： 4 ＝ 15 hours.`,
    };
  },

  // Πρόβλημα 10: Δόσεις αποπληρωμής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένα χρέος 450 € θα εξοφληθεί σε μηνιαίες δόσεις των 37,50 € η καθεμία. Σε πόσους μήνες θα εξοφληθεί;`
        : `A debt of 450 € will be repaid in monthly installments of 37.50 € each. In how many months will it be paid off?`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `450 ： 37,5 ＝ 12 μήνες.`
        : `450 ： 37.5 ＝ 12 months.`,
    };
  },

  // Πρόβλημα 11: Μήκος βήματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ' : 'PROBLEMS: DISTANCES',
      question: locale === 'el'
        ? `Ένας μαθητής έκανε 40 ίδια βήματα και κάλυψε απόσταση 30 μέτρων. Ποιο είναι το μήκος του κάθε βήματος σε μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A student took 40 equal steps and covered a distance of 30 meters. What is the length of each step in meters (irreducible fraction a/b)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `30 ： 40 ＝ ${htmlFrac(30, 40)} ＝ ${htmlFrac(3, 4)} του μέτρου (0,75 m).`
        : `30 ： 40 ＝ ${htmlFrac(30, 40)} ＝ ${htmlFrac(3, 4)} meters (0.75 m).`,
    };
  },

  // Πρόβλημα 12: Φόρτωση κιβωτίων σε φορτηγό
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORT',
      question: locale === 'el'
        ? `Ένα μικρό φορτηγό μπορεί να μεταφέρει 3 τόνους. Πόσα κιβώτια βάρους ${htmlFrac(3, 8)} του τόνου το καθένα μπορεί να φορτώσει;`
        : `A small truck can carry 3 tons. How many boxes weighing ${htmlFrac(3, 8)} of a ton each can it load?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `3 ： (${htmlFrac(3, 8)}) ＝ 3 · (${htmlFrac(8, 3)}) ＝ 8 κιβώτια.`
        : `3 ： (${htmlFrac(3, 8)}) ＝ 3 · (${htmlFrac(8, 3)}) ＝ 8 boxes.`,
    };
  },

  // Πρόβλημα 13: Δοσολογία φαρμάκου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΓΕΙΑ' : 'PROBLEMS: HEALTH',
      question: locale === 'el'
        ? `Ένα μπουκάλι σιρόπι περιέχει 120 ml. Αν κάθε κουταλάκι είναι 2,5 ml, πόσες δόσεις περιέχει συνολικά το μπουκάλι;`
        : `A bottle of syrup contains 120 ml. If each teaspoon is 2.5 ml, how many doses does the bottle contain in total?`,
      correctAnswer: '48',
      solution: locale === 'el'
        ? `120 ： 2,5 ＝ 48 δόσεις.`
        : `120 ： 2.5 ＝ 48 doses.`,
    };
  },

  // Πρόβλημα 14: Πάχος φύλλων βιβλίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Ένα πακέτο 500 φύλλων χαρτιού έχει συνολικό πάχος 5 cm. Ποιο είναι το πάχος του 1 φύλλου σε cm (σε δεκαδική μορφή);`
        : `A pack of 500 sheets of paper has a total thickness of 5 cm. What is the thickness of 1 sheet in cm (in decimal form)?`,
      correctAnswer: locale === 'el' ? '0,01' : '0.01',
      solution: locale === 'el'
        ? `5 ： 500 ＝ 0,01 cm.`
        : `5 ： 500 ＝ 0.01 cm.`,
    };
  },

  // Πρόβλημα 15: Μοίρασμα σύρματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Ένα σύρμα μήκους ${htmlFrac(7, 2)} μέτρων κόπηκε σε 7 ίσα κομμάτια. Ποιο είναι το μήκος κάθε κομματιού σε μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A wire of length ${htmlFrac(7, 2)} meters is cut into 7 equal pieces. What is the length of each piece in meters (irreducible fraction a/b)?`,
      correctAnswer: '1/2',
      solution: locale === 'el'
        ? `(${htmlFrac(7, 2)}) ： 7 ＝ (${htmlFrac(7, 2)}) · (${htmlFrac(1, 7)}) ＝ ${htmlFrac(1, 2)} m.`
        : `(${htmlFrac(7, 2)}) ： 7 ＝ (${htmlFrac(7, 2)}) · (${htmlFrac(1, 7)}) ＝ ${htmlFrac(1, 2)} m.`,
    };
  },

  // Πρόβλημα 16: Ρυθμός πλήρωσης δεξαμενής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'PROBLEMS: PLUMBING',
      question: locale === 'el'
        ? `Μια βρύση γεμίζει ${htmlFrac(2, 5)} μιας δεξαμενής σε 4 ώρες. Ποιο κλάσμα της δεξαμενής γεμίζει σε 1 ώρα (σε ανάγωγο κλάσμα α/β);`
        : `A faucet fills ${htmlFrac(2, 5)} of a tank in 4 hours. What fraction of the tank does it fill in 1 hour (irreducible fraction a/b)?`,
      correctAnswer: '1/10',
      solution: locale === 'el'
        ? `(${htmlFrac(2, 5)}) ： 4 ＝ (${htmlFrac(2, 5)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(2, 20)} ＝ ${htmlFrac(1, 10)}.`
        : `(${htmlFrac(2, 5)}) ： 4 ＝ (${htmlFrac(2, 5)}) · (${htmlFrac(1, 4)}) ＝ ${htmlFrac(2, 20)} ＝ ${htmlFrac(1, 10)}.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος ανά άσκηση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ένας μαθητής έλυσε 6 ασκήσεις σε ${htmlFrac(3, 2)} της ώρας (1,5 ώρα). Ποιο κλάσμα της ώρας αφιέρωσε κατά μέσο όρο σε κάθε άσκηση (σε ανάγωγο κλάσμα α/β);`
        : `A student solved 6 exercises in ${htmlFrac(3, 2)} of an hour (1.5 hours). What fraction of an hour was spent on average per exercise (irreducible fraction a/b)?`,
      correctAnswer: '1/4',
      solution: locale === 'el'
        ? `(${htmlFrac(3, 2)}) ： 6 ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 6)}) ＝ ${htmlFrac(3, 12)} ＝ ${htmlFrac(1, 4)} της ώρας (15 λεπτά).`
        : `(${htmlFrac(3, 2)}) ： 6 ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 6)}) ＝ ${htmlFrac(3, 12)} ＝ ${htmlFrac(1, 4)} of an hour (15 minutes).`,
    };
  },

  // Πρόβλημα 18: Κατασκευή ραφιών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΞΥΛΟΥΡΓΙΚΗ' : 'PROBLEMS: WOODWORKING',
      question: locale === 'el'
        ? `Ένα ξύλο μήκους ${htmlFrac(9, 2)} μέτρων κόβεται σε ράφια μήκους ${htmlFrac(3, 4)} του μέτρου. Πόσα ράφια θα φτιαχτούν;`
        : `A wooden plank of length ${htmlFrac(9, 2)} meters is cut into shelves of length ${htmlFrac(3, 4)} meters each. How many shelves will be made?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `(${htmlFrac(9, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(9, 2)}) · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(36, 6)} ＝ 6 ράφια.`
        : `(${htmlFrac(9, 2)}) ： (${htmlFrac(3, 4)}) ＝ (${htmlFrac(9, 2)}) · (${htmlFrac(4, 3)}) ＝ ${htmlFrac(36, 6)} ＝ 6 shelves.`,
    };
  },

  // Πρόβλημα 19: Κόστος ανά λίτρο ελαιολάδου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Ένα δοχείο με 2,5 λίτρα λάδι κοστίζει 20 €. Πόσο κοστίζει το 1 λίτρο σε ευρώ;`
        : `A container with 2.5 liters of olive oil costs 20 €. How much does 1 liter cost in euros?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `20 ： 2,5 ＝ 8 €.`
        : `20 ： 2.5 ＝ 8 €.`,
    };
  },

  // Πρόβλημα 20: Διάρκεια μπαταρίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Μια συσκευή καταναλώνει 0,15 της μπαταρίας ανά ώρα συνεχούς χρήσης. Πόσες ώρες θα αντέξει μέχρι να εξαντληθεί πλήρως το 0,90 της μπαταρίας;`
        : `A device uses 0.15 of its battery per hour of continuous use. How many hours will it last until 0.90 of the battery is fully drained?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `0,90 ： 0,15 ＝ 6 ώρες.`
        : `0.90 ： 0.15 ＝ 6 hours.`,
    };
  },
];

export default function DiairesiRitonAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Διαίρεση Ρητών & Σύνθετα Κλάσματα | Α' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στη διαίρεση ρητών αριθμών και τη μετατροπή σύνθετων κλασμάτων σε απλά για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 18 • ΕΞΑΣΚΗΣΗ",
      mainTitle: "Διαίρεση Ρητών & Σύνθετα Κλάσματα",
      mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις/θεωρία διαίρεσης και σύνθετων κλασμάτων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
      problemBadge: "ΠΡΟΒΛΗΜΑ",
      placeholderInput: "π.χ. -4/3 ή 6",
      labelCorrect: "ΣΩΣΤΟ",
      labelWrong: "ΛΑΘΟΣ",
      correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
      btnCheck: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      btnNew: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      btnRetry: "ΕΠΑΝΑΛΗΨΗ",
      finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
      progress: "ΠΡΟΟΔΟΣ",
      successRate: "ΕΠΙΤΥΧΙΑ"
    },
    en: {
      pageTitle: "Exercises: Division of Rational Numbers & Complex Fractions | 7th Grade",
      pageDesc: "12 dynamic exercises and problems on division of rational numbers and converting complex fractions into simple fractions for 7th Grade.",
      backText: "7th Grade",
      btnTheory: "THEORY",
      badgeHeader: "7TH GRADE • CHAPTER 18 • PRACTICE",
      mainTitle: "Division of Rational Numbers & Complex Fractions",
      mainSubtitle: "Solve the 12 selected exercises below (10 division/complex fraction operations/theory ＋ 2 real-world problems). Click 'CHECK ANSWERS' at the end to see your score and detailed solutions.",
      problemBadge: "PROBLEM",
      placeholderInput: "e.g. -4/3 or 6",
      labelCorrect: "CORRECT",
      labelWrong: "WRONG",
      correctAnswerLabel: "CORRECT ANSWER:",
      btnCheck: "CHECK ANSWERS",
      btnNew: "NEW EXERCISES",
      btnRetry: "RETRY",
      finalScore: "FINAL SCORE",
      progress: "PROGRESS",
      successRate: "SUCCESS"
    }
  }[locale];

  // Παραγωγή: 10 ασκήσεις υπολογισμών/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(locale),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
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
    let clean = val;
    if (locale === 'el') {
      clean = clean.replace(/\./g, ',');
      clean = clean.replace(/[^0-9,/,-]/g, '');
      const commaCount = (clean.match(/,/g) || []).length;
      if (commaCount > 1) return;
    } else {
      clean = clean.replace(/,/g, '.');
      clean = clean.replace(/[^0-9./,-]/g, '');
      const dotCount = (clean.match(/\./g) || []).length;
      if (dotCount > 1) return;
    }

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

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
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (locale === 'el') {
        userAns = userAns.replace(/\./g, ',');
        correctAns = correctAns.replace(/\./g, ',');
      } else {
        userAns = userAns.replace(/,/g, '.');
        correctAns = correctAns.replace(/,/g, '.');
      }

      // Ανοχή 0.05 σε δεκαδικούς ελέγχους
      const userNum = parseFloat(userAns.replace(',', '.'));
      const correctNum = parseFloat(correctAns.replace(',', '.'));

      if (!isNaN(userNum) && !isNaN(correctNum) && !userAns.includes('/') && !correctAns.includes('/')) {
        if (Math.abs(userNum - correctNum) < 0.05) {
          totalCorrect += 1;
          return;
        }
      }

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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/20-diairesi-riton"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {toCleanUppercase(t.mainTitle)}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              let cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              let cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');

              if (locale === 'el') {
                cleanUser = cleanUser.replace(/\./g, ',');
                cleanCorrect = cleanCorrect.replace(/\./g, ',');
              } else {
                cleanUser = cleanUser.replace(/,/g, '.');
                cleanCorrect = cleanCorrect.replace(/,/g, '.');
              }

              const userNum = parseFloat(cleanUser.replace(',', '.'));
              const correctNum = parseFloat(cleanCorrect.replace(',', '.'));

              let isCorrect = false;
              if (isSubmitted) {
                if (!isNaN(userNum) && !isNaN(correctNum) && !cleanUser.includes('/') && !cleanCorrect.includes('/')) {
                  isCorrect = Math.abs(userNum - correctNum) < 0.05;
                } else {
                  isCorrect = cleanUser === cleanCorrect;
                }
              }

              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
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
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm shrink-0 ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded break-words">
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md break-words">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs w-full">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
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
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span className="break-words whitespace-normal leading-snug flex-1" dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="shrink-0">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border min-w-0 ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.labelCorrect)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.labelWrong)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block break-words max-w-full">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1 inline-flex items-center flex-wrap"
                                dangerouslySetInnerHTML={{ __html: renderCorrectAnswerVisual(q.correctAnswer) }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60 break-words"
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
                <span>{toCleanUppercase(t.btnCheck)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNew)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.finalScore : t.progress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRate)}
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
              <span className="hidden sm:inline">{toCleanUppercase(t.btnNew)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheck)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.btnRetry)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}