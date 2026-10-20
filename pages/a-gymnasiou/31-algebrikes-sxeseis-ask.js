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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΕΝΝΟΙΑΣ ΕΞΙΣΩΣΗΣ & ΕΛΕΓΧΟΥ ΡΙΖΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Τι είναι εξίσωση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΡΙΣΜΟΣ ΕΞΙΣΩΣΗΣ',
      question: `Τι ονομάζουμε <strong>εξίσωση</strong> στα Μαθηματικά;`,
      options: makeUniqueOptions(
        'Μια ισότητα δύο παραστάσεων που περιέχει τουλάχιστον έναν άγνωστο αριθμό (μεταβλητή)',
        [
          'Μια ανισότητα ανάμεσα σε δύο αριθμούς',
          'Μια μαθηματική παράσταση χωρίς το σύμβολο του ίσον',
          'Το αποτέλεσμα μιας πρόσθεσης'
        ]
      ),
      correctAnswer: 'Μια ισότητα δύο παραστάσεων που περιέχει τουλάχιστον έναν άγνωστο αριθμό (μεταβλητή)',
      solution: `Εξίσωση είναι πάντα μια ισότητα (έχει ＝) και περιέχει τουλάχιστον ένα γράμμα που λέγεται άγνωστος (π.χ. x).`,
    };
  },

  // 2. Αναγνώριση συντελεστή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ ΑΓΝΩΣΤΟΥ',
      question: `Στην εξίσωση <strong>5 · x ＋ 4 ＝ 19</strong>, ποιος είναι ο συντελεστής του αγνώστου;`,
      correctAnswer: '5',
      solution: `Συντελεστής του αγνώστου είναι ο αριθμός που πολλαπλασιάζει το x, δηλαδή το 5.`,
    };
  },

  // 3. Αναγνώριση 2ου μέλους (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΜΕΛΗ ΕΞΙΣΩΣΗΣ',
      question: `Στην εξίσωση <strong>3 · x － 2 ＝ 10</strong>, ποιος αριθμός αποτελεί το <strong>2ο μέλος</strong> της εξίσωσης;`,
      correctAnswer: '10',
      solution: `Το 2ο μέλος είναι η παράσταση στα δεξιά του συμβόλου της ισότητας (＝), δηλαδή το 10.`,
    };
  },

  // 4. Επαλήθευση λύσης (Input)
  () => {
    // 2x + 1 = 9 -> x = 4
    return {
      type: 'input',
      topic: 'ΕΛΕΓΧΟΣ ΛΥΣΗΣ',
      question: `Ποιος αριθμός αποτελεί τη <strong>λύση (ρίζα)</strong> της εξίσωσης <strong>2 · x ＋ 1 ＝ 9</strong>;`,
      correctAnswer: '4',
      solution: `Αν δοκιμάσουμε το 4, έχουμε: 2 · 4 ＋ 1 ＝ 8 ＋ 1 ＝ 9. Άρα η λύση είναι το 4.`,
    };
  },

  // 5. Μετάφραση σε εξίσωση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ',
      question: `Πώς γράφεται σε μορφή εξίσωσης η πρόταση: «Το τριπλάσιο ενός αριθμού μειωμένο κατά 5 ισούται με 16»;`,
      options: makeUniqueOptions('3 · x － 5 ＝ 16', ['3 · x ＋ 5 ＝ 16', '3 · (x － 5) ＝ 16', 'x － 5 ＝ 16']),
      correctAnswer: '3 · x － 5 ＝ 16',
      solution: `Το τριπλάσιο είναι 3 · x, μειωμένο κατά 5 σημαίνει － 5 και ισούται με 16.`,
    };
  },

  // 6. Έλεγχος ρίζας (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΡΙΖΑΣ',
      question: `Είναι ο αριθμός <strong>x ＝ 3</strong> λύση της εξίσωσης <strong>4 · x － 2 ＝ 10</strong>;`,
      options: makeUniqueOptions('Ναι, διότι 4 · 3 － 2 ＝ 10', ['Όχι, διότι 4 · 3 － 2 ＝ 14', 'Όχι, η λύση είναι το 2', 'Ναι, διότι 4 ＋ 3 ＝ 7']),
      correctAnswer: 'Ναι, διότι 4 · 3 － 2 ＝ 10',
      solution: `Αντικαθιστούμε το x με το 3 στο πρώτο μέλος: 4 · 3 － 2 ＝ 12 － 2 ＝ 10. Αφού 1ο μέλος ＝ 2ο μέλος, το 3 είναι λύση.`,
    };
  },

  // 7. Λύση εξίσωσης με δοκιμή (Input)
  () => {
    // 5x = 35 -> 7
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΡΙΖΑΣ',
      question: `Βρες με το μυαλό σου τη λύση της εξίσωσης: <strong>5 · x ＝ 35</strong>`,
      correctAnswer: '7',
      solution: `Ποιος αριθμός αν πολλαπλασιαστεί με το 5 μας δίνει 35; Είναι το 7 (5 · 7 ＝ 35).`,
    };
  },

  // 8. Αναγνώριση σταθερού όρου στο 1ο μέλος (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΟΡΟΙ ΕΞΙΣΩΣΗΣ',
      question: `Στην εξίσωση <strong>8 · x ＋ 12 ＝ 28</strong>, ποιος είναι ο <strong>σταθερός όρος</strong> του πρώτου μέλους;`,
      correctAnswer: '12',
      solution: `Στο 1ο μέλος (8x ＋ 12), ο όρος χωρίς μεταβλητή είναι το 12.`,
    };
  },

  // 9. Μετάφραση προβλήματος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ',
      question: `Ποια εξίσωση ταιριάζει στο πρόβλημα: «Σκέφτηκα έναν αριθμό, του πρόσθεσα 4 και το αποτέλεσμα είναι 11»;`,
      options: makeUniqueOptions('x ＋ 4 ＝ 11', ['4 · x ＝ 11', 'x － 4 ＝ 11', 'x ＝ 11 ＋ 4']),
      correctAnswer: 'x ＋ 4 ＝ 11',
      solution: `Έστω x ο αριθμός που σκέφτηκα. Αν του προσθέσω 4 γίνεται x ＋ 4. Το αποτέλεσμα είναι 11, άρα x ＋ 4 ＝ 11.`,
    };
  },

  // 10. Εύρεση ρίζας (Input)
  () => {
    // x - 6 = 14 -> 20
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΡΙΖΑΣ',
      question: `Ποια είναι η λύση της εξίσωσης <strong>x － 6 ＝ 14</strong>;`,
      correctAnswer: '20',
      solution: `Ο αριθμός που αν του αφαιρέσουμε 6 μας δίνει 14 είναι το 20 (20 － 6 ＝ 14).`,
    };
  },

  // 11. Τι είναι η λύση της εξίσωσης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΡΙΣΜΟΣ',
      question: `Τι σημαίνει η φράση «το x ＝ 5 είναι ρίζα της εξίσωσης»;`,
      options: makeUniqueOptions(
        'Σημαίνει ότι αν βάλουμε 5 στη θέση του x, το 1ο μέλος γίνεται ίσο με το 2ο μέλος',
        [
          'Σημαίνει ότι η εξίσωση δεν έχει καμία άλλη τιμή εκτός από το 5',
          'Σημαίνει ότι το δεύτερο μέλος της εξίσωσης είναι το 5',
          'Σημαίνει ότι πρέπει να διαιρέσουμε την εξίσωση με το 5'
        ]
      ),
      correctAnswer: 'Σημαίνει ότι αν βάλουμε 5 στη θέση του x, το 1ο μέλος γίνεται ίσο με το 2ο μέλος',
      solution: `Ρίζα (ή λύση) είναι η τιμή του αγνώστου που επαληθεύει την ισότητα.`,
    };
  },

  // 12. Εξίσωση με αρνητικό x (Input)
  () => {
    // -2x = 10 -> -5
    return {
      type: 'input',
      topic: 'ΕΞΙΣΩΣΗ ΜΕ ΑΡΝΗΤΙΚΑ',
      question: `Βρες τη λύση της εξίσωσης: <strong>－2 · x ＝ 10</strong>`,
      correctAnswer: '-5',
      solution: `Για να βγει θετικό αποτέλεσμα (10) από πολλαπλασιασμό με αρνητικό (－2), πρέπει το x να είναι αρνητικό. (－2) · (－5) ＝ 10, άρα x ＝ －5.`,
    };
  },

  // 13. Εύρεση συντελεστή 1 (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Στην εξίσωση <strong>x ＋ 7 ＝ 12</strong>, ποιος είναι ο συντελεστής του αγνώστου x;`,
      options: makeUniqueOptions('1', ['0', '7', '12']),
      correctAnswer: '1',
      solution: `Όταν το x είναι μόνο του, ο συντελεστής του εννοείται ότι είναι το 1 (διότι 1 · x ＝ x).`,
    };
  },

  // 14. Εξίσωση ισορροπίας (Input)
  () => {
    // 3x = x + 10 -> 2x = 10 -> 5
    return {
      type: 'input',
      topic: 'ΙΣΟΡΡΟΠΙΑ',
      question: `Αν σε μια ζυγαριά έχουμε 3 όμοια κουτιά (3x) αριστερά, και 1 κουτί (x) μαζί με 10 κιλά δεξιά, πόσα κιλά ζυγίζει το κάθε κουτί; (Δηλαδή λύσε την 3x ＝ x ＋ 10)`,
      correctAnswer: '5',
      solution: `Αφαιρώντας από 1 κουτί και στα δύο πιάτα, μας μένουν 2 κουτιά ＝ 10 κιλά. Άρα 1 κουτί ζυγίζει 5 κιλά.`,
    };
  },

  // 15. Δοκιμή λύσεων (MCQ)
  () => {
    // 3x - 1 = 20. Ρίζα: 7
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΛΥΣΗΣ',
      question: `Ποιος από τους παρακάτω αριθμούς είναι η λύση της εξίσωσης <strong>3 · x － 1 ＝ 20</strong>;`,
      options: makeUniqueOptions('7', ['6', '8', '21']),
      correctAnswer: '7',
      solution: `Αν δοκιμάσουμε το 7: 3 · 7 － 1 ＝ 21 － 1 ＝ 20. Επαληθεύεται!`,
    };
  },

  // 16. Μετάφραση μισού (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ',
      question: `Πώς μεταφράζεται στην Άλγεβρα η φράση: «Το μισό ενός αριθμού x ισούται με 8»;`,
      options: makeUniqueOptions('x ： 2 ＝ 8', ['2 · x ＝ 8', 'x － 2 ＝ 8', '8 ： 2 ＝ x']),
      correctAnswer: 'x ： 2 ＝ 8',
      solution: `Το μισό ενός αριθμού βρίσκεται με διαίρεση διά του 2. Οπότε x ： 2 ＝ 8.`,
    };
  },

  // 17. Εξίσωση με 0 (Input)
  () => {
    // x + 5 = 5 -> 0
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ',
      question: `Ποια είναι η λύση της εξίσωσης <strong>x ＋ 5 ＝ 5</strong>;`,
      correctAnswer: '0',
      solution: `Ο αριθμός που αν του προσθέσουμε 5 δεν αλλάζει είναι το 0 (0 ＋ 5 ＝ 5).`,
    };
  },

  // 18. Αρνητική ρίζα (Input)
  () => {
    // x + 3 = 1 -> -2
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ',
      question: `Βρες τη λύση της εξίσωσης: <strong>x ＋ 3 ＝ 1</strong>`,
      correctAnswer: '-2',
      solution: `Σκεφτόμαστε: ποιος αριθμός αν αυξηθεί κατά 3 δίνει 1; Είναι το －2 (αφού －2 ＋ 3 ＝ 1).`,
    };
  },

  // 19. Δύο πράξεις (Input)
  () => {
    // x/2 + 1 = 6 -> x/2 = 5 -> 10
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΡΙΖΑΣ',
      question: `Ποια είναι η λύση της εξίσωσης <strong>(x ： 2) ＋ 1 ＝ 6</strong>;`,
      correctAnswer: '10',
      solution: `Αφαιρώντας το 1, έχουμε ότι το μισό του x είναι 5 (x ： 2 ＝ 5). Άρα x ＝ 10.`,
    };
  },

  // 20. Απόλυτη τιμή σε εξίσωση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΕΞΙΣΩΣΕΩΝ',
      question: `Πόσες λύσεις έχει η εξίσωση <strong>0 · x ＝ 5</strong>;`,
      options: makeUniqueOptions(
        'Καμία, είναι αδύνατη',
        [
          'Μία, το 5',
          'Άπειρες, είναι ταυτότητα',
          'Μία, το 0'
        ]
      ),
      correctAnswer: 'Καμία, είναι αδύνατη',
      solution: `Το γινόμενο οποιουδήποτε αριθμού με το 0 κάνει 0. Δεν υπάρχει αριθμός x που να δίνει 0 · x ＝ 5. Άρα είναι αδύνατη.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΕΞΙΣΩΣΕΩΝ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Ταξί
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί χρεώνει 2 € με το ξεκίνημα (σημαία) και 1,50 € για κάθε χιλιόμετρο. Ένας επιβάτης πλήρωσε συνολικά 14 €. Πόσα χιλιόμετρα διένυσε;`,
      correctAnswer: '8',
      solution: `Έστω x τα χιλιόμετρα. Η εξίσωση είναι 1,5 · x ＋ 2 ＝ 14. Αφαιρώντας τα 2€ (σημαία), τα χιλιόμετρα κόστισαν 12€. Άρα 1,5 · x ＝ 12 ➔ x ＝ 12 ： 1,5 ＝ 8 km.`,
    };
  },

  // 2. Ηλικίες
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ',
      question: `Ο Γιάννης είναι 4 χρόνια μεγαλύτερος από τη Μαρία. Αν το άθροισμα των ηλικιών τους είναι 26, πόσων ετών είναι η Μαρία;`,
      correctAnswer: '11',
      solution: `Έστω x η ηλικία της Μαρίας. Ο Γιάννης είναι x ＋ 4. Εξίσωση: x ＋ (x ＋ 4) ＝ 26 ➔ 2x ＋ 4 ＝ 26 ➔ 2x ＝ 22 ➔ x ＝ 11.`,
    };
  },

  // 3. Περίμετρος τετραγώνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Η περίμετρος ενός τετραγώνου είναι 36 μέτρα. Πόσα μέτρα είναι το μήκος της πλευράς του;`,
      correctAnswer: '9',
      solution: `Έστω x η πλευρά του τετραγώνου. Επειδή έχει 4 ίσες πλευρές: 4 · x ＝ 36 ➔ x ＝ 36 ： 4 ＝ 9 m.`,
    };
  },

  // 4. Αποταμίευση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ',
      question: `Ο Κώστας είχε 40 € και αποφάσισε να αποταμιεύει 5 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συνολικά 100 €;`,
      correctAnswer: '12',
      solution: `Έστω x οι εβδομάδες. Εξίσωση: 5 · x ＋ 40 ＝ 100 ➔ 5 · x ＝ 60 ➔ x ＝ 60 ： 5 ＝ 12 εβδομάδες.`,
    };
  },

  // 5. Αγορές
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Η Ελένη αγόρασε 3 ίδια βιβλία και ένα τετράδιο που έκανε 2 €. Πλήρωσε συνολικά 26 €. Πόσα ευρώ κόστισε το κάθε βιβλίο;`,
      correctAnswer: '8',
      solution: `Έστω x η τιμή του βιβλίου. Εξίσωση: 3 · x ＋ 2 ＝ 26 ➔ 3 · x ＝ 24 ➔ x ＝ 24 ： 3 ＝ 8 €.`,
    };
  },

  // 6. Συσκευασία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Ένα άδειο καλάθι ζυγίζει 1 κιλό. Όταν τοποθετήσουμε μέσα 6 ίδια πεπόνια, το συνολικό βάρος γίνεται 13 κιλά. Πόσα κιλά ζυγίζει το κάθε πεπόνι;`,
      correctAnswer: '2',
      solution: `Έστω x το βάρος του πεπονιού. Εξίσωση: 6 · x ＋ 1 ＝ 13 ➔ 6 · x ＝ 12 ➔ x ＝ 12 ： 6 ＝ 2 kg.`,
    };
  },

  // 7. Εισιτήρια
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Σε έναν κινηματογράφο το εισιτήριο έχει 7 €. Μια ομάδα φίλων πλήρωσε 35 € μόνο για εισιτήρια. Πόσα άτομα ήταν στην ομάδα;`,
      correctAnswer: '5',
      solution: `Έστω x ο αριθμός των ατόμων. Εξίσωση: 7 · x ＝ 35 ➔ x ＝ 35 ： 7 ＝ 5 άτομα.`,
    };
  },

  // 8. Υδραυλικός
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Ένας τεχνικός χρεώνει 20 € για την επίσκεψη στο σπίτι και 15 € για κάθε ώρα εργασίας. Πληρώθηκε 80 € συνολικά. Πόσες ώρες εργάστηκε;`,
      correctAnswer: '4',
      solution: `Έστω x οι ώρες. Εξίσωση: 15 · x ＋ 20 ＝ 80 ➔ 15 · x ＝ 60 ➔ x ＝ 60 ： 15 ＝ 4 ώρες.`,
    };
  },

  // 9. Περίμετρος ορθογωνίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Η περίμετρος ενός ορθογωνίου είναι 30 m. Το πλάτος του είναι 5 m. Πόσα μέτρα είναι το μήκος του;`,
      correctAnswer: '10',
      solution: `Έστω x το μήκος. Η περίμετρος είναι Π ＝ 2x ＋ 2·5 ＝ 2x ＋ 10. Εξίσωση: 2x ＋ 10 ＝ 30 ➔ 2x ＝ 20 ➔ x ＝ 10 m.`,
    };
  },

  // 10. Συνδρομή γυμναστηρίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ',
      question: `Η εγγραφή σε ένα γυμναστήριο είναι 15 € και κάθε μήνας προπόνησης κοστίζει 25 €. Ο Νίκος πλήρωσε συνολικά 140 €. Πόσους μήνες προπονήθηκε;`,
      correctAnswer: '5',
      solution: `Έστω x οι μήνες. Εξίσωση: 25 · x ＋ 15 ＝ 140 ➔ 25 · x ＝ 125 ➔ x ＝ 125 ： 25 ＝ 5 μήνες.`,
    };
  },

  // 11. Κατανάλωση νερού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Μια δεξαμενή έχει 100 λίτρα νερό και αδειάζει κατά 4 λίτρα κάθε λεπτό. Σε πόσα λεπτά η δεξαμενή θα περιέχει ακριβώς 40 λίτρα;`,
      correctAnswer: '15',
      solution: `Έστω x τα λεπτά. Εξίσωση: 100 － 4 · x ＝ 40 ➔ 4 · x ＝ 60 ➔ x ＝ 60 ： 4 ＝ 15 λεπτά.`,
    };
  },

  // 12. Ενοικίαση αυτοκινήτου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ',
      question: `Η ενοικίαση ενός αυτοκινήτου κοστίζει 30 € την ημέρα. Ένας πελάτης πλήρωσε 210 € στο τέλος. Πόσες μέρες κράτησε το αυτοκίνητο;`,
      correctAnswer: '7',
      solution: `Έστω x οι μέρες. Εξίσωση: 30 · x ＝ 210 ➔ x ＝ 210 ： 30 ＝ 7 ημέρες.`,
    };
  },

  // 13. Μοίρασμα ποσού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Ο παππούς μοίρασε 120 € στα 4 εγγόνια του. Αν έδωσε 15 € στη μεγάλη του εγγονή και τα υπόλοιπα τα μοίρασε εξίσου στα άλλα 3 εγγόνια, πόσα ευρώ πήρε το καθένα από τα 3;`,
      correctAnswer: '35',
      solution: `Έστω x το ποσό για καθένα από τα 3. Εξίσωση: 3 · x ＋ 15 ＝ 120 ➔ 3 · x ＝ 105 ➔ x ＝ 105 ： 3 ＝ 35 €.`,
    };
  },

  // 14. Σκοποβολή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Σε ένα παιχνίδι σκοποβολής ξεκινάς με 50 πόντους. Για κάθε στόχο που πετυχαίνεις παίρνεις 8 πόντους. Η Μαρία τελείωσε με 90 πόντους. Πόσους στόχους πέτυχε;`,
      correctAnswer: '5',
      solution: `Έστω x οι στόχοι. Εξίσωση: 8 · x ＋ 50 ＝ 90 ➔ 8 · x ＝ 40 ➔ x ＝ 40 ： 8 ＝ 5 στόχοι.`,
    };
  },

  // 15. Ζυγίζοντας φρούτα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Σε μια ζυγαριά, στον αριστερό δίσκο υπάρχουν 2 ίδια καρπούζια. Στον δεξιό δίσκο υπάρχει 1 βαρίδι των 12 κιλών. Αν η ζυγαριά ισορροπεί, πόσα κιλά ζυγίζει το κάθε καρπούζι;`,
      correctAnswer: '6',
      solution: `Έστω x το βάρος του καρπουζιού. Εξίσωση: 2 · x ＝ 12 ➔ x ＝ 12 ： 2 ＝ 6 kg.`,
    };
  },

  // 16. Προβολές βίντεο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: INTERNET',
      question: `Ένα βίντεο είχε 200 προβολές την πρώτη μέρα. Στη συνέχεια προσθέτονταν σταθερά 50 προβολές κάθε ώρα. Σε πόσες ώρες (μετά την 1η μέρα) έφτασε τις 600 προβολές;`,
      correctAnswer: '8',
      solution: `Έστω x οι ώρες. Εξίσωση: 50 · x ＋ 200 ＝ 600 ➔ 50 · x ＝ 400 ➔ x ＝ 400 ： 50 ＝ 8 ώρες.`,
    };
  },

  // 17. Ηλεκτρική ενέργεια
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question: `Η μπαταρία ενός κινητού βρίσκεται στο 10% και φορτίζει κατά 3% κάθε λεπτό. Σε πόσα λεπτά η μπαταρία θα φτάσει στο 100%;`,
      correctAnswer: '30',
      solution: `Έστω x τα λεπτά. Εξίσωση: 3 · x ＋ 10 ＝ 100 ➔ 3 · x ＝ 90 ➔ x ＝ 90 ： 3 ＝ 30 λεπτά.`,
    };
  },

  // 18. Πρόβλημα με ζώα φάρμας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ',
      question: `Σε μια φάρμα υπάρχουν αγελάδες (με 4 πόδια) και 10 κότες (με 2 πόδια η καθεμία). Αν μετρήσαμε συνολικά 68 πόδια, πόσες είναι οι αγελάδες;`,
      correctAnswer: '12',
      solution: `Οι κότες έχουν 10 · 2 ＝ 20 πόδια. Έστω x οι αγελάδες. Εξίσωση: 4 · x ＋ 20 ＝ 68 ➔ 4 · x ＝ 48 ➔ x ＝ 48 ： 4 ＝ 12 αγελάδες.`,
    };
  },

  // 19. Δέντρα σε δενδροστοιχία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΥΡΙΚΗ',
      question: `Σε μια σειρά φυτεύτηκαν δενδρύλλια ανά 4 μέτρα. Η συνολική απόσταση από το πρώτο ως το τελευταίο δέντρο είναι 32 μέτρα. Πόσα διαστήματα των 4 μέτρων υπάρχουν;`,
      correctAnswer: '8',
      solution: `Έστω x ο αριθμός των διαστημάτων. Εξίσωση: 4 · x ＝ 32 ➔ x ＝ 32 ： 4 ＝ 8 διαστήματα (τα δέντρα είναι 9).`,
    };
  },

  // 20. Αγορά λουλουδιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Πέτρος αγόρασε 5 όμοια τριαντάφυλλα. Έδωσε ένα χαρτονόμισμα των 20 € και πήρε ρέστα 5 €. Πόσα ευρώ έκανε το κάθε τριαντάφυλλο;`,
      correctAnswer: '3',
      solution: `Το συνολικό κόστος είναι 20 － 5 ＝ 15 €. Έστω x η τιμή του τριαντάφυλλου. Εξίσωση: 5 · x ＝ 15 ➔ x ＝ 15 ： 5 ＝ 3 €.`,
    };
  },
];

export default function AlgebrikesSxeseisAsk() {
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
      title="Ασκήσεις: Αλγεβρικές Σχέσεις & Εξισώσεις | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην έννοια της εξίσωσης, τον συντελεστή και την εύρεση της ρίζας (λύσης) για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/31-algebrikes-sxeseis"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 29 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αλγεβρικές Σχέσεις & Εξισώσεις
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις κατανόησης εξισώσεων, ελέγχου λύσεων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 5 ή 11"
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
