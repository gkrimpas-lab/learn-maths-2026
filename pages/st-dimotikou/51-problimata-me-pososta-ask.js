// pages/st-dimotikou/51-problimata-me-pososta-ask.js
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

// Δεξαμενη Κανονικων Προβληματων με Ποσοστα
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'pos_std_1',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 15, 20, 25, 30]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        text: `Ένα παντελόνι κοστίζει ${origPrice} € και προσφέρεται στις εκπτώσεις με μείωση ${discPct} %. Πόσα ευρώ (€) θα πληρώσει τελικά ο αγοραστής;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Έκπτωση (€)', r1: [100, discPct], r2: [origPrice, 'χ'] },
        correctVal: finalPrice,
        correctStr: String(finalPrice),
        explanation: `Έκπτωση: (${origPrice} · ${discPct}) : 100 ＝ ${discount} €. Τελική τιμή: ${origPrice} － ${discount} ＝ ${finalPrice} €.`
      };
    }
  },
  {
    id: 'pos_std_2',
    generate: () => {
      const origPrice = pickRandom([100, 200, 300, 400, 500]);
      const vatPct = 24;
      const vatAmount = (origPrice * vatPct) / 100;
      const finalPrice = origPrice + vatAmount;
      return {
        text: `Ένα ηλεκτρικό ποδήλατο έχει καθαρή αξία ${origPrice} € και επιβαρύνεται με Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή πώλησής του σε €;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Φ.Π.Α. (€)', r1: [100, vatPct], r2: [origPrice, 'χ'] },
        correctVal: finalPrice,
        correctStr: String(finalPrice),
        explanation: `Φόρος Φ.Π.Α.: (${origPrice} · 24) : 100 ＝ ${vatAmount} €. Τελική τιμή: ${origPrice} ＋ ${vatAmount} ＝ ${finalPrice} €.`
      };
    }
  },
  {
    id: 'pos_std_3',
    generate: () => {
      const costPrice = pickRandom([40, 50, 60, 80]);
      const profitPct = 20;
      const profit = (costPrice * profitPct) / 100;
      const sellingPrice = costPrice + profit;
      return {
        text: `Ένας έμπορος αγόρασε ένα προϊόν προς ${costPrice} € και το πουλάει με κέρδος ${profitPct} %. Σε ποια τιμή (€) θα το πουλήσει;`,
        tableData: { col1: 'Αγορά (€)', col2: 'Κέρδος (€)', r1: [100, profitPct], r2: [costPrice, 'χ'] },
        correctVal: sellingPrice,
        correctStr: String(sellingPrice),
        explanation: `Κέρδος: (${costPrice} · 20) : 100 ＝ ${profit} €. Τιμή πώλησης: ${costPrice} ＋ ${profit} ＝ ${sellingPrice} €.`
      };
    }
  },
  {
    id: 'pos_std_4',
    generate: () => {
      const origStudents = pickRandom([200, 250, 400, 500]);
      const absPct = 12;
      const absStudents = (origStudents * absPct) / 100;
      return {
        text: `Σε ένα σχολείο φοιτούν ${origStudents} μαθητές. Σήμερα απουσιάζει το ${absPct} % των μαθητών. Πόσοι μαθητές απουσιάζουν σήμερα;`,
        correctVal: absStudents,
        correctStr: String(absStudents),
        explanation: `Απόντες: (${origStudents} · 12) : 100 ＝ ${absStudents} μαθητές.`
      };
    }
  },
  {
    id: 'pos_std_5',
    generate: () => {
      const capacity = pickRandom([400, 500, 600, 800]);
      const usedPct = 35;
      const usedWater = (capacity * usedPct) / 100;
      return {
        text: `Μια δεξαμενή έχει χωρητικότητα ${capacity} l νερό. Έχει καταναλωθεί το ${usedPct} % του νερού. Πόσα λίτρα (l) νερό έχουν καταναλωθεί;`,
        correctVal: usedWater,
        correctStr: String(usedWater),
        explanation: `Νερό που καταναλώθηκε: (${capacity} · 35) : 100 ＝ ${usedWater} l.`
      };
    }
  },
  {
    id: 'pos_std_6',
    generate: () => {
      const origRent = pickRandom([300, 400, 500]);
      const incPct = 10;
      const incAmount = (origRent * incPct) / 100;
      const newRent = origRent + incAmount;
      return {
        text: `Το ενοίκιο ενός διαμερίσματος ήταν ${origRent} € και αυξήθηκε κατά ${incPct} %. Ποιο είναι το νέο μηνιαίο ενοίκιο σε €;`,
        correctVal: newRent,
        correctStr: String(newRent),
        explanation: `Αύξηση: (${origRent} · 10) : 100 ＝ ${incAmount} €. Νέο ενοίκιο: ${origRent} ＋ ${incAmount} ＝ ${newRent} €.`
      };
    }
  },
  {
    id: 'pos_std_7',
    generate: () => {
      const origPrice = pickRandom([60, 80, 100, 120]);
      const discPct = 25;
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        text: `Ένα σακίδιο κοστίζει ${origPrice} € και έχει έκπτωση 25 %. Πόσα ευρώ (€) θα πληρώσει ο πελάτης μετά την έκπτωση;`,
        correctVal: finalPrice,
        correctStr: String(finalPrice),
        explanation: `Έκπτωση: (${origPrice} · 25) : 100 ＝ ${discount} €. Τελική τιμή: ${origPrice} － ${discount} ＝ ${finalPrice} €.`
      };
    }
  },
  {
    id: 'pos_std_8',
    generate: () => {
      const totalPages = pickRandom([150, 200, 250, 300]);
      const readPct = 40;
      const readPages = (totalPages * readPct) / 100;
      return {
        text: `Ένα βιβλίο έχει ${totalPages} σελίδες και ο μαθητής διάβασε το ${readPct} % των σελίδων. Πόσες σελίδες διάβασε;`,
        correctVal: readPages,
        correctStr: String(readPages),
        explanation: `Σελίδες που διαβάστηκαν: (${totalPages} · 40) : 100 ＝ ${readPages} σελίδες.`
      };
    }
  },
  {
    id: 'pos_std_9',
    generate: () => {
      const totalWeight = pickRandom([200, 300, 400, 500]);
      const fatPct = 15;
      const fatGrams = (totalWeight * fatPct) / 100;
      return {
        text: `Ένα τρόφιμο βάρους ${totalWeight} g περιέχει ${fatPct} % λιπαρά. Πόσα γραμμάρια (g) λιπαρά περιέχει;`,
        correctVal: fatGrams,
        correctStr: String(fatGrams),
        explanation: `Λιπαρά: (${totalWeight} · 15) : 100 ＝ ${fatGrams} g.`
      };
    }
  },
  {
    id: 'pos_std_10',
    generate: () => {
      const bill = pickRandom([50, 60, 80, 100]);
      const tipPct = 10;
      const tipAmount = (bill * tipPct) / 100;
      const totalPaid = bill + tipAmount;
      return {
        text: `Ο λογαριασμός σε ένα εστιατόριο ήταν ${bill} € και οι πελάτες πρόσθεσαν φιλοδώρημα ${tipPct} %. Πόσα ευρώ (€) πλήρωσαν συνολικά;`,
        correctVal: totalPaid,
        correctStr: String(totalPaid),
        explanation: `Φιλοδώρημα: (${bill} · 10) : 100 ＝ ${tipAmount} €. Συνολικό ποσό: ${bill} ＋ ${tipAmount} ＝ ${totalPaid} €.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'pos_hard_1',
    generate: () => {
      return {
        text: `Ένα προϊόν αρχικής αξίας 200 € έχει διαδοχικές εκπτώσεις: αρχικά 20 % και στη συνέχεια επιπλέον έκπτωση 10 % επί της νέας μειωμένης τιμής. Ποια είναι η τελική τιμή πώλησης σε €;`,
        correctVal: 144,
        correctStr: '144',
        explanation: `1η Έκπτωση 20%: 200 － 40 ＝ 160 €. 2η Έκπτωση 10% στα 160 €: 160 · 0,10 ＝ 16 €. Τελική τιμή: 160 － 16 ＝ 144 €.`
      };
    }
  },
  {
    id: 'pos_hard_2',
    generate: () => {
      return {
        text: `Ένας επενδυτής είχε κεφάλαιο 1.000 €. Τον πρώτο χρόνο κέρδισε 10 % και τον δεύτερο χρόνο έχασε 10 % επί του νέου κεφαλαίου. Πόσα ευρώ (€) έχει στο τέλος;`,
        correctVal: 990,
        correctStr: '990',
        explanation: `1ος χρόνος (+10%): 1.000 ＋ 100 ＝ 1.100 €. 2ος χρόνος (-10% στα 1.100 €): 1.100 － 110 ＝ 990 €.`
      };
    }
  },
  {
    id: 'pos_hard_3',
    generate: () => {
      return {
        text: `Ένα κατάστημα αγοράζει ένα είδος προς 80 € και το πουλάει με κέρδος 25 %. Αν ο πελάτης πληρώσει επιπλέον Φ.Π.Α. 24 % επί της τιμής πώλησης, ποια είναι η τελική τιμή σε €;`,
        correctVal: 124,
        correctStr: '124',
        explanation: `Τιμή πώλησης με κέρδος 25%: 80 ＋ (80 · 0,25) ＝ 100 €. Τελική τιμή με Φ.Π.Α. 24%: 100 ＋ 24 ＝ 124 €.`
      };
    }
  },
  {
    id: 'pos_hard_4',
    generate: () => {
      return {
        text: `Σε ένα σχολείο 400 μαθητών, το 60 % είναι κορίτσια. Αν το 25 % των κοριτσιών ασχολείται με τον αθλητισμό, πόσα κορίτσια αθλούνται;`,
        correctVal: 60,
        correctStr: '60',
        explanation: `Κορίτσια: 400 · 0,60 ＝ 240. Κορίτσια που αθλούνται: 240 · 0,25 ＝ 60.`
      };
    }
  },
  {
    id: 'pos_hard_5',
    generate: () => {
      return {
        text: `Ένα κατάστημα προσφέρει προσφορά: «Αγοράστε 2 ίδια είδη αξίας 50 € το καθένα και πάρτε το δεύτερο με έκπτωση 50 %». Πόσα ευρώ (€) θα πληρώσει ο πελάτης και για τα δύο είδη μαζί;`,
        correctVal: 75,
        correctStr: '75',
        explanation: `1ο είδος: 50 €. 2ο είδος με έκπτωση 50%: 25 €. Σύνολο: 50 ＋ 25 ＝ 75 €.`
      };
    }
  },
  {
    id: 'pos_hard_6',
    generate: () => {
      return {
        text: `Από μια δεξαμενή 1.000 l νερού αφαιρέθηκε το 20 % και στη συνέχεια προστέθηκε στη δεξαμενή νερό ίσο με το 20 % του νερού που είχε απομείνει. Πόσα λίτρα (l) νερού περιέχει τώρα η δεξαμενή;`,
        correctVal: 960,
        correctStr: '960',
        explanation: `Μετά την αφαίρεση 20%: 800 l. Προσθήκη 20% των 800 l: 800 · 0,20 ＝ 160 l. Τελικό νερό: 800 ＋ 160 ＝ 960 l.`
      };
    }
  },
  {
    id: 'pos_hard_7',
    generate: () => {
      return {
        text: `Ένας εργαζόμενος έχει μηνιαίο μισθό 1.200 €. Του γίνεται κράτηση 15 % για ασφαλιστικές εισφορές. Πόσα ευρώ (€) είναι ο καθαρός μισθός που λαμβάνει;`,
        correctVal: 1020,
        correctStr: '1020',
        explanation: `Κράτηση: (1.200 · 15) : 100 ＝ 180 €. Καθαρός μισθός: 1.200 － 180 ＝ 1.020 €.`
      };
    }
  },
  {
    id: 'pos_hard_8',
    generate: () => {
      return {
        text: `Μια τηλεόραση αξίας 500 € πωλείται με έκπτωση 15 % αν πληρωθεί με μετρητά. Πόσα ευρώ (€) κερδίζει ο αγοραστής από την έκπτωση;`,
        correctVal: 75,
        correctStr: '75',
        explanation: `Κέρδος έκπτωσης: (500 · 15) : 100 ＝ 75 €.`
      };
    }
  },
  {
    id: 'pos_hard_9',
    generate: () => {
      return {
        text: `Σε ένα κατάστημα ρούχων, ένα παντελόνι αξίας 80 € πωλείται με έκπτωση 20 % και μια μπλούζα αξίας 40 € πωλείται με έκπτωση 10 %. Πόσα ευρώ (€) θα πληρώσει συνολικά ο πελάτης και για τα δύο ρούχα;`,
        correctVal: 100,
        correctStr: '100',
        explanation: `Παντελόνι: 80 － 16 ＝ 64 €. Μπλούζα: 40 － 4 ＝ 36 €. Σύνολο: 64 ＋ 36 ＝ 100 €.`
      };
    }
  },
  {
    id: 'pos_hard_10',
    generate: () => {
      return {
        text: `Ένα χωράφι 50 στρεμμάτων καλλιεργήθηκε ως εξής: 40 % με σιτάρι, 30 % με καλαμπόκι και το υπόλοιπο με βαμβάκι. Πόσα στρέμματα καλλιεργήθηκαν με βαμβάκι;`,
        correctVal: 15,
        correctStr: '15',
        explanation: `Ποσοστό βαμβακιού: 100 % － (40 % ＋ 30 %) ＝ 30 %. Στρέμματα: (50 · 30) : 100 ＝ 15 στρέμματα.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Υπολογισμός ποσού έκπτωσης
  {
    const orig = pickRandom([60, 80, 100, 120]);
    const pct = 20;
    const discAmount = (orig * pct) / 100;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΥ ΕΚΠΤΩΣΗΣ',
      instruction: 'Υπολογίστε μόνο το ποσό της έκπτωσης σε €:',
      prompt: `Σε ένα προϊόν αξίας ${orig} € γίνεται έκπτωση 20 %. Πόσα ευρώ (€) είναι η έκπτωση;`,
      correctVal: discAmount,
      correctStr: String(discAmount),
      explanation: `Έκπτωση: (${orig} · 20) : 100 ＝ ${discAmount} €.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctStatement = 'Αφαιρούμε το ποσό της έκπτωσης από την αρχική τιμή';
    const options = [
      { text: correctStatement, isCorrect: true },
      { text: 'Προσθέτουμε το ποσό της έκπτωσης στην αρχική τιμή', isCorrect: false },
      { text: 'Διαιρούμε την αρχική τιμή με το ποσό της έκπτωσης', isCorrect: false },
      { text: 'Η τελική τιμή είναι πάντοτε ίση με το ποσό της έκπτωσης', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΥΡΕΣΗ ΤΕΛΙΚΗΣ ΤΙΜΗΣ ΣΕ ΕΚΠΤΩΣΗ',
      instruction: 'Επιλέξτε τη σωστή πράξη:',
      prompt: `Πώς υπολογίζουμε την τελική τιμή πληρωμής ενός προϊόντος όταν γνωρίζουμε την αρχική τιμή και το ποσό της έκπτωσης;`,
      options,
      correctText: correctStatement,
      explanation: `Στις εκπτώσεις η τιμή μειώνεται, επομένως αφαιρούμε την έκπτωση από την αρχική τιμή: Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση.`
    });
  }

  // Q3 (Input - Decimal): Υπολογισμός τελικής τιμής με έκπτωση
  {
    const orig = pickRandom([50, 70, 90, 110]);
    const pct = 10;
    const finalP = orig * 0.9;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΤΕΛΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ',
      instruction: 'Υπολογίστε την τελική τιμή πληρωμής σε €:',
      prompt: `Ένα ρούχο κοστίζει ${orig} € και έχει έκπτωση 10 %. Πόσα ευρώ (€) θα πληρώσει ο πελάτης;`,
      correctVal: finalP,
      correctStr: formatNum(finalP),
      explanation: `Έκπτωση: (${orig} · 10) : 100 ＝ ${formatNum(orig * 0.1)} €. Τελική τιμή: ${orig} － ${formatNum(orig * 0.1)} ＝ ${formatNum(finalP)} €.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctStatement = 'Προσθέτουμε τον φόρο Φ.Π.Α. στην καθαρή αρχική αξία του προϊόντος';
    const options = [
      { text: correctStatement, isCorrect: true },
      { text: 'Αφαιρούμε τον φόρο Φ.Π.Α. από την καθαρή αρχική αξία', isCorrect: false },
      { text: 'Ο φόρος Φ.Π.Α. δεν αλλάζει καθόλου την τελική τιμή', isCorrect: false },
      { text: 'Διαιρούμε την αρχική τιμή με το 24', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΠΙΒΑΡΥΝΣΗ ΦΟΡΟΥ Φ.Π.Α.',
      instruction: 'Επιλέξτε τον σωστό κανόνα:',
      prompt: `Πώς επηρεάζει ο φόρος προστιθέμενης αξίας (Φ.Π.Α.) την τελική τιμή που πληρώνει ο καταναλωτής;`,
      options,
      correctText: correctStatement,
      explanation: `Ο φόρος Φ.Π.Α. αποτελεί επιβάρυνση, επομένως προστίθεται στην καθαρή αξία του προϊόντος.`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός τελικής τιμής με Φ.Π.Α. 24%
  {
    const clean = pickRandom([50, 100, 150, 200]);
    const finalVal = clean * 1.24;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΤΕΛΙΚΗ ΤΙΜΗ ΜΕ Φ.Π.Α.',
      instruction: 'Υπολογίστε την τελική τιμή με Φ.Π.Α. 24 % σε €:',
      prompt: `Ένα προϊόν έχει καθαρή αξία ${clean} € και επιβαρύνεται με Φ.Π.Α. 24 %. Ποια είναι η τελική τιμή σε €;`,
      correctVal: finalVal,
      correctStr: formatNum(finalVal),
      explanation: `Φόρος: (${clean} · 24) : 100 ＝ ${formatNum(clean * 0.24)} €. Τελική τιμή: ${clean} ＋ ${formatNum(clean * 0.24)} ＝ ${formatNum(finalVal)} €.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctConcept = 'Πολλαπλασιάζουμε την αρχική τιμή με 0,75 (καθώς 100% － 25% ＝ 75%)';
    const options = [
      { text: correctConcept, isCorrect: true },
      { text: 'Πολλαπλασιάζουμε την αρχική τιμή με 0,25 και αυτό είναι η τελική τιμή', isCorrect: false },
      { text: 'Διαιρούμε την αρχική τιμή με το 75', isCorrect: false },
      { text: 'Προσθέτουμε 25 € στην αρχική τιμή', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΠΕΥΘΕΙΑΣ ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΛΙΚΗΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε τη συντομότερη μαθηματική μέθοδο:',
      prompt: `Πώς μπορούμε να βρούμε απευθείας την τελική τιμή ενός προϊόντος μετά από έκπτωση 25 % σε ένα μόνο βήμα;`,
      options,
      correctText: correctConcept,
      explanation: `Εφόσον αφαιρείται το 25%, πληρώνουμε το υπόλοιπο 75% της αξίας, δηλαδή πολλαπλασιάζουμε απευθείας με 0,75.`
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
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα σε €:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = formatNum(val8 + randInt(10, 30));
    const fake8B = formatNum(Math.max(5, val8 - randInt(10, 25)));
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
      instruction: 'Επιλέξτε τη σωστή τελική τιμή:',
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
    const fake10A = formatNum(val10 + randInt(20, 50));
    const fake10B = formatNum(Math.max(10, val10 - randInt(15, 40)));
    const fake10C = formatNum(val10 * 1.1);

    const optionsQ10 = [
      { text: `${hardProb2.correctStr} €`, isCorrect: true },
      { text: `${fake10A} €`, isCorrect: false },
      { text: `${fake10B} €`, isCorrect: false },
      { text: `${fake10C} €`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΟΧΙΚΩΝ ΜΕΤΑΒΟΛΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr} €`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function ProblimataMePosostaExercisesPage() {
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
      title="Ασκήσεις: Προβλήματα με Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στον υπολογισμό ποσού έκπτωσης, αύξησης, φόρου Φ.Π.Α. και τελικής τιμής για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-problimata-me-pososta"
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
              Ασκήσεις: Προβλήματα με Ποσοστά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε ποσά εκπτώσεων, αυξήσεις, φόρους Φ.Π.Α. και τελικές τιμές πληρωμής.
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
