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

// POOL Q9: Σύνθετη αναγωγή ομοίων ριζών και απλοποίηση παραστάσεων
const PROBLEM_POOL_Q9 = [
  () => {
    const a = randInt(4, 7);
    const b = randInt(2, 3);
    const c = randInt(3, 5);
    const d = randInt(1, 2);
    const coef3 = a - b;
    const coef2 = c - d;
    return {
      title: 'Σύνθετη Αναγωγή Ομοίων Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Να απλοποιηθεί η παράσταση: {a} · <Radical>3</Radical> ＋ {c} · <Radical>2</Radical> － {b} · <Radical>3</Radical> － {d} · <Radical>2</Radical>.
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
        if (opt === `${coef3}·√3 ＋ ${coef2}·√2`) return <span className="inline-flex items-center gap-1">{coef3} · <Radical>3</Radical> ＋ {coef2} · <Radical>2</Radical></span>;
        if (opt === `${coef3 + coef2}·√5`) return <span className="inline-flex items-center gap-1">{coef3 + coef2} · <Radical>5</Radical></span>;
        if (opt === `${coef3}·√3 － ${coef2}·√2`) return <span className="inline-flex items-center gap-1">{coef3} · <Radical>3</Radical> － {coef2} · <Radical>2</Radical></span>;
        if (opt === `${a + b}·√3 ＋ ${c + d}·√2`) return <span className="inline-flex items-center gap-1">{a + b} · <Radical>3</Radical> ＋ {c + d} · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: 'Ομαδοποίηση όρων με √3', details: `(${a} － ${b}) · √3 ＝ ${coef3} · √3` },
        { label: 'Ομαδοποίηση όρων με √2', details: `(${c} － ${d}) · √2 ＝ ${coef2} · √2` },
        { label: 'Τελική ανηγμένη μορφή', details: `${coef3} · √3 ＋ ${coef2} · √2` }
      ],
      explanation: `Ομαδοποιούμε μόνο τις όμοιες ρίζες ξεχωριστά: (${a} － ${b}) · √3 ＋ (${c} － ${d}) · √2 ＝ ${coef3} · √3 ＋ ${coef2} · √2.`
    };
  },
  () => {
    const a = randInt(5, 7);
    const b = randInt(2, 3);
    const res = a - b * b;
    return {
      title: 'Υπολογισμός Γινομένου Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η αριθμητική τιμή του γινομένου (<Radical>{a}</Radical> ＋ {b}) · (<Radical>{a}</Radical> － {b});
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { label: 'Επιμερισμός / Ταυτότητα', details: `(√${a})² － ${b}²` },
        { label: 'Υπολογισμός τετραγώνων', details: `${a} － ${b * b} ＝ ${res}` }
      ],
      explanation: `Εφαρμόζουμε την ταυτότητα (√α ＋ β)(√α － β) ＝ (√α)² － β² ＝ ${a} － ${b * b} ＝ ${res}.`
    };
  },
  () => {
    const x = randInt(3, 5);
    const yVal = x * x - 1;
    return {
      title: 'Εύρεση Παραμέτρου σε Αντίστροφοους Αριθμούς',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν οι πραγματικοί αριθμοί {x} ＋ <Radical>y</Radical> και {x} － <Radical>y</Radical> είναι αντίστροφοι, ποια είναι η τιμή του y;
        </span>
      ),
      correct: yVal,
      type: 'input',
      tableData: [
        { label: 'Συνθήκη αντιστρόφων', details: `(${x} ＋ √y) · (${x} － √y) ＝ 1` },
        { label: 'Διαφορά τετραγώνων', details: `${x}² － (√y)² ＝ 1 => ${x * x} － y ＝ 1` },
        { label: 'Επίλυση ως προς y', details: `y ＝ ${x * x} － 1 ＝ ${yVal}` }
      ],
      explanation: `Δύο αριθμοί είναι αντίστροφοι όταν το γινόμενό τους ισούται με 1: (${x})² － (√y)² ＝ 1 => ${x * x} － y ＝ 1 => y ＝ ${yVal}.`
    };
  },
  () => {
    return {
      title: 'Επιμεριστική και Ακέραιο Αποτέλεσμα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Radical>2</Radical> · (<Radical>8</Radical> ＋ <Radical>18</Radical>);
        </span>
      ),
      correct: 10,
      type: 'input',
      tableData: [
        { label: 'Επιμερισμός', details: '√2 · √8 ＋ √2 · √18' },
        { label: 'Ιδιότητα γινομένου ριζών', details: '√16 ＋ √36' },
        { label: 'Υπολογισμός ριζών', details: '4 ＋ 6 ＝ 10' }
      ],
      explanation: '√2 · √8 ＝ √16 ＝ 4 και √2 · √18 ＝ √36 ＝ 6. Άρα 4 ＋ 6 ＝ 10.'
    };
  },
  () => {
    const k = randInt(2, 4);
    const sumC = k * 3 + k * 2;
    return {
      title: 'Απλοποίηση Κλάσματος με Κοινό Παράγοντα Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η τιμή του κλάσματος <Frac num={<span className="inline-flex items-center gap-1">{sumC} · <Radical>5</Radical></span>} den={<span className="inline-flex items-center gap-1">{k} · <Radical>5</Radical></span>} />;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Απλοποίηση ρίζας', details: 'Η κοινή ρίζα √5 απλοποιείται' },
        { label: 'Διαίρεση συντελεστών', details: `${sumC} / ${k} ＝ 5` }
      ],
      explanation: `Η ρίζα √5 απλοποιείται από αριθμητή και παρονομαστή, οπότε απομένει ${sumC} / ${k} ＝ 5.`
    };
  },
  () => {
    return {
      title: 'Ανάπτυγμα Διπλής Επιμεριστικής',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η αριθμητική τιμή της παράστασης (<Radical>3</Radical> ＋ 1) · (<Radical>3</Radical> ＋ 2) － 3 · <Radical>3</Radical>;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Ανάπτυγμα γινομένου', details: '(√3)² ＋ 2·√3 ＋ √3 ＋ 2 ＝ 3 ＋ 3·√3 ＋ 2 ＝ 5 ＋ 3·√3' },
        { label: 'Αφαίρεση 3·√3', details: '5 ＋ 3·√3 － 3·√3 ＝ 5' }
      ],
      explanation: 'Το γινόμενο δίνει 5 ＋ 3·√3. Αφαιρώντας το 3·√3, απομένει ο ακέραιος 5.'
    };
  }
];

