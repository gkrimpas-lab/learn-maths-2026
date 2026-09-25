// pages/st-dimotikou/53-ksero-arxiki-teliki-timi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'k_std_1',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        text: `Ένα παντελόνι κόστιζε αρχικά ${origPrice} € και στις εκπτώσεις πωλήθηκε προς ${finalPrice} €. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε στην τιμή του;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [origPrice, discount], r2: [100, 'χ'] },
        correctVal: discPct,
        correctStr: String(discPct),
        explanation: `1ο Βήμα: Διαφορά (έκπτωση): ${origPrice} － ${finalPrice} ＝ ${discount} €. 2ο Βήμα: Ποσοστό επί της αρχικής: (${discount} : ${origPrice}) · 100 ＝ ${discPct} %.`
      };
    }
  },
  {
    id: 'k_std_2',
    generate: () => {
      const origRent = pickRandom([300, 400, 500]);
      const incPct = pickRandom([5, 10, 15, 20]);
      const increase = (origRent * incPct) / 100;
      const finalRent = origRent + increase;
      return {
        text: `Το μηνιαίο ενοίκιο ενός γραφείου ήταν ${origRent} € και μετά από αναπροσαρμογή έγινε ${finalRent} €. Ποιο ήταν το ποσοστό αύξησης (%) του ενοικίου;`,
        tableData: { col1: 'Αρχικό (€)', col2: 'Αύξηση (€)', r1: [origRent, increase], r2: [100, 'χ'] },
        correctVal: incPct,
        correctStr: String(incPct),
        explanation: `Αύξηση σε ευρώ: ${finalRent} － ${origRent} ＝ ${increase} €. Ποσοστό επί του αρχικού: (${increase} : ${origRent}) · 100 ＝ ${incPct} %.`
      };
    }
  },
  {
    id: 'k_std_3',
    generate: () => {
      const origPrice = pickRandom([40, 50, 80, 100]);
      const discPct = 25;
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        text: `Ένα φωτιστικό είχε αρχική τιμή ${origPrice} € και διατέθηκε σε προσφορά προς ${finalPrice} €. Ποιο ποσοστό έκπτωσης (%) προσέφερε το κατάστημα;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [origPrice, discount], r2: [100, 'χ'] },
        correctVal: discPct,
        correctStr: String(discPct),
        explanation: `Διαφορά: ${origPrice} － ${finalPrice} ＝ ${discount} €. Ποσοστό: (${discount} : ${origPrice}) · 100 ＝ ${discPct} %.`
      };
    }
  },
  {
    id: 'k_std_4',
    generate: () => {
      return {
        text: `Η τιμή του εισιτηρίου λεωφορείου αυξήθηκε από 1,20 € σε 1,50 €. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του εισιτηρίου;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Αύξηση (€)', r1: ['1,20', '0,30'], r2: [100, 'χ'] },
        correctVal: 25,
        correctStr: '25',
        explanation: `Αύξηση: 1,50 － 1,20 ＝ 0,30 €. Ποσοστό αύξησης: (0,30 : 1,20) · 100 ＝ 25 %.`
      };
    }
  },
  {
    id: 'k_std_5',
    generate: () => {
      const origStudents = pickRandom([200, 250, 400, 500]);
      const incPct = pickRandom([8, 12, 16, 20]);
      const addedStudents = (origStudents * incPct) / 100;
      const finalStudents = origStudents + addedStudents;
      return {
        text: `Ένα σχολείο είχε πέρυσι ${origStudents} μαθητές και φέτος έχει ${finalStudents} μαθητές. Ποιο είναι το ποσοστό αύξησης (%) του μαθητικού πληθυσμού;`,
        tableData: { col1: 'Πέρυσι', col2: 'Αύξηση', r1: [origStudents, addedStudents], r2: [100, 'χ'] },
        correctVal: incPct,
        correctStr: String(incPct),
        explanation: `Επιπλέον μαθητές: ${finalStudents} － ${origStudents} ＝ ${addedStudents}. Ποσοστό αύξησης: (${addedStudents} : ${origStudents}) · 100 ＝ ${incPct} %.`
      };
    }
  },
  {
    id: 'k_std_6',
    generate: () => {
      const origWeight = pickRandom([60, 80, 90, 100]);
      const lossPct = pickRandom([5, 10, 15, 20]);
      const lossKg = (origWeight * lossPct) / 100;
      const finalWeight = origWeight - lossKg;
      return {
        text: `Ένας αθλητής ζύγιζε αρχικά ${origWeight} kg και μετά από προπόνηση το βάρος του διαμορφώθηκε στα ${finalWeight} kg. Ποιο ήταν το ποσοστό μείωσης (%) του βάρους του;`,
        tableData: { col1: 'Αρχικό (kg)', col2: 'Μείωση (kg)', r1: [origWeight, lossKg], r2: [100, 'χ'] },
        correctVal: lossPct,
        correctStr: String(lossPct),
        explanation: `Απώλεια βάρους: ${origWeight} － ${finalWeight} ＝ ${lossKg} kg. Ποσοστό: (${lossKg} : ${origWeight}) · 100 ＝ ${lossPct} %.`
      };
    }
  },
  {
    id: 'k_std_7',
    generate: () => {
      const origCost = pickRandom([160, 200, 250]);
      const discPct = 30;
      const discount = (origCost * discPct) / 100;
      const finalCost = origCost - discount;
      return {
        text: `Ένα ποδήλατο είχε αρχική τιμή ${origCost} € και πουλήθηκε τελικά προς ${finalCost} €. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [origCost, discount], r2: [100, 'χ'] },
        correctVal: discPct,
        correctStr: String(discPct),
        explanation: `Έκπτωση: ${origCost} － ${finalCost} ＝ ${discount} €. Ποσοστό: (${discount} : ${origCost}) · 100 ＝ ${discPct} %.`
      };
    }
  },
  {
    id: 'k_std_8',
    generate: () => {
      return {
        text: `Η τιμή της αμόλυβδης βενζίνης αυξήθηκε από 1,60 € το λίτρο σε 1,84 € το λίτρο. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του καυσίμου;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Αύξηση (€)', r1: ['1,60', '0,24'], r2: [100, 'χ'] },
        correctVal: 15,
        correctStr: '15',
        explanation: `Αύξηση: 1,84 － 1,60 ＝ 0,24 €. Ποσοστό: (0,24 : 1,60) · 100 ＝ 15 %.`
      };
    }
  },
  {
    id: 'k_std_9',
    generate: () => {
      return {
        text: `Σε ένα εστιατόριο ο λογαριασμός ήταν 50 € και οι πελάτες πλήρωσαν 55 € αφήνοντας φιλοδώρημα. Ποιο ποσοστό (%) επί του λογαριασμού ήταν το φιλοδώρημα;`,
        tableData: { col1: 'Λογαριασμός (€)', col2: 'Φιλοδώρημα (€)', r1: [50, 5], r2: [100, 'χ'] },
        correctVal: 10,
        correctStr: '10',
        explanation: `Φιλοδώρημα: 55 － 50 ＝ 5 €. Ποσοστό: (5 : 50) · 100 ＝ 10 %.`
      };
    }
  },
  {
    id: 'k_std_10',
    generate: () => {
      return {
        text: `Μια τηλεόραση που κόστιζε αρχικά 200 € πωλήθηκε κατά τη διάρκεια εκπτώσεων προς 130 €. Ποιο ήταν το ποσοστό έκπτωσης (%);`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [200, 70], r2: [100, 'χ'] },
        correctVal: 35,
        correctStr: '35',
        explanation: `Έκπτωση: 200 － 130 ＝ 70 €. Ποσοστό: (70 : 200) · 100 ＝ 35 %.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'k_hard_1',
    generate: () => {
      return {
        text: `Ένα κατάστημα τιμολογεί έναν εκτυπωτή με αρχική καθαρή αξία 250 €. Ο πελάτης πλήρωσε τελικά 310 € μαζί με τον φόρο. Ποιο ήταν το ποσοστό (%) του Φ.Π.Α. με το οποίο επιβαρύνθηκε ο εκτυπωτής;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Φ.Π.Α. (€)', r1: [250, 60], r2: [100, 'χ'] },
        correctVal: 24,
        correctStr: '24',
        explanation: `Φόρος: 310 － 250 ＝ 60 €. Ποσοστό Φ.Π.Α. επί της αρχικής καθαρής αξίας: (60 : 250) · 100 ＝ 24 %.`
      };
    }
  },
  {
    id: 'k_hard_2',
    generate: () => {
      return {
        text: `Ένας αγοραστής αγόρασε ένα μπουφάν πληρώνοντας 60 € και υπολόγισε ότι εξοικονόμησε 20 € σε σχέση με την αρχική τιμή της ετικέτας. Ποιο ήταν το ποσοστό έκπτωσης (%);`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [80, 20], r2: [100, 'χ'] },
        correctVal: 25,
        correctStr: '25',
        explanation: `Αρχική τιμή: 60 ＋ 20 ＝ 80 €. Ποσοστό έκπτωσης επί της αρχικής τιμής: (20 : 80) · 100 ＝ 25 %.`
      };
    }
  },
  {
    id: 'k_hard_3',
    generate: () => {
      return {
        text: `Ένας έμπορος αγόρασε ένα εμπόρευμα προς 50 € και το πούλησε προς 65 €. Ποιο ήταν το ποσοστό κέρδους (%) του εμπόρου επί της τιμής αγοράς;`,
        tableData: { col1: 'Αγορά (€)', col2: 'Κέρδος (€)', r1: [50, 15], r2: [100, 'χ'] },
        correctVal: 30,
        correctStr: '30',
        explanation: `Κέρδος: 65 － 50 ＝ 15 €. Ποσοστό κέρδους επί της τιμής αγοράς: (15 : 50) · 100 ＝ 30 %.`
      };
    }
  },
  {
    id: 'k_hard_4',
    generate: () => {
      return {
        text: `Μια δεξαμενή είχε αρχικά 500 l νερό. Μετά από κατανάλωση, έχουν απομείνει στη δεξαμενή 325 l νερό. Ποιο ποσοστό (%) του αρχικού νερού καταναλώθηκε;`,
        tableData: { col1: 'Αρχικό (l)', col2: 'Κατανάλωση (l)', r1: [500, 175], r2: [100, 'χ'] },
        correctVal: 35,
        correctStr: '35',
        explanation: `Νερό που καταναλώθηκε: 500 － 325 ＝ 175 l. Ποσοστό: (175 : 500) · 100 ＝ 35 %.`
      };
    }
  },
  {
    id: 'k_hard_5',
    generate: () => {
      return {
        text: `Ένας αθλητικός σύλλογος είχε 150 μέλη και φέτος τα μέλη του μειώθηκαν στα 132. Ποιο ήταν το ποσοστό μείωσης (%) των μελών του συλλόγου;`,
        tableData: { col1: 'Αρχικά Μέλη', col2: 'Μείωση', r1: [150, 18], r2: [100, 'χ'] },
        correctVal: 12,
        correctStr: '12',
        explanation: `Μέλη που αποχώρησαν: 150 － 132 ＝ 18. Ποσοστό μείωσης: (18 : 150) · 100 ＝ 12 %.`
      };
    }
  },
  {
    id: 'k_hard_6',
    generate: () => {
      return {
        text: `Ένας μαθητής στο πρώτο τεστ συγκέντρωσε 75 μόρια, ενώ στο δεύτερο τεστ βελτίωσε την επίδοσή του και έλαβε 90 μόρια. Ποιο ήταν το ποσοστό βελτίωσης (%) της βαθμολογίας του;`,
        tableData: { col1: '1ο Τεστ', col2: 'Βελτίωση', r1: [75, 15], r2: [100, 'χ'] },
        correctVal: 20,
        correctStr: '20',
        explanation: `Βελτίωση: 90 － 75 ＝ 15 μόρια. Ποσοστό επί της αρχικής βαθμολογίας: (15 : 75) · 100 ＝ 20 %.`
      };
    }
  },
  {
    id: 'k_hard_7',
    generate: () => {
      return {
        text: `Μια ζύμη βάρους 400 g μετά το ψήσιμο ζυγίζει 320 g λόγω απώλειας υγρασίας. Ποιο ποσοστό (%) του αρχικού της βάρους χάθηκε κατά το ψήσιμο;`,
        tableData: { col1: 'Αρχικό (g)', col2: 'Απώλεια (g)', r1: [400, 80], r2: [100, 'χ'] },
        correctVal: 20,
        correctStr: '20',
        explanation: `Απώλεια: 400 － 320 ＝ 80 g. Ποσοστό απώλειας: (80 : 400) · 100 ＝ 20 %.`
      };
    }
  },
  {
    id: 'k_hard_8',
    generate: () => {
      return {
        text: `Μια βιομηχανική μηχανή μετά από συντήρηση ολοκληρώνει μια παρτίδα παραγωγής σε 41 ώρες αντί για τις 50 ώρες που χρειαζόταν προηγουμένως. Ποιο είναι το ποσοστό μείωσης (%) του χρόνου λειτουργίας;`,
        tableData: { col1: 'Αρχικός (h)', col2: 'Μείωση (h)', r1: [50, 9], r2: [100, 'χ'] },
        correctVal: 18,
        correctStr: '18',
        explanation: `Χρόνος που εξοικονομήθηκε: 50 － 41 ＝ 9 ώρες. Ποσοστό: (9 : 50) · 100 ＝ 18 %.`
      };
    }
  },
  {
    id: 'k_hard_9',
    generate: () => {
      return {
        text: `Από μια συνολική διαδρομή 800 km ενός ιστιοπλοϊκού αγώνα, ένα σκάφος έχει διανύσει 520 km. Ποιο ποσοστό (%) της συνολικής διαδρομής έχει καλύψει το σκάφος;`,
        tableData: { col1: 'Συνολική (km)', col2: 'Διανυθείσα (km)', r1: [800, 520], r2: [100, 'χ'] },
        correctVal: 65,
        correctStr: '65',
        explanation: `Ποσοστό: (520 : 800) · 100 ＝ 0,65 · 100 ＝ 65 %.`
      };
    }
  },
  {
    id: 'k_hard_10',
    generate: () => {
      return {
        text: `Μια μπαταρία χωρητικότητας 5.000 mAh μετά από πολύωρη χρήση έχει αποθηκευμένη ενέργεια 3.250 mAh. Ποιο ποσοστό (%) της αρχικής της ενέργειας καταναλώθηκε;`,
        tableData: { col1: 'Αρχική (mAh)', col2: 'Κατανάλωση', r1: ['5.000', '1.750'], r2: [100, 'χ'] },
        correctVal: 35,
        correctStr: '35',
        explanation: `Ενέργεια που καταναλώθηκε: 5.000 － 3.250 ＝ 1.750 mAh. Ποσοστό: (1.750 : 5.000) · 100 ＝ 35 %.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal)
  {
    const origPrice = pickRandom([50, 80, 100, 120]);
    const discPct = 25;
    const finalPrice = origPrice * 0.75;
    const diff = origPrice - finalPrice;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ ΕΚΠΤΩΣΗΣ',
      instruction: 'Υπολογίστε το ποσοστό έκπτωσης (%):',
      prompt: `Ένα προϊόν κόστιζε αρχικά ${origPrice} € και πωλείται τώρα προς ${finalPrice} €. Ποιο είναι το ποσοστό έκπτωσης (%) που έγινε;`,
      correctVal: discPct,
      correctStr: String(discPct),
      explanation: `Διαφορά: ${origPrice} － ${finalPrice} ＝ ${diff} €. Ποσοστό επί της αρχικής τιμής: (${diff} : ${origPrice}) · 100 ＝ ${discPct} %.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctConcept = 'Πάντοτε στην αρχική τιμή, γιατί αυτή αποτελεί το 100 % της σύγκρισης';
    const options = [
      { text: correctConcept, isCorrect: true },
      { text: 'Πάντοτε στην τελική τιμή, γιατί αυτή πληρώνουμε στο ταμείο', isCorrect: false },
      { text: 'Στο άθροισμα της αρχικής και της τελικής τιμής', isCorrect: false },
      { text: 'Δεν έχει σημασία σε ποια τιμή θα το υπολογίσουμε', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΒΑΣΗ ΥΠΟΛΟΓΙΣΜΟΥ ΠΟΣΟΣΤΟΥ',
      instruction: 'Επιλέξτε τον απαράβατο κανόνα των ποσοστών:',
      prompt: `Σε ποια τιμή υπολογίζουμε το ποσοστό αύξησης ή έκπτωσης όταν γνωρίζουμε την αρχική και την τελική τιμή;`,
      options,
      correctText: correctConcept,
      explanation: `Το ποσοστό μεταβολής υπολογίζεται πάντοτε πάνω στην αρχική τιμή, επειδή αυτή είναι το σημείο εκκίνησης και αντιστοιχεί στο 100%.`
    });
  }

  // Q3 (Input - Decimal)
  {
    const origP = pickRandom([40, 50, 80]);
    const incPct = 20;
    const finalP = origP * 1.2;
    const diff = finalP - origP;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ ΑΥΞΗΣΗΣ',
      instruction: 'Υπολογίστε το ποσοστό αύξησης (%):',
      prompt: `Η τιμή ενός προϊόντος ανέβηκε από τα ${origP} € στα ${finalP} €. Ποιο ήταν το ποσοστό αύξησης (%) της τιμής;`,
      correctVal: incPct,
      correctStr: String(incPct),
      explanation: `Διαφορά: ${finalP} － ${origP} ＝ ${diff} €. Ποσοστό αύξησης επί της αρχικής τιμής: (${diff} : ${origP}) · 100 ＝ ${incPct} %.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctFormula = 'Ποσοστό % ＝ (Διαφορά Τιμών : Αρχική Τιμή) · 100';
    const options = [
      { text: correctFormula, isCorrect: true },
      { text: 'Ποσοστό % ＝ (Διαφορά Τιμών : Τελική Τιμή) · 100', isCorrect: false },
      { text: 'Ποσοστό % ＝ (Αρχική Τιμή : Τελική Τιμή) · 100', isCorrect: false },
      { text: 'Ποσοστό % ＝ (Τελική Τιμή － 100) : Αρχική Τιμή', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Ο ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ',
      instruction: 'Επιλέξτε τον σωστό τύπο:',
      prompt: `Ποιος είναι ο σωστός τύπος για τον υπολογισμό του ποσοστού μεταβολής όταν γνωρίζουμε την αρχική και την τελική τιμή;`,
      options,
      correctText: correctFormula,
      explanation: `Διαιρούμε τη διαφορά των δύο τιμών με την αρχική τιμή και πολλαπλασιάζουμε με το 100: ${correctFormula}.`
    });
  }

  // Q5 (Input - Decimal)
  {
    const cost = pickRandom([20, 25, 40, 50]);
    const profitPct = pickRandom([10, 15, 25, 50]);
    const profitEur = (cost * profitPct) / 100;
    const sell = cost + profitEur;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΠΟΣΟΣΤΟ ΚΕΡΔΟΥΣ',
      instruction: 'Υπολογίστε το ποσοστό κέρδους (%):',
      prompt: `Ένας καταστηματάρχης αγόρασε ένα είδος προς ${cost} € και το πούλησε προς ${sell} €. Ποιο ήταν το ποσοστό κέρδους (%) επί της τιμής αγοράς;`,
      correctVal: profitPct,
      correctStr: String(profitPct),
      explanation: `Κέρδος: ${sell} － ${cost} ＝ ${profitEur} €. Ποσοστό κέρδους: (${profitEur} : ${cost}) · 100 ＝ ${profitPct} %.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctStatement = 'Έχουμε μείωση (έκπτωση) 20 %, επειδή η τελική τιμή είναι μικρότερη από την αρχική';
    const options = [
      { text: correctStatement, isCorrect: true },
      { text: 'Έχουμε αύξηση 20 %, επειδή αφαιρέσαμε 20 €', isCorrect: false },
      { text: 'Έχουμε μείωση 25 %, επειδή διαιρούμε με το 80', isCorrect: false },
      { text: 'Δεν υπάρχει καμία ποσοστιαία μεταβολή', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΝΑΓΝΩΡΙΣΗ ΕΙΔΟΥΣ ΜΕΤΑΒΟΛΗΣ',
      instruction: 'Επιλέξτε τη σωστή πρόταση:',
      prompt: `Αν ένα προϊόν από 100 € πωληθεί τελικά προς 80 €, τι είδους μεταβολή έχουμε;`,
      options,
      correctText: correctStatement,
      explanation: `Η τιμή μειώθηκε από 100 € σε 80 €, επομένως έχουμε μείωση (έκπτωση) κατά: (20 : 100) · 100 ＝ 20 %.`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΕΥΡΕΣΗΣ ΠΟΣΟΣΤΟΥ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το ποσοστό (%):',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(3, 8)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(2, val8 - randInt(2, 6))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.5) : '0';

    const optionsQ8 = [
      { text: `${stdProb2.correctStr} %`, isCorrect: true },
      { text: `${fake8A} %`, isCorrect: false },
      { text: `${fake8B} %`, isCorrect: false },
      { text: `${fake8C} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
      instruction: 'Επιλέξτε το σωστό ποσοστό (%):',
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr} %`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το ποσοστό (%):',
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(4, 10)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(3, val10 - randInt(3, 8))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.3) : '0';

    const optionsQ10 = [
      { text: `${hardProb2.correctStr} %`, isCorrect: true },
      { text: `${fake10A} %`, isCorrect: false },
      { text: `${fake10B} %`, isCorrect: false },
      { text: `${fake10C} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΙΑΙΑΣ ΜΕΤΑΒΟΛΗΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr} %`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function KseroArxikiTelikiTimiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην εύρεση του ποσοστού έκπτωσης ή αύξησης όταν γνωρίζουμε την αρχική και την τελική τιμή για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/53-ksero-arxiki-teliki-timi"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε τη διαφορά τιμών, αναγάγετε τη μεταβολή σε ποσοστό επί της αρχικής τιμής και ελέγξτε τις επιδόσεις σας.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-4 sm:p-7 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-2 mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Τιμων (Responsive Χωρις Scroll) */}
                  {q.tableData && (
                    <div className="w-full max-w-xs sm:max-w-sm bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 my-2 shadow-inner font-mono text-xs">
                      <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-1.5 py-0.5 rounded text-blue-900 truncate">{q.tableData.col1}</span>
                        <span className="bg-amber-100/60 px-1.5 py-0.5 rounded text-amber-900 truncate">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1.5 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className="text-amber-600 font-black text-sm">{q.tableData.r2[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-2.5">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-32 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ */}
                  {q.type === 'mcq' && (
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm md:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-3.5 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
                    <div>{q.explanation}</div>
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-sm sm:text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
