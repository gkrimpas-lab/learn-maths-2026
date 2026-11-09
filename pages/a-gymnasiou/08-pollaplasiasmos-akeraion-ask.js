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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ (i18n)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Γινόμενο δύο θετικών (Input)
  (locale) => {
    const a = randInt(3, 9);
    const b = randInt(4, 11);
    const ans = a * b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SAME SIGN NUMBERS' : 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the product: (＋${a}) · (＋${b})`
          : `Υπολόγισε το γινόμενο: (＋${a}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Same sign positive numbers: (＋) · (＋) ＝ ＋. Therefore ＋(${a} · ${b}) ＝ ＋${ans}.`
          : `Ομόσημοι θετικοί αριθμοί: (＋) · (＋) ＝ ＋. Επομένως ＋(${a} · ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Γινόμενο δύο αρνητικών (Input)
  (locale) => {
    const a = randInt(3, 8);
    const b = randInt(4, 9);
    const ans = a * b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SAME SIGN NUMBERS' : 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (－${b})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Same sign negative numbers: (－) · (－) ＝ ＋. Therefore ＋(${a} · ${b}) ＝ ＋${ans}.`
          : `Ομόσημοι αρνητικοί αριθμοί: (－) · (－) ＝ ＋. Επομένως ＋(${a} · ${b}) ＝ ＋${ans}.`,
    };
  },

  // 3. Γινόμενο θετικού επί αρνητικό (Input)
  (locale) => {
    const a = randInt(3, 9);
    const b = randInt(4, 8);
    const ans = -(a * b);
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGN NUMBERS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the product: (＋${a}) · (－${b})`
          : `Υπολόγισε το γινόμενο: (＋${a}) · (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Different signs: (＋) · (－) ＝ －. Therefore －(${a} · ${b}) ＝ ${ans}.`
          : `Ετερόσημοι αριθμοί: (＋) · (－) ＝ －. Επομένως －(${a} · ${b}) ＝ ${ans}.`,
    };
  },

  // 4. Γινόμενο αρνητικού επί θετικό (Input)
  (locale) => {
    const a = randInt(4, 9);
    const b = randInt(3, 8);
    const ans = -(a * b);
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGN NUMBERS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (＋${b})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Different signs: (－) · (＋) ＝ －. Therefore －(${a} · ${b}) ＝ ${ans}.`
          : `Ετερόσημοι αριθμοί: (－) · (＋) ＝ －. Επομένως －(${a} · ${b}) ＝ ${ans}.`,
    };
  },

  // 5. Πολλαπλασιασμός με το μηδέν (Input)
  (locale) => {
    const a = randInt(12, 85);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ZERO ELEMENT' : 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · 0`
          : `Υπολόγισε το γινόμενο: (－${a}) · 0`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'Zero is the absorbing element of multiplication: any integer times 0 equals 0.'
          : 'Το μηδέν είναι το μηδενικό στοιχείο του πολλαπλασιασμού: κάθε αριθμός επί 0 ισούται με 0.',
    };
  },

  // 6. Πολλαπλασιασμός με το ＋1 (Input)
  (locale) => {
    const a = randInt(15, 60);
    return {
      type: 'input',
      topic: locale === 'en' ? 'IDENTITY ELEMENT' : 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (＋1)`
          : `Υπολόγισε το γινόμενο: (－${a}) · (＋1)`,
      correctAnswer: `-${a}`,
      solution:
        locale === 'en'
          ? `＋1 is the multiplicative identity: (－${a}) · (＋1) ＝ －${a}.`
          : `Το ＋1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού: (－${a}) · (＋1) ＝ －${a}.`,
    };
  },

  // 7. Πολλαπλασιασμός με το －1 (Input)
  (locale) => {
    const a = randInt(14, 55);
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTIPLICATION BY -1' : 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question:
        locale === 'en'
          ? `Calculate the product: (＋${a}) · (－1)`
          : `Υπολόγισε το γινόμενο: (＋${a}) · (－1)`,
      correctAnswer: `-${a}`,
      solution:
        locale === 'en'
          ? `Multiplying any number by －1 always yields its opposite: (＋${a}) · (－1) ＝ －${a}.`
          : `Ο πολλαπλασιασμός ενός αριθμού με το －1 δίνει πάντοτε τον αντίθετό του: (＋${a}) · (－1) ＝ －${a}.`,
    };
  },

  // 8. Πολλαπλασιασμός αρνητικού με το －1 (Input)
  (locale) => {
    const a = randInt(12, 70);
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTIPLICATION BY -1' : 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (－1)`
          : `Υπολόγισε το γινόμενο: (－${a}) · (－1)`,
      correctAnswer: a.toString(),
      solution:
        locale === 'en'
          ? `(－) · (－) ＝ ＋. Therefore (－${a}) · (－1) ＝ ＋${a}.`
          : `(－) · (－) ＝ ＋. Επομένως (－${a}) · (－1) ＝ ＋${a}.`,
    };
  },

  // 9. Γινόμενο τριών παραγόντων με 2 αρνητικούς (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 5);
    const c = randInt(2, 3);
    const ans = a * b * c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTI-TERM PRODUCT' : 'ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΟΡΩΝ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (＋${b}) · (－${c})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (＋${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `There are 2 negative factors (even count), so the product is positive (＋): ＋(${a} · ${b} · ${c}) ＝ ＋${ans}.`
          : `Έχουμε 2 αρνητικούς παράγοντες (άρτιο πλήθος), άρα το τελικό πρόσημο είναι θετικό (＋): ＋(${a} · ${b} · ${c}) ＝ ＋${ans}.`,
    };
  },

  // 10. Γινόμενο τριών παραγόντων με 3 αρνητικούς (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const c = randInt(2, 5);
    const ans = -(a * b * c);
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTI-TERM PRODUCT' : 'ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΟΡΩΝ',
      question:
        locale === 'en'
          ? `Calculate the product: (－${a}) · (－${b}) · (－${c})`
          : `Υπολόγισε το γινόμενο: (－${a}) · (－${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `There are 3 negative factors (odd count), so the product is negative (－): －(${a} · ${b} · ${c}) ＝ ${ans}.`
          : `Έχουμε 3 αρνητικούς παράγοντες (περιττό πλήθος), άρα το τελικό πρόσημο είναι αρνητικό (－): －(${a} · ${b} · ${c}) ＝ ${ans}.`,
    };
  },

  // 11. Πρόσημο γινομένου πολλών παραγόντων (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'Positive (＋)' : 'Θετικό (＋)';
    const candidates =
      locale === 'en'
        ? ['Negative (－)', 'Zero', 'Cannot be determined']
        : ['Αρνητικό (－)', 'Μηδέν', 'Δεν μπορούμε να γνωρίζουμε'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'SIGN THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question:
        locale === 'en'
          ? 'In a product of 8 negative and 5 positive non-zero factors, what is the final sign?'
          : 'Σε ένα γινόμενο 8 αρνητικών και 5 θετικών παραγόντων, ποιο είναι το τελικό πρόσημο;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The resulting sign depends exclusively on the count of negative factors. Since 8 is an even number, the product is strictly positive (＋).'
          : 'Το τελικό πρόσημο εξαρτάται αποκλειστικά από τους αρνητικούς παράγοντες. Επειδή το πλήθος τους (8) είναι άρτιο, το γινόμενο είναι θετικό (＋).',
    };
  },

  // 12. Περιττό πλήθος αρνητικών παραγόντων (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'Negative (－)' : 'Αρνητικό (－)';
    const candidates =
      locale === 'en'
        ? ['Positive (＋)', 'Zero', 'Depends on the values of the numbers']
        : ['Θετικό (＋)', 'Μηδέν', 'Θα εξαρτηθεί από το μέγεθος των αριθμών'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'SIGN THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question:
        locale === 'en'
          ? 'If we multiply 7 negative non-zero numbers, what sign will the result have?'
          : 'Αν πολλαπλασιάσουμε 7 αρνητικούς αριθμούς, τι πρόσημο θα έχει το αποτέλεσμα;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The count of negative factors is 7 (an odd number), hence the product is always strictly negative (－).'
          : 'Το πλήθος των αρνητικών παραγόντων είναι 7 (περιττός αριθμός), επομένως το γινόμενο είναι πάντοτε αρνητικό (－).',
    };
  },

  // 13. Επιμεριστική ιδιότητα (Input) - Bug fix syntax
  (locale) => {
    const a = randInt(3, 6);
    const b = randInt(10, 20);
    const c = randInt(2, 5);
    const inside = -b + c;
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: locale === 'en' ? 'DISTRIBUTIVE PROPERTY' : 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? `Evaluate: (－${a}) · [(－${b}) ＋ (＋${c})]`
          : `Υπολόγισε την παράσταση: (－${a}) · [(－${b}) ＋ (＋${c})]`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Inside the brackets: (－${b}) ＋ (＋${c}) ＝ ${inside}. Then: (－${a}) · (${inside}) ＝ ＋${ans}.`
          : `Μέσα στην αγκύλη: (－${b}) ＋ (＋${c}) ＝ ${inside}. Έπειτα: (－${a}) · (${inside}) ＝ ＋${ans}.`,
    };
  },

  // 14. Εύρεση άγνωστου παράγοντα (Input)
  (locale) => {
    const a = randInt(3, 8);
    const mult = randInt(3, 7);
    const target = -(a * mult);
    const x = -mult;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SOLVING FOR UNKNOWN' : 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find the integer x such that: (＋${a}) · x ＝ ${target}`
          : `Βρες τον ακέραιο x ώστε: (＋${a}) · x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (${target}) : (＋${a}) ＝ ${x}.`
          : `x ＝ (${target}) : (＋${a}) ＝ ${x}.`,
    };
  },

  // 15. Εύρεση άγνωστου με δύο αρνητικά (Input)
  (locale) => {
    const a = randInt(3, 7);
    const mult = randInt(4, 9);
    const target = a * mult;
    const x = -mult;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SOLVING FOR UNKNOWN' : 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find the integer x such that: (－${a}) · x ＝ ＋${target}`
          : `Βρες τον ακέραιο x ώστε: (－${a}) · x ＝ ＋${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (＋${target}) : (－${a}) ＝ ${x}.`
          : `x ＝ (＋${target}) : (－${a}) ＝ ${x}.`,
    };
  },

  // 16. Τετράγωνο αρνητικού αριθμού (Input)
  (locale) => {
    const a = randInt(4, 10);
    const ans = a * a;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER POWERS' : 'ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) · (－${a})`
          : `Υπολόγισε την τιμή: (－${a}) · (－${a})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Same sign negatives: (－) · (－) ＝ ＋. Thus (－${a}) · (－${a}) ＝ ＋${ans}.`
          : `Ομόσημοι αρνητικοί: (－) · (－) ＝ ＋. Επομένως (－${a}) · (－${a}) ＝ ＋${ans}.`,
    };
  },

  // 17. Γινόμενο με παράγοντα το 0 ανάμεσα σε πολλούς (MCQ) - Bug fix syntax
  (locale) => {
    const a = randInt(2, 9);
    const b = randInt(3, 8);
    const c = randInt(4, 9);
    const prod = a * b * c;
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ZERO ELEMENT' : 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question:
        locale === 'en'
          ? `What is the value of: (－${a}) · (＋${b}) · 0 · (－${c})?`
          : `Ποιο είναι το αποτέλεσμα: (－${a}) · (＋${b}) · 0 · (－${c});`,
      options: makeUniqueOptions('0', ['1', `－${prod}`, `＋${prod}`]),
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'Whenever the factor 0 is present in any product, the entire product evaluates immediately to 0.'
          : 'Όταν ανάμεσα στους παράγοντες ενός γινομένου υπάρχει ο αριθμός 0, το αποτέλεσμα μηδενίζεται αυτόματα.',
    };
  },

  // 18. Προτεραιότητα πράξεων: Πολλαπλασιασμός πριν την πρόσθεση (Input) - Bug fix syntax
  (locale) => {
    const a = randInt(5, 15);
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const mult = -(b * c);
    const ans = a + mult;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS' : 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate: ${a} ＋ (＋${b}) · (－${c})`
          : `Υπολόγισε: ${a} ＋ (＋${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Multiplication takes precedence: (＋${b}) · (－${c}) ＝ ${mult}. Then add: ${a} ＋ (${mult}) ＝ ${ans}.`
          : `Προηγείται ο πολλαπλασιασμός: (＋${b}) · (－${c}) ＝ ${mult}. Στη συνέχεια προσθέτουμε: ${a} ＋ (${mult}) ＝ ${ans}.`,
    };
  },

  // 19. Προτεραιότητα με δύο γινόμενα (Input) - Bug fix syntax
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const c = randInt(2, 4);
    const d = randInt(2, 5);
    const prod1 = -(a * b);
    const prod2 = c * d;
    const ans = prod1 + prod2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS' : 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${a}) · (＋${b}) ＋ (－${c}) · (－${d})`
          : `Υπολόγισε: (－${a}) · (＋${b}) ＋ (－${c}) · (－${d})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a}) · (＋${b}) ＝ ${prod1} and (－${c}) · (－${d}) ＝ ＋${prod2}. Final sum: (${prod1}) ＋ (＋${prod2}) ＝ ${ans}.`
          : `(－${a}) · (＋${b}) ＝ ${prod1} και (－${c}) · (－${d}) ＝ ＋${prod2}. Τελικό άθροισμα: (${prod1}) ＋ (＋${prod2}) ＝ ${ans}.`,
    };
  },

  // 20. Αντιμεταθετική ιδιότητα (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'Commutative property' : 'Αντιμεταθετική ιδιότητα';
    const candidates =
      locale === 'en'
        ? ['Associative property', 'Distributive property', 'Identity element']
        : ['Προσεταιριστική ιδιότητα', 'Επιμεριστική ιδιότητα', 'Ουδέτερο στοιχείο'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'MULTIPLICATION PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question:
        locale === 'en'
          ? 'Which property is represented by: (－4) · (＋7) ＝ (＋7) · (－4)?'
          : 'Ποια ιδιότητα δηλώνει η ισότητα: (－4) · (＋7) ＝ (＋7) · (－4);',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Changing the order of the factors without altering the product is the Commutative property (α · β ＝ β · α).'
          : 'Η αλλαγή της σειράς των παραγόντων χωρίς να μεταβάλλεται το γινόμενο είναι η Αντιμεταθετική ιδιότητα (α · β ＝ β · α).',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ (i18n)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Σταθερή πτώση θερμοκρασίας ανά ώρα
  (locale) => {
    const dropPerHour = randInt(2, 4);
    const hours = randInt(3, 6);
    const ans = -(dropPerHour * hours);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `During a blizzard the temperature drops steadily by ${dropPerHour} °C each hour (－${dropPerHour} °C/h). What is the total temperature change after ${hours} hours? (type with － sign)`
          : `Κατά τη διάρκεια μιας χιονοθύελλας η θερμοκρασία μειώνεται σταθερά κατά ${dropPerHour} °C κάθε ώρα (－${dropPerHour} °C/h). Ποια θα είναι η συνολική μεταβολή της θερμοκρασίας μετά από ${hours} ώρες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${hours} · (－${dropPerHour}) ＝ ${ans} °C.`
          : `Πολλαπλασιάζουμε τη μείωση ανά ώρα επί τις ώρες: ${hours} · (－${dropPerHour}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Μηνιαία πάγια συνδρομή σε τραπεζικό λογαριασμό
  (locale) => {
    const fee = randInt(8, 25);
    const months = randInt(4, 9);
    const ans = -(fee * months);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A monthly fee of ${fee} € is automatically deducted from an account (change of －${fee} €/month). What is the total balance impact after ${months} months? (type with － sign)`
          : `Από έναν λογαριασμό αφαιρείται αυτόματα κάθε μήνα συνδρομή ${fee} € (μεταβολή －${fee} €). Ποια θα είναι η συνολική επίδραση στον λογαριασμό μετά από ${months} μήνες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${months} · (－${fee}) ＝ ${ans} €. Total balance change.`
          : `${months} · (－${fee}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 3: Κατάδυση υποβρυχίου με σταθερή ταχύτητα
  (locale) => {
    const speed = randInt(12, 25);
    const mins = randInt(4, 8);
    const ans = -(speed * mins);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A submarine dives at a constant rate of ${speed} m per minute (－${speed} m/min). What is its elevation relative to the surface after ${mins} minutes? (type with － sign)`
          : `Ένα υποβρύχιο καταδύεται με ρυθμό ${speed} m ανά λεπτό (－${speed} m/min). Σε ποιο υψόμετρο θα βρίσκεται μετά από ${mins} λεπτά ξεκινώντας από την επιφάνεια; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${mins} · (－${speed}) ＝ ${ans} m.`
          : `${mins} · (－${speed}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 4: Επαναλαμβανόμενες ποινές σε παιχνίδι
  (locale) => {
    const penalty = randInt(15, 30);
    const rounds = randInt(3, 5);
    const ans = -(penalty * rounds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In an online game a player receives a penalty of －${penalty} points for each mistake. If he made ${rounds} consecutive mistakes, what is his total score change? (type with － sign)`
          : `Σε ένα διαδικτυακό παιχνίδι ο παίκτης δέχεται ποινή －${penalty} πόντων για κάθε λάθος. Αν έκανε ${rounds} διαδοχικά λάθη, πόσους πόντους έχασε συνολικά (με πρόσημο); (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${rounds} · (－${penalty}) ＝ ${ans} points.`
          : `${rounds} · (－${penalty}) ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 5: Εβδομαδιαία ζημιά καταστήματος
  (locale) => {
    const weeklyLoss = randInt(120, 250);
    const weeks = randInt(3, 5);
    const ans = -(weeklyLoss * weeks);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A startup recorded a loss of ${weeklyLoss} € each week (－${weeklyLoss} €/week) for ${weeks} weeks. What was the net financial outcome? (type with － sign)`
          : `Μια νεοσύστατη επιχείρηση κατέγραψε ζημιά ${weeklyLoss} € κάθε εβδομάδα (－${weeklyLoss} €/εβδομάδα) για ${weeks} συνεχόμενες εβδομάδες. Ποιο ήταν το συνολικό ταμειακό αποτέλεσμα; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${weeks} · (－${weeklyLoss}) ＝ ${ans} €. Net loss.`
          : `${weeks} · (－${weeklyLoss}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 6: Σταθερή κάθοδος ανελκυστήρα ορυχείου
  (locale) => {
    const metersPerSec = randInt(3, 6);
    const seconds = randInt(15, 30);
    const ans = -(metersPerSec * seconds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A mine shaft elevator descends at a rate of ${metersPerSec} m/s (－${metersPerSec} m/s). What is its depth position after ${seconds} seconds starting from ground level? (type with － sign)`
          : `Ο ανελκυστήρας ενός μεταλλείου κατεβαίνει με ταχύτητα ${metersPerSec} m/s (－${metersPerSec} m/s). Ποιο θα είναι το βάθος του μετά από ${seconds} δευτερόλεπτα ξεκινώντας από το έδαφος; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${seconds} · (－${metersPerSec}) ＝ ${ans} m.`
          : `${seconds} · (－${metersPerSec}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 7: Πτώση στάθμης δεξαμενής
  (locale) => {
    const dropPerDay = randInt(4, 9);
    const days = randInt(5, 10);
    const ans = -(dropPerDay * days);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WATER LEVEL' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question:
        locale === 'en'
          ? `Due to dry weather a reservoir level drops by ${dropPerDay} cm each day (－${dropPerDay} cm/day). What is the total level change in cm after ${days} days? (type with － sign)`
          : `Λόγω ξηρασίας η στάθμη μιας δεξαμενής μειώνεται κατά ${dropPerDay} cm καθημερινά (－${dropPerDay} cm/ημέρα). Πόσα cm θα είναι η συνολική μεταβολή της στάθμης μετά από ${days} ημέρες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${days} · (－${dropPerDay}) ＝ ${ans} cm.`
          : `${days} · (－${dropPerDay}) ＝ ${ans} cm.`,
    };
  },

  // Πρόβλημα 8: Ακύρωση μηνιαίων δόσεων χρέους
  (locale) => {
    const installment = randInt(25, 50);
    const count = randInt(3, 6);
    const ans = installment * count;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A bank waives ${count} monthly billing charges of ${installment} € each (removal of debt: (－${count}) · (－${installment})). What is the net financial gain in €?`
          : `Μια τράπεζα διαγράφει ${count} μηνιαίες χρεώσεις των ${installment} € η καθεμία (αφαίρεση χρέους: (－${count}) · (－${installment})). Ποιο είναι το συνολικό όφελος σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${count}) · (－${installment}) ＝ ＋(${count} · ${installment}) ＝ ＋${ans} €. Positive net benefit.`
          : `(－${count}) · (－${installment}) ＝ ＋(${count} · ${installment}) ＝ ＋${ans} €.`,
    };
  },

  // Πρόβλημα 9: Σταθερή ψύξη χημικού διαλύματος
  (locale) => {
    const coolRate = randInt(2, 5);
    const mins = randInt(6, 12);
    const ans = -(coolRate * mins);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In a laboratory a solution cools by ${coolRate} °C every minute (－${coolRate} °C/min). By how many degrees Celsius has its temperature changed after ${mins} minutes? (type with － sign)`
          : `Σε ένα εργαστήριο ένα διάλυμα ψύχεται κατά ${coolRate} °C κάθε λεπτό (－${coolRate} °C/min). Πόσους βαθμούς Κελσίου θα έχει μεταβληθεί η θερμοκρασία του μετά από ${mins} λεπτά; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${mins} · (－${coolRate}) ＝ ${ans} °C.`
          : `${mins} · (－${coolRate}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 10: Απώλεια πόντων σε αθλητικό τουρνουά
  (locale) => {
    const yellowCardPenalty = 2;
    const cards = randInt(3, 7);
    const ans = -(yellowCardPenalty * cards);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a sports tournament each yellow card incurs a penalty of －${yellowCardPenalty} points. If a team receives ${cards} yellow cards, what is the total penalty point score? (type with － sign)`
          : `Στο πρωτάθλημα fair play κάθε κίτρινη κάρτα επιφέρει ποινή －${yellowCardPenalty} βαθμών. Αν μια ομάδα δέχτηκε ${cards} κίτρινες κάρτες, πόσοι είναι οι συνολικοί βαθμοί ποινής; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${cards} · (－${yellowCardPenalty}) ＝ ${ans} points.`
          : `${cards} · (－${yellowCardPenalty}) ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 11: Σταθερή υποχώρηση παγετώνα
  (locale) => {
    const retreat = randInt(5, 12);
    const years = randInt(4, 8);
    const ans = -(retreat * years);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ENVIRONMENT' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ',
      question:
        locale === 'en'
          ? `A glacier recedes on average by ${retreat} m every year (－${retreat} m/year). What will be the total displacement of its front after ${years} years? (type with － sign)`
          : `Ένας παγετώνας υποχωρεί κατά μέσο όρο ${retreat} m κάθε χρόνο (－${retreat} m/έτος). Ποια θα είναι η συνολική μετατόπιση του μετώπου του μετά από ${years} χρόνια; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${years} · (－${retreat}) ＝ ${ans} m.`
          : `${years} · (－${retreat}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 12: Ημερήσια απώλεια βάρους φορτίου
  (locale) => {
    const lossKg = randInt(4, 9);
    const days = randInt(6, 12);
    const ans = -(lossKg * days);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WEIGHT' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question:
        locale === 'en'
          ? `Due to evaporation a cargo loses ${lossKg} kg daily (－${lossKg} kg/day). What is the total mass change after ${days} days? (type with － sign)`
          : `Λόγω εξάτμισης υγρασίας, ένα φορτίο χάνει ${lossKg} kg καθημερινά (－${lossKg} kg/ημέρα). Ποια είναι η συνολική μεταβολή της μάζας του μετά από ${days} ημέρες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${days} · (－${lossKg}) ＝ ${ans} kg.`
          : `${days} · (－${lossKg}) ＝ ${ans} kg.`,
    };
  },

  // Πρόβλημα 13: Μείωση τιμής προϊόντος
  (locale) => {
    const discount = randInt(3, 7);
    const items = randInt(8, 15);
    const ans = -(discount * items);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A store offers a discount of ${discount} € on each shirt sold (change of －${discount} €/shirt). If ${items} shirts are sold, what is the total cash impact of the discount? (type with － sign)`
          : `Ένα κατάστημα προσφέρει έκπτωση ${discount} € σε κάθε μπλούζα (μεταβολή －${discount} €). Αν πουλήθηκαν ${items} μπλούζες, ποια ήταν η συνολική έκπτωση στο ταμείο; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${items} · (－${discount}) ＝ ${ans} €. Total discount value.`
          : `${items} · (－${discount}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 14: Κατάδυση αυτόνομου βαθυσκάφους
  (locale) => {
    const speed = randInt(8, 15);
    const hours = randInt(2, 4);
    const ans = -(speed * hours);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `An oceanographic probe sinks toward the abyss at ${speed} m per hour (－${speed} m/h). What elevation will it reach after ${hours} hours? (type with － sign)`
          : `Ένα ωκεανογραφικό βαθυσκάφος κατεβαίνει προς την άβυσσο με ρυθμό ${speed} m ανά ώρα (－${speed} m/h). Σε ποιο υψόμετρο θα βρίσκεται μετά από ${hours} ώρες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${hours} · (－${speed}) ＝ ${ans} m.`
          : `${hours} · (－${speed}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 15: Σειρά λανθασμένων απαντήσεων σε διαγώνισμα
  (locale) => {
    const minusPerMistake = 3;
    const mistakes = randInt(4, 9);
    const ans = -(minusPerMistake * mistakes);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In an exam each wrong answer deducts ${minusPerMistake} points (－${minusPerMistake}). If a student makes ${mistakes} mistakes, how many points are lost in total? (type with － sign)`
          : `Σε ένα τεστ πολλαπλής επιλογής κάθε λανθασμένη απάντηση αφαιρεί ${minusPerMistake} μόρια (－${minusPerMistake}). Αν ένας υποψήφιος έκανε ${mistakes} λάθη, πόσα μόρια έχασε συνολικά; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${mistakes} · (－${minusPerMistake}) ＝ ${ans} points.`
          : `${mistakes} · (－${minusPerMistake}) ＝ ${ans} μόρια.`,
    };
  },

  // Πρόβλημα 16: Καθημερινή διαρροή καυσίμου
  (locale) => {
    const liters = randInt(5, 12);
    const days = randInt(3, 7);
    const ans = -(liters * days);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: VOLUME' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΓΚΟΣ',
      question:
        locale === 'en'
          ? `An old fuel tank steadily leaks ${liters} l of fuel per day (－${liters} l/day). What is the total fuel loss after ${days} days? (type with － sign)`
          : `Από ένα παλιό ρεζερβουάρ διαρρέουν σταθερά ${liters} l καυσίμου την ημέρα (－${liters} l/ημέρα). Ποια είναι η συνολική απώλεια καυσίμου μετά από ${days} ημέρες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${days} · (－${liters}) ＝ ${ans} l.`
          : `${days} · (－${liters}) ＝ ${ans} l.`,
    };
  },

  // Πρόβλημα 17: Αποπληρωμή μηνιαίων δόσεων κάρτας
  (locale) => {
    const installment = randInt(30, 70);
    const months = randInt(3, 6);
    const ans = -(installment * months);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A consumer pays a monthly installment of ${installment} € for a laptop purchase (charge of －${installment} €/month). What is the total cash outflow after ${months} months? (type with － sign)`
          : `Ένας καταναλωτής πληρώνει μηνιαία δόση ${installment} € για αγορά υπολογιστή (χρέωση －${installment} €/μήνα). Ποια είναι η συνολική εκροή χρημάτων μετά από ${months} μήνες; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${months} · (－${installment}) ＝ ${ans} €. Total charge.`
          : `${months} · (－${installment}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 18: Πτώση πίεσης ανά λεπτό
  (locale) => {
    const barPerMin = randInt(2, 5);
    const mins = randInt(4, 8);
    const ans = -(barPerMin * mins);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: PRESSURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΕΣΗ',
      question:
        locale === 'en'
          ? `During depressurization inside a chamber, the pressure drops by ${barPerMin} bar each minute (－${barPerMin} bar/min). What is the total pressure change after ${mins} minutes? (type with － sign)`
          : `Κατά τη διαδικασία αποσυμπίεσης ενός θαλάμου, η πίεση μειώνεται κατά ${barPerMin} bar κάθε λεπτό (－${barPerMin} bar/min). Ποια είναι η μεταβολή της πίεσης μετά από ${mins} λεπτά; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${mins} · (－${barPerMin}) ＝ ${ans} bar.`
          : `${mins} · (－${barPerMin}) ＝ ${ans} bar.`,
    };
  },

  // Πρόβλημα 19: Απώλεια χρόνου σε αγώνα ράλι
  (locale) => {
    const penaltySec = randInt(5, 15);
    const obstacles = randInt(3, 6);
    const ans = -(penaltySec * obstacles);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TIME' : 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question:
        locale === 'en'
          ? `In a rally stage each speed violation incurs a time penalty of ${penaltySec} seconds (－${penaltySec} s). If a crew incurs ${obstacles} violations, what is the total penalty time? (type with － sign)`
          : `Σε μια ειδική διαδρομή ράλι, κάθε παράβαση ορίου ταχύτητας επιφέρει ποινή χρόνου ${penaltySec} δευτερολέπτων (－${penaltySec} s). Αν ένα πλήρωμα υπέπεσε σε ${obstacles} παραβάσεις, ποια είναι η συνολική ποινή; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${obstacles} · (－${penaltySec}) ＝ ${ans} s.`
          : `${obstacles} · (－${penaltySec}) ＝ ${ans} s.`,
    };
  },

  // Πρόβλημα 20: Μείωση επιπέδου θορύβου
  (locale) => {
    const decibelPerLayer = randInt(4, 8);
    const layers = randInt(3, 5);
    const ans = -(decibelPerLayer * layers);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ACOUSTICS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΗΧΟΣΥΝΘΕΣΗ',
      question:
        locale === 'en'
          ? `Each acoustic panel reduces sound level by ${decibelPerLayer} dB (－${decibelPerLayer} dB). If ${layers} consecutive panels are installed, what is the total noise level reduction? (type with － sign)`
          : `Κάθε στρώμα ηχομονωτικού υλικού μειώνει τον θόρυβο κατά ${decibelPerLayer} dB (－${decibelPerLayer} dB). Αν τοποθετηθούν ${layers} διαδοχικά στρώματα, ποια είναι η συνολική μείωση της έντασης; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${layers} · (－${decibelPerLayer}) ＝ ${ans} dB.`
          : `${layers} · (－${decibelPerLayer}) ＝ ${ans} dB.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Πολλαπλασιασμός Ακεραίων | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στον πολλαπλασιασμό ομόσημων, ετερόσημων και πολλών ακεραίων παραγόντων.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Πολλαπλασιασμός Ακέραιων Αριθμών",
    heroDesc: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
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
    metaTitle: "Exercises: Multiplying Integers | 7th Grade Mathematics",
    metaDescription: "Practice with 12 dynamic problems and word scenarios on integer multiplication.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Multiplication of Integers",
    heroDesc: "Solve the following 12 selected exercises (10 operations and theory + 2 realistic word problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    problemBadge: "WORD PROBLEM",
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

export default function PollaplasiasmosAkeraionAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

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

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/08-pollaplasiasmos-akeraion"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
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
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden ${
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
                            {toCleanUppercase(t.problemBadge)}
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

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-black text-amber-400 font-mono whitespace-nowrap">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
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