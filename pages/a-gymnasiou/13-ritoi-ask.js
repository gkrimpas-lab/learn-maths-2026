import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων: άτονα παντού εκτός από το "Α'"
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

// Helper για responsive κατακόρυφη κλασματική γραφή σε HTML string
const htmlFrac = (num, den, isNeg = false) => {
  const numericNeg = (typeof num === 'number' && num < 0) || (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;
  const absNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const absDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    showMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${absNum}</span><span class="pt-0.5 px-0.5 sm:px-1 break-all">${absDen}</span></span></span>`;
};

// Συγκεντρωτικό Λεξικό Μεταφράσεων i18n
const translations = {
  el: {
    pageTitle: "Ασκήσεις: Ρητοί Αριθμοί | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην έννοια των ρητών αριθμών και τις μετατροπές κλασμάτων και δεκαδικών.",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badgeChapter: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 11 • ΕΞΑΣΚΗΣΗ",
    titleMain: "Η Έννοια των Ρητών Αριθμών",
    descMain: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία μετατροπών ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    badgeProblem: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 0,75 ή 3/4",
    correctLabel: "ΣΩΣΤΟ",
    wrongLabel: "ΛΑΘΟΣ",
    correctAnswerText: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    btnSubmit: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    btnRetry: "ΕΠΑΝΑΛΗΨΗ",
    scoreFinal: "ΤΕΛΙΚΟ ΣΚΟΡ",
    scoreProgress: "ΠΡΟΟΔΟΣ",
    scoreSuccess: "ΕΠΙΤΥΧΙΑ",
    btnCheckShort: "ΕΛΕΓΧΟΣ",
  },
  en: {
    pageTitle: "Exercises: Rational Numbers | Grade 7",
    pageDesc: "12 dynamic exercises and word problems on rational numbers and fraction-decimal conversions.",
    backText: "Grade 7",
    btnTheory: "THEORY",
    badgeChapter: "GRADE 7 • CHAPTER 11 • PRACTICE",
    titleMain: "The Concept of Rational Numbers",
    descMain: "Solve the following 12 selected exercises (10 calculation/theory questions ＋ 2 real-life word problems). Click «CHECK ANSWERS» at the bottom to view your score and detailed solutions.",
    badgeProblem: "PROBLEM",
    placeholderInput: "e.g. 0.75 or 3/4",
    correctLabel: "CORRECT",
    wrongLabel: "INCORRECT",
    correctAnswerText: "CORRECT ANSWER:",
    btnSubmit: "CHECK ANSWERS",
    btnNewExercises: "NEW EXERCISES",
    btnRetry: "RETRY",
    scoreFinal: "FINAL SCORE",
    scoreProgress: "PROGRESS",
    scoreSuccess: "SCORE",
    btnCheckShort: "CHECK",
  }
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΕΤΑΤΡΟΠΩΝ & ΘΕΩΡΙΑΣ ΡΗΤΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Μετατροπή απλού κλάσματος σε δεκαδικό (Input)
  (locale) => {
    const pairs = [
      { num: 1, den: 2, dec: 0.5 },
      { num: 1, den: 4, dec: 0.25 },
      { num: 3, den: 4, dec: 0.75 },
      { num: 1, den: 5, dec: 0.2 },
      { num: 2, den: 5, dec: 0.4 },
      { num: 3, den: 5, dec: 0.6 },
      { num: 4, den: 5, dec: 0.8 },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ' : 'FRACTION TO DECIMAL',
      question: locale === 'el'
        ? `Μετάτρεψε το κλάσμα ${htmlFrac(item.num, item.den)} σε δεκαδικό αριθμό:`
        : `Convert the fraction ${htmlFrac(item.num, item.den)} into a decimal:`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Εκτελούμε τη διαίρεση: ${item.num} : ${item.den} ＝ ${decStr}.`
        : `Perform division: ${item.num} : ${item.den} ＝ ${decStr}.`,
    };
  },

  // 2. Μετατροπή αρνητικού κλάσματος σε δεκαδικό (Input)
  (locale) => {
    const pairs = [
      { num: -3, den: 4, dec: -0.75 },
      { num: -1, den: 2, dec: -0.5 },
      { num: -3, den: 5, dec: -0.6 },
      { num: -1, den: 4, dec: -0.25 },
      { num: -7, den: 10, dec: -0.7 },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    const posDecStr = Math.abs(item.dec).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟ ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ' : 'NEGATIVE FRACTION TO DECIMAL',
      question: locale === 'el'
        ? `Μετάτρεψε το αρνητικό κλάσμα ${htmlFrac(item.num, item.den)} σε δεκαδική μορφή:`
        : `Convert the negative fraction ${htmlFrac(item.num, item.den)} into decimal form:`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Το κλάσμα είναι αρνητικό. Διαιρούμε ${Math.abs(item.num)} : ${item.den} ＝ ${posDecStr} και βάζουμε το πρόσημο μείον: ${decStr}.`
        : `The fraction is negative. Divide ${Math.abs(item.num)} : ${item.den} ＝ ${posDecStr} and append the negative sign: ${decStr}.`,
    };
  },

  // 3. Μετατροπή δεκαδικού σε ανάγωγο κλάσμα (Input)
  (locale) => {
    const items = [
      { dec: 0.5, num: 1, den: 2 },
      { dec: 0.25, num: 1, den: 4 },
      { dec: 0.75, num: 3, den: 4 },
      { dec: 0.2, num: 1, den: 5 },
      { dec: 0.4, num: 2, den: 5 },
      { dec: 0.6, num: 3, den: 5 },
      { dec: 0.8, num: 4, den: 5 },
    ];
    const item = items[randInt(0, items.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ' : 'DECIMAL TO IRREDUCIBLE FRACTION',
      question: locale === 'el'
        ? `Γράψε τον δεκαδικό αριθμό <strong>${decStr}</strong> ως ανάγωγο κλάσμα (π.χ. 3/4):`
        : `Write the decimal <strong>${decStr}</strong> as an irreducible fraction (e.g. 3/4):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac(item.dec * 100, 100)} ＝ ${htmlFrac(item.num, item.den)} (απλοποιημένο σε ανάγωγο).`
        : `${decStr} ＝ ${htmlFrac(item.dec * 100, 100)} ＝ ${htmlFrac(item.num, item.den)} (simplified to irreducible form).`,
    };
  },

  // 4. Μετατροπή αρνητικού δεκαδικού σε ανάγωγο κλάσμα (Input)
  (locale) => {
    const items = [
      { dec: -0.5, num: -1, den: 2 },
      { dec: -0.25, num: -1, den: 4 },
      { dec: -0.75, num: -3, den: 4 },
      { dec: -0.2, num: -1, den: 5 },
      { dec: -0.4, num: -2, den: 5 },
    ];
    const item = items[randInt(0, items.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ ΣΕ ΚΛΑΣΜΑ' : 'NEGATIVE DECIMAL TO FRACTION',
      question: locale === 'el'
        ? `Γράψε τον αριθμό <strong>${decStr}</strong> ως ανάγωγο κλάσμα (π.χ. -3/4):`
        : `Write the number <strong>${decStr}</strong> as an irreducible fraction (e.g. -3/4):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: locale === 'el'
        ? `Το πρόσημο μείον μπαίνει μπροστά: ${decStr} ＝ ${htmlFrac(item.num, item.den)}.`
        : `The negative sign is placed in front: ${decStr} ＝ ${htmlFrac(item.num, item.den)}.`,
    };
  },

  // 5. Μετατροπή κλάσματος με παρονομαστή 100 σε δεκαδικό (Input)
  (locale) => {
    const num = randInt(11, 89);
    const den = 100;
    const decStr = (num / den).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ' : 'DECIMAL FRACTIONS',
      question: locale === 'el'
        ? `Γράψε σε δεκαδική μορφή το κλάσμα ${htmlFrac(num, den)}:`
        : `Write the fraction ${htmlFrac(num, den)} in decimal form:`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Διαιρούμε με το 100 μετακινώντας την υποδιαστολή δύο θέσεις αριστερά: ${num} : 100 ＝ ${decStr}.`
        : `Divide by 100 by shifting the decimal point two places left: ${num} : 100 ＝ ${decStr}.`,
    };
  },

  // 6. Πεπερασμένος ή περιοδικός δεκαδικός (MCQ)
  (locale) => {
    const optionsPool = [
      {
        fNum: 1,
        fDen: 3,
        typeEl: 'Περιοδικός δεκαδικός (0,333...)',
        wrongEl: 'Πεπερασμένος δεκαδικός (τελειώνει)',
        typeEn: 'Repeating decimal (0.333...)',
        wrongEn: 'Terminating decimal',
      },
      {
        fNum: 1,
        fDen: 6,
        typeEl: 'Περιοδικός δεκαδικός (0,166...)',
        wrongEl: 'Πεπερασμένος δεκαδικός (τελειώνει)',
        typeEn: 'Repeating decimal (0.166...)',
        wrongEn: 'Terminating decimal',
      },
      {
        fNum: 3,
        fDen: 8,
        typeEl: 'Πεπερασμένος δεκαδικός (0,375)',
        wrongEl: 'Περιοδικός δεκαδικός',
        typeEn: 'Terminating decimal (0.375)',
        wrongEn: 'Repeating decimal',
      },
      {
        fNum: 7,
        fDen: 20,
        typeEl: 'Πεπερασμένος δεκαδικός (0,35)',
        wrongEl: 'Περιοδικός δεκαδικός',
        typeEn: 'Terminating decimal (0.35)',
        wrongEn: 'Repeating decimal',
      },
    ];
    const item = optionsPool[randInt(0, optionsPool.length - 1)];
    const correct = locale === 'el' ? item.typeEl : item.typeEn;
    const wrong = locale === 'el' ? item.wrongEl : item.wrongEn;
    const extra1 = locale === 'el' ? 'Ακέραιο αριθμό' : 'Integer';
    const extra2 = locale === 'el' ? 'Μη πραγματικό αριθμό' : 'Non-real number';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΕΠΕΡΑΣΜΕΝΟΙ & ΠΕΡΙΟΔΙΚΟΙ' : 'TERMINATING & REPEATING',
      question: locale === 'el'
        ? `Τι είδους δεκαδικό αριθμό παράγει η διαίρεση του κλάσματος ${htmlFrac(item.fNum, item.fDen)};`
        : `What type of decimal is produced by dividing the fraction ${htmlFrac(item.fNum, item.fDen)}?`,
      options: makeUniqueOptions(correct, [wrong, extra1, extra2]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ο παρονομαστής καθορίζει τη μορφή. Το κλάσμα παράγει: ${correct}.`
        : `The denominator determines the form. The fraction yields: ${correct}.`,
    };
  },

  // 7. Ακέραιος ως ρητός αριθμός (Input)
  (locale) => {
    const n = randInt(6, 25);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΝΝΟΙΑ ΡΗΤΟΥ ΑΡΙΘΜΟΥ' : 'CONCEPT OF RATIONAL NUMBER',
      question: locale === 'el'
        ? `Αν γράψουμε τον ακέραιο <strong>－${n}</strong> στη μορφή κλάσματος με παρονομαστή το 1, ποιος είναι ο αριθμητής;`
        : `If we express the integer <strong>－${n}</strong> as a fraction with denominator 1, what is the numerator?`,
      correctAnswer: `-${n}`,
      solution: locale === 'el'
        ? `Κάθε ακέραιος α γράφεται ως ${htmlFrac('α', '1')}. Άρα το －${n} γράφεται ${htmlFrac(-n, 1)} με αριθμητή το －${n}.`
        : `Every integer a can be written as ${htmlFrac('a', '1')}. Thus －${n} is written as ${htmlFrac(-n, 1)} with numerator －${n}.`,
    };
  },

  // 8. Απλοποίηση κλάσματος σε ανάγωγο (Input)
  (locale) => {
    const factor = randInt(2, 5);
    const redN = randInt(2, 7);
    const redD = randInt(8, 15);
    const g0 = gcd(redN, redD);
    const finalN = redN / g0;
    const finalD = redD / g0;
    const num = finalN * factor;
    const den = finalD * factor;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ' : 'IRREDUCIBLE FRACTION',
      question: locale === 'el'
        ? `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`
        : `Simplify the fraction ${htmlFrac(num, den)} to its irreducible form (format a/b):`,
      correctAnswer: `${finalN}/${finalD}`,
      solution: locale === 'el'
        ? `Διαιρούμε αριθμητή και παρονομαστή με τον Μ.Κ.Δ. (${factor}) και βρίσκουμε: ${htmlFrac(finalN, finalD)}.`
        : `Divide both numerator and denominator by their GCD (${factor}) to get: ${htmlFrac(finalN, finalD)}.`,
    };
  },

  // 9. Ισοδύναμα κλάσματα με αρνητικό πρόσημο (MCQ)
  (locale) => {
    const n = randInt(2, 5);
    const d = randInt(6, 9);
    const correct = locale === 'el'
      ? 'Το πλην μπορεί να τοποθετηθεί μπροστά από τη γραμμή, στον αριθμητή ή στον παρονομαστή'
      : 'The minus sign can be placed before the fraction bar, in the numerator, or in the denominator';
    const candidates = locale === 'el'
      ? [
          'Το πλην επιτρέπεται να μπει μόνο στον αριθμητή',
          'Το πλην επιτρέπεται να μπει μόνο στον παρονομαστή',
          'Αν αλλάξει θέση το πλην, αλλάζει η τιμή του κλάσματος',
        ]
      : [
          'The minus sign is only permitted in the numerator',
          'The minus sign is only permitted in the denominator',
          'Changing the position of the minus sign changes the value of the fraction',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΡΟΣΗΜΟ ΚΛΑΣΜΑΤΟΣ' : 'SIGN OF A FRACTION',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω προτάσεις για το πρόσημο ενός αρνητικού κλάσματος ${htmlFrac(-n, d)} είναι σωστή;`
        : `Which statement regarding the sign of a negative fraction ${htmlFrac(-n, d)} is correct?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ισχύει πάντοτε: －${htmlFrac('α', 'β')} ＝ ${htmlFrac('－α', 'β')} ＝ ${htmlFrac('α', '－β')}.`
        : `It always holds: －${htmlFrac('a', 'b')} ＝ ${htmlFrac('－a', 'b')} ＝ ${htmlFrac('a', '－b')}.`,
    };
  },

  // 10. Δεκαδικός με ακέραιο μέρος σε κλάσμα (Input)
  (locale) => {
    const items = [
      { dec: 1.5, num: 3, den: 2 },
      { dec: 2.5, num: 5, den: 2 },
      { dec: 1.25, num: 5, den: 4 },
      { dec: 1.2, num: 6, den: 5 },
      { dec: 1.75, num: 7, den: 4 },
    ];
    const item = items[randInt(0, items.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ' : 'DECIMAL TO IRREDUCIBLE FRACTION',
      question: locale === 'el'
        ? `Μετάτρεψε τον αριθμό <strong>${decStr}</strong> σε ανάγωγο κλάσμα (π.χ. 3/2):`
        : `Convert the number <strong>${decStr}</strong> into an irreducible fraction (e.g. 3/2):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac(item.dec * 100, 100)} ＝ ${htmlFrac(item.num, item.den)} (ανάγωγο).`
        : `${decStr} ＝ ${htmlFrac(item.dec * 100, 100)} ＝ ${htmlFrac(item.num, item.den)} (irreducible).`,
    };
  },

  // 11. Ποιοι αριθμοί ανήκουν στο σύνολο ℚ (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Όλοι οι ακέραιοι, τα κλάσματα και οι πεπερασμένοι/περιοδικοί δεκαδικοί'
      : 'All integers, fractions, and terminating or repeating decimals';
    const candidates = locale === 'el'
      ? [
          'Μόνο οι θετικοί ακέραιοι αριθμοί',
          'Μόνο τα κλάσματα με θετικούς όρους',
          'Μόνο οι αριθμοί που δεν έχουν υποδιαστολή',
        ]
      : [
          'Only positive integers',
          'Only fractions with positive terms',
          'Only numbers without a decimal point',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ: ΤΟ ΣΥΝΟΛΟ Q' : 'THEORY: THE SET Q',
      question: locale === 'el'
        ? `Ποιοι από τους παρακάτω αριθμούς είναι ρητοί αριθμοί;`
        : `Which of the following numbers are rational numbers?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το σύνολο των ρητών ℚ περιλαμβάνει όλους τους αριθμούς που μπορούν να γραφούν ως πηλίκο δύο ακεραίων (${htmlFrac('α', 'β')} με β ≠ 0).`
        : `The set ℚ of rational numbers contains all numbers that can be written as a quotient of two integers (${htmlFrac('a', 'b')} with b ≠ 0).`,
    };
  },

  // 12. Μετατροπή κλάσματος σε εκατοστά (Input)
  (locale) => {
    const pairs = [
      { num: 1, den: 4, dec: 0.25 },
      { num: 3, den: 20, dec: 0.15 },
      { num: 7, den: 25, dec: 0.28 },
      { num: 9, den: 50, dec: 0.18 },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ' : 'FRACTION TO DECIMAL',
      question: locale === 'el'
        ? `Υπολόγισε τη δεκαδική μορφή του κλάσματος ${htmlFrac(item.num, item.den)}:`
        : `Calculate the decimal form of the fraction ${htmlFrac(item.num, item.den)}:`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε κατάλληλα ώστε ο παρονομαστής να γίνει 100 ή διαιρούμε απευθείας: ${item.num} : ${item.den} ＝ ${decStr}.`
        : `Multiply numerator and denominator so the denominator becomes 100, or divide directly: ${item.num} : ${item.den} ＝ ${decStr}.`,
    };
  },

  // 13. Εύρεση ίσου κλάσματος με δεδομένο παρονομαστή (Input)
  (locale) => {
    const num = randInt(2, 4);
    const den = 5;
    const targetDen = 100;
    const mult = targetDen / den;
    const targetNum = num * mult;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ' : 'EQUIVALENT FRACTIONS',
      question: locale === 'el'
        ? `Συμπλήρωσε τον αριθμητή x ώστε να ισχύει: ${htmlFrac(num, den)} ＝ ${htmlFrac('x', targetDen)}`
        : `Find the numerator x such that: ${htmlFrac(num, den)} ＝ ${htmlFrac('x', targetDen)}`,
      correctAnswer: targetNum.toString(),
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το ${mult}: x ＝ ${num} · ${mult} ＝ ${targetNum}.`
        : `Multiply numerator and denominator by ${mult}: x ＝ ${num} · ${mult} ＝ ${targetNum}.`,
    };
  },

  // 14. Μετατροπή δεκαδικού 3 δεκαδικών ψηφίων σε κλάσμα (Input)
  (locale) => {
    const items = [
      { dec: 0.125, num: 1, den: 8 },
      { dec: 0.375, num: 3, den: 8 },
      { dec: 0.625, num: 5, den: 8 },
      { dec: 0.875, num: 7, den: 8 },
    ];
    const item = items[randInt(0, items.length - 1)];
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ' : 'DECIMAL TO IRREDUCIBLE FRACTION',
      question: locale === 'el'
        ? `Γράψε τον δεκαδικό αριθμό <strong>${decStr}</strong> ως ανάγωγο κλάσμα (π.χ. 1/8):`
        : `Write the decimal <strong>${decStr}</strong> as an irreducible fraction (e.g. 1/8):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac(item.dec * 1000, 1000)} ＝ ${htmlFrac(item.num, item.den)} μετά από διαίρεση με τον Μ.Κ.Δ. (125).`
        : `${decStr} ＝ ${htmlFrac(item.dec * 1000, 1000)} ＝ ${htmlFrac(item.num, item.den)} after dividing by GCD (125).`,
    };
  },

  // 15. Αντίθετος ρητού αριθμού (Input)
  (locale) => {
    const decVal = 0.65;
    const decStr = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    const negDecStr = (-decVal).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΘΕΤΟΙ ΡΗΤΟΙ' : 'OPPOSITE RATIONAL NUMBERS',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίθετος ρητός αριθμός του <strong>＋${decStr}</strong>;`
        : `What is the opposite rational number of <strong>＋${decStr}</strong>?`,
      correctAnswer: negDecStr,
      solution: locale === 'el'
        ? `Ο αντίθετος αριθμός έχει ακριβώς το αντίθετο πρόσημο: －${decStr}.`
        : `The opposite number has the reverse sign: －${decStr}.`,
    };
  },

  // 16. Απόλυτη τιμή αρνητικού κλάσματος (Input)
  (locale) => {
    const n = randInt(3, 7);
    const d = randInt(8, 12);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΟΛΥΤΗ ΤΙΜΗ ΡΗΤΟΥ' : 'ABSOLUTE VALUE OF RATIONAL',
      question: locale === 'el'
        ? `Υπολόγισε την απόλυτη τιμή: |${htmlFrac(-n, d)}| (μορφή α/β):`
        : `Calculate the absolute value: |${htmlFrac(-n, d)}| (format a/b):`,
      correctAnswer: `${n}/${d}`,
      solution: locale === 'el'
        ? `Η απόλυτη τιμή οποιουδήποτε αριθμού είναι μη αρνητική: |${htmlFrac(-n, d)}| ＝ ${htmlFrac(n, d)}.`
        : `The absolute value of any number is non-negative: |${htmlFrac(-n, d)}| ＝ ${htmlFrac(n, d)}.`,
    };
  },

  // 17. Κριτήριο διαιρετότητας παρονομαστή για πεπερασμένο δεκαδικό (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Μόνο το 2, μόνο το 5 ή και τα δύο (2 και 5)'
      : 'Only 2, only 5, or both (2 and 5)';
    const candidates = locale === 'el'
      ? [
          'Οποιουσδήποτε περιττούς πρώτους παράγοντες',
          'Μόνο το 3 και το 7',
          'Πρέπει να είναι υποχρεωτικά πρώτος αριθμός',
        ]
      : [
          'Any odd prime factors',
          'Only 3 and 7',
          'The denominator must be a prime number',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ ΠΑΡΟΝΟΜΑΣΤΩΝ' : 'DENOMINATOR THEORY',
      question: locale === 'el'
        ? `Ποιους πρώτους παράγοντες επιτρέπεται να έχει ο παρονομαστής ενός ανάγωγου κλάσματος για να είναι πεπερασμένος δεκαδικός;`
        : `Which prime factors can the denominator of an irreducible fraction have for it to be a terminating decimal?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ένα ανάγωγο κλάσμα αναλύεται σε πεπερασμένο δεκαδικό μόνο όταν ο παρονομαστής του περιέχει αποκλειστικά πρώτους παράγοντες το 2 και το 5.`
        : `An irreducible fraction converts to a terminating decimal if and only if its denominator's prime factorization contains exclusively 2 and 5.`,
    };
  },

  // 18. Μετατροπή μηδενός σε κλασματική μορφή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΟ ΜΗΔΕΝ ΩΣ ΡΗΤΟΣ' : 'ZERO AS A RATIONAL NUMBER',
      question: locale === 'el'
        ? `Ποια είναι η τιμή του κλάσματος ${htmlFrac('0', '7')};`
        : `What is the value of the fraction ${htmlFrac('0', '7')}?`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Το μηδέν διαιρούμενο με οποιονδήποτε μη μηδενικό αριθμό ισούται με 0: 0 : 7 ＝ 0.`
        : `Zero divided by any non-zero number is equal to 0: 0 : 7 ＝ 0.`,
    };
  },

  // 19. Δεκαδικός αριθμός με αρνητικό πρόσημο και ακέραιο μέρος (Input)
  (locale) => {
    const item = { dec: -1.5, num: -3, den: 2 };
    const decStr = item.dec.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ ΣΕ ΚΛΑΣΜΑ' : 'NEGATIVE DECIMAL TO FRACTION',
      question: locale === 'el'
        ? `Γράψε τον αριθμό <strong>${decStr}</strong> ως ανάγωγο κλάσμα (π.χ. -3/2):`
        : `Write the number <strong>${decStr}</strong> as an irreducible fraction (e.g. -3/2):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('-15', '10')} ＝ ${htmlFrac(item.num, item.den)}.`
        : `${decStr} ＝ ${htmlFrac('-15', '10')} ＝ ${htmlFrac(item.num, item.den)}.`,
    };
  },

  // 20. Σύγκριση κλάσματος και δεκαδικού (MCQ)
  (locale) => {
    const fStr = htmlFrac('1', '4');
    const decVal = 0.3;
    const decFormatted = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    const fDecFormatted = (0.25).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    const correct = `${fStr} ＜ ${decFormatted}`;
    const candidates = [
      `${fStr} ＞ ${decFormatted}`,
      `${fStr} ＝ ${decFormatted}`,
      locale === 'el' ? 'Δεν συγκρίνονται' : 'Cannot be compared',
    ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΡΗΤΩΝ' : 'COMPARING RATIONAL NUMBERS',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ του κλάσματος ${fStr} και του δεκαδικού ${decFormatted};`
        : `Which inequality holds between the fraction ${fStr} and the decimal ${decFormatted}?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `${fStr} ＝ ${fDecFormatted}. Επειδή ${fDecFormatted} ＜ ${decFormatted}, ισχύει ${fStr} ＜ ${decFormatted}.`
        : `${fStr} ＝ ${fDecFormatted}. Since ${fDecFormatted} ＜ ${decFormatted}, we have ${fStr} ＜ ${decFormatted}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΡΗΤΩΝ ΜΕ ΑΡΤΙΑ ΣΥΝΤΑΞΗ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ποσοστό επιτυχίας σε διαγώνισμα ως δεκαδικός
  (locale) => {
    const total = 20;
    const correct = randInt(14, 18);
    const decVal = correct / total;
    const decStr = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΔΟΣΗ' : 'WORD PROBLEMS: PERFORMANCE',
      question: locale === 'el'
        ? `Σε ένα τεστ μαθηματικών 20 ερωτήσεων η Δέσποινα απάντησε σωστά στις ${correct}. Ποιο είναι το δεκαδικό ποσοστό επιτυχίας της (δηλαδή το κλάσμα ${htmlFrac(correct, total)} σε δεκαδική μορφή);`
        : `In a 20-question math test, Despina answered ${correct} questions correctly. What is her success rate expressed as a decimal (the fraction ${htmlFrac(correct, total)} in decimal form)?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Διαιρούμε ${correct} : ${total} ＝ ${decStr}.`
        : `Divide: ${correct} : ${total} ＝ ${decStr}.`,
    };
  },

  // Πρόβλημα 2: Μοίρασμα πίτσας σε δεκαδικό
  (locale) => {
    const pieces = randInt(2, 6);
    const total = 8;
    const decVal = pieces / total;
    const decStr = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ' : 'WORD PROBLEMS: PORTIONS',
      question: locale === 'el'
        ? `Μια οικογενειακή πίτσα κόπηκε σε 8 ίσα κομμάτια. Ο Ανδρέας έφαγε τα ${pieces} κομμάτια. Ποιο μέρος της πίτσας κατανάλωσε γραμμένο ως δεκαδικός αριθμός;`
        : `A family pizza was sliced into 8 equal slices. Andreas ate ${pieces} slices. What part of the pizza did he eat, expressed as a decimal?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `Το κλάσμα είναι ${htmlFrac(pieces, total)} ＝ ${pieces} : 8 ＝ ${decStr}.`
        : `The fraction is ${htmlFrac(pieces, total)} ＝ ${pieces} : 8 ＝ ${decStr}.`,
    };
  },

  // Πρόβλημα 3: Μετατροπή ποσότητας συνταγής σε κλάσμα
  (locale) => {
    const decStr = (0.75).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ' : 'WORD PROBLEMS: RECIPES',
      question: locale === 'el'
        ? `Μια συνταγή ζαχαροπλαστικής απαιτεί ${decStr} kg αλεύρι. Ποιο ανάγωγο κλάσμα του κιλού αντιστοιχεί σε αυτή την ποσότητα (π.χ. 3/4);`
        : `A baking recipe requires ${decStr} kg of flour. What irreducible fraction of a kilogram corresponds to this quantity (e.g. 3/4)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')} kg.`
        : `${decStr} ＝ ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')} kg.`,
    };
  },

  // Πρόβλημα 4: Χρόνος προπόνησης σε δεκαδική μορφή
  (locale) => {
    const decStr = (0.75).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ένας αθλητής προπονήθηκε για 45 λεπτά της ώρας (δηλαδή τα ${htmlFrac('45', '60')} της ώρας). Πόσες ώρες διήρκεσε η προπόνησή του σε δεκαδική μορφή;`
        : `An athlete trained for 45 minutes (which is ${htmlFrac('45', '60')} of an hour). How many hours did the training session last in decimal form?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `45 : 60 ＝ ${decStr} ώρες.`
        : `45 : 60 ＝ ${decStr} hours.`,
    };
  },

  // Πρόβλημα 5: Βάρος φρούτων σε κλάσμα
  (locale) => {
    const decStr = (0.4).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ' : 'WORD PROBLEMS: WEIGHT',
      question: locale === 'el'
        ? `Στη ζυγαριά ενός παντοπωλείου ένα πακέτο φράουλες ζυγίζει ${decStr} kg. Ποιο είναι το βάρος του εκφρασμένο ως ανάγωγο κλάσμα του κιλού (π.χ. 2/5);`
        : `On a grocery scale, a box of strawberries weighs ${decStr} kg. What is its weight expressed as an irreducible fraction of a kilogram (e.g. 2/5)?`,
      correctAnswer: '2/5',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('4', '10')} ＝ ${htmlFrac('2', '5')} kg.`
        : `${decStr} ＝ ${htmlFrac('4', '10')} ＝ ${htmlFrac('2', '5')} kg.`,
    };
  },

  // Πρόβλημα 6: Στάθμη νερού σε δεξαμενή
  (locale) => {
    const filled = randInt(3, 7);
    const total = 10;
    const decVal = filled / total;
    const decStr = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Μια δεξαμενή νερού είναι γεμάτη κατά τα ${htmlFrac(filled, total)} της χωρητικότητάς της. Ποιος δεκαδικός αριθμός εκφράζει το ποσοστό πλήρωσης της δεξαμενής;`
        : `A water tank is filled to ${htmlFrac(filled, total)} of its capacity. Which decimal number expresses the fill level of the tank?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `${filled} : 10 ＝ ${decStr}.`
        : `${filled} : 10 ＝ ${decStr}.`,
    };
  },

  // Πρόβλημα 7: Χρηματικό ποσό σε κλάσμα του ευρώ
  (locale) => {
    const decStr = (0.25).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένα κέρμα των 25 λεπτών αντιστοιχεί σε ${decStr} €. Ποιο ανάγωγο κλάσμα του ευρώ αντιπροσωπεύει (π.χ. 1/4);`
        : `A 25-cent coin corresponds to ${decStr} €. What irreducible fraction of a euro does it represent (e.g. 1/4)?`,
      correctAnswer: '1/4',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')} €.`
        : `${decStr} ＝ ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')} €.`,
    };
  },

  // Πρόβλημα 8: Μήκος υφάσματος σε δεκαδικό
  (locale) => {
    const num = 3;
    const den = 2;
    const decStr = (1.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'WORD PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Μια μοδίστρα χρειάζεται ${htmlFrac(num, den)} μέτρα υφάσματος για να ράψει μια κουρτίνα. Πόσα μέτρα είναι αυτό σε δεκαδική μορφή;`
        : `A seamstress needs ${htmlFrac(num, den)} meters of fabric to make a curtain. How many meters is this in decimal form?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `3 : 2 ＝ ${decStr} μέτρα.`
        : `3 : 2 ＝ ${decStr} meters.`,
    };
  },

  // Πρόβλημα 9: Υπολειπόμενη μπαταρία σε κλάσμα
  (locale) => {
    const decStr = (0.8).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'WORD PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Το κινητό τηλέφωνο δείχνει στάθμη μπαταρίας ${decStr} (80%). Ποιο ανάγωγο κλάσμα εκφράζει την υπόλοιπη ενέργεια της μπαταρίας (π.χ. 4/5);`
        : `A mobile phone shows a battery level of ${decStr} (80%). What irreducible fraction represents the remaining battery power (e.g. 4/5)?`,
      correctAnswer: '4/5',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`
        : `${decStr} ＝ ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 10: Απόσταση διαδρομής σε δεκαδικό
  (locale) => {
    const num = 7;
    const den = 4;
    const decStr = (1.75).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΗ' : 'WORD PROBLEMS: DISTANCE',
      question: locale === 'el'
        ? `Ο Γιώργος διένυσε με το ποδήλατό του απόσταση ${htmlFrac(num, den)} km. Πόσα χιλιόμετρα διένυσε σε δεκαδική μορφή;`
        : `George rode his bicycle for a distance of ${htmlFrac(num, den)} km. How many kilometers did he travel in decimal form?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `7 : 4 ＝ ${decStr} km.`
        : `7 : 4 ＝ ${decStr} km.`,
    };
  },

  // Πρόβλημα 11: Μερίδιο κέρδους σε κλάσμα
  (locale) => {
    const decStr = (0.125).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'WORD PROBLEMS: ALLOCATION',
      question: locale === 'el'
        ? `Σε μια συμφωνία ένας συνέταιρος λαμβάνει το ${decStr} των κερδών. Ποιο ανάγωγο κλάσμα των κερδών τού αναλογεί (π.χ. 1/8);`
        : `In a business agreement, a partner receives ${decStr} of the profits. What irreducible fraction of the profits does this correspond to (e.g. 1/8)?`,
      correctAnswer: '1/8',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('125', '1000')} ＝ ${htmlFrac('1', '8')}.`
        : `${decStr} ＝ ${htmlFrac('125', '1000')} ＝ ${htmlFrac('1', '8')}.`,
    };
  },

  // Πρόβλημα 12: Ποσότητα λαδιού σε δοχείο
  (locale) => {
    const num = 1;
    const den = 8;
    const decStr = (0.125).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Σε ένα μπουκάλι έχει απομείνει το ${htmlFrac(num, den)} του λίτρου ελαιόλαδο. Πόσα λίτρα είναι η ποσότητα αυτή σε δεκαδική μορφή;`
        : `A bottle contains ${htmlFrac(num, den)} of a liter of olive oil. How many liters is this amount in decimal form?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `1 : 8 ＝ ${decStr} λίτρα.`
        : `1 : 8 ＝ ${decStr} liters.`,
    };
  },

  // Πρόβλημα 13: Έκπτωση καταστήματος σε κλάσμα
  (locale) => {
    const decStr = (0.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένα κατάστημα ρούχων προσφέρει έκπτωση ${decStr} (δηλαδή 20%) στην αρχική τιμή. Ποιο ανάγωγο κλάσμα της αρχικής τιμής αφαιρείται (π.χ. 1/5);`
        : `A clothing store offers a discount of ${decStr} (20%) on the original price. What irreducible fraction of the original price is discounted (e.g. 1/5)?`,
      correctAnswer: '1/5',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('2', '10')} ＝ ${htmlFrac('1', '5')}.`
        : `${decStr} ＝ ${htmlFrac('2', '10')} ＝ ${htmlFrac('1', '5')}.`,
    };
  },

  // Πρόβλημα 14: Διάρκεια διαλείμματος σε δεκαδικό μέρος της ώρας
  (locale) => {
    const decStr = (0.25).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Το σχολικό διάλειμμα διαρκεί 15 λεπτά (δηλαδή τα ${htmlFrac('15', '60')} της ώρας). Ποιο δεκαδικό μέρος της ώρας διαρκεί το διάλειμμα;`
        : `A school break lasts 15 minutes (which is ${htmlFrac('15', '60')} of an hour). What decimal part of an hour does the break last?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `15 : 60 ＝ ${decStr} ώρες.`
        : `15 : 60 ＝ ${decStr} hours.`,
    };
  },

  // Πρόβλημα 15: Ποσοστό επιτυχών βολών στο μπάσκετ
  (locale) => {
    const success = randInt(3, 7);
    const total = 10;
    const decVal = success / total;
    const decStr = decVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ένας μπασκετμπολίστας ευστόχησε σε ${success} από τις 10 ελεύθερες βολές που εκτέλεσε. Ποιο είναι το δεκαδικό ποσοστό ευστοχίας του;`
        : `A basketball player made ${success} out of 10 free throws. What is their success rate expressed as a decimal?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `${success} : 10 ＝ ${decStr}.`
        : `${success} : 10 ＝ ${decStr}.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο οικοπέδου σε κλάσμα
  (locale) => {
    const decStr = (0.375).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ' : 'WORD PROBLEMS: PROPERTY',
      question: locale === 'el'
        ? `Ένας ιδιοκτήτης κατέχει το ${decStr} ενός οικοπέδου. Ποιο ανάγωγο κλάσμα του οικοπέδου τού ανήκει (π.χ. 3/8);`
        : `An owner holds ${decStr} of a plot of land. What irreducible fraction of the land do they own (e.g. 3/8)?`,
      correctAnswer: '3/8',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('375', '1000')} ＝ ${htmlFrac('3', '8')}.`
        : `${decStr} ＝ ${htmlFrac('375', '1000')} ＝ ${htmlFrac('3', '8')}.`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου σε δεκαδικό
  (locale) => {
    const num = 1;
    const den = 5;
    const decStr = (0.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'WORD PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Στο ταξίδι καταναλώθηκε το ${htmlFrac(num, den)} του καυσίμου του ρεζερβουάρ. Ποιο δεκαδικό μέρος του ντεπόζιτου αδειάστηκε;`
        : `During a road trip, ${htmlFrac(num, den)} of the fuel tank was consumed. What decimal fraction of the tank was emptied?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `1 : 5 ＝ ${decStr}.`
        : `1 : 5 ＝ ${decStr}.`,
    };
  },

  // Πρόβλημα 18: Βάρος τυριού σε κλάσμα
  (locale) => {
    const decStr = (0.6).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'WORD PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Ένα κομμάτι τυρί ζυγίζει ${decStr} kg. Ποιο είναι το βάρος του σε ανάγωγο κλάσμα του κιλού (π.χ. 3/5);`
        : `A wedge of cheese weighs ${decStr} kg. What is its weight expressed as an irreducible fraction of a kilogram (e.g. 3/5)?`,
      correctAnswer: '3/5',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('6', '10')} ＝ ${htmlFrac('3', '5')} kg.`
        : `${decStr} ＝ ${htmlFrac('6', '10')} ＝ ${htmlFrac('3', '5')} kg.`,
    };
  },

  // Πρόβλημα 19: Χρόνος ταξιδιού με τρένο σε δεκαδικό
  (locale) => {
    const num = 5;
    const den = 2;
    const decStr = (2.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ' : 'WORD PROBLEMS: TRAVEL',
      question: locale === 'el'
        ? `Το ταξίδι με το τρένο διήρκεσε ${htmlFrac(num, den)} ώρες. Πόσες ώρες διήρκεσε εκφρασμένο σε δεκαδική μορφή;`
        : `The train ride lasted ${htmlFrac(num, den)} hours. How many hours did it take expressed in decimal form?`,
      correctAnswer: decStr,
      solution: locale === 'el'
        ? `5 : 2 ＝ ${decStr} ώρες.`
        : `5 : 2 ＝ ${decStr} hours.`,
    };
  },

  // Πρόβλημα 20: Ποσοστό έκπτωσης σε κλάσμα
  (locale) => {
    const decStr = (0.15).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Σε μια εποχική προσφορά παρέχεται έκπτωση ${decStr} επί της αρχικής τιμής. Ποιο ανάγωγο κλάσμα αντιστοιχεί σε αυτή την έκπτωση (π.χ. 3/20);`
        : `A seasonal promotion offers a discount of ${decStr} off the original price. What irreducible fraction corresponds to this discount (e.g. 3/20)?`,
      correctAnswer: '3/20',
      solution: locale === 'el'
        ? `${decStr} ＝ ${htmlFrac('15', '100')} ＝ ${htmlFrac('3', '20')}.`
        : `${decStr} ＝ ${htmlFrac('15', '100')} ＝ ${htmlFrac('3', '20')}.`,
    };
  },
];

