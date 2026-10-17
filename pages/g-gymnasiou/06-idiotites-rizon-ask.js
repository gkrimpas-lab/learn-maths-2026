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

// POOL Q9: Γινόμενο και Πηλίκο Ριζών με Ακέραιο Αποτέλεσμα (6 μοναδικές παραλλαγές)
const PROBLEM_POOL_Q9 = [
  // 1. Γινόμενο μορφής √a · √b = √(a*b) τέλειο τετράγωνο (π.χ. √5 · √20 = √100 = 10)
  () => {
    const pairs = [
      { a: 5, b: 20, res: 10 },
      { a: 8, b: 18, res: 12 },
      { a: 3, b: 27, res: 9 },
      { a: 2, b: 50, res: 10 },
      { a: 6, b: 24, res: 12 },
      { a: 7, b: 28, res: 14 }
    ];
    const picked = pairs[randInt(0, pairs.length - 1)];
    return {
      title: 'Γινόμενο Ριζών με Ρητό Αποτέλεσμα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η αριθμητική τιμή του γινομένου <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical>;
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα γινομένου', details: `√${picked.a} · √${picked.b} ＝ √(${picked.a} · ${picked.b})` },
        { label: 'Γινόμενο υπόριζων', details: `√${picked.a * picked.b}` },
        { label: 'Τελική τιμή', details: `${picked.res}` }
      ],
      explanation: `Εφαρμόζουμε την ιδιότητα √α · √β ＝ √(α · β): √${picked.a} · √${picked.b} ＝ √${picked.a * picked.b} ＝ ${picked.res}.`
    };
  },
  // 2. Πηλίκο ριζών √a / √b που δίνει ακέραιο (π.χ. √75 / √3 = √25 = 5)
  () => {
    const pairs = [
      { a: 75, b: 3, res: 5 },
      { a: 98, b: 2, res: 7 },
      { a: 112, b: 7, res: 4 },
      { a: 108, b: 3, res: 6 },
      { a: 80, b: 5, res: 4 },
      { a: 150, b: 6, res: 5 }
    ];
    const picked = pairs[randInt(0, pairs.length - 1)];
    return {
      title: 'Πηλίκο Ριζών με Ρητό Αποτέλεσμα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή του κλάσματος <Frac num={<Radical>{picked.a}</Radical>} den={<Radical>{picked.b}</Radical>} />;
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα πηλίκου', details: `√${picked.a} / √${picked.b} ＝ √(${picked.a} / ${picked.b})` },
        { label: 'Διαίρεση', details: `√${picked.a / picked.b}` },
        { label: 'Τελική τιμή', details: `${picked.res}` }
      ],
      explanation: `Εφαρμόζουμε την ιδιότητα √α / √β ＝ √(α / β): √${picked.a} / √${picked.b} ＝ √${picked.a / picked.b} ＝ ${picked.res}.`
    };
  },
  // 3. Γινόμενο τριών ριζών: √2 · √3 · √6 = √36 = 6
  () => {
    const sets = [
      { a: 2, b: 3, c: 6, res: 6 },
      { a: 2, b: 5, c: 10, res: 10 },
      { a: 3, b: 5, c: 15, res: 15 },
      { a: 2, b: 7, c: 14, res: 14 }
    ];
    const picked = sets[randInt(0, sets.length - 1)];
    return {
      title: 'Γινόμενο Τριών Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical> · <Radical>{picked.c}</Radical>;
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { label: 'Συνένωση ριζών', details: `√(${picked.a} · ${picked.b} · ${picked.c})` },
        { label: 'Γινόμενο', details: `√${picked.res * picked.res}` },
        { label: 'Αποτέλεσμα', details: `${picked.res}` }
      ],
      explanation: `Συνενώνουμε όλες τις ρίζες σε μία: √(${picked.a} · ${picked.b} · ${picked.c}) ＝ √${picked.res * picked.res} ＝ ${picked.res}.`
    };
  },
  // 4. Πηλίκο με αριθμητικό συντελεστή: (4 · √45) / (2 · √5)
  () => {
    const k = randInt(2, 4);
    const res = k * 3;
    return {
      title: 'Απλοποίηση Κλάσματος με Συντελεστές και Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση <Frac num={<span className="inline-flex items-center gap-1">{2 * k} · <Radical>45</Radical></span>} den={<span className="inline-flex items-center gap-1">2 · <Radical>5</Radical></span>} />;
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Διαίρεση συντελεστών', details: `${2 * k} / 2 ＝ ${k}` },
        { label: 'Πηλίκο ριζών', details: '√45 / √5 ＝ √(45 / 5) ＝ √9 ＝ 3' },
        { label: 'Τελικό γινόμενο', details: `${k} · 3 ＝ ${res}` }
      ],
      explanation: `Διαιρούμε τους εξωτερικούς συντελεστές (${2 * k}/2 ＝ ${k}) και τις ρίζες (√45/√5 ＝ 3): ${k} · 3 ＝ ${res}.`
    };
  },
  // 5. Διαίρεση δεκαδικών ριζών: √0,72 / √0,02 = √36 = 6
  () => {
    return {
      title: 'Πηλίκο Δεκαδικών Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή του κλάσματος <Frac num={<Radical>0,72</Radical>} den={<Radical>0,02</Radical>} />;
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα πηλίκου', details: '√(0,72 / 0,02)' },
        { label: 'Διαίρεση δεκαδικών', details: '0,72 / 0,02 ＝ 72 / 2 ＝ 36' },
        { label: 'Τελική τιμή', details: '√36 ＝ 6' }
      ],
      explanation: '√(0,72 / 0,02) ＝ √36 ＝ 6.'
    };
  },
  // 6. Γινόμενο δεκαδικών ριζών: √0,3 · √1,2 = √0,36 = 0,6
  () => {
    return {
      title: 'Γινόμενο Δεκαδικών Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η δεκαδική τιμή του γινομένου <Radical>0,3</Radical> · <Radical>1,2</Radical>;
        </span>
      ),
      correct: 0.6,
      type: 'input',
      tableData: [
        { label: 'Γινόμενο υπόριζων', details: '0,3 · 1,2 ＝ 0,36' },
        { label: 'Τετραγωνική ρίζα', details: '√0,36 ＝ 0,6' }
      ],
      explanation: '√(0,3 · 1,2) ＝ √0,36 ＝ 0,6.'
    };
  }
];

