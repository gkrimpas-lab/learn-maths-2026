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

// POOL Q9: Σύνθετη Απλοποίηση Παραστάσεων Δυνάμεων (Βάσεις 2, 3, 5)
const PROBLEM_POOL_Q9 = [
  // 1. Παράσταση μορφής (2^a * 2^b)^c / 2^d
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(1, 3);
    const expNum = (a - b) * 2;
    const d = expNum - randInt(1, 2);
    const finalExp = expNum - d;
    const finalVal = Math.pow(2, finalExp);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Σύνθετη Απλοποίηση Δυνάμεων Βάσης 2' : 'Powers of 2 Simplification',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Να υπολογιστεί η αριθμητική τιμή της παράστασης' : 'Calculate the numerical value of the expression'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">(2<sup>{a}</sup> · 2<sup>－{b}</sup>)<sup>2</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">2<sup>{d}</sup></span>}
          />.
        </span>
      ),
      correct: finalVal,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1. Γινόμενο στην παρένθεση',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2<sup>{a}－{b}</sup> ＝ 2<sup>{a - b}</sup></span>
            </span>
          )
        },
        {
          label: '2. Δύναμη δύναμης',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(2<sup>{a - b}</sup>)² ＝ 2<sup>{expNum}</sup></span>
            </span>
          )
        },
        {
          label: '3. Πηλίκο δυνάμεων',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>2<sup>{expNum}</sup></span>} den={<span>2<sup>{d}</sup></span>} />
              <span>＝ 2<sup>{expNum}－{d}</sup> ＝ 2<sup>{finalExp}</sup> ＝ {finalVal}</span>
            </span>
          )
        }
      ] : [
        {
          label: '1. Product in parentheses',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2<sup>{a}－{b}</sup> ＝ 2<sup>{a - b}</sup></span>
            </span>
          )
        },
        {
          label: '2. Power of a power',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(2<sup>{a - b}</sup>)² ＝ 2<sup>{expNum}</sup></span>
            </span>
          )
        },
        {
          label: '3. Quotient of powers',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>2<sup>{expNum}</sup></span>} den={<span>2<sup>{d}</sup></span>} />
              <span>＝ 2<sup>{expNum}－{d}</sup> ＝ 2<sup>{finalExp}</sup> ＝ {finalVal}</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Εφαρμόζουμε κατά σειρά τις ιδιότητες: αᵐ · αⁿ ＝ αᵐ⁺ⁿ, (αᵐ)ⁿ ＝ αᵐ·ⁿ και</span>
              <Frac num={<span>α<sup>m</sup></span>} den={<span>α<sup>n</sup></span>} />
              <span>＝ α<sup>m－n</sup>. Το αποτέλεσμα είναι 2<sup>{finalExp}</sup> ＝ {finalVal}.</span>
            </>
          ) : (
            <>
              <span>Applying power rules in sequence: aᵐ · aⁿ ＝ aᵐ⁺ⁿ, (aᵐ)ⁿ ＝ aᵐ·ⁿ and</span>
              <Frac num={<span>a<sup>m</sup></span>} den={<span>a<sup>n</sup></span>} />
              <span>＝ a<sup>m－n</sup>. The result is 2<sup>{finalExp}</sup> ＝ {finalVal}.</span>
            </>
          )}
        </span>
      )
    };
  },
  // 2. Μετατροπή βάσης 9 και 27 σε δύναμη του 3
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Αναγωγή Δυνάμεων σε Κοινή Βάση 3' : 'Powers of 3 Base Reduction',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">9<sup>3</sup> · 3<sup>－2</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">27<sup>1</sup> · 3</span>}
          />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Αναγωγή στη βάση 3',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>9³ ＝ (3²)³ ＝ 3⁶</span>
              <span>και</span>
              <span>27¹ ＝ 3³</span>
            </span>
          )
        },
        {
          label: 'Αριθμητής',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3⁶ · 3<sup>－2</sup> ＝ 3<sup>6－2</sup> ＝ 3⁴</span>
            </span>
          )
        },
        {
          label: 'Παρονομαστής',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3³ · 3¹ ＝ 3<sup>3＋1</sup> ＝ 3⁴</span>
            </span>
          )
        },
        {
          label: 'Αποτέλεσμα',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>3<sup>4</sup></span>} den={<span>3<sup>4</sup></span>} />
              <span>＝ 1</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Reduction to base 3',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>9³ ＝ (3²)³ ＝ 3⁶</span>
              <span>and</span>
              <span>27¹ ＝ 3³</span>
            </span>
          )
        },
        {
          label: 'Numerator',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3⁶ · 3<sup>－2</sup> ＝ 3<sup>6－2</sup> ＝ 3⁴</span>
            </span>
          )
        },
        {
          label: 'Denominator',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3³ · 3¹ ＝ 3<sup>3＋1</sup> ＝ 3⁴</span>
            </span>
          )
        },
        {
          label: 'Result',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>3<sup>4</sup></span>} den={<span>3<sup>4</sup></span>} />
              <span>＝ 1</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Γράφουμε όλες τις βάσεις ως δυνάμεις του 3: 9³ ＝ 3⁶ και 27¹ · 3 ＝ 3⁴. Έτσι:</span>
              <Frac num={<span>3<sup>4</sup></span>} den={<span>3<sup>4</sup></span>} />
              <span>＝ 1.</span>
            </>
          ) : (
            <>
              <span>Express all bases as powers of 3: 9³ ＝ 3⁶ and 27¹ · 3 ＝ 3⁴. Thus:</span>
              <Frac num={<span>3<sup>4</sup></span>} den={<span>3<sup>4</sup></span>} />
              <span>＝ 1.</span>
            </>
          )}
        </span>
      )
    };
  },
  // 3. Δυνάμεις κλασμάτων με αρνητικό εκθέτη
  (locale) => {
    const a = randInt(2, 3);
    const b = randInt(4, 5);
    const val = Math.pow(b, 2) - Math.pow(a, 2);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Διαφορά Δυνάμεων με Αρνητικούς Εκθέτες' : 'Difference of Powers with Negative Exponents',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Frac num="1" den={`${b}`} />)<sup>－2</sup></span>
          <span>－</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Frac num="1" den={`${a}`} />)<sup>－2</sup>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: val,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1ος όρος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Frac num="1" den={`${b}`} />)<sup>－2</sup> ＝ {b}² ＝ {b * b}</span>
            </span>
          )
        },
        {
          label: '2ος όρος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Frac num="1" den={`${a}`} />)<sup>－2</sup> ＝ {a}² ＝ {a * a}</span>
            </span>
          )
        },
        { label: 'Διαφορά', details: `${b * b} － ${a * a} ＝ ${val}` }
      ] : [
        {
          label: '1st term',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Frac num="1" den={`${b}`} />)<sup>－2</sup> ＝ {b}² ＝ {b * b}</span>
            </span>
          )
        },
        {
          label: '2nd term',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Frac num="1" den={`${a}`} />)<sup>－2</sup> ＝ {a}² ＝ {a * a}</span>
            </span>
          )
        },
        { label: 'Difference', details: `${b * b} － ${a * a} ＝ ${val}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο αρνητικός εκθέτης αντιστρέφει το κλάσμα:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(</span><Frac num="1" den="β" /><span>)<sup>－2</sup> ＝ β².</span>
              </span>
              <span>Επομένως {b * b} － ${a * a} ＝ ${val}.</span>
            </>
          ) : (
            <>
              <span>A negative exponent inverts the fraction:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(</span><Frac num="1" den="b" /><span>)<sup>－2</sup> ＝ b².</span>
              </span>
              <span>Thus {b * b} － ${a * a} ＝ ${val}.</span>
            </>
          )}
        </span>
      )
    };
  },
  // 4. Άθροισμα δυνάμεων του (-1)
  (locale) => {
    const n = randInt(10, 50) * 2; // Άρτιος
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Διαδοχικές Δυνάμεις του (－1)' : 'Successive Powers of (－1)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(－1)<sup>{n}</sup></span>
          <span>＋</span>
          <span className="inline-flex items-center whitespace-nowrap">(－1)<sup>{n + 1}</sup></span>
          <span>＋</span>
          <span className="inline-flex items-center whitespace-nowrap">(－1)<sup>{n + 2}</sup>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        {
          label: `(－1)^${n} (άρτιος)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n}</sup> ＝ ＋1</span>
            </span>
          )
        },
        {
          label: `(－1)^${n + 1} (περιττός)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n + 1}</sup> ＝ －1</span>
            </span>
          )
        },
        {
          label: `(－1)^${n + 2} (άρτιος)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n + 2}</sup> ＝ ＋1</span>
            </span>
          )
        },
        { label: 'Άθροισμα', details: '1 ＋ (－1) ＋ 1 ＝ 1' }
      ] : [
        {
          label: `(－1)^${n} (even)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n}</sup> ＝ ＋1</span>
            </span>
          )
        },
        {
          label: `(－1)^${n + 1} (odd)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n + 1}</sup> ＝ －1</span>
            </span>
          )
        },
        {
          label: `(－1)^${n + 2} (even)`,
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(－1)<sup>{n + 2}</sup> ＝ ＋1</span>
            </span>
          )
        },
        { label: 'Sum', details: '1 ＋ (－1) ＋ 1 ＝ 1' }
      ],
      explanation: isEl
        ? 'Το －1 σε άρτιο εκθέτη δίνει ＋1, ενώ σε περιττό δίνει －1. Έτσι: 1 － 1 ＋ 1 ＝ 1.'
        : '－1 to an even power equals ＋1, while to an odd power it equals －1. Thus: 1 － 1 ＋ 1 ＝ 1.'
    };
  },
  // 5. Συνδυασμός δύναμης και ρίζας
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Συνδυασμός Δύναμης και Τετραγωνικής Ρίζας' : 'Powers of Radicals Combination',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of the expression'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">(<Radical>2</Radical>)<sup>6</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">2<sup>2</sup></span>}
          />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Υπολογισμός αριθμητή',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>2</Radical>)⁶ ＝ ((<Radical>2</Radical>)²)³ ＝ 2³ ＝ 8</span>
            </span>
          )
        },
        { label: 'Υπολογισμός παρονομαστή', details: '2² ＝ 4' },
        {
          label: 'Πηλίκο',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="8" den="4" /> <span>＝ 2 (ή 2<sup>3－2</sup> ＝ 2¹ ＝ 2)</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Numerator calculation',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>(<Radical>2</Radical>)⁶ ＝ ((<Radical>2</Radical>)²)³ ＝ 2³ ＝ 8</span>
            </span>
          )
        },
        { label: 'Denominator calculation', details: '2² ＝ 4' },
        {
          label: 'Quotient',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="8" den="4" /> <span>＝ 2 (or 2<sup>3－2</sup> ＝ 2¹ ＝ 2)</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Επειδή (<Radical>2</Radical>)² ＝ 2, έχουμε (<Radical>2</Radical>)⁶ ＝ 2³ ＝ 8. Άρα</span>
              <Frac num="8" den="4" /> <span>＝ 2.</span>
            </>
          ) : (
            <>
              <span>Since (<Radical>2</Radical>)² ＝ 2, (<Radical>2</Radical>)⁶ ＝ 2³ ＝ 8. Thus</span>
              <Frac num="8" den="4" /> <span>＝ 2.</span>
            </>
          )}
        </span>
      )
    };
  },
  // 6. Γινόμενο δυνάμεων με αντίθετους εκθέτες
  (locale) => {
    const a = randInt(2, 4);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Παράσταση με Μηδενικό Τελικό Εκθέτη' : 'Expression with Zero Exponent',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of'}</span>
          <span className="inline-flex items-center whitespace-nowrap">5<sup>{a}</sup> · (5<sup>－1</sup>)<sup>{a}</sup></span>
          <span>＋</span>
          <span className="inline-flex items-center whitespace-nowrap">7<sup>0</sup>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: isEl ? [
        {
          label: '1ο γινόμενο',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>5<sup>{a}</sup> · 5<sup>－{a}</sup> ＝ 5<sup>0</sup> ＝ 1</span>
            </span>
          )
        },
        { label: '2ος όρος', details: '7⁰ ＝ 1' },
        { label: 'Άθροισμα', details: '1 ＋ 1 ＝ 2' }
      ] : [
        {
          label: '1st product',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>5<sup>{a}</sup> · 5<sup>－{a}</sup> ＝ 5<sup>0</sup> ＝ 1</span>
            </span>
          )
        },
        { label: '2nd term', details: '7⁰ ＝ 1' },
        { label: 'Sum', details: '1 ＋ 1 ＝ 2' }
      ],
      explanation: isEl
        ? `5^${a} · 5^(－${a}) ＝ 5⁰ ＝ 1 και 7⁰ ＝ 1. Το άθροισμα ισούται με 2.`
        : `5^${a} · 5^(－${a}) ＝ 5⁰ ＝ 1 and 7⁰ ＝ 1. The sum equals 2.`
    };
  }
];

