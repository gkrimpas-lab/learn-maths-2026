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

// Εμφάνιση κλασμάτων ή ριζών στα κουμπιά επιλογών
const renderOptionContent = (opt) => {
  if (typeof opt === 'string' && opt.includes('/') && !opt.includes(' ') && !opt.includes('(')) {
    const parts = opt.split('/');
    if (parts.length === 2) {
      return <Frac num={parts[0]} den={parts[1]} />;
    }
  }
  if (typeof opt === 'string' && opt.startsWith('√')) {
    return <Sqrt>{opt.replace('√', '')}</Sqrt>;
  }
  return opt;
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Εύρεση περιόδου απλού κλάσματος
  (locale) => {
    const correct = '3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η περίοδος του δεκαδικού αριθμού που προκύπτει από το κλάσμα' : 'What is the period of the decimal from fraction'}</span>
          <Frac num="1" den="3" />
          <span>{locale === 'el' ? ';' : '?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '0', '33', locale === 'el' ? 'Δεν έχει περίοδο' : 'No period']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1 : 3 ＝ {locale === 'el' ? '0,3333...' : '0.3333...'}</span>
          <span className="font-sans">
            {locale === 'el'
              ? 'Το ψηφίο που επαναλαμβάνεται επ\' άπειρον είναι το 3, άρα η περίοδος είναι 3.'
              : 'The digit repeating endlessly is 3, so the period is 3.'}
          </span>
        </span>
      )
    };
  },
  // 2. Διάκριση καθαρού και μικτού περιοδικού
  (locale) => {
    const correct = locale === 'el' ? 'Μικτός περιοδικός' : 'Mixed periodic';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΤΑΞΙΝΟΜΗΣΗ' : 'CLASSIFICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο αριθμός' : 'The number'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg font-mono">
            {locale === 'el' ? '0,1666... ＝ 0,1' : '0.1666... ＝ 0.1'}<span className="border-t-2 border-indigo-700 pt-0.5">6</span>
          </strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Καθαρός περιοδικός' : 'Pure periodic',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number'
      ]),
      hint: locale === 'el'
        ? 'Επειδή μετά την υποδιαστολή υπάρχει το μη περιοδικό ψηφίο 1 πριν την περίοδο 6, ο αριθμός ονομάζεται μικτός περιοδικός.'
        : 'Because after the decimal point there is the non-repeating digit 1 before the period 6, it is a mixed periodic decimal.'
    };
  },
  // 3. Πρόβλεψη πεπερασμένου δεκαδικού από τον παρονομαστή
  (locale) => {
    const correct = '3/8';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιο από τα παρακάτω ανάγωγα κλάσματα δίνει <strong>πεπερασμένο</strong> δεκαδικό αριθμό;</>
          ) : (
            <>Which of the following irreducible fractions yields a <strong>terminating</strong> decimal?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/3', '2/7', '5/6']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>
            {locale === 'el'
              ? 'Ο παρονομαστής 8 αναλύεται σε 2³. Όταν περιέχει μόνο παράγοντες 2 ή 5, δίνει πεπερασμένο δεκαδικό:'
              : 'Denominator 8 factors into 2³. Containing only factors of 2 or 5, it yields a terminating decimal:'}
          </span>
          <span className="font-mono"><Frac num="3" den="8" /> ＝ {locale === 'el' ? '0,375' : '0.375'}.</span>
        </span>
      )
    };
  },
  // 4. Εύρεση μη περιοδικού μέρους
  (locale) => {
    const correct = '8';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Στον αριθμό' : 'In the number'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg font-mono">
            {locale === 'el' ? '0,8333... ＝ 0,8' : '0.8333... ＝ 0.8'}<span className="border-t-2 border-indigo-700 pt-0.5">3</span>
          </strong>,
          <span>{locale === 'el' ? 'ποιο ψηφίο αποτελεί το μη περιοδικό μέρος;' : 'which digit is the non-periodic part?'}</span>
        </span>
      ),
      correct,
      hint: locale === 'el'
        ? 'Το ψηφίο 8 βρίσκεται μεταξύ της υποδιαστολής και της περιόδου (3) και δεν επαναλαμβάνεται.'
        : 'The digit 8 is between the decimal separator and the period (3) and does not repeat.'
    };
  },
  // 5. Αναγνώριση άρρητου αριθμού
  (locale) => {
    const correct = '√3';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΡΡΗΤΟΙ' : 'IRRATIONALS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος από τους παρακάτω αριθμούς είναι <strong>άρρητος</strong>;</>
          ) : (
            <>Which of the following numbers is <strong>irrational</strong>?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['√4', '3/5', locale === 'el' ? '0,777...' : '0.777...']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Το 3 δεν είναι τέλειο τετράγωνο, οπότε το' : '3 is not a perfect square, so'}</span>
          <Sqrt>3</Sqrt>
          <span>
            {locale === 'el'
              ? 'έχει άπειρα δεκαδικά ψηφία χωρίς περίοδο. Αντίθετα,'
              : 'has infinite non-repeating digits. By contrast,'}
          </span>
          <span className="font-mono"><Sqrt>4</Sqrt> ＝ 2</span>
          <span>({locale === 'el' ? 'ρητός' : 'rational'}).</span>
        </span>
      )
    };
  },
  // 6. Περίοδος του κλάσματος 1/7
  (locale) => {
    const correct = '142857';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η περίοδος του κλάσματος' : 'The period of fraction'}</span>
          <Frac num="1" den="7" />
          <span>{locale === 'el' ? 'αποτελείται από την ομάδα ψηφίων:' : 'consists of the digits:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '142', '7', '2857']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1 : 7 ＝ {locale === 'el' ? '0,142857142857...' : '0.142857142857...'}</span>
          <span className="font-sans">
            {locale === 'el'
              ? 'Η περίοδος έχει μήκος 6 ψηφία: 142857.'
              : 'The repeating period has length 6: 142857.'}
          </span>
        </span>
      )
    };
  },
  // 7. Έλεγχος ρίζας τέλειου τετραγώνου
  (locale) => {
    const correct = locale === 'el' ? 'ΡΗΤΟΣ' : 'RATIONAL';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΤΑΞΙΝΟΜΗΣΗ' : 'CLASSIFICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο αριθμός' : 'The number'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center"><Sqrt>49</Sqrt></strong>
          <span>{locale === 'el' ? 'είναι ρητός ή άρρητος;' : 'is rational or irrational?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'ΑΡΡΗΤΟΣ' : 'IRRATIONAL',
        locale === 'el' ? 'ΟΥΤΕ ΡΗΤΟΣ ΟΥΤΕ ΑΡΡΗΤΟΣ' : 'NEITHER',
        locale === 'el' ? 'ΜΟΝΟ ΦΑΝΤΑΣΤΙΚΟΣ' : 'IMAGINARY'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">{locale === 'el' ? 'Επειδή' : 'Since'}</span>
          <Sqrt>49</Sqrt>
          <span>＝ 7 ＝ <Frac num="7" den="1" /></span>
          <span>,</span>
          <span className="font-sans">
            {locale === 'el'
              ? 'γράφεται ως κλάσμα ακεραίων, άρα είναι ρητός αριθμός.'
              : 'it can be expressed as a ratio of integers, so it is rational.'}
          </span>
        </span>
      )
    };
  },
  // 8. Ο αριθμός π (pi)
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο αριθμός' : 'The number'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg font-serif">
            π ≈ {locale === 'el' ? '3,14159...' : '3.14159...'}
          </strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Περιοδικός δεκαδικός' : 'Periodic decimal',
        locale === 'el' ? 'Φυσικός αριθμός' : 'Natural number'
      ]),
      hint: locale === 'el'
        ? 'Ο αριθμός π έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο και δεν μπορεί να εκφραστεί ακριβώς ως κλάσμα δύο ακεραίων.'
        : 'Number π has infinitely many non-repeating digits and cannot be represented as a fraction of integers.'
    };
  },
  // 9. Μετατροπή απλού κλάσματος σε δεκαδικό (Input)
  (locale) => {
    const correct = locale === 'el' ? '0,25' : '0.25';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Γράψε σε δεκαδική μορφή το κλάσμα' : 'Write in decimal form the fraction'}</span>
          <Frac num="1" den="4" />:
        </span>
      ),
      correct,
      hint: `1 : 4 ＝ ${correct} (${locale === 'el' ? 'πεπερασμένος δεκαδικός' : 'terminating decimal'}).`
    };
  },
  // 10. Αναγνώριση καθαρού περιοδικού
  (locale) => {
    const correct = locale === 'el' ? '0,555...' : '0.555...';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος από τους παρακάτω αριθμούς είναι <strong>καθαρός (απλός) περιοδικός</strong>;</>
          ) : (
            <>Which of the following numbers is a <strong>pure periodic decimal</strong>?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? '0,1555...' : '0.1555...',
        locale === 'el' ? '1,02333...' : '1.02333...',
        locale === 'el' ? '0,75' : '0.75'
      ]),
      hint: locale === 'el'
        ? 'Στο 0,555... η περίοδος (5) ξεκινά αμέσως μετά την υποδιαστολή, χωρίς να μεσολαβεί μη περιοδικό ψηφίο.'
        : 'In 0.555... the period (5) begins immediately after the decimal point without any non-repeating digits.'
    };
  },
  // 11. Παρονομαστής που περιέχει το 3
  (locale) => {
    const correct = locale === 'el' ? 'Άπειρος περιοδικός δεκαδικός' : 'Infinite periodic decimal';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Το ανάγωγο κλάσμα' : 'The irreducible fraction'}</span>
          <Frac num="7" den="15" />
          <span>{locale === 'el' ? 'δίνει:' : 'yields:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Πεπερασμένο δεκαδικό' : 'Terminating decimal',
        locale === 'el' ? 'Άρρητο αριθμό' : 'Irrational number',
        locale === 'el' ? 'Ακέραιο αριθμό' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>
            {locale === 'el'
              ? 'Ο παρονομαστής είναι 15 ＝ 3 · 5. Επειδή περιέχει τον πρώτο παράγοντα 3:'
              : 'Denominator is 15 ＝ 3 · 5. Since it contains prime factor 3:'}
          </span>
          <span className="font-mono"><Frac num="7" den="15" /> ＝ {locale === 'el' ? '0,4666...' : '0.4666...'}</span>
          <span>({locale === 'el' ? 'μικτός περιοδικός' : 'mixed periodic'}).</span>
        </span>
      )
    };
  },
  // 12. Αριθμός με κανόνα αλλά χωρίς περίοδο
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    const numDisplay = locale === 'el' ? '0,1010010001...' : '0.1010010001...';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΡΡΗΤΟΙ' : 'IRRATIONALS',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ο αριθμός <strong className="text-indigo-700 text-base sm:text-lg font-mono">{numDisplay}</strong> (τα μηδενικά αυξάνονται κατά ένα) είναι:</>
          ) : (
            <>The number <strong className="text-indigo-700 text-base sm:text-lg font-mono">{numDisplay}</strong> (zeros increase by one) is:</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Περιοδικός δεκαδικός' : 'Periodic decimal',
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal'
      ]),
      hint: locale === 'el'
        ? 'Παρόλο που υπάρχει κανόνας σχηματισμού, καμία σταθερή ομάδα ψηφίων δεν επαναλαμβάνεται περιοδικά, άρα είναι άρρητος.'
        : 'Although there is a pattern, no fixed group of digits repeats endlessly, so it is irrational.'
    };
  },
  // 13. Πραγματικοί αριθμοί (Θεωρία)
  (locale) => {
    const correct = locale === 'el' ? 'Όλοι οι ρητοί και όλοι οι άρρητοι αριθμοί μαζί' : 'All rational and irrational numbers combined';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Το σύνολο των <strong>Πραγματικών Αριθμών (ℝ)</strong> αποτελείται από:</>
          ) : (
            <>The set of <strong>Real Numbers (ℝ)</strong> consists of:</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Μόνο τους θετικούς ρητούς αριθμούς' : 'Only positive rational numbers',
        locale === 'el' ? 'Μόνο τους ακέραιους αριθμούς' : 'Only integer numbers',
        locale === 'el' ? 'Μόνο τους αριθμούς που γράφονται σε κλάσμα' : 'Only fraction-representable numbers'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span className="font-mono">ℝ ＝ ℚ ∪ {locale === 'el' ? 'Άρρητοι' : 'Irrationals'}.</span>
          <span>
            {locale === 'el'
              ? 'Κάθε σημείο στον άξονα των αριθμών αντιστοιχεί σε έναν πραγματικό αριθμό.'
              : 'Every point on the number line represents a unique real number.'}
          </span>
        </span>
      )
    };
  },
  // 14. Περίοδος του κλάσματος 2/11 (Input)
  (locale) => {
    const correct = '18';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποια είναι η περίοδος του κλάσματος' : 'What is the period of fraction'}</span>
          <Frac num="2" den="11" />
          <span>({locale === 'el' ? 'γράψε τα ψηφία' : 'enter digits'})</span>:
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 : 11 ＝ {locale === 'el' ? '0,181818...' : '0.181818...'}</span>
          <span className="font-sans">
            {locale === 'el' ? 'Η ομάδα ψηφίων που επαναλαμβάνεται είναι το 18.' : 'The repeating block is 18.'}
          </span>
        </span>
      )
    };
  },
  // 15. Έλεγχος ρίζας μη τέλειου τετραγώνου
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΑΡΡΗΤΟΙ' : 'IRRATIONALS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο αριθμός' : 'The number'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center"><Sqrt>10</Sqrt></strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Περιοδικός δεκαδικός' : 'Periodic decimal'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Το 10 δεν είναι τέλειο τετράγωνο' : '10 is not a perfect square'}</span>
          <span className="font-mono">(3<sup>2</sup> ＝ 9, 4<sup>2</sup> ＝ 16)</span>
          <span>{locale === 'el' ? ', επομένως το' : ', hence'}</span>
          <Sqrt>10</Sqrt>
          <span>{locale === 'el' ? 'είναι άρρητος αριθμός.' : 'is an irrational number.'}</span>
        </span>
      )
    };
  },
  // 16. Κλάσμα που δίνει ακέραιο
  (locale) => {
    const correct = locale === 'el' ? 'Ρητός αριθμός' : 'Rational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΤΑΞΙΝΟΜΗΣΗ' : 'CLASSIFICATION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο ακέραιος αριθμός' : 'The integer'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg font-mono">－5</strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number',
        locale === 'el' ? 'Μόνο φυσικός αριθμός' : 'Only a natural number',
        locale === 'el' ? 'Δεν ανήκει στους πραγματικούς' : 'Not in real numbers'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span className="font-sans">
            {locale === 'el'
              ? 'Κάθε ακέραιος μπορεί να γραφτεί ως κλάσμα με παρονομαστή 1:'
              : 'Every integer can be written as a fraction with denominator 1:'}
          </span>
          <span>－5 ＝ <Frac num="-5" den="1" /></span>
          <span className="font-sans">({locale === 'el' ? 'άρα ρητός' : 'so rational'}).</span>
        </span>
      )
    };
  },
  // 17. Πλήθος ψηφίων περιόδου
  (locale) => {
    const correct = '2';
    const numDisplay = locale === 'el' ? '3,14252525...' : '3.14252525...';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΕΡΙΟΔΙΚΟΙ' : 'PERIODIC',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσα ψηφία έχει η περίοδος του αριθμού <strong className="text-indigo-700 text-base sm:text-lg font-mono">{numDisplay}</strong>;</>
          ) : (
            <>How many digits does the period of <strong className="text-indigo-700 text-base sm:text-lg font-mono">{numDisplay}</strong> have?</>
          )}
        </span>
      ),
      correct,
      hint: locale === 'el'
        ? 'Η περίοδος είναι το "25", δηλαδή αποτελείται από 2 ψηφία.'
        : 'The period is "25", which consists of 2 digits.'
    };
  },
  // 18. Άθροισμα ρητού και άρρητου
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ' : 'PROPERTIES',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Το αποτέλεσμα της πράξης' : 'The result of'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg inline-flex items-center gap-1">
            1 ＋ <Sqrt>2</Sqrt>
          </strong>
          <span>{locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: locale === 'el'
        ? 'Το άθροισμα ενός ρητού και ενός άρρητου αριθμού είναι πάντοτε άρρητος αριθμός.'
        : 'The sum of a rational and an irrational number is always irrational.'
    };
  },
  // 19. Ισοδυναμία κλάσματος και περιοδικού
  (locale) => {
    const correct = '2/3';
    const numDisplay = locale === 'el' ? '0,666...' : '0.666...';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ' : 'CONVERSION',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ποιο κλάσμα αντιστοιχεί στον αριθμό' : 'Which fraction corresponds to'}</span>
          <strong className="text-indigo-700 text-base sm:text-lg font-mono">{numDisplay}</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3/5', '6/10', '1/3', '6/7']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 : 3 ＝ {locale === 'el' ? '0,6666...' : '0.6666...'}</span>
          <span className="font-sans">{locale === 'el' ? 'Άρα:' : 'Thus:'}</span>
          <span>{numDisplay} ＝ <Frac num="2" den="3" />.</span>
        </span>
      )
    };
  },
  // 20. Ανάλυση παρονομαστή για 1/20
  (locale) => {
    const correct = locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΚΛΑΣΜΑΤΑ' : 'FRACTIONS',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Χωρίς διαίρεση, τι είδους δεκαδικό δίνει το κλάσμα' : 'Without dividing, what decimal type does'}</span>
          <Frac num="1" den="20" />
          <span>{locale === 'el' ? ';' : 'give?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Άπειρο περιοδικό' : 'Infinite periodic',
        locale === 'el' ? 'Άρρητο αριθμό' : 'Irrational number',
        locale === 'el' ? 'Μικτό περιοδικό' : 'Mixed periodic'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>20 ＝ 2<sup>2</sup> · 5.</span>
          <span className="font-sans">
            {locale === 'el'
              ? 'Περιέχει αποκλειστικά πρώτους παράγοντες 2 και 5 ➔ πεπερασμένος ('
              : 'Factors are strictly 2 and 5 ➔ terminating ('}
          </span>
          <span><Frac num="1" den="20" /> ＝ {locale === 'el' ? '0,05' : '0.05'}).</span>
        </span>
      )
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Μοιρασιά λογαριασμού σε 3 άτομα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `3${decSep}33`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τρεις φίλοι μοιράζονται λογαριασμό 10€. Με ακρίβεια λεπτού (2 δεκαδικά), πόσα ευρώ αναλογούν στον καθένα (<strong className="font-mono text-amber-800">10/3 €</strong>);</>
          ) : (
            <>Three friends split a 10€ bill. Rounded to cents (2 decimals), how much does each pay (<strong className="font-mono text-amber-800">10/3 €</strong>);</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `3${decSep}30`,
        `3${decSep}50`,
        `3${decSep}34`,
        `3${decSep}00`
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>10 : 3 ＝ 3{decSep}333... € ➔ 3{decSep}33€.</span>
        </span>
      )
    };
  },
  // 2. Διαγώνιος τετράγωνης πλατείας
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η διαγώνιος τετράγωνης πλατείας πλευράς 1 m είναι' : 'The diagonal of a square plaza of side 1 m is'}</span>
          <strong className="font-mono text-amber-800 inline-flex items-center"><Sqrt>2</Sqrt> m</strong>.
          <span>{locale === 'el' ? 'Το μήκος αυτό εκφράζεται από:' : 'This length is expressed by:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Πεπερασμένο δεκαδικό αριθμό' : 'Terminating decimal',
        locale === 'el' ? 'Περιοδικό δεκαδικό αριθμό' : 'Periodic decimal',
        locale === 'el' ? 'Ακέραιο αριθμό' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Το' : 'The value'}</span>
          <Sqrt>2</Sqrt>
          <span>
            {locale === 'el'
              ? 'είναι άρρητος αριθμός (1,41421356... m). Δεν γράφεται ακριβώς ως κλάσμα.'
              : 'is irrational (1.41421356... m). It cannot be expressed as a fraction.'}
          </span>
        </span>
      )
    };
  },
  // 3. Μοίρασμα πίτσας σε 6 ίσα κομμάτια
  (locale) => {
    const correct = locale === 'el' ? 'Μικτός περιοδικός' : 'Mixed periodic';
    const decVal = locale === 'el' ? '0,1666...' : '0.1666...';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Κόβουμε πίτσα σε 6 ίσα κομμάτια. Το μέρος κάθε κομματιού είναι <strong className="font-mono text-amber-800">1/6 ＝ {decVal}</strong>. Τι είδους δεκαδικός είναι;</>
          ) : (
            <>Dividing a pizza into 6 slices gives <strong className="font-mono text-amber-800">1/6 ＝ {decVal}</strong> per slice. What decimal type is it?</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Καθαρός περιοδικός' : 'Pure periodic',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number'
      ]),
      hint: locale === 'el'
        ? 'Έχει μη περιοδικό ψηφίο το 1 και περίοδο το 6 ➔ μικτός περιοδικός.'
        : 'Non-periodic digit 1 and period 6 ➔ mixed periodic.'
    };
  },
  // 4. Υπολογισμός περιμέτρου κυκλικής λίμνης
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Κυκλική λίμνη έχει διάμετρο 10 m. Το ακριβές μήκος όχθης είναι <strong className="font-mono text-amber-800">10 · π m</strong>. Το μήκος αυτό είναι:</>
          ) : (
            <>A circular pond has diameter 10 m. Its exact shore length is <strong className="font-mono text-amber-800">10 · π m</strong>. This length is:</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal'
      ]),
      hint: locale === 'el'
        ? 'Επειδή το π είναι άρρητος, το γινόμενο 10 · π είναι επίσης άρρητος αριθμός.'
        : 'Since π is irrational, 10 · π is also irrational.'
    };
  },
  // 5. Διαίρεση υφάσματος σε 3 κομμάτια (Input)
  (locale) => {
    const correct = '6';
    const decVal = locale === 'el' ? '0,666...' : '0.666...';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ύφασμα 2 m κόβεται σε 3 ίσα μέρη (<strong className="font-mono text-amber-800">2/3 m</strong>). Ποιο είναι το ψηφίο της περιόδου στο μήκος ({decVal});</>
          ) : (
            <>Fabric of 2 m is cut into 3 equal parts (<strong className="font-mono text-amber-800">2/3 m</strong>). What is the repeating period digit ({decVal});</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>2 : 3 ＝ {locale === 'el' ? '0,6666...' : '0.6666...'}</span>
          <span className="font-sans">
            {locale === 'el' ? 'Το ψηφίο της περιόδου είναι το 6.' : 'The period digit is 6.'}
          </span>
        </span>
      )
    };
  },
  // 6. Σύρμα περίφραξης για τετράγωνο οικόπεδο εμβαδού 5 m²
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Η πλευρά οικοπέδου με εμβαδόν 5 m² είναι' : 'The side of a 5 m² square plot is'}</span>
          <strong className="font-mono text-amber-800 inline-flex items-center"><Sqrt>5</Sqrt> m</strong>.
          <span>{locale === 'el' ? 'Το μήκος αυτό είναι:' : 'This length is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Περιοδικός δεκαδικός' : 'Periodic decimal',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Επειδή το 5 δεν είναι τέλειο τετράγωνο, το' : 'Since 5 is not a perfect square,'}</span>
          <Sqrt>5</Sqrt>
          <span>{locale === 'el' ? 'είναι άρρητος αριθμός.' : 'is an irrational number.'}</span>
        </span>
      )
    };
  },
  // 7. Μοίρασμα χυμού 1 λίτρου σε 8 ποτήρια (Input)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `0${decSep}125`;
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Μοιράζουμε 1 L χυμό σε 8 ποτήρια (' : '1 L of juice is split into 8 glasses ('}</span>
          <Frac num="1" den="8" />
          <span>L). {locale === 'el' ? 'Γράψε σε δεκαδική μορφή τα L ανά ποτήρι:' : 'Write decimal L per glass:'}</span>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1 : 8 ＝ {correct} L</span>
          <span className="font-sans">({locale === 'el' ? 'πεπερασμένος' : 'terminating'}).</span>
        </span>
      )
    };
  },
  // 8. Χρόνος πτώσης σώματος (Φυσική)
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο χρόνος πτώσης πέτρας υπολογίζεται ως' : 'Fall time of a stone is'}</span>
          <strong className="font-mono text-amber-800 inline-flex items-center"><Sqrt>6</Sqrt> s</strong>.
          <span>{locale === 'el' ? 'Ο χρόνος αυτός ανήκει στους:' : 'This time belongs to:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητούς αριθμούς' : 'Rational numbers',
        locale === 'el' ? 'Περιοδικούς δεκαδικούς' : 'Periodic decimals',
        locale === 'el' ? 'Φυσικούς αριθμούς' : 'Natural numbers'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>{locale === 'el' ? 'Το' : 'The value'}</span>
          <Sqrt>6</Sqrt>
          <span>{locale === 'el' ? 'είναι άρρητος αριθμός διότι το 6 δεν είναι τέλειο τετράγωνο.' : 'is irrational because 6 is not a perfect square.'}</span>
        </span>
      )
    };
  },
  // 9. Καύσιμα ανά 100 χλμ (Κλάσμα με 3)
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `7${decSep}333...`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Αυτοκίνητο καίει 22 L σε 300 km (' : 'Car uses 22 L per 300 km ('}</span>
          <Frac num="22" den="3" />
          <span>L/100km). {locale === 'el' ? 'Η δεκαδική μορφή είναι:' : 'Decimal form is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `7${decSep}3`,
        `7${decSep}25`,
        `7${decSep}35`,
        `7${decSep}03`
      ]),
      hint: `22 : 3 ＝ 7${decSep}3333... L/100km.`
    };
  },
  // 10. Διανομή κέρδους εταιρείας σε 7 εταίρους
  (locale) => {
    const correct = locale === 'el' ? 'Άπειρος περιοδικός' : 'Infinite periodic';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Κέρδος μοιράζεται σε 7 εταίρους (' : 'Profit is split among 7 partners ('}</span>
          <Frac num="1" den="7" />
          <span>). {locale === 'el' ? 'Το μερίδιο καθενός ως δεκαδικός είναι:' : 'Each share as decimal is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-sans">
          <span>
            {locale === 'el'
              ? 'Επειδή ο παρονομαστής 7 είναι πρώτος διάφορος του 2 και του 5 ➔ άπειρος περιοδικός:'
              : 'Since denominator 7 is prime (other than 2 or 5) ➔ infinite periodic:'}
          </span>
          <span className="font-mono"><Frac num="1" den="7" /> ＝ {locale === 'el' ? '0,142857...' : '0.142857...'}</span>
        </span>
      )
    };
  },
  // 11. Πλευρά τετραγώνου με εμβαδόν 16 m² (Ρητό μέγεθος)
  (locale) => {
    const correct = '4';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Τετράγωνο δωμάτιο έχει εμβαδόν 16 m². Πόσα μέτρα είναι το μήκος της πλευράς του;</>
          ) : (
            <>A square room has area 16 m². What is its side length in meters?</>
          )}
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>{locale === 'el' ? 'α' : 'a'} ＝ <Sqrt>16</Sqrt> ＝ 4 m.</span>
        </span>
      )
    };
  },
  // 12. Μέτρηση με ανακριβή μεζούρα
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Σε ορθογώνιο τρίγωνο με κάθετες 1 m και 2 m, η υποτείνουσα είναι' : 'In right triangle with legs 1 m and 2 m, hypotenuse is'}</span>
          <strong className="font-mono text-amber-800 inline-flex items-center"><Sqrt>5</Sqrt> m</strong>.
          <span>{locale === 'el' ? 'Το ακριβές μήκος είναι:' : 'This exact length is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Περιοδικός δεκαδικός' : 'Periodic decimal',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <Sqrt>5</Sqrt>
          <span>＝ {locale === 'el' ? '2,23606...' : '2.23606...'}</span>
          <span className="font-sans">({locale === 'el' ? 'άρρητος' : 'irrational'}).</span>
        </span>
      )
    };
  },
  // 13. Μοίρασμα 5 κιλών αλευριού σε 4 σακούλες
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `1${decSep}25`;
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Σε φούρνο μοιράζουν 5 kg αλεύρι σε 4 σακούλες (' : 'A bakery divides 5 kg flour into 4 bags ('}</span>
          <Frac num="5" den="4" />
          <span>kg). {locale === 'el' ? 'Πόσα kg περιέχει κάθε σακούλα;' : 'How many kg per bag?'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        `1${decSep}20`,
        `1${decSep}50`,
        `1${decSep}33`,
        `1${decSep}24`
      ]),
      hint: `5 : 4 ＝ 1${decSep}25 kg.`
    };
  },
  // 14. Εύρεση περιόδου σε μοίρασμα κληρονομιάς
  (locale) => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Χωράφι χωρίζεται σε 9 μερίδια (' : 'Land divided into 9 plots ('}</span>
          <Frac num="1" den="9" />
          <span>). {locale === 'el' ? 'Ποια είναι η περίοδος του 0,1111...;' : 'What is the period of 0.1111...;'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9', '0', '11', locale === 'el' ? 'Δεν έχει περίοδο' : 'No period']),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>1 : 9 ＝ {locale === 'el' ? '0,1111...' : '0.1111...'}</span>
          <span className="font-sans">
            {locale === 'el' ? 'Περίοδος ＝ 1.' : 'Period ＝ 1.'}
          </span>
        </span>
      )
    };
  },
  // 15. Ταχύτητα φωτός και λόγοι
  (locale) => {
    const correct = locale === 'el' ? 'Ρητός αριθμός' : 'Rational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Σωματίδιο διανύει 7 m σε 8 s. Η μέση ταχύτητα' : 'Particle travels 7 m in 8 s. Speed'}</span>
          <Frac num="7" den="8" />
          <span>m/s {locale === 'el' ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number',
        locale === 'el' ? 'Μη πραγματικός αριθμός' : 'Non-real number',
        locale === 'el' ? 'Άπειρος περιοδικός' : 'Infinite periodic'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <Frac num="7" den="8" />
          <span>＝ {locale === 'el' ? '0,875' : '0.875'}</span>
          <span className="font-sans">({locale === 'el' ? 'πεπερασμένος, ρητός' : 'terminating, rational'}).</span>
        </span>
      )
    };
  },
  // 16. Περιφέρεια τροχού ποδηλάτου
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Η περιφέρεια τροχού ακτίνας R ＝ 1 m είναι <strong className="font-mono text-amber-800">2 · π m</strong>. Η τιμή αυτή εκφράζεται από:</>
          ) : (
            <>The circumference of a wheel with radius R ＝ 1 m is <strong className="font-mono text-amber-800">2 · π m</strong>. This value is:</>
          )}
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητό αριθμό' : 'Rational number',
        locale === 'el' ? 'Περιοδικό δεκαδικό αριθμό' : 'Periodic decimal',
        locale === 'el' ? 'Ακέραιο αριθμό' : 'Integer number'
      ]),
      hint: locale === 'el'
        ? 'Επειδή ο αριθμός π είναι άρρητος, το γινόμενο 2 · π είναι επίσης άρρητος.'
        : 'Since π is irrational, 2 · π is also irrational.'
    };
  },
  // 17. Μοίρασμα χρημάτων σε 11 παιδιά (Input)
  (locale) => {
    const correct = '45';
    const decVal = locale === 'el' ? '0,454545...' : '0.454545...';
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Μοιράζουμε 5€ σε 11 παιδιά (' : '5€ is split among 11 kids ('}</span>
          <Frac num="5" den="11" />
          <span>€). {locale === 'el' ? `Αν 5 : 11 ＝ ${decVal}, γράψε τα ψηφία περιόδου:` : `If 5 : 11 ＝ ${decVal}, enter period digits:`}</span>
        </span>
      ),
      correct,
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>5 : 11 ＝ {locale === 'el' ? '0,454545...' : '0.454545...'}</span>
          <span className="font-sans">
            {locale === 'el' ? 'Περίοδος ＝ 45.' : 'Period ＝ 45.'}
          </span>
        </span>
      )
    };
  },
  // 18. Κατασκευή τετράγωνης βάσης αγάλματος
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Τετράγωνη βάση έχει εμβαδόν 7 m² (πλευρά' : 'Square base has area 7 m² (side'}</span>
          <strong className="font-mono text-amber-800 inline-flex items-center"><Sqrt>7</Sqrt> m</strong>).
          <span>{locale === 'el' ? 'Το μήκος πλευράς είναι:' : 'The side length is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <Sqrt>7</Sqrt>
          <span>＝ {locale === 'el' ? '2,64575...' : '2.64575...'}</span>
          <span className="font-sans">({locale === 'el' ? 'άρρητος' : 'irrational'}).</span>
        </span>
      )
    };
  },
  // 19. Ποσοστό επιτυχίας σε διαγώνισμα
  (locale) => {
    const decSep = locale === 'el' ? ',' : '.';
    const correct = `0${decSep}85`;
    return {
      type: 'input',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Μαθητής απάντησε σε 17 από 20 ερωτήσεις (' : 'Student answered 17 of 20 ('}</span>
          <Frac num="17" den="20" />
          <span>). {locale === 'el' ? 'Γράψε το ποσοστό σε δεκαδικό:' : 'Write percentage as decimal:'}</span>
        </span>
      ),
      correct,
      hint: `17 : 20 ＝ ${correct} (85%).`
    };
  },
  // 20. Χρυσή τομή (φ) στην τέχνη
  (locale) => {
    const correct = locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number';
    return {
      type: 'mcq',
      badge: locale === 'el' ? 'ΠΡΟΒΛΗΜΑ' : 'PROBLEM',
      question: (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>{locale === 'el' ? 'Ο χρυσός λόγος δίνεται από τον τύπο' : 'The golden ratio formula is'}</span>
          <Frac num={<>1 ＋ <Sqrt>5</Sqrt></>} den="2" />.
          <span>{locale === 'el' ? 'Ο αριθμός αυτός είναι:' : 'This number is:'}</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        locale === 'el' ? 'Ρητός αριθμός' : 'Rational number',
        locale === 'el' ? 'Πεπερασμένος δεκαδικός' : 'Terminating decimal',
        locale === 'el' ? 'Ακέραιος αριθμός' : 'Integer number'
      ]),
      hint: (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          <span>φ ＝ </span>
          <Frac num={<>1 ＋ <Sqrt>5</Sqrt></>} den="2" />
          <span> ≈ {locale === 'el' ? '1,618033...' : '1.618033...'}</span>
          <span className="font-sans">({locale === 'el' ? 'άρρητος αριθμός' : 'irrational number'}).</span>
        </span>
      )
    };
  }
];

