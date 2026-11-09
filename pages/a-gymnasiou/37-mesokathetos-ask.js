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
      const unit = String(correct).includes('cm') ? ' cm' : String(correct).includes('°') ? '°' : '';
      unique.add(`${numVal + count * 5}${unit}`);
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
    pageTitle: "Ασκήσεις: Μεσοκάθετος, Αποστάσεις & Τρίγωνα | Α' Γυμνασίου",
    pageDesc:
      "12 δυναμικές ασκήσεις και προβλήματα σε μεσοκάθετο, απόσταση σημείου από ευθεία, διχοτόμο, ισοσκελές και ισόπλευρο τρίγωνο.",
    navGrade: "Α' Γυμνασίου",
    btnTheory: 'ΘΕΩΡΙΑ',
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 03 • ΕΞΑΣΚΗΣΗ",
    title: 'Μεσοκάθετος, Αποστάσεις & Τρίγωνα: Ασκήσεις',
    subtitle:
      'Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις στη μεσοκάθετο, στις αποστάσεις, στη διχοτόμο και στα τρίγωνα. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ».',
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
    pageTitle: 'Exercises: Perpendicular Bisector, Distances & Triangles | Grade 7',
    pageDesc:
      '12 dynamic exercises and problems on perpendicular bisector, point-to-line distance, bisector property, isosceles and equilateral triangles.',
    navGrade: 'Grade 7',
    btnTheory: 'THEORY',
    badge: 'GRADE 7 • GEOMETRY CHAPTER 03 • PRACTICE',
    title: 'Perpendicular Bisector, Distances & Triangles: Exercises',
    subtitle:
      'Solve the 12 selected exercises on perpendicular bisectors, distances, angle bisectors, and triangles. Click "CHECK ANSWERS" when finished.',
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
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ ΓΙΑ ΤΗ ΜΕΣΟΚΑΘΕΤΟ, ΑΠΟΣΤΑΣΕΙΣ & ΤΡΙΓΩΝΑ (i18n)
// ============================================================================

// Θέση 1: Ορισμός Μεσοκαθέτου (MCQ)
const POOL_1_MESOKATHETOS_DEF = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΜΕΣΟΚΑΘΕΤΟΣ: ΟΡΙΣΜΟΣ' : 'PERPENDICULAR BISECTOR: DEFINITION',
    question:
      loc === 'el'
        ? 'Ποια ευθεία ονομάζεται <strong>μεσοκάθετος</strong> ενός ευθύγραμμου τμήματος ΑΒ;'
        : 'Which line is called the <strong>perpendicular bisector</strong> of a line segment AB?',
    options: makeUniqueOptions(
      loc === 'el'
        ? 'Η ευθεία που είναι κάθετη στο ΑΒ και διέρχεται από το μέσο του'
        : 'The line perpendicular to AB passing through its midpoint',
      [
        loc === 'el' ? 'Οποιαδήποτε ευθεία περνά από το μέσο του ΑΒ' : 'Any line passing through the midpoint of AB',
        loc === 'el' ? 'Η ευθεία που ενώνει το Α με το Β' : 'The straight line connecting A and B',
        loc === 'el' ? 'Η ευθεία που είναι παράλληλη στο ΑΒ' : 'The line parallel to AB',
      ]
    ),
    correctAnswer:
      loc === 'el'
        ? 'Η ευθεία που είναι κάθετη στο ΑΒ και διέρχεται από το μέσο του'
        : 'The line perpendicular to AB passing through its midpoint',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ορισμός:' : 'Definition:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? 'Η μεσοκάθετος ενός τμήματος ΑΒ συνδυάζει δύο ιδιότητες: διέρχεται από το <strong>μέσο</strong> του τμήματος και είναι <strong>κάθετη</strong> σε αυτό (γωνία 90°).'
              : 'The perpendicular bisector of segment AB combines two properties: it passes through its <strong>midpoint</strong> and is <strong>perpendicular</strong> to it (90° angle).'
          }
        </div>
      </div>
    `,
  }),
  ...Array.from({ length: 9 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΜΕΣΟΚΑΘΕΤΟΣ: ΙΔΙΟΤΗΤΕΣ' : 'PERPENDICULAR BISECTOR: PROPERTIES',
    question:
      loc === 'el'
        ? 'Αν μια ευθεία ε τέμνει ένα ευθύγραμμο τμήμα ΑΒ κάθετα αλλά <strong>όχι στο μέσο του</strong>, είναι μεσοκάθετος;'
        : 'If a line l intersects a line segment AB perpendicularly but <strong>not at its midpoint</strong>, is it a perpendicular bisector?',
    options: makeUniqueOptions(
      loc === 'el'
        ? 'Όχι, πρέπει οπωσδήποτε να διέρχεται και από το μέσο'
        : 'No, it must also pass through the midpoint',
      [
        loc === 'el' ? 'Ναι, αρκεί μόνο να είναι κάθετη' : 'Yes, being perpendicular is sufficient',
        loc === 'el' ? 'Ναι, αν το τμήμα είναι μεγαλύτερο από 10 cm' : 'Yes, if the segment is longer than 10 cm',
        loc === 'el' ? 'Εξαρτάται από τη θέση των άκρων' : 'It depends on the position of the endpoints',
      ]
    ),
    correctAnswer:
      loc === 'el'
        ? 'Όχι, πρέπει οπωσδήποτε να διέρχεται και από το μέσο'
        : 'No, it must also pass through the midpoint',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Για να είναι μεσοκάθετος πρέπει να ικανοποιεί <strong>και τις δύο συνθήκες ταυτόχρονα</strong>: να είναι κάθετη και να περνά από το μέσο.'
            : 'To be a perpendicular bisector, both conditions must be satisfied simultaneously: perpendicular and passing through the midpoint.'
        }</div>
      </div>
    `,
  })),
];

