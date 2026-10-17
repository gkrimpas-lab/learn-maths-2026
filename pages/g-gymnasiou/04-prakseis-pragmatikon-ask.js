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

// POOL Q9: Αναγωγή ομοίων ριζών και απλοποίηση (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    const a = randInt(3, 7);
    const b = randInt(2, 5);
    const total = a + b;
    return {
      title: 'Πρόσθεση Ομοίων Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το αποτέλεσμα της πρόσθεσης {a} · <Radical>3</Radical> ＋ {b} · <Radical>3</Radical>;
        </span>
      ),
      correct: `${total}·√3`,
      type: 'mcq',
      distractors: () => [`${total}·√6`, `${a * b}·√3`, `${total}`][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${total}·√3`) return <span className="inline-flex items-center gap-1">{total} · <Radical>3</Radical></span>;
        if (opt === `${total}·√6`) return <span className="inline-flex items-center gap-1">{total} · <Radical>6</Radical></span>;
        if (opt === `${a * b}·√3`) return <span className="inline-flex items-center gap-1">{a * b} · <Radical>3</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Όμοιοι όροι', details: `${a} · √3 και ${b} · √3` },
        { label: 'Κοινός παράγοντας', details: `(${a} ＋ ${b}) · √3` },
        { label: 'Αποτέλεσμα', details: `${total} · √3` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Προσθέτουμε τους συντελεστές και διατηρούμε τη ρίζα: ({a} ＋ {b}) · <Radical>3</Radical> ＝ {total} · <Radical>3</Radical>.
        </span>
      )
    };
  },
  () => {
    const a = randInt(6, 10);
    const b = randInt(2, 5);
    const diff = a - b;
    return {
      title: 'Αφαίρεση Ομοίων Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο συντελεστής του <Radical>2</Radical> στην παράσταση {a} · <Radical>2</Radical> － {b} · <Radical>2</Radical>;
        </span>
      ),
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'Πράξη συντελεστών', details: `${a} － ${b} ＝ ${diff}` },
        { label: 'Τελικός όρος', details: `${diff} · √2` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αφαιρούμε τους συντελεστές: {a} － {b} ＝ {diff}. Άρα {diff} · <Radical>2</Radical>.
        </span>
      )
    };
  },
  () => {
    const k = randInt(2, 5);
    const total = 2 * k;
    return {
      title: 'Διπλασιασμός Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το αποτέλεσμα της πράξης {k} · <Radical>5</Radical> ＋ {k} · <Radical>5</Radical>;
        </span>
      ),
      correct: `${total}·√5`,
      type: 'mcq',
      distractors: () => [`${k}·√10`, `${total}·√10`, `${k * k}·√5`][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${total}·√5`) return <span className="inline-flex items-center gap-1">{total} · <Radical>5</Radical></span>;
        if (opt === `${k}·√10`) return <span className="inline-flex items-center gap-1">{k} · <Radical>10</Radical></span>;
        if (opt === `${total}·√10`) return <span className="inline-flex items-center gap-1">{total} · <Radical>10</Radical></span>;
        if (opt === `${k * k}·√5`) return <span className="inline-flex items-center gap-1">{k * k} · <Radical>5</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Άθροισμα συντελεστών', details: `${k} ＋ ${k} ＝ ${total}` },
        { label: 'Τελική μορφή', details: `${total} · √5` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1">
          {k} · <Radical>5</Radical> ＋ {k} · <Radical>5</Radical> ＝ {total} · <Radical>5</Radical>. Οι υπόριζες ποσότητες δεν προστίθενται ποτέ!
        </span>
      )
    };
  },
  () => {
    const a = randInt(4, 8);
    return {
      title: 'Μηδενισμός Αντίθετων Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η αριθμητική τιμή της παράστασης {a} · <Radical>7</Radical> － {a} · <Radical>7</Radical>;
        </span>
      ),
      correct: 0,
      type: 'input',
      tableData: [
        { label: 'Συντελεστές', details: `${a} － ${a} ＝ 0` },
        { label: 'Γινόμενο', details: `0 · √7 ＝ 0` }
      ],
      explanation: 'Δύο αντίθετοι πραγματικοί αριθμοί έχουν άθροισμα ίσο με 0.'
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 6);
    return {
      title: 'Αναγωγή με Ακέραιο και Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Στην παράσταση {a} · <Radical>2</Radical> ＋ 5 ＋ {b} · <Radical>2</Radical> － 2, ποιος είναι ο τελικός συντελεστής του <Radical>2</Radical>;
        </span>
      ),
      correct: a + b,
      type: 'input',
      tableData: [
        { label: 'Όροι με ρίζα', details: `(${a} ＋ ${b}) · √2 ＝ ${a + b} · √2` },
        { label: 'Σταθεροί όροι', details: `5 － 2 ＝ 3` },
        { label: 'Αποτέλεσμα', details: `${a + b} · √2 ＋ 3` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Προσθέτουμε μόνο τους συντελεστές των όμοιων ριζών: {a} ＋ {b} ＝ {a + b}.
        </span>
      )
    };
  },
  () => {
    const c = randInt(2, 5);
    return {
      title: 'Απλοποίηση Παράστασης Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Στην παράσταση 10 · <Radical>3</Radical> － {c} · <Radical>3</Radical> － 2 · <Radical>3</Radical>, ποιος είναι ο συντελεστής του <Radical>3</Radical>;
        </span>
      ),
      correct: 8 - c,
      type: 'input',
      tableData: [
        { label: 'Πράξη συντελεστών', details: `10 － ${c} － 2 ＝ ${8 - c}` },
        { label: 'Τελικός όρος', details: `${8 - c} · √3` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1">
          10 － {c} － 2 ＝ {8 - c}. Άρα {8 - c} · <Radical>3</Radical>.
        </span>
      )
    };
  }
];

