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

// POOL Q9: Υπολογισμός δυνάμεων με αρνητικούς εκθέτες & κλάσματα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    const n = randInt(2, 4);
    const p = Math.pow(2, n);
    return {
      title: 'Αρνητικός Εκθέτης Ακεραίου',
      prompt: `Ποιο είναι το αποτέλεσμα της δύναμης 2⁻${n === 2 ? '²' : n === 3 ? '³' : '⁴'};`,
      correct: `1/${p}`,
      type: 'mcq',
      distractors: () => [`－${p}`, `－${2 * n}`, `1/${2 * n}`][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Ορισμός', details: `α⁻ⁿ ＝ 1 / αⁿ` },
        { label: 'Εφαρμογή', details: `2⁻${n} ＝ 1 / 2${n === 2 ? '²' : n === 3 ? '³' : '⁴'} ＝ 1 / ${p}` }
      ],
      explanation: `Ο αρνητικός εκθέτης σημαίνει αντιστροφή της βάσης: 2⁻${n} ＝ 1 / 2${n === 2 ? '²' : n === 3 ? '³' : '⁴'} ＝ 1/${p}.`
    };
  },
  () => {
    const n = randInt(2, 3);
    const p = Math.pow(3, n);
    return {
      title: 'Αρνητικός Εκθέτης με Βάση 3',
      prompt: `Ποιο είναι το αποτέλεσμα της δύναμης 3⁻${n === 2 ? '²' : '³'};`,
      correct: `1/${p}`,
      type: 'mcq',
      distractors: () => [`－${p}`, `1/${3 * n}`, `－${3 * n}`][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Κανόνας', details: '3⁻ⁿ ＝ 1 / 3ⁿ' },
        { label: 'Υπολογισμός', details: `1 / 3${n === 2 ? '²' : '³'} ＝ 1 / ${p}` }
      ],
      explanation: `3⁻${n} ＝ 1 / 3${n === 2 ? '²' : '³'} ＝ 1/${p}.`
    };
  },
  () => {
    const p = randInt(2, 4);
    const res = Math.pow(p, 2);
    return {
      title: 'Κλάσμα σε Αρνητικό Εκθέτη',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η δύναμη (<Frac num="1" den={`${p}`} />)⁻²;
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Αντιστροφή κλάσματος', details: `(1 / ${p})⁻² ＝ (${p} / 1)² ＝ ${p}²` },
        { label: 'Υπολογισμός', details: `${p}² ＝ ${res}` }
      ],
      explanation: `Αντιστρέφουμε το κλάσμα και ο εκθέτης γίνεται θετικός: (1/${p})⁻² ＝ ${p}² ＝ ${res}.`
    };
  },
  () => {
    return {
      title: 'Αρνητικός Εκθέτης με Αρνητική Βάση',
      prompt: 'Ποιο είναι το αποτέλεσμα της δύναμης (－2)⁻³;',
      correct: '－1/8',
      type: 'mcq',
      distractors: () => ['1/8', '－8', '8'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '－1/8') return <Frac num="－1" den="8" />;
        if (opt === '1/8') return <Frac num="1" den="8" />;
        return opt;
      },
      tableData: [
        { label: 'Αντιστροφή', details: '1 / (－2)³' },
        { label: 'Υπολογισμός δύναμης', details: '(－2)³ ＝ －8 (περιττός εκθέτης)' },
        { label: 'Τελικό αποτέλεσμα', details: '1 / (－8) ＝ －1/8' }
      ],
      explanation: '(－2)⁻³ ＝ 1 / (－2)³ ＝ 1 / (－8) ＝ －1/8.'
    };
  },
  () => {
    const k = randInt(2, 5);
    return {
      title: 'Κλάσμα 2/3 σε Αρνητικό Εκθέτη',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το αποτέλεσμα της παράστασης (<Frac num="2" den="3" />)⁻¹;
        </span>
      ),
      correct: '3/2',
      type: 'mcq',
      distractors: () => ['－2/3', '－3/2', '2/3'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Ιδιότητα', details: '(α / β)⁻¹ ＝ β / α' },
        { label: 'Αποτέλεσμα', details: '3/2' }
      ],
      explanation: 'Ο εκθέτης －1 απλώς αντιστρέφει το κλάσμα: (2/3)⁻¹ ＝ 3/2.'
    };
  },
  () => {
    return {
      title: 'Δύναμη με Βάση 10',
      prompt: 'Ποια είναι η δεκαδική τιμή της δύναμης 10⁻³;',
      correct: 0.001,
      type: 'input',
      tableData: [
        { label: 'Κλασματική μορφή', details: '1 / 10³ ＝ 1 / 1000' },
        { label: 'Δεκαδική μορφή', details: '0,001' }
      ],
      explanation: '10⁻³ ＝ 1 / 1000 ＝ 0,001.'
    };
  }
];

