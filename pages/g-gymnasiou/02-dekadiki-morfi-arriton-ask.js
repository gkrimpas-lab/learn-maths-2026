import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const map = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'Ϊ': 'Ι', 'Ϋ': 'Υ',
    'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω',
    'ϊ': 'Ι', 'ϋ': 'Υ', 'ΐ': 'Ι', 'ΰ': 'Υ'
  };
  return str.split('').map(char => map[char] || char.toUpperCase()).join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 shrink-0 leading-none ${className}`}>
      <span className="border-b-[1.5px] border-current px-0.5 pb-0.5 text-center text-[0.88em] w-full block">
        {num}
      </span>
      <span className="px-0.5 pt-0.5 text-center text-[0.88em] w-full block">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null) {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Εγκλωβισμός ριζών ανάμεσα σε διαδοχικούς ακεραίους (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    const k = randInt(2, 6);
    const n = k * k + randInt(1, 2 * k);
    return {
      title: `Ακέραιος Εγκλωβισμός Ρίζας`,
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο άρρητος αριθμός <Radical>{n}</Radical>;
        </span>
      ),
      correct: `${k} και ${k + 1}`,
      type: 'mcq',
      distractors: () => [
        `${k - 1} και ${k}`,
        `${k + 1} και ${k + 2}`,
        `${k - 2} και ${k - 1}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Υπόριζη ποσότητα N', details: `${n}` },
        { label: 'Προηγούμενο τέλειο τετράγωνο', details: `${k}² ＝ ${k * k}` },
        { label: 'Επόμενο τέλειο τετράγωνο', details: `${k + 1}² ＝ ${(k + 1) * (k + 1)}` },
        { label: 'Ανισότητα', details: `${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}` }
      ],
      explanation: `Επειδή ${k}² ＝ ${k * k} και (${k + 1})² ＝ ${(k + 1) * (k + 1)}, έχουμε ${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}. Άρα ο αριθμός βρίσκεται ανάμεσα στο ${k} και το ${k + 1}.`
    };
  },
  () => {
    return {
      title: 'Ακέραιο Μέρος Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το ακέραιο μέρος (δηλαδή ο μεγαλύτερος ακέραιος που δεν υπερβαίνει) του άρρητου αριθμού <Radical>10</Radical>;
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: 'Έλεγχος τετραγώνων', details: '3² ＝ 9 ＜ 10 ＜ 16 ＝ 4²' },
        { label: 'Εγκλωβισμός', details: '3 ＜ √10 ＜ 4' },
        { label: 'Ακέραιο μέρος', details: '3 (αφού √10 ≈ 3,16...)' }
      ],
      explanation: 'Επειδή 3² ＝ 9 ＜ 10 ＜ 16 ＝ 4², η τιμή της ρίζας είναι 3 κόμμα κάτι (3,16...). Άρα το ακέραιο μέρος είναι το 3.'
    };
  },
  () => {
    return {
      title: 'Εγκλωβισμός Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιοι δύο διαδοχικοί φυσικοί αριθμοί περικλείουν τον αριθμό <Radical>50</Radical>;
        </span>
      ),
      correct: '7 και 8',
      type: 'mcq',
      distractors: () => ['6 και 7', '8 και 9', '5 και 6'][randInt(0, 2)],
      tableData: [
        { label: '7²', details: '49' },
        { label: '8²', details: '64' },
        { label: 'Ανισότητα', details: '49 ＜ 50 ＜ 64' }
      ],
      explanation: '7² ＝ 49 και 8² ＝ 64. Επομένως η ρίζα βρίσκεται ανάμεσα στο 7 και το 8.'
    };
  },
  () => {
    return {
      title: 'Εγκλωβισμός Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο μικρότερος ακέραιος που είναι ΜΕΓΑΛΥΤΕΡΟΣ από το <Radical>20</Radical>;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Τετράγωνα', details: '4² ＝ 16 ＜ 20 ＜ 25 ＝ 5²' },
        { label: 'Εγκλωβισμός', details: '4 ＜ √20 ＜ 5' },
        { label: 'Ζητούμενος ακέραιος', details: '5' }
      ],
      explanation: 'Ο αριθμός βρίσκεται ανάμεσα στο 4 και το 5 (4,47...). Ο μικρότερος ακέραιος που τον ξεπερνά είναι το 5.'
    };
  },
  () => {
    return {
      title: 'Εγκλωβισμός Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο αριθμός <Radical>80</Radical>;
        </span>
      ),
      correct: '8 και 9',
      type: 'mcq',
      distractors: () => ['7 και 8', '9 και 10', '8 και 10'][randInt(0, 2)],
      tableData: [
        { label: '8²', details: '64' },
        { label: '9²', details: '81' },
        { label: 'Ανισότητα', details: '64 ＜ 80 ＜ 81' }
      ],
      explanation: 'Επειδή 8² ＝ 64 ＜ 80 ＜ 81 ＝ 9², ο αριθμός βρίσκεται ανάμεσα στο 8 και το 9.'
    };
  },
  () => {
    return {
      title: 'Ακέραιο Μέρος Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το ακέραιο μέρος του άρρητου αριθμού <Radical>15</Radical>;
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: '3²', details: '9' },
        { label: '4²', details: '16' },
        { label: 'Ανισότητα', details: '9 ＜ 15 ＜ 16' }
      ],
      explanation: 'Επειδή 3² ＝ 9 ＜ 15 ＜ 16 ＝ 4², το ακέραιο μέρος είναι 3 (αφού η ρίζα είναι περίπου 3,87).'
    };
  }
];