// POOL Q10: Εφαρμογή της επιμεριστικής ιδιότητας (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    const k = randInt(2, 4);
    const b = randInt(3, 7);
    const resConst = k * b;
    return {
      title: 'Επιμεριστική σε Άθροισμα με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αναπτύσσοντας την παράσταση {k} · (<Radical>2</Radical> ＋ {b}), ποιος είναι ο σταθερός (ακέραιος) όρος;
        </span>
      ),
      correct: resConst,
      type: 'input',
      tableData: [
        { label: 'Επιμερισμός', details: `${k} · √2 ＋ ${k} · ${b}` },
        { label: 'Σταθερός όρος', details: `${k} · ${b} ＝ ${resConst}` }
      ],
      explanation: `Πολλαπλασιάζουμε τον αριθμό ${k} με κάθε όρο της παρένθεσης: ${k} · ${b} ＝ ${resConst}.`
    };
  },
  () => {
    const k = randInt(2, 4);
    const a = randInt(2, 5);
    const resA = k * a;
    return {
      title: 'Επιμεριστική και Συντελεστής Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αναπτύσσοντας την παράσταση {k} · ({a} · <Radical>3</Radical> － 4), ποιος είναι ο συντελεστής του <Radical>3</Radical>;
        </span>
      ),
      correct: resA,
      type: 'input',
      tableData: [
        { label: 'Πολλαπλασιασμός ριζικού όρου', details: `${k} · (${a} · √3) ＝ (${k} · ${a}) · √3 ＝ ${resA} · √3` }
      ],
      explanation: `Ο συντελεστής του ριζικού όρου είναι ${k} · ${a} ＝ ${resA}.`
    };
  },
  () => {
    return {
      title: 'Ανάπτυγμα με Αρνητικό Συντελεστή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το ανάπτυγμα της παράστασης －2 · (<Radical>5</Radical> － 3);
        </span>
      ),
      correct: '－2·√5 ＋ 6',
      type: 'mcq',
      distractors: () => ['－2·√5 － 6', '2·√5 ＋ 6', '－2·√5 ＋ 3'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '－2·√5 ＋ 6') return <span className="inline-flex items-center gap-1">－2 · <Radical>5</Radical> ＋ 6</span>;
        if (opt === '－2·√5 － 6') return <span className="inline-flex items-center gap-1">－2 · <Radical>5</Radical> － 6</span>;
        if (opt === '2·√5 ＋ 6') return <span className="inline-flex items-center gap-1">2 · <Radical>5</Radical> ＋ 6</span>;
        if (opt === '－2·√5 ＋ 3') return <span className="inline-flex items-center gap-1">－2 · <Radical>5</Radical> ＋ 3</span>;
        return opt;
      },
      tableData: [
        { label: '1ο γινόμενο', details: '(－2) · √5 ＝ －2·√5' },
        { label: '2ο γινόμενο', details: '(－2) · (－3) ＝ ＋6' },
        { label: 'Τελικό ανάπτυγμα', details: '－2·√5 ＋ 6' }
      ],
      explanation: 'Το πλην με το πλην δίνει συν: (－2) · (－3) ＝ ＋6.'
    };
  },
  () => {
    const k = randInt(3, 6);
    return {
      title: 'Κοινός Παράγοντας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν στην παράσταση {k} · <Radical>2</Radical> ＋ {k} · 5 βγάλουμε κοινό παράγοντα το {k}, ποια έκφραση μένει μέσα στην παρένθεση;
        </span>
      ),
      correct: '√2 ＋ 5',
      type: 'mcq',
      distractors: () => ['√2 － 5', '2 ＋ 5', '√2 ＋ 10'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√2 ＋ 5') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> ＋ 5</span>;
        if (opt === '√2 － 5') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> － 5</span>;
        if (opt === '√2 ＋ 10') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> ＋ 10</span>;
        return opt;
      },
      tableData: [
        { label: 'Κοινός παράγοντας', details: `${k}` },
        { label: 'Μορφή', details: `${k} · (√2 ＋ 5)` }
      ],
      explanation: 'Εφαρμόζουμε την επιμεριστική ιδιότητα ανάποδα (παραγοντοποίηση).'
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(1, 3);
    const resA = 3 * a;
    const resB = 3 * b;
    return {
      title: 'Ανάπτυγμα Διωνύμου με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αναπτύσσοντας την παράσταση 3 · ({a} · <Radical>7</Radical> ＋ {b}), ποιο αποτέλεσμα προκύπτει;
        </span>
      ),
      correct: `${resA}·√7 ＋ ${resB}`,
      type: 'mcq',
      distractors: () => [
        `${resA}·√7 ＋ ${b}`,
        `${a}·√7 ＋ ${resB}`,
        `${resA + 3}·√7 ＋ ${resB}`
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${resA}·√7 ＋ ${resB}`) return <span className="inline-flex items-center gap-1">{resA} · <Radical>7</Radical> ＋ {resB}</span>;
        if (opt === `${resA}·√7 ＋ ${b}`) return <span className="inline-flex items-center gap-1">{resA} · <Radical>7</Radical> ＋ {b}</span>;
        if (opt === `${a}·√7 ＋ ${resB}`) return <span className="inline-flex items-center gap-1">{a} · <Radical>7</Radical> ＋ {resB}</span>;
        return opt;
      },
      tableData: [
        { label: '1ος όρος', details: `3 · ${a}·√7 ＝ ${resA}·√7` },
        { label: '2ος όρος', details: `3 · ${b} ＝ ${resB}` },
        { label: 'Τελικό', details: `${resA}·√7 ＋ ${resB}` }
      ],
      explanation: `3 · (${a}·√7) ＋ 3 · ${b} ＝ ${resA}·√7 ＋ ${resB}.`
    };
  },
  () => {
    const k = randInt(2, 5);
    return {
      title: 'Απαλοιφή Παρενθέσεων και Αναγωγή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Στην παράσταση 4 · (<Radical>2</Radical> ＋ 1) － {k} · <Radical>2</Radical>, ποιος είναι ο σταθερός όρος;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Ανάπτυγμα', details: `4·√2 ＋ 4 － ${k}·√2` },
        { label: 'Σταθερός όρος', details: '4' }
      ],
      explanation: 'Ο σταθερός όρος προκύπτει από το 4 · 1 ＝ 4.'
    };
  }
];

// POOL Q11: Κανόνες προσήμων & απαλοιφή παρενθέσεων (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    const a = randInt(3, 7);
    const b = randInt(2, 6);
    const res = -a * -b;
    return {
      title: 'Γινόμενο Αρνητικών Αριθμών',
      prompt: `Ποιο είναι το αποτέλεσμα του γινομένου (－${a}) · (－${b});`,
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Κανόνας προσήμων', details: '(－) · (－) ＝ ＋' },
        { label: 'Υπολογισμός', details: `${a} · ${b} ＝ ${res}` }
      ],
      explanation: `Το γινόμενο δύο ομόσημων αρνητικών αριθμών είναι θετικό: (－${a}) · (－${b}) ＝ ＋${res}.`
    };
  },
  () => {
    const a = randInt(12, 24);
    const b = randInt(2, 4);
    const res = -(a / b);
    return {
      title: 'Πηλίκο Ετερόσημων Αριθμών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το πηλίκο <Frac num={`－${a}`} den={`${b}`} />;
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Κανόνας προσήμων', details: '(－) / (＋) ＝ －' },
        { label: 'Υπολογισμός', details: `－(${a} / ${b}) ＝ ${res}` }
      ],
      explanation: `Το πηλίκο ετερόσημων αριθμών είναι πάντοτε αρνητικό: ${res}.`
    };
  },
  () => {
    const k = randInt(3, 8);
    return {
      title: 'Απαλοιφή Παρενθέσεων με Μείον',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Απαλείφοντας την παρένθεση στην παράσταση －(<Radical>3</Radical> － ${k}), ποια έκφραση προκύπτει;
        </span>
      ),
      correct: `－√3 ＋ ${k}`,
      type: 'mcq',
      distractors: () => [
        `－√3 － ${k}`,
        `√3 ＋ ${k}`,
        `√3 － ${k}`
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `－√3 ＋ ${k}`) return <span className="inline-flex items-center gap-1">－<Radical>3</Radical> ＋ {k}</span>;
        if (opt === `－√3 － ${k}`) return <span className="inline-flex items-center gap-1">－<Radical>3</Radical> － {k}</span>;
        if (opt === `√3 ＋ ${k}`) return <span className="inline-flex items-center gap-1"><Radical>3</Radical> ＋ {k}</span>;
        return opt;
      },
      tableData: [
        { label: 'Κανόνας', details: 'Το πρόσημο πλην αλλάζει όλα τα πρόσημα μέσα στην παρένθεση' },
        { label: 'Αποτέλεσμα', details: `－√3 ＋ ${k}` }
      ],
      explanation: 'Το μείον αλλάζει το √3 σε －√3 και το －' + k + ' σε ＋' + k + '.'
    };
  },
  () => {
    const a = randInt(2, 5);
    const b = randInt(2, 4);
    const c = randInt(1, 3);
    const res = -a * b * -c;
    return {
      title: 'Γινόμενο Τριών Παραγόντων',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης (－${a}) · ${b} · (－${c});`,
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Πλήθος αρνητικών παραγόντων', details: '2 αρνητικοί (άρτιος αριθμός => θετικό πρόσημο)' },
        { label: 'Υπολογισμός', details: `${a} · ${b} · ${c} ＝ ${res}` }
      ],
      explanation: `Εφόσον έχουμε άρτιο πλήθος αρνητικών παραγόντων (δύο μείον), το αποτέλεσμα είναι θετικό: ＋${res}.`
    };
  },
  () => {
    const k = randInt(4, 9);
    return {
      title: 'Απλοποίηση με Αντίθετο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση (<Radical>2</Radical> ＋ ${k}) ＋ (－<Radical>2</Radical> － ${k});
        </span>
      ),
      correct: 0,
      type: 'input',
      tableData: [
        { label: 'Άθροισμα αντιθέτων', details: '(√2 － √2) ＋ (' + k + ' － ' + k + ')' },
        { label: 'Τελικό', details: '0' }
      ],
      explanation: 'Όλοι οι όροι είναι αντίθετοι ανά δύο και αλληλοεξουδετερώνονται: 0.'
    };
  },
  () => {
    const a = randInt(5, 10);
    return {
      title: 'Αφαίρεση Παρένθεσης με Θετικό Όρο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Στην παράσταση ${a} － (<Radical>5</Radical> ＋ ${a}), ποιος αριθμός απομένει;
        </span>
      ),
      correct: '－√5',
      type: 'mcq',
      distractors: () => ['√5', '0', `${2 * a}`][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '－√5') return <span className="inline-flex items-center gap-1">－<Radical>5</Radical></span>;
        if (opt === '√5') return <Radical>5</Radical>;
        return opt;
      },
      tableData: [
        { label: 'Απαλοιφή', details: `${a} － √5 － ${a}` },
        { label: 'Αναγωγή', details: `${a} － ${a} － √5 ＝ －√5` }
      ],
      explanation: 'Οι ακέραιοι αλληλοεξουδετερώνονται και μένει －√5.'
    };
  }
];

