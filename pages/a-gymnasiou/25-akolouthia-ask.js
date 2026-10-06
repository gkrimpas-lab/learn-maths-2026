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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΚΑΝΟΝΙΚΟΤΗΤΑΣ & ν-ΟΣΤΟΥ ΟΡΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση επόμενου όρου σε σταθερή πρόσθεση (Input)
  () => {
    // 3, 7, 11, 15, ... (+4) -> 19
    return {
      type: 'input',
      topic: 'ΕΠΟΜΕΝΟΣ ΟΡΟΣ',
      question: `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>3, 7, 11, 15, ...</strong>;`,
      correctAnswer: '19',
      solution: `Παρατηρούμε ότι κάθε όρος προκύπτει προσθέτοντας το 4 στον προηγούμενο (σταθερή αύξηση κατά 4). Άρα ο επόμενος είναι: 15 ＋ 4 ＝ 19.`,
    };
  },

  // 2. Εύρεση επόμενου όρου σε σταθερή μείωση (Input)
  () => {
    // 30, 25, 20, 15, ... (-5) -> 10
    return {
      type: 'input',
      topic: 'ΦΘΙΝΟΥΣΑ ΚΑΝΟΝΙΚΟΤΗΤΑ',
      question: `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>30, 25, 20, 15, ...</strong>;`,
      correctAnswer: '10',
      solution: `Κάθε όρος μειώνεται κατά 5 από τον προηγούμενο: 15 － 5 ＝ 10.`,
    };
  },

  // 3. Υπολογισμός συγκεκριμένου όρου από τον τύπο (Input)
  () => {
    // Τύπος 4ν - 1 για ν = 6 -> 23
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Ο γενικός τύπος μιας ακολουθίας είναι <strong>4 · ν － 1</strong>. Υπολόγισε τον <strong>6ο όρο</strong> (για ν ＝ 6):`,
      correctAnswer: '23',
      solution: `Αντικαθιστούμε ν ＝ 6 στον τύπο: 4 · 6 － 1 ＝ 24 － 1 ＝ 23.`,
    };
  },

  // 4. Υπολογισμός 10ου όρου (Input)
  () => {
    // Τύπος 3ν + 5 για ν = 10 -> 35
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Αν ο ν-οστός όρος είναι <strong>3 · ν ＋ 5</strong>, ποια είναι η τιμή του <strong>10ου όρου</strong>;`,
      correctAnswer: '35',
      solution: `Για ν ＝ 10 έχουμε: 3 · 10 ＋ 5 ＝ 30 ＋ 5 ＝ 35.`,
    };
  },

  // 5. Αναγνώριση του τύπου των άρτιων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΡΤΙΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο γενικός (ν-οστός) όρος της ακολουθίας των θετικών άρτιων αριθμών <strong>2, 4, 6, 8, ...</strong>;`,
      options: makeUniqueOptions('2 · ν', ['ν ＋ 2', '2 · ν ＋ 1', 'ν²']),
      correctAnswer: '2 · ν',
      solution: `Για ν ＝ 1 έχουμε 2 · 1 ＝ 2, για ν ＝ 2 έχουμε 2 · 2 ＝ 4, για ν ＝ 3 έχουμε 2 · 3 ＝ 6 κ.ο.κ. Άρα ο τύπος είναι 2 · ν.`,
    };
  },

  // 6. Αναγνώριση του τύπου των περιττών (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΠΕΡΙΤΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο γενικός (ν-οστός) όρος της ακολουθίας των περιττών αριθμών <strong>1, 3, 5, 7, ...</strong>;`,
      options: makeUniqueOptions('2 · ν － 1', ['2 · ν', 'ν ＋ 2', '2 · ν ＋ 1']),
      correctAnswer: '2 · ν － 1',
      solution: `Για ν ＝ 1: 2 · 1 － 1 ＝ 1. Για ν ＝ 2: 2 · 2 － 1 ＝ 3. Για ν ＝ 3: 2 · 3 － 1 ＝ 5. Ο τύπος είναι 2 · ν － 1.`,
    };
  },

  // 7. Τετραγωνικοί αριθμοί (Input)
  () => {
    // 1, 4, 9, 16, 25, ... (ν^2) -> για ν = 7 είναι 49
    return {
      type: 'input',
      topic: 'ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ',
      question: `Στην κανονικότητα <strong>1, 4, 9, 16, 25, ...</strong> (ν²), ποιος είναι ο <strong>7ος όρος</strong>;`,
      correctAnswer: '49',
      solution: `Ο κανόνας είναι ν², επομένως για τον 7ο όρο έχουμε: 7² ＝ 7 · 7 ＝ 49.`,
    };
  },

  // 8. Διπλασιασμός (Γεωμετρική αύξηση) (Input)
  () => {
    // 2, 4, 8, 16, 32, ... (*2) -> 64
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΤΙΚΗ ΚΑΝΟΝΙΚΟΤΗΤΑ',
      question: `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>2, 4, 8, 16, 32, ...</strong>;`,
      correctAnswer: '64',
      solution: `Κάθε όρος προκύπτει πολλαπλασιάζοντας τον προηγούμενο επί 2 (δυνάμεις του 2): 32 · 2 ＝ 64.`,
    };
  },

  // 9. Εύρεση θέσης ν από γνωστή τιμή (Input)
  () => {
    // 5ν = 45 -> ν = 9
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΘΕΣΗΣ (ν)',
      question: `Αν ο γενικός όρος μιας ακολουθίας είναι <strong>5 · ν</strong>, σε ποια θέση (ποιο είναι το ν) βρίσκεται ο αριθμός <strong>45</strong>;`,
      correctAnswer: '9',
      solution: `Λύνουμε την εξίσωση 5 · ν ＝ 45: ν ＝ 45 ： 5 ＝ 9. Ο αριθμός 45 είναι ο 9ος όρος.`,
    };
  },

  // 10. Εύρεση θέσης ν με σταθερά (Input)
  () => {
    // 3ν + 2 = 29 -> 3ν = 27 -> ν = 9
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΘΕΣΗΣ (ν)',
      question: `Στην ακολουθία με τύπο <strong>3 · ν ＋ 2</strong>, ποιος όρος ισούται με <strong>29</strong> (βρες το ν);`,
      correctAnswer: '9',
      solution: `3 · ν ＋ 2 ＝ 29 ➔ 3 · ν ＝ 29 － 2 ＝ 27 ➔ ν ＝ 27 ： 3 ＝ 9.`,
    };
  },

  // 11. Αναγνώριση του τύπου από τη διαφορά (MCQ)
  () => {
    // 4, 7, 10, 13 -> 3ν + 1
    return {
      type: 'mcq',
      topic: 'ΕΥΡΕΣΗ ΤΥΠΟΥ',
      question: `Ποιος τύπος παράγει τους όρους της ακολουθίας <strong>4, 7, 10, 13, ...</strong>;`,
      options: makeUniqueOptions('3 · ν ＋ 1', ['3 · ν', '4 · ν', '3 · ν ＋ 4']),
      correctAnswer: '3 · ν ＋ 1',
      solution: `Η διαφορά ανάμεσα σε διαδοχικούς όρους είναι σταθερά 3 (άρα ξεκινά με 3 · ν). Για ν ＝ 1 θέλουμε 4, άρα 3 · 1 ＋ 1 ＝ 4. Ο τύπος είναι 3 · ν ＋ 1.`,
    };
  },

  // 12. Εύρεση του 1ου όρου (Input)
  () => {
    // 6ν - 4 για ν = 1 -> 2
    return {
      type: 'input',
      topic: 'ΠΡΩΤΟΣ ΟΡΟΣ',
      question: `Ποιος είναι ο <strong>1ος όρος</strong> (για ν ＝ 1) της ακολουθίας με τύπο <strong>6 · ν － 4</strong>;`,
      correctAnswer: '2',
      solution: `Βάζουμε ν ＝ 1: 6 · 1 － 4 ＝ 6 － 4 ＝ 2.`,
    };
  },

  // 13. Εύρεση του 20ού όρου (Input)
  () => {
    // 5ν + 2 για ν = 20 -> 102
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Υπολόγισε τον <strong>20ό όρο</strong> της ακολουθίας με τύπο <strong>5 · ν ＋ 2</strong>:`,
      correctAnswer: '102',
      solution: `Για ν ＝ 20: 5 · 20 ＋ 2 ＝ 100 ＋ 2 ＝ 102.`,
    };
  },

  // 14. Εναλλασσόμενη κανονικότητα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΚΑΝΟΝΙΚΟΤΗΤΑΣ',
      question: `Τι εκφράζει το σύμβολο <strong>ν</strong> στον τύπο μιας κανονικότητας;`,
      options: makeUniqueOptions(
        'Τη θέση ή τον αύξοντα αριθμό του όρου (1ος, 2ος, 3ος, ...)',
        [
          'Την τιμή του πρώτου αριθμού πάντοτε',
          'Τη διαφορά ανάμεσα σε δύο όρους',
          'Το άθροισμα όλων των αριθμών',
        ]
      ),
      correctAnswer: 'Τη θέση ή τον αύξοντα αριθμό του όρου (1ος, 2ος, 3ος, ...)',
      solution: `Η μεταβλητή ν είναι φυσικός αριθμός (1, 2, 3, ...) που δηλώνει τη θέση του κάθε όρου στην ακολουθία.`,
    };
  },

  // 15. Κλασματική κανονικότητα (Input)
  () => {
    // 1/2, 1/3, 1/4, 1/5, ... -> ο 10ος όρος έχει παρονομαστή 11 (1/11)
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑΤΙΚΗ ΑΚΟΛΟΥΘΙΑ',
      question: `Στην ακολουθία 1/2, 1/3, 1/4, 1/5, ... ποιος είναι ο παρονομαστής του <strong>10ου όρου</strong>;`,
      correctAnswer: '11',
      solution: `Ο 1ος όρος έχει παρονομαστή 2 (1 ＋ 1), ο 2ος έχει 3 (2 ＋ 1). Άρα ο 10ος όρος έχει παρονομαστή 10 ＋ 1 ＝ 11 (το κλάσμα είναι 1/11).`,
    };
  },

  // 16. Τριγωνικοί αριθμοί (Input)
  () => {
    // 1, 3, 6, 10, ... (+2, +3, +4) -> 15
    return {
      type: 'input',
      topic: 'ΜΕΤΑΒΑΛΛΟΜΕΝΗ ΑΥΞΗΣΗ',
      question: `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>1, 3, 6, 10, ...</strong>;`,
      correctAnswer: '15',
      solution: `Η αύξηση μεγαλώνει κατά 1 σε κάθε βήμα: 1 (＋2) ➔ 3 (＋3) ➔ 6 (＋4) ➔ 10 (＋5) ➔ 15.`,
    };
  },

  // 17. Υπολογισμός 50ού όρου (Input)
  () => {
    // 2ν + 3 για ν = 50 -> 103
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Υπολόγισε τον <strong>50ό όρο</strong> της ακολουθίας με τύπο <strong>2 · ν ＋ 3</strong>:`,
      correctAnswer: '103',
      solution: `Για ν ＝ 50: 2 · 50 ＋ 3 ＝ 100 ＋ 3 ＝ 103.`,
    };
  },

  // 18. Αφαίρεση στον γενικό όρο (Input)
  () => {
    // 10ν - 7 για ν = 4 -> 33
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ',
      question: `Ποιος είναι ο <strong>4ος όρος</strong> της ακολουθίας με τύπο <strong>10 · ν － 7</strong>;`,
      correctAnswer: '33',
      solution: `10 · 4 － 7 ＝ 40 － 7 ＝ 33.`,
    };
  },

  // 19. Αναγνώριση κανόνα πολλαπλασίων του 7 (Input)
  () => {
    // 7, 14, 21, 28, ... -> ο 8ος όρος είναι 56
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑ',
      question: `Στην ακολουθία <strong>7, 14, 21, 28, ...</strong> (πολλαπλάσια του 7), ποιος είναι ο <strong>8ος όρος</strong>;`,
      correctAnswer: '56',
      solution: `Ο τύπος είναι 7 · ν. Για ν ＝ 8: 7 · 8 ＝ 56.`,
    };
  },

  // 20. Έλεγχος αν ένας αριθμός ανήκει στην ακολουθία (MCQ)
  () => {
    // Τύπος 4ν + 1 -> όροι: 5, 9, 13, 17, 21... Το 20 δεν ανήκει
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΟΡΟΥ',
      question: `Ποιος από τους παρακάτω αριθμούς <strong>ΔΕΝ</strong> είναι όρος της ακολουθίας με τύπο <strong>4 · ν ＋ 1</strong>;`,
      options: makeUniqueOptions('20', ['5', '13', '25']),
      correctAnswer: '20',
      solution: `Αν 4 · ν ＋ 1 ＝ 20 ➔ 4 · ν ＝ 19 ➔ ν ＝ 19/4 ＝ 4,75 (δεν είναι φυσικός αριθμός!). Άρα το 20 δεν ανήκει στην ακολουθία.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΝΟΝΙΚΟΤΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Καθίσματα σε τραπέζια
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΤΟΡΙΟ',
      question: `Σε ένα εστιατόριο ενώνουν τετράγωνα τραπέζια στη σειρά. Το 1 τραπέζι έχει 4 θέσεις, τα 2 τραπέζια έχουν 6 θέσεις, τα 3 έχουν 8 θέσεις κ.ο.κ. (τύπος: 2 · ν ＋ 2). Πόσες θέσεις θα έχουν <strong>10 τραπέζια</strong> ενωμένα στη σειρά;`,
      correctAnswer: '22',
      solution: `Εφαρμόζουμε τον τύπο για ν ＝ 10: 2 · 10 ＋ 2 ＝ 20 ＋ 2 ＝ 22 θέσεις.`,
    };
  },

  // Πρόβλημα 2: Σπίρτα για κατασκευή τριγώνων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΗΜΑΤΑ',
      question: `Για να φτιάξουμε 1 τρίγωνο χρειαζόμαστε 3 σπίρτα. Για κάθε επόμενο ενωμένο τρίγωνο προσθέτουμε 2 σπίρτα (τύπος: 2 · ν ＋ 1). Πόσα σπίρτα χρειάζονται για να φτιάξουμε <strong>8 ενωμένα τρίγωνα</strong>;`,
      correctAnswer: '17',
      solution: `Για ν ＝ 8 τρίγωνα: 2 · 8 ＋ 1 ＝ 16 ＋ 1 ＝ 17 σπίρτα.`,
    };
  },

  // Πρόβλημα 3: Αποταμίευση στον κουμπαρά
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Η Ελένη έχει ήδη 20 € στον κουμπαρά της και κάθε εβδομάδα προσθέτει 4 € (τύπος: 4 · ν ＋ 20). Πόσα χρήματα θα έχει συγκεντρώσει μετά από <strong>12 εβδομάδες</strong>;`,
      correctAnswer: '68',
      solution: `Για ν ＝ 12 εβδομάδες: 4 · 12 ＋ 20 ＝ 48 ＋ 20 ＝ 68 €.`,
    };
  },

  // Πρόβλημα 4: Σκαλοπάτια σκάλας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Κάθε σκαλοπάτι μιας σκάλας έχει ύψος 18 cm. Ποιο είναι το συνολικό ύψος της σκάλας σε εκατοστά (cm) όταν ανέβουμε <strong>15 σκαλοπάτια</strong> (τύπος: 18 · ν);`,
      correctAnswer: '270',
      solution: `Ύψος ＝ 18 · 15 ＝ 270 cm (2,7 μέτρα).`,
    };
  },

  // Πρόβλημα 5: Φύτευση δέντρων σε δενδροστοιχία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΥΡΙΚΗ',
      question: `Σε έναν ευθύγραμμο δρόμο φυτεύονται δέντρα ανά 6 μέτρα. Στην αρχή (0 m) μπαίνει το 1ο δέντρο. Σε ποια απόσταση από την αρχή (σε μέτρα) βρίσκεται το <strong>11ο δέντρο</strong> (τύπος: 6 · (ν － 1));`,
      correctAnswer: '60',
      solution: `Ανάμεσα σε 11 δέντρα υπάρχουν 10 διαστήματα των 6 μέτρων: 6 · (11 － 1) ＝ 6 · 10 ＝ 60 μέτρα.`,
    };
  },

  // Πρόβλημα 6: Πυραμίδα από κουτάκια αναψυκτικών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΥΡΑΜΙΔΑ',
      question: `Σε μια στοίβα, η 1η σειρά στην κορυφή έχει 1 κουτάκι, η 2η έχει 3, η 3η έχει 5 κ.ο.κ. (περιττοί αριθμοί, τύπος: 2 · ν － 1). Πόσα κουτάκια έχει η <strong>7η σειρά</strong>;`,
      correctAnswer: '13',
      solution: `Για ν ＝ 7: 2 · 7 － 1 ＝ 14 － 1 ＝ 13 κουτάκια.`,
    };
  },

  // Πρόβλημα 7: Χρέωση ταξί
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί έχει σημαία 2 € (πάγια χρέωση) και χρεώνει 1,5 € για κάθε χιλιόμετρο (τύπος: 1,5 · ν ＋ 2). Πόσο θα κοστίσει μια διαδρομή <strong>10 χιλιομέτρων</strong>;`,
      correctAnswer: '17',
      solution: `1,5 · 10 ＋ 2 ＝ 15 ＋ 2 ＝ 17 €.`,
    };
  },

  // Πρόβλημα 8: Αλυσίδα τηλεφωνημάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΔΙΚΤΥΑ',
      question: `Σε μια ειδοποίηση, 1 άτομο ειδοποιεί 2, αυτά τα 2 άλλα 4, μετά 8 κ.ο.κ. (δυνάμεις: 2<sup>ν</sup>). Πόσα άτομα ειδοποιούνται στο <strong>5ο βήμα</strong>;`,
      correctAnswer: '32',
      solution: `2<sup>5</sup> ＝ 32 άτομα.`,
    };
  },

  // Πρόβλημα 9: Περίφραξη με πασσάλους
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΦΡΑΞΗ',
      question: `Για ν τμήματα φράχτη χρειάζονται ν ＋ 1 πάσσαλοι. Πόσοι πάσσαλοι χρειάζονται για να στηθούν <strong>24 τμήματα φράχτη</strong>;`,
      correctAnswer: '25',
      solution: `ν ＋ 1 ＝ 24 ＋ 1 ＝ 25 πάσσαλοι.`,
    };
  },

  // Πρόβλημα 10: Ενοικίαση ηλεκτρικού ποδηλάτου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Η ενοικίαση ποδηλάτου κοστίζει 3 € πάγιο ξεκλείδωμα συν 2 € για κάθε ώρα χρήσης (τύπος: 2 · ν ＋ 3). Πόσο κοστίζει η ενοικίαση για <strong>5 ώρες</strong> σε ευρώ;`,
      correctAnswer: '13',
      solution: `2 · 5 ＋ 3 ＝ 10 ＋ 3 ＝ 13 €.`,
    };
  },

  // Πρόβλημα 11: Πλακόστρωση αυλής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Σε ένα μονοπάτι, κάθε μέτρο μήκους απαιτεί 8 πλακάκια, συν 4 πλακάκια για το τελείωμα (τύπος: 8 · ν ＋ 4). Πόσα πλακάκια χρειάζονται για μονοπάτι μήκους <strong>6 μέτρων</strong>;`,
      correctAnswer: '52',
      solution: `8 · 6 ＋ 4 ＝ 48 ＋ 4 ＝ 52 πλακάκια.`,
    };
  },

  // Πρόβλημα 12: Συνδρομή γυμναστηρίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ',
      question: `Ένα γυμναστήριο χρεώνει 15 € εγγραφή και 25 € για κάθε μήνα (τύπος: 25 · ν ＋ 15). Πόσο θα πληρώσει συνολικά ένα μέλος για <strong>4 μήνες</strong>;`,
      correctAnswer: '115',
      solution: `25 · 4 ＋ 15 ＝ 100 ＋ 15 ＝ 115 €.`,
    };
  },

  // Πρόβλημα 13: Παραγωγή εργοστασίου ανά ώρα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ',
      question: `Μια μηχανή παράγει 40 τεμάχια την ώρα. Αν στην αρχή της βάρδιας υπήρχαν ήδη 50 έτοιμα τεμάχια (τύπος: 40 · ν ＋ 50), πόσα τεμάχια θα υπάρχουν μετά από <strong>6 ώρες</strong>;`,
      correctAnswer: '290',
      solution: `40 · 6 ＋ 50 ＝ 240 ＋ 50 ＝ 290 τεμάχια.`,
    };
  },

  // Πρόβλημα 14: Καθίσματα κινηματογράφου ανά σειρά
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΙΝΗΜΑΤΟΓΡΑΦΟΣ',
      question: `Η 1η σειρά μιας αίθουσας έχει 12 καθίσματα και κάθε επόμενη σειρά έχει 2 καθίσματα περισσότερα (τύπος: 2 · ν ＋ 10). Πόσα καθίσματα έχει η <strong>8η σειρά</strong>;`,
      correctAnswer: '26',
      solution: `2 · 8 ＋ 10 ＝ 16 ＋ 10 ＝ 26 καθίσματα.`,
    };
  },

  // Πρόβλημα 15: Μήκος αναρριχητικού φυτού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΗ',
      question: `Ένα κλίμα έχει αρχικό μήκος 30 cm και μεγαλώνει 5 cm κάθε εβδομάδα (τύπος: 5 · ν ＋ 30). Ποιο θα είναι το μήκος του σε εκατοστά μετά από <strong>8 εβδομάδες</strong>;`,
      correctAnswer: '70',
      solution: `5 · 8 ＋ 30 ＝ 40 ＋ 30 ＝ 70 cm.`,
    };
  },

  // Πρόβλημα 16: Στόχοι σκοποβολής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΜΑΤΑ',
      question: `Σε ένα παιχνίδι σκοποβολής, κάθε εύστοχη βολή στη σειρά δίνει 10 πόντους παραπάνω από την προηγούμενη (τύπος: 10 · ν). Πόσους πόντους κερδίζει ο παίκτης στην <strong>9η συνεχόμενη εύστοχη βολή</strong>;`,
      correctAnswer: '90',
      solution: `10 · 9 ＝ 90 πόντοι.`,
    };
  },

  // Πρόβλημα 17: Φόρτιση μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Ένα κινητό ξεκινά με 10% μπαταρία και φορτίζει με ρυθμό 3% ανά λεπτό (τύπος: 3 · ν ＋ 10). Σε τι ποσοστό (%) θα βρίσκεται μετά από <strong>20 λεπτά</strong>;`,
      correctAnswer: '70',
      solution: `3 · 20 ＋ 10 ＝ 60 ＋ 10 ＝ 70%.`,
    };
  },

  // Πρόβλημα 18: Κατανάλωση κεριού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα κερί ύψους 25 cm λιώνει κατά 2 cm για κάθε ώρα που καίει (τύπος: 25 － 2 · ν). Ποιο θα είναι το ύψος του σε εκατοστά μετά από <strong>7 ώρες</strong>;`,
      correctAnswer: '11',
      solution: `25 － 2 · 7 ＝ 25 － 14 ＝ 11 cm.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φωτογραφιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΩΤΟΓΡΑΦΙΑ',
      question: `Ένα φωτογραφείο χρεώνει 0,20 € ανά φωτογραφία συν 1 € για το άλμπουμ (τύπος: 0,2 · ν ＋ 1). Πόσο κοστίζει η εκτύπωση <strong>30 φωτογραφιών</strong> σε ευρώ;`,
      correctAnswer: '7',
      solution: `0,2 · 30 ＋ 1 ＝ 6 ＋ 1 ＝ 7 €.`,
    };
  },

  // Πρόβλημα 20: Δρομολόγια λεωφορείου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΔΡΟΜΟΛΟΓΙΑ',
      question: `Το 1ο λεωφορείο περνά στις 07:00 (λεπτό 0) και τα επόμενα περνούν ανά 15 λεπτά (τύπος: 15 · (ν － 1)). Μετά από πόσα λεπτά από την έναρξη περνάει το <strong>5ο λεωφορείο</strong>;`,
      correctAnswer: '60',
      solution: `15 · (5 － 1) ＝ 15 · 4 ＝ 60 λεπτά (στις 08:00).`,
    };
  },
];

export default function AkolouthiaAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο για κλάσματα, μείον και μεταβλητή v/ν
    clean = clean.replace(/[^0-9,/,\-v,ν,*,+,^]/gi, '');

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
      title="Ασκήσεις: Κανονικότητες & Ακολουθίες | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην αναγνώριση κανονικοτήτων και τον υπολογισμό του ν-οστού όρου για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/25-akolouthia"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 23 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Κανονικότητες & Ο ν-οστός Όρος
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 εύρεσης μοτίβων/τύπων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 19 ή 2*ν"
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
