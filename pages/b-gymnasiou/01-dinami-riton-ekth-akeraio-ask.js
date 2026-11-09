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

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και ασφαλή υποστήριξη JSX/strings (No-Overflow)
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

// Ανακάτεμα πίνακα Fisher-Yates
const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
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
  while (unique.size < 4) {
    unique.add(`${correctVal} ＋ ${counter}`);
    counter++;
  }

  return shuffleArray(Array.from(unique));
};

// Βοηθητικές συναρτήσεις τυχαίων ακεραίων
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
  (locale) => {
    const a = randInt(2, 6);
    const n = randInt(2, 4);
    const den = Math.pow(a, n);
    const correct = `1/${den}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τιμή της δύναμης ' : 'What is the value of the power '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base={a} exp={-n} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${den}`, `${den}`, `1/${a * n}`, `-${a * n}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Ισχύει:' : 'Rule:'}</span>
          <span>α<sup>(－ν)</sup> ＝ <Frac num="1" den={<>α<sup>ν</sup></>} /></span>.
          <span className="font-sans">{locale === 'el' ? 'Υπολογίζουμε:' : 'We compute:'}</span>
          <span><Frac num="1" den={<Power base={a} exp={n} />} /> ＝ <Frac num="1" den={den} /></span>.
        </span>
      )
    };
  },
  // 2. Αρνητική βάση με περιττό αρνητικό εκθέτη
  (locale) => {
    const a = randInt(2, 4);
    const n = 3;
    const den = Math.pow(a, n);
    const correct = `-1/${den}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Υπολόγισε την τιμή της έκφρασης ' : 'Calculate the value of the expression '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base={`(-${a})`} exp={-n} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`1/${den}`, `-${den}`, `${den}`, `-1/${a * n}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Η βάση είναι αρνητική και ο εκθέτης περιττός, άρα:' : 'The base is negative and the exponent is odd, so:'}</span>
          <span className="font-mono">(－{a})<sup>(－{n})</sup> ＝ <Frac num="1" den={<>(－{a})<sup>{n}</sup></>} /> ＝ <Frac num="1" den={`-${den}`} /> ＝ －<Frac num="1" den={den} />.</span>
        </span>
      )
    };
  },
  // 3. Αρνητική βάση με άρτιο αρνητικό εκθέτη
  (locale) => {
    const a = randInt(2, 4);
    const n = 2;
    const den = Math.pow(a, n);
    const correct = `1/${den}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Υπολόγισε την τιμή της έκφρασης ' : 'Calculate the value of the expression '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base={`(-${a})`} exp={-n} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-1/${den}`, `-${den}`, `${den}`, `1/${a * n}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Αρνητική βάση με άρτιο εκθέτη δίνει θετικό αποτέλεσμα:' : 'Negative base with an even exponent gives a positive result:'}</span>
          <span className="font-mono">(－{a})<sup>(－{n})</sup> ＝ <Frac num="1" den={<>(－{a})<sup>{n}</sup></>} /> ＝ <Frac num="1" den={den} />.</span>
        </span>
      )
    };
  },
  // 4. Κλάσμα με αρνητικό εκθέτη (α/β)^(-1)
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(6, 9);
    const correct = `${b}/${a}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Το κλάσμα' : 'The fraction'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center">
            (<Frac num={a} den={b} />)<sup>(－1)</sup>
          </strong>
          <span>{locale === 'el' ? 'ισούται με:' : 'equals:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${b}/${a}`, `-${a}/${b}`, `${a}/${b}`, `1`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Όταν ο εκθέτης είναι (－1), αντιστρέφουμε τους όρους:' : 'When the exponent is (－1), invert the fraction:'}</span>
          <span>(<Frac num="α" den="β" />)<sup>(－1)</sup> ＝ <Frac num="β" den="α" />.</span>
        </span>
      )
    };
  },
  // 5. Κλάσμα με αρνητικό εκθέτη -2: (α/β)^(-2)
  (locale) => {
    const a = 2;
    const b = 3;
    const correct = '9/4';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή του κλάσματος' : 'Calculate the fraction value'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center">
            (<Frac num={a} den={b} />)<sup>(－2)</sup>
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-9/4', '4/9', '-4/9', '9/2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(<Frac num="2" den="3" />)<sup>(－2)</sup> ＝ (<Frac num="3" den="2" />)<sup>2</sup> ＝ <Frac num={<>3<sup>2</sup></>} den={<>2<sup>2</sup></>} /> ＝ <Frac num="9" den="4" />.</span>
        </span>
      )
    };
  },
  // 6. Μηδενικός εκθέτης: α^0
  (locale) => {
    const base = randNonZero(-15, 15);
    const correct = '1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τιμή της παράστασης ' : 'What is the value of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base={`(${base})`} exp={0} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', `${base}`, '-1', locale === 'el' ? 'Δεν ορίζεται' : 'Undefined']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Κάθε μη μηδενικός αριθμός υψωμένος στο μηδέν ισούται με 1:' : 'Any non-zero number raised to the zero power equals 1:'}</span>
          <span className="font-mono">({base})<sup>0</sup> ＝ 1.</span>
        </span>
      )
    };
  },
  // 7. Γινόμενο ίδιας βάσης με αντίθετους εκθέτες: a^n * a^(-n)
  (locale) => {
    const a = randInt(2, 7);
    const n = randInt(2, 5);
    const correct = '1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το γινόμενο' : 'Calculate the product'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={a} exp={n} /> · <Power base={a} exp={-n} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', `${a}`, `${Math.pow(a, n)}`, `${a * 2}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Προσθέτουμε τους εκθέτες:' : 'Add exponents:'}</span>
          <span>{a}<sup>{n}</sup> · {a}<sup>(－{n})</sup> ＝ {a}<sup>{n} ＋ (－{n})</sup> ＝ {a}<sup>0</sup> ＝ 1.</span>
        </span>
      )
    };
  },
  // 8. Γινόμενο ίδιας βάσης: a^m * a^n
  (locale) => {
    const a = randInt(2, 5);
    const m = randInt(3, 7);
    const n = randInt(-5, -2);
    const sum = m + n;
    const correct = `${a}^${sum}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε ως μία δύναμη το γινόμενο' : 'Write the product as a single power'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={a} exp={m} /> · <Power base={a} exp={n} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m - n}`, `${a}^${m * n}`, `${a * a}^${sum}`, `${a}^${n}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Διατηρούμε τη βάση και προσθέτουμε τους εκθέτες:' : 'Keep the base and add exponents:'}</span>
          <span>{a}<sup>{m}</sup> · {a}<sup>({n})</sup> ＝ {a}<sup>{m} ＋ ({n})</sup> ＝ {a}<sup>{sum}</sup>.</span>
        </span>
      )
    };
  },
  // 9. Πηλίκο ίδιας βάσης: a^m : a^n
  (locale) => {
    const a = randInt(2, 6);
    const m = randInt(2, 5);
    const n = randInt(-4, -1);
    const diff = m - n;
    const correct = `${a}^${diff}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε ως μία δύναμη το πηλίκο' : 'Write the quotient as a single power'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={a} exp={m} /> : <Power base={a} exp={n} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m + n}`, `${a}^${m * n}`, `${a}^${n - m}`, `${a}^${m}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Αφαιρούμε τον εκθέτη του διαιρέτη:' : 'Subtract divisor exponent:'}</span>
          <span>{a}<sup>{m}</sup> : {a}<sup>({n})</sup> ＝ {a}<sup>{m} － ({n})</sup> ＝ {a}<sup>{diff}</sup>.</span>
        </span>
      )
    };
  },
  // 10. Δύναμη σε δύναμη: (a^m)^n
  (locale) => {
    const a = randInt(2, 5);
    const m = randInt(-3, -1);
    const n = randInt(2, 4);
    const prod = m * n;
    const correct = `${a}^${prod}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε ως μία δύναμη την παράσταση' : 'Write as a single power the expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center">
            (<Power base={a} exp={m} />)<sup>{n}</sup>
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${a}^${m + n}`, `${a}^${m - n}`, `${a}^${Math.abs(prod)}`, `${a * n}^${m}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:' : 'Keep the base and multiply exponents:'}</span>
          <span>({a}<sup>({m})</sup>)<sup>{n}</sup> ＝ {a}<sup>({m}) · {n}</sup> ＝ {a}<sup>{prod}</sup>.</span>
        </span>
      )
    };
  },
  // 11. Υπολογισμός με αρνητικό εκθέτη (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της παράστασης' : 'Compute the value of the expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={2} exp={-3} /> · 8
          </strong>:
        </span>
      ),
      correct: '1',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－3)</sup> ＝ <Frac num="1" den={<>2<sup>3</sup></>} /> ＝ <Frac num="1" den="8" />.</span>
          <span>(<Frac num="1" den="8" />) · 8 ＝ 1.</span>
        </span>
      )
    };
  },
  // 12. Δύναμη του 10 με αρνητικό εκθέτη
  (locale) => {
    const exp = randInt(1, 4);
    const decEl = (1 / Math.pow(10, exp)).toString().replace('.', ',');
    const decEn = (1 / Math.pow(10, exp)).toString();
    const correct = locale === 'el' ? decEl : decEn;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10' : 'POWERS OF 10',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η δεκαδική μορφή της δύναμης ' : 'What is the decimal form of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base={10} exp={-exp} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `-${Math.pow(10, exp)}`,
        `0${locale === 'el' ? ',' : '.'}${'0'.repeat(Math.max(0, exp - 1))}2`,
        `0${locale === 'el' ? ',' : '.'}${'0'.repeat(exp)}1`,
        `-${correct}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－{exp})</sup> ＝ <Frac num="1" den={<>10<sup>{exp}</sup></>} /> ＝ {correct}.</span>
        </span>
      )
    };
  },
  // 13. Άθροισμα δυνάμεων: 2^(-1) + 2^(-1) (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΑΞΕΙΣ' : 'OPERATIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το αποτέλεσμα της πρόσθεσης:' : 'Calculate the result of the addition:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={2} exp={-1} /> ＋ <Power base={2} exp={-1} />
          </strong>
        </span>
      ),
      correct: '1',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－1)</sup> ＝ <Frac num="1" den="2" />.</span>
          <span><Frac num="1" den="2" /> ＋ <Frac num="1" den="2" /> ＝ 1.</span>
        </span>
      )
    };
  },
  // 14. Πρόσημο χωρίς παρένθεση: -a^2
  (locale) => {
    const a = randInt(3, 6);
    const res = -Math.pow(a, 2);
    const correct = `${res}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Υπολόγισε την τιμή της έκφρασης ' : 'Calculate the value of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            －<Power base={a} exp={2} />
          </strong>:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${Math.pow(a, 2)}`, `${-a - 2}`, `${a * 2}`, `0`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Χωρίς παρένθεση υψώνεται μόνο ο αριθμός:' : 'Without parentheses only the base is squared:'}</span>
          <span>－{a}<sup>2</sup> ＝ －({a} · {a}) ＝ {res}.</span>
        </span>
      )
    };
  },
  // 15. Δύναμη γινομένου: (2 * 5)^(-2)
  (locale) => {
    const correct = '1/100';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τιμή της παράστασης ' : 'What is the value of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base="(2 · 5)" exp={-2} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/20', '-1/100', '100', '-20']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(2 · 5)<sup>(－2)</sup> ＝ 10<sup>(－2)</sup> ＝ <Frac num="1" den={<>10<sup>2</sup></>} /> ＝ <Frac num="1" den="100" />.</span>
        </span>
      )
    };
  },
  // 16. Ιδιότητα (α/β)^(-ν) (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Αν' : 'If'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center">
            (<Frac num={1} den={3} />)<sup>(－2)</sup>
          </strong>
          <span>{locale === 'el' ? 'ισούται με φυσικό αριθμό, ποιος είναι αυτός;' : 'equals a natural number, which one is it?'}</span>
        </span>
      ),
      correct: '9',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(<Frac num="1" den="3" />)<sup>(－2)</sup> ＝ (<Frac num="3" den="1" />)<sup>2</sup> ＝ 3<sup>2</sup> ＝ 9.</span>
        </span>
      )
    };
  },
  // 17. Απλοποίηση παράστασης δυνάμεων
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ' : 'SIMPLIFICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Calculate the value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (<Power base={5} exp={-3} /> · <Power base={5} exp={5} />) : 5
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['25', '1', '1/5', '125']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>5<sup>(－3)</sup> · 5<sup>5</sup> ＝ 5<sup>2</sup> ＝ 25.</span>
          <span>25 : 5 ＝ 5.</span>
        </span>
      )
    };
  },
  // 18. Αντίστροφος αριθμός ως δύναμη
  (locale) => {
    const a = randInt(4, 9);
    const correct = `${a}^-1`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? `Ο αντίστροφος του αριθμού ` : `The reciprocal of `}
          <strong className="font-mono text-indigo-700">{a}</strong>
          {locale === 'el' ? ` γράφεται ως δύναμη με βάση το ${a} ως:` : ` written as a power with base ${a} is:`}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`-${a}^1`, `${a}^0`, `${a}^1`, `-${a}^-1`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Ο αντίστροφος είναι το' : 'The reciprocal is'}</span>
          <span><Frac num="1" den={a} /> ＝ {a}<sup>(－1)</sup>.</span>
        </span>
      )
    };
  },
  // 19. Δύναμη με βάση το -1: (-1)^(-5)
  (locale) => {
    const correct = '-1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Η τιμή της δύναμης ' : 'The value of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base="(-1)" exp={-5} />
          </strong>
          {locale === 'el' ? ' ισούται με:' : ' equals:'}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '-5', '5', '0']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(－1)<sup>(－5)</sup> ＝ <Frac num="1" den={<>(－1)<sup>5</sup></>} /> ＝ <Frac num="1" den="-1" /> ＝ －1.</span>
        </span>
      )
    };
  },
  // 20. Δύναμη με βάση το -1 και άρτιο εκθέτη: (-1)^(-8)
  (locale) => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Η τιμή της δύναμης ' : 'The value of '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-block mx-1">
            <Power base="(-1)" exp={-8} />
          </strong>
          {locale === 'el' ? ' ισούται με:' : ' equals:'}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-1', '8', '-8', '0']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(－1)<sup>(－8)</sup> ＝ <Frac num="1" den={<>(－1)<sup>8</sup></>} /> ＝ <Frac num="1" den="1" /> ＝ 1.</span>
        </span>
      )
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Μικροβιολογία: Διάμετρος βακτηρίου
  (locale) => {
    const exp = 6;
    const correct = '1/1000000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα μικρόβιο έχει μήκος <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-exp} /></strong> μέτρα (1 μικρόμετρο). Σε ποιο κλάσμα του μέτρου αντιστοιχεί;</>
          ) : (
            <>A bacterium has a length of <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-exp} /></strong> meters (1 micrometer). Which fraction of a meter is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100000', '1/10000', '1/1000', '-1/1000000']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－6)</sup> ＝ <Frac num="1" den={<>10<sup>6</sup></>} /> ＝ <Frac num="1" den="1.000.000" />.</span>
        </span>
      )
    };
  },
  // 2. Υπολογιστές: Χρόνος απόκρισης επεξεργαστή
  (locale) => {
    const correct = '1/1000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα millisecond ισούται με <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-3} /></strong> δευτερόλεπτα. Ποιο κλάσμα του δευτερολέπτου είναι αυτό;</>
          ) : (
            <>One millisecond equals <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-3} /></strong> seconds. What fraction of a second is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100', '1/10000', '1/30', '-1/1000']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－3)</sup> ＝ <Frac num="1" den={<>10<sup>3</sup></>} /> ＝ <Frac num="1" den="1.000" />.</span>
        </span>
      )
    };
  },
  // 3. Φωτογραφία: Ταχύτητα κλείστρου
  (locale) => {
    const correct = '1/250';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Μία φωτογραφική μηχανή ρυθμίζει το κλείστρο σε <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base="(250)" exp={-1} /></strong> δευτερόλεπτα. Σε ποιο κλάσμα αντιστοιχεί;</>
          ) : (
            <>A camera sets its shutter speed to <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base="(250)" exp={-1} /></strong> seconds. Which fraction is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/25', '-1/250', '250', '1/500']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>α<sup>(－1)</sup> ＝ <Frac num="1" den="α" />. 250<sup>(－1)</sup> ＝ <Frac num="1" den="250" />.</span>
        </span>
      )
    };
  },
  // 4. Σεισμολογία: Ενέργεια σεισμού
  (locale) => {
    const correct = '1000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η σχετική ένταση σεισμικού κύματος εκφράζεται ως' : 'Relative seismic wave intensity is expressed as'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={10} exp={5} /> · <Power base={10} exp={-2} />
          </strong>.
          <span>{locale === 'el' ? 'Ποια είναι η τελική ένταση;' : 'What is the final intensity?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['100', '10000', '10', '1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>5</sup> · 10<sup>(－2)</sup> ＝ 10<sup>5 ＋ (－2)</sup> ＝ 10<sup>3</sup> ＝ 1.000.</span>
        </span>
      )
    };
  },
  // 5. Φυσική: Εξασθένηση σήματος Wi-Fi
  (locale) => {
    const correct = '1/16';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η ισχύς σήματος Wi-Fi μειώνεται και γίνεται <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-4} /></strong> της αρχικής. Ποιο κλάσμα παραμένει;</>
          ) : (
            <>Wi-Fi signal power is reduced to <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-4} /></strong> of the initial. What fraction remains?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/8', '1/32', '-1/16', '1/4']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－4)</sup> ＝ <Frac num="1" den={<>2<sup>4</sup></>} /> ＝ <Frac num="1" den="16" />.</span>
        </span>
      )
    };
  },
  // 6. Οικονομία: Υποτίμηση νομίσματος
  (locale) => {
    const correct = '1/100';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η αξία ενός νομίσματος έγινε <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-2} /></strong> της προηγούμενης αξίας του. Ποιο μέρος απομένει;</>
          ) : (
            <>The value of a currency became <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-2} /></strong> of its previous value. What part remains?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/10', '1/1000', '1/20', '2/10']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－2)</sup> ＝ <Frac num="1" den={<>10<sup>2</sup></>} /> ＝ <Frac num="1" den="100" />.</span>
        </span>
      )
    };
  },
  // 7. Χημεία: Συγκέντρωση ιόντων υδρογόνου (pH)
  (locale) => {
    const correct = locale === 'el' ? '0,001' : '0.001';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα διάλυμα έχει συγκέντρωση <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-3} /> mol/L</strong>. Ποια είναι η δεκαδική τιμή αυτής της συγκέντρωσης;</>
          ) : (
            <>A solution has a concentration of <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-3} /> mol/L</strong>. What is the decimal value?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? '0,01' : '0.01',
        locale === 'el' ? '0,0001' : '0.0001',
        locale === 'el' ? '0,1' : '0.1',
        `-${correct}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－3)</sup> ＝ <Frac num="1" den="1000" /> ＝ {correct}.</span>
        </span>
      )
    };
  },
  // 8. Αστρονομία: Σύγκριση μαζών
  (locale) => {
    const correct = '10^3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Πλανήτης μάζας' : 'Planet with mass'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center"><Power base={10} exp={24} /> kg</strong>
          <span>{locale === 'el' ? 'και δορυφόρος' : 'and satellite'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center"><Power base={10} exp={21} /> kg</strong>.
          <span>{locale === 'el' ? 'Πόσες φορές βαρύτερος είναι ο πλανήτης (υπολόγισε το πηλίκο ' : 'How many times heavier is the planet (compute '}</span>
          <span className="font-mono inline-flex items-center gap-1"><Power base={10} exp={24} /> : <Power base={10} exp={21} /></span>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^45', '10^2', '10^4', '10^1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>24</sup> : 10<sup>21</sup> ＝ 10<sup>24 － 21</sup> ＝ 10<sup>3</sup> ＝ 1.000.</span>
        </span>
      )
    };
  },
  // 9. Αποθήκευση Δεδομένων: Byte σε Gigabyte
  (locale) => {
    const correct = '1/8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα αρχείο καταλαμβάνει χώρο <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-3} /> GB</strong>. Σε ποιο κλάσμα του GB αντιστοιχεί;</>
          ) : (
            <>A file takes up <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-3} /> GB</strong>. Which fraction of a GB is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/6', '1/16', '3/2', '-1/8']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－3)</sup> ＝ <Frac num="1" den={<>2<sup>3</sup></>} /> ＝ <Frac num="1" den="8" /> GB.</span>
        </span>
      )
    };
  },
  // 10. Ιατρική: Δόση φαρμάκου
  (locale) => {
    const correct = '1/10';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένας ασθενής λαμβάνει δόση <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-1} /> mg</strong>. Ποιο κλάσμα του mg είναι αυτό;</>
          ) : (
            <>A patient receives a dosage of <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-1} /> mg</strong>. Which fraction of a mg is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100', '10', '-1/10', '1/5']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－1)</sup> ＝ <Frac num="1" den="10" /> mg.</span>
        </span>
      )
    };
  },
  // 11. Ήχος: Ένταση ήχου (Decibel)
  (locale) => {
    const correct = '10^4';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η σχετική πίεση ήχου δίνεται από το γινόμενο' : 'Sound relative pressure is given by'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={10} exp={7} /> · <Power base={10} exp={-3} />
          </strong>.
          <span>{locale === 'el' ? 'Γράψε το αποτέλεσμα ως μία δύναμη του 10:' : 'Write the result as a single power of 10:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^-21', '10^10', '10^-4', '10^2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>7</sup> · 10<sup>(－3)</sup> ＝ 10<sup>7 ＋ (－3)</sup> ＝ 10<sup>4</sup>.</span>
        </span>
      )
    };
  },
  // 12. Οπτική: Μήκος κύματος φωτός
  (locale) => {
    const correct = '1/10000000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το μήκος κύματος ενός λέιζερ είναι <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-7} /> m</strong>. Ποιο είναι το ισοδύναμο κλάσμα;</>
          ) : (
            <>Laser wavelength is <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-7} /> m</strong>. What is the equivalent fraction?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/1000000', '1/700000', '-1/10000000', '1/100000']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－7)</sup> ＝ <Frac num="1" den={<>10<sup>7</sup></>} /> ＝ <Frac num="1" den="10.000.000" />.</span>
        </span>
      )
    };
  },
  // 13. Ηλεκτρονικά: Χωρητικότητα πυκνωτή (microfarad)
  (locale) => {
    const correct = '1/1000000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένας πυκνωτής έχει χωρητικότητα <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-6} /> Farad</strong>. Σε ποιο κλάσμα αντιστοιχεί;</>
          ) : (
            <>A capacitor has capacitance of <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-6} /> Farad</strong>. Which fraction does it equal?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/100000', '1/6000', '1/1000', '-1/1000000']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－6)</sup> ＝ <Frac num="1" den={<>10<sup>6</sup></>} /> ＝ <Frac num="1" den="1.000.000" />.</span>
        </span>
      )
    };
  },
  // 14. Διπλασιασμός και μείωση (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ένα ποσό τετραπλασιάζεται (· 2²) και έπειτα πολλαπλασιάζεται με ' : 'An amount quadruples (· 2²) and is then multiplied by '}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center"><Power base={2} exp={-2} /></strong>.
          <span>{locale === 'el' ? 'Πόσες φορές το αρχικό ποσό είναι το τελικό;' : 'How many times the initial amount is the final?'}</span>
        </span>
      ),
      correct: '1',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>2</sup> · 2<sup>(－2)</sup> ＝ 2<sup>2 ＋ (－2)</sup> ＝ 2<sup>0</sup> ＝ 1.</span>
        </span>
      )
    };
  },
  // 15. Κίνηση σε νανοκλίμακα
  (locale) => {
    const correct = '10^-4';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Νανορομπότ διανύει απόσταση ' : 'Nanorobot travels a distance of '}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center">
            (<Power base={10} exp={-2} />)<sup>2</sup>
          </strong>
          <span>{locale === 'el' ? 'm. Ποια είναι η απόσταση σε ενιαία δύναμη;' : 'm. What is the distance as a single power?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^0', '10^-1', '10^4', '10^-2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(10<sup>(－2)</sup>)<sup>2</sup> ＝ 10<sup>(－2) · 2</sup> ＝ 10<sup>(－4)</sup>.</span>
        </span>
      )
    };
  },
  // 16. Μαγειρική: Αναλογία μπαχαρικών
  (locale) => {
    const correct = '1/4';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Μία συνταγή ζητάει ποσότητα ίση με <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-2} /></strong> του κουταλιού. Ποιο μέρος του κουταλιού είναι αυτό;</>
          ) : (
            <>A recipe calls for <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={2} exp={-2} /></strong> of a spoon. What fraction of a spoon is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/2', '1/8', '-1/4', '1/16']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－2)</sup> ＝ <Frac num="1" den={<>2<sup>2</sup></>} /> ＝ <Frac num="1" den="4" />.</span>
        </span>
      )
    };
  },
  // 17. Γεωμετρία: Εμβαδόν μικροσκοπικού τετραγώνου
  (locale) => {
    const correct = '1/25';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Τετράγωνο έχει πλευρά' : 'Square has side length'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center"><Power base={5} exp={-1} /> cm</strong>.
          <span>{locale === 'el' ? 'Ποιο είναι το εμβαδόν του σε cm² (υπολόγισε (5⁻¹)²);' : 'What is its area in cm² (compute (5⁻¹)²)?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/10', '2/5', '-1/25', '1/5']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(5<sup>(－1)</sup>)<sup>2</sup> ＝ 5<sup>(－2)</sup> ＝ <Frac num="1" den={<>5<sup>2</sup></>} /> ＝ <Frac num="1" den="25" /> cm².</span>
        </span>
      )
    };
  },
  // 18. Οικονομία: Συνεχής υποδιπλασιασμός
  (locale) => {
    const correct = '1/8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Μία μετοχή υποδιπλασιάζεται 3 συνεχόμενες φορές. Η αξία της είναι ίση με' : 'A stock halves 3 consecutive times. Its value is'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center"><Power base={2} exp={-3} /></strong>
          <span>{locale === 'el' ? 'της αρχικής. Ποιο είναι το κλάσμα;' : 'of the initial. What is this fraction?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/6', '1/16', '3/8', '-1/8']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－3)</sup> ＝ <Frac num="1" den={<>2<sup>3</sup></>} /> ＝ <Frac num="1" den="8" />.</span>
        </span>
      )
    };
  },
  // 19. Ψηφιακός ήχος: Δειγματοληψία
  (locale) => {
    const correct = '10^6';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ρυθμός δειγματοληψίας αισθητήρα από το πηλίκο' : 'Sensor sampling rate from quotient'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={10} exp={3} /> : <Power base={10} exp={-3} />
          </strong>.
          <span>{locale === 'el' ? 'Ποιο είναι το αποτέλεσμα ως δύναμη;' : 'What is the result as a power?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10^0', '10^-6', '10^9', '10^1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>3</sup> : 10<sup>(－3)</sup> ＝ 10<sup>3 － (－3)</sup> ＝ 10<sup>3 ＋ 3</sup> ＝ 10<sup>6</sup>.</span>
        </span>
      )
    };
  },
  // 20. Τεχνολογία: Χρόνος απόκρισης σε nanosecond
  (locale) => {
    const correct = '1/1000000000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα nanosecond είναι <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-9} /> s</strong>. Σε ποιο κλάσμα του δευτερολέπτου αντιστοιχεί;</>
          ) : (
            <>One nanosecond is <strong className="font-mono text-amber-700 text-base sm:text-lg inline-block mx-1"><Power base={10} exp={-9} /> s</strong>. Which fraction of a second is this?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/1000000', '1/100000000', '-1/1000000000', '1/10000']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－9)</sup> ＝ <Frac num="1" den={<>10<sup>9</sup></>} /> ＝ <Frac num="1" den="1.000.000.000" />.</span>
        </span>
      )
    };
  }
];

export default function DinamiRitonEkthAkeraioAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Δυνάμεις Ρητών με Εκθέτη Ακέραιο | Β' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις υπολογισμών, ιδιοτήτων και ρεαλιστικών προβλημάτων στις δυνάμεις ρητών με εκθέτη ακέραιο.",
      backText: "ΘΕΩΡΙΑ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 1",
      badgeCount: "12 ΑΣΚΗΣΕΙΣ",
      headerTitle: "ΕΞΑΣΚΗΣΗ: ΔΥΝΑΜΕΙΣ ΡΗΤΩΝ ΜΕ ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ",
      headerDesc: "Λύσε τις 10 ασκήσεις υπολογισμών και ιδιοτήτων, καθώς και τα 2 ρεαλιστικά προβλήματα καθημερινότητας. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις το σκορ και την αναλυτική ανατροφοδότηση!",
      writeAnswerLabel: "ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:",
      inputPlaceholder: "π.χ. 1/9 ή 9",
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
      pageTitle: "Exercises: Powers of Rational Numbers with Integer Exponent | Grade 8",
      pageDesc: "12 dynamic exercises covering computations, properties, and realistic problems for rational powers with integer exponents.",
      backText: "THEORY",
      badgeUnit: "GRADE 8 • UNIT 1",
      badgeCount: "12 EXERCISES",
      headerTitle: "PRACTICE: POWERS OF RATIONAL NUMBERS WITH INTEGER EXPONENTS",
      headerDesc: "Solve the 10 calculation and property exercises along with 2 real-world problems. Click 'CHECK ANSWERS' at the end to see your score and detailed explanations!",
      writeAnswerLabel: "ENTER YOUR ANSWER:",
      inputPlaceholder: "e.g. 1/9 or 9",
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

  // Δημιουργία 12 ασκήσεων: 10 Θεωρίας/Πράξεων + 2 Ρεαλιστικών Προβλημάτων
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
    // Sanitization: επιτρέπονται μόνο αριθμοί, κόμμα, τελεία, κλάσμα, μείον, δύναμη
    const sanitized = rawVal
      .replace(/[^0-9,\./\-\^\*]/g, '')
      .replace(/\./g, locale === 'el' ? ',' : '.');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  // Αυστηρός μαθηματικός έλεγχος απάντησης με ανοχή δεκαδικών
  const checkAnswerMatch = (userVal, correctVal) => {
    const cleanUser = String(userVal || '').trim().replace(/\s+/g, '');
    const cleanCorrect = String(correctVal || '').trim().replace(/\s+/g, '');

    if (!cleanUser) return false;
    if (cleanUser.toLowerCase() === cleanCorrect.toLowerCase()) return true;

    // Μετατροπή ελληνικού κόμματος σε τελεία για αριθμητική σύγκριση
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

  // Βοηθητική μέθοδος για εμφάνιση κλασμάτων ή δυνάμεων στα κουμπιά επιλογών
  const renderOptionText = (opt) => {
    if (typeof opt === 'string' && opt.includes('/')) {
      const parts = opt.split('/');
      return <Frac num={parts[0]} den={parts[1]} />;
    }
    if (typeof opt === 'string' && opt.includes('^')) {
      const parts = opt.split('^');
      return <Power base={parts[0]} exp={parts[1]} />;
    }
    return opt;
  };

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou/01-dinami-riton-ekth-akeraio"
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

        {/* Λίστα 12 Ασκήσεων */}
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
                            {renderOptionText(opt)}
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
                              {renderOptionText(ex.correct)}
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