// POOL Q12: Γεωμετρικά και σύνθετα προβλήματα πραγματικών (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    const a = randInt(2, 4);
    const b = randInt(1, 3);
    const perimA = 2 * (a + 1);
    const perimB = 2 * (b + 2);
    return {
      title: 'Περίμετρος Ορθογωνίου με Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα ορθογώνιο έχει μήκος L ＝ {a} · <Radical>3</Radical> ＋ {b} και πλάτος W ＝ <Radical>3</Radical> ＋ 2. Ποιο είναι το πολυώνυμο της περιμέτρου Π ＝ 2 · (L ＋ W);
        </span>
      ),
      correct: `${perimA}·√3 ＋ ${perimB}`,
      type: 'mcq',
      distractors: () => [
        `${perimA}·√3 ＋ ${b + 2}`,
        `${a + 1}·√3 ＋ ${perimB}`,
        `${perimA * 2}·√3 ＋ ${perimB}`
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${perimA}·√3 ＋ ${perimB}`) return <span className="inline-flex items-center gap-1">{perimA} · <Radical>3</Radical> ＋ {perimB}</span>;
        if (opt === `${perimA}·√3 ＋ ${b + 2}`) return <span className="inline-flex items-center gap-1">{perimA} · <Radical>3</Radical> ＋ {b + 2}</span>;
        if (opt === `${a + 1}·√3 ＋ ${perimB}`) return <span className="inline-flex items-center gap-1">{a + 1} · <Radical>3</Radical> ＋ {perimB}</span>;
        return opt;
      },
      tableData: [
        { label: 'L ＋ W', details: `(${a}·√3 ＋ ${b}) ＋ (√3 ＋ 2) ＝ ${a + 1}·√3 ＋ ${b + 2}` },
        { label: '2 · (L ＋ W)', details: `2 · (${a + 1}·√3 ＋ ${b + 2}) ＝ ${perimA}·√3 ＋ ${perimB}` }
      ],
      explanation: `Π ＝ 2 · [(${a}·√3 ＋ ${b}) ＋ (√3 ＋ 2)] ＝ 2 · (${a + 1}·√3 ＋ ${b + 2}) ＝ ${perimA}·√3 ＋ ${perimB}.`
    };
  },
  () => {
    const side = randInt(2, 5);
    const perim = 3 * side;
    return {
      title: 'Περίμετρος Ισοπλεύρου Τριγώνου',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ισόπλευρο τρίγωνο έχει πλευρά μήκους {side} · <Radical>2</Radical> cm. Πόσο είναι το ακριβές μήκος της περιμέτρου του σε cm;
        </span>
      ),
      correct: `${perim}·√2`,
      type: 'mcq',
      distractors: () => [`${perim}·√6`, `${side * side}·√2`, `${side}·√6`][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${perim}·√2`) return <span className="inline-flex items-center gap-1">{perim} · <Radical>2</Radical> cm</span>;
        if (opt === `${perim}·√6`) return <span className="inline-flex items-center gap-1">{perim} · <Radical>6</Radical> cm</span>;
        if (opt === `${side * side}·√2`) return <span className="inline-flex items-center gap-1">{side * side} · <Radical>2</Radical> cm</span>;
        return opt;
      },
      tableData: [
        { label: 'Πλευρά α', details: `${side}·√2 cm` },
        { label: 'Τύπος περιμέτρου', details: 'Π ＝ 3 · α' },
        { label: 'Υπολογισμός', details: `3 · (${side}·√2) ＝ ${perim}·√2 cm` }
      ],
      explanation: `Πολλαπλασιάζουμε την πλευρά επί 3: 3 · (${side}·√2) ＝ ${perim}·√2 cm.`
    };
  },
  () => {
    const k = randInt(2, 4);
    const area = k * k * 5;
    return {
      title: 'Εμβαδόν Τετραγώνου με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα τετράγωνο έχει πλευρά s ＝ {k} · <Radical>5</Radical> m. Πόσο είναι το εμβαδόν του σε m²;
        </span>
      ),
      correct: area,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Πλευρά s', details: `${k}·√5 m` },
        { label: 'Τύπος εμβαδού', details: 'E ＝ s²' },
        { label: 'Υπολογισμός', details: `(${k}·√5)² ＝ ${k}² · (√5)² ＝ ${k * k} · 5 ＝ ${area} m²` }
      ],
      explanation: `(${k}·√5)² ＝ ${k * k} · 5 ＝ ${area} m².`
    };
  },
  () => {
    return {
      title: 'Απλοποίηση Κλάσματος με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση <Frac num={<span className="inline-flex items-center gap-1">6 · <Radical>2</Radical></span>} den="2" />;
        </span>
      ),
      correct: '3·√2',
      type: 'mcq',
      distractors: () => ['3', '6·√2', '3·√1'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '3·√2') return <span className="inline-flex items-center gap-1">3 · <Radical>2</Radical></span>;
        if (opt === '6·√2') return <span className="inline-flex items-center gap-1">6 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Διαίρεση συντελεστών', details: '(6 / 2) · √2' },
        { label: 'Αποτέλεσμα', details: '3·√2' }
      ],
      explanation: 'Διαιρούμε τον αριθμητικό συντελεστή με τον παρονομαστή: 6 / 2 ＝ 3, άρα 3·√2.'
    };
  },
  () => {
    const a = randInt(2, 5);
    return {
      title: 'Διαφορά Τετραγώνου Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης (<Radical>3</Radical>)² ＋ ${a}²;
        </span>
      ),
      correct: 3 + a * a,
      type: 'input',
      tableData: [
        { label: '(√3)²', details: '3' },
        { label: `${a}²`, details: `${a * a}` },
        { label: 'Άθροισμα', details: `3 ＋ ${a * a} ＝ ${3 + a * a}` }
      ],
      explanation: `(√3)² ＝ 3 και ${a}² ＝ ${a * a}. Το άθροισμα είναι ${3 + a * a}.`
    };
  },
  () => {
    const k = randInt(2, 4);
    return {
      title: 'Επιμεριστική με Ριζικό Παράγοντα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αναπτύσσοντας την παράσταση <Radical>2</Radical> · (<Radical>2</Radical> ＋ ${k}), ποια έκφραση προκύπτει;
        </span>
      ),
      correct: `2 ＋ ${k}·√2`,
      type: 'mcq',
      distractors: () => [
        `4 ＋ ${k}·√2`,
        `2 ＋ ${k}`,
        `√4 ＋ ${k}`
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `2 ＋ ${k}·√2`) return <span className="inline-flex items-center gap-1">2 ＋ {k} · <Radical>2</Radical></span>;
        if (opt === `4 ＋ ${k}·√2`) return <span className="inline-flex items-center gap-1">4 ＋ {k} · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: '1ο γινόμενο', details: '√2 · √2 ＝ (√2)² ＝ 2' },
        { label: '2ο γινόμενο', details: `√2 · ${k} ＝ ${k}·√2` },
        { label: 'Άθροισμα', details: `2 ＋ ${k}·√2` }
      ],
      explanation: `√2 · √2 ＝ 2 και √2 · ${k} ＝ ${k}·√2. Άρα 2 ＋ ${k}·√2.`
    };
  }
];

