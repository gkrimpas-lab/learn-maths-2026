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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΕΤΑΒΛΗΤΗΣ, ΣΥΝΤΕΛΕΣΤΗ & ΣΤΑΘΕΡΟΥ ΟΡΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση συντελεστή σε απλή παράσταση (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Ποιος είναι ο συντελεστής της μεταβλητής x στην παράσταση <strong>7 · x</strong>;`,
      correctAnswer: '7',
      solution: `Συντελεστής είναι ο αριθμός που πολλαπλασιάζεται με τη μεταβλητή, δηλαδή το 7.`,
    };
  },

  // 2. Εύρεση συντελεστή στο -x (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΙΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>－x</strong>;`,
      options: makeUniqueOptions('－1', ['0', '1', 'Δεν υπάρχει συντελεστής']),
      correctAnswer: '－1',
      solution: `Το －x ισοδυναμεί με (－1) · x, επομένως ο συντελεστής είναι το －1.`,
    };
  },

  // 3. Εύρεση σταθερού όρου (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ',
      question: `Ποιος είναι ο σταθερός όρος στην αλγεβρική παράσταση <strong>4 · x ＋ 9</strong>;`,
      correctAnswer: '9',
      solution: `Σταθερός όρος είναι ο αριθμός που δεν περιέχει μεταβλητή, δηλαδή το ＋9.`,
    };
  },

  // 4. Εύρεση αρνητικού σταθερού όρου (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΤΑΘΕΡΟΣ',
      question: `Ποιος είναι ο σταθερός όρος στην αλγεβρική παράσταση <strong>2 · x － 5</strong>;`,
      correctAnswer: '-5',
      solution: `Ο σταθερός όρος παίρνει πάντοτε το πρόσημό του: －5.`,
    };
  },

  // 5. Υπολογισμός αριθμητικής τιμής (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την αριθμητική τιμή της παράστασης <strong>3 · x ＋ 4</strong> για <strong>x ＝ 2</strong>:`,
      correctAnswer: '10',
      solution: `Αντικαθιστούμε x ＝ 2: 3 · 2 ＋ 4 ＝ 6 ＋ 4 ＝ 10.`,
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό x (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΜΕΤΑΒΛΗΤΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>5 · x ＋ 12</strong> για <strong>x ＝ －2</strong>:`,
      correctAnswer: '2',
      solution: `Αντικαθιστούμε x ＝ －2: 5 · (－2) ＋ 12 ＝ －10 ＋ 12 ＝ 2.`,
    };
  },

  // 7. Υπολογισμός τιμής με αρνητικό συντελεστή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>－2 · x ＋ 10</strong> για <strong>x ＝ 3</strong>:`,
      correctAnswer: '4',
      solution: `(－2) · 3 ＋ 10 ＝ －6 ＋ 10 ＝ 4.`,
    };
  },

  // 8. Υπολογισμός τιμής για x = 0 (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΗ ΜΕΤΑΒΛΗΤΗ',
      question: `Ποια είναι η τιμή της παράστασης <strong>8 · x ＋ 15</strong> όταν <strong>x ＝ 0</strong>;`,
      correctAnswer: '15',
      solution: `8 · 0 ＋ 15 ＝ 0 ＋ 15 ＝ 15 (μένει μόνο ο σταθερός όρος).`,
    };
  },

  // 9. Μετάβαση από λεκτική σε αλγεβρική μορφή (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ',
      question: `Πώς γράφεται συμβολικά η φράση: «Το πενταπλάσιο ενός αριθμού x αυξημένο κατά 3»;`,
      options: makeUniqueOptions('5 · x ＋ 3', ['5 · (x ＋ 3)', 'x ＋ 5 · 3', '5 · x － 3']),
      correctAnswer: '5 · x ＋ 3',
      solution: `Πενταπλάσιο του x είναι το 5 · x και αυξημένο κατά 3 είναι το ＋ 3, άρα 5 · x ＋ 3.`,
    };
  },

  // 10. Αναγνώριση σταθερού όρου στο 6x (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ',
      question: `Ποιος είναι ο σταθερός όρος στην παράσταση <strong>6 · x</strong>;`,
      options: makeUniqueOptions('0', ['6', '1', 'Δεν ορίζεται']),
      correctAnswer: '0',
      solution: `Η παράσταση 6x γράφεται 6x ＋ 0, άρα ο σταθερός όρος είναι το 0.`,
    };
  },

  // 11. Συντελεστής στο x (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>x ＋ 8</strong>;`,
      options: makeUniqueOptions('1', ['8', '0', 'Δεν υπάρχει']),
      correctAnswer: '1',
      solution: `Μπροστά από το x εννοείται ο αριθμός 1 (1 · x ＝ x), άρα ο συντελεστής είναι 1.`,
    };
  },

  // 12. Υπολογισμός τιμής με δύο αρνητικά (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΣΗΜΑ & ΥΠΟΛΟΓΙΣΜΟΣ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>－3 · x － 5</strong> για <strong>x ＝ －4</strong>:`,
      correctAnswer: '7',
      solution: `(－3) · (－4) － 5 ＝ ＋12 － 5 ＝ 7.`,
    };
  },

  // 13. Εύρεση μεταβλητής x όταν γνωρίζουμε την τιμή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΜΕΤΑΒΛΗΤΗΣ',
      question: `Αν η παράσταση <strong>2 · x ＋ 1</strong> έχει αριθμητική τιμή ίση με <strong>15</strong>, ποια είναι η τιμή του <strong>x</strong>;`,
      correctAnswer: '7',
      solution: `2 · x ＋ 1 ＝ 15 ➔ 2 · x ＝ 14 ➔ x ＝ 7.`,
    };
  },

  // 14. Συντελεστής με κλάσμα/δεκαδικό (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>0,5 · x ＋ 3</strong>;`,
      correctAnswer: '0,5',
      solution: `Ο συντελεστής είναι ο δεκαδικός αριθμός 0,5.`,
    };
  },

  // 15. Υπολογισμός τιμής με δεκαδικό (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>1,5 · x ＋ 2</strong> για <strong>x ＝ 4</strong>:`,
      correctAnswer: '8',
      solution: `1,5 · 4 ＋ 2 ＝ 6 ＋ 2 ＝ 8.`,
    };
  },

  // 16. Τι σημαίνει μεταβλητή (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΝΝΟΙΑ ΜΕΤΑΒΛΗΤΗΣ',
      question: `Τι παριστάνει μια μεταβλητή στα Μαθηματικά;`,
      options: makeUniqueOptions(
        'Ένα γράμμα που εκφράζει έναν άγνωστο αριθμό ή έναν αριθμό που μπορεί να πάρει διάφορες τιμές',
        [
          'Έναν αριθμό που παραμένει υποχρεωτικά σταθερός για πάντα',
          'Ένα γεωμετρικό σχήμα με 4 πλευρές',
          'Το σύμβολο του πολλαπλασιασμού',
        ]
      ),
      correctAnswer: 'Ένα γράμμα που εκφράζει έναν άγνωστο αριθμό ή έναν αριθμό που μπορεί να πάρει διάφορες τιμές',
      solution: `Η μεταβλητή είναι ένα γράμμα που εκφράζει άγνωστη ή μεταβαλλόμενη ποσότητα.`,
    };
  },

  // 17. Εύρεση συντελεστή σε παράσταση 10 - 4x (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Ποιος είναι ο συντελεστής του x στην παράσταση <strong>10 － 4 · x</strong>;`,
      correctAnswer: '-4',
      solution: `Μπροστά από το x βρίσκεται το －4 (η παράσταση γράφεται －4x ＋ 10), άρα ο συντελεστής είναι το －4.`,
    };
  },

  // 18. Σταθερός όρος στην 10 - 4x (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ',
      question: `Ποιος είναι ο σταθερός όρος στην παράσταση <strong>10 － 4 · x</strong>;`,
      correctAnswer: '10',
      solution: `Ο όρος χωρίς μεταβλητή είναι το ＋10.`,
    };
  },

  // 19. Υπολογισμός τιμής με κλάσμα (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>0,5 · x ＋ 5</strong> για <strong>x ＝ 6</strong>:`,
      correctAnswer: '8',
      solution: `0,5 · 6 ＋ 5 ＝ 3 ＋ 5 ＝ 8.`,
    };
  },

  // 20. Μετάφραση φράσης «ελαττωμένο» (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ',
      question: `Πώς εκφράζεται συμβολικά: «Το τετραπλάσιο ενός αριθμού x ελαττωμένο κατά 7»;`,
      options: makeUniqueOptions('4 · x － 7', ['4 · x ＋ 7', '7 · x － 4', '4 · (x － 7)']),
      correctAnswer: '4 · x － 7',
      solution: `Τετραπλάσιο είναι 4 · x και ελαττωμένο κατά 7 σημαίνει － 7.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Χρέωση ταξί
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί χρεώνει 2 € πάγια εκκίνηση (σημαία) και επιπλέον 1,50 € για κάθε χιλιόμετρο διαδρομής. Πόσο θα πληρώσει ένας επιβάτης για μια διαδρομή <strong>10 χιλιομέτρων</strong> σε ευρώ;`,
      correctAnswer: '17',
      solution: `Σταθερός όρος: 2 €. Μεταβλητό κόστος: 1,5 · 10 ＝ 15 €. Συνολικό κόστος: 1,5 · 10 ＋ 2 ＝ 17 €.`,
    };
  },

  // Πρόβλημα 2: Συνδρομή γυμναστηρίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ',
      question: `Ένα γυμναστήριο χρεώνει 20 € εφάπαξ εγγραφή και 25 € για κάθε μήνα προπόνησης. Πόσο θα πληρώσει συνολικά ένα νέο μέλος για <strong>4 μήνες</strong> σε ευρώ;`,
      correctAnswer: '120',
      solution: `Σταθερό κόστος εγγραφής: 20 €. Μηνιαίες συνδρομές: 25 · 4 ＝ 100 €. Σύνολο: 25 · 4 ＋ 20 ＝ 120 €.`,
    };
  },

  // Πρόβλημα 3: Αποταμίευση στον κουμπαρά
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ',
      question: `Η Ελένη έχει ήδη 30 € στον κουμπαρά της και αποφασίζει να αποταμιεύει 6 € κάθε εβδομάδα. Πόσα χρήματα θα έχει συγκεντρώσει συνολικά μετά από <strong>5 εβδομάδες</strong>;`,
      correctAnswer: '60',
      solution: `Αρχικό ποσό (σταθερό): 30 €. Αποταμίευση 5 εβδομάδων: 6 · 5 ＝ 30 €. Συνολικό ποσό: 6 · 5 ＋ 30 ＝ 60 €.`,
    };
  },

  // Πρόβλημα 4: Πάγιο κινητής τηλεφωνίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΗΛΕΦΩΝΙΑ',
      question: `Ένα συμβόλαιο κινητής τηλεφωνίας έχει σταθερό πάγιο 12 € το μήνα και χρεώνει 0,10 € για κάθε επιπλέον γραπτό μήνυμα. Πόσο θα πληρώσει ένας συνδρομητής που έστειλε <strong>50 επιπλέον μηνύματα</strong>;`,
      correctAnswer: '17',
      solution: `Σταθερό πάγιο: 12 €. Κόστος μηνυμάτων: 0,10 · 50 ＝ 5 €. Τελικό ποσό: 0,1 · 50 ＋ 12 ＝ 17 €.`,
    };
  },

  // Πρόβλημα 5: Ενοικίαση εργαλείου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Η ενοικίαση ενός μηχανήματος απαιτεί 15 € βασική εγγύηση συν 8 € για κάθε ημέρα χρήσης του. Πόσο θα πληρώσει ένας τεχνικός για <strong>6 ημέρες</strong> χρήσης;`,
      correctAnswer: '63',
      solution: `Βασική χρέωση: 15 €. Ημερήσιο κόστος: 8 · 6 ＝ 48 €. Σύνολο: 8 · 6 ＋ 15 ＝ 63 €.`,
    };
  },

  // Πρόβλημα 6: Κατανάλωση καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΥΤΟΚΙΝΗΤΟ',
      question: `Ένα ρεζερβουάρ περιέχει αρχικά 50 λίτρα βενζίνης. Το αυτοκίνητο καταναλώνει 2 λίτρα καυσίμου για κάθε ώρα ταξιδιού. Πόσα λίτρα βενζίνης θα απομένουν μετά από <strong>7 ώρες</strong> οδήγησης;`,
      correctAnswer: '36',
      solution: `Αρχικό καύσιμο: 50 L. Κατανάλωση: 2 · 7 ＝ 14 L. Απομένουν: 50 － 2 · 7 ＝ 36 L.`,
    };
  },

  // Πρόβλημα 7: Χρέωση εκτύπωσης βιβλίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ',
      question: `Ένα τυπογραφείο χρεώνει 25 € πάγια έξοδα σελιδοποίησης και επιπλέον 0,05 € για κάθε σελίδα που εκτυπώνεται. Πόσο κοστίζει η εκτύπωση ενός βιβλίου <strong>400 σελίδων</strong> σε ευρώ;`,
      correctAnswer: '45',
      solution: `Πάγιο: 25 €. Κόστος σελίδων: 0,05 · 400 ＝ 20 €. Τελικό κόστος: 0,05 · 400 ＋ 25 ＝ 45 €.`,
    };
  },

  // Πρόβλημα 8: Αμοιβή τεχνικού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ',
      question: `Ένας υδραυλικός χρεώνει 20 € σταθερή αμοιβή επίσκεψης και 15 € για κάθε ώρα εργασίας του. Πόσο θα πληρωθεί συνολικά για επισκευή που διήρκεσε <strong>3 ώρες</strong>;`,
      correctAnswer: '65',
      solution: `Πάγια επίσκεψη: 20 €. Ώρες εργασίας: 15 · 3 ＝ 45 €. Σύνολο: 15 · 3 ＋ 20 ＝ 65 €.`,
    };
  },

  // Πρόβλημα 9: Στάθμη νερού πισίνας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Μια δεξαμενή περιέχει αρχικά 80 κυβικά μέτρα νερό και αδειάζει με ρυθμό 3 κυβικά μέτρα ανά ώρα. Πόσα κυβικά μέτρα νερού θα απομένουν στη δεξαμενή μετά από <strong>10 ώρες</strong>;`,
      correctAnswer: '50',
      solution: `Αρχικό νερό: 80 κ.μ. Αδειάζουν: 3 · 10 ＝ 30 κ.μ. Απομένουν: 80 － 3 · 10 ＝ 50 κ.μ.`,
    };
  },

  // Πρόβλημα 10: Αγορά εισιτηρίων συναυλίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Σε μια συναυλία κάθε εισιτήριο κοστίζει 18 €, ενώ υπάρχει και μία σταθερή επιβάρυνση 3 € για ολόκληρη την ηλεκτρονική παραγγελία. Πόσο θα κοστίσει συνολικά η αγορά <strong>4 εισιτηρίων</strong>;`,
      correctAnswer: '75',
      solution: `Εισιτήρια: 18 · 4 ＝ 72 €. Πάγια επιβάρυνση: 3 €. Συνολικό κόστος: 18 · 4 ＋ 3 ＝ 75 €.`,
    };
  },

  // Πρόβλημα 11: Ύψος αναρριχητικού φυτού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΗ',
      question: `Ένα φυτό έχει αρχικό ύψος 10 cm και ψηλώνει σταθερά κατά 4 cm κάθε εβδομάδα. Ποιο θα είναι το ύψος του φυτού σε εκατοστά μετά από <strong>8 εβδομάδες</strong>;`,
      correctAnswer: '42',
      solution: `Αρχικό ύψος: 10 cm. Ανάπτυξη: 4 · 8 ＝ 32 cm. Τελικό ύψος: 4 · 8 ＋ 10 ＝ 42 cm.`,
    };
  },

  // Πρόβλημα 12: Φόρτιση μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Η μπαταρία ενός φορητού υπολογιστή βρίσκεται στο 15% και φορτίζει με σταθερό ρυθμό 2% ανά λεπτό. Σε ποιο ποσοστό (%) θα βρίσκεται η μπαταρία μετά από <strong>25 λεπτά</strong> φόρτισης;`,
      correctAnswer: '65',
      solution: `Αρχικό ποσοστό: 15%. Αύξηση: 2 · 25 ＝ 50%. Τελικό ποσοστό: 2 · 25 ＋ 15 ＝ 65%.`,
    };
  },

  // Πρόβλημα 13: Κόστος παράδοσης δεμάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: COURIER',
      question: `Μια εταιρεία ταχυμεταφορών χρεώνει 4 € πάγια έξοδα αποστολής συν 1,20 € για κάθε κιλό βάρους του δέματος. Πόσο κοστίζει η αποστολή ενός δέματος βάρους <strong>5 kg</strong>;`,
      correctAnswer: '10',
      solution: `Πάγια αποστολή: 4 €. Χρέωση βάρους: 1,2 · 5 ＝ 6 €. Σύνολο: 1,2 · 5 ＋ 4 ＝ 10 €.`,
    };
  },

  // Πρόβλημα 14: Καύση κεριού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα κερί έχει αρχικό ύψος 30 cm και καίγεται μειούμενο κατά 2,5 cm για κάθε ώρα που παραμένει αναμμένο. Ποιο θα είναι το ύψος του κεριού σε εκατοστά μετά από <strong>4 ώρες</strong>;`,
      correctAnswer: '20',
      solution: `Αρχικό ύψος: 30 cm. Μείωση: 2,5 · 4 ＝ 10 cm. Υπόλοιπο ύψος: 30 － 2,5 · 4 ＝ 20 cm.`,
    };
  },

  // Πρόβλημα 15: Παραγωγή ηλιακών πάνελ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question: `Μια μπαταρία ηλιακού συστήματος περιέχει ήδη 10 kWh ενέργειας. Κατά τη διάρκεια της ημέρας τα πάνελ προσθέτουν 3 kWh για κάθε ώρα ηλιοφάνειας. Πόση ενέργεια (σε kWh) θα περιέχει η μπαταρία μετά από <strong>6 ώρες</strong> ηλιοφάνειας;`,
      correctAnswer: '28',
      solution: `Αρχικό απόθεμα: 10 kWh. Νέα ενέργεια: 3 · 6 ＝ 18 kWh. Σύνολο: 3 · 6 ＋ 10 ＝ 28 kWh.`,
    };
  },

  // Πρόβλημα 16: Αμοιβή babysitting
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Μια παιδαγωγός χρεώνει 5 € πάγια έξοδα μετακίνησης και 7 € για κάθε ώρα απασχόλησης. Πόσο θα πληρωθεί για απασχόληση διάρκειας <strong>4 ωρών</strong> σε ευρώ;`,
      correctAnswer: '33',
      solution: `Μετακίνηση: 5 €. Ωριαία αμοιβή: 7 · 4 ＝ 28 €. Τελική αμοιβή: 7 · 4 ＋ 5 ＝ 33 €.`,
    };
  },

  // Πρόβλημα 17: Χωρητικότητα σκληρού δίσκου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question: `Σε έναν υπολογιστή υπάρχουν 100 GB ελεύθερου αποθηκευτικού χώρου. Κάθε εφαρμογή που εγκαθίσταται καταλαμβάνει σταθερά 12 GB. Πόσα GB ελεύθερου χώρου θα απομένουν μετά την εγκατάσταση <strong>5 εφαρμογών</strong>;`,
      correctAnswer: '40',
      solution: `Αρχικός χώρος: 100 GB. Δεσμευμένος χώρος: 12 · 5 ＝ 60 GB. Ελεύθερος χώρος: 100 － 12 · 5 ＝ 40 GB.`,
    };
  },

  // Πρόβλημα 18: Ενοικίαση αυτοκινήτου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ',
      question: `Μια εταιρεία ενοικίασης αυτοκινήτων χρεώνει 40 € πάγιο κόστος ασφάλισης και 35 € για κάθε ημέρα ενοικίασης του οχήματος. Πόσο θα κοστίσει η ενοικίαση για <strong>3 ημέρες</strong>;`,
      correctAnswer: '145',
      solution: `Ασφάλιση: 40 €. Ημερήσιο κόστος: 35 · 3 ＝ 105 €. Συνολικό κόστος: 35 · 3 ＋ 40 ＝ 145 €.`,
    };
  },

  // Πρόβλημα 19: Κόστος catering εκδήλωσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ',
      question: `Μια υπηρεσία τροφοδοσίας χρεώνει 50 € πάγιο κόστος οργάνωσης εξοπλισμού και 12 € για το μενού κάθε καλεσμένου. Πόσο θα κοστίσει το τραπέζι για <strong>20 καλεσμένους</strong>;`,
      correctAnswer: '290',
      solution: `Πάγιο οργάνωσης: 50 €. Κόστος καλεσμένων: 12 · 20 ＝ 240 €. Σύνολο: 12 · 20 ＋ 50 ＝ 290 €.`,
    };
  },

  // Πρόβλημα 20: Δαπάνες θέρμανσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΠΙΤΙ',
      question: `Η λειτουργία ενός καυστήρα απαιτεί 10 € μηνιαίο πάγιο συντήρησης και καταναλώνει καύσιμο αξίας 1,50 € για κάθε ώρα λειτουργίας. Ποιο είναι το συνολικό κόστος για <strong>40 ώρες</strong> λειτουργίας μέσα στον μήνα;`,
      correctAnswer: '70',
      solution: `Πάγιο: 10 €. Κόστος καυσίμου: 1,5 · 40 ＝ 60 €. Σύνολο: 1,5 · 40 ＋ 10 ＝ 70 €.`,
    };
  },
];

export default function MetablitiAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, μείον και μεταβλητή x
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
      title="Ασκήσεις: Η Έννοια της Μεταβλητής | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην έννοια της μεταβλητής, τον συντελεστή και τον σταθερό όρο για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/27-metabliti"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 25 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μεταβλητή, Συντελεστής & Σταθερός Όρος
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις αναγνώρισης όρων και υπολογισμού αριθμητικής τιμής + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 17 ή 45"
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
