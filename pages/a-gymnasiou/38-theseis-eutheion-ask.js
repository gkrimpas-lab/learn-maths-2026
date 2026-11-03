import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Helper για δημιουργία HTML κλάσματος μέσα στα solution strings (Mobile safe)
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-1.5 border-b-2 border-current w-full text-center">${displayNum}</span><span class="pt-0.5 px-1.5 w-full text-center">${displayDen}</span></span></span>`;
};

// Καθαρισμός τόνων για ελληνικά κεφαλαία (διατηρεί μόνο το Α')
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
    const numVal = parseInt(correct, 10);
    if (!isNaN(numVal)) {
      unique.add(String(numVal + count * 5));
    } else {
      unique.add(`${correct} (${count})`);
    }
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ ΓΙΑ ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΩΝ & ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΩΝ (i18n)
// ============================================================================

// Θέση 1: Σχετικές Θέσεις Δύο Ευθειών (MCQ)
const POOL_1_REL_POSITIONS = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ: ΠΑΡΑΛΛΗΛΕΣ' : 'RELATIVE POSITIONS: PARALLEL',
    question: loc === 'el'
      ? `Δύο ευθείες στο ίδιο επίπεδο που <strong>δεν έχουν κανένα κοινό σημείο</strong> ονομάζονται:`
      : `Two lines in the same plane that <strong>have no common points</strong> are called:`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Παράλληλες ευθείες' : 'Parallel lines',
      [
        loc === 'el' ? 'Τεμνόμενες ευθείες' : 'Intersecting lines',
        loc === 'el' ? 'Κάθετες ευθείες' : 'Perpendicular lines',
        loc === 'el' ? 'Ταυτιζόμενες ευθείες' : 'Coincident lines'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Παράλληλες ευθείες' : 'Parallel lines',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ορισμός Παραλλήλων:' : 'Definition of Parallels:'}
        </div>
        <div>
          ${loc === 'el'
            ? 'Δύο ευθείες του ίδιου επιπέδου λέγονται παράλληλες (ε₁ // ε₂) όταν δεν έχουν κανένα κοινό σημείο, όσο κι αν προεκταθούν.'
            : 'Two lines in the same plane are called parallel (ε₁ // ε₂) when they have no common point, no matter how far they are extended.'}
        </div>
      </div>
    `
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ: ΤΕΜΝΟΜΕΝΕΣ' : 'RELATIVE POSITIONS: INTERSECTING',
    question: loc === 'el'
      ? `Πόσα κοινά σημεία έχουν δύο <strong>τεμνόμενες</strong> ευθείες στο επίπεδο;`
      : `How many points of intersection do two <strong>intersecting</strong> lines have in a plane?`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Ακριβώς 1 κοινό σημείο' : 'Exactly 1 common point',
      [
        loc === 'el' ? '2 κοινά σημεία' : '2 common points',
        loc === 'el' ? 'Άπειρα κοινά σημεία' : 'Infinitely many common points',
        loc === 'el' ? 'Κανένα κοινό σημείο' : 'No common points'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Ακριβώς 1 κοινό σημείο' : 'Exactly 1 common point',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? 'Δύο τεμνόμενες ευθείες συναντώνται σε <strong>ένα και μοναδικό σημείο</strong> (το σημείο τομής).' : 'Two intersecting lines meet at <strong>exactly one point</strong> (the point of intersection).'}</div>
      </div>
    `
  }),
  ...Array.from({ length: 8 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ: ΤΑΥΤΙΖΟΜΕΝΕΣ' : 'RELATIVE POSITIONS: COINCIDENT',
    question: loc === 'el'
      ? `Αν δύο ευθείες έχουν <strong>δύο διαφορετικά κοινά σημεία</strong> στο επίπεδο, τότε:`
      : `If two lines share <strong>two distinct points</strong> in a plane, then:`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Ταυτίζονται πλήρως (έχουν άπειρα κοινά σημεία)' : 'They are coincident (share infinitely many points)',
      [
        loc === 'el' ? 'Είναι παράλληλες' : 'They are parallel',
        loc === 'el' ? 'Είναι κάθετες' : 'They are perpendicular',
        loc === 'el' ? 'Τέμνονται υπό οξεία γωνία' : 'They intersect at an acute angle'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Ταυτίζονται πλήρως (έχουν άπειρα κοινά σημεία)' : 'They are coincident (share infinitely many points)',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? 'Από δύο σημεία διέρχεται μία και μοναδική ευθεία. Άρα οι δύο ευθείες ταυτίζονται πλήρως.' : 'Through two distinct points passes exactly one line. Therefore, the two lines coincide completely.'}</div>
      </div>
    `
  }))
];

// Θέση 2: Απόσταση Παράλληλων Ευθειών (Input)
const POOL_2_PARALLEL_DISTANCE = Array.from({ length: 10 }, (_, i) => (loc) => {
  const dist = 6 + i;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ' : 'DISTANCE OF PARALLELS',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες ε₁ // ε₂ απέχουν σε ένα σημείο απόσταση <strong>${dist} cm</strong>. Ποιο είναι το μήκος ενός άλλου κάθετου τμήματος ανάμεσα στις δύο ευθείες σε cm;`
      : `Two parallel lines ε₁ // ε₂ are separated by a distance of <strong>${dist} cm</strong> at one point. What is the length of another perpendicular segment between the lines in cm?`,
    correctAnswer: String(dist),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Σταθερό Πλάτος Παραλλήλων:' : 'Constant Width of Parallels:'}
        </div>
        <div>
          ${loc === 'el'
            ? `Η απόσταση μεταξύ δύο παράλληλων ευθειών είναι σταθερή σε όλο το μήκος τους. Επομένως, ισούται ακριβώς με <strong>${dist} cm</strong>.`
            : `The distance between two parallel lines remains constant everywhere. Therefore, it is exactly <strong>${dist} cm</strong>.`}
        </div>
      </div>
    `
  };
});

// Θέση 3: Γωνίες Εντός Εναλλάξ (Input)
const POOL_3_ALT_INTERIOR_INPUT = Array.from({ length: 10 }, (_, i) => (loc) => {
  const angle = 42 + i * 3; // 42, 45, 48, ...
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΕΝΤΟΣ ΕΝΑΛΛΑΞ ΓΩΝΙΕΣ' : 'ALTERNATE INTERIOR ANGLES',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες ε₁ // ε₂ τέμνονται από τρίτη ευθεία ε₃. Αν μία από τις εσωτερικές γωνίες είναι <strong>${angle}°</strong>, πόσο είναι το μέτρο της <strong>εντός εναλλάξ</strong> γωνίας της σε μοίρες;`
      : `Two parallel lines ε₁ // ε₂ are intersected by a transversal ε₃. If one interior angle is <strong>${angle}°</strong>, what is the measure of its <strong>alternate interior</strong> angle in degrees?`,
    correctAnswer: String(angle),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Ιδιότητα Παραλλήλων: Εντός Εναλλάξ ＝ Ίσες' : 'Parallel Property: Alternate Interior ＝ Equal'}
        </div>
        <div>
          ${loc === 'el'
            ? `Όταν δύο παράλληλες τέμνονται από τρίτη, οι εντός εναλλάξ γωνίες (σχήμα "Ζ") είναι <strong>πάντα ίσες</strong>. Άρα η γωνία είναι <strong>${angle}°</strong>.`
            : `When two parallel lines are cut by a transversal, alternate interior angles ("Z" shape) are <strong>always equal</strong>. Thus, the angle is <strong>${angle}°</strong>.`}
        </div>
      </div>
    `
  };
});

// Θέση 4: Γωνίες Εντός, Εκτός και Επί τα Αυτά (Input)
const POOL_4_CORRESPONDING_INPUT = Array.from({ length: 10 }, (_, i) => (loc) => {
  const angle = 54 + i * 2; // 54, 56, 58, ...
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΕΝΤΟΣ ΕΚΤΟΣ ΚΑΙ ΕΠΙ ΤΑ ΑΥΤΑ' : 'CORRESPONDING ANGLES',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες τέμνονται από μία τέμνουσα. Αν μία γωνία έχει μέτρο <strong>${angle}°</strong>, πόσο είναι το μέτρο της <strong>αντίστοιχης (εντός, εκτός και επί τα αυτά)</strong> γωνίας της σε μοίρες;`
      : `Two parallel lines are cut by a transversal. If one angle measures <strong>${angle}°</strong>, what is the measure of its <strong>corresponding</strong> angle in degrees?`,
    correctAnswer: String(angle),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Ιδιότητα Παραλλήλων: Εντός, Εκτός & Επί τα Αυτά ＝ Ίσες' : 'Parallel Property: Corresponding Angles ＝ Equal'}
        </div>
        <div>
          ${loc === 'el'
            ? `Οι αντίστοιχες γωνίες (σχήμα "F") δύο παράλληλων ευθειών που τέμνονται από τρίτη είναι <strong>πάντα ίσες</strong>: <strong>${angle}°</strong>.`
            : `Corresponding angles ("F" shape) formed by two parallel lines and a transversal are <strong>always equal</strong>: <strong>${angle}°</strong>.`}
        </div>
      </div>
    `
  };
});

// Θέση 5: Γωνίες Εντός και Επί τα Αυτά (Input)
const POOL_5_CONSECUTIVE_INTERIOR = Array.from({ length: 10 }, (_, i) => (loc) => {
  const angle1 = 48 + i * 4; // 48, 52, 56, ...
  const angle2 = 180 - angle1;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΕΝΤΟΣ ΚΑΙ ΕΠΙ ΤΑ ΑΥΤΑ' : 'CONSECUTIVE INTERIOR ANGLES',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες τέμνονται από τρίτη. Αν μία εσωτερική γωνία είναι <strong>${angle1}°</strong>, πόσο είναι το μέτρο της <strong>εντός και επί τα αυτά</strong> γωνίας της σε μοίρες;`
      : `Two parallel lines are cut by a transversal. If one interior angle is <strong>${angle1}°</strong>, what is the measure of its <strong>consecutive interior</strong> angle in degrees?`,
    correctAnswer: String(angle2),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Άθροισμα Εντός & Επί τα Αυτά ＝ 180°' : 'Sum of Consecutive Interior Angles ＝ 180°'}
        </div>
        <div>
          ${loc === 'el'
            ? `Οι γωνίες εντός και επί τα αυτά είναι παραπληρωματικές: 180° － ${angle1}° ＝ <strong>${angle2}°</strong>.`
            : `Consecutive interior angles are supplementary: 180° － ${angle1}° ＝ <strong>${angle2}°</strong>.`}
        </div>
      </div>
    `
  };
});

// Θέση 6: Αναγνώριση Σχήματος Ζευγών (MCQ)
const POOL_6_PAIR_SHAPE_MCQ = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΖΕΥΓΟΥΣ: ΣΧΗΜΑ Z' : 'PAIR RECOGNITION: SHAPE Z',
    question: loc === 'el'
      ? `Ποιο ζεύγος γωνιών δύο παράλληλων που τέμνονται από τρίτη ευθεία σχηματίζει χαρακτηριστικά το γράμμα <strong>«Ζ»</strong>;`
      : `Which pair of angles formed by two parallel lines and a transversal characteristically outlines the letter <strong>"Z"</strong>?`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Οι εντός εναλλάξ γωνίες' : 'Alternate interior angles',
      [
        loc === 'el' ? 'Οι εντός και επί τα αυτά γωνίες' : 'Consecutive interior angles',
        loc === 'el' ? 'Οι εντός, εκτός και επί τα αυτά γωνίες' : 'Corresponding angles',
        loc === 'el' ? 'Οι κατακορυφήν γωνίες' : 'Vertically opposite angles'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Οι εντός εναλλάξ γωνίες' : 'Alternate interior angles',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? 'Το σχήμα «Ζ» αντιστοιχεί στις <strong>εντός εναλλάξ</strong> γωνίες, οι οποίες είναι πάντοτε ίσες.' : 'The "Z" pattern corresponds to <strong>alternate interior</strong> angles, which are always equal.'}</div>
      </div>
    `
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΖΕΥΓΟΥΣ: ΣΧΗΜΑ F' : 'PAIR RECOGNITION: SHAPE F',
    question: loc === 'el'
      ? `Ποιο ζεύγος γωνιών δύο παράλληλων που τέμνονται από τρίτη ευθεία σχηματίζει χαρακτηριστικά το γράμμα <strong>«F»</strong>;`
      : `Which pair of angles formed by two parallel lines and a transversal characteristically outlines the letter <strong>"F"</strong>?`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Οι εντός, εκτός και επί τα αυτά (αντίστοιχες)' : 'Corresponding angles',
      [
        loc === 'el' ? 'Οι εντός εναλλάξ' : 'Alternate interior angles',
        loc === 'el' ? 'Οι εντός και επί τα αυτά' : 'Consecutive interior angles',
        loc === 'el' ? 'Οι παραπληρωματικές εφεξής' : 'Adjacent supplementary angles'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Οι εντός, εκτός και επί τα αυτά (αντίστοιχες)' : 'Corresponding angles',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? 'Το σχήμα «F» αντιστοιχεί στις <strong>εντός, εκτός και επί τα αυτά (αντίστοιχες)</strong> γωνίες, οι οποίες είναι ίσες.' : 'The "F" pattern corresponds to <strong>corresponding</strong> angles, which are equal.'}</div>
      </div>
    `
  }),
  ...Array.from({ length: 8 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΖΕΥΓΟΥΣ: ΣΧΗΜΑ C' : 'PAIR RECOGNITION: SHAPE C',
    question: loc === 'el'
      ? `Ποιο ζεύγος γωνιών δύο παράλληλων που τέμνονται από τρίτη ευθεία σχηματίζει χαρακτηριστικά το γράμμα <strong>«C» (ή «U»)</strong>;`
      : `Which pair of angles formed by two parallel lines and a transversal characteristically outlines the letter <strong>"C" (or "U")</strong>?`,
    options: makeUniqueOptions(
      loc === 'el' ? 'Οι εντός και επί τα αυτά γωνίες' : 'Consecutive interior angles',
      [
        loc === 'el' ? 'Οι εντός εναλλάξ γωνίες' : 'Alternate interior angles',
        loc === 'el' ? 'Οι εντός, εκτός και επί τα αυτά γωνίες' : 'Corresponding angles',
        loc === 'el' ? 'Οι κατακορυφήν γωνίες' : 'Vertically opposite angles'
      ]
    ),
    correctAnswer: loc === 'el' ? 'Οι εντός και επί τα αυτά γωνίες' : 'Consecutive interior angles',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? 'Το σχήμα «C» (ή «U») αντιστοιχεί στις <strong>εντός και επί τα αυτά</strong> γωνίες, οι οποίες έχουν άθροισμα 180°.' : 'The "C" (or "U") pattern corresponds to <strong>consecutive interior</strong> angles, whose sum is 180°.'}</div>
      </div>
    `
  }))
];

