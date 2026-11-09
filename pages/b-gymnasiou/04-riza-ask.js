import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων ελληνικών με διατήρηση μόνο του Β'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow & υποστήριξη JSX)
const Frac = ({ num, den, className = "" }) => {
  const isStringOrNumber = (val) => typeof val === 'string' || typeof val === 'number';

  const isNumNeg = isStringOrNumber(num) && String(num).trim().startsWith('-');
  const isDenNeg = isStringOrNumber(den) && String(den).trim().startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const renderContent = (val) => {
    if (isStringOrNumber(val)) {
      return String(val).trim().replace(/^-/, '');
    }
    return val;
  };

  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}>
      {isNegative && <span className="mr-0.5 text-sm sm:text-base font-bold select-none">－</span>}
      <span className="inline-flex flex-col text-center leading-none text-[0.85em] sm:text-[0.9em]">
        <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{renderContent(num)}</span>
        <span className="pt-0.5 px-0.5 sm:px-1 break-all">{renderContent(den)}</span>
      </span>
    </span>
  );
};

// Component Power: εμφανίζει τη δύναμη με tag <sup> και σύμβολο μείον Unicode
const Power = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const absExp = !isNaN(expNum) ? Math.abs(expNum) : String(exp).replace('-', '');
  const formattedExp = isNeg ? `(－${absExp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono shrink-0 ${className}`}>
      <span>{base}</span>
      <sup className="text-slate-900 font-bold ml-0.5 text-xs sm:text-sm">{formattedExp}</sup>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 relative font-mono font-semibold shrink-0 ${className}`}>
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
      <span className="pl-3.5 sm:pl-4 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Ανακάτεμα πίνακα Fisher-Yates
const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Εξασφάλιση 4 αυστηρά μοναδικών επιλογών στα MCQs
const makeUniqueOptions = (correctVal, rawDistractors) => {
  const unique = new Set();
  unique.add(String(correctVal).trim());

  for (const dist of rawDistractors) {
    if (dist !== undefined && dist !== null && String(dist).trim() !== '') {
      unique.add(String(dist).trim());
    }
    if (unique.size === 4) break;
  }

  let counter = 1;
  const numBase = parseInt(correctVal, 10);
  while (unique.size < 4) {
    if (!isNaN(numBase)) {
      unique.add(String(numBase + counter));
    } else {
      unique.add(`${correctVal} ＋ ${counter}`);
    }
    counter++;
  }

  return shuffleArray(Array.from(unique));
};

// Εμφάνιση κλασμάτων στα κουμπιά επιλογών αν η συμβολοσειρά περιέχει "/"
const renderOptionContent = (opt) => {
  if (typeof opt === 'string' && opt.includes('/') && !opt.includes(' ')) {
    const parts = opt.split('/');
    if (parts.length === 2) {
      return <Frac num={parts[0]} den={parts[1]} />;
    }
  }
  return opt;
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Υπολογισμός απλής ρίζας τέλειου τετραγώνου
  (locale) => {
    const roots = [6, 7, 8, 9, 11, 12, 13, 14, 15];
    const r = roots[Math.floor(Math.random() * roots.length)];
    const sq = r * r;
    const correct = `${r}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ' : 'PERFECT SQUARE',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τετραγωνική ρίζα:' : 'Calculate the square root:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center"><Sqrt>{sq}</Sqrt></strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${r - 1}`, `${r + 1}`, `${r + 2}`, `${Math.floor(sq / 2)}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? `Αναζητούμε ποιος θετικός αριθμός υψωμένος στο τετράγωνο δίνει ${sq}:` : `We look for which positive number squared gives ${sq}:`}</span>
          <span className="font-mono">{r}<sup>2</sup> ＝ {sq} ➔ <Sqrt>{sq}</Sqrt> ＝ {r}.</span>
        </span>
      )
    };
  },
  // 2. Ρίζα μηδενός και μονάδας
  (locale) => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή της παράστασης' : 'What is the value of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Sqrt>1</Sqrt> ＋ <Sqrt>0</Sqrt>
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', '2', '10', locale === 'el' ? 'Δεν ορίζεται' : 'Undefined']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt>1</Sqrt> ＝ 1, <Sqrt>0</Sqrt> ＝ 0.</span>
          <span>1 ＋ 0 ＝ 1.</span>
        </span>
      )
    };
  },
  // 3. Ιδιότητα (√α)² = α
  (locale) => {
    const a = [5, 7, 11, 13, 17, 19][Math.floor(Math.random() * 6)];
    const correct = `${a}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η τιμή της παράστασης' : 'The value of expression'}</span>
          <strong className="inline-flex items-center font-mono">
            (<Sqrt>{a}</Sqrt>)<sup>2</sup>
          </strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a * a}`, `${2 * a}`, '1', `${a + 2}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Για κάθε θετικό αριθμό α ισχύει εξ ορισμού:' : 'For every positive number a, by definition:'}</span>
          <span className="font-mono">(<Sqrt>{locale === 'el' ? 'α' : 'a'}</Sqrt>)<sup>2</sup> ＝ {locale === 'el' ? 'α' : 'a'}.</span>
          <span>{locale === 'el' ? 'Άρα:' : 'Therefore:'}</span>
          <span className="font-mono">(<Sqrt>{a}</Sqrt>)<sup>2</sup> ＝ {a}.</span>
        </span>
      )
    };
  },
  // 4. Ιδιότητα √(α²) = α
  (locale) => {
    const a = [9, 12, 14, 16, 18][Math.floor(Math.random() * 5)];
    const correct = `${a}`;
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>{a}²</Sqrt>
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? `Επειδή ο αριθμός ${a} είναι θετικός, ισχύει:` : `Since ${a} is positive, it holds:`}</span>
          <span className="font-mono"><Sqrt>{locale === 'el' ? 'α' : 'a'}<sup>2</sup></Sqrt> ＝ {locale === 'el' ? 'α' : 'a'}.</span>
          <span className="font-mono"><Sqrt>{a}<sup>2</sup></Sqrt> ＝ {a}.</span>
        </span>
      )
    };
  },
  // 5. Ρίζα κλάσματος
  (locale) => {
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
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε τη ρίζα του κλάσματος:' : 'Evaluate the fraction root:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center mx-1">
            <Sqrt><Frac num={p.n} den={p.d} /></Sqrt>
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${p.rn}/${p.d}`,
        `${p.n}/${p.rd}`,
        `${p.rn + 1}/${p.rd}`,
        `${p.rn}/${p.rd + 1}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt><Frac num={p.n} den={p.d} /></Sqrt> ＝ </span>
          <Frac num={<Sqrt>{p.n}</Sqrt>} den={<Sqrt>{p.d}</Sqrt>} />
          <span> ＝ </span>
          <Frac num={p.rn} den={p.rd} />.
        </span>
      )
    };
  },
  // 6. Άθροισμα ριζών (προσοχή στην παγίδα √(α+β) ≠ √α + √β)
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΑΓΙΔΕΣ' : 'PITFALLS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή της παράστασης' : 'What is the value of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>9 ＋ 16</Sqrt>
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7', '25', '12', '1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Εκτελούμε πρώτα την πράξη μέσα στη ρίζα:' : 'Perform operations under the radical first:'}</span>
          <span className="font-mono">9 ＋ 16 ＝ 25.</span>
          <span>{locale === 'el' ? 'Έπειτα:' : 'Then:'}</span>
          <span className="font-mono"><Sqrt>25</Sqrt> ＝ 5</span>
          <span>{locale === 'el' ? '(όχι √9 ＋ √16 ＝ 3 ＋ 4 ＝ 7).' : '(not √9 ＋ √16 ＝ 3 ＋ 4 ＝ 7).'}</span>
        </span>
      )
    };
  },
  // 7. Σύνθετη παράσταση με πολλαπλασιασμό και ρίζες
  (locale) => {
    const correct = '2';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            2 · <Sqrt>49</Sqrt> － 3 · <Sqrt>16</Sqrt>
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt>49</Sqrt> ＝ 7, <Sqrt>16</Sqrt> ＝ 4.</span>
          <span>2 · 7 ＝ 14, 3 · 4 ＝ 12.</span>
          <span>14 － 12 ＝ 2.</span>
        </span>
      )
    };
  },
  // 8. Ρίζα αρνητικού αριθμού (εννοιολογική)
  (locale) => {
    const correct = locale === 'el' ? 'Δεν ορίζεται στους πραγματικούς αριθμούς' : 'Undefined in real numbers';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή της παράστασης' : 'What is the value of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>－25</Sqrt>
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-5', '+5', '±5', '0']),
      hint: locale === 'el'
        ? 'Η τετραγωνική ρίζα αρνητικού αριθμού δεν ορίζεται στους πραγματικούς αριθμούς, διότι κανενός πραγματικού αριθμού το τετράγωνο δεν είναι αρνητικό.'
        : 'The square root of a negative number is undefined in real numbers because no real number squared yields a negative value.'
    };
  },
  // 9. Εγκλωβισμός άρρητης ρίζας
  (locale) => {
    const correct = locale === 'el' ? '4 και 5' : '4 and 5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΕΓΚΛΩΒΙΣΜΟΣ' : 'BOUNDING',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ανάμεσα σε ποιους δύο διαδοχικούς φυσικούς βρίσκεται το' : 'Between which two consecutive integers is'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center"><Sqrt>20</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? '3 και 4' : '3 and 4',
        locale === 'el' ? '5 και 6' : '5 and 6',
        locale === 'el' ? '2 και 3' : '2 and 3',
        locale === 'el' ? '4 και 6' : '4 and 6'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>4<sup>2</sup> ＝ 16, 5<sup>2</sup> ＝ 25.</span>
          <span>16 ＜ 20 ＜ 25 ➔ 4 ＜ <Sqrt>20</Sqrt> ＜ 5.</span>
        </span>
      )
    };
  },
  // 10. Πράξεις κάτω από το ριζικό: γινόμενο
  (locale) => {
    const correct = '8';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>2 · 32</Sqrt>
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 · 32 ＝ 64.</span>
          <span><Sqrt>64</Sqrt> ＝ 8.</span>
        </span>
      )
    };
  },
  // 11. Πράξεις κάτω από το ριζικό: διαφορά τετραγώνων
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η τιμή της παράστασης' : 'The value of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>13² － 12²</Sqrt>
          </strong>
          <span>{locale === 'el' ? 'ισούται με:' : 'equals:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '25', '7', '13']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>13<sup>2</sup> ＝ 169, 12<sup>2</sup> ＝ 144.</span>
          <span>169 － 144 ＝ 25.</span>
          <span><Sqrt>25</Sqrt> ＝ 5.</span>
        </span>
      )
    };
  },
  // 12. Διπλή τετραγωνική ρίζα (ρίζα ρίζας)
  (locale) => {
    const correct = '4';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΣΥΝΘΕΤΗ' : 'COMPLEX',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt><Sqrt>81</Sqrt> ＋ 7</Sqrt>
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt>81</Sqrt> ＝ 9.</span>
          <span>9 ＋ 7 ＝ 16.</span>
          <span><Sqrt>16</Sqrt> ＝ 4.</span>
        </span>
      )
    };
  },
  // 13. Πρόσημο του αποτελέσματος της ρίζας
  (locale) => {
    const correct = '+6';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποιο είναι το αποτέλεσμα της έκφρασης' : 'What is the result of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>36</Sqrt>
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-6', '±6', '18', '72']),
      hint: locale === 'el'
        ? 'Εξ ορισμού, η τετραγωνική ρίζα ενός θετικού αριθμού είναι πάντοτε μη αρνητικός αριθμός. Άρα √36 ＝ ＋6 (ποτέ -6).'
        : 'By definition, the square root of a positive number is strictly non-negative. Hence √36 ＝ ＋6 (never -6).'
    };
  },
  // 14. Ρίζα δεκαδικού αριθμού
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `0${decSep}6`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΙ' : 'DECIMALS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή του' : 'What is the value of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center">
            <Sqrt>0{decSep}36</Sqrt>
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `0${decSep}06`,
        '6',
        `0${decSep}18`,
        `1${decSep}2`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0{decSep}36 ＝ <Frac num="36" den="100" />.</span>
          <span><Sqrt><Frac num="36" den="100" /></Sqrt> ＝ <Frac num="6" den="10" /> ＝ 0{decSep}6.</span>
        </span>
      )
    };
  },
  // 15. Διαίρεση ριζών
  (locale) => {
    const correct = '6';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το πηλίκο:' : 'Calculate the quotient:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Sqrt>72</Sqrt> : <Sqrt>2</Sqrt>
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt>72</Sqrt> : <Sqrt>2</Sqrt> ＝ <Sqrt>72 : 2</Sqrt> ＝ <Sqrt>36</Sqrt> ＝ 6.</span>
        </span>
      )
    };
  },
  // 16. Τέλειο τετράγωνο μεγάλου αριθμού
  (locale) => {
    const correct = '400';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ' : 'PERFECT SQUARE',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος από τους παρακάτω αριθμούς είναι τέλειο τετράγωνο;</>
          ) : (
            <>Which of the following numbers is a perfect square?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['200', '300', '500', '150']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">20<sup>2</sup> ＝ 400.</span>
          <span>{locale === 'el' ? 'Άρα το 400 είναι τέλειο τετράγωνο.' : 'Thus 400 is a perfect square.'}</span>
        </span>
      )
    };
  },
  // 17. Εξίσωση μορφής x² = α
  (locale) => {
    const correct = locale === 'el' ? '7 ή -7' : '7 or -7';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΕΞΙΣΩΣΗ' : 'EQUATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποιες είναι οι λύσεις της εξίσωσης' : 'What are the solutions to'}</span>
          <strong className="font-mono text-indigo-700">x² ＝ 49</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Μόνο το 7' : 'Only 7',
        locale === 'el' ? 'Μόνο το -7' : 'Only -7',
        locale === 'el' ? 'Το 0 και το 7' : '0 and 7',
        locale === 'el' ? 'Δεν έχει λύση' : 'No solution'
      ]),
      hint: locale === 'el'
        ? 'Η εξίσωση x² ＝ α (με α ＞ 0) έχει δύο αντίθετες λύσεις: x ＝ 7 ή x ＝ -7.'
        : 'The equation x² ＝ a (with a ＞ 0) has two opposite solutions: x ＝ 7 or x ＝ -7.'
    };
  },
  // 18. Σύνθετος υπολογισμός με αρνητικό εκθέτη και ρίζα
  (locale) => {
    const correct = '1';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΣΥΝΔΥΑΣΤΙΚΗ' : 'COMBINED',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Sqrt>64</Sqrt> · <Power base={2} exp={-3} />
          </strong>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Sqrt>64</Sqrt> ＝ 8, 2<sup>(－3)</sup> ＝ <Frac num="1" den="8" />.</span>
          <span>8 · <Frac num="1" den="8" /> ＝ 1.</span>
        </span>
      )
    };
  },
  // 19. Εγκλωβισμός ρίζας √80
  (locale) => {
    const correct = locale === 'el' ? '8 και 9' : '8 and 9';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΕΓΚΛΩΒΙΣΜΟΣ' : 'BOUNDING',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ανάμεσα σε ποιους δύο ακέραιους βρίσκεται το' : 'Between which two integers is'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center"><Sqrt>80</Sqrt></strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? '7 και 8' : '7 and 8',
        locale === 'el' ? '9 και 10' : '9 and 10',
        locale === 'el' ? '8 και 10' : '8 and 10',
        locale === 'el' ? '40 και 41' : '40 and 41'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>8<sup>2</sup> ＝ 64, 9<sup>2</sup> ＝ 81.</span>
          <span>64 ＜ 80 ＜ 81 ➔ 8 ＜ <Sqrt>80</Sqrt> ＜ 9.</span>
        </span>
      )
    };
  },
  // 20. Απλοποίηση παράστασης με ρίζες
  (locale) => {
    const correct = '8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Evaluate:'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            5 · <Sqrt>4</Sqrt> － <Sqrt>9</Sqrt> ＋ <Sqrt>1</Sqrt>
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6', '10', '12', '4']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>5 · 2 － 3 ＋ 1 ＝ 10 － 3 ＋ 1 ＝ 8.</span>
        </span>
      )
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Εύρεση πλευράς τετραγώνου από εμβαδόν
  (locale) => {
    const areas = [36, 49, 64, 81, 100, 144];
    const a = areas[Math.floor(Math.random() * areas.length)];
    const side = Math.sqrt(a);
    const correct = `${side}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο οικόπεδο έχει εμβαδόν <strong className="font-mono text-amber-800">{a} m²</strong>. Πόσα μέτρα είναι το μήκος της πλευράς του;</>
          ) : (
            <>A square plot has an area of <strong className="font-mono text-amber-800">{a} m²</strong>. What is the length of its side in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${side - 2}`,
        `${Math.floor(a / 2)}`,
        `${side * 2}`,
        `${side + 4}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>{a}</Sqrt> ＝ {side} m.</span>
        </span>
      )
    };
  },
  // 2. Περίμετρος τετραγώνου από εμβαδόν
  (locale) => {
    const correct = '20';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο χαρτόνι έχει εμβαδόν 25 cm². Πόσα εκατοστά είναι η <strong>περίμετρός</strong> του;</>
          ) : (
            <>A square cardboard has an area of 25 cm². What is its <strong>perimeter</strong> in cm?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '10', '15', '50']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>25</Sqrt> ＝ 5 cm.</span>
          <span>{locale === 'el' ? 'Π' : 'P'} ＝ 4 · 5 ＝ 20 cm.</span>
        </span>
      )
    };
  },
  // 3. Περίφραξη τετραγωνικού κήπου (Input)
  (locale) => {
    const correct = '40';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνος κήπος έχει εμβαδόν 100 m². Πόσα μέτρα σύρμα χρειάζονται για να περιφραχτεί ολόκληρος με 1 σειρά σύρματος;</>
          ) : (
            <>A square garden has an area of 100 m². How many meters of wire are needed to fence it with 1 row of wire?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>100</Sqrt> ＝ 10 m.</span>
          <span>{locale === 'el' ? 'Π' : 'P'} ＝ 4 · 10 ＝ 40 m.</span>
        </span>
      )
    };
  },
  // 4. Πλακόστρωση δαπέδου
  (locale) => {
    const correct = '6';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο δωμάτιο καλύφθηκε με 36 τετράγωνα πλακάκια του 1 m² το καθένα. Πόσα μέτρα είναι ο τοίχος του δωματίου;</>
          ) : (
            <>A square room is covered by 36 square tiles of 1 m² each. What is the wall length in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9', '18', '12', '4']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'Ε' : 'A'} ＝ 36 m².</span>
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>36</Sqrt> ＝ 6 m.</span>
        </span>
      )
    };
  },
  // 5. Φωτοβολταϊκό πάνελ
  (locale) => {
    const correct = '12';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο ηλιακό πάνελ έχει εμβαδόν 144 dm². Πόσα dm είναι η πλευρά του;</>
          ) : (
            <>A square solar panel has an area of 144 dm². How many dm is its side?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>144</Sqrt> ＝ 12 dm.</span>
        </span>
      )
    };
  },
  // 6. Πυθαγόρεια τριάδα σε τετράγωνα εμβαδά
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Δύο τετράγωνα με εμβαδά 9 cm² και 16 cm² ενώνονται σε ένα νέο τετράγωνο. Ποια είναι η πλευρά του νέου τετραγώνου;</>
          ) : (
            <>Two squares with areas 9 cm² and 16 cm² merge into a new square. What is the side length of the new square?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7', '25', '12', '10']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>9 ＋ 16 ＝ 25 cm².</span>
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>25</Sqrt> ＝ 5 cm.</span>
        </span>
      )
    };
  },
  // 7. Πλακάκια σε τετράγωνη διάταξη
  (locale) => {
    const correct = '8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τεχνίτης τοποθετεί 64 τετράγωνα πλακάκια σε τετράγωνη διάταξη (ίσες γραμμές και στήλες). Πόσα πλακάκια έχει κάθε σειρά;</>
          ) : (
            <>A builder places 64 square tiles in a square grid (equal rows and columns). How many tiles per row?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '32', '6', '12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>64</Sqrt> ＝ 8</span>
          <span>{locale === 'el' ? 'πλακάκια.' : 'tiles.'}</span>
        </span>
      )
    };
  },
  // 8. Κόστος περίφραξης τετραγώνου
  (locale) => {
    const correct = '360';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο οικόπεδο εμβαδού 81 m² περιφράσσεται με κόστος 10€ ανά μέτρο. Πόσα ευρώ θα κοστίσει η περίφραξη;</>
          ) : (
            <>A square plot of 81 m² is fenced at 10€ per meter. How many euros will the fence cost?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>81</Sqrt> ＝ 9 m.</span>
          <span>{locale === 'el' ? 'Π' : 'P'} ＝ 4 · 9 ＝ 36 m.</span>
          <span>36 · 10 ＝ 360€.</span>
        </span>
      )
    };
  },
  // 9. Αποθήκη τετράγωνης βάσης
  (locale) => {
    const correct = '15';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αποθήκη έχει τετράγωνο δάπεδο εμβαδού 225 m². Ποιο είναι το μήκος κάθε πλευράς του δαπέδου;</>
          ) : (
            <>A warehouse has a square floor of area 225 m². What is the length of each side in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '12', '18', '20']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>225</Sqrt> ＝ 15 m (15<sup>2</sup> ＝ 225).</span>
        </span>
      )
    };
  },
  // 10. Τετράγωνη πισίνα και διάδρομος
  (locale) => {
    const correct = '7';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το νερό μιας τετράγωνης πισίνας καλύπτει επιφάνεια 49 m². Πόσα μέτρα είναι το μήκος της πισίνας;</>
          ) : (
            <>Water in a square pool covers 49 m². What is the length of the pool in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '9', locale === 'el' ? '24,5' : '24.5', '6']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>49</Sqrt> ＝ 7 m.</span>
        </span>
      )
    };
  },
  // 11. Διπλασιασμός εμβαδού και προσέγγιση
  (locale) => {
    const correct = locale === 'el' ? '8 και 9' : '8 and 9';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο έχει εμβαδόν 35 m². Αν διπλασιαστεί σε 70 m², ανάμεσα σε ποιους ακέραιους κυμαίνεται η νέα πλευρά;</>
          ) : (
            <>A square has area 35 m². If doubled to 70 m², between which integers does the new side lie?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? '7 και 8' : '7 and 8',
        locale === 'el' ? '9 και 10' : '9 and 10',
        locale === 'el' ? '6 και 7' : '6 and 7',
        locale === 'el' ? '34 και 36' : '34 and 36'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>70</Sqrt>.</span>
          <span>8<sup>2</sup> ＝ 64, 9<sup>2</sup> ＝ 81 ➔ 8 ＜ <Sqrt>70</Sqrt> ＜ 9.</span>
        </span>
      )
    };
  },
  // 12. Σκακιέρα
  (locale) => {
    const correct = '8';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Κλασική σκακιέρα αποτελείται από 64 τετράγωνα. Πόσα τετράγωνα υπάρχουν κατά μήκος κάθε πλευράς της;</>
          ) : (
            <>A classic chessboard consists of 64 squares. How many squares are along each side?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono"><Sqrt>64</Sqrt> ＝ 8</span>
          <span>{locale === 'el' ? 'τετράγωνα.' : 'squares.'}</span>
        </span>
      )
    };
  },
  // 13. Χαρτί origami
  (locale) => {
    const correct = '11';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο φύλλο χαρτιού origami έχει εμβαδόν 121 cm². Πόσα εκατοστά είναι η πλευρά του;</>
          ) : (
            <>A square origami sheet has an area of 121 cm². How many cm is its side?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['12', '10', '19', '14']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>121</Sqrt> ＝ 11 cm (11<sup>2</sup> ＝ 121).</span>
        </span>
      )
    };
  },
  // 14. Αθλητικός στίβος: τετράγωνο ταπί
  (locale) => {
    const correct = '14';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ταπί αγώνων πάλης είναι τετράγωνο με εμβαδόν 196 m². Πόσα μέτρα είναι η πλευρά του;</>
          ) : (
            <>A wrestling mat is a square with an area of 196 m². What is its side length in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '12', '13', '18']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>196</Sqrt> ＝ 14 m (14<sup>2</sup> ＝ 196).</span>
        </span>
      )
    };
  },
  // 15. Κάλυμμα τετράγωνου τραπεζιού (Input)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `1${decSep}2`;
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο τραπεζομάντηλο έχει εμβαδόν 1,44 m². Πόσα μέτρα είναι η πλευρά του;</>
          ) : (
            <>A square tablecloth has an area of 1.44 m². What is its side length in meters?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1{decSep}44 ＝ <Frac num="144" den="100" />.</span>
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt><Frac num="144" den="100" /></Sqrt> ＝ <Frac num="12" den="10" /> ＝ 1{decSep}2 m.</span>
        </span>
      )
    };
  },
  // 16. Τετράγωνη θεατρική σκηνή
  (locale) => {
    const correct = '20';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Υπαίθρια τετράγωνη σκηνή έχει εμβαδόν 400 m². Πόσα μέτρα είναι η πρόσοψή της;</>
          ) : (
            <>An outdoor square stage has an area of 400 m². What is its front width in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['40', '25', '30', '15']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>400</Sqrt> ＝ 20 m (20<sup>2</sup> ＝ 400).</span>
        </span>
      )
    };
  },
  // 17. Κορνίζα φωτογραφίας
  (locale) => {
    const correct = '36';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνη φωτογραφία έχει εμβαδόν 81 cm². Πόσα cm ξύλινης κορνίζας χρειάζονται περιμετρικά;</>
          ) : (
            <>A square photo has an area of 81 cm². How many cm of frame are needed around it?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['18', '27', '81', '72']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>81</Sqrt> ＝ 9 cm.</span>
          <span>{locale === 'el' ? 'Π' : 'P'} ＝ 4 · 9 ＝ 36 cm.</span>
        </span>
      )
    };
  },
  // 18. Συναρμολόγηση παζλ
  (locale) => {
    const correct = '10';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Παζλ 100 τετράγωνων κομματιών σχηματίζει μεγάλο τετράγωνο. Πόσα κομμάτια είναι σε κάθε εξωτερική πλευρά;</>
          ) : (
            <>A 100-piece square puzzle forms a large square. How many pieces along each outer edge?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>100</Sqrt> ＝ 10</span>
          <span>{locale === 'el' ? 'κομμάτια.' : 'pieces.'}</span>
        </span>
      )
    };
  },
  // 19. Γεωργικό θερμοκήπιο
  (locale) => {
    const correct = '16';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο θερμοκήπιο καταλαμβάνει 256 m². Πόσα μέτρα είναι το πλάτος του;</>
          ) : (
            <>A square greenhouse occupies 256 m². What is its width in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '18', '26', '12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>256</Sqrt> ＝ 16 m (16<sup>2</sup> ＝ 256).</span>
        </span>
      )
    };
  },
  // 20. Διαχωρισμός πλατείας
  (locale) => {
    const correct = '30';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνη πλατεία έχει εμβαδόν 900 m². Πόσα μέτρα περπατάει κάποιος που διανύει μία ολόκληρη πλευρά της;</>
          ) : (
            <>A square plaza has an area of 900 m². How many meters does someone walk crossing one side?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['45', '60', '300', '90']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>900</Sqrt> ＝ 30 m (30<sup>2</sup> ＝ 900).</span>
        </span>
      )
    };
  }
];

