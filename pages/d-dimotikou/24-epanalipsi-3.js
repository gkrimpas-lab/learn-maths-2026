// pages/d-dimotikou/24-epanalipsi-3.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
}

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

const translations = {
  el: {
    pageTitle: "3η Μεγάλη Επανάληψη Θεωρίας (Ενότητες 20-23) | LearnMaths.gr",
    pageDesc: "Επαναληπτικό διαγώνισμα μαθηματικών Δ' Δημοτικού στις Ενότητες 20-23: Μεγάλοι Αριθμοί έως 1.000.000, Πολλαπλασιασμός 3ψηφίων, Διαίρεση με 2ψήφιο και Αναγωγή στη Μονάδα.",
    backText: "Δ' Δημοτικού",
    newTestBtn: "Νέο Τεστ",
    changeQuestionsBtn: "Αλλαγή Ερωτήσεων",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ (20 - 23)",
    title: "🏆 3η Μεγάλη Επανάληψη Θεωρίας",
    subtitle: "15 τυχαίες ερωτήσεις: Μεγάλοι Αριθμοί, Πολλαπλασιασμός 3ψηφίων, Διαίρεση με 2ψήφιο & Αναγωγή στη Μονάδα!",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:"
  },
  en: {
    pageTitle: "3rd Major Theory Review (Units 20-23) | LearnMaths.gr",
    pageDesc: "Grade 4 review exam on Units 20-23: Large Numbers up to 1,000,000, 3-digit multiplication, 2-digit divisor division, and the Unitary Method.",
    backText: "Grade 4",
    newTestBtn: "New Test",
    changeQuestionsBtn: "Change Questions",
    badge: "GRADE 4 • REVIEW (20 - 23)",
    title: "🏆 3rd Major Theory Review",
    subtitle: "15 random questions: Large Numbers, 3-Digit Multiplication, 2-Digit Division & Unitary Method!",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    correctAnswerPrefix: "The correct answer is:"
  }
};