// POOL Q10: Αριθμοί Ανάλογοι προς Ρίζες & Επίλυση Εξισώσεων
const PROBLEM_POOL_Q10 = [
  () => {
    const mult = randInt(5, 9);
    const target = 7 * mult;
    return {
      title: 'Αριθμοί Ανάλογοι προς Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Οι θετικοί αριθμοί x, y, z είναι ανάλογοι προς τους 3, <Radical>3</Radical> και <Radical>7</Radical> αντίστοιχα, και ισχύει: x － y · <Radical>3</Radical> ＋ z · <Radical>7</Radical> ＝ {target}. Ποια είναι η τιμή του x;
        </span>
      ),
      correct: 3 * mult,
      type: 'input',
      tableData: [
        { label: 'Σχέση αναλογίας', details: 'x/3 ＝ y/√3 ＝ z/√7 ＝ λ => x ＝ 3λ, y ＝ λ√3, z ＝ λ√7' },
        { label: 'Αντικατάσταση στην εξίσωση', details: `3λ － (λ√3)·√3 ＋ (λ√7)·√7 ＝ ${target}` },
        { label: 'Αναγωγή', details: `3λ － 3λ ＋ 7λ ＝ ${target} => 7λ ＝ ${target} => λ ＝ ${mult}` },
        { label: 'Υπολογισμός x', details: `x ＝ 3 · ${mult} ＝ ${3 * mult}` }
      ],
      explanation: `Θέτουμε x ＝ 3λ, y ＝ λ√3, z ＝ λ√7. Τότε 3λ － 3λ ＋ 7λ ＝ 7λ ＝ ${target}, άρα λ ＝ ${mult} και x ＝ 3 · ${mult} ＝ ${3 * mult}.`
    };
  },
  () => {
    const mult = randInt(4, 8);
    const target = 5 * mult;
    return {
      title: 'Αναλογία με Ρίζες √2 και √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Οι αριθμοί x, y, z είναι ανάλογοι προς τους 2, <Radical>2</Radical> και <Radical>5</Radical>, και ικανοποιούν τη σχέση: x － y · <Radical>2</Radical> ＋ z · <Radical>5</Radical> ＝ {target}. Ποια είναι η τιμή του x;
        </span>
      ),
      correct: 2 * mult,
      type: 'input',
      tableData: [
        { label: 'Αναλογίες', details: 'x ＝ 2λ, y ＝ λ√2, z ＝ λ√5' },
        { label: 'Αντικατάσταση', details: `2λ － 2λ ＋ 5λ ＝ ${target} => 5λ ＝ ${target} => λ ＝ ${mult}` },
        { label: 'Τιμή x', details: `x ＝ 2 · ${mult} ＝ ${2 * mult}` }
      ],
      explanation: `Αντικαθιστώντας βρίσκουμε 5λ ＝ ${target} => λ ＝ ${mult}, επομένως x ＝ 2λ ＝ ${2 * mult}.`
    };
  },
  () => {
    return {
      title: 'Επίλυση Εξίσωσης με Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η λύση της εξίσωσης <Radical>3</Radical> · x ＝ <Radical>48</Radical>;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Επίλυση ως προς x', details: 'x ＝ √48 / √3' },
        { label: 'Ιδιότητα πηλίκου ριζών', details: 'x ＝ √(48 / 3) ＝ √16' },
        { label: 'Αποτέλεσμα', details: 'x ＝ 4' }
      ],
      explanation: 'x ＝ √(48/3) ＝ √16 ＝ 4.'
    };
  },
  () => {
    return {
      title: 'Εξίσωση με Δυνάμεις Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Να λυθεί η εξίσωση: (<Radical>5</Radical>)<sup>－2</sup> · x ＝ 2 · (<Radical>2</Radical>)<sup>2</sup>.
        </span>
      ),
      correct: 20,
      type: 'input',
      tableData: [
        { label: '1ο μέλος', details: '(√5)⁻² · x ＝ (1/5) · x' },
        { label: '2ο μέλος', details: '2 · (√2)² ＝ 2 · 2 ＝ 4' },
        { label: 'Εξίσωση', details: '(1/5) · x ＝ 4 => x ＝ 4 · 5 ＝ 20' }
      ],
      explanation: '(1/5) · x ＝ 4 => x ＝ 20.'
    };
  },
  () => {
    return {
      title: 'Υπολογισμός Παράστασης με Δοσμένο Άθροισμα',
      prompt: 'Αν x ＋ y ＝ －4, ποια είναι η τιμή της παράστασης Α ＝ 4x － (3x － y) ＋ 7;',
      correct: 3,
      type: 'input',
      tableData: [
        { label: 'Απαλοιφή παρένθεσης', details: 'Α ＝ 4x － 3x ＋ y ＋ 7' },
        { label: 'Αναγωγή', details: 'Α ＝ (x ＋ y) ＋ 7' },
        { label: 'Αντικατάσταση x ＋ y ＝ －4', details: 'Α ＝ －4 ＋ 7 ＝ 3' }
      ],
      explanation: 'Απαλείφοντας την παρένθεση προκύπτει Α ＝ x ＋ y ＋ 7. Επειδή x ＋ y ＝ －4, έχουμε Α ＝ －4 ＋ 7 ＝ 3.'
    };
  },
  () => {
    return {
      title: 'Εξέταση Αδύνατης Εξίσωσης με Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσες λύσεις έχει η εξίσωση <Radical>12</Radical> · x － 5 ＝ 2 · <Radical>3</Radical> · x;
        </span>
      ),
      correct: 'Καμία λύση (Αδύνατη)',
      type: 'mcq',
      distractors: () => ['Μία μοναδική λύση το 5', 'Άπειρες λύσεις (Ταυτότητα)', 'Μία λύση το 0'][randInt(0, 2)],
      tableData: [
        { label: 'Ανάλυση √12', details: '√12 ＝ √(4·3) ＝ 2√3' },
        { label: 'Μορφή εξίσωσης', details: '2√3 · x － 5 ＝ 2√3 · x' },
        { label: 'Απλοποίηση', details: '0 · x ＝ 5 (Αδύνατη)' }
      ],
      explanation: 'Επειδή √12 ＝ 2√3, οι όροι με το x είναι ίσοι και εξουδετερώνονται: 0 · x ＝ 5, συνεπώς η εξίσωση είναι αδύνατη.'
    };
  }
];

