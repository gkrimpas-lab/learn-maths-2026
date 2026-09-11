// pages/d-dimotikou/24-epanalipsi-3.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Βοηθητική συνάρτηση για εγγυημένα 4 μοναδικές επιλογές
function make4UniqueOptions(correct, wrongs) {
  const cleanWrongs = Array.from(new Set(wrongs)).filter((w) => w !== correct);
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
    q: 'Στο δεκαδικό σύστημα αρίθμησης, από τι εξαρτάται η πραγματική αξία ενός ψηφίου μέσα σε έναν αριθμό;',
    correct: 'Από τη θέση που κατέχει στον αριθμό',
    wrongs: ['Από το πόσο μεγάλο είναι το ψηφίο', 'Από το αν ο αριθμός είναι άρτιος ή περιττός', 'Είναι πάντοτε σταθερή και ίδια'],
    explainText: 'Η αξία κάθε ψηφίου καθορίζεται από τη θέση της τάξης του (Μονάδες, Δεκάδες, Εκατοντάδες κ.λπ.).'
  }),
  () => ({
    q: 'Σε πόσα ψηφία χωρίζουμε έναν μεγάλο αριθμό για να διακρίνουμε τις κλάσεις του;',
    correct: 'Σε ομάδες των 3 ψηφίων από δεξιά προς τα αριστερά',
    wrongs: ['Σε ομάδες των 2 ψηφίων από αριστερά', 'Σε ομάδες των 4 ψηφίων από δεξιά', 'Σε ομάδες των 3 ψηφίων από αριστερά προς τα δεξιά'],
    explainText: 'Χωρίζουμε τα ψηφία ανά τριάδες ξεκινώντας πάντοτε από τα δεξιά (Μονάδες, Δεκάδες, Εκατοντάδες).'
  }),
  () => {
    const ex = getRandomInt(2, 9);
    return {
      q: `Πόσες μονάδες αξίζει το ψηφίο ${ex} όταν βρίσκεται στη θέση των Εκατοντάδων Χιλιάδων (ΕΧ);`,
      correct: `${formatNumber(ex * 100000)}`,
      wrongs: [`${formatNumber(ex * 10000)}`, `${formatNumber(ex * 1000)}`, `${formatNumber(ex * 100)}`],
      explainText: `Στις Εκατοντάδες Χιλιάδες, το ψηφίο ${ex} έχει αξία ${ex} · 100.000 ＝ ${formatNumber(ex * 100000)}.`
    };
  },
  () => {
    const dx = getRandomInt(2, 9);
    return {
      q: `Πόσες μονάδες αξίζει το ψηφίο ${dx} όταν βρίσκεται στη θέση των Δεκάδων Χιλιάδων (ΔΧ);`,
      correct: `${formatNumber(dx * 10000)}`,
      wrongs: [`${formatNumber(dx * 100000)}`, `${formatNumber(dx * 1000)}`, `${formatNumber(dx * 100)}`],
      explainText: `Στις Δεκάδες Χιλιάδες, το ψηφίο ${dx} έχει αξία ${dx} · 10.000 ＝ ${formatNumber(dx * 10000)}.`
    };
  },
  () => ({
    q: 'Ποιος είναι ο αμέσως επόμενος φυσικός αριθμός του 999.999;',
    correct: '1.000.000 (1 εκατομμύριο)',
    wrongs: ['100.000', '1.000.001', '999.998'],
    explainText: 'Προσθέτοντας 1 μονάδα έχουμε: 999.999 ＋ 1 ＝ 1.000.000.'
  }),
  () => ({
    q: 'Ποιος είναι ο αμέσως προηγούμενος φυσικός αριθμός του 500.000;',
    correct: '499.999',
    wrongs: ['499.990', '490.000', '500.001'],
    explainText: 'Αφαιρώντας 1 μονάδα έχουμε: 500.000 － 1 ＝ 499.999.'
  }),
  () => ({
    q: 'Πόσες Δεκάδες Χιλιάδες χρειάζονται για να σχηματίσουμε 1 Εκατοντάδα Χιλιάδων (100.000);',
    correct: '10 Δεκάδες Χιλιάδες',
    wrongs: ['100 Δεκάδες Χιλιάδες', '1.000 Δεκάδες Χιλιάδες', '5 Δεκάδες Χιλιάδες'],
    explainText: 'Ισχύει η ισότητα 10 · 10.000 ＝ 100.000.'
  }),
  () => ({
    q: 'Πόσες Εκατοντάδες Χιλιάδες χρειάζονται για να σχηματίσουμε 1 Εκατομμύριο (1.000.000);',
    correct: '10 Εκατοντάδες Χιλιάδες',
    wrongs: ['100 Εκατοντάδες Χιλιάδες', '1.000 Εκατοντάδες Χιλιάδες', '20 Εκατοντάδες Χιλιάδες'],
    explainText: 'Ισχύει η ισότητα 10 · 100.000 ＝ 1.000.000.'
  }),
  () => {
    const a = getRandomInt(300, 800) * 1000;
    const b = a + getRandomInt(10, 90) * 10;
    return {
      q: `Ποια σχέση σύγκρισης είναι ορθή ανάμεσα στους αριθμούς ${formatNumber(a)} και ${formatNumber(b)};`,
      correct: `${formatNumber(a)} ＜ ${formatNumber(b)}`,
      wrongs: [`${formatNumber(a)} ＞ ${formatNumber(b)}`, `${formatNumber(a)} ＝ ${formatNumber(b)}`, `${formatNumber(b)} ＜ ${formatNumber(a)}`],
      explainText: `Ο αριθμός ${formatNumber(a)} είναι μικρότερος από τον ${formatNumber(b)}.`
    };
  },
  () => ({
    q: 'Στον αριθμό 704.050, ποιο ψηφίο βρίσκεται στη θέση των Μονάδων Χιλιάδων (Χ);',
    correct: 'Το 4',
    wrongs: ['Το 7', 'Το 0', 'Το 5'],
    explainText: 'Στον αριθμό 704.050: 7＝ΕΧ, 0＝ΔΧ, 4＝Χ, 0＝Ε, 5＝Δ, 0＝Μ.'
  }),
  () => ({
    q: 'Ποιος είναι ο μικρότερος εξαψήφιος φυσικός αριθμός;',
    correct: '100.000',
    wrongs: ['100.001', '111.111', '999.999'],
    explainText: 'Ο μικρότερος 6ψήφιος φυσικός αριθμός είναι το 100.000 (μία εκατοντάδα χιλιάδων).'
  }),
  () => ({
    q: 'Ποιος είναι ο μεγαλύτερος εξαψήφιος φυσικός αριθμός;',
    correct: '999.999',
    wrongs: ['1.000.000', '900.000', '999.000'],
    explainText: 'Ο μεγαλύτερος 6ψήφιος φυσικός αριθμός είναι το 999.999, καθώς ο επόμενός του (1.000.000) είναι 7ψήφιος.'
  }),
  () => {
    const ex = getRandomInt(2, 8);
    const dx = getRandomInt(1, 9);
    const total = ex * 100000 + dx * 10000;
    return {
      q: `Ποιος αριθμός αποτελείται από ${ex} Εκατοντάδες Χιλιάδες και ${dx} Δεκάδες Χιλιάδες (με όλα τα άλλα ψηφία 0);`,
      correct: `${formatNumber(total)}`,
      wrongs: [`${formatNumber(ex * 10000 + dx * 1000)}`, `${formatNumber(ex * 100000 + dx * 1000)}`, `${formatNumber(ex * 100000 + dx * 100)}`],
      explainText: `Υπολογίζουμε (${ex} · 100.000) ＋ (${dx} · 10.000) ＝ ${formatNumber(total)}.`
    };
  },
  () => ({
    q: 'Πώς διαβάζεται ορθά ο αριθμός 405.008;',
    correct: 'Τετρακόσιες πέντε χιλιάδες οκτώ',
    wrongs: ['Τετρακόσιες πενήντα χιλιάδες οκτώ', 'Τεσσεράμισι χιλιάδες οκτώ', 'Τετρακόσιες πέντε χιλιάδες ογδόντα'],
    explainText: 'Διαβάζουμε πρώτα την κλάση των χιλιάδων (405 χιλιάδες) και κατόπιν των μονάδων (8).'
  }),
  () => ({
    q: 'Όταν συγκρίνουμε δύο αριθμούς με το ίδιο πλήθος ψηφίων, από ποιο ψηφίο ξεκινάμε τη σύγκριση;',
    correct: 'Από το πρώτο ψηφίο αριστερά (με τη μεγαλύτερη αξία θέσης)',
    wrongs: ['Από το τελευταίο ψηφίο δεξιά (τις μονάδες)', 'Από το μεσαίο ψηφίο', 'Δεν έχει καμία σημασία'],
    explainText: 'Η σύγκριση ξεκινά πάντοτε από την ανώτερη τάξη μεγέθους, δηλαδή από τα αριστερά προς τα δεξιά.'
  }),
  () => ({
    q: 'Πόσες μονάδες ισοδυναμούν με 250 εκατοντάδες;',
    correct: '25.000 μονάδες',
    wrongs: ['2.500 μονάδες', '250.000 μονάδες', '250 μονάδες'],
    explainText: 'Υπολογίζουμε: 250 · 100 ＝ 25.000 μονάδες.'
  }),

  // ==========================================
  // 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ 3ΨΗΦΙΩΝ (17 - 32)
  // ==========================================
  () => ({
    q: 'Στον κάθετο πολλαπλασιασμό με τριψήφιο πολλαπλασιαστή, πόσα μερικά γινόμενα σχηματίζονται;',
    correct: '3 μερικά γινόμενα',
    wrongs: ['2 μερικά γινόμενα', '4 μερικά γινόμενα', '1 μερικό γινόμενο'],
    explainText: 'Σχηματίζονται 3 μερικά γινόμενα: ένα για τις μονάδες, ένα για τις δεκάδες κι ένα για τις εκατοντάδες.'
  }),
  () => ({
    q: 'Όταν υπολογίζουμε το 2ο μερικό γινόμενο (πολλαπλασιασμός με τις Δεκάδες), τι τοποθετούμε στο τέλος δεξιά;',
    correct: 'Ένα μηδενικό (0) ή αφήνουμε 1 θέση κενό',
    wrongs: ['Δύο μηδενικά (00)', 'Τρία μηδενικά (000)', 'Δεν τοποθετούμε τίποτα'],
    explainText: 'Επειδή πολλαπλασιάζουμε με δεκάδες (· 10), σημειώνουμε 1 μηδενικό (0) στη θέση των μονάδων.'
  }),
  () => ({
    q: 'Όταν υπολογίζουμε το 3ο μερικό γινόμενο (πολλαπλασιασμός με τις Εκατοντάδες), τι τοποθετούμε στο τέλος δεξιά;',
    correct: 'Δύο μηδενικά (00) ή αφήνουμε 2 θέσεις κενό',
    wrongs: ['Ένα μηδενικό (0)', 'Τρία μηδενικά (000)', 'Κανένα μηδενικό'],
    explainText: 'Επειδή πολλαπλασιάζουμε με εκατοντάδες (· 100), σημειώνουμε 2 μηδενικά (00).'
  }),
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Ποιο είναι το γινόμενο ${a} · 100;`,
      correct: `${formatNumber(a * 100)}`,
      wrongs: [`${formatNumber(a * 10)}`, `${formatNumber(a * 1000)}`, `${a + 100}`],
      explainText: `Για να πολλαπλασιάσουμε με το 100, προσθέτουμε δύο μηδενικά στο τέλος του αριθμού: ${a} · 100 ＝ ${formatNumber(a * 100)}.`
    };
  },
  () => {
    const a = getRandomInt(12, 95);
    return {
      q: `Ποιο είναι το γινόμενο ${a} · 1.000;`,
      correct: `${formatNumber(a * 1000)}`,
      wrongs: [`${formatNumber(a * 100)}`, `${formatNumber(a * 10000)}`, `${a + 1000}`],
      explainText: `Για να πολλαπλασιάσουμε με το 1.000, προσθέτουμε τρία μηδενικά στο τέλος του αριθμού: ${a} · 1.000 ＝ ${formatNumber(a * 1000)}.`
    };
  },
  () => ({
    q: 'Ποια είναι η αντιμεταθετική ιδιότητα του πολλαπλασιασμού;',
    correct: 'α · β ＝ β · α (η σειρά των παραγόντων δεν αλλάζει το γινόμενο)',
    wrongs: ['α ＋ β ＝ β ＋ α', 'α · 1 ＝ α', 'α · 0 ＝ 0'],
    explainText: 'Στον πολλαπλασιασμό μπορούμε να αλλάξουμε τη σειρά των παραγόντων χωρίς να μεταβληθεί το αποτέλεσμα.'
  }),
  () => ({
    q: 'Όταν πολλαπλασιάζουμε οποιονδήποτε αριθμό με το 0, το αποτέλεσμα είναι:',
    correct: 'Πάντοτε 0',
    wrongs: ['Ο ίδιος ο αριθμός', '1', '100'],
    explainText: 'Το μηδέν απορροφά το γινόμενο: α · 0 ＝ 0.'
  }),
  () => ({
    q: 'Όταν πολλαπλασιάζουμε οποιονδήποτε αριθμό με το 1, το αποτέλεσμα είναι:',
    correct: 'Ο ίδιος ο αριθμός',
    wrongs: ['0', '1', 'Ο επόμενος αριθμός'],
    explainText: 'Το 1 αποτελεί το ουδέτερο στοιχείο του πολλαπλασιασμού: α · 1 ＝ α.'
  }),
  () => {
    const a = getRandomInt(120, 350);
    const u = getRandomInt(2, 5);
    return {
      q: `Στον πολλαπλασιασμό ${a} · ${u}00, ποιο είναι το ορθό αποτέλεσμα;`,
      correct: `${formatNumber(a * u * 100)}`,
      wrongs: [`${formatNumber(a * u * 10)}`, `${formatNumber(a * u * 1000)}`, `${formatNumber(a * u)}`],
      explainText: `Υπολογίζουμε ${a} · ${u} ＝ ${a * u} και προσθέτουμε δύο μηδενικά: ${formatNumber(a * u * 100)}.`
    };
  },
  () => {
    const a = getRandomInt(15, 45);
    return {
      q: `Αν γνωρίζουμε ότι ${a} · 4 ＝ ${a * 4}, πόσο κάνει ${a} · 400;`,
      correct: `${formatNumber(a * 400)}`,
      wrongs: [`${formatNumber(a * 40)}`, `${formatNumber(a * 4000)}`, `${a * 4 + 400}`],
      explainText: `Ισχύει ${a} · 400 ＝ (${a} · 4) · 100 ＝ ${a * 4} · 100 ＝ ${formatNumber(a * 400)}.`
    };
  },
  () => ({
    q: 'Ποιοι είναι οι όροι της πράξης του πολλαπλασιασμού;',
    correct: 'Πολλαπλασιαστέος, Πολλαπλασιαστής και Γινόμενο',
    wrongs: ['Διαιρετέος, Διαιρέτης και Πηλίκο', 'Προσθετέος, Προσθετέος και Άθροισμα', 'Μειωτέος, Αφαιρετέος και Διαφορά'],
    explainText: 'Οι όροι που πολλαπλασιάζονται λέγονται παράγοντες (πολλαπλασιαστέος και πολλαπλασιαστής) και το αποτέλεσμα γινόμενο.'
  }),
  () => ({
    q: 'Πώς προκύπτει το τελικό αποτέλεσμα σε έναν κάθετο πολλαπλασιασμό;',
    correct: 'Προσθέτουμε όλα τα επιμέρους μερικά γινόμενα',
    wrongs: ['Πολλαπλασιάζουμε τα μερικά γινόμενα μεταξύ τους', 'Αφαιρούμε τα μερικά γινόμενα', 'Κρατάμε μόνο το τελευταίο μερικό γινόμενο'],
    explainText: 'Το τελικό γινόμενο είναι το άθροισμα των μερικών γινομένων.'
  }),

  // ==========================================
  // 3. ΔΙΑΙΡΕΣΗ ΜΕ ΔΙΨΗΦΙΟ ΔΙΑΙΡΕΤΗ (33 - 48)
  // ==========================================
  () => ({
    q: 'Σε κάθε ακέραια διαίρεση, ποια σχέση ισχύει ΠΑΝΤΟΤΕ ανάμεσα στο υπόλοιπο (υ) και στον διαιρέτη (δ);',
    correct: 'Το υπόλοιπο είναι πάντοτε μικρότερο από τον διαιρέτη (υ ＜ δ)',
    wrongs: ['Το υπόλοιπο είναι πάντοτε μεγαλύτερο από τον διαιρέτη (υ ＞ δ)', 'Το υπόλοιπο ισούται πάντοτε με τον διαιρέτη (υ ＝ δ)', 'Δεν υπάρχει κανένας περιορισμός'],
    explainText: 'Σύμφωνα με τον κανόνα της ευκλείδειας διαίρεσης, το υπόλοιπο πρέπει να είναι αυστηρά μικρότερο από τον διαιρέτη (υ ＜ δ).'
  }),
  () => ({
    q: 'Πότε μια διαίρεση ονομάζεται Τέλεια;',
    correct: 'Όταν το υπόλοιπό της είναι ίσο με μηδέν (υ ＝ 0)',
    wrongs: ['Όταν το πηλίκο είναι ίσο με 0', 'Όταν ο διαιρέτης είναι μονοψήφιος', 'Όταν το υπόλοιπο ισούται με 1'],
    explainText: 'Τέλεια ονομάζεται η διαίρεση στην οποία δεν περισσεύει τίποτα, δηλαδή το υπόλοιπο είναι μηδέν (υ ＝ 0).'
  }),
  () => ({
    q: 'Πότε μια διαίρεση ονομάζεται Ατελής;',
    correct: 'Όταν το υπόλοιπό της είναι μεγαλύτερο από μηδέν (υ ＞ 0)',
    wrongs: ['Όταν το υπόλοιπό της ισούται με 0', 'Όταν το πηλίκο είναι 0', 'Όταν δεν μπορούμε να βρούμε το πηλίκο'],
    explainText: 'Ατελής ονομάζεται η διαίρεση στην οποία περισσεύει υπόλοιπο μεγαλύτερο του μηδενός (υ ＞ 0).'
  }),
  () => ({
    q: 'Ποιος είναι ο μαθηματικός τύπος της επαλήθευσης της διαίρεσης;',
    correct: 'Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο',
    wrongs: ['Διαιρετέος ＝ (Διαιρέτης ＋ Πηλίκο) · Υπόλοιπο', 'Διαιρέτης ＝ (Διαιρετέος · Πηλίκο) ＋ Υπόλοιπο', 'Πηλίκο ＝ Διαιρετέος ＋ Διαιρέτης'],
    explainText: 'Ισχύει πάντοτε ο τύπος της ευκλείδειας διαίρεσης: Δ ＝ (δ · π) ＋ υ.'
  }),
  () => {
    const d = getRandomInt(12, 35);
    const q = getRandomInt(10, 30);
    const r = getRandomInt(1, d - 1);
    const D = d * q + r;
    return {
      q: `Σε μια διαίρεση ο διαιρέτης είναι δ ＝ ${d}, το πηλίκο π ＝ ${q} και το υπόλοιπο υ ＝ ${r}. Πόσος είναι ο Διαιρετέος (Δ);`,
      correct: `${formatNumber(D)}`,
      wrongs: [`${formatNumber(d * q)}`, `${formatNumber(D + 10)}`, `${formatNumber(d + q + r)}`],
      explainText: `Υπολογίζουμε: Δ ＝ (δ · π) ＋ υ ＝ (${d} · ${q}) ＋ ${r} ＝ ${formatNumber(d * q)} ＋ ${r} ＝ ${formatNumber(D)}.`
    };
  },
  () => {
    const d = getRandomInt(15, 60);
    return {
      q: `Αν ο διαιρέτης μιας διαίρεσης είναι δ ＝ ${d}, ποιο είναι το ΜΕΓΑΛΥΤΕΡΟ δυνατό υπόλοιπο που μπορεί να προκύψει;`,
      correct: `${d - 1}`,
      wrongs: [`${d}`, `${d + 1}`, '0'],
      explainText: `Επειδή ισχύει υ ＜ δ, το μέγιστο δυνατό υπόλοιπο είναι πάντοτε δ － 1 ＝ ${d - 1}.`
    };
  },
  () => ({
    q: 'Ποια πράξη ΔΕΝ ορίζεται ποτέ στα μαθηματικά;',
    correct: 'Η διαίρεση με το μηδέν (διαίρεση διά 0)',
    wrongs: ['Ο πολλαπλασιασμός με το μηδέν', 'Η αφαίρεση με το μηδέν', 'Η πρόσθεση με το μηδέν'],
    explainText: 'Δεν μπορούμε ποτέ να διαιρέσουμε με το μηδέν, διότι η διαίρεση διά 0 είναι αδύνατη.'
  }),
  () => ({
    q: 'Όταν διαιρούμε το 0 με οποιονδήποτε μη μηδενικό αριθμό (π.χ. 0 ： 25), το αποτέλεσμα είναι:',
    correct: '0',
    wrongs: ['25', '1', 'Δεν γίνεται'],
    explainText: 'Το μηδέν διαιρούμενο με οποιονδήποτε αριθμό δίνει πάντοτε μηδέν: 0 ： α ＝ 0.'
  }),
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Πόσο κάνει ${formatNumber(a * 100)} ： 100;`,
      correct: `${a}`,
      wrongs: [`${a * 10}`, `${formatNumber(a * 100)}`, '0'],
      explainText: `Όταν διαιρούμε με το 100, αφαιρούμε δύο μηδενικά από το τέλος: ${formatNumber(a * 100)} ： 100 ＝ ${a}.`
    };
  },
  () => {
    const a = getRandomInt(12, 85);
    return {
      q: `Πόσο κάνει ${formatNumber(a * 10)} ： 10;`,
      correct: `${a}`,
      wrongs: [`${a * 10}`, `${formatNumber(a * 100)}`, '1'],
      explainText: `Όταν διαιρούμε με το 10, αφαιρούμε ένα μηδενικό από το τέλος: ${a * 10} ： 10 ＝ ${a}.`
    };
  },
  () => ({
    q: 'Όταν διαιρούμε έναν αριθμό με τον εαυτό του (π.χ. 45 ： 45), το πηλίκο ισούται με:',
    correct: '1',
    wrongs: ['0', '45', '2'],
    explainText: 'Κάθε μη μηδενικός αριθμός διαιρούμενος με τον εαυτό του δίνει πηλίκο 1: α ： α ＝ 1.'
  }),
  () => ({
    q: 'Όταν διαιρούμε έναν αριθμό με το 1 (π.χ. 84 ： 1), το πηλίκο ισούται με:',
    correct: 'Τον ίδιο τον αριθμό (84)',
    wrongs: ['1', '0', '85'],
    explainText: 'Κάθε αριθμός διαιρούμενος με το 1 παραμένει αμετάβλητος: α ： 1 ＝ α.'
  }),

  // ==========================================
  // 4. ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ (49 - 64)
  // ==========================================
  () => ({
    q: 'Ποιο είναι το 1ο ΒΗΜΑ στη μέθοδο της Αναγωγής στη Μονάδα;',
    correct: 'Κάνουμε Διαίρεση ( ： ) για να βρούμε την τιμή/ποσότητα του 1 πράγματος',
    wrongs: ['Κάνουμε Πολλαπλασιασμό για να βρούμε τα πολλά', 'Κάνουμε Πρόσθεση των ποσοτήτων', 'Κάνουμε Αφαίρεση του κόστους'],
    explainText: 'Στο 1ο βήμα διαιρούμε το συνολικό κόστος με το πλήθος των πραγμάτων για να βρούμε πόσο κοστίζει το 1.'
  }),
  () => ({
    q: 'Ποιο είναι το 2ο ΒΗΜΑ στη μέθοδο της Αναγωγής στη Μονάδα;',
    correct: 'Κάνουμε Πολλαπλασιασμό ( · ) της τιμής του 1 με το νέο ζητούμενο πλήθος',
    wrongs: ['Κάνουμε Διαίρεση με το νέο πλήθος', 'Κάνουμε Αφαίρεση του κόστους', 'Προσθέτουμε 10'],
    explainText: 'Στο 2ο βήμα πολλαπλασιάζουμε την τιμή της μονάδας με το νέο πλήθος που ζητάει το πρόβλημα.'
  }),
  () => {
    const q1 = getRandomInt(3, 6);
    const uCost = getRandomInt(2, 5);
    const total1 = q1 * uCost;
    return {
      q: `Αν τα ${q1} τετράδια κοστίζουν ${total1} €, πόσο κοστίζει το 1 τετράδιο;`,
      correct: `${uCost} €`,
      wrongs: [`${uCost + 1} €`, `${uCost + 2} €`, `${total1} €`],
      explainText: `Βήμα 1: Διαιρούμε ${total1} ： ${q1} ＝ ${uCost} € το 1 τετράδιο.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(2, 5);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(5, 8);
    const total2 = q2 * uCost;
    return {
      q: `Αν οι ${q1} σοκολάτες κοστίζουν ${total1} €, πόσο κοστίζουν οι ${q2} ίδιες σοκολάτες;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + uCost} €`, `${total2 - uCost} €`, `${total1 * q2} €`],
      explainText: `Βήμα 1: Η 1 σοκολάτα κοστίζει ${total1} ： ${q1} ＝ ${uCost} €. Βήμα 2: Οι ${q2} σοκολάτες κοστίζουν ${q2} · ${uCost} ＝ ${total2} €.`
    };
  },
  () => {
    const q1 = getRandomInt(2, 4);
    const uCost = getRandomInt(3, 6);
    const total1 = q1 * uCost;
    const q2 = getRandomInt(5, 7);
    const total2 = q2 * uCost;
    return {
      q: `Αν τα ${q1} βιβλία κοστίζουν ${total1} €, πόσο κοστίζουν τα ${q2} ίδια βιβλία;`,
      correct: `${total2} €`,
      wrongs: [`${total2 + uCost} €`, `${total2 - uCost} €`, `${total1 + total2} €`],
      explainText: `Βήμα 1: Το 1 βιβλίο κοστίζει ${total1} ： ${q1} ＝ ${uCost} €. Βήμα 2: Τα ${q2} βιβλία κοστίζουν ${q2} · ${uCost} ＝ ${total2} €.`
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
      explainText: `Ο 1 χυμός κοστίζει ${total1} ： ${q1} ＝ ${uCost} €. Με ${targetCost} € αγοράζουμε: ${targetCost} ： ${uCost} ＝ ${targetQty} χυμούς.`
    };
  },
  () => {
    const speed = getRandomInt(60, 90);
    const hours = getRandomInt(2, 4);
    const dist = speed * hours;
    const newHours = hours + getRandomInt(2, 3);
    const newDist = speed * newHours;
    return {
      q: `Ένα αυτοκίνητο διανύει ${dist} χιλιόμετρα σε ${hours} ώρες. Πόσα χιλιόμετρα θα διανύσει σε ${newHours} ώρες με την ίδια σταθερή ταχύτητα;`,
      correct: `${newDist} χιλιόμετρα`,
      wrongs: [`${newDist + speed} χιλιόμετρα`, `${newDist - speed} χιλιόμετρα`, `${dist * 2} χιλιόμετρα`],
      explainText: `Σε 1 ώρα διανύει ${dist} ： ${hours} ＝ ${speed} km. Σε ${newHours} ώρες θα διανύσει ${newHours} · ${speed} ＝ ${newDist} km.`
    };
  },
  () => ({
    q: 'Γιατί η συγκεκριμένη μέθοδος επίλυσης ονομάζεται «Αναγωγή στη Μονάδα»;',
    correct: 'Επειδή ως απαραίτητο ενδιάμεσο βήμα βρίσκουμε πάντοτε την τιμή του ενός (της μονάδας)',
    wrongs: ['Επειδή προσθέτουμε πάντοτε το 1', 'Επειδή αφαιρούμε τη μονάδα', 'Επειδή πολλαπλασιάζουμε με το 1'],
    explainText: 'Ονομάζεται έτσι επειδή οδηγούμε (ανάγουμε) το πρόβλημα στον υπολογισμό του ενός αντικειμένου.'
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
      explainText: raw.explainText,
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
    setAnswers((prev) => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <Layout
      title="3η Μεγάλη Επανάληψη Θεωρίας (Ενότητες 20-23) | LearnMaths.gr"
      description="Επαναληπτικό διαγώνισμα μαθηματικών Δ' Δημοτικού στις Ενότητες 20-23: Μεγάλοι Αριθμοί έως 1.000.000, Πολλαπλασιασμός 3ψηφίων, Διαίρεση με 2ψήφιο και Αναγωγή στη Μονάδα."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <button
          onClick={loadNewExam}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🔄</span> Νέο Τεστ
        </button>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ (20 - 23)
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              🏆 3η Μεγάλη Επανάληψη Θεωρίας
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base">
              15 τυχαίες ερωτήσεις: Μεγάλοι Αριθμοί, Πολλαπλασιασμός 3ψηφίων, Διαίρεση με 2ψήφιο & Αναγωγή στη Μονάδα!
            </p>
          </div>

          <button
            onClick={loadNewExam}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Αλλαγή Ερωτήσεων
          </button>
        </div>

        {/* FORM ΕΡΩΤΗΣΕΩΝ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {questions.map((q) => {
            const isUserCorrect = answers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
                  submitted
                    ? isUserCorrect
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                    {q.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.q}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[q.id] === opt;

                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                      >
                        <input
                          type="radio"
                          id={`question-${q.id}-opt-${idx}`}
                          name={`question-${q.id}`}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.id, opt)}
                          disabled={submitted}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                        />
                        <span className="leading-snug font-mono font-bold text-sm sm:text-base">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
                    {isUserCorrect ? (
                      <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                        {q.explainText}
                      </p>
                    ) : (
                      <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                        Η σωστή απάντηση είναι: <strong className="font-mono font-bold text-rose-900">{q.correct}</strong>. {q.explainText}
                      </p>
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
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 15) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέο Τεστ
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
