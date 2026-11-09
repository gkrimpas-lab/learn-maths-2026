// pages/st-dimotikou/36-gnostos-epi-agnostos-ask.js
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
    pageTitle: "Ασκήσεις: Άγνωστος Παράγοντας - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο παράγοντα γινομένου (α · x = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 36 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Παράγοντας (α · x ＝ β)",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων πολλαπλασιασμού με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!",
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
    pageTitle: "Exercises: Unknown Factor - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving multiplication equations with an unknown factor (a · x = b) for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 36 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Factor (a · x ＝ b)",
    desc: "Solve the 10 dynamic problems to practice solving multiplication equations with natural numbers, decimals, fractions, and practical word problems!",
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
      const a = randInt(4, 7);
      const x = randInt(3, 8);
      const b = a * x;
      const name = locale === 'en' ? 'Kostas' : 'Ο Κώστας';
      const candidateWrongs = [x + 2, Math.max(1, x - 2), x + 4, x + 1].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Buying Notebooks' : 'Αγορά Τετραδίων',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} bought ${a} identical notebooks (x euros each) and paid ${b}€ in total. How much did each notebook cost (x)?`
              : `${name} αγόρασε ${a} ίδια τετράδια (x ευρώ το καθένα) και πλήρωσε συνολικά ${b}€. Πόσο κόστιζε το κάθε τετράδιο (x);`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Notebooks count (a)' : 'Πλήθος τετραδίων (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total cost (b)' : 'Συνολικό κόστος (β)', formula: `${b} €`, val: `${b} €` },
          { item: locale === 'en' ? 'Equation (a · x ＝ b)' : 'Εξίσωση (α · x ＝ β)', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}€` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x}€.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const a = randInt(4, 8);
      const x = randInt(8, 15);
      const b = a * x;
      const kgUnit = locale === 'en' ? 'kg' : 'κιλά';
      const candidateWrongs = [x + 3, x - 2, x + 5, x - 4].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${kgUnit}`, render: <span>{x} ${kgUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${kgUnit}`, render: <span>{v} ${kgUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Packing Potatoes into Sacks' : 'Συσκευασία Πατατών σε Σακιά',
        prompt: (
          <span>
            {locale === 'en'
              ? `A farmer packed ${b} kg of potatoes into ${a} identical sacks (x kg each). How many kg did each sack contain?`
              : `Ένας αγρότης συσκεύασε ${b} κιλά πατάτες σε ${a} όμοια σακιά (x κιλά το καθένα). Πόσα κιλά περιείχε το κάθε σακί;`}
          </span>
        ),
        correctText: `${x} ${kgUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Number of sacks (a)' : 'Πλήθος σακιών (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total weight (b)' : 'Συνολικό βάρος (β)', formula: `${b} kg`, val: `${b} ${kgUnit}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x} ${kgUnit}` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} ${kgUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const a = randInt(4, 6);
      const x = randInt(12, 22);
      const b = a * x;
      const seatUnit = locale === 'en' ? 'seats' : 'καθίσματα';
      const candidateWrongs = [x + 4, x - 3, x + 2, x - 5].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${seatUnit}`, render: <span>{x} ${seatUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${seatUnit}`, render: <span>{v} ${seatUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Theater Seats Rows' : 'Καθίσματα σε Θέατρο',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a theater there are ${a} equal rows of seats (x seats per row). If there are ${b} seats in total, how many seats does each row have?`
              : `Σε ένα θέατρο υπάρχουν ${a} ίσες σειρές καθισμάτων (x καθίσματα ανά σειρά). Αν συνολικά υπάρχουν ${b} καθίσματα, πόσα καθίσματα έχει κάθε σειρά;`}
          </span>
        ),
        correctText: `${x} ${seatUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Rows (a)' : 'Σειρές (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total seats (b)' : 'Συνολικά καθίσματα (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x} ${seatUnit}` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} ${seatUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const a = randInt(5, 8);
      const x = randInt(6, 14);
      const b = a * x;
      const bottleUnit = locale === 'en' ? 'bottles' : 'μπουκάλια';
      const candidateWrongs = [x + 2, x - 2, x + 4, x - 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${bottleUnit}`, render: <span>{x} ${bottleUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${bottleUnit}`, render: <span>{v} ${bottleUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Crates of Juice Bottles' : 'Κιβώτια με Μπουκάλια Χυμού',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a warehouse, ${a} crates hold equal numbers of juice bottles (x bottles per crate). If there are ${b} bottles in total, how many bottles are in each crate?`
              : `Σε μια αποθήκη τοποθετήθηκαν ${a} κιβώτια με ίσο αριθμό από μπουκάλια χυμού (x μπουκάλια το καθένα). Αν όλα μαζί είναι ${b} μπουκάλια, πόσα μπουκάλια έχει κάθε κιβώτιο;`}
          </span>
        ),
        correctText: `${x} ${bottleUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Crates (a)' : 'Κιβώτια (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total bottles (b)' : 'Σύνολο μπουκαλιών (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} ${bottleUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const a = 4;
      const x = randInt(6, 9);
      const b = a * x;
      const candidateWrongs = [x + 2, x - 2, x + 3, x - 1].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Amusement Park Tickets' : 'Εισιτήρια Λούνα Παρκ',
        prompt: (
          <span>
            {locale === 'en'
              ? `A group of ${a} friends bought equal tickets for a ride and paid ${b}€ in total. How much did each child's ticket cost (x)?`
              : `Μια παρέα ${a} παιδιών αγόρασε ισάριθμα εισιτήρια για ένα παιχνίδι στο λούνα παρκ και πλήρωσε συνολικά ${b}€. Πόσο κόστιζε το εισιτήριο για κάθε παιδί (x);`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Children (a)' : 'Παιδιά (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total cost (b)' : 'Συνολικό κόστος (β)', formula: `${b} €`, val: `${b} €` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}€` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x}€.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const a = 6;
      const x = randInt(7, 12);
      const b = a * x;
      const treeUnit = locale === 'en' ? 'saplings' : 'δενδρύλλια';
      const candidateWrongs = [x + 2, x - 2, x + 4, x - 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${treeUnit}`, render: <span>{x} ${treeUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${treeUnit}`, render: <span>{v} ${treeUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Planting Saplings in Rows' : 'Φύτευση Δενδρυλλίων σε Σειρές',
        prompt: (
          <span>
            {locale === 'en'
              ? `An agronomist planted ${b} saplings in ${a} equal rows. How many saplings (x) did he plant in each row?`
              : `Ένας γεωπόνος φύτεψε ${b} δενδρύλλια σε ${a} ίσες σειρές. Πόσα δενδρύλλια (x) φύτεψε σε κάθε σειρά;`}
          </span>
        ),
        correctText: `${x} ${treeUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Rows (a)' : 'Σειρές (α)', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Total saplings (b)' : 'Συνολικά δέντρα (β)', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} ${treeUnit}.`}
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
      const side = randInt(6, 14);
      const perim = 4 * side;
      const cmUnit = locale === 'en' ? 'cm' : 'εκ.';
      const candidateWrongs = [side + 2, side - 2, Math.round(perim / 2), side + 4].filter(v => v !== side && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${side} ${cmUnit}`, render: <span>{side} {cmUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${cmUnit}`, render: <span>{v} ${cmUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Square Perimeter with Unknown Side' : 'Περίμετρος Τετραγώνου με Άγνωστη Πλευρά',
        prompt: (
          <span>
            {locale === 'en'
              ? `The perimeter of a square is ${perim} cm. What is the length of its side (x)?`
              : `Η περίμετρος ενός τετραγώνου είναι ${perim} εκατοστά. Πόσα εκατοστά είναι το μήκος της πλευράς του (x);`}
          </span>
        ),
        correctText: `${side} ${cmUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Perimeter formula' : 'Τύπος περιμέτρου', formula: 'Π ＝ 4 · x', val: `4 · x ＝ ${perim}` },
          { item: locale === 'en' ? 'Solve equation' : 'Επίλυση εξίσωσης', formula: `${perim} : 4`, val: `x ＝ ${side} ${cmUnit}` }
        ],
        explain: (
          <span>
            {`4 · x ＝ ${perim} ➔ x ＝ ${perim} : 4 ＝ ${side} ${cmUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const width = 6;
      const length = randInt(7, 12);
      const area = width * length;
      const mUnit = locale === 'en' ? 'm' : 'μ.';
      const sqUnit = locale === 'en' ? 'sq.m.' : 'τ.μ.';
      const candidateWrongs = [length + 2, length - 2, length + 4, length - 3].filter(v => v !== length && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${length} ${mUnit}`, render: <span>{length} ${mUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${mUnit}`, render: <span>{v} ${mUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Rectangle Area with Unknown Side' : 'Εμβαδόν Ορθογωνίου με Άγνωστη Πλευρά',
        prompt: (
          <span>
            {locale === 'en'
              ? `A rectangular plot has an area of ${area} ${sqUnit} and width of ${width} ${mUnit}. How long is its length (x)?`
              : `Ένα ορθογώνιο οικόπεδο έχει εμβαδόν ${area} τ.μ. και πλάτος ${width} μέτρα. Πόσα μέτρα είναι το μήκος του (x);`}
          </span>
        ),
        correctText: `${length} ${mUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Area formula' : 'Τύπος εμβαδού', formula: 'Ε ＝ πλάτος · μήκος', val: `${width} · x ＝ ${area}` },
          { item: locale === 'en' ? 'Solve equation' : 'Επίλυση εξίσωσης', formula: `${area} : ${width}`, val: `x ＝ ${length} ${mUnit}` }
        ],
        explain: (
          <span>
            {`${width} · x ＝ ${area} ➔ x ＝ ${area} : ${width} ＝ ${length} ${mUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const a = 2.5;
      const x = randInt(4, 8);
      const b = a * x;
      const aStr = locale === 'en' ? String(a) : a.toFixed(1).replace('.', ',');
      const bStr = locale === 'en' ? String(b) : b.toFixed(1).replace('.', ',');
      const candidateWrongs = [x + 1, x - 1, x * 2, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Decimal Factor' : 'Εξίσωση με Δεκαδικό Παράγοντα (2,5 · x ＝ 15)',
        prompt: (
          <span>
            {locale === 'en' ? `Solve the equation: ${aStr} · x ＝ ${bStr}:` : `Λύσε την εξίσωση: ${aStr} · x ＝ ${bStr}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${aStr} · x ＝ ${bStr}`, val: `x ＝ ${bStr} : ${aStr}` },
          { item: locale === 'en' ? 'Decimal division' : 'Διαίρεση δεκαδικών', formula: `${b} : ${a}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x ＝ ${bStr} : ${aStr} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const num = 2;
      const den = 3;
      const mult = randInt(2, 4);
      const x = mult * den;
      const b = (num * x) / den;
      const candidateWrongs = [x + 3, Math.max(1, x - 3), x + 6, x + 2].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Fraction as Coefficient' : 'Εξίσωση με Κλάσμα ως Συντελεστή',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve the equation:' : 'Λύσε την εξίσωση:'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>· x ＝ {b}:</span>
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${num}/${den} · x ＝ ${b}`, val: `x ＝ ${b} : (${num}/${den})` },
          { item: locale === 'en' ? 'Multiply by reciprocal' : 'Πολλαπλασιασμός με αντίστροφο', formula: `${b} · (${den}/${num})`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＝ {b} : <Fraction num={num} den={den} size="sm" /> ＝ {b} · <Fraction num={den} den={num} size="sm" /> ＝ {x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const a = 3;
      const add = 5;
      const x = randInt(4, 8);
      const total = a * x + add;
      const inter = total - add;
      const candidateWrongs = [x + 1, x - 1, x + 2, x + 3].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Two-Step Equation (3x ＋ 5 ＝ 26)' : 'Σύνθετη Εξίσωση (3x ＋ 5 ＝ 26)',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation: ${a}x ＋ ${add} ＝ ${total}:`
              : `Λύσε τη σύνθετη εξίσωση: ${a}x ＋ ${add} ＝ ${total}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (isolate term)' : '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `${a}x ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (divide by coefficient)' : '2ο Βήμα (διαίρεση συντελεστή)', formula: `${inter} : ${a}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`${a}x ＝ ${total} － ${add} ＝ ${inter} ➔ x ＝ ${inter} : ${a} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const side = randInt(8, 16);
      const perim = 3 * side;
      const cmUnit = locale === 'en' ? 'cm' : 'εκ.';
      const candidateWrongs = [side + 3, side - 3, side + 5, side - 2].filter(v => v !== side && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${side} ${cmUnit}`, render: <span>{side} {cmUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${cmUnit}`, render: <span>{v} ${cmUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equilateral Triangle Perimeter' : 'Περίμετρος Ισόπλευρου Τριγώνου',
        prompt: (
          <span>
            {locale === 'en'
              ? `The perimeter of an equilateral triangle is ${perim} cm. What is the length of each side (x)?`
              : `Η περίμετρος ενός ισόπλευρου τριγώνου είναι ${perim} εκατοστά. Πόσο είναι το μήκος της κάθε πλευράς του (x);`}
          </span>
        ),
        correctText: `${side} ${cmUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Perimeter formula' : 'Τύπος περιμέτρου', formula: 'Π ＝ 3 · x', val: `3 · x ＝ ${perim}` },
          { item: locale === 'en' ? 'Solve equation' : 'Επίλυση', formula: `${perim} : 3`, val: `x ＝ ${side} ${cmUnit}` }
        ],
        explain: (
          <span>
            {`3 · x ＝ ${perim} ➔ x ＝ ${perim} : 3 ＝ ${side} ${cmUnit}.`}
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
  // Q1: Input - Βασική εξίσωση a · x = b με φυσικούς αριθμούς
  const q1A = randInt(3, 9);
  const q1X = randInt(4, 15);
  const q1B = q1A * q1X;

  // Q2: Input - Εξίσωση x · a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(12, 25);
  const q2X = randInt(11, 35);
  const q2B = q2A * q2X;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a · x = b
  const q3A = randInt(2, 6);
  const q3X_raw = randInt(12, 65) / 10;
  const q3B_raw = Number((q3A * q3X_raw).toFixed(1));
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = locale === 'en' ? String(q3X_raw) : q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a · x = b
  const q4A = randInt(4, 12);
  const q4X = randInt(5, 14);
  const q4B = q4A * q4X;
  const q4CorrectStep = `x ＝ ${q4B} : ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} · ${q4A}`,
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`,
    `x ＝ ${q4A} · ${q4B}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True/False - Κανόνας εύρεσης άγνωστου παράγοντα
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'To find the unknown factor in a multiplication equation, we divide the product by the known factor (x ＝ b : a).'
        : 'Για να βρούμε τον άγνωστο παράγοντα σε μια εξίσωση πολλαπλασιασμού, διαιρούμε το γινόμενο με τον γνωστό παράγοντα (x ＝ β : α).')
    : (locale === 'en'
        ? 'To find the unknown factor in a multiplication equation, we multiply the product by the known factor (x ＝ b · a).'
        : 'Για να βρούμε τον άγνωστο παράγοντα σε μια εξίσωση πολλαπλασιασμού, πολλαπλασιάζουμε το γινόμενο με τον γνωστό παράγοντα (x ＝ β · α).');

  // Q6: True/False - Αντιμεταθετική ιδιότητα (α · x = x · α)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'Equations 5 · x ＝ 35 and x · 5 ＝ 35 are solved in the exact same way (x ＝ 35 : 5).'
        : 'Η εξίσωση 5 · x ＝ 35 και η εξίσωση x · 5 ＝ 35 λύνονται με τον ίδιο ακριβώς τρόπο (x ＝ 35 : 5).')
    : (locale === 'en'
        ? 'In x · 5 ＝ 35 we cannot divide because x is the first factor.'
        : 'Στην εξίσωση x · 5 ＝ 35 δεν μπορούμε να κάνουμε διαίρεση επειδή το x είναι πρώτος παράγοντας.');

  // Q7: Input - Εξίσωση με κλάσματα: a/b · x = c/b
  const q7Den = randInt(3, 8);
  const q7NumA = randInt(2, 5);
  const q7X = randInt(2, 6);
  const q7NumB = q7NumA * q7X;

  // Q8: MCQ - Επαλήθευση εξίσωσης πολλαπλασιασμού
  const q8A = randInt(3, 6);
  const q8X = randInt(6, 12);
  const q8B = q8A * q8X;
  const q8Wrongs = [q8X + 2, Math.max(1, q8X - 2), q8X + 4, q8X + 3].filter(v => v !== q8X && v > 0);
  const q8Options = makeUniqueMCQ(
    { val: String(q8X), render: <span>{q8X}</span> },
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
      title: locale === 'en' ? 'Equation: a · x ＝ b' : 'Εξίσωση: α · x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${q1A} · x ＝ ${q1B}` : `Λύσε την εξίσωση: ${q1A} · x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} : ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Equation: x · a ＝ b' : 'Εξίσωση: x · α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x · ${q2A} ＝ ${q2B}` : `Λύσε την εξίσωση: x · ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} : ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Decimal Numbers' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: ${q3A} · x ＝ ${q3B}` : `Λύσε την εξίσωση: ${q3A} · x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} : ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve ${q4A} · x ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} · x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate factor x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Unknown Factor Rule' : 'Κανόνας Παράγοντα Γινομένου',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! Inverse of multiplication is division: x ＝ b : a.' : 'Σωστά! Η αντίστροφη πράξη του πολλαπλασιασμού είναι η διαίρεση: x ＝ β : α.')
            : (locale === 'en' ? 'False! To isolate the unknown factor we divide (x ＝ b : a).' : 'Λάθος! Για να βρούμε τον άγνωστο παράγοντα κάνουμε διαίρεση (x ＝ β : α).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Position of Unknown' : 'Θέση του Αγνώστου',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en' ? 'Correct! By the commutative property of multiplication, x is always solved via division: x ＝ b : a.' : 'Σωστά! Λόγω της αντιμεταθετικής ιδιότητας του πολλαπλασιασμού, είτε το x είναι πρώτος είτε δεύτερος παράγοντας, λύνεται πάντα με διαίρεση: x ＝ β : α.')
            : (locale === 'en' ? 'False! In both cases the unknown is a factor solved via division.' : 'Λάθος! Και στις δύο περιπτώσεις ο άγνωστος είναι παράγοντας γινομένου και υπολογίζεται με διαίρεση.')}
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
          <span>· x ＝</span>
          <Fraction num={q7NumB} den={q7Den} size="sm" />
          <span>:</span>
        </span>
      ),
      correct: String(q7X),
      explain: (
        <span>
          x ＝ <Fraction num={q7NumB} den={q7Den} size="sm" /> : <Fraction num={q7NumA} den={q7Den} size="sm" /> ＝ <Fraction num={q7NumB} den={q7Den} size="sm" /> · <Fraction num={q7Den} den={q7NumA} size="sm" /> ＝ {q7NumB} : {q7NumA} ＝ {q7X}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equation Verification' : 'Επαλήθευση Εξίσωσης',
      prompt: locale === 'en' ? `In ${q8A} · x ＝ ${q8B}, which value of x verifies equality?` : `Στην εξίσωση ${q8A} · x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8X),
      explain: `${q8A} · ${q8X} ＝ ${q8B}.`
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

export default function GnostosEpiAgnostosExercisesPage() {
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
          href="/st-dimotikou/36-gnostos-epi-agnostos"
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