// POOL Q11: Σύνθετες Αριθμητικές Παραστάσεις (Προτεραιότητα Πράξεων & Διαγωνισμοί ΕΜΕ)
const PROBLEM_POOL_Q11 = [
  () => {
    return {
      title: 'Θέμα Διαγωνισμού Ε.Μ.Ε. «Ο Θαλής»',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Αν ο πραγματικός αριθμός α είναι η ρητή προσέγγιση δεκάτου (0,1) με έλλειψη του <Radical>5</Radical> (δηλ. α ＝ 2,2), να βρεθεί η τιμή της παράστασης: Α ＝ 3 · (3α － 4,6) － 2 · (α － 0,2).
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: 'Τιμή του α', details: 'α ＝ 2,2' },
        { label: '1η παρένθεση', details: '3 · 2,2 － 4,6 ＝ 6,6 － 4,6 ＝ 2' },
        { label: '2η παρένθεση', details: '2,2 － 0,2 ＝ 2' },
        { label: 'Τελικός υπολογισμός', details: '3 · 2 － 2 · 2 ＝ 6 － 4 ＝ 2' }
      ],
      explanation: '3 · (6,6 － 4,6) － 2 · (2,2 － 0,2) ＝ 3 · 2 － 2 · 2 ＝ 6 － 4 ＝ 2.'
    };
  },
  () => {
    return {
      title: 'Ένθετες Τετραγωνικές Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Radical><span>21 ＋ <Radical><span>5 ＋ <Radical><span>133 － <Radical>144</Radical></span></Radical></span></Radical></span></Radical>;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: '1ο βήμα (εσωτερική ρίζα)', details: '√144 ＝ 12' },
        { label: '2ο βήμα', details: '133 － 12 ＝ 121  και  √121 ＝ 11' },
        { label: '3ο βήμα', details: '5 ＋ 11 ＝ 16  και  √16 ＝ 4' },
        { label: '4ο βήμα (τελική ρίζα)', details: '21 ＋ 4 ＝ 25  και  √25 ＝ 5' }
      ],
      explanation: 'Υπολογίζουμε από μέσα προς τα έξω: √144 ＝ 12 => √(133－12) ＝ √121 ＝ 11 => √(5＋11) ＝ √16 ＝ 4 => √(21＋4) ＝ √25 ＝ 5.'
    };
  },
  () => {
    return {
      title: 'Σύνθετη Αριθμητική Παράσταση Κλασμάτων',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Να υπολογιστεί η τιμή της παράστασης: (1 － <Frac num="5" den="2" />) · (<Frac num="2" den="5" /> － 1) － 5 · (<Frac num="－3" den="5" />).
        </span>
      ),
      correct: 3.9,
      type: 'input',
      tableData: [
        { label: '1η παρένθεση', details: '1 － 5/2 ＝ －3/2' },
        { label: '2η παρένθεση', details: '2/5 － 1 ＝ －3/5' },
        { label: 'Γινόμενο παρενθέσεων', details: '(－3/2) · (－3/5) ＝ 9/10 ＝ 0,9' },
        { label: '2ος όρος', details: '－ 5 · (－3/5) ＝ ＋3' },
        { label: 'Τελικό άθροισμα', details: '0,9 ＋ 3 ＝ 3,9' }
      ],
      explanation: '(－3/2) · (－3/5) ＋ 3 ＝ 9/10 ＋ 3 ＝ 0,9 ＋ 3 ＝ 3,9 (ή 39/10).'
    };
  },
  () => {
    return {
      title: 'Τοποθέτηση Παρενθέσεων και Προτεραιότητα',
      prompt: 'Πού πρέπει να τοποθετηθούν παρενθέσεις στην έκφραση 4 · 3 : 5 － 2 ώστε το αποτέλεσμα να ισούται ακριβώς με 4;',
      correct: '4 · 3 : (5 － 2)',
      type: 'mcq',
      distractors: () => [
        '(4 · 3) : 5 － 2',
        '4 · (3 : 5) － 2',
        '(4 · 3 : 5) － 2'
      ][randInt(0, 2)],
      tableData: [
        { label: 'Δοκιμή 4 · 3 : (5 － 2)', details: '4 · 3 : 3 ＝ 12 : 3 ＝ 4 (Σωστό!)' },
        { label: 'Δοκιμή (4 · 3) : 5 － 2', details: '12 : 5 － 2 ＝ 2,4 － 2 ＝ 0,4' }
      ],
      explanation: 'Με παρενθέσεις στο 5 － 2 έχουμε 4 · 3 : (3) ＝ 12 : 3 ＝ 4.'
    };
  },
  () => {
    return {
      title: 'Υπολογισμός Υποτείνουσας από Κάθετες Πλευρές',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι <Radical>3</Radical> － 1 και <Radical>3</Radical> ＋ 1. Πόσο ισούται το τετράγωνο της υποτείνουσάς του (c²);
        </span>
      ),
      correct: 8,
      type: 'input',
      tableData: [
        { label: 'Τετράγωνο 1ης πλευράς', details: '(√3 － 1)² ＝ 3 － 2√3 ＋ 1 ＝ 4 － 2√3' },
        { label: 'Τετράγωνο 2ης πλευράς', details: '(√3 ＋ 1)² ＝ 3 ＋ 2√3 ＋ 1 ＝ 4 ＋ 2√3' },
        { label: 'Πυθαγόρειο c² ＝ α² ＋ β²', details: '(4 － 2√3) ＋ (4 ＋ 2√3) ＝ 8' }
      ],
      explanation: 'c² ＝ (√3 － 1)² ＋ (√3 ＋ 1)² ＝ 4 － 2√3 ＋ 4 ＋ 2√3 ＝ 8.'
    };
  },
  () => {
    return {
      title: 'Θέμα Διαγωνισμού Ε.Μ.Ε. με Παραμέτρους',
      prompt: 'Αν α － β ＝ 2, να υπολογιστεί η τιμή της παράστασης Α ＝ 5 · (2α ＋ β) － 5 · (α ＋ 2β).',
      correct: 10,
      type: 'input',
      tableData: [
        { label: 'Επιμεριστική', details: '10α ＋ 5β － 5α － 10β' },
        { label: 'Αναγωγή', details: '5α － 5β ＝ 5 · (α － β)' },
        { label: 'Αντικατάσταση α － β ＝ 2', details: '5 · 2 ＝ 10' }
      ],
      explanation: 'Α ＝ 5α － 5β ＝ 5 · (α － β) ＝ 5 · 2 ＝ 10.'
    };
  }
];

