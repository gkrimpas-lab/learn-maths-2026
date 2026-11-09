// pages/st-dimotikou/64-arithmitika-motiba-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος με οριζόντια γραμμή (καθαρό JSX, χωρίς raw LaTeX) - Mobile Safe
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="font-bold border-b border-current px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="font-bold px-1 pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Εγγύηση ακριβώς 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set();
  if (correct !== undefined && correct !== null && correct !== '') {
    unique.add(String(correct));
  }
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let fallbackCounter = 1;
  while (unique.size < 4) {
    unique.add(`${correct} (${fallbackCounter})`);
    fallbackCounter++;
  }
  return shuffleArray(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// ---------------------------------------------------------
// ΔΙΕΘΝΟΠΟΙΗΣΗ (i18n) & ΛΕΞΙΚΟ
// ---------------------------------------------------------

const I18N = {
  el: {
    metaTitle: "Ασκήσεις: Αριθμητικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αριθμητικά μοτίβα, τις ακολουθίες, το σταθερό βήμα και τον τύπο του ν-οστού όρου για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "ΚΕΦΑΛΑΙΟ 64 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Αριθμητικά Μοτίβα & Ακολουθίες",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγνώριση κανόνων ακολουθιών, στον υπολογισμό του ν-οστού όρου και στην επίλυση προβλημάτων καθημερινότητας!",
    newSetBtn: "Νέες Ασκήσεις",
    exerciseLabel: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντηση...",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    percentageLabel: "Ποσοστό",
    footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    excellentFeedback: "🎯 Εξαιρετικά!",
    explainFeedback: "💡 Επεξήγηση:",
    tableColItem: "Στοιχείο",
    tableColFormula: "Ανάλυση / Τύπος",
    tableColVal: "Τιμή"
  },
  en: {
    metaTitle: "Exercises: Arithmetic Patterns - 6th Grade | LearnMaths.gr",
    metaDesc: "Interactive math exercises with 10 problems and automated grading on arithmetic patterns, sequences, constant steps, and nth term formulas for 6th Grade.",
    backLinkText: "6th Grade",
    theoryBtn: "Theory",
    badgeHeader: "CHAPTER 64 • 6TH GRADE • PRACTICE",
    heroTitle: "Interactive Exercises: Arithmetic Patterns & Sequences",
    heroDesc: "Solve 10 dynamic problems to practice recognizing sequence rules, calculating the nth term, and solving real-world pattern problems!",
    newSetBtn: "New Questions",
    exerciseLabel: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Write the answer...",
    checkBtn: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    percentageLabel: "Percentage",
    footerPrompt: "Answer all 10 questions and press 'Check Answers'!",
    excellentFeedback: "🎯 Excellent!",
    explainFeedback: "💡 Explanation:",
    tableColItem: "Item",
    tableColFormula: "Analysis / Formula",
    tableColVal: "Value"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const initAmount = 15;
      const step = 4;
      const weeks = randInt(18, 25);
      const totalAmount = initAmount + weeks * step;
      const correctText = `${totalAmount} €`;

      return {
        title: isEn ? 'Piggy Bank Savings' : 'Αποταμίευση στον Κουμπαρά',
        prompt: isEn
          ? `Nikos started saving with ${initAmount} € in his piggy bank. Each week he steadily adds ${step} €. How much money will he have accumulated by the end of week ${weeks}?`
          : `Ο Νίκος ξεκίνησε να αποταμιεύει έχοντας στον κουμπαρά του ${initAmount} €. Κάθε εβδομάδα προσθέτει σταθερά ${step} €. Πόσα χρήματα θα έχει συγκεντρώσει στο τέλος της ${weeks}ης εβδομάδας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Initial amount' : 'Αρχικό ποσό',
            formula: `${initAmount} €`,
            val: `${initAmount} €`
          },
          {
            item: isEn ? 'Weekly additions' : 'Εβδομαδιαίες προσθήκες',
            formula: `${weeks} · ${step} €`,
            val: `${weeks * step} €`
          },
          {
            item: isEn ? 'Total amount' : 'Συνολικό ποσό',
            formula: `${initAmount} ＋ ${weeks * step} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `In ${weeks} weeks he will add a total of ${weeks} · ${step} ＝ ${weeks * step} €. Together with initial savings: ${initAmount} ＋ ${weeks * step} ＝ ${totalAmount} €.`
              : `Σε ${weeks} εβδομάδες θα προσθέσει συνολικά ${weeks} · ${step} ＝ ${weeks * step} €. Μαζί με τα αρχικά χρήματα: ${initAmount} ＋ ${weeks * step} ＝ ${totalAmount} €.`}
          </span>
        ),
        distractors: [
          `${totalAmount + step} €`,
          `${totalAmount - step * 2} €`,
          `${weeks * step} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const a1 = 18;
      const diff = 3;
      const rowN = randInt(10, 16);
      const chairs = a1 + (rowN - 1) * diff;
      const correctText = isEn ? `${chairs} seats` : `${chairs} καθίσματα`;

      return {
        title: isEn ? 'Theater Row Seating' : 'Καθίσματα σε Σειρές Θεάτρου',
        prompt: isEn
          ? `In an outdoor amphitheater, row 1 has ${a1} seats. Each subsequent row has ${diff} more seats than the previous one. How many seats are in row ${rowN}?`
          : `Σε ένα υπαίθριο θέατρο, η 1η σειρά έχει ${a1} καθίσματα. Κάθε επόμενη σειρά έχει ${diff} περισσότερα καθίσματα από την προηγούμενη. Πόσα καθίσματα έχει η ${rowN}η σειρά;`,
        correctText,
        tableData: [
          {
            item: isEn ? '1st row (α₁)' : '1η σειρά (α₁)',
            formula: `${a1}`,
            val: `${a1}`
          },
          {
            item: isEn ? `Increments up to row ${rowN}` : `Αυξήσεις μέχρι τη σειρά ${rowN}`,
            formula: `(${rowN} － 1) · ${diff}`,
            val: `${(rowN - 1) * diff}`
          },
          {
            item: isEn ? `Seats in row ${rowN}` : `Καθίσματα σειράς ${rowN}`,
            formula: `${a1} ＋ ${(rowN - 1) * diff}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Between row 1 and row ${rowN} there are ${rowN - 1} increments of ${diff} seats. Total increment: (${rowN} － 1) · ${diff} ＝ ${(rowN - 1) * diff}. Thus row ${rowN} has: ${a1} ＋ ${(rowN - 1) * diff} ＝ ${chairs} seats.`
              : `Από την 1η έως τη ${rowN}η σειρά μεσολαβούν ${rowN - 1} αυξήσεις των ${diff} καθισμάτων. Συνολική αύξηση: (${rowN} － 1) · ${diff} ＝ ${(rowN - 1) * diff}. Άρα η ${rowN}η σειρά έχει: ${a1} ＋ ${(rowN - 1) * diff} ＝ ${chairs} καθίσματα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${chairs + diff} seats`,
              `${a1 + rowN * diff} seats`,
              `${Math.max(a1, chairs - diff)} seats`
            ]
          : [
              `${chairs + diff} καθίσματα`,
              `${a1 + rowN * diff} καθίσματα`,
              `${Math.max(a1, chairs - diff)} καθίσματα`
            ]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sections = randInt(15, 35);
      const posts = sections + 1;
      const correctText = isEn ? `${posts} fence posts` : `${posts} παλούκια`;

      return {
        title: isEn ? 'Fence Post Construction' : 'Κατασκευή Φράχτη με Παλούκια',
        prompt: isEn
          ? `In a straight wooden fence, building 1 section requires 2 posts. Each subsequent connected section requires 1 additional post. How many posts are needed for a fence with ${sections} connected sections?`
          : `Σε έναν ευθύγραμμο ξύλινο φράχτη, για να φτιαχτεί 1 τμήμα χρειάζονται 2 παλούκια. Για κάθε επόμενο συνεχόμενο τμήμα χρειάζεται 1 επιπλέον παλούκι. Πόσα παλούκια θα χρειαστούν για έναν φράχτη με ${sections} συνεχόμενα τμήματα;`,
        correctText,
        tableData: [
          {
            item: isEn ? '1st section' : '1ο τμήμα',
            formula: isEn ? '2 posts' : '2 παλούκια',
            val: '2'
          },
          {
            item: isEn ? 'Additional sections' : 'Επιπλέον τμήματα',
            formula: `(${sections} － 1) · 1`,
            val: `${sections - 1}`
          },
          {
            item: isEn ? 'Total posts' : 'Σύνολο παλουκιών',
            formula: `${sections} ＋ 1`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `For n connected sections in a straight line, the required posts are always n ＋ 1. For ${sections} sections: ${sections} ＋ 1 ＝ ${posts} posts.`
              : `Για n συνεχόμενα τμήματα σε ευθεία γραμμή, τα παλούκια είναι πάντα n ＋ 1. Για ${sections} τμήματα: ${sections} ＋ 1 ＝ ${posts} παλούκια.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${sections * 2} fence posts`,
              `${sections} fence posts`,
              `${posts + 2} fence posts`
            ]
          : [
              `${sections * 2} παλούκια`,
              `${sections} παλούκια`,
              `${posts + 2} παλούκια`
            ]
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const trees = randInt(8, 14);
      const dist = randInt(4, 6);
      const totalDist = (trees - 1) * dist;
      const correctText = isEn ? `${totalDist} meters` : `${totalDist} μέτρα`;

      return {
        title: isEn ? 'Trees Along a Row' : 'Δέντρα σε Δενδροστοιχία',
        prompt: isEn
          ? `${trees} trees are planted in a straight line. The distance between two consecutive trees is consistently ${dist} meters. What is the total distance from the 1st to the last tree?`
          : `Φυτεύονται ${trees} δέντρα σε ευθεία γραμμή. Η απόσταση ανάμεσα σε δύο διαδοχικά δέντρα είναι σταθερά ${dist} μέτρα. Πόση είναι η συνολική απόσταση από το 1ο έως το τελευταίο δέντρο;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Tree count' : 'Πλήθος δέντρων',
            formula: `${trees}`,
            val: `${trees}`
          },
          {
            item: isEn ? 'Interval count' : 'Πλήθος ενδιάμεσων διαστημάτων',
            formula: `${trees} － 1`,
            val: `${trees - 1}`
          },
          {
            item: isEn ? 'Total distance' : 'Συνολικό μήκος',
            formula: `(${trees} － 1) · ${dist} m`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Between ${trees} trees there are ${trees - 1} intervals (not ${trees}!). Total distance: (${trees} － 1) · ${dist} ＝ ${totalDist} meters.`
              : `Ανάμεσα σε ${trees} δέντρα υπάρχουν ${trees - 1} διαστήματα (και όχι ${trees}!). Συνολική απόσταση: (${trees} － 1) · ${dist} ＝ ${totalDist} μέτρα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${trees * dist} meters`,
              `${totalDist + dist} meters`,
              `${Math.max(dist, totalDist - dist)} meters`
            ]
          : [
              `${trees * dist} μέτρα`,
              `${totalDist + dist} μέτρα`,
              `${Math.max(dist, totalDist - dist)} μέτρα`
            ]
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const d = randInt(6, 10);
      const startP = 12;
      const stepP = 5;
      const pages = startP + (d - 1) * stepP;
      const correctText = isEn ? `${pages} pages` : `${pages} σελίδες`;

      return {
        title: isEn ? 'Daily Reading Progress' : 'Σελίδες Βιβλίου ανά Ημέρα',
        prompt: isEn
          ? `A student is reading a book: on day 1 they read ${startP} pages, and each subsequent day they read ${stepP} pages more than the day before. How many pages will they read on day ${d}?`
          : `Ένας μαθητής διαβάζει ένα βιβλίο: την 1η ημέρα διαβάζει ${startP} σελίδες και κάθε επόμενη ημέρα διαβάζει ${stepP} σελίδες περισσότερες από την προηγούμενη. Πόσες σελίδες θα διαβάσει την ${d}η ημέρα;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Day 1 (α₁)' : '1η ημέρα (α₁)',
            formula: `${startP}`,
            val: `${startP}`
          },
          {
            item: isEn ? `Increments in ${d} days` : `Αυξήσεις σε ${d} ημέρες`,
            formula: `(${d} － 1) · ${stepP}`,
            val: `${(d - 1) * stepP}`
          },
          {
            item: isEn ? `Pages on day ${d}` : `Σελίδες ${d}ης ημέρας`,
            formula: `${startP} ＋ ${(d - 1) * stepP}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `By day ${d}, ${d - 1} increments of ${stepP} pages have occurred: (${d} － 1) · ${stepP} ＝ ${(d - 1) * stepP} pages. Total: ${startP} ＋ ${(d - 1) * stepP} ＝ ${pages} pages.`
              : `Την ${d}η ημέρα έχουν προστεθεί ${d - 1} αυξήσεις των ${stepP} σελίδων: (${d} － 1) · ${stepP} ＝ ${(d - 1) * stepP} σελίδες. Σύνολο: ${startP} ＋ ${(d - 1) * stepP} ＝ ${pages} σελίδες.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${startP + d * stepP} pages`,
              `${pages + stepP} pages`,
              `${Math.max(startP, pages - stepP)} pages`
            ]
          : [
              `${startP + d * stepP} σελίδες`,
              `${pages + stepP} σελίδες`,
              `${Math.max(startP, pages - stepP)} σελίδες`
            ]
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(7, 14);
      const bricks = 3 * n;
      const correctText = isEn ? `${bricks} bricks` : `${bricks} τούβλα`;

      return {
        title: isEn ? 'Staircase Steps with Bricks' : 'Βαθμίδες Σκάλας με Τούβλα',
        prompt: isEn
          ? `In a brick staircase, step 1 requires 3 bricks, step 2 requires 6 bricks, step 3 requires 9 bricks (multiples of 3). How many bricks are needed to construct step ${n}?`
          : `Σε μια κτιστή σκάλα, το 1ο σκαλοπάτι χρειάζεται 3 τούβλα, το 2ο σκαλοπάτι 6 τούβλα, το 3ο σκαλοπάτι 9 τούβλα (πολλαπλάσια του 3). Πόσα τούβλα χρειάζονται για να κατασκευαστεί το ${n}ο σκαλοπάτι;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Rule for step n' : 'Κανόνας βαθμίδας n',
            formula: '3 · n',
            val: `3 · ${n}`
          },
          {
            item: isEn ? `Bricks for n ＝ ${n}` : `Τούβλα για n ＝ ${n}`,
            formula: `3 · ${n}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The pattern follows the multiples of 3: 3 · n. For n ＝ ${n}: 3 · ${n} ＝ ${bricks} bricks.`
              : `Το μοτίβο ακολουθεί τον κανόνα των πολλαπλασίων του 3: 3 · n. Για n ＝ ${n}: 3 · ${n} ＝ ${bricks} τούβλα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${bricks + 3} bricks`,
              `${Math.max(3, bricks - 3)} bricks`,
              `${n * 4} bricks`
            ]
          : [
              `${bricks + 3} τούβλα`,
              `${Math.max(3, bricks - 3)} τούβλα`,
              `${n * 4} τούβλα`
            ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(15, 25);
      const targetVal = 4 * n + 3;
      const correctText = isEn ? `At position n ＝ ${n}` : `Στη θέση ν ＝ ${n}`;

      return {
        title: isEn ? 'Finding the Position Term' : 'Εύρεση Αριθμού Θέσης (Ποιο ν δίνει το αποτέλεσμα;)',
        prompt: isEn
          ? `An arithmetic sequence has the general formula: Value ＝ 4 · n ＋ 3. At which position (n) does the number ${targetVal} appear?`
          : `Μια αριθμητική ακολουθία έχει γενικό τύπο: Τιμή ＝ 4 · ν ＋ 3. Σε ποια θέση (ν) της ακολουθίας βρίσκεται ο αριθμός ${targetVal};`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Sequence equation' : 'Εξίσωση μοτίβου',
            formula: isEn ? `4 · n ＋ 3 ＝ ${targetVal}` : `4 · ν ＋ 3 ＝ ${targetVal}`,
            val: isEn ? `4 · n ＝ ${targetVal} － 3` : `4 · ν ＝ ${targetVal} － 3`
          },
          {
            item: isEn ? 'Step 1 (subtraction)' : '1ο βήμα (αφαίρεση)',
            formula: `${targetVal} － 3`,
            val: `${targetVal - 3}`
          },
          {
            item: isEn ? 'Step 2 (division)' : '2ο βήμα (διαίρεση)',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={`${targetVal - 3}`} den="4" />
                <span className="ml-1">＝ {n}</span>
              </span>
            ),
            val: isEn ? `n ＝ ${n}` : `ν ＝ ${n}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Solving the equation: 4 · n ＋ 3 ＝ ${targetVal} ➔ 4 · n ＝ ${targetVal} － 3 ＝ ${targetVal - 3} ➔ n ＝ `
              : `Λύνουμε την εξίσωση: 4 · ν ＋ 3 ＝ ${targetVal} ➔ 4 · ν ＝ ${targetVal} － 3 ＝ ${targetVal - 3} ➔ ν ＝ `}
            <Fraction num={`${targetVal - 3}`} den="4" />
            {isEn
              ? ` ＝ ${n}. Therefore, it is at position n ＝ ${n}.`
              : ` ＝ ${n}. Άρα βρίσκεται στη θέση ν ＝ ${n}.`}
          </span>
        ),
        distractors: isEn
          ? [
              `At position n ＝ ${n + 1}`,
              `At position n ＝ ${n - 1}`,
              `At position n ＝ ${n + 4}`
            ]
          : [
              `Στη θέση ν ＝ ${n + 1}`,
              `Στη θέση ν ＝ ${n - 1}`,
              `Στη θέση ν ＝ ${n + 4}`
            ]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const h = 4;
      const initB = 5;
      const finalB = initB * Math.pow(2, h);
      const correctText = isEn ? `${finalB} bacteria` : `${finalB} βακτήρια`;

      return {
        title: isEn ? 'Bacterial Doubling Pattern' : 'Μοτίβο Διπλασιασμού σε Βακτήρια',
        prompt: isEn
          ? `In a laboratory there are initially ${initB} bacteria. Their population doubles every hour (1st hour: 10, 2nd hour: 20, etc.). How many bacteria will be present after ${h} hours?`
          : `Σε ένα εργαστήριο υπάρχουν αρχικά ${initB} βακτήρια. Ο πληθυσμός τους διπλασιάζεται κάθε ώρα (1η ώρα: 10, 2η ώρα: 20, κ.ο.κ.). Πόσα βακτήρια θα υπάρχουν μετά από ${h} ώρες;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Initial count' : 'Αρχικός αριθμός',
            formula: `${initB}`,
            val: `${initB}`
          },
          {
            item: isEn ? 'Hourly rule' : 'Κανόνας ανά ώρα',
            formula: '· 2',
            valNode: (
              <span>
                5 · 2<sup>4</sup>
              </span>
            )
          },
          {
            item: isEn ? '4th hour calculation' : 'Υπολογισμός 4ης ώρας',
            formula: '5 · 16',
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? 'Each hour the population doubles: 1st: 10, 2nd: 20, 3rd: 40, 4th: 80 bacteria (5 · 2⁴ ＝ 5 · 16 ＝ ' +
                finalB +
                ').'
              : 'Σε κάθε ώρα ο πληθυσμός διπλασιάζεται: 1η ώρα: 10, 2η ώρα: 20, 3η ώρα: 40, 4η ώρα: 80 βακτήρια (5 · 2⁴ ＝ 5 · 16 ＝ ' +
                finalB +
                ').'}
          </span>
        ),
        distractors: isEn
          ? [
              `${Math.round(finalB / 2)} bacteria`,
              `${finalB + 20} bacteria`,
              `${initB + h * 2} bacteria`
            ]
          : [
              `${Math.round(finalB / 2)} βακτήρια`,
              `${finalB + 20} βακτήρια`,
              `${initB + h * 2} βακτήρια`
            ]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = 50;
      const term50 = 2 * n + 5;
      const correctText = String(term50);

      return {
        title: isEn ? 'Compound Rule (2n ＋ 5)' : 'Σύνθετος Κανόνας (2ν ＋ 5)',
        prompt: isEn
          ? 'Given the arithmetic sequence: 7, 9, 11, 13, 15, ... What is the 50th term (n ＝ 50) of the sequence?'
          : 'Δίνεται η αριθμητική ακολουθία: 7, 9, 11, 13, 15, ... Ποιος είναι ο 50ός όρος (ν ＝ 50) της ακολουθίας;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Sequence step' : 'Βήμα ακολουθίας',
            formula: '9 － 7 ＝ 2',
            val: '＋ 2'
          },
          {
            item: isEn ? 'General formula' : 'Γενικός τύπος',
            formula: isEn ? '2 · n ＋ 5' : '2 · ν ＋ 5',
            val: isEn ? 'For n ＝ 1: 2 · 1 ＋ 5 ＝ 7' : 'Για ν ＝ 1: 2 · 1 ＋ 5 ＝ 7'
          },
          {
            item: isEn ? 'Calculation for n ＝ 50' : 'Υπολογισμός για ν ＝ 50',
            formula: '(2 · 50) ＋ 5',
            val: `${term50}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The step is ＋2. The general rule is 2 · n ＋ 5. For n ＝ 50: (2 · 50) ＋ 5 ＝ 100 ＋ 5 ＝ ${term50}.`
              : `Το βήμα είναι ＋2. Ο γενικός κανόνας είναι 2 · ν ＋ 5. Για ν ＝ 50: (2 · 50) ＋ 5 ＝ 100 ＋ 5 ＝ ${term50}.`}
          </span>
        ),
        distractors: [
          String(term50 + 2),
          String(term50 - 2),
          '100'
        ]
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const correctText = isEn ? '3 · n ＋ 2' : '3 · ν ＋ 2';

      return {
        title: isEn ? 'Deducing Hidden Formula from Table' : 'Εύρεση του Κρυμμένου Κανόνα από Πίνακα',
        prompt: isEn
          ? 'Observe the values: for position n ＝ 1 the value is 5, for n ＝ 2 it is 8, for n ＝ 3 it is 11, for n ＝ 4 it is 14. What is the mathematical rule connecting position n with value?'
          : 'Παρατήρησε τις τιμές: για θέση ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 8, για ν ＝ 3 είναι 11, για ν ＝ 4 είναι 14. Ποιος είναι ο μαθηματικός κανόνας που συνδέει τη θέση ν με την τιμή;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Consecutive difference' : 'Διαφορά διαδοχικών όρων',
            formula: '8 － 5 ＝ 3, 11 － 8 ＝ 3',
            val: isEn ? 'Step is 3 (3 · n)' : 'Το βήμα είναι 3 (3 · ν)'
          },
          {
            item: isEn ? 'Check for n ＝ 1' : 'Έλεγχος για ν ＝ 1',
            formula: '3 · 1 ＋ ? ＝ 5',
            val: '? ＝ 2'
          },
          {
            item: isEn ? 'General formula' : 'Γενικός τύπος',
            formula: correctText,
            val: isEn ? 'Holds for all n' : 'Ισχύει για όλα τα ν'
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Because values increase by 3 each step, the formula contains 3 · n. For n ＝ 1: 3 · 1 ＋ 2 ＝ 5. Thus the rule is ${correctText}.`
              : `Επειδή οι τιμές αυξάνονται κατά 3 σε κάθε βήμα, ο τύπος περιέχει το 3 · ν. Για ν ＝ 1: 3 · 1 ＋ 2 ＝ 5. Άρα ο κανόνας είναι ${correctText}.`}
          </span>
        ),
        distractors: isEn
          ? ['3 · n ＋ 1', '2 · n ＋ 3', '4 · n ＋ 1']
          : ['3 · ν ＋ 1', '2 · ν ＋ 3', '4 · ν ＋ 1']
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const a1 = 100;
      const step = 7;
      const n = 11;
      const termN = a1 - (n - 1) * step;
      const correctText = String(termN);

      return {
        title: isEn ? 'Decreasing Arithmetic Sequence' : 'Φθίνουσα Αριθμητική Ακολουθία',
        prompt: isEn
          ? `Given the decreasing sequence: 100, 93, 86, 79, ... What is the 11th term (n ＝ 11) of the sequence?`
          : `Δίνεται η φθίνουσα ακολουθία: 100, 93, 86, 79, ... Ποιος είναι ο 11ος όρος (ν ＝ 11) της ακολουθίας;`,
        correctText,
        tableData: [
          {
            item: isEn ? '1st term (α₁)' : '1ος όρος (α₁)',
            formula: `${a1}`,
            val: `${a1}`
          },
          {
            item: isEn ? 'Step difference' : 'Βήμα αφαίρεσης',
            formula: '93 － 100',
            val: '－ 7'
          },
          {
            item: isEn ? '11th term calculation' : 'Υπολογισμός 11ου όρου',
            formula: `100 － (10 · 7)`,
            val: `${termN}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `At each step we subtract 7. By the 11th term we subtract 10 times 7: 10 · 7 ＝ 70. Thus: 100 － 70 ＝ ${termN}.`
              : `Σε κάθε βήμα αφαιρούμε 7. Μέχρι τον 11ο όρο θα αφαιρέσουμε 10 φορές το 7: 10 · 7 ＝ 70. Άρα: 100 － 70 ＝ ${termN}.`}
          </span>
        ),
        distractors: [
          String(termN + 7),
          String(termN - 7),
          '23'
        ]
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(10, 15);
      const sumOdd = n * n;
      const correctText = String(sumOdd);

      return {
        title: isEn
          ? 'Sum of First n Odd Numbers'
          : 'Άθροισμα των Πρώτων ν Περιττών Αριθμών',
        prompt: isEn
          ? `The sum of the first n odd numbers always equals n² (e.g., 1 ＋ 3 ＝ 4 ＝ 2², 1 ＋ 3 ＋ 5 ＝ 9 ＝ 3²). What is the sum of the first ${n} odd numbers?`
          : `Το άθροισμα των πρώτων ν περιττών αριθμών ισούται πάντα με ν² (π.χ. 1 ＋ 3 ＝ 4 ＝ 2², 1 ＋ 3 ＋ 5 ＝ 9 ＝ 3²). Πόσο ισούται το άθροισμα των πρώτων ${n} περιττών αριθμών;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Odd count (n)' : 'Πλήθος περιττών (ν)',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: isEn ? 'Mathematical theorem' : 'Μαθηματικό θεώρημα',
            formula: isEn ? 'n · n' : 'ν · ν',
            val: `${n} · ${n}`
          },
          {
            item: isEn ? 'Sum' : 'Άθροισμα',
            formulaNode: (
              <span>
                {n}<sup>2</sup>
              </span>
            ),
            val: `${sumOdd}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The sum of the first ${n} odd numbers equals ${n} · ${n} ＝ ${sumOdd}.`
              : `Το άθροισμα των πρώτων ${n} περιττών αριθμών ισούται με ${n} · ${n} ＝ ${sumOdd}.`}
          </span>
        ),
        distractors: [
          String(sumOdd + n),
          String(sumOdd - n),
          String(n * 2)
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Αύξουσα ακολουθία με σταθερό βήμα
  const q1Start = randInt(2, 7);
  const q1Step = randInt(3, 6);
  const q1A = q1Start;
  const q1B = q1A + q1Step;
  const q1C = q1B + q1Step;
  const q1D = q1C + q1Step;
  const q1Next = q1D + q1Step;

  // Q2: Input - Φθίνουσα ακολουθία με σταθερό βήμα
  const q2Start = randInt(60, 90);
  const q2Step = randInt(4, 7);
  const q2A = q2Start;
  const q2B = q2A - q2Step;
  const q2C = q2B - q2Step;
  const q2D = q2C - q2Step;
  const q2Next = q2D - q2Step;

  // Q3: Input - Υπολογισμός όρου από τύπο 5ν - 2
  const q3N = randInt(6, 12);
  const q3Res = 5 * q3N - 2;

  // Q4: MCQ - Διπλασιασμός (γεωμετρική ακολουθία)
  const q4Start = randInt(2, 4);
  const q4Terms = [q4Start, q4Start * 2, q4Start * 4, q4Start * 8];
  const q4Next = q4Start * 16;
  const q4Distractors = [
    String(q4Terms[3] + q4Terms[2]),
    String(q4Next + 4),
    String(q4Terms[3] * 3)
  ];
  const q4Options = makeUniqueOptions(String(q4Next), q4Distractors);

  // Q5: True/False - Έννοια όρου ακολουθίας
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? 'In an arithmetic sequence, each number is called a term and its position index is usually denoted by n.'
        : 'In an arithmetic sequence, a term refers solely to the sum of all numbers together.')
    : (q5IsTrue
        ? 'Σε μια αριθμητική ακολουθία, κάθε αριθμός ονομάζεται όρος της ακολουθίας και η θέση του συμβολίζεται συνήθως με ν.'
        : 'Σε μια αριθμητική ακολουθία, όρος ονομάζεται μόνο το άθροισμα όλων των αριθμών μαζί.');

  // Q6: True/False - Εύρεση σταθερού βήματος
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'To find the constant step in an arithmetic sequence, we simply subtract two consecutive terms: (2nd term) － (1st term).'
        : 'In an arithmetic sequence, the constant step is always calculated by multiplying the 1st term by the 2nd term.')
    : (q6IsTrue
        ? 'Για να βρούμε το σταθερό βήμα σε μια αριθμητική ακολουθία, αρκεί να αφαιρέσουμε δύο διαδοχικούς όρους: (2ος όρος) － (1ος όρος).'
        : 'Σε μια αριθμητική ακολουθία, το σταθερό βήμα υπολογίζεται πάντα πολλαπλασιάζοντας τον 1ο με τον 2ο όρο.');

  // Q7: Input - Υπολογισμός 20ού όρου σε ακολουθία πολλαπλασίων
  const q7Mult = randInt(3, 7);
  const q7Res = q7Mult * 20;

  // Q8: MCQ - Ακολουθία Fibonacci
  const q8Correct = isEn
    ? 'Each term is obtained from the sum of the two immediately preceding terms'
    : 'Κάθε όρος προκύπτει από το άθροισμα των δύο αμέσως προηγούμενων όρων';
  const q8Distractors = isEn
    ? [
        'At each step we steadily add the number 10',
        'Each term doubles compared to the previous one',
        'All terms of the sequence are always identical to each other'
      ]
    : [
        'Σε κάθε βήμα προσθέτουμε σταθερά τον αριθμό 10',
        'Κάθε όρος διπλασιάζεται σε σχέση με τον προηγούμενο',
        'Όλοι οι όροι της ακολουθίας είναι πάντα ίσοι μεταξύ τους'
      ];
  const q8Options = makeUniqueOptions(q8Correct, q8Distractors);

  // Q9: Standard Problem
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = makeUniqueOptions(q9Raw.correctText, q9Raw.distractors);

  // Q10: Hard Problem
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = makeUniqueOptions(q10Raw.correctText, q10Raw.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Next Term in Ascending Sequence' : 'Επόμενος Όρος Αύξουσας Ακολουθίας',
      prompt: isEn
        ? `Find the next term of the sequence: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`
        : `Βρες τον επόμενο όρο της ακολουθίας: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`,
      correct: String(q1Next),
      explain: (
        <span>
          {isEn
            ? `The sequence has a constant step of ＋${q1Step}. Thus the next term is: ${q1D} ＋ ${q1Step} ＝ ${q1Next}.`
            : `Η ακολουθία έχει σταθερό βήμα ＋${q1Step}. Άρα ο επόμενος όρος είναι: ${q1D} ＋ ${q1Step} ＝ ${q1Next}.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Next Term in Descending Sequence' : 'Επόμενος Όρος Φθίνουσας Ακολουθίας',
      prompt: isEn
        ? `Find the next term of the sequence: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`
        : `Βρες τον επόμενο όρο της ακολουθίας: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`,
      correct: String(q2Next),
      explain: (
        <span>
          {isEn
            ? `The sequence decreases by ${q2Step} at each step (－${q2Step}). Thus: ${q2D} － ${q2Step} ＝ ${q2Next}.`
            : `Η ακολουθία μειώνεται κατά ${q2Step} σε κάθε βήμα (－${q2Step}). Άρα: ${q2D} － ${q2Step} ＝ ${q2Next}.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Calculating Term from General Formula' : 'Υπολογισμός Όρου από Γενικό Τύπο',
      prompt: isEn
        ? `An arithmetic pattern has the general formula: Value ＝ 5 · n － 2. What is the ${q3N}th term (for n ＝ ${q3N})?`
        : `Ένα αριθμητικό μοτίβο έχει γενικό τύπο: Τιμή ＝ 5 · ν － 2. Ποιος είναι ο ${q3N}ος όρος (για ν ＝ ${q3N});`,
      correct: String(q3Res),
      explain: (
        <span>
          {isEn
            ? `Substitute n ＝ ${q3N}: (5 · ${q3N}) － 2 ＝ ${5 * q3N} － 2 ＝ ${q3Res}.`
            : `Αντικαθιστούμε ν ＝ ${q3N}: (5 · ${q3N}) － 2 ＝ ${5 * q3N} － 2 ＝ ${q3Res}.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Doubling Sequence' : 'Ακολουθία με Διπλασιασμό',
      prompt: isEn
        ? `What is the next term in the sequence: ${q4Terms.join(', ')}, ...?`
        : `Ποιος είναι ο επόμενος όρος της ακολουθίας: ${q4Terms.join(', ')}, ...;`,
      options: q4Options,
      correct: String(q4Next),
      explain: (
        <span>
          {isEn
            ? `Each term is double the previous term (· 2). Thus: ${q4Terms[3]} · 2 ＝ ${q4Next}.`
            : `Κάθε όρος είναι διπλάσιος από τον προηγούμενο (· 2). Άρα: ${q4Terms[3]} · 2 ＝ ${q4Next}.`}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Definition of a Sequence Term' : 'Έννοια Όρου Ακολουθίας',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {isEn
            ? (q5IsTrue
                ? 'Correct! Each number in a sequence is called a term, and its position index is denoted by n (1st, 2nd, ... nth).'
                : 'False! Each individual number in the sequence is called a term, not their sum.')
            : (q5IsTrue
                ? 'Σωστά! Κάθε αριθμός σε μια ακολουθία ονομάζεται όρος και η θέση του δηλώνεται με τον δείκτη ν (1ος, 2ος, ... ν-οστός).'
                : 'Λάθος! Κάθε μεμονωμένος αριθμός της ακολουθίας ονομάζεται όρος, όχι το άθροισμά τους.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Determining the Constant Step' : 'Εύρεση Σταθερού Βήματος',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {isEn
            ? (q6IsTrue
                ? 'Correct! Subtracting any term from the one that follows reveals the constant step of the arithmetic sequence.'
                : 'False! The constant step is found by subtracting two consecutive terms: (2nd term) － (1st term).')
            : (q6IsTrue
                ? 'Σωστά! Αφαιρώντας οποιονδήποτε όρο από τον επόμενό του βρίσκουμε το σταθερό βήμα της αριθμητικής ακολουθίας.'
                : 'Λάθος! Το σταθερό βήμα βρίσκεται με αφαίρεση δύο διαδοχικών όρων: (2ος όρος) － (1ος όρος).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Calculating 20th Term' : 'Υπολογισμός 20ού Όρου',
      prompt: isEn
        ? `In the sequence of multiples of ${q7Mult}: ${q7Mult}, ${q7Mult * 2}, ${q7Mult * 3}, ${q7Mult * 4}, ... what is the 20th term (n ＝ 20)?`
        : `Στην ακολουθία των πολλαπλασίων του ${q7Mult}: ${q7Mult}, ${q7Mult * 2}, ${q7Mult * 3}, ${q7Mult * 4}, ... ποιος είναι ο 20ός όρος (ν ＝ 20);`,
      correct: String(q7Res),
      explain: (
        <span>
          {isEn
            ? `The rule is ${q7Mult} · n. For the 20th term: ${q7Mult} · 20 ＝ ${q7Res}.`
            : `Ο κανόνας είναι ${q7Mult} · ν. Για τον 20ό όρο: ${q7Mult} · 20 ＝ ${q7Res}.`}
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'Fibonacci Sequence Rule' : 'Κανόνας της Ακολουθίας Fibonacci',
      prompt: isEn
        ? 'What is the characteristic formation rule of the Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, ...)?'
        : 'Ποιος είναι ο χαρακτηριστικός κανόνας σχηματισμού της ακολουθίας Fibonacci (1, 1, 2, 3, 5, 8, 13, ...);',
      options: q8Options,
      correct: q8Correct,
      explain: (
        <span>
          {isEn
            ? 'In the Fibonacci sequence, each number is the sum of the previous two: e.g. 1 ＋ 1 ＝ 2, 1 ＋ 2 ＝ 3, 2 ＋ 3 ＝ 5, 3 ＋ 5 ＝ 8, etc.'
            : 'Στην ακολουθία Fibonacci, κάθε αριθμός είναι το άθροισμα των δύο προηγούμενων: π.χ. 1 ＋ 1 ＝ 2, 1 ＋ 2 ＝ 3, 2 ＋ 3 ＝ 5, 3 ＋ 5 ＝ 8 κ.ο.κ.'}
        </span>
      )
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
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

export default function ArithmitikaMotibaExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = useMemo(() => I18N[locale] || I18N.el, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq/tf
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find((item) => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) {
          sanitized = parts[0] + ',' + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? String(q.altCorrect).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase() : null;
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
    questions.forEach((q) => {
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
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/64-arithmitika-motiba"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 min-w-0">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{toCleanUppercase(t.badgeHeader)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(
                    q
                  )}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? (
                        <span>«{q.text}»</span>
                      ) : (
                        <span>{q.prompt}</span>
                      )}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
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
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
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
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
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
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableColItem)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableColFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableColVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 break-words">
                                    {row.formulaNode || row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700 whitespace-nowrap">
                                    {row.valNode || row.val}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.excellentFeedback : t.explainFeedback}
                        </p>
                        <div>{q.explain}</div>
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>
                {submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:
              </span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentageLabel)}:{' '}
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
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}