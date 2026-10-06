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

// Helper για αυθεντική κλασματική γραφή σε HTML string με ασφαλές πρόσημο
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΑΘΗΜΑΤΙΚΗΣ ΜΟΝΤΕΛΟΠΟΙΗΣΗΣ & ΥΠΟΛΟΓΙΣΜΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Υπολογισμός κλασματικού μέρους (Input)
  () => {
    // 2/5 των 150 = 60
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΟΣ',
      question: `Υπολόγισε πόσα είναι τα ${htmlFrac(2, 5)} του αριθμού 150:`,
      correctAnswer: '60',
      solution: `Πολλαπλασιάζουμε το ποσό με το κλάσμα: 150 · (${htmlFrac(2, 5)}) ＝ (150 · 2) / 5 ＝ 300 / 5 ＝ 60.`,
    };
  },

  // 2. Υπολογισμός υπολοίπου από κλάσμα (Input)
  () => {
    // Αν ξοδέψουμε τα 3/4 των 200, πόσα μένουν; = 50
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΙΠΟ ΠΟΣΟΥ',
      question: `Αν ξοδέψουμε τα ${htmlFrac(3, 4)} ενός ποσού 200 €, πόσα ευρώ απομένουν;`,
      correctAnswer: '50',
      solution: `Ξοδεύτηκαν: 200 · (${htmlFrac(3, 4)}) ＝ 150 €. Υπόλοιπο: 200 － 150 ＝ 50 € (ή απευθείας 200 · ${htmlFrac(1, 4)} ＝ 50 €).`,
    };
  },

  // 3. Αντίστροφο πρόβλημα: Εύρεση αρχικού ποσού (Input)
  () => {
    // Τα 2/3 ενός ποσού είναι 40. Ποιο είναι το αρχικό ποσό; = 60
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΗ ΠΟΡΕΙΑ',
      question: `Αν τα ${htmlFrac(2, 3)} ενός ποσού ισούνται με 40 €, ποιο είναι το αρχικό ποσό σε ευρώ;`,
      correctAnswer: '60',
      solution: `Διαιρούμε την ποσότητα με το κλάσμα: 40 ： (${htmlFrac(2, 3)}) ＝ 40 · (${htmlFrac(3, 2)}) ＝ 120 / 2 ＝ 60 €.`,
    };
  },

  // 4. Οικονομικό ισοζύγιο με πρόσημα (Input)
  () => {
    // Ένα ταμείο έχει +100. Έσοδο +50, έξοδο -80, έξοδο -30. Τελικό υπόλοιπο = 40
    return {
      type: 'input',
      topic: 'ΑΛΓΕΒΡΙΚΟ ΙΣΟΖΥΓΙΟ',
      question: `Ένας λογαριασμός είχε 100 €. Κατατέθηκαν 50 €, πληρώθηκε λογαριασμός 80 € και αγοράστηκε είδος 30 €. Ποιο είναι το τελικό υπόλοιπο σε ευρώ;`,
      correctAnswer: '40',
      solution: `100 ＋ 50 － 80 － 30 ＝ 150 － 110 ＝ 40 €.`,
    };
  },

  // 5. Αρνητικό ισοζύγιο (χρέος) (Input)
  () => {
    // 30 - 80 = -50
    return {
      type: 'input',
      topic: 'ΕΛΛΕΙΜΜΑ / ΧΡΕΟΣ',
      question: `Ένας τραπεζικός λογαριασμός είχε 30 € και έγινε ανάληψη 80 €. Ποιο είναι το νέο (αρνητικό) υπόλοιπο του λογαριασμού;`,
      correctAnswer: '-50',
      solution: `30 － 80 ＝ －50 €.`,
    };
  },

  // 6. Μεταβολή θερμοκρασίας (Input)
  () => {
    // Αρχική -4 °C, ανέβηκε 7 °C, έπεσε 5 °C. Τελική = -2
    return {
      type: 'input',
      topic: 'ΜΕΤΑΒΟΛΗ ΘΕΡΜΟΚΡΑΣΙΑΣ',
      question: `Το πρωί η θερμοκρασία ήταν －4 °C. Το μεσημέρι ανέβηκε κατά 7 °C και το βράδυ έπεσε κατά 5 °C. Ποια είναι η τελική θερμοκρασία σε °C;`,
      correctAnswer: '-2',
      solution: `(－4) ＋ 7 － 5 ＝ 3 － 5 ＝ －2 °C.`,
    };
  },

  // 7. Υπολογισμός τελικής τιμής με έκπτωση (Input)
  () => {
    // Αρχική 80 €, έκπτωση 25% (δηλ. 1/4 = 20 €) -> Τελική = 60 €
    return {
      type: 'input',
      topic: 'ΕΚΠΤΩΣΗ & ΤΕΛΙΚΗ ΤΙΜΗ',
      question: `Ένα παντελόνι κόστους 80 € πωλείται με έκπτωση ίση με το ${htmlFrac(1, 4)} της αρχικής τιμής. Ποια είναι η τελική τιμή πώλησης σε ευρώ;`,
      correctAnswer: '60',
      solution: `Έκπτωση: 80 · (${htmlFrac(1, 4)}) ＝ 20 €. Τελική τιμή: 80 － 20 ＝ 60 €.`,
    };
  },

  // 8. Υπολογισμός κλάσματος από δύο διαδοχικά έξοδα (Input)
  () => {
    // Ξόδεψε 1/2 και μετά 1/3. Συνολικό κλάσμα που ξοδεύτηκε = 5/6
    return {
      type: 'input',
      topic: 'ΑΘΡΟΙΣΜΑ ΜΕΡΙΔΙΩΝ',
      question: `Ο Πέτρος ξόδεψε το ${htmlFrac(1, 2)} των χρημάτων του και στη συνέχεια το ${htmlFrac(1, 3)} των αρχικών χρημάτων του. Ποιο κλάσμα των χρημάτων του ξόδεψε συνολικά (σε ανάγωγο κλάσμα);`,
      correctAnswer: '5/6',
      solution: `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`,
    };
  },

  // 9. Υπόλοιπο μετά από δύο κλασματικά έξοδα (Input)
  () => {
    // 1 - 5/6 = 1/6
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑΤΙΚΟ ΥΠΟΛΟΙΠΟ',
      question: `Αν από μια ποσότητα ξοδευτούν τα ${htmlFrac(5, 6)}, ποιο κλάσμα της αρχικής ποσότητας απομένει;`,
      correctAnswer: '1/6',
      solution: `1 － ${htmlFrac(5, 6)} ＝ ${htmlFrac(6, 6)} － ${htmlFrac(5, 6)} ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // 10. Θεωρία βημάτων επίλυσης (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΜΕΘΟΔΟΛΟΓΙΑ ΕΠΙΛΥΣΗΣ',
      question: `Ποιο είναι το πρώτο και θεμελιώδες στάδιο κατά την επίλυση ενός μαθηματικού προβλήματος;`,
      options: makeUniqueOptions(
        'Η προσεκτική κατανόηση του προβλήματος και ο εντοπισμός δεδομένων και ζητουμένων',
        [
          'Η άμεση εκτέλεση πράξεων με τους αριθμούς της εκφώνησης',
          'Η μαντεψιά του τελικού αποτελέσματος',
          'Η επιλογή της μεγαλύτερης δυνατής πράξης',
        ]
      ),
      correctAnswer: 'Η προσεκτική κατανόηση του προβλήματος και ο εντοπισμός δεδομένων και ζητουμένων',
      solution: `Το 1ο βήμα είναι πάντοτε η κατανόηση της εκφώνησης, ώστε να διαχωρίσουμε τα γνωστά δεδομένα από το άγνωστο ζητούμενο.`,
    };
  },

  // 11. Υπολογισμός ποσού από ποσοστό δεκαδικού (Input)
  () => {
    // 0,20 των 250 = 50
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟ ΠΟΣΟΣΤΟ',
      question: `Υπολόγισε το 0,2 (20%) ενός ποσού 250 €:`,
      correctAnswer: '50',
      solution: `250 · 0,2 ＝ 50 €.`,
    };
  },

  // 12. Αντίστροφη πορεία με δεκαδικό (Input)
  () => {
    // 0,5 του Χ = 45 -> Χ = 90
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΗ ΜΕ ΔΕΚΑΔΙΚΟ',
      question: `Αν το 0,5 (το μισό) ενός ποσού είναι 45 €, ποιο είναι ολόκληρο το ποσό;`,
      correctAnswer: '90',
      solution: `45 ： 0,5 ＝ 90 €.`,
    };
  },

  // 13. Διαφορά υψομέτρου και βάθους (Input)
  () => {
    // +250 m και -50 m -> διαφορά = 300 m
    return {
      type: 'input',
      topic: 'ΥΨΟΜΕΤΡΑ & ΒΑΘΗ',
      question: `Ένα σημείο βρίσκεται σε υψόμετρο ＋250 m και ένα υποθαλάσσιο σπήλαιο σε βάθος －50 m. Ποια είναι η υψομετρική απόστασή τους σε μέτρα (250 － (－50));`,
      correctAnswer: '300',
      solution: `250 － (－50) ＝ 250 ＋ 50 ＝ 300 m.`,
    };
  },

  // 14. Μοίρασμα ποσού σε ίσα μέρη (Input)
  () => {
    // 180 € μοιράζονται σε 4 άτομα = 45 €
    return {
      type: 'input',
      topic: 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Ένα κέρδος 180 € μοιράζεται ισόποσα σε 4 συνεργάτες. Πόσα ευρώ αντιστοιχούν στον καθένα;`,
      correctAnswer: '45',
      solution: `180 ： 4 ＝ 45 €.`,
    };
  },

  // 15. Κλάσμα του υπολοίπου (MCQ)
  () => {
    // Ξόδεψε 1/2 και μετά το 1/2 του υπολοίπου. Τι μένει; 1/4
    const correct = `${htmlFrac(1, 4)}`;
    return {
      type: 'mcq',
      topic: 'ΚΛΑΣΜΑ ΤΟΥ ΥΠΟΛΟΙΠΟΥ',
      question: `Αν ξοδέψουμε το ${htmlFrac(1, 2)} ενός ποσού και μετά το ${htmlFrac(1, 2)} του υπολοίπου, ποιο κλάσμα του αρχικού ποσού απομένει;`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(1, 2)}`,
        `${htmlFrac(0, 1)} (τίποτα)`,
        `${htmlFrac(3, 4)}`,
      ]),
      correctAnswer: correct,
      solution: `Υπόλοιπο μετά το 1ο έξοδο: ${htmlFrac(1, 2)}. Το μισό του υπολοίπου είναι: (${htmlFrac(1, 2)}) · (${htmlFrac(1, 2)}) ＝ ${htmlFrac(1, 4)}. Επομένως απομένει: ${htmlFrac(1, 2)} － ${htmlFrac(1, 4)} ＝ ${htmlFrac(1, 4)}.`,
    };
  },

  // 16. Μέση τιμή μεταβολών (Input)
  () => {
    // Μεταβολές +4, -2, +1 -> Άθροισμα = 3, Μέσος όρος = 1
    return {
      type: 'input',
      topic: 'ΜΕΣΟΣ ΟΡΟΣ ΜΕΤΑΒΟΛΩΝ',
      question: `Σε τρεις διαδοχικές ημέρες η στάθμη του νερού μεταβλήθηκε κατά ＋4 cm, －2 cm και ＋1 cm. Ποια ήταν η μέση ημερήσια μεταβολή σε cm;`,
      correctAnswer: '1',
      solution: `(4 ＋ (－2) ＋ 1) ： 3 ＝ 3 ： 3 ＝ 1 cm.`,
    };
  },

  // 17. Κόστος με επιπλέον χρέωση (Input)
  () => {
    // 50 + 50 * 0.1 = 55
    return {
      type: 'input',
      topic: 'ΕΠΙΒΑΡΥΝΣΗ ΠΟΣΟΣΤΟΥ',
      question: `Ένας λογαριασμός 50 € επιβαρύνθηκε με πρόστιμο ίσο με το ${htmlFrac(1, 10)} της αξίας του. Πόσο είναι το τελικό πληρωτέο ποσό σε ευρώ;`,
      correctAnswer: '55',
      solution: `Επιβάρυνση: 50 · (${htmlFrac(1, 10)}) ＝ 5 €. Τελικό ποσό: 50 ＋ 5 ＝ 55 €.`,
    };
  },

  // 18. Αντίστροφο πρόβλημα με υπόλοιπο (Input)
  () => {
    // Ξόδεψε τα 3/5 και του έμειναν 40 €. Πόσα είχε αρχικά; (2/5 = 40 -> 100)
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΠΟ ΤΟ ΥΠΟΛΟΙΠΟ',
      question: `Ο Γιώργος ξόδεψε τα ${htmlFrac(3, 5)} των χρημάτων του και του περίσσεψαν 40 €. Πόσα χρήματα είχε αρχικά σε ευρώ;`,
      correctAnswer: '100',
      solution: `Του περίσσεψαν τα 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)}. Άρα: 40 ： (${htmlFrac(2, 5)}) ＝ 40 · (${htmlFrac(5, 2)}) ＝ 200 / 2 ＝ 100 €.`,
    };
  },

  // 19. Πολλαπλάσια μέρη (Input)
  () => {
    // 3/8 των 64 = 24
    return {
      type: 'input',
      topic: 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΡΙΔΙΟΥ',
      question: `Υπολόγισε τα ${htmlFrac(3, 8)} του αριθμού 64:`,
      correctAnswer: '24',
      solution: `(64 · 3) / 8 ＝ 8 · 3 ＝ 24.`,
    };
  },

  // 20. Έλεγχος λογικής αποτελέσματος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΛΟΓΙΚΗΣ',
      question: `Αν σε ένα πρόβλημα υπολογισμού του αριθμού των μαθητών μιας τάξης βρούμε αποτέλεσμα 24,5 μαθητές, τι σημαίνει αυτό;`,
      options: makeUniqueOptions(
        'Έχει γίνει μαθηματικό λάθος, γιατί το πλήθος των ανθρώπων είναι πάντοτε φυσικός ακέραιος αριθμός',
        [
          'Το αποτέλεσμα είναι σωστό και αποδεκτό',
          'Σημαίνει ότι ένας μαθητής είναι μισός σε ύψος',
          'Στρογγυλοποιούμε υποχρεωτικά στο 24 χωρίς να ελέγξουμε τις πράξεις',
        ]
      ),
      correctAnswer: 'Έχει γίνει μαθηματικό λάθος, γιατί το πλήθος των ανθρώπων είναι πάντοτε φυσικός ακέραιος αριθμός',
      solution: `Στο 4ο στάδιο επίλυσης ελέγχουμε τη λογική του αποτελέσματος: μεγέθη όπως άνθρωποι, αντικείμενα κ.λπ. παίρνουν αποκλειστικά ακέραιες φυσικές τιμές.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΣΥΝΘΕΤΑ ΠΡΟΒΛΗΜΑΤΑ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Διαχείριση μισθού και αποταμίευση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας εργαζόμενος με μηνιαίο μισθό 1.200 € διαθέτει το ${htmlFrac(1, 3)} για ενοίκιο και το ${htmlFrac(1, 4)} για έξοδα διατροφής. Πόσα ευρώ του απομένουν για τις υπόλοιπες ανάγκες του;`,
      correctAnswer: '500',
      solution: `Ενοίκιο: 1200 · (${htmlFrac(1, 3)}) ＝ 400 €. Διατροφή: 1200 · (${htmlFrac(1, 4)}) ＝ 300 €. Σύνολο εξόδων: 400 ＋ 300 ＝ 700 €. Απομένουν: 1200 － 700 ＝ 500 €.`,
    };
  },

  // Πρόβλημα 2: Ταξίδι και κατανάλωση βενζίνης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Το ρεζερβουάρ ενός αυτοκινήτου χωράει 60 λίτρα βενζίνης. Στο πρώτο μέρος του ταξιδιού καταναλώθηκαν τα ${htmlFrac(2, 5)} του καυσίμου και στο δεύτερο μέρος τα ${htmlFrac(1, 3)} του αρχικού καυσίμου. Πόσα λίτρα βενζίνης απέμειναν;`,
      correctAnswer: '16',
      solution: `1ο μέρος: 60 · (${htmlFrac(2, 5)}) ＝ 24 L. 2ο μέρος: 60 · (${htmlFrac(1, 3)}) ＝ 20 L. Καταναλώθηκαν: 24 ＋ 20 ＝ 44 L. Απομένουν: 60 － 44 ＝ 16 L.`,
    };
  },

  // Πρόβλημα 3: Διανομή βιβλίων σε σχολείο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Μια σχολική βιβλιοθήκη παρέλαβε 240 νέα βιβλία. Τα ${htmlFrac(3, 8)} είναι λογοτεχνικά και τα ${htmlFrac(1, 4)} είναι επιστημονικά. Πόσα είναι τα υπόλοιπα βιβλία άλλων κατηγοριών;`,
      correctAnswer: '90',
      solution: `Λογοτεχνικά: 240 · (${htmlFrac(3, 8)}) ＝ 90. Επιστημονικά: 240 · (${htmlFrac(1, 4)}) ＝ 60. Σύνολο: 90 ＋ 60 ＝ 150. Υπόλοιπα: 240 － 150 ＝ 90 βιβλία.`,
    };
  },

  // Πρόβλημα 4: Αντίστροφο πρόβλημα με υπόλοιπο χρημάτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Η Μαρία ξόδεψε τα ${htmlFrac(2, 5)} των χρημάτων της για ρούχα και τα ${htmlFrac(1, 5)} για φαγητό. Αν της περίσσεψαν 80 €, πόσα χρήματα είχε αρχικά σε ευρώ;`,
      correctAnswer: '200',
      solution: `Ξόδεψε συνολικά: ${htmlFrac(2, 5)} ＋ ${htmlFrac(1, 5)} ＝ ${htmlFrac(3, 5)}. Της περίσσεψαν: 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)}. Αρχικό ποσό: 80 ： (${htmlFrac(2, 5)}) ＝ 80 · (${htmlFrac(5, 2)}) ＝ 400 / 2 ＝ 200 €.`,
    };
  },

  // Πρόβλημα 5: Θερμοκρασιακές μεταβολές σε ορεινό καταφύγιο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΙΡΟΣ',
      question: `Τα μεσάνυχτα η θερμοκρασία ήταν －6 °C. Μέχρι το μεσημέρι ανέβηκε κατά 11 °C και μέχρι το επόμενο βράδυ έπεσε κατά 8 °C. Ποια ήταν η τελική θερμοκρασία σε °C;`,
      correctAnswer: '-3',
      solution: `(－6) ＋ 11 － 8 ＝ 5 － 8 ＝ －3 °C.`,
    };
  },

  // Πρόβλημα 6: Ποδηλατική διαδρομή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Μια ποδηλατική διαδρομή έχει συνολικό μήκος 45 km. Ένας αθλητής διένυσε τα ${htmlFrac(2, 3)} της διαδρομής, έκανε διάλειμμα και μετά διένυσε άλλα 10 km. Πόσα χιλιόμετρα του απομένουν για τον τερματισμό;`,
      correctAnswer: '5',
      solution: `1ο μέρος: 45 · (${htmlFrac(2, 3)}) ＝ 30 km. Συνολικά διένυσε: 30 ＋ 10 ＝ 40 km. Απομένουν: 45 － 40 ＝ 5 km.`,
    };
  },

  // Πρόβλημα 7: Εισπράξεις και έξοδα καταστήματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΜΠΟΡΙΟ',
      question: `Ένα κατάστημα ξεκίνησε την ημέρα με 150 € στο ταμείο. Είχε εισπράξεις 420 €, πλήρωσε προμηθευτή 280 € και λογαριασμό ρεύματος 90 €. Πόσα ευρώ έχει το ταμείο στο κλείσιμο;`,
      correctAnswer: '200',
      solution: `150 ＋ 420 － 280 － 90 ＝ 570 － 370 ＝ 200 €.`,
    };
  },

  // Πρόβλημα 8: Μερίδιο χωραφιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ',
      question: `Ένα αγρόκτημα 60 στρεμμάτων καλλιεργείται ως εξής: τα ${htmlFrac(1, 2)} με σιτάρι, το ${htmlFrac(1, 3)} με καλαμπόκι και τα υπόλοιπα στρέμματα με λαχανικά. Πόσα στρέμματα καταλαμβάνουν τα λαχανικά;`,
      correctAnswer: '10',
      solution: `Σιτάρι: 60 · (${htmlFrac(1, 2)}) ＝ 30 στρέμματα. Καλαμπόκι: 60 · (${htmlFrac(1, 3)}) ＝ 20 στρέμματα. Λαχανικά: 60 － 30 － 20 ＝ 10 στρέμματα.`,
    };
  },

  // Πρόβλημα 9: Κατασκευή συνταγής γλυκού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Για ένα γλυκό χρειάζονται 1,5 kg αλεύρι. Αν μια νοικοκυρά έχει ένα σακουλάκι με ${htmlFrac(3, 4)} του κιλού και ένα άλλο με 0,5 kg, πόσα kg αλεύρι της λείπουν ακόμα;`,
      correctAnswer: '0,25',
      solution: `Διαθέτει: ${htmlFrac(3, 4)} ＝ 0,75 kg και 0,5 kg, άρα σύνολο 1,25 kg. Της λείπουν: 1,50 － 1,25 ＝ 0,25 kg (ή ${htmlFrac(1, 4)} kg).`,
    };
  },

  // Πρόβλημα 10: Καθαρή αξία με ΦΠΑ και έκπτωση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια ηλεκτρική συσκευή αξίας 200 € πωλείται με έκπτωση 40 € αλλά επιβαρύνεται με έξοδα μεταφοράς 15 €. Πόσο θα πληρώσει τελικά ο αγοραστής σε ευρώ;`,
      correctAnswer: '175',
      solution: `200 － 40 ＋ 15 ＝ 160 ＋ 15 ＝ 175 €.`,
    };
  },

  // Πρόβλημα 11: Στάθμη νερού φράγματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Η στάθμη ενός φράγματος βρισκόταν στα ＋2,4 m πάνω από το κανονικό όριο. Μετά από ξηρασία υποχώρησε κατά 3,6 m. Σε ποιο επίπεδο σε σχέση με το όριο (αρνητικός αριθμός σε μέτρα) βρίσκεται τώρα;`,
      correctAnswer: '-1,2',
      solution: `2,4 － 3,6 ＝ －1,2 m.`,
    };
  },

  // Πρόβλημα 12: Διανομή χρόνου σε διαγώνισμα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένα διαγώνισμα διαρκεί 60 λεπτά. Ένας μαθητής αφιέρωσε το ${htmlFrac(1, 4)} του χρόνου στο 1ο θέμα, το ${htmlFrac(1, 3)} στο 2ο θέμα και 15 λεπτά στο 3ο θέμα. Πόσα λεπτά του έμειναν για τον τελικό έλεγχο;`,
      correctAnswer: '10',
      solution: `1ο θέμα: 60 · (${htmlFrac(1, 4)}) ＝ 15 λεπτά. 2ο θέμα: 60 · (${htmlFrac(1, 3)}) ＝ 20 λεπτά. 3ο θέμα: 15 λεπτά. Σύνολο χρόνου: 15 ＋ 20 ＋ 15 ＝ 50 λεπτά. Έλεγχος: 60 － 50 ＝ 10 λεπτά.`,
    };
  },

  // Πρόβλημα 13: Κέρδος και ζημία μετοχών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question: `Ένας επενδυτής είχε την 1η ημέρα κέρδος 120 €, τη 2η ημέρα ζημία 190 € και την 3η ημέρα κέρδος 40 €. Ποιο ήταν το συνολικό καθαρό αποτέλεσμα των 3 ημερών σε ευρώ (αρνητικό αν είναι ζημία);`,
      correctAnswer: '-30',
      solution: `120 － 190 ＋ 40 ＝ －70 ＋ 40 ＝ －30 € (καθαρή ζημία 30 €).`,
    };
  },

  // Πρόβλημα 14: Αποθήκευση λαδιού σε δοχεία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Μια δεξαμενή είχε 180 λίτρα λάδι. Γεμίστηκαν 20 δοχεία των 5 λίτρων το καθένα και 15 δοχεία των 3 λίτρων το καθένα. Πόσα λίτρα λαδιού περίσσεψαν στη δεξαμενή;`,
      correctAnswer: '35',
      solution: `20 · 5 ＝ 100 L και 15 · 3 ＝ 45 L. Σύνολο που αφαιρέθηκε: 100 ＋ 45 ＝ 145 L. Περίσσεψαν: 180 － 145 ＝ 35 L.`,
    };
  },

  // Πρόβλημα 15: Υπολειπόμενο κομμάτι σύρματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Από ένα ρολό σύρματος μήκους 50 μέτρων κόπηκαν 3 κομμάτια μήκους 8,5 μέτρων το καθένα και άλλα 2 κομμάτια μήκους 10 μέτρων το καθένα. Πόσα μέτρα σύρμα απομένουν;`,
      correctAnswer: '4,5',
      solution: `3 · 8,5 ＝ 25,5 m και 2 · 10 ＝ 20 m. Σύνολο κοπής: 25,5 ＋ 20 ＝ 45,5 m. Απομένουν: 50 － 45,5 ＝ 4,5 m.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο κληρονομιάς σε φιλανθρωπία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΛΗΡΟΝΟΜΙΑ',
      question: `Ένα ποσό 50.000 € διανέμεται ως εξής: τα ${htmlFrac(3, 5)} στα παιδιά και το ${htmlFrac(1, 10)} σε φιλανθρωπικό ίδρυμα. Πόσα ευρώ δόθηκαν στο φιλανθρωπικό ίδρυμα;`,
      correctAnswer: '5000',
      solution: `50000 · (${htmlFrac(1, 10)}) ＝ 5.000 €.`,
    };
  },

  // Πρόβλημα 17: Αποστράγγιση δεξαμενής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Μια πισίνα περιέχει 120 κυβικά μέτρα νερό. Μια αντλία αδειάζει 15 κυβικά μέτρα την ώρα επί 6 ώρες. Πόσα κυβικά μέτρα νερό απομένουν στην πισίνα;`,
      correctAnswer: '30',
      solution: `Αδειάστηκαν: 6 · 15 ＝ 90 κ.μ. Απομένουν: 120 － 90 ＝ 30 κ.μ.`,
    };
  },

  // Πρόβλημα 18: Βάθος υποβρυχίου μετά από ελιγμούς
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΝΑΥΤΙΛΙΑ',
      question: `Ένα υποβρύχιο βρισκόταν σε βάθος 140 m (－140). Ανέβηκε κατά 45 m και στη συνέχεια καταδύθηκε κατά 25 m. Ποιο είναι το νέο του βάθος σε μέτρα (αρνητικός αριθμός);`,
      correctAnswer: '-120',
      solution: `(－140) ＋ 45 － 25 ＝ －95 － 25 ＝ －120 m (βάθος 120 μέτρα).`,
    };
  },

  // Πρόβλημα 19: Κόστος εκδρομής ανά άτομο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΔΡΟΜΕΣ',
      question: `Το λεωφορείο για μια εκδρομή κοστίζει συνολικά 360 € και συμμετέχουν 20 μαθητές. Αν ο σύλλογος γονέων επιδοτεί τη συνολική δαπάνη με 60 €, πόσα ευρώ θα πληρώσει κάθε μαθητής;`,
      correctAnswer: '15',
      solution: `Καθαρό κόστος: 360 － 60 ＝ 300 €. Ανά μαθητή: 300 ： 20 ＝ 15 €.`,
    };
  },

  // Πρόβλημα 20: Καταμέτρηση θερμίδων διατροφής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΓΕΙΑ',
      question: `Ένα ενεργειακό ποτό περιέχει 250 θερμίδες. Αν ένας αθλητής πιει τα ${htmlFrac(4, 5)} του μπουκαλιού και κάψει 300 θερμίδες στην προπόνηση, ποιο είναι το καθαρό ισοζύγιο θερμίδων (θερμίδες που πήρε μείον αυτές που έκαψε);`,
      correctAnswer: '-100',
      solution: `Θερμίδες που έλαβε: 250 · (${htmlFrac(4, 5)}) ＝ 200 θερμίδες. Ισοζύγιο: 200 － 300 ＝ －100 θερμίδες.`,
    };
  },
];

export default function RitoiProblimataAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο (για κλάσματα) και μείον
    clean = clean.replace(/[^0-9,/,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    const slashCount = (clean.match(/\//g) || []).length;
    if (slashCount > 1) return;
    if (clean.length > 12) return;

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
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '');

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
      title="Ασκήσεις: Προβλήματα με Ρητούς Αριθμούς | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και ρεαλιστικά προβλήματα στην επίλυση προβλημάτων με ρητούς αριθμούς για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/23-ritoi-problimata"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 21 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προβλήματα με Ρητούς Αριθμούς
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 μαθηματικής μοντελοποίησης και κλασματικών υπολογισμών + 2 ρεαλιστικά πολυσύνθετα προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
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
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder="π.χ. 60 ή -50"
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
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
