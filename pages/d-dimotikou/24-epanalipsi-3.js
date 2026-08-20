import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Βοηθητική συνάρτηση για εγγυημένα 4 μοναδικές επιλογές
function make4UniqueOptions(correct, wrongs) {
  const cleanWrongs = Array.from(new Set(wrongs)).filter(w => w !== correct);
  const selectedWrongs = cleanWrongs.slice(0, 3);
  
  while (selectedWrongs.length < 3) {
    const dummy = `${getRandomInt(10, 999)}`;
    if (dummy !== correct && !selectedWrongs.includes(dummy)) {
      selectedWrongs.push(dummy);
    }
  }

  const options = [correct, ...selectedWrongs];
  return options.sort(() => Math.random() - 0.5);
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 60+ ΔΥΝΑΜΙΚΩΝ ΘΕΜΑΤΩΝ ΘΕΩΡΙΑΣ (Δ' ΔΗΜΟΤΙΚΟΥ)
// ----------------------------------------------------
const THEORY_QUESTIONS_POOL = [
  // ==========================================
  // 1. ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ ΕΩΣ 1.000.000 (1 - 16)
  // ==========================================
  () => ({
    q: 'Στο δεκαδικό σύστημα αρίθμησης, από τι εξαρτάται η αξία ενός ψηφίου μέσα σε έναν αριθμό;',
    correct: 'Από τη θέση που κατέχει στον αριθμό',
    wrongs: ['Από το πόσο μεγάλο είναι το ψηφίο', 'Από το αν ο αριθμός είναι άρτιος ή περιττός', 'Είναι πάντα η ίδια'],
    explain: 'Η αξία κάθε ψηφίου καθορίζεται από τη θέση του (Μονάδες, Δεκάδες, Εκατοντάδες κ.λπ.).'
  }),
  () => ({
    q: 'Σε πόσα ψηφία χωρίζουμε έναν μεγάλο αριθμό για να διακρίνουμε τις κλάσεις του;',
    correct: 'Σε ομάδες των 3 ψηφίων από δεξιά προς τα αριστερά',
    wrongs: ['Σε ομάδες των 2 ψηφίων από αριστερά', 'Σε ομάδες των 4 ψηφίων από δεξιά', 'Σε ομάδες των 3 ψηφίων από αριστερά'],
    explain: 'Χωρίζουμε τα ψηφία ανά τρία ξεκινώντας πάντα από τα δεξιά (Μονάδες, Δεκάδες, Εκατοντάδες).'
  }),
  () => {
    const ex = getRandomInt(2, 9);
    return {
      q: `Πόσες μονάδες αξίζει το ψηφίο ${ex} όταν βρίσκεται στη θέση των Εκατοντάδων Χιλιάδων (ΕΧ);`,
      correct: `${formatNumber(ex * 100000)}`,
      wrongs: [`${formatNumber(ex * 10000)}`, `${formatNumber(ex * 1000)}`, `${formatNumber(ex * 100)}`],
      explain: `Στις Εκατοντάδες Χιλιάδες, το ψηφίο ${ex} έχει αξία ${ex} × 100.000 = ${formatNumber(ex * 100000)}.`
    };
  },
  () => {
    const dx = getRandomInt(2, 9);
    return {
      q: `Πόσες μονάδες αξίζει το ψηφίο ${dx} όταν βρίσκεται στη θέση των Δεκάδων Χιλιάδων (ΔΧ);`,
      correct: `${formatNumber(dx * 10000)}`,
      wrongs: [`${formatNumber(dx * 100000)}`, `${formatNumber(dx * 1000)}`, `${formatNumber(dx * 100)}`],
      explain: `Στις Δεκάδες Χιλιάδες, το ψηφίο ${dx} έχει αξία ${dx} × 10.000 = ${formatNumber(dx * 10000)}.`
    };
  },
  () => ({
    q: 'Ποιος είναι ο αμέσως επόμενος αριθμός του 999.999;',
    correct: '1.000.000 (1 εκατομμύριο)',
    wrongs: ['100.000', '1.000.001', '999.998'],
    explain: '999.999 + 1 = 1.000.000.'
  }),
  () => ({
    q: 'Ποιος είναι ο αμέσως προηγούμενος αριθμός του 500.000;',
    correct: '499.999',
    wrongs: ['499.990', '490.000', '500.001'],
    explain: '500.000 - 1 = 499.999.'
  }),
  () => ({
    q: 'Πόσες Δεκάδες Χιλιάδες χρειάζονται για να φτιάξουμε 1 Εκατοντάδα Χιλιάδων (100.000);',
    correct: '10 Δεκάδες Χιλιάδες',
    wrongs: ['100 Δεκάδες Χιλιάδες', '1.000 Δεκάδες Χιλιάδες', '5 Δεκάδες Χιλιάδες'],
    explain: '10 × 10.000 = 100.000.'
  }),
  () => ({
    q: 'Πόσες Εκατοντάδες Χιλιάδες χρειάζονται για να φτιάξουμε 1 Εκατομμύριο (1.000.000);',
    correct: '10 Εκατοντάδες Χιλιάδες',
    wrongs: ['100 Εκατοντάδες Χιλιάδες', '1.000 Εκατοντάδες Χιλιάδες', '20 Εκατοντάδες Χιλιάδες'],
    explain: '10 × 100.000 = 1.000.000.'
  }),
  () => {
    const a = getRandomInt(300, 800) * 1000;
    const b = a + getRandomInt(10, 90) * 10;
    return {
      q: `Ποια είναι η σωστή σύγκριση ανάμεσα στους αριθμούς ${formatNumber(a)} και ${formatNumber(b)};`,
      correct: `${formatNumber(a)} < ${formatNumber(b)}`,
      wrongs: [`${formatNumber(a)} > ${formatNumber(b)}`, `${formatNumber(a)} = ${formatNumber(b)}`, `${formatNumber(b)} < ${formatNumber(a)}`],
      explain: `Ο αριθμός ${formatNumber(a)} είναι μικρότερος από τον ${formatNumber(b)}.`
    };
  },
  () => ({
    q: 'Στον αριθμό 704.050, ποιο ψηφίο βρίσκεται στη θέση των Μονάδων Χιλιάδων (Χ);',
    correct: 'Το 4',
    wrongs: ['Το 7', 'Το 0', 'Το 5'],
    explain: 'Στον 704.050: 7=ΕΧ, 0=ΔΧ, 4=Χ, 0=Ε, 5=Δ, 0=Μ.'
  }),
  () => ({
    q: 'Ποιος είναι ο μικρότερος εξαψήφιος αριθμός που μπορούμε να γράψουμε;',
    correct: '100.000',
    wrongs: ['100.001', '111.111', '999.999'],
    explain: 'Ο μικρότερος 6ψήφιος αριθμός είναι το 100.000.'
  }),
  () => ({
    q: 'Ποιος είναι ο μεγαλύτερος εξαψήφιος αριθμός;',
    correct: '999.999',
    wrongs: ['1.000.000', '900.000', '999.000'],
    explain: 'Ο μεγαλύτερος 6ψήφιος αριθμός είναι το 999.999.'
  }),
  () => {
    const ex = getRandomInt(2, 8);
    const dx = getRandomInt(1, 9);
    const total = ex * 100000 + dx * 10000;
    return {
      q: `Ποιος αριθμός έχει ${ex} Εκατοντάδες Χιλιάδες και ${dx} Δεκάδες Χιλιάδες (και όλα τα άλλα ψηφία 0);`,
      correct: `${formatNumber(total)}`,
      wrongs: [`${formatNumber(ex * 10000 + dx * 1000)}`, `${formatNumber(ex * 100000 + dx * 1000)}`, `${formatNumber(ex * 100000 + dx * 100)}`],
      explain: `${ex} ΕΧ + ${dx} ΔΧ = ${formatNumber(total)}.`
    };
  },
  () => ({
    q: 'Πώς διαβάζεται ο αριθμός 405.008;',
    correct: 'Τετρακόσιες πέντε χιλιάδες οκτώ',
    wrongs: ['Τετρακόσιες πενήντα χιλιάδες οκτώ', 'Τεσσεράμισι χιλιάδες οκτώ', 'Τετρακόσιες πέντε χιλιάδες ογδόντα'],
    explain: '405 χιλιάδες και 8 μονάδες.'
  }),
  () => ({
    q: 'Όταν συγκρίνουμε δύο αριθμούς με το ίδιο πλήθος ψηφίων, από ποιο ψηφίο ξεκινάμε τη σύγκριση;',
    correct: 'Από το πρώτο ψηφίο αριστερά (με τη μεγαλύτερη αξία θέσης)',
    wrongs: ['Από το τελευταίο ψηφίο δεξιά (τις μονάδες)', 'Από το μεσαίο ψηφίο', 'Δεν έχει σημασία'],
    explain: 'Ξεκινάμε πάντα από τα αριστερά προς τα δεξιά.'
  }),
  () => ({
    q: 'Πόσες μονάδες έχει ο αριθμός 250 εκατοντάδες;',
    correct: '25.000 μονάδες',
    wrongs: ['2.500 μονάδες', '250.000 μονάδες', '250 μονάδες'],
    explain: '250 × 100 = 25.000.'
  }),

  // ==========================================
  // 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ 3ΨΗΦΙΩΝ (17 - 32)
  // ==========================================
  () => ({
    q: 'Στον κάθετο πολλαπλασιασμό με τριψήφιο αριθμό (π.χ. 345 × 124), πόσα μερικά γινόμενα σχηματίζονται;',
    correct: '3 μερικά γινόμενα',
    wrongs: ['2 μερικά γινόμενα', '4 μερικά γινόμενα', '1 μερικό γινόμενο'],
    explain: 'Ένα για τις μονάδες, ένα για τις δεκάδες κι ένα για τις εκατοντάδες του πολλαπλασιαστή.'
  }),
  () => ({
    q: 'Όταν υπολογίζουμε το 2ο μερικό γινόμενο (πολλαπλασιασμός με τις Δεκάδες), τι βάζουμε στο τέλος δεξιά;',
    correct: 'Ένα μηδενικό (0) ή αφήνουμε 1 θέση κενό',
    wrongs: ['Δύο μηδενικά (00)', 'Τρία μηδενικά (000)', 'Δεν βάζουμε τίποτα'],
    explain: 'Επειδή πολλαπλασιάζουμε με δεκάδες (×10), τοποθετούμε 1 μηδενικό (0).'
  }),
  () => ({
    q: 'Όταν υπολογίζουμε το 3ο μερικό γινόμενο (πολλαπλασιασμός με τις Εκατοντάδες), τι βάζουμε στο τέλος δεξιά;',
    correct: 'Δύο μηδενικά (00) ή αφήνουμε 2 θέσεις κενό',
    wrongs: ['Ένα μηδενικό (0)', 'Τρία μηδενικά (000)', 'Κανένα μηδενικό'],
    explain: 'Επειδή πολλαπλασιάζουμε με εκατοντάδες (×100), τοποθετούμε 2 μηδενικά (00).'
  }),
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Πόσο κάνει ${a} × 100;`,
      correct: `${formatNumber(a * 100)}`,
      wrongs: [`${formatNumber(a * 10)}`, `${formatNumber(a * 1000)}`, `${a + 100}`],
      explain: `Για να πολλαπλασιάσουμε με το 100, προσθέτουμε 2 μηδενικά στο τέλος: ${a * 100}.`
    };
  },
  () => {
    const a = getRandomInt(12, 95);
    return {
      q: `Πόσο κάνει ${a} × 1.000;`,
      correct: `${formatNumber(a * 1000)}`,
      wrongs: [`${formatNumber(a * 100)}`, `${formatNumber(a * 10000)}`, `${a + 1000}`],
      explain: `Για να πολλαπλασιάσουμε με το 1.000, προσθέτουμε 3 μηδενικά στο τέλος: ${formatNumber(a * 1000)}.`
    };
  },
  () => ({
    q: 'Ποια είναι η αντιμεταθετική ιδιότητα του πολλαπλασιασμού;',
    correct: 'α × β = β × α (η σειρά των παραγόντων δεν αλλάζει το αποτέλεσμα)',
    wrongs: ['α + β = β + α', 'α × 1 = α', 'α × 0 = 0'],
    explain: 'Στον πολλαπλασιασμό μπορούμε να αλλάξουμε τη σειρά των παραγόντων.'
  }),
  () => ({
    q: 'Όταν πολλαπλασιάζουμε οποιονδήποτε αριθμό με το 0, το αποτέλεσμα είναι:',
    correct: 'Πάντα 0',
    wrongs: ['Ο ίδιος ο αριθμός', '1', '100'],
    explain: 'Το μηδέν (0) μηδενίζει το γινόμενο: α × 0 = 0.'
  }),
  () => ({
    q: 'Όταν πολλαπλασιάζουμε οποιονδήποτε αριθμό με το 1, το αποτέλεσμα είναι:',
    correct: 'Ο ίδιος ο αριθμός',
    wrongs: ['0', '1', 'Ο επόμενος αριθμός'],
    explain: 'Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού: α × 1 = α.'
  }),
  () => {
    const a = getRandomInt(120, 350);
    const u = getRandomInt(2, 5);
    return {
      q: `Στον πολλαπλασιασμό ${a} × ${u}00, ποιο είναι το σωστό αποτέλεσμα;`,
      correct: `${formatNumber(a * u * 100)}`,
      wrongs: [`${formatNumber(a * u * 10)}`, `${formatNumber(a * u * 1000)}`, `${formatNumber(a * u)}`],
      explain: `Πολλαπλασιάζουμε ${a} × ${u} = ${a * u} και προσθέτουμε 2 μηδενικά: ${formatNumber(a * u * 100)}.`
    };
  },
  () => {
    const a = getRandomInt(15, 45);
    return {
      q: `Αν γνωρίζουμε ότι ${a} × 4 = ${a * 4}, πόσο κάνει ${a} × 400;`,
      correct: `${formatNumber(a * 400)}`,
      wrongs: [`${formatNumber(a * 40)}`, `${formatNumber(a * 4000)}`, `${a * 4 + 400}`],
      explain: `${a} × 400 = (${a} × 4) × 100 = ${a * 4} × 100 = ${formatNumber(a * 400)}.`
    };
  },
  () => ({
    q: 'Ποιοι είναι οι όροι της πράξης του πολλαπλασιασμού;',
    correct: 'Πολλαπλασιαστέος, Πολλαπλασιαστής και Γινόμενο',
    wrongs: ['Διαιρετέος, Διαιρέτης και Πηλίκο', 'Προσθετέος, Προσθετέος και Άθροισμα', 'Μειωτέος, Αφαιρετέος και Διαφορά'],
    explain: 'Οι δύο αριθμοί λέγονται παράγοντες (πολλαπλασιαστέος και πολλαπλασιαστής) και το αποτέλεσμα γινόμενο.'
  }),
  () => ({
    q: 'Πώς υπολογίζουμε το τελικό γινόμενο σε έναν κάθετο πολλαπλασιασμό;',
    correct: 'Προσθέτουμε όλα τα μερικά γινόμενα',
    wrongs: ['Πολλαπλασιάζουμε τα μερικά γινόμενα', 'Αφαιρούμε τα μερικά γινόμενα', 'Κρατάμε μόνο το τελευταίο μερικό γινόμενο'],
    explain: 'Το τελικό αποτέλεσμα προκύπτει από την πρόσθεση των μερικών γινομένων.'
  }),
  () => {
    const a = getRandomInt(2, 9);
    const b = getRandomInt(2, 5);
    const c = getRandomInt(2, 5);
    return {
      q: `Πόσο κάνει (${a} × ${b}) × ${c};`,
      correct: `${a * b * c}`,
      wrongs: [`${a * b + c}`, `${a + b * c}`, `${(a + b) * c}`],
      explain: `(${a} × ${b}) × ${c} = ${a * b} × ${c} = ${a * b * c} (προσεταιριστική ιδιότητα).`
    };
  },
  () => ({
    q: 'Αν διπλασιάσουμε τον έναν παράγοντα ενός πολλαπλασιασμού, τι θα συμβεί στο γινόμενο;',
    correct: 'Το γινόμενο θα διπλασιαστεί',
    wrongs: ['Το γινόμενο θα μείνει ίδιο', 'Το γινόμενο θα τετραπλασιαστεί', 'Το γινόμενο θα υποδιπλασιαστεί'],
    explain: 'Αν διπλασιάσουμε έναν παράγοντα, το τελικό αποτέλεσμα διπλασιάζεται.'
  }),
  () => {
    const n = getRandomInt(12, 45);
    return {
      q: `Ποιο είναι το αποτέλεσμα του πολλαπλασιασμού ${n} × 20;`,
      correct: `${n * 20}`,
      wrongs: [`${n * 2}`, `${n * 200}`, `${n + 20}`],
      explain: `${n} × 20 = (${n} × 2) × 10 = ${n * 2} × 10 = ${n * 20}.`
    };
  },
  () => ({
    q: 'Ποια πράξη είναι η αντίστροφη του πολλαπλασιασμού;',
    correct: 'Η Διαίρεση',
    wrongs: ['Η Πρόσθεση', 'Η Αφαίρεση', 'Ο Συμψηφισμός'],
    explain: 'Η διαίρεση είναι η αντίστροφη πράξη του πολλαπλασιασμού.'
  }),

  // ==========================================
  // 3. ΔΙΑΙΡΕΣΗ ΜΕ ΔΙΨΗΦΙΟ ΔΙΑΙΡΕΤΗ (33 - 48)
  // ==========================================
  () => ({
    q: 'Σε κάθε ακέραια διαίρεση, ποια σχέση ισχύει ΠΑΝΤΑ ανάμεσα στο υπόλοιπο (υ) και στον διαιρέτη (δ);',
    correct: 'Το υπόλοιπο είναι πάντα μικρότερο από τον διαιρέτη (υ < δ)',
    wrongs: ['Το υπόλοιπο είναι πάντα μεγαλύτερο από τον διαιρέτη (υ > δ)', 'Το υπόλοιπο είναι ίσο με τον διαιρέτη (υ = δ)', 'Δεν υπάρχει κανόνας'],
    explain: 'Το υπόλοιπο πρέπει υποχρεωτικά να είναι αυστηρά μικρότερο από τον διαιρέτη (υ < δ).'
  }),
  () => ({
    q: 'Πότε μια διαίρεση ονομάζεται Τέλεια;',
    correct: 'Όταν το υπόλοιπό της είναι ίσο με μηδέν (υ = 0)',
    wrongs: ['Όταν το πηλίκο είναι ίσο με 0', 'Όταν ο διαιρέτης είναι μονοψήφιος', 'Όταν το υπόλοιπο είναι 1'],
    explain: 'Τέλεια λέγεται η διαίρεση στην οποία δεν περισσεύει τίποτα (υ = 0).'
  }),
  () => ({
    q: 'Πότε μια διαίρεση ονομάζεται Ατελής;',
    correct: 'Όταν το υπόλοιπό της είναι μεγαλύτερο από μηδέν (υ > 0)',
    wrongs: ['Όταν το υπόλοιπό της είναι 0', 'Όταν το πηλίκο είναι 0', 'Όταν δεν μπορούμε να τη λύσουμε'],
    explain: 'Ατελής λέγεται η διαίρεση όταν έχουμε υπόλοιπο μεγαλύτερο του μηδενός (υ > 0).'
  }),
  () => ({
    q: 'Ποιος είναι ο μαθηματικός τύπος της επαλήθευσης της διαίρεσης;',
    correct: 'Διαιρετέος = (Διαιρέτης × Πηλίκο) + Υπόλοιπο',
    wrongs: ['Διαιρετέος = (Διαιρέτης + Πηλίκο) × Υπόλοιπο', 'Διαιρέτης = (Διαιρετέος × Πηλίκο) + Υπόλοιπο', 'Πηλίκο = Διαιρετέος + Διαιρέτης'],
    explain: 'Δ = (δ × π) + υ.'
  }),
  () => {
    const d = getRandomInt(12, 35);
    const q = getRandomInt(10, 30);
    const r = getRandomInt(1, d - 1);
    const D = d * q + r;
    return {
      q: `Σε μια διαίρεση ο διαιρέτης είναι δ = ${d}, το πηλίκο π = ${q} και το υπόλοιπο υ = ${r}. Πόσος είναι ο Διαιρετέος (Δ);`,
      correct: `${formatNumber(D)}`,
      wrongs: [`${formatNumber(d * q)}`, `${formatNumber(D + 10)}`, `${formatNumber(d + q + r)}`],
      explain: `Δ = (δ × π) + υ = (${d} × ${q}) + ${r} = ${d * q} + ${r} = ${formatNumber(D)}.`
    };
  },
  () => {
    const d = getRandomInt(15, 60);
    return {
      q: `Αν ο διαιρέτης μιας διαίρεσης είναι δ = ${d}, ποιο είναι το ΜΕΓΑΛΥΤΕΡΟ δυνατό υπόλοιπο που μπορεί να έχει;`,
      correct: `${d - 1}`,
      wrongs: [`${d}`, `${d + 1}`, '0'],
      explain: `Το υπόλοιπο είναι πάντα μικρότερο από τον διαιρέτη, άρα το μέγιστο δυνατό είναι δ - 1 = ${d - 1}.`
    };
  },
  () => ({
    q: 'Ποια πράξη ΔΕΝ επιτρέπεται ποτέ στα μαθηματικά;',
    correct: 'Η διαίρεση με το μηδέν (διαίρεση διά 0)',
    wrongs: ['Ο πολλαπλασιασμός με το μηδέν', 'Η αφαίρεση με το μηδέν', 'Η πρόσθεση με το μηδέν'],
    explain: 'Δεν μπορούμε ποτέ να διαιρέσουμε έναν αριθμό με το μηδέν (0).'
  }),
  () => ({
    q: 'Όταν διαιρούμε το 0 με οποιονδήποτε μη μηδενικό αριθμό (π.χ. 0 : 25), το αποτέλεσμα είναι:',
    correct: '0',
    wrongs: ['25', '1', 'Δεν γίνεται'],
    explain: '0 μοιρασμένο σε οσαδήποτε μέρη δίνει 0.'
  }),
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Πόσο κάνει ${a * 100} : 100;`,
      correct: `${a}`,
      wrongs: [`${a * 10}`, `${a * 100}`, '0'],
      explain: `Όταν διαιρούμε με το 100, αφαιρούμε 2 μηδενικά από το τέλος: ${a}.`
    };
  },
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Πόσο κάνει ${a * 10} : 10;`,
      correct: `${a}`,
      wrongs: [`${a * 10}`, `${a * 100}`, '1'],
      explain: `Όταν διαιρούμε με το 10, αφαιρούμε 1 μηδενικό από το τέλος: ${a}.`
    };
  },
  () => ({
    q: 'Όταν διαιρούμε έναν αριθμό με τον εαυτό του (π.χ. 45 : 45), το πηλίκο είναι:',
    correct: '1',
    wrongs: ['0', '45', '2'],
    explain: 'Κάθε αριθμός χωράει στον εαυτό του ακριβώς 1 φορά.'
  }),
  () => ({
    q: 'Όταν διαιρούμε έναν αριθμό με το 1 (π.χ. 84 : 1), το πηλίκο είναι:',
    correct: 'Ο ίδιος ο αριθμός (84)',
    wrongs: ['1', '0', '85'],
    explain: 'Κάθε αριθμός διαιρούμενος με το 1 παραμένει ο ίδιος.'
  }),
  () => {
    const d = getRandomInt(11, 25);
    const q = getRandomInt(10, 20);
    const D = d * q;
    return {
      q: `Πόσο είναι το πηλίκο της τέλειας διαίρεσης ${D} : ${d};`,
      correct: `${q}`,
      wrongs: [`${q + 2}`, `${q - 2}`, `${q + 5}`],
      explain: `${D} : ${d} = ${q} (αφού ${d} × ${q} = ${D}).`
    };
  },
  () => ({
    q: 'Στην κάθετη διαίρεση με διψήφιο διαιρέτη, πόσα ψηφία χωρίζουμε αρχικά από τα αριστερά του διαιρετέου;',
    correct: 'Τουλάχιστον 2 ψηφία (όσα έχει ο διαιρέτης)',
    wrongs: ['Πάντα 1 ψηφίο', 'Πάντα 3 ψηφία', 'Όλα τα ψηφία μαζί'],
    explain: 'Χωρίζουμε αρχικά 2 ψηφία, κι αν δεν χωράει ο διαιρέτης, χωρίζουμε 3.'
  }),
  () => {
    const d = getRandomInt(15, 45);
    return {
      q: `Αν σε μια διαίρεση βρούμε υπόλοιπο υ = ${d + 2} με διαιρέτη δ = ${d}, τι σημαίνει αυτό;`,
      correct: 'Έχουμε κάνει λάθος, γιατί το υπόλοιπο δεν μπορεί να είναι μεγαλύτερο από τον διαιρέτη',
      wrongs: ['Η διαίρεση είναι σωστή', 'Η διαίρεση είναι τέλεια', 'Το πηλίκο είναι 0'],
      explain: 'Το υπόλοιπο πρέπει υποχρεωτικά να είναι μικρότερο από τον διαιρέτη (υ < δ).'
    };
  },
  () => ({
    q: 'Τι εκφράζει το Πηλίκο (π) σε μια διαίρεση;',
    correct: 'Πόσες φορές χωράει ο διαιρέτης μέσα στον διαιρετέο',
    wrongs: ['Πόσα περισσεύουν', 'Τον αριθμό που μοιράζουμε', 'Το άθροισμα των αριθμών'],
    explain: 'Το πηλίκο δείχνει το αποτέλεσμα της διαίρεσης (πόσες φορές χωράει ο διαιρέτης).'
  }),

  // ==========================================
  // 4. ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ (49 - 64)
  // ==========================================
  () => ({
    q: 'Ποιο είναι το 1ο ΒΗΜΑ στη μέθοδο της Αναγωγής στη Μονάδα;',
    correct: 'Κάνουμε Διαίρεση ( : ) για να βρούμε την τιμή/ποσότητα του 1 πράγματος',
    wrongs: ['Κάνουμε Πολλαπλασιασμό για να βρούμε τα πολλά', 'Κάνουμε Πρόσθεση των ποσοτήτων', 'Κάνουμε Αφαίρεση'],
    explain: 'Στο 1ο βήμα διαιρούμε το συνολικό κόστος με το πλήθος για να βρούμε το 1.'
  }),
  () => ({
    q: 'Ποιο είναι το 2ο ΒΗΜΑ στη μέθοδο της Αναγωγής στη Μονάδα;',
    correct: 'Κάνουμε Πολλαπλασιασμό ( × ) της τιμής του 1 με το νέο πλήθος',
    wrongs: ['Κάνουμε Διαίρεση με το νέο πλήθος', 'Κάνουμε Αφαίρεση του κόστους', 'Προσθέτουμε 10'],
    explain: 'Στο 2ο βήμα πολλαπλασιάζουμε την τιμή της μονάδας με το ζητούμενο πλήθος.'
  }),
  () => {
    const q1 = getRandomInt(3, 6);
    const uCost = getRandomInt(2, 5);
    const total1 = q1 * uCost;
    return {
      q: `Αν τα ${q1} τετράδια κοστίζουν ${total1} €, πόσο κοστίζει το 1 τετράδιο;`,
      correct: `${uCost} €`,
      wrongs: [`${uCost + 1} €`, `${uCost + 2} €`, `${total1} €`],
      explain: `1ο Βήμα: ${total1} : ${q1} = ${uCost} € το 1 τετράδιο.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(2, 5);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(5, 8);
    const total2 = q2 * uCost;
    return {
      q: `Αν οι ${q1} σοκολάτες κοστίζουν ${total1} €, πόσο κοστίζουν οι ${q2} σοκολάτες;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + uCost} €`, `${total2 - uCost} €`, `${total1 * q2} €`],
      explain: `1ο βήμα: ${total1} : ${q1} = ${uCost} € η μία. 2ο βήμα: ${q2} × ${uCost} = ${total2} €.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(3, 6);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(5, 7);
    const total2 = q2 * uCost;
    return {
      q: `Αν τα ${q1} βιβλία κοστίζουν ${total1} €, πόσο κοστίζουν τα ${q2} βιβλία;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + uCost} €`, `${total2 - uCost} €`, `${total1 + total2} €`],
      explain: `1ο βήμα: ${total1} : ${q1} = ${uCost} € το ένα. 2ο βήμα: ${q2} × ${uCost} = ${total2} €.`
    };
  },
  () => {
    const q1 = getRandomInt(3, 5);
    const uCost = getRandomInt(2, 4);
    const total1 = q1 * uCost;
    const targetCost = getRandomInt(6, 10) * uCost;
    const targetQty = targetCost / uCost;
    return {
      q: `Αν οι ${q1} χυμοί κοστίζουν ${total1} €, πόσους χυμούς μπορούμε να αγοράσουμε με ${targetCost} €;`,
      correct: `${targetQty} χυμούς`,
      wrongs: [`${targetQty + 1} χυμούς`, `${targetQty - 1} χυμούς`, `${targetQty + 2} χυμούς`],
      explain: `Ο 1 χυμός κοστίζει ${total1} : ${q1} = ${uCost} €. Με ${targetCost} € αγοράζουμε ${targetCost} : ${uCost} = ${targetQty} χυμούς.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(4, 8);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(5, 8);
    const total2 = q2 * uCost;
    return {
      q: `Αν οι ${q1} μπάλες κοστίζουν ${total1} €, πόσο κοστίζουν οι ${q2} μπάλες;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + 5} €`, `${total2 - 5} €`, `${total1 * 2} €`],
      explain: `1 μπάλα = ${total1} : ${q1} = ${uCost} €. ${q2} μπάλες = ${q2} × ${uCost} = ${total2} €.`
    };
  },
  () => {
    const q1 = getRandomInt(3, 6);
    const uCost = getRandomInt(2, 4);
    const total1 = q1 * uCost;
    return {
      q: `Αν τα ${q1} παγωτά κοστίζουν ${total1} €, ποια πράξη θα κάνουμε για να βρούμε πόσο κοστίζει το 1 παγωτό;`,
      correct: `${total1} : ${q1}`,
      wrongs: [`${total1} × ${q1}`, `${total1} + ${q1}`, `${total1} - ${q1}`],
      explain: `Κάνουμε διαίρεση: ${total1} : ${q1} = ${uCost} €.`
    };
  },
  () => {
    const speed = getRandomInt(60, 90);
    const hours = getRandomInt(2, 4);
    const dist = speed * hours;
    const newHours = hours + getRandomInt(2, 3);
    const newDist = speed * newHours;
    return {
      q: `Ένα αυτοκίνητο διανύει ${dist} χιλιόμετρα σε ${hours} ώρες. Πόσα χιλιόμετρα θα διανύσει σε ${newHours} ώρες με την ίδια ταχύτητα;`,
      correct: `${newDist} χιλιόμετρα`,
      wrongs: [`${newDist + speed} χιλιόμετρα`, `${newDist - speed} χιλιόμετρα`, `${dist * 2} χιλιόμετρα`],
      explain: `Σε 1 ώρα διανύει ${dist} : ${hours} = ${speed} km. Σε ${newHours} ώρες: ${newHours} × ${speed} = ${newDist} km.`
    };
  },
  () => {
    const rate = getRandomInt(15, 30);
    const days1 = getRandomInt(2, 4);
    const pages1 = rate * days1;
    const days2 = days1 + getRandomInt(2, 4);
    const pages2 = rate * days2;
    return {
      q: `Ο Νίκος διαβάζει ${pages1} σελίδες σε ${days1} ημέρες. Πόσες σελίδες θα διαβάσει σε ${days2} ημέρες με τον ίδιο ρυθμό;`,
      correct: `${pages2} σελίδες`,
      wrongs: [`${pages2 + 10} σελίδες`, `${pages2 - 10} σελίδες`, `${pages1 * 2} σελίδες`],
      explain: `Σε 1 ημέρα διαβάζει ${pages1} : ${days1} = ${rate} σελίδες. Σε ${days2} ημέρες: ${days2} × ${rate} = ${pages2} σελίδες.`
    };
  },
  () => ({
    q: 'Σε ποια προβλήματα χρησιμοποιούμε τη μέθοδο της Αναγωγής στη Μονάδα;',
    correct: 'Σε προβλήματα όπου γνωρίζουμε την τιμή/ποσότητα των πολλών και ψάχνουμε μια άλλη ποσότητα',
    wrongs: ['Μόνο σε γεωμετρικά προβλήματα', 'Μόνο όταν έχουμε κλάσματα', 'Σε προβλήματα που έχουν μόνο πρόσθεση'],
    explain: 'Χρησιμοποιείται όταν περνάμε από τα πολλά στο ένα (μονάδα) και μετά στα άλλα πολλά.'
  }),
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(3, 6);
    const total1 = q1 * uCost;
    return {
      q: `Αν τα ${q1} σάντουιτς κοστίζουν ${total1} €, πόσο κοστίζει το 1 σάντουιτς;`,
      correct: `${uCost} €`,
      wrongs: [`${uCost + 1} €`, `${uCost + 2} €`, `${total1} €`],
      explain: `Διαιρούμε ${total1} : ${q1} = ${uCost} €.`
    };
  },
  () => {
    const q1 = getRandomInt(3, 5);
    const uCost = getRandomInt(4, 7);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(6, 8);
    const total2 = q2 * uCost;
    return {
      q: `Αν τα ${q1} πακέτα μαρκαδόροι κοστίζουν ${total1} €, πόσο κοστίζουν τα ${q2} πακέτα;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + uCost} €`, `${total2 - uCost} €`, `${total1 * 2} €`],
      explain: `Το 1 πακέτο = ${total1} : ${q1} = ${uCost} €. Τα ${q2} πακέτα = ${q2} × ${uCost} = ${total2} €.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(2, 5);
    const total1 = q1 * uCost;
    const targetCost = getRandomInt(6, 9) * uCost;
    const targetQty = targetCost / uCost;
    return {
      q: `Αν οι ${q1} τυρόπιτες κοστίζουν ${total1} €, πόσες τυρόπιτες μπορούμε να αγοράσουμε με ${targetCost} €;`,
      correct: `${targetQty} τυρόπιτες`,
      wrongs: [`${targetQty + 1} τυρόπιτες`, `${targetQty - 1} τυρόπιτες`, `${targetQty + 2} τυρόπιτες`],
      explain: `Η 1 τυρόπιτα = ${total1} : ${q1} = ${uCost} €. Με ${targetCost} € αγοράζουμε ${targetCost} : ${uCost} = ${targetQty} τυρόπιτες.`
    };
  },
  () => {
    const q1 = getRandomInt(4, 6);
    const uCost = getRandomInt(3, 5);
    const total1 = q1 * uCost;
    const q2 = 10;
    const total2 = q2 * uCost;
    return {
      q: `Αν τα ${q1} εισιτήρια κοστίζουν ${total1} €, πόσο κοστίζουν τα 10 εισιτήρια;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + 10} €`, `${total2 - 10} €`, `${total1 * 2} €`],
      explain: `Το 1 εισιτήριο = ${total1} : ${q1} = ${uCost} €. Τα 10 εισιτήρια = 10 × ${uCost} = ${total2} €.`
    };
  },
  () => ({
    q: 'Γιατί ονομάζεται η μέθοδος «Αναγωγή στη Μονάδα»;',
    correct: 'Επειδή ως ενδιάμεσο βήμα βρίσκουμε πάντα την τιμή του ενός (της μονάδας)',
    wrongs: ['Επειδή προσθέτουμε πάντα το 1', 'Επειδή αφαιρούμε τη μονάδα', 'Επειδή πολλαπλασιάζουμε με το 1'],
    explain: 'Ονομάζεται έτσι γιατί «ανάγουμε» (οδηγούμε) το πρόβλημα στη μονάδα (στο 1).'
  })
];

// ----------------------------------------------------
// GENERATOR 15 ΤΥΧΑΙΩΝ ΕΡΩΤΗΣΕΩΝ ΜΕ 4 UNIQUE OPTIONS
// ----------------------------------------------------
function generateRandomExam() {
  const shuffled = [...THEORY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((fn, index) => {
    const raw = fn();
    const uniqueOptions = make4UniqueOptions(raw.correct, raw.wrongs);
    return {
      id: index + 1,
      q: raw.q,
      correct: raw.correct,
      explain: raw.explain,
      options: uniqueOptions
    };
  });
}

export default function Epanalipsi3Page() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewExam = () => {
    const newQuestions = generateRandomExam();
    setQuestions(newQuestions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewExam();
  }, []);

  if (!questions) return null;

  const handleSelectOption = (qId, optionText) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🏆 Μεγάλη Επανάληψη (Ενότητες 20-23) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <button 
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ερωτήσεις
              </button>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                🏆 3η Μεγάλη Επανάληψη Θεωρίας
              </h1>
              <p className="text-indigo-100 text-sm md:text-base mt-1">
                Μεγάλοι Αριθμοί (έως 1.000.000), Πολλαπλασιασμός 3ψηφίων, Διαίρεση με 2ψήφιο & Αναγωγή στη Μονάδα!
              </p>
            </div>

            <button
              onClick={loadNewExam}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Ερωτήσεων
            </button>
          </div>

          {/* FORM ΕΡΩΤΗΣΕΩΝ */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {questions.map((q) => {
              const isUserCorrect = answers[q.id] === q.correct;

              return (
                <div 
                  key={q.id}
                  className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
                    submitted 
                      ? (isUserCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">
                      {q.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{q.q}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[q.id] === opt;

                      return (
                        <label 
                          key={idx} 
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
                              : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${q.id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q.id, opt)}
                            disabled={submitted}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm md:text-base font-bold font-mono">{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                      {isUserCorrect ? (
                        <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                      ) : (
                        <p className="text-red-600">❌ Λάθος. {q.explain || `Η σωστή απάντηση είναι: ${q.correct}`}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 15) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
