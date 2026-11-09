// pages/st-dimotikou/38-gnostos-dia-agnostos-ask.js
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
    pageTitle: "Ασκήσεις: Άγνωστος Διαιρέτης - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο διαιρέτη (α : x = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 38 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Διαιρέτης (α : x ＝ β)",
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
    pageTitle: "Exercises: Unknown Divisor - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving division equations with an unknown divisor (a : x = b) for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 38 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Divisor (a : x ＝ b)",
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
      const x = randInt(3, 6);
      const b = randInt(10, 20);
      const a = x * b;
      const name = locale === 'en' ? 'Mr. Nikos' : 'Ο κύριος Νίκος';
      const childUnit = locale === 'en' ? 'children' : 'παιδιά';
      const candidateWrongs = [x + 2, Math.max(1, x - 1), x + 4, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${childUnit}`, render: <span>{x} {childUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${childUnit}`, render: <span>{v} ${childUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Money among Children' : 'Μοιρασιά Χρημάτων σε Παιδιά',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} shared ${a}€ equally among his children (x children). If each child received ${b}€, how many children does he have (x)?`
              : `${name} μοίρασε εξίσου ${a}€ στα παιδιά του (x παιδιά). Αν κάθε παιδί πήρε ${b}€, πόσα είναι τα παιδιά του (x);`}
          </span>
        ),
        correctText: `${x} ${childUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total amount (a)' : 'Συνολικό ποσό (α)', formula: `${a} €`, val: `${a} €` },
          { item: locale === 'en' ? 'Amount per child (b)' : 'Ποσό ανά παιδί (β)', formula: `${b} €`, val: `${b} €` },
          { item: locale === 'en' ? 'Equation (a : x ＝ b)' : 'Εξίσωση (α : x ＝ β)', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} ${childUnit}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${childUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const x = randInt(4, 8);
      const b = randInt(6, 12);
      const a = x * b;
      const bottleUnit = locale === 'en' ? 'bottles' : 'μπουκάλια';
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 3, x + 4].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${bottleUnit}`, render: <span>{x} ${bottleUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${bottleUnit}`, render: <span>{v} ${bottleUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Milk into Bottles' : 'Μοίρασμα Γάλακτος σε Μπουκάλια',
        prompt: (
          <span>
            {locale === 'en'
              ? `A container held ${a} liters of milk. It was divided equally into x bottles, so that each bottle holds ${b} liters. How many bottles (x) were used?`
              : `Ένα δοχείο περιείχε ${a} λίτρα γάλα. Μοιράστηκε ισόποσα σε x μπουκάλια, έτσι ώστε κάθε μπουκάλι να περιέχει ${b} λίτρα. Πόσα μπουκάλια (x) χρησιμοποιήθηκαν;`}
          </span>
        ),
        correctText: `${x} ${bottleUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total milk (a)' : 'Συνολικό γάλα (α)', formula: `${a} L`, val: `${a} L` },
          { item: locale === 'en' ? 'Bottle capacity (b)' : 'Χωρητικότητα μπουκαλιού (β)', formula: `${b} L`, val: `${b} L` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} ${bottleUnit}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${bottleUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const x = randInt(4, 7);
      const b = randInt(10, 16);
      const a = x * b;
      const groupUnit = locale === 'en' ? 'groups' : 'ομάδες';
      const candidateWrongs = [x + 2, Math.max(1, x - 1), x + 4, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${groupUnit}`, render: <span>{x} ${groupUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${groupUnit}`, render: <span>{v} ${groupUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Dividing Students into Groups' : 'Χωρισμός Μαθητών σε Ομάδες',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a school, ${a} students were divided into x equal groups. If each group has ${b} students, how many groups were formed?`
              : `Σε ένα σχολείο ${a} μαθητές χωρίστηκαν σε x ισάριθμες ομάδες. Αν η κάθε ομάδα έχει ${b} μαθητές, πόσες ομάδες σχηματίστηκαν;`}
          </span>
        ),
        correctText: `${x} ${groupUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total students (a)' : 'Συνολικοί μαθητές (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Students per group (b)' : 'Μαθητές ανά ομάδα (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} ${groupUnit}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${groupUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const x = randInt(4, 8);
      const b = randInt(12, 20);
      const a = x * b;
      const sackUnit = locale === 'en' ? 'sacks' : 'σακιά';
      const candidateWrongs = [x + 3, Math.max(1, x - 2), x + 5, x - 1].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${sackUnit}`, render: <span>{x} ${sackUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${sackUnit}`, render: <span>{v} ${sackUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Packaging Potatoes in Sacks' : 'Συσκευασία Πατάτας σε Σακιά',
        prompt: (
          <span>
            {locale === 'en'
              ? `A warehouse packed ${a} kg of potatoes into x identical sacks. If each sack contains ${b} kg, how many sacks were used in total?`
              : `Μια αποθήκη συσκεύασε ${a} κιλά πατάτες σε x όμοια σακιά. Αν κάθε σακί περιέχει ${b} κιλά, πόσα σακιά χρησιμοποιήθηκαν συνολικά;`}
          </span>
        ),
        correctText: `${x} ${sackUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total weight (a)' : 'Συνολικό βάρος (α)', formula: `${a} kg`, val: `${a} kg` },
          { item: locale === 'en' ? 'Weight per sack (b)' : 'Βάρος σακιού (β)', formula: `${b} kg`, val: `${b} kg` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${sackUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const x = randInt(4, 6);
      const b = randInt(12, 18);
      const a = x * b;
      const crateUnit = locale === 'en' ? 'crates' : 'κιβώτια';
      const candidateWrongs = [x + 2, Math.max(1, x - 1), x + 3, x - 2].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${crateUnit}`, render: <span>{x} ${crateUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${crateUnit}`, render: <span>{v} ${crateUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Fruit Crates' : 'Κιβώτια με Φρούτα',
        prompt: (
          <span>
            {locale === 'en'
              ? `A grocer had ${a} kg of oranges and packed them into x identical crates. If each crate holds ${b} kg, how many crates (x) did he use?`
              : `Ένας μανάβης είχε ${a} κιλά πορτοκάλια και τα τοποθέτησε σε x ίδια κιβώτια. Αν το κάθε κιβώτιο χωράει ${b} κιλά, πόσα κιβώτια (x) χρησιμοποίησε;`}
          </span>
        ),
        correctText: `${x} ${crateUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total oranges (a)' : 'Συνολικά πορτοκάλια (α)', formula: `${a} kg`, val: `${a} kg` },
          { item: locale === 'en' ? 'Weight per crate (b)' : 'Κιλά ανά κιβώτιο (β)', formula: `${b} kg`, val: `${b} kg` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${crateUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const x = randInt(6, 9);
      const b = randInt(3, 5);
      const a = x * b;
      const pieceUnit = locale === 'en' ? 'pieces' : 'κομμάτια';
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 4, x - 1].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${pieceUnit}`, render: <span>{x} ${pieceUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pieceUnit}`, render: <span>{v} ${pieceUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Cutting Ribbon into Equal Pieces' : 'Κοπή Κορδέλας σε Ίσα Κομμάτια',
        prompt: (
          <span>
            {locale === 'en'
              ? `A ribbon of length ${a} meters was cut into x equal pieces of ${b} meters each. How many pieces (x) were produced?`
              : `Μια κορδέλα μήκους ${a} μέτρων κόπηκε σε x ίσα κομμάτια μήκους ${b} μέτρων το καθένα. Πόσα κομμάτια (x) προέκυψαν;`}
          </span>
        ),
        correctText: `${x} ${pieceUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial length (a)' : 'Αρχικό μήκος (α)', formula: `${a} m`, val: `${a} m` },
          { item: locale === 'en' ? 'Length per piece (b)' : 'Μήκος κομματιού (β)', formula: `${b} m`, val: `${b} m` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${pieceUnit}.`}
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
      const x = randInt(3, 6);
      const b = 2.4;
      const a = Number((x * b).toFixed(1));
      const aStr = locale === 'en' ? String(a) : a.toFixed(1).replace('.', ',');
      const bStr = locale === 'en' ? String(b) : b.toFixed(1).replace('.', ',');
      const candidateWrongs = [x + 1, Math.max(1, x - 1), x * 2, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Decimal Dividend' : 'Εξίσωση με Δεκαδικό Διαιρετέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the decimal equation: ${aStr} : x ＝ ${bStr}:`
              : `Λύσε την εξίσωση με δεκαδικούς αριθμούς: ${aStr} : x ＝ ${bStr}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${aStr} : x ＝ ${bStr}`, val: `x ＝ ${aStr} : ${bStr}` },
          { item: locale === 'en' ? 'Decimal division' : 'Διαίρεση δεκαδικών', formula: `${a} : ${b}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x ＝ ${aStr} : ${bStr} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const den = 4;
      const numA = 3;
      const numB = 1;
      const x = numA / numB; // 3
      const optionsRaw = [
        { val: String(x), render: <span>{x}</span> },
        { val: String(x + 1), render: <span>{x + 1}</span> },
        { val: String(x - 1), render: <span>{x - 1}</span> },
        { val: '1/3', render: <Fraction num="1" den="3" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Equation with Fractions (3/4 : x ＝ 1/4)' : 'Εξίσωση με Κλάσματα (3/4 : x ＝ 1/4)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve equation with fractions:' : 'Λύσε την εξίσωση με κλάσματα:'}</span>
            <Fraction num={numA} den={den} size="sm" />
            <span>: x ＝</span>
            <Fraction num={numB} den={den} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${numA}/${den} : x ＝ ${numB}/${den}`, val: `x ＝ (${numA}/${den}) : (${numB}/${den})` },
          { item: locale === 'en' ? 'Invert and multiply' : 'Αντιστροφή και υπολογισμός', formula: `(${numA}/${den}) · (${den}/${numB}) ＝ ${numA}/${numB}`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＝ <Fraction num={numA} den={den} size="sm" /> : <Fraction num={numB} den={den} size="sm" /> ＝ <Fraction num={numA} den={den} size="sm" /> · <Fraction num={den} den={numB} size="sm" /> ＝ {numA} : {numB} ＝ {x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const a = 40;
      const add = 3;
      const inter = 8;
      const total = inter + add; // 11
      const x = a / inter; // 5
      const candidateWrongs = [x + 2, Math.max(1, x - 1), x + 4, x - 2].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation (40 : x) ＋ 3 ＝ 11' : 'Σύνθετη Εξίσωση (40 : x) ＋ 3 ＝ 11',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the composite equation: (${a} : x) ＋ ${add} ＝ ${total}:`
              : `Λύσε τη σύνθετη εξίσωση: (${a} : x) ＋ ${add} ＝ ${total}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (isolate division)' : '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `${a} : x ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (find divisor)' : '2ο Βήμα (διαίρεση διαιρετέου)', formula: `${a} : ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${total} － ${add} ＝ ${inter} ➔ x ＝ ${a} : ${inter} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const a = 60;
      const sub = 4;
      const rem = 6;
      const inter = rem + sub; // 10
      const x = a / inter; // 6
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 4, x - 1].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation (60 : x) － 4 ＝ 6' : 'Σύνθετη Εξίσωση (60 : x) － 4 ＝ 6',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the composite equation: (${a} : x) － ${sub} ＝ ${rem}:`
              : `Λύσε τη σύνθετη εξίσωση: (${a} : x) － ${sub} ＝ ${rem}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (add subtrahend)' : '1ο Βήμα (πρόσθεση αφαιρετέου)', formula: `${rem} ＋ ${sub}`, val: `${a} : x ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (find divisor)' : '2ο Βήμα (διαίρεση διαιρετέου)', formula: `${a} : ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${rem} ＋ ${sub} ＝ ${inter} ➔ x ＝ ${a} : ${inter} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const a = 4;
      const numB = 2;
      const denB = 3;
      const x = (a * denB) / numB; // 6
      const optionsRaw = [
        { val: String(x), render: <span>{x}</span> },
        { val: String(x + 2), render: <span>{x + 2}</span> },
        { val: String(x - 2), render: <span>{x - 2}</span> },
        { val: '8/3', render: <Fraction num="8" den="3" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Equation with Fraction in Quotient (4 : x ＝ 2/3)' : 'Εξίσωση με Κλάσμα στο Πηλίκο (4 : x ＝ 2/3)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve the equation:' : 'Λύσε την εξίσωση:'}</span>
            <span>{a} : x ＝</span>
            <Fraction num={numB} den={denB} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${numB}/${denB}`, val: `x ＝ ${a} : (${numB}/${denB})` },
          { item: locale === 'en' ? 'Multiply by reciprocal' : 'Πολλαπλασιασμός με αντίστροφο', formula: `${a} · (${denB}/${numB}) ＝ 12/2`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＝ {a} : <Fraction num={numB} den={denB} size="sm" /> ＝ {a} · <Fraction num={denB} den={numB} size="sm" /> ＝ 12/2 ＝ {x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const a = 45;
      const b = 5;
      const x = a / b; // 9
      const pieceUnit = locale === 'en' ? 'slices' : 'κομμάτια';
      const cmUnit = locale === 'en' ? 'cm' : 'εκατοστών';
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 3, x - 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${pieceUnit}`, render: <span>{x} {pieceUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pieceUnit}`, render: <span>{v} ${pieceUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Problem with Constant Quotient' : 'Πρόβλημα Μοιρασιάς με Σταθερό Πηλίκο',
        prompt: (
          <span>
            {locale === 'en'
              ? `A pizza has a perimeter of ${a} cm and was cut into x equal slices, each having an arc of ${b} cm. Into how many slices (x) was the pizza cut?`
              : `Μια πίτσα έχει ${a} εκατοστά περιφέρεια και κόπηκε σε x ίσα κομμάτια, έτσι ώστε κάθε κομμάτι να έχει τόξο ${b} ${cmUnit}. Σε πόσα κομμάτια (x) κόπηκε η πίτσα;`}
          </span>
        ),
        correctText: `${x} ${pieceUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total perimeter (a)' : 'Ολικό μήκος περιφέρειας (α)', formula: `${a} cm`, val: `${a} cm` },
          { item: locale === 'en' ? 'Arc per slice (b)' : 'Μήκος κομματιού (β)', formula: `${b} cm`, val: `${b} cm` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ${pieceUnit}.`}
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
  // Q1: Input - Βασική εξίσωση a : x = b με φυσικούς αριθμούς
  const q1X = randInt(3, 9);
  const q1B = randInt(4, 15);
  const q1A = q1X * q1B;

  // Q2: Input - Εξίσωση a : x = b με μεγαλύτερους φυσικούς αριθμούς
  const q2X = randInt(11, 25);
  const q2B = randInt(8, 20);
  const q2A = q2X * q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a : x = b (x = a / b)
  const q3X = randInt(2, 6);
  const q3B_raw = randInt(12, 55) / 10;
  const q3A_raw = Number((q3X * q3B_raw).toFixed(1));
  const q3A = locale === 'en' ? String(q3A_raw) : q3A_raw.toFixed(1).replace('.', ',');
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = String(q3X);

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a : x = b
  const q4X = randInt(4, 12);
  const q4B = randInt(5, 14);
  const q4A = q4X * q4B;
  const q4CorrectStep = `x ＝ ${q4A} : ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4A} · ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`,
    `x ＝ ${q4A} ＋ ${q4B}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True/False - Κανόνας εύρεσης άγνωστου διαιρέτη
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'In equation a : x ＝ b, unknown x is the divisor and is computed by division: x ＝ a : b.'
        : 'Στην εξίσωση α : x ＝ β, ο άγνωστος x είναι ο διαιρέτης και υπολογίζεται με διαίρεση: x ＝ α : β.')
    : (locale === 'en'
        ? 'In equation a : x ＝ b, unknown x is always computed by multiplication: x ＝ a · b.'
        : 'Στην εξίσωση α : x ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με πολλαπλασιασμό: x ＝ α · β.');

  // Q6: True/False - Σχέση όρων στη διαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'In division a : x ＝ b, the dividend (a) is always greater than both divisor (x) and quotient (b).'
        : 'Στη διαίρεση α : x ＝ β, ο διαιρετέος (α) είναι πάντοτε μεγαλύτερος τόσο από τον διαιρέτη (x) όσο και από το πηλίκο (β).')
    : (locale === 'en'
        ? 'In division a : x ＝ b, the unknown divisor (x) is always greater than the dividend (a).'
        : 'Στη διαίρεση α : x ＝ β, ο άγνωστος διαιρέτης (x) είναι πάντοτε μεγαλύτερος από τον διαιρετέο (α).');

  // Q7: Input - Εξίσωση με κλάσματα: a/b : x = c/d
  const q7Den = randInt(4, 9);
  const q7X = randInt(2, 6);
  const q7NumB = randInt(2, 5);
  const q7NumA = q7NumB * q7X;

  // Q8: MCQ - Επαλήθευση εξίσωσης διαιρέτη
  const q8X = randInt(3, 8);
  const q8B = randInt(5, 10);
  const q8A = q8X * q8B;
  const q8Wrongs = [q8X + 2, Math.max(1, q8X - 1), q8A - q8B, q8X + 4].filter(v => v !== q8X && v > 0);
  const q8Options = makeUniqueMCQ(
    { val: String(q8X), render: <span>{q8X}</span> },
    q8Wrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
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
      title: locale === 'en' ? 'Equation: a : x ＝ b' : 'Εξίσωση: α : x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${q1A} : x ＝ ${q1B}` : `Λύσε την εξίσωση: ${q1A} : x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} : ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Larger Numbers' : 'Μεγαλύτεροι Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: ${q2A} : x ＝ ${q2B}` : `Λύσε την εξίσωση: ${q2A} : x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} : ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Decimal Numbers' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: ${q3A} : x ＝ ${q3B}` : `Λύσε την εξίσωση: ${q3A} : x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} : ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve ${q4A} : x ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} : x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate divisor x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Divisor Rule' : 'Κανόνας Διαιρέτη',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! To find the divisor we divide: x ＝ a : b.' : 'Σωστά! Για να βρούμε τον άγνωστο διαιρέτη κάνουμε διαίρεση: x ＝ α : β.')
            : (locale === 'en' ? 'False! To find the divisor we divide: x ＝ a : b.' : 'Λάθος! Για να βρούμε τον άγνωστο διαιρέτη κάνουμε διαίρεση (x ＝ α : β).')}
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
            ? (locale === 'en' ? 'Correct! Dividend a is the initial total, thus larger than x and b.' : 'Σωστά! Ο διαιρετέος (α) είναι το αρχικό συνολικό μέγεθος, άρα είναι μεγαλύτερος από το x και από το β.')
            : (locale === 'en' ? 'False! Dividend a is the largest term in division.' : 'Λάθος! Ο διαιρετέος (α) είναι το μεγαλύτερο μέγεθος στη διαίρεση.')}
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
          <Fraction num={q7NumA} den={q7Den} size="sm" />
          <span>: x ＝</span>
          <Fraction num={q7NumB} den={q7Den} size="sm" />
          <span>:</span>
        </span>
      ),
      correct: String(q7X),
      explain: (
        <span>
          x ＝ <Fraction num={q7NumA} den={q7Den} size="sm" /> : <Fraction num={q7NumB} den={q7Den} size="sm" /> ＝ <Fraction num={q7NumA} den={q7Den} size="sm" /> · <Fraction num={q7Den} den={q7NumB} size="sm" /> ＝ {q7NumA} : {q7NumB} ＝ {q7X}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equation Verification' : 'Επαλήθευση Εξίσωσης',
      prompt: locale === 'en' ? `In ${q8A} : x ＝ ${q8B}, which value of x verifies equality?` : `Στην εξίσωση ${q8A} : x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8X),
      explain: `${q8A} : ${q8X} ＝ ${q8B}.`
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

export default function GnostosDiaAgnostosExercisesPage() {
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
      let sanitized = String(rawValue).replace(/[^0-9]/g, '');
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
      return cleanUser === cleanTarget;
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
          href="/st-dimotikou/38-gnostos-dia-agnostos"
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