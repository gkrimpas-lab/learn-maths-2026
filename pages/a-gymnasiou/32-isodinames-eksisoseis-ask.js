import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΙΣΟΔΥΝΑΜΩΝ ΕΞΙΣΩΣΕΩΝ & ΕΠΙΛΥΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Ορισμός ισοδύναμων εξισώσεων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΡΙΣΜΟΣ ΙΣΟΔΥΝΑΜΙΑΣ',
      question: `Πότε δύο εξισώσεις με τον ίδιο άγνωστο ονομάζονται <strong>ισοδύναμες</strong>;`,
      options: makeUniqueOptions(
        'Όταν έχουν ακριβώς τις ίδιες λύσεις (ή ρίζες)',
        [
          'Όταν έχουν τους ίδιους συντελεστές',
          'Όταν έχουν το ίδιο δεύτερο μέλος',
          'Όταν έχουν τον ίδιο αριθμό όρων'
        ]
      ),
      correctAnswer: 'Όταν έχουν ακριβώς τις ίδιες λύσεις (ή ρίζες)',
      solution: `Δύο εξισώσεις είναι ισοδύναμες αν και μόνο αν επαληθεύονται από τις ίδιες ακριβώς τιμές του αγνώστου.`,
    };
  },

  // 2. Μεταφορά όρου με αλλαγή προσήμου (MCQ)
  () => {
    // x + 5 = 12 <=> x = 12 - 5
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΟΡΑ ΟΡΟΥ',
      question: `Ποια είναι η σωστή ισοδύναμη μορφή της εξίσωσης <strong>x ＋ 5 ＝ 12</strong> μετά τη μεταφορά του 5 στο 2ο μέλος;`,
      options: makeUniqueOptions('x ＝ 12 － 5', ['x ＝ 12 ＋ 5', 'x ＝ 5 － 12', 'x ＝ 12 · 5']),
      correctAnswer: 'x ＝ 12 － 5',
      solution: `Όταν ένας όρος μεταφέρεται από το ένα μέλος στο άλλο, αλλάζει υποχρεωτικά το πρόσημό του: από ＋5 γίνεται －5.`,
    };
  },

  // 3. Επίλυση απλής εξίσωσης (Input)
  () => {
    // 3x = 21 -> x = 21/3 = 7
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ ΜΕ ΔΙΑΙΡΕΣΗ',
      question: `Λύσε την εξίσωση <strong>3 · x ＝ 21</strong> και βρες την τιμή του <strong>x</strong>:`,
      correctAnswer: '7',
      solution: `Διαιρούμε και τα δύο μέλη με τον συντελεστή 3: x ＝ <span class="font-mono text-indigo-700 font-bold">²¹⁄₃</span> ＝ 7.`,
    };
  },

  // 4. Μεταφορά αρνητικού όρου (MCQ)
  () => {
    // 2x - 4 = 10 <=> 2x = 10 + 4
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΟΡΑ ΟΡΟΥ',
      question: `Αν στην εξίσωση <strong>2 · x － 4 ＝ 10</strong> μεταφέρουμε το －4 στο δεύτερο μέλος, ποια ισοδύναμη εξίσωση προκύπτει;`,
      options: makeUniqueOptions('2 · x ＝ 10 ＋ 4', ['2 · x ＝ 10 － 4', 'x ＝ 10 ＋ 4', '2 · x ＝ 4 － 10']),
      correctAnswer: '2 · x ＝ 10 ＋ 4',
      solution: `Ο όρος －4 μεταφέρεται στο δεξί μέλος και αλλάζει πρόσημο σε ＋4: 2x ＝ 10 ＋ 4.`,
    };
  },

  // 5. Πλήρης επίλυση εξίσωσης a*x + b = c (Input)
  () => {
    // 4x + 3 = 19 -> 4x = 16 -> x = 16/4 = 4
    return {
      type: 'input',
      topic: 'ΠΛΗΡΗΣ ΕΠΙΛΥΣΗ',
      question: `Λύσε την εξίσωση: <strong>4 · x ＋ 3 ＝ 19</strong>`,
      correctAnswer: '4',
      solution: `1. Μεταφορά όρου: 4x ＝ 19 － 3 ➔ 4x ＝ 16.<br/>2. Διαίρεση με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">¹⁶⁄₄</span> ＝ 4.`,
    };
  },

  // 6. Εξίσωση με αρνητικό αποτέλεσμα (Input)
  () => {
    // 5x + 20 = 5 -> 5x = -15 -> x = -15/5 = -3
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ',
      question: `Λύσε την εξίσωση: <strong>5 · x ＋ 20 ＝ 5</strong>`,
      correctAnswer: '-3',
      solution: `5x ＝ 5 － 20 ➔ 5x ＝ －15. Διαιρούμε με το 5: x ＝ <span class="font-mono text-indigo-700 font-bold">－¹⁵⁄₅</span> ＝ －3.`,
    };
  },

  // 7. Έλεγχος ισοδυναμίας δύο εξισώσεων (MCQ)
  () => {
    // 2x = 8 (x=4) και 3x - 2 = 10 (3x=12 => x=4)
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ',
      question: `Είναι οι εξισώσεις <strong>2 · x ＝ 8</strong> και <strong>3 · x － 2 ＝ 10</strong> ισοδύναμες;`,
      options: makeUniqueOptions(
        'Ναι, διότι έχουν και οι δύο μοναδική λύση το x ＝ 4',
        [
          'Όχι, διότι έχουν διαφορετικούς συντελεστές',
          'Όχι, διότι η μία έχει δύο όρους και η άλλη έναν',
          'Ναι, διότι 8 ＋ 2 ＝ 10'
        ]
      ),
      correctAnswer: 'Ναι, διότι έχουν και οι δύο μοναδική λύση το x ＝ 4',
      solution: `Η πρώτη δίνει x ＝ <span class="font-mono text-indigo-700 font-bold">⁸⁄₂</span> ＝ 4. Η δεύτερη δίνει 3x ＝ 12 ➔ x ＝ <span class="font-mono text-indigo-700 font-bold">¹²⁄₃</span> ＝ 4. Έχουν την ίδια λύση, άρα είναι ισοδύναμες.`,
    };
  },

  // 8. Επίλυση με αρνητικό συντελεστή (Input)
  () => {
    // -3x + 2 = 14 -> -3x = 12 -> x = 12 / (-3) = -4
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Λύσε την εξίσωση: <strong>－3 · x ＋ 2 ＝ 14</strong>`,
      correctAnswer: '-4',
      solution: `－3x ＝ 14 － 2 ➔ －3x ＝ 12. Διαιρούμε με το －3: x ＝ <span class="font-mono text-indigo-700 font-bold">－¹²⁄₃</span> ＝ －4.`,
    };
  },

  // 9. Πολλαπλασιασμός με τον ίδιο αριθμό (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΕΣ ΙΣΟΤΗΤΑΣ',
      question: `Αν στην εξίσωση <strong>x ＝ 6</strong> πολλαπλασιάσουμε και τα δύο μέλη με το 4, ποια ισοδύναμη εξίσωση προκύπτει;`,
      options: makeUniqueOptions('4 · x ＝ 24', ['4 · x ＝ 6', 'x ＋ 4 ＝ 10', 'x ＝ 24']),
      correctAnswer: '4 · x ＝ 24',
      solution: `Πολλαπλασιάζουμε και τα δύο μέλη με το 4: 4 · x ＝ 4 · 6 ＝ 24.`,
    };
  },

  // 10. Επίλυση με άγνωστο και στα δύο μέλη (Input)
  () => {
    // 5x = 2x + 12 -> 3x = 12 -> x = 12/3 = 4
    return {
      type: 'input',
      topic: 'ΑΓΝΩΣΤΟΣ ΚΑΙ ΣΤΑ ΔΥΟ ΜΕΛΗ',
      question: `Λύσε την εξίσωση: <strong>5 · x ＝ 2 · x ＋ 12</strong>`,
      correctAnswer: '4',
      solution: `Μεταφέρουμε το 2x αριστερά: 5x － 2x ＝ 12 ➔ 3x ＝ 12. Διαιρούμε με το 3: x ＝ <span class="font-mono text-indigo-700 font-bold">¹²⁄₃</span> ＝ 4.`,
    };
  },

  // 11. Διαίρεση με μηδέν (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΙΣΟΤΗΤΑΣ',
      question: `Επιτρέπεται να διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με το <strong>0</strong>;`,
      options: makeUniqueOptions(
        'Όχι, η διαίρεση με το μηδέν δεν ορίζεται στα Μαθηματικά',
        [
          'Ναι, αρκεί να αλλάξουμε το πρόσημο',
          'Ναι, πάντοτε δίνει αποτέλεσμα 0',
          'Επιτρέπεται μόνο αν και το 2ο μέλος είναι 0'
        ]
      ),
      correctAnswer: 'Όχι, η διαίρεση με το μηδέν δεν ορίζεται στα Μαθηματικά',
      solution: `Στον κανόνα της ισοδυναμίας, ο αριθμός με τον οποίο διαιρούμε ή πολλαπλασιάζουμε πρέπει απαραίτητα να είναι διάφορος του μηδενός (γ ≠ 0).`,
    };
  },

  // 12. Επίλυση εξίσωσης με κλάσμα (Input)
  () => {
    // x/3 = 5 -> x = 15
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ',
      question: `Αν <span class="inline-flex items-center font-mono">x⁄3 ＝ 5</span>, ποια είναι η τιμή του <strong>x</strong>;`,
      correctAnswer: '15',
      solution: `Πολλαπλασιάζουμε και τα δύο μέλη με το 3: x ＝ 5 · 3 ＝ 15.`,
    };
  },

  // 13. Ποια εξίσωση ΔΕΝ είναι ισοδύναμη (MCQ)
  () => {
    // x = 5.
    // Α: 2x = 10 (x=5)
    // Β: x + 3 = 8 (x=5)
    // Γ: 3x - 1 = 14 (3x=15 => x=5)
    // Δ: 2x + 1 = 9 (2x=8 => x=4) -> ΔΕΝ είναι
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ',
      question: `Ποια από τις παρακάτω εξισώσεις <strong>ΔΕΝ είναι ισοδύναμη</strong> με την <strong>x ＝ 5</strong>;`,
      options: makeUniqueOptions('2 · x ＋ 1 ＝ 9', ['2 · x ＝ 10', 'x ＋ 3 ＝ 8', '3 · x － 1 ＝ 14']),
      correctAnswer: '2 · x ＋ 1 ＝ 9',
      solution: `Η εξίσωση 2x ＋ 1 ＝ 9 δίνει 2x ＝ 8 ➔ x ＝ <span class="font-mono text-indigo-700 font-bold">⁸⁄₂</span> ＝ 4 (όχι 5), άρα δεν είναι ισοδύναμη.`,
    };
  },

  // 14. Επίλυση: 6x - 7 = 2x + 9 (Input)
  () => {
    // 6x - 2x = 9 + 7 -> 4x = 16 -> x = 16/4 = 4
    return {
      type: 'input',
      topic: 'ΧΩΡΙΣΜΟΣ ΓΝΩΣΤΩΝ ΑΠΟ ΑΓΝΩΣΤΟΥΣ',
      question: `Λύσε την εξίσωση: <strong>6 · x － 7 ＝ 2 · x ＋ 9</strong>`,
      correctAnswer: '4',
      solution: `Χωρίζουμε γνωστούς από αγνώστους: 6x － 2x ＝ 9 ＋ 7 ➔ 4x ＝ 16. Διαιρούμε με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">¹⁶⁄₄</span> ＝ 4.`,
    };
  },

  // 15. Εύρεση ρίζας 0 (Input)
  () => {
    // 7x + 5 = 5 -> 7x = 0 -> x = 0
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ',
      question: `Ποια είναι η λύση της εξίσωσης <strong>7 · x ＋ 5 ＝ 5</strong>;`,
      correctAnswer: '0',
      solution: `7x ＝ 5 － 5 ➔ 7x ＝ 0. Διαιρούμε με το 7: x ＝ <span class="font-mono text-indigo-700 font-bold">⁰⁄₇</span> ＝ 0.`,
    };
  },

  // 16. Πράξη απαλοιφής παρονομαστή (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΠΑΛΟΙΦΗ ΠΑΡΟΝΟΜΑΣΤΗ',
      question: `Για να λύσουμε την εξίσωση <span class="font-mono">x⁄4 ＝ 3</span>, με ποιον αριθμό πολλαπλασιάζουμε και τα δύο μέλη;`,
      options: makeUniqueOptions('Με το 4', ['Με το 3', 'Με το 12', 'Με το 1']),
      correctAnswer: 'Με το 4',
      solution: `Πολλαπλασιάζουμε με τον παρονομαστή 4 για να απλοποιηθεί το κλάσμα: 4 · <span class="font-mono">x⁄4</span> ＝ 4 · 3 ➔ x ＝ 12.`,
    };
  },

  // 17. Επίλυση: 8x - 14 = 10 (Input)
  () => {
    // 8x = 24 -> x = 24/8 = 3
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ ΕΞΙΣΩΣΗΣ',
      question: `Λύσε την εξίσωση: <strong>8 · x － 14 ＝ 10</strong>`,
      correctAnswer: '3',
      solution: `8x ＝ 10 ＋ 14 ➔ 8x ＝ 24. Διαιρούμε με το 8: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁴⁄₈</span> ＝ 3.`,
    };
  },

  // 18. Σωστή διατύπωση κανόνα προσήμων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΑΣ ΜΕΤΑΦΟΡΑΣ',
      question: `Όταν ένας όρος αλλάζει μέλος σε μια εξίσωση:`,
      options: makeUniqueOptions(
        'Αλλάζει υποχρεωτικά το πρόσημό του (από ＋ σε － ή από － σε ＋)',
        [
          'Διατηρεί πάντα το αρχικό του πρόσημο',
          'Γίνεται υποχρεωτικά θετικός αριθμός',
          'Αντιστρέφεται σε κλάσμα'
        ]
      ),
      correctAnswer: 'Αλλάζει υποχρεωτικά το πρόσημό του (από ＋ σε － ή από － σε ＋)',
      solution: `Βάσει των ιδιοτήτων της ισότητας, η μεταφορά όρου ισοδυναμεί με πρόσθεση ή αφαίρεση του ίδιου όρου και στα δύο μέλη, άρα αλλάζει πρόσημο.`,
    };
  },

  // 19. Επίλυση με αναγωγή ομοίων στο 1ο μέλος (Input)
  () => {
    // 3x + 2x - 5 = 20 -> 5x - 5 = 20 -> 5x = 25 -> x = 25/5 = 5
    return {
      type: 'input',
      topic: 'ΑΝΑΓΩΓΗ ΚΑΙ ΕΠΙΛΥΣΗ',
      question: `Λύσε την εξίσωση: <strong>3 · x ＋ 2 · x － 5 ＝ 20</strong>`,
      correctAnswer: '5',
      solution: `Κάνουμε αναγωγή ομοίων όρων: 5x － 5 ＝ 20 ➔ 5x ＝ 25. Διαιρούμε με το 5: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁵⁄₅</span> ＝ 5.`,
    };
  },

  // 20. Επίλυση: -x + 4 = -3 (Input)
  () => {
    // -x = -7 -> x = 7
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ ΜΕ ΠΡΟΣΗΜΑ',
      question: `Λύσε την εξίσωση: <strong>－x ＋ 4 ＝ －3</strong>`,
      correctAnswer: '7',
      solution: `－x ＝ －3 － 4 ➔ －x ＝ －7. Διαιρούμε με το －1: x ＝ <span class="font-mono text-indigo-700 font-bold">－⁷⁄₋₁</span> ＝ 7.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Αγορά ρούχων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Νίκος αγόρασε 3 όμοια μπλουζάκια και ένα καπέλο που κόστιζε 8 €. Πλήρωσε συνολικά 50 €. Πόσα ευρώ κόστισε το κάθε μπλουζάκι;`,
      correctAnswer: '14',
      solution: `Έστω x η τιμή για κάθε μπλουζάκι. Εξίσωση: 3x ＋ 8 ＝ 50 ➔ 3x ＝ 42. Διαιρούμε με το 3: x ＝ <span class="font-mono text-indigo-700 font-bold">⁴²⁄₃</span> ＝ 14 €.`,
    };
  },

  // 2. Περίμετρος ισοσκελούς τριγώνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ισοσκελές τρίγωνο έχει βάση 10 cm και περίμετρο 36 cm. Πόσα εκατοστά είναι το μήκος καθεμιάς από τις δύο ίσες πλευρές του;`,
      correctAnswer: '13',
      solution: `Έστω x το μήκος καθεμιάς από τις ίσες πλευρές. Εξίσωση: 2x ＋ 10 ＝ 36 ➔ 2x ＝ 26. Διαιρούμε με το 2: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁶⁄₂</span> ＝ 13 cm.`,
    };
  },

  // 3. Ενοικίαση ποδηλάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΚΙΝΗΣΗ',
      question: `Η ενοικίαση ποδηλάτου κοστίζει 4 € πάγια ασφάλεια συν 3 € για κάθε ώρα χρήσης. Ένας τουρίστας πλήρωσε συνολικά 22 €. Πόσες ώρες κράτησε το ποδήλατο;`,
      correctAnswer: '6',
      solution: `Έστω x οι ώρες. Εξίσωση: 3x ＋ 4 ＝ 22 ➔ 3x ＝ 18. Διαιρούμε με το 3: x ＝ <span class="font-mono text-indigo-700 font-bold">¹⁸⁄₃</span> ＝ 6 ώρες.`,
    };
  },

  // 4. Ηλικία πατέρα και γιου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ',
      question: `Ένας πατέρας είναι 28 χρόνια μεγαλύτερος από τον γιο του. Αν το άθροισμα των ηλικιών τους είναι 44 χρόνια, ποια είναι η ηλικία του γιου;`,
      correctAnswer: '8',
      solution: `Έστω x η ηλικία του γιου. Ο πατέρας είναι x ＋ 28. Εξίσωση: x ＋ (x ＋ 28) ＝ 44 ➔ 2x ＋ 28 ＝ 44 ➔ 2x ＝ 16. Διαιρούμε με το 2: x ＝ <span class="font-mono text-indigo-700 font-bold">¹⁶⁄₂</span> ＝ 8 ετών.`,
    };
  },

  // 5. Αποταμίευση για ποδήλατο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Η Μαρία θέλει να αγοράσει ένα τάμπλετ αξίας 150 €. Έχει ήδη 30 € και αποταμιεύει 12 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα συγκεντρώσει το απαιτούμενο ποσό;`,
      correctAnswer: '10',
      solution: `Έστω x οι εβδομάδες. Εξίσωση: 12x ＋ 30 ＝ 150 ➔ 12x ＝ 120. Διαιρούμε με το 12: x ＝ <span class="font-mono text-indigo-700 font-bold">¹²⁰⁄₁₂</span> ＝ 10 εβδομάδες.`,
    };
  },

  // 6. Κόστος εκτύπωσης φυλλαδίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ',
      question: `Ένα τυπογραφείο χρεώνει 15 € πάγια έξοδα σχεδίασης συν 0,10 € για κάθε φυλλάδιο. Αν ο λογαριασμός ήταν 45 €, πόσα φυλλάδια τυπώθηκαν;`,
      correctAnswer: '300',
      solution: `Έστω x τα φυλλάδια. Εξίσωση: 0,10x ＋ 15 ＝ 45 ➔ 0,10x ＝ 30. Διαιρούμε με το 0,10: x ＝ <span class="font-mono text-indigo-700 font-bold">³⁰⁄₀,₁₀</span> ＝ 300 φυλλάδια.`,
    };
  },

  // 7. Πρόβλημα διαδοχικών αριθμών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Το άθροισμα δύο διαδοχικών ακεραίων αριθμών είναι 45. Ποιος είναι ο μικρότερος από τους δύο αριθμούς;`,
      correctAnswer: '22',
      solution: `Έστω x ο μικρότερος και x ＋ 1 ο επόμενος. Εξίσωση: x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44. Διαιρούμε με το 2: x ＝ <span class="font-mono text-indigo-700 font-bold">⁴⁴⁄₂</span> ＝ 22.`,
    };
  },

  // 8. Πλήρωση κιβωτίων με μήλα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Ένας παραγωγός έχει 85 κιλά μήλα. Κράτησε 5 κιλά για την οικογένειά του και τα υπόλοιπα τα μοίρασε εξίσου σε 8 ίδια τελάρα. Πόσα κιλά μήλα περιέχει κάθε τελάρο;`,
      correctAnswer: '10',
      solution: `Έστω x τα κιλά ανά τελάρο. Εξίσωση: 8x ＋ 5 ＝ 85 ➔ 8x ＝ 80. Διαιρούμε με το 8: x ＝ <span class="font-mono text-indigo-700 font-bold">⁸⁰⁄₈</span> ＝ 10 kg.`,
    };
  },

  // 9. Περίμετρος ορθογωνίου με σχέση πλευρών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Σε ένα ορθογώνιο το μήκος είναι διπλάσιο από το πλάτος. Αν η περίμετρος του ορθογωνίου είναι 48 μέτρα, ποιο είναι το πλάτος του σε μέτρα;`,
      correctAnswer: '8',
      solution: `Έστω x το πλάτος, άρα το μήκος είναι 2x. Περίμετρος: 2 · (x ＋ 2x) ＝ 48 ➔ 2 · 3x ＝ 48 ➔ 6x ＝ 48. Διαιρούμε με το 6: x ＝ <span class="font-mono text-indigo-700 font-bold">⁴⁸⁄₆</span> ＝ 8 m.`,
    };
  },

  // 10. Ταξί με απόσταση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί χρεώνει 3 € σημαία και 2 € για κάθε χιλιόμετρο διαδρομής. Αν ένας επιβάτης πλήρωσε 27 €, πόσα χιλιόμετρα ήταν η διαδρομή;`,
      correctAnswer: '12',
      solution: `Έστω x τα χιλιόμετρα. Εξίσωση: 2x ＋ 3 ＝ 27 ➔ 2x ＝ 24. Διαιρούμε με το 2: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁴⁄₂</span> ＝ 12 km.`,
    };
  },

  // 11. Κατανάλωση κεριού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα κερί έχει αρχικό ύψος 25 cm και κάθε ώρα που καίει μειώνεται κατά 2 cm. Μετά από πόσες ώρες το ύψος του θα είναι 11 cm;`,
      correctAnswer: '7',
      solution: `Έστω x οι ώρες. Εξίσωση: 25 － 2x ＝ 11 ➔ －2x ＝ 11 － 25 ➔ －2x ＝ －14. Διαιρούμε με το －2: x ＝ <span class="font-mono text-indigo-700 font-bold">－¹⁴⁄₋₂</span> ＝ 7 ώρες.`,
    };
  },

  // 12. Αμοιβή τεχνικού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ',
      question: `Ένας ηλεκτρολόγος χρεώνει 25 € για την επίσκεψη και 16 € για κάθε ώρα εργασίας. Αν η συνολική αμοιβή του ήταν 89 €, πόσες ώρες εργάστηκε;`,
      correctAnswer: '4',
      solution: `Έστω x οι ώρες. Εξίσωση: 16x ＋ 25 ＝ 89 ➔ 16x ＝ 64. Διαιρούμε με το 16: x ＝ <span class="font-mono text-indigo-700 font-bold">⁶⁴⁄₁₆</span> ＝ 4 ώρες.`,
    };
  },

  // 13. Πρόβλημα με εισιτήρια συναυλίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Μια παρέα αγόρασε 5 εισιτήρια για συναυλία και πλήρωσε επιπλέον 4 € συνολικά έξοδα κράτησης. Αν το συνολικό ποσό ήταν 79 €, πόσο κόστιζε το κάθε εισιτήριο;`,
      correctAnswer: '15',
      solution: `Έστω x η τιμή του εισιτηρίου. Εξίσωση: 5x ＋ 4 ＝ 79 ➔ 5x ＝ 75. Διαιρούμε με το 5: x ＝ <span class="font-mono text-indigo-700 font-bold">⁷⁵⁄₅</span> ＝ 15 €.`,
    };
  },

  // 14. Μοίρασμα καραμελών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Η δασκάλα μοίρασε 48 καραμέλες σε ίσα σακουλάκια των 6 καραμελών. Πόσα σακουλάκια έφτιαξε;`,
      correctAnswer: '8',
      solution: `Έστω x τα σακουλάκια. Εξίσωση: 6x ＝ 48. Διαιρούμε με το 6: x ＝ <span class="font-mono text-indigo-700 font-bold">⁴⁸⁄₆</span> ＝ 8 σακουλάκια.`,
    };
  },

  // 15. Φόρτιση μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Ένα κινητό έχει στάθμη μπαταρίας 12% και φορτίζει κατά 4% κάθε λεπτό. Σε πόσα λεπτά η μπαταρία θα φτάσει στο 60%;`,
      correctAnswer: '12',
      solution: `Έστω x τα λεπτά. Εξίσωση: 4x ＋ 12 ＝ 60 ➔ 4x ＝ 48. Διαιρούμε με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">⁴⁸⁄₄</span> ＝ 12 λεπτά.`,
    };
  },

  // 16. Γραφική ύλη
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Γιώργος αγόρασε 4 ίδια στυλό και πλήρωσε με χαρτονόμισμα των 10 €. Πήρε ρέστα 2 €. Πόσα ευρώ κόστισε το κάθε στυλό;`,
      correctAnswer: '2',
      solution: `Τα στυλό κόστισαν 10 － 2 ＝ 8 €. Εξίσωση: 4x ＝ 8. Διαιρούμε με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">⁸⁄₄</span> ＝ 2 €.`,
    };
  },

  // 17. Εμβαδόν ορθογωνίου με σταθερό πλάτος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο δωμάτιο έχει πλάτος 4 μέτρα και συνολικό εμβαδόν 28 τ.μ. Πόσα μέτρα είναι το μήκος του δωματίου;`,
      correctAnswer: '7',
      solution: `Έστω x το μήκος. Εμβαδόν: 4 · x ＝ 28. Διαιρούμε με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁸⁄₄</span> ＝ 7 m.`,
    };
  },

  // 18. Σχολικά βιβλία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΑ',
      question: `Ένα σχολείο αγόρασε 7 όμοια επιστημονικά βιβλία. Μαζί με έξοδα αποστολής 5 €, ο συνολικός λογαριασμός ήταν 96 €. Πόσο κόστιζε το κάθε βιβλίο;`,
      correctAnswer: '13',
      solution: `Έστω x η τιμή του βιβλίου. Εξίσωση: 7x ＋ 5 ＝ 96 ➔ 7x ＝ 91. Διαιρούμε με το 7: x ＝ <span class="font-mono text-indigo-700 font-bold">⁹¹⁄₇</span> ＝ 13 €.`,
    };
  },

  // 19. Άθροισμα τριπλάσιου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Αν σε έναν αριθμό προσθέσουμε το τριπλάσιό του, το αποτέλεσμα ισούται με 36. Ποιος είναι αυτός ο αριθμός;`,
      correctAnswer: '9',
      solution: `Έστω x ο αριθμός. Εξίσωση: x ＋ 3x ＝ 36 ➔ 4x ＝ 36. Διαιρούμε με το 4: x ＝ <span class="font-mono text-indigo-700 font-bold">³⁶⁄₄</span> ＝ 9.`,
    };
  },

  // 20. Αγορά πίτσας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ',
      question: `Μια παρέα παρήγγειλε 3 ίδιες πίτσες και πλήρωσε επιπλέον 2 € για τη διανομή. Αν πλήρωσαν συνολικά 29 €, πόσο κόστισε η κάθε πίτσα;`,
      correctAnswer: '9',
      solution: `Έστω x η τιμή της πίτσας. Εξίσωση: 3x ＋ 2 ＝ 29 ➔ 3x ＝ 27. Διαιρούμε με το 3: x ＝ <span class="font-mono text-indigo-700 font-bold">²⁷⁄₃</span> ＝ 9 €.`,
    };
  },
];

export default function IsodinamesEksisoseisAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις υπολογισμών/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Ισοδύναμες Εξισώσεις & Επίλυση | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στις ισοδύναμες εξισώσεις, τη μεταφορά όρων και την επίλυση για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/32-isodinames-eksisoseis"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 30 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ισοδύναμες Εξισώσεις & Επίλυση
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις κατανόησης κανόνων ισοδυναμίας και επίλυσης + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            ΠΡΟΒΛΗΜΑ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder="π.χ. 7 ή -3"
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <span className="text-emerald-700 font-black ml-1" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
