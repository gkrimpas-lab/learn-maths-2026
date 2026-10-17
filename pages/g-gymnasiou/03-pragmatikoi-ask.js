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

// POOL Q9: Σύγκριση ρητού με άρρητο μέσω τετραγώνων (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q9 = [
  () => {
    return {
      title: 'Σύγκριση √7 και 2,6',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο <Radical>7</Radical> και τον ρητό αριθμό 2,6;
        </span>
      ),
      correct: '√7 ＞ 2,6',
      type: 'mcq',
      distractors: () => ['√7 ＜ 2,6', '√7 ＝ 2,6', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√7 ＞ 2,6') return <span className="inline-flex items-center gap-1"><Radical>7</Radical> ＞ 2,6</span>;
        if (opt === '√7 ＜ 2,6') return <span className="inline-flex items-center gap-1"><Radical>7</Radical> ＜ 2,6</span>;
        if (opt === '√7 ＝ 2,6') return <span className="inline-flex items-center gap-1"><Radical>7</Radical> ＝ 2,6</span>;
        return opt;
      },
      tableData: [
        { label: 'Τετράγωνο του √7', details: '(√7)² ＝ 7' },
        { label: 'Τετράγωνο του 2,6', details: '2,6² ＝ 6,76' },
        { label: 'Σύγκριση', details: '7 ＞ 6,76 => √7 ＞ 2,6' }
      ],
      explanation: 'Υψώνουμε στο τετράγωνο: (√7)² ＝ 7 και 2,6² ＝ 6,76. Επειδή 7 ＞ 6,76, ισχύει √7 ＞ 2,6.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση √10 και 3,2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο <Radical>10</Radical> και τον ρητό αριθμό 3,2;
        </span>
      ),
      correct: '√10 ＜ 3,2',
      type: 'mcq',
      distractors: () => ['√10 ＞ 3,2', '√10 ＝ 3,2', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√10 ＜ 3,2') return <span className="inline-flex items-center gap-1"><Radical>10</Radical> ＜ 3,2</span>;
        if (opt === '√10 ＞ 3,2') return <span className="inline-flex items-center gap-1"><Radical>10</Radical> ＞ 3,2</span>;
        if (opt === '√10 ＝ 3,2') return <span className="inline-flex items-center gap-1"><Radical>10</Radical> ＝ 3,2</span>;
        return opt;
      },
      tableData: [
        { label: 'Τετράγωνο του √10', details: '(√10)² ＝ 10' },
        { label: 'Τετράγωνο του 3,2', details: '3,2² ＝ 10,24' },
        { label: 'Σύγκριση', details: '10 ＜ 10,24 => √10 ＜ 3,2' }
      ],
      explanation: '(√10)² ＝ 10 και 3,2² ＝ 10,24. Επειδή 10 ＜ 10,24, ισχύει √10 ＜ 3,2.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση √3 και 1,7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο <Radical>3</Radical> και τον ρητό αριθμό 1,7;
        </span>
      ),
      correct: '√3 ＞ 1,7',
      type: 'mcq',
      distractors: () => ['√3 ＜ 1,7', '√3 ＝ 1,7', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√3 ＞ 1,7') return <span className="inline-flex items-center gap-1"><Radical>3</Radical> ＞ 1,7</span>;
        if (opt === '√3 ＜ 1,7') return <span className="inline-flex items-center gap-1"><Radical>3</Radical> ＜ 1,7</span>;
        if (opt === '√3 ＝ 1,7') return <span className="inline-flex items-center gap-1"><Radical>3</Radical> ＝ 1,7</span>;
        return opt;
      },
      tableData: [
        { label: 'Τετράγωνο του √3', details: '(√3)² ＝ 3' },
        { label: 'Τετράγωνο του 1,7', details: '1,7² ＝ 2,89' },
        { label: 'Σύγκριση', details: '3 ＞ 2,89 => √3 ＞ 1,7' }
      ],
      explanation: '(√3)² ＝ 3 και 1,7² ＝ 2,89. Επειδή 3 ＞ 2,89, ισχύει √3 ＞ 1,7.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση √5 και 2,3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο <Radical>5</Radical> και τον ρητό αριθμό 2,3;
        </span>
      ),
      correct: '√5 ＜ 2,3',
      type: 'mcq',
      distractors: () => ['√5 ＞ 2,3', '√5 ＝ 2,3', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√5 ＜ 2,3') return <span className="inline-flex items-center gap-1"><Radical>5</Radical> ＜ 2,3</span>;
        if (opt === '√5 ＞ 2,3') return <span className="inline-flex items-center gap-1"><Radical>5</Radical> ＞ 2,3</span>;
        if (opt === '√5 ＝ 2,3') return <span className="inline-flex items-center gap-1"><Radical>5</Radical> ＝ 2,3</span>;
        return opt;
      },
      tableData: [
        { label: 'Τετράγωνο του √5', details: '(√5)² ＝ 5' },
        { label: 'Τετράγωνο του 2,3', details: '2,3² ＝ 5,29' },
        { label: 'Σύγκριση', details: '5 ＜ 5,29 => √5 ＜ 2,3' }
      ],
      explanation: '(√5)² ＝ 5 και 2,3² ＝ 5,29. Επειδή 5 ＜ 5,29, ισχύει √5 ＜ 2,3.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση Αρνητικών Αριθμών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση ανάμεσα στους αρνητικούς αριθμούς －<Radical>2</Radical> και －1,5;
        </span>
      ),
      correct: '－√2 ＞ －1,5',
      type: 'mcq',
      distractors: () => ['－√2 ＜ －1,5', '－√2 ＝ －1,5', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '－√2 ＞ －1,5') return <span className="inline-flex items-center gap-1">－<Radical>2</Radical> ＞ －1,5</span>;
        if (opt === '－√2 ＜ －1,5') return <span className="inline-flex items-center gap-1">－<Radical>2</Radical> ＜ －1,5</span>;
        if (opt === '－√2 ＝ －1,5') return <span className="inline-flex items-center gap-1">－<Radical>2</Radical> ＝ －1,5</span>;
        return opt;
      },
      tableData: [
        { label: 'Θετικές τιμές', details: '√2 ≈ 1,414 ＜ 1,5' },
        { label: 'Κανόνας αρνητικών', details: 'Αν α ＜ β τότε －α ＞ －β' },
        { label: 'Σύγκριση', details: '－√2 ＞ －1,5' }
      ],
      explanation: 'Επειδή √2 ≈ 1,414 ＜ 1,5, αλλάζοντας πρόσημο η φορά της ανισότητας αντιστρέφεται: －√2 ＞ －1,5.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση π και 22/7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση ανάμεσα στον αριθμό π και την κλασματική προσέγγιση του Αρχιμήδη <Frac num="22" den="7" />;
        </span>
      ),
      correct: 'π ＜ 22/7',
      type: 'mcq',
      distractors: () => ['π ＝ 22/7', 'π ＞ 22/7', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === 'π ＜ 22/7') return <span className="inline-flex items-center gap-1">π ＜ <Frac num="22" den="7" /></span>;
        if (opt === 'π ＝ 22/7') return <span className="inline-flex items-center gap-1">π ＝ <Frac num="22" den="7" /></span>;
        if (opt === 'π ＞ 22/7') return <span className="inline-flex items-center gap-1">π ＞ <Frac num="22" den="7" /></span>;
        return opt;
      },
      tableData: [
        { label: 'Αριθμός π', details: 'π ≈ 3,14159...' },
        { label: 'Κλάσμα 22/7', details: '22/7 ≈ 3,14285...' },
        { label: 'Σύγκριση', details: '3,14159... ＜ 3,14285... => π ＜ 22/7' }
      ],
      explanation: 'Ο αριθμός π ισούται με 3,14159... ενώ το κλάσμα 22/7 ισούται με 3,14285... Επομένως π ＜ 22/7.'
    };
  }
];

