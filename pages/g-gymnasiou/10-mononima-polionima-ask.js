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

const PROBLEM_POOL_Q9 = [
  () => {
    const a1 = randInt(2, 5);
    const a2 = randInt(1, 4);
    const b = randInt(2, 6);
    const c = randInt(1, 9);
    const totalA = a1 + a2;
    return {
      title: 'Αναγωγή Ομοίων Όρων σε Δευτεροβάθμιο Πολυώνυμο',
      prompt: `Δίνεται το πολυώνυμο: P(x) ＝ ${a1} · x² ＋ ${b} · x ＋ ${a2} · x² － ${c}. Ποιος είναι ο συντελεστής του x² μετά την αναγωγή των ομοίων όρων;`,
      correct: totalA,
      type: 'input',
      tableData: [
        { label: 'Όροι με x²', details: `${a1} · x² ＋ ${a2} · x²` },
        { label: 'Άθροισμα συντελεστών', details: `(${a1} ＋ ${a2}) ＝ ${totalA}` },
        { label: 'Τελικός όρος x²', details: `${totalA} · x²` }
      ],
      explanation: `Εντοπίζουμε τους ομοίους όρους ${a1} · x² και ${a2} · x². Προσθέτουμε τους συντελεστές τους: ${a1} ＋ ${a2} ＝ ${totalA}. Άρα ο τελικός συντελεστής του x² είναι ${totalA}.`
    };
  },
  () => {
    const a1 = randInt(6, 10);
    const a2 = randInt(2, 5);
    const diff = a1 - a2;
    return {
      title: 'Αφαίρεση Ομοίων Όρων',
      prompt: `Στο πολυώνυμο Q(y) ＝ ${a1} · y³ ＋ 4 · y － ${a2} · y³ ＋ 7, ποιος είναι ο συντελεστής του y³ στην ανηγμένη μορφή;`,
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'Όροι με y³', details: `${a1} · y³ － ${a2} · y³` },
        { label: 'Πράξη συντελεστών', details: `${a1} － ${a2} ＝ ${diff}` },
        { label: 'Τελικός όρος y³', details: `${diff} · y³` }
      ],
      explanation: `Συγκεντρώνουμε τους όρους 3ου βαθμού: ${a1} · y³ － ${a2} · y³ ＝ (${a1} － ${a2}) · y³ ＝ ${diff} · y³. Ο ζητούμενος συντελεστής είναι ${diff}.`
    };
  },
  () => {
    const a = randInt(3, 7);
    const b = randInt(2, 5);
    const c = randInt(1, 8);
    return {
      title: 'Βαθμός μετά την Ακύρωση Μεγιστοβάθμιων Όρων',
      prompt: `Δίνεται το πολυώνυμο: A(x) ＝ ${a} · x³ ＋ ${b} · x² － ${a} · x³ ＋ ${c}. Ποιος είναι ο βαθμός του πολυωνύμου μετά την αναγωγή;`,
      correct: '2ος βαθμός',
      type: 'mcq',
      distractors: () => ['3ος βαθμός', '1ος βαθμός', '0ός βαθμός', '4ος βαθμός'][randInt(0, 3)],
      tableData: [
        { label: 'Όροι x³', details: `${a} · x³ － ${a} · x³ ＝ 0 · x³ (ακυρώνονται)` },
        { label: 'Εναπομείναντες όροι', details: `${b} · x² ＋ ${c}` },
        { label: 'Μεγαλύτερος εκθέτης', details: '2 (από τον όρο x²)' }
      ],
      explanation: `Οι όροι 3ου βαθμού είναι αντίθετοι (${a} · x³ και －${a} · x³) και το άθροισμά τους μηδενίζεται. Το ανηγμένο πολυώνυμο είναι ${b} · x² ＋ ${c}, το οποίο είναι 2ου βαθμού.`
    };
  },
  () => {
    const c1 = randInt(5, 12);
    const c2 = randInt(1, 4);
    const diff = c1 - c2;
    return {
      title: 'Υπολογισμός Σταθερού Όρου',
      prompt: `Στο πολυώνυμο P(x) ＝ 3 · x² ＋ ${c1} － 2 · x － ${c2}, ποιος είναι ο τελικός σταθερός όρος μετά την αναγωγή;`,
      correct: diff,
      type: 'input',
      tableData: [
        { label: 'Σταθεροί αριθμητικοί όροι', details: `${c1} και －${c2}` },
        { label: 'Πράξη', details: `${c1} － ${c2} ＝ ${diff}` },
        { label: 'Τελικός σταθερός όρος', details: `${diff}` }
      ],
      explanation: `Ο σταθερός όρος προκύπτει από την πρόσθεση των όρων χωρίς μεταβλητή: ${c1} － ${c2} ＝ ${diff}.`
    };
  },
  () => {
    const m = randInt(2, 6);
    const n = randInt(1, 4);
    const total = m + n;
    return {
      title: 'Αναγωγή Μονωνύμων Δύο Μεταβλητών',
      prompt: `Στην παράσταση: B(x, y) ＝ ${m} · x² · y ＋ 3 · x · y² ＋ ${n} · x² · y, ποιος είναι ο συντελεστής του όρου x² · y;`,
      correct: total,
      type: 'input',
      tableData: [
        { label: 'Όμοιοι όροι με x² · y', details: `${m} · x² · y ＋ ${n} · x² · y` },
        { label: 'Άθροισμα συντελεστών', details: `${m} ＋ ${n} ＝ ${total}` },
        { label: 'Τελικός όμοιος όρος', details: `${total} · x² · y` }
      ],
      explanation: `Οι όροι ${m} · x² · y και ${n} · x² · y έχουν ακριβώς το ίδιο κύριο μέρος (x² · y). Τους προσθέτουμε: (${m} ＋ ${n}) · x² · y ＝ ${total} · x² · y.`
    };
  },
  () => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    return {
      title: 'Είδος Πολυωνύμου μετά την Αναγωγή',
      prompt: `Δίνεται το πολυώνυμο P(x) ＝ ${a} · x² ＋ ${b} · x － ${a} · x² ＋ 8. Πώς χαρακτηρίζεται το πολυώνυμο στην ανηγμένη του μορφή;`,
      correct: 'Διώνυμο',
      type: 'mcq',
      distractors: () => ['Τριώνυμο', 'Μονώνυμο', 'Μηδενικό', 'Τετραώνυμο'][randInt(0, 3)],
      tableData: [
        { label: 'Αρχικοί όροι', details: `4 όροι: ${a} · x², ${b} · x, －${a} · x², 8` },
        { label: 'Αναγωγή', details: `${a} · x² － ${a} · x² ＝ 0` },
        { label: 'Τελική ανηγμένη μορφή', details: `${b} · x ＋ 8 (ακριβώς 2 μη όμοιοι όροι)` }
      ],
      explanation: `Μετά την αναγωγή, οι όροι 2ου βαθμού αλληλοεξουδετερώνονται και απομένει η έκφραση ${b} · x ＋ 8. Εφόσον έχει ακριβώς δύο όρους, είναι Διώνυμο.`
    };
  }
];

