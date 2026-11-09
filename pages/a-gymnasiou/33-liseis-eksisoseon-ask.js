import React, { useState, useEffect } from 'react';
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

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
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

// Βοηθητική συνάρτηση για παραγωγή HTML κανονικού κλάσματος μέσα στα solution strings (safe, no-overflow)
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-1 sm:px-1.5 border-b border-current w-full text-center break-all">${displayNum}</span><span class="pt-0.5 px-1 sm:px-1.5 w-full text-center break-all">${displayDen}</span></span></span>`;
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Επίλυση Εξισώσεων αx + β = γ | Α' Γυμνασίου",
    pageDescription: "12 δυναμικές ασκήσεις και προβλήματα στην επίλυση εξισώσεων 1ου βαθμού με παρενθέσεις, κλάσματα και προβλήματα για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 29 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Επίλυση Εξισώσεων α·x ＋ β ＝ γ",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις επίλυσης εξισώσεων με παρενθέσεις, κλάσματα και διερεύνηση ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 7 ή -3",
    correctBadge: "ΣΩΣΤΟ",
    wrongBadge: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkAnswersBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    newExercisesBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    finalScoreLabel: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progressLabel: "ΠΡΟΟΔΟΣ",
    successRateLabel: "ΕΠΙΤΥΧΙΑ",
    retryBtn: "ΕΠΑΝΑΛΗΨΗ",
    checkBtnShort: "ΕΛΕΓΧΟΣ",
  },
  en: {
    pageTitle: "Exercises: Solving Equations ax + b = c | Grade 7 Math",
    pageDescription: "12 dynamic exercises and word problems on solving first-degree equations with parentheses, fractions, and applications for Grade 7 Math.",
    backText: "Grade 7 Math",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 29 • PRACTICE",
    mainTitle: "Solving Equations a·x ＋ b ＝ c",
    mainSubtitle: "Solve the 12 selected exercises below (10 equation solving tasks with parentheses, fractions, and analysis ＋ 2 real-world problems). Then click 'CHECK ANSWERS' to view your score and detailed step-by-step solutions.",
    problemBadge: "PROBLEM",
    placeholderInput: "e.g. 7 or -3",
    correctBadge: "CORRECT",
    wrongBadge: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkAnswersBtn: "CHECK ANSWERS",
    newExercisesBtn: "NEW EXERCISES",
    finalScoreLabel: "FINAL SCORE",
    progressLabel: "PROGRESS",
    successRateLabel: "SUCCESS RATE",
    retryBtn: "RETRY",
    checkBtnShort: "CHECK",
  }
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΕΠΙΛΥΣΗΣ ΕΞΙΣΩΣΕΩΝ ΜΟΡΦΗΣ αx + β = γ (el / en)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Βασική επίλυση ax + b = c (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ αx ＋ β ＝ γ' : 'SOLVING ax ＋ b ＝ c',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>3 · x ＋ 5 ＝ 26</strong>'
        : 'Solve the equation: <strong>3 · x ＋ 5 ＝ 26</strong>',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 3 · x ＋ 5 ＝ 26
            </div>
            <div>1. Μεταφορά όρου στο 2ο μέλος: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(21, 3)} ＝ 7.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 3 · x ＋ 5 ＝ 26
            </div>
            <div>1. Transpose constant term: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 3 in fractional form: x ＝ ${fracHtml(21, 3)} ＝ 7.
            </div>
          </div>
        `,
    };
  },

  // 2. Εξίσωση με αφαίρεση ax - b = c (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ αx － β ＝ γ' : 'SOLVING ax － b ＝ c',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>4 · x － 7 ＝ 17</strong>'
        : 'Solve the equation: <strong>4 · x － 7 ＝ 17</strong>',
      correctAnswer: '6',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x － 7 ＝ 17
            </div>
            <div>1. Μεταφορά όρου στο 2ο μέλος: 4 · x ＝ 17 ＋ 7 ➔ 4 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 4)} ＝ 6.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x － 7 ＝ 17
            </div>
            <div>1. Transpose constant term: 4 · x ＝ 17 ＋ 7 ➔ 4 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(24, 4)} ＝ 6.
            </div>
          </div>
        `,
    };
  },

  // 3. Εξίσωση με αρνητικό συντελεστή -ax + b = c (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'NEGATIVE COEFFICIENT',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>－2 · x ＋ 9 ＝ 1</strong>'
        : 'Solve the equation: <strong>－2 · x ＋ 9 ＝ 1</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: －2 · x ＋ 9 ＝ 1
            </div>
            <div>1. Μεταφορά όρου στο 2ο μέλος: －2 · x ＝ 1 － 9 ➔ －2 · x ＝ －8.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το －2 σε μορφή κλάσματος: x ＝ ${fracHtml(8, 2)} ＝ 4.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: －2 · x ＋ 9 ＝ 1
            </div>
            <div>1. Transpose constant term: －2 · x ＝ 1 － 9 ➔ －2 · x ＝ －8.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by －2 in fractional form: x ＝ ${fracHtml(8, 2)} ＝ 4.
            </div>
          </div>
        `,
    };
  },

  // 4. Εξίσωση με παρένθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ & ΕΠΙΜΕΡΙΣΤΙΚΗ' : 'PARENTHESES & DISTRIBUTION',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>2 · (x ＋ 4) ＝ 18</strong>'
        : 'Solve the equation: <strong>2 · (x ＋ 4) ＝ 18</strong>',
      correctAnswer: '5',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · (x ＋ 4) ＝ 18
            </div>
            <div>1. Απαλοιφή παρένθεσης με επιμεριστική: 2 · x ＋ 8 ＝ 18.</div>
            <div>2. Μεταφορά όρου: 2 · x ＝ 18 － 8 ➔ 2 · x ＝ 10.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(10, 2)} ＝ 5.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · (x ＋ 4) ＝ 18
            </div>
            <div>1. Eliminate parentheses using distribution: 2 · x ＋ 8 ＝ 18.</div>
            <div>2. Transpose constant: 2 · x ＝ 18 － 8 ➔ 2 · x ＝ 10.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 2 in fractional form: x ＝ ${fracHtml(10, 2)} ＝ 5.
            </div>
          </div>
        `,
    };
  },

  // 5. Εξίσωση με απλό κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΞΙΣΩΣΗ ΜΕ ΚΛΑΣΜΑ' : 'EQUATION WITH FRACTION',
      question: locale === 'el'
        ? `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 3)} <strong>＋ 2 ＝ 6</strong></span>`
        : `Solve the equation: <span class="inline-flex items-center">${fracHtml('x', 3)} <strong>＋ 2 ＝ 6</strong></span>`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2 ＝ 6</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. Μεταφορά σταθερού όρου: ${fracHtml('x', 3)} ＝ 6 － 2 ➔ ${fracHtml('x', 3)} ＝ 4.
            </div>
            <div>2. Πολλαπλασιάζουμε με τον παρονομαστή 3: x ＝ 4 · 3 ＝ 12.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Initial equation:&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2 ＝ 6</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. Transpose constant: ${fracHtml('x', 3)} ＝ 6 － 2 ➔ ${fracHtml('x', 3)} ＝ 4.
            </div>
            <div>2. Multiply by denominator 3: x ＝ 4 · 3 ＝ 12.</div>
          </div>
        `,
    };
  },

  // 6. Εξίσωση με x και στα δύο μέλη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΩΡΙΣΜΟΣ ΟΡΩΝ' : 'SEPARATING TERMS',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>5 · x － 3 ＝ 2 · x ＋ 9</strong>'
        : 'Solve the equation: <strong>5 · x － 3 ＝ 2 · x ＋ 9</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 5 · x － 3 ＝ 2 · x ＋ 9
            </div>
            <div>1. Χωρίζουμε γνωστούς από αγνώστους: 5 · x － 2 · x ＝ 9 ＋ 3.</div>
            <div>2. Αναγωγή ομοίων όρων: 3 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 3)} ＝ 4.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 5 · x － 3 ＝ 2 · x ＋ 9
            </div>
            <div>1. Separate variables and constants: 5 · x － 2 · x ＝ 9 ＋ 3.</div>
            <div>2. Collect like terms: 3 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 3 in fractional form: x ＝ ${fracHtml(12, 3)} ＝ 4.
            </div>
          </div>
        `,
    };
  },

  // 7. Εξίσωση με άθροισμα κλασμάτων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'Ε.Κ.Π. ΠΑΡΟΝΟΜΑΣΤΩΝ' : 'LCM OF DENOMINATORS',
      question: locale === 'el'
        ? `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 2)} ＋ ${fracHtml('x', 4)} ＝ 6</span>`
        : `Solve the equation: <span class="inline-flex items-center">${fracHtml('x', 2)} ＋ ${fracHtml('x', 4)} ＝ 6</span>`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＋&nbsp;</span>${fracHtml('x', 4)}<span>&nbsp;＝ 6</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. Το Ε.Κ.Π.(2, 4) είναι το 4. Πολλαπλασιάζουμε κάθε όρο με το 4: 4 · (${fracHtml('x', 2)}) ＋ 4 · (${fracHtml('x', 4)}) ＝ 4 · 6.
            </div>
            <div>2. Απλοποίηση των παρονομαστών: 2 · x ＋ x ＝ 24 ➔ 3 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 3)} ＝ 8.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Initial equation:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＋&nbsp;</span>${fracHtml('x', 4)}<span>&nbsp;＝ 6</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. LCM(2, 4) is 4. Multiply each term by 4: 4 · (${fracHtml('x', 2)}) ＋ 4 · (${fracHtml('x', 4)}) ＝ 4 · 6.
            </div>
            <div>2. Clear denominators: 2 · x ＋ x ＝ 24 ➔ 3 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 3 in fractional form: x ＝ ${fracHtml(24, 3)} ＝ 8.
            </div>
          </div>
        `,
    };
  },

  // 8. Αδύνατη εξίσωση (MCQ)
  (locale) => {
    const elCorrect = 'Είναι αδύνατη (δεν έχει καμία λύση)';
    const enCorrect = 'It is impossible (has no solution)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ' : 'SPECIAL CASES',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης: <strong>3 · (x ＋ 1) ＝ 3 · x ＋ 7</strong>;'
        : 'What is the solution to the equation: <strong>3 · (x ＋ 1) ＝ 3 · x ＋ 7</strong>?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'x ＝ 0',
            'Είναι ταυτότητα (άπειρες λύσεις)',
            'x ＝ 4'
          ])
        : makeUniqueOptions(enCorrect, [
            'x ＝ 0',
            'It is an identity (infinitely many solutions)',
            'x ＝ 4'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 3 · (x ＋ 1) ＝ 3 · x ＋ 7
            </div>
            <div>1. Ανοίγουμε την παρένθεση: 3 · x ＋ 3 ＝ 3 · x ＋ 7.</div>
            <div>2. Χωρίζουμε γνωστούς από αγνώστους: 3 · x － 3 · x ＝ 7 － 3 ➔ 0 · x ＝ 4.</div>
            <div>3. Συμπέρασμα: Κανένας αριθμός x πολλαπλασιαζόμενος με το 0 δεν δίνει 4. Η εξίσωση είναι <strong>αδύνατη</strong>.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 3 · (x ＋ 1) ＝ 3 · x ＋ 7
            </div>
            <div>1. Expand parentheses: 3 · x ＋ 3 ＝ 3 · x ＋ 7.</div>
            <div>2. Group terms: 3 · x － 3 · x ＝ 7 － 3 ➔ 0 · x ＝ 4.</div>
            <div>3. Conclusion: No number multiplied by 0 yields 4. The equation is <strong>impossible</strong>.</div>
          </div>
        `,
    };
  },

  // 9. Ταυτότητα / Αόριστη εξίσωση (MCQ)
  (locale) => {
    const elCorrect = 'Είναι ταυτότητα (επαληθεύεται για κάθε αριθμό x)';
    const enCorrect = 'It is an identity (satisfied by every number x)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ' : 'SPECIAL CASES',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης: <strong>2 · (x ＋ 3) ＝ 2 · x ＋ 6</strong>;'
        : 'What is the solution to the equation: <strong>2 · (x ＋ 3) ＝ 2 · x ＋ 6</strong>?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Είναι αδύνατη (καμία λύση)',
            'x ＝ 0',
            'x ＝ 6'
          ])
        : makeUniqueOptions(enCorrect, [
            'It is impossible (no solution)',
            'x ＝ 0',
            'x ＝ 6'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · (x ＋ 3) ＝ 2 · x ＋ 6
            </div>
            <div>1. Ανοίγουμε την παρένθεση: 2 · x ＋ 6 ＝ 2 · x ＋ 6.</div>
            <div>2. Χωρίζουμε γνωστούς από αγνώστους: 2 · x － 2 · x ＝ 6 － 6 ➔ 0 · x ＝ 0.</div>
            <div>3. Συμπέρασμα: Η ισότητα 0 · x ＝ 0 ισχύει για οποιονδήποτε αριθμό x. Η εξίσωση είναι <strong>ταυτότητα (αόριστη)</strong>.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · (x ＋ 3) ＝ 2 · x ＋ 6
            </div>
            <div>1. Expand parentheses: 2 · x ＋ 6 ＝ 2 · x ＋ 6.</div>
            <div>2. Group terms: 2 · x － 2 · x ＝ 6 － 6 ➔ 0 · x ＝ 0.</div>
            <div>3. Conclusion: The equality 0 · x ＝ 0 holds for every number x. The equation is an <strong>identity (indeterminate)</strong>.</div>
          </div>
        `,
    };
  },

  // 10. Εξίσωση με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ' : 'NEGATIVE ROOT',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>6 · x ＋ 25 ＝ 7</strong>'
        : 'Solve the equation: <strong>6 · x ＋ 25 ＝ 7</strong>',
      correctAnswer: '-3',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 6 · x ＋ 25 ＝ 7
            </div>
            <div>1. Μεταφορά όρου στο 2ο μέλος: 6 · x ＝ 7 － 25 ➔ 6 · x ＝ －18.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(18, 6, true)} ＝ －3.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 6 · x ＋ 25 ＝ 7
            </div>
            <div>1. Transpose constant: 6 · x ＝ 7 － 25 ➔ 6 · x ＝ －18.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 6 in fractional form: x ＝ ${fracHtml(18, 6, true)} ＝ －3.
            </div>
          </div>
        `,
    };
  },

  // 11. Εξίσωση με μείον μπροστά από παρένθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ' : 'MINUS SIGN BEFORE PARENTHESES',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>5 · x － (2 · x － 3) ＝ 15</strong>'
        : 'Solve the equation: <strong>5 · x － (2 · x － 3) ＝ 15</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 5 · x － (2 · x － 3) ＝ 15
            </div>
            <div>1. Απαλοιφή παρένθεσης αλλάζοντας τα πρόσημα: 5 · x － 2 · x ＋ 3 ＝ 15.</div>
            <div>2. Αναγωγή ομοίων και μεταφορά: 3 · x ＝ 15 － 3 ➔ 3 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 3)} ＝ 4.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 5 · x － (2 · x － 3) ＝ 15
            </div>
            <div>1. Expand parentheses by reversing signs: 5 · x － 2 · x ＋ 3 ＝ 15.</div>
            <div>2. Collect like terms and transpose: 3 · x ＝ 15 － 3 ➔ 3 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 3 in fractional form: x ＝ ${fracHtml(12, 3)} ＝ 4.
            </div>
          </div>
        `,
    };
  },

  // 12. Εξίσωση με μηδενικό δεύτερο μέλος (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΟ 2Ο ΜΕΛΟΣ' : 'ZERO RIGHT-HAND SIDE',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>8 · x － 24 ＝ 0</strong>'
        : 'Solve the equation: <strong>8 · x － 24 ＝ 0</strong>',
      correctAnswer: '3',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 8 · x － 24 ＝ 0
            </div>
            <div>1. Μεταφορά σταθερού όρου στο 2ο μέλος: 8 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 8 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 8)} ＝ 3.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 8 · x － 24 ＝ 0
            </div>
            <div>1. Transpose constant term: 8 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 8 in fractional form: x ＝ ${fracHtml(24, 8)} ＝ 3.
            </div>
          </div>
        `,
    };
  },

  // 13. Εξίσωση με κλάσμα που έχει σύνθετο αριθμητή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑ ΜΕ ΣΥΝΘΕΤΟ ΑΡΙΘΜΗΤΗ' : 'COMPOUND NUMERATOR FRACTION',
      question: locale === 'el'
        ? `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x ＋ 1', 2)} ＝ 4</span>`
        : `Solve the equation: <span class="inline-flex items-center">${fracHtml('x ＋ 1', 2)} ＝ 4</span>`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x ＋ 1', 2)}<span>&nbsp;＝ 4</span>
            </div>
            <div>1. Πολλαπλασιάζουμε με τον παρονομαστή 2: x ＋ 1 ＝ 4 · 2 ➔ x ＋ 1 ＝ 8.</div>
            <div>2. Μεταφορά σταθερού όρου: x ＝ 8 － 1 ＝ 7.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Initial equation:&nbsp;</span>${fracHtml('x ＋ 1', 2)}<span>&nbsp;＝ 4</span>
            </div>
            <div>1. Multiply by denominator 2: x ＋ 1 ＝ 4 · 2 ➔ x ＋ 1 ＝ 8.</div>
            <div>2. Transpose constant: x ＝ 8 － 1 ＝ 7.</div>
          </div>
        `,
    };
  },

  // 14. Εξίσωση 7x = 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ' : 'ZERO ROOT',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης <strong>7 · x ＝ 0</strong>;'
        : 'What is the solution to the equation <strong>7 · x ＝ 0</strong>?',
      correctAnswer: '0',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 7 · x ＝ 0
            </div>
            <div class="flex items-center flex-wrap">
              Διαιρούμε με το 7 σε μορφή κλάσματος: x ＝ ${fracHtml(0, 7)} ＝ 0.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 7 · x ＝ 0
            </div>
            <div class="flex items-center flex-wrap">
              Divide by 7 in fractional form: x ＝ ${fracHtml(0, 7)} ＝ 0.
            </div>
          </div>
        `,
    };
  },

  // 15. Δύο παρενθέσεις (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΕΣ ΠΑΡΕΝΘΕΣΕΙΣ' : 'MULTIPLE PARENTHESES',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16</strong>'
        : 'Solve the equation: <strong>3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16</strong>',
      correctAnswer: '3',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16
            </div>
            <div>1. Επιμεριστικές ιδιότητες: 3 · x － 3 ＋ 2 · x ＋ 4 ＝ 16.</div>
            <div>2. Αναγωγή ομοίων και μεταφορά: 5 · x ＋ 1 ＝ 16 ➔ 5 · x ＝ 15.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(15, 5)} ＝ 3.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16
            </div>
            <div>1. Distribute factors: 3 · x － 3 ＋ 2 · x ＋ 4 ＝ 16.</div>
            <div>2. Collect terms and transpose: 5 · x ＋ 1 ＝ 16 ➔ 5 · x ＝ 15.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 5 in fractional form: x ＝ ${fracHtml(15, 5)} ＝ 3.
            </div>
          </div>
        `,
    };
  },

  // 16. Εξίσωση με δεκαδικό συντελεστή (Input)
  (locale) => {
    const coeff = locale === 'el' ? '0,5' : '0.5';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'DECIMAL COEFFICIENT',
      question: locale === 'el'
        ? `Λύσε την εξίσωση: <strong>${coeff} · x ＋ 3 ＝ 7</strong>`
        : `Solve the equation: <strong>${coeff} · x ＋ 3 ＝ 7</strong>`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 0,5 · x ＋ 3 ＝ 7
            </div>
            <div>1. Μεταφορά όρου στο 2ο μέλος: 0,5 · x ＝ 7 － 3 ➔ 0,5 · x ＝ 4.</div>
            <div>2. Διαίρεση: x ＝ 4 ： 0,5 ＝ 8 (αφού 0,5 ＝ ${fracHtml(1, 2)}).</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 0.5 · x ＋ 3 ＝ 7
            </div>
            <div>1. Transpose constant: 0.5 · x ＝ 7 － 3 ➔ 0.5 · x ＝ 4.</div>
            <div>2. Divide: x ＝ 4 ： 0.5 ＝ 8 (since 0.5 ＝ ${fracHtml(1, 2)}).</div>
          </div>
        `,
    };
  },

  // 17. Εξίσωση με αρνητικό x μόνο του (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟ ΑΡΝΗΤΙΚΟ x' : 'NEGATIVE VARIABLE ALONE',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>－x ＋ 6 ＝ 1</strong>'
        : 'Solve the equation: <strong>－x ＋ 6 ＝ 1</strong>',
      correctAnswer: '5',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: －x ＋ 6 ＝ 1
            </div>
            <div>1. Μεταφορά όρου: －x ＝ 1 － 6 ➔ －x ＝ －5.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαιρούμε με το －1: x ＝ ${fracHtml(5, 1)} ＝ 5.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: －x ＋ 6 ＝ 1
            </div>
            <div>1. Transpose constant: －x ＝ 1 － 6 ➔ －x ＝ －5.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by －1: x ＝ ${fracHtml(5, 1)} ＝ 5.
            </div>
          </div>
        `,
    };
  },

  // 18. Εξίσωση: 2x - 5 = x + 3 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΩΡΙΣΜΟΣ ΟΡΩΝ' : 'SEPARATING TERMS',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>2 · x － 5 ＝ x ＋ 3</strong>'
        : 'Solve the equation: <strong>2 · x － 5 ＝ x ＋ 3</strong>',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · x － 5 ＝ x ＋ 3
            </div>
            <div>1. Χωρίζουμε γνωστούς από αγνώστους: 2 · x － x ＝ 3 ＋ 5.</div>
            <div>2. Αναγωγή ομοίων όρων: x ＝ 8.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · x － 5 ＝ x ＋ 3
            </div>
            <div>1. Separate variables and constants: 2 · x － x ＝ 3 ＋ 5.</div>
            <div>2. Collect like terms: x ＝ 8.</div>
          </div>
        `,
    };
  },

  // 19. Εξίσωση με κλάσματα και στα δύο μέλη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'Ε.Κ.Π. ΣΤΑ ΔΥΟ ΜΕΛΗ' : 'LCM ACROSS BOTH SIDES',
      question: locale === 'el'
        ? `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 2)} ＝ ${fracHtml('x', 3)} ＋ 2</span>`
        : `Solve the equation: <span class="inline-flex items-center">${fracHtml('x', 2)} ＝ ${fracHtml('x', 3)} ＋ 2</span>`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＝&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. Το Ε.Κ.Π.(2, 3) ＝ 6. Πολλαπλασιάζουμε κάθε όρο με το 6: 6 · (${fracHtml('x', 2)}) ＝ 6 · (${fracHtml('x', 3)}) ＋ 6 · 2.
            </div>
            <div>2. Απλοποίηση: 3 · x ＝ 2 · x ＋ 12 ➔ 3 · x － 2 · x ＝ 12 ➔ x ＝ 12.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
              <span>Initial equation:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＝&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2</span>
            </div>
            <div class="flex items-center flex-wrap">
              1. LCM(2, 3) ＝ 6. Multiply each term by 6: 6 · (${fracHtml('x', 2)}) ＝ 6 · (${fracHtml('x', 3)}) ＋ 6 · 2.
            </div>
            <div>2. Simplify: 3 · x ＝ 2 · x ＋ 12 ➔ 3 · x － 2 · x ＝ 12 ➔ x ＝ 12.</div>
          </div>
        `,
    };
  },

  // 20. Εξίσωση: 9x - 12 = 3x + 24 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΛΗΡΗΣ ΕΠΙΛΥΣΗ' : 'FULL EQUATION SOLVING',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>9 · x － 12 ＝ 3 · x ＋ 24</strong>'
        : 'Solve the equation: <strong>9 · x － 12 ＝ 3 · x ＋ 24</strong>',
      correctAnswer: '6',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 9 · x － 12 ＝ 3 · x ＋ 24
            </div>
            <div>1. Χωρίζουμε γνωστούς από αγνώστους: 9 · x － 3 · x ＝ 24 ＋ 12.</div>
            <div>2. Αναγωγή ομοίων όρων: 6 · x ＝ 36.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(36, 6)} ＝ 6.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 9 · x － 12 ＝ 3 · x ＋ 24
            </div>
            <div>1. Separate variables and constants: 9 · x － 3 · x ＝ 24 ＋ 12.</div>
            <div>2. Collect like terms: 6 · x ＝ 36.</div>
            <div class="flex items-center flex-wrap pt-1">
              3. Divide by 6 in fractional form: x ＝ ${fracHtml(36, 6)} ＝ 6.
            </div>
          </div>
        `,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (el / en)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Προπόνηση τένις
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? 'Η ενοικίαση γηπέδου τένις κοστίζει 12 € πάγια χρέωση συντήρησης και 8 € για κάθε ώρα παιχνιδιού. Ένας αθλητής πλήρωσε συνολικά 36 €. Πόσες ώρες έπαιξε;'
        : 'Tennis court rental costs a 12 € maintenance fee plus 8 € per hour of play. An athlete paid a total of 36 €. How many hours did they play?',
      correctAnswer: '3',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 8 · x ＋ 12 ＝ 36 (όπου x οι ώρες)
            </div>
            <div>1. Μεταφορά όρου: 8 · x ＝ 36 － 12 ➔ 8 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 8 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 8)} ＝ 3 ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 8 · x ＋ 12 ＝ 36 (where x is hours)
            </div>
            <div>1. Transpose constant: 8 · x ＝ 36 － 12 ➔ 8 · x ＝ 24.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 8 in fractional form: x ＝ ${fracHtml(24, 8)} ＝ 3 hours.
            </div>
          </div>
        `,
    };
  },

  // 2. Ηλικία μητέρας και κόρης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ' : 'PROBLEMS: AGES',
      question: locale === 'el'
        ? 'Μια μητέρα είναι 24 χρόνια μεγαλύτερη από την κόρη της. Αν το άθροισμα των ηλικιών τους είναι 38 χρόνια, πόσων ετών είναι η κόρη;'
        : 'A mother is 24 years older than her daughter. If the sum of their ages is 38 years, how old is the daughter?',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: x ＋ (x ＋ 24) ＝ 38 (όπου x η ηλικία της κόρης)
            </div>
            <div>1. Αναγωγή και μεταφορά: 2 · x ＋ 24 ＝ 38 ➔ 2 · x ＝ 14.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(14, 2)} ＝ 7 ετών.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: x ＋ (x ＋ 24) ＝ 38 (where x is daughter's age)
            </div>
            <div>1. Collect terms and transpose: 2 · x ＋ 24 ＝ 38 ➔ 2 · x ＝ 14.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 2 in fractional form: x ＝ ${fracHtml(14, 2)} ＝ 7 years old.
            </div>
          </div>
        `,
    };
  },

  // 3. Περίμετρος ορθογωνίου κήπου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένας ορθογώνιος κήπος έχει μήκος κατά 6 μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του κήπου είναι 44 μέτρα, ποιο είναι το πλάτος του σε μέτρα;'
        : 'A rectangular garden has a length 6 meters greater than its width. If the perimeter is 44 meters, what is its width in meters?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · x ＋ 2 · (x ＋ 6) ＝ 44 (όπου x το πλάτος)
            </div>
            <div>1. Επιμεριστική και αναγωγή: 2 · x ＋ 2 · x ＋ 12 ＝ 44 ➔ 4 · x ＝ 32.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(32, 4)} ＝ 8 μέτρα.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · x ＋ 2 · (x ＋ 6) ＝ 44 (where x is width)
            </div>
            <div>1. Distribute and simplify: 2 · x ＋ 2 · x ＋ 12 ＝ 44 ➔ 4 · x ＝ 32.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(32, 4)} ＝ 8 meters.
            </div>
          </div>
        `,
    };
  },

  // 4. Αγορά ηλεκτρονικών ειδών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Ο Αλέξης αγόρασε 3 ίδια flash drives και μια θήκη που κόστιζε 5 €. Πλήρωσε συνολικά 32 €. Πόσα ευρώ κόστισε το κάθε flash drive;'
        : 'Alexis bought 3 identical flash drives and a case costing 5 €. He paid 32 € in total. How much did each flash drive cost in euros?',
      correctAnswer: '9',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 3 · x ＋ 5 ＝ 32 (όπου x η τιμή του flash drive)
            </div>
            <div>1. Μεταφορά όρου: 3 · x ＝ 32 － 5 ➔ 3 · x ＝ 27.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(27, 3)} ＝ 9 €.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 3 · x ＋ 5 ＝ 32 (where x is flash drive price)
            </div>
            <div>1. Transpose constant: 3 · x ＝ 32 － 5 ➔ 3 · x ＝ 27.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 3 in fractional form: x ＝ ${fracHtml(27, 3)} ＝ 9 €.
            </div>
          </div>
        `,
    };
  },

  // 5. Αποταμίευση για εκδρομή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? 'Η Σοφία έχει 45 € και αποταμιεύει 15 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συγκεντρώσει 120 €;'
        : 'Sofia has 45 € and saves 15 € each week. In how many weeks will she have accumulated 120 €?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 15 · x ＋ 45 ＝ 120 (όπου x οι εβδομάδες)
            </div>
            <div>1. Μεταφορά όρου: 15 · x ＝ 120 － 45 ➔ 15 · x ＝ 75.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 15 σε μορφή κλάσματος: x ＝ ${fracHtml(75, 15)} ＝ 5 εβδομάδες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 15 · x ＋ 45 ＝ 120 (where x is weeks)
            </div>
            <div>1. Transpose constant: 15 · x ＝ 120 － 45 ➔ 15 · x ＝ 75.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 15 in fractional form: x ＝ ${fracHtml(75, 15)} ＝ 5 weeks.
            </div>
          </div>
        `,
    };
  },

  // 6. Διανομή βιβλίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: DISTRIBUTION',
      question: locale === 'el'
        ? 'Ένας βιβλιοπώλης παρέλαβε 65 βιβλία. Κράτησε 5 στη βιτρίνα και τα υπόλοιπα τα μοίρασε ισόποσα σε 4 ράφια. Πόσα βιβλία έβαλε σε κάθε ράφι;'
        : 'A bookseller received 65 books. He kept 5 in the display window and distributed the remainder equally across 4 shelves. How many books did he place on each shelf?',
      correctAnswer: '15',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x ＋ 5 ＝ 65 (όπου x τα βιβλία ανά ράφι)
            </div>
            <div>1. Μεταφορά όρου: 4 · x ＝ 65 － 5 ➔ 4 · x ＝ 60.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(60, 4)} ＝ 15 βιβλία.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x ＋ 5 ＝ 65 (where x is books per shelf)
            </div>
            <div>1. Transpose constant: 4 · x ＝ 65 － 5 ➔ 4 · x ＝ 60.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(60, 4)} ＝ 15 books.
            </div>
          </div>
        `,
    };
  },

  // 7. Πρόβλημα τριών διαδοχικών αριθμών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? 'Το άθροισμα τριών διαδοχικών ακεραίων αριθμών είναι 42. Ποιος είναι ο μικρότερος από τους τρεις αριθμούς;'
        : 'The sum of three consecutive integers is 42. What is the smallest of the three integers?',
      correctAnswer: '13',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ 42 (όπου x ο μικρότερος)
            </div>
            <div>1. Αναγωγή ομοίων όρων: 3 · x ＋ 3 ＝ 42 ➔ 3 · x ＝ 39.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(39, 3)} ＝ 13.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ 42 (where x is smallest)
            </div>
            <div>1. Collect terms: 3 · x ＋ 3 ＝ 42 ➔ 3 · x ＝ 39.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 3 in fractional form: x ＝ ${fracHtml(39, 3)} ＝ 13.
            </div>
          </div>
        `,
    };
  },

  // 8. Ταξί με νυχτερινή ταρίφα
  (locale) => {
    const rate = locale === 'el' ? '2,50' : '2.50';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Ένα ταξί χρεώνει 4 € πάγια εκκίνηση και ${rate} € για κάθε χιλιόμετρο. Ένας επιβάτης πλήρωσε 29 €. Πόσα χιλιόμετρα ήταν η διαδρομή;`
        : `A taxi charges a 4 € starting fee and ${rate} € per kilometer. A passenger paid 29 €. How many kilometers was the trip?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2,5 · x ＋ 4 ＝ 29 (όπου x τα χιλιόμετρα)
            </div>
            <div>1. Μεταφορά όρου: 2,5 · x ＝ 29 － 4 ➔ 2,5 · x ＝ 25.</div>
            <div>2. Διαίρεση: x ＝ 25 ： 2,5 ＝ 10 km.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2.5 · x ＋ 4 ＝ 29 (where x is distance)
            </div>
            <div>1. Transpose constant: 2.5 · x ＝ 29 － 4 ➔ 2.5 · x ＝ 25.</div>
            <div>2. Divide: x ＝ 25 ： 2.5 ＝ 10 km.</div>
          </div>
        `,
    };
  },

  // 9. Ισοσκελές τρίγωνο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ισοσκελές τρίγωνο έχει βάση 14 cm και περίμετρο 40 cm. Πόσα εκατοστά είναι καθεμία από τις δύο ίσες πλευρές του;'
        : 'An isosceles triangle has a base of 14 cm and a perimeter of 40 cm. What is the length of each of its two equal sides in cm?',
      correctAnswer: '13',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 2 · x ＋ 14 ＝ 40 (όπου x η κάθε ίση πλευρά)
            </div>
            <div>1. Μεταφορά όρου: 2 · x ＝ 40 － 14 ➔ 2 · x ＝ 26.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(26, 2)} ＝ 13 cm.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 2 · x ＋ 14 ＝ 40 (where x is each equal side)
            </div>
            <div>1. Transpose constant: 2 · x ＝ 40 － 14 ➔ 2 · x ＝ 26.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 2 in fractional form: x ＝ ${fracHtml(26, 2)} ＝ 13 cm.
            </div>
          </div>
        `,
    };
  },

  // 10. Μηνιαίος λογαριασμός τηλεφώνου
  (locale) => {
    const cost = locale === 'el' ? '0,20' : '0.20';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΗΛΕΦΩΝΙΑ' : 'PROBLEMS: TELEPHONY',
      question: locale === 'el'
        ? `Ένα συμβόλαιο κινητού έχει πάγιο 15 € το μήνα και χρεώνει ${cost} € για κάθε επιπλέον μήνυμα SMS. Αν ο λογαριασμός ήταν 25 €, πόσα επιπλέον μηνύματα στάλθηκαν;`
        : `A phone contract has a 15 € monthly fixed fee and charges ${cost} € for each extra SMS message. If the bill was 25 €, how many extra messages were sent?`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 0,20 · x ＋ 15 ＝ 25 (όπου x τα επιπλέον μηνύματα)
            </div>
            <div>1. Μεταφορά όρου: 0,20 · x ＝ 25 － 15 ➔ 0,20 · x ＝ 10.</div>
            <div>2. Διαίρεση: x ＝ 10 ： 0,20 ＝ 50 μηνύματα.</div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 0.20 · x ＋ 15 ＝ 25 (where x is extra messages)
            </div>
            <div>1. Transpose constant: 0.20 · x ＝ 25 － 15 ➔ 0.20 · x ＝ 10.</div>
            <div>2. Divide: x ＝ 10 ： 0.20 ＝ 50 messages.</div>
          </div>
        `,
    };
  },

  // 11. Κατανάλωση καυσίμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? 'Μια δεξαμενή πετρελαίου περιέχει 150 λίτρα και ο καυστήρας καταναλώνει 6 λίτρα για κάθε ώρα λειτουργίας. Μετά από πόσες ώρες θα απομένουν 42 λίτρα;'
        : 'A fuel tank holds 150 liters and a burner consumes 6 liters per hour of operation. After how many hours will 42 liters remain?',
      correctAnswer: '18',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 150 － 6 · x ＝ 42 (όπου x οι ώρες λειτουργίας)
            </div>
            <div>1. Μεταφορά όρων: －6 · x ＝ 42 － 150 ➔ －6 · x ＝ －108.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το －6 σε μορφή κλάσματος: x ＝ ${fracHtml(108, 6)} ＝ 18 ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 150 － 6 · x ＝ 42 (where x is operating hours)
            </div>
            <div>1. Transpose terms: －6 · x ＝ 42 － 150 ➔ －6 · x ＝ －108.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by －6 in fractional form: x ＝ ${fracHtml(108, 6)} ＝ 18 hours.
            </div>
          </div>
        `,
    };
  },

  // 12. Αμοιβή babysitting
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: LABOR',
      question: locale === 'el'
        ? 'Μια παιδαγωγός λαμβάνει 10 € πάγια έξοδα μετακίνησης συν 7 € για κάθε ώρα απασχόλησης. Αν πληρώθηκε συνολικά 45 €, πόσες ώρες εργάστηκε;'
        : 'A babysitter receives 10 € travel allowance plus 7 € per hour worked. If she was paid 45 € in total, how many hours did she work?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 7 · x ＋ 10 ＝ 45 (όπου x οι ώρες απασχόλησης)
            </div>
            <div>1. Μεταφορά όρου: 7 · x ＝ 45 － 10 ➔ 7 · x ＝ 35.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 7 σε μορφή κλάσματος: x ＝ ${fracHtml(35, 7)} ＝ 5 ώρες.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 7 · x ＋ 10 ＝ 45 (where x is hours worked)
            </div>
            <div>1. Transpose constant: 7 · x ＝ 45 － 10 ➔ 7 · x ＝ 35.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 7 in fractional form: x ＝ ${fracHtml(35, 7)} ＝ 5 hours.
            </div>
          </div>
        `,
    };
  },

  // 13. Εισιτήρια λούνα παρκ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΨΥΧΑΓΩΓΙΑ' : 'PROBLEMS: ENTERTAINMENT',
      question: locale === 'el'
        ? 'Σε ένα λούνα παρκ η είσοδος κοστίζει 5 € και κάθε παιχνίδι κοστίζει 3 €. Ο Κωστής ξόδεψε συνολικά 26 €. Σε πόσα παιχνίδια έπαιξε;'
        : 'At an amusement park, admission costs 5 € and each ride costs 3 €. Kostas spent 26 € in total. How many rides did he take?',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 3 · x ＋ 5 ＝ 26 (όπου x τα παιχνίδια)
            </div>
            <div>1. Μεταφορά όρου: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(21, 3)} ＝ 7 παιχνίδια.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 3 · x ＋ 5 ＝ 26 (where x is rides)
            </div>
            <div>1. Transpose constant: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 3 in fractional form: x ＝ ${fracHtml(21, 3)} ＝ 7 rides.
            </div>
          </div>
        `,
    };
  },

  // 14. Συσκευασία πορτοκαλιών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ' : 'PROBLEMS: AGRICULTURE',
      question: locale === 'el'
        ? 'Μαζεύτηκαν 92 κιλά πορτοκάλια. Κρατήθηκαν 8 κιλά και τα υπόλοιπα συσκευάστηκαν σε διχτάκια των 4 κιλών. Πόσα διχτάκια πορτοκάλια φτιάχτηκαν;'
        : 'A harvest produced 92 kg of oranges. 8 kg were kept aside and the rest were packed into 4 kg net bags. How many net bags were packed?',
      correctAnswer: '21',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x ＋ 8 ＝ 92 (όπου x τα διχτάκια)
            </div>
            <div>1. Μεταφορά όρου: 4 · x ＝ 92 － 8 ➔ 4 · x ＝ 84.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(84, 4)} ＝ 21 διχτάκια.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x ＋ 8 ＝ 92 (where x is net bags)
            </div>
            <div>1. Transpose constant: 4 · x ＝ 92 － 8 ➔ 4 · x ＝ 84.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(84, 4)} ＝ 21 net bags.
            </div>
          </div>
        `,
    };
  },

  // 15. Φόρτιση μπαταρίας drone
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? 'Η μπαταρία ενός drone βρίσκεται στο 20% και φορτίζει με ρυθμό 5% ανά λεπτό. Σε πόσα λεπτά θα φορτιστεί πλήρως (100%);'
        : 'A drone battery is at 20% and charges at a rate of 5% per minute. In how many minutes will it reach full capacity (100%)?',
      correctAnswer: '16',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 5 · x ＋ 20 ＝ 100 (όπου x τα λεπτά)
            </div>
            <div>1. Μεταφορά όρου: 5 · x ＝ 100 － 20 ➔ 5 · x ＝ 80.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(80, 5)} ＝ 16 λεπτά.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 5 · x ＋ 20 ＝ 100 (where x is minutes)
            </div>
            <div>1. Transpose constant: 5 · x ＝ 100 － 20 ➔ 5 · x ＝ 80.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 5 in fractional form: x ＝ ${fracHtml(80, 5)} ＝ 16 minutes.
            </div>
          </div>
        `,
    };
  },

  // 16. Τετράδια και στυλό
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΙΚΑ' : 'PROBLEMS: SCHOOL SUPPLIES',
      question: locale === 'el'
        ? 'Ο Δημήτρης αγόρασε 4 ίδια τετράδια και ένα μαρκαδόρο των 2 €. Έδωσε χαρτονόμισμα των 20 € και πήρε ρέστα 6 €. Πόσο κόστιζε το κάθε τετράδιο;'
        : 'Dimitris bought 4 identical notebooks and a 2 € marker. He gave a 20 € bill and got 6 € in change. How much did each notebook cost in euros?',
      correctAnswer: '3',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x ＋ 2 ＝ 14 (όπου x η τιμή του τετραδίου)
            </div>
            <div>1. Μεταφορά όρου: 4 · x ＝ 14 － 2 ➔ 4 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 4)} ＝ 3 €.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x ＋ 2 ＝ 14 (where x is notebook price)
            </div>
            <div>1. Transpose constant: 4 · x ＝ 14 － 2 ➔ 4 · x ＝ 12.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(12, 4)} ＝ 3 €.
            </div>
          </div>
        `,
    };
  },

  // 17. Εμβαδόν ορθογωνίου με σταθερή διάσταση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ορθογώνιο έχει πλάτος 6 μέτρα και εμβαδόν 48 τ.μ. Πόσα μέτρα είναι το μήκος του;'
        : 'A rectangle has a width of 6 meters and an area of 48 sq. meters. What is its length in meters?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 6 · x ＝ 48 (όπου x το μήκος σε μέτρα)
            </div>
            <div class="flex items-center flex-wrap">
              Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(48, 6)} ＝ 8 μέτρα.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 6 · x ＝ 48 (where x is length in meters)
            </div>
            <div class="flex items-center flex-wrap">
              Divide by 6 in fractional form: x ＝ ${fracHtml(48, 6)} ＝ 8 meters.
            </div>
          </div>
        `,
    };
  },

  // 18. Σχολική εκδρομή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ' : 'PROBLEMS: SCHOOL',
      question: locale === 'el'
        ? 'Για μια εκδρομή το λεωφορείο κοστίζει πάγια 120 € και το εισιτήριο εισόδου 5 € ανά μαθητή. Αν το συνολικό κόστος ήταν 245 €, πόσοι μαθητές πήγαν;'
        : 'For a school trip, the bus costs a flat 120 € fee and entrance tickets are 5 € per student. If the total cost was 245 €, how many students attended?',
      correctAnswer: '25',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 5 · x ＋ 120 ＝ 245 (όπου x οι μαθητές)
            </div>
            <div>1. Μεταφορά όρου: 5 · x ＝ 245 － 120 ➔ 5 · x ＝ 125.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(125, 5)} ＝ 25 μαθητές.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 5 · x ＋ 120 ＝ 245 (where x is students)
            </div>
            <div>1. Transpose constant: 5 · x ＝ 245 － 120 ➔ 5 · x ＝ 125.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 5 in fractional form: x ＝ ${fracHtml(125, 5)} ＝ 25 students.
            </div>
          </div>
        `,
    };
  },

  // 19. Διπλάσιο και τριπλάσιο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? 'Αν από το τετραπλάσιο ενός αριθμού αφαιρέσουμε 15, βρίσκουμε 25. Ποιος είναι αυτός ο αριθμός;'
        : 'If 15 is subtracted from 4 times a number, the result is 25. What is the number?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x － 15 ＝ 25 (όπου x ο αριθμός)
            </div>
            <div>1. Μεταφορά όρου: 4 · x ＝ 25 ＋ 15 ➔ 4 · x ＝ 40.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(40, 4)} ＝ 10.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x － 15 ＝ 25 (where x is the number)
            </div>
            <div>1. Transpose constant: 4 · x ＝ 25 ＋ 15 ➔ 4 · x ＝ 40.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(40, 4)} ＝ 10.
            </div>
          </div>
        `,
    };
  },

  // 20. Αγορά πίτσας με delivery
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ' : 'PROBLEMS: FOOD & DINING',
      question: locale === 'el'
        ? 'Μια παρέα παρήγγειλε 4 ίδιες πίτσες και πλήρωσε επιπλέον 3 € για τη διανομή. Αν ο συνολικός λογαριασμός ήταν 39 €, πόσα ευρώ κόστισε η κάθε πίτσα;'
        : 'A group of friends ordered 4 identical pizzas and paid an extra 3 € delivery fee. If the total bill was 39 €, how much did each pizza cost?',
      correctAnswer: '9',
      solution: locale === 'el'
        ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Αρχική εξίσωση: 4 · x ＋ 3 ＝ 39 (όπου x η τιμή της πίτσας)
            </div>
            <div>1. Μεταφορά όρου: 4 · x ＝ 39 － 3 ➔ 4 · x ＝ 36.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(36, 4)} ＝ 9 €.
            </div>
          </div>
        `
        : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Initial equation: 4 · x ＋ 3 ＝ 39 (where x is pizza price)
            </div>
            <div>1. Transpose constant: 4 · x ＝ 39 － 3 ➔ 4 · x ＝ 36.</div>
            <div class="flex items-center flex-wrap pt-1">
              2. Divide by 4 in fractional form: x ＝ ${fracHtml(36, 4)} ＝ 9 €.
            </div>
          </div>
        `,
    };
  },
];

export default function LiseisEksisoseonAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(locale),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [locale]);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      const parsedUser = parseFloat(userAns);
      const parsedCorrect = parseFloat(correctAns);

      if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && userAns === String(parsedUser) && correctAns === String(parsedCorrect)) {
        if (Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          totalCorrect += 1;
        }
      } else if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && String(userAnswers[k]).trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/33-liseis-eksisoseon"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-6 sm:space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const parsedUser = parseFloat(cleanUser);
              const parsedCorrect = parseFloat(cleanCorrect);
              let isCorrect = false;

              if (isSubmitted) {
                if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && cleanUser === String(parsedUser) && cleanCorrect === String(parsedCorrect)) {
                  isCorrect = Math.abs(parsedUser - parsedCorrect) <= 0.05;
                } else {
                  isCorrect = cleanUser === cleanCorrect;
                }
              }

              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm shrink-0 ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-sm sm:text-base md:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-sm sm:text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="shrink-0 font-bold ml-1">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border break-words [overflow-wrap:anywhere] ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-xs sm:text-sm">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-xs sm:text-sm">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 font-mono break-words [overflow-wrap:anywhere]">
                              <span>{t.correctAnswerLabel}&nbsp;&nbsp;</span>
                              <span
                                className="text-emerald-700 font-black break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-loose font-normal pt-2 border-t border-slate-200/60 break-words [overflow-wrap:anywhere]"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswersBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercisesBtn)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6">
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRateLabel)}
                </div>
                <div
                  className={`text-sm sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-2.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-3 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtnShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-3 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.retryBtn)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}