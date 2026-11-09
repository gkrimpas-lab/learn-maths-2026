import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Γ')/g);
  return parts
    .map((part) => {
      if (part === "Γ'") return "Γ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive & Overflow Safe
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 mx-0.5 ${className}`}>
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive & No-Horizontal-Scroll Safe
function Frac({ num, den, className = "" }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
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
  while (set.size < 4 && attempts < 60) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

// Helper για δυναμική απόδοση επιλογών (αν περιέχουν '/')
function renderOptionValue(opt) {
  if (typeof opt === 'string' && opt.includes('/') && !opt.includes(' ')) {
    const parts = opt.split('/');
    if (parts.length === 2) {
      return <Frac num={parts[0]} den={parts[1]} />;
    }
  }
  return opt;
}

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Μετατροπή απλού περιοδικού σε κλάσμα (6 σενάρια με i18n)
const PROBLEM_POOL_Q9 = [
  (locale) => {
    const d = randInt(1, 8);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια Μορφή Μονοψήφιου Απλού Περιοδικού' : 'Generating Form of Single-Digit Pure Repeating Decimal',
      prompt: isEl
        ? `Ποιο είναι το ισοδύναμο κλασματικό αποτέλεσμα του απλού περιοδικού δεκαδικού αριθμού 0,${d}${d}${d}... (δηλαδή 0,${d} με περίοδο το ${d});`
        : `What is the equivalent fraction of the pure repeating decimal 0.${d}${d}${d}... (i.e. 0.${d} with period ${d})?`,
      correct: `${d}/9`,
      type: 'mcq',
      distractors: () => [`${d}/10`, `${d}/99`, `${d}/8`][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Περίοδος', details: `${d} (1 ψηφίο)` },
        { label: 'Κανόνας παρονομαστή', details: '1 εννιάρι (9)' },
        { label: 'Γεννήτρια μορφή', details: <Frac num={d} den="9" /> }
      ] : [
        { label: 'Period', details: `${d} (1 digit)` },
        { label: 'Denominator rule', details: 'Single 9 (9)' },
        { label: 'Generating fraction', details: <Frac num={d} den="9" /> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Σε έναν απλό περιοδικό δεκαδικό με περίοδο ένα μόνο ψηφίο {d}, το κλάσμα έχει αριθμητή το {d} και παρονομαστή το 9:</span>
              <Frac num={d} den="9" />.
            </>
          ) : (
            <>
              <span>In a pure repeating decimal with a single-digit period {d}, the fraction has numerator {d} and denominator 9:</span>
              <Frac num={d} den="9" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const p = randInt(12, 85);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια Μορφή Διψήφιου Απλού Περιοδικού' : 'Generating Form of Two-Digit Pure Repeating Decimal',
      prompt: isEl
        ? `Ποιο κλάσμα αντιστοιχεί στον απλό περιοδικό δεκαδικό 0,${p}${p}${p}... (με περίοδο το ${p});`
        : `Which fraction corresponds to the pure repeating decimal 0.${p}${p}${p}... (with period ${p})?`,
      correct: `${p}/99`,
      type: 'mcq',
      distractors: () => [`${p}/100`, `${p}/9`, `${p}/990`][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Περίοδος', details: `${p} (2 ψηφία)` },
        { label: 'Παρονομαστής', details: 'Τόσα 9άρια όσα τα ψηφία της περιόδου (99)' },
        { label: 'Κλάσμα', details: <Frac num={p} den="99" /> }
      ] : [
        { label: 'Period', details: `${p} (2 digits)` },
        { label: 'Denominator', details: 'As many 9s as period digits (99)' },
        { label: 'Fraction', details: <Frac num={p} den="99" /> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Επειδή η περίοδος έχει 2 ψηφία ({p}), τοποθετούμε στον παρονομαστή τον αριθμό 99. Άρα το κλάσμα είναι</span>
              <Frac num={p} den="99" />.
            </>
          ) : (
            <>
              <span>Because the repeating period has 2 digits ({p}), the denominator is 99. Thus the fraction is</span>
              <Frac num={p} den="99" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const k = randInt(1, 4);
    const numRes = k * 9 + 7;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ακέραιο Μέρος και Απλός Περιοδικός' : 'Integer Part with Pure Repeating Decimal',
      prompt: isEl
        ? `Ποιο κλάσμα παριστάνει τον αριθμό ${k},777... (με ακέραιο μέρος ${k} και περίοδο 7);`
        : `Which fraction represents the number ${k}.777... (with integer part ${k} and period 7)?`,
      correct: `${numRes}/9`,
      type: 'mcq',
      distractors: () => [`${k * 10 + 7}/10`, `${numRes}/99`, `${k * 9}/9`][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        {
          label: 'Ανάλυση',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{k} ＋ 0,777... ＝ {k} ＋</span>
              <Frac num="7" den="9" />
            </span>
          )
        },
        {
          label: 'Ομώνυμα',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num={k * 9} den="9" />
              <span>＋</span>
              <Frac num="7" den="9" />
              <span>＝</span>
              <Frac num={numRes} den="9" />
            </span>
          )
        }
      ] : [
        {
          label: 'Decomposition',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{k} ＋ 0.777... ＝ {k} ＋</span>
              <Frac num="7" den="9" />
            </span>
          )
        },
        {
          label: 'Common denominator',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num={k * 9} den="9" />
              <span>＋</span>
              <Frac num="7" den="9" />
              <span>＝</span>
              <Frac num={numRes} den="9" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Γράφουμε τον αριθμό ως άθροισμα: {k} ＋</span>
              <Frac num="7" den="9" />
              <span>＝</span>
              <Frac num={`${k * 9} ＋ 7`} den="9" />
              <span>＝</span>
              <Frac num={numRes} den="9" />.
            </>
          ) : (
            <>
              <span>We express the number as a sum: {k} ＋</span>
              <Frac num="7" den="9" />
              <span>＝</span>
              <Frac num={`${k * 9} ＋ 7`} den="9" />
              <span>＝</span>
              <Frac num={numRes} den="9" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const d = randInt(101, 350);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Τριψήφια Περίοδος' : 'Three-Digit Period',
      prompt: isEl
        ? `Ποιος είναι ο παρονομαστής της γεννήτριας μορφής του απλού περιοδικού αριθμού 0,${d}${d}... (με περίοδο το ${d});`
        : `What is the denominator of the generating fraction for the pure repeating decimal 0.${d}${d}... (with period ${d})?`,
      correct: 999,
      type: 'input',
      tableData: isEl ? [
        { label: 'Περίοδος', details: `${d} (3 ψηφία)` },
        { label: 'Κανόνας παρονομαστή', details: '3 εννιάρια (999)' }
      ] : [
        { label: 'Period', details: `${d} (3 digits)` },
        { label: 'Denominator rule', details: '3 nines (999)' }
      ],
      explanation: isEl
        ? 'Για κάθε ψηφίο της περιόδου αντιστοιχεί ένα 9 στον παρονομαστή. Για τριψήφια περίοδο έχουμε τρία εννιάρια, δηλαδή 999.'
        : 'Each digit of the period corresponds to one 9 in the denominator. For a 3-digit period we get three nines: 999.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Η Περίπτωση του 0,999...' : 'The Case of 0.999...',
      prompt: isEl
        ? 'Σε ποιον ακέραιο αριθμό ισούται ακριβώς ο περιοδικός δεκαδικός αριθμός 0,999... (με περίοδο το 9);'
        : 'Which integer is the repeating decimal 0.999... (period 9) strictly equal to?',
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        { label: 'Κλασματική μορφή', details: <Frac num="9" den="9" /> },
        {
          label: 'Αποτέλεσμα διαίρεσης',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="9" den="9" />
              <span>＝ 1</span>
            </span>
          )
        }
      ] : [
        { label: 'Fractional form', details: <Frac num="9" den="9" /> },
        {
          label: 'Division result',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="9" den="9" />
              <span>＝ 1</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Σύμφωνα με τον κανόνα, 0,999... ＝</span>
              <Frac num="9" den="9" />
              <span>＝ 1. Ο αριθμός αυτός ισούται ακριβώς με τη μονάδα.</span>
            </>
          ) : (
            <>
              <span>Following the rule, 0.999... ＝</span>
              <Frac num="9" den="9" />
              <span>＝ 1. This number is strictly equal to 1.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const val = randInt(2, 5);
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Δεκαδικό Ανάπτυγμα Κλάσματος με Παρονομαστή 9' : 'Decimal Expansion with Denominator 9',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Αν το κλάσμα</span>
              <Frac num="1" den="9" />
              <span>ισούται με 0,111..., ποιο είναι το δεκαδικό ανάπτυγμα του κλάσματος</span>
              <Frac num={val} den="9" />
              <span>;</span>
            </>
          ) : (
            <>
              <span>If the fraction</span>
              <Frac num="1" den="9" />
              <span>equals 0.111..., what is the decimal expansion of</span>
              <Frac num={val} den="9" />
              <span>?</span>
            </>
          )}
        </span>
      ),
      correct: `0${dec}${val}${val}${val}...`,
      type: 'mcq',
      distractors: () => [
        `0${dec}0${val}${val}...`,
        `0${dec}${val}`,
        `0${dec}${val + 2}${val + 2}...`
      ][randInt(0, 2)],
      tableData: isEl ? [
        {
          label: 'Βασικό κλάσμα',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="9" />
              <span>＝ 0,111...</span>
            </span>
          )
        },
        {
          label: `Πολλαπλασιασμός επί ${val}`,
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{val} ·</span>
              <Frac num="1" den="9" />
              <span>＝ 0,${val}${val}${val}...</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Base fraction',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="9" />
              <span>＝ 0.111...</span>
            </span>
          )
        },
        {
          label: `Multiplied by ${val}`,
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{val} ·</span>
              <Frac num="1" den="9" />
              <span>＝ 0.${val}${val}${val}...</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Πολλαπλασιάζουμε το 0,111... με το ${val}, οπότε προκύπτει 0,${val}${val}${val}...`
        : `Multiply 0.111... by ${val}, yielding 0.${val}${val}${val}...`
    };
  }
];

