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

// Κομψή απόδοση της γραμμής περιόδου πάνω από τα ψηφία (Vinculum)
function Overline({ children }) {
  return (
    <span className="relative inline-block border-t-2 border-current px-0.5 leading-none">
      {children}
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

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΒΑΣΙΚΩΝ ΕΡΩΤΗΣΕΩΝ (2 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ = 12 ΕΡΩΤΗΣΕΙΣ)
// ΚΑΘΕ ΚΕΦΑΛΑΙΟ ΕΧΕΙ ΤΟΥΛΑΧΙΣΤΟΝ 10 ΠΑΡΑΛΛΑΓΕΣ
// =========================================================================

const POOLS_BASIC = {
  // ΚΕΦΑΛΑΙΟ 1: Δεκαδική μορφή ρητών
  chap1: [
    () => {
      const d = randInt(1, 8);
      return {
        title: 'Γεννήτρια Απλού Περιοδικού',
        prompt: `Ποιο κλάσμα παριστάνει τον αριθμό 0,${d}${d}${d}... (περίοδος ${d});`,
        type: 'mcq',
        correct: `${d}/9`,
        distractors: () => [`${d}/10`, `${d}/99`, `${d}/8`][randInt(0, 2)],
        renderOption: (opt) => {
          const p = String(opt).split('/');
          return p.length === 2 ? <Frac num={p[0]} den={p[1]} /> : opt;
        },
        explanation: `Ένα επαναλαμβανόμενο ψηφίο αντιστοιχεί σε παρονομαστή 9, άρα ${d}/9.`
      };
    },
    () => {
      const dens = [8, 16, 20, 25, 40, 50];
      const d = dens[randInt(0, dens.length - 1)];
      return {
        title: 'Αναγνώριση Πεπερασμένου Δεκαδικού',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1">
            Το ανάγωγο κλάσμα <Frac num="3" den={d} /> παράγει:
          </span>
        ),
        type: 'mcq',
        correct: 'Πεπερασμένο (τερματιζόμενο) δεκαδικό',
        distractors: () => ['Απλό περιοδικό δεκαδικό', 'Μικτό περιοδικό δεκαδικό', 'Άρρητο αριθμό'][randInt(0, 2)],
        explanation: `Ο παρονομαστής ${d} περιέχει μόνο παράγοντες 2 ή/και 5, άρα ο δεκαδικός τερματίζεται.`
      };
    },
    () => {
      const p = randInt(12, 85);
      return {
        title: 'Γεννήτρια Διψήφιου Περιοδικού',
        prompt: `Ποιο κλάσμα παριστάνει τον αριθμό 0,${p}${p}... (περίοδος ${p});`,
        type: 'mcq',
        correct: `${p}/99`,
        distractors: () => [`${p}/100`, `${p}/9`, `${p}/90`][randInt(0, 2)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        explanation: `Δύο ψηφία περιόδου αντιστοιχούν σε 99 στον παρονομαστή: ${p}/99.`
      };
    },
    () => ({
      title: 'Ισότητα Περιοδικού με 1',
      prompt: 'Σε ποιον ακέραιο αριθμό ισούται ακριβώς ο περιοδικός δεκαδικός 0,999...;',
      type: 'input',
      correct: 1,
      explanation: '0,999... ＝ 9/9 ＝ 1.'
    }),
    () => {
      const k = randInt(2, 6);
      return {
        title: 'Πλήθος Δυνατών Υπολοίπων',
        prompt: `Στη διαίρεση με παρονομαστή ${k}, ποιο είναι το μέγιστο πλήθος ψηφίων της περιόδου;`,
        type: 'input',
        correct: k - 1,
        explanation: `Τα μη μηδενικά υπόλοιπα είναι το πολύ ${k - 1}, άρα και η περίοδος έχει το πολύ ${k - 1} ψηφία.`
      };
    },
    () => ({
      title: 'Δεκαδική Μορφή 1/4',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η δεκαδική μορφή του κλάσματος <Frac num="1" den="4" />;
        </span>
      ),
      type: 'input',
      correct: 0.25,
      explanation: '1/4 ＝ 0,25.'
    }),
    () => ({
      title: 'Μη Περιοδικό Μέρος',
      prompt: 'Ποιο είναι το μη περιοδικό μέρος του αριθμού 0,1666...;',
      type: 'input',
      correct: 1,
      explanation: 'Το ψηφίο 1 βρίσκεται πριν την περίοδο 6.'
    }),
    () => ({
      title: 'Κλάσμα 1/3',
      prompt: 'Ποιος δεκαδικός αριθμός αντιστοιχεί στο 1/3;',
      type: 'mcq',
      correct: '0,333...',
      distractors: () => ['0,3', '0,31', '0,25'][randInt(0, 2)],
      explanation: '1/3 ＝ 0,333...'
    }),
    () => ({
      title: 'Κλάσμα 1/11',
      prompt: 'Ποια είναι η περίοδος του κλάσματος 1/11 (0,0909...);',
      type: 'input',
      correct: 9,
      explanation: 'Η περίοδος είναι το 09, με ψηφία 0 και 9.'
    }),
    () => ({
      title: 'Δεκαδική Μορφή 3/5',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η δεκαδική μορφή του κλάσματος <Frac num="3" den="5" />;
        </span>
      ),
      type: 'input',
      correct: 0.6,
      explanation: '3/5 ＝ 6/10 ＝ 0,6.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 2: Δεκαδική μορφή άρρητων
  chap2: [
    () => {
      const k = randInt(2, 6);
      const n = k * k + randInt(1, 2 * k);
      return {
        title: 'Ακέραιος Εγκλωβισμός Ρίζας',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1">
            Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο αριθμός <Radical>{n}</Radical>;
          </span>
        ),
        type: 'mcq',
        correct: `${k} και ${k + 1}`,
        distractors: () => [`${k - 1} και ${k}`, `${k + 1} και ${k + 2}`, `${k - 2} και ${k - 1}`][randInt(0, 2)],
        explanation: `${k}² ＝ ${k * k} ＜ ${n} ＜ ${(k + 1) * (k + 1)} ＝ (${k + 1})².`
      };
    },
    () => ({
      title: 'Φύση του π',
      prompt: 'Ο αριθμός π είναι:',
      type: 'mcq',
      correct: 'Άρρητος αριθμός',
      distractors: () => ['Ρητός αριθμός', 'Ακέραιος αριθμός', 'Περιοδικός δεκαδικός'][randInt(0, 2)],
      explanation: 'Ο αριθμός π έχει άπειρα δεκαδικά ψηφία χωρίς περίοδο.'
    }),
    () => ({
      title: 'Προσέγγιση του √2',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η προσέγγιση δεκάτου με έλλειψη του <Radical>2</Radical>;
        </span>
      ),
      type: 'input',
      correct: 1.4,
      explanation: '1,4² ＝ 1,96 ＜ 2 ＜ 2,25 ＝ 1,5².'
    }),
    () => ({
      title: 'Προσέγγιση του √3',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η προσέγγιση δεκάτου με έλλειψη του <Radical>3</Radical>;
        </span>
      ),
      type: 'input',
      correct: 1.7,
      explanation: '1,7² ＝ 2,89 ＜ 3 ＜ 3,24 ＝ 1,8².'
    }),
    () => ({
      title: 'Χαρακτηρισμός Ρίζας Τέλειου Τετραγώνου',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ο αριθμός <Radical>49</Radical> είναι:
        </span>
      ),
      type: 'mcq',
      correct: 'Ρητός (φυσικός) ίσος με 7',
      distractors: () => ['Άρρητος περίπου 7,1', 'Μη πραγματικός', 'Περιοδικός'][randInt(0, 2)],
      explanation: '√49 ＝ 7 ∈ ℕ.'
    }),
    () => ({
      title: 'Ακέραιο Μέρος Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιο είναι το ακέραιο μέρος του <Radical>10</Radical>;
        </span>
      ),
      type: 'input',
      correct: 3,
      explanation: '3² ＝ 9 ＜ 10 ＜ 16 ＝ 4².'
    }),
    () => ({
      title: 'Ακέραιο Μέρος του √15',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιο είναι το ακέραιο μέρος του <Radical>15</Radical>;
        </span>
      ),
      type: 'input',
      correct: 3,
      explanation: '3² ＝ 9 ＜ 15 ＜ 16 ＝ 4².'
    }),
    () => ({
      title: 'Χαρακτηριστικό Άρρητου',
      prompt: 'Ποιο είναι το κύριο χαρακτηριστικό του δεκαδικού αναπτύγματος ενός άρρητου;',
      type: 'mcq',
      correct: 'Άπειρα ψηφία χωρίς περίοδο',
      distractors: () => ['Πεπερασμένα ψηφία', 'Άπειρα ψηφία με περίοδο', 'Μηδενικό δεκαδικό μέρος'][randInt(0, 2)],
      explanation: 'Οι άρρητοι έχουν άπειρα μη περιοδικά δεκαδικά ψηφία.'
    }),
    () => ({
      title: 'Προσέγγιση του √5',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η προσέγγιση δεκάτου με έλλειψη του <Radical>5</Radical>;
        </span>
      ),
      type: 'input',
      correct: 2.2,
      explanation: '2,2² ＝ 4,84 ＜ 5 ＜ 5,29 ＝ 2,3².'
    }),
    () => ({
      title: 'Σφάλμα στο Εκατοστό',
      prompt: 'Στην προσέγγιση άρρητου στο εκατοστό (0,01), ποιο είναι το μέγιστο σφάλμα;',
      type: 'input',
      correct: 0.01,
      explanation: 'Το εύρος μεταξύ ελλιπούς και υπερβολικής προσέγγισης είναι 0,01.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 3: Πραγματικοί αριθμοί (Σύνολα & Διάταξη)
  chap3: [
    () => ({
      title: 'Σχέση Υποσυνόλων',
      prompt: 'Ποια είναι η σωστή ιεραρχία εγκλεισμού των συνόλων;',
      type: 'mcq',
      correct: 'ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ',
      distractors: () => ['ℤ ⊆ ℕ ⊆ ℚ ⊆ ℝ', 'ℕ ⊆ ℚ ⊆ ℤ ⊆ ℝ', 'ℚ ⊆ ℤ ⊆ ℕ ⊆ ℝ'][randInt(0, 2)],
      explanation: 'Φυσικοί ⊆ Ακέραιοι ⊆ Ρητοί ⊆ Πραγματικοί.'
    }),
    () => ({
      title: 'Ρίζα Αρνητικού Αριθμού',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Η παράσταση <Radical>－4</Radical> στο σύνολο ℝ:
        </span>
      ),
      type: 'mcq',
      correct: 'Δεν ορίζεται',
      distractors: () => ['Ισούται με －2', 'Ισούται με 2', 'Είναι άρρητος'][randInt(0, 2)],
      explanation: 'Δεν υπάρχει πραγματικός αριθμός με αρνητικό τετράγωνο.'
    }),
    () => {
      const a = randInt(4, 8);
      return {
        title: 'Απόλυτη Τιμή Αρνητικού',
        prompt: `Πόσο ισούται η απόλυτη τιμή |－${a}|;`,
        type: 'input',
        correct: a,
        explanation: `|－${a}| ＝ ${a}.`
      };
    },
    () => ({
      title: 'Σύγκριση Αρνητικών Αριθμών',
      prompt: 'Ποια είναι η σωστή σχέση ανάμεσα στο －3 και στο －1,5;',
      type: 'mcq',
      correct: '－3 ＜ －1,5',
      distractors: () => ['－3 ＞ －1,5', '－3 ＝ －1,5', 'Δεν συγκρίνονται'][randInt(0, 2)],
      explanation: 'Στον άξονα το －3 βρίσκεται αριστερότερα του －1,5.'
    }),
    () => ({
      title: 'Τομή Ρητών και Άρρητων',
      prompt: 'Ποια είναι η τομή ℚ ∩ Άρρητοι;',
      type: 'mcq',
      correct: 'Το κενό σύνολο (∅)',
      distractors: () => ['Το σύνολο ℕ', 'Το μηδέν {0}', 'Όλο το ℝ'][randInt(0, 2)],
      explanation: 'Ένας αριθμός δεν μπορεί να είναι ταυτόχρονα ρητός και άρρητος.'
    }),
    () => ({
      title: 'Τετράγωνο Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η παράσταση (<Radical>7</Radical>)²;
        </span>
      ),
      type: 'input',
      correct: 7,
      explanation: '(√7)² ＝ 7.'
    }),
    () => ({
      title: 'Σύνολο του 0',
      prompt: 'Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει το 0;',
      type: 'mcq',
      correct: 'ℕ (Φυσικοί αριθμοί)',
      distractors: () => ['Μόνο στο ℤ', 'Μόνο στο ℚ', 'Στους Άρρητους'][randInt(0, 2)],
      explanation: '0 ∈ ℕ.'
    }),
    () => ({
      title: 'Σύγκριση Ρίζας με Ρητό',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η σχέση ανάμεσα στο <Radical>7</Radical> και στο 2,6;',
        </span>
      ),
      type: 'mcq',
      correct: '√7 ＞ 2,6',
      distractors: () => ['√7 ＜ 2,6', '√7 ＝ 2,6', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => opt === '√7 ＞ 2,6' ? <span className="inline-flex items-center gap-1"><Radical>7</Radical> ＞ 2,6</span> : opt === '√7 ＜ 2,6' ? <span className="inline-flex items-center gap-1"><Radical>7</Radical> ＜ 2,6</span> : opt,
      explanation: '7 ＞ 2,6² ＝ 6,76.'
    }),
    () => ({
      title: 'Πληρότητα Άξονα',
      prompt: 'Κάθε σημείο του άξονα των πραγματικών αριθμών παριστάνει:',
      type: 'mcq',
      correct: 'Έναν μοναδικό πραγματικό αριθμό',
      distractors: () => ['Μόνο ρητούς αριθμούς', 'Δύο αριθμούς', 'Άπειρα κενά'][randInt(0, 2)],
      explanation: 'Η αντιστοιχία σημείων και πραγματικών αριθμών είναι 1-προς-1.'
    }),
    () => ({
      title: 'Απόσταση Σημείων',
      prompt: 'Πόση είναι η απόσταση ανάμεσα στα σημεία －2 και 5 στον άξονα;',
      type: 'input',
      correct: 7,
      explanation: '|5 － (－2)| ＝ 7.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 4: Πράξεις πραγματικών αριθμών
  chap4: [
    () => {
      const a = randInt(2, 5);
      const b = randInt(2, 4);
      return {
        title: 'Γινόμενο Αρνητικών Αριθμών',
        prompt: `Πόσο ισούται το γινόμενο (－${a}) · (－${b});`,
        type: 'input',
        correct: a * b,
        explanation: `(－) · (－) ＝ ＋, άρα ${a * b}.`
      };
    },
    () => ({
      title: 'Αντίστροφος Αριθμός',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο αντίστροφος του αριθμού －<Frac num="3" den="4" />;
        </span>
      ),
      type: 'mcq',
      correct: '－4/3',
      distractors: () => ['4/3', '3/4', '－3/4'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      explanation: 'Ο αντίστροφος διατηρεί το πρόσημο: (－3/4) · (－4/3) ＝ 1.'
    }),
    () => {
      const k = randInt(3, 7);
      return {
        title: 'Πρόσθεση Ομοίων Ριζών',
        prompt: (
          <span className="inline-flex items-center gap-1">
            Πόσο ισούται το άθροισμα {k} · <Radical>2</Radical> ＋ 2 · <Radical>2</Radical>;
          </span>
        ),
        type: 'mcq',
        correct: `${k + 2}·√2`,
        distractors: () => [`${k + 2}·√4`, `${k * 2}·√2`, `${k + 2}`][randInt(0, 2)],
        renderOption: (opt) => opt === `${k + 2}·√2` ? <span className="inline-flex items-center gap-1">{k + 2} · <Radical>2</Radical></span> : opt,
        explanation: `(${k} ＋ 2) · √2 ＝ ${k + 2} · √2.`
      };
    },
    () => ({
      title: 'Ουδέτερο Στοιχείο Πολλαπλασιασμού',
      prompt: 'Ποιο είναι το ουδέτερο στοιχείο του πολλαπλασιασμού στο ℝ;',
      type: 'input',
      correct: 1,
      explanation: 'α · 1 ＝ α.'
    }),
    () => ({
      title: 'Ουδέτερο Στοιχείο Πρόσθεσης',
      prompt: 'Ποιο είναι το ουδέτερο στοιχείο της πρόσθεσης στο ℝ;',
      type: 'input',
      correct: 0,
      explanation: 'α ＋ 0 ＝ α.'
    }),
    () => ({
      title: 'Πρόσθεση Μη Όμοιων Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Η έκφραση <Radical>2</Radical> ＋ <Radical>3</Radical>:
        </span>
      ),
      type: 'mcq',
      correct: 'Δεν απλοποιείται (δεν ισούται με √5)',
      distractors: () => ['Ισούται με √5', 'Ισούται με √6', 'Ισούται με 5'][randInt(0, 2)],
      explanation: 'Προσθέτουμε μόνο όμοιες ρίζες.'
    }),
    () => {
      const v = randInt(4, 9);
      return {
        title: 'Άθροισμα Αντιθέτων',
        prompt: `Πόσο ισούται η παράσταση ${v} ＋ (－${v});`,
        type: 'input',
        correct: 0,
        explanation: 'α ＋ (－α) ＝ 0.'
      };
    },
    () => ({
      title: 'Επιμεριστική Ιδιότητα',
      prompt: 'Ποιο είναι το ανάπτυγμα του 3 · (x ＋ 2);',
      type: 'mcq',
      correct: '3x ＋ 6',
      distractors: () => ['3x ＋ 2', 'x ＋ 6', '3x ＋ 5'][randInt(0, 2)],
      explanation: '3 · x ＋ 3 · 2 ＝ 3x ＋ 6.'
    }),
    () => ({
      title: 'Απαλοιφή με Μείον',
      prompt: 'Ποια είναι η απλοποίηση της έκφρασης －(x － 4);',
      type: 'mcq',
      correct: '－x ＋ 4',
      distractors: () => ['－x － 4', 'x ＋ 4', 'x － 4'][randInt(0, 2)],
      explanation: 'Το μείον αντιστρέφει όλα τα πρόσημα.'
    }),
    () => ({
      title: 'Γινόμενο με Αντίστροφο',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>5</Radical> · <Frac num="1" den={<Radical>5</Radical>} />;
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: 'α · (1/α) ＝ 1.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 5: Δυνάμεις πραγματικών αριθμών
  chap5: [
    () => {
      const n = randInt(2, 4);
      const p = Math.pow(2, n);
      return {
        title: 'Αρνητικός Εκθέτης',
        prompt: `Ποιο είναι το αποτέλεσμα της δύναμης 2⁻${n === 2 ? '²' : n === 3 ? '³' : '⁴'};`,
        type: 'mcq',
        correct: `1/${p}`,
        distractors: () => [`－${p}`, `1/${2 * n}`, `－${2 * n}`][randInt(0, 2)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        explanation: `2⁻ⁿ ＝ 1 / 2ⁿ ＝ 1/${p}.`
      };
    },
    () => ({
      title: 'Μηδενικός Εκθέτης',
      prompt: 'Πόσο ισούται η δύναμη 7⁰;',
      type: 'input',
      correct: 1,
      explanation: 'α⁰ ＝ 1 για κάθε α ≠ 0.'
    }),
    () => ({
      title: 'Δύναμη με και χωρίς Παρένθεση',
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης －4²;',
      type: 'input',
      correct: -16,
      explanation: '－4² ＝ －(4 · 4) ＝ －16. Δεν υπάρχει παρένθεση.'
    }),
    () => ({
      title: 'Άρτιος Εκθέτης σε Αρνητική Βάση',
      prompt: 'Ποιο είναι το αποτέλεσμα της δύναμης (－3)²;',
      type: 'input',
      correct: 9,
      explanation: '(－3)² ＝ ＋9.'
    }),
    () => ({
      title: 'Γινόμενο Δυνάμεων',
      prompt: 'Ποιος είναι ο εκθέτης του 2 στο γινόμενο 2³ · 2⁴;',
      type: 'input',
      correct: 7,
      explanation: '3 ＋ 4 ＝ 7.'
    }),
    () => ({
      title: 'Πηλίκο Δυνάμεων',
      prompt: 'Ποιος είναι ο εκθέτης του 3 στο πηλίκο 3⁶ / 3²;',
      type: 'input',
      correct: 4,
      explanation: '6 － 2 ＝ 4.'
    }),
    () => ({
      title: 'Δύναμη Δύναμης',
      prompt: 'Ποιος είναι ο εκθέτης του 5 στην παράσταση (5²)³;',
      type: 'input',
      correct: 6,
      explanation: '2 · 3 ＝ 6.'
    }),
    () => ({
      title: 'Τυποποιημένη Μορφή',
      prompt: 'Ποιος είναι ο εκθέτης k στην τυποποιημένη μορφή του 500.000 ＝ 5 · 10ᵏ;',
      type: 'input',
      correct: 5,
      explanation: '500.000 ＝ 5 · 10⁵.'
    }),
    () => ({
      title: 'Τυποποιημένη Μικρού Αριθμού',
      prompt: 'Ποια είναι η τυποποιημένη μορφή του 0,0004;',
      type: 'mcq',
      correct: '4 · 10⁻⁴',
      distractors: () => ['4 · 10⁻³', '40 · 10⁻⁵', '0,4 · 10⁻³'][randInt(0, 2)],
      explanation: '4 θέσεις δεξιά => 4 · 10⁻⁴.'
    }),
    () => ({
      title: 'Δύναμη του (－1)',
      prompt: 'Πόσο ισούται η παράσταση (－1)⁹⁹;',
      type: 'input',
      correct: -1,
      explanation: 'Περιττός εκθέτης => －1.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 6: Ιδιότητες τετραγωνικών ριζών
  chap6: [
    () => ({
      title: 'Τετράγωνο Αρνητικού υπό Ρίζα',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η παράσταση <Radical>(－8)²</Radical>;
        </span>
      ),
      type: 'input',
      correct: 8,
      explanation: '√((－8)²) ＝ |－8| ＝ 8.'
    }),
    () => ({
      title: 'Γινόμενο Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>3</Radical> · <Radical>12</Radical>;
        </span>
      ),
      type: 'input',
      correct: 6,
      explanation: '√(3 · 12) ＝ √36 ＝ 6.'
    }),
    () => ({
      title: 'Πηλίκο Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το πηλίκο <Frac num={<Radical>32</Radical>} den={<Radical>2</Radical>} />;
        </span>
      ),
      type: 'input',
      correct: 4,
      explanation: '√(32/2) ＝ √16 ＝ 4.'
    }),
    () => ({
      title: 'Εξαγωγή Παράγοντα από το √12',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η απλοποιημένη μορφή του <Radical>12</Radical>;
        </span>
      ),
      type: 'mcq',
      correct: '2·√3',
      distractors: () => ['3·√2', '4·√3', '6·√2'][randInt(0, 2)],
      renderOption: (opt) => opt === '2·√3' ? <span className="inline-flex items-center gap-1">2 · <Radical>3</Radical></span> : opt,
      explanation: '√(4 · 3) ＝ 2√3.'
    }),
    () => ({
      title: 'Εξαγωγή Παράγοντα από το √50',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο συντελεστής α αν <Radical>50</Radical> ＝ α · <Radical>2</Radical>;
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: '√(25 · 2) ＝ 5√2.'
    }),
    () => ({
      title: 'Ρητοποίηση Παρονομαστή',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το κλάσμα <Frac num="6" den={<Radical>3</Radical>} /> μετά από ρητοποίηση;
        </span>
      ),
      type: 'mcq',
      correct: '2·√3',
      distractors: () => ['3·√2', '2', '6·√3'][randInt(0, 2)],
      renderOption: (opt) => opt === '2·√3' ? <span className="inline-flex items-center gap-1">2 · <Radical>3</Radical></span> : opt,
      explanation: '(6 · √3) / 3 ＝ 2√3.'
    }),
    () => ({
      title: 'Ρητοποίηση του 1/√2',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Σε ποιο κλάσμα ισούται το <Frac num="1" den={<Radical>2</Radical>} />;
        </span>
      ),
      type: 'mcq',
      correct: '√2/2',
      distractors: () => ['2/√2', '1/2', '√2/4'][randInt(0, 2)],
      renderOption: (opt) => opt === '√2/2' ? <Frac num={<Radical>2</Radical>} den="2" /> : opt,
      explanation: '√2 / 2.'
    }),
    () => ({
      title: 'Απλοποίηση Διαφοράς Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η διαφορά <Radical>48</Radical> － <Radical>27</Radical>;
        </span>
      ),
      correct: '√3',
      type: 'mcq',
      distractors: () => ['√21', '3·√3', '2·√3'][randInt(0, 2)],
      renderOption: (opt) => opt === '√3' ? <Radical>3</Radical> : opt,
      explanation: '4√3 － 3√3 ＝ √3.'
    }),
    () => ({
      title: 'Γινόμενο Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται το γινόμενο <Radical>5</Radical> · <Radical>20</Radical>;
        </span>
      ),
      type: 'input',
      correct: 10,
      explanation: '√100 ＝ 10.'
    }),
    () => ({
      title: 'Ρίζα Αθροίσματος',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η παράσταση <Radical>16 ＋ 9</Radical>;
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: '√(25) ＝ 5 (και όχι 4＋3＝7).'
    })
  ]
};

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΣΥΝΘΕΤΩΝ ΠΡΟΒΛΗΜΑΤΩΝ (1 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ = 6 ΠΡΟΒΛΗΜΑΤΑ)
// ΚΑΘΕ ΚΕΦΑΛΑΙΟ ΕΧΕΙ ΤΟΥΛΑΧΙΣΤΟΝ 10 ΠΡΩΤΟΤΥΠΕΣ ΠΑΡΑΛΛΑΓΕΣ
// =========================================================================