// POOL Q12: Γεωμετρικά & Ρεαλιστικά Προβλήματα
const PROBLEM_POOL_Q12 = [
  () => {
    const p1 = 68;
    const p2 = 70;
    const p3 = 54;
    const p4 = 60;
    return {
      title: 'Πρόβλημα Καταμερισμού Οικοπέδων',
      prompt: `Τέσσερα αδέλφια χώρισαν ένα ορθογώνιο οικόπεδο σε 4 μικρότερα με παράλληλες γραμμές. Τα οικόπεδα έχουν περιμέτρους ${p1} m, ${p2} m, ${p3} m και ${p4} m αντίστοιχα. Ποια είναι η εξωτερική περίμετρος ολόκληρου του αρχικού οικοπέδου σε μέτρα;`,
      correct: 126,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'Άθροισμα περιμέτρων 4 οικοπέδων', details: `${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ 252 m` },
        { label: 'Ανάλυση εσωτερικών/εξωτερικών πλευρών', details: 'Κάθε εξωτερική πλευρά μετράται 1 φορά, κάθε εσωτερική 2 φορές' },
        { label: 'Εξωτερική περίμετρος', details: '252 / 2 ＝ 126 m' }
      ],
      explanation: 'Το άθροισμα των περιμέτρων των 4 οικοπέδων περιέχει την εξωτερική περίμετρο διπλάσια. Άρα η εξωτερική περίμετρος είναι 252 / 2 ＝ 126 m.'
    };
  },
  () => {
    return {
      title: 'Υποτείνουσα Ορθογωνίου Τριγώνου με Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές έχουν μήκη 3 · <Radical>2</Radical> cm και 4 · <Radical>2</Radical> cm. Πόσο είναι το μήκος της υποτείνουσάς του σε cm;
        </span>
      ),
      correct: '5·√2',
      type: 'mcq',
      distractors: () => ['7·√2', '10', '5·√4'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '5·√2') return <span className="inline-flex items-center gap-1">5 · <Radical>2</Radical> cm</span>;
        if (opt === '7·√2') return <span className="inline-flex items-center gap-1">7 · <Radical>2</Radical> cm</span>;
        return opt;
      },
      tableData: [
        { label: 'Τετράγωνο 1ης πλευράς', details: '(3√2)² ＝ 9 · 2 ＝ 18' },
        { label: 'Τετράγωνο 2ης πλευράς', details: '(4√2)² ＝ 16 · 2 ＝ 32' },
        { label: 'Υποτείνουσα c²', details: 'c² ＝ 18 ＋ 32 ＝ 50 => c ＝ √50 ＝ √(25·2) ＝ 5√2 cm' }
      ],
      explanation: 'c² ＝ 18 ＋ 32 ＝ 50 => c ＝ √50 ＝ 5 · √2 cm.'
    };
  },
  () => {
    return {
      title: 'Εμβαδόν Τριγώνου με Πλευρές Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το εμβαδόν ορθογωνίου τριγώνου με κάθετες πλευρές 3 · <Radical>2</Radical> cm και 4 · <Radical>2</Radical> cm σε cm²;
        </span>
      ),
      correct: 12,
      type: 'input',
      unit: 'cm²',
      tableData: [
        { label: 'Τύπος εμβαδού', details: 'Ε ＝ (α · β) / 2' },
        { label: 'Γινόμενο πλευρών', details: '(3√2) · (4√2) ＝ 12 · (√2)² ＝ 12 · 2 ＝ 24' },
        { label: 'Υπολογισμός', details: '24 / 2 ＝ 12 cm²' }
      ],
      explanation: 'Ε ＝ (3√2 · 4√2) / 2 ＝ (12 · 2) / 2 ＝ 12 cm².'
    };
  },
  () => {
    return {
      title: 'Απλοποίηση Γεωμετρικής Διάστασης με Ρίζες',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Το μήκος ενός οικοπέδου δίνεται από την παράσταση L ＝ 3 · <Radical>48</Radical> － 2 · <Radical>75</Radical>. Ποιος είναι ο συντελεστής του <Radical>3</Radical> στην απλοποιημένη του μορφή (α · <Radical>3</Radical>);
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { label: 'Ανάλυση √48', details: '√48 ＝ √(16·3) ＝ 4√3 => 3 · 4√3 ＝ 12√3' },
        { label: 'Ανάλυση √75', details: '√75 ＝ √(25·3) ＝ 5√3 => 2 · 5√3 ＝ 10√3' },
        { label: 'Αφαίρεση', details: '12√3 － 10√3 ＝ 2√3' }
      ],
      explanation: '3 · (4√3) － 2 · (5√3) ＝ 12√3 － 10√3 ＝ 2 · √3. Ο συντελεστής είναι 2.'
    };
  },
  () => {
    return {
      title: 'Εμβαδόν Τετραγώνου με Άθροισμα Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ένα τετράγωνο έχει πλευρά μήκους s ＝ <Radical>8</Radical> ＋ <Radical>2</Radical> m. Πόσο είναι το εμβαδόν του σε m²;
        </span>
      ),
      correct: 18,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Απλοποίηση πλευράς', details: '√8 ＝ √(4·2) ＝ 2√2 => s ＝ 2√2 ＋ √2 ＝ 3√2 m' },
        { label: 'Τύπος εμβαδού', details: 'Ε ＝ s² ＝ (3√2)² ＝ 3² · (√2)² ＝ 9 · 2 ＝ 18 m²' }
      ],
      explanation: 's ＝ 2√2 ＋ √2 ＝ 3√2 m. Ε ＝ (3√2)² ＝ 9 · 2 ＝ 18 m².'
    };
  },
  () => {
    return {
      title: 'Ρεαλιστικό Πρόβλημα Διέλευσης (Πυθαγόρειο)',
      prompt: 'Μια πόρτα έχει ύψος 2 m και πλάτος 1 m. Μπορεί να περάσει πλάγια από την πόρτα ένας τετράγωνος καθρέφτης πλευράς 2,10 m (χωρίς να γείρει εκτός επιπέδου);',
      correct: 'Ναι, γιατί η διαγώνιος της πόρτας είναι √5 ≈ 2,24 m ＞ 2,10 m',
      type: 'mcq',
      distractors: () => [
        'Όχι, γιατί το ύψος 2 m είναι μικρότερο από το 2,10 m',
        'Όχι, γιατί το πλάτος 1 m είναι πολύ στενό',
        'Ναι, μόνο αν αφαιρεθεί η κάσα της πόρτας'
      ][randInt(0, 2)],
      tableData: [
        { label: 'Μέγιστο άνοιγμα πόρτας (διαγώνιος d)', details: 'd² ＝ 2² ＋ 1² ＝ 4 ＋ 1 ＝ 5 => d ＝ √5 m' },
        { label: 'Ρητή προσέγγιση του √5', details: '√5 ≈ 2,236 m' },
        { label: 'Σύγκριση', details: '2,10 m ＜ 2,236 m (χωράει διαγώνια)' }
      ],
      explanation: 'Η διαγώνιος της πόρτας είναι √5 ≈ 2,24 m. Επειδή 2,10 m ＜ 2,24 m, ο καθρέφτης μπορεί να περάσει τοποθετημένος διαγώνια.'
    };
  }
];

