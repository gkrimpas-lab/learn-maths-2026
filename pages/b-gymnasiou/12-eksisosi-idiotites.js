import React, { useState, useMemo } from 'react';
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

function sanitizeEquationInput(raw = '') {
  return String(raw)
    .replace(/[XΧχ]/g, 'x')
    .replace(/[^0-9x+\-*/()=.,\s＋－−–·×:÷＝]/g, '');
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

// ============================================================================
// ΑΚΡΙΒΗΣ ΡΗΤΗ ΑΡΙΘΜΗΤΙΚΗ & PARSER ΓΡΑΜΜΙΚΩΝ ΕΞΙΣΩΣΕΩΝ (ΧΩΡΙΣ eval)
// ============================================================================
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

function makeRat(num, den = 1) {
  if (den === 0) throw new Error('DIV_BY_ZERO');
  if (num === 0) return { num: 0, den: 1 };
  const sign = den < 0 ? -1 : 1;
  const n = sign * num;
  const d = Math.abs(den);
  const g = gcdInt(n, d);
  return { num: n / g, den: d / g };
}

function rAdd(r1, r2) {
  return makeRat(r1.num * r2.den + r2.num * r1.den, r1.den * r2.den);
}
function rSub(r1, r2) {
  return makeRat(r1.num * r2.den - r2.num * r1.den, r1.den * r2.den);
}
function rMul(r1, r2) {
  return makeRat(r1.num * r2.num, r1.den * r2.den);
}
function rDiv(r1, r2) {
  if (r2.num === 0) throw new Error('DIV_BY_ZERO');
  return makeRat(r1.num * r2.den, r1.den * r2.num);
}
function rNeg(r) {
  return makeRat(-r.num, r.den);
}
function rAbs(r) {
  return { num: Math.abs(r.num), den: r.den };
}
function rIsZero(r) {
  return r.num === 0;
}
function rIsOne(r) {
  return r.num === 1 && r.den === 1;
}
function rIsNegOne(r) {
  return r.num === -1 && r.den === 1;
}

function decimalToRat(str) {
  if (!str.includes('.')) {
    return makeRat(parseInt(str, 10), 1);
  }
  const [intPart, fracPart] = str.split('.');
  const scale = Math.pow(10, fracPart.length);
  const num = parseInt((intPart || '0') + fracPart, 10);
  return makeRat(num, scale);
}

function tokenizeExpr(raw) {
  const s = raw
    .replace(/\s+/g, '')
    .replace(/＋/g, '+')
    .replace(/[－−–]/g, '-')
    .replace(/[·×]/g, '*')
    .replace(/[:÷]/g, '/')
    .replace(/[χΧX]/g, 'x')
    .replace(/,/g, '.');

  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dots = 0;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        if (s[i] === '.') dots += 1;
        if (dots > 1) throw new Error('SYNTAX');
        numStr += s[i];
        i += 1;
      }
      if (numStr === '.') throw new Error('SYNTAX');
      tokens.push({ type: 'NUM', value: decimalToRat(numStr) });
    } else if (ch === 'x') {
      tokens.push({ type: 'VAR' });
      i += 1;
    } else if ('+-*/()'.includes(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i += 1;
    } else {
      throw new Error('INVALID_CHAR');
    }
  }
  return tokens;
}

function parseLinearSide(rawSide) {
  const tokens = tokenizeExpr(rawSide);
  if (tokens.length === 0) throw new Error('EMPTY_SIDE');
  let pos = 0;
  let hasParens = tokens.some((tk) => tk.type === 'OP' && (tk.value === '(' || tk.value === ')'));

  const peek = () => tokens[pos] || null;
  const consume = () => tokens[pos++];

  const parseExpr = () => {
    let left = parseTerm();
    while (peek() && peek().type === 'OP' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left =
        op === '+'
          ? { a: rAdd(left.a, right.a), b: rAdd(left.b, right.b) }
          : { a: rSub(left.a, right.a), b: rSub(left.b, right.b) };
    }
    return left;
  };

  const parseTerm = () => {
    let left = parseFactor();
    while (true) {
      const next = peek();
      if (!next) break;
      if (next.type === 'OP' && (next.value === '*' || next.value === '/')) {
        const op = consume().value;
        const right = parseFactor();
        if (op === '*') {
          if (!rIsZero(left.a) && !rIsZero(right.a)) throw new Error('NON_LINEAR');
          if (!rIsZero(left.a)) {
            left = { a: rMul(left.a, right.b), b: rMul(left.b, right.b) };
          } else {
            left = { a: rMul(left.b, right.a), b: rMul(left.b, right.b) };
          }
        } else {
          if (!rIsZero(right.a)) throw new Error('DIV_BY_VAR');
          if (rIsZero(right.b)) throw new Error('DIV_BY_ZERO');
          left = { a: rDiv(left.a, right.b), b: rDiv(left.b, right.b) };
        }
      } else if (next.type === 'VAR' || (next.type === 'OP' && next.value === '(')) {
        // Σιωπηρός πολλαπλασιασμός π.χ. 2x, 3(x+1), (x+1)(2)
        const right = parseFactor();
        if (!rIsZero(left.a) && !rIsZero(right.a)) throw new Error('NON_LINEAR');
        if (!rIsZero(left.a)) {
          left = { a: rMul(left.a, right.b), b: rMul(left.b, right.b) };
        } else {
          left = { a: rMul(left.b, right.a), b: rMul(left.b, right.b) };
        }
      } else {
        break;
      }
    }
    return left;
  };

  const parseFactor = () => {
    const tk = peek();
    if (!tk) throw new Error('SYNTAX');
    if (tk.type === 'OP' && tk.value === '+') {
      consume();
      return parseFactor();
    }
    if (tk.type === 'OP' && tk.value === '-') {
      consume();
      const val = parseFactor();
      return { a: rNeg(val.a), b: rNeg(val.b) };
    }
    if (tk.type === 'OP' && tk.value === '(') {
      consume();
      const val = parseExpr();
      const close = peek();
      if (!close || close.type !== 'OP' || close.value !== ')') throw new Error('UNMATCHED_PAREN');
      consume();
      return val;
    }
    if (tk.type === 'NUM') {
      consume();
      return { a: makeRat(0), b: tk.value };
    }
    if (tk.type === 'VAR') {
      consume();
      return { a: makeRat(1), b: makeRat(0) };
    }
    throw new Error('SYNTAX');
  };

  const res = parseExpr();
  if (pos !== tokens.length) throw new Error('SYNTAX');
  return { ...res, hasParens };
}