// POOL Q10: Ταξινόμηση σε αριθμητικά σύνολα (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q10 = [
  () => {
    return {
      title: 'Σύνολο του √36',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Σε ποιο από τα παρακάτω σύνολα ανήκει ο αριθμός <Radical>36</Radical>;
        </span>
      ),
      correct: 'ℕ (Φυσικοί αριθμοί)',
      type: 'mcq',
      distractors: () => ['Μόνο στους Άρρητους', 'Μόνο στους Αρνητικούς', 'Σε κανένα σύνολο'][randInt(0, 2)],
      tableData: [
        { label: 'Υπολογισμός', details: '√36 ＝ 6' },
        { label: 'Σύνολο', details: 'Το 6 είναι φυσικός αριθμός (6 ∈ ℕ)' }
      ],
      explanation: 'Επειδή 6² ＝ 36, ισχύει √36 ＝ 6, που είναι φυσικός αριθμός.'
    };
  },
  () => {
    return {
      title: 'Σύνολο του －10/2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει ο αριθμός <Frac num="－10" den="2" />;
        </span>
      ),
      correct: 'ℤ (Ακέραιοι αριθμοί)',
      type: 'mcq',
      distractors: () => ['ℕ (Φυσικοί αριθμοί)', 'Άρρητοι αριθμοί', 'Μόνο στο ℝ'][randInt(0, 2)],
      tableData: [
        { label: 'Υπολογισμός', details: '－10 / 2 ＝ －5' },
        { label: 'Σύνολο', details: 'Το －5 είναι αρνητικός ακέραιος (－5 ∈ ℤ)' }
      ],
      explanation: 'Το κλάσμα απλοποιείται σε －10 / 2 ＝ －5, που είναι ακέραιος αριθμός.'
    };
  },
  () => {
    return {
      title: 'Σύνολο του 0,777...',
      prompt: 'Σε ποιο σύνολο ανήκει ο περιοδικός δεκαδικός αριθμός 0,777...;',
      correct: 'ℚ (Ρητοί αριθμοί)',
      type: 'mcq',
      distractors: () => ['Άρρητοι αριθμοί', 'ℤ (Ακέραιοι αριθμοί)', 'ℕ (Φυσικοί αριθμοί)'][randInt(0, 2)],
      tableData: [
        { label: 'Κλασματική μορφή', details: '0,777... ＝ 7/9' },
        { label: 'Σύνολο', details: '7/9 ∈ ℚ (Ρητός)' }
      ],
      explanation: 'Κάθε περιοδικός δεκαδικός γράφεται ως κλάσμα (0,777... ＝ 7/9), άρα είναι ρητός αριθμός.'
    };
  },
  () => {
    return {
      title: 'Σύνολο του √8',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ο αριθμός <Radical>8</Radical> ανήκει στο σύνολο:
        </span>
      ),
      correct: 'Των Άρρητων αριθμών',
      type: 'mcq',
      distractors: () => ['ℚ (Ρητοί αριθμοί)', 'ℤ (Ακέραιοι αριθμοί)', 'ℕ (Φυσικοί αριθμοί)'][randInt(0, 2)],
      tableData: [
        { label: 'Έλεγχος τετραγώνου', details: 'Το 8 δεν είναι τέλειο τετράγωνο' },
        { label: 'Σύνολο', details: '√8 ∈ Άρρητοι (και συνεπώς √8 ∈ ℝ)' }
      ],
      explanation: 'Το 8 δεν είναι τέλειο τετράγωνο φυσικού αριθμού, άρα η τετραγωνική του ρίζα είναι άρρητος αριθμός.'
    };
  },
  () => {
    return {
      title: 'Σύνολο του 0',
      prompt: 'Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει ο αριθμός 0;',
      correct: 'ℕ (Φυσικοί αριθμοί)',
      type: 'mcq',
      distractors: () => ['Μόνο στους Ακέραιους', 'Μόνο στους Ρητούς', 'Στους Άρρητους'][randInt(0, 2)],
      tableData: [
        { label: 'Σύνολο ℕ', details: 'ℕ ＝ {0, 1, 2, 3, ...}' },
        { label: 'Συμπέρασμα', details: 'Το 0 ανήκει στους φυσικούς αριθμούς' }
      ],
      explanation: 'Σύμφωνα με το σχολικό βιβλίο, το 0 είναι φυσικός αριθμός (0 ∈ ℕ).'
    };
  },
  () => {
    return {
      title: 'Σύνολο του π',
      prompt: 'Ο αριθμός π ανήκει στο σύνολο:',
      correct: 'Των Άρρητων αριθμών (και στο ℝ)',
      type: 'mcq',
      distractors: () => ['ℚ (Ρητοί αριθμοί)', 'ℤ (Ακέραιοι αριθμοί)', 'ℕ (Φυσικοί αριθμοί)'][randInt(0, 2)],
      tableData: [
        { label: 'Δεκαδική μορφή', details: '3,14159... (άπειρα ψηφία χωρίς περίοδο)' },
        { label: 'Σύνολο', details: 'π ∈ Άρρητοι' }
      ],
      explanation: 'Ο αριθμός π έχει αποδειχθεί ότι είναι άρρητος αριθμός.'
    };
  }
];