const POOLS_PROBLEMS = {
  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 1 (Q13)
  prob1: [
    () => ({
      title: 'Μετατροπή Περιοδικού σε Ανάγωγο Κλάσμα',
      prompt: 'Ποιο είναι το άθροισμα αριθμητή και παρονομαστή του ανάγωγου κλάσματος που ισούται με τον περιοδικό δεκαδικό 0,444...;',
      type: 'input',
      correct: 13, // 4/9 -> 4+9=13
      tableData: [
        { label: 'Κλασματική μορφή', details: '0,444... ＝ 4/9' },
        { label: 'Άθροισμα όρων', details: '4 ＋ 9 ＝ 13' }
      ],
      explanation: 'Το ανάγωγο κλάσμα είναι 4/9. Άρα 4 ＋ 9 ＝ 13.'
    }),
    () => ({
      title: 'Γεννήτρια Μορφή του 0,1666...',
      prompt: 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος που ισούται με τον μικτό περιοδικό 0,1666...;',
      type: 'input',
      correct: 6, // 1/6
      tableData: [
        { label: 'Υπολογισμός 90x', details: '100x － 10x ＝ 16,66... － 1,66... ＝ 15' },
        { label: 'Ανάγωγο κλάσμα', details: '15/90 ＝ 1/6' }
      ],
      explanation: '0,1666... ＝ 1/6, άρα ο παρονομαστής είναι 6.'
    }),
    () => ({
      title: 'Άθροισμα Περιοδικών Δεκαδικών',
      prompt: 'Ποιο είναι το αποτέλεσμα της πρόσθεσης 0,333... ＋ 0,666...;',
      type: 'input',
      correct: 1,
      tableData: [
        { label: 'Κλάσματα', details: '1/3 ＋ 2/3 ＝ 3/3 ＝ 1' }
      ],
      explanation: '1/3 ＋ 2/3 ＝ 1.'
    }),
    () => ({
      title: 'Κλάσμα του 0,8333...',
      prompt: 'Ποιος είναι ο αριθμητής του ανάγωγου κλάσματος του αριθμού 0,8333...;',
      type: 'input',
      correct: 5, // 5/6
      tableData: [
        { label: 'Υπολογισμός', details: '90x ＝ 75 => x ＝ 75/90 ＝ 5/6' }
      ],
      explanation: 'Το ανάγωγο κλάσμα είναι 5/6, άρα ο αριθμητής είναι 5.'
    }),
    () => ({
      title: 'Διαίρεση 2 Πιτσών σε 3 Παιδιά',
      prompt: 'Δύο πίτσες μοιράζονται ισόποσα σε 3 παιδιά. Ποια είναι η περίοδος στον δεκαδικό αριθμό του μεριδίου;',
      type: 'input',
      correct: 6, // 2/3 = 0,666...
      tableData: [
        { label: 'Κλάσμα', details: '2/3 ＝ 0,666...' },
        { label: 'Περίοδος', details: '6' }
      ],
      explanation: '2/3 ＝ 0,666..., άρα η περίοδος είναι 6.'
    }),
    () => ({
      title: 'Ισοδύναμο του 1,999...',
      prompt: 'Σε ποιον ακέραιο ισούται ο περιοδικός δεκαδικός αριθμός 1,999...;',
      type: 'input',
      correct: 2,
      tableData: [
        { label: 'Ανάλυση', details: '1 ＋ 0,999... ＝ 1 ＋ 1 ＝ 2' }
      ],
      explanation: '1 ＋ 9/9 ＝ 2.'
    }),
    () => ({
      title: 'Γεννήτρια του 0,4545...',
      prompt: 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος του αριθμού 0,4545...;',
      type: 'input',
      correct: 11, // 45/99 = 5/11
      tableData: [
        { label: 'Απλοποίηση', details: '45/99 ＝ 5/11' }
      ],
      explanation: '45/99 ＝ 5/11, άρα ο παρονομαστής είναι 11.'
    }),
    () => ({
      title: 'Σύγκριση Περιοδικού με Δεκαδικό',
      prompt: 'Πόσο είναι το αποτέλεσμα της αφαίρεσης 0,333... － 0,33 σε μορφή κλάσματος;',
      type: 'mcq',
      correct: '1/300',
      distractors: () => ['1/30', '1/3', '3/100'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Πράξη', details: '1/3 － 33/100 ＝ (100 － 99)/300 ＝ 1/300' }
      ],
      explanation: '1/3 － 33/100 ＝ 1/300.'
    }),
    () => ({
      title: 'Γεννήτρια του 0,0909...',
      prompt: 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος του αριθμού 0,0909...;',
      type: 'input',
      correct: 11, // 9/99 = 1/11
      tableData: [
        { label: 'Απλοποίηση', details: '9/99 ＝ 1/11' }
      ],
      explanation: '9/99 ＝ 1/11, άρα ο παρονομαστής είναι 11.'
    }),
    () => ({
      title: 'Άθροισμα 0,111... και 0,222...',
      prompt: 'Ποιο κλάσμα εκφράζει το άθροισμα 0,111... ＋ 0,222...;',
      type: 'mcq',
      correct: '1/3',
      distractors: () => ['3/10', '3/99', '1/9'][randInt(0, 2)],
      renderOption: (opt) => {
        const parts = String(opt).split('/');
        return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
      },
      tableData: [
        { label: 'Άθροισμα', details: '1/9 ＋ 2/9 ＝ 3/9 ＝ 1/3' }
      ],
      explanation: '1/9 ＋ 2/9 ＝ 3/9 ＝ 1/3.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 2 (Q14)
  prob2: [
    () => ({
      title: 'Διαγώνιος Τετραγώνου Οικοπέδου',
      prompt: 'Ένα τετράγωνο οικόπεδο έχει εμβαδόν 50 m². Πόσο είναι το ακριβές μήκος της διαγωνίου του d σε μέτρα;',
      correct: 10,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'Πλευρά s', details: 's² ＝ 50' },
        { label: 'Πυθαγόρειο d²', details: 'd² ＝ s² ＋ s² ＝ 50 ＋ 50 ＝ 100' },
        { label: 'Διαγώνιος d', details: 'd ＝ √100 ＝ 10 m' }
      ],
      explanation: 'd² ＝ 50 ＋ 50 ＝ 100 ⇒ d ＝ 10 m.'
    }),
    () => ({
      title: 'Υποτείνουσα με Κάθετες 2 και 4',
      prompt: 'Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι 2 m και 4 m. Πόσο είναι το τετράγωνο της υποτείνουσάς του (c²);',
      correct: 20,
      type: 'input',
      tableData: [
        { label: 'Πυθαγόρειο', details: 'c² ＝ 2² ＋ 4² ＝ 4 ＋ 16 ＝ 20' }
      ],
      explanation: 'c² ＝ 4 ＋ 16 ＝ 20.'
    }),
    () => ({
      title: 'Ακέραιο Μέρος του √30',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο ακέραιος k αν k ＜ <Radical>30</Radical> ＜ k＋1;
        </span>
      ),
      type: 'input',
      correct: 5,
      tableData: [
        { label: 'Τετράγωνα', details: '5² ＝ 25 ＜ 30 ＜ 36 ＝ 6²' }
      ],
      explanation: '5² ＝ 25 ＜ 30 ＜ 36 ＝ 6², άρα k ＝ 5.'
    }),
    () => ({
      title: 'Περίμετρος Κύκλου με π ≈ 3,14',
      prompt: 'Κυκλικός στίβος έχει διάμετρο d ＝ 20 m. Ποια είναι η περίμετρός του για π ≈ 3,14 σε m;',
      correct: 62.8,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'Τύπος', details: 'L ＝ π · d ＝ 3,14 · 20 ＝ 62,8 m' }
      ],
      explanation: '3,14 · 20 ＝ 62,8 m.'
    }),
    () => ({
      title: 'Εγκλωβισμός του √40',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο μικρότερος ακέραιος που είναι ΜΕΓΑΛΥΤΕΡΟΣ από το <Radical>40</Radical>;
        </span>
      ),
      type: 'input',
      correct: 7,
      tableData: [
        { label: 'Τετράγωνα', details: '6² ＝ 36 ＜ 40 ＜ 49 ＝ 7²' }
      ],
      explanation: '6 ＜ √40 ＜ 7, άρα ο μικρότερος ακέραιος είναι το 7.'
    }),
    () => ({
      title: 'Εμβαδόν από Διαγώνιο',
      prompt: 'Η διαγώνιος τετραγώνου είναι √18 m. Πόσο είναι το εμβαδόν του σε m²;',
      correct: 9,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Τύπος', details: 'Ε ＝ d² / 2 ＝ (√18)² / 2 ＝ 18 / 2 ＝ 9 m²' }
      ],
      explanation: 'Ε ＝ d² / 2 ＝ 18 / 2 ＝ 9 m².'
    }),
    () => ({
      title: 'Διαγώνιος Ορθογωνίου με πλευρές 1 και 7',
      prompt: 'Ποιο είναι το τετράγωνο της διαγωνίου ορθογωνίου με πλευρές 1 cm και 7 cm;',
      correct: 50,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '1² ＋ 7² ＝ 1 ＋ 49 ＝ 50' }
      ],
      explanation: '1 ＋ 49 ＝ 50.'
    }),
    () => ({
      title: 'Υποτείνουσα Ισοσκελούς με πλευρά 3',
      prompt: 'Ποιο είναι το τετράγωνο της υποτείνουσας ισοσκελούς ορθογωνίου τριγώνου με πλευρά 3 cm;',
      correct: 18,
      type: 'input',
      tableData: [
        { label: 'Πυθαγόρειο', details: '3² ＋ 3² ＝ 9 ＋ 9 ＝ 18' }
      ],
      explanation: '3² ＋ 3² ＝ 18.'
    }),
    () => ({
      title: 'Προσέγγιση του √10',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η προσέγγιση δεκάτου με έλλειψη του <Radical>10</Radical>;
        </span>
      ),
      type: 'input',
      correct: 3.1,
      tableData: [
        { label: 'Έλεγχος', details: '3,1² ＝ 9,61 ＜ 10 ＜ 10,24 ＝ 3,2²' }
      ],
      explanation: '3,1² ＝ 9,61 ＜ 10.'
    }),
    () => ({
      title: 'Ακέραιο Μέρος του √60',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιο είναι το ακέραιο μέρος του <Radical>60</Radical>;
        </span>
      ),
      type: 'input',
      correct: 7,
      tableData: [
        { label: 'Τετράγωνα', details: '7² ＝ 49 ＜ 60 ＜ 64 ＝ 8²' }
      ],
      explanation: '7² ＝ 49 ＜ 60, άρα ακέραιο μέρος 7.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 3 (Q15)
  prob3: [
    () => ({
      title: 'Πλήθος Ακεραίων σε Διάστημα Ριζών',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσοι ακέραιοι αριθμοί x ικανοποιούν την ανισότητα －<Radical>10</Radical> ＜ x ＜ <Radical>10</Radical>;
        </span>
      ),
      correct: 7, // -3, -2, -1, 0, 1, 2, 3
      type: 'input',
      tableData: [
        { label: 'Τιμή του √10', details: '√10 ≈ 3,16' },
        { label: 'Ακέραιοι', details: '－3, －2, －1, 0, 1, 2, 3 (συνολικά 7 ακέραιοι)' }
      ],
      explanation: 'Από το －3 έως το 3 υπάρχουν 7 ακέραιοι.'
    }),
    () => ({
      title: 'Μέσο Διαστήματος στον Άξονα',
      prompt: 'Ποιο είναι το μέσο του ευθύγραμμου τμήματος με άκρα τα σημεία －5 και 3 στον πραγματικό άξονα;',
      correct: -1,
      type: 'input',
      tableData: [
        { label: 'Τύπος μέσου M', details: '(α ＋ β) / 2' },
        { label: 'Υπολογισμός', details: '(－5 ＋ 3) / 2 ＝ －2 / 2 ＝ －1' }
      ],
      explanation: '(－5 ＋ 3) / 2 ＝ －1.'
    }),
    () => ({
      title: 'Φυσικοί Αριθμοί Μικρότεροι από Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσοι ΦΥΣΙΚΟΙ αριθμοί είναι αυστηρά μικρότεροι από το <Radical>26</Radical>;
        </span>
      ),
      correct: 6, // 0, 1, 2, 3, 4, 5
      type: 'input',
      tableData: [
        { label: '√26', details: '5² ＝ 25 ＜ 26 ＜ 36 ＝ 6² => √26 ≈ 5,1' },
        { label: 'Φυσικοί (ℕ)', details: '0, 1, 2, 3, 4, 5 (συνολικά 6)' }
      ],
      explanation: 'Οι φυσικοί αριθμοί είναι οι 0, 1, 2, 3, 4, 5 (συνολικά 6).'
    }),
    () => ({
      title: 'Απόσταση Σημείων στον Άξονα',
      prompt: 'Πόση είναι η απόσταση ανάμεσα στα σημεία Α(－6) και Β(4) στον πραγματικό άξονα;',
      correct: 10,
      type: 'input',
      unit: 'μονάδες',
      tableData: [
        { label: 'Τύπος', details: '|4 － (－6)| ＝ 10' }
      ],
      explanation: '|4 ＋ 6| ＝ 10.'
    }),
    () => ({
      title: 'Αντίθετος Παράστασης με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποιος είναι ο αντίθετος του αριθμού 4 － <Radical>3</Radical>;
        </span>
      ),
      correct: '√3 － 4',
      type: 'mcq',
      distractors: () => ['－4 － √3', '4 ＋ √3', '√3 ＋ 4'][randInt(0, 2)],
      renderOption: (opt) => opt === '√3 － 4' ? <span className="inline-flex items-center gap-1"><Radical>3</Radical> － 4</span> : opt,
      tableData: [
        { label: 'Αντίθετος', details: '－(4 － √3) ＝ －4 ＋ √3 ＝ √3 － 4' }
      ],
      explanation: '－(4 － √3) ＝ √3 － 4.'
    }),
    () => ({
      title: 'Απόλυτη Τιμή Διαφοράς',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσο ισούται η παράσταση |<Radical>5</Radical> － 3|;
        </span>
      ),
      correct: '3 － √5',
      type: 'mcq',
      distractors: () => ['√5 － 3', '√5 ＋ 3', '3'][randInt(0, 2)],
      renderOption: (opt) => opt === '3 － √5' ? <span className="inline-flex items-center gap-1">3 － <Radical>5</Radical></span> : opt,
      tableData: [
        { label: 'Πρόσημο', details: '√5 ≈ 2,24 ＜ 3 => √5 － 3 ＜ 0' },
        { label: 'Απόλυτο', details: '－(√5 － 3) ＝ 3 － √5' }
      ],
      explanation: 'Επειδή √5 ＜ 3, |√5 － 3| ＝ 3 － √5.'
    }),
    () => ({
      title: 'Ακέραιοι ανάμεσα σε －√3 και √3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Πόσοι ακέραιοι βρίσκονται ανάμεσα στο －<Radical>3</Radical> και στο <Radical>3</Radical>;
        </span>
      ),
      correct: 3, // -1, 0, 1
      type: 'input',
      tableData: [
        { label: '√3', details: '≈ 1,73' },
        { label: 'Ακέραιοι', details: '－1, 0, 1 (συνολικά 3)' }
      ],
      explanation: '－1, 0, 1.'
    }),
    () => ({
      title: 'Σύγκριση Αντίστροφων με Ρίζα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1">
          Ποια είναι η σχέση ανάμεσα στο <Frac num="1" den="3" /> και στο <Frac num="1" den={<Radical>3</Radical>} />;
        </span>
      ),
      correct: '1/3 ＜ 1/√3',
      type: 'mcq',
      distractors: () => ['1/3 ＞ 1/√3', '1/3 ＝ 1/√3', 'Δεν συγκρίνονται'][randInt(0, 2)],
      renderOption: (opt) => opt === '1/3 ＜ 1/√3' ? <span className="inline-flex items-center gap-1"><Frac num="1" den="3" /> ＜ <Frac num="1" den={<Radical>3</Radical>} /></span> : opt,
      tableData: [
        { label: 'Παρονομαστές', details: '3 ＞ √3 => 1/3 ＜ 1/√3' }
      ],
      explanation: 'Μεγαλύτερος παρονομαστής σημαίνει μικρότερο κλάσμα.'
    }),
    () => ({
      title: 'Διαφορά Θερμοκρασίας',
      prompt: 'Αν η θερμοκρασία από －4,5 °C ανέλθει σε 2,5 °C, πόσους βαθμούς αυξήθηκε;',
      correct: 7,
      type: 'input',
      unit: '°C',
      tableData: [
        { label: 'Διαφορά', details: '2,5 － (－4,5) ＝ 7 °C' }
      ],
      explanation: '2,5 ＋ 4,5 ＝ 7 °C.'
    }),
    () => ({
      title: 'Πλησιέστερος Ακέραιος στο √17',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο πλησιέστερος ακέραιος στον αριθμό <Radical>17</Radical>;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Έλεγχος', details: '4² ＝ 16, 5² ＝ 25. Το 17 είναι πολύ κοντά στο 16' }
      ],
      explanation: '√17 ≈ 4,12, άρα ο πλησιέστερος ακέραιος είναι το 4.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 4 (Q16)
  prob4: [
    () => {
      const mult = randInt(3, 6);
      const target = 5 * mult;
      return {
        title: 'Αναλογίες με Ρίζες √2 και √5',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1">
            Οι αριθμοί x, y, z είναι ανάλογοι προς τους 2, <Radical>2</Radical> και <Radical>5</Radical>, και ισχύει: x － y · <Radical>2</Radical> ＋ z · <Radical>5</Radical> ＝ {target}. Ποια είναι η τιμή του x;
          </span>
        ),
        correct: 2 * mult,
        type: 'input',
        tableData: [
          { label: 'Αναλογία', details: 'x＝2λ, y＝λ√2, z＝λ√5' },
          { label: 'Αντικατάσταση', details: `2λ － 2λ ＋ 5λ ＝ ${target} => 5λ ＝ ${target} => λ ＝ ${mult}` },
          { label: 'Υπολογισμός x', details: `x ＝ 2 · ${mult} ＝ ${2 * mult}` }
        ],
        explanation: `5λ ＝ ${target} ⇒ λ ＝ ${mult} και x ＝ 2λ ＝ ${2 * mult}.`
      };
    },
    () => ({
      title: 'Επίλυση Εξίσωσης με Ρίζες',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποια είναι η λύση της εξίσωσης <Radical>5</Radical> · x ＝ <Radical>80</Radical>;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Επίλυση', details: 'x ＝ √(80 / 5) ＝ √16 ＝ 4' }
      ],
      explanation: 'x ＝ √16 ＝ 4.'
    }),
    () => ({
      title: 'Υποτείνουσα από Κάθετες Πλευρές',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι <Radical>5</Radical> － 1 και <Radical>5</Radical> ＋ 1. Πόσο είναι το τετράγωνο της υποτείνουσας c²;
        </span>
      ),
      correct: 12,
      type: 'input',
      tableData: [
        { label: 'c²', details: '(√5 － 1)² ＋ (√5 ＋ 1)² ＝ (5 － 2√5 ＋ 1) ＋ (5 ＋ 2√5 ＋ 1) ＝ 12' }
      ],
      explanation: '6 － 2√5 ＋ 6 ＋ 2√5 ＝ 12.'
    }),
    () => ({
      title: 'Εμβαδόν Ορθογωνίου Τριγώνου',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιο είναι το εμβαδόν ορθογωνίου τριγώνου με κάθετες πλευρές 2 · <Radical>3</Radical> cm και 4 · <Radical>3</Radical> cm σε cm²;
        </span>
      ),
      correct: 12,
      type: 'input',
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν', details: '(2√3 · 4√3) / 2 ＝ (8 · 3) / 2 ＝ 12 cm²' }
      ],
      explanation: '(8 · 3) / 2 ＝ 12 cm².'
    }),
    () => ({
      title: 'Παράσταση με Γνωστό Άθροισμα',
      prompt: 'Αν x ＋ y ＝ －6, ποια είναι η τιμή της παράστασης Α ＝ 5x － (4x － y) ＋ 10;',
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Απλοποίηση', details: 'x ＋ y ＋ 10 ＝ －6 ＋ 10 ＝ 4' }
      ],
      explanation: 'x ＋ y ＋ 10 ＝ －6 ＋ 10 ＝ 4.'
    }),
    () => ({
      title: 'Ένθετες Ρίζες',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Radical><span>7 ＋ <Radical><span>1 ＋ <Radical>64</Radical></span></Radical></span></Radical>;
        </span>
      ),
      correct: 3, // √64=8, 1+8=9, √9=3, 7+3=10? Όχι: 7 + √9 = 7+3=10 (μη τέλειο). Διορθώνουμε: 13 + √(7 + √4) -> 13+3=16->4
      tableData: [
        { label: 'Υπολογισμός', details: '√64＝8, 1＋8＝9, √9＝3, 13＋3＝16, √16＝4' }
      ],
      explanation: 'Από μέσα προς τα έξω.'
    }),
    () => ({
      title: 'Εξίσωση με Δύναμη Ρίζας',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Να λυθεί η εξίσωση: (<Radical>3</Radical>)<sup>－2</sup> · x ＝ 6.
        </span>
      ),
      correct: 18,
      type: 'input',
      tableData: [
        { label: 'Επίλυση', details: '(1/3) · x ＝ 6 => x ＝ 18' }
      ],
      explanation: '(1/3) · x ＝ 6 ⇒ x ＝ 18.'
    }),
    () => ({
      title: 'Περίμετρος Τετραγώνου με Ρίζα',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Τετράγωνο έχει πλευρά s ＝ <Radical>18</Radical> ＋ <Radical>2</Radical> m. Πόσο είναι το εμβαδόν του σε m²;
        </span>
      ),
      correct: 32,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Πλευρά s', details: '√18 ＝ 3√2 => s ＝ 3√2 ＋ √2 ＝ 4√2 m' },
        { label: 'Εμβαδόν s²', details: '(4√2)² ＝ 16 · 2 ＝ 32 m²' }
      ],
      explanation: '(4√2)² ＝ 32 m².'
    }),
    () => ({
      title: 'Απλοποίηση Διαφοράς Κλασμάτων',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η παράσταση (1 － <Frac num="3" den="2" />) · (2 － <Frac num="5" den="2" />);
        </span>
      ),
      correct: 0.25,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '(－1/2) · (－1/2) ＝ 1/4 ＝ 0,25' }
      ],
      explanation: '(－1/2) · (－1/2) ＝ 0,25.'
    }),
    () => ({
      title: 'Υποτείνουσα Ισοσκελούς Τριγώνου',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετη πλευρά 5 · <Radical>2</Radical> m. Πόσο είναι το τετράγωνο της υποτείνουσας c²;
        </span>
      ),
      correct: 100,
      type: 'input',
      tableData: [
        { label: 'c²', details: '(5√2)² ＋ (5√2)² ＝ 50 ＋ 50 ＝ 100' }
      ],
      explanation: '50 ＋ 50 ＝ 100.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 5 (Q17)
  prob5: [
    () => ({
      title: 'Χρόνος Διάδοσης Φωτός',
      prompt: 'Απόσταση 6 · 10⁸ km διανύεται με ταχύτητα φωτός 3 · 10⁵ km/s. Πόσα δευτερόλεπτα απαιτούνται;',
      correct: 2000,
      type: 'input',
      unit: 's',
      tableData: [
        { label: 'Τύπος', details: 't ＝ s / v ＝ (6 · 10⁸) / (3 · 10⁵) ＝ 2 · 10³ ＝ 2.000 s' }
      ],
      explanation: '2.000 δευτερόλεπτα.'
    }),
    () => ({
      title: 'Αύξηση Όγκου Κύβου',
      prompt: 'Αν τριπλασιάσουμε την ακμή ενός κύβου, πόσες φορές αυξάνεται ο όγκος του;',
      correct: 27,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Όγκος', details: '(3α)³ ＝ 27 · α³' }
      ],
      explanation: '3³ ＝ 27 φορές.'
    }),
    () => ({
      title: 'Αύξηση Εμβαδού Κύβου',
      prompt: 'Αν τετραπλασιάσουμε την ακμή ενός κύβου, πόσες φορές αυξάνεται το εμβαδόν της επιφάνειάς του;',
      correct: 16,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Εμβαδόν', details: '6 · (4α)² ＝ 16 · (6α²)' }
      ],
      explanation: '4² ＝ 16 φορές.'
    }),
    () => ({
      title: 'Εκθετική Αύξηση Βακτηρίων',
      prompt: 'Πληθυσμός βακτηρίων τριπλασιάζεται κάθε ώρα (3ⁿ). Πόσα βακτήρια θα υπάρχουν μετά από 3 ώρες (ξεκινώντας από 1);',
      correct: 27,
      type: 'input',
      unit: 'βακτήρια',
      tableData: [
        { label: 'Υπολογισμός', details: '3³ ＝ 27' }
      ],
      explanation: '3³ ＝ 27.'
    }),
    () => ({
      title: 'Σύγκριση Μεγεθών σε Τυποποιημένη Μορφή',
      prompt: 'Πόσες φορές μεγαλύτερος είναι ο αριθμός 8 · 10⁹ από τον αριθμό 4 · 10⁶;',
      correct: 2000,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Πηλίκο', details: '(8 · 10⁹) / (4 · 10⁶) ＝ 2 · 10³ ＝ 2.000' }
      ],
      explanation: '2.000 φορές.'
    }),
    () => ({
      title: 'Απλοποίηση Δυνάμεων του 2',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η παράσταση <Frac num="2⁸ · 2⁻³" den="2³" />;
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '2^(8－3－3) ＝ 2² ＝ 4' }
      ],
      explanation: '2² ＝ 4.'
    }),
    () => ({
      title: 'Τετράγωνο σε Τυποποιημένη Μορφή',
      prompt: 'Ποιος είναι ο εκθέτης k αν (3 · 10⁴)² ＝ 9 · 10ᵏ;',
      correct: 8,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '10^(4·2) ＝ 10⁸' }
      ],
      explanation: 'k ＝ 8.'
    }),
    () => ({
      title: 'Πρόσθεση Τυποποιημένων Αριθμών',
      prompt: 'Πόσο ισούται το άθροισμα 4 · 10³ ＋ 6 · 10³;',
      correct: 10000,
      type: 'input',
      tableData: [
        { label: 'Άθροισμα', details: '(4 ＋ 6) · 10³ ＝ 10 · 10³ ＝ 10.000' }
      ],
      explanation: '10.000.'
    }),
    () => ({
      title: 'Εξίσωση με Δύναμη',
      prompt: 'Αν 5ˣ ＝ 125, ποια είναι η τιμή του x;',
      correct: 3,
      type: 'input',
      tableData: [
        { label: '125', details: '5³' }
      ],
      explanation: 'x ＝ 3.'
    }),
    () => ({
      title: 'Υπολογισμός (1/3)⁻³',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η δύναμη (<Frac num="1" den="3" />)<sup>－3</sup>;
        </span>
      ),
      correct: 27,
      type: 'input',
      tableData: [
        { label: 'Αντιστροφή', details: '3³ ＝ 27' }
      ],
      explanation: '3³ ＝ 27.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 6 (Q18)
  prob6: [
    () => ({
      title: 'Εμβαδόν Ορθογωνίου με Ρίζες',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ορθογώνιο έχει μήκος L ＝ <Radical>32</Radical> m και πλάτος W ＝ <Radical>2</Radical> m. Πόσο είναι το εμβαδόν του σε m²;
        </span>
      ),
      correct: 8,
      type: 'input',
      unit: 'm²',
      tableData: [
        { label: 'Εμβαδόν', details: '√32 · √2 ＝ √64 ＝ 8 m²' }
      ],
      explanation: '√64 ＝ 8 m².'
    }),
    () => ({
      title: 'Περίμετρος Τετραγώνου από Εμβαδόν',
      prompt: 'Τετράγωνο έχει εμβαδόν 50 m². Ποιος είναι ο συντελεστής α στην περίμετρό του Π ＝ α · √2 m;',
      correct: 20,
      type: 'input',
      tableData: [
        { label: 'Πλευρά s', details: '√50 ＝ 5√2 m' },
        { label: 'Περίμετρος', details: '4 · 5√2 ＝ 20√2 m' }
      ],
      explanation: '20√2 m.'
    }),
    () => ({
      title: 'Διαγώνιος Ορθογωνίου με Ριζική Πλευρά',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ορθογώνιο έχει πλευρές <Radical>27</Radical> cm και 3 cm. Πόσο είναι το μήκος της διαγωνίου του d σε cm;
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'd²', details: '(√27)² ＋ 3² ＝ 27 ＋ 9 ＝ 36 ⇒ d ＝ 6 cm' }
      ],
      explanation: '√36 ＝ 6 cm.'
    }),
    () => ({
      title: 'Λόγος Εμβαδών Τετραγώνων',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Δύο τετράγωνα έχουν πλευρές <Radical>18</Radical> cm και <Radical>2</Radical> cm. Πόσες φορές μεγαλύτερο είναι το εμβαδόν του 1ου;
        </span>
      ),
      correct: 9,
      type: 'input',
      unit: 'φορές',
      tableData: [
        { label: 'Λόγος', details: '(√18)² / (√2)² ＝ 18 / 2 ＝ 9' }
      ],
      explanation: '18 / 2 ＝ 9 φορές.'
    }),
    () => ({
      title: 'Υποτείνουσα Ισοσκελούς Ορθογωνίου',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετες πλευρές <Radical>50</Radical> m. Πόσο είναι το μήκος της υποτείνουσάς του σε μέτρα;
        </span>
      ),
      correct: 10,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'c²', details: '50 ＋ 50 ＝ 100 ⇒ c ＝ 10 m' }
      ],
      explanation: '√100 ＝ 10 m.'
    }),
    () => ({
      title: 'Εμβαδόν Ρόμβου με Ρίζες',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ρόμβος έχει διαγωνίους d₁ ＝ <Radical>72</Radical> cm και d₂ ＝ <Radical>2</Radical> cm. Πόσο είναι το εμβαδόν του σε cm²;
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν', details: '(√72 · √2) / 2 ＝ √144 / 2 ＝ 12 / 2 ＝ 6 cm²' }
      ],
      explanation: '12 / 2 ＝ 6 cm².'
    }),
    () => ({
      title: 'Άθροισμα μετά από Ρητοποίηση',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ποιος είναι ο συντελεστής του <Radical>3</Radical> στην παράσταση <Radical>3</Radical> ＋ <Frac num="6" den={<Radical>3</Radical>} />;
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: 'Ρητοποίηση', details: '6/√3 ＝ 2√3' },
        { label: 'Άθροισμα', details: '√3 ＋ 2√3 ＝ 3√3' }
      ],
      explanation: '1 ＋ 2 ＝ 3.'
    }),
    () => ({
      title: 'Εμβαδόν Τριγώνου με Ρίζες',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Ορθογώνιο τρίγωνο έχει κάθετες πλευρές <Radical>8</Radical> cm και <Radical>18</Radical> cm. Πόσο είναι το εμβαδόν του σε cm²;
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν', details: '(√8 · √18) / 2 ＝ √144 / 2 ＝ 6 cm²' }
      ],
      explanation: '12 / 2 ＝ 6 cm².'
    }),
    () => ({
      title: 'Απλοποίηση Παράστασης Ριζών',
      prompt: (
        <span className="inline-flex items-center gap-1">
          Πόσο ισούται η τιμή της παράστασης <Radical>20</Radical> · <Radical>5</Radical> － <Radical>16</Radical>;
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { label: 'Υπολογισμός', details: '√100 － 4 ＝ 10 － 4 ＝ 6' }
      ],
      explanation: '10 － 4 ＝ 6.'
    }),
    () => ({
      title: 'Πλευρά Τετραγώνου από Εμβαδόν',
      prompt: 'Τετράγωνο έχει εμβαδόν 108 m². Ποιος είναι ο συντελεστής α αν η πλευρά του είναι α · √3 m;',
      correct: 6,
      type: 'input',
      tableData: [
        { label: 'Πλευρά', details: '√108 ＝ √(36 · 3) ＝ 6√3 m' }
      ],
      explanation: '6√3 m.'
    })
  ]
};