// POOL Q10: Παραστάσεις με Μεταβλητές & Εκθέτες
const PROBLEM_POOL_Q10 = [
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση Μονωνύμων με Εκθέτες' : 'Simplifying Monomials with Exponents',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Απλοποιώντας την παράσταση' : 'Simplifying the expression'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">(2 · x<sup>2</sup> · y)<sup>3</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">4 · x<sup>4</sup> · y<sup>3</sup></span>}
          />
          <span>{isEl ? 'για x, y ≠ 0, ποιο μονώνυμο προκύπτει;' : 'for x, y ≠ 0, which monomial is obtained?'}</span>
        </span>
      ),
      correct: '2 · x²',
      type: 'mcq',
      distractors: () => ['4 · x²', '2 · x', 'x²'],
      renderOption: (opt) => opt,
      tableData: isEl ? [
        { label: 'Αριθμητής', details: '2³ · (x²)³ · y³ ＝ 8 · x⁶ · y³' },
        { label: 'Παρονομαστής', details: '4 · x⁴ · y³' },
        {
          label: 'Διαίρεση',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num="8" den="4" /> <span>· x<sup>6－4</sup> · y<sup>3－3</sup></span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 2 · x² · 1 ＝ 2 · x²
              </span>
            </div>
          )
        }
      ] : [
        { label: 'Numerator', details: '2³ · (x²)³ · y³ ＝ 8 · x⁶ · y³' },
        { label: 'Denominator', details: '4 · x⁴ · y³' },
        {
          label: 'Division',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num="8" den="4" /> <span>· x<sup>6－4</sup> · y<sup>3－3</sup></span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 2 · x² · 1 ＝ 2 · x²
              </span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? 'Υψώνουμε κάθε παράγοντα του αριθμητή στην 3η δύναμη και κατόπιν διαιρούμε τους συντελεστές και τις μεταβλητές.'
        : 'Raise each factor in the numerator to the 3rd power, then divide numerical coefficients and variables.'
    };
  },
  (locale) => {
    const k = randInt(2, 4);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση Αλγεβρικού Κλάσματος Δυνάμεων' : 'Algebraic Fraction Simplification',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιος είναι ο συντελεστής του x στην απλοποιημένη μορφή του κλάσματος' : 'What is the coefficient of x in the simplified form of'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">{k * 3} · x<sup>5</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">3 · x<sup>4</sup></span>}
          />
          <span>(x ≠ 0);</span>
        </span>
      ),
      correct: k,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Συντελεστές',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={`${k * 3}`} den="3" /> <span>＝ {k}</span>
            </span>
          )
        },
        {
          label: 'Μεταβλητή',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>x<sup>5</sup></span>} den={<span>x<sup>4</sup></span>} />
              <span>＝ x<sup>5－4</sup> ＝ x</span>
            </span>
          )
        },
        { label: 'Αποτέλεσμα', details: `${k} · x` }
      ] : [
        {
          label: 'Coefficients',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={`${k * 3}`} den="3" /> <span>＝ {k}</span>
            </span>
          )
        },
        {
          label: 'Variable',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>x<sup>5</sup></span>} den={<span>x<sup>4</sup></span>} />
              <span>＝ x<sup>5－4</sup> ＝ x</span>
            </span>
          )
        },
        { label: 'Result', details: `${k} · x` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Διαιρούμε αριθμητή και παρονομαστή:' : 'Dividing numerator by denominator:'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>(</span><Frac num={`${k * 3}`} den="3" /><span>) · x<sup>5－4</sup> ＝ {k} · x.</span>
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απλοποίηση με Αρνητικό Εκθέτη σε Μεταβλητή' : 'Negative Exponent with Variable',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιος είναι ο εκθέτης του x στην παράσταση' : 'What is the exponent of x in'}</span>
          <span className="inline-flex items-center whitespace-nowrap">x<sup>－3</sup> · (x<sup>2</sup>)<sup>4</sup></span>
          <span>(x ≠ 0);</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        { label: 'Δύναμη δύναμης', details: '(x²)⁴ ＝ x⁸' },
        {
          label: 'Γινόμενο',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x<sup>－3</sup> · x<sup>8</sup> ＝ x<sup>－3＋8</sup> ＝ x<sup>5</sup></span>
            </span>
          )
        }
      ] : [
        { label: 'Power of a power', details: '(x²)⁴ ＝ x⁸' },
        {
          label: 'Product',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>x<sup>－3</sup> · x<sup>8</sup> ＝ x<sup>－3＋8</sup> ＝ x<sup>5</sup></span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Πρώτα εκτελούμε τη δύναμη δύναμης (x²)⁴ ＝ x⁸ και μετά προσθέτουμε τους εκθέτες: －3 ＋ 8 ＝ 5.'
        : 'First compute the power of a power (x²)⁴ ＝ x⁸, then add exponents: －3 ＋ 8 ＝ 5.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Πρόσημο Αλγεβρικής Δύναμης' : 'Sign of Algebraic Power',
      prompt: isEl
        ? 'Αν x πραγματικός αριθμός με x ≠ 0, ποια από τις παρακάτω παραστάσεις είναι ΠΑΝΤΟΤΕ θετική;'
        : 'If x is a real number with x ≠ 0, which expression is ALWAYS positive?',
      correct: 'x⁴',
      type: 'mcq',
      distractors: () => ['x³', '－x²', 'x⁵'],
      tableData: isEl ? [
        { label: 'x⁴ (άρτιος εκθέτης)', details: 'Πάντοτε x⁴ ＞ 0 για κάθε x ≠ 0' },
        { label: 'x³, x⁵ (περιττός εκθέτης)', details: 'Αρνητικό αν x ＜ 0' },
        { label: '－x²', details: 'Πάντοτε αρνητικό (－x² ＜ 0)' }
      ] : [
        { label: 'x⁴ (even exponent)', details: 'Always x⁴ ＞ 0 for all x ≠ 0' },
        { label: 'x³, x⁵ (odd exponent)', details: 'Negative if x ＜ 0' },
        { label: '－x²', details: 'Always negative (－x² ＜ 0)' }
      ],
      explanation: isEl
        ? 'Κάθε μη μηδενικός αριθμός υψωμένος σε άρτιο εκθέτη (όπως το 4) είναι πάντοτε θετικός.'
        : 'Any non-zero real number raised to an even exponent (such as 4) is always positive.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ισότητα Δυνάμεων με Μεταβλητή στον Εκθέτη' : 'Exponential Equation Base 2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Αν 2ˣ ＝ 32, ποια είναι η τιμή του πραγματικού αριθμού x;' : 'If 2ˣ ＝ 32, what is the value of the real number x?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        { label: 'Ανάλυση του 32', details: '32 ＝ 2 · 2 · 2 · 2 · 2 ＝ 2⁵' },
        {
          label: 'Εξίσωση',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2ˣ ＝ 2⁵ ⇒ x ＝ 5</span>
            </span>
          )
        }
      ] : [
        { label: 'Factoring 32', details: '32 ＝ 2 · 2 · 2 · 2 · 2 ＝ 2⁵' },
        {
          label: 'Equation',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2ˣ ＝ 2⁵ ⇒ x ＝ 5</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Επειδή 2⁵ ＝ 32 και οι βάσεις είναι ίσες, έπεται ότι x ＝ 5.'
        : 'Since 2⁵ ＝ 32 and bases are identical, it follows that x ＝ 5.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εξίσωση με Αρνητικό Εκθέτη' : 'Equation with Negative Exponent',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Αν' : 'If'} 3<sup>x</sup> ＝</span>
          <Frac num="1" den="27" />
          <span>{isEl ? ', ποια είναι η τιμή του x;' : ', what is the value of x?'}</span>
        </span>
      ),
      correct: -3,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Ανάλυση κλάσματος',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="27" /> <span>＝</span> <Frac num="1" den={<span>3<sup>3</sup></span>} /> <span>＝ 3<sup>－3</sup></span>
            </span>
          )
        },
        {
          label: 'Εξίσωση',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3ˣ ＝ 3<sup>－3</sup> ⇒ x ＝ －3</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Fraction representation',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="27" /> <span>＝</span> <Frac num="1" den={<span>3<sup>3</sup></span>} /> <span>＝ 3<sup>－3</sup></span>
            </span>
          )
        },
        {
          label: 'Equation',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3ˣ ＝ 3<sup>－3</sup> ⇒ x ＝ －3</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το' : 'The fraction'}</span>
          <Frac num="1" den="27" />
          <span>{isEl ? 'γράφεται ως 3⁻³, άρα x ＝ －3.' : 'can be written as 3⁻³, thus x ＝ －3.'}</span>
        </span>
      )
    };
  }
];

