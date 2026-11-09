import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Μέγιστος Κοινός Διαιρετής (GCD)
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Καθαρισμός κεφαλαίων ελληνικών με διατήρηση μόνο του Β'
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

// Κλάση Ακριβούς Κλασματικής Αριθμητικής
class Rational {
  constructor(num, den = 1) {
    if (den === 0) throw new Error('Η διαίρεση με το μηδέν δεν ορίζεται.');
    let n = Math.round(num);
    let d = Math.round(den);
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d) || 1;
    this.n = n / g;
    this.d = d / g;
  }

  add(other) {
    return new Rational(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  sub(other) {
    return new Rational(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  mul(other) {
    return new Rational(this.n * other.n, this.d * other.d);
  }

  div(other) {
    if (other.n === 0) throw new Error('Η διαίρεση με το μηδέν δεν ορίζεται.');
    return new Rational(this.n * other.d, this.d * other.n);
  }

  pow(exp) {
    const e = Math.round(exp);
    if (e === 0) return new Rational(1, 1);
    if (e > 0) {
      return new Rational(Math.pow(this.n, e), Math.pow(this.d, e));
    }
    if (this.n === 0) throw new Error('Μηδενική βάση με αρνητικό εκθέτη δεν ορίζεται.');
    return new Rational(Math.pow(this.d, Math.abs(e)), Math.pow(this.n, Math.abs(e)));
  }

  toString() {
    if (this.d === 1) return `${this.n}`;
    return `${this.n}/${this.d}`;
  }
}

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και κατακόρυφη μορφή (No-Overflow)
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  const renderTerm = (term) => {
    if (String(term).includes('^')) {
      const [b, e] = String(term).split('^');
      return (
        <span className="inline-flex items-baseline">
          <span>{b}</span>
          <sup className="text-amber-400 font-bold ml-0.5 text-[10px] sm:text-xs">{e}</sup>
        </span>
      );
    }
    return term;
  };

  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}>
      {isNegative && <span className="mr-0.5 text-sm sm:text-base font-bold select-none">－</span>}
      <span className="inline-flex flex-col text-center leading-none text-[0.85em] sm:text-[0.9em]">
        <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{renderTerm(cleanNum)}</span>
        <span className="pt-0.5 px-0.5 sm:px-1 break-all">{renderTerm(cleanDen)}</span>
      </span>
    </span>
  );
};