// POOL Q10: Αναγνώριση είδους δεκαδικού από τον παρονομαστή (6 σενάρια με i18n)
const PROBLEM_POOL_Q10 = [
  (locale) => {
    const dens = [8, 16, 20, 25, 40, 50];
    const pickedDen = dens[randInt(0, dens.length - 1)];
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Έλεγχος Πεπερασμένου Δεκαδικού' : 'Checking for Terminating Decimal',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το ανάγωγο κλάσμα' : 'The irreducible fraction'}</span>
          <Frac num="7" den={pickedDen} />
          <span>{isEl ? 'μετατρέπεται σε:' : 'converts into:'}</span>
        </span>
      ),
      correct: isEl ? 'Πεπερασμένο (τερματιζόμενο) δεκαδικό' : 'Terminating decimal',
      type: 'mcq',
      distractors: () => isEl ? [
        'Απλό περιοδικό δεκαδικό',
        'Μικτό περιοδικό δεκαδικό',
        'Άρρητο αριθμό'
      ][randInt(0, 2)] : [
        'Pure repeating decimal',
        'Mixed repeating decimal',
        'Irrational number'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Παρονομαστής', details: `${pickedDen}` },
        { label: 'Πρώτοι παράγοντες', details: 'Περιέχει μόνο δυνάμεις του 2 ή/και του 5' },
        { label: 'Συμπέρασμα', details: 'Τερματίζεται (πεπερασμένος)' }
      ] : [
        { label: 'Denominator', details: `${pickedDen}` },
        { label: 'Prime factors', details: 'Contains only powers of 2 and/or 5' },
        { label: 'Conclusion', details: 'Terminating decimal' }
      ],
      explanation: isEl
        ? `Ο παρονομαστής ${pickedDen} αναλύεται αποκλειστικά σε γινόμενο των πρώτων παραγόντων 2 και 5. Συνεπώς, το δεκαδικό ανάπτυγμα είναι πεπερασμένο.`
        : `The denominator ${pickedDen} factors solely into prime factors 2 and 5. Thus, the decimal expansion is terminating.`
    };
  },
  (locale) => {
    const dens = [3, 7, 9, 11, 13];
    const pickedDen = dens[randInt(0, dens.length - 1)];
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Έλεγχος Περιοδικού Δεκαδικού' : 'Checking for Repeating Decimal',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το ανάγωγο κλάσμα' : 'The irreducible fraction'}</span>
          <Frac num="5" den={pickedDen} />
          <span>{isEl ? 'παράγει:' : 'produces:'}</span>
        </span>
      ),
      correct: isEl ? 'Περιοδικό δεκαδικό αριθμό' : 'Repeating decimal number',
      type: 'mcq',
      distractors: () => isEl ? [
        'Πεπερασμένο δεκαδικό αριθμό',
        'Ακέραιο αριθμό',
        'Μηδενικό αριθμό'
      ][randInt(0, 2)] : [
        'Terminating decimal number',
        'Integer number',
        'Zero'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Παρονομαστής', details: `${pickedDen}` },
        { label: 'Πρώτοι παράγοντες', details: `Περιέχει τον πρώτο αριθμό ${pickedDen} (διάφορο του 2 και του 5)` },
        { label: 'Συμπέρασμα', details: 'Άπειρα περιοδικά ψηφία' }
      ] : [
        { label: 'Denominator', details: `${pickedDen}` },
        { label: 'Prime factors', details: `Contains prime factor ${pickedDen} (different from 2 and 5)` },
        { label: 'Conclusion', details: 'Infinite repeating digits' }
      ],
      explanation: isEl
        ? `Εφόσον ο παρονομαστής περιέχει πρώτο παράγοντα διάφορο του 2 και του 5 (εδώ το ${pickedDen}), η διαίρεση δεν τελειώνει ποτέ και δίνει περιοδικό δεκαδικό.`
        : `Since the denominator contains a prime factor other than 2 or 5 (${pickedDen}), the division never terminates and yields a repeating decimal.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση πριν την Ταξινόμηση' : 'Simplification Prior to Classification',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το κλάσμα' : 'Does the fraction'}</span>
          <Frac num="21" den="30" />
          <span>{isEl ? 'μετατρέπεται σε πεπερασμένο ή περιοδικό δεκαδικό αριθμό;' : 'convert to a terminating or repeating decimal?'}</span>
        </span>
      ),
      correct: isEl ? 'Πεπερασμένο δεκαδικό (0,7)' : 'Terminating decimal (0.7)',
      type: 'mcq',
      distractors: () => isEl ? [
        'Περιοδικό δεκαδικό με περίοδο το 3',
        'Μικτό περιοδικό δεκαδικό',
        'Άρρητο αριθμό'
      ][randInt(0, 2)] : [
        'Repeating decimal with period 3',
        'Mixed repeating decimal',
        'Irrational number'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Αρχικό κλάσμα', details: <Frac num="21" den="30" /> },
        {
          label: 'Απλοποίηση με το 3',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="21 : 3" den="30 : 3" />
              <span>＝</span>
              <Frac num="7" den="10" />
            </span>
          )
        },
        {
          label: 'Ανάγωγη μορφή',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="7" den="10" />
              <span>＝ 0,7 (πεπερασμένος)</span>
            </span>
          )
        }
      ] : [
        { label: 'Original fraction', details: <Frac num="21" den="30" /> },
        {
          label: 'Simplification by 3',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="21 : 3" den="30 : 3" />
              <span>＝</span>
              <Frac num="7" den="10" />
            </span>
          )
        },
        {
          label: 'Irreducible form',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="7" den="10" />
              <span>＝ 0.7 (terminating)</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Πρώτα απλοποιούμε:</span>
              <Frac num="21" den="30" />
              <span>＝</span>
              <Frac num="7" den="10" />
              <span>＝ 0,7. Ο παράγοντας 3 απλοποιείται, άρα ο δεκαδικός είναι πεπερασμένος.</span>
            </>
          ) : (
            <>
              <span>First simplify:</span>
              <Frac num="21" den="30" />
              <span>＝</span>
              <Frac num="7" den="10" />
              <span>＝ 0.7. The factor 3 cancels out, so the decimal is terminating.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Μικτός Περιοδικός με Παρονομαστή 6' : 'Mixed Repeating Decimal with Denominator 6',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το κλάσμα' : 'The fraction'}</span>
          <Frac num="1" den="6" />
          <span>{isEl ? 'ισούται με 0,1666... Ποιο είναι το μη περιοδικό του μέρος;' : 'equals 0.1666... What is its non-repeating part?'}</span>
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        { label: 'Δεκαδική μορφή', details: '0,1666... ＝ 0,1(6)' },
        { label: 'Μη περιοδικό μέρος', details: 'Το ψηφίο 1 (μεταξύ υποδιαστολής και περιόδου)' },
        { label: 'Περίοδος', details: 'Το ψηφίο 6' }
      ] : [
        { label: 'Decimal form', details: '0.1666... ＝ 0.1(6)' },
        { label: 'Non-repeating part', details: 'The digit 1 (between point and period)' },
        { label: 'Period', details: 'The digit 6' }
      ],
      explanation: isEl
        ? 'Στον αριθμό 0,1666... το ψηφίο 1 δεν επαναλαμβάνεται και αποτελεί το μη περιοδικό μέρος.'
        : 'In 0.1666... the digit 1 does not repeat and constitutes the non-repeating part.'
    };
  },
  (locale) => {
    const k = randInt(2, 6);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Μέγιστο Πλήθος Ψηφίων Περιόδου' : 'Maximum Number of Period Digits',
      prompt: isEl
        ? `Στη διαίρεση ενός κλάσματος με παρονομαστή το ${k}, ποιο είναι το ΜΕΓΙΣΤΟ δυνατό πλήθος ψηφίων που μπορεί να έχει η περίοδος;`
        : `When dividing a fraction with denominator ${k}, what is the MAXIMUM possible number of digits the period can have?`,
      correct: k - 1,
      type: 'input',
      tableData: isEl ? [
        { label: 'Διαιρέτης', details: `${k}` },
        { label: 'Δυνατά μη μηδενικά υπόλοιπα', details: `1, 2, ..., ${k - 1} (συνολικά ${k - 1})` },
        { label: 'Μέγιστη περίοδος', details: `${k - 1} ψηφία` }
      ] : [
        { label: 'Divisor', details: `${k}` },
        { label: 'Possible non-zero remainders', details: `1, 2, ..., ${k - 1} (total ${k - 1})` },
        { label: 'Maximum period', details: `${k - 1} digits` }
      ],
      explanation: isEl
        ? `Τα δυνατά μη μηδενικά υπόλοιπα της διαίρεσης με το ${k} είναι το πολύ ${k - 1}. Άρα η περίοδος μπορεί να έχει το πολύ ${k - 1} ψηφία πριν επαναληφθεί αναγκαστικά κάποιο υπόλοιπο.`
        : `The non-zero remainders upon division by ${k} are at most ${k - 1}. Thus the period can have at most ${k - 1} digits.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Κλάσμα με Παρονομαστή 7' : 'Fraction with Denominator 7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσα ψηφία έχει η περίοδος του κλάσματος' : 'How many digits are in the period of'}</span>
          <Frac num="1" den="7" />
          <span>{isEl ? '(0,142857142857...);' : '(0.142857142857...)?'}</span>
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: isEl ? [
        { label: 'Δεκαδικό ανάπτυγμα', details: '0,142857 142857...' },
        { label: 'Ψηφία περιόδου', details: '1, 4, 2, 8, 5, 7' },
        { label: 'Πλήθος', details: '6 ψηφία' }
      ] : [
        { label: 'Decimal expansion', details: '0.142857 142857...' },
        { label: 'Period digits', details: '1, 4, 2, 8, 5, 7' },
        { label: 'Count', details: '6 digits' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Η περίοδος του</span>
              <Frac num="1" den="7" />
              <span>είναι το τμήμα 142857, το οποίο αποτελείται από ακριβώς 6 ψηφία.</span>
            </>
          ) : (
            <>
              <span>The period of</span>
              <Frac num="1" den="7" />
              <span>is 142857, which consists of exactly 6 digits.</span>
            </>
          )}
        </span>
      )
    };
  }
];

