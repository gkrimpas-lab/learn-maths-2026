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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΝΑΠΑΡΑΣΤΑΣΗΣ ΚΑΝΟΝΙΚΟΤΗΤΩΝ (α · ν)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση συντελεστή α από πίνακα τιμών (Input)
  () => {
    // ν=1 -> 6, ν=2 -> 12, ν=3 -> 18 => α = 6
    return {
      type: 'input',
      topic: 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ',
      question: `Σε έναν πίνακα τιμών μιας κανονικότητας της μορφής <strong>α · ν</strong>, για ν ＝ 1 η τιμή είναι 6 και για ν ＝ 2 είναι 12. Ποιος είναι ο συντελεστής <strong>α</strong>;`,
      correctAnswer: '6',
      solution: `Για ν ＝ 1 έχουμε α · 1 ＝ 6, άρα α ＝ 6. Ο γενικός όρος είναι 6 · ν.`,
    };
  },

  // 2. Εύρεση συντεταγμένης y στο σύστημα αξόνων (Input)
  () => {
    // Τύπος 4ν. Για ν=3, ποιο είναι το y; (3, y) -> y=12
    return {
      type: 'input',
      topic: 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ',
      question: `Η κανονικότητα παριστάνεται στο σύστημα αξόνων από σημεία της μορφής (ν, y) με τύπο <strong>y ＝ 4 · ν</strong>. Ποια είναι η τεταγμένη <strong>y</strong> του σημείου με τετμημένη <strong>ν ＝ 3</strong>;`,
      correctAnswer: '12',
      solution: `Αντικαθιστούμε ν ＝ 3: y ＝ 4 · 3 ＝ 12. Το σημείο είναι το (3, 12).`,
    };
  },

  // 3. Εύρεση τύπου από γεωμετρικό μοτίβο (MCQ)
  () => {
    // Τετράγωνα ανεξάρτητα: 1 -> 4, 2 -> 8, 3 -> 12
    return {
      type: 'mcq',
      topic: 'ΓΕΩΜΕΤΡΙΚΟ ΜΟΤΙΒΟ',
      question: `Κατασκευάζουμε ανεξάρτητα τετράγωνα με σπίρτα: 1 τετράγωνο έχει 4 σπίρτα, 2 τετράγωνα έχουν 8, 3 τετράγωνα έχουν 12. Ποιος είναι ο τύπος για τα σπίρτα σε ν τετράγωνα;`,
      options: makeUniqueOptions('4 · ν', ['ν ＋ 4', '4 · ν ＋ 1', 'ν²']),
      correctAnswer: '4 · ν',
      solution: `Κάθε ανεξάρτητο τετράγωνο απαιτεί σταθερά 4 σπίρτα, άρα για ν τετράγωνα χρειαζόμαστε 4 · ν σπίρτα.`,
    };
  },

  // 4. Εύρεση του α με δεκαδικό συντελεστή (Input)
  () => {
    // y = 1,5 * ν. Για ν=4 -> y=6
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Αν ο γενικός όρος μιας κανονικότητας είναι <strong>1,5 · ν</strong>, ποια είναι η τιμή του <strong>4ου όρου</strong> (για ν ＝ 4);`,
      correctAnswer: '6',
      solution: `Για ν ＝ 4 υπολογίζουμε: 1,5 · 4 ＝ 6.`,
    };
  },

  // 5. Εύρεση τετμημένης ν από σημείο (Input)
  () => {
    // y = 5ν. Σημείο (ν, 35) -> ν = 7
    return {
      type: 'input',
      topic: 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ',
      question: `Στην ευθεία της κανονικότητας <strong>y ＝ 5 · ν</strong>, ένα σημείο έχει τεταγμένη <strong>y ＝ 35</strong>. Ποια είναι η τιμή του <strong>ν</strong>;`,
      correctAnswer: '7',
      solution: `5 · ν ＝ 35 ➔ ν ＝ 35 ： 5 ＝ 7. Το σημείο είναι το (7, 35).`,
    };
  },

  // 6. Αναγνώριση γραφικής παράστασης ευθείας (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ',
      question: `Τι μορφή έχουν τα σημεία μιας κανονικότητας <strong>α · ν</strong> όταν σχεδιαστούν σε σύστημα αξόνων;`,
      options: makeUniqueOptions(
        'Βρίσκονται όλα πάνω σε μια ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
        [
          'Βρίσκονται πάνω σε μια καμπύλη γραμμή που αλλάζει κατεύθυνση',
          'Σχηματίζουν έναν κύκλο γύρω από το κέντρο',
          'Είναι τυχαία διασκορπισμένα χωρίς κανένα γεωμετρικό μοτίβο',
        ]
      ),
      correctAnswer: 'Βρίσκονται όλα πάνω σε μια ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
      solution: `Οι κανονικότητες της μορφής α · ν παριστάνουν ανάλογα ποσά, άρα τα σημεία τους ανήκουν σε ευθεία γραμμή που περνά από το (0, 0).`,
    };
  },

  // 7. Αρνητικός συντελεστής α (Input)
  () => {
    // y = -3ν. Για ν=4 -> y = -12
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Αν ο κανόνας είναι <strong>y ＝ －3 · ν</strong>, ποια είναι η τιμή του όρου για <strong>ν ＝ 4</strong>;`,
      correctAnswer: '-12',
      solution: `(－3) · 4 ＝ －12.`,
    };
  },

  // 8. Συσχέτιση πίνακα και ζεύγους συντεταγμένων (MCQ)
  () => {
    // Στον πίνακα ν=5, y=20 -> ζεύγος (5, 20)
    return {
      type: 'mcq',
      topic: 'ΖΕΥΓΟΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ',
      question: `Αν σε έναν πίνακα τιμών για ν ＝ 5 αντιστοιχεί τιμή 20, ποιο σημείο σημειώνουμε στο σύστημα αξόνων;`,
      options: makeUniqueOptions('(5, 20)', ['(20, 5)', '(5, 5)', '(20, 20)']),
      correctAnswer: '(5, 20)',
      solution: `Η πρώτη συντεταγμένη (άξονας x) είναι η θέση ν ＝ 5 και η δεύτερη (άξονας y) είναι η τιμή 20: σημείο (5, 20).`,
    };
  },

  // 9. Εύρεση συντελεστή από σημείο (Input)
  () => {
    // Σημείο (4, 32) -> α = 32/4 = 8
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΣΥΝΤΕΛΕΣΤΗ',
      question: `Το σημείο <strong>(4, 32)</strong> ανήκει στη γραφική παράσταση της κανονικότητας <strong>y ＝ α · ν</strong>. Πόσο ισούται ο συντελεστής <strong>α</strong>;`,
      correctAnswer: '8',
      solution: `α · 4 ＝ 32 ➔ α ＝ 32 ： 4 ＝ 8. Ο τύπος είναι y ＝ 8 · ν.`,
    };
  },

  // 10. Μετάβαση από λεκτική διατύπωση σε τύπο (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΛΕΚΤΙΚΗ ΣΕ ΑΛΓΕΒΡΙΚΗ',
      question: `«Το μήκος ενός φράχτη ισούται με 7 μέτρα επί τον αριθμό των τμημάτων του (ν).» Ποιος είναι ο αλγεβρικός τύπος;`,
      options: makeUniqueOptions('7 · ν', ['ν ＋ 7', '7 ： ν', 'ν · ν']),
      correctAnswer: '7 · ν',
      solution: `Η φράση «7 μέτρα επί τον αριθμό ν» μεταφράζεται συμβολικά σε 7 · ν.`,
    };
  },

  // 11. Υπολογισμός τιμής από πίνακα με κλάσμα (Input)
  () => {
    // y = (1/2) * ν. Για ν=6 -> 3
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Αν ο τύπος μιας κανονικότητας είναι <strong>0,5 · ν</strong> (το μισό του ν), ποια είναι η τιμή για <strong>ν ＝ 6</strong>;`,
      correctAnswer: '3',
      solution: `0,5 · 6 ＝ 3.`,
    };
  },

  // 12. Εύρεση συντελεστή α από πίνακα διαδοχικών όρων (Input)
  () => {
    // ν=1 -> 9, ν=2 -> 18, ν=3 -> 27 -> α = 9
    return {
      type: 'input',
      topic: 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ',
      question: `Σε πίνακα τιμών της μορφής α · ν έχουμε τις τιμές 9, 18, 27, 36... Ποιος είναι ο συντελεστής <strong>α</strong>;`,
      correctAnswer: '9',
      solution: `Για ν ＝ 1 η τιμή είναι 9, άρα α ＝ 9.`,
    };
  },

  // 13. Εύρεση του 8ου όρου (Input)
  () => {
    // y = 7ν. Για ν=8 -> 56
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Στην κανονικότητα <strong>y ＝ 7 · ν</strong>, ποια είναι η τιμή του <strong>8ου όρου</strong>;`,
      correctAnswer: '56',
      solution: `7 · 8 ＝ 56.`,
    };
  },

  // 14. Έλεγχος σημείου αν ανήκει στην ευθεία (MCQ)
  () => {
    // y = 6ν. Ανήκει το (3, 18); Ναι, το (3, 15) όχι.
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΣΗΜΕΙΟΥ',
      question: `Ποιο από τα παρακάτω σημεία ανήκει στη γραφική παράσταση της κανονικότητας <strong>y ＝ 6 · ν</strong>;`,
      options: makeUniqueOptions('(3, 18)', ['(3, 15)', '(2, 10)', '(4, 20)']),
      correctAnswer: '(3, 18)',
      solution: `Για ν ＝ 3: y ＝ 6 · 3 ＝ 18. Άρα το σημείο (3, 18) ανήκει στην ευθεία.`,
    };
  },

  // 15. Εύρεση συντελεστή από αρνητικό σημείο (Input)
  () => {
    // Σημείο (3, -15) -> α = -5
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Αν το σημείο <strong>(3, －15)</strong> ανήκει στην ευθεία <strong>y ＝ α · ν</strong>, ποιος είναι ο συντελεστής <strong>α</strong>;`,
      correctAnswer: '-5',
      solution: `α · 3 ＝ －15 ➔ α ＝ －15 ： 3 ＝ －5.`,
    };
  },

  // 16. Συμπλήρωση πίνακα τιμών (Input)
  () => {
    // y = 10ν. Για ν=5 -> 50
    return {
      type: 'input',
      topic: 'ΣΥΜΠΛΗΡΩΣΗ ΠΙΝΑΚΑ',
      question: `Σε έναν πίνακα τιμών με τύπο <strong>10 · ν</strong>, ποια τιμή αντιστοιχεί στη στήλη με <strong>ν ＝ 5</strong>;`,
      correctAnswer: '50',
      solution: `10 · 5 ＝ 50.`,
    };
  },

  // 17. Εύρεση θέσης ν για δεκαδικό τύπο (Input)
  () => {
    // 2,5 * ν = 20 -> ν = 8
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΘΕΣΗΣ',
      question: `Αν <strong>y ＝ 2,5 · ν</strong> και το αποτέλεσμα είναι <strong>20</strong>, ποια είναι η τιμή του <strong>ν</strong>;`,
      correctAnswer: '8',
      solution: `ν ＝ 20 ： 2,5 ＝ 8.`,
    };
  },

  // 18. Σημασία της αρχής των αξόνων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ',
      question: `Γιατί η ευθεία της κανονικότητας <strong>y ＝ α · ν</strong> ξεκινά από το σημείο (0, 0);`,
      options: makeUniqueOptions(
        'Γιατί αν ν ＝ 0, τότε και η τιμή y ＝ α · 0 ισούται με 0',
        [
          'Επειδή όλα τα σχήματα έχουν 0 πλευρές',
          'Είναι τυχαίο σημείο εκκίνησης',
          'Ισχύει μόνο όταν ο συντελεστής α είναι θετικός',
        ]
      ),
      correctAnswer: 'Γιατί αν ν ＝ 0, τότε και η τιμή y ＝ α · 0 ισούται με 0',
      solution: `Για ν ＝ 0 έχουμε y ＝ α · 0 ＝ 0, επομένως η ευθεία περνά υποχρεωτικά από το (0, 0).`,
    };
  },

  // 19. Υπολογισμός 10ου όρου με δεκαδικό (Input)
  () => {
    // y = 0,8 * ν. Για ν=10 -> 8
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Στην κανονικότητα <strong>y ＝ 0,8 · ν</strong>, ποια είναι η τιμή του <strong>10ου όρου</strong>;`,
      correctAnswer: '8',
      solution: `0,8 · 10 ＝ 8.`,
    };
  },

  // 20. Αντίστροφη ανάγνωση από πίνακα (Input)
  () => {
    // ν=2 -> 14. α = 7. Ζητείται ο 5ος όρος -> 35
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      question: `Μια κανονικότητα της μορφής α · ν δίνει τιμή 14 για ν ＝ 2. Ποια είναι η τιμή της για <strong>ν ＝ 5</strong>;`,
      correctAnswer: '35',
      solution: `α ＝ 14 ： 2 ＝ 7. Άρα για ν ＝ 5 έχουμε: 7 · 5 ＝ 35.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΑΝΑΠΑΡΑΣΤΑΣΕΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ωρομίσθιο εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Ένας καθηγητής αμείβεται με 15 € για κάθε ώρα διδασκαλίας. Το εισόδημά του περιγράφεται από τον τύπο <strong>y ＝ 15 · ν</strong> (όπου ν οι ώρες). Πόσα ευρώ θα λάβει για <strong>8 ώρες</strong> διδασκαλίας;`,
      correctAnswer: '120',
      solution: `15 · 8 ＝ 120 €. Στο σύστημα αξόνων αυτό αντιστοιχεί στο σημείο (8, 120).`,
    };
  },

  // Πρόβλημα 2: Περίμετρος ισόπλευρου τριγώνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Η περίμετρος ενός ισόπλευρου τριγώνου με πλευρά μήκους ν εκατοστά δίνεται από τον τύπο <strong>Π ＝ 3 · ν</strong>. Αν η πλευρά είναι <strong>ν ＝ 14 cm</strong>, ποια είναι η περίμετρος;`,
      correctAnswer: '42',
      solution: `Π ＝ 3 · 14 ＝ 42 cm.`,
    };
  },

  // Πρόβλημα 3: Κατανάλωση νερού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΝΑΛΩΣΗ',
      question: `Μια βρύση τρέχει με σταθερή παροχή 12 λίτρων ανά λεπτό (τύπος: <strong>y ＝ 12 · ν</strong>). Πόσα λίτρα νερού θα γεμίσουν έναν κάδο σε <strong>6 λεπτά</strong>;`,
      correctAnswer: '72',
      solution: `12 · 6 ＝ 72 λίτρα. Στο γράφημα αντιστοιχεί στο σημείο (6, 72).`,
    };
  },

  // Πρόβλημα 4: Κόστος εισιτηρίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Το εισιτήριο για ένα θεματικό πάρκο κοστίζει 8,50 € ανά άτομο (τύπος: <strong>y ＝ 8,5 · ν</strong>). Πόσο θα πληρώσει μια ομάδα <strong>10 ατόμων</strong> σε ευρώ;`,
      correctAnswer: '85',
      solution: `8,5 · 10 ＝ 85 €.`,
    };
  },

  // Πρόβλημα 5: Ταχύτητα και απόσταση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Ένας δρομέας τρέχει με σταθερή ταχύτητα 9 km/h. Η απόσταση που διανύει δίνεται από τον τύπο <strong>s ＝ 9 · ν</strong> (όπου ν οι ώρες). Πόσα χιλιόμετρα θα διανύσει σε <strong>4 ώρες</strong>;`,
      correctAnswer: '36',
      solution: `s ＝ 9 · 4 ＝ 36 km.`,
    };
  },

  // Πρόβλημα 6: Περίμετρος τετραγώνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Η περίμετρος τετραγώνου πλευράς ν cm δίνεται από τον τύπο <strong>Π ＝ 4 · ν</strong>. Αν η περίμετρος είναι <strong>48 cm</strong>, ποιο είναι το μήκος της πλευράς <strong>ν</strong>;`,
      correctAnswer: '12',
      solution: `4 · ν ＝ 48 ➔ ν ＝ 48 ： 4 ＝ 12 cm.`,
    };
  },

  // Πρόβλημα 7: Παραγωγή αρτοποιείου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ',
      question: `Ένας φούρνος παράγει 25 φραντζόλες ψωμί ανά ταψί (τύπος: <strong>y ＝ 25 · ν</strong>). Πόσες φραντζόλες θα παραχθούν σε <strong>8 ταψιά</strong>;`,
      correctAnswer: '200',
      solution: `25 · 8 ＝ 200 φραντζόλες.`,
    };
  },

  // Πρόβλημα 8: Αγορά βιβλίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Μια σειρά επιστημονικών περιοδικών κοστίζει 4 € το τεύχος (τύπος: <strong>y ＝ 4 · ν</strong>). Αν ένας αναγνώστης πλήρωσε <strong>36 €</strong>, πόσα τεύχη (ν) αγόρασε;`,
      correctAnswer: '9',
      solution: `4 · ν ＝ 36 ➔ ν ＝ 36 ： 4 ＝ 9 τεύχη.`,
    };
  },

  // Πρόβλημα 9: Συσκευασία αυγών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Κάθε καρτέλα περιέχει 30 αυγά (τύπος: <strong>y ＝ 30 · ν</strong>). Πόσα αυγά περιέχονται σε <strong>7 καρτέλες</strong>;`,
      correctAnswer: '210',
      solution: `30 · 7 ＝ 210 αυγά.`,
    };
  },

  // Πρόβλημα 10: Κατανάλωση ενέργειας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question: `Μια λάμπα LED καταναλώνει 0,01 kWh ανά ώρα λειτουργίας (τύπος: <strong>y ＝ 0,01 · ν</strong>). Πόσες kWh θα καταναλώσει σε <strong>500 ώρες</strong> λειτουργίας;`,
      correctAnswer: '5',
      solution: `0,01 · 500 ＝ 5 kWh.`,
    };
  },

  // Πρόβλημα 11: Συναρμολόγηση ποδηλάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Κάθε ποδήλατο χρειάζεται 2 ρόδες (τύπος: <strong>y ＝ 2 · ν</strong>). Αν ένα εργοστάσιο έχει <strong>96 ρόδες</strong>, πόσα ποδήλατα (ν) μπορεί να συναρμολογήσει;`,
      correctAnswer: '48',
      solution: `2 · ν ＝ 96 ➔ ν ＝ 96 ： 2 ＝ 48 ποδήλατα.`,
    };
  },

  // Πρόβλημα 12: Φύτευση δενδρυλλίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ',
      question: `Σε έναν ελαιώνα φυτεύονται 16 δέντρα ανά σειρά (τύπος: <strong>y ＝ 16 · ν</strong>). Πόσα δέντρα φυτεύτηκαν συνολικά σε <strong>5 σειρές</strong>;`,
      correctAnswer: '80',
      solution: `16 · 5 ＝ 80 δέντρα.`,
    };
  },

  // Πρόβλημα 13: Κόστος φωτοτυπιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ',
      question: `Σε ένα φωτοτυπείο κάθε σελίδα κοστίζει 0,05 € (τύπος: <strong>y ＝ 0,05 · ν</strong>). Πόσα ευρώ κοστίζει η εκτύπωση <strong>200 σελίδων</strong>;`,
      correctAnswer: '10',
      solution: `0,05 · 200 ＝ 10 €.`,
    };
  },

  // Πρόβλημα 14: Βάρος φορτίου κιβωτίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Κάθε κιβώτιο με φρούτα ζυγίζει 18 kg (τύπος: <strong>y ＝ 18 · ν</strong>). Ποιο είναι το συνολικό βάρος σε kg για <strong>10 κιβώτια</strong>;`,
      correctAnswer: '180',
      solution: `18 · 10 ＝ 180 kg.`,
    };
  },

  // Πρόβλημα 15: Πλήρωση μπουκαλιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Κάθε μπουκάλι χωράει 1,5 λίτρο γάλα (τύπος: <strong>y ＝ 1,5 · ν</strong>). Πόσα λίτρα γάλα περιέχουν <strong>8 μπουκάλια</strong>;`,
      correctAnswer: '12',
      solution: `1,5 · 8 ＝ 12 λίτρα.`,
    };
  },

  // Πρόβλημα 16: Αμοιβή υπερωρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ',
      question: `Η αμοιβή υπερωρίας είναι 14 € ανά ώρα (τύπος: <strong>y ＝ 14 · ν</strong>). Αν ένας εργαζόμενος έλαβε <strong>70 €</strong> υπερωρίες, πόσες ώρες (ν) εργάστηκε;`,
      correctAnswer: '5',
      solution: `14 · ν ＝ 70 ➔ ν ＝ 70 ： 14 ＝ 5 ώρες.`,
    };
  },

  // Πρόβλημα 17: Κατασκευή παγκακιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΞΥΛΟΥΡΓΙΚΗ',
      question: `Για κάθε ξύλινο παγκάκι απαιτούνται 6 σανίδες (τύπος: <strong>y ＝ 6 · ν</strong>). Πόσες σανίδες χρειάζονται για <strong>11 παγκάκια</strong>;`,
      correctAnswer: '66',
      solution: `6 · 11 ＝ 66 σανίδες.`,
    };
  },

  // Πρόβλημα 18: Χρόνος περιστροφής τροχού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΗΧΑΝΙΚΗ',
      question: `Ένας τροχός κάνει 45 περιστροφές ανά λεπτό (τύπος: <strong>y ＝ 45 · ν</strong>). Πόσες περιστροφές θα ολοκληρώσει σε <strong>4 λεπτά</strong>;`,
      correctAnswer: '180',
      solution: `45 · 4 ＝ 180 περιστροφές.`,
    };
  },

  // Πρόβλημα 19: Κόστος καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Ένα όχημα καίει 0,08 λίτρα βενζίνης ανά χιλιόμετρο (τύπος: <strong>y ＝ 0,08 · ν</strong>). Πόσα λίτρα καυσίμου θα κάψει σε διαδρομή <strong>100 χιλιομέτρων</strong>;`,
      correctAnswer: '8',
      solution: `0,08 · 100 ＝ 8 λίτρα.`,
    };
  },

  // Πρόβλημα 20: Δημιουργία πακέτων δώρων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Σε κάθε πακέτο δώρου τοποθετούνται 5 σοκολατάκια (τύπος: <strong>y ＝ 5 · ν</strong>). Αν έχουμε <strong>75 σοκολατάκια</strong>, πόσα πλήρη πακέτα (ν) μπορούμε να φτιάξουμε;`,
      correctAnswer: '15',
      solution: `5 · ν ＝ 75 ➔ ν ＝ 75 ： 5 ＝ 15 πακέτα.`,
    };
  },
];

export default function AkolouthiaViewAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, μείον και μεταβλητή v/ν
    clean = clean.replace(/[^0-9,/\-v,ν,*,+]/gi, '');

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
        .replace(/Ν/g, 'V')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/Ν/g, 'V')
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
      title="Ασκήσεις: Αναπαράσταση Κανονικοτήτων | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην αναπαράσταση κανονικοτήτων (πίνακες τιμών, συστήματα αξόνων, τύπος α·ν) για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/26-akolouthia-view"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 24 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αναπαράσταση Κανονικοτήτων (α · ν)
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις πινάκων τιμών, συστημάτων αξόνων και τύπων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                .replace(/Ν/g, 'V')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/Ν/g, 'V')
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
                          placeholder="π.χ. 6 ή 4*ν"
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
