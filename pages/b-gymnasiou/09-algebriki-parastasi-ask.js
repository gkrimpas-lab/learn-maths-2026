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

// --- Γεννήτρια 12 Δυναμικών Ερωτήσεων Κεφαλαίου 8 ---
function generateQuestions() {
  const questions = [];

  // Q1 (TF): Αναγνώριση ομοίων όρων
  {
    const mode = randInt(1, 3);
    if (mode === 1) {
      const a = pickRandom([3, 4, 7]);
      const b = pickRandom([-2, -5, 6]);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Οι όροι {a}</span>
            <Pow base="x" exp="2" />
            <span>και {b}</span>
            <Pow base="x" exp="2" />
            <span>είναι όμοιοι όροι.</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>The terms {a}</span>
            <Pow base="x" exp="2" />
            <span>and {b}</span>
            <Pow base="x" exp="2" />
            <span>are like terms.</span>
          </span>
        ),
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Έχουν ακριβώς το ίδιο μεταβλητό μέρος (</span>
            <Pow base="x" exp="2" />
            <span>) και διαφέρουν μόνο στους συντελεστές ({a} και {b}).</span>
          </span>
        ),
        explanationEn: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>They share the exact same variable part (</span>
            <Pow base="x" exp="2" />
            <span>) and differ only in coefficients ({a} and {b}).</span>
          </span>
        ),
      });
    } else if (mode === 2) {
      const c = pickRandom([4, 5, 8]);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Οι όροι {c}x και {c}</span>
            <Pow base="x" exp="2" />
            <span>είναι όμοιοι όροι, επειδή έχουν τον ίδιο συντελεστή {c}.</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>The terms {c}x and {c}</span>
            <Pow base="x" exp="2" />
            <span>are like terms because they have the same coefficient {c}.</span>
          </span>
        ),
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Δεν έχουν το ίδιο μεταβλητό μέρος (το x έχει εκθέτη 1, ενώ το</span>
            <Pow base="x" exp="2" />
            <span>έχει εκθέτη 2), άρα δεν είναι όμοιοι όροι.</span>
          </span>
        ),
        explanationEn: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Their variable parts have different exponents (x vs</span>
            <Pow base="x" exp="2" />
            <span>), so they are not like terms.</span>
          </span>
        ),
      });
    } else {
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: 'Οι όροι 5αβ και -3βα είναι όμοιοι όροι.',
        promptEn: 'The terms 5ab and -3ba are like terms.',
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: 'Από την αντιμεταθετική ιδιότητα του πολλαπλασιασμού ισχύει α · β ＝ β · α, άρα έχουν το ίδιο μεταβλητό μέρος.',
        explanationEn: 'By the commutative property of multiplication, a · b ＝ b · a, so they have the same variable part.',
      });
    }
  }

  // Q2 (Input): Εντοπισμός συντελεστή συγκεκριμένου όρου
  {
    const c2 = pickRandom([3, 5, 7]);
    const c1 = pickRandom([-4, -6, -8, -9]);
    const c0 = pickRandom([2, 5, 11]);
    questions.push({
      id: 2,
      type: 'input',
      promptEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Στην αλγεβρική παράσταση {c2}</span>
          <Pow base="x" exp="2" />
          <span>－ {Math.abs(c1)}x ＋ {c0}, ποιος είναι ο συντελεστής του όρου που περιέχει το x (1ου βαθμού);</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>In the expression {c2}</span>
          <Pow base="x" exp="2" />
          <span>－ {Math.abs(c1)}x ＋ {c0}, what is the coefficient of the x term?</span>
        </span>
      ),
      correct: String(c1),
      correctTextEl: String(c1),
      correctTextEn: String(c1),
      explanationEl: `Ο όρος είναι -${Math.abs(c1)}x, οπότε ο συντελεστής του (μαζί με το πρόσημο) είναι ${c1}.`,
      explanationEn: `The term is -${Math.abs(c1)}x, so its coefficient (including the sign) is ${c1}.`,
    });
  }

  // Q3 (Input): Εντοπισμός σταθερού όρου
  {
    const a = pickRandom([2, 4, 6]);
    const b = pickRandom([3, 5, 7]);
    const c = pickRandom([-9, -7, -5, 8, 12]);
    const cStr = c > 0 ? `＋ ${c}` : `－ ${Math.abs(c)}`;
    questions.push({
      id: 3,
      type: 'input',
      promptEl: `Ποιος είναι ο σταθερός όρος της αλγεβρικής παράστασης ${a}x － ${b}y ${cStr};`,
      promptEn: `What is the constant term of the algebraic expression ${a}x － ${b}y ${cStr}?`,
      correct: String(c),
      correctTextEl: String(c),
      correctTextEn: String(c),
      explanationEl: `Ο όρος χωρίς μεταβλητές (σταθερός όρος) είναι ο ${c}.`,
      explanationEn: `The term without variables (constant term) is ${c}.`,
    });
  }

  // Q4 (MCQ): Αναγωγή απλής γραμμικής παράστασης με 1 μεταβλητή & σταθερό όρο
  {
    const a1 = pickRandom([4, 5, 6, 7]);
    const a2 = pickRandom([2, 3]);
    const c1 = pickRandom([3, 5, 8]);
    const c2 = pickRandom([2, 4, 9]);
    const resA = a1 - a2;
    const resC = c1 - c2;
    const fmt = (aa, cc) => (cc >= 0 ? `${aa}x ＋ ${cc}` : `${aa}x － ${Math.abs(cc)}`);
    const correctLabel = fmt(resA, resC);
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: fmt(a1 + a2, resC), labelEn: fmt(a1 + a2, resC) },
      { key: 'w2', labelEl: fmt(resA, c1 + c2), labelEn: fmt(resA, c1 + c2) },
      { key: 'w3', labelEl: `${resA + resC}x`, labelEn: `${resA + resC}x` },
      { key: 'w4', labelEl: fmt(resA, -resC), labelEn: fmt(resA, -resC) },
    ];
    questions.push({
      id: 4,
      type: 'mcq',
      promptEl: `Κάντε αναγωγή ομοίων όρων στην παράσταση: ${a1}x ＋ ${c1} － ${a2}x － ${c2}`,
      promptEn: `Combine like terms in the expression: ${a1}x ＋ ${c1} － ${a2}x － ${c2}`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `Ομαδοποιούμε τους όμοιους όρους: (${a1} － ${a2})x ＋ (${c1} － ${c2}) ＝ ${correctLabel}.`,
      explanationEn: `Group like terms: (${a1} － ${a2})x ＋ (${c1} － ${c2}) ＝ ${correctLabel}.`,
    });
  }

  // Q5 (MCQ): Αναγωγή ομοίων όρων με 2 μεταβλητές (x και y)
  {
    const x1 = pickRandom([3, 5, 6]);
    const x2 = pickRandom([2, 4]);
    const y1 = pickRandom([2, 3, 4]);
    const y2 = pickRandom([5, 6, 7]);
    const rx = x1 + x2;
    const ry = y1 - y2; // αρνητικό
    const correctLabel = `${rx}x － ${Math.abs(ry)}y`;
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: `${rx}x ＋ ${Math.abs(ry)}y`, labelEn: `${rx}x ＋ ${Math.abs(ry)}y` },
      { key: 'w2', labelEl: `${x1 - x2}x － ${Math.abs(ry)}y`, labelEn: `${x1 - x2}x － ${Math.abs(ry)}y` },
      { key: 'w3', labelEl: `${rx + ry}xy`, labelEn: `${rx + ry}xy` },
      { key: 'w4', labelEl: `${rx}x － ${y1 + y2}y`, labelEn: `${rx}x － ${y1 + y2}y` },
    ];
    questions.push({
      id: 5,
      type: 'mcq',
      promptEl: `Απλοποιήστε (αναγωγή ομοίων όρων): ${x1}x ＋ ${y1}y ＋ ${x2}x － ${y2}y`,
      promptEn: `Simplify by combining like terms: ${x1}x ＋ ${y1}y ＋ ${x2}x － ${y2}y`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `(${x1} ＋ ${x2})x ＋ (${y1} － ${y2})y ＝ ${rx}x ＋ (${ry}y) ＝ ${correctLabel}.`,
      explanationEn: `(${x1} ＋ ${x2})x ＋ (${y1} － ${y2})y ＝ ${correctLabel}.`,
    });
  }

  // Q6 (MCQ): Αναγωγή με x² και x (προσοχή στον συντελεστή ±1)
  {
    const a = pickRandom([4, 5, 6]);
    const b = pickRandom([2, 3, 4]);
    const resA = a - 1;
    const resB = b + 1;
    const correctNode = (
      <span className="inline-flex items-baseline gap-1">
        <span>{resA}</span>
        <Pow base="x" exp="2" />
        <span>＋ {resB}x</span>
      </span>
    );
    const correctOpt = { key: 'corr', labelEl: correctNode, labelEn: correctNode };
    const distractors = [
      {
        key: 'w1',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>＋ {b}x</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>＋ {b}x</span></span>,
      },
      {
        key: 'w2',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{resA + resB}</span><Pow base="x" exp="3" /></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{resA + resB}</span><Pow base="x" exp="3" /></span>,
      },
      {
        key: 'w3',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{a + 1}</span><Pow base="x" exp="2" /><span>＋ {b - 1}x</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{a + 1}</span><Pow base="x" exp="2" /><span>＋ {b - 1}x</span></span>,
      },
      {
        key: 'w4',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{resA}</span><Pow base="x" exp="2" /><span>＋ {b}x</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{resA}</span><Pow base="x" exp="2" /><span>＋ {b}x</span></span>,
      },
    ];
    questions.push({
      id: 6,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Κάντε αναγωγή ομοίων όρων: {a}</span>
          <Pow base="x" exp="2" />
          <span>＋ {b}x －</span>
          <Pow base="x" exp="2" />
          <span>＋ x</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Combine like terms: {a}</span>
          <Pow base="x" exp="2" />
          <span>＋ {b}x －</span>
          <Pow base="x" exp="2" />
          <span>＋ x</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctNode,
      correctTextEn: correctNode,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Θυμόμαστε ότι -</span>
          <Pow base="x" exp="2" />
          <span>＝ -1</span>
          <Pow base="x" exp="2" />
          <span>και +x ＝ +1x: ({a} － 1)</span>
          <Pow base="x" exp="2" />
          <span>＋ ({b} ＋ 1)x ＝ {resA}</span>
          <Pow base="x" exp="2" />
          <span>＋ {resB}x.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>({a} － 1)</span>
          <Pow base="x" exp="2" />
          <span>＋ ({b} ＋ 1)x ＝ {resA}</span>
          <Pow base="x" exp="2" />
          <span>＋ {resB}x.</span>
        </span>
      ),
    });
  }

  // Q7 (Input): Αριθμητική τιμή αλγεβρικής παράστασης (με θετική τιμή x)
  {
    const a = pickRandom([3, 4, 5]);
    const b = pickRandom([2, 5, 7, 9]);
    const x = pickRandom([2, 3, 4]);
    const ans = a * x - b;
    questions.push({
      id: 7,
      type: 'input',
      promptEl: `Υπολογίστε την αριθμητική τιμή της παράστασης ${a}x － ${b} για x ＝ ${x}:`,
      promptEn: `Calculate the numerical value of ${a}x － ${b} for x ＝ ${x}:`,
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: `Αντικαθιστούμε x ＝ ${x}: ${a} · ${x} － ${b} ＝ ${a * x} － ${b} ＝ ${ans}.`,
      explanationEn: `Substitute x ＝ ${x}: ${a} · ${x} － ${b} ＝ ${a * x} － ${b} ＝ ${ans}.`,
    });
  }

  // Q8 (Input): Αριθμητική τιμή με αρνητικό αριθμό x < 0
  {
    const a = pickRandom([2, 3, 4]);
    const b = pickRandom([1, 3, 5]);
    const x = pickRandom([-2, -3]);
    const ans = a * x * x + b * x;
    questions.push({
      id: 8,
      type: 'input',
      promptEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Υπολογίστε την αριθμητική τιμή της παράστασης {a}</span>
          <Pow base="x" exp="2" />
          <span>＋ {b}x για x ＝ {x}:</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Evaluate {a}</span>
          <Pow base="x" exp="2" />
          <span>＋ {b}x for x ＝ {x}:</span>
        </span>
      ),
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>{a} ·</span>
          <Pow base={String(x)} exp="2" parens />
          <span>＋ {b} · ({x}) ＝ {a} · {x * x} ＋ ({b * x}) ＝ {a * x * x} － {Math.abs(b * x)} ＝ {ans}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>{a} ·</span>
          <Pow base={String(x)} exp="2" parens />
          <span>＋ {b} · ({x}) ＝ {a * x * x} － {Math.abs(b * x)} ＝ {ans}.</span>
        </span>
      ),
    });
  }

  // Q9 (MCQ): Αναγωγή με ρητούς συντελεστές (κλάσματα)
  {
    const den = pickRandom([2, 3, 4]);
    const num1 = 1;
    const num2 = den - 1;
    const c = pickRandom([2, 5, 7]);
    const correctLabel = `x ＋ ${c}`;
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      {
        key: 'w1',
        labelEl: <span className="inline-flex items-center"><Frac num={String(den)} den={String(2 * den)} /><span>x ＋ {c}</span></span>,
        labelEn: <span className="inline-flex items-center"><Frac num={String(den)} den={String(2 * den)} /><span>x ＋ {c}</span></span>,
      },
      {
        key: 'w2',
        labelEl: <span className="inline-flex items-center"><Frac num="1" den={String(den)} /><span>x ＋ {c}</span></span>,
        labelEn: <span className="inline-flex items-center"><Frac num="1" den={String(den)} /><span>x ＋ {c}</span></span>,
      },
      { key: 'w3', labelEl: `${den}x ＋ ${c}`, labelEn: `${den}x ＋ ${c}` },
      { key: 'w4', labelEl: `${c + 1}x`, labelEn: `${c + 1}x` },
    ];
    questions.push({
      id: 9,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Απλοποιήστε την παράσταση:</span>
          <Frac num={String(num1)} den={String(den)} />
          <span>x ＋ {c} ＋</span>
          <Frac num={String(num2)} den={String(den)} />
          <span>x</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Simplify the expression:</span>
          <Frac num={String(num1)} den={String(den)} />
          <span>x ＋ {c} ＋</span>
          <Frac num={String(num2)} den={String(den)} />
          <span>x</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>(</span>
          <Frac num={String(num1)} den={String(den)} />
          <span>＋</span>
          <Frac num={String(num2)} den={String(den)} />
          <span>)x ＋ {c} ＝</span>
          <Frac num={String(den)} den={String(den)} />
          <span>x ＋ {c} ＝ 1x ＋ {c} ＝ x ＋ {c}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>(</span>
          <Frac num={String(num1)} den={String(den)} />
          <span>＋</span>
          <Frac num={String(num2)} den={String(den)} />
          <span>)x ＋ {c} ＝ x ＋ {c}.</span>
        </span>
      ),
    });
  }

  // Q10 (MCQ): Εντοπισμός ισοδύναμης αλγεβρικής παράστασης
  {
    const a1 = pickRandom([4, 5, 6]);
    const a2 = pickRandom([2, 3]);
    const diffA = a1 - a2;
    const c = pickRandom([3, 5, 7]);
    const correctLabel = `${diffA}x ＋ ${c}`;
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: `${a1 + a2}x ＋ ${c}`, labelEn: `${a1 + a2}x ＋ ${c}` },
      { key: 'w2', labelEl: `${diffA}x － ${c}`, labelEn: `${diffA}x － ${c}` },
      { key: 'w3', labelEl: `${diffA + c}x`, labelEn: `${diffA + c}x` },
      { key: 'w4', labelEl: `${diffA}x`, labelEn: `${diffA}x` },
    ];
    questions.push({
      id: 10,
      type: 'mcq',
      promptEl: `Ποια από τις παρακάτω παραστάσεις είναι ισοδύναμη με την παράσταση ${a1}x ＋ ${c} － ${a2}x;`,
      promptEn: `Which of the following expressions is equivalent to ${a1}x ＋ ${c} － ${a2}x?`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `Με αναγωγή ομοίων όρων: (${a1} － ${a2})x ＋ ${c} ＝ ${correctLabel}. Παίρνουν πάντα την ίδια αριθμητική τιμή για κάθε x.`,
      explanationEn: `Combining like terms gives (${a1} － ${a2})x ＋ ${c} ＝ ${correctLabel}, yielding the exact same value for every x.`,
    });
  }

  // Q11 (Input): Εύρεση αγνώστου συντελεστή κ ώστε δύο παραστάσεις να είναι ισοδύναμες
  {
    const x1 = pickRandom([3, 4, 5]);
    const x2 = pickRandom([2, 4, 6]);
    const c = pickRandom([3, 5, 7]);
    const kAns = x1 + x2;
    questions.push({
      id: 11,
      type: 'input',
      promptEl: `Ποια πρέπει να είναι η τιμή του συντελεστή κ ώστε οι αλγεβρικές παραστάσεις ${x1}x － ${c} ＋ ${x2}x και κ · x － ${c} να είναι ισοδύναμες;`,
      promptEn: `What must be the value of coefficient k so that ${x1}x － ${c} ＋ ${x2}x and k · x － ${c} are equivalent?`,
      correct: String(kAns),
      correctTextEl: String(kAns),
      correctTextEn: String(kAns),
      explanationEl: `Κάνουμε αναγωγή στην πρώτη παράσταση: (${x1} ＋ ${x2})x － ${c} ＝ ${kAns}x － ${c}. Άρα κ ＝ ${kAns}.`,
      explanationEn: `Combine like terms in the first expression: (${x1} ＋ ${x2})x － ${c} ＝ ${kAns}x － ${c}. Thus k ＝ ${kAns}.`,
    });
  }

  // Q12 (Input - Συνδυαστικό πρόβλημα γεωμετρικής περιμέτρου ορθογωνίου με διάγραμμα & tableData)
  {
    const lenCoef = pickRandom([2, 3]);
    const lenConst = pickRandom([3, 4, 5]);
    const widCoef = 1;
    const widConst = pickRandom([1, 2]);
    const perimCoef = 2 * (lenCoef + widCoef);
    const perimConst = 2 * (lenConst + widConst);
    const xVal = pickRandom([3, 4, 5]);
    const ans = perimCoef * xVal + perimConst;

    questions.push({
      id: 12,
      type: 'input',
      unitEl: 'cm',
      unitEn: 'cm',
      promptEl: `Ένα ορθογώνιο έχει μήκος ${lenCoef}x ＋ ${lenConst} cm και πλάτος x ＋ ${widConst} cm. Αφού εκφράσετε την περίμετρό του Π με ανηγμένη αλγεβρική παράσταση, υπολογίστε πόσα cm είναι η περίμετρος όταν x ＝ ${xVal}:`,
      promptEn: `A rectangle has length ${lenCoef}x ＋ ${lenConst} cm and width x ＋ ${widConst} cm. After writing its simplified algebraic perimeter Π, find the perimeter in cm when x ＝ ${xVal}:`,
      correct: String(ans),
      correctTextEl: `${ans} cm`,
      correctTextEn: `${ans} cm`,
      explanationEl: `Π ＝ 2 · (${lenCoef}x ＋ ${lenConst}) ＋ 2 · (x ＋ ${widConst}) ＝ ${perimCoef}x ＋ ${perimConst}. Για x ＝ ${xVal} έχουμε Π ＝ ${perimCoef} · ${xVal} ＋ ${perimConst} ＝ ${ans} cm.`,
      explanationEn: `Π ＝ ${perimCoef}x ＋ ${perimConst}. For x ＝ ${xVal}, Π ＝ ${perimCoef} · ${xVal} ＋ ${perimConst} ＝ ${ans} cm.`,
      tableData: [
        {
          stepEl: '1. Άθροισμα 4 πλευρών',
          stepEn: '1. Sum of 4 sides',
          calc: `Π ＝ (${lenCoef}x ＋ ${lenConst}) ＋ (x ＋ ${widConst}) ＋ (${lenCoef}x ＋ ${lenConst}) ＋ (x ＋ ${widConst})`,
        },
        {
          stepEl: '2. Αναγωγή ομοίων όρων',
          stepEn: '2. Combine like terms',
          calc: `Π ＝ (${lenCoef}＋1＋${lenCoef}＋1)x ＋ (${lenConst}＋${widConst}＋${lenConst}＋${widConst}) ＝ ${perimCoef}x ＋ ${perimConst}`,
        },
        {
          stepEl: `3. Αριθμητική τιμή (x ＝ ${xVal})`,
          stepEn: `3. Numerical value (x ＝ ${xVal})`,
          calc: `Π ＝ ${perimCoef} · ${xVal} ＋ ${perimConst} ＝ ${perimCoef * xVal} ＋ ${perimConst} ＝ ${ans} cm`,
        },
      ],
      renderFeedbackDiagram: () => (
        <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-3">
          <svg viewBox="0 0 300 135" className="w-full h-auto max-w-full block">
            <rect x="45" y="25" width="175" height="72" rx="4" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" />
            <text x="132" y="65" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#312e81" fontFamily="monospace">
              Π ＝ {perimCoef}x ＋ {perimConst}
            </text>
            <text x="132" y="116" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46" fontFamily="monospace">
              {lenCoef}x ＋ {lenConst}
            </text>
            <text x="228" y="65" textAnchor="start" fontSize="11" fontWeight="800" fill="#b45309" fontFamily="monospace">
              x ＋ {widConst}
            </text>
          </svg>
        </div>
      ),
    });
  }

  return questions;
}

export default function AlgebrikiParastasiExercisesPage() {
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
      const u = parseFloat(sanitizeInput(userVal));
      const c = parseFloat(sanitizeInput(q.correct));
      return !isNaN(u) && Math.abs(u - c) <= 0.02;
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
    ? 'Chapter 8 Exercises: Algebraic Expressions & Like Terms | Grade 8'
    : "Ασκήσεις Κεφαλαίου 8: Αλγεβρικές Παραστάσεις & Όμοιοι Όροι | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/09-algebriki-parastasi"
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
                  isEn ? 'CHAPTER 8 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 8 • Β' ΓΥΜΝΑΣΙΟΥ"
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {isEn
                ? 'Exercises: Algebraic Expressions & Like Terms'
                : 'Ασκήσεις: Αλγεβρικές Παραστάσεις, Όμοιοι Όροι & Αριθμητική Τιμή'}
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
                          <span className="inline-flex flex-wrap items-center font-mono">
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
                      <span className="inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black font-mono">
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
                                <td className="px-3 sm:px-4 py-2.5 font-mono">
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