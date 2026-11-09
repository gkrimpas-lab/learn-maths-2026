import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα ελληνικά κεφαλαία (διατηρείται μόνο το Α')
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

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1 sm:px-1.5 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 sm:px-1.5 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// ============================================================================
// ΜΑΘΗΜΑΤΙΚΕΣ ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ (ΜΚΔ, ΕΚΠ & ΑΝΑΛΥΤΗΣ ΕΞΙΣΩΣΕΩΝ)
// ============================================================================
const gcd = (a, b) => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 1;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
};

const lcmArray = (arr) => arr.reduce((acc, val) => lcm(acc, val), 1);

const formatCleanNum = (str) => {
  return str
    .replace(/\+/g, ' ＋ ')
    .replace(/-/g, ' － ')
    .replace(/\*/g, '·')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^－ /, '－')
    .replace(/^＋ /, '');
};

// ============================================================================
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n
// ============================================================================
const TRANSLATIONS = {
  el: {
    pageTitle: "Επίλυση Εξισώσεων αx + β = γ | Α' Γυμνασίου",
    pageDescription: "Αναλυτική θεωρία και αυτόματος διαδραστικός επιλυτής εξισώσεων βήμα-βήμα (με κλάσματα, παρενθέσεις και πολλαπλά x) για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 29 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Επίλυση Εξισώσεων της Μορφής α·x ＋ β ＝ γ",
    mainSubtitle: "Μαθαίνουμε τη γενική μέθοδο επίλυσης εξισώσεων 1ου βαθμού, πώς απαλείφουμε παρενθέσεις και κλάσματα βήμα προς βήμα, και πώς χρησιμοποιούμε εξισώσεις για να λύσουμε ρεαλιστικά προβλήματα.",

    sec1Title: "Πώς Λύνουμε την Εξίσωση α·x ＋ β ＝ γ",
    step1Badge: "ΒΗΜΑ 1",
    step1Title: "Χωρισμός Γνωστών από Αγνώστους",
    step1Desc: "Μεταφέρουμε τους όρους που έχουν τον άγνωστο x στο 1ο μέλος (αριστερά) και τους σταθερούς αριθμούς στο 2ο μέλος (δεξιά), αλλάζοντας το πρόσημο κάθε όρου που αλλάζει μέλος:",
    step1Formula: "α · x ＝ γ － β",

    step2Badge: "ΒΗΜΑ 2",
    step2Title: "Αναγωγή Ομοίων Όρων",
    step2Desc: "Εκτελούμε τις πράξεις σε κάθε μέλος ξεχωριστά (προσθέτουμε ή αφαιρούμε τους συντελεστές του x στο 1ο μέλος και τους αριθμούς στο 2ο μέλος), ώστε η εξίσωση να πάρει την απλή μορφή:",
    step2Formula: "Α · x ＝ Β",

    step3Badge: "ΒΗΜΑ 3",
    step3Title: "Διαίρεση σε Μορφή Κλάσματος",
    step3Desc: "Αν ο συντελεστής Α ≠ 0, διαιρούμε και τα δύο μέλη με το Α. Γράφουμε τη λύση πάντα σε κανονική μορφή κλάσματος και απλοποιούμε:",

    fractionsBoxTitle: "Τι κάνουμε αν υπάρχουν Κλάσματα και Παρενθέσεις;",
    fractionsStep1: "Βρίσκουμε το Ε.Κ.Π. όλων των παρονομαστών και πολλαπλασιάζουμε κάθε όρο της εξίσωσης με αυτό.",
    fractionsStep2: "Απλοποιούμε το Ε.Κ.Π. με κάθε παρονομαστή και βάζουμε σε παρένθεση τους σύνθετους αριθμητές.",
    fractionsStep3: "Εκτελούμε τους πολλαπλασιασμούς (επιμεριστική ιδιότητα) για να φύγουν οι παρενθέσεις.",

    specialCasesTitle: "Ειδικές Περιπτώσεις (Όταν ο συντελεστής του x μηδενίζεται)",
    specialCaseIdentityTitle: "0 · x ＝ 0 (Ταυτότητα / Αόριστη):",
    specialCaseIdentityDesc: "Επαληθεύεται για κάθε αριθμό x (έχει άπειρες λύσεις).",
    specialCaseImpossibleTitle: "0 · x ＝ Β (όπου Β ≠ 0, Αδύνατη):",
    specialCaseImpossibleDesc: "Δεν επαληθεύεται για κανέναν αριθμό x (δεν έχει λύση).",

    lab1Title: "🛠️ Εργαστήριο 1: Αναλυτικός Επιλυτής Εξισώσεων Βήμα-Βήμα",
    fullAnalysisBadge: "ΠΛΗΡΗΣ ΑΝΑΛΥΣΗ ΚΑΘΕ ΠΡΑΞΗΣ",
    lab1Desc: "Πληκτρολόγησε οποιαδήποτε εξίσωση 1ου βαθμού στο πλαίσιο (για την εισαγωγή κλασμάτων χρησιμοποίησε το σύμβολο /, π.χ. -2x/3 - (4-5x)/4 + 5/6 = 15). Ο επιλυτής θα σου δείξει αναλυτικά ένα-ένα όλα τα ενδιάμεσα βήματα!",
    presetTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΣ ΔΟΚΙΜΗ:",
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΤΗΝ ΕΞΙΣΩΣΗ ΣΟΥ (ΜΕ ΤΟ ΣΥΜΒΟΛΟ / ΓΙΑ ΤΑ ΚΛΑΣΜΑΤΑ):",
    btnResetSteps: "⏮️ ΑΠΟ ΤΗΝ ΑΡΧΗ (ΒΗΜΑ 1)",
    btnNextStep: "▶️ ΕΠΟΜΕΝΟ ΒΗΜΑ",
    btnAllSteps: "⏭️ ΟΛΑ ΤΑ ΒΗΜΑΤΑ",
    stepsProgress: "ΑΝΑΛΥΤΙΚΗ ΠΟΡΕΙΑ ΕΠΙΛΥΣΗΣ",
    stepLabel: "ΒΗΜΑ",

    sec3Title: "Επίλυση Προβλημάτων με Εξισώσεις",
    problem1Badge: "ΠΑΡΑΔΕΙΓΜΑ 1: ΟΙΚΟΝΟΜΙΚΟ ΠΡΟΒΛΗΜΑ",
    problem1Title: "Συνδρομή & Μαθήματα Κολύμβησης",
    problem1Text: "Ένα κολυμβητήριο χρεώνει 15 € για την ετήσια εγγραφή και 4 € για κάθε προπόνηση. Αν ένας αθλητής πλήρωσε συνολικά 63 €, πόσες προπονήσεις έκανε;",
    stepsSolvingTitle: "Βήματα Επίλυσης:",
    p1Step1: "Έστω x ο αριθμός των προπονήσεων.",
    p1Step2: "Εξίσωση: 4 · x ＋ 15 ＝ 63",
    p1Step3: "Χωρισμός: 4 · x ＝ 63 － 15 ➔ 4 · x ＝ 48",
    p1ResultPrefix: "Λύση: x ＝",
    p1ResultSuffix: "＝ 12 προπονήσεις.",

    problem2Badge: "ΠΑΡΑΔΕΙΓΜΑ 2: ΓΕΩΜΕΤΡΙΚΟ ΠΡΟΒΛΗΜΑ",
    problem2Title: "Περίμετρος Ορθογωνίου Κήπου",
    problem2Text: "Το μήκος ενός ορθογωνίου κήπου είναι κατά 5 μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του κήπου είναι 50 μέτρα, ποιες είναι οι διαστάσεις του;",
    p2Step1: "Έστω x το πλάτος, άρα το μήκος είναι x ＋ 5.",
    p2Step2: "Εξίσωση: 2 · x ＋ 2 · (x ＋ 5) ＝ 50",
    p2Step3: "Απλοποίηση: 2x ＋ 2x ＋ 10 ＝ 50 ➔ 4x ＝ 40",
    p2ResultPrefix: "Λύση: x ＝",
    p2ResultSuffix: "＝ 10 m (πλάτος) και 15 m (μήκος).",

    lab2Title: "🛠️ Εργαστήριο 2: Διαδραστικός Προσομοιωτής α·x ＋ β ＝ γ με Κλασματική Λύση",
    coeffALabel: "ΣΥΝΤΕΛΕΣΤΗΣ (α)",
    constBLabel: "ΣΤΑΘΕΡΟΣ (β)",
    targetCLabel: "2Ο ΜΕΛΟΣ (γ)",
    simEqTitle: "Εξίσωση:",
    simStep1Text: "1. Μεταφορά σταθερού όρου:",
    simStep2Text: "2. Λύση: x ＝",
    simIdentityMsg: "Ταυτότητα (0x ＝ 0): Αληθεύει για κάθε x!",
    simImpossibleMsg: (val) => `Αδύνατη εξίσωση (0x ＝ ${val}): Δεν έχει λύση!`,

    presets: [
      { label: 'ΑΠΛΗ (αx＋β＝γ)', eq: '3x - 4 = 11' },
      { label: 'ΠΟΛΛΑ x', eq: '5x - 3 + 2x = 4x + 9' },
      { label: 'ΜΕ ΠΑΡΕΝΘΕΣΕΙΣ', eq: '2(x + 3) - 4 = 10' },
      { label: 'ΑΠΛΑ ΚΛΑΣΜΑΤΑ', eq: 'x/2 + x/3 = 5' },
      { label: 'ΠΛΗΡΗΣ ΜΕ ΚΛΑΣΜΑΤΑ', eq: '-2x/3 - (4 - 5x)/4 + 5/6 = 15' },
      { label: 'ΑΔΥΝΑΤΗ', eq: '2(x + 1) = 2x + 5' },
    ]
  },
  en: {
    pageTitle: "Solving Equations ax + b = c | Grade 7 Math",
    pageDescription: "Comprehensive theory and step-by-step interactive equation solver (handling fractions, parentheses, and multiple x terms) for Grade 7 Math.",
    backText: "Grade 7 Math",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 29 • THEORY & LAB",
    mainTitle: "Solving Linear Equations of the Form a·x ＋ b ＝ c",
    mainSubtitle: "Learn the general method for solving first-degree equations, eliminating parentheses and fractions systematically, and applying equations to practical problems.",

    sec1Title: "How to Solve the Equation a·x ＋ b ＝ c",
    step1Badge: "STEP 1",
    step1Title: "Separating Variables and Constants",
    step1Desc: "Transpose terms containing the unknown x to the left side and constant numbers to the right side, reversing the sign of every term that changes sides:",
    step1Formula: "a · x ＝ c － b",

    step2Badge: "STEP 2",
    step2Title: "Collecting Like Terms",
    step2Desc: "Perform arithmetic operations on each side separately (add or subtract coefficients of x on the left, constants on the right) so the equation takes the simplified form:",
    step2Formula: "A · x ＝ B",

    step3Badge: "STEP 3",
    step3Title: "Division in Fractional Form",
    step3Desc: "If the coefficient A ≠ 0, divide both sides by A. Always express the solution as a standard vertical fraction and simplify:",

    fractionsBoxTitle: "What if there are Fractions and Parentheses?",
    fractionsStep1: "Find the LCM of all denominators and multiply every single term in the equation by it.",
    fractionsStep2: "Simplify the LCM with each denominator and enclose compound numerators in parentheses.",
    fractionsStep3: "Carry out the multiplications (distributive property) to remove all parentheses.",

    specialCasesTitle: "Special Cases (When the coefficient of x becomes 0)",
    specialCaseIdentityTitle: "0 · x ＝ 0 (Identity / Indeterminate):",
    specialCaseIdentityDesc: "True for any real number x (infinitely many solutions).",
    specialCaseImpossibleTitle: "0 · x ＝ B (where B ≠ 0, Impossible):",
    specialCaseImpossibleDesc: "Not true for any number x (no solutions exist).",

    lab1Title: "🛠️ Lab 1: Step-by-Step Interactive Equation Solver",
    fullAnalysisBadge: "STEP-BY-STEP BREAKDOWN",
    lab1Desc: "Type any linear equation in the box (use / for fractions, e.g. -2x/3 - (4-5x)/4 + 5/6 = 15). The solver will display every single intermediate step in full vertical fraction notation!",
    presetTitle: "SAMPLE EQUATIONS TO TRY:",
    inputLabel: "ENTER YOUR EQUATION (USE / FOR FRACTIONS):",
    btnResetSteps: "⏮️ START OVER (STEP 1)",
    btnNextStep: "▶️ NEXT STEP",
    btnAllSteps: "⏭️ ALL STEPS",
    stepsProgress: "DETAILED SOLUTION PROGRESS",
    stepLabel: "STEP",

    sec3Title: "Solving Real-World Problems with Equations",
    problem1Badge: "EXAMPLE 1: FINANCIAL PROBLEM",
    problem1Title: "Swim Club Membership & Training Sessions",
    problem1Text: "A swimming pool charges a 15 € annual registration fee plus 4 € for each practice session. If an athlete paid 63 € in total, how many practice sessions did they attend?",
    stepsSolvingTitle: "Solution Steps:",
    p1Step1: "Let x be the number of training sessions.",
    p1Step2: "Equation: 4 · x ＋ 15 ＝ 63",
    p1Step3: "Rearrange: 4 · x ＝ 63 － 15 ➔ 4 · x ＝ 48",
    p1ResultPrefix: "Solution: x ＝",
    p1ResultSuffix: "＝ 12 sessions.",

    problem2Badge: "EXAMPLE 2: GEOMETRIC PROBLEM",
    problem2Title: "Perimeter of a Rectangular Garden",
    problem2Text: "The length of a rectangular garden is 5 meters longer than its width. If the perimeter is 50 meters, what are the dimensions of the garden?",
    p2Step1: "Let x be the width, so the length is x ＋ 5.",
    p2Step2: "Equation: 2 · x ＋ 2 · (x ＋ 5) ＝ 50",
    p2Step3: "Simplify: 2x ＋ 2x ＋ 10 ＝ 50 ➔ 4x ＝ 40",
    p2ResultPrefix: "Solution: x ＝",
    p2ResultSuffix: "＝ 10 m (width) and 15 m (length).",

    lab2Title: "🛠️ Lab 2: Interactive Simulator a·x ＋ b ＝ c with Fractional Roots",
    coeffALabel: "COEFFICIENT (a)",
    constBLabel: "CONSTANT (b)",
    targetCLabel: "2ND SIDE (c)",
    simEqTitle: "Equation:",
    simStep1Text: "1. Transpose constant term:",
    simStep2Text: "2. Solution: x ＝",
    simIdentityMsg: "Identity (0x ＝ 0): True for all x!",
    simImpossibleMsg: (val) => `Impossible equation (0x ＝ ${val}): No solution!`,

    presets: [
      { label: 'BASIC (ax＋b＝c)', eq: '3x - 4 = 11' },
      { label: 'MULTIPLE x', eq: '5x - 3 + 2x = 4x + 9' },
      { label: 'PARENTHESES', eq: '2(x + 3) - 4 = 10' },
      { label: 'SIMPLE FRACTIONS', eq: 'x/2 + x/3 = 5' },
      { label: 'COMPOUND FRACTIONS', eq: '-2x/3 - (4 - 5x)/4 + 5/6 = 15' },
      { label: 'IMPOSSIBLE', eq: '2(x + 1) = 2x + 5' },
    ]
  }
};