function RatView({ r, parensIfNeg = false }) {
  const isNeg = r.num < 0;
  const absNum = Math.abs(r.num);
  const content =
    r.den === 1 ? (
      <span>{r.num}</span>
    ) : (
      <span className="inline-flex items-center whitespace-nowrap">
        {isNeg ? <span>-</span> : null}
        <Frac num={absNum} den={r.den} small />
      </span>
    );
  if (parensIfNeg && isNeg) {
    return (
      <span className="inline-flex items-center whitespace-nowrap">
        <span>(</span>
        {content}
        <span>)</span>
      </span>
    );
  }
  return content;
}

function LinearView({ a, b }) {
  const aZero = rIsZero(a);
  const bZero = rIsZero(b);
  if (aZero && bZero) return <span>0</span>;
  if (aZero) return <RatView r={b} />;

  const xTerm = rIsOne(a) ? (
    <span>x</span>
  ) : rIsNegOne(a) ? (
    <span>-x</span>
  ) : (
    <span className="inline-flex items-center whitespace-nowrap">
      <RatView r={a} />
      <span>x</span>
    </span>
  );

  if (bZero) return xTerm;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {xTerm}
      <span>{b.num > 0 ? '＋' : '－'}</span>
      <RatView r={rAbs(b)} />
    </span>
  );
}