// Θέση 7: Γωνίες Εκτός Εναλλάξ (Input)
const POOL_7_ALT_EXTERIOR_INPUT = Array.from({ length: 10 }, (_, i) => (loc) => {
  const angle = 62 + i * 3; // 62, 65, 68, ...
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΕΚΤΟΣ ΕΝΑΛΛΑΞ ΓΩΝΙΕΣ' : 'ALTERNATE EXTERIOR ANGLES',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες τέμνονται από τρίτη. Αν μία εξωτερική γωνία είναι <strong>${angle}°</strong>, πόσο είναι το μέτρο της <strong>εκτός εναλλάξ</strong> γωνίας της σε μοίρες;`
      : `Two parallel lines are cut by a transversal. If one exterior angle is <strong>${angle}°</strong>, what is the measure of its <strong>alternate exterior</strong> angle in degrees?`,
    correctAnswer: String(angle),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? `Οι εκτός εναλλάξ γωνίες δύο παραλλήλων είναι <strong>ίσες μεταξύ τους</strong>: <strong>${angle}°</strong>.` : `Alternate exterior angles of parallel lines are <strong>equal to each other</strong>: <strong>${angle}°</strong>.`}</div>
      </div>
    `
  };
});

// Θέση 8: Γωνίες Εκτός και Επί τα Αυτά (Input)
const POOL_8_CONSECUTIVE_EXTERIOR = Array.from({ length: 10 }, (_, i) => (loc) => {
  const a = 55 + i * 2; // 55, 57, 59, ...
  const b = 180 - a;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΕΚΤΟΣ ΚΑΙ ΕΠΙ ΤΑ ΑΥΤΑ' : 'CONSECUTIVE EXTERIOR ANGLES',
    question: loc === 'el'
      ? `Δύο παράλληλες ευθείες τέμνονται από τρίτη. Αν μία εξωτερική γωνία έχει μέτρο <strong>${a}°</strong>, ποιο είναι το μέτρο της <strong>εκτός και επί τα αυτά</strong> γωνίας της σε μοίρες;`
      : `Two parallel lines are cut by a transversal. If one exterior angle measures <strong>${a}°</strong>, what is the measure of its <strong>consecutive exterior</strong> angle in degrees?`,
    correctAnswer: String(b),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${loc === 'el' ? `Οι γωνίες εκτός και επί τα αυτά είναι παραπληρωματικές: 180° － ${a}° ＝ <strong>${b}°</strong>.` : `Consecutive exterior angles are supplementary: 180° － ${a}° ＝ <strong>${b}°</strong>.`}</div>
      </div>
    `
  };
});