// Component μορφοποίησης μαθηματικών εκφράσεων
const MathFormattedText = ({ text = "", className = "" }) => {
  if (!text) return null;

  const raw = String(text).replace(/\s+/g, ' ').trim();
  const tokens = [];
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    // 1. Έλεγχος για κλάσμα
    const fracMatch = raw.slice(i).match(/^(\d+)\s*\/\s*(\d+(?:\^\d+)?)/);
    if (fracMatch) {
      tokens.push({ type: 'frac', num: fracMatch[1], den: fracMatch[2] });
      i += fracMatch[0].length;
      continue;
    }

    // 2. Έλεγχος για δύναμη
    if (ch === '^') {
      let expStr = '';
      let j = i + 1;

      if (j >= raw.length) {
        tokens.push({ type: 'char', val: '^' });
        i = j;
        continue;
      }

      if (raw[j] === '(') {
        j++;
        while (j < raw.length && raw[j] !== ')') {
          expStr += raw[j];
          j++;
        }
        if (j < raw.length && raw[j] === ')') j++;
      } else {
        if (raw[j] === '-' || raw[j] === '+') {
          expStr += raw[j];
          j++;
        }
        while (j < raw.length && /[0-9]/.test(raw[j])) {
          expStr += raw[j];
          j++;
        }
      }

      if (tokens.length > 0) {
        const lastTok = tokens.pop();
        if (lastTok.type === 'num' || lastTok.type === 'paren') {
          tokens.push({ type: 'pow', base: lastTok.val, exp: expStr });
        } else {
          tokens.push(lastTok);
          tokens.push({ type: 'pow', base: '', exp: expStr });
        }
      } else {
        tokens.push({ type: 'pow', base: '', exp: expStr });
      }
      i = j;
      continue;
    }

    // 3. Σύμβολα
    if (ch === '*' || ch === '·') {
      tokens.push({ type: 'op', val: '·' }); i++; continue;
    }
    if (ch === ':' || ch === '/') {
      tokens.push({ type: 'op', val: ':' }); i++; continue;
    }
    if (ch === '+') {
      tokens.push({ type: 'op', val: '＋' }); i++; continue;
    }
    if (ch === '-') {
      tokens.push({ type: 'op', val: '－' }); i++; continue;
    }
    if (ch === '＝' || ch === '=') {
      tokens.push({ type: 'eq', val: '＝' }); i++; continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', val: ch }); i++; continue;
    }

    // 4. Αριθμοί
    const numMatch = raw.slice(i).match(/^\d+/);
    if (numMatch) {
      tokens.push({ type: 'num', val: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    tokens.push({ type: 'char', val: ch });
    i++;
  }

  return (
    <span className={`inline-flex items-center flex-wrap gap-y-1 font-mono ${className}`}>
      {tokens.map((tok, idx) => {
        if (tok.type === 'op') return <span key={idx} className="mx-1 sm:mx-1.5 font-bold text-slate-300">{tok.val}</span>;
        if (tok.type === 'eq') return <span key={idx} className="mx-1.5 sm:mx-2 font-bold text-amber-400 text-sm sm:text-base">＝</span>;
        if (tok.type === 'paren') return <span key={idx} className="font-bold text-indigo-300 mx-0.5">{tok.val}</span>;
        if (tok.type === 'frac') return <Frac key={idx} num={tok.num} den={tok.den} />;
        if (tok.type === 'pow') {
          const isParen = tok.base === ')';
          return (
            <span key={idx} className="inline-flex items-baseline mx-0.5">
              <span className={isParen ? "font-bold text-indigo-300" : ""}>{tok.base}</span>
              <sup className="text-amber-400 font-bold ml-0.5 text-[10px] sm:text-xs">{tok.exp}</sup>
            </span>
          );
        }
        return <span key={idx} className="mx-0.5">{tok.val}</span>;
      })}
    </span>
  );
};

// Preset παραδείγματα 
const PRESET_EXPRESSIONS = [
  {
    labelEl: 'Σύνθετη με αρνητικούς: -6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13',
    labelEn: 'Complex with negatives: -6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13',
    expr: '-6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13'
  },
  {
    labelEl: 'Κλάσματα σε παρενθέσεις',
    labelEn: 'Fractions in parentheses',
    expr: '(1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)'
  },
  {
    labelEl: 'Σύνθετη με εκθέτη στο τέλος',
    labelEn: 'Complex with power at the end',
    expr: '15 + 2 * (3^2 - 2^3)^0 - (9 : 3^(-1) - 2^3)'
  },
  {
    labelEl: '12 * 2^(-2) - 18 / 3^2 + 5',
    labelEn: '12 * 2^(-2) - 18 / 3^2 + 5',
    expr: '12 * 2^(-2) - 18 / 3^2 + 5'
  },
];

function parseSimpleTerm(str) {
  const clean = str.replace(/[()]/g, '').trim();
  if (clean === '' || clean === '-' || clean === '+') throw new Error('Ημιτελής όρος στην παράσταση.');
  if (clean.includes('/')) {
    const [n, d] = clean.split('/');
    return new Rational(parseInt(n, 10), parseInt(d, 10));
  }
  return new Rational(parseInt(clean, 10), 1);
}

function getLeftOperand(expr, opIdx) {
  let start = opIdx - 1;
  if (expr[start] === ')') {
    let depth = 1;
    start--;
    while (start >= 0 && depth > 0) {
      if (expr[start] === ')') depth++;
      if (expr[start] === '(') depth--;
      start--;
    }
    return { str: expr.substring(start + 1, opIdx), startIdx: start + 1 };
  } else {
    while (start >= 0 && /[0-9/]/.test(expr[start])) start--;
    if (start >= 0 && (expr[start] === '-' || expr[start] === '+')) {
      if (start === 0 || ['(', '*', ':', '^', '+', '-'].includes(expr[start - 1])) {
        start--;
      }
    }
    return { str: expr.substring(start + 1, opIdx), startIdx: start + 1 };
  }
}

function getRightOperand(expr, opIdx) {
  let end = opIdx + 1;
  if (expr[end] === '(') {
    let depth = 1;
    end++;
    while (end < expr.length && depth > 0) {
      if (expr[end] === '(') depth++;
      if (expr[end] === ')') depth--;
      end++;
    }
    return { str: expr.substring(opIdx + 1, end), endIdx: end };
  } else {
    if (expr[end] === '-' || expr[end] === '+') end++;
    while (end < expr.length && /[0-9/]/.test(expr[end])) end++;
    return { str: expr.substring(opIdx + 1, end), endIdx: end };
  }
}

function executeSingleOperation(expr, locale = 'el') {
  if (expr.includes('^')) {
    const powIdx = expr.indexOf('^');
    const left = getLeftOperand(expr, powIdx);
    const right = getRightOperand(expr, powIdx);

    const bRat = parseSimpleTerm(left.str);
    const expNum = parseInt(right.str.replace(/[()]/g, ''), 10);
    const resRat = bRat.pow(expNum);
    const resVal = resRat.toString();

    let actionDesc = locale === 'el'
      ? `Υπολογισμός δύναμης : ${left.str}^${right.str} ＝ ${resVal}`
      : `Power evaluation : ${left.str}^${right.str} ＝ ${resVal}`;
    if (expNum < 0) {
      actionDesc = locale === 'el'
        ? `Υπολογισμός δύναμης : ${left.str}^${right.str} ＝ 1/${left.str}^${Math.abs(expNum)} ＝ ${resVal}`
        : `Power evaluation : ${left.str}^${right.str} ＝ 1/${left.str}^${Math.abs(expNum)} ＝ ${resVal}`;
    }

    const replacement = (resRat.n < 0 || resRat.d !== 1) ? `(${resVal})` : resVal;
    const newExpr = expr.substring(0, left.startIdx) + replacement + expr.substring(right.endIdx);
    return { action: actionDesc, newExpr: newExpr.replace(/\+-/g, '-').replace(/--/g, '+') };
  }

  let mdIdx = -1;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '*' || expr[i] === ':') { mdIdx = i; break; }
  }
  if (mdIdx !== -1) {
    const op = expr[mdIdx];
    const left = getLeftOperand(expr, mdIdx);
    const right = getRightOperand(expr, mdIdx);
    
    const lRat = parseSimpleTerm(left.str);
    const rRat = parseSimpleTerm(right.str);
    const resRat = op === '*' ? lRat.mul(rRat) : lRat.div(rRat);
    const resVal = resRat.toString();

    const replacement = (resRat.n < 0 && left.startIdx > 0 && ['*', ':', '+', '-'].includes(expr[left.startIdx - 1])) ? `(${resVal})` : resVal;
    const newExpr = expr.substring(0, left.startIdx) + replacement + expr.substring(right.endIdx);

    const opLabel = op === '*' 
      ? (locale === 'el' ? 'Πολλαπλασιασμός' : 'Multiplication')
      : (locale === 'el' ? 'Διαίρεση' : 'Division');

    return {
      action: `${opLabel} : ${left.str} ${op === '*' ? '·' : ':'} ${right.str} ＝ ${resVal}`,
      newExpr: newExpr.replace(/\+-/g, '-').replace(/--/g, '+')
    };
  }

  let asIdx = -1;
  for (let i = 1; i < expr.length; i++) {
    if ((expr[i] === '+' || expr[i] === '-') && !['(', '*', ':', '^'].includes(expr[i - 1])) {
      asIdx = i; break;
    }
  }
  if (asIdx !== -1) {
    const op = expr[asIdx];
    const left = getLeftOperand(expr, asIdx);
    const right = getRightOperand(expr, asIdx);
    
    const lRat = parseSimpleTerm(left.str);
    const rRat = parseSimpleTerm(right.str);
    const resRat = op === '+' ? lRat.add(rRat) : lRat.sub(rRat);
    const resVal = resRat.toString();

    const replacement = (resRat.n < 0 && left.startIdx > 0 && ['*', ':', '+', '-'].includes(expr[left.startIdx - 1])) ? `(${resVal})` : resVal;
    const newExpr = expr.substring(0, left.startIdx) + replacement + expr.substring(right.endIdx);

    const opLabel = op === '+' 
      ? (locale === 'el' ? 'Πρόσθεση' : 'Addition')
      : (locale === 'el' ? 'Αφαίρεση' : 'Subtraction');

    return {
      action: `${opLabel} : ${left.str} ${op} ${right.str} ＝ ${resVal}`,
      newExpr: newExpr.replace(/\+-/g, '-').replace(/--/g, '+')
    };
  }

  return null;
}

