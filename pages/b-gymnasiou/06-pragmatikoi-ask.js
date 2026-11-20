import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .replace(/Β'/g, '___BETA_PRIME___')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/___BETA_PRIME___/g, "Β'");
}

// --- Custom Μαθηματικά Components ---
const Angle = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 18 7"
      className="w-3.5 h-1.5 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6 L 9 1.2 L 16.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Arc = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 24 8"
      className="w-5 h-2 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6.5 Q 12 0.5 22.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Frac = ({ num, den, className = '' }) => (
  <span
    className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-tight ${className}`}
  >
    <span className="px-1 pb-0.5 border-b border-current font-semibold">
      {num}
    </span>
    <span className="px-1 pt-0.5 font-semibold">{den}</span>
  </span>
);

const Radical = ({ children, index = null }) => (
  <span className="inline-flex items-stretch align-middle mx-0.5 select-none">
    {index && (
      <sup className="text-[0.65em] font-bold -mr-1.5 mt-0.5">{index}</sup>
    )}
    <svg
      viewBox="0 0 14 24"
      className="w-3 h-5 text-current shrink-0 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 1 14 L 4.5 14 L 7.5 22.5 L 13 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="border-t-2 border-current px-1 pt-0.5 leading-none inline-flex items-center">
      {children}
    </span>
  </span>
);

// --- Βοηθητικές Συναρτήσεις Παραγωγής Ασκήσεων ---
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function sanitizeInput(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/^\+/, '');
}

function ensureFourUniqueOptions(correctOpt, distractorPool) {
  const seen = new Set([correctOpt.key]);
  const result = [correctOpt];
  for (const d of shuffle(distractorPool)) {
    if (!seen.has(d.key)) {
      seen.add(d.key);
      result.push(d);
    }
    if (result.length === 4) break;
  }
  let fallbackIdx = 1;
  while (result.length < 4) {
    const fk = `fallback_${fallbackIdx++}`;
    if (!seen.has(fk)) {
      seen.add(fk);
      result.push({ key: fk, labelEl: String(fallbackIdx * 7), labelEn: String(fallbackIdx * 7) });
    }
  }
  return shuffle(result);
}

// --- Γεννήτρια 12 Δυναμικών Ερωτήσεων Κεφαλαίου 6 ---
function generateQuestions() {
  const questions = [];

  // Q1 (TF): Ρητός vs Άρρητος αριθμός
  {
    const mode = randInt(1, 3);
    if (mode === 1) {
      const sq = pickRandom([4, 9, 16, 25, 36, 49, 64, 81]);
      const r = Math.sqrt(sq);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: (
          <span>
            Ο αριθμός <Radical>{sq}</Radical> είναι άρρητος αριθμός.
          </span>
        ),
        promptEn: (
          <span>
            The number <Radical>{sq}</Radical> is an irrational number.
          </span>
        ),
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: (
          <span>
            Το {sq} είναι τετράγωνος αριθμός, άρα <Radical>{sq}</Radical> = {r} ∈ ℕ ⊂ ℚ (είναι ρητός αριθμός).
          </span>
        ),
        explanationEn: (
          <span>
            {sq} is a square number, so <Radical>{sq}</Radical> = {r} ∈ ℕ ⊂ ℚ (it is a rational number).
          </span>
        ),
      });
    } else if (mode === 2) {
      const irr = pickRandom([2, 3, 5, 6, 7, 10, 11]);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: (
          <span>
            Ο αριθμός <Radical>{irr}</Radical> είναι πραγματικός και άρρητος αριθμός.
          </span>
        ),
        promptEn: (
          <span>
            The number <Radical>{irr}</Radical> is a real and irrational number.
          </span>
        ),
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span>
            Το {irr} δεν είναι τετράγωνος αριθμός, άρα ο <Radical>{irr}</Radical> έχει άπειρα μη περιοδικά δεκαδικά ψηφία (είναι άρρητος, άρα και πραγματικός: 𝕀 ⊂ ℝ).
          </span>
        ),
        explanationEn: (
          <span>
            {irr} is not a square number, so <Radical>{irr}</Radical> has infinite non-repeating decimals (irrational, hence real: 𝕀 ⊂ ℝ).
          </span>
        ),
      });
    } else {
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: 'Κάθε περιοδικός δεκαδικός αριθμός, όπως ο 0,(3), είναι ρητός αριθμός.',
        promptEn: 'Every repeating decimal number, such as 0.(3), is a rational number.',
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span>
            Κάθε περιοδικός δεκαδικός γράφεται ως κλάσμα (π.χ. 0,(3) = <Frac num="1" den="3" />), άρα ανήκει στους ρητούς (ℚ).
          </span>
        ),
        explanationEn: (
          <span>
            Every repeating decimal can be written as a fraction (e.g. 0.(3) = <Frac num="1" den="3" />), so it belongs to ℚ.
          </span>
        ),
      });
    }
  }

  // Q2 (MCQ): Αναγνώριση άρρητου ανάμεσα σε 4 επιλογές
  {
    const irrChoice = pickRandom([3, 5, 7, 11, 13]);
    const sq1 = pickRandom([4, 9, 16]);
    const sq2 = pickRandom([25, 36, 49]);
    const correctOpt = {
      key: `sqrt_${irrChoice}`,
      labelEl: <Radical>{irrChoice}</Radical>,
      labelEn: <Radical>{irrChoice}</Radical>,
    };
    const distractors = [
      { key: `sqrt_${sq1}`, labelEl: <Radical>{sq1}</Radical>, labelEn: <Radical>{sq1}</Radical> },
      { key: `sqrt_${sq2}`, labelEl: <Radical>{sq2}</Radical>, labelEn: <Radical>{sq2}</Radical> },
      { key: 'frac', labelEl: <Frac num="-7" den="4" />, labelEn: <Frac num="-7" den="4" /> },
      { key: 'dec', labelEl: '2,35', labelEn: '2.35' },
    ];
    questions.push({
      id: 2,
      type: 'mcq',
      promptEl: 'Ποιος από τους παρακάτω αριθμούς είναι άρρητος;',
      promptEn: 'Which of the following numbers is irrational?',
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Radical>{irrChoice}</Radical>,
      correctTextEn: <Radical>{irrChoice}</Radical>,
      explanationEl: (
        <span>
          Οι <Radical>{sq1}</Radical> = {Math.sqrt(sq1)}, <Radical>{sq2}</Radical> = {Math.sqrt(sq2)}, <Frac num="-7" den="4" /> και 2,35 είναι ρητοί, ενώ ο <Radical>{irrChoice}</Radical> είναι άρρητος.
        </span>
      ),
      explanationEn: (
        <span>
          <Radical>{sq1}</Radical> = {Math.sqrt(sq1)}, <Radical>{sq2}</Radical> = {Math.sqrt(sq2)}, <Frac num="-7" den="4" /> and 2.35 are rational, while <Radical>{irrChoice}</Radical> is irrational.
        </span>
      ),
    });
  }

  // Q3 (MCQ): Τοποθέτηση άρρητου στην ευθεία (Πυθαγόρειο Θεώρημα / ακτίνα ρ)
  {
    const configs = [
      {
        a: 1,
        b: 1,
        res: 2,
        wrong1: 1,
        wrong2: 3,
        wrong3: 4,
      },
      {
        a: 2,
        b: 1,
        res: 5,
        wrong1: 3,
        wrong2: 4,
        wrong3: 6,
      },
      {
        a: 2,
        b: 2,
        res: 8,
        wrong1: 4,
        wrong2: 6,
        wrong3: 10,
      },
      {
        a: 3,
        b: 1,
        res: 10,
        wrong1: 4,
        wrong2: 8,
        wrong3: 9,
      },
    ];
    const c = pickRandom(configs);
    const correctOpt = {
      key: `r_${c.res}`,
      labelEl: <Radical>{c.res}</Radical>,
      labelEn: <Radical>{c.res}</Radical>,
    };
    const distractors = [
      { key: `r_${c.wrong1}`, labelEl: <Radical>{c.wrong1}</Radical>, labelEn: <Radical>{c.wrong1}</Radical> },
      { key: `r_${c.wrong2}`, labelEl: <Radical>{c.wrong2}</Radical>, labelEn: <Radical>{c.wrong2}</Radical> },
      { key: `r_${c.wrong3}`, labelEl: <Radical>{c.wrong3}</Radical>, labelEn: <Radical>{c.wrong3}</Radical> },
      { key: `num_${c.a + c.b}`, labelEl: String(c.a + c.b), labelEn: String(c.a + c.b) },
    ];
    questions.push({
      id: 3,
      type: 'mcq',
      promptEl: `Για να τοποθετήσουμε έναν άρρητο αριθμό στην ευθεία ℝ, κατασκευάζουμε ορθογώνιο τρίγωνο με κάθετες πλευρές ${c.a} και ${c.b}. Ποιος αριθμός αντιστοιχεί στην υποτείνουσα (ακτίνα διαβήτη ρ);`,
      promptEn: `To locate an irrational number on the real axis ℝ, we draw a right triangle with legs ${c.a} and ${c.b}. Which number corresponds to the hypotenuse (compass radius ρ)?`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Radical>{c.res}</Radical>,
      correctTextEn: <Radical>{c.res}</Radical>,
      explanationEl: (
        <span>
          Από το Πυθαγόρειο Θεώρημα: ρ² = {c.a}² + {c.b}² = {c.a * c.a} + {c.b * c.b} = {c.res} ⇒ ρ = <Radical>{c.res}</Radical>.
        </span>
      ),
      explanationEn: (
        <span>
          By the Pythagorean Theorem: ρ² = {c.a}² + {c.b}² = {c.a * c.a} + {c.b * c.b} = {c.res} ⇒ ρ = <Radical>{c.res}</Radical>.
        </span>
      ),
      renderFeedbackDiagram: () => (
        <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-2.5">
          <svg viewBox="0 0 300 140" className="w-full h-auto max-w-full block">
            <line x1="20" y1="115" x2="280" y2="115" stroke="#334155" strokeWidth="2" />
            <polygon points="50,115 160,115 160,30" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
            <polyline points="148,115 148,103 160,103" fill="none" stroke="#059669" strokeWidth="1.5" />
            <text x="100" y="132" fontSize="12" fontWeight="700" fill="#065f46">{c.a}</text>
            <text x="166" y="78" fontSize="12" fontWeight="700" fill="#065f46">{c.b}</text>
            <text x="72" y="65" fontSize="13" fontWeight="800" fill="#4f46e5">ρ = √{c.res}</text>
            <path d="M 160 30 A 139 139 0 0 1 189 115" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="189" cy="115" r="4.5" fill="#dc2626" />
            <text x="182" y="133" fontSize="12" fontWeight="800" fill="#dc2626">√{c.res}</text>
          </svg>
        </div>
      ),
    });
  }

  // Q4 (Input): Διαδοχικοί ακέραιοι που περιέχουν το √N (ζητάμε τον μικρότερο ακέραιο)
  {
    const n = pickRandom([3, 5, 7, 11, 14, 19, 29, 40]);
    const low = Math.floor(Math.sqrt(n));
    const high = low + 1;
    questions.push({
      id: 4,
      type: 'input',
      unitEl: '(ακέραιος)',
      unitEn: '(integer)',
      promptEl: (
        <span>
          Αν ισχύει κ &lt; <Radical>{n}</Radical> &lt; κ + 1, όπου κ ∈ ℕ, ποια είναι η τιμή του κ;
        </span>
      ),
      promptEn: (
        <span>
          If k &lt; <Radical>{n}</Radical> &lt; k + 1, where k ∈ ℕ, what is the value of k?
        </span>
      ),
      correct: String(low),
      correctTextEl: String(low),
      correctTextEn: String(low),
      explanationEl: (
        <span>
          Ανάμεσα στους τετράγωνους αριθμούς: {low * low} &lt; {n} &lt; {high * high} ⇒ <Radical>{low * low}</Radical> &lt; <Radical>{n}</Radical> &lt; <Radical>{high * high}</Radical> ⇒ {low} &lt; <Radical>{n}</Radical> &lt; {high}. Άρα κ = {low}.
        </span>
      ),
      explanationEn: (
        <span>
          Between square numbers: {low * low} &lt; {n} &lt; {high * high} ⇒ {low} &lt; <Radical>{n}</Radical> &lt; {high}. Thus k = {low}.
        </span>
      ),
    });
  }

  // Q5 (Input): Τετράγωνοι αριθμοί - Άθροισμα/Διαφορά ριζών
  {
    const a = pickRandom([4, 9, 16, 25]);
    const b = pickRandom([36, 49, 64, 81]);
    const ans = Math.sqrt(a) + Math.sqrt(b);
    questions.push({
      id: 5,
      type: 'input',
      promptEl: (
        <span>
          Υπολογίστε την τιμή της παράστασης: <Radical>{a}</Radical> + <Radical>{b}</Radical>
        </span>
      ),
      promptEn: (
        <span>
          Calculate the value of the expression: <Radical>{a}</Radical> + <Radical>{b}</Radical>
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span>
          Επειδή {a} = {Math.sqrt(a)}² και {b} = {Math.sqrt(b)}², έχουμε: <Radical>{a}</Radical> + <Radical>{b}</Radical> = {Math.sqrt(a)} + {Math.sqrt(b)} = {ans}.
        </span>
      ),
      explanationEn: (
        <span>
          Since {a} = {Math.sqrt(a)}² and {b} = {Math.sqrt(b)}², we get: <Radical>{a}</Radical> + <Radical>{b}</Radical> = {Math.sqrt(a)} + {Math.sqrt(b)} = {ans}.
        </span>
      ),
    });
  }

  // Q6 (TF): Πρόσημο και μηδενικός εκθέτης
  {
    const mode = randInt(1, 2);
    if (mode === 1) {
      const base = pickRandom([3, 5, 7, 11]);
      questions.push({
        id: 6,
        type: 'tf',
        promptEl: (
          <span>
            Ισχύει η ισότητα: (-{base})<sup>0</sup> = -1.
          </span>
        ),
        promptEn: (
          <span>
            The equality (-{base})<sup>0</sup> = -1 holds true.
          </span>
        ),
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: (
          <span>
            Κάθε μη μηδενικός πραγματικός αριθμός (με παρένθεση) υψωμένος στη μηδενική δύναμη ισούται με +1: (-{base})<sup>0</sup> = 1. (Αντίθετα, -{base}<sup>0</sup> = -1).
          </span>
        ),
        explanationEn: (
          <span>
            Any non-zero real number (in parentheses) raised to the 0th power equals +1: (-{base})<sup>0</sup> = 1.
          </span>
        ),
      });
    } else {
      const exp = pickRandom([-2, -4, -6]);
      questions.push({
        id: 6,
        type: 'tf',
        promptEl: (
          <span>
            Η δύναμη (-2)<sup>{exp}</sup> είναι θετικός αριθμός.
          </span>
        ),
        promptEn: (
          <span>
            The power (-2)<sup>{exp}</sup> is a positive number.
          </span>
        ),
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span>
            Ο εκθέτης {exp} είναι άρτιος ακέραιος, άρα (-2)<sup>{exp}</sup> = <Frac num="1" den={<span>(-2)<sup>{Math.abs(exp)}</sup></span>} /> = <Frac num="1" den={String(Math.pow(2, Math.abs(exp)))} /> &gt; 0.
          </span>
        ),
        explanationEn: (
          <span>
            The exponent {exp} is an even integer, so (-2)<sup>{exp}</sup> = <Frac num="1" den={<span>(-2)<sup>{Math.abs(exp)}</sup></span>} /> = <Frac num="1" den={String(Math.pow(2, Math.abs(exp)))} /> &gt; 0.
          </span>
        ),
      });
    }
  }

  // Q7 (MCQ): Δύναμη με αρνητικό εκθέτη α^(-ν)
  {
    const base = pickRandom([2, 3, 4, 5]);
    const exp = base === 2 ? pickRandom([2, 3, 4]) : 2;
    const denVal = Math.pow(base, exp);
    const correctOpt = {
      key: `1/${denVal}`,
      labelEl: <Frac num="1" den={String(denVal)} />,
      labelEn: <Frac num="1" den={String(denVal)} />,
    };
    const distractors = [
      { key: `-${denVal}`, labelEl: `-${denVal}`, labelEn: `-${denVal}` },
      { key: `-1/${denVal}`, labelEl: <span>-<Frac num="1" den={String(denVal)} /></span>, labelEn: <span>-<Frac num="1" den={String(denVal)} /></span> },
      { key: `${denVal}`, labelEl: String(denVal), labelEn: String(denVal) },
      { key: `1/${base * exp}`, labelEl: <Frac num="1" den={String(base * exp)} />, labelEn: <Frac num="1" den={String(base * exp)} /> },
    ];
    questions.push({
      id: 7,
      type: 'mcq',
      promptEl: (
        <span>
          Ποια είναι η τιμή της δύναμης {base}<sup>-{exp}</sup>;
        </span>
      ),
      promptEn: (
        <span>
          What is the value of the power {base}<sup>-{exp}</sup>?
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Frac num="1" den={String(denVal)} />,
      correctTextEn: <Frac num="1" den={String(denVal)} />,
      explanationEl: (
        <span>
          Από τον ορισμό του αρνητικού εκθέτη: {base}<sup>-{exp}</sup> = <Frac num="1" den={<span>{base}<sup>{exp}</sup></span>} /> = <Frac num="1" den={String(denVal)} />.
        </span>
      ),
      explanationEn: (
        <span>
          By the negative exponent definition: {base}<sup>-{exp}</sup> = <Frac num="1" den={<span>{base}<sup>{exp}</sup></span>} /> = <Frac num="1" den={String(denVal)} />.
        </span>
      ),
    });
  }

  // Q8 (Input): Αρνητικός εκθέτης κλάσματος (1/β)^(-ν)
  {
    const den = pickRandom([2, 3, 4, 5]);
    const exp = den === 2 ? pickRandom([2, 3, 4]) : 2;
    const ans = Math.pow(den, exp);
    questions.push({
      id: 8,
      type: 'input',
      promptEl: (
        <span className="inline-flex items-center">
          Υπολογίστε την τιμή της δύναμης (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup>:
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-center">
          Calculate the value of (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup>:
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span>
          Αντιστρέφουμε το κλάσμα: (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup> = (<Frac num={String(den)} den="1" />)<sup>{exp}</sup> = {den}<sup>{exp}</sup> = {ans}.
        </span>
      ),
      explanationEn: (
        <span>
          Invert the fraction: (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup> = {den}<sup>{exp}</sup> = {ans}.
        </span>
      ),
    });
  }

  // Q9 (MCQ): Γινόμενο δυνάμεων με ίδια βάση α^μ · α^ν
  {
    const base = pickRandom(['α', 'x', '2', '5']);
    const m = pickRandom([4, 5, 6]);
    const n = pickRandom([-2, -3, -7]);
    const sum = m + n;
    const correctOpt = {
      key: `${base}^${sum}`,
      labelEl: <span>{base}<sup>{sum}</sup></span>,
      labelEn: <span>{base}<sup>{sum}</sup></span>,
    };
    const distractors = [
      { key: `${base}^${m * n}`, labelEl: <span>{base}<sup>{m * n}</sup></span>, labelEn: <span>{base}<sup>{m * n}</sup></span> },
      { key: `${base}^${m - n}`, labelEl: <span>{base}<sup>{m - n}</sup></span>, labelEn: <span>{base}<sup>{m - n}</sup></span> },
      { key: `${base}^${-sum}`, labelEl: <span>{base}<sup>{-sum}</sup></span>, labelEn: <span>{base}<sup>{-sum}</sup></span> },
      { key: `2${base}^${sum}`, labelEl: <span>2{base}<sup>{sum}</sup></span>, labelEn: <span>2{base}<sup>{sum}</sup></span> },
    ];
    questions.push({
      id: 9,
      type: 'mcq',
      promptEl: (
        <span>
          Σε μία δύναμη της βάσης {base} (με {base} ≠ 0), το γινόμενο {base}<sup>{m}</sup> · {base}<sup>{n}</sup> ισούται με:
        </span>
      ),
      promptEn: (
        <span>
          Written as a single power of {base} ({base} ≠ 0), the product {base}<sup>{m}</sup> · {base}<sup>{n}</sup> equals:
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <span>{base}<sup>{sum}</sup></span>,
      correctTextEn: <span>{base}<sup>{sum}</sup></span>,
      explanationEl: (
        <span>
          Προσθέτουμε τους εκθέτες: {base}<sup>{m}</sup> · {base}<sup>{n}</sup> = {base}<sup>{m} + ({n})</sup> = {base}<sup>{sum}</sup>.
        </span>
      ),
      explanationEn: (
        <span>
          Add the exponents: {base}<sup>{m}</sup> · {base}<sup>{n}</sup> = {base}<sup>{m} + ({n})</sup> = {base}<sup>{sum}</sup>.
        </span>
      ),
    });
  }

  // Q10 (MCQ): Πηλίκο δυνάμεων α^μ / α^ν με αρνητικό εκθέτη στον παρονομαστή
  {
    const base = pickRandom(['α', '3', '7']);
    const m = pickRandom([2, 3, -1]);
    const n = pickRandom([-2, -3, -4]);
    const diff = m - n;
    const correctOpt = {
      key: `${base}^${diff}`,
      labelEl: <span>{base}<sup>{diff}</sup></span>,
      labelEn: <span>{base}<sup>{diff}</sup></span>,
    };
    const distractors = [
      { key: `${base}^${m + n}`, labelEl: <span>{base}<sup>{m + n}</sup></span>, labelEn: <span>{base}<sup>{m + n}</sup></span> },
      { key: `${base}^${n - m}`, labelEl: <span>{base}<sup>{n - m}</sup></span>, labelEn: <span>{base}<sup>{n - m}</sup></span> },
      { key: `${base}^${m * n}`, labelEl: <span>{base}<sup>{m * n}</sup></span>, labelEn: <span>{base}<sup>{m * n}</sup></span> },
      { key: `1`, labelEl: '1', labelEn: '1' },
    ];
    questions.push({
      id: 10,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex items-center">
          Το πηλίκο <Frac num={<span>{base}<sup>{m}</sup></span>} den={<span>{base}<sup>{n}</sup></span>} /> (όπου {base} ≠ 0) ισούται με:
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-center">
          The quotient <Frac num={<span>{base}<sup>{m}</sup></span>} den={<span>{base}<sup>{n}</sup></span>} /> (where {base} ≠ 0) equals:
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <span>{base}<sup>{diff}</sup></span>,
      correctTextEn: <span>{base}<sup>{diff}</sup></span>,
      explanationEl: (
        <span>
          Αφαιρούμε τους εκθέτες (προσέχοντας το πρόσημο): <Frac num={<span>{base}<sup>{m}</sup></span>} den={<span>{base}<sup>{n}</sup></span>} /> = {base}<sup>{m} - ({n})</sup> = {base}<sup>{m} + {Math.abs(n)}</sup> = {base}<sup>{diff}</sup>.
        </span>
      ),
      explanationEn: (
        <span>
          Subtract the exponents carefully: <Frac num={<span>{base}<sup>{m}</sup></span>} den={<span>{base}<sup>{n}</sup></span>} /> = {base}<sup>{m} - ({n})</sup> = {base}<sup>{diff}</sup>.
        </span>
      ),
    });
  }

  // Q11 (Input): Δύναμη άρρητου (√k)^2ν
  {
    const k = pickRandom([2, 3, 5, 7]);
    const exp = pickRandom([2, 4]);
    const ans = Math.pow(k, exp / 2);
    questions.push({
      id: 11,
      type: 'input',
      promptEl: (
        <span>
          Υπολογίστε την τιμή της δύναμης (<Radical>{k}</Radical>)<sup>{exp}</sup>:
        </span>
      ),
      promptEn: (
        <span>
          Calculate the value of (<Radical>{k}</Radical>)<sup>{exp}</sup>:
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span>
          Γράφουμε το {exp} = 2 · {exp / 2}: (<Radical>{k}</Radical>)<sup>{exp}</sup> = ((<Radical>{k}</Radical>)<sup>2</sup>)<sup>{exp / 2}</sup> = {k}<sup>{exp / 2}</sup> = {ans}.
        </span>
      ),
      explanationEn: (
        <span>
          Write {exp} = 2 · {exp / 2}: (<Radical>{k}</Radical>)<sup>{exp}</sup> = ((<Radical>{k}</Radical>)<sup>2</sup>)<sup>{exp / 2}</sup> = {k}<sup>{exp / 2}</sup> = {ans}.
        </span>
      ),
    });
  }

  // Q12 (Input - Συνδυαστικό πρόβλημα δυνάμεων με tableData)
  {
    const b = pickRandom([2, 3]);
    const p1 = pickRandom([-2, -3]);
    const p2 = pickRandom([2, 3]);
    const p3 = p1 + p2 * 2 - 1; // ώστε το πηλίκο να δίνει b^1 = b
    const fracExp = pickRandom([-2, -3]);
    const term2 = Math.pow(2, Math.abs(fracExp));
    const totalAns = b + term2;

    questions.push({
      id: 12,
      type: 'input',
      promptEl: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Υπολογίστε την τιμή της παράστασης:</span>
          <span className="inline-flex items-center font-bold">
            Π = <Frac num={<span>{b}<sup>{p1}</sup> · ({b}<sup>{p2}</sup>)<sup>2</sup></span>} den={<span>{b}<sup>{p3}</sup></span>} /> + (<Frac num="1" den="2" />)<sup>{fracExp}</sup>
          </span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Calculate the value of the expression:</span>
          <span className="inline-flex items-center font-bold">
            Π = <Frac num={<span>{b}<sup>{p1}</sup> · ({b}<sup>{p2}</sup>)<sup>2</sup></span>} den={<span>{b}<sup>{p3}</sup></span>} /> + (<Frac num="1" den="2" />)<sup>{fracExp}</sup>
          </span>
        </span>
      ),
      correct: String(totalAns),
      correctTextEl: String(totalAns),
      correctTextEn: String(totalAns),
      explanationEl: (
        <span>
          Εφαρμόζουμε διαδοχικά τις ιδιότητες των δυνάμεων και βρίσκουμε Π = {b} + {term2} = {totalAns}.
        </span>
      ),
      explanationEn: (
        <span>
          Applying the properties of exponents step-by-step yields Π = {b} + {term2} = {totalAns}.
        </span>
      ),
      tableData: [
        {
          stepEl: '1. Δύναμη δύναμης',
          stepEn: '1. Power of a power',
          calc: (
            <span>
              ({b}<sup>{p2}</sup>)<sup>2</sup> = {b}<sup>{p2 * 2}</sup>
            </span>
          ),
        },
        {
          stepEl: '2. Απλοποίηση κλάσματος',
          stepEn: '2. Simplify fraction',
          calc: (
            <span>
              <Frac num={<span>{b}<sup>{p1}</sup> · {b}<sup>{p2 * 2}</sup></span>} den={<span>{b}<sup>{p3}</sup></span>} /> = {b}<sup>{p1 + p2 * 2} - ({p3})</sup> = {b}<sup>1</sup> = {b}
            </span>
          ),
        },
        {
          stepEl: '3. Αρνητικός εκθέτης & άθροισμα',
          stepEn: '3. Negative exponent & sum',
          calc: (
            <span>
              (<Frac num="1" den="2" />)<sup>{fracExp}</sup> = 2<sup>{Math.abs(fracExp)}</sup> = {term2} ⇒ Π = {b} + {term2} = {totalAns}
            </span>
          ),
        },
      ],
    });
  }

  return questions;
}

export default function PragmatikoiExercisesPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const initExercises = useCallback(() => {
    setQuestions(generateQuestions());
    setAnswers({});
    setSubmitted(false);
  }, []);

  useEffect(() => {
    initExercises();
  }, [initExercises]);

  const handleSelect = (qId, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleReset = () => {
    initExercises();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (userVal === undefined || userVal === '') return false;
    if (q.type === 'input') {
      return sanitizeInput(userVal) === sanitizeInput(q.correct);
    }
    return userVal === q.correct;
  };

  const answeredCount = questions.filter((q) => {
    const v = answers[q.id];
    return v !== undefined && String(v).trim() !== '';
  }).length;

  const score = submitted ? questions.filter(isQuestionCorrect).length : 0;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const pageTitle = isEn
    ? 'Chapter 6 Exercises: Real Numbers & Powers | 8th Grade'
    : "Ασκήσεις Κεφαλαίου 6: Πραγματικοί Αριθμοί & Δυνάμεις | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/06-pragmatikoi"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">←</span>
      <span>{toCleanUppercase(isEn ? 'BACK TO THEORY' : 'ΕΠΙΣΤΡΟΦΗ ΣΤΗ ΘΕΩΡΙΑ')}</span>
    </Link>
  );

  return (
    <Layout title={pageTitle} actionButton={actionButton}>
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-indigo-900 to-blue-800 text-white p-6 sm:p-8 shadow-lg mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-extrabold tracking-wider mb-3">
              <span>
                {toCleanUppercase(
                  isEn ? 'CHAPTER 6 • 8TH GRADE' : "ΚΕΦΑΛΑΙΟ 6 • Β' ΓΥΜΝΑΣΙΟΥ"
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {isEn
                ? 'Exercises: Real Numbers, Square Roots & Powers'
                : 'Ασκήσεις: Πραγματικοί Αριθμοί, Τετράγωνοι & Δυνάμεις'}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow transition-colors"
            >
              {toCleanUppercase(isEn ? 'NEW EXERCISES' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}
            </button>
          </div>
        </header>

        {/* Λίστα 12 Ασκήσεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userVal = answers[q.id] ?? '';
            const correct = submitted && isQuestionCorrect(q);
            const wrong = submitted && !correct;

            return (
              <article
                key={q.id}
                className={`rounded-3xl bg-white border-2 p-5 sm:p-7 shadow-sm transition-colors ${
                  submitted
                    ? correct
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
                    {toCleanUppercase(
                      isEn ? `EXERCISE ${idx + 1} OF 12` : `ΑΣΚΗΣΗ ${idx + 1} ΑΠΟ 12`
                    )}
                  </span>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        correct
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {toCleanUppercase(
                        correct
                          ? isEn
                            ? 'CORRECT'
                            : 'ΣΩΣΤΟ'
                          : isEn
                          ? 'INCORRECT'
                          : 'ΛΑΘΟΣ'
                      )}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-5">
                  {isEn ? q.promptEn : q.promptEl}
                </div>

                {/* Τύπος TF */}
                {q.type === 'tf' && (
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {[
                      { val: 'true', label: isEn ? 'True' : 'Σωστό' },
                      { val: 'false', label: isEn ? 'False' : 'Λάθος' },
                    ].map((opt) => {
                      const selected = userVal === opt.val;
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.val)}
                          className={`py-3 px-4 rounded-2xl border-2 font-extrabold text-sm sm:text-base transition-all ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Τύπος MCQ */}
                {q.type === 'mcq' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const selected = userVal === opt.key;
                      const letter = ['Α', 'Β', 'Γ', 'Δ'][optIdx];
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.key)}
                          className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center gap-3 transition-all ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              selected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="inline-flex flex-wrap items-center">
                            {isEn ? opt.labelEn : opt.labelEl}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Τύπος INPUT */}
                {q.type === 'input' && (
                  <div className="flex flex-wrap items-center gap-3 max-w-md">
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={submitted}
                      value={userVal}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      placeholder={isEn ? 'Type your answer...' : 'Γράψε την απάντηση...'}
                      className="w-44 sm:w-52 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-none font-bold text-base text-slate-900 bg-white disabled:bg-slate-100"
                    />
                    {(q.unitEl || q.unitEn) && (
                      <span className="text-xs sm:text-sm font-bold text-slate-500">
                        {isEn ? q.unitEn : q.unitEl}
                      </span>
                    )}
                  </div>
                )}

                {/* Feedback ΜΟΝΟ μετά την υποβολή (No-Giveaway Κανόνας) */}
                {submitted && (
                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                      <span className="font-bold text-slate-700">
                        {isEn ? 'Correct answer:' : 'Σωστή απάντηση:'}
                      </span>
                      <span className="inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black">
                        {isEn ? q.correctTextEn : q.correctTextEl}
                      </span>
                    </div>

                    <div className="text-sm sm:text-base text-slate-700 leading-relaxed flex flex-wrap items-center gap-x-1 gap-y-1">
                      <span className="font-extrabold text-slate-900">
                        {isEn ? 'Explanation:' : 'Επεξήγηση:'}
                      </span>
                      <span>{isEn ? q.explanationEn : q.explanationEl}</span>
                    </div>

                    {/* Πίνακας Βημάτων (όπου υπάρχει) */}
                    {q.tableData && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 mt-3">
                        <table className="w-full table-fixed text-xs sm:text-sm text-left bg-white">
                          <thead className="bg-slate-100 text-slate-800 font-extrabold">
                            <tr>
                              <th className="w-1/3 px-3 sm:px-4 py-2.5">
                                {isEn ? 'Step' : 'Βήμα'}
                              </th>
                              <th className="w-2/3 px-3 sm:px-4 py-2.5">
                                {isEn ? 'Analysis' : 'Ανάλυση'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="px-3 sm:px-4 py-2.5 font-bold text-slate-800">
                                  {isEn ? row.stepEn : row.stepEl}
                                </td>
                                <td className="px-3 sm:px-4 py-2.5">
                                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                    {row.calc}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Εποπτικό SVG Διάγραμμα ΜΟΝΟ στο feedback */}
                    {q.renderFeedbackDiagram && q.renderFeedbackDiagram()}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Score Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-extrabold text-slate-700">
              {isEn ? 'Answered:' : 'Απαντημένες:'}{' '}
              <span className="text-indigo-700 font-black">
                {answeredCount} / {questions.length}
              </span>
            </span>

            {submitted && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-black">
                {isEn
                  ? `Score: ${score}/${questions.length} (${percentage}%)`
                  : `Βαθμολογία: ${score}/${questions.length} (${percentage}%)`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow transition-colors"
              >
                {toCleanUppercase(isEn ? 'CHECK ANSWERS' : 'ΕΛΕΓΧΟΣ')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow transition-colors"
              >
                {toCleanUppercase(isEn ? 'NEW EXERCISES' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
