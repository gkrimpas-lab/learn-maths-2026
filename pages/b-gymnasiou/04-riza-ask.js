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
    const fallback = `${parseInt(correctVal, 10) + counter}`;
    if (!options.includes(fallback) && !isNaN(parseInt(fallback, 10))) {
      options.push(fallback);
    } else {
      options.push(`${counter}`);
    }
    counter++;
  }
  return options.sort(() => Math.random() - 0.5);
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Υπολογισμός απλής ρίζας τέλειου τετραγώνου
  () => {
    const roots = [6, 7, 8, 9, 11, 12, 13, 14, 15];
    const r = roots[Math.floor(Math.random() * roots.length)];
    const sq = r * r;
    const correct = `${r}`;
    return {
      type: 'mcq',
      badge: 'ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ',
      question: (
        <span>
          Υπολόγισε την τετραγωνική ρίζα: <strong className="text-indigo-700 text-lg"><Sqrt>{sq}</Sqrt></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${r - 1}`, `${r + 1}`, `${r + 2}`, `${sq / 2}`]),
      hint: `Αναζητούμε ποιος θετικός αριθμός υψωμένος στο τετράγωνο δίνει ${sq}. Επειδή ${r}² = ${sq}, η ρίζα είναι ${r}.`
    };
  },
  // 2. Ρίζα μηδενός και μονάδας
  () => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="text-indigo-700 text-lg"><Sqrt>1</Sqrt> + <Sqrt>0</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', '2', '10', 'Δεν ορίζεται']),
      hint: 'Ισχύει √1 = 1 και √0 = 0. Επομένως 1 + 0 = 1.'
    };
  },
  // 3. Ιδιότητα (√α)² = α
  () => {
    const a = [5, 7, 11, 13, 17, 19][Math.floor(Math.random() * 6)];
    const correct = `${a}`;
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Η τιμή της παράστασης <strong>(<Sqrt>{a}</Sqrt>)²</strong> είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a * a}`, `${2 * a}`, '1', `${a + 2}`]),
      hint: `Για κάθε θετικό αριθμό α ισχύει εξ ορισμού (√α)² = α. Άρα (√${a})² = ${a}.`
    };
  },
  // 4. Ιδιότητα √(α²) = α
  () => {
    const a = [9, 12, 14, 16, 18][Math.floor(Math.random() * 5)];
    const correct = `${a}`;
    return {
      type: 'input',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="text-indigo-700 text-lg"><Sqrt>{a}²</Sqrt></strong>
        </span>
      ),
      correct,
      hint: `Επειδή ο αριθμός ${a} είναι θετικός, ισχύει √(α²) = α. Επομένως η τιμή είναι ${a}.`
    };
  },
  // 5. Ρίζα κλάσματος
  () => {
    const pairs = [
      { n: 1, d: 4, rn: 1, rd: 2 },
      { n: 9, d: 16, rn: 3, rd: 4 },
      { n: 25, d: 36, rn: 5, rd: 6 },
      { n: 49, d: 64, rn: 7, rd: 8 },
      { n: 81, d: 100, rn: 9, rd: 10 }
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const correct = `${p.rn}/${p.rd}`;
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Υπολόγισε τη ρίζα του κλάσματος: </span>
          <strong className="text-indigo-700 text-lg mx-1"><Sqrt><Frac num={p.n} den={p.d} /></Sqrt></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${p.rn}/${p.d}`,
        `${p.n}/${p.rd}`,
        `${p.rn + 1}/${p.rd}`,
        `${p.rn}/${p.rd + 1}`
      ]),
      hint: `Σπάμε τη ρίζα σε αριθμητή και παρονομαστή: √(${p.n}/${p.d}) = √${p.n} / √${p.d} = ${p.rn}/${p.rd}.`
    };
  },
  // 6. Άθροισμα ριζών (προσοχή στην παγίδα √(α+β) ≠ √α + √β)
  () => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΠΑΓΙΔΕΣ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="text-indigo-700 text-lg"><Sqrt>9 + 16</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7', '25', '12', '1']),
      hint: 'Εκτελούμε πρώτα την πράξη μέσα στη ρίζα: 9 + 16 = 25. Έπειτα υπολογίζουμε τη ρίζα: √25 = 5 (όχι √9 + √16 = 3 + 4 = 7).'
    };
  },
  // 7. Σύνθετη παράσταση με πολλαπλασιασμό και ρίζες
  () => {
    // 2 * √49 - 3 * √16 = 2 * 7 - 3 * 4 = 14 - 12 = 2
    const correct = '2';
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="text-indigo-700 text-lg">2 · <Sqrt>49</Sqrt> - 3 · <Sqrt>16</Sqrt></strong>
        </span>
      ),
      correct,
      hint: 'Υπολογίζουμε πρώτα τις ρίζες: √49 = 7 και √16 = 4. Μετά τους πολλαπλασιασμούς: 2 · 7 = 14 και 3 · 4 = 12. Τέλος: 14 - 12 = 2.'
    };
  },
  // 8. Ρίζα αρνητικού αριθμού (εννοιολογική)
  () => {
    const correct = 'Δεν ορίζεται στους πραγματικούς αριθμούς';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="text-indigo-700 text-lg"><Sqrt>-25</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '-5',
        '+5',
        '±5',
        '0'
      ]),
      hint: 'Η τετραγωνική ρίζα αρνητικού αριθμού δεν ορίζεται στους πραγματικούς αριθμούς, διότι κανενός πραγματικού αριθμού το τετράγωνο δεν είναι αρνητικό.'
    };
  },
  // 9. Εγκλωβισμός άρρητης ρίζας
  () => {
    const correct = '4 και 5';
    return {
      type: 'mcq',
      badge: 'ΕΓΚΛΩΒΙΣΜΟΣ',
      question: (
        <span>
          Ανάμεσα σε ποιους δύο διαδοχικούς φυσικούς αριθμούς βρίσκεται το <strong className="text-indigo-700 text-lg"><Sqrt>20</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '3 και 4',
        '5 και 6',
        '2 και 3',
        '4 και 6'
      ]),
      hint: 'Τα πλησιέστερα τέλεια τετράγωνα είναι το 16 (4² = 16) και το 25 (5² = 25). Επειδή 16 < 20 < 25, έχουμε 4 < √20 < 5.'
    };
  },
  // 10. Πράξεις κάτω από το ριζικό: γινόμενο
  () => {
    // √(2 * 32) = √64 = 8
    const correct = '8';
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="text-indigo-700 text-lg"><Sqrt>2 · 32</Sqrt></strong>
        </span>
      ),
      correct,
      hint: 'Εκτελούμε τον πολλαπλασιασμό κάτω από τη ρίζα: 2 · 32 = 64. Άρα √64 = 8.'
    };
  },
  // 11. Πράξεις κάτω από το ριζικό: διαφορά τετραγώνων
  () => {
    // √(13^2 - 12^2) = √(169 - 144) = √25 = 5
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Η τιμή της παράστασης <strong className="text-indigo-700 text-lg"><Sqrt>13² - 12²</Sqrt></strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '25', '7', '13']),
      hint: '13² = 169 και 12² = 144. Άρα 169 - 144 = 25. Επομένως √25 = 5.'
    };
  },
  // 12. Διπλή τετραγωνική ρίζα (ρίζα ρίζας)
  () => {
    // √(√81 + 7) = √(9 + 7) = √16 = 4
    const correct = '4';
    return {
      type: 'input',
      badge: 'ΣΥΝΘΕΤΗ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="text-indigo-700 text-lg"><Sqrt><Sqrt>81</Sqrt> + 7</Sqrt></strong>
        </span>
      ),
      correct,
      hint: 'Πρώτα η εσωτερική ρίζα: √81 = 9. Έπειτα 9 + 7 = 16. Τέλος η εξωτερική ρίζα: √16 = 4.'
    };
  },
  // 13. Πρόσημο του αποτελέσματος της ρίζας
  () => {
    const correct = '+6';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ποιο είναι το αποτέλεσμα της έκφρασης <strong className="text-indigo-700 text-lg"><Sqrt>36</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-6', '±6', '18', '72']),
      hint: 'Εξ ορισμού, η τετραγωνική ρίζα ενός θετικού αριθμού είναι πάντοτε μη αρνητικός αριθμός. Άρα √36 = +6 και ποτέ -6.'
    };
  },
  // 14. Ρίζα δεκαδικού αριθμού
  () => {
    const correct = '0,6';
    return {
      type: 'mcq',
      badge: 'ΔΕΚΑΔΙΚΟΙ',
      question: (
        <span>
          Ποια είναι η τιμή του <strong className="text-indigo-700 text-lg"><Sqrt>0,36</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0,06', '6', '0,18', '1,2']),
      hint: '0,36 = 36/100. Επομένως √(36/100) = √36 / √100 = 6/10 = 0,6.'
    };
  },
  // 15. Διαίρεση ριζών
  () => {
    // √72 : √2 = √(72:2) = √36 = 6
    const correct = '6';
    return {
      type: 'input',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Υπολόγισε το πηλίκο: <strong className="text-indigo-700 text-lg"><Sqrt>72</Sqrt> : <Sqrt>2</Sqrt></strong>
        </span>
      ),
      correct,
      hint: 'Χρησιμοποιούμε την ιδιότητα √α : √β = √(α : β). Άρα √(72 : 2) = √36 = 6.'
    };
  },
  // 16. Τέλειο τετράγωνο μεγάλου αριθμού
  () => {
    const correct = '400';
    return {
      type: 'mcq',
      badge: 'ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ',
      question: (
        <span>
          Ποιος από τους παρακάτω αριθμούς είναι τέλειο τετράγωνο;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['200', '300', '500', '150']),
      hint: 'Επειδή 20² = 400, ο αριθμός 400 είναι τέλειο τετράγωνο.'
    };
  },
  // 17. Εξίσωση μορφής x² = α
  () => {
    const correct = '7 ή -7';
    return {
      type: 'mcq',
      badge: 'ΕΞΙΣΩΣΗ',
      question: (
        <span>
          Ποιες είναι οι λύσεις της εξίσωσης <span className="font-mono font-bold text-indigo-700">x² ＝ 49</span>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Μόνο το 7',
        'Μόνο το -7',
        'Το 0 και το 7',
        'Δεν έχει λύση'
      ]),
      hint: 'Η εξίσωση x² = α (με α > 0) έχει δύο αντίθετες λύσεις: x = √α ή x = -√α. Επομένως x = 7 ή x = -7.'
    };
  },
  // 18. Σύνθετος υπολογισμός με αρνητικό εκθέτη και ρίζα
  () => {
    // √64 * 2^(-3) = 8 * 1/8 = 1
    const correct = '1';
    return {
      type: 'input',
      badge: 'ΣΥΝΔΥΑΣΤΙΚΗ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="text-indigo-700 text-lg"><Sqrt>64</Sqrt> · 2<sup>-3</sup></strong>
        </span>
      ),
      correct,
      hint: '√64 = 8 και 2⁻³ = 1/2³ = 1/8. Άρα 8 · (1/8) = 1.'
    };
  },
  // 19. Εγκλωβισμός ρίζας √80
  () => {
    const correct = '8 και 9';
    return {
      type: 'mcq',
      badge: 'ΕΓΚΛΩΒΙΣΜΟΣ',
      question: (
        <span>
          Ανάμεσα σε ποιους δύο ακέραιους βρίσκεται το <strong className="text-indigo-700 text-lg"><Sqrt>80</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '7 και 8',
        '9 και 10',
        '8 και 10',
        '40 και 41'
      ]),
      hint: '8² = 64 και 9² = 81. Επειδή 64 < 80 < 81, ισχύει 8 < √80 < 9.'
    };
  },
  // 20. Απλοποίηση παράστασης με ρίζες
  () => {
    // 5 * √4 - √9 + √1 = 5 * 2 - 3 + 1 = 10 - 3 + 1 = 8
    const correct = '8';
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την παράσταση: <strong className="text-indigo-700 text-lg">5 · <Sqrt>4</Sqrt> - <Sqrt>9</Sqrt> + <Sqrt>1</Sqrt></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6', '10', '12', '4']),
      hint: '5 · 2 - 3 + 1 = 10 - 3 + 1 = 8.'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Εύρεση πλευράς τετραγώνου από εμβαδόν
  () => {
    const areas = [36, 49, 64, 81, 100, 144];
    const a = areas[Math.floor(Math.random() * areas.length)];
    const side = Math.sqrt(a);
    const correct = `${side}`;
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο οικόπεδο έχει εμβαδόν <strong className="font-mono text-amber-800">{a} m²</strong>. Πόσα μέτρα είναι το μήκος της πλευράς του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${side * 2}`, `${a / 2}`, `${side - 2}`, `${side + 4}`]),
      hint: `Επειδή Ε = α², η πλευρά ισούται με την τετραγωνική ρίζα του εμβαδού: α = √${a} = ${side} m.`
    };
  },
  // 2. Περίμετρος τετραγώνου από εμβαδόν
  () => {
    // Ε = 25 -> α = 5 -> Π = 4 * 5 = 20
    const correct = '20';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο χαρτόνι έχει εμβαδόν 25 cm². Πόσα εκατοστά είναι η <strong>περίμετρός</strong> του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '10', '15', '50']),
      hint: 'Πρώτα βρίσκουμε την πλευρά: α = √25 = 5 cm. Η περίμετρος είναι Π = 4 · α = 4 · 5 = 20 cm.'
    };
  },
  // 3. Περίφραξη τετραγωνικού κήπου (Input)
  () => {
    // Ε = 100 m² -> α = 10 m -> Π = 40 m
    const correct = '40';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας τετράγωνος κήπος έχει εμβαδόν 100 m². Πόσα μέτρα σύρμα χρειάζονται για να περιφραχτεί ολόκληρος με 1 σειρά σύρματος;
        </span>
      ),
      correct,
      hint: 'Η πλευρά του κήπου είναι α = √100 = 10 m. Για την περίφραξη απαιτείται η περίμετρος: Π = 4 · 10 = 40 m.'
    };
  },
  // 4. Πλακόστρωση δαπέδου
  () => {
    // Δωμάτιο 36 m² -> πλακάκια πλευράς 1 m -> 36 πλακάκια, πλευρά δωματίου 6 m
    const correct = '6';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο δωμάτιο καλύφθηκε ακριβώς με 36 τετράγωνα πλακάκια εμβαδού 1 m² το καθένα. Πόσα μέτρα είναι το μήκος του τοίχου του δωματίου;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9', '18', '12', '4']),
      hint: 'Το συνολικό εμβαδόν είναι 36 m². Το μήκος του τοίχου (πλευρά) είναι α = √36 = 6 m.'
    };
  },
  // 5. Φωτοβολταϊκό πάνελ
  () => {
    // Ε = 144 dm² -> πλευρά = 12 dm = 1,2 m
    const correct = '12';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο ηλιακό πάνελ έχει εμβαδόν 144 dm². Πόσα δεκατόμετρα (dm) είναι η πλευρά του;
        </span>
      ),
      correct,
      hint: 'Η πλευρά υπολογίζεται από τη ρίζα του εμβαδού: α = √144 = 12 dm.'
    };
  },
  // 6. Πυθαγόρεια τριάδα σε τετράγωνα εμβαδά
  () => {
    // 9 + 16 = 25 -> πλευρά = √25 = 5
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Δύο τετράγωνα με εμβαδά 9 cm² και 16 cm² ενώνονται για να σχηματίσουν ένα νέο τετράγωνο ίσου συνολικού εμβαδού. Ποια είναι η πλευρά του νέου τετραγώνου;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7', '25', '12', '10']),
      hint: 'Το νέο εμβαδόν είναι 9 + 16 = 25 cm². Η νέα πλευρά είναι α = √25 = 5 cm.'
    };
  },
  // 7. Πλακάκια σε τετράγωνη διάταξη
  () => {
    // 64 πλακάκια -> 8 ανά σειρά
    const correct = '8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας τεχνίτης τοποθετεί 64 τετράγωνα ψηφιδωτά πλακάκια σε τετράγωνη διάταξη (ίσος αριθμός γραμμών και στηλών). Πόσα πλακάκια έχει κάθε σειρά;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '32', '6', '12']),
      hint: 'Αναζητούμε πόσα πλακάκια ανά σειρά δίνουν συνολικά 64: α = √64 = 8 πλακάκια.'
    };
  },
  // 8. Κόστος περίφραξης τετραγώνου
  () => {
    // Ε = 81 m² -> α = 9 m -> Π = 36 m -> Κόστος 36 * 10€ = 360€
    const correct = '360';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Τετράγωνο οικόπεδο εμβαδού 81 m² περιφράσσεται με κόστος 10€ ανά μέτρο. Πόσα ευρώ θα κοστίσει η περίφραξη;
        </span>
      ),
      correct,
      hint: 'Πλευρά: α = √81 = 9 m. Περίμετρος: Π = 4 · 9 = 36 m. Κόστος: 36 · 10 = 360€.'
    };
  },
  // 9. Αποθήκη τετράγωνης βάσης
  () => {
    const correct = '15';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια αποθήκη έχει τετράγωνο δάπεδο εμβαδού 225 m². Ποιο είναι το μήκος της κάθε πλευράς του δαπέδου;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '12', '18', '20']),
      hint: 'Η πλευρά είναι α = √225 = 15 m (αφού 15² = 225).'
    };
  },
  // 10. Τετράγωνη πισίνα και διάδρομος
  () => {
    // Ε = 49 m² -> α = 7 m
    const correct = '7';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το νερό μιας τετράγωνης πισίνας καλύπτει επιφάνεια 49 m². Πόσα μέτρα είναι το μήκος της πισίνας;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '9', '24,5', '6']),
      hint: 'Η πλευρά της πισίνας είναι α = √49 = 7 m.'
    };
  },
  // 11. Διπλασιασμός εμβαδού και προσέγγιση
  () => {
    const correct = '8 και 9';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο έχει εμβαδόν 35 m². Αν διπλασιάσουμε το εμβαδόν του σε 70 m², ανάμεσα σε ποιους ακέραιους θα κυμαίνεται η νέα πλευρά του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '7 και 8',
        '9 και 10',
        '6 και 7',
        '34 και 36'
      ]),
      hint: 'Νέα πλευρά: α = √70. Επειδή 8² = 64 και 9² = 81, έχουμε 8 < √70 < 9.'
    };
  },
  // 12. Σκακιέρα
  () => {
    // 64 τετράγωνα -> 8 ανά πλευρά
    const correct = '8';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια κλασική σκακιέρα αποτελείται από 64 ισομεγέθη τετράγωνα. Πόσα τετράγωνα υπάρχουν κατά μήκος κάθε πλευράς της;
        </span>
      ),
      correct,
      hint: 'Επειδή η σκακιέρα είναι τετράγωνη, κάθε πλευρά έχει √64 = 8 τετράγωνα.'
    };
  },
  // 13. Χαρτί origami
  () => {
    // Ε = 121 cm² -> α = 11 cm
    const correct = '11';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο φύλλο χαρτιού origami έχει εμβαδόν 121 cm². Πόσα εκατοστά είναι η πλευρά του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['12', '10', '19', '14']),
      hint: 'Η πλευρά είναι α = √121 = 11 cm (αφού 11² = 121).'
    };
  },
  // 14. Αθλητικός στίβος: τετράγωνο ταπί
  () => {
    // Ε = 196 m² -> α = 14 m
    const correct = '14';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το ταπί των αγώνων πάλης είναι τετράγωνο με εμβαδόν 196 m². Πόσα μέτρα είναι η πλευρά του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '12', '13', '18']),
      hint: 'Υπολογίζουμε α = √196 = 14 m (αφού 14² = 196).'
    };
  },
  // 15. Κάλυμμα τετράγωνου τραπεζιού (Input)
  () => {
    // Ε = 1,44 m² = 144 dm² -> πλευρά = 1,2 m
    const correct = '1,2';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο τραπεζομάντηλο έχει εμβαδόν 1,44 m². Πόσα μέτρα είναι η πλευρά του (γράψε με κόμμα);
        </span>
      ),
      correct,
      hint: '1,44 = 144/100. Επομένως α = √(144/100) = 12/10 = 1,2 m.'
    };
  },
  // 16. Τετράγωνη θεατρική σκηνή
  () => {
    // Ε = 400 m² -> α = 20 m
    const correct = '20';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια υπαίθρια τετράγωνη θεατρική σκηνή έχει εμβαδόν 400 m². Πόσα μέτρα είναι η πρόσοψή της;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['40', '25', '30', '15']),
      hint: 'Η πλευρά είναι α = √400 = 20 m (αφού 20² = 400).'
    };
  },
  // 17. Κορνίζα φωτογραφίας
  () => {
    // Ε = 81 cm² -> α = 9 cm -> Περίμετρος = 36 cm
    const correct = '36';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια τετράγωνη φωτογραφία έχει εμβαδόν 81 cm². Πόσα εκατοστά ξύλινης κορνίζας χρειάζονται περιμετρικά;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['18', '27', '81', '72']),
      hint: 'Πλευρά: α = √81 = 9 cm. Περίμετρος: 4 · 9 = 36 cm.'
    };
  },
  // 18. Συναρμολόγηση παζλ
  () => {
    // 100 κομμάτια σε τετράγωνο -> 10 κομμάτια
    const correct = '10';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα παιδικό παζλ 100 τετράγωνων κομματιών σχηματίζει ένα μεγάλο τετράγωνο. Πόσα κομμάτια βρίσκονται σε κάθε εξωτερική πλευρά;
        </span>
      ),
      correct,
      hint: 'Κάθε πλευρά έχει α = √100 = 10 κομμάτια.'
    };
  },
  // 19. Γεωργικό θερμοκήπιο
  () => {
    // Ε = 256 m² -> α = 16 m
    const correct = '16';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο υδροπονικό θερμοκήπιο καταλαμβάνει έκταση 256 m². Πόσα μέτρα είναι το πλάτος του;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '18', '26', '12']),
      hint: 'Πλάτος: α = √256 = 16 m (αφού 16² = 256).'
    };
  },
  // 20. Διαχωρισμός πλατείας
  () => {
    // Πλατεία 900 m² -> α = 30 m
    const correct = '30';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια τετράγωνη πλατεία έχει εμβαδόν 900 m². Πόσα μέτρα περπατάει κάποιος που διανύει μία ολόκληρη πλευρά της;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['45', '60', '300', '90']),
      hint: 'Η πλευρά είναι α = √900 = 30 m (αφού 30² = 900).'
    };
  }
];

export default function RizaAsk() {
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
    const sanitized = rawVal.replace(/[^0-9,\/\-\s]/g, '');
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
      title="Ασκήσεις: Τετραγωνικοί Αριθμοί & Τετραγωνική Ρίζα | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις υπολογισμού ριζών, τελείων τετραγώνων, ιδιοτήτων και γεωμετρικών προβλημάτων."
      backUrl="/b-gymnasiou/04-riza"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 4
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ & ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Εξασκήσου στην εύρεση τετραγωνικών ριζών, στα τέλεια τετράγωνα, στις ιδιότητες των ριζών και σε γεωμετρικά προβλήματα εμβαδού και περιμέτρου.
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
                        placeholder="π.χ. 7 ή 1,2 ή 3/4"
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
