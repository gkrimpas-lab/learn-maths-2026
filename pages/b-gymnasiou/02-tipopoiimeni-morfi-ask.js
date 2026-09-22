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
    const fallback = `${correctVal}*`;
    if (!options.includes(fallback)) options.push(fallback);
    counter++;
  }
  return options.sort(() => Math.random() - 0.5);
};

// Βοηθητικές συναρτήσεις τυχαίων τιμών
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Έλεγχος συνθήκης τυποποιημένης μορφής
  () => {
    const correct = '3,4 · 10^5';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ποιος από τους παρακάτω αριθμούς είναι γραμμένος σε <strong>ορθή τυποποιημένη μορφή</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['34 · 10^4', '0,34 · 10^6', '340 · 10^3', '0,034 · 10^7']),
      hint: 'Στην τυποποιημένη μορφή α · 10^κ πρέπει να ισχύει αυστηρά 1 ≤ |α| < 10.'
    };
  },
  // 2. Μετατροπή μεγάλου ακεραίου (π.χ. 450.000)
  () => {
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const zeros = randInt(4, 6);
    const rawNum = `${a}${b}${'0'.repeat(zeros - 1)}`;
    const correct = `${a},${b} · 10^${zeros}`;
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Ποια είναι η τυποποιημένη μορφή του αριθμού <strong className="font-mono text-indigo-700">{rawNum}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${a}${b} · 10^${zeros - 1}`,
        `0,${a}${b} · 10^${zeros + 1}`,
        `${a},${b} · 10^${zeros - 1}`,
        `${a},${b} · 10^${zeros + 1}`
      ]),
      hint: `Μετακινούμε την υποδιαστολή ${zeros} θέσεις αριστερά ώστε να μείνει μόνο το ${a},${b}.`
    };
  },
  // 3. Μετατροπή μικρού δεκαδικού (π.χ. 0,00072)
  () => {
    const a = randInt(2, 7);
    const b = randInt(1, 8);
    const zeros = randInt(3, 5);
    const rawNum = `0,${'0'.repeat(zeros - 1)}${a}${b}`;
    const correct = `${a},${b} · 10^-${zeros}`;
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Ποια είναι η τυποποιημένη μορφή του δεκαδικού <strong className="font-mono text-indigo-700">{rawNum}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${a},${b} · 10^${zeros}`,
        `${a}${b} · 10^-${zeros + 1}`,
        `0,${a}${b} · 10^-${zeros - 1}`,
        `${a},${b} · 10^-${zeros + 1}`
      ]),
      hint: `Μετακινούμε την υποδιαστολή ${zeros} θέσεις δεξιά ώστε ο συντελεστής να γίνει ${a},${b}.`
    };
  },
  // 4. Αρνητικός αριθμός σε τυποποιημένη μορφή
  () => {
    const correct = '-7,8 · 10^4';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Ποια είναι η τυποποιημένη μορφή του αριθμού <strong className="font-mono text-indigo-700">-78.000</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7,8 · 10^-4', '-78 · 10^3', '-0,78 · 10^5', '7,8 · 10^4']),
      hint: 'Το πρόσημο μείον παραμένει μπροστά στον συντελεστή: -7,8 · 10⁴.'
    };
  },
  // 5. Μετατροπή από τυποποιημένη σε φυσικό αριθμό (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΑΝΑΠΤΥΓΜΑ',
      question: (
        <span>
          Γράψε ως έναν συνηθισμένο ακέραιο αριθμό την παράσταση <strong className="font-mono text-indigo-700">3,5 · 10<sup>4</sup></strong>:
        </span>
      ),
      correct: '35000',
      hint: '3,5 · 10.000 = 35.000 (μετακινούμε την υποδιαστολή 4 θέσεις δεξιά).'
    };
  },
  // 6. Μετατροπή από τυποποιημένη σε δεκαδικό (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΑΝΑΠΤΥΓΜΑ',
      question: (
        <span>
          Γράψε ως δεκαδικό αριθμό (με κόμμα) την παράσταση <strong className="font-mono text-indigo-700">4 · 10<sup>-3</sup></strong>:
        </span>
      ),
      correct: '0,004',
      hint: '4 · 10⁻³ = 4 / 1.000 = 0,004 (μετακινούμε την υποδιαστολή 3 θέσεις αριστερά).'
    };
  },
  // 7. Διόρθωση συντελεστή που υπερβαίνει το 10 (45 · 10^3)
  () => {
    const correct = '4,5 · 10^4';
    return {
      type: 'mcq',
      badge: 'ΑΠΛΟΠΟΙΗΣΗ',
      question: (
        <span>
          Ποια είναι η σωστή τυποποιημένη μορφή της έκφρασης <strong className="font-mono text-indigo-700">45 · 10<sup>3</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4,5 · 10^2', '45 · 10^3', '0,45 · 10^5', '4,5 · 10^5']),
      hint: '45 = 4,5 · 10¹. Άρα 4,5 · 10¹ · 10³ = 4,5 · 10⁴.'
    };
  },
  // 8. Διόρθωση συντελεστή μικρότερου του 1 (0,06 · 10^5)
  () => {
    const correct = '6 · 10^3';
    return {
      type: 'mcq',
      badge: 'ΑΠΛΟΠΟΙΗΣΗ',
      question: (
        <span>
          Ποια είναι η σωστή τυποποιημένη μορφή της έκφρασης <strong className="font-mono text-indigo-700">0,06 · 10<sup>5</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6 · 10^7', '6 · 10^4', '0,6 · 10^4', '60 · 10^2']),
      hint: '0,06 = 6 · 10⁻². Άρα 6 · 10⁻² · 10⁵ = 6 · 10³.'
    };
  },
  // 9. Γινόμενο τυποποιημένων αριθμών
  () => {
    const correct = '6 · 10^7';
    return {
      type: 'mcq',
      badge: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε το γινόμενο: <strong className="font-mono text-indigo-700">(2 · 10<sup>3</sup>) · (3 · 10<sup>4</sup>)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6 · 10^12', '5 · 10^7', '6 · 10^1', '5 · 10^12']),
      hint: '(2 · 3) · 10³⁺⁴ = 6 · 10⁷.'
    };
  },
  // 10. Πηλίκο τυποποιημένων αριθμών
  () => {
    const correct = '4 · 10^3';
    return {
      type: 'mcq',
      badge: 'ΔΙΑΙΡΕΣΗ',
      question: (
        <span>
          Υπολόγισε το πηλίκο: <strong className="font-mono text-indigo-700">(8 · 10<sup>7</sup>) : (2 · 10<sup>4</sup>)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^11', '4 · 10^-3', '6 · 10^3', '16 · 10^3']),
      hint: '(8 : 2) · 10⁷⁻⁴ = 4 · 10³.'
    };
  },
  // 11. Γινόμενο όπου το γινόμενο των συντελεστών ξεπερνά το 10
  () => {
    const correct = '1,5 · 10^7';
    return {
      type: 'mcq',
      badge: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε σε τυποποιημένη μορφή το γινόμενο: <strong className="font-mono text-indigo-700">(5 · 10<sup>2</sup>) · (3 · 10<sup>4</sup>)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['15 · 10^6', '1,5 · 10^6', '1,5 · 10^8', '8 · 10^6']),
      hint: '5 · 3 = 15. Άρα 15 · 10⁶ = 1,5 · 10⁷.'
    };
  },
  // 12. Πηλίκο όπου ο συντελεστής είναι μικρότερος του 1
  () => {
    const correct = '5 · 10^3';
    return {
      type: 'mcq',
      badge: 'ΔΙΑΙΡΕΣΗ',
      question: (
        <span>
          Υπολόγισε σε τυποποιημένη μορφή το πηλίκο: <strong className="font-mono text-indigo-700">(2 · 10<sup>6</sup>) : (4 · 10<sup>2</sup>)</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0,5 · 10^4', '5 · 10^4', '5 · 10^2', '2 · 10^4']),
      hint: '2 : 4 = 0,5. Άρα 0,5 · 10⁴ = 5 · 10³.'
    };
  },
  // 13. Σύγκριση δύο αριθμών σε τυποποιημένη μορφή (διαφορετικός εκθέτης)
  () => {
    const correct = '9,1 · 10^5 < 1,2 · 10^6';
    return {
      type: 'mcq',
      badge: 'ΣΥΓΚΡΙΣΗ',
      question: (
        <span>
          Ποια σχέση ισχύει ανάμεσα στους αριθμούς <span className="font-mono font-bold">Α = 9,1 · 10<sup>5</sup></span> και <span className="font-mono font-bold">Β = 1,2 · 10<sup>6</sup></span>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '9,1 · 10^5 > 1,2 · 10^6',
        '9,1 · 10^5 = 1,2 · 10^6',
        'Δεν μπορούν να συγκριθούν',
        '9,1 · 10^5 ≥ 1,2 · 10^6'
      ]),
      hint: 'Ο Β έχει μεγαλύτερο εκθέτη του 10 (10⁶ έναντι 10⁵), άρα είναι μεγαλύτερος (1.200.000 > 910.000).'
    };
  },
  // 14. Σύγκριση δύο αριθμών με ίδιο εκθέτη
  () => {
    const correct = '7,2 · 10^-4 > 4,9 · 10^-4';
    return {
      type: 'mcq',
      badge: 'ΣΥΓΚΡΙΣΗ',
      question: (
        <span>
          Ποια σχέση ισχύει ανάμεσα στους αριθμούς <span className="font-mono font-bold">7,2 · 10<sup>-4</sup></span> και <span className="font-mono font-bold">4,9 · 10<sup>-4</sup></span>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '7,2 · 10^-4 < 4,9 · 10^-4',
        '7,2 · 10^-4 = 4,9 · 10^-4',
        '4,9 · 10^-4 > 7,2 · 10^-4',
        '7,2 · 10^-4 ≤ 4,9 · 10^-4'
      ]),
      hint: 'Όταν οι εκθέτες του 10 είναι ίδιοι, συγκρίνουμε απευθείας τους συντελεστές (7,2 > 4,9).'
    };
  },
  // 15. Δύναμη τυποποιημένου αριθμού: (2 · 10^3)^2
  () => {
    const correct = '4 · 10^6';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Υπολόγισε την τιμή της δύναμης: <strong className="font-mono text-indigo-700">(2 · 10<sup>3</sup>)<sup>2</sup></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^5', '2 · 10^6', '4 · 10^9', '8 · 10^6']),
      hint: '2² · (10³)² = 4 · 10⁶.'
    };
  },
  // 16. Τυποποιημένη μορφή του 1.000.000 (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Αν ο αριθμός 1.000.000 γραφτεί στη μορφή <strong className="font-mono text-indigo-700">10<sup>κ</sup></strong>, ποιος είναι ο ακέραιος <span className="font-mono font-bold">κ</span>;
        </span>
      ),
      correct: '6',
      hint: 'Το 1.000.000 έχει 6 μηδενικά, άρα ισούται με 10⁶.'
    };
  },
  // 17. Τυποποιημένη μορφή του 0,00001 (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Αν ο δεκαδικός 0,00001 γραφτεί στη μορφή <strong className="font-mono text-indigo-700">10<sup>κ</sup></strong>, ποιος είναι ο ακέραιος <span className="font-mono font-bold">κ</span>;
        </span>
      ),
      correct: '-5',
      hint: 'Η υποδιαστολή μετακινείται 5 θέσεις δεξιά, άρα κ = -5 (10⁻⁵).'
    };
  },
  // 18. Μετατροπή 9,4 εκατομμυρίων
  () => {
    const correct = '9,4 · 10^6';
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Πώς εκφράζεται σε τυποποιημένη μορφή η ποσότητα <strong className="font-mono text-indigo-700">9,4 εκατομμύρια</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9,4 · 10^5', '94 · 10^6', '0,94 · 10^7', '9,4 · 10^9']),
      hint: '1 εκατομμύριο = 10⁶. Επομένως 9,4 εκατομμύρια = 9,4 · 10⁶.'
    };
  },
  // 19. Μετατροπή 3 δισεκατομμυρίων
  () => {
    const correct = '3 · 10^9';
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Πώς εκφράζεται σε τυποποιημένη μορφή η ποσότητα <strong className="font-mono text-indigo-700">3 δισεκατομμύρια</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3 · 10^6', '3 · 10^12', '30 · 10^8', '0,3 · 10^10']),
      hint: '1 δισεκατομμύριο = 10⁹. Άρα 3 δισεκατομμύρια = 3 · 10⁹.'
    };
  },
  // 20. Ακέραιο μέρος ίσο με 1
  () => {
    const correct = '1,05 · 10^2';
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Ποια είναι η τυποποιημένη μορφή του αριθμού <strong className="font-mono text-indigo-700">105</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10,5 · 10^1', '1,05 · 10^3', '0,105 · 10^3', '1,5 · 10^2']),
      hint: '105 = 1,05 · 10² (μετακίνηση 2 θέσεις αριστερά).'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Αστρονομία: Απόσταση Γης - Σελήνης
  () => {
    const correct = '3,84 · 10^8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η μέση απόσταση της Γης από τη Σελήνη είναι περίπου <strong className="font-mono text-amber-700">384.000.000 μέτρα</strong>. Ποια είναι η τυποποιημένη μορφή της απόστασης αυτής σε μέτρα;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3,84 · 10^6', '38,4 · 10^7', '0,384 · 10^9', '3,84 · 10^-8']),
      hint: '384.000.000 m = 3,84 · 10⁸ m (μετακίνηση υποδιαστολής 8 θέσεις αριστερά).'
    };
  },
  // 2. Φυσική: Ταχύτητα του φωτός
  () => {
    const correct = '3 · 10^8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το φως ταξιδεύει στο κενό με ταχύτητα <strong className="font-mono text-amber-700">300.000.000 m/s</strong>. Πώς γράφεται η ταχύτητα αυτή σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3 · 10^7', '30 · 10^7', '3 · 10^6', '0,3 · 10^9']),
      hint: '300.000.000 = 3 · 10⁸ m/s.'
    };
  },
  // 3. Βιολογία: Ερυθρό αιμοσφαίριο
  () => {
    const correct = '7,5 · 10^-6';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η διάμετρος ενός ερυθρού αιμοσφαιρίου είναι περίπου <strong className="font-mono text-amber-700">0,0000075 μέτρα</strong>. Ποια είναι η τυποποιημένη μορφή αυτού του μεγέθους;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7,5 · 10^-5', '75 · 10^-7', '0,75 · 10^-5', '7,5 · 10^6']),
      hint: 'Μετακινούμε την υποδιαστολή 6 θέσεις δεξιά: 7,5 · 10⁻⁶ m.'
    };
  },
  // 4. Νανοτεχνολογία: Πάχος νανοσωλήνα άνθρακα
  () => {
    const correct = '1,4 · 10^-9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας νανοσωλήνας άνθρακα έχει διάμετρο <strong className="font-mono text-amber-700">0,0000000014 m</strong> (1,4 nm). Πώς γράφεται σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1,4 · 10^-8', '14 · 10^-10', '1,4 · 10^-10', '0,14 · 10^-8']),
      hint: 'Μετακινούμε την υποδιαστολή 9 θέσεις δεξιά: 1,4 · 10⁻⁹ m.'
    };
  },
  // 5. Χημεία: Μάζα μορίου οξυγόνου
  () => {
    const correct = '5,3 · 10^-23';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η μάζα ενός μορίου οξυγόνου δίνεται ως <strong className="font-mono text-amber-700">53 · 10<sup>-24</sup> γραμμάρια</strong>. Ποια είναι η ορθή τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['5,3 · 10^-25', '5,3 · 10^-23', '0,53 · 10^-22', '5,3 · 10^23']),
      hint: '53 = 5,3 · 10¹. Άρα 5,3 · 10¹ · 10⁻²⁴ = 5,3 · 10⁻²³ g.'
    };
  },
  // 6. Πληθυσμιακή Στατιστική: Πληθυσμός της Γης
  () => {
    const correct = '8 · 10^9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο πληθυσμός του πλανήτη μας υπολογίζεται σε περίπου <strong className="font-mono text-amber-700">8.000.000.000 ανθρώπους</strong>. Ποια είναι η τυποποιημένη μορφή του αριθμού αυτού;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['8 · 10^8', '80 · 10^8', '8 · 10^10', '0,8 · 10^10']),
      hint: '8.000.000.000 = 8 · 10⁹.'
    };
  },
  // 7. Πληροφορική: Χωρητικότητα σκληρού δίσκου
  () => {
    const correct = '2 · 10^12';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας σκληρός δίσκος 2 Terabytes περιέχει <strong className="font-mono text-amber-700">2.000.000.000.000 bytes</strong>. Πώς εκφράζεται σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2 · 10^9', '20 · 10^11', '2 · 10^12', '2 · 10^15']),
      hint: 'Το 2 ακολουθείται από 12 μηδενικά: 2 · 10¹² bytes.'
    };
  },
  // 8. Αστρονομία: Χρόνος ταξιδιού φωτός (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η απόσταση Γης - Ήλιου είναι <span className="font-mono">1,5 · 10<sup>11</sup> m</span> και η ταχύτητα του φωτός <span className="font-mono">3 · 10<sup>8</sup> m/s</span>. Υπολόγισε το πηλίκο <strong className="font-mono text-amber-700">(1,5 · 10<sup>11</sup>) : (3 · 10<sup>8</sup>)</strong> σε δευτερόλεπτα:
        </span>
      ),
      correct: '500',
      hint: '(1,5 : 3) · 10¹¹⁻⁸ = 0,5 · 10³ = 500 δευτερόλεπτα.'
    };
  },
  // 9. Οικολογία: Σταγόνες νερού σε πισίνα
  () => {
    const correct = '1,2 · 10^9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μία δημοτική πισίνα περιέχει <strong className="font-mono text-amber-700">1.200.000.000 σταγόνες νερού</strong>. Ποια είναι η τυποποιημένη μορφή του αριθμού αυτού;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1,2 · 10^8', '12 · 10^8', '1,2 · 10^9', '0,12 · 10^10']),
      hint: '1.200.000.000 = 1,2 · 10⁹.'
    };
  },
  // 10. Μικροβιολογία: Πληθυσμός βακτηρίων μετά από πολλαπλασιασμό
  () => {
    const correct = '4 · 10^8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μία καλλιέργεια έχει <span className="font-mono">2 · 10<sup>5</sup></span> βακτήρια ανά ml σε δοχείο <span className="font-mono">2 · 10<sup>3</sup> ml</span>. Πόσα είναι συνολικά τα βακτήρια;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^15', '4 · 10^8', '2 · 10^8', '4 · 10^2']),
      hint: '(2 · 10⁵) · (2 · 10³) = (2 · 2) · 10⁵⁺³ = 4 · 10⁸.'
    };
  },
  // 11. Φυσική: Μάζα της Γης
  () => {
    const correct = '6 · 10^24';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η μάζα της Γης είναι περίπου <strong className="font-mono text-amber-700">6.000.000.000.000.000.000.000.000 kg</strong> (το 6 ακολουθείται από 24 μηδενικά). Ποια είναι η τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6 · 10^21', '6 · 10^23', '6 · 10^24', '60 · 10^23']),
      hint: '6 ακολουθούμενο από 24 μηδενικά = 6 · 10²⁴ kg.'
    };
  },
  // 12. Χημεία: Διάμετρος ατόμου
  () => {
    const correct = '1 · 10^-10';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η διάμετρος ενός ατόμου υδρογόνου είναι <strong className="font-mono text-amber-700">0,0000000001 μέτρα</strong>. Πώς γράφεται σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1 · 10^-9', '1 · 10^-11', '1 · 10^-10', '0,1 · 10^-9']),
      hint: 'Μετακίνηση 10 θέσεις δεξιά: 1 · 10⁻¹⁰ m (1 Angstrom).'
    };
  },
  // 13. Οικονομία: Εθνικό χρέος
  () => {
    const correct = '3,5 · 10^11';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το χρέος μιας χώρας ανέρχεται σε <strong className="font-mono text-amber-700">350 δισεκατομμύρια ευρώ</strong>. Ποια είναι η τυποποιημένη μορφή σε ευρώ;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3,5 · 10^9', '35 · 10^10', '3,5 · 10^11', '3,5 · 10^12']),
      hint: '350 δις = 350 · 10⁹ = 3,5 · 10¹¹ €.'
    };
  },
  // 14. Αστρονομία: Έτος φωτός
  () => {
    const correct = '9,46 · 10^12';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα έτος φωτός ισούται με περίπου <strong className="font-mono text-amber-700">9.460.000.000.000 χιλιόμετρα</strong>. Ποια είναι η τυποποιημένη μορφή σε km;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9,46 · 10^9', '9,46 · 10^11', '9,46 · 10^12', '94,6 · 10^11']),
      hint: '9.460.000.000.000 = 9,46 · 10¹² km.'
    };
  },
  // 15. Μικροηλεκτρονική: Μέγεθος transistor
  () => {
    const correct = '3 · 10^-9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η νεότερη γενιά επεξεργαστών χρησιμοποιεί transistors μεγέθους <strong className="font-mono text-amber-700">3 νανομέτρων (0,000000003 m)</strong>. Ποια είναι η τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3 · 10^-8', '3 · 10^-9', '3 · 10^-10', '0,3 · 10^-8']),
      hint: '0,000000003 m = 3 · 10⁻⁹ m.'
    };
  },
  // 16. Ιατρική: Αριθμός κυττάρων στο ανθρώπινο σώμα
  () => {
    const correct = '3,7 · 10^13';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το ανθρώπινο σώμα αποτελείται από περίπου <strong className="font-mono text-amber-700">37 τρισεκατομμύρια κύτταρα</strong> (37.000.000.000.000). Πώς γράφεται σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3,7 · 10^12', '3,7 · 10^13', '37 · 10^12', '0,37 · 10^14']),
      hint: '37 τρισεκατομμύρια = 37 · 10¹² = 3,7 · 10¹³.'
    };
  },
  // 17. Ενέργεια: Παραγωγή ηλιακής ενέργειας (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα ηλιακό πάρκο παράγει <span className="font-mono">4 · 10<sup>6</sup> Watts</span> την ημέρα. Σε 200 ημέρες (<span className="font-mono">2 · 10<sup>2</sup></span>), αν η συνολική ενέργεια είναι <strong className="font-mono text-amber-700">8 · 10<sup>κ</sup> Watts</strong>, ποιος είναι ο εκθέτης <span className="font-mono font-bold">κ</span>;
        </span>
      ),
      correct: '8',
      hint: '(4 · 10⁶) · (2 · 10²) = 8 · 10⁶⁺² = 8 · 10⁸. Άρα κ = 8.'
    };
  },
  // 18. Ωκεανογραφία: Όγκος νερού ωκεανών
  () => {
    const correct = '1,3 · 10^9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο συνολικός όγκος νερού στους ωκεανούς της Γης είναι περίπου <strong className="font-mono text-amber-700">1.300.000.000 κυβικά χιλιόμετρα</strong>. Ποια είναι η τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1,3 · 10^8', '13 · 10^8', '1,3 · 10^9', '1,3 · 10^10']),
      hint: '1.300.000.000 = 1,3 · 10⁹ km³.'
    };
  },
  // 19. Γεωλογία: Ηλικία της Γης
  () => {
    const correct = '4,5 · 10^9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η ηλικία της Γης εκτιμάται σε <strong className="font-mono text-amber-700">4,5 δισεκατομμύρια χρόνια</strong>. Πώς γράφεται σε τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4,5 · 10^6', '45 · 10^8', '4,5 · 10^9', '4,5 · 10^12']),
      hint: '4,5 δις = 4,5 · 10⁹ έτη.'
    };
  },
  // 20. Ατμοσφαιρική πίεση: Μόρια σε έναν όγκο αέρα
  () => {
    const correct = '2,5 · 10^19';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Σε ένα κυβικό εκατοστό αέρα υπάρχουν περίπου <strong className="font-mono text-amber-700">25.000.000.000.000.000.000 μόρια</strong> (το 25 ακολουθείται από 18 μηδενικά). Ποια είναι η τυποποιημένη μορφή;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2,5 · 10^18', '25 · 10^18', '2,5 · 10^19', '2,5 · 10^20']),
      hint: '25 · 10¹⁸ = 2,5 · 10¹⁹ μόρια.'
    };
  }
];

export default function TipopoiimeniMorfiAsk() {
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 12 ασκήσεων: 10 Θεωρίας/Πράξεων + 2 Ρεαλιστικών Προβλημάτων
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
      title="Ασκήσεις: Τυποποιημένη Μορφή | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις υπολογισμών, μετατροπών και ρεαλιστικών προβλημάτων στην τυποποιημένη μορφή ρητών αριθμών."
      backUrl="/b-gymnasiou/02-tipopoiimeni-morfi"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 2
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ ΡΗΤΩΝ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Εξασκήσου στην αναγνώριση, μετατροπή και τις πράξεις αριθμών σε τυποποιημένη μορφή, καθώς και σε πραγματικές εφαρμογές στις φυσικές επιστήμες.
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
                        placeholder="π.χ. 35000 ή 0,004 ή 6"
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
