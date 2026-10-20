import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΠΛΟΠΟΙΗΣΗΣ & ΠΙΝΑΚΩΝ ΤΙΜΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Απλή επιμεριστική (MCQ)
  () => {
    // 3*(x + 4) = 3x + 12
    return {
      type: 'mcq',
      topic: 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question: `Απλοποίησε την παράσταση: <strong>3 · (x ＋ 4)</strong>`,
      options: makeUniqueOptions('3 · x ＋ 12', ['3 · x ＋ 4', 'x ＋ 12', '7 · x']),
      correctAnswer: '3 · x ＋ 12',
      solution: `Πολλαπλασιάζουμε το 3 με κάθε όρο της παρένθεσης: 3 · x ＋ 3 · 4 ＝ 3 · x ＋ 12.`,
    };
  },

  // 2. Επιμεριστική με αρνητικό συντελεστή (MCQ)
  () => {
    // -2*(x - 5) = -2x + 10
    return {
      type: 'mcq',
      topic: 'ΠΡΟΣΗΜΑ & ΕΠΙΜΕΡΙΣΤΙΚΗ',
      question: `Απλοποίησε την παράσταση: <strong>－2 · (x － 5)</strong>`,
      options: makeUniqueOptions('－2 · x ＋ 10', ['－2 · x － 10', '2 · x － 10', '－2 · x － 5']),
      correctAnswer: '－2 · x ＋ 10',
      solution: `(－2) · x － (－2) · 5 ＝ －2x ＋ 10 (το γινόμενο δύο αρνητικών είναι θετικό).`,
    };
  },

  // 3. Επιμεριστική και αναγωγή ομοίων όρων (MCQ)
  () => {
    // 2*(x + 3) + 4x = 2x + 6 + 4x = 6x + 6
    return {
      type: 'mcq',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ',
      question: `Απλοποίησε την παράσταση: <strong>2 · (x ＋ 3) ＋ 4 · x</strong>`,
      options: makeUniqueOptions('6 · x ＋ 6', ['2 · x ＋ 10', '6 · x ＋ 3', '8 · x']),
      correctAnswer: '6 · x ＋ 6',
      solution: `1. Επιμεριστική: 2x ＋ 6. 2. Αναγωγή ομοίων όρων: 2x ＋ 4x ＋ 6 ＝ 6x ＋ 6.`,
    };
  },

  // 4. Υπολογισμός τιμής απλοποιημένης παράστασης (Input)
  () => {
    // 3*(x + 2) + 1 για x = 4 -> 3*6 + 1 = 19
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>3 · (x ＋ 2) ＋ 1</strong> για <strong>x ＝ 4</strong>:`,
      correctAnswer: '19',
      solution: `Μέσα στην παρένθεση: 4 ＋ 2 ＝ 6. Έπειτα: 3 · 6 ＋ 1 ＝ 18 ＋ 1 ＝ 19.`,
    };
  },

  // 5. Συμπλήρωση πίνακα τιμών (Input)
  () => {
    // y = 2x - 3. Για x = 5 -> y = 7
    return {
      type: 'input',
      topic: 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ',
      question: `Σε έναν πίνακα τιμών για την παράσταση <strong>2 · x － 3</strong>, ποια τιμή αντιστοιχεί για <strong>x ＝ 5</strong>;`,
      correctAnswer: '7',
      solution: `2 · 5 － 3 ＝ 10 － 3 ＝ 7.`,
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό αριθμό (Input)
  () => {
    // 2*(x - 1) + 5 για x = -3 -> 2*(-4) + 5 = -8 + 5 = -3
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>2 · (x － 1) ＋ 5</strong> για <strong>x ＝ －3</strong>:`,
      correctAnswer: '-3',
      solution: `Μέσα στην παρένθεση: －3 － 1 ＝ －4. Μετά: 2 · (－4) ＋ 5 ＝ －8 ＋ 5 ＝ －3.`,
    };
  },

  // 7. Αφαίρεση παρένθεσης με μείον μπροστά (MCQ)
  () => {
    // -(x + 7) = -x - 7
    return {
      type: 'mcq',
      topic: 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ',
      question: `Ποια είναι η απλοποιημένη μορφή της παράστασης: <strong>－(x ＋ 7)</strong>;`,
      options: makeUniqueOptions('－x － 7', ['－x ＋ 7', 'x － 7', '－7 · x']),
      correctAnswer: '－x － 7',
      solution: `Το μείον μπροστά από παρένθεση αλλάζει τα πρόσημα όλων των όρων μέσα σε αυτήν: －x － 7.`,
    };
  },

  // 8. Αφαίρεση παρένθεσης με μείον και εσωτερικό μείον (MCQ)
  () => {
    // -(x - 4) = -x + 4
    return {
      type: 'mcq',
      topic: 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ',
      question: `Ποια είναι η απλοποιημένη μορφή της παράστασης: <strong>－(x － 4)</strong>;`,
      options: makeUniqueOptions('－x ＋ 4', ['－x － 4', 'x ＋ 4', '4 · x']),
      correctAnswer: '－x ＋ 4',
      solution: `Αλλάζουμε όλα τα πρόσημα: το x γίνεται －x και το －4 γίνεται ＋4, άρα －x ＋ 4.`,
    };
  },

  // 9. Δύο επιμεριστικές μαζί (MCQ)
  () => {
    // 2*(x + 1) + 3*(x + 2) = 2x + 2 + 3x + 6 = 5x + 8
    return {
      type: 'mcq',
      topic: 'ΣΥΝΘΕΤΗ ΑΠΛΟΠΟΙΗΣΗ',
      question: `Απλοποίησε την παράσταση: <strong>2 · (x ＋ 1) ＋ 3 · (x ＋ 2)</strong>`,
      options: makeUniqueOptions('5 · x ＋ 8', ['5 · x ＋ 3', '6 · x ＋ 8', '5 · x ＋ 6']),
      correctAnswer: '5 · x ＋ 8',
      solution: `2x ＋ 2 ＋ 3x ＋ 6 ＝ (2 ＋ 3)x ＋ (2 ＋ 6) ＝ 5x ＋ 8.`,
    };
  },

  // 10. Τιμή για x = 0 (Input)
  () => {
    // 4*(x + 3) - 2x για x = 0 -> 4*3 - 0 = 12
    return {
      type: 'input',
      topic: 'ΤΙΜΗ ΓΙΑ x = 0',
      question: `Υπολόγισε την τιμή της παράστασης <strong>4 · (x ＋ 3) － 2 · x</strong> όταν <strong>x ＝ 0</strong>:`,
      correctAnswer: '12',
      solution: `Για x ＝ 0: 4 · (0 ＋ 3) － 2 · 0 ＝ 4 · 3 － 0 ＝ 12.`,
    };
  },

  // 11. Γεωμετρική ερμηνεία επιμεριστικής (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
      question: `Σε τι αντιστοιχεί γεωμετρικά η επιμεριστική ιδιότητα α · (β ＋ γ) ＝ α · β ＋ α · γ;`,
      options: makeUniqueOptions(
        'Στον υπολογισμό του εμβαδού ενός ορθογωνίου ως άθροισμα των εμβαδών δύο επιμέρους ορθογωνίων',
        [
          'Στον υπολογισμό του όγκου ενός κυλίνδρου',
          'Στην περίμετρο ενός κύκλου',
          'Στο άθροισμα των γωνιών ενός τριγώνου',
        ]
      ),
      correctAnswer: 'Στον υπολογισμό του εμβαδού ενός ορθογωνίου ως άθροισμα των εμβαδών δύο επιμέρους ορθογωνίων',
      solution: `Το εμβαδόν ορθογωνίου με ύψος α και βάση (β ＋ γ) ισούται με το άθροισμα των εμβαδών των δύο τμημάτων: α · β ＋ α · γ.`,
    };
  },

  // 12. Πίνακας τιμών: εύρεση τιμής εισόδου x (Input)
  () => {
    // 3*(x + 1) = 15 -> x + 1 = 5 -> x = 4
    return {
      type: 'input',
      topic: 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ',
      question: `Αν στην παράσταση <strong>3 · (x ＋ 1)</strong> το αποτέλεσμα είναι <strong>15</strong>, ποια είναι η τιμή του <strong>x</strong>;`,
      correctAnswer: '4',
      solution: `3 · (x ＋ 1) ＝ 15 ➔ x ＋ 1 ＝ 15 ： 3 ＝ 5 ➔ x ＝ 5 － 1 ＝ 4.`,
    };
  },

  // 13. Απλοποίηση με αφαίρεση (MCQ)
  () => {
    // 5*(x + 2) - 3*(x + 1) = 5x + 10 - 3x - 3 = 2x + 7
    return {
      type: 'mcq',
      topic: 'ΣΥΝΘΕΤΗ ΑΠΛΟΠΟΙΗΣΗ',
      question: `Απλοποίησε την παράσταση: <strong>5 · (x ＋ 2) － 3 · (x ＋ 1)</strong>`,
      options: makeUniqueOptions('2 · x ＋ 7', ['2 · x ＋ 13', '8 · x ＋ 7', '2 · x ＋ 1']),
      correctAnswer: '2 · x ＋ 7',
      solution: `5x ＋ 10 － 3x － 3 ＝ (5 － 3)x ＋ (10 － 3) ＝ 2x ＋ 7.`,
    };
  },

  // 14. Υπολογισμός τιμής για x = 1 (Input)
  () => {
    // 2*(3x + 4) - 5 για x = 1 -> 2*7 - 5 = 14 - 5 = 9
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>2 · (3 · x ＋ 4) － 5</strong> για <strong>x ＝ 1</strong>:`,
      correctAnswer: '9',
      solution: `Για x ＝ 1: 2 · (3 · 1 ＋ 4) － 5 ＝ 2 · 7 － 5 ＝ 14 － 5 ＝ 9.`,
    };
  },

  // 15. Κοινός παράγοντας (ανάποδη επιμεριστική) (MCQ)
  () => {
    // 4x + 12 = 4*(x + 3)
    return {
      type: 'mcq',
      topic: 'ΚΟΙΝΟΣ ΠΑΡΑΓΟΝΤΑΣ',
      question: `Ποια παράσταση προκύπτει αν βγάλουμε κοινό παράγοντα το 4 από την <strong>4 · x ＋ 12</strong>;`,
      options: makeUniqueOptions('4 · (x ＋ 3)', ['4 · (x ＋ 12)', 'x ＋ 3', '4 · (x ＋ 8)']),
      correctAnswer: '4 · (x ＋ 3)',
      solution: `Επειδή 12 ＝ 4 · 3, βγάζοντας κοινό παράγοντα το 4 έχουμε: 4 · (x ＋ 3).`,
    };
  },

  // 16. Συμπλήρωση πίνακα τιμών για x = -1 (Input)
  () => {
    // y = 4 - 3x για x = -1 -> 4 - 3*(-1) = 4 + 3 = 7
    return {
      type: 'input',
      topic: 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>4 － 3 · x</strong> όταν <strong>x ＝ －1</strong>:`,
      correctAnswer: '7',
      solution: `4 － 3 · (－1) ＝ 4 － (－3) ＝ 4 ＋ 3 ＝ 7.`,
    };
  },

  // 17. Επιμεριστική με δεκαδικό (MCQ)
  () => {
    // 0.5*(2x + 6) = x + 3
    return {
      type: 'mcq',
      topic: 'ΔΕΚΑΔΙΚΗ ΕΠΙΜΕΡΙΣΤΙΚΗ',
      question: `Απλοποίησε την παράσταση: <strong>0,5 · (2 · x ＋ 6)</strong>`,
      options: makeUniqueOptions('x ＋ 3', ['x ＋ 6', '2 · x ＋ 3', '0,5 · x ＋ 3']),
      correctAnswer: 'x ＋ 3',
      solution: `0,5 · 2x ＋ 0,5 · 6 ＝ 1x ＋ 3 ＝ x ＋ 3.`,
    };
  },

  // 18. Υπολογισμός τιμής με κλάσμα (Input)
  () => {
    // 6*(x/3 + 1) για x = 6 -> 6*(2 + 1) = 18
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Απλοποίησε και υπολόγισε την τιμή της παράστασης <strong>2 · x ＋ 6</strong> όταν <strong>x ＝ 6</strong>:`,
      correctAnswer: '18',
      solution: `2 · 6 ＋ 6 ＝ 12 ＋ 6 ＝ 18.`,
    };
  },

  // 19. Αναγωγή ομοίων με μεταβλητή x και σταθερούς (Input)
  () => {
    // 7x - 4x + 10 - 3 για x = 2 -> 3x + 7 = 6 + 7 = 13
    return {
      type: 'input',
      topic: 'ΑΝΑΓΩΓΗ & ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>7 · x － 4 · x ＋ 10 － 3</strong> για <strong>x ＝ 2</strong>:`,
      correctAnswer: '13',
      solution: `Απλοποίηση: 3x ＋ 7. Για x ＝ 2: 3 · 2 ＋ 7 ＝ 6 ＋ 7 ＝ 13.`,
    };
  },

  // 20. Επιμεριστική σε τρεις όρους (MCQ)
  () => {
    // 2*(x + y + 3) = 2x + 2y + 6
    return {
      type: 'mcq',
      topic: 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΣΕ 3 ΟΡΟΥΣ',
      question: `Απλοποίησε την παράσταση: <strong>2 · (x ＋ y ＋ 3)</strong>`,
      options: makeUniqueOptions('2 · x ＋ 2 · y ＋ 6', ['2 · x ＋ y ＋ 3', '2 · x ＋ 2 · y ＋ 3', 'x ＋ y ＋ 6']),
      correctAnswer: '2 · x ＋ 2 · y ＋ 6',
      solution: `Πολλαπλασιάζουμε το 2 με κάθε έναν από τους τρεις όρους: 2x ＋ 2y ＋ 6.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Περίμετρος ορθογωνίου με επιμεριστική
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο έχει πλάτος 5 μέτρα και μήκος ίσο με το πλάτος αυξημένο κατά 3 μέτρα. Ποια είναι η περίμετρος του ορθογωνίου σε μέτρα;`,
      correctAnswer: '26',
      solution: `Πλάτος: 5 m. Μήκος: 5 ＋ 3 ＝ 8 m. Περίμετρος: 2 · (5 ＋ 8) ＝ 2 · 13 ＝ 26 m.`,
    };
  },

  // Πρόβλημα 2: Αγορά σχολικών πακέτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ένας γονέας αγόρασε 3 όμοια σχολικά πακέτα για τα παιδιά του. Κάθε πακέτο περιέχει μια τσάντα αξίας 25 € και ένα σετ μαρκαδόρων αξίας 6 €. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: '93',
      solution: `Κόστος ανά πακέτο: 25 ＋ 6 ＝ 31 €. Συνολικό κόστος: 3 · (25 ＋ 6) ＝ 3 · 31 ＝ 93 €.`,
    };
  },

  // Πρόβλημα 3: Εμβαδόν διπλού αγροτεμαχίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ',
      question: `Ένα χωράφι έχει σταθερό πλάτος 20 μέτρα και χωρίζεται σε δύο τμήματα μήκους 35 μέτρων και 15 μέτρων αντίστοιχα. Ποιο είναι το συνολικό εμβαδόν του χωραφιού σε τ.μ.;`,
      correctAnswer: '1000',
      solution: `Συνολικό μήκος: 35 ＋ 15 ＝ 50 m. Εμβαδόν: 20 · (35 ＋ 15) ＝ 20 · 50 ＝ 1.000 τ.μ.`,
    };
  },

  // Πρόβλημα 4: Ομαδικά εισιτήρια και σνακ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΨΥΧΑΓΩΓΙΑ',
      question: `Μια παρέα 4 φίλων πήγε στον κινηματογράφο. Κάθε άτομο πλήρωσε 7,50 € για το εισιτήριό του και 3,50 € για αναψυκτικό. Πόσα ευρώ πλήρωσαν συνολικά όλοι μαζί;`,
      correctAnswer: '44',
      solution: `Κόστος ανά άτομο: 7,50 ＋ 3,50 ＝ 11 €. Συνολικό κόστος: 4 · 11 ＝ 44 €.`,
    };
  },

  // Πρόβλημα 5: Κατασκευή περιφράξεων με διαστήματα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Ένας κηπουρός θέλει να περιφράξει 2 όμοια παρτέρια. Κάθε παρτέρι έχει διαστάσεις 4 μέτρα επί 6 μέτρα. Πόσα μέτρα φράχτη θα χρειαστεί συνολικά;`,
      correctAnswer: '40',
      solution: `Περίμετρος ενός παρτεριού: 2 · (4 ＋ 6) ＝ 2 · 10 ＝ 20 m. Για 2 παρτέρια: 2 · 20 ＝ 40 m.`,
    };
  },

  // Πρόβλημα 6: Αποταμίευση σε δύο κουμπαράδες
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Δύο αδέλφια αποταμιεύουν μαζί. Ο πρώτος βάζει 4 € την εβδομάδα και ο δεύτερος 6 € την εβδομάδα. Πόσα χρήματα θα έχουν συγκεντρώσει συνολικά μετά από 8 εβδομάδες;`,
      correctAnswer: '80',
      solution: `Εβδομαδιαία αποταμίευση: 4 ＋ 6 ＝ 10 €. Σε 8 εβδομάδες: 8 · (4 ＋ 6) ＝ 8 · 10 ＝ 80 €.`,
    };
  },

  // Πρόβλημα 7: Εμβαδόν τοίχου με πόρτα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΔΟΜΗ',
      question: `Ένας τοίχος έχει ύψος 3 μέτρα και συνολικό μήκος 8 μέτρα, αλλά αφαιρείται μια πόρτα πλάτους 1 μέτρου (στο ίδιο ύψος 3 m). Ποιο είναι το καθαρό εμβαδόν βαφής σε τ.μ.;`,
      correctAnswer: '21',
      solution: `Καθαρό μήκος τοίχου: 8 － 1 ＝ 7 m. Εμβαδόν: 3 · (8 － 1) ＝ 3 · 7 ＝ 21 τ.μ.`,
    };
  },

  // Πρόβλημα 8: Αμοιβή υπερωριών συνεργείου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Ένα συνεργείο 5 τεχνικών εργάστηκε υπερωριακά. Κάθε τεχνικός πληρώνεται 12 € κανονική ωριαία αμοιβή συν 4 € ειδικό επίδομα υπερωρίας για κάθε ώρα. Πόσο κοστίζει 1 ώρα εργασίας όλου του συνεργείου;`,
      correctAnswer: '80',
      solution: `Αμοιβή ανά τεχνικό: 12 ＋ 4 ＝ 16 €. Για 5 τεχνικούς: 5 · (12 ＋ 4) ＝ 5 · 16 ＝ 80 €.`,
    };
  },

  // Πρόβλημα 9: Συσκευασία δώρων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Σε ένα κατάστημα ετοιμάζονται 6 όμοια καλάθια δώρων. Σε κάθε καλάθι τοποθετούνται προϊόντα αξίας 18 € συν 3 € για το καλάθι και την κορδέλα. Ποιο είναι το συνολικό κόστος των 6 καλαθιών;`,
      correctAnswer: '126',
      solution: `Κόστος ανά καλάθι: 18 ＋ 3 ＝ 21 €. Για 6 καλάθια: 6 · (18 ＋ 3) ＝ 6 · 21 ＝ 126 €.`,
    };
  },

  // Πρόβλημα 10: Κατανάλωση καυσίμου δύο οχημάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Δύο φορτηγά διανύουν την ίδια απόσταση των 4 εκατοντάδων χιλιομέτρων (400 km). Το πρώτο καίει 8 λίτρα ανά 100 km και το δεύτερο 11 λίτρα ανά 100 km. Πόσα λίτρα καυσίμου κατανάλωσαν συνολικά και τα δύο;`,
      correctAnswer: '76',
      solution: `Κατανάλωση ανά 100 km: 8 ＋ 11 ＝ 19 L. Για 400 km: 4 · (8 ＋ 11) ＝ 4 · 19 ＝ 76 L.`,
    };
  },

  // Πρόβλημα 11: Αγορά αθλητικών ειδών με έκπτωση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Μια ομάδα αγόρασε 10 μπάλες ποδοσφαίρου. Η αρχική τιμή κάθε μπάλας ήταν 20 €, αλλά έγινε έκπτωση 3 € σε κάθε μπάλα. Πόσα ευρώ πλήρωσε συνολικά η ομάδα;`,
      correctAnswer: '170',
      solution: `Τιμή μετά την έκπτωση: 20 － 3 ＝ 17 €. Για 10 μπάλες: 10 · (20 － 3) ＝ 10 · 17 ＝ 170 €.`,
    };
  },

  // Πρόβλημα 12: Διανομή φυλλαδίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΗΜΕΡΩΣΗ',
      question: `Τρεις εθελοντές μοίρασαν ενημερωτικά φυλλάδια σε 4 πολυκατοικίες. Αν σε κάθε πολυκατοικία μοίρασαν από 25 φυλλάδια ο καθένας, πόσα φυλλάδια μοιράστηκαν συνολικά σε κάθε πολυκατοικία;`,
      correctAnswer: '75',
      solution: `Σε κάθε πολυκατοικία μοιράζουν 3 εθελοντές από 25 φυλλάδια: 3 · 25 ＝ 75 φυλλάδια.`,
    };
  },

  // Πρόβλημα 13: Περίμετρος σύνθετου γραμμικού διαδρόμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο δωμάτιο έχει πλάτος 4 μέτρα και μήκος 7 μέτρα. Πόσα μέτρα σοβατεπί απαιτούνται για να τοποθετηθούν περιμετρικά σε 2 ίδια τέτοια δωμάτια;`,
      correctAnswer: '44',
      solution: `Περίμετρος ενός δωματίου: 2 · (4 ＋ 7) ＝ 2 · 11 ＝ 22 m. Για 2 δωμάτια: 2 · 22 ＝ 44 m.`,
    };
  },

  // Πρόβλημα 14: Ημερήσια έξοδα κατασκήνωσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΗΝΩΣΗ',
      question: `Σε μια κατασκήνωση το ημερήσιο κόστος ανά κατασκηνωτή είναι 14 € για διαμονή και 11 € για διατροφή. Πόσο κοστίζει η παραμονή ενός παιδιού για 6 ημέρες;`,
      correctAnswer: '150',
      solution: `Ημερήσιο κόστος: 14 ＋ 11 ＝ 25 €. Για 6 ημέρες: 6 · (14 ＋ 11) ＝ 6 · 25 ＝ 150 €.`,
    };
  },

  // Πρόβλημα 15: Εμβαδόν διπλού γηπέδου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Δύο διπλανά γήπεδα μπάσκετ έχουν κοινό πλάτος 15 μέτρα και μήκος 28 μέτρα το καθένα. Ποιο είναι το συνολικό εμβαδόν των δύο γηπέδων σε τ.μ.;`,
      correctAnswer: '840',
      solution: `Συνολικό μήκος: 28 ＋ 28 ＝ 56 m. Εμβαδόν: 15 · (28 ＋ 28) ＝ 15 · 56 ＝ 840 τ.μ. (ή 2 · (15 · 28) ＝ 840).`,
    };
  },

  // Πρόβλημα 16: Αγορά βιβλίων με έκπτωση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΑ',
      question: `Ένα σχολείο αγόρασε 8 αντίτυπα ενός λεξικού. Η αρχική τιμή ήταν 15 €, αλλά το βιβλιοπωλείο έκανε έκπτωση 2,50 € σε κάθε αντίτυπο. Πόσα ευρώ πλήρωσε το σχολείο;`,
      correctAnswer: '100',
      solution: `Τιμή ανά αντίτυπο: 15 － 2,50 ＝ 12,50 €. Για 8 αντίτυπα: 8 · 12,50 ＝ 100 €.`,
    };
  },

  // Πρόβλημα 17: Φύτευση παρτεριών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΣ',
      question: `Ένας γεωπόνος φυτεύει σε 5 σειρές τριανταφυλλιές και γαρυφαλλιές. Σε κάθε σειρά βάζει 8 τριανταφυλλιές και 12 γαρυφαλλιές. Πόσα φυτά φύτεψε συνολικά;`,
      correctAnswer: '100',
      solution: `Φυτά ανά σειρά: 8 ＋ 12 ＝ 20. Σε 5 σειρές: 5 · (8 ＋ 12) ＝ 5 · 20 ＝ 100 φυτά.`,
    };
  },

  // Πρόβλημα 18: Καθαρή αμοιβή με κρατήσεις
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ',
      question: `Ένας υπάλληλος αμείβεται με 12 € την ώρα, αλλά έχει κρατήσεις 2 € για κάθε ώρα εργασίας. Ποια είναι η καθαρή αμοιβή του για εργασία 30 ωρών σε ευρώ;`,
      correctAnswer: '300',
      solution: `Καθαρό ωρομίσθιο: 12 － 2 ＝ 10 €. Για 30 ώρες: 30 · (12 － 2) ＝ 30 · 10 ＝ 300 €.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φυλλαδίων σε παρτίδες
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΥΠΟΓΡΑΦΕΙΟ',
      question: `Τυπώθηκαν 4 παρτίδες φυλλαδίων. Κάθε παρτίδα περιείχε 150 έγχρωμα και 250 ασπρόμαυρα φυλλάδια. Πόσα φυλλάδια τυπώθηκαν συνολικά;`,
      correctAnswer: '1600',
      solution: `Φυλλάδια ανά παρτίδα: 150 ＋ 250 ＝ 400. Για 4 παρτίδες: 4 · (150 ＋ 250) ＝ 4 · 400 ＝ 1.600 φυλλάδια.`,
    };
  },

  // Πρόβλημα 20: Παραγωγή κουτιών σε δύο βάρδιες
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΟΣΤΑΣΙΟ',
      question: `Σε ένα εργοστάσιο λειτουργούν 3 ίδιες γραμμές παραγωγής. Κάθε γραμμή παράγει 45 μικρά κουτιά και 35 μεγάλα κουτιά ανά ώρα. Πόσα κουτιά παράγουν συνολικά και οι 3 γραμμές σε 1 ώρα;`,
      correctAnswer: '240',
      solution: `Παραγωγή μίας γραμμής: 45 ＋ 35 ＝ 80 κουτιά. Για 3 γραμμές: 3 · (45 ＋ 35) ＝ 3 · 80 ＝ 240 κουτιά.`,
    };
  },
];

export default function AplopoiisiAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο για κλάσματα, μείον και μεταβλητή x
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
      title="Ασκήσεις: Απλοποίηση Παραστάσεων & Πίνακες Τιμών | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην απλοποίηση αλγεβρικών παραστάσεων με επιμεριστική ιδιότητα και πίνακες τιμών για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/29-aplopoiisi"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 26 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Απλοποίηση Παραστάσεων & Πίνακες Τιμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις επιμεριστικής, αναγωγής και πινάκων τιμών + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 19 ή 7"
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