const PROBLEM_POOL_Q10 = [
  () => {
    const a = randInt(1, 3);
    const b = randInt(2, 4);
    const c = randInt(1, 5);
    const val = a * 4 + b * 2 + c;
    return {
      title: 'Αριθμητική Τιμή Τριωνύμου για Θετικό Αριθμό',
      prompt: `Αν P(x) ＝ ${a} · x² ＋ ${b} · x ＋ ${c}, να υπολογίσετε την αριθμητική τιμή P(2).`,
      correct: val,
      type: 'input',
      tableData: [
        { label: 'Αντικατάσταση x ＝ 2', details: `P(2) ＝ ${a} · (2)² ＋ ${b} · (2) ＋ ${c}` },
        { label: 'Υπολογισμός δυνάμεων', details: `(2)² ＝ 4` },
        { label: 'Πολλαπλασιασμοί', details: `${a} · 4 ＝ ${a * 4}, και ${b} · 2 ＝ ${b * 2}` },
        { label: 'Τελικό άθροισμα', details: `${a * 4} ＋ ${b * 2} ＋ ${c} ＝ ${val}` }
      ],
      explanation: `Θέτουμε όπου x το 2: P(2) ＝ ${a} · 4 ＋ ${b} · 2 ＋ ${c} ＝ ${a * 4} ＋ ${b * 2} ＋ ${c} ＝ ${val}.`
    };
  },
  () => {
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(5, 15);
    return {
      title: 'Αριθμητική Τιμή για x ＝ 0',
      prompt: `Για το πολυώνυμο P(x) ＝ ${a} · x³ － ${b} · x ＋ ${c}, ποια είναι η τιμή του P(0);`,
      correct: c,
      type: 'input',
      tableData: [
        { label: 'Αντικατάσταση x ＝ 0', details: `P(0) ＝ ${a} · (0)³ － ${b} · (0) ＋ ${c}` },
        { label: 'Μηδενισμοί', details: `0 － 0 ＋ ${c}` },
        { label: 'Αποτέλεσμα', details: `${c}` }
      ],
      explanation: `Όταν θέτουμε x ＝ 0, όλοι οι όροι που περιέχουν τη μεταβλητή μηδενίζονται και απομένει ο σταθερός όρος: P(0) ＝ ${c}.`
    };
  },
  () => {
    const a = randInt(2, 5);
    const b = randInt(3, 6);
    const c = randInt(1, 4);
    const sum = a + b + c;
    return {
      title: 'Αριθμητική Τιμή για x ＝ 1',
      prompt: `Να βρείτε την τιμή P(1) για το πολυώνυμο P(x) ＝ ${a} · x² ＋ ${b} · x ＋ ${c}.`,
      correct: sum,
      type: 'input',
      tableData: [
        { label: 'Αντικατάσταση x ＝ 1', details: `P(1) ＝ ${a} · 1² ＋ ${b} · 1 ＋ ${c}` },
        { label: 'Υπολογισμός', details: `${a} ＋ ${b} ＋ ${c} ＝ ${sum}` }
      ],
      explanation: `Για x ＝ 1, κάθε δύναμη του 1 ισούται με 1. Άρα η τιμή P(1) ισούται ακριβώς με το άθροισμα όλων των συντελεστών: ${a} ＋ ${b} ＋ ${c} ＝ ${sum}.`
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const c = randInt(1, 6);
    const val = a - b + c;
    return {
      title: 'Αριθμητική Τιμή για Αρνητικό Αριθμό x ＝ －1',
      prompt: `Αν Q(x) ＝ ${a} · x² ＋ ${b} · x ＋ ${c}, ποια είναι η τιμή Q(－1);`,
      correct: val,
      type: 'input',
      tableData: [
        { label: 'Αντικατάσταση x ＝ －1', details: `Q(－1) ＝ ${a} · (－1)² ＋ ${b} · (－1) ＋ ${c}` },
        { label: 'Δυνάμεις προσήμων', details: `(－1)² ＝ 1,  ${b} · (－1) ＝ －${b}` },
        { label: 'Τελικό άθροισμα', details: `${a} · 1 － ${b} ＋ ${c} ＝ ${val}` }
      ],
      explanation: `Προσέχουμε τα πρόσημα: (－1)² ＝ ＋1 και ${b} · (－1) ＝ －${b}. Έτσι: Q(－1) ＝ ${a} － ${b} ＋ ${c} ＝ ${val}.`
    };
  },
  () => {
    const m = randInt(3, 7);
    const k = randInt(4, 9);
    const x = randInt(2, 4);
    const res = m * x - k;
    return {
      title: 'Υπολογισμός Τιμής Διωνύμου',
      prompt: `Για το διώνυμο D(x) ＝ ${m} · x － ${k}, να υπολογίσετε την τιμή D(${x}).`,
      correct: res,
      type: 'input',
      tableData: [
        { label: `Αντικατάσταση x ＝ ${x}`, details: `D(${x}) ＝ ${m} · (${x}) － ${k}` },
        { label: 'Γινόμενο', details: `${m} · ${x} ＝ ${m * x}` },
        { label: 'Αφαίρεση', details: `${m * x} － ${k} ＝ ${res}` }
      ],
      explanation: `Αντικαθιστούμε x ＝ ${x}: D(${x}) ＝ ${m} · ${x} － ${k} ＝ ${m * x} － ${k} ＝ ${res}.`
    };
  },
  () => {
    const coef = randInt(2, 5);
    const x = 2;
    const y = 3;
    const res = coef * (x * x) * y;
    return {
      title: 'Αριθμητική Τιμή Μονωνύμου Δύο Μεταβλητών',
      prompt: `Δίνεται το μονώνυμο M(x, y) ＝ ${coef} · x² · y. Ποια είναι η τιμή του για x ＝ 2 και y ＝ 3;`,
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Αντικατάσταση x ＝ 2, y ＝ 3', details: `M(2, 3) ＝ ${coef} · 2² · 3` },
        { label: 'Υπολογισμός δύναμης', details: `2² ＝ 4` },
        { label: 'Πολλαπλασιασμός', details: `${coef} · 4 · 3 ＝ ${res}` }
      ],
      explanation: `Υπολογίζουμε πρώτα τη δύναμη: 2² ＝ 4. Στη συνέχεια εκτελούμε τον πολλαπλασιασμό: ${coef} · 4 · 3 ＝ ${res}.`
    };
  }
];