// POOL Q11: Σχετική θέση στον άξονα & τετμημένη (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q11 = [
  () => {
    return {
      title: 'Απόσταση από το Μηδέν',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος από τους παρακάτω αριθμούς βρίσκεται ΠΙΟ ΚΟΝΤΑ στο μηδέν (O) στον άξονα των πραγματικών αριθμών: －<Radical>2</Radical>, 1,5, <Frac num="1" den="2" />, －2;
        </span>
      ),
      correct: '1/2',
      type: 'mcq',
      distractors: () => ['－√2', '1,5', '－2'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '1/2') return <Frac num="1" den="2" />;
        if (opt === '－√2') return <span className="inline-flex items-center gap-1">－<Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { label: '|1/2|', details: '0,5' },
        { label: '|－√2|', details: '≈ 1,414' },
        { label: '|1,5|', details: '1,5' },
        { label: '|－2|', details: '2' }
      ],
      explanation: 'Η απόσταση από το μηδέν ισούται με την απόλυτη τιμή. Η μικρότερη απόλυτη τιμή είναι του 1/2 (0,5).'
    };
  },
  () => {
    return {
      title: 'Μέσο Διαστήματος στον Άξονα',
      prompt: 'Ποιο είναι το μέσο του διαστήματος ανάμεσα στους αριθμούς －3 και 5 στον άξονα των πραγματικών αριθμών;',
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Τύπος μέσου M', details: '(α ＋ β) / 2' },
        { label: 'Υπολογισμός', details: '(－3 ＋ 5) / 2 ＝ 2 / 2 ＝ 1' }
      ],
      explanation: 'Το μέσο ισούται με (－3 ＋ 5) / 2 ＝ 2 / 2 ＝ 1.'
    };
  },
  () => {
    return {
      title: 'Απόσταση Δύο Σημείων στον Άξονα',
      prompt: 'Πόση είναι η απόσταση ανάμεσα στα σημεία Α(－4) και Β(3) στον πραγματικό άξονα;',
      correct: 7,
      type: 'input',
      unit: 'μονάδες',
      tableData: [
        { label: 'Τύπος απόστασης d', details: '|β － α|' },
        { label: 'Υπολογισμός', details: '|3 － (－4)| ＝ |3 ＋ 4| ＝ 7' }
      ],
      explanation: 'Η απόσταση ισούται με |3 － (－4)| ＝ 7 μονάδες.'
    };
  },
  () => {
    return {
      title: 'Ακέραιοι ανάμεσα σε －√5 και √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσοι ΑΚΕΡΑΙΟΙ αριθμοί βρίσκονται ανάμεσα στο －<Radical>5</Radical> και στο <Radical>5</Radical>;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Τιμή του √5', details: '√5 ≈ 2,236' },
        { label: 'Διάστημα', details: '－2,236 ＜ x ＜ 2,236' },
        { label: 'Ακέραιοι', details: '－2, －1, 0, 1, 2 (συνολικά 5)' }
      ],
      explanation: 'Οι ακέραιοι που ικανοποιούν －2,236 ＜ x ＜ 2,236 είναι οι: －2, －1, 0, 1, 2 (δηλαδή 5 ακέραιοι).'
    };
  },
  () => {
    return {
      title: 'Ακέραιοι ανάμεσα σε 0 και √17',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσοι ΦΥΣΙΚΟΙ αριθμοί είναι αυστηρά μικρότεροι από το <Radical>17</Radical>;
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: [
        { label: 'Τιμή του √17', details: '4² ＝ 16 ＜ 17 ＜ 25 ＝ 5² => √17 ≈ 4,12' },
        { label: 'Φυσικοί αριθμοί', details: '0, 1, 2, 3, 4 (συνολικά 5 φυσικοί)' }
      ],
      explanation: 'Οι φυσικοί αριθμοί μικρότεροι από το √17 (≈ 4,12) είναι οι 0, 1, 2, 3, 4 (συνολικά 5).'
    };
  },
  () => {
    return {
      title: 'Διάταξη Αρνητικών στον Άξονα',
      prompt: 'Ποιο σημείο βρίσκεται ΑΡΙΣΤΕΡΟΤΕΡΑ στον άξονα: Α(－5), Β(－2), Γ(0), Δ(1);',
      correct: 'Α(－5)',
      type: 'mcq',
      distractors: () => ['Β(－2)', 'Γ(0)', 'Δ(1)'][randInt(0, 2)],
      tableData: [
        { label: 'Τετμημένες', details: '－5 ＜ －2 ＜ 0 ＜ 1' },
        { label: 'Αριστερότερο σημείο', details: 'Το Α(－5) γιατί έχει τη μικρότερη τετμημένη' }
      ],
      explanation: 'Αριστερότερα στον προσανατολισμένο άξονα βρίσκεται το σημείο με τη μικρότερη τετμημένη, δηλαδή το Α(－5).'
    };
  }
];

