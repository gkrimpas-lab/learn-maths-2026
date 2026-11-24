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

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Εξίσωση Πρώτου Βαθμού & Αντίθετες Πράξεις | Κεφ. 10 (Αρχείο 11) | Β' Γυμνασίου",
    metaDesc:
      "12 απαιτητικές δυναμικές ασκήσεις στη Β' Γυμνασίου πάνω στην έννοια της εξίσωσης πρώτου βαθμού και την επίλυση με αντίθετες πράξεις.",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 10 • Β' ΓΥΜΝΑΣΙΟΥ",
    backText: "Θεωρία",
    title: "Ασκήσεις: Εξίσωση Πρώτου Βαθμού & Αντίθετες Πράξεις",
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
    diagramAria: "Διάγραμμα λύσης εξίσωσης",
    answeredLabel: "Απαντήθηκαν",
    checkBtn: "ΕΛΕΓΧΟΣ",
    scoreLabel: "Βαθμολογία",
  },
  en: {
    pageTitle: "Exercises: First-Degree Equations & Inverse Operations | Ch. 10 (File 11) | 8th Grade",
    metaDesc:
      "12 challenging dynamic Grade 8 exercises on first-degree equations and solving with inverse operations.",
    chapterBadge: "CHAPTER 10 • 8TH GRADE",
    backText: "Theory",
    title: "Exercises: First-Degree Equations & Inverse Operations",
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
    diagramAria: "Equation solution diagram",
    answeredLabel: "Answered",
    checkBtn: "CHECK",
    scoreLabel: "Score",
  },
};

