import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component Frac με ασφαλή ανίχνευση προσήμου και τοποθέτηση του μείον μπροστά
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{cleanNum}</span>
        <span className="pt-0.5 px-1">{cleanDen}</span>
      </span>
    </span>
  );
};

// Εξασφάλιση μοναδικών επιλογών στα MCQs
const makeUniqueOptions = (correctVal, rawDistractors) => {
  const options = [correctVal];
  for (const dist of rawDistractors) {
    if (!options.includes(dist)) {
      options.push(dist);
    }
    if (options.length === 4) break;
  }
  let counter = 1;
  while (options.length < 4) {
    const fallback = `${correctVal + counter}`;
    if (!options.includes(fallback)) options.push(fallback);
    counter++;
  }
  return options.sort(() => Math.random() - 0.5);
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Προτεραιότητα: δύναμη με αρνητικό εκθέτη και πολλαπλασιασμός
  () => {
    const a = randInt(2, 4);
    const mult = a * 2;
    // mult * a^(-1) + 5 = 2 + 5 = 7
    const correct = `${2 + 5}`;
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την τιμή της παράστασης: <strong className="font-mono text-indigo-700">{mult} · {a}<sup>-1</sup> + 5</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${mult * a + 5}`, `${mult + 5}`, `${mult + a}`, `${mult - 2}`]),
      hint: `${mult} · ${a}⁻¹ = ${mult} · (1/${a}) = ${mult / a}. Έπειτα προσθέτουμε το 5.`
    };
  },
  // 2. Παρενθέσεις και δύναμη
  () => {
    const correct = '16';
    return {
      type: 'mcq',
      badge: 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="font-mono text-indigo-700">(7 - 3)<sup>2</sup> : 2 + 8</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['24', '12', '8', '20']),
      hint: '(7 - 3)² = 4² = 16. Έπειτα 16 : 2 = 8, και 8 + 8 = 16.'
    };
  },
  // 3. Δύναμη σε αρνητικό αριθμό χωρίς παρένθεση vs με παρένθεση
  () => {
    const correct = '0';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε το αποτέλεσμα: <strong className="font-mono text-indigo-700">(-3)<sup>2</sup> - 3<sup>2</sup></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['18', '-18', '-12', '9']),
      hint: '(-3)² = +9, ενώ -3² = -9. Επομένως 9 - 9 = 0.'
    };
  },
  // 4. Σύνθετη με αρνητικό εκθέτη (Input)
  () => {
    // 12 * 2^(-2) - 1 = 12 * 1/4 - 1 = 3 - 1 = 2
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την τιμή της παράστασης: <strong className="font-mono text-indigo-700">12 · 2<sup>-2</sup> - 1</strong>
        </span>
      ),
      correct: '2',
      hint: '2⁻² = 1/4. Άρα 12 · (1/4) = 3. Τέλος, 3 - 1 = 2.'
    };
  },
  // 5. Διαδοχικές διαιρέσεις και πολλαπλασιασμοί
  () => {
    const correct = '8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: (
        <span>
          Ποια είναι η ορθή τιμή της έκφρασης <strong className="font-mono text-indigo-700">16 : 4 · 2</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '4', '16', '1']),
      hint: 'Εκτελούμε από αριστερά προς τα δεξιά: 16 : 4 = 4, και 4 · 2 = 8 (όχι 16 : 8).'
    };
  },
  // 6. Μηδενικός εκθέτης σε σύνθετη παρένθεση
  () => {
    const correct = '11';
    return {
      type: 'mcq',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="font-mono text-indigo-700">10 + (4 · 5 - 12)<sup>0</sup></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10', '18', '0', '12']),
      hint: 'Οποιαδήποτε μη μηδενική παρένθεση υψωμένη στο 0 ισούται με 1. Άρα 10 + 1 = 11.'
    };
  },
  // 7. Πράξεις με κλάσματα και προτεραιότητα (Input)
  () => {
    // (1/2 + 1/2) * 6 - 2 = 1 * 6 - 2 = 4
    return {
      type: 'input',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="font-mono text-indigo-700">(1/2 + 1/2) · 6 - 2</strong>
        </span>
      ),
      correct: '4',
      hint: '1/2 + 1/2 = 1. Άρα 1 · 6 - 2 = 4.'
    };
  },
  // 8. Δύναμη δύναμης με αρνητικό εκθέτη
  () => {
    const correct = '2';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Η τιμή της παράστασης <strong className="font-mono text-indigo-700">2 · (2<sup>-1</sup>)<sup>-1</sup> - 2</strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', '4', '-2', '1']),
      hint: '(2⁻¹)⁻¹ = 2¹ = 2. Επομένως 2 · 2 - 2 = 4 - 2 = 2.'
    };
  },
  // 9. Αρνητική βάση και περιττός εκθέτης
  () => {
    const correct = '-10';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="font-mono text-indigo-700">(-2)<sup>3</sup> - 2</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6', '-6', '10', '-8']),
      hint: '(-2)³ = -8. Επομένως -8 - 2 = -10.'
    };
  },
  // 10. Πολλαπλασιασμός με δύναμη του 10^-1
  () => {
    const correct = '7';
    return {
      type: 'mcq',
      badge: 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="font-mono text-indigo-700">40 · 10<sup>-1</sup> + 3</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['43', '70', '4,3', '37']),
      hint: '10⁻¹ = 0,1 ή 1/10. Επομένως 40 · 0,1 = 4, και 4 + 3 = 7.'
    };
  },
  // 11. Σύνθετες παρενθέσεις (Input)
  () => {
    // 5 + 3 * (10 - 2 * 4) = 5 + 3 * (10 - 8) = 5 + 3 * 2 = 5 + 6 = 11
    return {
      type: 'input',
      badge: 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question: (
        <span>
          Υπολόγισε την τιμή της παράστασης: <strong className="font-mono text-indigo-700">5 + 3 · (10 - 2 · 4)</strong>
        </span>
      ),
      correct: '11',
      hint: 'Μέσα στην παρένθεση: 2 · 4 = 8, άρα 10 - 8 = 2. Έπειτα 3 · 2 = 6, και 5 + 6 = 11.'
    };
  },
  // 12. Δυνάμεις και διαίρεση κλασμάτων
  () => {
    const correct = '12';
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Υπολόγισε την τιμή της έκφρασης: <strong className="font-mono text-indigo-700">3 : 2<sup>-2</sup></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3/4', '6', '3/2', '-12']),
      hint: '2⁻² = 1/4. Η διαίρεση με κλάσμα γίνεται πολλαπλασιασμός με τον αντίστροφο: 3 : (1/4) = 3 · 4 = 12.'
    };
  },
  // 13. Πρόσθεση και αφαίρεση με αντίθετες δυνάμεις
  () => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="font-mono text-indigo-700">5 + 4 · 4<sup>-1</sup> - 1</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '6', '8', '0']),
      hint: '4 · 4⁻¹ = 4 · (1/4) = 1. Άρα 5 + 1 - 1 = 5.'
    };
  },
  // 14. Σειρά πράξεων σε κλασματική γραμμή
  () => {
    const correct = '3';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question: (
        <span>
          Υπολόγισε την τιμή του κλάσματος: <strong className="font-mono text-indigo-700">(2<sup>3</sup> + 4) : (3 · 2 - 2)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '4', '6', '1']),
      hint: 'Αριθμητής: 8 + 4 = 12. Παρονομαστής: 6 - 2 = 4. Τελικό πηλίκο: 12 : 4 = 3.'
    };
  },
  // 15. Δύναμη σε κλάσμα με αρνητικό εκθέτη (Input)
  () => {
    // (1/3)^(-2) - 4 = 9 - 4 = 5
    return {
      type: 'input',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="font-mono text-indigo-700">(1/3)<sup>-2</sup> - 4</strong>
        </span>
      ),
      correct: '5',
      hint: '(1/3)⁻² = 3² = 9. Επομένως 9 - 4 = 5.'
    };
  },
  // 16. Προτεραιότητα με τρεις πράξεις
  () => {
    const correct = '14';
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="font-mono text-indigo-700">20 - 2 · 3 + 0</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['54', '18', '12', '16']),
      hint: 'Πρώτα ο πολλαπλασιασμός: 2 · 3 = 6. Έπειτα 20 - 6 = 14.'
    };
  },
  // 17. Παρένθεση με αρνητικό εκθέτη
  () => {
    const correct = '1/4';
    return {
      type: 'mcq',
      badge: 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question: (
        <span>
          Η τιμή της έκφρασης <strong className="font-mono text-indigo-700">(6 - 4)<sup>-2</sup></strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-4', '4', '-1/4', '1/2']),
      hint: '6 - 4 = 2. Επομένως 2⁻² = 1 / 2² = 1/4.'
    };
  },
  // 18. Συνδυασμός αρνητικών προσήμων
  () => {
    const correct = '-5';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε την τιμή της παράστασης: <strong className="font-mono text-indigo-700">-3 - (-2) + (-4)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-9', '-1', '3', '-3']),
      hint: '-3 - (-2) = -3 + 2 = -1. Έπειτα -1 + (-4) = -5.'
    };
  },
  // 19. Διπλή παρένθεση και δυνάμεις (Input)
  () => {
    // 2 * [ (3 - 1)^2 + 1 ] = 2 * (4 + 1) = 10
    return {
      type: 'input',
      badge: 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="font-mono text-indigo-700">2 · ((3 - 1)<sup>2</sup> + 1)</strong>
        </span>
      ),
      correct: '10',
      hint: 'Εσωτερική παρένθεση: 3 - 1 = 2. Δύναμη: 2² = 4. Εξωτερική: 4 + 1 = 5. Τέλος: 2 · 5 = 10.'
    };
  },
  // 20. Θεωρητικός έλεγχος κανόνα
  () => {
    const correct = 'Πρώτα οι δυνάμεις, μετά ο πολλαπλασιασμός';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Στην παράσταση <span className="font-mono font-bold">5 · 2<sup>3</sup></span>, ποια πράξη εκτελείται πρώτη;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Πρώτα ο πολλαπλασιασμός, μετά η δύναμη',
        'Είναι αδιάφορη η σειρά',
        'Εκτελούνται ταυτόχρονα',
        'Μόνο αν βάλουμε παρένθεση'
      ]),
      hint: 'Σύμφωνα με την ιεραρχία των πράξεων, οι δυνάμεις προηγούνται των πολλαπλασιασμών.'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Οικονομία: Υπολογισμός τελικής τιμής με έκπτωση και πολλαπλές μονάδες
  () => {
    const correct = '26';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας μαθητής αγοράζει 3 τετράδια των 10€ με έκπτωση <span className="font-mono">2<sup>2</sup> €</span> στο σύνολο. Πόσα ευρώ πλήρωσε (υπολόγισε την παράσταση <strong className="font-mono text-amber-700">3 · 10 - 2<sup>2</sup></strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['24', '28', '20', '34']),
      hint: 'Πρώτα η δύναμη: 2² = 4. Μετά ο πολλαπλασιασμός: 3 · 10 = 30. Τέλος 30 - 4 = 26€.'
    };
  },
  // 2. Θερμοκρασία: Μεταβολές θερμοκρασίας
  () => {
    const correct = '-2';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Σε ένα ορεινό χωριό η θερμοκρασία ήταν 4°C, μειώθηκε κατά <span className="font-mono">2<sup>3</sup> °C</span> και έπειτα αυξήθηκε κατά 2°C. Ποια είναι η τελική θερμοκρασία (<strong className="font-mono text-amber-700">4 - 2<sup>3</sup> + 2</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-6', '2', '0', '-4']),
      hint: '2³ = 8. Έπειτα 4 - 8 = -4, και -4 + 2 = -2°C.'
    };
  },
  // 3. Γεωμετρία: Εμβαδόν σχημάτων
  () => {
    const correct = '25';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το εμβαδόν ενός σύνθετου σχήματος δίνεται από την παράσταση <strong className="font-mono text-amber-700">3<sup>2</sup> + 4<sup>2</sup></strong>. Πόσα cm² είναι το εμβαδόν;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '49', '24', '12']),
      hint: '3² = 9 και 4² = 16. Άρα 9 + 16 = 25 cm².'
    };
  },
  // 4. Αποταμίευση: Διπλασιασμός χρημάτων (Input)
  () => {
    // 50 * 2^(-1) + 20 = 25 + 20 = 45
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η Μαρία είχε 50€, ξόδεψε τα μισά (<span className="font-mono">· 2<sup>-1</sup></span>) και μετά της έδωσαν 20€. Πόσα ευρώ έχει τώρα (<strong className="font-mono text-amber-700">50 · 2<sup>-1</sup> + 20</strong>);
        </span>
      ),
      correct: '45',
      hint: '50 · 2⁻¹ = 50 · (1/2) = 25. Μετά 25 + 20 = 45€.'
    };
  },
  // 5. Φυσική: Απόσταση διαδρομής
  () => {
    const correct = '50';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα αυτοκίνητο κινείται με τύπο απόστασης <strong className="font-mono text-amber-700">2 · 5<sup>2</sup></strong> μέτρα. Πόσα μέτρα διένυσε συνολικά;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['100', '20', '25', '70']),
      hint: 'Πρώτα η δύναμη: 5² = 25. Έπειτα 2 · 25 = 50 μέτρα (όχι 10² = 100).'
    };
  },
  // 6. Τεχνολογία: Χωρητικότητα και διαμοιρασμός
  () => {
    const correct = '16';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα αρχείο μεγέθους <span className="font-mono">2<sup>6</sup> MB</span> μοιράζεται ισόποσα σε <span className="font-mono">2<sup>2</sup> φακέλους</span>. Πόσα MB περιέχει κάθε φάκελος (<strong className="font-mono text-amber-700">2<sup>6</sup> : 2<sup>2</sup></strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['8', '32', '4', '12']),
      hint: '2⁶ : 2² = 2⁶⁻² = 2⁴ = 16 MB.'
    };
  },
  // 7. Εισιτήρια: Οικογενειακή έξοδος
  () => {
    const correct = '34';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια οικογένεια πλήρωσε για 2 ενήλικες (12€ έκαστος) και 2 παιδιά (5€ έκαστος). Ποιο είναι το συνολικό κόστος αν εκφραστεί ως <strong className="font-mono text-amber-700">2 · 12 + 2 · 5</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['38', '30', '48', '24']),
      hint: '2 · 12 = 24 και 2 · 5 = 10. Άρα 24 + 10 = 34€.'
    };
  },
  // 8. Αγροτική παραγωγή: Κιβώτια φρούτων (Input)
  () => {
    // 5 * (12 - 2) = 5 * 10 = 50
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας παραγωγός γεμίζει 5 κιβώτια με 12 κιλά μήλα το καθένα, αλλά αφαιρεί 2 κιλά από κάθε κιβώτιο λόγω διαλογής. Πόσα κιλά έμειναν συνολικά (<strong className="font-mono text-amber-700">5 · (12 - 2)</strong>);
        </span>
      ),
      correct: '50',
      hint: 'Πρώτα η παρένθεση: 12 - 2 = 10. Μετά 5 · 10 = 50 κιλά.'
    };
  },
  // 9. Αθλητισμός: Βαθμολογία σε πρωτάθλημα
  () => {
    const correct = '23';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια ομάδα έχει 7 νίκες (3 βαθμοί η καθεμία) και 2 ισοπαλίες (1 βαθμός η καθεμία). Πόσους βαθμούς συγκέντρωσε (<strong className="font-mono text-amber-700">7 · 3 + 2 · 1</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['21', '25', '27', '22']),
      hint: '7 · 3 = 21 και 2 · 1 = 2. Συνολικά 21 + 2 = 23 βαθμοί.'
    };
  },
  // 10. Μαγειρική: Δόσεις υλικών
  () => {
    const correct = '2';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια συνταγή ζητάει <strong className="font-mono text-amber-700">8 · 2<sup>-2</sup></strong> φλιτζάνια ζάχαρη. Πόσα φλιτζάνια πρέπει να βάλουμε;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '1', '16', '1/2']),
      hint: '2⁻² = 1/4. Επομένως 8 · (1/4) = 2 φλιτζάνια.'
    };
  },
  // 11. Πληροφορική: Χρόνος εκτέλεσης σε κύκλους ρολογιού
  () => {
    const correct = '100';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο χρόνος εκτέλεσης ενός αλγορίθμου δίνεται από την έκφραση <strong className="font-mono text-amber-700">10<sup>3</sup> · 10<sup>-1</sup></strong> ms. Πόσα milliseconds χρειάζονται;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10', '1000', '1', '20']),
      hint: '10³ · 10⁻¹ = 10³⁻¹ = 10² = 100 ms.'
    };
  },
  // 12. Ενέργεια: Κατανάλωση ηλεκτρικού ρεύματος (Input)
  () => {
    // 3 * 10^2 - 50 = 300 - 50 = 250
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια συσκευή καταναλώνει <strong className="font-mono text-amber-700">3 · 10<sup>2</sup> - 50</strong> Watts. Πόσα Watts είναι η κατανάλωσή της;
        </span>
      ),
      correct: '250',
      hint: '3 · 10² = 3 · 100 = 300. Έπειτα 300 - 50 = 250 Watts.'
    };
  },
  // 13. Κατασκευές: Περίμετρος οικοπέδου
  () => {
    const correct = '60';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ορθογώνιο οικόπεδο έχει μήκος 20 m και πλάτος 10 m. Η περίμετρός του υπολογίζεται από τον τύπο <strong className="font-mono text-amber-700">2 · (20 + 10)</strong>. Πόσα μέτρα είναι;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['50', '40', '100', '80']),
      hint: 'Πρώτα η παρένθεση: 20 + 10 = 30. Μετά 2 · 30 = 60 m.'
    };
  },
  // 14. Χημεία: Αραίωση διαλύματος
  () => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα διάλυμα όγκου 10 L αραιώνεται στο μισό (<span className="font-mono">· 2<sup>-1</sup></span>). Πόσα λίτρα είναι το νέο διάλυμα (<strong className="font-mono text-amber-700">10 · 2<sup>-1</sup></strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['20', '2', '2,5', '8']),
      hint: '10 · 2⁻¹ = 10 · (1/2) = 5 L.'
    };
  },
  // 15. Βιβλιοθήκη: Ταξινόμηση βιβλίων
  () => {
    const correct = '90';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Σε μια βιβλιοθήκη υπάρχουν 3 ράφια με 25 βιβλία το καθένα και προστέθηκαν άλλα 15 βιβλία. Πόσα είναι όλα τα βιβλία (<strong className="font-mono text-amber-700">3 · 25 + 15</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['120', '85', '75', '100']),
      hint: 'Πρώτα ο πολλαπλασιασμός: 3 · 25 = 75. Έπειτα 75 + 15 = 90 βιβλία.'
    };
  },
  // 16. Μισθοδοσία: Υπερωρίες (Input)
  () => {
    // 800 + 4 * 50 = 800 + 200 = 1000
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας υπάλληλος παίρνει βασικό μισθό 800€ και πληρώνεται 50€ για κάθε μία από τις 4 ώρες υπερωρίας. Ποιος είναι ο συνολικός μισθός (<strong className="font-mono text-amber-700">800 + 4 · 50</strong>);
        </span>
      ),
      correct: '1000',
      hint: '4 · 50 = 200€. Επομένως 800 + 200 = 1000€.'
    };
  },
  // 17. Γεωμετρία: Όγκος κύβου και αφαίρεση
  () => {
    const correct = '20';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Από έναν κύβο όγκου <span className="font-mono">3<sup>3</sup> cm³</span> αφαιρούμε 7 cm³. Ποιος είναι ο τελικός όγκος (<strong className="font-mono text-amber-700">3<sup>3</sup> - 7</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '27', '18', '14']),
      hint: '3³ = 27. Επομένως 27 - 7 = 20 cm³.'
    };
  },
  // 18. Τηλεπικοινωνίες: Χρέωση κλήσεων
  () => {
    const correct = '11';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα πρόγραμμα κινητής έχει πάγιο 5€ και χρέωση 2€ ανά ώρα για 3 ώρες ομιλίας. Ποιος είναι ο λογαριασμός (<strong className="font-mono text-amber-700">5 + 2 · 3</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['21', '10', '15', '13']),
      hint: '2 · 3 = 6. Άρα 5 + 6 = 11€ (όχι (5 + 2) · 3 = 21).'
    };
  },
  // 19. Βιολογία: Πληθυσμός κυττάρων
  () => {
    const correct = '32';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια αποικία ξεκινά με 2 κύτταρα και διπλασιάζεται 4 φορές. Ο τελικός αριθμός δίνεται από τον τύπο <strong className="font-mono text-amber-700">2 · 2<sup>4</sup></strong>. Πόσα είναι τα κύτταρα;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '64', '36', '20']),
      hint: '2 · 2⁴ = 2⁵ = 32 κύτταρα.'
    };
  },
  // 20. Αεροναυπηγική: Ταχύτητα ανόδου
  () => {
    const correct = '180';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα αεροσκάφος ανεβαίνει με ρυθμό που εκφράζεται ως <strong className="font-mono text-amber-700">2 · 10<sup>2</sup> - 20</strong> m/min. Ποια είναι η ταχύτητα ανόδου;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['200', '160', '80', '220']),
      hint: '2 · 10² = 2 · 100 = 200. Άρα 200 - 20 = 180 m/min.'
    };
  }
];

export default function ArithmitikiParastasiAsk() {
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = useCallback(() => {
    const shuffledTheory = [...POOL_THEORY].sort(() => Math.random() - 0.5).slice(0, 10);
    const shuffledProblems = [...POOL_PROBLEMS].sort(() => Math.random() - 0.5).slice(0, 2);

    const full12 = [...shuffledTheory, ...shuffledProblems].map((gen, idx) => ({
      id: idx + 1,
      ...gen()
    }));

    setExercises(full12);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const handleAnswerChange = (id, val) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleInputChange = (id, rawVal) => {
    if (isSubmitted) return;
    const sanitized = rawVal.replace(/[^0-9,\/\-\^\*]/g, '');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    exercises.forEach(ex => {
      const userAns = (userAnswers[ex.id] || '').trim().replace(/\s+/g, '');
      const correctAns = ex.correct.trim().replace(/\s+/g, '');
      if (userAns.toLowerCase() === correctAns.toLowerCase()) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const percentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Αριθμητικές Παραστάσεις & Προτεραιότητα | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις υπολογισμών, προτεραιότητας πράξεων και ρεαλιστικών προβλημάτων με δυνάμεις αρνητικού εκθέτη."
      backUrl="/b-gymnasiou/03-arithmitiki-parastasi"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 3
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΑΡΙΘΜΗΤΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Εξασκήσου στην ορθή σειρά των πράξεων, στους κανόνες παρενθέσεων και στις δυνάμεις με αρνητικό εκθέτη, λύνοντας 10 ασκήσεις υπολογισμών και 2 προβλήματα καθημερινότητας.
            </p>
          </div>
        </section>

        {/* Grid 12 Ασκήσεων */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {exercises.map((ex) => {
            const userVal = userAnswers[ex.id] || '';
            const isCorrect = isSubmitted && (userVal.trim().replace(/\s+/g, '').toLowerCase() === ex.correct.trim().replace(/\s+/g, '').toLowerCase());

            return (
              <div
                key={ex.id}
                className={`bg-white rounded-3xl p-5 sm:p-7 shadow-sm border transition-all flex flex-col justify-between space-y-4 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 ring-2 ring-rose-500/20'
                    : 'border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                      {ex.id}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        ex.badge === 'ΠΡΟΒΛΗΜΑ'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {ex.badge}
                    </span>
                  </div>

                  <div className="text-slate-800 text-sm sm:text-base leading-relaxed">
                    {ex.question}
                  </div>
                </div>

                <div className="pt-2">
                  {ex.type === 'mcq' ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {ex.options.map((opt, optIdx) => {
                        const isSelected = userVal === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleAnswerChange(ex.id, opt)}
                            className={`p-3 rounded-2xl border text-xs sm:text-sm font-mono font-bold transition-all text-center touch-manipulation truncate ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">
                        ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userVal}
                        onChange={(e) => handleInputChange(ex.id, e.target.value)}
                        placeholder="π.χ. 2 ή -10"
                        className="w-full h-11 px-4 rounded-xl border border-slate-300 font-mono text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs sm:text-sm">
                      {isCorrect ? (
                        <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                          <span>✓</span>
                          <span>ΣΩΣΤΟ!</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-rose-600 font-bold flex items-center gap-1.5">
                            <span>✗</span>
                            <span>ΛΑΘΟΣ</span>
                          </div>
                          <div className="text-slate-700">
                            ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <strong className="font-mono text-indigo-700">{ex.correct}</strong>
                          </div>
                        </div>
                      )}
                      {ex.hint && (
                        <div className="text-slate-500 text-xs mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                          💡 <strong>Επεξήγηση:</strong> {ex.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-950/95 backdrop-blur-md border-t border-indigo-700/60 text-white shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">ΣΚΟΡ:</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                {isSubmitted ? score : Object.keys(userAnswers).length} / 12
              </span>
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-2 border-l border-indigo-800 pl-4">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">ΕΠΙΤΥΧΙΑ:</span>
                <span className={`font-mono text-lg sm:text-xl font-black ${
                  percentage >= 75 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation"
              >
                ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
