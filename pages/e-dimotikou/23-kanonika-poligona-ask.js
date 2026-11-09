// pages/e-dimotikou/23-kanonika-poligona-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const dictionary = {
  el: {
    pageTitle: "Ασκήσεις: Κανονικά Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα κανονικά πολύγωνα: κεντρική και εσωτερική γωνία, περίμετρος, άξονες συμμετρίας και σύγκλιση στον κύκλο.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ασκήσεις: Κανονικά Πολύγωνα",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successText: "Επιτυχία:",
    bottomPromptText: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    centralAngleBadge: "ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ",
    findSidesFromAngleBadge: "ΕΥΡΕΣΗ ΠΛΕΥΡΩΝ ΑΠΟ ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ",
    interiorAngleBadge: "ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ",
    regularityCriteriaBadge: "ΚΡΙΤΗΡΙΑ ΚΑΝΟΝΙΚΟΤΗΤΑΣ ΠΟΛΥΓΩΝΟΥ",
    perimeterBadge: "ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ",
    findSideFromPerimeterBadge: "ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
    symmetryAxesBadge: "ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ",
    circleConvergenceBadge: "ΠΡΟΣΕΓΓΙΣΗ ΤΟΥ ΚΥΚΛΟΥ"
  },
  en: {
    pageTitle: "Exercises: Regular Polygons - Grade 5 | LearnMaths.gr",
    pageDesc: "Grade 5 math exercises on regular polygons: central and interior angles, perimeter, axes of symmetry, and convergence to a circle.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badge: "GRADE 5 • PRACTICE",
    mainTitle: "Exercises: Regular Polygons",
    mainSubtitle: "Each time you click \"New Exercises\", a fresh set of problems is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreText: "Score:",
    successText: "Success:",
    bottomPromptText: "Complete the exercises and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    centralAngleBadge: "CENTRAL ANGLE OF REGULAR POLYGON",
    findSidesFromAngleBadge: "FINDING SIDES FROM CENTRAL ANGLE",
    interiorAngleBadge: "INTERIOR ANGLE OF REGULAR POLYGON",
    regularityCriteriaBadge: "CRITERIA FOR REGULAR POLYGONS",
    perimeterBadge: "PERIMETER OF REGULAR POLYGON",
    findSideFromPerimeterBadge: "FINDING SIDE FROM PERIMETER",
    symmetryAxesBadge: "AXES OF SYMMETRY OF REGULAR POLYGON",
    circleConvergenceBadge: "APPROACHING THE CIRCLE"
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Κεντρική Γωνία & Εύρεση Πλευρών (Input)
function makeCentralAngleQuestion(isReverse = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isReverse) {
    const cases = isEl
      ? [
          { name: 'κανονικού εξαγώνου (6 πλευρές)', sides: 6, angle: 60 },
          { name: 'κανονικού οκταγώνου (8 πλευρές)', sides: 8, angle: 45 },
          { name: 'κανονικού πενταγώνου (5 πλευρές)', sides: 5, angle: 72 },
          { name: 'κανονικού δεκαγώνου (10 πλευρές)', sides: 10, angle: 36 },
          { name: 'τετραγώνου (4 πλευρές)', sides: 4, angle: 90 }
        ]
      : [
          { name: 'regular hexagon (6 sides)', sides: 6, angle: 60 },
          { name: 'regular octagon (8 sides)', sides: 8, angle: 45 },
          { name: 'regular pentagon (5 sides)', sides: 5, angle: 72 },
          { name: 'regular decagon (10 sides)', sides: 10, angle: 36 },
          { name: 'square (4 sides)', sides: 4, angle: 90 }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.angle,
      unit: isEl ? 'μοίρες ( ° )' : 'degrees ( ° )',
      prompt: isEl
        ? `Πόσες μοίρες ( ° ) είναι η ΚΕΝΤΡΙΚΗ γωνία ενός ${c.name};`
        : `How many degrees ( ° ) is the CENTRAL angle of a ${c.name}?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Η κεντρική γωνία κάθε κανονικού πολυγώνου με ν πλευρές προκύπτει διαιρώντας τον πλήρη κύκλο των 360° με το ν:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">360°</span>
              <span className="pt-0.5">{c.sides}</span>
            </span>
            <span>＝ {c.angle}°.</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>The central angle of any regular polygon with n sides is found by dividing the full circle of 360° by n:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">360°</span>
              <span className="pt-0.5">{c.sides}</span>
            </span>
            <span>＝ {c.angle}°.</span>
          </span>
        </span>
      )
    };
  } else {
    const cases = isEl
      ? [
          { angle: 60, sides: 6, name: 'εξάγωνο' },
          { angle: 45, sides: 8, name: 'οκτάγωνο' },
          { angle: 72, sides: 5, name: 'πεντάγωνο' },
          { angle: 36, sides: 10, name: 'δεκάγωνο' },
          { angle: 30, sides: 12, name: 'δωδεκάγωνο' }
        ]
      : [
          { angle: 60, sides: 6, name: 'hexagon' },
          { angle: 45, sides: 8, name: 'octagon' },
          { angle: 72, sides: 5, name: 'pentagon' },
          { angle: 36, sides: 10, name: 'decagon' },
          { angle: 30, sides: 12, name: 'dodecagon' }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.sides,
      unit: isEl ? 'πλευρές' : 'sides',
      prompt: isEl
        ? `Η κεντρική γωνία ενός κανονικού πολυγώνου είναι ${c.angle}°. Πόσες πλευρές έχει το πολύγωνο αυτό;`
        : `The central angle of a regular polygon is ${c.angle}°. How many sides does this polygon have?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Διαιρούμε τις 360° με το μέτρο της κεντρικής γωνίας:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">360°</span>
              <span className="pt-0.5">{c.angle}°</span>
            </span>
            <span>＝ {c.sides} πλευρές (κανονικό {c.name}).</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>We divide 360° by the measurement of the central angle:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">360°</span>
              <span className="pt-0.5">{c.angle}°</span>
            </span>
            <span>＝ {c.sides} sides (regular {c.name}).</span>
          </span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Εσωτερικές Γωνίες & Κριτήρια Κανονικότητας (MCQ)
function makeInteriorAnglesQuestion(isCriteria = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isCriteria) {
    const cases = isEl
      ? [
          {
            poly: 'κανονικού εξαγώνου',
            correct: '120°',
            distractors: ['60°', '90°', '108°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>Στο κανονικό εξάγωνο κάθε εσωτερική γωνία υπολογίζεται από:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">(6 － 2) · 180°</span>
                    <span className="pt-0.5">6</span>
                  </span>
                  <span>＝</span>
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">720°</span>
                    <span className="pt-0.5">6</span>
                  </span>
                  <span>＝ 120°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'κανονικού πενταγώνου',
            correct: '108°',
            distractors: ['72°', '90°', '120°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>Στο κανονικό πεντάγωνο κάθε εσωτερική γωνία υπολογίζεται από:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">(5 － 2) · 180°</span>
                    <span className="pt-0.5">5</span>
                  </span>
                  <span>＝</span>
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">540°</span>
                    <span className="pt-0.5">5</span>
                  </span>
                  <span>＝ 108°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'ισόπλευρου τριγώνου',
            correct: '60°',
            distractors: ['45°', '90°', '120°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>Στο ισόπλευρο τρίγωνο και οι τρεις γωνίες είναι ίσες με:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">180°</span>
                    <span className="pt-0.5">3</span>
                  </span>
                  <span>＝ 60°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'τετραγώνου',
            correct: '90°',
            distractors: ['60°', '120°', '180°'],
            expl: <span>Στο τετράγωνο και οι τέσσερις γωνίες είναι ορθές (90°).</span>
          }
        ]
      : [
          {
            poly: 'regular hexagon',
            correct: '120°',
            distractors: ['60°', '90°', '108°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>In a regular hexagon, each interior angle is calculated as:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">(6 － 2) · 180°</span>
                    <span className="pt-0.5">6</span>
                  </span>
                  <span>＝</span>
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">720°</span>
                    <span className="pt-0.5">6</span>
                  </span>
                  <span>＝ 120°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'regular pentagon',
            correct: '108°',
            distractors: ['72°', '90°', '120°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>In a regular pentagon, each interior angle is calculated as:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">(5 － 2) · 180°</span>
                    <span className="pt-0.5">5</span>
                  </span>
                  <span>＝</span>
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">540°</span>
                    <span className="pt-0.5">5</span>
                  </span>
                  <span>＝ 108°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'equilateral triangle',
            correct: '60°',
            distractors: ['45°', '90°', '120°'],
            expl: (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span>In an equilateral triangle, all three angles are equal:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold">
                  <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
                    <span className="border-b border-slate-700 w-full text-center pb-0.5">180°</span>
                    <span className="pt-0.5">3</span>
                  </span>
                  <span>＝ 60°.</span>
                </span>
              </span>
            )
          },
          {
            poly: 'square',
            correct: '90°',
            distractors: ['60°', '120°', '180°'],
            expl: <span>In a square, all four angles are right angles (90°).</span>
          }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];
    const rawOptions = [c.correct, ...c.distractors];

    return {
      type: 'mcq',
      correct: c.correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Πόσες μοίρες είναι καθεμία από τις εσωτερικές γωνίες ενός ${c.poly};`
        : `How many degrees is each of the interior angles of a ${c.poly}?`,
      explanation: c.expl
    };
  } else {
    const rawOptions = isEl
      ? [
          'Επειδή, παρότι έχει όλες τις πλευρές ίσες, δεν έχει όλες τις γωνίες του ίσες',
          'Επειδή έχει 4 πλευρές αντί για 6',
          'Επειδή δεν έχει διαγωνίους',
          'Επειδή οι πλευρές του δεν είναι ευθύγραμμα τμήματα'
        ]
      : [
          'Because although all its sides are equal, its angles are not all equal',
          'Because it has 4 sides instead of 6',
          'Because it has no diagonals',
          'Because its sides are not straight line segments'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Ένας ρόμβος έχει και τις τέσσερις πλευρές του ίσες. Γιατί ΔΕΝ είναι υποχρεωτικά κανονικό πολύγωνο;'
        : 'A rhombus has all four of its sides equal. Why is it NOT necessarily a regular polygon?',
      explanation: isEl
        ? 'Για να είναι ένα πολύγωνο κανονικό πρέπει να είναι ΚΑΙ ισόπλευρο ΚΑΙ ισογώνιο. Ο ρόμβος έχει ίσες πλευρές, αλλά οι απέναντι γωνίες του είναι οξείες και αμβλείες (δεν είναι όλες ίσες με 90° εκτός αν είναι τετράγωνο).'
        : 'To be a regular polygon, it must be BOTH equilateral AND equiangular. A rhombus has equal sides, but its opposite angles are acute and obtuse (they are not all 90° unless it is a square).'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Περίμετρος & Ανάστροφοι Υπολογισμοί (Input & MCQ)
function makePerimeterAndSideQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isMCQ) {
    const polygonTypes = isEl
      ? [
          { name: 'κανονικού δεκαγώνου (10 πλευρές)', sides: 10, side: 6 },
          { name: 'κανονικού εξαγώνου (6 πλευρές)', sides: 6, side: 14 },
          { name: 'κανονικού οκταγώνου (8 πλευρές)', sides: 8, side: 12 },
          { name: 'κανονικού πενταγώνου (5 πλευρές)', sides: 5, side: 18 }
        ]
      : [
          { name: 'regular decagon (10 sides)', sides: 10, side: 6 },
          { name: 'regular hexagon (6 sides)', sides: 6, side: 14 },
          { name: 'regular octagon (8 sides)', sides: 8, side: 12 },
          { name: 'regular pentagon (5 sides)', sides: 5, side: 18 }
        ];

    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const perimeter = poly.sides * poly.side;

    return {
      type: 'input',
      correct: perimeter,
      unit: isEl ? 'cm (περίμετρος)' : 'cm (perimeter)',
      prompt: isEl
        ? `Κάθε πλευρά ενός ${poly.name} έχει μήκος ${poly.side.toLocaleString(numLoc)} cm. Πόσα cm είναι η περίμετρός του;`
        : `Each side of a ${poly.name} has a length of ${poly.side.toLocaleString(numLoc)} cm. How many cm is its perimeter?`,
      explanation: isEl ? (
        <span>
          Σε κάθε κανονικό πολύγωνο με ν πλευρές: Περίμετρος ＝ ν · πλευρά. Άρα: {poly.sides} · {poly.side.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} cm.
        </span>
      ) : (
        <span>
          In every regular polygon with n sides: Perimeter ＝ n · side. Thus: {poly.sides} · {poly.side.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} cm.
        </span>
      )
    };
  } else {
    const cases = isEl
      ? [
          { name: 'κανονικού οκταγώνου', sides: 8, side: 9, perimeter: 72 },
          { name: 'κανονικού εξαγώνου', sides: 6, side: 15, perimeter: 90 },
          { name: 'κανονικού πενταγώνου', sides: 5, side: 16, perimeter: 80 },
          { name: 'κανονικού δεκαγώνου', sides: 10, side: 12, perimeter: 120 }
        ]
      : [
          { name: 'regular octagon', sides: 8, side: 9, perimeter: 72 },
          { name: 'regular hexagon', sides: 6, side: 15, perimeter: 90 },
          { name: 'regular pentagon', sides: 5, side: 16, perimeter: 80 },
          { name: 'regular decagon', sides: 10, side: 12, perimeter: 120 }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.side + 3, Math.max(2, c.side - 3), c.side * 2];
    const rawOptions = [`${c.side} cm`, ...distractors.map((v) => `${v} cm`)];

    return {
      type: 'mcq',
      correct: `${c.side} cm`,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Η περίμετρος ενός ${c.name} είναι ${c.perimeter.toLocaleString(numLoc)} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`
        : `The perimeter of a ${c.name} is ${c.perimeter.toLocaleString(numLoc)} cm. How many cm is the length of each side?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Διαιρούμε την περίμετρο με το πλήθος των πλευρών:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{c.perimeter.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{c.sides}</span>
            </span>
            <span>＝ {c.side.toLocaleString(numLoc)} cm.</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>We divide the perimeter by the number of sides:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{c.perimeter.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{c.sides}</span>
            </span>
            <span>＝ {c.side.toLocaleString(numLoc)} cm.</span>
          </span>
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Άξονες Συμμετρίας & Προσέγγιση Κύκλου (Input & MCQ)
function makeSymmetryAndCircleConvergenceQuestion(isCircleQuestion = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isCircleQuestion) {
    const sidesList = [6, 8, 10, 12, 16];
    const n = sidesList[getRandomInt(0, sidesList.length - 1)];

    return {
      type: 'input',
      correct: n,
      unit: isEl ? 'άξονες συμμετρίας' : 'axes of symmetry',
      prompt: isEl
        ? `Πόσους άξονες συμμετρίας έχει συνολικά ένα κανονικό πολύγωνο με ${n} πλευρές;`
        : `How many axes of symmetry does a regular polygon with ${n} sides have in total?`,
      explanation: isEl
        ? `Σε ΚΑΘΕ κανονικό πολύγωνο, το πλήθος των αξόνων συμμετρίας ισούται ακριβώς με τον αριθμό των πλευρών του. Άρα έχει ακριβώς ${n} άξονες συμμετρίας.`
        : `In EVERY regular polygon, the number of axes of symmetry strictly equals the number of its sides. Therefore, it has exactly ${n} axes of symmetry.`
    };
  } else {
    const rawOptions = isEl
      ? [
          'Το πολύγωνο αρχίζει να μοιάζει ολοένα και περισσότερο με κύκλο',
          'Το πολύγωνο μετατρέπεται σε τρίγωνο',
          'Η περίμετρός του μηδενίζεται',
          'Οι γωνίες του γίνονται όλες ίσες με 90°'
        ]
      : [
          'The polygon begins to resemble a circle more and more closely',
          'The polygon transforms into a triangle',
          'Its perimeter becomes zero',
          'Its angles all become equal to 90°'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Τι συμβαίνει στο σχήμα ενός κανονικού πολυγώνου καθώς αυξάνουμε διαρκώς τον αριθμό των πλευρών του (π.χ. 20, 50, 100 πλευρές);'
        : 'What happens to the shape of a regular polygon as we continuously increase its number of sides (e.g. 20, 50, 100 sides)?',
      explanation: isEl
        ? 'Καθώς αυξάνεται ο αριθμός των πλευρών σε ένα κανονικό πολύγωνο, οι γωνίες ανοίγουν, οι πλευρές μικραίνουν και το περίγραμμα προσεγγίζει σχεδόν τέλεια έναν κύκλο!'
        : 'As the number of sides in a regular polygon increases, the angles widen, the side lengths shrink, and the boundary almost perfectly approaches a circle!'
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeCentralAngleQuestion(false, locale),
    q2: makeCentralAngleQuestion(true, locale),
    q3: makeInteriorAnglesQuestion(false, locale),
    q4: makeInteriorAnglesQuestion(true, locale),
    q5: makePerimeterAndSideQuestion(false, locale),
    q6: makePerimeterAndSideQuestion(true, locale),
    q7: makeSymmetryAndCircleConvergenceQuestion(false, locale),
    q8: makeSymmetryAndCircleConvergenceQuestion(true, locale)
  };
}

export default function KanonikaPoligonaAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = '';
    if (locale === 'el') {
      clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = clean.split(',');
      if (parts.length > 2) {
        clean = parts[0] + ',' + parts.slice(1).join('');
      }
    } else {
      clean = rawVal.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',' || val === '.') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) <= 0.05) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) <= 0.05) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) <= 0.05) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) <= 0.05) currentScore += 1;
    // q8
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Question
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0 mt-0.5"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Input Question
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) <= 0.05;
    const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleStrictNumberInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct.toLocaleString(numLoc)} {qData.unit}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/23-kanonika-poligona"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {t.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.centralAngleBadge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.findSidesFromAngleBadge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.interiorAngleBadge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.regularityCriteriaBadge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.perimeterBadge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.findSideFromPerimeterBadge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.symmetryAxesBadge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.circleConvergenceBadge, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (SCORE BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successText} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.bottomPromptText}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}