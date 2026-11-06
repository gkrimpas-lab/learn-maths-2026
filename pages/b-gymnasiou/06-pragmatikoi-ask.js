import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component Frac με ασφαλή ανίχνευση προσήμου
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

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-1 relative font-mono font-semibold ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-4 sm:pl-4.5 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Component Power: σκούρο χρώμα, παρένθεση ΜΟΝΟ σε αρνητικό εκθέτη
const Power = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const formattedExp = isNeg ? `(${exp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono ${className}`}>
      <span>{base}</span>
      <sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs sm:text-sm">
        {formattedExp}
      </sup>
    </span>
  );
};

// Εξασφάλιση 4 μοναδικών επιλογών στα MCQs
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
    const fallback = `${correctVal} (${counter})`;
    if (!options.includes(fallback)) options.push(fallback);
    counter++;
  }
  return options.sort(() => Math.random() - 0.5);
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Δύναμη ρίζας: (√α)² = α
  () => {
    const a = [2, 3, 5, 7, 11][Math.floor(Math.random() * 5)];
    const correct = `${a}`;
    return {
      type: 'mcq',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή της δύναμης: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>{a}</Sqrt>)²</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a * a}`, `${2 * a}`, '1', `${a + 2}`]),
      hint: `Για κάθε θετικό αριθμό ισχύει (√α)² = α. Άρα (√${a})² = ${a}.`
    };
  },
  // 2. Δύναμη ρίζας σε τέταρτη δύναμη: (√α)⁴
  () => {
    const a = [2, 3][Math.floor(Math.random() * 2)];
    const correct = `${a * a}`;
    return {
      type: 'input',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>{a}</Sqrt>)⁴</strong>
        </span>
      ),
      correct,
      hint: `Ισχύει (√${a})⁴ = ((√${a})²)² = ${a}² = ${a * a}.`
    };
  },
  // 3. Δύναμη ρίζας με αρνητικό εκθέτη: (√α)⁻²
  () => {
    const a = [2, 3, 5][Math.floor(Math.random() * 3)];
    const correct = `1/${a}`;
    return {
      type: 'mcq',
      badge: 'ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ποια είναι η τιμή της δύναμης: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>{a}</Sqrt>)<sup className="text-slate-900 font-bold ml-0.5">(-2)</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}`, `-${a}`, `-1/${a}`, `1/${a * a}`]),
      hint: `Ισχύει (√${a})⁻² = 1 / (√${a})² = 1/${a}.`
    };
  },
  // 4. Εγκλεισμός συνόλων
  () => {
    const correct = 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ';
    return {
      type: 'mcq',
      badge: 'ΣΥΝΟΛΑ',
      question: (
        <span>
          Ποια είναι η σωστή ιεραρχία εγκλεισμού των αριθμητικών συνόλων;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'ℕ ⊂ ℚ ⊂ ℤ ⊂ ℝ',
        'ℤ ⊂ ℕ ⊂ ℚ ⊂ ℝ',
        'ℚ ⊂ ℤ ⊂ ℕ ⊂ ℝ'
      ]),
      hint: 'Κάθε φυσικός είναι ακέραιος, κάθε ακέραιος είναι ρητός και κάθε ρητός είναι πραγματικός αριθμός: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.'
    };
  },
  // 5. Τετράγωνος αριθμός
  () => {
    const correct = '49';
    return {
      type: 'mcq',
      badge: 'ΤΕΤΡΑΓΩΝΟΙ',
      question: (
        <span>
          Ποιος από τους παρακάτω αριθμούς είναι <strong>τετράγωνος αριθμός</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['24', '30', '50', '18']),
      hint: 'Επειδή 7² = 49, ο αριθμός 49 είναι τετράγωνος αριθμός.'
    };
  },
  // 6. Μηδενικός εκθέτης σε άρρητη βάση
  () => {
    const correct = '1';
    return {
      type: 'input',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή της παράστασης: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>7</Sqrt>)⁰</strong>
        </span>
      ),
      correct,
      hint: 'Κάθε μη μηδενικός πραγματικός αριθμός υψωμένος στο μηδέν ισούται με 1.'
    };
  },
  // 7. Γινόμενο δυνάμεων με βάση ρίζα
  () => {
    // (√2)³ · (√2) = (√2)⁴ = 4
    const correct = '4';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε το γινόμενο: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>2</Sqrt>)³ · <Sqrt>2</Sqrt></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '8', '16', '√8']),
      hint: '(√2)³ · (√2)¹ = (√2)⁴ = ((√2)²)² = 2² = 4.'
    };
  },
  // 8. Πηλίκο δυνάμεων με βάση ρίζα
  () => {
    // (√5)⁵ : (√5)³ = (√5)² = 5
    const correct = '5';
    return {
      type: 'input',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε το πηλίκο: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>5</Sqrt>)⁵ : (<Sqrt>5</Sqrt>)³</strong>
        </span>
      ),
      correct,
      hint: '(√5)⁵ : (√5)³ = (√5)⁵⁻³ = (√5)² = 5.'
    };
  },
  // 9. Τοποθέτηση στην ευθεία: √2
  () => {
    const correct = '1 και 2';
    return {
      type: 'mcq',
      badge: 'ΕΥΘΕΙΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Στην ευθεία των πραγματικών, το σημείο </span>
          <strong className="text-indigo-700 text-lg mx-1"><Sqrt>2</Sqrt></strong>
          <span> βρίσκεται ανάμεσα στους ακεραίους:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0 και 1', '2 και 3', '-1 και 0']),
      hint: '1² = 1 και 2² = 4. Επειδή 1 < 2 < 4, έχουμε 1 < √2 < 2 (√2 ≈ 1,414).'
    };
  },
  // 10. Τοποθέτηση στην ευθεία: -√5
  () => {
    const correct = '-3 και -2';
    return {
      type: 'mcq',
      badge: 'ΕΥΘΕΙΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Στην ευθεία των πραγματικών, το σημείο </span>
          <strong className="text-indigo-700 text-lg mx-1">-<Sqrt>5</Sqrt></strong>
          <span> βρίσκεται ανάμεσα στους ακεραίους:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-2 και -1', '-4 και -3', '2 και 3']),
      hint: '2 < √5 < 3 (αφού 4 < 5 < 9). Πολλαπλασιάζοντας με -1: -3 < -√5 < -2.'
    };
  },
  // 11. Δύναμη γινομένου: (2 · √3)²
  () => {
    // 2² * (√3)² = 4 * 3 = 12
    const correct = '12';
    return {
      type: 'input',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή: </span>
          <strong className="text-indigo-700 text-lg mx-1">(2 · <Sqrt>3</Sqrt>)²</strong>
        </span>
      ),
      correct,
      hint: '(2 · √3)² = 2² · (√3)² = 4 · 3 = 12.'
    };
  },
  // 12. Δύναμη πηλίκου με ρίζα
  () => {
    // (√6 / √2)² = (√3)² = 3
    const correct = '3';
    return {
      type: 'mcq',
      badge: 'ΔΥΝΑΜΕΙΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>6</Sqrt> : <Sqrt>2</Sqrt>)²</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6', '2', '9', '12']),
      hint: '√6 : √2 = √(6 : 2) = √3. Άρα (√3)² = 3.'
    };
  },
  // 13. Σύνολο στο οποίο ανήκει ο αριθμός 0
  () => {
    const correct = 'Στους φυσικούς, ακέραιους, ρητούς και πραγματικούς';
    return {
      type: 'mcq',
      badge: 'ΣΥΝΟΛΑ',
      question: (
        <span>
          Σε ποια σύνολα ανήκει ο αριθμός <strong className="text-indigo-700 font-mono">0</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Μόνο στους φυσικούς αριθμούς',
        'Μόνο στους ακεραίους',
        'Στους άρρητους αριθμούς'
      ]),
      hint: 'Το 0 είναι φυσικός, άρα αυτόματα ανήκει και στα ℤ, ℚ και ℝ.'
    };
  },
  // 14. Σύνθετος υπολογισμός με ρίζες
  () => {
    // (√7)² + (√3)² = 7 + 3 = 10
    const correct = '10';
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε το άθροισμα: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>7</Sqrt>)² + (<Sqrt>3</Sqrt>)²</strong>
        </span>
      ),
      correct,
      hint: '(√7)² = 7 και (√3)² = 3. Άρα 7 + 3 = 10.'
    };
  },
  // 15. Δύναμη σε δύναμη με πραγματική βάση
  () => {
    // ((√2)²)³ = 2³ = 8
    const correct = '8';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή: </span>
          <strong className="text-indigo-700 text-lg mx-1">((<Sqrt>2</Sqrt>)²)³</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '16', '64', '2']),
      hint: 'Εσωτερικά: (√2)² = 2. Επομένως 2³ = 8.'
    };
  },
  // 16. Τετράγωνος αριθμός (εύρεση ρίζας)
  () => {
    const correct = '9';
    return {
      type: 'input',
      badge: 'ΤΕΤΡΑΓΩΝΟΙ',
      question: (
        <span>
          Αν ο αριθμός 81 είναι τετράγωνος αριθμός, ποιος είναι ο φυσικός αριθμός ν τέτοιος ώστε <strong className="font-mono text-indigo-700">ν² ＝ 81</strong>;
        </span>
      ),
      correct,
      hint: '9² = 81, άρα ο αριθμός είναι το 9.'
    };
  },
  // 17. Άρρητος στην ευθεία: π
  () => {
    const correct = '3 και 4';
    return {
      type: 'mcq',
      badge: 'ΕΥΘΕΙΑ',
      question: (
        <span>
          Ο αριθμός <strong className="text-indigo-700 text-lg font-serif">π</strong> βρίσκεται στην ευθεία των πραγματικών ανάμεσα στους ακεραίους:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2 και 3', '4 και 5', '1 και 2']),
      hint: 'π ≈ 3,14159... Επομένως 3 < π < 4.'
    };
  },
  // 18. Αντίστροφος δύναμης με βάση ρίζα
  () => {
    // 1 / (√5)⁻¹ = √5
    const correct = '√5';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η έκφραση </span>
          <strong className="text-indigo-700 text-lg mx-1">1 : (<Sqrt>5</Sqrt>)<sup className="text-slate-900 font-bold ml-0.5">(-1)</sup></strong>
          <span> ισούται με:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/5', '5', '-√5']),
      hint: '1 : α⁻¹ = α. Άρα 1 : (√5)⁻¹ = √5.'
    };
  },
  // 19. Έλεγχος συνόλου: -√16
  () => {
    const correct = 'Ακέραιος και Ρητός';
    return {
      type: 'mcq',
      badge: 'ΣΥΝΟΛΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ο αριθμός </span>
          <strong className="text-indigo-700 text-lg mx-1">-<Sqrt>16</Sqrt></strong>
          <span> είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Άρρητος αριθμός',
        'Μόνο φυσικός αριθμός',
        'Δεν ανήκει στους πραγματικούς'
      ]),
      hint: '-√16 = -4. Το -4 είναι ακέραιος (και ρητός και πραγματικός), αλλά όχι φυσικός.'
    };
  },
  // 20. Αφαίρεση δυνάμεων με ρίζες
  () => {
    // (√10)² - (√6)² = 10 - 6 = 4
    const correct = '4';
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε την τιμή: </span>
          <strong className="text-indigo-700 text-lg mx-1">(<Sqrt>10</Sqrt>)² - (<Sqrt>6</Sqrt>)²</strong>
        </span>
      ),
      correct,
      hint: '(√10)² = 10 και (√6)² = 6. Άρα 10 - 6 = 4.'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Γεωμετρία: Διαγώνιος τετραγώνου 1x1
  () => {
    const correct = '√2';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο πλακάκι έχει πλευρά 1 m. Πόσα μέτρα είναι το ακριβές μήκος της διαγωνίου του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '1,5', '√3', '1']),
      hint: 'Από το Πυθαγόρειο Θεώρημα: d² = 1² + 1² = 2, άρα d = √2 m.'
    };
  },
  // 2. Εμβαδόν από διαγώνιο τετραγώνου
  () => {
    // Ε = d² / 2. Αν d = √10 -> d² = 10 -> Ε = 5
    const correct = '5';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η διαγώνιος ενός τετραγώνου είναι </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>10</Sqrt> m</strong>.
          <span> Αν το εμβαδόν του δίνεται από τον τύπο Ε ＝ d² / 2, πόσα m² είναι το εμβαδόν;</span>
        </span>
      ),
      correct,
      hint: 'd² = (√10)² = 10. Επομένως Ε = 10 / 2 = 5 m².'
    };
  },
  // 3. Κατασκευή διαγωνίου ορθογωνίου 2x1
  () => {
    const correct = '√5';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Σε ένα ορθογώνιο τρίγωνο οι κάθετες πλευρές έχουν μήκη 2 m και 1 m. Πόσο είναι το ακριβές μήκος της υποτείνουσας;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3', '√3', '5', '2,5']),
      hint: 'c² = 2² + 1² = 4 + 1 = 5, άρα c = √5 m.'
    };
  },
  // 4. Περίμετρος τετραγώνου με πλευρά √3
  () => {
    const correct = '4 · √3';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ένα τετράγωνο παρτέρι έχει πλευρά </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>3</Sqrt> m</strong>.
          <span> Ποια είναι η περίμετρός του;</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3', '12', '√12', '6']),
      hint: 'Περίμετρος Π = 4 · α = 4 · √3 m.'
    };
  },
  // 5. Εμβαδόν τετραγώνου με πλευρά √8 (Input)
  () => {
    // Ε = (√8)² = 8
    const correct = '8';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ένα τετράγωνο έχει πλευρά </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>8</Sqrt> cm</strong>.
          <span> Πόσα cm² είναι το εμβαδόν του;</span>
        </span>
      ),
      correct,
      hint: 'Ε = α² = (√8)² = 8 cm².'
    };
  },
  // 6. Διπλασιασμός επιφάνειας τετραγώνου
  () => {
    const correct = '√2';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Αν ένα τετράγωνο εμβαδού 1 m² διπλασιαστεί σε εμβαδόν (γίνει 2 m²), πόσα μέτρα θα είναι η νέα του πλευρά;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '1,4', '4', '1']),
      hint: 'Νέα πλευρά: α² = 2, άρα α = √2 m.'
    };
  },
  // 7. Πυθαγόρειο σε οικόπεδο
  () => {
    // 3² + 4² = 25 -> c = 5 (Ρητός)
    const correct = 'Ρητός αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα ορθογώνιο οικόπεδο έχει διαστάσεις 3 m και 4 m. Το μήκος της διαγωνίου του είναι ρητός ή άρρητος αριθμός;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Άρρητος αριθμός',
        'Μη πραγματικός αριθμός',
        'Μόνο κλασματικός'
      ]),
      hint: 'd² = 3² + 4² = 9 + 16 = 25, άρα d = √25 = 5 m (ακέραιος, άρα ρητός αριθμός).'
    };
  },
  // 8. Υπολογισμός ταχύτητας σώματος (Input)
  () => {
    // v = √(2 * 10 * 5) = √100 = 10 m/s
    const correct = '10';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η ταχύτητα πτώσης ενός σώματος από ύψος h = 5 m δίνεται από τον τύπο </span>
          <strong className="text-amber-800 text-lg mx-1">v ＝ <Sqrt>2 · 10 · 5</Sqrt> m/s</strong>.
          <span> Πόσα m/s είναι η ταχύτητα;</span>
        </span>
      ),
      correct,
      hint: 'v = √(2 · 10 · 5) = √100 = 10 m/s.'
    };
  },
  // 9. Περίφραξη τετραγώνου εμβαδού 7 m²
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η πλευρά ενός τετράγωνου κήπου εμβαδού 7 m² είναι α = √7 m. Το μήκος του σύρματος που απαιτείται για να περιφραχτεί είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Ακέραιος αριθμός',
        'Πεπερασμένος δεκαδικός'
      ]),
      hint: 'Περίμετρος Π = 4 · √7 m. Το γινόμενο ρητού με άρρητο είναι άρρητος αριθμός.'
    };
  },
  // 10. Πάχος νανοϋλικού ως δύναμη
  () => {
    // (10⁻³)² = 10⁻⁶
    const correct = '10^-6';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Το εμβαδόν μιας μικροσκοπικής τετράγωνης μεμβράνης με πλευρά </span>
          <strong className="text-amber-800 text-lg mx-1">10<sup className="text-slate-900 font-bold ml-0.5">(-3)</sup> m</strong>
          <span> είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^-5', '10^-9', '10^-1', '10^6']),
      hint: 'Ε = (10⁻³)² = 10⁻⁶ m².'
    };
  },
  // 11. Κύλινδρος: Ακτίνα βάσης από εμβαδόν (Input)
  () => {
    // E = π * r² = 9π -> r² = 9 -> r = 3
    const correct = '3';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το εμβαδόν ενός κυκλικού δίσκου είναι 9π cm². Αν ισχύει Ε = π · r², πόσα cm είναι η ακτίνα r;
        </span>
      ),
      correct,
      hint: 'π · r² = 9π => r² = 9 => r = 3 cm.'
    };
  },
  // 12. Σχοινί στήριξης ιστού (Πυθαγόρειο)
  () => {
    // 1² + 3² = 1 + 9 = 10 -> c = √10
    const correct = '√10';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας ιστός ύψους 3 m στηρίζεται με σχοινί που δένεται στο έδαφος σε απόσταση 1 m από τη βάση του. Πόσο είναι το μήκος του σχοινιού;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '√8', '10', '3,5']),
      hint: 'L² = 3² + 1² = 9 + 1 = 10, άρα L = √10 m.'
    };
  },
  // 13. Πλακόστρωση με τετράγωνα πλακάκια (Input)
  () => {
    // 100 πλακάκια -> 10 ανά πλευρά
    const correct = '10';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας τεχνίτης φτιάχνει ένα μεγάλο τετράγωνο χρησιμοποιώντας 100 ίσα τετράγωνα πλακάκια. Πόσα πλακάκια τοποθετεί σε κάθε πλευρά;
        </span>
      ),
      correct,
      hint: '100 = 10², άρα σε κάθε πλευρά τοποθετούνται 10 πλακάκια.'
    };
  },
  // 14. Χρόνος αιώρησης εκκρεμούς
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η περίοδος ενός εκκρεμούς δίνεται από τον τύπο <strong className="font-mono text-amber-800">Τ ＝ 2 · π · √2</strong> δευτερόλεπτα. Ο χρόνος αυτός ανήκει στους:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητούς αριθμούς',
        'Ακέραιους αριθμούς',
        'Πεπερασμένους δεκαδικούς'
      ]),
      hint: 'Περιέχει τους άρρητους αριθμούς π και √2, επομένως το αποτέλεσμα είναι άρρητος αριθμός.'
    };
  },
  // 15. Κόστος περίφραξης τετραγώνου με πλευρά √5
  () => {
    // Π = 4√5, κόστος 10€/m -> 40√5 €
    const correct = '40 · √5';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ένα οικόπεδο έχει πλευρά </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>5</Sqrt> m</strong>.
          <span> Αν η περίφραξη κοστίζει 10€ ανά μέτρο, ποιο είναι το συνολικό κόστος;</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['20 · √5', '40', '200', '10 · √5']),
      hint: 'Περίμετρος: Π = 4 · √5 m. Κόστος: 10 · (4 · √5) = 40 · √5 €.'
    };
  },
  // 16. Τριπλασιασμός εμβαδού
  () => {
    // Ε = 3 m² -> α = √3 m
    const correct = '√3';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Αν ένα τετράγωνο έχει εμβαδόν 3 m², γράψε σε μορφή ρίζας (π.χ. √3) το μήκος της πλευράς του:
        </span>
      ),
      correct: '√3',
      hint: 'Ε = α² = 3 => α = √3 m.'
    };
  },
  // 17. Κλίση ράμπας (Πυθαγόρειο)
  () => {
    // βάση 1, ύψος 1 -> μήκος ράμπας √2
    const correct = '√2';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια ράμπα για ΑμεΑ έχει οριζόντιο μήκος 1 m και ύψος 1 m. Πόσο είναι το μήκος της κεκλιμένης επιφάνειας;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '1,5', '√3', '1']),
      hint: 'd² = 1² + 1² = 2 => d = √2 m.'
    };
  },
  // 18. Ενέργεια σωματιδίου (Δυνάμεις)
  () => {
    // (√2)⁶ = ((√2)²)³ = 2³ = 8 Joules
    const correct = '8';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η ενέργεια ενός σωματιδίου υπολογίζεται ως </span>
          <strong className="text-amber-800 text-lg mx-1">(<Sqrt>2</Sqrt>)⁶ Joules</strong>.
          <span> Πόσα Joules είναι η ενέργεια;</span>
        </span>
      ),
      correct,
      hint: '(√2)⁶ = ((√2)²)³ = 2³ = 8 Joules.'
    };
  },
  // 19. Σύγκριση αποστάσεων στην ευθεία
  () => {
    const correct = '√2 < √3';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ποια σχέση διάταξης ισχύει ανάμεσα στις αποστάσεις </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>2</Sqrt></strong>
          <span> και </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>3</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['√2 > √3', '√2 = √3', 'Δεν συγκρίνονται']),
      hint: 'Επειδή 2 < 3, ισχύει √2 < √3.'
    };
  },
  // 20. Εμβαδόν ορθογωνίου με πλευρές √2 και √8
  () => {
    // Ε = √2 * √8 = √16 = 4
    const correct = '4';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ένα ορθογώνιο έχει πλευρές </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>2</Sqrt> cm</strong>
          <span> και </span>
          <strong className="text-amber-800 text-lg mx-1"><Sqrt>8</Sqrt> cm</strong>.
          <span> Πόσα cm² είναι το εμβαδόν του;</span>
        </span>
      ),
      correct,
      hint: 'Ε = √2 · √8 = √(2 · 8) = √16 = 4 cm² (ακέραιο αποτέλεσμα!).'
    };
  }
];

