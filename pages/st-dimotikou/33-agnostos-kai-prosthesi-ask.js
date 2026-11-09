// pages/st-dimotikou/33-agnostos-kai-prosthesi-ask.js
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
    pageTitle: "Ασκήσεις: Άγνωστος Προσθετέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων πρόσθεσης για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 33 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Άγνωστος Προσθετέος (x ＋ α ＝ β)",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων πρόσθεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε το αποτέλεσμα...",
    inputPlaceholderFraction: "π.χ. 3/7",
    inputPlaceholderDecimal: "π.χ. 2,5",
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
    pageTitle: "Exercises: Unknown Addend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving addition equations for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 33 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unknown Addend (x ＋ a ＝ b)",
    desc: "Solve the 10 dynamic problems to practice solving addition equations with whole numbers, decimals, fractions, and practical word problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    inputPlaceholderFraction: "e.g. 3/7",
    inputPlaceholderDecimal: "e.g. 2.5",
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
      const add = 15;
      const total = 42;
      const x = total - add; // 27
      const name = locale === 'en' ? 'Nikos' : 'Ο Νίκος';
      const candidateWrongs = [x + 5, x - 5, total + add, x + 10, total - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Pocket Money from Grandfather' : 'Χαρτζιλίκι από τον Παππού',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} had an amount of money (x). His grandfather gave him another ${add}€ and now he has ${total}€ in total. How much money did he have originally?`
              : `${name} είχε ένα χρηματικό ποσό (x). Ο παππούς του τού έδωσε ακόμη ${add}€ και τώρα έχει συνολικά ${total}€. Πόσα ευρώ είχε αρχικά ο Νίκος;`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Problem equation' : 'Εξίσωση προβλήματος', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'Subtraction' : 'Αφαίρεση', formula: `${total} － ${add}`, val: `${x}€` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x}€.
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const add = 28;
      const total = 75;
      const x = total - add; // 47
      const name = locale === 'en' ? 'Maria' : 'Η Μαρία';
      const pageUnit = locale === 'en' ? 'pages' : 'σελίδες';
      const candidateWrongs = [x + 6, x - 5, x + 10, total + add, x - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${pageUnit}`, render: <span>{x} {pageUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pageUnit}`, render: <span>{v} {pageUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Book Pages Read' : 'Σελίδες Βιβλίου',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} read some pages (x) in the morning and another ${add} pages in the afternoon. If she read ${total} pages in total, how many pages did she read in the morning?`
              : `${name} διάβασε ένα μέρος ενός βιβλίου (x) το πρωί και το απόγευμα διάβασε άλλες ${add} σελίδες. Αν συνολικά διάβασε ${total} σελίδες, πόσες σελίδες είχε διαβάσει το πρωί;`}
          </span>
        ),
        correctText: `${x} ${pageUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'Calculation' : 'Υπολογισμός', formula: `${total} － ${add}`, val: `${x} ${pageUnit}` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} {pageUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const add = 12;
      const total = 35;
      const x = total - add; // 23
      const kgUnit = locale === 'en' ? 'kg' : 'κιλά';
      const candidateWrongs = [x + 3, x - 3, x + 5, total + add, x - 5].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${kgUnit}`, render: <span>{x} {kgUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${kgUnit}`, render: <span>{v} {kgUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Weight of Crate with Fruit' : 'Βάρος Κιβωτίου με Φρούτα',
        prompt: (
          <span>
            {locale === 'en'
              ? `A crate filled with apples weighs ${total} kg in total. If the apples alone weigh ${add} kg, what is the weight of the empty crate (x)?`
              : `Ένα κιβώτιο γεμάτο με μήλα ζυγίζει συνολικά ${total} κιλά. Αν τα μήλα μόνα τους ζυγίζουν ${add} κιλά, πόσα κιλά ζυγίζει το άδειο κιβώτιο (x);`}
          </span>
        ),
        correctText: `${x} ${kgUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Weight relation' : 'Σχέση βάρους', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'Empty crate weight' : 'Βάρος κιβωτίου', formula: `${total} － ${add}`, val: `${x} ${kgUnit}` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} {kgUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const add = 14;
      const total = 48;
      const x = total - add; // 34
      const studentUnit = locale === 'en' ? 'students' : 'μαθητές';
      const candidateWrongs = [x + 4, x - 4, x + 6, total + add, x - 6].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${studentUnit}`, render: <span>{x} {studentUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${studentUnit}`, render: <span>{v} {studentUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Students on School Bus' : 'Μαθητές σε Σχολικό Λεωφορείο',
        prompt: (
          <span>
            {locale === 'en'
              ? `Some students (x) were riding a school bus. At the first stop, ${add} more students boarded, making a total of ${total} students. How many students were originally on the bus?`
              : `Σε ένα σχολικό λεωφορείο επέβαιναν μαθητές (x). Στην πρώτη στάση επιβιβάστηκαν ακόμη ${add} μαθητές και τώρα βρίσκονται μέσα ${total} μαθητές. Πόσοι μαθητές βρίσκονταν αρχικά στο λεωφορείο;`}
          </span>
        ),
        correctText: `${x} ${studentUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Passenger equation' : 'Εξίσωση επιβατών', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'Initial students' : 'Αρχικοί μαθητές', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} {studentUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const add = 34;
      const total = 78;
      const x = total - add; // 44
      const pointUnit = locale === 'en' ? 'points' : 'πόντοι';
      const candidateWrongs = [x + 6, x - 6, x + 10, total + add, x - 10].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${pointUnit}`, render: <span>{x} {pointUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${pointUnit}`, render: <span>{v} {pointUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Basketball Game Points' : 'Πόντοι Αγώνα Μπάσκετ',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a basketball game, a team scored some points (x) in the first half and added another ${add} points in the second half, finishing with ${total} points. How many points did they score in the first half?`
              : `Σε έναν αγώνα μπάσκετ η ομάδα πέτυχε κάποιους πόντους στο πρώτο ημίχρονο (x) και στο δεύτερο ημίχρονο πρόσθεσε άλλους ${add} πόντους, φτάνοντας συνολικά τους ${total} πόντους. Πόσους πόντους είχε πετύχει στο πρώτο ημίχρονο;`}
          </span>
        ),
        correctText: `${x} ${pointUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Points equation' : 'Εξίσωση πόντων', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'First half points' : 'Πόντοι 1ου ημιχρόνου', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} {pointUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const add = 19;
      const total = 63;
      const x = total - add; // 44
      const stickerUnit = locale === 'en' ? 'stickers' : 'αυτοκόλλητα';
      const name = locale === 'en' ? 'George' : 'Ο Γιώργος';
      const candidateWrongs = [x + 5, x - 5, x + 8, total + add, x - 8].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${stickerUnit}`, render: <span>{x} {stickerUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${stickerUnit}`, render: <span>{v} {stickerUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sticker Collection' : 'Συλλογή Αυτοκόλλητων',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} had a collection of stickers (x). His friend gave him ${add} more stickers and his collection reached ${total}. How many stickers did he have initially?`
              : `${name} είχε μια συλλογή με αυτοκόλλητα (x). Η φίλη του τού χάρισε ακόμη ${add} αυτοκόλλητα και η συλλογή του έφτασε τα ${total}. Πόσα αυτοκόλλητα είχε αρχικά ο Γιώργος;`}
          </span>
        ),
        correctText: `${x} ${stickerUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Sticker equation' : 'Εξίσωση συλλογής', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: locale === 'en' ? 'Initial stickers' : 'Αρχικά αυτοκόλλητα', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: (
          <span>
            x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} {stickerUnit}.
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
      const a = 7;
      const b = 9;
      const sumKnown = a + b; // 16
      const totalP = 24;
      const x = totalP - sumKnown; // 8
      const cmUnit = locale === 'en' ? 'cm' : 'εκ.';
      const candidateWrongs = [x + 2, x - 2, sumKnown, x + 4, totalP - a].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x} ${cmUnit}`, render: <span>{x} {cmUnit}</span> },
        candidateWrongs.map(v => ({ val: `${v} ${cmUnit}`, render: <span>{v} {cmUnit}</span> }))
      );
      return {
        title: locale === 'en' ? 'Triangle Perimeter with Unknown Side' : 'Περίμετρος Τριγώνου με Άγνωστη Πλευρά',
        prompt: (
          <span>
            {locale === 'en'
              ? `The perimeter of a triangle is ${totalP} cm. Two known sides measure ${a} cm and ${b} cm respectively. How long is the third side (x)?`
              : `Η περίμετρος ενός τριγώνου είναι ${totalP} εκατοστά. Οι δύο γνωστές πλευρές του έχουν μήκος ${a} εκ. και ${b} εκ. αντίστοιχα. Πόσα εκατοστά είναι η τρίτη πλευρά (x);`}
          </span>
        ),
        correctText: `${x} ${cmUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Sum of known sides' : 'Άθροισμα γνωστών πλευρών', formula: `${a} ＋ ${b}`, val: `${sumKnown} ${cmUnit}` },
          { item: locale === 'en' ? 'Perimeter equation' : 'Εξίσωση περιμέτρου', formula: `x ＋ ${sumKnown} ＝ ${totalP}`, val: `x ＝ ${totalP} － ${sumKnown}` },
          { item: locale === 'en' ? 'Third side' : 'Μήκος τρίτης πλευράς', formula: `${totalP} － ${sumKnown}`, val: `${x} ${cmUnit}` }
        ],
        explain: (
          <span>
            x ＋ ${a} ＋ ${b} ＝ ${totalP} ➔ x ＋ ${sumKnown} ＝ ${totalP} ➔ x ＝ ${totalP} － ${sumKnown} ＝ ${x} {cmUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const optionsRaw = [
        { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
        { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
        { val: '1/3', render: <Fraction num="1" den="3" size="md" /> },
        { val: '4/6', render: <Fraction num="4" den="6" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Equation with Unlike Fractions' : 'Εξίσωση με Ετερώνυμα Κλάσματα',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve the equation with unlike fractions:' : 'Λύσε την εξίσωση με τα ετερώνυμα κλάσματα:'}</span>
            <span>x ＋</span>
            <Fraction num="1" den="3" size="sm" />
            <span>＝</span>
            <Fraction num="5" den="6" size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/6' : 'ή 3/6'})</span>
          </span>
        ),
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: 'x ＋ 1/3 ＝ 5/6', val: 'x ＝ 5/6 － 1/3' },
          { item: locale === 'en' ? 'Like fractions' : 'Μετατροπή σε ομώνυμα', formula: '5/6 － 2/6', val: '3/6' },
          { item: locale === 'en' ? 'Simplification' : 'Απλοποίηση', formula: '3/6 (: 3)', val: '1/2' }
        ],
        explain: (
          <span>
            x ＝ <Fraction num="5" den="6" size="sm" /> － <Fraction num="1" den="3" size="sm" /> ＝ <Fraction num="5" den="6" size="sm" /> － <Fraction num="2" den="6" size="sm" /> ＝ <Fraction num="3" den="6" size="sm" /> ＝ <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const paid = 50;
      const itemBook = 18;
      const change = 12;
      const spentTotal = paid - change; // 38
      const x = spentTotal - itemBook; // 20
      const name = locale === 'en' ? 'Andreas' : 'Ο Ανδρέας';
      const candidateWrongs = [x + 4, x - 4, spentTotal, x + 8, itemBook].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${x}€`, render: <span>{x}€</span> },
        candidateWrongs.map(v => ({ val: `${v}€`, render: <span>{v}€</span> }))
      );
      return {
        title: locale === 'en' ? 'Shopping Expenses & Change Problem' : 'Σύνθετο Πρόβλημα Αγορών & Ρέστα',
        prompt: (
          <span>
            {locale === 'en'
              ? `${name} bought a book for ${itemBook}€ and a toy (x). He paid with a ${paid}€ banknote and received ${change}€ change. How much did the toy cost?`
              : `${name} αγόρασε ένα βιβλίο αξίας ${itemBook}€ και ένα παιχνίδι (x). Πλήρωσε με χαρτονόμισμα των ${paid}€ και πήρε ρέστα ${change}€. Πόσα ευρώ κόστιζε το παιχνίδι;`}
          </span>
        ),
        correctText: `${x}€`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total spent' : 'Συνολικό κόστος αγορών', formula: `${paid} － ${change}`, val: `${spentTotal}€` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση δαπάνης', formula: `x ＋ ${itemBook} ＝ ${spentTotal}`, val: `x ＝ ${spentTotal} － ${itemBook}` },
          { item: locale === 'en' ? 'Toy cost' : 'Κόστος παιχνιδιού', formula: `${spentTotal} － ${itemBook}`, val: `${x}€` }
        ],
        explain: (
          <span>
            {spentTotal} － ${itemBook} ＝ ${x}€.
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const a = 14.75;
      const total = 32.5;
      const x = total - a; // 17.75
      const aStr = locale === 'en' ? String(a) : a.toFixed(2).replace('.', ',');
      const totalStr = locale === 'en' ? String(total) : total.toFixed(1).replace('.', ',');
      const xStr = locale === 'en' ? String(x) : x.toFixed(2).replace('.', ',');
      const candidateWrongs = [
        locale === 'en' ? String(x + 1) : (x + 1).toFixed(2).replace('.', ','),
        locale === 'en' ? String(x - 1) : (x - 1).toFixed(2).replace('.', ','),
        locale === 'en' ? String(total + a) : (total + a).toFixed(2).replace('.', ','),
        locale === 'en' ? String(x + 2) : (x + 2).toFixed(2).replace('.', ',')
      ];
      const optionsRaw = makeUniqueMCQ(
        { val: xStr, render: <span>{xStr}</span> },
        candidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Equation with Decimals' : 'Εξίσωση με Δεκαδικούς Αριθμούς',
        prompt: (
          <span>
            {locale === 'en'
              ? `Solve the decimal equation: x ＋ ${aStr} ＝ ${totalStr}:`
              : `Λύσε την εξίσωση με τους δεκαδικούς αριθμούς: x ＋ ${aStr} ＝ ${totalStr}:`}
          </span>
        ),
        correctText: xStr,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x ＋ ${aStr} ＝ ${totalStr}`, val: `x ＝ ${totalStr} － ${aStr}` },
          { item: locale === 'en' ? 'Decimal subtraction' : 'Αφαίρεση δεκαδικών', formula: `${totalStr} － ${aStr}`, val: `${xStr}` }
        ],
        explain: (
          <span>
            x ＝ ${totalStr} － ${aStr} ＝ ${xStr}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const a = 15;
      const b = 25;
      const sumKnown = a + b; // 40
      const total = 70;
      const x = total - sumKnown; // 30
      const candidateWrongs = [x + 5, x - 5, sumKnown, x + 10, total - a].filter(v => v !== x && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(x), render: <span>x ＝ {x}</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>x ＝ {v}</span> }))
      );
      return {
        title: locale === 'en' ? 'Sum of Three Terms with Variable' : 'Άθροισμα Τριών Αριθμών με Μεταβλητή',
        prompt: (
          <span>
            {locale === 'en'
              ? `In the equation ${a} ＋ x ＋ ${b} ＝ ${total}, what is the value of unknown addend x?`
              : `Στην ισότητα ${a} ＋ x ＋ ${b} ＝ ${total}, ποια είναι η τιμή του άγνωστου προσθετέου x;`}
          </span>
        ),
        correctText: String(x),
        renderCorrect: <span>x ＝ {x}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Sum of known terms' : 'Άθροισμα γνωστών όρων', formula: `${a} ＋ ${b}`, val: `${sumKnown}` },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: `x ＋ ${sumKnown} ＝ ${total}`, val: `x ＝ ${total} － ${sumKnown}` },
          { item: locale === 'en' ? 'Value of x' : 'Υπολογισμός x', formula: `${total} － ${sumKnown}`, val: `${x}` }
        ],
        explain: (
          <span>
            ${a} ＋ ${b} ＝ ${sumKnown} ➔ x ＋ ${sumKnown} ＝ ${total} ➔ x ＝ ${total} － ${sumKnown} ＝ ${x}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const optionsRaw = [
        { val: '11/7', render: <Fraction num="11" den="7" size="md" /> },
        { val: '4/7', render: <Fraction num="4" den="7" size="md" /> },
        { val: '1', render: <span>1</span> },
        { val: '10/7', render: <Fraction num="10" den="7" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Adding to Reach an Integer' : 'Συμπλήρωση μέχρι τον Επόμενο Ακέραιο',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Solve where the sum is an integer:' : 'Λύσε την εξίσωση όπου το άθροισμα είναι ακέραιος αριθμός:'}</span>
            <span>x ＋</span>
            <Fraction num="3" den="7" size="sm" />
            <span>＝ 2:</span>
          </span>
        ),
        correctText: '11/7',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="11" den="7" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 1 4/7' : 'ή 1 και 4/7'})</span>
          </span>
        ),
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Integer in sevenths' : 'Ακέραιος σε έβδομα', formula: '2 ＝ 14/7', val: '14/7' },
          { item: locale === 'en' ? 'Equation' : 'Εξίσωση', formula: 'x ＋ 3/7 ＝ 14/7', val: 'x ＝ 14/7 － 3/7' },
          { item: locale === 'en' ? 'Solution' : 'Λύση', formula: '14/7 － 3/7', val: '11/7' }
        ],
        explain: (
          <span>
            2 ＝ 14/7 ➔ x ＝ <Fraction num="14" den="7" size="sm" /> － <Fraction num="3" den="7" size="sm" /> ＝ <Fraction num="11" den="7" size="sm" />.
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
  // Q1: Input - Βασική εξίσωση x + a = b με φυσικούς αριθμούς
  const q1A = randInt(14, 48);
  const q1X = randInt(15, 55);
  const q1B = q1X + q1A;

  // Q2: Input - Εξίσωση a + x = b με φυσικούς αριθμούς
  const q2A = randInt(35, 120);
  const q2X = randInt(25, 90);
  const q2B = q2A + q2X;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x + a = b
  const q3A_raw = randInt(12, 85) / 10;
  const q3X_raw = randInt(15, 65) / 10;
  const q3B_raw = Number((q3X_raw + q3A_raw).toFixed(1));
  const q3A = locale === 'en' ? String(q3A_raw) : q3A_raw.toFixed(1).replace('.', ',');
  const q3B = locale === 'en' ? String(q3B_raw) : q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = locale === 'en' ? String(q3X_raw) : q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x + a = b
  const q4A = randInt(15, 45);
  const q4B = q4A + randInt(10, 30);
  const q4CorrectStep = `x ＝ ${q4B} － ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} ＋ ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4A} · ${q4B}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStep, render: <span>{q4CorrectStep}</span> },
    q4Wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: True / False - Κανόνας εύρεσης άγνωστου προσθετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'To find an unknown addend in an addition equation, we subtract the known addend from the sum (x ＝ b － a).'
        : 'Για να βρούμε τον άγνωστο προσθετέο σε μια εξίσωση πρόσθεσης, αφαιρούμε τον γνωστό προσθετέο από το άθροισμα (x ＝ β － α).')
    : (locale === 'en'
        ? 'To find an unknown addend in an addition equation, we add the known addend to the sum (x ＝ b ＋ a).'
        : 'Για να βρούμε τον άγνωστο προσθετέο σε μια εξίσωση πρόσθεσης, προσθέτουμε τον γνωστό προσθετέο στο άθροισμα (x ＝ β ＋ α).');

  // Q6: True / False - Ιδιότητα μετάθεσης στην πρόσθεση (x + a = a + x)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'Equation x ＋ 12 ＝ 30 is solved in the exact same way as 12 ＋ x ＝ 30.'
        : 'Η εξίσωση x ＋ 12 ＝ 30 λύνεται με τον ίδιο ακριβώς τρόπο όπως η εξίσωση 12 ＋ x ＝ 30.')
    : (locale === 'en'
        ? 'In 12 ＋ x ＝ 30 we cannot subtract because x is the second addend.'
        : 'Στην εξίσωση 12 ＋ x ＝ 30 δεν μπορούμε να κάνουμε αφαίρεση επειδή το x είναι δεύτερος προσθετέος.');

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: x + n1/d = n2/d
  const q7Den = randInt(5, 12);
  const q7N1 = randInt(1, Math.floor((q7Den - 1) / 2));
  const q7N2 = randInt(q7N1 + 2, q7Den);
  const q7DiffN = q7N2 - q7N1;
  const q7G = gcd(q7DiffN, q7Den);
  const q7CorrectRaw = `${q7DiffN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7DiffN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης
  const q8A = randInt(12, 25);
  const q8B = randInt(35, 55);
  const q8CorrectX = q8B - q8A;
  const q8Wrongs = [q8CorrectX + 3, q8CorrectX - 3, q8B + q8A, q8CorrectX + 5].filter(v => v !== q8CorrectX && v > 0);
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
      title: locale === 'en' ? 'Equation: x ＋ a ＝ b' : 'Εξίσωση: x ＋ α ＝ β',
      prompt: locale === 'en' ? `Solve the equation: x ＋ ${q1A} ＝ ${q1B}` : `Λύσε την εξίσωση: x ＋ ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} － ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Equation: a ＋ x ＝ b' : 'Εξίσωση: α ＋ x ＝ β',
      prompt: locale === 'en' ? `Solve the equation: ${q2A} ＋ x ＝ ${q2B}` : `Λύσε την εξίσωση: ${q2A} ＋ x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} － ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Decimal Equation' : 'Δεκαδικοί Αριθμοί',
      prompt: locale === 'en' ? `Solve the equation: x ＋ ${q3A} ＝ ${q3B}` : `Λύσε την εξίσωση: x ＋ ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} － ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Correct Solution Step' : 'Σωστό Βήμα Επίλυσης',
      prompt: locale === 'en' ? `What is the correct step to solve x ＋ ${q4A} ＝ ${q4B}?` : `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x ＋ ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: locale === 'en' ? `To isolate addend x: ${q4CorrectStep}.` : `Για να βρούμε τον άγνωστο προσθετέο x, κάνουμε αφαίρεση: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Unknown Addend Rule' : 'Κανόνας Προσθετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en' ? 'Correct! Inverse of addition is subtraction: x ＝ b － a.' : 'Σωστά! Η αντίστροφη πράξη της πρόσθεσης είναι η αφαίρεση: x ＝ β － α.')
            : (locale === 'en' ? 'False! To isolate x, we subtract (x ＝ b － a), not add.' : 'Λάθος! Για να απομονώσουμε το x κάνουμε αφαίρεση (x ＝ β － α), όχι πρόσθεση.')}
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
            ? (locale === 'en' ? 'Correct! By the commutative property, x is always solved via subtraction: x ＝ b － a.' : 'Σωστά! Λόγω της αντιμεταθετικής ιδιότητας, είτε το x είναι 1ος είτε 2ος προσθετέος, λύνεται πάντα με αφαίρεση: x ＝ β － α.')
            : (locale === 'en' ? 'False! In both cases x is an addend solved via subtraction.' : 'Λάθος! Και στις δύο περιπτώσεις ο άγνωστος είναι προσθετέος και υπολογίζεται με αφαίρεση.')}
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
          <span>{locale === 'en' ? 'Solve equation:' : 'Λύσε την εξίσωση:'}</span>
          <span>x ＋</span>
          <Fraction num={q7N1} den={q7Den} size="sm" />
          <span>＝</span>
          <Fraction num={q7N2} den={q7Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/7' : 'π.χ. 3/7'}):</span>
        </span>
      ),
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: (
        <span>
          x ＝ <Fraction num={q7N2} den={q7Den} size="sm" /> － <Fraction num={q7N1} den={q7Den} size="sm" /> ＝ <Fraction num={q7DiffN} den={q7Den} size="sm" />
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
      prompt: locale === 'en' ? `In x ＋ ${q8A} ＝ ${q8B}, which value of x verifies the equality?` : `Στην εξίσωση x ＋ ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `${q8CorrectX} ＋ ${q8A} ＝ ${q8B}.`
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

export default function AgnostosKaiProsthesiExercisesPage() {
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
          href="/st-dimotikou/33-agnostos-kai-prosthesi"
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