// POOL Q10: Πυθαγόρειο και υπολογισμός υποτείνουσας ως άρρητος (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    return {
      title: 'Υποτείνουσα Ισοσκελούς Ορθογωνίου (πλευρά 1)',
      prompt: 'Ορθογώνιο τρίγωνο έχει κάθετες πλευρές ίσες με 1 cm. Πόσο είναι το ακριβές μήκος της υποτείνουσάς του σε cm;',
      correct: '√2 cm',
      type: 'mcq',
      distractors: () => ['2 cm', '1,5 cm', '√3 cm'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√2 cm') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> cm</span>;
        if (opt === '√3 cm') return <span className="inline-flex items-center gap-1"><Radical>3</Radical> cm</span>;
        return opt;
      },
      tableData: [
        { label: 'Κάθετες πλευρές', details: 'α ＝ 1 cm, β ＝ 1 cm' },
        { label: 'Πυθαγόρειο Θεώρημα', details: 'c² ＝ 1² ＋ 1² ＝ 2' },
        { label: 'Υποτείνουσα c', details: 'c ＝ √2 cm' }
      ],
      explanation: 'Από το Πυθαγόρειο θεώρημα: c² ＝ 1² ＋ 1² ＝ 2, άρα c ＝ √2 cm (άρρητος αριθμός).'
    };
  },
  () => {
    return {
      title: 'Υποτείνουσα Ορθογωνίου με πλευρές 1 και 2',
      prompt: 'Ορθογώνιο τρίγωνο έχει κάθετες πλευρές 1 m και 2 m. Ποιο είναι το ακριβές μήκος της υποτείνουσάς του;',
      correct: '√5 m',
      type: 'mcq',
      distractors: () => ['3 m', '√3 m', '2,5 m'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√5 m') return <span className="inline-flex items-center gap-1"><Radical>5</Radical> m</span>;
        if (opt === '√3 m') return <span className="inline-flex items-center gap-1"><Radical>3</Radical> m</span>;
        return opt;
      },
      tableData: [
        { label: 'Κάθετες πλευρές', details: '1 m και 2 m' },
        { label: 'Τετράγωνα πλευρών', details: '1² ＋ 2² ＝ 1 ＋ 4 ＝ 5' },
        { label: 'Υποτείνουσα', details: '√5 m' }
      ],
      explanation: 'c² ＝ 1² ＋ 2² ＝ 1 ＋ 4 ＝ 5 => c ＝ √5 m.'
    };
  },
  () => {
    return {
      title: 'Διαγώνιος Τετραγώνου πλευράς 3',
      prompt: 'Ένα τετράγωνο έχει πλευρά 3 cm. Ποιο είναι το τετράγωνο της διαγωνίου του d² σε cm²;',
      correct: 18,
      type: 'input',
      tableData: [
        { label: 'Πλευρά α', details: '3 cm' },
        { label: 'Τύπος d²', details: 'd² ＝ α² ＋ α² ＝ 3² ＋ 3²' },
        { label: 'Υπολογισμός', details: '9 ＋ 9 ＝ 18 cm²' }
      ],
      explanation: 'Από το Πυθαγόρειο θεώρημα: d² ＝ 3² ＋ 3² ＝ 9 ＋ 9 ＝ 18. (Άρα η διαγώνιος ισούται με √18 cm).'
    };
  },
  () => {
    return {
      title: 'Υποτείνουσα Ορθογωνίου με πλευρές 2 και 3',
      prompt: 'Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 2 και 3, ποιο είναι το τετράγωνο της υποτείνουσας c²;',
      correct: 13,
      type: 'input',
      tableData: [
        { label: 'Κάθετες πλευρές', details: '2 και 3' },
        { label: 'Πυθαγόρειο', details: 'c² ＝ 2² ＋ 3² ＝ 4 ＋ 9 ＝ 13' }
      ],
      explanation: 'c² ＝ 2² ＋ 3² ＝ 4 ＋ 9 ＝ 13. Η υποτείνουσα ισούται με √13.'
    };
  },
  () => {
    return {
      title: 'Διαγώνιος Ορθογωνίου με πλευρές 1 και 3',
      prompt: 'Ορθογώνιο παραλληλόγραμμο έχει διαστάσεις 1 cm και 3 cm. Ποιο είναι το ακριβές μήκος της διαγωνίου του;',
      correct: '√10 cm',
      type: 'mcq',
      distractors: () => ['4 cm', '√8 cm', '3,5 cm'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√10 cm') return <span className="inline-flex items-center gap-1"><Radical>10</Radical> cm</span>;
        if (opt === '√8 cm') return <span className="inline-flex items-center gap-1"><Radical>8</Radical> cm</span>;
        return opt;
      },
      tableData: [
        { label: 'Διαστάσεις', details: '1 cm και 3 cm' },
        { label: 'Διαγώνιος d', details: 'd² ＝ 1² ＋ 3² ＝ 1 ＋ 9 ＝ 10 => d ＝ √10 cm' }
      ],
      explanation: 'd ＝ √(1² ＋ 3²) ＝ √(1 ＋ 9) ＝ √10 cm.'
    };
  },
  () => {
    return {
      title: 'Υποτείνουσα με πλευρές 2 και 4',
      prompt: 'Ποιο είναι το τετράγωνο της υποτείνουσας ορθογωνίου τριγώνου με κάθετες πλευρές 2 m και 4 m;',
      correct: 20,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '2² ＋ 4² ＝ 4 ＋ 16 ＝ 20' }
      ],
      explanation: 'c² ＝ 2² ＋ 4² ＝ 4 ＋ 16 ＝ 20. Άρα c ＝ √20 m.'
    };
  }
];