// POOL Q10: Ιδιότητες δυνάμεων & απλοποίηση (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    const m = randInt(2, 5);
    const n = randInt(2, 4);
    const sum = m + n;
    return {
      title: 'Γινόμενο Δυνάμεων με Ίδια Βάση',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο τελικός εκθέτης του 3 στο γινόμενο 3{m === 2 ? '²' : m === 3 ? '³' : m === 4 ? '⁴' : '⁵'} · 3{n === 2 ? '²' : n === 3 ? '³' : '⁴'};
        </span>
      ),
      correct: sum,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: 'αᵐ · αⁿ ＝ αᵐ⁺ⁿ' },
        { label: 'Υπολογισμός εκθέτη', details: `${m} ＋ ${n} ＝ ${sum}` }
      ],
      explanation: `Στο γινόμενο δυνάμεων με την ίδια βάση προσθέτουμε τους εκθέτες: ${m} ＋ ${n} ＝ ${sum}.`
    };
  },
  () => {
    const m = randInt(5, 8);
    const n = randInt(2, 4);
    const diff = m - n;
    return {
      title: 'Πηλίκο Δυνάμεων με Ίδια Βάση',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο εκθέτης του 5 στην απλοποίηση του κλάσματος <Frac num={`5${m === 5 ? '⁵' : m === 6 ? '⁶' : m === 7 ? '⁷' : '⁸'}`} den={`5${n === 2 ? '²' : n === 3 ? '³' : '⁴'}`} />;
        </span>
      ),
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: 'αᵐ / αⁿ ＝ αᵐ⁻ⁿ' },
        { label: 'Υπολογισμός εκθέτη', details: `${m} － ${n} ＝ ${diff}` }
      ],
      explanation: `Στο πηλίκο δυνάμεων με την ίδια βάση αφαιρούμε τους εκθέτες: ${m} － ${n} ＝ ${diff}.`
    };
  },
  () => {
    const m = randInt(2, 3);
    const n = randInt(2, 4);
    const prod = m * n;
    return {
      title: 'Δύναμη Δύναμης',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο εκθέτης του 2 στην παράσταση (2{m === 2 ? '²' : '³'}){n === 2 ? '²' : n === 3 ? '³' : '⁴'};
        </span>
      ),
      correct: prod,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: '(αᵐ)ⁿ ＝ αᵐ˙ⁿ' },
        { label: 'Υπολογισμός εκθέτη', details: `${m} · ${n} ＝ ${prod}` }
      ],
      explanation: `Στη δύναμη δύναμης πολλαπλασιάζουμε τους εκθέτες: ${m} · ${n} ＝ ${prod}.`
    };
  },
  () => {
    return {
      title: 'Απλοποίηση με Αρνητικούς Εκθέτες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση 4³ · 4⁻³;
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Άθροισμα εκθετών', details: '3 ＋ (－3) ＝ 0' },
        { label: 'Τελική δύναμη', details: '4⁰ ＝ 1' }
      ],
      explanation: '4³ · 4⁻³ ＝ 4³⁻³ ＝ 4⁰ ＝ 1.'
    };
  },
  () => {
    return {
      title: 'Γινόμενο με Διαφορετικές Βάσεις και Ίδιο Εκθέτη',
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης 2⁴ · 5⁴;',
      correct: 10000,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: 'αⁿ · βⁿ ＝ (α · β)ⁿ' },
        { label: 'Εφαρμογή', details: '(2 · 5)⁴ ＝ 10⁴ ＝ 10.000' }
      ],
      explanation: '2⁴ · 5⁴ ＝ (2 · 5)⁴ ＝ 10⁴ ＝ 10.000.'
    };
  },
  () => {
    return {
      title: 'Πηλίκο με Ίδιο Εκθέτη',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση <Frac num="12³" den="4³" />;
        </span>
      ),
      correct: 27,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: 'αⁿ / βⁿ ＝ (α / β)ⁿ' },
        { label: 'Εφαρμογή', details: '(12 / 4)³ ＝ 3³ ＝ 27' }
      ],
      explanation: '12³ / 4³ ＝ (12 / 4)³ ＝ 3³ ＝ 27.'
    };
  }
];