const PROBLEM_POOL_Q11 = [
  () => {
    const a = randInt(2, 5);
    const b = randInt(1, 6);
    const coef = 3 * a;
    const constTerm = 3 * b;
    return {
      title: 'Περίμετρος Ισοπλεύρου Τριγώνου',
      prompt: `Ένα ισόπλευρο τρίγωνο έχει πλευρά μήκους α ＝ ${a} · x ＋ ${b}. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x);`,
      correct: `${coef} · x ＋ ${constTerm}`,
      type: 'mcq',
      distractors: () => [
        `${coef} · x ＋ ${b}`,
        `${a} · x ＋ ${constTerm}`,
        `${coef * 2} · x ＋ ${constTerm}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Μήκος πλευράς', details: `${a} · x ＋ ${b}` },
        { label: 'Τύπος περιμέτρου', details: 'Π ＝ 3 · α' },
        { label: 'Επιμεριστική ιδιότητα', details: `3 · (${a} · x ＋ ${b}) ＝ ${coef} · x ＋ ${constTerm}` }
      ],
      explanation: `Η περίμετρος ισοπλεύρου τριγώνου ισούται με 3 φορές την πλευρά του: Π(x) ＝ 3 · (${a} · x ＋ ${b}) ＝ ${coef} · x ＋ ${constTerm}.`
    };
  },
  () => {
    const k = randInt(3, 8);
    return {
      title: 'Εμβαδόν Ορθογωνίου Παραλληλογράμμου',
      prompt: `Ένα ορθογώνιο έχει μήκος x ＋ ${k} και πλάτος x. Ποιο πολυώνυμο εκφράζει το εμβαδόν του E(x);`,
      correct: `x² ＋ ${k} · x`,
      type: 'mcq',
      distractors: () => [
        `2 · x ＋ ${k}`,
        `x² ＋ ${k}`,
        `2 · x² ＋ ${k} · x`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Διαστάσεις', details: `Μήκος: x ＋ ${k}, Πλάτος: x` },
        { label: 'Τύπος εμβαδού', details: 'E ＝ Μήκος · Πλάτος' },
        { label: 'Ανάπτυγμα', details: `(x ＋ ${k}) · x ＝ x² ＋ ${k} · x` }
      ],
      explanation: `Το εμβαδόν προκύπτει πολλαπλασιάζοντας το μήκος επί το πλάτος: E(x) ＝ (x ＋ ${k}) · x ＝ x² ＋ ${k} · x.`
    };
  },
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 7);
    const totalX = 2 * (a + 1);
    const totalConst = 2 * b;
    return {
      title: 'Περίμετρος Ορθογωνίου',
      prompt: `Ορθογώνιο έχει μήκος ${a} · x ＋ ${b} και πλάτος x. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x);`,
      correct: `${totalX} · x ＋ ${totalConst}`,
      type: 'mcq',
      distractors: () => [
        `${totalX} · x ＋ ${b}`,
        `${a + 1} · x ＋ ${b}`,
        `${totalX * 2} · x ＋ ${totalConst}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Μήκος και Πλάτος', details: `L ＝ ${a} · x ＋ ${b},  W ＝ x` },
        { label: 'Τύπος περιμέτρου', details: 'Π ＝ 2 · (L ＋ W)' },
        { label: 'Απλοποίηση', details: `2 · (${a} · x ＋ ${b} ＋ x) ＝ 2 · (${a + 1} · x ＋ ${b}) ＝ ${totalX} · x ＋ ${totalConst}` }
      ],
      explanation: `Η περίμετρος είναι Π ＝ 2 · (μήκος ＋ πλάτος) ＝ 2 · (${a} · x ＋ ${b} ＋ x) ＝ 2 · (${a + 1} · x ＋ ${b}) ＝ ${totalX} · x ＋ ${totalConst}.`
    };
  },
  () => {
    const side = randInt(2, 5);
    const sqSide = side * side;
    return {
      title: 'Εμβαδόν Τετραγώνου με Πλευρά Μονώνυμο',
      prompt: `Ένα τετράγωνο έχει πλευρά s ＝ ${side} · x². Ποιο μονώνυμο εκφράζει το εμβαδόν του;`,
      correct: `${sqSide} · x⁴`,
      type: 'mcq',
      distractors: () => [
        `${side * 2} · x⁴`,
        `${sqSide} · x²`,
        `${side} · x⁴`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Πλευρά s', details: `${side} · x²` },
        { label: 'Τύπος εμβαδού', details: 'E ＝ s²' },
        { label: 'Ύψωση σε δύναμη', details: `(${side} · x²)² ＝ ${side}² · (x²)² ＝ ${sqSide} · x⁴` }
      ],
      explanation: `Υψώνουμε την πλευρά στο τετράγωνο: (${side} · x²)² ＝ ${side}² · (x²)² ＝ ${sqSide} · x⁴.`
    };
  },
  () => {
    const h = randInt(2, 5);
    return {
      title: 'Όγκος Παραλληλεπιπέδου',
      prompt: `Ορθογώνιο παραλληλεπίπεδο έχει βάση με εμβαδόν B(x) ＝ 3 · x² και ύψος h ＝ ${h} · x. Ποιο είναι το μονώνυμο του όγκου V(x);`,
      correct: `${3 * h} · x³`,
      type: 'mcq',
      distractors: () => [
        `${3 * h} · x²`,
        `${3 + h} · x³`,
        `${3 * h} · x⁴`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Εμβαδόν Βάσης B(x)', details: `3 · x²` },
        { label: 'Ύψος h', details: `${h} · x` },
        { label: 'Τύπος όγκου', details: `V ＝ B · h ＝ (3 · x²) · (${h} · x) ＝ ${3 * h} · x³` }
      ],
      explanation: `Ο όγκος ισούται με βάση επί ύψος: V(x) ＝ (3 · x²) · (${h} · x) ＝ (3 · ${h}) · (x² · x) ＝ ${3 * h} · x³.`
    };
  },
  () => {
    const c = randInt(2, 4);
    const d = randInt(1, 3);
    return {
      title: 'Περίμετρος Κανονικού Εξαγώνου',
      prompt: `Κανονικό εξάγωνο έχει πλευρά μήκους α ＝ ${c} · x － ${d}. Ποιο είναι το πολυώνυμο της περιμέτρου του;`,
      correct: `${6 * c} · x － ${6 * d}`,
      type: 'mcq',
      distractors: () => [
        `${6 * c} · x － ${d}`,
        `${c} · x － ${6 * d}`,
        `${5 * c} · x － ${5 * d}`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Πλευρά α', details: `${c} · x － ${d}` },
        { label: 'Πλήθος πλευρών', details: '6 ίσες πλευρές' },
        { label: 'Περίμετρος', details: `6 · (${c} · x － ${d}) ＝ ${6 * c} · x － ${6 * d}` }
      ],
      explanation: `Πολλαπλασιάζουμε το μήκος της πλευράς με το 6: 6 · (${c} · x － ${d}) ＝ ${6 * c} · x － ${6 * d}.`
    };
  }
];

