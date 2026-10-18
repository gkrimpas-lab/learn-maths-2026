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

// POOL Q9: Σύνθετη Αφαίρεση Πολυωνύμων & Απαλοιφή (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    const a1 = randInt(5, 9);
    const a2 = randInt(2, 4);
    const b = randInt(2, 6);
    const c = randInt(3, 8);
    const diff = a1 - a2;
    return {
      title: 'Αφαίρεση Τριωνύμων και Συντελεστής x²',
      prompt: `Δίνονται P(x) ＝ ${a1} · x² － ${b} · x ＋ ${c} και Q(x) ＝ ${a2} · x² ＋ 3 · x － 2. Ποιος είναι ο συντελεστής του x² στο πολυώνυμο P(x) － Q(x);`,
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'Όροι με x²', details: `${a1} · x² － ${a2} · x²` },
        { label: 'Πράξη συντελεστών', details: `${a1} － ${a2} ＝ ${diff}` },
        { label: 'Τελικός όρος x²', details: `${diff} · x²` }
      ],
      explanation: `Στην αφαίρεση P(x) － Q(x), αφαιρούμε τους αντίστοιχους συντελεστές των ομοίων όρων: ${a1} － ${a2} ＝ ${diff}.`
    };
  },
  () => {
    const k = randInt(4, 9);
    const constRes = k - 3;
    return {
      title: 'Απαλοιφή Παρενθέσεων με Αρνητικό Πρόσημο',
      prompt: `Δίνεται η παράσταση: A(x) ＝ 4 · x － (3 · x － ${k}) － 3. Ποιος είναι ο τελικός σταθερός όρος στην ανηγμένη μορφή;`,
      correct: constRes,
      type: 'input',
      tableData: [
        { label: 'Απαλοιφή παρένθεσης', details: `－ (3 · x － ${k}) ＝ －3 · x ＋ ${k}` },
        { label: 'Σταθεροί όροι', details: `＋${k} － 3` },
        { label: 'Τελικό αποτέλεσμα', details: `${k} － 3 ＝ ${constRes}` }
      ],
      explanation: `Το πρόσημο πλην πριν την παρένθεση αλλάζει το －${k} σε ＋${k}. Στη συνέχεια: ${k} － 3 ＝ ${constRes}.`
    };
  },
  () => {
    const a = randInt(3, 6);
    const b = randInt(2, 5);
    return {
      title: 'Ακύρωση Μεγιστοβάθμιων Όρων σε Διαφορά',
      prompt: `Αν A(x) ＝ ${a} · x³ ＋ ${b} · x² － 5 και B(x) ＝ ${a} · x³ － 4 · x² ＋ 2, ποιος είναι ο βαθμός του πολυωνύμου A(x) － B(x);`,
      correct: '2ος βαθμός',
      type: 'mcq',
      distractors: () => ['3ος βαθμός', '1ος βαθμός', '0ός βαθμός', '4ος βαθμός'][randInt(0, 3)],
      tableData: [
        { label: 'Όροι 3ου βαθμού', details: `${a} · x³ － ${a} · x³ ＝ 0 · x³ (εξουδετερώνονται)` },
        { label: 'Όροι 2ου βαθμού', details: `${b} · x² － (－4 · x²) ＝ (${b} ＋ 4) · x²` },
        { label: 'Μεγαλύτερος εκθέτης', details: '2 (δευτεροβάθμιο)' }
      ],
      explanation: `Οι τριτοβάθμιοι όροι έχουν τον ίδιο συντελεστή (${a}), οπότε στην αφαίρεση μηδενίζονται. Ο μεγαλύτερος εκθέτης που απομένει είναι το 2, άρα το πολυώνυμο είναι 2ου βαθμού.`
    };
  },
  () => {
    const c1 = randInt(2, 6);
    const c2 = randInt(3, 7);
    const total = c1 + c2;
    return {
      title: 'Αφαίρεση με Αρνητικό Συντελεστή',
      prompt: `Στην αφαίρεση (2 · x² ＋ ${c1} · x) － (5 · x² － ${c2} · x), ποιος είναι ο συντελεστής του x στην ανηγμένη μορφή;`,
      correct: total,
      type: 'input',
      tableData: [
        { label: 'Όροι με x', details: `${c1} · x － (－${c2} · x)` },
        { label: 'Κανόνας προσήμων', details: `${c1} · x ＋ ${c2} · x` },
        { label: 'Άθροισμα συντελεστών', details: `${c1} ＋ ${c2} ＝ ${total}` }
      ],
      explanation: `Προσέχουμε τον κανόνα προσήμων: － (－${c2} · x) ＝ ＋ ${c2} · x. Επομένως: ${c1} ＋ ${c2} ＝ ${total}.`
    };
  },
  () => {
    const a = randInt(4, 8);
    const b = randInt(1, 4);
    const res = a - b;
    return {
      title: 'Διαφορά Διωνύμων με Δύο Μεταβλητές',
      prompt: `Δίνονται τα πολυώνυμα M ＝ ${a} · x² · y ＋ 3 · x · y² και N ＝ ${b} · x² · y － 2 · x · y². Ποιος είναι ο συντελεστής του όρου x² · y στη διαφορά M － N;`,
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Όμοιοι όροι x² · y', details: `${a} · x² · y － ${b} · x² · y` },
        { label: 'Πράξη συντελεστών', details: `${a} － ${b} ＝ ${res}` },
        { label: 'Τελικός όρος', details: `${res} · x² · y` }
      ],
      explanation: `Αφαιρούμε τους συντελεστές των ομοίων όρων x² · y: ${a} － ${b} ＝ ${res}.`
    };
  },
  () => {
    const p1 = randInt(2, 4);
    const p2 = randInt(3, 5);
    return {
      title: 'Είδος Πολυωνύμου μετά από Αφαίρεση',
      prompt: `Αν από το πολυώνυμο P(x) ＝ ${p1} · x² ＋ ${p2} · x ＋ 7 αφαιρέσουμε το Q(x) ＝ ${p1} · x² ＋ ${p2} · x － 3, τι πολυώνυμο προκύπτει;`,
      correct: 'Σταθερό Πολυώνυμο (0ού βαθμού)',
      type: 'mcq',
      distractors: () => ['Μηδενικό Πολυώνυμο', 'Διώνυμο 1ου βαθμού', 'Τριώνυμο 2ου βαθμού'][randInt(0, 2)],
      tableData: [
        { label: 'Όροι x²', details: `${p1} · x² － ${p1} · x² ＝ 0` },
        { label: 'Όροι x', details: `${p2} · x － ${p2} · x ＝ 0` },
        { label: 'Σταθεροί όροι', details: `7 － (－3) ＝ 7 ＋ 3 ＝ 10` }
      ],
      explanation: `Όλοι οι όροι με μεταβλητή μηδενίζονται και απομένει ο αριθμός 10, ο οποίος είναι σταθερό πολυώνυμο 0ού βαθμού.`
    };
  }
];