const THEORY_QUESTIONS_POOL = {
  el: [
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
    (fmt) => {
      const ex = getRandomInt(2, 9);
      const val = ex * 100000;
      return {
        q: `Πόσες μονάδες αξίζει το ψηφίο ${ex} όταν βρίσκεται στη θέση των Εκατοντάδων Χιλιάδων (ΕΧ);`,
        correct: `${fmt(val)}`,
        wrongs: [`${fmt(ex * 10000)}`, `${fmt(ex * 1000)}`, `${fmt(ex * 100)}`],
        explainText: `Στις Εκατοντάδες Χιλιάδες, το ψηφίο ${ex} έχει αξία ${ex} · 100.000 ＝ ${fmt(val)}.`
      };
    },
    (fmt) => {
      const dx = getRandomInt(2, 9);
      const val = dx * 10000;
      return {
        q: `Πόσες μονάδες αξίζει το ψηφίο ${dx} όταν βρίσκεται στη θέση των Δεκάδων Χιλιάδων (ΔΧ);`,
        correct: `${fmt(val)}`,
        wrongs: [`${fmt(dx * 100000)}`, `${fmt(dx * 1000)}`, `${fmt(dx * 100)}`],
        explainText: `Στις Δεκάδες Χιλιάδες, το ψηφίο ${dx} έχει αξία ${dx} · 10.000 ＝ ${fmt(val)}.`
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
    (fmt) => {
      const a = getRandomInt(300, 800) * 1000;
      const b = a + getRandomInt(10, 90) * 10;
      return {
        q: `Ποια σχέση σύγκρισης είναι ορθή ανάμεσα στους αριθμούς ${fmt(a)} και ${fmt(b)};`,
        correct: `${fmt(a)} ＜ ${fmt(b)}`,
        wrongs: [`${fmt(a)} ＞ ${fmt(b)}`, `${fmt(a)} ＝ ${fmt(b)}`, `${fmt(b)} ＜ ${fmt(a)}`],
        explainText: `Ο αριθμός ${fmt(a)} είναι μικρότερος από τον ${fmt(b)}.`
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
    (fmt) => {
      const ex = getRandomInt(2, 8);
      const dx = getRandomInt(1, 9);
      const total = ex * 100000 + dx * 10000;
      return {
        q: `Ποιος αριθμός αποτελείται από ${ex} Εκατοντάδες Χιλιάδες και ${dx} Δεκάδες Χιλιάδες (με όλα τα άλλα ψηφία 0);`,
        correct: `${fmt(total)}`,
        wrongs: [`${fmt(ex * 10000 + dx * 1000)}`, `${fmt(ex * 100000 + dx * 1000)}`, `${fmt(ex * 100000 + dx * 100)}`],
        explainText: `Υπολογίζουμε (${ex} · 100.000) ＋ (${dx} · 10.000) ＝ ${fmt(total)}.`
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
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `Ποιο είναι το γινόμενο ${a} · 100;`,
        correct: `${fmt(a * 100)}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 1000)}`, `${fmt(a + 100)}`],
        explainText: `Για να πολλαπλασιάσουμε με το 100, προσθέτουμε δύο μηδενικά στο τέλος του αριθμού: ${a} · 100 ＝ ${fmt(a * 100)}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(12, 95);
      return {
        q: `Ποιο είναι το γινόμενο ${a} · 1.000;`,
        correct: `${fmt(a * 1000)}`,
        wrongs: [`${fmt(a * 100)}`, `${fmt(a * 10000)}`, `${fmt(a + 1000)}`],
        explainText: `Για να πολλαπλασιάσουμε με το 1.000, προσθέτουμε τρία μηδενικά στο τέλος του αριθμού: ${a} · 1.000 ＝ ${fmt(a * 1000)}.`
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
    (fmt) => {
      const a = getRandomInt(120, 350);
      const u = getRandomInt(2, 5);
      const total = a * u * 100;
      return {
        q: `Στον πολλαπλασιασμό ${a} · ${u}00, ποιο είναι το ορθό αποτέλεσμα;`,
        correct: `${fmt(total)}`,
        wrongs: [`${fmt(a * u * 10)}`, `${fmt(a * u * 1000)}`, `${fmt(a * u)}`],
        explainText: `Υπολογίζουμε ${a} · ${u} ＝ ${fmt(a * u)} και προσθέτουμε δύο μηδενικά: ${fmt(total)}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(15, 45);
      return {
        q: `Αν γνωρίζουμε ότι ${a} · 4 ＝ ${fmt(a * 4)}, πόσο κάνει ${a} · 400;`,
        correct: `${fmt(a * 400)}`,
        wrongs: [`${fmt(a * 40)}`, `${fmt(a * 4000)}`, `${fmt(a * 4 + 400)}`],
        explainText: `Ισχύει ${a} · 400 ＝ (${a} · 4) · 100 ＝ ${fmt(a * 4)} · 100 ＝ ${fmt(a * 400)}.`
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
    (fmt) => {
      const d = getRandomInt(12, 35);
      const q = getRandomInt(10, 30);
      const r = getRandomInt(1, d - 1);
      const D = d * q + r;
      return {
        q: `Σε μια διαίρεση ο διαιρέτης είναι δ ＝ ${d}, το πηλίκο π ＝ ${q} και το υπόλοιπο υ ＝ ${r}. Πόσος είναι ο Διαιρετέος (Δ);`,
        correct: `${fmt(D)}`,
        wrongs: [`${fmt(d * q)}`, `${fmt(D + 10)}`, `${fmt(d + q + r)}`],
        explainText: `Υπολογίζουμε: Δ ＝ (δ · π) ＋ υ ＝ (${d} · ${q}) ＋ ${r} ＝ ${fmt(d * q)} ＋ ${r} ＝ ${fmt(D)}.`
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
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `Πόσο κάνει ${fmt(a * 100)} ： 100;`,
        correct: `${a}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 100)}`, '0'],
        explainText: `Όταν διαιρούμε με το 100, αφαιρούμε δύο μηδενικά από το τέλος: ${fmt(a * 100)} ： 100 ＝ ${a}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `Πόσο κάνει ${fmt(a * 10)} ： 10;`,
        correct: `${a}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 100)}`, '1'],
        explainText: `Όταν διαιρούμε με το 10, αφαιρούμε ένα μηδενικό από το τέλος: ${fmt(a * 10)} ： 10 ＝ ${a}.`
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
    (fmt) => {
      const q1 = getRandomInt(3, 6);
      const uCost = getRandomInt(2, 5);
      const total1 = q1 * uCost;
      return {
        q: `Αν τα ${q1} τετράδια κοστίζουν ${fmt(total1)} €, πόσο κοστίζει το 1 τετράδιο;`,
        correct: `${fmt(uCost)} €`,
        wrongs: [`${fmt(uCost + 1)} €`, `${fmt(uCost + 2)} €`, `${fmt(total1)} €`],
        explainText: `Βήμα 1: Διαιρούμε ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} € το 1 τετράδιο.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(2, 4);
      const uCost = getRandomInt(2, 5);
      const total1 = q1 * uCost;
      const q2 = getRandomInt(5, 8);
      const total2 = q2 * uCost;
      return {
        q: `Αν οι ${q1} σοκολάτες κοστίζουν ${fmt(total1)} €, πόσο κοστίζουν οι ${q2} ίδιες σοκολάτες;`,
        correct: `${fmt(total2)} €`,
        wrongs: [`${fmt(total2 + uCost)} €`, `${fmt(Math.max(1, total2 - uCost))} €`, `${fmt(total1 * q2)} €`],
        explainText: `Βήμα 1: Η 1 σοκολάτα κοστίζει ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. Βήμα 2: Οι ${q2} σοκολάτες κοστίζουν ${q2} · ${fmt(uCost)} ＝ ${fmt(total2)} €.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(2, 4);
      const uCost = getRandomInt(3, 6);
      const total1 = q1 * uCost;
      const q2 = getRandomInt(5, 7);
      const total2 = q2 * uCost;
      return {
        q: `Αν τα ${q1} βιβλία κοστίζουν ${fmt(total1)} €, πόσο κοστίζουν τα ${q2} ίδια βιβλία;`,
        correct: `${fmt(total2)} €`,
        wrongs: [`${fmt(total2 + uCost)} €`, `${fmt(Math.max(1, total2 - uCost))} €`, `${fmt(total1 + total2)} €`],
        explainText: `Βήμα 1: Το 1 βιβλίο κοστίζει ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. Βήμα 2: Τα ${q2} βιβλία κοστίζουν ${q2} · ${fmt(uCost)} ＝ ${fmt(total2)} €.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(3, 5);
      const uCost = getRandomInt(2, 4);
      const total1 = q1 * uCost;
      const targetCost = getRandomInt(6, 10) * uCost;
      const targetQty = targetCost / uCost;
      return {
        q: `Αν οι ${q1} χυμοί κοστίζουν ${fmt(total1)} €, πόσους χυμούς μπορούμε να αγοράσουμε με ${fmt(targetCost)} €;`,
        correct: `${targetQty} χυμούς`,
        wrongs: [`${targetQty + 1} χυμούς`, `${Math.max(1, targetQty - 1)} χυμούς`, `${targetQty + 2} χυμούς`],
        explainText: `Ο 1 χυμός κοστίζει ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. Με ${fmt(targetCost)} € αγοράζουμε: ${fmt(targetCost)} ： ${fmt(uCost)} ＝ ${targetQty} χυμούς.`
      };
    },
    (fmt) => {
      const speed = getRandomInt(60, 90);
      const hours = getRandomInt(2, 4);
      const dist = speed * hours;
      const newHours = hours + getRandomInt(2, 3);
      const newDist = speed * newHours;
      return {
        q: `Ένα αυτοκίνητο διανύει ${fmt(dist)} χιλιόμετρα σε ${hours} ώρες. Πόσα χιλιόμετρα θα διανύσει σε ${newHours} ώρες με την ίδια σταθερή ταχύτητα;`,
        correct: `${fmt(newDist)} χιλιόμετρα`,
        wrongs: [`${fmt(newDist + speed)} χιλιόμετρα`, `${fmt(Math.max(10, newDist - speed))} χιλιόμετρα`, `${fmt(dist * 2)} χιλιόμετρα`],
        explainText: `Σε 1 ώρα διανύει ${fmt(dist)} ： ${hours} ＝ ${fmt(speed)} km. Σε ${newHours} ώρες θα διανύσει ${newHours} · ${fmt(speed)} ＝ ${fmt(newDist)} km.`
      };
    },
    () => ({
      q: 'Γιατί η συγκεκριμένη μέθοδος επίλυσης ονομάζεται «Αναγωγή στη Μονάδα»;',
      correct: 'Επειδή ως απαραίτητο ενδιάμεσο βήμα βρίσκουμε πάντοτε την τιμή του ενός (της μονάδας)',
      wrongs: ['Επειδή προσθέτουμε πάντοτε το 1', 'Επειδή αφαιρούμε τη μονάδα', 'Επειδή πολλαπλασιάζουμε με το 1'],
      explainText: 'Ονομάζεται έτσι επειδή οδηγούμε (ανάγουμε) το πρόβλημα στον υπολογισμό του ενός αντικειμένου.'
    })
  ],
  en: [
    () => ({
      q: 'In the base-10 decimal system, what determines the actual value of a digit in a number?',
      correct: 'The place/position it occupies in the number',
      wrongs: ['How large the digit itself looks', 'Whether the number is even or odd', 'It is always constant and identical'],
      explainText: 'The value of each digit is determined by its place value period (Units, Tens, Hundreds, etc.).'
    }),
    () => ({
      q: 'How many digits are grouped together to form place value periods in large numbers?',
      correct: 'Groups of 3 digits from right to left',
      wrongs: ['Groups of 2 digits from left', 'Groups of 4 digits from right', 'Groups of 3 digits from left to right'],
      explainText: 'We group digits in threes starting strictly from the right (Units, Tens, Hundreds).'
    }),
    (fmt) => {
      const ex = getRandomInt(2, 9);
      const val = ex * 100000;
      return {
        q: `How many units is the digit ${ex} worth when placed in the Hundred Thousands position?`,
        correct: `${fmt(val)}`,
        wrongs: [`${fmt(ex * 10000)}`, `${fmt(ex * 1000)}`, `${fmt(ex * 100)}`],
        explainText: `In the Hundred Thousands place, the digit ${ex} has a value of ${ex} · 100,000 ＝ ${fmt(val)}.`
      };
    },
    (fmt) => {
      const dx = getRandomInt(2, 9);
      const val = dx * 10000;
      return {
        q: `How many units is the digit ${dx} worth when placed in the Ten Thousands position?`,
        correct: `${fmt(val)}`,
        wrongs: [`${fmt(dx * 100000)}`, `${fmt(dx * 1000)}`, `${fmt(dx * 100)}`],
        explainText: `In the Ten Thousands place, the digit ${dx} has a value of ${dx} · 10,000 ＝ ${fmt(val)}.`
      };
    },
    () => ({
      q: 'What is the immediate next natural number after 999,999?',
      correct: '1,000,000 (1 million)',
      wrongs: ['100,000', '1,000,001', '999,998'],
      explainText: 'Adding 1 unit gives: 999,999 ＋ 1 ＝ 1,000,000.'
    }),
    () => ({
      q: 'What is the immediate preceding natural number of 500,000?',
      correct: '499,999',
      wrongs: ['499,990', '490,000', '500,001'],
      explainText: 'Subtracting 1 unit gives: 500,000 － 1 ＝ 499,999.'
    }),
    () => ({
      q: 'How many Ten Thousands are needed to make 1 Hundred Thousand (100,000)?',
      correct: '10 Ten Thousands',
      wrongs: ['100 Ten Thousands', '1,000 Ten Thousands', '5 Ten Thousands'],
      explainText: 'The identity holds: 10 · 10,000 ＝ 100,000.'
    }),
    () => ({
      q: 'How many Hundred Thousands are needed to make 1 Million (1,000,000)?',
      correct: '10 Hundred Thousands',
      wrongs: ['100 Hundred Thousands', '1,000 Hundred Thousands', '20 Hundred Thousands'],
      explainText: 'The identity holds: 10 · 100,000 ＝ 1,000,000.'
    }),
    (fmt) => {
      const a = getRandomInt(300, 800) * 1000;
      const b = a + getRandomInt(10, 90) * 10;
      return {
        q: `Which comparison statement is correct between ${fmt(a)} and ${fmt(b)}?`,
        correct: `${fmt(a)} ＜ ${fmt(b)}`,
        wrongs: [`${fmt(a)} ＞ ${fmt(b)}`, `${fmt(a)} ＝ ${fmt(b)}`, `${fmt(b)} ＜ ${fmt(a)}`],
        explainText: `The number ${fmt(a)} is strictly less than ${fmt(b)}.`
      };
    },
    () => ({
      q: 'In the number 704,050, which digit is in the Thousands position?',
      correct: '4',
      wrongs: ['7', '0', '5'],
      explainText: 'In 704,050: 7＝HT, 0＝TT, 4＝T, 0＝H, 5＝T, 0＝U.'
    }),
    () => ({
      q: 'What is the smallest 6-digit natural number?',
      correct: '100,000',
      wrongs: ['100,001', '111,111', '999,999'],
      explainText: 'The smallest 6-digit natural number is 100,000 (one hundred thousand).'
    }),
    () => ({
      q: 'What is the largest 6-digit natural number?',
      correct: '999,999',
      wrongs: ['1,000,000', '900,000', '999,000'],
      explainText: 'The largest 6-digit natural number is 999,999; its successor (1,000,000) has 7 digits.'
    }),
    (fmt) => {
      const ex = getRandomInt(2, 8);
      const dx = getRandomInt(1, 9);
      const total = ex * 100000 + dx * 10000;
      return {
        q: `Which number consists of ${ex} Hundred Thousands and ${dx} Ten Thousands (with all other digits being 0)?`,
        correct: `${fmt(total)}`,
        wrongs: [`${fmt(ex * 10000 + dx * 1000)}`, `${fmt(ex * 100000 + dx * 1000)}`, `${fmt(ex * 100000 + dx * 100)}`],
        explainText: `We calculate (${ex} · 100,000) ＋ (${dx} · 10,000) ＝ ${fmt(total)}.`
      };
    },
    () => ({
      q: 'How is the number 405,008 read correctly?',
      correct: 'Four hundred five thousand eight',
      wrongs: ['Four hundred fifty thousand eight', 'Four thousand five hundred eight', 'Four hundred five thousand eighty'],
      explainText: 'We first read the thousands period (405 thousand) and then the units period (8).'
    }),
    () => ({
      q: 'When comparing two numbers with the same number of digits, from which digit do we begin comparing?',
      correct: 'From the first digit on the left (with the highest place value)',
      wrongs: ['From the last digit on the right (units)', 'From the middle digit', 'Order does not matter'],
      explainText: 'Comparison always begins from the highest place value on the far left.'
    }),
    () => ({
      q: 'How many units are equivalent to 250 hundreds?',
      correct: '25,000 units',
      wrongs: ['2,500 units', '250,000 units', '250 units'],
      explainText: 'We calculate: 250 · 100 ＝ 25,000 units.'
    }),
    () => ({
      q: 'In column multiplication with a 3-digit multiplier, how many partial products are formed?',
      correct: '3 partial products',
      wrongs: ['2 partial products', '4 partial products', '1 partial product'],
      explainText: '3 partial products are formed: one for units, one for tens, and one for hundreds.'
    }),
    () => ({
      q: 'When calculating the 2nd partial product (multiplying by Tens), what do we write on the far right?',
      correct: 'One zero (0) or shift 1 space left',
      wrongs: ['Two zeros (00)', 'Three zeros (000)', 'Nothing at all'],
      explainText: 'Since we multiply by tens (· 10), we write 1 zero (0) in the units place.'
    }),
    () => ({
      q: 'When calculating the 3rd partial product (multiplying by Hundreds), what do we write on the far right?',
      correct: 'Two zeros (00) or shift 2 spaces left',
      wrongs: ['One zero (0)', 'Three zeros (000)', 'No zeros'],
      explainText: 'Since we multiply by hundreds (· 100), we write 2 zeros (00).'
    }),
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `What is the product ${a} · 100?`,
        correct: `${fmt(a * 100)}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 1000)}`, `${fmt(a + 100)}`],
        explainText: `To multiply by 100, append two zeros at the end: ${a} · 100 ＝ ${fmt(a * 100)}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(12, 95);
      return {
        q: `What is the product ${a} · 1,000?`,
        correct: `${fmt(a * 1000)}`,
        wrongs: [`${fmt(a * 100)}`, `${fmt(a * 10000)}`, `${fmt(a + 1000)}`],
        explainText: `To multiply by 1,000, append three zeros at the end: ${a} · 1,000 ＝ ${fmt(a * 1000)}.`
      };
    },
    () => ({
      q: 'What is the commutative property of multiplication?',
      correct: 'a · b ＝ b · a (changing the order of factors does not change the product)',
      wrongs: ['a ＋ b ＝ b ＋ a', 'a · 1 ＝ a', 'a · 0 ＝ 0'],
      explainText: 'In multiplication, the factors can be reordered without changing the final product.'
    }),
    () => ({
      q: 'When multiplying any number by 0, the result is:',
      correct: 'Always 0',
      wrongs: ['The number itself', '1', '100'],
      explainText: 'Zero absorbs the multiplication: a · 0 ＝ 0.'
    }),
    () => ({
      q: 'When multiplying any number by 1, the result is:',
      correct: 'The number itself',
      wrongs: ['0', '1', 'The consecutive number'],
      explainText: '1 is the identity element of multiplication: a · 1 ＝ a.'
    }),
    (fmt) => {
      const a = getRandomInt(120, 350);
      const u = getRandomInt(2, 5);
      const total = a * u * 100;
      return {
        q: `In the multiplication ${a} · ${u}00, what is the correct result?`,
        correct: `${fmt(total)}`,
        wrongs: [`${fmt(a * u * 10)}`, `${fmt(a * u * 1000)}`, `${fmt(a * u)}`],
        explainText: `Compute ${a} · ${u} ＝ ${fmt(a * u)} and append two zeros: ${fmt(total)}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(15, 45);
      return {
        q: `If we know that ${a} · 4 ＝ ${fmt(a * 4)}, how much is ${a} · 400?`,
        correct: `${fmt(a * 400)}`,
        wrongs: [`${fmt(a * 40)}`, `${fmt(a * 4000)}`, `${fmt(a * 4 + 400)}`],
        explainText: `We have ${a} · 400 ＝ (${a} · 4) · 100 ＝ ${fmt(a * 4)} · 100 ＝ ${fmt(a * 400)}.`
      };
    },
    () => ({
      q: 'What are the terms of multiplication called?',
      correct: 'Multiplicand, Multiplier, and Product',
      wrongs: ['Dividend, Divisor, and Quotient', 'Addend, Addend, and Sum', 'Minuend, Subtrahend, and Difference'],
      explainText: 'Numbers being multiplied are factors (multiplicand and multiplier), and the result is the product.'
    }),
    () => ({
      q: 'How is the final product obtained in column multiplication?',
      correct: 'By adding all the partial products together',
      wrongs: ['By multiplying the partial products together', 'By subtracting the partial products', 'By keeping only the last partial product'],
      explainText: 'The final product is the sum of all partial products.'
    }),
    () => ({
      q: 'In every integer division, what relationship ALWAYS holds between the remainder (r) and the divisor (d)?',
      correct: 'The remainder is always strictly less than the divisor (r ＜ d)',
      wrongs: ['The remainder is always greater than the divisor (r ＞ d)', 'The remainder is always equal to the divisor (r ＝ d)', 'There is no restriction'],
      explainText: 'Under the Euclidean division theorem, the remainder must strictly satisfy r ＜ d.'
    }),
    () => ({
      q: 'When is a division called Exact?',
      correct: 'When its remainder is equal to zero (r ＝ 0)',
      wrongs: ['When the quotient is 0', 'When the divisor is 1-digit', 'When the remainder is 1'],
      explainText: 'An exact division has no remainder left over (r ＝ 0).'
    }),
    () => ({
      q: 'When is a division called Inexact (with remainder)?',
      correct: 'When its remainder is greater than zero (r ＞ 0)',
      wrongs: ['When its remainder is 0', 'When the quotient is 0', 'When the quotient cannot be computed'],
      explainText: 'A division is inexact when there is a non-zero remainder remaining (r ＞ 0).'
    }),
    () => ({
      q: 'What is the Euclidean verification formula for division?',
      correct: 'Dividend ＝ (Divisor · Quotient) ＋ Remainder',
      wrongs: ['Dividend ＝ (Divisor ＋ Quotient) · Remainder', 'Divisor ＝ (Dividend · Quotient) ＋ Remainder', 'Quotient ＝ Dividend ＋ Divisor'],
      explainText: 'Euclidean division always satisfies: D ＝ (d · q) ＋ r.'
    }),
    (fmt) => {
      const d = getRandomInt(12, 35);
      const q = getRandomInt(10, 30);
      const r = getRandomInt(1, d - 1);
      const D = d * q + r;
      return {
        q: `In a division, divisor d ＝ ${d}, quotient q ＝ ${q}, and remainder r ＝ ${r}. What is the Dividend (D)?`,
        correct: `${fmt(D)}`,
        wrongs: [`${fmt(d * q)}`, `${fmt(D + 10)}`, `${fmt(d + q + r)}`],
        explainText: `Compute: D ＝ (d · q) ＋ r ＝ (${d} · ${q}) ＋ ${r} ＝ ${fmt(d * q)} ＋ ${r} ＝ ${fmt(D)}.`
      };
    },
    () => {
      const d = getRandomInt(15, 60);
      return {
        q: `If the divisor in a division is d ＝ ${d}, what is the GREATEST possible remainder?`,
        correct: `${d - 1}`,
        wrongs: [`${d}`, `${d + 1}`, '0'],
        explainText: `Because r ＜ d, the maximum possible remainder is always d － 1 ＝ ${d - 1}.`
      };
    },
    () => ({
      q: 'Which operation is NEVER mathematically defined?',
      correct: 'Division by zero (dividing by 0)',
      wrongs: ['Multiplication by zero', 'Subtraction of zero', 'Addition of zero'],
      explainText: 'Division by zero is undefined in mathematics.'
    }),
    () => ({
      q: 'When dividing 0 by any non-zero number (e.g., 0 ： 25), the result is:',
      correct: '0',
      wrongs: ['25', '1', 'Not possible'],
      explainText: 'Zero divided by any non-zero number is always zero: 0 ： a ＝ 0.'
    }),
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `What is ${fmt(a * 100)} ： 100?`,
        correct: `${a}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 100)}`, '0'],
        explainText: `Dividing by 100 removes two trailing zeros: ${fmt(a * 100)} ： 100 ＝ ${a}.`
      };
    },
    (fmt) => {
      const a = getRandomInt(12, 85);
      return {
        q: `What is ${fmt(a * 10)} ： 10?`,
        correct: `${a}`,
        wrongs: [`${fmt(a * 10)}`, `${fmt(a * 100)}`, '1'],
        explainText: `Dividing by 10 removes one trailing zero: ${fmt(a * 10)} ： 10 ＝ ${a}.`
      };
    },
    () => ({
      q: 'When dividing a non-zero number by itself (e.g., 45 ： 45), the quotient is:',
      correct: '1',
      wrongs: ['0', '45', '2'],
      explainText: 'Any non-zero number divided by itself equals 1: a ： a ＝ 1.'
    }),
    () => ({
      q: 'When dividing a number by 1 (e.g., 84 ： 1), the quotient is:',
      correct: 'The number itself (84)',
      wrongs: ['1', '0', '85'],
      explainText: 'Any number divided by 1 remains unchanged: a ： 1 ＝ a.'
    }),
    () => ({
      q: 'What is STEP 1 in the Unitary Method?',
      correct: 'Divide ( ： ) to determine the value/quantity of 1 single unit',
      wrongs: ['Multiply to find the target total', 'Add the given quantities', 'Subtract the cost'],
      explainText: 'In step 1, divide total value by quantity to find the price for 1 unit.'
    }),
    () => ({
      q: 'What is STEP 2 in the Unitary Method?',
      correct: 'Multiply ( · ) the unit value by the new required quantity',
      wrongs: ['Divide by the new quantity', 'Subtract the cost', 'Add 10'],
      explainText: 'In step 2, multiply the single-unit price by the target quantity requested.'
    }),
    (fmt) => {
      const q1 = getRandomInt(3, 6);
      const uCost = getRandomInt(2, 5);
      const total1 = q1 * uCost;
      return {
        q: `If ${q1} notebooks cost ${fmt(total1)} €, how much does 1 notebook cost?`,
        correct: `${fmt(uCost)} €`,
        wrongs: [`${fmt(uCost + 1)} €`, `${fmt(uCost + 2)} €`, `${fmt(total1)} €`],
        explainText: `Step 1: Divide ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} € for 1 notebook.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(2, 4);
      const uCost = getRandomInt(2, 5);
      const total1 = q1 * uCost;
      const q2 = getRandomInt(5, 8);
      const total2 = q2 * uCost;
      return {
        q: `If ${q1} chocolate bars cost ${fmt(total1)} €, how much do ${q2} identical bars cost?`,
        correct: `${fmt(total2)} €`,
        wrongs: [`${fmt(total2 + uCost)} €`, `${fmt(Math.max(1, total2 - uCost))} €`, `${fmt(total1 * q2)} €`],
        explainText: `Step 1: 1 bar costs ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. Step 2: ${q2} bars cost ${q2} · ${fmt(uCost)} ＝ ${fmt(total2)} €.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(2, 4);
      const uCost = getRandomInt(3, 6);
      const total1 = q1 * uCost;
      const q2 = getRandomInt(5, 7);
      const total2 = q2 * uCost;
      return {
        q: `If ${q1} books cost ${fmt(total1)} €, how much do ${q2} identical books cost?`,
        correct: `${fmt(total2)} €`,
        wrongs: [`${fmt(total2 + uCost)} €`, `${fmt(Math.max(1, total2 - uCost))} €`, `${fmt(total1 + total2)} €`],
        explainText: `Step 1: 1 book costs ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. Step 2: ${q2} books cost ${q2} · ${fmt(uCost)} ＝ ${fmt(total2)} €.`
      };
    },
    (fmt) => {
      const q1 = getRandomInt(3, 5);
      const uCost = getRandomInt(2, 4);
      const total1 = q1 * uCost;
      const targetCost = getRandomInt(6, 10) * uCost;
      const targetQty = targetCost / uCost;
      return {
        q: `If ${q1} juice boxes cost ${fmt(total1)} €, how many juice boxes can we buy with ${fmt(targetCost)} €?`,
        correct: `${targetQty} juice boxes`,
        wrongs: [`${targetQty + 1} juice boxes`, `${Math.max(1, targetQty - 1)} juice boxes`, `${targetQty + 2} juice boxes`],
        explainText: `1 juice box costs ${fmt(total1)} ： ${q1} ＝ ${fmt(uCost)} €. With ${fmt(targetCost)} € we buy: ${fmt(targetCost)} ： ${fmt(uCost)} ＝ ${targetQty} juice boxes.`
      };
    },
    (fmt) => {
      const speed = getRandomInt(60, 90);
      const hours = getRandomInt(2, 4);
      const dist = speed * hours;
      const newHours = hours + getRandomInt(2, 3);
      const newDist = speed * newHours;
      return {
        q: `A car travels ${fmt(dist)} kilometers in ${hours} hours. How many kilometers will it travel in ${newHours} hours at the same constant speed?`,
        correct: `${fmt(newDist)} kilometers`,
        wrongs: [`${fmt(newDist + speed)} kilometers`, `${fmt(Math.max(10, newDist - speed))} kilometers`, `${fmt(dist * 2)} kilometers`],
        explainText: `In 1 hour it travels ${fmt(dist)} ： ${hours} ＝ ${fmt(speed)} km. In ${newHours} hours it will travel ${newHours} · ${fmt(speed)} ＝ ${fmt(newDist)} km.`
      };
    },
    () => ({
      q: 'Why is this problem-solving technique named the "Unitary Method"?',
      correct: 'Because it relies on calculating the value of 1 single unit as a crucial step',
      wrongs: ['Because we always add 1', 'Because we subtract the unit', 'Because we multiply by 1'],
      explainText: 'It is named so because it reduces (leads) the problem to finding the value of one single unit first.'
    })
  ]
};

function generateRandomExam(locale) {
  const pool = THEORY_QUESTIONS_POOL[locale] || THEORY_QUESTIONS_POOL.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((fn, index) => {
    const raw = fn(formatNum);
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
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewExam = () => {
    const newQuestions = generateRandomExam(locale);
    setQuestions(newQuestions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewExam();
  }, [locale]);

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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <button
          onClick={loadNewExam}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🔄</span> {t.newTestBtn}
        </button>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewExam}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.changeQuestionsBtn}
          </button>
        </div>

        {/* FORM ΕΡΩΤΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        <span className="break-words whitespace-normal leading-snug flex-1 font-mono font-bold text-sm sm:text-base">
                          {opt}
                        </span>
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
                        {t.correctAnswerPrefix} <strong className="font-mono font-bold text-rose-900">{q.correct}</strong>. {q.explainText}
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
                {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 15) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newTestBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.fillReminder}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}