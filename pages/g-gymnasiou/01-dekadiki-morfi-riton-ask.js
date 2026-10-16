import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const map = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'Ϊ': 'Ι', 'Ϋ': 'Υ',
    'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω',
    'ϊ': 'Ι', 'ϋ': 'Υ', 'ΐ': 'Ι', 'ΰ': 'Υ'
  };
  return str.split('').map(char => map[char] || char.toUpperCase()).join('');
}

// Κομψή απόδοση της γραμμής περιόδου πάνω από τα ψηφία (Vinculum)
function Overline({ children }) {
  return (
    <span className="relative inline-block border-t-2 border-current px-0.5 leading-none">
      {children}
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος με οριζόντια γραμμή (Fraction)
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 leading-tight ${className}`}>
      <span className="border-b-[1.5px] border-current px-1 text-center text-[0.9em] w-full block">
        {num}
      </span>
      <span className="px-1 text-center text-[0.9em] w-full block">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null) {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Μετατροπή απλού περιοδικού σε κλάσμα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    const d = randInt(1, 8);
    return {
      title: 'Γεννήτρια Μορφή Μονοψήφιου Απλού Περιοδικού',
      prompt: `Ποιο είναι το ισοδύναμο κλασματικό αποτέλεσμα του απλού περιοδικού δεκαδικού αριθμού 0,${d}${d}${d}... (δηλαδή 0,${d} με περίοδο το ${d});`,
      correct: `${d}/9`,
      type: 'mcq',
      distractors: () => [`${d}/10`, `${d}/99`, `${d}/8`][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Περίοδος', details: `${d} (1 ψηφίο)` },
        { label: 'Κανόνας παρονομαστή', details: '1 εννιάρι (9)' },
        { label: 'Γεννήτρια μορφή', details: `${d}/9` }
      ],
      explanation: `Σε έναν απλό περιοδικό δεκαδικό με περίοδο ένα μόνο ψηφίο d, το κλάσμα έχει αριθμητή το d και παρονομαστή το 9 (${d}/9).`
    };
  },
  () => {
    const p = randInt(12, 85);
    return {
      title: 'Γεννήτρια Μορφή Διψήφιου Απλού Περιοδικού',
      prompt: `Ποιο κλάσμα αντιστοιχεί στον απλό περιοδικό δεκαδικό 0,${p}${p}${p}... (με περίοδο το ${p});`,
      correct: `${p}/99`,
      type: 'mcq',
      distractors: () => [`${p}/100`, `${p}/9`, `${p}/990`][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Περίοδος', details: `${p} (2 ψηφία)` },
        { label: 'Παρονομαστής', details: 'Τόσα 9άρια όσα τα ψηφία της περιόδου (99)' },
        { label: 'Κλάσμα', details: `${p}/99` }
      ],
      explanation: `Επειδή η περίοδος έχει 2 ψηφία (${p}), τοποθετούμε στον παρονομαστή τον αριθμό 99. Άρα το κλάσμα είναι ${p}/99.`
    };
  },
  () => {
    const k = randInt(1, 4);
    const numRes = k * 9 + 7;
    return {
      title: 'Ακέραιο Μέρος και Απλός Περιοδικός',
      prompt: `Ποιο κλάσμα παριστάνει τον αριθμό ${k},777... (με ακέραιο μέρος ${k} και περίοδο 7);`,
      correct: `${numRes}/9`,
      type: 'mcq',
      distractors: () => [`${k * 10 + 7}/10`, `${numRes}/99`, `${k * 9}/9`][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Ανάλυση', details: `${k} ＋ 0,777... ＝ ${k} ＋ (7/9)` },
        { label: 'Ομώνυμα', details: `(${k * 9}/9) ＋ (7/9) ＝ ${numRes}/9` }
      ],
      explanation: `Γράφουμε τον αριθμό ως άθροισμα: ${k} ＋ 7/9 ＝ (${k * 9} ＋ 7)/9 ＝ ${numRes}/9.`
    };
  },
  () => {
    const d = randInt(101, 350);
    return {
      title: 'Τριψήφια Περίοδος',
      prompt: `Ποιος είναι ο παρονομαστής της γεννήτριας μορφής του απλού περιοδικού αριθμού 0,${d}${d}... (με περίοδο το ${d});`,
      correct: 999,
      type: 'input',
      tableData: [
        { label: 'Περίοδος', details: `${d} (3 ψηφία)` },
        { label: 'Κανόνας παρονομαστή', details: '3 εννιάρια (999)' }
      ],
      explanation: `Για κάθε ψηφίο της περιόδου αντιστοιχεί ένα 9 στον παρονομαστή. Για τριψήφια περίοδο έχουμε τρία εννιάρια, δηλαδή 999.`
    };
  },
  () => {
    return {
      title: 'Η Περίπτωση του 0,999...',
      prompt: 'Σε ποιον ακέραιο αριθμό ισούται ακριβώς ο περιοδικός δεκαδικός αριθμός 0,999... (με περίοδο το 9);',
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Κλασματική μορφή', details: '9/9' },
        { label: 'Αποτέλεσμα διαίρεσης', details: '9/9 ＝ 1' }
      ],
      explanation: 'Σύμφωνα με τον κανόνα, 0,999... ＝ 9/9 ＝ 1. Ο αριθμός αυτός ισούται ακριβώς με τη μονάδα.'
    };
  },
  () => {
    const val = randInt(2, 5);
    return {
      title: 'Δεκαδικό Ανάπτυγμα Κλάσματος με Παρονομαστή 9',
      prompt: `Αν το κλάσμα 1/9 ισούται με 0,111..., ποιο είναι το δεκαδικό ανάπτυγμα του κλάσματος ${val}/9;`,
      correct: `0,${val}${val}${val}...`,
      type: 'mcq',
      distractors: () => [
        `0,0${val}${val}...`,
        `0,${val}`,
        `0,${val * 2}${val * 2}...`
      ][randInt(0, 2)],
      tableData: [
        { label: 'Βασικό κλάσμα', details: '1/9 ＝ 0,111...' },
        { label: 'Πολλαπλασιασμός επί ' + val, details: `${val} · (1/9) ＝ 0,${val}${val}${val}...` }
      ],
      explanation: `Πολλαπλασιάζουμε το 0,111... με το ${val}, οπότε προκύπτει 0,${val}${val}${val}...`
    };
  }
];

// POOL Q10: Αναγνώριση είδους δεκαδικού από τον παρονομαστή (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    const dens = [8, 16, 20, 25, 40, 50];
    const pickedDen = dens[randInt(0, dens.length - 1)];
    return {
      title: 'Έλεγχος Πεπερασμένου Δεκαδικού',
      prompt: `Το ανάγωγο κλάσμα 7/${pickedDen} μετατρέπεται σε:`,
      correct: 'Πεπερασμένο (τερματιζόμενο) δεκαδικό',
      type: 'mcq',
      distractors: () => [
        'Απλό περιοδικό δεκαδικό',
        'Μικτό περιοδικό δεκαδικό',
        'Άρρητο αριθμό'
      ][randInt(0, 2)],
      tableData: [
        { label: 'Παρονομαστής', details: `${pickedDen}` },
        { label: 'Πρώτοι παράγοντες', details: 'Περιέχει μόνο δυνάμεις του 2 ή/και του 5' },
        { label: 'Συμπέρασμα', details: 'Τερματίζεται (πεπερασμένος)' }
      ],
      explanation: `Ο παρονομαστής ${pickedDen} αναλύεται αποκλειστικά σε γινόμενο των πρώτων παραγόντων 2 και 5. Συνεπώς, το δεκαδικό ανάπτυγμα είναι πεπερασμένο.`
    };
  },
  () => {
    const dens = [3, 7, 9, 11, 13];
    const pickedDen = dens[randInt(0, dens.length - 1)];
    return {
      title: 'Έλεγχος Περιοδικού Δεκαδικού',
      prompt: `Το ανάγωγο κλάσμα 5/${pickedDen} παράγει:`,
      correct: 'Περιοδικό δεκαδικό αριθμό',
      type: 'mcq',
      distractors: () => [
        'Πεπερασμένο δεκαδικό αριθμό',
        'Ακέραιο αριθμό',
        'Μηδενικό αριθμό'
      ][randInt(0, 2)],
      tableData: [
        { label: 'Παρονομαστής', details: `${pickedDen}` },
        { label: 'Πρώτοι παράγοντες', details: `Περιέχει τον πρώτο αριθμό ${pickedDen} (διάφορο του 2 και του 5)` },
        { label: 'Συμπέρασμα', details: 'Άπειρα περιοδικά ψηφία' }
      ],
      explanation: `Εφόσον ο παρονομαστής περιέχει πρώτο παράγοντα διάφορο του 2 και του 5 (εδώ το ${pickedDen}), η διαίρεση δεν τελειώνει ποτέ και δίνει περιοδικό δεκαδικό.`
    };
  },
  () => {
    return {
      title: 'Απλοποίηση πριν την Ταξινόμηση',
      prompt: 'Το κλάσμα 21/30 μετατρέπεται σε πεπερασμένο ή περιοδικό δεκαδικό αριθμό;',
      correct: 'Πεπερασμένο δεκαδικό (0,7)',
      type: 'mcq',
      distractors: () => [
        'Περιοδικό δεκαδικό με περίοδο το 3',
        'Μικτό περιοδικό δεκαδικό',
        'Άρρητο αριθμό'
      ][randInt(0, 2)],
      tableData: [
        { label: 'Αρχικό κλάσμα', details: '21/30' },
        { label: 'Απλοποίηση με το 3', details: '(21 : 3) / (30 : 3) ＝ 7/10' },
        { label: 'Ανάγωγη μορφή', details: '7/10 ＝ 0,7 (πεπερασμένος)' }
      ],
      explanation: 'Πρώτα απλοποιούμε: 21/30 ＝ 7/10 ＝ 0,7. Ο παράγοντας 3 απλοποιείται, άρα ο δεκαδικός είναι πεπερασμένος.'
    };
  },
  () => {
    return {
      title: 'Μικτός Περιοδικός με Παρονομαστή 6',
      prompt: 'Το κλάσμα 1/6 ισούται με 0,1666... Ποιο είναι το μη περιοδικό του μέρος;',
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Δεκαδική μορφή', details: '0,1666... ＝ 0,1(6)' },
        { label: 'Μη περιοδικό μέρος', details: 'Το ψηφίο 1 (μεταξύ υποδιαστολής και περιόδου)' },
        { label: 'Περίοδος', details: 'Το ψηφίο 6' }
      ],
      explanation: 'Στον αριθμό 0,1666... το ψηφίο 1 δεν επαναλαμβάνεται και αποτελεί το μη περιοδικό μέρος.'
    };
  },
  () => {
    const k = randInt(2, 6);
    return {
      title: 'Μέγιστο Πλήθος Ψηφίων Περιόδου',
      prompt: `Στη διαίρεση ενός κλάσματος με παρονομαστή το ${k}, ποιο είναι το ΜΕΓΙΣΤΟ δυνατό πλήθος ψηφίων που μπορεί να έχει η περίοδος;`,
      correct: k - 1,
      type: 'input',
      tableData: [
        { label: 'Διαιρέτης', details: `${k}` },
        { label: 'Δυνατά μη μηδενικά υπόλοιπα', details: `1, 2, ..., ${k - 1} (συνολικά ${k - 1})` },
        { label: 'Μέγιστη περίοδος', details: `${k - 1} ψηφία` }
      ],
      explanation: `Τα δυνατά μη μηδενικά υπόλοιπα της διαίρεσης με το ${k} είναι το πολύ ${k - 1}. Άρα η περίοδος μπορεί να έχει το πολύ ${k - 1} ψηφία πριν επαναληφθεί αναγκαστικά κάποιο υπόλοιπο.`
    };
  },
  () => {
    return {
      title: 'Κλάσμα με Παρονομαστή 7',
      prompt: 'Πόσα ψηφία έχει η περίοδος του κλάσματος 1/7 (0,142857142857...);',
      correct: 6,
      type: 'input',
      tableData: [
        { label: 'Δεκαδικό ανάπτυγμα', details: '0,142857 142857...' },
        { label: 'Ψηφία περιόδου', details: '1, 4, 2, 8, 5, 7' },
        { label: 'Πλήθος', details: '6 ψηφία' }
      ],
      explanation: 'Η περίοδος του 1/7 είναι το τμήμα 142857, το οποίο αποτελείται από ακριβώς 6 ψηφία.'
    };
  }
];

// POOL Q11: Σύνθετη εύρεση γεννήτριας μικτού περιοδικού (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    return {
      title: 'Γεννήτρια του 0,1666...',
      prompt: 'Ποιο είναι το ανάγωγο κλάσμα που παράγει τον αριθμό 0,1666... (0,1 με περίοδο 6);',
      correct: '1/6',
      type: 'mcq',
      distractors: () => ['1/3', '5/6', '2/9'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Αριθμός', details: 'x ＝ 0,1666...' },
        { label: '10x και 100x', details: '10x ＝ 1,666..., 100x ＝ 16,666...' },
        { label: 'Αφαίρεση', details: '90x ＝ 15 => x ＝ 15/90 ＝ 1/6' }
      ],
      explanation: 'Θέτουμε x ＝ 0,1666... Τότε 100x － 10x ＝ 16,666... － 1,666... => 90x ＝ 15 => x ＝ 15/90 ＝ 1/6.'
    };
  },
  () => {
    return {
      title: 'Γεννήτρια του 0,8333...',
      prompt: 'Ποιο είναι το ανάγωγο κλάσμα του μικτού περιοδικού δεκαδικού 0,8333... (0,8 με περίοδο 3);',
      correct: '5/6',
      type: 'mcq',
      distractors: () => ['4/5', '5/9', '7/8'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Εξισώσεις', details: '100x ＝ 83,333..., 10x ＝ 8,333...' },
        { label: 'Αφαίρεση', details: '90x ＝ 75' },
        { label: 'Αναγωγή', details: '75/90 ＝ (75 : 15) / (90 : 15) ＝ 5/6' }
      ],
      explanation: '90x ＝ 83 － 8 ＝ 75 => x ＝ 75/90. Διαιρώντας με το 15 προκύπτει 5/6.'
    };
  },
  () => {
    return {
      title: 'Γεννήτρια του 0,2555...',
      prompt: 'Στο κλάσμα x ＝ 0,2555..., ποιος είναι ο αριθμητής της μορφής 23/90;',
      correct: 23,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '100x ＝ 25,555..., 10x ＝ 2,555...' },
        { label: 'Διαφορά', details: '90x ＝ 23 => x ＝ 23/90' }
      ],
      explanation: 'Έχουμε 90x ＝ 25 － 2 ＝ 23, άρα x ＝ 23/90. Ο αριθμητής είναι 23.'
    };
  },
  () => {
    return {
      title: 'Γεννήτρια του 1,2333...',
      prompt: 'Ποιος είναι ο αριθμητής του κλάσματος του αριθμού 1,2333... πριν την απλοποίηση (παρονομαστής 90);',
      correct: 111,
      type: 'input',
      tableData: [
        { label: 'Εξισώσεις', details: '100x ＝ 123,333..., 10x ＝ 12,333...' },
        { label: 'Διαφορά', details: '90x ＝ 123 － 12 ＝ 111' }
      ],
      explanation: '100x － 10x ＝ 123 － 12 ＝ 111. Άρα x ＝ 111/90.'
    };
  },
  () => {
    return {
      title: 'Γεννήτρια του 0,4545...',
      prompt: 'Ποιο είναι το απλοποιημένο κλάσμα του απλού περιοδικού 0,4545... (περίοδος 45);',
      correct: '5/11',
      type: 'mcq',
      distractors: () => ['4/9', '45/100', '9/20'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Κλάσμα με 99', details: '45/99' },
        { label: 'Απλοποίηση με το 9', details: '(45 : 9) / (99 : 9) ＝ 5/11' }
      ],
      explanation: 'Το κλάσμα είναι 45/99. Διαιρώντας αριθμητή και παρονομαστή με το 9 βρίσκουμε 5/11.'
    };
  },
  () => {
    return {
      title: 'Γεννήτρια του 0,0909...',
      prompt: 'Ποιο ανάγωγο κλάσμα αντιστοιχεί στον αριθμό 0,0909... (περίοδος 09);',
      correct: '1/11',
      type: 'mcq',
      distractors: () => ['1/9', '9/100', '1/99'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Κλάσμα', details: '9/99' },
        { label: 'Απλοποίηση με το 9', details: '1/11' }
      ],
      explanation: 'Η περίοδος είναι 09, άρα 9/99 ＝ 1/11.'
    };
  }
];

// POOL Q12: Προβλήματα εφαρμογής και καθημερινής ζωής (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    const km = randInt(10, 25);
    const totalAmount = km * 3 + 10;
    return {
      title: 'Μοιρασιά Εξόδων Ταξιδιού σε 3 Άτομα',
      prompt: `Τρία άτομα μοιράζονται ισόποσα ένα συνολικό ποσό εξόδων ${totalAmount} €. Ποια είναι η περίοδος στον δεκαδικό αριθμό του μεριδίου ανά άτομο;`,
      correct: 3,
      type: 'input',
      unit: 'περίοδος',
      tableData: [
        { label: 'Συνολικό ποσό', details: `${totalAmount} €` },
        { label: 'Διαίρεση με το 3', details: `${totalAmount}/3 ＝ ${km + 3},333... €` },
        { label: 'Περίοδος', details: 'Το ψηφίο 3' }
      ],
      explanation: `Διαιρώντας το συνολικό ποσό με το 3, το αποτέλεσμα έχει δεκαδικό μέρος ,333... με περίοδο το 3.`
    };
  },
  () => {
    return {
      title: 'Ισομερής Διανομή Πίτσας σε 3 Παιδιά',
      prompt: '2 πίτσες μοιράζονται ισόποσα σε 3 παιδιά. Ποιος περιοδικός δεκαδικός αριθμός αντιστοιχεί στο μερίδιο κάθε παιδιού (2/3);',
      correct: '0,666...',
      type: 'mcq',
      distractors: () => ['0,222...', '0,333...', '0,5'][randInt(0, 2)],
      tableData: [
        { label: 'Κλάσμα', details: '2/3' },
        { label: 'Δεκαδικό', details: '2/3 ＝ 0,666... (περίοδος 6)' }
      ],
      explanation: 'Το κλάσμα 2/3 ισούται με 0,666... με περίοδο το 6.'
    };
  },
  () => {
    return {
      title: 'Εκπτωτικό Μερίδιο Ενός Τρίτου (1/3)',
      prompt: 'Σε ένα κατάστημα προσφέρεται έκπτωση ίση με το 1/3 της αρχικής τιμής. Ποιο είναι το ποσοστό έκπτωσης εκφρασμένο σε περιοδικό δεκαδικό επί τοις εκατό (%);',
      correct: '33,333... %',
      type: 'mcq',
      distractors: () => ['30 %', '33 %', '33,5 %'][randInt(0, 2)],
      tableData: [
        { label: 'Κλάσμα έκπτωσης', details: '1/3' },
        { label: 'Ποσοστό (%)', details: '(1/3) · 100 ＝ 100/3 ＝ 33,333... %' }
      ],
      explanation: 'Το κλάσμα 1/3 αντιστοιχεί στο 33,333...%.'
    };
  },
  () => {
    return {
      title: 'Χρόνος Ολοκλήρωσης Εργασίας',
      prompt: 'Ένας εργάτης χρειάζεται 20 λεπτά της ώρας για μια εργασία. Ποιο είναι το δεκαδικό μέρος των ωρών που εργάστηκε (20/60 ＝ 1/3);',
      correct: '0,333... ώρες',
      type: 'mcq',
      distractors: () => ['0,2 ώρες', '0,25 ώρες', '0,5 ώρες'][randInt(0, 2)],
      tableData: [
        { label: 'Λεπτά σε ώρες', details: '20/60 ＝ 1/3' },
        { label: 'Δεκαδική μορφή', details: '1/3 ＝ 0,333... ώρες' }
      ],
      explanation: 'Τα 20 λεπτά αντιστοιχούν στο 1/3 της ώρας, δηλαδή 0,333... ώρες.'
    };
  },
  () => {
    return {
      title: 'Τεμαχισμός Σχοινιού σε 9 Ίσα Μέρη',
      prompt: 'Ένα σχοινί μήκους 7 μέτρων κόβεται σε 9 ίσα κομμάτια (7/9 m). Ποιο είναι το δεκαδικό μήκος κάθε κομματιού;',
      correct: '0,777... m',
      type: 'mcq',
      distractors: () => ['0,7 m', '0,79 m', '0,8 m'][randInt(0, 2)],
      tableData: [
        { label: 'Μήκος', details: '7 m' },
        { label: 'Τεμάχια', details: '9' },
        { label: 'Μήκος ανά τεμάχιο', details: '7/9 ＝ 0,777... m' }
      ],
      explanation: 'Το κλάσμα 7/9 δίνει 0,777... μέτρα ανά τεμάχιο.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση Περιοδικών Δεκαδικών',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος: 0,3 ή 0,33 ή 0,333... (περιοδικός);',
      correct: '0,333...',
      type: 'mcq',
      distractors: () => ['0,3', '0,33', 'Είναι όλοι ίσοι'][randInt(0, 2)],
      tableData: [
        { label: '0,3', details: '0,3000...' },
        { label: '0,33', details: '0,3300...' },
        { label: '0,333...', details: '0,3333... (έχει 3 σε όλες τις θέσεις)' }
      ],
      explanation: 'Συγκρίνοντας τα ψηφία από αριστερά προς τα δεξιά: 0,3333... > 0,3300... > 0,3000...'
    };
  }
];

export default function DekadikiMorfiRitonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Ορισμός ρητού
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Ορισμός Ρητού Αριθμού',
      prompt: q1IsCorrect
        ? 'Κάθε ρητός αριθμός μπορεί να γραφεί ως κλάσμα με αριθμητή ακέραιο και παρονομαστή μη μηδενικό φυσικό.'
        : 'Υπάρχουν ρητοί αριθμοί που δεν μπορούν με κανέναν τρόπο να παρασταθούν ως κλάσμα ακεραίων.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Εξ ορισμού, ρητός είναι κάθε αριθμός που μπορεί να λάβει τη μορφή μ/ν όπου μ ακέραιος και ν φυσικός διάφορος του μηδενός.'
    });

    // Q2: MCQ - Αναγνώριση Ρητού
    const q2Options = ['0,333...', 'π (3,14159...)', '√2', '√3'];
    qList.push({
      id: 2,
      title: 'Αναγνώριση Ρητού Αριθμού',
      prompt: 'Ποιος από τους παρακάτω αριθμούς ΕΙΝΑΙ ρητός αριθμός;',
      type: 'mcq',
      correct: '0,333...',
      options: ensureFourUniqueOptions('0,333...', () => q2Options[randInt(1, 3)]),
      explanation: 'Ο 0,333... είναι περιοδικός δεκαδικός αριθμός (ισούται με 1/3) και είναι ρητός. Οι αριθμοί π, √2 και √3 έχουν άπειρα μη περιοδικά ψηφία και είναι άρρητοι.'
    });

    // Q3: Input - Εύρεση Περιόδου
    const pDigit = randInt(2, 8);
    qList.push({
      id: 3,
      title: 'Αναγνώριση Περιόδου',
      prompt: `Ποιο ψηφίο αποτελεί την περίοδο του αριθμού 0,${pDigit}${pDigit}${pDigit}...;`,
      type: 'input',
      correct: pDigit,
      explanation: `Το ψηφίο που επαναλαμβάνεται επ' άπειρον είναι το ${pDigit}, άρα η περίοδος είναι ${pDigit}.`
    });

    // Q4: MCQ - Είδος Περιοδικού (Απλός vs Μικτός)
    const isSimple = Math.random() < 0.5;
    const testNumStr = isSimple ? '0,454545...' : '0,2777...';
    const ansType = isSimple ? 'Απλός Περιοδικός' : 'Μικτός Περιοδικός';
    qList.push({
      id: 4,
      title: 'Διάκριση Απλού και Μικτού Περιοδικού',
      prompt: `Πώς χαρακτηρίζεται ο δεκαδικός αριθμός ${testNumStr};`,
      type: 'mcq',
      correct: ansType,
      options: ensureFourUniqueOptions(ansType, () => [
        'Απλός Περιοδικός',
        'Μικτός Περιοδικός',
        'Πεπερασμένος Δεκαδικός',
        'Άρρητος Αριθμός'
      ][randInt(0, 3)]),
      explanation: isSimple
        ? 'Είναι απλός περιοδικός γιατί η περίοδος (45) ξεκινά αμέσως μετά την υποδιαστολή.'
        : 'Είναι μικτός περιοδικός γιατί ανάμεσα στην υποδιαστολή και την περίοδο (7) υπάρχει το μη περιοδικό ψηφίο 2.'
    });

    // Q5: True / False - Πεπερασμένοι Δεκαδικοί
    const q5IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: 'Κριτήριο Παρονομαστή',
      prompt: q5IsCorrect
        ? 'Ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό αν ο παρονομαστής του περιέχει μόνο πρώτους παράγοντες το 2 ή/και το 5.'
        : 'Ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό μόνο όταν ο παρονομαστής του είναι περιττός αριθμός.',
      type: 'tf',
      correct: q5IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η δεκαδική μορφή ενός ανάγωγου κλάσματος είναι πεπερασμένη αν και μόνο αν ο παρονομαστής αναλύεται αποκλειστικά σε δυνάμεις του 2 και του 5.'
    });

    // Q6: Input - Μετατροπή απλού κλάσματος
    qList.push({
      id: 6,
      title: 'Δεκαδική Μορφή του 1/4',
      prompt: 'Ποια είναι η δεκαδική μορφή του κλάσματος 1/4;',
      type: 'input',
      correct: 0.25,
      explanation: 'Το κλάσμα 1/4 ισούται ακριβώς με 0,25.'
    });

    // Q7: MCQ - Γεννήτρια του 0,333...
    qList.push({
      id: 7,
      title: 'Γεννήτρια του 0,333...',
      prompt: 'Ποιο είναι το απλοποιημένο κλάσμα του αριθμού 0,333...;',
      type: 'mcq',
      correct: '1/3',
      options: ensureFourUniqueOptions('1/3', () => [
        '3/10',
        '3/100',
        '1/4'
      ][randInt(0, 2)]),
      renderOption: (opt) => {
        const parts = opt.split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      explanation: '0,333... ＝ 3/9 ＝ 1/3.'
    });

    // Q8: Input - Πλήθος ψηφίων περιόδου
    const pDigitsCount = randInt(2, 4);
    const samplePeriod = pDigitsCount === 2 ? '0,1515...' : pDigitsCount === 3 ? '0,123123...' : '0,12341234...';
    qList.push({
      id: 8,
      title: 'Πλήθος Ψηφίων Περιόδου',
      prompt: `Πόσα ψηφία έχει η περίοδος του αριθμού ${samplePeriod};`,
      type: 'input',
      correct: pDigitsCount,
      explanation: `Το επαναλαμβανόμενο τμήμα έχει μήκος ακριβώς ${pDigitsCount} ψηφία.`
    });

    // Q9 - Q12: Επιλογή από ανεξάρτητες δεξαμενές
    const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)]();
    const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)]();
    const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)]();
    const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)]();

    const formatPoolItem = (item, id) => {
      let options = undefined;
      if (item.type === 'mcq') {
        options = ensureFourUniqueOptions(item.correct, item.distractors);
      }
      return {
        id,
        title: item.title,
        prompt: item.prompt,
        type: item.type,
        correct: item.correct,
        options,
        renderOption: item.renderOption,
        unit: item.unit,
        tableData: item.tableData,
        explanation: item.explanation
      };
    };

    qList.push(formatPoolItem(p9, 9));
    qList.push(formatPoolItem(p10, 10));
    qList.push(formatPoolItem(p11, 11));
    qList.push(formatPoolItem(p12, 12));

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, []);

  const handleAnswerChange = (qId, val) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title="Ασκήσεις: Δεκαδική Μορφή Ρητών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στη δεκαδική μορφή ρητών, περιοδικούς δεκαδικούς και μετατροπές με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/01-dekadiki-morfi-riton"
      backText="Θεωρία Κεφ. 1"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/01-dekadiki-morfi-riton"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase("ΘΕΩΡΙΑ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase("ΑΣΚΗΣΕΙΣ •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black mt-2">
                Δεκαδική Μορφή Ρητών Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-sm sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».
              </p>
            </div>
            <div>
              <button
                onClick={loadNewSet}
                className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase("ΝΕΕΣ ΑΣΚΗΣΕΙΣ")}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-6 sm:p-8 bg-white border-2 border-indigo-200 rounded-3xl shadow-lg mb-8 text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Αποτέλεσμα: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις δεκαδικές μορφές των ρητών και τις μετατροπές τους.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους περιοδικούς αριθμούς!'}
            </p>
            <button
              onClick={loadNewSet}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow transition"
            >
              🔄 {toCleanUppercase("ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ")}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ Σωστό' : '✗ Λάθος'}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-4">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 rounded-2xl font-bold text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-4 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1 font-semibold text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex items-center gap-3 max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9.,-]/g, '');
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder="Απάντηση..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900"
                      />
                      {q.unit && (
                        <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION */}
                {submitted && (
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden bg-white">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">Στοιχείο / Βήμα</th>
                              <th className="p-2 border-b">Ανάλυση Δεδομένων</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-4 bg-slate-100/70 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        <span>Σωστή Απάντηση:</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 sm:py-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              {!submitted ? (
                <div className="text-xs sm:text-sm font-bold text-slate-700">
                  {toCleanUppercase("ΑΠΑΝΤΗΘΗΚΑΝ")}: <span className="text-indigo-600 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex items-center gap-3 text-xs sm:text-sm font-black">
                  <span className="text-emerald-700">{toCleanUppercase("ΣΚΟΡ")}: {score} / 12</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-indigo-700">{toCleanUppercase("ΠΟΣΟΣΤΟ")}: {Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase("ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ")}
                </button>
              ) : (
                <button
                  onClick={loadNewSet}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition"
                >
                  {toCleanUppercase("ΝΕΕΣ ΑΣΚΗΣΕΙΣ")}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
