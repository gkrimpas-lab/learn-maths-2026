// pages/st-dimotikou/63-geometrika-motiba-ask.js
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
    metaTitle: "Ασκήσεις: Γεωμετρικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα γεωμετρικά μοτίβα, τις πλακοστρώσεις, τις ακολουθίες και τα μοτίβα στη φύση για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "ΚΕΦΑΛΑΙΟ 63 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Γεωμετρικά Μοτίβα",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγνώριση κανόνων επανάληψης, στα αυξανόμενα μοτίβα, στις πλακοστρώσεις και στα μοτίβα της φύσης!",
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
    metaTitle: "Exercises: Geometric Patterns - 6th Grade | LearnMaths.gr",
    metaDesc: "Interactive math exercises with 10 problems and automated grading on geometric patterns, tessellations, sequences, and natural symmetries for 6th Grade.",
    backLinkText: "6th Grade",
    theoryBtn: "Theory",
    badgeHeader: "CHAPTER 63 • 6TH GRADE • PRACTICE",
    heroTitle: "Interactive Exercises: Geometric Patterns",
    heroDesc: "Solve 10 dynamic problems to practice pattern recognition, growing sequences, tessellations, and natural symmetries!",
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
      const n = randInt(10, 20);
      const totalMatches = 1 + 3 * n;
      const correctText = isEn ? `${totalMatches} matchsticks` : `${totalMatches} σπίρτα`;

      return {
        title: isEn ? 'Square Matchstick Construction' : 'Κατασκευή Τετραγώνων με Σπίρτα',
        prompt: isEn
          ? `We form a straight line of ${n} contiguous squares using matchsticks. The 1st square takes 4 matchsticks, and each subsequent adjoining square takes 3 additional matchsticks. How many matchsticks are needed in total?`
          : `Σχηματίζουμε μια ευθεία σειρά από ${n} ενωμένα τετράγωνα με σπίρτα. Το 1ο τετράγωνο χρειάζεται 4 σπίρτα και κάθε επόμενο που κολλάει δίπλα του χρειάζεται 3 επιπλέον σπίρτα. Πόσα σπίρτα θα χρειαστούν συνολικά;`,
        correctText,
        tableData: [
          {
            item: isEn ? '1st square' : '1ο τετράγωνο',
            formula: isEn ? '4 matchsticks' : '4 σπίρτα',
            val: '4'
          },
          {
            item: isEn ? 'Additional squares' : 'Επιπλέον τετράγωνα',
            formula: `${n - 1} · ${isEn ? '3 matchsticks' : '3 σπίρτα'}`,
            val: `${(n - 1) * 3}`
          },
          {
            item: isEn ? `Total for n ＝ ${n}` : `Σύνολο για n ＝ ${n}`,
            formula: `1 ＋ (3 · ${n})`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The algebraic rule for n contiguous squares is: 1 ＋ 3 · n (or 4 ＋ 3 · (n － 1)). For n ＝ ${n}: 1 ＋ 3 · ${n} ＝ 1 ＋ ${3 * n} ＝ ${totalMatches} matchsticks.`
              : `Ο μαθηματικός κανόνας για n ενωμένα τετράγωνα είναι: 1 ＋ 3 · n (ή 4 ＋ 3 · (n － 1)). Για n ＝ ${n}: 1 ＋ 3 · ${n} ＝ 1 ＋ ${3 * n} ＝ ${totalMatches} σπίρτα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${totalMatches + 3} matchsticks`,
              `${4 * n} matchsticks`,
              `${Math.max(4, totalMatches - 3)} matchsticks`
            ]
          : [
              `${totalMatches + 3} σπίρτα`,
              `${4 * n} σπίρτα`,
              `${Math.max(4, totalMatches - 3)} σπίρτα`
            ]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(12, 25);
      const totalMatches = 1 + 2 * n;
      const correctText = isEn ? `${totalMatches} matchsticks` : `${totalMatches} σπίρτα`;

      return {
        title: isEn ? 'Triangular Matchstick Construction' : 'Κατασκευή Τριγώνων με Σπίρτα',
        prompt: isEn
          ? `We form a row of ${n} contiguous equilateral triangles using matchsticks. The 1st triangle takes 3 matchsticks, and each subsequent triangle takes 2 additional matchsticks. How many matchsticks are needed for the ${n} triangles?`
          : `Σχηματίζουμε μια γραμμή από ${n} ενωμένα ισόπλευρα τρίγωνα με σπίρτα. Το 1ο τρίγωνο χρειάζεται 3 σπίρτα και κάθε επόμενο χρειάζεται 2 επιπλέον σπίρτα. Πόσα σπίρτα θα χρειαστούν για τα ${n} τρίγωνα;`,
        correctText,
        tableData: [
          {
            item: isEn ? '1st triangle' : '1ο τρίγωνο',
            formula: isEn ? '3 matchsticks' : '3 σπίρτα',
            val: '3'
          },
          {
            item: isEn ? 'Additional triangles' : 'Επιπλέον τρίγωνα',
            formula: `${n - 1} · ${isEn ? '2 matchsticks' : '2 σπίρτα'}`,
            val: `${(n - 1) * 2}`
          },
          {
            item: isEn ? 'Mathematical formula' : 'Μαθηματικός τύπος',
            formula: `1 ＋ (2 · ${n})`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The rule for n contiguous triangles is: 1 ＋ 2 · n. For n ＝ ${n}: 1 ＋ 2 · ${n} ＝ 1 ＋ ${2 * n} ＝ ${totalMatches} matchsticks.`
              : `Ο κανόνας για n ενωμένα τρίγωνα είναι: 1 ＋ 2 · n. Για n ＝ ${n}: 1 ＋ 2 · ${n} ＝ 1 ＋ ${2 * n} ＝ ${totalMatches} σπίρτα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${3 * n} matchsticks`,
              `${totalMatches + 2} matchsticks`,
              `${Math.max(3, totalMatches - 2)} matchsticks`
            ]
          : [
              `${3 * n} σπίρτα`,
              `${totalMatches + 2} σπίρτα`,
              `${Math.max(3, totalMatches - 2)} σπίρτα`
            ]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const side = randInt(8, 15);
      const totalTiles = side * side;
      const correctText = isEn ? `${totalTiles} tiles` : `${totalTiles} πλακάκια`;

      return {
        title: isEn ? 'Square Floor Tiling' : 'Πλακόστρωση με Τετράγωνα Πλακάκια',
        prompt: isEn
          ? `A square floor is tiled with square tiles. If each side has ${side} tiles, how many tiles are needed in total to cover the floor without gaps?`
          : `Ένα τετράγωνο δάπεδο στρώνεται με τετράγωνα πλακάκια. Αν σε κάθε πλευρά τοποθετούνται ${side} πλακάκια, πόσα πλακάκια θα χρειαστούν συνολικά για να καλυφθεί ολόκληρο το δάπεδο χωρίς κενά;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Tiles per side (n)' : 'Πλακάκια ανά πλευρά (n)',
            formula: `${side}`,
            val: `${side}`
          },
          {
            item: isEn ? 'Square pattern' : 'Μοτίβο τετραγώνου',
            formula: `n · n ＝ ${side} · ${side}`,
            val: `${totalTiles}`
          },
          {
            item: isEn ? 'Total quantity' : 'Συνολικό πλήθος',
            formulaNode: (
              <span>
                {side}<sup>2</sup>
              </span>
            ),
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Square covering follows the square number rule: n · n ＝ ${side} · ${side} ＝ ${totalTiles} tiles.`
              : `Η κάλυψη τετραγώνου ακολουθεί τον κανόνα του τετραγωνικού αριθμού: n · n ＝ ${side} · ${side} ＝ ${totalTiles} πλακάκια.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${side * 4} tiles`,
              `${totalTiles + side} tiles`,
              `${totalTiles - side} tiles`
            ]
          : [
              `${side * 4} πλακάκια`,
              `${totalTiles + side} πλακάκια`,
              `${totalTiles - side} πλακάκια`
            ]
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const shapes = isEn
        ? ['Triangle (🔺)', 'Circle (🟢)', 'Square (🟦)', 'Rhombus (🔶)']
        : ['Τρίγωνο (🔺)', 'Κύκλος (🟢)', 'Τετράγωνο (🟦)', 'Ρόμβος (🔶)'];
      const targetPos = randInt(41, 69);
      const rem = targetPos % 4;
      const shapeIdx = rem === 0 ? 3 : rem - 1;
      const correctText = shapes[shapeIdx];

      return {
        title: isEn ? 'Circular Pattern of 4 Shapes' : 'Κυκλικό Μοτίβο 4 Σχημάτων',
        prompt: isEn
          ? `A border constantly repeats the repeating core: Triangle, Circle, Square, Rhombus (core length 4). Which shape will be at position ${targetPos}?`
          : `Σε μια μπορντούρα επαναλαμβάνεται συνεχώς το μοτίβο: Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος (πυρήνας 4 σχημάτων). Ποιο σχήμα θα βρίσκεται στην ${targetPos}η θέση;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Core length' : 'Μήκος πυρήνα',
            formula: isEn ? '4 shapes' : '4 σχήματα',
            val: '4'
          },
          {
            item: isEn ? 'Euclidean division' : 'Ευκλείδεια διαίρεση',
            formula: `${targetPos} : 4`,
            val: `${isEn ? 'quotient' : 'πηλίκο'} ${Math.floor(targetPos / 4)}, ${isEn ? 'remainder' : 'υπόλοιπο'} ${rem}`
          },
          {
            item: isEn ? 'Position shape' : 'Σχήμα θέσης',
            formula: rem === 0 ? (isEn ? '4th shape' : '4ο σχήμα') : `${rem}${isEn ? 'th shape' : 'ο σχήμα'}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Divide position by core length: ${targetPos} : 4 ＝ ${Math.floor(targetPos / 4)} with remainder ${rem}. Remainder ${rem === 0 ? 4 : rem} indicates the shape is ${correctText}.`
              : `Διαιρούμε τη θέση με το μήκος του πυρήνα: ${targetPos} : 4 ＝ ${Math.floor(targetPos / 4)} με υπόλοιπο ${rem}. Το υπόλοιπο ${rem === 0 ? 4 : rem} δείχνει ότι το σχήμα είναι το ${correctText}.`}
          </span>
        ),
        distractors: shapes.filter((s) => s !== correctText)
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const colors = isEn
        ? ['Red', 'Blue', 'Yellow', 'Green', 'Orange']
        : ['Κόκκινη', 'Μπλε', 'Κίτρινη', 'Πράσινη', 'Πορτοκαλί'];
      const targetPos = randInt(51, 89);
      const rem = targetPos % 5;
      const colIdx = rem === 0 ? 4 : rem - 1;
      const correctText = isEn ? `${colors[colIdx]} bead` : `${colors[colIdx]} χάντρα`;

      return {
        title: isEn ? 'Circular Pattern of 5 Colors' : 'Κυκλικό Μοτίβο 5 Χρωμάτων',
        prompt: isEn
          ? `A necklace is strung with beads in the fixed sequence: Red, Blue, Yellow, Green, Orange (core length 5). What color will the ${targetPos}th bead be?`
          : `Σε ένα περιδέραιο περνιούνται χάντρες με τη σταθερή σειρά: Κόκκινη, Μπλε, Κίτρινη, Πράσινη, Πορτοκαλί (πυρήνας 5 χαντρών). Τι χρώμα θα έχει η ${targetPos}η χάντρα;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Core length' : 'Μήκος πυρήνα',
            formula: isEn ? '5 beads' : '5 χάντρες',
            val: '5'
          },
          {
            item: isEn ? 'Position division' : 'Διαίρεση θέσης',
            formula: `${targetPos} : 5`,
            val: `${isEn ? 'quotient' : 'πηλίκο'} ${Math.floor(targetPos / 5)}, ${isEn ? 'remainder' : 'υπόλοιπο'} ${rem}`
          },
          {
            item: isEn ? 'Bead color' : 'Χρώμα χάντρας',
            formula: rem === 0 ? (isEn ? '5th color' : '5ο χρώμα') : `${rem}${isEn ? 'th color' : 'ο χρώμα'}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Divide ${targetPos} : 5 ＝ ${Math.floor(targetPos / 5)} with remainder ${rem}. Remainder ${rem === 0 ? 5 : rem} corresponds to ${correctText}.`
              : `Διαιρούμε ${targetPos} : 5 ＝ ${Math.floor(targetPos / 5)} με υπόλοιπο ${rem}. Το υπόλοιπο ${rem === 0 ? 5 : rem} αντιστοιχεί στην ${correctText}.`}
          </span>
        ),
        distractors: colors
          .filter((_, idx) => idx !== colIdx)
          .map((c) => (isEn ? `${c} bead` : `${c} χάντρα`))
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const tables = randInt(6, 15);
      const chairs = 2 * tables + 2;
      const correctText = isEn ? `${chairs} chairs` : `${chairs} καρέκλες`;

      return {
        title: isEn ? 'Perimeter Pattern with Tables' : 'Μοτίβο Περιμέτρου με Τραπέζια',
        prompt: isEn
          ? `In a room, we join ${tables} square tables in a straight line into one large rectangular table. One chair is placed along each free side of a table. How many chairs fit around the combined table of ${tables} units?`
          : `Σε μια αίθουσα ενώνουμε ${tables} τετράγωνα τραπέζια στη σειρά σε ένα μεγάλο ορθογώνιο τραπέζι. Σε κάθε ελεύθερη πλευρά τετραγώνου μπαίνει 1 καρέκλα. Πόσες καρέκλες χωρούν γύρω από το ενιαίο τραπέζι των ${tables} τεμαχίων;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Chairs at 2 ends' : 'Καρέκλες στις 2 άκρες',
            formula: '1 ＋ 1',
            val: '2'
          },
          {
            item: isEn ? 'Chairs along long sides' : 'Καρέκλες στις μακριές πλευρές',
            formula: `2 · ${tables}`,
            val: `${2 * tables}`
          },
          {
            item: isEn ? 'Total rule' : 'Συνολικός κανόνας',
            formula: `(2 · ${tables}) ＋ 2`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Two chairs are placed at the narrow ends, and 2 · ${tables} ＝ ${2 * tables} chairs along the two long sides. Total: ${2 * tables} ＋ 2 ＝ ${chairs} chairs.`
              : `Στις δύο στενές άκρες μπαίνουν 2 καρέκλες και στις δύο μακριές πλευρές μπαίνουν 2 · ${tables} ＝ ${2 * tables} καρέκλες. Σύνολο: ${2 * tables} ＋ 2 ＝ ${chairs} καρέκλες.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${tables * 4} chairs`,
              `${chairs + 2} chairs`,
              `${Math.max(4, chairs - 2)} chairs`
            ]
          : [
              `${tables * 4} καρέκλες`,
              `${chairs + 2} καρέκλες`,
              `${Math.max(4, chairs - 2)} καρέκλες`
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
      const n = randInt(8, 12);
      const totalDots = (n * (n + 1)) / 2;
      const correctText = isEn ? `${totalDots} dots` : `${totalDots} τελείες`;

      return {
        title: isEn ? 'Triangular Numbers (Dot Count)' : 'Τριγωνικοί Αριθμοί (Πλήθος Τελειών)',
        prompt: isEn
          ? `In step 1 of a triangular pattern we have 1 dot, in step 2 we have 3 dots (1＋2), in step 3 we have 6 dots (1＋2＋3). How many dots will the ${n}th step contain?`
          : `Στο 1ο βήμα ενός τριγωνικού μοτίβου έχουμε 1 τελεία, στο 2ο βήμα 3 τελείες (1＋2), στο 3ο βήμα 6 τελείες (1＋2＋3). Πόσες τελείες θα περιέχει το ${n}ο βήμα;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Step (n)' : 'Βήμα (n)',
            formula: `${n}`,
            val: `${n}`
          },
          {
            item: isEn ? 'Triangular formula' : 'Τύπος τριγωνικού αριθμού',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num="n · (n ＋ 1)" den="2" />
              </span>
            ),
            val: `[${n} · ${n + 1}] : 2`
          },
          {
            item: isEn ? 'Calculation' : 'Υπολογισμός',
            formula: `${n * (n + 1)} : 2`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `The sum of the first n natural numbers is given by `
              : `Το άθροισμα των πρώτων n φυσικών αριθμών δίνεται από τον τύπο `}
            <Fraction num="n · (n ＋ 1)" den="2" />.
            {isEn
              ? ` For n ＝ ${n}: (${n} · ${n + 1}) : 2 ＝ ${n * (n + 1)} : 2 ＝ ${totalDots} dots.`
              : ` Για n ＝ ${n}: (${n} · ${n + 1}) : 2 ＝ ${n * (n + 1)} : 2 ＝ ${totalDots} τελείες.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${n * n} dots`,
              `${totalDots + n} dots`,
              `${Math.max(1, totalDots - n)} dots`
            ]
          : [
              `${n * n} τελείες`,
              `${totalDots + n} τελείες`,
              `${Math.max(1, totalDots - n)} τελείες`
            ]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const correctText = isEn
        ? '3 hexagons (120° · 3 ＝ 360°)'
        : '3 εξάγωνα (120° · 3 ＝ 360°)';

      return {
        title: isEn ? 'Tessellation and Vertex Angles (360°)' : 'Πλακόστρωση και Γωνίες Κορυφής (360°)',
        prompt: isEn
          ? 'In a regular hexagonal tessellation (like a bee honeycomb), how many regular hexagons meet at each shared vertex to completely tile the plane without gaps?'
          : 'Σε μια κανονική εξαγωνική πλακόστρωση (όπως στην κηρήθρα των μελισσών), πόσα κανονικά εξάγωνα ενώνονται σε κάθε κοινή κορυφή ώστε να καλύπτουν πλήρως τις 360° χωρίς κενά;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Regular hexagon interior angle' : 'Εσωτερική γωνία κανονικού εξαγώνου',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num="180° · (6 － 2)" den="6" />
                <span className="ml-1">＝ 120°</span>
              </span>
            ),
            val: '120°'
          },
          {
            item: isEn ? 'Full vertex angle' : 'Πλήρης γωνία κορυφής',
            formula: '360°',
            val: '360°'
          },
          {
            item: isEn ? 'Hexagons per vertex' : 'Πλήθος εξαγώνων ανά κορυφή',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num="360°" den="120°" />
                <span className="ml-1">＝ 3</span>
              </span>
            ),
            val: isEn ? '3 hexagons' : '3 εξάγωνα'
          }
        ],
        explain: (
          <span>
            {isEn
              ? 'Each angle of a regular hexagon is 120°. To fully tile 360° around a vertex, exactly '
              : 'Κάθε γωνία ενός κανονικού εξαγώνου είναι 120°. Για να καλυφθούν πλήρως οι 360° γύρω από μια κορυφή, ενώνονται ακριβώς '}
            <Fraction num="360°" den="120°" />
            {isEn ? ' ＝ 3 hexagons.' : ' ＝ 3 εξάγωνα.'}
          </span>
        ),
        distractors: isEn
          ? [
              '4 hexagons (90° · 4 ＝ 360°)',
              '6 hexagons (60° · 6 ＝ 360°)',
              '2 hexagons (180° · 2 ＝ 360°)'
            ]
          : [
              '4 εξάγωνα (90° · 4 ＝ 360°)',
              '6 εξάγωνα (60° · 6 ＝ 360°)',
              '2 εξάγωνα (180° · 2 ＝ 360°)'
            ]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(6, 10);
      const borderTiles = 4 * n - 4;
      const correctText = isEn ? `${borderTiles} tiles` : `${borderTiles} πλακάκια`;

      return {
        title: isEn ? 'Growing Pattern with Border (Border Tiles)' : 'Αυξανόμενο Μοτίβο με Περιθώριο (Border Tiles)',
        prompt: isEn
          ? `A square grid of dimensions ${n} · ${n} is covered with tiles. How many tiles lie solely on its outer perimeter (border)?`
          : `Ένα τετράγωνο πλέγμα διαστάσεων ${n} · ${n} καλύπτεται από πλακάκια. Πόσα πλακάκια βρίσκονται μόνο στο εξωτερικό του περίγραμμα (περιμετρικά);`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Total tiles (n · n)' : 'Συνολικά πλακάκια (n · n)',
            formula: `${n} · ${n}`,
            val: `${n * n}`
          },
          {
            item: isEn ? 'Inner tiles' : 'Εσωτερικά πλακάκια',
            formula: `(${n} － 2) · (${n} － 2)`,
            val: `${(n - 2) * (n - 2)}`
          },
          {
            item: isEn ? 'Perimeter tiles' : 'Περιμετρικά πλακάκια',
            formula: `${n * n} － ${(n - 2) * (n - 2)}`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Perimeter tiles are computed by subtracting the inner square: ${n * n} － ${(n - 2) * (n - 2)} ＝ ${borderTiles} tiles (or using rule 4 · n － 4 ＝ 4 · ${n} － 4 ＝ ${borderTiles}).`
              : `Τα περιμετρικά πλακάκια υπολογίζονται αφαιρώντας το εσωτερικό τετράγωνο: ${n * n} － ${(n - 2) * (n - 2)} ＝ ${borderTiles} πλακάκια (ή με τον κανόνα 4 · n － 4 ＝ 4 · ${n} － 4 ＝ ${borderTiles}).`}
          </span>
        ),
        distractors: isEn
          ? [
              `${n * 4} tiles`,
              `${borderTiles + 4} tiles`,
              `${Math.max(4, borderTiles - 4)} tiles`
            ]
          : [
              `${n * 4} πλακάκια`,
              `${borderTiles + 4} πλακάκια`,
              `${Math.max(4, borderTiles - 4)} πλακάκια`
            ]
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const nextVal = 13 + 21;
      const correctText = String(nextVal);

      return {
        title: isEn ? 'Fibonacci Sequence in Nature' : 'Ακολουθία Fibonacci στη Φύση',
        prompt: isEn
          ? 'In nature (sunflower spirals, pinecones) we encounter the famed Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, ... What is the immediate next number in the pattern?'
          : 'Στη φύση (σπείρες ηλιοτροπίων, κουκουνάρια) συναντάμε την περίφημη ακολουθία Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ... Ποιος είναι ο αμέσως επόμενος αριθμός του μοτίβου;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Fibonacci rule' : 'Κανόνας Fibonacci',
            formula: isEn ? 'Sum of previous 2 terms' : 'Άθροισμα των 2 προηγούμενων',
            val: 'α(n) ＝ α(n-1) ＋ α(n-2)'
          },
          {
            item: isEn ? 'Last 2 terms' : 'Τελευταίοι 2 όροι',
            formula: '13 and 21',
            val: '13 ＋ 21'
          },
          {
            item: isEn ? 'Next term' : 'Επόμενος όρος',
            formula: '13 ＋ 21',
            val: `${nextVal}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Each number in the Fibonacci sequence is obtained by adding the previous two: 13 ＋ 21 ＝ ${nextVal}.`
              : `Κάθε αριθμός στην ακολουθία Fibonacci προκύπτει προσθέτοντας τους δύο προηγούμενους: 13 ＋ 21 ＝ ${nextVal}.`}
          </span>
        ),
        distractors: [
          String(nextVal - 2),
          String(nextVal + 3),
          '29'
        ]
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(8, 16);
      const totalCross = 1 + 4 * n;
      const correctText = isEn ? `${totalCross} tiles` : `${totalCross} ψηφίδες`;

      return {
        title: isEn ? 'Decorative Mosaic Pattern' : 'Μοτίβο Διακοσμητικού Ψηφιδωτού',
        prompt: isEn
          ? `In a cross-shaped geometric pattern, there is 1 central tile and 4 equal arms. If each arm has a length of ${n} tiles, how many tiles are needed in total to form the cross?`
          : `Σε ένα σταυροειδές γεωμετρικό μοτίβο υπάρχει 1 κεντρική ψηφίδα και 4 ίσα μπράτσα. Αν κάθε μπράτσο έχει μήκος ${n} ψηφίδες, πόσες ψηφίδες χρειάζονται συνολικά για τον σχηματισμό του σταυρού;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Central tile' : 'Κεντρική ψηφίδα',
            formula: '1',
            val: '1'
          },
          {
            item: isEn ? '4 arms' : '4 μπράτσα',
            formula: `4 · ${n}`,
            val: `${4 * n}`
          },
          {
            item: isEn ? 'Total formula' : 'Συνολικός τύπος',
            formula: `1 ＋ (4 · ${n})`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `We add the central tile to the tiles of the 4 arms: 1 ＋ 4 · ${n} ＝ 1 ＋ ${4 * n} ＝ ${totalCross} tiles.`
              : `Προσθέτουμε την κεντρική ψηφίδα με τις ψηφίδες των 4 μπράτσων: 1 ＋ 4 · ${n} ＝ 1 ＋ ${4 * n} ＝ ${totalCross} ψηφίδες.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${4 * n} tiles`,
              `${totalCross + 4} tiles`,
              `${Math.max(5, totalCross - 4)} tiles`
            ]
          : [
              `${4 * n} ψηφίδες`,
              `${totalCross + 4} ψηφίδες`,
              `${Math.max(5, totalCross - 4)} ψηφίδες`
            ]
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const correctText = isEn
        ? '2 regular octagons and 1 square (135° ＋ 135° ＋ 90° ＝ 360°)'
        : '2 κανονικά οκτάγωνα και 1 τετράγωνο (135° ＋ 135° ＋ 90° ＝ 360°)';

      return {
        title: isEn ? 'Complex Tessellation (Octagons & Squares)' : 'Σύνθετη Πλακόστρωση (Οκτάγωνα & Τετράγωνα)',
        prompt: isEn
          ? 'In a traditional floor, regular octagons (interior angle 135°) and squares (interior angle 90°) are combined. Which combination of shapes meets at each vertex to sum up to exactly 360°?'
          : 'Σε ένα παραδοσιακό δάπεδο συνδυάζονται κανονικά οκτάγωνα (γωνία 135°) και τετράγωνα (γωνία 90°). Ποιος συνδυασμός σχημάτων συναντιέται σε κάθε κορυφή ώστε να συμπληρώνονται ακριβώς οι 360°;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Octagon angle' : 'Γωνία οκταγώνου',
            formula: '135°',
            val: '135°'
          },
          {
            item: isEn ? 'Square angle' : 'Γωνία τετραγώνου',
            formula: '90°',
            val: '90°'
          },
          {
            item: isEn ? 'Vertex sum' : 'Άθροισμα κορυφής',
            formula: '135° · 2 ＋ 90° ＝ 270° ＋ 90°',
            val: '360°'
          }
        ],
        explain: (
          <span>
            {isEn
              ? 'At each shared vertex, 2 octagon angles (135° · 2 ＝ 270°) and 1 square angle (90°) meet: 270° ＋ 90° ＝ 360°.'
              : 'Σε κάθε κοινή κορυφή ενώνονται 2 γωνίες οκταγώνου (135° · 2 ＝ 270°) και 1 γωνία τετραγώνου (90°): 270° ＋ 90° ＝ 360°.'}
          </span>
        ),
        distractors: isEn
          ? [
              '3 regular octagons (135° · 3 ＝ 405°)',
              '1 octagon and 2 squares (135° ＋ 180° ＝ 315°)',
              '2 octagons and 2 squares (270° ＋ 180° ＝ 450°)'
            ]
          : [
              '3 κανονικά οκτάγωνα (135° · 3 ＝ 405°)',
              '1 οκτάγωνο και 2 τετράγωνα (135° ＋ 180° ＝ 315°)',
              '2 οκτάγωνα και 2 τετράγωνα (270° ＋ 180° ＝ 450°)'
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

  // Q1: Input - Τετραγωνικό μοτίβο τελειών
  const q1N = randInt(5, 12);
  const q1Res = q1N * q1N;

  // Q2: Input - Ακολουθία με σταθερό βήμα
  const q2Start = randInt(2, 6);
  const q2Step = randInt(3, 5);
  const q2A = q2Start;
  const q2B = q2A + q2Step;
  const q2C = q2B + q2Step;
  const q2D = q2C + q2Step;
  const q2Next = q2D + q2Step;

  // Q3: Input - Αυξανόμενο μοτίβο 2n + 1
  const q3N = randInt(6, 14);
  const q3Res = 2 * q3N + 1;

  // Q4: MCQ - Ποια κανονικά πολύγωνα πλακοστρώνουν μόνα τους το επίπεδο
  const q4Correct = isEn
    ? 'Equilateral triangles, squares, and regular hexagons'
    : 'Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα';
  const q4Distractors = isEn
    ? [
        'Squares and circles only',
        'Regular pentagons and octagons',
        'All regular polygons without exception'
      ]
    : [
        'Μόνο τετράγωνα και κύκλοι',
        'Κανονικά πεντάγωνα και οκτάγωνα',
        'Όλα τα κανονικά πολύγωνα χωρίς εξαίρεση'
      ];
  const q4Options = makeUniqueOptions(q4Correct, q4Distractors);

  // Q5: True/False - Γεωμετρική αρχή πλακόστρωσης
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? 'In a gapless tessellation, the sum of angles around every shared vertex always equals 360°.'
        : 'In a gapless tessellation, the sum of angles around every shared vertex always equals 180°.')
    : (q5IsTrue
        ? 'Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 360°.'
        : 'Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 180°.');

  // Q6: True/False - Μοτίβα στη φύση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'Bees build their honeycombs using regular hexagons because they maximize storage capacity with minimal wax.'
        : 'Bees build their honeycombs using regular pentagons that leave no gaps between them.')
    : (q6IsTrue
        ? 'Οι μέλισσες κατασκευάζουν τις κηρήθρες τους με κανονικά εξάγωνα επειδή εξασφαλίζουν τη μέγιστη χωρητικότητα με το λιγότερο κερί.'
        : 'Οι μέλισσες κατασκευάζουν τις κηρήθρες τους με κανονικά πεντάγωνα που δεν αφήνουν κενά μεταξύ τους.');

  // Q7: Input - Εύρεση του n-οστού όρου σε μοτίβο σπίρτων 3n + 1
  const q7N = randInt(6, 12);
  const q7Res = 3 * q7N + 1;

  // Q8: MCQ - Αρχαιοελληνικός Μαίανδρος
  const q8Correct = isEn
    ? 'Continuous line folded at right angles (symbol of infinity)'
    : 'Συνεχής γραμμή που διπλώνει σε ορθές γωνίες (σύμβολο αιωνιότητας)';
  const q8Distractors = isEn
    ? [
        'Series of concentric circles',
        'Random arrangement of triangles without rules',
        'Pattern of parallel straight lines without turns'
      ]
    : [
        'Σειρά από ομόκεντρους κύκλους',
        'Τυχαία τοποθέτηση τριγώνων χωρίς κανόνα',
        'Μοτίβο από παράλληλες ευθείες χωρίς στροφές'
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
      title: isEn ? 'Square Dot Pattern' : 'Τετραγωνικό Μοτίβο Τελειών',
      prompt: isEn
        ? `In a square dot pattern of dimensions ${q1N} by ${q1N}, how many total dots are there?`
        : `Σε ένα τετραγωνικό μοτίβο τελειών διαστάσεων ${q1N} επί ${q1N}, πόσες τελείες υπάρχουν συνολικά;`,
      correct: String(q1Res),
      explain: (
        <span>
          {isEn
            ? `The rule is n · n: ${q1N} · ${q1N} ＝ ${q1Res} dots.`
            : `Ο κανόνας είναι n · n: ${q1N} · ${q1N} ＝ ${q1Res} τελείες.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Next Term of Arithmetic Pattern' : 'Επόμενος Όρος Αριθμητικού Μοτίβου',
      prompt: isEn
        ? `Find the next number in the pattern: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`
        : `Βρες τον επόμενο αριθμό του μοτίβου: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`,
      correct: String(q2Next),
      explain: (
        <span>
          {isEn
            ? `We add ${q2Step} at each step (constant step). Thus: ${q2D} ＋ ${q2Step} ＝ ${q2Next}.`
            : `Σε κάθε βήμα προσθέτουμε ${q2Step} (σταθερό βήμα). Άρα: ${q2D} ＋ ${q2Step} ＝ ${q2Next}.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Growing Pattern (2n ＋ 1)' : 'Αυξανόμενο Μοτίβο (2n ＋ 1)',
      prompt: isEn
        ? `A geometric pattern grows with the rule: Quantity ＝ 2 · n ＋ 1. How many elements does it have at step n ＝ ${q3N}?`
        : `Ένα γεωμετρικό μοτίβο αυξάνεται με τον κανόνα: Πλήθος ＝ 2 · n ＋ 1. Πόσα στοιχεία έχει στο βήμα n ＝ ${q3N};`,
      correct: String(q3Res),
      explain: (
        <span>
          {isEn
            ? `Substitute n ＝ ${q3N}: (2 · ${q3N}) ＋ 1 ＝ ${2 * q3N} ＋ 1 ＝ ${q3Res}.`
            : `Αντικαθιστούμε n ＝ ${q3N}: (2 · ${q3N}) ＋ 1 ＝ ${2 * q3N} ＋ 1 ＝ ${q3Res}.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Tessellation with Regular Polygons' : 'Πλακόστρωση με Κανονικά Πολύγωνα',
      prompt: isEn
        ? 'Which regular polygons can tile the plane by themselves without leaving any gaps?'
        : 'Ποια κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο χωρίς να αφήνουν καθόλου κενά;',
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span>
          {isEn
            ? 'Only these 3 regular polygons have interior angles that divide 360° exactly (60° · 6 ＝ 360°, 90° · 4 ＝ 360°, 120° · 3 ＝ 360°).'
            : 'Μόνο αυτά τα 3 κανονικά πολύγωνα έχουν γωνίες που διαιρούν ακριβώς τις 360° (60° · 6 ＝ 360°, 90° · 4 ＝ 360°, 120° · 3 ＝ 360°).'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Vertex Angles in Tessellation' : 'Γωνίες Κορυφής στην Πλακόστρωση',
      text: q5Text,
      correct: q5IsTrue,
      explain: isEn
        ? (q5IsTrue
            ? 'Correct! Around every shared vertex, a full 360° angle must be completed to ensure no gaps or overlaps.'
            : 'False! To prevent gaps, the sum of angles around every vertex must equal exactly 360° (a full angle).')
        : (q5IsTrue
            ? 'Σωστά! Γύρω από κάθε κοινή κορυφή πρέπει να συμπληρώνεται πλήρης γωνία 360°, ώστε να μην υπάρχει κενό ούτε επικάλυψη.'
            : 'Λάθος! Για να μην υπάρχει κενό, το άθροισμα των γωνιών γύρω από κάθε κορυφή πρέπει να είναι ακριβώς 360° (πλήρης γωνία).')
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Geometric Patterns in Nature' : 'Γεωμετρικά Μοτίβα στη Φύση',
      text: q6Text,
      correct: q6IsTrue,
      explain: isEn
        ? (q6IsTrue
            ? 'Correct! The hexagonal honeycomb is nature\'s most efficient geometric structure (minimal perimeter for maximum area).'
            : 'False! Regular pentagons leave gaps between them (108° · 3 ＝ 324° ≠ 360°). Bees use regular hexagons.')
        : (q6IsTrue
            ? 'Σωστά! Η εξαγωνική κηρήθρα είναι η αποδοτικότερη γεωμετρική δομή στη φύση (ελάχιστο περίγραμμα για μέγιστο εμβαδόν).'
            : 'Λάθος! Τα κανονικά πεντάγωνα αφήνουν κενά μεταξύ τους (γωνία 108° · 3 ＝ 324° ≠ 360°). Οι μέλισσες χρησιμοποιούν κανονικά εξάγωνα.')
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Matchstick Sequence Rule' : 'Κανόνας Ακολουθίας με Σπίρτα',
      prompt: isEn
        ? `In a row of contiguous matchstick squares, the number of matchsticks is given by the formula 3 · n ＋ 1. How many matchsticks are needed for n ＝ ${q7N} squares?`
        : `Σε μια σειρά ενωμένων τετραγώνων με σπίρτα, ο αριθμός των σπίρτων δίνεται από τον τύπο 3 · n ＋ 1. Πόσα σπίρτα χρειάζονται για n ＝ ${q7N} τετράγωνα;`,
      correct: String(q7Res),
      explain: (
        <span>
          {isEn
            ? `Apply the formula: (3 · ${q7N}) ＋ 1 ＝ ${3 * q7N} ＋ 1 ＝ ${q7Res} matchsticks.`
            : `Εφαρμόζουμε τον τύπο: (3 · ${q7N}) ＋ 1 ＝ ${3 * q7N} ＋ 1 ＝ ${q7Res} σπίρτα.`}
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'The Greek Meander in Art' : 'Ο Ελληνικός Μαίανδρος στην Τέχνη',
      prompt: isEn
        ? 'What is the characteristic geometric feature of the ancient Greek meander?'
        : 'Ποιο είναι το χαρακτηριστικό γεωμετρικό γνώρισμα του αρχαιοελληνικού μαιάνδρου;',
      options: q8Options,
      correct: q8Correct,
      explain: (
        <span>
          {isEn
            ? 'The meander is a repeating linear pattern of straight segments connected at right angles (90°).'
            : 'Ο μαίανδρος είναι ένα επαναλαμβανόμενο γραμμικό μοτίβο από ευθύγραμμα τμήματα που συνδέονται σε ορθές γωνίες (90°).'}
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

export default function GeometrikaMotibaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? String(q.altCorrect).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
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
          href="/st-dimotikou/63-geometrika-motiba"
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
                                    {row.val}
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