// POOL Q11: Ρητή προσέγγιση δεκάτου και εκατοστού (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    return {
      title: 'Προσέγγιση με Έλλειψη στο 0,1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η προσέγγιση με έλλειψη του αριθμού <Radical>2</Radical> με ακρίβεια ενός δεκάτου (0,1);
        </span>
      ),
      correct: 1.4,
      type: 'input',
      tableData: [
        { label: '1,4²', details: '1,96 ＜ 2' },
        { label: '1,5²', details: '2,25 ＞ 2' },
        { label: 'Ελλιπής προσέγγιση', details: '1,4' }
      ],
      explanation: 'Επειδή 1,4² ＝ 1,96 ＜ 2 ＜ 2,25 ＝ 1,5², η προσέγγιση με έλλειψη στο δέκατο είναι 1,4.'
    };
  },
  () => {
    return {
      title: 'Προσέγγιση με Υπέρβαση στο 0,1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η προσέγγιση με υπέρβαση του αριθμού <Radical>2</Radical> με ακρίβεια ενός δεκάτου (0,1);
        </span>
      ),
      correct: 1.5,
      type: 'input',
      tableData: [
        { label: '1,4²', details: '1,96' },
        { label: '1,5²', details: '2,25' },
        { label: 'Υπερβολική προσέγγιση', details: '1,5' }
      ],
      explanation: 'Η προσέγγιση με υπέρβαση με ακρίβεια ενός δεκάτου είναι 1,5.'
    };
  },
  () => {
    return {
      title: 'Προσέγγιση στο 0,1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ανάμεσα σε ποια δύο διαδοχικά δέκατα εγκλωβίζεται ο άρρητος αριθμός <Radical>3</Radical>;
        </span>
      ),
      correct: '1,7 και 1,8',
      type: 'mcq',
      distractors: () => ['1,6 και 1,7', '1,8 και 1,9', '1,5 και 1,6'][randInt(0, 2)],
      tableData: [
        { label: '1,7²', details: '2,89 ＜ 3' },
        { label: '1,8²', details: '3,24 ＞ 3' },
        { label: 'Ανισότητα', details: '1,7 ＜ √3 ＜ 1,8' }
      ],
      explanation: '1,7² ＝ 2,89 και 1,8² ＝ 3,24. Άρα 1,7 ＜ √3 ＜ 1,8.'
    };
  },
  () => {
    return {
      title: 'Προσέγγιση στο 0,1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η προσέγγιση με έλλειψη του αριθμού <Radical>5</Radical> με ακρίβεια δεκάτου (0,1);
        </span>
      ),
      correct: 2.2,
      type: 'input',
      tableData: [
        { label: '2,2²', details: '4,84 ＜ 5' },
        { label: '2,3²', details: '5,29 ＞ 5' },
        { label: 'Απάντηση', details: '2,2' }
      ],
      explanation: '2,2² ＝ 4,84 ＜ 5 ＜ 5,29 ＝ 2,3². Η προσέγγιση με έλλειψη είναι 2,2.'
    };
  },
  () => {
    return {
      title: 'Προσέγγιση στο 0,1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ανάμεσα σε ποια δύο δέκατα βρίσκεται ο αριθμός <Radical>10</Radical>;
        </span>
      ),
      correct: '3,1 και 3,2',
      type: 'mcq',
      distractors: () => ['3,0 και 3,1', '3,2 και 3,3', '3,3 και 3,4'][randInt(0, 2)],
      tableData: [
        { label: '3,1²', details: '9,61 ＜ 10' },
        { label: '3,2²', details: '10,24 ＞ 10' },
        { label: 'Εγκλωβισμός', details: '3,1 ＜ √10 ＜ 3,2' }
      ],
      explanation: '3,1² ＝ 9,61 και 3,2² ＝ 10,24. Άρα 3,1 ＜ √10 ＜ 3,2.'
    };
  },
  () => {
    return {
      title: 'Σφάλμα Προσέγγισης στο 0,01',
      prompt: 'Αν προσεγγίσουμε έναν άρρητο αριθμό με ακρίβεια εκατοστού (0,01), ποιο είναι το ΜΕΓΙΣΤΟ δυνατό σφάλμα της προσέγγισης;',
      correct: 0.01,
      type: 'input',
      tableData: [
        { label: 'Ακρίβεια', details: 'Εκατοστό (0,01)' },
        { label: 'Μέγιστο σφάλμα', details: '0,01' }
      ],
      explanation: 'Στην προσέγγιση με ακρίβεια εκατοστού, η διαφορά μεταξύ ελλιπούς και υπερβολικής προσέγγισης είναι 0,01. Άρα το σφάλμα δεν υπερβαίνει το 0,01.'
    };
  }
];

