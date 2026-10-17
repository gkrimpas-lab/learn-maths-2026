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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 shrink-0 leading-none ${className}`}>
      <span className="border-b-[1.5px] border-current px-0.5 pb-0.5 text-center text-[0.88em] w-full block">
        {num}
      </span>
      <span className="px-0.5 pt-0.5 text-center text-[0.88em] w-full block">
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

// POOL Q9: Σύνθετη Απλοποίηση Παραστάσεων Δυνάμεων (Βάσεις 2, 3, 5)
const PROBLEM_POOL_Q9 = [
  // 1. Παράσταση μορφής (2^a * 2^b)^c / 2^d
  () => {
    const a = randInt(2, 4);
    const b = randInt(1, 3);
    const expNum = (a - b) * 2;
    const d = expNum - randInt(1, 2);
    const finalExp = expNum - d;
    const finalVal = Math.pow(2, finalExp);
    return {
      title: 'Σύνθετη Απλοποίηση Δυνάμεων Βάσης 2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Να υπολογιστεί η αριθμητική τιμή της παράστασης <Frac num={<span>(2<sup>{a}</sup> · 2<sup>－{b}</sup>)<sup>2</sup></span>} den={<span>2<sup>{d}</sup></span>} />.
        </span>
      ),
      correct: finalVal,
      type: 'input',
      tableData: [
        { label: '1. Γινόμενο στην παρένθεση', details: `2^(${a}－${b}) ＝ 2^${a - b}` },
        { label: '2. Δύναμη δύναμης', details: `(2^${a - b})² ＝ 2^${expNum}` },
        { label: '3. Πηλίκο δυνάμεων', details: `2^${expNum} / 2^${d} ＝ 2^(${expNum}－${d}) ＝ 2^${finalExp} ＝ ${finalVal}` }
      ],
      explanation: `Εφαρμόζουμε κατά σειρά τις ιδιότητες: αᵐ · αⁿ ＝ αᵐ⁺ⁿ, (αᵐ)ⁿ ＝ αᵐ˙ⁿ και αᵐ / αⁿ ＝ αᵐ⁻ⁿ. Το αποτέλεσμα είναι 2^${finalExp} ＝ ${finalVal}.`
    };
  },
  // 2. Μετατροπή βάσης 9 και 27 σε δύναμη του 3
  () => {
    const k = randInt(1, 2);
    const res = Math.pow(3, k);
    return {
      title: 'Αναγωγή Δυνάμεων σε Κοινή Βάση 3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Frac num={<span>9<sup>3</sup> · 3<sup>－2</sup></span>} den={<span>27<sup>{k === 1 ? '1' : '1'}</sup> · 3</span>} />;
        </span>
      ),
      correct: res === 3 ? 9 : 3,
      type: 'input',
      tableData: [
        { label: 'Αναγωγή στη βάση 3', details: '9³ ＝ (3²)³ ＝ 3⁶  και  27¹ ＝ 3³' },
        { label: 'Αριθμητής', details: '3⁶ · 3⁻² ＝ 3⁴' },
        { label: 'Παρονομαστής', details: '3³ · 3¹ ＝ 3⁴ (ή 3³)' },
        { label: 'Αποτέλεσμα', details: 'Εκτέλεση πηλίκου δυνάμεων' }
      ],
      explanation: 'Γράφουμε όλες τις βάσεις ως δυνάμεις του 3: 9 ＝ 3² και 27 ＝ 3³. Μετά την αναγωγή των εκθετών προκύπτει το τελικό αποτέλεσμα.'
    };
  },
  // 3. Δυνάμεις κλασμάτων με αρνητικό εκθέτη
  () => {
    const a = randInt(2, 3);
    const b = randInt(4, 5);
    const val = Math.pow(b, 2) - Math.pow(a, 2);
    return {
      title: 'Διαφορά Δυνάμεων με Αρνητικούς Εκθέτες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης (<Frac num="1" den={`${b}`} />)<sup>－2</sup> － (<Frac num="1" den={`${a}`} />)<sup>－2</sup>;
        </span>
      ),
      correct: val,
      type: 'input',
      tableData: [
        { label: '1ος όρος', details: `(1/${b})⁻² ＝ ${b}² ＝ ${b * b}` },
        { label: '2ος όρος', details: `(1/${a})⁻² ＝ ${a}² ＝ ${a * a}` },
        { label: 'Διαφορά', details: `${b * b} － ${a * a} ＝ ${val}` }
      ],
      explanation: `Ο αρνητικός εκθέτης αντιστρέφει το κλάσμα: (1/β)⁻² ＝ β². Επομένως ${b * b} － ${a * a} ＝ ${val}.`
    };
  },
  // 4. Άθροισμα δυνάμεων του (-1)
  () => {
    const n = randInt(10, 50) * 2; // Άρτιος
    return {
      title: 'Διαδοχικές Δυνάμεις του (－1)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης (－1)<sup>{n}</sup> ＋ (－1)<sup>{n + 1}</sup> ＋ (－1)<sup>{n + 2}</sup>;
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: [
        { label: `(－1)^${n} (άρτιος)`, details: '＋1' },
        { label: `(－1)^${n + 1} (περιττός)`, details: '－1' },
        { label: `(－1)^${n + 2} (άρτιος)`, details: '＋1' },
        { label: 'Άθροισμα', details: '1 ＋ (－1) ＋ 1 ＝ 1' }
      ],
      explanation: 'Το －1 σε άρτιο εκθέτη δίνει ＋1, ενώ σε περιττό δίνει －1. Έτσι: 1 － 1 ＋ 1 ＝ 1.'
    };
  },
  // 5. Συνδυασμός δύναμης και ρίζας (π.χ. (√2)^6 / 2^2)
  () => {
    return {
      title: 'Συνδυασμός Δύναμης και Τετραγωνικής Ρίζας',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Frac num={<span>(<Radical>2</Radical>)<sup>6</sup></span>} den={<span>2<sup>2</sup></span>} />;
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός αριθμητή', details: '(√2)⁶ ＝ ((√2)²)³ ＝ 2³ ＝ 8' },
        { label: 'Υπολογισμός παρονομαστή', details: '2² ＝ 4' },
        { label: 'Πηλίκο', details: '8 / 4 ＝ 2 (ή 2³⁻² ＝ 2¹ ＝ 2)' }
      ],
      explanation: 'Επειδή (√2)² ＝ 2, έχουμε (√2)⁶ ＝ 2³ ＝ 8. Άρα 8 / 4 ＝ 2.'
    };
  },
  // 6. Γινόμενο δυνάμεων με αντίθετους εκθέτες
  () => {
    const a = randInt(2, 4);
    return {
      title: 'Παράσταση με Μηδενικό Τελικό Εκθέτη',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης 5<sup>{a}</sup> · (5<sup>－1</sup>)<sup>{a}</sup> ＋ 7<sup>0</sup>;
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: '1ο γινόμενο', details: `5^${a} · 5^(－${a}) ＝ 5^0 ＝ 1` },
        { label: '2ος όρος', details: '7⁰ ＝ 1' },
        { label: 'Άθροισμα', details: '1 ＋ 1 ＝ 2' }
      ],
      explanation: `5^${a} · 5^(－${a}) ＝ 5⁰ ＝ 1 και 7⁰ ＝ 1. Το άθροισμα ισούται με 2.`
    };
  }
];

// POOL Q10: Παραστάσεις με Μεταβλητές & Εκθέτες (Απλοποίηση τύπου ΕΜΕ / Σχολικού)
const PROBLEM_POOL_Q10 = [
  () => {
    return {
      title: 'Απλοποίηση Μονωνύμων με Εκθέτες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Απλοποιώντας την παράσταση <Frac num={<span>(2 · x<sup>2</sup> · y)<sup>3</sup></span>} den={<span>4 · x<sup>4</sup> · y<sup>3</sup></span>} /> για x, y ≠ 0, ποιο μονώνυμο προκύπτει;
        </span>
      ),
      correct: '2·x²',
      type: 'mcq',
      distractors: () => ['4·x²', '2·x', 'x²'][randInt(0, 2)],
      renderOption: (opt) => opt === '2·x²' ? '2 · x²' : opt === '4·x²' ? '4 · x²' : opt,
      tableData: [
        { label: 'Αριθμητής', details: '2³ · (x²)³ · y³ ＝ 8 · x⁶ · y³' },
        { label: 'Παρονομαστής', details: '4 · x⁴ · y³' },
        { label: 'Διαίρεση', details: '(8/4) · x^(6－4) · y^(3－3) ＝ 2 · x² · 1 ＝ 2·x²' }
      ],
      explanation: 'Υψώνουμε κάθε παράγοντα του αριθμητή στην 3η δύναμη και κατόπιν διαιρούμε τους συντελεστές και τις μεταβλητές.'
    };
  },
  () => {
    const k = randInt(2, 4);
    return {
      title: 'Απλοποίηση Αλγεβρικού Κλάσματος Δυνάμεων',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο συντελεστής του x στην απλοποιημένη μορφή του κλάσματος <Frac num={<span>{k * 3} · x<sup>5</sup></span>} den={<span>3 · x<sup>4</sup></span>} /> (x ≠ 0);
        </span>
      ),
      correct: k,
      type: 'input',
      tableData: [
        { label: 'Συντελεστές', details: `${k * 3} / 3 ＝ ${k}` },
        { label: 'Μεταβλητή', details: 'x⁵ / x⁴ ＝ x^(5－4) ＝ x' },
        { label: 'Αποτέλεσμα', details: `${k} · x` }
      ],
      explanation: `Διαιρούμε αριθμητή και παρονομαστή: (${k * 3}/3) · x^(5－4) ＝ ${k} · x.`
    };
  },
  () => {
    return {
      title: 'Απλοποίηση με Αρνητικό Εκθέτη σε Μεταβλητή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο εκθέτης του x στην παράσταση x<sup>－3</sup> · (x<sup>2</sup>)<sup>4</sup> (x ≠ 0);
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Δύναμη δύναμης', details: '(x²)⁴ ＝ x⁸' },
        { label: 'Γινόμενο', details: 'x⁻³ · x⁸ ＝ x^(－3＋8) ＝ x⁵' }
      ],
      explanation: 'Πρώτα εκτελούμε τη δύναμη δύναμης (x²)⁴ ＝ x⁸ και μετά προσθέτουμε τους εκθέτες: －3 ＋ 8 ＝ 5.'
    };
  },
  () => {
    return {
      title: 'Πρόσημο Αλγεβρικής Δύναμης',
      prompt: 'Αν x πραγματικός αριθμός με x ≠ 0, ποια από τις παρακάτω παραστάσεις είναι ΠΑΝΤΟΤΕ θετική;',
      correct: 'x⁴',
      type: 'mcq',
      distractors: () => ['x³', '－x²', 'x⁵'][randInt(0, 2)],
      tableData: [
        { label: 'x⁴ (άρτιος εκθέτης)', details: 'Πάντοτε x⁴ ＞ 0 για κάθε x ≠ 0' },
        { label: 'x³, x⁵ (περιττός εκθέτης)', details: 'Αρνητικό αν x ＜ 0' },
        { label: '－x²', details: 'Πάντοτε αρνητικό (－x² ＜ 0)' }
      ],
      explanation: 'Κάθε μη μηδενικός αριθμός υψωμένος σε άρτιο εκθέτη (όπως το 4) είναι πάντοτε θετικός.'
    };
  },
  () => {
    return {
      title: 'Ισότητα Δυνάμεων με Μεταβλητή στον Εκθέτη',
      prompt: 'Αν 2ˣ ＝ 32, ποια είναι η τιμή του πραγματικού αριθμού x;',
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση του 32', details: '32 ＝ 2 · 2 · 2 · 2 · 2 ＝ 2⁵' },
        { label: 'Εξίσωση', details: '2ˣ ＝ 2⁵ => x ＝ 5' }
      ],
      explanation: 'Επειδή 2⁵ ＝ 32 και οι βάσεις είναι ίσες, έπεται ότι x ＝ 5.'
    };
  },
  () => {
    return {
      title: 'Εξίσωση με Αρνητικό Εκθέτη',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν 3<sup>x</sup> ＝ <Frac num="1" den="27" />, ποια είναι η τιμή του x;
        </span>
      ),
      correct: -3,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση κλάσματος', details: '1 / 27 ＝ 1 / 3³ ＝ 3⁻³' },
        { label: 'Εξίσωση', details: '3ˣ ＝ 3⁻³ => x ＝ －3' }
      ],
      explanation: 'Το 1/27 γράφεται ως 3⁻³, άρα x ＝ －3.'
    };
  }
];

// POOL Q11: Τυποποιημένη Μορφή & Πράξεις (Επιστημονική Σημειογραφία)
const PROBLEM_POOL_Q11 = [
  () => {
    return {
      title: 'Γινόμενο σε Τυποποιημένη Μορφή',
      prompt: 'Πόσο ισούται το γινόμενο (3 · 10⁵) · (4 · 10⁴) εκφρασμένο σε τυποποιημένη μορφή;',
      correct: '1,2 · 10¹⁰',
      type: 'mcq',
      distractors: () => ['12 · 10⁹', '1,2 · 10⁹', '12 · 10²⁰'][randInt(0, 2)],
      tableData: [
        { label: 'Πολλαπλασιασμός', details: '(3 · 4) · (10⁵ · 10⁴) ＝ 12 · 10⁹' },
        { label: 'Τυποποίηση (1 ≤ α ＜ 10)', details: '12 ＝ 1,2 · 10¹ => (1,2 · 10¹) · 10⁹ ＝ 1,2 · 10¹⁰' }
      ],
      explanation: '12 · 10⁹ ＝ (1,2 · 10¹) · 10⁹ ＝ 1,2 · 10¹⁰.'
    };
  },
  () => {
    return {
      title: 'Διαίρεση σε Τυποποιημένη Μορφή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το πηλίκο <Frac num="2 · 10⁴" den="8 · 10⁷" /> σε τυποποιημένη μορφή;
        </span>
      ),
      correct: '2,5 · 10⁻⁴',
      type: 'mcq',
      distractors: () => ['0,25 · 10⁻³', '2,5 · 10⁻³', '4 · 10⁻⁴'][randInt(0, 2)],
      tableData: [
        { label: 'Διαίρεση συντελεστών', details: '2 / 8 ＝ 0,25' },
        { label: 'Διαίρεση δυνάμεων', details: '10⁴ / 10⁷ ＝ 10^(4－7) ＝ 10⁻³' },
        { label: 'Τυποποίηση', details: '0,25 · 10⁻³ ＝ (2,5 · 10⁻¹) · 10⁻³ ＝ 2,5 · 10⁻⁴' }
      ],
      explanation: '0,25 · 10⁻³ ＝ 2,5 · 10⁻⁴.'
    };
  },
  () => {
    const zeros = randInt(4, 6);
    return {
      title: 'Εκθέτης Μικρού Αριθμού',
      prompt: `Αν γράψουμε τον δεκαδικό αριθμό 0,${'0'.repeat(zeros)}5 σε τυποποιημένη μορφή 5 · 10ᵏ, ποιος είναι ο ακέραιος εκθέτης k;`,
      correct: -(zeros + 1),
      type: 'input',
      tableData: [
        { label: 'Πλήθος δεκαδικών θέσεων', details: `${zeros + 1} θέσεις δεξιά` },
        { label: 'Τυποποιημένη μορφή', details: `5 · 10^(－${zeros + 1})` }
      ],
      explanation: `Η υποδιαστολή μετακινείται ${zeros + 1} θέσεις προς τα δεξιά, άρα k ＝ －${zeros + 1}.`
    };
  },
  () => {
    return {
      title: 'Πρόσθεση Αριθμών σε Τυποποιημένη Μορφή',
      prompt: 'Πόσο ισούται το άθροισμα 3 · 10⁴ ＋ 5 · 10³;',
      correct: 35000,
      type: 'input',
      tableData: [
        { label: '3 · 10⁴', details: '30.000' },
        { label: '5 · 10³', details: '5.000' },
        { label: 'Άθροισμα', details: '30.000 ＋ 5.000 ＝ 35.000' }
      ],
      explanation: '30.000 ＋ 5.000 ＝ 35.000 (ή 3,5 · 10⁴).'
    };
  },
  () => {
    return {
      title: 'Τάξη Μεγέθους / Σύγκριση',
      prompt: 'Πόσες φορές μεγαλύτερος είναι ο αριθμός 6 · 10⁸ από τον αριθμό 2 · 10⁵;',
      correct: 3000,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Πηλίκο', details: '(6 · 10⁸) / (2 · 10⁵)' },
        { label: 'Υπολογισμός', details: '(6/2) · 10^(8－5) ＝ 3 · 10³ ＝ 3.000' }
      ],
      explanation: '(6 · 10⁸) / (2 · 10⁵) ＝ 3 · 10³ ＝ 3.000 φορές.'
    };
  },
  () => {
    return {
      title: 'Τετράγωνο Αριθμού σε Τυποποιημένη Μορφή',
      prompt: 'Πόσο ισούται η δύναμη (2 · 10³)² σε τυποποιημένη μορφή;',
      correct: '4 · 10⁶',
      type: 'mcq',
      distractors: () => ['4 · 10⁵', '2 · 10⁶', '4 · 10⁹'][randInt(0, 2)],
      tableData: [
        { label: 'Ανάπτυγμα', details: '2² · (10³)²' },
        { label: 'Υπολογισμός', details: '4 · 10^(3·2) ＝ 4 · 10⁶' }
      ],
      explanation: '(2 · 10³)² ＝ 2² · (10³)² ＝ 4 · 10⁶.'
    };
  }
];

// POOL Q12: Εφαρμοσμένα Προβλήματα Φυσικής & Γεωμετρίας (Από το νέο βιβλίο)
const PROBLEM_POOL_Q12 = [
  // 1. Ταχύτητα φωτός & απόσταση (άσκηση σχολικού)
  () => {
    return {
      title: 'Χρόνος Διάδοσης Φωτός από τον Ήλιο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Η απόσταση Γης - Ήλιου είναι περίπου 1,5 · 10⁸ km και το φως κινείται με ταχύτητα 3 · 10⁵ km/s. Πόσα δευτερόλεπτα χρειάζεται το φως για να φτάσει στη Γη;
        </span>
      ),
      correct: 500,
      type: 'input',
      unit: 's',
      tableData: [
        { label: 'Τύπος χρόνου', details: 't ＝ s / v' },
        { label: 'Διαίρεση', details: '(1,5 · 10⁸) / (3 · 10⁵) ＝ (1,5 / 3) · 10³ ＝ 0,5 · 1000 ＝ 500 s' }
      ],
      explanation: 't ＝ (1,5 · 10⁸) / (3 · 10⁵) ＝ 0,5 · 10³ ＝ 500 δευτερόλεπτα (περίπου 8 λεπτά και 20 δευτερόλεπτα).'
    };
  },
  // 2. Όγκος Κύβου (άσκηση σχολικού για διπλασιασμό ακμής)
  () => {
    return {
      title: 'Μεταβολή Όγκου Κύβου',
      prompt: 'Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου (από α σε 2α), πόσες φορές αυξάνεται ο όγκος του;',
      correct: 8,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Αρχικός όγκος V₁', details: 'α³' },
        { label: 'Νέος όγκος V₂', details: '(2α)³ ＝ 2³ · α³ ＝ 8 · α³' },
        { label: 'Λόγος όγκων', details: 'V₂ / V₁ ＝ 8' }
      ],
      explanation: 'Ο όγκος εξαρτάται από την 3η δύναμη της ακμής: (2α)³ ＝ 8 · α³, άρα ο όγκος οκταπλασιάζεται (8 φορές).'
    };
  },
  // 3. Εμβαδόν επιφάνειας κύβου
  () => {
    return {
      title: 'Μεταβολή Εμβαδού Επιφάνειας Κύβου',
      prompt: 'Αν τριπλασιάσουμε την ακμή ενός κύβου (από α σε 3α), πόσες φορές αυξάνεται το εμβαδόν της ολικής του επιφάνειας;',
      correct: 9,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Αρχικό εμβαδόν Ε₁', details: '6 · α²' },
        { label: 'Νέο εμβαδόν Ε₂', details: '6 · (3α)² ＝ 6 · 9 · α² ＝ 9 · Ε₁' },
        { label: 'Λόγος εμβαδών', details: 'Ε₂ / Ε₁ ＝ 9' }
      ],
      explanation: 'Το εμβαδόν εξαρτάται από το τετράγωνο της ακμής: (3α)² ＝ 9 · α², άρα εννεαπλασιάζεται (9 φορές).'
    };
  },
  // 4. Αριθμός κυττάρων / διπλασιασμός (εκθετική αύξηση)
  () => {
    const hours = randInt(3, 5);
    const cells = Math.pow(2, hours);
    return {
      title: 'Εκθετικός Πολλαπλασιασμός Βακτηρίων',
      prompt: `Ένας πληθυσμός βακτηρίων διπλασιάζεται κάθε ώρα (2ⁿ). Αν ξεκινήσουμε με 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από ${hours} ώρες;`,
      correct: cells,
      type: 'input',
      unit: 'βακτήρια',
      tableData: [
        { label: 'Τύπος πληθυσμού', details: `2^t όπου t οι ώρες` },
        { label: 'Υπολογισμός', details: `2^${hours} ＝ ${cells}` }
      ],
      explanation: `Κάθε ώρα ο πληθυσμός διπλασιάζεται: 2^${hours} ＝ ${cells} βακτήρια.`
    };
  },
  // 5. Υπολογισμός μάζας ατόμων (από το σχολικό βιβλίο)
  () => {
    return {
      title: 'Μάζα Ατόμων σε Τυποποιημένη Μορφή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν ένα άτομο υδρογόνου έχει μάζα 1,7 · 10<sup>－27</sup> kg, ποια είναι η μάζα 2 · 10²³ ατόμων υδρογόνου σε kg;
        </span>
      ),
      correct: '3,4 · 10⁻⁴ kg',
      type: 'mcq',
      distractors: () => ['3,4 · 10⁻⁵⁰ kg', '3,4 · 10⁴ kg', '1,7 · 10⁻⁴ kg'][randInt(0, 2)],
      tableData: [
        { label: 'Γινόμενο μαζών', details: '(1,7 · 10⁻²⁷) · (2 · 10²³)' },
        { label: 'Υπολογισμός', details: '(1,7 · 2) · 10^(－27＋23) ＝ 3,4 · 10⁻⁴ kg' }
      ],
      explanation: '(1,7 · 2) · 10^(－27＋23) ＝ 3,4 · 10⁻⁴ kg.'
    };
  },
  // 6. Διάμετρος οπτικής ίνας (από το σχολικό βιβλίο)
  () => {
    return {
      title: 'Διάμετρος Οπτικής Ίνας σε Μέτρα',
      prompt: 'Η διάμετρος μιας οπτικής ίνας είναι 130 μικρόμετρα (1 μm ＝ 10⁻⁶ m). Ποια είναι η διάμετρός της σε μέτρα σε τυποποιημένη μορφή;',
      correct: '1,3 · 10⁻⁴ m',
      type: 'mcq',
      distractors: () => ['13 · 10⁻⁵ m', '1,3 · 10⁻⁶ m', '1,3 · 10⁻⁸ m'][randInt(0, 2)],
      tableData: [
        { label: 'Μετατροπή', details: '130 · 10⁻⁶ m' },
        { label: 'Τυποποίηση', details: '(1,3 · 10²) · 10⁻⁶ ＝ 1,3 · 10⁻⁴ m' }
      ],
      explanation: '130 · 10⁻⁶ ＝ (1,3 · 10²) · 10⁻⁶ ＝ 1,3 · 10⁻⁴ m.'
    };
  }
];

export default function DinameisPragmatikonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Μηδενικός εκθέτης
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Μηδενικός Εκθέτης',
      prompt: q1IsCorrect
        ? 'Για κάθε πραγματικό αριθμό α ≠ 0, ισχύει πάντοτε α⁰ ＝ 1.'
        : 'Για κάθε πραγματικό αριθμό α, ισχύει πάντοτε α⁰ ＝ 0.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Εξ ορισμού, κάθε μη μηδενικός πραγματικός αριθμός υψωμένος στο μηδέν ισούται με 1 (α⁰ ＝ 1). Το 0⁰ δεν ορίζεται.'
    });

    // Q2: True / False - Αρνητικός εκθέτης
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Έννοια Αρνητικού Εκθέτη',
      prompt: q2Choice
        ? 'Ο αρνητικός εκθέτης σε έναν πραγματικό αριθμό σημαίνει αντιστροφή της βάσης (α⁻ⁿ ＝ 1 / αⁿ).'
        : 'Ο αρνητικός εκθέτης μετατρέπει το τελικό αποτέλεσμα υποχρεωτικά σε αρνητικό αριθμό.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Ο αρνητικός εκθέτης δηλώνει τον αντίστροφο της δύναμης και δεν καθορίζει το πρόσημο του αποτελέσματος (π.χ. 2⁻³ ＝ 1/8 ＞ 0).'
    });

    // Q3: MCQ - Πρόσημο δύναμης
    qList.push({
      id: 3,
      title: 'Κανόνας Προσήμων σε Δυνάμεις',
      prompt: 'Ποιο είναι το πρόσημο της δύναμης (－4)⁵;',
      type: 'mcq',
      correct: 'Αρνητικό (－), γιατί ο εκθέτης είναι περιττός',
      options: ensureFourUniqueOptions('Αρνητικό (－), γιατί ο εκθέτης είναι περιττός', () => [
        'Θετικό (＋), γιατί κάθε δύναμη είναι θετική',
        'Μηδέν',
        'Δεν ορίζεται'
      ][randInt(0, 2)]),
      explanation: 'Αρνητική βάση με περιττό εκθέτη (5) δίνει πάντοτε αρνητικό αποτέλεσμα.'
    });

    // Q4: MCQ - Διαφορά παρένθεσης
    qList.push({
      id: 4,
      title: 'Δύναμη με και χωρίς Παρένθεση',
      prompt: 'Ποια είναι η σχέση ανάμεσα στο (－3)² και στο －3²;',
      type: 'mcq',
      correct: '(－3)² ＝ 9 ενώ －3² ＝ －9',
      options: ensureFourUniqueOptions('(－3)² ＝ 9 ενώ －3² ＝ －9', () => [
        'Είναι ίσα και τα δύο με 9',
        'Είναι ίσα και τα δύο με －9',
        '(－3)² ＝ －9 ενώ －3² ＝ 9'
      ][randInt(0, 2)]),
      explanation: 'Στο (－3)² ο εκθέτης επηρεάζει και το μείον: (－3)·(－3) ＝ 9. Στο －3² ο εκθέτης επηρεάζει μόνο το 3: －(3·3) ＝ －9.'
    });

    // Q5: Input - Υπολογισμός δύναμης ρίζας
    qList.push({
      id: 5,
      title: 'Τετράγωνο Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή της δύναμης (<Radical>11</Radical>)²;
        </span>
      ),
      type: 'input',
      correct: 11,
      explanation: 'Για κάθε α ≥ 0, ισχύει (√α)² ＝ α. Άρα (√11)² ＝ 11.'
    });

    // Q6: MCQ - Ιδιότητα γινομένου δυνάμεων
    qList.push({
      id: 6,
      title: 'Γινόμενο Δυνάμεων με Ίδια Βάση',
      prompt: 'Ποιος είναι ο σωστός τύπος για το γινόμενο δυνάμεων με την ίδια βάση αᵐ · αⁿ;',
      type: 'mcq',
      correct: 'αᵐ⁺ⁿ',
      options: ensureFourUniqueOptions('αᵐ⁺ⁿ', () => [
        'αᵐ˙ⁿ',
        'αᵐ⁻ⁿ',
        '(2α)ᵐ⁺ⁿ'
      ][randInt(0, 2)]),
      explanation: 'Στο γινόμενο δυνάμεων με την ίδια βάση διατηρούμε τη βάση και προσθέτουμε τους εκθέτες: αᵐ · αⁿ ＝ αᵐ⁺ⁿ.'
    });

    // Q7: Input - Υπολογισμός 2⁻¹
    qList.push({
      id: 7,
      title: 'Υπολογισμός Δύναμης 2⁻¹',
      prompt: 'Ποια είναι η δεκαδική τιμή της δύναμης 2⁻¹;',
      type: 'input',
      correct: 0.5,
      explanation: '2⁻¹ ＝ 1/2 ＝ 0,5.'
    });

    // Q8: MCQ - Τυποποιημένη μορφή
    qList.push({
      id: 8,
      title: 'Κριτήριο Τυποποιημένης Μορφής',
      prompt: 'Στην τυποποιημένη μορφή ενός αριθμού α · 10ᵏ, ποιοι περιορισμοί ισχύουν για το α και το k;',
      type: 'mcq',
      correct: '1 ≤ |α| ＜ 10 και k ακέραιος (k ∈ ℤ)',
      options: ensureFourUniqueOptions('1 ≤ |α| ＜ 10 και k ακέραιος (k ∈ ℤ)', () => [
        '0 ≤ α ＜ 100 και k φυσικός',
        'α οποιοσδήποτε αριθμός και k ＞ 0',
        '1 ＜ α ≤ 10 και k μόνο θετικός'
      ][randInt(0, 2)]),
      explanation: 'Στην επιστημονική/τυποποιημένη μορφή ο συντελεστής α έχει ένα μόνο μη μηδενικό ακέραιο ψηφίο (1 ≤ |α| ＜ 10) και ο εκθέτης k είναι ακέραιος.'
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
      title="Ασκήσεις: Δυνάμεις Πραγματικών Αριθμών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στις δυνάμεις πραγματικών αριθμών, ιδιότητες, αρνητικούς εκθέτες και τυποποιημένη μορφή με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/05-dinameis-pragmatikon"
      backText="Θεωρία Κεφ. 5"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/05-dinameis-pragmatikon"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase("ΘΕΩΡΙΑ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase("ΑΣΚΗΣΕΙΣ •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight">
                Δυνάμεις Πραγματικών Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα ιδιοτήτων, αρνητικών εκθετών και τυποποιημένης μορφής.
              </p>
            </div>
            <div>
              <button
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase("ΝΕΕΣ ΑΣΚΗΣΕΙΣ")}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              Αποτέλεσμα: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις δυνάμεις, τις ιδιότητες και την τυποποιημένη μορφή.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους αρνητικούς εκθέτες και τους κανόνες προσήμων!'}
            </p>
            <button
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase("ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ")}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
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
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ Σωστό' : '✗ Λάθος'}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] ${
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
                            <span className="break-words whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9.,-]/g, '');
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder="Απάντηση..."
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION - SAFE SCROLL TABLES */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto -mx-1 sm:mx-0 rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">Στοιχείο / Βήμα</th>
                              <th className="p-2 border-b">Ανάλυση Δεδομένων</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>Σωστή Απάντηση:</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1">{q.explanation}</div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM FOOTER - MOBILE OPTIMIZED */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-4 py-2.5 sm:py-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-700 truncate">
                  {toCleanUppercase("ΑΠΑΝΤΗΘΗΚΑΝ")}: <span className="text-indigo-600 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-700">{toCleanUppercase("ΣΚΟΡ")}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-400">|</span>
                  <span className="text-indigo-700">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase("ΕΛΕΓΧΟΣ")}
                </button>
              ) : (
                <button
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
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