export default function RizaAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Τετραγωνικοί Αριθμοί & Τετραγωνική Ρίζα | Β' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις υπολογισμού ριζών, τελείων τετραγώνων, ιδιοτήτων και γεωμετρικών προβλημάτων.",
      backText: "ΘΕΩΡΙΑ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 4",
      badgeCount: "12 ΑΣΚΗΣΕΙΣ",
      headerTitle: "ΕΞΑΣΚΗΣΗ: ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ & ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ",
      headerDesc: "Εξασκήσου στην εύρεση τετραγωνικών ριζών, στα τέλεια τετράγωνα, στις ιδιότητες των ριζών και σε γεωμετρικά προβλήματα εμβαδού και περιμέτρου.",
      writeAnswerLabel: "ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:",
      inputPlaceholder: "π.χ. 7 ή 1,2 ή 3/4",
      correctLabel: "ΣΩΣΤΟ!",
      wrongLabel: "ΛΑΘΟΣ",
      correctAnswerWas: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
      hintTitle: "Επεξήγηση:",
      scoreLabel: "ΣΚΟΡ:",
      accuracyLabel: "ΕΠΙΤΥΧΙΑ:",
      submitBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      newQuizBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ"
    },
    en: {
      pageTitle: "Exercises: Square Numbers & Square Root | Grade 8",
      pageDesc: "12 dynamic exercises on square roots, perfect squares, properties, and geometric area/perimeter problems.",
      backText: "THEORY",
      badgeUnit: "GRADE 8 • UNIT 4",
      badgeCount: "12 EXERCISES",
      headerTitle: "PRACTICE: SQUARE NUMBERS & SQUARE ROOTS",
      headerDesc: "Practice evaluating square roots, working with perfect squares, root properties, and geometric area/perimeter problems.",
      writeAnswerLabel: "ENTER YOUR ANSWER:",
      inputPlaceholder: "e.g. 7 or 1.2 or 3/4",
      correctLabel: "CORRECT!",
      wrongLabel: "INCORRECT",
      correctAnswerWas: "CORRECT ANSWER:",
      hintTitle: "Explanation:",
      scoreLabel: "SCORE:",
      accuracyLabel: "ACCURACY:",
      submitBtn: "CHECK ANSWERS",
      newQuizBtn: "NEW EXERCISES"
    }
  };

  const cur = t[locale] || t.el;

  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = useCallback(() => {
    const shuffledTheory = shuffleArray(POOL_THEORY).slice(0, 10);
    const shuffledProblems = shuffleArray(POOL_PROBLEMS).slice(0, 2);

    const full12 = [...shuffledTheory, ...shuffledProblems].map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale)
    }));

    setExercises(full12);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const handleAnswerChange = (id, val) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleInputChange = (id, rawVal) => {
    if (isSubmitted) return;
    const sanitized = rawVal
      .replace(/[^0-9,\./\-\s]/g, '')
      .replace(/\./g, locale === 'el' ? ',' : '.');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  // Ασφαλής έλεγχος απάντησης με ανοχή δεκαδικών
  const checkAnswerMatch = (userVal, correctVal) => {
    const cleanUser = String(userVal || '').trim().replace(/\s+/g, '');
    const cleanCorrect = String(correctVal || '').trim().replace(/\s+/g, '');

    if (!cleanUser) return false;
    if (cleanUser.toLowerCase() === cleanCorrect.toLowerCase()) return true;

    const parseNum = (val) => {
      const v = val.replace(',', '.');
      if (v.includes('/')) {
        const parts = v.split('/');
        const n = parseFloat(parts[0]);
        const d = parseFloat(parts[1]);
        return d !== 0 ? n / d : NaN;
      }
      return parseFloat(v);
    };

    const userNum = parseNum(cleanUser);
    const correctNum = parseNum(cleanCorrect);

    if (!isNaN(userNum) && !isNaN(correctNum)) {
      return Math.abs(userNum - correctNum) <= 0.05;
    }

    return false;
  };

  const handleSubmit = () => {
    let currentScore = 0;
    exercises.forEach(ex => {
      if (checkAnswerMatch(userAnswers[ex.id], ex.correct)) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const percentage = exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0;

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou/04-riza"
      backText={cur.backText}
      showAds={true}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-40 overflow-x-hidden space-y-8 sm:space-y-12 box-border">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase break-words">
                {toCleanUppercase(cur.badgeUnit)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase break-words">
                {toCleanUppercase(cur.badgeCount)}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.headerTitle)}
            </h1>
            <p className="text-xs sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {cur.headerDesc}
            </p>
          </div>
        </section>

        {/* Grid 12 Ασκήσεων */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {exercises.map((ex) => {
            const userVal = userAnswers[ex.id] || '';
            const isCorrect = isSubmitted && checkAnswerMatch(userVal, ex.correct);

            return (
              <div
                key={ex.id}
                className={`bg-white rounded-3xl p-4 sm:p-7 shadow-sm border transition-all flex flex-col justify-between space-y-4 min-w-0 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 ring-2 ring-rose-500/20'
                    : 'border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm shrink-0">
                      {ex.id}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 break-words ${
                        ex.badge === 'ΠΡΟΒΛΗΜΑ' || ex.badge === 'PROBLEM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {toCleanUppercase(ex.badge)}
                    </span>
                  </div>

                  <div className="text-slate-800 text-sm sm:text-base leading-relaxed break-words [overflow-wrap:anywhere] min-w-0">
                    {ex.question}
                  </div>
                </div>

                <div className="pt-2 min-w-0">
                  {ex.type === 'mcq' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 min-w-0">
                      {ex.options.map((opt, optIdx) => {
                        const isSelected = userVal === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleAnswerChange(ex.id, opt)}
                            className={`p-3 rounded-2xl border text-xs sm:text-sm font-mono font-bold transition-all text-center touch-manipulation break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {renderOptionContent(opt)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1 min-w-0">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block break-words">
                        {toCleanUppercase(cur.writeAnswerLabel)}
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userVal}
                        maxLength={10}
                        onChange={(e) => handleInputChange(ex.id, e.target.value)}
                        placeholder={cur.inputPlaceholder}
                        className="w-full h-11 px-4 rounded-xl border border-slate-300 font-mono text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all box-border"
                      />
                    </div>
                  )}

                  {/* Feedback μετά την υποβολή */}
                  {isSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs sm:text-sm min-w-0">
                      {isCorrect ? (
                        <div className="text-emerald-700 font-bold flex items-center gap-1.5 break-words">
                          <span>✓</span>
                          <span>{toCleanUppercase(cur.correctLabel)}</span>
                        </div>
                      ) : (
                        <div className="space-y-1 break-words">
                          <div className="text-rose-600 font-bold flex items-center gap-1.5">
                            <span>✗</span>
                            <span>{toCleanUppercase(cur.wrongLabel)}</span>
                          </div>
                          <div className="text-slate-700 flex flex-wrap items-center gap-1">
                            <span>{toCleanUppercase(cur.correctAnswerWas)}</span>
                            <strong className="font-mono text-indigo-700 inline-flex items-center">
                              {renderOptionContent(ex.correct)}
                            </strong>
                          </div>
                        </div>
                      )}
                      {ex.hint && (
                        <div className="text-slate-600 text-xs mt-1 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200/70 break-words [overflow-wrap:anywhere]">
                          💡 <strong>{cur.hintTitle}</strong> {ex.hint}
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                {toCleanUppercase(cur.scoreLabel)}
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                {isSubmitted ? score : Object.keys(userAnswers).length} / 12
              </span>
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  {toCleanUppercase(cur.accuracyLabel)}
                </span>
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation text-center"
              >
                {toCleanUppercase(cur.submitBtn)}
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation flex items-center justify-center gap-2 text-center"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(cur.newQuizBtn)}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}