// POOL Q12: Σύνθετα προβλήματα διάταξης και πραγματικών καταστάσεων (6 μοναδικά σενάρια)
const PROBLEM_POOL_Q12 = [
  () => {
    const temp1 = -3.5;
    const temp2 = -1.2;
    const diff = Math.round((temp2 - temp1) * 10) / 10;
    return {
      title: 'Διαφορά Θερμοκρασιών στον Πραγματικό Άξονα',
      prompt: `Σε μια ορεινή πόλη η θερμοκρασία το πρωί ήταν ${temp1} °C και το μεσημέρι ανήλθε σε ${temp2} °C. Πόσους βαθμούς Κελσίου (°C) αυξήθηκε η θερμοκρασία;`,
      correct: diff,
      type: 'input',
      unit: '°C',
      tableData: [
        { label: 'Αρχική θερμοκρασία', details: `${temp1} °C` },
        { label: 'Τελική θερμοκρασία', details: `${temp2} °C` },
        { label: 'Διαφορά (Τελική － Αρχική)', details: `${temp2} － (${temp1}) ＝ ${diff} °C` }
      ],
      explanation: `${temp2} － (${temp1}) ＝ ${temp2} ＋ ${Math.abs(temp1)} ＝ ${diff} °C.`
    };
  },
  () => {
    return {
      title: 'Σύγκριση Περιμέτρων Τετραγώνων',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Δύο τετράγωνα έχουν εμβαδά 8 m² και 9 m² αντίστοιχα. Ποια είναι η πλευρά του πρώτου τετραγώνου;
        </span>
      ),
      correct: '√8 m (Άρρητος)',
      type: 'mcq',
      distractors: () => ['4 m', '2 m', '3 m'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√8 m (Άρρητος)') return <span className="inline-flex items-center gap-1"><Radical>8</Radical> m (Άρρητος)</span>;
        return opt;
      },
      tableData: [
        { label: 'Εμβαδόν 1ου', details: 'E₁ ＝ α² ＝ 8 => α ＝ √8 m' },
        { label: 'Εμβαδόν 2ου', details: 'E₂ ＝ β² ＝ 9 => β ＝ 3 m' }
      ],
      explanation: 'Η πλευρά τετραγώνου με εμβαδόν 8 είναι √8 m (άρρητος αριθμός).'
    };
  },
  () => {
    return {
      title: 'Αντίθετος Πραγματικός Αριθμός',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο αντίθετος του αριθμού 3 － <Radical>2</Radical>;
        </span>
      ),
      correct: '√2 － 3',
      type: 'mcq',
      distractors: () => ['－3 － √2', '3 ＋ √2', '√2 ＋ 3'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√2 － 3') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> － 3</span>;
        if (opt === '－3 － √2') return <span className="inline-flex items-center gap-1">－3 － <Radical>2</Radical></span>;
        if (opt === '3 ＋ √2') return <span className="inline-flex items-center gap-1">3 ＋ <Radical>2</Radical></span>;
        if (opt === '√2 ＋ 3') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> ＋ 3</span>;
        return opt;
      },
      tableData: [
        { label: 'Αρχικός αριθμός', details: '3 － √2' },
        { label: 'Αντίθετος', details: '－(3 － √2) ＝ －3 ＋ √2 ＝ √2 － 3' }
      ],
      explanation: 'Ο αντίθετος προκύπτει αλλάζοντας τα πρόσημα όλων των όρων: －(3 － √2) ＝ √2 － 3.'
    };
  },
  () => {
    return {
      title: 'Αντίστροφος Πραγματικός Αριθμός',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιο είναι το γινόμενο του αριθμού <Radical>5</Radical> με τον αντίστροφό του;
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: [
        { label: 'Αριθμός', details: '√5' },
        { label: 'Αντίστροφος', details: '1 / √5' },
        { label: 'Γινόμενο', details: '√5 · (1 / √5) ＝ 1' }
      ],
      explanation: 'Το γινόμενο κάθε μη μηδενικού πραγματικού αριθμού με τον αντίστροφό του ισούται πάντοτε με 1.'
    };
  },
  () => {
    return {
      title: 'Απόλυτη Τιμή Διαφοράς',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση |<Radical>2</Radical> － 2|;
        </span>
      ),
      correct: '2 － √2',
      type: 'mcq',
      distractors: () => ['√2 － 2', '√2 ＋ 2', '2'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '2 － √2') return <span className="inline-flex items-center gap-1">2 － <Radical>2</Radical></span>;
        if (opt === '√2 － 2') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> － 2</span>;
        if (opt === '√2 ＋ 2') return <span className="inline-flex items-center gap-1"><Radical>2</Radical> ＋ 2</span>;
        return opt;
      },
      tableData: [
        { label: 'Πρόσημο υπό απόλυτο', details: '√2 ≈ 1,414 ＜ 2 => √2 － 2 ＜ 0 (αρνητικό)' },
        { label: 'Ορισμός απολύτου', details: '|x| ＝ －x όταν x ＜ 0' },
        { label: 'Αποτέλεσμα', details: '－(√2 － 2) ＝ 2 － √2' }
      ],
      explanation: 'Επειδή √2 ＜ 2, η διαφορά √2 － 2 είναι αρνητική. Άρα |√2 － 2| ＝ 2 － √2.'
    };
  },
  () => {
    return {
      title: 'Σύγκριση Κλασμάτων με Άρρητο',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σωστή σχέση ανάμεσα στον αριθμό <Frac num="1" den="2" /> και τον αριθμό <Frac num="1" den={<Radical>2</Radical>} />;
        </span>
      ),
      correct: '1/2 ＜ 1/√2',
      type: 'mcq',
      distractors: () => ['1/2 ＞ 1/√2', '1/2 ＝ 1/√2', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '1/2 ＜ 1/√2') return <span className="inline-flex items-center gap-1"><Frac num="1" den="2" /> ＜ <Frac num="1" den={<Radical>2</Radical>} /></span>;
        if (opt === '1/2 ＞ 1/√2') return <span className="inline-flex items-center gap-1"><Frac num="1" den="2" /> ＞ <Frac num="1" den={<Radical>2</Radical>} /></span>;
        if (opt === '1/2 ＝ 1/√2') return <span className="inline-flex items-center gap-1"><Frac num="1" den="2" /> ＝ <Frac num="1" den={<Radical>2</Radical>} /></span>;
        return opt;
      },
      tableData: [
        { label: 'Παρονομαστές', details: '2 ＞ √2 (αφού 4 ＞ 2)' },
        { label: 'Κανόνας κλασμάτων', details: 'Με ίδιο αριθμητή, μεγαλύτερο είναι το κλάσμα με τον μικρότερο παρονομαστή' },
        { label: 'Σύγκριση', details: '1/2 ＜ 1/√2' }
      ],
      explanation: 'Επειδή 2 ＞ √2, το κλάσμα με τον μικρότερο παρονομαστή είναι μεγαλύτερο: 1/2 ＜ 1/√2.'
    };
  }
];