// Θέση 2: Χαρακτηριστική Ιδιότητα Μεσοκαθέτου (Input)
const POOL_2_MESOKATHETOS_PROPERTY = Array.from({ length: 10 }, (_, i) => (loc) => {
  const dist = 7 + i * 2; // 7, 9, 11, ... cm
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΧΑΡΑΚΤΗΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ ΜΕΣΟΚΑΘΕΤΟΥ' : 'PROPERTY OF PERPENDICULAR BISECTOR',
    question:
      loc === 'el'
        ? `Το σημείο Μ ανήκει στη μεσοκάθετο του ευθύγραμμου τμήματος ΑΒ. Αν η απόσταση <strong>ΜΑ ＝ ${numFmt(dist)} cm</strong>, ποιο είναι το μήκος της απόστασης <strong>ΜΒ</strong> σε cm;`
        : `Point M lies on the perpendicular bisector of segment AB. If <strong>MA ＝ ${numFmt(dist)} cm</strong>, what is the length of <strong>MB</strong> in cm?`,
    correctAnswer: String(dist),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Χαρακτηριστική Ιδιότητα: ΜΑ ＝ ΜΒ' : 'Characteristic Property: MA ＝ MB'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Κάθε σημείο της μεσοκαθέτου ισαπέχει από τα άκρα του τμήματος. Επομένως, ΜΒ ＝ ΜΑ ＝ <strong>${numFmt(dist)} cm</strong>.`
              : `Every point on the perpendicular bisector is equidistant from the segment endpoints. Thus, MB ＝ MA ＝ <strong>${numFmt(dist)} cm</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 3: Απόσταση Σημείου από Ευθεία (MCQ)
const POOL_3_POINT_TO_LINE = Array.from({ length: 10 }, (_, i) => (loc) => {
  const perp = 6 + i;
  const oblique = perp + 2 + (i % 4);
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'mcq',
    topic: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ' : 'DISTANCE FROM POINT TO LINE',
    question:
      loc === 'el'
        ? `Από ένα σημείο Α φέρνουμε το κάθετο τμήμα <strong>ΑΗ ＝ ${numFmt(perp)} cm</strong> προς μια ευθεία ε και ένα πλάγιο τμήμα <strong>ΑΒ ＝ ${numFmt(oblique)} cm</strong>. Ποια είναι η πραγματική <strong>απόσταση</strong> του σημείου Α από την ευθεία ε;`
        : `From a point A, perpendicular segment <strong>AH ＝ ${numFmt(perp)} cm</strong> is drawn to line l, along with an oblique segment <strong>AB ＝ ${numFmt(oblique)} cm</strong>. What is the true <strong>distance</strong> from point A to line l?`,
    options: makeUniqueOptions(
      `${numFmt(perp)} cm`,
      [`${numFmt(oblique)} cm`, `${numFmt(perp + oblique)} cm`, `${numFmt(oblique - perp + 2)} cm`]
    ),
    correctAnswer: `${numFmt(perp)} cm`,
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ορισμός Απόστασης:' : 'Definition of Distance:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Απόσταση σημείου από ευθεία ονομάζεται το μήκος του <strong>κάθετου τμήματος</strong> ΑΗ (το οποίο είναι και το συντομότερο). Άρα η απόσταση είναι <strong>${numFmt(perp)} cm</strong>.`
              : `The distance of a point from a line is the length of the <strong>perpendicular segment</strong> AH (which is the shortest path). Thus, the distance is <strong>${numFmt(perp)} cm</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 4: Απόσταση Παράλληλων Ευθειών (Input)
const POOL_4_PARALLEL_DIST = Array.from({ length: 10 }, (_, i) => (loc) => {
  const dist = 5 + i * 1.5;
  const numFmt = (n) =>
    Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: Number.isInteger(n) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  const distStr = numFmt(dist);

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ' : 'DISTANCE BETWEEN PARALLELS',
    question:
      loc === 'el'
        ? `Δύο παράλληλες ευθείες ε₁ και ε₂ απέχουν σε ένα σημείο τους απόσταση <strong>${distStr} cm</strong>. Πόση είναι η απόστασή τους σε οποιοδήποτε άλλο σημείο τους σε cm;`
        : `Two parallel lines l₁ and l₂ are <strong>${distStr} cm</strong> apart at one point. What is the distance between them at any other point in cm?`,
    correctAnswer: String(dist),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          ${loc === 'el' ? 'Ιδιότητα Παραλλήλων:' : 'Parallel Lines Property:'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Η απόσταση μεταξύ δύο παράλληλων ευθειών παραμένει <strong>σταθερή παντού</strong>. Επομένως, είναι πάντα <strong>${distStr} cm</strong>.`
              : `The distance between two parallel lines remains <strong>constant everywhere</strong>. Hence, it is always <strong>${distStr} cm</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 5: Ιδιότητα Διχοτόμου Γωνίας (Input)
const POOL_5_BISECTOR_PROPERTY = Array.from({ length: 10 }, (_, i) => (loc) => {
  const d = 4 + i; // 4, 5, 6, ... cm
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΙΔΙΟΤΗΤΑ ΔΙΧΟΤΟΜΟΥ ΓΩΝΙΑΣ' : 'ANGLE BISECTOR PROPERTY',
    question:
      loc === 'el'
        ? `Ένα σημείο Σ ανήκει στη διχοτόμο της γωνίας xÔy. Αν η κάθετη απόσταση του Σ από την πλευρά Ox είναι <strong>${numFmt(d)} cm</strong>, ποια είναι η κάθετη απόσταση του Σ από την άλλη πλευρά Oy σε cm;`
        : `A point P lies on the bisector of angle xÔy. If the perpendicular distance of P from side Ox is <strong>${numFmt(d)} cm</strong>, what is its perpendicular distance from side Oy in cm?`,
    correctAnswer: String(d),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Θεώρημα Διχοτόμου: d(Σ, Ox) ＝ d(Σ, Oy)' : 'Bisector Theorem: d(P, Ox) ＝ d(P, Oy)'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Κάθε σημείο της διχοτόμου μιας γωνίας <strong>ισαπέχει από τις πλευρές της</strong>. Άρα η απόσταση είναι <strong>${numFmt(d)} cm</strong>.`
              : `Every point on the bisector of an angle is <strong>equidistant from its sides</strong>. Therefore, the distance is <strong>${numFmt(d)} cm</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 6: Γωνίες Βάσης Ισοσκελούς Τριγώνου (Input)
const POOL_6_ISOSCELES_BASE = Array.from({ length: 10 }, (_, i) => (loc) => {
  const vertex = 30 + i * 6; // 30, 36, 42, ..., 84°
  const base = (180 - vertex) / 2;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ: ΓΩΝΙΕΣ ΒΑΣΗΣ' : 'ISOSCELES: BASE ANGLES',
    question:
      loc === 'el'
        ? `Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), η γωνία κορυφής είναι <strong>Â ＝ ${numFmt(vertex)}°</strong>. Πόσο είναι το μέτρο καθεμιάς από τις <strong>γωνίες της βάσης (Β̂ και Γ̂)</strong> σε μοίρες;`
        : `In an isosceles triangle ABC (AB ＝ AC), vertex angle <strong>Â ＝ ${numFmt(vertex)}°</strong>. What is the measure of each <strong>base angle (B̂ and Ĉ)</strong> in degrees?`,
    correctAnswer: String(base),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Â ＋ 2 · Β̂ ＝ 180° ➔ Β̂ ＝ ${fracHtml('180° － Â', 2)}
        </div>
        <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
          <span>${loc === 'el' ? 'Β̂ ＝ Γ̂ ＝ ' : 'B̂ ＝ Ĉ ＝ '}</span>
          ${fracHtml(`180° － ${numFmt(vertex)}°`, 2)}
          <span> ＝ </span>
          ${fracHtml(`${numFmt(180 - vertex)}°`, 2)}
          <span> ＝ <strong>${numFmt(base)}°</strong>.</span>
        </div>
      </div>
    `,
  };
});

