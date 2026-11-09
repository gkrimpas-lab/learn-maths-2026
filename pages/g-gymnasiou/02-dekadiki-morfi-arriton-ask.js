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

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Εγκλωβισμός ριζών ανάμεσα σε διαδοχικούς ακεραίους (6 σενάρια με i18n)
const PROBLEM_POOL_Q9 = [
  (locale) => {
    const k = randInt(2, 6);
    const n = k * k + randInt(1, 2 * k);
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    return {
      title: isEl ? 'Ακέραιος Εγκλωβισμός Ρίζας' : 'Integer Bounding of Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο άρρητος αριθμός' : 'Between which two consecutive integers does the irrational number'}</span>
          <Radical>{n}</Radical>
          <span>{isEl ? ';' : 'lie?'}</span>
        </span>
      ),
      correct: `${k} ${andWord} ${k + 1}`,
      type: 'mcq',
      distractors: () => [
        `${k - 1} ${andWord} ${k}`,
        `${k + 1} ${andWord} ${k + 2}`,
        `${k + 2} ${andWord} ${k + 3}`
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Υπόριζη ποσότητα N', details: `${n}` },
        { label: 'Προηγούμενο τέλειο τετράγωνο', details: `${k}² ＝ ${k * k}` },
        { label: 'Επόμενο τέλειο τετράγωνο', details: `${k + 1}² ＝ ${(k + 1) * (k + 1)}` },
        { label: 'Ανισότητα', details: `${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}` }
      ] : [
        { label: 'Radicand N', details: `${n}` },
        { label: 'Preceding perfect square', details: `${k}² ＝ ${k * k}` },
        { label: 'Succeeding perfect square', details: `${k + 1}² ＝ ${(k + 1) * (k + 1)}` },
        { label: 'Inequality', details: `${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}` }
      ],
      explanation: isEl
        ? `Επειδή ${k}² ＝ ${k * k} και (${k + 1})² ＝ ${(k + 1) * (k + 1)}, έχουμε ${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}. Άρα ο αριθμός βρίσκεται ανάμεσα στο ${k} και το ${k + 1}.`
        : `Since ${k}² ＝ ${k * k} and (${k + 1})² ＝ ${(k + 1) * (k + 1)}, we have ${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)}. Therefore the number lies between ${k} and ${k + 1}.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ακέραιο Μέρος Ρίζας' : 'Integer Part of Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το ακέραιο μέρος (δηλαδή ο μεγαλύτερος ακέραιος που δεν υπερβαίνει) του άρρητου αριθμού' : 'What is the integer part (greatest integer not exceeding) of the irrational number'}</span>
          <Radical>10</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: isEl ? [
        { label: 'Έλεγχος τετραγώνων', details: '3² ＝ 9 ＜ 10 ＜ 16 ＝ 4²' },
        {
          label: 'Εγκλωβισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3 ＜</span>
              <Radical>10</Radical>
              <span>＜ 4</span>
            </span>
          )
        },
        {
          label: 'Ακέραιο μέρος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3 (αφού</span>
              <Radical>10</Radical>
              <span>≈ 3,16...)</span>
            </span>
          )
        }
      ] : [
        { label: 'Square verification', details: '3² ＝ 9 ＜ 10 ＜ 16 ＝ 4²' },
        {
          label: 'Bounding',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3 ＜</span>
              <Radical>10</Radical>
              <span>＜ 4</span>
            </span>
          )
        },
        {
          label: 'Integer part',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3 (since</span>
              <Radical>10</Radical>
              <span>≈ 3.16...)</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Επειδή 3² ＝ 9 ＜ 10 ＜ 16 ＝ 4², η τιμή της ρίζας είναι περίπου 3,16... Άρα το ακέραιο μέρος είναι το 3.'
        : 'Since 3² ＝ 9 ＜ 10 ＜ 16 ＝ 4², the root is approximately 3.16... Thus the integer part is 3.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    return {
      title: isEl ? 'Εγκλωβισμός Ρίζας 50' : 'Bounding Root 50',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιοι δύο διαδοχικοί φυσικοί αριθμοί περικλείουν τον αριθμό' : 'Which two consecutive natural numbers enclose the number'}</span>
          <Radical>50</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: `7 ${andWord} 8`,
      type: 'mcq',
      distractors: () => [
        `6 ${andWord} 7`,
        `8 ${andWord} 9`,
        `5 ${andWord} 6`
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: '7²', details: '49' },
        { label: '8²', details: '64' },
        { label: 'Ανισότητα', details: '49 ＜ 50 ＜ 64' }
      ] : [
        { label: '7²', details: '49' },
        { label: '8²', details: '64' },
        { label: 'Inequality', details: '49 ＜ 50 ＜ 64' }
      ],
      explanation: isEl
        ? '7² ＝ 49 και 8² ＝ 64. Επομένως η ρίζα βρίσκεται ανάμεσα στο 7 και το 8.'
        : '7² ＝ 49 and 8² ＝ 64. Hence the root lies between 7 and 8.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ελάχιστος Μεγαλύτερος Ακέραιος' : 'Smallest Greater Integer',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιος είναι ο μικρότερος ακέραιος που είναι ΜΕΓΑΛΥΤΕΡΟΣ από το' : 'What is the smallest integer that is GREATER than'}</span>
          <Radical>20</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        { label: 'Τετράγωνα', details: '4² ＝ 16 ＜ 20 ＜ 25 ＝ 5²' },
        {
          label: 'Εγκλωβισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>4 ＜</span>
              <Radical>20</Radical>
              <span>＜ 5</span>
            </span>
          )
        },
        { label: 'Ζητούμενος ακέραιος', details: '5' }
      ] : [
        { label: 'Squares', details: '4² ＝ 16 ＜ 20 ＜ 25 ＝ 5²' },
        {
          label: 'Bounding',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>4 ＜</span>
              <Radical>20</Radical>
              <span>＜ 5</span>
            </span>
          )
        },
        { label: 'Target integer', details: '5' }
      ],
      explanation: isEl
        ? 'Ο αριθμός βρίσκεται ανάμεσα στο 4 και το 5 (4,47...). Ο μικρότερος ακέραιος που τον ξεπερνά είναι το 5.'
        : 'The number lies between 4 and 5 (4.47...). The smallest integer strictly greater than it is 5.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    return {
      title: isEl ? 'Εγκλωβισμός Ρίζας 80' : 'Bounding Root 80',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο αριθμός' : 'Between which two consecutive integers does the number'}</span>
          <Radical>80</Radical>
          <span>{isEl ? ';' : 'lie?'}</span>
        </span>
      ),
      correct: `8 ${andWord} 9`,
      type: 'mcq',
      distractors: () => [
        `7 ${andWord} 8`,
        `9 ${andWord} 10`,
        `8 ${andWord} 10`
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: '8²', details: '64' },
        { label: '9²', details: '81' },
        { label: 'Ανισότητα', details: '64 ＜ 80 ＜ 81' }
      ] : [
        { label: '8²', details: '64' },
        { label: '9²', details: '81' },
        { label: 'Inequality', details: '64 ＜ 80 ＜ 81' }
      ],
      explanation: isEl
        ? 'Επειδή 8² ＝ 64 ＜ 80 ＜ 81 ＝ 9², ο αριθμός βρίσκεται ανάμεσα στο 8 και το 9.'
        : 'Since 8² ＝ 64 ＜ 80 ＜ 81 ＝ 9², the number lies between 8 and 9.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ακέραιο Μέρος Ρίζας 15' : 'Integer Part of Root 15',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το ακέραιο μέρος του άρρητου αριθμού' : 'What is the integer part of the irrational number'}</span>
          <Radical>15</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: isEl ? [
        { label: '3²', details: '9' },
        { label: '4²', details: '16' },
        { label: 'Ανισότητα', details: '9 ＜ 15 ＜ 16' }
      ] : [
        { label: '3²', details: '9' },
        { label: '4²', details: '16' },
        { label: 'Inequality', details: '9 ＜ 15 ＜ 16' }
      ],
      explanation: isEl
        ? 'Επειδή 3² ＝ 9 ＜ 15 ＜ 16 ＝ 4², το ακέραιο μέρος είναι 3 (αφού η ρίζα είναι περίπου 3,87).'
        : 'Since 3² ＝ 9 ＜ 15 ＜ 16 ＝ 4², the integer part is 3 (as the root is approximately 3.87).'
    };
  }
];

// POOL Q10: Πυθαγόρειο και υπολογισμός υποτείνουσας ως άρρητος (6 σενάρια με i18n)
const PROBLEM_POOL_Q10 = [
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υποτείνουσα Ισοσκελούς Ορθογωνίου (πλευρά 1)' : 'Hypotenuse of Isosceles Right Triangle (side 1)',
      prompt: isEl
        ? 'Ορθογώνιο τρίγωνο έχει κάθετες πλευρές ίσες με 1 cm. Πόσο είναι το ακριβές μήκος της υποτείνουσάς του σε cm;'
        : 'A right-angled triangle has legs equal to 1 cm. What is the exact length of its hypotenuse in cm?',
      correct: '√2 cm',
      type: 'mcq',
      distractors: () => isEl ? ['2 cm', '1,5 cm', '√3 cm'][randInt(0, 2)] : ['2 cm', '1.5 cm', '√3 cm'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√2 cm') return <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> cm</span>;
        if (opt === '√3 cm') return <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> cm</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Κάθετες πλευρές', details: 'α ＝ 1 cm, β ＝ 1 cm' },
        { label: 'Πυθαγόρειο Θεώρημα', details: 'c² ＝ 1² ＋ 1² ＝ 2' },
        {
          label: 'Υποτείνουσα c',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>c ＝</span>
              <Radical>2</Radical>
              <span>cm</span>
            </span>
          )
        }
      ] : [
        { label: 'Legs', details: 'a ＝ 1 cm, b ＝ 1 cm' },
        { label: 'Pythagorean Theorem', details: 'c² ＝ 1² ＋ 1² ＝ 2' },
        {
          label: 'Hypotenuse c',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>c ＝</span>
              <Radical>2</Radical>
              <span>cm</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Από το Πυθαγόρειο θεώρημα: c² ＝ 1² ＋ 1² ＝ 2, άρα</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <span>c ＝</span>
                <Radical>2</Radical>
                <span>cm</span>
              </span>
              <span>(άρρητος αριθμός).</span>
            </>
          ) : (
            <>
              <span>From the Pythagorean theorem: c² ＝ 1² ＋ 1² ＝ 2, hence</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <span>c ＝</span>
                <Radical>2</Radical>
                <span>cm</span>
              </span>
              <span>(an irrational number).</span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υποτείνουσα Ορθογωνίου με πλευρές 1 και 2' : 'Hypotenuse of Right Triangle with legs 1 and 2',
      prompt: isEl
        ? 'Ορθογώνιο τρίγωνο έχει κάθετες πλευρές 1 m και 2 m. Ποιο είναι το ακριβές μήκος της υποτείνουσάς του;'
        : 'A right triangle has legs of 1 m and 2 m. What is the exact length of its hypotenuse?',
      correct: '√5 m',
      type: 'mcq',
      distractors: () => isEl ? ['3 m', '√3 m', '2,5 m'][randInt(0, 2)] : ['3 m', '√3 m', '2.5 m'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√5 m') return <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> m</span>;
        if (opt === '√3 m') return <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> m</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Κάθετες πλευρές', details: '1 m και 2 m' },
        { label: 'Τετράγωνα πλευρών', details: 'c² ＝ 1² ＋ 2² ＝ 1 ＋ 4 ＝ 5' },
        {
          label: 'Υποτείνουσα',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>c ＝</span>
              <Radical>5</Radical>
              <span>m</span>
            </span>
          )
        }
      ] : [
        { label: 'Legs', details: '1 m and 2 m' },
        { label: 'Sum of squares', details: 'c² ＝ 1² ＋ 2² ＝ 1 ＋ 4 ＝ 5' },
        {
          label: 'Hypotenuse',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>c ＝</span>
              <Radical>5</Radical>
              <span>m</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>c² ＝ 1² ＋ 2² ＝ 1 ＋ 4 ＝ 5 ⇒</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>c ＝</span>
            <Radical>5</Radical>
            <span>m.</span>
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Διαγώνιος Τετραγώνου πλευράς 3' : 'Square Diagonal (side 3)',
      prompt: isEl
        ? 'Ένα τετράγωνο έχει πλευρά 3 cm. Ποιο είναι το τετράγωνο της διαγωνίου του d² σε cm²;'
        : 'A square has a side of 3 cm. What is the square of its diagonal d² in cm²?',
      correct: 18,
      type: 'input',
      tableData: isEl ? [
        { label: 'Πλευρά α', details: '3 cm' },
        { label: 'Τύπος d²', details: 'd² ＝ α² ＋ α² ＝ 3² ＋ 3²' },
        { label: 'Υπολογισμός', details: '9 ＋ 9 ＝ 18 cm²' }
      ] : [
        { label: 'Side a', details: '3 cm' },
        { label: 'Formula d²', details: 'd² ＝ a² ＋ a² ＝ 3² ＋ 3²' },
        { label: 'Calculation', details: '9 ＋ 9 ＝ 18 cm²' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Από το Πυθαγόρειο θεώρημα: d² ＝ 3² ＋ 3² ＝ 9 ＋ 9 ＝ 18. (Άρα η διαγώνιος ισούται με</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <Radical>18</Radical>
                <span>cm).</span>
              </span>
            </>
          ) : (
            <>
              <span>From the Pythagorean theorem: d² ＝ 3² ＋ 3² ＝ 9 ＋ 9 ＝ 18. (Thus the diagonal equals</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <Radical>18</Radical>
                <span>cm).</span>
              </span>
            </>
          )}
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υποτείνουσα Ορθογωνίου με πλευρές 2 και 3' : 'Hypotenuse with legs 2 and 3',
      prompt: isEl
        ? 'Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 2 και 3, ποιο είναι το τετράγωνο της υποτείνουσας c²;'
        : 'In a right-angled triangle with legs 2 and 3, what is the square of the hypotenuse c²?',
      correct: 13,
      type: 'input',
      tableData: isEl ? [
        { label: 'Κάθετες πλευρές', details: '2 και 3' },
        { label: 'Πυθαγόρειο', details: 'c² ＝ 2² ＋ 3² ＝ 4 ＋ 9 ＝ 13' }
      ] : [
        { label: 'Legs', details: '2 and 3' },
        { label: 'Pythagorean', details: 'c² ＝ 2² ＋ 3² ＝ 4 ＋ 9 ＝ 13' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>c² ＝ 2² ＋ 3² ＝ 4 ＋ 9 ＝ 13.</span>
          <span>{isEl ? 'Η υποτείνουσα ισούται με' : 'The hypotenuse equals'}</span>
          <Radical>13</Radical>.
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Διαγώνιος Ορθογωνίου με πλευρές 1 και 3' : 'Diagonal of Rectangle with sides 1 and 3',
      prompt: isEl
        ? 'Ορθογώνιο παραλληλόγραμμο έχει διαστάσεις 1 cm και 3 cm. Ποιο είναι το ακριβές μήκος της διαγωνίου του;'
        : 'A rectangle has dimensions 1 cm and 3 cm. What is the exact length of its diagonal?',
      correct: '√10 cm',
      type: 'mcq',
      distractors: () => isEl ? ['4 cm', '√8 cm', '3,5 cm'][randInt(0, 2)] : ['4 cm', '√8 cm', '3.5 cm'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√10 cm') return <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> cm</span>;
        if (opt === '√8 cm') return <span className="inline-flex items-center whitespace-nowrap"><Radical>8</Radical> cm</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Διαστάσεις', details: '1 cm και 3 cm' },
        {
          label: 'Διαγώνιος d',
          details: (
            <div className="flex flex-col gap-1">
              <span>d² ＝ 1² ＋ 3² ＝ 1 ＋ 9 ＝ 10</span>
              <span className="inline-flex items-center whitespace-nowrap font-bold text-indigo-700">
                <span>⇒ d ＝</span>
                <Radical>10</Radical>
                <span>cm</span>
              </span>
            </div>
          )
        }
      ] : [
        { label: 'Dimensions', details: '1 cm and 3 cm' },
        {
          label: 'Diagonal d',
          details: (
            <div className="flex flex-col gap-1">
              <span>d² ＝ 1² ＋ 3² ＝ 1 ＋ 9 ＝ 10</span>
              <span className="inline-flex items-center whitespace-nowrap font-bold text-indigo-700">
                <span>⇒ d ＝</span>
                <Radical>10</Radical>
                <span>cm</span>
              </span>
            </div>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>d ＝</span>
          <Radical>1² ＋ 3²</Radical>
          <span>＝</span>
          <Radical>1 ＋ 9</Radical>
          <span>＝</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Radical>10</Radical>
            <span>cm.</span>
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Υποτείνουσα με πλευρές 2 και 4' : 'Hypotenuse with legs 2 and 4',
      prompt: isEl
        ? 'Ποιο είναι το τετράγωνο της υποτείνουσας ορθογωνίου τριγώνου με κάθετες πλευρές 2 m και 4 m;'
        : 'What is the square of the hypotenuse of a right-angled triangle with legs 2 m and 4 m?',
      correct: 20,
      type: 'input',
      tableData: isEl ? [
        { label: 'Υπολογισμός', details: 'c² ＝ 2² ＋ 4² ＝ 4 ＋ 16 ＝ 20' }
      ] : [
        { label: 'Calculation', details: 'c² ＝ 2² ＋ 4² ＝ 4 ＋ 16 ＝ 20' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>c² ＝ 2² ＋ 4² ＝ 4 ＋ 16 ＝ 20.</span>
          <span>{isEl ? 'Άρα c ＝' : 'Thus c ＝'}</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Radical>20</Radical>
            <span>m.</span>
          </span>
        </span>
      )
    };
  }
];

// POOL Q11: Ρητή προσέγγιση δεκάτου και εκατοστού (6 σενάρια με i18n)
const PROBLEM_POOL_Q11 = [
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Προσέγγιση με Έλλειψη στο 0,1' : 'Under-approximation to 0.1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η προσέγγιση με έλλειψη του αριθμού' : 'What is the under-approximation of'}</span>
          <Radical>2</Radical>
          <span>{isEl ? 'με ακρίβεια ενός δεκάτου (0,1);' : 'to the nearest tenth (0.1)?'}</span>
        </span>
      ),
      correct: 1.4,
      type: 'input',
      tableData: isEl ? [
        { label: '1,4²', details: '1,96 ＜ 2' },
        { label: '1,5²', details: '2,25 ＞ 2' },
        { label: 'Ελλιπής προσέγγιση', details: '1,4' }
      ] : [
        { label: '1.4²', details: '1.96 ＜ 2' },
        { label: '1.5²', details: '2.25 ＞ 2' },
        { label: 'Under-approximation', details: '1.4' }
      ],
      explanation: isEl
        ? 'Επειδή 1,4² ＝ 1,96 ＜ 2 ＜ 2,25 ＝ 1,5², η προσέγγιση με έλλειψη στο δέκατο είναι 1,4.'
        : 'Since 1.4² ＝ 1.96 ＜ 2 ＜ 2.25 ＝ 1.5², the under-approximation to the nearest tenth is 1.4.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Προσέγγιση με Υπέρβαση στο 0,1' : 'Over-approximation to 0.1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η προσέγγιση με υπέρβαση του αριθμού' : 'What is the over-approximation of'}</span>
          <Radical>2</Radical>
          <span>{isEl ? 'με ακρίβεια ενός δεκάτου (0,1);' : 'to the nearest tenth (0.1)?'}</span>
        </span>
      ),
      correct: 1.5,
      type: 'input',
      tableData: isEl ? [
        { label: '1,4²', details: '1,96' },
        { label: '1,5²', details: '2,25' },
        { label: 'Υπερβολική προσέγγιση', details: '1,5' }
      ] : [
        { label: '1.4²', details: '1.96' },
        { label: '1.5²', details: '2.25' },
        { label: 'Over-approximation', details: '1.5' }
      ],
      explanation: isEl
        ? 'Η προσέγγιση με υπέρβαση με ακρίβεια ενός δεκάτου είναι 1,5.'
        : 'The over-approximation to the nearest tenth is 1.5.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Προσέγγιση στο 0,1' : 'Approximation to 0.1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ανάμεσα σε ποια δύο διαδοχικά δέκατα εγκλωβίζεται ο άρρητος αριθμός' : 'Between which two consecutive tenths is the irrational number'}</span>
          <Radical>3</Radical>
          <span>{isEl ? ';' : 'enclosed?'}</span>
        </span>
      ),
      correct: `1${dec}7 ${andWord} 1${dec}8`,
      type: 'mcq',
      distractors: () => [
        `1${dec}6 ${andWord} 1${dec}7`,
        `1${dec}8 ${andWord} 1${dec}9`,
        `1${dec}5 ${andWord} 1${dec}6`
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: '1,7²', details: '2,89 ＜ 3' },
        { label: '1,8²', details: '3,24 ＞ 3' },
        {
          label: 'Ανισότητα',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>1,7 ＜</span>
              <Radical>3</Radical>
              <span>＜ 1,8</span>
            </span>
          )
        }
      ] : [
        { label: '1.7²', details: '2.89 ＜ 3' },
        { label: '1.8²', details: '3.24 ＞ 3' },
        {
          label: 'Inequality',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>1.7 ＜</span>
              <Radical>3</Radical>
              <span>＜ 1.8</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>1,7² ＝ 2,89 {isEl ? 'και' : 'and'} 1,8² ＝ 3,24.</span>
          <span>{isEl ? 'Άρα 1,7 ＜' : 'Therefore 1.7 ＜'}</span>
          <Radical>3</Radical>
          <span>＜ 1,8.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Προσέγγιση στο 0,1' : 'Approximation to 0.1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η προσέγγιση με έλλειψη του αριθμού' : 'What is the under-approximation of'}</span>
          <Radical>5</Radical>
          <span>{isEl ? 'με ακρίβεια δεκάτου (0,1);' : 'to the nearest tenth (0.1)?'}</span>
        </span>
      ),
      correct: 2.2,
      type: 'input',
      tableData: isEl ? [
        { label: '2,2²', details: '4,84 ＜ 5' },
        { label: '2,3²', details: '5,29 ＞ 5' },
        { label: 'Απάντηση', details: '2,2' }
      ] : [
        { label: '2.2²', details: '4.84 ＜ 5' },
        { label: '2.3²', details: '5.29 ＞ 5' },
        { label: 'Answer', details: '2.2' }
      ],
      explanation: isEl
        ? '2,2² ＝ 4,84 ＜ 5 ＜ 5,29 ＝ 2,3². Η προσέγγιση με έλλειψη είναι 2,2.'
        : '2.2² ＝ 4.84 ＜ 5 ＜ 5.29 ＝ 2.3². The under-approximation is 2.2.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Προσέγγιση στο 0,1' : 'Approximation to 0.1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ανάμεσα σε ποια δύο δέκατα βρίσκεται ο αριθμός' : 'Between which two tenths does the number'}</span>
          <Radical>10</Radical>
          <span>{isEl ? ';' : 'lie?'}</span>
        </span>
      ),
      correct: `3${dec}1 ${andWord} 3${dec}2`,
      type: 'mcq',
      distractors: () => [
        `3${dec}0 ${andWord} 3${dec}1`,
        `3${dec}2 ${andWord} 3${dec}3`,
        `3${dec}3 ${andWord} 3${dec}4`
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: '3,1²', details: '9,61 ＜ 10' },
        { label: '3,2²', details: '10,24 ＞ 10' },
        {
          label: 'Εγκλωβισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3,1 ＜</span>
              <Radical>10</Radical>
              <span>＜ 3,2</span>
            </span>
          )
        }
      ] : [
        { label: '3.1²', details: '9.61 ＜ 10' },
        { label: '3.2²', details: '10.24 ＞ 10' },
        {
          label: 'Bounding',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>3.1 ＜</span>
              <Radical>10</Radical>
              <span>＜ 3.2</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>3,1² ＝ 9,61 {isEl ? 'και' : 'and'} 3,2² ＝ 10,24.</span>
          <span>{isEl ? 'Άρα 3,1 ＜' : 'Therefore 3.1 ＜'}</span>
          <Radical>10</Radical>
          <span>＜ 3,2.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Σφάλμα Προσέγγισης στο 0,01' : 'Approximation Error to 0.01',
      prompt: isEl
        ? 'Αν προσεγγίσουμε έναν άρρητο αριθμό με ακρίβεια εκατοστού (0,01), ποιο είναι το ΜΕΓΙΣΤΟ δυνατό σφάλμα της προσέγγισης;'
        : 'If an irrational number is approximated to the hundredths place (0.01), what is the MAXIMUM possible approximation error?',
      correct: 0.01,
      type: 'input',
      tableData: isEl ? [
        { label: 'Ακρίβεια', details: 'Εκατοστό (0,01)' },
        { label: 'Μέγιστο σφάλμα', details: '0,01' }
      ] : [
        { label: 'Precision', details: 'Hundredth (0.01)' },
        { label: 'Maximum error', details: '0.01' }
      ],
      explanation: isEl
        ? 'Στην προσέγγιση με ακρίβεια εκατοστού, η διαφορά μεταξύ ελλιπούς και υπερβολικής προσέγγισης είναι 0,01. Άρα το σφάλμα δεν υπερβαίνει το 0,01.'
        : 'When approximating to the hundredths place, the width of the interval is 0.01. Hence the error does not exceed 0.01.'
    };
  }
];

// POOL Q12: Προβλήματα εφαρμογής με π και γεωμετρικά μεγέθη (6 σενάρια με i18n)
const PROBLEM_POOL_Q12 = [
  (locale) => {
    const r = randInt(5, 15);
    const perimeter = Math.round(2 * 3.14 * r * 100) / 100;
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const perimFormatted = String(perimeter).replace('.', dec);
    return {
      title: isEl ? 'Περίμετρος Κύκλου με π ≈ 3,14' : 'Circumference of Circle with π ≈ 3.14',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? `Ένας κυκλικός δίσκος έχει ακτίνα ρ ＝ ${r} cm. Ποια είναι η περίμετρός του σε cm χρησιμοποιώντας τη ρητή προσέγγιση` : `A circular disk has radius ρ ＝ ${r} cm. What is its circumference in cm using the rational approximation`}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>≈ 3{dec}14;</span>
        </span>
      ),
      correct: perimeter,
      type: 'input',
      unit: 'cm',
      tableData: isEl ? [
        { label: 'Ακτίνα ρ', details: `${r} cm` },
        {
          label: 'Τύπος περιμέτρου',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>L ＝ 2 ·</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ</span>
            </span>
          )
        },
        { label: 'Υπολογισμός', details: `2 · 3,14 · ${r} ＝ ${perimFormatted} cm` }
      ] : [
        { label: 'Radius ρ', details: `${r} cm` },
        {
          label: 'Circumference formula',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>L ＝ 2 ·</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ</span>
            </span>
          )
        },
        { label: 'Calculation', details: `2 · 3.14 · ${r} ＝ ${perimFormatted} cm` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>L ＝ 2 · 3{dec}14 · {r} ＝ ${perimFormatted} cm.</span>
        </span>
      )
    };
  },
  (locale) => {
    const r = randInt(2, 6);
    const area = Math.round(3.14 * r * r * 100) / 100;
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const areaFormatted = String(area).replace('.', dec);
    return {
      title: isEl ? 'Εμβαδόν Κυκλικού Δίσκου με π ≈ 3,14' : 'Area of Circular Disk with π ≈ 3.14',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? `Ποιο είναι το εμβαδόν ενός κυκλικού παρτεριού με ακτίνα ρ ＝ ${r} m για` : `What is the area of a circular flowerbed with radius ρ ＝ ${r} m for`}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>≈ 3{dec}14 {isEl ? 'σε m²;' : 'in m²?'}</span>
        </span>
      ),
      correct: area,
      type: 'input',
      unit: 'm²',
      tableData: isEl ? [
        { label: 'Ακτίνα ρ', details: `${r} m` },
        {
          label: 'Τύπος εμβαδού',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>E ＝</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ²</span>
            </span>
          )
        },
        { label: 'Υπολογισμός', details: `3,14 · ${r}² ＝ 3,14 · ${r * r} ＝ ${areaFormatted} m²` }
      ] : [
        { label: 'Radius ρ', details: `${r} m` },
        {
          label: 'Area formula',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>A ＝</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ²</span>
            </span>
          )
        },
        { label: 'Calculation', details: `3.14 · ${r}² ＝ 3.14 · ${r * r} ＝ ${areaFormatted} m²` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>E ＝ 3{dec}14 · ${r}² ＝ ${areaFormatted} m².</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Προσέγγιση Αρχιμήδη (22/7)' : 'Archimedes Approximation (22/7)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Για ακτίνα ρ ＝ 7 cm, ποια είναι η περίμετρος του κύκλου αν χρησιμοποιηθεί η κλασματική προσέγγιση του Αρχιμήδη' : 'For radius ρ ＝ 7 cm, what is the circumference of the circle if using Archimedes\' fractional approximation'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>≈</span>
          <Frac num="22" den="7" />
          <span>{isEl ? 'σε cm;' : 'in cm?'}</span>
        </span>
      ),
      correct: 44,
      type: 'input',
      unit: 'cm',
      tableData: isEl ? [
        {
          label: 'Τύπος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>L ＝ 2 ·</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ</span>
            </span>
          )
        },
        {
          label: 'Υπολογισμός',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>2 ·</span>
              <Frac num="22" den="7" />
              <span>· 7 ＝ 2 · 22 ＝ 44 cm</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Formula',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>L ＝ 2 ·</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>· ρ</span>
            </span>
          )
        },
        {
          label: 'Calculation',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>2 ·</span>
              <Frac num="22" den="7" />
              <span>· 7 ＝ 2 · 22 ＝ 44 cm</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>2 ·</span>
          <Frac num="22" den="7" />
          <span>· 7 ＝ 44 cm.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Διαγώνιος Τετραγώνου με Ρητή Προσέγγιση' : 'Square Diagonal with Rational Approximation',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ένα τετράγωνο έχει πλευρά 10 m. Ποιο είναι το κατά προσέγγιση μήκος της διαγωνίου του αν' : 'A square has a side of 10 m. What is the approximate length of its diagonal if'}</span>
          <Radical>2</Radical>
          <span>≈ 1{dec}41 {isEl ? 'σε μέτρα;' : 'in meters?'}</span>
        </span>
      ),
      correct: 14.1,
      type: 'input',
      unit: 'm',
      tableData: isEl ? [
        {
          label: 'Ακριβές μήκος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>d ＝ 10 ·</span>
              <Radical>2</Radical>
              <span>m</span>
            </span>
          )
        },
        { label: 'Προσέγγιση', details: '10 · 1,41 ＝ 14,1 m' }
      ] : [
        {
          label: 'Exact length',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>d ＝ 10 ·</span>
              <Radical>2</Radical>
              <span>m</span>
            </span>
          )
        },
        { label: 'Approximation', details: '10 · 1.41 ＝ 14.1 m' }
      ],
      explanation: `d ＝ 10 · 1${dec}41 ＝ 14${dec}1 m.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Σύγκριση π και 3,14' : 'Comparison of π and 3.14',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σχέση ανάμεσα στον πραγματικό αριθμό' : 'What is the relation between the real number'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>{isEl ? `και τη ρητή προσέγγιση 3${dec}14;` : `and the rational approximation 3${dec}14?`}</span>
        </span>
      ),
      correct: `π ＞ 3${dec}14`,
      type: 'mcq',
      distractors: () => isEl ? [
        'π ＝ 3,14',
        'π ＜ 3,14',
        'Δεν συγκρίνονται'
      ][randInt(0, 2)] : [
        'π ＝ 3.14',
        'π ＜ 3.14',
        'Not comparable'
      ][randInt(0, 2)],
      renderOption: (opt) => {
        if (typeof opt === 'string' && opt.includes('π')) {
          const parts = opt.split('π');
          return (
            <span className="inline-flex items-center gap-0.5">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>{parts[1]}</span>
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Αριθμός π',
          details: (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>＝ 3,14159265...</span>
            </span>
          )
        },
        { label: 'Ρητή τιμή', details: '3,14000000...' },
        { label: 'Σύγκριση', details: '3,14159... ＞ 3,14000...' }
      ] : [
        {
          label: 'Number π',
          details: (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>＝ 3.14159265...</span>
            </span>
          )
        },
        { label: 'Rational value', details: '3.14000000...' },
        { label: 'Comparison', details: '3.14159... ＞ 3.14000...' }
      ],
      explanation: isEl
        ? 'Επειδή π ＝ 3,14159..., είναι αυστηρά μεγαλύτερος από τον δεκαδικό 3,14 (π ＞ 3,14).'
        : 'Since π ＝ 3.14159..., it is strictly greater than 3.14 (π ＞ 3.14).'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    return {
      title: isEl ? 'Περίμετρος Ημικυκλίου' : 'Perimeter of Semicircle Arc',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ημικύκλιο έχει διάμετρο δ ＝ 10 cm. Ποιο είναι το μήκος του κυκλικού τόξου του για' : 'A semicircle has diameter d ＝ 10 cm. What is the length of its circular arc for'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>≈ 3{dec}14 {isEl ? 'σε cm;' : 'in cm?'}</span>
        </span>
      ),
      correct: 15.7,
      type: 'input',
      unit: 'cm',
      tableData: isEl ? [
        {
          label: 'Μήκος τόξου',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac
                num={
                  <span className="inline-flex items-center gap-0.5">
                    <span className="font-serif italic text-[1.05em]">π</span>
                    <span>· δ</span>
                  </span>
                }
                den="2"
              />
            </span>
          )
        },
        {
          label: 'Υπολογισμός',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num="3,14 · 10" den="2" />
              <span>＝</span>
              <Frac num="31,4" den="2" />
              <span>＝ 15,7 cm</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Arc length',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac
                num={
                  <span className="inline-flex items-center gap-0.5">
                    <span className="font-serif italic text-[1.05em]">π</span>
                    <span>· d</span>
                  </span>
                }
                den="2"
              />
            </span>
          )
        },
        {
          label: 'Calculation',
          details: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac num="3.14 · 10" den="2" />
              <span>＝</span>
              <Frac num="31.4" den="2" />
              <span>＝ 15.7 cm</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Το κυκλικό τόξο του ημικυκλίου είναι</span>
              <Frac
                num={
                  <span className="inline-flex items-center gap-0.5">
                    <span className="font-serif italic text-[1.05em]">π</span>
                    <span>· δ</span>
                  </span>
                }
                den="2"
              />
              <span>＝</span>
              <Frac num="3,14 · 10" den="2" />
              <span>＝ 15,7 cm.</span>
            </>
          ) : (
            <>
              <span>The circular arc of the semicircle is</span>
              <Frac
                num={
                  <span className="inline-flex items-center gap-0.5">
                    <span className="font-serif italic text-[1.05em]">π</span>
                    <span>· d</span>
                  </span>
                }
                den="2"
              />
              <span>＝</span>
              <Frac num="3.14 · 10" den="2" />
              <span>＝ 15.7 cm.</span>
            </>
          )}
        </span>
      )
    };
  }
];

