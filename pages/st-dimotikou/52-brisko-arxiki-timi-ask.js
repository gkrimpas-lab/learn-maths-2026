// pages/st-dimotikou/52-brisko-arxiki-timi-ask.js
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
    id: 'arx_std_1',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const finalPrice = origPrice * (1 - discPct / 100);
      return {
        text: `Στις εκπτώσεις ένα ζευγάρι παπούτσια πωλήθηκε προς ${formatNum(finalPrice)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή των παπουτσιών σε €;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 100 - discPct], r2: ['χ', formatNum(finalPrice)] },
        correctVal: origPrice,
        correctStr: String(origPrice),
        explanation: `Η τελική τιμή (${formatNum(finalPrice)} €) αντιστοιχεί στο ${100 - discPct} % της αρχικής αξίας. Με χιαστί: χ ＝ (${formatNum(finalPrice)} · 100) : ${100 - discPct} ＝ ${origPrice} €.`
      };
    }
  },
  {
    id: 'arx_std_2',
    generate: () => {
      const cleanPrice = pickRandom([200, 300, 400, 500, 600]);
      const vatPct = 24;
      const finalPrice = cleanPrice * 1.24;
      return {
        text: `Η τελική τιμή ενός φορητού υπολογιστή μαζί με τον φόρο Φ.Π.Α. ${vatPct} % είναι ${formatNum(finalPrice)} €. Ποια ήταν η καθαρή αρχική αξία του υπολογιστή χωρίς τον φόρο σε €;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 124], r2: ['χ', formatNum(finalPrice)] },
        correctVal: cleanPrice,
        correctStr: String(cleanPrice),
        explanation: `Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Με χιαστί: χ ＝ (${formatNum(finalPrice)} · 100) : 124 ＝ ${cleanPrice} €.`
      };
    }
  },
  {
    id: 'arx_std_3',
    generate: () => {
      const origBill = pickRandom([40, 50, 70, 80, 100]);
      const discPct = pickRandom([15, 20, 25, 30]);
      const finalBill = origBill * (1 - discPct / 100);
      return {
        text: `Ένας πελάτης πλήρωσε στο ταμείο ενός καταστήματος ${formatNum(finalBill)} €, αφού του έγινε έκπτωση ${discPct} %. Πόσο κόστιζαν αρχικά τα προϊόντα που αγόρασε σε €;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 100 - discPct], r2: ['χ', formatNum(finalBill)] },
        correctVal: origBill,
        correctStr: String(origBill),
        explanation: `Τα ${formatNum(finalBill)} € είναι το ${100 - discPct} % της αρχικής τιμής. Άρα: χ ＝ (${formatNum(finalBill)} · 100) : ${100 - discPct} ＝ ${origBill} €.`
      };
    }
  },
  {
    id: 'arx_std_4',
    generate: () => {
      const origRent = pickRandom([300, 350, 400, 450, 500]);
      const incPct = 10;
      const newRent = origRent * 1.1;
      return {
        text: `Το ενοίκιο ενός καταστήματος αυξήθηκε κατά ${incPct} % και διαμορφώθηκε στα ${formatNum(newRent)} €. Ποιο ήταν το ενοίκιο πριν από την αύξηση σε €;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 110], r2: ['χ', formatNum(newRent)] },
        correctVal: origRent,
        correctStr: String(origRent),
        explanation: `Το νέο ενοίκιο αντιστοιχεί στο 110 % του παλαιού. Με διαίρεση: ${formatNum(newRent)} : 1,10 ＝ ${origRent} €.`
      };
    }
  },
  {
    id: 'arx_std_5',
    generate: () => {
      const origPrice = pickRandom([20, 30, 40, 60, 80]);
      const halfPrice = origPrice / 2;
      return {
        text: `Σε περίοδο ειδικών εκπτώσεων ένα βιβλίο πωλήθηκε στη μισή τιμή (έκπτωση 50 %) προς ${halfPrice} €. Ποια ήταν η αρχική τιμή του βιβλίου σε €;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 50], r2: ['χ', halfPrice] },
        correctVal: origPrice,
        correctStr: String(origPrice),
        explanation: `Τα ${halfPrice} € αντιστοιχούν στο 50 % της αρχικής τιμής. Άρα η αρχική τιμή (100 %) ήταν: (${halfPrice} · 100) : 50 ＝ ${origPrice} €.`
      };
    }
  },
  {
    id: 'arx_std_6',
    generate: () => {
      const origWeight = pickRandom([200, 250, 400, 500]);
      const incPct = 20;
      const newWeight = origWeight * 1.2;
      return {
        text: `Μια νέα συσκευασία μπισκότων έχει βάρος ${newWeight} g, αφού περιέχει ${incPct} % περισσότερο δωρεάν προϊόν. Πόσα γραμμάρια (g) ζύγιζε η κανονική αρχική συσκευασία;`,
        tableData: { col1: 'Αρχικό (g)', col2: 'Τελικό (g)', r1: [100, 120], r2: ['χ', newWeight] },
        correctVal: origWeight,
        correctStr: String(origWeight),
        explanation: `Τα ${newWeight} g αντιστοιχούν στο 120 % του κανονικού βάρους. Αρχικό βάρος: (${newWeight} · 100) : 120 ＝ ${origWeight} g.`
      };
    }
  },
  {
    id: 'arx_std_7',
    generate: () => {
      const origStudents = pickRandom([150, 200, 250, 300]);
      const incPct = 15;
      const currentStudents = origStudents * 1.15;
      return {
        text: `Ένα σχολείο έχει σήμερα ${currentStudents} μαθητές, σημειώνοντας αύξηση ${incPct} % σε σχέση με την περασμένη χρονιά. Πόσους μαθητές είχε το σχολείο πέρυσι;`,
        tableData: { col1: 'Πέρυσι', col2: 'Φέτος', r1: [100, 115], r2: ['χ', currentStudents] },
        correctVal: origStudents,
        correctStr: String(origStudents),
        explanation: `Ο φετινός αριθμός μαθητών είναι το 115 % του περσινού. Περσινοί μαθητές: (${currentStudents} · 100) : 115 ＝ ${origStudents}.`
      };
    }
  },
  {
    id: 'arx_std_8',
    generate: () => {
      const origCost = pickRandom([60, 80, 100, 120, 160]);
      const finalCost = origCost * 0.75;
      return {
        text: `Ένα σακίδιο πλάτης αγοράστηκε προς ${formatNum(finalCost)} € με έκπτωση 25 %. Πόσα ευρώ (€) ήταν η αρχική τιμή του σακιδίου;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 75], r2: ['χ', formatNum(finalCost)] },
        correctVal: origCost,
        correctStr: String(origCost),
        explanation: `Η τιμή των ${formatNum(finalCost)} € είναι το 75 % της αρχικής. Αρχική τιμή: (${formatNum(finalCost)} · 100) : 75 ＝ ${origCost} €.`
      };
    }
  },
  {
    id: 'arx_std_9',
    generate: () => {
      const cleanCost = pickRandom([100, 150, 250, 350]);
      const totalCost = cleanCost * 1.13;
      return {
        text: `Ένας λογαριασμός ξενοδοχείου μαζί με Φ.Π.Α. 13 % ανήλθε σε ${formatNum(totalCost)} €. Ποια ήταν η καθαρή αξία της διαμονής προ φόρου σε €;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Τελική (€)', r1: [100, 113], r2: ['χ', formatNum(totalCost)] },
        correctVal: cleanCost,
        correctStr: String(cleanCost),
        explanation: `Το τελικό ποσό αντιστοιχεί στο 113 % της καθαρής αξίας. Καθαρή αξία: (${formatNum(totalCost)} · 100) : 113 ＝ ${cleanCost} €.`
      };
    }
  },
  {
    id: 'arx_std_10',
    generate: () => {
      const origSpeed = pickRandom([60, 70, 80, 90]);
      const newSpeed = origSpeed * 1.2;
      return {
        text: `Ένας οδηγός αύξησε την ταχύτητά του κατά 20 % και κινείται πλέον με ${newSpeed} km/h. Ποια ήταν η αρχική του ταχύτητα σε km/h;`,
        tableData: { col1: 'Αρχική (km/h)', col2: 'Νέα (km/h)', r1: [100, 120], r2: ['χ', newSpeed] },
        correctVal: origSpeed,
        correctStr: String(origSpeed),
        explanation: `Η νέα ταχύτητα είναι το 120 % της αρχικής. Αρχική ταχύτητα: (${newSpeed} · 100) : 120 ＝ ${origSpeed} km/h.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'arx_hard_1',
    generate: () => {
      return {
        text: `Ένα προϊόν πωλήθηκε τελικά προς 148,80 € συμπεριλαμβανομένου Φ.Π.Α. 24 %, αφού προηγουμένως είχε γίνει έκπτωση 20 % επί της αρχικής καθαρής αξίας του. Ποια ήταν η αρχική καθαρή αξία του προϊόντος σε €;`,
        correctVal: 150,
        correctStr: '150',
        explanation: `1ο Βήμα: Τιμή μετά την έκπτωση (προ Φ.Π.Α.): 148,80 : 1,24 ＝ 120 €. 2ο Βήμα: Τα 120 € αντιστοιχούν στο 80 % της αρχικής καθαρής αξίας: (120 · 100) : 80 ＝ 150 €.`
      };
    }
  },
  {
    id: 'arx_hard_2',
    generate: () => {
      return {
        text: `Σε ένα κατάστημα ρούχων, ένας αγοραστής πλήρωσε 90 € για ένα σακάκι και διαπίστωσε ότι εξοικονόμησε 30 € λόγω της έκπτωσης. Ποιο ήταν το ποσοστό (%) της έκπτωσης που του έγινε;`,
        correctVal: 25,
        correctStr: '25',
        explanation: `Αρχική τιμή: 90 ＋ 30 ＝ 120 €. Ποσοστό έκπτωσης ως προς την αρχική τιμή: (30 : 120) · 100 ＝ 25 %.`
      };
    }
  },
  {
    id: 'arx_hard_3',
    generate: () => {
      return {
        text: `Ο μισθός ενός εργαζομένου αυξήθηκε κατά 10 % και στη συνέχεια ο νέος μισθός μειώθηκε κατά 10 %, φτάνοντας τα 990 €. Ποιος ήταν ο αρχικός μισθός του εργαζομένου σε €;`,
        correctVal: 1000,
        correctStr: '1000',
        explanation: `1ο Βήμα: Πριν από τη μείωση 10%: 990 : 0,90 ＝ 1.100 €. 2ο Βήμα: Πριν από την αύξηση 10%: 1.100 : 1,10 ＝ 1.000 €.`
      };
    }
  },
  {
    id: 'arx_hard_4',
    generate: () => {
      return {
        text: `Ο πληθυσμός μιας κωμόπολης αυξήθηκε την πρώτη χρονιά κατά 5 % και τη δεύτερη χρονιά μειώθηκε κατά 5 %, φτάνοντας τους 7.980 κατοίκους. Πόσους κατοίκους είχε αρχικά η κωμόπολη;`,
        correctVal: 8000,
        correctStr: '8000',
        explanation: `Πριν από τη μείωση 5%: 7.980 : 0,95 ＝ 8.400 κάτοικοι. Αρχικός πληθυσμός προ αύξησης 5%: 8.400 : 1,05 ＝ 8.000 κάτοικοι.`
      };
    }
  },
  {
    id: 'arx_hard_5',
    generate: () => {
      return {
        text: `Ένας έμπορος πούλησε ένα προϊόν προς 90 € πραγματοποιώντας κέρδος 20 % επί της τιμής που το είχε αγοράσει. Πόσα ευρώ (€) είχε κοστίσει στον έμπορο η αγορά του προϊόντος;`,
        correctVal: 75,
        correctStr: '75',
        explanation: `Η τιμή πώλησης αντιστοιχεί στο 120 % της τιμής αγοράς. Τιμή αγοράς: (90 · 100) : 120 ＝ 75 €.`
      };
    }
  },
  {
    id: 'arx_hard_6',
    generate: () => {
      return {
        text: `Μια μαθήτρια ξόδεψε το 35 % των αποταμιεύσεών της και της απέμειναν 325 €. Πόσα ευρώ (€) είχε συνολικά αποταμιεύσει αρχικά;`,
        correctVal: 500,
        correctStr: '500',
        explanation: `Τα χρήματα που απέμειναν αντιστοιχούν στο: 100 % － 35 % ＝ 65 %. Αρχικό ποσό: (325 · 100) : 65 ＝ 500 €.`
      };
    }
  },
  {
    id: 'arx_hard_7',
    generate: () => {
      return {
        text: `Ένα είδος νωπών φρούτων κατά την αποξήρανση χάνει το 25 % του βάρους του σε υγρασία. Αν μετά την αποξήρανση το βάρος τους είναι 450 g, πόσα γραμμάρια (g) ζύγιζαν αρχικά όταν ήταν νωπά;`,
        correctVal: 600,
        correctStr: '600',
        explanation: `Το βάρος των αποξηραμένων φρούτων αντιστοιχεί στο 75 % του αρχικού βάρους. Αρχικό βάρος: (450 · 100) : 75 ＝ 600 g.`
      };
    }
  },
  {
    id: 'arx_hard_8',
    generate: () => {
      return {
        text: `Ένα κατάστημα προσφέρει έκπτωση 15 % σε όλα τα είδη του. Αν ένας πελάτης πλήρωσε 204 €, πόσα ευρώ (€) κέρδισε από την έκπτωση;`,
        correctVal: 36,
        correctStr: '36',
        explanation: `1ο Βήμα: Η αρχική τιμή ήταν: 204 : 0,85 ＝ 240 €. 2ο Βήμα: Το κέρδος είναι η διαφορά: 240 － 204 ＝ 36 €.`
      };
    }
  },
  {
    id: 'arx_hard_9',
    generate: () => {
      return {
        text: `Από μια δεξαμενή νερού διέρρευσε το 30 % της χωρητικότητάς της και μέσα σε αυτήν έχουν απομείνει 840 l νερό. Ποια είναι η συνολική χωρητικότητα της δεξαμενής σε λίτρα (l);`,
        correctVal: 1200,
        correctStr: '1200',
        explanation: `Το νερό που απέμεινε αντιστοιχεί στο 70 % της συνολικής χωρητικότητας. Χωρητικότητα: (840 · 100) : 70 ＝ 1.200 l.`
      };
    }
  },
  {
    id: 'arx_hard_10',
    generate: () => {
      return {
        text: `Σε ένα κατάστημα ηλεκτρονικών έγινε διαδοχικά πρώτη έκπτωση 20 % και στη συνέχεια πρόσθετη έκπτωση 10 % επί της νέας τιμής, διαμορφώνοντας την τελική στα 252 €. Ποια ήταν η αρχική τιμή της συσκευής σε €;`,
        correctVal: 350,
        correctStr: '350',
        explanation: `1ο Βήμα: Πριν από τη δεύτερη έκπτωση: 252 : 0,90 ＝ 280 €. 2ο Βήμα: Πριν από την πρώτη έκπτωση: 280 : 0,80 ＝ 350 €.`
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
    const finalPrice = origPrice * 0.8;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΤΙΜΗΣ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ',
      instruction: 'Υπολογίστε την αρχική τιμή του προϊόντος:',
      prompt: `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${finalPrice} € με έκπτωση 20 %. Ποια ήταν η αρχική τιμή του σε €;`,
      correctVal: origPrice,
      correctStr: String(origPrice),
      explanation: `Η τελική τιμή (${finalPrice} €) αντιστοιχεί στο 80 % της αρχικής (100 － 20). Αρχική τιμή: (${finalPrice} · 100) : 80 ＝ ${origPrice} €.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const disc = pickRandom([15, 25, 30, 40]);
    const correctPct = 100 - disc;

    const options = [
      { text: `${correctPct} %`, isCorrect: true },
      { text: `${disc} %`, isCorrect: false },
      { text: `${100 + disc} %`, isCorrect: false },
      { text: '100 %', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΑΝΤΙΣΤΟΙΧΙΣΗ ΠΟΣΟΣΤΟΥ ΤΕΛΙΚΗΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε το σωστό ποσοστό:',
      prompt: `Αν ένα προϊόν έχει έκπτωση ${disc} %, σε ποιο ποσοστό (%) της αρχικής τιμής αντιστοιχεί η τελική τιμή που πληρώνουμε;`,
      options,
      correctText: `${correctPct} %`,
      explanation: `Αφού αφαιρείται έκπτωση ${disc} % από το αρχικό 100 %, πληρώνουμε το υπόλοιπο: 100 % － ${disc} % ＝ ${correctPct} %.`
    });
  }

  // Q3 (Input - Decimal)
  {
    const cleanPrice = pickRandom([100, 200, 250, 400]);
    const finalPrice = cleanPrice * 1.24;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΑΞΙΑΣ ΠΡΟ ΦΟΡΟΥ',
      instruction: 'Υπολογίστε την καθαρή αρχική τιμή προ φόρου σε €:',
      prompt: `Η τελική τιμή ενός προϊόντος μαζί με Φ.Π.Α. 24 % είναι ${formatNum(finalPrice)} €. Ποια ήταν η καθαρή αρχική τιμή του χωρίς τον φόρο σε €;`,
      correctVal: cleanPrice,
      correctStr: String(cleanPrice),
      explanation: `Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Καθαρή αξία: (${formatNum(finalPrice)} · 100) : 124 ＝ ${cleanPrice} €.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctStatement = 'Όχι, γιατί το 20% υπολογίστηκε στην αρχική τιμή (που ήταν μεγαλύτερη) και όχι στα 80 €';
    const options = [
      { text: correctStatement, isCorrect: true },
      { text: 'Ναι, γιατί 80 ＋ 20% ισούται πάντα με την αρχική τιμή', isCorrect: false },
      { text: 'Ναι, αρκεί να προσθέσουμε και 20 € επιπλέον', isCorrect: false },
      { text: 'Όχι, γιατί στις εκπτώσεις κάνουμε μόνο πολλαπλασιασμό με το 100', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Η ΜΕΓΑΛΗ ΠΑΓΙΔΑ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική κρίση:',
      prompt: `Αν πληρώσαμε 80 € για ένα προϊόν μετά από έκπτωση 20 %, είναι σωστό να πούμε ότι η αρχική τιμή ήταν 80 ＋ 20 % των 80 ＝ 96 €;`,
      options,
      correctText: correctStatement,
      explanation: `Είναι λάθος! Η έκπτωση 20% αφαιρέθηκε από την αρχική τιμή (το 100%), άρα τα 80 € αντιστοιχούν στο 80%. Η πραγματική αρχική τιμή ήταν 100 €.`
    });
  }

  // Q5 (Input - Decimal)
  {
    const origP = pickRandom([40, 60, 90, 110]);
    const finalP = origP * 1.1;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΔΙΑΙΡΕΣΗ ΜΕ ΔΕΚΑΔΙΚΟ ΣΥΝΤΕΛΕΣΤΗ',
      instruction: 'Υπολογίστε την αρχική τιμή:',
      prompt: `Ένα ποσό μετά από αύξηση 10 % έγινε ${formatNum(finalP)} €. Διαιρώντας με τον συντελεστή 1,10, ποια ήταν η αρχική τιμή σε €;`,
      correctVal: origP,
      correctStr: String(origP),
      explanation: `Διαιρούμε την τελική τιμή με τον συντελεστή: ${formatNum(finalP)} : 1,10 ＝ ${origP} €.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctFormula = 'Αρχική Τιμή ＝ (Τελική Τιμή · 100) : (100 － Έκπτωση %)';
    const options = [
      { text: correctFormula, isCorrect: true },
      { text: 'Αρχική Τιμή ＝ Τελική Τιμή ＋ (Τελική Τιμή · Έκπτωση %)', isCorrect: false },
      { text: 'Αρχική Τιμή ＝ (Τελική Τιμή · Έκπτωση %) : 100', isCorrect: false },
      { text: 'Αρχική Τιμή ＝ (Τελική Τιμή · 100) : Έκπτωση %', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Ο ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ',
      instruction: 'Επιλέξτε τον σωστό τύπο υπολογισμού της αρχικής τιμής μετά από έκπτωση:',
      prompt: `Ποιος είναι ο σωστός τύπος για να βρούμε την αρχική τιμή όταν γνωρίζουμε την τελική τιμή και το ποσοστό έκπτωσης;`,
      options,
      correctText: correctFormula,
      explanation: `Από τον πίνακα ποσών με χιαστί προκύπτει: ${correctFormula}.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΓΟΡΑΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε την αρχική τιμή σε €:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = formatNum(val8 + randInt(20, 50));
    const fake8B = formatNum(Math.max(10, val8 - randInt(20, 50)));
    const fake8C = formatNum(val8 * 1.2);

    const optionsQ8 = [
      { text: `${stdProb2.correctStr} €`, isCorrect: true },
      { text: `${fake8A} €`, isCorrect: false },
      { text: `${fake8B} €`, isCorrect: false },
      { text: `${fake8C} €`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
      instruction: 'Επιλέξτε τη σωστή αρχική τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr} €`,
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
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + randInt(5, 10));
    const fake10B = formatNum(Math.max(5, val10 - randInt(5, 10)));
    const fake10C = formatNum(val10 * 1.5);

    const optionsQ10 = [
      { text: `${hardProb2.correctStr} %`, isCorrect: true },
      { text: `${fake10A} %`, isCorrect: false },
      { text: `${fake10B} %`, isCorrect: false },
      { text: `${fake10C} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΙΑΙΑΣ ΣΥΣΧΕΤΙΣΗΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr} %`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function BriskoArxikiTimiExercisesPage() {
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
      title="Ασκήσεις: Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην εύρεση αρχικής τιμής, αντιστοίχιση τελικής τιμής και αποφυγή της παγίδας των ποσοστών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/52-brisko-arxiki-timi"
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
              Ασκήσεις: Εύρεση της Αρχικής Τιμής
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε την αρχική αξία προ έκπτωσης ή προ φόρου, αποφύγετε τη μεγάλη παγίδα και επαληθεύστε τις απαντήσεις σας.
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
                        <span className="bg-indigo-100/60 px-1.5 py-0.5 rounded text-indigo-900 truncate">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1.5 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700">{q.tableData.r1[1]}</span>
                        <span className="text-amber-600 font-black text-sm">{q.tableData.r2[0]}</span>
                        <span>{q.tableData.r2[1]}</span>
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