// Θέση 7: Γωνία Κορυφής Ισοσκελούς Τριγώνου (Input)
const POOL_7_ISOSCELES_VERTEX = Array.from({ length: 10 }, (_, i) => (loc) => {
  const base = 50 + i * 2; // 50, 52, 54, ..., 68°
  const vertex = 180 - 2 * base;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ: ΓΩΝΙΑ ΚΟΡΥΦΗΣ' : 'ISOSCELES: VERTEX ANGLE',
    question:
      loc === 'el'
        ? `Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), καθεμία από τις γωνίες της βάσης είναι <strong>${numFmt(base)}°</strong>. Πόσο είναι το μέτρο της <strong>γωνίας κορυφής Â</strong> σε μοίρες;`
        : `In an isosceles triangle ABC (AB ＝ AC), each base angle measures <strong>${numFmt(base)}°</strong>. What is the measure of the <strong>vertex angle Â</strong> in degrees?`,
    correctAnswer: String(vertex),
    solution: `
      <div class="space-y-2 leading-loose">
        <div>
          ${
            loc === 'el'
              ? `Το άθροισμα των γωνιών ενός τριγώνου είναι 180°: Â ＝ 180° － 2 · ${numFmt(base)}° ＝ 180° － ${numFmt(2 * base)}° ＝ <strong>${numFmt(vertex)}°</strong>.`
              : `The sum of angles in a triangle is 180°: Â ＝ 180° － 2 · ${numFmt(base)}° ＝ 180° － ${numFmt(2 * base)}° ＝ <strong>${numFmt(vertex)}°</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 8: Ιδιότητες Ισόπλευρου Τριγώνου (MCQ)
const POOL_8_EQUILATERAL_PROPERTIES = [
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ: ΓΩΝΙΕΣ' : 'EQUILATERAL TRIANGLE: ANGLES',
    question:
      loc === 'el'
        ? 'Πόσες μοίρες είναι καθεμία από τις γωνίες ενός <strong>ισόπλευρου τριγώνου</strong>;'
        : 'How many degrees is each angle of an <strong>equilateral triangle</strong>?',
    options: makeUniqueOptions('60°', ['90°', '45°', '180°']),
    correctAnswer: '60°',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
          <span>${
            loc === 'el'
              ? 'Στο ισόπλευρο τρίγωνο και οι 3 γωνίες είναι ίσες: '
              : 'In an equilateral triangle, all 3 angles are equal: '
          }</span>
          ${fracHtml('180°', 3)}
          <span> ＝ <strong>60°</strong>.</span>
        </div>
      </div>
    `,
  }),
  (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ: ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ' : 'EQUILATERAL: AXES OF SYMMETRY',
    question:
      loc === 'el'
        ? 'Πόσους <strong>άξονες συμμετρίας</strong> έχει ένα ισόπλευρο τρίγωνο;'
        : 'How many <strong>axes of symmetry</strong> does an equilateral triangle have?',
    options: makeUniqueOptions(
      loc === 'el' ? '3 άξονες συμμετρίας' : '3 axes of symmetry',
      loc === 'el'
        ? ['1 άξονα συμμετρίας', '2 άξονες συμμετρίας', 'Κανέναν άξονα συμμετρίας']
        : ['1 axis of symmetry', '2 axes of symmetry', 'No axis of symmetry']
    ),
    correctAnswer: loc === 'el' ? '3 άξονες συμμετρίας' : '3 axes of symmetry',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Το ισόπλευρο τρίγωνο έχει <strong>3 άξονες συμμετρίας</strong> (τις 3 μεσοκαθέτους των πλευρών του).'
            : 'An equilateral triangle has <strong>3 axes of symmetry</strong> (the perpendicular bisectors of its sides).'
        }</div>
      </div>
    `,
  }),
  ...Array.from({ length: 8 }, (_, i) => (loc) => ({
    type: 'mcq',
    topic: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ: ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ' : 'ISOSCELES: AXES OF SYMMETRY',
    question:
      loc === 'el'
        ? 'Πόσους <strong>άξονες συμμετρίας</strong> έχει ένα ισοσκελές (μη ισόπλευρο) τρίγωνο;'
        : 'How many <strong>axes of symmetry</strong> does an isosceles (non-equilateral) triangle have?',
    options: makeUniqueOptions(
      loc === 'el' ? '1 άξονα συμμετρίας' : '1 axis of symmetry',
      loc === 'el'
        ? ['2 άξονες συμμετρίας', '3 άξονες συμμετρίας', 'Άπειρους άξονες συμμετρίας']
        : ['2 axes of symmetry', '3 axes of symmetry', 'Infinitely many axes']
    ),
    correctAnswer: loc === 'el' ? '1 άξονα συμμετρίας' : '1 axis of symmetry',
    solution: `
      <div class="space-y-2 leading-loose">
        <div>${
          loc === 'el'
            ? 'Το ισοσκελές τρίγωνο έχει ακριβώς <strong>1 άξονα συμμετρίας</strong>, ο οποίος είναι η μεσοκάθετος της βάσης του.'
            : 'An isosceles triangle has exactly <strong>1 axis of symmetry</strong>, which is the perpendicular bisector of its base.'
        }</div>
      </div>
    `,
  })),
];