// POOL Q11: Σύνθετη εύρεση γεννήτριας μικτού περιοδικού (6 σενάρια με i18n)
const PROBLEM_POOL_Q11 = [
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 0,1666...' : 'Generating Fraction of 0.1666...',
      prompt: isEl
        ? 'Ποιο είναι το ανάγωγο κλάσμα που παράγει τον αριθμό 0,1666... (0,1 με περίοδο 6);'
        : 'What is the irreducible fraction that produces 0.1666... (0.1 with period 6)?',
      correct: '1/6',
      type: 'mcq',
      distractors: () => ['1/3', '5/6', '2/9'][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Αριθμός', details: 'x ＝ 0,1666...' },
        { label: '10x και 100x', details: '10x ＝ 1,666..., 100x ＝ 16,666...' },
        {
          label: 'Αφαίρεση',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>90x ＝ 15 ⇒ x ＝</span>
              <Frac num="15" den="90" />
              <span>＝</span>
              <Frac num="1" den="6" />
            </span>
          )
        }
      ] : [
        { label: 'Number', details: 'x ＝ 0.1666...' },
        { label: '10x and 100x', details: '10x ＝ 1.666..., 100x ＝ 16.666...' },
        {
          label: 'Subtraction',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>90x ＝ 15 ⇒ x ＝</span>
              <Frac num="15" den="90" />
              <span>＝</span>
              <Frac num="1" den="6" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Θέτουμε x ＝ 0,1666... Τότε 100x － 10x ＝ 16,666... － 1,666... ⇒ 90x ＝ 15 ⇒ x ＝</span>
              <Frac num="15" den="90" />
              <span>＝</span>
              <Frac num="1" den="6" />.
            </>
          ) : (
            <>
              <span>Set x ＝ 0.1666... Then 100x － 10x ＝ 16.666... － 1.666... ⇒ 90x ＝ 15 ⇒ x ＝</span>
              <Frac num="15" den="90" />
              <span>＝</span>
              <Frac num="1" den="6" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 0,8333...' : 'Generating Fraction of 0.8333...',
      prompt: isEl
        ? 'Ποιο είναι το ανάγωγο κλάσμα του μικτού περιοδικού δεκαδικού 0,8333... (0,8 με περίοδο 3);'
        : 'What is the irreducible fraction of the mixed repeating decimal 0.8333... (0.8 with period 3)?',
      correct: '5/6',
      type: 'mcq',
      distractors: () => ['4/5', '5/9', '7/8'][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Εξισώσεις', details: '100x ＝ 83,333..., 10x ＝ 8,333...' },
        { label: 'Αφαίρεση', details: '90x ＝ 75' },
        {
          label: 'Αναγωγή',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num="75" den="90" />
              <span>＝</span>
              <Frac num="75 : 15" den="90 : 15" />
              <span>＝</span>
              <Frac num="5" den="6" />
            </span>
          )
        }
      ] : [
        { label: 'Equations', details: '100x ＝ 83.333..., 10x ＝ 8.333...' },
        { label: 'Subtraction', details: '90x ＝ 75' },
        {
          label: 'Reduction',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num="75" den="90" />
              <span>＝</span>
              <Frac num="75 : 15" den="90 : 15" />
              <span>＝</span>
              <Frac num="5" den="6" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>90x ＝ 83 － 8 ＝ 75 ⇒ x ＝</span>
              <Frac num="75" den="90" />
              <span>. Διαιρώντας αριθμητή και παρονομαστή με το 15 προκύπτει</span>
              <Frac num="5" den="6" />.
            </>
          ) : (
            <>
              <span>90x ＝ 83 － 8 ＝ 75 ⇒ x ＝</span>
              <Frac num="75" den="90" />
              <span>. Dividing numerator and denominator by 15 yields</span>
              <Frac num="5" den="6" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 0,2555...' : 'Generating Fraction of 0.2555...',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Στον αριθμό x ＝ 0,2555..., ποιος είναι ο αριθμητής του κλάσματος' : 'For the number x ＝ 0.2555..., what is the numerator of the fraction'}</span>
          <Frac num="23" den="90" />
          <span>;</span>
        </span>
      ),
      correct: 23,
      type: 'input',
      tableData: isEl ? [
        { label: 'Υπολογισμός', details: '100x ＝ 25,555..., 10x ＝ 2,555...' },
        {
          label: 'Διαφορά',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>90x ＝ 23 ⇒ x ＝</span>
              <Frac num="23" den="90" />
            </span>
          )
        }
      ] : [
        { label: 'Calculation', details: '100x ＝ 25.555..., 10x ＝ 2.555...' },
        {
          label: 'Difference',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>90x ＝ 23 ⇒ x ＝</span>
              <Frac num="23" den="90" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Έχουμε 90x ＝ 25 － 2 ＝ 23, άρα x ＝</span>
              <Frac num="23" den="90" />
              <span>. Ο αριθμητής είναι 23.</span>
            </>
          ) : (
            <>
              <span>We have 90x ＝ 25 － 2 ＝ 23, so x ＝</span>
              <Frac num="23" den="90" />
              <span>. The numerator is 23.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 1,2333...' : 'Generating Fraction of 1.2333...',
      prompt: isEl
        ? 'Ποιος είναι ο αριθμητής του κλάσματος του αριθμού 1,2333... πριν την απλοποίηση (παρονομαστής 90);'
        : 'What is the numerator of the fraction for 1.2333... before simplification (denominator 90)?',
      correct: 111,
      type: 'input',
      tableData: isEl ? [
        { label: 'Εξισώσεις', details: '100x ＝ 123,333..., 10x ＝ 12,333...' },
        { label: 'Διαφορά', details: '90x ＝ 123 － 12 ＝ 111' }
      ] : [
        { label: 'Equations', details: '100x ＝ 123.333..., 10x ＝ 12.333...' },
        { label: 'Difference', details: '90x ＝ 123 － 12 ＝ 111' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>100x － 10x ＝ 123 － 12 ＝ 111. Άρα x ＝</span>
              <Frac num="111" den="90" />.
            </>
          ) : (
            <>
              <span>100x － 10x ＝ 123 － 12 ＝ 111. Therefore x ＝</span>
              <Frac num="111" den="90" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 0,4545...' : 'Generating Fraction of 0.4545...',
      prompt: isEl
        ? 'Ποιο είναι το απλοποιημένο κλάσμα του απλού περιοδικού 0,4545... (περίοδος 45);'
        : 'What is the simplified fraction of the pure repeating decimal 0.4545... (period 45)?',
      correct: '5/11',
      type: 'mcq',
      distractors: () => ['4/9', '45/100', '9/20'][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Κλάσμα με 99', details: <Frac num="45" den="99" /> },
        {
          label: 'Απλοποίηση με το 9',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="45 : 9" den="99 : 9" />
              <span>＝</span>
              <Frac num="5" den="11" />
            </span>
          )
        }
      ] : [
        { label: 'Fraction with 99', details: <Frac num="45" den="99" /> },
        {
          label: 'Simplification by 9',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="45 : 9" den="99 : 9" />
              <span>＝</span>
              <Frac num="5" den="11" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κλάσμα είναι</span>
              <Frac num="45" den="99" />
              <span>. Διαιρώντας αριθμητή και παρονομαστή με το 9 βρίσκουμε</span>
              <Frac num="5" den="11" />.
            </>
          ) : (
            <>
              <span>The fraction is</span>
              <Frac num="45" den="99" />
              <span>. Dividing numerator and denominator by 9 gives</span>
              <Frac num="5" den="11" />.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Γεννήτρια του 0,0909...' : 'Generating Fraction of 0.0909...',
      prompt: isEl
        ? 'Ποιο ανάγωγο κλάσμα αντιστοιχεί στον αριθμό 0,0909... (περίοδος 09);'
        : 'Which irreducible fraction corresponds to 0.0909... (period 09)?',
      correct: '1/11',
      type: 'mcq',
      distractors: () => ['1/9', '9/100', '1/99'][randInt(0, 2)],
      renderOption: renderOptionValue,
      tableData: isEl ? [
        { label: 'Κλάσμα', details: <Frac num="9" den="99" /> },
        {
          label: 'Απλοποίηση με το 9',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="9 : 9" den="99 : 9" />
              <span>＝</span>
              <Frac num="1" den="11" />
            </span>
          )
        }
      ] : [
        { label: 'Fraction', details: <Frac num="9" den="99" /> },
        {
          label: 'Simplification by 9',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="9 : 9" den="99 : 9" />
              <span>＝</span>
              <Frac num="1" den="11" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Η περίοδος είναι 09, άρα</span>
              <Frac num="9" den="99" />
              <span>＝</span>
              <Frac num="1" den="11" />.
            </>
          ) : (
            <>
              <span>The period is 09, hence</span>
              <Frac num="9" den="99" />
              <span>＝</span>
              <Frac num="1" den="11" />.
            </>
          )}
        </span>
      )
    };
  }
];