// Θέση 9: Κριτήριο Παραλληλίας (MCQ)
const POOL_9_PARALLEL_CRITERIA_MCQ = Array.from({ length: 10 }, (_, i) => (loc) => {
  const ang1 = 65 + (i % 5) * 5;
  const isParallel = i % 2 === 0;
  const ang2 = isParallel ? ang1 : ang1 + 8;
  const correct = isParallel ? (loc === 'el' ? 'Ναι, είναι παράλληλες' : 'Yes, they are parallel') : (loc === 'el' ? 'Όχι, δεν είναι παράλληλες' : 'No, they are not parallel');
  return {
    type: 'mcq',
    topic: loc === 'el' ? 'ΚΡΙΤΗΡΙΟ ΠΑΡΑΛΛΗΛΙΑΣ' : 'PARALLELISM CRITERION',
    question: loc === 'el'
      ? `Δύο ευθείες ε₁ και ε₂ τέμνονται από μία τρίτη ευθεία και σχηματίζουν δύο γωνίες εντός εναλλάξ με μέτρα <strong>${ang1}°</strong> και <strong>${ang2}°</strong>. Είναι οι ευθείες ε₁ και ε₂ παράλληλες;`
      : `Two lines ε₁ and ε₂ are cut by a transversal forming two alternate interior angles measuring <strong>${ang1}°</strong> and <strong>${ang2}°</strong>. Are lines ε₁ and ε₂ parallel?`,
    options: makeUniqueOptions(correct, [
      isParallel ? (loc === 'el' ? 'Όχι, δεν είναι παράλληλες' : 'No, they are not parallel') : (loc === 'el' ? 'Ναι, είναι παράλληλες' : 'Yes, they are parallel'),
      loc === 'el' ? 'Είναι πάντοτε κάθετες' : 'They are always perpendicular',
      loc === 'el' ? 'Δεν μπορούμε να γνωρίζουμε' : 'Cannot be determined'
    ]),
    correctAnswer: correct,
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Κριτήριο Παραλληλίας:' : 'Criterion for Parallel Lines:'}
        </div>
        <div>
          ${loc === 'el'
            ? isParallel
              ? `Επειδή οι εντός εναλλάξ γωνίες είναι ίσες (${ang1}° ＝ ${ang2}°), οι ευθείες <strong>είναι παράλληλες</strong>.`
              : `Επειδή οι εντός εναλλάξ γωνίες δεν είναι ίσες (${ang1}° ≠ ${ang2}°), οι ευθείες <strong>δεν είναι παράλληλες</strong>.`
            : isParallel
              ? `Since alternate interior angles are equal (${ang1}° ＝ ${ang2}°), the lines <strong>are parallel</strong>.`
              : `Since alternate interior angles are not equal (${ang1}° ≠ ${ang2}°), the lines <strong>are not parallel</strong>.`}
        </div>
      </div>
    `
  };
});

// Θέση 10: Υπολογισμός Αμβλείας από Οξεία (Input)
const POOL_10_ACUTE_TO_OBTUSE = Array.from({ length: 10 }, (_, i) => (loc) => {
  const acute = 38 + i * 4; // 38, 42, 46, ...
  const obtuse = 180 - acute;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ 8 ΓΩΝΙΩΝ' : 'CALCULATION OF 8 ANGLES',
    question: loc === 'el'
      ? `Σε δύο παράλληλες που τέμνονται από τρίτη, μία από τις 8 γωνίες είναι οξεία και ισούται με <strong>${acute}°</strong>. Πόσο είναι το μέτρο καθεμιάς από τις <strong>αμβλείες γωνίες</strong> σε μοίρες;`
      : `In two parallel lines cut by a transversal, one of the 8 angles is acute measuring <strong>${acute}°</strong>. What is the measure of each of the <strong>obtuse angles</strong> in degrees?`,
    correctAnswer: String(obtuse),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>
          Κάθε οξεία και κάθε αμβλεία γωνία στις παράλληλες με τέμνουσα είναι παραπληρωματικές: 180° － ${acute}° ＝ <strong>${obtuse}°</strong>.
        </div>
      </div>
    `
  };
});

