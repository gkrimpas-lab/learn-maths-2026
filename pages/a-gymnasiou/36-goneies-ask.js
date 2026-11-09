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
    const numVal = parseInt(String(correct).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numVal)) {
      unique.add(`${numVal + count * 5}°`);
    } else {
      unique.add(`${correct} (${count})`);
    }
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// ============================================================================
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ UI (i18n)
// ============================================================================
const DICTIONARY = {
  el: {
    pageTitle: "Ασκήσεις: Γωνίες, Είδη & Σχέσεις Γωνιών | Α' Γυμνασίου",
    pageDesc:
      "12 δυναμικές ασκήσεις και προβλήματα σε είδη γωνιών, εφεξής, συμπληρωματικές, παραπληρωματικές, κατακορυφήν και διχοτόμο για την Α' Γυμνασίου.",
    navGrade: "Α' Γυμνασίου",
    btnTheory: 'ΘΕΩΡΙΑ',
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 02 • ΕΞΑΣΚΗΣΗ",
    title: 'Γωνίες: Είδη, Σχέσεις & Προβλήματα',
    subtitle:
      'Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις σε είδη γωνιών, συμπληρωματικές, παραπληρωματικές, κατακορυφήν και διχοτόμο. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ».',
    checkBtn: 'ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ',
    newBtn: 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ',
    btnCheckShort: 'ΕΛΕΓΧΟΣ',
    placeholder: 'Γράψε την απάντηση...',
    finalScore: 'ΤΕΛΙΚΟ ΣΚΟΡ',
    progress: 'ΠΡΟΟΔΟΣ',
    success: 'ΕΠΙΤΥΧΙΑ',
    retry: 'ΕΠΑΝΑΛΗΨΗ',
    correctLabel: 'ΣΩΣΤΟ',
    wrongLabel: 'ΛΑΘΟΣ',
    correctAnswerLabel: 'ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:',
    problemBadge: 'ΠΡΟΒΛΗΜΑ',
  },
  en: {
    pageTitle: 'Exercises: Angles, Types & Relations | Grade 7',
    pageDesc:
      '12 dynamic exercises and problems on angle types, adjacent, complementary, supplementary, vertically opposite angles and bisector for Grade 7.',
    navGrade: 'Grade 7',
    btnTheory: 'THEORY',
    badge: 'GRADE 7 • GEOMETRY CHAPTER 02 • PRACTICE',
    title: 'Angles: Types, Relations & Problems',
    subtitle:
      'Solve the 12 selected exercises on angle types, complementary, supplementary, vertically opposite angles and bisectors. Click "CHECK ANSWERS" when finished.',
    checkBtn: 'CHECK ANSWERS',
    newBtn: 'NEW EXERCISES',
    btnCheckShort: 'CHECK',
    placeholder: 'Enter your answer...',
    finalScore: 'FINAL SCORE',
    progress: 'PROGRESS',
    success: 'SUCCESS',
    retry: 'RETRY',
    correctLabel: 'CORRECT',
    wrongLabel: 'WRONG',
    correctAnswerLabel: 'CORRECT ANSWER:',
    problemBadge: 'PROBLEM',
  },
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ ΓΙΑ ΤΙΣ ΓΩΝΙΕΣ (10 ΠΑΡΑΛΛΑΓΕΣ ΑΝΑ ΔΕΞΑΜΕΝΗ ΜΕ i18n)
// ============================================================================

// Θέση 1: Έννοιες Γωνίας, Κορυφή, Πλευρές (MCQ)
const POOL_1_ANGLE_BASICS = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΓΩΝΙΑ' : 'BASIC CONCEPTS: ANGLE',
    question:
      loc === 'el'
        ? 'Ποιο γεωμετρικό σχήμα αποτελείται από <strong>δύο ημιευθείες με κοινή αρχή</strong> μαζί με το μέρος του επιπέδου που ορίζουν;'
        : 'Which geometric figure consists of <strong>two rays with a common endpoint</strong> along with the region of the plane they define?',
    options: makeUniqueOptions(
      loc === 'el' ? 'Η γωνία' : 'The angle',
      loc === 'el'
        ? ['Το ευθύγραμμο τμήμα', 'Η ευθεία', 'Η τεθλασμένη γραμμή']
        : ['The line segment', 'The straight line', 'The polygonal chain']
    ),
    correctAnswer: loc === 'el' ? 'Η γωνία' : 'The angle',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ορισμός Γωνίας:' : 'Definition of Angle:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? 'Γωνία ονομάζεται το σχήμα που σχηματίζουν δύο ημιευθείες με κοινή αρχή Ο (κορυφή) και οι ημιευθείες λέγονται πλευρές της γωνίας.'
              : 'An angle is the figure formed by two rays sharing a common vertex, where the rays are called the sides of the angle.'
          }
        </div>
      </div>
    `,
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΣΥΜΒΟΛΙΣΜΟΣ ΓΩΝΙΑΣ' : 'ANGLE NOTATION',
    question:
      loc === 'el'
        ? 'Στη γωνία <strong>xÔy</strong>, ποιο σημείο είναι η <strong>κορυφή</strong> της;'
        : 'In the angle <strong>xÔy</strong>, which point is its <strong>vertex</strong>?',
    options: makeUniqueOptions(
      loc === 'el' ? 'Το σημείο O' : 'Point O',
      loc === 'el'
        ? ['Το σημείο x', 'Το σημείο y', 'Κανένα σημείο']
        : ['Point x', 'Point y', 'None of these']
    ),
    correctAnswer: loc === 'el' ? 'Το σημείο O' : 'Point O',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Κανόνας Συμβολισμού:' : 'Notation Rule:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? 'Στον συμβολισμό μιας γωνίας με τρία γράμματα (xÔy ή ΑÔΒ), το μεσαίο γράμμα με το καπελάκι (Ô) δηλώνει πάντοτε την <strong>κορυφή</strong>.'
              : 'In three-letter angle notation (xÔy), the middle letter with the caret (Ô) always denotes the <strong>vertex</strong>.'
          }
        </div>
      </div>
    `,
  }),
  ...Array.from({ length: 8 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΠΛΕΥΡΕΣ ΓΩΝΙΑΣ' : 'ANGLE SIDES',
    question:
      loc === 'el'
        ? 'Ποιες είναι οι <strong>πλευρές</strong> της γωνίας <strong>xÔy</strong>;'
        : 'What are the <strong>sides</strong> of the angle <strong>xÔy</strong>?',
    options: makeUniqueOptions(
      loc === 'el' ? 'Οι ημιευθείες Ox και Oy' : 'The rays Ox and Oy',
      loc === 'el'
        ? ['Τα ευθύγραμμα τμήματα Οx και Οy', 'Η ευθεία xy', 'Τα σημεία x και y']
        : ['The line segments Ox and Oy', 'The line xy', 'The points x and y']
    ),
    correctAnswer: loc === 'el' ? 'Οι ημιευθείες Ox και Oy' : 'The rays Ox and Oy',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Πλευρές Γωνίας:' : 'Sides of an Angle:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? 'Οι πλευρές μιας γωνίας είναι πάντοτε <strong>ημιευθείες</strong> με κοινή αρχή την κορυφή Ο.'
              : 'The sides of an angle are always <strong>rays</strong> originating from the common vertex O.'
          }
        </div>
      </div>
    `,
  })),
];

// Θέση 2: Είδη Γωνιών (MCQ)
const POOL_2_ANGLE_TYPES = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΕΙΔΗ ΓΩΝΙΩΝ: ΟΡΘΗ' : 'ANGLE TYPES: RIGHT',
    question:
      loc === 'el'
        ? 'Πόσες μοίρες ισούται ακριβώς μία <strong>ορθή γωνία</strong>;'
        : 'How many degrees is exactly one <strong>right angle</strong>?',
    options: makeUniqueOptions('90°', ['180°', '45°', '360°']),
    correctAnswer: '90°',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Η <strong>ορθή γωνία</strong> είναι ακριβώς <strong>90°</strong> και οι πλευρές της είναι κάθετες.'
            : 'A <strong>right angle</strong> is exactly <strong>90°</strong> and its sides are perpendicular.'
        }</div>
      </div>
    `,
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΕΙΔΗ ΓΩΝΙΩΝ: ΕΥΘΕΙΑ' : 'ANGLE TYPES: STRAIGHT',
    question:
      loc === 'el'
        ? 'Πόσες μοίρες ισούται μία <strong>ευθεία γωνία</strong>;'
        : 'How many degrees is a <strong>straight angle</strong>?',
    options: makeUniqueOptions('180°', ['90°', '360°', '270°']),
    correctAnswer: '180°',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Η <strong>ευθεία γωνία</strong> ισούται με <strong>180°</strong> και οι πλευρές της είναι αντικείμενες ημιευθείες.'
            : 'A <strong>straight angle</strong> measures <strong>180°</strong> and its sides are opposite rays.'
        }</div>
      </div>
    `,
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΕΙΔΗ ΓΩΝΙΩΝ: ΟΞΕΙΑ' : 'ANGLE TYPES: ACUTE',
    question:
      loc === 'el'
        ? 'Μία γωνία με μέτρο <strong>64°</strong> ονομάζεται:'
        : 'An angle measuring <strong>64°</strong> is called:',
    options: makeUniqueOptions(
      loc === 'el' ? 'Οξεία γωνία' : 'Acute angle',
      loc === 'el'
        ? ['Αμβλεία γωνία', 'Ορθή γωνία', 'Ευθεία γωνία']
        : ['Obtuse angle', 'Right angle', 'Straight angle']
    ),
    correctAnswer: loc === 'el' ? 'Οξεία γωνία' : 'Acute angle',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Επειδή 0° ＜ 64° ＜ 90°, η γωνία είναι <strong>οξεία</strong>.'
            : 'Since 0° ＜ 64° ＜ 90°, the angle is <strong>acute</strong>.'
        }</div>
      </div>
    `,
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΕΙΔΗ ΓΩΝΙΩΝ: ΑΜΒΛΕΙΑ' : 'ANGLE TYPES: OBTUSE',
    question:
      loc === 'el'
        ? 'Μία γωνία με μέτρο <strong>125°</strong> ονομάζεται:'
        : 'An angle measuring <strong>125°</strong> is called:',
    options: makeUniqueOptions(
      loc === 'el' ? 'Αμβλεία γωνία' : 'Obtuse angle',
      loc === 'el'
        ? ['Οξεία γωνία', 'Μη κυρτή γωνία', 'Ευθεία γωνία']
        : ['Acute angle', 'Reflex angle', 'Straight angle']
    ),
    correctAnswer: loc === 'el' ? 'Αμβλεία γωνία' : 'Obtuse angle',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Επειδή 90° ＜ 125° ＜ 180°, η γωνία είναι <strong>αμβλεία</strong>.'
            : 'Since 90° ＜ 125° ＜ 180°, the angle is <strong>obtuse</strong>.'
        }</div>
      </div>
    `,
  }),
  ...Array.from({ length: 6 }, (_, i) => (loc) => {
    const deg = 200 + i * 20;
    const numFmt = Number(deg).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');
    return {
      type: 'mcq',
      topic: loc === 'el' ? 'ΕΙΔΗ ΓΩΝΙΩΝ: ΜΗ ΚΥΡΤΗ' : 'ANGLE TYPES: REFLEX',
      question:
        loc === 'el'
          ? `Μία γωνία με μέτρο <strong>${numFmt}°</strong> ονομάζεται:`
          : `An angle measuring <strong>${numFmt}°</strong> is called:`,
      options: makeUniqueOptions(
        loc === 'el' ? 'Μη κυρτή (ανακλώμενη) γωνία' : 'Reflex angle',
        loc === 'el'
          ? ['Αμβλεία γωνία', 'Ευθεία γωνία', 'Πλήρης γωνία']
          : ['Obtuse angle', 'Straight angle', 'Full angle']
      ),
      correctAnswer: loc === 'el' ? 'Μη κυρτή (ανακλώμενη) γωνία' : 'Reflex angle',
      solution: `
        <div class="space-y-2 leading-loose">
          <div>${
            loc === 'el'
              ? `Επειδή 180° ＜ ${numFmt}° ＜ 360°, η γωνία είναι <strong>μη κυρτή</strong>.`
              : `Since 180° ＜ ${numFmt}° ＜ 360°, the angle is a <strong>reflex angle</strong>.`
          }</div>
        </div>
      `,
    };
  }),
];

// Θέση 3: Υπολογισμός Συμπληρωματικής Γωνίας (Input)
const POOL_3_COMPLEMENTARY_CALC = Array.from({ length: 10 }, (_, i) => (loc) => {
  const a = 25 + i * 4; // 25, 29, 33, ...
  const comp = 90 - a;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ' : 'COMPLEMENTARY ANGLES',
    question:
      loc === 'el'
        ? `Μία γωνία έχει μέτρο <strong>${numFmt(a)}°</strong>. Ποιο είναι το μέτρο της <strong>συμπληρωματικής</strong> της γωνίας σε μοίρες;`
        : `An angle measures <strong>${numFmt(a)}°</strong>. What is the measure of its <strong>complementary</strong> angle in degrees?`,
    correctAnswer: String(comp),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Άθροισμα συμπληρωματικών ＝ 90°' : 'Sum of complementary angles ＝ 90°'}
        </div>
        <div>
          ${loc === 'el' ? 'Συμπλήρωμα' : 'Complement'} ＝ 90° － ${numFmt(a)}° ＝ <strong>${numFmt(comp)}°</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 4: Υπολογισμός Παραπληρωματικής Γωνίας (Input)
const POOL_4_SUPPLEMENTARY_CALC = Array.from({ length: 10 }, (_, i) => (loc) => {
  const a = 45 + i * 8; // 45, 53, 61, ...
  const supp = 180 - a;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ' : 'SUPPLEMENTARY ANGLES',
    question:
      loc === 'el'
        ? `Μία γωνία έχει μέτρο <strong>${numFmt(a)}°</strong>. Ποιο είναι το μέτρο της <strong>παραπληρωματικής</strong> της γωνίας σε μοίρες;`
        : `An angle measures <strong>${numFmt(a)}°</strong>. What is the measure of its <strong>supplementary</strong> angle in degrees?`,
    correctAnswer: String(supp),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Άθροισμα παραπληρωματικών ＝ 180°' : 'Sum of supplementary angles ＝ 180°'}
        </div>
        <div>
          ${loc === 'el' ? 'Παραπλήρωμα' : 'Supplement'} ＝ 180° － ${numFmt(a)}° ＝ <strong>${numFmt(supp)}°</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 5: Εφεξής & Διαδοχικές Γωνίες (MCQ)
const POOL_5_ADJACENT_MCQ = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΕΦΕΞΗΣ ΓΩΝΙΕΣ' : 'ADJACENT ANGLES',
    question:
      loc === 'el'
        ? 'Δύο γωνίες λέγονται <strong>εφεξής</strong> όταν έχουν:'
        : 'Two angles are called <strong>adjacent</strong> when they have:',
    options: makeUniqueOptions(
      loc === 'el'
        ? 'Κοινή κορυφή, κοινή πλευρά και κανένα κοινό εσωτερικό σημείο'
        : 'Common vertex, common side, and no common interior points',
      [
        loc === 'el' ? 'Μόνο κοινή κορυφή' : 'Only a common vertex',
        loc === 'el' ? 'Κοινή πλευρά και άθροισμα 180°' : 'Common side and a sum of 180°',
        loc === 'el' ? 'Αντικείμενες πλευρές' : 'Opposite sides',
      ]
    ),
    correctAnswer:
      loc === 'el'
        ? 'Κοινή κορυφή, κοινή πλευρά και κανένα κοινό εσωτερικό σημείο'
        : 'Common vertex, common side, and no common interior points',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ορισμός Εφεξής Γωνιών:' : 'Definition of Adjacent Angles:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? 'Πρέπει να έχουν κοινή κορυφή, μία κοινή πλευρά και να μη συμπίπτουν (να μην έχουν κοινά εσωτερικά σημεία).'
              : 'They must share a common vertex, one common ray, and not overlap internally.'
          }
        </div>
      </div>
    `,
  }),
  ...Array.from({ length: 9 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΔΙΑΔΟΧΙΚΕΣ ΓΩΝΙΕΣ' : 'CONSECUTIVE ANGLES',
    question:
      loc === 'el'
        ? 'Τρεις ή περισσότερες γωνίες στο ίδιο επίπεδο λέγονται <strong>διαδοχικές</strong> όταν:'
        : 'Three or more angles in the same plane are called <strong>consecutive</strong> when:',
    options: makeUniqueOptions(
      loc === 'el' ? 'Ανά δύο είναι εφεξής' : 'Each successive pair is adjacent',
      [
        loc === 'el' ? 'Έχουν όλες άθροισμα 90°' : 'Their sum is always 90°',
        loc === 'el' ? 'Είναι όλες ίσες μεταξύ τους' : 'They are all equal to each other',
        loc === 'el' ? 'Έχουν αντικείμενες πλευρές' : 'They have opposite rays',
      ]
    ),
    correctAnswer: loc === 'el' ? 'Ανά δύο είναι εφεξής' : 'Each successive pair is adjacent',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Οι διαδοχικές γωνίες τοποθετούνται στη σειρά γύρω από την ίδια κορυφή έτσι ώστε ανά δύο να είναι εφεξής.'
            : 'Consecutive angles are arranged sequentially around the same vertex so that every adjacent pair shares a side.'
        }</div>
      </div>
    `,
  })),
];

// Θέση 6: Κατακορυφήν Γωνίες (Input)
const POOL_6_VERT_ANGLES = Array.from({ length: 10 }, (_, i) => (loc) => {
  const ang = 40 + i * 5; // 40, 45, 50, ...
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΚΑΤΑΚΟΡΥΦΗΝ ΓΩΝΙΕΣ' : 'VERTICALLY OPPOSITE ANGLES',
    question:
      loc === 'el'
        ? `Δύο ευθείες τέμνονται και σχηματίζουν μία γωνία <strong>${numFmt(ang)}°</strong>. Πόσες μοίρες είναι η <strong>κατακορυφήν</strong> της γωνία;`
        : `Two lines intersect forming an angle of <strong>${numFmt(ang)}°</strong>. How many degrees is its <strong>vertically opposite</strong> angle?`,
    correctAnswer: String(ang),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Ιδιότητα:' : 'Property:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Οι κατακορυφήν γωνίες είναι <strong>πάντα ίσες</strong>. Επομένως και η κατακορυφήν γωνία ισούται με <strong>${numFmt(ang)}°</strong>.`
              : `Vertically opposite angles are <strong>always equal</strong>. Hence, the opposite angle is also <strong>${numFmt(ang)}°</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 7: Διχοτόμος Γωνίας - Υπολογισμός Μισού (Input)
const POOL_7_BISECTOR_HALF = Array.from({ length: 10 }, (_, i) => (loc) => {
  const mainAng = 50 + i * 6; // 50, 56, 62, ...
  const half = mainAng / 2;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ' : 'ANGLE BISECTOR',
    question:
      loc === 'el'
        ? `Μία γωνία xÔy έχει μέτρο <strong>${numFmt(mainAng)}°</strong>. Η ημιευθεία Οδ είναι η <strong>διχοτόμος</strong> της. Πόσο είναι το μέτρο της γωνίας <strong>xÔδ</strong> σε μοίρες;`
        : `An angle xÔy measures <strong>${numFmt(mainAng)}°</strong>. Ray Od is its <strong>bisector</strong>. What is the measure of angle <strong>xÔδ</strong> in degrees?`,
    correctAnswer: String(half),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          xÔδ ＝ ${fracHtml('xÔy', 2)}
        </div>
        <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
          <span>xÔδ ＝ </span>
          ${fracHtml(numFmt(mainAng), 2)}
          <span> ＝ <strong>${numFmt(half)}°</strong>.</span>
        </div>
      </div>
    `,
  };
});

