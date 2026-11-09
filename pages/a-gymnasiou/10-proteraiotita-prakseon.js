import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const PRESETS = {
  EX1: { title: "5 ＋ 3 · (－2)²", expr: "5+3*(-2)^2" },
  EX2: { title: "2 · [ 15 － (4 ＋ 3 · 2) ]", expr: "2*[15-(4+3*2)]" },
  EX3: { title: "24 ： 6 · 2 － (－3)³", expr: "24/6*2-(-3)^3" },
  EX4: { title: "(－4)² － 2 · [ 3 ＋ (－5) ]", expr: "(-4)^2-2*[3+(-5)]" },
};

const translations = {
  el: {
    metaTitle: "Προτεραιότητα των Πράξεων | Α' Γυμνασίου",
    metaDescription: "Θεωρία, ιεραρχία πράξεων και διαδραστικό εργαστήριο βήμα-βήμα ανάλυσης αριθμητικών παραστάσεων με δυνάμεις και παρενθέσεις.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Προτεραιότητα των Πράξεων",
    heroDesc: "Μαθαίνουμε τη σωστή ιεραρχία των πράξεων: παρενθέσεις και αγκύλες, δυνάμεις, πολλαπλασιασμοί και διαιρέσεις, και τέλος προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.",
    sec1Title: "Οι Κανόνες Προτεραιότητας",
    step1Badge: "ΒΗΜΑ 1",
    step1Title: "Παρενθέσεις & Αγκύλες",
    step1Desc: "Εκτελούμε πρώτα τις πράξεις μέσα στις παρενθέσεις ( ), μετά στις αγκύλες [ ] και τέλος στα άγκιστρα { } (από μέσα προς τα έξω).",
    step2Badge: "ΒΗΜΑ 2",
    step2Title: "Δυνάμεις",
    step2Desc: "Υπολογίζουμε όλες τις δυνάμεις (αν) πριν από οποιονδήποτε πολλαπλασιασμό ή διαίρεση.",
    step3Badge: "ΒΗΜΑ 3",
    step3Title: "Πολλαπλασιασμοί & Διαιρέσεις",
    step3Desc: "Εκτελούνται με τη σειρά που εμφανίζονται, από αριστερά προς τα δεξιά.",
    step4Badge: "ΒΗΜΑ 4",
    step4Title: "Προσθέσεις & Αφαιρέσεις",
    step4Desc: "Εκτελούνται τελευταίες, επίσης με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.",
    sec2Title: "Διαδραστικό Εργαστήριο: Πληκτρολόγηση & Βήμα-Βήμα Επίλυση",
    sec2Subtitle: "Γράψε οποιαδήποτε παράσταση με δυνάμεις, παρενθέσεις και ακέραιους αριθμούς ή επίλεξε ένα έτοιμο παράδειγμα για να δεις όλη την ανάλυση βήμα προς βήμα!",
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΗ ΠΑΡΑΣΤΑΣΗΣ:",
    validSymbolsLabel: "ΕΓΚΥΡΑ ΣΥΜΒΟΛΑ:",
    clearBtn: "ΚΑΘΑΡΙΣΜΟΣ",
    presetsLabel: "Η ΕΠΙΛΕΞΕ ΕΤΟΙΜΟ ΠΑΡΑΔΕΙΓΜΑ:",
    initialExprLabel: "ΑΡΧΙΚΗ ΠΑΡΑΣΤΑΣΗ:",
    stepPrefix: "ΒΗΜΑ",
    reasonParenPower: "ΠΑΡΕΝΘΕΣΗ & ΔΥΝΑΜΗ",
    reasonParenPowerText: "Μέσα στην παρένθεση υπολογίζουμε πρώτα τη δύναμη.",
    reasonParenMultDiv: "ΠΑΡΕΝΘΕΣΗ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ / ΔΙΑΙΡΕΣΗ",
    reasonParenMultText: "Μέσα στην παρένθεση προηγείται ο πολλαπλασιασμός.",
    reasonParenDivText: "Μέσα στην παρένθεση προηγείται η διαίρεση.",
    reasonParenAddSub: "ΠΑΡΕΝΘΕΣΗ & ΠΡΟΣΘΕΣΗ / ΑΦΑΙΡΕΣΗ",
    reasonParenAddSubText: "Μέσα στην παρένθεση εκτελούμε προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.",
    reasonPower: "ΔΥΝΑΜΗ (α^ν)",
    reasonPowerText: "Υπολογίζουμε κατά προτεραιότητα τη δύναμη.",
    reasonMult: "ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ( · )",
    reasonMultText: "Ο πολλαπλασιασμός προηγείται της πρόσθεσης και της αφαίρεσης.",
    reasonDiv: "ΔΙΑΙΡΕΣΗ ( ： )",
    reasonDivText: "Η διαίρεση προηγείται της πρόσθεσης και της αφαίρεσης.",
    reasonAdd: "ΠΡΟΣΘΕΣΗ ( ＋ )",
    reasonSub: "ΑΦΑΙΡΕΣΗ ( － )",
    reasonAddSubText: "Εκτελούμε προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.",
    nextFormLabel: "Επόμενη μορφή:",
    invalidExprMsg: "⚠️ Μη έγκυρη παράσταση. Βεβαιώσου ότι οι πράξεις, οι δυνάμεις και οι παρενθέσεις έχουν συμπληρωθεί σωστά.",
    emptyExprMsg: "Γράψε μια παράσταση στα αριστερά για να εμφανιστούν τα βήματα.",
    finalResultTitle: "ΤΕΛΙΚΗ ΤΙΜΗ ΠΑΡΑΣΤΑΣΗΣ:",
    footnoteRule: "🔍 Αν δύο πράξεις ανήκουν στην ίδια κατηγορία προτεραιότητας, εκτελούνται αυστηρά από αριστερά προς τα δεξιά!",
  },
  en: {
    metaTitle: "Order of Operations | 7th Grade Mathematics",
    metaDescription: "Theory, hierarchy of operations and interactive step-by-step solver for numerical expressions with exponents and parentheses.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Order of Operations",
    heroDesc: "Master the correct hierarchy of operations: parentheses and brackets, powers, multiplications and divisions, and finally additions and subtractions from left to right.",
    sec1Title: "Priority Rules",
    step1Badge: "STEP 1",
    step1Title: "Parentheses & Brackets",
    step1Desc: "First evaluate operations inside parentheses ( ), then brackets [ ], and finally braces { } (from innermost outward).",
    step2Badge: "STEP 2",
    step2Title: "Powers",
    step2Desc: "Compute all powers (an) before executing any multiplication or division.",
    step3Badge: "STEP 3",
    step3Title: "Multiplications & Divisions",
    step3Desc: "Perform in the order they appear, strictly from left to right.",
    step4Badge: "STEP 4",
    step4Title: "Additions & Subtractions",
    step4Desc: "Evaluated last, strictly in order of appearance from left to right.",
    sec2Title: "Interactive Lab: Input & Step-by-Step Solver",
    sec2Subtitle: "Enter any numerical expression with exponents, parentheses and integers, or pick a preset example to inspect the step-by-step breakdown!",
    inputLabel: "EXPRESSION INPUT:",
    validSymbolsLabel: "VALID SYMBOLS:",
    clearBtn: "CLEAR",
    presetsLabel: "OR SELECT A PRESET EXAMPLE:",
    initialExprLabel: "INITIAL EXPRESSION:",
    stepPrefix: "STEP",
    reasonParenPower: "PARENTHESIS & POWER",
    reasonParenPowerText: "Inside parentheses, compute powers first.",
    reasonParenMultDiv: "PARENTHESIS & MULTIPLICATION / DIVISION",
    reasonParenMultText: "Inside parentheses, multiplication takes priority.",
    reasonParenDivText: "Inside parentheses, division takes priority.",
    reasonParenAddSub: "PARENTHESIS & ADDITION / SUBTRACTION",
    reasonParenAddSubText: "Inside parentheses, perform addition and subtraction from left to right.",
    reasonPower: "POWER (a^n)",
    reasonPowerText: "Powers take priority over multiplication and division.",
    reasonMult: "MULTIPLICATION ( · )",
    reasonMultText: "Multiplication takes precedence over addition and subtraction.",
    reasonDiv: "DIVISION ( ： )",
    reasonDivText: "Division takes precedence over addition and subtraction.",
    reasonAdd: "ADDITION ( ＋ )",
    reasonSub: "SUBTRACTION ( － )",
    reasonAddSubText: "Perform addition and subtraction in order from left to right.",
    nextFormLabel: "Next form:",
    invalidExprMsg: "⚠️ Invalid expression. Ensure operations, exponents, and parentheses are properly balanced.",
    emptyExprMsg: "Type an expression on the left to reveal the step-by-step solution.",
    finalResultTitle: "FINAL EVALUATION:",
    footnoteRule: "🔍 If two operations share the same precedence level, evaluate them strictly from left to right!",
  }
};

export default function ProteraiotitaPrakseonTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [customExpr, setCustomExpr] = useState("5+3*(-2)^2-4*3");

  const handleInputChange = (val) => {
    const clean = val.replace(/\s+/g, '').replace(/[^0-9+\-*/^()[\].,]/g, '');
    setCustomExpr(clean);
  };

  const handleInsertSymbol = (sym) => {
    setCustomExpr((prev) => prev + sym);
  };

  const handleDelete = () => {
    setCustomExpr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCustomExpr('');
  };

  const formatLocaleNumber = (val) => {
    const loc = locale === 'en' ? 'en-US' : 'el-GR';
    return val.toLocaleString(loc);
  };

  const tokensToString = (tokens) => {
    return tokens
      .map((tok, idx) => {
        if (tok.type === 'OPERATOR') {
          if (tok.value === '*') return ' · ';
          if (tok.value === '/') return ' ： ';
          if (tok.value === '^') return '^';
          if (tok.value === '+') return ' ＋ ';
          if (tok.value === '-') return ' － ';
          return ` ${tok.value} `;
        }
        if (tok.type === 'PAREN') {
          return tok.value;
        }
        if (tok.type === 'NUMBER' && tok.value < 0) {
          const hasOpen =
            idx > 0 &&
            tokens[idx - 1].type === 'PAREN' &&
            (tokens[idx - 1].value === '(' || tokens[idx - 1].value === '[');
          const hasClose =
            idx < tokens.length - 1 &&
            tokens[idx + 1].type === 'PAREN' &&
            (tokens[idx + 1].value === ')' || tokens[idx + 1].value === ']');
          if (hasOpen && hasClose) {
            return formatLocaleNumber(tok.value);
          }
          return `(${formatLocaleNumber(tok.value)})`;
        }
        return formatLocaleNumber(tok.value);
      })
      .join('');
  };

  const generateSteps = (exprStr) => {
    const steps = [];
    let currentStr = exprStr
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/\[/g, '(')
      .replace(/\]/g, ')')
      .trim();

    if (!currentStr) return { steps: [], final: "0", isValid: false };

    const tokenize = (str) => {
      const res = [];
      let i = 0;
      while (i < str.length) {
        const ch = str[i];

        if (ch === '(' || ch === ')') {
          res.push({ type: 'PAREN', value: ch });
          i++;
          continue;
        }

        if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
          if (ch === '-') {
            const prev = res[res.length - 1];
            if (!prev || prev.type === 'OPERATOR' || (prev.type === 'PAREN' && prev.value === '(')) {
              let numStr = '-';
              i++;
              while (i < str.length && /[0-9.]/.test(str[i])) {
                numStr += str[i];
                i++;
              }
              if (numStr === '-') return null;
              res.push({ type: 'NUMBER', value: parseFloat(numStr) });
              continue;
            }
          }
          res.push({ type: 'OPERATOR', value: ch });
          i++;
          continue;
        }

        if (/[0-9.]/.test(ch)) {
          let numStr = '';
          while (i < str.length && /[0-9.]/.test(str[i])) {
            numStr += str[i];
            i++;
          }
          res.push({ type: 'NUMBER', value: parseFloat(numStr) });
          continue;
        }
        i++;
      }
      return res;
    };

    let tokens = tokenize(currentStr);
    if (!tokens || tokens.length === 0) return { steps: [], final: "0", isValid: false };

    let openCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'PAREN') {
        if (tokens[i].value === '(') openCount++;
        if (tokens[i].value === ')') openCount--;
        if (openCount < 0) return { steps: [], final: "0", isValid: false };
      }
      if (i > 0 && tokens[i].type === 'NUMBER' && tokens[i - 1].type === 'NUMBER') {
        return { steps: [], final: "0", isValid: false };
      }
    }
    if (openCount !== 0) return { steps: [], final: "0", isValid: false };

    const firstToken = tokens[0];
    const lastToken = tokens[tokens.length - 1];
    if (firstToken.type === 'OPERATOR') return { steps: [], final: "0", isValid: false };
    if (lastToken.type === 'OPERATOR') return { steps: [], final: "0", isValid: false };

    let safetyCounter = 0;

    while (safetyCounter < 30 && tokens.length > 1) {
      safetyCounter++;
      let targetIdx = -1;
      let reasonType = '';
      let reasonText = '';

      let openParenIdx = -1;
      let closeParenIdx = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'PAREN' && tokens[i].value === '(') openParenIdx = i;
        if (tokens[i].type === 'PAREN' && tokens[i].value === ')') {
          closeParenIdx = i;
          break;
        }
      }

      if (openParenIdx !== -1 && closeParenIdx !== -1) {
        if (closeParenIdx === openParenIdx + 2 && tokens[openParenIdx + 1].type === 'NUMBER') {
          tokens.splice(closeParenIdx, 1);
          tokens.splice(openParenIdx, 1);
          continue;
        }

        let subTokens = tokens.slice(openParenIdx + 1, closeParenIdx);
        let subTarget = -1;

        for (let j = 0; j < subTokens.length; j++) {
          if (subTokens[j].type === 'OPERATOR' && subTokens[j].value === '^') {
            subTarget = j;
            reasonType = t.reasonParenPower;
            reasonText = t.reasonParenPowerText;
            break;
          }
        }

        if (subTarget === -1) {
          for (let j = 0; j < subTokens.length; j++) {
            if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '*' || subTokens[j].value === '/')) {
              subTarget = j;
              reasonType = t.reasonParenMultDiv;
              reasonText = subTokens[j].value === '*' ? t.reasonParenMultText : t.reasonParenDivText;
              break;
            }
          }
        }

        if (subTarget === -1) {
          for (let j = 0; j < subTokens.length; j++) {
            if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '+' || subTokens[j].value === '-')) {
              subTarget = j;
              reasonType = t.reasonParenAddSub;
              reasonText = t.reasonParenAddSubText;
              break;
            }
          }
        }

        if (subTarget !== -1) {
          targetIdx = openParenIdx + 1 + subTarget;
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && tokens[i].value === '^') {
            targetIdx = i;
            reasonType = t.reasonPower;
            reasonText = t.reasonPowerText;
            break;
          }
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '*' || tokens[i].value === '/')) {
            targetIdx = i;
            reasonType = tokens[i].value === '*' ? t.reasonMult : t.reasonDiv;
            reasonText = tokens[i].value === '*' ? t.reasonMultText : t.reasonDivText;
            break;
          }
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '+' || tokens[i].value === '-')) {
            targetIdx = i;
            reasonType = tokens[i].value === '+' ? t.reasonAdd : t.reasonSub;
            reasonText = t.reasonAddSubText;
            break;
          }
        }
      }

      if (targetIdx !== -1 && targetIdx > 0 && targetIdx < tokens.length - 1) {
        const num1Token = tokens[targetIdx - 1];
        const opToken = tokens[targetIdx];
        const num2Token = tokens[targetIdx + 1];

        if (num1Token.type !== 'NUMBER' || num2Token.type !== 'NUMBER') {
          return { steps: [], final: "0", isValid: false };
        }

        const num1 = num1Token.value;
        const op = opToken.value;
        const num2 = num2Token.value;

        let res = 0;
        if (op === '+') res = num1 + num2;
        else if (op === '-') res = num1 - num2;
        else if (op === '*') res = num1 * num2;
        else if (op === '/') res = num2 !== 0 ? num1 / num2 : 0;
        else if (op === '^') res = Math.pow(num1, num2);

        const formattedRes = parseFloat(res.toFixed(4));
        const opChar = op === '*' ? '·' : op === '/' ? '：' : op === '^' ? '^' : op === '+' ? '＋' : '－';

        const formatCalcNum = (val) => {
          const str = formatLocaleNumber(val);
          return val < 0 ? `(${str})` : str;
        };

        steps.push({
          level: `${t.stepPrefix} ${steps.length + 1}: ${reasonType}`,
          text: reasonText,
          calculation: `${formatCalcNum(num1)} ${opChar} ${formatCalcNum(num2)} ＝ ${formatCalcNum(formattedRes)}`,
          currentForm: '',
        });

        tokens.splice(targetIdx - 1, 3, { type: 'NUMBER', value: formattedRes });

        if (
          targetIdx - 2 >= 0 &&
          targetIdx < tokens.length &&
          tokens[targetIdx - 2].type === 'PAREN' &&
          tokens[targetIdx - 2].value === '(' &&
          tokens[targetIdx].type === 'PAREN' &&
          tokens[targetIdx].value === ')'
        ) {
          tokens.splice(targetIdx, 1);
          tokens.splice(targetIdx - 2, 1);
        }

        steps[steps.length - 1].currentForm = tokensToString(tokens);
      } else {
        break;
      }
    }

    if (tokens.length === 3 && tokens[0].value === '(' && tokens[2].value === ')') {
      tokens = [tokens[1]];
    }

    const isValidResult = tokens.length === 1 && tokens[0].type === 'NUMBER';

    return {
      steps: steps,
      final: isValidResult ? formatLocaleNumber(tokens[0].value) : "0",
      isValid: isValidResult,
    };
  };

  const analysis = generateSteps(customExpr);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/10-proteraiotita-prakseon-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΩΝ ΠΡΑΞΕΩΝ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase font-black text-indigo-700 tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-lg">🧩</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.step1Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step1Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-100 font-mono text-[11px] text-center font-bold text-indigo-950 break-words [overflow-wrap:anywhere]">
                2 · [ 5 ＋ (4 － 1) ] ＝ 2 · [ 5 ＋ 3 ]
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase font-black text-sky-700 tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-lg">⚡</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.step2Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step2Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 font-mono text-[11px] text-center font-bold text-sky-950 break-words [overflow-wrap:anywhere]">
                3 · (－2)<sup>2</sup> ＝ 3 · 4 ＝ 12
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase font-black text-purple-700 tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-lg">✖️</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.step3Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step3Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-purple-100 font-mono text-[11px] text-center font-bold text-purple-950 break-words [overflow-wrap:anywhere]">
                18 ： 3 · 2 ＝ 6 · 2 ＝ 12
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs uppercase font-black text-emerald-700 tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-lg">➕</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.step4Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step4Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 font-mono text-[11px] text-center font-bold text-emerald-950 break-words [overflow-wrap:anywhere]">
                10 － 4 ＋ 3 ＝ 6 ＋ 3 ＝ 9
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΛΗΚΤΡΟΛΟΓΗΣΗΣ & ΑΝΑΛΥΣΗΣ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 break-words [overflow-wrap:anywhere]">
              {t.sec2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ΑΡΙΣΤΕΡΑ: ΠΛΑΙΣΙΟ ΕΙΣΑΓΩΓΗΣ, ΠΛΗΚΤΡΟΛΟΓΙΟ & PRESETS (5 COLS) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-3xl space-y-5 w-full min-w-0">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.inputLabel)}
                </label>
                <input
                  type="text"
                  value={customExpr}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g. 5+3*(-2)^2"
                  className="w-full text-base sm:text-lg font-mono font-black text-center p-3 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm text-indigo-900 outline-none focus:border-indigo-600 tracking-wide transition box-border"
                />
              </div>

              {/* Πληκτρολόγιο Μαθηματικών Συμβόλων */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  {toCleanUppercase(t.validSymbolsLabel)}
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {['^', '(', ')', '[', ']', '*', '/', '+', '-'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertSymbol(sym)}
                      className="h-10 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-800 font-mono font-black text-sm transition shadow-sm touch-manipulation"
                    >
                      {sym === '*' ? '·' : sym === '/' ? '：' : sym === '+' ? '＋' : sym === '-' ? '－' : sym}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 active:scale-95 text-amber-900 font-bold text-xs transition shadow-sm touch-manipulation"
                  >
                    DEL
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-10 col-span-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-95 text-rose-900 font-bold text-xs transition shadow-sm touch-manipulation"
                  >
                    {toCleanUppercase(t.clearBtn)}
                  </button>
                </div>
              </div>

              {/* Έτοιμα Παραδείγματα */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  {toCleanUppercase(t.presetsLabel)}
                </span>
                <div className="flex flex-col gap-1.5">
                  {Object.keys(PRESETS).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCustomExpr(PRESETS[key].expr)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl border font-mono font-bold text-xs transition-all touch-manipulation break-words [overflow-wrap:anywhere] ${
                        customExpr === PRESETS[key].expr
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {PRESETS[key].title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΖΩΝΤΑΝΗ ΑΝΑΛΥΣΗ ΒΗΜΑ-ΒΗΜΑ (7 COLS) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6 w-full min-w-0">
              <div className="w-full text-center space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.initialExprLabel)}
                </span>
                <div className="text-sm sm:text-lg md:text-xl font-mono font-black text-indigo-900 bg-indigo-50 inline-block px-4 sm:px-6 py-2 rounded-2xl border border-indigo-100 shadow-xs max-w-full break-words [overflow-wrap:anywhere]">
                  {customExpr
                    .replace(/\*/g, ' · ')
                    .replace(/\//g, ' ： ')
                    .replace(/\+/g, ' ＋ ')
                    .replace(/-/g, ' － ') || '—'}
                </div>
              </div>

              {/* Λίστα Βημάτων */}
              <div className="w-full space-y-4 my-auto min-w-0">
                {analysis.isValid && analysis.steps.length > 0 ? (
                  analysis.steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center w-full space-y-2 min-w-0">
                      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 w-full shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center font-mono gap-3 min-w-0">
                        <div className="space-y-0.5 text-left flex-1 min-w-0">
                          <div className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-wider break-words [overflow-wrap:anywhere]">
                            {toCleanUppercase(step.level)}
                          </div>
                          <div className="text-xs text-slate-300 font-sans leading-snug break-words [overflow-wrap:anywhere]">
                            {step.text}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 self-end sm:self-center max-w-full">
                          <div className="text-emerald-400 font-black text-xs sm:text-sm bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 font-mono break-words [overflow-wrap:anywhere]">
                            {step.calculation}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-slate-400 space-y-1 w-full min-w-0">
                        <span className="text-xs font-black">↓</span>
                        <span className="text-xs font-mono font-bold tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 text-center max-w-full break-words [overflow-wrap:anywhere]">
                          {t.nextFormLabel} {step.currentForm || '🏁'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-6 break-words [overflow-wrap:anywhere]">
                    {customExpr ? t.invalidExprMsg : t.emptyExprMsg}
                  </div>
                )}

                {/* Τελικό Αποτέλεσμα */}
                {analysis.isValid && (
                  <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 max-w-full">
                    <span className="text-xl">🏁</span>
                    <span className="text-xs sm:text-sm font-sans uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                      {toCleanUppercase(t.finalResultTitle)}
                    </span>
                    <span className="text-lg sm:text-2xl bg-white/20 px-4 py-1 rounded-xl shadow-inner break-words [overflow-wrap:anywhere]">
                      {analysis.final}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full text-center text-[10px] sm:text-[11px] text-slate-400 pt-3 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                {t.footnoteRule}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}