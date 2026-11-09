// pages/st-dimotikou/epanalipsi-2.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = String(str).split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Helper για εξασφάλιση ακριβώς 4 μοναδικών επιλογών MCQ
function makeUniqueMCQ(correctStr, candidates) {
  const seen = new Set([correctStr]);
  const result = [correctStr];
  for (const cand of candidates) {
    if (cand && !seen.has(cand)) {
      seen.add(cand);
      result.push(cand);
    }
    if (result.length === 4) break;
  }
  return shuffle(result);
}

// Component για κανονική κατακόρυφη μορφή κλάσματος
export function Fraction({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl font-black', line: 'w-full h-1' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "2η Επανάληψη: Εξισώσεις (Κεφ. 32-38) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μεγάλο επαναληπτικό διαγώνισμα 16 ερωτήσεων στις εξισώσεις και τις μεταβλητές (Κεφάλαια 32 έως 38) για τη ΣΤ' Δημοτικού με αυτόματη βαθμολόγηση.",
    backText: "ΣΤ' Δημοτικού",
    actionQuestionsBadge: "16 Ερωτήσεις",
    heroBadge: "🏆 2Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 32 - 38 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Επαναληπτικό Τεστ: Εξισώσεις και Μεταβλητές",
    heroDesc: "16 δυναμικές ερωτήσεις (2 από κάθε κεφάλαιο συν 2 συνδυαστικά προβλήματα) που καλύπτουν όλες τις μορφές επίλυσης εξισώσεων!",
    newTestBtn: "Νέο Τεστ",
    questionLabel: "Ερώτηση",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderFraction: "π.χ. 3/7",
    inputPlaceholderDecimal: "π.χ. 2,5",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    explanationLabel: "Επεξήγηση:",
    submitBtn: "Ολοκλήρωση & Βαθμολόγηση Τεστ",
    finalScoreLabel: "Τελικό Σκορ",
    answeredLabel: "Απαντήθηκαν",
    successRateLabel: "Ποσοστό Επιτυχίας",
    newTestRetryBtn: "Νέο Τεστ με διαφορετικές ασκήσεις!",
    footerHint: "Απάντησε και στις 16 ερωτήσεις και πάτησε «Ολοκλήρωση & Βαθμολόγηση Τεστ»!"
  },
  en: {
    pageTitle: "2nd Review: Equations (Ch. 32-38) - 6th Grade | LearnMaths.gr",
    pageDesc: "Comprehensive 16-question practice test on algebraic equations and variables (Chapters 32 to 38) for 6th Grade with automated grading.",
    backText: "6th Grade",
    actionQuestionsBadge: "16 Questions",
    heroBadge: "🏆 2ND COMPREHENSIVE REVIEW • CHAPTERS 32 - 38 • 6TH GRADE",
    heroTitle: "Review Test: Equations and Variables",
    heroDesc: "16 dynamic questions (2 from each chapter plus 2 multi-step real-world problems) covering all equation forms!",
    newTestBtn: "New Test",
    questionLabel: "Question",
    inputPlaceholder: "Answer...",
    inputPlaceholderFraction: "e.g. 3/7",
    inputPlaceholderDecimal: "e.g. 2.5",
    trueBtn: "True",
    falseBtn: "False",
    explanationLabel: "Explanation:",
    submitBtn: "Submit & Grade Test",
    finalScoreLabel: "Final Score",
    answeredLabel: "Answered",
    successRateLabel: "Success Rate",
    newTestRetryBtn: "New Test with fresh questions!",
    footerHint: "Answer all 16 questions and press 'Submit & Grade Test'!"
  }
};

// =========================================================
// ΔΕΞΑΜΕΝΕΣ ΓΕΝΝΗΤΡΙΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (32 ΕΩΣ 38)
// =========================================================

