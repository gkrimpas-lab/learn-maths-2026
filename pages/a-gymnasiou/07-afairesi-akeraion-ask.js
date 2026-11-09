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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΑΦΑΙΡΕΣΗΣ (i18n)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Θετικός μείον Θετικός με θετικό αποτέλεσμα (Input)
  (locale) => {
    const b = randInt(4, 15);
    const a = b + randInt(3, 18);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (＋${a}) － (＋${b})`
          : `Υπολόγισε τη διαφορά: (＋${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Convert to addition of the opposite: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`
          : `Μετατρέπουμε σε πρόσθεση του αντιθέτου: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Θετικός μείον Θετικός με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    const a = randInt(3, 12);
    const b = a + randInt(4, 16);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (＋${a}) － (＋${b})`
          : `Υπολόγισε τη διαφορά: (＋${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`
          : `(＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 3. Θετικός μείον Αρνητικός (Input)
  (locale) => {
    const a = randInt(5, 20);
    const b = randInt(4, 18);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (＋${a}) － (－${b})`
          : `Υπολόγισε τη διαφορά: (＋${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The opposite of －${b} is ＋${b}: (＋${a}) ＋ (＋${b}) ＝ ＋(${a} ＋ ${b}) ＝ ＋${ans}.`
          : `Ο αντίθετος του －${b} είναι το ＋${b}: (＋${a}) ＋ (＋${b}) ＝ ＋(${a} ＋ ${b}) ＝ ＋${ans}.`,
    };
  },

  // 4. Αρνητικός μείον Θετικός (Input)
  (locale) => {
    const a = randInt(6, 22);
    const b = randInt(5, 18);
    const ans = -a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (－${a}) － (＋${b})`
          : `Υπολόγισε τη διαφορά: (－${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`
          : `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 5. Αρνητικός μείον Αρνητικός με θετικό αποτέλεσμα (Input)
  (locale) => {
    const a = randInt(3, 12);
    const b = a + randInt(4, 15);
    const ans = -a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (－${a}) － (－${b})`
          : `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The opposite of －${b} is ＋${b}: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`
          : `Ο αντίθετος του －${b} είναι το ＋${b}: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },

  // 6. Αρνητικός μείον Αρνητικός με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    const b = randInt(3, 12);
    const a = b + randInt(4, 16);
    const ans = -a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate the difference: (－${a}) － (－${b})`
          : `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a}) ＋ (＋${b}) ＝ －(${a} － ${b}) ＝ ${ans}.`
          : `(－${a}) ＋ (＋${b}) ＝ －(${a} － ${b}) ＝ ${ans}.`,
    };
  },

  // 7. Αφαίρεση ίσων αριθμών (Input)
  (locale) => {
    const n = randInt(10, 80);
    return {
      type: 'input',
      topic: locale === 'en' ? 'INTEGER SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (－${n}) － (－${n})`
          : `Υπολόγισε: (－${n}) － (－${n})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? `(－${n}) ＋ (＋${n}) ＝ 0. The difference between two equal numbers is always 0.`
          : `(－${n}) ＋ (＋${n}) ＝ 0. Η διαφορά δύο ίσων αριθμών ισούται πάντοτε με 0.`,
    };
  },

  // 8. Αφαίρεση του μηδενός (Input)
  (locale) => {
    const n = randInt(7, 45);
    return {
      type: 'input',
      topic: locale === 'en' ? 'SUBTRACTION PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate: (－${n}) － 0`
          : `Υπολόγισε: (－${n}) － 0`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `Subtracting 0 does not change the number: (－${n}) － 0 ＝ －${n}.`
          : `Η αφαίρεση του 0 δεν μεταβάλλει τον αριθμό: (－${n}) － 0 ＝ －${n}.`,
    };
  },

  // 9. Αφαίρεση από το μηδέν (Input)
  (locale) => {
    const n = randInt(8, 50);
    return {
      type: 'input',
      topic: locale === 'en' ? 'SUBTRACTION PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate: 0 － (＋${n})`
          : `Υπολόγισε: 0 － (＋${n})`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `0 ＋ (－${n}) ＝ －${n}.`
          : `0 ＋ (－${n}) ＝ －${n}.`,
    };
  },

  // 10. Αφαίρεση αρνητικού από το μηδέν (Input)
  (locale) => {
    const n = randInt(9, 60);
    return {
      type: 'input',
      topic: locale === 'en' ? 'SUBTRACTION PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
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

  // 11. Απλοποιημένη μορφή χωρίς παρενθέσεις (Input)
  (locale) => {
    const a = randInt(8, 20);
    const b = randInt(12, 30);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SIMPLIFIED NOTATION' : 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question:
        locale === 'en'
          ? `Calculate: ${a} － ${b}`
          : `Υπολόγισε: ${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `${a} － ${b} ＝ －(${b} － ${a}) ＝ ${ans}.`
          : `${a} － ${b} ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 12. Δύο αρνητικοί σε απλοποιημένη γραφή (Input)
  (locale) => {
    const a = randInt(5, 18);
    const b = randInt(6, 22);
    const ans = -a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SIMPLIFIED NOTATION' : 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question:
        locale === 'en'
          ? `Calculate: －${a} － ${b}`
          : `Υπολόγισε: －${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `－${a} － ${b} ＝ －(${a} ＋ ${b}) ＝ ${ans}.`
          : `－${a} － ${b} ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 13. Κανόνας μετατροπής σε πρόσθεση (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'SUBTRACTION THEORY' : 'ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question:
        locale === 'en'
          ? 'Which equation expresses the fundamental rule of integer subtraction?'
          : 'Ποια ισότητα εκφράζει τον βασικό κανόνα της αφαίρεσης ακεραίων;',
      options: makeUniqueOptions(
        'α － β ＝ α ＋ (－β)',
        ['α － β ＝ α － (－β)', 'α － β ＝ (－α) ＋ β', 'α － β ＝ β － α']
      ),
      correctAnswer: 'α － β ＝ α ＋ (－β)',
      solution:
        locale === 'en'
          ? 'To subtract b from a, we add the opposite of b to a: α － β ＝ α ＋ (－β).'
          : 'Για να αφαιρέσουμε έναν αριθμό β από τον α, προσθέτουμε στον α τον αντίθετο του β: α － β ＝ α ＋ (－β).',
    };
  },

  // 14. Απαλοιφή διπλού αρνητικού προσήμου (MCQ)
  (locale) => {
    const n = randInt(12, 40);
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'REMOVING PARENTHESES' : 'ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ',
      question:
        locale === 'en'
          ? `How is the expression －(－${n}) simplified?`
          : `Πώς απλοποιείται η έκφραση －(－${n});`,
      options: makeUniqueOptions(`＋${n}`, [`－${n}`, '0', `＋1`]),
      correctAnswer: `＋${n}`,
      solution:
        locale === 'en'
          ? `A minus sign outside the parentheses inverts the inner term to its opposite: －(－${n}) ＝ ＋${n}.`
          : `Το πρόσημο πλην έξω από την παρένθεση αλλάζει το πρόσημο του εσωτερικού όρου στον αντίθετό του: －(－${n}) ＝ ＋${n}.`,
    };
  },

  // 15. Παράσταση τριών όρων με αφαιρέσεις (Input)
  (locale) => {
    const a = randInt(10, 25);
    const b = randInt(4, 15);
    const c = randInt(5, 18);
    const ans = a - b + c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMPOUND EXPRESSIONS' : 'ΣΥΝΘΕΤΕΣ ΠΑΡΑΣΤΑΣΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: (＋${a}) － (＋${b}) － (－${c})`
          : `Υπολόγισε: (＋${a}) － (＋${b}) － (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Convert to additions: (＋${a}) ＋ (－${b}) ＋ (＋${c}) ＝ ${a} － ${b} ＋ ${c} ＝ ${ans}.`
          : `Μετατρέπουμε σε προσθέσεις: (＋${a}) ＋ (－${b}) ＋ (＋${c}) ＝ ${a} － ${b} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 16. Εύρεση άγνωστου μειωτέου: x - (-b) = c (Input)
  (locale) => {
    const b = randInt(4, 12);
    const c = randInt(15, 30);
    const x = c - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SOLVING FOR UNKNOWN' : 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find the integer x such that: x － (－${b}) ＝ ${c}`
          : `Βρες τον ακέραιο x ώστε: x － (－${b}) ＝ ${c}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x － (－${b}) ＝ ${c} ⇔ x ＋ ${b} ＝ ${c} ⇔ x ＝ ${c} － ${b} ＝ ${x}.`
          : `x － (－${b}) ＝ ${c} ⇔ x ＋ ${b} ＝ ${c} ⇔ x ＝ ${c} － ${b} ＝ ${x}.`,
    };
  },

  // 17. Εύρεση άγνωστου αφαιρετέου: a - x = b (Input)
  (locale) => {
    const a = randInt(5, 15);
    const target = randInt(16, 25);
    const x = a - target;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SOLVING FOR UNKNOWN' : 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find the integer x such that: (＋${a}) － x ＝ ${target}`
          : `Βρες τον ακέραιο x ώστε: (＋${a}) － x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution:
        locale === 'en'
          ? `x ＝ (＋${a}) － ${target} ＝ ${a} － ${target} ＝ ${x}.`
          : `x ＝ (＋${a}) － ${target} ＝ ${a} － ${target} ＝ ${x}.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'No, it does not hold generally (only holds if α ＝ β)'
        : 'Όχι, γενικά δεν ισχύει (ισχύει μόνο αν α ＝ β)';
    const candidates =
      locale === 'en'
        ? ['Yes, it holds always', 'Holds only for positive integers', 'Holds only for negative integers']
        : ['Ναι, ισχύει πάντοτε', 'Ισχύει μόνο για θετικούς αριθμούς', 'Ισχύει μόνο για αρνητικούς αριθμούς'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'SUBTRACTION THEORY' : 'ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question:
        locale === 'en'
          ? 'Does the commutative property hold in integer subtraction (i.e. α － β ＝ β － α)?'
          : 'Ισχύει η αντιμεταθετική ιδιότητα στην αφαίρεση ακεραίων (δηλαδή α － β ＝ β － α);',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Subtraction is not commutative. The differences α － β and β － α are opposite numbers.'
          : 'Στην αφαίρεση δεν ισχύει η αντιμεταθετική ιδιότητα. Τα αποτελέσματα α － β και β － α είναι αντίθετοι αριθμοί.',
    };
  },

  // 19. Διαφορά απολύτων τιμών με αφαίρεση (Input)
  (locale) => {
    const a = randInt(10, 20);
    const b = randInt(2, 8);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE & SUBTRACTION' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΦΑΙΡΕΣΗ',
      question:
        locale === 'en'
          ? `Calculate the value: |(－${a}) － (＋${b})|`
          : `Υπολόγισε την τιμή: |(－${a}) － (＋${b})|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Inside the absolute value: (－${a}) ＋ (－${b}) ＝ －${a + b}. Thus |－${a + b}| ＝ ${ans}.`
          : `Μέσα στην απόλυτη τιμή: (－${a}) ＋ (－${b}) ＝ －${a + b}. Άρα |－${a + b}| ＝ ${ans}.`,
    };
  },

  // 20. Αφαίρεση με αντίθετους όρους (Input)
  (locale) => {
    const a = randInt(12, 35);
    const b = randInt(4, 16);
    const ans = -b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SMART COMPUTATION' : 'ΕΞΥΠΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate smartly: (＋${a}) － (＋${b}) － (＋${a})`
          : `Υπολόγισε έξυπνα: (＋${a}) － (＋${b}) － (＋${a})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${a}) ＋ (－${b}) ＋ (－${a}). The terms ＋${a} and －${a} are opposites and cancel to 0, leaving －${b}.`
          : `(＋${a}) ＋ (－${b}) ＋ (－${a}). Οι όροι ＋${a} και －${a} είναι αντίθετοι και δίνουν άθροισμα 0, άρα απομένει το －${b}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΑΦΑΙΡΕΣΗΣ & ΔΙΑΦΟΡΑΣ (i18n)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Θερμοκρασιακό εύρος (διαφορά μέγιστης - ελάχιστης)
  (locale) => {
    const minT = randInt(3, 8);
    const maxT = randInt(6, 15);
    const ans = maxT + minT;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In Tripoli the daily minimum temperature was －${minT} °C and the maximum was ＋${maxT} °C. What was the temperature range (maximum minus minimum) in °C?`
          : `Στην Τρίπολη η ελάχιστη θερμοκρασία της ημέρας ήταν －${minT} °C και η μέγιστη ＋${maxT} °C. Πόσους βαθμούς Κελσίου διαφορά είχαν η μέγιστη με την ελάχιστη θερμοκρασία;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Difference: (＋${maxT}) － (－${minT}) ＝ ${maxT} ＋ ${minT} ＝ ${ans} °C.`
          : `Υπολογίζουμε τη διαφορά μέγιστης μείον ελάχιστης: (＋${maxT}) － (－${minT}) ＝ ${maxT} ＋ ${minT} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Διαφορά υψομέτρου κορυφής και βυθού
  (locale) => {
    const mountain = randInt(800, 1800);
    const seaFloor = randInt(200, 600);
    const ans = mountain + seaFloor;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATION' : 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΟ',
      question:
        locale === 'en'
          ? `A mountain peak has an elevation of ＋${mountain} m and a nearby oceanic trench is at elevation －${seaFloor} m. What is their difference in elevation in meters?`
          : `Μια βουνοκορφή έχει υψόμετρο ＋${mountain} m και το πλησιέστερο θαλάσσιο ρήγμα έχει βάθος ${seaFloor} m (υψόμετρο －${seaFloor} m). Ποια είναι η υψομετρική τους διαφορά σε μέτρα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Subtract lowest from highest: (＋${mountain}) － (－${seaFloor}) ＝ ${mountain} ＋ ${seaFloor} ＝ ${ans} m.`
          : `Αφαιρούμε το χαμηλότερο υψόμετρο από το υψηλότερο: (＋${mountain}) － (－${seaFloor}) ＝ ${mountain} ＋ ${seaFloor} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 3: Διαφορά ετών π.Χ. και μ.Χ.
  (locale) => {
    const bc = randInt(25, 85);
    const ad = randInt(15, 60);
    const ans = ad + bc;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: HISTORICAL YEARS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΛΟΓΙΕΣ',
      question:
        locale === 'en'
          ? `An ancient philosopher was born in ${bc} BC (year －${bc}) and a disciple founded an academy in AD ${ad} (year ＋${ad}). How many years separate these two events?`
          : `Ένας αρχαίος φιλόσοφος γεννήθηκε το ${bc} π.Χ. (έτος －${bc}) και ένας μαθητής του ίδρυσε σχολή το ${ad} μ.Χ. (έτος ＋${ad}). Πόσα έτη χωρίζουν τα δύο αυτά ιστορικά γεγονότα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${ad}) － (－${bc}) ＝ ${ad} ＋ ${bc} ＝ ${ans} years.`
          : `Υπολογίζουμε τη διαφορά: (＋${ad}) － (－${bc}) ＝ ${ad} ＋ ${bc} ＝ ${ans} έτη.`,
    };
  },

  // Πρόβλημα 4: Διαφορά τραπεζικού υπολοίπου από χρέος σε κατάθεση
  (locale) => {
    const oldDebt = randInt(50, 120);
    const newCredit = randInt(80, 200);
    const ans = newCredit + oldDebt;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A merchant's bank balance was in the red at －${oldDebt} €. After a deposit the balance rose to ＋${newCredit} €. How many euros were added to the account?`
          : `Ο τραπεζικός λογαριασμός ενός επαγγελματία ήταν στο κόκκινο με υπόλοιπο －${oldDebt} €. Μετά από πληρωμή πελάτη το νέο υπόλοιπο έγινε ＋${newCredit} €. Πόσα ευρώ προστέθηκαν συνολικά στον λογαριασμό;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${newCredit}) － (－${oldDebt}) ＝ ${newCredit} ＋ ${oldDebt} ＝ ${ans} €. Total amount added.`
          : `Νέο υπόλοιπο μείον αρχικό υπόλοιπο: (＋${newCredit}) － (－${oldDebt}) ＝ ${newCredit} ＋ ${oldDebt} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Πόσο πρέπει να ανέβει η θερμοκρασία για να φτάσει στο 0
  (locale) => {
    const temp = randInt(4, 16);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `Inside a temperature chamber the reading is －${temp} °C. By how many degrees Celsius must the temperature rise to reach exactly 0 °C?`
          : `Σε έναν θάλαμο συντήρησης η θερμοκρασία είναι －${temp} °C. Πόσους βαθμούς Κελσίου πρέπει να ανέβει η θερμοκρασία ώστε να φτάσει ακριβώς στους 0 °C;`,
      correctAnswer: temp.toString(),
      solution:
        locale === 'en'
          ? `The difference is: 0 － (－${temp}) ＝ 0 ＋ ${temp} ＝ ${temp} °C.`
          : `Η διαφορά είναι: 0 － (－${temp}) ＝ 0 ＋ ${temp} ＝ ${temp} °C.`,
    };
  },

  // Πρόβλημα 6: Διαφορά δύο αρνητικών θερμοκρασιών
  (locale) => {
    const cold1 = randInt(2, 6);
    const cold2 = cold1 + randInt(5, 12);
    const ans = -cold1 - (-cold2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In Helsinki the temperature is －${cold1} °C, while in Siberia it is －${cold2} °C. How many degrees warmer is Helsinki than Siberia?`
          : `Στο Ελσίνκι η θερμοκρασία είναι －${cold1} °C, ενώ στη Σιβηρία είναι －${cold2} °C. Πόσους βαθμούς θερμότερο είναι το Ελσίνκι από τη Σιβηρία;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${cold1}) － (－${cold2}) ＝ －${cold1} ＋ ${cold2} ＝ ${ans} °C.`
          : `Αφαιρούμε τη χαμηλότερη θερμοκρασία από την υψηλότερη: (－${cold1}) － (－${cold2}) ＝ －${cold1} ＋ ${cold2} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 7: Διαφορά υψομέτρου δύο καταδύσεων
  (locale) => {
    const d1 = randInt(15, 30);
    const d2 = d1 + randInt(20, 45);
    const ans = -d1 - (-d2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A diver pauses first at elevation －${d1} m and then at －${d2} m. How many meters higher was the first stop compared to the second?`
          : `Ένας δύτης καταδύεται πρώτα σε βάθος ${d1} m (－${d1} m) και στη συνέχεια σε βάθος ${d2} m (－${d2} m). Πόσα μέτρα ψηλότερα ήταν η πρώτη του στάση σε σχέση με τη δεύτερη;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} m.`
          : `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 8: Διαφορά ορόφων ανελκυστήρα
  (locale) => {
    const basement = randInt(2, 4);
    const floor = randInt(4, 9);
    const ans = floor + basement;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATOR' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question:
        locale === 'en'
          ? `How many floors does an elevator travel when ascending from basement level ${basement} (floor －${basement}) to floor ${floor} (＋${floor})?`
          : `Πόσους ορόφους διανύει ένας ανελκυστήρας όταν ανεβαίνει από το ${basement}ο υπόγειο (όροφος －${basement}) μέχρι τον ${floor}ο όροφο (＋${floor});`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${floor}) － (－${basement}) ＝ ${floor} ＋ ${basement} ＝ ${ans} floors.`
          : `(＋${floor}) － (－${basement}) ＝ ${floor} ＋ ${basement} ＝ ${ans} όροφοι.`,
    };
  },

  // Πρόβλημα 9: Διαφορά σκορ σε τηλεπαιχνίδι
  (locale) => {
    const p1 = randInt(15, 40);
    const p2 = randInt(10, 35);
    const ans = p1 + p2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a game show finale, player 1 scored ＋${p1} points, while player 2 had penalties totaling －${p2} points. What was the score point difference between them?`
          : `Στον τελικό ενός κουίζ ο πρώτος παίκτης συγκέντρωσε ＋${p1} πόντους, ενώ ο δεύτερος παίκτης είχε ποινές και συγκέντρωσε －${p2} πόντους. Πόσους πόντους διαφορά είχαν οι δύο παίκτες;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} points.`
          : `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 10: Μείωση χρέους
  (locale) => {
    const initialDebt = randInt(120, 250);
    const payment = randInt(40, 90);
    const remainingDebt = initialDebt - payment;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A borrower's debt was initially ${initialDebt} € (balance －${initialDebt} €). After an installment, the debt dropped to ${remainingDebt} € (balance －${remainingDebt} €). What was the amount of the installment paid in €?`
          : `Το χρέος ενός δανειολήπτη ήταν αρχικά ${initialDebt} € (υπόλοιπο －${initialDebt} €). Μετά από μία δόση το χρέος μειώθηκε στα ${remainingDebt} € (υπόλοιπο －${remainingDebt} €). Πόσα ευρώ ήταν η δόση που πληρώθηκε;`,
      correctAnswer: payment.toString(),
      solution:
        locale === 'en'
          ? `(－${remainingDebt}) － (－${initialDebt}) ＝ －${remainingDebt} ＋ ${initialDebt} ＝ ${payment} €. Amount paid.`
          : `Η διαφορά των δύο καταστάσεων είναι: (－${remainingDebt}) － (－${initialDebt}) ＝ －${remainingDebt} ＋ ${initialDebt} ＝ ${payment} €.`,
    };
  },

  // Πρόβλημα 11: Μεταβολή θερμοκρασίας θαλάμου δοκιμών
  (locale) => {
    const tStart = randInt(10, 25);
    const tEnd = randInt(-15, -4);
    const drop = tStart - tEnd;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `Inside a test chamber the temperature fell from ＋${tStart} °C to ${tEnd} °C. By how many degrees Celsius did the temperature drop?`
          : `Σε έναν πειραματικό θάλαμο η θερμοκρασία μειώθηκε από τους ＋${tStart} °C στους ${tEnd} °C. Κατά πόσους βαθμούς Κελσίου έπεσε η θερμοκρασία;`,
      correctAnswer: drop.toString(),
      solution:
        locale === 'en'
          ? `Initial minus final: (＋${tStart}) － (${tEnd}) ＝ ${tStart} ＋ ${Math.abs(tEnd)} ＝ ${drop} °C.`
          : `Αρχική μείον τελική: (＋${tStart}) － (${tEnd}) ＝ ${tStart} ＋ ${Math.abs(tEnd)} ＝ ${drop} °C.`,
    };
  },

  // Πρόβλημα 12: Διαφορά υψομέτρου μεταξύ δύο πόλεων
  (locale) => {
    const highCity = randInt(600, 1100);
    const lowLake = randInt(50, 200);
    const ans = highCity + lowLake;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATION' : 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΟ',
      question:
        locale === 'en'
          ? `A highland town sits at elevation ＋${highCity} m, while a lakeside basin lies ${lowLake} m below sea level (－${lowLake} m). What is the difference in elevation between the two locations in meters?`
          : `Μια πόλη βρίσκεται σε υψόμετρο ＋${highCity} m, ενώ μια παραλίμνια περιοχή βρίσκεται σε βαθούλωμα ${lowLake} m κάτω από την επιφάνεια της θάλασσας (－${lowLake} m). Ποια είναι η υψομετρική διαφορά των δύο σημείων σε μέτρα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${highCity}) － (－${lowLake}) ＝ ${highCity} ＋ ${lowLake} ＝ ${ans} m.`
          : `(＋${highCity}) － (－${lowLake}) ＝ ${highCity} ＋ ${lowLake} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 13: Διαφορά τιμών μετοχής
  (locale) => {
    const lossDay = randInt(8, 20);
    const gainDay = randInt(5, 18);
    const ans = gainDay + lossDay;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: STOCK MARKET' : 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question:
        locale === 'en'
          ? `On Monday a stock index closed with a change of －${lossDay} points, while on Tuesday it recorded a gain of ＋${gainDay} points. By how many points did Tuesday outperform Monday?`
          : `Τη Δευτέρα μια μετοχή έκλεισε με μεταβολή －${lossDay} μονάδες, ενώ την Τρίτη σημείωσε άνοδο ＋${gainDay} μονάδες. Πόσες μονάδες καλύτερη ήταν η επίδοση της Τρίτης σε σύγκριση με τη Δευτέρα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${gainDay}) － (－${lossDay}) ＝ ${gainDay} ＋ ${lossDay} ＝ ${ans} points.`
          : `(＋${gainDay}) － (－${lossDay}) ＝ ${gainDay} ＋ ${lossDay} ＝ ${ans} μονάδες.`,
    };
  },

  // Πρόβλημα 14: Απόσταση στάθμης πετρελαιοπηγής
  (locale) => {
    const rigHeight = randInt(25, 45);
    const drillDepth = randInt(150, 300);
    const ans = rigHeight + drillDepth;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `The top of an offshore rig is ${rigHeight} m above sea level (＋${rigHeight} m), while its drill bit reaches a depth of ${drillDepth} m (－${drillDepth} m). What is the total vertical distance from top to drill bit in meters?`
          : `Η κορυφή μιας εξέδρας άντλησης βρίσκεται ${rigHeight} m πάνω από τη θάλασσα (＋${rigHeight} m), ενώ το τρυπάνι της έχει φτάσει σε βάθος ${drillDepth} m (－${drillDepth} m). Ποια είναι η συνολική απόσταση κορυφής και τρυπανιού σε μέτρα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${rigHeight}) － (－${drillDepth}) ＝ ${rigHeight} ＋ ${drillDepth} ＝ ${ans} m.`
          : `(＋${rigHeight}) － (－${drillDepth}) ＝ ${rigHeight} ＋ ${drillDepth} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 15: Διαφορά βαθμών ποινής
  (locale) => {
    const penA = randInt(10, 25);
    const penB = penA + randInt(6, 18);
    const ans = -penA - (-penB);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a competition Team A received －${penA} penalty points and Team B received －${penB} points. How many points more does Team A have than Team B?`
          : `Σε ένα τουρνουά η ομάδα Α συγκέντρωσε －${penA} πόντους και η ομάδα Β συγκέντρωσε －${penB} πόντους. Πόσους πόντους περισσότερους έχει η ομάδα Α από την ομάδα Β;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${penA}) － (－${penB}) ＝ －${penA} ＋ ${penB} ＝ ${ans} points.`
          : `(－${penA}) － (－${penB}) ＝ －${penA} ＋ ${penB} ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 16: Μεταβολή στάθμης ποταμού
  (locale) => {
    const low = randInt(15, 35);
    const high = randInt(20, 50);
    const ans = high + low;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WATER LEVEL' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question:
        locale === 'en'
          ? `In summer a river water level fell to ${low} cm below the average gauge (－${low} cm). In winter it rose to ${high} cm above the average (＋${high} cm). What was the total rise in cm?`
          : `Το καλοκαίρι η στάθμη ενός ποταμού ήταν ${low} cm κάτω από τον μέσο όρο (－${low} cm). Τον χειμώνα ανέβηκε στα ${high} cm πάνω από τον μέσο όρο (＋${high} cm). Ποια ήταν η συνολική άνοδος της στάθμης σε cm;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${high}) － (－${low}) ＝ ${high} ＋ ${low} ＝ ${ans} cm.`
          : `(＋${high}) － (－${low}) ＝ ${high} ＋ ${low} ＝ ${ans} cm.`,
    };
  },

  // Πρόβλημα 17: Κατάψυξη τροφίμων
  (locale) => {
    const roomT = randInt(18, 26);
    const freezerT = randInt(14, 22);
    const ans = roomT + freezerT;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `Food is transferred from room temperature ＋${roomT} °C to a deep freezer at －${freezerT} °C. By how many degrees Celsius was the food cooled?`
          : `Ένα τρόφιμο μεταφέρεται από θερμοκρασία δωματίου ＋${roomT} °C στην κατάψυξη στους －${freezerT} °C. Πόσους βαθμούς Κελσίου ψύχθηκε το τρόφιμο;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${roomT}) － (－${freezerT}) ＝ ${roomT} ＋ ${freezerT} ＝ ${ans} °C.`
          : `(＋${roomT}) － (－${freezerT}) ＝ ${roomT} ＋ ${freezerT} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 18: Διαφορά ετών ζωής ιστορικού προσώπου
  (locale) => {
    const birthBC = randInt(40, 80);
    const deathBC = birthBC - randInt(30, 55);
    const age = birthBC - deathBC;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: HISTORICAL YEARS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΛΟΓΙΕΣ',
      question:
        locale === 'en'
          ? `A Roman general was born in ${birthBC} BC (year －${birthBC}) and passed away in ${deathBC} BC (year －${deathBC}). At what age did he die?`
          : `Ένας Ρωμαίος στρατηγός γεννήθηκε το ${birthBC} π.Χ. (έτος －${birthBC}) και απεβίωσε το ${deathBC} π.Χ. (έτος －${deathBC}). Σε ποια ηλικία πέθανε;`,
      correctAnswer: age.toString(),
      solution:
        locale === 'en'
          ? `(－${deathBC}) － (－${birthBC}) ＝ －${deathBC} ＋ ${birthBC} ＝ ${age} years old.`
          : `Το έτος θανάτου είναι μεγαλύτερο: (－${deathBC}) － (－${birthBC}) ＝ －${deathBC} ＋ ${birthBC} ＝ ${age} έτη.`,
    };
  },

  // Πρόβλημα 19: Διαφορά πίεσης σε πείραμα
  (locale) => {
    const p1 = randInt(12, 28);
    const p2 = randInt(8, 24);
    const ans = p1 + p2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: PRESSURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΕΣΗ',
      question:
        locale === 'en'
          ? `In a gas line pressure was measured ＋${p1} kPa relative to atmosphere, while in a vacuum chamber it was ${p2} kPa below atmosphere (－${p2} kPa). What is their pressure difference in kPa?`
          : `Σε έναν αγωγό αερίου η πίεση μετρήθηκε ＋${p1} kPa πάνω από την ατμοσφαιρική, ενώ σε έναν θάλαμο κενού μετρήθηκε ${p2} kPa κάτω από την ατμοσφαιρική (－${p2} kPa). Ποια είναι η διαφορά πίεσης μεταξύ τους σε kPa;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} kPa.`
          : `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} kPa.`,
    };
  },

  // Πρόβλημα 20: Σύγκριση ελλείμματος δύο δήμων
  (locale) => {
    const d1 = randInt(30, 60);
    const d2 = d1 + randInt(15, 40);
    const ans = -d1 - (-d2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `Municipality A reported a fiscal deficit of ${d1} thousand euros (－${d1}), while Municipality B reported a deficit of ${d2} thousand euros (－${d2}). By how many thousand euros was Municipality A's outcome better?`
          : `Ο Δήμος Α κατέγραψε ταμειακό έλλειμμα ${d1} χιλιάδων ευρώ (－${d1}), ενώ ο Δήμος Β έλλειμμα ${d2} χιλιάδων ευρώ (－${d2}). Πόσες χιλιάδες ευρώ καλύτερο ήταν το ταμειακό αποτέλεσμα του Δήμου Α;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} thousand euros.`
          : `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} χιλιάδες ευρώ.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Αφαίρεση Ακεραίων | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στην αφαίρεση ομόσημων και ετερόσημων ακεραίων αριθμών.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Αφαίρεση Ακέραιων Αριθμών",
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
    metaTitle: "Exercises: Subtracting Integers | 7th Grade Mathematics",
    metaDescription: "Practice with 12 dynamic problems and word scenarios on integer subtraction.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Subtraction of Integers",
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

export default function AfairesiAkeraionAsk() {
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
          href="/a-gymnasiou/07-afairesi-akeraion"
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