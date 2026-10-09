// pages/st-dimotikou/26-sigkrisi-klasmaton-ask.js
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

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
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

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Σύγκριση Αποστάσεων Δρομέων',
    unit: 'της διαδρομής',
    generate: () => {
      // 3/5 vs 4/7 -> 21/35 vs 20/35 (3/5 > 4/7)
      const n1 = 3;
      const d1 = 5;
      const n2 = 4;
      const d2 = 7;
      const p1 = 'Ο Νίκος';
      const p2 = 'Η Ελένη';
      return {
        prompt: `${p1} διάνυσε τα ${n1}/${d1} μιας διαδρομής, ενώ ${p2} διάνυσε τα ${n2}/${d2} της ίδιας διαδρομής. Ποιος διάνυσε τη μεγαλύτερη απόσταση;`,
        unit: '',
        correctVal: p1,
        correctText: p1,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 7) / 35`, val: '21/35' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 5) / 35`, val: '20/35' },
          { item: 'Σύγκριση', formula: '21/35 ＞ 20/35', val: `${p1} ＞ ${p2}` }
        ],
        explain: `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 7) ＝ 35. ${p1} διάνυσε τα 21/35, ενώ ${p2} τα 20/35. Επειδή 21/35 ＞ 20/35, ${p1} διάνυσε τη μεγαλύτερη απόσταση.`,
        distractors: [p2, 'Και οι δύο την ίδια απόσταση']
      };
    }
  },
  {
    id: 'sp2',
    title: 'Μελέτη Βιβλίου',
    unit: 'του βιβλίου',
    generate: () => {
      // 2/3 vs 5/8 -> 16/24 vs 15/24 (2/3 > 5/8)
      const n1 = 2;
      const d1 = 3;
      const n2 = 5;
      const d2 = 8;
      const p1 = 'Ο Γιώργος';
      const p2 = 'Η Μαρία';
      return {
        prompt: `${p1} διάβασε τα ${n1}/${d1} ενός βιβλίου, ενώ ${p2} διάβασε τα ${n2}/${d2} του ίδιου βιβλίου. Ποιος διάβασε το μεγαλύτερο μέρος;`,
        unit: '',
        correctVal: p1,
        correctText: p1,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 8) / 24`, val: '16/24' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 3) / 24`, val: '15/24' },
          { item: 'Σύγκριση', formula: '16/24 ＞ 15/24', val: `${p1} ＞ ${p2}` }
        ],
        explain: `Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(3, 8) ＝ 24. ${p1} διάβασε τα 16/24 και ${p2} τα 15/24. Άρα ${p1} διάβασε περισσότερο.`,
        distractors: [p2, 'Και οι δύο το ίδιο μέρος']
      };
    }
  },
  {
    id: 'sp3',
    title: 'Κατανάλωση Πίτσας',
    unit: 'της πίτσας',
    generate: () => {
      // 3/8 vs 2/5 -> 15/40 vs 16/40 (3/8 < 2/5)
      const n1 = 3;
      const d1 = 8;
      const n2 = 2;
      const d2 = 5;
      const p1 = 'Ο Πέτρος';
      const p2 = 'Η Άννα';
      return {
        prompt: `${p1} έφαγε τα ${n1}/${d1} μιας πίτσας, ενώ ${p2} έφαγε τα ${n2}/${d2} μιας ίδιας πίτσας. Ποιος έφαγε το μεγαλύτερο μέρος;`,
        unit: '',
        correctVal: p2,
        correctText: p2,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 5) / 40`, val: '15/40' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 8) / 40`, val: '16/40' },
          { item: 'Σύγκριση', formula: '16/40 ＞ 15/40', val: `${p2} ＞ ${p1}` }
        ],
        explain: `Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(8, 5) ＝ 40: 3/8 ＝ 15/40 και 2/5 ＝ 16/40. Επειδή 16/40 ＞ 15/40, ${p2} έφαγε περισσότερο.`,
        distractors: [p1, 'Και οι δύο το ίδιο μέρος']
      };
    }
  },
  {
    id: 'sp4',
    title: 'Φύτευση Κήπου',
    unit: 'του κήπου',
    generate: () => {
      // 4/7 vs 3/5 -> 20/35 vs 21/35 (4/7 < 3/5)
      const n1 = 4;
      const d1 = 7;
      const n2 = 3;
      const d2 = 5;
      const p1 = 'Ο Κώστας';
      const p2 = 'Η Σοφία';
      return {
        prompt: `${p1} φύτεψε τα ${n1}/${d1} ενός κήπου, ενώ ${p2} φύτεψε τα ${n2}/${d2} του ίδιου κήπου. Ποιος φύτεψε το μεγαλύτερο μέρος;`,
        unit: '',
        correctVal: p2,
        correctText: p2,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 5) / 35`, val: '20/35' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 7) / 35`, val: '21/35' },
          { item: 'Σύγκριση', formula: '21/35 ＞ 20/35', val: `${p2} ＞ ${p1}` }
        ],
        explain: `Με ομώνυμα κλάσματα: 4/7 ＝ 20/35 και 3/5 ＝ 21/35. Άρα ${p2} φύτεψε το μεγαλύτερο μέρος.`,
        distractors: [p1, 'Και οι δύο το ίδιο μέρος']
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κατανάλωση Χυμού',
    unit: 'του μπουκαλιού',
    generate: () => {
      // 5/6 vs 4/5 -> 25/30 vs 24/30 (5/6 > 4/5)
      const n1 = 5;
      const d1 = 6;
      const n2 = 4;
      const d2 = 5;
      const p1 = 'Ο Δημήτρης';
      const p2 = 'Η Κατερίνα';
      return {
        prompt: `${p1} ήπιε τα ${n1}/${d1} ενός μπουκαλιού χυμού, ενώ ${p2} ήπιε τα ${n2}/${d2} ενός ίδιου μπουκαλιού. Ποιος ήπιε τη μεγαλύτερη ποσότητα;`,
        unit: '',
        correctVal: p1,
        correctText: p1,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 5) / 30`, val: '25/30' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 6) / 30`, val: '24/30' },
          { item: 'Σύγκριση', formula: '25/30 ＞ 24/30', val: `${p1} ＞ ${p2}` }
        ],
        explain: `Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(6, 5) ＝ 30: 5/6 ＝ 25/30 και 4/5 ＝ 24/30. Επομένως, ${p1} ήπιε περισσότερο.`,
        distractors: [p2, 'Και οι δύο την ίδια ποσότητα']
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αποταμίευση Χαρτζιλικιού',
    unit: 'του χαρτζιλικιού',
    generate: () => {
      // 3/4 vs 7/10 -> 15/20 vs 14/20 (3/4 > 7/10)
      const n1 = 3;
      const d1 = 4;
      const n2 = 7;
      const d2 = 10;
      const p1 = 'Ο Μάνος';
      const p2 = 'Η Δέσποινα';
      return {
        prompt: `${p1} αποταμίευσε τα ${n1}/${d1} του χαρτζιλικιού του, ενώ ${p2} αποταμίευσε τα ${n2}/${d2} του ίδιου ποσού χαρτζιλικιού. Ποιος αποταμίευσε το μεγαλύτερο μέρος;`,
        unit: '',
        correctVal: p1,
        correctText: p1,
        tableData: [
          { item: `${p1}`, formula: `${n1}/${d1} ＝ (${n1} · 5) / 20`, val: '15/20' },
          { item: `${p2}`, formula: `${n2}/${d2} ＝ (${n2} · 2) / 20`, val: '14/20' },
          { item: 'Σύγκριση', formula: '15/20 ＞ 14/20', val: `${p1} ＞ ${p2}` }
        ],
        explain: `Ε.Κ.Π.(4, 10) ＝ 20. Έχουμε 3/4 ＝ 15/20 και 7/10 ＝ 14/20. Επειδή 15/20 ＞ 14/20, ${p1} αποταμίευσε το μεγαλύτερο μέρος.`,
        distractors: [p2, 'Και οι δύο το ίδιο μέρος']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Σύγκριση Τριών Κλασμάτων',
    unit: '',
    generate: () => {
      // 1/2 (6/12), 2/3 (8/12), 3/4 (9/12)
      return {
        prompt: 'Δίνονται τα κλάσματα Α ＝ 1/2, Β ＝ 2/3 και Γ ＝ 3/4. Ποια είναι η σωστή σειρά διάταξης από το μικρότερο προς το μεγαλύτερο;',
        unit: '',
        correctVal: 'Α ＜ Β ＜ Γ (1/2 ＜ 2/3 ＜ 3/4)',
        correctText: 'Α ＜ Β ＜ Γ (1/2 ＜ 2/3 ＜ 3/4)',
        tableData: [
          { item: 'Κλάσμα Α (1/2)', formula: 'Μετατροπή με Ε.Κ.Π. ＝ 12', val: '6/12' },
          { item: 'Κλάσμα Β (2/3)', formula: 'Μετατροπή με Ε.Κ.Π. ＝ 12', val: '8/12' },
          { item: 'Κλάσμα Γ (3/4)', formula: 'Μετατροπή με Ε.Κ.Π. ＝ 12', val: '9/12' },
          { item: 'Σειρά Διάταξης', formula: '6/12 ＜ 8/12 ＜ 9/12', val: 'Α ＜ Β ＜ Γ' }
        ],
        explain: 'Με κοινό παρονομαστή το 12: 1/2 ＝ 6/12, 2/3 ＝ 8/12, 3/4 ＝ 9/12. Άρα η σωστή σειρά είναι Α ＜ Β ＜ Γ.',
        distractors: [
          'Γ ＜ Β ＜ Α (3/4 ＜ 2/3 ＜ 1/2)',
          'Β ＜ Α ＜ Γ (2/3 ＜ 1/2 ＜ 3/4)',
          'Α ＜ Γ ＜ Β (1/2 ＜ 3/4 ＜ 2/3)'
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Σύγκριση με Αναφορά τη Μονάδα (1)',
    unit: '',
    generate: () => {
      const proper = '7/9';
      const improper = '9/7';
      return {
        prompt: `Χωρίς να κάνεις διαίρεση ή πράξεις με Ε.Κ.Π., ποια σχέση συνδέει τα κλάσματα Α ＝ ${proper} και Β ＝ ${improper};`,
        unit: '',
        correctVal: `${proper} ＜ ${improper} (το Α ＜ 1 και το Β ＞ 1)`,
        correctText: `${proper} ＜ ${improper} (το Α ＜ 1 και το Β ＞ 1)`,
        tableData: [
          { item: `Κλάσμα Α (${proper})`, formula: 'Αριθμητής ＜ Παρονομαστή', val: 'Γνήσιο (＜ 1)' },
          { item: `Κλάσμα Β (${improper})`, formula: 'Αριθμητής ＞ Παρονομαστή', val: 'Καταχρηστικό (＞ 1)' },
          { item: 'Σύγκριση με τη μονάδα', formula: 'Α ＜ 1 ＜ Β', val: `${proper} ＜ ${improper}` }
        ],
        explain: `Το ${proper} είναι γνήσιο κλάσμα άρα είναι μικρότερο από το 1. Το ${improper} είναι καταχρηστικό κλάσμα άρα είναι μεγαλύτερο από το 1. Επομένως, ${proper} ＜ ${improper}.`,
        distractors: [
          `${proper} ＞ ${improper} (το Α ＞ 1 και το Β ＜ 1)`,
          `${proper} ＝ ${improper} (είναι ίσα)`,
          'Δεν μπορούμε να συγκρίνουμε χωρίς Ε.Κ.Π.'
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Έλεγχος Ισοδυναμίας με Χιαστί Γινόμενα',
    unit: '',
    generate: () => {
      const n1 = 6;
      const d1 = 8;
      const n2 = 9;
      const d2 = 12;
      const cross = n1 * d2;
      return {
        prompt: `Συγκρίνουμε τα κλάσματα Α ＝ ${n1}/${d1} και Β ＝ ${n2}/${d2}. Τι παρατηρούμε υπολογίζοντας τα χιαστί γινόμενα;`,
        unit: '',
        correctVal: `Τα χιαστί γινόμενα είναι ίσα (${cross} ＝ ${cross}), άρα τα κλάσματα είναι ισοδύναμα (＝)`,
        correctText: `Τα χιαστί γινόμενα είναι ίσα (${cross} ＝ ${cross}), άρα τα κλάσματα είναι ισοδύναμα (＝)`,
        tableData: [
          { item: 'Αριστερό γινόμενο', formula: `${n1} · ${d2}`, val: `${cross}` },
          { item: 'Δεξί γινόμενο', formula: `${n2} · ${d1}`, val: `${cross}` },
          { item: 'Σχέση κλασμάτων', formula: `${cross} ＝ ${cross}`, val: `${n1}/${d1} ＝ ${n2}/${d2}` }
        ],
        explain: `Τα χιαστί γινόμενα είναι ${n1} · ${d2} ＝ ${cross} και ${n2} · ${d1} ＝ ${cross}. Επειδή είναι ίσα, τα κλάσματα είναι ισοδύναμα (${n1}/${d1} ＝ ${n2}/${d2} ＝ 3/4).`,
        distractors: [
          `Το Α είναι μεγαλύτερο από το Β (${cross} ＞ ${cross - 6})`,
          `Το Β είναι μεγαλύτερο από το Α (${cross + 6} ＞ ${cross})`,
          'Τα χιαστί γινόμενα δεν εφαρμόζονται σε αυτά τα κλάσματα'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύγκριση με Ίδιο Συμπλήρωμα ως τη Μονάδα',
    unit: '',
    generate: () => {
      // 5/6 (λείπει 1/6) vs 7/8 (λείπει 1/8) -> 1/8 < 1/6 άρα 7/8 > 5/6
      return {
        prompt: 'Ποιο από τα δύο κλάσματα είναι μεγαλύτερο: το 5/6 ή το 7/8;',
        unit: '',
        correctVal: '7/8 ＞ 5/6 (λείπει μικρότερο μέρος για να φτάσει τη μονάδα)',
        correctText: '7/8 ＞ 5/6 (λείπει μικρότερο μέρος για να φτάσει τη μονάδα)',
        tableData: [
          { item: 'Συμπλήρωμα 5/6', formula: '1 － 5/6', val: '1/6' },
          { item: 'Συμπλήρωμα 7/8', formula: '1 － 7/8', val: '1/8' },
          { item: 'Σύγκριση συμπληρωμάτων', formula: '1/8 ＜ 1/6', val: '7/8 ＞ 5/6' }
        ],
        explain: 'Από το 5/6 λείπει το 1/6 για να φτάσει το 1, ενώ από το 7/8 λείπει μόνο το 1/8. Επειδή το 1/8 είναι μικρότερο κομμάτι, το 7/8 είναι πιο κοντά στη μονάδα, άρα 7/8 ＞ 5/6 (ή με Ε.Κ.Π. 24: 21/24 ＞ 20/24).',
        distractors: [
          '5/6 ＞ 7/8 (γιατί έχει μικρότερο παρονομαστή)',
          '5/6 ＝ 7/8 (είναι ίσα)',
          'Δεν μπορούμε να συγκρίνουμε χωρίς κοινό παρονομαστή'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύγκριση Κλασμάτων με το Μισό (1/2)',
    unit: '',
    generate: () => {
      // 4/10 < 1/2 < 5/8
      return {
        prompt: 'Συγκρίνοντας τα κλάσματα 4/10 και 5/8 με το μισό (1/2), ποιο είναι το μεγαλύτερο;',
        unit: '',
        correctVal: '5/8 ＞ 4/10 (το 5/8 ＞ 1/2 ενώ το 4/10 ＜ 1/2)',
        correctText: '5/8 ＞ 4/10 (το 5/8 ＞ 1/2 ενώ το 4/10 ＜ 1/2)',
        tableData: [
          { item: 'Κλάσμα 4/10', formula: 'Μισό του 10 είναι το 5 (4 ＜ 5)', val: '4/10 ＜ 1/2' },
          { item: 'Κλάσμα 5/8', formula: 'Μισό του 8 είναι το 4 (5 ＞ 4)', val: '5/8 ＞ 1/2' },
          { item: 'Σύγκριση', formula: '4/10 ＜ 1/2 ＜ 5/8', val: '5/8 ＞ 4/10' }
        ],
        explain: 'Το μισό των δεκάτων είναι 5/10, άρα 4/10 ＜ 1/2. Το μισό των ογδόων είναι 4/8, άρα 5/8 ＞ 1/2. Επομένως, 5/8 ＞ 4/10.',
        distractors: [
          '4/10 ＞ 5/8 (το 4/10 είναι μεγαλύτερο)',
          '4/10 ＝ 5/8 (είναι ίσα με το 1/2)',
          'Και τα δύο κλάσματα είναι μεγαλύτερα από το 1/2'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Εύρεση Αριθμητή σε Ανισότητα',
    unit: '',
    generate: () => {
      // x/12 < 1/3 (δηλαδή x/12 < 4/12) -> μέγιστος φυσικός x = 3
      return {
        prompt: 'Ποιος είναι ο ΜΕΓΑΛΥΤΕΡΟΣ φυσικός αριθμός x για τον οποίο ισχύει η ανισότητα: x/12 ＜ 1/3;',
        unit: '',
        correctVal: '3',
        correctText: 'x ＝ 3 (καθώς 3/12 ＜ 4/12)',
        tableData: [
          { item: 'Μετατροπή του 1/3 σε ισοδύναμο με παρονομαστή 12', formula: '(1 · 4) / (3 · 4)', val: '4/12' },
          { item: 'Ανισότητα', formula: 'x/12 ＜ 4/12', val: 'x ＜ 4' },
          { item: 'Μέγιστος φυσικός αριθμός x', formula: 'x ＜ 4', val: 'x ＝ 3' }
        ],
        explain: 'Μετατρέπουμε το 1/3 σε δωδέκατα: 1/3 ＝ 4/12. Για να ισχύει x/12 ＜ 4/12, πρέπει x ＜ 4. Ο μεγαλύτερος φυσικός αριθμός μικρότερος του 4 είναι το 3.',
        distractors: [
          'x ＝ 4 (καθώς 4/12 ＝ 1/3)',
          'x ＝ 2',
          'x ＝ 5'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Compare Buttons (>, <, =) - Ομώνυμα κλάσματα
  const q1Den = randInt(4, 12);
  const q1Num1 = randInt(1, q1Den - 1);
  let q1Num2 = randInt(1, q1Den - 1);
  if (q1Num1 === q1Num2) q1Num2 = (q1Num1 % (q1Den - 1)) + 1;
  const q1Correct = q1Num1 > q1Num2 ? '＞' : '＜';

  // Q2: Compare Buttons (>, <, =) - Ίδιοι Αριθμητές
  const q2Num = randInt(2, 6);
  const q2Den1 = randInt(q2Num + 1, 10);
  let q2Den2 = randInt(q2Num + 1, 10);
  if (q2Den1 === q2Den2) q2Den2 = q2Den1 + 1;
  const q2Correct = q2Den1 < q2Den2 ? '＞' : '＜';

  // Q3: Compare Buttons (>, <, =) - Ετερώνυμα κλάσματα (Χιαστί)
  const q3Num1 = randInt(2, 5);
  const q3Den1 = randInt(q3Num1 + 1, 8);
  const q3Num2 = randInt(2, 5);
  const q3Den2 = randInt(q3Num2 + 1, 8);
  const cross1 = q3Num1 * q3Den2;
  const cross2 = q3Num2 * q3Den1;
  const q3Correct = cross1 > cross2 ? '＞' : cross1 < cross2 ? '＜' : '＝';

  // Q4: MCQ - Ποιο κλάσμα είναι το ΜΕΓΑΛΥΤΕΡΟ
  const q4List = [
    { n: 1, d: 2, val: 0.5, str: '1/2' },
    { n: 3, d: 4, val: 0.75, str: '3/4' },
    { n: 2, d: 5, val: 0.4, str: '2/5' },
    { n: 5, d: 8, val: 0.625, str: '5/8' }
  ];
  const q4Shuffled = shuffle(q4List);
  const q4MaxItem = q4Shuffled.reduce((max, item) => (item.val > max.val ? item : max), q4Shuffled[0]);
  const q4Options = shuffle([...new Set(q4Shuffled.map(item => item.str))]);
  const q4Correct = q4MaxItem.str;

  // Q5: True / False - Κανόνας Ίδιων Αριθμητών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή.'
    : 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο παρονομαστή.';

  // Q6: True / False - Γνήσια vs Καταχρηστικά
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Κάθε καταχρηστικό κλάσμα (αριθμητής ＞ παρονομαστή) είναι μεγαλύτερο από οποιοδήποτε γνήσιο κλάσμα (αριθμητής ＜ παρονομαστή).'
    : 'Ένα γνήσιο κλάσμα μπορεί να είναι μεγαλύτερο από ένα καταχρηστικό κλάσμα.';

  // Q7: Input - Υπολογισμός χιαστί γινομένου
  const q7Num1 = randInt(2, 4);
  const q7Den1 = randInt(5, 7);
  const q7Num2 = randInt(3, 5);
  const q7Den2 = randInt(6, 9);
  const q7CrossLeft = q7Num1 * q7Den2;
  const q7Correct = String(q7CrossLeft);

  // Q8: MCQ - Ποιο κλάσμα είναι ισοδύναμο
  const q8BaseN = randInt(2, 3);
  const q8BaseD = randInt(4, 5);
  const q8Mult = randInt(2, 4);
  const q8CorrectStr = `${q8BaseN * q8Mult}/${q8BaseD * q8Mult}`;
  const q8Wrongs = [
    `${q8BaseN * q8Mult + 1}/${q8BaseD * q8Mult}`,
    `${q8BaseN * q8Mult}/${q8BaseD * q8Mult + 1}`,
    `${q8BaseN + 2}/${q8BaseD + 2}`
  ];
  const q8Options = shuffle([...new Set([q8CorrectStr, ...q8Wrongs])]);

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
      type: 'compare',
      title: 'Ομώνυμα Κλάσματα',
      f1: `${q1Num1}/${q1Den}`,
      f2: `${q1Num2}/${q1Den}`,
      correct: q1Correct,
      explain: `Τα κλάσματα έχουν τον ίδιο παρονομαστή (${q1Den}). Επειδή ${q1Num1} ${q1Correct} ${q1Num2}, ισχύει ${q1Num1}/${q1Den} ${q1Correct} ${q1Num2}/${q1Den}.`
    },
    {
      id: 'q2',
      type: 'compare',
      title: 'Ίδιοι Αριθμητές',
      f1: `${q2Num}/${q2Den1}`,
      f2: `${q2Num}/${q2Den2}`,
      correct: q2Correct,
      explain: `Τα κλάσματα έχουν τον ίδιο αριθμητή (${q2Num}). Μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή, άρα ${q2Num}/${q2Den1} ${q2Correct} ${q2Num}/${q2Den2}.`
    },
    {
      id: 'q3',
      type: 'compare',
      title: 'Ετερώνυμα Κλάσματα (Χιαστί)',
      f1: `${q3Num1}/${q3Den1}`,
      f2: `${q3Num2}/${q3Den2}`,
      correct: q3Correct,
      explain: `Με πολλαπλασιασμό χιαστί: ${q3Num1} · ${q3Den2} ＝ ${cross1} και ${q3Num2} · ${q3Den1} ＝ ${cross2}. Επειδή ${cross1} ${q3Correct} ${cross2}, ισχύει ${q3Num1}/${q3Den1} ${q3Correct} ${q3Num2}/${q3Den2}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Εύρεση Μεγαλύτερου',
      prompt: 'Ποιο από τα παρακάτω κλάσματα είναι το μεγαλύτερο;',
      options: q4Options,
      correct: q4Correct,
      explain: `Μετατρέποντας σε ομώνυμα (ή σε δεκαδικούς), το ${q4Correct} (${q4MaxItem.val.toFixed(3).replace('.', ',')}) είναι το μεγαλύτερο.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Ίδιων Αριθμητών',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Όσο μικρότερος είναι ο παρονομαστής, σε τόσο λιγότερα και άρα μεγαλύτερα κομμάτια χωρίζεται η μονάδα.'
        : 'Λάθος! Μεγαλύτερο είναι εκείνο με τον ΜΙΚΡΟΤΕΡΟ παρονομαστή.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Σύγκριση με τη Μονάδα',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Τα γνήσια κλάσματα είναι ＜ 1, ενώ τα καταχρηστικά είναι ＞ 1. Επομένως κάθε καταχρηστικό είναι μεγαλύτερο από οποιοδήποτε γνήσιο.'
        : 'Λάθος! Κανένα γνήσιο κλάσμα (＜ 1) δεν μπορεί να ξεπεράσει ένα καταχρηστικό κλάσμα (＞ 1).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Υπολογισμός Χιαστί',
      prompt: `Στη σύγκριση των κλασμάτων ${q7Num1}/${q7Den1} και ${q7Num2}/${q7Den2}, ποιο είναι το αριστερό χιαστί γινόμενο (${q7Num1} · ${q7Den2});`,
      correct: q7Correct,
      explain: `Το αριστερό χιαστί γινόμενο ισούται με: ${q7Num1} · ${q7Den2} ＝ ${q7Correct}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ισοδύναμο Κλάσμα',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ίσο (ισοδύναμο) με το ${q8BaseN}/${q8BaseD};`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Πολλαπλασιάζοντας και τους δύο όρους του ${q8BaseN}/${q8BaseD} επί ${q8Mult} παίρνουμε το ισοδύναμο κλάσμα ${q8CorrectStr}.`
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

export default function SigkrisiKlasmatonExercisesPage() {
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για compare/mcq/tf
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
    if (q.type === 'compare') {
      return userVal === q.correct;
    }
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\s+/g, '').trim().toLowerCase();
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
      title="Ασκήσεις: Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη σύγκριση ομώνυμων, ετερώνυμων και ισοδύναμων κλασμάτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/26-sigkrisi-klasmaton"
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
                <span>ΚΕΦΑΛΑΙΟ 26 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Σύγκριση Κλασμάτων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σύγκριση ομώνυμων, ετερώνυμων κλασμάτων, στη μέθοδο χιαστί και στη σύγκριση με τη μονάδα!
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
                    {q.type === 'compare' ? (
                      <div className="space-y-4 mb-4">
                        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold text-center">
                          Σύγκρινε τα κλάσματα επιλέγοντας το σωστό σύμβολο:
                        </p>
                        <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono text-lg sm:text-xl font-black">
                          <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                            {q.f1}
                          </span>
                          <span className="text-amber-500 text-2xl font-bold min-w-[28px] text-center">
                            {answers[q.id] || '?'}
                          </span>
                          <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                            {q.f2}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {['＞', '＜', '＝'].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, sym, 'compare')}
                              className={`py-3 rounded-2xl font-mono font-black text-xl border transition touch-manipulation active:scale-95 ${
                                answers[q.id] === sym
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                              }`}
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                        {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                      </p>
                    )}

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
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Μέθοδος')}</th>
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