// Θέση 9: Ταύτιση Γραμμών στο Ισοσκελές (MCQ)
const POOL_9_ISOSCELES_LINES = Array.from({ length: 10 }, (_, i) => (loc) => ({
  type: 'mcq',
  topic: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ: ΕΙΔΙΚΕΣ ΕΥΘΕΙΕΣ' : 'ISOSCELES: SPECIAL LINES',
  question:
    loc === 'el'
      ? 'Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), η <strong>διχοτόμος</strong> της γωνίας κορυφής Â είναι ταυτόχρονα:'
      : 'In an isosceles triangle ABC (AB ＝ AC), the <strong>bisector</strong> of vertex angle Â is simultaneously:',
  options: makeUniqueOptions(
    loc === 'el'
      ? 'Ύψος, διάμεσος και μεσοκάθετος της βάσης'
      : 'Altitude, median, and perpendicular bisector of the base',
    [
      loc === 'el' ? 'Μόνο ύψος' : 'Only altitude',
      loc === 'el' ? 'Μόνο διάμεσος' : 'Only median',
      loc === 'el' ? 'Καμία άλλη γραμμή' : 'No other line',
    ]
  ),
  correctAnswer:
    loc === 'el'
      ? 'Ύψος, διάμεσος και μεσοκάθετος της βάσης'
      : 'Altitude, median, and perpendicular bisector of the base',
  solution: `
    <div class="space-y-2 leading-loose">
      <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
        ${loc === 'el' ? 'Βασική Ιδιότητα Ισοσκελούς:' : 'Fundamental Isosceles Property:'}
      </div>
      <div>
        ${
          loc === 'el'
            ? 'Στο ισοσκελές τρίγωνο, η ευθεία που ξεκινά από την κορυφή Â ταυτίζει και τις τέσσερις έννοιες: διχοτόμος, διάμεσος, ύψος και μεσοκάθετος της βάσης ΒΓ.'
            : 'In an isosceles triangle, the line from vertex Â merges all four roles: bisector, median, altitude, and perpendicular bisector of base BC.'
        }
      </div>
    </div>
  `,
}));