export default function PragmatikoiAsk() {
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
    const sanitized = rawVal.replace(/[^0-9,\/\-\sA-Za-zΑ-Ωα-ωΆ-Ώά-ώ√]/g, '');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    exercises.forEach(ex => {
      const userAns = (userAnswers[ex.id] || '').trim().replace(/\s+/g, '').replace('.', ',');
      const correctAns = ex.correct.trim().replace(/\s+/g, '').replace('.', ',');
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
      title="Ασκήσεις: Πραγματικοί Αριθμοί | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις συνόλων, δυνάμεων με βάση πραγματικό, τετραγώνων αριθμών και γεωμετρικών προβλημάτων."
      backUrl="/b-gymnasiou/06-pragmatikoi"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 6
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΠΡΑΓΜΑΤΙΚΟΙ ΑΡΙΘΜΟΙ & ΔΥΝΑΜΕΙΣ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Εξασκήσου στην ταξινόμηση των αριθμών στα σύνολα, στις δυνάμεις με βάση πραγματικό αριθμό, στους τετράγωνους αριθμούς και σε γεωμετρικά προβλήματα της ευθείας των πραγματικών.
            </p>
          </div>
        </section>

        {/* Grid 12 Ασκήσεων */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {exercises.map((ex) => {
            const userVal = userAnswers[ex.id] || '';
            const isCorrect = isSubmitted && (userVal.trim().replace(/\s+/g, '').replace('.', ',').toLowerCase() === ex.correct.trim().replace(/\s+/g, '').replace('.', ',').toLowerCase());

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
                        placeholder="π.χ. 4 ή √3 ή 1/2"
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