function solveCustomEquation(rawInput, isEn) {
  const normalized = String(rawInput || '').replace(/＝/g, '=').trim();
  if (!normalized) return { error: isEn ? 'Enter an equation to solve.' : 'Γράψε μια εξίσωση για να τη λύσουμε.' };

  const parts = normalized.split('=');
  if (parts.length !== 2) {
    return {
      error: isEn
        ? 'An equation must contain exactly one equals sign (=).'
        : 'Η εξίσωση πρέπει να περιέχει ακριβώς ένα σύμβολο ίσον (=).',
    };
  }

  try {
    const left = parseLinearSide(parts[0]);
    const right = parseLinearSide(parts[1]);

    const steps = [];

    // Βήμα 1: Αρχική εξίσωση
    steps.push({
      title: isEn ? 'Initial equation' : 'Αρχική εξίσωση',
      expr: <span className="font-mono">{normalized}</span>,
    });

    // Βήμα 2: Απαλοιφή παρενθέσεων & απλοποίηση μελών
    steps.push({
      title:
        left.hasParens || right.hasParens
          ? isEn
            ? 'Expand parentheses & simplify each side'
            : 'Απαλοιφή παρενθέσεων & αναγωγή ομοίων όρων σε κάθε μέλος'
          : isEn
          ? 'Simplify both sides'
          : 'Απλοποίηση των δύο μελών',
      expr: (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
          <span>⇔</span>
          <LinearView a={left.a} b={left.b} />
          <span>＝</span>
          <LinearView a={right.a} b={right.b} />
        </span>
      ),
    });

    let curA = left.a;
    let curB = left.b;
    let curRhsB = right.b;

    // Βήμα 3: Αφαίρεση του όρου x από το δεξί μέλος (αν right.a !== 0)
    if (!rIsZero(right.a)) {
      const opSign = right.a.num > 0 ? '－' : '＋';
      const absA = rAbs(right.a);
      curA = rSub(curA, right.a);
      steps.push({
        title: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {right.a.num > 0
                ? isEn
                  ? 'Subtract from both sides:'
                  : 'Αφαιρούμε και από τα δύο μέλη:'
                : isEn
                ? 'Add to both sides:'
                : 'Προσθέτουμε και στα δύο μέλη:'}
            </span>
            <span className="font-mono font-bold">
              {opSign}{' '}
              {rIsOne(absA) ? (
                'x'
              ) : (
                <span className="inline-flex items-center">
                  <RatView r={absA} />x
                </span>
              )}
            </span>
          </span>
        ),
        expr: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
            <span>⇔</span>
            <LinearView a={curA} b={curB} />
            <span>＝</span>
            <RatView r={curRhsB} />
          </span>
        ),
      });
    }

    // Βήμα 4: Απομόνωση του όρου με x (αφαίρεση/πρόσθεση curB και στα δύο μέλη)
    if (!rIsZero(curB)) {
      const opSign = curB.num > 0 ? '－' : '＋';
      const absB = rAbs(curB);
      curRhsB = rSub(curRhsB, curB);
      curB = makeRat(0);
      steps.push({
        title: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {opSign === '－'
                ? isEn
                  ? 'Subtract from both sides:'
                  : 'Αφαιρούμε και από τα δύο μέλη:'
                : isEn
                ? 'Add to both sides:'
                : 'Προσθέτουμε και στα δύο μέλη:'}
            </span>
            <span className="font-mono font-bold">
              {opSign} <RatView r={absB} />
            </span>
          </span>
        ),
        expr: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
            <span>⇔</span>
            {rIsZero(curA) ? <span>0 · x</span> : <LinearView a={curA} b={makeRat(0)} />}
            <span>＝</span>
            <RatView r={curRhsB} />
          </span>
        ),
      });
    } else if (rIsZero(curA)) {
      steps.push({
        title: isEn ? 'Reduced form' : 'Ανηγμένη μορφή αx ＝ β',
        expr: (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
            <span>⇔ 0 · x ＝</span>
            <RatView r={curRhsB} />
          </span>
        ),
      });
    }

    // Βήμα 5: Τελική κατάταξη & λύση
    if (!rIsZero(curA)) {
      const sol = rDiv(curRhsB, curA);
      if (!rIsOne(curA)) {
        steps.push({
          title: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'Divide both sides by' : 'Διαιρούμε και τα δύο μέλη με'}</span>
              <span className="font-mono font-bold">
                <RatView r={curA} parensIfNeg />
              </span>
            </span>
          ),
          expr: (
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono font-black text-emerald-700">
              <span>⇔ x ＝</span>
              <RatView r={sol} />
            </span>
          ),
        });
      }
      return {
        caseType: 'unique',
        solution: sol,
        steps,
      };
    }

    if (rIsZero(curRhsB)) {
      return {
        caseType: 'identity',
        steps,
      };
    }

    return {
      caseType: 'impossible',
      steps,
    };
  } catch (err) {
    const code = err?.message || 'SYNTAX';
    const messages = {
      DIV_BY_ZERO: isEn
        ? 'Division by zero is not allowed.'
        : 'Δεν επιτρέπεται η διαίρεση με το μηδέν (0).',
      DIV_BY_VAR: isEn
        ? 'Division by the unknown x is not a first-degree equation.'
        : 'Η διαίρεση με τον άγνωστο x δεν αποτελεί εξίσωση 1ου βαθμού.',
      NON_LINEAR: isEn
        ? 'This is not a first-degree equation (contains x multiplied by x).'
        : 'Η εξίσωση δεν είναι 1ου βαθμού (περιέχει γινόμενο του x με τον εαυτό του).',
      UNMATCHED_PAREN: isEn
        ? 'Check your parentheses — a closing parenthesis ")" is missing.'
        : 'Έλεγξε τις παρενθέσεις σου — λείπει κάποια παρένθεση κλεισίματος ")".',
      INVALID_CHAR: isEn
        ? 'Use only numbers, x, +, -, *, /, (, ), and =.'
        : 'Χρησιμοποίησε μόνο αριθμούς, το x, τις πράξεις +, -, *, /, παρενθέσεις ( ) και =.',
      EMPTY_SIDE: isEn
        ? 'Both sides of the equals sign (=) must be non-empty.'
        : 'Και τα δύο μέλη της εξίσωσης (αριστερά και δεξιά του =) πρέπει να έχουν όρους.',
      SYNTAX: isEn
        ? 'Check the syntax of your equation (e.g. 2(x + 3) = 10).'
        : 'Έλεγξε τη σύνταξη της εξίσωσης (π.χ. 2(x + 3) = 10).',
    };
    return { error: messages[code] || messages.SYNTAX };
  }
}