// POOL Q11: Δυνάμεις ριζικών & πρόσημα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    const k = randInt(2, 7);
    return {
      title: 'Τετράγωνο Τετραγωνικής Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της δύναμης (<Radical>{k}</Radical>)²;
        </span>
      ),
      correct: k,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα', details: '(√α)² ＝ α για κάθε α ≥ 0' },
        { label: 'Αποτέλεσμα', details: `${k}` }
      ],
      explanation: `Η τετραγωνική ρίζα υψωμένη στο τετράγωνο εξουδετερώνεται: (√${k})² ＝ ${k}.`
    };
  },
  () => {
    return {
      title: 'Τέταρτη Δύναμη Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η δύναμη (<Radical>2</Radical>)⁴;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση', details: '((√2)²)² ＝ 2²' },
        { label: 'Υπολογισμός', details: '2² ＝ 4' }
      ],
      explanation: '(√2)⁴ ＝ ((√2)²)² ＝ 2² ＝ 4.'
    };
  },
  () => {
    return {
      title: 'Δύναμη με και χωρίς Παρένθεση',
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης －5²;',
      correct: -25,
      type: 'input',
      tableData: [
        { label: 'Προτεραιότητα', details: 'Ο εκθέτης 2 επηρεάζει μόνο το 5 και όχι το μείον' },
        { label: 'Υπολογισμός', details: '－(5 · 5) ＝ －25' }
      ],
      explanation: 'Χωρίς παρένθεση, το μείον μένει έξω: －5² ＝ －(5²) ＝ －25. Αν ήταν (－5)², θα ισούταν με ＋25.'
    };
  },
  () => {
    return {
      title: 'Άρτιος Εκθέτης σε Αρνητική Βάση',
      prompt: 'Ποιο είναι το αποτέλεσμα της δύναμης (－3)⁴;',
      correct: 81,
      type: 'input',
      tableData: [
        { label: 'Εκθέτης', details: '4 (άρτιος αριθμός => θετικό αποτέλεσμα)' },
        { label: 'Υπολογισμός', details: '3⁴ ＝ 81' }
      ],
      explanation: 'Ο εκθέτης 4 είναι άρτιος, άρα το αποτέλεσμα είναι θετικό: (－3)⁴ ＝ ＋81.'
    };
  },
  () => {
    return {
      title: 'Δύναμη του －1',
      prompt: 'Πόσο ισούται η παράσταση (－1)²⁰²⁶;',
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Εκθέτης', details: '2026 (άρτιος ακέραιος)' },
        { label: 'Αποτέλεσμα', details: '(－1)²⁰²⁶ ＝ 1' }
      ],
      explanation: 'Το －1 υψωμένο σε οποιονδήποτε άρτιο ακέραιο εκθέτη ισούται πάντοτε με 1.'
    };
  },
  () => {
    return {
      title: 'Αρνητικός Εκθέτης σε Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η δύναμη (<Radical>5</Radical>)⁻²;
        </span>
      ),
      correct: '1/5',
      type: 'mcq',
      distractors: () => ['－5', '－1/5', '5'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '1/5') return <Frac num="1" den="5" />;
        if (opt === '－1/5') return <Frac num="－1" den="5" />;
        return opt;
      },
      tableData: [
        { label: 'Αντιστροφή', details: '1 / (√5)²' },
        { label: 'Αποτέλεσμα', details: '1 / 5' }
      ],
      explanation: '(√5)⁻² ＝ 1 / (√5)² ＝ 1/5.'
    };
  }
];