const PROBLEM_POOL_Q12 = [
  () => {
    const base = randInt(3, 5);
    const perKm = randInt(1, 2);
    const km = randInt(10, 25);
    const total = base + perKm * km;
    return {
      title: 'Συνάρτηση Κόστους Διαδρομής Ταξί',
      prompt: `Το κόστος μίσθωσης ταξί εκφράζεται από το πολυώνυμο K(x) ＝ ${perKm} · x ＋ ${base} (σε €), όπου x τα διανυθέντα χιλιόμετρα. Πόσα ευρώ (€) θα πληρώσει ένας επιβάτης για διαδρομή ${km} km;`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'Πολυώνυμο Κόστους', details: `K(x) ＝ ${perKm} · x ＋ ${base}` },
        { label: 'Απόσταση x', details: `${km} km` },
        { label: 'Υπολογισμός', details: `K(${km}) ＝ ${perKm} · ${km} ＋ ${base} ＝ ${perKm * km} ＋ ${base} ＝ ${total} €` }
      ],
      explanation: `Αντικαθιστούμε x ＝ ${km} στο πολυώνυμο: K(${km}) ＝ ${perKm} · ${km} ＋ ${base} ＝ ${perKm * km} ＋ ${base} ＝ ${total} €.`
    };
  },
  () => {
    const priceAdult = randInt(8, 12);
    const priceChild = randInt(4, 6);
    const adults = randInt(15, 30);
    const children = randInt(20, 40);
    const total = priceAdult * adults + priceChild * children;
    return {
      title: 'Συνολικό Κόστος Εισιτηρίων Παράστασης',
      prompt: `Η συνολική είσπραξη ενός θεάτρου δίνεται από το πολυώνυμο E(x, y) ＝ ${priceAdult} · x ＋ ${priceChild} · y (σε €), όπου x ο αριθμός των ενηλίκων και y ο αριθμός των παιδιών. Ποια είναι η είσπραξη για ${adults} ενήλικες και ${children} παιδιά;`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'Τιμή ανά ενήλικα (x)', details: `${priceAdult} €` },
        { label: 'Τιμή ανά παιδί (y)', details: `${priceChild} €` },
        { label: 'Πλήθος θεατών', details: `x ＝ ${adults}, y ＝ ${children}` },
        { label: 'Υπολογισμός', details: `${priceAdult} · ${adults} ＋ ${priceChild} · ${children} ＝ ${priceAdult * adults} ＋ ${priceChild * children} ＝ ${total} €` }
      ],
      explanation: `Υπολογίζουμε την αριθμητική τιμή: E(${adults}, ${children}) ＝ ${priceAdult} · ${adults} ＋ ${priceChild} · ${children} ＝ ${total} €.`
    };
  },
  () => {
    const fixed = randInt(50, 100);
    const rate = randInt(15, 25);
    const hours = randInt(4, 8);
    const total = fixed + rate * hours;
    return {
      title: 'Ημερήσια Παραγωγή Μονάδας',
      prompt: `Ο αριθμός τεμαχίων που παράγει μία γραμμή παραγωγής δίνεται από το πολυώνυμο Π(t) ＝ ${rate} · t ＋ ${fixed}, όπου t οι ώρες λειτουργίας. Πόσα τεμάχια θα παραχθούν σε ${hours} ώρες;`,
      correct: total,
      type: 'input',
      tableData: [
        { label: 'Πολυώνυμο Παραγωγής', details: `Π(t) ＝ ${rate} · t ＋ ${fixed}` },
        { label: 'Χρόνος λειτουργίας t', details: `${hours} ώρες` },
        { label: 'Υπολογισμός', details: `Π(${hours}) ＝ ${rate} · ${hours} ＋ ${fixed} ＝ ${rate * hours} ＋ ${fixed} ＝ ${total}` }
      ],
      explanation: `Θέτουμε t ＝ ${hours}: Π(${hours}) ＝ ${rate} · ${hours} ＋ ${fixed} ＝ ${rate * hours} ＋ ${fixed} ＝ ${total} τεμάχια.`
    };
  },
  () => {
    const fee = randInt(10, 20);
    const costPerGb = randInt(2, 4);
    const gb = randInt(5, 12);
    const total = fee + costPerGb * gb;
    return {
      title: 'Λογαριασμός Προγράμματος Κινητής',
      prompt: `Ο μηνιαίος λογαριασμός ενός συμβολαίου υπολογίζεται από τον τύπο Λ(g) ＝ ${costPerGb} · g ＋ ${fee} (σε €), όπου g τα επιπλέον gigabytes. Αν καταναλωθούν ${gb} επιπλέον GB, ποιος είναι ο τελικός λογαριασμός σε €;`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'Πάγιο τέλος', details: `${fee} €` },
        { label: 'Κόστος ανά GB', details: `${costPerGb} €` },
        { label: 'Υπερκατανάλωση g', details: `${gb} GB` },
        { label: 'Τελικό ποσό', details: `${costPerGb} · ${gb} ＋ ${fee} ＝ ${total} €` }
      ],
      explanation: `Αντικαθιστούμε g ＝ ${gb}: Λ(${gb}) ＝ ${costPerGb} · ${gb} ＋ ${fee} ＝ ${costPerGb * gb} ＋ ${fee} ＝ ${total} €.`
    };
  },
  () => {
    const initial = randInt(20, 50);
    const weekly = randInt(5, 15);
    const weeks = randInt(6, 10);
    const total = initial + weekly * weeks;
    return {
      title: 'Εξέλιξη Αποταμίευσης Μαθητή',
      prompt: `Ένας μαθητής έχει αρχικά ${initial} € και αποταμιεύει ${weekly} € κάθε εβδομάδα. Το συνολικό ποσό εκφράζεται από το πολυώνυμο A(w) ＝ ${weekly} · w ＋ ${initial}. Πόσα ευρώ (€) θα έχει συγκεντρώσει μετά από ${weeks} εβδομάδες;`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'Αρχικό ποσό', details: `${initial} €` },
        { label: 'Εβδομαδιαία αποταμίευση', details: `${weekly} €/εβδομάδα` },
        { label: 'Εβδομάδες w', details: `${weeks}` },
        { label: 'Συνολικό ποσό', details: `${weekly} · ${weeks} ＋ ${initial} ＝ ${total} €` }
      ],
      explanation: `Υπολογίζουμε A(${weeks}) ＝ ${weekly} · ${weeks} ＋ ${initial} ＝ ${weekly * weeks} ＋ ${initial} ＝ ${total} €.`
    };
  },
  () => {
    const tank = randInt(45, 60);
    const burn = randInt(5, 8);
    const hours = randInt(3, 5);
    const remaining = tank - burn * hours;
    return {
      title: 'Υπόλοιπο Καυσίμου σε Δεξαμενή',
      prompt: `Το υπόλοιπο καυσίμου σε δεξαμενή εκφράζεται από το πολυώνυμο Y(t) ＝ ${tank} － ${burn} · t (σε λίτρα), όπου t οι ώρες λειτουργίας της μηχανής. Πόσα λίτρα καυσίμου θα απομένουν μετά από ${hours} ώρες;`,
      correct: remaining,
      type: 'input',
      unit: 'λίτρα',
      tableData: [
        { label: 'Αρχική ποσότητα', details: `${tank} λίτρα` },
        { label: 'Ρυθμός κατανάλωσης', details: `${burn} λίτρα/ώρα` },
        { label: 'Χρόνος t', details: `${hours} ώρες` },
        { label: 'Υπόλοιπο', details: `${tank} － ${burn} · ${hours} ＝ ${remaining} λίτρα` }
      ],
      explanation: `Θέτουμε t ＝ ${hours}: Y(${hours}) ＝ ${tank} － ${burn} · ${hours} ＝ ${tank} － ${burn * hours} ＝ ${remaining} λίτρα.`
    };
  }
];

