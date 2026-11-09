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

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow)
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

// Βοηθητική μέθοδος για κομψή προβολή συμβολοσειρών με δυνάμεις (π.χ. "3,4 · 10^5" ή "7,5 · 10^-6")
const renderMathText = (text) => {
  if (typeof text !== 'string') return text;

  // Εντοπισμός μοτίβου base^exp
  const parts = text.split(/(\b\d+\^[-]?\d+\b)/g);
  return parts.map((part, idx) => {
    if (part.includes('^')) {
      const [b, e] = part.split('^');
      return <Power key={idx} base={b} exp={e} />;
    }
    return part;
  });
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

// Βοηθητικές συναρτήσεις τυχαίων τιμών
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Έλεγχος συνθήκης τυποποιημένης μορφής
  (locale) => {
    const dec = locale === 'el' ? '3,4' : '3.4';
    const d1 = locale === 'el' ? '0,34' : '0.34';
    const d2 = locale === 'el' ? '0,034' : '0.034';
    const correct = `${dec} · 10^5`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος από τους παρακάτω αριθμούς είναι γραμμένος σε <strong>ορθή τυποποιημένη μορφή</strong>;</>
          ) : (
            <>Which of the following numbers is written in <strong>correct scientific notation</strong>?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['34 · 10^4', `${d1} · 10^6`, '340 · 10^3', `${d2} · 10^7`]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Στην τυποποιημένη μορφή α · 10<sup>κ</sup> πρέπει να ισχύει αυστηρά' : 'In scientific notation a · 10<sup>k</sup>, it must hold:'}</span>
          <span className="font-mono font-bold">1 ≤ |{locale === 'el' ? 'α' : 'a'}| ＜ 10</span>.
        </span>
      )
    };
  },
  // 2. Μετατροπή μεγάλου ακεραίου (π.χ. 450.000)
  (locale) => {
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const zeros = randInt(4, 6);
    const rawNum = `${a}${b}${'0'.repeat(zeros - 1)}`;
    const formattedRaw = Number(rawNum).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `${a}${decSep}${b} · 10^${zeros}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τυποποιημένη μορφή του αριθμού ' : 'What is the scientific notation of '}
          <strong className="font-mono text-indigo-700">{formattedRaw}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${a}${b} · 10^${zeros - 1}`,
        `0${decSep}${a}${b} · 10^${zeros + 1}`,
        `${a}${decSep}${b} · 10^${zeros - 1}`,
        `${a}${decSep}${b} · 10^${zeros + 1}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{formattedRaw} ＝ {a}{decSep}{b} · 10<sup>{zeros}</sup></span>
          <span className="font-sans">({locale === 'el' ? `${zeros} θέσεις αριστερά` : `${zeros} places left`}).</span>
        </span>
      )
    };
  },
  // 3. Μετατροπή μικρού δεκαδικού (π.χ. 0,00072)
  (locale) => {
    const a = randInt(2, 7);
    const b = randInt(1, 8);
    const zeros = randInt(3, 5);
    const decSep = locale === 'el' ? ',' : '.';
    const rawNum = `0${decSep}${'0'.repeat(zeros - 1)}${a}${b}`;
    const correct = `${a}${decSep}${b} · 10^-${zeros}`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τυποποιημένη μορφή του δεκαδικού ' : 'What is the scientific notation of '}
          <strong className="font-mono text-indigo-700">{rawNum}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `${a}${decSep}${b} · 10^${zeros}`,
        `${a}${b} · 10^-${zeros + 1}`,
        `0${decSep}${a}${b} · 10^-${zeros - 1}`,
        `${a}${decSep}${b} · 10^-${zeros + 1}`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{rawNum} ＝ {a}{decSep}{b} · 10<sup>(－{zeros})</sup></span>
          <span className="font-sans">({locale === 'el' ? `${zeros} θέσεις δεξιά` : `${zeros} places right`}).</span>
        </span>
      )
    };
  },
  // 4. Αρνητικός αριθμός σε τυποποιημένη μορφή
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `-7${decSep}8 · 10^4`;
    const numDisplay = locale === 'el' ? '-78.000' : '-78,000';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΣΗΜΑ' : 'SIGNS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τυποποιημένη μορφή του αριθμού ' : 'What is the scientific notation of '}
          <strong className="font-mono text-indigo-700">{numDisplay}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `7${decSep}8 · 10^-4`,
        `-78 · 10^3`,
        `-0${decSep}78 · 10^5`,
        `7${decSep}8 · 10^4`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Το πρόσημο μείον παραμένει μπροστά:' : 'The negative sign remains in front:'}</span>
          <span>{numDisplay} ＝ －7{decSep}8 · 10<sup>4</sup>.</span>
        </span>
      )
    };
  },
  // 5. Μετατροπή από τυποποιημένη σε φυσικό αριθμό (Input)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΑΝΑΠΤΥΓΜΑ' : 'EXPANSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε ως συνηθισμένο ακέραιο την παράσταση' : 'Write as a standard integer the expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            3{decSep}5 · <Power base={10} exp={4} />
          </strong>:
        </span>
      ),
      correct: '35000',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>3{decSep}5 · 10<sup>4</sup> ＝ 3{decSep}5 · 10.000 ＝ 35.000</span>
          <span className="font-sans">({locale === 'el' ? '4 θέσεις δεξιά' : '4 places right'}).</span>
        </span>
      )
    };
  },
  // 6. Μετατροπή από τυποποιημένη σε δεκαδικό (Input)
  (locale) => {
    const decAns = locale === 'el' ? '0,004' : '0.004';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΑΝΑΠΤΥΓΜΑ' : 'EXPANSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε ως δεκαδικό αριθμό την παράσταση' : 'Write as a decimal number the expression'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            4 · <Power base={10} exp={-3} />
          </strong>:
        </span>
      ),
      correct: decAns,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>4 · 10<sup>(－3)</sup> ＝ 4 : 1.000 ＝ {decAns}</span>
          <span className="font-sans">({locale === 'el' ? '3 θέσεις αριστερά' : '3 places left'}).</span>
        </span>
      )
    };
  },
  // 7. Διόρθωση συντελεστή που υπερβαίνει το 10 (45 · 10^3)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `4${decSep}5 · 10^4`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ' : 'SIMPLIFICATION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η σωστή τυποποιημένη μορφή της έκφρασης ' : 'What is the correct scientific notation for '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            45 · <Power base={10} exp={3} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `4${decSep}5 · 10^2`,
        '45 · 10^3',
        `0${decSep}45 · 10^5`,
        `4${decSep}5 · 10^5`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>45 ＝ 4{decSep}5 · 10<sup>1</sup>.</span>
          <span>4{decSep}5 · 10<sup>1</sup> · 10<sup>3</sup> ＝ 4{decSep}5 · 10<sup>4</sup>.</span>
        </span>
      )
    };
  },
  // 8. Διόρθωση συντελεστή μικρότερου του 1 (0,06 · 10^5)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = '6 · 10^3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ' : 'SIMPLIFICATION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η σωστή τυποποιημένη μορφή της έκφρασης ' : 'What is the correct scientific notation for '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            0{decSep}06 · <Power base={10} exp={5} />
          </strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '6 · 10^7',
        '6 · 10^4',
        `0${decSep}6 · 10^4`,
        '60 · 10^2'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0{decSep}06 ＝ 6 · 10<sup>(－2)</sup>.</span>
          <span>6 · 10<sup>(－2)</sup> · 10<sup>5</sup> ＝ 6 · 10<sup>(－2) ＋ 5</sup> ＝ 6 · 10<sup>3</sup>.</span>
        </span>
      )
    };
  },
  // 9. Γινόμενο τυποποιημένων αριθμών
  (locale) => {
    const correct = '6 · 10^7';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ' : 'MULTIPLICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το γινόμενο:' : 'Calculate the product:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (2 · <Power base={10} exp={3} />) · (3 · <Power base={10} exp={4} />)
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6 · 10^12', '5 · 10^7', '6 · 10^1', '5 · 10^12']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(2 · 3) · 10<sup>3 ＋ 4</sup> ＝ 6 · 10<sup>7</sup>.</span>
        </span>
      )
    };
  },
  // 10. Πηλίκο τυποποιημένων αριθμών
  (locale) => {
    const correct = '4 · 10^3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ' : 'DIVISION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε το πηλίκο:' : 'Calculate the quotient:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (8 · <Power base={10} exp={7} />) : (2 · <Power base={10} exp={4} />)
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^11', '4 · 10^-3', '6 · 10^3', '16 · 10^3']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(8 : 2) · 10<sup>7 － 4</sup> ＝ 4 · 10<sup>3</sup>.</span>
        </span>
      )
    };
  },
  // 11. Γινόμενο όπου το γινόμενο των συντελεστών ξεπερνά το 10
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `1${decSep}5 · 10^7`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ' : 'MULTIPLICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε σε τυποποιημένη μορφή το γινόμενο:' : 'Calculate the product in scientific notation:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (5 · <Power base={10} exp={2} />) · (3 · <Power base={10} exp={4} />)
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '15 · 10^6',
        `1${decSep}5 · 10^6`,
        `1${decSep}5 · 10^8`,
        '8 · 10^6'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>5 · 3 ＝ 15.</span>
          <span>15 · 10<sup>2 ＋ 4</sup> ＝ 15 · 10<sup>6</sup> ＝ 1{decSep}5 · 10<sup>7</sup>.</span>
        </span>
      )
    };
  },
  // 12. Πηλίκο όπου ο συντελεστής είναι μικρότερος του 1
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = '5 · 10^3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ' : 'DIVISION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Υπολόγισε σε τυποποιημένη μορφή το πηλίκο:' : 'Calculate the quotient in scientific notation:'}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            (2 · <Power base={10} exp={6} />) : (4 · <Power base={10} exp={2} />)
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `0${decSep}5 · 10^4`,
        '5 · 10^4',
        '5 · 10^2',
        '2 · 10^4'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 : 4 ＝ 0{decSep}5.</span>
          <span>0{decSep}5 · 10<sup>6 － 2</sup> ＝ 0{decSep}5 · 10<sup>4</sup> ＝ 5 · 10<sup>3</sup>.</span>
        </span>
      )
    };
  },
  // 13. Σύγκριση δύο αριθμών σε τυποποιημένη μορφή (διαφορετικός εκθέτης)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `9${decSep}1 · 10^5 ＜ 1${decSep}2 · 10^6`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ' : 'COMPARISON',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια σχέση ισχύει ανάμεσα στους αριθμούς' : 'Which relation holds between the numbers'}</span>
          <span className="font-mono font-bold inline-flex items-center gap-0.5">Α ＝ 9{decSep}1 · <Power base={10} exp={5} /></span>
          <span>{locale === 'el' ? 'και' : 'and'}</span>
          <span className="font-mono font-bold inline-flex items-center gap-0.5">Β ＝ 1{decSep}2 · <Power base={10} exp={6} /></span>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `9${decSep}1 · 10^5 ＞ 1${decSep}2 · 10^6`,
        `9${decSep}1 · 10^5 ＝ 1${decSep}2 · 10^6`,
        locale === 'el' ? 'Δεν συγκρίνονται' : 'Cannot be compared',
        `9${decSep}1 · 10^5 ≥ 1${decSep}2 · 10^6`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Ο Β έχει μεγαλύτερο εκθέτη του 10:' : 'Number B has a higher power of 10:'}</span>
          <span className="font-mono">1{decSep}2 · 10<sup>6</sup> (1.200.000) ＞ 9{decSep}1 · 10<sup>5</sup> (910.000).</span>
        </span>
      )
    };
  },
  // 14. Σύγκριση δύο αριθμών με ίδιο εκθέτη
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `7${decSep}2 · 10^-4 ＞ 4${decSep}9 · 10^-4`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ' : 'COMPARISON',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια σχέση ισχύει ανάμεσα στους αριθμούς' : 'Which relation holds between'}</span>
          <span className="font-mono font-bold inline-flex items-center gap-0.5">7{decSep}2 · <Power base={10} exp={-4} /></span>
          <span>{locale === 'el' ? 'και' : 'and'}</span>
          <span className="font-mono font-bold inline-flex items-center gap-0.5">4{decSep}9 · <Power base={10} exp={-4} /></span>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `7${decSep}2 · 10^-4 ＜ 4${decSep}9 · 10^-4`,
        `7${decSep}2 · 10^-4 ＝ 4${decSep}9 · 10^-4`,
        `4${decSep}9 · 10^-4 ＞ 7${decSep}2 · 10^-4`,
        `7${decSep}2 · 10^-4 ≤ 4${decSep}9 · 10^-4`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Όταν οι εκθέτες είναι ίδιοι, συγκρίνουμε τους συντελεστές:' : 'When exponents are equal, compare the coefficients:'}</span>
          <span className="font-mono">7{decSep}2 ＞ 4{decSep}9 ➔ 7{decSep}2 · 10<sup>(－4)</sup> ＞ 4{decSep}9 · 10<sup>(－4)</sup>.</span>
        </span>
      )
    };
  },
  // 15. Δύναμη τυποποιημένου αριθμού: (2 · 10^3)^2
  (locale) => {
    const correct = '4 · 10^6';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Υπολόγισε την τιμή της δύναμης: ' : 'Calculate the value of power: '}
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center">
            (2 · <Power base={10} exp={3} />)<sup>2</sup>
          </strong>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^5', '2 · 10^6', '4 · 10^9', '8 · 10^6']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2<sup>2</sup> · (10<sup>3</sup>)<sup>2</sup> ＝ 4 · 10<sup>3 · 2</sup> ＝ 4 · 10<sup>6</sup>.</span>
        </span>
      )
    };
  },
  // 16. Τυποποιημένη μορφή του 1.000.000 (Input)
  (locale) => {
    const displayNum = locale === 'el' ? '1.000.000' : '1,000,000';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? `Αν ο αριθμός ${displayNum} γραφτεί στη μορφή` : `If ${displayNum} is written as`}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center"><Power base={10} exp={locale === 'el' ? 'κ' : 'k'} /></strong>,
          <span>{locale === 'el' ? 'ποιος είναι ο εκθέτης;' : 'what is the exponent?'}</span>
        </span>
      ),
      correct: '6',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{displayNum} ＝ 10<sup>6</sup></span>
          <span className="font-sans">({locale === 'el' ? '6 μηδενικά' : '6 zeros'}).</span>
        </span>
      )
    };
  },
  // 17. Τυποποιημένη μορφή του 0,00001 (Input)
  (locale) => {
    const displayNum = locale === 'el' ? '0,00001' : '0.00001';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? `Αν ο δεκαδικός ${displayNum} γραφτεί στη μορφή` : `If decimal ${displayNum} is written as`}</span>
          <strong className="font-mono text-indigo-700 text-base sm:text-lg inline-flex items-center"><Power base={10} exp={locale === 'el' ? 'κ' : 'k'} /></strong>,
          <span>{locale === 'el' ? 'ποιος είναι ο ακέραιος;' : 'what is the integer?'}</span>
        </span>
      ),
      correct: '-5',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{displayNum} ＝ 10<sup>(－5)</sup></span>
          <span className="font-sans">({locale === 'el' ? '5 θέσεις δεξιά' : '5 places right'}).</span>
        </span>
      )
    };
  },
  // 18. Μετατροπή 9,4 εκατομμυρίων
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `9${decSep}4 · 10^6`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πώς εκφράζεται σε τυποποιημένη μορφή η ποσότητα <strong className="font-mono text-indigo-700">9,4 εκατομμύρια</strong>;</>
          ) : (
            <>How is the quantity <strong className="font-mono text-indigo-700">9.4 million</strong> written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `9${decSep}4 · 10^5`,
        `94 · 10^6`,
        `0${decSep}94 · 10^7`,
        `9${decSep}4 · 10^9`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? '1 εκατομμύριο ＝' : '1 million ＝'}</span>
          <span>10<sup>6</sup>. 9{decSep}4 · 10<sup>6</sup>.</span>
        </span>
      )
    };
  },
  // 19. Μετατροπή 3 δισεκατομμυρίων
  (locale) => {
    const correct = '3 · 10^9';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πώς εκφράζεται σε τυποποιημένη μορφή η ποσότητα <strong className="font-mono text-indigo-700">3 δισεκατομμύρια</strong>;</>
          ) : (
            <>How is the quantity <strong className="font-mono text-indigo-700">3 billion</strong> expressed in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '3 · 10^6',
        '3 · 10^12',
        '30 · 10^8',
        `0${locale === 'el' ? ',' : '.'}3 · 10^10`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? '1 δισεκατομμύριο ＝' : '1 billion ＝'}</span>
          <span>10<sup>9</sup>. 3 · 10<sup>9</sup>.</span>
        </span>
      )
    };
  },
  // 20. Ακέραιο μέρος ίσο με 1
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `1${decSep}05 · 10^2`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η τυποποιημένη μορφή του αριθμού ' : 'What is the scientific notation of '}
          <strong className="font-mono text-indigo-700">105</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `10${decSep}5 · 10^1`,
        `1${decSep}05 · 10^3`,
        `0${decSep}105 · 10^3`,
        `1${decSep}5 · 10^2`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>105 ＝ 1{decSep}05 · 10<sup>2</sup></span>
          <span className="font-sans">({locale === 'el' ? '2 θέσεις αριστερά' : '2 places left'}).</span>
        </span>
      )
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Αστρονομία: Απόσταση Γης - Σελήνης
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `3${decSep}84 · 10^8`;
    const numDisplay = locale === 'el' ? '384.000.000 μέτρα' : '384,000,000 meters';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η μέση απόσταση Γης - Σελήνης είναι <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή σε μέτρα;</>
          ) : (
            <>The average Earth - Moon distance is <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation in meters?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `3${decSep}84 · 10^6`,
        `38${decSep}4 · 10^7`,
        `0${decSep}384 · 10^9`,
        `3${decSep}84 · 10^-8`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>384.000.000 ＝ 3{decSep}84 · 10<sup>8</sup> m</span>
          <span className="font-sans">({locale === 'el' ? '8 θέσεις αριστερά' : '8 places left'}).</span>
        </span>
      )
    };
  },
  // 2. Φυσική: Ταχύτητα του φωτός
  (locale) => {
    const numDisplay = locale === 'el' ? '300.000.000 m/s' : '300,000,000 m/s';
    const correct = '3 · 10^8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το φως ταξιδεύει στο κενό με ταχύτητα <strong className="font-mono text-amber-700">{numDisplay}</strong>. Πώς γράφεται σε τυποποιημένη μορφή;</>
          ) : (
            <>Light travels in vacuum at <strong className="font-mono text-amber-700">{numDisplay}</strong>. How is this written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '3 · 10^7',
        '30 · 10^7',
        '3 · 10^6',
        `0${locale === 'el' ? ',' : '.'}3 · 10^9`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>300.000.000 ＝ 3 · 10<sup>8</sup> m/s.</span>
        </span>
      )
    };
  },
  // 3. Βιολογία: Ερυθρό αιμοσφαίριο
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `7${decSep}5 · 10^-6`;
    const numDisplay = locale === 'el' ? '0,0000075 μέτρα' : '0.0000075 meters';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η διάμετρος ενός ερυθρού αιμοσφαιρίου είναι <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>The diameter of a red blood cell is <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `7${decSep}5 · 10^-5`,
        `75 · 10^-7`,
        `0${decSep}75 · 10^-5`,
        `7${decSep}5 · 10^6`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0{decSep}0000075 ＝ 7{decSep}5 · 10<sup>(－6)</sup> m.</span>
        </span>
      )
    };
  },
  // 4. Νανοτεχνολογία: Πάχος νανοσωλήνα άνθρακα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `1${decSep}4 · 10^-9`;
    const numDisplay = locale === 'el' ? '0,0000000014 m' : '0.0000000014 m';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Νανοσωλήνας άνθρακα έχει διάμετρο <strong className="font-mono text-amber-700">{numDisplay}</strong>. Πώς γράφεται σε τυποποιημένη μορφή;</>
          ) : (
            <>A carbon nanotube has a diameter of <strong className="font-mono text-amber-700">{numDisplay}</strong>. How is it written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `1${decSep}4 · 10^-8`,
        `14 · 10^-10`,
        `1${decSep}4 · 10^-10`,
        `0${decSep}14 · 10^-8`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0{decSep}0000000014 ＝ 1{decSep}4 · 10<sup>(－9)</sup> m.</span>
        </span>
      )
    };
  },
  // 5. Χημεία: Μάζα μορίου οξυγόνου
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `5${decSep}3 · 10^-23`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Η μάζα μορίου οξυγόνου δίνεται ως ' : 'The mass of an oxygen molecule is given as '}
          <strong className="font-mono text-amber-700 text-base sm:text-lg inline-flex items-center gap-1">
            53 · <Power base={10} exp={-24} /> {locale === 'el' ? 'γραμμάρια' : 'grams'}
          </strong>.
          {locale === 'el' ? ' Ποια είναι η ορθή τυποποιημένη μορφή;' : ' What is the correct scientific notation?'}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `5${decSep}3 · 10^-25`,
        `5${decSep}3 · 10^-23`,
        `0${decSep}53 · 10^-22`,
        `5${decSep}3 · 10^23`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>53 ＝ 5{decSep}3 · 10<sup>1</sup>.</span>
          <span>5{decSep}3 · 10<sup>1</sup> · 10<sup>(－24)</sup> ＝ 5{decSep}3 · 10<sup>1 ＋ (－24)</sup> ＝ 5{decSep}3 · 10<sup>(－23)</sup> g.</span>
        </span>
      )
    };
  },
  // 6. Πληθυσμιακή Στατιστική: Πληθυσμός της Γης
  (locale) => {
    const numDisplay = locale === 'el' ? '8.000.000.000 ανθρώπους' : '8,000,000,000 people';
    const correct = '8 · 10^9';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ο πληθυσμός της Γης είναι περίπου <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>Earth population is approximately <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '8 · 10^8',
        '80 · 10^8',
        '8 · 10^10',
        `0${locale === 'el' ? ',' : '.'}8 · 10^10`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>8.000.000.000 ＝ 8 · 10<sup>9</sup>.</span>
        </span>
      )
    };
  },
  // 7. Πληροφορική: Χωρητικότητα σκληρού δίσκου
  (locale) => {
    const numDisplay = locale === 'el' ? '2.000.000.000.000 bytes' : '2,000,000,000,000 bytes';
    const correct = '2 · 10^12';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένας δίσκος 2 TB περιέχει <strong className="font-mono text-amber-700">{numDisplay}</strong>. Πώς εκφράζεται σε τυποποιημένη μορφή;</>
          ) : (
            <>A 2 TB drive holds <strong className="font-mono text-amber-700">{numDisplay}</strong>. How is it written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['2 · 10^9', '20 · 10^11', '2 · 10^12', '2 · 10^15']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2.000.000.000.000 ＝ 2 · 10<sup>12</sup> bytes.</span>
        </span>
      )
    };
  },
  // 8. Αστρονομία: Χρόνος ταξιδιού φωτός (Input)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Απόσταση' : 'Distance'}</span>
          <span className="font-mono inline-flex items-center gap-0.5">1{decSep}5 · <Power base={10} exp={11} /> m</span>
          <span>{locale === 'el' ? 'και ταχύτητα' : 'and speed'}</span>
          <span className="font-mono inline-flex items-center gap-0.5">3 · <Power base={10} exp={8} /> m/s</span>.
          <span>{locale === 'el' ? 'Υπολόγισε το πηλίκο σε δευτερόλεπτα:' : 'Calculate the quotient in seconds:'}</span>
        </span>
      ),
      correct: '500',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(1{decSep}5 : 3) · 10<sup>11 － 8</sup> ＝ 0{decSep}5 · 10<sup>3</sup> ＝ 500 s.</span>
        </span>
      )
    };
  },
  // 9. Οικολογία: Σταγόνες νερού σε πισίνα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const numDisplay = locale === 'el' ? '1.200.000.000 σταγόνες' : '1,200,000,000 drops';
    const correct = `1${decSep}2 · 10^9`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Μία πισίνα περιέχει <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>A pool contains <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `1${decSep}2 · 10^8`,
        `12 · 10^8`,
        `1${decSep}2 · 10^9`,
        `0${decSep}12 · 10^10`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1.200.000.000 ＝ 1{decSep}2 · 10<sup>9</sup>.</span>
        </span>
      )
    };
  },
  // 10. Μικροβιολογία: Πληθυσμός βακτηρίων μετά από πολλαπλασιασμό
  (locale) => {
    const correct = '4 · 10^8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Καλλιέργεια με' : 'Culture with'}</span>
          <span className="font-mono inline-flex items-center gap-0.5">2 · <Power base={10} exp={5} /></span>
          <span>{locale === 'el' ? 'βακτήρια/ml σε δοχείο' : 'bacteria/ml in a container of'}</span>
          <span className="font-mono inline-flex items-center gap-0.5">2 · <Power base={10} exp={3} /> ml</span>.
          <span>{locale === 'el' ? 'Πόσα είναι συνολικά τα βακτήρια;' : 'What is the total number of bacteria?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['4 · 10^15', '4 · 10^8', '2 · 10^8', '4 · 10^2']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(2 · 10<sup>5</sup>) · (2 · 10<sup>3</sup>) ＝ 4 · 10<sup>5 ＋ 3</sup> ＝ 4 · 10<sup>8</sup>.</span>
        </span>
      )
    };
  },
  // 11. Φυσική: Μάζα της Γης
  (locale) => {
    const correct = '6 · 10^24';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η μάζα της Γης είναι 6 ακολουθούμενο από 24 μηδενικά σε kg. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>Earth mass is 6 followed by 24 zeros in kg. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['6 · 10^21', '6 · 10^23', '6 · 10^24', '60 · 10^23']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? '6 ακολουθούμενο από 24 μηδενικά ＝' : '6 followed by 24 zeros ＝'}</span>
          <span>6 · 10<sup>24</sup> kg.</span>
        </span>
      )
    };
  },
  // 12. Χημεία: Διάμετρος ατόμου
  (locale) => {
    const correct = '1 · 10^-10';
    const numDisplay = locale === 'el' ? '0,0000000001 μέτρα' : '0.0000000001 meters';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η διάμετρος ατόμου υδρογόνου είναι <strong className="font-mono text-amber-700">{numDisplay}</strong>. Πώς γράφεται σε τυποποιημένη μορφή;</>
          ) : (
            <>The diameter of a hydrogen atom is <strong className="font-mono text-amber-700">{numDisplay}</strong>. How is it written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '1 · 10^-9',
        '1 · 10^-11',
        '1 · 10^-10',
        `0${locale === 'el' ? ',' : '.'}1 · 10^-9`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0,0000000001 m ＝ 1 · 10<sup>(－10)</sup> m.</span>
        </span>
      )
    };
  },
  // 13. Οικονομία: Εθνικό χρέος
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `3${decSep}5 · 10^11`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το χρέος μιας χώρας είναι <strong className="font-mono text-amber-700">350 δισεκατομμύρια €</strong>. Ποια είναι η τυποποιημένη μορφή σε €;</>
          ) : (
            <>A country debt is <strong className="font-mono text-amber-700">350 billion €</strong>. What is its scientific notation in €?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `3${decSep}5 · 10^9`,
        `35 · 10^10`,
        `3${decSep}5 · 10^11`,
        `3${decSep}5 · 10^12`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>350 · 10<sup>9</sup> ＝ 3{decSep}5 · 10<sup>11</sup> €.</span>
        </span>
      )
    };
  },
  // 14. Αστρονομία: Έτος φωτός
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const numDisplay = locale === 'el' ? '9.460.000.000.000 km' : '9,460,000,000,000 km';
    const correct = `9${decSep}46 · 10^12`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα έτος φωτός ισούται με <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή σε km;</>
          ) : (
            <>One light year equals <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation in km?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `9${decSep}46 · 10^9`,
        `9${decSep}46 · 10^11`,
        `9${decSep}46 · 10^12`,
        `94${decSep}6 · 10^11`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>9.460.000.000.000 ＝ 9{decSep}46 · 10<sup>12</sup> km.</span>
        </span>
      )
    };
  },
  // 15. Μικροηλεκτρονική: Μέγεθος transistor
  (locale) => {
    const correct = '3 · 10^-9';
    const numDisplay = locale === 'el' ? '3 nm (0,000000003 m)' : '3 nm (0.000000003 m)';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Επεξεργαστής έχει transistors μεγέθους <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή σε m;</>
          ) : (
            <>Processor has transistors sized <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation in m?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        '3 · 10^-8',
        '3 · 10^-9',
        '3 · 10^-10',
        `0${locale === 'el' ? ',' : '.'}3 · 10^-8`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>0,000000003 m ＝ 3 · 10<sup>(－9)</sup> m.</span>
        </span>
      )
    };
  },
  // 16. Ιατρική: Αριθμός κυττάρων στο ανθρώπινο σώμα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const numDisplay = locale === 'el' ? '37 τρισεκατομμύρια' : '37 trillion';
    const correct = `3${decSep}7 · 10^13`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το ανθρώπινο σώμα αποτελείται από περίπου <strong className="font-mono text-amber-700">{numDisplay}</strong> κύτταρα. Πώς γράφεται σε τυποποιημένη μορφή;</>
          ) : (
            <>The human body consists of about <strong className="font-mono text-amber-700">{numDisplay}</strong> cells. How is it written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `3${decSep}7 · 10^12`,
        `3${decSep}7 · 10^13`,
        `37 · 10^12`,
        `0${decSep}37 · 10^14`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>37 · 10<sup>12</sup> ＝ 3{decSep}7 · 10<sup>13</sup>.</span>
        </span>
      )
    };
  },
  // 17. Ενέργεια: Παραγωγή ηλιακής ενέργειας (Input)
  (locale) => {
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Πάρκο παράγει' : 'Solar park generates'}</span>
          <span className="font-mono inline-flex items-center gap-0.5">4 · <Power base={10} exp={6} /> W/ημέρα</span>
          <span>{locale === 'el' ? 'επί 200 ημέρες (' : 'for 200 days ('}</span>
          <span className="font-mono inline-flex items-center gap-0.5">2 · <Power base={10} exp={2} /></span>
          <span>{locale === 'el' ? '). Στο γινόμενο ' : '). In the product '}</span>
          <strong className="font-mono text-amber-700 inline-flex items-center gap-0.5">8 · <Power base={10} exp={locale === 'el' ? 'κ' : 'k'} /> W</strong>,
          <span>{locale === 'el' ? 'ποιος είναι ο εκθέτης;' : 'what is the exponent?'}</span>
        </span>
      ),
      correct: '8',
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>(4 · 10<sup>6</sup>) · (2 · 10<sup>2</sup>) ＝ 8 · 10<sup>6 ＋ 2</sup> ＝ 8 · 10<sup>8</sup>.</span>
          <span className="font-sans">{locale === 'el' ? 'Άρα κ ＝ 8.' : 'So k ＝ 8.'}</span>
        </span>
      )
    };
  },
  // 18. Ωκεανογραφία: Όγκος νερού ωκεανών
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const numDisplay = locale === 'el' ? '1.300.000.000 km³' : '1,300,000,000 km³';
    const correct = `1${decSep}3 · 10^9`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ο όγκος νερού στους ωκεανούς είναι <strong className="font-mono text-amber-700">{numDisplay}</strong>. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>The volume of ocean water is <strong className="font-mono text-amber-700">{numDisplay}</strong>. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `1${decSep}3 · 10^8`,
        `13 · 10^8`,
        `1${decSep}3 · 10^9`,
        `1${decSep}3 · 10^10`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1.300.000.000 ＝ 1{decSep}3 · 10<sup>9</sup> km³.</span>
        </span>
      )
    };
  },
  // 19. Γεωλογία: Ηλικία της Γης
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const numDisplay = locale === 'el' ? '4,5 δισεκατομμύρια χρόνια' : '4.5 billion years';
    const correct = `4${decSep}5 · 10^9`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η ηλικία της Γης εκτιμάται σε <strong className="font-mono text-amber-700">{numDisplay}</strong>. Πώς γράφεται σε τυποποιημένη μορφή;</>
          ) : (
            <>Earth age is estimated at <strong className="font-mono text-amber-700">{numDisplay}</strong>. How is it written in scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `4${decSep}5 · 10^6`,
        `45 · 10^8`,
        `4${decSep}5 · 10^9`,
        `4${decSep}5 · 10^12`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>4{decSep}5 {locale === 'el' ? 'δις' : 'billion'} ＝ 4{decSep}5 · 10<sup>9</sup> {locale === 'el' ? 'έτη' : 'years'}.</span>
        </span>
      )
    };
  },
  // 20. Ατμοσφαιρική πίεση: Μόρια σε έναν όγκο αέρα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `2${decSep}5 · 10^19`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Σε 1 cm³ αέρα υπάρχουν 25 ακολουθούμενο από 18 μηδενικά μόρια. Ποια είναι η τυποποιημένη μορφή;</>
          ) : (
            <>In 1 cm³ of air there are 25 followed by 18 zeros molecules. What is its scientific notation?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `2${decSep}5 · 10^18`,
        `25 · 10^18`,
        `2${decSep}5 · 10^19`,
        `2${decSep}5 · 10^20`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>25 · 10<sup>18</sup> ＝ 2{decSep}5 · 10<sup>19</sup> {locale === 'el' ? 'μόρια' : 'molecules'}.</span>
        </span>
      )
    };
  }
];

export default function TipopoiimeniMorfiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Τυποποιημένη Μορφή | Β' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις υπολογισμών, μετατροπών και ρεαλιστικών προβλημάτων στην τυποποιημένη μορφή ρητών αριθμών.",
      backText: "ΘΕΩΡΙΑ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 2",
      badgeCount: "12 ΑΣΚΗΣΕΙΣ",
      headerTitle: "ΕΞΑΣΚΗΣΗ: ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ ΡΗΤΩΝ",
      headerDesc: "Εξασκήσου στην αναγνώριση, μετατροπή και τις πράξεις αριθμών σε τυποποιημένη μορφή, καθώς και σε πραγματικές εφαρμογές στις φυσικές επιστήμες.",
      writeAnswerLabel: "ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:",
      inputPlaceholder: "π.χ. 35000 ή 0,004 ή 6",
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
      pageTitle: "Exercises: Scientific Notation | Grade 8",
      pageDesc: "12 dynamic exercises covering calculations, conversions, and real-world problems in scientific notation of rational numbers.",
      backText: "THEORY",
      badgeUnit: "GRADE 8 • UNIT 2",
      badgeCount: "12 EXERCISES",
      headerTitle: "PRACTICE: SCIENTIFIC NOTATION OF RATIONALS",
      headerDesc: "Practice identification, conversion, and arithmetic with scientific notation, as well as real applications across science.",
      writeAnswerLabel: "ENTER YOUR ANSWER:",
      inputPlaceholder: "e.g. 35000 or 0.004 or 6",
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
    // Sanitization: επιτρέπονται μόνο αριθμοί, κόμμα, τελεία, μείον, δύναμη
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

  // Βοηθητική μέθοδος για εμφάνιση κλασμάτων ή δυνάμεων στα κουμπιά επιλογών
  const renderOptionContent = (opt) => {
    if (typeof opt === 'string' && opt.includes('/')) {
      const parts = opt.split('/');
      return <Frac num={parts[0]} den={parts[1]} />;
    }
    return renderMathText(opt);
  };

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou/02-tipopoiimeni-morfi"
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