// POOL Q10: Εξαγωγή Παράγοντα & Απλοποίηση Ριζών στη μορφή α√β
const PROBLEM_POOL_Q10 = [
  // 1. Απλοποίηση του √12 = 2√3
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √12',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Γράφοντας τη ρίζα <Radical>12</Radical> στην απλούστερη μορφή α · <Radical>β</Radical>, ποιος είναι ο ακέραιος συντελεστής α;
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση σε τέλειο τετράγωνο', details: '12 ＝ 4 · 3 ＝ 2² · 3' },
        { label: 'Εξαγωγή παράγοντα', details: '√12 ＝ √4 · √3 ＝ 2 · √3' }
      ],
      explanation: '√12 ＝ √(4 · 3) ＝ 2 · √3. Άρα ο συντελεστής α είναι 2.'
    };
  },
  // 2. Απλοποίηση του √75 = 5√3
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √75',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η απλοποιημένη μορφή του άρρητου αριθμού <Radical>75</Radical>;
        </span>
      ),
      correct: '5·√3',
      type: 'mcq',
      distractors: () => ['3·√5', '25·√3', '15·√5'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '5·√3') return <span className="inline-flex items-center gap-1">5 · <Radical>3</Radical></span>;
        if (opt === '3·√5') return <span className="inline-flex items-center gap-1">3 · <Radical>5</Radical></span>;
        if (opt === '25·√3') return <span className="inline-flex items-center gap-1">25 · <Radical>3</Radical></span>;
        if (opt === '15·√5') return <span className="inline-flex items-center gap-1">15 · <Radical>5</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ανάλυση', details: '75 ＝ 25 · 3' },
        { label: 'Εξαγωγή ρίζας', details: '√75 ＝ √25 · √3 ＝ 5 · √3' }
      ],
      explanation: '√75 ＝ √(25 · 3) ＝ 5 · √3.'
    };
  },
  // 3. Απλοποίηση του √32 = 4√2
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √32',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο συντελεστής α αν γράψουμε το <Radical>32</Radical> στη μορφή α · <Radical>2</Radical>;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση', details: '32 ＝ 16 · 2' },
        { label: 'Εξαγωγή', details: '√32 ＝ √16 · √2 ＝ 4 · √2' }
      ],
      explanation: '√32 ＝ √(16 · 2) ＝ 4 · √2. Άρα α ＝ 4.'
    };
  },
  // 4. Απλοποίηση του √18 = 3√2
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √18',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η απλοποιημένη μορφή του αριθμού <Radical>18</Radical>;
        </span>
      ),
      correct: '3·√2',
      type: 'mcq',
      distractors: () => ['2·√3', '9·√2', '6·√3'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '3·√2') return <span className="inline-flex items-center gap-1">3 · <Radical>2</Radical></span>;
        if (opt === '2·√3') return <span className="inline-flex items-center gap-1">2 · <Radical>3</Radical></span>;
        if (opt === '9·√2') return <span className="inline-flex items-center gap-1">9 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ανάλυση', details: '18 ＝ 9 · 2' },
        { label: 'Μορφή', details: '√18 ＝ √9 · √2 ＝ 3 · √2' }
      ],
      explanation: '√18 ＝ √(9 · 2) ＝ 3 · √2.'
    };
  },
  // 5. Απλοποίηση του √45 = 3√5
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √45',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν <Radical>45</Radical> ＝ α · <Radical>5</Radical>, ποια είναι η τιμή του α;
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση', details: '45 ＝ 9 · 5' },
        { label: 'Εξαγωγή', details: '√45 ＝ 3 · √5' }
      ],
      explanation: '√45 ＝ √(9 · 5) ＝ 3 · √5, επομένως α ＝ 3.'
    };
  },
  // 6. Απλοποίηση του √98 = 7√2
  () => {
    return {
      title: 'Εξαγωγή Παράγοντα από το √98',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η απλούστερη μορφή του αριθμού <Radical>98</Radical>;
        </span>
      ),
      correct: '7·√2',
      type: 'mcq',
      distractors: () => ['2·√7', '49·√2', '14·√7'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '7·√2') return <span className="inline-flex items-center gap-1">7 · <Radical>2</Radical></span>;
        if (opt === '2·√7') return <span className="inline-flex items-center gap-1">2 · <Radical>7</Radical></span>;
        if (opt === '49·√2') return <span className="inline-flex items-center gap-1">49 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ανάλυση', details: '98 ＝ 49 · 2' },
        { label: 'Μορφή', details: '√98 ＝ √49 · √2 ＝ 7 · √2' }
      ],
      explanation: '√98 ＝ √(49 · 2) ＝ 7 · √2.'
    };
  }
];

