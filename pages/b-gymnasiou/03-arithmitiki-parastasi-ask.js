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

// Component Frac με ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow)
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

// Εμφάνιση κλασμάτων σε κουμπιά επιλογών αν η συμβολοσειρά περιέχει "/"
const renderOptionContent = (opt) => {
  if (typeof opt === 'string' && opt.includes('/') && !opt.includes(' ')) {
    const parts = opt.split('/');
    if (parts.length === 2) {
      return <Frac num={parts[0]} den={parts[1]} />;
    }
  }
  return opt;
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

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Προτεραιότητα: δύναμη με αρνητικό εκθέτη και πολλαπλασιασμός
  (locale) => {
    const a = randInt(2, 4);
    const mult = a * 2;
    const correct = `${2 + 5}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της παράστασης:' : 'Calculate the expression value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            {mult} · <Power base={a} exp={-1} /> ＋ 5
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [`${mult * a + 5}`, `${mult + 5}`, `${mult + a}`, `${mult * 2}`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{mult} · {a}<sup>(－1)</sup> ＝ {mult} · <Frac num="1" den={a} /> ＝ {mult / a}.</span>
          <span>{mult / a} ＋ 5 ＝ {correct}.</span>
        </span>
      )
    };
  },
  // 2. Παρενθέσεις και δύναμη
  (locale) => {
    const correct = '16';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΕΙΣ' : 'PARENTHESES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή της παράστασης' : 'What is the value of'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (7 － 3)<sup>2</sup> : 2 ＋ 8
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['24', '12', '8', '20']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(7 － 3)<sup>2</sup> ＝ 4<sup>2</sup> ＝ 16.</span>
          <span>16 : 2 ＝ 8.</span>
          <span>8 ＋ 8 ＝ 16.</span>
        </span>
      )
    };
  },
  // 3. Δύναμη σε αρνητικό αριθμό χωρίς παρένθεση vs με παρένθεση
  (locale) => {
    const correct = '0';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το αποτέλεσμα:' : 'Calculate the result:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (－3)<sup>2</sup> － 3<sup>2</sup>
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['18', '-18', '-12', '9']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">(－3)<sup>2</sup> ＝ ＋9</span>
          <span>{locale === 'el' ? ', ενώ' : ', while'}</span>
          <span className="font-mono">－3<sup>2</sup> ＝ －9.</span>
          <span>{locale === 'el' ? 'Επομένως:' : 'Therefore:'}</span>
          <span className="font-mono">9 － 9 ＝ 0.</span>
        </span>
      )
    };
  },
  // 4. Σύνθετη με αρνητικό εκθέτη (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της παράστασης:' : 'Calculate the expression value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            12 · <Power base={2} exp={-2} /> － 1
          </strong>
        </span>
      ),
      correct: '2',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－2)</sup> ＝ <Frac num="1" den={<>2<sup>2</sup></>} /> ＝ <Frac num="1" den="4" />.</span>
          <span>12 · <Frac num="1" den="4" /> ＝ 3.</span>
          <span>3 － 1 ＝ 2.</span>
        </span>
      )
    };
  },
  // 5. Διαδοχικές διαιρέσεις και πολλαπλασιασμοί
  (locale) => {
    const correct = '8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ' : 'ORDER OF OPS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η ορθή τιμή της έκφρασης' : 'What is the correct value of'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            16 : 4 · 2
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '4', '16', '1']),
      hint: locale === 'el'
        ? 'Εκτελούμε από αριστερά προς τα δεξιά: 16 : 4 ＝ 4, και 4 · 2 ＝ 8 (όχι 16 : 8).'
        : 'Perform operations from left to right: 16 : 4 ＝ 4, and 4 · 2 ＝ 8 (not 16 : 8).'
    };
  },
  // 6. Μηδενικός εκθέτης σε σύνθετη παρένθεση
  (locale) => {
    const correct = '11';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ' : 'POWERS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Evaluate the expression:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            10 ＋ (4 · 5 － 12)<sup>0</sup>
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10', '18', '0', '12']),
      hint: locale === 'el'
        ? 'Οποιαδήποτε μη μηδενική παρένθεση υψωμένη στο 0 ισούται με 1. Άρα 10 ＋ 1 ＝ 11.'
        : 'Any non-zero expression raised to the 0 power equals 1. Thus 10 ＋ 1 ＝ 11.'
    };
  },
  // 7. Πράξεις με κλάσματα και προτεραιότητα (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Calculate the expression:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (<Frac num="1" den="2" /> ＋ <Frac num="1" den="2" />) · 6 － 2
          </strong>
        </span>
      ),
      correct: '4',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span><Frac num="1" den="2" /> ＋ <Frac num="1" den="2" /> ＝ 1.</span>
          <span>1 · 6 － 2 ＝ 4.</span>
        </span>
      )
    };
  },
  // 8. Δύναμη δύναμης με αρνητικό εκθέτη
  (locale) => {
    const correct = '2';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η τιμή της παράστασης' : 'The value of expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            2 · (<Power base={2} exp={-1} />)<sup>(－1)</sup> － 2
          </strong>
          <span>{locale === 'el' ? 'ισούται με:' : 'equals:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0', '4', '-2', '1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(2<sup>(－1)</sup>)<sup>(－1)</sup> ＝ 2<sup>(－1) · (－1)</sup> ＝ 2<sup>1</sup> ＝ 2.</span>
          <span>2 · 2 － 2 ＝ 4 － 2 ＝ 2.</span>
        </span>
      )
    };
  },
  // 9. Αρνητική βάση και περιττός εκθέτης
  (locale) => {
    const correct = '-10';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Calculate the expression:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (－2)<sup>3</sup> － 2
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6', '-6', '10', '-8']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(－2)<sup>3</sup> ＝ －8.</span>
          <span>－8 － 2 ＝ －10.</span>
        </span>
      )
    };
  },
  // 10. Πολλαπλασιασμός με δύναμη του 10^-1
  (locale) => {
    const correct = '7';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ ΤΟΥ 10' : 'POWERS OF 10',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Calculate the value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            40 · <Power base={10} exp={-1} /> ＋ 3
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['43', '70', locale === 'el' ? '4,3' : '4.3', '37']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>(－1)</sup> ＝ <Frac num="1" den="10" />.</span>
          <span>40 · <Frac num="1" den="10" /> ＝ 4.</span>
          <span>4 ＋ 3 ＝ 7.</span>
        </span>
      )
    };
  },
  // 11. Σύνθετες παρενθέσεις (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΕΙΣ' : 'PARENTHESES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της παράστασης:' : 'Calculate the expression value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            5 ＋ 3 · (10 － 2 · 4)
          </strong>
        </span>
      ),
      correct: '11',
      hint: locale === 'el'
        ? 'Μέσα στην παρένθεση: 2 · 4 ＝ 8, άρα 10 － 8 ＝ 2. Έπειτα 3 · 2 ＝ 6, και 5 ＋ 6 ＝ 11.'
        : 'Inside brackets: 2 · 4 ＝ 8, so 10 － 8 ＝ 2. Then 3 · 2 ＝ 6, and 5 ＋ 6 ＝ 11.'
    };
  },
  // 12. Δυνάμεις και διαίρεση κλασμάτων
  (locale) => {
    const correct = '12';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της έκφρασης:' : 'Calculate the expression value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            3 : <Power base={2} exp={-2} />
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3/4', '6', '3/2', '-12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－2)</sup> ＝ <Frac num="1" den={<>2<sup>2</sup></>} /> ＝ <Frac num="1" den="4" />.</span>
          <span>3 : <Frac num="1" den="4" /> ＝ 3 · 4 ＝ 12.</span>
        </span>
      )
    };
  },
  // 13. Πρόσθεση και αφαίρεση με αντίθετες δυνάμεις
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η τιμή της παράστασης' : 'What is the value of'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            5 ＋ 4 · <Power base={4} exp={-1} /> － 1
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '6', '8', '0']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>4 · 4<sup>(－1)</sup> ＝ 4 · <Frac num="1" den="4" /> ＝ 1.</span>
          <span>5 ＋ 1 － 1 ＝ 5.</span>
        </span>
      )
    };
  },
  // 14. Σειρά πράξεων σε κλασματική γραμμή
  (locale) => {
    const correct = '3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ' : 'ORDER OF OPS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Frac num={<>2<sup>3</sup> ＋ 4</>} den="3 · 2 － 2" />
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '4', '6', '1']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Αριθμητής:' : 'Numerator:'}</span>
          <span className="font-mono">8 ＋ 4 ＝ 12.</span>
          <span>{locale === 'el' ? 'Παρονομαστής:' : 'Denominator:'}</span>
          <span className="font-mono">6 － 2 ＝ 4.</span>
          <span>{locale === 'el' ? 'Τελικά:' : 'Finally:'}</span>
          <span className="font-mono">12 : 4 ＝ 3.</span>
        </span>
      )
    };
  },
  // 15. Δύναμη σε κλάσμα με αρνητικό εκθέτη (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΔΥΝΑΜΕΙΣ' : 'POWERS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή:' : 'Evaluate:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (<Frac num="1" den="3" />)<sup>(－2)</sup> － 4
          </strong>
        </span>
      ),
      correct: '5',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(<Frac num="1" den="3" />)<sup>(－2)</sup> ＝ 3<sup>2</sup> ＝ 9.</span>
          <span>9 － 4 ＝ 5.</span>
        </span>
      )
    };
  },
  // 16. Προτεραιότητα με τρεις πράξεις
  (locale) => {
    const correct = '14';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMPUTATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Calculate the expression:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            20 － 2 · 3 ＋ 0
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['54', '18', '12', '16']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Πρώτα ο πολλαπλασιασμός:' : 'Multiplication first:'}</span>
          <span className="font-mono">2 · 3 ＝ 6.</span>
          <span>{locale === 'el' ? 'Έπειτα:' : 'Then:'}</span>
          <span className="font-mono">20 － 6 ＝ 14.</span>
        </span>
      )
    };
  },
  // 17. Παρένθεση με αρνητικό εκθέτη
  (locale) => {
    const correct = '1/4';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΕΙΣ' : 'PARENTHESES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η τιμή της έκφρασης' : 'The value of expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (6 － 4)<sup>(－2)</sup>
          </strong>
          <span>{locale === 'el' ? 'ισούται με:' : 'equals:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-4', '4', '-1/4', '1/2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>6 － 4 ＝ 2.</span>
          <span>2<sup>(－2)</sup> ＝ <Frac num="1" den={<>2<sup>2</sup></>} /> ＝ <Frac num="1" den="4" />.</span>
        </span>
      )
    };
  },
  // 18. Συνδυασμός αρνητικών προσήμων
  (locale) => {
    const correct = '-5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την τιμή της παράστασης:' : 'Calculate the expression value:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            －3 － (－2) ＋ (－4)
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-9', '-1', '3', '-3']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>－3 － (－2) ＝ －3 ＋ 2 ＝ －1.</span>
          <span>－1 ＋ (－4) ＝ －5.</span>
        </span>
      )
    };
  },
  // 19. Διπλή παρένθεση και δυνάμεις (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΕΙΣ' : 'PARENTHESES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε την παράσταση:' : 'Calculate the expression:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            2 · ((3 － 1)<sup>2</sup> ＋ 1)
          </strong>
        </span>
      ),
      correct: '10',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Εσωτερική παρένθεση:' : 'Inner brackets:'}</span>
          <span className="font-mono">3 － 1 ＝ 2.</span>
          <span>{locale === 'el' ? 'Δύναμη:' : 'Power:'}</span>
          <span className="font-mono">2<sup>2</sup> ＝ 4.</span>
          <span>{locale === 'el' ? 'Εξωτερική παρένθεση:' : 'Outer brackets:'}</span>
          <span className="font-mono">4 ＋ 1 ＝ 5.</span>
          <span>{locale === 'el' ? 'Τέλος:' : 'Finally:'}</span>
          <span className="font-mono">2 · 5 ＝ 10.</span>
        </span>
      )
    };
  },
  // 20. Θεωρητικός έλεγχος κανόνα
  (locale) => {
    const correct = locale === 'el' ? 'Πρώτα οι δυνάμεις, μετά ο πολλαπλασιασμός' : 'Powers first, then multiplication';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Στην παράσταση <span className="font-mono font-bold">5 · 2<sup>3</sup></span>, ποια πράξη εκτελείται πρώτη;</>
          ) : (
            <>In the expression <span className="font-mono font-bold">5 · 2<sup>3</sup></span>, which operation is performed first?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Πρώτα ο πολλαπλασιασμός, μετά η δύναμη' : 'Multiplication first, then powers',
        locale === 'el' ? 'Είναι αδιάφορη η σειρά' : 'The order does not matter',
        locale === 'el' ? 'Εκτελούνται ταυτόχρονα' : 'They are performed simultaneously',
        locale === 'el' ? 'Μόνο αν βάλουμε παρένθεση' : 'Only if parentheses are added'
      ]),
      hint: locale === 'el'
        ? 'Σύμφωνα με την ιεραρχία των πράξεων, οι δυνάμεις προηγούνται των πολλαπλασιασμών.'
        : 'According to the order of operations, powers take precedence over multiplication.'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Οικονομία: Υπολογισμός τελικής τιμής με έκπτωση και πολλαπλές μονάδες
  (locale) => {
    const correct = '26';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Μαθητής αγοράζει 3 τετράδια των 10€ με έκπτωση <span className="font-mono">2<sup>2</sup> €</span>. Πόσα ευρώ πλήρωσε (<strong className="font-mono text-amber-700">3 · 10 － 2<sup>2</sup></strong>);</>
          ) : (
            <>A student buys 3 notebooks at 10€ each with a discount of <span className="font-mono">2<sup>2</sup> €</span>. How much did they pay (<strong className="font-mono text-amber-700">3 · 10 － 2<sup>2</sup></strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['24', '28', '20', '34']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>2</sup> ＝ 4.</span>
          <span>3 · 10 ＝ 30.</span>
          <span>30 － 4 ＝ 26€.</span>
        </span>
      )
    };
  },
  // 2. Θερμοκρασία: Μεταβολές θερμοκρασίας
  (locale) => {
    const correct = '-2';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Σε χωριό η θερμοκρασία ήταν 4°C, μειώθηκε κατά <span className="font-mono">2<sup>3</sup> °C</span> και αυξήθηκε κατά 2°C. Ποια είναι η τελική (<strong className="font-mono text-amber-700">4 － 2<sup>3</sup> ＋ 2</strong>);</>
          ) : (
            <>The temperature was 4°C, dropped by <span className="font-mono">2<sup>3</sup> °C</span>, then rose by 2°C. What is the final temperature (<strong className="font-mono text-amber-700">4 － 2<sup>3</sup> ＋ 2</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['-6', '2', '0', '-4']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>3</sup> ＝ 8.</span>
          <span>4 － 8 ＝ －4.</span>
          <span>－4 ＋ 2 ＝ －2°C.</span>
        </span>
      )
    };
  },
  // 3. Γεωμετρία: Εμβαδόν σχημάτων
  (locale) => {
    const correct = '25';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το εμβαδόν ενός σχήματος δίνεται από την παράσταση <strong className="font-mono text-amber-700">3<sup>2</sup> ＋ 4<sup>2</sup></strong>. Πόσα cm² είναι;</>
          ) : (
            <>The area of a shape is given by <strong className="font-mono text-amber-700">3<sup>2</sup> ＋ 4<sup>2</sup></strong>. How many cm² is it?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '49', '24', '12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>3<sup>2</sup> ＝ 9, 4<sup>2</sup> ＝ 16.</span>
          <span>9 ＋ 16 ＝ 25 cm².</span>
        </span>
      )
    };
  },
  // 4. Αποταμίευση: Διπλασιασμός χρημάτων (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η Μαρία είχε 50€, ξόδεψε τα μισά (<span className="font-mono">· 2<sup>(－1)</sup></span>) και έλαβε 20€. Πόσα έχει τώρα (<strong className="font-mono text-amber-700">50 · 2<sup>(－1)</sup> ＋ 20</strong>);</>
          ) : (
            <>Maria had 50€, spent half (<span className="font-mono">· 2<sup>(－1)</sup></span>), and received 20€. How much does she have (<strong className="font-mono text-amber-700">50 · 2<sup>(－1)</sup> ＋ 20</strong>);</>
          )}
        </span>
      ),
      correct: '45',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>50 · <Frac num="1" den="2" /> ＝ 25.</span>
          <span>25 ＋ 20 ＝ 45€.</span>
        </span>
      )
    };
  },
  // 5. Φυσική: Απόσταση διαδρομής
  (locale) => {
    const correct = '50';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αυτοκίνητο κινείται με τύπο απόστασης <strong className="font-mono text-amber-700">2 · 5<sup>2</sup></strong> μέτρα. Πόσα μέτρα διένυσε;</>
          ) : (
            <>A car travels a distance given by <strong className="font-mono text-amber-700">2 · 5<sup>2</sup></strong> meters. How many meters did it travel?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['100', '20', '25', '70']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>5<sup>2</sup> ＝ 25.</span>
          <span>2 · 25 ＝ 50 m</span>
          <span className="font-sans">({locale === 'el' ? 'όχι 10² ＝ 100' : 'not 10² ＝ 100'}).</span>
        </span>
      )
    };
  },
  // 6. Τεχνολογία: Χωρητικότητα και διαμοιρασμός
  (locale) => {
    const correct = '16';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αρχείο <span className="font-mono">2<sup>6</sup> MB</span> μοιράζεται ισόποσα σε <span className="font-mono">2<sup>2</sup> φακέλους</span>. Πόσα MB περιέχει καθένας (<strong className="font-mono text-amber-700">2<sup>6</sup> : 2<sup>2</sup></strong>);</>
          ) : (
            <>A file of <span className="font-mono">2<sup>6</sup> MB</span> is split equally into <span className="font-mono">2<sup>2</sup> folders</span>. How many MB in each (<strong className="font-mono text-amber-700">2<sup>6</sup> : 2<sup>2</sup></strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['8', '32', '4', '12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>6</sup> : 2<sup>2</sup> ＝ 2<sup>6 － 2</sup> ＝ 2<sup>4</sup> ＝ 16 MB.</span>
        </span>
      )
    };
  },
  // 7. Εισιτήρια: Οικογενειακή έξοδος
  (locale) => {
    const correct = '34';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Οικογένεια πλήρωσε για 2 ενήλικες (12€ έκαστος) και 2 παιδιά (5€ έκαστος). Ποιο το κόστος (<strong className="font-mono text-amber-700">2 · 12 ＋ 2 · 5</strong>);</>
          ) : (
            <>A family paid for 2 adults (12€ each) and 2 children (5€ each). What is the total (<strong className="font-mono text-amber-700">2 · 12 ＋ 2 · 5</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['38', '30', '48', '24']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 · 12 ＝ 24.</span>
          <span>2 · 5 ＝ 10.</span>
          <span>24 ＋ 10 ＝ 34€.</span>
        </span>
      )
    };
  },
  // 8. Αγροτική παραγωγή: Κιβώτια φρούτων (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Παραγωγός γεμίζει 5 κιβώτια με 12 kg μήλα και αφαιρεί 2 kg από καθένα. Πόσα kg έμειναν (<strong className="font-mono text-amber-700">5 · (12 － 2)</strong>);</>
          ) : (
            <>A farmer fills 5 crates with 12 kg of apples and removes 2 kg from each. How many kg remain (<strong className="font-mono text-amber-700">5 · (12 － 2)</strong>);</>
          )}
        </span>
      ),
      correct: '50',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>12 － 2 ＝ 10.</span>
          <span>5 · 10 ＝ 50 kg.</span>
        </span>
      )
    };
  },
  // 9. Αθλητισμός: Βαθμολογία σε πρωτάθλημα
  (locale) => {
    const correct = '23';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ομάδα έχει 7 νίκες (3 βαθμοί) και 2 ισοπαλίες (1 βαθμός). Πόσους βαθμούς συγκέντρωσε (<strong className="font-mono text-amber-700">7 · 3 ＋ 2 · 1</strong>);</>
          ) : (
            <>A team has 7 wins (3 points) and 2 draws (1 point). How many points total (<strong className="font-mono text-amber-700">7 · 3 ＋ 2 · 1</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['21', '25', '27', '22']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">7 · 3 ＝ 21.</span>
          <span className="font-mono">2 · 1 ＝ 2.</span>
          <span className="font-mono">21 ＋ 2 ＝ 23</span>
          <span>{locale === 'el' ? 'βαθμοί.' : 'points.'}</span>
        </span>
      )
    };
  },
  // 10. Μαγειρική: Δόσεις υλικών
  (locale) => {
    const correct = '2';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Συνταγή ζητάει <strong className="font-mono text-amber-700">8 · <Power base={2} exp={-2} /></strong> φλιτζάνια ζάχαρη. Πόσα φλιτζάνια βάζουμε;</>
          ) : (
            <>A recipe calls for <strong className="font-mono text-amber-700">8 · <Power base={2} exp={-2} /></strong> cups of sugar. How many cups is that?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4', '1', '16', '1/2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>(－2)</sup> ＝ <Frac num="1" den={<>2<sup>2</sup></>} /> ＝ <Frac num="1" den="4" />.</span>
          <span>8 · <Frac num="1" den="4" /> ＝ 2.</span>
        </span>
      )
    };
  },
  // 11. Πληροφορική: Χρόνος εκτέλεσης σε κύκλους ρολογιού
  (locale) => {
    const correct = '100';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο χρόνος εκτέλεσης αλγορίθμου είναι' : 'Algorithm execution time is'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            <Power base={10} exp={3} /> · <Power base={10} exp={-1} /> ms
          </strong>.
          <span>{locale === 'el' ? 'Πόσα ms χρειάζονται;' : 'How many ms are required?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['10', '1000', '1', '20']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10<sup>3</sup> · 10<sup>(－1)</sup> ＝ 10<sup>3 － 1</sup> ＝ 10<sup>2</sup> ＝ 100 ms.</span>
        </span>
      )
    };
  },
  // 12. Ενέργεια: Κατανάλωση ηλεκτρικού ρεύματος (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Συσκευή καταναλώνει' : 'A device consumes'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            3 · <Power base={10} exp={2} /> － 50 Watts
          </strong>.
          <span>{locale === 'el' ? 'Πόσα Watts είναι η κατανάλωση;' : 'How many Watts is the consumption?'}</span>
        </span>
      ),
      correct: '250',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>3 · 10<sup>2</sup> ＝ 300.</span>
          <span>300 － 50 ＝ 250 Watts.</span>
        </span>
      )
    };
  },
  // 13. Κατασκευές: Περίμετρος οικοπέδου
  (locale) => {
    const correct = '60';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Οικόπεδο έχει μήκος 20 m και πλάτος 10 m. Η περίμετρος είναι <strong className="font-mono text-amber-700">2 · (20 ＋ 10)</strong>. Πόσα m είναι;</>
          ) : (
            <>A plot has length 20 m and width 10 m. Perimeter is <strong className="font-mono text-amber-700">2 · (20 ＋ 10)</strong>. How many meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['50', '40', '100', '80']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>20 ＋ 10 ＝ 30.</span>
          <span>2 · 30 ＝ 60 m.</span>
        </span>
      )
    };
  },
  // 14. Χημεία: Αραίωση διαλύματος
  (locale) => {
    const correct = '5';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Διάλυμα 10 L αραιώνεται στο μισό (<span className="font-mono">· 2<sup>(－1)</sup></span>). Πόσα L είναι το νέο διάλυμα (<strong className="font-mono text-amber-700">10 · 2<sup>(－1)</sup></strong>);</>
          ) : (
            <>A solution of 10 L is diluted by half (<span className="font-mono">· 2<sup>(－1)</sup></span>). What is the new volume (<strong className="font-mono text-amber-700">10 · 2<sup>(－1)</sup></strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['20', '2', locale === 'el' ? '2,5' : '2.5', '8']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10 · <Frac num="1" den="2" /> ＝ 5 L.</span>
        </span>
      )
    };
  },
  // 15. Βιβλιοθήκη: Ταξινόμηση βιβλίων
  (locale) => {
    const correct = '90';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Σε 3 ράφια υπάρχουν 25 βιβλία στο καθένα και προστέθηκαν άλλα 15. Πόσα είναι όλα (<strong className="font-mono text-amber-700">3 · 25 ＋ 15</strong>);</>
          ) : (
            <>There are 3 shelves with 25 books each and 15 more are added. How many in total (<strong className="font-mono text-amber-700">3 · 25 ＋ 15</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['120', '85', '75', '100']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">3 · 25 ＝ 75.</span>
          <span className="font-mono">75 ＋ 15 ＝ 90</span>
          <span>{locale === 'el' ? 'βιβλία.' : 'books.'}</span>
        </span>
      )
    };
  },
  // 16. Μισθοδοσία: Υπερωρίες (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Υπάλληλος έχει μισθό 800€ και παίρνει 50€ για καθεμία από τις 4 ώρες υπερωρίας. Ποιος ο μισθός (<strong className="font-mono text-amber-700">800 ＋ 4 · 50</strong>);</>
          ) : (
            <>An employee has a salary of 800€ and gets 50€ for each of 4 overtime hours. What is the total (<strong className="font-mono text-amber-700">800 ＋ 4 · 50</strong>);</>
          )}
        </span>
      ),
      correct: '1000',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>4 · 50 ＝ 200€.</span>
          <span>800 ＋ 200 ＝ 1000€.</span>
        </span>
      )
    };
  },
  // 17. Γεωμετρία: Όγκος κύβου και αφαίρεση
  (locale) => {
    const correct = '20';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Από κύβο όγκου <span className="font-mono">3<sup>3</sup> cm³</span> αφαιρούμε 7 cm³. Ποιος ο τελικός όγκος (<strong className="font-mono text-amber-700">3<sup>3</sup> － 7</strong>);</>
          ) : (
            <>From a cube of volume <span className="font-mono">3<sup>3</sup> cm³</span> we remove 7 cm³. What is the final volume (<strong className="font-mono text-amber-700">3<sup>3</sup> － 7</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2', '27', '18', '14']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>3<sup>3</sup> ＝ 27.</span>
          <span>27 － 7 ＝ 20 cm³.</span>
        </span>
      )
    };
  },
  // 18. Τηλεπικοινωνίες: Χρέωση κλήσεων
  (locale) => {
    const correct = '11';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πρόγραμμα έχει πάγιο 5€ και χρέωση 2€ ανά ώρα για 3 ώρες. Ποιος είναι ο λογαριασμός (<strong className="font-mono text-amber-700">5 ＋ 2 · 3</strong>);</>
          ) : (
            <>A plan has a 5€ base fee and 2€ per hour for 3 hours. What is the bill (<strong className="font-mono text-amber-700">5 ＋ 2 · 3</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['21', '10', '15', '13']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 · 3 ＝ 6.</span>
          <span>5 ＋ 6 ＝ 11€.</span>
        </span>
      )
    };
  },
  // 19. Βιολογία: Πληθυσμός κυττάρων
  (locale) => {
    const correct = '32';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αποικία ξεκινά με 2 κύτταρα και διπλασιάζεται 4 φορές (<strong className="font-mono text-amber-700">2 · 2<sup>4</sup></strong>). Πόσα είναι τα κύτταρα;</>
          ) : (
            <>A colony starts with 2 cells and doubles 4 times (<strong className="font-mono text-amber-700">2 · 2<sup>4</sup></strong>). How many cells in total?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['16', '64', '36', '20']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">2 · 2<sup>4</sup> ＝ 2<sup>5</sup> ＝ 32</span>
          <span>{locale === 'el' ? 'κύτταρα.' : 'cells.'}</span>
        </span>
      )
    };
  },
  // 20. Αεροναυπηγική: Ταχύτητα ανόδου
  (locale) => {
    const correct = '180';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Αεροσκάφος ανέρχεται με ρυθμό' : 'Aircraft climbs at rate of'}</span>
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            2 · <Power base={10} exp={2} /> － 20 m/min
          </strong>.
          <span>{locale === 'el' ? 'Ποια είναι η ταχύτητα ανόδου;' : 'What is the climb rate?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['200', '160', '80', '220']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 · 10<sup>2</sup> ＝ 200.</span>
          <span>200 － 20 ＝ 180 m/min.</span>
        </span>
      )
    };
  }
];

export default function ArithmitikiParastasiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Αριθμητικές Παραστάσεις & Προτεραιότητα | Β' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις υπολογισμών, προτεραιότητας πράξεων και ρεαλιστικών προβλημάτων με δυνάμεις αρνητικού εκθέτη.",
      backText: "ΘΕΩΡΙΑ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 3",
      badgeCount: "12 ΑΣΚΗΣΕΙΣ",
      headerTitle: "ΕΞΑΣΚΗΣΗ: ΑΡΙΘΜΗΤΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ",
      headerDesc: "Εξασκήσου στην ορθή σειρά των πράξεων, στους κανόνες παρενθέσεων και στις δυνάμεις με αρνητικό εκθέτη, λύνοντας 10 ασκήσεις υπολογισμών και 2 προβλήματα καθημερινότητας.",
      writeAnswerLabel: "ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:",
      inputPlaceholder: "π.χ. 2 ή -10",
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
      pageTitle: "Exercises: Order of Operations & Expressions | Grade 8",
      pageDesc: "12 dynamic exercises covering calculation order, precedence rules, and realistic problems with negative exponent powers.",
      backText: "THEORY",
      badgeUnit: "GRADE 8 • UNIT 3",
      badgeCount: "12 EXERCISES",
      headerTitle: "PRACTICE: ARITHMETIC EXPRESSIONS & ORDER OF OPS",
      headerDesc: "Practice the correct order of operations, parenthesis rules, and negative exponent powers with 10 calculation exercises and 2 real-world problems.",
      writeAnswerLabel: "ENTER YOUR ANSWER:",
      inputPlaceholder: "e.g. 2 or -10",
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
    // Sanitization: επιτρέπονται μόνο αριθμοί, κόμμα, τελεία, μείον, κλάσμα
    const sanitized = rawVal
      .replace(/[^0-9,\./\-\^\*]/g, '')
      .replace(/\./g, locale === 'el' ? ',' : '.');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  // Ασφαλής έλεγχος απάντησης
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

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou/03-arithmitiki-parastasi"
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