/**
 * Αναλύει και επιλύει με ΠΛΗΡΗ ΠΑΙΔΑΓΩΓΙΚΑ ΒΗΜΑΤΑ γραμμικές εξισώσεις 1ου βαθμού
 */
function solveLinearEquationStepByStep(rawInput, locale = 'el') {
  const isEn = locale === 'en';
  if (!rawInput || !rawInput.trim()) {
    return { error: isEn ? 'Type an equation to start solving.' : 'Πληκτρολόγησε μια εξίσωση για να ξεκινήσει η επίλυση.' };
  }

  // Κανονικοποίηση εισόδου
  let str = rawInput
    .trim()
    .replace(/\s+/g, '')
    .replace(/χ/gi, 'x')
    .replace(/Χ/g, 'x')
    .replace(/X/g, 'x')
    .replace(/·/g, '*')
    .replace(/−/g, '-')
    .replace(/－/g, '-')
    .replace(/＋/g, '+')
    .replace(/＝/g, '=')
    .replace(/,/g, '.');

  // 1. Έλεγχος χαρακτήρων
  if (/[^0-9x+\-*/().=]/.test(str)) {
    return { error: isEn ? 'The equation contains invalid characters. Use numbers, x, +, -, *, /, ( ) and =.' : 'Η εξίσωση περιέχει μη έγκυρους χαρακτήρες. Χρησιμοποίησε αριθμούς, το x, +, -, *, /, ( ) και =.' };
  }

  // 2. Έλεγχος συμβόλου '='
  const eqParts = str.split('=');
  if (eqParts.length !== 2 || !eqParts[0] || !eqParts[1]) {
    return { error: isEn ? 'The equation must contain exactly one "=" sign with expressions on both sides.' : 'Η εξίσωση πρέπει να περιέχει ακριβώς ένα σύμβολο «=» με παραστάσεις και στα δύο μέλη.' };
  }

  // 3. Έλεγχος ύπαρξης αγνώστου x
  if (!str.includes('x')) {
    return { error: isEn ? 'The equation must contain the unknown "x".' : 'Η εξίσωση πρέπει να περιέχει τον άγνωστο «x».' };
  }

  // 4. Έλεγχος ισορροπίας παρενθέσεων
  let openCount = 0;
  for (const ch of str) {
    if (ch === '(') openCount++;
    if (ch === ')') openCount--;
    if (openCount < 0) return { error: isEn ? 'Parentheses error: closed parenthesis without opening.' : 'Λάθος στις παρενθέσεις: έκλεισε παρένθεση χωρίς να έχει ανοίξει.' };
  }
  if (openCount !== 0) {
    return { error: isEn ? 'Open parenthesis: ensure all parentheses are properly closed.' : 'Ανοιχτή παρένθεση: βεβαιώσου ότι όλες οι παρενθέσεις κλείνουν σωστά.' };
  }

  // 5. Έλεγχος διαίρεσης με το 0
  if (/\/0(?![0-9.])/.test(str)) {
    return { error: isEn ? 'Division by zero is not allowed (denominator 0).' : 'Δεν επιτρέπεται η διαίρεση με το μηδέν (παρονομαστής 0).' };
  }

  const parseSide = (sideStr) => {
    let s = sideStr.replace(/^\+/, '');
    let hasParens = s.includes('(');

    const tokens = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') depth++;
      if (c === ')') depth--;
      if ((c === '+' || c === '-') && depth === 0 && i > 0) {
        tokens.push(current);
        current = c;
      } else {
        current += c;
      }
    }
    if (current) tokens.push(current);

    let denominators = [];
    let rawTopTerms = [];
    let expandedTerms = [];

    for (let tok of tokens) {
      let sign = 1;
      if (tok.startsWith('+')) tok = tok.slice(1);
      else if (tok.startsWith('-')) {
        sign = -1;
        tok = tok.slice(1);
      }
      if (!tok) return { error: isEn ? 'Incomplete term in equation.' : 'Ελλιπής όρος στην εξίσωση.' };

      let slashIdx = -1;
      let d = 0;
      for (let i = 0; i < tok.length; i++) {
        if (tok[i] === '(') d++;
        if (tok[i] === ')') d--;
        if (tok[i] === '/' && d === 0) {
          if (slashIdx !== -1) return { error: isEn ? 'Avoid consecutive "/" symbols in the same term.' : 'Απόφυγε τα διαδοχικά σύμβολα «/» στον ίδιο όρο.' };
          slashIdx = i;
        }
      }

      let numPart = tok;
      let denVal = 1;
      if (slashIdx !== -1) {
        numPart = tok.slice(0, slashIdx);
        const denStr = tok.slice(slashIdx + 1).replace(/^\((.*)\)$/, '$1');
        denVal = Number(denStr);
        if (!Number.isFinite(denVal) || denVal === 0 || denStr.includes('x')) {
          return { error: isEn ? 'Denominator must be a non-zero number (not variable x).' : 'Ο παρονομαστής πρέπει να είναι μη μηδενικός αριθμός (όχι μεταβλητή x).' };
        }
        if (!Number.isInteger(denVal)) {
          return { error: isEn ? 'Use integer denominators in fractions.' : 'Χρησιμοποίησε ακέραιους παρονομαστές στα κλάσματα.' };
        }
        if (denVal < 0) {
          sign = -sign;
          denVal = -denVal;
        }
      }
      denominators.push(denVal);

      let mult = 1;
      let inner = numPart;
      let isCompound = false;

      const parenMatch = numPart.match(/^([0-9.]*)\*?\(([^()]+)\)$/);
      const bareParenMatch = numPart.match(/^\(([^()]+)\)$/);

      if (parenMatch) {
        mult = parenMatch[1] === '' ? 1 : Number(parenMatch[1]);
        inner = parenMatch[2];
        isCompound = true;
      } else if (bareParenMatch) {
        mult = 1;
        inner = bareParenMatch[1];
        isCompound = true;
      }

      if (!Number.isFinite(mult)) return { error: isEn ? 'Invalid coefficient before parenthesis.' : 'Μη έγκυρος συντελεστής μπροστά από παρένθεση.' };

      const displayNumStr =
        mult !== 1
          ? `${mult}·(${formatCleanNum(inner)})`
          : formatCleanNum(inner);

      rawTopTerms.push({
        sign,
        den: denVal,
        mult,
        innerClean: formatCleanNum(inner),
        displayNumStr,
        isCompound: isCompound || inner.includes('+') || inner.slice(1).includes('-'),
      });

      let innerNorm = inner.replace(/^\+/, '');
      const subTokens = [];
      let curSub = '';
      for (let i = 0; i < innerNorm.length; i++) {
        const ch = innerNorm[i];
        if ((ch === '+' || ch === '-') && i > 0) {
          subTokens.push(curSub);
          curSub = ch;
        } else {
          curSub += ch;
        }
      }
      if (curSub) subTokens.push(curSub);

      for (let st of subTokens) {
        let subSign = 1;
        if (st.startsWith('+')) st = st.slice(1);
        else if (st.startsWith('-')) {
          subSign = -1;
          st = st.slice(1);
        }
        st = st.replace(/\*/g, '');
        if (!st) return { error: isEn ? 'Syntax error inside parenthesis.' : 'Συντακτικό λάθος μέσα στην παρένθεση.' };

        if (st.includes('x')) {
          if (st.indexOf('x') !== st.lastIndexOf('x')) {
            return { error: isEn ? 'The equation must be first degree (no x·x or x²).' : 'Η εξίσωση πρέπει να είναι 1ου βαθμού (όχι x·x ή x²).' };
          }
          const cStr = st.replace('x', '');
          const cVal = cStr === '' ? 1 : Number(cStr);
          if (!Number.isFinite(cVal)) return { error: isEn ? `Invalid term "${st}".` : `Μη έγκυρος όρος «${st}».` };
          expandedTerms.push({
            isX: true,
            coeff: sign * subSign * mult * cVal,
            den: denVal,
          });
        } else {
          const val = Number(st);
          if (!Number.isFinite(val)) return { error: isEn ? `Invalid number "${st}".` : `Μη έγκυρος αριθμός «${st}».` };
          expandedTerms.push({
            isX: false,
            coeff: sign * subSign * mult * val,
            den: denVal,
          });
        }
      }
    }

    return { expandedTerms, rawTopTerms, denominators, hasParens };
  };

  const leftParsed = parseSide(eqParts[0]);
  if (leftParsed.error) return { error: leftParsed.error };

  const rightParsed = parseSide(eqParts[1]);
  if (rightParsed.error) return { error: rightParsed.error };

  const allDenominators = [...leftParsed.denominators, ...rightParsed.denominators];
  const hasFractions = allDenominators.some((d) => d > 1);
  const commonLCM = hasFractions ? lcmArray(allDenominators) : 1;
  const hasParensOverall = leftParsed.hasParens || rightParsed.hasParens;

  const scaleTerm = (t) => {
    const factor = commonLCM / t.den;
    return {
      isX: t.isX,
      val: Math.round(t.coeff * factor * 1000) / 1000,
    };
  };

  const leftScaled = leftParsed.expandedTerms.map(scaleTerm);
  const rightScaled = rightParsed.expandedTerms.map(scaleTerm);

  const formatTermsList = (terms) => {
    if (terms.length === 0) return '0';
    return terms
      .map((t, idx) => {
        const v = t.val;
        const absV = Math.abs(v);
        const signStr = v < 0 ? (idx === 0 ? '－' : ' － ') : idx === 0 ? '' : ' ＋ ';
        if (t.isX) {
          const coeffPart = absV === 1 ? 'x' : `${absV}x`;
          return `${signStr}${coeffPart}`;
        } else {
          return `${signStr}${absV}`;
        }
      })
      .join('');
  };

  const formatCancelledSide = (rawTerms, lcmVal) => {
    return rawTerms
      .map((rt, idx) => {
        const q = lcmVal / rt.den;
        const totalMult = Math.round(q * rt.mult * 1000) / 1000;
        const signStr = rt.sign < 0 ? (idx === 0 ? '－' : ' － ') : idx === 0 ? '' : ' ＋ ';

        if (rt.isCompound) {
          return totalMult === 1
            ? `${signStr}(${rt.innerClean})`
            : `${signStr}${totalMult} · (${rt.innerClean})`;
        } else {
          const needsParen = rt.innerClean.includes('x') && rt.innerClean !== 'x';
          const termDisplay = needsParen ? `(${rt.innerClean})` : rt.innerClean;
          if (totalMult === 1) {
            return `${signStr}${rt.innerClean}`;
          }
          return `${signStr}${totalMult} · ${termDisplay}`;
        }
      })
      .join('');
  };

  const steps = [];

  // ΒΗΜΑ 1: Αρχική Εξίσωση
  steps.push({
    title: isEn ? 'INITIAL EQUATION' : 'ΑΡΧΙΚΗ ΕΞΙΣΩΣΗ',
    desc: isEn ? 'Record the initial equation in standard fraction notation:' : 'Καταγράφουμε την αρχική εξίσωση με κανονική κλασματική μορφή:',
    renderType: 'initial',
    leftTerms: leftParsed.rawTopTerms,
    rightTerms: rightParsed.rawTopTerms,
  });

  if (hasFractions) {
    const lcmName = isEn ? 'LCM' : 'Ε.Κ.Π.';
    steps.push({
      title: isEn ? `MULTIPLY EACH TERM BY THE ${lcmName} (${commonLCM})` : `ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΑΘΕ ΟΡΟΥ ΜΕ ΤΟ Ε.Κ.Π. (${commonLCM})`,
      desc: isEn
        ? `Find the LCM of the denominators, which is ${commonLCM}, and multiply EVERY term on both sides by ${commonLCM}:`
        : `Βρίσκουμε το Ε.Κ.Π. των παρονομαστών που είναι το ${commonLCM} και πολλαπλασιάζουμε ΚΑΘΕ όρο και των δύο μελών με το ${commonLCM}:`,
      renderType: 'lcm_multiply',
      lcmVal: commonLCM,
      leftTerms: leftParsed.rawTopTerms,
      rightTerms: rightParsed.rawTopTerms,
    });

    steps.push({
      title: isEn ? 'CANCEL OUT DENOMINATORS' : 'ΑΠΛΟΠΟΙΗΣΗ ΤΩΝ ΠΑΡΟΝΟΜΑΣΤΩΝ',
      desc: isEn
        ? `Divide ${commonLCM} by each fraction denominator and multiply the quotient by the respective numerator (enclosing compound numerators in parentheses):`
        : `Διαιρούμε το ${commonLCM} με τον παρονομαστή κάθε κλάσματος και πολλαπλασιάζουμε το πηλίκο με τον αντίστοιχο αριθμητή (βάζοντας παρένθεση όπου χρειάζεται):`,
      math: `${formatCancelledSide(leftParsed.rawTopTerms, commonLCM)} ＝ ${formatCancelledSide(
        rightParsed.rawTopTerms,
        commonLCM
      )}`,
    });

    steps.push({
      title: isEn ? 'EXPAND MULTIPLICATIONS & REMOVE PARENTHESES' : 'ΕΚΤΕΛΕΣΗ ΠΟΛΛΑΠΛΑΣΙΑΣΜΩΝ & ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ',
      desc: isEn
        ? 'Perform multiplications using the distributive property (watch the signs when a minus precedes parentheses):'
        : 'Εκτελούμε τους πολλαπλασιασμούς και την επιμεριστική ιδιότητα (προσοχή στα πρόσημα όταν υπάρχει μείον μπροστά από παρένθεση):',
      math: `${formatTermsList(leftScaled)} ＝ ${formatTermsList(rightScaled)}`,
    });
  } else if (hasParensOverall) {
    steps.push({
      title: isEn ? 'REMOVE PARENTHESES (DISTRIBUTIVE PROPERTY)' : 'ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ (ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ)',
      desc: isEn
        ? 'Apply the distributive property, multiplying the outer factor by each term inside the parentheses:'
        : 'Εφαρμόζουμε την επιμεριστική ιδιότητα πολλαπλασιάζοντας τον εξωτερικό αριθμό με κάθε όρο μέσα στην παρένθεση:',
      math: `${formatTermsList(leftScaled)} ＝ ${formatTermsList(rightScaled)}`,
    });
  }

  // ΒΗΜΑ: Χωρισμός Γνωστών από Αγνώστους
  const xTermsOnLeft = [
    ...leftScaled.filter((t) => t.isX),
    ...rightScaled.filter((t) => t.isX).map((t) => ({ isX: true, val: -t.val })),
  ];

  const constTermsOnRight = [
    ...rightScaled.filter((t) => !t.isX),
    ...leftScaled.filter((t) => !t.isX).map((t) => ({ isX: false, val: -t.val })),
  ];

  steps.push({
    title: isEn ? 'SEPARATE VARIABLES FROM CONSTANTS' : 'ΧΩΡΙΣΜΟΣ ΓΝΩΣΤΩΝ ΑΠΟ ΑΓΝΩΣΤΟΥΣ',
    desc: isEn
      ? 'Move terms containing variable x to the left side and constant numbers to the right side (reversing signs of transposed terms):'
      : 'Κρατάμε ή μεταφέρουμε τους όρους με τον άγνωστο x στο 1ο μέλος και τους σταθερούς αριθμούς στο 2ο μέλος (αλλάζοντας το πρόσημο όσων όρων αλλάζουν μέλος):',
    math: `${formatTermsList(xTermsOnLeft.length ? xTermsOnLeft : [{ isX: true, val: 0 }])} ＝ ${formatTermsList(
      constTermsOnRight.length ? constTermsOnRight : [{ isX: false, val: 0 }]
    )}`,
  });

  // ΒΗΜΑ: Αναγωγή Ομοίων Όρων
  const totalX = Math.round(xTermsOnLeft.reduce((acc, t) => acc + t.val, 0) * 1000) / 1000;
  const totalConst = Math.round(constTermsOnRight.reduce((acc, t) => acc + t.val, 0) * 1000) / 1000;

  steps.push({
    title: isEn ? 'COLLECT LIKE TERMS' : 'ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ',
    desc: isEn
      ? 'Perform operations between like terms with x on the left and constants on the right:'
      : 'Εκτελούμε τις πράξεις μεταξύ των ομοίων όρων με x στο 1ο μέλος και μεταξύ των αριθμών στο 2ο μέλος:',
    math: `${totalX === 1 ? 'x' : totalX === -1 ? '－x' : `${totalX} · x`} ＝ ${totalConst}`,
  });

  // ΤΕΛΙΚΟ ΒΗΜΑ: Διαίρεση με τον συντελεστή σε ΜΟΡΦΗ ΚΛΑΣΜΑΤΟΣ
  if (totalX === 0) {
    if (totalConst === 0) {
      steps.push({
        title: isEn ? 'IDENTITY (INDETERMINATE EQUATION)' : 'ΤΑΥΤΟΤΗΤΑ (ΑΟΡΙΣΤΗ ΕΞΙΣΩΣΗ)',
        desc: isEn
          ? 'The coefficient of x is 0 and the RHS is 0. The equality 0 · x ＝ 0 is true for every number x!'
          : 'Ο συντελεστής του x είναι 0 και το 2ο μέλος είναι 0. Η ισότητα 0 · x ＝ 0 αληθεύει για κάθε αριθμό x!',
        math: isEn ? 'Infinitely Many Solutions (Identity)' : 'Άπειρες Λύσεις (Ταυτότητα)',
        isSpecial: true,
        status: 'identity',
      });
    } else {
      steps.push({
        title: isEn ? 'IMPOSSIBLE EQUATION' : 'ΑΔΥΝΑΤΗ ΕΞΙΣΩΣΗ',
        desc: isEn
          ? `The coefficient of x is 0, but the RHS is ${totalConst} ≠ 0. No number multiplied by 0 equals ${totalConst}.`
          : `Ο συντελεστής του x είναι 0, αλλά το 2ο μέλος είναι ${totalConst} ≠ 0. Κανένας αριθμός πολλαπλασιαζόμενος με το 0 δεν δίνει ${totalConst}.`,
        math: isEn ? 'No Solution (Impossible)' : 'Καμία Λύση (Αδύνατη)',
        isSpecial: true,
        status: 'impossible',
      });
    }
  } else {
    const isNegativeResult = (totalConst < 0 && totalX > 0) || (totalConst > 0 && totalX < 0);
    const absNum = Math.abs(totalConst);
    const absDen = Math.abs(totalX);

    let simplifiedNum = absNum;
    let simplifiedDen = absDen;
    if (Number.isInteger(absNum) && Number.isInteger(absDen)) {
      const commonDiv = gcd(absNum, absDen);
      simplifiedNum = absNum / commonDiv;
      simplifiedDen = absDen / commonDiv;
    }

    const isExactInteger = simplifiedDen === 1 || totalConst === 0;
    const finalIntValue = totalConst === 0 ? 0 : isNegativeResult ? -simplifiedNum : simplifiedNum;

    steps.push({
      title: isEn ? 'DIVIDE BY COEFFICIENT OF VARIABLE' : 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟΝ ΣΥΝΤΕΛΕΣΤΗ ΤΟΥ ΑΓΝΩΣΤΟΥ',
      desc: isEn
        ? `Divide both sides by the coefficient of the variable (${totalX}), writing the quotient in standard fraction notation:`
        : `Διαιρούμε και τα δύο μέλη με τον συντελεστή του αγνώστου (${totalX}) γράφοντας το πηλίκο σε κανονική μορφή κλάσματος:`,
      fractionData: {
        rawNum: totalConst,
        rawDen: totalX,
        isNeg: totalConst !== 0 && isNegativeResult,
        simplifiedNum,
        simplifiedDen,
        isExactInteger,
        finalIntValue,
      },
      status: 'solved',
    });
  }

  return { steps };
}

