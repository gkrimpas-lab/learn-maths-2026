import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = String(str).split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function extractPlainText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join(' ');
  if (React.isValidElement(node)) {
    return extractPlainText(node.props?.children);
  }
  return '';
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
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Frac({ num, den, small = false, className = '' }) {
  return (
    <span
      className={`inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center whitespace-nowrap align-middle font-mono ${
        small ? 'text-[0.8em] mx-0.5' : 'text-[0.86em] mx-1'
      } leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="px-1 pb-0.5 whitespace-nowrap font-semibold">{num}</span>
      <span className="w-full border-t border-current leading-none" />
      <span className="px-1 pt-0.5 whitespace-nowrap font-semibold">{den}</span>
    </span>
  );
}

function ComplexFrac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center whitespace-nowrap align-middle font-mono text-[0.9em] mx-1.5 leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="px-1.5 pb-0.5 whitespace-nowrap font-semibold">{num}</span>
      <span className="w-full border-t-[2.4px] border-current leading-none" />
      <span className="px-1.5 pt-0.5 whitespace-nowrap font-semibold">{den}</span>
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

function sanitizeInput(val = '') {
  return String(val)
    .trim()
    .replace(',', '.')
    .replace(/[^0-9.\-]/g, '');
}

function parseNumericAnswer(val) {
  const cleaned = sanitizeInput(val);
  if (!cleaned || cleaned === '-' || cleaned === '.') return NaN;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : NaN;
}

function ensureFourUniqueOptions(correctOption, distractors) {
  const out = [correctOption];
  const seen = new Set([extractPlainText(correctOption.label).trim()]);
  for (const item of distractors) {
    const key = extractPlainText(item.label).trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
    if (out.length === 4) break;
  }
  let idx = 1;
  while (out.length < 4) {
    const fallback = `${idx * 3 + 2}`;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      out.push({ id: `fb_${idx}`, label: <span className="font-mono">x ＝ {fallback}</span> });
    }
    idx += 1;
  }
  return out.sort(() => Math.random() - 0.5);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcdInt(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function fmtSigned(val) {
  return val >= 0 ? `＋ ${val}` : `－ ${Math.abs(val)}`;
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Ιδιότητες Ισότητας & Ισοδύναμες Εξισώσεις | Κεφ. 11 | Β' Γυμνασίου",
    metaDesc:
      "12 δυναμικές ασκήσεις (με 5+ παραλλαγές ανά άσκηση) στη Β' Γυμνασίου για τις ιδιότητες διατήρησης ισότητας, ισοδύναμες εξισώσεις και το πλήθος λύσεων.",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 11 • Β' ΓΥΜΝΑΣΙΟΥ",
    backText: "Θεωρία",
    title: "Ασκήσεις: Ιδιότητες Ισότητας, Ισοδύναμες Εξισώσεις & Πλήθος Λύσεων",
    subtitle:
      "Λύσε τις 12 ασκήσεις και πάτησε «Έλεγχος» στη μπάρα στο κάτω μέρος για βαθμολογία και αναλυτική λύση.",
    newBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Αριθμός...",
    correctPrefix: "Σωστή απάντηση:",
    wrongPrefix: "Χρειάζεται προσοχή. Σωστή απάντηση:",
    solHeading: "Αναλυτική Λύση",
    colStep: "Βήμα",
    colOp: "Ενέργεια",
    colRes: "Αποτέλεσμα",
    diagramAria: "Διάγραμμα ισοδύναμων εξισώσεων",
    answeredLabel: "Απαντήθηκαν",
    checkBtn: "ΕΛΕΓΧΟΣ",
    scoreLabel: "Βαθμολογία",
  },
  en: {
    pageTitle: "Exercises: Properties of Equality & Equivalent Equations | Ch. 11 | 8th Grade",
    metaDesc:
      "12 dynamic Grade 8 exercises (5+ variants each) on properties of equality, equivalent equations, and number of solutions.",
    chapterBadge: "CHAPTER 11 • 8TH GRADE",
    backText: "Theory",
    title: "Exercises: Properties of Equality, Equivalent Equations & Solution Cases",
    subtitle:
      "Solve all 12 exercises and press 'Check' in the bottom bar for your score and step-by-step solutions.",
    newBtn: "NEW EXERCISES",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Number...",
    correctPrefix: "Correct answer:",
    wrongPrefix: "Needs review. Correct answer:",
    solHeading: "Step-by-Step Solution",
    colStep: "Step",
    colOp: "Action",
    colRes: "Result",
    diagramAria: "Equivalent equations diagram",
    answeredLabel: "Answered",
    checkBtn: "CHECK",
    scoreLabel: "Score",
  },
};

function buildQuestions(locale) {
  const isEn = locale === 'en';
  const list = [];

  // =========================================================================
  // Q1 (input) — 5 παραλλαγές εξισώσεων με αγνώστους και στα δύο μέλη
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const c = randInt(1, 4);
      const diffA = randInt(2, 5);
      const a = c + diffA;
      const x = randInt(2, 9);
      const b = randInt(2, 9);
      const d = a * x + b - c * x;
      const rhs = `${c}x ${fmtSigned(d)}`;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x ＋ {b} ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${c}x and ${b} from both sides: ${diffA}x ＝ ${d - b} ⇔ x ＝ ${x}.`
          : `Αφαιρούμε ${c}x και ${b} από τα δύο μέλη: ${diffA}x ＝ ${d - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${c}x and ${b}` : `Αφαιρούμε ${c}x και ${b}`, res: `${diffA}x ＝ ${d - b}` },
          { step: '2', op: isEn ? `Divide by ${diffA}` : `Διαιρούμε με ${diffA}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x＋${b}`, mid: rhs, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const c = randInt(1, 3);
      const diffA = randInt(2, 5);
      const a = c + diffA;
      const x = -randInt(2, 7);
      const b = randInt(3, 10);
      const d = a * x - b - c * x;
      const rhs = `${c}x ${fmtSigned(d)}`;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x － {b} ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${c}x and add ${b} to both sides: ${diffA}x ＝ ${d + b} ⇔ x ＝ ${x}.`
          : `Αφαιρούμε ${c}x και προσθέτουμε ${b} στα δύο μέλη: ${diffA}x ＝ ${d + b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${c}x and add ${b}` : `Αφαιρούμε ${c}x και προσθέτουμε ${b}`, res: `${diffA}x ＝ ${d + b}` },
          { step: '2', op: isEn ? `Divide by ${diffA}` : `Διαιρούμε με ${diffA}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x－${b}`, mid: rhs, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const a = randInt(3, 6);
      const c = randInt(1, 2);
      const x = randInt(3, 8);
      const b = randInt(4, 12);
      const d = b + a * x - c * x;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} ＋ {a}x ＝ {d} ＋ {c}x</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${c}x and ${b} from both sides: ${a - c}x ＝ ${d - b} ⇔ x ＝ ${x}.`
          : `Αφαιρούμε ${c}x και ${b} από τα δύο μέλη: ${a - c}x ＝ ${d - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${c}x and ${b}` : `Αφαιρούμε ${c}x και ${b}`, res: `${a - c}x ＝ ${d - b}` },
          { step: '2', op: isEn ? `Divide by ${a - c}` : `Διαιρούμε με ${a - c}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b}＋${a}x`, mid: `${d}＋${c}x`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 4);
      const k = randInt(2, 3);
      const e = randInt(1, 2);
      const x = randInt(2, 8);
      const b = randInt(2, 7);
      const d = (a + k - e) * x + b;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x ＋ {k}x ＋ {b} ＝ {e}x ＋ {d}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Combine like terms: ${a + k}x ＋ ${b} ＝ ${e}x ＋ ${d} ⇔ ${a + k - e}x ＝ ${d - b} ⇔ x ＝ ${x}.`
          : `Αναγωγή: ${a + k}x ＋ ${b} ＝ ${e}x ＋ ${d} ⇔ ${a + k - e}x ＝ ${d - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? 'Simplify & isolate x' : 'Απλοποίηση & απομόνωση x', res: `${a + k - e}x ＝ ${d - b}` },
          { step: '2', op: isEn ? `Divide by ${a + k - e}` : `Διαιρούμε με ${a + k - e}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a + k}x＋${b}`, mid: `${e}x＋${d}`, right: `x ＝ ${x}` },
      });
    } else {
      const a = randInt(2, 5);
      const c = a + randInt(2, 4);
      const x = randInt(2, 8);
      const b = randInt(5, 14);
      const d = b - a * x + c * x;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} － {a}x ＝ {d} － {c}x</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Add ${c}x and subtract ${b} on both sides: ${c - a}x ＝ ${d - b} ⇔ x ＝ ${x}.`
          : `Προσθέτουμε ${c}x και αφαιρούμε ${b} στα δύο μέλη: ${c - a}x ＝ ${d - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${c}x, subtract ${b}` : `Προσθέτουμε ${c}x, αφαιρούμε ${b}`, res: `${c - a}x ＝ ${d - b}` },
          { step: '2', op: isEn ? `Divide by ${c - a}` : `Διαιρούμε με ${c - a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b}－${a}x`, mid: `${d}－${c}x`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q2 (tf) — 5 παραλλαγές Σωστό/Λάθος για ισοδύναμες εξισώσεις
  // =========================================================================
  {
    const v = randInt(1, 5);
    const isTrue = Math.random() > 0.5;
    if (v === 1) {
      const x = randInt(2, 7);
      const eq1 = `2x ＋ 4 ＝ ${2 * x + 4}`;
      const eq2 = isTrue ? `x － 1 ＝ ${x - 1}` : `x － 1 ＝ ${x + 2}`;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False: The equations are equivalent:' : 'Σωστό ή Λάθος: Οι εξισώσεις είναι ισοδύναμες:'}</span>
            <span className="font-mono">{eq1} &nbsp;|&nbsp; {eq2}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `The first gives x ＝ ${x}. The second gives x ＝ ${isTrue ? x : x + 3}.`
          : `Η πρώτη έχει λύση x ＝ ${x} και η δεύτερη x ＝ ${isTrue ? x : x + 3}.`,
        tableData: [
          { step: '1', op: eq1, res: `x ＝ ${x}` },
          { step: '2', op: eq2, res: `x ＝ ${isTrue ? x : x + 3}` },
        ],
        diagram: { left: `x ＝ ${x}`, mid: `x ＝ ${isTrue ? x : x + 3}`, right: isTrue ? '⇔' : '≠' },
      });
    } else if (v === 2) {
      const k = randInt(2, 5);
      const eq1 = '3x ＝ 12';
      const eq2 = isTrue ? `${3 * k}x ＝ ${12 * k}` : `${3 * k}x ＝ 12`;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False: The equations are equivalent:' : 'Σωστό ή Λάθος: Οι εξισώσεις είναι ισοδύναμες:'}</span>
            <span className="font-mono">{eq1} &nbsp;|&nbsp; {eq2}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? isTrue ? `Both sides were multiplied by ${k}.` : `Only the left side was multiplied by ${k}.`
          : isTrue ? `Πολλαπλασιάστηκαν και τα δύο μέλη με ${k}.` : `Πολλαπλασιάστηκε μόνο το αριστερό μέλος με ${k}.`,
        tableData: [
          { step: '1', op: eq1, res: 'x ＝ 4' },
          { step: '2', op: eq2, res: isTrue ? 'x ＝ 4' : `x ≠ 4` },
        ],
        diagram: { left: eq1, mid: eq2, right: isTrue ? '⇔' : '≠' },
      });
    } else if (v === 3) {
      const k = randInt(2, 4);
      const eq1 = `-2x ＝ 10`;
      const eq2 = isTrue ? `${2 * k}x ＝ ${-10 * k}` : `${2 * k}x ＝ ${10 * k}`;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False: The equations are equivalent:' : 'Σωστό ή Λάθος: Οι εξισώσεις είναι ισοδύναμες:'}</span>
            <span className="font-mono">{eq1} &nbsp;|&nbsp; {eq2}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `The first gives x ＝ -5. The second gives x ＝ ${isTrue ? -5 : 5}.`
          : `Η πρώτη δίνει x ＝ -5, ενώ η δεύτερη δίνει x ＝ ${isTrue ? -5 : 5}.`,
        tableData: [
          { step: '1', op: eq1, res: 'x ＝ -5' },
          { step: '2', op: eq2, res: `x ＝ ${isTrue ? -5 : 5}` },
        ],
        diagram: { left: 'x ＝ -5', mid: `x ＝ ${isTrue ? -5 : 5}`, right: isTrue ? '⇔' : '≠' },
      });
    } else if (v === 4) {
      const b = randInt(3, 8);
      const eq1 = 'x ＋ 2 ＝ 7';
      const eq2 = isTrue ? `x ＋ ${2 + b} ＝ ${7 + b}` : `x ＋ ${2 + b} ＝ 7`;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False: The equations are equivalent:' : 'Σωστό ή Λάθος: Οι εξισώσεις είναι ισοδύναμες:'}</span>
            <span className="font-mono">{eq1} &nbsp;|&nbsp; {eq2}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? isTrue ? `Adding ${b} to both sides preserves equivalence.` : `Adding ${b} only to the left side changes the solution.`
          : isTrue ? `Προστέθηκε το ${b} και στα δύο μέλη, άρα είναι ισοδύναμες.` : `Προστέθηκε το ${b} μόνο αριστερά, άρα δεν είναι ισοδύναμες.`,
        tableData: [
          { step: '1', op: eq1, res: 'x ＝ 5' },
          { step: '2', op: eq2, res: isTrue ? 'x ＝ 5' : `x ＝ ${5 - b}` },
        ],
        diagram: { left: eq1, mid: eq2, right: isTrue ? '⇔' : '≠' },
      });
    } else {
      const eq1 = '0 · x ＝ 0';
      const eq2 = isTrue ? '2(x ＋ 1) ＝ 2x ＋ 2' : '0 · x ＝ 5';
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False: The equations are equivalent:' : 'Σωστό ή Λάθος: Οι εξισώσεις είναι ισοδύναμες:'}</span>
            <span className="font-mono">{eq1} &nbsp;|&nbsp; {eq2}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? isTrue ? 'Both are identities with infinitely many solutions.' : '0·x ＝ 0 has infinitely many solutions, while 0·x ＝ 5 has none.'
          : isTrue ? 'Και οι δύο είναι ταυτότητες με άπειρες λύσεις.' : 'Η 0·x ＝ 0 έχει άπειρες λύσεις, ενώ η 0·x ＝ 5 είναι αδύνατη.',
        tableData: [
          { step: '1', op: eq1, res: isEn ? 'Infinitely many' : 'Άπειρες' },
          { step: '2', op: eq2, res: isTrue ? (isEn ? 'Infinitely many' : 'Άπειρες') : (isEn ? 'No solution' : 'Καμία') },
        ],
        diagram: { left: '0·x ＝ 0', mid: eq2, right: isTrue ? '⇔' : '≠' },
      });
    }
  }

  // =========================================================================
  // Q3 (mcq) — 5 παραλλαγές: Μία λύση, άπειρες λύσεις ή καμία λύση;
  // =========================================================================
  {
    const v = randInt(1, 5);
    const optUnique = { id: 'unique', label: <span>{isEn ? 'Unique solution' : 'Μία μοναδική λύση'}</span> };
    const optInf = { id: 'inf', label: <span>{isEn ? 'Infinitely many solutions (Identity)' : 'Άπειρες λύσεις (Ταυτότητα)'}</span> };
    const optNone = { id: 'none', label: <span>{isEn ? 'No solution (Impossible)' : 'Καμία λύση (Αδύνατη)'}</span> };
    const optZero = { id: 'zero', label: <span>{isEn ? 'Only x ＝ 0' : 'Μόνο το x ＝ 0'}</span> };

    let exprStr = '';
    let correctId = 'inf';
    let reduced = '';
    if (v === 1) {
      const k = randInt(2, 5);
      const b = randInt(2, 6);
      exprStr = `${k}(x ＋ ${b}) ＝ ${k}x ＋ ${k * b}`;
      correctId = 'inf';
      reduced = '0 · x ＝ 0';
    } else if (v === 2) {
      const k = randInt(2, 5);
      const b = randInt(2, 5);
      exprStr = `${k}(x － ${b}) ＝ ${k}x ＋ ${b}`;
      correctId = 'none';
      reduced = `0 · x ＝ ${b + k * b}`;
    } else if (v === 3) {
      const a = randInt(3, 6);
      const b = randInt(2, 7);
      exprStr = `${a}x ＋ ${b} ＝ ${a - 2}x ＋ ${b + 4}`;
      correctId = 'unique';
      reduced = '2x ＝ 4';
    } else if (v === 4) {
      const a = randInt(4, 7);
      exprStr = `${a}x － 5 ＝ ${a}x ＋ 3`;
      correctId = 'none';
      reduced = '0 · x ＝ 8';
    } else {
      const k = randInt(2, 4);
      const b = randInt(2, 5);
      exprStr = `${k}(x ＋ ${b}) － ${k}x ＝ ${k * b}`;
      correctId = 'inf';
      reduced = '0 · x ＝ 0';
    }

    const correctObj = correctId === 'inf' ? optInf : correctId === 'none' ? optNone : optUnique;
    list.push({
      id: 'q3',
      type: 'mcq',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{isEn ? 'How many solutions does the equation have:' : 'Πόσες λύσεις έχει η εξίσωση:'}</span>
          <span className="font-mono">{exprStr}</span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctObj, [optUnique, optInf, optNone, optZero]),
      correctId,
      correctDisplay: correctObj.label,
      explanation: isEn
        ? `Reducing both sides yields ${reduced}.`
        : `Με ιδιότητες ισότητας η εξίσωση γίνεται ${reduced}.`,
      tableData: [{ step: '1', op: isEn ? 'Simplify both sides' : 'Απλοποίηση δύο μελών', res: reduced }],
      diagram: { left: exprStr, mid: reduced, right: correctId === 'inf' ? '∞' : correctId === 'none' ? '∅' : '1' },
    });
  }

  // =========================================================================
  // Q4 (input) — 5 παραλλαγές με αρνητικές / προσημασμένες λύσεις
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const a = randInt(2, 6);
      const x = -randInt(2, 9);
      const b = randInt(3, 12);
      const c = a * x + b;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x ＋ {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `${a}x ＝ ${c - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x＋${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const a = randInt(2, 5);
      const x = -randInt(2, 8);
      const b = randInt(2, 9);
      const c = -a * x + b;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">-{a}x ＋ {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `-${a}x ＝ ${c - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `-${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `-${a}x＋${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const a = randInt(2, 5);
      const x = randInt(3, 9);
      const b = randInt(2, 8);
      const c = b - a * x;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} － {a}x ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `-${a}x ＝ ${c - b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `-${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b}－${a}x`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 5);
      const x = -randInt(2, 7);
      const b = randInt(1, 5);
      const c = a * (x - b);
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x － {b}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `x － ${b} ＝ ${c / a} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x － ${b} ＝ ${c / a}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(x－${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else {
      const a = randInt(3, 6);
      const x = -randInt(2, 6);
      const b = randInt(2, 8);
      const c = a * x - b;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x － {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `${a}x ＝ ${c + b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `${a}x ＝ ${c + b}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x－${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q5 (mcq) — 5 παραλλαγές με κλασματικές λύσεις
  // =========================================================================
  {
    const v = randInt(1, 5);
    const diffA = randInt(3, 6);
    const c = randInt(1, 2);
    const a = c + diffA;
    const b = randInt(2, 8);
    const d = v % 2 === 0 ? randInt(-6, 1) : randInt(1, 6);
    const rhsDiff = d - b;
    const g = gcdInt(rhsDiff, diffA);
    const sign = rhsDiff < 0 ? -1 : 1;
    const n = sign * (Math.abs(rhsDiff) / g);
    const den = diffA / g;
    const correctOpt = {
      id: 'ok',
      label:
        den === 1 ? (
          <span className="font-mono">x ＝ {n}</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={n} den={den} small />
          </span>
        ),
    };
    const distractors = [
      { id: 'd1', label: <span className="font-mono">x ＝ {-n}</span> },
      {
        id: 'd2',
        label: (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={den} den={Math.max(1, Math.abs(n))} small />
          </span>
        ),
      },
      { id: 'd3', label: <span className="font-mono">x ＝ {rhsDiff}</span> },
    ];

    const leftExpr = v <= 3 ? `${a}x ＋ ${b}` : `${a}x － ${b}`;
    const effRhsDiff = v <= 3 ? d - b : d + b;
    const gEff = gcdInt(effRhsDiff, diffA);
    const signEff = effRhsDiff < 0 ? -1 : 1;
    const nEff = signEff * (Math.abs(effRhsDiff) / gEff);
    const denEff = diffA / gEff;
    const finalCorrect = {
      id: 'ok',
      label:
        denEff === 1 ? (
          <span className="font-mono">x ＝ {nEff}</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={nEff} den={denEff} small />
          </span>
        ),
    };

    list.push({
      id: 'q5',
      type: 'mcq',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
          <span className="font-mono">
            {leftExpr} ＝ {c}x {fmtSigned(d)}
          </span>
        </span>
      ),
      options: ensureFourUniqueOptions(finalCorrect, distractors),
      correctId: 'ok',
      correctDisplay: finalCorrect.label,
      explanation: `${diffA}x ＝ ${effRhsDiff} ⇔ x ＝ ${denEff === 1 ? nEff : `${nEff}/${denEff}`}.`,
      tableData: [
        { step: '1', op: isEn ? 'Isolate x terms' : 'Χωρισμός γνωστών από αγνώστους', res: `${diffA}x ＝ ${effRhsDiff}` },
        { step: '2', op: isEn ? `Divide by ${diffA}` : `Διαιρούμε με ${diffA}`, res: denEff === 1 ? `x ＝ ${nEff}` : <Frac num={nEff} den={denEff} small /> },
      ],
      diagram: { left: `${diffA}x`, mid: `${effRhsDiff}`, right: denEff === 1 ? `x ＝ ${nEff}` : `x ＝ ${nEff}/${denEff}` },
    });
  }

  // =========================================================================
  // Q6 (tf) — 5 παραλλαγές Σωστό/Λάθος για ιδιότητες ισότητας (0, αρνητικοί, όροι)
  // =========================================================================
  {
    const v = randInt(1, 5);
    const isTrue = Math.random() > 0.5;
    if (v === 1) {
      const a = -randInt(2, 5);
      const x = randInt(2, 7);
      const b = a * x;
      const shownX = isTrue ? x : -x;
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{a}x ＝ {b} ⇔ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: `${b} : (${a}) ＝ ${x}.`,
        tableData: [{ step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` }],
        diagram: { left: `${a}x`, mid: `${b}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const k = -randInt(2, 6);
      const stmt = isTrue
        ? isEn
          ? `Multiplying both sides of an equation by ${k} preserves equivalence.`
          : `Αν πολλαπλασιάσουμε και τα δύο μέλη μιας εξίσωσης με ${k}, παίρνουμε ισοδύναμη εξίσωση.`
        : isEn
        ? 'Multiplying both sides of an equation by 0 always preserves equivalence.'
        : 'Αν πολλαπλασιάσουμε και τα δύο μέλη μιας εξίσωσης με 0, παίρνουμε πάντα ισοδύναμη εξίσωση.';
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: <span>{isEn ? 'True or False: ' : 'Σωστό ή Λάθος: '}{stmt}</span>,
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isTrue
          ? isEn ? `Since ${k} ≠ 0, equivalence is preserved.` : `Επειδή ${k} ≠ 0, διατηρείται η ισοδυναμία.`
          : isEn ? 'Multiplying by 0 yields 0 ＝ 0, losing equivalence.' : 'Ο πολλαπλασιασμός με 0 δίνει 0 ＝ 0 και δεν διατηρεί την ισοδυναμία.',
        tableData: [{ step: '1', op: isEn ? 'Rule c ≠ 0' : 'Κανόνας γ ≠ 0', res: isTrue ? `${k} ≠ 0` : '0 ＝ 0' }],
        diagram: { left: 'Α ＝ Β', mid: isTrue ? `${k}Α ＝ ${k}Β` : '0 ＝ 0', right: isTrue ? '⇔' : '≠' },
      });
    } else if (v === 3) {
      const stmt = isTrue
        ? isEn
          ? 'Adding 2x to both sides of an equation produces an equivalent equation.'
          : 'Αν προσθέσουμε 2x και στα δύο μέλη μιας εξίσωσης, παίρνουμε ισοδύναμη εξίσωση.'
        : isEn
        ? 'Adding 2x only to the left side produces an equivalent equation.'
        : 'Αν προσθέσουμε 2x μόνο στο αριστερό μέλος, παίρνουμε ισοδύναμη εξίσωση.';
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: <span>{isEn ? 'True or False: ' : 'Σωστό ή Λάθος: '}{stmt}</span>,
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isTrue
          ? isEn ? 'Adding the same expression to both sides preserves equality.' : 'Η πρόσθεση της ίδιας παράστασης και στα δύο μέλη διατηρεί την ισότητα.'
          : isEn ? 'Both sides must receive the exact same operation.' : 'Πρέπει η ίδια πράξη να εφαρμόζεται και στα δύο μέλη.',
        tableData: [{ step: '1', op: isEn ? 'Addition property' : 'Ιδιότητα πρόσθεσης', res: isTrue ? 'Α＋2x＝Β＋2x' : 'Α＋2x≠Β' }],
        diagram: { left: 'Α ＝ Β', mid: '＋ 2x', right: isTrue ? '⇔' : '≠' },
      });
    } else if (v === 4) {
      const k = randInt(2, 6);
      const stmt = isTrue
        ? isEn
          ? `Dividing both sides of an equation by -${k} produces an equivalent equation.`
          : `Αν διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με -${k}, παίρνουμε ισοδύναμη εξίσωση.`
        : isEn
        ? 'We can divide both sides of an equation by 0.'
        : 'Επιτρέπεται να διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με το 0.';
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: <span>{isEn ? 'True or False: ' : 'Σωστό ή Λάθος: '}{stmt}</span>,
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isTrue
          ? isEn ? `Since -${k} ≠ 0, dividing both sides is valid.` : `Επειδή -${k} ≠ 0, η διαίρεση διατηρεί την ισοδυναμία.`
          : isEn ? 'Division by zero is never allowed.' : 'Η διαίρεση με το μηδέν δεν ορίζεται ποτέ.',
        tableData: [{ step: '1', op: isEn ? 'Division property' : 'Ιδιότητα διαίρεσης', res: isTrue ? `-${k} ≠ 0` : '÷ 0 ✕' }],
        diagram: { left: 'Α ＝ Β', mid: isTrue ? `÷ (-${k})` : '÷ 0', right: isTrue ? '⇔' : '✕' },
      });
    } else {
      const b = randInt(2, 7);
      const eq = `-x ＝ ${b}`;
      const shown = isTrue ? -b : b;
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{eq} ⇔ x ＝ {shown}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Multiplying both sides by -1 gives x ＝ -${b}.`
          : `Πολλαπλασιάζοντας και τα δύο μέλη με -1 παίρνουμε x ＝ -${b}.`,
        tableData: [{ step: '1', op: isEn ? 'Multiply by -1' : 'Πολλαπλασιασμός με -1', res: `x ＝ -${b}` }],
        diagram: { left: `-x ＝ ${b}`, mid: '· (-1)', right: `x ＝ -${b}` },
      });
    }
  }

  // =========================================================================
  // Q7 (input) — 5 παραλλαγές εξισώσεων με κλάσματα / διαίρεση
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const d = randInt(2, 5);
      const mult = randInt(-5, 6);
      const safeX = mult === 0 ? d * 3 : d * mult;
      const b = randInt(2, 8);
      const rhs = safeX / d + b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num="x" den={d} small />
              <span>＋ {b} ＝ {rhs}</span>
            </span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `x/${d} ＝ ${rhs - b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x : ${d} ＝ ${rhs - b}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `x/${d}＋${b}`, mid: `${rhs}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 2) {
      const d = randInt(2, 5);
      const mult = randInt(-4, 6);
      const safeX = mult === 0 ? d * 4 : d * mult;
      const b = randInt(2, 7);
      const rhs = safeX / d - b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num="x" den={d} small />
              <span>－ {b} ＝ {rhs}</span>
            </span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `x/${d} ＝ ${rhs + b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x : ${d} ＝ ${rhs + b}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `x/${d}－${b}`, mid: `${rhs}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 3) {
      const d = randInt(2, 5);
      const q = randInt(-5, 6);
      const safeQ = q === 0 ? 4 : q;
      const b = randInt(2, 7);
      const x = d * safeQ - b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`x ＋ ${b}`} den={d} small />
            <span className="font-mono">＝ {safeQ}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `x ＋ ${b} ＝ ${d * safeQ} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＋ ${b} ＝ ${d * safeQ}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x＋${b})/${d}`, mid: `${safeQ}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const d = randInt(2, 5);
      const q = randInt(-4, 7);
      const safeQ = q === 0 ? 3 : q;
      const b = randInt(2, 7);
      const x = d * safeQ + b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`x － ${b}`} den={d} small />
            <span className="font-mono">＝ {safeQ}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `x － ${b} ＝ ${d * safeQ} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x － ${b} ＝ ${d * safeQ}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x－${b})/${d}`, mid: `${safeQ}`, right: `x ＝ ${x}` },
      });
    } else {
      const d = randInt(2, 4);
      const a = randInt(2, 3);
      const x = d * randInt(2, 6);
      const q = (a * x) / d;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`${a}x`} den={d} small />
            <span className="font-mono">＝ {q}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `${a}x ＝ ${q * d} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `${a}x ＝ ${q * d}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x/${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q8 (mcq) — 5 διαφορετικά προβλήματα εφαρμογής με εξισώσεις
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const x = randInt(3, 9);
      const leftBoxes = randInt(4, 6);
      const rightBoxes = randInt(1, 2);
      const leftW = randInt(2, 6);
      const rightW = (leftBoxes - rightBoxes) * x + leftW;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x} kg</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x + 2} kg</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, x - 1)} kg</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {rightW - leftW} kg</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `A balanced scale has ${leftBoxes} equal boxes (x kg) + ${leftW} kg on the left, and ${rightBoxes} box(es) + ${rightW} kg on the right. Find x.`
          : `Σε μια ζυγαριά ισορροπίας υπάρχουν ${leftBoxes} ίσα κουτιά (x kg) και ${leftW} kg αριστερά, ενώ δεξιά υπάρχουν ${rightBoxes} κουτί/ά και ${rightW} kg. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `${leftBoxes}x ＋ ${leftW} ＝ ${rightBoxes}x ＋ ${rightW} ⇔ ${leftBoxes - rightBoxes}x ＝ ${rightW - leftW} ⇔ x ＝ ${x} kg.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${rightBoxes}x and ${leftW}` : `Αφαιρούμε ${rightBoxes}x και ${leftW}`, res: `${leftBoxes - rightBoxes}x ＝ ${rightW - leftW}` },
          { step: '2', op: isEn ? `Divide by ${leftBoxes - rightBoxes}` : `Διαιρούμε με ${leftBoxes - rightBoxes}`, res: `x ＝ ${x} kg` },
        ],
        diagram: { left: `${leftBoxes}x＋${leftW}`, mid: `${rightBoxes}x＋${rightW}`, right: `x ＝ ${x} kg` },
      });
    } else if (v === 2) {
      const x = randInt(5, 12);
      const a = randInt(3, 5);
      const b = randInt(2, 6);
      const rhsAdd = (a - 1) * x - b;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {x + 2}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {Math.max(1, x - 2)}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {rhsAdd + b}</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `${a} times a number x decreased by ${b} equals the number x increased by ${rhsAdd}. Find x.`
          : `Το ${a}-πλάσιο ενός αριθμού x μειωμένο κατά ${b} ισούται με τον ίδιο αριθμό x αυξημένο κατά ${rhsAdd}. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `${a}x － ${b} ＝ x ＋ ${rhsAdd} ⇔ ${a - 1}x ＝ ${rhsAdd + b} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract x, add ${b}` : `Αφαιρούμε x, προσθέτουμε ${b}`, res: `${a - 1}x ＝ ${rhsAdd + b}` },
          { step: '2', op: isEn ? `Divide by ${a - 1}` : `Διαιρούμε με ${a - 1}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}x － ${b}`, mid: `x ＋ ${rhsAdd}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const x = randInt(4, 10);
      const diff = randInt(6, 12);
      const p1 = 20;
      const p2 = p1 - diff;
      const r1 = 3;
      const r2 = r1 + diff / x;
      const months = randInt(4, 8);
      const feeA = 10;
      const feeB = feeA + months * 2;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {months}</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {months + 2}</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, months - 1)}</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {feeB - feeA}</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `Plan A costs ${feeA} € + 5 € per month (x). Plan B costs ${feeB} € + 3 € per month (x). After how many months x do both plans cost the same?`
          : `Το πρόγραμμα Α κοστίζει ${feeA} € ＋ 5 € ανά μήνα (x), ενώ το Β κοστίζει ${feeB} € ＋ 3 € ανά μήνα (x). Σε πόσους μήνες x έχουν το ίδιο κόστος;`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `5x ＋ ${feeA} ＝ 3x ＋ ${feeB} ⇔ 2x ＝ ${feeB - feeA} ⇔ x ＝ ${months}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract 3x and ${feeA}` : `Αφαιρούμε 3x και ${feeA}`, res: `2x ＝ ${feeB - feeA}` },
          { step: '2', op: isEn ? 'Divide by 2' : 'Διαιρούμε με 2', res: `x ＝ ${months}` },
        ],
        diagram: { left: `5x＋${feeA}`, mid: `3x＋${feeB}`, right: `x ＝ ${months}` },
      });
    } else if (v === 4) {
      const x = randInt(5, 11);
      const extra = randInt(4, 10);
      const perim = 4 * x + 2 * extra;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x} cm</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x + extra} cm</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x + 2} cm</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, x - 2)} cm</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `A rectangle has width x cm and length (x ＋ ${extra}) cm. Its perimeter is ${perim} cm. Find x.`
          : `Ένα ορθογώνιο έχει πλάτος x cm, μήκος (x ＋ ${extra}) cm και περίμετρο ${perim} cm. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `4x ＋ ${2 * extra} ＝ ${perim} ⇔ 4x ＝ ${4 * x} ⇔ x ＝ ${x} cm.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${2 * extra}` : `Αφαιρούμε ${2 * extra}`, res: `4x ＝ ${4 * x}` },
          { step: '2', op: isEn ? 'Divide by 4' : 'Διαιρούμε με 4', res: `x ＝ ${x} cm` },
        ],
        diagram: { left: `4x＋${2 * extra}`, mid: `${perim} cm`, right: `x ＝ ${x} cm` },
      });
    } else {
      const x = randInt(4, 10);
      const extra = randInt(6, 14);
      const total = 3 * x + extra;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x} €</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {x + 3} €</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, x - 1)} €</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {total - extra} €</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `Anna has x € and Nikos has (2x ＋ ${extra}) €. Together they have ${total} €. Find x.`
          : `Η Άννα έχει x € και ο Νίκος έχει (2x ＋ ${extra}) €. Μαζί έχουν ${total} €. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `3x ＋ ${extra} ＝ ${total} ⇔ 3x ＝ ${3 * x} ⇔ x ＝ ${x} €.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${extra}` : `Αφαιρούμε ${extra}`, res: `3x ＝ ${3 * x}` },
          { step: '2', op: isEn ? 'Divide by 3' : 'Διαιρούμε με 3', res: `x ＝ ${x} €` },
        ],
        diagram: { left: `3x＋${extra}`, mid: `${total} €`, right: `x ＝ ${x} €` },
      });
    }
  }

  // =========================================================================
  // Q9 (tf) — 5 παραλλαγές Σωστό/Λάθος για Ταυτότητα vs Αδύνατη Εξίσωση
  // =========================================================================
  {
    const v = randInt(1, 5);
    const claimIdentity = Math.random() > 0.5;
    let isIdentity = true;
    let expr = '';
    let reduced = '';

    if (v === 1) {
      const k = randInt(2, 5);
      const b = randInt(2, 6);
      isIdentity = true;
      expr = `${k}(x － ${b}) ＝ ${k}x － ${k * b}`;
      reduced = '0 · x ＝ 0';
    } else if (v === 2) {
      const k = randInt(2, 5);
      const b = randInt(2, 6);
      isIdentity = false;
      expr = `${k}(x － ${b}) ＝ ${k}x ＋ ${b}`;
      reduced = `0 · x ＝ ${b + k * b}`;
    } else if (v === 3) {
      const a = randInt(3, 7);
      const b = randInt(2, 9);
      isIdentity = true;
      expr = `${a}x ＋ ${b} － ${a}x ＝ ${b}`;
      reduced = '0 · x ＝ 0';
    } else if (v === 4) {
      const a = randInt(3, 7);
      const b = randInt(2, 6);
      isIdentity = false;
      expr = `${a}x ＋ ${b} － ${a}x ＝ ${b + 5}`;
      reduced = '0 · x ＝ 5';
    } else {
      const k = randInt(2, 4);
      isIdentity = true;
      expr = `${k}(x ＋ 1) ＋ x ＝ ${k + 1}x ＋ ${k}`;
      reduced = '0 · x ＝ 0';
    }

    const isTrue = isIdentity === claimIdentity;
    list.push({
      id: 'q9',
      type: 'tf',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            {isEn
              ? claimIdentity
                ? 'True or False — Identity (infinitely many solutions):'
                : 'True or False — Impossible (no solution):'
              : claimIdentity
              ? 'Σωστό ή Λάθος — Ταυτότητα (άπειρες λύσεις):'
              : 'Σωστό ή Λάθος — Αδύνατη (καμία λύση):'}
          </span>
          <span className="font-mono">{expr}</span>
        </span>
      ),
      correctBool: isTrue,
      correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
      explanation: isEn
        ? `It simplifies to ${reduced}.`
        : `Απλοποιείται σε ${reduced}.`,
      tableData: [{ step: '1', op: isEn ? 'Reduced form' : 'Ανηγμένη μορφή', res: reduced }],
      diagram: { left: expr, mid: reduced, right: isIdentity ? '∞' : '∅' },
    });
  }

  // =========================================================================
  // Q10 (input) — 5 παραλλαγές με παρενθέσεις & αγνώστους στα δύο μέλη
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const a = randInt(2, 4);
      const b = randInt(2, 5);
      const x = randInt(-4, 7);
      const safeX = x === 0 ? 4 : x;
      const c = a + randInt(1, 3);
      const d = a * (safeX + b) - c * safeX;
      const rhs = `${c}x ${fmtSigned(d)}`;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＝ {rhs}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `${a}x ＋ ${a * b} ＝ ${rhs} ⇔ ${a - c}x ＝ ${d - a * b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? 'Expand parentheses' : 'Απαλοιφή παρένθεσης', res: `${a}x ＋ ${a * b} ＝ ${rhs}` },
          { step: '2', op: isEn ? 'Isolate x' : 'Απομόνωση x', res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `${a}(x＋${b})`, mid: rhs, right: `x ＝ ${safeX}` },
      });
    } else if (v === 2) {
      const a = randInt(3, 5);
      const b = randInt(2, 5);
      const x = randInt(-3, 6);
      const safeX = x === 0 ? 3 : x;
      const c = randInt(1, 2);
      const d = a * (safeX - b) - c * safeX;
      const rhs = `${c}x ${fmtSigned(d)}`;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x － {b}) ＝ {rhs}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `${a}x － ${a * b} ＝ ${rhs} ⇔ ${a - c}x ＝ ${d + a * b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? 'Expand parentheses' : 'Απαλοιφή παρένθεσης', res: `${a}x － ${a * b} ＝ ${rhs}` },
          { step: '2', op: isEn ? 'Isolate x' : 'Απομόνωση x', res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `${a}(x－${b})`, mid: rhs, right: `x ＝ ${safeX}` },
      });
    } else if (v === 3) {
      const a = randInt(2, 4);
      const b = randInt(1, 4);
      const k = randInt(2, 6);
      const x = randInt(2, 7);
      const c = 1;
      const d = a * (x + b) + k - c * x;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＋ {k} ＝ x ＋ {d}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `${a}x ＋ ${a * b + k} ＝ x ＋ ${d} ⇔ ${a - 1}x ＝ ${d - (a * b + k)} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? 'Expand & simplify' : 'Απαλοιφή & αναγωγή', res: `${a}x ＋ ${a * b + k} ＝ x ＋ ${d}` },
          { step: '2', op: isEn ? 'Isolate x' : 'Απομόνωση x', res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(x＋${b})＋${k}`, mid: `x＋${d}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const a = randInt(3, 5);
      const c = randInt(1, 2);
      const b = randInt(1, 4);
      const x = randInt(2, 7);
      const d = (a * (x - b)) / c - x;
      const cleanC = 2;
      const cleanA = 4;
      const cleanB = randInt(1, 4);
      const cleanX = randInt(2, 6);
      const cleanD = (cleanA * (cleanX - cleanB)) / cleanC - cleanX;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{cleanA}(x － {cleanB}) ＝ {cleanC}(x {fmtSigned(cleanD)})</span>
          </span>
        ),
        correctNumber: cleanX,
        correctDisplay: <span className="font-mono">x ＝ {cleanX}</span>,
        explanation: `${cleanA}x － ${cleanA * cleanB} ＝ ${cleanC}x ${fmtSigned(cleanC * cleanD)} ⇔ 2x ＝ ${2 * cleanX} ⇔ x ＝ ${cleanX}.`,
        tableData: [
          { step: '1', op: isEn ? 'Expand both sides' : 'Απαλοιφή παρενθέσεων', res: `${cleanA}x － ${cleanA * cleanB} ＝ ${cleanC}x ${fmtSigned(cleanC * cleanD)}` },
          { step: '2', op: isEn ? 'Isolate x' : 'Απομόνωση x', res: `x ＝ ${cleanX}` },
        ],
        diagram: { left: `${cleanA}(x－${cleanB})`, mid: `${cleanC}(x${fmtSigned(cleanD)})`, right: `x ＝ ${cleanX}` },
      });
    } else {
      const a = randInt(2, 4);
      const k = randInt(2, 5);
      const x = randInt(2, 6);
      const b = randInt(10, 18);
      const rhs = b - a * (x - k);
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} － {a}(x － {k}) ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: `${b} － ${a}x ＋ ${a * k} ＝ ${rhs} ⇔ -${a}x ＝ ${rhs - b - a * k} ⇔ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? 'Expand parentheses' : 'Απαλοιφή παρένθεσης', res: `${b + a * k} － ${a}x ＝ ${rhs}` },
          { step: '2', op: isEn ? 'Isolate x' : 'Απομόνωση x', res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b}－${a}(x－${k})`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q11 (mcq) — 5 παραλλαγές με παράμετρο κ (ταυτότητα / αδύνατη)
  // =========================================================================
  {
    const v = randInt(1, 5);
    const m = randInt(2, 7);
    let eqText = '';
    let isIdentity = true;
    let ansVal = m;

    if (v === 1) {
      eqText = `(κ － ${m})x ＝ 0`;
      isIdentity = true;
      ansVal = m;
    } else if (v === 2) {
      eqText = `(κ － ${m})x ＝ 5`;
      isIdentity = false;
      ansVal = m;
    } else if (v === 3) {
      eqText = `(κ ＋ ${m})x ＝ 0`;
      isIdentity = true;
      ansVal = -m;
    } else if (v === 4) {
      eqText = `(κ ＋ ${m})x ＝ -3`;
      isIdentity = false;
      ansVal = -m;
    } else {
      eqText = `(2κ － ${2 * m})x ＝ 7`;
      isIdentity = false;
      ansVal = m;
    }

    const correctOpt = { id: 'ok', label: <span className="font-mono">κ ＝ {ansVal}</span> };
    const distractors = [
      { id: 'd1', label: <span className="font-mono">κ ＝ {-ansVal}</span> },
      { id: 'd2', label: <span className="font-mono">κ ＝ 0</span> },
      { id: 'd3', label: <span className="font-mono">κ ＝ {ansVal + 2}</span> },
    ];
    list.push({
      id: 'q11',
      type: 'mcq',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            {isEn
              ? `For which value of κ is ${eqText} ${isIdentity ? 'an identity (infinitely many solutions)' : 'impossible (no solution)'}?`
              : `Για ποια τιμή του κ η εξίσωση ${eqText} ${isIdentity ? 'έχει άπειρες λύσεις (ταυτότητα)' : 'είναι αδύνατη (καμία λύση)'};`}
          </span>
        </span>
      ),
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correctId: 'ok',
      correctDisplay: correctOpt.label,
      explanation: isEn
        ? `The coefficient of x must be 0, which gives κ ＝ ${ansVal}.`
        : `Πρέπει ο συντελεστής του x να μηδενίζεται, οπότε κ ＝ ${ansVal}.`,
      tableData: [
        { step: '1', op: isEn ? 'Set coefficient to 0' : 'Μηδενισμός συντελεστή', res: `κ ＝ ${ansVal}` },
      ],
      diagram: { left: eqText, mid: 'α ＝ 0', right: `κ ＝ ${ansVal}` },
    });
  }

  // =========================================================================
  // Q12 (input) — 5 παραλλαγές εξισώσεων με αρνητικούς συντελεστές & αναγωγή
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const a = randInt(2, 6);
      const x = randInt(-6, 6);
      const safeX = x === 0 ? -3 : x;
      const b = randInt(4, 14);
      const c = -a * safeX + b;
      list.push({
        id: 'q12',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">-{a}x ＋ {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `-${a}x ＝ ${c - b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `-${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `-${a}x＋${b}`, mid: `${c}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 2) {
      const a = randInt(2, 5);
      const x = randInt(-5, 5);
      const safeX = x === 0 ? -2 : x;
      const b = randInt(3, 10);
      const c = -a * safeX - b;
      list.push({
        id: 'q12',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">-{a}x － {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `-${a}x ＝ ${c + b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `-${a}x ＝ ${c + b}` },
          { step: '2', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `-${a}x－${b}`, mid: `${c}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 3) {
      const a = randInt(2, 5);
      const x = randInt(-5, 5);
      const safeX = x === 0 ? 4 : x;
      const b = randInt(2, 6);
      const c = -a * (safeX + b);
      list.push({
        id: 'q12',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">-{a}(x ＋ {b}) ＝ {c}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `x ＋ ${b} ＝ ${c / -a} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＋ ${b} ＝ ${c / -a}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `-${a}(x＋${b})`, mid: `${c}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 4);
      const b = a + randInt(2, 4);
      const x = randInt(-5, 6);
      const safeX = x === 0 ? -4 : x;
      const c = randInt(3, 9);
      const d = (a - b) * safeX + c;
      list.push({
        id: 'q12',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x － {b}x ＋ {c} ＝ {d}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `${a - b}x ＝ ${d - c} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Combine & subtract ${c}` : `Αναγωγή & αφαίρεση ${c}`, res: `${a - b}x ＝ ${d - c}` },
          { step: '2', op: isEn ? `Divide by ${a - b}` : `Διαιρούμε με ${a - b}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `${a - b}x＋${c}`, mid: `${d}`, right: `x ＝ ${safeX}` },
      });
    } else {
      const a = randInt(2, 5);
      const x = randInt(-5, 6);
      const safeX = x === 0 ? 5 : x;
      const b = randInt(4, 12);
      const c = b - a * safeX;
      list.push({
        id: 'q12',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} － {a}x ＝ {c}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: `-${a}x ＝ ${c - b} ⇔ x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `-${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by -${a}` : `Διαιρούμε με -${a}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `${b}－${a}x`, mid: `${c}`, right: `x ＝ ${safeX}` },
      });
    }
  }

  return list;
}

