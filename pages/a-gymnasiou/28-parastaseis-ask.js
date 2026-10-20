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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΡΙΘΜΗΤΙΚΩΝ & ΑΛΓΕΒΡΙΚΩΝ ΠΑΡΑΣΤΑΣΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Διάκριση Αριθμητικής Παράστασης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΙΑΚΡΙΣΗ ΠΑΡΑΣΤΑΣΕΩΝ',
      question: `Ποια από τις παρακάτω παραστάσεις είναι <strong>αριθμητική</strong>;`,
      options: makeUniqueOptions(
        '3 · 4 ＋ 5 · 2',
        ['3 · x ＋ 5', '2 · α － 4', 'x² ＋ 1']
      ),
      correctAnswer: '3 · 4 ＋ 5 · 2',
      solution: `Αριθμητική παράσταση είναι εκείνη που περιέχει μόνο αριθμούς και πράξεις μεταξύ τους, χωρίς καθόλου μεταβλητές (γράμματα).`,
    };
  },

  // 2. Διάκριση Αλγεβρικής Παράστασης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΙΑΚΡΙΣΗ ΠΑΡΑΣΤΑΣΕΩΝ',
      question: `Ποια από τις παρακάτω εκφράσεις είναι <strong>αλγεβρική παράσταση</strong>;`,
      options: makeUniqueOptions(
        '4 · x － 7',
        ['12 ＋ 8 ： 2', '5 · (6 － 2)', '10² － 25']
      ),
      correctAnswer: '4 · x － 7',
      solution: `Αλγεβρική παράσταση ονομάζεται κάθε έκφραση που περιέχει τουλάχιστον μία μεταβλητή (εδώ το x).`,
    };
  },

  // 3. Υπολογισμός τιμής αριθμητικής παράστασης (Input)
  () => {
    // 4 * 5 - 18 : 3 = 20 - 6 = 14
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      question: `Υπολόγισε την τιμή της αριθμητικής παράστασης: <strong>4 · 5 － 18 ： 3</strong>`,
      correctAnswer: '14',
      solution: `Προηγούνται πολλαπλασιασμός και διαίρεση: 4 · 5 ＝ 20 και 18 ： 3 ＝ 6. Στη συνέχεια: 20 － 6 ＝ 14.`,
    };
  },

  // 4. Υπολογισμός αλγεβρικής παράστασης για x = 3 (Input)
  () => {
    // 2x^2 + 5 για x = 3 -> 2*9 + 5 = 23
    return {
      type: 'input',
      topic: 'ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      question: `Υπολόγισε την αριθμητική τιμή της παράστασης <strong>2 · x² ＋ 5</strong> για <strong>x ＝ 3</strong>:`,
      correctAnswer: '23',
      solution: `Για x ＝ 3 έχουμε: 2 · 3² ＋ 5 ＝ 2 · 9 ＋ 5 ＝ 18 ＋ 5 ＝ 23.`,
    };
  },

  // 5. Μετάφραση προβλήματος σε αλγεβρική παράσταση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΟΝΤΕΛΟΠΟΙΗΣΗ',
      question: `Ένα κατάστημα χρεώνει 5 € πάγια συσκευασία συν 3 € για κάθε μπλούζα x. Ποια είναι η αλγεβρική παράσταση του κόστους;`,
      options: makeUniqueOptions('3 · x ＋ 5', ['5 · x ＋ 3', '3 · (x ＋ 5)', '8 · x']),
      correctAnswer: '3 · x ＋ 5',
      solution: `Για x μπλούζες το κόστος είναι 3 · x συν το πάγιο 5 €, δηλαδή 3 · x ＋ 5.`,
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό x (Input)
  () => {
    // 4x + 15 για x = -2 -> -8 + 15 = 7
    return {
      type: 'input',
      topic: 'ΑΛΓΕΒΡΙΚΗ ΜΕ ΑΡΝΗΤΙΚΟ',
      question: `Υπολόγισε την τιμή της αλγεβρικής παράστασης <strong>4 · x ＋ 15</strong> για <strong>x ＝ －2</strong>:`,
      correctAnswer: '7',
      solution: `4 · (－2) ＋ 15 ＝ －8 ＋ 15 ＝ 7.`,
    };
  },

  // 7. Αριθμητική παράσταση με παρενθέσεις (Input)
  () => {
    // 3 * (8 + 2) - 10 = 30 - 10 = 20
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      question: `Υπολόγισε την τιμή της παράστασης: <strong>3 · (8 ＋ 2) － 10</strong>`,
      correctAnswer: '20',
      solution: `Μέσα στην παρένθεση: 8 ＋ 2 ＝ 10. Έπειτα: 3 · 10 － 10 ＝ 30 － 10 ＝ 20.`,
    };
  },

  // 8. Υπολογισμός αλγεβρικής παράστασης δύο μεταβλητών (Input)
  () => {
    // 3a + 2b για a = 4, b = 5 -> 12 + 10 = 22
    return {
      type: 'input',
      topic: 'ΔΥΟ ΜΕΤΑΒΛΗΤΕΣ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>3 · α ＋ 2 · β</strong> όταν <strong>α ＝ 4</strong> και <strong>β ＝ 5</strong>:`,
      correctAnswer: '22',
      solution: `3 · 4 ＋ 2 · 5 ＝ 12 ＋ 10 ＝ 22.`,
    };
  },

  // 9. Μετατροπή λεκτικής έκφρασης σε αλγεβρική (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ',
      question: `Πώς εκφράζεται συμβολικά: «Το ένα τρίτο ενός ποσού x ελαττωμένο κατά 4»;`,
      options: makeUniqueOptions('(x ： 3) － 4', ['3 · x － 4', '(x － 4) ： 3', 'x ： (3 － 4)']),
      correctAnswer: '(x ： 3) － 4',
      solution: `Το ένα τρίτο του x είναι x ： 3 (ή x/3) και ελαττωμένο κατά 4 σημαίνει － 4.`,
    };
  },

  // 10. Πότε μηδενίζεται η παράσταση (Input)
  () => {
    // 5x - 20 = 0 -> x = 4
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ',
      question: `Για ποια τιμή του <strong>x</strong> η αλγεβρική παράσταση <strong>5 · x － 20</strong> ισούται με <strong>0</strong>;`,
      correctAnswer: '4',
      solution: `5 · x － 20 ＝ 0 ➔ 5 · x ＝ 20 ➔ x ＝ 20 ： 5 ＝ 4.`,
    };
  },

  // 11. Υπολογισμός για x = 0 (Input)
  () => {
    // 7x^2 - 3x + 9 για x = 0 -> 9
    return {
      type: 'input',
      topic: 'ΤΙΜΗ ΓΙΑ x = 0',
      question: `Ποια είναι η τιμή της παράστασης <strong>7 · x² － 3 · x ＋ 9</strong> όταν <strong>x ＝ 0</strong>;`,
      correctAnswer: '9',
      solution: `7 · 0² － 3 · 0 ＋ 9 ＝ 0 － 0 ＋ 9 ＝ 9.`,
    };
  },

  // 12. Αριθμητική παράσταση με δύναμη (Input)
  () => {
    // 2^3 * 5 - 4^2 = 8*5 - 16 = 40 - 16 = 24
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΜΕ ΔΥΝΑΜΕΙΣ',
      question: `Υπολόγισε την τιμή: <strong>2³ · 5 － 4²</strong>`,
      correctAnswer: '24',
      solution: `2³ ＝ 8 και 4² ＝ 16. Άρα: 8 · 5 － 16 ＝ 40 － 16 ＝ 24.`,
    };
  },

  // 13. Επιλογή τύπου παράστασης σε πραγματικό σενάριο (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΟΝΤΕΛΟΠΟΙΗΣΗ',
      question: `Αν θέλουμε να εκφράσουμε το κόστος αγοράς εισιτηρίων όταν δεν γνωρίζουμε ακόμη πόσα άτομα θα έρθουν, ποιο είδος παράστασης θα χρησιμοποιήσουμε;`,
      options: makeUniqueOptions(
        'Αλγεβρική παράσταση με μεταβλητή το πλήθος των ατόμων',
        [
          'Αριθμητική παράσταση με τυχαίους αριθμούς',
          'Μόνο γεωμετρικό σχήμα χωρίς μαθηματικά σύμβολα',
          'Έναν απλό ακέραιο αριθμό'
        ]
      ),
      correctAnswer: 'Αλγεβρική παράσταση με μεταβλητή το πλήθος των ατόμων',
      solution: `Όταν ένα μέγεθος είναι μεταβαλλόμενο ή άγνωστο, χρησιμοποιούμε αλγεβρική παράσταση με μεταβλητή (π.χ. x).`,
    };
  },

  // 14. Υπολογισμός περιμέτρου ορθογωνίου (Input)
  () => {
    // Π = 2*(x + 3) + 2*4 = 2x + 6 + 8 = 2x + 14. Για x = 5 -> 24
    return {
      type: 'input',
      topic: 'ΓΕΩΜΕΤΡΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      question: `Ένα ορθογώνιο έχει διαστάσεις μήκος <strong>x ＋ 3</strong> και πλάτος <strong>4</strong>. Υπολόγισε την περίμετρό του όταν <strong>x ＝ 5</strong>:`,
      correctAnswer: '24',
      solution: `Για x ＝ 5, το μήκος είναι 5 ＋ 3 ＝ 8. Η περίμετρος είναι 2 · 8 ＋ 2 · 4 ＝ 16 ＋ 8 ＝ 24.`,
    };
  },

  // 15. Απλοποίηση πριν τον υπολογισμό (Input)
  () => {
    // 3x + 5x - 2x για x = 4 -> 6x = 24
    return {
      type: 'input',
      topic: 'ΑΝΑΓΩΓΗ & ΥΠΟΛΟΓΙΣΜΟΣ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>3 · x ＋ 5 · x － 2 · x</strong> για <strong>x ＝ 4</strong>:`,
      correctAnswer: '24',
      solution: `Απλοποιούμε πρώτα τους όμοιους όρους: (3 ＋ 5 － 2) · x ＝ 6 · x. Για x ＝ 4: 6 · 4 ＝ 24.`,
    };
  },

  // 16. Τι είναι μεταβλητή σε παράσταση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΑΡΑΣΤΑΣΕΩΝ',
      question: `Ποιο στοιχείο μετατρέπει μια αριθμητική παράσταση σε αλγεβρική;`,
      options: makeUniqueOptions(
        'Η παρουσία τουλάχιστον μίας μεταβλητής (γράμματος)',
        [
          'Η χρήση παρενθέσεων',
          'Η ύπαρξη δυνάμεων',
          'Το σύμβολο της διαίρεσης'
        ]
      ),
      correctAnswer: 'Η παρουσία τουλάχιστον μίας μεταβλητής (γράμματος)',
      solution: `Η παρουσία μεταβλητής είναι το καθοριστικό στοιχείο που χαρακτηρίζει μια παράσταση ως αλγεβρική.`,
    };
  },

  // 17. Υπολογισμός τιμής με δεκαδικό x (Input)
  () => {
    // 2x + 3 για x = 2.5 -> 5 + 3 = 8
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>2 · x ＋ 3</strong> για <strong>x ＝ 2,5</strong>:`,
      correctAnswer: '8',
      solution: `2 · 2,5 ＋ 3 ＝ 5 ＋ 3 ＝ 8.`,
    };
  },

  // 18. Υπολογισμός εμβαδού τριγώνου με μεταβλητή (Input)
  () => {
    // Ε = (βάση * ύψος) / 2 = (x * 6) / 2 = 3x. Για x = 7 -> 21
    return {
      type: 'input',
      topic: 'ΕΜΒΑΔΟΝ ΜΕ ΜΕΤΑΒΛΗΤΗ',
      question: `Το εμβαδόν τριγώνου με βάση x και ύψος 6 δίνεται από την παράσταση <strong>(6 · x) ： 2</strong>. Ποιο είναι το εμβαδόν για <strong>x ＝ 7</strong>;`,
      correctAnswer: '21',
      solution: `(6 · 7) ： 2 ＝ 42 ： 2 ＝ 21.`,
    };
  },

  // 19. Αντικατάσταση δύο μεταβλητών με αρνητικό (Input)
  () => {
    // 2a - 3b για a = 5, b = -2 -> 10 - (-6) = 16
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ',
      question: `Υπολόγισε την τιμή της παράστασης <strong>2 · α － 3 · β</strong> όταν <strong>α ＝ 5</strong> και <strong>β ＝ －2</strong>:`,
      correctAnswer: '16',
      solution: `2 · 5 － 3 · (－2) ＝ 10 － (－6) ＝ 10 ＋ 6 ＝ 16.`,
    };
  },

  // 20. Έλεγχος ισότητας παραστάσεων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΣΟΔΥΝΑΜΙΑ',
      question: `Ποια από τις παρακάτω παραστάσεις είναι ισοδύναμη με την <strong>2 · (x ＋ 4)</strong>;`,
      options: makeUniqueOptions('2 · x ＋ 8', ['2 · x ＋ 4', 'x ＋ 8', '2 · x · 4']),
      correctAnswer: '2 · x ＋ 8',
      solution: `Εφαρμόζοντας την επιμεριστική ιδιότητα: 2 · (x ＋ 4) ＝ 2 · x ＋ 2 · 4 ＝ 2 · x ＋ 8.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Έξοδα σχολικής εκδρομής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Για μια σχολική εκδρομή ναυλώθηκε λεωφορείο με πάγιο κόστος 180 €, ενώ το εισιτήριο στο μουσείο κοστίζει 4 € ανά μαθητή. Πόσο θα κοστίσει συνολικά η εκδρομή αν συμμετάσχουν <strong>25 μαθητές</strong> σε ευρώ;`,
      correctAnswer: '280',
      solution: `Πάγιο λεωφορείου: 180 €. Εισιτήρια μουσείου: 4 · 25 ＝ 100 €. Συνολικό κόστος: 180 ＋ 100 ＝ 280 €.`,
    };
  },

  // Πρόβλημα 2: Παραγγελία πίτσας με διανομή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ',
      question: `Μια πιτσαρία χρεώνει 8 € για κάθε οικογενειακή πίτσα και επιπλέον 2,50 € πάγια έξοδα διανομής (delivery) για όλη την παραγγελία. Πόσο θα πληρώσει μια παρέα που παρήγγειλε <strong>4 πίτσες</strong> σε ευρώ;`,
      correctAnswer: '34,5',
      solution: `Κόστος πιτσών: 8 · 4 ＝ 32 €. Έξοδα διανομής: 2,50 €. Συνολικό ποσό: 32 ＋ 2,5 ＝ 34,50 € (γράφεται 34,5).`,
    };
  },

  // Πρόβλημα 3: Ενοικίαση ηλεκτρικού πατινιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΚΙΝΗΣΗ',
      question: `Η χρήση ηλεκτρικού πατινιού κοστίζει 1 € για το ξεκλείδωμα συν 0,20 € για κάθε λεπτό διαδρομής. Πόσο θα κοστίσει μια διαδρομή διάρκειας <strong>35 λεπτών</strong> σε ευρώ;`,
      correctAnswer: '8',
      solution: `Πάγιο ξεκλείδωμα: 1 €. Χρέωση χρόνου: 0,20 · 35 ＝ 7 €. Συνολικό κόστος: 1 ＋ 7 ＝ 8 €.`,
    };
  },

  // Πρόβλημα 4: Περίμετρος οικοπέδου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο οικόπεδο έχει πλάτος 15 μέτρα και το μήκος του είναι κατά 8 μέτρα μεγαλύτερο από το πλάτος του. Πόσα μέτρα συρματόπλεγμα χρειάζονται για να περιφραχτεί ολόκληρο το οικόπεδο;`,
      correctAnswer: '76',
      solution: `Πλάτος: 15 m. Μήκος: 15 ＋ 8 ＝ 23 m. Περίμετρος: 2 · 23 ＋ 2 · 15 ＝ 46 ＋ 30 ＝ 76 m.`,
    };
  },

  // Πρόβλημα 5: Αμοιβή baby sitting με έξοδα κίνησης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Μια παιδαγωγός λαμβάνει 6 € πάγια αποζημίωση μετακίνησης και 8 € για κάθε ώρα απασχόλησης. Πόσα ευρώ θα πληρωθεί συνολικά για εργασία <strong>5 ωρών</strong>;`,
      correctAnswer: '46',
      solution: `Πάγια μετακίνηση: 6 €. Ωρομίσθιο: 8 · 5 ＝ 40 €. Σύνολο: 6 ＋ 40 ＝ 46 €.`,
    };
  },

  // Πρόβλημα 6: Στάθμη δεξαμενής καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Μια δεξαμενή πετρελαίου περιείχε αρχικά 450 λίτρα. Ένας καυστήρας καταναλώνει 15 λίτρα για κάθε ώρα λειτουργίας. Πόσα λίτρα πετρελαίου θα απομένουν στη δεξαμενή μετά από <strong>12 ώρες</strong> συνεχούς λειτουργίας;`,
      correctAnswer: '270',
      solution: `Αρχική ποσότητα: 450 L. Κατανάλωση: 15 · 12 ＝ 180 L. Απομένουν: 450 － 180 ＝ 270 L.`,
    };
  },

  // Πρόβλημα 7: Αγορά γραφικής ύλης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Ανδρέας αγόρασε 5 ίδια τετράδια προς 1,80 € το ένα και 3 στυλό προς 0,90 € το ένα. Πόσα ρέστα πήρε από χαρτονόμισμα των 20 €;`,
      correctAnswer: '8,3',
      solution: `Κόστος τετραδίων: 5 · 1,80 ＝ 9 €. Κόστος στυλό: 3 · 0,90 ＝ 2,70 €. Συνολικό κόστος: 9 ＋ 2,70 ＝ 11,70 €. Ρέστα: 20 － 11,70 ＝ 8,30 € (γράφεται 8,3).`,
    };
  },

  // Πρόβλημα 8: Εμβαδόν πλατείας με συντριβάνι
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Μια ορθογώνια πλατεία έχει διαστάσεις 30 m επί 20 m. Στο κέντρο της κατασκευάζεται τετράγωνο συντριβάνι πλευράς 6 m. Ποιο είναι το καθαρό εμβαδόν της πλατείας που απομένει για τους πεζούς σε τ.μ.;`,
      correctAnswer: '564',
      solution: `Εμβαδόν πλατείας: 30 · 20 ＝ 600 τ.μ. Εμβαδόν συντριβανιού: 6 · 6 ＝ 36 τ.μ. Καθαρό εμβαδόν: 600 － 36 ＝ 564 τ.μ.`,
    };
  },

  // Πρόβλημα 9: Αποταμίευση για αγορά κονσόλας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ο Μάνος έχει ήδη αποταμιεύσει 65 € και προσθέτει στον κουμπαρά του 15 € κάθε εβδομάδα. Πόσα χρήματα θα έχει συγκεντρώσει συνολικά μετά από <strong>9 εβδομάδες</strong>;`,
      correctAnswer: '200',
      solution: `Αρχικό ποσό: 65 €. Νέα αποταμίευση: 15 · 9 ＝ 135 €. Σύνολο: 65 ＋ 135 ＝ 200 €.`,
    };
  },

  // Πρόβλημα 10: Φόρτωση κιβωτίων σε ανελκυστήρα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Σε έναν ανελκυστήρα φορτίων μπαίνει ο χειριστής που ζυγίζει 85 kg μαζί με 14 όμοια κιβώτια βάρους 25 kg το καθένα. Ποιο είναι το συνολικό φορτίο σε kg;`,
      correctAnswer: '435',
      solution: `Βάρος χειριστή: 85 kg. Βάρος κιβωτίων: 14 · 25 ＝ 350 kg. Συνολικό βάρος: 85 ＋ 350 ＝ 435 kg.`,
    };
  },

  // Πρόβλημα 11: Χρέωση εκτύπωσης αφισών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ',
      question: `Ένα τυπογραφείο χρεώνει 30 € πάγια έξοδα σχεδιασμού μακέτας και 0,50 € για την εκτύπωση κάθε αφίσας. Πόσο θα κοστίσει η εκτύπωση <strong>120 αφισών</strong> σε ευρώ;`,
      correctAnswer: '90',
      solution: `Πάγιο μακέτας: 30 €. Κόστος εκτύπωσης: 0,50 · 120 ＝ 60 €. Συνολικό κόστος: 30 ＋ 60 ＝ 90 €.`,
    };
  },

  // Πρόβλημα 12: Διαδρομή τρένου με ενδιάμεσες στάσεις
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένα τρένο ταξιδεύει επί 3 ώρες με σταθερή ταχύτητα 80 km/h και στη συνέχεια κάνει 4 στάσεις διάρκειας 15 λεπτών η καθεμία. Πόσα λεπτά διήρκεσαν συνολικά όλες οι στάσεις μαζί;`,
      correctAnswer: '60',
      solution: `4 στάσεις των 15 λεπτών: 4 · 15 ＝ 60 λεπτά (1 ώρα).`,
    };
  },

  // Πρόβλημα 13: Κόστος πλυσίματος αυτοκινήτου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ',
      question: `Ένα πλυντήριο αυτοκινήτων χρεώνει 7 € βασικό εξωτερικό πλύσιμο συν 2,50 € για κάθε επιπλέον ειδικό καθαριστικό. Πόσο θα πληρώσει ένας οδηγός που επέλεξε <strong>3 ειδικά καθαριστικά</strong> σε ευρώ;`,
      correctAnswer: '14,5',
      solution: `Βασικό πλύσιμο: 7 €. Καθαριστικά: 3 · 2,50 ＝ 7,50 €. Συνολικό ποσό: 7 ＋ 7,50 ＝ 14,50 € (γράφεται 14,5).`,
    };
  },

  // Πρόβλημα 14: Κατασκευή περιφράγματος με πασσάλους
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Σε έναν ευθύγραμμο φράχτη τοποθετούνται 16 πάσσαλοι σε ίση απόσταση 3 μέτρων ο ένας από τον επόμενο. Ποιο είναι το συνολικό μήκος του φράχτη από τον πρώτο έως τον τελευταίο πάσσαλο σε μέτρα;`,
      correctAnswer: '45',
      solution: `Ανάμεσα σε 16 πασσάλους υπάρχουν 15 ίσα διαστήματα: 15 · 3 ＝ 45 μέτρα.`,
    };
  },

  // Πρόβλημα 15: Συνδρομή streaming πλατφόρμας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ',
      question: `Μια πλατφόρμα ταινιών χρεώνει 9 € μηνιαία συνδρομή και 2 € για κάθε ταινία νέας κυκλοφορίας που ενοικιάζεται. Πόσο θα πληρώσει ένας συνδρομητής που ενοικίασε <strong>6 νέες ταινίες</strong> μέσα στον μήνα;`,
      correctAnswer: '21',
      solution: `Πάγια συνδρομή: 9 €. Ενοικιάσεις: 6 · 2 ＝ 12 €. Συνολικός λογαριασμός: 9 ＋ 12 ＝ 21 €.`,
    };
  },

  // Πρόβλημα 16: Εμβαδόν διαδρόμου γύρω από κήπο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένας τετράγωνος κήπος έχει πλευρά 10 m. Γύρω του κατασκευάζεται διάδρομος, διαμορφώνοντας ένα μεγαλύτερο τετράγωνο συνολικής πλευράς 12 m. Ποιο είναι το εμβαδόν του διαδρόμου σε τ.μ.;`,
      correctAnswer: '44',
      solution: `Εξωτερικό τετράγωνο: 12 · 12 ＝ 144 τ.μ. Εσωτερικός κήπος: 10 · 10 ＝ 100 τ.μ. Εμβαδόν διαδρόμου: 144 － 100 ＝ 44 τ.μ.`,
    };
  },

  // Πρόβλημα 17: Συγκομιδή ελαιοκάρπου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question: `Ένας παραγωγός γέμισε 8 σακιά των 50 kg και άλλα 6 σακιά των 40 kg. Πόσα κιλά ελιές μάζεψε συνολικά;`,
      correctAnswer: '640',
      solution: `8 · 50 ＝ 400 kg και 6 · 40 ＝ 240 kg. Συνολική συγκομιδή: 400 ＋ 240 ＝ 640 kg.`,
    };
  },

  // Πρόβλημα 18: Κατανάλωση ηλεκτρικού ρεύματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question: `Ένας λογαριασμός ρεύματος περιλαμβάνει 18 € πάγια δημοτικά τέλη και χρεώνει 0,15 € για κάθε κιλοβατώρα (kWh) κατανάλωσης. Πόσο θα πληρώσει ένα νοικοκυριό που κατανάλωσε <strong>300 kWh</strong> σε ευρώ;`,
      correctAnswer: '63',
      solution: `Πάγια τέλη: 18 €. Χρέωση ενέργειας: 0,15 · 300 ＝ 45 €. Συνολικό ποσό: 18 ＋ 45 ＝ 63 €.`,
    };
  },

  // Πρόβλημα 19: Χρέωση γηπέδου τένις
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Η ενοικίαση γηπέδου τένις κοστίζει 10 € την ώρα, συν 4 € εφάπαξ για τον φωτισμό του γηπέδου το βράδυ. Πόσο θα κοστίσει η προπόνηση για <strong>2 ώρες</strong> με αναμμένο φωτισμό;`,
      correctAnswer: '24',
      solution: `Ενοικίαση γηπέδου: 2 · 10 ＝ 20 €. Φωτισμός: 4 €. Συνολικό κόστος: 20 ＋ 4 ＝ 24 €.`,
    };
  },

  // Πρόβλημα 20: Παραγωγή χυμού σε συσκευασίες
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ',
      question: `Ένα εργοστάσιο εμφιάλωσε 120 κιβώτια των 6 μπουκαλιών και 50 κιβώτια των 12 μπουκαλιών. Πόσα μπουκάλια χυμού εμφιαλώθηκαν συνολικά;`,
      correctAnswer: '1320',
      solution: `120 · 6 ＝ 720 μπουκάλια και 50 · 12 ＝ 600 μπουκάλια. Σύνολο: 720 ＋ 600 ＝ 1.320 μπουκάλια.`,
    };
  },
];

export default function ParastaseisAsk() {
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
      title="Ασκήσεις: Αριθμητικές & Αλγεβρικές Παραστάσεις | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στη διάκριση και χρήση αριθμητικών και αλγεβρικών παραστάσεων για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/28-parastaseis"
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
              Αριθμητικές & Αλγεβρικές Παραστάσεις
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις αναγνώρισης, υπολογισμού τιμής και μοντελοποίησης + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 14 ή 23"
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