function solveExpressionSteps(inputExpr, locale = 'el') {
  const steps = [];
  
  let current = inputExpr.replace(/\s+/g, '').replace(/·/g, '*');
  current = current.replace(/\)\/\(/g, '):(').replace(/([0-9)])\/([0-9(])/g, (m, p1, p2) => {
    if (/[0-9]/.test(p1) && /[0-9]/.test(p2)) return `${p1}/${p2}`;
    return `${p1}:${p2}`;
  });

  if (!current) {
    return {
      error: locale === 'el' ? 'Παρακαλώ πληκτρολόγησε μία αριθμητική παράσταση.' : 'Please enter an arithmetic expression.',
      steps: []
    };
  }

  // VALIDATION GUARD
  const openP = (current.match(/\(/g) || []).length;
  const closeP = (current.match(/\)/g) || []).length;
  if (openP !== closeP) {
    return {
      error: locale === 'el'
        ? 'Η παράσταση περιέχει ασύμμετρες παρενθέσεις. Έλεγξε αν άνοιξες και έκλεισες σωστά.'
        : 'The expression has unmatched parentheses. Check your opening and closing brackets.',
      steps: []
    };
  }
  if (/[+\-*/^:]$/.test(current)) {
    return {
      error: locale === 'el'
        ? 'Η παράσταση δεν έχει ολοκληρωθεί (καταλήγει σε σύμβολο πράξης).'
        : 'The expression is incomplete (ends with an operator).',
      steps: []
    };
  }
  if (/\(\)/.test(current)) {
    return {
      error: locale === 'el' ? 'Η παράσταση περιέχει κενή παρένθεση.' : 'The expression contains empty parentheses.',
      steps: []
    };
  }

  try {
    let iteration = 0;
    const maxIterations = 35;

    while (iteration < maxIterations) {
      iteration++;

      let innerStart = -1;
      let innerEnd = -1;
      for (let i = 0; i < current.length; i++) {
        if (current[i] === '(') innerStart = i;
        if (current[i] === ')' && innerStart !== -1) {
          innerEnd = i; break;
        }
      }

      if (innerStart !== -1 && innerEnd !== -1) {
        const innerContent = current.substring(innerStart + 1, innerEnd);

        if (!/[+*^:]/.test(innerContent) && !(innerContent.includes('-') && innerContent.indexOf('-') > 0)) {
          if (current[innerEnd + 1] === '^') {
            const globalStep = executeSingleOperation(current, locale);
            if (globalStep) {
              const before = current;
              current = globalStep.newExpr;
              steps.push({ action: globalStep.action, before, after: current });
              continue;
            }
          }
          
          const val = parseSimpleTerm(innerContent);
          if (val.n >= 0) {
            current = current.substring(0, innerStart) + innerContent + current.substring(innerEnd + 1);
            continue;
          } else if (innerStart === 0 || current[innerStart - 1] === '(') {
            current = current.substring(0, innerStart) + innerContent + current.substring(innerEnd + 1);
            continue;
          } else {
             const globalStep = executeSingleOperation(current, locale);
             if (globalStep) {
               const before = current;
               current = globalStep.newExpr;
               steps.push({ action: globalStep.action, before, after: current });
               continue;
             }
             break;
          }
        } else {
          const stepResult = executeSingleOperation(innerContent, locale);
          if (stepResult) {
            const before = current;
            current = current.substring(0, innerStart + 1) + stepResult.newExpr + current.substring(innerEnd);
            steps.push({
              action: locale === 'el' ? `Πράξη στην παρένθεση : ${stepResult.action}` : `Inside parentheses : ${stepResult.action}`,
              before,
              after: current
            });
            continue;
          }
        }
      }

      const globalStep = executeSingleOperation(current, locale);
      if (globalStep) {
        const before = current;
        current = globalStep.newExpr;
        steps.push({ action: globalStep.action, before, after: current });
        continue;
      }

      current = current.replace(/\(\+?(-?\d+(?:\/\d+)?)\)/g, '$1');
      break;
    }

    return { result: current.replace(/\+-/g, '-').replace(/--/g, '+'), steps, error: null };
  } catch (err) {
    return {
      error: locale === 'el'
        ? 'Σφάλμα ή ημιτελής παράσταση. Συνέχισε την πληκτρολόγηση.'
        : 'Syntax error or incomplete expression. Continue typing.',
      steps: []
    };
  }
}