export default function RitoiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

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
      clean = clean.replace('.', ',');
    } else {
      clean = clean.replace(',', '.');
    }

    clean = clean.replace(/[^0-9,/.-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    const dotCount = (clean.match(/\./g) || []).length;
    if (dotCount > 1) return;
    const slashCount = (clean.match(/\//g) || []).length;
    if (slashCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '').replace(/^\+/, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');

      // Ελαστικός έλεγχος κόμματος / τελείας
      const normalizedUser = userAns.replace(',', '.');
      const normalizedCorrect = correctAns.replace(',', '.');

      if (userAns === correctAns || normalizedUser === normalizedCorrect) {
        totalCorrect += 1;
      } else {
        // Ανοχή 0.05 σε καθαρές δεκαδικές συγκρίσεις
        const numUser = parseFloat(normalizedUser);
        const numCorrect = parseFloat(normalizedCorrect);
        if (!isNaN(numUser) && !isNaN(numCorrect) && !userAns.includes('/') && !correctAns.includes('/')) {
          if (Math.abs(numUser - numCorrect) <= 0.05) {
            totalCorrect += 1;
          }
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
          href="/a-gymnasiou/13-ritoi"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-40 overflow-x-hidden space-y-8 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {t.titleMain}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words">
              {t.descMain}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');
              
              const normUser = cleanUser.replace(',', '.');
              const normCorrect = cleanCorrect.replace(',', '.');
              const numU = parseFloat(normUser);
              const numC = parseFloat(normCorrect);
              const isNumericClose = !isNaN(numU) && !isNaN(numC) && !cleanUser.includes('/') && !cleanCorrect.includes('/') && Math.abs(numU - numC) <= 0.05;

              const isCorrect = isSubmitted && (cleanUser === cleanCorrect || normUser === normCorrect || isNumericClose);
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden box-border ${
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
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.badgeProblem)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words [overflow-wrap:anywhere]"
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
                              className={`min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.99] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="shrink-0 font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση (No-Giveaway) */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border break-words [overflow-wrap:anywhere] ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctLabel)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongLabel)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 max-w-full">
                              <span>{toCleanUppercase(t.correctAnswerText)}</span>
                              <span className="text-emerald-700 font-black ml-1 break-all" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
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
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnSubmit)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNewExercises)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl box-border">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.scoreFinal : t.scoreProgress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.scoreSuccess)}
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
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5 touch-manipulation"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.btnNewExercises)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheckShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation"
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