export default function EksisosiIdiotitesExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateNewSet = useCallback(() => {
    setQuestions(buildQuestions(locale));
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }, [locale]);

  useEffect(() => {
    generateNewSet();
  }, [generateNewSet]);

  const handleSelect = (qId, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const isAnswered = (q) => {
    const v = answers[q.id];
    if (q.type === 'tf') return typeof v === 'boolean';
    if (q.type === 'mcq') return Boolean(v);
    if (q.type === 'input') return !Number.isNaN(parseNumericAnswer(v));
    return false;
  };

  const isCorrect = (q) => {
    const v = answers[q.id];
    if (q.type === 'tf') return v === q.correctBool;
    if (q.type === 'mcq') return v === q.correctId;
    if (q.type === 'input') {
      const parsed = parseNumericAnswer(v);
      return !Number.isNaN(parsed) && Math.abs(parsed - q.correctNumber) < 1e-6;
    }
    return false;
  };

  const handleCheck = () => {
    let total = 0;
    for (const q of questions) {
      if (isCorrect(q)) total += 1;
    }
    setScore(total);
    setSubmitted(true);
  };

  const answeredCount = questions.filter(isAnswered).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const baseUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: extractPlainText(t.title),
    description: extractPlainText(t.metaDesc),
    inLanguage: locale,
    educationalLevel: "Β' ΓΥΜΝΑΣΙΟΥ",
    typicalAgeRange: '13-14',
    isAccessibleForFree: true,
    url: `${baseUrl}/b-gymnasiou/12-eksisosi-idiotites-ask`,
    provider: {
      '@id': 'https://learnmaths.gr/#organization',
    },
    hasPart: questions.map((q, idx) => ({
      '@type': 'Question',
      position: idx + 1,
      text: extractPlainText(q.prompt),
      acceptedAnswer: {
        '@type': 'Answer',
        position: 1,
        text: extractPlainText(q.correctDisplay),
        answerExplanation: extractPlainText(q.explanation),
      },
      suggestedAnswer:
        q.type === 'mcq'
          ? q.options.map((opt, oIdx) => ({
              '@type': 'Answer',
              position: oIdx + 1,
              text: extractPlainText(opt.label),
            }))
          : undefined,
    })),
  };

  const actionButton = (
    <Link
      href="/b-gymnasiou/12-eksisosi-idiotites"
      locale={locale}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span>{toCleanUppercase(t.backText)}</span>
    </Link>
  );

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDesc}
      jsonLd={jsonLd}
      actionButton={actionButton}
      backUrl="/b-gymnasiou/12-eksisosi-idiotites"
      backText={t.backText}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* Header */}
        <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold tracking-wide mb-2">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1.5 break-words [overflow-wrap:anywhere]">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 break-words [overflow-wrap:anywhere]">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={generateNewSet}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow transition-all cursor-pointer"
          >
            <span>{toCleanUppercase(t.newBtn)}</span>
          </button>
        </section>

        {/* Questions List */}
        <section className="space-y-6 min-w-0">
          {questions.map((q, idx) => {
            const ok = submitted && isCorrect(q);

            return (
              <article
                key={q.id}
                className={`rounded-3xl border bg-white p-5 sm:p-7 shadow-sm transition-colors min-w-0 ${
                  submitted
                    ? ok
                      ? 'border-emerald-300'
                      : 'border-rose-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                    {idx + 1}
                  </span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere] min-w-0">
                    {q.prompt}
                  </div>
                </div>

                {q.type === 'tf' && (
                  <div className="flex flex-wrap gap-3 sm:pl-12">
                    {[
                      { val: true, text: t.trueBtn },
                      { val: false, text: t.falseBtn },
                    ].map((opt) => {
                      const active = answers[q.id] === opt.val;
                      return (
                        <button
                          key={String(opt.val)}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.val)}
                          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold border transition-all cursor-pointer ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'mcq' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:pl-12 min-w-0">
                    {q.options.map((opt) => {
                      const active = answers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.id)}
                          className={`px-4 py-3 rounded-2xl text-left text-sm sm:text-base font-bold border transition-all cursor-pointer min-w-0 break-words [overflow-wrap:anywhere] ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'input' && (
                  <div className="flex flex-wrap items-center gap-2.5 sm:pl-12">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono font-black text-slate-800">
                      x ＝
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={submitted}
                      value={answers[q.id] ?? ''}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      placeholder={t.inputPlaceholder}
                      className="w-40 sm:w-48 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {q.unit ? (
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-slate-600">
                        {q.unit}
                      </span>
                    ) : null}
                  </div>
                )}

                {/* No-Giveaway Feedback: εμφανίζεται μόνο μετά την υποβολή */}
                {submitted && (
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 sm:pl-12 min-w-0">
                    <div
                      className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-2xl px-4 py-2 text-xs sm:text-sm font-extrabold break-words [overflow-wrap:anywhere] max-w-full ${
                        ok ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                      }`}
                    >
                      <span>{ok ? t.correctPrefix : t.wrongPrefix}</span>
                      <span>{q.correctDisplay}</span>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 min-w-0">
                      <div className="text-sm font-black text-slate-900">{t.solHeading}</div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                        {q.explanation}
                      </p>

                      {q.diagram && (
                        <div className="w-full overflow-hidden rounded-xl bg-white border border-slate-200 px-3 py-2 flex justify-center">
                          <svg
                            viewBox="0 0 360 44"
                            className="w-full max-w-[360px] h-auto block select-none"
                            role="img"
                            aria-label={t.diagramAria}
                          >
                            <rect x="4" y="6" width="114" height="32" rx="7" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.4" />
                            <text x="61" y="26" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                              {q.diagram.left}
                            </text>
                            <text x="129" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill="#475569" fontFamily="monospace">
                              ＝
                            </text>
                            <rect x="140" y="6" width="96" height="32" rx="7" fill="#f8fafc" stroke="#64748b" strokeWidth="1.4" />
                            <text x="188" y="26" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0f172a" fontFamily="monospace">
                              {q.diagram.mid}
                            </text>
                            <text x="247" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill="#059669" fontFamily="monospace">
                              ⇔
                            </text>
                            <rect x="258" y="6" width="98" height="32" rx="7" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                            <text x="307" y="26" textAnchor="middle" fontSize="11" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                              {q.diagram.right}
                            </text>
                          </svg>
                        </div>
                      )}

                      {q.tableData && q.tableData.length > 0 && (
                        <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <table className="w-full table-fixed text-xs sm:text-sm text-left">
                            <thead className="bg-slate-100 text-slate-800 font-extrabold">
                              <tr>
                                <th className="w-16 px-3 py-2">{t.colStep}</th>
                                <th className="w-1/2 px-3 py-2">{t.colOp}</th>
                                <th className="px-3 py-2">{t.colRes}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-mono">
                              {q.tableData.map((row) => (
                                <tr key={row.step}>
                                  <td className="px-3 py-2 font-bold text-indigo-700 break-words [overflow-wrap:anywhere]">
                                    {row.step}
                                  </td>
                                  <td className="px-3 py-2 font-sans text-slate-700 break-words [overflow-wrap:anywhere]">
                                    {row.op}
                                  </td>
                                  <td className="px-3 py-2 font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                    <span className="inline-flex flex-wrap items-center gap-1.5">
                                      {row.res}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>

      {/* Sticky Bottom Score Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-extrabold text-slate-800">
            <span>
              {t.answeredLabel}: {answeredCount} / {questions.length}
            </span>
            {submitted && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-emerald-100 text-emerald-950 px-3.5 py-1 text-sm font-black">
                {t.scoreLabel}: {score} / {questions.length} ({pct}%)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCheck}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 text-sm sm:text-base shadow transition-all cursor-pointer"
          >
            {toCleanUppercase(t.checkBtn)}
          </button>
        </div>
      </div>
    </Layout>
  );
}