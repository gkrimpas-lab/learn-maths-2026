// pages/st-dimotikou/21-dinameis-ask.js
import { useState, useEffect, useCallback } from 'react';
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

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμών με ελληνικό locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

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

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Τετράγωνο Παρτέρι Λουλουδιών',
    unit: 'τ.μ.',
    generate: () => {
      const sides = [6, 7, 8, 9, 11, 12];
      const a = sides[randInt(0, sides.length - 1)];
      const area = a * a;
      return {
        prompt: `Ένα τετράγωνο παρτέρι σε ένα πάρκο έχει μήκος πλευράς ${a} μέτρα. Ποια δύναμη εκφράζει το εμβαδόν του και ποιο είναι το τελικό αποτέλεσμα;`,
        unit: 'τ.μ.',
        correctVal: area,
        correctText: `${a}² ＝ ${formatNum(area)} τ.μ.`,
        tableData: [
          { item: 'Πλευρά Τετραγώνου (α)', formula: `${a} μ.`, val: `${a} μ.` },
          { item: 'Τύπος Εμβαδού', formula: 'Ε ＝ α · α ＝ α²', val: `${a}²` },
          { item: 'Τελικό Εμβαδόν', formula: `${a} · ${a}`, val: `${formatNum(area)} τ.μ.` }
        ],
        explain: `Το εμβαδόν τετραγώνου ισούται με την πλευρά υψωμένη στο τετράγωνο (α²): ${a}² ＝ ${a} · ${a} ＝ ${formatNum(area)} τ.μ.`,
        distractors: [
          `${a} · 2 ＝ ${formatNum(a * 2)} τ.μ.`,
          `2${EXPONENTS_UNICODE[Math.min(a, 10)] || `^${a}`} ＝ ${formatNum(Math.pow(2, Math.min(a, 10)))} τ.μ.`,
          `${a}³ ＝ ${formatNum(a * a * a)} τ.μ.`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Κυβικό Κουτί Αποθήκευσης',
    unit: 'κ.μ.',
    generate: () => {
      const edges = [3, 4, 5, 6];
      const a = edges[randInt(0, edges.length - 1)];
      const volume = a * a * a;
      return {
        prompt: `Ένα δοχείο αποθήκευσης έχει σχήμα κύβου με ακμή ${a} μέτρα. Ποια δύναμη εκφράζει τον όγκο του δοχείου και πόσο ισούται σε κυβικά μέτρα;`,
        unit: 'κ.μ.',
        correctVal: volume,
        correctText: `${a}³ ＝ ${formatNum(volume)} κ.μ.`,
        tableData: [
          { item: 'Ακμή Κύβου (α)', formula: `${a} μ.`, val: `${a} μ.` },
          { item: 'Τύπος Όγκου', formula: 'V ＝ α · α · α ＝ α³', val: `${a}³` },
          { item: 'Τελικός Όγκος', formula: `${a} · ${a} · ${a}`, val: `${formatNum(volume)} κ.μ.` }
        ],
        explain: `Ο όγκος του κύβου ισούται με την ακμή του στον κύβο (α³): ${a}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(volume)} κ.μ.`,
        distractors: [
          `${a} · 3 ＝ ${formatNum(a * 3)} κ.μ.`,
          `${a}² ＝ ${formatNum(a * a)} κ.μ.`,
          `3${EXPONENTS_UNICODE[a] || `^${a}`} ＝ ${formatNum(Math.pow(3, a))} κ.μ.`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Ψηφιδωτό Δάπεδο',
    unit: 'ψηφίδες',
    generate: () => {
      const rows = [7, 8, 9, 10, 12];
      const n = rows[randInt(0, rows.length - 1)];
      const total = n * n;
      return {
        prompt: `Ένας τεχνίτης κατασκευάζει ένα τετράγωνο ψηφιδωτό που αποτελείται από ${n} οριζόντιες σειρές με ${n} ψηφίδες σε κάθε σειρά. Πόσες ψηφίδες θα χρειαστεί συνολικά;`,
        unit: 'ψηφίδες',
        correctVal: total,
        correctText: `${n}² ＝ ${formatNum(total)} ψηφίδες`,
        tableData: [
          { item: 'Πλήθος Σειρών', formula: `${n}`, val: `${n}` },
          { item: 'Ψηφίδες ανά Σειρά', formula: `${n}`, val: `${n}` },
          { item: 'Σύνολο Ψηφίδων', formula: `${n} · ${n} ＝ ${n}²`, val: `${formatNum(total)} ψηφίδες` }
        ],
        explain: `Οι ψηφίδες σχηματίζουν τετράγωνο πλέγμα: ${n} σειρές των ${n} ψηφίδων ＝ ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total)} ψηφίδες.`,
        distractors: [
          `${n} · 2 ＝ ${formatNum(n * 2)} ψηφίδες`,
          `2${EXPONENTS_UNICODE[Math.min(n, 10)] || `^${n}`} ＝ ${formatNum(Math.pow(2, Math.min(n, 10)))} ψηφίδες`,
          `${n}³ ＝ ${formatNum(n * n * n)} ψηφίδες`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Διπλασιασμός Βακτηρίων σε Εργαστήριο',
    unit: 'βακτήρια',
    generate: () => {
      const hours = [3, 4, 5, 6];
      const h = hours[randInt(0, hours.length - 1)];
      const count = Math.pow(2, h);
      return {
        prompt: `Σε μία καλλιέργεια, 1 αρχικό βακτήριο διπλασιάζεται κάθε ώρα (γίνεται 2, μετά 4, μετά 8...). Πόσα βακτήρια θα υπάρχουν μετά από ${h} ώρες;`,
        unit: 'βακτήρια',
        correctVal: count,
        correctText: `2${EXPONENTS_UNICODE[h]} ＝ ${formatNum(count)} βακτήρια`,
        tableData: [
          { item: 'Αρχικός Πληθυσμός', formula: '1', val: '2⁰ ＝ 1' },
          { item: 'Ρυθμός Διπλασιασμού', formula: 'Βάση 2', val: '2' },
          { item: `Πληθυσμός σε ${h} ώρες`, formula: `2${EXPONENTS_UNICODE[h]} (2 υψωμένο στην ${h})`, val: `${formatNum(count)} βακτήρια` }
        ],
        explain: `Ο συνεχής διπλασιασμός εκφράζεται ως δύναμη με βάση το 2: 2${EXPONENTS_UNICODE[h]} ＝ ${Array(h).fill(2).join(' · ')} ＝ ${formatNum(count)} βακτήρια.`,
        distractors: [
          `2 · ${h} ＝ ${formatNum(2 * h)} βακτήρια`,
          `${h}² ＝ ${formatNum(h * h)} βακτήρια`,
          `2${EXPONENTS_UNICODE[h + 1]} ＝ ${formatNum(count * 2)} βακτήρια`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Συσκευασία Κυβικών Κουτιών',
    unit: 'κουτιά',
    generate: () => {
      const counts = [2, 3, 4];
      const n = counts[randInt(0, counts.length - 1)];
      const total = n * n * n;
      return {
        prompt: `Ένα μεγάλο κυβικό κιβώτιο χωράει κατά μήκος, πλάτος και ύψος από ${n} μικρά κυβικά κουτιά. Πόσα μικρά κουτιά περιέχει συνολικά το κιβώτιο;`,
        unit: 'κουτιά',
        correctVal: total,
        correctText: `${n}³ ＝ ${formatNum(total)} κουτιά`,
        tableData: [
          { item: 'Διαστάσεις (Μ · Π · Υ)', formula: `${n} · ${n} · ${n}`, val: `${n}³` },
          { item: 'Συνολικά Κουτιά', formula: `${n} · ${n} · ${n}`, val: `${formatNum(total)} κουτιά` }
        ],
        explain: `Όταν γεμίζουμε έναν κύβο σε όλες τις διαστάσεις (μήκος, πλάτος, ύψος), το συνολικό πλήθος των κουτιών ισούται με ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total)} κουτιά.`,
        distractors: [
          `${n} · 3 ＝ ${formatNum(n * 3)} κουτιά`,
          `${n}² ＝ ${formatNum(n * n)} κουτιά`,
          `3${EXPONENTS_UNICODE[n]} ＝ ${formatNum(Math.pow(3, n))} κουτιά`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Τετραγωνικό Χωράφι με Ελιές',
    unit: 'δέντρα',
    generate: () => {
      const lines = [10, 15, 20];
      const n = lines[randInt(0, lines.length - 1)];
      const total = n * n;
      return {
        prompt: `Ένας αγρότης φύτεψε ελιές σε τετράγωνη διάταξη με ${n} σειρές, όπου κάθε σειρά έχει ακριβώς ${n} ελαιόδεντρα. Πόσα δέντρα φύτεψε συνολικά;`,
        unit: 'δέντρα',
        correctVal: total,
        correctText: `${n}² ＝ ${formatNum(total)} δέντρα`,
        tableData: [
          { item: 'Σειρές', formula: `${n}`, val: `${n}` },
          { item: 'Δέντρα ανά σειρά', formula: `${n}`, val: `${n}` },
          { item: 'Σύνολο', formula: `${n} · ${n} ＝ ${n}²`, val: `${formatNum(total)} δέντρα` }
        ],
        explain: `Το πλήθος των δέντρων προκύπτει από το τετράγωνο του αριθμού των σειρών: ${n}² ＝ ${n} · ${n} ＝ ${formatNum(total)} δέντρα.`,
        distractors: [
          `${n} · 2 ＝ ${formatNum(n * 2)} δέντρα`,
          `${n} · 4 ＝ ${formatNum(n * 4)} δέντρα`,
          `${n}³ ＝ ${formatNum(n * n * n)} δέντρα`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Αλυσίδα Μηνυμάτων (Εκθετική Διάδοση)',
    unit: 'άτομα',
    generate: () => {
      const rounds = [3, 4, 5];
      const r = rounds[randInt(0, rounds.length - 1)];
      const total = Math.pow(3, r);
      return {
        prompt: `Ένα μήνυμα ξεκινά από 1 άτομο. Σε κάθε γύρο, κάθε παραλήπτης το προωθεί σε 3 νέα άτομα. Πόσα νέα άτομα θα λάβουν το μήνυμα στον ${r}ο γύρο;`,
        unit: 'άτομα',
        correctVal: total,
        correctText: `3${EXPONENTS_UNICODE[r]} ＝ ${formatNum(total)} άτομα`,
        tableData: [
          { item: '1ος Γύρος', formula: '3¹', val: '3 άτομα' },
          { item: '2ος Γύρος', formula: '3²', val: '9 άτομα' },
          { item: `${r}ος Γύρος`, formula: `3${EXPONENTS_UNICODE[r]}`, val: `${formatNum(total)} άτομα` }
        ],
        explain: `Σε κάθε γύρο το πλήθος τριπλασιάζεται (βάση 3). Στον ${r}ο γύρο τα άτομα είναι 3${EXPONENTS_UNICODE[r]} ＝ ${Array(r).fill(3).join(' · ')} ＝ ${formatNum(total)} άτομα.`,
        distractors: [
          `3 · ${r} ＝ ${formatNum(3 * r)} άτομα`,
          `${r}³ ＝ ${formatNum(Math.pow(r, 3))} άτομα`,
          `3${EXPONENTS_UNICODE[r - 1]} ＝ ${formatNum(Math.pow(3, r - 1))} άτομα`
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Δυνάμεις του 10 και Μέτρηση Δεδομένων',
    unit: 'αιτήματα',
    generate: () => {
      const exps = [4, 5, 6];
      const e = exps[randInt(0, exps.length - 1)];
      const total = Math.pow(10, e);
      return {
        prompt: `Ένας διακομιστής καταγράφει δεδομένα με ρυθμό 10${EXPONENTS_UNICODE[e]} αιτημάτων ανά ώρα. Ποιος είναι ο ακριβής αριθμός των αιτημάτων σε κανονική αριθμητική γραφή;`,
        unit: 'αιτήματα',
        correctVal: total,
        correctText: `${formatNum(total)} αιτήματα`,
        tableData: [
          { item: 'Δύναμη', formula: `10${EXPONENTS_UNICODE[e]}`, val: `Εκθέτης ${e}` },
          { item: 'Κανόνας Δυνάμεων του 10', formula: `1 ακολουθούμενο από ${e} μηδενικά`, val: `${formatNum(total)}` }
        ],
        explain: `Στις δυνάμεις με βάση το 10, γράφουμε το 1 και προσθέτουμε τόσα μηδενικά όσα δείχνει ο εκθέτης: 10${EXPONENTS_UNICODE[e]} ＝ ${formatNum(total)} αιτήματα.`,
        distractors: [
          `${formatNum(e * 10)} αιτήματα`,
          `${formatNum(Math.pow(10, e - 1))} αιτήματα`,
          `${formatNum(Math.pow(10, e + 1))} αιτήματα`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Διπλωμένο Χαρτί στη Μέση',
    unit: 'στρώσεις',
    generate: () => {
      const folds = [5, 6, 7];
      const f = folds[randInt(0, folds.length - 1)];
      const layers = Math.pow(2, f);
      return {
        prompt: `Παίρνουμε ένα μεγάλο φύλλο χαρτιού και το διπλώνουμε στη μέση ${f} συνεχόμενες φορές. Πόσες στρώσεις χαρτιού θα δημιουργηθούν συνολικά;`,
        unit: 'στρώσεις',
        correctVal: layers,
        correctText: `2${EXPONENTS_UNICODE[f]} ＝ ${formatNum(layers)} στρώσεις`,
        tableData: [
          { item: '1ο Δίπλωμα', formula: '2¹', val: '2 στρώσεις' },
          { item: '2ο Δίπλωμα', formula: '2²', val: '4 στρώσεις' },
          { item: `${f}ο Δίπλωμα`, formula: `2${EXPONENTS_UNICODE[f]}`, val: `${formatNum(layers)} στρώσεις` }
        ],
        explain: `Σε κάθε δίπλωμα οι στρώσεις διπλασιάζονται (δύναμη του 2): 2${EXPONENTS_UNICODE[f]} ＝ ${Array(f).fill(2).join(' · ')} ＝ ${formatNum(layers)} στρώσεις.`,
        distractors: [
          `2 · ${f} ＝ ${formatNum(2 * f)} στρώσεις`,
          `${f}² ＝ ${formatNum(f * f)} στρώσεις`,
          `2${EXPONENTS_UNICODE[f + 1]} ＝ ${formatNum(layers * 2)} στρώσεις`
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύγκριση Μεγέθους Δυνάμεων',
    unit: 'μονάδες',
    generate: () => {
      const pairs = [
        { b1: 2, e1: 5, v1: 32, b2: 5, e2: 2, v2: 25 },
        { b1: 3, e1: 4, v1: 81, b2: 4, e2: 3, v2: 64 },
        { b1: 2, e1: 6, v1: 64, b2: 6, e2: 2, v2: 36 }
      ];
      const p = pairs[randInt(0, pairs.length - 1)];
      const diff = p.v1 - p.v2;
      return {
        prompt: `Δίνονται οι δυνάμεις Α ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} και Β ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]}. Πόσο μεγαλύτερη είναι η δύναμη Α από τη δύναμη Β;`,
        unit: 'μονάδες',
        correctVal: diff,
        correctText: `${diff} μονάδες (Α ＝ ${p.v1}, Β ＝ ${p.v2})`,
        tableData: [
          { item: 'Δύναμη Α', formula: `${p.b1}${EXPONENTS_UNICODE[p.e1]}`, val: `${p.v1}` },
          { item: 'Δύναμη Β', formula: `${p.b2}${EXPONENTS_UNICODE[p.e2]}`, val: `${p.v2}` },
          { item: 'Διαφορά (Α － Β)', formula: `${p.v1} － ${p.v2}`, val: `${diff}` }
        ],
        explain: `Υπολογίζουμε χωριστά τις δύο δυνάμεις: Α ＝ ${p.b1}${EXPONENTS_UNICODE[p.e1]} ＝ ${p.v1} και Β ＝ ${p.b2}${EXPONENTS_UNICODE[p.e2]} ＝ ${p.v2}. Η διαφορά τους είναι ${p.v1} － ${p.v2} ＝ ${diff}.`,
        distractors: [
          `${diff + 5} μονάδες (Α ＝ ${p.v1 + 5}, Β ＝ ${p.v2})`,
          `${Math.max(1, diff - 7)} μονάδες (Α ＝ ${p.v1 - 7}, Β ＝ ${p.v2})`,
          'Είναι ίσες (0 μονάδες)'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύνθεση Κυβικών Κυβιδίων',
    unit: 'κυβάκια',
    generate: () => {
      const sizes = [3, 4, 5];
      const n = sizes[randInt(0, sizes.length - 1)];
      const total = n * n * n;
      return {
        prompt: `Ένας τρισδιάστατος κύβος αποτελείται από ${n} στρώσεις, όπου κάθε στρώση περιλαμβάνει ${n} γραμμές με ${n} μικρά κυβάκια. Πόσα κυβάκια περιέχει ολόκληρος ο κύβος;`,
        unit: 'κυβάκια',
        correctVal: total,
        correctText: `${n}³ ＝ ${formatNum(total)} κυβάκια`,
        tableData: [
          { item: 'Κυβάκια ανά στρώση', formula: `${n} · ${n} ＝ ${n}²`, val: `${n * n}` },
          { item: 'Πλήθος Στρώσεων', formula: `${n}`, val: `${n}` },
          { item: 'Συνολικός Αριθμός', formula: `${n}² · ${n} ＝ ${n}³`, val: `${formatNum(total)} κυβάκια` }
        ],
        explain: `Το συνολικό πλήθος των κύβων ισούται με ${n}³ ＝ ${n} · ${n} · ${n} ＝ ${formatNum(total)} κυβάκια.`,
        distractors: [
          `${n} · 3 ＝ ${formatNum(n * 3)} κυβάκια`,
          `${n}² ＝ ${formatNum(n * n)} κυβάκια`,
          `3${EXPONENTS_UNICODE[n]} ＝ ${formatNum(Math.pow(3, n))} κυβάκια`
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Τουρνουά Αγώνων με Σύστημα Νοκ-Άουτ',
    unit: 'παίκτες',
    generate: () => {
      const rounds = [3, 4, 5, 6];
      const r = rounds[randInt(0, rounds.length - 1)];
      const teams = Math.pow(2, r);
      return {
        prompt: `Σε ένα πρωτάθλημα τένις, σε κάθε γύρο οι μισοί παίκτες αποκλείονται. Αν για να αναδειχθεί ο πρωταθλητής απαιτούνται ακριβώς ${r} νικηφόροι γύροι, πόσοι παίκτες πρέπει να ξεκινήσουν στο τουρνουά;`,
        unit: 'παίκτες',
        correctVal: teams,
        correctText: `2${EXPONENTS_UNICODE[r]} ＝ ${formatNum(teams)} παίκτες`,
        tableData: [
          { item: 'Τελικός (1ος γύρος από το τέλος)', formula: '2¹', val: '2 παίκτες' },
          { item: 'Ημιτελικοί', formula: '2²', val: '4 παίκτες' },
          { item: `Έναρξη (${r} γύροι)`, formula: `2${EXPONENTS_UNICODE[r]}`, val: `${formatNum(teams)} παίκτες` }
        ],
        explain: `Κάθε γύρος διπλασιάζει τους απαιτούμενους συμμετέχοντες: για ${r} γύρους απαιτούνται 2${EXPONENTS_UNICODE[r]} ＝ ${formatNum(teams)} παίκτες.`,
        distractors: [
          `2 · ${r} ＝ ${formatNum(2 * r)} παίκτες`,
          `${r}² ＝ ${formatNum(r * r)} παίκτες`,
          `2${EXPONENTS_UNICODE[r - 1]} ＝ ${formatNum(teams / 2)} παίκτες`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: MCQ - Μετατροπή γινομένου σε δύναμη
  const q1Pool = [
    { base: 3, count: 4, expr: '3 · 3 · 3 · 3', correct: '3⁴', wrong: ['3 · 4', '4³', '3⁵'] },
    { base: 5, count: 3, expr: '5 · 5 · 5', correct: '5³', wrong: ['5 · 3', '3⁵', '5⁴'] },
    { base: 2, count: 5, expr: '2 · 2 · 2 · 2 · 2', correct: '2⁵', wrong: ['2 · 5', '5²', '2⁶'] },
    { base: 7, count: 2, expr: '7 · 7', correct: '7²', wrong: ['7 · 2', '2⁷', '7³'] },
    { base: 4, count: 3, expr: '4 · 4 · 4', correct: '4³', wrong: ['4 · 3', '3⁴', '4⁴'] }
  ];
  const q1Data = q1Pool[randInt(0, q1Pool.length - 1)];
  const q1Options = shuffle([...new Set([q1Data.correct, ...q1Data.wrong])]);

  // Q2: Input - Υπολογισμός τετραγώνου ή κύβου
  const q2Pool = [
    { base: 4, exp: 2, val: 16, explain: '4² ＝ 4 · 4 ＝ 16' },
    { base: 6, exp: 2, val: 36, explain: '6² ＝ 6 · 6 ＝ 36' },
    { base: 7, exp: 2, val: 49, explain: '7² ＝ 7 · 7 ＝ 49' },
    { base: 8, exp: 2, val: 64, explain: '8² ＝ 8 · 8 ＝ 64' },
    { base: 9, exp: 2, val: 81, explain: '9² ＝ 9 · 9 ＝ 81' },
    { base: 2, exp: 3, val: 8, explain: '2³ ＝ 2 · 2 · 2 ＝ 8' },
    { base: 3, exp: 3, val: 27, explain: '3³ ＝ 3 · 3 · 3 ＝ 27' },
    { base: 4, exp: 3, val: 64, explain: '4³ ＝ 4 · 4 · 4 ＝ 64' },
    { base: 5, exp: 3, val: 125, explain: '5³ ＝ 5 · 5 · 5 ＝ 125' }
  ];
  const q2Data = q2Pool[randInt(0, q2Pool.length - 1)];

  // Q3: MCQ - Αναγνώριση Βάσης και Εκθέτη
  const q3Pool = [
    { base: 8, exp: 5, qType: 'base', prompt: 'Στη δύναμη 8⁵, ποιος αριθμός είναι η βάση;', correct: '8', wrong: ['5', '40', '13'] },
    { base: 6, exp: 4, qType: 'exp', prompt: 'Στη δύναμη 6⁴, ποιος αριθμός είναι ο εκθέτης;', correct: '4', wrong: ['6', '24', '10'] },
    { base: 9, exp: 3, qType: 'exp', prompt: 'Στη δύναμη 9³, ποιος αριθμός είναι ο εκθέτης;', correct: '3', wrong: ['9', '27', '12'] },
    { base: 7, exp: 6, qType: 'base', prompt: 'Στη δύναμη 7⁶, ποιος αριθμός είναι η βάση;', correct: '7', wrong: ['6', '42', '13'] }
  ];
  const q3Data = q3Pool[randInt(0, q3Pool.length - 1)];
  const q3Options = shuffle([...new Set([q3Data.correct, ...q3Data.wrong])]);

  // Q4: MCQ - Ειδικές περιπτώσεις (εκθέτης 0 και 1)
  const q4Pool = [
    { base: 15, exp: 0, val: 1, explain: 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (15⁰ ＝ 1).' },
    { base: 28, exp: 1, val: 28, explain: 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (28¹ ＝ 28).' },
    { base: 100, exp: 0, val: 1, explain: 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (100⁰ ＝ 1).' },
    { base: 54, exp: 1, val: 54, explain: 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (54¹ ＝ 54).' }
  ];
  const q4Data = q4Pool[randInt(0, q4Pool.length - 1)];
  const q4Correct = String(q4Data.val);
  const q4Options = shuffle([
    ...new Set([q4Correct, '0', String(q4Data.base), String(q4Data.base + 1), '1'])
  ]).slice(0, 4);

  // Q5: True / False - Σύγχυση δύναμης με πολλαπλασιασμό (α^ν vs α * ν)
  const q5Base = [2, 3, 4, 5][randInt(0, 3)];
  const q5Exp = [3, 4][randInt(0, 1)];
  const q5Product = q5Base * q5Exp;
  const q5Actual = Math.pow(q5Base, q5Exp);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ισούται με ${q5Actual} (δηλαδή ${Array(q5Exp).fill(q5Base).join(' · ')}).`
    : `Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ισούται με ${q5Product} (δηλαδή ${q5Base} · ${q5Exp}).`;

  // Q6: True / False - Έννοια Εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε μία δύναμη, ο εκθέτης δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.'
    : 'Σε μία δύναμη, ο εκθέτης πολλαπλασιάζεται απλώς με τη βάση μία φορά.';

  // Q7: Input - Υπολογισμός δυνάμεων με βάση το 2 ή το 10
  const q7Pool = [
    { base: 2, exp: 4, val: 16, explain: '2⁴ ＝ 2 · 2 · 2 · 2 ＝ 16' },
    { base: 2, exp: 5, val: 32, explain: '2⁵ ＝ 2 · 2 · 2 · 2 · 2 ＝ 32' },
    { base: 10, exp: 2, val: 100, explain: '10² ＝ 10 · 10 ＝ 100' },
    { base: 10, exp: 3, val: 1000, explain: '10³ ＝ 10 · 10 · 10 ＝ 1.000' },
    { base: 10, exp: 4, val: 10000, explain: '10⁴ ＝ 10.000 (το 1 ακολουθούμενο από 4 μηδενικά)' }
  ];
  const q7Data = q7Pool[randInt(0, q7Pool.length - 1)];

  // Q8: MCQ - Σύγκριση δύο δυνάμεων
  const q8Pool = [
    {
      prompt: 'Ποια από τις παρακάτω σχέσεις είναι ΣΩΣΤΗ;',
      correct: '2³ ＜ 3²',
      wrong: ['2³ ＞ 3²', '2³ ＝ 3²', '2³ ＝ 2 · 3'],
      explain: '2³ ＝ 2 · 2 · 2 ＝ 8, ενώ 3² ＝ 3 · 3 ＝ 9. Άρα 8 ＜ 9 (2³ ＜ 3²).'
    },
    {
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης 2³ ＋ 3²;',
      correct: '17',
      wrong: ['12', '15', '25'],
      explain: '2³ ＝ 8 και 3² ＝ 9. Επομένως 8 ＋ 9 ＝ 17.'
    },
    {
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης 10² － 5²;',
      correct: '75',
      wrong: ['50', '25', '95'],
      explain: '10² ＝ 100 και 5² ＝ 25. Επομένως 100 － 25 ＝ 75.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrong])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'mcq',
      title: 'Γραφή ως Δύναμη',
      prompt: `Πώς γράφεται σύντομα με τη μορφή δύναμης το γινόμενο: ${q1Data.expr};`,
      options: q1Options,
      correct: q1Data.correct,
      explain: `Επειδή ο παράγοντας ${q1Data.base} πολλαπλασιάζεται ${q1Data.count} φορές με τον εαυτό του, γράφεται ${q1Data.correct}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Υπολογισμός Τετραγώνου ή Κύβου',
      prompt: `Ποια είναι η τελική τιμή της δύναμης ${q2Data.base}${EXPONENTS_UNICODE[q2Data.exp]};`,
      correct: String(q2Data.val),
      explain: q2Data.explain
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Αναγνώριση Βάσης & Εκθέτη',
      prompt: q3Data.prompt,
      options: q3Options,
      correct: q3Data.correct,
      explain:
        q3Data.qType === 'base'
          ? `Η βάση είναι ο μεγάλος αριθμός που βρίσκεται κάτω και πολλαπλασιάζεται (${q3Data.correct}).`
          : `Ο εκθέτης είναι ο μικρός αριθμός πάνω δεξιά που δείχνει πόσες φορές γράφεται η βάση (${q3Data.correct}).`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ειδικές Περιπτώσεις (0 & 1)',
      prompt: `Πόσο ισούται η δύναμη ${q4Data.base}${EXPONENTS_UNICODE[q4Data.exp]};`,
      options: q4Options,
      correct: q4Correct,
      explain: q4Data.explain
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Δύναμη vs Πολλαπλασιασμός',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? `Σωστά! ${q5Base}${EXPONENTS_UNICODE[q5Exp]} σημαίνει ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}.`
        : `Λάθος! Η δύναμη ${q5Base}${EXPONENTS_UNICODE[q5Exp]} ΔΕΝ είναι ${q5Base} · ${q5Exp} ＝ ${q5Product}, αλλά ${Array(q5Exp).fill(q5Base).join(' · ')} ＝ ${q5Actual}!`
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Έννοια Εκθέτη',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο εκθέτης ορίζει πόσες φορές θα γραφτεί η βάση ως παράγοντας του γινομένου.'
        : 'Λάθος! Ο εκθέτης δεν πολλαπλασιάζεται με τη βάση, αλλά δείχνει το πλήθος των ίσων παραγόντων.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Υπολογισμός Δυνάμεων',
      prompt: `Υπολόγισε την τιμή της δύναμης ${q7Data.base}${EXPONENTS_UNICODE[q7Data.exp]}:`,
      correct: String(q7Data.val),
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Σχέσεις & Πράξεις Δυνάμεων',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
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
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
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
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός απαντήσεων: sanitize μόνο για inputs, αυτούσιο για mcq/tf
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις δυνάμεις φυσικών αριθμών, τα τετράγωνα και τους κύβους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/21-dinameis"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 21 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Δυνάμεις Φυσικών Αριθμών
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εμπεδώσεις τη βάση, τον εκθέτη, τα τετράγωνα, τους κύβους και τις εφαρμογές των δυνάμεων!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Άσκηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
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
                          placeholder="Γράψε την απάντησή σου..."
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
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τύπος / Ανάλυση')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.val}</td>
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
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
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
                <span>{toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
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
              <span>{submitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 10</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
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
                <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 10 ερωτήσεις και πάτησε «{toCleanUppercase('Έλεγχος Απαντήσεων')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