export default function ArithmitikiParastasiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --- Συγκεντρωτικό Λεξικό i18n (el / en) ---
  const t = {
    el: {
      pageTitle: "Αριθμητικές Παραστάσεις & Προτεραιότητα Πράξεων | Β' Γυμνασίου",
      pageDesc: "Θεωρία, κανόνες προτεραιότητας πράξεων με δυνάμεις αρνητικού εκθέτη και διαδραστικός επιλυτής βήμα-βήμα για τη Β' Γυμνασίου.",
      backText: "Β' Γυμνασίου",
      actionBtn: "ΑΣΚΗΣΕΙΣ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 3",
      headerTitle: "ΑΡΙΘΜΗΤΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ",
      headerDesc: "Εμβαθύνουμε στην ιεραρχία των πράξεων ενσωματώνοντας δυνάμεις με αρνητικό εκθέτη και κλάσματα. Πληκτρολόγησε τη δική σου παράσταση και δες την επίλυση βήμα-βήμα με απόλυτη κλασματική ακρίβεια!",

      // Ενότητα 1
      sec1Num: "1",
      sec1Title: "Η Σειρά Εκτέλεσης των Πράξεων",
      defPart1: "Αριθμητική παράσταση",
      defPart2: "ονομάζεται μια σειρά από αριθμούς που συνδέονται μεταξύ τους με τα σύμβολα των πράξεων και ενδεχομένως με παρενθέσεις.",
      rulesIntro: "Για να έχει κάθε παράσταση μοναδικό και αδιαμφισβήτητο αποτέλεσμα, ακολουθούμε απαρέγκλιτα την εξής σειρά:",
      order1Title: "Παρενθέσεις:",
      order1Desc: "Εκτελούμε πρώτα τις πράξεις μέσα στις παρενθέσεις, ξεκινώντας από τις πιο εσωτερικές προς τις εξωτερικές.",
      order2Title: "Δυνάμεις (Θετικοί & Αρνητικοί Εκθέτες):",
      order2DescPart1: "Υπολογίζουμε όλες τις δυνάμεις (π.χ. ",
      order2DescPart2: ").",
      order3Title: "Πολλαπλασιασμοί & Διαιρέσεις:",
      order3Desc: "Εκτελούνται με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.",
      order4Title: "Προσθέσεις & Αφαιρέσεις:",
      order4Desc: "Εκτελούνται τελευταίες, επίσης με τη σειρά από αριστερά προς τα δεξιά.",

      // Παγίδες
      trapsHeading: "ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΓΙΔΕΣ ΤΗΣ Β' ΓΥΜΝΑΣΙΟΥ",
      trap1Title: "1. ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ ΜΕΣΑ ΣΕ ΠΡΑΞΕΙΣ",
      trap1Desc: "Ο αρνητικός εκθέτης μετατρέπεται πρώτα σε κλάσμα και διατηρείται ως κλάσμα:",
      trap2Title: "2. ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ",
      trap2Desc: "Η θέση της παρένθεσης αλλάζει ριζικά το αποτέλεσμα:",
      trap2Note1: "(το πρόσημο είναι μέσα στη δύναμη)",
      trap2Note2: "(πρώτα η δύναμη 3² ＝ 9 και μετά το μείον)",
      trap3Title: "3. ΔΙΑΔΟΧΙΚΕΣ ΔΙΑΙΡΕΣΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ",
      trap3Desc: "Δεν αλλάζουμε τη σειρά! Πάντα από αριστερά προς τα δεξιά:",
      trap3Wrong: "(ΟΧΙ 12 : 6 ＝ 2)",

      // Ενότητα 2 (Εργαστήριο)
      sec2Num: "2",
      sec2Title: "🛠️ Διαδραστικό Εργαστήριο: Επίλυση Βήμα-Βήμα με Προτεραιότητα & Κλάσματα",
      sec2Intro: "Γράψε τη δική σου αριθμητική παράσταση στο παρακάτω πλαίσιο (χρησιμοποιώντας αριθμούς, +, -, *, /, ^ για δύναμη και παρενθέσεις) ή διάλεξε ένα έτοιμο παράδειγμα για να δεις την ανάλυση:",
      presetBtnTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
      inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΤΗΝ ΠΑΡΑΣΤΑΣΗ:",
      inputPlaceholder: "π.χ. (1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)",
      clearBtn: "ΚΑΘΑΡΙΣΜΟΣ",
      symbolsHelp: "Σύμβολα: + (πρόσθεση), - (αφαίρεση), * (πολλαπλασιασμός), / (διαίρεση/κλάσμα), ^ (δύναμη)",
      originalExprTitle: "ΑΡΧΙΚΗ ΠΑΡΑΣΤΑΣΗ",
      finalResultTitle: "ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ",
      stepsHeader: "ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΒΑΣΕΙ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ:",
      alreadySimplified: "Ο αριθμός είναι ήδη απλοποιημένος.",

      // Ενότητα 3
      sec3Num: "3",
      sec3Title: "Αναλυτικά Λυμένα Παραδείγματα",
      ex1Tag: "ΠΑΡΑΔΕΙΓΜΑ 1",
      ex1Title: "Α ＝ 12 · 2⁻² － 18 : 3² ＋ 5",
      ex1Step1: "1. Δυνάμεις: 2⁻² ＝ ",
      ex1Step2: "2. Πολλαπλασιασμοί & Διαιρέσεις: 12 · ",
      ex1Step3: "3. Προσθέσεις & Αφαιρέσεις (αριστερά προς δεξιά):",
      ex2Tag: "ΠΑΡΑΔΕΙΓΜΑ 2",
      ex2Title: "Β ＝ (6 － 2)² ＋ 15 : 3 － 3 · 3⁻¹",
      ex2Step1: "1. Πράξη στην παρένθεση: 6 － 2 ＝ 4",
      ex2Step2: "2. Δυνάμεις: 4² ＝ 16, 3⁻¹ ＝ ",
      ex2Step3: "3. Διαιρέσεις & Πολλαπλασιασμοί: 15 : 3 ＝ 5, 3 · ",
      ex2Step4: "4. Προσθέσεις & Αφαιρέσεις (αριστερά προς δεξιά):"
    },
    en: {
      pageTitle: "Order of Operations & Arithmetic Expressions | Grade 8",
      pageDesc: "Theory, precedence rules with negative exponent powers, and interactive step-by-step solver for Grade 8.",
      backText: "Grade 8",
      actionBtn: "EXERCISES",
      badgeUnit: "GRADE 8 • UNIT 3",
      headerTitle: "ARITHMETIC EXPRESSIONS & ORDER OF OPERATIONS",
      headerDesc: "We deepen the hierarchy of operations by integrating negative exponent powers and fractions. Enter your own expression and watch the step-by-step solution with full fraction accuracy!",

      // Section 1
      sec1Num: "1",
      sec1Title: "Order of Operations",
      defPart1: "An arithmetic expression",
      defPart2: "is a series of numbers linked by arithmetic operational signs and optional parentheses.",
      rulesIntro: "For every expression to yield a unique and definitive result, we strictly follow this sequence:",
      order1Title: "Parentheses / Brackets:",
      order1Desc: "Evaluate innermost brackets first, working outward.",
      order2Title: "Powers (Positive & Negative Exponents):",
      order2DescPart1: "Calculate all powers (e.g. ",
      order2DescPart2: ").",
      order3Title: "Multiplication & Division:",
      order3Desc: "Performed strictly in order from left to right.",
      order4Title: "Addition & Subtraction:",
      order4Desc: "Performed last, strictly in order from left to right.",

      // Traps
      trapsHeading: "CRITICAL TRAPS TO AVOID IN GRADE 8",
      trap1Title: "1. NEGATIVE EXPONENT IN EXPRESSIONS",
      trap1Desc: "A negative exponent is first inverted into a fraction and maintained as a fraction:",
      trap2Title: "2. PARENTHESES AND SIGNS",
      trap2Desc: "The position of parentheses radically alters the outcome:",
      trap2Note1: "(the sign is inside the base)",
      trap2Note2: "(power 3² ＝ 9 calculated first, then minus is applied)",
      trap3Title: "3. CONSECUTIVE DIVISIONS & MULTIPLICATIONS",
      trap3Desc: "Do not switch order! Always compute from left to right:",
      trap3Wrong: "(NOT 12 : 6 ＝ 2)",

      // Section 2
      sec2Num: "2",
      sec2Title: "🛠️ Interactive Lab: Step-by-Step Evaluator with Precedence & Fractions",
      sec2Intro: "Type your own arithmetic expression in the box below (using numbers, +, -, *, /, ^ for powers, and brackets) or select a preset to view the breakdown:",
      presetBtnTitle: "PRESETS:",
      inputLabel: "ENTER EXPRESSION:",
      inputPlaceholder: "e.g. (1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)",
      clearBtn: "CLEAR",
      symbolsHelp: "Symbols: + (addition), - (subtraction), * (multiplication), / (division/fraction), ^ (power)",
      originalExprTitle: "ORIGINAL EXPRESSION",
      finalResultTitle: "FINAL RESULT",
      stepsHeader: "STEP-BY-STEP BREAKDOWN BY PRECEDENCE:",
      alreadySimplified: "The expression is already simplified.",

      // Section 3
      sec3Num: "3",
      sec3Title: "Detailed Solved Examples",
      ex1Tag: "EXAMPLE 1",
      ex1Title: "A ＝ 12 · 2⁻² － 18 : 3² ＋ 5",
      ex1Step1: "1. Powers: 2⁻² ＝ ",
      ex1Step2: "2. Multiplication & Division: 12 · ",
      ex1Step3: "3. Addition & Subtraction (left to right):",
      ex2Tag: "EXAMPLE 2",
      ex2Title: "B ＝ (6 － 2)² ＋ 15 : 3 － 3 · 3⁻¹",
      ex2Step1: "1. Inside parentheses: 6 － 2 ＝ 4",
      ex2Step2: "2. Powers: 4² ＝ 16, 3⁻¹ ＝ ",
      ex2Step3: "3. Division & Multiplication: 15 : 3 ＝ 5, 3 · ",
      ex2Step4: "4. Addition & Subtraction (left to right):"
    }
  };

  const cur = t[locale] || t.el;

  const [customExpr, setCustomExpr] = useState('-6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13');

  const analysis = useMemo(() => {
    return solveExpressionSteps(customExpr, locale);
  }, [customExpr, locale]);

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/03-arithmitiki-parastasi-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{cur.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase break-words">
              {toCleanUppercase(cur.badgeUnit)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.headerTitle)}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {cur.headerDesc}
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΗΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec1Num}
              </span>
              <span>{cur.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4 min-w-0">
              <p className="break-words [overflow-wrap:anywhere]">
                <strong>{cur.defPart1}</strong> {cur.defPart2}
              </p>
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.rulesIntro}
              </p>
              
              <div className="space-y-3 font-sans min-w-0">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">1</span>
                  <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                    <strong className="text-indigo-950 block">{cur.order1Title}</strong>
                    <span className="text-xs sm:text-sm text-slate-600">{cur.order1Desc}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">2</span>
                  <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                    <strong className="text-amber-950 block">{cur.order2Title}</strong>
                    <span className="text-xs sm:text-sm text-slate-600">
                      {cur.order2DescPart1}
                      <span className="font-mono font-bold">2<sup>3</sup> ＝ 8</span>, <span className="font-mono font-bold">3<sup>(－1)</sup> ＝ <Frac num="1" den="3" /></span>, <span className="font-mono font-bold">{locale === 'el' ? 'α' : 'a'}<sup>0</sup> ＝ 1</span>
                      {cur.order2DescPart2}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">3</span>
                  <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                    <strong className="text-slate-900 block">{cur.order3Title}</strong>
                    <span className="text-xs sm:text-sm text-slate-600">{cur.order3Desc}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">4</span>
                  <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                    <strong className="text-slate-900 block">{cur.order4Title}</strong>
                    <span className="text-xs sm:text-sm text-slate-600">{cur.order4Desc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Παγίδες */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.trapsHeading)}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm min-w-0">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 min-w-0">
                  <strong className="text-rose-600 block uppercase break-words">{toCleanUppercase(cur.trap1Title)}</strong>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.trap1Desc}
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center flex-wrap gap-1">
                    <span>3 · 3<sup>(－1)</sup> ＝ 3 · </span>
                    <Frac num="1" den="3" />
                    <span> ＝ 1</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 min-w-0">
                  <strong className="text-rose-600 block uppercase break-words">{toCleanUppercase(cur.trap2Title)}</strong>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.trap2Desc}
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 min-w-0">
                    <div className="break-words">(-3)<sup>2</sup> ＝ ＋9 <span className="text-[11px] text-slate-500 font-sans">{cur.trap2Note1}</span></div>
                    <div className="break-words">－3<sup>2</sup> ＝ －9 <span className="text-[11px] text-slate-500 font-sans">{cur.trap2Note2}</span></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 min-w-0">
                  <strong className="text-rose-600 block uppercase break-words">{toCleanUppercase(cur.trap3Title)}</strong>
                  <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                    {cur.trap3Desc}
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-wrap items-center gap-1">
                    <span>12 : 3 · 2 ＝ 4 · 2 ＝ 8</span>
                    <span className="text-rose-600 font-sans font-bold">{cur.trap3Wrong}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: STEP-BY-STEP EVALUATOR */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec2Num}
              </span>
              <span>{cur.sec2Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec2Intro}
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1 break-words">
              {toCleanUppercase(cur.presetBtnTitle)}
            </span>
            {PRESET_EXPRESSIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomExpr(item.expr)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation break-words"
              >
                {locale === 'el' ? item.labelEl : item.labelEn}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="space-y-2 min-w-0">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider break-words">
              {toCleanUppercase(cur.inputLabel)}
            </label>
            <div className="relative">
              <input
                type="text"
                value={customExpr}
                onChange={(e) => setCustomExpr(e.target.value)}
                placeholder={cur.inputPlaceholder}
                className="w-full h-14 px-4 sm:px-5 pr-28 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none box-border"
              />
              {customExpr && (
                <button
                  type="button"
                  onClick={() => setCustomExpr('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all touch-manipulation"
                >
                  {toCleanUppercase(cur.clearBtn)}
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 font-mono break-words">
              <span>{cur.symbolsHelp}</span>
            </div>
          </div>

          {/* Οθόνη Αποτελέσματος & Βημάτων */}
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-8 text-white space-y-6 shadow-inner min-w-0">
            {analysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2 break-words">
                <span>⚠️</span>
                <span>{analysis.error}</span>
              </div>
            ) : (
              <>
                {/* Τελικό Αποτέλεσμα Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1 break-words">
                      {toCleanUppercase(cur.originalExprTitle)}
                    </span>
                    <div className="text-base sm:text-2xl font-black text-amber-300 break-words">
                      <MathFormattedText text={customExpr} />
                    </div>
                  </div>
                  <div className="text-left sm:text-right min-w-0">
                    <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider block mb-1 break-words">
                      {toCleanUppercase(cur.finalResultTitle)}
                    </span>
                    <div className="text-xl sm:text-4xl font-black font-mono text-white flex items-center gap-1.5 sm:justify-end flex-wrap break-all">
                      <span className="text-amber-400 font-bold">＝</span>
                      <MathFormattedText text={analysis.result} />
                    </div>
                  </div>
                </div>

                {/* Ανάλυση Βημάτων */}
                <div className="space-y-3 min-w-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block break-words">
                    {toCleanUppercase(cur.stepsHeader)}
                  </span>

                  {analysis.steps.length === 0 ? (
                    <div className="text-sm text-slate-400 italic break-words">
                      {cur.alreadySimplified}
                    </div>
                  ) : (
                    <div className="space-y-3 min-w-0">
                      {analysis.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 font-mono text-xs sm:text-sm min-w-0"
                        >
                          <div className="flex items-center gap-2 text-indigo-300 font-sans font-bold flex-wrap break-words">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs shrink-0">
                              {sIdx + 1}
                            </span>
                            <MathFormattedText text={st.action} />
                          </div>

                          <div className="pl-0 sm:pl-7 text-slate-300 flex items-center gap-1.5 sm:gap-3 flex-wrap min-w-0">
                            <span className="text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 break-all max-w-full">
                              <MathFormattedText text={st.before} />
                            </span>
                            <span className="text-amber-400 font-bold text-base">＝</span>
                            <span className="text-white font-bold bg-indigo-600/30 px-2.5 py-1 rounded-lg border border-indigo-500/30 break-all max-w-full">
                              <MathFormattedText text={st.after} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 3. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec3Num}
              </span>
              <span>{cur.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex1Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono break-words [overflow-wrap:anywhere]">
                {cur.ex1Title}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex1Step1}</span>
                  <Frac num="1" den="2²" />
                  <span> ＝ </span>
                  <Frac num="1" den="4" />
                  <span>, 3² ＝ 9</span>
                </div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap gap-1">
                  <span>➔ 12 · </span>
                  <Frac num="1" den="4" />
                  <span> － 18 : 9 ＋ 5</span>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex1Step2}</span>
                  <Frac num="1" den="4" />
                  <span> ＝ 3, 18 : 9 ＝ 2</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 3 － 2 ＋ 5</div>
                <div className="break-words">{cur.ex1Step3}</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 1 ＋ 5 ＝ 6</div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700 break-words">
                {toCleanUppercase(cur.ex2Tag)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono break-words [overflow-wrap:anywhere]">
                {cur.ex2Title}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200 min-w-0">
                <div className="break-words">{cur.ex2Step1}</div>
                <div className="pl-3 text-slate-500">➔ 4² ＋ 15 : 3 － 3 · 3⁻¹</div>
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex2Step2}</span>
                  <Frac num="1" den="3" />
                </div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap gap-1">
                  <span>➔ 16 ＋ 15 : 3 － 3 · </span>
                  <Frac num="1" den="3" />
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <span>{cur.ex2Step3}</span>
                  <Frac num="1" den="3" />
                  <span> ＝ 1</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 16 ＋ 5 － 1</div>
                <div className="break-words">{cur.ex2Step4}</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 21 － 1 ＝ 20</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}