export default function PrakseisPragmatikonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Αντιμεταθετική ιδιότητα
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Αντιμεταθετική Ιδιότητα',
      prompt: q1IsCorrect
        ? 'Για οποιουσδήποτε πραγματικούς αριθμούς α και β, ισχύει πάντοτε α ＋ β ＝ β ＋ α και α · β ＝ β · α.'
        : 'Η αντιμεταθετική ιδιότητα ισχύει μόνο για τους φυσικούς αριθμούς και όχι για τους άρρητους.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η αντιμεταθετική ιδιότητα ισχύει καθολικά για όλους τους πραγματικούς αριθμούς τόσο στην πρόσθεση όσο και στον πολλαπλασιασμό.'
    });

    // Q2: True / False - Διαίρεση με το μηδέν
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Διαίρεση με το Μηδέν',
      prompt: q2Choice
        ? 'Η διαίρεση πραγματικού αριθμού με το μηδέν (δηλαδή κλάσμα με παρονομαστή 0) δεν ορίζεται ποτέ.'
        : 'Αν διαιρέσουμε οποιονδήποτε αριθμό με το μηδέν, το αποτέλεσμα ισούται πάντοτε με 0.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Στα μαθηματικά η διαίρεση με το μηδέν δεν ορίζεται για κανέναν αριθμό.'
    });

    // Q3: MCQ - Ουδέτερο στοιχείο πολλαπλασιασμού
    qList.push({
      id: 3,
      title: 'Ουδέτερο Στοιχείο Πολλαπλασιασμού',
      prompt: 'Ποιο είναι το ουδέτερο στοιχείο του πολλαπλασιασμού στους πραγματικούς αριθμούς;',
      type: 'mcq',
      correct: 'Ο αριθμός 1 (διότι α · 1 ＝ α)',
      options: ensureFourUniqueOptions('Ο αριθμός 1 (διότι α · 1 ＝ α)', () => [
        'Ο αριθμός 0 (διότι α · 0 ＝ 0)',
        'Ο αριθμός －1',
        'Δεν υπάρχει ουδέτερο στοιχείο'
      ][randInt(0, 2)]),
      explanation: 'Το ουδέτερο στοιχείο του πολλαπλασιασμού είναι το 1, αφού α · 1 ＝ α για κάθε πραγματικό αριθμό.'
    });

    // Q4: MCQ - Πρόσθεση διαφορετικών ριζών
    qList.push({
      id: 4,
      title: 'Πρόσθεση Μη Όμοιων Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Η παράσταση <Radical>2</Radical> ＋ <Radical>3</Radical>:
        </span>
      ),
      type: 'mcq',
      correct: 'Δεν απλοποιείται περαιτέρω (δεν ισούται με √5)',
      options: ensureFourUniqueOptions('Δεν απλοποιείται περαιτέρω (δεν ισούται με √5)', () => [
        'Ισούται με √5',
        'Ισούται με √6',
        'Ισούται με 5'
      ][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === 'Ισούται με √5') return <span className="inline-flex items-center gap-1">Ισούται με <Radical>5</Radical></span>;
        if (opt === 'Ισούται με √6') return <span className="inline-flex items-center gap-1">Ισούται με <Radical>6</Radical></span>;
        return opt;
      },
      explanation: 'Προσθέτουμε μόνο όμοιες ρίζες. Ρίζες με διαφορετική υπόριζη ποσότητα δεν συνενώνονται.'
    });

    // Q5: Input - Αντίστροφος αριθμός
    qList.push({
      id: 5,
      title: 'Γινόμενο με Αντίστροφο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>11</Radical> · <Frac num="1" den={<Radical>11</Radical>} />;
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: 'Το γινόμενο κάθε μη μηδενικού αριθμού με τον αντίστροφό του ισούται με 1.'
    });

    // Q6: MCQ - Κανόνας προσήμων
    qList.push({
      id: 6,
      title: 'Κανόνας Προσήμων Γινομένου',
      prompt: 'Ποιο είναι το πρόσημο του γινομένου δύο ετερόσημων πραγματικών αριθμών;',
      type: 'mcq',
      correct: 'Πάντοτε αρνητικό (－)',
      options: ensureFourUniqueOptions('Πάντοτε αρνητικό (－)', () => [
        'Πάντοτε θετικό (＋)',
        'Εξαρτάται από το ποιος αριθμός είναι μεγαλύτερος',
        'Πάντοτε μηδέν'
      ][randInt(0, 2)]),
      explanation: 'Το γινόμενο ετερόσημων αριθμών ((＋) · (－) ή (－) · (＋)) είναι πάντοτε αρνητικό.'
    });

    // Q7: Input - Άθροισμα αντιθέτων
    const valK = randInt(3, 8);
    qList.push({
      id: 7,
      title: 'Άθροισμα Αντιθέτων',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης {valK} · <Radical>2</Radical> ＋ (－{valK} · <Radical>2</Radical>);
        </span>
      ),
      type: 'input',
      correct: 0,
      explanation: 'Το άθροισμα δύο αντίθετων πραγματικών αριθμών είναι πάντοτε ίσο με 0.'
    });

    // Q8: MCQ - Επιμεριστική Ιδιότητα
    qList.push({
      id: 8,
      title: 'Μαθηματική Έκφραση Επιμεριστικής',
      prompt: 'Ποια από τις παρακάτω σχέσεις εκφράζει σωστά την επιμεριστική ιδιότητα;',
      type: 'mcq',
      correct: 'α · (β ＋ γ) ＝ α · β ＋ α · γ',
      options: ensureFourUniqueOptions('α · (β ＋ γ) ＝ α · β ＋ α · γ', () => [
        'α · (β ＋ γ) ＝ α · β ＋ γ',
        'α ＋ (β · γ) ＝ (α ＋ β) · (α ＋ γ)',
        'α · (β · γ) ＝ (α · β) · γ'
      ][randInt(0, 2)]),
      explanation: 'Ο πολλαπλασιαστής έξω από την παρένθεση πολλαπλασιάζει κάθε όρο του αθροίσματος χωριστά.'
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
      title="Ασκήσεις: Πράξεις Πραγματικών Αριθμών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στις πράξεις και τις ιδιότητες των πραγματικών αριθμών, αναγωγή ριζών και επιμεριστική με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/04-prakseis-pragmatikon"
      backText="Θεωρία Κεφ. 4"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/04-prakseis-pragmatikon"
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
                Πράξεις Πραγματικών Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα πράξεων, επιμεριστικής και αναγωγής ριζών.
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις πράξεις και τις ιδιότητες των πραγματικών αριθμών.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους κανόνες προσήμων και τις ρίζες!'}
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