// POOL Q11: Τυποποιημένη Μορφή & Πράξεις (Επιστημονική Σημειογραφία)
const PROBLEM_POOL_Q11 = [
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const correctStr = isEl ? '1,2 · 10¹⁰' : '1.2 · 10¹⁰';
    return {
      title: isEl ? 'Γινόμενο σε Τυποποιημένη Μορφή' : 'Product in Scientific Notation',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται το γινόμενο (3 · 10⁵) · (4 · 10⁴) εκφρασμένο σε τυποποιημένη μορφή;' : 'What is the product (3 · 10⁵) · (4 · 10⁴) in scientific notation?'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? ['12 · 10⁹', '1,2 · 10⁹', '12 · 10²⁰'] : ['12 · 10⁹', '1.2 · 10⁹', '12 · 10²⁰'],
      tableData: isEl ? [
        { label: 'Πολλαπλασιασμός', details: '(3 · 4) · (10⁵ · 10⁴) ＝ 12 · 10⁹' },
        {
          label: 'Τυποποίηση (1 ≤ α ＜ 10)',
          details: (
            <div className="flex flex-col gap-1">
              <span>12 ＝ 1,2 · 10¹</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ (1,2 · 10¹) · 10⁹ ＝ 1,2 · 10¹⁰
              </span>
            </div>
          )
        }
      ] : [
        { label: 'Multiplication', details: '(3 · 4) · (10⁵ · 10⁴) ＝ 12 · 10⁹' },
        {
          label: 'Normalization (1 ≤ a ＜ 10)',
          details: (
            <div className="flex flex-col gap-1">
              <span>12 ＝ 1.2 · 10¹</span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ (1.2 · 10¹) · 10⁹ ＝ 1.2 · 10¹⁰
              </span>
            </div>
          )
        }
      ],
      explanation: `12 · 10⁹ ＝ (1${dec}2 · 10¹) · 10⁹ ＝ 1${dec}2 · 10¹⁰.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const correctStr = isEl ? '2,5 · 10⁻⁴' : '2.5 · 10⁻⁴';
    return {
      title: isEl ? 'Διαίρεση σε Τυποποιημένη Μορφή' : 'Division in Scientific Notation',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται το πηλίκο' : 'What is the quotient'}</span>
          <Frac
            num={<span className="inline-flex items-center whitespace-nowrap">2 · 10<sup>4</sup></span>}
            den={<span className="inline-flex items-center whitespace-nowrap">8 · 10<sup>7</sup></span>}
          />
          <span>{isEl ? 'σε τυποποιημένη μορφή;' : 'in scientific notation?'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? ['0,25 · 10⁻³', '2,5 · 10⁻³', '4 · 10⁻⁴'] : ['0.25 · 10⁻³', '2.5 · 10⁻³', '4 · 10⁻⁴'],
      tableData: isEl ? [
        {
          label: 'Διαίρεση συντελεστών',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="8" /> <span>＝ 0,25</span>
            </span>
          )
        },
        {
          label: 'Διαίρεση δυνάμεων',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>10<sup>4</sup></span>} den={<span>10<sup>7</sup></span>} />
              <span>＝ 10<sup>4－7</sup> ＝ 10<sup>－3</sup></span>
            </span>
          )
        },
        {
          label: 'Τυποποίηση',
          details: '0,25 · 10⁻³ ＝ (2,5 · 10⁻¹) · 10⁻³ ＝ 2,5 · 10⁻⁴'
        }
      ] : [
        {
          label: 'Coefficients division',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="2" den="8" /> <span>＝ 0.25</span>
            </span>
          )
        },
        {
          label: 'Powers division',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>10<sup>4</sup></span>} den={<span>10<sup>7</sup></span>} />
              <span>＝ 10<sup>4－7</sup> ＝ 10<sup>－3</sup></span>
            </span>
          )
        },
        {
          label: 'Normalization',
          details: '0.25 · 10⁻³ ＝ (2.5 · 10⁻¹) · 10⁻³ ＝ 2.5 · 10⁻⁴'
        }
      ],
      explanation: `0${dec}25 · 10⁻³ ＝ 2${dec}5 · 10⁻⁴.`
    };
  },
  (locale) => {
    const zeros = randInt(4, 6);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εκθέτης Μικρού Αριθμού' : 'Exponent of Small Number',
      prompt: isEl
        ? `Αν γράψουμε τον δεκαδικό αριθμό 0,${'0'.repeat(zeros)}5 σε τυποποιημένη μορφή 5 · 10ᵏ, ποιος είναι ο ακέραιος εκθέτης k;`
        : `If we write the decimal 0.${'0'.repeat(zeros)}5 in scientific notation as 5 · 10ᵏ, what is the integer exponent k?`,
      correct: -(zeros + 1),
      type: 'input',
      tableData: isEl ? [
        { label: 'Πλήθος δεκαδικών θέσεων', details: `${zeros + 1} θέσεις δεξιά` },
        { label: 'Τυποποιημένη μορφή', details: `5 · 10^(－${zeros + 1})` }
      ] : [
        { label: 'Decimal shift count', details: `${zeros + 1} places to the right` },
        { label: 'Scientific notation', details: `5 · 10^(－${zeros + 1})` }
      ],
      explanation: isEl
        ? `Η υποδιαστολή μετακινείται ${zeros + 1} θέσεις προς τα δεξιά, άρα k ＝ －${zeros + 1}.`
        : `The decimal point moves ${zeros + 1} places to the right, so k ＝ －${zeros + 1}.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Πρόσθεση Αριθμών σε Τυποποιημένη Μορφή' : 'Adding Scientific Notation Numbers',
      prompt: isEl
        ? 'Πόσο ισούται το άθροισμα 3 · 10⁴ ＋ 5 · 10³;'
        : 'What does the sum 3 · 10⁴ ＋ 5 · 10³ equal?',
      correct: 35000,
      type: 'input',
      tableData: isEl ? [
        { label: '3 · 10⁴', details: '30.000' },
        { label: '5 · 10³', details: '5.000' },
        { label: 'Άθροισμα', details: '30.000 ＋ 5.000 ＝ 35.000' }
      ] : [
        { label: '3 · 10⁴', details: '30,000' },
        { label: '5 · 10³', details: '5,000' },
        { label: 'Sum', details: '30,000 ＋ 5,000 ＝ 35,000' }
      ],
      explanation: isEl
        ? '30.000 ＋ 5.000 ＝ 35.000 (ή 3,5 · 10⁴).'
        : '30,000 ＋ 5,000 ＝ 35,000 (or 3.5 · 10⁴).'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Τάξη Μεγέθους / Σύγκριση' : 'Order of Magnitude Comparison',
      prompt: isEl
        ? 'Πόσες φορές μεγαλύτερος είναι ο αριθμός 6 · 10⁸ από τον αριθμό 2 · 10⁵;'
        : 'How many times greater is the number 6 · 10⁸ compared to 2 · 10⁵?',
      correct: 3000,
      type: 'input',
      unit: isEl ? 'φορές' : 'times',
      tableData: isEl ? [
        {
          label: 'Πηλίκο',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>6 · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} />
            </span>
          )
        },
        {
          label: 'Υπολογισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="6" den="2" /> <span>· 10<sup>8－5</sup> ＝ 3 · 10³ ＝ 3.000</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Quotient',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>6 · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} />
            </span>
          )
        },
        {
          label: 'Calculation',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="6" den="2" /> <span>· 10<sup>8－5</sup> ＝ 3 · 10³ ＝ 3,000</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <Frac num={<span>6 · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} />
          <span>＝ 3 · 10³ ＝ {isEl ? '3.000 φορές.' : '3,000 times.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Τετράγωνο Αριθμού σε Τυποποιημένη Μορφή' : 'Square in Scientific Notation',
      prompt: isEl
        ? 'Πόσο ισούται η δύναμη (2 · 10³)² σε τυποποιημένη μορφή;'
        : 'What does the power (2 · 10³)² equal in scientific notation?',
      correct: '4 · 10⁶',
      type: 'mcq',
      distractors: () => ['4 · 10⁵', '2 · 10⁶', '4 · 10⁹'],
      tableData: isEl ? [
        { label: 'Ανάπτυγμα', details: '2² · (10³)²' },
        { label: 'Υπολογισμός', details: '4 · 10^(3·2) ＝ 4 · 10⁶' }
      ] : [
        { label: 'Expansion', details: '2² · (10³)²' },
        { label: 'Calculation', details: '4 · 10^(3·2) ＝ 4 · 10⁶' }
      ],
      explanation: '(2 · 10³)² ＝ 2² · (10³)² ＝ 4 · 10⁶.'
    };
  }
];

