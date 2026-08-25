import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητικές συναρτήσεις
function getRandomInt(min, max) {
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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// ==========================================
// ΔΕΞΑΜΕΝΕΣ ΓΕΝΝΗΤΡΙΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (20+ ανά κεφάλαιο)
// ==========================================

// ΚΕΦΑΛΑΙΟ 32: ΜΕΤΑΒΛΗΤΗ
const POOL_CH32 = [
  // 1-5: Υπολογισμός παράστασης a*x + b
  () => {
    const a = getRandomInt(3, 7);
    const b = getRandomInt(4, 18);
    const x = getRandomInt(3, 9);
    const res = a * x + b;
    return {
      title: 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x ＋ ${b};`,
      type: 'input',
      correct: String(res),
      explain: `Αντικαθιστούμε το x με ${x}: ${a} · ${x} ＋ ${b} ＝ ${a * x} ＋ ${b} ＝ ${res}.`
    };
  },
  // 6-10: Υπολογισμός παράστασης a*x - b
  () => {
    const a = getRandomInt(4, 8);
    const x = getRandomInt(5, 10);
    const b = getRandomInt(3, a * x - 5);
    const res = a * x - b;
    return {
      title: 'Κεφάλαιο 32 • Υπολογισμός Παράστασης',
      prompt: `Αν x ＝ ${x}, ποια είναι η τιμή της παράστασης ${a} · x － ${b};`,
      type: 'input',
      correct: String(res),
      explain: `Αντικαθιστούμε το x με ${x}: ${a} · ${x} － ${b} ＝ ${a * x} － ${b} ＝ ${res}.`
    };
  },
  // 11-15: Γεωμετρική έκφραση περιμέτρου / εμβαδού
  () => {
    const side = getRandomInt(4, 12);
    const res = 4 * side;
    return {
      title: 'Κεφάλαιο 32 • Μεταβλητή στη Γεωμετρία',
      prompt: `Η περίμετρος ενός τετραγώνου πλευράς x δίνεται από τον τύπο Π ＝ 4 · x. Αν x ＝ ${side} εκ., πόση είναι η περίμετρος;`,
      type: 'input',
      correct: String(res),
      explain: `Π ＝ 4 · ${side} ＝ ${res} εκ.`
    };
  },
  // 16-20: Επιλογή σωστής αλγεβρικής έκφρασης
  () => {
    const k = getRandomInt(3, 8);
    const correct = `${k} · x ＋ 5`;
    const wrongs = [`x : ${k} ＋ 5`, `${k} ＋ x ＋ 5`, `5 · x ＋ ${k}`];
    return {
      title: 'Κεφάλαιο 32 • Φραστική Έκφραση σε Μεταβλητή',
      prompt: `Ποια μαθηματική έκφραση δηλώνει: «Το πενταπλάσιο ενός αριθμού x αυξημένο κατά 5»;`,
      type: 'mcq',
      options: shuffle([`5 · x ＋ 5`, `5 · x － 5`, `x : 5 ＋ 5`, `5 ＋ x`]),
      correct: `5 · x ＋ 5`,
      explain: `Πενταπλάσιο του x είναι το 5 · x, και αυξημένο κατά 5 σημαίνει 5 · x ＋ 5.`
    };
  },
  // 21-25: Παράσταση με κλάσμα x/a + b
  () => {
    const a = getRandomInt(2, 5);
    const x = a * getRandomInt(3, 8);
    const b = getRandomInt(2, 10);
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

// ΚΕΦΑΛΑΙΟ 33: ΕΞΙΣΩΣΗ x + a = b
const POOL_CH33 = [
  // Δεκαδικοί
  () => {
    const a_raw = getRandomInt(25, 75) / 10;
    const b_raw = Number((a_raw + getRandomInt(15, 65) / 10).toFixed(1));
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
    const d = getRandomInt(5, 12);
    const n1 = getRandomInt(1, 4);
    const n2 = getRandomInt(n1 + 1, n1 + 6);
    const diffN = n2 - n1;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: x ＋ ${n1}/${d} ＝ ${n2}/${d} (μορφή κλάσματος π.χ. 3/7):`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n2}/${d} － ${n1}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = getRandomInt(45, 150);
    const x = getRandomInt(35, 120);
    const b = x + a;
    return {
      title: 'Κεφάλαιο 33 • Εξίσωση x ＋ α ＝ β (Φυσικοί)',
      prompt: `Λύσε την εξίσωση: x ＋ ${a} ＝ ${b}`,
      type: 'input',
      correct: String(x),
      explain: `x ＝ ${b} － ${a} ＝ ${x}.`
    };
  },
  // Θεωρία / Σωστό-Λάθος
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφάλαιο 33 • Ιδιότητες Πρόσθεσης',
      prompt: `«Στην εξίσωση x ＋ α ＝ β, για να βρούμε τον άγνωστο προσθετέο x κάνουμε πάντοτε αφαίρεση: x ＝ β － α.»`,
      type: 'tf',
      correct: isTrue,
      text: isTrue 
        ? 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος προσθετέος x υπολογίζεται με αφαίρεση: x ＝ β － α.'
        : 'Στην εξίσωση x ＋ α ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ β ＋ α.',
      explain: isTrue ? 'Σωστά! Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης.' : 'Λάθος! Για να βρούμε τον προσθετέο κάνουμε αφαίρεση: x ＝ β － α.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 34: ΕΞΙΣΩΣΗ x - a = b (Άγνωστος Μειωτέος)
const POOL_CH34 = [
  // Δεκαδικοί
  () => {
    const a_raw = getRandomInt(25, 75) / 10;
    const b_raw = getRandomInt(15, 65) / 10;
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
    const d = getRandomInt(5, 12);
    const n1 = getRandomInt(1, 4);
    const n2 = getRandomInt(2, 5);
    const sumN = n1 + n2;
    const g = gcd(sumN, d);
    const correctRaw = `${sumN}/${d}`;
    const correctSimp = g > 1 ? `${sumN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 34 • Άγνωστος Μειωτέος (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: x － ${n1}/${d} ＝ ${n2}/${d}`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n2}/${d} ＋ ${n1}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = getRandomInt(55, 180);
    const b = getRandomInt(45, 160);
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
    const a = getRandomInt(20, 60);
    const b = getRandomInt(30, 80);
    const correct = `x ＝ ${b} ＋ ${a}`;
    return {
      title: 'Κεφάλαιο 34 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x － ${a} ＝ ${b};`,
      type: 'mcq',
      options: shuffle([`x ＝ ${b} ＋ ${a}`, `x ＝ ${b} － ${a}`, `x ＝ ${a} － ${b}`, `x ＝ ${b} : ${a}`]),
      correct,
      explain: `Για να βρούμε τον άγνωστο μειωτέο x, προσθέτουμε τη διαφορά και τον αφαιρετέο: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 35: ΕΞΙΣΩΣΗ a - x = b (Άγνωστος Αφαιρετέος)
const POOL_CH35 = [
  // Δεκαδικοί
  () => {
    const a_raw = getRandomInt(55, 95) / 10;
    const b_raw = getRandomInt(12, Math.floor(a_raw * 10) - 10) / 10;
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
    const d = getRandomInt(6, 14);
    const n1 = getRandomInt(5, d - 1);
    const n2 = getRandomInt(1, n1 - 2);
    const diffN = n1 - n2;
    const g = gcd(diffN, d);
    const correctRaw = `${diffN}/${d}`;
    const correctSimp = g > 1 ? `${diffN / g}/${d / g}` : correctRaw;
    return {
      title: 'Κεφάλαιο 35 • Άγνωστος Αφαιρετέος (Κλάσματα)',
      prompt: `Λύσε την εξίσωση: ${n1}/${d} － x ＝ ${n2}/${d}`,
      type: 'input',
      correct: correctRaw,
      altCorrect: correctSimp,
      explain: `x ＝ ${n1}/${d} － ${n2}/${d} ＝ ${correctRaw}${g > 1 ? ` (ή ${correctSimp})` : ''}.`
    };
  },
  // Φυσικοί αριθμοί
  () => {
    const a = getRandomInt(75, 250);
    const b = getRandomInt(15, a - 25);
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
      prompt: `«Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και βρίσκεται με αφαίρεση: x ＝ α － β.»`,
      type: 'tf',
      correct: true,
      text: 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος x υπολογίζεται πάντα με αφαίρεση: x ＝ α － β.',
      explain: 'Σωστά! Για να βρούμε τι αφαιρέθηκε από το αρχικό μέγεθος, αφαιρούμε τη διαφορά από τον μειωτέο.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 36: ΕΞΙΣΩΣΗ a * x = b ή x * a = b (Άγνωστος Παράγοντας)
const POOL_CH36 = [
  // Δεκαδικοί
  () => {
    const a = getRandomInt(2, 5);
    const x_raw = getRandomInt(12, 65) / 10;
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
  // Φυσικοί αριθμοί (x * a = b)
  () => {
    const a = getRandomInt(12, 25);
    const x = getRandomInt(6, 18);
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
    const d = getRandomInt(3, 8);
    const numA = getRandomInt(2, 5);
    const x = getRandomInt(2, 6);
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
    const a = getRandomInt(4, 12);
    const x = getRandomInt(4, 12);
    const b = a * x;
    const correct = `x ＝ ${b} : ${a}`;
    return {
      title: 'Κεφάλαιο 36 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} · x ＝ ${b};`,
      type: 'mcq',
      options: shuffle([`x ＝ ${b} : ${a}`, `x ＝ ${b} · ${a}`, `x ＝ ${b} － ${a}`, `x ＝ ${a} : ${b}`]),
      correct,
      explain: `Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: ${correct}.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 37: ΕΞΙΣΩΣΗ x : a = b (Άγνωστος Διαιρετέος)
const POOL_CH37 = [
  // Δεκαδικοί
  () => {
    const a = getRandomInt(3, 6);
    const b_raw = getRandomInt(12, 45) / 10;
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
    const a = getRandomInt(12, 24);
    const b = getRandomInt(6, 18);
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
    const d = getRandomInt(3, 7);
    const numA = getRandomInt(2, 5);
    const k = getRandomInt(2, 6);
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
      prompt: `«Στη διαίρεση x : α ＝ β, ο άγνωστος διαιρετέος x υπολογίζεται πάντα με πολλαπλασιασμό: x ＝ α · β.»`,
      type: 'tf',
      correct: true,
      text: 'Στην εξίσωση x : α ＝ β, ο άγνωστος διαιρετέος x βρίσκεται με πολλαπλασιασμό: x ＝ α · β.',
      explain: 'Σωστά! Η αντίστροφη πράξη της διαίρεσης είναι ο πολλαπλασιασμός.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 38: ΕΞΙΣΩΣΗ a : x = b (Άγνωστος Διαιρέτης)
const POOL_CH38 = [
  // Δεκαδικοί
  () => {
    const x = getRandomInt(2, 6);
    const b_raw = getRandomInt(12, 45) / 10;
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
    const x = getRandomInt(6, 16);
    const b = getRandomInt(8, 25);
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
    const d = getRandomInt(4, 9);
    const x = getRandomInt(2, 6);
    const numB = getRandomInt(2, 5);
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
    const x = getRandomInt(4, 10);
    const b = getRandomInt(5, 12);
    const a = x * b;
    const correct = `x ＝ ${a} : ${b}`;
    return {
      title: 'Κεφάλαιο 38 • Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${a} : x ＝ ${b};`,
      type: 'mcq',
      options: shuffle([`x ＝ ${a} : ${b}`, `x ＝ ${a} · ${b}`, `x ＝ ${b} : ${a}`, `x ＝ ${a} － ${b}`]),
      correct,
      explain: `Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: ${correct}.`
    };
  }
];

// ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (Πολυεπίπεδες Εξισώσεις / Real-life)
const POOL_COMBINED = [
  // Συνδυαστικό 1: 2-step εξίσωση a*x + b = c
  () => {
    const a = getRandomInt(3, 6);
    const x = getRandomInt(4, 12);
    const b = getRandomInt(5, 25);
    const c = a * x + b;
    return {
      title: '🌟 Συνδυαστικό Πρόβλημα • Εξίσωση 2 Βημάτων',
      prompt: `Η Μαρία αγόρασε ${a} ίδια βιβλία (x ευρώ το καθένα) και ένα στυλό που κόστιζε ${b} ευρώ. Πλήρωσε συνολικά ${c} ευρώ. Πόσο κόστιζε το κάθε βιβλίο (x);`,
      type: 'input',
      correct: String(x),
      explain: `Σχηματίζουμε την εξίσωση: ${a} · x ＋ ${b} ＝ ${c} ➔ ${a} · x ＝ ${c} － ${b} ＝ ${a * x} ➔ x ＝ ${a * x} : ${a} ＝ ${x} ευρώ.`
    };
  },
  // Συνδυαστικό 2: 2-step εξίσωση a*x - b = c
  () => {
    const a = getRandomInt(3, 5);
    const x = getRandomInt(10, 25);
    const discount = getRandomInt(4, 15);
    const total = a * x - discount;
    return {
      title: '🌟 Συνδυαστικό Πρόβλημα • Εξίσωση με Έκπτωση',
      prompt: `Ο Γιώργος αγόρασε ${a} ίδια πουκάμισα αξίας x ευρώ το καθένα. Είχε κουπόνι έκπτωσης ${discount} ευρώ και τελικά πλήρωσε ${total} ευρώ. Πόσο κόστιζε αρχικά το κάθε πουκάμισο;`,
      type: 'input',
      correct: String(x),
      explain: `Σχηματίζουμε την εξίσωση: ${a} · x － ${discount} ＝ ${total} ➔ ${a} · x ＝ ${total} ＋ ${discount} ＝ ${a * x} ➔ x ＝ ${a * x} : ${a} ＝ ${x} ευρώ.`
    };
  },
  // Συνδυαστικό 3: Γεωμετρικό πρόβλημα περιμέτρου ορθογωνίου 2*(x + a) = P
  () => {
    const width = getRandomInt(6, 14);
    const length = width + getRandomInt(4, 10);
    const perimeter = 2 * (length + width);
    return {
      title: '🌟 Συνδυαστικό Πρόβλημα • Περίμετρος Ορθογωνίου',
      prompt: `Ένα ορθογώνιο οικόπεδο έχει πλάτος ${width} μ. και περίμετρο ${perimeter} μ. Αν x είναι το μήκος του, να βρεις το x (σε μέτρα):`,
      type: 'input',
      correct: String(length),
      explain: `Η περίμετρος είναι 2 · (x ＋ ${width}) ＝ ${perimeter} ➔ x ＋ ${width} ＝ ${perimeter / 2} ➔ x ＝ ${perimeter / 2} － ${width} ＝ ${length} μέτρα.`
    };
  },
  // Συνδυαστικό 4: Πρόβλημα κατανομής και υπολοίπου
  () => {
    const portions = getRandomInt(3, 6);
    const perPortion = getRandomInt(5, 12);
    const leftover = getRandomInt(2, 6);
    const total = portions * perPortion + leftover;
    return {
      title: '🌟 Συνδυαστικό Πρόβλημα • Διαίρεση με Υπόλοιπο',
      prompt: `Μοιράσαμε ${total} καραμέλες σε ${portions} παιδιά και πήραν από x καραμέλες το καθένα, ενώ περίσσεψαν ${leftover} καραμέλες. Πόσες καραμέλες πήρε κάθε παιδί;`,
      type: 'input',
      correct: String(perPortion),
      explain: `${portions} · x ＋ ${leftover} ＝ ${total} ➔ ${portions} · x ＝ ${total - leftover} ➔ x ＝ ${total - leftover} : ${portions} ＝ ${perPortion} καραμέλες.`
    };
  }
];

// Δημιουργία των 16 ερωτήσεων του γύρου
function generate16Questions() {
  const qList = [];

  // Επιλογή 2 ερωτήσεων από κάθε κεφάλαιο (32 έως 38)
  const chapters = [
    { pool: POOL_CH32, code: 'CH32' },
    { pool: POOL_CH33, code: 'CH33' },
    { pool: POOL_CH34, code: 'CH34' },
    { pool: POOL_CH35, code: 'CH35' },
    { pool: POOL_CH36, code: 'CH36' },
    { pool: POOL_CH37, code: 'CH37' },
    { pool: POOL_CH38, code: 'CH38' }
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

export default function Epanalipsi2Page() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = () => {
    const qs = generate16Questions();
    setQuestions(qs);
    const initialAns = {};
    qs.forEach((_, idx) => {
      initialAns[`q${idx}`] = '';
    });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadNewTest();
  }, []);

  if (questions.length === 0) return null;

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
    if (submitted) return;

    let s = 0;
    questions.forEach((q, idx) => {
      if (isQuestionCorrect(q, answers[`q${idx}`])) {
        s += 1;
      }
    });

    setScore(s);
    setSubmitted(true);
  };

  const getCardStyle = (idx) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    const q = questions[idx];
    const userAns = answers[`q${idx}`];
    return isQuestionCorrect(q, userAns)
      ? 'bg-emerald-50/60 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/60 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between pb-32">
      <Head>
        <title>🏆 2η Επανάληψη: Εξισώσεις (Κεφ. 32-38) - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Μεγάλο επαναληπτικό διαγώνισμα 16 ερωτήσεων στις εξισώσεις (Κεφάλαια 32 έως 38) για τη ΣΤ' Δημοτικού με αυτόματη βαθμολόγηση." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5"
              >
                <span>🔙</span> <span>ΣΤ' Δημοτικού</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white py-10 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-300 border border-white/20">
                <span>🏆 2η Μεγάλη Επανάληψη • Κεφάλαια 32 - 38</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Επαναληπτικό Τεστ: Εξισώσεις & Μεταβλητές
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
                16 δυναμικές ερωτήσεις υψηλής δυσκολίας (2 από κάθε κεφάλαιο + 2 συνδυαστικά προβλήματα) με αυτόματη αξιολόγηση!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέο Διαγώνισμα</span>
            </button>
          </div>
        </section>

        {/* 3. ΦΟΡΜΑ ΜΕ ΤΙΣ 16 ΕΡΩΤΗΣΕΙΣ */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {questions.map((q, idx) => {
                const key = `q${idx}`;
                const userAns = answers[key];
                const isCorrect = isQuestionCorrect(q, userAns);

                return (
                  <div key={idx} className={`p-6 rounded-3xl border transition-all ${getCardStyle(idx)}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        idx >= 14 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        Ερώτηση {idx + 1} • {q.title}
                      </span>
                      {submitted && (
                        <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-slate-800 mb-4 font-medium leading-relaxed">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

                    {/* INPUT TYPE */}
                    {q.type === 'input' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          disabled={submitted}
                          value={userAns || ''}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder="Απάντηση..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-blue-500 outline-none disabled:bg-slate-100 font-mono shadow-inner"
                        />
                      </div>
                    )}

                    {/* MCQ TYPE */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleInputChange(key, opt)}
                            className={`w-full p-3 rounded-xl text-xs sm:text-sm font-bold border text-center transition ${
                              userAns === opt
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
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
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(key, true)}
                          className={`py-3 rounded-xl font-black text-sm border transition ${
                            userAns === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 Σωστό
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(key, false)}
                          className={`py-3 rounded-xl font-black text-sm border transition ${
                            userAns === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 Λάθος
                        </button>
                      </div>
                    )}

                    {/* ΕΠΕΞΗΓΗΣΗ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
                    {submitted && (
                      <div className={`mt-3 p-3.5 rounded-xl text-xs font-medium leading-relaxed ${
                        isCorrect ? 'bg-emerald-100/70 text-emerald-950' : 'bg-rose-100/70 text-rose-950'
                      }`}>
                        💡 <strong>Επεξήγηση:</strong> {q.explain}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <span className="text-2xl">🎯</span>
                  <span>Ολοκλήρωση & Βαθμολόγηση</span>
                </button>
              </div>
            )}
          </form>
        </main>
      </div>

      {/* 4. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-xl md:text-2xl">{score} / 16</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 16) * 100)}%</span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: GUIDANCE TEXT OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Νέο Τεστ με διαφορετικές ασκήσεις!</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Απάντησε και στις 16 ερωτήσεις και πάτα «Ολοκλήρωση & Βαθμολόγηση»!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