export default function PrakseisPragmatikonExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Αντιμεταθετική ιδιότητα
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Αντιμεταθετική Ιδιότητα στο ℝ',
      prompt: q1IsCorrect
        ? 'Για οποιουσδήποτε πραγματικούς αριθμούς α και β, ισχύει πάντοτε α ＋ β ＝ β ＋ α και α · β ＝ β · α.'
        : 'Η αντιμεταθετική ιδιότητα ισχύει μόνο για τους ρητούς αριθμούς και παύει να ισχύει όταν συμμετέχουν άρρητοι.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Η αντιμεταθετική ιδιότητα ισχύει καθολικά για όλους τους πραγματικούς αριθμούς.'
    });

    // Q2: True / False - Διαίρεση με το μηδέν
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Διαίρεση με το Μηδέν',
      prompt: q2Choice
        ? 'Η διαίρεση πραγματικού αριθμού με το μηδέν (δηλαδή κλάσμα με παρονομαστή 0) δεν ορίζεται ποτέ.'
        : 'Αν διαιρέσουμε έναν πραγματικό αριθμό με το μηδέν, το πηλίκο ισούται πάντοτε με 0.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Στα μαθηματικά η διαίρεση με το μηδέν δεν ορίζεται ποτέ.'
    });

    // Q3: MCQ - Αντίστροφοι αριθμοί
    qList.push({
      id: 3,
      title: 'Αντίστροφοι Πραγματικοί Αριθμοί',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο αντίστροφος του αριθμού －<Frac num="2" den="5" />;
        </span>
      ),
      type: 'mcq',
      correct: '－5/2',
      options: ensureFourUniqueOptions('－5/2', () => ['2/5', '5/2', '－2/5'][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === '－5/2') return <Frac num="－5" den="2" />;
        if (opt === '5/2') return <Frac num="5" den="2" />;
        if (opt === '2/5') return <Frac num="2" den="5" />;
        if (opt === '－2/5') return <Frac num="－2" den="5" />;
        return opt;
      },
      explanation: 'Ο αντίστροφος ενός αριθμού α/β είναι ο β/α και διατηρεί το ίδιο πρόσημο: (－2/5) · (－5/2) ＝ 1.'
    });

    // Q4: MCQ - Πρόσθεση μη όμοιων ριζών (Fixed push syntax)
    qList.push({
      id: 4,
      title: 'Πρόσθεση Μη Όμοιων Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Η παράσταση <Radical>2</Radical> ＋ <Radical>3</Radical>:
        </span>
      ),
      type: 'mcq',
      correct: 'Δεν απλοποιείται περαιτέρω (δεν ισούται με √5)',
      options: ensureFourUniqueOptions('Δεν απλοποιείται περαιτέρω (δεν ισούται με √5)', () => [
        'Ισούται με √5',
        'Ισούται με √6',
        'Ισούται με 5'
      ][randInt(0, 2)]),
      renderOption: (opt) => {
        if (opt === 'Ισούται με √5') return <span className="inline-flex items-center gap-1">Ισούται με <Radical>5</Radical></span>;
        if (opt === 'Ισούται με √6') return <span className="inline-flex items-center gap-1">Ισούται με <Radical>6</Radical></span>;
        return opt;
      },
      explanation: 'Προσθέτουμε μόνο όμοιες ρίζες. Η έκφραση √2 ＋ √3 δεν γίνεται √5.'
    });

    // Q5: Input - Γινόμενο με αντίστροφο
    qList.push({
      id: 5,
      title: 'Γινόμενο με Αντίστροφο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>13</Radical> · <Frac num="1" den={<Radical>13</Radical>} />;
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: 'Το γινόμενο κάθε μη μηδενικού πραγματικού με τον αντίστροφό του ισούται με 1.'
    });

    // Q6: MCQ - Πρόσημο γινομένου
    qList.push({
      id: 6,
      title: 'Κανόνας Προσήμων Γινομένου',
      prompt: 'Ποιο είναι το πρόσημο του γινομένου (－1) · (－α) · (－β), αν α ＜ 0 και β ＞ 0;',
      type: 'mcq',
      correct: 'Θετικό (＋)',
      options: ensureFourUniqueOptions('Θετικό (＋)', () => ['Αρνητικό (－)', 'Μηδέν', 'Εξαρτάται από τις τιμές'][randInt(0, 2)]),
      tableData: [
        { label: 'Πρόσημο του －1', details: 'Αρνητικό (－)' },
        { label: 'Πρόσημο του －α (α ＜ 0)', details: 'Θετικό (＋)' },
        { label: 'Πρόσημο του －β (β ＞ 0)', details: 'Αρνητικό (－)' },
        { label: 'Συνολικό γινόμενο', details: '(－) · (＋) · (－) ＝ ＋ (θετικό)' }
      ],
      explanation: 'Έχουμε δύο αρνητικούς παράγοντες και έναν θετικό, άρα το γινόμενο είναι θετικό (＋).'
    });

    // Q7: Input - Άθροισμα αντιθέτων
    const valK = randInt(4, 9);
    qList.push({
      id: 7,
      title: 'Άθροισμα Αντιθέτων Πραγματικών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης {valK} · <Radical>3</Radical> ＋ (－{valK} · <Radical>3</Radical>);
        </span>
      ),
      type: 'input',
      correct: 0,
      explanation: 'Το άθροισμα δύο αντίθετων πραγματικών αριθμών είναι πάντοτε ίσο με 0.'
    });

    // Q8: MCQ - Επιμεριστική Ιδιότητα
    qList.push({
      id: 8,
      title: 'Επιμεριστική Ιδιότητα',
      prompt: 'Ποια από τις παρακάτω σχέσεις εκφράζει σωστά την επιμεριστική ιδιότητα;',
      type: 'mcq',
      correct: 'α · (β ＋ γ) ＝ α · β ＋ α · γ',
      options: ensureFourUniqueOptions('α · (β ＋ γ) ＝ α · β ＋ α · γ', () => [
        'α · (β ＋ γ) ＝ α · β ＋ γ',
        'α ＋ (β · γ) ＝ (α ＋ β) · (α ＋ γ)',
        'α · (β · γ) ＝ (α · β) · γ'
      ][randInt(0, 2)]),
      explanation: 'Ο εξωτερικός πολλαπλασιαστής επιμερίζεται σε κάθε όρο της παρένθεσης.'
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
      title="Ασκήσεις: Πράξεις Πραγματικών Αριθμών | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στις πράξεις και τις ιδιότητες των πραγματικών αριθμών, αναγωγή ριζών και επιμεριστική με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/04-prakseis-pragmatikon"
      backText="Θεωρία Κεφ. 4"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/04-prakseis-pragmatikon"
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
                Πράξεις Πραγματικών Αριθμών: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα πράξεων, επιμεριστικής, αναλογιών και ριζών.
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις πράξεις και τις ιδιότητες των πραγματικών αριθμών.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τους κανόνες προσήμων και τις ρίζες!'}
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