// POOL Q10: Γεωμετρικές Περίμετροι και Πολυώνυμα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 6);
    const c = randInt(1, 5);
    const d = randInt(2, 4);
    const totalX = 2 * (a + c);
    const totalConst = 2 * (b + d);
    return {
      title: 'Περίμετρος Ορθογωνίου με Πολυωνυμικές Διαστάσεις',
      prompt: `Ένα ορθογώνιο έχει μήκος L ＝ ${a} · x ＋ ${b} και πλάτος W ＝ ${c} · x ＋ ${d}. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x);`,
      correct: `${totalX} · x ＋ ${totalConst}`,
      type: 'mcq',
      distractors: () => [
        `${totalX} · x ＋ ${b + d}`,
        `${a + c} · x ＋ ${totalConst}`,
        `${totalX * 2} · x ＋ ${totalConst}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Διαστάσεις', details: `L ＝ ${a} · x ＋ ${b},  W ＝ ${c} · x ＋ ${d}` },
        { label: 'Τύπος περιμέτρου', details: 'Π ＝ 2 · (L ＋ W)' },
        { label: 'Άθροισμα διαστάσεων', details: `(${a} ＋ ${c}) · x ＋ (${b} ＋ ${d}) ＝ ${a + c} · x ＋ ${b + d}` },
        { label: 'Διπλασιασμός', details: `2 · (${a + c} · x ＋ ${b + d}) ＝ ${totalX} · x ＋ ${totalConst}` }
      ],
      explanation: `Η περίμετρος ισούται με: Π ＝ 2 · (L ＋ W) ＝ 2 · [(${a} · x ＋ ${b}) ＋ (${c} · x ＋ ${d})] ＝ 2 · (${a + c} · x ＋ ${b + d}) ＝ ${totalX} · x ＋ ${totalConst}.`
    };
  },
  () => {
    const pX = randInt(6, 10);
    const pC = randInt(12, 18);
    const aX = randInt(2, 4);
    const aC = randInt(4, 7);
    const bX = randInt(2, 3);
    const bC = randInt(3, 5);
    const cX = pX - (aX + bX);
    const cC = pC - (aC + bC);
    return {
      title: 'Εύρεση Τρίτης Πλευράς Τριγώνου',
      prompt: `Τρίγωνο έχει περίμετρο Π(x) ＝ ${pX} · x ＋ ${pC}. Αν οι δύο πλευρές του είναι α ＝ ${aX} · x ＋ ${aC} και β ＝ ${bX} · x ＋ ${bC}, ποιο είναι το πολυώνυμο της τρίτης πλευράς γ;`,
      correct: `${cX} · x ＋ ${cC}`,
      type: 'mcq',
      distractors: () => [
        `${cX} · x ＋ ${pC - aC}`,
        `${pX - aX} · x ＋ ${cC}`,
        `${cX + 1} · x ＋ ${cC}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Περίμετρος Π(x)', details: `${pX} · x ＋ ${pC}` },
        { label: 'Άθροισμα γνωστών πλευρών (α ＋ β)', details: `(${aX} ＋ ${bX}) · x ＋ (${aC} ＋ ${bC}) ＝ ${aX + bX} · x ＋ ${aC + bC}` },
        { label: 'Υπολογισμός γ ＝ Π － (α ＋ β)', details: `(${pX} · x ＋ ${pC}) － (${aX + bX} · x ＋ ${aC + bC}) ＝ ${cX} · x ＋ ${cC}` }
      ],
      explanation: `Η τρίτη πλευρά προκύπτει αφαιρώντας το άθροισμα των δύο γνωστών πλευρών από την περίμετρο: γ ＝ Π － (α ＋ β) ＝ ${cX} · x ＋ ${cC}.`
    };
  },
  () => {
    const side1 = randInt(2, 5);
    const side2 = randInt(1, 4);
    const diff = 4 * (side1 - side2);
    return {
      title: 'Διαφορά Περιμέτρων Δύο Τετραγώνων',
      prompt: `Δύο τετράγωνα έχουν πλευρές x ＋ ${side1} και x ＋ ${side2} αντίστοιχα. Πόσο μεγαλύτερη είναι η περίμετρος του πρώτου τετραγώνου;`,
      correct: diff,
      type: 'input',
      unit: 'μονάδες',
      tableData: [
        { label: 'Περίμετρος 1ου (Π₁)', details: `4 · (x ＋ ${side1}) ＝ 4 · x ＋ ${4 * side1}` },
        { label: 'Περίμετρος 2ου (Π₂)', details: `4 · (x ＋ ${side2}) ＝ 4 · x ＋ ${4 * side2}` },
        { label: 'Διαφορά (Π₁ － Π₂)', details: `(4 · x ＋ ${4 * side1}) － (4 · x ＋ ${4 * side2}) ＝ ${diff}` }
      ],
      explanation: `Υπολογίζουμε τις περιμέτρους: Π₁ ＝ 4 · x ＋ ${4 * side1} και Π₂ ＝ 4 · x ＋ ${4 * side2}. Η διαφορά τους είναι σταθερή και ισούται με ${diff}.`
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const c = randInt(1, 3);
    const perimeterX = 2 * a + b;
    const perimeterConst = 2 * c;
    return {
      title: 'Περίμετρος Ισοσκελούς Τριγώνου',
      prompt: `Ένα ισοσκελές τρίγωνο έχει δύο ίσες πλευρές μήκους ${a} · x ＋ ${c} η καθεμία και βάση μήκους ${b} · x. Ποιο είναι το πολυώνυμο της περιμέτρου του;`,
      correct: `${perimeterX} · x ＋ ${perimeterConst}`,
      type: 'mcq',
      distractors: () => [
        `${perimeterX} · x ＋ ${c}`,
        `${a + b} · x ＋ ${perimeterConst}`,
        `${perimeterX * 2} · x ＋ ${perimeterConst}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Ίσες πλευρές', details: `2 · (${a} · x ＋ ${c}) ＝ ${2 * a} · x ＋ ${perimeterConst}` },
        { label: 'Βάση', details: `${b} · x` },
        { label: 'Περίμετρος', details: `(${2 * a} · x ＋ ${perimeterConst}) ＋ ${b} · x ＝ ${perimeterX} · x ＋ ${perimeterConst}` }
      ],
      explanation: `Προσθέτουμε τις τρεις πλευρές: Π(x) ＝ 2 · (${a} · x ＋ ${c}) ＋ ${b} · x ＝ ${2 * a} · x ＋ ${perimeterConst} ＋ ${b} · x ＝ ${perimeterX} · x ＋ ${perimeterConst}.`
    };
  },
  () => {
    const k = randInt(3, 7);
    const total = 4 * k;
    return {
      title: 'Περίμετρος Ρόμβου',
      prompt: `Ένας ρόμβος έχει πλευρά μήκους α ＝ 2 · x ＋ ${k}. Αν από την περίμετρό του αφαιρέσουμε το πολυώνυμο 8 · x, ποιος αριθμός απομένει;`,
      correct: total,
      type: 'input',
      tableData: [
        { label: 'Περίμετρος ρόμβου', details: `4 · (2 · x ＋ ${k}) ＝ 8 · x ＋ ${total}` },
        { label: 'Αφαίρεση 8 · x', details: `(8 · x ＋ ${total}) － 8 · x` },
        { label: 'Υπόλοιπο', details: `${total}` }
      ],
      explanation: `Η περίμετρος του ρόμβου είναι 4 · (2 · x ＋ ${k}) ＝ 8 · x ＋ ${total}. Αφαιρώντας το 8 · x απομένει ακριβώς ο σταθερός όρος ${total}.`
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(1, 5);
    const sumX = 5 * a;
    const sumC = 5 * b;
    return {
      title: 'Περίμετρος Κανονικού Πενταγώνου',
      prompt: `Κανονικό πεντάγωνο έχει πλευρά α ＝ ${a} · x ＋ ${b}. Ποιο πολυώνυμο εκφράζει την περίμετρό του;`,
      correct: `${sumX} · x ＋ ${sumC}`,
      type: 'mcq',
      distractors: () => [
        `${sumX} · x ＋ ${b}`,
        `${a} · x ＋ ${sumC}`,
        `${sumX + 5} · x ＋ ${sumC}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Πλευρά α', details: `${a} · x ＋ ${b}` },
        { label: 'Πλήθος πλευρών', details: '5 ίσες πλευρές' },
        { label: 'Περίμετρος', details: `5 · (${a} · x ＋ ${b}) ＝ ${sumX} · x ＋ ${sumC}` }
      ],
      explanation: `Πολλαπλασιάζουμε την πλευρά επί 5: 5 · (${a} · x ＋ ${b}) ＝ ${sumX} · x ＋ ${sumC}.`
    };
  }
];

