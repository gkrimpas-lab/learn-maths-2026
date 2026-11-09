import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα κεφαλαία με εξαίρεση το "Α'"
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

// Βοηθητική συνάρτηση που εξασφαλίζει ΠΑΝΤΑ 4 μοναδικές επιλογές
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

// ==========================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ (i18n)
// ==========================================
const EXERCISE_GENERATORS = [
  // 1. Δύναμη φυσικού (Input)
  (locale) => {
    const base = randInt(2, 6);
    const exp = randInt(2, 4);
    const ans = Math.pow(base, exp);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ' : 'POWERS',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή της δύναμης: ${base}<sup>${exp}</sup>`
          : `Calculate the value of the power: ${base}<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `${base}<sup>${exp}</sup> ＝ ${Array(exp).fill(base).join(' · ')} ＝ ${ans}`,
    };
  },

  // 2. Δύναμη με εκθέτη 0 (MCQ)
  (locale) => {
    const base = randInt(12, 99);
    const correct = '1';
    const wrong = ['0', `${base}`, `${base * 10}`];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ' : 'PROPERTIES OF POWERS',
      question:
        locale === 'el'
          ? `Ποια είναι η τιμή της παράστασης ${base}<sup>0</sup> ;`
          : `What is the value of the expression ${base}<sup>0</sup> ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Για κάθε φυσικό αριθμό α ≠ 0 ισχύει εξ ορισμού ότι α<sup>0</sup> ＝ 1. Επομένως ${base}<sup>0</sup> ＝ 1.`
          : `For any natural number a ≠ 0, by definition a<sup>0</sup> ＝ 1. Therefore ${base}<sup>0</sup> ＝ 1.`,
    };
  },

  // 3. Δύναμη με βάση το 10 (Input)
  (locale) => {
    const exp = randInt(2, 5);
    const ans = Math.pow(10, exp);
    const formattedAns = ans.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10' : 'POWERS OF 10',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή της δύναμης του 10: 10<sup>${exp}</sup>`
          : `Calculate the value of the power of 10: 10<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Το 10<sup>${exp}</sup> ισούται με τη μονάδα ακολουθούμενη από ${exp} μηδενικά, δηλαδή ${formattedAns}.`
          : `10<sup>${exp}</sup> equals 1 followed by ${exp} zeros, which is ${formattedAns}.`,
    };
  },

  // 4. Επιμεριστική ιδιότητα ως προς την πρόσθεση (Input)
  (locale) => {
    const a = randInt(3, 8);
    const b = randInt(10, 20);
    const c = randInt(2, 9);
    const ans = a * (b + c);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ' : 'DISTRIBUTIVE PROPERTY',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή της παράστασης: ${a} · (${b} ＋ ${c})`
          : `Calculate the value of the expression: ${a} · (${b} ＋ ${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Εφαρμόζοντας την επιμεριστική ιδιότητα: ${a} · (${b} ＋ ${c}) ＝ ${a} · ${b} ＋ ${a} · ${c} ＝ ${a * b} ＋ ${a * c} ＝ ${ans}.`
          : `Applying the distributive property: ${a} · (${b} ＋ ${c}) ＝ ${a} · ${b} ＋ ${a} · ${c} ＝ ${a * b} ＋ ${a * c} ＝ ${ans}.`,
    };
  },

  // 5. Επιμεριστική ιδιότητα ως προς την αφαίρεση (Input)
  (locale) => {
    const a = randInt(4, 9);
    const b = randInt(15, 25);
    const c = randInt(2, 10);
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ' : 'DISTRIBUTIVE PROPERTY',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή: ${a} · ${b} － ${a} · ${c}`
          : `Calculate the value: ${a} · ${b} － ${a} · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Βγάζουμε κοινό παράγοντα το ${a}: ${a} · (${b} － ${c}) ＝ ${a} · ${b - c} ＝ ${ans}.`
          : `Factoring out ${a}: ${a} · (${b} － ${c}) ＝ ${a} · ${b - c} ＝ ${ans}.`,
    };
  },

  // 6. Αναγνώριση ιδιότητας πολλαπλασιασμού (MCQ)
  (locale) => {
    const a = randInt(12, 45);
    const b = randInt(50, 99);
    const correct = locale === 'el' ? 'Αντιμεταθετική ιδιότητα' : 'Commutative property';
    const wrong =
      locale === 'el'
        ? ['Προσεταιριστική ιδιότητα', 'Επιμεριστική ιδιότητα', 'Ουδέτερο στοιχείο']
        : ['Associative property', 'Distributive property', 'Identity element'];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ' : 'MULTIPLICATION PROPERTIES',
      question:
        locale === 'el'
          ? `Ποια ιδιότητα εκφράζει η ισότητα: ${a} · ${b} ＝ ${b} · ${a} ;`
          : `Which property is represented by the equality: ${a} · ${b} ＝ ${b} · ${a} ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Η αλλαγή της σειράς των παραγόντων χωρίς να μεταβάλλεται το γινόμενο είναι η Αντιμεταθετική ιδιότητα (α · β ＝ β · α).`
          : `Changing the order of factors without changing the product is the Commutative property (a · b ＝ b · a).`,
    };
  },

  // 7. Προσεταιριστική ιδιότητα (Input)
  (locale) => {
    const a = 25;
    const b = randInt(11, 39);
    const c = 4;
    const ans = a * b * c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΣΕΤΑΙΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ' : 'ASSOCIATIVE PROPERTY',
      question:
        locale === 'el'
          ? `Υπολόγισε έξυπνα το γινόμενο: ${a} · ${b} · ${c}`
          : `Calculate cleverly the product: ${a} · ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Ομαδοποιούμε προσεταιριστικά: (${a} · ${c}) · ${b} ＝ 100 · ${b} ＝ ${ans}.`
          : `Grouping associatively: (${a} · ${c}) · ${b} ＝ 100 · ${b} ＝ ${ans}.`,
    };
  },

  // 8. Μηδενικό στοιχείο πολλαπλασιασμού (MCQ)
  (locale) => {
    const a = randInt(10, 80);
    const b = randInt(10, 80);
    const correct = '0';
    const wrong = ['1', `${a * b}`, '15'];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ ΜΗΔΕΝ' : 'MULTIPLICATION BY ZERO',
      question:
        locale === 'el'
          ? `Ποιο είναι το αποτέλεσμα της παράστασης: (${a} · ${b}) · 0 · 15 ;`
          : `What is the result of the expression: (${a} · ${b}) · 0 · 15 ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Το 0 είναι το απορροφητικό (μηδενικό) στοιχείο του πολλαπλασιασμού: κάθε γινόμενο που περιέχει παράγοντα 0 ισούται με 0.`
          : `0 is the zero property of multiplication: any product containing a factor of 0 equals 0.`,
    };
  },

  // 9. Άθροισμα δυνάμεων (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const valA = Math.pow(a, 2);
    const valB = Math.pow(b, 3);
    const ans = valA + valB;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΕΩΝ' : 'POWER CALCULATIONS',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή: ${a}<sup>2</sup> ＋ ${b}<sup>3</sup>`
          : `Calculate the value: ${a}<sup>2</sup> ＋ ${b}<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `${a}<sup>2</sup> ＝ ${valA} και ${b}<sup>3</sup> ＝ ${valB}. Άρα ${valA} ＋ ${valB} ＝ ${ans}.`
          : `${a}<sup>2</sup> ＝ ${valA} and ${b}<sup>3</sup> ＝ ${valB}. Thus ${valA} ＋ ${valB} ＝ ${ans}.`,
    };
  },

  // 10. Προτεραιότητα πράξεων: Πολλαπλασιασμός πριν την πρόσθεση (Input)
  (locale) => {
    const a = randInt(10, 30);
    const b = randInt(3, 8);
    const c = randInt(4, 7);
    const ans = a + b * c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ' : 'ORDER OF OPERATIONS',
      question:
        locale === 'el'
          ? `Υπολόγισε το αποτέλεσμα: ${a} ＋ ${b} · ${c}`
          : `Calculate the result: ${a} ＋ ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Προηγείται ο πολλαπλασιασμός: ${b} · ${c} ＝ ${b * c}. Στη συνέχεια προσθέτουμε: ${a} ＋ ${b * c} ＝ ${ans}.`
          : `Multiplication takes precedence: ${b} · ${c} ＝ ${b * c}. Then we add: ${a} ＋ ${b * c} ＝ ${ans}.`,
    };
  },

  // 11. Προτεραιότητα πράξεων με δύναμη (Input)
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(2, 3);
    const c = randInt(5, 15);
    const bSquared = b * b;
    const aTimesBSquared = a * bSquared;
    const ans = aTimesBSquared + c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ' : 'ORDER OF OPERATIONS',
      question:
        locale === 'el'
          ? `Υπολόγισε: ${a} · ${b}<sup>2</sup> ＋ ${c}`
          : `Calculate: ${a} · ${b}<sup>2</sup> ＋ ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Πρώτα εκτελούμε τη δύναμη: ${b}<sup>2</sup> ＝ ${bSquared}. Μετά τον πολλαπλασιασμό: ${a} · ${bSquared} ＝ ${aTimesBSquared}. Τέλος την πρόσθεση: ${aTimesBSquared} ＋ ${c} ＝ ${ans}.`
          : `First evaluate the power: ${b}<sup>2</sup> ＝ ${bSquared}. Then multiplication: ${a} · ${bSquared} ＝ ${aTimesBSquared}. Finally addition: ${aTimesBSquared} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 12. Σύγκριση δυνάμεων (MCQ) - Αυστηρά 4 μοναδικές επιλογές με <sup>
  (locale) => {
    const correct = '2<sup>4</sup> ＝ 4<sup>2</sup>';
    const wrong = [
      '2<sup>4</sup> ＞ 4<sup>2</sup>',
      '2<sup>4</sup> ＜ 4<sup>2</sup>',
      '2<sup>4</sup> ＋ 4<sup>2</sup> ＝ 0',
    ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ' : 'COMPARING POWERS',
      question:
        locale === 'el'
          ? `Ποια σχέση ισχύει μεταξύ του 2<sup>4</sup> και του 4<sup>2</sup> ;`
          : `Which relation holds between 2<sup>4</sup> and 4<sup>2</sup> ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `2<sup>4</sup> ＝ 16 και 4<sup>2</sup> ＝ 16. Επομένως 2<sup>4</sup> ＝ 4<sup>2</sup>.`
          : `2<sup>4</sup> ＝ 16 and 4<sup>2</sup> ＝ 16. Therefore 2<sup>4</sup> ＝ 4<sup>2</sup>.`,
    };
  },

  // 13. Δύναμη με βάση το 0 (MCQ)
  (locale) => {
    const exp = randInt(3, 9);
    const correct = '0';
    const undefinedLabel = locale === 'el' ? 'Δεν ορίζεται' : 'Undefined';
    const wrong = ['1', `${exp}`, undefinedLabel];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ' : 'PROPERTIES OF POWERS',
      question:
        locale === 'el'
          ? `Ποια είναι η τιμή της δύναμης 0<sup>${exp}</sup> ;`
          : `What is the value of the power 0<sup>${exp}</sup> ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Για κάθε φυσικό αριθμό ν ≠ 0 ισχύει ότι 0<sup>ν</sup> ＝ 0.`
          : `For any natural number n ≠ 0, 0<sup>n</sup> ＝ 0.`,
    };
  },

  // 14. Δύναμη με βάση το 1 (MCQ)
  (locale) => {
    const exp = randInt(25, 150);
    const correct = '1';
    const wrong = ['0', `${exp}`, `${exp * 10}`];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ' : 'PROPERTIES OF POWERS',
      question:
        locale === 'el'
          ? `Ποια είναι η τιμή της δύναμης 1<sup>${exp}</sup> ;`
          : `What is the value of the power 1<sup>${exp}</sup> ?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Η μονάδα υψωμένη σε οποιαδήποτε δύναμη ισούται πάντα με 1 (1<sup>ν</sup> ＝ 1).`
          : `One raised to any power always equals 1 (1<sup>n</sup> ＝ 1).`,
    };
  },

  // 15. Γραφή γινομένου ως δύναμη (MCQ)
  (locale) => {
    const base = randInt(3, 7);
    let times = randInt(3, 6);
    while (times === base) {
      times = randInt(3, 6);
    }

    const prodStr = Array(times).fill(base).join(' · ');
    const correct = `${base}<sup>${times}</sup>`;
    const candidates = [
      `${times}<sup>${base}</sup>`,
      `${base} · ${times}`,
      `${base + times}`,
      `${base}<sup>${times + 1}</sup>`,
      `${base * times}`,
    ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΝΝΟΙΑ ΔΥΝΑΜΗΣ' : 'CONCEPT OF POWER',
      question:
        locale === 'el'
          ? `Πώς γράφεται συνοπτικά το γινόμενο: ${prodStr} ;`
          : `How is the product written concisely: ${prodStr} ?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Το γινόμενο ${times} ίσων παραγόντων με τιμή ${base} γράφεται ως δύναμη με βάση το ${base} και εκθέτη το ${times}, δηλαδή ${base}<sup>${times}</sup>.`
          : `The product of ${times} equal factors of ${base} is written as a power with base ${base} and exponent ${times}, that is ${base}<sup>${times}</sup>.`,
    };
  },

  // 16. Διαδοχικοί φυσικοί αριθμοί (Input)
  (locale) => {
    const n = randInt(15, 60);
    const ans = n + (n + 1);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΦΥΣΙΚΟΙ ΑΡΙΘΜΟΙ' : 'NATURAL NUMBERS',
      question:
        locale === 'el'
          ? `Βρες το άθροισμα του φυσικού αριθμού ${n} και του αμέσως επόμενου (διαδοχικού) του.`
          : `Find the sum of the natural number ${n} and its immediate consecutive number.`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Ο επόμενος του ${n} είναι ο ${n + 1}. Το άθροισμά τους είναι ${n} ＋ ${n + 1} ＝ ${ans}.`
          : `The consecutive number of ${n} is ${n + 1}. Their sum is ${n} ＋ ${n + 1} ＝ ${ans}.`,
    };
  },

  // 17. Πλήθος μηδενικών σε δύναμη του 10 (MCQ)
  (locale) => {
    const exp = randInt(4, 8);
    const correct = `${exp}`;
    const wrong = [`${exp - 1}`, `${exp + 1}`, `${exp * 10}`];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10' : 'POWERS OF 10',
      question:
        locale === 'el'
          ? `Πόσα μηδενικά έχει ο αριθμός που προκύπτει από τη δύναμη 10<sup>${exp}</sup> ;`
          : `How many zeros does the number resulting from 10<sup>${exp}</sup> have?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Σε κάθε δύναμη 10<sup>ν</sup>, ο αριθμός των μηδενικών μετά το 1 είναι ίσος με τον εκθέτη ν. Άρα έχει ${exp} μηδενικά.`
          : `For any power 10<sup>n</sup>, the number of zeros following 1 equals the exponent n. Thus it has ${exp} zeros.`,
    };
  },

  // 18. Ουδέτερο στοιχείο πολλαπλασιασμού (MCQ)
  (locale) => {
    const correct = locale === 'el' ? 'Το 1' : '1';
    const wrong =
      locale === 'el'
        ? ['Το 0', 'Το 2', 'Δεν υπάρχει']
        : ['0', '2', 'Does not exist'];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ' : 'MULTIPLICATION PROPERTIES',
      question:
        locale === 'el'
          ? `Ποιος αριθμός αποτελεί το ουδέτερο στοιχείο του πολλαπλασιασμού στους φυσικούς αριθμούς;`
          : `Which number is the identity element of multiplication for natural numbers?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution:
        locale === 'el'
          ? `Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού, επειδή α · 1 ＝ 1 · α ＝ α για κάθε φυσικό αριθμό α.`
          : `1 is the identity element of multiplication, because a · 1 ＝ 1 · a ＝ a for any natural number a.`,
    };
  },

  // 19. Προτεραιότητα παρενθέσεων και πολλαπλασιασμού (Input)
  (locale) => {
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const c = randInt(2, 5);
    const sumAB = a + b;
    const ans = sumAB * c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ' : 'ORDER OF OPERATIONS',
      question:
        locale === 'el'
          ? `Υπολόγισε το αποτέλεσμα: (${a} ＋ ${b}) · ${c}`
          : `Calculate the result: (${a} ＋ ${b}) · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `Πρώτα εκτελούμε την πράξη μέσα στην παρένθεση: ${a} ＋ ${b} ＝ ${sumAB}. Στη συνέχεια πολλαπλασιάζουμε: ${sumAB} · ${c} ＝ ${ans}.`
          : `First evaluate inside the parentheses: ${a} ＋ ${b} ＝ ${sumAB}. Then multiply: ${sumAB} · ${c} ＝ ${ans}.`,
    };
  },

  // 20. Διαφορά τετραγώνων φυσικών (Input)
  (locale) => {
    const a = randInt(6, 10);
    const b = randInt(2, 5);
    const sqA = a * a;
    const sqB = b * b;
    const ans = sqA - sqB;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΕΩΝ' : 'POWER CALCULATIONS',
      question:
        locale === 'el'
          ? `Υπολόγισε την τιμή: ${a}<sup>2</sup> － ${b}<sup>2</sup>`
          : `Calculate the value: ${a}<sup>2</sup> － ${b}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'el'
          ? `${a}<sup>2</sup> ＝ ${sqA} και ${b}<sup>2</sup> ＝ ${sqB}. Άρα ${sqA} － ${sqB} ＝ ${ans}.`
          : `${a}<sup>2</sup> ＝ ${sqA} and ${b}<sup>2</sup> ＝ ${sqB}. Thus ${sqA} － ${sqB} ＝ ${ans}.`,
    };
  },
];

// UI Λεξικό
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Φυσικοί Αριθμοί & Δυνάμεις | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση με 10 δυναμικές ασκήσεις στους φυσικούς αριθμούς, τον πολλαπλασιασμό και τις δυνάμεις για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις",
    mainSubtitle: "Απάντησε στις παρακάτω 10 επιλεγμένες ασκήσεις. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και την αναλυτική λύση κάθε άσκησης.",
    inputPlaceholder: "Απάντηση...",
    correctTag: "ΣΩΣΤΟ",
    wrongTag: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkAnswers: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    checkShort: "ΕΛΕΓΧΟΣ",
    newExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    retryShort: "ΕΠΑΝΑΛΗΨΗ",
    finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progress: "ΠΡΟΟΔΟΣ",
    successRate: "ΕΠΙΤΥΧΙΑ",
  },
  en: {
    metaTitle: "Exercises: Natural Numbers & Powers | 7th Grade",
    metaDescription: "Practice with 10 dynamic exercises on natural numbers, multiplication, and powers for 7th Grade.",
    backText: "7th Grade",
    actionButton: "THEORY",
    badge: "7TH GRADE • PRACTICE",
    mainTitle: "Natural Numbers, Multiplication & Powers",
    mainSubtitle: "Answer the following 10 selected exercises. Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    inputPlaceholder: "Answer...",
    correctTag: "CORRECT",
    wrongTag: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkAnswers: "CHECK ANSWERS",
    checkShort: "CHECK",
    newExercises: "NEW EXERCISES",
    retryShort: "RETRY",
    finalScore: "FINAL SCORE",
    progress: "PROGRESS",
    successRate: "SUCCESS RATE",
  },
};

export default function FysikoiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

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

  // Αυστηρός έλεγχος εισαγωγής input
  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,]/g, '');
    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  // Έλεγχος απαντήσεων
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      const correctAns = q.correctAnswer.trim().replace(/\s+/g, '');
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
          href="/a-gymnasiou/01-fysikoi"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.actionButton)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* Banner Header - Ενιαίο Indigo Theme της Α' Γυμνασίου */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.mainTitle}
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
              const isCorrect =
                isSubmitted &&
                userAns.trim().replace(/\s+/g, '') ===
                  q.correctAnswer.trim().replace(/\s+/g, '');

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                        {q.id}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Τύπος Ερώτησης: Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder={t.inputPlaceholder}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
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
                              className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words whitespace-normal leading-snug flex-1 mr-2"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Αναλυτική Λύση μετά την υποβολή */}
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
                            <span>{toCleanUppercase(t.correctTag)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongTag)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/70 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1 border-t border-slate-200/60 font-mono"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Υποβολής εντός φόρμας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswers)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercises)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? toCleanUppercase(t.finalScore) : toCleanUppercase(t.progress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
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
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercises)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.retryShort)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}