const I18N = {
  el: {
    pageTitle: "Ιδιότητες Διατήρησης Ισότητας & Ισοδύναμες Εξισώσεις | Κεφ. 11 | Β' Γυμνασίου",
    metaDesc:
      "Μάθε τις ιδιότητες διατήρησης της ισότητας, τις ισοδύναμες εξισώσεις, λύσε τη δική σου εξίσωση βήμα-βήμα και δες πότε έχει μία, άπειρες ή καμία λύση.",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 11 • Β' ΓΥΜΝΑΣΙΟΥ",
    backText: "Β' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    solve12Btn: "ΛΥΣΕ 12 ΑΣΚΗΣΕΙΣ",
    labBtn: "ΕΡΓΑΣΤΗΡΙΟ ΕΠΙΛΥΣΗΣ",
    heroTitle: "Ιδιότητες Διατήρησης Ισότητας, Ισοδύναμες Εξισώσεις & Πλήθος Λύσεων",
    heroDesc:
      "Ανακάλυψε πώς διατηρείται η ισορροπία μιας εξίσωσης όταν εφαρμόζουμε την ίδια πράξη και στα δύο μέλη, τι είναι οι ισοδύναμες εξισώσεις και πότε μια εξίσωση έχει μία, άπειρες ή καμία λύση.",
    card1Title: "Ιδιότητα Πρόσθεσης & Αφαίρεσης στην Ισότητα",
    card1Body:
      "Αν προσθέσουμε ή αφαιρέσουμε τον ίδιο αριθμό (ή παράσταση) και στα δύο μέλη μιας εξίσωσης, η ισότητα διατηρείται και παίρνουμε μια ισοδύναμη εξίσωση.",
    card1Rule1: "Αν Α ＝ Β, τότε Α ＋ γ ＝ Β ＋ γ",
    card1Rule2: "Αν Α ＝ Β, τότε Α － γ ＝ Β － γ",
    card1SvgAria: "Ζυγαριά ισορροπίας που δείχνει προσθήκη ίδιου όρου και στα δύο μέλη",
    card2Title: "Ιδιότητα Πολλαπλασιασμού & Διαίρεσης στην Ισότητα",
    card2Body:
      "Αν πολλαπλασιάσουμε ή διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με τον ίδιο μη μηδενικό αριθμό (γ ≠ 0), η ισότητα διατηρείται και η νέα εξίσωση είναι ισοδύναμη με την αρχική.",
    card2Rule1: "Αν Α ＝ Β και γ ≠ 0, τότε Α · γ ＝ Β · γ",
    card2Rule2: "Αν Α ＝ Β και γ ≠ 0, τότε",
    card2Warn: "Προσοχή: Ποτέ δεν διαιρούμε ούτε πολλαπλασιάζουμε τα δύο μέλη με το 0!",
    card3Title: "Ισοδύναμες Εξισώσεις",
    card3Body:
      "Δύο εξισώσεις λέγονται ισοδύναμες (συμβολίζουμε με ⇔) όταν έχουν ακριβώς τις ίδιες λύσεις. Εφαρμόζοντας τις ιδιότητες διατήρησης της ισότητας μετατρέπουμε μια εξίσωση σε απλούστερη ισοδύναμη μέχρι να βρούμε το x.",
    card3Ex1: "2x ＋ 4 ＝ 10  ⇔  2x ＝ 6  ⇔  x ＝ 3",
    card3Ex2: "Όλες οι παραπάνω εξισώσεις έχουν μοναδική λύση το x ＝ 3.",
    card4Title: "Μία Λύση, Άπειρες Λύσεις (Ταυτότητα) & Καμία Λύση (Αδύνατη)",
    card4Body:
      "Κάθε εξίσωση 1ου βαθμού οδηγείται στη μορφή αx ＝ β. Ανάλογα με τις τιμές των α και β έχουμε 3 περιπτώσεις:",
    card4Case1Title: "1. Μοναδική λύση (α ≠ 0):",
    card4Case2Title: "2. Άπειρες λύσεις — Ταυτότητα (α ＝ 0 και β ＝ 0):",
    card4Case2Desc: "0 · x ＝ 0 (αληθεύει για κάθε x)",
    card4Case3Title: "3. Καμία λύση — Αδύνατη (α ＝ 0 και β ≠ 0):",
    card4Case3Desc: "0 · x ＝ β (π.χ. 0 · x ＝ 5, αδύνατη)",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟΣ ΕΠΙΛΥΤΗΣ ΕΞΙΣΩΣΕΩΝ",
    labTitle: "Γράψε τη Δική σου Εξίσωση & Δες τη Λύση Βήμα-Βήμα",
    labDesc:
      "Πληκτρολόγησε οποιαδήποτε εξίσωση 1ου βαθμού με +, -, *, /, παρενθέσεις και = (ή διάλεξε ένα έτοιμο παράδειγμα) για να δεις αναλυτικά τα βήματα με ιδιότητες ισότητας, σειρά πράξεων και πρόσημα.",
    inputLabel: "Η εξίσωσή σου:",
    inputPlaceholder: "π.χ. 3(x - 2) + 4 = x + 10",
    clearBtn: "Καθαρισμός",
    examplesLabel: "Έτοιμα παραδείγματα:",
    stepsHeading: "Ανάλυση Βήμα προς Βήμα",
    verdictUnique: "ΜΟΝΑΔΙΚΗ ΛΥΣΗ",
    verdictIdentity: "ΑΠΕΙΡΕΣ ΛΥΣΕΙΣ (ΤΑΥΤΟΤΗΤΑ)",
    verdictImpossible: "ΚΑΜΙΑ ΛΥΣΗ (ΑΔΥΝΑΤΗ)",
    verdictIdentityDesc: "Η ισότητα 0 · x ＝ 0 αληθεύει για κάθε αριθμό x.",
    verdictImpossibleDesc: "Η ισότητα 0 · x ＝ β (με β ≠ 0) δεν επαληθεύεται για κανέναν αριθμό x.",
    problemsHeading: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1",
    prob1Title:
      "Σε μια ζυγαριά ισορροπίας, στον αριστερό δίσκο υπάρχουν 3 όμοια κουτιά βάρους x kg και ένα βαρίδι 4 kg, ενώ στον δεξιό δίσκο υπάρχει ένα βαρίδι 19 kg. Με χρήση ιδιοτήτων ισότητας να βρείτε το βάρος x κάθε κουτιού.",
    prob1SvgAria: "Ζυγαριά ισορροπίας για την εξίσωση 3x + 4 = 19",
    prob1Step1: "1. Αρχική εξίσωση",
    prob1Step2: "2. Αφαιρούμε 4 και από τα δύο μέλη",
    prob1Step3: "3. Διαιρούμε και τα δύο μέλη με 3",
    prob1Final: "Τελική Απάντηση: Κάθε κουτί ζυγίζει x ＝ 5 kg.",
    prob2Badge: "ΠΡΟΒΛΗΜΑ 2",
    prob2Title:
      "Να εξετάσετε αν έχουν λύση οι εξισώσεις: (i) 2(x ＋ 3) ＝ 2x ＋ 6 και (ii) 3(x － 1) ＝ 3x ＋ 4.",
    prob2SvgAria: "Σύγκριση ταυτότητας 0x = 0 και αδύνατης εξίσωσης 0x = 7",
    prob2Step1: "1. Απαλοιφή παρενθέσεων στην (i)",
    prob2Step2: "2. Αφαιρούμε 2x και 6 από τα δύο μέλη",
    prob2Step3: "3. Απαλοιφή παρενθέσεων στην (ii)",
    prob2Step4: "4. Αφαιρούμε 3x και προσθέτουμε 3 στα δύο μέλη",
    prob2Final: "Τελική Απάντηση: Η (i) έχει άπειρες λύσεις (ταυτότητα), ενώ η (ii) δεν έχει καμία λύση (αδύνατη).",
    colStep: "Βήμα",
    colAnalysis: "Ανάλυση / Ιδιότητα Ισότητας",
    alertTitle: "Προσοχή! Τα 3 πιο Κλασικά Λάθη στις Ιδιότητες Ισότητας",
    err1Bold: "Εφαρμογή πράξης μόνο στο ένα μέλος:",
    err1Text: "Ό,τι προσθέτουμε, αφαιρούμε, πολλαπλασιάζουμε ή διαιρούμε στο αριστερό μέλος, πρέπει να το κάνουμε υποχρεωτικά και στο δεξιό μέλος.",
    err2Bold: "Διαίρεση με το μηδέν:",
    err2Text: "Στην εξίσωση 0 · x ＝ 5 δεν επιτρέπεται να γράψουμε x ＝ 5 : 0. Η εξίσωση είναι αδύνατη.",
    err3Bold: "Σύγχυση ταυτότητας και αδύνατης εξίσωσης:",
    err3Text: "Η 0 · x ＝ 0 έχει άπειρες λύσεις (κάθε x), ενώ η 0 · x ＝ 4 δεν έχει καμία λύση.",
    bottomTitle: "Έτοιμος να δοκιμάσεις τις δυνάμεις σου;",
    bottomDesc:
      "Λύσε 12 δυναμικές ασκήσεις πάνω στις ιδιότητες διατήρησης ισότητας, τις ισοδύναμες εξισώσεις και το πλήθος λύσεων.",
    bottomBtn: "ΞΕΚΙΝΑ ΤΙΣ ΑΣΚΗΣΕΙΣ",
    schemaName: "Ιδιότητες Διατήρησης Ισότητας & Ισοδύναμες Εξισώσεις",
  },
  en: {
    pageTitle: "Properties of Equality & Equivalent Equations | Ch. 11 | 8th Grade",
    metaDesc:
      "Learn the properties of equality, equivalent equations, solve your own equation step-by-step, and explore unique, infinite, and no-solution cases.",
    chapterBadge: "CHAPTER 11 • 8TH GRADE",
    backText: "Grade 8",
    exercisesBtn: "EXERCISES",
    solve12Btn: "SOLVE 12 EXERCISES",
    labBtn: "EQUATION SOLVER",
    heroTitle: "Properties of Equality, Equivalent Equations & Number of Solutions",
    heroDesc:
      "Discover how equality is preserved when applying the same operation to both sides, what equivalent equations are, and when an equation has one, infinitely many, or no solution.",
    card1Title: "Addition & Subtraction Property of Equality",
    card1Body:
      "Adding or subtracting the same number (or expression) on both sides of an equation preserves equality and produces an equivalent equation.",
    card1Rule1: "If A ＝ B, then A ＋ c ＝ B ＋ c",
    card1Rule2: "If A ＝ B, then A － c ＝ B － c",
    card1SvgAria: "Balanced scale showing adding the same term to both sides",
    card2Title: "Multiplication & Division Property of Equality",
    card2Body:
      "Multiplying or dividing both sides of an equation by the same non-zero number (c ≠ 0) preserves equality and produces an equivalent equation.",
    card2Rule1: "If A ＝ B and c ≠ 0, then A · c ＝ B · c",
    card2Rule2: "If A ＝ B and c ≠ 0, then",
    card2Warn: "Warning: Never divide or multiply both sides by 0!",
    card3Title: "Equivalent Equations",
    card3Body:
      "Two equations are equivalent (written ⇔) if they have the exact same solutions. Applying the properties of equality transforms an equation into a simpler equivalent one until x is isolated.",
    card3Ex1: "2x ＋ 4 ＝ 10  ⇔  2x ＝ 6  ⇔  x ＝ 3",
    card3Ex2: "All of the above equations share the unique solution x ＝ 3.",
    card4Title: "One Solution, Infinitely Many (Identity) & No Solution",
    card4Body:
      "Every first-degree equation reduces to ax ＝ b. Depending on a and b, there are 3 cases:",
    card4Case1Title: "1. Unique solution (a ≠ 0):",
    card4Case2Title: "2. Infinitely many solutions — Identity (a ＝ 0 and b ＝ 0):",
    card4Case2Desc: "0 · x ＝ 0 (true for every x)",
    card4Case3Title: "3. No solution — Impossible (a ＝ 0 and b ≠ 0):",
    card4Case3Desc: "0 · x ＝ b (e.g. 0 · x ＝ 5, impossible)",
    labBadge: "INTERACTIVE EQUATION SOLVER",
    labTitle: "Enter Your Own Equation & View the Step-by-Step Solution",
    labDesc:
      "Type any first-degree equation using +, -, *, /, parentheses, and = (or pick a preset example) to see every step with properties of equality, order of operations, and signs.",
    inputLabel: "Your equation:",
    inputPlaceholder: "e.g. 3(x - 2) + 4 = x + 10",
    clearBtn: "Clear",
    examplesLabel: "Preset examples:",
    stepsHeading: "Step-by-Step Analysis",
    verdictUnique: "UNIQUE SOLUTION",
    verdictIdentity: "INFINITELY MANY SOLUTIONS (IDENTITY)",
    verdictImpossible: "NO SOLUTION (IMPOSSIBLE)",
    verdictIdentityDesc: "The equality 0 · x ＝ 0 holds for every number x.",
    verdictImpossibleDesc: "The equality 0 · x ＝ b (with b ≠ 0) is not satisfied by any number x.",
    problemsHeading: "Solved Application Problems",
    prob1Badge: "PROBLEM 1",
    prob1Title:
      "On a balanced scale, the left pan holds 3 identical boxes of weight x kg plus a 4 kg weight, while the right pan holds a 19 kg weight. Using properties of equality, find the weight x of each box.",
    prob1SvgAria: "Balanced scale for the equation 3x + 4 = 19",
    prob1Step1: "1. Initial equation",
    prob1Step2: "2. Subtract 4 from both sides",
    prob1Step3: "3. Divide both sides by 3",
    prob1Final: "Final Answer: Each box weighs x ＝ 5 kg.",
    prob2Badge: "PROBLEM 2",
    prob2Title:
      "Determine whether the following equations have solutions: (i) 2(x ＋ 3) ＝ 2x ＋ 6 and (ii) 3(x － 1) ＝ 3x ＋ 4.",
    prob2SvgAria: "Comparison of identity 0x = 0 and impossible equation 0x = 7",
    prob2Step1: "1. Expand parentheses in (i)",
    prob2Step2: "2. Subtract 2x and 6 from both sides",
    prob2Step3: "3. Expand parentheses in (ii)",
    prob2Step4: "4. Subtract 3x and add 3 to both sides",
    prob2Final: "Final Answer: (i) has infinitely many solutions (identity), while (ii) has no solution (impossible).",
    colStep: "Step",
    colAnalysis: "Analysis / Property of Equality",
    alertTitle: "Watch Out! Top 3 Classic Mistakes with Properties of Equality",
    err1Bold: "Operating on only one side:",
    err1Text: "Whatever you add, subtract, multiply, or divide on the left side must also be done on the right side.",
    err2Bold: "Dividing by zero:",
    err2Text: "In 0 · x ＝ 5 you cannot write x ＝ 5 : 0. The equation has no solution.",
    err3Bold: "Confusing identity and impossible equations:",
    err3Text: "0 · x ＝ 0 has infinitely many solutions (every x), while 0 · x ＝ 4 has no solution.",
    bottomTitle: "Ready to test your skills?",
    bottomDesc:
      "Solve 12 dynamic exercises on properties of equality, equivalent equations, and solution cases.",
    bottomBtn: "START EXERCISES",
    schemaName: "Properties of Equality & Equivalent Equations",
  },
};