// POOL Q11: Ρητοποίηση Παρονομαστή & Σύνθετα Κλάσματα
const PROBLEM_POOL_Q11 = [
  // 1. Ρητοποίηση του 1/√3 = √3 / 3
  () => {
    return {
      title: 'Ρητοποίηση Παρονομαστή με √3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Μετατρέποντας το κλάσμα <Frac num="1" den={<Radical>3</Radical>} /> σε ισοδύναμο με ρητό παρονομαστή, ποιο αποτέλεσμα προκύπτει;
        </span>
      ),
      correct: '√3/3',
      type: 'mcq',
      distractors: () => ['3/√3', '1/3', '√3/9'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√3/3') return <Frac num={<Radical>3</Radical>} den="3" />;
        if (opt === '3/√3') return <Frac num="3" den={<Radical>3</Radical>} />;
        if (opt === '1/3') return <Frac num="1" den="3" />;
        if (opt === '√3/9') return <Frac num={<Radical>3</Radical>} den="9" />;
        return opt;
      },
      tableData: [
        { label: 'Πολλαπλασιασμός με √3', details: '(1 · √3) / (√3 · √3)' },
        { label: 'Υπολογισμός παρονομαστή', details: '(√3)² ＝ 3' },
        { label: 'Τελικό κλάσμα', details: '√3 / 3' }
      ],
      explanation: 'Πολλαπλασιάζουμε αριθμητή και παρονομαστή επί √3: (1 · √3) / 3 ＝ √3 / 3.'
    };
  },
  // 2. Ρητοποίηση του 10/√5 = 2√5
  () => {
    return {
      title: 'Ρητοποίηση και Απλοποίηση με √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο ακέραιος συντελεστής στην απλοποιημένη μορφή του κλάσματος <Frac num="10" den={<Radical>5</Radical>} /> (στη μορφή α · <Radical>5</Radical>);
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: 'Ρητοποίηση', details: '(10 · √5) / (√5 · √5) ＝ (10 · √5) / 5' },
        { label: 'Απλοποίηση', details: '10 / 5 ＝ 2' },
        { label: 'Αποτέλεσμα', details: '2 · √5' }
      ],
      explanation: '(10 · √5) / 5 ＝ 2 · √5. Άρα ο συντελεστής είναι 2.'
    };
  },
  // 3. Ρητοποίηση του 14/√7 = 2√7
  () => {
    return {
      title: 'Ρητοποίηση με √7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η απλοποιημένη μορφή του κλάσματος <Frac num="14" den={<Radical>7</Radical>} />;
        </span>
      ),
      correct: '2·√7',
      type: 'mcq',
      distractors: () => ['7·√2', '2', '14·√7'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '2·√7') return <span className="inline-flex items-center gap-1">2 · <Radical>7</Radical></span>;
        if (opt === '7·√2') return <span className="inline-flex items-center gap-1">7 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ρητοποίηση', details: '(14 · √7) / 7' },
        { label: 'Αποτέλεσμα', details: '2 · √7' }
      ],
      explanation: '(14 · √7) / 7 ＝ 2 · √7.'
    };
  },
  // 4. Άθροισμα μετά από ρητοποίηση: √2 + 2/√2 = 2√2
  () => {
    return {
      title: 'Άθροισμα Ακέραιης Ρίζας και Κλάσματος',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση <Radical>2</Radical> ＋ <Frac num="2" den={<Radical>2</Radical>} />;
        </span>
      ),
      correct: '2·√2',
      type: 'mcq',
      distractors: () => ['3·√2', '2', '4'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '2·√2') return <span className="inline-flex items-center gap-1">2 · <Radical>2</Radical></span>;
        if (opt === '3·√2') return <span className="inline-flex items-center gap-1">3 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ρητοποίηση 2ου όρου', details: '2 / √2 ＝ (2 · √2) / 2 ＝ √2' },
        { label: 'Πρόσθεση', details: '√2 ＋ √2 ＝ 2 · √2' }
      ],
      explanation: 'Το 2/√2 ρητοποιείται σε √2. Επομένως √2 ＋ √2 ＝ 2 · √2.'
    };
  },
  // 5. Διαφορά ριζών με απλοποίηση: √48 - √27 = 4√3 - 3√3 = √3
  () => {
    return {
      title: 'Διαφορά Ριζών με Εξαγωγή Παράγοντα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το απλοποιημένο αποτέλεσμα της διαφοράς <Radical>48</Radical> － <Radical>27</Radical>;
        </span>
      ),
      correct: '√3',
      type: 'mcq',
      distractors: () => ['√21', '3·√3', '2·√3'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√21') return <Radical>21</Radical>;
        if (opt === '3·√3') return <span className="inline-flex items-center gap-1">3 · <Radical>3</Radical></span>;
        if (opt === '2·√3') return <span className="inline-flex items-center gap-1">2 · <Radical>3</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ανάλυση √48', details: '√(16 · 3) ＝ 4 · √3' },
        { label: 'Ανάλυση √27', details: '√(9 · 3) ＝ 3 · √3' },
        { label: 'Αφαίρεση', details: '4·√3 － 3·√3 ＝ 1·√3 ＝ √3' }
      ],
      explanation: '√48 ＝ 4√3 και √27 ＝ 3√3. Η διαφορά τους είναι (4 － 3) · √3 ＝ √3.'
    };
  },
  // 6. Άθροισμα ριζών: √50 + √18 = 5√2 + 3√2 = 8√2
  () => {
    return {
      title: 'Άθροισμα Ριζών με Αναγωγή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο συντελεστής του <Radical>2</Radical> στο άθροισμα <Radical>50</Radical> ＋ <Radical>18</Radical>;
        </span>
      ),
      correct: 8,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση √50', details: '√(25 · 2) ＝ 5 · √2' },
        { label: 'Ανάλυση √18', details: '√(9 · 2) ＝ 3 · √2' },
        { label: 'Άθροισμα', details: '5·√2 ＋ 3·√2 ＝ 8·√2' }
      ],
      explanation: '√50 ＝ 5√2 και √18 ＝ 3√2. Άρα 5√2 ＋ 3√2 ＝ 8√2. Ο συντελεστής είναι 8.'
    };
  }
];