// POOL Q12: Προβλήματα εφαρμογής με π και γεωμετρικά μεγέθη (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    const r = randInt(5, 15);
    const perimeter = Math.round(2 * 3.14 * r * 100) / 100;
    return {
      title: 'Περίμετρος Κύκλου με π ≈ 3,14',
      prompt: `Ένας κυκλικός δίσκος έχει ακτίνα R ＝ ${r} cm. Ποια είναι η περίμετρός του σε cm χρησιμοποιώντας τη ρητή προσέγγιση π ≈ 3,14;`,
      correct: perimeter,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'Ακτίνα R', details: `${r} cm` },
        { label: 'Τύπος περιμέτρου', details: 'L ＝ 2 · π · R' },
        { label: 'Υπολογισμός', details: `2 · 3,14 · ${r} ＝ ${perimeter} cm` }
      ],
      explanation: `L ＝ 2 · 3,14 · ${r} ＝ ${perimeter} cm.`
    };
  },
  () => {
    const r = randInt(2, 6);
    const area = Math.round(3.14 * r * r * 100) / 100;
    return {
      title: 'Εμβαδόν Κυκλικού Δίσκου με π ≈ 3,14',
      prompt: `Ποιο είναι το εμβαδόν ενός κυκλικού παρτεριού με ακτίνα R ＝ ${r} m για π ≈ 3,14 σε m²;`,
      correct: area,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Ακτίνα R', details: `${r} m` },
        { label: 'Τύπος εμβαδού', details: 'E ＝ π · R²' },
        { label: 'Υπολογισμός', details: `3,14 · ${r}² ＝ 3,14 · ${r * r} ＝ ${area} m²` }
      ],
      explanation: `E ＝ 3,14 · ${r}² ＝ ${area} m².`
    };
  },
  () => {
    return {
      title: 'Προσέγγιση Αρχιμήδη (22/7)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Για ακτίνα R ＝ 7 cm, ποια είναι η περίμετρος του κύκλου αν χρησιμοποιηθεί η κλασματική προσέγγιση του Αρχιμήδη π ≈ <Frac num="22" den="7" /> σε cm;
        </span>
      ),
      correct: 44,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'Τύπος', details: 'L ＝ 2 · π · R' },
        { label: 'Υπολογισμός', details: '2 · (22/7) · 7 ＝ 2 · 22 ＝ 44 cm' }
      ],
      explanation: '2 · (22/7) · 7 ＝ 44 cm.'
    };
  },
  () => {
    return {
      title: 'Διαγώνιος Τετραγώνου με Ρητή Προσέγγιση',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα τετράγωνο έχει πλευρά 10 m. Ποιο είναι το κατά προσέγγιση μήκος της διαγωνίου του αν <Radical>2</Radical> ≈ 1,41 σε μέτρα;
        </span>
      ),
      correct: 14.1,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'Ακριβές μήκος', details: 'd ＝ 10 · √2 m' },
        { label: 'Προσέγγιση', details: '10 · 1,41 ＝ 14,1 m' }
      ],
      explanation: 'd ＝ 10 · 1,41 ＝ 14,1 m.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση π και 3,14',
      prompt: 'Ποια είναι η σχέση ανάμεσα στον πραγματικό αριθμό π και τη ρητή προσέγγιση 3,14;',
      correct: 'π ＞ 3,14',
      type: 'mcq',
      distractors: () => ['π ＝ 3,14', 'π ＜ 3,14', 'Δεν συγκρίνονται'][randInt(0, 2)],
      tableData: [
        { label: 'Αριθμός π', details: '3,14159265...' },
        { label: 'Ρητή τιμή', details: '3,14000000...' },
        { label: 'Σύγκριση', details: '3,14159... ＞ 3,14000...' }
      ],
      explanation: 'Επειδή π ＝ 3,14159..., είναι αυστηρά μεγαλύτερος από τον δεκαδικό 3,14 (π ＞ 3,14).'
    };
  },
  () => {
    return {
      title: 'Περίμετρος Ημικυκλίου',
      prompt: 'Ημικύκλιο έχει διάμετρο d ＝ 10 cm. Ποιο είναι το μήκος του κυκλικού τόξου του για π ≈ 3,14 σε cm;',
      correct: 15.7,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'Μήκος τόξου', details: '(π · d) / 2' },
        { label: 'Υπολογισμός', details: '(3,14 · 10) / 2 ＝ 31,4 / 2 ＝ 15,7 cm' }
      ],
      explanation: 'Το κυκλικό τόξο του ημικυκλίου είναι (π · d) / 2 ＝ (3,14 · 10) / 2 ＝ 15,7 cm.'
    };
  }
];

