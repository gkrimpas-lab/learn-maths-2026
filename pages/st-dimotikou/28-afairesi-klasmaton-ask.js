// pages/st-dimotikou/28-afairesi-klasmaton-ask.js
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

function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
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

// Helper για εξασφάλιση μοναδικών επιλογών MCQ
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
    pageTitle: "Ασκήσεις: Αφαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην αφαίρεση ομώνυμων και ετερώνυμων κλασμάτων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 28 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Αφαίρεση Κλασμάτων",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αφαίρεση ομώνυμων & ετερώνυμων κλασμάτων, στην αφαίρεση από ακέραιο και στην απλοποίηση!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 1/4",
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
    lcmLabel: "Ε.Κ.Π.",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: Subtracting Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on subtracting like and unlike fractions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 28 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Subtracting Fractions",
    desc: "Solve the 10 dynamic problems to practice subtracting like and unlike fractions, subtracting from whole numbers, and simplifying!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 1/4",
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
    lcmLabel: "LCM",
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
      const n1 = 7;
      const d1 = 8;
      const n2 = 1;
      const d2 = 2;
      const resN = 3;
      const resD = 8;
      return {
        title: locale === 'en' ? 'Leftover Pizza Slice' : 'Υπόλοιπο Πίτσας',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'On a tray there were' : 'Σε μια πιατέλα υπήρχαν τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a pizza. The kids ate' : 'μιας πίτσας. Τα παιδιά κατανάλωσαν το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the pizza. What fraction of the pizza was left?' : 'της πίτσας. Ποιο μέρος της πίτσας περίσσεψε;'}</span>
          </span>
        ),
        correctText: `${resN}/${resD}`,
        renderCorrect: <Fraction num={resN} den={resD} size="md" />,
        optionsRaw: [
          { val: `${resN}/${resD}`, render: <Fraction num={resN} den={resD} size="md" /> },
          { val: '4/8', render: <Fraction num="4" den="8" size="md" /> },
          { val: '5/8', render: <Fraction num="5" den="8" size="md" /> },
          { val: '2/8', render: <Fraction num="2" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Initial quantity' : 'Αρχική ποσότητα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Quantity eaten (Like)' : 'Ποσότητα που καταναλώθηκε (Ομώνυμο)', formula: `(${n2} · 4) / (${d2} · 4)`, val: `4/${resD}` },
          { item: locale === 'en' ? 'Leftover (Difference)' : 'Υπόλοιπο (Διαφορά)', formula: `${n1}/${resD} － 4/${resD}`, val: `${resN}/${resD}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Convert to common denominator with LCM(8, 2) ＝ 8. 1/2 becomes 4/8. Subtract numerators: 7/8 － 4/8 ＝ `
              : `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(8, 2) ＝ 8. Το 1/2 γίνεται 4/8. Αφαιρούμε τους αριθμητές: 7/8 － 4/8 ＝ `}
            <Fraction num={resN} den={resD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const n1 = 5;
      const d1 = 6;
      const n2 = 1;
      const d2 = 3;
      return {
        title: locale === 'en' ? 'Juice in a Bottle' : 'Χυμός σε Μπουκάλι',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A bottle contained' : 'Ένα μπουκάλι περιείχε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of juice. We drank' : 'χυμού. Ήπιαμε το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the juice. What fraction remained in the bottle?' : 'του χυμού. Ποιο μέρος του χυμού έμεινε στο μπουκάλι;'}</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/6' : 'ή 3/6'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '4/6', render: <Fraction num="4" den="6" size="md" /> },
          { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
          { val: '1/6', render: <Fraction num="1" den="6" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Initial contents' : 'Αρχικό περιεχόμενο', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Portion drunk (Like)' : 'Ποσότητα που ήπιαμε (Ομώνυμο)', formula: `(${n2} · 2) / (${d2} · 2)`, val: '2/6' },
          { item: locale === 'en' ? 'Remaining & Simplify' : 'Υπόλοιπο & Απλοποίηση', formula: '5/6 － 2/6 ＝ 3/6 (: 3)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `LCM(6, 3) ＝ 6. 1/3 becomes 2/6. Subtract: 5/6 － 2/6 ＝ 3/6. Simplifying by 3 gives `
              : `Ε.Κ.Π.(6, 3) ＝ 6. Το 1/3 γίνεται 2/6. Αφαιρούμε: 5/6 － 2/6 ＝ 3/6. Απλοποιώντας διαιρώντας με το 3 παίρνουμε `}
            <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const n1 = 3;
      const d1 = 4;
      const n2 = 1;
      const d2 = 4;
      return {
        title: locale === 'en' ? 'Roll of Fabric' : 'Ρολό Υφάσματος',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A seamstress had' : 'Μια μοδίστρα είχε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a fabric roll and used' : 'ενός ρολού υφάσματος και χρησιμοποίησε το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? '. What fraction of the fabric remained?' : '. Ποιο μέρος του υφάσματος περίσσεψε;'}</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 2/4' : 'ή 2/4'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '2/8', render: <Fraction num="2" den="8" size="md" /> },
          { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
          { val: '3/8', render: <Fraction num="3" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Initial fabric' : 'Αρχικό ύφασμα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Fabric used' : 'Ύφασμα που χρησιμοποιήθηκε', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Difference & Simplify' : 'Διαφορά & Απλοποίηση', formula: `(${n1} － ${n2})/${d1} ＝ 2/4 (: 2)`, val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Fractions are like: 3/4 － 1/4 ＝ 2/4. Simplifying by 2 gives `
              : `Τα κλάσματα είναι ομώνυμα: 3/4 － 1/4 ＝ 2/4. Απλοποιώντας με το 2 έχουμε `}
            <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const n1 = 9;
      const d1 = 10;
      const n2 = 2;
      const d2 = 5;
      return {
        title: locale === 'en' ? 'School Garden Area' : 'Επιφάνεια Σχολικού Κήπου',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Students had dug' : 'Οι μαθητές είχαν σκάψει τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a garden. They planted flowers in' : 'ενός κήπου. Φύτεψαν λουλούδια στα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the garden. What fraction remained dug without plants?' : 'του κήπου. Ποιο μέρος του κήπου έμεινε σκαμμένο χωρίς φυτά;'}</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 5/10' : 'ή 5/10'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '4/10', render: <Fraction num="4" den="10" size="md" /> },
          { val: '3/10', render: <Fraction num="3" den="10" size="md" /> },
          { val: '7/10', render: <Fraction num="7" den="10" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Dug area' : 'Σκαμμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Planted area (Like)' : 'Φυτεμένο μέρος (Ομώνυμο)', formula: `(${n2} · 2) / (${d2} · 2)`, val: '4/10' },
          { item: locale === 'en' ? 'Remaining & Simplify' : 'Υπόλοιπο & Απλοποίηση', formula: '9/10 － 4/10 ＝ 5/10 (: 5)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `LCM(10, 5) ＝ 10. 2/5 becomes 4/10. Subtract: 9/10 － 4/10 ＝ 5/10 ＝ `
              : `Ε.Κ.Π.(10, 5) ＝ 10. Το 2/5 γίνεται 4/10. Αφαιρούμε: 9/10 － 4/10 ＝ 5/10 ＝ `}
            <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const n1 = 4;
      const d1 = 5;
      const n2 = 3;
      const d2 = 10;
      return {
        title: locale === 'en' ? 'Sharing Chocolate' : 'Μοίρασμα Σοκολάτας',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A chocolate bar had' : 'Μία πλάκα σοκολάτας είχε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of its weight. A portion of' : 'του βάρους της. Δόθηκαν τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'was shared. What fraction was left?' : '. Ποιο μέρος της σοκολάτας περίσσεψε;'}</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 5/10' : 'ή 5/10'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '1/5', render: <Fraction num="1" den="5" size="md" /> },
          { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
          { val: '1/10', render: <Fraction num="1" den="10" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Initial quantity (Like)' : 'Αρχική ποσότητα (Ομώνυμο)', formula: `(${n1} · 2) / (${d1} · 2)`, val: '8/10' },
          { item: locale === 'en' ? 'Quantity given' : 'Ποσότητα που δόθηκε', formula: `${n2}/${d2}`, val: '3/10' },
          { item: locale === 'en' ? 'Difference & Simplify' : 'Διαφορά & Απλοποίηση', formula: '8/10 － 3/10 ＝ 5/10 (: 5)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Convert to common denominator: 4/5 ＝ 8/10. Subtract: 8/10 － 3/10 ＝ 5/10 ＝ `
              : `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 10) ＝ 10: 4/5 ＝ 8/10. Αφαιρούμε: 8/10 － 3/10 ＝ 5/10 ＝ `}
            <Fraction num="1" den="2" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const n1 = 7;
      const d1 = 12;
      const n2 = 1;
      const d2 = 4;
      return {
        title: locale === 'en' ? 'Remaining Cycling Course' : 'Υπόλοιπο Αθλητικής Διαδρομής',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A cyclist planned to ride' : 'Ένας ποδηλάτης είχε σχεδιάσει να διανύσει τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a course. If he completed only' : 'μιας διαδρομής. Αν διάνυσε μόνο το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? ', what fraction of the planned course remains?' : ', ποιο μέρος της σχεδιασμένης διαδρομής του απομένει;'}</span>
          </span>
        ),
        correctText: '1/3',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="3" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 4/12' : 'ή 4/12'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/3', render: <Fraction num="1" den="3" size="md" /> },
          { val: '5/12', render: <Fraction num="5" den="12" size="md" /> },
          { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
          { val: '5/6', render: <Fraction num="5" den="6" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Planned distance' : 'Σχεδιασμένη διαδρομή', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Completed distance (Like)' : 'Διανυθείσα διαδρομή (Ομώνυμο)', formula: `(${n2} · 3) / (${d2} · 3)`, val: '3/12' },
          { item: locale === 'en' ? 'Remaining & Simplify' : 'Υπόλοιπο & Απλοποίηση', formula: '7/12 － 3/12 ＝ 4/12 (: 4)', val: '1/3' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `LCM(12, 4) ＝ 12. 1/4 becomes 3/12. Subtract: 7/12 － 3/12 ＝ 4/12 ＝ `
              : `Ε.Κ.Π.(12, 4) ＝ 12. Το 1/4 γίνεται 3/12. Αφαιρούμε: 7/12 － 3/12 ＝ 4/12 ＝ `}
            <Fraction num="1" den="3" size="sm" />.
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
      const whole = 2;
      const num = 3;
      const den = 4;
      const resN = 5;
      const resD = 4;
      return {
        title: locale === 'en' ? 'Subtracting from Whole Number' : 'Αφαίρεση από Ακέραιο Αριθμό',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Compute the difference:' : 'Υπολόγισε το αποτέλεσμα της αφαίρεσης:'}</span>
            <span>{whole} －</span>
            <Fraction num={num} den={den} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: `${resN}/${resD}`,
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num={resN} den={resD} size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 1 1/4' : 'ή 1 και 1/4'})</span>
          </span>
        ),
        optionsRaw: [
          { val: `${resN}/${resD}`, render: <Fraction num={resN} den={resD} size="md" /> },
          { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
          { val: '7/4', render: <Fraction num="7" den="4" size="md" /> },
          { val: '3/4', render: <Fraction num="3" den="4" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Whole number in fourths' : 'Ακέραιος σε τέταρτα', formula: `${whole} ＝ (${whole} · ${den})/${den}`, val: '8/4' },
          { item: locale === 'en' ? 'Subtrahend' : 'Αφαιρετέος', formula: `${num}/${den}`, val: '3/4' },
          { item: locale === 'en' ? 'Difference' : 'Διαφορά', formula: '8/4 － 3/4', val: `${resN}/${resD}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Convert 2 into fourths: 2 ＝ 8/4. Subtract: 8/4 － 3/4 ＝ `
              : `Γράφουμε τον ακέραιο 2 ως κλάσμα με παρονομαστή 4: 2 ＝ 8/4. Αφαιρούμε: 8/4 － 3/4 ＝ `}
            <Fraction num={resN} den={resD} size="sm" />
            {locale === 'en' ? ' (or 1 1/4).' : ' (ή 1 και 1/4).'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const den = 7;
      const num = 5;
      const resN = den - num;
      return {
        title: locale === 'en' ? 'Subtracting from 1 Whole' : 'Αφαίρεση από τη Μονάδα (1)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A container was full (1 whole). If' : 'Ένα δοχείο ήταν εντελώς γεμάτο (1 ολόκληρη μονάδα). Αν καταναλωθούν τα'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>{locale === 'en' ? 'of its content are consumed, what fraction remains?' : 'του περιεχομένου, ποιο μέρος απομένει;'}</span>
          </span>
        ),
        correctText: `${resN}/${den}`,
        renderCorrect: <Fraction num={resN} den={den} size="md" />,
        optionsRaw: [
          { val: `${resN}/${den}`, render: <Fraction num={resN} den={den} size="md" /> },
          { val: `${num}/${den}`, render: <Fraction num={num} den={den} size="md" /> },
          { val: `1/${den}`, render: <Fraction num="1" den={den} size="md" /> },
          { val: `3/${den}`, render: <Fraction num="3" den={den} size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? '1 whole unit' : 'Ολόκληρη μονάδα', formula: `1 ＝ ${den}/${den}`, val: `${den}/${den}` },
          { item: locale === 'en' ? 'Consumed' : 'Ποσότητα που καταναλώθηκε', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: locale === 'en' ? 'Remaining' : 'Υπόλοιπο', formula: `${den}/${den} － ${num}/${den}`, val: `${resN}/${den}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `1 whole equals ${den}/${den}. Subtract: ${den}/${den} － ${num}/${den} ＝ `
              : `Η ακέραια μονάδα ισούται με ${den}/${den}. Αφαιρούμε: ${den}/${den} － ${num}/${den} ＝ `}
            <Fraction num={resN} den={den} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Subtracting Two Fractions from 1 Whole' : 'Σύνθετη Αφαίρεση Δύο Κλασμάτων από Ακέραιο',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'From 1 whole pizza, we subtract first' : 'Από 1 ολόκληρη πίτσα αφαιρούμε πρώτα το'}</span>
            <Fraction num="1" den="3" size="sm" />
            <span>{locale === 'en' ? 'and then' : 'και μετά το'}</span>
            <Fraction num="1" den="6" size="sm" />
            <span>{locale === 'en' ? '. What fraction of the pizza is left?' : '. Ποιο μέρος της πίτσας απομένει;'}</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/6' : 'ή 3/6'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '1/3', render: <Fraction num="1" den="3" size="md" /> },
          { val: '1/6', render: <Fraction num="1" den="6" size="md" /> },
          { val: '2/3', render: <Fraction num="2" den="3" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Sum of subtractions' : 'Άθροισμα αφαιρέσεων', formula: '1/3 ＋ 1/6 ＝ 2/6 ＋ 1/6', val: '3/6' },
          { item: locale === 'en' ? 'Original pizza' : 'Αρχική πίτσα', formula: '1 ＝ 6/6', val: '6/6' },
          { item: locale === 'en' ? 'Final remaining' : 'Τελικό υπόλοιπο', formula: '6/6 － 3/6 ＝ 3/6 (: 3)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? 'Add subtractions first: 1/3 ＋ 1/6 ＝ 2/6 ＋ 1/6 ＝ 3/6 ＝ 1/2. Subtract from 1 whole: 1 － 1/2 ＝ 1/2 of the pizza.'
              : 'Προσθέτουμε πρώτα τα κομμάτια που αφαιρέθηκαν: 1/3 ＋ 1/6 ＝ 2/6 ＋ 1/6 ＝ 3/6 ＝ 1/2. Αφαιρούμε από το όλον: 1 － 1/2 ＝ 1/2 της πίτσας.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Finding Missing Subtrahend Fraction' : 'Εύρεση Άγνωστου Αφαιρετέου',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Which fraction must be subtracted from' : 'Ποιο κλάσμα πρέπει να αφαιρεθεί από το'}</span>
            <Fraction num="4" den="5" size="sm" />
            <span>{locale === 'en' ? 'to yield a difference of' : 'για να προκύψει διαφορά ίση με'}</span>
            <Fraction num="3" den="10" size="sm" />
            <span>;</span>
          </span>
        ),
        correctText: '1/2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 5/10' : 'ή 5/10'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '1/5', render: <Fraction num="1" den="5" size="md" /> },
          { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
          { val: '3/5', render: <Fraction num="3" den="5" size="md" /> }
        ],
        tableData: [
          { item: '4/5', formula: '(4 · 2) / 10', val: '8/10' },
          { item: locale === 'en' ? 'Target difference' : 'Επιθυμητή διαφορά', formula: '3/10', val: '3/10' },
          { item: locale === 'en' ? 'Missing subtrahend' : 'Άγνωστος αφαιρετέος', formula: '8/10 － 3/10 ＝ 5/10 (: 5)', val: '1/2' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? '4/5 ＝ 8/10. The unknown subtrahend is: 8/10 － 3/10 ＝ 5/10, which reduces to 1/2.'
              : 'Μετατρέπουμε το 4/5 σε 8/10. Ο άγνωστος αφαιρετέος είναι: 8/10 － 3/10 ＝ 5/10, το οποίο απλοποιείται σε 1/2.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Subtracting with Unlike Denominators' : 'Αφαίρεση Ετερωνύμων με Μεγάλο Ε.Κ.Π.',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Calculate the difference:' : 'Υπολόγισε τη διαφορά των ετερώνυμων κλασμάτων:'}</span>
            <Fraction num="7" den="10" size="sm" />
            <span>－</span>
            <Fraction num="4" den="15" size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: '13/30',
        renderCorrect: <Fraction num="13" den="30" size="md" />,
        optionsRaw: [
          { val: '13/30', render: <Fraction num="13" den="30" size="md" /> },
          { val: '3/5', render: <Fraction num="3" den="5" size="md" /> },
          { val: '11/30', render: <Fraction num="11" den="30" size="md" /> },
          { val: '17/30', render: <Fraction num="17" den="30" size="md" /> }
        ],
        tableData: [
          { item: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}(10, 15)`, formula: 'Common denominator', val: '30' },
          { item: '7/10 (· 3)', formula: '(7 · 3) / 30', val: '21/30' },
          { item: '4/15 (· 2)', formula: '(4 · 2) / 30', val: '8/30' },
          { item: locale === 'en' ? 'Difference' : 'Διαφορά', formula: '21/30 － 8/30', val: '13/30' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? 'LCM(10, 15) ＝ 30: 21/30 － 8/30 ＝ 13/30.'
              : 'Ε.Κ.Π.(10, 15) ＝ 30. Μετατρέπουμε σε ομώνυμα: 21/30 － 8/30 ＝ 13/30.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Difference of Equivalent Fractions' : 'Σύγκριση Διαφοράς με το Μηδέν',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'What is the result of subtracting equivalent fractions:' : 'Ποιο είναι το αποτέλεσμα της αφαίρεσης των ισοδύναμων κλασμάτων:'}</span>
            <Fraction num="3" den="4" size="sm" />
            <span>－</span>
            <Fraction num="6" den="8" size="sm" />
            <span>;</span>
          </span>
        ),
        correctText: '0',
        optionsRaw: [
          { val: '0', render: <span>0 ({locale === 'en' ? 'zero' : 'μηδέν'})</span> },
          { val: '1/8', render: <Fraction num="1" den="8" size="md" /> },
          { val: '3/8', render: <Fraction num="3" den="8" size="md" /> },
          { val: '1', render: <span>1</span> }
        ],
        tableData: [
          { item: '3/4', formula: '3/4', val: '6/8' },
          { item: '6/8', formula: '6/8', val: '6/8' },
          { item: locale === 'en' ? 'Difference' : 'Διαφορά', formula: '6/8 － 6/8', val: '0' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? 'Since 3/4 ＝ 6/8 (equivalent fractions), subtracting two equal quantities always yields 0.'
              : 'Επειδή 3/4 ＝ 6/8 (είναι ισοδύναμα κλάσματα), όταν αφαιρούμε δύο ίσες ποσότητες το αποτέλεσμα είναι πάντοτε 0.'}
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
  // Q1: Input - Αφαίρεση Ομώνυμων Κλασμάτων
  const q1Den = randInt(5, 12);
  const q1Num1 = randInt(3, q1Den);
  const q1Num2 = randInt(1, q1Num1 - 1);
  const q1DiffNum = q1Num1 - q1Num2;
  const q1Gcd = findGCD(q1DiffNum, q1Den);
  const q1CorrectRaw = `${q1DiffNum}/${q1Den}`;
  const q1CorrectSimp = `${q1DiffNum / q1Gcd}/${q1Den / q1Gcd}`;

  // Q2: Input - Αφαίρεση Ετερώνυμων Κλασμάτων
  const q2Pairs = [
    { n1: 3, d1: 4, n2: 1, d2: 2 },
    { n1: 5, d1: 6, n2: 1, d2: 3 },
    { n1: 4, d1: 5, n2: 3, d2: 10 },
    { n1: 7, d1: 8, n2: 1, d2: 4 },
    { n1: 2, d1: 3, n2: 1, d2: 6 },
    { n1: 5, d1: 6, n2: 1, d2: 2 }
  ];
  const q2Item = q2Pairs[randInt(0, q2Pairs.length - 1)];
  const q2Lcm = findLCM(q2Item.d1, q2Item.d2);
  const q2Equiv1 = q2Item.n1 * (q2Lcm / q2Item.d1);
  const q2Equiv2 = q2Item.n2 * (q2Lcm / q2Item.d2);
  const q2DiffN = q2Equiv1 - q2Equiv2;
  const q2G = findGCD(q2DiffN, q2Lcm);
  const q2CorrectRaw = `${q2DiffN}/${q2Lcm}`;
  const q2CorrectSimp = `${q2DiffN / q2G}/${q2Lcm / q2G}`;

  // Q3: MCQ - Αφαίρεση από τη Μονάδα (1 － κλάσμα)
  const q3Den = randInt(3, 8);
  const q3Num = randInt(1, q3Den - 1);
  const q3DiffNum = q3Den - q3Num;
  const q3CorrectStr = `${q3DiffNum}/${q3Den}`;
  const q3CandidateWrongs = [
    { num: q3DiffNum + 1, den: q3Den },
    { num: Math.max(1, q3DiffNum - 1), den: q3Den },
    { num: q3Num, den: q3Den },
    { num: q3DiffNum, den: q3Den + 1 },
    { num: 1, den: q3Den },
    { num: q3Den - 1, den: q3Den }
  ];
  const q3Options = makeUniqueMCQ(
    { val: q3CorrectStr, render: <Fraction num={q3DiffNum} den={q3Den} size="md" /> },
    q3CandidateWrongs.map(o => ({
      val: `${o.num}/${o.den}`,
      render: <Fraction num={o.num} den={o.den} size="md" />
    }))
  );

  // Q4: MCQ - Αφαίρεση Ακέραιου με Κλάσμα
  const q4Whole = randInt(2, 3);
  const q4Den = randInt(3, 5);
  const q4Num = randInt(1, q4Den - 1);
  const q4ResNum = q4Whole * q4Den - q4Num;
  const q4CorrectStr = `${q4ResNum}/${q4Den}`;
  const q4CandidateWrongs = [
    { num: q4ResNum + 1, den: q4Den },
    { num: Math.max(1, q4ResNum - 1), den: q4Den },
    { num: q4Whole * q4Den + q4Num, den: q4Den },
    { num: q4Whole + q4Num, den: q4Den },
    { num: q4ResNum, den: q4Den + 1 }
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectStr, render: <Fraction num={q4ResNum} den={q4Den} size="md" /> },
    q4CandidateWrongs.map(o => ({
      val: `${o.num}/${o.den}`,
      render: <Fraction num={o.num} den={o.den} size="md" />
    }))
  );

  // Q5: True/False - Κανόνας ομωνύμων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'When subtracting like fractions, we subtract only the numerators and keep the common denominator unchanged.'
        : 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε μόνο τους αριθμητές και αφήνουμε τον ίδιο παρονομαστή.')
    : (locale === 'en'
        ? 'When subtracting like fractions, we subtract numerators and also subtract denominators from each other.'
        : 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε και τους αριθμητές και τους παρονομαστές μεταξύ τους.');

  // Q6: True/False - Αφαίρεση ετερωνύμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'To subtract fractions with unlike denominators, we must first convert them to like denominators using the LCM.'
        : 'Για να αφαιρέσουμε ετερώνυμα κλάσματα, πρέπει πρώτα οπωσδήποτε να τα μετατρέψουμε σε ομώνυμα βρίσκοντας το Ε.Κ.Π.')
    : (locale === 'en'
        ? 'We can directly subtract unlike fractions by subtracting numerators and denominators without finding a common denominator.'
        : 'Μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα αφαιρώντας απευθείας τους αριθμητές και τους παρονομαστές.');

  // Q7: Input - Εύρεση άγνωστου όρου
  const q7Den = randInt(6, 12);
  const q7Target = randInt(1, q7Den - 3);
  const q7Start = randInt(q7Target + 2, q7Den);
  const q7Correct = String(q7Start - q7Target);

  // Q8: MCQ - Απλοποίηση διαφοράς
  const q8Pairs = [
    { n1: 5, d: 8, n2: 1, simpN: 1, simpD: 2 },
    { n1: 7, d: 9, n2: 4, simpN: 1, simpD: 3 },
    { n1: 8, d: 10, n2: 3, simpN: 1, simpD: 2 },
    { n1: 5, d: 6, n2: 1, simpN: 2, simpD: 3 }
  ];
  const q8Item = q8Pairs[randInt(0, q8Pairs.length - 1)];
  const q8CorrectStr = `${q8Item.simpN}/${q8Item.simpD}`;
  const q8CandidateWrongs = [
    { num: 1, den: 4 },
    { num: 3, den: 4 },
    { num: 2, den: 5 },
    { num: 1, den: 6 },
    { num: 3, den: 5 }
  ];
  const q8Options = makeUniqueMCQ(
    { val: q8CorrectStr, render: <Fraction num={q8Item.simpN} den={q8Item.simpD} size="md" /> },
    q8CandidateWrongs.map(o => ({
      val: `${o.num}/${o.den}`,
      render: <Fraction num={o.num} den={o.den} size="md" />
    }))
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
      title: locale === 'en' ? 'Like Fractions Subtraction' : 'Ομώνυμα Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the difference:' : 'Υπολόγισε τη διαφορά των ομώνυμων κλασμάτων:'}</span>
          <Fraction num={q1Num1} den={q1Den} size="sm" />
          <span>－</span>
          <Fraction num={q1Num2} den={q1Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 2/7' : 'π.χ. 2/7'}):</span>
        </span>
      ),
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: (
        <span>
          <Fraction num={q1Num1} den={q1Den} size="sm" /> － <Fraction num={q1Num2} den={q1Den} size="sm" /> ＝ ({q1Num1} － {q1Num2})/{q1Den} ＝ <Fraction num={q1DiffNum} den={q1Den} size="sm" />
          {q1Gcd > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή απλοποιημένο:'} <Fraction num={q1DiffNum / q1Gcd} den={q1Den / q1Gcd} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Unlike Fractions Subtraction' : 'Ετερώνυμα Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the difference:' : 'Υπολόγισε τη διαφορά:'}</span>
          <Fraction num={q2Item.n1} den={q2Item.d1} size="sm" />
          <span>－</span>
          <Fraction num={q2Item.n2} den={q2Item.d2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 1/4' : 'π.χ. 1/4'}):</span>
        </span>
      ),
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: (
        <span>
          {locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}({q2Item.d1}, {q2Item.d2}) ＝ {q2Lcm}.{' '}
          <Fraction num={q2Equiv1} den={q2Lcm} size="sm" /> － <Fraction num={q2Equiv2} den={q2Lcm} size="sm" /> ＝ <Fraction num={q2DiffN} den={q2Lcm} size="sm" />
          {q2G > 1 && (
            <span>
              {' '}＝ <Fraction num={q2DiffN / q2G} den={q2Lcm / q2G} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Subtracting from 1 Whole' : 'Αφαίρεση από τη Μονάδα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the result of' : 'Ποιο είναι το αποτέλεσμα της πράξης'}</span>
          <span>1 －</span>
          <Fraction num={q3Num} den={q3Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q3Options,
      correct: q3CorrectStr,
      explain: (
        <span>
          {locale === 'en'
            ? `Write 1 as fraction: 1 ＝ ${q3Den}/${q3Den}. Subtract: `
            : `Γράφουμε τη μονάδα ως κλάσμα: 1 ＝ ${q3Den}/${q3Den}. Επομένως: `}
          <Fraction num={q3Den} den={q3Den} size="sm" /> － <Fraction num={q3Num} den={q3Den} size="sm" /> ＝ <Fraction num={q3DiffNum} den={q3Den} size="sm" />.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Whole Number － Fraction' : 'Ακέραιος － Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the result of' : 'Ποιο είναι το αποτέλεσμα της πράξης'}</span>
          <span>{q4Whole} －</span>
          <Fraction num={q4Num} den={q4Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q4Options,
      correct: q4CorrectStr,
      explain: (
        <span>
          {locale === 'en'
            ? `Write whole number as fraction: ${q4Whole} ＝ ${q4Whole * q4Den}/${q4Den}. Subtract: `
            : `Γράφουμε τον ακέραιο ως κλάσμα: ${q4Whole} ＝ ${q4Whole * q4Den}/${q4Den}. Επομένως: `}
          <Fraction num={q4Whole * q4Den} den={q4Den} size="sm" /> － <Fraction num={q4Num} den={q4Den} size="sm" /> ＝ <Fraction num={q4ResNum} den={q4Den} size="sm" />.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Rule for Like Fractions' : 'Κανόνας Ομωνύμων',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! When subtracting like fractions, subtract only the numerators and keep the same denominator.'
                : 'Σωστά! Στα ομώνυμα κλάσματα αφαιρούμε ΜΟΝΟ τους αριθμητές και κρατάμε τον ίδιο παρονομαστή.')
            : (locale === 'en'
                ? 'False! We NEVER subtract denominators from each other.'
                : 'Λάθος! ΠΟΤΕ δεν αφαιρούμε τους παρονομαστές μεταξύ τους.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Rule for Unlike Fractions' : 'Κανόνας Ετερωνύμων',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! We must first convert unlike fractions to like denominators with the LCM.'
                : 'Σωστά! Για να αφαιρέσουμε ετερώνυμα κλάσματα πρέπει πρώτα οπωσδήποτε να τα κάνουμε ομώνυμα με το Ε.Κ.Π.')
            : (locale === 'en'
                ? 'False! We cannot subtract unlike fractions without converting them to common denominators first.'
                : 'Λάθος! Δεν μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα χωρίς να τα μετατρέψουμε πρώτα σε ομώνυμα.')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Finding Missing Numerator' : 'Εύρεση Άγνωστου Όρου',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Find numerator x in:' : 'Βρες τον αριθμητή x στην ισότητα:'}</span>
          <Fraction num={q7Start} den={q7Den} size="sm" />
          <span>－</span>
          <Fraction num="x" den={q7Den} size="sm" />
          <span>＝</span>
          <Fraction num={q7Target} den={q7Den} size="sm" />
        </span>
      ),
      correct: q7Correct,
      explain: (
        <span>
          {q7Start} － x ＝ {q7Target} ➔ x ＝ {q7Start} － {q7Target} ＝ {q7Correct}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Simplifying the Difference' : 'Απλοποίηση Διαφοράς',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the irreducible fraction from' : 'Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει από τη διαφορά'}</span>
          <Fraction num={q8Item.n1} den={q8Item.d} size="sm" />
          <span>－</span>
          <Fraction num={q8Item.n2} den={q8Item.d} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q8Options,
      correct: q8CorrectStr,
      explain: (
        <span>
          <Fraction num={q8Item.n1} den={q8Item.d} size="sm" /> － <Fraction num={q8Item.n2} den={q8Item.d} size="sm" /> ＝ <Fraction num={q8Item.n1 - q8Item.n2} den={q8Item.d} size="sm" /> ＝ <Fraction num={q8Item.simpN} den={q8Item.simpD} size="sm" />.
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

export default function AfairesiKlasmatonExercisesPage() {
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
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
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
          href="/st-dimotikou/28-afairesi-klasmaton"
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
                          inputMode={q.id === 'q7' ? 'numeric' : 'text'}
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.id === 'q7' ? 'π.χ. 3' : t.inputPlaceholder}
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