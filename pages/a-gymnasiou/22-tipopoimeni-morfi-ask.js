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
    [arr[j], arr[i]] = [arr[j], arr[i]];
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

// Μετατροπή απλής συμβολοσειράς (π.χ. "5*10^6" ή "4*10^-4") σε κανονική μαθηματική μορφή δύναμης με <sup>
const renderPowerVisual = (ans) => {
  if (typeof ans !== 'string') return ans;
  if (!ans.includes('^')) return ans;

  // Αντικατάσταση μορφής βάσης * 10^k ή α · 10^k
  return ans
    .replace(/\*/g, ' · ')
    .replace(/\^([－-]?\d+)/g, '<sup>$1</sup>');
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Μετατροπή μεγάλου ακέραιου με πολλαπλά μηδενικά (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΓΑΛΟΣ ΑΡΙΘΜΟΣ' : 'LARGE NUMBER',
      question: locale === 'el'
        ? `Γράψε τον αριθμό <strong>5.000.000</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `Write the number <strong>5,000,000</strong> in standard form (format: a*10^k):`,
      correctAnswer: '5*10^6',
      solution: locale === 'el'
        ? `Ο αριθμός γράφεται 5 · 10<sup>6</sup> καθώς μετακινούμε την υποδιαστολή 6 θέσεις αριστερά.`
        : `The number is written as 5 · 10<sup>6</sup> by shifting the decimal point 6 places to the left.`,
    };
  },

  // 2. Μετατροπή δεκαδικού μικρότερου του 1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΙΚΡΟΣ ΑΡΙΘΜΟΣ' : 'SMALL NUMBER',
      question: locale === 'el'
        ? `Γράψε τον δεκαδικό <strong>0,0004</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `Write the decimal <strong>0.0004</strong> in standard form (format: a*10^k):`,
      correctAnswer: '4*10^-4',
      solution: locale === 'el'
        ? `Μετακινούμε την υποδιαστολή 4 θέσεις δεξιά: 4 · 10<sup>－4</sup>.`
        : `Move the decimal point 4 places to the right: 4 · 10<sup>-4</sup>.`,
    };
  },

  // 3. Εύρεση εκθέτη k σε μεγάλο αριθμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΕΚΘΕΤΗ' : 'FINDING EXPONENT',
      question: locale === 'el'
        ? `Αν 340.000 ＝ 3,4 · 10<sup>k</sup>, ποια είναι η τιμή του εκθέτη k;`
        : `If 340,000 ＝ 3.4 · 10<sup>k</sup>, what is the value of exponent k?`,
      correctAnswer: '5',
      solution: locale === 'el'
        ? `Η υποδιαστολή μετακινείται 5 θέσεις αριστερά από το τέλος μέχρι ανάμεσα στο 3 και το 4, άρα k ＝ 5.`
        : `The decimal point moves 5 places to the left, so k ＝ 5.`,
    };
  },

  // 4. Εύρεση εκθέτη k σε μικρό αριθμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΑΡΝΗΤΙΚΟΥ ΕΚΘΕΤΗ' : 'NEGATIVE EXPONENT',
      question: locale === 'el'
        ? `Αν 0,000072 ＝ 7,2 · 10<sup>k</sup>, ποια είναι η τιμή του εκθέτη k;`
        : `If 0.000072 ＝ 7.2 · 10<sup>k</sup>, what is the value of exponent k?`,
      correctAnswer: '-5',
      solution: locale === 'el'
        ? `Η υποδιαστολή μετακινείται 5 θέσεις δεξιά, άρα ο εκθέτης είναι αρνητικός: k ＝ －5.`
        : `The decimal point moves 5 places to the right, so the exponent is negative: k ＝ －5.`,
    };
  },

  // 5. Έλεγχος έγκυρης τυποποιημένης μορφής (MCQ)
  (locale) => {
    const correct = locale === 'el' ? '4,5 · 10<sup>7</sup>' : '4.5 · 10<sup>7</sup>';
    const wrongs = locale === 'el'
      ? ['45 · 10<sup>6</sup>', '0,45 · 10<sup>8</sup>', '450 · 10<sup>5</sup>']
      : ['45 · 10<sup>6</sup>', '0.45 · 10<sup>8</sup>', '450 · 10<sup>5</sup>'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΣΥΝΤΕΛΕΣΤΗ' : 'COEFFICIENT DEFINITION',
      question: locale === 'el'
        ? `Ποιος από τους παρακάτω αριθμούς είναι γραμμένος σε σωστή τυποποιημένη μορφή;`
        : `Which of the following numbers is written in correct standard form?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στην τυποποιημένη μορφή α · 10<sup>k</sup> πρέπει ο συντελεστής α να ικανοποιεί 1 ≤ |α| ＜ 10, δηλαδή να έχει ακριβώς ένα ψηφίο διάφορο του μηδενός αριστερά από την υποδιαστολή (εδώ το 4,5).`
        : `In standard form a · 10<sup>k</sup>, the coefficient a must satisfy 1 ≤ |a| ＜ 10 (here 4.5).`,
    };
  },

  // 6. Μετατροπή από τυποποιημένη σε δεκαδική μορφή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΑΠΤΥΓΜΑ ΔΥΝΑΜΗΣ' : 'DECIMAL EXPANSION',
      question: locale === 'el'
        ? `Ποιος φυσικός αριθμός αντιστοιχεί στην παράσταση <strong>2,5 · 10<sup>3</sup></strong>;`
        : `Which natural number corresponds to <strong>2.5 · 10<sup>3</sup></strong>?`,
      correctAnswer: '2500',
      solution: locale === 'el'
        ? `2,5 · 1.000 ＝ 2.500 (μετακινούμε την υποδιαστολή 3 θέσεις δεξιά).`
        : `2.5 · 1,000 ＝ 2,500 (shift the decimal point 3 places to the right).`,
    };
  },

  // 7. Μετατροπή αρνητικού εκθέτη σε δεκαδικό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΔΕΚΑΔΙΚΟ' : 'CONVERT TO DECIMAL',
      question: locale === 'el'
        ? `Γράψε ως δεκαδικό αριθμό την τιμή <strong>6 · 10<sup>-2</sup></strong>:`
        : `Write the value <strong>6 · 10<sup>-2</sup></strong> as a decimal number:`,
      correctAnswer: locale === 'el' ? '0,06' : '0.06',
      solution: locale === 'el'
        ? `6 · 0,01 ＝ 0,06 (μετακινούμε την υποδιαστολή 2 θέσεις αριστερά).`
        : `6 · 0.01 ＝ 0.06 (shift the decimal point 2 places to the left).`,
    };
  },

  // 8. Μετατροπή μη τυποποιημένης μορφής σε τυποποιημένη (MCQ)
  (locale) => {
    const correct = locale === 'el' ? '2,5 · 10<sup>5</sup>' : '2.5 · 10<sup>5</sup>';
    const wrongs = locale === 'el'
      ? ['2,5 · 10<sup>3</sup>', '0,25 · 10<sup>6</sup>', '25 · 10<sup>4</sup>']
      : ['2.5 · 10<sup>3</sup>', '0.25 · 10<sup>6</sup>', '25 · 10<sup>4</sup>'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΙΟΡΘΩΣΗ ΜΟΡΦΗΣ' : 'ADJUSTING NOTATION',
      question: locale === 'el'
        ? `Πώς γράφεται σωστά σε τυποποιημένη μορφή ο αριθμός 25 · 10<sup>4</sup>;`
        : `How is 25 · 10<sup>4</sup> correctly written in standard form?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `25 ＝ 2,5 · 10<sup>1</sup>. Άρα: (2,5 · 10<sup>1</sup>) · 10<sup>4</sup> ＝ 2,5 · 10<sup>5</sup>.`
        : `25 ＝ 2.5 · 10<sup>1</sup>. Thus: (2.5 · 10<sup>1</sup>) · 10<sup>4</sup> ＝ 2.5 · 10<sup>5</sup>.`,
    };
  },

  // 9. Μετατροπή δεκαδικού συντελεστή < 1 (MCQ)
  (locale) => {
    const correct = '3 · 10<sup>5</sup>';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΙΟΡΘΩΣΗ ΜΟΡΦΗΣ' : 'ADJUSTING NOTATION',
      question: locale === 'el'
        ? `Πώς γράφεται σωστά σε τυποποιημένη μορφή ο αριθμός 0,3 · 10<sup>6</sup>;`
        : `How is 0.3 · 10<sup>6</sup> correctly written in standard form?`,
      options: makeUniqueOptions(correct, [
        '3 · 10<sup>7</sup>',
        '3 · 10<sup>6</sup>',
        '30 · 10<sup>4</sup>',
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `0,3 ＝ 3 · 10<sup>-1</sup>. Άρα: (3 · 10<sup>-1</sup>) · 10<sup>6</sup> ＝ 3 · 10<sup>5</sup>.`
        : `0.3 ＝ 3 · 10<sup>-1</sup>. Thus: (3 · 10<sup>-1</sup>) · 10<sup>6</sup> ＝ 3 · 10<sup>5</sup>.`,
    };
  },

  // 10. Όριο συντελεστή α (MCQ)
  (locale) => {
    const correct = locale === 'el' ? '1 ≤ |α| ＜ 10' : '1 ≤ |a| ＜ 10';
    const wrongs = locale === 'el'
      ? ['0 ≤ |α| ＜ 1', '1 ＜ |α| ≤ 10', '0,1 ≤ |α| ＜ 1']
      : ['0 ≤ |a| ＜ 1', '1 ＜ |a| ≤ 10', '0.1 ≤ |a| ＜ 1'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ: ΟΡΙΑ ΣΥΝΤΕΛΕΣΤΗ' : 'COEFFICIENT BOUNDS',
      question: locale === 'el'
        ? `Ποιο διάστημα τιμών πρέπει να ικανοποιεί ο συντελεστής α στην τυποποιημένη μορφή α · 10<sup>k</sup>;`
        : `What range must coefficient a satisfy in the standard form a · 10<sup>k</sup>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ο συντελεστής α πρέπει να έχει απόλυτη τιμή τουλάχιστον 1 και αυστηρά μικρότερη από 10 (1 ≤ |α| ＜ 10).`
        : `The absolute value of coefficient a must be at least 1 and strictly less than 10 (1 ≤ |a| ＜ 10).`,
    };
  },

  // 11. Μετατροπή δεκαδικού με 2 σημαντικά ψηφία (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΙΚΡΟΣ ΔΕΚΑΔΙΚΟΣ' : 'SMALL DECIMAL',
      question: locale === 'el'
        ? `Γράψε τον αριθμό <strong>0,0056</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `Write <strong>0.0056</strong> in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '5,6*10^-3' : '5.6*10^-3',
      solution: locale === 'el'
        ? `Μετακινούμε την υποδιαστολή 3 θέσεις δεξιά: 5,6 · 10<sup>－3</sup>.`
        : `Shift the decimal point 3 places to the right: 5.6 · 10<sup>-3</sup>.`,
    };
  },

  // 12. Αρνητικός αριθμός σε τυποποιημένη μορφή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΑΡΙΘΜΟΣ' : 'NEGATIVE NUMBER',
      question: locale === 'el'
        ? `Γράψε τον αριθμό <strong>－82.000</strong> σε τυποποιημένη μορφή (μορφή: -α*10^k):`
        : `Write <strong>－82,000</strong> in standard form (format: -a*10^k):`,
      correctAnswer: locale === 'el' ? '-8,2*10^4' : '-8.2*10^4',
      solution: locale === 'el'
        ? `Διατηρούμε το αρνητικό πρόσημο και μετακινούμε την υποδιαστολή 4 θέσεις αριστερά: －8,2 · 10<sup>4</sup>.`
        : `Keep the negative sign and shift the decimal point 4 places to the left: －8.2 · 10<sup>4</sup>.`,
    };
  },

  // 13. Σύγκριση αριθμών σε τυποποιημένη μορφή (MCQ)
  (locale) => {
    const correct = '2 · 10<sup>6</sup> ＞ 3 · 10<sup>5</sup>';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΩΝ' : 'MAGNITUDE COMPARISON',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ των αριθμών 3 · 10<sup>5</sup> και 2 · 10<sup>6</sup>;`
        : `Which relation holds between 3 · 10<sup>5</sup> and 2 · 10<sup>6</sup>?`,
      options: makeUniqueOptions(correct, [
        '3 · 10<sup>5</sup> ＞ 2 · 10<sup>6</sup>',
        '3 · 10<sup>5</sup> ＝ 2 · 10<sup>6</sup>',
        locale === 'el' ? 'Δεν συγκρίνονται χωρίς υπολογιστή' : 'Cannot compare without a calculator',
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Μεγαλύτερος είναι ο αριθμός με τον μεγαλύτερο εκθέτη στη δύναμη του 10 (το 10<sup>6</sup> είναι ένα εκατομμύριο ενώ το 10<sup>5</sup> εκατό χιλιάδες): 2.000.000 ＞ 300.000.`
        : `The number with the greater power of 10 exponent is larger: 2,000,000 ＞ 300,000.`,
    };
  },

  // 14. Σύγκριση αρνητικών εκθετών (MCQ)
  (locale) => {
    const correct = locale === 'el' ? 'Ο 4 · 10<sup>-3</sup> είναι μεγαλύτερος' : '4 · 10<sup>-3</sup> is greater';
    const wrongs = locale === 'el'
      ? [
          'Ο 9 · 10<sup>-5</sup> είναι μεγαλύτερος γιατί έχει συντελεστή 9',
          'Είναι ίσοι',
          'Είναι και οι δύο αρνητικοί αριθμοί',
        ]
      : [
          '9 · 10<sup>-5</sup> is greater because the coefficient is 9',
          'They are equal',
          'Both are negative numbers',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΜΙΚΡΩΝ ΑΡΙΘΜΩΝ' : 'COMPARING SMALL NUMBERS',
      question: locale === 'el'
        ? `Ποιος αριθμός είναι μεγαλύτερος: ο 4 · 10<sup>-3</sup> ή ο 9 · 10<sup>-5</sup>;`
        : `Which number is greater: 4 · 10<sup>-3</sup> or 9 · 10<sup>-5</sup>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `4 · 10<sup>-3</sup> ＝ 0,004 ενώ 9 · 10<sup>-5</sup> ＝ 0,00009. Μεγαλύτερος είναι εκείνος με τον μεγαλύτερο (λιγότερο αρνητικό) εκθέτη: －3 ＞ －5.`
        : `4 · 10<sup>-3</sup> ＝ 0.004 while 9 · 10<sup>-5</sup> ＝ 0.00009. The one with the greater exponent is larger: －3 ＞ －5.`,
    };
  },

  // 15. Γινόμενο αριθμών σε τυποποιημένη μορφή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΓΙΝΟΜΕΝΟ' : 'PRODUCT',
      question: locale === 'el'
        ? `Υπολόγισε το γινόμενο σε τυποποιημένη μορφή: (2 · 10<sup>3</sup>) · (3 · 10<sup>4</sup>) (μορφή: α*10^k):`
        : `Calculate the product in standard form: (2 · 10<sup>3</sup>) · (3 · 10<sup>4</sup>) (format: a*10^k):`,
      correctAnswer: '6*10^7',
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε τους συντελεστές (2 · 3 ＝ 6) και προσθέτουμε τους εκθέτες (3 ＋ 4 ＝ 7): 6 · 10<sup>7</sup>.`
        : `Multiply the coefficients (2 · 3 ＝ 6) and add the exponents (3 ＋ 4 ＝ 7): 6 · 10<sup>7</sup>.`,
    };
  },

  // 16. Πηλίκο αριθμών σε τυποποιημένη μορφή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΗΛΙΚΟ' : 'QUOTIENT',
      question: locale === 'el'
        ? `Υπολόγισε το πηλίκο σε τυποποιημένη μορφή: (8 · 10<sup>6</sup>) ： (2 · 10<sup>2</sup>) (μορφή: α*10^k):`
        : `Calculate the quotient in standard form: (8 · 10<sup>6</sup>) ： (2 · 10<sup>2</sup>) (format: a*10^k):`,
      correctAnswer: '4*10^4',
      solution: locale === 'el'
        ? `Διαιρούμε τους συντελεστές (8 ： 2 ＝ 4) και αφαιρούμε τους εκθέτες (6 － 2 ＝ 4): 4 · 10<sup>4</sup>.`
        : `Divide the coefficients (8 ： 2 ＝ 4) and subtract the exponents (6 － 2 ＝ 4): 4 · 10<sup>4</sup>.`,
    };
  },

  // 17. Μετατροπή 1 εκατομμυρίου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΑΤΟΜΜΥΡΙΟ' : 'MILLION',
      question: locale === 'el'
        ? `Γράψε τον αριθμό 1.000.000 (1 εκατομμύριο) σε τυποποιημένη μορφή (μορφή: 1*10^k):`
        : `Write 1,000,000 (1 million) in standard form (format: 1*10^k):`,
      correctAnswer: '1*10^6',
      solution: locale === 'el'
        ? `1.000.000 ＝ 1 · 10<sup>6</sup>.`
        : `1,000,000 ＝ 1 · 10<sup>6</sup>.`,
    };
  },

  // 18. Μετατροπή 1 δισεκατομμυρίου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΣΕΚΑΤΟΜΜΥΡΙΟ' : 'BILLION',
      question: locale === 'el'
        ? `Γράψε τον αριθμό 1.000.000.000 (1 δισεκατομμύριο) σε τυποποιημένη μορφή (μορφή: 1*10^k):`
        : `Write 1,000,000,000 (1 billion) in standard form (format: 1*10^k):`,
      correctAnswer: '1*10^9',
      solution: locale === 'el'
        ? `1.000.000.000 ＝ 1 · 10<sup>9</sup>.`
        : `1,000,000,000 ＝ 1 · 10<sup>9</sup>.`,
    };
  },

  // 19. Μετατροπή 1 χιλιοστού (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΙΛΙΟΣΤΟ' : 'THOUSANDTH',
      question: locale === 'el'
        ? `Γράψε τον αριθμό 0,001 (1 χιλιοστό) σε τυποποιημένη μορφή (μορφή: 1*10^k):`
        : `Write 0.001 (1 thousandth) in standard form (format: 1*10^k):`,
      correctAnswer: '1*10^-3',
      solution: locale === 'el'
        ? `0,001 ＝ 1 · 10<sup>－3</sup>.`
        : `0.001 ＝ 1 · 10<sup>-3</sup>.`,
    };
  },

  // 20. Αριθμός μεταξύ 1 και 10 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΘΕΤΗΣ ΜΗΔΕΝ' : 'EXPONENT ZERO',
      question: locale === 'el'
        ? `Ποιος είναι ο εκθέτης k αν γράψουμε τον αριθμό 7 σε μορφή 7 · 10<sup>k</sup>;`
        : `What is exponent k if we write number 7 in the form 7 · 10<sup>k</sup>?`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Επειδή 7 ＝ 7 · 1 και 10<sup>0</sup> ＝ 1, ο εκθέτης είναι k ＝ 0.`
        : `Because 7 ＝ 7 · 1 and 10<sup>0</sup> ＝ 1, the exponent is k ＝ 0.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ταχύτητα του φωτός
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Η ταχύτητα του φωτός στο κενό είναι περίπου 300.000.000 m/s. Γράψε την τιμή αυτή σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The speed of light in vacuum is approximately 300,000,000 m/s. Write this value in standard form (format: a*10^k):`,
      correctAnswer: '3*10^8',
      solution: locale === 'el'
        ? `300.000.000 m/s ＝ 3 · 10<sup>8</sup> m/s.`
        : `300,000,000 m/s ＝ 3 · 10<sup>8</sup> m/s.`,
    };
  },

  // Πρόβλημα 2: Απόσταση Γης - Σελήνης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ' : 'PROBLEMS: ASTRONOMY',
      question: locale === 'el'
        ? `Η μέση απόσταση της Γης από τη Σελήνη είναι 384.000 km. Γράψε την απόσταση αυτή σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The average distance from Earth to the Moon is 384,000 km. Write this distance in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '3,84*10^5' : '3.84*10^5',
      solution: locale === 'el'
        ? `384.000 km ＝ 3,84 · 10<sup>5</sup> km.`
        : `384,000 km ＝ 3.84 · 10<sup>5</sup> km.`,
    };
  },

  // Πρόβλημα 3: Διάμετρος ερυθρού αιμοσφαιρίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ' : 'PROBLEMS: BIOLOGY',
      question: locale === 'el'
        ? `Η διάμετρος ενός ερυθρού αιμοσφαιρίου είναι περίπου 0,000007 μέτρα. Γράψε τη διάσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The diameter of a red blood cell is about 0.000007 meters. Write this dimension in standard form (format: a*10^k):`,
      correctAnswer: '7*10^-6',
      solution: locale === 'el'
        ? `0,000007 m ＝ 7 · 10<sup>－6</sup> m.`
        : `0.000007 m ＝ 7 · 10<sup>-6</sup> m.`,
    };
  },

  // Πρόβλημα 4: Πληθυσμός του πλανήτη
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΔΗΜΟΓΡΑΦΙΑ' : 'PROBLEMS: DEMOGRAPHY',
      question: locale === 'el'
        ? `Ο πληθυσμός της Γης εκτιμάται σε περίπου 8.000.000.000 ανθρώπους. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The world population is estimated at about 8,000,000,000 people. Write this number in standard form (format: a*10^k):`,
      correctAnswer: '8*10^9',
      solution: locale === 'el'
        ? `8.000.000.000 ＝ 8 · 10<sup>9</sup>.`
        : `8,000,000,000 ＝ 8 · 10<sup>9</sup>.`,
    };
  },

  // Πρόβλημα 5: Πάχος μεμβράνης κυττάρου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΚΡΟΒΙΟΛΟΓΙΑ' : 'PROBLEMS: MICROBIOLOGY',
      question: locale === 'el'
        ? `Το πάχος μιας κυτταρικής μεμβράνης είναι περίπου 0,000000008 μέτρα. Γράψε το μέγεθος σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The thickness of a cell membrane is about 0.000000008 meters. Write this measurement in standard form (format: a*10^k):`,
      correctAnswer: '8*10^-9',
      solution: locale === 'el'
        ? `0,000000008 m ＝ 8 · 10<sup>－9</sup> m.`
        : `0.000000008 m ＝ 8 · 10<sup>-9</sup> m.`,
    };
  },

  // Πρόβλημα 6: Απόσταση Γης - Ήλιου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ' : 'PROBLEMS: ASTRONOMY',
      question: locale === 'el'
        ? `Η απόσταση Γης - Ήλιου είναι περίπου 150.000.000 km. Γράψε την σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The distance from Earth to the Sun is about 150,000,000 km. Write this in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '1,5*10^8' : '1.5*10^8',
      solution: locale === 'el'
        ? `150.000.000 km ＝ 1,5 · 10<sup>8</sup> km.`
        : `150,000,000 km ＝ 1.5 · 10<sup>8</sup> km.`,
    };
  },

  // Πρόβλημα 7: Χρόνος παλμού λέιζερ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Ένας υπερταχύς παλμός λέιζερ διαρκεί 0,000000000012 δευτερόλεπτα. Γράψε τη διάρκεια σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `An ultrafast laser pulse lasts 0.000000000012 seconds. Write this duration in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '1,2*10^-11' : '1.2*10^-11',
      solution: locale === 'el'
        ? `0,000000000012 s ＝ 1,2 · 10<sup>－11</sup> s.`
        : `0.000000000012 s ＝ 1.2 · 10<sup>-11</sup> s.`,
    };
  },

  // Πρόβλημα 8: Αποθηκευτικός χώρος σκληρού δίσκου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ' : 'PROBLEMS: COMPUTER SCIENCE',
      question: locale === 'el'
        ? `Ένας σκληρός δίσκος χωρητικότητας 2 Terabytes αποθηκεύει 2.000.000.000.000 Bytes. Γράψε τη χωρητικότητα σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `A 2-Terabyte hard drive stores 2,000,000,000,000 Bytes. Write this capacity in standard form (format: a*10^k):`,
      correctAnswer: '2*10^12',
      solution: locale === 'el'
        ? `2.000.000.000.000 B ＝ 2 · 10<sup>12</sup> B.`
        : `2,000,000,000,000 B ＝ 2 · 10<sup>12</sup> B.`,
    };
  },

  // Πρόβλημα 9: Μέγεθος ιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΙΟΛΟΓΙΑ' : 'PROBLEMS: VIROLOGY',
      question: locale === 'el'
        ? `Η διάμετρος ενός ιού είναι περίπου 0,00000012 μέτρα. Γράψε τη διάμετρο σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The diameter of a virus is about 0.00000012 meters. Write the diameter in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '1,2*10^-7' : '1.2*10^-7',
      solution: locale === 'el'
        ? `0,00000012 m ＝ 1,2 · 10<sup>－7</sup> m.`
        : `0.00000012 m ＝ 1.2 · 10<sup>-7</sup> m.`,
    };
  },

  // Πρόβλημα 10: Ηλικία της Γης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΛΟΓΙΑ' : 'PROBLEMS: GEOLOGY',
      question: locale === 'el'
        ? `Η ηλικία της Γης υπολογίζεται σε 4.500.000.000 έτη. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The age of Earth is estimated at 4,500,000,000 years. Write this number in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '4,5*10^9' : '4.5*10^9',
      solution: locale === 'el'
        ? `4.500.000.000 ＝ 4,5 · 10<sup>9</sup> έτη.`
        : `4,500,000,000 ＝ 4.5 · 10<sup>9</sup> years.`,
    };
  },

  // Πρόβλημα 11: Μάζα σταγόνας νερού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΗΜΕΙΑ' : 'PROBLEMS: CHEMISTRY',
      question: locale === 'el'
        ? `Η μάζα μιας πολύ μικρής σταγόνας νερού είναι 0,00005 kg. Γράψε τη μάζα σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The mass of a tiny water drop is 0.00005 kg. Write this mass in standard form (format: a*10^k):`,
      correctAnswer: '5*10^-5',
      solution: locale === 'el'
        ? `0,00005 kg ＝ 5 · 10<sup>－5</sup> kg.`
        : `0.00005 kg ＝ 5 · 10<sup>-5</sup> kg.`,
    };
  },

  // Πρόβλημα 12: Συνολικά κύτταρα στο ανθρώπινο σώμα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΤΟΜΙΑ' : 'PROBLEMS: ANATOMY',
      question: locale === 'el'
        ? `Το ανθρώπινο σώμα αποτελείται από περίπου 37.000.000.000.000 κύτταρα. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The human body consists of about 37,000,000,000,000 cells. Write this number in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '3,7*10^13' : '3.7*10^13',
      solution: locale === 'el'
        ? `37.000.000.000.000 ＝ 3,7 · 10<sup>13</sup> κύτταρα.`
        : `37,000,000,000,000 ＝ 3.7 · 10<sup>13</sup> cells.`,
    };
  },

  // Πρόβλημα 13: Μήκος κύματος πράσινου φωτός
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΠΤΙΚΗ' : 'PROBLEMS: OPTICS',
      question: locale === 'el'
        ? `Το μήκος κύματος του πράσινου φωτός είναι 0,00000055 μέτρα. Γράψε το σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The wavelength of green light is 0.00000055 meters. Write this in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '5,5*10^-7' : '5.5*10^-7',
      solution: locale === 'el'
        ? `0,00000055 m ＝ 5,5 · 10<sup>－7</sup> m.`
        : `0.00000055 m ＝ 5.5 · 10<sup>-7</sup> m.`,
    };
  },

  // Πρόβλημα 14: Έτος φωτός σε χιλιόμετρα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΦΥΣΙΚΗ' : 'PROBLEMS: ASTROPHYSICS',
      question: locale === 'el'
        ? `Ένα έτος φωτός ισούται περίπου με 9.460.000.000.000 km. Γράψε την απόσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `One light-year equals approximately 9,460,000,000,000 km. Write this distance in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '9,46*10^12' : '9.46*10^12',
      solution: locale === 'el'
        ? `9.460.000.000.000 km ＝ 9,46 · 10<sup>12</sup> km.`
        : `9,460,000,000,000 km ＝ 9.46 · 10<sup>12</sup> km.`,
    };
  },

  // Πρόβλημα 15: Μέγεθος κόκκου γύρης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΟΤΑΝΙΚΗ' : 'PROBLEMS: BOTANY',
      question: locale === 'el'
        ? `Ένας κόκκος γύρης έχει διάμετρο 0,000025 μέτρα. Γράψε τη διάσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `A pollen grain has a diameter of 0.000025 meters. Write this dimension in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '2,5*10^-5' : '2.5*10^-5',
      solution: locale === 'el'
        ? `0,000025 m ＝ 2,5 · 10<sup>－5</sup> m.`
        : `0.000025 m ＝ 2.5 · 10<sup>-5</sup> m.`,
    };
  },

  // Πρόβλημα 16: Αριθμός αστεριών στον γαλαξία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ' : 'PROBLEMS: ASTRONOMY',
      question: locale === 'el'
        ? `Ο Γαλαξίας μας εκτιμάται ότι περιέχει περίπου 250.000.000.000 αστέρια. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `Our Galaxy is estimated to contain about 250,000,000,000 stars. Write this number in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '2,5*10^11' : '2.5*10^11',
      solution: locale === 'el'
        ? `250.000.000.000 ＝ 2,5 · 10<sup>11</sup> αστέρια.`
        : `250,000,000,000 ＝ 2.5 · 10<sup>11</sup> stars.`,
    };
  },

  // Πρόβλημα 17: Χρόνος ενός νανοδευτερολέπτου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΕΚΤΡΟΝΙΚΗ' : 'PROBLEMS: ELECTRONICS',
      question: locale === 'el'
        ? `Ένα νανοδευτερόλεπτο (1 ns) ισούται με 0,000000001 δευτερόλεπτα. Γράψε το σε τυποποιημένη μορφή (μορφή: 1*10^k):`
        : `One nanosecond (1 ns) equals 0.000000001 seconds. Write it in standard form (format: 1*10^k):`,
      correctAnswer: '1*10^-9',
      solution: locale === 'el'
        ? `0,000000001 s ＝ 1 · 10<sup>－9</sup> s.`
        : `0.000000001 s ＝ 1 · 10<sup>-9</sup> s.`,
    };
  },

  // Πρόβλημα 18: Όγκος νερού στους ωκεανούς
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΩΚΕΑΝΟΓΡΑΦΙΑ' : 'PROBLEMS: OCEANOGRAPHY',
      question: locale === 'el'
        ? `Ο συνολικός όγκος νερού στους ωκεανούς είναι περίπου 1.332.000.000 κυβικά χιλιόμετρα. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The total volume of water in the oceans is about 1,332,000,000 cubic kilometers. Write this number in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '1,332*10^9' : '1.332*10^9',
      solution: locale === 'el'
        ? `1.332.000.000 km<sup>3</sup> ＝ 1,332 · 10<sup>9</sup> km<sup>3</sup>.`
        : `1,332,000,000 km<sup>3</sup> ＝ 1.332 · 10<sup>9</sup> km<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 19: Μάζα μορίου οξυγόνου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΗΜΕΙΑ' : 'PROBLEMS: CHEMISTRY',
      question: locale === 'el'
        ? `Η μάζα ενός μορίου οξυγόνου είναι περίπου 0,000000000000000000000053 γραμμάρια (23 δεκαδικά ψηφία). Γράψε τη μάζα σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The mass of an oxygen molecule is about 0.000000000000000000000053 grams (23 decimal digits). Write this mass in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '5,3*10^-23' : '5.3*10^-23',
      solution: locale === 'el'
        ? `Μετακινούμε την υποδιαστολή 23 θέσεις δεξιά: 5,3 · 10<sup>－23</sup> g.`
        : `Move the decimal point 23 places to the right: 5.3 · 10<sup>-23</sup> g.`,
    };
  },

  // Πρόβλημα 20: Εκπομπή ενέργειας Ήλιου ανά δευτερόλεπτο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΦΥΣΙΚΗ' : 'PROBLEMS: ASTROPHYSICS',
      question: locale === 'el'
        ? `Ο Ήλιος ακτινοβολεί ενέργεια περίπου 380.000.000.000.000.000.000.000.000 Joules κάθε δευτερόλεπτο (26 μηδενικά). Γράψε την ενέργεια σε τυποποιημένη μορφή (μορφή: α*10^k):`
        : `The Sun radiates approximately 380,000,000,000,000,000,000,000,000 Joules of energy every second (26 zeros). Write this energy in standard form (format: a*10^k):`,
      correctAnswer: locale === 'el' ? '3,8*10^26' : '3.8*10^26',
      solution: locale === 'el'
        ? `380.000.000.000.000.000.000.000.000 J ＝ 3,8 · 10<sup>26</sup> J.`
        : `380,000,000,000,000,000,000,000,000 J ＝ 3.8 · 10<sup>26</sup> J.`,
    };
  },
];

