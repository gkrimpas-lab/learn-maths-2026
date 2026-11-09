import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων από τόνους με διατήρηση του Α'
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

// Βοηθητική συνάρτηση μορφοποίησης αριθμού ανά γλώσσα
const formatNum = (num, locale = 'el') => {
  if (Number.isInteger(num)) return num.toString();
  const formatted = Number(num.toFixed(4)).toString();
  return locale === 'el' ? formatted.replace('.', ',') : formatted;
};

// Μηχανή επίλυσης βήμα-βήμα για παραστάσεις Α' Γυμνασίου
function solveStepByStep(rawExpr, locale = 'el') {
  const strings = {
    el: {
      invalidChars: 'Η παράσταση περιέχει μη έγκυρους χαρακτήρες.',
      unbalancedParens: 'Μη ισορροπημένες παρενθέσεις.',
      missingCloseParen: 'Μη ισορροπημένες παρενθέσεις (λείπει κλείσιμο).',
      powDesc: 'Υπολογισμός δύναμης',
      divByZero: 'Διαίρεση με το μηδέν (αδύνατη πράξη)!',
      mulDesc: 'Πολλαπλασιασμός',
      divDesc: 'Διαίρεση',
      addDesc: 'Πρόσθεση',
      subDesc: 'Αφαίρεση',
      inParens: 'Μέσα στην παρένθεση',
      parseError: 'Δεν ήταν δυνατή η πλήρης ανάλυση της παράστασης.',
      calcError: 'Σφάλμα κατά τον υπολογισμό.'
    },
    en: {
      invalidChars: 'The expression contains invalid characters.',
      unbalancedParens: 'Unbalanced parentheses.',
      missingCloseParen: 'Unbalanced parentheses (missing closing).',
      powDesc: 'Power calculation',
      divByZero: 'Division by zero (impossible operation)!',
      mulDesc: 'Multiplication',
      divDesc: 'Division',
      addDesc: 'Addition',
      subDesc: 'Subtraction',
      inParens: 'Inside parentheses',
      parseError: 'Could not fully analyze the expression.',
      calcError: 'Calculation error.'
    }
  }[locale];

  if (!rawExpr || !rawExpr.trim()) return { steps: [], error: null, result: null };

  // Καθαρισμός συμβόλων
  let expr = rawExpr
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/·/g, '*')
    .replace(/:/g, '/');

  // Βασικός έλεγχος έγκυρων χαρακτήρων
  if (!/^[0-9.+\-*/^()]+$/.test(expr)) {
    return { steps: [], error: strings.invalidChars, result: null };
  }

  // Έλεγχος ισορροπίας παρενθέσεων
  let balance = 0;
  for (const char of expr) {
    if (char === '(') balance++;
    if (char === ')') balance--;
    if (balance < 0) return { steps: [], error: strings.unbalancedParens, result: null };
  }
  if (balance !== 0) {
    return { steps: [], error: strings.missingCloseParen, result: null };
  }

  const steps = [];
  const maxIterations = 25;
  let iterations = 0;

  // Βοηθητική για εκτέλεση μίας πράξης χωρίς παρενθέσεις
  const resolveSimple = (sub) => {
    // 1. Δυνάμεις: ^
    const powRegex = /(-?\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/;
    let match = sub.match(powRegex);
    if (match) {
      const base = parseFloat(match[1]);
      const exp = parseFloat(match[2]);
      const val = Math.pow(base, exp);
      return {
        replaced: sub.replace(match[0], val.toString()),
        desc: `${strings.powDesc}: ${formatNum(base, locale)}<sup>${formatNum(exp, locale)}</sup> ＝ ${formatNum(val, locale)}`,
      };
    }

    // 2. Πολλαπλασιασμός και Διαίρεση: * ή /
    const mulDivRegex = /(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/;
    match = sub.match(mulDivRegex);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);
      if (op === '/' && b === 0) throw new Error(strings.divByZero);
      const val = op === '*' ? a * b : a / b;
      return {
        replaced: sub.replace(match[0], val >= 0 ? `+${val}` : `${val}`).replace(/^\++/, ''),
        desc:
          op === '*'
            ? `${strings.mulDesc}: (${formatNum(a, locale)}) · (${formatNum(b, locale)}) ＝ ${formatNum(val, locale)}`
            : `${strings.divDesc}: (${formatNum(a, locale)}) ： (${formatNum(b, locale)}) ＝ ${formatNum(val, locale)}`,
      };
    }

    // 3. Πρόσθεση και Αφαίρεση: + ή -
    const addSubRegex = /(-?\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)/;
    match = sub.match(addSubRegex);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);
      const val = op === '+' ? a + b : a - b;
      return {
        replaced: sub.replace(match[0], val.toString()),
        desc:
          op === '+'
            ? `${strings.addDesc}: (${formatNum(a, locale)}) ＋ (${formatNum(b, locale)}) ＝ ${formatNum(val, locale)}`
            : `${strings.subDesc}: (${formatNum(a, locale)}) － (${formatNum(b, locale)}) ＝ ${formatNum(val, locale)}`,
      };
    }

    return null;
  };

  try {
    let current = expr;

    while (iterations < maxIterations) {
      iterations++;
      // Καθαρισμός διπλών προσήμων (π.χ. +- -> -, -- -> +)
      let cleaned = current
        .replace(/\+\+/g, '+')
        .replace(/--/g, '+')
        .replace(/\+-/g, '-')
        .replace(/-\+/g, '-')
        .replace(/\(\+/g, '(');

      if (cleaned !== current) {
        current = cleaned;
      }

      // Αν είναι ήδη ένας απλός αριθμός, ολοκληρώσαμε
      if (/^-?\d+(?:\.\d+)?$/.test(current)) {
        break;
      }

      // Έλεγχος για την πιο εσωτερική παρένθεση
      const innerParenRegex = /\(([^()]+)\)/;
      const parenMatch = current.match(innerParenRegex);

      if (parenMatch) {
        const innerContent = parenMatch[1];
        // Αν μέσα στην παρένθεση υπάρχει απλός αριθμός, αφαιρούμε την παρένθεση
        if (/^-?\d+(?:\.\d+)?$/.test(innerContent)) {
          const simplified = current.replace(parenMatch[0], innerContent);
          current = simplified;
          continue;
        }

        const stepRes = resolveSimple(innerContent);
        if (stepRes) {
          const nextExpr = current.replace(parenMatch[0], `(${stepRes.replaced})`);
          steps.push({
            expression: nextExpr
              .replace(/\*/g, ' · ')
              .replace(/\//g, ' ： ')
              .replace(/\./g, locale === 'el' ? ',' : '.'),
            description: `${strings.inParens}: ${stepRes.desc}`,
          });
          current = nextExpr;
          continue;
        }
      } else {
        // Χωρίς παρενθέσεις
        const stepRes = resolveSimple(current);
        if (stepRes) {
          const nextExpr = stepRes.replaced;
          steps.push({
            expression: nextExpr
              .replace(/\*/g, ' · ')
              .replace(/\//g, ' ： ')
              .replace(/\./g, locale === 'el' ? ',' : '.'),
            description: stepRes.desc,
          });
          current = nextExpr;
          continue;
        }
      }

      break;
    }

    const finalVal = parseFloat(current);
    if (isNaN(finalVal)) {
      return { steps: [], error: strings.parseError, result: null };
    }

    return {
      steps,
      error: null,
      result: formatNum(finalVal, locale),
    };
  } catch (err) {
    return { steps: [], error: err.message || strings.calcError, result: null };
  }
}

export default function ProteraiotitaPrakseonTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για το Διαδραστικό Εργαστήριο
  const [expressionInput, setExpressionInput] = useState('3 + 2 * (5 - 2^3)');

  const presets = {
    el: [
      { label: 'ΠΑΡΑΔΕΙΓΜΑ 1 (ΔΥΝΑΜΗ & ΠΑΡΕΝΘΕΣΗ)', expr: '4 * (3 + 2^2) - 10' },
      { label: 'ΠΑΡΑΔΕΙΓΜΑ 2 (ΑΡΝΗΤΙΚΟΙ & ΔΙΑΙΡΕΣΗ)', expr: '18 : (2 - 5) + 3 * 4' },
      { label: 'ΠΑΡΑΔΕΙΓΜΑ 3 (ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ & ΑΦΑΙΡΕΣΗ)', expr: '20 - 3 * 4 + 8 : 2' },
      { label: 'ΠΑΡΑΔΕΙΓΜΑ 4 (ΔΕΚΑΔΙΚΟΙ)', expr: '2,5 * 4 - (1,2 + 0,8)^2' },
    ],
    en: [
      { label: 'EXAMPLE 1 (POWER & PARENTHESES)', expr: '4 * (3 + 2^2) - 10' },
      { label: 'EXAMPLE 2 (NEGATIVES & DIVISION)', expr: '18 : (2 - 5) + 3 * 4' },
      { label: 'EXAMPLE 3 (MULTIPLICATION & SUBTRACTION)', expr: '20 - 3 * 4 + 8 : 2' },
      { label: 'EXAMPLE 4 (DECIMALS)', expr: '2.5 * 4 - (1.2 + 0.8)^2' },
    ]
  }[locale];

  // Συγκεντρωτικό λεξικό i18n
  const t = {
    el: {
      pageTitle: "Προτεραιότητα Πράξεων στους Ρητούς | Α' Γυμνασίου",
      pageDesc: "Η ιεραρχία και η προτεραιότητα πράξεων με ρητούς αριθμούς (παρενθέσεις, δυνάμεις, πολλαπλασιασμοί, διαιρέσεις, προσθέσεις, αφαιρέσεις) και διαδραστικός αναλυτής βήμα-βήμα.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 19 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      mainTitle: "Προτεραιότητα Πράξεων στους Ρητούς Αριθμούς",
      mainSubtitle: "Όταν σε μια αριθμητική παράσταση συναντάμε διαφορετικές πράξεις, ακολουθούμε απαρέγκλιτα μια αυστηρή ιεραρχία. Ανακάλυψε τους κανόνες και πειραματίσου με τον έξυπνο διαδραστικό αναλυτή παραστάσεων!",

      // Ενότητα 1
      sec1Title: "Οι 4 Χρυσοί Κανόνες Προτεραιότητας",
      step1Badge: "1Ο ΒΗΜΑ (ΚΟΡΥΦΗ)",
      step1Title: "Παρενθέσεις ( ), [ ], { }",
      step1Desc: "Εκτελούνται πρώτα οι πράξεις μέσα στις παρενθέσεις, ξεκινώντας από τις πιο εσωτερικές προς τις εξωτερικές:",
      step1Note: "Οι παρενθέσεις υπερισχύουν όλων των υπόλοιπων πράξεων.",
      step2Badge: "2Ο ΒΗΜΑ",
      step2Title: "Δυνάμεις",
      step2Desc: "Υπολογίζονται αμέσως μετά όλες οι δυνάμεις:",
      step2Note: "Προσοχή στα πρόσημα: (－3)² ＝ 9, αλλά －3² ＝ －9.",
      step3Badge: "3Ο ΒΗΜΑ",
      step3Title: "Πολλαπλασιασμοί (·) & Διαιρέσεις (：)",
      step3Desc: "Εκτελούνται οι πολλαπλασιασμοί και οι διαιρέσεις με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.",
      step3Note: "Καμία από τις δύο δεν έχει προτεραιότητα έναντι της άλλης.",
      step4Badge: "4Ο ΒΗΜΑ (ΤΕΛΟΣ)",
      step4Title: "Προσθέσεις (＋) & Αφαιρέσεις (－)",
      step4Desc: "Τελευταίες εκτελούνται οι προσθέσεις και οι αφαιρέσεις, επίσης από αριστερά προς τα δεξιά.",
      step4Note: "Ολοκληρώνουν την τελική τιμή της παράστασης.",

      // Ενότητα 2
      sec2Title: "Συνηθισμένα Λάθη & Παραδείγματα Εφαρμογής",
      ex1Title: "Παράδειγμα: 5 ＋ 3 · 4",
      ex1Wrong: "ΛΑΘΟΣ: (5 ＋ 3) · 4 ＝ 8 · 4 ＝ 32 (προσθέσαμε πρώτα!)",
      ex1Right: "ΣΩΣΤΟ: 5 ＋ (3 · 4) ＝ 5 ＋ 12 ＝ 17 (προηγείται ο πολλαπλασιασμός)",
      ex2Title: "Παράδειγμα: 12 ： 3 · 2",
      ex2Wrong: "ΛΑΘΟΣ: 12 ： (3 · 2) ＝ 12 ： 6 ＝ 2 (δώσαμε προτεραιότητα στον πολλαπλασιασμό!)",
      ex2Right: "ΣΩΣΤΟ: (12 ： 3) · 2 ＝ 4 · 2 ＝ 8 (ίδια προτεραιότητα ➔ από αριστερά προς τα δεξιά)",

      // Ενότητα 3 / Εργαστήριο
      sec3Title: "Διαδραστικό Εργαστήριο: Ανάλυση Οποιασδήποτε Παράστασης Βήμα-Βήμα",
      inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΜΙΑ ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ:",
      inputPlaceholder: "π.χ. 3 + 2 * (5 - 2^3) ή 18 : (2 - 5) + 3 * 4",
      btnClear: "ΚΑΘΑΡΙΣΜΟΣ",
      supportedSymbols: "Σύμβολα που υποστηρίζονται: αριθμοί, κόμμα , ή ., παρενθέσεις ( ), δύναμη ^, πολλαπλασιασμός * ή ·, διαίρεση : ή /, πρόσθεση +, αφαίρεση -.",
      presetLabel: "ΕΠΙΛΕΞΤΕ ΕΤΟΙΜΟ ΠΑΡΑΔΕΙΓΜΑ:",
      execFlowTitle: "ΡΟΗ ΕΚΤΕΛΕΣΗΣ & ΙΣΟΤΗΤΕΣ",
      finalResLabel: "ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ:",
      initExprLabel: "Αρχική Παράσταση:",
      stepWord: "ΒΗΜΑ",
      calcFinishedLabel: "ΟΛΟΚΛΗΡΩΣΗ ΥΠΟΛΟΓΙΣΜΟΥ:",
      emptyPrompt: "Πληκτρολόγησε μια παράσταση με πράξεις παραπάνω για να δεις την ανάλυση βήμα-βήμα."
    },
    en: {
      pageTitle: "Order of Operations in Rational Numbers | 7th Grade",
      pageDesc: "Hierarchy and order of operations with rational numbers (parentheses, powers, multiplication, division, addition, subtraction) and interactive step-by-step solver.",
      backText: "7th Grade",
      btnExercises: "EXERCISES",
      badgeHeader: "7TH GRADE • CHAPTER 19 • THEORY & LAB",
      mainTitle: "Order of Operations in Rational Numbers",
      mainSubtitle: "When multiple operations appear in a numerical expression, we strictly follow an established hierarchy. Discover the rules and experiment with the interactive step-by-step analyzer!",

      // Section 1
      sec1Title: "The 4 Golden Rules of Precedence",
      step1Badge: "STEP 1 (TOP)",
      step1Title: "Parentheses ( ), [ ], { }",
      step1Desc: "Perform operations inside parentheses first, working from the innermost to the outermost:",
      step1Note: "Parentheses take precedence over all other operations.",
      step2Badge: "STEP 2",
      step2Title: "Powers",
      step2Desc: "Compute all powers immediately after parentheses:",
      step2Note: "Careful with signs: (－3)² ＝ 9, but －3² ＝ －9.",
      step3Badge: "STEP 3",
      step3Title: "Multiplication (·) & Division (：)",
      step3Desc: "Perform multiplication and division in order from left to right.",
      step3Note: "Neither multiplication nor division has priority over the other.",
      step4Badge: "STEP 4 (END)",
      step4Title: "Addition (＋) & Subtraction (－)",
      step4Desc: "Perform addition and subtraction last, also from left to right.",
      step4Note: "These conclude the final evaluation of the expression.",

      // Section 2
      sec2Title: "Common Mistakes & Worked Examples",
      ex1Title: "Example: 5 ＋ 3 · 4",
      ex1Wrong: "WRONG: (5 ＋ 3) · 4 ＝ 8 · 4 ＝ 32 (we added first!)",
      ex1Right: "CORRECT: 5 ＋ (3 · 4) ＝ 5 ＋ 12 ＝ 17 (multiplication comes first)",
      ex2Title: "Example: 12 ： 3 · 2",
      ex2Wrong: "WRONG: 12 ： (3 · 2) ＝ 12 ： 6 ＝ 2 (we gave multiplication priority!)",
      ex2Right: "CORRECT: (12 ： 3) · 2 ＝ 4 · 2 ＝ 8 (same priority ➔ evaluated left to right)",

      // Section 3 / Lab
      sec3Title: "Interactive Lab: Step-by-Step Expression Analyzer",
      inputLabel: "TYPE A NUMERICAL EXPRESSION:",
      inputPlaceholder: "e.g. 3 + 2 * (5 - 2^3) or 18 : (2 - 5) + 3 * 4",
      btnClear: "CLEAR",
      supportedSymbols: "Supported symbols: numbers, comma , or ., parentheses ( ), power ^, multiplication * or ·, division : or /, addition +, subtraction -.",
      presetLabel: "SELECT A READY EXAMPLE:",
      execFlowTitle: "EXECUTION FLOW & EQUALITIES",
      finalResLabel: "FINAL RESULT:",
      initExprLabel: "Initial Expression:",
      stepWord: "STEP",
      calcFinishedLabel: "EVALUATION COMPLETE:",
      emptyPrompt: "Type an expression with operations above to see the step-by-step evaluation."
    }
  }[locale];

  const analysis = useMemo(() => solveStepByStep(expressionInput, locale), [expressionInput, locale]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/21-proteraiotita-prakseon-riton-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {toCleanUppercase(t.mainTitle)}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΩΝ ΠΡΑΞΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span className="break-words">{toCleanUppercase(t.sec1Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1ο Επίπεδο: Παρενθέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-indigo-200 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.step1Title}</h3>
                <p className="text-slate-600">
                  {t.step1Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  ( ... ) ➔ [ ... ] ➔ {'{ ... }'}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                {t.step1Note}
              </div>
            </div>

            {/* 2ο Επίπεδο: Δυνάμεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {t.step2Title} ({locale === 'el' ? 'α' : 'a'}<sup>{locale === 'el' ? 'ν' : 'n'}</sup>)
                </h3>
                <p className="text-slate-600">
                  {t.step2Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  {locale === 'el' ? (
                    <span>α<sup>ν</sup> ＝ α · α · ... · α</span>
                  ) : (
                    <span>a<sup>n</sup> ＝ a · a · ... · a</span>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-rose-700 font-semibold">
                {t.step2Note}
              </div>
            </div>

            {/* 3ο Επίπεδο: Πολλαπλασιασμοί & Διαιρέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.step3Title}</h3>
                <p className="text-slate-600">
                  {t.step3Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  {locale === 'el' ? 'α · β  και  α ： β' : 'a · b  and  a ： b'}
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                {t.step3Note}
              </div>
            </div>

            {/* 4ο Επίπεδο: Προσθέσεις & Αφαιρέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step4Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{t.step4Title}</h3>
                <p className="text-slate-600">
                  {t.step4Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  {locale === 'el' ? 'α ＋ β  και  α － β' : 'a ＋ b  and  a － b'}
                </div>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                {t.step4Note}
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΣΥΝΗΘΗ ΛΑΘΗ & ΠΑΡΑΔΕΙΓΜΑΤΑ ΑΝΑΛΥΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span className="break-words">{toCleanUppercase(t.sec2Title)}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Παράδειγμα 1 */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="font-bold text-slate-900 text-base">
                {t.ex1Title}
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2 font-mono">
                <div className="text-rose-600 break-words">
                  ❌ <strong>{t.ex1Wrong}</strong>
                </div>
                <div className="text-emerald-700 font-bold break-words">
                  ✅ <strong>{t.ex1Right}</strong>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="font-bold text-slate-900 text-base">
                {t.ex2Title}
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-2 font-mono">
                <div className="text-rose-600 break-words">
                  ❌ <strong>{t.ex2Wrong}</strong>
                </div>
                <div className="text-emerald-700 font-bold break-words">
                  ✅ <strong>{t.ex2Right}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΝΑΛΥΤΗΣ ΠΑΡΑΣΤΑΣΕΩΝ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span className="break-words">{toCleanUppercase(t.sec3Title)}</span>
            </h2>
          </div>

          <div className="space-y-6">
            {/* Input Περιοχή & Presets */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {toCleanUppercase(t.inputLabel)}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expressionInput}
                    onChange={(e) => setExpressionInput(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className="w-full h-13 px-4 sm:px-5 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-slate-900 font-mono text-base sm:text-xl font-bold outline-none transition-all shadow-inner"
                  />
                  {expressionInput && (
                    <button
                      type="button"
                      onClick={() => setExpressionInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      {toCleanUppercase(t.btnClear)}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {t.supportedSymbols}
                </p>
              </div>

              {/* Έτοιμα Παραδείγματα (Presets) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.presetLabel)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setExpressionInput(p.expr)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-800 transition active:scale-95 shadow-sm break-words"
                    >
                      {toCleanUppercase(p.label)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Πίνακας Ανάλυσης Βήμα-Βήμα */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-6 shadow-md min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.execFlowTitle)}
                </span>
                {analysis.result !== null && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    {toCleanUppercase(t.finalResLabel)} {analysis.result}
                  </span>
                )}
              </div>

              {analysis.error ? (
                <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm font-sans flex items-center gap-2 break-words">
                  <span>⚠️</span>
                  <span>{analysis.error}</span>
                </div>
              ) : (
                <div className="space-y-4 min-w-0">
                  {/* Αρχική Παράσταση */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-400 font-sans">{t.initExprLabel}</span>
                    <span className="text-base sm:text-2xl font-black font-mono text-amber-300 break-words">
                      {expressionInput}
                    </span>
                  </div>

                  {/* Ακολουθία Βημάτων */}
                  {analysis.steps.length > 0 ? (
                    <div className="space-y-3 min-w-0">
                      {analysis.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5 transition hover:bg-white/15 min-w-0"
                        >
                          <div className="flex items-center justify-between text-xs text-indigo-300 font-sans font-bold flex-wrap gap-1">
                            <span>{toCleanUppercase(t.stepWord)} {sIdx + 1}</span>
                            <span 
                              className="text-slate-300 font-normal break-words" 
                              dangerouslySetInnerHTML={{ __html: step.description }} 
                            />
                          </div>
                          <div className="text-base sm:text-xl font-bold font-mono text-white flex items-center gap-2 flex-wrap">
                            <span className="text-amber-400">＝</span>
                            <span className="break-words">{step.expression}</span>
                          </div>
                        </div>
                      ))}

                      {/* Τελικό Κουτί Αποτελέσματος */}
                      <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300">
                        <span className="text-xs sm:text-sm font-bold font-sans">
                          {toCleanUppercase(t.calcFinishedLabel)}
                        </span>
                        <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">
                          ＝ {analysis.result}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl text-center text-xs text-slate-400 font-sans">
                      {t.emptyPrompt}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}