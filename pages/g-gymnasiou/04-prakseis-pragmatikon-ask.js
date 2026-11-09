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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Seamless & Overflow Safe
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-stretch align-middle font-mono shrink-0 mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.55em] min-h-full shrink-0 text-current overflow-visible self-stretch"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d="M1 13 L3.5 13 L6.5 22 L11.5 2" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 leading-none text-[0.95em] -ml-[1px] flex items-center">
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

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Σύνθετη αναγωγή ομοίων ριζών και απλοποίηση παραστάσεων (6 σενάρια με i18n)
const PROBLEM_POOL_Q9 = [
  (locale) => {
    const a = randInt(4, 7);
    const b = randInt(2, 3);
    const c = randInt(3, 5);
    const d = randInt(1, 2);
    const coef3 = a - b;
    const coef2 = c - d;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Σύνθετη Αναγωγή Ομοίων Ριζών' : 'Reduction of Like Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Να απλοποιηθεί η παράσταση:' : 'Simplify the expression:'}</span>
          <span>{a} ·</span> <Radical>3</Radical> <span>＋ {c} ·</span> <Radical>2</Radical> <span>－ {b} ·</span> <Radical>3</Radical> <span>－ {d} ·</span> <Radical>2</Radical>.
        </span>
      ),
      correct: `${coef3}·√3 ＋ ${coef2}·√2`,
      type: 'mcq',
      distractors: () => [
        `${coef3 + coef2}·√5`,
        `${coef3}·√3 － ${coef2}·√2`,
        `${a + b}·√3 ＋ ${c + d}·√2`
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `${coef3}·√3 ＋ ${coef2}·√2`) {
          return (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>{coef3} ·</span> <Radical>3</Radical> <span>＋ {coef2} ·</span> <Radical>2</Radical>
            </span>
          );
        }
        if (opt === `${coef3 + coef2}·√5`) {
          return (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>{coef3 + coef2} ·</span> <Radical>5</Radical>
            </span>
          );
        }
        if (opt === `${coef3}·√3 － ${coef2}·√2`) {
          return (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>{coef3} ·</span> <Radical>3</Radical> <span>－ {coef2} ·</span> <Radical>2</Radical>
            </span>
          );
        }
        if (opt === `${a + b}·√3 ＋ ${c + d}·√2`) {
          return (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>{a + b} ·</span> <Radical>3</Radical> <span>＋ {c + d} ·</span> <Radical>2</Radical>
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Ομαδοποίηση όρων με √3',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({a} － {b}) ·</span> <Radical>3</Radical> <span>＝ {coef3} ·</span> <Radical>3</Radical>
            </span>
          )
        },
        {
          label: 'Ομαδοποίηση όρων με √2',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({c} － {d}) ·</span> <Radical>2</Radical> <span>＝ {coef2} ·</span> <Radical>2</Radical>
            </span>
          )
        },
        {
          label: 'Τελική ανηγμένη μορφή',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>{coef3} ·</span> <Radical>3</Radical> <span>＋ {coef2} ·</span> <Radical>2</Radical>
            </span>
          )
        }
      ] : [
        {
          label: 'Grouping terms with √3',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({a} － {b}) ·</span> <Radical>3</Radical> <span>＝ {coef3} ·</span> <Radical>3</Radical>
            </span>
          )
        },
        {
          label: 'Grouping terms with √2',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({c} － {d}) ·</span> <Radical>2</Radical> <span>＝ {coef2} ·</span> <Radical>2</Radical>
            </span>
          )
        },
        {
          label: 'Final simplified form',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>{coef3} ·</span> <Radical>3</Radical> <span>＋ {coef2} ·</span> <Radical>2</Radical>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ομαδοποιούμε μόνο τις όμοιες ρίζες ξεχωριστά: ({a} － {b}) ·</span>
              <Radical>3</Radical>
              <span>＋ ({c} － {d}) ·</span>
              <Radical>2</Radical>
              <span>＝ {coef3} ·</span>
              <Radical>3</Radical>
              <span>＋ {coef2} ·</span>
              <Radical>2</Radical>.
            </>
          ) : (
            <>
              <span>We group like radicals separately: ({a} － {b}) ·</span>
              <Radical>3</Radical>
              <span>＋ ({c} － {d}) ·</span>
              <Radical>2</Radical>
              <span>＝ {coef3} ·</span>
              <Radical>3</Radical>
              <span>＋ {coef2} ·</span>
              <Radical>2</Radical>.
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(5, 7);
    const b = randInt(2, 3);
    const res = a - b * b;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υπολογισμός Γινομένου Ριζών' : 'Product of Radical Conjugates',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η αριθμητική τιμή του γινομένου' : 'What is the numerical value of the product'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>{a}</Radical> ＋ {b})</span>
          <span>·</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>{a}</Radical> － {b}){isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Επιμερισμός / Ταυτότητα',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>{a}</Radical>)² － {b}²</span>
            </span>
          )
        },
        { label: 'Υπολογισμός τετραγώνων', details: `${a} － ${b * b} ＝ ${res}` }
      ] : [
        {
          label: 'Identity / Expansion',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>{a}</Radical>)² － {b}²</span>
            </span>
          )
        },
        { label: 'Squaring calculation', details: `${a} － ${b * b} ＝ ${res}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Εφαρμόζουμε την ταυτότητα (√α ＋ β)(√α － β) ＝ (√α)² － β² ＝' : 'Using the identity (√a ＋ b)(√a － b) ＝ (√a)² － b² ＝'}</span>
          <span>{a} － {b * b} ＝ {res}.</span>
        </span>
      )
    };
  },
  (locale) => {
    const x = randInt(3, 5);
    const yVal = x * x - 1;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εύρεση Παραμέτρου σε Αντίστροφους Αριθμούς' : 'Finding Parameter in Reciprocal Numbers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? `Αν οι πραγματικοί αριθμοί ${x} ＋` : `If the real numbers ${x} ＋`}</span>
          <Radical>y</Radical>
          <span>{isEl ? `και ${x} －` : `and ${x} －`}</span>
          <Radical>y</Radical>
          <span>{isEl ? 'είναι αντίστροφοι, ποια είναι η τιμή του y;' : 'are reciprocals, what is the value of y?'}</span>
        </span>
      ),
      correct: yVal,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Συνθήκη αντιστρόφων',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({x} ＋ <Radical>y</Radical>) · ({x} － <Radical>y</Radical>) ＝ 1</span>
            </span>
          )
        },
        {
          label: 'Διαφορά τετραγώνων',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>{x}² － (<Radical>y</Radical>)² ＝ 1 ⇒ {x * x} － y ＝ 1</span>
            </span>
          )
        },
        { label: 'Επίλυση ως προς y', details: `y ＝ ${x * x} － 1 ＝ ${yVal}` }
      ] : [
        {
          label: 'Reciprocal condition',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>({x} ＋ <Radical>y</Radical>) · ({x} － <Radical>y</Radical>) ＝ 1</span>
            </span>
          )
        },
        {
          label: 'Difference of squares',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>{x}² － (<Radical>y</Radical>)² ＝ 1 ⇒ {x * x} － y ＝ 1</span>
            </span>
          )
        },
        { label: 'Solving for y', details: `y ＝ ${x * x} － 1 ＝ ${yVal}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Δύο αριθμοί είναι αντίστροφοι όταν το γινόμενό τους ισούται με 1:' : 'Two numbers are reciprocals when their product equals 1:'}</span>
          <span className="inline-flex items-center whitespace-nowrap">({x})² － (<Radical>y</Radical>)² ＝ 1</span>
          <span>⇒ {x * x} － y ＝ 1 ⇒ y ＝ {yVal}.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Επιμεριστική και Ακέραιο Αποτέλεσμα' : 'Distributive Property and Integer Result',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <Radical>2</Radical>
          <span>·</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>8</Radical> ＋ <Radical>18</Radical>){isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 10,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Επιμερισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>2</Radical> · <Radical>8</Radical> ＋ <Radical>2</Radical> · <Radical>18</Radical>
            </span>
          )
        },
        {
          label: 'Ιδιότητα γινομένου ριζών',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>16</Radical> ＋ <Radical>36</Radical>
            </span>
          )
        },
        { label: 'Υπολογισμός ριζών', details: '4 ＋ 6 ＝ 10' }
      ] : [
        {
          label: 'Distribution',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>2</Radical> · <Radical>8</Radical> ＋ <Radical>2</Radical> · <Radical>18</Radical>
            </span>
          )
        },
        {
          label: 'Product of radicals',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>16</Radical> ＋ <Radical>36</Radical>
            </span>
          )
        },
        { label: 'Radicals evaluation', details: '4 ＋ 6 ＝ 10' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <Radical>2</Radical> · <Radical>8</Radical> ＝ <Radical>16</Radical> ＝ 4
          <span>{isEl ? 'και' : 'and'}</span>
          <Radical>2</Radical> · <Radical>18</Radical> ＝ <Radical>36</Radical> ＝ 6.
          <span>{isEl ? 'Άρα 4 ＋ 6 ＝ 10.' : 'Thus 4 ＋ 6 ＝ 10.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const k = randInt(2, 4);
    const sumC = k * 3 + k * 2;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση Κλάσματος με Κοινό Παράγοντα Ρίζα' : 'Fraction Simplification with Radical Factor',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η τιμή του κλάσματος' : 'What is the value of the fraction'}</span>
          <Frac
            num={<span className="inline-flex items-center gap-0.5">{sumC} · <Radical>5</Radical></span>}
            den={<span className="inline-flex items-center gap-0.5">{k} · <Radical>5</Radical></span>}
          />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Απλοποίηση ρίζας',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>Η κοινή ρίζα</span> <Radical>5</Radical> <span>απλοποιείται</span>
            </span>
          )
        },
        {
          label: 'Διαίρεση συντελεστών',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={sumC} den={k} /> <span>＝ 5</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Radical cancellation',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>Common factor</span> <Radical>5</Radical> <span>cancels out</span>
            </span>
          )
        },
        {
          label: 'Coefficients division',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={sumC} den={k} /> <span>＝ 5</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Η ρίζα</span> <Radical>5</Radical> <span>απλοποιείται από αριθμητή και παρονομαστή, οπότε απομένει</span>
              <Frac num={sumC} den={k} /> <span>＝ 5.</span>
            </>
          ) : (
            <>
              <span>The factor</span> <Radical>5</Radical> <span>cancels out from both numerator and denominator, leaving</span>
              <Frac num={sumC} den={k} /> <span>＝ 5.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ανάπτυγμα Διπλής Επιμεριστικής' : 'Double Distributive Expansion',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η αριθμητική τιμή της παράστασης' : 'What is the numerical value of the expression'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>3</Radical> ＋ 1)</span>
          <span>·</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>3</Radical> ＋ 2)</span>
          <span>－ 3 ·</span>
          <Radical>3</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Ανάπτυγμα γινομένου',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>(<Radical>3</Radical>)² ＋ 2·<Radical>3</Radical> ＋ <Radical>3</Radical> ＋ 2 ＝ 3 ＋ 3·<Radical>3</Radical> ＋ 2 ＝ 5 ＋ 3·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Αφαίρεση 3·√3',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>5 ＋ 3·<Radical>3</Radical> － 3·<Radical>3</Radical> ＝ 5</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Product expansion',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>(<Radical>3</Radical>)² ＋ 2·<Radical>3</Radical> ＋ <Radical>3</Radical> ＋ 2 ＝ 3 ＋ 3·<Radical>3</Radical> ＋ 2 ＝ 5 ＋ 3·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Subtracting 3·√3',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>5 ＋ 3·<Radical>3</Radical> － 3·<Radical>3</Radical> ＝ 5</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το γινόμενο δίνει 5 ＋ 3·</span><Radical>3</Radical><span>. Αφαιρώντας το 3·</span><Radical>3</Radical><span>, απομένει ο ακέραιος 5.</span>
            </>
          ) : (
            <>
              <span>The product yields 5 ＋ 3·</span><Radical>3</Radical><span>. Subtracting 3·</span><Radical>3</Radical><span> leaves the integer 5.</span>
            </>
          )}
        </span>
      )
    };
  }
];