// POOL Q12: Εφαρμοσμένα Προβλήματα Φυσικής & Γεωμετρίας
const PROBLEM_POOL_Q12 = [
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Χρόνος Διάδοσης Φωτός από τον Ήλιο' : 'Sunlight Propagation Time',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? `Η απόσταση Γης - Ήλιου είναι περίπου 1${dec}5 · 10⁸ km και το φως κινείται με ταχύτητα 3 · 10⁵ km/s. Πόσα δευτερόλεπτα χρειάζεται το φως για να φτάσει στη Γη;` : `The Earth-Sun distance is approximately 1${dec}5 · 10⁸ km and light travels at 3 · 10⁵ km/s. How many seconds does sunlight take to reach Earth?`}</span>
        </span>
      ),
      correct: 500,
      type: 'input',
      unit: 's',
      tableData: isEl ? [
        {
          label: 'Τύπος χρόνου',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>t ＝</span> <Frac num="s" den="v" />
            </span>
          )
        },
        {
          label: 'Διαίρεση',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num={<span>1,5 · 10<sup>8</sup></span>} den={<span>3 · 10<sup>5</sup></span>} />
                <span>＝ (</span><Frac num="1,5" den="3" /><span>) · 10³</span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 0,5 · 1.000 ＝ 500 s
              </span>
            </div>
          )
        }
      ] : [
        {
          label: 'Time formula',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>t ＝</span> <Frac num="s" den="v" />
            </span>
          )
        },
        {
          label: 'Division',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1">
                <Frac num={<span>1.5 · 10<sup>8</sup></span>} den={<span>3 · 10<sup>5</sup></span>} />
                <span>＝ (</span><Frac num="1.5" den="3" /><span>) · 10³</span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-indigo-700">
                ⇒ 0.5 · 1,000 ＝ 500 s
              </span>
            </div>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>t ＝</span>
          <Frac num={<span>1{dec}5 · 10<sup>8</sup></span>} den={<span>3 · 10<sup>5</sup></span>} />
          <span>＝ 0{dec}5 · 10³ ＝ {isEl ? '500 δευτερόλεπτα (περίπου 8 λεπτά και 20 δευτερόλεπτα).' : '500 seconds (about 8 minutes and 20 seconds).'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Μεταβολή Όγκου Κύβου' : 'Cube Volume Scaling',
      prompt: isEl
        ? 'Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου (από α σε 2α), πόσες φορές αυξάνεται ο όγκος του;'
        : 'If the edge length of a cube is doubled (from a to 2a), by what factor does its volume increase?',
      correct: 8,
      type: 'input',
      unit: isEl ? 'φορές' : 'times',
      tableData: isEl ? [
        { label: 'Αρχικός όγκος V₁', details: 'α³' },
        { label: 'Νέος όγκος V₂', details: '(2α)³ ＝ 2³ · α³ ＝ 8 · α³' },
        {
          label: 'Λόγος όγκων',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>V<sub>2</sub></span>} den={<span>V<sub>1</sub></span>} />
              <span>＝ 8</span>
            </span>
          )
        }
      ] : [
        { label: 'Initial volume V₁', details: 'a³' },
        { label: 'New volume V₂', details: '(2a)³ ＝ 2³ · a³ ＝ 8 · a³' },
        {
          label: 'Volume ratio',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>V<sub>2</sub></span>} den={<span>V<sub>1</sub></span>} />
              <span>＝ 8</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Ο όγκος εξαρτάται από την 3η δύναμη της ακμής: (2α)³ ＝ 8 · α³, άρα ο όγκος οκταπλασιάζεται (8 φορές).'
        : 'Volume scales with the 3rd power of the edge: (2a)³ ＝ 8 · a³, so volume increases by a factor of 8.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Μεταβολή Εμβαδού Επιφάνειας Κύβου' : 'Cube Surface Area Scaling',
      prompt: isEl
        ? 'Αν τριπλασιάσουμε την ακμή ενός κύβου (από α σε 3α), πόσες φορές αυξάνεται το εμβαδόν της ολικής του επιφάνειας;'
        : 'If the edge length of a cube is tripled (from a to 3a), by what factor does its total surface area increase?',
      correct: 9,
      type: 'input',
      unit: isEl ? 'φορές' : 'times',
      tableData: isEl ? [
        { label: 'Αρχικό εμβαδόν Ε₁', details: '6 · α²' },
        { label: 'Νέο εμβαδόν Ε₂', details: '6 · (3α)² ＝ 6 · 9 · α² ＝ 9 · Ε₁' },
        {
          label: 'Λόγος εμβαδών',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>Ε<sub>2</sub></span>} den={<span>Ε<sub>1</sub></span>} />
              <span>＝ 9</span>
            </span>
          )
        }
      ] : [
        { label: 'Initial surface area S₁', details: '6 · a²' },
        { label: 'New surface area S₂', details: '6 · (3a)² ＝ 6 · 9 · a² ＝ 9 · S₁' },
        {
          label: 'Surface area ratio',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={<span>S<sub>2</sub></span>} den={<span>S<sub>1</sub></span>} />
              <span>＝ 9</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Το εμβαδόν εξαρτάται από το τετράγωνο της ακμής: (3α)² ＝ 9 · α², άρα εννεαπλασιάζεται (9 φορές).'
        : 'Surface area scales with the square of the edge: (3a)² ＝ 9 · a², thus it increases 9-fold.'
    };
  },
  (locale) => {
    const hours = randInt(3, 5);
    const cells = Math.pow(2, hours);
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Εκθετικός Πολλαπλασιασμός Βακτηρίων' : 'Exponential Bacterial Growth',
      prompt: isEl
        ? `Ένας πληθυσμός βακτηρίων διπλασιάζεται κάθε ώρα (2ⁿ). Αν ξεκινήσουμε με 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από ${hours} ώρες;`
        : `A bacterial population doubles every hour (2ⁿ). Starting with 1 bacterium, how many bacteria will exist after ${hours} hours?`,
      correct: cells,
      type: 'input',
      unit: isEl ? 'βακτήρια' : 'bacteria',
      tableData: isEl ? [
        { label: 'Τύπος πληθυσμού', details: '2^t όπου t οι ώρες' },
        { label: 'Υπολογισμός', details: `2^${hours} ＝ ${cells}` }
      ] : [
        { label: 'Population formula', details: '2^t where t is in hours' },
        { label: 'Calculation', details: `2^${hours} ＝ ${cells}` }
      ],
      explanation: isEl
        ? `Κάθε ώρα ο πληθυσμός διπλασιάζεται: 2^${hours} ＝ ${cells} βακτήρια.`
        : `Population doubles each hour: 2^${hours} ＝ ${cells} bacteria.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const correctStr = isEl ? '3,4 · 10⁻⁴ kg' : '3.4 · 10⁻⁴ kg';
    return {
      title: isEl ? 'Μάζα Ατόμων σε Τυποποιημένη Μορφή' : 'Atomic Mass in Scientific Notation',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? `Αν ένα άτομο υδρογόνου έχει μάζα 1${dec}7 · 10` : `If a hydrogen atom has a mass of 1${dec}7 · 10`}<sup>－27</sup> kg, {isEl ? `ποια είναι η μάζα 2 · 10²³ ατόμων υδρογόνου σε kg;` : `what is the total mass of 2 · 10²³ hydrogen atoms in kg?`}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? ['3,4 · 10⁻⁵⁰ kg', '3,4 · 10⁴ kg', '1,7 · 10⁻⁴ kg'] : ['3.4 · 10⁻⁵⁰ kg', '3.4 · 10⁴ kg', '1.7 · 10⁻⁴ kg'],
      tableData: isEl ? [
        { label: 'Γινόμενο μαζών', details: '(1,7 · 10⁻²⁷) · (2 · 10²³)' },
        { label: 'Υπολογισμός', details: '(1,7 · 2) · 10^(－27＋23) ＝ 3,4 · 10⁻⁴ kg' }
      ] : [
        { label: 'Mass product', details: '(1.7 · 10⁻²⁷) · (2 · 10²³)' },
        { label: 'Calculation', details: '(1.7 · 2) · 10^(－27＋23) ＝ 3.4 · 10⁻⁴ kg' }
      ],
      explanation: `(1${dec}7 · 2) · 10^(－27＋23) ＝ 3${dec}4 · 10⁻⁴ kg.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const correctStr = isEl ? '1,3 · 10⁻⁴ m' : '1.3 · 10⁻⁴ m';
    return {
      title: isEl ? 'Διάμετρος Οπτικής Ίνας σε Μέτρα' : 'Optical Fiber Diameter',
      prompt: isEl
        ? 'Η διάμετρος μιας οπτικής ίνας είναι 130 μικρόμετρα (1 μm ＝ 10⁻⁶ m). Ποια είναι η διάμετρός της σε μέτρα σε τυποποιημένη μορφή;'
        : 'The diameter of an optical fiber is 130 micrometers (1 μm ＝ 10⁻⁶ m). What is its diameter in meters in scientific notation?',
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? ['13 · 10⁻⁵ m', '1,3 · 10⁻⁶ m', '1,3 · 10⁻⁸ m'] : ['13 · 10⁻⁵ m', '1.3 · 10⁻⁶ m', '1.3 · 10⁻⁸ m'],
      tableData: isEl ? [
        { label: 'Μετατροπή', details: '130 · 10⁻⁶ m' },
        { label: 'Τυποποίηση', details: '(1,3 · 10²) · 10⁻⁶ ＝ 1,3 · 10⁻⁴ m' }
      ] : [
        { label: 'Conversion', details: '130 · 10⁻⁶ m' },
        { label: 'Normalization', details: '(1.3 · 10²) · 10⁻⁶ ＝ 1.3 · 10⁻⁴ m' }
      ],
      explanation: `130 · 10⁻⁶ ＝ (1${dec}3 · 10²) · 10⁻⁶ ＝ 1${dec}3 · 10⁻⁴ m.`
    };
  }
];

