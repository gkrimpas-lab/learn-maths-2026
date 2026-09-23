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
    if (den === 0) throw new Error('Διαίρεση με το μηδέν δεν ορίζεται.');
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
    if (other.n === 0) throw new Error('Διαίρεση με το μηδέν δεν ορίζεται.');
    return new Rational(this.n * other.d, this.d * other.n);
  }

  pow(exp) {
    const e = Math.round(exp);
    if (e === 0) return new Rational(1, 1);
    if (e > 0) {
      return new Rational(Math.pow(this.n, e), Math.pow(this.d, e));
    }
    if (this.n === 0) throw new Error('Μηδενική βάση με αρνητικό εκθέτη.');
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

// Component ασφαλούς μορφοποίησης εκφράσεων
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

    // 1. Αρνητικό κλάσμα σε παρένθεση: π.χ. (-1/3) ή (-1/2^2)
    const negParenFrac = raw.slice(i).match(/^\(\s*-\s*(\d+)\s*\/\s*(\d+(?:\^\d+)?)\s*\)/);
    if (negParenFrac) {
      tokens.push({ type: 'paren', val: '(' });
      tokens.push({ type: 'frac', num: `-${negParenFrac[1]}`, den: negParenFrac[2] });
      tokens.push({ type: 'paren', val: ')' });
      i += negParenFrac[0].length;
      continue;
    }

    // 2. Απλό κλάσμα: π.χ. 13/6 ή -1/3
    const fracMatch = raw.slice(i).match(/^(-?\d+)\s*\/\s*(\d+(?:\^\d+)?)/);
    if (fracMatch) {
      tokens.push({ type: 'frac', num: fracMatch[1], den: fracMatch[2] });
      i += fracMatch[0].length;
      continue;
    }

    // 3. Δύναμη: π.χ. 3^2 ή 2^(-1) ή )^0
    if (ch === '^') {
      let expStr = '';
      let j = i + 1;

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
      }
      i = j;
      continue;
    }

    // 4. Σύμβολα πράξεων & ισότητας
    if (ch === '*' || ch === '·') {
      tokens.push({ type: 'op', val: '·' });
      i++;
      continue;
    }
    if (ch === ':' || ch === '/') {
      tokens.push({ type: 'op', val: ':' });
      i++;
      continue;
    }
    if (ch === '+') {
      tokens.push({ type: 'op', val: '+' });
      i++;
      continue;
    }
    if (ch === '-') {
      tokens.push({ type: 'op', val: '-' });
      i++;
      continue;
    }
    if (ch === '＝' || ch === '=') {
      tokens.push({ type: 'eq', val: '＝' });
      i++;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', val: ch });
      i++;
      continue;
    }

    // 5. Αριθμοί
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
        if (tok.type === 'op') {
          return <span key={idx} className="mx-1.5 font-bold text-slate-300">{tok.val}</span>;
        }
        if (tok.type === 'eq') {
          return <span key={idx} className="mx-2 font-bold text-amber-400 text-sm sm:text-base">＝</span>;
        }
        if (tok.type === 'paren') {
          return <span key={idx} className="font-bold text-indigo-300 mx-0.5">{tok.val}</span>;
        }
        if (tok.type === 'frac') {
          return <Frac key={idx} num={tok.num} den={tok.den} />;
        }
        if (tok.type === 'pow') {
          return (
            <span key={idx} className="inline-flex items-baseline mx-0.5">
              <span>{tok.base}</span>
              <sup className="text-amber-400 font-bold ml-0.5 text-xs sm:text-sm">{tok.exp}</sup>
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
  { label: 'Κλάσματα σε 3 παρενθέσεις', expr: '(1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)' },
  { label: 'Σύνθετη με 2 παρενθέσεις', expr: '15 + 2 * (3^2 - 2^3)^0 - (9 : 3^(-1) - 2^3)' },
  { label: '12 * 2^(-2) - 18 / 3^2 + 5', expr: '12 * 2^(-2) - 18 / 3^2 + 5' },
  { label: 'Σύνθετη: (6 - 2)^2 + 15 / 3 - 3 * 3^(-1)', expr: '(6 - 2)^2 + 15 / 3 - 3 * 3^(-1)' },
];

function parseSimpleTerm(str) {
  const clean = str.replace(/[()]/g, '').trim();
  if (clean.includes('/')) {
    const [n, d] = clean.split('/');
    return new Rational(parseInt(n, 10), parseInt(d, 10));
  }
  return new Rational(parseInt(clean, 10), 1);
}

// Ασφαλής επιλυτής με αυστηρό βήμα-βήμα υπολογισμό
function solveExpressionSteps(inputExpr) {
  const steps = [];
  // Μετατροπή των εξωτερικών διαιρέσεων / σε : (προστατεύοντας όμως τα κλάσματα εντός παρενθέσεων)
  let current = inputExpr.replace(/\s+/g, '').replace(/·/g, '*');

  // Μετατροπή του / σε : μόνο όταν είναι ανάμεσα σε παρενθέσεις ή σύνθετους όρους
  current = current.replace(/\)\/\(/g, '):(').replace(/([0-9\)])\/([0-9(])/g, (m, p1, p2) => {
    // Αν είναι απλό κλάσμα αριθμών όπως 1/2, το αφήνουμε ως έχει
    if (/^[0-9]$/.test(p1) && /^[0-9]$/.test(p2)) return `${p1}/${p2}`;
    return `${p1}:${p2}`;
  });

  if (!current) {
    return { error: 'Παρακαλώ πληκτρολόγησε μία αριθμητική παράσταση.', steps: [] };
  }

  for (let i = 0; i < current.length; i++) {
    const c = current[i];
    if (!/[0-9+\-*^():/]/.test(c)) {
      return { error: 'Η παράσταση περιέχει μη επιτρεπτούς χαρακτήρες.', steps: [] };
    }
  }

  try {
    let iteration = 0;
    const maxIterations = 35;

    while (iteration < maxIterations) {
      iteration++;

      // 1. Εντοπισμός της βαθύτερης εσωτερικής παρένθεσης
      let innerStart = -1;
      let innerEnd = -1;
      for (let i = 0; i < current.length; i++) {
        if (current[i] === '(') innerStart = i;
        if (current[i] === ')' && innerStart !== -1) {
          innerEnd = i;
          break;
        }
      }

      if (innerStart !== -1 && innerEnd !== -1) {
        const innerContent = current.substring(innerStart + 1, innerEnd);

        // Αν είναι απλός αριθμός ή κλάσμα χωρίς πράξεις (π.χ. 13/6 ή -1/3)
        const isSimpleVal = /^-?\d+(\/\d+)?$/.test(innerContent);

        if (isSimpleVal) {
          // Αν ακολουθείται από δύναμη: π.χ. (13/6)^2 ή (1)^0
          if (current[innerEnd + 1] === '^') {
            const powIdx = innerEnd + 1;
            let eEnd = powIdx + 1;
            let expStr = '';
            if (current[eEnd] === '(') {
              let closeP = eEnd + 1;
              while (closeP < current.length && current[closeP] !== ')') closeP++;
              expStr = current.substring(eEnd + 1, closeP);
              eEnd = closeP + 1;
            } else {
              if (current[eEnd] === '-' || current[eEnd] === '+') eEnd++;
              while (eEnd < current.length && /[0-9]/.test(current[eEnd])) eEnd++;
              expStr = current.substring(powIdx + 1, eEnd);
            }

            const baseRat = parseSimpleTerm(innerContent);
            const expNum = parseInt(expStr, 10);
            const resRat = baseRat.pow(expNum);
            const resVal = resRat.toString();

            const before = current;
            current = current.substring(0, innerStart) + (resRat.n < 0 ? `(${resVal})` : resVal) + current.substring(eEnd);

            steps.push({
              action: `Υπολογισμός δύναμης : (${innerContent})^${expStr} ＝ ${resVal}`,
              before,
              after: current
            });
            continue;
          }

          // Αν είναι αρνητικός αριθμός/κλάσμα και πριν υπάρχει τελεστής (π.χ. : (-1/3) ή * (-1/3)), διατηρούμε την παρένθεση
          if (innerContent.startsWith('-') && innerStart > 0 && ['*', ':', '+', '-'].includes(current[innerStart - 1])) {
            // Δεν την αφαιρούμε, γιατί στα μαθηματικά δεν γράφουμε διαδοχικούς τελεστές π.χ. : -1/3
            break;
          }

          // Αν είναι θετικός αριθμός ή κλάσμα, αφαιρούμε την παρένθεση
          current = current.substring(0, innerStart) + innerContent + current.substring(innerEnd + 1);
          continue;
        } else {
          // Η παρένθεση περιέχει πράξεις: εκτελούμε ΑΚΡΙΒΩΣ ΜΙΑ πράξη μέσα της
          const stepResult = executeSingleOperation(innerContent);
          if (stepResult) {
            const before = current;
            current = current.substring(0, innerStart + 1) + stepResult.newExpr + current.substring(innerEnd);
            steps.push({
              action: stepResult.action,
              before,
              after: current
            });
            continue;
          }
        }
      }

      // 2. Εκτέλεση πράξεων έξω από παρενθέσεις
      const globalStep = executeSingleOperation(current);
      if (globalStep) {
        const before = current;
        current = globalStep.newExpr;
        steps.push({
          action: globalStep.action,
          before,
          after: current
        });
        continue;
      }

      break;
    }

    const finalClean = current.replace(/[()]/g, '');
    return { result: finalClean, steps, error: null };
  } catch (err) {
    return { error: err.message || 'Σφάλμα κατά την ανάλυση της παράστασης.', steps: [] };
  }
}

// Εκτελεί ΑΚΡΙΒΩΣ ΜΙΑ πράξη ύψιστης προτεραιότητας σε μια έκφραση
function executeSingleOperation(expr) {
  // Α. Δυνάμεις: ^
  if (expr.includes('^')) {
    const powIdx = expr.indexOf('^');

    let bStart = powIdx - 1;
    let baseStr = '';
    if (expr[bStart] === ')') {
      let openP = bStart - 1;
      while (openP >= 0 && expr[openP] !== '(') openP--;
      baseStr = expr.substring(openP, bStart + 1);
      bStart = openP;
    } else {
      while (bStart >= 0 && /[0-9/]/.test(expr[bStart])) bStart--;
      bStart++;
      baseStr = expr.substring(bStart, powIdx);
    }

    let eEnd = powIdx + 1;
    let expStr = '';
    if (expr[eEnd] === '(') {
      let closeP = eEnd + 1;
      while (closeP < expr.length && expr[closeP] !== ')') closeP++;
      expStr = expr.substring(eEnd, closeP + 1);
      eEnd = closeP + 1;
    } else {
      if (expr[eEnd] === '-' || expr[eEnd] === '+') eEnd++;
      while (eEnd < expr.length && /[0-9]/.test(expr[eEnd])) eEnd++;
      expStr = expr.substring(powIdx + 1, eEnd);
    }

    const cleanBase = baseStr.replace(/[()]/g, '');
    const cleanExp = expStr.replace(/[()]/g, '');

    const bRat = parseSimpleTerm(cleanBase);
    const expNum = parseInt(cleanExp, 10);
    const resRat = bRat.pow(expNum);
    const resVal = resRat.toString();

    let actionDesc = `Υπολογισμός δύναμης : ${cleanBase}^${cleanExp} ＝ ${resVal}`;
    if (expNum < 0) {
      const absE = Math.abs(expNum);
      actionDesc = `Υπολογισμός δύναμης : ${cleanBase}^${cleanExp} ＝ 1/${cleanBase}^${absE} ＝ ${resVal}`;
    }

    const replacement = resRat.n < 0 ? `(${resVal})` : resVal;
    const newExpr = expr.substring(0, bStart) + replacement + expr.substring(eEnd);
    return { action: actionDesc, newExpr };
  }

  // Β. Πολλαπλασιασμοί & Διαιρέσεις (*, :)
  // Πλήρης υποστήριξη όρων όπως: 247/24 : (-1/3)
  let opIdx = -1;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '*' || expr[i] === ':') {
      opIdx = i;
      break;
    }
  }

  if (opIdx !== -1) {
    const op = expr[opIdx];

    // Αριστερός όρος
    let lStart = opIdx - 1;
    let leftStr = '';
    if (expr[lStart] === ')') {
      let openP = lStart - 1;
      while (openP >= 0 && expr[openP] !== '(') openP--;
      leftStr = expr.substring(openP, lStart + 1);
      lStart = openP;
    } else {
      while (lStart >= 0 && /[0-9/]/.test(expr[lStart])) lStart--;
      lStart++;
      leftStr = expr.substring(lStart, opIdx);
    }

    // Δεξιός όρος (μπορεί να είναι π.χ. (-1/3) ή απλό 19/4)
    let rEnd = opIdx + 1;
    let rightStr = '';
    if (expr[rEnd] === '(') {
      let closeP = rEnd + 1;
      while (closeP < expr.length && expr[closeP] !== ')') closeP++;
      rightStr = expr.substring(rEnd, closeP + 1);
      rEnd = closeP + 1;
    } else {
      while (rEnd < expr.length && /[0-9/]/.test(expr[rEnd])) rEnd++;
      rightStr = expr.substring(opIdx + 1, rEnd);
    }

    const lRat = parseSimpleTerm(leftStr);
    const rRat = parseSimpleTerm(rightStr);
    const resRat = op === '*' ? lRat.mul(rRat) : lRat.div(rRat);
    const resVal = resRat.toString();

    // Αν το αποτέλεσμα είναι αρνητικό και πριν υπάρχει άλλος τελεστής, διατηρούμε παρένθεση
    const replacement = resRat.n < 0 && lStart > 0 && ['*', ':', '+', '-'].includes(expr[lStart - 1])
      ? `(${resVal})`
      : resVal;

    const newExpr = expr.substring(0, lStart) + replacement + expr.substring(rEnd);
    return {
      action: `${op === '*' ? 'Πολλαπλασιασμός' : 'Διαίρεση'} : ${leftStr} ${op === '*' ? '·' : ':'} ${rightStr} ＝ ${resVal}`,
      newExpr
    };
  }

  // Γ. Προσθέσεις & Αφαιρέσεις (+, -)
  for (let i = 1; i < expr.length; i++) {
    if (expr[i] === '+' || (expr[i] === '-' && expr[i - 1] !== '(')) {
      const op = expr[i];

      // Αριστερός όρος
      let lStart = i - 1;
      let leftStr = '';
      if (expr[lStart] === ')') {
        let openP = lStart - 1;
        while (openP >= 0 && expr[openP] !== '(') openP--;
        leftStr = expr.substring(openP, lStart + 1);
        lStart = openP;
      } else {
        while (lStart >= 0 && /[0-9/]/.test(expr[lStart])) lStart--;
        if (lStart === 0 && expr[0] === '-') lStart = 0;
        else lStart++;
        leftStr = expr.substring(lStart, i);
      }

      // Δεξιός όρος
      let rEnd = i + 1;
      let rightStr = '';
      if (expr[rEnd] === '(') {
        let closeP = rEnd + 1;
        while (closeP < expr.length && expr[closeP] !== ')') closeP++;
        rightStr = expr.substring(rEnd, closeP + 1);
        rEnd = closeP + 1;
      } else {
        while (rEnd < expr.length && /[0-9/]/.test(expr[rEnd])) rEnd++;
        rightStr = expr.substring(i + 1, rEnd);
      }

      const lRat = parseSimpleTerm(leftStr);
      const rRat = parseSimpleTerm(rightStr);
      const resRat = op === '+' ? lRat.add(rRat) : lRat.sub(rRat);
      const resVal = resRat.toString();

      const replacement = resRat.n < 0 && lStart > 0 && ['*', ':', '+', '-'].includes(expr[lStart - 1])
        ? `(${resVal})`
        : resVal;

      const newExpr = expr.substring(0, lStart) + replacement + expr.substring(rEnd);
      return {
        action: `${op === '+' ? 'Πρόσθεση' : 'Αφαίρεση'} : ${leftStr} ${op} ${rightStr} ＝ ${resVal}`,
        newExpr
      };
    }
  }

  return null;
}

export default function ArithmitikiParastasiTheoria() {
  const [customExpr, setCustomExpr] = useState('(1/2 + 5/3) * (3 + 7/4) / (1/2 - 5/6)');

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