// Θέση 11: Ρεαλιστικό Πρόβλημα - Μεταλλικό Ζεύκτο / Δικτύωμα (Input)
const POOL_11_REAL_TRUSS_PROBLEM = Array.from({ length: 10 }, (_, i) => (loc) => {
  const angle = 46 + i * 3;
  const supp = 180 - angle;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΛΛΙΚΟ ΖΕΥΚΤΟ' : 'PROBLEMS: STEEL TRUSS',
    question: loc === 'el'
      ? `Σε ένα μεταλλικό δικτύωμα γέφυρας δύο οριζόντιες δοκοί είναι παράλληλες (ε₁ // ε₂) και συνδέονται με μία λοξή δοκό στήριξης. Αν η οξεία γωνία στήριξης στην κάτω δοκό είναι <strong>${angle}°</strong>, πόσο είναι η αμβλεία γωνία (εντός και επί τα αυτά) στην πάνω δοκό σε μοίρες;`
      : `In a steel bridge truss, two horizontal beams are parallel (ε₁ // ε₂) and connected by an inclined brace. If the acute bracing angle on the lower beam is <strong>${angle}°</strong>, what is the obtuse angle (consecutive interior) on the upper beam in degrees?`,
    correctAnswer: String(supp),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Εντός και επί τα αυτά γωνίες' : 'Consecutive interior angles'}
        </div>
        <div>
          180° － ${angle}° ＝ <strong>${supp}°</strong>.
        </div>
      </div>
    `
  };
});

// Θέση 12: Ρεαλιστικό Πρόβλημα - Ευθυγράμμιση Βάσεων με Γωνίες (Input)
const POOL_12_REAL_ALIGNMENT = Array.from({ length: 10 }, (_, i) => (loc) => {
  const targetAngle = 58 + i * 2;
  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΥΘΥΓΡΑΜΜΙΣΗ' : 'PROBLEMS: ALIGNMENT',
    question: loc === 'el'
      ? `Ένας μηχανικός ρυθμίζει δύο γραμμές φωτοβολταϊκών πλαισίων ε₁ και ε₂ ώστε να είναι απόλυτα παράλληλες. Μια ευθεία οδηγός τέμνει την πρώτη γραμμή σχηματίζοντας γωνία <strong>${targetAngle}°</strong>. Σε πόσες μοίρες πρέπει να ρυθμιστεί η <strong>εντός εναλλάξ</strong> γωνία στη δεύτερη γραμμή ώστε να εξασφαλιστεί η παραλληλία;`
      : `An engineer aligns two rows of solar panels ε₁ and ε₂ to be strictly parallel. A guide line intersects the first row forming an angle of <strong>${targetAngle}°</strong>. At how many degrees must the <strong>alternate interior</strong> angle on the second row be set to ensure parallelism?`,
    correctAnswer: String(targetAngle),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Κριτήριο Παραλληλίας Εντός Εναλλάξ' : 'Alternate Interior Parallelism Criterion'}
        </div>
        <div>
          ${loc === 'el'
            ? `Για να είναι οι γραμμές παράλληλες, οι εντός εναλλάξ γωνίες πρέπει να είναι αυστηρά ίσες: <strong>${targetAngle}°</strong>.`
            : `For the rows to be parallel, alternate interior angles must be strictly equal: <strong>${targetAngle}°</strong>.`}
        </div>
      </div>
    `
  };
});

