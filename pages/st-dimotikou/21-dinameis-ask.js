// pages/st-dimotikou/21-dinameis-ask.js
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

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Μορφοποίηση αριθμών βάσει locale
function formatNum(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc);
}

// Helper για ασφαλή κατακόρυφη απόδοση κλασμάτων σε mobile/desktop
export const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

const EXPONENTS_UNICODE = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  10: '¹⁰'
};

// Εγγύηση 4 μοναδικών επιλογών για MCQ
function buildFourOptions(correct, distractors, fallbackFn) {
  const unique = new Set();
  if (correct !== undefined && correct !== null && String(correct).trim() !== '') {
    unique.add(String(correct));
  }

  for (const d of distractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '') {
      unique.add(String(d));
    }
    if (unique.size === 4) break;
  }

  let safety = 1;
  while (unique.size < 4 && safety < 30) {
    const candidate = fallbackFn ? fallbackFn(safety) : `Επιλογή ${safety}`;
    if (candidate !== undefined && candidate !== null && String(candidate).trim() !== '') {
      unique.add(String(candidate));
    }
    safety++;
  }

  return shuffle(Array.from(unique));
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις δυνάμεις φυσικών αριθμών, τα τετράγωνα και τους κύβους για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 21 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Δυνάμεις Φυσικών Αριθμών",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εμπεδώσεις τη βάση, τον εκθέτη, τα τετράγωνα, τους κύβους και τις εφαρμογές των δυνάμεων!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντησή σου...",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Τύπος / Ανάλυση",
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
    pageTitle: "Exercises: Powers of Natural Numbers - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on powers of natural numbers, squares, and cubes for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 21 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Powers of Natural Numbers",
    desc: "Solve the 10 dynamic questions to master bases, exponents, squares, cubes, and practical applications of powers!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Formula / Step",
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
      const sides = [6, 7, 8, 9, 11, 12];
      const a = sides[randInt(0, sides.length - 1)];
      const area = a * a;
      const unit = locale === 'en' ? 'sq.m.' : 'τ.μ.';
      const unitM = locale === 'en' ? 'm' : 'μ.';
      const correctText = `${a}² ＝ ${formatNum(area, locale)} ${unit}`;
      const distractors = [
        `${a} · 2 ＝ ${formatNum(a * 2, locale)} ${unit}`,
        `${a} · 4 ＝ ${formatNum(a * 4, locale)} ${unit}`,
        `${a}³ ＝ ${formatNum(a * a * a, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Square Flowerbed' : 'Τετράγωνο Παρτέρι Λουλουδιών',
        prompt: locale === 'en'
          ? `A square flowerbed in a park has a side length of ${a} meters. Which power expression represents its area and what is the final result?`
          : `Ένα τετράγωνο παρτέρι σε ένα πάρκο έχει μήκος πλευράς ${a} μέτρα. Ποια δύναμη εκφράζει το εμβαδόν του και ποιο είναι το τελικό αποτέλεσμα;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Side Length (a)' : 'Πλευρά Τετραγώνου (α)',
            formula: `${a} ${unitM}`,
            val: `${a} ${unitM}`
          },
          {
            item: locale === 'en' ? 'Area Formula' : 'Τύπος Εμβαδού',
            formula: 'Ε ＝ α · α ＝ α²',
            val: `${a}²`
          },
          {
            item: locale === 'en' ? 'Total Area' : 'Τελικό Εμβαδόν',
            formula: `${a} · ${a}`,
            val: `${formatNum(area, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `The area of a square equals side squared (a²): ${a}² ＝ ${a} · ${a} ＝ ${formatNum(area, locale)} ${unit}.`
          : `Το εμβαδόν τετραγώνου ισούται με την πλευρά υψωμένη στο τετράγωνο (α²): ${a}² ＝ ${a} · ${a} ＝ ${formatNum(area, locale)} ${unit}.`
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const edges = [3, 4, 5, 6];
      const a = edges[randInt(0, edges.length - 1)];
      const volume = a * a * a;
      const unit = locale === 'en' ? 'cu.m.' : 'κ.μ.';
      const unitM = locale === 'en' ? 'm' : 'μ.';
      const correctText = `${a}³ ＝ ${formatNum(volume, locale)} ${unit}`;
      const distractors = [
        `${a} · 3 ＝ ${formatNum(a * 3, locale)} ${unit}`,
        `${a}² ＝ ${formatNum(a * a, locale)} ${unit}`,
        `${a} · 6 ＝ ${formatNum(a * 6, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Cubic Storage Container' : 'Κυβικό Κουτί Αποθήκευσης',
        prompt: locale === 'en'
          ? `A storage container has the shape of a cube with an edge length of ${a} meters. Which power represents its volume and what is the total in cubic meters?`
          : `Ένα δοχείο αποθήκευσης έχει σχήμα κύβου με ακμή ${a} μέτρα. Ποια δύναμη εκφράζει τον όγκο του δοχείου και πόσο ισούται σε κυβικά μέτρα;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Cube Edge (a)' : 'Ακμή Κύβου (α)',
            formula: `${a} ${unitM}`,
            val: `${a} ${unitM}`
          },
          {
            item: locale === 'en' ? 'Volume Formula' : 'Τύπος Όγκου',
            formula: 'V ＝ α · α · α ＝ α³',
            val: `${a}³`
          },
          {
            item: locale === 'en' ? 'Total Volume' : 'Τελικός Όγκος',
            formula: `${a} · ${a} · ${a}`,
            val: `${formatNum(volume, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `The volume of a cube equals edge cubed (a³): ${a}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(volume, locale)} ${unit}.`
          : `Ο όγκος του κύβου ισούται με την ακμή του στον κύβο (α³): ${a}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(volume, locale)} ${unit}.`
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const rows = [7, 8, 9, 10, 12];
      const n = rows[randInt(0, rows.length - 1)];
      const total = n * n;
      const unit = locale === 'en' ? 'tiles' : 'ψηφίδες';
      const correctText = `${n}² ＝ ${formatNum(total, locale)} ${unit}`;
      const distractors = [
        `${n} · 2 ＝ ${formatNum(n * 2, locale)} ${unit}`,
        `${n} · 4 ＝ ${formatNum(n * 4, locale)} ${unit}`,
        `${n}³ ＝ ${formatNum(n * n * n, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Mosaic Tiling' : 'Ψηφιδωτό Δάπεδο',
        prompt: locale === 'en'
          ? `A craftsman is laying a square mosaic floor made of ${n} horizontal rows with ${n} tiles in each row. How many tiles will be needed in total?`
          : `Ένας τεχνίτης κατασκευάζει ένα τετράγωνο ψηφιδωτό που αποτελείται από ${n} οριζόντιες σειρές με ${n} ψηφίδες σε κάθε σειρά. Πόσες ψηφίδες θα χρειαστεί συνολικά;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Number of Rows' : 'Πλήθος Σειρών',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: locale === 'en' ? 'Tiles per Row' : 'Ψηφίδες ανά Σειρά',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: locale === 'en' ? 'Total Tiles' : 'Σύνολο Ψηφίδων',
            formula: `${n} · ${n} ＝ ${n}²`,
            val: `${formatNum(total, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `The tiles form a square grid: ${n} rows of ${n} tiles ＝ ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Οι ψηφίδες σχηματίζουν τετράγωνο πλέγμα: ${n} σειρές των ${n} ψηφίδων ＝ ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total, locale)} ${unit}.`
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const hours = [3, 4, 5, 6];
      const h = hours[randInt(0, hours.length - 1)];
      const count = Math.pow(2, h);
      const unit = locale === 'en' ? 'bacteria' : 'βακτήρια';
      const correctText = `2${EXPONENTS_UNICODE[h]} ＝ ${formatNum(count, locale)} ${unit}`;
      const distractors = [
        `2 · ${h} ＝ ${formatNum(2 * h, locale)} ${unit}`,
        `${h}² ＝ ${formatNum(h * h, locale)} ${unit}`,
        `2${EXPONENTS_UNICODE[h + 1]} ＝ ${formatNum(count * 2, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Bacterial Doubling in Lab' : 'Διπλασιασμός Βακτηρίων σε Εργαστήριο',
        prompt: locale === 'en'
          ? `In a culture, 1 initial bacterium doubles every hour (it becomes 2, then 4, then 8...). How many bacteria will exist after ${h} hours?`
          : `Σε μία καλλιέργεια, 1 αρχικό βακτήριο διπλασιάζεται κάθε ώρα (γίνεται 2, μετά 4, μετά 8...). Πόσα βακτήρια θα υπάρχουν μετά από ${h} ώρες;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Initial Population' : 'Αρχικός Πληθυσμός',
            formula: '1',
            val: '2⁰ ＝ 1'
          },
          {
            item: locale === 'en' ? 'Doubling Rate' : 'Ρυθμός Διπλασιασμού',
            formula: locale === 'en' ? 'Base 2' : 'Βάση 2',
            val: '2'
          },
          {
            item: locale === 'en' ? `Population after ${h} hours` : `Πληθυσμός σε ${h} ώρες`,
            formula: `2${EXPONENTS_UNICODE[h]}`,
            val: `${formatNum(count, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `Continuous doubling is represented as a power with base 2: 2${EXPONENTS_UNICODE[h]} ＝ ${Array(h).fill(2).join(' · ')} ＝ ${formatNum(count, locale)} ${unit}.`
          : `Ο συνεχής διπλασιασμός εκφράζεται ως δύναμη με βάση το 2: 2${EXPONENTS_UNICODE[h]} ＝ ${Array(h).fill(2).join(' · ')} ＝ ${formatNum(count, locale)} ${unit}.`
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const counts = [2, 3, 4];
      const n = counts[randInt(0, counts.length - 1)];
      const total = n * n * n;
      const unit = locale === 'en' ? 'boxes' : 'κουτιά';
      const correctText = `${n}³ ＝ ${formatNum(total, locale)} ${unit}`;
      const distractors = [
        `${n} · 3 ＝ ${formatNum(n * 3, locale)} ${unit}`,
        `${n}² ＝ ${formatNum(n * n, locale)} ${unit}`,
        `3${EXPONENTS_UNICODE[n]} ＝ ${formatNum(Math.pow(3, n), locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Packaging Cubic Boxes' : 'Συσκευασία Κυβικών Κουτιών',
        prompt: locale === 'en'
          ? `A large cubic crate fits ${n} small cubic boxes along its length, width, and height. How many small boxes does the crate hold in total?`
          : `Ένα μεγάλο κυβικό κιβώτιο χωράει κατά μήκος, πλάτος και ύψος από ${n} μικρά κυβικά κουτιά. Πόσα μικρά κουτιά περιέχει συνολικά το κιβώτιο;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Dimensions (L · W · H)' : 'Διαστάσεις (Μ · Π · Υ)',
            formula: `${n} · ${n} · ${n}`,
            val: `${n}³`
          },
          {
            item: locale === 'en' ? 'Total Boxes' : 'Συνολικά Κουτιά',
            formula: `${n} · ${n} · ${n}`,
            val: `${formatNum(total, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `Filling a cube across 3 dimensions gives ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Όταν γεμίζουμε έναν κύβο σε όλες τις διαστάσεις (μήκος, πλάτος, ύψος), το συνολικό πλήθος των κουτιών ισούται με ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total, locale)} κουτιά.`
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const lines = [10, 15, 20];
      const n = lines[randInt(0, lines.length - 1)];
      const total = n * n;
      const unit = locale === 'en' ? 'trees' : 'δέντρα';
      const correctText = `${n}² ＝ ${formatNum(total, locale)} ${unit}`;
      const distractors = [
        `${n} · 2 ＝ ${formatNum(n * 2, locale)} ${unit}`,
        `${n} · 4 ＝ ${formatNum(n * 4, locale)} ${unit}`,
        `${n}³ ＝ ${formatNum(n * n * n, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Square Olive Grove' : 'Τετραγωνικό Χωράφι με Ελιές',
        prompt: locale === 'en'
          ? `A farmer planted olive trees in a square arrangement with ${n} rows, where each row contains exactly ${n} trees. How many trees were planted in total?`
          : `Ένας αγρότης φύτεψε ελιές σε τετράγωνη διάταξη με ${n} σειρές, όπου κάθε σειρά έχει ακριβώς ${n} ελαιόδεντρα. Πόσα δέντρα φύτεψε συνολικά;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Rows' : 'Σειρές',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: locale === 'en' ? 'Trees per row' : 'Δέντρα ανά σειρά',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: locale === 'en' ? 'Total' : 'Σύνολο',
            formula: `${n} · ${n} ＝ ${n}²`,
            val: `${formatNum(total, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `The total number of trees is the square of the rows: ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Το πλήθος των δέντρων προκύπτει από το τετράγωνο του αριθμού των σειρών: ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total, locale)} δέντρα.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const rounds = [3, 4, 5];
      const r = rounds[randInt(0, rounds.length - 1)];
      const total = Math.pow(3, r);
      const unit = locale === 'en' ? 'people' : 'άτομα';
      const correctText = `3${EXPONENTS_UNICODE[r]} ＝ ${formatNum(total, locale)} ${unit}`;
      const prevPow = Math.pow(3, Math.max(1, r - 1));
      const distractors = [
        `3 · ${r} ＝ ${formatNum(3 * r, locale)} ${unit}`,
        `${r}³ ＝ ${formatNum(Math.pow(r, 3), locale)} ${unit}`,
        `3${EXPONENTS_UNICODE[Math.max(1, r - 1)]} ＝ ${formatNum(prevPow, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Viral Message Chain' : 'Αλυσίδα Μηνυμάτων (Εκθετική Διάδοση)',
        prompt: locale === 'en'
          ? `A message starts with 1 person. In each round, every recipient forwards it to 3 new people. How many new people receive the message in round ${r}?`
          : `Ένα μήνυμα ξεκινά από 1 άτομο. Σε κάθε γύρο, κάθε παραλήπτης το προωθεί σε 3 νέα άτομα. Πόσα νέα άτομα θα λάβουν το μήνυμα στον ${r}ο γύρο;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Round 1' : '1ος Γύρος',
            formula: '3¹',
            val: `3 ${unit}`
          },
          {
            item: locale === 'en' ? 'Round 2' : '2ος Γύρος',
            formula: '3²',
            val: `9 ${unit}`
          },
          {
            item: locale === 'en' ? `Round ${r}` : `${r}ος Γύρος`,
            formula: `3${EXPONENTS_UNICODE[r]}`,
            val: `${formatNum(total, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `In each round the recipient count triples (base 3). In round ${r}: 3${EXPONENTS_UNICODE[r]} ＝ ${Array(r).fill(3).join(' · ')} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Σε κάθε γύρο το πλήθος τριπλασιάζεται (βάση 3). Στον ${r}ο γύρο τα άτομα είναι 3${EXPONENTS_UNICODE[r]} ＝ ${Array(r).fill(3).join(' · ')} ＝ ${formatNum(total, locale)} άτομα.`
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const exps = [4, 5, 6];
      const e = exps[randInt(0, exps.length - 1)];
      const total = Math.pow(10, e);
      const unit = locale === 'en' ? 'requests' : 'αιτήματα';
      const correctText = `${formatNum(total, locale)} ${unit}`;
      const distractors = [
        `${formatNum(e * 10, locale)} ${unit}`,
        `${formatNum(Math.pow(10, e - 1), locale)} ${unit}`,
        `${formatNum(Math.pow(10, e + 1), locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Powers of 10 & Server Traffic' : 'Δυνάμεις του 10 και Μέτρηση Δεδομένων',
        prompt: locale === 'en'
          ? `A web server logs data at a rate of 10${EXPONENTS_UNICODE[e]} requests per hour. What is this value written in standard decimal notation?`
          : `Ένας διακομιστής καταγράφει δεδομένα με ρυθμό 10${EXPONENTS_UNICODE[e]} αιτημάτων ανά ώρα. Ποιος είναι ο ακριβής αριθμός των αιτημάτων σε κανονική αριθμητική γραφή;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Power' : 'Δύναμη',
            formula: `10${EXPONENTS_UNICODE[e]}`,
            val: locale === 'en' ? `Exponent ${e}` : `Εκθέτης ${e}`
          },
          {
            item: locale === 'en' ? 'Rule for Powers of 10' : 'Κανόνας Δυνάμεων του 10',
            formula: locale === 'en' ? `1 followed by ${e} zeros` : `1 ακολουθούμενο από ${e} μηδενικά`,
            val: `${formatNum(total, locale)}`
          }
        ],
        explain: locale === 'en'
          ? `For powers of 10, write 1 followed by as many zeros as indicated by the exponent: 10${EXPONENTS_UNICODE[e]} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Στις δυνάμεις με βάση το 10, γράφουμε το 1 και προσθέτουμε τόσα μηδενικά όσα δείχνει ο εκθέτης: 10${EXPONENTS_UNICODE[e]} ＝ ${formatNum(total, locale)} αιτήματα.`
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const folds = [5, 6, 7];
      const f = folds[randInt(0, folds.length - 1)];
      const layers = Math.pow(2, f);
      const unit = locale === 'en' ? 'layers' : 'στρώσεις';
      const correctText = `2${EXPONENTS_UNICODE[f]} ＝ ${formatNum(layers, locale)} ${unit}`;
      const distractors = [
        `2 · ${f} ＝ ${formatNum(2 * f, locale)} ${unit}`,
        `${f}² ＝ ${formatNum(f * f, locale)} ${unit}`,
        `2${EXPONENTS_UNICODE[f + 1]} ＝ ${formatNum(layers * 2, locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Folding Paper in Half' : 'Διπλωμένο Χαρτί στη Μέση',
        prompt: locale === 'en'
          ? `We take a large sheet of paper and fold it in half ${f} consecutive times. How many layers of paper will be created?`
          : `Παίρνουμε ένα μεγάλο φύλλο χαρτιού και το διπλώνουμε στη μέση ${f} συνεχόμενες φορές. Πόσες στρώσεις χαρτιού θα δημιουργηθούν συνολικά;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Fold 1' : '1ο Δίπλωμα',
            formula: '2¹',
            val: `2 ${unit}`
          },
          {
            item: locale === 'en' ? 'Fold 2' : '2ο Δίπλωμα',
            formula: '2²',
            val: `4 ${unit}`
          },
          {
            item: locale === 'en' ? `Fold ${f}` : `${f}ο Δίπλωμα`,
            formula: `2${EXPONENTS_UNICODE[f]}`,
            val: `${formatNum(layers, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `With each fold the number of layers doubles (power of 2): 2${EXPONENTS_UNICODE[f]} ＝ ${Array(f).fill(2).join(' · ')} ＝ ${formatNum(layers, locale)} ${unit}.`
          : `Σε κάθε δίπλωμα οι στρώσεις διπλασιάζονται (δύναμη του 2): 2${EXPONENTS_UNICODE[f]} ＝ ${Array(f).fill(2).join(' · ')} ＝ ${formatNum(layers, locale)} στρώσεις.`
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const pairs = [
        { b1: 2, e1: 5, v1: 32, b2: 5, e2: 2, v2: 25 },
        { b1: 3, e1: 4, v1: 81, b2: 4, e2: 3, v2: 64 },
        { b1: 2, e1: 6, v1: 64, b2: 6, e2: 2, v2: 36 }
      ];
      const p = pairs[randInt(0, pairs.length - 1)];
      const diff = p.v1 - p.v2;
      const unit = locale === 'en' ? 'units' : 'μονάδες';
      const correctText = `${diff} ${unit} (Α ＝ ${p.v1}, Β ＝ ${p.v2})`;
      const distractors = [
        `${diff + 5} ${unit} (Α ＝ ${p.v1 + 5}, Β ＝ ${p.v2})`,
        `${Math.max(1, diff - 7)} ${unit} (Α ＝ ${Math.max(1, p.v1 - 7)}, Β ＝ ${p.v2})`,
        locale === 'en' ? 'They are equal (0 units)' : 'Είναι ίσες (0 μονάδες)'
      ];
      return {
        title: locale === 'en' ? 'Comparing Power Magnitudes' : 'Σύγκριση Μεγέθους Δυνάμεων',
        prompt: locale === 'en'
          ? `Given powers A ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} and B ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]}, how much greater is power A than power B?`
          : `Δίνονται οι δυνάμεις Α ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} και Β ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]}. Πόσο μεγαλύτερη είναι η δύναμη Α από τη δύναμη Β;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Power A' : 'Δύναμη Α',
            formula: `${p.b1}${EXPONENTS_UNICODE[p.e1]}`,
            val: `${p.v1}`
          },
          {
            item: locale === 'en' ? 'Power B' : 'Δύναμη Β',
            formula: `${p.b2}${EXPONENTS_UNICODE[p.e2]}`,
            val: `${p.v2}`
          },
          {
            item: locale === 'en' ? 'Difference (A － B)' : 'Διαφορά (Α － Β)',
            formula: `${p.v1} － ${p.v2}`,
            val: `${diff}`
          }
        ],
        explain: locale === 'en'
          ? `Calculate each power: A ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} ＝ ${p.v1} and B ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]} ＝ ${p.v2}. Difference: ${p.v1} － ${p.v2} ＝ ${diff}.`
          : `Υπολογίζουμε χωριστά τις δύο δυνάμεις: Α ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} ＝ ${p.v1} και Β ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]} ＝ ${p.v2}. Η διαφορά τους είναι ${p.v1} － ${p.v2} ＝ ${diff}.`
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const sizes = [3, 4, 5];
      const n = sizes[randInt(0, sizes.length - 1)];
      const total = n * n * n;
      const unit = locale === 'en' ? 'small cubes' : 'κυβάκια';
      const correctText = `${n}³ ＝ ${formatNum(total, locale)} ${unit}`;
      const distractors = [
        `${n} · 3 ＝ ${formatNum(n * 3, locale)} ${unit}`,
        `${n}² ＝ ${formatNum(n * n, locale)} ${unit}`,
        `3${EXPONENTS_UNICODE[n]} ＝ ${formatNum(Math.pow(3, n), locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Assembling a 3D Cube' : 'Σύνθεση Κυβικών Κυβιδίων',
        prompt: locale === 'en'
          ? `A solid 3D cube consists of ${n} layers, where each layer has ${n} rows with ${n} small cubes. How many small cubes make up the whole cube?`
          : `Ένας τρισδιάστατος κύβος αποτελείται από ${n} στρώσεις, όπου κάθε στρώση περιλαμβάνει ${n} γραμμές με ${n} μικρά κυβάκια. Πόσα κυβάκια περιέχει ολόκληρος ο κύβος;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Cubes per layer' : 'Κυβάκια ανά στρώση',
            formula: `${n} · ${n} ＝ ${n}²`,
            val: `${n * n}`
          },
          {
            item: locale === 'en' ? 'Number of Layers' : 'Πλήθος Στρώσεων',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: locale === 'en' ? 'Total Cubes' : 'Συνολικός Αριθμός',
            formula: `${n}² · ${n} ＝ ${n}³`,
            val: `${formatNum(total, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `The total number of small cubes equals ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total, locale)} ${unit}.`
          : `Το συνολικό πλήθος των κύβων ισούται με ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total, locale)} κυβάκια.`
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const rounds = [3, 4, 5, 6];
      const r = rounds[randInt(0, rounds.length - 1)];
      const teams = Math.pow(2, r);
      const unit = locale === 'en' ? 'players' : 'παίκτες';
      const correctText = `2${EXPONENTS_UNICODE[r]} ＝ ${formatNum(teams, locale)} ${unit}`;
      const distractors = [
        `2 · ${r} ＝ ${formatNum(2 * r, locale)} ${unit}`,
        `${r}² ＝ ${formatNum(r * r, locale)} ${unit}`,
        `2${EXPONENTS_UNICODE[Math.max(1, r - 1)]} ＝ ${formatNum(Math.pow(2, Math.max(1, r - 1)), locale)} ${unit}`
      ];
      return {
        title: locale === 'en' ? 'Single Elimination Tournament' : 'Τουρνουά Αγώνων με Σύστημα Νοκ-Άουτ',
        prompt: locale === 'en'
          ? `In a tennis tournament, half the players are eliminated in each round. If a player must win exactly ${r} rounds to be crowned champion, how many players must enter the tournament?`
          : `Σε ένα πρωτάθλημα τένις, σε κάθε γύρο οι μισοί παίκτες αποκλείονται. Αν για να αναδειχθεί ο πρωταθλητής απαιτούνται ακριβώς ${r} νικηφόροι γύροι, πόσοι παίκτες πρέπει να ξεκινήσουν στο τουρνουά;`,
        correctText,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Final (1 round from end)' : 'Τελικός (1ος γύρος από το τέλος)',
            formula: '2¹',
            val: `2 ${unit}`
          },
          {
            item: locale === 'en' ? 'Semifinals' : 'Ημιτελικοί',
            formula: '2²',
            val: `4 ${unit}`
          },
          {
            item: locale === 'en' ? `Start (${r} rounds)` : `Έναρξη (${r} γύροι)`,
            formula: `2${EXPONENTS_UNICODE[r]}`,
            val: `${formatNum(teams, locale)} ${unit}`
          }
        ],
        explain: locale === 'en'
          ? `Each round doubles the required participants: for ${r} rounds we need 2${EXPONENTS_UNICODE[r]} ＝ ${formatNum(teams, locale)} ${unit}.`
          : `Κάθε γύρος διπλασιάζει τους απαιτούμενους συμμετέχοντες: για ${r} γύρους απαιτούνται 2${EXPONENTS_UNICODE[r]} ＝ ${formatNum(teams, locale)} παίκτες.`
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: MCQ - Μετατροπή γινομένου σε δύναμη
  const q1Pool = [
    { base: 3, count: 4, expr: '3 · 3 · 3 · 3', correct: '3⁴', wrong: ['3 · 4', '4³', '3⁵'] },
    { base: 5, count: 3, expr: '5 · 5 · 5', correct: '5³', wrong: ['5 · 3', '3⁵', '5⁴'] },
    { base: 2, count: 5, expr: '2 · 2 · 2 · 2 · 2', correct: '2⁵', wrong: ['2 · 5', '5²', '2⁶'] },
    { base: 7, count: 2, expr: '7 · 7', correct: '7²', wrong: ['7 · 2', '2⁷', '7³'] },
    { base: 4, count: 3, expr: '4 · 4 · 4', correct: '4³', wrong: ['4 · 3', '3⁴', '4⁴'] }
  ];
  const q1Data = q1Pool[randInt(0, q1Pool.length - 1)];
  const q1Options = buildFourOptions(q1Data.correct, q1Data.wrong, (k) => `${q1Data.base + k}²`);

  // Q2: Input - Υπολογισμός τετραγώνου ή κύβου
  const q2Pool = [
    { base: 4, exp: 2, val: 16 },
    { base: 6, exp: 2, val: 36 },
    { base: 7, exp: 2, val: 49 },
    { base: 8, exp: 2, val: 64 },
    { base: 9, exp: 2, val: 81 },
    { base: 2, exp: 3, val: 8 },
    { base: 3, exp: 3, val: 27 },
    { base: 4, exp: 3, val: 64 },
    { base: 5, exp: 3, val: 125 }
  ];
  const q2Data = q2Pool[randInt(0, q2Pool.length - 1)];
  const q2Explain = q2Data.exp === 2
    ? `${q2Data.base}² ＝ ${q2Data.base} · ${q2Data.base} ＝ ${q2Data.val}`
    : `${q2Data.base}³ ＝ ${q2Data.base} · ${q2Data.base} · ${q2Data.base} ＝ ${q2Data.val}`;

  // Q3: MCQ - Αναγνώριση Βάσης και Εκθέτη
  const q3Pool = [
    {
      base: 8, exp: 5, qType: 'base',
      prompt: locale === 'en' ? 'In the power 8⁵, which number is the base?' : 'Στη δύναμη 8⁵, ποιος αριθμός είναι η βάση;',
      correct: '8', wrong: ['5', '40', '13']
    },
    {
      base: 6, exp: 4, qType: 'exp',
      prompt: locale === 'en' ? 'In the power 6⁴, which number is the exponent?' : 'Στη δύναμη 6⁴, ποιος αριθμός είναι ο εκθέτης;',
      correct: '4', wrong: ['6', '24', '10']
    },
    {
      base: 9, exp: 3, qType: 'exp',
      prompt: locale === 'en' ? 'In the power 9³, which number is the exponent?' : 'Στη δύναμη 9³, ποιος αριθμός είναι ο εκθέτης;',
      correct: '3', wrong: ['9', '27', '12']
    },
    {
      base: 7, exp: 6, qType: 'base',
      prompt: locale === 'en' ? 'In the power 7⁶, which number is the base?' : 'Στη δύναμη 7⁶, ποιος αριθμός είναι η βάση;',
      correct: '7', wrong: ['6', '42', '13']
    }
  ];
  const q3Data = q3Pool[randInt(0, q3Pool.length - 1)];
  const q3Options = buildFourOptions(q3Data.correct, q3Data.wrong, (k) => String(Number(q3Data.correct) + k * 2));

  // Q4: MCQ - Ειδικές περιπτώσεις (εκθέτης 0 και 1)
  const q4Pool = [
    {
      base: 15, exp: 0, val: 1,
      explain: locale === 'en'
        ? 'Any non-zero number raised to the 0th power equals 1 (15⁰ ＝ 1).'
        : 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (15⁰ ＝ 1).'
    },
    {
      base: 28, exp: 1, val: 28,
      explain: locale === 'en'
        ? 'Any number raised to the 1st power equals itself (28¹ ＝ 28).'
        : 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (28¹ ＝ 28).'
    },
    {
      base: 100, exp: 0, val: 1,
      explain: locale === 'en'
        ? 'Any non-zero number raised to the 0th power equals 1 (100⁰ ＝ 1).'
        : 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (100⁰ ＝ 1).'
    },
    {
      base: 54, exp: 1, val: 54,
      explain: locale === 'en'
        ? 'Any number raised to the 1st power equals itself (54¹ ＝ 54).'
        : 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (54¹ ＝ 54).'
    }
  ];
  const q4Data = q4Pool[randInt(0, q4Pool.length - 1)];
  const q4Correct = String(q4Data.val);
  const q4Distractors = [
    '0',
    String(q4Data.base),
    String(q4Data.base + 1),
    '1',
    String(q4Data.base * 2)
  ].filter(opt => opt !== q4Correct);
  const q4Options = buildFourOptions(q4Correct, q4Distractors, (k) => String(q4Data.base + k + 5));

  // Q5: True / False - Σύγχυση δύναμης με πολλαπλασιασμό
  const q5Base = [2, 3, 4, 5][randInt(0, 3)];
  const q5Exp = [3, 4][randInt(0, 1)];
  const q5Product = q5Base * q5Exp;
  const q5Actual = Math.pow(q5Base, q5Exp);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? `The power ${q5Base}${EXPONENTS_UNICODE[q5Exp]} equals ${q5Actual} (i.e., ${Array(q5Exp).fill(q5Base).join(' · ')}).`
        : `Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ισούται με ${q5Actual} (δηλαδή ${Array(q5Exp).fill(q5Base).join(' · ')}).`)
    : (locale === 'en'
        ? `The power ${q5Base}${EXPONENTS_UNICODE[q5Exp]} equals ${q5Product} (i.e., ${q5Base} · ${q5Exp}).`
        : `Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ισούται με ${q5Product} (δηλαδή ${q5Base} · ${q5Exp}).`);

  // Q6: True / False - Έννοια Εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'In a power, the exponent shows how many times the base is multiplied by itself.'
        : 'Σε μία δύναμη, ο εκθέτης δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.')
    : (locale === 'en'
        ? 'In a power, the exponent is simply multiplied once by the base.'
        : 'Σε μία δύναμη, ο εκθέτης πολλαπλασιάζεται απλώς με τη βάση μία φορά.');

  // Q7: Input - Υπολογισμός δυνάμεων με βάση το 2 ή το 10
  const q7Pool = [
    { base: 2, exp: 4, val: 16, explain: '2⁴ ＝ 2 · 2 · 2 · 2 ＝ 16' },
    { base: 2, exp: 5, val: 32, explain: '2⁵ ＝ 2 · 2 · 2 · 2 · 2 ＝ 32' },
    { base: 10, exp: 2, val: 100, explain: '10² ＝ 10 · 10 ＝ 100' },
    {
      base: 10, exp: 3, val: 1000,
      explain: `10³ ＝ 10 · 10 · 10 ＝ ${formatNum(1000, locale)}`
    },
    {
      base: 10, exp: 4, val: 10000,
      explain: locale === 'en'
        ? `10⁴ ＝ ${formatNum(10000, locale)} (1 followed by 4 zeros)`
        : `10⁴ ＝ ${formatNum(10000, locale)} (το 1 ακολουθούμενο από 4 μηδενικά)`
    }
  ];
  const q7Data = q7Pool[randInt(0, q7Pool.length - 1)];

  // Q8: MCQ - Σύγκριση δύο δυνάμεων
  const q8Pool = [
    {
      prompt: locale === 'en' ? 'Which of the following relations is CORRECT?' : 'Ποια από τις παρακάτω σχέσεις είναι ΣΩΣΤΗ;',
      correct: '2³ ＜ 3²',
      wrong: ['2³ ＞ 3²', '2³ ＝ 3²', '2³ ＝ 2 · 3'],
      explain: locale === 'en'
        ? '2³ ＝ 2 · 2 · 2 ＝ 8, while 3² ＝ 3 · 3 ＝ 9. Therefore 8 ＜ 9 (2³ ＜ 3²).'
        : '2³ ＝ 2 · 2 · 2 ＝ 8, ενώ 3² ＝ 3 · 3 ＝ 9. Άρα 8 ＜ 9 (2³ ＜ 3²).'
    },
    {
      prompt: locale === 'en' ? 'What is the value of 2³ ＋ 3²?' : 'Ποιο είναι το αποτέλεσμα της παράστασης 2³ ＋ 3²;',
      correct: '17',
      wrong: ['12', '15', '25'],
      explain: locale === 'en'
        ? '2³ ＝ 8 and 3² ＝ 9. Therefore 8 ＋ 9 ＝ 17.'
        : '2³ ＝ 8 και 3² ＝ 9. Επομένως 8 ＋ 9 ＝ 17.'
    },
    {
      prompt: locale === 'en' ? 'What is the value of 10² － 5²?' : 'Ποιο είναι το αποτέλεσμα της παράστασης 10² － 5²;',
      correct: '75',
      wrong: ['50', '25', '95'],
      explain: locale === 'en'
        ? '10² ＝ 100 and 5² ＝ 25. Therefore 100 － 25 ＝ 75.'
        : '10² ＝ 100 και 5² ＝ 25. Επομένως 100 － 25 ＝ 75.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = buildFourOptions(q8Data.correct, q8Data.wrong, (k) => String(Number(q8Data.correct) + k * 10));

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = buildFourOptions(q9Raw.correctText, q9Raw.distractors, (k) => `Επιλογή ${k}`);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = buildFourOptions(q10Raw.correctText, q10Raw.distractors, (k) => `Επιλογή ${k}`);

  return [
    {
      id: 'q1',
      type: 'mcq',
      title: locale === 'en' ? 'Writing as a Power' : 'Γραφή ως Δύναμη',
      prompt: locale === 'en'
        ? `How is the repeated product ${q1Data.expr} written in power notation?`
        : `Πώς γράφεται σύντομα με τη μορφή δύναμης το γινόμενο: ${q1Data.expr};`,
      options: q1Options,
      correct: q1Data.correct,
      explain: locale === 'en'
        ? `Since factor ${q1Data.base} is multiplied ${q1Data.count} times by itself, it is written as ${q1Data.correct}.`
        : `Επειδή ο παράγοντας ${q1Data.base} πολλαπλασιάζεται ${q1Data.count} φορές με τον εαυτό του, γράφεται ${q1Data.correct}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Calculating Square or Cube' : 'Υπολογισμός Τετραγώνου ή Κύβου',
      prompt: locale === 'en'
        ? `What is the value of ${q2Data.base}${EXPONENTS_UNICODE[q2Data.exp]}?`
        : `Ποια είναι η τελική τιμή της δύναμης ${q2Data.base}${EXPONENTS_UNICODE[q2Data.exp]};`,
      correct: String(q2Data.val),
      explain: q2Explain
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Identifying Base & Exponent' : 'Αναγνώριση Βάσης & Εκθέτη',
      prompt: q3Data.prompt,
      options: q3Options,
      correct: q3Data.correct,
      explain: q3Data.qType === 'base'
        ? (locale === 'en'
            ? `The base is the main number at the bottom that gets multiplied (${q3Data.correct}).`
            : `Η βάση είναι ο μεγάλος αριθμός που βρίσκεται κάτω και πολλαπλασιάζεται (${q3Data.correct}).`)
        : (locale === 'en'
            ? `The exponent is the small superscript number showing how many times the base is written (${q3Data.correct}).`
            : `Ο εκθέτης είναι ο μικρός αριθμός πάνω δεξιά που δείχνει πόσες φορές γράφεται η βάση (${q3Data.correct}).`)
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Special Cases (0 & 1)' : 'Ειδικές Περιπτώσεις (0 & 1)',
      prompt: locale === 'en'
        ? `What is the value of ${q4Data.base}${EXPONENTS_UNICODE[q4Data.exp]}?`
        : `Πόσο ισούται η δύναμη ${q4Data.base}${EXPONENTS_UNICODE[q4Data.exp]};`,
      options: q4Options,
      correct: q4Correct,
      explain: q4Data.explain
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Power vs Multiplication' : 'Δύναμη vs Πολλαπλασιασμός',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? (locale === 'en'
            ? `Correct! ${q5Base}${EXPONENTS_UNICODE[q5Exp]} means ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}.`
            : `Σωστά! ${q5Base}${EXPONENTS_UNICODE[q5Exp]} σημαίνει ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}.`)
        : (locale === 'en'
            ? `False! The power ${q5Base}${EXPONENTS_UNICODE[q5Exp]} is NOT ${q5Base} · ${q5Exp} ＝ ${q5Product}, but ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}!`
            : `Λάθος! Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ΔΕΝ είναι ${q5Base} · ${q5Exp} ＝ ${q5Product}, αλλά ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}!`)
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Meaning of Exponent' : 'Έννοια Εκθέτη',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? (locale === 'en'
            ? 'Correct! The exponent specifies how many times the base is written as a factor.'
            : 'Σωστά! Ο εκθέτης ορίζει πόσες φορές θα γραφτεί η βάση ως παράγοντας του γινομένου.')
        : (locale === 'en'
            ? 'False! The exponent is not multiplied by the base; it indicates the count of equal factors.'
            : 'Λάθος! Ο εκθέτης δεν πολλαπλασιάζεται με τη βάση, αλλά δείχνει το πλήθος των ίσων παραγόντων.')
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Computing Powers' : 'Υπολογισμός Δυνάμεων',
      prompt: locale === 'en'
        ? `Calculate the value of ${q7Data.base}${EXPONENTS_UNICODE[q7Data.exp]}:`
        : `Υπολόγισε την τιμή της δύναμης ${q7Data.base}${EXPONENTS_UNICODE[q7Data.exp]}:`,
      correct: String(q7Data.val),
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Power Expressions & Comparisons' : 'Σχέσεις & Πράξεις Δυνάμεων',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
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

export default function DinameisExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
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

  // Χειρισμός απαντήσεων: sanitize μόνο για inputs
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
      const cleanUser = userVal.trim();
      const cleanTarget = String(q.correct).trim();
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
          href="/st-dimotikou/21-dinameis"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 max-w-full ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3 gap-2">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] w-full [overflow-wrap:anywhere] ${
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
                          type="text"
                          inputMode="numeric"
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
                        <div className="w-full overflow-x-auto block bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full min-w-[280px] text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700 break-words [overflow-wrap:anywhere]">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words [overflow-wrap:anywhere]">{row.val}</td>
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
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <p>{q.explain}</p>
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
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 min-w-0 max-w-full`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm shrink-0">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? score : answeredCount} / 10
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
          <div className="flex items-center gap-3 shrink-0">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
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