// POOL Q11: Σύνθετες Αριθμητικές Τιμές μετά από Πράξεις (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    const xVal = randInt(2, 3);
    const a = randInt(2, 4);
    const b = randInt(1, 5);
    const c = randInt(2, 4);
    const d = randInt(1, 3);
    const val = (a + c) * xVal + (b - d);
    return {
      title: 'Αριθμητική Τιμή Αθροίσματος Πολυωνύμων',
      prompt: `Αν P(x) ＝ ${a} · x ＋ ${b} και Q(x) ＝ ${c} · x － ${d}, να βρείτε την αριθμητική τιμή της παράστασης P(${xVal}) ＋ Q(${xVal}).`,
      correct: val,
      type: 'input',
      tableData: [
        { label: 'Άθροισμα P(x) ＋ Q(x)', details: `(${a} ＋ ${c}) · x ＋ (${b} － ${d}) ＝ ${a + c} · x ＋ ${b - d}` },
        { label: `Αντικατάσταση x ＝ ${xVal}`, details: `${a + c} · ${xVal} ＋ (${b - d})` },
        { label: 'Τελική τιμή', details: `${val}` }
      ],
      explanation: `Προσθέτουμε πρώτα τα πολυώνυμα: (P ＋ Q)(x) ＝ ${a + c} · x ＋ ${b - d}. Για x ＝ ${xVal}: ${a + c} · ${xVal} ＋ (${b - d}) ＝ ${val}.`
    };
  },
  () => {
    const a = randInt(3, 6);
    const b = randInt(2, 5);
    const c = randInt(4, 9);
    const val = b - (-c);
    return {
      title: 'Τιμή Διαφοράς Πολυωνύμων για x ＝ 0',
      prompt: `Δίνονται τα πολυώνυμα A(x) ＝ ${a} · x² ＋ ${b} και B(x) ＝ 2 · x² － ${c}. Ποια είναι η τιμή της διαφοράς A(0) － B(0);`,
      correct: val,
      type: 'input',
      tableData: [
        { label: 'A(0)', details: `${a} · 0² ＋ ${b} ＝ ${b}` },
        { label: 'B(0)', details: `2 · 0² － ${c} ＝ －${c}` },
        { label: 'A(0) － B(0)', details: `${b} － (－${c}) ＝ ${b} ＋ ${c} ＝ ${val}` }
      ],
      explanation: `Για x ＝ 0 απομένουν οι σταθεροί όροι: A(0) ＝ ${b} και B(0) ＝ －${c}. Η διαφορά τους είναι ${b} － (－${c}) ＝ ${val}.`
    };
  },
  () => {
    const a = randInt(1, 3);
    const b = randInt(2, 4);
    const sumP = a + b;
    const sumQ = 2 + 1;
    const diff = sumP - sumQ;
    return {
      title: 'Διαφορά Αθροίσματος Συντελεστών για x ＝ 1',
      prompt: `Αν P(x) ＝ ${a} · x² ＋ ${b} · x και Q(x) ＝ 2 · x² ＋ x, ποια είναι η τιμή [P(x) － Q(x)] για x ＝ 1;`,
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'P(1)', details: `${a} · 1² ＋ ${b} · 1 ＝ ${sumP}` },
        { label: 'Q(1)', details: `2 · 1² ＋ 1 ＝ ${sumQ}` },
        { label: 'P(1) － Q(1)', details: `${sumP} － ${sumQ} ＝ ${diff}` }
      ],
      explanation: `Για x ＝ 1, υπολογίζουμε: P(1) ＝ ${sumP} και Q(1) ＝ ${sumQ}. Άρα P(1) － Q(1) ＝ ${diff}.`
    };
  },
  () => {
    const k = randInt(3, 7);
    return {
      title: 'Αντίθετο Πολυώνυμο και Μηδενισμός',
      prompt: `Αν Q(x) είναι το αντίθετο του πολυωνύμου P(x) ＝ 4 · x² － ${k} · x ＋ 9, ποια είναι η τιμή του αθροίσματος P(5) ＋ Q(5);`,
      correct: 0,
      type: 'input',
      tableData: [
        { label: 'Ιδιότητα αντιθέτων', details: 'P(x) ＋ Q(x) ＝ 0 για κάθε τιμή του x' },
        { label: 'Για x ＝ 5', details: 'P(5) ＋ Q(5) ＝ 0' }
      ],
      explanation: `Εφόσον τα δύο πολυώνυμα είναι αντίθετα, το άθροισμά τους ισούται με το μηδενικό πολυώνυμο (0). Συνεπώς, για οποιαδήποτε τιμή του x (όπως το 5), το αποτέλεσμα είναι πάντα 0.`
    };
  },
  () => {
    const a = randInt(2, 5);
    const b = randInt(3, 8);
    const res = 2 * b;
    return {
      title: 'Διαφορά με Αντίθετο Πολυώνυμο',
      prompt: `Αν A(x) ＝ ${a} · x ＋ ${b} και B(x) ＝ －${a} · x － ${b}, ποια είναι η τιμή της διαφοράς A(0) － B(0);`,
      correct: res,
      type: 'input',
      tableData: [
        { label: 'A(0)', details: `${b}` },
        { label: 'B(0)', details: `－${b}` },
        { label: 'A(0) － B(0)', details: `${b} － (－${b}) ＝ ${b} ＋ ${b} ＝ ${res}` }
      ],
      explanation: `Υπολογίζουμε για x ＝ 0: A(0) ＝ ${b} και B(0) ＝ －${b}. Η διαφορά είναι ${b} － (－${b}) ＝ ${res}.`
    };
  },
  () => {
    const m = randInt(2, 4);
    const n = randInt(1, 3);
    const val = 2 * (m + n);
    return {
      title: 'Υπολογισμός Διπλάσιου Αθροίσματος',
      prompt: `Δίνονται τα πολυώνυμα P(x) ＝ ${m} · x και Q(x) ＝ ${n} · x. Ποια είναι η τιμή της παράστασης 2 · [P(1) ＋ Q(1)];`,
      correct: val,
      type: 'input',
      tableData: [
        { label: 'P(1) ＋ Q(1)', details: `${m} ＋ ${n} ＝ ${m + n}` },
        { label: 'Διπλάσιο', details: `2 · ${m + n} ＝ ${val}` }
      ],
      explanation: `Για x ＝ 1: P(1) ＝ ${m} και Q(1) ＝ ${n}. Το άθροισμά τους είναι ${m + n} και το διπλάσιο είναι 2 · ${m + n} ＝ ${val}.`
    };
  }
];