// Θέση 8: Εύρεση Όλης της Γωνίας από τη Διχοτόμο (Input)
const POOL_8_BISECTOR_FULL = Array.from({ length: 10 }, (_, i) => (loc) => {
  const half = 22 + i * 3; // 22, 25, 28, ...
  const full = half * 2;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ' : 'ANGLE BISECTOR',
    question:
      loc === 'el'
        ? `Η ημιευθεία Οδ είναι η διχοτόμος της γωνίας xÔy. Αν <strong>δÔy ＝ ${numFmt(half)}°</strong>, ποιο είναι το μέτρο ολόκληρης της γωνίας <strong>xÔy</strong> σε μοίρες;`
        : `Ray Od is the bisector of angle xÔy. If <strong>δÔy ＝ ${numFmt(half)}°</strong>, what is the measure of the whole angle <strong>xÔy</strong> in degrees?`,
    correctAnswer: String(full),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>
          xÔy ＝ 2 · δÔy ➔ xÔy ＝ 2 · ${numFmt(half)}° ＝ <strong>${numFmt(full)}°</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 9: Σύγκριση & Σχέσεις Γωνιών (MCQ)
const POOL_9_COMPARISON_MCQ = Array.from({ length: 10 }, (_, i) => (loc) => {
  const a = 48 + (i % 6);
  const diff = 2 + (i % 5);
  const isGreater = i % 2 === 0;
  const b = isGreater ? a - diff : a + diff;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  const correct = isGreater ? 'α ＞ β' : 'α ＜ β';
  const wrongCandidates = ['α ＝ β', isGreater ? 'α ＜ β' : 'α ＞ β', 'α ＋ β ＝ 90°'];

  return {
    type: 'mcq',
    topic: loc === 'el' ? 'ΣΥΓΚΡΙΣΗ ΓΩΝΙΩΝ' : 'ANGLE COMPARISON',
    question:
      loc === 'el'
        ? `Δίνονται δύο γωνίες <strong>α ＝ ${numFmt(a)}°</strong> και <strong>β ＝ ${numFmt(b)}°</strong>. Ποια σχέση ισχύει;`
        : `Given two angles <strong>α ＝ ${numFmt(a)}°</strong> and <strong>β ＝ ${numFmt(b)}°</strong>, which inequality holds true?`,
    options: makeUniqueOptions(correct, wrongCandidates),
    correctAnswer: correct,
    solution: `
      <div class="space-y-2 leading-loose">
        <div>
          ${loc === 'el' ? 'Συγκρίνοντας τα μέτρα:' : 'Comparing measures:'} ${numFmt(a)}° ${
      isGreater ? '＞' : '＜'
    } ${numFmt(b)}°, ${loc === 'el' ? 'επομένως ισχύει' : 'therefore'} <strong>${correct}</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 10: Άθροισμα Εφεξής Γωνιών πάνω σε Ευθεία (Input)
const POOL_10_STRAIGHT_LINE_SUM = Array.from({ length: 10 }, (_, i) => (loc) => {
  const a = 50 + i * 4;
  const b = 60 - i * 2;
  const c = 180 - (a + b);
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΓΩΝΙΕΣ ΣΕ ΕΥΘΕΙΑ' : 'ANGLES ON A STRAIGHT LINE',
    question:
      loc === 'el'
        ? `Τρεις διαδοχικές γωνίες α, β, γ βρίσκονται πάνω στην ίδια ευθεία (σχηματίζουν ευθεία γωνία 180°). Αν <strong>α ＝ ${numFmt(a)}°</strong> και <strong>β ＝ ${numFmt(b)}°</strong>, πόσο είναι το μέτρο της γωνίας <strong>γ</strong> σε μοίρες;`
        : `Three consecutive angles α, β, γ lie on a straight line (forming a straight angle of 180°). If <strong>α ＝ ${numFmt(a)}°</strong> and <strong>β ＝ ${numFmt(b)}°</strong>, what is the measure of angle <strong>γ</strong> in degrees?`,
    correctAnswer: String(c),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>
          α ＋ β ＋ γ ＝ 180° ➔ γ ＝ 180° － (${numFmt(a)}° ＋ ${numFmt(b)}°) ＝ 180° － ${numFmt(a + b)}° ＝ <strong>${numFmt(c)}°</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 11: Ρεαλιστικό Πρόβλημα - Παραπληρωματικές με Λόγο (Input)
const POOL_11_RATIO_PROBLEM = Array.from({ length: 10 }, (_, i) => (loc) => {
  const ratios = [
    { k: 2, beta: 60, alpha: 120 },
    { k: 3, beta: 45, alpha: 135 },
    { k: 4, beta: 36, alpha: 144 },
    { k: 5, beta: 30, alpha: 150 },
  ];
  const choice = ratios[i % ratios.length];
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ & ΛΟΓΟΙ' : 'PROBLEMS: SUPPLEMENTARY & RATIOS',
    question:
      loc === 'el'
        ? `Δύο εφεξής γωνίες α και β είναι παραπληρωματικές (α ＋ β ＝ 180°). Αν η γωνία α είναι <strong>${choice.k}πλάσια</strong> της γωνίας β (α ＝ ${choice.k} · β), ποιο είναι το μέτρο της <strong>μικρότερης γωνίας β</strong> σε μοίρες;`
        : `Two adjacent angles α and β are supplementary (α ＋ β ＝ 180°). If angle α is <strong>${choice.k} times</strong> angle β (α ＝ ${choice.k} · β), what is the measure of the <strong>smaller angle β</strong> in degrees?`,
    correctAnswer: String(choice.beta),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          α ＋ β ＝ 180° ${loc === 'el' ? 'και' : 'and'} α ＝ ${choice.k} · β
        </div>
        <div>1. ${choice.k} · β ＋ β ＝ ${choice.k + 1} · β ＝ 180°.</div>
        <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
          <span>2. β ＝ </span>
          ${fracHtml('180°', choice.k + 1)}
          <span> ＝ <strong>${numFmt(choice.beta)}°</strong>.</span>
        </div>
      </div>
    `,
  };
});

// Θέση 12: Ρεαλιστικό Πρόβλημα - Διχοτόμος & Οπτική (Input)
const POOL_12_REAL_OPTICS_PROBLEM = Array.from({ length: 10 }, (_, i) => (loc) => {
  const incAngle = 30 + i * 4; // γωνία πρόσπτωσης
  const devAngle = 2 * incAngle; // συνολική γωνία
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΠΤΙΚΗ & ΔΙΧΟΤΟΜΟΣ' : 'PROBLEMS: OPTICS & BISECTOR',
    question:
      loc === 'el'
        ? `Μια ακτίνα φωτός προσπίπτει σε επίπεδο κάτοπτρο. Η κατακόρυφη ευθεία (κάθετος) λειτουργεί ως <strong>διχοτόμος</strong> της συνολικής γωνίας που σχηματίζει η εισερχόμενη με την ανακλώμενη ακτίνα. Αν η γωνία μεταξύ της εισερχόμενης ακτίνας και της καθέτου είναι <strong>${numFmt(incAngle)}°</strong>, πόσες μοίρες είναι η <strong>συνολική γωνία</strong> ανάμεσα στην εισερχόμενη και την ανακλώμενη ακτίνα;`
        : `A light beam strikes a flat mirror. The normal line acts as the <strong>bisector</strong> of the total angle formed between the incident and reflected rays. If the angle between the incident ray and the normal is <strong>${numFmt(incAngle)}°</strong>, what is the <strong>total angle</strong> between the incident and reflected rays in degrees?`,
    correctAnswer: String(devAngle),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Νόμος Ανάκλασης & Διχοτόμος:' : 'Law of Reflection & Bisector:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Επειδή η κάθετος είναι διχοτόμος, χωρίζει τη συνολική γωνία σε δύο ίσα μέρη των ${numFmt(incAngle)}°. Άρα η συνολική γωνία είναι: 2 · ${numFmt(incAngle)}° ＝ <strong>${numFmt(devAngle)}°</strong>.`
              : `Since the normal line is the bisector, it divides the total angle into two equal parts of ${numFmt(incAngle)}°. Thus, the total angle is: 2 · ${numFmt(incAngle)}° ＝ <strong>${numFmt(devAngle)}°</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Συγκέντρωση των 12 Pools
const POOLS = [
  POOL_1_ANGLE_BASICS,
  POOL_2_ANGLE_TYPES,
  POOL_3_COMPLEMENTARY_CALC,
  POOL_4_SUPPLEMENTARY_CALC,
  POOL_5_ADJACENT_MCQ,
  POOL_6_VERT_ANGLES,
  POOL_7_BISECTOR_HALF,
  POOL_8_BISECTOR_FULL,
  POOL_9_COMPARISON_MCQ,
  POOL_10_STRAIGHT_LINE_SUM,
  POOL_11_RATIO_PROBLEM,
  POOL_12_REAL_OPTICS_PROBLEM,
];

export default function GoneiesAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = DICTIONARY[locale] || DICTIONARY.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 12 ασκήσεων (διατήρηση ακριβώς του πλήθους των 12 ερωτήσεων)
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
        const numUser = parseFloat(String(rawUser).trim().replace(/\s+/g, '').replace(/,/g, '.'));
        const numCorrect = parseFloat(String(rawCorrect).trim().replace(/\s+/g, '').replace(/,/g, '.'));

        if (!isNaN(numUser) && !isNaN(numCorrect)) {
          if (Math.abs(numUser - numCorrect) <= 0.05) {
            totalCorrect += 1;
          }
        }
      } else {
        const cleanUser = String(rawUser).trim().toUpperCase().replace(/\s+/g, '');
        const cleanCorrect = String(rawCorrect).trim().toUpperCase().replace(/\s+/g, '');
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
          href="/a-gymnasiou/36-goneies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 space-y-8 overflow-x-hidden box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 shadow-xl border border-indigo-700/50 min-w-0">
          <div className="max-w-4xl space-y-3 min-w-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.subtitle}
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
                  const numUser = parseFloat(String(rawUser).trim().replace(/\s+/g, '').replace(/,/g, '.'));
                  const numCorrect = parseFloat(String(rawCorrect).trim().replace(/\s+/g, '').replace(/,/g, '.'));
                  if (!isNaN(numUser) && !isNaN(numCorrect)) {
                    isCorrect = Math.abs(numUser - numCorrect) <= 0.05;
                  }
                } else {
                  isCorrect =
                    String(rawUser).trim().toUpperCase().replace(/\s+/g, '') ===
                    String(rawCorrect).trim().toUpperCase().replace(/\s+/g, '');
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
                          placeholder={t.placeholder}
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
                            <span>{toCleanUppercase(t.correctLabel)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 min-w-0">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongLabel)}</span>
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

          {/* Κουμπιά Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newBtn)}</span>
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
                  {toCleanUppercase(t.success)}
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
              <span className="hidden sm:inline">{toCleanUppercase(t.newBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheckShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.retry)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}