export default function EksisosiIdiotitesTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];

  const [eqInput, setEqInput] = useState('3(x - 2) + 4 = x + 10');

  const solved = useMemo(() => solveCustomEquation(eqInput, isEn), [eqInput, isEn]);

  const insertToken = (tk) => {
    setEqInput((prev) => `${prev}${tk}`);
  };

  const presetExamples = [
    '3(x - 2) + 4 = x + 10',
    '-2(x - 5) = 3x - 5',
    '(x + 2) / 3 = 4',
    '2(x + 3) = 2x + 6',
    '4(x - 1) = 4x + 5',
  ];

  const keypadButtons = ['x', ' + ', ' - ', ' * ', ' / ', '(', ')', ' = '];

  const baseUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: extractPlainText(t.schemaName),
    description: extractPlainText(t.metaDesc),
    inLanguage: locale,
    educationalLevel: "Β' ΓΥΜΝΑΣΙΟΥ",
    typicalAgeRange: '13-14',
    isAccessibleForFree: true,
    url: `${baseUrl}/b-gymnasiou/12-eksisosi-idiotites`,
    provider: {
      '@id': 'https://learnmaths.gr/#organization',
    },
  };

  const actionButton = (
    <Link
      href="/b-gymnasiou/12-eksisosi-idiotites-ask"
      locale={locale}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">🎯</span>
      <span>{toCleanUppercase(t.exercisesBtn)}</span>
    </Link>
  );

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDesc}
      jsonLd={jsonLd}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backText={t.backText}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* 1. HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl mb-8 min-w-0">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 min-w-0">
            <div className="max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs sm:text-sm font-extrabold tracking-wider mb-4">
                <span>{toCleanUppercase(t.chapterBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/12-eksisosi-idiotites-ask"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-all"
              >
                <span>{toCleanUppercase(t.solve12Btn)}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#interactive-lab"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
              >
                <span>{toCleanUppercase(t.labBtn)}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10 min-w-0">
          {/* ΚΑΡΤΑ 1 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card1Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {t.card1Body}
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono font-bold mb-4">
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                  {t.card1Rule1}
                </div>
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950">
                  {t.card1Rule2}
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <svg
                  viewBox="0 0 420 144"
                  className="w-full h-auto max-w-full block select-none"
                  role="img"
                  aria-label={t.card1SvgAria}
                >
                  <rect x="44" y="16" width="136" height="36" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" />
                  <text x="112" y="39" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#1e1b4b" fontFamily="monospace">
                    Α ＋ γ
                  </text>
                  <path d="M 36 54 Q 112 66 188 54" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="112" y1="60" x2="112" y2="74" stroke="#334155" strokeWidth="3" />

                  <rect x="240" y="16" width="136" height="36" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
                  <text x="308" y="39" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                    Β ＋ γ
                  </text>
                  <path d="M 232 54 Q 308 66 384 54" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="308" y1="60" x2="308" y2="74" stroke="#334155" strokeWidth="3" />

                  <line x1="76" y1="74" x2="344" y2="74" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
                  <polygon points="210,46 204,64 216,64" fill="#059669" />
                  <circle cx="210" cy="74" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                  <rect x="205" y="80" width="10" height="42" rx="3" fill="#334155" />
                  <polygon points="168,132 252,132 238,120 182,120" fill="#1e293b" />
                  <rect x="156" y="131" width="108" height="6" rx="3" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card2Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                {t.card2Body}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm mb-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 font-mono font-black text-emerald-950 break-words [overflow-wrap:anywhere]">
                  {t.card2Rule1}
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 font-mono font-black text-teal-950 flex flex-wrap items-center gap-1.5">
                  <span>{t.card2Rule2}</span>
                  <Frac num="Α" den="γ" small />
                  <span>＝</span>
                  <Frac num="Β" den="γ" small />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-bold text-rose-900 break-words [overflow-wrap:anywhere]">
                {t.card2Warn}
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card3Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                {t.card3Body}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs sm:text-sm">
                <div className="font-mono font-black text-amber-950 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.card3Ex1}
                </div>
                <div className="text-slate-700 font-semibold break-words [overflow-wrap:anywhere]">
                  {t.card3Ex2}
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card4Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {t.card4Body}
              </p>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center gap-1.5">
                  <strong>{t.card4Case1Title}</strong>
                  <span className="font-mono inline-flex items-center gap-1">
                    <span>x ＝</span>
                    <Frac num="β" den="α" small />
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 break-words [overflow-wrap:anywhere]">
                  <strong>{t.card4Case2Title}</strong> <span className="font-mono">{t.card4Case2Desc}</span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 break-words [overflow-wrap:anywhere]">
                  <strong>{t.card4Case3Title}</strong> <span className="font-mono">{t.card4Case3Desc}</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟΣ ΕΠΙΛΥΤΗΣ ΔΙΚΗΣ ΣΟΥ ΕΞΙΣΩΣΗΣ */}
        <section
          id="interactive-lab"
          className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg p-5 sm:p-8 mb-10 min-w-0"
        >
          <div className="pb-5 border-b border-slate-200 mb-6 min-w-0">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold tracking-wide mb-2">
              {toCleanUppercase(t.labBadge)}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 break-words [overflow-wrap:anywhere]">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
            {/* Αριστερή στήλη: Εισαγωγή εξίσωσης, πλήκτρα & παραδείγματα */}
            <div className="lg:col-span-5 space-y-4 min-w-0">
              <div>
                <label htmlFor="custom-eq-input" className="block text-sm font-extrabold text-slate-800 mb-1.5">
                  {t.inputLabel}
                </label>
                <div className="flex gap-2">
                    <input
                        id="custom-eq-input"
                        type="text"
                        value={eqInput}
                        onChange={(e) => setEqInput(sanitizeEquationInput(e.target.value))}
                        placeholder={t.inputPlaceholder}
                        className="w-full min-w-0 rounded-2xl border-2 border-indigo-300 bg-slate-50 px-4 py-3 font-mono text-base sm:text-lg font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  <button
                    type="button"
                    onClick={() => setEqInput('')}
                    className="shrink-0 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold px-4 py-3 text-xs sm:text-sm transition cursor-pointer"
                  >
                    {t.clearBtn}
                  </button>
                </div>
              </div>

              {/* Μπάρα γρήγορων συμβόλων */}
              <div className="flex flex-wrap gap-2">
                {keypadButtons.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertToken(sym)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-mono font-black text-sm text-indigo-900 transition cursor-pointer"
                  >
                    {sym.trim()}
                  </button>
                ))}
              </div>

              {/* Έτοιμα παραδείγματα */}
              <div className="pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  {t.examplesLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetExamples.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setEqInput(ex)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 font-mono text-xs font-bold transition cursor-pointer"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Δεξιά στήλη: Βήμα-βήμα επίλυση */}
            <div className="lg:col-span-7 min-w-0">
              {solved.error ? (
                <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-5 text-rose-900 font-bold text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {solved.error}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 space-y-4 min-w-0">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                    {t.stepsHeading}
                  </div>

                  <ol className="space-y-3">
                    {solved.steps.map((st, i) => (
                      <li
                        key={i}
                        className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-sm min-w-0"
                      >
                        <div className="text-xs sm:text-sm font-bold text-slate-500 mb-1 break-words [overflow-wrap:anywhere]">
                          {i + 1}. {st.title}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words [overflow-wrap:anywhere]">
                          {st.expr}
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Τελικό πλαίσιο αποτελέσματος */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border-2 font-bold text-sm sm:text-base space-y-1.5 min-w-0 ${
                      solved.caseType === 'unique'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : solved.caseType === 'identity'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="text-xs font-black tracking-wider">
                      {toCleanUppercase(
                        solved.caseType === 'unique'
                          ? t.verdictUnique
                          : solved.caseType === 'identity'
                          ? t.verdictIdentity
                          : t.verdictImpossible
                      )}
                    </div>

                    {solved.caseType === 'unique' ? (
                      <div className="font-mono text-lg sm:text-xl font-black inline-flex items-center gap-1.5">
                        <span>x ＝</span>
                        <RatView r={solved.solution} />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold break-words [overflow-wrap:anywhere]">
                        {solved.caseType === 'identity'
                          ? t.verdictIdentityDesc
                          : t.verdictImpossibleDesc}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. 2 ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΕΦΑΡΜΟΓΗΣ */}
        <section className="space-y-8 mb-10 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
            {t.problemsHeading}
          </h2>

          {/* ΠΡΟΒΛΗΜΑ 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(t.prob1Badge)}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.prob1Title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start min-w-0">
              <div className="md:col-span-5 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 138"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.prob1SvgAria}
                  >
                    <rect x="28" y="18" width="124" height="34" rx="8" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x="90" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e1b4b" fontFamily="monospace">
                      3x ＋ 4 kg
                    </text>
                    <path d="M 22 54 Q 90 64 158 54" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                    <line x1="90" y1="59" x2="90" y2="72" stroke="#334155" strokeWidth="2.8" />

                    <rect x="208" y="18" width="124" height="34" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x="270" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      19 kg
                    </text>
                    <path d="M 202 54 Q 270 64 338 54" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                    <line x1="270" y1="59" x2="270" y2="72" stroke="#334155" strokeWidth="2.8" />

                    <line x1="60" y1="72" x2="300" y2="72" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="180" cy="72" r="5.5" fill="#4f46e5" />
                    <rect x="176" y="77" width="8" height="40" rx="2" fill="#334155" />
                    <polygon points="145,126 215,126 202,116 158,116" fill="#1e293b" />
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-2/5 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colStep}</th>
                        <th className="w-3/5 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colAnalysis}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step1}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3x ＋ 4 ＝ 19</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step2}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3x ＋ 4 － 4 ＝ 19 － 4 ⇔ 3x ＝ 15</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step3}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">
                          <span className="inline-flex flex-wrap items-center gap-1.5">
                            <Frac num="3x" den="3" small />
                            <span>＝</span>
                            <Frac num="15" den="3" small />
                            <span>⇔ x ＝ 5</span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step1}</div>
                    <div className="font-mono">3x ＋ 4 ＝ 19</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step2}</div>
                    <div className="font-mono">3x ＝ 19 － 4 ＝ 15</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step3}</div>
                    <div className="font-mono inline-flex flex-wrap items-center gap-1.5">
                      <span>x ＝</span>
                      <Frac num="15" den="3" small />
                      <span>＝ 5</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.prob1Final}
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(t.prob2Badge)}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.prob2Title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start min-w-0">
              <div className="md:col-span-5 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 120"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.prob2SvgAria}
                  >
                    <rect x="16" y="14" width="328" height="40" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x="180" y="39" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e1b4b" fontFamily="monospace">
                      (i) 0 · x ＝ 0  (∞)
                    </text>
                    <rect x="16" y="66" width="328" height="40" rx="10" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                    <text x="180" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#881337" fontFamily="monospace">
                      (ii) 0 · x ＝ 7  (∅)
                    </text>
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-2/5 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colStep}</th>
                        <th className="w-3/5 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colAnalysis}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step1}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">2x ＋ 6 ＝ 2x ＋ 6</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step2}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">0 · x ＝ 0</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step3}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3x － 3 ＝ 3x ＋ 4</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step4}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">0 · x ＝ 7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">(i)</div>
                    <div className="font-mono">2x ＋ 6 ＝ 2x ＋ 6 ⇔ 0 · x ＝ 0</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-rose-800 mb-1">(ii)</div>
                    <div className="font-mono">3x － 3 ＝ 3x ＋ 4 ⇔ 0 · x ＝ 7</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.prob2Final}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. YELLOW ALERT BOX */}
        <section className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-5 sm:p-8 mb-10 shadow-sm min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-xl shrink-0">
              !
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-amber-950 break-words [overflow-wrap:anywhere]">
              {t.alertTitle}
            </h2>
          </div>

          <ul className="space-y-3 text-sm sm:text-base text-amber-950">
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err1Bold}</strong> {t.err1Text}
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err2Bold}</strong> {t.err2Text}
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err3Bold}</strong> {t.err3Text}
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 min-w-0">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 break-words [overflow-wrap:anywhere]">
              {t.bottomTitle}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
              {t.bottomDesc}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/12-eksisosi-idiotites-ask"
            locale={locale}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm sm:text-base shadow-md transition-all"
          >
            <span>{toCleanUppercase(t.bottomBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}