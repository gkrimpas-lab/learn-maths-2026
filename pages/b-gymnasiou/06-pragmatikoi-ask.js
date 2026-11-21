import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
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

// --- Custom Μαθηματικά Components ---
function Angle({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Arc({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Frac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.88em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 whitespace-nowrap font-semibold">
        {num}
      </span>
      <span className="px-1 pt-0.5 whitespace-nowrap font-semibold">
        {den}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Auto-stretches για αριθμούς, δυνάμεις & κλάσματα)
function Radical({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-stretch align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}
    >
      <svg
        viewBox="0 0 14 24"
        className="w-[0.6em] self-stretch shrink-0 text-current overflow-visible"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
      >
        <path d="M 1 13.5 L 4 13.5 L 7.5 22.8 L 13.6 0.8" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 pb-[1px] leading-none inline-flex items-center text-[0.95em] font-semibold">
        {children}
      </span>
    </span>
  );
}
function Pow({ base, exp, parens = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline font-mono leading-none mx-[1px] ${className}`}>
      {parens ? (
        <span className="inline-flex items-center">
          <span>(</span>
          {base}
          <span>)</span>
        </span>
      ) : (
        <span>{base}</span>
      )}
      <sup className="text-[0.72em] font-bold leading-none ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

function SvgRadical({ x, y, text, color = '#0f172a', fontSize = 12, prefix = '' }) {
  const charWidth = fontSize * 0.62;
  const textWidth = Math.max(fontSize * 0.8, String(text).length * charWidth + 4);
  const hookW = fontSize * 0.65;
  const topY = y - fontSize * 0.88;
  const botY = y + fontSize * 0.14;
  const midY = y - fontSize * 0.35;

  return (
    <g>
      {prefix && (
        <text
          x={x - 3}
          y={y}
          textAnchor="end"
          fontSize={fontSize}
          fontWeight="800"
          fill={color}
          fontFamily="monospace"
        >
          {prefix}
        </text>
      )}
      <path
        d={`M ${x} ${midY} L ${x + hookW * 0.32} ${midY} L ${x + hookW * 0.62} ${botY} L ${x + hookW} ${topY} L ${x + hookW + textWidth} ${topY}`}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={x + hookW + 2}
        y={y}
        fontSize={fontSize}
        fontWeight="800"
        fill={color}
        fontFamily="monospace"
      >
        {text}
      </text>
    </g>
  );
}

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
        promptEl: 'Κάθε περιοδικός δεκαδικός αριθμός, όπως ο 0,3, είναι ρητός αριθμός.',
        promptEn: 'Every repeating decimal number, such as 0.3, is a rational number.',
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span>
            Κάθε περιοδικός δεκαδικός γράφεται ως κλάσμα (π.χ. 0,3 = <Frac num="1" den="3" />), άρα ανήκει στους ρητούς (ℚ).
          </span>
        ),
        explanationEn: (
          <span>
            Every repeating decimal can be written as a fraction (e.g. 0.3 = <Frac num="1" den="3" />), so it belongs to ℚ.
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
      { a: 1, b: 1, res: 2, wrong1: 1, wrong2: 3, wrong3: 4 },
      { a: 2, b: 1, res: 5, wrong1: 3, wrong2: 4, wrong3: 6 },
      { a: 2, b: 2, res: 8, wrong1: 4, wrong2: 6, wrong3: 10 },
      { a: 3, b: 1, res: 10, wrong1: 4, wrong2: 8, wrong3: 9 },
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
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Από το Πυθαγόρειο Θεώρημα:</span>
          <Pow base="ρ" exp="2" />
          <span>=</span>
          <Pow base={String(c.a)} exp="2" />
          <span>+</span>
          <Pow base={String(c.b)} exp="2" />
          <span>= {c.a * c.a} + {c.b * c.b} = {c.res} ⇒ ρ =</span>
          <Radical>{c.res}</Radical>
          <span>.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>By the Pythagorean Theorem:</span>
          <Pow base="ρ" exp="2" />
          <span>=</span>
          <Pow base={String(c.a)} exp="2" />
          <span>+</span>
          <Pow base={String(c.b)} exp="2" />
          <span>= {c.a * c.a} + {c.b * c.b} = {c.res} ⇒ ρ =</span>
          <Radical>{c.res}</Radical>
          <span>.</span>
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
            <SvgRadical x={100} y={65} text={String(c.res)} prefix="ρ =" color="#4f46e5" fontSize={12} />
            <path d="M 160 30 A 139 139 0 0 1 189 115" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="189" cy="115" r="4.5" fill="#dc2626" />
            <SvgRadical x={182} y={134} text={String(c.res)} color="#dc2626" fontSize={12} />
          </svg>
        </div>
      ),
    });
  }

  // Q4 (Input): Διαδοχικοί ακέραιοι που περιέχουν το √N
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

  // Q5 (Input): Τετράγωνοι αριθμοί - Άθροισμα ριζών
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
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Επειδή {a} =</span>
          <Pow base={String(Math.sqrt(a))} exp="2" />
          <span>και {b} =</span>
          <Pow base={String(Math.sqrt(b))} exp="2" />
          <span>, έχουμε:</span>
          <Radical>{a}</Radical>
          <span>+</span>
          <Radical>{b}</Radical>
          <span>= {Math.sqrt(a)} + {Math.sqrt(b)} = {ans}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Since {a} =</span>
          <Pow base={String(Math.sqrt(a))} exp="2" />
          <span>and {b} =</span>
          <Pow base={String(Math.sqrt(b))} exp="2" />
          <span>, we get:</span>
          <Radical>{a}</Radical>
          <span>+</span>
          <Radical>{b}</Radical>
          <span>= {Math.sqrt(a)} + {Math.sqrt(b)} = {ans}.</span>
        </span>
      ),
    });
  }

  // Q6 (TF): Πρόσημο και μηδενικός εκθέτης (με <Pow>)
  {
    const mode = randInt(1, 2);
    if (mode === 1) {
      const base = pickRandom([3, 5, 7, 11]);
      questions.push({
        id: 6,
        type: 'tf',
        promptEl: (
          <span className="inline-flex items-baseline gap-1">
            <span>Ισχύει η ισότητα:</span>
            <Pow base={`-${base}`} exp="0" parens />
            <span>= -1.</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex items-baseline gap-1">
            <span>The equality</span>
            <Pow base={`-${base}`} exp="0" parens />
            <span>= -1 holds true.</span>
          </span>
        ),
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: (
          <span className="inline-flex flex-wrap items-baseline gap-x-1">
            <span>Κάθε μη μηδενικός πραγματικός αριθμός (με παρένθεση) υψωμένος στη μηδενική δύναμη ισούται με +1:</span>
            <Pow base={`-${base}`} exp="0" parens />
            <span>= 1. (Αντίθετα,</span>
            <Pow base={`-${base}`} exp="0" />
            <span>= -1).</span>
          </span>
        ),
        explanationEn: (
          <span className="inline-flex flex-wrap items-baseline gap-x-1">
            <span>Any non-zero real number (in parentheses) raised to the 0th power equals +1:</span>
            <Pow base={`-${base}`} exp="0" parens />
            <span>= 1.</span>
          </span>
        ),
      });
    } else {
      const exp = pickRandom([-2, -4, -6]);
      questions.push({
        id: 6,
        type: 'tf',
        promptEl: (
          <span className="inline-flex items-baseline gap-1">
            <span>Η δύναμη</span>
            <Pow base="-2" exp={String(exp)} parens />
            <span>είναι θετικός αριθμός.</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex items-baseline gap-1">
            <span>The power</span>
            <Pow base="-2" exp={String(exp)} parens />
            <span>is a positive number.</span>
          </span>
        ),
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span className="inline-flex flex-wrap items-center gap-x-1">
            <span>Ο εκθέτης {exp} είναι άρτιος ακέραιος, άρα</span>
            <Pow base="-2" exp={String(exp)} parens />
            <span>=</span>
            <Frac num="1" den={<Pow base="-2" exp={String(Math.abs(exp))} parens />} />
            <span>=</span>
            <Frac num="1" den={String(Math.pow(2, Math.abs(exp)))} />
            <span>&gt; 0.</span>
          </span>
        ),
        explanationEn: (
          <span className="inline-flex flex-wrap items-center gap-x-1">
            <span>The exponent {exp} is an even integer, so</span>
            <Pow base="-2" exp={String(exp)} parens />
            <span>=</span>
            <Frac num="1" den={String(Math.pow(2, Math.abs(exp)))} />
            <span>&gt; 0.</span>
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
        <span className="inline-flex items-baseline gap-1">
          <span>Ποια είναι η τιμή της δύναμης</span>
          <Pow base={String(base)} exp={`-${exp}`} />
          <span>;</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-baseline gap-1">
          <span>What is the value of the power</span>
          <Pow base={String(base)} exp={`-${exp}`} />
          <span>?</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Frac num="1" den={String(denVal)} />,
      correctTextEn: <Frac num="1" den={String(denVal)} />,
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Από τον ορισμό του αρνητικού εκθέτη:</span>
          <Pow base={String(base)} exp={`-${exp}`} />
          <span>=</span>
          <Frac num="1" den={<Pow base={String(base)} exp={String(exp)} />} />
          <span>=</span>
          <Frac num="1" den={String(denVal)} />
          <span>.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>By the negative exponent definition:</span>
          <Pow base={String(base)} exp={`-${exp}`} />
          <span>=</span>
          <Frac num="1" den={<Pow base={String(base)} exp={String(exp)} />} />
          <span>=</span>
          <Frac num="1" den={String(denVal)} />
          <span>.</span>
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
        <span className="inline-flex items-center gap-1">
          <span>Υπολογίστε την τιμή της δύναμης</span>
          <Pow base={<Frac num="1" den={String(den)} />} exp={`-${exp}`} parens />
          <span>:</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-center gap-1">
          <span>Calculate the value of</span>
          <Pow base={<Frac num="1" den={String(den)} />} exp={`-${exp}`} parens />
          <span>:</span>
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Αντιστρέφουμε το κλάσμα:</span>
          <Pow base={<Frac num="1" den={String(den)} />} exp={`-${exp}`} parens />
          <span>=</span>
          <Pow base={<Frac num={String(den)} den="1" />} exp={String(exp)} parens />
          <span>=</span>
          <Pow base={String(den)} exp={String(exp)} />
          <span>= {ans}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Invert the fraction:</span>
          <Pow base={<Frac num="1" den={String(den)} />} exp={`-${exp}`} parens />
          <span>=</span>
          <Pow base={String(den)} exp={String(exp)} />
          <span>= {ans}.</span>
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
      labelEl: <Pow base={base} exp={String(sum)} />,
      labelEn: <Pow base={base} exp={String(sum)} />,
    };
    const distractors = [
      { key: `${base}^${m * n}`, labelEl: <Pow base={base} exp={String(m * n)} />, labelEn: <Pow base={base} exp={String(m * n)} /> },
      { key: `${base}^${m - n}`, labelEl: <Pow base={base} exp={String(m - n)} />, labelEn: <Pow base={base} exp={String(m - n)} /> },
      { key: `${base}^${-sum}`, labelEl: <Pow base={base} exp={String(-sum)} />, labelEn: <Pow base={base} exp={String(-sum)} /> },
      { key: `2${base}^${sum}`, labelEl: <Pow base={`2${base}`} exp={String(sum)} />, labelEn: <Pow base={`2${base}`} exp={String(sum)} /> },
    ];
    questions.push({
      id: 9,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Σε μία δύναμη της βάσης {base} (με {base} ≠ 0), το γινόμενο</span>
          <Pow base={base} exp={String(m)} />
          <span>·</span>
          <Pow base={base} exp={String(n)} />
          <span>ισούται με:</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Written as a single power of {base} ({base} ≠ 0), the product</span>
          <Pow base={base} exp={String(m)} />
          <span>·</span>
          <Pow base={base} exp={String(n)} />
          <span>equals:</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Pow base={base} exp={String(sum)} />,
      correctTextEn: <Pow base={base} exp={String(sum)} />,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Προσθέτουμε τους εκθέτες:</span>
          <Pow base={base} exp={String(m)} />
          <span>·</span>
          <Pow base={base} exp={String(n)} />
          <span>=</span>
          <Pow base={base} exp={`${m} + (${n})`} />
          <span>=</span>
          <Pow base={base} exp={String(sum)} />
          <span>.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Add the exponents:</span>
          <Pow base={base} exp={String(m)} />
          <span>·</span>
          <Pow base={base} exp={String(n)} />
          <span>=</span>
          <Pow base={base} exp={`${m} + (${n})`} />
          <span>=</span>
          <Pow base={base} exp={String(sum)} />
          <span>.</span>
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
      labelEl: <Pow base={base} exp={String(diff)} />,
      labelEn: <Pow base={base} exp={String(diff)} />,
    };
    const distractors = [
      { key: `${base}^${m + n}`, labelEl: <Pow base={base} exp={String(m + n)} />, labelEn: <Pow base={base} exp={String(m + n)} /> },
      { key: `${base}^${n - m}`, labelEl: <Pow base={base} exp={String(n - m)} />, labelEn: <Pow base={base} exp={String(n - m)} /> },
      { key: `${base}^${m * n}`, labelEl: <Pow base={base} exp={String(m * n)} />, labelEn: <Pow base={base} exp={String(m * n)} /> },
      { key: '1', labelEl: '1', labelEn: '1' },
    ];
    questions.push({
      id: 10,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex items-center gap-1">
          <span>Το πηλίκο</span>
          <Frac num={<Pow base={base} exp={String(m)} />} den={<Pow base={base} exp={String(n)} />} />
          <span>(όπου {base} ≠ 0) ισούται με:</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-center gap-1">
          <span>The quotient</span>
          <Frac num={<Pow base={base} exp={String(m)} />} den={<Pow base={base} exp={String(n)} />} />
          <span>(where {base} ≠ 0) equals:</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: <Pow base={base} exp={String(diff)} />,
      correctTextEn: <Pow base={base} exp={String(diff)} />,
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Αφαιρούμε τους εκθέτες (προσέχοντας το πρόσημο):</span>
          <Frac num={<Pow base={base} exp={String(m)} />} den={<Pow base={base} exp={String(n)} />} />
          <span>=</span>
          <Pow base={base} exp={`${m} - (${n})`} />
          <span>=</span>
          <Pow base={base} exp={`${m} + ${Math.abs(n)}`} />
          <span>=</span>
          <Pow base={base} exp={String(diff)} />
          <span>.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Subtract the exponents carefully:</span>
          <Frac num={<Pow base={base} exp={String(m)} />} den={<Pow base={base} exp={String(n)} />} />
          <span>=</span>
          <Pow base={base} exp={`${m} - (${n})`} />
          <span>=</span>
          <Pow base={base} exp={String(diff)} />
          <span>.</span>
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
        <span className="inline-flex items-baseline gap-1">
          <span>Υπολογίστε την τιμή της δύναμης</span>
          <Pow base={<Radical>{k}</Radical>} exp={String(exp)} parens />
          <span>:</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex items-baseline gap-1">
          <span>Calculate the value of</span>
          <Pow base={<Radical>{k}</Radical>} exp={String(exp)} parens />
          <span>:</span>
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Γράφουμε το {exp} = 2 · {exp / 2}:</span>
          <Pow base={<Radical>{k}</Radical>} exp={String(exp)} parens />
          <span>=</span>
          <Pow base={<Pow base={<Radical>{k}</Radical>} exp="2" parens />} exp={String(exp / 2)} parens />
          <span>=</span>
          <Pow base={String(k)} exp={String(exp / 2)} />
          <span>= {ans}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span>Write {exp} = 2 · {exp / 2}:</span>
          <Pow base={<Radical>{k}</Radical>} exp={String(exp)} parens />
          <span>=</span>
          <Pow base={<Pow base={<Radical>{k}</Radical>} exp="2" parens />} exp={String(exp / 2)} parens />
          <span>=</span>
          <Pow base={String(k)} exp={String(exp / 2)} />
          <span>= {ans}.</span>
        </span>
      ),
    });
  }

  // Q12 (Input - Συνδυαστικό πρόβλημα δυνάμεων με tableData & <Pow>)
  {
    const b = pickRandom([2, 3]);
    const p1 = pickRandom([-2, -3]);
    const p2 = pickRandom([2, 3]);
    const p3 = p1 + p2 * 2 - 1;
    const fracExp = pickRandom([-2, -3]);
    const term2 = Math.pow(2, Math.abs(fracExp));
    const totalAns = b + term2;

    questions.push({
      id: 12,
      type: 'input',
      promptEl: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Υπολογίστε την τιμή της παράστασης:</span>
          <span className="inline-flex items-center gap-1 font-bold">
            <span>Π =</span>
            <Frac
              num={
                <span className="inline-flex items-baseline gap-1">
                  <Pow base={String(b)} exp={String(p1)} />
                  <span>·</span>
                  <Pow base={<Pow base={String(b)} exp={String(p2)} />} exp="2" parens />
                </span>
              }
              den={<Pow base={String(b)} exp={String(p3)} />}
            />
            <span>+</span>
            <Pow base={<Frac num="1" den="2" />} exp={String(fracExp)} parens />
          </span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>Calculate the value of the expression:</span>
          <span className="inline-flex items-center gap-1 font-bold">
            <span>Π =</span>
            <Frac
              num={
                <span className="inline-flex items-baseline gap-1">
                  <Pow base={String(b)} exp={String(p1)} />
                  <span>·</span>
                  <Pow base={<Pow base={String(b)} exp={String(p2)} />} exp="2" parens />
                </span>
              }
              den={<Pow base={String(b)} exp={String(p3)} />}
            />
            <span>+</span>
            <Pow base={<Frac num="1" den="2" />} exp={String(fracExp)} parens />
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
            <span className="inline-flex items-baseline gap-1">
              <Pow base={<Pow base={String(b)} exp={String(p2)} />} exp="2" parens />
              <span>=</span>
              <Pow base={String(b)} exp={String(p2 * 2)} />
            </span>
          ),
        },
        {
          stepEl: '2. Απλοποίηση κλάσματος',
          stepEn: '2. Simplify fraction',
          calc: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Frac
                num={
                  <span className="inline-flex items-baseline gap-1">
                    <Pow base={String(b)} exp={String(p1)} />
                    <span>·</span>
                    <Pow base={String(b)} exp={String(p2 * 2)} />
                  </span>
                }
                den={<Pow base={String(b)} exp={String(p3)} />}
              />
              <span>=</span>
              <Pow base={String(b)} exp={`${p1 + p2 * 2} - (${p3})`} />
              <span>=</span>
              <Pow base={String(b)} exp="1" />
              <span>= {b}</span>
            </span>
          ),
        },
        {
          stepEl: '3. Αρνητικός εκθέτης & άθροισμα',
          stepEn: '3. Negative exponent & sum',
          calc: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Pow base={<Frac num="1" den="2" />} exp={String(fracExp)} parens />
              <span>=</span>
              <Pow base="2" exp={String(Math.abs(fracExp))} />
              <span>= {term2} ⇒ Π = {b} + {term2} = {totalAns}</span>
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
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">📖</span>
      <span>{toCleanUppercase(isEn ? 'THEORY' : 'ΘΕΩΡΙΑ')}</span>
    </Link>
  );

  return (
    <Layout
      title={pageTitle}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backText={isEn ? 'Grade 8' : "Β' Γυμνασίου"}
    >
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