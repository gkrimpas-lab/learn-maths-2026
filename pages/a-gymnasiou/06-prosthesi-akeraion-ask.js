import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πρόσθεση θετικών (Input)
  () => {
    const a = randInt(5, 25);
    const b = randInt(6, 30);
    const ans = a + b;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (＋${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Προσθέτουμε δύο θετικούς αριθμούς: ＋(${a} ＋ ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Πρόσθεση αρνητικών (Input)
  () => {
    const a = randInt(4, 22);
    const b = randInt(5, 28);
    const ans = -(a + b);
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (－${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Προσθέτουμε δύο αρνητικούς αριθμούς. Κρατάμε το κοινό πρόσημο (－) και προσθέτουμε τις απόλυτες τιμές: －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 3. Ετερόσημοι με θετικό αποτέλεσμα (Input)
  () => {
    const b = randInt(3, 15);
    const a = b + randInt(2, 14);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (＋${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Επειδή |＋${a}| ＞ |－${b}|, το αποτέλεσμα έχει θετικό πρόσημο: ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },

  // 4. Ετερόσημοι με αρνητικό αποτέλεσμα (Input)
  () => {
    const a = randInt(2, 14);
    const b = a + randInt(3, 16);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (＋${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Επειδή |－${b}| ＞ |＋${a}|, κρατάμε το αρνητικό πρόσημο: －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 5. Ετερόσημοι με πρώτο αρνητικό και θετικό αποτέλεσμα (Input)
  () => {
    const a = randInt(4, 15);
    const b = a + randInt(2, 15);
    const ans = b - a;
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (－${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Το ＋${b} έχει μεγαλύτερη απόλυτη τιμή: ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },

  // 6. Ετερόσημοι με πρώτο αρνητικό και αρνητικό αποτέλεσμα (Input)
  () => {
    const b = randInt(3, 12);
    const a = b + randInt(4, 18);
    const ans = -(a - b);
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα: (－${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Το －${a} έχει μεγαλύτερη απόλυτη τιμή: －(${a} － ${b}) ＝ ${ans}.`,
    };
  },

  // 7. Άθροισμα αντιθέτων αριθμών (Input)
  () => {
    const n = randInt(11, 75);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα των αντιθέτων: (＋${n}) ＋ (－${n})`,
      correctAnswer: '0',
      solution: `Το άθροισμα δύο αντίθετων αριθμών ισούται πάντοτε με το μηδέν.`,
    };
  },

  // 8. Πρόσθεση με το μηδέν (Input)
  () => {
    const n = randInt(8, 45);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ',
      question: `Υπολόγισε το άθροισμα: (－${n}) ＋ 0`,
      correctAnswer: `-${n}`,
      solution: `Το μηδέν είναι το ουδέτερο στοιχείο της πρόσθεσης: (－${n}) ＋ 0 ＝ －${n}.`,
    };
  },

  // 9. Άθροισμα τριών αριθμών (Input)
  () => {
    const a = randInt(5, 12);
    const b = randInt(3, 8);
    const c = randInt(6, 14);
    const ans = a - b - c;
    return {
      type: 'input',
      topic: 'ΑΘΡΟΙΣΜΑ ΠΟΛΛΩΝ ΟΡΩΝ',
      question: `Υπολόγισε: (＋${a}) ＋ (－${b}) ＋ (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Προσθέτουμε πρώτα τους αρνητικούς: (－${b}) ＋ (－${c}) ＝ －${b + c}. Έπειτα: (＋${a}) ＋ (－${b + c}) ＝ ${ans}.`,
    };
  },

  // 10. Απλοποιημένη γραφή χωρίς παρενθέσεις (Input)
  () => {
    const a = randInt(10, 25);
    const b = randInt(12, 35);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question: `Υπολόγισε την τιμή της παράστασης: ${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution: `Η παράσταση ισοδυναμεί με (＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 11. Δύο διαδοχικά μείον σε άθροισμα (Input)
  () => {
    const a = randInt(6, 18);
    const b = randInt(4, 15);
    const ans = -a - b;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question: `Υπολόγισε: －${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution: `Ισοδυναμεί με (－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 12. Σωστός κανόνας ομόσημων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question: `Ποιο είναι το αποτέλεσμα της πρόσθεσης δύο αρνητικών αριθμών;`,
      options: makeUniqueOptions(
        'Πάντοτε αρνητικός αριθμός',
        ['Πάντοτε θετικός αριθμός', 'Πάντοτε το μηδέν', 'Εξαρτάται από τις απόλυτες τιμές']
      ),
      correctAnswer: 'Πάντοτε αρνητικός αριθμός',
      solution: `Το άθροισμα δύο αρνητικών αριθμών διατηρεί το κοινό τους πρόσημο, επομένως είναι πάντοτε αρνητικός αριθμός.`,
    };
  },

  // 13. Πότε το άθροισμα ετερόσημων είναι μηδέν (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question: `Πότε το άθροισμα δύο ετερόσημων αριθμών ισούται με το μηδέν;`,
      options: makeUniqueOptions(
        'Όταν οι αριθμοί είναι αντίθετοι',
        ['Όταν ο ένας είναι διπλάσιος του άλλου', 'Όταν και οι δύο είναι άρτιοι', 'Ποτέ δεν μπορεί να είναι μηδέν']
      ),
      correctAnswer: 'Όταν οι αριθμοί είναι αντίθετοι',
      solution: `Το άθροισμα δύο ετερόσημων αριθμών είναι μηδέν μόνο όταν έχουν ίσες απόλυτες τιμές, δηλαδή όταν είναι αντίθετοι αριθμοί.`,
    };
  },

  // 14. Πρόσημο αθροίσματος ετερόσημων (MCQ)
  () => {
    const a = randInt(15, 30);
    const b = randInt(4, 12);
    return {
      type: 'mcq',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Χωρίς να κάνεις την πράξη, ποιο είναι το πρόσημο του αθροίσματος (－${a}) ＋ (＋${b});`,
      options: makeUniqueOptions('Αρνητικό (－)', ['Θετικό (＋)', 'Μηδέν', 'Δεν ορίζεται']),
      correctAnswer: 'Αρνητικό (－)',
      solution: `Επειδή |－${a}| ＝ ${a} ＞ ${b} ＝ |＋${b}|, το άθροισμα παίρνει το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή, δηλαδή το αρνητικό (－).`,
    };
  },

  // 15. Άθροισμα με αντίθετους που απλοποιούνται (Input)
  () => {
    const a = randInt(10, 40);
    const b = randInt(3, 18);
    return {
      type: 'input',
      topic: 'ΕΞΥΠΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      question: `Υπολόγισε έξυπνα: (＋${a}) ＋ (－${b}) ＋ (－${a})`,
      correctAnswer: `-${b}`,
      solution: `Οι όροι ＋${a} και －${a} είναι αντίθετοι και έχουν άθροισμα 0. Άρα απομένει μόνο το －${b}.`,
    };
  },

  // 16. Συμπλήρωση όρου πρόσθεσης (Input)
  () => {
    const a = randInt(3, 12);
    const target = randInt(-10, -2);
    const missing = target - a;
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: (＋${a}) ＋ x ＝ ${target}`,
      correctAnswer: missing.toString(),
      solution: `x ＝ ${target} － (＋${a}) ＝ ${target} － ${a} ＝ ${missing}.`,
    };
  },

  // 17. Μετακίνηση στον άξονα: δεξιά ή αριστερά (MCQ)
  () => {
    const b = randInt(3, 9);
    return {
      type: 'mcq',
      topic: 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
      question: `Στον άξονα των αριθμών, η πρόσθεση του αριθμού (－${b}) σημαίνει μετακίνηση:`,
      options: makeUniqueOptions(
        `Κατά ${b} θέσεις προς τα αριστερά`,
        [`Κατά ${b} θέσεις προς τα δεξιά`, `Παραμονή στην ίδια θέση`, `Επιστροφή στο 0`]
      ),
      correctAnswer: `Κατά ${b} θέσεις προς τα αριστερά`,
      solution: `Το αρνητικό πρόσημο εκφράζει πάντοτε μετατόπιση προς την αρνητική κατεύθυνση, δηλαδή προς τα αριστερά.`,
    };
  },

  // 18. Υπολογισμός τεσσάρων όρων (Input)
  () => {
    const ans = randInt(-8, 8);
    const p1 = 6;
    const p2 = 8;
    const n1 = -4;
    const n2 = ans - (p1 + p2 + n1);
    return {
      type: 'input',
      topic: 'ΑΘΡΟΙΣΜΑ ΠΟΛΛΩΝ ΟΡΩΝ',
      question: `Υπολόγισε: (＋${p1}) ＋ (－4) ＋ (＋${p2}) ＋ (${n2 >= 0 ? `＋${n2}` : `－${Math.abs(n2)}`})`,
      correctAnswer: ans.toString(),
      solution: `Ομαδοποιούμε θετικούς και αρνητικούς όρους και βρίσκουμε τελικό άθροισμα ${ans}.`,
    };
  },

  // 19. Σύγκριση αθροίσματος με το μηδέν (MCQ)
  () => {
    const a = randInt(8, 20);
    const b = a + randInt(1, 5);
    return {
      type: 'mcq',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποια σχέση ισχύει για το άθροισμα (＋${a}) ＋ (－${b});`,
      options: makeUniqueOptions(
        'Είναι μικρότερο από το 0 (αρνητικό)',
        ['Είναι μεγαλύτερο από το 0 (θετικό)', 'Είναι ίσο με το 0', 'Είναι ίσο με ＋1']
      ),
      correctAnswer: 'Είναι μικρότερο από το 0 (αρνητικό)',
      solution: `Επειδή |－${b}| ＞ |＋${a}|, το άθροισμα είναι αρνητικό, δηλαδή μικρότερο από το 0.`,
    };
  },

  // 20. Απόλυτη τιμή αθροίσματος (Input)
  () => {
    const a = randInt(4, 12);
    const b = randInt(14, 25);
    const inside = a - b;
    const ans = Math.abs(inside);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ & ΠΡΟΣΘΕΣΗ',
      question: `Υπολόγισε την τιμή: |(＋${a}) ＋ (－${b})|`,
      correctAnswer: ans.toString(),
      solution: `Πρώτα εκτελούμε την πρόσθεση μέσα στην απόλυτη τιμή: (＋${a}) ＋ (－${b}) ＝ ${inside}. Στη συνέχεια παίρνουμε την απόλυτη τιμή: |${inside}| ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΑΡΤΙΑ ΕΛΛΗΝΙΚΗ ΣΥΝΤΑΞΗ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Πτώση θερμοκρασίας κάτω από το μηδέν
  () => {
    const start = randInt(2, 6);
    const drop = randInt(start + 2, start + 7);
    const ans = start - drop;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Στην Καστοριά η θερμοκρασία το μεσημέρι ήταν ＋${start} °C. Μέχρι τα μεσάνυχτα η θερμοκρασία έπεσε κατά ${drop} °C. Ποια είναι η νέα θερμοκρασία σε °C;`,
      correctAnswer: ans.toString(),
      solution: `Εκφράζουμε την πτώση ως πρόσθεση αρνητικού αριθμού: (＋${start}) ＋ (－${drop}) ＝ －(${drop} － ${start}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Άνοδος θερμοκρασίας από παγετό
  () => {
    const start = randInt(4, 9);
    const rise = randInt(start + 2, start + 8);
    const ans = -start + rise;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Το πρωί σε ένα ορεινό χωριό η θερμοκρασία ήταν －${start} °C. Το μεσημέρι ανέβηκε κατά ${rise} °C. Ποια είναι η θερμοκρασία το μεσημέρι σε °C;`,
      correctAnswer: ans.toString(),
      solution: `Η άνοδος αντιστοιχεί σε θετικό αριθμό: (－${start}) ＋ (＋${rise}) ＝ ＋(${rise} － ${start}) ＝ ＋${ans} °C.`,
    };
  },

  // Πρόβλημα 3: Τραπεζική κατάθεση και ανάληψη (υπόλοιπο αρνητικό)
  () => {
    const deposit = randInt(40, 90);
    const withdraw = deposit + randInt(20, 60);
    const ans = deposit - withdraw;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας τραπεζικός λογαριασμός είχε υπόλοιπο ${deposit} €. Ο κάτοχος έκανε ανάληψη ${withdraw} € με δικαίωμα υπερανάληψης. Ποιο είναι το νέο υπόλοιπο σε €;`,
      correctAnswer: ans.toString(),
      solution: `Η ανάληψη εκφράζεται ως αρνητικός αριθμός: (＋${deposit}) ＋ (－${withdraw}) ＝ ${ans} €. Το υπόλοιπο είναι αρνητικό.`,
    };
  },

  // Πρόβλημα 4: Αποπληρωμή χρέους (παραμένει χρέος)
  () => {
    const debt = randInt(80, 150);
    const pay = debt - randInt(15, 45);
    const ans = -debt + pay;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας επαγγελματίας είχε οφειλή (χρέος) ${debt} €. Πλήρωσε έναντι ${pay} €. Ποιο είναι το υπόλοιπο της οφειλής του σε € (με το κατάλληλο πρόσημο);`,
      correctAnswer: ans.toString(),
      solution: `Το χρέος είναι αρνητικό και η πληρωμή θετική: (－${debt}) ＋ (＋${pay}) ＝ －(${debt} － ${pay}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Αποπληρωμή χρέους με πλεόνασμα
  () => {
    const debt = randInt(50, 90);
    const pay = debt + randInt(20, 50);
    const ans = -debt + pay;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας συνδρομητής όφειλε στην εταιρεία κινητής τηλεφωνίας ${debt} €. Κατέθεσε κατά λάθος ${pay} €. Ποιο είναι το νέο πιστωτικό του υπόλοιπο σε €;`,
      correctAnswer: ans.toString(),
      solution: `(－${debt}) ＋ (＋${pay}) ＝ ＋(${pay} － ${debt}) ＝ ＋${ans} €.`,
    };
  },

  // Πρόβλημα 6: Κίνηση ασανσέρ (υπόγειο σε όροφο)
  () => {
    const basement = randInt(2, 4);
    const floorsUp = basement + randInt(2, 6);
    const ans = -basement + floorsUp;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question: `Ο ανελκυστήρας ενός εμπορικού κέντρου ξεκινά από το ${basement}ο υπόγειο (όροφος －${basement}) και ανεβαίνει κατά ${floorsUp} ορόφους. Σε ποιον όροφο σταματά;`,
      correctAnswer: ans.toString(),
      solution: `(－${basement}) ＋ (＋${floorsUp}) ＝ ＋(${floorsUp} － ${basement}) ＝ ＋${ans} (δηλαδή στον ${ans}ο όροφο).`,
    };
  },

  // Πρόβλημα 7: Κίνηση ασανσέρ (όροφος σε υπόγειο)
  () => {
    const floor = randInt(3, 7);
    const floorsDown = floor + randInt(2, 4);
    const ans = floor - floorsDown;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question: `Ένας ανελκυστήρας βρίσκεται στον ${floor}ο όροφο (＋${floor}) και κατεβαίνει κατά ${floorsDown} ορόφους. Σε ποιον όροφο βρίσκεται τώρα;`,
      correctAnswer: ans.toString(),
      solution: `(＋${floor}) ＋ (－${floorsDown}) ＝ －(${floorsDown} － ${floor}) ＝ ${ans} (στο ${Math.abs(ans)}ο υπόγειο).`,
    };
  },

  // Πρόβλημα 8: Υποβρύχιο που καταδύεται βαθύτερα
  () => {
    const depth1 = randInt(40, 90);
    const depth2 = randInt(20, 50);
    const ans = -(depth1 + depth2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένα υποβρύχιο πλέει σε βάθος ${depth1} m (υψόμετρο －${depth1} m). Στη συνέχεια καταδύεται κατά ακόμα ${depth2} m. Ποιο είναι το νέο του βάθος ως ακέραιος αριθμός;`,
      correctAnswer: ans.toString(),
      solution: `Προσθέτουμε δύο αρνητικές μετατοπίσεις: (－${depth1}) ＋ (－${depth2}) ＝ －(${depth1} ＋ ${depth2}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 9: Υποβρύχιο που αναδύεται μερικώς
  () => {
    const depth = randInt(70, 130);
    const ascent = randInt(25, depth - 15);
    const ans = -depth + ascent;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένα ερευνητικό υποβρύχιο βρισκόταν σε βάθος ${depth} m (－${depth} m). Ανέβηκε κατά ${ascent} m προς την επιφάνεια. Σε ποιο υψόμετρο βρίσκεται τώρα σε μέτρα;`,
      correctAnswer: ans.toString(),
      solution: `(－${depth}) ＋ (＋${ascent}) ＝ －(${depth} － ${ascent}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 10: Βαθμολογία σε τηλεπαιχνίδι
  () => {
    const penalty = randInt(15, 35);
    const reward = penalty + randInt(10, 25);
    const ans = -penalty + reward;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα τηλεπαιχνίδι ένας παίκτης είχε ποινή －${penalty} βαθμούς. Στον επόμενο γύρο κέρδισε ${reward} βαθμούς. Ποια είναι η τελική του βαθμολογία;`,
      correctAnswer: ans.toString(),
      solution: `(－${penalty}) ＋ (＋${reward}) ＝ ＋(${reward} － ${penalty}) ＝ ＋${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 11: Διαδοχικές ποινές σε επιτραπέζιο
  () => {
    const p1 = randInt(10, 25);
    const p2 = randInt(8, 20);
    const ans = -(p1 + p2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε έναν γύρο ενός επιτραπέζιου παιχνιδιού ο Γιάννης δέχτηκε ποινή ${p1} βαθμών και στον επόμενο γύρο νέα ποινή ${p2} βαθμών. Ποιο είναι το συνολικό σκορ του;`,
      correctAnswer: ans.toString(),
      solution: `(－${p1}) ＋ (－${p2}) ＝ －(${p1} ＋ ${p2}) ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 12: Διαφορά θερμοκρασίας καταψύκτη
  () => {
    const start = randInt(14, 20);
    const cold = randInt(3, 8);
    const ans = -(start + cold);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Ένας επαγγελματικός καταψύκτης έχει θερμοκρασία －${start} °C. Ο τεχνικός ρυθμίζει τη θερμοκρασία να πέσει κατά άλλους ${cold} °C. Ποια είναι η νέα ένδειξη σε °C;`,
      correctAnswer: ans.toString(),
      solution: `(－${start}) ＋ (－${cold}) ＝ －(${start} ＋ ${cold}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 13: Κέρδος και ζημιά καταστήματος
  () => {
    const loss = randInt(120, 250);
    const profit = loss + randInt(50, 150);
    const ans = -loss + profit;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κατάστημα την πρώτη εβδομάδα κατέγραψε ζημιά ${loss} €. Τη δεύτερη εβδομάδα είχε κέρδος ${profit} €. Ποιο είναι το συνολικό οικονομικό αποτέλεσμα των δύο εβδομάδων σε €;`,
      correctAnswer: ans.toString(),
      solution: `(－${loss}) ＋ (＋${profit}) ＝ ＋(${profit} － ${loss}) ＝ ＋${ans} €.`,
    };
  },

  // Πρόβλημα 14: Ζημιά μεγαλύτερη από το κέρδος
  () => {
    const profit = randInt(100, 200);
    const loss = profit + randInt(40, 110);
    const ans = profit - loss;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια μικρή επιχείρηση είχε κέρδος ${profit} € τη Δευτέρα, αλλά την Τρίτη κατέγραψε ζημιά ${loss} €. Ποιο είναι το τελικό ταμειακό αποτέλεσμα σε €;`,
      correctAnswer: ans.toString(),
      solution: `(＋${profit}) ＋ (－${loss}) ＝ －(${loss} － ${profit}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 15: Δύτης που ανεβαίνει
  () => {
    const depth = randInt(18, 35);
    const up = randInt(5, depth - 4);
    const ans = -depth + up;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένας δύτης καταδύεται σε βάθος ${depth} m (θέση －${depth} m). Στη συνέχεια ανεβαίνει κατά ${up} m για αποσυμπίεση. Σε ποιο βάθος βρίσκεται τώρα (ως ακέραιος με πρόσημο);`,
      correctAnswer: ans.toString(),
      solution: `(－${depth}) ＋ (＋${up}) ＝ －(${depth} － ${up}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 16: Μεταβολή θερμοκρασίας σε εργαστήριο
  () => {
    const t1 = randInt(1, 5);
    const drop = randInt(6, 12);
    const ans = t1 - drop;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Σε ένα πείραμα χημείας η θερμοκρασία ενός διαλύματος ήταν ＋${t1} °C. Με την προσθήκη ξηρού πάγου η θερμοκρασία μειώθηκε κατά ${drop} °C. Ποια είναι η τελική θερμοκρασία σε °C;`,
      correctAnswer: ans.toString(),
      solution: `(＋${t1}) ＋ (－${drop}) ＝ －(${drop} － ${t1}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 17: Μετοχές και μεταβολή δείκτη
  () => {
    const fall = randInt(15, 40);
    const rise = randInt(10, 35);
    const ans = -fall + rise;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question: `Ο γενικός δείκτης τιμών υποχώρησε την Τετάρτη κατά ${fall} μονάδες και την Πέμπτη ενισχύθηκε κατά ${rise} μονάδες. Ποια είναι η συνολική μεταβολή του δείκτη στο διήμερο;`,
      correctAnswer: ans.toString(),
      solution: `(－${fall}) ＋ (＋${rise}) ＝ ${ans > 0 ? `＋${ans}` : ans} μονάδες.`,
    };
  },

  // Πρόβλημα 18: Υπόγειο πάρκινγκ
  () => {
    const down1 = 2;
    const down2 = 1;
    const ans = -(down1 + down2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question: `Ένας οδηγός κατεβαίνει στο 2ο υπόγειο (－2) και κατόπιν κατεβαίνει ένα ακόμα επίπεδο με τις κυλιόμενες σκάλες. Σε ποιο υπόγειο επίπεδο βρίσκεται τώρα (ως αρνητικός αριθμός);`,
      correctAnswer: ans.toString(),
      solution: `(－${down1}) ＋ (－${down2}) ＝ －${down1 + down2}. Βρίσκεται στο ${Math.abs(ans)}ο υπόγειο.`,
    };
  },

  // Πρόβλημα 19: Διαφορά στάθμης δεξαμενής
  () => {
    const below = randInt(12, 28);
    const refill = below + randInt(5, 18);
    const ans = -below + refill;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question: `Η στάθμη του νερού σε μια τεχνητή λίμνη βρισκόταν ${below} cm κάτω από το κανονικό όριο (－${below} cm). Μετά από βροχόπτωση η στάθμη ανέβηκε κατά ${refill} cm. Ποια είναι η νέα στάθμη σε cm σε σχέση με το όριο;`,
      correctAnswer: ans.toString(),
      solution: `(－${below}) ＋ (＋${refill}) ＝ ＋(${refill} － ${below}) ＝ ＋${ans} cm.`,
    };
  },

  // Πρόβλημα 20: Παιχνίδι ερωτήσεων με βαθμούς
  () => {
    const wrongPenalty = randInt(20, 50);
    const rightBonus = randInt(10, 40);
    const ans = -wrongPenalty + rightBonus;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Μια ομάδα μαθητών ξεκίνησε έναν γύρο γνώσεων με ποινή －${wrongPenalty} πόντων λόγω καθυστέρησης, αλλά απάντησε σωστά κερδίζοντας ${rightBonus} πόντους. Ποιο είναι το σκορ της;`,
      correctAnswer: ans.toString(),
      solution: `(－${wrongPenalty}) ＋ (＋${rightBonus}) ＝ ${ans > 0 ? `＋${ans}` : ans} πόντοι.`,
    };
  },
];

export default function ProsthesiAkeraionAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις υπολογισμών + 2 ρεαλιστικά προβλήματα = 12 συνολικά
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
    clean = clean.replace(/[^0-9,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

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
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

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
      title="Ασκήσεις: Πρόσθεση Ακεραίων | Α' Γυμνασίου"
      description="Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στην πρόσθεση ομόσημων και ετερόσημων ακεραίων αριθμών."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/06-prosthesi-akeraion"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πρόσθεση Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις το σκορ σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');
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
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                          isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                        }`}>
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
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
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
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block">
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