// Θέση 10: Γωνία Ύψους/Διχοτόμου με Πλευρά (Input)
const POOL_10_HALF_VERTEX = Array.from({ length: 10 }, (_, i) => (loc) => {
  const vertex = 40 + i * 4; // 40, 44, 48, ...
  const half = vertex / 2;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ: ΥΨΟΣ & ΔΙΧΟΤΟΜΟΣ' : 'ISOSCELES: ALTITUDE & BISECTOR',
    question:
      loc === 'el'
        ? `Στο ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), η γωνία κορυφής είναι <strong>Â ＝ ${numFmt(vertex)}°</strong>. Φέρνουμε το ύψος ΑΔ. Πόσο είναι το μέτρο της γωνίας <strong>ΒÂΔ</strong> σε μοίρες;`
        : `In isosceles triangle ABC (AB ＝ AC), vertex angle <strong>Â ＝ ${numFmt(vertex)}°</strong>. Altitude AD is drawn. What is the measure of angle <strong>BÂD</strong> in degrees?`,
    correctAnswer: String(half),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="inline-flex flex-wrap items-center gap-1 max-w-full">
          <span>${
            loc === 'el'
              ? 'Επειδή το ύψος ΑΔ είναι και διχοτόμος της γωνίας κορυφής: ΒÂΔ ＝ '
              : 'Since altitude AD is also the bisector of the vertex angle: BÂD ＝ '
          }</span>
          ${fracHtml('Â', 2)}
          <span> ＝ </span>
          ${fracHtml(`${numFmt(vertex)}°`, 2)}
          <span> ＝ <strong>${numFmt(half)}°</strong>.</span>
        </div>
      </div>
    `,
  };
});

// Θέση 11: Ρεαλιστικό Πρόβλημα - Χωροθέτηση με Μεσοκάθετο (Input)
const POOL_11_REAL_MESOKATHETOS = Array.from({ length: 10 }, (_, i) => (loc) => {
  const totalKm = 10 + i * 2; // 10, 12, 14, ... km
  const halfKm = totalKm / 2;
  const pipeLen = halfKm + 4;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΣΟΚΑΘΕΤΟΣ' : 'PROBLEMS: PERPENDICULAR BISECTOR',
    question:
      loc === 'el'
        ? `Δύο χωριά Α και Β απέχουν <strong>${numFmt(totalKm)} km</strong> σε ευθεία γραμμή. Ένα αντλιοστάσιο νερού κατασκευάζεται πάνω στη μεσοκάθετο του τμήματος ΑΒ. Αν ο αγωγός που συνδέει το αντλιοστάσιο με το χωριό Α έχει μήκος <strong>${numFmt(pipeLen)} km</strong>, πόσα χιλιόμετρα αγωγού θα χρειαστούν για να συνδεθεί το αντλιοστάσιο με το χωριό Β;`
        : `Two villages A and B are <strong>${numFmt(totalKm)} km</strong> apart in a straight line. A water pumping station is built on the perpendicular bisector of segment AB. If the pipeline connecting the station to village A is <strong>${numFmt(pipeLen)} km</strong> long, how many kilometers of pipeline will be needed to connect it to village B?`,
    correctAnswer: String(pipeLen),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Ιδιότητα Ισαπόστασης Μεσοκαθέτου' : 'Equidistant Property of Perpendicular Bisector'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Επειδή το αντλιοστάσιο βρίσκεται πάνω στη μεσοκάθετο του τμήματος ΑΒ, ισαπέχει από τα δύο χωριά. Συνεπώς, η απόσταση μέχρι το χωριό Β είναι ακριβώς ίση: <strong>${numFmt(pipeLen)} km</strong>.`
              : `Since the pumping station lies on the perpendicular bisector of AB, it is equidistant from both villages. Thus, the pipeline to village B is exactly <strong>${numFmt(pipeLen)} km</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Θέση 12: Ρεαλιστικό Πρόβλημα - Περίμετρος Ισοσκελούς Τριγώνου (Input)
const POOL_12_REAL_ISOSCELES_PERIM = Array.from({ length: 10 }, (_, i) => (loc) => {
  const base = 10 + i;
  const side = 15 + i;
  const perim = 2 * side + base;
  const numFmt = (n) => Number(n).toLocaleString(loc === 'el' ? 'el-GR' : 'en-US');

  return {
    type: 'input',
    topic: loc === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΣΚΕΛΟΥΣ' : 'PROBLEMS: ISOSCELES PERIMETER',
    question:
      loc === 'el'
        ? `Ένα ισοσκελές τρίγωνο έχει βάση <strong>${numFmt(base)} cm</strong> και καθεμία από τις δύο ίσες πλευρές του είναι <strong>${numFmt(side)} cm</strong>. Πόσα εκατοστά (cm) είναι η <strong>περίμετρος</strong> του τριγώνου;`
        : `An isosceles triangle has a base of <strong>${numFmt(base)} cm</strong> and each of its two equal sides is <strong>${numFmt(side)} cm</strong>. What is the <strong>perimeter</strong> of the triangle in cm?`,
    correctAnswer: String(perim),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          ${loc === 'el' ? 'Π ＝ 2 · πλευρά ＋ βάση' : 'P ＝ 2 · side ＋ base'}
        </div>
        <div>
          ${
            loc === 'el'
              ? `Π ＝ 2 · ${numFmt(side)} ＋ ${numFmt(base)} ＝ ${numFmt(2 * side)} ＋ ${numFmt(base)} ＝ <strong>${numFmt(perim)} cm</strong>.`
              : `P ＝ 2 · ${numFmt(side)} ＋ ${numFmt(base)} ＝ ${numFmt(2 * side)} ＋ ${numFmt(base)} ＝ <strong>${numFmt(perim)} cm</strong>.`
          }
        </div>
      </div>
    `,
  };
});

// Συγκέντρωση των 12 Pools
const POOLS = [
  POOL_1_MESOKATHETOS_DEF,
  POOL_2_MESOKATHETOS_PROPERTY,
  POOL_3_POINT_TO_LINE,
  POOL_4_PARALLEL_DIST,
  POOL_5_BISECTOR_PROPERTY,
  POOL_6_ISOSCELES_BASE,
  POOL_7_ISOSCELES_VERTEX,
  POOL_8_EQUILATERAL_PROPERTIES,
  POOL_9_ISOSCELES_LINES,
  POOL_10_HALF_VERTEX,
  POOL_11_REAL_MESOKATHETOS,
  POOL_12_REAL_ISOSCELES_PERIM,
];

export default function MesokathetosAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = DICTIONARY[locale] || DICTIONARY.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 12 ασκήσεων (διατήρηση ακριβώς των 12 ερωτήσεων ανά σετ)
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
          href="/a-gymnasiou/37-mesokathetos"
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