// POOL Q12: Τυποποιημένη μορφή & επιστημονικά προβλήματα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    return {
      title: 'Τυποποιημένη Μορφή Μεγάλου Αριθμού',
      prompt: 'Ποια είναι η σωστή τυποποιημένη (επιστημονική) μορφή του αριθμού 45.000.000;',
      correct: '4,5 · 10⁷',
      type: 'mcq',
      distractors: () => ['45 · 10⁶', '0,45 · 10⁸', '4,5 · 10⁶'][randInt(0, 2)],
      tableData: [
        { label: 'Αρχικός αριθμός', details: '45.000.000' },
        { label: 'Συντελεστής α (1 ≤ α ＜ 10)', details: '4,5' },
        { label: 'Μετατόπιση υποδιαστολής', details: '7 θέσεις αριστερά => 10⁷' }
      ],
      explanation: 'Στην τυποποιημένη μορφή α · 10ᵏ πρέπει 1 ≤ α ＜ 10. Άρα 4,5 · 10⁷.'
    };
  },
  () => {
    return {
      title: 'Τυποποιημένη Μορφή Μικρού Αριθμού',
      prompt: 'Ποια είναι η τυποποιημένη μορφή του δεκαδικού αριθμού 0,00038;',
      correct: '3,8 · 10⁻⁴',
      type: 'mcq',
      distractors: () => ['38 · 10⁻⁵', '3,8 · 10⁻³', '0,38 · 10⁻³'][randInt(0, 2)],
      tableData: [
        { label: 'Αρχικός αριθμός', details: '0,00038' },
        { label: 'Συντελεστής α', details: '3,8' },
        { label: 'Μετατόπιση υποδιαστολής', details: '4 θέσεις δεξιά => 10⁻⁴' }
      ],
      explanation: 'Μετακινούμε την υποδιαστολή 4 θέσεις δεξιά: 3,8 · 10⁻⁴.'
    };
  },
  () => {
    return {
      title: 'Εκθέτης στην Τυποποιημένη Μορφή',
      prompt: 'Αν γράψουμε τον αριθμό 7.200.000 στη μορφή 7,2 · 10ᵏ, ποιος είναι ο ακέραιος εκθέτης k;',
      correct: 6,
      type: 'input',
      tableData: [
        { label: 'Αριθμός', details: '7.200.000' },
        { label: 'Μορφή', details: '7,2 · 10⁶' },
        { label: 'Εκθέτης k', details: '6' }
      ],
      explanation: '7.200.000 ＝ 7,2 · 10⁶, άρα k ＝ 6.'
    };
  },
  () => {
    return {
      title: 'Γινόμενο σε Τυποποιημένη Μορφή',
      prompt: 'Πόσο ισούται το γινόμενο (2 · 10⁴) · (3 · 10⁵) σε τυποποιημένη μορφή;',
      correct: '6 · 10⁹',
      type: 'mcq',
      distractors: () => ['6 · 10²⁰', '5 · 10⁹', '6 · 10⁸'][randInt(0, 2)],
      tableData: [
        { label: 'Πολλαπλασιασμός συντελεστών', details: '2 · 3 ＝ 6' },
        { label: 'Πολλαπλασιασμός δυνάμεων', details: '10⁴ · 10⁵ ＝ 10⁴⁺⁵ ＝ 10⁹' },
        { label: 'Τελικό', details: '6 · 10⁹' }
      ],
      explanation: '(2 · 10⁴) · (3 · 10⁵) ＝ (2 · 3) · (10⁴ · 10⁵) ＝ 6 · 10⁹.'
    };
  },
  () => {
    return {
      title: 'Διαίρεση σε Τυποποιημένη Μορφή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το πηλίκο <Frac num="8 · 10⁷" den="2 · 10³" /> σε τυποποιημένη μορφή;
        </span>
      ),
      correct: '4 · 10⁴',
      type: 'mcq',
      distractors: () => ['4 · 10¹⁰', '4 · 10⁴', '6 · 10⁴', '4 · 10²'][randInt(0, 2)],
      tableData: [
        { label: 'Διαίρεση συντελεστών', details: '8 / 2 ＝ 4' },
        { label: 'Διαίρεση δυνάμεων', details: '10⁷ / 10³ ＝ 10⁷⁻³ ＝ 10⁴' },
        { label: 'Αποτέλεσμα', details: '4 · 10⁴' }
      ],
      explanation: '(8 · 10⁷) / (2 · 10³) ＝ (8 / 2) · (10⁷ / 10³) ＝ 4 · 10⁴.'
    };
  },
  () => {
    return {
      title: 'Μετατροπή από Τυποποιημένη σε Δεκαδικό',
      prompt: 'Ποιος ακέραιος αριθμός ισούται με την έκφραση 1,2 · 10⁴;',
      correct: 12000,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός δύναμης', details: '10⁴ ＝ 10.000' },
        { label: 'Πολλαπλασιασμός', details: '1,2 · 10.000 ＝ 12.000' }
      ],
      explanation: '1,2 · 10⁴ ＝ 1,2 · 10.000 ＝ 12.000.'
    };
  }
];