// Συγκέντρωση των 12 Pools
const POOLS = [
  POOL_1_REL_POSITIONS,
  POOL_2_PARALLEL_DISTANCE,
  POOL_3_ALT_INTERIOR_INPUT,
  POOL_4_CORRESPONDING_INPUT,
  POOL_5_CONSECUTIVE_INTERIOR,
  POOL_6_PAIR_SHAPE_MCQ,
  POOL_7_ALT_EXTERIOR_INPUT,
  POOL_8_CONSECUTIVE_EXTERIOR,
  POOL_9_PARALLEL_CRITERIA_MCQ,
  POOL_10_ACUTE_TO_OBTUSE,
  POOL_11_REAL_TRUSS_PROBLEM,
  POOL_12_REAL_ALIGNMENT
];

export default function TheseisEutheionAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 12 ασκήσεων (μία τυχαία επιλογή από κάθε δεξαμενή)
  const generateQuestions = () => {
    const selected = POOLS.map((pool, idx) => {
      const randomGen = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: idx + 1,
        ...randomGen(locale)
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
    e.preventDefault();
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

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  // i18n Strings UI
  const ui = {
    el: {
      pageTitle: "Ασκήσεις: Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων | Α' Γυμνασίου",
      pageDesc: "12 επιλεγμένες ασκήσεις σε παράλληλες ευθείες, απόσταση παραλλήλων, εντός εναλλάξ, αντίστοιχες και εντός επί τα αυτά γωνίες για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΩΜΕΤΡΙΑ • ΕΞΑΣΚΗΣΗ",
      title: "Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων: Ασκήσεις",
      subtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις στις παράλληλες ευθείες, στα ζεύγη γωνιών και στα κριτήρια παραλληλίας. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ».",
      checkBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      newBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      placeholder: "Γράψε την απάντηση...",
      finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
      progress: "ΠΡΟΟΔΟΣ",
      success: "ΕΠΙΤΥΧΙΑ",
      retry: "ΕΠΑΝΑΛΗΨΗ",
      correctLabel: "ΣΩΣΤΟ",
      wrongLabel: "ΛΑΘΟΣ",
      correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
      problemBadge: "ΠΡΟΒΛΗΜΑ"
    },
    en: {
      pageTitle: "Exercises: Lines Relative Positions & Parallel Angles | Grade 7",
      pageDesc: "12 selected exercises on parallel lines, distance between parallels, alternate interior, corresponding, and consecutive interior angles for Grade 7.",
      backText: "Grade 7",
      btnTheory: "THEORY",
      badge: "GRADE 7 • GEOMETRY • PRACTICE",
      title: "Lines Relative Positions & Parallel Angles: Exercises",
      subtitle: "Solve the 12 selected exercises on parallel lines, angle pairs, and parallelism criteria. Click 'CHECK ANSWERS' when finished.",
      checkBtn: "CHECK ANSWERS",
      newBtn: "NEW EXERCISES",
      placeholder: "Type your answer...",
      finalScore: "FINAL SCORE",
      progress: "PROGRESS",
      success: "SUCCESS",
      retry: "RETRY",
      correctLabel: "CORRECT",
      wrongLabel: "INCORRECT",
      correctAnswerLabel: "CORRECT ANSWER:",
      problemBadge: "PROBLEM"
    }
  }[locale] || {
    pageTitle: "Ασκήσεις: Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων | Α' Γυμνασίου",
    pageDesc: "12 επιλεγμένες ασκήσεις σε παράλληλες ευθείες, απόσταση παραλλήλων, εντός εναλλάξ, αντίστοιχες και εντός επί τα αυτά γωνίες για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΩΜΕΤΡΙΑ • ΕΞΑΣΚΗΣΗ",
    title: "Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων: Ασκήσεις",
    subtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις στις παράλληλες ευθείες, στα ζεύγη γωνιών και στα κριτήρια παραλληλίας. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ».",
    checkBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    newBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    placeholder: "Γράψε την απάντηση...",
    finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progress: "ΠΡΟΟΔΟΣ",
    success: "ΕΠΙΤΥΧΙΑ",
    retry: "ΕΠΑΝΑΛΗΨΗ",
    correctLabel: "ΣΩΣΤΟ",
    wrongLabel: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    problemBadge: "ΠΡΟΒΛΗΜΑ"
  };

  return (
    <Layout
      title={ui.pageTitle}
      description={ui.pageDesc}
      backUrl="/a-gymnasiou"
      backText={ui.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/38-theseis-eutheion"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>{toCleanUppercase(ui.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8 overflow-x-hidden">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(ui.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {ui.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words">
              {ui.subtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
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

              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isProblem ? 'border-amber-200 bg-amber-50/15' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            {ui.problemBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder={ui.placeholder}
                          value={userAns}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] p-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="ml-2 shrink-0">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Αναλυτική Λύση (No-Giveaway) */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{ui.correctLabel}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{ui.wrongLabel}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              {ui.correctAnswerLabel}&nbsp;&nbsp;<span className="text-emerald-700 font-black" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
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

          {/* Κουμπιά Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(ui.checkBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(ui.newBtn)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? ui.finalScore : ui.progress}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {ui.success}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(ui.newBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(ui.checkBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(ui.retry)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