export default function DekadikiMorfiArritonExercises() {
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
      metaTitle: "Ασκήσεις: Δεκαδική Μορφή Άρρητων | Γ' Γυμνασίου",
      metaDesc: "Διαδραστικές ασκήσεις στους άρρητους αριθμούς, ρίζες, ρητές προσεγγίσεις και εγκλωβισμό με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
      backText: "Θεωρία Κεφ. 2",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeClass: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
      bannerTitle: "Δεκαδική Μορφή Άρρητων Αριθμών: Εξάσκηση",
      bannerSubtitle: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα εγκλωβισμού. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».",
      btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      resultHeading: (s) => `Αποτέλεσμα: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τους άρρητους αριθμούς και τις τεχνικές εγκλωβισμού τους.",
      feedbackGood: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
      feedbackPoor: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τον εγκλωβισμό των ριζών!",
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
      metaTitle: "Exercises: Decimal Form of Irrationals | 9th Grade",
      metaDesc: "Interactive exercises on irrational numbers, roots, rational approximations, and bounding with detailed steps.",
      backText: "Theory Ch. 2",
      btnTheory: "THEORY",
      badgeClass: "EXERCISES • 9TH GRADE",
      bannerTitle: "Decimal Form of Irrational Numbers: Practice",
      bannerSubtitle: "12 dynamic questions and applied bounding problems. Complete your answers and click «Check Answers».",
      btnNewExercises: "NEW EXERCISES",
      resultHeading: (s) => `Result: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Outstanding performance! You thoroughly grasp irrational numbers and bounding techniques.",
      feedbackGood: "Very good effort! Review the detailed steps below for the questions you found tricky.",
      feedbackPoor: "Needs a bit more practice. Consult the theory for bounding of roots!",
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

    // Q1: True / False - Ορισμός άρρητου
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός Άρρητου Αριθμού' : 'Definition of Irrational Number',
      prompt: isEl
        ? (q1IsCorrect
            ? 'Ένας άρρητος αριθμός έχει άπειρα δεκαδικά ψηφία χωρίς να εμφανίζει ποτέ περίοδο.'
            : 'Κάθε αριθμός με άπειρα δεκαδικά ψηφία είναι υποχρεωτικά άρρητος αριθμός.')
        : (q1IsCorrect
            ? 'An irrational number has infinite decimal digits without ever showing a repeating period.'
            : 'Every number with infinite decimal digits is necessarily an irrational number.'),
      type: 'tf',
      correct: q1IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Οι άρρητοι αριθμοί χαρακτηρίζονται από άπειρα δεκαδικά ψηφία ΧΩΡΙΣ περίοδο. Αν υπάρχει περίοδος (όπως στο 0,333...), ο αριθμός είναι ρητός.'
        : 'Irrational numbers are characterized by infinite decimal digits WITHOUT a repeating period. If a period exists (as in 0.333...), the number is rational.'
    });

    // Q2: MCQ - Αναγνώριση Άρρητου
    const validArritoi = ['√2', '√3', '√5', 'π'];
    const invalidArritoi = ['√4 (＝ 2)', '√9 (＝ 3)', isEl ? '0,75' : '0.75', '3/5'];
    const q2Correct = validArritoi[randInt(0, validArritoi.length - 1)];
    qList.push({
      id: 2,
      title: isEl ? 'Αναγνώριση Άρρητου Αριθμού' : 'Identifying Irrational Numbers',
      prompt: isEl ? 'Ποιος από τους παρακάτω αριθμούς ΕΙΝΑΙ άρρητος αριθμός;' : 'Which of the following numbers IS an irrational number?',
      type: 'mcq',
      correct: q2Correct,
      options: ensureFourUniqueOptions(q2Correct, () => invalidArritoi[randInt(0, invalidArritoi.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√5') return <Radical>5</Radical>;
        if (opt === 'π') return <span className="font-serif italic text-[1.1em]">π</span>;
        if (opt === '√4 (＝ 2)') return (
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <Radical>4</Radical> <span>(＝ 2)</span>
          </span>
        );
        if (opt === '√9 (＝ 3)') return (
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <Radical>9</Radical> <span>(＝ 3)</span>
          </span>
        );
        if (opt === '3/5') return <Frac num="3" den="5" />;
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο αριθμός αυτός είναι άρρητος, καθώς έχει άπειρα μη περιοδικά δεκαδικά ψηφία και δεν μπορεί να εκφραστεί ως κλάσμα ακεραίων</span>
              <Frac num="μ" den="ν" />.
            </>
          ) : (
            <>
              <span>This number is irrational because it has infinite non-repeating digits and cannot be represented as a fraction of integers</span>
              <Frac num="m" den="n" />.
            </>
          )}
        </span>
      )
    });

    // Q3: True / False - Ρίζες τέλειων τετραγώνων
    const q3Choice = Math.random() < 0.5;
    qList.push({
      id: 3,
      title: isEl ? 'Τετραγωνική Ρίζα και Άρρητοι' : 'Square Roots and Irrationals',
      prompt: isEl
        ? (q3Choice
            ? 'Η τετραγωνική ρίζα κάθε φυσικού αριθμού που ΔΕΝ είναι τέλειο τετράγωνο είναι άρρητος αριθμός.'
            : 'Η τετραγωνική ρίζα οποιουδήποτε φυσικού αριθμού είναι πάντοτε άρρητος αριθμός.')
        : (q3Choice
            ? 'The square root of any natural number that is NOT a perfect square is an irrational number.'
            : 'The square root of any natural number is always an irrational number.'),
      type: 'tf',
      correct: q3Choice ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Η τετραγωνική ρίζα ενός τέλειου τετραγώνου (π.χ.</span>
              <Radical>16</Radical>
              <span>＝ 4) είναι φυσικός (ρητός) αριθμός. Άρρητες είναι μόνο οι ρίζες μη τέλειων τετραγώνων.</span>
            </>
          ) : (
            <>
              <span>The square root of a perfect square (e.g.</span>
              <Radical>16</Radical>
              <span>＝ 4) is a natural (rational) number. Only square roots of non-perfect squares are irrational.</span>
            </>
          )}
        </span>
      )
    });

    // Q4: MCQ - Τιμή του √25
    const q4CorrectStr = isEl ? 'Ρητός (φυσικός) αριθμός, ίσος με 5' : 'Rational (natural) number, equal to 5';
    qList.push({
      id: 4,
      title: isEl ? 'Χαρακτηρισμός Ρίζας' : 'Characterization of Root',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Ο αριθμός' : 'The number'}</span>
          <Radical>25</Radical>
          <span>{isEl ? 'είναι:' : 'is:'}</span>
        </span>
      ),
      type: 'mcq',
      correct: q4CorrectStr,
      options: ensureFourUniqueOptions(q4CorrectStr, () => isEl ? [
        'Άρρητος αριθμός, περίπου 5,1',
        'Περιοδικός δεκαδικός αριθμός',
        'Μη πραγματικός αριθμός'
      ][randInt(0, 2)] : [
        'Irrational number, approximately 5.1',
        'Repeating decimal number',
        'Non-real number'
      ][randInt(0, 2)]),
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Επειδή 5² ＝ 25, η ρίζα</span>
              <Radical>25</Radical>
              <span>ισούται ακριβώς με το 5, άρα είναι ρητός αριθμός.</span>
            </>
          ) : (
            <>
              <span>Because 5² ＝ 25,</span>
              <Radical>25</Radical>
              <span>equals exactly 5, and is therefore a rational number.</span>
            </>
          )}
        </span>
      )
    });

    // Q5: True / False - Ο αριθμός π και το 3,14
    const q5Choice = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: isEl ? 'Η Φύση του Αριθμού π' : 'The Nature of π',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            q5Choice ? (
              <>
                <span>Ο αριθμός</span>
                <span className="font-serif italic text-[1.05em]">π</span>
                <span>είναι άρρητος αριθμός και η τιμή 3,14 αποτελεί απλώς μία ρητή προσέγγισή του.</span>
              </>
            ) : (
              <>
                <span>Ο αριθμός</span>
                <span className="font-serif italic text-[1.05em]">π</span>
                <span>είναι ρητός αριθμός επειδή ισούται ακριβώς με 3,14.</span>
              </>
            )
          ) : (
            q5Choice ? (
              <>
                <span>The number</span>
                <span className="font-serif italic text-[1.05em]">π</span>
                <span>is an irrational number, and 3.14 is merely a rational approximation of it.</span>
              </>
            ) : (
              <>
                <span>The number</span>
                <span className="font-serif italic text-[1.05em]">π</span>
                <span>is a rational number because it equals exactly 3.14.</span>
              </>
            )
          )}
        </span>
      ),
      type: 'tf',
      correct: q5Choice ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ο αριθμός</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>έχει αποδειχθεί ότι είναι άρρητος. Το 3,14 είναι δεκαδική προσέγγιση με ακρίβεια εκατοστού.</span>
            </>
          ) : (
            <>
              <span>The number</span>
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>is proven to be irrational. 3.14 is a decimal approximation to the hundredths place.</span>
            </>
          )}
        </span>
      )
    });

    // Q6: Input - Ακέραιος εγκλωβισμός του √7
    qList.push({
      id: 6,
      title: isEl ? 'Ακέραιο Μέρος Ρίζας 7' : 'Integer Part of Root 7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το ακέραιο μέρος του άρρητου αριθμού' : 'What is the integer part of the irrational number'}</span>
          <Radical>7</Radical>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>({isEl ? 'δηλαδή ο ακέραιος k αν k ＜' : 'i.e. the integer k if k ＜'}</span>
            <Radical>7</Radical>
            <span>＜ k＋1);</span>
          </span>
        </span>
      ),
      type: 'input',
      correct: 2,
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>2² ＝ 4 ＜ 7 ＜ 9 ＝ 3², {isEl ? 'άρα 2 ＜' : 'so 2 ＜'}</span>
          <Radical>7</Radical>
          <span>＜ 3. {isEl ? 'Το ακέραιο μέρος είναι 2.' : 'The integer part is 2.'}</span>
        </span>
      )
    });

    // Q7: MCQ - Πραγματικοί Αριθμοί
    const q7CorrectStr = isEl ? 'Την ένωση των ρητών και των άρρητων αριθμών' : 'The union of rational and irrational numbers';
    qList.push({
      id: 7,
      title: isEl ? 'Σύνολο Πραγματικών Αριθμών' : 'Set of Real Numbers',
      prompt: isEl ? 'Το σύνολο των πραγματικών αριθμών (ℝ) αποτελείται από:' : 'The set of real numbers (ℝ) consists of:',
      type: 'mcq',
      correct: q7CorrectStr,
      options: ensureFourUniqueOptions(q7CorrectStr, () => isEl ? [
        'Μόνο τους θετικούς ρητούς αριθμούς',
        'Μόνο τους ακεραίους και τα κλάσματα',
        'Μόνο τους αριθμούς που έχουν περίοδο'
      ][randInt(0, 2)] : [
        'Only positive rational numbers',
        'Only integers and fractions',
        'Only numbers that have a repeating period'
      ][randInt(0, 2)]),
      explanation: isEl
        ? 'Οι πραγματικοί αριθμοί περιλαμβάνουν όλους τους ρητούς και όλους τους άρρητους αριθμούς.'
        : 'Real numbers include all rational and all irrational numbers.'
    });

    // Q8: Input - Τετράγωνο της υποτείνουσας
    qList.push({
      id: 8,
      title: isEl ? 'Πυθαγόρειο Τετράγωνο' : 'Pythagorean Square',
      prompt: isEl
        ? 'Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 2 cm και 5 cm, ποιο είναι το τετράγωνο της υποτείνουσας c²;'
        : 'In a right triangle with legs 2 cm and 5 cm, what is the square of the hypotenuse c²?',
      type: 'input',
      correct: 29,
      explanation: 'c² ＝ 2² ＋ 5² ＝ 4 ＋ 25 ＝ 29.'
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
      backUrl="/g-gymnasiou/02-dekadiki-morfi-arriton"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/02-dekadiki-morfi-arriton"
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