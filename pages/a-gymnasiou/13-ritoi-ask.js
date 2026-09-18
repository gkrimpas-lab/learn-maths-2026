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

// Helper για όμορφη κλασματική γραφή σε HTML string
const htmlFrac = (num, den, isNeg = false) => {
  const numericNeg = (typeof num === 'number' && num < 0) || (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;
  const absNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const absDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    showMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΕΤΑΤΡΟΠΩΝ & ΘΕΩΡΙΑΣ ΡΗΤΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Μετατροπή απλού κλάσματος σε δεκαδικό (Input)
  () => {
    const pairs = [
      { num: 1, den: 2, dec: '0,5' },
      { num: 1, den: 4, dec: '0,25' },
      { num: 3, den: 4, dec: '0,75' },
      { num: 1, den: 5, dec: '0,2' },
      { num: 2, den: 5, dec: '0,4' },
      { num: 3, den: 5, dec: '0,6' },
      { num: 4, den: 5, dec: '0,8' },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Μετάτρεψε το κλάσμα ${htmlFrac(item.num, item.den)} σε δεκαδικό αριθμό:`,
      correctAnswer: item.dec,
      solution: `Εκτελούμε τη διαίρεση: ${item.num} ： ${item.den} ＝ ${item.dec}.`,
    };
  },

  // 2. Μετατροπή αρνητικού κλάσματος σε δεκαδικό (Input)
  () => {
    const pairs = [
      { num: -3, den: 4, dec: '-0,75' },
      { num: -1, den: 2, dec: '-0,5' },
      { num: -3, den: 5, dec: '-0,6' },
      { num: -1, den: 4, dec: '-0,25' },
      { num: -7, den: 10, dec: '-0,7' },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟ ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Μετάτρεψε το αρνητικό κλάσμα ${htmlFrac(item.num, item.den)} σε δεκαδική μορφή:`,
      correctAnswer: item.dec,
      solution: `Το κλάσμα είναι αρνητικό. Διαιρούμε ${Math.abs(item.num)} ： ${item.den} ＝ ${item.dec.replace('-', '')} και βάζουμε το πρόσημο μείον: ${item.dec}.`,
    };
  },

  // 3. Μετατροπή δεκαδικού σε ανάγωγο κλάσμα (Input)
  () => {
    const items = [
      { dec: '0,5', num: 1, den: 2 },
      { dec: '0,25', num: 1, den: 4 },
      { dec: '0,75', num: 3, den: 4 },
      { dec: '0,2', num: 1, den: 5 },
      { dec: '0,4', num: 2, den: 5 },
      { dec: '0,6', num: 3, den: 5 },
      { dec: '0,8', num: 4, den: 5 },
    ];
    const item = items[randInt(0, items.length - 1)];
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      question: `Γράψε τον δεκαδικό αριθμό <strong>${item.dec}</strong> ως ανάγωγο κλάσμα (π.χ. 3/4):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: `${item.dec} ＝ ${htmlFrac(item.num * 2, item.den * 2)} ＝ ${htmlFrac(item.num, item.den)} (απλοποιημένο σε ανάγωγο).`,
    };
  },

  // 4. Μετατροπή αρνητικού δεκαδικού σε ανάγωγο κλάσμα (Input)
  () => {
    const items = [
      { dec: '-0,5', num: -1, den: 2 },
      { dec: '-0,25', num: -1, den: 4 },
      { dec: '-0,75', num: -3, den: 4 },
      { dec: '-0,2', num: -1, den: 5 },
      { dec: '-0,4', num: -2, den: 5 },
    ];
    const item = items[randInt(0, items.length - 1)];
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ ΣΕ ΚΛΑΣΜΑ',
      question: `Γράψε τον αριθμό <strong>${item.dec}</strong> ως ανάγωγο κλάσμα (π.χ. -3/4):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: `Το πρόσημο μείον μπαίνει μπροστά: ${item.dec} ＝ ${htmlFrac(item.num, item.den)}.`,
    };
  },

  // 5. Μετατροπή κλάσματος με παρονομαστή 10, 100 σε δεκαδικό (Input)
  () => {
    const num = randInt(11, 89);
    const den = 100;
    const dec = (num / den).toString().replace('.', ',');
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ',
      question: `Γράψε σε δεκαδική μορφή το κλάσμα ${htmlFrac(num, den)}:`,
      correctAnswer: dec,
      solution: `Διαιρούμε με το 100 μετακινώντας την υποδιαστολή δύο θέσεις αριστερά: ${num} ： 100 ＝ ${dec}.`,
    };
  },

  // 6. Πεπερασμένος ή περιοδικός δεκαδικός (MCQ)
  () => {
    const optionsPool = [
      { fNum: 1, fDen: 3, type: 'Περιοδικός δεκαδικός (0,333...)', wrong: 'Πεπερασμένος δεκαδικός (τελειώνει)' },
      { fNum: 1, fDen: 6, type: 'Περιοδικός δεκαδικός (0,166...)', wrong: 'Πεπερασμένος δεκαδικός (τελειώνει)' },
      { fNum: 3, fDen: 8, type: 'Πεπερασμένος δεκαδικός (0,375)', wrong: 'Περιοδικός δεκαδικός' },
      { fNum: 7, fDen: 20, type: 'Πεπερασμένος δεκαδικός (0,35)', wrong: 'Περιοδικός δεκαδικός' },
    ];
    const item = optionsPool[randInt(0, optionsPool.length - 1)];
    return {
      type: 'mcq',
      topic: 'ΠΕΠΕΡΑΣΜΕΝΟΙ & ΠΕΡΙΟΔΙΚΟΙ',
      question: `Τι είδους δεκαδικό αριθμό παράγει η διαίρεση του κλάσματος ${htmlFrac(item.fNum, item.fDen)};`,
      options: makeUniqueOptions(item.type, [item.wrong, 'Ακέραιο αριθμό', 'Μη πραγματικό αριθμό']),
      correctAnswer: item.type,
      solution: `Ο παρονομαστής καθορίζει τη μορφή. Το κλάσμα παράγει: ${item.type}.`,
    };
  },

  // 7. Ακέραιος ως ρητός αριθμός (Input)
  () => {
    const n = randInt(6, 25);
    return {
      type: 'input',
      topic: 'ΕΝΝΟΙΑ ΡΗΤΟΥ ΑΡΙΘΜΟΥ',
      question: `Αν γράψουμε τον ακέραιο <strong>－${n}</strong> στη μορφή κλάσματος με παρονομαστή το 1, ποιος είναι ο αριθμητής;`,
      correctAnswer: `-${n}`,
      solution: `Κάθε ακέραιος α γράφεται ως ${htmlFrac('α', '1')}. Άρα το －${n} γράφεται ${htmlFrac(-n, 1)} με αριθμητή το －${n}.`,
    };
  },

  // 8. Απλοποίηση κλάσματος σε ανάγωγο (Input)
  () => {
    const factor = randInt(2, 5);
    const redN = randInt(2, 7);
    const redD = randInt(8, 15);
    const g = gcd(redN, redD);
    const num = (redN / g) * factor;
    const den = (redD / g) * factor;
    const finalN = redN / g;
    const finalD = redD / g;
    return {
      type: 'input',
      topic: 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      question: `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`,
      correctAnswer: `${finalN}/${finalD}`,
      solution: `Διαιρούμε αριθμητή και παρονομαστή με τον ΜΚΔ (${factor * g}) και βρίσκουμε: ${htmlFrac(finalN, finalD)}.`,
    };
  },

  // 9. Ισοδύναμα κλάσματα με αρνητικό πρόσημο (MCQ)
  () => {
    const n = randInt(2, 5);
    const d = randInt(6, 9);
    const correct = `Το πλην μπορεί να τοποθετηθεί μπροστά από τη γραμμή, στον αριθμητή ή στον παρονομαστή`;
    const candidates = [
      `Το πλην επιτρέπεται να μπει μόνο στον αριθμητή`,
      `Το πλην επιτρέπεται να μπει μόνο στον παρονομαστή`,
      `Αν αλλάξει θέση το πλην, αλλάζει η τιμή του κλάσματος`,
    ];
    return {
      type: 'mcq',
      topic: 'ΠΡΟΣΗΜΟ ΚΛΑΣΜΑΤΟΣ',
      question: `Ποια από τις παρακάτω προτάσεις για το πρόσημο ενός αρνητικού κλάσματος ${htmlFrac(-n, d)} είναι σωστή;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Ισχύει πάντοτε: －${htmlFrac('α', 'β')} ＝ ${htmlFrac('－α', 'β')} ＝ ${htmlFrac('α', '－β')}.`,
    };
  },

  // 10. Δεκαδικός με ακέραιο μέρος σε κλάσμα (Input)
  () => {
    const items = [
      { dec: '1,5', num: 3, den: 2 },
      { dec: '2,5', num: 5, den: 2 },
      { dec: '1,25', num: 5, den: 4 },
      { dec: '1,2', num: 6, den: 5 },
      { dec: '1,75', num: 7, den: 4 },
    ];
    const item = items[randInt(0, items.length - 1)];
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      question: `Μετάτρεψε τον αριθμό <strong>${item.dec}</strong> σε ανάγωγο κλάσμα (π.χ. 3/2):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: `${item.dec} ＝ ${htmlFrac(item.dec.replace(',', ''), Math.pow(10, item.dec.split(',')[1].length))} ＝ ${htmlFrac(item.num, item.den)} (ανάγωγο).`,
    };
  },

  // 11. Ποιοι αριθμοί ανήκουν στο σύνολο ℚ (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ: ΤΟ ΣΥΝΟΛΟ Q',
      question: `Ποιοι από τους παρακάτω αριθμούς είναι ρητοί αριθμοί;`,
      options: makeUniqueOptions(
        'Όλοι οι ακέραιοι, τα κλάσματα και οι πεπερασμένοι/περιοδικοί δεκαδικοί',
        [
          'Μόνο οι θετικοί ακέραιοι αριθμοί',
          'Μόνο τα κλάσματα με θετικούς όρους',
          'Μόνο οι αριθμοί που δεν έχουν υποδιαστολή',
        ]
      ),
      correctAnswer: 'Όλοι οι ακέραιοι, τα κλάσματα και οι πεπερασμένοι/περιοδικοί δεκαδικοί',
      solution: `Το σύνολο των ρητών ℚ περιλαμβάνει όλους τους αριθμούς που μπορούν να γραφούν ως πηλίκο δύο ακεραίων (α/β με β≠0).`,
    };
  },

  // 12. Μετατροπή κλάσματος σε εκατοστά (Input)
  () => {
    const pairs = [
      { num: 1, den: 4, dec: '0,25' },
      { num: 3, den: 20, dec: '0,15' },
      { num: 7, den: 25, dec: '0,28' },
      { num: 9, den: 50, dec: '0,18' },
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Υπολόγισε τη δεκαδική μορφή του κλάσματος ${htmlFrac(item.num, item.den)}:`,
      correctAnswer: item.dec,
      solution: `Πολλαπλασιάζουμε κατάλληλα ώστε ο παρονομαστής να γίνει 100 ή διαιρούμε απευθείας: ${item.num} ： ${item.den} ＝ ${item.dec}.`,
    };
  },

  // 13. Εύρεση ίσου κλάσματος με δεδομένο παρονομαστή (Input)
  () => {
    const num = randInt(2, 4);
    const den = 5;
    const targetDen = 100;
    const mult = targetDen / den;
    const targetNum = num * mult;
    return {
      type: 'input',
      topic: 'ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Συμπλήρωσε τον αριθμητή x ώστε να ισχύει: ${htmlFrac(num, den)} ＝ ${htmlFrac('x', targetDen)}`,
      correctAnswer: targetNum.toString(),
      solution: `Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το ${mult}: x ＝ ${num} · ${mult} ＝ ${targetNum}.`,
    };
  },

  // 14. Μετατροπή δεκαδικού 3 δεκαδικών ψηφίων σε κλάσμα (Input)
  () => {
    const items = [
      { dec: '0,125', num: 1, den: 8 },
      { dec: '0,375', num: 3, den: 8 },
      { dec: '0,625', num: 5, den: 8 },
      { dec: '0,875', num: 7, den: 8 },
    ];
    const item = items[randInt(0, items.length - 1)];
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      question: `Γράψε τον δεκαδικό αριθμό <strong>${item.dec}</strong> ως ανάγωγο κλάσμα (π.χ. 1/8):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: `${item.dec} ＝ ${htmlFrac(item.dec.replace('0,', ''), '1000')} ＝ ${htmlFrac(item.num, item.den)} μετά από διαίρεση με το 125.`,
    };
  },

  // 15. Αντίθετος ρητού αριθμού (Input)
  () => {
    const dec = '0,65';
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΡΗΤΟΙ',
      question: `Ποιος είναι ο αντίθετος ρητός αριθμός του <strong>＋${dec}</strong>;`,
      correctAnswer: `-${dec}`,
      solution: `Ο αντίθετος έχει ακριβώς το αντίθετο πρόσημο: －${dec}.`,
    };
  },

  // 16. Απόλυτη τιμή αρνητικού κλάσματος (Input)
  () => {
    const n = randInt(3, 7);
    const d = randInt(8, 12);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ ΡΗΤΟΥ',
      question: `Υπολόγισε την απόλυτη τιμή: |${htmlFrac(-n, d)}| (μορφή α/β):`,
      correctAnswer: `${n}/${d}`,
      solution: `Η απόλυτη τιμή οποιουδήποτε αριθμού είναι μη αρνητική: |${htmlFrac(-n, d)}| ＝ ${htmlFrac(n, d)}.`,
    };
  },

  // 17. Κριτήριο διαιρετότητας παρονομαστή για πεπερασμένο δεκαδικό (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΑΡΟΝΟΜΑΣΤΩΝ',
      question: `Ποιους πρώτους παράγοντες επιτρέπεται να έχει ο παρονομαστής ενός ανάγωγου κλάσματος για να είναι πεπερασμένος δεκαδικός;`,
      options: makeUniqueOptions(
        'Μόνο το 2, μόνο το 5 ή και τα δύο (2 και 5)',
        [
          'Οποιουσδήποτε περιττούς πρώτους παράγοντες',
          'Μόνο το 3 και το 7',
          'Πρέπει να είναι υποχρεωτικά πρώτος αριθμός',
        ]
      ),
      correctAnswer: 'Μόνο το 2, μόνο το 5 ή και τα δύο (2 και 5)',
      solution: `Ένα ανάγωγο κλάσμα αναλύεται σε πεπερασμένο δεκαδικό μόνο όταν ο παρονομαστής του περιέχει αποκλειστικά πρώτους παράγοντες το 2 και το 5.`,
    };
  },

  // 18. Μετατροπή μηδενός σε κλασματική μορφή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΤΟ ΜΗΔΕΝ ΩΣ ΡΗΤΟΣ',
      question: `Ποια είναι η τιμή του κλάσματος ${htmlFrac('0', '7')};`,
      correctAnswer: '0',
      solution: `Το μηδέν διαιρούμενο με οποιονδήποτε μη μηδενικό αριθμό ισούται με 0: 0 ： 7 ＝ 0.`,
    };
  },

  // 19. Δεκαδικός αριθμός με αρνητικό πρόσημο και ακέραιο μέρος (Input)
  () => {
    const item = { dec: '-1,5', num: -3, den: 2 };
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ ΣΕ ΚΛΑΣΜΑ',
      question: `Γράψε τον αριθμό <strong>${item.dec}</strong> ως ανάγωγο κλάσμα (π.χ. -3/2):`,
      correctAnswer: `${item.num}/${item.den}`,
      solution: `${item.dec} ＝ ${htmlFrac('-15', '10')} ＝ ${htmlFrac(item.num, item.den)}.`,
    };
  },

  // 20. Σύγκριση κλάσματος και δεκαδικού (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΡΗΤΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ του κλάσματος ${htmlFrac('1', '4')} και του δεκαδικού 0,3;`,
      options: makeUniqueOptions(
        `${htmlFrac('1', '4')} ＜ 0,3`,
        [`${htmlFrac('1', '4')} ＞ 0,3`, `${htmlFrac('1', '4')} ＝ 0,3`, 'Δεν συγκρίνονται']
      ),
      correctAnswer: `${htmlFrac('1', '4')} ＜ 0,3`,
      solution: `${htmlFrac('1', '4')} ＝ 0,25. Επειδή 0,25 ＜ 0,3, ισχύει ${htmlFrac('1', '4')} ＜ 0,3.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΡΗΤΩΝ ΜΕ ΑΡΤΙΑ ΕΛΛΗΝΙΚΗ ΣΥΝΤΑΞΗ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ποσοστό επιτυχίας σε διαγώνισμα ως δεκαδικός
  () => {
    const total = 20;
    const correct = randInt(14, 18);
    const dec = (correct / total).toString().replace('.', ',');
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΔΟΣΗ',
      question: `Σε ένα τεστ μαθηματικών 20 ερωτήσεων η Δέσποινα απάντησε σωστά στις ${correct}. Ποιο είναι το δεκαδικό ποσοστό επιτυχίας της (δηλαδή το κλάσμα ${htmlFrac(correct, total)} σε δεκαδική μορφή);`,
      correctAnswer: dec,
      solution: `Διαιρούμε ${correct} ： ${total} ＝ ${dec}.`,
    };
  },

  // Πρόβλημα 2: Μοίρασμα πίτσας σε δεκαδικό
  () => {
    const pieces = randInt(2, 6);
    const total = 8;
    const dec = (pieces / total).toString().replace('.', ',');
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ',
      question: `Μια οικογενειακή πίτσα κόπηκε σε 8 ίσα κομμάτια. Ο Ανδρέας έφαγε τα ${pieces} κομμάτια. Ποιο μέρος της πίτσας κατανάλωσε γραμμένο ως δεκαδικός αριθμός;`,
      correctAnswer: dec,
      solution: `Το κλάσμα είναι ${htmlFrac(pieces, total)} ＝ ${pieces} ： 8 ＝ ${dec}.`,
    };
  },

  // Πρόβλημα 3: Μετατροπή ποσότητας συνταγής σε κλάσμα
  () => {
    const dec = '0,75';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Μια συνταγή ζαχαροπλαστικής απαιτεί 0,75 kg αλεύρι. Ποιο ανάγωγο κλάσμα του κιλού αντιστοιχεί σε αυτή την ποσότητα (π.χ. 3/4);`,
      correctAnswer: '3/4',
      solution: `0,75 ＝ ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')} kg.`,
    };
  },

  // Πρόβλημα 4: Χρόνος προπόνησης σε δεκαδική μορφή
  () => {
    const mins = 45;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένας αθλητής προπονήθηκε για 45 λεπτά της ώρας (δηλαδή τα ${htmlFrac('45', '60')} της ώρας). Πόσες ώρες διήρκεσε η προπόνησή του σε δεκαδική μορφή;`,
      correctAnswer: '0,75',
      solution: `45 ： 60 ＝ 0,75 ώρες.`,
    };
  },

  // Πρόβλημα 5: Βάρος φρούτων σε κλάσμα
  () => {
    const dec = '0,4';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Στη ζυγαριά ενός παντοπωλείου ένα πακέτο φράουλες ζυγίζει 0,4 kg. Ποιο είναι το βάρος του εκφρασμένο ως ανάγωγο κλάσμα του κιλού (π.χ. 2/5);`,
      correctAnswer: '2/5',
      solution: `0,4 ＝ ${htmlFrac('4', '10')} ＝ ${htmlFrac('2', '5')} kg.`,
    };
  },

  // Πρόβλημα 6: Στάθμη νερού σε δεξαμενή
  () => {
    const filled = randInt(3, 7);
    const total = 10;
    const dec = (filled / total).toString().replace('.', ',');
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Μια δεξαμενή νερού είναι γεμάτη κατά τα ${htmlFrac(filled, total)} της χωρητικότητάς της. Ποιος δεκαδικός αριθμός εκφράζει το ποσοστό πλήρωσης της δεξαμενής;`,
      correctAnswer: dec,
      solution: `${filled} ： 10 ＝ ${dec}.`,
    };
  },

  // Πρόβλημα 7: Χρηματικό ποσό σε κλάσμα του ευρώ
  () => {
    const cents = 25;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κέρμα των 25 λεπτών αντιστοιχεί σε 0,25 €. Ποιο ανάγωγο κλάσμα του ευρώ αντιπροσωπεύει (π.χ. 1/4);`,
      correctAnswer: '1/4',
      solution: `0,25 ＝ ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')} €.`,
    };
  },

  // Πρόβλημα 8: Μήκος υφάσματος σε δεκαδικό
  () => {
    const num = 3;
    const den = 2;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Μια μοδίστρα χρειάζεται ${htmlFrac(num, den)} μέτρα υφάσματος για να ράψει μια κουρτίνα. Πόσα μέτρα είναι αυτό σε δεκαδική μορφή;`,
      correctAnswer: '1,5',
      solution: `3 ： 2 ＝ 1,5 μέτρα.`,
    };
  },

  // Πρόβλημα 9: Υπολειπόμενη μπαταρία σε κλάσμα
  () => {
    const dec = '0,8';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Το κινητό τηλέφωνο του Μιχάλη δείχνει στάθμη μπαταρίας 0,8 (80%). Ποιο ανάγωγο κλάσμα εκφράζει την υπόλοιπη ενέργεια της μπαταρίας (π.χ. 4/5);`,
      correctAnswer: '4/5',
      solution: `0,8 ＝ ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 10: Απόσταση διαδρομής σε δεκαδικό
  () => {
    const num = 7;
    const den = 4;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΗ',
      question: `Ο Γιώργος διένυσε με το ποδήλατό του απόσταση ${htmlFrac(num, den)} km. Πόσα χιλιόμετρα διένυσε σε δεκαδική μορφή;`,
      correctAnswer: '1,75',
      solution: `7 ： 4 ＝ 1,75 km.`,
    };
  },

  // Πρόβλημα 11: Μερίδιο κληρονομιάς σε κλάσμα
  () => {
    const dec = '0,125';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Σε μια συμφωνία ένας συνέταιρος λαμβάνει το 0,125 των κερδών. Ποιο ανάγωγο κλάσμα των κερδών του αναλογεί (π.χ. 1/8);`,
      correctAnswer: '1/8',
      solution: `0,125 ＝ ${htmlFrac('125', '1000')} ＝ ${htmlFrac('1', '8')}.`,
    };
  },

  // Πρόβλημα 12: Ποσότητα λαδιού σε δοχείο
  () => {
    const num = 1;
    const den = 8;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Σε ένα μπουκάλι έχει απομείνει το ${htmlFrac(num, den)} του λίτρου ελαιόλαδο. Πόσα λίτρα είναι η ποσότητα αυτή σε δεκαδική μορφή;`,
      correctAnswer: '0,125',
      solution: `1 ： 8 ＝ 0,125 λίτρα.`,
    };
  },

  // Πρόβλημα 13: Έκπτωση καταστήματος σε κλάσμα
  () => {
    const dec = '0,2';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κατάστημα ρούχων προσφέρει έκπτωση 0,2 (δηλαδή 20%) στην αρχική τιμή. Ποιο ανάγωγο κλάσμα της αρχικής τιμής αφαιρείται (π.χ. 1/5);`,
      correctAnswer: '1/5',
      solution: `0,2 ＝ ${htmlFrac('2', '10')} ＝ ${htmlFrac('1', '5')}.`,
    };
  },

  // Πρόβλημα 14: Διάρκεια διαλείμματος σε δεκαδικό μέρος της ώρας
  () => {
    const mins = 15;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Το σχολικό διάλειμμα διαρκεί 15 λεπτά (δηλαδή τα ${htmlFrac('15', '60')} της ώρας). Ποιο δεκαδικό μέρος της ώρας διαρκεί το διάλειμμα;`,
      correctAnswer: '0,25',
      solution: `15 ： 60 ＝ 0,25 ώρες.`,
    };
  },

  // Πρόβλημα 15: Ποσοστό επιτυχών βολών στο μπάσκετ
  () => {
    const success = randInt(3, 7);
    const total = 10;
    const dec = (success / total).toString().replace('.', ',');
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ένας μπασκετμπολίστας ευστόχησε σε ${success} από τις 10 ελεύθερες βολές που εκτέλεσε. Ποιο είναι το δεκαδικό ποσοστό ευστοχίας του;`,
      correctAnswer: dec,
      solution: `${success} ： 10 ＝ ${dec}.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο οικοπέδου σε κλάσμα
  () => {
    const dec = '0,375';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ',
      question: `Ένας ιδιοκτήτης κατέχει το 0,375 ενός οικοπέδου. Ποιο ανάγωγο κλάσμα του οικοπέδου τού ανήκει (π.χ. 3/8);`,
      correctAnswer: '3/8',
      solution: `0,375 ＝ ${htmlFrac('375', '1000')} ＝ ${htmlFrac('3', '8')}.`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου σε δεκαδικό
  () => {
    const num = 1;
    const den = 5;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Στο ταξίδι καταναλώθηκε το ${htmlFrac(num, den)} του καυσίμου του ρεζερβουάρ. Ποιο δεκαδικό μέρος του ντεπόζιτου αδειάστηκε;`,
      correctAnswer: '0,2',
      solution: `1 ： 5 ＝ 0,2.`,
    };
  },

  // Πρόβλημα 18: Βάρος τυριού σε κλάσμα
  () => {
    const dec = '0,6';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ένα κομμάτι γραβιέρα ζυγίζει 0,6 kg. Ποιο είναι το βάρος του σε ανάγωγο κλάσμα του κιλού (π.χ. 3/5);`,
      correctAnswer: '3/5',
      solution: `0,6 ＝ ${htmlFrac('6', '10')} ＝ ${htmlFrac('3', '5')} kg.`,
    };
  },

  // Πρόβλημα 19: Χρόνος ταξιδιού με τρένο σε δεκαδικό
  () => {
    const num = 5;
    const den = 2;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ',
      question: `Το ταξίδι με το τρένο διήρκεσε ${htmlFrac(num, den)} ώρες. Πόσες ώρες διήρκεσε εκφρασμένο σε δεκαδική μορφή;`,
      correctAnswer: '2,5',
      solution: `5 ： 2 ＝ 2,5 ώρες.`,
    };
  },

  // Πρόβλημα 20: Ποσοστό έκπτωσης σε κλάσμα
  () => {
    const dec = '0,15';
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Σε μια εποχική προσφορά παρέχεται έκπτωση 0,15 επί της αρχικής τιμής. Ποιο ανάγωγο κλάσμα αντιστοιχεί σε αυτή την έκπτωση (π.χ. 3/20);`,
      correctAnswer: '3/20',
      solution: `0,15 ＝ ${htmlFrac('15', '100')} ＝ ${htmlFrac('3', '20')}.`,
    };
  },
];

export default function RitoiAsk() {
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
      title="Ασκήσεις: Ρητοί Αριθμοί | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην έννοια των ρητών αριθμών και τις μετατροπές κλασμάτων και δεκαδικών."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/13-ritoi"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 11 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Η Έννοια των Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία μετατροπών + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="π.χ. 0,75 ή 3/4"
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