// POOL Q12: Σύνθετες Γεωμετρικές & Πρακτικές Εφαρμογές Ριζών
const PROBLEM_POOL_Q12 = [
  // 1. Εμβαδόν Ορθογωνίου με διαστάσεις ρίζες: L = √27, W = √3 => E = 9
  () => {
    return {
      title: 'Εμβαδόν Ορθογωνίου με Ριζικές Διαστάσεις',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα ορθογώνιο έχει μήκος L ＝ <Radical>27</Radical> m και πλάτος W ＝ <Radical>3</Radical> m. Πόσο είναι το εμβαδόν του σε m²;
        </span>
      ),
      correct: 9,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Τύπος εμβαδού', details: 'Ε ＝ L · W' },
        { label: 'Γινόμενο ριζών', details: '√27 · √3 ＝ √(27 · 3) ＝ √81' },
        { label: 'Τελική τιμή', details: '9 m²' }
      ],
      explanation: 'Ε ＝ √27 · √3 ＝ √(27 · 3) ＝ √81 ＝ 9 m².'
    };
  },
  // 2. Περίμετρος Τετραγώνου με γνωστό εμβαδόν: E = 72 => πλευρά = √72 = 6√2 => Περίμετρος = 24√2
  () => {
    return {
      title: 'Περίμετρος Τετραγώνου από Εμβαδόν',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα τετράγωνο έχει εμβαδόν 72 cm². Ποιος είναι ο συντελεστής του <Radical>2</Radical> στην περίμετρό του Π ＝ α · <Radical>2</Radical> cm;
        </span>
      ),
      correct: 24,
      type: 'input',
      tableData: [
        { label: 'Μήκος πλευράς s', details: 's ＝ √72 ＝ √(36 · 2) ＝ 6 · √2 cm' },
        { label: 'Περίμετρος Π', details: '4 · s ＝ 4 · (6 · √2) ＝ 24 · √2 cm' }
      ],
      explanation: 'Η πλευρά είναι s ＝ √72 ＝ 6√2 cm. Η περίμετρος είναι 4 · 6√2 ＝ 24√2 cm. Ο συντελεστής είναι 24.'
    };
  },
  // 3. Διαγώνιος Ορθογωνίου: πλευρές √12 και 2 => d^2 = 12 + 4 = 16 => d = 4
  () => {
    return {
      title: 'Διαγώνιος Ορθογωνίου με Ριζική Πλευρά',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ορθογώνιο παραλληλόγραμμο έχει πλευρές μήκους <Radical>12</Radical> cm και 2 cm. Πόσο είναι το μήκος της διαγωνίου του σε cm;
        </span>
      ),
      correct: 4,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'Πυθαγόρειο Θεώρημα', details: 'd² ＝ (√12)² ＋ 2²' },
        { label: 'Υπολογισμός τετραγώνων', details: 'd² ＝ 12 ＋ 4 ＝ 16' },
        { label: 'Διαγώνιος d', details: 'd ＝ √16 ＝ 4 cm' }
      ],
      explanation: 'd² ＝ (√12)² ＋ 2² ＝ 12 ＋ 4 ＝ 16 ⇒ d ＝ √16 ＝ 4 cm.'
    };
  },
  // 4. Λόγος εμβαδών δύο τετραγώνων: πλευρές √8 και √2 => λόγος = (√8/√2)^2 = (√4)^2 = 4
  () => {
    return {
      title: 'Λόγος Εμβαδών Τετραγώνων',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Δύο τετράγωνα έχουν πλευρές μήκους <Radical>8</Radical> cm και <Radical>2</Radical> cm αντίστοιχα. Πόσες φορές μεγαλύτερο είναι το εμβαδόν του πρώτου τετραγώνου;
        </span>
      ),
      correct: 4,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Εμβαδόν 1ου (Ε₁)', details: '(√8)² ＝ 8 cm²' },
        { label: 'Εμβαδόν 2ου (Ε₂)', details: '(√2)² ＝ 2 cm²' },
        { label: 'Λόγος Ε₁ / Ε₂', details: '8 / 2 ＝ 4' }
      ],
      explanation: 'Ε₁ ＝ (√8)² ＝ 8 και Ε₂ ＝ (√2)² ＝ 2. Ο λόγος τους είναι 8 / 2 ＝ 4 φορές.'
    };
  },
  // 5. Υποτείνουσα Ισοσκελούς Ορθογωνίου με πλευρά √18: c^2 = 18 + 18 = 36 => c = 6
  () => {
    return {
      title: 'Υποτείνουσα Ισοσκελούς Ορθογωνίου Τριγώνου',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους <Radical>18</Radical> m η καθεμία. Πόσο είναι το μήκος της υποτείνουσάς του σε μέτρα;
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'Πυθαγόρειο c²', details: '(√18)² ＋ (√18)² ＝ 18 ＋ 18 ＝ 36' },
        { label: 'Υποτείνουσα c', details: 'c ＝ √36 ＝ 6 m' }
      ],
      explanation: 'c² ＝ 18 ＋ 18 ＝ 36 ⇒ c ＝ √36 ＝ 6 m.'
    };
  },
  // 6. Εμβαδόν ρόμβου με διαγωνίους ρίζες: E = (d1 * d2) / 2 = (√20 * √5) / 2 = √100 / 2 = 5
  () => {
    return {
      title: 'Εμβαδόν Ρόμβου με Ριζικές Διαγωνίους',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένας ρόμβος έχει διαγωνίους μήκους d₁ ＝ <Radical>20</Radical> cm και d₂ ＝ <Radical>5</Radical> cm. Πόσο είναι το εμβαδόν του σε cm²;
        </span>
      ),
      correct: 5,
      type: 'input',
      unit: 'cm²',
      tableData: [
        { label: 'Τύπος εμβαδού ρόμβου', details: 'Ε ＝ (d₁ · d₂) / 2' },
        { label: 'Γινόμενο διαγωνίων', details: '√20 · √5 ＝ √100 ＝ 10' },
        { label: 'Υπολογισμός', details: '10 / 2 ＝ 5 cm²' }
      ],
      explanation: 'Ε ＝ (√20 · √5) / 2 ＝ √100 / 2 ＝ 10 / 2 ＝ 5 cm².'
    };
  }
];

