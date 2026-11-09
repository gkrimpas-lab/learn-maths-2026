// pages/st-dimotikou/30-diairesi-klasmaton-ask.js
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

function findGCD(a, b) {
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

// Component για σύνθετο κλάσμα
export function ComplexFraction({ nA, dA, nB, dB, size = 'sm', className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <Fraction num={nA} den={dA} size={size} />
      <span className="w-full h-1 bg-slate-900 rounded-full my-0.5 min-w-[28px]" />
      <Fraction num={nB} den={dB} size={size} />
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Διαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη διαίρεση κλασμάτων, ακεραίων και σύνθετων κλασμάτων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Διαίρεση Κλασμάτων",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη διαίρεση κλασμάτων, στη διαίρεση με ακέραιο, στα σύνθετα κλάσματα και σε προβλήματα καθημερινότητας!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 3/2",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Πράξη / Μέθοδος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: Dividing Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on dividing fractions, integers, and complex fractions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 30 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Dividing Fractions",
    desc: "Solve the 10 dynamic problems to practice dividing fractions, dividing with integers, complex fractions, and practical word problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 3/2",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Operation / Method",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!",
    gcdLabel: "GCD"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const n1 = 3;
      const d1 = 4;
      const n2 = 1;
      const d2 = 8;
      const res = (n1 * d2) / (d1 * n2); // 6
      const bagUnit = locale === 'en' ? 'bags' : 'σακουλάκια';
      const candidateWrongs = [res + 2, res - 2, res + 1, res + 3, res - 1].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${bagUnit}`, render: <span>{res} {bagUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${bagUnit}`,
          render: <span>{v} {bagUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Packaging Flour into Small Bags' : 'Συσκευασία Αλευριού σε Σακουλάκια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'We have' : 'Έχουμε'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'kg of flour and pack them into bags holding' : 'του κιλού αλεύρι και θέλουμε να τα συσκευάσουμε σε σακουλάκια που χωρούν'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'kg each. How many bags will be filled?' : 'του κιλού το καθένα. Πόσα σακουλάκια θα γεμίσουν συνολικά;'}</span>
          </span>
        ),
        correctText: `${res} ${bagUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total flour' : 'Συνολικό αλεύρι', formula: `${n1}/${d1} kg`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Bag capacity' : 'Χωρητικότητα σακούλας', formula: `${n2}/${d2} kg`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2})`, val: `${res} ${bagUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Divide total quantity by bag capacity: ' : 'Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα κάθε σακούλας: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 24/4 ＝ {res} {bagUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const n1 = 4;
      const d1 = 5;
      const n2 = 1;
      const d2 = 10;
      const res = (n1 * d2) / (d1 * n2); // 8
      const bottleUnit = locale === 'en' ? 'bottles' : 'μπουκαλάκια';
      const candidateWrongs = [res - 2, res + 2, res + 4, res - 3, 10].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${bottleUnit}`, render: <span>{res} {bottleUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${bottleUnit}`,
          render: <span>{v} {bottleUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Pouring Juice into Small Bottles' : 'Μοίρασμα Χυμού σε Μπουκαλάκια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A pitcher contains' : 'Μία κανάτα περιέχει'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'liters of juice. We share it into bottles of' : 'του λίτρου χυμό. Μοιράζουμε τον χυμό σε μπουκαλάκια των'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'liters. How many bottles will be filled?' : 'του λίτρου. Πόσα μπουκαλάκια θα γεμίσουν;'}</span>
          </span>
        ),
        correctText: `${res} ${bottleUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total juice' : 'Συνολικός χυμός', formula: `${n1}/${d1} L`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Bottle size' : 'Μέγεθος μερίδας', formula: `${n2}/${d2} L`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 40/5`, val: `${res} ${bottleUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Compute: ' : 'Υπολογίζουμε: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 40/5 ＝ {res} {bottleUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const n1 = 3;
      const d1 = 2;
      const n2 = 1;
      const d2 = 4;
      const res = (n1 * d2) / (d1 * n2); // 6
      const pieceUnit = locale === 'en' ? 'pieces' : 'κομμάτια';
      const candidateWrongs = [res + 2, res - 1, res + 4, res - 2, 8].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${pieceUnit}`, render: <span>{res} {pieceUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${pieceUnit}`,
          render: <span>{v} {pieceUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Cutting Ribbon into Equal Pieces' : 'Κοπή Κορδέλας σε Ίσα Κομμάτια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A ribbon has length' : 'Μια κορδέλα έχει μήκος'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'meters. We cut it into pieces of length' : 'του μέτρου. Την κόβουμε σε κομμάτια μήκους'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'meters. How many pieces do we get?' : 'του μέτρου. Πόσα κομμάτια θα πάρουμε συνολικά;'}</span>
          </span>
        ),
        correctText: `${res} ${pieceUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total length' : 'Συνολικό μήκος', formula: `${n1}/${d1} m`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Piece length' : 'Μήκος κομματιού', formula: `${n2}/${d2} m`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 12/2`, val: `${res} ${pieceUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Execute division: ' : 'Εκτελούμε τη διαίρεση: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 12/2 ＝ {res} {pieceUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const n1 = 2;
      const d1 = 3;
      const n2 = 1;
      const d2 = 6;
      const res = (n1 * d2) / (d1 * n2); // 4
      const jarUnit = locale === 'en' ? 'jars' : 'βαζάκια';
      const candidateWrongs = [res + 2, res - 1, res + 3, res + 1, 6].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${jarUnit}`, render: <span>{res} {jarUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${jarUnit}`,
          render: <span>{v} {jarUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Packaging Honey into Jars' : 'Συσκευασία Βάζων Μελιού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A beekeeper has' : 'Ένας μελισσοκόμος έχει'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'kg of honey and jars holding' : 'του κιλού μέλι και το τοποθετεί σε βαζάκια των'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'kg each. How many jars are filled?' : 'του κιλού. Πόσα βαζάκια θα γεμίσουν;'}</span>
          </span>
        ),
        correctText: `${res} ${jarUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total honey' : 'Συνολικό μέλι', formula: `${n1}/${d1} kg`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Jar size' : 'Μέγεθος βάζου', formula: `${n2}/${d2} kg`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 12/3`, val: `${res} ${jarUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Divide: ' : 'Διαιρούμε: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 12/3 ＝ {res} {jarUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const n1 = 5;
      const d1 = 2;
      const n2 = 1;
      const d2 = 2;
      const res = (n1 * d2) / (d1 * n2); // 5
      const stripUnit = locale === 'en' ? 'strips' : 'λωρίδες';
      const candidateWrongs = [res + 2, res - 2, res + 1, res - 1, 8].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${stripUnit}`, render: <span>{res} {stripUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${stripUnit}`,
          render: <span>{v} {stripUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Fabric Strips Cutting' : 'Κοπή Υφάσματος για Λωρίδες',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A fabric roll is' : 'Ένα ύφασμα έχει μήκος'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'meters long and is cut into strips of' : 'του μέτρου και κόβεται σε λωρίδες των'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'meters. How many strips are produced?' : 'του μέτρου. Πόσες λωρίδες θα προκύψουν;'}</span>
          </span>
        ),
        correctText: `${res} ${stripUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Fabric length' : 'Μήκος υφάσματος', formula: `${n1}/${d1} m`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Strip length' : 'Μήκος λωρίδας', formula: `${n2}/${d2} m`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 10/2`, val: `${res} ${stripUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Compute: ' : 'Υπολογίζουμε: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 10/2 ＝ {res} {stripUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const n1 = 3;
      const d1 = 5;
      const n2 = 1;
      const d2 = 10;
      const res = (n1 * d2) / (d1 * n2); // 6
      const tinUnit = locale === 'en' ? 'tins' : 'κουτάκια';
      const candidateWrongs = [res + 2, res - 2, res + 1, res + 4, 10].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: `${res} ${tinUnit}`, render: <span>{res} {tinUnit}</span> },
        candidateWrongs.map(v => ({
          val: `${v} ${tinUnit}`,
          render: <span>{v} {tinUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Coffee Packaging into Tins' : 'Συσκευασία Καφέ σε Κουτάκια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Coffee weighing' : 'Μία ποσότητα καφέ ζυγίζει'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'kg is packed into tins of' : 'του κιλού και συσκευάζεται σε κουτάκια των'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'kg each. How many tins will be filled?' : 'του κιλού. Πόσα κουτάκια θα γεμίσουν συνολικά;'}</span>
          </span>
        ),
        correctText: `${res} ${tinUnit}`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total coffee' : 'Συνολικός καφές', formula: `${n1}/${d1} kg`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Tin size' : 'Μέγεθος κουτιού', formula: `${n2}/${d2} kg`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 30/5`, val: `${res} ${tinUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Divide: ' : 'Διαιρούμε: '}
            <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ 30/5 ＝ {res} {tinUnit}.
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
      const a = 2;
      const b = 3;
      const c = 4;
      const d = 5;
      return {
        title: locale === 'en' ? 'Complex Fraction (Extremes & Means)' : 'Σύνθετο Κλάσμα με Άκρους & Μέσους',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Evaluate the complex fraction:' : 'Υπολόγισε την τιμή του σύνθετου κλάσματος:'}</span>
            <ComplexFraction nA={a} dA={b} nB={c} dB={d} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: '5/6',
        renderCorrect: <Fraction num="5" den="6" size="md" />,
        optionsRaw: [
          { val: '5/6', render: <Fraction num="5" den="6" size="md" /> },
          { val: '6/5', render: <Fraction num="6" den="5" size="md" /> },
          { val: '8/15', render: <Fraction num="8" den="15" size="md" /> },
          { val: '1/3', render: <Fraction num="1" den="3" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Product of extremes' : 'Γινόμενο άκρων (έξω)', formula: `${a} · ${d}`, val: '10' },
          { item: locale === 'en' ? 'Product of means' : 'Γινόμενο μέσων (μέσα)', formula: `${b} · ${c}`, val: '12' },
          { item: locale === 'en' ? 'Simplification' : 'Απλοποίηση', formula: '10/12 (: 2)', val: '5/6' }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Extremes product in numerator, means product in denominator: ' : 'Στο σύνθετο κλάσμα πολλαπλασιάζουμε τους άκρους όρους για τον αριθμητή και τους μέσους για τον παρονομαστή: '}
            ({a} · {d}) / ({b} · {c}) ＝ 10/12 ＝ <Fraction num="5" den="6" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const whole = 5;
      const den = 3;
      const res = whole * den; // 15
      const pattyUnit = locale === 'en' ? 'patties' : 'μπιφτέκια';
      const candidateWrongs = [res - 3, res + 3, res - 5, res + 5, 10].filter(v => v !== res && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(res), render: <span>{res} {pattyUnit}</span> },
        candidateWrongs.map(v => ({
          val: String(v),
          render: <span>{v} {pattyUnit}</span>
        }))
      );
      return {
        title: locale === 'en' ? 'Dividing Whole by Unit Fraction' : 'Διαίρεση Ακέραιου με Κλάσμα (Μοίρασμα)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? `A chef has ${whole} kg of minced meat and makes patties weighing` : `Ένας σεφ έχει ${whole} ολόκληρα κιλά κιμά και φτιάχνει μπιφτέκια βάρους`}</span>
            <Fraction num="1" den={den} size="sm" />
            <span>{locale === 'en' ? 'kg each. How many patties can he make?' : 'του κιλού το καθένα. Πόσα μπιφτέκια θα φτιάξει συνολικά;'}</span>
          </span>
        ),
        correctText: String(res),
        renderCorrect: <span>{res} {pattyUnit}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total meat' : 'Συνολικός κιμάς', formula: `${whole} kg`, val: `${whole}` },
          { item: locale === 'en' ? 'Patty weight' : 'Βάρος μπιφτεκιού', formula: `1/${den} kg`, val: `1/${den}` },
          { item: locale === 'en' ? 'Division' : 'Διαίρεση', formula: `${whole} : (1/${den}) ＝ ${whole} · ${den}`, val: `${res} ${pattyUnit}` }
        ],
        explain: (
          <span>
            {whole} : <Fraction num="1" den={den} size="sm" /> ＝ {whole} · <Fraction num={den} den="1" size="sm" /> ＝ {res} {pattyUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Finding Missing Divisor' : 'Εύρεση Άγνωστου Διαιρέτη',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'What is the unknown number x in:' : 'Ποιος είναι ο άγνωστος αριθμός x στην ισότητα:'}</span>
            <Fraction num="3" den="4" size="sm" />
            <span>: x ＝</span>
            <Fraction num="3" den="8" size="sm" />
            <span>;</span>
          </span>
        ),
        correctText: '2',
        optionsRaw: [
          { val: '2', render: <span>2</span> },
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '4', render: <span>4</span> },
          { val: '8', render: <span>8</span> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Dividend' : 'Διαιρετέος', formula: '3/4', val: '3/4' },
          { item: locale === 'en' ? 'Quotient' : 'Πηλίκο', formula: '3/8', val: '3/8' },
          { item: locale === 'en' ? 'Divisor computation' : 'Υπολογισμός διαιρέτη', formula: '(3/4) : (3/8) ＝ (3/4) · (8/3) ＝ 24/12', val: '2' }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'To find divisor, divide dividend by quotient: ' : 'Για να βρούμε τον διαιρέτη, διαιρούμε τον διαιρετέο με το πηλίκο: '}
            x ＝ <Fraction num="3" den="4" size="sm" /> : <Fraction num="3" den="8" size="sm" /> ＝ <Fraction num="3" den="4" size="sm" /> · <Fraction num="8" den="3" size="sm" /> ＝ 24/12 ＝ 2.
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Dividing by a Mixed Number' : 'Διαίρεση με Μικτό Αριθμό',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Compute the quotient of' : 'Υπολόγισε το πηλίκο της διαίρεσης:'}</span>
            <Fraction num="3" den="4" size="sm" />
            <span>: (1 1/2):</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 6/12' : 'ή 6/12'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '3/8', render: <Fraction num="3" den="8" size="md" /> },
          { val: '2', render: <span>2</span> },
          { val: '9/8', render: <Fraction num="9" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Mixed number to fraction' : 'Μικτός σε κλάσμα', formula: '1 και 1/2 ＝ 2/2 ＋ 1/2', val: '3/2' },
          { item: locale === 'en' ? 'Invert divisor' : 'Αντιστροφή διαιρέτη', formula: 'Invert 3/2', val: '2/3' },
          { item: locale === 'en' ? 'Multiplication' : 'Πολλαπλασιασμός', formula: '(3/4) · (2/3) ＝ 6/12 (: 6)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en' ? 'Convert mixed number to fraction: 1 1/2 ＝ 3/2. Then: ' : 'Μετατρέπουμε τον μικτό αριθμό σε κλάσμα: 1 και 1/2 ＝ 3/2. Έπειτα εκτελούμε: '}
            <Fraction num="3" den="4" size="sm" /> : <Fraction num="3" den="2" size="sm" /> ＝ <Fraction num="3" den="4" size="sm" /> · <Fraction num="2" den="3" size="sm" /> ＝ 6/12 ＝ <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Complex Fraction with Integer' : 'Σύνθετο Κλάσμα με Ακέραιο',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Evaluate the complex fraction:' : 'Υπολόγισε την τιμή του σύνθετου κλάσματος:'}</span>
            <span className="inline-flex flex-col items-center justify-center font-mono leading-none px-1">
              <Fraction num="3" den="4" size="sm" />
              <span className="w-full h-1 bg-slate-900 rounded-full my-0.5 min-w-[24px]" />
              <span className="text-sm font-bold pt-0.5">6</span>
            </span>
            <span>:</span>
          </span>
        ),
        correctText: '1/8',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="8" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/24' : 'ή 3/24'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/8', render: <Fraction num="1" den="8" size="md" /> },
          { val: '9/2', render: <Fraction num="9" den="2" size="md" /> },
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '3/8', render: <Fraction num="3" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Integer as fraction' : 'Ακέραιος ως κλάσμα', formula: '6 ＝ 6/1', val: '6/1' },
          { item: locale === 'en' ? 'Extreme terms' : 'Άκροι όροι', formula: '3 · 1', val: '3' },
          { item: locale === 'en' ? 'Mean terms' : 'Μέσοι όροι', formula: '4 · 6', val: '24' },
          { item: locale === 'en' ? 'Simplification' : 'Απλοποίηση', formula: '3/24 (: 3)', val: '1/8' }
        ],
        explain: (
          <span>
            6 ＝ 6/1: (3 · 1) / (4 · 6) ＝ 3/24 ＝ <Fraction num="1" den="8" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const correctVal = locale === 'en' ? 'Quotient is 6 (greater than 4)' : 'Το πηλίκο είναι 6 (μεγαλύτερο από το 4)';
      const optionsRaw = locale === 'en'
        ? [
            { val: 'Quotient is 6 (greater than 4)', render: <span>Quotient is 6 (greater than 4)</span> },
            { val: 'Quotient is 8/3', render: <span>Quotient is 8/3 (less than 4)</span> },
            { val: 'Quotient equals 4', render: <span>Quotient equals 4</span> },
            { val: 'Quotient is 2', render: <span>Quotient is 2</span> }
          ]
        : [
            { val: 'Το πηλίκο είναι 6 (μεγαλύτερο από το 4)', render: <span>Το πηλίκο είναι 6 (μεγαλύτερο από το 4)</span> },
            { val: 'Το πηλίκο είναι 8/3', render: <span>Το πηλίκο είναι 8/3 (μικρότερο από το 4)</span> },
            { val: 'Το πηλίκο είναι 4', render: <span>Το πηλίκο είναι ίσο με 4</span> },
            { val: 'Το πηλίκο είναι 2', render: <span>Το πηλίκο είναι 2</span> }
          ];
      return {
        title: locale === 'en' ? 'Effect of Dividing by Fraction ＜ 1' : 'Σύγκριση Αποτελέσματος Διαίρεσης',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Consider division 4 :' : 'Έστω η διαίρεση 4 :'}</span>
            <Fraction num="2" den="3" size="sm" />
            <span>{locale === 'en' ? '. How does the quotient relate to 4?' : '. Ποια σχέση συνδέει το πηλίκο με τον αρχικό αριθμό 4;'}</span>
          </span>
        ),
        correctText: correctVal,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Division operation' : 'Πράξη διαίρεσης', formula: '4 : (2/3) ＝ 4 · (3/2)', val: '12/2 ＝ 6' },
          { item: locale === 'en' ? 'Comparison with dividend' : 'Σύγκριση με τον διαιρετέο', formula: '6 ＞ 4', val: 'Quotient ＞ 4' }
        ],
        explain: (
          <span>
            4 : <Fraction num="2" den="3" size="sm" /> ＝ 4 · <Fraction num="3" den="2" size="sm" /> ＝ 12/2 ＝ 6.
            {locale === 'en' ? ' Dividing by a fraction ＜ 1 produces a quotient greater than the dividend (6 ＞ 4).' : ' Επειδή διαιρούμε με κλάσμα ＜ 1, το πηλίκο είναι μεγαλύτερο από τον διαιρετέο (6 ＞ 4).'}
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
  // Q1: Input - Διαίρεση Κλάσματος με Κλάσμα
  const q1Num1 = randInt(1, 4);
  const q1Den1 = randInt(q1Num1 + 1, 6);
  const q1Num2 = randInt(1, 3);
  const q1Den2 = randInt(q1Num2 + 1, 5);
  const q1ResN = q1Num1 * q1Den2;
  const q1ResD = q1Den1 * q1Num2;
  const q1G = findGCD(q1ResN, q1ResD);
  const q1CorrectRaw = `${q1ResN}/${q1ResD}`;
  const q1CorrectSimp = q1ResD / q1G === 1 ? String(q1ResN / q1G) : `${q1ResN / q1G}/${q1ResD / q1G}`;

  // Q2: Input - Διαίρεση Κλάσματος με Ακέραιο
  const q2Num = randInt(2, 6);
  const q2Den = randInt(3, 7);
  const q2Whole = randInt(2, 4);
  const q2ResN = q2Num;
  const q2ResD = q2Den * q2Whole;
  const q2G = findGCD(q2ResN, q2ResD);
  const q2CorrectRaw = `${q2ResN}/${q2ResD}`;
  const q2CorrectSimp = q2ResD / q2G === 1 ? String(q2ResN / q2G) : `${q2ResN / q2G}/${q2ResD / q2G}`;

  // Q3: MCQ - Διαίρεση Ακέραιου με Κλάσμα (π.χ. 3 : 1/2 = 6)
  const q3Whole = randInt(2, 4);
  const q3Den = randInt(2, 4);
  const q3Res = q3Whole * q3Den;
  const q3CorrectStr = String(q3Res);
  const q3Candidates = [
    String(q3Whole + q3Den),
    `${q3Whole}/${q3Den}`,
    String(Math.max(1, q3Res - 2)),
    String(q3Res + 2),
    String(q3Whole * 2),
    `${q3Den}/${q3Whole}`
  ].filter(w => w !== q3CorrectStr);
  const q3Options = makeUniqueMCQ(
    { val: q3CorrectStr, render: <span>{q3CorrectStr}</span> },
    q3Candidates.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q4: MCQ - Μετατροπή σε Πολλαπλασιασμό
  const q4N1 = randInt(2, 5);
  let q4D1 = randInt(3, 7);
  while (q4D1 === q4N1) q4D1++;
  const q4N2 = randInt(1, 4);
  let q4D2 = randInt(2, 6);
  while (q4D2 === q4N2) q4D2++;

  const q4CorrectStr = `(${q4N1}/${q4D1}) · (${q4D2}/${q4N2})`;
  const q4Candidates = [
    {
      val: `(${q4D1}/${q4N1}) · (${q4N2}/${q4D2})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4D1} den={q4N1} size="sm" /> · <Fraction num={q4N2} den={q4D2} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4N1}/${q4D1}) · (${q4N2}/${q4D2})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N1} den={q4D1} size="sm" /> · <Fraction num={q4N2} den={q4D2} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4D1}/${q4N1}) · (${q4D2}/${q4N2})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4D1} den={q4N1} size="sm" /> · <Fraction num={q4D2} den={q4N2} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4N1}/${q4D1}) · (${q4D2 + 1}/${q4N2})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N1} den={q4D1} size="sm" /> · <Fraction num={q4D2 + 1} den={q4N2} size="sm" />
        </span>
      )
    }
  ];
  const q4Options = makeUniqueMCQ(
    {
      val: q4CorrectStr,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N1} den={q4D1} size="sm" /> · <Fraction num={q4D2} den={q4N2} size="sm" />
        </span>
      )
    },
    q4Candidates
  );

  // Q5: True/False - Κανόνας αντιστροφής
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'In fraction division, we always invert the terms of the second fraction (divisor) and multiply.'
        : 'Στη διαίρεση κλασμάτων αντιστρέφουμε πάντοτε τους όρους του δεύτερου κλάσματος (διαιρέτη) και κάνουμε πολλαπλασιασμό.')
    : (locale === 'en'
        ? 'In fraction division, we invert the terms of the first fraction (dividend) and multiply.'
        : 'Στη διαίρεση κλασμάτων αντιστρέφουμε τους όρους του πρώτου κλάσματος (διαιρετέου) και κάνουμε πολλαπλασιασμό.');

  // Q6: True/False - Διαίρεση με κλάσμα < 1
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'When dividing a number by a proper fraction (less than 1), the quotient is always greater than the dividend.'
        : 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι μεγαλύτερο από τον αρχικό αριθμό.')
    : (locale === 'en'
        ? 'When dividing a number by a proper fraction (less than 1), the quotient is always smaller than the dividend.'
        : 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι πάντοτε μικρότερο από τον αρχικό αριθμό.');

  // Q7: Input - Σύνθετο Κλάσμα (Άκροι / Μέσοι)
  const q7A = randInt(1, 3);
  const q7B = randInt(2, 4);
  const q7C = randInt(1, 3);
  const q7D = randInt(2, 5);
  const q7Top = q7A * q7D;
  const q7Bot = q7B * q7C;
  const q7G = findGCD(q7Top, q7Bot);
  const q7CorrectRaw = `${q7Top}/${q7Bot}`;
  const q7CorrectSimp = q7Bot / q7G === 1 ? String(q7Top / q7G) : `${q7Top / q7G}/${q7Bot / q7G}`;

  // Q8: MCQ - Πράξη σύνθετου κλάσματος
  const q8TopN = 1;
  const q8TopD = 2;
  const q8BotN = 3;
  const q8BotD = 4;
  const q8CorrectSimpComp = '2/3';
  const q8Options = shuffle([
    { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
    { val: '3/8', render: <Fraction num="3" den="8" size="md" /> },
    { val: '8/3', render: <Fraction num="8" den="3" size="md" /> },
    { val: '1/4', render: <Fraction num="1" den="4" size="md" /> }
  ]);

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
      title: locale === 'en' ? 'Fraction : Fraction' : 'Κλάσμα : Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate quotient:' : 'Υπολόγισε το πηλίκο:'}</span>
          <Fraction num={q1Num1} den={q1Den1} size="sm" />
          <span>:</span>
          <Fraction num={q1Num2} den={q1Den2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/2' : 'π.χ. 3/2'}):</span>
        </span>
      ),
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: (
        <span>
          <Fraction num={q1Num1} den={q1Den1} size="sm" /> : <Fraction num={q1Num2} den={q1Den2} size="sm" /> ＝ <Fraction num={q1Num1} den={q1Den1} size="sm" /> · <Fraction num={q1Den2} den={q1Num2} size="sm" /> ＝ <Fraction num={q1ResN} den={q1ResD} size="sm" />
          {q1G > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή απλοποιημένο:'} {q1ResD / q1G === 1 ? q1ResN / q1G : <Fraction num={q1ResN / q1G} den={q1ResD / q1G} size="sm" />}
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Fraction : Integer' : 'Κλάσμα : Ακέραιο',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate quotient:' : 'Υπολόγισε το πηλίκο:'}</span>
          <Fraction num={q2Num} den={q2Den} size="sm" />
          <span>: {q2Whole} ({locale === 'en' ? 'e.g. 3/8' : 'π.χ. 3/8'}):</span>
        </span>
      ),
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: (
        <span>
          <Fraction num={q2Num} den={q2Den} size="sm" /> : {q2Whole} ＝ <Fraction num={q2Num} den={q2Den} size="sm" /> · <Fraction num="1" den={q2Whole} size="sm" /> ＝ <Fraction num={q2ResN} den={q2ResD} size="sm" />
          {q2G > 1 && (
            <span>
              {' '}＝ {q2ResD / q2G === 1 ? q2ResN / q2G : <Fraction num={q2ResN / q2G} den={q2ResD / q2G} size="sm" />}
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Integer : Fraction' : 'Ακέραιος : Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the result of' : 'Ποιο είναι το αποτέλεσμα της διαίρεσης'}</span>
          <span>{q3Whole} :</span>
          <Fraction num="1" den={q3Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q3Options,
      correct: q3CorrectStr,
      explain: (
        <span>
          {q3Whole} : <Fraction num="1" den={q3Den} size="sm" /> ＝ {q3Whole} · <Fraction num={q3Den} den="1" size="sm" /> ＝ {q3Whole * q3Den} ＝ {q3CorrectStr}.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Conversion to Multiplication' : 'Μετατροπή σε Πολλαπλασιασμό',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'How does division convert to multiplication for' : 'Πώς μετατρέπεται σε πολλαπλασιασμό η διαίρεση'}</span>
          <Fraction num={q4N1} den={q4D1} size="sm" />
          <span>:</span>
          <Fraction num={q4N2} den={q4D2} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q4Options,
      correct: q4CorrectStr,
      explain: (
        <span>
          {locale === 'en' ? 'Keep 1st fraction, invert 2nd and multiply:' : 'Κρατάμε το 1ο κλάσμα όπως είναι και πολλαπλασιάζουμε με το αντίστροφο του 2ου:'}{' '}
          <Fraction num={q4N1} den={q4D1} size="sm" /> · <Fraction num={q4D2} den={q4N2} size="sm" />.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Golden Rule of Division' : 'Χρυσός Κανόνας Διαίρεσης',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! We always invert the 2nd fraction (divisor) and multiply.'
                : 'Σωστά! Αντιστρέφουμε πάντοτε το 2ο κλάσμα (διαιρέτη) και κάνουμε πολλαπλασιασμό.')
            : (locale === 'en'
                ? 'False! The 1st fraction (dividend) stays UNCHANGED. Only the 2nd fraction is inverted.'
                : 'Λάθος! Το 1ο κλάσμα (διαιρετέος) παραμένει ΑΜΕΤΑΒΛΗΤΟ. Αντιστρέφουμε μόνο το 2ο κλάσμα.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Dividing by Fraction ＜ 1' : 'Διαίρεση με Κλάσμα ＜ 1',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! Because a small fractional part fits multiple times, the quotient is greater than the dividend (e.g. 2 : 1/2 ＝ 4 ＞ 2).'
                : 'Σωστά! Επειδή ένα μικρό κομμάτι χωράει πολλές φορές, το πηλίκο είναι μεγαλύτερο από τον διαιρετέο (π.χ. 2 : 1/2 ＝ 4 ＞ 2).')
            : (locale === 'en'
                ? 'False! When dividing by a fraction ＜ 1, the result becomes larger (e.g. 3 : 1/2 ＝ 6).'
                : 'Λάθος! Όταν διαιρούμε με κλάσμα ＜ 1, το αποτέλεσμα μεγαλώνει (π.χ. 3 : 1/2 ＝ 6).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Complex Fraction (Extremes & Means)' : 'Σύνθετο Κλάσμα (Άκροι & Μέσοι)',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Compute the value of complex fraction:' : 'Υπολόγισε την τιμή του σύνθετου κλάσματος:'}</span>
          <ComplexFraction nA={q7A} dA={q7B} nB={q7C} dB={q7D} size="sm" />
          <span>({locale === 'en' ? 'e.g. 6/5' : 'π.χ. 6/5'}):</span>
        </span>
      ),
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: (
        <span>
          {locale === 'en' ? 'Product of extremes over product of means: ' : 'Γινόμενο άκρων προς γινόμενο μέσων: '}
          ({q7A} · {q7D}) / ({q7B} · {q7C}) ＝ <Fraction num={q7Top} den={q7Bot} size="sm" />
          {q7G > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή απλοποιημένο:'} {q7Bot / q7G === 1 ? q7Top / q7G : <Fraction num={q7Top / q7G} den={q7Bot / q7G} size="sm" />}
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Resolving Complex Fraction' : 'Επίλυση Σύνθετου Κλάσματος',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the simplest irreducible value of:' : 'Ποιο είναι το απλούστερο ανάγωγο αποτέλεσμα του σύνθετου κλάσματος'}</span>
          <ComplexFraction nA={q8TopN} dA={q8TopD} nB={q8BotN} dB={q8BotD} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q8Options,
      correct: q8CorrectSimpComp,
      explain: (
        <span>
          {locale === 'en' ? 'Multiply extremes (1 · 4 ＝ 4) and means (2 · 3 ＝ 6). We get 4/6, which simplifies to ' : 'Πολλαπλασιάζουμε τους άκρους όρους (1 · 4 ＝ 4) και τους μέσους (2 · 3 ＝ 6). Παίρνουμε 4/6, το οποίο απλοποιείται σε '}
          <Fraction num="2" den="3" size="sm" />.
        </span>
      )
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

export default function DiairesiKlasmatonExercisesPage() {
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
      let sanitized = String(rawValue).replace(/[^0-9/]/g, '');
      const parts = sanitized.split('/');
      if (parts.length > 2) {
        sanitized = parts[0] + '/' + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').trim().toLowerCase() : null;

      // Απευθείας σύγκριση κειμένου
      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) {
        return true;
      }

      // Αριθμητική ισοδυναμία κλάσματος (π.χ. 6/1 ＝ 6)
      const parseFractionOrNumber = (str) => {
        if (!str) return NaN;
        if (str.includes('/')) {
          const [n, d] = str.split('/').map(Number);
          return d !== 0 ? n / d : NaN;
        }
        return Number(str.replace(',', '.'));
      };

      const userNum = parseFractionOrNumber(cleanUser);
      const targetNum = parseFractionOrNumber(cleanTarget);
      return !isNaN(userNum) && !isNaN(targetNum) && Math.abs(userNum - targetNum) < 1e-6;
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

  const answeredCount = Object.values(answers).filter(
    val => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

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
          href="/st-dimotikou/30-diairesi-klasmaton"
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[52px] cursor-pointer ${
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
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={t.inputPlaceholder}
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