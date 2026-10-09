// pages/st-dimotikou/54-epanalipsi-3.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// =========================================================
// ΔΕΞΑΜΕΝΕΣ 14 ΚΕΦΑΛΑΙΩΝ (ΚΕΦ. 40 ΕΩΣ 53)
// =========================================================

const CHAPTER_POOLS = {
  // ΚΕΦΑΛΑΙΟ 40: ΛΟΓΟΣ 2 ΜΕΓΕΘΩΝ
  40: [
    () => {
      const a = randInt(2, 6) * 3;
      const b = randInt(2, 6) * 4;
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      const g = gcd(a, b);
      const simpA = a / g;
      const simpB = b / g;
      return {
        type: 'mcq',
        title: 'Κεφάλαιο 40 • Λόγος 2 Μεγεθών',
        prompt: `Σε μια τάξη υπάρχουν ${a} αγόρια και ${b} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των αγοριών προς τα κορίτσια;`,
        options: shuffle([
          `${simpA} : ${simpB}`,
          `${simpB} : ${simpA}`,
          `${simpA + 1} : ${simpB}`,
          `${a} : ${b + 2}`
        ]),
        correct: `${simpA} : ${simpB}`,
        explain: `Ο λόγος είναι ${a} : ${b}. Διαιρώντας αριθμητή και παρονομαστή με το ${g}, προκύπτει ${simpA} : ${simpB}.`
      };
    },
    () => {
      const cm = randInt(20, 80);
      const m = randInt(2, 5);
      const cmTotal = m * 100;
      const val = Number((cm / cmTotal).toFixed(2));
      return {
        type: 'input',
        inputType: 'decimal',
        title: 'Κεφάλαιο 40 • Λόγος Ομοειδών Μεγεθών',
        prompt: `Ποιος είναι ο λόγος του μήκους ${cm} cm προς το μήκος ${m} m σε δεκαδική μορφή;`,
        correct: formatNum(val),
        explain: `Μετατρέπουμε τα ${m} m σε εκατοστά: ${cmTotal} cm. Ο λόγος είναι ${cm} : ${cmTotal} ＝ ${formatNum(val)}.`
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 41: ΑΝΑΛΟΓΙΑ
  41: [
    () => {
      const a = randInt(2, 5);
      const b = randInt(6, 9);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      return {
        type: 'mcq',
        title: 'Κεφάλαιο 41 • Έννοια Αναλογίας',
        prompt: `Είναι οι λόγοι ${a} : ${b} και ${c} : ${d} ίσοι ώστε να σχηματίζουν αναλογία;`,
        options: shuffle([
          `Ναι, γιατί ${a} · ${d} ＝ ${b} · ${c} ＝ ${a * d}`,
          'Όχι, γιατί οι αριθμοί είναι διαφορετικοί',
          'Μόνο αν τους προσθέσουμε',
          'Όχι, γιατί δεν έχουν ίδιο επόμενο όρο'
        ]),
        correct: `Ναι, γιατί ${a} · ${d} ＝ ${b} · ${c} ＝ ${a * d}`,
        explain: `Αναλογία είναι η ισότητα δύο λόγων. Εδώ ${a} : ${b} ＝ ${c} : ${d}.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'Κεφάλαιο 41 • Όροι Αναλογίας',
        prompt: 'Στην αναλογία 3 : 5 ＝ 9 : 15, ποιοι είναι οι άκροι όροι;',
        options: shuffle([
          'Το 3 και το 15',
          'Το 5 και το 9',
          'Το 3 και το 9',
          'Το 5 και το 15'
        ]),
        correct: 'Το 3 και το 15',
        explain: 'Στην αναλογία α : β ＝ γ : δ, άκροι όροι είναι οι α και δ (εδώ 3 και 15) και μέσοι όροι οι β και γ.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 42: ΑΝΑΛΟΓΙΑ ΧΙΑΣΤΙ
  42: [
    () => {
      const a = randInt(2, 5);
      const b = randInt(6, 10);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 42 • Χιαστί Πολλαπλασιασμός',
        prompt: `Στην αναλογία ${a} : ${b} ＝ ${c} : x, ποια είναι η τιμή του x;`,
        correct: String(d),
        explain: `x ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${d}.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'Κεφάλαιο 42 • Σταυρωτά Γινόμενα',
        prompt: 'Στην αναλογία 2 : 5 ＝ 6 : 15, πόσο ισούται το σταυρωτό γινόμενο;',
        options: shuffle(['30', '20', '15', '12']),
        correct: '30',
        explain: '2 · 15 ＝ 30 και 5 · 6 ＝ 30.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 43: ΣΤΑΘΕΡΑ ΚΑΙ ΜΕΤΑΒΛΗΤΑ ΠΟΣΑ
  43: [
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 43 • Σταθερά & Μεταβλητά Ποσά',
      prompt: 'Ποιο από τα παρακάτω αποτελεί ΣΤΑΘΕΡΟ ποσό;',
      options: shuffle([
        'Ο αριθμός των ημερών του μήνα Ιανουαρίου (πάντα 31)',
        'Η θερμοκρασία της πόλης στη διάρκεια της ημέρας',
        'Το ύψος ενός παιδιού καθώς μεγαλώνει',
        'Η ταχύτητα ενός αυτοκινήτου στην εθνική οδό'
      ]),
      correct: 'Ο αριθμός των ημερών του μήνα Ιανουαρίου (πάντα 31)',
      explain: 'Σταθερό ποσό είναι εκείνο του οποίου η τιμή δεν αλλάζει ποτέ (όπως οι 31 ημέρες του Ιανουαρίου).'
    }),
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 43 • Μεταβλητό Ποσό',
      prompt: 'Ποιο από τα παρακάτω είναι μεταβλητό ποσό;',
      options: shuffle([
        'Η ποσότητα βενζίνης στο ρεζερβουάρ ενός αυτοκινήτου καθώς ταξιδεύει',
        'Ο αριθμός των μηνών του έτους',
        'Η περίμετρος ενός σταθερού τετραγώνου πλευράς 5 cm',
        'Ο αριθμός των ωρών μιας ημέρας'
      ]),
      correct: 'Η ποσότητα βενζίνης στο ρεζερβουάρ ενός αυτοκινήτου καθώς ταξιδεύει',
      explain: 'Η ποσότητα καυσίμου αλλάζει συνεχώς κατά την οδήγηση, άρα είναι μεταβλητό μέγεθος.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 44: ΑΝΑΛΟΓΑ ΠΟΣΑ
  44: [
    () => {
      const unit = randInt(3, 7);
      const x1 = 2;
      const y1 = x1 * unit;
      const x2 = 5;
      const y2 = x2 * unit;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 44 • Σταθερό Πηλίκο Ανάλογων Ποσών',
        prompt: `Σε δύο ανάλογα ποσά, όταν x ＝ ${x1} το y ＝ ${y1} και όταν x ＝ ${x2} το y ＝ ${y2}. Ποιο είναι το σταθερό πηλίκο λ ＝ y : x;`,
        correct: String(unit),
        explain: `Στα ανάλογα ποσά το πηλίκο y : x είναι σταθερό: ${y1} : ${x1} ＝ ${unit}.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 44 • Γραφική Παράσταση Ανάλογων Ποσών',
      prompt: 'Ποια είναι η μορφή της γραφικής παράστασης δύο ανάλογων ποσών;',
      options: shuffle([
        'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
        'Καμπύλη γραμμή που δεν περνάει από το (0, 0)',
        'Κύκλος γύρω από το (0, 0)',
        'Τεθλασμένη γραμμή'
      ]),
      correct: 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
      explain: 'Η γραφική παράσταση ανάλογων ποσών είναι πάντα ευθεία που περνάει από το σημείο (0, 0).'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 45: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΑΝΑΛΟΓΑ ΠΟΣΑ
  45: [
    () => {
      const kg1 = randInt(2, 4);
      const costKg = randInt(3, 6);
      const total1 = kg1 * costKg;
      const kg2 = kg1 + randInt(3, 6);
      const total2 = kg2 * costKg;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 45 • Πρόβλημα Ανάλογων Ποσών',
        prompt: `Αν ${kg1} kg μήλα κοστίζουν ${total1} €, πόσα € κοστίζουν ${kg2} kg από τα ίδια μήλα;`,
        correct: String(total2),
        tableData: [
          { item: 'Πρώτη αγορά', formula: `${kg1} kg ➔ ${total1} €`, val: `${total1} €` },
          { item: 'Δεύτερη αγορά', formula: `${kg2} kg ➔ x €`, val: 'x €' },
          { item: 'Υπολογισμός χιαστί', formula: `(${total1} · ${kg2}) : ${kg1}`, val: `${total2} €` }
        ],
        explain: `Το 1 kg κοστίζει ${total1} : ${kg1} ＝ ${costKg} €. Τα ${kg2} kg κοστίζουν ${kg2} · ${costKg} ＝ ${total2} €.`
      };
    },
    () => {
      const h1 = 2;
      const km1 = 140;
      const h2 = 5;
      const km2 = (km1 / h1) * h2;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 45 • Απόσταση και Χρόνος',
        prompt: `Ένα αυτοκίνητο διανύει ${km1} km σε ${h1} ώρες. Πόσα km θα διανύσει σε ${h2} ώρες με σταθερή ταχύτητα;`,
        correct: String(km2),
        tableData: [
          { item: 'Ταχύτητα (km/h)', formula: `${km1} : ${h1}`, val: '70 km/h' },
          { item: 'Συνολική απόσταση', formula: `5 · 70`, val: `${km2} km` }
        ],
        explain: `Σε 1 ώρα διανύει ${km1} : ${h1} ＝ 70 km. Σε ${h2} ώρες διανύει: ${h2} · 70 ＝ ${km2} km.`
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 46: ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  46: [
    () => {
      const x = randInt(3, 6);
      const y = randInt(8, 12);
      const alpha = x * y;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 46 • Σταθερό Γινόμενο Αντιστρόφων',
        prompt: `Σε δύο αντιστρόφως ανάλογα ποσά, όταν x ＝ ${x} τότε y ＝ ${y}. Ποιο είναι το σταθερό γινόμενο α;`,
        correct: String(alpha),
        explain: `Στα αντιστρόφως ανάλογα ποσά παραμένει σταθερό το γινόμενο: α ＝ x · y ＝ ${x} · ${y} ＝ ${alpha}.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 46 • Γραφική Παράσταση Αντιστρόφων',
      prompt: 'Ποια είναι η μορφή της γραφικής παράστασης δύο αντιστρόφως ανάλογων ποσών;',
      options: shuffle([
        'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)',
        'Ευθεία γραμμή που διέρχεται από το (0, 0)',
        'Κύκλος γύρω από τους άξονες',
        'Ευθεία παράλληλη στον άξονα x'
      ]),
      correct: 'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)',
      explain: 'Η γραφική παράσταση των αντιστρόφως ανάλογων ποσών είναι καμπύλη υπερβολή που δεν αγγίζει ποτέ τους άξονες.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 47: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  47: [
    () => {
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const total = w1 * d1;
      const w2 = w1 + 2;
      const d2 = total / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        type: 'input',
        inputType: 'decimal',
        title: 'Κεφάλαιο 47 • Πρόβλημα Αντιστρόφων Ποσών',
        prompt: `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες;`,
        correct: formatNum(cleanD2),
        tableData: [
          { item: 'Σταθερό γινόμενο (έργο)', formula: `${w1} · ${d1}`, val: `${total} μεροκάματα` },
          { item: 'Νέος χρόνος', formula: `${total} : ${w2}`, val: `${formatNum(cleanD2)} ημέρες` }
        ],
        explain: `Σταθερό γινόμενο: ${w1} · ${d1} ＝ ${total}. Για ${w2} εργάτες: ${total} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 47 • Μέθοδος Επίλυσης Αντιστρόφων',
      prompt: 'Σε έναν πίνακα αντιστρόφως ανάλογων ποσών, ποια πράξη εκτελούμε ανάμεσα στις τιμές των δύο στηλών;',
      options: shuffle([
        'Οριζόντιο πολλαπλασιασμό (x₁ · y₁ ＝ x₂ · y₂)',
        'Σταυρωτό πολλαπλασιασμό (χιαστί)',
        'Πρόσθεση των στηλών',
        'Διαίρεση των αθροισμάτων'
      ]),
      correct: 'Οριζόντιο πολλαπλασιασμό (x₁ · y₁ ＝ x₂ · y₂)',
      explain: 'Στα αντιστρόφως ανάλογα ποσά τα οριζόντια γινόμενα των αντίστοιχων τιμών είναι πάντοτε ίσα.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 48: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΑΛΟΓΑ ΠΟΣΑ)
  48: [
    () => {
      const a = randInt(3, 5);
      const b = randInt(12, 20);
      const c = a * 2;
      const d = b * 2;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 48 • Μέθοδος των Τριών (Ανάλογα)',
        prompt: `Σε πρόβλημα ανάλογων ποσών: τα ${a} m υφάσματος κοστίζουν ${b} €. Πόσο κοστίζουν τα ${c} m (x);`,
        correct: String(d),
        tableData: [
          { item: 'Κατάταξη', formula: `${a} m ➔ ${b} € | ${c} m ➔ x €`, val: 'Ανάλογα ποσά' },
          { item: 'Χιαστί υπολογισμός', formula: `(${b} · ${c}) : ${a}`, val: `${d} €` }
        ],
        explain: `Ποσά ανάλογα (χιαστί): x ＝ (${b} · ${c}) : ${a} ＝ ${d} €.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 48 • Ονομασία της Μεθόδου των Τριών',
      prompt: 'Γιατί η μέθοδος ονομάζεται «Απλή Μέθοδος των Τριών»;',
      options: shuffle([
        'Επειδή γνωρίζουμε 3 όρους και ψάχνουμε τον 4ο άγνωστο',
        'Επειδή χρησιμοποιεί 3 πίνακες',
        'Επειδή περιέχει 3 διαφορετικά ποσά',
        'Επειδή λύνεται πάντοτε σε 3 βήματα'
      ]),
      correct: 'Επειδή γνωρίζουμε 3 όρους και ψάχνουμε τον 4ο άγνωστο',
      explain: 'Δίνονται τρεις γνωστοί όροι ανάμεσα σε δύο ποσά και ζητείται ο τέταρτος.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 49: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ)
  49: [
    () => {
      const sp1 = 60;
      const t1 = randInt(3, 5);
      const dist = sp1 * t1;
      const sp2 = 90;
      const t2 = dist / sp2;
      const cleanT2 = Number.isInteger(t2) ? t2 : Number(t2.toFixed(1));
      return {
        type: 'input',
        inputType: 'decimal',
        title: 'Κεφάλαιο 49 • Μέθοδος των Τριών (Αντίστροφα)',
        prompt: `Με ταχύτητα ${sp1} km/h απαιτούνται ${t1} ώρες. Πόσες ώρες (x) απαιτούνται με ταχύτητα ${sp2} km/h;`,
        correct: formatNum(cleanT2),
        tableData: [
          { item: 'Κατάταξη', formula: `${sp1} km/h ➔ ${t1} h | ${sp2} km/h ➔ x h`, val: 'Αντιστρόφως ανάλογα' },
          { item: 'Οριζόντιο γινόμενο', formula: `(${sp1} · ${t1}) : ${sp2}`, val: `${formatNum(cleanT2)} h` }
        ],
        explain: `Αντιστρόφως ανάλογα (οριζόντια γινόμενα): x ＝ (${sp1} · ${t1}) : ${sp2} ＝ ${formatNum(cleanT2)} ώρες.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 49 • Έλεγχος Ποσών στη Μέθοδο των Τριών',
      prompt: 'Ποιο είναι το πιο κρίσιμο βήμα στη μέθοδο των τριών πριν κάνουμε πράξεις;',
      options: shuffle([
        'Να ελέγξουμε αν τα ποσά είναι ανάλογα ή αντιστρόφως ανάλογα',
        'Να προσθέσουμε όλα τα δεδομένα',
        'Να κάνουμε αμέσως χιαστί πολλαπλασιασμό',
        'Να μετατρέψουμε όλους τους αριθμούς σε κλάσματα'
      ]),
      correct: 'Να ελέγξουμε αν τα ποσά είναι ανάλογα ή αντιστρόφως ανάλογα',
      explain: 'Ο έλεγχος του είδους των ποσών καθορίζει αν θα εφαρμόσουμε χιαστί (ανάλογα) ή οριζόντιο πολλαπλασιασμό (αντίστροφα).'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 50: ΠΟΣΟΣΤΑ
  50: [
    () => {
      const preset = pickRandom([
        { num: 1, den: 4, pct: 25 },
        { num: 3, den: 4, pct: 75 },
        { num: 2, den: 5, pct: 40 },
        { num: 7, den: 10, pct: 70 }
      ]);
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 50 • Μετατροπή Κλάσματος σε Ποσοστό',
        prompt: `Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα ${preset.num}/${preset.den}; (γράψε μόνο τον αριθμό)`,
        correct: String(preset.pct),
        explain: `(${preset.num} : ${preset.den}) · 100 ＝ ${preset.pct} %.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 50 • Σχέση στα Εκατό και στα Χίλια',
      prompt: 'Σε πόσα στα χίλια (‰) αντιστοιχεί το ποσοστό 5 %;',
      options: shuffle(['50 ‰', '5 ‰', '500 ‰', '0,5 ‰']),
      correct: '50 ‰',
      explain: '1 % ＝ 10 ‰, άρα 5 % ＝ 50 ‰.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 51: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΠΟΣΟΣΤΑ
  51: [
    () => {
      const orig = randInt(4, 8) * 20;
      const pct = pickRandom([10, 20, 25]);
      const disc = (orig * pct) / 100;
      const finalP = orig - disc;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 51 • Τελική Τιμή μετά από Έκπτωση',
        prompt: `Ένα προϊόν κοστίζει ${orig} € και έχει έκπτωση ${pct} %. Πόσα € θα πληρώσει ο πελάτης;`,
        correct: String(finalP),
        tableData: [
          { item: 'Αρχική τιμή', formula: `${orig} €`, val: `${orig} €` },
          { item: 'Έκπτωση', formula: `(${orig} · ${pct}) : 100`, val: `${disc} €` },
          { item: 'Τελική τιμή', formula: `${orig} － ${disc}`, val: `${finalP} €` }
        ],
        explain: `Έκπτωση: (${orig} · ${pct}) : 100 ＝ ${disc} €. Τελική τιμή: ${orig} － ${disc} ＝ ${finalP} €.`
      };
    },
    () => {
      const orig = 200;
      const vat = 24;
      const finalVat = orig * 1.24;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 51 • Τελική Τιμή με Φ.Π.Α.',
        prompt: `Ένα είδος έχει καθαρή αξία ${orig} € και επιβαρύνεται με Φ.Π.Α. ${vat} %. Ποια είναι η τελική τιμή σε €;`,
        correct: String(finalVat),
        tableData: [
          { item: 'Καθαρή αξία', formula: `${orig} €`, val: `${orig} €` },
          { item: 'Φόρος Φ.Π.Α. (24%)', formula: `(${orig} · 24) : 100`, val: '48 €' },
          { item: 'Τελική τιμή με φόρο', formula: `${orig} ＋ 48`, val: `${finalVat} €` }
        ],
        explain: `Φόρος: (${orig} · 24) : 100 ＝ 48 €. Τελική τιμή: ${orig} ＋ 48 ＝ ${finalVat} €.`
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 52: ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΤΙΜΗΣ
  52: [
    () => {
      const origPrice = pickRandom([50, 80, 100, 120]);
      const discPct = 20;
      const finalPrice = origPrice * 0.8;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 52 • Εύρεση Αρχικής Τιμής',
        prompt: `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${formatNum(finalPrice)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή του σε €;`,
        correct: String(origPrice),
        tableData: [
          { item: 'Ποσοστό τελικής τιμής', formula: '100 % － 20 %', val: '80 %' },
          { item: 'Αρχική τιμή (100%)', formula: `(${formatNum(finalPrice)} · 100) : 80`, val: `${origPrice} €` }
        ],
        explain: `Η τελική τιμή αντιστοιχεί στο ${100 - discPct} % της αρχικής. Αρχική τιμή: (${formatNum(finalPrice)} · 100) : ${100 - discPct} ＝ ${origPrice} €.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 52 • Η Παγίδα της Αρχικής Τιμής',
      prompt: 'Αν πληρώσαμε 80 € μετά από έκπτωση 20 %, πώς βρίσκουμε την αρχική τιμή;',
      options: shuffle([
        'Διαιρούμε την τελική τιμή με το 0,80 (δηλαδή 80 : 0,80 ＝ 100 €)',
        'Προσθέτουμε 20 % στα 80 € (δηλαδή 80 ＋ 16 ＝ 96 €)',
        'Προσθέτουμε 20 € στα 80 € (δηλαδή 100 € κατά τύχη)',
        'Πολλαπλασιάζουμε 80 επί 1,20'
      ]),
      correct: 'Διαιρούμε την τελική τιμή με το 0,80 (δηλαδή 80 : 0,80 ＝ 100 €)',
      explain: 'Η έκπτωση υπολογίστηκε στην αρχική τιμή, άρα τα 80 € είναι το 80% της αρχικής τιμής (80 : 0,80 ＝ 100 €).'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 53: ΞΕΡΩ ΑΡΧΙΚΗ ΚΑΙ ΤΕΛΙΚΗ ΤΙΜΗ - ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ
  53: [
    () => {
      const orig = pickRandom([50, 80, 100, 120]);
      const pct = 25;
      const finalP = orig * 0.75;
      const diff = orig - finalP;
      return {
        type: 'input',
        inputType: 'number',
        title: 'Κεφάλαιο 53 • Εύρεση Ποσοστού Μεταβολής',
        prompt: `Ένα είδος από ${orig} € πωλείται τελικά προς ${finalP} €. Ποιο είναι το ποσοστό έκπτωσης (%) που έγινε; (γράψε μόνο τον αριθμό)`,
        correct: String(pct),
        tableData: [
          { item: 'Ποσό έκπτωσης', formula: `${orig} － ${finalP}`, val: `${diff} €` },
          { item: 'Ποσοστό επί της αρχικής', formula: `(${diff} : ${orig}) · 100`, val: `${pct} %` }
        ],
        explain: `Διαφορά: ${orig} － ${finalP} ＝ ${diff} €. Ποσοστό επί της αρχικής τιμής: (${diff} : ${orig}) · 100 ＝ ${pct} %.`
      };
    },
    () => ({
      type: 'mcq',
      title: 'Κεφάλαιο 53 • Βάση Υπολογισμού Ποσοστού',
      prompt: 'Σε ποια τιμή υπολογίζουμε το ποσοστό κέρδους ή έκπτωσης;',
      options: shuffle([
        'Πάντοτε στην αρχική τιμή (βάση 100%)',
        'Πάντοτε στην τελική τιμή',
        'Στη διαφορά των δύο τιμών',
        'Στο μέσο όρο των δύο τιμών'
      ]),
      correct: 'Πάντοτε στην αρχική τιμή (βάση 100%)',
      explain: 'Η αρχική τιμή αποτελεί πάντοτε τη βάση σύγκρισης (το 100%).'
    })
  ]
};

// Δημιουργία των 28 ερωτήσεων (ακριβώς 2 από κάθε κεφάλαιο από το 40 έως το 53)
function generateRevisionQuestions() {
  const selectedQuestions = [];

  for (let ch = 40; ch <= 53; ch++) {
    const pool = CHAPTER_POOLS[ch];
    if (pool && pool.length >= 2) {
      const shuffled = shuffle(pool);
      const q1 = shuffled[0]();
      const q2 = shuffled[1]();
      selectedQuestions.push({ ...q1, chapter: ch });
      selectedQuestions.push({ ...q2, chapter: ch });
    }
  }

  return selectedQuestions.map((q, idx) => ({
    ...q,
    id: `rev3_${idx + 1}`
  }));
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function RevisionThreePage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateRevisionQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      }
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
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
      title="3η Επανάληψη: Λόγοι, Αναλογίες & Ποσοστά (Κεφ. 40-53) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μεγάλο επαναληπτικό τεστ 28 θεμάτων στα Κεφάλαια 40 έως 53 της ΣΤ' Δημοτικού: Λόγοι, Αναλογίες, Ανάλογα & Αντιστρόφως Ανάλογα Ποσά, Μέθοδος των Τριών και Ποσοστά."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • 3Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ (ΚΕΦ. 40 - 53)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Επαναληπτικό Διαγώνισμα: Λόγοι, Αναλογίες &amp; Ποσοστά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                28 επιλεγμένες δραστηριότητες (ακριβώς 2 από κάθε κεφάλαιο από το 40 έως το 53). Κάθε ανανέωση αντλεί τυχαία θέματα με αυτόματη βαθμολόγηση και αναλυτικές επεξηγήσεις!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέο Τεστ')}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 28 ΕΡΩΤΗΣΕΙΣ */}
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
                        {toCleanUppercase(`Θέμα ${qNum} / 28`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.prompt}
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
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 12,5' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Τύπος')}</th>
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
                <span>{toCleanUppercase('Έλεγχος Όλων των Απαντήσεων (28 Θέματα)')}</span>
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
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 28</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό Επιτυχίας')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 28) * 100)}%
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
                <span>{toCleanUppercase('Νέο Τεστ')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στα 28 θέματα και πάτησε «{toCleanUppercase('Έλεγχος Όλων των Απαντήσεων (28 Θέματα)')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