// POOL Q12: Προβλήματα Καθημερινής Ζωής & Οικονομικών (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    const revX = randInt(15, 25);
    const costX = randInt(8, 12);
    const fixedCost = randInt(40, 80);
    const profitX = revX - costX;
    return {
      title: 'Συνάρτηση Κέρδους Επιχείρησης (Έσοδα － Έξοδα)',
      prompt: `Τα μηνιαία έσοδα μιας βιοτεχνίας εκφράζονται από το πολυώνυμο E(x) ＝ ${revX} · x (σε €) και τα συνολικά έξοδα από το K(x) ＝ ${costX} · x ＋ ${fixedCost} (σε €), όπου x τα τεμάχια παραγωγής. Ποιο πολυώνυμο εκφράζει το καθαρό κέρδος Kερδ(x) ＝ E(x) － K(x);`,
      correct: `${profitX} · x － ${fixedCost}`,
      type: 'mcq',
      distractors: () => [
        `${profitX} · x ＋ ${fixedCost}`,
        `${revX + costX} · x － ${fixedCost}`,
        `${profitX} · x`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Έσοδα E(x)', details: `${revX} · x` },
        { label: 'Έξοδα K(x)', details: `${costX} · x ＋ ${fixedCost}` },
        { label: 'Κέρδος E(x) － K(x)', details: `${revX} · x － (${costX} · x ＋ ${fixedCost}) ＝ ${profitX} · x － ${fixedCost}` }
      ],
      explanation: `Το κέρδος ισούται με έσοδα μείον έξοδα: E(x) － K(x) ＝ ${revX} · x － (${costX} · x ＋ ${fixedCost}) ＝ ${profitX} · x － ${fixedCost}. Το πλην αλλάζει το πρόσημο του πάγιου κόστους σε －${fixedCost}.`
    };
  },
  () => {
    const acc1 = randInt(10, 20);
    const acc2 = randInt(5, 15);
    const week1 = randInt(3, 5);
    const week2 = randInt(2, 4);
    const totalConst = acc1 + acc2;
    const totalX = week1 + week2;
    return {
      title: 'Κοινή Αποταμίευση Δύο Αδελφών',
      prompt: `Δύο αδέλφια αποταμιεύουν χρήματα. Ο πρώτος έχει A(t) ＝ ${week1} · t ＋ ${acc1} (€) και ο δεύτερος B(t) ＝ ${week2} · t ＋ ${acc2} (€), όπου t οι εβδομάδες. Ποιο πολυώνυμο εκφράζει το συνολικό τους ποσό A(t) ＋ B(t);`,
      correct: `${totalX} · t ＋ ${totalConst}`,
      type: 'mcq',
      distractors: () => [
        `${totalX} · t ＋ ${acc1}`,
        `${week1 + week2} · t ＋ ${acc2}`,
        `${totalX * 2} · t ＋ ${totalConst}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Ποσό 1ου A(t)', details: `${week1} · t ＋ ${acc1}` },
        { label: 'Ποσό 2ου B(t)', details: `${week2} · t ＋ ${acc2}` },
        { label: 'Συνολικό ποσό', details: `(${week1} ＋ ${week2}) · t ＋ (${acc1} ＋ ${acc2}) ＝ ${totalX} · t ＋ ${totalConst}` }
      ],
      explanation: `Προσθέτουμε τα δύο πολυώνυμα: (${week1} · t ＋ ${acc1}) ＋ (${week2} · t ＋ ${acc2}) ＝ ${totalX} · t ＋ ${totalConst} €.`
    };
  },
  () => {
    const tank1 = randInt(50, 80);
    const tank2 = randInt(30, 45);
    const rate1 = randInt(4, 7);
    const rate2 = randInt(2, 3);
    const diffConst = tank1 - tank2;
    return {
      title: 'Διαφορά Στάθμης Δύο Δεξαμενών',
      prompt: `Δύο δεξαμενές περιέχουν νερό: Δ₁(t) ＝ ${tank1} － ${rate1} · t και Δ₂(t) ＝ ${tank2} － ${rate2} · t (σε λίτρα). Πόσα περισσότερα λίτρα είχε η 1η δεξαμενή αρχικά (τη χρονική στιγμή t ＝ 0);`,
      correct: diffConst,
      type: 'input',
      unit: 'λίτρα',
      tableData: [
        { label: 'Αρχική ποσότητα 1ης (t ＝ 0)', details: `${tank1} λίτρα` },
        { label: 'Αρχική ποσότητα 2ης (t ＝ 0)', details: `${tank2} λίτρα` },
        { label: 'Αρχική διαφορά', details: `${tank1} － ${tank2} ＝ ${diffConst} λίτρα` }
      ],
      explanation: `Για t ＝ 0, οι δεξαμενές είχαν ${tank1} και ${tank2} λίτρα αντίστοιχα. Η διαφορά τους είναι ${tank1} － ${tank2} ＝ ${diffConst} λίτρα.`
    };
  },
  () => {
    const priceA = randInt(4, 7);
    const priceB = randInt(3, 5);
    const discount = randInt(2, 4);
    const totalX = priceA + priceB;
    return {
      title: 'Συνολικό Κόστος Αγορών με Έκπτωση',
      prompt: `Ένας πελάτης αγοράζει προϊόντα αξίας A(x) ＝ ${priceA} · x ＋ 10 (€) και B(x) ＝ ${priceB} · x ＋ 5 (€). Αν το κατάστημα του προσφέρει έκπτωση ${discount} €, ποιο είναι το πολυώνυμο του τελικού λογαριασμού A(x) ＋ B(x) － ${discount};`,
      correct: `${totalX} · x ＋ ${15 - discount}`,
      type: 'mcq',
      distractors: () => [
        `${totalX} · x ＋ 15`,
        `${totalX} · x ＋ ${15 + discount}`,
        `${priceA} · x ＋ ${15 - discount}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Άθροισμα αγορών A ＋ B', details: `${priceA} · x ＋ 10 ＋ ${priceB} · x ＋ 5 ＝ ${totalX} · x ＋ 15` },
        { label: 'Αφαίρεση έκπτωσης', details: `${totalX} · x ＋ 15 － ${discount} ＝ ${totalX} · x ＋ ${15 - discount}` }
      ],
      explanation: `Προσθέτουμε τα δύο ποσά και αφαιρούμε την έκπτωση: (${priceA} · x ＋ 10) ＋ (${priceB} · x ＋ 5) － ${discount} ＝ ${totalX} · x ＋ ${15 - discount}.`
    };
  },
  () => {
    const base = randInt(10, 20);
    const hours = randInt(2, 4);
    const rateA = 15;
    const rateB = 10;
    const diff = (rateA - rateB) * hours;
    return {
      title: 'Σύγκριση Κόστους Δύο Τεχνικών',
      prompt: `Δύο τεχνικοί χρεώνουν: T₁(h) ＝ ${rateA} · h ＋ ${base} και T₂(h) ＝ ${rateB} · h ＋ ${base} (σε €), όπου h οι ώρες εργασίας. Πόσα ευρώ (€) ακριβότερος είναι ο 1ος τεχνικός για εργασία ${hours} ωρών;`,
      correct: diff,
      type: 'input',
      unit: '€',
      tableData: [
        { label: `Χρέωση 1ου για h ＝ ${hours}`, details: `${rateA} · ${hours} ＋ ${base} ＝ ${rateA * hours + base} €` },
        { label: `Χρέωση 2ου για h ＝ ${hours}`, details: `${rateB} · ${hours} ＋ ${base} ＝ ${rateB * hours + base} €` },
        { label: 'Διαφορά', details: `${rateA * hours + base} － (${rateB * hours + base}) ＝ ${diff} €` }
      ],
      explanation: `Η διαφορά χρέωσης είναι T₁(h) － T₂(h) ＝ (${rateA} － ${rateB}) · h ＝ 5 · h. Για h ＝ ${hours} ώρες: 5 · ${hours} ＝ ${diff} €.`
    };
  },
  () => {
    const p1 = randInt(3, 6);
    const p2 = randInt(2, 5);
    const diff = p1 - p2;
    return {
      title: 'Διαφορά Ρυθμού Παραγωγής',
      prompt: `Δύο μηχανές παράγουν M₁(t) ＝ ${p1} · t² ＋ 20 και M₂(t) ＝ ${p2} · t² ＋ 20 εξαρτήματα σε χρόνο t. Ποιος είναι ο συντελεστής του t² στο πολυώνυμο της διαφοράς M₁(t) － M₂(t);`,
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'M₁(t) － M₂(t)', details: `(${p1} · t² ＋ 20) － (${p2} · t² ＋ 20)` },
        { label: 'Απλοποίηση', details: `(${p1} － ${p2}) · t² ＋ (20 － 20) ＝ ${diff} · t²` }
      ],
      explanation: `Αφαιρώντας τα δύο πολυώνυμα, οι σταθεροί όροι εξουδετερώνονται και μένει: (${p1} － ${p2}) · t² ＝ ${diff} · t². Ο συντελεστής είναι ${diff}.`
    };
  }
];

export default function ProsthesiAfairesiPolionimonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Αναγωγή ομοίων όρων
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Κανόνας Πρόσθεσης Μονωνύμων',
      prompt: q1IsCorrect
        ? 'Μπορούμε να προσθέσουμε δύο μονώνυμα σε ένα νέο μονώνυμο ΜΟΝΟ όταν αυτά είναι όμοια.'
        : 'Μπορούμε να προσθέσουμε οποιαδήποτε δύο μονώνυμα σε ένα ενιαίο μονώνυμο, ακόμη κι αν έχουν διαφορετικό κύριο μέρος.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η πρόσθεση μονωνύμων επιτρέπεται μόνο όταν τα μονώνυμα είναι όμοια (έχουν το ίδιο κύριο μέρος). Διαφορετικά, το άθροισμά τους παραμένει πολυώνυμο.'
    });

    // Q2: MCQ - Άθροισμα Μονωνύμων
    const cA = randInt(3, 7);
    const cB = randInt(2, 6);
    const sumC = cA + cB;
    qList.push({
      id: 2,
      title: 'Πρόσθεση Ομοίων Μονωνύμων',
      prompt: `Ποιο είναι το αποτέλεσμα της πρόσθεσης: ${cA} · x² ＋ ${cB} · x²;`,
      type: 'mcq',
      correct: `${sumC} · x²`,
      options: ensureFourUniqueOptions(`${sumC} · x²`, () => [
        `${sumC} · x⁴`,
        `${cA * cB} · x²`,
        `${sumC} · x`
      ][randInt(0, 2)]),
      explanation: `Προσθέτουμε μόνο τους συντελεστές και διατηρούμε το ίδιο κύριο μέρος: (${cA} ＋ ${cB}) · x² ＝ ${sumC} · x². Οι εκθέτες ΔΕΝ προστίθενται!`
    });

    // Q3: Input - Αφαίρεση Μονωνύμων
    const subA = randInt(7, 12);
    const subB = randInt(2, 6);
    const subRes = subA - subB;
    qList.push({
      id: 3,
      title: 'Αφαίρεση Μονωνύμων',
      prompt: `Ποιος είναι ο συντελεστής του x³ στην πράξη: ${subA} · x³ － ${subB} · x³;`,
      type: 'input',
      correct: subRes,
      explanation: `Αφαιρούμε τους συντελεστές: ${subA} － ${subB} ＝ ${subRes}. Ο συντελεστής είναι ${subRes}.`
    });

    // Q4: MCQ - Αντίθετο Πολυώνυμο
    const aCo = randInt(2, 5);
    const bCo = randInt(3, 7);
    const cCo = randInt(1, 8);
    const oppStr = `－${aCo} · x² ＋ ${bCo} · x － ${cCo}`;
    qList.push({
      id: 4,
      title: 'Εύρεση Αντίθετου Πολυωνύμου',
      prompt: `Ποιο είναι το αντίθετο του πολυωνύμου P(x) ＝ ${aCo} · x² － ${bCo} · x ＋ ${cCo};`,
      type: 'mcq',
      correct: oppStr,
      options: ensureFourUniqueOptions(oppStr, () => [
        `－${aCo} · x² － ${bCo} · x ＋ ${cCo}`,
        `${aCo} · x² ＋ ${bCo} · x － ${cCo}`,
        `－${aCo} · x² ＋ ${bCo} · x ＋ ${cCo}`
      ][randInt(0, 2)]),
      explanation: `Το αντίθετο πολυώνυμο προκύπτει αλλάζοντας τα πρόσημα ΟΛΩΝ των όρων: ＋${aCo} σε －${aCo}, －${bCo} σε ＋${bCo}, και ＋${cCo} σε －${cCo}.`
    });

    // Q5: True / False - Απαλοιφή Παρενθέσεων
    const q5IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: 'Κανόνας Προσήμων στην Απαλοιφή',
      prompt: q5IsCorrect
        ? 'Όταν μπροστά από μια παρένθεση υπάρχει πρόσημο « － », αλλάζουμε τα πρόσημα όλων των όρων που βρίσκονται μέσα στην παρένθεση.'
        : 'Όταν μπροστά από μια παρένθεση υπάρχει πρόσημο « － », αλλάζουμε μόνο το πρόσημο του πρώτου όρου μέσα στην παρένθεση.',
      type: 'tf',
      correct: q5IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Το πρόσημο πλην έξω από παρένθεση επηρεάζει εξίσου όλους ανεξαιρέτως τους όρους της παρένθεσης, αντιστρέφοντας τα πρόσημά τους.'
    });

    // Q6: MCQ - Άθροισμα Αντιθέτων Μονωνύμων
    const kM = randInt(3, 9);
    qList.push({
      id: 6,
      title: 'Άθροισμα Αντιθέτων Μονωνύμων',
      prompt: `Ποιο είναι το αποτέλεσμα της παράστασης: ${kM} · x² · y ＋ (－${kM} · x² · y);`,
      type: 'mcq',
      correct: '0 (Μηδενικό Μονώνυμο)',
      options: ensureFourUniqueOptions('0 (Μηδενικό Μονώνυμο)', () => [
        `${2 * kM} · x² · y`,
        `x² · y`,
        `－${kM} · x² · y`
      ][randInt(0, 2)]),
      explanation: `Δύο αντίθετα μονώνυμα έχουν αντίθετους συντελεστές (${kM} και －${kM}). Το άθροισμά τους είναι 0.`
    });

    // Q7: MCQ - Βαθμός Αθροίσματος Πολυωνύμων
    qList.push({
      id: 7,
      title: 'Βαθμός Αθροίσματος',
      prompt: 'Αν προσθέσουμε ένα πολυώνυμο 3ου βαθμού και ένα πολυώνυμο 2ου βαθμού, ποιος θα είναι ο βαθμός του αθροίσματος;',
      type: 'mcq',
      correct: '3ος βαθμός',
      options: ensureFourUniqueOptions('3ος βαθμός', () => [
        '5ος βαθμός',
        '2ος βαθμός',
        '6ος βαθμός'
      ][randInt(0, 2)]),
      explanation: 'Ο όρος 3ου βαθμού δεν έχει όμοιο όρο στο δεύτερο πολυώνυμο για να εξουδετερωθεί. Επομένως παραμένει ο μεγαλύτερος βαθμός, άρα το άθροισμα είναι 3ου βαθμού.'
    });

    // Q8: Input - Απλοποίηση με απαλοιφή
    const valConst = randInt(4, 9);
    qList.push({
      id: 8,
      title: 'Υπολογισμός μετά από Απαλοιφή',
      prompt: `Στην παράσταση: (5 · x ＋ ${valConst}) － (5 · x － 2), ποιος είναι ο τελικός αριθμός που προκύπτει;`,
      correct: valConst + 2,
      type: 'input',
      explanation: `Απαλείφουμε τις παρενθέσεις: 5 · x ＋ ${valConst} － 5 · x ＋ 2. Οι όροι 5 · x αλληλοεξουδετερώνονται (5 · x － 5 · x ＝ 0) και μένει: ${valConst} ＋ 2 ＝ ${valConst + 2}.`
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
      title="Ασκήσεις: Πρόσθεση & Αφαίρεση Πολυωνύμων | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στην πρόσθεση και αφαίρεση μονωνύμων και πολυωνύμων με αναλυτικά βήματα και βαθμολόγηση για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/11-prosthesi-afairesi-polionimon"
      backText="Θεωρία Κεφ. 08"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/11-prosthesi-afairesi-polionimon"
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
                Πρόσθεση & Αφαίρεση Πολυωνύμων: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».
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
                ? 'Εξαιρετική επίδοση! Κατέχετε πλήρως τους κανόνες απαλοιφής παρενθέσεων και αναγωγής ομοίων όρων.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα, ειδικά στον κανόνα του μείον έξω από την παρένθεση!'}
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
                <p className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                  {q.prompt}
                </p>

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
                              {opt}
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
                      <div className="font-bold text-slate-900 mb-1">
                        Σωστή Απάντηση: <span className="font-mono text-emerald-700">{q.correct} {q.unit || ''}</span>
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