export default function DinameisPragmatikonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Μηδενικός εκθέτης
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Μηδενικός Εκθέτης',
      prompt: q1IsCorrect
        ? 'Για κάθε πραγματικό αριθμό α ≠ 0, ισχύει πάντοτε α⁰ ＝ 1.'
        : 'Για κάθε πραγματικό αριθμό α, ισχύει πάντοτε α⁰ ＝ 0.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Εξ ορισμού, κάθε μη μηδενικός πραγματικός αριθμός υψωμένος στο μηδέν ισούται με 1 (α⁰ ＝ 1).'
    });

    // Q2: True / False - Αρνητικός εκθέτης
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Έννοια Αρνητικού Εκθέτη',
      prompt: q2Choice
        ? 'Ο αρνητικός εκθέτης σε έναν πραγματικό αριθμό σημαίνει αντιστροφή της βάσης (α⁻ⁿ ＝ 1 / αⁿ).'
        : 'Ο αρνητικός εκθέτης μετατρέπει το τελικό αποτέλεσμα υποχρεωτικά σε αρνητικό αριθμό.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Ο αρνητικός εκθέτης δηλώνει τον αντίστροφο της δύναμης και δεν καθορίζει το πρόσημο του αποτελέσματος.'
    });

    // Q3: MCQ - Πρόσημο δύναμης
    qList.push({
      id: 3,
      title: 'Κανόνας Προσήμων σε Δυνάμεις',
      prompt: 'Ποιο είναι το πρόσημο της δύναμης (－4)⁵;',
      type: 'mcq',
      correct: 'Αρνητικό (－), γιατί ο εκθέτης είναι περιττός',
      options: ensureFourUniqueOptions('Αρνητικό (－), γιατί ο εκθέτης είναι περιττός', () => [
        'Θετικό (＋), γιατί κάθε δύναμη είναι θετική',
        'Μηδέν',
        'Δεν ορίζεται'
      ][randInt(0, 2)]),
      explanation: 'Αρνητική βάση με περιττό εκθέτη (5) δίνει πάντοτε αρνητικό αποτέλεσμα.'
    });

    // Q4: MCQ - Διαφορά παρένθεσης
    qList.push({
      id: 4,
      title: 'Δύναμη με και χωρίς Παρένθεση',
      prompt: 'Ποια είναι η σχέση ανάμεσα στο (－3)² και στο －3²;',
      type: 'mcq',
      correct: '(－3)² ＝ 9 ενώ －3² ＝ －9',
      options: ensureFourUniqueOptions('(－3)² ＝ 9 ενώ －3² ＝ －9', () => [
        'Είναι ίσα και τα δύο με 9',
        'Είναι ίσα και τα δύο με －9',
        '(－3)² ＝ －9 ενώ －3² ＝ 9'
      ][randInt(0, 2)]),
      explanation: 'Στο (－3)² ο εκθέτης επηρεάζει και το μείον: (－3)·(－3) ＝ 9. Στο －3² ο εκθέτης επηρεάζει μόνο το 3: －(3·3) ＝ －9.'
    });

    // Q5: Input - Υπολογισμός δύναμης ρίζας
    qList.push({
      id: 5,
      title: 'Τετράγωνο Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή της δύναμης (<Radical>11</Radical>)²;
        </span>
      ),
      type: 'input',
      correct: 11,
      explanation: 'Για κάθε α ≥ 0, ισχύει (√α)² ＝ α. Άρα (√11)² ＝ 11.'
    });

    // Q6: MCQ - Ιδιότητα γινομένου δυνάμεων
    qList.push({
      id: 6,
      title: 'Γινόμενο Δυνάμεων',
      prompt: 'Ποιος είναι ο σωστός τύπος για το γινόμενο δυνάμεων με την ίδια βάση αᵐ · αⁿ;',
      type: 'mcq',
      correct: 'αᵐ⁺ⁿ',
      options: ensureFourUniqueOptions('αᵐ⁺ⁿ', () => [
        'αᵐ˙ⁿ',
        'αᵐ⁻ⁿ',
        '(2α)ᵐ⁺ⁿ'
      ][randInt(0, 2)]),
      explanation: 'Στο γινόμενο δυνάμεων με την ίδια βάση διατηρούμε τη βάση και προσθέτουμε τους εκθέτες: αᵐ · αⁿ ＝ αᵐ⁺ⁿ.'
    });

    // Q7: Input - Υπολογισμός 2⁻¹
    qList.push({
      id: 7,
      title: 'Υπολογισμός Δύναμης 2⁻¹',
      prompt: 'Ποια είναι η δεκαδική τιμή της δύναμης 2⁻¹;',
      type: 'input',
      correct: 0.5,
      explanation: '2⁻¹ ＝ 1/2 ＝ 0,5.'
    });

    // Q8: MCQ - Τυποποιημένη μορφή
    qList.push({
      id: 8,
      title: 'Κριτήριο Τυποποιημένης Μορφής',
      prompt: 'Στην τυποποιημένη μορφή ενός αριθμού α · 10ᵏ, ποιοι περιορισμοί ισχύουν για το α και το k;',
      type: 'mcq',
      correct: '1 ≤ |α| ＜ 10 και k ακέραιος (k ∈ ℤ)',
      options: ensureFourUniqueOptions('1 ≤ |α| ＜ 10 και k ακέραιος (k ∈ ℤ)', () => [
        '0 ≤ α ＜ 100 και k φυσικός',
        'α οποιοσδήποτε αριθμός και k ＞ 0',
        '1 ＜ α ≤ 10 και k μόνο θετικός'
      ][randInt(0, 2)]),
      explanation: 'Στην επιστημονική/τυποποιημένη μορφή ο συντελεστής α έχει ένα μόνο μη μηδενικό ακέραιο ψηφίο (1 ≤ |α| ＜ 10) και ο εκθέτης k είναι ακέραιος.'
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
      title="Ασκήσεις: Δυνάμεις Πραγματικών Αριθμών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στις δυνάμεις πραγματικών αριθμών, ιδιότητες, αρνητικούς εκθέτες και τυποποιημένη μορφή με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/05-dinameis-pragmatikon"
      backText="Θεωρία Κεφ. 5"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/05-dinameis-pragmatikon"
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
                Δυνάμεις Πραγματικών Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα ιδιοτήτων, αρνητικών εκθετών και τυποποιημένης μορφής.
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις δυνάμεις, τις ιδιότητες και την τυποποιημένη μορφή.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους αρνητικούς εκθέτες και τους κανόνες προσήμων!'}
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