export default function MononimaPolionimaExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Ορισμός Μονωνύμου',
      prompt: q1IsCorrect
        ? 'Σε ένα μονώνυμο, όλοι οι εκθέτες των μεταβλητών του είναι υποχρεωτικά φυσικοί αριθμοί.'
        : 'Μία αλγεβρική παράσταση μπορεί να είναι μονώνυμο ακόμα κι αν περιέχει αρνητικό ακέραιο εκθέτη σε μεταβλητή.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Σύμφωνα με τον ορισμό, στα μονώνυμα οι εκθέτες των μεταβλητών είναι αποκλειστικά μη αρνητικοί ακέραιοι (φυσικοί αριθμοί: 0, 1, 2, ...).'
    });

    // Q2: MCQ - Αναγνώριση Μονωνύμου (Fixed: χρήση Frac αντί για 3:x)
    const validTerms = ['－5·x²·y', '3/4·a·b³', '7·x⁴'];
    const invalidTerms = ['3/x', 'x＋y', '2·x⁻³', '4·√x'];
    const q2Correct = validTerms[randInt(0, validTerms.length - 1)];
    qList.push({
      id: 2,
      title: 'Αναγνώριση Μονωνύμου',
      prompt: 'Ποια από τις παρακάτω αλγεβρικές παραστάσεις ΕΙΝΑΙ μονώνυμο;',
      type: 'mcq',
      correct: q2Correct,
      options: ensureFourUniqueOptions(q2Correct, () => invalidTerms[randInt(0, invalidTerms.length - 1)]),
      renderOption: (opt) => {
        if (opt === '－5·x²·y') return <span>－5 · x² · y</span>;
        if (opt === '3/4·a·b³') return <span className="inline-flex items-center gap-1"><Frac num="3" den="4" /> · a · b³</span>;
        if (opt === '7·x⁴') return <span>7 · x⁴</span>;
        if (opt === '3/x') return <Frac num="3" den="x" />;
        if (opt === 'x＋y') return <span>x ＋ y</span>;
        if (opt === '2·x⁻³') return <span>2 · x⁻³</span>;
        if (opt === '4·√x') return <span className="inline-flex items-center gap-0.5">4 · <Radical>x</Radical></span>;
        return opt;
      },
      explanation: 'Μονώνυμο είναι μόνο η ακέραια αλγεβρική παράσταση στην οποία μεταξύ των μεταβλητών σημειώνεται μόνο πολλαπλασιασμός με φυσικούς εκθέτες.'
    });

    // Q3: Input - Συντελεστής μονωνύμου
    const q3Coef = randInt(-9, -2);
    qList.push({
      id: 3,
      title: 'Συντελεστής Μονωνύμου',
      prompt: `Ποιος είναι ο συντελεστής του μονωνύμου ${q3Coef} · x³ · y²;`,
      type: 'input',
      correct: q3Coef,
      explanation: `Ο συντελεστής είναι ο αριθμητικός παράγοντας του μονωνύμου, δηλαδή το ${q3Coef}.`
    });

    // Q4: MCQ - Βαθμός μονωνύμου
    const degX = randInt(2, 4);
    const degY = randInt(1, 3);
    const totalDeg = degX + degY;
    qList.push({
      id: 4,
      title: 'Βαθμός Μονωνύμου',
      prompt: `Ποιος είναι ο βαθμός του μονωνύμου 8 · x${degX === 2 ? '²' : degX === 3 ? '³' : '⁴'} · y${degY === 2 ? '²' : degY === 3 ? '³' : ''} ως προς ΟΛΕΣ τις μεταβλητές του;`,
      type: 'mcq',
      correct: `${totalDeg}ος βαθμός`,
      options: ensureFourUniqueOptions(`${totalDeg}ος βαθμός`, () => `${randInt(2, 9)}ος βαθμός`),
      explanation: `Ο συνολικός βαθμός είναι το άθροισμα των εκθετών όλων των μεταβλητών του: ${degX} ＋ ${degY} ＝ ${totalDeg}.`
    });

    // Q5: True / False
    const q5Choice = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: 'Βαθμός Μηδενικού Μονωνύμου',
      prompt: q5Choice
        ? 'Το μηδενικό μονώνυμο (ο αριθμός 0) δεν έχει βαθμό.'
        : 'Ο βαθμός του μηδενικού μονωνύμου (0) είναι ίσος με 0.',
      type: 'tf',
      correct: q5Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Το μηδενικό μονώνυμο (0) αποτελεί ειδική περίπτωση και ΔΕΝ έχει βαθμό (δεν ορίζεται βαθμός). Ο βαθμός 0 ανήκει σε κάθε μη μηδενικό σταθερό αριθμό (π.χ. το 5 είναι 0ού βαθμού).'
    });

    // Q6: MCQ - Όμοια Μονώνυμα
    const baseVar = 'x² · y';
    const similarTerms = [`4 · ${baseVar}`, `－7 · ${baseVar}`, `1/2 · ${baseVar}`];
    const nonSimilar = [`4 · x · y²`, `3 · x²`, `5 · x³ · y`, `－2 · x · y`];
    const q6Correct = similarTerms[randInt(0, similarTerms.length - 1)];
    qList.push({
      id: 6,
      title: 'Αναγνώριση Ομοίων Μονωνύμων',
      prompt: `Ποιο από τα παρακάτω μονώνυμα είναι ΟΜΟΙΟ με το 3 · ${baseVar};`,
      type: 'mcq',
      correct: q6Correct,
      options: ensureFourUniqueOptions(q6Correct, () => nonSimilar[randInt(0, nonSimilar.length - 1)]),
      renderOption: (opt) => {
        if (opt.includes('1/2')) {
          return <span className="inline-flex items-center gap-1"><Frac num="1" den="2" /> · x² · y</span>;
        }
        return opt;
      },
      explanation: 'Όμοια λέγονται τα μονώνυμα που έχουν ακριβώς το ίδιο κύριο μέρος (τις ίδιες μεταβλητές με τους ίδιους εκθέτες).'
    });

    // Q7: MCQ - Διώνυμο ή Τριώνυμο
    const q7PolyType = Math.random() < 0.5 ? 'Διώνυμο' : 'Τριώνυμο';
    const q7Expr = q7PolyType === 'Διώνυμο' ? '4 · x² － 9' : '2 · x² ＋ 5 · x － 7';
    qList.push({
      id: 7,
      title: 'Κατάταξη Πολυωνύμου',
      prompt: `Πώς ονομάζεται το ανηγμένο πολυώνυμο P(x) ＝ ${q7Expr};`,
      type: 'mcq',
      correct: q7PolyType,
      options: ensureFourUniqueOptions(q7PolyType, () => ['Μονώνυμο', 'Διώνυμο', 'Τριώνυμο', 'Τετραώνυμο'][randInt(0, 3)]),
      explanation: `Η παράσταση έχει ${q7PolyType === 'Διώνυμο' ? '2' : '3'} μη όμοιους όρους, συνεπώς είναι ${q7PolyType}.`
    });

    // Q8: Input - Βαθμός ανηγμένου πολυωνύμου
    const maxDegree = randInt(3, 5);
    const lowDegree = randInt(1, 2);
    qList.push({
      id: 8,
      title: 'Βαθμός Πολυωνύμου',
      prompt: `Ποιος είναι ο βαθμός του πολυωνύμου P(x) ＝ 7 · x${lowDegree === 2 ? '²' : ''} － 3 · x${maxDegree === 3 ? '³' : maxDegree === 4 ? '⁴' : '⁵'} ＋ 12;`,
      type: 'input',
      correct: maxDegree,
      explanation: `Ο βαθμός του πολυωνύμου καθορίζεται από τον όρο με τον μεγαλύτερο εκθέτη, ο οποίος εδώ είναι ο ${maxDegree} (από τον όρο －3 · x${maxDegree === 3 ? '³' : maxDegree === 4 ? '⁴' : '⁵'}).`
    });

    // Q9 - Q12
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
      title="Ασκήσεις: Μονώνυμα & Πολυώνυμα | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις και προβλήματα στα μονώνυμα, πολυώνυμα, βαθμό και πράξεις για τη Γ' Γυμνασίου με αναλυτική βαθμολόγηση."
      backUrl="/g-gymnasiou/10-mononima-polionima"
      backText="Θεωρία Κεφ. 10"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/10-mononima-polionima"
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
                Μονώνυμα & Πολυώνυμα: Εξάσκηση
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τα μονώνυμα και τις αλγεβρικές πράξεις.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη ακόμη εξάσκηση. Ελέγξτε τη θεωρία και τα συνήθη λάθη πριν ξαναδοκιμάσετε!'}
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