export default function TipopoimeniMorfiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Τυποποιημένη Μορφή Αριθμών | Α' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην τυποποιημένη μορφή (επιστημονική σημειογραφία) μικρών και μεγάλων αριθμών για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 20 • ΕΞΑΣΚΗΣΗ",
      mainTitle: "Τυποποιημένη Μορφή Αριθμών",
      mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία τυποποιημένης μορφής ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
      problemBadge: "ΠΡΟΒΛΗΜΑ",
      placeholderInput: "π.χ. 3*10^8 ή 5",
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
      pageTitle: "Exercises: Standard Form of Numbers | 7th Grade",
      pageDesc: "12 dynamic exercises and problems on standard form (scientific notation) of small and large numbers for 7th Grade.",
      backText: "7th Grade",
      btnTheory: "THEORY",
      badgeHeader: "7TH GRADE • CHAPTER 20 • PRACTICE",
      mainTitle: "Standard Form of Numbers",
      mainSubtitle: "Solve the 12 selected exercises below (10 operations and standard form theory ＋ 2 real-world problems). Click 'CHECK ANSWERS' at the end to see your score and detailed solutions.",
      problemBadge: "PROBLEM",
      placeholderInput: "e.g. 3*10^8 or 5",
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
      clean = clean.replace(/[^0-9,*^·-]/g, '');
    } else {
      clean = clean.replace(/,/g, '.');
      clean = clean.replace(/[^0-9.*^·-]/g, '');
    }

    if (clean.length > 20) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  // Κανονικοποίηση απάντησης για σύγκριση
  const normalizeAnswer = (val) => {
    return (val || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/·/g, '*')
      .replace(/X/g, '*')
      .replace(/\./g, ',')
      .replace(/^\+/, '')
      .replace(/\(\+/g, '(')
      .replace(/\^(-?\d+)/g, '^$1');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userNorm = normalizeAnswer(userAnswers[q.id]);
      const correctNorm = normalizeAnswer(q.correctAnswer);

      // Έλεγχος ισότητας συμβολοσειράς
      if (userNorm === correctNorm) {
        totalCorrect += 1;
        return;
      }

      // Αν είναι απλός αριθμός, έλεγχος με ανοχή 0.05
      const uNum = parseFloat(userNorm.replace(',', '.'));
      const cNum = parseFloat(correctNorm.replace(',', '.'));
      if (!isNaN(uNum) && !isNaN(cNum) && !userNorm.includes('*') && !correctNorm.includes('*')) {
        if (Math.abs(uNum - cNum) < 0.05) {
          totalCorrect += 1;
        }
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
          href="/a-gymnasiou/22-tipopoimeni-morfi"
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
              const userNorm = normalizeAnswer(userAns);
              const correctNorm = normalizeAnswer(q.correctAnswer);

              let isCorrect = false;
              if (isSubmitted) {
                if (userNorm === correctNorm) {
                  isCorrect = true;
                } else {
                  const uNum = parseFloat(userNorm.replace(',', '.'));
                  const cNum = parseFloat(correctNorm.replace(',', '.'));
                  if (!isNaN(uNum) && !isNaN(cNum) && !userNorm.includes('*') && !correctNorm.includes('*')) {
                    isCorrect = Math.abs(uNum - cNum) < 0.05;
                  }
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
                          maxLength={20}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
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
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono break-words max-w-full">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1 inline-flex items-center flex-wrap"
                                dangerouslySetInnerHTML={{ __html: renderPowerVisual(q.correctAnswer) }}
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