import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// HELPER ΓΙΑ ΚΑΤΑΚΟΡΥΦΗ ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ ΣΕ HTML STRINGS
// ============================================================================
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-0.5 sm:px-1 border-b-2 border-current w-full text-center break-all">${displayNum}</span><span class="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">${displayDen}</span></span></span>`;
};

// ============================================================================
// ΚΑΘΑΡΙΣΜΟΣ ΤΟΝΩΝ ΓΙΑ ΚΕΦΑΛΑΙΑ (Διατηρείται μόνο το Α')
// ============================================================================
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
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let count = 1;
  while (unique.size < 4) {
    unique.add(String(Number(correct) + count));
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// ============================================================================
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ UI (i18n)
// ============================================================================
const DICTIONARY = {
  el: {
    pageTitle: "Ασκήσεις: Βασικές Γεωμετρικές Έννοιες | Α' Γυμνασίου",
    pageDesc:
      "12 επιλεγμένες ασκήσεις και προβλήματα σε σημείο, ευθεία, ημιευθεία, ευθύγραμμο τμήμα, μέσο τμήματος και τεθλασμένες γραμμές για την Α' Γυμνασίου.",
    navGrade: "Α' Γυμνασίου",
    theoryBtn: 'ΘΕΩΡΙΑ',
    bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 01 • ΕΞΑΣΚΗΣΗ",
    bannerTitle: 'Βασικές Γεωμετρικές Έννοιες & Σχήματα',
    bannerSubtitle:
      'Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις σε ευθείες, τμήματα, μέσα και τεθλασμένες γραμμές. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις με βήματα.',
    problemBadge: 'ΠΡΟΒΛΗΜΑ',
    inputPlaceholder: 'Γράψε την απάντηση...',
    btnSubmit: 'ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ',
    btnNewExercises: 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ',
    btnRetry: 'ΕΠΑΝΑΛΗΨΗ',
    btnCheck: 'ΕΛΕΓΧΟΣ',
    finalScore: 'ΤΕΛΙΚΟ ΣΚΟΡ',
    progress: 'ΠΡΟΟΔΟΣ',
    successRate: 'ΕΠΙΤΥΧΙΑ',
    correctBadge: 'ΣΩΣΤΟ',
    wrongBadge: 'ΛΑΘΟΣ',
    correctAnswerLabel: 'ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:',
  },
  en: {
    pageTitle: 'Exercises: Basic Geometric Concepts | Grade 7',
    pageDesc:
      '12 dynamic exercises and problems on points, lines, rays, segments, midpoints, and polygonal paths for Grade 7.',
    navGrade: 'Grade 7',
    theoryBtn: 'THEORY',
    bannerBadge: 'GRADE 7 • GEOMETRY CHAPTER 01 • PRACTICE',
    bannerTitle: 'Basic Geometric Concepts & Figures',
    bannerSubtitle:
      'Solve the 12 selected exercises on lines, segments, midpoints, and polygonal chains. Click "CHECK ANSWERS" to view your score and complete step-by-step solutions.',
    problemBadge: 'PROBLEM',
    inputPlaceholder: 'Enter your answer...',
    btnSubmit: 'CHECK ANSWERS',
    btnNewExercises: 'NEW EXERCISES',
    btnRetry: 'RETRY',
    btnCheck: 'CHECK',
    finalScore: 'FINAL SCORE',
    progress: 'PROGRESS',
    successRate: 'SUCCESS',
    correctBadge: 'CORRECT',
    wrongBadge: 'WRONG',
    correctAnswerLabel: 'CORRECT ANSWER:',
  },
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (ΜΕ ΠΛΗΡΕΣ el / en)
// ============================================================================

// Θέση 1: Έννοιες Ευθείας, Ημιευθείας & Σημείου (MCQ)
const POOL_1_BASIC_LINES = [
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΕΙΑ' : 'BASIC CONCEPTS: LINE',
    question:
      locale === 'el'
        ? 'Πόσες ευθείες μπορούν να περάσουν από <strong>δύο διαφορετικά σημεία Α και Β</strong> του επιπέδου;'
        : 'How many distinct straight lines can pass through <strong>two distinct points A and B</strong> on a plane?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Μία και μοναδική ευθεία' : 'Exactly one unique line',
      locale === 'el'
        ? ['Άπειρες ευθείες', 'Καμία ευθεία', 'Ακριβώς δύο ευθείες']
        : ['Infinitely many lines', 'No line', 'Exactly two lines']
    ),
    correctAnswer:
      locale === 'el' ? 'Μία και μοναδική ευθεία' : 'Exactly one unique line',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Βασικό Αξίωμα της Γεωμετρίας:
          </div>
          <div>Από δύο διακεκριμένα σημεία Α και Β διέρχεται <strong>μία και μοναδική</strong> ευθεία (συμβολίζεται ως ευθεία ΑΒ ή ε).</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Fundamental Geometric Postulate:
          </div>
          <div>Through any two distinct points A and B passes <strong>exactly one unique</strong> straight line (denoted as line AB or l).</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΣΗΜΕΙΟ & ΕΥΘΕΙΕΣ' : 'BASIC CONCEPTS: POINT & LINES',
    question:
      locale === 'el'
        ? 'Πόσες ευθείες μπορούν να περάσουν από <strong>ένα μόνο σημείο Α</strong> του επιπέδου;'
        : 'How many distinct straight lines can pass through <strong>a single point A</strong> on a plane?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Άπειρες ευθείες' : 'Infinitely many lines',
      locale === 'el'
        ? ['Μία και μοναδική ευθεία', 'Δύο ευθείες', 'Καμία ευθεία']
        : ['Exactly one line', 'Two lines', 'No line']
    ),
    correctAnswer:
      locale === 'el' ? 'Άπειρες ευθείες' : 'Infinitely many lines',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ιδιότητα του Σημείου:
          </div>
          <div>Από ένα μόνο σημείο Α μπορούν να διέλθουν <strong>άπειρες ευθείες</strong>, οι οποίες σχηματίζουν μια «δέσμη ευθειών».</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Property of a Point:
          </div>
          <div>Through a single point A pass <strong>infinitely many lines</strong>, forming a pencil of lines.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΗΜΙΕΥΘΕΙΑ' : 'BASIC CONCEPTS: RAY',
    question:
      locale === 'el'
        ? 'Ποιο από τα παρακάτω γεωμετρικά σχήματα έχει <strong>αρχή αλλά δεν έχει τέλος</strong>;'
        : 'Which of the following geometric figures has <strong>a starting endpoint but no ending point</strong>?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Η ημιευθεία' : 'A ray',
      locale === 'el'
        ? ['Το ευθύγραμμο τμήμα', 'Η ευθεία', 'Το επίπεδο']
        : ['A line segment', 'A straight line', 'A plane']
    ),
    correctAnswer: locale === 'el' ? 'Η ημιευθεία' : 'A ray',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός Ημιευθείας:
          </div>
          <div>Η <strong>ημιευθεία</strong> ξεκινά από ένα συγκεκριμένο σημείο (την αρχή της) και εκτείνεται απεριόριστα προς μία κατεύθυνση, άρα δεν έχει τέλος.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition of a Ray:
          </div>
          <div>A <strong>ray</strong> starts at a fixed point (origin endpoint) and extends indefinitely in one direction, thus having no ending point.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΑΝΤΙΚΕΙΜΕΝΕΣ ΗΜΙΕΥΘΕΙΕΣ' : 'BASIC CONCEPTS: OPPOSITE RAYS',
    question:
      locale === 'el'
        ? 'Δύο ημιευθείες Οx και Οy που βρίσκονται στην ίδια ευθεία, έχουν κοινή αρχή το Ο και προεκτείνονται προς αντίθετες κατευθύνσεις ονομάζονται:'
        : 'Two rays Ox and Oy lying along the same line, sharing common origin O, and pointing in opposite directions are called:',
    options: makeUniqueOptions(
      locale === 'el' ? 'Αντικείμενες ημιευθείες' : 'Opposite rays',
      locale === 'el'
        ? ['Συμπληρωματικές ημιευθείες', 'Παράλληλες ημιευθείες', 'Διαδοχικές ημιευθείες']
        : ['Complementary rays', 'Parallel rays', 'Consecutive rays']
    ),
    correctAnswer: locale === 'el' ? 'Αντικείμενες ημιευθείες' : 'Opposite rays',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός Αντικείμενων Ημιευθειών:
          </div>
          <div>Ένα σημείο Ο πάνω σε μια ευθεία τη χωρίζει σε δύο <strong>αντικείμενες ημιευθείες</strong> που μαζί συνθέτουν ολόκληρη την ευθεία.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition of Opposite Rays:
          </div>
          <div>A point O on a line separates it into two <strong>opposite rays</strong> that together form the entire line.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΣΥΝΕΥΘΕΙΑΚΑ ΣΗΜΕΙΑ' : 'BASIC CONCEPTS: COLLINEAR POINTS',
    question:
      locale === 'el'
        ? 'Πώς ονομάζονται τρία ή περισσότερα σημεία που βρίσκονται <strong>πάνω στην ίδια ευθεία</strong>;'
        : 'What are three or more points called when they lie <strong>on the exact same straight line</strong>?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Συνευθειακά σημεία' : 'Collinear points',
      locale === 'el'
        ? ['Διαδοχικά σημεία', 'Συμμετρικά σημεία', 'Ισαπέχοντα σημεία']
        : ['Consecutive points', 'Symmetric points', 'Equidistant points']
    ),
    correctAnswer:
      locale === 'el' ? 'Συνευθειακά σημεία' : 'Collinear points',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός:
          </div>
          <div>Σημεία που ανήκουν στην ίδια ευθεία γραμμή ονομάζονται <strong>συνευθειακά σημεία</strong>.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition:
          </div>
          <div>Points belonging to the very same straight line are called <strong>collinear points</strong>.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ' : 'BASIC CONCEPTS: LINE SEGMENT',
    question:
      locale === 'el'
        ? 'Ποιο γεωμετρικό σχήμα περιορίζεται ανάμεσα σε δύο συγκεκριμένα σημεία Α και Β (τα άκρα του);'
        : 'Which geometric figure is bounded between two specific endpoints A and B?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Το ευθύγραμμο τμήμα ΑΒ' : 'Line segment AB',
      locale === 'el'
        ? ['Η ημιευθεία ΑΒ', 'Η ευθεία ΑΒ', 'Η τεθλασμένη γραμμή']
        : ['Ray AB', 'Straight line AB', 'Polygonal chain']
    ),
    correctAnswer:
      locale === 'el' ? 'Το ευθύγραμμο τμήμα ΑΒ' : 'Line segment AB',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός Ευθύγραμμου Τμήματος:
          </div>
          <div>Το <strong>ευθύγραμμο τμήμα ΑΒ</strong> έχει αρχή και τέλος (τα άκρα του Α και Β) και έχει συγκεκριμένο μήκος.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition of a Line Segment:
          </div>
          <div>A <strong>line segment AB</strong> is bounded by its endpoints A and B and has a measurable finite length.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΠΙΠΕΔΟ' : 'BASIC CONCEPTS: PLANE',
    question:
      locale === 'el'
        ? 'Από <strong>τρία σημεία που δεν βρίσκονται στην ίδια ευθεία</strong> (μη συνευθειακά) διέρχεται:'
        : 'Through <strong>three non-collinear points</strong> in space passes:',
    options: makeUniqueOptions(
      locale === 'el' ? 'Ένα και μοναδικό επίπεδο' : 'Exactly one unique plane',
      locale === 'el'
        ? ['Άπειρα επίπεδα', 'Καμία ευθεία και κανένα επίπεδο', 'Ακριβώς τρία επίπεδα']
        : ['Infinitely many planes', 'No plane', 'Exactly three planes']
    ),
    correctAnswer:
      locale === 'el' ? 'Ένα και μοναδικό επίπεδο' : 'Exactly one unique plane',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός Επιπέδου:
          </div>
          <div>Τρία μη συνευθειακά σημεία ορίζουν <strong>ένα και μοναδικό επίπεδο</strong>.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition of a Plane:
          </div>
          <div>Three non-collinear points determine <strong>exactly one unique plane</strong>.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΕΙΑ' : 'BASIC CONCEPTS: LINE',
    question:
      locale === 'el'
        ? 'Ποια από τις παρακάτω προτάσεις για την <strong>ευθεία</strong> είναι σωστή;'
        : 'Which of the following statements about a <strong>straight line</strong> is correct?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Δεν έχει ούτε αρχή ούτε τέλος' : 'It has neither start nor end',
      locale === 'el'
        ? ['Έχει αρχή αλλά δεν έχει τέλος', 'Έχει αρχή και τέλος', 'Έχει μετρήσιμο πεπερασμένο μήκος']
        : ['It has a start but no end', 'It has both start and end', 'It has finite measurable length']
    ),
    correctAnswer:
      locale === 'el' ? 'Δεν έχει ούτε αρχή ούτε τέλος' : 'It has neither start nor end',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Χαρακτηριστικό Ευθείας:
          </div>
          <div>Η ευθεία εκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις, συνεπώς δεν έχει ούτε αρχή ούτε τέλος.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Line Property:
          </div>
          <div>A straight line extends indefinitely in both opposite directions, so it possesses neither a start nor an end.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΗΜΙΕΥΘΕΙΑ' : 'BASIC CONCEPTS: RAY',
    question:
      locale === 'el'
        ? 'Πώς συμβολίζουμε μια ημιευθεία με αρχή το σημείο Ο που διέρχεται από το σημείο Α;'
        : 'How do we denote a ray starting at point O and passing through point A?',
    options: makeUniqueOptions(
      locale === 'el' ? 'Ημιευθεία ΟΑ (ή Οx)' : 'Ray OA (or Ox)',
      locale === 'el'
        ? ['Ευθύγραμμο τμήμα [ΟΑ]', 'Ευθεία (ΟΑ)', 'Επίπεδο ΟΑ']
        : ['Segment [OA]', 'Line (OA)', 'Plane OA']
    ),
    correctAnswer:
      locale === 'el' ? 'Ημιευθεία ΟΑ (ή Οx)' : 'Ray OA (or Ox)',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Συμβολισμός:
          </div>
          <div>Γράφουμε πρώτα την αρχή της (Ο) και έπειτα ένα σημείο της (Α) ή ένα μικρό γράμμα κατεύθυνσης (x): ημιευθεία ΟΑ ή Οx.</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Notation:
          </div>
          <div>We write the initial vertex first (O), followed by a direction point (A) or axis letter (x): ray OA or Ox.</div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΤΟΜΗ ΕΥΘΕΙΩΝ' : 'BASIC CONCEPTS: LINE INTERSECTION',
    question:
      locale === 'el'
        ? 'Δύο διαφορετικές ευθείες στο ίδιο επίπεδο που τέμνονται, έχουν κοινά:'
        : 'Two distinct intersecting lines in the same plane share:',
    options: makeUniqueOptions(
      locale === 'el' ? 'Ακριβώς ένα σημείο' : 'Exactly one point',
      locale === 'el'
        ? ['Δύο διαφορετικά σημεία', 'Άπειρα σημεία', 'Κανένα σημείο']
        : ['Two distinct points', 'Infinitely many points', 'No point']
    ),
    correctAnswer:
      locale === 'el' ? 'Ακριβώς ένα σημείο' : 'Exactly one point',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Τομή Ευθειών:
          </div>
          <div>Αν δύο ευθείες τέμνονται, το κοινό τους σημείο είναι <strong>ακριβώς ένα</strong> (το σημείο τομής).</div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Intersection of Lines:
          </div>
          <div>When two distinct lines intersect, they have <strong>exactly one point</strong> in common.</div>
        </div>
      `,
  }),
];

// Θέση 2: Υπολογισμός Μέσου Ευθύγραμμου Τμήματος (Input)
const POOL_2_MIDPOINT_CALC = Array.from({ length: 10 }, (_, i) => (locale) => {
  const ab = 8 + i * 2; // 8, 10, ..., 26
  const am = ab / 2;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΜΕΣΟ ΤΜΗΜΑΤΟΣ' : 'SEGMENT MIDPOINT',
    question:
      locale === 'el'
        ? `Ένα ευθύγραμμο τμήμα ΑΒ έχει μήκος <strong>${numFmt(ab)} cm</strong>. Αν <strong>Μ</strong> είναι το μέσο του ΑΒ, ποιο είναι το μήκος του τμήματος <strong>ΑΜ</strong> σε cm;`
        : `A line segment AB has length <strong>${numFmt(ab)} cm</strong>. If <strong>M</strong> is the midpoint of AB, what is the length of segment <strong>AM</strong> in cm?`,
    correctAnswer: String(am),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Δεδομένα: ΑΒ ＝ ${numFmt(ab)} cm, Μ μέσο του ΑΒ.
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>Επειδή το Μ είναι το μέσο, χωρίζει το ΑΒ σε δύο ίσα τμήματα: ΑΜ ＝ ΜΒ ＝ </span>
            ${fracHtml('ΑΒ', 2)}
            <span> ＝ </span>
            ${fracHtml(ab, 2)}
            <span> ＝ <strong>${numFmt(am)} cm</strong>.</span>
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Given: AB ＝ ${numFmt(ab)} cm, M is the midpoint of AB.
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>Since M is the midpoint: AM ＝ MB ＝ </span>
            ${fracHtml('AB', 2)}
            <span> ＝ </span>
            ${fracHtml(ab, 2)}
            <span> ＝ <strong>${numFmt(am)} cm</strong>.</span>
          </div>
        </div>
      `,
  };
});

