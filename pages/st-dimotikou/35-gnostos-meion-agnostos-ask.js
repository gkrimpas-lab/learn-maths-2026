// pages/st-dimotikou/35-gnostos-meion-agnostos-ask.js
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
    pageTitle: "Ασκήσεις: Άγνωστος Αφαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο αφαιρετέο (α - x = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 35 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Αφαιρετέος (α － x ＝ β)",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων αφαίρεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε το αποτέλεσμα...",
    inputPlaceholderFraction: "π.χ. 3/8",
    inputPlaceholderDecimal: "π.χ. 5,3",
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
    pageTitle: "Exercises: Unknown Subtrahend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving equations with an unknown subtrahend (a - x = b) for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 35 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Subtrahend (a － x ＝ b)",
    desc: "Solve the 10 dynamic problems to practice solving subtraction equations with whole numbers, decimals, fractions, and practical word problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    inputPlaceholderFraction: "e.g. 3/8",
    inputPlaceholderDecimal: "e.g. 5.3",
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
      const a = 75;
      const b = 28;
      const x = a - b; // 47
      const name = locale === 'en' ? 'George' : 'Ο Γιώργος';
      const candidateWrongs = [x + 5, x - 4, a + b, x + 10, a - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Buying a Toy & Change' : 'Αγορά Παιχνιδιού και Ρέστα',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} had ${a} euros. He bought a toy costing x euros and had ${b} euros left. How much did the toy cost (x)?`
              : `${name} είχε ${a} ευρώ. Αγόρασε ένα παιχνίδι που κόστιζε x ευρώ και του έμειναν ${b} ευρώ. Πόσο κόστιζε το παιχνίδι (x);`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial sum (a)' : 'Αρχικό ποσό (α)', formula: `${a} €`, val: `${a}` },
          { item: locale === 'en' ? 'Remainder (b)' : 'Υπόλοιπο (β)', formula: `${b} €`, val: `${b}` },
          { item: locale === 'en' ? 'Equation (a － x ＝ b)' : 'Εξίσωση (α － x ＝ β)', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x}€` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x}€.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const a = 60;
      const b = 22;
      const x = a - b; // 38
      const literUnit = locale === 'en' ? 'liters' : 'λίτρα';
      const candidateWrongs = [x + 4, x - 5, a + b, x + 10, a - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${literUnit}`, render: <span>{x} {literUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${literUnit}`, render: <span>{v} ${literUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Oil Consumption from Container' : 'Κατανάλωση Λαδιού από Δοχείο',
        prompt: (
          <span>
            {locale === 'en'
              ? `A container held ${a} liters of olive oil. We used x liters for cooking and ${b} liters remained in the container. How many liters of oil did we use?`
              : `Ένα δοχείο περιείχε ${a} λίτρα λάδι. Χρησιμοποιήσαμε x λίτρα για το μαγείρεμα και στο δοχείο έμειναν ${b} λίτρα. Πόσα λίτρα λάδι χρησιμοποιήσαμε;`}
          </span>
        ),
        correctText: `${x} ${literUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial oil' : 'Αρχικό λάδι', formula: `${a} L`, val: `${a}` },
          { item: locale === 'en' ? 'Oil left' : 'Λάδι που έμεινε', formula: `${b} L`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} ${literUnit}` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} ${literUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const a = 180;
      const b = 65;
      const x = a - b; // 115
      const name = locale === 'en' ? 'Anna' : 'Η Άννα';
      const pageUnit = locale === 'en' ? 'pages' : 'σελίδες';
      const candidateWrongs = [x + 10, x - 10, a + b, x + 20, a - 20].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${pageUnit}`, render: <span>{x} {pageUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pageUnit}`, render: <span>{v} ${pageUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Reading Book Pages' : 'Ανάγνωση Σελίδων Βιβλίου',
        prompt: (
          <span>
            {locale === 'en'
              ? `A book has ${a} pages. ${name} read x pages and has ${b} pages left to finish. How many pages did she read?`
              : `Ένα βιβλίο έχει ${a} σελίδες. ${name} διάβασε x σελίδες και της απομένουν ακόμα ${b} σελίδες για να το τελειώσει. Πόσες σελίδες διάβασε;`}
          </span>
        ),
        correctText: `${x} ${pageUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total pages' : 'Συνολικές σελίδες', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Remaining pages' : 'Σελίδες που απομένουν', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} ${pageUnit}` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} ${pageUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const a = 50;
      const b = 18;
      const x = a - b; // 32
      const ballUnit = locale === 'en' ? 'balls' : 'μπάλες';
      const candidateWrongs = [x + 4, x - 4, a + b, x + 8, a - 8].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${ballUnit}`, render: <span>{x} {ballUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${ballUnit}`, render: <span>{v} ${ballUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Balls Sold in a Store' : 'Πώληση Μπαλών σε Κατάστημα',
        prompt: (
          <span>
            {locale === 'en'
              ? `A store had ${a} sports balls. x balls were sold and ${b} balls remained in stock. How many balls were sold?`
              : `Σε ένα κατάστημα υπήρχαν ${a} μπάλες. Πουλήθηκαν x μπάλες και στο κατάστημα έμειναν ${b} μπάλες. Πόσες μπάλες πουλήθηκαν;`}
          </span>
        ),
        correctText: `${x} ${ballUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial balls' : 'Αρχικές μπάλες', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Remaining balls' : 'Μπάλες που έμειναν', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} ${ballUnit}` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} ${ballUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const a = 40;
      const b = 14;
      const x = a - b; // 26
      const meterUnit = locale === 'en' ? 'meters' : 'μέτρα';
      const candidateWrongs = [x + 5, x - 3, a + b, x + 8, a - 8].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${meterUnit}`, render: <span>{x} {meterUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${meterUnit}`, render: <span>{v} ${meterUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Ribbon Used from a Roll' : 'Χρήση Κορδέλας από Ρολό',
        prompt: (
          <span>
            {locale === 'en'
              ? `A roll of ribbon had length ${a} meters. We cut off a piece of x meters for gift wrapping and ${b} meters remained. How long was the piece cut?`
              : `Ένα ρολό κορδέλας είχε μήκος ${a} μέτρα. Κόψαμε ένα κομμάτι x μέτρων για συσκευασία δώρων και στο ρολό έμειναν ${b} μέτρα. Πόσο ήταν το μήκος του κομματιού που κόψαμε;`}
          </span>
        ),
        correctText: `${x} ${meterUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial length' : 'Αρχικό μήκος', formula: `${a} m`, val: `${a}` },
          { item: locale === 'en' ? 'Remaining length' : 'Μήκος που έμεινε', formula: `${b} m`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} m` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} ${meterUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const a = 500;
      const b = 320;
      const x = a - b; // 180
      const sheetUnit = locale === 'en' ? 'sheets' : 'φύλλα';
      const candidateWrongs = [x + 20, x - 20, a + b, x + 40, a - 40].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${sheetUnit}`, render: <span>{x} {sheetUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${sheetUnit}`, render: <span>{v} ${sheetUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Printer Paper Ream Consumption' : 'Κατανάλωση Χαρτιού Εκτύπωσης',
        prompt: (
          <span>
            {locale === 'en'
              ? `A ream of copy paper had ${a} sheets. We used x sheets for printing and ${b} sheets remained. How many sheets of paper were used?`
              : `Ένα πακέτο φωτοτυπικού χαρτιού είχε ${a} φύλλα. Χρησιμοποιήσαμε x φύλλα για εκτυπώσεις και στο πακέτο έμειναν ${b} φύλλα. Πόσα φύλλα χαρτιού χρησιμοποιήσαμε;`}
          </span>
        ),
        correctText: `${x} ${sheetUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial sheets' : 'Αρχικά φύλλα', formula: `${a}`, val: `${a}` },
          { item: locale === 'en' ? 'Remaining sheets' : 'Φύλλα που έμειναν', formula: `${b}`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} ${sheetUnit}` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} ${sheetUnit}.`}
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
      const a = 8.5;
      const b = 3.2;
      const x = Number((a - b).toFixed(1)); // 5.3
      const aStr = locale === 'en' ? String(a) : a.toFixed(1).replace('.', ',');
      const bStr = locale === 'en' ? String(b) : b.toFixed(1).replace('.', ',');
      const xStr = locale === 'en' ? String(x) : x.toFixed(1).replace('.', ',');
      const candidateWrongs = [
        locale === 'en' ? '11.7' : '11,7',
        locale === 'en' ? (x + 1).toFixed(1) : (x + 1).toFixed(1).replace('.', ','),
        locale === 'en' ? (x - 0.5).toFixed(1) : (x - 0.5).toFixed(1).replace('.', ','),
        locale === 'en' ? (x + 2).toFixed(1) : (x + 2).toFixed(1).replace('.', ',')
      ];
      const optionsRaw = makeUniqueMCQ(
        { val: xStr, render: <span>{xStr}</span> },
        candidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Decimal Subtrahend Equation' : 'Εξίσωση με Δεκαδικό Αφαιρετέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the decimal equation: ${aStr} － x ＝ ${bStr}:`
              : `Λύσε την εξίσωση με δεκαδικούς αριθμούς: ${aStr} － x ＝ ${bStr}:`}
          </span>
        ),
        correctText: xStr,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${aStr} － x ＝ ${bStr}`, val: `x ＝ ${aStr} － ${bStr}` },
          { item: locale === 'en' ? 'Decimal subtraction' : 'Αφαίρεση δεκαδικών', formula: `${aStr} － ${bStr}`, val: `${xStr}` }
        ],
        explain: (
          <span>
            {`x ＝ ${aStr} － ${bStr} ＝ ${xStr}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const optionsRaw = [
        { val: '4/8', render: <Fraction num="4" den="8" size="md" /> },
        { val: '10/8', render: <Fraction num="10" den="8" size="md" /> },
        { val: '2/8', render: <Fraction num="2" den="8" size="md" /> },
        { val: '5/8', render: <Fraction num="5" den="8" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Fractions Equation (7/8 － x ＝ 3/8)' : 'Εξίσωση με Ομώνυμα Κλάσματα (7/8 － x ＝ 3/8)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve equation with fractions:' : 'Λύσε την εξίσωση με κλάσματα:'}</span>
            <Fraction num="7" den="8" size="sm" />
            <span>－ x ＝</span>
            <Fraction num="3" den="8" size="sm" />
            <span>({locale === 'en' ? 'e.g. 4/8 or 1/2' : 'π.χ. 4/8 ή 1/2'}):</span>
          </span>
        ),
        correctText: '4/8',
        altCorrect: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="4" den="8" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 1/2' : 'ή 1/2'})</span>
          </span>
        ),
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: '7/8 － x ＝ 3/8', val: 'x ＝ 7/8 － 3/8' },
          { item: locale === 'en' ? 'Numerator subtraction' : 'Αφαίρεση αριθμητών', formula: '(7 － 3) / 8', val: '4/8 ＝ 1/2' }
        ],
        explain: (
          <span>
            x ＝ <Fraction num="7" den="8" size="sm" /> － <Fraction num="3" den="8" size="sm" /> ＝ <Fraction num="4" den="8" size="sm" /> ＝ <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const a = 50;
      const b = 25;
      const knownAdd = 10;
      const inter = a - b; // 25
      const x = inter - knownAdd; // 15
      const candidateWrongs = [x + 5, x - 3, a + b, x + 10, inter].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation 50 － (x ＋ 10) ＝ 25' : 'Σύνθετη Εξίσωση 50 － (x ＋ 10) ＝ 25',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation: ${a} － (x ＋ ${knownAdd}) ＝ ${b}:`
              : `Λύσε την εξίσωση: ${a} － (x ＋ ${knownAdd}) ＝ ${b}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Step 1 (isolate parenthesis)' : 'Πρώτο βήμα (εύρεση παρένθεσης)', formula: `${a} － ${b}`, val: `x ＋ ${knownAdd} ＝ ${inter}` },
          { item: locale === 'en' ? 'Step 2 (solve addition)' : 'Δεύτερο βήμα (λύση πρόσθεσης)', formula: `${inter} － ${knownAdd}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x ＋ ${knownAdd} ＝ ${a} － ${b} ＝ ${inter} ➔ x ＝ ${inter} － ${knownAdd} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const a = 40;
      const b = 12;
      const x = a - b; // 28
      const candidateWrongs = [b, x + 4, x - 4, a - 2].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>x ＝ {x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>x ＝ {v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Finding Subtrahend with Percentage' : 'Εύρεση Αφαιρετέου με Ποσοστό',
        prompt: (
          <span>
            {locale === 'en'
              ? `In equation ${a} － x ＝ b, difference b equals 30% of ${a} (i.e. b ＝ ${b}). What is the value of unknown subtrahend x?`
              : `Στην εξίσωση ${a} － x ＝ β, η διαφορά β ισούται με το 30% του αριθμού ${a} (δηλαδή β ＝ ${b}). Ποια είναι η τιμή του άγνωστου αφαιρετέου x;`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>x ＝ {x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Calculate difference b' : 'Υπολογισμός διαφοράς β', formula: `${a} · 0.30`, val: `${b}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b}` },
          { item: locale === 'en' ? 'Value of x' : 'Τιμή x', formula: `${a} － ${b}`, val: `${x}` }
        ],
        explain: (
          <span>
            {`${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const ageFather = 38;
      const diff = 12;
      const x = ageFather - diff; // 26
      const yearUnit = locale === 'en' ? 'years old' : 'ετών';
      const candidateWrongs = [x + 4, x - 3, ageFather + diff, x + 6, diff].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${yearUnit}`, render: <span>{x} {yearUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${yearUnit}`, render: <span>{v} ${yearUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Age Problem with Subtrahend' : 'Πρόβλημα Ηλικίας με Αφαιρετέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `A father is ${ageFather} years old. If we subtract his son's age (x), the difference is ${diff} years. How old is the son (x)?`
              : `Ένας πατέρας είναι ${ageFather} ετών. Αν από την ηλικία του αφαιρέσουμε την ηλικία του γιου του (x), η διαφορά τους είναι ${diff} χρόνια. Πόσων ετών είναι ο γιος (x);`}
          </span>
        ),
        correctText: `${x} ${yearUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Age equation' : 'Εξίσωση ηλικίας', formula: `${ageFather} － x ＝ ${diff}`, val: `x ＝ ${ageFather} － ${diff}` },
          { item: locale === 'en' ? 'Son age' : 'Ηλικία γιου', formula: `${ageFather} － ${diff}`, val: `${x} ${yearUnit}` }
        ],
        explain: (
          <span>
            {`${ageFather} － x ＝ ${diff} ➔ x ＝ ${ageFather} － ${diff} ＝ ${x} ${yearUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const a = 100;
      const b = 60;
      const diff = a - b; // 40
      const x = diff / 2; // 20
      const candidateWrongs = [x + 10, Math.max(1, x - 5), a - b, x + 5].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation 100 － 2x ＝ 60' : 'Σύνθετη Εξίσωση 100 － 2x ＝ 60',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation: ${a} － 2x ＝ ${b}:`
              : `Λύσε την εξίσωση: ${a} － 2x ＝ ${b}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Isolate 2x' : 'Εύρεση διπλάσιου 2x', formula: `${a} － ${b}`, val: `2x ＝ ${diff}` },
          { item: locale === 'en' ? 'Find x' : 'Εύρεση x', formula: `${diff} : 2`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`2x ＝ ${a} － ${b} ＝ ${diff} ➔ x ＝ ${diff} : 2 ＝ ${x}.`}
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
  // Q1: Input - Βασική εξίσωση a - x = b με φυσικούς αριθμούς
  const q1A = randInt(25, 75);
  const q1B = randInt(8, q1A - 8);
  const q1X = q1A - q1B;

  // Q2: Input - Εξίσωση a - x = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(110, 350);
  const q2B = randInt(35, q2A - 40);
  const q2X = q2A - q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a - x = b
  const q3A_raw = randInt(45, 95) / 10;
  const q3B_raw = randInt(12, Math.floor(q3A_raw * 10) - 10) / 10;
  const q3X_raw = Number((q3A_raw - q3B_raw).toFixed(1));
  const q3A = locale === 'en' ? String(q3A_raw) : q3A_raw.toFixed(1).replace('.', ',');
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = locale === 'en' ? String(q3X_raw) : q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a - x = b
  const q4A = randInt(30, 80);
  const q4B = randInt(10, q4A - 10);
  const q4CorrectStep = `x ＝ ${q4A} － ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4A} ＋ ${q4B}`,
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`,
    `x ＝ ${q4A} · ${q4B}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True/False - Κανόνας εύρεσης άγνωστου αφαιρετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'In equation a － x ＝ b, unknown x is the subtrahend and is computed by subtraction: x ＝ a － b.'
        : 'Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και υπολογίζεται με αφαίρεση: x ＝ α － β.')
    : (locale === 'en'
        ? 'In equation a － x ＝ b, unknown x is computed by addition: x ＝ a ＋ b.'
        : 'Στην εξίσωση α － x ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ α ＋ β.');

  // Q6: True/False - Σχέση μεγέθους όρων στην αφαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'In equation a － x ＝ b, the minuend (a) is always greater than both the subtrahend (x) and the difference (b).'
        : 'Στην εξίσωση α － x ＝ β, ο μειωτέος (α) είναι πάντοτε μεγαλύτερος τόσο από τον αφαιρετέο (x) όσο και από τη διαφορά (β).')
    : (locale === 'en'
        ? 'In equation a － x ＝ b, the unknown subtrahend (x) is always greater than the minuend (a).'
        : 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος (x) είναι πάντοτε μεγαλύτερος από τον μειωτέο (α).');

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: n1/d - x = n2/d
  const q7Den = randInt(6, 15);
  const q7N1 = randInt(5, q7Den - 1);
  const q7N2 = randInt(1, q7N1 - 2);
  const q7DiffN = q7N1 - q7N2;
  const q7G = gcd(q7DiffN, q7Den);
  const q7CorrectRaw = `${q7DiffN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7DiffN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης αφαίρεσης
  const q8A = randInt(30, 60);
  const q8B = randInt(10, q8A - 10);
  const q8CorrectX = q8A - q8B;
  const q8Wrongs = [q8CorrectX + 5, q8A + q8B, Math.max(1, q8CorrectX - 3), q8CorrectX + 8].filter(v => v !== q8CorrectX && v > 0);
  const q8Options = makeUniqueMCQ(
    { val: String(q8CorrectX), render: <span>{q8CorrectX}</span> },
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
      title: locale === 'en' ? 'Equation: a － x ＝ b' : 'Εξίσωση: α － x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${q1A} － x ＝ ${q1B}` : `Λύσε την εξίσωση: ${q1A} － x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} － ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Larger Numbers' : 'Μεγαλύτεροι Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: ${q2A} － x ＝ ${q2B}` : `Λύσε την εξίσωση: ${q2A} － x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} － ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Decimal Numbers' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: ${q3A} － x ＝ ${q3B}` : `Λύσε την εξίσωση: ${q3A} － x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} － ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve ${q4A} － x ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} － x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate subtrahend x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο αφαιρετέο x, αφαιρούμε τη διαφορά από τον μειωτέο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Subtrahend Rule' : 'Κανόνας Αφαιρετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! Subtrahend is found by subtraction: x ＝ a － b.' : 'Σωστά! Για να βρούμε τι αφαιρέθηκε από το αρχικό ποσό (αφαιρετέος), αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ α － β.')
            : (locale === 'en' ? 'False! To find the subtrahend we subtract: x ＝ a － b.' : 'Λάθος! Για να βρούμε τον αφαιρετέο κάνουμε αφαίρεση (x ＝ α － β).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Terms Order in Subtraction' : 'Σχέση Όρων Αφαίρεσης',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en' ? 'Correct! Minuend a is the initial total, thus larger than both x and b.' : 'Σωστά! Ο μειωτέος (α) είναι το αρχικό ολικό μέγεθος, επομένως είναι μεγαλύτερος από το x και από το β.')
            : (locale === 'en' ? 'False! Minuend a is the largest number in subtraction (a ＞ x and a ＞ b).' : 'Λάθος! Ο μειωτέος (α) είναι το μεγαλύτερο μέγεθος στην αφαίρεση (α ＞ x και α ＞ β).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'fraction',
      title: locale === 'en' ? 'Fractions Equation' : 'Εξίσωση με Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Solve fraction equation:' : 'Λύσε την εξίσωση με τα κλάσματα:'}</span>
          <Fraction num={q7N1} den={q7Den} size="sm" />
          <span>－ x ＝</span>
          <Fraction num={q7N2} den={q7Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/8' : 'π.χ. 3/8'}):</span>
        </span>
      ),
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: (
        <span>
          x ＝ <Fraction num={q7N1} den={q7Den} size="sm" /> － <Fraction num={q7N2} den={q7Den} size="sm" /> ＝ <Fraction num={q7DiffN} den={q7Den} size="sm" />
          {q7G > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={q7DiffN / q7G} den={q7Den / q7G} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equation Verification' : 'Επαλήθευση Εξίσωσης',
      prompt: locale === 'en' ? `In ${q8A} － x ＝ ${q8B}, which value of x verifies equality?` : `Στην εξίσωση ${q8A} － x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `${q8A} － ${q8CorrectX} ＝ ${q8B}.`
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

export default function GnostosMeionAgnostosExercisesPage() {
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
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/]/g, '');
        const parts = sanitized.split('/');
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
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
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase() : null;

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      // Έλεγχος δεκαδικών με ανοχή 0.05
      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }

      // Έλεγχος ισοδυναμίας κλασμάτων / ακεραίων
      if (q.inputType === 'fraction') {
        const parseFraction = (str) => {
          if (!str) return NaN;
          if (str.includes('/')) {
            const [n, d] = str.split('/').map(Number);
            return d !== 0 ? n / d : NaN;
          }
          return Number(str.replace(',', '.'));
        };
        const u = parseFraction(cleanUser);
        const t = parseFraction(cleanTarget);
        return !isNaN(u) && !isNaN(t) && Math.abs(u - t) < 1e-6;
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
          href="/st-dimotikou/35-gnostos-meion-agnostos"
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] cursor-pointer ${
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
                          inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={
                            q.inputType === 'fraction'
                              ? t.inputPlaceholderFraction
                              : q.inputType === 'decimal'
                              ? t.inputPlaceholderDecimal
                              : t.inputPlaceholder
                          }
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