// POOL Q12: Προβλήματα εφαρμογής και καθημερινής ζωής (6 σενάρια με i18n)
const PROBLEM_POOL_Q12 = [
  (locale) => {
    const km = randInt(10, 25);
    const totalAmount = km * 3 + 10;
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Μοιρασιά Εξόδων Ταξιδιού σε 3 Άτομα' : 'Splitting Travel Expenses among 3 People',
      prompt: isEl
        ? `Τρία άτομα μοιράζονται ισόποσα ένα συνολικό ποσό εξόδων ${totalAmount} €. Ποια είναι η περίοδος στον δεκαδικό αριθμό του μεριδίου ανά άτομο;`
        : `Three people equally share total expenses of ${totalAmount} €. What is the repeating period in the decimal share per person?`,
      correct: 3,
      type: 'input',
      unit: isEl ? 'περίοδος' : 'period',
      tableData: isEl ? [
        { label: 'Συνολικό ποσό', details: `${totalAmount} €` },
        {
          label: 'Διαίρεση με το 3',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num={totalAmount} den="3" />
              <span>＝ {km + 3}{dec}333... €</span>
            </span>
          )
        },
        { label: 'Περίοδος', details: 'Το ψηφίο 3' }
      ] : [
        { label: 'Total expense', details: `${totalAmount} €` },
        {
          label: 'Divided by 3',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num={totalAmount} den="3" />
              <span>＝ {km + 3}{dec}333... €</span>
            </span>
          )
        },
        { label: 'Period', details: 'Digit 3' }
      ],
      explanation: isEl
        ? `Διαιρώντας το συνολικό ποσό με το 3, το αποτέλεσμα έχει δεκαδικό μέρος ${dec}333... με περίοδο το 3.`
        : `Dividing total expenses by 3 yields a decimal ending in ${dec}333... with period 3.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Ισομερής Διανομή Πίτσας σε 3 Παιδιά' : 'Equal Sharing of Pizzas among 3 Children',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? '2 πίτσες μοιράζονται ισόποσα σε 3 παιδιά. Ποιος περιοδικός δεκαδικός αριθμός αντιστοιχεί στο μερίδιο κάθε παιδιού' : '2 pizzas are split equally among 3 children. Which repeating decimal corresponds to each child’s share'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>(</span>
            <Frac num="2" den="3" />
            <span>){isEl ? ';' : '?'}</span>
          </span>
        </span>
      ),
      correct: `0${dec}666...`,
      type: 'mcq',
      distractors: () => isEl ? ['0,222...', '0,333...', '0,5'][randInt(0, 2)] : ['0.222...', '0.333...', '0.5'][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Κλάσμα', details: <Frac num="2" den="3" /> },
        {
          label: 'Δεκαδικό',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="3" />
              <span>＝ 0,666... (περίοδος 6)</span>
            </span>
          )
        }
      ] : [
        { label: 'Fraction', details: <Frac num="2" den="3" /> },
        {
          label: 'Decimal',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="3" />
              <span>＝ 0.666... (period 6)</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κλάσμα</span>
              <Frac num="2" den="3" />
              <span>ισούται με 0,666... με περίοδο το 6.</span>
            </>
          ) : (
            <>
              <span>The fraction</span>
              <Frac num="2" den="3" />
              <span>equals 0.666... with period 6.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Εκπτωτικό Μερίδιο Ενός Τρίτου' : 'One-Third Discount Share',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Σε ένα κατάστημα προσφέρεται έκπτωση ίση με το' : 'A shop offers a discount equal to'}</span>
          <Frac num="1" den="3" />
          <span>{isEl ? 'της αρχικής τιμής. Ποιο είναι το ποσοστό έκπτωσης εκφρασμένο σε περιοδικό δεκαδικό επί τοις εκατό (%);' : 'of the original price. What is the discount rate expressed as a repeating percentage (%)?'}</span>
        </span>
      ),
      correct: `33${dec}333... %`,
      type: 'mcq',
      distractors: () => ['30 %', '33 %', isEl ? '33,5 %' : '33.5 %'][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Κλάσμα έκπτωσης', details: <Frac num="1" den="3" /> },
        {
          label: 'Ποσοστό (%)',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span className="inline-flex items-center whitespace-nowrap">
                <span>(</span>
                <Frac num="1" den="3" />
                <span>) · 100</span>
              </span>
              <span>＝</span>
              <Frac num="100" den="3" />
              <span>＝ 33,333... %</span>
            </span>
          )
        }
      ] : [
        { label: 'Discount fraction', details: <Frac num="1" den="3" /> },
        {
          label: 'Percentage (%)',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span className="inline-flex items-center whitespace-nowrap">
                <span>(</span>
                <Frac num="1" den="3" />
                <span>) · 100</span>
              </span>
              <span>＝</span>
              <Frac num="100" den="3" />
              <span>＝ 33.333... %</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κλάσμα</span>
              <Frac num="1" den="3" />
              <span>αντιστοιχεί στο 33,333...%.</span>
            </>
          ) : (
            <>
              <span>The fraction</span>
              <Frac num="1" den="3" />
              <span>corresponds to 33.333...%.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Χρόνος Ολοκλήρωσης Εργασίας' : 'Job Completion Time',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ένας εργάτης χρειάζεται 20 λεπτά της ώρας για μια εργασία. Ποιο είναι το δεκαδικό μέρος των ωρών που εργάστηκε' : 'A worker needs 20 minutes for a task. What is the decimal fraction of hours worked'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>(</span>
            <Frac num="20" den="60" />
            <span>＝</span>
            <Frac num="1" den="3" />
            <span>){isEl ? ';' : '?'}</span>
          </span>
        </span>
      ),
      correct: isEl ? '0,333... ώρες' : '0.333... hours',
      type: 'mcq',
      distractors: () => isEl ? ['0,2 ώρες', '0,25 ώρες', '0,5 ώρες'][randInt(0, 2)] : ['0.2 hours', '0.25 hours', '0.5 hours'][randInt(0, 2)],
      tableData: isEl ? [
        {
          label: 'Λεπτά σε ώρες',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="20" den="60" />
              <span>＝</span>
              <Frac num="1" den="3" />
            </span>
          )
        },
        {
          label: 'Δεκαδική μορφή',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="3" />
              <span>＝ 0,333... ώρες</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Minutes to hours',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="20" den="60" />
              <span>＝</span>
              <Frac num="1" den="3" />
            </span>
          )
        },
        {
          label: 'Decimal form',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="3" />
              <span>＝ 0.333... hours</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Τα 20 λεπτά αντιστοιχούν στο</span>
              <Frac num="1" den="3" />
              <span>της ώρας, δηλαδή 0,333... ώρες.</span>
            </>
          ) : (
            <>
              <span>20 minutes corresponds to</span>
              <Frac num="1" den="3" />
              <span>of an hour, which is 0.333... hours.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Τεμαχισμός Σχοινιού σε 9 Ίσα Μέρη' : 'Cutting Rope into 9 Equal Parts',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ένα σχοινί μήκους 7 μέτρων κόβεται σε 9 ίσα κομμάτια' : 'A 7-meter rope is cut into 9 equal pieces'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>(</span>
            <Frac num="7" den="9" />
            <span>m).</span>
          </span>
          <span>{isEl ? 'Ποιο είναι το δεκαδικό μήκος κάθε κομματιού;' : 'What is the decimal length of each piece?'}</span>
        </span>
      ),
      correct: `0${dec}777... m`,
      type: 'mcq',
      distractors: () => isEl ? ['0,7 m', '0,79 m', '0,8 m'][randInt(0, 2)] : ['0.7 m', '0.79 m', '0.8 m'][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Μήκος', details: '7 m' },
        { label: 'Τεμάχια', details: '9' },
        {
          label: 'Μήκος ανά τεμάχιο',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="7" den="9" />
              <span>＝ 0,777... m</span>
            </span>
          )
        }
      ] : [
        { label: 'Length', details: '7 m' },
        { label: 'Pieces', details: '9' },
        {
          label: 'Length per piece',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="7" den="9" />
              <span>＝ 0.777... m</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κλάσμα</span>
              <Frac num="7" den="9" />
              <span>δίνει 0,777... μέτρα ανά τεμάχιο.</span>
            </>
          ) : (
            <>
              <span>The fraction</span>
              <Frac num="7" den="9" />
              <span>yields 0.777... meters per piece.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Σύγκριση Περιοδικών Δεκαδικών' : 'Comparing Repeating Decimals',
      prompt: isEl
        ? 'Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος: 0,3 ή 0,33 ή 0,333... (περιοδικός);'
        : 'Which of the following numbers is the greatest: 0.3 or 0.33 or 0.333... (repeating)?',
      correct: `0${dec}333...`,
      type: 'mcq',
      distractors: () => isEl ? ['0,3', '0,33', 'Είναι όλοι ίσοι'][randInt(0, 2)] : ['0.3', '0.33', 'All are equal'][randInt(0, 2)],
      tableData: isEl ? [
        { label: '0,3', details: '0,3000...' },
        { label: '0,33', details: '0,3300...' },
        { label: '0,333...', details: '0,3333... (έχει 3 σε όλες τις θέσεις)' }
      ] : [
        { label: '0.3', details: '0.3000...' },
        { label: '0.33', details: '0.3300...' },
        { label: '0.333...', details: '0.3333... (has 3 in all positions)' }
      ],
      explanation: isEl
        ? 'Συγκρίνοντας τα ψηφία από αριστερά προς τα δεξιά: 0,3333... ＞ 0,3300... ＞ 0,3000...'
        : 'Comparing digits from left to right: 0.3333... ＞ 0.3300... ＞ 0.3000...'
    };
  }
];

export default function DekadikiMorfiRitonExercises() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      metaTitle: "Ασκήσεις: Δεκαδική Μορφή Ρητών | Γ' Γυμνασίου",
      metaDesc: "Διαδραστικές ασκήσεις στη δεκαδική μορφή ρητών, περιοδικούς δεκαδικούς και μετατροπές με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
      backText: "Θεωρία Κεφ. 1",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeClass: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
      bannerTitle: "Δεκαδική Μορφή Ρητών Αριθμών: Εξάσκηση",
      bannerSubtitle: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».",
      btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      resultHeading: (s) => `Αποτέλεσμα: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις δεκαδικές μορφές των ρητών και τις μετατροπές τους.",
      feedbackGood: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
      feedbackPoor: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους περιοδικούς αριθμούς!",
      btnTryNewSet: "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ",
      correctBadge: "✓ Σωστό",
      wrongBadge: "✗ Λάθος",
      inputPlaceholder: "Απάντηση...",
      thStep: "Στοιχείο / Βήμα",
      thData: "Ανάλυση Δεδομένων",
      correctAnswerLabel: "Σωστή Απάντηση:",
      answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
      scoreLabel: "ΣΚΟΡ",
      btnCheck: "ΕΛΕΓΧΟΣ",
      trueLabel: "Σωστό",
      falseLabel: "Λάθος",
    },
    en: {
      metaTitle: "Exercises: Decimal Form of Rationals | 9th Grade",
      metaDesc: "Interactive exercises on decimal representations of rationals, repeating decimals, and conversions with detailed steps.",
      backText: "Theory Ch. 1",
      btnTheory: "THEORY",
      badgeClass: "EXERCISES • 9TH GRADE",
      bannerTitle: "Decimal Form of Rational Numbers: Practice",
      bannerSubtitle: "12 dynamic questions and applied problems. Complete your answers and click «Check Answers».",
      btnNewExercises: "NEW EXERCISES",
      resultHeading: (s) => `Result: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Outstanding performance! You thoroughly understand decimal forms of rationals and their conversions.",
      feedbackGood: "Very good effort! Review the detailed steps below for the questions you found tricky.",
      feedbackPoor: "Needs a bit more practice. Consult the theory for repeating decimal numbers!",
      btnTryNewSet: "TRY NEW SET",
      correctBadge: "✓ Correct",
      wrongBadge: "✗ Incorrect",
      inputPlaceholder: "Answer...",
      thStep: "Item / Step",
      thData: "Data Analysis",
      correctAnswerLabel: "Correct Answer:",
      answeredLabel: "ANSWERED",
      scoreLabel: "SCORE",
      btnCheck: "CHECK",
      trueLabel: "True",
      falseLabel: "False",
    }
  };

  const cur = t[locale] || t.el;

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Ορισμός ρητού
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός Ρητού Αριθμού' : 'Definition of Rational Number',
      prompt: isEl
        ? (q1IsCorrect
            ? 'Κάθε ρητός αριθμός μπορεί να γραφεί ως κλάσμα με αριθμητή ακέραιο και παρονομαστή μη μηδενικό φυσικό.'
            : 'Υπάρχουν ρητοί αριθμοί που δεν μπορούν με κανέναν τρόπο να παρασταθούν ως κλάσμα ακεραίων.')
        : (q1IsCorrect
            ? 'Every rational number can be written as a fraction with an integer numerator and a non-zero natural denominator.'
            : 'There are rational numbers that cannot be represented as a fraction of integers in any way.'),
      type: 'tf',
      correct: q1IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Εξ ορισμού, ρητός είναι κάθε αριθμός που μπορεί να λάβει τη μορφή</span>
              <Frac num="μ" den="ν" />
              <span>όπου μ ακέραιος και ν φυσικός διάφορος του μηδενός.</span>
            </>
          ) : (
            <>
              <span>By definition, a rational number is any number that can take the form</span>
              <Frac num="m" den="n" />
              <span>where m is an integer and n is a non-zero natural number.</span>
            </>
          )}
        </span>
      )
    });

    // Q2: MCQ - Αναγνώριση Ρητού
    const correctQ2 = isEl ? '0,333...' : '0.333...';
    const distractorCandidates = ['π', '√2', '√3', '√5', '√7'];
    qList.push({
      id: 2,
      title: isEl ? 'Αναγνώριση Ρητού Αριθμού' : 'Identifying Rational Numbers',
      prompt: isEl ? 'Ποιος από τους παρακάτω αριθμούς ΕΙΝΑΙ ρητός αριθμός;' : 'Which of the following numbers IS a rational number?',
      type: 'mcq',
      correct: correctQ2,
      options: ensureFourUniqueOptions(correctQ2, () => distractorCandidates[randInt(0, distractorCandidates.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√5') return <Radical>5</Radical>;
        if (opt === '√7') return <Radical>7</Radical>;
        if (opt === 'π') return (
          <span className="inline-flex items-center gap-1">
            <span className="font-serif italic text-[1.1em]">π</span>
            <span>(3,14159...)</span>
          </span>
        );
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο 0,333... είναι περιοδικός δεκαδικός αριθμός</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(ισούται με</span>
                <Frac num="1" den="3" />
                <span>)</span>
              </span>
              <span>και είναι ρητός. Οι αριθμοί</span>
              <span className="font-serif italic text-[1.05em]">π</span>,
              <Radical>2</Radical>,
              <Radical>3</Radical>,
              <Radical>5</Radical>
              <span>έχουν άπειρα μη περιοδικά ψηφία και είναι άρρητοι.</span>
            </>
          ) : (
            <>
              <span>0.333... is a repeating decimal</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(equals</span>
                <Frac num="1" den="3" />
                <span>)</span>
              </span>
              <span>and is rational. Numbers like</span>
              <span className="font-serif italic text-[1.05em]">π</span>,
              <Radical>2</Radical>,
              <Radical>3</Radical>,
              <Radical>5</Radical>
              <span>have infinite non-repeating digits and are irrational.</span>
            </>
          )}
        </span>
      )
    });

    // Q3: Input - Εύρεση Περιόδου
    const pDigit = randInt(2, 8);
    qList.push({
      id: 3,
      title: isEl ? 'Αναγνώριση Περιόδου' : 'Identifying the Period',
      prompt: isEl
        ? `Ποιο ψηφίο αποτελεί την περίοδο του αριθμού 0,${pDigit}${pDigit}${pDigit}...;`
        : `Which digit represents the period of the number 0.${pDigit}${pDigit}${pDigit}...;`,
      type: 'input',
      correct: pDigit,
      explanation: isEl
        ? `Το ψηφίο που επαναλαμβάνεται επ' άπειρον είναι το ${pDigit}, άρα η περίοδος είναι ${pDigit}.`
        : `The digit repeating indefinitely is ${pDigit}, so the period is ${pDigit}.`
    });

    // Q4: MCQ - Είδος Περιοδικού (Απλός vs Μικτός)
    const isSimple = Math.random() < 0.5;
    const testNumStr = isEl
      ? (isSimple ? '0,454545...' : '0,2777...')
      : (isSimple ? '0.454545...' : '0.2777...');
    const ansType = isEl
      ? (isSimple ? 'Απλός Περιοδικός' : 'Μικτός Περιοδικός')
      : (isSimple ? 'Pure Repeating' : 'Mixed Repeating');
    qList.push({
      id: 4,
      title: isEl ? 'Διάκριση Απλού και Μικτού Περιοδικού' : 'Distinguishing Pure and Mixed Repeating Decimals',
      prompt: isEl
        ? `Πώς χαρακτηρίζεται ο δεκαδικός αριθμός ${testNumStr};`
        : `How is the decimal number ${testNumStr} characterized?`,
      type: 'mcq',
      correct: ansType,
      options: ensureFourUniqueOptions(ansType, () => isEl ? [
        'Απλός Περιοδικός',
        'Μικτός Περιοδικός',
        'Πεπερασμένος Δεκαδικός',
        'Άρρητος Αριθμός'
      ][randInt(0, 3)] : [
        'Pure Repeating',
        'Mixed Repeating',
        'Terminating Decimal',
        'Irrational Number'
      ][randInt(0, 3)]),
      explanation: isEl
        ? (isSimple
            ? 'Είναι απλός περιοδικός γιατί η περίοδος (45) ξεκινά αμέσως μετά την υποδιαστολή.'
            : 'Είναι μικτός περιοδικός γιατί ανάμεσα στην υποδιαστολή και την περίοδο (7) υπάρχει το μη περιοδικό ψηφίο 2.')
        : (isSimple
            ? 'It is pure repeating because the period (45) begins immediately after the decimal point.'
            : 'It is mixed repeating because non-repeating digit 2 precedes the repeating period (7).')
    });

    // Q5: True / False - Πεπερασμένοι Δεκαδικοί
    const q5IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: isEl ? 'Κριτήριο Παρονομαστή' : 'Denominator Criterion',
      prompt: isEl
        ? (q5IsCorrect
            ? 'Ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό αν ο παρονομαστής του περιέχει μόνο πρώτους παράγοντες το 2 ή/και το 5.'
            : 'Ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό μόνο όταν ο παρονομαστής του είναι περιττός αριθμός.')
        : (q5IsCorrect
            ? 'An irreducible fraction yields a terminating decimal if its denominator contains only prime factors 2 and/or 5.'
            : 'An irreducible fraction yields a terminating decimal only when its denominator is an odd number.'),
      type: 'tf',
      correct: q5IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Η δεκαδική μορφή ενός ανάγωγου κλάσματος είναι πεπερασμένη αν και μόνο αν ο παρονομαστής αναλύεται αποκλειστικά σε δυνάμεις του 2 και του 5.'
        : 'The decimal representation of an irreducible fraction is terminating if and only if the denominator factors solely into powers of 2 and 5.'
    });

    // Q6: Input - Μετατροπή απλού κλάσματος
    qList.push({
      id: 6,
      title: isEl ? 'Δεκαδική Μορφή του 1/4' : 'Decimal Form of 1/4',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η δεκαδική μορφή του κλάσματος' : 'What is the decimal form of the fraction'}</span>
          <Frac num="1" den="4" />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'input',
      correct: isEl ? '0,25' : '0.25',
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κλάσμα</span>
              <Frac num="1" den="4" />
              <span>ισούται ακριβώς με 0,25.</span>
            </>
          ) : (
            <>
              <span>The fraction</span>
              <Frac num="1" den="4" />
              <span>equals exactly 0.25.</span>
            </>
          )}
        </span>
      )
    });

    // Q7: MCQ - Γεννήτρια του 0,333...
    qList.push({
      id: 7,
      title: isEl ? 'Γεννήτρια του 0,333...' : 'Generating Fraction of 0.333...',
      prompt: isEl ? 'Ποιο είναι το απλοποιημένο κλάσμα του αριθμού 0,333...;' : 'What is the simplified fraction of 0.333...?',
      type: 'mcq',
      correct: '1/3',
      options: ensureFourUniqueOptions('1/3', () => [
        '3/10',
        '3/100',
        '1/4',
        '1/9'
      ][randInt(0, 3)]),
      renderOption: renderOptionValue,
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>0,333... ＝</span>
          <Frac num="3" den="9" />
          <span>＝</span>
          <Frac num="1" den="3" />.
        </span>
      )
    });

    // Q8: Input - Πλήθος ψηφίων περιόδου
    const pDigitsCount = randInt(2, 4);
    const samplePeriod = isEl
      ? (pDigitsCount === 2 ? '0,1515...' : pDigitsCount === 3 ? '0,123123...' : '0,12341234...')
      : (pDigitsCount === 2 ? '0.1515...' : pDigitsCount === 3 ? '0.123123...' : '0.12341234...');
    qList.push({
      id: 8,
      title: isEl ? 'Πλήθος Ψηφίων Περιόδου' : 'Number of Period Digits',
      prompt: isEl
        ? `Πόσα ψηφία έχει η περίοδος του αριθμού ${samplePeriod};`
        : `How many digits are in the period of the number ${samplePeriod}?`,
      type: 'input',
      correct: pDigitsCount,
      explanation: isEl
        ? `Το επαναλαμβανόμενο τμήμα έχει μήκος ακριβώς ${pDigitsCount} ψηφία.`
        : `The repeating block has a length of exactly ${pDigitsCount} digits.`
    });

    // Q9 - Q12: Επιλογή από ανεξάρτητες δεξαμενές
    const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
    const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
    const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
    const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);

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
        renderOption: item.renderOption || renderOptionValue,
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
  }, [locale]);

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
      title={cur.metaTitle}
      description={cur.metaDesc}
      backUrl="/g-gymnasiou/01-dekadiki-morfi-riton"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/01-dekadiki-morfi-riton"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(cur.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 break-words [overflow-wrap:anywhere]">
                {toCleanUppercase(cur.badgeClass)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {cur.bannerTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1 break-words [overflow-wrap:anywhere]">
                {cur.bannerSubtitle}
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(cur.btnNewExercises)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in w-full min-w-0">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2 break-words [overflow-wrap:anywhere]">
              {cur.resultHeading(score)}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4 break-words [overflow-wrap:anywhere]">
              {score >= 10
                ? cur.feedbackExcellent
                : score >= 6
                ? cur.feedbackGood
                : cur.feedbackPoor}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(cur.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
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
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all w-full min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? cur.correctBadge : cur.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2 w-full min-w-0">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
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
                            <span className="break-words whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm [overflow-wrap:anywhere]">
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
                        maxLength={10}
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          let val = e.target.value.replace('.', ',');
                          val = val.replace(/[^0-9,]/g, '');
                          const parts = val.split(',');
                          if (parts.length > 2) {
                            val = parts[0] + ',' + parts.slice(1).join('');
                          }
                          handleAnswerChange(q.id, val);
                        }}
                        placeholder={cur.inputPlaceholder}
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
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in w-full min-w-0">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">{cur.thStep}</th>
                              <th className="p-2 border-b">{cur.thData}</th>
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

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed break-words [overflow-wrap:anywhere]">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{cur.correctAnswerLabel}</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM FOOTER - MOBILE OPTIMIZED */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(cur.answeredLabel)}: <span className="text-amber-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(cur.scoreLabel)}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-600">|</span>
                  <span className="text-amber-400">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(cur.btnCheck)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(cur.btnNewExercises)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}