// Component που σχεδιάζει ένα μέλος της εξίσωσης είτε στην αρχική του μορφή είτε πολλαπλασιασμένο με το Ε.Κ.Π.
function RenderSideWithFractions({ terms, lcmMultiplier = null }) {
  return (
    <span className="inline-flex items-center flex-wrap gap-1.5">
      {terms.map((t, idx) => {
        const signPrefix = t.sign < 0 ? (idx === 0 ? '－' : '－ ') : idx === 0 ? '' : '＋ ';

        return (
          <span key={idx} className="inline-flex items-center">
            {signPrefix && <span className="mr-1">{signPrefix}</span>}
            {lcmMultiplier !== null && (
              <span className="text-amber-300 font-extrabold mr-0.5">{lcmMultiplier} · </span>
            )}
            {t.den > 1 ? (
              <Frac num={t.displayNumStr} den={t.den} />
            ) : (
              <span>{t.displayNumStr}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function LiseisEksisoseonTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // State για Εργαστήριο 1: Custom Αναλυτής Εξισώσεων
  const [equationInput, setEquationInput] = useState('-2x/3 - (4 - 5x)/4 + 5/6 = 15');
  const [visibleStepsCount, setVisibleStepsCount] = useState(99);

  // State για Εργαστήριο 2: Προσομοιωτής αx + β = γ
  const [simA, setSimA] = useState(4);
  const [simB, setSimB] = useState(-5);
  const [simC, setSimC] = useState(15);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const solverResult = useMemo(
    () => solveLinearEquationStepByStep(equationInput, locale),
    [equationInput, locale]
  );

  const loadPreset = (eqStr) => {
    setEquationInput(eqStr);
    setVisibleStepsCount(1);
  };

  // Υπολογισμοί Εργαστηρίου 2
  const simRightAfterMove = useMemo(() => simC - simB, [simC, simB]);
  const simGcd = useMemo(() => gcd(simRightAfterMove, simA), [simRightAfterMove, simA]);
  const simSimpNum = useMemo(() => Math.abs(simRightAfterMove) / simGcd, [simRightAfterMove, simGcd]);
  const simSimpDen = useMemo(() => Math.abs(simA) / simGcd, [simA, simGcd]);
  const simIsNeg = useMemo(
    () => (simRightAfterMove < 0 && simA > 0) || (simRightAfterMove > 0 && simA < 0),
    [simRightAfterMove, simA]
  );

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/33-liseis-eksisoseon-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΜΕΘΟΔΟΛΟΓΙΑ ΕΠΙΛΥΣΗΣ αx + β = γ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Βήμα 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step1Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step1Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center font-bold text-indigo-950 text-sm break-words [overflow-wrap:anywhere]">
                {t.step1Formula}
              </div>
            </div>

            {/* Βήμα 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step2Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step2Desc}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center font-bold text-sky-950 text-sm break-words [overflow-wrap:anywhere]">
                {t.step2Formula}
              </div>
            </div>

            {/* Βήμα 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                  {toCleanUppercase(t.step3Badge)}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.step3Desc}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-center font-bold text-amber-950 text-sm flex items-center justify-center break-words [overflow-wrap:anywhere]">
                <span>x ＝ </span>
                <Frac num="Β" den="Α" />
              </div>
            </div>
          </div>

          {/* Ειδικές Περιπτώσεις & Σύνθετες Εξισώσεις */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs sm:text-sm">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.fractionsBoxTitle}
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                <li className="break-words [overflow-wrap:anywhere]">{t.fractionsStep1}</li>
                <li className="break-words [overflow-wrap:anywhere]">{t.fractionsStep2}</li>
                <li className="break-words [overflow-wrap:anywhere]">{t.fractionsStep3}</li>
              </ol>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="font-bold text-rose-950 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                {t.specialCasesTitle}
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.specialCaseIdentityTitle}</strong> {t.specialCaseIdentityDesc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.specialCaseImpossibleTitle}</strong> {t.specialCaseImpossibleDesc}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΑΥΤΟΜΑΤΟΣ ΕΠΙΛΥΤΗΣ ΕΞΙΣΩΣΕΩΝ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.lab1Title}</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.fullAnalysisBadge)}
            </span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.lab1Desc}
          </p>

          {/* Έτοιμα Κουμπιά Παραδειγμάτων */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {toCleanUppercase(t.presetTitle)}
            </div>
            <div className="flex flex-wrap gap-2">
              {t.presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(p.eq)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border flex items-center gap-1 break-words [overflow-wrap:anywhere] ${
                    equationInput === p.eq
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{toCleanUppercase(p.label)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Πεδίο Εισαγωγής Εξίσωσης */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="lg:col-span-7 space-y-1">
              <label className="text-[11px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                {toCleanUppercase(t.inputLabel)}
              </label>
              <input
                type="text"
                value={equationInput}
                onChange={(e) => {
                  setEquationInput(e.target.value);
                  setVisibleStepsCount(99);
                }}
                placeholder="π.χ. -2x/3 - (4-5x)/4 + 5/6 = 15"
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-indigo-200 focus:border-indigo-600 outline-none font-mono font-bold text-sm sm:text-base md:text-lg text-slate-900 shadow-sm"
              />
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center gap-2 pt-2 lg:pt-5">
              <button
                type="button"
                onClick={() => setVisibleStepsCount(1)}
                disabled={!!solverResult.error}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 font-bold text-xs transition active:scale-95"
              >
                {toCleanUppercase(t.btnResetSteps)}
              </button>
              <button
                type="button"
                onClick={() =>
                  setVisibleStepsCount((prev) =>
                    solverResult.steps ? Math.min(solverResult.steps.length, prev + 1) : prev
                  )
                }
                disabled={
                  !!solverResult.error ||
                  (solverResult.steps && visibleStepsCount >= solverResult.steps.length)
                }
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition active:scale-95 shadow-sm"
              >
                {toCleanUppercase(t.btnNextStep)}
              </button>
              <button
                type="button"
                onClick={() => setVisibleStepsCount(99)}
                disabled={
                  !!solverResult.error ||
                  (solverResult.steps && visibleStepsCount >= solverResult.steps.length)
                }
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition active:scale-95 shadow-sm"
              >
                {toCleanUppercase(t.btnAllSteps)}
              </button>
            </div>
          </div>

          {/* Προβολή Αναλυτικών Βημάτων */}
          {solverResult.error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="text-lg shrink-0">⚠️</span>
              <span>{solverResult.error}</span>
            </div>
          ) : (
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md overflow-x-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.stepsProgress)} ({Math.min(visibleStepsCount, solverResult.steps.length)} /{' '}
                  {solverResult.steps.length})
                </span>
              </div>

              <div className="space-y-3">
                {solverResult.steps.slice(0, visibleStepsCount).map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all break-words [overflow-wrap:anywhere] ${
                      st.status === 'solved' || st.status === 'identity'
                        ? 'bg-emerald-500/15 border-emerald-400/40'
                        : st.status === 'impossible'
                        ? 'bg-rose-500/15 border-rose-400/40'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-200">
                        {toCleanUppercase(t.stepLabel)} {sIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-amber-300 break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(st.title)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 leading-relaxed break-words [overflow-wrap:anywhere]">{st.desc}</p>

                    {/* Βήμα 1: Αρχική Εξίσωση με Κλάσματα */}
                    {st.renderType === 'initial' ? (
                      <div className="font-mono text-sm sm:text-base md:text-xl font-black text-white inline-flex items-center flex-wrap gap-2">
                        <RenderSideWithFractions terms={st.leftTerms} />
                        <span>＝</span>
                        <RenderSideWithFractions terms={st.rightTerms} />
                      </div>
                    ) : st.renderType === 'lcm_multiply' ? (
                      /* Βήμα 2: Εμφάνιση του Ε.Κ.Π. μπροστά από κάθε όρο */
                      <div className="font-mono text-sm sm:text-base md:text-xl font-black text-white inline-flex items-center flex-wrap gap-2">
                        <RenderSideWithFractions terms={st.leftTerms} lcmMultiplier={st.lcmVal} />
                        <span>＝</span>
                        <RenderSideWithFractions terms={st.rightTerms} lcmMultiplier={st.lcmVal} />
                      </div>
                    ) : st.fractionData ? (
                      /* Τελικό Βήμα: Λύση με το Frac component */
                      <div className="font-mono text-sm sm:text-base md:text-xl font-black text-emerald-400 inline-flex items-center flex-wrap gap-2 pt-1">
                        <span>x ＝</span>
                        <Frac
                          num={Math.abs(st.fractionData.rawNum)}
                          den={Math.abs(st.fractionData.rawDen)}
                          isNeg={st.fractionData.isNeg}
                        />
                        {!st.fractionData.isExactInteger &&
                          (st.fractionData.simplifiedNum !== Math.abs(st.fractionData.rawNum) ||
                            st.fractionData.simplifiedDen !== Math.abs(st.fractionData.rawDen)) && (
                            <>
                              <span>＝</span>
                              <Frac
                                num={st.fractionData.simplifiedNum}
                                den={st.fractionData.simplifiedDen}
                                isNeg={st.fractionData.isNeg}
                              />
                            </>
                          )}
                        {st.fractionData.isExactInteger && (
                          <span>＝ {formatNumber(st.fractionData.finalIntValue)}</span>
                        )}
                      </div>
                    ) : (
                      <div className="font-mono text-sm sm:text-base md:text-xl font-black text-white break-words [overflow-wrap:anywhere]">
                        {st.math}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(t.problem1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                {t.problem1Title}
              </h3>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.problem1Text}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800 break-words [overflow-wrap:anywhere]">
                <div className="font-sans font-bold text-indigo-950">{t.stepsSolvingTitle}</div>
                <div>{t.p1Step1}</div>
                <div>{t.p1Step2}</div>
                <div>{t.p1Step3}</div>
                <div className="inline-flex flex-wrap items-center font-bold text-emerald-700 gap-1">
                  <span>{t.p1ResultPrefix}</span>
                  <Frac num="48" den="4" />
                  <span>{t.p1ResultSuffix}</span>
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(t.problem2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg break-words [overflow-wrap:anywhere]">
                {t.problem2Title}
              </h3>
              <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.problem2Text}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800 break-words [overflow-wrap:anywhere]">
                <div className="font-sans font-bold text-amber-950">{t.stepsSolvingTitle}</div>
                <div>{t.p2Step1}</div>
                <div>{t.p2Step2}</div>
                <div>{t.p2Step3}</div>
                <div className="inline-flex flex-wrap items-center font-bold text-emerald-700 gap-1">
                  <span>{t.p2ResultPrefix}</span>
                  <Frac num="40" den="4" />
                  <span>{t.p2ResultSuffix}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΠΡΟΣΟΜΟΙΩΤΗΣ αx + β = γ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.coeffALabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimA, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {formatNumber(simA)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimA, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.constBLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimB, -1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                      {simB > 0 ? `＋${formatNumber(simB)}` : formatNumber(simB)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimB, 1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.targetCLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimC, -1, -25, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {formatNumber(simC)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimC, 1, -25, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md font-mono">
                <div className="text-sm sm:text-base md:text-xl font-black text-amber-300 inline-flex flex-wrap items-center gap-1">
                  <span>{t.simEqTitle} {simA}x {simB >= 0 ? `＋ ${simB}` : `－ ${Math.abs(simB)}`} ＝ {simC}</span>
                </div>

                <div className="text-xs sm:text-sm text-indigo-200 inline-flex flex-wrap items-center gap-1 leading-relaxed">
                  <span>{t.simStep1Text} {simA}x ＝ {simC} {simB >= 0 ? `－ ${simB}` : `＋ ${Math.abs(simB)}`} ➔</span>
                  <strong>
                    {simA}x ＝ {simRightAfterMove}
                  </strong>
                </div>

                {simA === 0 ? (
                  <div className="text-xs sm:text-sm font-bold text-rose-400 pt-1 break-words [overflow-wrap:anywhere]">
                    {simRightAfterMove === 0
                      ? t.simIdentityMsg
                      : t.simImpossibleMsg(simRightAfterMove)}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 inline-flex flex-wrap items-center gap-2 text-sm sm:text-base md:text-2xl font-black text-emerald-400">
                    <span>{t.simStep2Text}</span>
                    <Frac
                      num={Math.abs(simRightAfterMove)}
                      den={Math.abs(simA)}
                      isNeg={simRightAfterMove !== 0 && simIsNeg}
                    />
                    {simSimpDen === 1 || simRightAfterMove === 0 ? (
                      <span>
                        ＝ {simRightAfterMove === 0 ? 0 : simIsNeg ? `－${simSimpNum}` : simSimpNum}
                      </span>
                    ) : (
                      simGcd > 1 && (
                        <>
                          <span>＝</span>
                          <Frac num={simSimpNum} den={simSimpDen} isNeg={simIsNeg} />
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}