export default function RitoiArritoiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Ρητοί, Άρρητοι & Περιοδικοί Δεκαδικοί | Β' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις δεκαδικών αναπαραστάσεων, αναγνώρισης περιόδου, ρητών και άρρητων αριθμών.",
      backText: "ΘΕΩΡΙΑ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 5",
      badgeCount: "12 ΑΣΚΗΣΕΙΣ",
      headerTitle: "ΕΞΑΣΚΗΣΗ: ΡΗΤΟΙ, ΑΡΡΗΤΟΙ & ΠΕΡΙΟΔΙΚΟΙ ΑΡΙΘΜΟΙ",
      headerDesc: "Εξασκήσου στη δεκαδική αναπαράσταση των ρητών αριθμών, στην εύρεση περιόδου, στη διάκριση καθαρών και μικτών περιοδικών και στην αναγνώριση των άρρητων αριθμών.",
      writeAnswerLabel: "ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:",
      inputPlaceholder: "π.χ. 3 ή 0,25 ή 18",
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
      pageTitle: "Exercises: Rational, Irrational & Periodic Numbers | Grade 8",
      pageDesc: "12 dynamic exercises covering decimal representations, period detection, rational, and irrational numbers.",
      backText: "THEORY",
      badgeUnit: "GRADE 8 • UNIT 5",
      badgeCount: "12 EXERCISES",
      headerTitle: "PRACTICE: RATIONAL, IRRATIONAL & PERIODIC NUMBERS",
      headerDesc: "Practice decimal representations of rationals, finding periods, distinguishing pure vs mixed periodic decimals, and identifying irrationals.",
      writeAnswerLabel: "ENTER YOUR ANSWER:",
      inputPlaceholder: "e.g. 3 or 0.25 or 18",
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
      .replace(/[^0-9,\./\-\sA-Za-zΑ-Ωα-ωΆ-Ώά-ώ]/g, '')
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
      backUrl="/b-gymnasiou/05-ritoi-arritoi"
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
                        maxLength={15}
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