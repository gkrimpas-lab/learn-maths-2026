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

const fmtLin = (a, b) => {
  const aPart = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  if (b === 0) return aPart;
  return b > 0 ? `${aPart} ＋ ${b}` : `${aPart} － ${Math.abs(b)}`;
};

// --- Γεννήτρια 12 Δυναμικών Ερωτήσεων Κεφαλαίου 9 ---
function generateQuestions() {
  const questions = [];

  // Q1 (TF): Απαλοιφή παρενθέσεων με '-'
  {
    const a = pickRandom([5, 7, 9]);
    const b = pickRandom([2, 3, 4]);
    const c = pickRandom([3, 6, 8]);
    const isTrue = Math.random() < 0.5;
    const shownSign = isTrue ? '＋' : '－';
    questions.push({
      id: 1,
      type: 'tf',
      promptEl: `Ισχύει η ταυτότητα: ${a} － (${b}x － ${c}) ＝ ${a} － ${b}x ${shownSign} ${c}.`,
      promptEn: `The identity ${a} － (${b}x － ${c}) ＝ ${a} － ${b}x ${shownSign} ${c} holds true.`,
      correct: isTrue ? 'true' : 'false',
      correctTextEl: isTrue ? 'Σωστό' : 'Λάθος',
      correctTextEn: isTrue ? 'True' : 'False',
      explanationEl: `Όταν αφαιρούμε παρένθεση με πρόσημο －, αλλάζουν τα πρόσημα όλων των όρων μέσα σε αυτή: ${a} － (${b}x － ${c}) ＝ ${a} － ${b}x ＋ ${c}.`,
      explanationEn: `Removing parentheses preceded by − changes the sign of every inner term: ${a} － (${b}x － ${c}) ＝ ${a} － ${b}x ＋ ${c}.`,
    });
  }

  // Q2 (MCQ): Πολλαπλασιασμός μονωνύμων (α·x) · (β·x)
  {
    const a = pickRandom([2, 3, 4, 5]);
    const b = pickRandom([-3, -4, 3, 6]);
    const prod = a * b;
    const sum = a + b;
    const bFmt = b < 0 ? `(${b})` : String(b);

    const fmtX2 = (coef) => {
      if (coef === 1) return <Pow base="x" exp="2" />;
      if (coef === -1) {
        return (
          <span className="inline-flex items-baseline">
            <span>-</span>
            <Pow base="x" exp="2" />
          </span>
        );
      }
      return (
        <span className="inline-flex items-baseline gap-0.5">
          <span>{coef}</span>
          <Pow base="x" exp="2" />
        </span>
      );
    };

    const fmtX1 = (coef) => {
      if (coef === 1) return 'x';
      if (coef === -1) return '-x';
      return `${coef}x`;
    };

    const correctNode = fmtX2(prod);
    const correctOpt = { key: 'corr', labelEl: correctNode, labelEn: correctNode };
    const distractors = [
      { key: 'w1', labelEl: fmtX1(prod), labelEn: fmtX1(prod) },
      { key: 'w2', labelEl: fmtX2(sum), labelEn: fmtX2(sum) },
      { key: 'w3', labelEl: fmtX2(-prod), labelEn: fmtX2(-prod) },
      { key: 'w4', labelEl: fmtX1(sum), labelEn: fmtX1(sum) },
    ];
    questions.push({
      id: 2,
      type: 'mcq',
      promptEl: `Το γινόμενο (${a}x) · (${b}x) ισούται με:`,
      promptEn: `The product (${a}x) · (${b}x) equals:`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctNode,
      correctTextEn: correctNode,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Πολλαπλασιάζουμε τους συντελεστές και τις μεταβλητές: ({a} · {bFmt}) · (x · x) ＝</span>
          {correctNode}
          <span>.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>({a} · {bFmt}) · (x · x) ＝</span>
          {correctNode}
          <span>.</span>
        </span>
      ),
    });
  }

  // Q3 (MCQ): Απλή επιμεριστική ιδιότητα με θετικό συντελεστή α(βx + γ)
  {
    const a = pickRandom([3, 4, 5]);
    const b = pickRandom([2, 3]);
    const c = pickRandom([-4, -2, 3, 5]);
    const resA = a * b;
    const resB = a * c;
    const correctLabel = fmtLin(resA, resB);
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: fmtLin(resA, c), labelEn: fmtLin(resA, c) },
      { key: 'w2', labelEl: fmtLin(a + b, resB), labelEn: fmtLin(a + b, resB) },
      { key: 'w3', labelEl: fmtLin(resA, -resB), labelEn: fmtLin(resA, -resB) },
      { key: 'w4', labelEl: `${resA + resB}x`, labelEn: `${resA + resB}x` },
    ];
    const innerStr = c > 0 ? `${b}x ＋ ${c}` : `${b}x － ${Math.abs(c)}`;
    questions.push({
      id: 3,
      type: 'mcq',
      promptEl: `Εφαρμόστε την επιμεριστική ιδιότητα: ${a}(${innerStr})`,
      promptEn: `Apply the distributive property: ${a}(${innerStr})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `${a} · (${b}x) ＋ ${a} · (${c}) ＝ ${correctLabel}.`,
      explanationEn: `${a} · (${b}x) ＋ ${a} · (${c}) ＝ ${correctLabel}.`,
    });
  }

  // Q4 (MCQ): Επιμεριστική ιδιότητα με αρνητικό συντελεστή -α(βx - γ)
  {
    const a = pickRandom([-2, -3, -4]);
    const b = pickRandom([2, 3, 4]);
    const c = pickRandom([3, 4, 5]);
    const resA = a * b;
    const resB = a * (-c); // θετικό!
    const correctLabel = fmtLin(resA, resB);
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: fmtLin(resA, -resB), labelEn: fmtLin(resA, -resB) },
      { key: 'w2', labelEl: fmtLin(-resA, resB), labelEn: fmtLin(-resA, resB) },
      { key: 'w3', labelEl: fmtLin(resA, -c), labelEn: fmtLin(resA, -c) },
      { key: 'w4', labelEl: fmtLin(-resA, -resB), labelEn: fmtLin(-resA, -resB) },
    ];
    questions.push({
      id: 4,
      type: 'mcq',
      promptEl: `Αναπτύξτε την παράσταση: ${a}(${b}x － ${c})`,
      promptEn: `Expand the expression: ${a}(${b}x － ${c})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `(${a}) · (${b}x) ＋ (${a}) · (-${c}) ＝ ${resA}x ＋ ${resB} ＝ ${correctLabel}.`,
      explanationEn: `(${a}) · (${b}x) ＋ (${a}) · (-${c}) ＝ ${correctLabel}.`,
    });
  }

  // Q5 (MCQ): Επιμεριστική ιδιότητα με μεταβλητή απ' έξω: x(αx + β)
  {
    const a = pickRandom([2, 3, 4, 5]);
    const b = pickRandom([-4, -3, 2, 6]);
    const bStr = b > 0 ? `＋ ${b}` : `－ ${Math.abs(b)}`;
    const correctNode = (
      <span className="inline-flex items-baseline gap-1">
        <span>{a}</span>
        <Pow base="x" exp="2" />
        <span>{b > 0 ? `＋ ${b}x` : `－ ${Math.abs(b)}x`}</span>
      </span>
    );
    const correctOpt = { key: 'corr', labelEl: correctNode, labelEn: correctNode };
    const distractors = [
      { key: 'w1', labelEl: `${a}x ${bStr}`, labelEn: `${a}x ${bStr}` },
      {
        key: 'w2',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>{bStr}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>{bStr}</span></span>,
      },
      {
        key: 'w3',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{a + b}</span><Pow base="x" exp="3" /></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{a + b}</span><Pow base="x" exp="3" /></span>,
      },
      {
        key: 'w4',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>{b > 0 ? `－ ${b}x` : `＋ ${Math.abs(b)}x`}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>{a}</span><Pow base="x" exp="2" /><span>{b > 0 ? `－ ${b}x` : `＋ ${Math.abs(b)}x`}</span></span>,
      },
    ];
    questions.push({
      id: 5,
      type: 'mcq',
      promptEl: `Εφαρμόστε την επιμεριστική ιδιότητα: x(${a}x ${bStr})`,
      promptEn: `Apply the distributive property: x(${a}x ${bStr})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctNode,
      correctTextEn: correctNode,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>x · ({a}x) ＋ x · ({b}) ＝ {a}</span>
          <Pow base="x" exp="2" />
          <span>{b > 0 ? `＋ ${b}x` : `－ ${Math.abs(b)}x`}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>x · ({a}x) ＋ x · ({b}) ＝ {a}</span>
          <Pow base="x" exp="2" />
          <span>{b > 0 ? `＋ ${b}x` : `－ ${Math.abs(b)}x`}.</span>
        </span>
      ),
    });
  }

  // Q6 (MCQ): Επιμεριστική με ρητό (κλάσμα) συντελεστή
  {
    const den = pickRandom([2, 3, 4]);
    const m1 = pickRandom([2, 3]);
    const m2 = pickRandom([1, 2, 4]);
    const b1 = den * m1;
    const c1 = den * m2;
    const correctLabel = fmtLin(m1, m2);
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: fmtLin(b1, c1), labelEn: fmtLin(b1, c1) },
      { key: 'w2', labelEl: fmtLin(m1, c1), labelEn: fmtLin(m1, c1) },
      { key: 'w3', labelEl: fmtLin(b1, m2), labelEn: fmtLin(b1, m2) },
      { key: 'w4', labelEl: fmtLin(m1 + 1, m2 + 1), labelEn: fmtLin(m1 + 1, m2 + 1) },
    ];
    questions.push({
      id: 6,
      type: 'mcq',
      promptEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Απλοποιήστε την παράσταση:</span>
          <Frac num="1" den={String(den)} />
          <span>({b1}x ＋ {c1})</span>
        </span>
      ),
      promptEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Simplify the expression:</span>
          <Frac num="1" den={String(den)} />
          <span>({b1}x ＋ {c1})</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Frac num="1" den={String(den)} />
          <span>· {b1}x ＋</span>
          <Frac num="1" den={String(den)} />
          <span>· {c1} ＝ {correctLabel}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Frac num="1" den={String(den)} />
          <span>· {b1}x ＋</span>
          <Frac num="1" den={String(den)} />
          <span>· {c1} ＝ {correctLabel}.</span>
        </span>
      ),
    });
  }

  // Q7 (MCQ): Συνδυασμός δύο παρενθέσεων + αναγωγή: α(x + β) - γ(x - δ)
  {
    const a = pickRandom([4, 5, 6]);
    const b = pickRandom([2, 3]);
    const g = pickRandom([2, 3]);
    const d = pickRandom([1, 2, 4]);
    const resX = a - g;
    const resC = a * b + g * d;
    const correctLabel = fmtLin(resX, resC);
    const correctOpt = { key: 'corr', labelEl: correctLabel, labelEn: correctLabel };
    const distractors = [
      { key: 'w1', labelEl: fmtLin(resX, a * b - g * d), labelEn: fmtLin(resX, a * b - g * d) },
      { key: 'w2', labelEl: fmtLin(a + g, resC), labelEn: fmtLin(a + g, resC) },
      { key: 'w3', labelEl: fmtLin(resX, b + d), labelEn: fmtLin(resX, b + d) },
      { key: 'w4', labelEl: fmtLin(resX, -resC), labelEn: fmtLin(resX, -resC) },
    ];
    questions.push({
      id: 7,
      type: 'mcq',
      promptEl: `Απαλείψτε τις παρενθέσεις και κάντε αναγωγή: ${a}(x ＋ ${b}) － ${g}(x － ${d})`,
      promptEn: `Expand parentheses and combine like terms: ${a}(x ＋ ${b}) － ${g}(x － ${d})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `${a}x ＋ ${a * b} － ${g}x ＋ ${g * d} ＝ (${a} － ${g})x ＋ (${a * b} ＋ ${g * d}) ＝ ${correctLabel}.`,
      explanationEn: `${a}x ＋ ${a * b} － ${g}x ＋ ${g * d} ＝ ${correctLabel}.`,
    });
  }

  // Q8 (MCQ): Διπλή επιμεριστική ιδιότητα (x + α)(x + β) με θετικούς αριθμούς
  {
    const a = pickRandom([2, 3, 4]);
    const b = pickRandom([3, 5, 6]);
    const sum = a + b;
    const prod = a * b;
    const correctNode = (
      <span className="inline-flex items-baseline gap-1">
        <Pow base="x" exp="2" />
        <span>＋ {sum}x ＋ {prod}</span>
      </span>
    );
    const correctOpt = { key: 'corr', labelEl: correctNode, labelEn: correctNode };
    const distractors = [
      {
        key: 'w1',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {prod}</span></span>,
      },
      {
        key: 'w2',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {prod}x ＋ {sum}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {prod}x ＋ {sum}</span></span>,
      },
      {
        key: 'w3',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {sum}x ＋ {sum}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {sum}x ＋ {sum}</span></span>,
      },
      {
        key: 'w4',
        labelEl: <span className="inline-flex items-baseline gap-1"><span>2</span><Pow base="x" exp="2" /><span>＋ {sum}x ＋ {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><span>2</span><Pow base="x" exp="2" /><span>＋ {sum}x ＋ {prod}</span></span>,
      },
    ];
    questions.push({
      id: 8,
      type: 'mcq',
      promptEl: `Εφαρμόστε τη διπλή επιμεριστική ιδιότητα: (x ＋ ${a})(x ＋ ${b})`,
      promptEn: `Apply the double distributive property: (x ＋ ${a})(x ＋ ${b})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctNode,
      correctTextEn: correctNode,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>x·x ＋ {b}x ＋ {a}x ＋ {a}·{b} ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {sum}x ＋ {prod}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <Pow base="x" exp="2" />
          <span>＋ {b}x ＋ {a}x ＋ {prod} ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {sum}x ＋ {prod}.</span>
        </span>
      ),
    });
  }

  // Q9 (MCQ): Διπλή επιμεριστική με πρόσημα + και - : (x + α)(x - β)
  {
    const a = pickRandom([4, 5, 6]);
    const b = pickRandom([2, 3]);
    const diff = a - b;
    const prod = a * b;
    const correctNode = (
      <span className="inline-flex items-baseline gap-1">
        <Pow base="x" exp="2" />
        <span>＋ {diff}x － {prod}</span>
      </span>
    );
    const correctOpt = { key: 'corr', labelEl: correctNode, labelEn: correctNode };
    const distractors = [
      {
        key: 'w1',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {diff}x ＋ {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {diff}x ＋ {prod}</span></span>,
      },
      {
        key: 'w2',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>－ {diff}x － {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>－ {diff}x － {prod}</span></span>,
      },
      {
        key: 'w3',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {a + b}x － {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>＋ {a + b}x － {prod}</span></span>,
      },
      {
        key: 'w4',
        labelEl: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>－ {prod}</span></span>,
        labelEn: <span className="inline-flex items-baseline gap-1"><Pow base="x" exp="2" /><span>－ {prod}</span></span>,
      },
    ];
    questions.push({
      id: 9,
      type: 'mcq',
      promptEl: `Αναπτύξτε με τη διπλή επιμεριστική ιδιότητα: (x ＋ ${a})(x － ${b})`,
      promptEn: `Expand using the double distributive property: (x ＋ ${a})(x － ${b})`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'corr',
      correctTextEl: correctNode,
      correctTextEn: correctNode,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <Pow base="x" exp="2" />
          <span>－ {b}x ＋ {a}x － {prod} ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {diff}x － {prod}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <Pow base="x" exp="2" />
          <span>－ {b}x ＋ {a}x － {prod} ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {diff}x － {prod}.</span>
        </span>
      ),
    });
  }

  // Q10 (Input): Υπολογισμός συντελεστή του x στο γινόμενο (αx + β)(γx + δ)
  {
    const a = pickRandom([2, 3]);
    const b = pickRandom([2, 4, 5]);
    const g = pickRandom([2, 3]);
    const d = pickRandom([1, 3]);
    const midCoef = a * d + b * g;
    questions.push({
      id: 10,
      type: 'input',
      promptEl: `Όταν αναπτύξουμε το γινόμενο (${a}x ＋ ${b})(${g}x ＋ ${d}) και κάνουμε αναγωγή ομοίων όρων, ποιος είναι ο συντελεστής του x;`,
      promptEn: `When we expand (${a}x ＋ ${b})(${g}x ＋ ${d}) and combine like terms, what is the coefficient of x?`,
      correct: String(midCoef),
      correctTextEl: String(midCoef),
      correctTextEn: String(midCoef),
      explanationEl: `Οι όροι 1ου βαθμού είναι (${a}x)·${d} ＋ ${b}·(${g}x) ＝ ${a * d}x ＋ ${b * g}x ＝ ${midCoef}x, άρα συντελεστής ${midCoef}.`,
      explanationEn: `The linear terms are (${a}x)·${d} ＋ ${b}·(${g}x) ＝ ${midCoef}x, so coefficient ${midCoef}.`,
    });
  }

  // Q11 (Input): Εύρεση αριθμητικής τιμής μετά από απλοποίηση
  {
    const k = pickRandom([3, 4, 5]);
    const xVal = pickRandom([3, 4, 5, 6]);
    const ans = xVal + 2 * k;
    questions.push({
      id: 11,
      type: 'input',
      promptEl: `Απλοποιήστε την παράσταση Π ＝ 3(x ＋ ${k}) － (2x ＋ ${k}) και υπολογίστε την τιμή της για x ＝ ${xVal}:`,
      promptEn: `Simplify Π ＝ 3(x ＋ ${k}) － (2x ＋ ${k}) and find its value for x ＝ ${xVal}:`,
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: `Π ＝ 3x ＋ ${3 * k} － 2x － ${k} ＝ x ＋ ${2 * k}. Για x ＝ ${xVal} έχουμε Π ＝ ${xVal} ＋ ${2 * k} ＝ ${ans}.`,
      explanationEn: `Π ＝ x ＋ ${2 * k}. For x ＝ ${xVal}, Π ＝ ${xVal} ＋ ${2 * k} ＝ ${ans}.`,
    });
  }

  // Q12 (Input - Συνδυαστικό πρόβλημα διπλής επιμεριστικής & εμβαδού ορθογωνίου με διάγραμμα & tableData)
  {
    const a = pickRandom([3, 4, 5]);
    const b = pickRandom([2, 3]);
    const xVal = pickRandom([4, 5, 6]);
    const areaVal = (xVal + a) * (xVal + b);

    questions.push({
      id: 12,
      type: 'input',
      unitEl: 'm²',
      unitEn: 'm²',
      promptEl: `Ένα ορθογώνιο δωμάτιο έχει μήκος x ＋ ${a} μέτρα και πλάτος x ＋ ${b} μέτρα. Αφού βρείτε το εμβαδόν του Ε με τη διπλή επιμεριστική ιδιότητα, υπολογίστε πόσα m² είναι το εμβαδόν όταν x ＝ ${xVal}:`,
      promptEn: `A rectangular room has length x ＋ ${a} meters and width x ＋ ${b} meters. After finding its area Ε using the double distributive property, calculate the area in m² when x ＝ ${xVal}:`,
      correct: String(areaVal),
      correctTextEl: `${areaVal} m²`,
      correctTextEn: `${areaVal} m²`,
      explanationEl: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Ε ＝ (x ＋ {a})(x ＋ {b}) ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {a + b}x ＋ {a * b}. Για x ＝ {xVal}: Ε ＝ {xVal * xVal} ＋ {(a + b) * xVal} ＋ {a * b} ＝ {areaVal} m².</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-baseline gap-1">
          <span>Ε ＝</span>
          <Pow base="x" exp="2" />
          <span>＋ {a + b}x ＋ {a * b}. For x ＝ {xVal}, Ε ＝ {areaVal} m².</span>
        </span>
      ),
      tableData: [
        {
          stepEl: '1. Διπλή επιμεριστική ιδιότητα',
          stepEn: '1. Double distributive property',
          calc: (
            <span className="inline-flex flex-wrap items-baseline gap-1">
              <span>Ε ＝ (x ＋ {a})(x ＋ {b}) ＝</span>
              <Pow base="x" exp="2" />
              <span>＋ {b}x ＋ {a}x ＋ {a * b} ＝</span>
              <Pow base="x" exp="2" />
              <span>＋ {a + b}x ＋ {a * b}</span>
            </span>
          ),
        },
        {
          stepEl: `2. Αριθμητική τιμή (x ＝ ${xVal})`,
          stepEn: `2. Numerical value (x ＝ ${xVal})`,
          calc: (
            <span className="inline-flex flex-wrap items-baseline gap-1">
              <span>Ε ＝</span>
              <Pow base={String(xVal)} exp="2" />
              <span>＋ {a + b}·{xVal} ＋ {a * b} ＝ {xVal * xVal} ＋ {(a + b) * xVal} ＋ {a * b} ＝ {areaVal} m²</span>
            </span>
          ),
        },
      ],
      renderFeedbackDiagram: () => (
        <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-3">
          <svg viewBox="0 0 300 165" className="w-full h-auto max-w-full block">
            <rect x="40" y="24" width="110" height="65" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.8" />
            <text x="95" y="61" textAnchor="middle" fontSize="12" fontWeight="900" fill="#312e81" fontFamily="monospace">x²</text>

            <rect x="150" y="24" width="75" height="65" fill="#ecfdf5" stroke="#059669" strokeWidth="1.8" />
            <text x="187" y="61" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#065f46" fontFamily="monospace">{a}x</text>

            <rect x="40" y="89" width="110" height="45" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
            <text x="95" y="116" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#92400e" fontFamily="monospace">{b}x</text>

            <rect x="150" y="89" width="75" height="45" fill="#f3e8ff" stroke="#7c3aed" strokeWidth="1.8" />
            <text x="187" y="116" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#5b21b6" fontFamily="monospace">{a * b}</text>

            <text x="132" y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="monospace">
              Ε ＝ x² ＋ {a + b}x ＋ {a * b}
            </text>
          </svg>
        </div>
      ),
    });
  }

  return questions;
}

export default function EpimeristikiIdiotitaExercisesPage() {
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
    ? 'Chapter 9 Exercises: Distributive & Double Distributive Property | Grade 8'
    : "Ασκήσεις Κεφαλαίου 9: Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/10-epimeristiki-idiotita"
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
                  isEn ? 'CHAPTER 9 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 9 • Β' ΓΥΜΝΑΣΙΟΥ"
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {isEn
                ? 'Exercises: Distributive & Double Distributive Property'
                : 'Ασκήσεις: Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα'}
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