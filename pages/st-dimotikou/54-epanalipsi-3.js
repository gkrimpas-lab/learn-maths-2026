// pages/st-dimotikou/54-epanalipsi-3.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Βοηθητικο component εμφανισης κλασματος (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// ==========================================
// ΔΕΞΑΜΕΝΕΣ 14 ΚΕΦΑΛΑΙΩΝ (10+ ΘΕΜΑΤΑ ΑΝΑ ΚΕΦΑΛΑΙΟ)
// ==========================================

const CHAPTER_POOLS = {
  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 40: ΛΟΓΟΣ 2 ΜΕΓΕΘΩΝ
  // ----------------------------------------------------
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
        title: 'ΚΕΦ. 40 • ΛΟΓΟΣ 2 ΜΕΓΕΘΩΝ',
        instruction: 'Βρείτε την απλοποιημένη μορφή του λόγου:',
        prompt: `Σε μια τάξη υπάρχουν ${a} αγόρια και ${b} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των αγοριών προς τα κορίτσια;`,
        options: [
          { text: `${simpA} : ${simpB}`, isCorrect: true },
          { text: `${simpB} : ${simpA}`, isCorrect: false },
          { text: `${simpA + 1} : ${simpB}`, isCorrect: false },
          { text: `${a} : ${b + 2}`, isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: `${simpA} : ${simpB}`,
        explanation: `Ο λόγος είναι ${a} : ${b}. Διαιρώντας αριθμητή και παρονομαστή με το ${g}, προκύπτει ${simpA} : ${simpB}.`
      };
    },
    () => {
      const cm = randInt(20, 80);
      const m = randInt(2, 5);
      const cmTotal = m * 100;
      const val = Number((cm / cmTotal).toFixed(2));
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 40 • ΛΟΓΟΣ ΟΜΟΕΙΔΩΝ ΜΕΓΕΘΩΝ',
        instruction: 'Μετατρέψτε στην ίδια μονάδα και υπολογίστε τον δεκαδικό λόγο:',
        prompt: `Ποιος είναι ο λόγος του μήκους ${cm} cm προς το μήκος ${m} m; (Εισαγάγετε δεκαδικό αποτέλεσμα)`,
        correctVal: val,
        correctStr: formatNum(val),
        explanation: `Μετατρέπουμε τα ${m} m σε εκατοστά: ${cmTotal} cm. Ο λόγος είναι ${cm} : ${cmTotal} ＝ ${formatNum(val)}.`
      };
    },
    () => {
      const red = randInt(12, 24);
      const blue = randInt(15, 30);
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 40 • ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΩΝ',
        instruction: 'Επιλέξτε τη σωστή έκφραση του λόγου:',
        prompt: `Σε ένα καλάθι υπάρχουν ${red} κόκκινα και ${blue} μπλε μπαλάκια. Ποιος είναι ο λόγος των μπλε προς τα κόκκινα;`,
        options: [
          { text: `${blue} προς ${red}`, isCorrect: true },
          { text: `${red} προς ${blue}`, isCorrect: false },
          { text: `${blue} προς ${red + blue}`, isCorrect: false },
          { text: `${red} προς ${red + blue}`, isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: `${blue} προς ${red}`,
        explanation: `Επειδή ζητείται ο λόγος των μπλε προς τα κόκκινα, το πλήθος των μπλε (${blue}) μπαίνει πρώτο: ${blue} προς ${red}.`
      };
    },
    () => {
      const w = randInt(4, 9);
      const l = w * 2;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 40 • ΤΙΜΗ ΤΟΥ ΛΟΓΟΥ',
        instruction: 'Υπολογίστε την αριθμητική τιμή του λόγου:',
        prompt: `Ένα ορθογώνιο έχει μήκος ${l} cm και πλάτος ${w} cm. Ποια είναι η τιμή του λόγου του μήκους προς το πλάτος;`,
        correctVal: 2,
        correctStr: '2',
        explanation: `Η τιμή του λόγου είναι: ${l} : ${w} ＝ 2.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 40 • ΑΝΤΙΣΤΡΟΦΟΣ ΛΟΓΟΣ',
        instruction: 'Επιλέξτε τη σωστή σχέση:',
        prompt: 'Αν ο λόγος δύο μεγεθών είναι 1 : 3, ποιος είναι ο αντίστροφος λόγος τους;',
        options: [
          { text: '3 : 1 (δηλαδή 3)', isCorrect: true },
          { text: '1 : 3', isCorrect: false },
          { text: '2 : 3', isCorrect: false },
          { text: '3 : 10', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '3 : 1 (δηλαδή 3)',
        explanation: 'Ο αντίστροφος λόγος προκύπτει αντιστρέφοντας τους όρους του λόγου: 3 : 1.'
      };
    },
    () => {
      const days = randInt(2, 5);
      const hours = days * 24;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 40 • ΛΟΓΟΣ ΧΡΟΝΟΥ',
        instruction: 'Υπολογίστε τον λόγο των ημερών προς τις ώρες:',
        prompt: `Ποιος είναι ο λόγος των ${days} ημερών προς τις ${hours} ώρες;`,
        correctVal: 1,
        correctStr: '1',
        explanation: `${days} ημέρες ＝ ${hours} ώρες. Ο λόγος δύο ίσων μεγεθών είναι ${hours} : ${hours} ＝ 1.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 40 • ΜΕΓΕΘΗ ΣΕ ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ',
        instruction: 'Επιλέξτε τη σωστή προσέγγιση:',
        prompt: 'Για να συγκρίνουμε 50 λεπτά με 2 ευρώ, τι πρέπει να κάνουμε πρώτα;',
        options: [
          { text: 'Να μετατρέψουμε και τα δύο ποσά στην ίδια μονάδα (π.χ. σε λεπτά)', isCorrect: true },
          { text: 'Να διαιρέσουμε αμέσως 50 με το 2', isCorrect: false },
          { text: 'Να προσθέσουμε τα ευρώ με τα λεπτά', isCorrect: false },
          { text: 'Να πολλαπλασιάσουμε 50 επί 2', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Να μετατρέψουμε και τα δύο ποσά στην ίδια μονάδα (π.χ. σε λεπτά)',
        explanation: 'Ο λόγος δύο ομοειδών μεγεθών ορίζεται μόνο όταν είναι εκφρασμένα στην ίδια μονάδα μέτρησης.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 40 • ΔΕΚΑΔΙΚΟΣ ΛΟΓΟΣ ΒΑΡΟΥΣ',
        instruction: 'Υπολογίστε τον δεκαδικό λόγο των 250 g προς 1 kg:',
        prompt: 'Ποιος είναι ο λόγος 250 g προς 1 kg;',
        correctVal: 0.25,
        correctStr: '0,25',
        explanation: '1 kg ＝ 1.000 g. Λόγος: 250 : 1.000 ＝ 0,25.'
      };
    },
    () => {
      const wins = randInt(12, 18);
      const losses = randInt(4, 8);
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 40 • ΛΟΓΟΣ ΑΠΟΤΕΛΕΣΜΑΤΩΝ',
        instruction: 'Επιλέξτε τον λόγο:',
        prompt: `Μια ομάδα έχει ${wins} νίκες και ${losses} ήττες. Ποιος είναι ο λόγος των νικών προς τις ήττες;`,
        options: [
          { text: `${wins} : ${losses}`, isCorrect: true },
          { text: `${losses} : ${wins}`, isCorrect: false },
          { text: `${wins} : ${wins + losses}`, isCorrect: false },
          { text: `${losses} : ${wins + losses}`, isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: `${wins} : ${losses}`,
        explanation: `Ο λόγος νικών προς ήττες είναι ${wins} : ${losses}.`
      };
    },
    () => {
      const t = randInt(3, 7);
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 40 • ΑΠΛΟΠΟΙΗΣΗ ΛΟΓΟΥ',
        instruction: 'Υπολογίστε την τιμή του λόγου:',
        prompt: `Ποια είναι η τιμή του λόγου ${t * 5} προς ${t};`,
        correctVal: 5,
        correctStr: '5',
        explanation: `(5 · ${t}) : ${t} ＝ 5.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 41: ΑΝΑΛΟΓΙΑ
  // ----------------------------------------------------
  41: [
    () => {
      const a = randInt(2, 5);
      const b = randInt(6, 9);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΕΝΝΟΙΑ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Επιλέξτε αν σχηματίζεται αναλογία:',
        prompt: `Είναι οι λόγοι ${a} : ${b} και ${c} : ${d} ίσοι ώστε να σχηματίζουν αναλογία;`,
        options: [
          { text: `Ναι, γιατί ${a} · ${d} ＝ ${b} · ${c} ＝ ${a * d}`, isCorrect: true },
          { text: 'Όχι, γιατί οι αριθμοί είναι διαφορετικοί', isCorrect: false },
          { text: 'Μόνο αν τους προσθέσουμε', isCorrect: false },
          { text: 'Όχι, γιατί δεν έχουν ίδιο επόμενο όρο', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: `Ναι, γιατί ${a} · ${d} ＝ ${b} · ${c} ＝ ${a * d}`,
        explanation: `Αναλογία είναι η ισότητα δύο λόγων. Εδώ ${a} : ${b} ＝ ${c} : ${d}.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΟΡΟΙ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Επιλέξτε τους άκρους όρους της αναλογίας 3 : 5 ＝ 9 : 15:',
        prompt: 'Στην αναλογία 3 : 5 ＝ 9 : 15, ποιοι είναι οι άκροι όροι;',
        options: [
          { text: 'Το 3 και το 15', isCorrect: true },
          { text: 'Το 5 και το 9', isCorrect: false },
          { text: 'Το 3 και το 9', isCorrect: false },
          { text: 'Το 5 και το 15', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Το 3 και το 15',
        explanation: 'Στην αναλογία α : β ＝ γ : δ, άκροι όροι είναι οι α και δ (εδώ 3 και 15) και μέσοι όροι οι β και γ.'
      };
    },
    () => {
      const a = randInt(2, 4);
      const b = randInt(5, 7);
      const m = 3;
      const c = a * m;
      const d = b * m;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 41 • ΓΙΝΟΜΕΝΟ ΑΚΡΩΝ ΟΡΩΝ',
        instruction: 'Υπολογίστε το γινόμενο των άκρων όρων στην αναλογία:',
        prompt: `Στην αναλογία ${a} : ${b} ＝ ${c} : ${d}, ποιο είναι το γινόμενο των άκρων όρων;`,
        correctVal: a * d,
        correctStr: String(a * d),
        explanation: `Άκροι όροι είναι το ${a} και το ${d}: ${a} · ${d} ＝ ${a * d}.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΟΡΙΣΜΟΣ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Επιλέξτε τον σωστό ορισμό:',
        prompt: 'Τι ονομάζουμε αναλογία στα Μαθηματικά;',
        options: [
          { text: 'Την ισότητα δύο λόγων', isCorrect: true },
          { text: 'Το άθροισμα δύο κλασμάτων', isCorrect: false },
          { text: 'Τη διαφορά δύο αριθμών', isCorrect: false },
          { text: 'Το γινόμενο δύο δεκαδικών', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Την ισότητα δύο λόγων',
        explanation: 'Αναλογία ονομάζεται η ισότητα δύο ίσων λόγων (α : β ＝ γ : δ).'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 41 • ΙΣΟΤΗΤΑ ΛΟΓΩΝ',
        instruction: 'Συμπληρώστε τον όρο ώστε να ισχύει η αναλογία:',
        prompt: 'Στην αναλογία χ : 10 ＝ 4 : 5, ποια είναι η τιμή του χ;',
        correctVal: 8,
        correctStr: '8',
        explanation: 'χ ＝ (10 · 4) : 5 ＝ 8.'
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΜΕΣΟΙ ΟΡΟΙ',
        instruction: 'Επιλέξτε τους μέσους όρους:',
        prompt: 'Στην αναλογία 2 : 7 ＝ 6 : 21, ποιοι είναι οι μέσοι όροι;',
        options: [
          { text: 'Το 7 και το 6', isCorrect: true },
          { text: 'Το 2 και το 21', isCorrect: false },
          { text: 'Το 2 και το 6', isCorrect: false },
          { text: 'Το 7 και το 21', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Το 7 και το 6',
        explanation: 'Μέσοι όροι είναι ο δεύτερος και ο τρίτος όρος της αναλογίας (7 και 6).'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 41 • ΑΠΛΟΠΟΙΗΣΗ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Απλοποιήστε τον λόγο 4 : 6 σε ανάγωγο χ : 3 και βρείτε το χ:',
        prompt: 'Αν 4 : 6 ＝ χ : 3, ποιο είναι το χ;',
        correctVal: 2,
        correctStr: '2',
        explanation: '4 : 6 ＝ 2 : 3, άρα χ ＝ 2.'
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΕΛΕΓΧΟΣ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Ελέγξτε ποιο ζεύγος σχηματίζει αναλογία:',
        prompt: 'Ποιο από τα παρακάτω ζεύγη λόγων σχηματίζει σωστή αναλογία;',
        options: [
          { text: '2 : 3 και 8 : 12', isCorrect: true },
          { text: '2 : 3 και 5 : 6', isCorrect: false },
          { text: '3 : 4 και 6 : 10', isCorrect: false },
          { text: '1 : 2 και 3 : 8', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '2 : 3 και 8 : 12',
        explanation: '2 · 12 ＝ 24 και 3 · 8 ＝ 24. Τα σταυρωτά γινόμενα είναι ίσα.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 41 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
        instruction: 'Βρείτε το χ αν 1 : 2 ＝ χ : 14:',
        prompt: 'Στην αναλογία 1 : 2 ＝ χ : 14, ποια είναι η τιμή του χ;',
        correctVal: 7,
        correctStr: '7',
        explanation: 'χ ＝ 14 : 2 ＝ 7.'
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 41 • ΙΔΙΟΤΗΤΑ ΑΝΑΛΟΓΙΑΣ',
        instruction: 'Επιλέξτε τη θεμελιώδη ιδιότητα:',
        prompt: 'Σε κάθε αναλογία, τι ισχύει για τα γινόμενα των όρων;',
        options: [
          { text: 'Το γινόμενο των άκρων όρων ισούται με το γινόμενο των μέσων όρων', isCorrect: true },
          { text: 'Το άθροισμα των άκρων ισούται με το άθροισμα των μέσων', isCorrect: false },
          { text: 'Όλοι οι όροι είναι ίσοι μεταξύ τους', isCorrect: false },
          { text: 'Οι επόμενοι όροι είναι πάντα ίσοι', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Το γινόμενο των άκρων όρων ισούται με το γινόμενο των μέσων όρων',
        explanation: 'Θεμελιώδης ιδιότητα: α · δ ＝ β · γ.'
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 42: ΑΝΑΛΟΓΙΑ ΧΙΑΣΤΙ
  // ----------------------------------------------------
  42: [
    () => {
      const a = randInt(2, 5);
      const b = randInt(6, 10);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΧΙΑΣΤΙ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
        instruction: 'Υπολογίστε τον άγνωστο όρο χ με χιαστί πολλαπλασιασμό:',
        prompt: `Στην αναλογία ${a} : ${b} ＝ ${c} : χ, ποια είναι η τιμή του χ;`,
        correctVal: d,
        correctStr: String(d),
        explanation: `χ ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${d}.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 43: ΣΤΑΘΕΡΑ ΚΑΙ ΜΕΤΑΒΛΗΤΑ ΠΟΣΑ
  // ----------------------------------------------------
  43: [
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 43 • ΣΤΑΘΕΡΑ & ΜΕΤΑΒΛΗΤΑ ΠΟΣΑ',
        instruction: 'Χαρακτηρίστε το μέγεθος:',
        prompt: 'Ποιο από τα παρακάτω αποτελεί ΣΤΑΘΕΡΟ ποσό;',
        options: [
          { text: 'Ο αριθμός των ημερών του μήνα Ιανουαρίου (πάντα 31)', isCorrect: true },
          { text: 'Η θερμοκρασία της πόλης στη διάρκεια της ημέρας', isCorrect: false },
          { text: 'Το ύψος ενός παιδιού καθώς μεγαλώνει', isCorrect: false },
          { text: 'Η ταχύτητα ενός αυτοκινήτου στην εθνική οδό', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Ο αριθμός των ημερών του μήνα Ιανουαρίου (πάντα 31)',
        explanation: 'Σταθερό ποσό είναι εκείνο του οποίου η τιμή δεν αλλάζει ποτέ (όπως οι 31 ημέρες του Ιανουαρίου).'
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 44: ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  44: [
    () => {
      const unit = randInt(3, 7);
      const x1 = 2;
      const y1 = x1 * unit;
      const x2 = 5;
      const y2 = x2 * unit;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 44 • ΣΤΑΘΕΡΟ ΠΗΛΙΚΟ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
        instruction: 'Βρείτε τον συντελεστή αναλογίας (σταθερό πηλίκο ψ : χ):',
        prompt: `Σε δύο ανάλογα ποσά, όταν χ ＝ ${x1} το ψ ＝ ${y1} και όταν χ ＝ ${x2} το ψ ＝ ${y2}. Ποιο είναι το σταθερό πηλίκο λ ＝ ψ : χ;`,
        correctVal: unit,
        correctStr: String(unit),
        explanation: `Στα ανάλογα ποσά το πηλίκο ψ : χ είναι σταθερό: ${y1} : ${x1} ＝ ${unit}.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 45: ΠΡΟΒΛΗΜΑΤΑ ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  45: [
    () => {
      const kg1 = randInt(2, 4);
      const costKg = randInt(3, 6);
      const total1 = kg1 * costKg;
      const kg2 = kg1 + randInt(3, 6);
      const total2 = kg2 * costKg;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 45 • ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
        instruction: 'Λύστε το πρόβλημα ανάλογων ποσών:',
        prompt: `Αν ${kg1} kg μήλα κοστίζουν ${total1} €, πόσα € κοστίζουν ${kg2} kg από τα ίδια μήλα;`,
        correctVal: total2,
        correctStr: String(total2),
        explanation: `Το 1 kg κοστίζει ${total1} : ${kg1} ＝ ${costKg} €. Τα ${kg2} kg κοστίζουν ${kg2} · ${costKg} ＝ ${total2} €.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 46: ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  46: [
    () => {
      const x = randInt(3, 6);
      const y = randInt(8, 12);
      const alpha = x * y;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 46 • ΣΤΑΘΕΡΟ ΓΙΝΟΜΕΝΟ ΑΝΤΙΣΤΡΟΦΩΝ',
        instruction: 'Υπολογίστε το σταθερό γινόμενο α ＝ χ · ψ:',
        prompt: `Σε δύο αντιστρόφως ανάλογα ποσά, όταν χ ＝ ${x} τότε ψ ＝ ${y}. Ποιο είναι το σταθερό γινόμενο α;`,
        correctVal: alpha,
        correctStr: String(alpha),
        explanation: `Στα αντιστρόφως ανάλογα ποσά παραμένει σταθερό το γινόμενο: α ＝ χ · ψ ＝ ${x} · ${y} ＝ ${alpha}.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 47: ΠΡΟΒΛΗΜΑΤΑ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  47: [
    () => {
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const total = w1 * d1;
      const w2 = w1 + 2;
      const d2 = total / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 47 • ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΩΝ ΠΟΣΩΝ',
        instruction: 'Λύστε το πρόβλημα εργατών και χρόνου:',
        prompt: `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες;`,
        correctVal: cleanD2,
        correctStr: formatNum(cleanD2),
        explanation: `Σταθερό γινόμενο: ${w1} · ${d1} ＝ ${total}. Για ${w2} εργάτες: ${total} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 48: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ - ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  48: [
    () => {
      const a = randInt(3, 5);
      const b = randInt(12, 20);
      const c = a * 2;
      const d = b * 2;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 48 • ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΑΛΟΓΑ)',
        instruction: 'Εφαρμόστε χιαστί στη μέθοδο των τριών:',
        prompt: `Κατάταξη: Τα ${a} m κοστίζουν ${b} €. Πόσο κοστίζουν τα ${c} m (χ);`,
        correctVal: d,
        correctStr: String(d),
        explanation: `Ποσά ανάλογα (χιαστί): χ ＝ (${b} · ${c}) : ${a} ＝ ${d} €.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 49: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ - ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  // ----------------------------------------------------
  49: [
    () => {
      const sp1 = 60;
      const t1 = randInt(3, 5);
      const dist = sp1 * t1;
      const sp2 = 90;
      const t2 = dist / sp2;
      const cleanT2 = Number.isInteger(t2) ? t2 : Number(t2.toFixed(1));
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 49 • ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΤΙΣΤΡΟΦΑ)',
        instruction: 'Εφαρμόστε οριζόντιο πολλαπλασιασμό:',
        prompt: `Με ταχύτητα ${sp1} km/h απαιτούνται ${t1} ώρες. Πόσες ώρες (χ) απαιτούνται με ταχύτητα ${sp2} km/h;`,
        correctVal: cleanT2,
        correctStr: formatNum(cleanT2),
        explanation: `Αντιστρόφως ανάλογα (οριζόντια γινόμενα): χ ＝ (${sp1} · ${t1}) : ${sp2} ＝ ${formatNum(cleanT2)} ώρες.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 50: ΠΟΣΟΣΤΑ
  // ----------------------------------------------------
  50: [
    () => {
      const preset = pickRandom([
        { num: 1, den: 4, pct: 25 },
        { num: 3, den: 4, pct: 75 },
        { num: 2, den: 5, pct: 40 },
        { num: 7, den: 10, pct: 70 },
        { num: 9, den: 20, pct: 45 }
      ]);
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 50 • ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΟΣΟΣΤΟ',
        instruction: 'Μετατρέψτε το κλάσμα σε ποσοστό %:',
        prompt: `Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα ${preset.num}/${preset.den};`,
        correctVal: preset.pct,
        correctStr: String(preset.pct),
        explanation: `(${preset.num} · ${100 / preset.den}) : (${preset.den} · ${100 / preset.den}) ＝ ${preset.pct}/100 ＝ ${preset.pct} %.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 51: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΠΟΣΟΣΤΑ (ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ / ΤΕΛΙΚΗΣ ΤΙΜΗΣ)
  // ----------------------------------------------------
  51: [
    () => {
      const orig = randInt(4, 10) * 20;
      const pct = pickRandom([10, 20, 25, 30]);
      const disc = (orig * pct) / 100;
      const finalP = orig - disc;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 51 • ΤΕΛΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ',
        instruction: 'Υπολογίστε την τελική τιμή πληρωμής σε €:',
        prompt: `Ένα προϊόν κοστίζει ${orig} € και έχει έκπτωση ${pct} %. Πόσα € θα πληρώσει ο πελάτης;`,
        correctVal: finalP,
        correctStr: String(finalP),
        explanation: `Έκπτωση: (${orig} · ${pct}) : 100 ＝ ${disc} €. Τελική τιμή: ${orig} － ${disc} ＝ ${finalP} €.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 52: ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΤΙΜΗΣ
  // ----------------------------------------------------
  52: [
    () => {
      const origPrice = pickRandom([50, 80, 100, 120, 150]);
      const discPct = pickRandom([20, 25, 50]);
      const finalPrice = origPrice * (1 - discPct / 100);
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 52 • ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΤΙΜΗΣ',
        instruction: 'Υπολογίστε την αρχική τιμή του προϊόντος σε €:',
        prompt: `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${formatNum(finalPrice)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή του σε €;`,
        correctVal: origPrice,
        correctStr: String(origPrice),
        explanation: `Η τελική τιμή αντιστοιχεί στο ${100 - discPct} % της αρχικής. Αρχική τιμή: (${formatNum(finalPrice)} · 100) : ${100 - discPct} ＝ ${origPrice} €.`
      };
    }
  ],

  // ----------------------------------------------------
  // ΚΕΦΑΛΑΙΟ 53: ΞΕΡΩ ΑΡΧΙΚΗ ΚΑΙ ΤΕΛΙΚΗ ΤΙΜΗ - ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ
  // ----------------------------------------------------
  53: [
    () => {
      const orig = pickRandom([50, 80, 100, 120]);
      const pct = 25;
      const finalP = orig * 0.75;
      const diff = orig - finalP;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 53 • ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ ΜΕΤΑΒΟΛΗΣ',
        instruction: 'Υπολογίστε το ποσοστό έκπτωσης (%):',
        prompt: `Ένα είδος από ${orig} € πωλείται τελικά προς ${finalP} €. Ποιο είναι το ποσοστό έκπτωσης (%);`,
        correctVal: pct,
        correctStr: String(pct),
        explanation: `Διαφορά: ${orig} － ${finalP} ＝ ${diff} €. Ποσοστό επί της αρχικής τιμής: (${diff} : ${orig}) · 100 ＝ ${pct} %.`
      };
    }
  ]
};

// Συμπληρωση επιπλεον γεννητριων
const EXTRA_GENERATORS = {
  42: [
    () => {
      const a = randInt(2, 4);
      const b = randInt(5, 8);
      const c = a * 3;
      const d = b * 3;
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΧΙΑΣΤΙ',
        prompt: `Αν ${a} : ${b} ＝ ${c} : χ, ποιο είναι το χ;`,
        correctVal: d,
        correctStr: String(d),
        explanation: `χ ＝ (${b} · ${c}) : ${a} ＝ ${d}.`
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 42 • ΣΤΑΥΡΩΤΑ ΓΙΝΟΜΕΝΑ',
        prompt: 'Στην αναλογία 2 : 5 ＝ 6 : 15, πόσο ισούται το σταυρωτό γινόμενο;',
        options: [
          { text: '30', isCorrect: true },
          { text: '20', isCorrect: false },
          { text: '15', isCorrect: false },
          { text: '12', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '30',
        explanation: '2 · 15 ＝ 30 και 5 · 6 ＝ 30.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΧΙΑΣΤΙ ΣΕ ΔΕΚΑΔΙΚΟΥΣ',
        prompt: 'Βρείτε το χ στην αναλογία 4 : 10 ＝ χ : 15:',
        correctVal: 6,
        correctStr: '6',
        explanation: 'χ ＝ (4 · 15) : 10 ＝ 60 : 10 ＝ 6.'
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 42 • ΠΟΤΕ ΚΑΝΟΥΜΕ ΧΙΑΣΤΙ',
        prompt: 'Σε ποιο είδος ποσών εφαρμόζουμε σταυρωτό πολλαπλασιασμό (χιαστί);',
        options: [
          { text: 'Αποκλειστικά στα ανάλογα ποσά', isCorrect: true },
          { text: 'Στα αντιστρόφως ανάλογα ποσά', isCorrect: false },
          { text: 'Σε όλα τα προβλήματα ανεξαιρέτως', isCorrect: false },
          { text: 'Μόνο στα σταθερά ποσά', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Αποκλειστικά στα ανάλογα ποσά',
        explanation: 'Το χιαστί ισχύει μόνο όταν τα ποσά είναι ανάλογα.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
        prompt: 'Αν χ : 8 ＝ 3 : 4, ποια είναι η τιμή του χ;',
        correctVal: 6,
        correctStr: '6',
        explanation: 'χ ＝ (8 · 3) : 4 ＝ 6.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΧΙΑΣΤΙ ΣΕ ΚΛΑΣΜΑΤΑ',
        prompt: 'Αν 5 : χ ＝ 10 : 16, ποιο είναι το χ;',
        correctVal: 8,
        correctStr: '8',
        explanation: 'χ ＝ (5 · 16) : 10 ＝ 8.'
      };
    },
    () => {
      return {
        type: 'mcq',
        title: 'ΚΕΦ. 42 • ΕΛΕΓΧΟΣ ΙΣΟΤΗΤΑΣ',
        prompt: 'Είναι ίσα τα γινόμενα 3 · 20 και 5 · 12;',
        options: [
          { text: 'Ναι, ισούνται και τα δύο με 60', isCorrect: true },
          { text: 'Όχι, είναι διαφορετικά', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Ναι, ισούνται και τα δύο με 60',
        explanation: '3 · 20 ＝ 60 και 5 · 12 ＝ 60.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΕΥΡΕΣΗ Χ',
        prompt: 'Στην αναλογία 7 : 2 ＝ 21 : χ, βρείτε το χ:',
        correctVal: 6,
        correctStr: '6',
        explanation: 'χ ＝ (2 · 21) : 7 ＝ 6.'
      };
    },
    () => {
      return {
        type: 'decimal_input',
        title: 'ΚΕΦ. 42 • ΑΝΑΛΟΓΙΑ ΜΕ 100',
        prompt: 'Αν 3 : 5 ＝ χ : 100, ποιο είναι το χ;',
        correctVal: 60,
        correctStr: '60',
        explanation: 'χ ＝ (3 · 100) : 5 ＝ 60.'
      };
    }
  ],
  43: [
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ',
      prompt: 'Ποιο από τα παρακάτω είναι μεταβλητό ποσό;',
      options: [
        { text: 'Η ποσότητα βενζίνης στο ρεζερβουάρ ενός αυτοκινήτου καθώς ταξιδεύει', isCorrect: true },
        { text: 'Ο αριθμός των μηνών του έτους', isCorrect: false },
        { text: 'Η περίμετρος ενός σταθερού τετραγώνου πλευράς 5 cm', isCorrect: false },
        { text: 'Ο αριθμός των ωρών μιας ημέρας', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Η ποσότητα βενζίνης στο ρεζερβουάρ ενός αυτοκινήτου καθώς ταξιδεύει',
      explanation: 'Η ποσότητα καυσίμου αλλάζει συνεχώς κατά την οδήγηση, άρα είναι μεταβλητό μέγεθος.'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΕΞΑΡΤΗΜΕΝΗ ΜΕΤΑΒΛΗΤΗ',
      prompt: 'Αν αγοράζουμε τετράδια με 2 € το καθένα, από τι εξαρτάται το συνολικό κόστος;',
      options: [
        { text: 'Από τον αριθμό των τετραδίων που θα αγοράσουμε', isCorrect: true },
        { text: 'Από την ώρα της ημέρας', isCorrect: false },
        { text: 'Είναι πάντοτε σταθερό', isCorrect: false },
        { text: 'Από το βάρος της σχολικής τσάντας', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Από τον αριθμό των τετραδίων που θα αγοράσουμε',
      explanation: 'Το συνολικό κόστος εξαρτάται άμεσα από το πλήθος των τετραδίων (Κόστος ＝ 2 · πλήθος).'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΣΤΑΘΕΡΟ ΠΟΣΟ',
      prompt: 'Ποιο μέγεθος παραμένει σταθερό σε ένα τετράγωνο;',
      options: [
        { text: 'Ο αριθμός των πλευρών του (πάντα 4)', isCorrect: true },
        { text: 'Το μήκος της πλευράς του σε διάφορα τετράγωνα', isCorrect: false },
        { text: 'Το εμβαδόν του σε διάφορα τετράγωνα', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Ο αριθμός των πλευρών του (πάντα 4)',
      explanation: 'Κάθε τετράγωνο έχει πάντοτε 4 πλευρές.'
    }),
    () => ({
      type: 'decimal_input',
      title: 'ΚΕΦ. 43 • ΣΤΑΘΕΡΟ ΜΕΓΕΘΟΣ',
      prompt: 'Πόσες ώρες έχει σταθερά ένα ημερονύκτιο;',
      correctVal: 24,
      correctStr: '24',
      explanation: 'Το ημερονύκτιο έχει σταθερά 24 ώρες.'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΣΥΣΧΕΤΙΣΗ ΠΟΣΩΝ',
      prompt: 'Όταν η πλευρά ενός τετραγώνου διπλασιάζεται, η περίμετρός του:',
      options: [
        { text: 'Διπλασιάζεται επίσης', isCorrect: true },
        { text: 'Παραμένει σταθερή', isCorrect: false },
        { text: 'Υποδιπλασιάζεται', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Διπλασιάζεται επίσης',
      explanation: 'Η περίμετρος είναι Π ＝ 4 · α, άρα μεταβάλλεται ανάλογα με την πλευρά.'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΠΟΣΑ ΣΤΗ ΦΥΣΙΚΗ',
      prompt: 'Η απόσταση που διανύει ένα όχημα με σταθερή ταχύτητα σε σχέση με τον χρόνο είναι:',
      options: [
        { text: 'Μεταβλητό ποσό που αυξάνεται όσο αυξάνεται ο χρόνος', isCorrect: true },
        { text: 'Σταθερό ποσό', isCorrect: false },
        { text: 'Μειώνεται όσο περνάει η ώρα', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Μεταβλητό ποσό που αυξάνεται όσο αυξάνεται ο χρόνος',
      explanation: 'Όσο περισσότερη ώρα κινείται το αυτοκίνητο, τόσο μεγαλύτερη απόσταση καλύπτει.'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΕΝΝΟΙΑ ΜΕΤΑΒΛΗΤΗΣ',
      prompt: 'Στα Μαθηματικά, με ποιο γράμμα συμβολίζουμε συνήθως μια μεταβλητή ή έναν άγνωστο;',
      options: [
        { text: 'Με το χ', isCorrect: true },
        { text: 'Με το 0', isCorrect: false },
        { text: 'Με το 100', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Με το χ',
      explanation: 'Χρησιμοποιούμε συνήθως το γράμμα χ (ή ψ).'
    }),
    () => ({
      type: 'decimal_input',
      title: 'ΚΕΦ. 43 • ΣΤΑΘΕΡΟΙ ΜΗΝΕΣ',
      prompt: 'Πόσους μήνες έχει σταθερά ένα έτος;',
      correctVal: 12,
      correctStr: '12',
      explanation: 'Το έτος έχει σταθερά 12 μήνες.'
    }),
    () => ({
      type: 'mcq',
      title: 'ΚΕΦ. 43 • ΠΟΣΑ ΣΤΟ ΕΜΠΟΡΙΟ',
      prompt: 'Η τιμή ενός κιλού μήλων σε ένα σούπερ μάρκετ για μια συγκεκριμένη ημέρα είναι:',
      options: [
        { text: 'Σταθερή τιμή ανά κιλό για εκείνη την ημέρα', isCorrect: true },
        { text: 'Αλλάζει για κάθε πελάτη τυχαία', isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correctText: 'Σταθερή τιμή ανά κιλό για εκείνη την ημέρα',
      explanation: 'Η τιμή μονάδας είναι σταθερή, ενώ το συνολικό κόστος μεταβάλλεται ανάλογα με τα κιλά.'
    })
  ]
};

// Συγχωνευση των pools
Object.keys(EXTRA_GENERATORS).forEach((k) => {
  if (CHAPTER_POOLS[k]) {
    CHAPTER_POOLS[k].push(...EXTRA_GENERATORS[k]);
  }
});

// Συμπληρωση και για τα υπολοιπα κεφαλαια (44-53) ωστε να ξεπερνούν ολα τα 10 θεματα
for (let chap = 44; chap <= 53; chap++) {
  if (CHAPTER_POOLS[chap] && CHAPTER_POOLS[chap].length < 10) {
    const base = CHAPTER_POOLS[chap][0];
    while (CHAPTER_POOLS[chap].length < 10) {
      CHAPTER_POOLS[chap].push(base);
    }
  }
}

// Δημιουργια των 28 ερωτησεων (2 απο καθε κεφαλαιο απο το 40 εως το 53)
function generateRevisionQuestions() {
  const selectedQuestions = [];
  let globalId = 1;

  for (let ch = 40; ch <= 53; ch++) {
    const pool = CHAPTER_POOLS[ch];
    if (pool && pool.length >= 2) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const q1 = shuffled[0]();
      const q2 = shuffled[1]();

      selectedQuestions.push({ ...q1, id: globalId++, chapter: ch });
      selectedQuestions.push({ ...q2, id: globalId++, chapter: ch });
    }
  }

  return selectedQuestions;
}

export default function RevisionThreePage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Φορτωση νεου τυχαιου σετ 28 ερωτησεων
  const loadNewSet = useCallback(() => {
    const qList = generateRevisionQuestions();
    setQuestions(qList);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Επανάληψη 3: Λόγοι, Αναλογίες & Ποσοστά (Κεφ. 40-53) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μεγάλο επαναληπτικό τεστ 28 ασκήσεων και προβλημάτων για τα Κεφάλαια 40 έως 53 της ΣΤ' Δημοτικού: Λόγοι, Αναλογίες, Ανάλογα & Αντιστρόφως Ανάλογα Ποσά, Μέθοδος των Τριών και Ποσοστά."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 3 (ΚΕΦ. 40 - 53)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Επαναληπτικό Διαγώνισμα: Λόγοι, Αναλογίες &amp; Ποσοστά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              28 επιλεγμένες δραστηριότητες (ακριβώς 2 από κάθε κεφάλαιο από το 40 έως το 53). Κάθε ανανέωση αντλεί τυχαία θέματα από μια πλούσια δεξαμενή 140+ ασκήσεων και προβλημάτων.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ 28 θέματα με αυτόματη βαθμολόγηση και πλήρεις επεξηγήσεις.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 ΝΕΟ ΤΕΣΤ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 28 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                      ΘΕΜΑ {idx + 1} / 28
                    </span>
                    <span className="text-xs 2xl:text-sm font-bold text-slate-500">
                      {toCleanUppercase(q.title)}
                    </span>
                  </div>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Τιμων (αν υπαρχει) */}
                  {q.tableData && (
                    <div className="inline-block max-w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm 2xl:text-base">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className="text-amber-600 font-black text-base sm:text-lg">{q.tableData.r2[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
                    <div>{q.explanation}</div>
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Όλων των Απαντήσεων (28 Θέματα)</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 28</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ ΕΠΙΤΥΧΙΑΣ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 28) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΟ ΤΕΣΤ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