function buildQuestions(locale) {
  const isEn = locale === 'en';
  const list = [];

  // =========================================================================
  // Q1 (input) — 5 παραλλαγές εξισώσεων ax ± b = c ή b + ax = c
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const a = randInt(3, 6);
      const x = randInt(4, 11);
      const b = randInt(6, 15);
      const c = a * x - b;
      list.push({
        id: 'q1',
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
        explanation: isEn
          ? `Add ${b} to ${c} to get ${a}x ＝ ${c + b}, then divide by ${a} to get x ＝ ${x}.`
          : `Προσθέτουμε ${b} στο ${c} ώστε ${a}x ＝ ${c + b} και διαιρούμε με ${a}, οπότε x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `${a}x ＝ ${c + b}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}·${x} － ${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const a = randInt(4, 7);
      const x = randInt(3, 10);
      const b = randInt(5, 14);
      const c = b + a * x;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} ＋ {a}x ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${b} from ${c}: ${a}x ＝ ${c - b}. Divide by ${a}: x ＝ ${x}.`
          : `Αφαιρούμε ${b} από το ${c}: ${a}x ＝ ${c - b}. Διαιρούμε με ${a}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `${a}x ＝ ${c - b}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b} ＋ ${a}·${x}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const a = randInt(3, 6);
      const x = randInt(3, 9);
      const b = a * x + randInt(4, 12);
      const c = b - a * x;
      list.push({
        id: 'q1',
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
        explanation: isEn
          ? `The subtracted part ${a}x equals ${b} － ${c} ＝ ${a * x}, so x ＝ ${x}.`
          : `Το αφαιρετέο ${a}x ισούται με ${b} － ${c} ＝ ${a * x}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Find ${a}x = ${b} − ${c}` : `Βρίσκουμε ${a}x ＝ ${b} － ${c}`, res: `${a}x ＝ ${a * x}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b} － ${a}·${x}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 5);
      const x = randInt(5, 13);
      const k = randInt(2, 4);
      const rhs = (a + k) * x;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x ＋ {k}x ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Combine like terms: ${a + k}x ＝ ${rhs}, then divide by ${a + k} to get x ＝ ${x}.`
          : `Κάνουμε αναγωγή ομοίων όρων: ${a + k}x ＝ ${rhs}, και διαιρούμε με ${a + k} ώστε x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? 'Combine like terms' : 'Αναγωγή ομοίων όρων', res: `${a + k}x ＝ ${rhs}` },
          { step: '2', op: isEn ? `Divide by ${a + k}` : `Διαιρούμε με ${a + k}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a + k} · ${x}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    } else {
      const a = randInt(6, 10);
      const k = randInt(2, 4);
      const x = randInt(4, 12);
      const rhs = (a - k) * x;
      list.push({
        id: 'q1',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x － {k}x ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Combine like terms: ${a - k}x ＝ ${rhs}, then divide by ${a - k} to get x ＝ ${x}.`
          : `Κάνουμε αναγωγή ομοίων όρων: ${a - k}x ＝ ${rhs}, και διαιρούμε με ${a - k} ώστε x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? 'Combine like terms' : 'Αναγωγή ομοίων όρων', res: `${a - k}x ＝ ${rhs}` },
          { step: '2', op: isEn ? `Divide by ${a - k}` : `Διαιρούμε με ${a - k}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a - k} · ${x}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q2 (tf) — 5 παραλλαγές Σωστό/Λάθος με παγίδες σε πράξεις και επαλήθευση
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const d = randInt(3, 5);
      const q = randInt(4, 9);
      const b = randInt(3, 8);
      const x = d * q - b;
      const isTrue = Math.random() > 0.5;
      const shownX = isTrue ? x : q * d + b;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">(x ＋ {b}) : {d} ＝ {q} ⇒ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Multiply by ${d} first: x ＋ ${b} ＝ ${q * d}. Then subtract ${b}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε πρώτα με ${d}: x ＋ ${b} ＝ ${q * d}. Έπειτα αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＋ ${b} ＝ ${q * d}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(${x}＋${b}):${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const a = randInt(3, 6);
      const x = randInt(4, 9);
      const b = randInt(3, 8);
      const c = a * x - b;
      const isTrue = Math.random() > 0.5;
      const shownX = isTrue ? x : Math.max(1, Math.floor((c - b) / a));
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{a}x － {b} ＝ {c} ⇒ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Add ${b} to ${c} to get ${a}x ＝ ${c + b}, then divide by ${a}: x ＝ ${x}.`
          : `Προσθέτουμε ${b} στο ${c}: ${a}x ＝ ${c + b} και διαιρούμε με ${a}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `${a}x ＝ ${c + b}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}·${x} － ${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const a = randInt(4, 8);
      const b = randInt(1, 3);
      const isTrue = Math.random() > 0.5;
      const shown = isTrue ? <Frac num={b} den={a} small /> : <Frac num={a} den={b} small />;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{a}x ＝ {b} ⇒ x ＝</span>
            {shown}
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Dividing ${b} by ${a} gives ${b}/${a}, not ${a}/${b}.`
          : `Διαιρώντας το ${b} με το ${a} παίρνουμε ${b}/${a} (όχι ${a}/${b}).`,
        tableData: [
          { step: '1', op: isEn ? `Divide ${b} by ${a}` : `Διαιρούμε ${b} με ${a}`, res: <Frac num={b} den={a} small /> },
        ],
        diagram: { left: `${a}x`, mid: `${b}`, right: `x ＝ ${b}/${a}` },
      });
    } else if (v === 4) {
      const d = randInt(3, 6);
      const q = randInt(4, 9);
      const x = d * q;
      const isTrue = Math.random() > 0.5;
      const shownX = isTrue ? x : q + d;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">x : {d} ＝ {q} ⇒ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Multiply ${q} by ${d}: x ＝ ${q} · ${d} ＝ ${x}.`
          : `Πολλαπλασιάζουμε ${q} με ${d}: x ＝ ${q} · ${d} ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${x} : ${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else {
      const x = randInt(3, 8);
      const a = randInt(2, 5);
      const b = randInt(2, 7);
      const rhs = a * x + b;
      const testX = Math.random() > 0.5 ? x : x + 1;
      const isTrue = testX === x;
      list.push({
        id: 'q2',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              {isEn
                ? `True or False: The number ${testX} is a solution of`
                : `Σωστό ή Λάθος: Ο αριθμός ${testX} είναι λύση της εξίσωσης`}
            </span>
            <span className="font-mono">{a}x ＋ {b} ＝ {rhs}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Substituting x ＝ ${testX} gives ${a}·${testX} ＋ ${b} ＝ ${a * testX + b}, while RHS is ${rhs}.`
          : `Αντικαθιστώντας x ＝ ${testX} βρίσκουμε ${a}·${testX} ＋ ${b} ＝ ${a * testX + b}, ενώ το δεξί μέλος είναι ${rhs}.`,
        tableData: [
          { step: '1', op: isEn ? `Substitute x = ${testX}` : `Αντικατάσταση x ＝ ${testX}`, res: `${a * testX + b}` },
          { step: '2', op: isEn ? 'Compare with RHS' : 'Σύγκριση με δεξί μέλος', res: `${a * testX + b} ${isTrue ? '＝' : '≠'} ${rhs}` },
        ],
        diagram: { left: `${a}·${testX}＋${b}`, mid: `${rhs}`, right: isTrue ? 'Σωστό' : 'Λάθος' },
      });
    }
  }

  // =========================================================================
  // Q3 (mcq) — 5 παραλλαγές εξισώσεων με κλάσμα / διαίρεση
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const d = randInt(3, 6);
      const b = randInt(2, 7);
      const c = b + randInt(1, 5);
      const x = (c - b) * d;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {(c + b) * d}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {(c - b) + d}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {c * d - b}</span> },
      ];
      list.push({
        id: 'q3',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">(x : {d}) ＋ {b} ＝ {c}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Subtract ${b}: x : ${d} ＝ ${c - b}. Multiply by ${d}: x ＝ ${x}.`
          : `Αφαιρούμε ${b}: x : ${d} ＝ ${c - b}. Πολλαπλασιάζουμε με ${d}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x : ${d} ＝ ${c - b}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x:${d})＋${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const d = randInt(3, 7);
      const b = randInt(2, 6);
      const c = randInt(2, 6);
      const x = (c + b) * d;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {Math.max(1, (c - b) * d)}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {c * d + b}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {c + b + d}</span> },
      ];
      list.push({
        id: 'q3',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num="x" den={d} small />
              <span>－ {b} ＝ {c}</span>
            </span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Add ${b}: x/${d} ＝ ${c + b}. Multiply by ${d}: x ＝ ${x}.`
          : `Προσθέτουμε ${b}: x/${d} ＝ ${c + b}. Πολλαπλασιάζουμε με ${d}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: <span className="inline-flex items-center gap-1"><Frac num="x" den={d} small /><span>＝ {c + b}</span></span> },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x/${d})－${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const d = randInt(2, 5);
      const b = randInt(2, 7);
      const q = randInt(3, 8);
      const x = d * q - b;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {d * q + b}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {q + d - b}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {x + d}</span> },
      ];
      list.push({
        id: 'q3',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`x ＋ ${b}`} den={d} small />
            <span className="font-mono">＝ {q}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Multiply by ${d}: x ＋ ${b} ＝ ${d * q}. Subtract ${b}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε με ${d}: x ＋ ${b} ＝ ${d * q}. Αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＋ ${b} ＝ ${d * q}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x＋${b})/${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const d = randInt(2, 5);
      const b = randInt(2, 6);
      const q = randInt(3, 7);
      const x = d * q + b;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {Math.max(1, d * q - b)}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {q * b + d}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {x + 2}</span> },
      ];
      list.push({
        id: 'q3',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`x － ${b}`} den={d} small />
            <span className="font-mono">＝ {q}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Multiply by ${d}: x － ${b} ＝ ${d * q}. Add ${b}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε με ${d}: x － ${b} ＝ ${d * q}. Προσθέτουμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x － ${b} ＝ ${d * q}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x－${b})/${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else {
      const numC = randInt(2, 4);
      const denC = randInt(5, 7);
      const k = randInt(2, 5);
      const x = denC * k;
      const rhs = numC * k;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {numC * rhs}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {x + denC}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {denC * numC}</span> },
      ];
      list.push({
        id: 'q3',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`${numC}x`} den={denC} small />
            <span className="font-mono">＝ {rhs}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Multiply by ${denC}: ${numC}x ＝ ${rhs * denC}. Divide by ${numC}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε με ${denC}: ${numC}x ＝ ${rhs * denC}. Διαιρούμε με ${numC}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${denC}` : `Πολλαπλασιάζουμε με ${denC}`, res: `${numC}x ＝ ${rhs * denC}` },
          { step: '2', op: isEn ? `Divide by ${numC}` : `Διαιρούμε με ${numC}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${numC}x/${denC}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q4 (input) — 5 παραλλαγές εξισώσεων με παρενθέσεις a(x ± b) = c
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const a = randInt(2, 5);
      const q = randInt(4, 10);
      const c = a * q;
      const b = randInt(2, 8);
      const x = q - b;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Divide by ${a}: x ＋ ${b} ＝ ${q}. Subtract ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x ＋ ${b} ＝ ${q}. Αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＋ ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}＋${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const a = randInt(3, 6);
      const q = randInt(3, 8);
      const c = a * q;
      const b = randInt(2, 7);
      const x = q + b;
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
        explanation: isEn
          ? `Divide by ${a}: x － ${b} ＝ ${q}. Add ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x － ${b} ＝ ${q}. Προσθέτουμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x － ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}－${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const a = randInt(2, 4);
      const m = randInt(2, 3);
      const x = randInt(3, 7);
      const b = randInt(1, 5);
      const q = m * x + b;
      const c = a * q;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}({m}x ＋ {b}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Divide by ${a}: ${m}x ＋ ${b} ＝ ${q}. Subtract ${b}: ${m}x ＝ ${m * x}, so x ＝ ${x}.`
          : `Διαιρούμε με ${a}: ${m}x ＋ ${b} ＝ ${q}. Αφαιρούμε ${b}: ${m}x ＝ ${m * x}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `${m}x ＋ ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Subtract ${b}, divide by ${m}` : `Αφαιρούμε ${b}, διαιρούμε με ${m}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${m}·${x}＋${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 4);
      const m = randInt(2, 3);
      const x = randInt(4, 8);
      const b = randInt(2, 6);
      const q = m * x - b;
      const c = a * q;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}({m}x － {b}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Divide by ${a}: ${m}x － ${b} ＝ ${q}. Add ${b}: ${m}x ＝ ${m * x}, so x ＝ ${x}.`
          : `Διαιρούμε με ${a}: ${m}x － ${b} ＝ ${q}. Προσθέτουμε ${b}: ${m}x ＝ ${m * x}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `${m}x － ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Add ${b}, divide by ${m}` : `Προσθέτουμε ${b}, διαιρούμε με ${m}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${m}·${x}－${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else {
      const a = randInt(2, 5);
      const x = randInt(3, 9);
      const b = randInt(2, 6);
      const k = randInt(3, 9);
      const rhs = a * (x + b) + k;
      list.push({
        id: 'q4',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＋ {k} ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${k}: ${a}(x ＋ ${b}) ＝ ${a * (x + b)}. Divide by ${a}: x ＋ ${b} ＝ ${x + b}, so x ＝ ${x}.`
          : `Αφαιρούμε ${k}: ${a}(x ＋ ${b}) ＝ ${a * (x + b)}. Διαιρούμε με ${a}: x ＋ ${b} ＝ ${x + b}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${k}` : `Αφαιρούμε ${k}`, res: `${a}(x ＋ ${b}) ＝ ${a * (x + b)}` },
          { step: '2', op: isEn ? `Divide by ${a}, subtract ${b}` : `Διαιρούμε με ${a}, αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}＋${b})＋${k}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q5 (mcq) — 5 παραλλαγές με κλασματικές λύσεις (απλοποίηση κλασμάτων)
  // =========================================================================
  {
    const v = randInt(1, 5);
    const a = randInt(4, 8);
    const b = randInt(2, 9);
    const diff = randInt(2, a - 1);
    const g = gcdInt(diff, a);
    const n = diff / g;
    const d = a / g;
    const correctOpt = {
      id: 'ok',
      label:
        d === 1 ? (
          <span className="font-mono">x ＝ {n}</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={n} den={d} small />
          </span>
        ),
    };
    const distractors = [
      {
        id: 'd1',
        label: (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={d} den={n} small />
          </span>
        ),
      },
      {
        id: 'd2',
        label: (
          <span className="inline-flex items-center gap-1 font-mono">
            <span>x ＝</span>
            <Frac num={diff + 2 * b} den={a} small />
          </span>
        ),
      },
      { id: 'd3', label: <span className="font-mono">x ＝ {diff}</span> },
    ];

    if (v <= 3) {
      const c = diff + b;
      list.push({
        id: 'q5',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x ＋ {b} ＝ {c}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Subtract ${b}: ${a}x ＝ ${diff}. Divide by ${a} to get ${n}/${d}.`
          : `Αφαιρούμε ${b}: ${a}x ＝ ${diff}. Διαιρούμε με ${a} και απλοποιούμε: ${n}/${d}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `${a}x ＝ ${diff}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: <Frac num={n} den={d} small /> },
        ],
        diagram: { left: `${a}x ＋ ${b}`, mid: `${c}`, right: `${n}/${d}` },
      });
    } else {
      const c = Math.max(1, diff - b);
      const realDiff = c + b;
      const g2 = gcdInt(realDiff, a);
      const n2 = realDiff / g2;
      const d2 = a / g2;
      const corr2 = {
        id: 'ok',
        label:
          d2 === 1 ? (
            <span className="font-mono">x ＝ {n2}</span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono">
              <span>x ＝</span>
              <Frac num={n2} den={d2} small />
            </span>
          ),
      };
      list.push({
        id: 'q5',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}x － {b} ＝ {c}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(corr2, distractors),
        correctId: 'ok',
        correctDisplay: corr2.label,
        explanation: isEn
          ? `Add ${b}: ${a}x ＝ ${realDiff}. Divide by ${a} to get ${n2}/${d2}.`
          : `Προσθέτουμε ${b}: ${a}x ＝ ${realDiff}. Διαιρούμε με ${a} και βρίσκουμε ${n2}/${d2}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `${a}x ＝ ${realDiff}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: d2 === 1 ? `x ＝ ${n2}` : <Frac num={n2} den={d2} small /> },
        ],
        diagram: { left: `${a}x － ${b}`, mid: `${c}`, right: `${n2}/${d2}` },
      });
    }
  }

  // =========================================================================
  // Q6 (tf) — 5 παραλλαγές Σωστό/Λάθος με παρενθέσεις & διαδοχικές πράξεις
  // =========================================================================
  {
    const v = randInt(1, 5);
    const a = randInt(2, 5);
    const q = randInt(4, 9);
    const c = a * q;
    const b = randInt(2, 6);
    if (v % 2 === 1) {
      const x = q + b;
      const isTrue = Math.random() > 0.5;
      const shownX = isTrue ? x : Math.max(1, q - b);
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{a}(x － {b}) ＝ {c} ⇒ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Divide by ${a}: x － ${b} ＝ ${q}. Add ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x － ${b} ＝ ${q}. Προσθέτουμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x － ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}－${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else {
      const x = q - b;
      const isTrue = Math.random() > 0.5;
      const shownX = isTrue ? x : q + b;
      list.push({
        id: 'q6',
        type: 'tf',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'True or False:' : 'Σωστό ή Λάθος:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＝ {c} ⇒ x ＝ {shownX}</span>
          </span>
        ),
        correctBool: isTrue,
        correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
        explanation: isEn
          ? `Divide by ${a}: x ＋ ${b} ＝ ${q}. Subtract ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x ＋ ${b} ＝ ${q}. Αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＋ ${b} ＝ ${q}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}＋${b})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q7 (input) — 5 παραλλαγές εξισώσεων με κλάσμα / διαίρεση (x : d) ± b = c
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const d = randInt(3, 6);
      const q = randInt(4, 9);
      const x = d * q;
      const b = randInt(2, 6);
      const c = q - b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">(x : {d}) － {b} ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Add ${b}: x : ${d} ＝ ${q}. Multiply by ${d}: x ＝ ${x}.`
          : `Προσθέτουμε ${b}: x : ${d} ＝ ${q}. Πολλαπλασιάζουμε με ${d}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x : ${d} ＝ ${q}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x:${d})－${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 2) {
      const d = randInt(3, 6);
      const q = randInt(3, 8);
      const x = d * q;
      const b = randInt(2, 8);
      const c = q + b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num="x" den={d} small />
              <span>＋ {b} ＝ {c}</span>
            </span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${b}: x/${d} ＝ ${q}. Multiply by ${d}: x ＝ ${x}.`
          : `Αφαιρούμε ${b}: x/${d} ＝ ${q}. Πολλαπλασιάζουμε με ${d}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x : ${d} ＝ ${q}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(x/${d})＋${b}`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const d = randInt(2, 5);
      const q = randInt(4, 9);
      const b = randInt(2, 7);
      const x = d * q + b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">(x － {b}) : {d} ＝ {q}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Multiply by ${d}: x － ${b} ＝ ${d * q}. Add ${b}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε με ${d}: x － ${b} ＝ ${d * q}. Προσθέτουμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x － ${b} ＝ ${d * q}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(${x}－${b}):${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else if (v === 4) {
      const d = randInt(2, 5);
      const q = randInt(4, 9);
      const b = randInt(2, 7);
      const x = d * q - b;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">(x ＋ {b}) : {d} ＝ {q}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Multiply by ${d}: x ＋ ${b} ＝ ${d * q}. Subtract ${b}: x ＝ ${x}.`
          : `Πολλαπλασιάζουμε με ${d}: x ＋ ${b} ＝ ${d * q}. Αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＋ ${b} ＝ ${d * q}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `(${x}＋${b}):${d}`, mid: `${q}`, right: `x ＝ ${x}` },
      });
    } else {
      const d = randInt(2, 4);
      const m = randInt(2, 3);
      const x = randInt(3, 8);
      const q = (m * x) / d;
      const cleanX = d * randInt(2, 5);
      const cleanQ = (m * cleanX) / d;
      list.push({
        id: 'q7',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <Frac num={`${m}x`} den={d} small />
            <span className="font-mono">＝ {cleanQ}</span>
          </span>
        ),
        correctNumber: cleanX,
        correctDisplay: <span className="font-mono">x ＝ {cleanX}</span>,
        explanation: isEn
          ? `Multiply by ${d}: ${m}x ＝ ${cleanQ * d}. Divide by ${m}: x ＝ ${cleanX}.`
          : `Πολλαπλασιάζουμε με ${d}: ${m}x ＝ ${cleanQ * d}. Διαιρούμε με ${m}: x ＝ ${cleanX}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `${m}x ＝ ${cleanQ * d}` },
          { step: '2', op: isEn ? `Divide by ${m}` : `Διαιρούμε με ${m}`, res: `x ＝ ${cleanX}` },
        ],
        diagram: { left: `${m}·${cleanX}/${d}`, mid: `${cleanQ}`, right: `x ＝ ${cleanX}` },
      });
    }
  }

  // =========================================================================
  // Q8 (mcq) — 5 διαφορετικά προβλήματα εφαρμογής με μονάδες μέτρησης
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const rate = randInt(4, 8);
      const hours = randInt(3, 6);
      const baseFee = randInt(10, 22);
      const total = rate * hours + baseFee;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {hours} h</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {hours + 1} h</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {total - baseFee} h</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, hours - 1)} h</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `A technician charges a fixed fee of ${baseFee} € plus ${rate} € per hour (x). Total bill is ${total} €.`
          : `Ένας τεχνικός χρεώνει πάγιο ${baseFee} € και ${rate} € ανά ώρα εργασίας (x). Το συνολικό ποσό είναι ${total} €.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `${rate}x ＋ ${baseFee} ＝ ${total} ⇒ ${rate}x ＝ ${total - baseFee} ⇒ x ＝ ${hours} h.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${baseFee} €` : `Αφαιρούμε ${baseFee} €`, res: `${rate}x ＝ ${total - baseFee}` },
          { step: '2', op: isEn ? `Divide by ${rate}` : `Διαιρούμε με ${rate}`, res: `x ＝ ${hours} h` },
        ],
        diagram: { left: `${rate}x ＋ ${baseFee}`, mid: `${total} €`, right: `x ＝ ${hours} h` },
      });
    } else if (v === 2) {
      const base = randInt(8, 16);
      const side = randInt(5, 11);
      const perim = base + 2 * side;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {side} cm</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {perim - base} cm</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {side + 2} cm</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, side - 2)} cm</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `An isosceles triangle has base ${base} cm, equal sides x cm, and perimeter ${perim} cm. Find x.`
          : `Ένα ισοσκελές τρίγωνο έχει βάση ${base} cm, ίσες πλευρές μήκους x cm και περίμετρο ${perim} cm. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `2x ＋ ${base} ＝ ${perim} ⇒ 2x ＝ ${perim - base} ⇒ x ＝ ${side} cm.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${base} cm` : `Αφαιρούμε ${base} cm`, res: `2x ＝ ${perim - base}` },
          { step: '2', op: isEn ? 'Divide by 2' : 'Διαιρούμε με 2', res: `x ＝ ${side} cm` },
        ],
        diagram: { left: `2x ＋ ${base}`, mid: `${perim} cm`, right: `x ＝ ${side} cm` },
      });
    } else if (v === 3) {
      const people = randInt(4, 7);
      const share = randInt(6, 12);
      const discount = randInt(3, 6);
      const totalX = people * (share + discount);
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {totalX} €</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {people * share} €</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {people * (share - discount)} €</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {totalX + people} €</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `A bill of x € is split equally among ${people} friends, and each gets a ${discount} € voucher, paying ${share} €. Find x.`
          : `Ένας λογαριασμός x € μοιράζεται εξίσου σε ${people} φίλους και ο καθένας αφαιρεί κουπόνι ${discount} €, πληρώνοντας ${share} €. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `(x : ${people}) － ${discount} ＝ ${share} ⇒ x : ${people} ＝ ${share + discount} ⇒ x ＝ ${totalX} €.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${discount} €` : `Προσθέτουμε ${discount} €`, res: `x : ${people} ＝ ${share + discount}` },
          { step: '2', op: isEn ? `Multiply by ${people}` : `Πολλαπλασιάζουμε με ${people}`, res: `x ＝ ${totalX} €` },
        ],
        diagram: { left: `(x:${people})－${discount}`, mid: `${share} €`, right: `x ＝ ${totalX} €` },
      });
    } else if (v === 4) {
      const speed = randInt(50, 80);
      const time = randInt(2, 5);
      const extraDist = randInt(15, 35);
      const totalDist = speed * time + extraDist;
      const correctOpt = { id: 'ok', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {time} h</span> };
      const distractors = [
        { id: 'd1', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {time + 1} h</span> },
        { id: 'd2', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {time + 2} h</span> },
        { id: 'd3', label: <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">x ＝ {Math.max(1, time - 1)} h</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `A car travels at ${speed} km/h for x hours and then ${extraDist} km more, covering ${totalDist} km in total. Find x.`
          : `Ένα αυτοκίνητο κινείται με ${speed} km/h για x ώρες και διανύει ακόμη ${extraDist} km, φτάνοντας συνολικά τα ${totalDist} km. Να βρείτε το x.`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `${speed}x ＋ ${extraDist} ＝ ${totalDist} ⇒ ${speed}x ＝ ${totalDist - extraDist} ⇒ x ＝ ${time} h.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${extraDist} km` : `Αφαιρούμε ${extraDist} km`, res: `${speed}x ＝ ${totalDist - extraDist}` },
          { step: '2', op: isEn ? `Divide by ${speed}` : `Διαιρούμε με ${speed}`, res: `x ＝ ${time} h` },
        ],
        diagram: { left: `${speed}x ＋ ${extraDist}`, mid: `${totalDist} km`, right: `x ＝ ${time} h` },
      });
    } else {
      const m = randInt(3, 5);
      const x = randInt(7, 15);
      const diff = randInt(4, 10);
      const res = m * x - diff;
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {x + 2}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {Math.max(1, x - 2)}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {res + diff}</span> },
      ];
      list.push({
        id: 'q8',
        type: 'mcq',
        prompt: isEn
          ? `If you multiply a number x by ${m} and subtract ${diff}, you get ${res}. What is x?`
          : `Αν πολλαπλασιάσουμε έναν αριθμό x με το ${m} και αφαιρέσουμε ${diff}, βρίσκουμε ${res}. Ποιος είναι ο αριθμός x;`,
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: `${m}x － ${diff} ＝ ${res} ⇒ ${m}x ＝ ${res + diff} ⇒ x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Add ${diff}` : `Προσθέτουμε ${diff}`, res: `${m}x ＝ ${res + diff}` },
          { step: '2', op: isEn ? `Divide by ${m}` : `Διαιρούμε με ${m}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${m}x － ${diff}`, mid: `${res}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q9 (tf) — 5 παραλλαγές αναγνώρισης εξίσωσης 1ου βαθμού
  // =========================================================================
  {
    const v = randInt(1, 5);
    const claimLinear = Math.random() > 0.5;
    let isLinear = true;
    let expr = <span className="font-mono">5x － 9 ＝ 21</span>;
    let diagL = '5x － 9';
    let diagM = '21';

    if (v === 1) {
      isLinear = true;
      expr = <span className="font-mono">7x － 4 ＝ 24</span>;
      diagL = '7x － 4';
      diagM = '24';
    } else if (v === 2) {
      isLinear = false;
      expr = (
        <span className="inline-flex items-center gap-1 font-mono">
          <span>2</span>
          <Pow base="x" exp="2" />
          <span>－ 1 ＝ 17</span>
        </span>
      );
      diagL = '2x² － 1';
      diagM = '17';
    } else if (v === 3) {
      isLinear = false;
      expr = (
        <span className="inline-flex items-center gap-1 font-mono">
          <Pow base="x" exp="3" />
          <span>＋ 4 ＝ 12</span>
        </span>
      );
      diagL = 'x³ ＋ 4';
      diagM = '12';
    } else if (v === 4) {
      isLinear = true;
      expr = (
        <span className="inline-flex items-center gap-1 font-mono">
          <Frac num="x" den="4" small />
          <span>＋ 3 ＝ 8</span>
        </span>
      );
      diagL = 'x/4 ＋ 3';
      diagM = '8';
    } else {
      isLinear = false;
      expr = (
        <span className="inline-flex items-center gap-1 font-mono">
          <Pow base="x" exp="2" />
          <span>＋ 3x ＝ 10</span>
        </span>
      );
      diagL = 'x² ＋ 3x';
      diagM = '10';
    }

    const isTrue = isLinear === claimLinear;
    list.push({
      id: 'q9',
      type: 'tf',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            {isEn
              ? claimLinear
                ? 'True or False — First-degree equation:'
                : 'True or False — Not a first-degree equation:'
              : claimLinear
              ? 'Σωστό ή Λάθος — Εξίσωση 1ου βαθμού:'
              : 'Σωστό ή Λάθος — Όχι εξίσωση 1ου βαθμού:'}
          </span>
          {expr}
        </span>
      ),
      correctBool: isTrue,
      correctDisplay: <span>{isTrue ? (isEn ? 'True' : 'Σωστό') : isEn ? 'False' : 'Λάθος'}</span>,
      explanation: isEn
        ? isLinear
          ? 'The unknown x has exponent 1, so it is a first-degree equation.'
          : 'The highest exponent of x is greater than 1, so it is not a first-degree equation.'
        : isLinear
        ? 'Ο άγνωστος x έχει εκθέτη 1, άρα είναι εξίσωση πρώτου βαθμού.'
        : 'Ο μεγαλύτερος εκθέτης του x είναι μεγαλύτερος από 1, άρα δεν είναι εξίσωση πρώτου βαθμού.',
      tableData: [
        { step: '1', op: isEn ? 'Highest exponent of x' : 'Μέγιστος εκθέτης του x', res: isLinear ? '1' : '> 1' },
        { step: '2', op: isEn ? 'Classification' : 'Χαρακτηρισμός', res: isLinear ? (isEn ? '1st degree' : '1ου βαθμού') : (isEn ? 'Higher degree' : 'Όχι 1ου βαθμού') },
      ],
      diagram: { left: diagL, mid: diagM, right: isLinear ? '1ου βαθμού' : 'Όχι 1ου' },
    });
  }

  // =========================================================================
  // Q10 (input) — 5 παραλλαγές σύνθετων διπλών πράξεων
  // =========================================================================
  {
    const v = randInt(1, 5);
    if (v === 1) {
      const cleanD = 2;
      const cleanX = randInt(3, 9) * 2;
      const cleanA = randInt(2, 4);
      const cleanQ = (cleanA * cleanX) / cleanD;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">({cleanA}x) : {cleanD} ＝ {cleanQ}</span>
          </span>
        ),
        correctNumber: cleanX,
        correctDisplay: <span className="font-mono">x ＝ {cleanX}</span>,
        explanation: isEn
          ? `Multiply by ${cleanD}: ${cleanA}x ＝ ${cleanQ * cleanD}. Divide by ${cleanA}: x ＝ ${cleanX}.`
          : `Πολλαπλασιάζουμε με ${cleanD}: ${cleanA}x ＝ ${cleanQ * cleanD}. Διαιρούμε με ${cleanA}: x ＝ ${cleanX}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${cleanD}` : `Πολλαπλασιάζουμε με ${cleanD}`, res: `${cleanA}x ＝ ${cleanQ * cleanD}` },
          { step: '2', op: isEn ? `Divide by ${cleanA}` : `Διαιρούμε με ${cleanA}`, res: `x ＝ ${cleanX}` },
        ],
        diagram: { left: `${cleanA}·${cleanX} : ${cleanD}`, mid: `${cleanQ}`, right: `x ＝ ${cleanX}` },
      });
    } else if (v === 2) {
      const d = randInt(2, 4);
      const b = randInt(2, 6);
      const q = randInt(3, 7);
      const c = q + b;
      const x = d * q;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} ＋ (x : {d}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${b}: x : ${d} ＝ ${q}. Multiply by ${d}: x ＝ ${x}.`
          : `Αφαιρούμε ${b}: x : ${d} ＝ ${q}. Πολλαπλασιάζουμε με ${d}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x : ${d} ＝ ${q}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b} ＋ (${x}:${d})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    } else if (v === 3) {
      const m = randInt(2, 4);
      const x = randInt(3, 8);
      const b = randInt(2, 7);
      const d = randInt(2, 3);
      const q = (m * x + b) % d === 0 ? (m * x + b) / d : null;
      const validX = q !== null ? x : x + 1;
      const validQ = (m * validX + b) / d;
      const safeD = 2;
      const safeM = 3;
      const safeX = randInt(2, 6) * 2;
      const safeB = randInt(1, 4) * 2;
      const safeQ = (safeM * safeX + safeB) / safeD;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">({safeM}x ＋ {safeB}) : {safeD} ＝ {safeQ}</span>
          </span>
        ),
        correctNumber: safeX,
        correctDisplay: <span className="font-mono">x ＝ {safeX}</span>,
        explanation: isEn
          ? `Multiply by ${safeD}: ${safeM}x ＋ ${safeB} ＝ ${safeQ * safeD}. Subtract ${safeB} and divide by ${safeM}: x ＝ ${safeX}.`
          : `Πολλαπλασιάζουμε με ${safeD}: ${safeM}x ＋ ${safeB} ＝ ${safeQ * safeD}. Αφαιρούμε ${safeB} και διαιρούμε με ${safeM}: x ＝ ${safeX}.`,
        tableData: [
          { step: '1', op: isEn ? `Multiply by ${safeD}` : `Πολλαπλασιάζουμε με ${safeD}`, res: `${safeM}x ＋ ${safeB} ＝ ${safeQ * safeD}` },
          { step: '2', op: isEn ? `Subtract ${safeB}, divide by ${safeM}` : `Αφαιρούμε ${safeB}, διαιρούμε με ${safeM}`, res: `x ＝ ${safeX}` },
        ],
        diagram: { left: `(${safeM}·${safeX}＋${safeB}):${safeD}`, mid: `${safeQ}`, right: `x ＝ ${safeX}` },
      });
    } else if (v === 4) {
      const a = randInt(2, 4);
      const x = randInt(4, 9);
      const b = randInt(2, 6);
      const k = randInt(2, 7);
      const rhs = a * (x - b) + k;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x － {b}) ＋ {k} ＝ {rhs}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `Subtract ${k}: ${a}(x － ${b}) ＝ ${a * (x - b)}. Divide by ${a}: x － ${b} ＝ ${x - b}, so x ＝ ${x}.`
          : `Αφαιρούμε ${k}: ${a}(x － ${b}) ＝ ${a * (x - b)}. Διαιρούμε με ${a}: x － ${b} ＝ ${x - b}, άρα x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${k}` : `Αφαιρούμε ${k}`, res: `${a}(x － ${b}) ＝ ${a * (x - b)}` },
          { step: '2', op: isEn ? `Divide by ${a}, add ${b}` : `Διαιρούμε με ${a}, προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(${x}－${b})＋${k}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    } else {
      const d = randInt(2, 5);
      const q = randInt(3, 7);
      const x = d * q;
      const b = q + randInt(3, 8);
      const c = b - q;
      list.push({
        id: 'q10',
        type: 'input',
        unit: '',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{b} － (x : {d}) ＝ {c}</span>
          </span>
        ),
        correctNumber: x,
        correctDisplay: <span className="font-mono">x ＝ {x}</span>,
        explanation: isEn
          ? `The subtracted term x : ${d} equals ${b} － ${c} ＝ ${q}, so x ＝ ${q} · ${d} ＝ ${x}.`
          : `Το αφαιρετέο x : ${d} ισούται με ${b} － ${c} ＝ ${q}, άρα x ＝ ${q} · ${d} ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Find x : ${d} = ${b} − ${c}` : `Βρίσκουμε x : ${d} ＝ ${b} － ${c}`, res: `x : ${d} ＝ ${q}` },
          { step: '2', op: isEn ? `Multiply by ${d}` : `Πολλαπλασιάζουμε με ${d}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${b} － (${x}:${d})`, mid: `${c}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q11 (mcq) — 5 παραλλαγές πολλαπλής επιλογής με παρενθέσεις & συντελεστές
  // =========================================================================
  {
    const v = randInt(1, 5);
    const a = randInt(3, 6);
    const x = randInt(4, 9);
    const b = randInt(2, 6);
    if (v % 2 === 1) {
      const rhs = a * (x - b);
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {x - b}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {Math.max(1, rhs / a - b)}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {x + b}</span> },
      ];
      list.push({
        id: 'q11',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x － {b}) ＝ {rhs}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Divide by ${a}: x － ${b} ＝ ${rhs / a}. Add ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x － ${b} ＝ ${rhs / a}. Προσθέτουμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x － ${b} ＝ ${rhs / a}` },
          { step: '2', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(x－${b})`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    } else {
      const rhs = a * (x + b);
      const correctOpt = { id: 'ok', label: <span className="font-mono">x ＝ {x}</span> };
      const distractors = [
        { id: 'd1', label: <span className="font-mono">x ＝ {x + b}</span> },
        { id: 'd2', label: <span className="font-mono">x ＝ {rhs / a + b}</span> },
        { id: 'd3', label: <span className="font-mono">x ＝ {Math.max(1, x - 1)}</span> },
      ];
      list.push({
        id: 'q11',
        type: 'mcq',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{isEn ? 'Solve the equation:' : 'Να λύσετε την εξίσωση:'}</span>
            <span className="font-mono">{a}(x ＋ {b}) ＝ {rhs}</span>
          </span>
        ),
        options: ensureFourUniqueOptions(correctOpt, distractors),
        correctId: 'ok',
        correctDisplay: correctOpt.label,
        explanation: isEn
          ? `Divide by ${a}: x ＋ ${b} ＝ ${rhs / a}. Subtract ${b}: x ＝ ${x}.`
          : `Διαιρούμε με ${a}: x ＋ ${b} ＝ ${rhs / a}. Αφαιρούμε ${b}: x ＝ ${x}.`,
        tableData: [
          { step: '1', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＋ ${b} ＝ ${rhs / a}` },
          { step: '2', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}(x＋${b})`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  // =========================================================================
  // Q12 (input) — 5 παραλλαγές απαιτητικών εξισώσεων
  // =========================================================================
  {
    const v = randInt(1, 5);
    const a = randInt(4, 8);
    const x = randInt(5, 14);
    const b = randInt(7, 19);
    if (v <= 3) {
      const rhs = a * x + b;
      list.push({
        id: 'q12',
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
          ? `Subtract ${b} from ${rhs} to get ${a * x}, then divide by ${a} to get ${x}.`
          : `Αφαιρούμε το ${b} από το ${rhs} (βρίσκουμε ${a * x}) και διαιρούμε με το ${a} (βρίσκουμε ${x}).`,
        tableData: [
          { step: '1', op: isEn ? `Subtract ${b}` : `Αφαιρούμε ${b}`, res: `${a}x ＝ ${a * x}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}·${x}＋${b}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    } else {
      const rhs = a * x - b;
      list.push({
        id: 'q12',
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
          ? `Add ${b} to ${rhs} to get ${a * x}, then divide by ${a} to get ${x}.`
          : `Προσθέτουμε το ${b} στο ${rhs} (βρίσκουμε ${a * x}) και διαιρούμε με το ${a} (βρίσκουμε ${x}).`,
        tableData: [
          { step: '1', op: isEn ? `Add ${b}` : `Προσθέτουμε ${b}`, res: `${a}x ＝ ${a * x}` },
          { step: '2', op: isEn ? `Divide by ${a}` : `Διαιρούμε με ${a}`, res: `x ＝ ${x}` },
        ],
        diagram: { left: `${a}·${x}－${b}`, mid: `${rhs}`, right: `x ＝ ${x}` },
      });
    }
  }

  return list;
}

export default function EksisosiExercisesPage() {
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
    url: `${baseUrl}/b-gymnasiou/11-eksisosi-ask`,
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
      href="/b-gymnasiou/11-eksisosi"
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
      backUrl="/b-gymnasiou/11-eksisosi"
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
                            <text x="61" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                              {q.diagram.left}
                            </text>
                            <text x="129" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill="#475569" fontFamily="monospace">
                              ＝
                            </text>
                            <rect x="140" y="6" width="82" height="32" rx="7" fill="#f8fafc" stroke="#64748b" strokeWidth="1.4" />
                            <text x="181" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a" fontFamily="monospace">
                              {q.diagram.mid}
                            </text>
                            <text x="233" y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill="#059669" fontFamily="monospace">
                              →
                            </text>
                            <rect x="244" y="6" width="112" height="32" rx="7" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                            <text x="300" y="26" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
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