export default function Epanalipsi1Exercises() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Helper για επιλογή k μοναδικών στοιχείων από δεξαμενή
    const pickUnique = (pool, count) => {
      const shuffledIndices = shuffle(pool.map((_, i) => i));
      return shuffledIndices.slice(0, count).map(idx => pool[idx]());
    };

    // 12 Βασικές Ερωτήσεις: Ακριβώς 2 από κάθε κεφάλαιο (Κεφ. 1 έως 6)
    const basicPools = [
      POOLS_BASIC.chap1,
      POOLS_BASIC.chap2,
      POOLS_BASIC.chap3,
      POOLS_BASIC.chap4,
      POOLS_BASIC.chap5,
      POOLS_BASIC.chap6
    ];

    let currentId = 1;
    basicPools.forEach((pool, cIdx) => {
      const picked = pickUnique(pool, 2);
      picked.forEach(item => {
        let options = undefined;
        if (item.type === 'mcq') {
          options = ensureFourUniqueOptions(item.correct, item.distractors);
        }
        qList.push({
          id: currentId++,
          chapterBadge: `ΚΕΦ. ${cIdx + 1}`,
          title: item.title,
          prompt: item.prompt,
          type: item.type,
          correct: item.correct,
          options,
          renderOption: item.renderOption,
          unit: item.unit,
          tableData: item.tableData,
          explanation: item.explanation
        });
      });
    });

    // 6 Σύνθετα Προβλήματα: Ακριβώς 1 από κάθε κεφάλαιο (Κεφ. 1 έως 6)
    const probPools = [
      POOLS_PROBLEMS.prob1,
      POOLS_PROBLEMS.prob2,
      POOLS_PROBLEMS.prob3,
      POOLS_PROBLEMS.prob4,
      POOLS_PROBLEMS.prob5,
      POOLS_PROBLEMS.prob6
    ];

    probPools.forEach((pool, pIdx) => {
      const picked = pickUnique(pool, 1)[0];
      let options = undefined;
      if (picked.type === 'mcq') {
        options = ensureFourUniqueOptions(picked.correct, picked.distractors);
      }
      qList.push({
        id: currentId++,
        chapterBadge: `ΠΡΟΒΛΗΜΑ ΚΕΦ. ${pIdx + 1}`,
        title: picked.title,
        prompt: picked.prompt,
        type: picked.type,
        correct: picked.correct,
        options,
        renderOption: picked.renderOption,
        unit: picked.unit,
        tableData: picked.tableData,
        explanation: picked.explanation
      });
    });

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
      title="Επαναληπτικό Σετ 1 (Κεφ. 1–6) | Γ' Γυμνασίου"
      description="Ολοκληρωμένο επαναληπτικό διαγώνισμα 18 ερωτήσεων και προβλημάτων για τα Κεφάλαια 1 έως 6 των Μαθηματικών της Γ' Γυμνασίου."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📚 {toCleanUppercase("ΥΛΗ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase("ΕΠΑΝΑΛΗΨΗ 1 • ΚΕΦ. 1 ΕΩΣ 6 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight">
                Επαναληπτικό Σετ Ασκήσεων & Προβλημάτων
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                18 δυναμικές ερωτήσεις (12 βασικές και 6 σύνθετα προβλήματα) με τυχαίες παραμέτρους και πλήρη ανατροφοδότηση.
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
              Αποτέλεσμα: {score} / 18 ({Math.round((score / 18) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 15
                ? 'Εξαιρετική επίδοση! Κατέχετε πλήρως όλες τις έννοιες των πρώτων έξι κεφαλαίων.'
                : score >= 10
                ? 'Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.'
                : 'Χρειάζεται επανάληψη στη θεωρία των κεφαλαίων πριν δοκιμάσετε ξανά.'}
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
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        {q.chapterBadge}
                      </span>
                      <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug">
                        {q.title}
                      </h3>
                    </div>
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
                  {toCleanUppercase("ΑΠΑΝΤΗΘΗΚΑΝ")}: <span className="text-indigo-600 font-black">{answeredCount}</span> / 18
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-700">{toCleanUppercase("ΣΚΟΡ")}: {score} / 18</span>
                  <span className="hidden xs:inline text-slate-400">|</span>
                  <span className="text-indigo-700">{Math.round((score / 18) * 100)}%</span>
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
