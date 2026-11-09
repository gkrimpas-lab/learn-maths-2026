// pages/st-dimotikou/29-pollaplasiasmos-klasmaton-ask.js
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

// Helper για εγγύηση 4 μοναδικών επιλογών MCQ
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
    pageTitle: "Ασκήσεις: Πολλαπλασιασμός Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στον πολλαπλασιασμό κλασμάτων και ακεραίων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 29 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Πολλαπλασιασμός Κλασμάτων",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον πολλαπλασιασμό κλασμάτων, ακεραίων επί κλάσμα, στους αντίστροφους αριθμούς και στην απλοποίηση!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 6/20",
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
    pageTitle: "Exercises: Multiplying Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on multiplying fractions and whole numbers for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 29 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Multiplying Fractions",
    desc: "Solve the 10 dynamic problems to practice multiplying fractions, whole numbers by fractions, reciprocals, and simplification!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 6/20",
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
      const n1 = 1;
      const d1 = 2;
      const n2 = 3;
      const d2 = 4;
      const resN = 3;
      const resD = 8;
      const name = locale === 'en' ? 'Nikos' : 'Ο Νίκος';
      return {
        title: locale === 'en' ? 'Fraction of a Fraction (Pizza)' : 'Μέρος ενός Μέρους (Πίτσα)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'There were' : 'Στο ψυγείο υπήρχαν τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of a pizza in the fridge.' : 'μιας πίτσας.'}</span>
            <span>{name}</span>
            <span>{locale === 'en' ? 'ate' : 'έφαγε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of that leftover. What fraction of the whole pizza did he eat?' : 'από αυτό το υπόλοιπο. Ποιο μέρος ολόκληρης της πίτσας έφαγε;'}</span>
          </span>
        ),
        correctText: `${resN}/${resD}`,
        renderCorrect: <Fraction num={resN} den={resD} size="md" />,
        optionsRaw: [
          { val: `${resN}/${resD}`, render: <Fraction num={resN} den={resD} size="md" /> },
          { val: '4/6', render: <Fraction num="4" den="6" size="md" /> },
          { val: '2/6', render: <Fraction num="2" den="6" size="md" /> },
          { val: '1/8', render: <Fraction num="1" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Leftover pizza' : 'Υπόλοιπο πίτσας', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Portion eaten' : 'Μέρος που καταναλώθηκε', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Multiplication' : 'Πολλαπλασιασμός', formula: `(${n1} · ${n2}) / (${d1} · ${d2})`, val: `${resN}/${resD}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `A fraction of a fraction is computed by multiplying: `
              : `Το μέρος ενός μέρους υπολογίζεται με πολλαπλασιασμό: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ ({n1} · {n2}) / ({d1} · {d2}) ＝ <Fraction num={resN} den={resD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const n1 = 2;
      const d1 = 3;
      const n2 = 3;
      const d2 = 5;
      return {
        title: locale === 'en' ? 'Planting a Plot' : 'Φύτευση Οικοπέδου',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A gardener cleared' : 'Ένας κηπουρός καθάρισε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a plot and planted lawn on' : 'ενός οικοπέδου και από αυτά φύτεψε με γκαζόν τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of that area. What fraction of the total plot has lawn?' : 'του καθαρισμένου μέρους. Ποιο μέρος του οικοπέδου φυτεύτηκε με γκαζόν;'}</span>
          </span>
        ),
        correctText: '2/5',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="2" den="5" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 6/15' : 'ή 6/15'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
          { val: '5/8', render: <Fraction num="5" den="8" size="md" /> },
          { val: '1/5', render: <Fraction num="1" den="5" size="md" /> },
          { val: '3/5', render: <Fraction num="3" den="5" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Cleared part' : 'Καθαρισμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Planted part' : 'Φυτεμένο μέρος', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Product & Simplify' : 'Γινόμενο & Απλοποίηση', formula: '(2 · 3) / (3 · 5) ＝ 6/15 (: 3)', val: '2/5' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Multiply: `
              : `Πολλαπλασιάζουμε: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 6/15 ＝ <Fraction num="2" den="5" size="sm" />.
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
      const n2 = 2;
      const d2 = 5;
      return {
        title: locale === 'en' ? 'Juice Pitcher Portion' : 'Κατανάλωση Χυμού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A pitcher was filled with' : 'Μία κανάτα περιείχε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of juice. Kids drank' : 'χυμού. Τα παιδιά ήπιαν τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of that juice. What fraction of the whole pitcher did they drink?' : 'από αυτόν τον χυμό. Ποιο μέρος της κανάτας ήπιαν συνολικά;'}</span>
          </span>
        ),
        correctText: '3/10',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="3" den="10" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 6/20' : 'ή 6/20'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '3/10', render: <Fraction num="3" den="10" size="md" /> },
          { val: '5/9', render: <Fraction num="5" den="9" size="md" /> },
          { val: '1/10', render: <Fraction num="1" den="10" size="md" /> },
          { val: '7/10', render: <Fraction num="7" den="10" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Initial juice' : 'Αρχικός χυμός', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Portion drunk' : 'Μέρος που ήπιαν', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Product & Simplify' : 'Γινόμενο & Απλοποίηση', formula: '(3 · 2) / (4 · 5) ＝ 6/20 (: 2)', val: '3/10' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Multiply: `
              : `Πολλαπλασιάζουμε: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 6/20 ＝ <Fraction num="3" den="10" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const n1 = 1;
      const d1 = 3;
      const n2 = 3;
      const d2 = 4;
      return {
        title: locale === 'en' ? 'Fabric Roll Usage' : 'Χρήση Υφάσματος',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A dressmaker bought' : 'Μια μοδίστρα αγόρασε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of a fabric roll and used' : 'ενός ρολού υφάσματος και από αυτά χρησιμοποίησε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'for a blouse. What fraction of the original roll was used?' : 'για μια μπλούζα. Ποιο μέρος του αρχικού ρολού χρησιμοποίησε;'}</span>
          </span>
        ),
        correctText: '1/4',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="4" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/12' : 'ή 3/12'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
          { val: '4/7', render: <Fraction num="4" den="7" size="md" /> },
          { val: '2/4', render: <Fraction num="2" den="4" size="md" /> },
          { val: '3/7', render: <Fraction num="3" den="7" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Fabric bought' : 'Ύφασμα που αγοράστηκε', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Used for blouse' : 'Μέρος για μπλούζα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Product & Simplify' : 'Γινόμενο & Απλοποίηση', formula: '(1 · 3) / (3 · 4) ＝ 3/12 (: 3)', val: '1/4' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Compute: `
              : `Υπολογίζουμε: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 3/12 ＝ <Fraction num="1" den="4" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const n1 = 2;
      const d1 = 3;
      const n2 = 1;
      const d2 = 4;
      const name = locale === 'en' ? 'Maria' : 'Η Μαρία';
      return {
        title: locale === 'en' ? 'Painting Canvas Area' : 'Σχέδιο Ζωγραφικής',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{name}</span>
            <span>{locale === 'en' ? 'sketched' : 'σχεδίασε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a canvas and colored' : 'ενός πίνακα και από αυτά χρωμάτισε με μπλε το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'with blue. What fraction of the canvas is blue?' : '. Ποιο μέρος ολόκληρου του πίνακα είναι χρωματισμένο με μπλε;'}</span>
          </span>
        ),
        correctText: '1/6',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="6" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 2/12' : 'ή 2/12'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/6', render: <Fraction num="1" den="6" size="md" /> },
          { val: '3/7', render: <Fraction num="3" den="7" size="md" /> },
          { val: '2/7', render: <Fraction num="2" den="7" size="md" /> },
          { val: '1/12', render: <Fraction num="1" den="12" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Sketched area' : 'Σχεδιασμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Blue colored' : 'Μπλε χρώμα', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Product & Simplify' : 'Γινόμενο & Απλοποίηση', formula: '(2 · 1) / (3 · 4) ＝ 2/12 (: 2)', val: '1/6' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Multiply: `
              : `Πολλαπλασιάζουμε: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 2/12 ＝ <Fraction num="1" den="6" size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const n1 = 4;
      const d1 = 5;
      const n2 = 1;
      const d2 = 2;
      return {
        title: locale === 'en' ? 'Running Track Target' : 'Απόσταση Διαδρομής',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'An athlete planned to run' : 'Ένας αθλητής προγραμμάτισε να τρέξει τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a course, but covered only' : 'μιας διαδρομής, αλλά τελικά κατάφερε να καλύψει το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of that target. What fraction of the total course did he cover?' : 'αυτού του στόχου. Ποιο μέρος της συνολικής διαδρομής κάλυψε;'}</span>
          </span>
        ),
        correctText: '2/5',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="2" den="5" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 4/10' : 'ή 4/10'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
          { val: '5/7', render: <Fraction num="5" den="7" size="md" /> },
          { val: '1/5', render: <Fraction num="1" den="5" size="md" /> },
          { val: '4/7', render: <Fraction num="4" den="7" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Target' : 'Στόχος διαδρομής', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Target achieved' : 'Επίτευξη στόχου', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Product & Simplify' : 'Γινόμενο & Απλοποίηση', formula: '(4 · 1) / (5 · 2) ＝ 4/10 (: 2)', val: '2/5' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Compute: `
              : `Υπολογίζουμε: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 4/10 ＝ <Fraction num="2" den="5" size="sm" />.
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
      const n1 = 3;
      const d1 = 4;
      const n2 = 2;
      const d2 = 5;
      const sqUnit = locale === 'en' ? 'sq.m.' : 'τ.μ.';
      return {
        title: locale === 'en' ? 'Rectangle Area with Fractional Sides' : 'Εμβαδόν Ορθογωνίου με Κλασματικές Πλευρές',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A rectangular tile has length' : 'Ένα ορθογώνιο πλακίδιο έχει μήκος'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'm and width' : 'του μέτρου και πλάτος'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'm. What is its area in square meters?' : 'του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;'}</span>
          </span>
        ),
        correctText: '3/10',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="3" den="10" size="md" />
            <span>{sqUnit}</span>
          </span>
        ),
        optionsRaw: [
          { val: '3/10', render: <span><Fraction num="3" den="10" size="md" /> {sqUnit}</span> },
          { val: '5/9', render: <span><Fraction num="5" den="9" size="md" /> {sqUnit}</span> },
          { val: '7/10', render: <span><Fraction num="7" den="10" size="md" /> {sqUnit}</span> },
          { val: '1/10', render: <span><Fraction num="1" den="10" size="md" /> {sqUnit}</span> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Length (a)' : 'Μήκος (α)', formula: `${n1}/${d1} m`, val: `${n1}/${d1}` },
          { item: locale === 'en' ? 'Width (b)' : 'Πλάτος (β)', formula: `${n2}/${d2} m`, val: `${n2}/${d2}` },
          { item: locale === 'en' ? 'Area (A ＝ a · b)' : 'Εμβαδόν (Ε ＝ α · β)', formula: '(3 · 2) / (4 · 5) ＝ 6/20 (: 2)', val: `3/10 ${sqUnit}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Area ＝ length · width: `
              : `Εμβαδόν ＝ μήκος · πλάτος: `}
            <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ 6/20 ＝ <Fraction num="3" den="10" size="sm" /> {sqUnit}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Multiplying Three Fractions' : 'Πολλαπλασιασμός Τριών Κλασμάτων',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Compute the product of the three fractions:' : 'Υπολόγισε το γινόμενο των τριών κλασμάτων:'}</span>
            <Fraction num="1" den="2" size="sm" />
            <span>·</span>
            <Fraction num="2" den="3" size="sm" />
            <span>·</span>
            <Fraction num="3" den="4" size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: '1/4',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <Fraction num="1" den="4" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 6/24' : 'ή 6/24'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
          { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '3/8', render: <Fraction num="3" den="8" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Numerators' : 'Αριθμητές', formula: '1 · 2 · 3', val: '6' },
          { item: locale === 'en' ? 'Denominators' : 'Παρονομαστές', formula: '2 · 3 · 4', val: '24' },
          { item: locale === 'en' ? 'Simplification' : 'Απλοποίηση', formula: '6/24 (: 6)', val: '1/4' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? 'Multiply all numerators and all denominators: (1 · 2 · 3) / (2 · 3 · 4) ＝ 6/24 ＝ 1/4.'
              : 'Πολλαπλασιάζουμε όλους τους αριθμητές και όλους τους παρονομαστές: (1 · 2 · 3) / (2 · 3 · 4) ＝ 6/24 ＝ 1/4.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const whole = 60;
      const num = 3;
      const den = 4;
      const res = (whole * num) / den; // 45
      const candidateWrongs = [res - 5, res + 5, res - 15, res + 15, 30, 50].filter(v => v !== res);
      const optionsRaw = [
        { val: String(res), render: <span>{res} €</span> },
        ...candidateWrongs.slice(0, 3).map(v => ({
          val: String(v),
          render: <span>{v} €</span>
        }))
      ];
      return {
        title: locale === 'en' ? 'Fractional Portion of Money' : 'Υπολογισμός Κλασματικού Μέρους Χρημάτων',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? `A book costs ${whole} €. If we raised` : `Ένα βιβλίο κοστίζει ${whole} €. Αν έχουμε συγκεντρώσει τα`}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>{locale === 'en' ? 'of its price, how many euros have we raised?' : 'της αξίας του, πόσα ευρώ έχουμε συγκεντρώσει;'}</span>
          </span>
        ),
        correctText: String(res),
        renderCorrect: <span>{res} €</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total cost' : 'Συνολικό ποσό', formula: `${whole} €`, val: `${whole}` },
          { item: locale === 'en' ? 'Fraction of cost' : 'Κλάσμα αξίας', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: locale === 'en' ? 'Calculation' : 'Υπολογισμός', formula: `(${whole} · ${num}) / ${den} ＝ 180 / 4`, val: `${res} €` }
        ],
        explain: (
          <span>
            {whole} · <Fraction num={num} den={den} size="sm" /> ＝ ({whole} · {num}) / {den} ＝ 180 / 4 ＝ {res} €.
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const n1 = 4;
      const d1 = 3;
      const n2 = 3;
      const d2 = 2;
      return {
        title: locale === 'en' ? 'Product of Improper Fractions' : 'Γινόμενο Καταχρηστικών Κλασμάτων',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Calculate the product of improper fractions:' : 'Υπολόγισε το γινόμενο των καταχρηστικών κλασμάτων:'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>·</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: '2',
        renderCorrect: (
          <span className="flex items-center gap-1">
            <span>2</span>
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 12/6' : 'ή 12/6'})</span>
          </span>
        ),
        optionsRaw: [
          { val: '2', render: <span>2</span> },
          { val: '7/5', render: <Fraction num="7" den="5" size="md" /> },
          { val: '1', render: <span>1</span> },
          { val: '12/5', render: <Fraction num="12" den="5" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Numerators' : 'Αριθμητές', formula: `${n1} · ${n2}`, val: '12' },
          { item: locale === 'en' ? 'Denominators' : 'Παρονομαστές', formula: `${d1} · ${d2}`, val: '6' },
          { item: locale === 'en' ? 'Division / Whole' : 'Διαίρεση / Ακέραιος', formula: '12 : 6', val: '2' }
        ],
        explain: (
          <span>
            (4 · 3) / (3 · 2) ＝ 12/6 ＝ 12 : 6 ＝ 2.
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Reciprocal of Mixed Number' : 'Αντίστροφος Μικτού Αριθμού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'What is the reciprocal of the quantity 1 and 1/2 (i.e. fraction' : 'Ποιος είναι ο αντίστροφος αριθμός της ποσότητας 1 και 1/2 (δηλαδή του κλάσματος'}</span>
            <Fraction num="3" den="2" size="sm" />
            <span>);</span>
          </span>
        ),
        correctText: '2/3',
        renderCorrect: <Fraction num="2" den="3" size="md" />,
        optionsRaw: [
          { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
          { val: '3/2', render: <Fraction num="3" den="2" size="md" /> },
          { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
          { val: '1/3', render: <Fraction num="1" den="3" size="md" /> }
        ],
        tableData: [
          { item: locale === 'en' ? 'Improper fraction' : 'Κλασματική μορφή', formula: '1 ＋ 1/2 ＝ 2/2 ＋ 1/2', val: '3/2' },
          { item: locale === 'en' ? 'Reciprocal' : 'Αντίστροφος αριθμός', formula: 'Flip terms', val: '2/3' },
          { item: locale === 'en' ? 'Check' : 'Επαλήθευση', formula: '(3/2) · (2/3)', val: '6/6 ＝ 1' }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? '1 and 1/2 ＝ 3/2. Flipping numerator and denominator yields 2/3.'
              : '1 και 1/2 ＝ 3/2. Αντιστρέφοντας τους όρους προκύπτει το 2/3.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const packs = 8;
      const num = 3;
      const den = 4;
      const total = (packs * num) / den; // 6
      const kgLabel = locale === 'en' ? 'kg' : 'κιλά';
      const candidateWrongs = [total + 2, total - 2, total + 4, 7, 5].filter(v => v !== total);
      const optionsRaw = [
        { val: String(total), render: <span>{total} {kgLabel}</span> },
        ...candidateWrongs.slice(0, 3).map(v => ({
          val: String(v),
          render: <span>{v} {kgLabel}</span>
        }))
      ];
      return {
        title: locale === 'en' ? 'Total Package Weight Problem' : 'Σύνθετο Πρόβλημα Καθημερινότητας (Βάρος)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A shop sells coffee bags weighing' : 'Ένα κατάστημα πουλάει πακέτα καφέ που ζυγίζουν'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>{locale === 'en' ? `kg each. If we buy ${packs} bags, how many whole kg of coffee did we buy?` : `του κιλού το καθένα. Αν αγοράσουμε ${packs} τέτοια πακέτα, πόσα ολόκληρα κιλά καφέ αγοράσαμε συνολικά;`}</span>
          </span>
        ),
        correctText: String(total),
        renderCorrect: <span>{total} {kgLabel}</span>,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Weight per bag' : 'Βάρος ανά πακέτο', formula: `${num}/${den} kg`, val: `${num}/${den}` },
          { item: locale === 'en' ? 'Total bags' : 'Πλήθος πακέτων', formula: `${packs}`, val: `${packs}` },
          { item: locale === 'en' ? 'Total weight' : 'Συνολικό βάρος', formula: `(${packs} · ${num}) / ${den} ＝ 24 / 4`, val: `${total} ${kgLabel}` }
        ],
        explain: (
          <span>
            {packs} · <Fraction num={num} den={den} size="sm" /> ＝ ({packs} · {num}) / {den} ＝ 24/4 ＝ {total} {kgLabel}.
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
  // Q1: Input - Κλάσμα επί Κλάσμα
  const q1Num1 = randInt(1, 4);
  const q1Den1 = randInt(q1Num1 + 1, 6);
  const q1Num2 = randInt(1, 4);
  const q1Den2 = randInt(q1Num2 + 1, 6);
  const q1ProdN = q1Num1 * q1Num2;
  const q1ProdD = q1Den1 * q1Den2;
  const q1G = findGCD(q1ProdN, q1ProdD);
  const q1CorrectRaw = `${q1ProdN}/${q1ProdD}`;
  const q1CorrectSimp = `${q1ProdN / q1G}/${q1ProdD / q1G}`;

  // Q2: Input - Ακέραιος επί Κλάσμα
  const q2Whole = randInt(2, 5);
  const q2Num = randInt(1, 3);
  const q2Den = randInt(q2Num + 1, 8);
  const q2ProdN = q2Whole * q2Num;
  const q2ProdD = q2Den;
  const q2G = findGCD(q2ProdN, q2ProdD);
  const q2CorrectRaw = `${q2ProdN}/${q2ProdD}`;
  const q2CorrectSimp = `${q2ProdN / q2G}/${q2ProdD / q2G}`;

  // Q3: MCQ - Εύρεση Αντίστροφου Κλάσματος (γινόμενο = 1)
  const q3Num = randInt(2, 7);
  let q3Den = randInt(2, 8);
  while (q3Num === q3Den) q3Den++;
  const q3CorrectStr = `${q3Den}/${q3Num}`;
  const q3CandidateWrongs = [
    { num: q3Num, den: q3Den },
    { num: q3Den + 1, den: q3Num },
    { num: Math.max(1, q3Den - 1), den: q3Num },
    { num: q3Num, den: q3Den + 1 },
    { num: q3Num + 1, den: q3Den },
    { num: 1, den: q3Num }
  ];
  const q3Options = makeUniqueMCQ(
    { val: q3CorrectStr, render: <Fraction num={q3Den} den={q3Num} size="md" /> },
    q3CandidateWrongs.map(o => ({
      val: `${o.num}/${o.den}`,
      render: <Fraction num={o.num} den={o.den} size="md" />
    }))
  );

  // Q4: MCQ - Ποιο γινόμενο ισούται με 1 (Αντίστροφοι Αριθμοί)
  const q4N = randInt(3, 7);
  let q4D = randInt(2, 6);
  while (q4D === q4N) q4D++;
  const q4CorrectProd = `(${q4N}/${q4D}) · (${q4D}/${q4N})`;
  const q4Candidates = [
    {
      val: `(${q4N}/${q4D}) · (${q4N}/${q4D})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num={q4N} den={q4D} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4N}/${q4D}) · (${q4N + 1}/${q4D})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num={q4N + 1} den={q4D} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4N}/${q4D}) · (${q4D + 1}/${q4N})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num={q4D + 1} den={q4N} size="sm" />
        </span>
      )
    },
    {
      val: `(${q4N}/${q4D}) · (1/${q4D})`,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num="1" den={q4D} size="sm" />
        </span>
      )
    }
  ];
  const q4Options = makeUniqueMCQ(
    {
      val: q4CorrectProd,
      render: (
        <span className="flex items-center gap-1">
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num={q4D} den={q4N} size="sm" />
        </span>
      )
    },
    q4Candidates
  );

  // Q5: True/False - Κανόνας ομωνύμων στον πολλαπλασιασμό
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'When multiplying fractions, we DO NOT need to convert them to like denominators.'
        : 'Στον πολλαπλασιασμό κλασμάτων ΔΕΝ χρειάζεται να κάνουμε τα κλάσματα ομώνυμα.')
    : (locale === 'en'
        ? 'When multiplying fractions, we must first strictly convert them to like denominators using the LCM.'
        : 'Στον πολλαπλασιασμό κλασμάτων πρέπει πρώτα υποχρεωτικά να τα κάνουμε ομώνυμα βρίσκοντας το Ε.Κ.Π.');

  // Q6: True/False - Γινόμενο γνήσιων κλασμάτων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'The product of two proper fractions (numerator ＜ denominator) is always smaller than both original fractions.'
        : 'Το γινόμενο δύο γνήσιων κλασμάτων (αριθμητής ＜ παρονομαστή) είναι πάντοτε μικρότερο και από τα δύο αρχικά κλάσματα.')
    : (locale === 'en'
        ? 'The product of two proper fractions is always greater than the original fractions.'
        : 'Το γινόμενο δύο γνήσιων κλασμάτων είναι πάντοτε μεγαλύτερο από τα αρχικά κλάσματα.');

  // Q7: Input - Εύρεση άγνωστου αριθμητή σε πολλαπλασιασμό
  const q7N1 = randInt(2, 4);
  const q7D1 = randInt(3, 5);
  const q7N2 = randInt(2, 4);
  const q7D2 = randInt(4, 6);
  const q7TargetN = q7N1 * q7N2;
  const q7TargetD = q7D1 * q7D2;
  const q7Correct = String(q7N2);

  // Q8: MCQ - Πράξη ακεραίου με κλάσμα
  const q8W = randInt(3, 5);
  const q8N = 2;
  const q8D = 7;
  const q8ResNum = q8W * q8N;
  const q8Res = `${q8ResNum}/${q8D}`;
  const q8Candidates = [
    { num: q8ResNum + 1, den: q8D },
    { num: Math.max(1, q8ResNum - 1), den: q8D },
    { num: q8W + q8N, den: q8D },
    { num: q8ResNum, den: q8D + 1 },
    { num: q8ResNum, den: q8D + 2 }
  ];
  const q8Options = makeUniqueMCQ(
    { val: q8Res, render: <Fraction num={q8ResNum} den={q8D} size="md" /> },
    q8Candidates.map(o => ({
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
      title: locale === 'en' ? 'Fraction by Fraction' : 'Κλάσμα επί Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the product:' : 'Υπολόγισε το γινόμενο:'}</span>
          <Fraction num={q1Num1} den={q1Den1} size="sm" />
          <span>·</span>
          <Fraction num={q1Num2} den={q1Den2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 6/20' : 'π.χ. 6/20'}):</span>
        </span>
      ),
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: (
        <span>
          <Fraction num={q1Num1} den={q1Den1} size="sm" /> · <Fraction num={q1Num2} den={q1Den2} size="sm" /> ＝ ({q1Num1} · {q1Num2}) / ({q1Den1} · {q1Den2}) ＝ <Fraction num={q1ProdN} den={q1ProdD} size="sm" />
          {q1G > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή απλοποιημένο:'} <Fraction num={q1ProdN / q1G} den={q1ProdD / q1G} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Whole Number by Fraction' : 'Ακέραιος επί Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the product:' : 'Υπολόγισε το γινόμενο:'}</span>
          <span>{q2Whole} ·</span>
          <Fraction num={q2Num} den={q2Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 6/7' : 'π.χ. 6/7'}):</span>
        </span>
      ),
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: (
        <span>
          {q2Whole} · <Fraction num={q2Num} den={q2Den} size="sm" /> ＝ ({q2Whole} · {q2Num}) / {q2Den} ＝ <Fraction num={q2ProdN} den={q2ProdD} size="sm" />
          {q2G > 1 && (
            <span>
              {' '}＝ <Fraction num={q2ProdN / q2G} den={q2ProdD / q2G} size="sm" />
            </span>
          )}.
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Reciprocal Fraction' : 'Αντίστροφο Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the reciprocal of fraction' : 'Ποιος είναι ο αντίστροφος αριθμός του κλάσματος'}</span>
          <Fraction num={q3Num} den={q3Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q3Options,
      correct: q3CorrectStr,
      explain: (
        <span>
          {locale === 'en'
            ? <span>Flip numerator and denominator: <Fraction num={q3Den} den={q3Num} size="sm" />.</span>
            : <span>Αντιστρέφουμε τους όρους του κλάσματος: <Fraction num={q3Den} den={q3Num} size="sm" />.</span>}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Product of Reciprocals' : 'Γινόμενο Αντίστροφων',
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which of the following products equals exactly 1?'
            : 'Ποιο από τα παρακάτω γινόμενα ισούται ακριβώς με το 1;'}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectProd,
      explain: (
        <span>
          {locale === 'en'
            ? 'The product of two reciprocals always equals 1: '
            : 'Το γινόμενο δύο αντίστροφων αριθμών ισούται πάντοτε με 1: '}
          <Fraction num={q4N} den={q4D} size="sm" /> · <Fraction num={q4D} den={q4N} size="sm" /> ＝ 1.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Multiplication Rule' : 'Κανόνας Πολλαπλασιασμού',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! We multiply numerators together and denominators together directly without any LCM.'
                : 'Σωστά! Στον πολλαπλασιασμό πολλαπλασιάζουμε απευθείας αριθμητές και παρονομαστές χωρίς Ε.Κ.Π.')
            : (locale === 'en'
                ? 'False! Fractions NEVER need to be converted to like denominators for multiplication.'
                : 'Λάθος! Στον πολλαπλασιασμό ΔΕΝ χρειάζεται ποτέ να κάνουμε τα κλάσματα ομώνυμα.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Proper Fractions Property' : 'Ιδιότητα Γνήσιων Κλασμάτων',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! Taking a fraction of a fraction produces an outcome smaller than both factors (e.g. 1/2 · 1/2 ＝ 1/4).'
                : 'Σωστά! Παίρνουμε μέρος ενός μέρους, άρα το αποτέλεσμα είναι μικρότερο και από τα δύο αρχικά κλάσματα.')
            : (locale === 'en'
                ? 'False! Multiplying two proper fractions always yields a strictly smaller fraction (1/2 · 1/2 ＝ 1/4 ＜ 1/2).'
                : 'Λάθος! Το γινόμενο δύο γνήσιων κλασμάτων είναι πάντοτε μικρότερο και από τα δύο αρχικά κλάσματα.')}
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
          <Fraction num={q7N1} den={q7D1} size="sm" />
          <span>·</span>
          <Fraction num="x" den={q7D2} size="sm" />
          <span>＝</span>
          <Fraction num={q7TargetN} den={q7TargetD} size="sm" />
        </span>
      ),
      correct: q7Correct,
      explain: (
        <span>
          {q7N1} · x ＝ {q7TargetN} ➔ x ＝ {q7TargetN} : {q7N1} ＝ {q7Correct}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Whole Number · Fraction' : 'Ακέραιος επί Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the product of' : 'Ποιο είναι το αποτέλεσμα του πολλαπλασιασμού'}</span>
          <span>{q8W} ·</span>
          <Fraction num={q8N} den={q8D} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q8Options,
      correct: q8Res,
      explain: (
        <span>
          ({q8W} · {q8N}) / {q8D} ＝ <Fraction num={q8ResNum} den={q8D} size="sm" />.
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

export default function PollaplasiasmosKlasmatonExercisesPage() {
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
          href="/st-dimotikou/29-pollaplasiasmos-klasmaton"
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