// Θέση 3: Εύρεση Όλου του Τμήματος από το Μισό (Input)
const POOL_3_FULL_FROM_MID = Array.from({ length: 10 }, (_, i) => (locale) => {
  const am = 5 + i; // 5, 6, ..., 14
  const ab = 2 * am;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΜΕΣΟ ΤΜΗΜΑΤΟΣ' : 'SEGMENT MIDPOINT',
    question:
      locale === 'el'
        ? `Το σημείο <strong>Μ</strong> είναι το μέσο του ευθύγραμμου τμήματος ΑΒ. Αν <strong>ΜΒ ＝ ${numFmt(am)} cm</strong>, ποιο είναι το συνολικό μήκος του <strong>ΑΒ</strong> σε cm;`
        : `Point <strong>M</strong> is the midpoint of segment AB. If <strong>MB ＝ ${numFmt(am)} cm</strong>, what is the total length of <strong>AB</strong> in cm?`,
    correctAnswer: String(ab),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Δεδομένα: ΜΒ ＝ ${numFmt(am)} cm, Μ μέσο του ΑΒ.
          </div>
          <div>
            Ισχύει ΑΒ ＝ 2 · ΜΒ ➔ ΑΒ ＝ 2 · ${numFmt(am)} ＝ <strong>${numFmt(ab)} cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Given: MB ＝ ${numFmt(am)} cm, M is the midpoint of AB.
          </div>
          <div>
            Hence AB ＝ 2 · MB ➔ AB ＝ 2 · ${numFmt(am)} ＝ <strong>${numFmt(ab)} cm</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 4: Απόσταση Σημείων σε Βαθμολογημένη Ευθεία (Input)
const POOL_4_COORDINATE_DIST = Array.from({ length: 10 }, (_, i) => (locale) => {
  const a = 2 + (i % 4);
  const dist = 5 + ((i * 3) % 10);
  const b = a + dist;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ' : 'DISTANCE BETWEEN POINTS',
    question:
      locale === 'el'
        ? `Σε έναν βαθμολογημένο άξονα το σημείο Α βρίσκεται στη θέση <strong>${numFmt(a)} cm</strong> και το σημείο Β στη θέση <strong>${numFmt(b)} cm</strong>. Ποια είναι η απόσταση <strong>ΑΒ</strong> σε cm;`
        : `On a graduated axis, point A is at position <strong>${numFmt(a)} cm</strong> and point B is at position <strong>${numFmt(b)} cm</strong>. What is the distance <strong>AB</strong> in cm?`,
    correctAnswer: String(dist),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Θέσεις: Α(${numFmt(a)}), Β(${numFmt(b)}).
          </div>
          <div>
            Η απόσταση των δύο σημείων ισούται με τη διαφορά: ΑΒ ＝ ${numFmt(b)} － ${numFmt(a)} ＝ <strong>${numFmt(dist)} cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Positions: A(${numFmt(a)}), B(${numFmt(b)}).
          </div>
          <div>
            The distance between the two points is given by the difference: AB ＝ ${numFmt(b)} － ${numFmt(a)} ＝ <strong>${numFmt(dist)} cm</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 5: Διαδοχικά Συνευθειακά Τμήματα (Input)
const POOL_5_COLLINEAR_SUM = Array.from({ length: 10 }, (_, i) => (locale) => {
  const ab = 4 + (i % 6);
  const bc = 3 + ((i * 2) % 6);
  const cd = 5 + ((i * 3) % 7);
  const total = ab + bc + cd;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΔΙΑΔΟΧΙΚΑ ΤΜΗΜΑΤΑ' : 'CONSECUTIVE SEGMENTS',
    question:
      locale === 'el'
        ? `Πάνω σε μια ευθεία παίρνουμε με τη σειρά τα διαδοχικά σημεία Α, Β, Γ, Δ. Αν <strong>ΑΒ ＝ ${numFmt(ab)} cm</strong>, <strong>ΒΓ ＝ ${numFmt(bc)} cm</strong> και <strong>ΓΔ ＝ ${numFmt(cd)} cm</strong>, ποιο είναι το μήκος του <strong>ΑΔ</strong> σε cm;`
        : `Along a straight line, points A, B, C, D are placed consecutively in order. If <strong>AB ＝ ${numFmt(ab)} cm</strong>, <strong>BC ＝ ${numFmt(bc)} cm</strong>, and <strong>CD ＝ ${numFmt(cd)} cm</strong>, what is the length of <strong>AD</strong> in cm?`,
    correctAnswer: String(total),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Συνευθειακά σημεία: Α, Β, Γ, Δ.
          </div>
          <div>
            Το συνολικό μήκος ισούται με το άθροισμα: ΑΔ ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ ${numFmt(ab)} ＋ ${numFmt(bc)} ＋ ${numFmt(cd)} ＝ <strong>${numFmt(total)} cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Collinear points: A, B, C, D.
          </div>
          <div>
            The total length is the sum of consecutive segments: AD ＝ AB ＋ BC ＋ CD ＝ ${numFmt(ab)} ＋ ${numFmt(bc)} ＋ ${numFmt(cd)} ＝ <strong>${numFmt(total)} cm</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 6: Μήκος Ανοιχτής Τεθλασμένης Γραμμής (Input)
const POOL_6_POLYLINE_LEN = Array.from({ length: 10 }, (_, i) => (locale) => {
  const s1 = 3 + (i % 5);
  const s2 = 4 + ((i * 2) % 5);
  const s3 = 5 + ((i * 3) % 6);
  const sum = s1 + s2 + s3;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΤΕΘΛΑΣΜΕΝΗ ΓΡΑΜΜΗ' : 'POLYGONAL PATH',
    question:
      locale === 'el'
        ? `Μια ανοιχτή τεθλασμένη γραμμή ΑΒΓΔ αποτελείται από τα τμήματα <strong>ΑΒ ＝ ${numFmt(s1)} m</strong>, <strong>ΒΓ ＝ ${numFmt(s2)} m</strong> και <strong>ΓΔ ＝ ${numFmt(s3)} m</strong>. Ποιο είναι το συνολικό μήκος της τεθλασμένης γραμμής σε μέτρα;`
        : `An open polygonal chain ABCD consists of segments <strong>AB ＝ ${numFmt(s1)} m</strong>, <strong>BC ＝ ${numFmt(s2)} m</strong>, and <strong>CD ＝ ${numFmt(s3)} m</strong>. What is the total length of the polygonal chain in meters?`,
    correctAnswer: String(sum),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Τεθλασμένη γραμμή ΑΒΓΔ:
          </div>
          <div>
            Μήκος τεθλασμένης L ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ ${numFmt(s1)} ＋ ${numFmt(s2)} ＋ ${numFmt(s3)} ＝ <strong>${numFmt(sum)} m</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Polygonal chain ABCD:
          </div>
          <div>
            Total path length L ＝ AB ＋ BC ＋ CD ＝ ${numFmt(s1)} ＋ ${numFmt(s2)} ＋ ${numFmt(s3)} ＝ <strong>${numFmt(sum)} m</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 7: Σύγκριση Τεθλασμένης με Ευθύγραμμο Τμήμα (MCQ)
const POOL_7_SHORTEST_PATH_MCQ = [
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ' : 'SHORTEST PATH',
    question:
      locale === 'el'
        ? 'Αν Α, Β, Γ είναι τρία σημεία που <strong>δεν βρίσκονται στην ίδια ευθεία</strong>, ποια σχέση ισχύει μεταξύ του ευθύγραμμου τμήματος ΑΓ και των τμημάτων ΑΒ και ΒΓ;'
        : 'If A, B, C are three non-collinear points, which relationship holds between straight segment AC and the path AB ＋ BC?',
    options: makeUniqueOptions(
      locale === 'el' ? 'ΑΓ ＜ ΑΒ ＋ ΒΓ' : 'AC ＜ AB ＋ BC',
      locale === 'el'
        ? ['ΑΓ ＝ ΑΒ ＋ ΒΓ', 'ΑΓ ＞ ΑΒ ＋ ΒΓ', 'ΑΓ ＝ 2 · (ΑΒ ＋ ΒΓ)']
        : ['AC ＝ AB ＋ BC', 'AC ＞ AB ＋ BC', 'AC ＝ 2 · (AB ＋ BC)']
    ),
    correctAnswer: locale === 'el' ? 'ΑΓ ＜ ΑΒ ＋ ΒΓ' : 'AC ＜ AB ＋ BC',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Θεμελιώδης Ιδιότητα (Τριγωνική Ανισότητα):
          </div>
          <div>
            Το ευθύγραμμο τμήμα ΑΓ είναι η <strong>συντομότερη οδός</strong> που ενώνει το Α με το Γ, άρα είναι πάντοτε αυστηρά μικρότερο από την τεθλασμένη διαδρομή ΑΒ ＋ ΒΓ.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Fundamental Property (Triangle Inequality):
          </div>
          <div>
            The straight segment AC is the <strong>shortest path</strong> connecting A and C, and is therefore strictly smaller than the indirect path AB ＋ BC.
          </div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ' : 'SHORTEST PATH',
    question:
      locale === 'el'
        ? 'Μια τεθλασμένη γραμμή ΑΒΓΔ έχει συνολικό μήκος 18 cm. Ποιο από τα παρακάτω <strong>μπορεί</strong> να είναι το μήκος του ευθύγραμμου τμήματος ΑΔ;'
        : 'A polygonal chain ABCD has a total length of 18 cm. Which of the following <strong>could</strong> be the length of the straight line segment AD?',
    options: makeUniqueOptions(
      locale === 'el' ? '15 cm' : '15 cm',
      locale === 'el'
        ? ['18 cm', '21 cm', '24 cm']
        : ['18 cm', '21 cm', '24 cm']
    ),
    correctAnswer: '15 cm',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Έλεγχος Μήκους:
          </div>
          <div>
            Το ευθύγραμμο τμήμα ΑΔ πρέπει υποχρεωτικά να είναι <strong>μικρότερο</strong> από το μήκος της τεθλασμένης (ΑΔ ＜ 18 cm). Η μόνη επιλογή που είναι μικρότερη από το 18 είναι το <strong>15 cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Length Verification:
          </div>
          <div>
            The straight segment AD must strictly be <strong>shorter</strong> than the polygonal path (AD ＜ 18 cm). The only choice strictly less than 18 is <strong>15 cm</strong>.
          </div>
        </div>
      `,
  }),
  (locale) => ({
    type: 'mcq',
    topic: locale === 'el' ? 'ΚΛΕΙΣΤΗ ΤΕΘΛΑΣΜΕΝΗ' : 'CLOSED POLYGONAL PATH',
    question:
      locale === 'el'
        ? 'Μια τεθλασμένη γραμμή στην οποία το τέλος του τελευταίου τμήματος συμπίπτει με την αρχή του πρώτου λέγεται:'
        : 'A polygonal path whose last endpoint coincides with the origin of the first segment is called a:',
    options: makeUniqueOptions(
      locale === 'el' ? 'Κλειστή τεθλασμένη (πολύγωνο)' : 'Closed polygonal path (polygon)',
      locale === 'el'
        ? ['Ανοιχτή τεθλασμένη', 'Ευθύγραμμο τμήμα', 'Ημιευθεία']
        : ['Open polygonal path', 'Line segment', 'Ray']
    ),
    correctAnswer:
      locale === 'el' ? 'Κλειστή τεθλασμένη (πολύγωνο)' : 'Closed polygonal path (polygon)',
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Ορισμός:
          </div>
          <div>
            Όταν η τεθλασμένη γραμμή επιστρέφει στο σημείο εκκίνησης, ονομάζεται <strong>κλειστή τεθλασμένη γραμμή ή πολύγωνο</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
            Definition:
          </div>
          <div>
            When a polygonal chain returns to its starting point, it forms a <strong>closed polygon</strong>.
          </div>
        </div>
      `,
  }),
  ...Array.from({ length: 7 }, (_, i) => (locale) => {
    const polyLen = 20 + i * 2;
    const validDirect = polyLen - (3 + (i % 3));
    const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ' : 'SHORTEST PATH',
      question:
        locale === 'el'
          ? `Αν το συνολικό μήκος μιας τεθλασμένης διαδρομής ΑΒΓ είναι <strong>${numFmt(polyLen)} km</strong>, ποιο μπορεί να είναι το μήκος του ευθύγραμμου τμήματος ΑΓ;`
          : `If the total length of a polygonal route ABC is <strong>${numFmt(polyLen)} km</strong>, which could be the length of segment AC?`,
      options: makeUniqueOptions(
        `${numFmt(validDirect)} km`,
        [`${numFmt(polyLen)} km`, `${numFmt(polyLen + 3)} km`, `${numFmt(polyLen + 7)} km`]
      ),
      correctAnswer: `${numFmt(validDirect)} km`,
      solution:
        locale === 'el'
          ? `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Μήκος τεθλασμένης ＝ ${numFmt(polyLen)} km.
            </div>
            <div>
              Η ευθεία διαδρομή ΑΓ είναι πάντα συντομότερη από την τεθλασμένη: ΑΓ ＜ ${numFmt(polyLen)} km. Άρα σωστή απάντηση είναι τα <strong>${numFmt(validDirect)} km</strong>.
            </div>
          </div>
        `
          : `
          <div class="space-y-2 leading-loose">
            <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
              Polygonal route length ＝ ${numFmt(polyLen)} km.
            </div>
            <div>
              Direct segment AC is always shorter: AC ＜ ${numFmt(polyLen)} km. Thus, the valid option is <strong>${numFmt(validDirect)} km</strong>.
            </div>
          </div>
        `,
    };
  }),
];

// Θέση 8: Σύνθετος Υπολογισμός με Μέσα Τμημάτων (Input)
const POOL_8_DOUBLE_MIDPOINT = Array.from({ length: 10 }, (_, i) => (locale) => {
  const ab = 8 + i * 2;
  const bc = 12 + i * 2;
  const m1b = ab / 2;
  const bm2 = bc / 2;
  const m1m2 = m1b + bm2;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΣΥΝΘΕΤΑ ΜΕΣΑ' : 'COMPLEX MIDPOINTS',
    question:
      locale === 'el'
        ? `Πάνω σε μια ευθεία βρίσκονται διαδοχικά τα τμήματα ΑΒ ＝ ${numFmt(ab)} cm και ΒΓ ＝ ${numFmt(bc)} cm. Αν <strong>Μ₁</strong> είναι το μέσο του ΑΒ και <strong>Μ₂</strong> είναι το μέσο του ΒΓ, ποια είναι η απόσταση <strong>Μ₁Μ₂</strong> σε cm;`
        : `On a straight line lie consecutive segments AB ＝ ${numFmt(ab)} cm and BC ＝ ${numFmt(bc)} cm. If <strong>M₁</strong> is the midpoint of AB and <strong>M₂</strong> is the midpoint of BC, what is the distance <strong>M₁M₂</strong> in cm?`,
    correctAnswer: String(m1m2),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Δεδομένα: ΑΒ ＝ ${numFmt(ab)} cm, ΒΓ ＝ ${numFmt(bc)} cm.
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>1. Το Μ₁ είναι μέσο του ΑΒ, άρα Μ₁Β ＝ </span>
            ${fracHtml(ab, 2)}
            <span> ＝ ${numFmt(m1b)} cm.</span>
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>2. Το Μ₂ είναι μέσο του ΒΓ, άρα ΒΜ₂ ＝ </span>
            ${fracHtml(bc, 2)}
            <span> ＝ ${numFmt(bm2)} cm.</span>
          </div>
          <div>
            3. Απόσταση Μ₁Μ₂ ＝ Μ₁Β ＋ ΒΜ₂ ＝ ${numFmt(m1b)} ＋ ${numFmt(bm2)} ＝ <strong>${numFmt(m1m2)} cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Given: AB ＝ ${numFmt(ab)} cm, BC ＝ ${numFmt(bc)} cm.
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>1. M₁ is midpoint of AB: M₁B ＝ </span>
            ${fracHtml(ab, 2)}
            <span> ＝ ${numFmt(m1b)} cm.</span>
          </div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>2. M₂ is midpoint of BC: BM₂ ＝ </span>
            ${fracHtml(bc, 2)}
            <span> ＝ ${numFmt(bm2)} cm.</span>
          </div>
          <div>
            3. Distance M₁M₂ ＝ M₁B ＋ BM₂ ＝ ${numFmt(m1b)} ＋ ${numFmt(bm2)} ＝ <strong>${numFmt(m1m2)} cm</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 9: Σύγκριση Ευθυγράμμων Τμημάτων (MCQ)
const POOL_9_COMPARISON_MCQ = Array.from({ length: 10 }, (_, i) => (locale) => {
  const len1 = 8 + (i % 5);
  const diff = 1 + (i % 4);
  const isGreater = i % 2 === 0;
  const len2 = isGreater ? len1 - diff : len1 + diff;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  const correctEl = isGreater ? 'ΑΒ ＞ ΓΔ' : 'ΑΒ ＜ ΓΔ';
  const correctEn = isGreater ? 'AB ＞ CD' : 'AB ＜ CD';
  const correct = locale === 'el' ? correctEl : correctEn;

  const wrongEl = [
    'ΑΒ ＝ ΓΔ',
    isGreater ? 'ΑΒ ＜ ΓΔ' : 'ΑΒ ＞ ΓΔ',
    'ΑΒ ＋ ΓΔ ＝ 0',
  ];
  const wrongEn = [
    'AB ＝ CD',
    isGreater ? 'AB ＜ CD' : 'AB ＞ CD',
    'AB ＋ CD ＝ 0',
  ];

  return {
    type: 'mcq',
    topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΤΜΗΜΑΤΩΝ' : 'SEGMENT COMPARISON',
    question:
      locale === 'el'
        ? `Έχουμε τα ευθύγραμμα τμήματα <strong>ΑΒ ＝ ${numFmt(len1)} cm</strong> και <strong>ΓΔ ＝ ${numFmt(len2)} cm</strong>. Ποια είναι η σωστή σχέση σύγκρισης μεταξύ τους;`
        : `Given segments <strong>AB ＝ ${numFmt(len1)} cm</strong> and <strong>CD ＝ ${numFmt(len2)} cm</strong>, which relationship correctly compares their lengths?`,
    options: makeUniqueOptions(correct, locale === 'el' ? wrongEl : wrongEn),
    correctAnswer: correct,
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Μήκη: ΑΒ ＝ ${numFmt(len1)} cm, ΓΔ ＝ ${numFmt(len2)} cm.
          </div>
          <div>
            Συγκρίνοντας τους αριθμούς: ${numFmt(len1)} ${isGreater ? '＞' : '＜'} ${numFmt(len2)}, επομένως ισχύει <strong>${correct}</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Lengths: AB ＝ ${numFmt(len1)} cm, CD ＝ ${numFmt(len2)} cm.
          </div>
          <div>
            Comparing lengths: ${numFmt(len1)} ${isGreater ? '＞' : '＜'} ${numFmt(len2)}, therefore <strong>${correct}</strong> is correct.
          </div>
        </div>
      `,
  };
});

// Θέση 10: Εύρεση Τμήματος με Αφαίρεση (Input)
const POOL_10_SUBTRACTION = Array.from({ length: 10 }, (_, i) => (locale) => {
  const ac = 18 + i * 2;
  const ab = 6 + ((i * 2) % 7);
  const bc = ac - ab;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΜΗΚΟΣ ΤΜΗΜΑΤΟΣ' : 'SEGMENT LENGTH',
    question:
      locale === 'el'
        ? `Σε μια ευθεία βρίσκονται τα σημεία Α, Β και Γ με το Β ανάμεσα στα Α και Γ. Αν <strong>ΑΓ ＝ ${numFmt(ac)} cm</strong> και <strong>ΑΒ ＝ ${numFmt(ab)} cm</strong>, ποιο είναι το μήκος του <strong>ΒΓ</strong> σε cm;`
        : `Points A, B, and C lie on a line with B between A and C. If <strong>AC ＝ ${numFmt(ac)} cm</strong> and <strong>AB ＝ ${numFmt(ab)} cm</strong>, what is the length of <strong>BC</strong> in cm?`,
    correctAnswer: String(bc),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Δεδομένα: ΑΓ ＝ ${numFmt(ac)} cm, ΑΒ ＝ ${numFmt(ab)} cm.
          </div>
          <div>
            Επειδή το Β είναι ανάμεσα στα Α και Γ: ΒΓ ＝ ΑΓ － ΑΒ ＝ ${numFmt(ac)} － ${numFmt(ab)} ＝ <strong>${numFmt(bc)} cm</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Given: AC ＝ ${numFmt(ac)} cm, AB ＝ ${numFmt(ab)} cm.
          </div>
          <div>
            Since B lies between A and C: BC ＝ AC － AB ＝ ${numFmt(ac)} － ${numFmt(ab)} ＝ <strong>${numFmt(bc)} cm</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 11: Ρεαλιστικό Πρόβλημα Αυτοκινητοδρόμου & Μέσου (Input)
const POOL_11_REAL_PROBLEM_HIGHWAY = Array.from({ length: 10 }, (_, i) => (locale) => {
  const ab = 60 + i * 4;
  const bc = 40 + i * 2;
  const total = ab + bc;
  const am = total / 2;
  const mb = Math.abs(ab - am);
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΣΟ ΤΜΗΜΑΤΟΣ' : 'PROBLEMS: MIDPOINT',
    question:
      locale === 'el'
        ? `Σε έναν ευθύγραμμο δρόμο βρίσκονται με τη σειρά τρεις πόλεις Α, Β και Γ. Η απόσταση ΑΒ είναι <strong>${numFmt(ab)} km</strong> και η ΒΓ είναι <strong>${numFmt(bc)} km</strong>. Ένας σταθμός διοδίων κατασκευάζεται ακριβώς στο <strong>μέσο Μ</strong> της συνολικής διαδρομής ΑΓ. Πόσα χιλιόμετρα απέχει ο σταθμός διοδίων από την πόλη Β;`
        : `Along a straight highway lie three cities A, B, and C in order. The distance AB is <strong>${numFmt(ab)} km</strong> and BC is <strong>${numFmt(bc)} km</strong>. A toll station is built at the exact <strong>midpoint M</strong> of the entire route AC. How many kilometers is the toll station from city B?`,
    correctAnswer: String(mb),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχικά δεδομένα: ΑΒ ＝ ${numFmt(ab)} km, ΒΓ ＝ ${numFmt(bc)} km.
          </div>
          <div>1. Συνολική απόσταση ΑΓ: ΑΓ ＝ ${numFmt(ab)} ＋ ${numFmt(bc)} ＝ ${numFmt(total)} km.</div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>2. Το Μ είναι μέσο του ΑΓ: ΑΜ ＝ </span>
            ${fracHtml(total, 2)}
            <span> ＝ ${numFmt(am)} km.</span>
          </div>
          <div>
            3. Απόσταση από την πόλη Β: ΜΒ ＝ |ΑΒ － ΑΜ| ＝ ${numFmt(ab)} － ${numFmt(am)} ＝ <strong>${numFmt(mb)} km</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Initial data: AB ＝ ${numFmt(ab)} km, BC ＝ ${numFmt(bc)} km.
          </div>
          <div>1. Total distance AC: AC ＝ ${numFmt(ab)} ＋ ${numFmt(bc)} ＝ ${numFmt(total)} km.</div>
          <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
            <span>2. M is midpoint of AC: AM ＝ </span>
            ${fracHtml(total, 2)}
            <span> ＝ ${numFmt(am)} km.</span>
          </div>
          <div>
            3. Distance from city B: MB ＝ |AB － AM| ＝ ${numFmt(ab)} － ${numFmt(am)} ＝ <strong>${numFmt(mb)} km</strong>.
          </div>
        </div>
      `,
  };
});

// Θέση 12: Ρεαλιστικό Πρόβλημα Περιμέτρου & Κόστους Τεθλασμένης (Input)
const POOL_12_REAL_PROBLEM_FENCE = Array.from({ length: 10 }, (_, i) => (locale) => {
  const s1 = 12 + (i % 8);
  const s2 = 15 + ((i * 2) % 9);
  const s3 = 10 + ((i * 3) % 7);
  const costPerM = 4 + (i % 4);
  const totalM = s1 + s2 + s3;
  const totalCost = totalM * costPerM;
  const numFmt = (n) => Number(n).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΦΡΑΞΗ' : 'PROBLEMS: FENCING',
    question:
      locale === 'el'
        ? `Ένας αγρότης θέλει να περιφράξει μια τεθλασμένη πλευρά του κτήματός του που αποτελείται από τρία διαδοχικά τμήματα: <strong>${numFmt(s1)} m</strong>, <strong>${numFmt(s2)} m</strong> και <strong>${numFmt(s3)} m</strong>. Αν το συρματόπλεγμα κοστίζει <strong>${numFmt(costPerM)} €</strong> ανά μέτρο, πόσα ευρώ θα πληρώσει συνολικά;`
        : `A farmer wants to fence an open polygonal boundary of his farm consisting of three consecutive segments: <strong>${numFmt(s1)} m</strong>, <strong>${numFmt(s2)} m</strong>, and <strong>${numFmt(s3)} m</strong>. If fencing costs <strong>${numFmt(costPerM)} €</strong> per meter, how much will he pay in total?`,
    correctAnswer: String(totalCost),
    solution:
      locale === 'el'
        ? `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Διαστάσεις: ${numFmt(s1)} m, ${numFmt(s2)} m, ${numFmt(s3)} m με κόστος ${numFmt(costPerM)} €/m.
          </div>
          <div>1. Συνολικό μήκος τεθλασμένης: L ＝ ${numFmt(s1)} ＋ ${numFmt(s2)} ＋ ${numFmt(s3)} ＝ ${numFmt(totalM)} μέτρα.</div>
          <div>
            2. Συνολικό κόστος περίφραξης: ${numFmt(totalM)} · ${numFmt(costPerM)} ＝ <strong>${numFmt(totalCost)} €</strong>.
          </div>
        </div>
      `
        : `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Dimensions: ${numFmt(s1)} m, ${numFmt(s2)} m, ${numFmt(s3)} m at ${numFmt(costPerM)} €/m.
          </div>
          <div>1. Total boundary length: L ＝ ${numFmt(s1)} ＋ ${numFmt(s2)} ＋ ${numFmt(s3)} ＝ ${numFmt(totalM)} meters.</div>
          <div>
            2. Total fencing cost: ${numFmt(totalM)} · ${numFmt(costPerM)} ＝ <strong>${numFmt(totalCost)} €</strong>.
          </div>
        </div>
      `,
  };
});

// Συγκέντρωση των 12 δεξαμενών
const POOLS = [
  POOL_1_BASIC_LINES,
  POOL_2_MIDPOINT_CALC,
  POOL_3_FULL_FROM_MID,
  POOL_4_COORDINATE_DIST,
  POOL_5_COLLINEAR_SUM,
  POOL_6_POLYLINE_LEN,
  POOL_7_SHORTEST_PATH_MCQ,
  POOL_8_DOUBLE_MIDPOINT,
  POOL_9_COMPARISON_MCQ,
  POOL_10_SUBTRACTION,
  POOL_11_REAL_PROBLEM_HIGHWAY,
  POOL_12_REAL_PROBLEM_FENCE,
];

export default function GeometrikesEnnoiesAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = DICTIONARY[locale] || DICTIONARY.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή των 12 ασκήσεων (διατήρηση ακριβώς των 12 ερωτήσεων του αρχικού αρχείου)
  const generateQuestions = () => {
    const selected = POOLS.map((pool, idx) => {
      const randomGen = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: idx + 1,
        ...randomGen(locale),
      };
    });

    setQuestions(selected);
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
    let clean = val.replace(/\./g, ',');
    clean = clean.replace(/[^0-9,]/g, '');

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) {
      const parts = clean.split(',');
      clean = parts[0] + ',' + parts.slice(1).join('');
    }

    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const rawUser = userAnswers[q.id] || '';
      const rawCorrect = q.correctAnswer || '';

      if (q.type === 'input') {
        const numUser = parseFloat(rawUser.replace(/\s+/g, '').replace(/,/g, '.'));
        const numCorrect = parseFloat(rawCorrect.replace(/\s+/g, '').replace(/,/g, '.'));

        if (!isNaN(numUser) && !isNaN(numCorrect)) {
          if (Math.abs(numUser - numCorrect) <= 0.05) {
            totalCorrect += 1;
          }
        }
      } else {
        const cleanUser = rawUser.trim().toUpperCase().replace(/\s+/g, '');
        const cleanCorrect = rawCorrect.trim().toUpperCase().replace(/\s+/g, '');
        if (cleanUser === cleanCorrect) {
          totalCorrect += 1;
        }
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
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.navGrade}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/35-geometrikes-ennoies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 space-y-8 overflow-x-hidden box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 shadow-xl border border-indigo-700/50 min-w-0">
          <div className="max-w-4xl space-y-3 min-w-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.bannerBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.bannerTitle}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6 min-w-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 min-w-0">
            {questions.map((q) => {
              const rawUser = userAnswers[q.id] || '';
              const rawCorrect = q.correctAnswer || '';

              let isCorrect = false;
              if (isSubmitted) {
                if (q.type === 'input') {
                  const numUser = parseFloat(rawUser.replace(/\s+/g, '').replace(/,/g, '.'));
                  const numCorrect = parseFloat(rawCorrect.replace(/\s+/g, '').replace(/,/g, '.'));
                  if (!isNaN(numUser) && !isNaN(numCorrect)) {
                    isCorrect = Math.abs(numUser - numCorrect) <= 0.05;
                  }
                } else {
                  isCorrect =
                    rawUser.trim().toUpperCase().replace(/\s+/g, '') ===
                    rawCorrect.trim().toUpperCase().replace(/\s+/g, '');
                }
              }

              const isProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 overflow-hidden ${
                    isProblem ? 'border-amber-200 bg-amber-50/15' : 'border-slate-200'
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
                            isProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Χειριστήρια Απάντησης (No-Giveaway) */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative w-full max-w-xs min-w-0">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder={t.inputPlaceholder}
                          value={rawUser}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = rawUser === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="ml-2 shrink-0">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Αναλυτική Λύση (Εμφάνιση ΜΟΝΟ μετά την υποβολή) */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border min-w-0 overflow-hidden ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 min-w-0">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono break-words [overflow-wrap:anywhere]">
                              {toCleanUppercase(t.correctAnswerLabel)}&nbsp;&nbsp;
                              <span
                                className="text-emerald-700 font-black"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-loose font-normal pt-2 border-t border-slate-200/60 break-words [overflow-wrap:anywhere] max-w-full"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπιά Υποβολής / Ανανέωσης Εντός Σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnSubmit)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNewExercises)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                {isSubmitted ? toCleanUppercase(t.finalScore) : toCleanUppercase(t.progress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRate)}
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
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
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.btnNewExercises)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheck)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.btnRetry)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}