export default function DekadikiMorfiArritonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Ορισμός άρρητου
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Ορισμός Άρρητου Αριθμού',
      prompt: q1IsCorrect
        ? 'Ένας άρρητος αριθμός έχει άπειρα δεκαδικά ψηφία χωρίς να εμφανίζει ποτέ περίοδο.'
        : 'Κάθε αριθμός με άπειρα δεκαδικά ψηφία είναι υποχρεωτικά άρρητος αριθμός.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Οι άρρητοι αριθμοί χαρακτηρίζονται από άπειρα δεκαδικά ψηφία ΧΩΡΙΣ περίοδο. Αν υπάρχει περίοδος (όπως στο 0,333...), ο αριθμός είναι ρητός.'
    });

    // Q2: MCQ - Αναγνώριση Άρρητου
    const validArritoi = ['√2', '√3', '√5', 'π'];
    const invalidArritoi = ['√4 (＝ 2)', '√9 (＝ 3)', '0,75', '3/5'];
    const q2Correct = validArritoi[randInt(0, validArritoi.length - 1)];
    qList.push({
      id: 2,
      title: 'Αναγνώριση Άρρητου Αριθμού',
      prompt: 'Ποιος από τους παρακάτω αριθμούς ΕΙΝΑΙ άρρητος αριθμός;',
      type: 'mcq',
      correct: q2Correct,
      options: ensureFourUniqueOptions(q2Correct, () => invalidArritoi[randInt(0, invalidArritoi.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√5') return <Radical>5</Radical>;
        if (opt === '√4 (＝ 2)') return <span className="inline-flex items-center gap-1"><Radical>4</Radical> (＝ 2)</span>;
        if (opt === '√9 (＝ 3)') return <span className="inline-flex items-center gap-1"><Radical>9</Radical> (＝ 3)</span>;
        if (opt === '3/5') return <Frac num="3" den="5" />;
        return opt;
      },
      explanation: `Ο αριθμός αυτός είναι άρρητος, καθώς δεν μπορεί να εκφραστεί ως κλάσμα ακεραίων.`
    });

    // Q3: True / False - Ρίζες τέλειων τετραγώνων
    const q3Choice = Math.random() < 0.5;
    qList.push({
      id: 3,
      title: 'Τετραγωνική Ρίζα και Άρρητοι',
      prompt: q3Choice
        ? 'Η τετραγωνική ρίζα κάθε φυσικού αριθμού που ΔΕΝ είναι τέλειο τετράγωνο είναι άρρητος αριθμός.'
        : 'Η τετραγωνική ρίζα οποιουδήποτε φυσικού αριθμού είναι πάντοτε άρρητος αριθμός.',
      type: 'tf',
      correct: q3Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η τετραγωνική ρίζα ενός τέλειου τετραγώνου (π.χ. √16 ＝ 4) είναι φυσικός (ρητός) αριθμός. Άρρητες είναι μόνο οι ρίζες μη τέλειων τετραγώνων.'
    });

    // Q4: MCQ - Τιμή του √25
    qList.push({
      id: 4,
      title: 'Χαρακτηρισμός Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ο αριθμός <Radical>25</Radical> είναι:
        </span>
      ),
      type: 'mcq',
      correct: 'Ρητός (φυσικός) αριθμός, ίσος με 5',
      options: ensureFourUniqueOptions('Ρητός (φυσικός) αριθμός, ίσος με 5', () => [
        'Άρρητος αριθμός, περίπου 5,1',
        'Περιοδικός δεκαδικός αριθμός',
        'Μη πραγματικός αριθμός'
      ][randInt(0, 2)]),
      explanation: 'Επειδή 5² ＝ 25, η ρίζα √25 ισούται ακριβώς με το 5, άρα είναι ρητός αριθμός.'
    });

    // Q5: True / False - Ο αριθμός π και το 3,14
    const q5Choice = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: 'Η Φύση του Αριθμού π',
      prompt: q5Choice
        ? 'Ο αριθμός π είναι άρρητος αριθμός και η τιμή 3,14 αποτελεί απλώς μία ρητή προσέγγισή του.'
        : 'Ο αριθμός π είναι ρητός αριθμός επειδή ισούται ακριβώς με 3,14.',
      type: 'tf',
      correct: q5Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Ο αριθμός π έχει αποδειχθεί ότι είναι άρρητος. Το 3,14 είναι δεκαδική προσέγγιση με ακρίβεια εκατοστού.'
    });

    // Q6: Input - Ακέραιος εγκλωβισμός του √7
    qList.push({
      id: 6,
      title: 'Ακέραιο Μέρος Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το ακέραιο μέρος του άρρητου αριθμού <Radical>7</Radical> (δηλαδή ο ακέραιος k αν k ＜ <Radical>7</Radical> ＜ k＋1);
        </span>
      ),
      type: 'input',
      correct: 2,
      explanation: '2² ＝ 4 ＜ 7 ＜ 9 ＝ 3², άρα 2 ＜ √7 ＜ 3. Το ακέραιο μέρος είναι 2.'
    });

    // Q7: MCQ - Πραγματικοί Αριθμοί
    qList.push({
      id: 7,
      title: 'Σύνολο Πραγματικών Αριθμών',
      prompt: 'Το σύνολο των πραγματικών αριθμών (ℝ) αποτελείται από:',
      type: 'mcq',
      correct: 'Την ένωση των ρητών και των άρρητων αριθμών',
      options: ensureFourUniqueOptions('Την ένωση των ρητών και των άρρητων αριθμών', () => [
        'Μόνο τους θετικούς ρητούς αριθμούς',
        'Μόνο τους ακεραίους και τα κλάσματα',
        'Μόνο τους αριθμούς που έχουν περίοδο'
      ][randInt(0, 2)]),
      explanation: 'Οι πραγματικοί αριθμοί περιλαμβάνουν όλους τους ρητούς και όλους τους άρρητους αριθμούς.'
    });

    // Q8: Input - Τετράγωνο της υποτείνουσας
    qList.push({
      id: 8,
      title: 'Πυθαγόρειο Τετράγωνο',
      prompt: 'Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 2 cm και 5 cm, ποιο είναι το τετράγωνο της υποτείνουσας c²;',
      type: 'input',
      correct: 29,
      explanation: 'c² ＝ 2² ＋ 5² ＝ 4 ＋ 25 ＝ 29.'
    });

    // Q9 - Q12: Επιλογή από ανεξάρτητες δεξαμενές
    const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)]();
    const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)]();
    const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)]();
    const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)]();

    const formatPoolItem = (item, id) => {
      let options = undefined;
      if (item.type === 'mcq') {
        options = ensureFourUniqueOptions(item.correct, item.distractors);
      }
      return {
        id,
        title: item.title,
        prompt: item.prompt,
        type: item.type,
        correct: item.correct,
        options,
        renderOption: item.renderOption,
        unit: item.unit,
        tableData: item.tableData,
        explanation: item.explanation
      };
    };

    qList.push(formatPoolItem(p9, 9));
    qList.push(formatPoolItem(p10, 10));
    qList.push(formatPoolItem(p11, 11));
    qList.push(formatPoolItem(p12, 12));

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, []);

  const handleAnswerChange = (qId, val) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title="Ασκήσεις: Δεκαδική Μορφή Άρρητων | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στους άρρητους αριθμούς, ρίζες, ρητές προσεγγίσεις και εγκλωβισμό με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/02-dekadiki-morfi-arriton"
      backText="Θεωρία Κεφ. 2"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/02-dekadiki-morfi-arriton"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase("ΘΕΩΡΙΑ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase("ΑΣΚΗΣΕΙΣ •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight">
                Δεκαδική Μορφή Άρρητων Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα εγκλωβισμού. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».
              </p>
            </div>
            <div>
              <button
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase("ΝΕΕΣ ΑΣΚΗΣΕΙΣ")}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              Αποτέλεσμα: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τους άρρητους αριθμούς και τις τεχνικές εγκλωβισμού τους.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τον εγκλωβισμό των ριζών!'}
            </p>
            <button
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase("ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ")}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ Σωστό' : '✗ Λάθος'}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9.,-]/g, '');
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder="Απάντηση..."
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION - SAFE SCROLL TABLES */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto -mx-1 sm:mx-0 rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">Στοιχείο / Βήμα</th>
                              <th className="p-2 border-b">Ανάλυση Δεδομένων</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>Σωστή Απάντηση:</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM FOOTER - MOBILE OPTIMIZED */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-4 py-2.5 sm:py-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-700 truncate">
                  {toCleanUppercase("ΑΠΑΝΤΗΘΗΚΑΝ")}: <span className="text-indigo-600 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-700">{toCleanUppercase("ΣΚΟΡ")}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-400">|</span>
                  <span className="text-indigo-700">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase("ΕΛΕΓΧΟΣ")}
                </button>
              ) : (
                <button
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase("ΝΕΕΣ ΑΣΚΗΣΕΙΣ")}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
