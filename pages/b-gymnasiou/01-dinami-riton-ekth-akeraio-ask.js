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
  // Αν δεν συμπληρώθηκαν 4, προσθέτουμε εναλλακτικές
  let counter = 1;
  while (options.length < 4) {
    const fallback = `${correctVal} + ${counter}`;
    if (!options.includes(fallback)) options.push(fallback);
    counter++;
  }
  // Shuffle επιλογών
  return options.sort(() => Math.random() - 0.5);
};

// Βοηθητική συνάρτηση τυχαίου ακεραίου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randNonZero = (min, max) => {
  let val = 0;
  while (val === 0) val = randInt(min, max);
  return val;
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Αρνητικός εκθέτης σε ακέραια βάση: a^(-n)
  () => {
    const a = randInt(2, 6);
    const n = randInt(2, 4);
    const den = Math.pow(a, n);
    const correct = `1/${den}`;
    return {
      type: 'mcq',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Ποια είναι η τιμή της δύναμης <strong className="font-mono text-indigo-700">{a}<sup>-{n}</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${den}`, `${den}`, `1/${a * n}`, `-${a * n}`]),
      hint: `Ισχύει α⁻ⁿ = 1/αⁿ. Υπολογίζουμε 1/${a}^${n}.`
    };
  },
  // 2. Αρνητική βάση με περιττό αρνητικό εκθέτη
  () => {
    const a = randInt(2, 4);
    const n = 3; // περιττός
    const den = Math.pow(a, n);
    const correct = `-1/${den}`;
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε την τιμή της έκφρασης <strong className="font-mono text-indigo-700">(-{a})<sup>-{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`1/${den}`, `-${den}`, `${den}`, `-1/${a * n}`]),
      hint: 'Η βάση είναι αρνητική και ο εκθέτης περιττός, άρα το πρόσημο παραμένει αρνητικό.'
    };
  },
  // 3. Αρνητική βάση με άρτιο αρνητικό εκθέτη
  () => {
    const a = randInt(2, 4);
    const n = 2; // άρτιος
    const den = Math.pow(a, n);
    const correct = `1/${den}`;
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε την τιμή της έκφρασης <strong className="font-mono text-indigo-700">(-{a})<sup>-{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-1/${den}`, `-${den}`, `${den}`, `1/${a * n}`]),
      hint: 'Αρνητική βάση με άρτιο εκθέτη δίνει πάντα θετικό αποτέλεσμα.'
    };
  },
  // 4. Κλάσμα με αρνητικό εκθέτη (α/β)^(-1)
  () => {
    const a = randInt(2, 5);
    const b = randInt(6, 9);
    const correct = `${b}/${a}`;
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Το κλάσμα <strong className="font-mono text-indigo-700">(<Frac num={a} den={b} />)<sup>-1</sup></strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${b}/${a}`, `-${a}/${b}`, `${a}/${b}`, `1`]),
      hint: 'Όταν ο εκθέτης είναι -1, απλώς αντιστρέφουμε τους όρους του κλάσματος.'
    };
  },
  // 5. Κλάσμα με αρνητικό εκθέτη -2: (α/β)^(-2)
  () => {
    const a = 2;
    const b = 3;
    const correct = '9/4';
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Υπολόγισε την τιμή του κλάσματος <strong className="font-mono text-indigo-700">(<Frac num={a} den={b} />)<sup>-2</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-9/4', '4/9', '-4/9', '9/2']),
      hint: '(α/β)⁻² = (β/α)² = β²/α².'
    };
  },
  // 6. Μηδενικός εκθέτης: α^0
  () => {
    const base = randNonZero(-15, 15);
    const correct = '1';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="font-mono text-indigo-700">({base})<sup>0</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', `${base}`, '-1', 'Δεν ορίζεται']),
      hint: 'Κάθε μη μηδενικός αριθμός υψωμένος στο μηδέν ισούται με 1.'
    };
  },
  // 7. Γινόμενο ίδιας βάσης με αντίθετους εκθέτες: a^n * a^(-n)
  () => {
    const a = randInt(2, 7);
    const n = randInt(2, 5);
    const correct = '1';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Υπολόγισε το γινόμενο <strong className="font-mono text-indigo-700">{a}<sup>{n}</sup> · {a}<sup>-{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', `${a}`, `${Math.pow(a, n)}`, `${a * 2}`]),
      hint: 'Προσθέτουμε τους εκθέτες: n + (-n) = 0. Και α⁰ = 1.'
    };
  },
  // 8. Γινόμενο ίδιας βάσης: a^m * a^n
  () => {
    const a = randInt(2, 5);
    const m = randInt(3, 7);
    const n = randInt(-5, -2);
    const sum = m + n;
    const correct = `${a}^${sum}`;
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Γράψε ως μία δύναμη το γινόμενο <strong className="font-mono text-indigo-700">{a}<sup>{m}</sup> · {a}<sup>{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m - n}`, `${a}^${m * n}`, `${a * a}^${sum}`, `${a}^${n}`]),
      hint: 'Διατηρούμε την ίδια βάση και προσθέτουμε αλγεβρικά τους εκθέτες.'
    };
  },
  // 9. Πηλίκο ίδιας βάσης: a^m : a^n
  () => {
    const a = randInt(2, 6);
    const m = randInt(2, 5);
    const n = randInt(-4, -1);
    const diff = m - n;
    const correct = `${a}^${diff}`;
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Γράψε ως μία δύναμη το πηλίκο <strong className="font-mono text-indigo-700">{a}<sup>{m}</sup> : {a}<sup>{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m + n}`, `${a}^${m * n}`, `${a}^${n - m}`, `${a}^${m}`]),
      hint: 'Αφαιρούμε τον εκθέτη του διαιρέτη: m - (n).'
    };
  },
  // 10. Δύναμη σε δύναμη: (a^m)^n
  () => {
    const a = randInt(2, 5);
    const m = randInt(-3, -1);
    const n = randInt(2, 4);
    const prod = m * n;
    const correct = `${a}^${prod}`;
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Γράψε ως μία δύναμη την παράσταση <strong className="font-mono text-indigo-700">({a}<sup>{m}</sup>)<sup>{n}</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m + n}`, `${a}^${m - n}`, `${a}^${Math.abs(prod)}`, `${a * n}^${m}`]),
      hint: 'Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες.'
    };
  },
  // 11. Σύγκριση αρνητικού εκθέτη και αρνητικού αριθμού (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΥΠΟΛΟΓΙΣΜΟΣ',
      question: (
        <span>
          Υπολόγισε την τιμή της παράστασης <strong className="font-mono text-indigo-700">2<sup>-3</sup> · 8</strong>:
        </span>
      ),
      correct: '1',
      hint: '2⁻³ = 1/8. Επομένως (1/8) · 8 = 1.'
    };
  },
  // 12. Δύναμη του 10 με αρνητικό εκθέτη
  () => {
    const exp = randInt(1, 4);
    const dec = (1 / Math.pow(10, exp)).toString().replace('.', ',');
    const correct = dec;
    return {
      type: 'mcq',
      badge: 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10',
      question: (
        <span>
          Ποια είναι η δεκαδική μορφή της δύναμης <strong className="font-mono text-indigo-700">10<sup>-{exp}</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `-${Math.pow(10, exp)}`,
        `0,${'0'.repeat(Math.max(0, exp - 2))}1`,
        `0,${'0'.repeat(exp)}1`,
        `-${dec}`
      ]),
      hint: 'Το 10⁻ⁿ έχει n δεκαδικά ψηφία μετά την υποδιαστολή.'
    };
  },
  // 13. Άθροισμα δυνάμεων: 2^(-1) + 2^(-1) (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΠΡΑΞΕΙΣ',
      question: (
        <span>
          Υπολόγισε το αποτέλεσμα της πρόσθεσης: <strong className="font-mono text-indigo-700">2<sup>-1</sup> + 2<sup>-1</sup></strong>
        </span>
      ),
      correct: '1',
      hint: '2⁻¹ = 1/2. Επομένως 1/2 + 1/2 = 1.'
    };
  },
  // 14. Πρόσημο χωρίς παρένθεση: -a^2
  () => {
    const a = randInt(3, 6);
    const res = -Math.pow(a, 2);
    const correct = `${res}`;
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Υπολόγισε την τιμή της έκφρασης <strong className="font-mono text-indigo-700">-{a}<sup>2</sup></strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${Math.pow(a, 2)}`, `${-a * 2}`, `${a * 2}`, `0`]),
      hint: 'Επειδή δεν υπάρχει παρένθεση, υψώνεται μόνο ο αριθμός στο τετράγωνο και το πρόσημο μείον παραμένει.'
    };
  },
  // 15. Δύναμη γινομένου: (2 * 5)^(-2)
  () => {
    const correct = '1/100';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span>
          Ποια είναι η τιμή της παράστασης <strong className="font-mono text-indigo-700">(2 · 5)<sup>-2</sup></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/20', '-1/100', '100', '-20']),
      hint: '(2 · 5)⁻² = 10⁻² = 1/10² = 1/100.'
    };
  },
  // 16. Ιδιότητα (α/β)^(-ν) με συγκεκριμένους αριθμούς (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Αν <strong className="font-mono text-indigo-700">(1/3)<sup>-2</sup></strong> ισούται με έναν φυσικό αριθμό, ποιος είναι αυτός;
        </span>
      ),
      correct: '9',
      hint: '(1/3)⁻² = (3/1)² = 9.'
    };
  },
  // 17. Απλοποίηση παράστασης δυνάμεων
  () => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: 'ΑΠΛΟΠΟΙΗΣΗ',
      question: (
        <span>
          Υπολόγισε την τιμή: <strong className="font-mono text-indigo-700">(5<sup>-3</sup> · 5<sup>5</sup>) : 5</strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '1', '1/5', '125']),
      hint: '5⁻³ · 5⁵ = 5² = 25. Στη συνέχεια 25 : 5 = 5 (ή 5² : 5¹ = 5¹ = 5).'
    };
  },
  // 18. Αντίστροφος αριθμός ως δύναμη
  () => {
    const a = randInt(4, 9);
    const correct = `${a}^-1`;
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ο αντίστροφος του αριθμού <strong className="font-mono text-indigo-700">{a}</strong> γράφεται ως δύναμη με βάση το {a} ως:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${a}^1`, `${a}^0`, `${a}^1`, `-${a}^-1`]),
      hint: 'Ο αντίστροφος του α είναι το 1/α = α⁻¹.'
    };
  },
  // 19. Δύναμη με βάση το -1: (-1)^(-5)
  () => {
    const correct = '-1';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Η τιμή της δύναμης <strong className="font-mono text-indigo-700">(-1)<sup>-5</sup></strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '-5', '5', '0']),
      hint: '(-1)⁻⁵ = 1 / (-1)⁵ = 1 / (-1) = -1.'
    };
  },
  // 20. Δύναμη με βάση το -1 και άρτιο εκθέτη: (-1)^(-8)
  () => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΣΗΜΑ',
      question: (
        <span>
          Η τιμή της δύναμης <strong className="font-mono text-indigo-700">(-1)<sup>-8</sup></strong> ισούται με:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-1', '8', '-8', '0']),
      hint: '(-1)⁻⁸ = 1 / (-1)⁸ = 1 / 1 = 1.'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Μικροβιολογία: Διάμετρος βακτηρίου
  () => {
    const exp = 6;
    const correct = '1/1000000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα μικρόβιο έχει μήκος <strong className="font-mono text-amber-700">10<sup>-{exp}</sup></strong> μέτρα (1 μικρόμετρο). Σε ποιο κλάσμα του μέτρου αντιστοιχεί αυτό το μήκος;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100000', '1/10000', '1/1000', '-1/1000000']),
      hint: '10⁻⁶ = 1 / 10⁶ = 1 / 1.000.000 του μέτρου.'
    };
  },
  // 2. Υπολογιστές: Χρόνος απόκρισης επεξεργαστή
  () => {
    const correct = '1/1000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα millisecond ισούται με <strong className="font-mono text-amber-700">10<sup>-3</sup></strong> δευτερόλεπτα. Ποιο κλάσμα του δευτερολέπτου είναι αυτό;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100', '1/10000', '1/30', '-1/1000']),
      hint: '10⁻³ = 1 / 10³ = 1 / 1.000 του δευτερολέπτου.'
    };
  },
  // 3. Φωτογραφία: Ταχύτητα κλείστρου
  () => {
    const correct = '1/250';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μία επαγγελματική φωτογραφική μηχανή ρυθμίζει την ταχύτητα του κλείστρου σε <strong className="font-mono text-amber-700">(250)<sup>-1</sup></strong> δευτερόλεπτα. Σε ποιο κλάσμα του δευτερολέπτου αντιστοιχεί;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/25', '-1/250', '250', '1/500']),
      hint: 'α⁻¹ = 1/α. Επομένως 250⁻¹ = 1/250 του δευτερολέπτου.'
    };
  },
  // 4. Σεισμολογία: Ενέργεια σεισμού
  () => {
    const correct = '1000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Στην κλίμακα Richter, ένα κύμα έχει σχετική ένταση που εκφράζεται ως <strong className="font-mono text-amber-700">10<sup>5</sup> · 10<sup>-2</sup></strong>. Ποια είναι η τελική ένταση του κύματος;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['100', '10000', '10', '1']),
      hint: '10⁵ · 10⁻² = 10⁵⁻² = 10³ = 1.000.'
    };
  },
  // 5. Φυσική: Εξασθένηση σήματος Wi-Fi
  () => {
    const correct = '1/16';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η ισχύς ενός σήματος Wi-Fi μειώνεται καθώς περνά από έναν τοίχο και γίνεται <strong className="font-mono text-amber-700">2<sup>-4</sup></strong> της αρχικής. Ποιο κλάσμα της αρχικής ισχύος παραμένει;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/8', '1/32', '-1/16', '1/4']),
      hint: '2⁻⁴ = 1 / 2⁴ = 1/16.'
    };
  },
  // 6. Οικονομία: Υποτίμηση νομίσματος
  () => {
    const correct = '1/100';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Λόγω πληθωρισμού, η αξία ενός νομίσματος έγινε <strong className="font-mono text-amber-700">10<sup>-2</sup></strong> της προηγούμενης αξίας του. Ποιο μέρος της αρχικής του αξίας έχει απομείνει;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/10', '1/1000', '1/20', '2/10']),
      hint: '10⁻² = 1 / 10² = 1/100.'
    };
  },
  // 7. Χημεία: Συγκέντρωση ιόντων υδρογόνου (pH)
  () => {
    const correct = '0,001';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα διάλυμα έχει συγκέντρωση οξέος <strong className="font-mono text-amber-700">10<sup>-3</sup> mol/L</strong>. Ποια είναι η δεκαδική τιμή αυτής της συγκέντρωσης;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0,01', '0,0001', '0,1', '-0,001']),
      hint: '10⁻³ = 1/1000 = 0,001.'
    };
  },
  // 8. Αστρονομία: Σύγκριση μαζών
  () => {
    const correct = '10^3';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο πλανήτης Α έχει μάζα <strong className="font-mono text-amber-700">10<sup>24</sup> kg</strong> και ο δορυφόρος του <strong className="font-mono text-amber-700">10<sup>21</sup> kg</strong>. Πόσες φορές βαρύτερος είναι ο πλανήτης Α (υπολόγισε το πηλίκο <span className="font-mono">10<sup>24</sup> : 10<sup>21</sup></span>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^45', '10^3', '10^2', '10^4']),
      hint: '10²⁴ : 10²¹ = 10²⁴⁻²¹ = 10³ = 1.000 φορές.'
    };
  },
  // 9. Αποθήκευση Δεδομένων: Byte σε Gigabyte
  () => {
    const correct = '1/8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα αρχείο καταλαμβάνει χώρο που υπολογίζεται ως <strong className="font-mono text-amber-700">2<sup>-3</sup> GB</strong>. Σε ποιο κλάσμα του GB αντιστοιχεί αυτό το μέγεθος;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/6', '1/16', '3/2', '-1/8']),
      hint: '2⁻³ = 1 / 2³ = 1/8 του GB.'
    };
  },
  // 10. Ιατρική: Δόση φαρμάκου
  () => {
    const correct = '1/10';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας ασθενής λαμβάνει δόση φαρμάκου ίση με <strong className="font-mono text-amber-700">10<sup>-1</sup> mg</strong>. Πόσα γραμμάρια ή κλάσμα του mg είναι αυτό;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100', '1/10', '10', '-1/10']),
      hint: '10⁻¹ = 1/10 του mg.'
    };
  },
  // 11. Ήχος: Ένταση ήχου (Decibel)
  () => {
    const correct = '10^4';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο ήχος μιας συναυλίας έχει σχετική πίεση που δίνεται από το γινόμενο <strong className="font-mono text-amber-700">10<sup>7</sup> · 10<sup>-3</sup></strong>. Γράψε το αποτέλεσμα ως μία δύναμη του 10:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^-21', '10^4', '10^10', '10^-4']),
      hint: '10⁷ · 10⁻³ = 10⁷⁻³ = 10⁴.'
    };
  },
  // 12. Οπτική: Μήκος κύματος φωτός
  () => {
    const correct = '1/10000000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Το μήκος κύματος ενός λέιζερ είναι <strong className="font-mono text-amber-700">10<sup>-7</sup> μέτρα</strong>. Ποιο είναι το ισοδύναμο κλάσμα;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/1000000', '1/10000000', '1/700000', '-1/10000000']),
      hint: '10⁻⁷ = 1 / 10.000.000.'
    };
  },
  // 13. Ηλεκτρονικά: Χωρητικότητα πυκνωτή (microfarad)
  () => {
    const correct = '1/1000000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας πυκνωτής έχει χωρητικότητα <strong className="font-mono text-amber-700">10<sup>-6</sup> Farad</strong>. Σε ποιο κλάσμα του Farad αντιστοιχεί;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100000', '1/1000000', '1/6000', '1/1000']),
      hint: '10⁻⁶ = 1 / 10⁶ = 1 / 1.000.000.'
    };
  },
  // 14. Διπλασιασμός και μείωση (Input)
  () => {
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα ποσό διπλασιάζεται (<span className="font-mono">· 2<sup>2</sup></span>) και έπειτα πολλαπλασιάζεται με <strong className="font-mono text-amber-700">2<sup>-2</sup></strong>. Πόσες φορές το αρχικό ποσό είναι το τελικό αποτέλεσμα;
        </span>
      ),
      correct: '1',
      hint: '2² · 2⁻² = 2⁰ = 1. Το ποσό παραμένει ακριβώς το ίδιο!'
    };
  },
  // 15. Κίνηση σε νανοκλίμακα
  () => {
    const correct = '10^-4';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα νανορομπότ διανύει απόσταση <strong className="font-mono text-amber-700">(10<sup>-2</sup>)<sup>2</sup></strong> μέτρων. Ποια είναι η απόσταση σε μία ενιαία δύναμη του 10;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^0', '10^-4', '10^-1', '10^4']),
      hint: '(10⁻²)² = 10⁻² · ² = 10⁻⁴.'
    };
  },
  // 16. Μαγειρική: Αναλογία μπαχαρικών
  () => {
    const correct = '1/4';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μία συνταγή ζητάει ποσότητα ίση με <strong className="font-mono text-amber-700">2<sup>-2</sup></strong> του κουταλιού. Ποιο μέρος του κουταλιού πρέπει να βάλουμε;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/2', '1/4', '1/8', '-1/4']),
      hint: '2⁻² = 1 / 2² = 1/4 του κουταλιού.'
    };
  },
  // 17. Γεωμετρία: Εμβαδόν μικροσκοπικού τετραγώνου
  () => {
    const correct = '1/25';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα μικροσκοπικό τετράγωνο έχει πλευρά <strong className="font-mono text-amber-700">5<sup>-1</sup> cm</strong>. Ποιο είναι το εμβαδόν του σε cm² (υπολόγισε <span className="font-mono">(5<sup>-1</sup>)<sup>2</sup></span>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/10', '1/25', '2/5', '-1/25']),
      hint: '(5⁻¹)² = 5⁻² = 1 / 5² = 1/25 cm².'
    };
  },
  // 18. Οικονομία: Συνεχής υποδιπλασιασμός
  () => {
    const correct = '1/8';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μία μετοχή υποδιπλασιάζεται 3 συνεχόμενες ημέρες. Η σημερινή της αξία είναι ίση με <strong className="font-mono text-amber-700">(1/2)<sup>3</sup> = 2<sup>-3</sup></strong> της αρχικής. Ποιο είναι αυτό το κλάσμα;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/6', '1/8', '1/16', '3/8']),
      hint: '2⁻³ = 1 / 2³ = 1/8 της αρχικής αξίας.'
    };
  },
  // 19. Ψηφιακός ήχος: Δειγματοληψία
  () => {
    const correct = '10^6';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ο ρυθμός δειγματοληψίας ενός αισθητήρα υπολογίζεται από το πηλίκο <strong className="font-mono text-amber-700">10<sup>3</sup> : 10<sup>-3</sup></strong>. Ποιο είναι το αποτέλεσμα ως δύναμη του 10;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^0', '10^6', '10^-6', '10^9']),
      hint: '10³ : 10⁻³ = 10³⁻⁽⁻³⁾ = 10³⁺³ = 10⁶.'
    };
  },
  // 20. Τεχνολογία: Χρόνος απόκρισης σε nanosecond
  () => {
    const correct = '1/1000000000';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα nanosecond είναι <strong className="font-mono text-amber-700">10<sup>-9</sup> δευτερόλεπτα</strong>. Σε ποιο κλάσμα του δευτερολέπτου αντιστοιχεί;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/1000000', '1/100000000', '1/1000000000', '-1/1000000000']),
      hint: '10⁻⁹ = 1 / 10⁹ = 1 / 1.000.000.000 (ένα δισεκατομμυριοστό).'
    };
  }
];

