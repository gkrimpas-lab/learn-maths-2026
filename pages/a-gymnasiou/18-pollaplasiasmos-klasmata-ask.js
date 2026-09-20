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

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός θετικών κλασμάτων (Input)
  () => {
    const n1 = randInt(1, 3);
    const d1 = randInt(4, 5);
    const n2 = randInt(1, 3);
    const d2 = randInt(2, 3);
    const rawN = n1 * n2;
    const rawD = d1 * d2;
    const g = gcd(rawN, rawD);
    const redN = rawN / g;
    const redD = rawD / g;
    const ansStr = redD === 1 ? `${redN}` : `${redN}/${redD}`;
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ',
      question: `Υπολόγισε το γινόμενο σε ανάγωγο κλάσμα: (${htmlFrac(n1, d1)}) · (${htmlFrac(n2, d2)})`,
      correctAnswer: ansStr,
      solution: `Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή: (${n1} · ${n2}) / (${d1} · ${d2}) ＝ ${htmlFrac(rawN, rawD)}${g > 1 ? ` ＝ ${htmlFrac(redN, redD)} μετά από διαίρεση με το ${g}` : ''}.`,
    };
  },

  // 2. Πολλαπλασιασμός ομόσημων αρνητικών κλασμάτων (Input)
  () => {
    const n1 = 2;
    const d1 = 3;
    const n2 = 4;
    const d2 = 5;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΑ ΑΡΝΗΤΙΚΑ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-n1, d1)}) · (${htmlFrac(-n2, d2)})`,
      correctAnswer: '8/15',
      solution: `Το γινόμενο δύο ομόσημων αρνητικών αριθμών είναι θετικό (－ · － ＝ ＋): (2 · 4) / (3 · 5) ＝ ${htmlFrac(8, 15)}.`,
    };
  },

  // 3. Πολλαπλασιασμός ετερόσημων κλασμάτων (Input)
  () => {
    const n1 = 3;
    const d1 = 4;
    const n2 = 2;
    const d2 = 5;
    // 3/4 * (-2/5) = -6/20 = -3/10
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(n1, d1)}) · (${htmlFrac(-n2, d2)})`,
      correctAnswer: '-3/10',
      solution: `Το γινόμενο ετερόσημων είναι αρνητικό (＋ · － ＝ －): －(3 · 2) / (4 · 5) ＝ －6/20 ＝ ${htmlFrac(-3, 10)} μετά από διαίρεση με το 2.`,
    };
  },

  // 4. Εύρεση αντιστρόφου κλάσματος (Input)
  () => {
    const n = randInt(2, 7);
    const d = randInt(8, 13);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΟΣ ΡΗΤΟΣ',
      question: `Ποιος είναι ο αντίστροφος αριθμός του κλάσματος ${htmlFrac(n, d)}; (μορφή α/β):`,
      correctAnswer: `${d}/${n}`,
      solution: `Ο αντίστροφος του ${htmlFrac(n, d)} προκύπτει αντιστρέφοντας τους όρους: ${htmlFrac(d, n)} (καθώς ${htmlFrac(n, d)} · ${htmlFrac(d, n)} ＝ 1).`,
    };
  },

  // 5. Εύρεση αντιστρόφου αρνητικού κλάσματος (Input)
  () => {
    const n = 3;
    const d = 5;
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΟΣ ΑΡΝΗΤΙΚΟΥ',
      question: `Ποιος είναι ο αντίστροφος αριθμός του αρνητικού κλάσματος ${htmlFrac(-n, d)};`,
      correctAnswer: '-5/3',
      solution: `Ο αντίστροφος διατηρεί πάντοτε το ίδιο πρόσημο: ${htmlFrac(-d, n)}.`,
    };
  },

  // 6. Γινόμενο αντίστροφων ρητών (Input)
  () => {
    const a = randInt(4, 9);
    const b = randInt(11, 19);
    return {
      type: 'input',
      topic: 'ΓΙΝΟΜΕΝΟ ΑΝΤΙΣΤΡΟΦΩΝ',
      question: `Υπολόγισε το αποτέλεσμα: (${htmlFrac(-a, b)}) · (${htmlFrac(-b, a)})`,
      correctAnswer: '1',
      solution: `Το γινόμενο δύο αντίστροφων αριθμών ισούται πάντοτε με 1.`,
    };
  },

  // 7. Πολλαπλασιασμός δεκαδικών με ίδιο πρόσημο (Input)
  () => {
    // (-1,2) * (-0,3) = 0,36
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ',
      question: `Υπολόγισε το αποτέλεσμα: (－1,2) · (－0,3)`,
      correctAnswer: '0,36',
      solution: `Το πρόσημο είναι θετικό (－ · － ＝ ＋). Πολλαπλασιάζουμε 12 · 3 ＝ 36 και χωρίζουμε 2 δεκαδικά ψηφία: 0,36.`,
    };
  },

  // 8. Πολλαπλασιασμός ετερόσημων δεκαδικών (Input)
  () => {
    // (+2,5) * (-0,4) = -1,00 = -1
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ',
      question: `Υπολόγισε το αποτέλεσμα: (＋2,5) · (－0,4)`,
      correctAnswer: '-1',
      solution: `Το πρόσημο είναι αρνητικό. 25 · 4 ＝ 100 με 2 δεκαδικά ψηφία: －1,00 ＝ －1.`,
    };
  },

  // 9. Πολλαπλασιασμός με το μηδέν (Input)
  () => {
    const a = -8;
    const b = 13;
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε το γινόμενο: (${htmlFrac(a, b)}) · 0`,
      correctAnswer: '0',
      solution: `Κάθε ρητός αριθμός πολλαπλασιαζόμενος με το 0 δίνει 0.`,
    };
  },

  // 10. Αναγνώριση επιμεριστικής ιδιότητας (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question: `Ποια από τις παρακάτω ισότητες εκφράζει την επιμεριστική ιδιότητα του πολλαπλασιασμού;`,
      options: makeUniqueOptions(
        'α · (β ＋ γ) ＝ α · β ＋ α · γ',
        [
          'α · (β · γ) ＝ (α · β) · γ',
          'α · β ＝ β · α',
          'α · 1 ＝ α',
        ]
      ),
      correctAnswer: 'α · (β ＋ γ) ＝ α · β ＋ α · γ',
      solution: `Η επιμεριστική ιδιότητα επιμερίζει τον πολλαπλασιασμό ως προς την πρόσθεση: α · (β ＋ γ) ＝ α · β ＋ α · γ.`,
    };
  },

  // 11. Πολλαπλασιασμός ακέραιου με κλάσμα (Input)
  () => {
    // 3 * (2/9) = 6/9 = 2/3
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: 3 · (${htmlFrac(2, 9)})`,
      correctAnswer: '2/3',
      solution: `(3 · 2) / 9 ＝ 6/9 ＝ ${htmlFrac(2, 3)} μετά από διαίρεση με το 3.`,
    };
  },

  // 12. Απλοποίηση με διαίρεση πριν το γινόμενο (Input)
  () => {
    // (4/7) * (7/12) = 4/12 = 1/3
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ ΧΙΑΣΤΙ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(4, 7)}) · (${htmlFrac(7, 12)})`,
      correctAnswer: '1/3',
      solution: `Διαιρούμε τα 7 με το 7 και μένει 4/12 ＝ ${htmlFrac(1, 3)} μετά από διαίρεση με το 4.`,
    };
  },

  // 13. Αντίστροφος ακέραιου αριθμού (Input)
  () => {
    const n = randInt(3, 8);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΟΣ ΑΚΕΡΑΙΟΥ',
      question: `Ποιος είναι ο αντίστροφος του ακέραιου αριθμού <strong>${n}</strong> (μορφή α/β);`,
      correctAnswer: `1/${n}`,
      solution: `Ο ακέραιος ${n} γράφεται ${htmlFrac(n, 1)}, επομένως ο αντίστροφός του είναι το ${htmlFrac(1, n)}.`,
    };
  },

  // 14. Πολλαπλασιασμός τριών παραγόντων (Input)
  () => {
    // (-1/2) * (-2/3) * (-3/4) = -6/24 = -1/4
    return {
      type: 'input',
      topic: 'ΤΡΕΙΣ ΠΑΡΑΓΟΝΤΕΣ',
      question: `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-1, 2)}) · (${htmlFrac(-2, 3)}) · (${htmlFrac(-3, 4)})`,
      correctAnswer: '-1/4',
      solution: `Υπάρχουν 3 αρνητικοί παράγοντες (περιττό πλήθος), άρα το τελικό πρόσημο είναι αρνητικό: －(1 · 2 · 3) / (2 · 3 · 4) ＝ －6/24 ＝ ${htmlFrac(-1, 4)}.`,
    };
  },

  // 15. Αντίστροφος του 0 (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΝΤΙΣΤΡΟΦΟΣ ΤΟΥ ΜΗΔΕΝΟΣ',
      question: `Ποιος είναι ο αντίστροφος αριθμός του μηδενός (0);`,
      options: makeUniqueOptions(
        'Το μηδέν δεν έχει αντίστροφο αριθμό',
        ['Το 0', 'Το 1', 'Το －1']
      ),
      correctAnswer: 'Το μηδέν δεν έχει αντίστροφο αριθμό',
      solution: `Δεν υπάρχει αριθμός που πολλαπλασιαζόμενος με το 0 να δίνει 1, επομένως το μηδέν δεν έχει αντίστροφο.`,
    };
  },

  // 16. Υπολογισμός με επιμεριστική (Input)
  () => {
    // 6 * (1/2 + 1/3) = 6*(1/2) + 6*(1/3) = 3 + 2 = 5
    return {
      type: 'input',
      topic: 'ΕΦΑΡΜΟΓΗ ΕΠΙΜΕΡΙΣΤΙΚΗΣ',
      question: `Υπολόγισε την τιμή της παράστασης: 6 · [(${htmlFrac(1, 2)}) ＋ (${htmlFrac(1, 3)})]`,
      correctAnswer: '5',
      solution: `Εφαρμόζουμε επιμεριστική ιδιότητα: 6 · (${htmlFrac(1, 2)}) ＋ 6 · (${htmlFrac(1, 3)}) ＝ 3 ＋ 2 ＝ 5.`,
    };
  },

  // 17. Πολλαπλασιασμός με το 1 (Input)
  () => {
    const a = -5;
    const b = 11;
    return {
      type: 'input',
      topic: 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε το γινόμενο: (${htmlFrac(a, b)}) · 1`,
      correctAnswer: `${a}/${b}`,
      solution: `Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού: ${htmlFrac(a, b)}.`,
    };
  },

  // 18. Πρόσημο γινομένου με 4 παράγοντες (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΠΡΟΣΗΜΟ ΠΟΛΛΑΠΛΩΝ ΠΑΡΑΓΟΝΤΩΝ',
      question: `Τι πρόσημο έχει το γινόμενο τεσσάρων αρνητικών ρητών αριθμών;`,
      options: makeUniqueOptions(
        'Θετικό (＋), γιατί το πλήθος των αρνητικών παραγόντων είναι άρτιο (4)',
        [
          'Αρνητικό (－), γιατί όλοι οι παράγοντες είναι αρνητικοί',
          'Μηδέν',
          'Εξαρτάται από τις απόλυτες τιμές',
        ]
      ),
      correctAnswer: 'Θετικό (＋), γιατί το πλήθος των αρνητικών παραγόντων είναι άρτιο (4)',
      solution: `Άρτιο πλήθος αρνητικών παραγόντων δίνει πάντοτε θετικό γινόμενο: (－) · (－) · (－) · (－) ＝ ＋.`,
    };
  },

  // 19. Πολλαπλασιασμός δεκαδικού με 10 (Input)
  () => {
    // (-0.45) * 10 = -4.5
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ 10',
      question: `Υπολόγισε το αποτέλεσμα: (－0,45) · 10`,
      correctAnswer: '-4,5',
      solution: `Μετακινούμε την υποδιαστολή μία θέση δεξιά διατηρώντας το πρόσημο: －4,5.`,
    };
  },

  // 20. Αντίστροφος δεκαδικού αριθμού (Input)
  () => {
    // Αντίστροφος του 0.5 = 1/0.5 = 2
    return {
      type: 'input',
      topic: 'ΑΝΤΙΣΤΡΟΦΟΣ ΔΕΚΑΔΙΚΟΥ',
      question: `Ποιος είναι ο αντίστροφος αριθμός του δεκαδικού <strong>0,5</strong>;`,
      correctAnswer: '2',
      solution: `0,5 ＝ ${htmlFrac(1, 2)}, επομένως ο αντίστροφός του είναι το ${htmlFrac(2, 1)} ＝ 2.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Κλασματικό μέρος ποσού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ',
      question: `Ο Γιάννης είχε 60 € και ξόδεψε τα ${htmlFrac(3, 4)} των χρημάτων του. Πόσα ευρώ ξόδεψε;`,
      correctAnswer: '45',
      solution: `Υπολογίζουμε το γινόμενο: 60 · (${htmlFrac(3, 4)}) ＝ (60 · 3) / 4 ＝ 180 / 4 ＝ 45 €.`,
    };
  },

  // Πρόβλημα 2: Εμβαδόν ορθογωνίου με κλάσματα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο έχει μήκος ${htmlFrac(3, 2)} μέτρα και πλάτος ${htmlFrac(4, 5)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '6/5',
      solution: `Εμβαδόν ＝ μήκος · πλάτος ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(4, 5)}) ＝ 12/10 ＝ ${htmlFrac(6, 5)} τ.μ. μετά από διαίρεση με το 2.`,
    };
  },

  // Πρόβλημα 3: Συνταγή μαγειρικής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Μια συνταγή απαιτεί ${htmlFrac(2, 3)} του κιλού αλεύρι για 1 δόση. Πόσα κιλά αλεύρι θα χρειαστούν για 3 δόσεις;`,
      correctAnswer: '2',
      solution: `3 · (${htmlFrac(2, 3)}) ＝ 6/3 ＝ 2 kg.`,
    };
  },

  // Πρόβλημα 4: Υπολογισμός έκπτωσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα μπουφάν κοστίζει 80 € και προσφέρεται με έκπτωση 0,25 (δηλαδή 25%). Πόσα ευρώ είναι η έκπτωση;`,
      correctAnswer: '20',
      solution: `80 · 0,25 ＝ 20 €.`,
    };
  },

  // Πρόβλημα 5: Διανυθείσα απόσταση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Ένα αυτοκίνητο κινείται με σταθερή ταχύτητα 90 km/h. Πόσα χιλιόμετρα θα διανύσει σε ${htmlFrac(2, 3)} της ώρας;`,
      correctAnswer: '60',
      solution: `Απόσταση ＝ 90 · (${htmlFrac(2, 3)}) ＝ 180 / 3 ＝ 60 km.`,
    };
  },

  // Πρόβλημα 6: Κλάσμα του κλάσματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ',
      question: `Σε ένα σχολείο τα ${htmlFrac(1, 2)} των μαθητών είναι κορίτσια και τα ${htmlFrac(1, 3)} των κοριτσιών παίζουν μπάσκετ. Ποιο κλάσμα του συνόλου των μαθητών είναι κορίτσια που παίζουν μπάσκετ (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/6',
      solution: `(${htmlFrac(1, 2)}) · (${htmlFrac(1, 3)}) ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // Πρόβλημα 7: Εμβαδόν με δεκαδικούς
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα οικόπεδο έχει διαστάσεις 12,5 μέτρα και 8,0 μέτρα. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;`,
      correctAnswer: '100',
      solution: `12,5 · 8 ＝ 100 τ.μ.`,
    };
  },

  // Πρόβλημα 8: Αξία αγοράς καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Ένας οδηγός έβαλε 20 λίτρα βενζίνης με τιμή 1,85 € το λίτρο. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: '37',
      solution: `20 · 1,85 ＝ 37 €.`,
    };
  },

  // Πρόβλημα 9: Συσκευασία υγρού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Γεμίσαμε 12 μπουκάλια χωρητικότητας ${htmlFrac(3, 4)} του λίτρου το καθένα. Πόσα λίτρα υγρού χρησιμοποιήθηκαν συνολικά;`,
      correctAnswer: '9',
      solution: `12 · (${htmlFrac(3, 4)}) ＝ 36 / 4 ＝ 9 λίτρα.`,
    };
  },

  // Πρόβλημα 10: Απώλεια βάρους
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΒΟΛΗ',
      question: `Ένας αθλητής έχανε σταθερά 0,8 kg την εβδομάδα (－0,8) για 4 εβδομάδες. Ποια ήταν η συνολική μεταβολή του βάρους του σε kg;`,
      correctAnswer: '-3,2',
      solution: `4 · (－0,8) ＝ －3,2 kg.`,
    };
  },

  // Πρόβλημα 11: Μερίδιο κληρονομιάς
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Από ένα αγρόκτημα αξίας 120.000 € ένας κληρονόμος έλαβε τα ${htmlFrac(2, 5)}. Πόσα ευρώ αντιστοιχούν στο μερίδιό του;`,
      correctAnswer: '48000',
      solution: `120000 · (${htmlFrac(2, 5)}) ＝ (120000 · 2) / 5 ＝ 240000 / 5 ＝ 48.000 €.`,
    };
  },

  // Πρόβλημα 12: Χρόνος εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένας τεχνικός εργάστηκε 5 ημέρες επί 4,5 ώρες την ημέρα. Πόσες ώρες εργάστηκε συνολικά;`,
      correctAnswer: '22,5',
      solution: `5 · 4,5 ＝ 22,5 ώρες.`,
    };
  },

  // Πρόβλημα 13: Αναλογία χαρτιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΑΡΤΙ',
      question: `Ένα πακέτο χαρτί ζυγίζει ${htmlFrac(5, 2)} kg. Πόσο ζυγίζουν 6 ίδια πακέτα;`,
      correctAnswer: '15',
      solution: `6 · (${htmlFrac(5, 2)}) ＝ 30 / 2 ＝ 15 kg.`,
    };
  },

  // Πρόβλημα 14: Μείωση θερμοκρασίας ανά ώρα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Τη νύχτα η θερμοκρασία έπεφτε κατά 1,5 °C κάθε ώρα (－1,5). Πόσους βαθμούς έπεσε συνολικά μετά από 6 ώρες;`,
      correctAnswer: '-9',
      solution: `6 · (－1,5) ＝ －9 °C.`,
    };
  },

  // Πρόβλημα 15: Μήκος κορδέλας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Κόψαμε 8 κομμάτια κορδέλας μήκους ${htmlFrac(3, 4)} του μέτρου το καθένα. Πόσα μέτρα κορδέλας κόπηκαν συνολικά;`,
      correctAnswer: '6',
      solution: `8 · (${htmlFrac(3, 4)}) ＝ 24 / 4 ＝ 6 μέτρα.`,
    };
  },

  // Πρόβλημα 16: Αξία φρούτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Αγοράστηκαν 3,5 kg πορτοκάλια προς 1,20 € το κιλό. Ποιο ήταν το συνολικό κόστος;`,
      correctAnswer: '4,2',
      solution: `3,5 · 1,2 ＝ 4,20 € (γράφεται 4,2).`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου ανά 100 km
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΥΤΟΚΙΝΗΤΟ',
      question: `Ένα όχημα καταναλώνει 6,5 λίτρα καυσίμου ανά 100 km. Πόσα λίτρα θα κάψει σε διαδρομή 300 km (δηλαδή 3 εκατοντάδες km);`,
      correctAnswer: '19,5',
      solution: `3 · 6,5 ＝ 19,5 λίτρα.`,
    };
  },

  // Πρόβλημα 18: Βάθος κατάδυσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΔΥΣΕΙΣ',
      question: `Ένας δύτης καταδύεται με ρυθμό 2,4 μέτρα το λεπτό (－2,4 m/min). Σε ποιο βάθος/υψόμετρο θα βρίσκεται μετά από 5 λεπτά;`,
      correctAnswer: '-12',
      solution: `5 · (－2,4) ＝ －12 m.`,
    };
  },

  // Πρόβλημα 19: Χωρητικότητα αποθήκης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ',
      question: `Μια αποθήκη χωράει 40 τόνους σιτάρι και γέμισε κατά τα ${htmlFrac(7, 8)}. Πόσοι τόνοι σιτάρι αποθηκεύτηκαν;`,
      correctAnswer: '35',
      solution: `40 · (${htmlFrac(7, 8)}) ＝ (40 · 7) / 8 ＝ 5 · 7 ＝ 35 τόνοι.`,
    };
  },

  // Πρόβλημα 20: Δόσεις αποπληρωμής
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΔΑΝΕΙΑ',
      question: `Κάθε μήνα αφαιρούνται από τον λογαριασμό 45,50 € για δάνειο (－45,5). Ποια είναι η συνολική χρέωση μετά από 10 μήνες;`,
      correctAnswer: '-455',
      solution: `10 · (－45,5) ＝ －455 €.`,
    };
  },
];

export default function PollaplasiasmosKlasmataAsk() {
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
      title="Ασκήσεις: Πολλαπλασιασμός Ρητών Αριθμών | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στον πολλαπλασιασμό ρητών αριθμών (κλάσματα και δεκαδικοί) για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/18-pollaplasiasmos-klasmata"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 16 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πολλαπλασιασμός Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία πολλαπλασιασμού/αντιστρόφων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. -3/10 ή 0,36"
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