export default function IdiotitesRizonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Επιμερισμός ρίζας σε πρόσθεση
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Ρίζα Αθροίσματος',
      prompt: q1IsCorrect
        ? 'Για θετικούς αριθμούς α και β, η ισότητα √(α ＋ β) ＝ √α ＋ √β ΔΕΝ ισχύει γενικά (είναι λάθος).'
        : 'Για οποιουσδήποτε θετικούς αριθμούς α και β, ισχύει πάντοτε ότι √(α ＋ β) ＝ √α ＋ √β.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η τετραγωνική ρίζα επιμερίζεται ΜΟΝΟ στο γινόμενο και στο πηλίκο, ποτέ στο άθροισμα (π.χ. √(16＋9) ＝ 5 ≠ 4＋3 ＝ 7).'
    });

    // Q2: True / False - Ρίζα τετραγώνου με απόλυτη τιμή
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Ρίζα Τετραγώνου Αριθμού',
      prompt: q2Choice
        ? 'Για κάθε πραγματικό αριθμό α, ισχύει πάντοτε √(α²) ＝ |α|.'
        : 'Για κάθε πραγματικό αριθμό α, ισχύει πάντοτε √(α²) ＝ α, ακόμα κι αν ο α είναι αρνητικός.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Επειδή η τετραγωνική ρίζα είναι εξ ορισμού μη αρνητικός αριθμός, ισχύει √(α²) ＝ |α| (π.χ. √((－5)²) ＝ |－5| ＝ 5).'
    });

    // Q3: MCQ - Τιμή του √((-7)^2)
    qList.push({
      id: 3,
      title: 'Υπολογισμός Ρίζας Τετραγώνου Αρνητικού',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Radical>(－7)²</Radical>;
        </span>
      ),
      type: 'mcq',
      correct: '7',
      options: ensureFourUniqueOptions('7', () => ['－7', '±7', '49'][randInt(0, 2)]),
      explanation: '√((－7)²) ＝ |－7| ＝ 7.'
    });

    // Q4: MCQ - Ιδιότητα γινομένου ριζών
    qList.push({
      id: 4,
      title: 'Ιδιότητα Γινομένου Ριζών',
      prompt: 'Για μη αρνητικούς αριθμούς α, β, ποια από τις παρακάτω σχέσεις είναι πάντοτε αληθής;',
      type: 'mcq',
      correct: '√α · √β ＝ √(α · β)',
      options: ensureFourUniqueOptions('√α · √β ＝ √(α · β)', () => [
        '√α ＋ √β ＝ √(α ＋ β)',
        '√α · √β ＝ α · β',
        '√(α · β) ＝ α · √β'
      ][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === '√α · √β ＝ √(α · β)') return <span className="inline-flex items-center gap-1"><Radical>α</Radical> · <Radical>β</Radical> ＝ <Radical>α · β</Radical></span>;
        if (opt === '√α ＋ √β ＝ √(α ＋ β)') return <span className="inline-flex items-center gap-1"><Radical>α</Radical> ＋ <Radical>β</Radical> ＝ <Radical>α ＋ β</Radical></span>;
        if (opt === '√α · √β ＝ α · β') return <span className="inline-flex items-center gap-1"><Radical>α</Radical> · <Radical>β</Radical> ＝ α · β</span>;
        if (opt === '√(α · β) ＝ α · √β') return <span className="inline-flex items-center gap-1"><Radical>α · β</Radical> ＝ α · <Radical>β</Radical></span>;
        return opt;
      },
      explanation: 'Το γινόμενο των τετραγωνικών ριζών ισούται με την τετραγωνική ρίζα του γινομένου.'
    });

    // Q5: Input - Υπολογισμός √2 · √8
    qList.push({
      id: 5,
      title: 'Υπολογισμός Απλού Γινομένου Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>2</Radical> · <Radical>8</Radical>;
        </span>
      ),
      type: 'input',
      correct: 4,
      explanation: '√2 · √8 ＝ √(2 · 8) ＝ √16 ＝ 4.'
    });

    // Q6: MCQ - Εξαγωγή παράγοντα από το √20
    qList.push({
      id: 6,
      title: 'Απλοποίηση Ρίζας √20',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η απλοποιημένη μορφή του αριθμού <Radical>20</Radical>;
        </span>
      ),
      type: 'mcq',
      correct: '2·√5',
      options: ensureFourUniqueOptions('2·√5', () => ['4·√5', '5·√2', '10·√2'][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === '2·√5') return <span className="inline-flex items-center gap-1">2 · <Radical>5</Radical></span>;
        if (opt === '4·√5') return <span className="inline-flex items-center gap-1">4 · <Radical>5</Radical></span>;
        if (opt === '5·√2') return <span className="inline-flex items-center gap-1">5 · <Radical>2</Radical></span>;
        if (opt === '10·√2') return <span className="inline-flex items-center gap-1">10 · <Radical>2</Radical></span>;
        return opt;
      },
      explanation: '√20 ＝ √(4 · 5) ＝ √4 · √5 ＝ 2 · √5.'
    });

    // Q7: Input - Υπολογισμός πηλίκου √50 / √2
    qList.push({
      id: 7,
      title: 'Υπολογισμός Πηλίκου Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή του πηλίκου <Frac num={<Radical>50</Radical>} den={<Radical>2</Radical>} />;
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: '√50 / √2 ＝ √(50 / 2) ＝ √25 ＝ 5.'
    });

    // Q8: MCQ - Ρητοποίηση του 2/√2
    qList.push({
      id: 8,
      title: 'Ρητοποίηση Παρονομαστή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Σε ποιον αριθμό απλοποιείται το κλάσμα <Frac num="2" den={<Radical>2</Radical>} />;
        </span>
      ),
      type: 'mcq',
      correct: '√2',
      options: ensureFourUniqueOptions('√2', () => ['1', '2', '2·√2'][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '2·√2') return <span className="inline-flex items-center gap-1">2 · <Radical>2</Radical></span>;
        return opt;
      },
      explanation: 'Πολλαπλασιάζουμε με √2: (2 · √2) / 2 ＝ √2.'
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
      title="Ασκήσεις: Ιδιότητες Τετραγωνικών Ριζών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στις ιδιότητες των τετραγωνικών ριζών, γινόμενο, πηλίκο, απλοποίηση και ρητοποίηση με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/06-idiotites-rizon"
      backText="Θεωρία Κεφ. 6"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/06-idiotites-rizon"
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
                Ιδιότητες Τετραγωνικών Ριζών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα απλοποίησης, γινομένου, πηλίκου και ρητοποίησης.
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις ιδιότητες των τετραγωνικών ριζών και τις τεχνικές ρητοποίησης.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για την εξαγωγή παραγόντων από τη ρίζα!'}
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
                      <div className="mt-1">{q.explanation}</div>
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