export default function DinamiRitonEkthAkeraioAsk() {
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 12 ασκήσεων: 10 Θεωρίας/Πράξεων + 2 Ρεαλιστικών Προβλημάτων
  const generateQuiz = useCallback(() => {
    // Shuffle & Pick 10 από POOL_THEORY
    const shuffledTheory = [...POOL_THEORY].sort(() => Math.random() - 0.5).slice(0, 10);
    // Shuffle & Pick 2 από POOL_PROBLEMS
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

  // Χειρισμός αλλαγής απάντησης
  const handleAnswerChange = (id, val) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [id]: val }));
  };

  // Input Sanitization (0-9 , / - ^ *)
  const handleInputChange = (id, rawVal) => {
    if (isSubmitted) return;
    const sanitized = rawVal.replace(/[^0-9,\/\-\^\*]/g, '');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  // Έλεγχος Απαντήσεων
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
      title="Ασκήσεις: Δυνάμεις Ρητών με Εκθέτη Ακέραιο | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις υπολογισμών, ιδιοτήτων και ρεαλιστικών προβλημάτων στις δυνάμεις ρητών με εκθέτη ακέραιο."
      backUrl="/b-gymnasiou/01-dinami-riton-ekth-akeraio"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      {/* Wrapper με επαρκές padding κάτω για τη σταθερή μπάρα (pb-32 sm:pb-36) */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 1
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΔΥΝΑΜΕΙΣ ΡΗΤΩΝ ΜΕ ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Λύσε τις 10 ασκήσεις υπολογισμών και ιδιοτήτων, καθώς και τα 2 ρεαλιστικά προβλήματα καθημερινότητας. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις το σκορ και την αναλυτική ανατροφοδότηση!
            </p>
          </div>
        </section>

        {/* Λίστα 12 Ασκήσεων */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {exercises.map((ex) => {
            const userVal = userAnswers[ex.id] || '';
            const isCorrect = isSubmitted && (userVal.trim().replace(/\s+/g, '').toLowerCase() === ex.correct.trim().replace(/\s+/g, '').toLowerCase());
            const isWrong = isSubmitted && !isCorrect;

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
                  {/* Badge & Αρίθμηση */}
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

                  {/* Ερώτηση */}
                  <div className="text-slate-800 text-sm sm:text-base leading-relaxed">
                    {ex.question}
                  </div>
                </div>

                {/* Επιλογές (MCQ ή Input) */}
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
                        placeholder="π.χ. 1/9 ή 9"
                        className="w-full h-11 px-4 rounded-xl border border-slate-300 font-mono text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  )}

                  {/* Feedback μετά την υποβολή */}
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

      {/* ==========================================
          FIXED BOTTOM SCORE BAR
          ========================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-950/95 backdrop-blur-md border-t border-indigo-700/60 text-white shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Σκορ & Ποσοστό */}
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

          {/* Κουμπιά Δράσης */}
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