// ΚΕΦΑΛΑΙΟ 32: ΜΕΤΑΒΛΗΤΗ
const POOL_CH32 = [
  (locale) => {
    const a = randInt(3, 7);
    const b = randInt(4, 18);
    const x = randInt(3, 9);
    const mult = a * x;
    const res = mult + b;
    return {
      title: locale === 'en' ? 'Chapter 32 • Evaluate Expression' : 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: locale === 'en'
        ? `If x ＝ ${x}, what is the value of expression ${a} · x ＋ ${b}?`
        : `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x ＋ ${b};`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${a} · ${x} ＋ ${b} ＝ ${mult} ＋ ${b} ＝ ${res}.`
    };
  },
  (locale) => {
    const a = randInt(4, 8);
    const x = randInt(5, 10);
    const mult = a * x;
    const b = randInt(3, mult - 5);
    const res = mult - b;
    return {
      title: locale === 'en' ? 'Chapter 32 • Evaluate Expression' : 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: locale === 'en'
        ? `If x ＝ ${x}, what is the value of expression ${a} · x － ${b}?`
        : `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x － ${b};`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${a} · ${x} － ${b} ＝ ${mult} － ${b} ＝ ${res}.`
    };
  },
  (locale) => {
    const side = randInt(4, 12);
    const res = 4 * side;
    const cmUnit = locale === 'en' ? 'cm' : 'εκ.';
    return {
      title: locale === 'en' ? 'Chapter 32 • Geometry Variable' : 'Κεφάλαιο 32 • Μεταβλητή στη Γεωμετρία',
      prompt: locale === 'en'
        ? `The perimeter of a square with side x is given by P ＝ 4 · x. If x ＝ ${side} cm, what is the perimeter?`
        : `Η περίμετρος ενός τετραγώνου πλευράς x δίνεται από τον τύπο Π ＝ 4 · x. Αν x ＝ ${side} εκ., πόση είναι η περίμετρος;`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `4 · ${side} ＝ ${res} ${cmUnit}.`
    };
  },
  (locale) => {
    const correct = '5 · x ＋ 5';
    const options = makeUniqueMCQ(correct, ['5 · x － 5', 'x : 5 ＋ 5', '5 ＋ x', '5 · x']);
    return {
      title: locale === 'en' ? 'Chapter 32 • Word Phrase to Algebraic Expression' : 'Κεφάλαιο 32 • Φραστική Έκφραση σε Μεταβλητή',
      prompt: locale === 'en'
        ? 'Which mathematical expression represents: "Five times a number x increased by 5"?'
        : 'Ποια μαθηματική έκφραση δηλώνει: «Το πενταπλάσιο ενός αριθμού x αυξημένο κατά 5»;',
      type: 'mcq',
      options,
      correct,
      explain: locale === 'en'
        ? 'Five times x is 5 · x, and increased by 5 gives 5 · x ＋ 5.'
        : 'Πενταπλάσιο του x είναι το 5 · x, και αυξημένο κατά 5 σημαίνει 5 · x ＋ 5.'
    };
  },
  (locale) => {
    const a = randInt(2, 5);
    const x = a * randInt(3, 8);
    const b = randInt(2, 10);
    const res = (x / a) + b;
    return {
      title: locale === 'en' ? 'Chapter 32 • Expression with Division' : 'Κεφάλαιο 32 • Μεταβλητή με Διαίρεση',
      prompt: locale === 'en'
        ? `If x ＝ ${x}, what is the value of (x : ${a}) ＋ ${b}?`
        : `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης (x : ${a}) ＋ ${b};`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `(${x} : ${a}) ＋ ${b} ＝ ${x / a} ＋ ${b} ＝ ${res}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 33: ΕΞΙΣΩΣΗ x + a = b (Άγνωστος Προσθετέος)
const POOL_CH33 = [
  (locale) => {
    const a_raw = randInt(25, 75) / 10;
    const b_raw = Number((a_raw + randInt(15, 65) / 10).toFixed(1));
    const x_raw = Number((b_raw - a_raw).toFixed(1));
    const a = locale === 'en' ? String(a_raw) : a_raw.toFixed(1).replace('.', ',');
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = locale === 'en' ? String(x_raw) : x_raw.toFixed(1).replace('.', ',');
    return {
      title: locale === 'en' ? 'Chapter 33 • Equation x ＋ a ＝ b (Decimals)' : 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Δεκαδικοί)',
      prompt: locale === 'en' ? `Solve the equation: x ＋ ${a} ＝ ${b}` : `Λύσε την εξίσωση: x ＋ ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'decimal',
      correct,
      explain: `x ＝ ${b} － ${a} ＝ ${correct}.`
    };
  },
  (locale) => {
    const d = randInt(5, 12);
    const n1 = randInt(1, 4);
    const n2 = randInt(n1 + 1, n1 + 6);
    const diffN = n2 - n1;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: locale === 'en' ? 'Chapter 33 • Equation x ＋ a ＝ b (Fractions)' : 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <span>x ＋</span>
          <Fraction num={n1} den={d} size="sm" />
          <span>＝</span>
          <Fraction num={n2} den={d} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/7' : 'π.χ. 3/7'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: (
        <span>
          x ＝ <Fraction num={n2} den={d} size="sm" /> － <Fraction num={n1} den={d} size="sm" /> ＝ <Fraction num={diffN} den={d} size="sm" />
          {g > 1 && <span> {locale === 'en' ? '(or ' : '(ή '}<Fraction num={diffN / g} den={d / g} size="sm" />)</span>}.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(45, 150);
    const x = randInt(35, 120);
    const b = x + a;
    return {
      title: locale === 'en' ? 'Chapter 33 • Equation x ＋ a ＝ b (Integers)' : 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Φυσικοί)',
      prompt: locale === 'en' ? `Solve the equation: x ＋ ${a} ＝ ${b}` : `Λύσε την εξίσωση: x ＋ ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${b} － ${a} ＝ ${x}.`
    };
  },
  (locale) => {
    const isTrue = Math.random() > 0.5;
    return {
      title: locale === 'en' ? 'Chapter 33 • Addition Properties' : 'Κεφάλαιο 33 • Ιδιότητες Πρόσθεσης',
      prompt: isTrue
        ? (locale === 'en'
            ? '«In equation x ＋ a ＝ b, the unknown addend x is always computed by subtraction: x ＝ b － a.»'
            : '«Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται πάντοτε με αφαίρεση: x ＝ β － α.»')
        : (locale === 'en'
            ? '«In equation x ＋ a ＝ b, the unknown addend x is always computed by addition: x ＝ b ＋ a.»'
            : '«Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται πάντοτε με πρόσθεση: x ＝ β ＋ α.»'),
      type: 'tf',
      correct: isTrue,
      text: isTrue 
        ? (locale === 'en' ? 'In equation x ＋ a ＝ b, addend x is found by subtraction: x ＝ b － a.' : 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται με αφαίρεση: x ＝ β － α.')
        : (locale === 'en' ? 'In equation x ＋ a ＝ b, x is found by addition: x ＝ b ＋ a.' : 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ β ＋ α.'),
      explain: isTrue
        ? (locale === 'en' ? 'Subtraction is the inverse of addition: x ＝ b － a.' : 'Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης: x ＝ β － α.')
        : (locale === 'en' ? 'To isolate addend x we subtract: x ＝ b － a.' : 'Για να βρούμε τον άγνωστο προσθετέο κάνουμε αφαίρεση: x ＝ β － α.')
    };
  }
];

// ΚΕΦΑΛΑΙΟ 34: ΕΞΙΣΩΣΗ x - a = b (Άγνωστος Μειωτέος)
const POOL_CH34 = [
  (locale) => {
    const a_raw = randInt(25, 75) / 10;
    const b_raw = randInt(15, 65) / 10;
    const x_raw = Number((b_raw + a_raw).toFixed(1));
    const a = locale === 'en' ? String(a_raw) : a_raw.toFixed(1).replace('.', ',');
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = locale === 'en' ? String(x_raw) : x_raw.toFixed(1).replace('.', ',');
    return {
      title: locale === 'en' ? 'Chapter 34 • Minuend x － a ＝ b' : 'Κεφάλαιο 34 • Άγνωστος Μειωτέος x － α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x － ${a} ＝ ${b}` : `Λύσε την εξίσωση: x － ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'decimal',
      correct,
      explain: `x ＝ ${b} ＋ ${a} ＝ ${correct}.`
    };
  },
  (locale) => {
    const d = randInt(5, 12);
    const n1 = randInt(1, 4);
    const n2 = randInt(2, 5);
    const sumN = n1 + n2;
    const g = gcd(sumN, d);
    const correctRaw = `${sumN}/${d}`;
    const correctSimp = g > 1 ? `${sumN / g}/${d / g}` : correctRaw;
    return {
      title: locale === 'en' ? 'Chapter 34 • Minuend with Fractions' : 'Κεφάλαιο 34 • Άγνωστος Μειωτέος (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <span>x －</span>
          <Fraction num={n1} den={d} size="sm" />
          <span>＝</span>
          <Fraction num={n2} den={d} size="sm" />
          <span>({locale === 'en' ? 'e.g. 5/7' : 'π.χ. 5/7'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: (
        <span>
          x ＝ <Fraction num={n2} den={d} size="sm" /> ＋ <Fraction num={n1} den={d} size="sm" /> ＝ <Fraction num={sumN} den={d} size="sm" />
          {g > 1 && <span> {locale === 'en' ? '(or ' : '(ή '}<Fraction num={sumN / g} den={d / g} size="sm" />)</span>}.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(55, 180);
    const b = randInt(45, 160);
    const x = b + a;
    return {
      title: locale === 'en' ? 'Chapter 34 • Minuend with Integers' : 'Κεφάλαιο 34 • Άγνωστος Μειωτέος (Φυσικοί)',
      prompt: locale === 'en' ? `Solve the equation: x － ${a} ＝ ${b}` : `Λύσε την εξίσωση: x － ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${b} ＋ ${a} ＝ ${x}.`
    };
  },
  (locale) => {
    const a = randInt(20, 60);
    const b = randInt(30, 80);
    const correct = `x ＝ ${b} ＋ ${a}`;
    const options = makeUniqueMCQ(correct, [`x ＝ ${b} － ${a}`, `x ＝ ${a} － ${b}`, `x ＝ ${b} : ${a}`, `x ＝ ${a} ＋ ${b}`]);
    return {
      title: locale === 'en' ? 'Chapter 34 • Solution Step' : 'Κεφάλαιο 34 • Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve x － ${a} ＝ ${b}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x － ${a} ＝ ${b};`,
      type: 'mcq',
      options,
      correct,
      explain: locale === 'en' ? `To find minuend x, we add: ${correct}.` : `Για να βρούμε τον άγνωστο μειωτέο x, προσθέτουμε τη διαφορά και τον αφαιρετέο: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 35: ΕΞΙΣΩΣΗ a - x = b (Άγνωστος Αφαιρετέος)
const POOL_CH35 = [
  (locale) => {
    const a_raw = randInt(55, 95) / 10;
    const b_raw = randInt(12, Math.floor(a_raw * 10) - 10) / 10;
    const x_raw = Number((a_raw - b_raw).toFixed(1));
    const a = locale === 'en' ? String(a_raw) : a_raw.toFixed(1).replace('.', ',');
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = locale === 'en' ? String(x_raw) : x_raw.toFixed(1).replace('.', ',');
    return {
      title: locale === 'en' ? 'Chapter 35 • Subtrahend a － x ＝ b' : 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος α － x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${a} － x ＝ ${b}` : `Λύσε την εξίσωση: ${a} － x ＝ ${b}`,
      type: 'input',
      inputType: 'decimal',
      correct,
      explain: `x ＝ ${a} － ${b} ＝ ${correct}.`
    };
  },
  (locale) => {
    const d = randInt(6, 14);
    const n1 = randInt(5, d - 1);
    const n2 = randInt(1, n1 - 2);
    const diffN = n1 - n2;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: locale === 'en' ? 'Chapter 35 • Subtrahend with Fractions' : 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <Fraction num={n1} den={d} size="sm" />
          <span>－ x ＝</span>
          <Fraction num={n2} den={d} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/8' : 'π.χ. 3/8'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: (
        <span>
          x ＝ <Fraction num={n1} den={d} size="sm" /> － <Fraction num={n2} den={d} size="sm" /> ＝ <Fraction num={diffN} den={d} size="sm" />
          {g > 1 && <span> {locale === 'en' ? '(or ' : '(ή '}<Fraction num={diffN / g} den={d / g} size="sm" />)</span>}.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(75, 250);
    const b = randInt(15, a - 25);
    const x = a - b;
    return {
      title: locale === 'en' ? 'Chapter 35 • Subtrahend with Integers' : 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος (Φυσικοί)',
      prompt: locale === 'en' ? `Solve the equation: ${a} － x ＝ ${b}` : `Λύσε την εξίσωση: ${a} － x ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${a} － ${b} ＝ ${x}.`
    };
  },
  (locale) => {
    return {
      title: locale === 'en' ? 'Chapter 35 • Subtrahend Rule' : 'Κεφάλαιο 35 • Κανόνας Αφαιρετέου',
      prompt: locale === 'en'
        ? '«In equation a － x ＝ b, the unknown x is the subtrahend and is found by subtraction: x ＝ a － b.»'
        : '«Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και βρίσκεται με αφαίρεση: x ＝ α － β.»',
      type: 'tf',
      correct: true,
      text: locale === 'en'
        ? 'In equation a － x ＝ b, subtrahend x is computed by subtraction: x ＝ a － b.'
        : 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος x υπολογίζεται πάντα με αφαίρεση: x ＝ α － β.',
      explain: locale === 'en'
        ? 'To find what was removed from the initial total, subtract the difference from the minuend: x ＝ a － b.'
        : 'Για να βρούμε τι αφαιρέθηκε από το αρχικό μέγεθος, αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ α － β.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 36: ΕΞΙΣΩΣΗ a · x = b ή x · a = b (Άγνωστος Παράγοντας)
const POOL_CH36 = [
  (locale) => {
    const a = randInt(2, 5);
    const x_raw = randInt(12, 65) / 10;
    const b_raw = Number((a * x_raw).toFixed(1));
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = locale === 'en' ? String(x_raw) : x_raw.toFixed(1).replace('.', ',');
    return {
      title: locale === 'en' ? 'Chapter 36 • Factor of Product (Decimals)' : 'Κεφάλαιο 36 • Άγνωστος Παράγοντας Γινομένου (Δεκαδικοί)',
      prompt: locale === 'en' ? `Solve the equation: ${a} · x ＝ ${b}` : `Λύσε την εξίσωση: ${a} · x ＝ ${b}`,
      type: 'input',
      inputType: 'decimal',
      correct,
      explain: `x ＝ ${b} : ${a} ＝ ${correct}.`
    };
  },
  (locale) => {
    const a = randInt(12, 25);
    const x = randInt(6, 18);
    const b = a * x;
    return {
      title: locale === 'en' ? 'Chapter 36 • Factor x · a ＝ b' : 'Κεφάλαιο 36 • Άγνωστος Παράγοντας x · α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x · ${a} ＝ ${b}` : `Λύσε την εξίσωση: x · ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${b} : ${a} ＝ ${x}.`
    };
  },
  (locale) => {
    const d = randInt(3, 8);
    const numA = randInt(2, 5);
    const x = randInt(2, 6);
    const numB = numA * x;
    return {
      title: locale === 'en' ? 'Chapter 36 • Factor with Fractions' : 'Κεφάλαιο 36 • Άγνωστος Παράγοντας (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <Fraction num={numA} den={d} size="sm" />
          <span>· x ＝</span>
          <Fraction num={numB} den={d} size="sm" />
          <span>:</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: (
        <span>
          x ＝ <Fraction num={numB} den={d} size="sm" /> : <Fraction num={numA} den={d} size="sm" /> ＝ {numB} : {numA} ＝ {x}.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(4, 12);
    const x = randInt(4, 12);
    const b = a * x;
    const correct = `x ＝ ${b} : ${a}`;
    const options = makeUniqueMCQ(correct, [`x ＝ ${b} · ${a}`, `x ＝ ${b} － ${a}`, `x ＝ ${a} : ${b}`, `x ＝ ${a} · ${b}`]);
    return {
      title: locale === 'en' ? 'Chapter 36 • Solution Step' : 'Κεφάλαιο 36 • Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve ${a} · x ＝ ${b}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} · x ＝ ${b};`,
      type: 'mcq',
      options,
      correct,
      explain: locale === 'en' ? `To isolate factor x: ${correct}.` : `Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 37: ΕΞΙΣΩΣΗ x : a = b (Άγνωστος Διαιρετέος)
const POOL_CH37 = [
  (locale) => {
    const a = randInt(3, 6);
    const b_raw = randInt(12, 45) / 10;
    const x_raw = Number((a * b_raw).toFixed(1));
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = locale === 'en' ? String(x_raw) : x_raw.toFixed(1).replace('.', ',');
    return {
      title: locale === 'en' ? 'Chapter 37 • Dividend x : a ＝ b' : 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος x : α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x : ${a} ＝ ${b}` : `Λύσε την εξίσωση: x : ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'decimal',
      correct,
      explain: `x ＝ ${a} · ${b} ＝ ${correct}.`
    };
  },
  (locale) => {
    const a = randInt(12, 24);
    const b = randInt(6, 18);
    const x = a * b;
    return {
      title: locale === 'en' ? 'Chapter 37 • Dividend with Integers' : 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος (Φυσικοί)',
      prompt: locale === 'en' ? `Solve the equation: x : ${a} ＝ ${b}` : `Λύσε την εξίσωση: x : ${a} ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${a} · ${b} ＝ ${x}.`
    };
  },
  (locale) => {
    const d = randInt(3, 7);
    const numA = randInt(2, 5);
    const k = randInt(2, 6);
    const b = k * d;
    const x = k * numA;
    return {
      title: locale === 'en' ? 'Chapter 37 • Dividend with Fractions' : 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <span>x :</span>
          <Fraction num={numA} den={d} size="sm" />
          <span>＝ {b}:</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: (
        <span>
          x ＝ {b} · <Fraction num={numA} den={d} size="sm" /> ＝ {x}.
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'en' ? 'Chapter 37 • Dividend Rule' : 'Κεφάλαιο 37 • Κανόνας Διαιρετέου',
      prompt: locale === 'en'
        ? '«In division x : a ＝ b, the unknown dividend x is always found by multiplication: x ＝ a · b.»'
        : '«Στη διαίρεση x : α ＝ β, ο άγνωστος διαιρετέος x υπολογίζεται πάντα με πολλαπλασιασμό: x ＝ α · β.»',
      type: 'tf',
      correct: true,
      text: locale === 'en'
        ? 'In equation x : a ＝ b, dividend x is found by multiplication: x ＝ a · b.'
        : 'Στην εξίσωση x : α ＝ β, ο άγνωστος διαιρετέος x βρίσκεται με πολλαπλασιασμό: x ＝ α · β.',
      explain: locale === 'en' ? 'Multiplication is the inverse operation of division.' : 'Η αντίστροφη πράξη της διαίρεσης είναι ο πολλαπλασιασμός.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 38: ΕΞΙΣΩΣΗ a : x = b (Άγνωστος Διαιρέτης)
const POOL_CH38 = [
  (locale) => {
    const x = randInt(2, 6);
    const b_raw = randInt(12, 45) / 10;
    const a_raw = Number((x * b_raw).toFixed(1));
    const a = locale === 'en' ? String(a_raw) : a_raw.toFixed(1).replace('.', ',');
    const b = locale === 'en' ? String(b_raw) : b_raw.toFixed(1).replace('.', ',');
    const correct = String(x);
    return {
      title: locale === 'en' ? 'Chapter 38 • Divisor a : x ＝ b' : 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης α : x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${a} : x ＝ ${b}` : `Λύσε την εξίσωση: ${a} : x ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct,
      explain: `x ＝ ${a} : ${b} ＝ ${correct}.`
    };
  },
  (locale) => {
    const x = randInt(6, 16);
    const b = randInt(8, 25);
    const a = x * b;
    return {
      title: locale === 'en' ? 'Chapter 38 • Divisor with Integers' : 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης (Φυσικοί)',
      prompt: locale === 'en' ? `Solve the equation: ${a} : x ＝ ${b}` : `Λύσε την εξίσωση: ${a} : x ＝ ${b}`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `x ＝ ${a} : ${b} ＝ ${x}.`
    };
  },
  (locale) => {
    const d = randInt(4, 9);
    const x = randInt(2, 6);
    const numB = randInt(2, 5);
    const numA = numB * x;
    return {
      title: locale === 'en' ? 'Chapter 38 • Divisor with Fractions' : 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης (Κλάσματα)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <Fraction num={numA} den={d} size="sm" />
          <span>: x ＝</span>
          <Fraction num={numB} den={d} size="sm" />
          <span>:</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: (
        <span>
          x ＝ <Fraction num={numA} den={d} size="sm" /> : <Fraction num={numB} den={d} size="sm" /> ＝ {numA} : {numB} ＝ {x}.
        </span>
      )
    };
  },
  (locale) => {
    const x = randInt(4, 10);
    const b = randInt(5, 12);
    const a = x * b;
    const correct = `x ＝ ${a} : ${b}`;
    const options = makeUniqueMCQ(correct, [`x ＝ ${a} · ${b}`, `x ＝ ${b} : ${a}`, `x ＝ ${a} － ${b}`, `x ＝ ${b} · ${a}`]);
    return {
      title: locale === 'en' ? 'Chapter 38 • Solution Step' : 'Κεφάλαιο 38 • Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve ${a} : x ＝ ${b}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} : x ＝ ${b};`,
      type: 'mcq',
      options,
      correct,
      explain: locale === 'en' ? `To isolate divisor x: ${correct}.` : `Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: ${correct}.`
    };
  }
];

// ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (Πολυεπίπεδες Εξισώσεις / Real-life)
const POOL_COMBINED = [
  (locale) => {
    const a = randInt(3, 6);
    const x = randInt(4, 12);
    const b = randInt(5, 25);
    const mult = a * x;
    const c = mult + b;
    const name = locale === 'en' ? 'Maria' : 'Η Μαρία';
    return {
      title: locale === 'en' ? 'Composite Problem • 2-Step Equation' : 'Συνδυαστικό Πρόβλημα • Εξίσωση 2 Βημάτων',
      prompt: locale === 'en'
        ? `${name} bought ${a} identical books (x euros each) and a pen costing ${b}€. She paid ${c}€ in total. How much did each book cost (x)?`
        : `${name} αγόρασε ${a} ίδια βιβλία (x ευρώ το καθένα) και ένα στυλό που κόστιζε ${b}€. Πλήρωσε συνολικά ${c}€. Πόσο κόστιζε το κάθε βιβλίο (x);`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `${a} · x ＋ ${b} ＝ ${c} ➔ ${a} · x ＝ ${c} － ${b} ＝ ${mult} ➔ x ＝ ${mult} : ${a} ＝ ${x}€.`
    };
  },
  (locale) => {
    const a = randInt(3, 5);
    const x = randInt(10, 25);
    const discount = randInt(4, 15);
    const total = a * x - discount;
    const name = locale === 'en' ? 'George' : 'Ο Γιώργος';
    return {
      title: locale === 'en' ? 'Composite Problem • Discount Equation' : 'Συνδυαστικό Πρόβλημα • Εξίσωση με Έκπτωση',
      prompt: locale === 'en'
        ? `${name} bought ${a} shirts of value x euros each. He used a ${discount}€ coupon and finally paid ${total}€. What was the original cost of each shirt?`
        : `${name} αγόρασε ${a} ίδια πουκάμισα αξίας x ευρώ το καθένα. Είχε κουπόνι έκπτωσης ${discount}€ και τελικά πλήρωσε ${total}€. Πόσο κόστιζε αρχικά το κάθε πουκάμισο;`,
      type: 'input',
      inputType: 'number',
      correct: String(x),
      explain: `${a} · x － ${discount} ＝ ${total} ➔ ${a} · x ＝ ${total + discount} ➔ x ＝ ${total + discount} : ${a} ＝ ${x}€.`
    };
  },
  (locale) => {
    const width = randInt(6, 14);
    const length = width + randInt(4, 10);
    const perimeter = 2 * (length + width);
    const semiPerim = perimeter / 2;
    const mUnit = locale === 'en' ? 'm' : 'μ.';
    return {
      title: locale === 'en' ? 'Composite Problem • Rectangle Perimeter' : 'Συνδυαστικό Πρόβλημα • Περίμετρος Ορθογωνίου',
      prompt: locale === 'en'
        ? `A rectangular plot has width ${width} m and perimeter ${perimeter} m. If x is its length, find x (in meters):`
        : `Ένα ορθογώνιο οικόπεδο έχει πλάτος ${width} μ. και περίμετρο ${perimeter} μ. Αν x είναι το μήκος του, να βρεις το x (σε μέτρα):`,
      type: 'input',
      inputType: 'number',
      correct: String(length),
      explain: `2 · (x ＋ ${width}) ＝ ${perimeter} ➔ x ＋ ${width} ＝ ${semiPerim} ➔ x ＝ ${semiPerim} － ${width} ＝ ${length} ${mUnit}.`
    };
  },
  (locale) => {
    const portions = randInt(3, 6);
    const perPortion = randInt(5, 12);
    const leftover = randInt(2, 6);
    const mult = portions * perPortion;
    const total = mult + leftover;
    const candyUnit = locale === 'en' ? 'candies' : 'καραμέλες';
    return {
      title: locale === 'en' ? 'Composite Problem • Division with Remainder' : 'Συνδυαστικό Πρόβλημα • Διαίρεση με Υπόλοιπο',
      prompt: locale === 'en'
        ? `We distributed ${total} candies equally among ${portions} children, giving x candies each, while ${leftover} candies remained. How many candies did each child receive?`
        : `Μοιράσαμε ${total} καραμέλες σε ${portions} παιδιά και πήραν από x καραμέλες το καθένα, ενώ περίσσεψαν ${leftover} καραμέλες. Πόσες καραμέλες πήρε κάθε παιδί;`,
      type: 'input',
      inputType: 'number',
      correct: String(perPortion),
      explain: `${portions} · x ＋ ${leftover} ＝ ${total} ➔ ${portions} · x ＝ ${total} － ${leftover} ＝ ${mult} ➔ x ＝ ${mult} : ${portions} ＝ ${perPortion} ${candyUnit}.`
    };
  }
];

// Δημιουργία των 16 ερωτήσεων του διαγωνίσματος
function generate16Questions(locale = 'el') {
  const qList = [];

  const chapters = [
    { pool: POOL_CH32 },
    { pool: POOL_CH33 },
    { pool: POOL_CH34 },
    { pool: POOL_CH35 },
    { pool: POOL_CH36 },
    { pool: POOL_CH37 },
    { pool: POOL_CH38 }
  ];

  chapters.forEach((ch) => {
    const shuffledPool = shuffle(ch.pool);
    qList.push(shuffledPool[0](locale));
    qList.push(shuffledPool[1] ? shuffledPool[1](locale) : shuffledPool[0](locale));
  });

  const shuffledComb = shuffle(POOL_COMBINED);
  qList.push(shuffledComb[0](locale));
  qList.push(shuffledComb[1] ? shuffledComb[1](locale) : shuffledComb[0](locale));

  return qList.map((q, idx) => ({ ...q, id: `q${idx}` }));
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi2Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
    const qs = generate16Questions(locale);
    setQuestions(qs);
    const initialAns = {};
    qs.forEach((_, idx) => {
      initialAns[`q${idx}`] = '';
    });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  const handleAnswerChange = (key, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find((item) => item.id === key);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/]/g, '');
        const parts = sanitized.split('/');
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
      }
      if (sanitized.length > 12) {
        sanitized = sanitized.slice(0, 12);
      }
      setAnswers((prev) => ({ ...prev, [key]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [key]: rawValue }));
    }
  };

  const isQuestionCorrect = (q, userAns) => {
    if (q.type === 'input') {
      if (typeof userAns !== 'string' || !userAns.trim()) return false;
      const cleanAns = userAns.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase() : null;

      if (cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt)) return true;

      if (q.inputType === 'decimal') {
        const numAns = parseFloat(cleanAns.replace(',', '.'));
        const numCor = parseFloat(cleanCorrect.replace(',', '.'));
        return !isNaN(numAns) && !isNaN(numCor) && Math.abs(numAns - numCor) < 0.05;
      }

      if (q.inputType === 'fraction') {
        const parseFraction = (str) => {
          if (!str) return NaN;
          if (str.includes('/')) {
            const [n, d] = str.split('/').map(Number);
            return d !== 0 ? n / d : NaN;
          }
          return Number(str.replace(',', '.'));
        };
        const u = parseFraction(cleanAns);
        const c = parseFraction(cleanCorrect);
        return !isNaN(u) && !isNaN(c) && Math.abs(u - c) < 1e-6;
      }

      return false;
    }
    if (q.type === 'mcq') {
      return userAns === q.correct;
    }
    if (q.type === 'tf') {
      return userAns === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q, idx) => {
      if (isQuestionCorrect(q, answers[`q${idx}`])) {
        total += 1;
      }
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (idx) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm hover:shadow-md';
    const q = questions[idx];
    const userAns = answers[`q${idx}`];
    return isQuestionCorrect(q, userAns)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter((val) => typeof val === 'string' && val.trim() !== '').length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 {toCleanUppercase(t.actionQuestionsBadge)}
        </span>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10 box-border">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{t.heroBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newTestBtn)}</span>
            </button>
          </div>
        </section>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 16 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const key = `q${idx}`;
              const userAns = answers[key];
              const isCorrect = isQuestionCorrect(q, userAns);

              return (
                <div key={idx} className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 overflow-hidden ${getCardStyle(idx)}`}>
                  <div>
                    {/* Κεφαλίδα Κάρτας */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider break-words ${
                        idx >= 14 
                          ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                          : 'bg-sky-100 text-sky-950 border border-sky-200'
                      }`}>
                        {toCleanUppercase(`${t.questionLabel} ${idx + 1}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                      )}
                    </div>

                    {/* Ερώτηση */}
                    <div className="text-sm md:text-base text-slate-800 mb-4 font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* INPUT TYPE */}
                    {q.type === 'input' && (
                      <input
                        key={`review2-input-${idx}`}
                        autoComplete="off"
                        spellCheck="false"
                        type="text"
                        inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                        disabled={submitted}
                        value={userAns || ''}
                        onChange={(e) => handleAnswerChange(key, e.target.value, 'input')}
                        placeholder={
                          q.inputType === 'fraction'
                            ? t.inputPlaceholderFraction
                            : q.inputType === 'decimal'
                            ? t.inputPlaceholderDecimal
                            : t.inputPlaceholder
                        }
                        className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono shadow-inner"
                      />
                    )}

                    {/* MCQ TYPE */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(key, opt, 'mcq')}
                            className={`p-3 rounded-xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[44px] cursor-pointer ${
                              userAns === opt
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* TRUE / FALSE TYPE */}
                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(key, true, 'tf')}
                          className={`py-3 rounded-xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            userAns === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase(t.trueBtn)}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(key, false, 'tf')}
                          className={`py-3 rounded-xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            userAns === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase(t.falseBtn)}
                        </button>
                      </div>
                    )}

                    {/* Επεξήγηση μετά την υποβολή */}
                    {submitted && (
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                        isCorrect ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-200' : 'bg-rose-100/70 text-rose-950 border border-rose-200'
                      }`}>
                        💡 <strong>{t.explanationLabel}</strong> {q.explain}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase(t.submitBtn)}</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.finalScoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 16` : `${answeredCount} / 16`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.successRateLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 16) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: STATUS OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newTestRetryBtn)}</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                {t.footerHint}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}