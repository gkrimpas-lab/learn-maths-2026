import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα κεφαλαία με διατήρηση του τόνου της τάξης (Α')
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

// Βοηθητική συνάρτηση τυχαίου ακέραιου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Βοηθητική συνάρτηση ανακατέματος πίνακα (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Εξασφάλιση 4 μοναδικών επιλογών σε MCQ χωρίς διπλότυπα
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
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΑΚΕΡΑΙΩΝ (i18n)
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. Απόλυτη τιμή αρνητικού ακέραιου (Input)
  (locale) => {
    const n = randInt(3, 45);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Calculate the absolute value: |－${n}|`
          : `Υπολόγισε την απόλυτη τιμή: |－${n}|`,
      correctAnswer: n.toString(),
      solution:
        locale === 'en'
          ? `The absolute value of a negative number equals its opposite, which is always positive. Therefore |－${n}| ＝ ${n}.`
          : `Η απόλυτη τιμή ενός αρνητικού αριθμού ισούται με τον αντίθετό του, δηλαδή είναι πάντοτε θετική. Άρα |－${n}| ＝ ${n}.`,
    };
  },

  // 2. Απόλυτη τιμή θετικού ακέραιου (Input)
  (locale) => {
    const n = randInt(12, 60);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Calculate the absolute value: |＋${n}|`
          : `Υπολόγισε την απόλυτη τιμή: |＋${n}|`,
      correctAnswer: n.toString(),
      solution:
        locale === 'en'
          ? `The absolute value of a positive number is the number itself. Thus |＋${n}| ＝ ${n}.`
          : `Η απόλυτη τιμή ενός θετικού αριθμού είναι ο ίδιος ο αριθμός. Επομένως |＋${n}| ＝ ${n}.`,
    };
  },

  // 3. Αντίθετος αρνητικού αριθμού (Input)
  (locale) => {
    const n = randInt(5, 50);
    return {
      type: 'input',
      topic: locale === 'en' ? 'OPPOSITE NUMBERS' : 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `What is the opposite number of －${n}?`
          : `Ποιος είναι ο αντίθετος αριθμός του －${n};`,
      correctAnswer: n.toString(),
      solution:
        locale === 'en'
          ? `The opposite of a negative number has the opposite sign (positive) and the same absolute value. Thus the opposite of －${n} is ＋${n} (or ${n}).`
          : `Ο αντίθετος ενός αρνητικού αριθμού έχει το αντίθετο πρόσημο (θετικό) και την ίδια απόλυτη τιμή. Άρα ο αντίθετος του －${n} είναι το ＋${n} (ή ${n}).`,
    };
  },

  // 4. Αντίθετος θετικού αριθμού (Input)
  (locale) => {
    const n = randInt(7, 40);
    return {
      type: 'input',
      topic: locale === 'en' ? 'OPPOSITE NUMBERS' : 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `What is the opposite number of ＋${n}? (type with the － sign)`
          : `Ποιος είναι ο αντίθετος αριθμός του ＋${n}; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `The opposite of ＋${n} is the number with the same absolute value but opposite sign, which is －${n}.`
          : `Ο αντίθετος του ＋${n} είναι ο αριθμός με το ίδιο μέτρο αλλά αντίθετο πρόσημο, δηλαδή ο －${n}.`,
    };
  },

  // 5. Σύγκριση δύο αρνητικών ακεραίων (MCQ)
  (locale) => {
    const val1 = randInt(2, 10);
    const val2 = randInt(12, 25);
    const correct = `－${val1} ＞ －${val2}`;
    const candidates = [
      `－${val1} ＜ －${val2}`,
      `－${val1} ＝ －${val2}`,
      `－${val1} ≥ ＋${val2}`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'COMPARING INTEGERS' : 'ΣΥΓΚΡΙΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Which relation holds true between －${val1} and －${val2}?`
          : `Ποια σχέση ισχύει μεταξύ των αριθμών －${val1} και －${val2};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Between two negative numbers, the greater one is that which has the smaller absolute value (closer to 0 on the number line). Since |－${val1}| ＝ ${val1} ＜ ${val2} ＝ |－${val2}|, we have －${val1} ＞ －${val2}.`
          : `Μεταξύ δύο αρνητικών αριθμών μεγαλύτερος είναι εκείνος που έχει τη μικρότερη απόλυτη τιμή (βρίσκεται πιο κοντά στο 0 στον άξονα). Επειδή |－${val1}| ＝ ${val1} ＜ ${val2} ＝ |－${val2}|, ισχύει －${val1} ＞ －${val2}.`,
    };
  },

  // 6. Σύγκριση θετικού και αρνητικού (MCQ)
  (locale) => {
    const pos = randInt(1, 8);
    const neg = randInt(10, 30);
    const correct = `＋${pos} ＞ －${neg}`;
    const candidates = [
      `＋${pos} ＜ －${neg}`,
      `＋${pos} ＝ －${neg}`,
      `＋${pos} ≤ －${neg}`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'COMPARING INTEGERS' : 'ΣΥΓΚΡΙΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Which relation holds true between ＋${pos} and －${neg}?`
          : `Ποια σχέση ισχύει μεταξύ των αριθμών ＋${pos} και －${neg};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Every positive number is always strictly greater than any negative number, regardless of their absolute values. Thus ＋${pos} ＞ －${neg}.`
          : `Κάθε θετικός αριθμός είναι πάντοτε μεγαλύτερος από οποιονδήποτε αρνητικό αριθμό, ανεξάρτητα από τις απόλυτες τιμές τους. Άρα ＋${pos} ＞ －${neg}.`,
    };
  },

  // 7. Απόσταση δύο σημείων στον άξονα (Input)
  (locale) => {
    const a = randInt(2, 8);
    const b = randInt(1, 7);
    const dist = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'DISTANCE ON NUMBER LINE' : 'ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΑΞΟΝΑ',
      question:
        locale === 'en'
          ? `How many units apart are points A(－${a}) and B(＋${b}) on the number line?`
          : `Πόσες μονάδες απέχουν μεταξύ τους στον άξονα τα σημεία Α(－${a}) και Β(＋${b});`,
      correctAnswer: dist.toString(),
      solution:
        locale === 'en'
          ? `The distance between two points on the line equals the difference of coordinates: d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${dist} units.`
          : `Η απόσταση δύο σημείων στον άξονα ισούται με τη διαφορά της μεγαλύτερης τετμημένης από τη μικρότερη: d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${dist} μονάδες.`,
    };
  },

  // 8. Άθροισμα απολύτων τιμών (Input)
  (locale) => {
    const a = randInt(4, 15);
    const b = randInt(5, 15);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Evaluate the numerical expression: |－${a}| ＋ |＋${b}|`
          : `Υπολόγισε την τιμή της παράστασης: |－${a}| ＋ |＋${b}|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `|－${a}| ＝ ${a} and |＋${b}| ＝ ${b}. Therefore ${a} ＋ ${b} ＝ ${ans}.`
          : `|－${a}| ＝ ${a} και |＋${b}| ＝ ${b}. Επομένως ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 9. Διαφορά απολύτων τιμών (Input)
  (locale) => {
    const a = randInt(15, 30);
    const b = randInt(2, 10);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Evaluate the numerical expression: |－${a}| － |－${b}|`
          : `Υπολόγισε την τιμή της παράστασης: |－${a}| － |－${b}|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `|－${a}| ＝ ${a} and |－${b}| ＝ ${b}. Thus ${a} － ${b} ＝ ${ans}.`
          : `|－${a}| ＝ ${a} και |－${b}| ＝ ${b}. Άρα ${a} － ${b} ＝ ${ans}.`,
    };
  },

  // 10. Το μηδέν ως ακέραιος (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'Neither positive nor negative'
        : 'Δεν είναι ούτε θετικός ούτε αρνητικός';
    const candidates =
      locale === 'en'
        ? ['It is a positive number', 'It is a negative number', 'It is a prime number']
        : ['Είναι θετικός αριθμός', 'Είναι αρνητικός αριθμός', 'Είναι πρώτος αριθμός'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'PROPERTIES OF ZERO' : 'ΙΔΙΟΤΗΤΕΣ ΜΗΔΕΝΟΣ',
      question:
        locale === 'en'
          ? 'Which statement accurately describes the number 0?'
          : 'Ποιος από τους παρακάτω χαρακτηρισμούς ισχύει για τον αριθμό 0;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Zero (0) is the neutral reference point on the number line and is neither positive nor negative.'
          : 'Το μηδέν (0) είναι το ουδέτερο σημείο αναφοράς στον άξονα των αριθμών και δεν ανήκει ούτε στους θετικούς ούτε στους αρνητικούς αριθμούς.',
    };
  },

  // 11. Αντίθετος του μηδενός (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'en' ? 'OPPOSITE NUMBERS' : 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? 'What is the opposite number of 0?'
          : 'Ποιος είναι ο αντίθετος αριθμός του 0;',
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'The only number that is equal to its own opposite is 0, since －0 ＝ 0.'
          : 'Ο μοναδικός αριθμός που είναι ίσος με τον αντίθετό του είναι το 0, επειδή －0 ＝ 0.',
    };
  },

  // 12. Εξίσωση με απόλυτη τιμή |x| = k (MCQ)
  (locale) => {
    const k = randInt(3, 12);
    const correct =
      locale === 'en'
        ? `x ＝ ＋${k} or x ＝ －${k}`
        : `x ＝ ＋${k} ή x ＝ －${k}`;
    const candidates = [
      `x ＝ ＋${k}`,
      `x ＝ －${k}`,
      `x ＝ 0`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ABSOLUTE VALUE EQUATIONS' : 'ΕΞΙΣΩΣΕΙΣ ΜΕ ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `If |x| ＝ ${k}, what are the possible values of x?`
          : `Αν |x| ＝ ${k}, ποιες είναι οι δυνατές τιμές του x;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `There are exactly two opposite numbers whose distance from 0 is ${k}: ＋${k} and －${k}.`
          : `Υπάρχουν ακριβώς δύο αντίθετοι αριθμοί που απέχουν απόσταση ${k} από το 0: ο ＋${k} και ο －${k}.`,
    };
  },

  // 13. Αδύνατη απόλυτη τιμή (MCQ)
  (locale) => {
    const neg = randInt(2, 9);
    const correct =
      locale === 'en'
        ? 'None (it has no solution)'
        : 'Καμία (είναι αδύνατη)';
    const candidates =
      locale === 'en'
        ? ['One solution', 'Two solutions', 'Infinitely many solutions']
        : ['Μία λύση', 'Δύο λύσεις', 'Άπειρες λύσεις'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ABSOLUTE VALUE PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΑΠΟΛΥΤΗΣ ΤΙΜΗΣ',
      question:
        locale === 'en'
          ? `How many solutions does the equation |x| ＝ －${neg} have?`
          : `Πόσες λύσεις έχει η εξίσωση |x| ＝ －${neg};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The absolute value represents geometric distance and is always non-negative (|x| ≥ 0). It can never equal a negative number.'
          : 'Η απόλυτη τιμή εκφράζει γεωμετρική απόσταση και είναι πάντοτε θετική ή μηδέν (|x| ≥ 0). Δεν μπορεί ποτέ να ισούται με αρνητικό αριθμό.',
    };
  },

  // 14. Πρακτικό πρόβλημα: Μεταβολή θερμοκρασίας (Input)
  (locale) => {
    const initialTemp = randInt(2, 7);
    const drop = randInt(initialTemp + 2, initialTemp + 8);
    const finalTemp = initialTemp - drop;
    return {
      type: 'input',
      topic: locale === 'en' ? 'REAL-WORLD PROBLEMS' : 'ΠΡΑΚΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ',
      question:
        locale === 'en'
          ? `In the morning the temperature was ＋${initialTemp} °C and at night it dropped by ${drop} °C. What is the new temperature in °C? (type with the － sign)`
          : `Το πρωί η θερμοκρασία ήταν ＋${initialTemp} °C και το βράδυ έπεσε κατά ${drop} °C. Ποια είναι η νέα θερμοκρασία σε °C; (πληκτρολόγησε το πρόσημο －)`,
      correctAnswer: `${finalTemp}`,
      solution:
        locale === 'en'
          ? `Starting at ＋${initialTemp} and moving left by ${drop} units: ${initialTemp} － ${drop} ＝ ${finalTemp} °C.`
          : `Ξεκινάμε από το ＋${initialTemp} και κινούμαστε αριστερά κατά ${drop} μονάδες: ${initialTemp} － ${drop} ＝ ${finalTemp} °C.`,
    };
  },

  // 15. Πρακτικό πρόβλημα: Υψόμετρο (Input)
  (locale) => {
    const depth = randInt(40, 120);
    return {
      type: 'input',
      topic: locale === 'en' ? 'REAL-WORLD PROBLEMS' : 'ΠΡΑΚΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ',
      question:
        locale === 'en'
          ? `A submarine is ${depth} meters below sea level. What integer represents its elevation in meters?`
          : `Ένα υποβρύχιο βρίσκεται ${depth} μέτρα κάτω από την επιφάνεια της θάλασσας. Με ποιον ακέραιο αριθμό εκφράζεται το βάθος του σε μέτρα;`,
      correctAnswer: `-${depth}`,
      solution:
        locale === 'en'
          ? `Because it is located below sea level (elevation 0), the position is expressed with a negative sign: －${depth} m.`
          : `Επειδή βρίσκεται κάτω από την επιφάνεια της θάλασσας (σημείο 0), το υψόμετρο εκφράζεται με αρνητικό πρόσημο: －${depth} m.`,
    };
  },

  // 16. Σύνολο ακεραίων ανάμεσα σε δύο τιμές (Input) - Διόρθωση συντακτικού σφάλματος
  (locale) => {
    const k = randInt(2, 4);
    const count = 2 * k - 1;
    const valuesList = Array.from({ length: count }, (_, i) => {
      const val = -(k - 1) + i;
      return val > 0 ? `＋${val}` : val < 0 ? `－${Math.abs(val)}` : '0';
    }).join(', ');

    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDERING INTEGERS' : 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `How many integer numbers x satisfy the condition: －${k} ＜ x ＜ ＋${k}?`
          : `Πόσοι ακέραιοι αριθμοί x ικανοποιούν τη σχέση: －${k} ＜ x ＜ ＋${k};`,
      correctAnswer: count.toString(),
      solution:
        locale === 'en'
          ? `The integers strictly between －${k} and ＋${k} are: ${valuesList}. In total there are ${count} numbers.`
          : `Οι ακέραιοι που βρίσκονται αυστηρά ανάμεσα στο －${k} και το ＋${k} είναι οι: ${valuesList}. Συνολικά είναι ${count} αριθμοί.`,
    };
  },

  // 17. Μέγιστος αρνητικός ακέραιος (MCQ)
  (locale) => {
    const notExist = locale === 'en' ? 'Does not exist' : 'Δεν υπάρχει';
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ORDERING INTEGERS' : 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? 'What is the greatest negative integer?'
          : 'Ποιος είναι ο μεγαλύτερος αρνητικός ακέραιος αριθμός;',
      options: makeUniqueOptions('－1', ['0', '－10', notExist]),
      correctAnswer: '－1',
      solution:
        locale === 'en'
          ? 'The integer －1 is the closest negative integer to 0 (has the smallest absolute value among negatives), hence it is strictly greater than all other negative integers.'
          : 'Ο αριθμός －1 είναι ο αρνητικός ακέραιος που βρίσκεται πιο κοντά στο 0 (έχει τη μικρότερη απόλυτη τιμή ανάμεσα στους αρνητικούς), επομένως είναι ο μεγαλύτερος όλων των αρνητικών ακεραίων.',
    };
  },

  // 18. Ελάχιστος θετικός ακέραιος (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDERING INTEGERS' : 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? 'What is the smallest positive integer?'
          : 'Ποιος είναι ο μικρότερος θετικός ακέραιος αριθμός;',
      correctAnswer: '1',
      solution:
        locale === 'en'
          ? 'Positive integers start at ＋1 (or 1), as 0 is not positive.'
          : 'Οι θετικοί ακέραιοι ξεκινούν από το ＋1 (ή 1), καθώς το 0 δεν είναι θετικός.',
    };
  },

  // 19. Άθροισμα αντιθέτων αριθμών (Input)
  (locale) => {
    const n = randInt(14, 85);
    return {
      type: 'input',
      topic: locale === 'en' ? 'OPPOSITE NUMBERS' : 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum of the opposite numbers: (＋${n}) ＋ (－${n})`
          : `Υπολόγισε το άθροισμα των αντιθέτων αριθμών: (＋${n}) ＋ (－${n})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'The sum of any two opposite numbers is always zero (a ＋ (－a) ＝ 0).'
          : 'Το άθροισμα δύο αντίθετων αριθμών ισούται πάντοτε με το μηδέν (α ＋ (－α) ＝ 0).',
    };
  },

  // 20. Σύγκριση απολύτων τιμών (MCQ)
  (locale) => {
    const a = 12;
    const correct = `|＋${a}| ＝ |－${a}|`;
    const candidates = [
      `|＋${a}| ＞ |－${a}|`,
      `|＋${a}| ＜ |－${a}|`,
      `|＋${a}| ＋ |－${a}| ＝ 0`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ABSOLUTE VALUE' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question:
        locale === 'en'
          ? `Which relation holds true between the absolute values |＋${a}| and |－${a}|?`
          : `Ποια σχέση ισχύει μεταξύ των απολύτων τιμών |＋${a}| και |－${a}|;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Opposite numbers are equidistant from zero and have identical absolute values: |＋${a}| ＝ ${a} and |－${a}| ＝ ${a}.`
          : `Δύο αντίθετοι αριθμοί απέχουν την ίδια απόσταση από το μηδέν, επομένως έχουν ίσες απόλυτες τιμές: |＋${a}| ＝ ${a} και |－${a}| ＝ ${a}.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Ακέραιοι Αριθμοί | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 10 δυναμικές ασκήσεις στους ακέραιους αριθμούς, την απόλυτη τιμή, τους αντίθετους και τη διάταξη.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ακέραιοι Αριθμοί",
    heroDesc: "Επίλυσε τις παρακάτω 10 επιλεγμένες ασκήσεις στους ακέραιους αριθμούς, τις απόλυτες τιμές και τους αντίθετους. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και αναλυτικές λύσεις.",
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
    metaTitle: "Exercises: Integers | 7th Grade Mathematics",
    metaDescription: "Practice with 10 dynamic exercises on integers, absolute value, opposite numbers, and ordering.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Integers",
    heroDesc: "Solve the following 10 selected problems on integers, absolute values, and opposites. Then click 'CHECK ANSWERS' to view your score and detailed step-by-step solutions.",
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

export default function AkeraioiAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 10 τυχαίων ερωτήσεων από τη δεξαμενή
  const generateQuestions = () => {
    const shuffledGen = shuffleArray(EXERCISE_GENERATORS);
    const selected = shuffledGen.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));
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

  // Αποστείρωση εισόδου: ψηφία, προαιρετικό αρχικό πρόσημο μείον '-' και έως ένα κόμμα ','
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

  // Υποβολή και έλεγχος απαντήσεων
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

      // Κανονικοποίηση Unicode συμβόλων μείον και συν
      userAns = userAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');
      correctAns = correctAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');

      // Απαλοιφή προαιρετικού αρχικού '+' αν πληκτρολογηθεί
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

  const scorePercentage = Math.round((score / 10) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/05-akeraioi"
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

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm shrink-0">
                        {q.id}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-sm sm:text-base md:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ (No-Giveaway: μόνο τα controls) */}
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

                    {/* Feedback & Λύση (Εμφανίζονται ΑΠΟΚΛΕΙΣΤΙΚΑ μετά την υποβολή) */}
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

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-black text-amber-400 font-mono whitespace-nowrap">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
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