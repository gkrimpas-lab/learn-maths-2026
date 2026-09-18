import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[i], arr[j]];
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

// Helper για αυθεντική κλασματική γραφή σε HTML string με πρόσημο μπροστά από τη γραμμή
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΙΣΟΔΥΝΑΜΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση αγνώστου αριθμητή με διαστολή (Input)
  () => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const k = randInt(2, 6);
    const newDen = b * k;
    const ans = a * k;
    return {
      type: 'input',
      topic: 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ',
      question: `Συμπλήρωσε τον αριθμητή x ώστε τα κλάσματα να είναι ισοδύναμα: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: `Ο παρονομαστής πολλαπλασιάστηκε με το ${k} (${b} · ${k} ＝ ${newDen}). Πολλαπλασιάζουμε και τον αριθμητή: x ＝ ${a} · ${k} ＝ ${ans}.`,
    };
  },

  // 2. Εύρεση αγνώστου παρονομαστή με διαστολή (Input)
  () => {
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const k = randInt(2, 5);
    const newNum = a * k;
    const ans = b * k;
    return {
      type: 'input',
      topic: 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ',
      question: `Συμπλήρωσε τον παρονομαστή y ώστε τα κλάσματα να είναι ισοδύναμα: ${htmlFrac(a, b)} ＝ ${htmlFrac(newNum, 'y')}`,
      correctAnswer: ans.toString(),
      solution: `Ο αριθμητής πολλαπλασιάστηκε με το ${k} (${a} · ${k} ＝ ${newNum}). Πολλαπλασιάζουμε και τον παρονομαστή: y ＝ ${b} · ${k} ＝ ${ans}.`,
    };
  },

  // 3. Απλοποίηση σε ανάγωγο κλάσμα (Input)
  () => {
    const baseN = randInt(2, 5);
    const baseD = randInt(baseN + 1, 9);
    const g = gcd(baseN, baseD);
    const redN = baseN / g;
    const redD = baseD / g;
    const k = randInt(2, 5);
    const num = redN * k;
    const den = redD * k;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ ΣΕ ΑΝΑΓΩΓΟ',
      question: `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`,
      correctAnswer: `${redN}/${redD}`,
      solution: `Διαιρούμε αριθμητή και παρονομαστή με τον ΜΚΔ(${num}, ${den}) ＝ ${k * g}: ${num} ： ${k * g} ＝ ${redN} και ${den} ： ${k * g} ＝ ${redD}. Άρα ${htmlFrac(redN, redD)}.`,
    };
  },

  // 4. Έλεγχος ισοδυναμίας με χιαστί γινόμενα (MCQ)
  () => {
    const a = 3;
    const b = 4;
    const k = 3;
    const c = a * k;
    const d = b * k;
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ',
      question: `Είναι τα κλάσματα ${htmlFrac(a, b)} και ${htmlFrac(c, d)} ισοδύναμα;`,
      options: makeUniqueOptions(
        'Ναι, γιατί τα χιαστί γινόμενα είναι ίσα (3 · 12 ＝ 4 · 9 ＝ 36)',
        [
          'Όχι, γιατί έχουν διαφορετικούς όρους',
          'Όχι, γιατί 3 · 9 ≠ 4 · 12',
          'Μόνο αν είναι και τα δύο αρνητικά',
        ]
      ),
      correctAnswer: 'Ναι, γιατί τα χιαστί γινόμενα είναι ίσα (3 · 12 ＝ 4 · 9 ＝ 36)',
      solution: `Ελέγχουμε τα χιαστί γινόμενα: ${a} · ${d} ＝ ${a * d} και ${b} · ${c} ＝ ${b * c}. Επειδή είναι ίσα, τα κλάσματα είναι ισοδύναμα.`,
    };
  },

  // 5. Εύρεση άγνωστου με χιαστί γινόμενα (Input)
  () => {
    const a = randInt(3, 7);
    const b = randInt(4, 9);
    const k = randInt(2, 4);
    const c = a * k;
    const ans = b * k;
    return {
      type: 'input',
      topic: 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ',
      question: `Υπολόγισε τον άγνωστο x από την αναλογία: ${htmlFrac(a, b)} ＝ ${htmlFrac(c, 'x')}`,
      correctAnswer: ans.toString(),
      solution: `Εφαρμόζουμε χιαστί γινόμενα: ${a} · x ＝ ${b} · ${c} ⇔ ${a} · x ＝ ${b * c} ⇔ x ＝ ${b * c} ： ${a} ＝ ${ans}.`,
    };
  },

  // 6. Ισοδύναμο κλάσμα με αρνητικό πρόσημο (Input)
  () => {
    const a = 2;
    const b = 5;
    const k = randInt(2, 5);
    const newDen = b * k;
    const ans = -(a * k);
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΑ ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ',
      question: `Συμπλήρωσε τον ακέραιο x ώστε: ${htmlFrac(-a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: `Διατηρούμε το αρνητικό πρόσημο: x ＝ (－${a}) · ${k} ＝ ${ans}.`,
    };
  },

  // 7. Πότε ένα κλάσμα λέγεται ανάγωγο (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ: ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      question: `Πότε ένα κλάσμα ${htmlFrac('α', 'β')} ονομάζεται ανάγωγο;`,
      options: makeUniqueOptions(
        'Όταν ο αριθμητής και ο παρονομαστής έχουν ΜΚΔ ＝ 1 (πρώτοι μεταξύ τους)',
        [
          'Όταν ο αριθμητής είναι μικρότερος από τον παρονομαστή',
          'Όταν ο παρονομαστής είναι πρώτος αριθμός',
          'Όταν δεν έχει δεκαδικό μέρος',
        ]
      ),
      correctAnswer: 'Όταν ο αριθμητής και ο παρονομαστής έχουν ΜΚΔ ＝ 1 (πρώτοι μεταξύ τους)',
      solution: `Ανάγωγο είναι το κλάσμα που δεν απλοποιείται άλλο, δηλαδή όταν ο αριθμητής και ο παρονομαστής έχουν μοναδικό κοινό διαιρέτη το 1.`,
    };
  },

  // 8. Απλοποίηση καταχρηστικού κλάσματος (α > β) σε ανάγωγο (Input)
  () => {
    const redN = randInt(5, 8);
    const redD = randInt(2, 4);
    const k = randInt(2, 4);
    const num = redN * k;
    const den = redD * k;
    return {
      type: 'input',
      topic: 'ΚΑΤΑΧΡΗΣΤΙΚΑ ΚΛΑΣΜΑΤΑ',
      question: `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`,
      correctAnswer: `${redN}/${redD}`,
      solution: `Διαιρούμε και τους δύο όρους με το ${k}: ${num} ： ${k} ＝ ${redN} και ${den} ： ${k} ＝ ${redD}. Άρα ${htmlFrac(redN, redD)}.`,
    };
  },

  // 9. Διαστολή με δεκαδικό παρονομαστή 100 (Input)
  () => {
    const a = randInt(3, 9);
    const b = 20;
    const targetDen = 100;
    const mult = targetDen / b; // 5
    const ans = a * mult;
    return {
      type: 'input',
      topic: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΕΚΑΤΟΣΤΑ',
      question: `Γράψε το κλάσμα ${htmlFrac(a, b)} ως ισοδύναμο με παρονομαστή το 100. Ποιος είναι ο αριθμητής;`,
      correctAnswer: ans.toString(),
      solution: `Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το 5: ${a} · 5 ＝ ${ans}. Το κλάσμα είναι ${htmlFrac(ans, 100)}.`,
    };
  },

  // 10. Μη ισοδύναμα κλάσματα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ',
      question: `Ποιο από τα παρακάτω ζεύγη κλασμάτων ΔΕΝ είναι ισοδύναμο;`,
      options: makeUniqueOptions(
        `${htmlFrac(2, 3)} και ${htmlFrac(4, 9)}`,
        [
          `${htmlFrac(1, 2)} και ${htmlFrac(4, 8)}`,
          `${htmlFrac(3, 5)} και ${htmlFrac(6, 10)}`,
          `${htmlFrac(4, 7)} και ${htmlFrac(12, 21)}`,
        ]
      ),
      correctAnswer: `${htmlFrac(2, 3)} και ${htmlFrac(4, 9)}`,
      solution: `Στο ζεύγος ${htmlFrac(2, 3)} και ${htmlFrac(4, 9)} τα χιαστί γινόμενα είναι 2 · 9 ＝ 18 και 3 · 4 ＝ 12 (18 ≠ 12), άρα δεν είναι ισοδύναμα.`,
    };
  },

  // 11. Διπλή διαστολή (Input)
  () => {
    const a = 1;
    const b = 3;
    const k = randInt(4, 8);
    const ans = a * k;
    const newDen = b * k;
    return {
      type: 'input',
      topic: 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ',
      question: `Βρες τον αριθμητή x ώστε: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: `x ＝ 1 · ${k} ＝ ${ans}.`,
    };
  },

  // 12. Απλοποίηση με μεγάλο κοινό διαιρέτη (Input)
  () => {
    const redN = randInt(2, 5);
    const redD = randInt(6, 11);
    const g = gcd(redN, redD);
    const n = redN / g;
    const d = redD / g;
    const k = 10;
    const num = n * k;
    const den = d * k;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ ΜΕ ΤΟ 10',
      question: `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} σε ανάγωγο (μορφή α/β):`,
      correctAnswer: `${n}/${d}`,
      solution: `Διαιρούμε αριθμητή και παρονομαστή με το 10: ${num} ： 10 ＝ ${n} και ${den} ： 10 ＝ ${d}. Άρα ${htmlFrac(n, d)}.`,
    };
  },

  // 13. Χιαστί γινόμενα με αρνητικούς αριθμούς (Input)
  () => {
    const a = -2;
    const b = 5;
    const ans = -10;
    return {
      type: 'input',
      topic: 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ & ΠΡΟΣΗΜΑ',
      question: `Αν ${htmlFrac(-2, 5)} ＝ ${htmlFrac('x', 25)}, ποια είναι η τιμή του x;`,
      correctAnswer: ans.toString(),
      solution: `5 · x ＝ (－2) · 25 ⇔ 5 · x ＝ －50 ⇔ x ＝ －10.`,
    };
  },

  // 14. Εύρεση του παράγοντα απλοποίησης (Input)
  () => {
    const k = randInt(3, 7);
    const a = 2 * k;
    const b = 5 * k;
    return {
      type: 'input',
      topic: 'ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ',
      question: `Με ποιον αριθμό πρέπει να διαιρεθούν και οι δύο όροι του κλάσματος ${htmlFrac(a, b)} για να προκύψει το ανάγωγο ${htmlFrac(2, 5)};`,
      correctAnswer: k.toString(),
      solution: `Ο αριθμητής ${a} διαιρείται με το ${k} για να δώσει 2 (${a} ： ${k} ＝ 2), άρα ο συντελεστής είναι το ${k}.`,
    };
  },

  // 15. Ισοδυναμία ακέραιου με κλάσμα (Input)
  () => {
    const whole = randInt(3, 7);
    const den = randInt(2, 5);
    const ans = whole * den;
    return {
      type: 'input',
      topic: 'ΑΚΕΡΑΙΟΣ ΩΣ ΚΛΑΣΜΑ',
      question: `Γράψε τον ακέραιο <strong>${whole}</strong> ως ισοδύναμο κλάσμα με παρονομαστή το ${den}. Ποιος είναι ο αριθμητής;`,
      correctAnswer: ans.toString(),
      solution: `Ισχύει ${whole} ＝ ${htmlFrac(whole, 1)} ＝ ${htmlFrac(whole * den, den)}. Ο αριθμητής είναι ${ans}.`,
    };
  },

  // 16. Έλεγχος ισότητας τριών κλασμάτων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΛΥΣΙΔΑ ΙΣΟΔΥΝΑΜΩΝ',
      question: `Ποια από τις παρακάτω αλυσίδες ισοδύναμων κλασμάτων είναι απόλυτα σωστή;`,
      options: makeUniqueOptions(
        `${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(4, 8)}`,
        [
          `${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 3)} ＝ ${htmlFrac(3, 4)} ＝ ${htmlFrac(4, 5)}`,
          `${htmlFrac(2, 5)} ＝ ${htmlFrac(4, 10)} ＝ ${htmlFrac(6, 12)}`,
          `${htmlFrac(3, 4)} ＝ ${htmlFrac(6, 8)} ＝ ${htmlFrac(9, 15)}`,
        ]
      ),
      correctAnswer: `${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(4, 8)}`,
      solution: `Κάθε κλάσμα προκύπτει πολλαπλασιάζοντας αριθμητή και παρονομαστή του ${htmlFrac(1, 2)} με το 2, το 3 και το 4 αντίστοιχα.`,
    };
  },

  // 17. Απλοποίηση κλάσματος με ίσους όρους (Input)
  () => {
    const n = randInt(12, 45);
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΣΗ',
      question: `Ποια είναι η τελική ανάγωγη τιμή του κλάσματος ${htmlFrac(n, n)};`,
      correctAnswer: '1',
      solution: `Κάθε κλάσμα με ίσο μη μηδενικό αριθμητή και παρονομαστή ισούται με 1 (${n} ： ${n} ＝ 1).`,
    };
  },

  // 18. Αντίθετα ισοδύναμα (Input)
  () => {
    const a = 3;
    const b = 7;
    const k = 2;
    return {
      type: 'input',
      topic: 'ΠΡΟΣΗΜΑ ΚΛΑΣΜΑΤΩΝ',
      question: `Αν ${htmlFrac(-a, b)} ＝ ${htmlFrac(a * k, 'y')}, ποιος είναι ο παρονομαστής y;`,
      correctAnswer: `-${b * k}`,
      solution: `Επειδή το κλάσμα είναι αρνητικό και ο αριθμητής είναι θετικός (＋${a * k}), το μείον μεταφέρεται στον παρονομαστή: y ＝ －${b * k}.`,
    };
  },

  // 19. Εύρεση πολλαπλασιαστή διαστολής (Input)
  () => {
    const a = randInt(3, 5);
    const b = randInt(6, 8);
    const k = randInt(3, 7);
    const newN = a * k;
    const newD = b * k;
    return {
      type: 'input',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ ΔΙΑΣΤΟΛΗΣ',
      question: `Με ποιον φυσικό αριθμό πολλαπλασιάστηκαν οι όροι του ${htmlFrac(a, b)} για να γίνει ${htmlFrac(newN, newD)};`,
      correctAnswer: k.toString(),
      solution: `${newN} ： ${a} ＝ ${k} (ή ${newD} ： ${b} ＝ ${k}).`,
    };
  },

  // 20. Επιλογή ανάγωγου κλάσματος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΓΩΓΟΥ',
      question: `Ποιο από τα παρακάτω κλάσματα είναι ήδη ανάγωγο;`,
      options: makeUniqueOptions(
        htmlFrac(7, 9),
        [htmlFrac(4, 6), htmlFrac(10, 15), htmlFrac(6, 8)]
      ),
      correctAnswer: htmlFrac(7, 9),
      solution: `Το κλάσμα ${htmlFrac(7, 9)} είναι ανάγωγο γιατί ο ΜΚΔ(7, 9) ＝ 1. Όλα τα υπόλοιπα απλοποιούνται με το 2 ή το 5.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΙΣΟΔΥΝΑΜΩΝ ΚΛΑΣΜΑΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αναλογία υλικών σε συνταγή (διπλασιασμός)
  () => {
    const a = 2;
    const b = 3;
    const k = 2;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Μια συνταγή για 4 άτομα απαιτεί ${htmlFrac(a, b)} του κιλού ζάχαρη. Αν διπλασιάσουμε τη δοσολογία για 8 άτομα, ποιος θα είναι ο νέος αριθμητής αν ο παρονομαστής γίνει 6;`,
      correctAnswer: (a * k).toString(),
      solution: `Διαστολή με το 2: ${htmlFrac(a, b)} ＝ ${htmlFrac(a * k, b * k)} ＝ ${htmlFrac(4, 6)}. Ο αριθμητής είναι 4.`,
    };
  },

  // Πρόβλημα 2: Επίδοση σε αγώνα μπάσκετ
  () => {
    const hits = 6;
    const total = 10;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ένας παίκτης πέτυχε 6 καλάθια σε 10 προσπάθειες (${htmlFrac(hits, total)}). Ποιο είναι το ανάγωγο κλάσμα της ευστοχίας του (μορφή α/β);`,
      correctAnswer: '3/5',
      solution: `Απλοποιούμε με το 2: ${htmlFrac(hits, total)} ＝ ${htmlFrac('3', '5')}.`,
    };
  },

  // Πρόβλημα 3: Μοίρασμα σοκολάτας
  () => {
    const pieces = 4;
    const total = 12;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ',
      question: `Η Ελένη έφαγε 4 από τα 12 ίσα τετραγωνάκια μιας σοκολάτας. Ποιο ανάγωγο κλάσμα της σοκολάτας έφαγε (μορφή α/β);`,
      correctAnswer: '1/3',
      solution: `Απλοποιούμε το ${htmlFrac(pieces, total)} με το 4 και βρίσκουμε ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 4: Χρόνος μελέτης
  () => {
    const mins = 30;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ο Γιάννης διάβασε για 30 λεπτά (δηλαδή ${htmlFrac(mins, 60)} της ώρας). Ποιο ανάγωγο κλάσμα της ώρας μελέτησε (μορφή α/β);`,
      correctAnswer: '1/2',
      solution: `Απλοποιούμε με το 30: ${htmlFrac('30', '60')} ＝ ${htmlFrac('1', '2')} της ώρας.`,
    };
  },

  // Πρόβλημα 5: Βαθμολογία σε τεστ
  () => {
    const grade = 15;
    const maxGrade = 20;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα τεστ ένας μαθητής πήρε 15 στα 20 (${htmlFrac(grade, maxGrade)}). Ποιο ανάγωγο κλάσμα εκφράζει την επίδοσή του (μορφή α/β);`,
      correctAnswer: '3/4',
      solution: `Απλοποιούμε με το 5: ${htmlFrac('15', '20')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 6: Στάθμη δεξαμενής πετρελαίου
  () => {
    const filled = 8;
    const total = 10;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Μια δεξαμενή έχει γεμίσει κατά τα ${htmlFrac(filled, total)}. Ποιο ανάγωγο κλάσμα εκφράζει το γεμάτο μέρος (μορφή α/β);`,
      correctAnswer: '4/5',
      solution: `Διαιρούμε με το 2: ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 7: Ποσοστό κοριτσιών σε τάξη
  () => {
    const girls = 12;
    const totalStudents = 20;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Σε ένα τμήμα 20 μαθητών υπάρχουν 12 κορίτσια. Ποιο είναι το ανάγωγο κλάσμα των κοριτσιών ως προς το σύνολο της τάξης (μορφή α/β);`,
      correctAnswer: '3/5',
      solution: `Απλοποιούμε το ${htmlFrac('12', '20')} δια του 4: ${htmlFrac('3', '5')}.`,
    };
  },

  // Πρόβλημα 8: Διαδρομή μαραθωνίου
  () => {
    const done = 25;
    const total = 100;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΗ',
      question: `Ένας δρομέας έχει καλύψει τα ${htmlFrac(done, total)} της διαδρομής. Ποιο ανάγωγο κλάσμα της διαδρομής έχει διανύσει (μορφή α/β);`,
      correctAnswer: '1/4',
      solution: `Διαιρούμε με το 25: ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')}.`,
    };
  },

  // Πρόβλημα 9: Έκπτωση σε τιμή προϊόντος
  () => {
    const discount = 20;
    const original = 50;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Σε ένα μπουφάν αξίας 50 € έγινε έκπτωση 20 € (${htmlFrac(discount, original)}). Ποιο ανάγωγο κλάσμα της αρχικής τιμής αντιστοιχεί στην έκπτωση (μορφή α/β);`,
      correctAnswer: '2/5',
      solution: `Απλοποιούμε με το 10: ${htmlFrac('20', '50')} ＝ ${htmlFrac('2', '5')}.`,
    };
  },

  // Πρόβλημα 10: Συσκευασία αυγών
  () => {
    const used = 6;
    const total = 12;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΑΓΕΙΡΙΚΗ',
      question: `Από μια καρτέλα 12 αυγών χρησιμοποιήθηκαν τα 6. Ποιο ανάγωγο κλάσμα των αυγών χρησιμοποιήθηκε (μορφή α/β);`,
      correctAnswer: '1/2',
      solution: `Απλοποιούμε με το 6: ${htmlFrac('6', '12')} ＝ ${htmlFrac('1', '2')}.`,
    };
  },

  // Πρόβλημα 11: Σελίδες βιβλίου
  () => {
    const readPages = 50;
    const totalPages = 200;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΓΝΩΣΗ',
      question: `Η Μαρία διάβασε 50 σελίδες από ένα βιβλίο 200 σελίδων. Ποιο ανάγωγο κλάσμα του βιβλίου διάβασε (μορφή α/β);`,
      correctAnswer: '1/4',
      solution: `Διαιρούμε με το 50: ${htmlFrac('50', '200')} ＝ ${htmlFrac('1', '4')}.`,
    };
  },

  // Πρόβλημα 12: Φύτευση δέντρων
  () => {
    const planted = 18;
    const total = 24;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ',
      question: `Σε ένα πάρκο φυτεύτηκαν 18 από τα 24 προβλεπόμενα δέντρα. Ποιο ανάγωγο κλάσμα των δέντρων έχει φυτευτεί (μορφή α/β);`,
      correctAnswer: '3/4',
      solution: `Απλοποιούμε με το 6: ${htmlFrac('18', '24')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 13: Ώρες ύπνου
  () => {
    const sleepHours = 8;
    const dayHours = 24;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΓΕΙΑ',
      question: `Ένας έφηβος κοιμάται 8 ώρες το εικοσιτετράωρο (${htmlFrac(sleepHours, dayHours)}). Ποιο ανάγωγο κλάσμα της ημέρας αφιερώνει στον ύπνο (μορφή α/β);`,
      correctAnswer: '1/3',
      solution: `Απλοποιούμε με το 8: ${htmlFrac('8', '24')} ＝ ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 14: Νίκες ποδοσφαιρικής ομάδας
  () => {
    const wins = 14;
    const matches = 21;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Μια ομάδα ποδοσφαίρου κέρδισε τους 14 από τους 21 αγώνες που έδωσε. Ποιο ανάγωγο κλάσμα των αγώνων κέρδισε (μορφή α/β);`,
      correctAnswer: '2/3',
      solution: `Απλοποιούμε με το 7: ${htmlFrac('14', '21')} ＝ ${htmlFrac('2', '3')}.`,
    };
  },

  // Πρόβλημα 15: Μπαταρία tablet
  () => {
    const remaining = 75;
    const full = 100;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Η μπαταρία ενός tablet βρίσκεται στο 75% (${htmlFrac(remaining, full)}). Ποιο ανάγωγο κλάσμα της πλήρους φόρτισης απομένει (μορφή α/β);`,
      correctAnswer: '3/4',
      solution: `Απλοποιούμε με το 25: ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 16: Αποταμίευση χαρτζιλικιού
  () => {
    const saved = 15;
    const total = 45;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Από χαρτζιλίκι 45 € ένας μαθητής αποταμίευσε τα 15 €. Ποιο ανάγωγο κλάσμα του ποσού έβαλε στον κουμπαρά του (μορφή α/β);`,
      correctAnswer: '1/3',
      solution: `Διαιρούμε με το 15: ${htmlFrac('15', '45')} ＝ ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος παιχνιδιού
  () => {
    const playMins = 40;
    const hourMins = 60;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ένας αγώνας μπάσκετ διαρκεί 40 λεπτά καθαρού χρόνου (${htmlFrac(playMins, hourMins)} της ώρας). Ποιο ανάγωγο κλάσμα της ώρας είναι αυτό (μορφή α/β);`,
      correctAnswer: '2/3',
      solution: `Απλοποιούμε με το 20: ${htmlFrac('40', '60')} ＝ ${htmlFrac('2', '3')}.`,
    };
  },

  // Πρόβλημα 18: Μερίδιο συνιδιοκτησίας
  () => {
    const share = 300;
    const total = 1000;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ',
      question: `Σε μια πολυκατοικία ένα διαμέρισμα κατέχει 300 χιλιοστά (${htmlFrac(share, total)}) επί του οικοπέδου. Ποιο είναι το ανάγωγο κλάσμα της συνιδιοκτησίας του (μορφή α/β);`,
      correctAnswer: '3/10',
      solution: `Απλοποιούμε με το 100: ${htmlFrac('300', '1000')} ＝ ${htmlFrac('3', '10')}.`,
    };
  },

  // Πρόβλημα 19: Επιτυχείς βολές τοξοβολίας
  () => {
    const bullsEye = 16;
    const shots = 20;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ένας τοξοβόλος πέτυχε το κέντρο του στόχου σε 16 από τις 20 βολές του. Ποιο ανάγωγο κλάσμα εκφράζει την επιτυχία του (μορφή α/β);`,
      correctAnswer: '4/5',
      solution: `Απλοποιούμε με το 4: ${htmlFrac('16', '20')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 20: Κατανάλωση αποθέματος νερού
  () => {
    const drank = 350;
    const bottle = 500;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Από ένα παγούρι 500 ml καταναλώθηκαν τα 350 ml (${htmlFrac(drank, bottle)}). Ποιο ανάγωγο κλάσμα του νερού ήπιε ο αθλητής (μορφή α/β);`,
      correctAnswer: '7/10',
      solution: `Απλοποιούμε με το 50: ${htmlFrac('350', '500')} ＝ ${htmlFrac('7', '10')}.`,
    };
  },
];

export default function IsodinamaKlasmataAsk() {
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
      title="Ασκήσεις: Ισοδύναμα Κλάσματα | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στη διαστολή, απλοποίηση και ισοδυναμία κλασμάτων για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/14-isodinama-klasmata"
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
              Ισοδύναμα Κλάσματα
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 υπολογισμοί/θεωρία ισοδυναμίας + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 3/4 ή 12"
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
