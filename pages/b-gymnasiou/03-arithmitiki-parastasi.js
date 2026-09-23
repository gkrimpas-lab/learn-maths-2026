import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  const renderTerm = (term) => {
    if (term.includes('^')) {
      const [b, e] = term.split('^');
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
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{renderTerm(cleanNum)}</span>
        <span className="pt-0.5 px-1">{renderTerm(cleanDen)}</span>
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
      tokens.push({ type: 'op', val: '+' }); i++; continue;
    }
    if (ch === '-') {
      tokens.push({ type: 'op', val: '-' }); i++; continue;
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
        if (tok.type === 'op') return <span key={idx} className="mx-1.5 font-bold text-slate-300">{tok.val}</span>;
        if (tok.type === 'eq') return <span key={idx} className="mx-2 font-bold text-amber-400 text-sm sm:text-base">＝</span>;
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
  { label: 'Σύνθετη με αρνητικούς: -6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13', expr: '-6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13' },
  { label: 'Κλάσματα σε παρενθέσεις', expr: '(1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)' },
  { label: 'Σύνθετη με εκθέτη στο τέλος', expr: '15 + 2 * (3^2 - 2^3)^0 - (9 : 3^(-1) - 2^3)' },
  { label: '12 * 2^(-2) - 18 / 3^2 + 5', expr: '12 * 2^(-2) - 18 / 3^2 + 5' },
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

// ---------------------------------------------------------
// Ο ΠΥΡΗΝΑΣ ΤΟΥ ΕΠΙΛΥΤΗ (Απόλυτη ιεραρχία πράξεων & Ασφάλεια)
// ---------------------------------------------------------

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

function executeSingleOperation(expr) {
  if (expr.includes('^')) {
    const powIdx = expr.indexOf('^');
    const left = getLeftOperand(expr, powIdx);
    const right = getRightOperand(expr, powIdx);

    const bRat = parseSimpleTerm(left.str);
    const expNum = parseInt(right.str.replace(/[()]/g, ''), 10);
    const resRat = bRat.pow(expNum);
    const resVal = resRat.toString();

    let actionDesc = `Υπολογισμός δύναμης : ${left.str}^${right.str} ＝ ${resVal}`;
    if (expNum < 0) {
      actionDesc = `Υπολογισμός δύναμης : ${left.str}^${right.str} ＝ 1/${left.str}^${Math.abs(expNum)} ＝ ${resVal}`;
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

    return {
      action: `${op === '*' ? 'Πολλαπλασιασμός' : 'Διαίρεση'} : ${left.str} ${op === '*' ? '·' : ':'} ${right.str} ＝ ${resVal}`,
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

    return {
      action: `${op === '+' ? 'Πρόσθεση' : 'Αφαίρεση'} : ${left.str} ${op} ${right.str} ＝ ${resVal}`,
      newExpr: newExpr.replace(/\+-/g, '-').replace(/--/g, '+')
    };
  }

  return null;
}

function solveExpressionSteps(inputExpr) {
  const steps = [];
  
  let current = inputExpr.replace(/\s+/g, '').replace(/·/g, '*');
  current = current.replace(/\)\/\(/g, '):(').replace(/([0-9)])\/([0-9(])/g, (m, p1, p2) => {
    if (/[0-9]/.test(p1) && /[0-9]/.test(p2)) return `${p1}/${p2}`;
    return `${p1}:${p2}`;
  });

  if (!current) return { error: 'Παρακαλώ πληκτρολόγησε μία αριθμητική παράσταση.', steps: [] };

  // ΠΡΟΣΤΑΣΙΑ (VALIDATION GUARD)
  const openP = (current.match(/\(/g) || []).length;
  const closeP = (current.match(/\)/g) || []).length;
  if (openP !== closeP) {
    return { error: 'Η παράσταση περιέχει ασύμμετρες παρενθέσεις. Έλεγξε αν άνοιξες και έκλεισες σωστά.', steps: [] };
  }
  if (/[+\-*/^:]$/.test(current)) {
    return { error: 'Η παράσταση δεν έχει ολοκληρωθεί (καταλήγει σε σύμβολο πράξης).', steps: [] };
  }
  if (/\(\)/.test(current)) {
    return { error: 'Η παράσταση περιέχει κενή παρένθεση.', steps: [] };
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
            const globalStep = executeSingleOperation(current);
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
             const globalStep = executeSingleOperation(current);
             if (globalStep) {
               const before = current;
               current = globalStep.newExpr;
               steps.push({ action: globalStep.action, before, after: current });
               continue;
             }
             break;
          }
        } else {
          const stepResult = executeSingleOperation(innerContent);
          if (stepResult) {
            const before = current;
            current = current.substring(0, innerStart + 1) + stepResult.newExpr + current.substring(innerEnd);
            steps.push({ action: `Πράξη στην παρένθεση : ${stepResult.action}`, before, after: current });
            continue;
          }
        }
      }

      const globalStep = executeSingleOperation(current);
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
    return { error: 'Σφάλμα ή ημιτελής παράσταση. Συνέχισε την πληκτρολόγηση.', steps: [] };
  }
}

export default function ArithmitikiParastasiTheoria() {
  const [customExpr, setCustomExpr] = useState('-6 - (4 + 9 - 2^2)^3 + 6 * (-3) - 13');

  const analysis = useMemo(() => {
    return solveExpressionSteps(customExpr);
  }, [customExpr]);

  return (
    <Layout
      title="Αριθμητικές Παραστάσεις & Προτεραιότητα Πράξεων | Β' Γυμνασίου"
      description="Θεωρία, κανόνες προτεραιότητας πράξεων με δυνάμεις αρνητικού εκθέτη και διαδραστικός επιλυτής βήμα-βήμα για τη Β' Γυμνασίου."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/03-arithmitiki-parastasi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 3
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΑΡΙΘΜΗΤΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εμβαθύνουμε στην ιεραρχία των πράξεων ενσωματώνοντας δυνάμεις με αρνητικό εκθέτη και κλάσματα. Πληκτρολόγησε τη δική σου παράσταση και δες την επίλυση βήμα-βήμα με απόλυτη κλασματική ακρίβεια!
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΗΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Σειρά Εκτέλεσης των Πράξεων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Αριθμητική παράσταση</strong> ονομάζεται μια σειρά από αριθμούς που συνδέονται μεταξύ τους με τα σύμβολα των πράξεων και ενδεχομένως με παρενθέσεις.
              </p>
              <p>
                Για να έχει κάθε παράσταση <strong>μοναδικό και αδιαμφισβήτητο αποτέλεσμα</strong>, ακολουθούμε απαρέγκλιτα την εξής σειρά:
              </p>
              
              <div className="space-y-3 font-sans">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">1</span>
                  <div>
                    <strong className="text-indigo-950 block">Παρενθέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούμε πρώτα τις πράξεις μέσα στις παρενθέσεις, ξεκινώντας από τις πιο εσωτερικές προς τις εξωτερικές.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">2</span>
                  <div>
                    <strong className="text-amber-950 block">Δυνάμεις (Θετικοί & Αρνητικοί Εκθέτες):</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Υπολογίζουμε όλες τις δυνάμεις (π.χ. <span className="font-mono font-bold">2³ = 8</span>, <span className="font-mono font-bold">3⁻¹ = <Frac num="1" den="3" /></span>, <span className="font-mono font-bold">α⁰ = 1</span>).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">3</span>
                  <div>
                    <strong className="text-slate-900 block">Πολλαπλασιασμοί & Διαιρέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούνται με τη σειρά που εμφανίζονται από <strong>αριστερά προς τα δεξιά</strong>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">4</span>
                  <div>
                    <strong className="text-slate-900 block">Προσθέσεις & Αφαιρέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούνται τελευταίες, επίσης με τη σειρά από <strong>αριστερά προς τα δεξιά</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Παγίδες */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΓΙΔΕΣ ΤΗΣ Β' ΓΥΜΝΑΣΙΟΥ
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">1. ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ ΜΕΣΑ ΣΕ ΠΡΑΞΕΙΣ</strong>
                  <p className="text-slate-600">
                    Ο αρνητικός εκθέτης μετατρέπεται πρώτα σε κλάσμα και διατηρείται ως κλάσμα:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center flex-wrap">
                    <span>3 · 3<sup>-1</sup> ＝ 3 · </span>
                    <Frac num="1" den="3" />
                    <span> ＝ 1</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">2. ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ</strong>
                  <p className="text-slate-600">
                    Η θέση της παρένθεσης αλλάζει ριζικά το αποτέλεσμα:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                    <div>(-3)<sup>2</sup> ＝ +9 <span className="text-[11px] text-slate-500 font-sans">(το πρόσημο είναι μέσα στη δύναμη)</span></div>
                    <div>-3<sup>2</sup> ＝ -9 <span className="text-[11px] text-slate-500 font-sans">(πρώτα η δύναμη 3²=9 και μετά το μείον)</span></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">3. ΔΙΑΔΟΧΙΚΕΣ ΔΙΑΙΡΕΣΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ</strong>
                  <p className="text-slate-600">
                    Δεν αλλάζουμε τη σειρά! Πάντα από αριστερά προς τα δεξιά:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    12 : 3 · 2 ＝ 4 · 2 ＝ 8 <span className="text-rose-600 font-sans font-bold">(ΟΧΙ 12 : 6 = 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: STEP-BY-STEP EVALUATOR */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Διαδραστικό Εργαστήριο: Επίλυση Βήμα-Βήμα με Προτεραιότητα & Κλάσματα
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Γράψε τη δική σου αριθμητική παράσταση στο παρακάτω πλαίσιο (χρησιμοποιώντας αριθμούς, <span className="font-mono font-bold">+</span>, <span className="font-mono font-bold">-</span>, <span className="font-mono font-bold">*</span>, <span className="font-mono font-bold">/</span>, <span className="font-mono font-bold">^</span> για δύναμη και παρενθέσεις) ή διάλεξε ένα έτοιμο παράδειγμα για να δεις την ανάλυση:
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:</span>
            {PRESET_EXPRESSIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomExpr(item.expr)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΤΗΝ ΠΑΡΑΣΤΑΣΗ:
            </label>
            <div className="relative">
              <input
                type="text"
                value={customExpr}
                onChange={(e) => setCustomExpr(e.target.value)}
                placeholder="π.χ. (1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)"
                className="w-full h-14 px-4 sm:px-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none"
              />
              {customExpr && (
                <button
                  type="button"
                  onClick={() => setCustomExpr('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all"
                >
                  ΚΑΘΑΡΙΣΜΟΣ
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 font-mono">
              <span>Σύμβολα: + (πρόσθεση), - (αφαίρεση), * (πολλαπλασιασμός), / (διαίρεση/κλάσμα), ^ (δύναμη)</span>
            </div>
          </div>

          {/* Οθόνη Αποτελέσματος & Βημάτων */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white space-y-6 shadow-inner">
            {analysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{analysis.error}</span>
              </div>
            ) : (
              <>
                {/* Τελικό Αποτέλεσμα Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1">
                      ΑΡΧΙΚΗ ΠΑΡΑΣΤΑΣΗ
                    </span>
                    <div className="text-lg sm:text-2xl font-black text-amber-300">
                      <MathFormattedText text={customExpr} />
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                      ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ
                    </span>
                    <div className="text-2xl sm:text-4xl font-black font-mono text-white flex items-center gap-1.5 sm:justify-end">
                      <span className="text-amber-400 font-bold">＝</span>
                      <MathFormattedText text={analysis.result} />
                    </div>
                  </div>
                </div>

                {/* Ανάλυση Βημάτων */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΒΑΣΕΙ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ:
                  </span>

                  {analysis.steps.length === 0 ? (
                    <div className="text-sm text-slate-400 italic">
                      Ο αριθμός είναι ήδη απλοποιημένος.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analysis.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 font-mono text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2 text-indigo-300 font-sans font-bold">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs">
                              {sIdx + 1}
                            </span>
                            <MathFormattedText text={st.action} />
                          </div>

                          <div className="pl-7 text-slate-300 flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                              <MathFormattedText text={st.before} />
                            </span>
                            <span className="text-amber-400 font-bold text-base">＝</span>
                            <span className="text-white font-bold bg-indigo-600/30 px-2.5 py-1 rounded-lg border border-indigo-500/30">
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
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Αναλυτικά Λυμένα Παραδείγματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 1</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Α ＝ 12 · 2<sup>-2</sup> - 18 : 3<sup>2</sup> + 5
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center flex-wrap">
                  <span>1. Δυνάμεις: 2⁻² = </span>
                  <Frac num="1" den="2^2" />
                  <span> = </span>
                  <Frac num="1" den="4" />
                  <span>, 3² = 9</span>
                </div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap">
                  <span>➔ 12 · </span>
                  <Frac num="1" den="4" />
                  <span> - 18 : 9 + 5</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span>2. Πολλαπλασιασμοί & Διαιρέσεις: 12 · </span>
                  <Frac num="1" den="4" />
                  <span> ＝ 3, 18 : 9 ＝ 2</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 3 - 2 + 5</div>
                <div>3. Προσθέσεις & Αφαιρέσεις (αριστερά προς δεξιά):</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 1 + 5 ＝ 6</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 2</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Β ＝ (6 - 2)<sup>2</sup> + 15 : 3 - 3 · 3<sup>-1</sup>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Πράξη στην παρένθεση: 6 - 2 = 4</div>
                <div className="pl-3 text-slate-500">➔ 4² + 15 : 3 - 3 · 3⁻¹</div>
                <div className="flex items-center flex-wrap">
                  <span>2. Δυνάμεις: 4² = 16, 3⁻¹ = </span>
                  <Frac num="1" den="3" />
                </div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap">
                  <span>➔ 16 + 15 : 3 - 3 · </span>
                  <Frac num="1" den="3" />
                </div>
                <div className="flex items-center flex-wrap">
                  <span>3. Διαιρέσεις & Πολλαπλασιασμοί: 15 : 3 = 5, 3 · </span>
                  <Frac num="1" den="3" />
                  <span> ＝ 1</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 16 + 5 - 1</div>
                <div>4. Προσθέσεις & Αφαιρέσεις (αριστερά προς δεξιά):</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 21 - 1 ＝ 20</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