export default function PragmatikoiExercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Ορισμός πραγματικών αριθμών
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: 'Ορισμός Πραγματικών Αριθμών',
      prompt: q1IsCorrect
        ? 'Το σύνολο των πραγματικών αριθμών (ℝ) αποτελείται από την ένωση όλων των ρητών και όλων των άρρητων αριθμών.'
        : 'Υπάρχουν πραγματικοί αριθμοί οι οποίοι δεν είναι ούτε ρητοί ούτε άρρητοι.',
      type: 'tf',
      correct: q1IsCorrect ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Εξ ορισμού, κάθε πραγματικός αριθμός είναι είτε ρητός είτε άρρητος (ℝ ＝ ℚ ∪ Άρρητοι).'
    });

    // Q2: True / False - Υποσύνολα
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: 'Σχέση Υποσυνόλων ℕ και ℚ',
      prompt: q2Choice
        ? 'Κάθε φυσικός αριθμός είναι και ρητός αριθμός (δηλαδή ℕ ⊆ ℚ).'
        : 'Υπάρχουν φυσικοί αριθμοί που δεν μπορούν να γραφούν ως ρητοί αριθμοί.',
      type: 'tf',
      correct: q2Choice ? 'Σωστό' : 'Λάθος',
      options: ['Σωστό', 'Λάθος'],
      explanation: 'Ισχύει ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ. Κάθε φυσικός k γράφεται ως k/1, άρα είναι ρητός.'
    });

    // Q3: MCQ - Ξένα σύνολα
    qList.push({
      id: 3,
      title: 'Τομή Ρητών και Άρρητων',
      prompt: 'Ποια είναι η τομή του συνόλου των ρητών αριθμών (ℚ) και του συνόλου των άρρητων αριθμών;',
      type: 'mcq',
      correct: 'Το κενό σύνολο (∅), δεν έχουν κανένα κοινό στοιχείο',
      options: ensureFourUniqueOptions('Το κενό σύνολο (∅), δεν έχουν κανένα κοινό στοιχείο', () => [
        'Το σύνολο των φυσικών αριθμών (ℕ)',
        'Ο αριθμός μηδέν {0}',
        'Όλοι οι δεκαδικοί αριθμοί'
      ][randInt(0, 2)]),
      explanation: 'Ένας αριθμός είναι είτε ρητός (έχει περίοδο ή τερματίζεται) είτε άρρητος (άπειρα ψηφία χωρίς περίοδο). Δεν μπορεί να είναι και τα δύο ταυτόχρονα.'
    });

    // Q4: MCQ - Τετραγωνική ρίζα αρνητικού
    qList.push({
      id: 4,
      title: 'Ρίζα Αρνητικού Αριθμού',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Η παράσταση <Radical>－9</Radical> στο σύνολο των πραγματικών αριθμών (ℝ):
        </span>
      ),
      type: 'mcq',
      correct: 'Δεν ορίζεται (δεν είναι πραγματικός αριθμός)',
      options: ensureFourUniqueOptions('Δεν ορίζεται (δεν είναι πραγματικός αριθμός)', () => [
        'Ισούται με －3',
        'Ισούται με 3',
        'Είναι άρρητος αριθμός'
      ][randInt(0, 2)]),
      explanation: 'Στο σύνολο των πραγματικών αριθμών δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού, καθώς κανενός πραγματικού το τετράγωνο δεν είναι αρνητικό.'
    });

    // Q5: Input - Υπολογισμός ρίζας
    qList.push({
      id: 5,
      title: 'Υπολογισμός Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή του πραγματικού αριθμού (<Radical>7</Radical>)²;
        </span>
      ),
      type: 'input',
      correct: 7,
      explanation: 'Για κάθε μη αρνητικό αριθμό α, ισχύει (√α)² ＝ α. Άρα (√7)² ＝ 7.'
    });

    // Q6: MCQ - Αναγνώριση Άρρητου
    const validArritoi = ['√2', '√3', '√5', 'π'];
    const invalidArritoi = ['√4 (＝ 2)', '√9 (＝ 3)', '0,25', '－3'];
    const q6Correct = validArritoi[randInt(0, validArritoi.length - 1)];
    qList.push({
      id: 6,
      title: 'Αναγνώριση Άρρητου Αριθμού',
      prompt: 'Ποιος από τους παρακάτω πραγματικούς αριθμούς είναι άρρητος;',
      type: 'mcq',
      correct: q6Correct,
      options: ensureFourUniqueOptions(q6Correct, () => invalidArritoi[randInt(0, invalidArritoi.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√5') return <Radical>5</Radical>;
        if (opt === '√4 (＝ 2)') return <span className="inline-flex items-center gap-1"><Radical>4</Radical> (＝ 2)</span>;
        if (opt === '√9 (＝ 3)') return <span className="inline-flex items-center gap-1"><Radical>9</Radical> (＝ 3)</span>;
        return opt;
      },
      explanation: 'Μη τέλεια τετράγωνα κάτω από ρίζα καθώς και ο αριθμός π είναι άρρητοι αριθμοί.'
    });

    // Q7: Input - Απόλυτη τιμή αρνητικού
    const negVal = randInt(4, 9);
    qList.push({
      id: 7,
      title: 'Απόλυτη Τιμή Πραγματικού',
      prompt: `Ποια είναι η τιμή της παράστασης |－${negVal}|;`,
      type: 'input',
      correct: negVal,
      explanation: `Η απόλυτη τιμή ενός αρνητικού αριθμού ισούται με τον αντίθετό του: |－${negVal}| ＝ ${negVal}.`
    });

    // Q8: MCQ - Πληρότητα Άξονα
    qList.push({
      id: 8,
      title: 'Η Ευθεία των Πραγματικών Αριθμών',
      prompt: 'Ποια από τις παρακάτω προτάσεις περιγράφει σωστά τον άξονα των πραγματικών αριθμών;',
      type: 'mcq',
      correct: 'Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό και αντίστροφα',
      options: ensureFourUniqueOptions('Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό και αντίστροφα', () => [
        'Στην ευθεία υπάρχουν κενά σημεία που δεν αντιστοιχούν σε αριθμούς',
        'Μόνο οι ρητοί αριθμοί μπορούν να τοποθετηθούν στον άξονα',
        'Κάθε σημείο της ευθείας παριστάνει τουλάχιστον δύο διαφορετικούς αριθμούς'
      ][randInt(0, 2)]),
      explanation: 'Η αντιστοιχία ανάμεσα στα σημεία της ευθείας και τους πραγματικούς αριθμούς είναι αμφιμονοσήμαντη (1-προς-1), καλύπτοντας πλήρως τον άξονα.'
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
      title="Ασκήσεις: Πραγματικοί Αριθμοί | Γ' Γυμνασίου"
      description="Διαδραστικές ασκήσεις στους πραγματικούς αριθμούς, σύνολα, διάταξη και άξονα με αναλυτικά βήματα για τη Γ' Γυμνασίου."
      backUrl="/g-gymnasiou/03-pragmatikoi"
      backText="Θεωρία Κεφ. 3"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/03-pragmatikoi"
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
                Πραγματικοί Αριθμοί: Εξάσκηση
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                12 δυναμικές ερωτήσεις και αυτούσια προβλήματα διάταξης και συνόλων. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».
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
                ? 'Εξαιρετική επίδοση! Κατανοείτε σε βάθος τους πραγματικούς αριθμούς, τη διάταξη και τις σχέσεις των συνόλων.'
                : score >= 6
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τη διάταξη των πραγματικών αριθμών!'}
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
                      <p>{q.explanation}</p>
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