// POOL Q10: Αριθμοί Ανάλογοι προς Ρίζες & Επίλυση Εξισώσεων (6 σενάρια με i18n)
const PROBLEM_POOL_Q10 = [
  (locale) => {
    const mult = randInt(5, 9);
    const target = 7 * mult;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Αριθμοί Ανάλογοι προς Ρίζες' : 'Numbers Proportional to Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Οι θετικοί αριθμοί x, y, z είναι ανάλογοι προς τους 3,' : 'The positive numbers x, y, z are proportional to 3,'}</span>
          <Radical>3</Radical>
          <span>{isEl ? 'και' : 'and'}</span>
          <Radical>7</Radical>
          <span>{isEl ? 'αντίστοιχα, και ισχύει: x － y ·' : 'respectively, satisfying: x － y ·'}</span>
          <Radical>3</Radical>
          <span>{isEl ? '＋ z ·' : '＋ z ·'}</span>
          <Radical>7</Radical>
          <span>＝ {target}. {isEl ? 'Ποια είναι η τιμή του x;' : 'What is the value of x?'}</span>
        </span>
      ),
      correct: 3 * mult,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Σχέση αναλογίας',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num="x" den="3" /> ＝ <Frac num="y" den={<Radical>3</Radical>} /> ＝ <Frac num="z" den={<Radical>7</Radical>} /> ＝ λ
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ x ＝ 3λ, y ＝ λ<Radical>3</Radical>, z ＝ λ<Radical>7</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Αντικατάσταση',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3λ － (λ<Radical>3</Radical>)·<Radical>3</Radical> ＋ (λ<Radical>7</Radical>)·<Radical>7</Radical> ＝ {target}</span>
            </span>
          )
        },
        {
          label: 'Αναγωγή',
          details: (
            <div className="flex flex-col gap-1">
              <span>3λ － 3λ ＋ 7λ ＝ {target}</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 7λ ＝ {target} ⇒ λ ＝ {mult}
              </span>
            </div>
          )
        },
        { label: 'Υπολογισμός x', details: `x ＝ 3 · ${mult} ＝ ${3 * mult}` }
      ] : [
        {
          label: 'Proportionality relation',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num="x" den="3" /> ＝ <Frac num="y" den={<Radical>3</Radical>} /> ＝ <Frac num="z" den={<Radical>7</Radical>} /> ＝ λ
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ x ＝ 3λ, y ＝ λ<Radical>3</Radical>, z ＝ λ<Radical>7</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Equation substitution',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3λ － (λ<Radical>3</Radical>)·<Radical>3</Radical> ＋ (λ<Radical>7</Radical>)·<Radical>7</Radical> ＝ ${target}</span>
            </span>
          )
        },
        {
          label: 'Simplification',
          details: (
            <div className="flex flex-col gap-1">
              <span>3λ － 3λ ＋ 7λ ＝ {target}</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 7λ ＝ {target} ⇒ λ ＝ {mult}
              </span>
            </div>
          )
        },
        { label: 'Calculating x', details: `x ＝ 3 · ${mult} ＝ ${3 * mult}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Θέτουμε x ＝ 3λ, y ＝ λ' : 'Let x ＝ 3λ, y ＝ λ'}</span>
          <Radical>3</Radical>
          <span>{isEl ? ', z ＝ λ' : ', z ＝ λ'}</span>
          <Radical>7</Radical>
          <span>. {isEl ? 'Τότε 3λ － 3λ ＋ 7λ ＝ 7λ ＝' : 'Then 3λ － 3λ ＋ 7λ ＝ 7λ ＝'}</span>
          <span>{target},</span>
          <span>{isEl ? `άρα λ ＝ ${mult} και x ＝ 3 · ${mult} ＝ ${3 * mult}.` : `so λ ＝ ${mult} and x ＝ 3 · ${mult} ＝ ${3 * mult}.`}</span>
        </span>
      )
    };
  },
  (locale) => {
    const mult = randInt(4, 8);
    const target = 5 * mult;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Αναλογία με Ρίζες √2 και √5' : 'Proportionality with √2 and √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Οι αριθμοί x, y, z είναι ανάλογοι προς τους 2,' : 'The numbers x, y, z are proportional to 2,'}</span>
          <Radical>2</Radical>
          <span>{isEl ? 'και' : 'and'}</span>
          <Radical>5</Radical>
          <span>{isEl ? ', και ικανοποιούν τη σχέση: x － y ·' : ', satisfying: x － y ·'}</span>
          <Radical>2</Radical>
          <span>{isEl ? '＋ z ·' : '＋ z ·'}</span>
          <Radical>5</Radical>
          <span>＝ {target}. {isEl ? 'Ποια είναι η τιμή του x;' : 'What is the value of x?'}</span>
        </span>
      ),
      correct: 2 * mult,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Αναλογίες',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝ 2λ, y ＝ λ</span><Radical>2</Radical><span>, z ＝ λ</span><Radical>5</Radical>
            </span>
          )
        },
        {
          label: 'Αντικατάσταση',
          details: (
            <div className="flex flex-col gap-1">
              <span>2λ － 2λ ＋ 5λ ＝ {target}</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 5λ ＝ {target} ⇒ λ ＝ {mult}
              </span>
            </div>
          )
        },
        { label: 'Τιμή x', details: `x ＝ 2 · ${mult} ＝ ${2 * mult}` }
      ] : [
        {
          label: 'Proportions',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝ 2λ, y ＝ λ</span><Radical>2</Radical><span>, z ＝ λ</span><Radical>5</Radical>
            </span>
          )
        },
        {
          label: 'Substitution',
          details: (
            <div className="flex flex-col gap-1">
              <span>2λ － 2λ ＋ 5λ ＝ {target}</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 5λ ＝ {target} ⇒ λ ＝ {mult}
              </span>
            </div>
          )
        },
        { label: 'Value of x', details: `x ＝ 2 · ${mult} ＝ ${2 * mult}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Αντικαθιστώντας βρίσκουμε 5λ ＝' : 'Substituting gives 5λ ＝'}</span>
          <span>{target} ⇒ λ ＝ {mult},</span>
          <span>{isEl ? `επομένως x ＝ 2λ ＝ ${2 * mult}.` : `therefore x ＝ 2λ ＝ ${2 * mult}.`}</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Επίλυση Εξίσωσης με Ρίζες' : 'Solving Radical Equation',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η λύση της εξίσωσης' : 'What is the solution of the equation'}</span>
          <Radical>3</Radical>
          <span>· x ＝</span>
          <Radical>48</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Επίλυση ως προς x',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝</span> <Frac num={<Radical>48</Radical>} den={<Radical>3</Radical>} />
            </span>
          )
        },
        {
          label: 'Ιδιότητα πηλίκου ριζών',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝</span> <Radical><Frac num="48" den="3" /></Radical> <span>＝</span> <Radical>16</Radical>
            </span>
          )
        },
        { label: 'Αποτέλεσμα', details: 'x ＝ 4' }
      ] : [
        {
          label: 'Solving for x',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝</span> <Frac num={<Radical>48</Radical>} den={<Radical>3</Radical>} />
            </span>
          )
        },
        {
          label: 'Quotient of radicals',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x ＝</span> <Radical><Frac num="48" den="3" /></Radical> <span>＝</span> <Radical>16</Radical>
            </span>
          )
        },
        { label: 'Result', details: 'x ＝ 4' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>x ＝</span>
          <Radical><Frac num="48" den="3" /></Radical>
          <span>＝</span>
          <Radical>16</Radical>
          <span>＝ 4.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εξίσωση με Δυνάμεις Ριζών' : 'Equation with Radical Powers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Να λυθεί η εξίσωση:' : 'Solve the equation:'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>5</Radical>)<sup>－2</sup> · x</span>
          <span>＝ 2 ·</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>2</Radical>)<sup>2</sup>.</span>
        </span>
      ),
      correct: 20,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1ο μέλος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>5</Radical>)<sup>－2</sup> · x ＝</span> <Frac num="1" den="5" /> <span>· x</span>
            </span>
          )
        },
        {
          label: '2ο μέλος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2 · (<Radical>2</Radical>)² ＝ 2 · 2 ＝ 4</span>
            </span>
          )
        },
        {
          label: 'Εξίσωση',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="5" /> <span>· x ＝ 4 ⇒ x ＝ 4 · 5 ＝ 20</span>
            </span>
          )
        }
      ] : [
        {
          label: 'LHS',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>5</Radical>)<sup>－2</sup> · x ＝</span> <Frac num="1" den="5" /> <span>· x</span>
            </span>
          )
        },
        {
          label: 'RHS',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2 · (<Radical>2</Radical>)² ＝ 2 · 2 ＝ 4</span>
            </span>
          )
        },
        {
          label: 'Equation',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="5" /> <span>· x ＝ 4 ⇒ x ＝ 4 · 5 ＝ 20</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <Frac num="1" den="5" /> <span>· x ＝ 4 ⇒ x ＝ 20.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υπολογισμός Παράστασης με Δοσμένο Άθροισμα' : 'Evaluating Expression with Given Sum',
      prompt: isEl
        ? 'Αν x ＋ y ＝ －4, ποια είναι η τιμή της παράστασης Α ＝ 4x － (3x － y) ＋ 7;'
        : 'If x ＋ y ＝ －4, what is the value of the expression A ＝ 4x － (3x － y) ＋ 7?',
      correct: 3,
      type: 'input',
      tableData: isEl ? [
        { label: 'Απαλοιφή παρένθεσης', details: 'Α ＝ 4x － 3x ＋ y ＋ 7' },
        { label: 'Αναγωγή', details: 'Α ＝ (x ＋ y) ＋ 7' },
        { label: 'Αντικατάσταση x ＋ y ＝ －4', details: 'Α ＝ －4 ＋ 7 ＝ 3' }
      ] : [
        { label: 'Parenthesis removal', details: 'A ＝ 4x － 3x ＋ y ＋ 7' },
        { label: 'Simplification', details: 'A ＝ (x ＋ y) ＋ 7' },
        { label: 'Substitution x ＋ y ＝ －4', details: 'A ＝ －4 ＋ 7 ＝ 3' }
      ],
      explanation: isEl
        ? 'Απαλείφοντας την παρένθεση προκύπτει Α ＝ x ＋ y ＋ 7. Επειδή x ＋ y ＝ －4, έχουμε Α ＝ －4 ＋ 7 ＝ 3.'
        : 'Removing parentheses yields A ＝ x ＋ y ＋ 7. Since x ＋ y ＝ －4, we get A ＝ －4 ＋ 7 ＝ 3.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const noSol = isEl ? 'Καμία λύση (Αδύνατη)' : 'No solution (Impossible)';
    return {
      title: isEl ? 'Εξέταση Αδύνατης Εξίσωσης με Ρίζες' : 'Inconsistent Equation with Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσες λύσεις έχει η εξίσωση' : 'How many solutions does the equation'}</span>
          <Radical>12</Radical>
          <span>· x － 5 ＝ 2 ·</span>
          <Radical>3</Radical>
          <span>· x {isEl ? 'έχει;' : 'have?'}</span>
        </span>
      ),
      correct: noSol,
      type: 'mcq',
      distractors: () => isEl ? [
        'Μία μοναδική λύση το 5',
        'Άπειρες λύσεις (Ταυτότητα)',
        'Μία λύση το 0',
        'Μία λύση το －5'
      ][randInt(0, 3)] : [
        'A unique solution of 5',
        'Infinitely many solutions (Identity)',
        'A single solution of 0',
        'A unique solution of －5'
      ][randInt(0, 3)],
      tableData: isEl ? [
        {
          label: 'Ανάλυση √12',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>12</Radical> <span>＝</span> <Radical>4 · 3</Radical> <span>＝ 2 ·</span> <Radical>3</Radical>
            </span>
          )
        },
        {
          label: 'Μορφή εξίσωσης',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>2 ·</span> <Radical>3</Radical> <span>· x － 5 ＝ 2 ·</span> <Radical>3</Radical> <span>· x</span>
            </span>
          )
        },
        { label: 'Απλοποίηση', details: '0 · x ＝ 5 (Αδύνατη)' }
      ] : [
        {
          label: 'Factoring √12',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>12</Radical> <span>＝</span> <Radical>4 · 3</Radical> <span>＝ 2 ·</span> <Radical>3</Radical>
            </span>
          )
        },
        {
          label: 'Equation form',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>2 ·</span> <Radical>3</Radical> <span>· x － 5 ＝ 2 ·</span> <Radical>3</Radical> <span>· x</span>
            </span>
          )
        },
        { label: 'Simplification', details: '0 · x ＝ 5 (Inconsistent)' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Επειδή</span> <Radical>12</Radical> <span>＝ 2 ·</span> <Radical>3</Radical><span>, οι όροι με το x είναι ίσοι και εξουδετερώνονται: 0 · x ＝ 5, συνεπώς η εξίσωση είναι αδύνατη.</span>
            </>
          ) : (
            <>
              <span>Since</span> <Radical>12</Radical> <span>＝ 2 ·</span> <Radical>3</Radical><span>, terms in x cancel out: 0 · x ＝ 5, thus the equation has no solution.</span>
            </>
          )}
        </span>
      )
    };
  }
];

