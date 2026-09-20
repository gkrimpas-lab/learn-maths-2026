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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΔΥΝΑΜΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Δύναμη αρνητικού με άρτιο εκθέτη (Input)
  () => {
    const base = -2;
    const exp = 4;
    const ans = Math.pow(base, exp); // 16
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ (ΑΡΤΙΟΣ)',
      question: `Υπολόγισε την τιμή της δύναμης: (${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Επειδή η βάση είναι αρνητική και ο εκθέτης είναι άρτιος (${exp}), το αποτέλεσμα είναι θετικό: (${base})<sup>${exp}</sup> ＝ ＋${ans}.`,
    };
  },

  // 2. Δύναμη αρνητικού με περιττό εκθέτη (Input)
  () => {
    const base = -2;
    const exp = 3;
    const ans = Math.pow(base, exp); // -8
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ (ΠΕΡΙΤΤΟΣ)',
      question: `Υπολόγισε την τιμή της δύναμης: (${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Επειδή η βάση είναι αρνητική και ο εκθέτης είναι περιττός (${exp}), το αποτέλεσμα είναι αρνητικό: (${base})<sup>${exp}</sup> ＝ ${ans}.`,
    };
  },

  // 3. Η παγίδα της παρένθεσης (Input)
  () => {
    const base = 3;
    const exp = 2;
    const ans = -Math.pow(base, exp); // -9
    return {
      type: 'input',
      topic: 'ΠΑΓΙΔΑ ΠΑΡΕΝΘΕΣΗΣ',
      question: `Υπολόγισε την τιμή της παράστασης: －${base}<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Επειδή το μείον δεν βρίσκεται μέσα σε παρένθεση, ο εκθέτης επηρεάζει μόνο τον αριθμό ${base}: －${base}<sup>${exp}</sup> ＝ －(${base} · ${base}) ＝ ${ans}.`,
    };
  },

  // 4. Δύναμη κλάσματος (Input)
  () => {
    const n = 2;
    const d = 3;
    const exp = 3;
    const ansNum = Math.pow(n, exp); // 8
    const ansDen = Math.pow(d, exp); // 27
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΚΛΑΣΜΑΤΟΣ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(n, d)})<sup>${exp}</sup> (μορφή α/β):`,
      correctAnswer: `${ansNum}/${ansDen}`,
      solution: `Υψώνουμε αριθμητή και παρονομαστή στον εκθέτη: ${n}<sup>${exp}</sup> / ${d}<sup>${exp}</sup> ＝ ${htmlFrac(ansNum, ansDen)}.`,
    };
  },

  // 5. Δύναμη αρνητικού κλάσματος με άρτιο εκθέτη (Input)
  () => {
    const n = -1;
    const d = 2;
    const exp = 4;
    const ansDen = Math.pow(d, exp); // 16
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟ ΚΛΑΣΜΑ (ΑΡΤΙΟΣ)',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(n, d)})<sup>${exp}</sup>`,
      correctAnswer: `1/${ansDen}`,
      solution: `Ο εκθέτης είναι άρτιος (4), επομένως το αποτέλεσμα είναι θετικό: 1 / 2<sup>4</sup> ＝ ${htmlFrac(1, ansDen)}.`,
    };
  },

  // 6. Γινόμενο δυνάμεων με την ίδια βάση (MCQ)
  () => {
    const b = 5;
    const m = 3;
    const n = 4;
    const sumExp = m + n; // 7
    const correct = `${b}<sup>${sumExp}</sup>`;
    return {
      type: 'mcq',
      topic: 'ΓΙΝΟΜΕΝΟ ΙΔΙΑΣ ΒΑΣΗΣ',
      question: `Γράψε ως μία δύναμη το γινόμενο: ${b}<sup>${m}</sup> · ${b}<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m * n}</sup>`,
        `${b * b}<sup>${sumExp}</sup>`,
        `${b}<sup>${Math.abs(m - n)}</sup>`,
      ]),
      correctAnswer: correct,
      solution: `Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες: ${b}<sup>${m} ＋ ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 7. Πηλίκο δυνάμεων με την ίδια βάση (MCQ)
  () => {
    const b = 7;
    const m = 8;
    const n = 5;
    const diffExp = m - n; // 3
    const correct = `${b}<sup>${diffExp}</sup>`;
    return {
      type: 'mcq',
      topic: 'ΠΗΛΙΚΟ ΙΔΙΑΣ ΒΑΣΗΣ',
      question: `Γράψε ως μία δύναμη το πηλίκο: ${b}<sup>${m}</sup> ： ${b}<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m + n}</sup>`,
        `1<sup>${diffExp}</sup>`,
        `${b}<sup>${m * n}</sup>`,
      ]),
      correctAnswer: correct,
      solution: `Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες: ${b}<sup>${m} － ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 8. Δύναμη σε δύναμη (MCQ)
  () => {
    const b = 2;
    const m = 3;
    const n = 4;
    const prodExp = m * n; // 12
    const correct = `${b}<sup>${prodExp}</sup>`;
    return {
      type: 'mcq',
      topic: 'ΔΥΝΑΜΗ ΣΕ ΔΥΝΑΜΗ',
      question: `Γράψε ως μία δύναμη την παράσταση: (${b}<sup>${m}</sup>)<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m + n}</sup>`,
        `${b}<sup>${Math.pow(m, n)}</sup>`,
        `${b * n}<sup>${m}</sup>`,
      ]),
      correctAnswer: correct,
      solution: `Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες: ${b}<sup>${m} · ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 9. Δύναμη δεκαδικού αριθμού (Input)
  () => {
    // 0.2^3 = 0.008
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΔΕΚΑΔΙΚΟΥ',
      question: `Υπολόγισε την τιμή: 0,2<sup>3</sup>`,
      correctAnswer: '0,008',
      solution: `0,2 · 0,2 · 0,2 ＝ 0,008 (1 δεκαδικό ψηφίο επί εκθέτη 3 ＝ 3 δεκαδικά ψηφία).`,
    };
  },

  // 10. Δύναμη γινομένου (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΥΝΑΜΗ ΓΙΝΟΜΕΝΟΥ',
      question: `Ποια από τις παρακάτω ισότητες εκφράζει σωστά τη δύναμη γινομένου;`,
      options: makeUniqueOptions(
        '(α · β)<sup>v</sup> ＝ α<sup>v</sup> · β<sup>v</sup>',
        [
          '(α · β)<sup>v</sup> ＝ α · β<sup>v</sup>',
          '(α · β)<sup>v</sup> ＝ α<sup>v</sup> ＋ β<sup>v</sup>',
          '(α ＋ β)<sup>v</sup> ＝ α<sup>v</sup> ＋ β<sup>v</sup>',
        ]
      ),
      correctAnswer: '(α · β)<sup>v</sup> ＝ α<sup>v</sup> · β<sup>v</sup>',
      solution: `Στη δύναμη γινομένου υψώνεται κάθε παράγοντας ξεχωριστά στον ίδιο εκθέτη: (α · β)<sup>v</sup> ＝ α<sup>v</sup> · β<sup>v</sup>.`,
    };
  },

  // 11. Δύναμη του 1 (Input)
  () => {
    const exp = randInt(15, 99);
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΤΟΥ 1',
      question: `Υπολόγισε την τιμή: 1<sup>${exp}</sup>`,
      correctAnswer: '1',
      solution: `Ο αριθμός 1 υψωμένος σε οποιαδήποτε θετική δύναμη ισούται πάντοτε με 1.`,
    };
  },

  // 12. Δύναμη του -1 με άρτιο εκθέτη (Input)
  () => {
    const exp = 24;
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΤΟΥ -1 (ΑΡΤΙΟΣ)',
      question: `Υπολόγισε την τιμή: (－1)<sup>${exp}</sup>`,
      correctAnswer: '1',
      solution: `Επειδή ο εκθέτης είναι άρτιος (24), το αποτέλεσμα είναι θετικό: ＋1.`,
    };
  },

  // 13. Δύναμη του -1 με περιττό εκθέτη (Input)
  () => {
    const exp = 37;
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΤΟΥ -1 (ΠΕΡΙΤΤΟΣ)',
      question: `Υπολόγισε την τιμή: (－1)<sup>${exp}</sup>`,
      correctAnswer: '-1',
      solution: `Επειδή ο εκθέτης είναι περιττός (37), το αποτέλεσμα παραμένει αρνητικό: －1.`,
    };
  },

  // 14. Δύναμη με εκθέτη 1 (Input)
  () => {
    const a = -14;
    const b = 17;
    return {
      type: 'input',
      topic: 'ΕΚΘΕΤΗΣ 1',
      question: `Υπολόγισε το αποτέλεσμα: (${htmlFrac(a, b)})<sup>1</sup>`,
      correctAnswer: `${a}/${b}`,
      solution: `Κάθε αριθμός υψωμένος στην 1η δύναμη ισούται με τον εαυτό του: ${htmlFrac(a, b)}.`,
    };
  },

  // 15. Δύναμη του μηδενός (Input)
  () => {
    const exp = randInt(3, 10);
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΤΟΥ 0',
      question: `Υπολόγισε την τιμή: 0<sup>${exp}</sup>`,
      correctAnswer: '0',
      solution: `Το μηδέν υψωμένο σε οποιονδήποτε θετικό φυσικό εκθέτη ισούται με 0.`,
    };
  },

  // 16. Υπολογισμός παράστασης με δυνάμεις (Input)
  () => {
    // (-2)^3 + (-1)^4 = -8 + 1 = -7
    return {
      type: 'input',
      topic: 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      question: `Υπολόγισε την τιμή της παράστασης: (－2)<sup>3</sup> ＋ (－1)<sup>4</sup>`,
      correctAnswer: '-7',
      solution: `(－2)<sup>3</sup> ＝ －8 και (－1)<sup>4</sup> ＝ ＋1. Άρα: (－8) ＋ 1 ＝ －7.`,
    };
  },

  // 17. Δύναμη αρνητικού δεκαδικού με άρτιο εκθέτη (Input)
  () => {
    // (-0.5)^2 = 0.25
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ (ΑΡΤΙΟΣ)',
      question: `Υπολόγισε την τιμή: (－0,5)<sup>2</sup>`,
      correctAnswer: '0,25',
      solution: `Ο εκθέτης είναι άρτιος, άρα το πρόσημο γίνεται θετικό: (－0,5) · (－0,5) ＝ ＋0,25.`,
    };
  },

  // 18. Σύγκριση δυνάμεων (MCQ)
  () => {
    // (-2)^2 = 4 > -2^2 = -4
    const correct = '(－2)<sup>2</sup> ＞ －2<sup>2</sup>';
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των αριθμών (－2)<sup>2</sup> και －2<sup>2</sup>;`,
      options: makeUniqueOptions(correct, [
        '(－2)<sup>2</sup> ＜ －2<sup>2</sup>',
        '(－2)<sup>2</sup> ＝ －2<sup>2</sup>',
        'Είναι και οι δύο ίσοι με το 0',
      ]),
      correctAnswer: correct,
      solution: `(－2)<sup>2</sup> ＝ ＋4 ενώ －2<sup>2</sup> ＝ －4. Επειδή ＋4 ＞ －4, ισχύει ${correct}.`,
    };
  },

  // 19. Δύναμη πηλίκου με απλοποίηση (Input)
  () => {
    // (6/3)^2 = 2^2 = 4
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΠΗΛΙΚΟΥ',
      question: `Υπολόγισε την τιμή: (${htmlFrac(6, 3)})<sup>2</sup>`,
      correctAnswer: '4',
      solution: `${htmlFrac(6, 3)} ＝ 2. Επομένως: 2<sup>2</sup> ＝ 4.`,
    };
  },

  // 20. Ανάποδη εφαρμογή ιδιότητας κοινού εκθέτη (Input)
  () => {
    // 2^3 * 5^3 = (2*5)^3 = 10^3 = 1000
    return {
      type: 'input',
      topic: 'ΚΟΙΝΟΣ ΕΚΘΕΤΗΣ',
      question: `Υπολόγισε την τιμή της παράστασης: 2<sup>3</sup> · 5<sup>3</sup>`,
      correctAnswer: '1000',
      solution: `Εφαρμόζουμε την ιδιότητα κοινού εκθέτη: 2<sup>3</sup> · 5<sup>3</sup> ＝ (2 · 5)<sup>3</sup> ＝ 10<sup>3</sup> ＝ 1.000.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΥΝΑΜΕΩΝ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Εμβαδόν τετραγώνου με κλασματική πλευρά
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα τετράγωνο έχει πλευρά μήκους ${htmlFrac(3, 4)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '9/16',
      solution: `Εμβαδόν ＝ (πλευρά)<sup>2</sup> ＝ (${htmlFrac(3, 4)})<sup>2</sup> ＝ ${htmlFrac(9, 16)} τ.μ.`,
    };
  },

  // Πρόβλημα 2: Όγκος κύβου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένας κύβος έχει ακμή 0,3 μέτρα. Ποιος είναι ο όγκος του σε κυβικά μέτρα;`,
      correctAnswer: '0,027',
      solution: `Όγκος ＝ (ακμή)<sup>3</sup> ＝ 0,3<sup>3</sup> ＝ 0,3 · 0,3 · 0,3 ＝ 0,027 κ.μ.`,
    };
  },

  // Πρόβλημα 3: Διπλασιασμός βακτηρίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ',
      question: `Ένας πληθυσμός βακτηρίων διπλασιάζεται κάθε ώρα (δηλαδή πολλαπλασιάζεται επί 2). Αν αρχικά υπάρχει 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από 6 ώρες (2<sup>6</sup>);`,
      correctAnswer: '64',
      solution: `2<sup>6</sup> ＝ 64 βακτήρια.`,
    };
  },

  // Πρόβλημα 4: Εμβαδόν τετραγωνικού πλακιδίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Ένα τετραγωνικό πλακάκι έχει πλευρά 0,5 m. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;`,
      correctAnswer: '0,25',
      solution: `Εμβαδόν ＝ 0,5<sup>2</sup> ＝ 0,25 τ.μ.`,
    };
  },

  // Πρόβλημα 5: Τριπλασιασμός διαμοιρασμού πληροφορίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΔΙΚΤΥΑ',
      question: `Ένα μήνυμα προωθείται σε 3 άτομα στον 1ο γύρο, καθένα από αυτά το στέλνει σε άλλα 3 στον 2ο γύρο κ.ο.κ. Πόσα άτομα θα λάβουν το μήνυμα στον 4ο γύρο (3<sup>4</sup>);`,
      correctAnswer: '81',
      solution: `3<sup>4</sup> ＝ 81 άτομα.`,
    };
  },

  // Πρόβλημα 6: Όγκος κύβου με κλάσμα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα κυβικό κουτί έχει ακμή ${htmlFrac(1, 2)} του μέτρου. Ποιος είναι ο όγκος του σε κυβικά μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '1/8',
      solution: `(${htmlFrac(1, 2)})<sup>3</sup> ＝ 1<sup>3</sup> / 2<sup>3</sup> ＝ ${htmlFrac(1, 8)} κ.μ.`,
    };
  },

  // Πρόβλημα 7: Ψηφιακή αποθήκευση (δυνάμεις του 2)
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question: `Στην πληροφορική, 1 Byte αποτελείται από 8 bit, τα οποία μπορούν να αναπαραστήσουν 2<sup>8</sup> διαφορετικές τιμές. Πόσες τιμές είναι αυτές;`,
      correctAnswer: '256',
      solution: `2<sup>8</sup> ＝ 256 τιμές.`,
    };
  },

  // Πρόβλημα 8: Απομείωση ραδιενεργού υλικού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Μια ποσότητα υλικού υποδιπλασιάζεται κάθε ημέρα (πολλαπλασιάζεται επί 1/2). Ποιο κλάσμα της αρχικής ποσότητας θα απομείνει μετά από 4 ημέρες (δηλαδή (1/2)<sup>4</sup>);`,
      correctAnswer: '1/16',
      solution: `(${htmlFrac(1, 2)})<sup>4</sup> ＝ ${htmlFrac(1, 16)}.`,
    };
  },

  // Πρόβλημα 9: Εμβαδόν τετραγώνου με πλευρά δεκαδικό
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα τετράγωνο χωράφι έχει πλευρά 1,2 km. Ποιο είναι το εμβαδόν του σε τετραγωνικά χιλιόμετρα;`,
      correctAnswer: '1,44',
      solution: `1,2<sup>2</sup> ＝ 1,44 τ.χλμ.`,
    };
  },

  // Πρόβλημα 10: Δέντρο τουρνουά νοκ-άουτ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Σε ένα τουρνουά τένις υπάρχουν 5 γύροι νοκ-άουτ μέχρι τον τελικό. Πόσοι αθλητές ξεκίνησαν συνολικά στο ταμπλό αν στον 1ο γύρο αγωνίζονται 2<sup>5</sup> παίκτες;`,
      correctAnswer: '32',
      solution: `2<sup>5</sup> ＝ 32 αθλητές.`,
    };
  },

  // Πρόβλημα 11: Εμβαδόν τετραγώνου με πλευρά 5/2
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Μια τετράγωνη επιφάνεια έχει πλευρά ${htmlFrac(5, 2)} μέτρα. Ποιο είναι το εμβαδόν της σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '25/4',
      solution: `(${htmlFrac(5, 2)})<sup>2</sup> ＝ 25/4 τ.μ.`,
    };
  },

  // Πρόβλημα 12: Αλυσίδα τηλεφωνικών κλήσεων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΚΟΙΝΩΝΙΑ',
      question: `Ένας μαθητής ειδοποιεί 4 συμμαθητές του, και καθένας από αυτούς άλλους 4 στο επόμενο στάδιο. Πόσοι μαθητές θα ειδοποιηθούν στο 3ο στάδιο (4<sup>3</sup>);`,
      correctAnswer: '64',
      solution: `4<sup>3</sup> ＝ 64 μαθητές.`,
    };
  },

  // Πρόβλημα 13: Όγκος μικρού κυβικού ζαριού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΙΧΝΙΔΙΑ',
      question: `Ένα ζάρι έχει ακμή 0,2 dm. Ποιος είναι ο όγκος του σε κυβικά δέκατα (dm<sup>3</sup>);`,
      correctAnswer: '0,008',
      solution: `0,2<sup>3</sup> ＝ 0,008 dm<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 14: Πιθανοί συνδυασμοί κωδικού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ',
      question: `Ένα ψηφιακό λουκέτο έχει 3 ρόδες, καθεμία από τις οποίες έχει τα 10 ψηφία 0-9. Πόσοι είναι οι συνολικοί δυνατοί συνδυασμοί (10<sup>3</sup>);`,
      correctAnswer: '1000',
      solution: `10<sup>3</sup> ＝ 1.000 διαφορετικοί συνδυασμοί.`,
    };
  },

  // Πρόβλημα 15: Εμβαδόν τετραγώνου με πλευρά 0,8
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ποιο είναι το εμβαδόν τετραγώνου με πλευρά 0,8 m σε τετραγωνικά μέτρα;`,
      correctAnswer: '0,64',
      solution: `0,8<sup>2</sup> ＝ 0,64 τ.μ.`,
    };
  },

  // Πρόβλημα 16: Αύξηση επένδυσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια επένδυση αυξάνεται κάθε χρόνο με συντελεστή 1,1. Ποιος είναι ο συνολικός συντελεστής αύξησης μετά από 2 χρόνια (1,1<sup>2</sup>);`,
      correctAnswer: '1,21',
      solution: `1,1<sup>2</sup> ＝ 1,21.`,
    };
  },

  // Πρόβλημα 17: Κλασματικό εμβαδόν
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα τετράγωνο έχει πλευρά ${htmlFrac(2, 5)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα);`,
      correctAnswer: '4/25',
      solution: `(${htmlFrac(2, 5)})<sup>2</sup> ＝ ${htmlFrac(4, 25)} τ.μ.`,
    };
  },

  // Πρόβλημα 18: Διπλασιασμός διπλώματος χαρτιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΑΡΤΙ',
      question: `Αν διπλώσουμε ένα φύλλο χαρτί στη μέση 5 φορές, σε πόσα στρώματα πάχους θα χωριστεί (2<sup>5</sup>);`,
      correctAnswer: '32',
      solution: `2<sup>5</sup> ＝ 32 στρώματα.`,
    };
  },

  // Πρόβλημα 19: Όγκος κύβου με ακμή 4
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένας κύβος έχει ακμή 4 cm. Ποιος είναι ο όγκος του σε cm<sup>3</sup>;`,
      correctAnswer: '64',
      solution: `4<sup>3</sup> ＝ 64 cm<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 20: Δύναμη του 10 σε επιστημονική μέτρηση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Ένα χιλιόμετρο ισούται με 10<sup>3</sup> μέτρα και 1 μέτρο με 10<sup>3</sup> χιλιοστά. Πόσα χιλιοστά έχει ένα χιλιόμετρο (10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup>);`,
      correctAnswer: '1000000',
      solution: `10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup> ＝ 1.000.000 χιλιοστά.`,
    };
  },
];

export default function DinamiRitonAsk() {
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
      title="Ασκήσεις: Δυνάμεις Ρητών με Θετικό Εκθέτη | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στις δυνάμεις ρητών αριθμών και τις ιδιότητές τους για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/19-dinami-riton-ekth-thetikos"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 17 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Δυνάμεις Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις/ιδιότητες δυνάμεων + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. -8 ή 9/16"
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
