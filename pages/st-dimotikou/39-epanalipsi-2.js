// pages/st-dimotikou/epanalipsi-2.js
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

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// =========================================================
// ΔΕΞΑΜΕΝΕΣ ΓΕΝΝΗΤΡΙΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (32 ΕΩΣ 38)
// =========================================================

// ΚΕΦΑΛΑΙΟ 32: ΜΕΤΑΒΛΗΤΗ
const POOL_CH32 = [
  // Υπολογισμός παράστασης a · x + b
  () => {
    const a = randInt(3, 7);
    const b = randInt(4, 18);
    const x = randInt(3, 9);
    const res = a * x + b;
    return {
      title: 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x ＋ ${b};`,
      type: 'input',
      correct: String(res),
      explain: `Αντικαθιστούμε το x με ${x}: ${a} · ${x} ＋ ${b} ＝ ${a * x} ＋ ${b} ＝ ${res}.`
    };
  },
  // Υπολογισμός παράστασης a · x - b
  () => {
    const a = randInt(4, 8);
    const x = randInt(5, 10);
    const b = randInt(3, a * x - 5);
    const res = a * x - b;
    return {
      title: 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x － ${b};`,
      type: 'input',
      correct: String(res),
      explain: `Αντικαθιστούμε το x με ${x}: ${a} · ${x} － ${b} ＝ ${a * x} － ${b} ＝ ${res}.`
    };
  },
  // Γεωμετρική έκφραση περιμέτρου
  () => {
    const side = randInt(4, 12);
    const res = 4 * side;
    return {
      title: 'Κεφάλαιο 32 • Μεταβλητή στη Γεωμετρία',
      prompt: `Η περίμετρος ενός τετραγώνου πλευράς x δίνεται από τον τύπο Π ＝ 4 · x. Αν x ＝ ${side} εκ., πόση είναι η περίμετρος;`,
      type: 'input',
      correct: String(res),
      explain: `Π ＝ 4 · ${side} ＝ ${res} εκ.`
    };
  },
  // Επιλογή σωστής αλγεβρικής έκφρασης
  () => {
    const correct = '5 · x ＋ 5';
    return {
      title: 'Κεφάλαιο 32 • Φραστική Έκφραση σε Μεταβλητή',
      prompt: 'Ποια μαθηματική έκφραση δηλώνει: «Το πενταπλάσιο ενός αριθμού x αυξημένο κατά 5»;',
      type: 'mcq',
      options: shuffle([...new Set(['5 · x ＋ 5', '5 · x － 5', 'x : 5 ＋ 5', '5 ＋ x'])]),
      correct,
      explain: 'Πενταπλάσιο του x είναι το 5 · x, και αυξημένο κατά 5 σημαίνει 5 · x ＋ 5.'
    };
  },
  // Παράσταση με διαίρεση (x : a) + b
  () => {
    const a = randInt(2, 5);
    const x = a * randInt(3, 8);
    const b = randInt(2, 10);
    const res = (x / a) + b;
    return {
      title: 'Κεφάλαιο 32 • Μεταβλητή με Διαίρεση',
      prompt: `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης (x : ${a}) ＋ ${b};`,
      type: 'input',
      correct: String(res),
      explain: `(${x} : ${a}) ＋ ${b} ＝ ${x / a} ＋ ${b} ＝ ${res}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 33: ΕΞΙΣΩΣΗ x + a = b (Άγνωστος Προσθετέος)
const POOL_CH33 = [
  // Δεκαδικοί
  () => {
    const a_raw = randInt(25, 75) / 10;
    const b_raw = Number((a_raw + randInt(15, 65) / 10).toFixed(1));
    const x_raw = Number((b_raw - a_raw).toFixed(1));
    const a = a_raw.toFixed(1).replace('.', ',');
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = x_raw.toFixed(1).replace('.', ',');
    return {
      title: 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Δεκαδικοί)',
      prompt: `Λύσε την εξίσωση: x ＋ ${a} ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${b} － ${a} ＝ ${correct}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(5, 12);
    const n1 = randInt(1, 4);
    const n2 = randInt(n1 + 1, n1 + 6);
    const diffN = n2 - n1;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: x ＋ ${n1}/${d} ＝ ${n2}/${d} (π.χ. 3/7):`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n2}/${d} － ${n1}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = randInt(45, 150);
    const x = randInt(35, 120);
    const b = x + a;
    return {
      title: 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: x ＋ ${a} ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${b} － ${a} ＝ ${x}.`
    };
  },
  // Θεωρία Σωστό-Λάθος
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφάλαιο 33 • Ιδιότητες Πρόσθεσης',
      prompt: '«Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται πάντοτε με αφαίρεση: x ＝ β － α.»',
      type: 'tf',
      correct: isTrue,
      text: isTrue 
        ? 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται με αφαίρεση: x ＝ β － α.'
        : 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ β ＋ α.',
      explain: isTrue ? 'Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης.' : 'Για να βρούμε τον άγνωστο προσθετέο κάνουμε αφαίρεση: x ＝ β － α.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 34: ΕΞΙΣΩΣΗ x - a = b (Άγνωστος Μειωτέος)
const POOL_CH34 = [
  // Δεκαδικοί
  () => {
    const a_raw = randInt(25, 75) / 10;
    const b_raw = randInt(15, 65) / 10;
    const x_raw = Number((b_raw + a_raw).toFixed(1));
    const a = a_raw.toFixed(1).replace('.', ',');
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = x_raw.toFixed(1).replace('.', ',');
    return {
      title: 'Κεφάλαιο 34 • Άγνωστος Μειωτέος x － α ＝ β',
      prompt: `Λύσε την εξίσωση: x － ${a} ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${b} ＋ ${a} ＝ ${correct}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(5, 12);
    const n1 = randInt(1, 4);
    const n2 = randInt(2, 5);
    const sumN = n1 + n2;
    const g = gcd(sumN, d);
    const correctRaw = `${sumN}/${d}`;
    const correctSimp = g > 1 ? `${sumN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 34 • Άγνωστος Μειωτέος (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: x － ${n1}/${d} ＝ ${n2}/${d} (π.χ. 5/7):`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n2}/${d} ＋ ${n1}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = randInt(55, 180);
    const b = randInt(45, 160);
    const x = b + a;
    return {
      title: 'Κεφάλαιο 34 • Άγνωστος Μειωτέος (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: x － ${a} ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${b} ＋ ${a} ＝ ${x}.`
    };
  },
  // Επιλογή Βήματος
  () => {
    const a = randInt(20, 60);
    const b = randInt(30, 80);
    const correct = `x ＝ ${b} ＋ ${a}`;
    return {
      title: 'Κεφάλαιο 34 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x － ${a} ＝ ${b};`,
      type: 'mcq',
      options: shuffle([...new Set([`x ＝ ${b} ＋ ${a}`, `x ＝ ${b} － ${a}`, `x ＝ ${a} － ${b}`, `x ＝ ${b} : ${a}`])]),
      correct,
      explain: `Για να βρούμε τον άγνωστο μειωτέο x, προσθέτουμε τη διαφορά και τον αφαιρετέο: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 35: ΕΞΙΣΩΣΗ a - x = b (Άγνωστος Αφαιρετέος)
const POOL_CH35 = [
  // Δεκαδικοί
  () => {
    const a_raw = randInt(55, 95) / 10;
    const b_raw = randInt(12, Math.floor(a_raw * 10) - 10) / 10;
    const x_raw = Number((a_raw - b_raw).toFixed(1));
    const a = a_raw.toFixed(1).replace('.', ',');
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = x_raw.toFixed(1).replace('.', ',');
    return {
      title: 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος α － x ＝ β',
      prompt: `Λύσε την εξίσωση: ${a} － x ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${a} － ${b} ＝ ${correct}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(6, 14);
    const n1 = randInt(5, d - 1);
    const n2 = randInt(1, n1 - 2);
    const diffN = n1 - n2;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: ${n1}/${d} － x ＝ ${n2}/${d} (π.χ. 3/8):`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n1}/${d} － ${n2}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = randInt(75, 250);
    const b = randInt(15, a - 25);
    const x = a - b;
    return {
      title: 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: ${a} － x ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${a} － ${b} ＝ ${x}.`
    };
  },
  // Σωστό-Λάθος
  () => {
    return {
      title: 'Κεφάλαιο 35 • Κανόνας Αφαιρετέου',
      prompt: '«Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και βρίσκεται με αφαίρεση: x ＝ α － β.»',
      type: 'tf',
      correct: true,
      text: 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος x υπολογίζεται πάντα με αφαίρεση: x ＝ α － β.',
      explain: 'Για να βρούμε τι αφαιρέθηκε από το αρχικό μέγεθος, αφαιρούμε τη διαφορά από τον μειωτέο.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 36: ΕΞΙΣΩΣΗ a · x = b ή x · a = b (Άγνωστος Παράγοντας)
const POOL_CH36 = [
  // Δεκαδικοί
  () => {
    const a = randInt(2, 5);
    const x_raw = randInt(12, 65) / 10;
    const b_raw = Number((a * x_raw).toFixed(1));
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = x_raw.toFixed(1).replace('.', ',');
    return {
      title: 'Κεφάλαιο 36 • Άγνωστος Παράγοντας Γινομένου (Δεκαδικοί)',
      prompt: `Λύσε την εξίσωση: ${a} · x ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${b} : ${a} ＝ ${correct}.`
    };
  },
  // Φυσικοί αριθμοί (x · a = b)
  () => {
    const a = randInt(12, 25);
    const x = randInt(6, 18);
    const b = a * x;
    return {
      title: 'Κεφάλαιο 36 • Άγνωστος Παράγοντας x · α ＝ β',
      prompt: `Λύσε την εξίσωση: x · ${a} ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${b} : ${a} ＝ ${x}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(3, 8);
    const numA = randInt(2, 5);
    const x = randInt(2, 6);
    const numB = numA * x;
    return {
      title: 'Κεφάλαιο 36 • Άγνωστος Παράγοντας (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: ${numA}/${d} · x ＝ ${numB}/${d}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ (${numB}/${d}) : (${numA}/${d}) ＝ ${numB} : ${numA} ＝ ${x}.`
    };
  },
  // Σωστό Βήμα
  () => {
    const a = randInt(4, 12);
    const x = randInt(4, 12);
    const b = a * x;
    const correct = `x ＝ ${b} : ${a}`;
    return {
      title: 'Κεφάλαιο 36 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} · x ＝ ${b};`,
      type: 'mcq',
      options: shuffle([...new Set([`x ＝ ${b} : ${a}`, `x ＝ ${b} · ${a}`, `x ＝ ${b} － ${a}`, `x ＝ ${a} : ${b}`])]),
      correct,
      explain: `Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 37: ΕΞΙΣΩΣΗ x : a = b (Άγνωστος Διαιρετέος)
const POOL_CH37 = [
  // Δεκαδικοί
  () => {
    const a = randInt(3, 6);
    const b_raw = randInt(12, 45) / 10;
    const x_raw = Number((a * b_raw).toFixed(1));
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = x_raw.toFixed(1).replace('.', ',');
    return {
      title: 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος x : α ＝ β',
      prompt: `Λύσε την εξίσωση: x : ${a} ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${a} · ${b} ＝ ${correct}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = randInt(12, 24);
    const b = randInt(6, 18);
    const x = a * b;
    return {
      title: 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: x : ${a} ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${a} · ${b} ＝ ${x}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(3, 7);
    const numA = randInt(2, 5);
    const k = randInt(2, 6);
    const b = k * d;
    const x = k * numA;
    return {
      title: 'Κεφάλαιο 37 • Άγνωστος Διαιρετέος (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: x : (${numA}/${d}) ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${b} · (${numA}/${d}) ＝ ${x}.`
    };
  },
  // Σωστό-Λάθος
  () => {
    return {
      title: 'Κεφάλαιο 37 • Κανόνας Διαιρετέου',
      prompt: '«Στη διαίρεση x : α ＝ β, ο άγνωστος διαιρετέος x υπολογίζεται πάντα με πολλαπλασιασμό: x ＝ α · β.»',
      type: 'tf',
      correct: true,
      text: 'Στην εξίσωση x : α ＝ β, ο άγνωστος διαιρετέος x βρίσκεται με πολλαπλασιασμό: x ＝ α · β.',
      explain: 'Η αντίστροφη πράξη της διαίρεσης είναι ο πολλαπλασιασμός.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 38: ΕΞΙΣΩΣΗ a : x = b (Άγνωστος Διαιρέτης)
const POOL_CH38 = [
  // Δεκαδικοί
  () => {
    const x = randInt(2, 6);
    const b_raw = randInt(12, 45) / 10;
    const a_raw = Number((x * b_raw).toFixed(1));
    const a = a_raw.toFixed(1).replace('.', ',');
    const b = b_raw.toFixed(1).replace('.', ',');
    const correct = String(x);
    return {
      title: 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης α : x ＝ β',
      prompt: `Λύσε την εξίσωση: ${a} : x ＝ ${b}`,
      type: 'input',
      correct,
      explain: `x ＝ ${a} : ${b} ＝ ${correct}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const x = randInt(6, 16);
    const b = randInt(8, 25);
    const a = x * b;
    return {
      title: 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: ${a} : x ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${a} : ${b} ＝ ${x}.`
    };
  },
  // Κλάσματα
  () => {
    const d = randInt(4, 9);
    const x = randInt(2, 6);
    const numB = randInt(2, 5);
    const numA = numB * x;
    return {
      title: 'Κεφάλαιο 38 • Άγνωστος Διαιρέτης (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: ${numA}/${d} : x ＝ ${numB}/${d}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ (${numA}/${d}) : (${numB}/${d}) ＝ ${numA} : ${numB} ＝ ${x}.`
    };
  },
  // Σωστό Βήμα
  () => {
    const x = randInt(4, 10);
    const b = randInt(5, 12);
    const a = x * b;
    const correct = `x ＝ ${a} : ${b}`;
    return {
      title: 'Κεφάλαιο 38 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} : x ＝ ${b};`,
      type: 'mcq',
      options: shuffle([...new Set([`x ＝ ${a} : ${b}`, `x ＝ ${a} · ${b}`, `x ＝ ${b} : ${a}`, `x ＝ ${a} － ${b}`])]),
      correct,
      explain: `Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: ${correct}.`
    };
  }
];

// ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (Πολυεπίπεδες Εξισώσεις / Real-life)
const POOL_COMBINED = [
  // 2-step εξίσωση a · x + b = c
  () => {
    const a = randInt(3, 6);
    const x = randInt(4, 12);
    const b = randInt(5, 25);
    const c = a * x + b;
    return {
      title: 'Συνδυαστικό Πρόβλημα • Εξίσωση 2 Βημάτων',
      prompt: `Η Μαρία αγόρασε ${a} ίδια βιβλία (x ευρώ το καθένα) και ένα στυλό που κόστιζε ${b}€. Πλήρωσε συνολικά ${c}€. Πόσο κόστιζε το κάθε βιβλίο (x);`,
      type: 'input',
      correct: String(x),
      explain: `Σχηματίζουμε την εξίσωση: ${a} · x ＋ ${b} ＝ ${c} ➔ ${a} · x ＝ ${c} － ${b} ＝ ${a * x} ➔ x ＝ ${a * x} : ${a} ＝ ${x}€.`
    };
  },
  // 2-step εξίσωση a · x - b = c
  () => {
    const a = randInt(3, 5);
    const x = randInt(10, 25);
    const discount = randInt(4, 15);
    const total = a * x - discount;
    return {
      title: 'Συνδυαστικό Πρόβλημα • Εξίσωση με Έκπτωση',
      prompt: `Ο Γιώργος αγόρασε ${a} ίδια πουκάμισα αξίας x ευρώ το καθένα. Είχε κουπόνι έκπτωσης ${discount}€ και τελικά πλήρωσε ${total}€. Πόσο κόστιζε αρχικά το κάθε πουκάμισο;`,
      type: 'input',
      correct: String(x),
      explain: `Σχηματίζουμε την εξίσωση: ${a} · x － ${discount} ＝ ${total} ➔ ${a} · x ＝ ${total} ＋ ${discount} ＝ ${a * x} ➔ x ＝ ${a * x} : ${a} ＝ ${x}€.`
    };
  },
  // Γεωμετρικό πρόβλημα περιμέτρου ορθογωνίου 2 · (x + a) = P
  () => {
    const width = randInt(6, 14);
    const length = width + randInt(4, 10);
    const perimeter = 2 * (length + width);
    return {
      title: 'Συνδυαστικό Πρόβλημα • Περίμετρος Ορθογωνίου',
      prompt: `Ένα ορθογώνιο οικόπεδο έχει πλάτος ${width} μ. και περίμετρο ${perimeter} μ. Αν x είναι το μήκος του, να βρεις το x (σε μέτρα):`,
      type: 'input',
      correct: String(length),
      explain: `Η περίμετρος είναι 2 · (x ＋ ${width}) ＝ ${perimeter} ➔ x ＋ ${width} ＝ ${perimeter / 2} ➔ x ＝ ${perimeter / 2} － ${width} ＝ ${length} μέτρα.`
    };
  },
  // Πρόβλημα κατανομής και υπολοίπου
  () => {
    const portions = randInt(3, 6);
    const perPortion = randInt(5, 12);
    const leftover = randInt(2, 6);
    const total = portions * perPortion + leftover;
    return {
      title: 'Συνδυαστικό Πρόβλημα • Διαίρεση με Υπόλοιπο',
      prompt: `Μοιράσαμε ${total} καραμέλες σε ${portions} παιδιά και πήραν από x καραμέλες το καθένα, ενώ περίσσεψαν ${leftover} καραμέλες. Πόσες καραμέλες πήρε κάθε παιδί;`,
      type: 'input',
      correct: String(perPortion),
      explain: `${portions} · x ＋ ${leftover} ＝ ${total} ➔ ${portions} · x ＝ ${total - leftover} ➔ x ＝ ${total - leftover} : ${portions} ＝ ${perPortion} καραμέλες.`
    };
  }
];

// Δημιουργία των 16 ερωτήσεων του διαγωνίσματος
function generate16Questions() {
  const qList = [];

  // Επιλογή 2 ερωτήσεων από κάθε κεφάλαιο (32 έως 38)
  const chapters = [
    { pool: POOL_CH32 },
    { pool: POOL_CH33 },
    { pool: POOL_CH34 },
    { pool: POOL_CH35 },
    { pool: POOL_CH36 },
    { pool: POOL_CH37 },
    { pool: POOL_CH38 }
  ];

  chapters.forEach(ch => {
    const shuffledPool = shuffle(ch.pool);
    qList.push(shuffledPool[0]());
    qList.push(shuffledPool[1] ? shuffledPool[1]() : shuffledPool[0]());
  });

  // Προσθήκη 2 συνδυαστικών προβλημάτων
  const shuffledComb = shuffle(POOL_COMBINED);
  qList.push(shuffledComb[0]());
  qList.push(shuffledComb[1] ? shuffledComb[1]() : shuffledComb[0]());

  return qList;
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi2Page() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
    const qs = generate16Questions();
    setQuestions(qs);
    const initialAns = {};
    qs.forEach((_, idx) => {
      initialAns[`q${idx}`] = '';
    });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const isQuestionCorrect = (q, userAns) => {
    if (q.type === 'input') {
      if (typeof userAns !== 'string' || !userAns.trim()) return false;
      const cleanAns = userAns.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt);
    }
    if (q.type === 'mcq') {
      return userAns === q.correct;
    }
    if (q.type === 'tf') {
      return userAns === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q, idx) => {
      if (isQuestionCorrect(q, answers[`q${idx}`])) {
        total += 1;
      }
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (idx) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm hover:shadow-md';
    const q = questions[idx];
    const userAns = answers[`q${idx}`];
    return isQuestionCorrect(q, userAns)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(val => typeof val === 'string' && val.trim() !== '').length;

  return (
    <Layout
      title="2η Επανάληψη: Εξισώσεις (Κεφ. 32-38) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μεγάλο επαναληπτικό διαγώνισμα 16 ερωτήσεων στις εξισώσεις (Κεφάλαια 32 έως 38) για τη ΣΤ' Δημοτικού με αυτόματη βαθμολόγηση."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 16 {toCleanUppercase('Ερωτήσεις')}
        </span>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>🏆 2Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 32 - 38 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Επαναληπτικό Τεστ: Εξισώσεις και Μεταβλητές
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                16 δυναμικές ερωτήσεις (2 από κάθε κεφάλαιο συν 2 συνδυαστικά προβλήματα) που καλύπτουν όλες τις μορφές επίλυσης εξισώσεων!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέο Τεστ')}</span>
            </button>
          </div>
        </section>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 16 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const key = `q${idx}`;
              const userAns = answers[key];
              const isCorrect = isQuestionCorrect(q, userAns);

              return (
                <div key={idx} className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${getCardStyle(idx)}`}>
                  <div>
                    {/* Κεφαλίδα Κάρτας */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                        idx >= 14 
                          ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                          : 'bg-sky-100 text-sky-950 border border-sky-200'
                      }`}>
                        {toCleanUppercase(`Ερώτηση ${idx + 1}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                      )}
                    </div>

                    {/* Ερώτηση */}
                    <p className="text-sm md:text-base text-slate-800 mb-4 font-semibold leading-relaxed">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* INPUT TYPE */}
                    {q.type === 'input' && (
                      <input
                        key={`review2-input-${idx}`}
                        autoComplete="off"
                        spellCheck="false"
                        type="text"
                        disabled={submitted}
                        value={userAns || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder="Γράψε την απάντηση..."
                        className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono shadow-inner"
                      />
                    )}

                    {/* MCQ TYPE */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleInputChange(key, opt)}
                            className={`p-3 rounded-xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[44px] ${
                              userAns === opt
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* TRUE / FALSE TYPE */}
                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(key, true)}
                          className={`py-3 rounded-xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            userAns === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(key, false)}
                          className={`py-3 rounded-xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            userAns === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}

                    {/* Επεξήγηση μετά την υποβολή */}
                    {submitted && (
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                        isCorrect ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-200' : 'bg-rose-100/70 text-rose-950 border border-rose-200'
                      }`}>
                        💡 <strong>Επεξήγηση:</strong> {q.explain}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση Τεστ')}</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase('Τελικό Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 16` : `${answeredCount} / 16`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό Επιτυχίας')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 16) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: STATUS OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέο Τεστ με διαφορετικές ασκήσεις!')}</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Απάντησε και στις 16 ερωτήσεις και πάτησε «{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση Τεστ')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