// POOL Q11: Σύνθετες Αριθμητικές Παραστάσεις (6 σενάρια με i18n)
const PROBLEM_POOL_Q11 = [
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Θέμα Διαγωνισμού Ε.Μ.Ε. «Ο Θαλής»' : 'Mathematical Competition Problem',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Αν ο πραγματικός αριθμός α είναι η ρητή προσέγγιση δεκάτου (0,1) με έλλειψη του' : 'If real number a is the lower tenth approximation (0.1) of'}</span>
          <Radical>5</Radical>
          <span>{isEl ? `(δηλ. α ＝ 2${dec}2), να βρεθεί η τιμή της παράστασης: Α ＝ 3 · (3α － 4${dec}6) － 2 · (α － 0${dec}2).` : `(i.e. a ＝ 2${dec}2), find the value of: A ＝ 3 · (3a － 4${dec}6) － 2 · (a － 0${dec}2).`}</span>
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: isEl ? [
        { label: 'Τιμή του α', details: 'α ＝ 2,2' },
        { label: '1η παρένθεση', details: '3 · 2,2 － 4,6 ＝ 6,6 － 4,6 ＝ 2' },
        { label: '2η παρένθεση', details: '2,2 － 0,2 ＝ 2' },
        { label: 'Τελικός υπολογισμός', details: '3 · 2 － 2 · 2 ＝ 6 － 4 ＝ 2' }
      ] : [
        { label: 'Value of a', details: 'a ＝ 2.2' },
        { label: '1st parenthesis', details: '3 · 2.2 － 4.6 ＝ 6.6 － 4.6 ＝ 2' },
        { label: '2nd parenthesis', details: '2.2 － 0.2 ＝ 2' },
        { label: 'Final calculation', details: '3 · 2 － 2 · 2 ＝ 6 － 4 ＝ 2' }
      ],
      explanation: `3 · (6${dec}6 － 4${dec}6) － 2 · (2${dec}2 － 0${dec}2) ＝ 3 · 2 － 2 · 2 ＝ 6 － 4 ＝ 2.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ένθετες Τετραγωνικές Ρίζες' : 'Nested Square Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <Radical>
            <span>21 ＋ <Radical><span>5 ＋ <Radical><span>133 － <Radical>144</Radical></span></Radical></span></Radical></span>
          </Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1ο βήμα (εσωτερική ρίζα)',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>144</Radical> <span>＝ 12</span>
            </span>
          )
        },
        {
          label: '2ο βήμα',
          details: (
            <div className="flex flex-col gap-1">
              <span>133 － 12 ＝ 121</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>121</Radical> <span>＝ 11</span>
              </span>
            </div>
          )
        },
        {
          label: '3ο βήμα',
          details: (
            <div className="flex flex-col gap-1">
              <span>5 ＋ 11 ＝ 16</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>16</Radical> <span>＝ 4</span>
              </span>
            </div>
          )
        },
        {
          label: '4ο βήμα (τελική ρίζα)',
          details: (
            <div className="flex flex-col gap-1">
              <span>21 ＋ 4 ＝ 25</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>25</Radical> <span>＝ 5</span>
              </span>
            </div>
          )
        }
      ] : [
        {
          label: '1st step (inner root)',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>144</Radical> <span>＝ 12</span>
            </span>
          )
        },
        {
          label: '2nd step',
          details: (
            <div className="flex flex-col gap-1">
              <span>133 － 12 ＝ 121</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>121</Radical> <span>＝ 11</span>
              </span>
            </div>
          )
        },
        {
          label: '3rd step',
          details: (
            <div className="flex flex-col gap-1">
              <span>5 ＋ 11 ＝ 16</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>16</Radical> <span>＝ 4</span>
              </span>
            </div>
          )
        },
        {
          label: '4th step (final root)',
          details: (
            <div className="flex flex-col gap-1">
              <span>21 ＋ 4 ＝ 25</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                <Radical>25</Radical> <span>＝ 5</span>
              </span>
            </div>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Υπολογίζουμε από μέσα προς τα έξω:' : 'Evaluating from inside out:'}</span>
          <Radical>144</Radical> <span>＝ 12 ⇒</span>
          <Radical>133 － 12</Radical> <span>＝</span> <Radical>121</Radical> <span>＝ 11 ⇒</span>
          <Radical>5 ＋ 11</Radical> <span>＝</span> <Radical>16</Radical> <span>＝ 4 ⇒</span>
          <Radical>21 ＋ 4</Radical> <span>＝</span> <Radical>25</Radical> <span>＝ 5.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Σύνθετη Αριθμητική Παράσταση Κλασμάτων' : 'Fractional Arithmetic Expression',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Να υπολογιστεί η τιμή της παράστασης:' : 'Calculate the value of the expression:'}</span>
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <span>(1 －</span> <Frac num="5" den="2" /><span>)</span>
          </span>
          <span>·</span>
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <span>(</span><Frac num="2" den="5" /> <span>－ 1)</span>
          </span>
          <span>－ 5 ·</span>
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <span>(</span><Frac num="－3" den="5" /><span>).</span>
          </span>
        </span>
      ),
      correct: 3.9,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1η παρένθεση',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>1 －</span> <Frac num="5" den="2" /> <span>＝</span> <Frac num="－3" den="2" />
            </span>
          )
        },
        {
          label: '2η παρένθεση',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="5" /> <span>－ 1 ＝</span> <Frac num="－3" den="5" />
            </span>
          )
        },
        {
          label: 'Γινόμενο παρενθέσεων',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(</span><Frac num="－3" den="2" /><span>) · (</span><Frac num="－3" den="5" /><span>) ＝</span> <Frac num="9" den="10" /> <span>＝ 0,9</span>
            </span>
          )
        },
        {
          label: '2ος όρος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>－ 5 · (</span><Frac num="－3" den="5" /><span>) ＝ ＋3</span>
            </span>
          )
        },
        { label: 'Τελικό άθροισμα', details: '0,9 ＋ 3 ＝ 3,9' }
      ] : [
        {
          label: '1st parenthesis',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>1 －</span> <Frac num="5" den="2" /> <span>＝</span> <Frac num="－3" den="2" />
            </span>
          )
        },
        {
          label: '2nd parenthesis',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="5" /> <span>－ 1 ＝</span> <Frac num="－3" den="5" />
            </span>
          )
        },
        {
          label: 'Parentheses product',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(</span><Frac num="－3" den="2" /><span>) · (</span><Frac num="－3" den="5" /><span>) ＝</span> <Frac num="9" den="10" /> <span>＝ 0.9</span>
            </span>
          )
        },
        {
          label: '2nd term',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>－ 5 · (</span><Frac num="－3" den="5" /><span>) ＝ ＋3</span>
            </span>
          )
        },
        { label: 'Final sum', details: '0.9 ＋ 3 ＝ 3.9' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>(</span><Frac num="－3" den="2" /><span>) · (</span><Frac num="－3" den="5" /><span>) ＋ 3 ＝</span>
          <Frac num="9" den="10" /> <span>＋ 3 ＝ 0{dec}9 ＋ 3 ＝ 3{dec}9.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Τοποθέτηση Παρενθέσεων και Προτεραιότητα' : 'Parentheses Placement and Precedence',
      prompt: isEl
        ? 'Πού πρέπει να τοποθετηθούν παρενθέσεις στην έκφραση 4 · 3 : 5 － 2 ώστε το αποτέλεσμα να ισούται ακριβώς με 4;'
        : 'Where should parentheses be inserted in 4 · 3 : 5 － 2 so that the result equals exactly 4?',
      correct: '4 · 3 : (5 － 2)',
      type: 'mcq',
      distractors: () => [
        '(4 · 3) : 5 － 2',
        '4 · (3 : 5) － 2',
        '(4 · 3 : 5) － 2'
      ],
      tableData: isEl ? [
        { label: 'Δοκιμή 4 · 3 : (5 － 2)', details: '4 · 3 : 3 ＝ 12 : 3 ＝ 4 (Σωστό!)' },
        { label: 'Δοκιμή (4 · 3) : 5 － 2', details: '12 : 5 － 2 ＝ 2,4 － 2 ＝ 0,4' }
      ] : [
        { label: 'Test 4 · 3 : (5 － 2)', details: '4 · 3 : 3 ＝ 12 : 3 ＝ 4 (Correct!)' },
        { label: 'Test (4 · 3) : 5 － 2', details: '12 : 5 － 2 ＝ 2.4 － 2 ＝ 0.4' }
      ],
      explanation: isEl
        ? 'Με παρενθέσεις στο 5 － 2 έχουμε 4 · 3 : (3) ＝ 12 : 3 ＝ 4.'
        : 'Placing parentheses at 5 － 2 gives 4 · 3 : (3) ＝ 12 : 3 ＝ 4.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υπολογισμός Υποτείνουσας από Κάθετες Πλευρές' : 'Hypotenuse from Radical Legs',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι' : 'In a right triangle the legs are'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> － 1</span>
          <span>{isEl ? 'και' : 'and'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＋ 1.</span>
          <span>{isEl ? 'Πόσο ισούται το τετράγωνο της υποτείνουσάς του (c²);' : 'What is the square of its hypotenuse (c²)?'}</span>
        </span>
      ),
      correct: 8,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Τετράγωνο 1ης πλευράς',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>3</Radical> － 1)² ＝ 3 － 2·<Radical>3</Radical> ＋ 1 ＝ 4 － 2·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Τετράγωνο 2ης πλευράς',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>3</Radical> ＋ 1)² ＝ 3 ＋ 2·<Radical>3</Radical> ＋ 1 ＝ 4 ＋ 2·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Πυθαγόρειο c² ＝ α² ＋ β²',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(4 － 2·<Radical>3</Radical>) ＋ (4 ＋ 2·<Radical>3</Radical>) ＝ 8</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Square of 1st leg',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>3</Radical> － 1)² ＝ 3 － 2·<Radical>3</Radical> ＋ 1 ＝ 4 － 2·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Square of 2nd leg',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>3</Radical> ＋ 1)² ＝ 3 ＋ 2·<Radical>3</Radical> ＋ 1 ＝ 4 ＋ 2·<Radical>3</Radical></span>
            </span>
          )
        },
        {
          label: 'Pythagorean c² ＝ a² ＋ b²',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(4 － 2·<Radical>3</Radical>) ＋ (4 ＋ 2·<Radical>3</Radical>) ＝ 8</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>c² ＝ (<Radical>3</Radical> － 1)² ＋ (<Radical>3</Radical> ＋ 1)² ＝ 4 － 2·<Radical>3</Radical> ＋ 4 ＋ 2·<Radical>3</Radical> ＝ 8.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Θέμα Διαγωνισμού Ε.Μ.Ε. με Παραμέτρους' : 'Parametric Identity Problem',
      prompt: isEl
        ? 'Αν α － β ＝ 2, να υπολογιστεί η τιμή της παράστασης Α ＝ 5 · (2α ＋ β) － 5 · (α ＋ 2β).'
        : 'If a － b ＝ 2, calculate the value of the expression A ＝ 5 · (2a ＋ b) － 5 · (a ＋ 2b).',
      correct: 10,
      type: 'input',
      tableData: isEl ? [
        { label: 'Επιμεριστική', details: '10α ＋ 5β － 5α － 10β' },
        { label: 'Αναγωγή', details: '5α － 5β ＝ 5 · (α － β)' },
        { label: 'Αντικατάσταση α － β ＝ 2', details: '5 · 2 ＝ 10' }
      ] : [
        { label: 'Distributive property', details: '10a ＋ 5b － 5a － 10b' },
        { label: 'Simplification', details: '5a － 5b ＝ 5 · (a － b)' },
        { label: 'Substitution a － b ＝ 2', details: '5 · 2 ＝ 10' }
      ],
      explanation: isEl
        ? 'Α ＝ 5α － 5β ＝ 5 · (α － β) ＝ 5 · 2 ＝ 10.'
        : 'A ＝ 5a － 5b ＝ 5 · (a － b) ＝ 5 · 2 ＝ 10.'
    };
  }
];

// POOL Q12: Γεωμετρικά & Ρεαλιστικά Προβλήματα (6 σενάρια με i18n)
const PROBLEM_POOL_Q12 = [
  (locale) => {
    const p1 = 68;
    const p2 = 70;
    const p3 = 54;
    const p4 = 60;
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Πρόβλημα Καταμερισμού Οικοπέδων' : 'Land Partition Perimeter Problem',
      prompt: isEl
        ? `Τέσσερα αδέλφια χώρισαν ένα ορθογώνιο οικόπεδο σε 4 μικρότερα με παράλληλες γραμμές. Τα οικόπεδα έχουν περιμέτρους ${p1} m, ${p2} m, ${p3} m και ${p4} m αντίστοιχα. Ποια είναι η εξωτερική περίμετρος ολόκληρου του αρχικού οικοπέδου σε μέτρα;`
        : `Four siblings divided a rectangular plot into 4 smaller plots using parallel lines. The plots have perimeters of ${p1} m, ${p2} m, ${p3} m, and ${p4} m respectively. What is the outer perimeter of the entire original plot in meters?`,
      correct: 126,
      type: 'input',
      unit: 'm',
      tableData: isEl ? [
        { label: 'Άθροισμα περιμέτρων 4 οικοπέδων', details: `${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ 252 m` },
        { label: 'Ανάλυση πλευρών', details: 'Κάθε εξωτερική πλευρά μετράται 1 φορά, κάθε εσωτερική 2 φορές' },
        {
          label: 'Εξωτερική περίμετρος',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="252" den="2" /> <span>＝ 126 m</span>
            </span>
          )
        }
      ] : [
        { label: 'Sum of 4 perimeters', details: `${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ 252 m` },
        { label: 'Edge analysis', details: 'Each outer edge is counted once, each inner edge twice' },
        {
          label: 'Outer perimeter',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="252" den="2" /> <span>＝ 126 m</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το άθροισμα των περιμέτρων των 4 οικοπέδων περιέχει την εξωτερική περίμετρο διπλάσια. Άρα η εξωτερική περίμετρος είναι</span>
              <Frac num="252" den="2" /> <span>＝ 126 m.</span>
            </>
          ) : (
            <>
              <span>The sum of all four perimeters contains twice the outer perimeter. Hence the outer perimeter is</span>
              <Frac num="252" den="2" /> <span>＝ 126 m.</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υποτείνουσα Ορθογωνίου Τριγώνου με Ρίζες' : 'Hypotenuse with Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές έχουν μήκη 3 ·' : 'In a right triangle the legs have lengths 3 ·'}</span>
          <Radical>2</Radical> <span>cm</span>
          <span>{isEl ? 'και 4 ·' : 'and 4 ·'}</span>
          <Radical>2</Radical> <span>cm.</span>
          <span>{isEl ? 'Πόσο είναι το μήκος της υποτείνουσάς του σε cm;' : 'What is the length of its hypotenuse in cm?'}</span>
        </span>
      ),
      correct: '5·√2',
      type: 'mcq',
      distractors: () => ['7·√2', '10', '5·√4'],
      renderOption: (opt) => {
        if (opt === '5·√2') return <span className="inline-flex items-center whitespace-nowrap">5 · <Radical>2</Radical> cm</span>;
        if (opt === '7·√2') return <span className="inline-flex items-center whitespace-nowrap">7 · <Radical>2</Radical> cm</span>;
        if (opt === '5·√4') return <span className="inline-flex items-center whitespace-nowrap">5 · <Radical>4</Radical> cm</span>;
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Τετράγωνο 1ης πλευράς',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (3 · <Radical>2</Radical>)² ＝ 9 · 2 ＝ 18
            </span>
          )
        },
        {
          label: 'Τετράγωνο 2ης πλευράς',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (4 · <Radical>2</Radical>)² ＝ 16 · 2 ＝ 32
            </span>
          )
        },
        {
          label: 'Υποτείνουσα c²',
          details: (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">c² ＝ 18 ＋ 32 ＝ 50</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700 whitespace-nowrap">
                ⇒ c ＝ <Radical>50</Radical> ＝ <Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical> cm
              </span>
            </div>
          )
        }
      ] : [
        {
          label: 'Square of 1st leg',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (3 · <Radical>2</Radical>)² ＝ 9 · 2 ＝ 18
            </span>
          )
        },
        {
          label: 'Square of 2nd leg',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (4 · <Radical>2</Radical>)² ＝ 16 · 2 ＝ 32
            </span>
          )
        },
        {
          label: 'Hypotenuse c²',
          details: (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">c² ＝ 18 ＋ 32 ＝ 50</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700 whitespace-nowrap">
                ⇒ c ＝ <Radical>50</Radical> ＝ <Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical> cm
              </span>
            </div>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>c² ＝ 18 ＋ 32 ＝ 50 ⇒</span>
          <span className="inline-flex items-center whitespace-nowrap">
            c ＝ <Radical>50</Radical> ＝ 5 · <Radical>2</Radical> cm.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εμβαδόν Τριγώνου με Πλευρές Ρίζες' : 'Triangle Area with Radical Legs',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το εμβαδόν ορθογωνίου τριγώνου με κάθετες πλευρές 3 ·' : 'What is the area of a right triangle with legs 3 ·'}</span>
          <Radical>2</Radical> <span>cm</span>
          <span>{isEl ? 'και 4 ·' : 'and 4 ·'}</span>
          <Radical>2</Radical> <span>{isEl ? 'cm σε cm²;' : 'cm in cm²?'}</span>
        </span>
      ),
      correct: 12,
      type: 'input',
      unit: 'cm²',
      tableData: isEl ? [
        {
          label: 'Τύπος εμβαδού',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>Ε ＝</span> <Frac num="α · β" den="2" />
            </span>
          )
        },
        {
          label: 'Γινόμενο πλευρών',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                (3 · <Radical>2</Radical>) · (4 · <Radical>2</Radical>)
              </span>
              <span className="inline-flex items-center whitespace-nowrap align-middle text-indigo-700 font-bold">
                ＝ 12 · (<Radical>2</Radical>)² ＝ 12 · 2 ＝ 24
              </span>
            </div>
          )
        },
        {
          label: 'Υπολογισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="24" den="2" /> <span>＝ 12 cm²</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Area formula',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>A ＝</span> <Frac num="a · b" den="2" />
            </span>
          )
        },
        {
          label: 'Product of legs',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                (3 · <Radical>2</Radical>) · (4 · <Radical>2</Radical>)
              </span>
              <span className="inline-flex items-center whitespace-nowrap align-middle text-indigo-700 font-bold">
                ＝ 12 · (<Radical>2</Radical>)² ＝ 12 · 2 ＝ 24
              </span>
            </div>
          )
        },
        {
          label: 'Calculation',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="24" den="2" /> <span>＝ 12 cm²</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Ε ＝</span>
          <Frac
            num={
              <span className="inline-flex items-center whitespace-nowrap">
                (3 · <Radical>2</Radical>) · (4 · <Radical>2</Radical>)
              </span>
            }
            den="2"
          />
          <span>＝</span>
          <Frac num="12 · 2" den="2" />
          <span>＝ 12 cm².</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση Γεωμετρικής Διάστασης με Ρίζες' : 'Geometric Dimension Simplification',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το μήκος ενός οικοπέδου δίνεται από την παράσταση L ＝ 3 ·' : 'The length of a plot is given by L ＝ 3 ·'}</span>
          <Radical>48</Radical>
          <span>－ 2 ·</span>
          <Radical>75</Radical>.
          <span>{isEl ? 'Ποιος είναι ο συντελεστής του' : 'What is the coefficient of'}</span>
          <Radical>3</Radical>
          <span>{isEl ? 'στην απλοποιημένη του μορφή (α ·' : 'in its simplified form (a ·'}</span>
          <Radical>3</Radical><span>){isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Ανάλυση √48',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Radical>48</Radical> <span>＝</span> <Radical>16 · 3</Radical> <span>＝ 4 ·</span> <Radical>3</Radical>
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-700 font-bold whitespace-nowrap">
                ⇒ 3 · 4 · <Radical>3</Radical> ＝ 12 · <Radical>3</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Ανάλυση √75',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Radical>75</Radical> <span>＝</span> <Radical>25 · 3</Radical> <span>＝ 5 ·</span> <Radical>3</Radical>
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-700 font-bold whitespace-nowrap">
                ⇒ 2 · 5 · <Radical>3</Radical> ＝ 10 · <Radical>3</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Αφαίρεση',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>12 ·</span> <Radical>3</Radical> <span>－ 10 ·</span> <Radical>3</Radical> <span>＝ 2 ·</span> <Radical>3</Radical>
            </span>
          )
        }
      ] : [
        {
          label: 'Factoring √48',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Radical>48</Radical> <span>＝</span> <Radical>16 · 3</Radical> <span>＝ 4 ·</span> <Radical>3</Radical>
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-700 font-bold whitespace-nowrap">
                ⇒ 3 · 4 · <Radical>3</Radical> ＝ 12 · <Radical>3</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Factoring √75',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Radical>75</Radical> <span>＝</span> <Radical>25 · 3</Radical> <span>＝ 5 ·</span> <Radical>3</Radical>
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-700 font-bold whitespace-nowrap">
                ⇒ 2 · 5 · <Radical>3</Radical> ＝ 10 · <Radical>3</Radical>
              </span>
            </div>
          )
        },
        {
          label: 'Subtraction',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>12 ·</span> <Radical>3</Radical> <span>－ 10 ·</span> <Radical>3</Radical> <span>＝ 2 ·</span> <Radical>3</Radical>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>3 · (4 ·</span> <Radical>3</Radical><span>) － 2 · (5 ·</span> <Radical>3</Radical><span>) ＝ 12 ·</span> <Radical>3</Radical> <span>－ 10 ·</span> <Radical>3</Radical> <span>＝ 2 ·</span> <Radical>3</Radical>.
          <span>{isEl ? 'Ο συντελεστής είναι 2.' : 'The coefficient is 2.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εμβαδόν Τετραγώνου με Άθροισμα Ριζών' : 'Square Area with Sum of Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ένα τετράγωνο έχει πλευρά μήκους s ＝' : 'A square has side length s ＝'}</span>
          <Radical>8</Radical> <span>＋</span> <Radical>2</Radical> <span>m.</span>
          <span>{isEl ? 'Πόσο είναι το εμβαδόν του σε m²;' : 'What is its area in m²?'}</span>
        </span>
      ),
      correct: 18,
      type: 'input',
      unit: 'm²',
      tableData: isEl ? [
        {
          label: 'Απλοποίηση πλευράς',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>8</Radical> <span>＝ 2 ·</span> <Radical>2</Radical> <span>⇒ s ＝ 2 ·</span> <Radical>2</Radical> <span>＋</span> <Radical>2</Radical> <span>＝ 3 ·</span> <Radical>2</Radical> <span>m</span>
            </span>
          )
        },
        {
          label: 'Τύπος εμβαδού',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>Ε ＝ s² ＝ (3 ·</span> <Radical>2</Radical><span>)² ＝ 9 · 2 ＝ 18 m²</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Side simplification',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>8</Radical> <span>＝ 2 ·</span> <Radical>2</Radical> <span>⇒ s ＝ 2 ·</span> <Radical>2</Radical> <span>＋</span> <Radical>2</Radical> <span>＝ 3 ·</span> <Radical>2</Radical> <span>m</span>
            </span>
          )
        },
        {
          label: 'Area formula',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span>A ＝ s² ＝ (3 ·</span> <Radical>2</Radical><span>)² ＝ 9 · 2 ＝ 18 m²</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>s ＝ 2 ·</span> <Radical>2</Radical> <span>＋</span> <Radical>2</Radical> <span>＝ 3 ·</span> <Radical>2</Radical> <span>m.</span>
          <span>Ε ＝ (3 ·</span> <Radical>2</Radical><span>)² ＝ 9 · 2 ＝ 18 m².</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const correctAns = isEl
      ? `Ναι, γιατί η διαγώνιος της πόρτας είναι √5 ≈ 2${dec}24 m ＞ 2${dec}10 m`
      : `Yes, because the door diagonal is √5 ≈ 2${dec}24 m ＞ 2${dec}10 m`;
    return {
      title: isEl ? 'Ρεαλιστικό Πρόβλημα Διέλευσης (Πυθαγόρειο)' : 'Realistic Passage Problem (Pythagorean)',
      prompt: isEl
        ? 'Μια πόρτα έχει ύψος 2 m και πλάτος 1 m. Μπορεί να περάσει πλάγια από την πόρτα ένας τετράγωνος καθρέφτης πλευράς 2,10 m (χωρίς να γείρει εκτός επιπέδου);'
        : 'A door is 2 m high and 1 m wide. Can a square mirror with side length 2.10 m pass through the door tilted (in-plane)?',
      correct: correctAns,
      type: 'mcq',
      distractors: () => isEl ? [
        'Όχι, γιατί το ύψος 2 m είναι μικρότερο από το 2,10 m',
        'Όχι, γιατί το πλάτος 1 m είναι πολύ στενό',
        'Ναι, μόνο αν αφαιρεθεί η κάσα της πόρτας'
      ] : [
        'No, because the height 2 m is less than 2.10 m',
        'No, because the width 1 m is too narrow',
        'Yes, only if the door frame is removed'
      ],
      renderOption: (opt) => {
        if (opt === correctAns) {
          return (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEl ? 'Ναι, γιατί η διαγώνιος της πόρτας είναι' : 'Yes, because the door diagonal is'}</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <Radical>5</Radical> <span>≈ 2{dec}24 m ＞ 2{dec}10 m</span>
              </span>
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Διαγώνιος πόρτας d',
          details: (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">d² ＝ 2² ＋ 1² ＝ 4 ＋ 1 ＝ 5</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700 whitespace-nowrap">
                ⇒ d ＝ <Radical>5</Radical> m
              </span>
            </div>
          )
        },
        {
          label: 'Ρητή προσέγγιση',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>5</Radical> <span>≈ 2,236 m</span>
            </span>
          )
        },
        { label: 'Σύγκριση', details: '2,10 m ＜ 2,236 m (χωράει διαγώνια)' }
      ] : [
        {
          label: 'Door diagonal d',
          details: (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">d² ＝ 2² ＋ 1² ＝ 4 ＋ 1 ＝ 5</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700 whitespace-nowrap">
                ⇒ d ＝ <Radical>5</Radical> m
              </span>
            </div>
          )
        },
        {
          label: 'Rational approximation',
          details: (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Radical>5</Radical> <span>≈ 2.236 m</span>
            </span>
          )
        },
        { label: 'Comparison', details: '2.10 m ＜ 2.236 m (fits diagonally)' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Η διαγώνιος της πόρτας είναι</span>
              <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ≈ 2,24 m.</span>
              <span>Επειδή 2,10 m ＜ 2,24 m, ο καθρέφτης μπορεί να περάσει τοποθετημένος διαγώνια.</span>
            </>
          ) : (
            <>
              <span>The diagonal of the door is</span>
              <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ≈ 2.24 m.</span>
              <span>Since 2.10 m ＜ 2.24 m, the mirror can pass through positioned diagonally.</span>
            </>
          )}
        </span>
      )
    };
  }
];

export default function PrakseisPragmatikonExercises() {
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
      metaTitle: "Ασκήσεις: Πράξεις Πραγματικών Αριθμών | Γ' Γυμνασίου",
      metaDesc: "Διαδραστικές ασκήσεις στις πράξεις και τις ιδιότητες των πραγματικών αριθμών, αναγωγή ριζών και επιμεριστική με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
      backText: "Θεωρία Κεφ. 4",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeClass: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
      bannerTitle: "Πράξεις Πραγματικών Αριθμών: Εξάσκηση",
      bannerSubtitle: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα πράξεων, επιμεριστικής, αναλογιών και ριζών.",
      btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      resultHeading: (s) => `Αποτέλεσμα: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις πράξεις και τις ιδιότητες των πραγματικών αριθμών.",
      feedbackGood: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
      feedbackPoor: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους κανόνες προσήμων και τις ρίζες!",
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
      falseLabel: "Λάθος"
    },
    en: {
      metaTitle: "Exercises: Real Number Operations | 9th Grade",
      metaDesc: "Interactive exercises on operations and properties of real numbers, radical reduction, and distributive law for 9th Grade.",
      backText: "Theory Ch. 4",
      btnTheory: "THEORY",
      badgeClass: "EXERCISES • 9TH GRADE",
      bannerTitle: "Real Number Operations: Practice",
      bannerSubtitle: "12 dynamic questions and applied problems on operations, distribution, proportions, and radicals.",
      btnNewExercises: "NEW EXERCISES",
      resultHeading: (s) => `Result: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Outstanding performance! You thoroughly understand real number operations and properties.",
      feedbackGood: "Very good effort! Review the detailed steps below for the questions you found tricky.",
      feedbackPoor: "Needs a bit more practice. Consult the theory for sign rules and radicals!",
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
      falseLabel: "False"
    }
  };

  const cur = t[locale] || t.el;

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Αντιμεταθετική ιδιότητα
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Αντιμεταθετική Ιδιότητα στο ℝ' : 'Commutative Property in ℝ',
      prompt: isEl
        ? (q1IsCorrect
            ? 'Για οποιουσδήποτε πραγματικούς αριθμούς α και β, ισχύει πάντοτε α ＋ β ＝ β ＋ α και α · β ＝ β · α.'
            : 'Η αντιμεταθετική ιδιότητα ισχύει μόνο για τους ρητούς αριθμούς και παύει να ισχύει όταν συμμετέχουν άρρητοι.')
        : (q1IsCorrect
            ? 'For any real numbers a and b, it always holds that a ＋ b ＝ b ＋ a and a · b ＝ b · a.'
            : 'The commutative property applies only to rational numbers and ceases to hold when irrational numbers are involved.'),
      type: 'tf',
      correct: q1IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Η αντιμεταθετική ιδιότητα ισχύει καθολικά για όλους τους πραγματικούς αριθμούς.'
        : 'The commutative property holds universally for all real numbers.'
    });

    // Q2: True / False - Διαίρεση με το μηδέν
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: isEl ? 'Διαίρεση με το Μηδέν' : 'Division by Zero',
      prompt: q2Choice
        ? (isEl
            ? 'Η διαίρεση πραγματικού αριθμού με το μηδέν (δηλαδή κλάσμα με παρονομαστή 0) δεν ορίζεται ποτέ.'
            : 'Division of a real number by zero (i.e. a fraction with denominator 0) is never defined.')
        : (isEl
            ? 'Αν διαιρέσουμε έναν πραγματικό αριθμό με το μηδέν, το πηλίκο ισούται πάντοτε με 0.'
            : 'If we divide a real number by zero, the quotient is always equal to 0.'),
      type: 'tf',
      correct: q2Choice ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Στα μαθηματικά η διαίρεση με το μηδέν δεν ορίζεται ποτέ.'
        : 'In mathematics, division by zero is never defined.'
    });

    // Q3: MCQ - Αντίστροφοι αριθμοί
    qList.push({
      id: 3,
      title: isEl ? 'Αντίστροφοι Πραγματικοί Αριθμοί' : 'Reciprocal Real Numbers',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Ποιος είναι ο αντίστροφος του αριθμού' : 'What is the reciprocal of the number'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>－</span><Frac num="2" den="5" />
          </span>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'mcq',
      correct: '－5/2',
      options: ensureFourUniqueOptions('－5/2', () => ['2/5', '5/2', '－2/5'][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === '－5/2') return <span className="inline-flex items-center whitespace-nowrap">－<Frac num="5" den="2" /></span>;
        if (opt === '5/2') return <Frac num="5" den="2" />;
        if (opt === '2/5') return <Frac num="2" den="5" />;
        if (opt === '－2/5') return <span className="inline-flex items-center whitespace-nowrap">－<Frac num="2" den="5" /></span>;
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο αντίστροφος ενός κλάσματος</span>
              <Frac num="α" den="β" />
              <span>είναι ο</span>
              <Frac num="β" den="α" />
              <span>και διατηρεί το ίδιο πρόσημο:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(－</span><Frac num="2" den="5" /><span>) · (－</span><Frac num="5" den="2" /><span>) ＝ 1.</span>
              </span>
            </>
          ) : (
            <>
              <span>The reciprocal of</span>
              <Frac num="a" den="b" />
              <span>is</span>
              <Frac num="b" den="a" />
              <span>and maintains the same sign:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(－</span><Frac num="2" den="5" /><span>) · (－</span><Frac num="5" den="2" /><span>) ＝ 1.</span>
              </span>
            </>
          )}
        </span>
      )
    });

    // Q4: MCQ - Πρόσθεση μη όμοιων ριζών
    const q4Correct = isEl
      ? 'Δεν απλοποιείται περαιτέρω (δεν ισούται με √5)'
      : 'Cannot be simplified further (does not equal √5)';
    qList.push({
      id: 4,
      title: isEl ? 'Πρόσθεση Μη Όμοιων Ριζών' : 'Adding Unlike Radicals',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Η παράσταση' : 'The expression'}</span>
          <Radical>2</Radical> <span>＋</span> <Radical>3</Radical><span>:</span>
        </span>
      ),
      type: 'mcq',
      correct: q4Correct,
      options: ensureFourUniqueOptions(q4Correct, () => isEl ? [
        'Ισούται με √5',
        'Ισούται με √6',
        'Ισούται με 5'
      ][randInt(0, 2)] : [
        'Equals √5',
        'Equals √6',
        'Equals 5'
      ][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === 'Ισούται με √5' || opt === 'Equals √5') {
          return (
            <span className="inline-flex items-center gap-1">
              <span>{isEl ? 'Ισούται με' : 'Equals'}</span> <Radical>5</Radical>
            </span>
          );
        }
        if (opt === 'Ισούται με √6' || opt === 'Equals √6') {
          return (
            <span className="inline-flex items-center gap-1">
              <span>{isEl ? 'Ισούται με' : 'Equals'}</span> <Radical>6</Radical>
            </span>
          );
        }
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Προσθέτουμε μόνο όμοιες ρίζες. Η έκφραση</span>
              <Radical>2</Radical> <span>＋</span> <Radical>3</Radical> <span>δεν ισούται με</span> <Radical>5</Radical>.
            </>
          ) : (
            <>
              <span>We only add like radicals. The expression</span>
              <Radical>2</Radical> <span>＋</span> <Radical>3</Radical> <span>does not equal</span> <Radical>5</Radical>.
            </>
          )}
        </span>
      )
    });

    // Q5: Input - Γινόμενο με αντίστροφο
    qList.push({
      id: 5,
      title: isEl ? 'Γινόμενο με Αντίστροφο' : 'Product with Reciprocal',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται το γινόμενο' : 'What does the product equal'}</span>
          <Radical>13</Radical> <span>·</span> <Frac num="1" den={<Radical>13</Radical>} /><span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: isEl
        ? 'Το γινόμενο κάθε μη μηδενικού πραγματικού με τον αντίστροφό του ισούται με 1.'
        : 'The product of any non-zero real number with its reciprocal equals 1.'
    });

    // Q6: MCQ - Πρόσημο γινομένου
    const q6CorrectStr = isEl ? 'Θετικό (＋)' : 'Positive (＋)';
    qList.push({
      id: 6,
      title: isEl ? 'Κανόνας Προσήμων Γινομένου' : 'Product Sign Rule',
      prompt: isEl
        ? 'Ποιο είναι το πρόσημο του γινομένου (－1) · (－α) · (－β), αν α ＜ 0 και β ＞ 0;'
        : 'What is the sign of the product (－1) · (－a) · (－b), if a ＜ 0 and b ＞ 0?',
      type: 'mcq',
      correct: q6CorrectStr,
      options: ensureFourUniqueOptions(q6CorrectStr, () => isEl ? [
        'Αρνητικό (－)',
        'Μηδέν',
        'Εξαρτάται από τις τιμές'
      ][randInt(0, 2)] : [
        'Negative (－)',
        'Zero',
        'Depends on values'
      ][randInt(0, 2)]),
      tableData: isEl ? [
        { label: 'Πρόσημο του －1', details: 'Αρνητικό (－)' },
        { label: 'Πρόσημο του －α (α ＜ 0)', details: 'Θετικό (＋)' },
        { label: 'Πρόσημο του －β (β ＞ 0)', details: 'Αρνητικό (－)' },
        { label: 'Συνολικό γινόμενο', details: '(－) · (＋) · (－) ＝ ＋ (θετικό)' }
      ] : [
        { label: 'Sign of －1', details: 'Negative (－)' },
        { label: 'Sign of －a (a ＜ 0)', details: 'Positive (＋)' },
        { label: 'Sign of －b (b ＞ 0)', details: 'Negative (－)' },
        { label: 'Overall product', details: '(－) · (＋) · (－) ＝ ＋ (positive)' }
      ],
      explanation: isEl
        ? 'Έχουμε δύο αρνητικούς παράγοντες και έναν θετικό, άρα το γινόμενο είναι θετικό (＋).'
        : 'We have two negative factors and one positive factor, so the overall product is positive (＋).'
    });

    // Q7: Input - Άθροισμα αντιθέτων
    const valK = randInt(4, 9);
    qList.push({
      id: 7,
      title: isEl ? 'Άθροισμα Αντιθέτων Πραγματικών' : 'Sum of Additive Inverses',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <span>{valK} ·</span> <Radical>3</Radical> <span>＋ (－{valK} ·</span> <Radical>3</Radical><span>){isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'input',
      correct: 0,
      explanation: isEl
        ? 'Το άθροισμα δύο αντίθετων πραγματικών αριθμών είναι πάντοτε ίσο με 0.'
        : 'The sum of two additive inverses is always 0.'
    });

    // Q8: MCQ - Επιμεριστική Ιδιότητα
    qList.push({
      id: 8,
      title: isEl ? 'Επιμεριστική Ιδιότητα' : 'Distributive Property',
      prompt: isEl
        ? 'Ποια από τις παρακάτω σχέσεις εκφράζει σωστά την επιμεριστική ιδιότητα;'
        : 'Which of the following relations correctly states the distributive property?',
      type: 'mcq',
      correct: 'α · (β ＋ γ) ＝ α · β ＋ α · γ',
      options: ensureFourUniqueOptions('α · (β ＋ γ) ＝ α · β ＋ α · γ', () => [
        'α · (β ＋ γ) ＝ α · β ＋ γ',
        'α ＋ (β · γ) ＝ (α ＋ β) · (α ＋ γ)',
        'α · (β · γ) ＝ (α · β) · γ'
      ][randInt(0, 2)]),
      explanation: isEl
        ? 'Ο εξωτερικός πολλαπλασιαστής επιμερίζεται σε κάθε όρο της παρένθεσης.'
        : 'The outer factor is distributed to every term inside the parentheses.'
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
      backUrl="/g-gymnasiou/04-prakseis-pragmatikon"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/04-prakseis-pragmatikon"
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
                                <td className="p-2 font-semibold text-slate-800 whitespace-nowrap">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words [overflow-wrap:anywhere]">{row.details}</td>
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