export default function DinameisPragmatikonExercises() {
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
      metaTitle: "Ασκήσεις: Δυνάμεις Πραγματικών Αριθμών | Γ' Γυμνασίου",
      metaDesc: "Διαδραστικές ασκήσεις στις δυνάμεις πραγματικών αριθμών, ιδιότητες, αρνητικούς εκθέτες και τυποποιημένη μορφή με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
      backText: "Θεωρία Κεφ. 5",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeClass: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
      bannerTitle: "Δυνάμεις Πραγματικών Αριθμών: Εξάσκηση",
      bannerSubtitle: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα ιδιοτήτων, αρνητικών εκθετών και τυποποιημένης μορφής.",
      btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      resultHeading: (s) => `Αποτέλεσμα: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις δυνάμεις, τις ιδιότητες και την τυποποιημένη μορφή.",
      feedbackGood: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
      feedbackPoor: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους αρνητικούς εκθέτες και τους κανόνες προσήμων!",
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
      metaTitle: "Exercises: Powers of Real Numbers | 9th Grade",
      metaDesc: "Interactive exercises on powers of real numbers, exponent rules, negative exponents, and scientific notation for 9th Grade.",
      backText: "Theory Ch. 5",
      btnTheory: "THEORY",
      badgeClass: "EXERCISES • 9TH GRADE",
      bannerTitle: "Powers of Real Numbers: Practice",
      bannerSubtitle: "12 dynamic questions and applied problems on power properties, negative exponents, and scientific notation.",
      btnNewExercises: "NEW EXERCISES",
      resultHeading: (s) => `Result: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Outstanding performance! You thoroughly understand powers, exponent laws, and scientific notation.",
      feedbackGood: "Very good effort! Review the detailed steps below for the questions you found tricky.",
      feedbackPoor: "Needs a bit more practice. Consult the theory for negative exponents and sign rules!",
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

    // Q1: True / False - Μηδενικός εκθέτης
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Μηδενικός Εκθέτης' : 'Zero Exponent Rule',
      prompt: isEl
        ? (q1IsCorrect
            ? 'Για κάθε πραγματικό αριθμό α ≠ 0, ισχύει πάντοτε α⁰ ＝ 1.'
            : 'Για κάθε πραγματικό αριθμό α, ισχύει πάντοτε α⁰ ＝ 0.')
        : (q1IsCorrect
            ? 'For any real number a ≠ 0, it always holds that a⁰ ＝ 1.'
            : 'For any real number a, it always holds that a⁰ ＝ 0.'),
      type: 'tf',
      correct: q1IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Εξ ορισμού, κάθε μη μηδενικός πραγματικός αριθμός υψωμένος στο μηδέν ισούται με 1 (α⁰ ＝ 1). Το 0⁰ δεν ορίζεται.'
        : 'By definition, any non-zero real number raised to the zero power equals 1 (a⁰ ＝ 1). 0⁰ is undefined.'
    });

    // Q2: True / False - Αρνητικός εκθέτης
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: isEl ? 'Έννοια Αρνητικού Εκθέτη' : 'Concept of Negative Exponent',
      prompt: q2Choice
        ? (isEl ? (
            <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
              <span>Ο αρνητικός εκθέτης σε έναν πραγματικό αριθμό σημαίνει αντιστροφή της βάσης</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(α<sup>－ν</sup> ＝</span>
                <Frac num="1" den={<span>α<sup>ν</sup></span>} />
                <span>).</span>
              </span>
            </span>
          ) : (
            <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
              <span>A negative exponent on a real number means reciprocating the base</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(a<sup>－n</sup> ＝</span>
                <Frac num="1" den={<span>a<sup>n</sup></span>} />
                <span>).</span>
              </span>
            </span>
          ))
        : (isEl
            ? 'Ο αρνητικός εκθέτης μετατρέπει το τελικό αποτέλεσμα υποχρεωτικά σε αρνητικό αριθμό.'
            : 'A negative exponent necessarily converts the final result into a negative number.'),
      type: 'tf',
      correct: q2Choice ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο αρνητικός εκθέτης δηλώνει τον αντίστροφο της δύναμης:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>α<sup>－ν</sup> ＝</span>
                <Frac num="1" den={<span>α<sup>ν</sup></span>} />
              </span>
              <span>και δεν καθορίζει το πρόσημο του αποτελέσματος</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(π.χ. 2<sup>－3</sup> ＝</span>
                <Frac num="1" den="8" />
                <span>＞ 0).</span>
              </span>
            </>
          ) : (
            <>
              <span>A negative exponent represents the reciprocal of the power:</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>a<sup>－n</sup> ＝</span>
                <Frac num="1" den={<span>a<sup>n</sup></span>} />
              </span>
              <span>and does not determine the sign of the result</span>
              <span className="inline-flex items-center whitespace-nowrap align-middle">
                <span>(e.g. 2<sup>－3</sup> ＝</span>
                <Frac num="1" den="8" />
                <span>＞ 0).</span>
              </span>
            </>
          )}
        </span>
      )
    });

    // Q3: MCQ - Πρόσημο δύναμης
    const q3CorrectStr = isEl
      ? 'Αρνητικό (－), γιατί ο εκθέτης είναι περιττός'
      : 'Negative (－), because the exponent is odd';
    qList.push({
      id: 3,
      title: isEl ? 'Κανόνας Προσήμων σε Δυνάμεις' : 'Power Sign Rule',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Ποιο είναι το πρόσημο της δύναμης' : 'What is the sign of the power'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(－4)<sup>5</sup>{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'mcq',
      correct: q3CorrectStr,
      options: ensureFourUniqueOptions(q3CorrectStr, () => isEl ? [
        'Θετικό (＋), γιατί κάθε δύναμη είναι θετική',
        'Μηδέν',
        'Δεν ορίζεται'
      ] : [
        'Positive (＋), because every power is positive',
        'Zero',
        'Undefined'
      ]),
      explanation: isEl
        ? 'Αρνητική βάση με περιττό εκθέτη (5) δίνει πάντοτε αρνητικό αποτέλεσμα.'
        : 'A negative base with an odd exponent (5) always produces a negative result.'
    });

    // Q4: MCQ - Διαφορά παρένθεσης
    const q4CorrectStr = isEl
      ? '(－3)² ＝ 9 ενώ －3² ＝ －9'
      : '(－3)² ＝ 9 whereas －3² ＝ －9';
    qList.push({
      id: 4,
      title: isEl ? 'Δύναμη με και χωρίς Παρένθεση' : 'Power With and Without Parentheses',
      prompt: isEl
        ? 'Ποια είναι η σχέση ανάμεσα στο (－3)² και στο －3²;'
        : 'What is the relation between (－3)² and －3²?',
      type: 'mcq',
      correct: q4CorrectStr,
      options: ensureFourUniqueOptions(q4CorrectStr, () => isEl ? [
        'Είναι ίσα και τα δύο με 9',
        'Είναι ίσα και τα δύο με －9',
        '(－3)² ＝ －9 ενώ －3² ＝ 9'
      ] : [
        'Both are equal to 9',
        'Both are equal to －9',
        '(－3)² ＝ －9 whereas －3² ＝ 9'
      ]),
      explanation: isEl
        ? 'Στο (－3)² ο εκθέτης επηρεάζει και το μείον: (－3)·(－3) ＝ 9. Στο －3² ο εκθέτης επηρεάζει μόνο το 3: －(3·3) ＝ －9.'
        : 'In (－3)², the exponent acts on the negative sign as well: (－3)·(－3) ＝ 9. In －3², the exponent only affects 3: －(3·3) ＝ －9.'
    });

    // Q5: Input - Υπολογισμός δύναμης ρίζας
    qList.push({
      id: 5,
      title: isEl ? 'Τετράγωνο Ρίζας' : 'Square of Radical',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Πόσο ισούται η τιμή της δύναμης' : 'What is the value of the power'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>11</Radical>)<sup>2</sup>{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'input',
      correct: 11,
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Για κάθε α ≥ 0, ισχύει (<Radical>α</Radical>)² ＝ α. Άρα (<Radical>11</Radical>)² ＝ 11.</span>
            </>
          ) : (
            <>
              <span>For any a ≥ 0, (<Radical>a</Radical>)² ＝ a. Hence (<Radical>11</Radical>)² ＝ 11.</span>
            </>
          )}
        </span>
      )
    });

    // Q6: MCQ - Ιδιότητα γινομένου δυνάμεων
    qList.push({
      id: 6,
      title: isEl ? 'Γινόμενο Δυνάμεων με Ίδια Βάση' : 'Product of Powers with Same Base',
      prompt: isEl
        ? 'Ποιος είναι ο σωστός τύπος για το γινόμενο δυνάμεων με την ίδια βάση αᵐ · αⁿ;'
        : 'Which is the correct formula for the product of powers with the same base aᵐ · aⁿ?',
      type: 'mcq',
      correct: 'αᵐ⁺ⁿ',
      options: ensureFourUniqueOptions('αᵐ⁺ⁿ', () => [
        'αᵐ˙ⁿ',
        'αᵐ⁻ⁿ',
        '(2α)ᵐ⁺ⁿ'
      ]),
      explanation: isEl
        ? 'Στο γινόμενο δυνάμεων με την ίδια βάση διατηρούμε τη βάση και προσθέτουμε τους εκθέτες: αᵐ · αⁿ ＝ αᵐ⁺ⁿ.'
        : 'In the product of powers with the same base, retain the base and add the exponents: aᵐ · aⁿ ＝ aᵐ⁺ⁿ.'
    });

    // Q7: Input - Υπολογισμός 2⁻¹
    qList.push({
      id: 7,
      title: isEl ? 'Υπολογισμός Δύναμης 2⁻¹' : 'Calculation of 2⁻¹',
      prompt: isEl
        ? 'Ποια είναι η δεκαδική τιμή της δύναμης 2⁻¹;'
        : 'What is the decimal value of the power 2⁻¹?',
      type: 'input',
      correct: 0.5,
      explanation: (
        <span className="inline-flex items-center gap-1">
          <span>2<sup>－1</sup> ＝</span>
          <Frac num="1" den="2" />
          <span>＝ 0,5.</span>
        </span>
      )
    });

    // Q8: MCQ - Τυποποιημένη μορφή
    const q8CorrectStr = isEl
      ? '1 ≤ |α| ＜ 10 και k ακέραιος (k ∈ ℤ)'
      : '1 ≤ |a| ＜ 10 and k integer (k ∈ ℤ)';
    qList.push({
      id: 8,
      title: isEl ? 'Κριτήριο Τυποποιημένης Μορφής' : 'Scientific Notation Criterion',
      prompt: isEl
        ? 'Στην τυποποιημένη μορφή ενός αριθμού α · 10ᵏ, ποιοι περιορισμοί ισχύουν για το α και το k;'
        : 'In the scientific notation of a number a · 10ᵏ, what constraints apply to a and k?',
      type: 'mcq',
      correct: q8CorrectStr,
      options: ensureFourUniqueOptions(q8CorrectStr, () => isEl ? [
        '0 ≤ α ＜ 100 και k φυσικός',
        'α οποιοσδήποτε αριθμός και k ＞ 0',
        '1 ＜ α ≤ 10 και k μόνο θετικός'
      ] : [
        '0 ≤ a ＜ 100 and k natural',
        'a any number and k ＞ 0',
        '1 ＜ a ≤ 10 and k only positive'
      ]),
      explanation: isEl
        ? 'Στην επιστημονική/τυποποιημένη μορφή ο συντελεστής α έχει ένα μόνο μη μηδενικό ακέραιο ψηφίο (1 ≤ |α| ＜ 10) και ο εκθέτης k είναι ακέραιος.'
        : 'In scientific notation, the coefficient a has exactly one non-zero integer digit (1 ≤ |a| ＜ 10) and the exponent k is an integer.'
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
      backUrl="/g-gymnasiou/05-dinameis-pragmatikon"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/05-dinameis-pragmatikon"
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
                          val = val.replace(/[^0-9,-]/g, '');
                          if (val.indexOf('-') > 0) {
                            val = val.charAt(0) === '-' ? '-' + val.slice(1).replace(/-/g, '') : val.replace(/-/g, '');
                          }
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