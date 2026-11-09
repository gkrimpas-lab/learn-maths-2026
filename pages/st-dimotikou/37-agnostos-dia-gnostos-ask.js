// pages/st-dimotikou/37-agnostos-dia-gnostos-ask.js
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
function makeUniqueMCQ(correctObj, candidates) {
  const seen = new Set([correctObj.val]);
  const result = [correctObj];
  for (const cand of candidates) {
    if (cand && !seen.has(cand.val)) {
      seen.add(cand.val);
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
    pageTitle: "Ασκήσεις: Άγνωστος Διαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο διαιρετέο (x : α = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 37 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Διαιρετέος (x : α ＝ β)",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων διαίρεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderDecimal: "π.χ. 3,5",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Πράξη / Μέθοδος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
  },
  en: {
    pageTitle: "Exercises: Unknown Dividend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving equations with an unknown dividend (x : a = b) for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 37 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Dividend (x : a ＝ b)",
    desc: "Solve the 10 dynamic problems to practice solving division equations with whole numbers, decimals, fractions, and practical word problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    inputPlaceholderDecimal: "e.g. 3.5",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Operation / Method",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const a = randInt(3, 5);
      const b = randInt(14, 25);
      const x = a * b;
      const candidateWrongs = [x + a * 2, Math.max(1, x - a * 2), x + 10, x - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Money among Friends' : 'Μοιρασιά Χρημάτων σε Φίλους',
        prompt: (
          <span>
            {locale === 'en'
              ? `An amount of money x was shared equally among ${a} friends. If each friend received ${b}€, what was the initial amount (x)?`
              : `Ένα χρηματικό ποσό x μοιράστηκε εξίσου σε ${a} φίλους. Αν ο καθένας πήρε ${b}€, ποιο ήταν το αρχικό ποσό (x);`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Number of friends (a)' : 'Πλήθος φίλων (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Share each (b)' : 'Μερίδιο καθενός (β)', formula: `${b} €`, val: `${b} €` },
          { item: locale === 'en' ? 'Equation (x : a ＝ b)' : 'Εξίσωση (x : α ＝ β)', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}€` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x}€.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const a = randInt(4, 6);
      const b = randInt(5, 12);
      const x = a * b;
      const literUnit = locale === 'en' ? 'liters' : 'λίτρα';
      const candidateWrongs = [x + 5, Math.max(1, x - 4), b + a, x + 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${literUnit}`, render: <span>{x} ${literUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${literUnit}`, render: <span>{v} ${literUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Juice into Pitchers' : 'Μοίρασμα Χυμού σε Κανάτες',
        prompt: (
          <span>
            {locale === 'en'
              ? `A barrel held x liters of juice. It was divided equally into ${a} pitchers, filling each with ${b} liters. How many liters did the barrel hold originally (x)?`
              : `Ένα βαρέλι περιείχε x λίτρα χυμό. Μοιράστηκε ισόποσα σε ${a} κανάτες και κάθε κανάτα γέμισε με ${b} λίτρα. Πόσα λίτρα χυμό είχε αρχικά το βαρέλι (x);`}
          </span>
        ),
        correctText: `${x} ${literUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Pitchers (a)' : 'Κανάτες (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Pitcher capacity (b)' : 'Χωρητικότητα κανάτας (β)', formula: `${b} L`, val: `${b} L` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} L` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} ${literUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const a = randInt(4, 7);
      const b = randInt(15, 30);
      const x = a * b;
      const kgUnit = locale === 'en' ? 'kg' : 'κιλά';
      const candidateWrongs = [x + 10, x - 10, x + 20, x - 20].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${kgUnit}`, render: <span>{x} ${kgUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${kgUnit}`, render: <span>{v} ${kgUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sacks of Flour in a Warehouse' : 'Σακιά Αλευριού σε Αποθήκη',
        prompt: (
          <span>
            {locale === 'en'
              ? `A warehouse had x kg of flour packed into ${a} equal sacks. If each sack contained ${b} kg, how many kg was the flour in total?`
              : `Μια αποθήκη είχε x κιλά αλεύρι συσκευασμένα σε ${a} ίσα σακιά. Αν το κάθε σακί περιείχε ${b} κιλά, πόσα κιλά ήταν συνολικά το αλεύρι;`}
          </span>
        ),
        correctText: `${x} ${kgUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Sacks (a)' : 'Σακιά (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Weight per sack (b)' : 'Βάρος σακιού (β)', formula: `${b} kg`, val: `${b} kg` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} ${kgUnit}` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} ${kgUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const a = randInt(5, 8);
      const b = randInt(10, 18);
      const x = a * b;
      const bookUnit = locale === 'en' ? 'books' : 'βιβλία';
      const candidateWrongs = [x + 8, Math.max(1, x - 6), b + a, x + 12].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${bookUnit}`, render: <span>{x} ${bookUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${bookUnit}`, render: <span>{v} ${bookUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Books on Library Shelves' : 'Βιβλία σε Ράφια Βιβλιοθήκης',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a library, x books were arranged equally on ${a} shelves. If each shelf holds ${b} books, how many books are there in total (x)?`
              : `Σε μια βιβλιοθήκη τοποθετήθηκαν x βιβλία σε ${a} ίσα ράφια. Αν κάθε ράφι χωράει ${b} βιβλία, πόσα είναι συνολικά τα βιβλία (x);`}
          </span>
        ),
        correctText: `${x} ${bookUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Shelves (a)' : 'Ράφια (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Books per shelf (b)' : 'Βιβλία ανά ράφι (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} ${bookUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const a = 4;
      const b = randInt(5, 8);
      const x = a * b;
      const sliceUnit = locale === 'en' ? 'slices' : 'κομμάτια';
      const candidateWrongs = [x + 4, Math.max(1, x - 4), b + a, x + 8].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${sliceUnit}`, render: <span>{x} ${sliceUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${sliceUnit}`, render: <span>{v} ${sliceUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Pizza Slices at a Party' : 'Κομμάτια Πίτσας σε Πάρτι',
        prompt: (
          <span>
            {locale === 'en'
              ? `At a party, x pizza slices were cut and shared equally among ${a} groups of children. If each group received ${b} slices, how many slices were there originally (x)?`
              : `Σε ένα πάρτι κόπηκαν x κομμάτια πίτσας και μοιράστηκαν ισόποσα σε ${a} παρέες παιδιών. Αν κάθε παρέα πήρε ${b} κομμάτια, πόσα ήταν συνολικά τα κομμάτια (x);`}
          </span>
        ),
        correctText: `${x} ${sliceUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Groups (a)' : 'Παρέες (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Slices per group (b)' : 'Κομμάτια ανά παρέα (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} ${sliceUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const a = 7;
      const b = randInt(3, 5);
      const x = a * b;
      const meterUnit = locale === 'en' ? 'meters' : 'μέτρα';
      const candidateWrongs = [x + 3, Math.max(1, x - 3), a + b, x + 7].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${meterUnit}`, render: <span>{x} ${meterUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${meterUnit}`, render: <span>{v} ${meterUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Roll of Fabric for Uniforms' : 'Ρολό Υφάσματος για Στολές',
        prompt: (
          <span>
            {locale === 'en'
              ? `From a roll of fabric x meters long, ${a} identical uniforms were tailored, using ${b} meters for each. How long was the original roll of fabric?`
              : `Από ένα ρολό υφάσματος x μέτρων ράφτηκαν ${a} ίδιες στολές, χρησιμοποιώντας ${b} μέτρα για την καθεμία. Πόσα μέτρα ήταν το αρχικό ρολό υφάσματος;`}
          </span>
        ),
        correctText: `${x} ${meterUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Uniforms (a)' : 'Στολές (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Meters per uniform (b)' : 'Μέτρα ανά στολή (β)', formula: `${b} m`, val: `${b} m` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} m` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} ${meterUnit}.`}
          </span>
        )
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const a = 4;
      const b = 3.5;
      const x = Number((a * b).toFixed(1));
      const bStr = locale === 'en' ? String(b) : b.toFixed(1).replace('.', ',');
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 4, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Decimal Quotient' : 'Εξίσωση με Δεκαδικό Πηλίκο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation with a decimal: x : ${a} ＝ ${bStr}:`
              : `Λύσε την εξίσωση με δεκαδικό αριθμό: x : ${a} ＝ ${bStr}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${bStr}`, val: `x ＝ ${a} · ${bStr}` },
          { item: locale === 'en' ? 'Multiplication' : 'Πολλαπλασιασμός', formula: `${a} · ${b}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x ＝ ${a} · ${bStr} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const den = 3;
      const b = 15;
      const x = b / den; // 5
      const candidateWrongs = [b * den, x + 2, Math.max(1, x - 2), x + 4].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Fraction as Divisor' : 'Εξίσωση με Κλάσμα ως Διαιρέτη',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve equation with fraction divisor:' : 'Λύσε την εξίσωση με κλάσμα:'}</span>
            <span>x :</span>
            <Fraction num="1" den={den} size="sm" />
            <span>＝ {b}:</span>
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : (1/${den}) ＝ ${b}`, val: `x ＝ ${b} · (1/${den})` },
          { item: locale === 'en' ? 'Compute product' : 'Υπολογισμός γινομένου', formula: `(${b} · 1) / ${den} ＝ ${b}/${den}`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＝ {b} · <Fraction num="1" den={den} size="sm" /> ＝ <Fraction num={b} den={den} size="sm" /> ＝ {x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const a = 3;
      const add = 4;
      const total = 12;
      const inter = total - add; // 8
      const x = a * inter; // 24
      const candidateWrongs = [x + 3, Math.max(1, x - 6), total * a, x + 6].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation (x : 3) ＋ 4 ＝ 12' : 'Σύνθετη Εξίσωση (x : 3) ＋ 4 ＝ 12',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the composite equation: (x : ${a}) ＋ ${add} ＝ ${total}:`
              : `Λύσε τη σύνθετη εξίσωση: (x : ${a}) ＋ ${add} ＝ ${total}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (isolate division)' : '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `x : ${a} ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (multiply by divisor)' : '2ο Βήμα (πολλαπλασιασμός)', formula: `${a} · ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${total} － ${add} ＝ ${inter} ➔ x ＝ ${a} · ${inter} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const a = 5;
      const sub = 2;
      const rem = 6;
      const inter = rem + sub; // 8
      const x = a * inter; // 40
      const candidateWrongs = [x + 5, x - 5, (rem - sub) * a, x + 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation (x : 5) － 2 ＝ 6' : 'Σύνθετη Εξίσωση (x : 5) － 2 ＝ 6',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the composite equation: (x : ${a}) － ${sub} ＝ ${rem}:`
              : `Λύσε τη σύνθετη εξίσωση: (x : ${a}) － ${sub} ＝ ${rem}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (add subtrahend)' : '1ο Βήμα (πρόσθεση αφαιρετέου)', formula: `${rem} ＋ ${sub}`, val: `x : ${a} ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (multiply by divisor)' : '2ο Βήμα (πολλαπλασιασμός)', formula: `${a} · ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${rem} ＋ ${sub} ＝ ${inter} ➔ x ＝ ${a} · ${inter} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const a = 6;
      const numB = 2;
      const denB = 3;
      const x = (a * numB) / denB; // 4
      const candidateWrongs = [x + 2, Math.max(1, x - 1), 9, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Fraction in Quotient' : 'Εξίσωση με Κλάσμα στο Πηλίκο',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve the equation:' : 'Λύσε την εξίσωση:'}</span>
            <span>x : {a} ＝</span>
            <Fraction num={numB} den={denB} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x : ${a} ＝ ${numB}/${denB}`, val: `x ＝ ${a} · (${numB}/${denB})` },
          { item: locale === 'en' ? 'Calculation' : 'Υπολογισμός', formula: `(${a} · ${numB}) / ${denB} ＝ 12/3`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＝ {a} · <Fraction num={numB} den={denB} size="sm" /> ＝ ({a} · {numB}) / {denB} ＝ 12/3 ＝ {x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const a = 4;
      const b = 25;
      const x = a * b; // 100
      const candidateWrongs = [x - 20, x + 25, x + 10, x - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Share Problem with Fraction & Money' : 'Πρόβλημα Μεριδίου με Ποσοστό',
        prompt: (
          <span>
            {locale === 'en'
              ? `If 1/4 of an amount x corresponds to ${b}€ (i.e. x : ${a} ＝ ${b}), what is the full amount x?`
              : `Αν το 1/4 ενός ποσού x αντιστοιχεί σε ${b}€ (δηλαδή x : ${a} ＝ ${b}), ποιο είναι ολόκληρο το ποσό x;`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Share equation' : 'Εξίσωση μεριδίου', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b}` },
          { item: locale === 'en' ? 'Total amount' : 'Συνολικό ποσό', formula: `${a} · ${b}€`, val: `${x}€` }
        ],
        explain: (
          <span>
            {`x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x}€.`}
          </span>
        )
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Βασική εξίσωση x : a = b με φυσικούς αριθμούς
  const q1A = randInt(3, 9);
  const q1B = randInt(4, 15);
  const q1X = q1A * q1B;

  // Q2: Input - Εξίσωση x : a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(12, 25);
  const q2B = randInt(8, 20);
  const q2X = q2A * q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x : a = b (x = a * b)
  const q3A = randInt(2, 6);
  const q3B_raw = randInt(12, 65) / 10;
  const q3X_raw = Number((q3A * q3B_raw).toFixed(1));
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = locale === 'en' ? String(q3X_raw) : q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x : a = b
  const q4A = randInt(4, 12);
  const q4B = randInt(5, 14);
  const q4CorrectStep = `x ＝ ${q4A} · ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`,
    `x ＝ ${q4A} ＋ ${q4B}`,
    `x ＝ ${q4B} － ${q4A}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True/False - Κανόνας εύρεσης άγνωστου διαιρετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'In equation x : a ＝ b, unknown x is the dividend and is computed by multiplication: x ＝ a · b.'
        : 'Στην εξίσωση x : α ＝ β, ο άγνωστος x είναι ο διαιρετέος και υπολογίζεται με πολλαπλασιασμό: x ＝ α · β.')
    : (locale === 'en'
        ? 'In equation x : a ＝ b, unknown x is always computed by division: x ＝ b : a.'
        : 'Στην εξίσωση x : α ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με διαίρεση: x ＝ β : α.');

  // Q6: True/False - Σχέση μεγέθους διαιρετέου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'The dividend (x) is the original total amount partitioned, thus greater than both divisor (a) and quotient (b).'
        : 'Ο διαιρετέος (x) είναι το αρχικό ολικό μέγεθος, επομένως είναι μεγαλύτερος τόσο από τον διαιρέτη (α) όσο και από το πηλίκο (β).')
    : (locale === 'en'
        ? 'The dividend (x) is always smaller than the quotient (b).'
        : 'Ο διαιρετέος (x) είναι πάντοτε μικρότερος από το πηλίκο (β).');

  // Q7: Input - Εξίσωση με κλάσματα: x : a/b = c
  const q7Den = randInt(3, 7);
  const q7NumA = randInt(2, 5);
  const q7K = randInt(2, 5);
  const q7B = q7K * q7Den;
  const q7X = q7K * q7NumA;

  // Q8: MCQ - Επαλήθευση εξίσωσης διαίρεσης
  const q8A = randInt(3, 6);
  const q8B = randInt(5, 10);
  const q8CorrectX = q8A * q8B;
  const q8Wrongs = [q8CorrectX + 4, Math.max(1, q8CorrectX - 3), q8A + q8B, q8CorrectX + 6].filter(v => v !== q8CorrectX && v > 0);
  const q8Options = makeUniqueMCQ(
    { val: String(q8CorrectX), render: <span>{q8CorrectX}</span> },
    q8Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = shuffle(q9Raw.optionsRaw);

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = shuffle(q10Raw.optionsRaw);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Equation: x : a ＝ b' : 'Εξίσωση: x : α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x : ${q1A} ＝ ${q1B}` : `Λύσε την εξίσωση: x : ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} · ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Larger Numbers' : 'Μεγαλύτεροι Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: x : ${q2A} ＝ ${q2B}` : `Λύσε την εξίσωση: x : ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} · ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Decimal Numbers' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: x : ${q3A} ＝ ${q3B}` : `Λύσε την εξίσωση: x : ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} · ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve x : ${q4A} ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x : ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate dividend x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο διαιρετέο x, πολλαπλασιάζουμε τον διαιρέτη με το πηλίκο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Dividend Rule' : 'Κανόνας Διαιρετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! Inverse of division is multiplication: x ＝ a · b.' : 'Σωστά! Η αντίστροφη πράξη της διαίρεσης είναι ο πολλαπλασιασμός: x ＝ α · β.')
            : (locale === 'en' ? 'False! To find the dividend we multiply: x ＝ a · b.' : 'Λάθος! Για να βρούμε τον άγνωστο διαιρετέο κάνουμε πολλαπλασιασμό (x ＝ α · β).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Dividend Property' : 'Ιδιότητα Διαιρετέου',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en' ? 'Correct! The dividend is the whole amount partitioned, thus larger than divisor and quotient.' : 'Σωστά! Ο διαιρετέος είναι το αρχικό ολικό ποσό που μοιράστηκε, άρα είναι μεγαλύτερος από το πηλίκο και τον διαιρέτη.')
            : (locale === 'en' ? 'False! The dividend is the product of divisor and quotient, thus the largest term.' : 'Λάθος! Ο διαιρετέος είναι το γινόμενο των δύο άλλων όρων, άρα είναι το μεγαλύτερο μέγεθος.')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Fractions Equation' : 'Εξίσωση με Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <span>x :</span>
          <Fraction num={q7NumA} den={q7Den} size="sm" />
          <span>＝ {q7B}:</span>
        </span>
      ),
      correct: String(q7X),
      explain: (
        <span>
          x ＝ {q7B} · <Fraction num={q7NumA} den={q7Den} size="sm" /> ＝ ({q7B} · {q7NumA}) / {q7Den} ＝ {q7X}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equation Verification' : 'Επαλήθευση Εξίσωσης',
      prompt: locale === 'en' ? `In x : ${q8A} ＝ ${q8B}, which value of x verifies equality?` : `Στην εξίσωση x : ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `${q8CorrectX} : ${q8A} ＝ ${q8B}.`
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function AgnostosDiaGnostosExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/37-agnostos-dia-gnostos"
          locale={locale}
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{t.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.title}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newQuestions)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all overflow-hidden ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt.render}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase(t.trueBtn)}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase(t.falseBtn)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block w-full max-w-full">
                          <table className="w-full text-xs text-left text-slate-700 min-w-[240px]">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700 break-words">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <div className="break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentage)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newQuestions)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomHint}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}