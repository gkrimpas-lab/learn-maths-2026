// pages/st-dimotikou/34-agnostos-kai-afairesi-ask.js
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
    pageTitle: "Ασκήσεις: Άγνωστος Μειωτέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο μειωτέο (x - α = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 34 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Μειωτέος (x － α ＝ β)",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων αφαίρεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε το αποτέλεσμα...",
    inputPlaceholderFraction: "π.χ. 5/7",
    inputPlaceholderDecimal: "π.χ. 7,7",
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
    pageTitle: "Exercises: Unknown Minuend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving subtraction equations with an unknown minuend (x - a = b) for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 34 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Minuend (x － a ＝ b)",
    desc: "Solve the 10 dynamic problems to practice solving subtraction equations with whole numbers, decimals, fractions, and practical word problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    inputPlaceholderFraction: "e.g. 5/7",
    inputPlaceholderDecimal: "e.g. 7.7",
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
      const sub = 35;
      const rem = 90;
      const total = sub + rem; // 125
      const name = locale === 'en' ? 'Eleni' : 'Η Ελένη';
      const pageUnit = locale === 'en' ? 'pages' : 'σελίδες';
      const candidateWrongs = [total - 10, total + 15, total + 25, total - 20, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total} ${pageUnit}`, render: <span>{total} {pageUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pageUnit}`, render: <span>{v} {pageUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Reading Book Pages' : 'Ανάγνωση Σελίδων Βιβλίου',
        prompt: (
          <span>
            {locale === 'en'
              ? `A novel has x pages in total. ${name} read ${sub} pages and has ${rem} pages left unread. How many pages does the novel have in total?`
              : `Ένα μυθιστόρημα έχει συνολικά x σελίδες. ${name} διάβασε ${sub} σελίδες και της έμειναν ${rem} σελίδες αδιάβαστες. Πόσες σελίδες έχει συνολικά το μυθιστόρημα;`}
          </span>
        ),
        correctText: `${total} ${pageUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Pages read' : 'Σελίδες που διαβάστηκαν', formula: `${sub}`, val: `${sub}` },
          { item: locale === 'en' ? 'Pages left' : 'Σελίδες που έμειναν', formula: `${rem}`, val: `${rem}` },
          { item: locale === 'en' ? 'Equation (x － a ＝ b)' : 'Εξίσωση (x － α ＝ β)', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ${pageUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const sub = 24;
      const rem = 36;
      const total = sub + rem; // 60
      const studentUnit = locale === 'en' ? 'students' : 'μαθητές';
      const candidateWrongs = [total + 10, total - 6, total - 14, total + 16, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total} ${studentUnit}`, render: <span>{total} {studentUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${studentUnit}`, render: <span>{v} {studentUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Students in the School Yard' : 'Μαθητές στην Αυλή του Σχολείου',
        prompt: (
          <span>
            {locale === 'en'
              ? `There were x students in the yard. ${sub} students entered their classrooms and ${rem} students remained in the yard. How many students were originally in the yard?`
              : `Στην αυλή βρίσκονταν x μαθητές. Μπήκαν στις τάξεις ${sub} μαθητές και στην αυλή έμειναν ${rem} μαθητές. Πόσοι μαθητές βρίσκονταν αρχικά στην αυλή;`}
          </span>
        ),
        correctText: `${total} ${studentUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Students left' : 'Μαθητές που έφυγαν', formula: `${sub}`, val: `${sub}` },
          { item: locale === 'en' ? 'Students remaining' : 'Μαθητές που έμειναν', formula: `${rem}`, val: `${rem}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ${studentUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const sub = 18;
      const rem = 32;
      const total = sub + rem; // 50
      const kgUnit = locale === 'en' ? 'kg' : 'κιλά';
      const candidateWrongs = [total + 5, total - 5, total + 12, total - 12, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total} ${kgUnit}`, render: <span>{total} {kgUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${kgUnit}`, render: <span>{v} ${kgUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Using Flour from a Sack' : 'Χρήση Αλευριού από Σακί',
        prompt: (
          <span>
            {locale === 'en'
              ? `A sack contained x kg of flour. We used ${sub} kg for baking bread and ${rem} kg remained in the sack. How many kg of flour did the sack contain originally?`
              : `Ένα σακί περιείχε x κιλά αλεύρι. Χρησιμοποιήσαμε για ψωμί ${sub} κιλά και στο σακί έμειναν ${rem} κιλά. Πόσα κιλά αλεύρι είχε αρχικά το σακί;`}
          </span>
        ),
        correctText: `${total} ${kgUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Flour used' : 'Αλεύρι που χρησιμοποιήθηκε', formula: `${sub} kg`, val: `${sub}` },
          { item: locale === 'en' ? 'Flour remaining' : 'Αλεύρι που έμεινε', formula: `${rem} kg`, val: `${rem}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ${kgUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const sub = 25;
      const rem = 45;
      const total = sub + rem; // 70
      const name = locale === 'en' ? 'Petros' : 'Ο Πέτρος';
      const candidateWrongs = [total + 10, total - 10, total + 15, total - 15, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total}€`, render: <span>{total}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Buying a Book & Remaining Money' : 'Αγορά Βιβλίου και Υπόλοιπο Χρημάτων',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} had an amount of money x. He bought a book costing ${sub}€ and was left with ${rem}€. How much money did he have originally?`
              : `${name} είχε ένα χρηματικό ποσό x. Αγόρασε ένα βιβλίο που κόστιζε ${sub} ευρώ και του έμειναν ${rem} ευρώ. Πόσα χρήματα είχε αρχικά ο Πέτρος;`}
          </span>
        ),
        correctText: `${total}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Book cost' : 'Κόστος βιβλίου', formula: `${sub} €`, val: `${sub}` },
          { item: locale === 'en' ? 'Remaining money' : 'Ρέστα που έμειναν', formula: `${rem} €`, val: `${rem}` },
          { item: locale === 'en' ? 'Initial sum' : 'Αρχικό ποσό', formula: `${rem} ＋ ${sub}`, val: `${total} €` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total}€.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const sub = 20;
      const rem = 25;
      const total = sub + rem; // 45
      const literUnit = locale === 'en' ? 'liters' : 'λίτρα';
      const candidateWrongs = [total + 5, total - 5, total + 10, total - 10, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total} ${literUnit}`, render: <span>{total} {literUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${literUnit}`, render: <span>{v} ${literUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Gasoline Consumption in a Car' : 'Κατανάλωση Βενζίνης σε Αυτοκίνητο',
        prompt: (
          <span>
            {locale === 'en'
              ? `A car's tank contained x liters of fuel. During a trip, ${sub} liters were consumed and ${rem} liters remained in the tank. How many liters of fuel were in the tank originally?`
              : `Το ρεζερβουάρ ενός αυτοκινήτου είχε x λίτρα βενζίνη. Κατά τη διάρκεια ενός ταξιδιού καταναλώθηκαν ${sub} λίτρα και στο ρεζερβουάρ έμειναν ${rem} λίτρα. Πόσα λίτρα βενζίνη είχε αρχικά;`}
          </span>
        ),
        correctText: `${total} ${literUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Consumption' : 'Κατανάλωση', formula: `${sub} L`, val: `${sub}` },
          { item: locale === 'en' ? 'Remaining fuel' : 'Υπόλοιπο', formula: `${rem} L`, val: `${rem}` },
          { item: locale === 'en' ? 'Initial quantity' : 'Αρχική ποσότητα', formula: `${rem} ＋ ${sub}`, val: `${total} L` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ${literUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const sub = 12;
      const rem = 38;
      const total = sub + rem; // 50
      const meterUnit = locale === 'en' ? 'meters' : 'μέτρα';
      const candidateWrongs = [total + 10, total - 8, total + 15, total - 15, rem].filter(v => v !== total && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${total} ${meterUnit}`, render: <span>{total} ${meterUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${meterUnit}`, render: <span>{v} ${meterUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Cutting Length from a Rope' : 'Αφαίρεση Μήκους από Σχοινί',
        prompt: (
          <span>
            {locale === 'en'
              ? `A rope had an initial length of x meters. We cut off a piece of ${sub} meters and the remaining part is ${rem} meters long. What was the initial length of the rope?`
              : `Ένα σχοινί είχε αρχικό μήκος x μέτρα. Κόψαμε ένα κομμάτι μήκους ${sub} μέτρων και το υπόλοιπο τμήμα έχει μήκος ${rem} μέτρα. Πόσο ήταν το αρχικό μήκος του σχοινιού;`}
          </span>
        ),
        correctText: `${total} ${meterUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Piece cut' : 'Κομμάτι που κόπηκε', formula: `${sub} m`, val: `${sub}` },
          { item: locale === 'en' ? 'Remaining rope' : 'Υπόλοιπο σχοινί', formula: `${rem} m`, val: `${rem}` },
          { item: locale === 'en' ? 'Initial length' : 'Αρχικό μήκος', formula: `${rem} ＋ ${sub}`, val: `${total} m` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ${meterUnit}.`}
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
      const a = 3.5;
      const b = 4.2;
      const x = Number((a + b).toFixed(1)); // 7.7
      const aStr = locale === 'en' ? String(a) : a.toFixed(1).replace('.', ',');
      const bStr = locale === 'en' ? String(b) : b.toFixed(1).replace('.', ',');
      const xStr = locale === 'en' ? String(x) : x.toFixed(1).replace('.', ',');
      const candidateWrongs = [
        locale === 'en' ? '0.7' : '0,7',
        locale === 'en' ? (x + 1).toFixed(1) : (x + 1).toFixed(1).replace('.', ','),
        locale === 'en' ? (x - 0.5).toFixed(1) : (x - 0.5).toFixed(1).replace('.', ','),
        locale === 'en' ? (x + 2).toFixed(1) : (x + 2).toFixed(1).replace('.', ',')
      ];
      const optionsRaw = makeUniqueMCQ(
        { val: xStr, render: <span>{xStr}</span> },
        candidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Decimal Minuend' : 'Εξίσωση με Δεκαδικό Μειωτέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the decimal equation: x － ${aStr} ＝ ${bStr}:`
              : `Λύσε την εξίσωση με δεκαδικούς αριθμούς: x － ${aStr} ＝ ${bStr}:`}
          </span>
        ),
        correctText: xStr,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x － ${aStr} ＝ ${bStr}`, val: `x ＝ ${bStr} ＋ ${aStr}` },
          { item: locale === 'en' ? 'Decimal addition' : 'Πρόσθεση δεκαδικών', formula: `${bStr} ＋ ${aStr}`, val: `${xStr}` }
        ],
        explain: (
          <span>
            {`x ＝ ${bStr} ＋ ${aStr} ＝ ${xStr}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const den = 5;
      const a = 2;
      const b = 4;
      const xNum = a + b; // 6
      const optionsRaw = [
        { val: '6/5', render: <Fraction num="6" den="5" size="md" /> },
        { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
        { val: '8/5', render: <Fraction num="8" den="5" size="md" /> },
        { val: '1/5', render: <Fraction num="1" den="5" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Equation with Fractions' : 'Εξίσωση με Κλάσματα (x － 2/5 ＝ 4/5)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve equation with like fractions:' : 'Λύσε την εξίσωση με ομώνυμα κλάσματα:'}</span>
            <span>x －</span>
            <Fraction num={a} den={den} size="sm" />
            <span>＝</span>
            <Fraction num={b} den={den} size="sm" />
            <span>({locale === 'en' ? 'e.g. 6/5' : 'π.χ. 6/5'}):</span>
          </span>
        ),
        correctText: `${xNum}/${den}`,
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num={xNum} den={den} size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 1 1/5' : 'ή 1 και 1/5'})</span>
          </span>
        ),
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: 'x － 2/5 ＝ 4/5', val: 'x ＝ 4/5 ＋ 2/5' },
          { item: locale === 'en' ? 'Addition of numerators' : 'Πρόσθεση αριθμητών', formula: '(4 ＋ 2) / 5', val: `${xNum}/${den}` }
        ],
        explain: (
          <span>
            x ＝ <Fraction num={b} den={den} size="sm" /> ＋ <Fraction num={a} den={den} size="sm" /> ＝ ({b} ＋ {a})/{den} ＝ <Fraction num={xNum} den={den} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const a = 12;
      const add = 8;
      const total = 35;
      const intermediate = total - add; // 27
      const x = intermediate + a; // 39
      const candidateWrongs = [x + 5, x - 4, total + a, x + 10, intermediate].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Composite Equation (x － 12) ＋ 8 ＝ 35' : 'Σύνθετη Εξίσωση (x － 12) ＋ 8 ＝ 35',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation: (x － ${a}) ＋ ${add} ＝ ${total}:`
              : `Λύσε την εξίσωση: (x － ${a}) ＋ ${add} ＝ ${total}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'First step (isolate parenthesis)' : 'Πρώτο βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `x － ${a} ＝ ${intermediate}` },
          { item: locale === 'en' ? 'Second step (find minuend)' : 'Δεύτερο βήμα (εύρεση μειωτέου)', formula: `${intermediate} ＋ ${a}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x － ${a} ＝ ${total} － ${add} ＝ ${intermediate} ➔ x ＝ ${intermediate} ＋ ${a} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const total = 15;
      const rem = 9;
      const x = total - rem; // 6
      const candidateWrongs = [total + rem, x + 2, Math.max(1, x - 2), x + 4, total].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>x ＝ {x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>x ＝ {v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Unknown Subtrahend (15 － x ＝ 9)' : 'Εύρεση Αφαιρετέου από Μειωτέο (15 － x ＝ 9)',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation where the unknown is the subtrahend: ${total} － x ＝ ${rem}:`
              : `Λύσε την εξίσωση όπου ο άγνωστος είναι αφαιρετέος: ${total} － x ＝ ${rem}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>x ＝ {x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Subtraction balance' : 'Ισορροπία αφαίρεσης', formula: `${total} － ${rem}`, val: `${total} － ${rem}` },
          { item: locale === 'en' ? 'Calculation of x' : 'Υπολογισμός x', formula: `${total} － ${rem}`, val: `${x}` }
        ],
        explain: (
          <span>
            {`x ＝ ${total} － ${rem} ＝ ${x}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const sub = 5;
      const rem = 28;
      const x = rem + sub; // 33
      const name = locale === 'en' ? 'Nikos' : 'Ο Νίκος';
      const yearUnit = locale === 'en' ? 'years old' : 'ετών';
      const candidateWrongs = [rem - sub, x + 3, x - 2, x + 5, rem].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${yearUnit}`, render: <span>{x} {yearUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${yearUnit}`, render: <span>{v} ${yearUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Age Word Problem with Minuend' : 'Πρόβλημα Ηλικίας με Μειωτέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `${sub} years ago, ${name}'s age was ${rem} years. How old is he today (x)?`
              : `Πριν από ${sub} χρόνια η ηλικία του Νίκου ήταν ${rem} ετών. Πόσων ετών είναι σήμερα ο Νίκος (x);`}
          </span>
        ),
        correctText: `${x} ${yearUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Age equation' : 'Εξίσωση ηλικίας', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub}` },
          { item: locale === 'en' ? 'Current age' : 'Συνολικά έτη', formula: `${rem} ＋ ${sub}`, val: `${x}` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${x} ${yearUnit}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const sub = 4;
      const mult = 2;
      const val = 16;
      const inter = val / mult; // 8
      const x = inter + sub; // 12
      const candidateWrongs = [x + 4, x - 3, val + sub, x + 6, inter].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>{x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Two Operations' : 'Εξίσωση με Δύο Πράξεις και Μειωτέο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the equation: (x － ${sub}) · ${mult} ＝ ${val}:`
              : `Λύσε την εξίσωση: (x － ${sub}) · ${mult} ＝ ${val}:`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>{x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'First step (division)' : 'Πρώτο βήμα (διαίρεση)', formula: `${val} : ${mult}`, val: `x － ${sub} ＝ ${inter}` },
          { item: locale === 'en' ? 'Second step (addition)' : 'Δεύτερο βήμα (πρόσθεση)', formula: `${inter} ＋ ${sub}`, val: `x ＝ ${x}` }
        ],
        explain: (
          <span>
            {`x － ${sub} ＝ ${val} : ${mult} ＝ ${inter} ➔ x ＝ ${inter} ＋ ${sub} ＝ ${x}.`}
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
  // Q1: Input - Βασική εξίσωση x - a = b με φυσικούς αριθμούς
  const q1A = randInt(12, 45);
  const q1B = randInt(15, 65);
  const q1X = q1B + q1A;

  // Q2: Input - Εξίσωση x - a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(45, 150);
  const q2B = randInt(55, 230);
  const q2X = q2B + q2A;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x - a = b
  const q3A_raw = randInt(15, 85) / 10;
  const q3B_raw = randInt(25, 95) / 10;
  const q3X_raw = Number((q3B_raw + q3A_raw).toFixed(1));
  const q3A = locale === 'en' ? String(q3A_raw) : q3A_raw.toFixed(1).replace('.', ',');
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = locale === 'en' ? String(q3X_raw) : q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x - a = b
  const q4A = randInt(12, 38);
  const q4B = randInt(20, 50);
  const q4CorrectStep = `x ＝ ${q4B} ＋ ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4B} · ${q4A}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True/False - Κανόνας εύρεσης άγνωστου μειωτέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'In equation x － a ＝ b, unknown x is the minuend and is computed by addition: x ＝ b ＋ a.'
        : 'Στην εξίσωση x － α ＝ β, ο άγνωστος x είναι ο μειωτέος και υπολογίζεται με πρόσθεση: x ＝ β ＋ α.')
    : (locale === 'en'
        ? 'In equation x － a ＝ b, unknown x is always computed by subtraction: x ＝ b － a.'
        : 'Στην εξίσωση x － α ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με αφαίρεση: x ＝ β － α.');

  // Q6: True/False - Σχέση μεγέθους μειωτέου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'The minuend (x) is always greater than both the subtrahend (a) and the difference (b).'
        : 'Ο μειωτέος (x) είναι πάντοτε μεγαλύτερος τόσο από τον αφαιρετέο (α) όσο και από τη διαφορά (β).')
    : (locale === 'en'
        ? 'The minuend (x) is always smaller than the difference (b).'
        : 'Ο μειωτέος (x) είναι πάντοτε μικρότερος από τη διαφορά (β).');

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: x - n1/d = n2/d
  const q7Den = randInt(5, 12);
  const q7N1 = randInt(1, 4);
  const q7N2 = randInt(2, 5);
  const q7SumN = q7N1 + q7N2;
  const q7G = gcd(q7SumN, q7Den);
  const q7CorrectRaw = `${q7SumN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7SumN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης αφαίρεσης
  const q8A = randInt(10, 20);
  const q8B = randInt(25, 45);
  const q8CorrectX = q8B + q8A;
  const q8Wrongs = [q8CorrectX - 5, q8B - q8A, q8CorrectX + 4, q8CorrectX + 10].filter(v => v !== q8CorrectX && v > 0);
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
      title: locale === 'en' ? 'Equation: x － a ＝ b' : 'Εξίσωση: x － α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x － ${q1A} ＝ ${q1B}` : `Λύσε την εξίσωση: x － ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} ＋ ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Larger Numbers' : 'Μεγαλύτεροι Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: x － ${q2A} ＝ ${q2B}` : `Λύσε την εξίσωση: x － ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} ＋ ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Decimal Numbers' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: x － ${q3A} ＝ ${q3B}` : `Λύσε την εξίσωση: x － ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} ＋ ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve x － ${q4A} ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x － ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate minuend x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο μειωτέο x, κάνουμε πρόσθεση: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Minuend Rule' : 'Κανόνας Μειωτέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! Minuend is the total, found by addition: x ＝ b ＋ a.' : 'Σωστά! Ο μειωτέος είναι το αρχικό σύνολο, άρα προκύπτει προσθέτοντας τη διαφορά και τον αφαιρετέο: x ＝ β ＋ α.')
            : (locale === 'en' ? 'False! To find the minuend, we add (x ＝ b ＋ a).' : 'Λάθος! Για να βρούμε τον μειωτέο κάνουμε πρόσθεση (x ＝ β ＋ α).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Minuend Property' : 'Ιδιότητα Μειωτέου',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en' ? 'Correct! Since we subtract from the minuend, it is greater than both difference and subtrahend.' : 'Σωστά! Επειδή από τον μειωτέο αφαιρούμε ποσότητα, είναι πάντα μεγαλύτερος από τη διαφορά και τον αφαιρετέο.')
            : (locale === 'en' ? 'False! Minuend is the sum of the other two terms, hence the largest.' : 'Λάθος! Ο μειωτέος είναι το άθροισμα των άλλων δύο όρων, άρα είναι ο μεγαλύτερος αριθμός.')}
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
          <span>x －</span>
          <Fraction num={q7N1} den={q7Den} size="sm" />
          <span>＝</span>
          <Fraction num={q7N2} den={q7Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 5/7' : 'π.χ. 5/7'}):</span>
        </span>
      ),
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: (
        <span>
          x ＝ <Fraction num={q7N2} den={q7Den} size="sm" /> ＋ <Fraction num={q7N1} den={q7Den} size="sm" /> ＝ ({q7N2} ＋ {q7N1})/{q7Den} ＝ <Fraction num={q7SumN} den={q7Den} size="sm" />
          {q7G > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={q7SumN / q7G} den={q7Den / q7G} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equation Verification' : 'Επαλήθευση Εξίσωσης',
      prompt: locale === 'en' ? `In x － ${q8A} ＝ ${q8B}, which value of x verifies equality?` : `Στην εξίσωση x － ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `${q8CorrectX} － ${q8A} ＝ ${q8B}.`
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

export default function AgnostosKaiAfairesiExercisesPage() {
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
          href="/st-dimotikou/34-agnostos-kai-afairesi"
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